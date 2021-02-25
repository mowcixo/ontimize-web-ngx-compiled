import { DataSource } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColumnValueFilterOperator } from '../../../types/o-column-value-filter.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
export const SCROLLVIRTUAL = 'scroll';
export class OTableScrollEvent {
    constructor(data) {
        this.data = data;
        this.type = SCROLLVIRTUAL;
    }
}
export class DefaultOTableDataSource extends DataSource {
    constructor(table) {
        super();
        this.table = table;
        this.dataTotalsChange = new BehaviorSubject([]);
        this._quickFilterChange = new BehaviorSubject('');
        this._columnValueFilterChange = new Subject();
        this._loadDataScrollableChange = new BehaviorSubject(new OTableScrollEvent(1));
        this.filteredData = [];
        this.aggregateData = {};
        this.onRenderedDataChange = new EventEmitter();
        this._renderedData = [];
        this.resultsLength = 0;
        this.columnValueFilters = [];
        this._database = table.daoTable;
        if (this._database) {
            this.resultsLength = this._database.data.length;
        }
        if (table.paginator) {
            this._paginator = table.matpaginator;
        }
        this._tableOptions = table.oTableOptions;
        this._sort = table.sort;
    }
    get data() { return this.dataTotalsChange.value; }
    get loadDataScrollable() { return this._loadDataScrollableChange.getValue().data || 1; }
    set loadDataScrollable(page) {
        this._loadDataScrollableChange.next(new OTableScrollEvent(page));
    }
    get quickFilter() { return this._quickFilterChange.value || ''; }
    set quickFilter(filter) {
        this._quickFilterChange.next(filter);
    }
    sortFunction(a, b) {
        return this._sort.sortFunction(a, b);
    }
    get renderedData() {
        return this._renderedData;
    }
    set renderedData(arg) {
        this._renderedData = arg;
        this.onRenderedDataChange.emit();
    }
    connect() {
        const displayDataChanges = [
            this._database.dataChange
        ];
        if (!this.table.pageable) {
            if (this._sort) {
                displayDataChanges.push(this._sort.oSortChange);
            }
            if (this._tableOptions.filter) {
                displayDataChanges.push(this._quickFilterChange);
            }
            if (this._paginator) {
                displayDataChanges.push(this._paginator.page);
            }
            else {
                displayDataChanges.push(this._loadDataScrollableChange);
            }
        }
        if (this.table.oTableColumnsFilterComponent) {
            displayDataChanges.push(this._columnValueFilterChange);
        }
        return merge(...displayDataChanges).pipe(map((x) => {
            let data = Object.assign([], this._database.data);
            if (x instanceof OTableScrollEvent) {
                this.renderedData = data.slice(0, (x.data * Codes.LIMIT_SCROLLVIRTUAL) - 1);
            }
            else {
                if (this.existsAnyCalculatedColumn()) {
                    data = this.getColumnCalculatedData(data);
                }
                if (!this.table.pageable) {
                    data = this.getColumnValueFilterData(data);
                    data = this.getQuickFilterData(data);
                    data = this.getSortedData(data);
                }
                this.filteredData = Object.assign([], data);
                if (this.table.pageable) {
                    const totalRecordsNumber = this.table.getTotalRecordsNumber();
                    this.resultsLength = totalRecordsNumber !== undefined ? totalRecordsNumber : data.length;
                }
                else {
                    this.resultsLength = data.length;
                    data = this.getPaginationData(data);
                }
                if (!this.table.pageable && !this.table.paginationControls && data.length > Codes.LIMIT_SCROLLVIRTUAL) {
                    const datapaginate = data.slice(0, (this.table.pageScrollVirtual * Codes.LIMIT_SCROLLVIRTUAL) - 1);
                    data = datapaginate;
                }
                this.renderedData = data;
                this.aggregateData = this.getAggregatesData(data);
            }
            return this.renderedData;
        }));
    }
    getAggregatesData(data) {
        const self = this;
        const obj = {};
        if (typeof this._tableOptions === 'undefined') {
            return obj;
        }
        this._tableOptions.columns.forEach((column) => {
            let totalValue = '';
            if (column.aggregate && column.visible) {
                totalValue = self.calculateAggregate(data, column);
            }
            const key = column.attr;
            obj[key] = totalValue;
        });
        return obj;
    }
    getColumnCalculatedData(data) {
        const self = this;
        const calculatedCols = this._tableOptions.columns.filter((oCol) => oCol.visible && oCol.calculate !== undefined);
        return data.map((row) => {
            calculatedCols.forEach((oColumn) => {
                let value;
                if (typeof oColumn.calculate === 'string') {
                    value = self.transformFormula(oColumn.calculate, row);
                }
                else if (typeof oColumn.calculate === 'function') {
                    value = oColumn.calculate(row);
                }
                row[oColumn.attr] = isNaN(value) ? 0 : value;
            });
            return row;
        });
    }
    transformFormula(formulaArg, row) {
        let formula = formulaArg;
        const columnsAttr = this._tableOptions.columns.map((oCol) => oCol.attr);
        columnsAttr.forEach((column) => {
            formula = formula.replace(column, row[column]);
        });
        let resultFormula = '';
        try {
            resultFormula = (new Function('return ' + formula))();
        }
        catch (e) {
            console.error('Operation defined in the calculated column is incorrect ');
        }
        return resultFormula;
    }
    getQuickFilterData(data) {
        let filterData = this.quickFilter;
        if (filterData !== undefined && filterData.length > 0) {
            if (!this._tableOptions.filterCaseSensitive) {
                filterData = filterData.toLowerCase();
            }
            return data.filter((item) => {
                const passCustomFilter = this.fulfillsCustomFilterFunctions(filterData, item);
                const passSearchString = this.fulfillsQuickfilter(filterData, item);
                return passCustomFilter || passSearchString;
            });
        }
        else {
            return data;
        }
    }
    getPaginationData(data) {
        if (!this._paginator || isNaN(this._paginator.pageSize)) {
            return data;
        }
        let startIndex = isNaN(this._paginator.pageSize) ? 0 : this._paginator.pageIndex * this._paginator.pageSize;
        if (data.length > 0 && data.length < startIndex) {
            startIndex = 0;
            this._paginator.pageIndex = 0;
        }
        return data.splice(startIndex, this._paginator.pageSize);
    }
    disconnect() {
        this.onRenderedDataChange.complete();
        this.dataTotalsChange.complete();
        this._quickFilterChange.complete();
        this._columnValueFilterChange.complete();
        this._loadDataScrollableChange.complete();
    }
    fulfillsCustomFilterFunctions(filter, item) {
        const customFilterCols = this.table.oTableOptions.columns.filter(oCol => oCol.useCustomFilterFunction());
        return customFilterCols.some(oCol => oCol.renderer.filterFunction(item[oCol.attr], item, filter));
    }
    fulfillsQuickfilter(filter, item) {
        const columns = this._tableOptions.columns.filter((oCol) => oCol.useQuickfilterFunction());
        let searchStr = columns.map((oCol) => oCol.getFilterValue(item[oCol.attr], item).join(' ')).join(' ');
        if (!this._tableOptions.filterCaseSensitive) {
            searchStr = searchStr.toLowerCase();
        }
        return searchStr.indexOf(filter) !== -1;
    }
    getSortedData(data) {
        return this._sort.getSortedData(data);
    }
    getTableData() {
        return this._database.data;
    }
    getCurrentData() {
        return this.getData();
    }
    getCurrentAllData() {
        return this.getAllData(false, false);
    }
    getCurrentRendererData() {
        return this.getRenderedData(this.renderedData);
    }
    getAllRendererData() {
        return this.getAllData(true, true);
    }
    get sqlTypes() {
        return this._database.sqlTypes;
    }
    getData() {
        return this.renderedData;
    }
    getRenderedData(data) {
        const visibleColumns = this._tableOptions.columns.filter(oCol => oCol.visible);
        return data.map((row) => {
            const obj = {};
            visibleColumns.forEach((oCol) => {
                const useRenderer = oCol.renderer && oCol.renderer.getCellData;
                obj[oCol.attr] = useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
            });
            return obj;
        });
    }
    getAllData(usingRendererers, onlyVisibleColumns) {
        let tableColumns = this._tableOptions.columns;
        if (onlyVisibleColumns) {
            tableColumns = this._tableOptions.columns.filter(oCol => oCol.visible);
        }
        return this.filteredData.map((row) => {
            const obj = {};
            tableColumns.forEach((oCol) => {
                const useRenderer = usingRendererers && oCol.renderer && oCol.renderer.getCellData;
                obj[oCol.attr] = useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
            });
            return obj;
        });
    }
    getRenderersData(data, tableColumns) {
        return data.map((row) => {
            const obj = Object.assign({}, row);
            tableColumns.forEach((oCol) => {
                obj[oCol.attr] = oCol.renderer.getCellData(row[oCol.attr], row);
            });
            return obj;
        });
    }
    getColumnData(ocolumn) {
        return this.renderedData.map((row) => {
            const obj = {};
            if (ocolumn) {
                obj[ocolumn] = row[ocolumn];
            }
            return obj;
        });
    }
    initializeColumnsFilters(filters) {
        this.columnValueFilters = [];
        filters.forEach(filter => {
            this.columnValueFilters.push(filter);
        });
        if (!this.table.pageable) {
            this._columnValueFilterChange.next();
        }
    }
    isColumnValueFilterActive() {
        return this.columnValueFilters.length !== 0;
    }
    getColumnValueFilters() {
        return this.columnValueFilters;
    }
    getColumnValueFilterByAttr(attr) {
        return this.columnValueFilters.filter(item => item.attr === attr)[0];
    }
    clearColumnFilters(trigger = true) {
        this.columnValueFilters = [];
        if (trigger) {
            this._columnValueFilterChange.next();
        }
    }
    addColumnFilter(filter) {
        const existingFilter = this.getColumnValueFilterByAttr(filter.attr);
        if (existingFilter) {
            const idx = this.columnValueFilters.indexOf(existingFilter);
            this.columnValueFilters.splice(idx, 1);
        }
        if ((ColumnValueFilterOperator.IN === filter.operator && filter.values.length > 0) ||
            (ColumnValueFilterOperator.EQUAL === filter.operator && filter.values) ||
            (ColumnValueFilterOperator.BETWEEN === filter.operator && filter.values.length === 2) ||
            ((ColumnValueFilterOperator.LESS_EQUAL === filter.operator || ColumnValueFilterOperator.MORE_EQUAL === filter.operator) && filter.values)) {
            this.columnValueFilters.push(filter);
        }
        if (!this.table.pageable) {
            this._columnValueFilterChange.next();
        }
    }
    getColumnValueFilterData(data) {
        this.columnValueFilters.forEach(filter => {
            const filterColumn = this.table.oTableOptions.columns.find(col => col.attr === filter.attr);
            if (filterColumn) {
                switch (filter.operator) {
                    case ColumnValueFilterOperator.IN:
                        data = data.filter((item) => {
                            if (filterColumn.renderer && filterColumn.renderer.filterFunction) {
                                return filterColumn.renderer.filterFunction(item[filter.attr], item);
                            }
                            else {
                                const colValues = filterColumn.getFilterValue(item[filter.attr], item).map(f => Util.normalizeString(f));
                                const filterValues = filter.values.map(f => Util.normalizeString(f));
                                return filterValues.some(value => colValues.indexOf(value) !== -1);
                            }
                        });
                        break;
                    case ColumnValueFilterOperator.EQUAL:
                        const normalizedValue = Util.normalizeString(filter.values);
                        data = data.filter(item => {
                            const colValues = filterColumn.getFilterValue(item[filter.attr], item).map(f => Util.normalizeString(f));
                            let regExp;
                            if (normalizedValue.includes('*')) {
                                regExp = new RegExp('^' + normalizedValue.split('*').join('.*') + '$');
                            }
                            return colValues.some(colValue => regExp ? regExp.test(colValue) : colValue.includes(normalizedValue));
                        });
                        break;
                    case ColumnValueFilterOperator.BETWEEN:
                        data = data.filter(item => item[filter.attr] >= filter.values[0] && item[filter.attr] <= filter.values[1]);
                        break;
                    case ColumnValueFilterOperator.MORE_EQUAL:
                        data = data.filter(item => item[filter.attr] >= filter.values);
                        break;
                    case ColumnValueFilterOperator.LESS_EQUAL:
                        data = data.filter(item => item[filter.attr] <= filter.values);
                        break;
                }
            }
        });
        return data;
    }
    getAggregateData(column) {
        const obj = {};
        let totalValue = '';
        if (typeof this._tableOptions === 'undefined') {
            return new Array(obj);
        }
        totalValue = this.aggregateData[column.attr];
        return totalValue;
    }
    calculateAggregate(data, column) {
        let resultAggregate;
        const operator = column.aggregate.operator;
        if (typeof operator === 'string') {
            switch (operator.toLowerCase()) {
                case 'count':
                    resultAggregate = this.count(column.attr, data);
                    break;
                case 'min':
                    resultAggregate = this.min(column.attr, data);
                    break;
                case 'max':
                    resultAggregate = this.max(column.attr, data);
                    break;
                case 'avg':
                    resultAggregate = this.avg(column.attr, data);
                    break;
                default:
                    resultAggregate = this.sum(column.attr, data);
                    break;
            }
        }
        else {
            const columnData = this.getColumnData(column.attr);
            if (typeof operator === 'function') {
                resultAggregate = operator(columnData);
            }
        }
        return resultAggregate;
    }
    sum(column, data) {
        let value = 0;
        if (data) {
            value = data.reduce((acumulator, currentValue) => {
                return acumulator + (isNaN(currentValue[column]) ? 0 : currentValue[column]);
            }, value);
        }
        return value;
    }
    count(column, data) {
        let value = 0;
        if (data) {
            value = data.reduce((acumulator, currentValue, currentIndex) => {
                return acumulator + 1;
            }, 0);
        }
        return value;
    }
    avg(column, data) {
        return this.sum(column, data) / this.count(column, data);
    }
    min(column, data) {
        const tempMin = data.map(x => x[column]);
        return Math.min(...tempMin);
    }
    max(column, data) {
        const tempMin = data.map(x => x[column]);
        return Math.max(...tempMin);
    }
    existsAnyCalculatedColumn() {
        return this._tableOptions.columns.find((oCol) => oCol.calculate !== undefined) !== undefined;
    }
    updateRenderedRowData(rowData) {
        const tableKeys = this.table.getKeys();
        const record = this.renderedData.find((data) => {
            let found = true;
            for (let i = 0, len = tableKeys.length; i < len; i++) {
                const key = tableKeys[i];
                if (data[key] !== rowData[key]) {
                    found = false;
                    break;
                }
            }
            return found;
        });
        if (Util.isDefined(record)) {
            Object.assign(record, rowData);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1vLXRhYmxlLmRhdGFzb3VyY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kZWZhdWx0LW8tdGFibGUuZGF0YXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbkUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXJDLE9BQU8sRUFBRSx5QkFBeUIsRUFBc0IsTUFBTSwyQ0FBMkMsQ0FBQztBQUMxRyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBTTFDLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUM7QUFPdEMsTUFBTSxPQUFPLGlCQUFpQjtJQUk1QixZQUFZLElBQVk7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLHVCQUF3QixTQUFRLFVBQWU7SUFrQzFELFlBQXNCLEtBQXNCO1FBQzFDLEtBQUssRUFBRSxDQUFDO1FBRFksVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFqQzVDLHFCQUFnQixHQUFHLElBQUksZUFBZSxDQUFRLEVBQUUsQ0FBQyxDQUFDO1FBUXhDLHVCQUFrQixHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLDZCQUF3QixHQUFHLElBQUksT0FBTyxF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LEdBQUcsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDOUIsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDZCxNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YVNvdXJjZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFBhZ2luYXRvciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgT1RhYmxlRGF0YVNvdXJjZSB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1kYXRhc291cmNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IsIE9Db2x1bW5WYWx1ZUZpbHRlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLXZhbHVlLWZpbHRlci50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRGFvIH0gZnJvbSAnLi9vLXRhYmxlLmRhbyc7XG5pbXBvcnQgeyBPTWF0U29ydCB9IGZyb20gJy4vc29ydC9vLW1hdC1zb3J0JztcblxuZXhwb3J0IGNvbnN0IFNDUk9MTFZJUlRVQUwgPSAnc2Nyb2xsJztcblxuZXhwb3J0IGludGVyZmFjZSBJVGFibGVPU2Nyb2xsRXZlbnQge1xuICB0eXBlOiBzdHJpbmc7XG4gIGRhdGE6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE9UYWJsZVNjcm9sbEV2ZW50IGltcGxlbWVudHMgSVRhYmxlT1Njcm9sbEV2ZW50IHtcbiAgcHVibGljIGRhdGE6IG51bWJlcjtcbiAgcHVibGljIHR5cGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBudW1iZXIpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMudHlwZSA9IFNDUk9MTFZJUlRVQUw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlZmF1bHRPVGFibGVEYXRhU291cmNlIGV4dGVuZHMgRGF0YVNvdXJjZTxhbnk+IGltcGxlbWVudHMgT1RhYmxlRGF0YVNvdXJjZSB7XG4gIGRhdGFUb3RhbHNDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueVtdPihbXSk7XG4gIGdldCBkYXRhKCk6IGFueVtdIHsgcmV0dXJuIHRoaXMuZGF0YVRvdGFsc0NoYW5nZS52YWx1ZTsgfVxuXG4gIHByb3RlY3RlZCBfZGF0YWJhc2U6IE9UYWJsZURhbztcbiAgcHJvdGVjdGVkIF9wYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcbiAgcHJvdGVjdGVkIF90YWJsZU9wdGlvbnM6IE9UYWJsZU9wdGlvbnM7XG4gIHByb3RlY3RlZCBfc29ydDogT01hdFNvcnQ7XG5cbiAgcHJvdGVjdGVkIF9xdWlja0ZpbHRlckNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3QoJycpO1xuICBwcm90ZWN0ZWQgX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlID0gbmV3IFN1YmplY3QoKTtcbiAgcHJvdGVjdGVkIF9sb2FkRGF0YVNjcm9sbGFibGVDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE9UYWJsZVNjcm9sbEV2ZW50PihuZXcgT1RhYmxlU2Nyb2xsRXZlbnQoMSkpO1xuXG4gIHByb3RlY3RlZCBmaWx0ZXJlZERhdGE6IGFueVtdID0gW107XG4gIHByb3RlY3RlZCBhZ2dyZWdhdGVEYXRhOiBhbnkgPSB7fTtcblxuICBvblJlbmRlcmVkRGF0YUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvLyBsb2FkIGRhdGEgaW4gc2Nyb2xsXG4gIGdldCBsb2FkRGF0YVNjcm9sbGFibGUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xvYWREYXRhU2Nyb2xsYWJsZUNoYW5nZS5nZXRWYWx1ZSgpLmRhdGEgfHwgMTsgfVxuICBzZXQgbG9hZERhdGFTY3JvbGxhYmxlKHBhZ2U6IG51bWJlcikge1xuICAgIHRoaXMuX2xvYWREYXRhU2Nyb2xsYWJsZUNoYW5nZS5uZXh0KG5ldyBPVGFibGVTY3JvbGxFdmVudChwYWdlKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3JlbmRlcmVkRGF0YTogYW55W10gPSBbXTtcbiAgcmVzdWx0c0xlbmd0aDogbnVtYmVyID0gMDtcblxuICBnZXQgcXVpY2tGaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3F1aWNrRmlsdGVyQ2hhbmdlLnZhbHVlIHx8ICcnOyB9XG4gIHNldCBxdWlja0ZpbHRlcihmaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyQ2hhbmdlLm5leHQoZmlsdGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgY29sdW1uVmFsdWVGaWx0ZXJzOiBBcnJheTxPQ29sdW1uVmFsdWVGaWx0ZXI+ID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RhdGFiYXNlID0gdGFibGUuZGFvVGFibGU7XG4gICAgaWYgKHRoaXMuX2RhdGFiYXNlKSB7XG4gICAgICB0aGlzLnJlc3VsdHNMZW5ndGggPSB0aGlzLl9kYXRhYmFzZS5kYXRhLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKHRhYmxlLnBhZ2luYXRvcikge1xuICAgICAgdGhpcy5fcGFnaW5hdG9yID0gdGFibGUubWF0cGFnaW5hdG9yO1xuICAgIH1cbiAgICB0aGlzLl90YWJsZU9wdGlvbnMgPSB0YWJsZS5vVGFibGVPcHRpb25zO1xuICAgIHRoaXMuX3NvcnQgPSB0YWJsZS5zb3J0O1xuICB9XG5cbiAgc29ydEZ1bmN0aW9uKGE6IGFueSwgYjogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5zb3J0RnVuY3Rpb24oYSwgYik7XG4gIH1cblxuICBnZXQgcmVuZGVyZWREYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyZWREYXRhO1xuICB9XG5cbiAgc2V0IHJlbmRlcmVkRGF0YShhcmc6IGFueVtdKSB7XG4gICAgdGhpcy5fcmVuZGVyZWREYXRhID0gYXJnO1xuICAgIHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgZnVuY3Rpb24gY2FsbGVkIGJ5IHRoZSB0YWJsZSB0byByZXRyaWV2ZSBvbmUgc3RyZWFtIGNvbnRhaW5pbmcgdGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKi9cbiAgY29ubmVjdCgpOiBPYnNlcnZhYmxlPGFueVtdPiB7XG4gICAgY29uc3QgZGlzcGxheURhdGFDaGFuZ2VzOiBhbnlbXSA9IFtcbiAgICAgIHRoaXMuX2RhdGFiYXNlLmRhdGFDaGFuZ2VcbiAgICBdO1xuXG4gICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG5cbiAgICAgIGlmICh0aGlzLl9zb3J0KSB7XG4gICAgICAgIGRpc3BsYXlEYXRhQ2hhbmdlcy5wdXNoKHRoaXMuX3NvcnQub1NvcnRDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fdGFibGVPcHRpb25zLmZpbHRlcikge1xuICAgICAgICBkaXNwbGF5RGF0YUNoYW5nZXMucHVzaCh0aGlzLl9xdWlja0ZpbHRlckNoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9wYWdpbmF0b3IpIHtcbiAgICAgICAgZGlzcGxheURhdGFDaGFuZ2VzLnB1c2godGhpcy5fcGFnaW5hdG9yLnBhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheURhdGFDaGFuZ2VzLnB1c2godGhpcy5fbG9hZERhdGFTY3JvbGxhYmxlQ2hhbmdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy50YWJsZS5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICBkaXNwbGF5RGF0YUNoYW5nZXMucHVzaCh0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlKC4uLmRpc3BsYXlEYXRhQ2hhbmdlcykucGlwZShtYXAoKHg6IGFueSkgPT4ge1xuICAgICAgbGV0IGRhdGEgPSBPYmplY3QuYXNzaWduKFtdLCB0aGlzLl9kYXRhYmFzZS5kYXRhKTtcbiAgICAgIC8qXG4gICAgICAgIGl0IGlzIG5lY2Vzc2FyeSB0byBmaXJzdCBjYWxjdWxhdGUgdGhlIGNhbGN1bGF0ZWQgY29sdW1ucyBhbmRcbiAgICAgICAgdGhlbiBmaWx0ZXIgYW5kIHNvcnQgdGhlIGRhdGFcbiAgICAgICovXG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIE9UYWJsZVNjcm9sbEV2ZW50KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZWREYXRhID0gZGF0YS5zbGljZSgwLCAoeC5kYXRhICogQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCkgLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmV4aXN0c0FueUNhbGN1bGF0ZWRDb2x1bW4oKSkge1xuICAgICAgICAgIGRhdGEgPSB0aGlzLmdldENvbHVtbkNhbGN1bGF0ZWREYXRhKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG4gICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJEYXRhKGRhdGEpO1xuICAgICAgICAgIGRhdGEgPSB0aGlzLmdldFF1aWNrRmlsdGVyRGF0YShkYXRhKTtcbiAgICAgICAgICBkYXRhID0gdGhpcy5nZXRTb3J0ZWREYXRhKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSBPYmplY3QuYXNzaWduKFtdLCBkYXRhKTtcblxuICAgICAgICBpZiAodGhpcy50YWJsZS5wYWdlYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHRvdGFsUmVjb3Jkc051bWJlciA9IHRoaXMudGFibGUuZ2V0VG90YWxSZWNvcmRzTnVtYmVyKCk7XG4gICAgICAgICAgdGhpcy5yZXN1bHRzTGVuZ3RoID0gdG90YWxSZWNvcmRzTnVtYmVyICE9PSB1bmRlZmluZWQgPyB0b3RhbFJlY29yZHNOdW1iZXIgOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlc3VsdHNMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICBkYXRhID0gdGhpcy5nZXRQYWdpbmF0aW9uRGF0YShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBpbiBwYWdpbmF0aW9uIHZpcnR1YWwgb25seSBzaG93IE9UYWJsZUNvbXBvbmVudC5MSU1JVCBpdGVtcyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlIG9mIHRoZSB0YWJsZSAqL1xuICAgICAgICBpZiAoIXRoaXMudGFibGUucGFnZWFibGUgJiYgIXRoaXMudGFibGUucGFnaW5hdGlvbkNvbnRyb2xzICYmIGRhdGEubGVuZ3RoID4gQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCkge1xuICAgICAgICAgIGNvbnN0IGRhdGFwYWdpbmF0ZSA9IGRhdGEuc2xpY2UoMCwgKHRoaXMudGFibGUucGFnZVNjcm9sbFZpcnR1YWwgKiBDb2Rlcy5MSU1JVF9TQ1JPTExWSVJUVUFMKSAtIDEpO1xuICAgICAgICAgIGRhdGEgPSBkYXRhcGFnaW5hdGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlcmVkRGF0YSA9IGRhdGE7XG4gICAgICAgIC8vIElmIGEgby10YWJsZS1jb2x1bW4tYWdncmVnYXRlIGV4aXN0cyB0aGVuIGVtaXQgb2JzZXJ2YWJsZVxuICAgICAgICAvLyBpZiAodGhpcy50YWJsZS5zaG93VG90YWxzKSB7XG4gICAgICAgIC8vICAgdGhpcy5kYXRhVG90YWxzQ2hhbmdlLm5leHQodGhpcy5yZW5kZXJlZERhdGEpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgdGhpcy5hZ2dyZWdhdGVEYXRhID0gdGhpcy5nZXRBZ2dyZWdhdGVzRGF0YShkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVkRGF0YTtcbiAgICB9KSk7XG4gIH1cblxuICBnZXRBZ2dyZWdhdGVzRGF0YShkYXRhOiBhbnlbXSk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JqID0ge307XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuX3RhYmxlT3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uOiBPQ29sdW1uKSA9PiB7XG4gICAgICBsZXQgdG90YWxWYWx1ZSA9ICcnO1xuICAgICAgaWYgKGNvbHVtbi5hZ2dyZWdhdGUgJiYgY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgdG90YWxWYWx1ZSA9IHNlbGYuY2FsY3VsYXRlQWdncmVnYXRlKGRhdGEsIGNvbHVtbik7XG4gICAgICB9XG4gICAgICBjb25zdCBrZXkgPSBjb2x1bW4uYXR0cjtcbiAgICAgIG9ialtrZXldID0gdG90YWxWYWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHRoYXQgZ2V0IHZhbHVlIHRoZSBjb2x1bW5zIGNhbGN1bGF0ZWRcbiAgICogQHBhcmFtIGRhdGEgZGF0YSBvZiB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGdldENvbHVtbkNhbGN1bGF0ZWREYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGNhbGN1bGF0ZWRDb2xzID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKChvQ29sOiBPQ29sdW1uKSA9PiBvQ29sLnZpc2libGUgJiYgb0NvbC5jYWxjdWxhdGUgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIGRhdGEubWFwKChyb3c6IGFueSkgPT4ge1xuICAgICAgY2FsY3VsYXRlZENvbHMuZm9yRWFjaCgob0NvbHVtbjogT0NvbHVtbikgPT4ge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2Ygb0NvbHVtbi5jYWxjdWxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdmFsdWUgPSBzZWxmLnRyYW5zZm9ybUZvcm11bGEob0NvbHVtbi5jYWxjdWxhdGUsIHJvdyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Db2x1bW4uY2FsY3VsYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFsdWUgPSBvQ29sdW1uLmNhbGN1bGF0ZShyb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJvd1tvQ29sdW1uLmF0dHJdID0gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcm93O1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRyYW5zZm9ybUZvcm11bGEoZm9ybXVsYUFyZywgcm93KTogc3RyaW5nIHtcbiAgICBsZXQgZm9ybXVsYSA9IGZvcm11bGFBcmc7XG4gICAgLy8gMS4gcmVwbGFjZSBjb2x1bW5zIGJ5IHZhbHVlcyBvZiByb3dcbiAgICBjb25zdCBjb2x1bW5zQXR0ciA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLm1hcCgob0NvbDogT0NvbHVtbikgPT4gb0NvbC5hdHRyKTtcbiAgICBjb2x1bW5zQXR0ci5mb3JFYWNoKChjb2x1bW46IHN0cmluZykgPT4ge1xuICAgICAgZm9ybXVsYSA9IGZvcm11bGEucmVwbGFjZShjb2x1bW4sIHJvd1tjb2x1bW5dKTtcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHRGb3JtdWxhID0gJyc7XG4gICAgLy8gMi4gVHJhbnNmb3JtIGZvcm11bGFcbiAgICB0cnkge1xuICAgICAgcmVzdWx0Rm9ybXVsYSA9IChuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgZm9ybXVsYSkpKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcignT3BlcmF0aW9uIGRlZmluZWQgaW4gdGhlIGNhbGN1bGF0ZWQgY29sdW1uIGlzIGluY29ycmVjdCAnKTtcbiAgICB9XG4gICAgLy8gMy4gUmV0dXJuIHJlc3VsdFxuICAgIHJldHVybiByZXN1bHRGb3JtdWxhO1xuICB9XG5cbiAgZ2V0UXVpY2tGaWx0ZXJEYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIGxldCBmaWx0ZXJEYXRhID0gdGhpcy5xdWlja0ZpbHRlcjtcbiAgICBpZiAoZmlsdGVyRGF0YSAhPT0gdW5kZWZpbmVkICYmIGZpbHRlckRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCF0aGlzLl90YWJsZU9wdGlvbnMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICBmaWx0ZXJEYXRhID0gZmlsdGVyRGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGEuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgLy8gR2V0dGluZyBjdXN0b20gY29sdW1ucyBmaWx0ZXIgY29sdW1ucyByZXN1bHRcbiAgICAgICAgY29uc3QgcGFzc0N1c3RvbUZpbHRlciA9IHRoaXMuZnVsZmlsbHNDdXN0b21GaWx0ZXJGdW5jdGlvbnMoZmlsdGVyRGF0YSwgaXRlbSk7XG4gICAgICAgIC8vIEdldHRpbmcgb3RoZXIgc2VhcmNoYWJsZSBjb2x1bW5zIHN0YW5kYXJkIHJlc3VsdFxuICAgICAgICBjb25zdCBwYXNzU2VhcmNoU3RyaW5nID0gdGhpcy5mdWxmaWxsc1F1aWNrZmlsdGVyKGZpbHRlckRhdGEsIGl0ZW0pO1xuICAgICAgICByZXR1cm4gcGFzc0N1c3RvbUZpbHRlciB8fCBwYXNzU2VhcmNoU3RyaW5nO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhZ2luYXRpb25EYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIGlmICghdGhpcy5fcGFnaW5hdG9yIHx8IGlzTmFOKHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZSkpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBsZXQgc3RhcnRJbmRleCA9IGlzTmFOKHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZSkgPyAwIDogdGhpcy5fcGFnaW5hdG9yLnBhZ2VJbmRleCAqIHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPiAwICYmIGRhdGEubGVuZ3RoIDwgc3RhcnRJbmRleCkge1xuICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICB0aGlzLl9wYWdpbmF0b3IucGFnZUluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEuc3BsaWNlKHN0YXJ0SW5kZXgsIHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZSk7XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLmRhdGFUb3RhbHNDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLl9xdWlja0ZpbHRlckNoYW5nZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fbG9hZERhdGFTY3JvbGxhYmxlQ2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZnVsZmlsbHNDdXN0b21GaWx0ZXJGdW5jdGlvbnMoZmlsdGVyOiBzdHJpbmcsIGl0ZW06IGFueSkge1xuICAgIGNvbnN0IGN1c3RvbUZpbHRlckNvbHMgPSB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIob0NvbCA9PiBvQ29sLnVzZUN1c3RvbUZpbHRlckZ1bmN0aW9uKCkpO1xuICAgIHJldHVybiBjdXN0b21GaWx0ZXJDb2xzLnNvbWUob0NvbCA9PiBvQ29sLnJlbmRlcmVyLmZpbHRlckZ1bmN0aW9uKGl0ZW1bb0NvbC5hdHRyXSwgaXRlbSwgZmlsdGVyKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZnVsZmlsbHNRdWlja2ZpbHRlcihmaWx0ZXI6IHN0cmluZywgaXRlbTogYW55KTogYm9vbGVhbiB7XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcigob0NvbDogT0NvbHVtbikgPT4gb0NvbC51c2VRdWlja2ZpbHRlckZ1bmN0aW9uKCkpO1xuICAgIGxldCBzZWFyY2hTdHIgPSBjb2x1bW5zLm1hcCgob0NvbDogT0NvbHVtbikgPT4gb0NvbC5nZXRGaWx0ZXJWYWx1ZShpdGVtW29Db2wuYXR0cl0sIGl0ZW0pLmpvaW4oJyAnKSkuam9pbignICcpO1xuICAgIGlmICghdGhpcy5fdGFibGVPcHRpb25zLmZpbHRlckNhc2VTZW5zaXRpdmUpIHtcbiAgICAgIHNlYXJjaFN0ciA9IHNlYXJjaFN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc2VhcmNoU3RyLmluZGV4T2YoZmlsdGVyKSAhPT0gLTE7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhYmFzZSBkYXRhLiAqL1xuICBwcm90ZWN0ZWQgZ2V0U29ydGVkRGF0YShkYXRhOiBhbnlbXSk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5nZXRTb3J0ZWREYXRhKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdGEgdGhlIHRhYmxlIHN0b3Jlcy4gTm8gZmlsdGVycyBhcmUgYXBwbGllZC5cbiAgICovXG4gIGdldFRhYmxlRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFiYXNlLmRhdGE7XG4gIH1cblxuICAvKiogUmV0dXJuIGRhdGEgb2YgdGhlIHZpc2libGUgY29sdW1ucyBvZiB0aGUgdGFibGUgd2l0aG91dCByZW5kZXJpbmcgKi9cbiAgZ2V0Q3VycmVudERhdGEoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmdldERhdGEoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRBbGxEYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBbGxEYXRhKGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICAvKiogUmV0dXJuIGRhdGEgb2YgdGhlIHZpc2libGUgY29sdW1ucyBvZiB0aGUgdGFibGUgIHJlbmRlcmluZyAqL1xuICBnZXRDdXJyZW50UmVuZGVyZXJEYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZW5kZXJlZERhdGEodGhpcy5yZW5kZXJlZERhdGEpO1xuICB9XG5cbiAgLyoqIFJldHVybiBhbGwgZGF0YSBvZiB0aGUgdGFibGUgcmVuZGVyaW5nICovXG4gIGdldEFsbFJlbmRlcmVyRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsRGF0YSh0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gc3FsIHR5cGVzIG9mIHRoZSBjdXJyZW50IGRhdGEgKi9cbiAgZ2V0IHNxbFR5cGVzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFiYXNlLnNxbFR5cGVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZWREYXRhO1xuICB9XG5cbiAgcHVibGljIGdldFJlbmRlcmVkRGF0YShkYXRhOiBhbnlbXSkge1xuICAgIGNvbnN0IHZpc2libGVDb2x1bW5zID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKG9Db2wgPT4gb0NvbC52aXNpYmxlKTtcbiAgICByZXR1cm4gZGF0YS5tYXAoKHJvdykgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICB2aXNpYmxlQ29sdW1ucy5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZVJlbmRlcmVyID0gb0NvbC5yZW5kZXJlciAmJiBvQ29sLnJlbmRlcmVyLmdldENlbGxEYXRhO1xuICAgICAgICBvYmpbb0NvbC5hdHRyXSA9IHVzZVJlbmRlcmVyID8gb0NvbC5yZW5kZXJlci5nZXRDZWxsRGF0YShyb3dbb0NvbC5hdHRyXSwgcm93KSA6IHJvd1tvQ29sLmF0dHJdO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEFsbERhdGEodXNpbmdSZW5kZXJlcmVycz86IGJvb2xlYW4sIG9ubHlWaXNpYmxlQ29sdW1ucz86IGJvb2xlYW4pIHtcbiAgICBsZXQgdGFibGVDb2x1bW5zID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnM7XG4gICAgaWYgKG9ubHlWaXNpYmxlQ29sdW1ucykge1xuICAgICAgdGFibGVDb2x1bW5zID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKG9Db2wgPT4gb0NvbC52aXNpYmxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyZWREYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIHRhYmxlQ29sdW1ucy5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZVJlbmRlcmVyID0gdXNpbmdSZW5kZXJlcmVycyAmJiBvQ29sLnJlbmRlcmVyICYmIG9Db2wucmVuZGVyZXIuZ2V0Q2VsbERhdGE7XG4gICAgICAgIG9ialtvQ29sLmF0dHJdID0gdXNlUmVuZGVyZXIgPyBvQ29sLnJlbmRlcmVyLmdldENlbGxEYXRhKHJvd1tvQ29sLmF0dHJdLCByb3cpIDogcm93W29Db2wuYXR0cl07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJlbmRlcmVyc0RhdGEoZGF0YTogYW55W10sIHRhYmxlQ29sdW1uczogT0NvbHVtbltdKTogYW55W10ge1xuICAgIHJldHVybiBkYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICAvLyByZW5kZXIgZWFjaCBjb2x1bW5cbiAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5hc3NpZ24oe30sIHJvdyk7XG4gICAgICB0YWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbDogT0NvbHVtbikgPT4ge1xuICAgICAgICBvYmpbb0NvbC5hdHRyXSA9IG9Db2wucmVuZGVyZXIuZ2V0Q2VsbERhdGEocm93W29Db2wuYXR0cl0sIHJvdyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sdW1uRGF0YShvY29sdW1uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlZERhdGEubWFwKChyb3cpID0+IHtcbiAgICAgIC8vIHJlbmRlciBlYWNoIGNvbHVtblxuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICBpZiAob2NvbHVtbikge1xuICAgICAgICBvYmpbb2NvbHVtbl0gPSByb3dbb2NvbHVtbl07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUNvbHVtbnNGaWx0ZXJzKGZpbHRlcnM6IE9Db2x1bW5WYWx1ZUZpbHRlcltdKSB7XG4gICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLnB1c2goZmlsdGVyKTtcbiAgICB9KTtcbiAgICBpZiAoIXRoaXMudGFibGUucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBpc0NvbHVtblZhbHVlRmlsdGVyQWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtblZhbHVlRmlsdGVycy5sZW5ndGggIT09IDA7XG4gIH1cblxuICBnZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKTogT0NvbHVtblZhbHVlRmlsdGVyW10ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtblZhbHVlRmlsdGVycztcbiAgfVxuXG4gIGdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGF0dHI6IHN0cmluZyk6IE9Db2x1bW5WYWx1ZUZpbHRlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmZpbHRlcihpdGVtID0+IGl0ZW0uYXR0ciA9PT0gYXR0cilbMF07XG4gIH1cblxuICBjbGVhckNvbHVtbkZpbHRlcnModHJpZ2dlcjogYm9vbGVhbiA9IHRydWUpIHtcbiAgICB0aGlzLmNvbHVtblZhbHVlRmlsdGVycyA9IFtdO1xuICAgIGlmICh0cmlnZ2VyKSB7XG4gICAgICB0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgYWRkQ29sdW1uRmlsdGVyKGZpbHRlcjogT0NvbHVtblZhbHVlRmlsdGVyKSB7XG4gICAgY29uc3QgZXhpc3RpbmdGaWx0ZXIgPSB0aGlzLmdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGZpbHRlci5hdHRyKTtcbiAgICBpZiAoZXhpc3RpbmdGaWx0ZXIpIHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmluZGV4T2YoZXhpc3RpbmdGaWx0ZXIpO1xuICAgICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgKENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU4gPT09IGZpbHRlci5vcGVyYXRvciAmJiBmaWx0ZXIudmFsdWVzLmxlbmd0aCA+IDApIHx8XG4gICAgICAoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yICYmIGZpbHRlci52YWx1ZXMpIHx8XG4gICAgICAoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5CRVRXRUVOID09PSBmaWx0ZXIub3BlcmF0b3IgJiYgZmlsdGVyLnZhbHVlcy5sZW5ndGggPT09IDIpIHx8XG4gICAgICAoKENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTEVTU19FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yIHx8IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yKSAmJiBmaWx0ZXIudmFsdWVzKVxuICAgICkge1xuICAgICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMucHVzaChmaWx0ZXIpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0YWJsZSBpcyBwYWdpbmF0ZWQsIGZpbHRlciB3aWxsIGJlIGFwcGxpZWQgb24gcmVtb3RlIHF1ZXJ5XG4gICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29sdW1uVmFsdWVGaWx0ZXJEYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGNvbnN0IGZpbHRlckNvbHVtbiA9IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbmQoY29sID0+IGNvbC5hdHRyID09PSBmaWx0ZXIuYXR0cik7XG4gICAgICBpZiAoZmlsdGVyQ29sdW1uKSB7XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyLm9wZXJhdG9yKSB7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOOlxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGZpbHRlckNvbHVtbi5yZW5kZXJlciAmJiBmaWx0ZXJDb2x1bW4ucmVuZGVyZXIuZmlsdGVyRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyQ29sdW1uLnJlbmRlcmVyLmZpbHRlckZ1bmN0aW9uKGl0ZW1bZmlsdGVyLmF0dHJdLCBpdGVtKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xWYWx1ZXMgPSBmaWx0ZXJDb2x1bW4uZ2V0RmlsdGVyVmFsdWUoaXRlbVtmaWx0ZXIuYXR0cl0sIGl0ZW0pLm1hcChmID0+IFV0aWwubm9ybWFsaXplU3RyaW5nKGYpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJWYWx1ZXMgPSBmaWx0ZXIudmFsdWVzLm1hcChmID0+IFV0aWwubm9ybWFsaXplU3RyaW5nKGYpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyVmFsdWVzLnNvbWUodmFsdWUgPT4gY29sVmFsdWVzLmluZGV4T2YodmFsdWUpICE9PSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMOlxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gVXRpbC5ub3JtYWxpemVTdHJpbmcoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbFZhbHVlcyA9IGZpbHRlckNvbHVtbi5nZXRGaWx0ZXJWYWx1ZShpdGVtW2ZpbHRlci5hdHRyXSwgaXRlbSkubWFwKGYgPT4gVXRpbC5ub3JtYWxpemVTdHJpbmcoZikpO1xuICAgICAgICAgICAgICBsZXQgcmVnRXhwO1xuICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFZhbHVlLmluY2x1ZGVzKCcqJykpIHtcbiAgICAgICAgICAgICAgICByZWdFeHAgPSBuZXcgUmVnRXhwKCdeJyArIG5vcm1hbGl6ZWRWYWx1ZS5zcGxpdCgnKicpLmpvaW4oJy4qJykgKyAnJCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBjb2xWYWx1ZXMuc29tZShjb2xWYWx1ZSA9PiByZWdFeHAgPyByZWdFeHAudGVzdChjb2xWYWx1ZSkgOiBjb2xWYWx1ZS5pbmNsdWRlcyhub3JtYWxpemVkVmFsdWUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU46XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtW2ZpbHRlci5hdHRyXSA+PSBmaWx0ZXIudmFsdWVzWzBdICYmIGl0ZW1bZmlsdGVyLmF0dHJdIDw9IGZpbHRlci52YWx1ZXNbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLk1PUkVfRVFVQUw6XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtW2ZpbHRlci5hdHRyXSA+PSBmaWx0ZXIudmFsdWVzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMOlxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKGl0ZW0gPT4gaXRlbVtmaWx0ZXIuYXR0cl0gPD0gZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZ2V0QWdncmVnYXRlRGF0YShjb2x1bW46IE9Db2x1bW4pIHtcbiAgICBjb25zdCBvYmogPSB7fTtcbiAgICBsZXQgdG90YWxWYWx1ZSA9ICcnO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLl90YWJsZU9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IEFycmF5KG9iaik7XG4gICAgfVxuICAgIHRvdGFsVmFsdWUgPSB0aGlzLmFnZ3JlZ2F0ZURhdGFbY29sdW1uLmF0dHJdO1xuICAgIHJldHVybiB0b3RhbFZhbHVlO1xuICB9XG5cbiAgY2FsY3VsYXRlQWdncmVnYXRlKGRhdGE6IGFueVtdLCBjb2x1bW46IE9Db2x1bW4pOiBhbnkge1xuICAgIGxldCByZXN1bHRBZ2dyZWdhdGU7XG4gICAgY29uc3Qgb3BlcmF0b3IgPSBjb2x1bW4uYWdncmVnYXRlLm9wZXJhdG9yO1xuICAgIGlmICh0eXBlb2Ygb3BlcmF0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzd2l0Y2ggKG9wZXJhdG9yLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAnY291bnQnOlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMuY291bnQoY29sdW1uLmF0dHIsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtaW4nOlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMubWluKGNvbHVtbi5hdHRyLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWF4JzpcbiAgICAgICAgICByZXN1bHRBZ2dyZWdhdGUgPSB0aGlzLm1heChjb2x1bW4uYXR0ciwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2F2Zyc6XG4gICAgICAgICAgcmVzdWx0QWdncmVnYXRlID0gdGhpcy5hdmcoY29sdW1uLmF0dHIsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMuc3VtKGNvbHVtbi5hdHRyLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29sdW1uRGF0YTogYW55W10gPSB0aGlzLmdldENvbHVtbkRhdGEoY29sdW1uLmF0dHIpO1xuICAgICAgaWYgKHR5cGVvZiBvcGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXN1bHRBZ2dyZWdhdGUgPSBvcGVyYXRvcihjb2x1bW5EYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIHN1bShjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHZhbHVlID0gZGF0YS5yZWR1Y2UoKGFjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gYWN1bXVsYXRvciArIChpc05hTihjdXJyZW50VmFsdWVbY29sdW1uXSkgPyAwIDogY3VycmVudFZhbHVlW2NvbHVtbl0pO1xuICAgICAgfSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBjb3VudChjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHZhbHVlID0gZGF0YS5yZWR1Y2UoKGFjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBhY3VtdWxhdG9yICsgMTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBhdmcoY29sdW1uLCBkYXRhKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zdW0oY29sdW1uLCBkYXRhKSAvIHRoaXMuY291bnQoY29sdW1uLCBkYXRhKTtcbiAgfVxuXG4gIG1pbihjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIGNvbnN0IHRlbXBNaW4gPSBkYXRhLm1hcCh4ID0+IHhbY29sdW1uXSk7XG4gICAgcmV0dXJuIE1hdGgubWluKC4uLnRlbXBNaW4pO1xuICB9XG5cbiAgbWF4KGNvbHVtbiwgZGF0YSk6IG51bWJlciB7XG4gICAgY29uc3QgdGVtcE1pbiA9IGRhdGEubWFwKHggPT4geFtjb2x1bW5dKTtcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4udGVtcE1pbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhpc3RzQW55Q2FsY3VsYXRlZENvbHVtbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmluZCgob0NvbDogT0NvbHVtbikgPT4gb0NvbC5jYWxjdWxhdGUgIT09IHVuZGVmaW5lZCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHVwZGF0ZVJlbmRlcmVkUm93RGF0YShyb3dEYXRhOiBhbnkpIHtcbiAgICBjb25zdCB0YWJsZUtleXMgPSB0aGlzLnRhYmxlLmdldEtleXMoKTtcbiAgICBjb25zdCByZWNvcmQgPSB0aGlzLnJlbmRlcmVkRGF0YS5maW5kKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGxldCBmb3VuZCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGFibGVLZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRhYmxlS2V5c1tpXTtcbiAgICAgICAgaWYgKGRhdGFba2V5XSAhPT0gcm93RGF0YVtrZXldKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0pO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChyZWNvcmQpKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHJlY29yZCwgcm93RGF0YSk7XG4gICAgfVxuICB9XG59XG5cblxuXG4iXX0=