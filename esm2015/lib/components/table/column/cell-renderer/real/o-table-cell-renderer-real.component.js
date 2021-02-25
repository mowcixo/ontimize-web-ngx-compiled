import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { ORealPipe } from '../../../../../pipes/o-real.pipe';
import { NumberService } from '../../../../../services/number.service';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER, OTableCellRendererIntegerComponent, } from '../integer/o-table-cell-renderer-integer.component';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER,
    'decimalSeparator: decimal-separator',
    'minDecimalDigits: min-decimal-digits',
    'maxDecimalDigits: max-decimal-digits'
];
export class OTableCellRendererRealComponent extends OTableCellRendererIntegerComponent {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.minDecimalDigits = 2;
        this.maxDecimalDigits = 2;
        this.decimalSeparator = '.';
        this.tableColumn.type = 'real';
        this.numberService = this.injector.get(NumberService);
        this.setComponentPipe();
    }
    setComponentPipe() {
        this.componentPipe = new ORealPipe(this.injector);
    }
    initialize() {
        super.initialize();
        this.pipeArguments = {
            minDecimalDigits: this.minDecimalDigits,
            maxDecimalDigits: this.maxDecimalDigits,
            decimalSeparator: this.decimalSeparator,
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
        };
    }
}
OTableCellRendererRealComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-renderer-real',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n        {{ getCellData(cellvalue)}}\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL
            }] }
];
OTableCellRendererRealComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellRendererRealComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellRendererRealComponent.prototype, "minDecimalDigits", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellRendererRealComponent.prototype, "maxDecimalDigits", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3JlYWwvby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQXFCLFNBQVMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN2RSxPQUFPLEVBQ0wsNENBQTRDLEVBQzVDLGtDQUFrQyxHQUNuQyxNQUFNLG9EQUFvRCxDQUFDO0FBRTVELE1BQU0sQ0FBQyxNQUFNLHlDQUF5QyxHQUFHO0lBQ3ZELEdBQUcsNENBQTRDO0lBRS9DLHFDQUFxQztJQUNyQyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0NBQ3ZDLENBQUM7QUFRRixNQUFNLE9BQU8sK0JBQWdDLFNBQVEsa0NBQWtDO0lBZXJGLFlBQXNCLFFBQWtCO1FBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQURJLGFBQVEsR0FBUixRQUFRLENBQVU7UUFaeEMscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBRTdCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUVuQixxQkFBZ0IsR0FBVyxHQUFHLENBQUM7UUFVdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELGdCQUFnQjtRQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxVQUFVO1FBQ1IsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDbkIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7U0FDMUMsQ0FBQztJQUNKLENBQUM7OztZQXpDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMsdUhBQTBEO2dCQUMxRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsTUFBTSxFQUFFLHlDQUF5QzthQUNsRDs7O1lBdkI0QyxRQUFROzs7MEJBcUNsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztBQVY3RDtJQURDLGNBQWMsRUFBRTs7eUVBQ1k7QUFFN0I7SUFEQyxjQUFjLEVBQUU7O3lFQUNZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0b3IsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElSZWFsUGlwZUFyZ3VtZW50LCBPUmVhbFBpcGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9waXBlcy9vLXJlYWwucGlwZSc7XG5pbXBvcnQgeyBOdW1iZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvbnVtYmVyLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0lOVEVHRVIsXG4gIE9UYWJsZUNlbGxSZW5kZXJlckludGVnZXJDb21wb25lbnQsXG59IGZyb20gJy4uL2ludGVnZXIvby10YWJsZS1jZWxsLXJlbmRlcmVyLWludGVnZXIuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9SRUFMID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfSU5URUdFUixcbiAgLy8gZGVjaW1hbC1zZXBhcmF0b3IgW3N0cmluZ106IGRlY2ltYWwgc2VwYXJhdG9yLiBEZWZhdWx0OiBkb3QgKC4pLlxuICAnZGVjaW1hbFNlcGFyYXRvcjogZGVjaW1hbC1zZXBhcmF0b3InLFxuICAnbWluRGVjaW1hbERpZ2l0czogbWluLWRlY2ltYWwtZGlnaXRzJyxcbiAgJ21heERlY2ltYWxEaWdpdHM6IG1heC1kZWNpbWFsLWRpZ2l0cydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci1yZWFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci1yZWFsLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1JFQUxcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVyUmVhbENvbXBvbmVudCBleHRlbmRzIE9UYWJsZUNlbGxSZW5kZXJlckludGVnZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbkRlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heERlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG5cbiAgcHJvdGVjdGVkIGRlY2ltYWxTZXBhcmF0b3I6IHN0cmluZyA9ICcuJztcbiAgcHJvdGVjdGVkIG51bWJlclNlcnZpY2U6IE51bWJlclNlcnZpY2U7XG5cbiAgcHJvdGVjdGVkIGNvbXBvbmVudFBpcGU6IE9SZWFsUGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElSZWFsUGlwZUFyZ3VtZW50O1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICdyZWFsJztcbiAgICB0aGlzLm51bWJlclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChOdW1iZXJTZXJ2aWNlKTtcbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFBpcGUoKSB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9SZWFsUGlwZSh0aGlzLmluamVjdG9yKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cyA9IHtcbiAgICAgIG1pbkRlY2ltYWxEaWdpdHM6IHRoaXMubWluRGVjaW1hbERpZ2l0cyxcbiAgICAgIG1heERlY2ltYWxEaWdpdHM6IHRoaXMubWF4RGVjaW1hbERpZ2l0cyxcbiAgICAgIGRlY2ltYWxTZXBhcmF0b3I6IHRoaXMuZGVjaW1hbFNlcGFyYXRvcixcbiAgICAgIGdyb3VwaW5nOiB0aGlzLmdyb3VwaW5nLFxuICAgICAgdGhvdXNhbmRTZXBhcmF0b3I6IHRoaXMudGhvdXNhbmRTZXBhcmF0b3JcbiAgICB9O1xuICB9XG5cbn1cbiJdfQ==