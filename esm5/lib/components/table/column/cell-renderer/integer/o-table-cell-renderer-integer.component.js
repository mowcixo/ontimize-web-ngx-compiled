import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { OIntegerPipe } from '../../../../../pipes/o-integer.pipe';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'grouping',
    'thousandSeparator: thousand-separator'
]);
var OTableCellRendererIntegerComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererIntegerComponent, _super);
    function OTableCellRendererIntegerComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.grouping = true;
        _this.thousandSeparator = ',';
        _this.tableColumn.type = 'integer';
        _this.setComponentPipe();
        return _this;
    }
    OTableCellRendererIntegerComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OIntegerPipe(this.injector);
    };
    OTableCellRendererIntegerComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.pipeArguments = {
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
        };
    };
    OTableCellRendererIntegerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-integer',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n    {{ getCellData(cellvalue)}}\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER
                }] }
    ];
    OTableCellRendererIntegerComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererIntegerComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableCellRendererIntegerComponent.prototype, "grouping", void 0);
    return OTableCellRendererIntegerComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererIntegerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWludGVnZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2ludGVnZXIvby10YWJsZS1jZWxsLXJlbmRlcmVyLWludGVnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxRQUFRLEVBRVIsV0FBVyxFQUNYLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUF3QixZQUFZLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RixPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsSUFBTSw0Q0FBNEMsb0JBQ3BELHlDQUF5QztJQUU1QyxVQUFVO0lBRVYsdUNBQXVDO0VBQ3hDLENBQUM7QUFFRjtJQU13RCw4REFBc0I7SUFVNUUsNENBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBR2hCO1FBSnFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFQOUIsY0FBUSxHQUFZLElBQUksQ0FBQztRQUN6Qix1QkFBaUIsR0FBVyxHQUFHLENBQUM7UUFReEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2xDLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztJQUMxQixDQUFDO0lBRUQsNkRBQWdCLEdBQWhCO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHVEQUFVLEdBQVY7UUFDRSxpQkFBTSxVQUFVLFdBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQzFDLENBQUM7SUFDSixDQUFDOztnQkFoQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSwrQkFBK0I7b0JBQ3pDLG1IQUE2RDtvQkFDN0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSw0Q0FBNEM7aUJBQ3JEOzs7Z0JBdkJDLFFBQVE7Ozs4QkFnQ1AsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFMN0Q7UUFEQyxjQUFjLEVBQUU7O3dFQUNrQjtJQXlCckMseUNBQUM7Q0FBQSxBQWxDRCxDQU13RCxzQkFBc0IsR0E0QjdFO1NBNUJZLGtDQUFrQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElJbnRlZ2VyUGlwZUFyZ3VtZW50LCBPSW50ZWdlclBpcGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9waXBlcy9vLWludGVnZXIucGlwZSc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUiwgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciB9IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9JTlRFR0VSID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUixcbiAgLy8gZ3JvdXBpbmcgW25vfHllc106IGdyb3VwaW5nIHRob3VzYW5kcy4gRGVmYXVsdDogeWVzLlxuICAnZ3JvdXBpbmcnLFxuICAvLyB0aG91c2FuZC1zZXBhcmF0b3IgW3N0cmluZ106IHRob3VzYW5kcyBzZXBhcmF0b3Igd2hlbiBncm91cGluZy4gRGVmYXVsdDogY29tbWEgKCwpLlxuICAndGhvdXNhbmRTZXBhcmF0b3I6IHRob3VzYW5kLXNlcGFyYXRvcidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci1pbnRlZ2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci1pbnRlZ2VyLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0lOVEVHRVJcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVySW50ZWdlckNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkluaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBncm91cGluZzogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCB0aG91c2FuZFNlcGFyYXRvcjogc3RyaW5nID0gJywnO1xuICBwcm90ZWN0ZWQgY29tcG9uZW50UGlwZTogT0ludGVnZXJQaXBlO1xuICBwcm90ZWN0ZWQgcGlwZUFyZ3VtZW50czogSUludGVnZXJQaXBlQXJndW1lbnQ7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy50YWJsZUNvbHVtbi50eXBlID0gJ2ludGVnZXInO1xuICAgIHRoaXMuc2V0Q29tcG9uZW50UGlwZSgpO1xuICB9XG5cbiAgc2V0Q29tcG9uZW50UGlwZSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudFBpcGUgPSBuZXcgT0ludGVnZXJQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5waXBlQXJndW1lbnRzID0ge1xuICAgICAgZ3JvdXBpbmc6IHRoaXMuZ3JvdXBpbmcsXG4gICAgICB0aG91c2FuZFNlcGFyYXRvcjogdGhpcy50aG91c2FuZFNlcGFyYXRvclxuICAgIH07XG4gIH1cblxufVxuIl19