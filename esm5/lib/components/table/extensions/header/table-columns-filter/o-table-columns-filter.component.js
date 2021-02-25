import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
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
        this.columnsArray.forEach(function (colData, i, arr) {
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
    OTableColumnsFilterComponent.prototype.isColumnFilterable = function (attr) {
        return (this.columnsArray.indexOf(attr) !== -1);
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
            this._columnsArray = Util.parseArray(this._columns, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW5zLWZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtY29sdW1ucy1maWx0ZXIvby10YWJsZS1jb2x1bW5zLWZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFekcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRTdELE1BQU0sQ0FBQyxJQUFNLG9DQUFvQyxHQUFHO0lBRWxELFNBQVM7SUFFVCwrQkFBK0I7SUFFL0IsTUFBTTtDQUNQLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FBRyxFQUNwRCxDQUFDO0FBRUY7SUFvQ0Usc0NBQ1ksUUFBa0IsRUFDeUIsS0FBc0I7UUFEakUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN5QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQXZCbkUsVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUVwQyxrQkFBYSxHQUFZLElBQUksQ0FBQztRQWdCcEIsa0JBQWEsR0FBa0IsRUFBRSxDQUFDO1FBQ2xDLDhCQUF5QixHQUFXLEVBQUUsQ0FBQztJQUs3QyxDQUFDO0lBcEJMLHNCQUFJLDhDQUFJO2FBQVI7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQUdELFVBQVMsR0FBVztZQUNsQixJ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LE9BQU8sQ0FBQztJQUNoQyxxREFBd0IsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7O2dCQVo3RSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSxvQ0FBb0M7b0JBQzVDLE9BQU8sRUFBRSxxQ0FBcUM7aUJBQy9DOzs7Z0JBMUJnRSxRQUFRO2dCQU1oRSxlQUFlLHVCQW9EbkIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsZUFBZSxFQUFmLENBQWUsQ0FBQzs7SUFyQjNDO1FBREMsY0FBYyxFQUFFOzt1RUFDYTtJQU85QjtRQURDLGNBQWMsRUFBRTs7OzREQVFoQjtJQXFESCxtQ0FBQztDQUFBLEFBcEZELElBb0ZDO1NBNUVZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU5fRklMVEVSID0gW1xuICAvLyBjb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIHRoYXQgbWlnaHQgYmUgZmlsdGVyZWQsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IGFsbCB2aXNpYmxlIGNvbHVtbnMuXG4gICdjb2x1bW5zJyxcbiAgLy8gcHJlbG9hZFZhbHVlcyBbdHJ1ZXxmYWxzZXx5ZXN8bm9dOiBpbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gc2hvdyB0aGUgbGlzdCB2YWx1ZXMgd2hlbiB0aGUgZmlsdGVyIGRpYWxvZyBpcyBvcGVuZWQuIERlZmF1bHQ6IHRydWUuXG4gICdwcmVsb2FkVmFsdWVzOiBwcmVsb2FkLXZhbHVlcycsXG4gIC8vIG1vZGUgW2RlZmF1bHQgfCBzZWxlY3Rpb24gfCAgY3VzdG9tXVxuICAnbW9kZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DT0xVTU5fRklMVEVSID0gW1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jb2x1bW5zLWZpbHRlcicsXG4gIHRlbXBsYXRlOiAnICcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX0ZJTFRFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ09MVU1OX0ZJTFRFUlxufSlcblxuZXhwb3J0IGNsYXNzIE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9DT01QQVJJU09OX1RZUEUgPSAnVklFVyc7XG4gIHB1YmxpYyBzdGF0aWMgTU9ERUxfQ09NUEFSSVNPTl9UWVBFID0gJ01PREVMJztcbiAgcHVibGljIHN0YXRpYyBPVGFibGVDb2x1bW5zRmlsdGVyTW9kZXMgPSBbJ2RlZmF1bHQnLCAnc2VsZWN0aW9uJywgJ2N1c3RvbSddO1xuXG4gIHByb3RlY3RlZCBfY29sdW1uczogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX21vZGU6IHN0cmluZyA9ICdkZWZhdWx0JztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJlbG9hZFZhbHVlczogYm9vbGVhbiA9IHRydWU7XG5cbiAgZ2V0IG1vZGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgfVxuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNldCBtb2RlKHZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgbSA9IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuT1RhYmxlQ29sdW1uc0ZpbHRlck1vZGVzLmZpbmQoZSA9PiBlID09PSB2YWwpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChtKSkge1xuICAgICAgdGhpcy5fbW9kZSA9IG07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgYG8tdGFibGUtY29sdW1ucy1maWx0ZXJgIG1vZGUgKCcgKyB2YWwgKyAnKScpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29sdW1uc0FycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHByb3RlY3RlZCBjb2x1bW5zQ29tcGFyaXNvblByb3BlcnR5OiBvYmplY3QgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwcm90ZWN0ZWQgdGFibGU6IE9UYWJsZUNvbXBvbmVudFxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmNvbHVtbnNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuY29sdW1uc0FycmF5ID0gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zO1xuICAgIH1cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbHVtbnNBcnJheS5mb3JFYWNoKChjb2xEYXRhLCBpLCBhcnIpID0+IHtcbiAgICAgIGNvbnN0IGNvbERlZiA9IGNvbERhdGEuc3BsaXQoQ29kZXMuVFlQRV9TRVBBUkFUT1IpO1xuICAgICAgY29uc3QgY29sTmFtZSA9IGNvbERlZlswXTtcbiAgICAgIGxldCBjb21wVHlwZSA9IChjb2xEZWZbMV0gfHwgJycpLnRvVXBwZXJDYXNlKCk7XG4gICAgICBpZiAoW09UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuREVGQVVMVF9DT01QQVJJU09OX1RZUEUsIE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuTU9ERUxfQ09NUEFSSVNPTl9UWVBFXS5pbmRleE9mKGNvbXBUeXBlKSA9PT0gLTEpIHtcbiAgICAgICAgY29tcFR5cGUgPSBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LkRFRkFVTFRfQ09NUEFSSVNPTl9UWVBFO1xuICAgICAgfVxuICAgICAgYXJyW2ldID0gY29sTmFtZTtcbiAgICAgIHNlbGYuY29sdW1uc0NvbXBhcmlzb25Qcm9wZXJ0eVtjb2xOYW1lXSA9IGNvbXBUeXBlO1xuICAgIH0pO1xuICAgIHRoaXMudGFibGUuc2V0T1RhYmxlQ29sdW1uc0ZpbHRlcih0aGlzKTtcbiAgfVxuXG4gIGlzQ29sdW1uRmlsdGVyYWJsZShhdHRyOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gKHRoaXMuY29sdW1uc0FycmF5LmluZGV4T2YoYXR0cikgIT09IC0xKTtcbiAgfVxuXG4gIGdldENvbHVtbkNvbXBhcmlzb25WYWx1ZShjb2x1bW46IE9Db2x1bW4sIHZhbDogYW55KTogYW55IHtcbiAgICBpZiAoIWNvbHVtbiB8fCB0aGlzLmNvbHVtbnNDb21wYXJpc29uUHJvcGVydHlbY29sdW1uLmF0dHJdID09PSBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50Lk1PREVMX0NPTVBBUklTT05fVFlQRSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbHVtbi5yZW5kZXJlciA/IGNvbHVtbi5yZW5kZXJlci5nZXRDZWxsRGF0YSh2YWwpIDogdmFsO1xuICAgIH1cbiAgfVxuXG4gIHNldCBjb2x1bW5zKGFyZzogc3RyaW5nKSB7XG4gICAgdGhpcy5fY29sdW1ucyA9IGFyZztcbiAgICB0aGlzLl9jb2x1bW5zQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5fY29sdW1ucywgdHJ1ZSk7XG4gIH1cblxuICBzZXQgY29sdW1uc0FycmF5KGFyZzogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9jb2x1bW5zQXJyYXkgPSBhcmc7XG4gIH1cblxuICBnZXQgY29sdW1uc0FycmF5KCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uc0FycmF5O1xuICB9XG5cbn1cbiJdfQ==