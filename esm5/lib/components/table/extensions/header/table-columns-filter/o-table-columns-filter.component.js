import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ContentChildren, QueryList } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
import { OTableColumnsFilterColumnComponent } from './columns/o-table-columns-filter-column.component';
export var DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER = [
    'columns',
    'preloadValues: preload-values',
    'mode'
];
export var DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER = [];
var OTableColumnsFilterComponent = (function () {
    function OTableColumnsFilterComponent(injector, table) {
        this.injector = injector;
        this.table = table;
        this._mode = 'default';
        this.preloadValues = true;
        this._columnsArray = [];
        this.columnsComparisonProperty = {};
    }
    Object.defineProperty(OTableColumnsFilterComponent.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (val) {
            var m = OTableColumnsFilterComponent.OTableColumnsFilterModes.find(function (e) { return e === val; });
            if (Util.isDefined(m)) {
                this._mode = m;
            }
            else {
                console.error('Invalid `o-table-columns-filter` mode (' + val + ')');
            }
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnsFilterComponent.prototype.ngOnInit = function () {
        if (this.columnsArray.length === 0) {
            this.columnsArray = this.table.oTableOptions.visibleColumns;
        }
        var self = this;
        var columns = Util.parseArray(this._columns, true);
        columns.forEach(function (colData, i, arr) {
            var colDef = colData.split(Codes.TYPE_SEPARATOR);
            var colName = colDef[0];
            var compType = (colDef[1] || '').toUpperCase();
            if ([OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE, OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE].indexOf(compType) === -1) {
                compType = OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE;
            }
            arr[i] = colName;
            self.columnsComparisonProperty[colName] = compType;
        });
        this.table.setOTableColumnsFilter(this);
    };
    OTableColumnsFilterComponent.prototype.ngAfterContentInit = function () {
        if (Util.isDefined(this.filterColumns)) {
            this.columnsArray = this.columnsArray.concat(this.parseFilterColumns(this.filterColumns));
        }
    };
    OTableColumnsFilterComponent.prototype.isColumnFilterable = function (attr) {
        return Util.isDefined(this.columnsArray.find(function (x) { return x.attr === attr; }));
    };
    OTableColumnsFilterComponent.prototype.getSortValueOfFilterColumn = function (attr) {
        var sortValue = '';
        if (Util.isDefined(this.columnsArray) && this.columnsArray.find(function (x) { return x.attr === attr; })) {
            sortValue = this.columnsArray.find(function (x) { return x.attr === attr; }).sort;
        }
        return sortValue;
    };
    OTableColumnsFilterComponent.prototype.getColumnComparisonValue = function (column, val) {
        if (!column || this.columnsComparisonProperty[column.attr] === OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE) {
            return val;
        }
        else {
            return column.renderer ? column.renderer.getCellData(val) : val;
        }
    };
    Object.defineProperty(OTableColumnsFilterComponent.prototype, "columns", {
        set: function (arg) {
            this._columns = arg;
            this._columnsArray = this.parseColumns(this._columns);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableColumnsFilterComponent.prototype, "columnsArray", {
        get: function () {
            return this._columnsArray;
        },
        set: function (arg) {
            this._columnsArray = arg;
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnsFilterComponent.prototype.parseColumns = function (columns) {
        return columns.split(';')
            .map(function (x) {
            var obj = { attr: '', sort: '' };
            obj.attr = x;
            obj.sort = '';
            return obj;
        });
    };
    OTableColumnsFilterComponent.prototype.parseFilterColumns = function (columns) {
        return columns
            .map(function (x) {
            var obj = { attr: '', sort: '' };
            obj.attr = x.attr;
            obj.sort = x.sort;
            return obj;
        });
    };
    OTableColumnsFilterComponent.DEFAULT_COMPARISON_TYPE = 'VIEW';
    OTableColumnsFilterComponent.MODEL_COMPARISON_TYPE = 'MODEL';
    OTableColumnsFilterComponent.OTableColumnsFilterModes = ['default', 'selection', 'custom'];
    OTableColumnsFilterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-columns-filter',
                    template: ' ',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER
                }] }
    ];
    OTableColumnsFilterComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
    OTableColumnsFilterComponent.propDecorators = {
        filterColumns: [{ type: ContentChildren, args: [OTableColumnsFilterColumnComponent, { descendants: true },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableColumnsFilterComponent.prototype, "preloadValues", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", String),
        tslib_1.__metadata("design:paramtypes", [String])
    ], OTableColumnsFilterComponent.prototype, "mode", null);
    return OTableColumnsFilterComponent;
}());
export { OTableColumnsFilterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW5zLWZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtY29sdW1ucy1maWx0ZXIvby10YWJsZS1jb2x1bW5zLWZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsZUFBZSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVySSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGtDQUFrQyxFQUFpQixNQUFNLG1EQUFtRCxDQUFDO0FBRXRILE1BQU0sQ0FBQyxJQUFNLG9DQUFvQyxHQUFHO0lBRWxELFNBQVM7SUFFVCwrQkFBK0I7SUFFL0IsTUFBTTtDQUNQLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FBRyxFQUNwRCxDQUFDO0FBRUY7SUFzQ0Usc0NBQ1ksUUFBa0IsRUFDeUIsS0FBc0I7UUFEakUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN5QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQXpCbkUsVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUVwQyxrQkFBYSxHQUFZLElBQUksQ0FBQztRQWdCcEIsa0JBQWEsR0FBeUIsRUFBRSxDQUFDO1FBQ3pDLDhCQUF5QixHQUFXLEVBQUUsQ0FBQztJQU83QyxDQUFDO0lBdEJMLHNCQUFJLDhDQUFJO2FB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IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uSW5pdCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb2x1bW5Db21wb25lbnQsIE9GaWx0ZXJDb2x1bW4gfSBmcm9tICcuL2NvbHVtbnMvby10YWJsZS1jb2x1bW5zLWZpbHRlci1jb2x1bW4uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX0ZJTFRFUiA9IFtcbiAgLy8gY29sdW1ucyBbc3RyaW5nXTogY29sdW1ucyB0aGF0IG1pZ2h0IGJlIGZpbHRlcmVkLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBhbGwgdmlzaWJsZSBjb2x1bW5zLlxuICAnY29sdW1ucycsXG4gIC8vIHByZWxvYWRWYWx1ZXMgW3RydWV8ZmFsc2V8eWVzfG5vXTogaW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRvIHNob3cgdGhlIGxpc3QgdmFsdWVzIHdoZW4gdGhlIGZpbHRlciBkaWFsb2cgaXMgb3BlbmVkLiBEZWZhdWx0OiB0cnVlLlxuICAncHJlbG9hZFZhbHVlczogcHJlbG9hZC12YWx1ZXMnLFxuICAvLyBtb2RlIFtkZWZhdWx0IHwgc2VsZWN0aW9uIHwgIGN1c3RvbV1cbiAgJ21vZGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OX0ZJTFRFUiA9IFtcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY29sdW1ucy1maWx0ZXInLFxuICB0ZW1wbGF0ZTogJyAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NPTFVNTl9GSUxURVIsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NPTFVNTl9GSUxURVJcbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfQ09NUEFSSVNPTl9UWVBFID0gJ1ZJRVcnO1xuICBwdWJsaWMgc3RhdGljIE1PREVMX0NPTVBBUklTT05fVFlQRSA9ICdNT0RFTCc7XG4gIHB1YmxpYyBzdGF0aWMgT1RhYmxlQ29sdW1uc0ZpbHRlck1vZGVzID0gWydkZWZhdWx0JywgJ3NlbGVjdGlvbicsICdjdXN0b20nXTtcblxuICBwcm90ZWN0ZWQgX2NvbHVtbnM6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9tb2RlOiBzdHJpbmcgPSAnZGVmYXVsdCc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByZWxvYWRWYWx1ZXM6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGdldCBtb2RlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGU7XG4gIH1cblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZXQgbW9kZSh2YWw6IHN0cmluZykge1xuICAgIGNvbnN0IG0gPSBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50Lk9UYWJsZUNvbHVtbnNGaWx0ZXJNb2Rlcy5maW5kKGUgPT4gZSA9PT0gdmFsKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQobSkpIHtcbiAgICAgIHRoaXMuX21vZGUgPSBtO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGBvLXRhYmxlLWNvbHVtbnMtZmlsdGVyYCBtb2RlICgnICsgdmFsICsgJyknKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbHVtbnNBcnJheTogQXJyYXk8T0ZpbHRlckNvbHVtbj4gPSBbXTtcbiAgcHJvdGVjdGVkIGNvbHVtbnNDb21wYXJpc29uUHJvcGVydHk6IG9iamVjdCA9IHt9O1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oT1RhYmxlQ29sdW1uc0ZpbHRlckNvbHVtbkNvbXBvbmVudCwgeyBkZXNjZW5kYW50czogdHJ1ZSB9KSBmaWx0ZXJDb2x1bW5zOiBRdWVyeUxpc3Q8T1RhYmxlQ29sdW1uc0ZpbHRlckNvbHVtbkNvbXBvbmVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnRcbiAgKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5jb2x1bW5zQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmNvbHVtbnNBcnJheSA9IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucztcbiAgICB9XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgbGV0IGNvbHVtbnMgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5fY29sdW1ucywgdHJ1ZSk7XG5cbiAgICBjb2x1bW5zLmZvckVhY2goKGNvbERhdGEsIGksIGFycikgPT4ge1xuICAgICAgY29uc3QgY29sRGVmID0gY29sRGF0YS5zcGxpdChDb2Rlcy5UWVBFX1NFUEFSQVRPUik7XG4gICAgICBjb25zdCBjb2xOYW1lID0gY29sRGVmWzBdO1xuICAgICAgbGV0IGNvbXBUeXBlID0gKGNvbERlZlsxXSB8fCAnJykudG9VcHBlckNhc2UoKTtcbiAgICAgIGlmIChbT1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5ERUZBVUxUX0NPTVBBUklTT05fVFlQRSwgT1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5NT0RFTF9DT01QQVJJU09OX1RZUEVdLmluZGV4T2YoY29tcFR5cGUpID09PSAtMSkge1xuICAgICAgICBjb21wVHlwZSA9IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuREVGQVVMVF9DT01QQVJJU09OX1RZUEU7XG4gICAgICB9XG4gICAgICBhcnJbaV0gPSBjb2xOYW1lO1xuICAgICAgc2VsZi5jb2x1bW5zQ29tcGFyaXNvblByb3BlcnR5W2NvbE5hbWVdID0gY29tcFR5cGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLnRhYmxlLnNldE9UYWJsZUNvbHVtbnNGaWx0ZXIodGhpcyk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZmlsdGVyQ29sdW1ucykpIHtcbiAgICAgIHRoaXMuY29sdW1uc0FycmF5ID0gdGhpcy5jb2x1bW5zQXJyYXkuY29uY2F0KHRoaXMucGFyc2VGaWx0ZXJDb2x1bW5zKHRoaXMuZmlsdGVyQ29sdW1ucykpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ29sdW1uRmlsdGVyYWJsZShhdHRyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5jb2x1bW5zQXJyYXkuZmluZCh4ID0+IHguYXR0ciA9PT0gYXR0cikpO1xuICB9XG5cbiAgZ2V0U29ydFZhbHVlT2ZGaWx0ZXJDb2x1bW4oYXR0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgc29ydFZhbHVlID0gJyc7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuY29sdW1uc0FycmF5KSAmJiB0aGlzLmNvbHVtbnNBcnJheS5maW5kKHggPT4geC5hdHRyID09PSBhdHRyKSkge1xuICAgICAgc29ydFZhbHVlID0gdGhpcy5jb2x1bW5zQXJyYXkuZmluZCh4ID0+IHguYXR0ciA9PT0gYXR0cikuc29ydDtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnRWYWx1ZTtcbiAgfVxuXG4gIGdldENvbHVtbkNvbXBhcmlzb25WYWx1ZShjb2x1bW46IE9Db2x1bW4sIHZhbDogYW55KTogYW55IHtcbiAgICBpZiAoIWNvbHVtbiB8fCB0aGlzLmNvbHVtbnNDb21wYXJpc29uUHJvcGVydHlbY29sdW1uLmF0dHJdID09PSBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50Lk1PREVMX0NPTVBBUklTT05fVFlQRSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbHVtbi5yZW5kZXJlciA/IGNvbHVtbi5yZW5kZXJlci5nZXRDZWxsRGF0YSh2YWwpIDogdmFsO1xuICAgIH1cbiAgfVxuXG4gIHNldCBjb2x1bW5zKGFyZzogc3RyaW5nKSB7XG4gICAgdGhpcy5fY29sdW1ucyA9IGFyZztcbiAgICB0aGlzLl9jb2x1bW5zQXJyYXkgPSB0aGlzLnBhcnNlQ29sdW1ucyh0aGlzLl9jb2x1bW5zKTtcbiAgfVxuXG4gIHNldCBjb2x1bW5zQXJyYXkoYXJnOiBPRmlsdGVyQ29sdW1uW10pIHtcbiAgICB0aGlzLl9jb2x1bW5zQXJyYXkgPSBhcmc7XG4gIH1cblxuICBnZXQgY29sdW1uc0FycmF5KCk6IE9GaWx0ZXJDb2x1bW5bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHVtbnNBcnJheTtcbiAgfVxuXG4gIHBhcnNlQ29sdW1ucyhjb2x1bW5zOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY29sdW1ucy5zcGxpdCgnOycpXG4gICAgICAubWFwKHggPT4ge1xuICAgICAgICBsZXQgb2JqOiBPRmlsdGVyQ29sdW1uID0geyBhdHRyOiAnJywgc29ydDogJycgfTtcbiAgICAgICAgb2JqLmF0dHIgPSB4O1xuICAgICAgICBvYmouc29ydCA9ICcnO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSk7XG4gIH1cblxuICBwYXJzZUZpbHRlckNvbHVtbnMoY29sdW1uczogUXVlcnlMaXN0PE9UYWJsZUNvbHVtbnNGaWx0ZXJDb2x1bW5Db21wb25lbnQ+KSB7XG4gICAgcmV0dXJuIGNvbHVtbnNcbiAgICAgIC5tYXAoeCA9PiB7XG4gICAgICAgIGxldCBvYmo6IE9GaWx0ZXJDb2x1bW4gPSB7IGF0dHI6ICcnLCBzb3J0OiAnJyB9O1xuICAgICAgICBvYmouYXR0ciA9IHguYXR0cjtcbiAgICAgICAgb2JqLnNvcnQgPSB4LnNvcnQ7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9KTtcbiAgfVxuXG59XG4iXX0=