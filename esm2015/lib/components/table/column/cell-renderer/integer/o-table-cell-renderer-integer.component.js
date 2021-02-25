import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { OIntegerPipe } from '../../../../../pipes/o-integer.pipe';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER = [
    ...DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER,
    'grouping',
    'thousandSeparator: thousand-separator'
];
export class OTableCellRendererIntegerComponent extends OBaseTableCellRenderer {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.grouping = true;
        this.thousandSeparator = ',';
        this.tableColumn.type = 'integer';
        this.setComponentPipe();
    }
    setComponentPipe() {
        this.componentPipe = new OIntegerPipe(this.injector);
    }
    initialize() {
        super.initialize();
        this.pipeArguments = {
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
        };
    }
}
OTableCellRendererIntegerComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-renderer-integer',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n    {{ getCellData(cellvalue)}}\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER
            }] }
];
OTableCellRendererIntegerComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellRendererIntegerComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableCellRendererIntegerComponent.prototype, "grouping", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWludGVnZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2ludGVnZXIvby10YWJsZS1jZWxsLXJlbmRlcmVyLWludGVnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxRQUFRLEVBRVIsV0FBVyxFQUNYLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUF3QixZQUFZLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RixPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsTUFBTSw0Q0FBNEMsR0FBRztJQUMxRCxHQUFHLHlDQUF5QztJQUU1QyxVQUFVO0lBRVYsdUNBQXVDO0NBQ3hDLENBQUM7QUFRRixNQUFNLE9BQU8sa0NBQW1DLFNBQVEsc0JBQXNCO0lBVTVFLFlBQXNCLFFBQWtCO1FBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQURJLGFBQVEsR0FBUixRQUFRLENBQVU7UUFQOUIsYUFBUSxHQUFZLElBQUksQ0FBQztRQUN6QixzQkFBaUIsR0FBVyxHQUFHLENBQUM7UUFReEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsVUFBVTtRQUNSLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQzFDLENBQUM7SUFDSixDQUFDOzs7WUFoQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwrQkFBK0I7Z0JBQ3pDLG1IQUE2RDtnQkFDN0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSw0Q0FBNEM7YUFDckQ7OztZQXZCQyxRQUFROzs7MEJBZ0NQLFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0FBTDdEO0lBREMsY0FBYyxFQUFFOztvRUFDa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJSW50ZWdlclBpcGVBcmd1bWVudCwgT0ludGVnZXJQaXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcGlwZXMvby1pbnRlZ2VyLnBpcGUnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgfSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1yZW5kZXJlci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfSU5URUdFUiA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsXG4gIC8vIGdyb3VwaW5nIFtub3x5ZXNdOiBncm91cGluZyB0aG91c2FuZHMuIERlZmF1bHQ6IHllcy5cbiAgJ2dyb3VwaW5nJyxcbiAgLy8gdGhvdXNhbmQtc2VwYXJhdG9yIFtzdHJpbmddOiB0aG91c2FuZHMgc2VwYXJhdG9yIHdoZW4gZ3JvdXBpbmcuIERlZmF1bHQ6IGNvbW1hICgsKS5cbiAgJ3Rob3VzYW5kU2VwYXJhdG9yOiB0aG91c2FuZC1zZXBhcmF0b3InXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtcmVuZGVyZXItaW50ZWdlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtcmVuZGVyZXItaW50ZWdlci5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9JTlRFR0VSXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxSZW5kZXJlckludGVnZXJDb21wb25lbnQgZXh0ZW5kcyBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25Jbml0IHtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgZ3JvdXBpbmc6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgdGhvdXNhbmRTZXBhcmF0b3I6IHN0cmluZyA9ICcsJztcbiAgcHJvdGVjdGVkIGNvbXBvbmVudFBpcGU6IE9JbnRlZ2VyUGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElJbnRlZ2VyUGlwZUFyZ3VtZW50O1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICdpbnRlZ2VyJztcbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFBpcGUoKSB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9JbnRlZ2VyUGlwZSh0aGlzLmluamVjdG9yKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cyA9IHtcbiAgICAgIGdyb3VwaW5nOiB0aGlzLmdyb3VwaW5nLFxuICAgICAgdGhvdXNhbmRTZXBhcmF0b3I6IHRoaXMudGhvdXNhbmRTZXBhcmF0b3JcbiAgICB9O1xuICB9XG5cbn1cbiJdfQ==