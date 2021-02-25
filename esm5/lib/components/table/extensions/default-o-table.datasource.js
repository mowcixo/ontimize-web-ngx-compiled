import * as tslib_1 from "tslib";
import { DataSource } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject, merge, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColumnValueFilterOperator } from '../../../types/o-column-value-filter.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
export var SCROLLVIRTUAL = 'scroll';
var OTableScrollEvent = (function () {
    function OTableScrollEvent(data) {
        this.data = data;
        this.type = SCROLLVIRTUAL;
    }
    return OTableScrollEvent;
}());
export { OTableScrollEvent };
var DefaultOTableDataSource = (function (_super) {
    tslib_1.__extends(DefaultOTableDataSource, _super);
    function DefaultOTableDataSource(table) {
        var _this = _super.call(this) || this;
        _this.table = table;
        _this.dataTotalsChange = new BehaviorSubject([]);
        _this._quickFilterChange = new BehaviorSubject('');
        _this._columnValueFilterChange = new Subject();
        _this._loadDataScrollableChange = new BehaviorSubject(new OTableScrollEvent(1));
        _this.filteredData = [];
        _this.aggregateData = {};
        _this.onRenderedDataChange = new EventEmitter();
        _this._renderedData = [];
        _this.resultsLength = 0;
        _this.columnValueFilters = [];
        _this._database = table.daoTable;
        if (_this._database) {
            _this.resultsLength = _this._database.data.length;
        }
        if (table.paginator) {
            _this._paginator = table.matpaginator;
        }
        _this._tableOptions = table.oTableOptions;
        _this._sort = table.sort;
        return _this;
    }
    Object.defineProperty(DefaultOTableDataSource.prototype, "data", {
        get: function () { return this.dataTotalsChange.value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultOTableDataSource.prototype, "loadDataScrollable", {
        get: function () { return this._loadDataScrollableChange.getValue().data || 1; },
        set: function (page) {
            this._loadDataScrollableChange.next(new OTableScrollEvent(page));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultOTableDataSource.prototype, "quickFilter", {
        get: function () { return this._quickFilterChange.value || ''; },
        set: function (filter) {
            this._quickFilterChange.next(filter);
        },
        enumerable: true,
        configurable: true
    });
    DefaultOTableDataSource.prototype.sortFunction = function (a, b) {
        return this._sort.sortFunction(a, b);
    };
    Object.defineProperty(DefaultOTableDataSource.prototype, "renderedData", {
        get: function () {
            return this._renderedData;
        },
        set: function (arg) {
            this._renderedData = arg;
            this.onRenderedDataChange.emit();
        },
        enumerable: true,
        configurable: true
    });
    DefaultOTableDataSource.prototype.connect = function () {
        var _this = this;
        var displayDataChanges = [
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
        return merge.apply(void 0, tslib_1.__spread(displayDataChanges)).pipe(map(function (x) {
            var data = Object.assign([], _this._database.data);
            if (x instanceof OTableScrollEvent) {
                _this.renderedData = data.slice(0, (x.data * Codes.LIMIT_SCROLLVIRTUAL) - 1);
            }
            else {
                if (_this.existsAnyCalculatedColumn()) {
                    data = _this.getColumnCalculatedData(data);
                }
                if (!_this.table.pageable) {
                    data = _this.getColumnValueFilterData(data);
                    data = _this.getQuickFilterData(data);
                    data = _this.getSortedData(data);
                }
                _this.filteredData = Object.assign([], data);
                if (_this.table.pageable) {
                    var totalRecordsNumber = _this.table.getTotalRecordsNumber();
                    _this.resultsLength = totalRecordsNumber !== undefined ? totalRecordsNumber : data.length;
                }
                else {
                    _this.resultsLength = data.length;
                    data = _this.getPaginationData(data);
                }
                if (!_this.table.pageable && !_this.table.paginationControls && data.length > Codes.LIMIT_SCROLLVIRTUAL) {
                    var datapaginate = data.slice(0, (_this.table.pageScrollVirtual * Codes.LIMIT_SCROLLVIRTUAL) - 1);
                    data = datapaginate;
                }
                _this.renderedData = data;
                _this.aggregateData = _this.getAggregatesData(data);
            }
            return _this.renderedData;
        }));
    };
    DefaultOTableDataSource.prototype.getAggregatesData = function (data) {
        var self = this;
        var obj = {};
        if (typeof this._tableOptions === 'undefined') {
            return obj;
        }
        this._tableOptions.columns.forEach(function (column) {
            var totalValue = '';
            if (column.aggregate && column.visible) {
                totalValue = self.calculateAggregate(data, column);
            }
            var key = column.attr;
            obj[key] = totalValue;
        });
        return obj;
    };
    DefaultOTableDataSource.prototype.getColumnCalculatedData = function (data) {
        var self = this;
        var calculatedCols = this._tableOptions.columns.filter(function (oCol) { return oCol.visible && oCol.calculate !== undefined; });
        return data.map(function (row) {
            calculatedCols.forEach(function (oColumn) {
                var value;
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
    };
    DefaultOTableDataSource.prototype.transformFormula = function (formulaArg, row) {
        var formula = formulaArg;
        var columnsAttr = this._tableOptions.columns.map(function (oCol) { return oCol.attr; });
        columnsAttr.forEach(function (column) {
            formula = formula.replace(column, row[column]);
        });
        var resultFormula = '';
        try {
            resultFormula = (new Function('return ' + formula))();
        }
        catch (e) {
            console.error('Operation defined in the calculated column is incorrect ');
        }
        return resultFormula;
    };
    DefaultOTableDataSource.prototype.getQuickFilterData = function (data) {
        var _this = this;
        var filterData = this.quickFilter;
        if (filterData !== undefined && filterData.length > 0) {
            if (!this._tableOptions.filterCaseSensitive) {
                filterData = filterData.toLowerCase();
            }
            return data.filter(function (item) {
                var passCustomFilter = _this.fulfillsCustomFilterFunctions(filterData, item);
                var passSearchString = _this.fulfillsQuickfilter(filterData, item);
                return passCustomFilter || passSearchString;
            });
        }
        else {
            return data;
        }
    };
    DefaultOTableDataSource.prototype.getPaginationData = function (data) {
        if (!this._paginator || isNaN(this._paginator.pageSize)) {
            return data;
        }
        var startIndex = isNaN(this._paginator.pageSize) ? 0 : this._paginator.pageIndex * this._paginator.pageSize;
        if (data.length > 0 && data.length < startIndex) {
            startIndex = 0;
            this._paginator.pageIndex = 0;
        }
        return data.splice(startIndex, this._paginator.pageSize);
    };
    DefaultOTableDataSource.prototype.disconnect = function () {
        this.onRenderedDataChange.complete();
        this.dataTotalsChange.complete();
        this._quickFilterChange.complete();
        this._columnValueFilterChange.complete();
        this._loadDataScrollableChange.complete();
    };
    DefaultOTableDataSource.prototype.fulfillsCustomFilterFunctions = function (filter, item) {
        var customFilterCols = this.table.oTableOptions.columns.filter(function (oCol) { return oCol.useCustomFilterFunction(); });
        return customFilterCols.some(function (oCol) { return oCol.renderer.filterFunction(item[oCol.attr], item, filter); });
    };
    DefaultOTableDataSource.prototype.fulfillsQuickfilter = function (filter, item) {
        var columns = this._tableOptions.columns.filter(function (oCol) { return oCol.useQuickfilterFunction(); });
        var searchStr = columns.map(function (oCol) { return oCol.getFilterValue(item[oCol.attr], item).join(' '); }).join(' ');
        if (!this._tableOptions.filterCaseSensitive) {
            searchStr = searchStr.toLowerCase();
        }
        return searchStr.indexOf(filter) !== -1;
    };
    DefaultOTableDataSource.prototype.getSortedData = function (data) {
        return this._sort.getSortedData(data);
    };
    DefaultOTableDataSource.prototype.getTableData = function () {
        return this._database.data;
    };
    DefaultOTableDataSource.prototype.getCurrentData = function () {
        return this.getData();
    };
    DefaultOTableDataSource.prototype.getCurrentAllData = function () {
        return this.getAllData(false, false);
    };
    DefaultOTableDataSource.prototype.getCurrentRendererData = function () {
        return this.getRenderedData(this.renderedData);
    };
    DefaultOTableDataSource.prototype.getAllRendererData = function () {
        return this.getAllData(true, true);
    };
    Object.defineProperty(DefaultOTableDataSource.prototype, "sqlTypes", {
        get: function () {
            return this._database.sqlTypes;
        },
        enumerable: true,
        configurable: true
    });
    DefaultOTableDataSource.prototype.getData = function () {
        return this.renderedData;
    };
    DefaultOTableDataSource.prototype.getRenderedData = function (data) {
        var visibleColumns = this._tableOptions.columns.filter(function (oCol) { return oCol.visible; });
        return data.map(function (row) {
            var obj = {};
            visibleColumns.forEach(function (oCol) {
                var useRenderer = oCol.renderer && oCol.renderer.getCellData;
                obj[oCol.attr] = useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
            });
            return obj;
        });
    };
    DefaultOTableDataSource.prototype.getAllData = function (usingRendererers, onlyVisibleColumns) {
        var tableColumns = this._tableOptions.columns;
        if (onlyVisibleColumns) {
            tableColumns = this._tableOptions.columns.filter(function (oCol) { return oCol.visible; });
        }
        return this.filteredData.map(function (row) {
            var obj = {};
            tableColumns.forEach(function (oCol) {
                var useRenderer = usingRendererers && oCol.renderer && oCol.renderer.getCellData;
                obj[oCol.attr] = useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
            });
            return obj;
        });
    };
    DefaultOTableDataSource.prototype.getRenderersData = function (data, tableColumns) {
        return data.map(function (row) {
            var obj = Object.assign({}, row);
            tableColumns.forEach(function (oCol) {
                obj[oCol.attr] = oCol.renderer.getCellData(row[oCol.attr], row);
            });
            return obj;
        });
    };
    DefaultOTableDataSource.prototype.getColumnData = function (ocolumn) {
        return this.renderedData.map(function (row) {
            var obj = {};
            if (ocolumn) {
                obj[ocolumn] = row[ocolumn];
            }
            return obj;
        });
    };
    DefaultOTableDataSource.prototype.initializeColumnsFilters = function (filters) {
        var _this = this;
        this.columnValueFilters = [];
        filters.forEach(function (filter) {
            _this.columnValueFilters.push(filter);
        });
        if (!this.table.pageable) {
            this._columnValueFilterChange.next();
        }
    };
    DefaultOTableDataSource.prototype.isColumnValueFilterActive = function () {
        return this.columnValueFilters.length !== 0;
    };
    DefaultOTableDataSource.prototype.getColumnValueFilters = function () {
        return this.columnValueFilters;
    };
    DefaultOTableDataSource.prototype.getColumnValueFilterByAttr = function (attr) {
        return this.columnValueFilters.filter(function (item) { return item.attr === attr; })[0];
    };
    DefaultOTableDataSource.prototype.clearColumnFilters = function (trigger) {
        if (trigger === void 0) { trigger = true; }
        this.columnValueFilters = [];
        if (trigger) {
            this._columnValueFilterChange.next();
        }
    };
    DefaultOTableDataSource.prototype.addColumnFilter = function (filter) {
        var existingFilter = this.getColumnValueFilterByAttr(filter.attr);
        if (existingFilter) {
            var idx = this.columnValueFilters.indexOf(existingFilter);
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
    };
    DefaultOTableDataSource.prototype.getColumnValueFilterData = function (data) {
        var _this = this;
        this.columnValueFilters.forEach(function (filter) {
            var filterColumn = _this.table.oTableOptions.columns.find(function (col) { return col.attr === filter.attr; });
            if (filterColumn) {
                switch (filter.operator) {
                    case ColumnValueFilterOperator.IN:
                        data = data.filter(function (item) {
                            if (filterColumn.renderer && filterColumn.renderer.filterFunction) {
                                return filterColumn.renderer.filterFunction(item[filter.attr], item);
                            }
                            else {
                                var colValues_1 = filterColumn.getFilterValue(item[filter.attr], item).map(function (f) { return Util.normalizeString(f); });
                                var filterValues = filter.values.map(function (f) { return Util.normalizeString(f); });
                                return filterValues.some(function (value) { return colValues_1.indexOf(value) !== -1; });
                            }
                        });
                        break;
                    case ColumnValueFilterOperator.EQUAL:
                        var normalizedValue_1 = Util.normalizeString(filter.values);
                        data = data.filter(function (item) {
                            var colValues = filterColumn.getFilterValue(item[filter.attr], item).map(function (f) { return Util.normalizeString(f); });
                            var regExp;
                            if (normalizedValue_1.includes('*')) {
                                regExp = new RegExp('^' + normalizedValue_1.split('*').join('.*') + '$');
                            }
                            return colValues.some(function (colValue) { return regExp ? regExp.test(colValue) : colValue.includes(normalizedValue_1); });
                        });
                        break;
                    case ColumnValueFilterOperator.BETWEEN:
                        data = data.filter(function (item) { return item[filter.attr] >= filter.values[0] && item[filter.attr] <= filter.values[1]; });
                        break;
                    case ColumnValueFilterOperator.MORE_EQUAL:
                        data = data.filter(function (item) { return item[filter.attr] >= filter.values; });
                        break;
                    case ColumnValueFilterOperator.LESS_EQUAL:
                        data = data.filter(function (item) { return item[filter.attr] <= filter.values; });
                        break;
                }
            }
        });
        return data;
    };
    DefaultOTableDataSource.prototype.getAggregateData = function (column) {
        var obj = {};
        var totalValue = '';
        if (typeof this._tableOptions === 'undefined') {
            return new Array(obj);
        }
        totalValue = this.aggregateData[column.attr];
        return totalValue;
    };
    DefaultOTableDataSource.prototype.calculateAggregate = function (data, column) {
        var resultAggregate;
        var operator = column.aggregate.operator;
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
            var columnData = this.getColumnData(column.attr);
            if (typeof operator === 'function') {
                resultAggregate = operator(columnData);
            }
        }
        return resultAggregate;
    };
    DefaultOTableDataSource.prototype.sum = function (column, data) {
        var value = 0;
        if (data) {
            value = data.reduce(function (acumulator, currentValue) {
                return acumulator + (isNaN(currentValue[column]) ? 0 : currentValue[column]);
            }, value);
        }
        return value;
    };
    DefaultOTableDataSource.prototype.count = function (column, data) {
        var value = 0;
        if (data) {
            value = data.reduce(function (acumulator, currentValue, currentIndex) {
                return acumulator + 1;
            }, 0);
        }
        return value;
    };
    DefaultOTableDataSource.prototype.avg = function (column, data) {
        return this.sum(column, data) / this.count(column, data);
    };
    DefaultOTableDataSource.prototype.min = function (column, data) {
        var tempMin = data.map(function (x) { return x[column]; });
        return Math.min.apply(Math, tslib_1.__spread(tempMin));
    };
    DefaultOTableDataSource.prototype.max = function (column, data) {
        var tempMin = data.map(function (x) { return x[column]; });
        return Math.max.apply(Math, tslib_1.__spread(tempMin));
    };
    DefaultOTableDataSource.prototype.existsAnyCalculatedColumn = function () {
        return this._tableOptions.columns.find(function (oCol) { return oCol.calculate !== undefined; }) !== undefined;
    };
    DefaultOTableDataSource.prototype.updateRenderedRowData = function (rowData) {
        var tableKeys = this.table.getKeys();
        var record = this.renderedData.find(function (data) {
            var found = true;
            for (var i = 0, len = tableKeys.length; i < len; i++) {
                var key = tableKeys[i];
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
    };
    return DefaultOTableDataSource;
}(DataSource));
export { DefaultOTableDataSource };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1vLXRhYmxlLmRhdGFzb3VyY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kZWZhdWx0LW8tdGFibGUuZGF0YXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ25FLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUlyQyxPQUFPLEVBQUUseUJBQXlCLEVBQXNCLE1BQU0sMkNBQTJDLENBQUM7QUFDMUcsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQU0xQyxNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDO0FBT3RDO0lBSUUsMkJBQVksSUFBWTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQzs7QUFFRDtJQUE2QyxtREFBZTtJQWtDMUQsaUNBQXNCLEtBQXNCO1FBQTVDLFlBQ0UsaUJBQU8sU0FVUjtRQVhxQixXQUFLLEdBQUwsS0FBSyxDQUFpQjtRQWpDNUMsc0JBQWdCLEdBQUcsSUFBSSxlQUFlLENBQVEsRUFBRSxDQUFDLENBQUM7UUFReEMsd0JBQWtCLEdBQUcsSUFBSSxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsOEJBQXdCLEdBQUcsSUFBSSxPQUFPLEVB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QTVCLENBQTRCLENBQUMsS0FBSyxTQUFTLENBQUM7SUFDeEcsQ0FBQztJQUVELHVEQUFxQixHQUFyQixVQUFzQixPQUFZO1FBQ2hDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFTO1lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwRCxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDOUIsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDZCxNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQTlnQkQsQ0FBNkMsVUFBVSxHQThnQnREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGF0YVNvdXJjZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFBhZ2luYXRvciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgT1RhYmxlRGF0YVNvdXJjZSB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1kYXRhc291cmNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IsIE9Db2x1bW5WYWx1ZUZpbHRlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLXZhbHVlLWZpbHRlci50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRGFvIH0gZnJvbSAnLi9vLXRhYmxlLmRhbyc7XG5pbXBvcnQgeyBPTWF0U29ydCB9IGZyb20gJy4vc29ydC9vLW1hdC1zb3J0JztcblxuZXhwb3J0IGNvbnN0IFNDUk9MTFZJUlRVQUwgPSAnc2Nyb2xsJztcblxuZXhwb3J0IGludGVyZmFjZSBJVGFibGVPU2Nyb2xsRXZlbnQge1xuICB0eXBlOiBzdHJpbmc7XG4gIGRhdGE6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIE9UYWJsZVNjcm9sbEV2ZW50IGltcGxlbWVudHMgSVRhYmxlT1Njcm9sbEV2ZW50IHtcbiAgcHVibGljIGRhdGE6IG51bWJlcjtcbiAgcHVibGljIHR5cGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihkYXRhOiBudW1iZXIpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMudHlwZSA9IFNDUk9MTFZJUlRVQUw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlZmF1bHRPVGFibGVEYXRhU291cmNlIGV4dGVuZHMgRGF0YVNvdXJjZTxhbnk+IGltcGxlbWVudHMgT1RhYmxlRGF0YVNvdXJjZSB7XG4gIGRhdGFUb3RhbHNDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGFueVtdPihbXSk7XG4gIGdldCBkYXRhKCk6IGFueVtdIHsgcmV0dXJuIHRoaXMuZGF0YVRvdGFsc0NoYW5nZS52YWx1ZTsgfVxuXG4gIHByb3RlY3RlZCBfZGF0YWJhc2U6IE9UYWJsZURhbztcbiAgcHJvdGVjdGVkIF9wYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcbiAgcHJvdGVjdGVkIF90YWJsZU9wdGlvbnM6IE9UYWJsZU9wdGlvbnM7XG4gIHByb3RlY3RlZCBfc29ydDogT01hdFNvcnQ7XG5cbiAgcHJvdGVjdGVkIF9xdWlja0ZpbHRlckNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3QoJycpO1xuICBwcm90ZWN0ZWQgX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlID0gbmV3IFN1YmplY3QoKTtcbiAgcHJvdGVjdGVkIF9sb2FkRGF0YVNjcm9sbGFibGVDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE9UYWJsZVNjcm9sbEV2ZW50PihuZXcgT1RhYmxlU2Nyb2xsRXZlbnQoMSkpO1xuXG4gIHByb3RlY3RlZCBmaWx0ZXJlZERhdGE6IGFueVtdID0gW107XG4gIHByb3RlY3RlZCBhZ2dyZWdhdGVEYXRhOiBhbnkgPSB7fTtcblxuICBvblJlbmRlcmVkRGF0YUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvLyBsb2FkIGRhdGEgaW4gc2Nyb2xsXG4gIGdldCBsb2FkRGF0YVNjcm9sbGFibGUoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2xvYWREYXRhU2Nyb2xsYWJsZUNoYW5nZS5nZXRWYWx1ZSgpLmRhdGEgfHwgMTsgfVxuICBzZXQgbG9hZERhdGFTY3JvbGxhYmxlKHBhZ2U6IG51bWJlcikge1xuICAgIHRoaXMuX2xvYWREYXRhU2Nyb2xsYWJsZUNoYW5nZS5uZXh0KG5ldyBPVGFibGVTY3JvbGxFdmVudChwYWdlKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3JlbmRlcmVkRGF0YTogYW55W10gPSBbXTtcbiAgcmVzdWx0c0xlbmd0aDogbnVtYmVyID0gMDtcblxuICBnZXQgcXVpY2tGaWx0ZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX3F1aWNrRmlsdGVyQ2hhbmdlLnZhbHVlIHx8ICcnOyB9XG4gIHNldCBxdWlja0ZpbHRlcihmaWx0ZXI6IHN0cmluZykge1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyQ2hhbmdlLm5leHQoZmlsdGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgY29sdW1uVmFsdWVGaWx0ZXJzOiBBcnJheTxPQ29sdW1uVmFsdWVGaWx0ZXI+ID0gW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2RhdGFiYXNlID0gdGFibGUuZGFvVGFibGU7XG4gICAgaWYgKHRoaXMuX2RhdGFiYXNlKSB7XG4gICAgICB0aGlzLnJlc3VsdHNMZW5ndGggPSB0aGlzLl9kYXRhYmFzZS5kYXRhLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKHRhYmxlLnBhZ2luYXRvcikge1xuICAgICAgdGhpcy5fcGFnaW5hdG9yID0gdGFibGUubWF0cGFnaW5hdG9yO1xuICAgIH1cbiAgICB0aGlzLl90YWJsZU9wdGlvbnMgPSB0YWJsZS5vVGFibGVPcHRpb25zO1xuICAgIHRoaXMuX3NvcnQgPSB0YWJsZS5zb3J0O1xuICB9XG5cbiAgc29ydEZ1bmN0aW9uKGE6IGFueSwgYjogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5zb3J0RnVuY3Rpb24oYSwgYik7XG4gIH1cblxuICBnZXQgcmVuZGVyZWREYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyZWREYXRhO1xuICB9XG5cbiAgc2V0IHJlbmRlcmVkRGF0YShhcmc6IGFueVtdKSB7XG4gICAgdGhpcy5fcmVuZGVyZWREYXRhID0gYXJnO1xuICAgIHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3QgZnVuY3Rpb24gY2FsbGVkIGJ5IHRoZSB0YWJsZSB0byByZXRyaWV2ZSBvbmUgc3RyZWFtIGNvbnRhaW5pbmcgdGhlIGRhdGEgdG8gcmVuZGVyLlxuICAgKi9cbiAgY29ubmVjdCgpOiBPYnNlcnZhYmxlPGFueVtdPiB7XG4gICAgY29uc3QgZGlzcGxheURhdGFDaGFuZ2VzOiBhbnlbXSA9IFtcbiAgICAgIHRoaXMuX2RhdGFiYXNlLmRhdGFDaGFuZ2VcbiAgICBdO1xuXG4gICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG5cbiAgICAgIGlmICh0aGlzLl9zb3J0KSB7XG4gICAgICAgIGRpc3BsYXlEYXRhQ2hhbmdlcy5wdXNoKHRoaXMuX3NvcnQub1NvcnRDaGFuZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fdGFibGVPcHRpb25zLmZpbHRlcikge1xuICAgICAgICBkaXNwbGF5RGF0YUNoYW5nZXMucHVzaCh0aGlzLl9xdWlja0ZpbHRlckNoYW5nZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9wYWdpbmF0b3IpIHtcbiAgICAgICAgZGlzcGxheURhdGFDaGFuZ2VzLnB1c2godGhpcy5fcGFnaW5hdG9yLnBhZ2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheURhdGFDaGFuZ2VzLnB1c2godGhpcy5fbG9hZERhdGFTY3JvbGxhYmxlQ2hhbmdlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy50YWJsZS5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICBkaXNwbGF5RGF0YUNoYW5nZXMucHVzaCh0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlKC4uLmRpc3BsYXlEYXRhQ2hhbmdlcykucGlwZShtYXAoKHg6IGFueSkgPT4ge1xuICAgICAgbGV0IGRhdGEgPSBPYmplY3QuYXNzaWduKFtdLCB0aGlzLl9kYXRhYmFzZS5kYXRhKTtcbiAgICAgIC8qXG4gICAgICAgIGl0IGlzIG5lY2Vzc2FyeSB0byBmaXJzdCBjYWxjdWxhdGUgdGhlIGNhbGN1bGF0ZWQgY29sdW1ucyBhbmRcbiAgICAgICAgdGhlbiBmaWx0ZXIgYW5kIHNvcnQgdGhlIGRhdGFcbiAgICAgICovXG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIE9UYWJsZVNjcm9sbEV2ZW50KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZWREYXRhID0gZGF0YS5zbGljZSgwLCAoeC5kYXRhICogQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCkgLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmV4aXN0c0FueUNhbGN1bGF0ZWRDb2x1bW4oKSkge1xuICAgICAgICAgIGRhdGEgPSB0aGlzLmdldENvbHVtbkNhbGN1bGF0ZWREYXRhKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG4gICAgICAgICAgZGF0YSA9IHRoaXMuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJEYXRhKGRhdGEpO1xuICAgICAgICAgIGRhdGEgPSB0aGlzLmdldFF1aWNrRmlsdGVyRGF0YShkYXRhKTtcbiAgICAgICAgICBkYXRhID0gdGhpcy5nZXRTb3J0ZWREYXRhKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWx0ZXJlZERhdGEgPSBPYmplY3QuYXNzaWduKFtdLCBkYXRhKTtcblxuICAgICAgICBpZiAodGhpcy50YWJsZS5wYWdlYWJsZSkge1xuICAgICAgICAgIGNvbnN0IHRvdGFsUmVjb3Jkc051bWJlciA9IHRoaXMudGFibGUuZ2V0VG90YWxSZWNvcmRzTnVtYmVyKCk7XG4gICAgICAgICAgdGhpcy5yZXN1bHRzTGVuZ3RoID0gdG90YWxSZWNvcmRzTnVtYmVyICE9PSB1bmRlZmluZWQgPyB0b3RhbFJlY29yZHNOdW1iZXIgOiBkYXRhLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlc3VsdHNMZW5ndGggPSBkYXRhLmxlbmd0aDtcbiAgICAgICAgICBkYXRhID0gdGhpcy5nZXRQYWdpbmF0aW9uRGF0YShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBpbiBwYWdpbmF0aW9uIHZpcnR1YWwgb25seSBzaG93IE9UYWJsZUNvbXBvbmVudC5MSU1JVCBpdGVtcyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlIG9mIHRoZSB0YWJsZSAqL1xuICAgICAgICBpZiAoIXRoaXMudGFibGUucGFnZWFibGUgJiYgIXRoaXMudGFibGUucGFnaW5hdGlvbkNvbnRyb2xzICYmIGRhdGEubGVuZ3RoID4gQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCkge1xuICAgICAgICAgIGNvbnN0IGRhdGFwYWdpbmF0ZSA9IGRhdGEuc2xpY2UoMCwgKHRoaXMudGFibGUucGFnZVNjcm9sbFZpcnR1YWwgKiBDb2Rlcy5MSU1JVF9TQ1JPTExWSVJUVUFMKSAtIDEpO1xuICAgICAgICAgIGRhdGEgPSBkYXRhcGFnaW5hdGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbmRlcmVkRGF0YSA9IGRhdGE7XG4gICAgICAgIC8vIElmIGEgby10YWJsZS1jb2x1bW4tYWdncmVnYXRlIGV4aXN0cyB0aGVuIGVtaXQgb2JzZXJ2YWJsZVxuICAgICAgICAvLyBpZiAodGhpcy50YWJsZS5zaG93VG90YWxzKSB7XG4gICAgICAgIC8vICAgdGhpcy5kYXRhVG90YWxzQ2hhbmdlLm5leHQodGhpcy5yZW5kZXJlZERhdGEpO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgdGhpcy5hZ2dyZWdhdGVEYXRhID0gdGhpcy5nZXRBZ2dyZWdhdGVzRGF0YShkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlbmRlcmVkRGF0YTtcbiAgICB9KSk7XG4gIH1cblxuICBnZXRBZ2dyZWdhdGVzRGF0YShkYXRhOiBhbnlbXSk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JqID0ge307XG5cbiAgICBpZiAodHlwZW9mIHRoaXMuX3RhYmxlT3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuXG4gICAgdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZm9yRWFjaCgoY29sdW1uOiBPQ29sdW1uKSA9PiB7XG4gICAgICBsZXQgdG90YWxWYWx1ZSA9ICcnO1xuICAgICAgaWYgKGNvbHVtbi5hZ2dyZWdhdGUgJiYgY29sdW1uLnZpc2libGUpIHtcbiAgICAgICAgdG90YWxWYWx1ZSA9IHNlbGYuY2FsY3VsYXRlQWdncmVnYXRlKGRhdGEsIGNvbHVtbik7XG4gICAgICB9XG4gICAgICBjb25zdCBrZXkgPSBjb2x1bW4uYXR0cjtcbiAgICAgIG9ialtrZXldID0gdG90YWxWYWx1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHRoYXQgZ2V0IHZhbHVlIHRoZSBjb2x1bW5zIGNhbGN1bGF0ZWRcbiAgICogQHBhcmFtIGRhdGEgZGF0YSBvZiB0aGUgZGF0YWJhc2VcbiAgICovXG4gIGdldENvbHVtbkNhbGN1bGF0ZWREYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGNhbGN1bGF0ZWRDb2xzID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKChvQ29sOiBPQ29sdW1uKSA9PiBvQ29sLnZpc2libGUgJiYgb0NvbC5jYWxjdWxhdGUgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIGRhdGEubWFwKChyb3c6IGFueSkgPT4ge1xuICAgICAgY2FsY3VsYXRlZENvbHMuZm9yRWFjaCgob0NvbHVtbjogT0NvbHVtbikgPT4ge1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2Ygb0NvbHVtbi5jYWxjdWxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdmFsdWUgPSBzZWxmLnRyYW5zZm9ybUZvcm11bGEob0NvbHVtbi5jYWxjdWxhdGUsIHJvdyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9Db2x1bW4uY2FsY3VsYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFsdWUgPSBvQ29sdW1uLmNhbGN1bGF0ZShyb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJvd1tvQ29sdW1uLmF0dHJdID0gaXNOYU4odmFsdWUpID8gMCA6IHZhbHVlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcm93O1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRyYW5zZm9ybUZvcm11bGEoZm9ybXVsYUFyZywgcm93KTogc3RyaW5nIHtcbiAgICBsZXQgZm9ybXVsYSA9IGZvcm11bGFBcmc7XG4gICAgLy8gMS4gcmVwbGFjZSBjb2x1bW5zIGJ5IHZhbHVlcyBvZiByb3dcbiAgICBjb25zdCBjb2x1bW5zQXR0ciA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLm1hcCgob0NvbDogT0NvbHVtbikgPT4gb0NvbC5hdHRyKTtcbiAgICBjb2x1bW5zQXR0ci5mb3JFYWNoKChjb2x1bW46IHN0cmluZykgPT4ge1xuICAgICAgZm9ybXVsYSA9IGZvcm11bGEucmVwbGFjZShjb2x1bW4sIHJvd1tjb2x1bW5dKTtcbiAgICB9KTtcblxuICAgIGxldCByZXN1bHRGb3JtdWxhID0gJyc7XG4gICAgLy8gMi4gVHJhbnNmb3JtIGZvcm11bGFcbiAgICB0cnkge1xuICAgICAgcmVzdWx0Rm9ybXVsYSA9IChuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgZm9ybXVsYSkpKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcignT3BlcmF0aW9uIGRlZmluZWQgaW4gdGhlIGNhbGN1bGF0ZWQgY29sdW1uIGlzIGluY29ycmVjdCAnKTtcbiAgICB9XG4gICAgLy8gMy4gUmV0dXJuIHJlc3VsdFxuICAgIHJldHVybiByZXN1bHRGb3JtdWxhO1xuICB9XG5cbiAgZ2V0UXVpY2tGaWx0ZXJEYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIGxldCBmaWx0ZXJEYXRhID0gdGhpcy5xdWlja0ZpbHRlcjtcbiAgICBpZiAoZmlsdGVyRGF0YSAhPT0gdW5kZWZpbmVkICYmIGZpbHRlckRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCF0aGlzLl90YWJsZU9wdGlvbnMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSkge1xuICAgICAgICBmaWx0ZXJEYXRhID0gZmlsdGVyRGF0YS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGEuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgLy8gR2V0dGluZyBjdXN0b20gY29sdW1ucyBmaWx0ZXIgY29sdW1ucyByZXN1bHRcbiAgICAgICAgY29uc3QgcGFzc0N1c3RvbUZpbHRlciA9IHRoaXMuZnVsZmlsbHNDdXN0b21GaWx0ZXJGdW5jdGlvbnMoZmlsdGVyRGF0YSwgaXRlbSk7XG4gICAgICAgIC8vIEdldHRpbmcgb3RoZXIgc2VhcmNoYWJsZSBjb2x1bW5zIHN0YW5kYXJkIHJlc3VsdFxuICAgICAgICBjb25zdCBwYXNzU2VhcmNoU3RyaW5nID0gdGhpcy5mdWxmaWxsc1F1aWNrZmlsdGVyKGZpbHRlckRhdGEsIGl0ZW0pO1xuICAgICAgICByZXR1cm4gcGFzc0N1c3RvbUZpbHRlciB8fCBwYXNzU2VhcmNoU3RyaW5nO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhZ2luYXRpb25EYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIGlmICghdGhpcy5fcGFnaW5hdG9yIHx8IGlzTmFOKHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZSkpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBsZXQgc3RhcnRJbmRleCA9IGlzTmFOKHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZSkgPyAwIDogdGhpcy5fcGFnaW5hdG9yLnBhZ2VJbmRleCAqIHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZTtcbiAgICBpZiAoZGF0YS5sZW5ndGggPiAwICYmIGRhdGEubGVuZ3RoIDwgc3RhcnRJbmRleCkge1xuICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICB0aGlzLl9wYWdpbmF0b3IucGFnZUluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEuc3BsaWNlKHN0YXJ0SW5kZXgsIHRoaXMuX3BhZ2luYXRvci5wYWdlU2l6ZSk7XG4gIH1cblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLmRhdGFUb3RhbHNDaGFuZ2UuY29tcGxldGUoKTtcbiAgICB0aGlzLl9xdWlja0ZpbHRlckNoYW5nZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fbG9hZERhdGFTY3JvbGxhYmxlQ2hhbmdlLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZnVsZmlsbHNDdXN0b21GaWx0ZXJGdW5jdGlvbnMoZmlsdGVyOiBzdHJpbmcsIGl0ZW06IGFueSkge1xuICAgIGNvbnN0IGN1c3RvbUZpbHRlckNvbHMgPSB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIob0NvbCA9PiBvQ29sLnVzZUN1c3RvbUZpbHRlckZ1bmN0aW9uKCkpO1xuICAgIHJldHVybiBjdXN0b21GaWx0ZXJDb2xzLnNvbWUob0NvbCA9PiBvQ29sLnJlbmRlcmVyLmZpbHRlckZ1bmN0aW9uKGl0ZW1bb0NvbC5hdHRyXSwgaXRlbSwgZmlsdGVyKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZnVsZmlsbHNRdWlja2ZpbHRlcihmaWx0ZXI6IHN0cmluZywgaXRlbTogYW55KTogYm9vbGVhbiB7XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMuX3RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcigob0NvbDogT0NvbHVtbikgPT4gb0NvbC51c2VRdWlja2ZpbHRlckZ1bmN0aW9uKCkpO1xuICAgIGxldCBzZWFyY2hTdHIgPSBjb2x1bW5zLm1hcCgob0NvbDogT0NvbHVtbikgPT4gb0NvbC5nZXRGaWx0ZXJWYWx1ZShpdGVtW29Db2wuYXR0cl0sIGl0ZW0pLmpvaW4oJyAnKSkuam9pbignICcpO1xuICAgIGlmICghdGhpcy5fdGFibGVPcHRpb25zLmZpbHRlckNhc2VTZW5zaXRpdmUpIHtcbiAgICAgIHNlYXJjaFN0ciA9IHNlYXJjaFN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc2VhcmNoU3RyLmluZGV4T2YoZmlsdGVyKSAhPT0gLTE7XG4gIH1cblxuICAvKiogUmV0dXJucyBhIHNvcnRlZCBjb3B5IG9mIHRoZSBkYXRhYmFzZSBkYXRhLiAqL1xuICBwcm90ZWN0ZWQgZ2V0U29ydGVkRGF0YShkYXRhOiBhbnlbXSk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5nZXRTb3J0ZWREYXRhKGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRhdGEgdGhlIHRhYmxlIHN0b3Jlcy4gTm8gZmlsdGVycyBhcmUgYXBwbGllZC5cbiAgICovXG4gIGdldFRhYmxlRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFiYXNlLmRhdGE7XG4gIH1cblxuICAvKiogUmV0dXJuIGRhdGEgb2YgdGhlIHZpc2libGUgY29sdW1ucyBvZiB0aGUgdGFibGUgd2l0aG91dCByZW5kZXJpbmcgKi9cbiAgZ2V0Q3VycmVudERhdGEoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmdldERhdGEoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRBbGxEYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBbGxEYXRhKGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICAvKiogUmV0dXJuIGRhdGEgb2YgdGhlIHZpc2libGUgY29sdW1ucyBvZiB0aGUgdGFibGUgIHJlbmRlcmluZyAqL1xuICBnZXRDdXJyZW50UmVuZGVyZXJEYXRhKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZW5kZXJlZERhdGEodGhpcy5yZW5kZXJlZERhdGEpO1xuICB9XG5cbiAgLyoqIFJldHVybiBhbGwgZGF0YSBvZiB0aGUgdGFibGUgcmVuZGVyaW5nICovXG4gIGdldEFsbFJlbmRlcmVyRGF0YSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWxsRGF0YSh0cnVlLCB0cnVlKTtcbiAgfVxuXG4gIC8qKiBSZXR1cm4gc3FsIHR5cGVzIG9mIHRoZSBjdXJyZW50IGRhdGEgKi9cbiAgZ2V0IHNxbFR5cGVzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFiYXNlLnNxbFR5cGVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldERhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyZWREYXRhO1xuICB9XG5cbiAgcHVibGljIGdldFJlbmRlcmVkRGF0YShkYXRhOiBhbnlbXSkge1xuICAgIGNvbnN0IHZpc2libGVDb2x1bW5zID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKG9Db2wgPT4gb0NvbC52aXNpYmxlKTtcbiAgICByZXR1cm4gZGF0YS5tYXAoKHJvdykgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICB2aXNpYmxlQ29sdW1ucy5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZVJlbmRlcmVyID0gb0NvbC5yZW5kZXJlciAmJiBvQ29sLnJlbmRlcmVyLmdldENlbGxEYXRhO1xuICAgICAgICBvYmpbb0NvbC5hdHRyXSA9IHVzZVJlbmRlcmVyID8gb0NvbC5yZW5kZXJlci5nZXRDZWxsRGF0YShyb3dbb0NvbC5hdHRyXSwgcm93KSA6IHJvd1tvQ29sLmF0dHJdO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEFsbERhdGEodXNpbmdSZW5kZXJlcmVycz86IGJvb2xlYW4sIG9ubHlWaXNpYmxlQ29sdW1ucz86IGJvb2xlYW4pIHtcbiAgICBsZXQgdGFibGVDb2x1bW5zID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnM7XG4gICAgaWYgKG9ubHlWaXNpYmxlQ29sdW1ucykge1xuICAgICAgdGFibGVDb2x1bW5zID0gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKG9Db2wgPT4gb0NvbC52aXNpYmxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyZWREYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIHRhYmxlQ29sdW1ucy5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICAgIGNvbnN0IHVzZVJlbmRlcmVyID0gdXNpbmdSZW5kZXJlcmVycyAmJiBvQ29sLnJlbmRlcmVyICYmIG9Db2wucmVuZGVyZXIuZ2V0Q2VsbERhdGE7XG4gICAgICAgIG9ialtvQ29sLmF0dHJdID0gdXNlUmVuZGVyZXIgPyBvQ29sLnJlbmRlcmVyLmdldENlbGxEYXRhKHJvd1tvQ29sLmF0dHJdLCByb3cpIDogcm93W29Db2wuYXR0cl07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJlbmRlcmVyc0RhdGEoZGF0YTogYW55W10sIHRhYmxlQ29sdW1uczogT0NvbHVtbltdKTogYW55W10ge1xuICAgIHJldHVybiBkYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICAvLyByZW5kZXIgZWFjaCBjb2x1bW5cbiAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5hc3NpZ24oe30sIHJvdyk7XG4gICAgICB0YWJsZUNvbHVtbnMuZm9yRWFjaCgob0NvbDogT0NvbHVtbikgPT4ge1xuICAgICAgICBvYmpbb0NvbC5hdHRyXSA9IG9Db2wucmVuZGVyZXIuZ2V0Q2VsbERhdGEocm93W29Db2wuYXR0cl0sIHJvdyk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sdW1uRGF0YShvY29sdW1uOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJlZERhdGEubWFwKChyb3cpID0+IHtcbiAgICAgIC8vIHJlbmRlciBlYWNoIGNvbHVtblxuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICBpZiAob2NvbHVtbikge1xuICAgICAgICBvYmpbb2NvbHVtbl0gPSByb3dbb2NvbHVtbl07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUNvbHVtbnNGaWx0ZXJzKGZpbHRlcnM6IE9Db2x1bW5WYWx1ZUZpbHRlcltdKSB7XG4gICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMgPSBbXTtcbiAgICBmaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLnB1c2goZmlsdGVyKTtcbiAgICB9KTtcbiAgICBpZiAoIXRoaXMudGFibGUucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuX2NvbHVtblZhbHVlRmlsdGVyQ2hhbmdlLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBpc0NvbHVtblZhbHVlRmlsdGVyQWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtblZhbHVlRmlsdGVycy5sZW5ndGggIT09IDA7XG4gIH1cblxuICBnZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKTogT0NvbHVtblZhbHVlRmlsdGVyW10ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtblZhbHVlRmlsdGVycztcbiAgfVxuXG4gIGdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGF0dHI6IHN0cmluZyk6IE9Db2x1bW5WYWx1ZUZpbHRlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmZpbHRlcihpdGVtID0+IGl0ZW0uYXR0ciA9PT0gYXR0cilbMF07XG4gIH1cblxuICBjbGVhckNvbHVtbkZpbHRlcnModHJpZ2dlcjogYm9vbGVhbiA9IHRydWUpIHtcbiAgICB0aGlzLmNvbHVtblZhbHVlRmlsdGVycyA9IFtdO1xuICAgIGlmICh0cmlnZ2VyKSB7XG4gICAgICB0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgYWRkQ29sdW1uRmlsdGVyKGZpbHRlcjogT0NvbHVtblZhbHVlRmlsdGVyKSB7XG4gICAgY29uc3QgZXhpc3RpbmdGaWx0ZXIgPSB0aGlzLmdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGZpbHRlci5hdHRyKTtcbiAgICBpZiAoZXhpc3RpbmdGaWx0ZXIpIHtcbiAgICAgIGNvbnN0IGlkeCA9IHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmluZGV4T2YoZXhpc3RpbmdGaWx0ZXIpO1xuICAgICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgKENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU4gPT09IGZpbHRlci5vcGVyYXRvciAmJiBmaWx0ZXIudmFsdWVzLmxlbmd0aCA+IDApIHx8XG4gICAgICAoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yICYmIGZpbHRlci52YWx1ZXMpIHx8XG4gICAgICAoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5CRVRXRUVOID09PSBmaWx0ZXIub3BlcmF0b3IgJiYgZmlsdGVyLnZhbHVlcy5sZW5ndGggPT09IDIpIHx8XG4gICAgICAoKENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTEVTU19FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yIHx8IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yKSAmJiBmaWx0ZXIudmFsdWVzKVxuICAgICkge1xuICAgICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMucHVzaChmaWx0ZXIpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0YWJsZSBpcyBwYWdpbmF0ZWQsIGZpbHRlciB3aWxsIGJlIGFwcGxpZWQgb24gcmVtb3RlIHF1ZXJ5XG4gICAgaWYgKCF0aGlzLnRhYmxlLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLl9jb2x1bW5WYWx1ZUZpbHRlckNoYW5nZS5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29sdW1uVmFsdWVGaWx0ZXJEYXRhKGRhdGE6IGFueVtdKTogYW55W10ge1xuICAgIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgIGNvbnN0IGZpbHRlckNvbHVtbiA9IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbmQoY29sID0+IGNvbC5hdHRyID09PSBmaWx0ZXIuYXR0cik7XG4gICAgICBpZiAoZmlsdGVyQ29sdW1uKSB7XG4gICAgICAgIHN3aXRjaCAoZmlsdGVyLm9wZXJhdG9yKSB7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOOlxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKChpdGVtOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGZpbHRlckNvbHVtbi5yZW5kZXJlciAmJiBmaWx0ZXJDb2x1bW4ucmVuZGVyZXIuZmlsdGVyRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyQ29sdW1uLnJlbmRlcmVyLmZpbHRlckZ1bmN0aW9uKGl0ZW1bZmlsdGVyLmF0dHJdLCBpdGVtKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xWYWx1ZXMgPSBmaWx0ZXJDb2x1bW4uZ2V0RmlsdGVyVmFsdWUoaXRlbVtmaWx0ZXIuYXR0cl0sIGl0ZW0pLm1hcChmID0+IFV0aWwubm9ybWFsaXplU3RyaW5nKGYpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJWYWx1ZXMgPSBmaWx0ZXIudmFsdWVzLm1hcChmID0+IFV0aWwubm9ybWFsaXplU3RyaW5nKGYpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsdGVyVmFsdWVzLnNvbWUodmFsdWUgPT4gY29sVmFsdWVzLmluZGV4T2YodmFsdWUpICE9PSAtMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMOlxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gVXRpbC5ub3JtYWxpemVTdHJpbmcoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbFZhbHVlcyA9IGZpbHRlckNvbHVtbi5nZXRGaWx0ZXJWYWx1ZShpdGVtW2ZpbHRlci5hdHRyXSwgaXRlbSkubWFwKGYgPT4gVXRpbC5ub3JtYWxpemVTdHJpbmcoZikpO1xuICAgICAgICAgICAgICBsZXQgcmVnRXhwO1xuICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFZhbHVlLmluY2x1ZGVzKCcqJykpIHtcbiAgICAgICAgICAgICAgICByZWdFeHAgPSBuZXcgUmVnRXhwKCdeJyArIG5vcm1hbGl6ZWRWYWx1ZS5zcGxpdCgnKicpLmpvaW4oJy4qJykgKyAnJCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBjb2xWYWx1ZXMuc29tZShjb2xWYWx1ZSA9PiByZWdFeHAgPyByZWdFeHAudGVzdChjb2xWYWx1ZSkgOiBjb2xWYWx1ZS5pbmNsdWRlcyhub3JtYWxpemVkVmFsdWUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU46XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtW2ZpbHRlci5hdHRyXSA+PSBmaWx0ZXIudmFsdWVzWzBdICYmIGl0ZW1bZmlsdGVyLmF0dHJdIDw9IGZpbHRlci52YWx1ZXNbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLk1PUkVfRVFVQUw6XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5maWx0ZXIoaXRlbSA9PiBpdGVtW2ZpbHRlci5hdHRyXSA+PSBmaWx0ZXIudmFsdWVzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMOlxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKGl0ZW0gPT4gaXRlbVtmaWx0ZXIuYXR0cl0gPD0gZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZ2V0QWdncmVnYXRlRGF0YShjb2x1bW46IE9Db2x1bW4pIHtcbiAgICBjb25zdCBvYmogPSB7fTtcbiAgICBsZXQgdG90YWxWYWx1ZSA9ICcnO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLl90YWJsZU9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IEFycmF5KG9iaik7XG4gICAgfVxuICAgIHRvdGFsVmFsdWUgPSB0aGlzLmFnZ3JlZ2F0ZURhdGFbY29sdW1uLmF0dHJdO1xuICAgIHJldHVybiB0b3RhbFZhbHVlO1xuICB9XG5cbiAgY2FsY3VsYXRlQWdncmVnYXRlKGRhdGE6IGFueVtdLCBjb2x1bW46IE9Db2x1bW4pOiBhbnkge1xuICAgIGxldCByZXN1bHRBZ2dyZWdhdGU7XG4gICAgY29uc3Qgb3BlcmF0b3IgPSBjb2x1bW4uYWdncmVnYXRlLm9wZXJhdG9yO1xuICAgIGlmICh0eXBlb2Ygb3BlcmF0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzd2l0Y2ggKG9wZXJhdG9yLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAnY291bnQnOlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMuY291bnQoY29sdW1uLmF0dHIsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtaW4nOlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMubWluKGNvbHVtbi5hdHRyLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnbWF4JzpcbiAgICAgICAgICByZXN1bHRBZ2dyZWdhdGUgPSB0aGlzLm1heChjb2x1bW4uYXR0ciwgZGF0YSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2F2Zyc6XG4gICAgICAgICAgcmVzdWx0QWdncmVnYXRlID0gdGhpcy5hdmcoY29sdW1uLmF0dHIsIGRhdGEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJlc3VsdEFnZ3JlZ2F0ZSA9IHRoaXMuc3VtKGNvbHVtbi5hdHRyLCBkYXRhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29sdW1uRGF0YTogYW55W10gPSB0aGlzLmdldENvbHVtbkRhdGEoY29sdW1uLmF0dHIpO1xuICAgICAgaWYgKHR5cGVvZiBvcGVyYXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXN1bHRBZ2dyZWdhdGUgPSBvcGVyYXRvcihjb2x1bW5EYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdEFnZ3JlZ2F0ZTtcbiAgfVxuXG4gIHN1bShjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHZhbHVlID0gZGF0YS5yZWR1Y2UoKGFjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gYWN1bXVsYXRvciArIChpc05hTihjdXJyZW50VmFsdWVbY29sdW1uXSkgPyAwIDogY3VycmVudFZhbHVlW2NvbHVtbl0pO1xuICAgICAgfSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBjb3VudChjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHZhbHVlID0gZGF0YS5yZWR1Y2UoKGFjdW11bGF0b3IsIGN1cnJlbnRWYWx1ZSwgY3VycmVudEluZGV4KSA9PiB7XG4gICAgICAgIHJldHVybiBhY3VtdWxhdG9yICsgMTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBhdmcoY29sdW1uLCBkYXRhKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zdW0oY29sdW1uLCBkYXRhKSAvIHRoaXMuY291bnQoY29sdW1uLCBkYXRhKTtcbiAgfVxuXG4gIG1pbihjb2x1bW4sIGRhdGEpOiBudW1iZXIge1xuICAgIGNvbnN0IHRlbXBNaW4gPSBkYXRhLm1hcCh4ID0+IHhbY29sdW1uXSk7XG4gICAgcmV0dXJuIE1hdGgubWluKC4uLnRlbXBNaW4pO1xuICB9XG5cbiAgbWF4KGNvbHVtbiwgZGF0YSk6IG51bWJlciB7XG4gICAgY29uc3QgdGVtcE1pbiA9IGRhdGEubWFwKHggPT4geFtjb2x1bW5dKTtcbiAgICByZXR1cm4gTWF0aC5tYXgoLi4udGVtcE1pbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZXhpc3RzQW55Q2FsY3VsYXRlZENvbHVtbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdGFibGVPcHRpb25zLmNvbHVtbnMuZmluZCgob0NvbDogT0NvbHVtbikgPT4gb0NvbC5jYWxjdWxhdGUgIT09IHVuZGVmaW5lZCkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHVwZGF0ZVJlbmRlcmVkUm93RGF0YShyb3dEYXRhOiBhbnkpIHtcbiAgICBjb25zdCB0YWJsZUtleXMgPSB0aGlzLnRhYmxlLmdldEtleXMoKTtcbiAgICBjb25zdCByZWNvcmQgPSB0aGlzLnJlbmRlcmVkRGF0YS5maW5kKChkYXRhOiBhbnkpID0+IHtcbiAgICAgIGxldCBmb3VuZCA9IHRydWU7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGFibGVLZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRhYmxlS2V5c1tpXTtcbiAgICAgICAgaWYgKGRhdGFba2V5XSAhPT0gcm93RGF0YVtrZXldKSB7XG4gICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0pO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChyZWNvcmQpKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHJlY29yZCwgcm93RGF0YSk7XG4gICAgfVxuICB9XG59XG5cblxuXG4iXX0=