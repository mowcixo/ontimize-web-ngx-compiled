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
    clearColumnFilter(attr, trigger = true) {
        this.columnValueFilters = this.columnValueFilters.filter(x => x.attr !== attr);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1vLXRhYmxlLmRhdGFzb3VyY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kZWZhdWx0LW8tdGFibGUuZGF0YXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3QyxPQUFPLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbkUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSXJDLE9BQU8sRUFBRSx5QkFBeUIsRUFBc0IsTUFBTSwyQ0FBMkMsQ0FBQztBQUMxRyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBTTFDLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUM7QUFPdEMsTUFBTSxPQUFPLGlCQUFpQjtJQUk1QixZQUFZLElBQVk7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBRUQsTUFBTSxPQUFPLHVCQUF3QixTQUFRLFVBQWU7SUFrQzFELFlBQXNCLEtBQXNCO1FBQzFDLEtBQUssRUFBRSxDQUFDO1FBRFksVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFqQzVDLHFCQUFnQixHQUFHLElBQUksZUFBZSxDQUFRLEVBQUUsQ0FBQyxDQUFDO1FBUXhDLHVCQUFrQixHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLDZCQUF3QixHQUFHLElBQUksT0FBTyxF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QyxJQUFJLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUNsRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEQsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzlCLEtBQUssR0FBRyxLQUFLLENBQUM7b0JBQ2QsTUFBTTtpQkFDUDthQUNGO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMxQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRQYWdpbmF0b3IgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIG1lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE9UYWJsZURhdGFTb3VyY2UgfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtZGF0YXNvdXJjZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLCBPQ29sdW1uVmFsdWVGaWx0ZXIgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLWNvbHVtbi12YWx1ZS1maWx0ZXIudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uL28tdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZURhbyB9IGZyb20gJy4vby10YWJsZS5kYW8nO1xuaW1wb3J0IHsgT01hdFNvcnQgfSBmcm9tICcuL3NvcnQvby1tYXQtc29ydCc7XG5cbmV4cG9ydCBjb25zdCBTQ1JPTExWSVJUVUFMID0gJ3Njcm9sbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRhYmxlT1Njcm9sbEV2ZW50IHtcbiAgdHlwZTogc3RyaW5nO1xuICBkYXRhOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBPVGFibGVTY3JvbGxFdmVudCBpbXBsZW1lbnRzIElUYWJsZU9TY3JvbGxFdmVudCB7XG4gIHB1YmxpYyBkYXRhOiBudW1iZXI7XG4gIHB1YmxpYyB0eXBlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoZGF0YTogbnVtYmVyKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnR5cGUgPSBTQ1JPTExWSVJUVUFMO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0T1RhYmxlRGF0YVNvdXJjZSBleHRlbmRzIERhdGFTb3VyY2U8YW55PiBpbXBsZW1lbnRzIE9UYWJsZURhdGFTb3VyY2Uge1xuICBkYXRhVG90YWxzQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnlbXT4oW10pO1xuICBnZXQgZGF0YSgpOiBhbnlbXSB7IHJldHVybiB0aGlzLmRhdGFUb3RhbHNDaGFuZ2UudmFsdWU7IH1cblxuICBwcm90ZWN0ZWQgX2RhdGFiYXNlOiBPVGFibGVEYW87XG4gIHByb3RlY3RlZCBfcGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XG4gIHByb3RlY3RlZCBfdGFibGVPcHRpb25zOiBPVGFibGVPcHRpb25zO1xuICBwcm90ZWN0ZWQgX3NvcnQ6IE9NYXRTb3J0O1xuXG4gIHByb3RlY3RlZCBfcXVpY2tGaWx0ZXJDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KCcnKTtcbiAgcHJvdGVjdGVkIF9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZSA9IG5ldyBTdWJqZWN0KCk7XG4gIHByb3RlY3RlZCBfbG9hZERhdGFTY3JvbGxhYmxlQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxPVGFibGVTY3JvbGxFdmVudD4obmV3IE9UYWJsZVNjcm9sbEV2ZW50KDEpKTtcblxuICBwcm90ZWN0ZWQgZmlsdGVyZWREYXRhOiBhbnlbXSA9IFtdO1xuICBwcm90ZWN0ZWQgYWdncmVnYXRlRGF0YTogYW55ID0ge307XG5cbiAgb25SZW5kZXJlZERhdGFDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLy8gbG9hZCBkYXRhIGluIHNjcm9sbFxuICBnZXQgbG9hZERhdGFTY3JvbGxhYmxlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9sb2FkRGF0YVNjcm9sbGFibGVDaGFuZ2UuZ2V0VmFsdWUoKS5kYXRhIHx8IDE7IH1cbiAgc2V0IGxvYWREYXRhU2Nyb2xsYWJsZShwYWdlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9sb2FkRGF0YVNjcm9sbGFibGVDaGFuZ2UubmV4dChuZXcgT1RhYmxlU2Nyb2xsRXZlbnQocGFnZSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9yZW5kZXJlZERhdGE6IGFueVtdID0gW107XG4gIHJlc3VsdHNMZW5ndGg6IG51bWJlciA9IDA7XG5cbiAgZ2V0IHF1aWNrRmlsdGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9xdWlja0ZpbHRlckNoYW5nZS52YWx1ZSB8fCAnJzsgfVxuICBzZXQgcXVpY2tGaWx0ZXIoZmlsdGVyOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9xdWlja0ZpbHRlckNoYW5nZS5uZXh0KGZpbHRlcik7XG4gIH1cblxuICBwcml2YXRlIGNvbHVtblZhbHVlRmlsdGVyczogQXJyYXk8T0NvbHVtblZhbHVlRmlsdGVyPiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCB0YWJsZTogT1RhYmxlQ29tcG9uZW50KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9kYXRhYmFzZSA9IHRhYmxlLmRhb1RhYmxlO1xuICAgIGlmICh0aGlzLl9kYXRhYmFzZSkge1xuICAgICAgdGhpcy5yZXN1bHRzTGVuZ3RoID0gdGhpcy5fZGF0YWJhc2UuZGF0YS5sZW5ndGg7XG4gICAgfVxuICAgIGlmICh0YWJsZS5wYWdpbmF0b3IpIHtcbiAgICAgIHRoaXMuX3BhZ2luYXRvciA9IHRhYmxlLm1hdHBhZ2luYXRvcjtcbiAgICB9XG4gICAgdGhpcy5fdGFibGVPcHRpb25zID0gdGFibGUub1RhYmxlT3B0aW9ucztcbiAgICB0aGlzLl9zb3J0ID0gdGFibGUuc29ydDtcbiAgfVxuXG4gIHNvcnRGdW5jdGlvbihhOiBhbnksIGI6IGFueSk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuc29ydEZ1bmN0aW9uKGEsIGIpO1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVkRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlcmVkRGF0YTtcbiAgfVxuXG4gIHNldCByZW5kZXJlZERhdGEoYXJnOiBhbnlbXSkge1xuICAgIHRoaXMuX3JlbmRlcmVkRGF0YSA9IGFyZztcbiAgICB0aGlzLm9uUmVuZGVyZWREYXRhQ2hhbmdlLmVtaXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IGZ1bmN0aW9uIGNhbGxlZCBieSB0aGUgdGFibGUgdG8gcmV0cmlldmUgb25lIHN0cmVhbSBjb250YWluaW5nIHRoZSBkYXRhIHRvIHJlbmRlci5cbiAgICovXG4gIGNvbm5lY3QoKTogT2JzZXJ2YWJsZTxhbnlbXT4ge1xuICAgIGNvbnN0IGRpc3BsYXlEYXRhQ2hhbmdlczogYW55W10gPSBbXG4gICAgICB0aGlzLl9kYXRhYmFzZS5kYXRhQ2hhbmdlXG4gICAgXTtcblxuICAgIGlmICghdGhpcy50YWJsZS5wYWdlYWJsZSkge1xuXG4gICAgICBpZiAodGhpcy5fc29ydCkge1xuICAgICAgICBkaXNwbGF5RGF0YUNoYW5nZXMucHVzaCh0aGlzLl9zb3J0Lm9Tb3J0Q2hhbmdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3RhYmxlT3B0aW9ucy5maWx0ZXIpIHtcbiAgICAgICAgZGlzcGxheURhdGFDaGFuZ2VzLnB1c2godGhpcy5fcXVpY2tGaWx0ZXJDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcGFnaW5hdG9yKSB7XG4gICAgICAgIGRpc3BsYXlEYXRhQ2hhbmdlcy5wdXNoKHRoaXMuX3BhZ2luYXRvci5wYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXlEYXRhQ2hhbmdlcy5wdXNoKHRoaXMuX2xvYWREYXRhU2Nyb2xsYWJsZUNoYW5nZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGFibGUub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgZGlzcGxheURhdGFDaGFuZ2VzLnB1c2godGhpcy5fY29sdW1uVmFsdWVGaWx0ZXJDaGFuZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiBtZXJnZSguLi5kaXNwbGF5RGF0YUNoYW5nZXMpLnBpcGUobWFwKCh4OiBhbnkpID0+IHtcbiAgICAgIGxldCBkYXRhID0gT2JqZWN0LmFzc2lnbihbXSwgdGhpcy5fZGF0YWJhc2UuZGF0YSk7XG4gICAgICAvKlxuICAgICAgICBpdCBpcyBuZWNlc3NhcnkgdG8gZmlyc3QgY2FsY3VsYXRlIHRoZSBjYWxjdWxhdGVkIGNvbHVtbnMgYW5kXG4gICAgICAgIHRoZW4gZmlsdGVyIGFuZCBzb3J0IHRoZSBkYXRhXG4gICAgICAqL1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiBPVGFibGVTY3JvbGxFdmVudCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVkRGF0YSA9IGRhdGEuc2xpY2UoMCwgKHguZGF0YSAqIENvZGVzLkxJTUlUX1NDUk9MTFZJUlRVQUwpIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5leGlzdHNBbnlDYWxjdWxhdGVkQ29sdW1uKCkpIHtcbiAgICAgICAgICBkYXRhID0gdGhpcy5nZXRDb2x1bW5DYWxjdWxhdGVkRGF0YShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50YWJsZS5wYWdlYWJsZSkge1xuICAgICAgICAgIGRhdGEgPSB0aGlzLmdldENvbHVtblZhbHVlRmlsdGVyRGF0YShkYXRhKTtcbiAgICAgICAgICBkYXRhID0gdGhpcy5nZXRRdWlja0ZpbHRlckRhdGEoZGF0YSk7XG4gICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0U29ydGVkRGF0YShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmlsdGVyZWREYXRhID0gT2JqZWN0LmFzc2lnbihbXSwgZGF0YSk7XG5cbiAgICAgICAgaWYgKHRoaXMudGFibGUucGFnZWFibGUpIHtcbiAgICAgICAgICBjb25zdCB0b3RhbFJlY29yZHNOdW1iZXIgPSB0aGlzLnRhYmxlLmdldFRvdGFsUmVjb3Jkc051bWJlcigpO1xuICAgICAgICAgIHRoaXMucmVzdWx0c0xlbmd0aCA9IHRvdGFsUmVjb3Jkc051bWJlciAhPT0gdW5kZWZpbmVkID8gdG90YWxSZWNvcmRzTnVtYmVyIDogZGF0YS5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXN1bHRzTGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0UGFnaW5hdGlvbkRhdGEoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiogaW4gcGFnaW5hdGlvbiB2aXJ0dWFsIG9ubHkgc2hvdyBPVGFibGVDb21wb25lbnQuTElNSVQgaXRlbXMgZm9yIGJldHRlciBwZXJmb3JtYW5jZSBvZiB0aGUgdGFibGUgKi9cbiAgICAgICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlICYmICF0aGlzLnRhYmxlLnBhZ2luYXRpb25Db250cm9scyAmJiBkYXRhLmxlbmd0aCA+IENvZGVzLkxJTUlUX1NDUk9MTFZJUlRVQUwpIHtcbiAgICAgICAgICBjb25zdCBkYXRhcGFnaW5hdGUgPSBkYXRhLnNsaWNlKDAsICh0aGlzLnRhYmxlLnBhZ2VTY3JvbGxWaXJ0dWFsICogQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCkgLSAxKTtcbiAgICAgICAgICBkYXRhID0gZGF0YXBhZ2luYXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlZERhdGEgPSBkYXRhO1xuICAgICAgICAvLyBJZiBhIG8tdGFibGUtY29sdW1uLWFnZ3JlZ2F0ZSBleGlzdHMgdGhlbiBlbWl0IG9ic2VydmFibGVcbiAgICAgICAgLy8gaWYgKHRoaXMudGFibGUuc2hvd1RvdGFscykge1xuICAgICAgICAvLyAgIHRoaXMuZGF0YVRvdGFsc0NoYW5nZS5uZXh0KHRoaXMucmVuZGVyZWREYXRhKTtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIHRoaXMuYWdncmVnYXRlRGF0YSA9IHRoaXMuZ2V0QWdncmVnYXRlc0RhdGEoZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJlZERhdGE7XG4gICAgfSkpO1xuICB9XG5cbiAgZ2V0QWdncmVnYXRlc0RhdGEoZGF0YTogYW55W10pOiBhbnkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLl90YWJsZU9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLmZvckVhY2goKGNvbHVtbjogT0NvbHVtbikgPT4ge1xuICAgICAgbGV0IHRvdGFsVmFsdWUgPSAnJztcbiAgICAgIGlmIChjb2x1bW4uYWdncmVnYXRlICYmIGNvbHVtbi52aXNpYmxlKSB7XG4gICAgICAgIHRvdGFsVmFsdWUgPSBzZWxmLmNhbGN1bGF0ZUFnZ3JlZ2F0ZShkYXRhLCBjb2x1bW4pO1xuICAgICAgfVxuICAgICAgY29uc3Qga2V5ID0gY29sdW1uLmF0dHI7XG4gICAgICBvYmpba2V5XSA9IHRvdGFsVmFsdWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0aGF0IGdldCB2YWx1ZSB0aGUgY29sdW1ucyBjYWxjdWxhdGVkXG4gICAqIEBwYXJhbSBkYXRhIGRhdGEgb2YgdGhlIGRhdGFiYXNlXG4gICAqL1xuICBnZXRDb2x1bW5DYWxjdWxhdGVkRGF0YShkYXRhOiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjYWxjdWxhdGVkQ29scyA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcigob0NvbDogT0NvbHVtbikgPT4gb0NvbC52aXNpYmxlICYmIG9Db2wuY2FsY3VsYXRlICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBkYXRhLm1hcCgocm93OiBhbnkpID0+IHtcbiAgICAgIGNhbGN1bGF0ZWRDb2xzLmZvckVhY2goKG9Db2x1bW46IE9Db2x1bW4pID0+IHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBpZiAodHlwZW9mIG9Db2x1bW4uY2FsY3VsYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhbHVlID0gc2VsZi50cmFuc2Zvcm1Gb3JtdWxhKG9Db2x1bW4uY2FsY3VsYXRlLCByb3cpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvQ29sdW1uLmNhbGN1bGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhbHVlID0gb0NvbHVtbi5jYWxjdWxhdGUocm93KTtcbiAgICAgICAgfVxuICAgICAgICByb3dbb0NvbHVtbi5hdHRyXSA9IGlzTmFOKHZhbHVlKSA/IDAgOiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJvdztcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0cmFuc2Zvcm1Gb3JtdWxhKGZvcm11bGFBcmcsIHJvdyk6IHN0cmluZyB7XG4gICAgbGV0IGZvcm11bGEgPSBmb3JtdWxhQXJnO1xuICAgIC8vIDEuIHJlcGxhY2UgY29sdW1ucyBieSB2YWx1ZXMgb2Ygcm93XG4gICAgY29uc3QgY29sdW1uc0F0dHIgPSB0aGlzLl90YWJsZU9wdGlvbnMuY29sdW1ucy5tYXAoKG9Db2w6IE9Db2x1bW4pID0+IG9Db2wuYXR0cik7XG4gICAgY29sdW1uc0F0dHIuZm9yRWFjaCgoY29sdW1uOiBzdHJpbmcpID0+IHtcbiAgICAgIGZvcm11bGEgPSBmb3JtdWxhLnJlcGxhY2UoY29sdW1uLCByb3dbY29sdW1uXSk7XG4gICAgfSk7XG5cbiAgICBsZXQgcmVzdWx0Rm9ybXVsYSA9ICcnO1xuICAgIC8vIDIuIFRyYW5zZm9ybSBmb3JtdWxhXG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdEZvcm11bGEgPSAobmV3IEZ1bmN0aW9uKCdyZXR1cm4gJyArIGZvcm11bGEpKSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ09wZXJhdGlvbiBkZWZpbmVkIGluIHRoZSBjYWxjdWxhdGVkIGNvbHVtbiBpcyBpbmNvcnJlY3QgJyk7XG4gICAgfVxuICAgIC8vIDMuIFJldHVybiByZXN1bHRcbiAgICByZXR1cm4gcmVzdWx0Rm9ybXVsYTtcbiAgfVxuXG4gIGdldFF1aWNrRmlsdGVyRGF0YShkYXRhOiBhbnlbXSk6IGFueVtdIHtcbiAgICBsZXQgZmlsdGVyRGF0YSA9IHRoaXMucXVpY2tGaWx0ZXI7XG4gICAgaWYgKGZpbHRlckRhdGEgIT09IHVuZGVmaW5lZCAmJiBmaWx0ZXJEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghdGhpcy5fdGFibGVPcHRpb25zLmZpbHRlckNhc2VTZW5zaXRpdmUpIHtcbiAgICAgICAgZmlsdGVyRGF0YSA9IGZpbHRlckRhdGEudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRhLmZpbHRlcigoaXRlbTogYW55KSA9PiB7XG4gICAgICAgIC8vIEdldHRpbmcgY3VzdG9tIGNvbHVtbnMgZmlsdGVyIGNvbHVtbnMgcmVzdWx0XG4gICAgICAgIGNvbnN0IHBhc3NDdXN0b21GaWx0ZXIgPSB0aGlzLmZ1bGZpbGxzQ3VzdG9tRmlsdGVyRnVuY3Rpb25zKGZpbHRlckRhdGEsIGl0ZW0pO1xuICAgICAgICAvLyBHZXR0aW5nIG90aGVyIHNlYXJjaGFibGUgY29sdW1ucyBzdGFuZGFyZCByZXN1bHRcbiAgICAgICAgY29uc3QgcGFzc1NlYXJjaFN0cmluZyA9IHRoaXMuZnVsZmlsbHNRdWlja2ZpbHRlcihmaWx0ZXJEYXRhLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIHBhc3NDdXN0b21GaWx0ZXIgfHwgcGFzc1NlYXJjaFN0cmluZztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH1cblxuICBnZXRQYWdpbmF0aW9uRGF0YShkYXRhOiBhbnlbXSk6IGFueVtdIHtcbiAgICBpZiAoIXRoaXMuX3BhZ2luYXRvciB8fCBpc05hTih0aGlzLl9wYWdpbmF0b3IucGFnZVNpemUpKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgbGV0IHN0YXJ0SW5kZXggPSBpc05hTih0aGlzLl9wYWdpbmF0b3IucGFnZVNpemUpID8gMCA6IHRoaXMuX3BhZ2luYXRvci5wYWdlSW5kZXggKiB0aGlzLl9wYWdpbmF0b3IucGFnZVNpemU7XG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMCAmJiBkYXRhLmxlbmd0aCA8IHN0YXJ0SW5kZXgpIHtcbiAgICAgIHN0YXJ0SW5kZXggPSAwO1xuICAgICAgdGhpcy5fcGFnaW5hdG9yLnBhZ2VJbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBkYXRhLnNwbGljZShzdGFydEluZGV4LCB0aGlzLl9wYWdpbmF0b3IucGFnZVNpemUpO1xuICB9XG5cbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLm9uUmVuZGVyZWREYXRhQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kYXRhVG90YWxzQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fcXVpY2tGaWx0ZXJDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2xvYWREYXRhU2Nyb2xsYWJsZUNoYW5nZS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZ1bGZpbGxzQ3VzdG9tRmlsdGVyRnVuY3Rpb25zKGZpbHRlcjogc3RyaW5nLCBpdGVtOiBhbnkpIHtcbiAgICBjb25zdCBjdXN0b21GaWx0ZXJDb2xzID0gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKG9Db2wgPT4gb0NvbC51c2VDdXN0b21GaWx0ZXJGdW5jdGlvbigpKTtcbiAgICByZXR1cm4gY3VzdG9tRmlsdGVyQ29scy5zb21lKG9Db2wgPT4gb0NvbC5yZW5kZXJlci5maWx0ZXJGdW5jdGlvbihpdGVtW29Db2wuYXR0cl0sIGl0ZW0sIGZpbHRlcikpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZ1bGZpbGxzUXVpY2tmaWx0ZXIoZmlsdGVyOiBzdHJpbmcsIGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLl90YWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIoKG9Db2w6IE9Db2x1bW4pID0+IG9Db2wudXNlUXVpY2tmaWx0ZXJGdW5jdGlvbigpKTtcbiAgICBsZXQgc2VhcmNoU3RyID0gY29sdW1ucy5tYXAoKG9Db2w6IE9Db2x1bW4pID0+IG9Db2wuZ2V0RmlsdGVyVmFsdWUoaXRlbVtvQ29sLmF0dHJdLCBpdGVtKS5qb2luKCcgJykpLmpvaW4oJyAnKTtcbiAgICBpZiAoIXRoaXMuX3RhYmxlT3B0aW9ucy5maWx0ZXJDYXNlU2Vuc2l0aXZlKSB7XG4gICAgICBzZWFyY2hTdHIgPSBzZWFyY2hTdHIudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlYXJjaFN0ci5pbmRleE9mKGZpbHRlcikgIT09IC0xO1xuICB9XG5cbiAgLyoqIFJldHVybnMgYSBzb3J0ZWQgY29weSBvZiB0aGUgZGF0YWJhc2UgZGF0YS4gKi9cbiAgcHJvdGVjdGVkIGdldFNvcnRlZERhdGEoZGF0YTogYW55W10pOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuZ2V0U29ydGVkRGF0YShkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkYXRhIHRoZSB0YWJsZSBzdG9yZXMuIE5vIGZpbHRlcnMgYXJlIGFwcGxpZWQuXG4gICAqL1xuICBnZXRUYWJsZURhdGEoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLl9kYXRhYmFzZS5kYXRhO1xuICB9XG5cbiAgLyoqIFJldHVybiBkYXRhIG9mIHRoZSB2aXNpYmxlIGNvbHVtbnMgb2YgdGhlIHRhYmxlIHdpdGhvdXQgcmVuZGVyaW5nICovXG4gIGdldEN1cnJlbnREYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXREYXRhKCk7XG4gIH1cblxuICBnZXRDdXJyZW50QWxsRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsRGF0YShmYWxzZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqIFJldHVybiBkYXRhIG9mIHRoZSB2aXNpYmxlIGNvbHVtbnMgb2YgdGhlIHRhYmxlICByZW5kZXJpbmcgKi9cbiAgZ2V0Q3VycmVudFJlbmRlcmVyRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVuZGVyZWREYXRhKHRoaXMucmVuZGVyZWREYXRhKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gYWxsIGRhdGEgb2YgdGhlIHRhYmxlIHJlbmRlcmluZyAqL1xuICBnZXRBbGxSZW5kZXJlckRhdGEoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmdldEFsbERhdGEodHJ1ZSwgdHJ1ZSk7XG4gIH1cblxuICAvKiogUmV0dXJuIHNxbCB0eXBlcyBvZiB0aGUgY3VycmVudCBkYXRhICovXG4gIGdldCBzcWxUeXBlcygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhYmFzZS5zcWxUeXBlcztcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXREYXRhKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlcmVkRGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRSZW5kZXJlZERhdGEoZGF0YTogYW55W10pIHtcbiAgICBjb25zdCB2aXNpYmxlQ29sdW1ucyA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihvQ29sID0+IG9Db2wudmlzaWJsZSk7XG4gICAgcmV0dXJuIGRhdGEubWFwKChyb3cpID0+IHtcbiAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgdmlzaWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbDogT0NvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCB1c2VSZW5kZXJlciA9IG9Db2wucmVuZGVyZXIgJiYgb0NvbC5yZW5kZXJlci5nZXRDZWxsRGF0YTtcbiAgICAgICAgb2JqW29Db2wuYXR0cl0gPSB1c2VSZW5kZXJlciA/IG9Db2wucmVuZGVyZXIuZ2V0Q2VsbERhdGEocm93W29Db2wuYXR0cl0sIHJvdykgOiByb3dbb0NvbC5hdHRyXTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRBbGxEYXRhKHVzaW5nUmVuZGVyZXJlcnM/OiBib29sZWFuLCBvbmx5VmlzaWJsZUNvbHVtbnM/OiBib29sZWFuKSB7XG4gICAgbGV0IHRhYmxlQ29sdW1ucyA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zO1xuICAgIGlmIChvbmx5VmlzaWJsZUNvbHVtbnMpIHtcbiAgICAgIHRhYmxlQ29sdW1ucyA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihvQ29sID0+IG9Db2wudmlzaWJsZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbHRlcmVkRGF0YS5tYXAoKHJvdykgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICB0YWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbDogT0NvbHVtbikgPT4ge1xuICAgICAgICBjb25zdCB1c2VSZW5kZXJlciA9IHVzaW5nUmVuZGVyZXJlcnMgJiYgb0NvbC5yZW5kZXJlciAmJiBvQ29sLnJlbmRlcmVyLmdldENlbGxEYXRhO1xuICAgICAgICBvYmpbb0NvbC5hdHRyXSA9IHVzZVJlbmRlcmVyID8gb0NvbC5yZW5kZXJlci5nZXRDZWxsRGF0YShyb3dbb0NvbC5hdHRyXSwgcm93KSA6IHJvd1tvQ29sLmF0dHJdO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSZW5kZXJlcnNEYXRhKGRhdGE6IGFueVtdLCB0YWJsZUNvbHVtbnM6IE9Db2x1bW5bXSk6IGFueVtdIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoKHJvdykgPT4ge1xuICAgICAgLy8gcmVuZGVyIGVhY2ggY29sdW1uXG4gICAgICBjb25zdCBvYmogPSBPYmplY3QuYXNzaWduKHt9LCByb3cpO1xuICAgICAgdGFibGVDb2x1bW5zLmZvckVhY2goKG9Db2w6IE9Db2x1bW4pID0+IHtcbiAgICAgICAgb2JqW29Db2wuYXR0cl0gPSBvQ29sLnJlbmRlcmVyLmdldENlbGxEYXRhKHJvd1tvQ29sLmF0dHJdLCByb3cpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldENvbHVtbkRhdGEob2NvbHVtbjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZWREYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICAvLyByZW5kZXIgZWFjaCBjb2x1bW5cbiAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgaWYgKG9jb2x1bW4pIHtcbiAgICAgICAgb2JqW29jb2x1bW5dID0gcm93W29jb2x1bW5dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVDb2x1bW5zRmlsdGVycyhmaWx0ZXJzOiBPQ29sdW1uVmFsdWVGaWx0ZXJbXSkge1xuICAgIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzID0gW107XG4gICAgZmlsdGVycy5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgICB0aGlzLmNvbHVtblZhbHVlRmlsdGVycy5wdXNoKGZpbHRlcik7XG4gICAgfSk7XG4gICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgaXNDb2x1bW5WYWx1ZUZpbHRlckFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMubGVuZ3RoICE9PSAwO1xuICB9XG5cbiAgZ2V0Q29sdW1uVmFsdWVGaWx0ZXJzKCk6IE9Db2x1bW5WYWx1ZUZpbHRlcltdIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnM7XG4gIH1cblxuICBnZXRDb2x1bW5WYWx1ZUZpbHRlckJ5QXR0cihhdHRyOiBzdHJpbmcpOiBPQ29sdW1uVmFsdWVGaWx0ZXIge1xuICAgIHJldHVybiB0aGlzLmNvbHVtblZhbHVlRmlsdGVycy5maWx0ZXIoaXRlbSA9PiBpdGVtLmF0dHIgPT09IGF0dHIpWzBdO1xuICB9XG5cbiAgY2xlYXJDb2x1bW5GaWx0ZXJzKHRyaWdnZXI6IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMgPSBbXTtcbiAgICBpZiAodHJpZ2dlcikge1xuICAgICAgdGhpcy5fY29sdW1uVmFsdWVGaWx0ZXJDaGFuZ2UubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyQ29sdW1uRmlsdGVyKGF0dHI6IHN0cmluZywgdHJpZ2dlcjogYm9vbGVhbiA9IHRydWUpIHtcbiAgICB0aGlzLmNvbHVtblZhbHVlRmlsdGVycyA9IHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmZpbHRlcih4ID0+IHguYXR0ciAhPT0gYXR0cik7XG4gICAgaWYgKHRyaWdnZXIpIHtcbiAgICAgIHRoaXMuX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBhZGRDb2x1bW5GaWx0ZXIoZmlsdGVyOiBPQ29sdW1uVmFsdWVGaWx0ZXIpIHtcbiAgICBjb25zdCBleGlzdGluZ0ZpbHRlciA9IHRoaXMuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJCeUF0dHIoZmlsdGVyLmF0dHIpO1xuICAgIGlmIChleGlzdGluZ0ZpbHRlcikge1xuICAgICAgY29uc3QgaWR4ID0gdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMuaW5kZXhPZihleGlzdGluZ0ZpbHRlcik7XG4gICAgICB0aGlzLmNvbHVtblZhbHVlRmlsdGVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTiA9PT0gZmlsdGVyLm9wZXJhdG9yICYmIGZpbHRlci52YWx1ZXMubGVuZ3RoID4gMCkgfHxcbiAgICAgIChDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMID09PSBmaWx0ZXIub3BlcmF0b3IgJiYgZmlsdGVyLnZhbHVlcykgfHxcbiAgICAgIChDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU4gPT09IGZpbHRlci5vcGVyYXRvciAmJiBmaWx0ZXIudmFsdWVzLmxlbmd0aCA9PT0gMikgfHxcbiAgICAgICgoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMID09PSBmaWx0ZXIub3BlcmF0b3IgfHwgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5NT1JFX0VRVUFMID09PSBmaWx0ZXIub3BlcmF0b3IpICYmIGZpbHRlci52YWx1ZXMpXG4gICAgKSB7XG4gICAgICB0aGlzLmNvbHVtblZhbHVlRmlsdGVycy5wdXNoKGZpbHRlcik7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRhYmxlIGlzIHBhZ2luYXRlZCwgZmlsdGVyIHdpbGwgYmUgYXBwbGllZCBvbiByZW1vdGUgcXVlcnlcbiAgICBpZiAoIXRoaXMudGFibGUucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBnZXRDb2x1bW5WYWx1ZUZpbHRlckRhdGEoZGF0YTogYW55W10pOiBhbnlbXSB7XG4gICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgY29uc3QgZmlsdGVyQ29sdW1uID0gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLmNvbHVtbnMuZmluZChjb2wgPT4gY29sLmF0dHIgPT09IGZpbHRlci5hdHRyKTtcbiAgICAgIGlmIChmaWx0ZXJDb2x1bW4pIHtcbiAgICAgICAgc3dpdGNoIChmaWx0ZXIub3BlcmF0b3IpIHtcbiAgICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU46XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZmlsdGVyQ29sdW1uLnJlbmRlcmVyICYmIGZpbHRlckNvbHVtbi5yZW5kZXJlci5maWx0ZXJGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJDb2x1bW4ucmVuZGVyZXIuZmlsdGVyRnVuY3Rpb24oaXRlbVtmaWx0ZXIuYXR0cl0sIGl0ZW0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbFZhbHVlcyA9IGZpbHRlckNvbHVtbi5nZXRGaWx0ZXJWYWx1ZShpdGVtW2ZpbHRlci5hdHRyXSwgaXRlbSkubWFwKGYgPT4gVXRpbC5ub3JtYWxpemVTdHJpbmcoZikpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbHRlclZhbHVlcyA9IGZpbHRlci52YWx1ZXMubWFwKGYgPT4gVXRpbC5ub3JtYWxpemVTdHJpbmcoZikpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWx0ZXJWYWx1ZXMuc29tZSh2YWx1ZSA9PiBjb2xWYWx1ZXMuaW5kZXhPZih2YWx1ZSkgIT09IC0xKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuRVFVQUw6XG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSBVdGlsLm5vcm1hbGl6ZVN0cmluZyhmaWx0ZXIudmFsdWVzKTtcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihpdGVtID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgY29sVmFsdWVzID0gZmlsdGVyQ29sdW1uLmdldEZpbHRlclZhbHVlKGl0ZW1bZmlsdGVyLmF0dHJdLCBpdGVtKS5tYXAoZiA9PiBVdGlsLm5vcm1hbGl6ZVN0cmluZyhmKSk7XG4gICAgICAgICAgICAgIGxldCByZWdFeHA7XG4gICAgICAgICAgICAgIGlmIChub3JtYWxpemVkVmFsdWUuaW5jbHVkZXMoJyonKSkge1xuICAgICAgICAgICAgICAgIHJlZ0V4cCA9IG5ldyBSZWdFeHAoJ14nICsgbm9ybWFsaXplZFZhbHVlLnNwbGl0KCcqJykuam9pbignLionKSArICckJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGNvbFZhbHVlcy5zb21lKGNvbFZhbHVlID0+IHJlZ0V4cCA/IHJlZ0V4cC50ZXN0KGNvbFZhbHVlKSA6IGNvbFZhbHVlLmluY2x1ZGVzKG5vcm1hbGl6ZWRWYWx1ZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTjpcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihpdGVtID0+IGl0ZW1bZmlsdGVyLmF0dHJdID49IGZpbHRlci52YWx1ZXNbMF0gJiYgaXRlbVtmaWx0ZXIuYXR0cl0gPD0gZmlsdGVyLnZhbHVlc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTDpcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLmZpbHRlcihpdGVtID0+IGl0ZW1bZmlsdGVyLmF0dHJdID49IGZpbHRlci52YWx1ZXMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkxFU1NfRVFVQUw6XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtW2ZpbHRlci5hdHRyXSA8PSBmaWx0ZXIudmFsdWVzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBnZXRBZ2dyZWdhdGVEYXRhKGNvbHVtbjogT0NvbHVtbikge1xuICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgIGxldCB0b3RhbFZhbHVlID0gJyc7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuX3RhYmxlT3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBuZXcgQXJyYXkob2JqKTtcbiAgICB9XG4gICAgdG90YWxWYWx1ZSA9IHRoaXMuYWdncmVnYXRlRGF0YVtjb2x1bW4uYXR0cl07XG4gICAgcmV0dXJuIHRvdGFsVmFsdWU7XG4gIH1cblxuICBjYWxjdWxhdGVBZ2dyZWdhdGUoZGF0YTogYW55W10sIGNvbHVtbjogT0NvbHVtbik6IGFueSB7XG4gICAgbGV0IHJlc3VsdEFnZ3JlZ2F0ZTtcbiAgICBjb25zdCBvcGVyYXRvciA9IGNvbHVtbi5hZ2dyZWdhdGUub3BlcmF0b3I7XG4gICAgaWYgKHR5cGVvZiBvcGVyYXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN3aXRjaCAob3BlcmF0b3IudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICBjYXNlICdjb3VudCc6XG4gICAgICAgICAgcmVzdWx0QWdncmVnYXRlID0gdGhpcy5jb3VudChjb2x1bW4uYXR0ciwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ21pbic6XG4gICAgICAgICAgcmVzdWx0QWdncmVnYXRlID0gdGhpcy5taW4oY29sdW1uLmF0dHIsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtYXgnOlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMubWF4KGNvbHVtbi5hdHRyLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYXZnJzpcbiAgICAgICAgICByZXN1bHRBZ2dyZWdhdGUgPSB0aGlzLmF2Zyhjb2x1bW4uYXR0ciwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmVzdWx0QWdncmVnYXRlID0gdGhpcy5zdW0oY29sdW1uLmF0dHIsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb2x1bW5EYXRhOiBhbnlbXSA9IHRoaXMuZ2V0Q29sdW1uRGF0YShjb2x1bW4uYXR0cik7XG4gICAgICBpZiAodHlwZW9mIG9wZXJhdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IG9wZXJhdG9yKGNvbHVtbkRhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0QWdncmVnYXRlO1xuICB9XG5cbiAgc3VtKGNvbHVtbiwgZGF0YSk6IG51bWJlciB7XG4gICAgbGV0IHZhbHVlID0gMDtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdmFsdWUgPSBkYXRhLnJlZHVjZSgoYWN1bXVsYXRvciwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICAgIHJldHVybiBhY3VtdWxhdG9yICsgKGlzTmFOKGN1cnJlbnRWYWx1ZVtjb2x1bW5dKSA/IDAgOiBjdXJyZW50VmFsdWVbY29sdW1uXSk7XG4gICAgICB9LCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGNvdW50KGNvbHVtbiwgZGF0YSk6IG51bWJlciB7XG4gICAgbGV0IHZhbHVlID0gMDtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdmFsdWUgPSBkYXRhLnJlZHVjZSgoYWN1bXVsYXRvciwgY3VycmVudFZhbHVlLCBjdXJyZW50SW5kZXgpID0+IHtcbiAgICAgICAgcmV0dXJuIGFjdW11bGF0b3IgKyAxO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGF2Zyhjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnN1bShjb2x1bW4sIGRhdGEpIC8gdGhpcy5jb3VudChjb2x1bW4sIGRhdGEpO1xuICB9XG5cbiAgbWluKGNvbHVtbiwgZGF0YSk6IG51bWJlciB7XG4gICAgY29uc3QgdGVtcE1pbiA9IGRhdGEubWFwKHggPT4geFtjb2x1bW5dKTtcbiAgICByZXR1cm4gTWF0aC5taW4oLi4udGVtcE1pbik7XG4gIH1cblxuICBtYXgoY29sdW1uLCBkYXRhKTogbnVtYmVyIHtcbiAgICBjb25zdCB0ZW1wTWluID0gZGF0YS5tYXAoeCA9PiB4W2NvbHVtbl0pO1xuICAgIHJldHVybiBNYXRoLm1heCguLi50ZW1wTWluKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBleGlzdHNBbnlDYWxjdWxhdGVkQ29sdW1uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl90YWJsZU9wdGlvbnMuY29sdW1ucy5maW5kKChvQ29sOiBPQ29sdW1uKSA9PiBvQ29sLmNhbGN1bGF0ZSAhPT0gdW5kZWZpbmVkKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdXBkYXRlUmVuZGVyZWRSb3dEYXRhKHJvd0RhdGE6IGFueSkge1xuICAgIGNvbnN0IHRhYmxlS2V5cyA9IHRoaXMudGFibGUuZ2V0S2V5cygpO1xuICAgIGNvbnN0IHJlY29yZCA9IHRoaXMucmVuZGVyZWREYXRhLmZpbmQoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgbGV0IGZvdW5kID0gdHJ1ZTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0YWJsZUtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGFibGVLZXlzW2ldO1xuICAgICAgICBpZiAoZGF0YVtrZXldICE9PSByb3dEYXRhW2tleV0pIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHJlY29yZCkpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocmVjb3JkLCByb3dEYXRhKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbiJdfQ==