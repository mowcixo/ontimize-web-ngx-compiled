import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { NumberService } from '../../../../../services/number.service';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, OTableCellRendererRealComponent, } from '../real/o-table-cell-renderer-real.component';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL,
    'valueBase: value-base'
];
export class OTableCellRendererPercentageComponent extends OTableCellRendererRealComponent {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.decimalSeparator = '.';
        this.minDecimalDigits = 0;
        this.maxDecimalDigits = 0;
        this.valueBase = 1;
        this.tableColumn.type = 'percentage';
        this.numberService = this.injector.get(NumberService);
        this.setComponentPipe();
    }
    setComponentPipe() {
        this.componentPipe = new OPercentPipe(this.injector);
    }
    initialize() {
        super.initialize();
        this.pipeArguments = {
            minDecimalDigits: this.minDecimalDigits,
            maxDecimalDigits: this.maxDecimalDigits,
            decimalSeparator: this.decimalSeparator,
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator,
            valueBase: this.valueBase
        };
    }
}
OTableCellRendererPercentageComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-renderer-percentage',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n        {{ getCellData(cellvalue)}}\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE
            }] }
];
OTableCellRendererPercentageComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellRendererPercentageComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXBlcmNlbnRhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3BlcmNlbnRhZ2Uvby10YWJsZS1jZWxsLXJlbmRlcmVyLXBlcmNlbnRhZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFVLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0csT0FBTyxFQUFrRCxZQUFZLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN0SCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDdkUsT0FBTyxFQUNMLHlDQUF5QyxFQUN6QywrQkFBK0IsR0FDaEMsTUFBTSw4Q0FBOEMsQ0FBQztBQUV0RCxNQUFNLENBQUMsTUFBTSwrQ0FBK0MsR0FBRztJQUM3RCxHQUFHLHlDQUF5QztJQUM1Qyx1QkFBdUI7Q0FDeEIsQ0FBQztBQVFGLE1BQU0sT0FBTyxxQ0FBc0MsU0FBUSwrQkFBK0I7SUFjeEYsWUFBc0IsUUFBa0I7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBREksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVp4QyxxQkFBZ0IsR0FBVyxHQUFHLENBQUM7UUFDL0IscUJBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixjQUFTLEdBQTZCLENBQUMsQ0FBQztRQVd0QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7UUFDckMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUV0RCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFVBQVU7UUFDUixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsR0FBRztZQUNuQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtZQUN6QyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7U0FDMUIsQ0FBQztJQUNKLENBQUM7OztZQTFDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtDQUFrQztnQkFDNUMsdUhBQWdFO2dCQUNoRSxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsTUFBTSxFQUFFLCtDQUErQzthQUN4RDs7O1lBbkI0QyxRQUFROzs7MEJBZ0NsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0b3IsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJUGVyY2VudFBpcGVBcmd1bWVudCwgT1BlcmNlbnRhZ2VWYWx1ZUJhc2VUeXBlLCBPUGVyY2VudFBpcGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9waXBlcy9vLXBlcmNlbnRhZ2UucGlwZSc7XG5pbXBvcnQgeyBOdW1iZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvbnVtYmVyLnNlcnZpY2UnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1JFQUwsXG4gIE9UYWJsZUNlbGxSZW5kZXJlclJlYWxDb21wb25lbnQsXG59IGZyb20gJy4uL3JlYWwvby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9QRVJDRU5UQUdFID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfUkVBTCxcbiAgJ3ZhbHVlQmFzZTogdmFsdWUtYmFzZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci1wZXJjZW50YWdlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci1wZXJjZW50YWdlLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1BFUkNFTlRBR0Vcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVyUGVyY2VudGFnZUNvbXBvbmVudCBleHRlbmRzIE9UYWJsZUNlbGxSZW5kZXJlclJlYWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGRlY2ltYWxTZXBhcmF0b3I6IHN0cmluZyA9ICcuJztcbiAgbWluRGVjaW1hbERpZ2l0cyA9IDA7XG4gIG1heERlY2ltYWxEaWdpdHMgPSAwO1xuICB2YWx1ZUJhc2U6IE9QZXJjZW50YWdlVmFsdWVCYXNlVHlwZSA9IDE7XG5cbiAgcHJvdGVjdGVkIG51bWJlclNlcnZpY2U6IE51bWJlclNlcnZpY2U7XG5cbiAgcHJvdGVjdGVkIGNvbXBvbmVudFBpcGU6IE9QZXJjZW50UGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElQZXJjZW50UGlwZUFyZ3VtZW50O1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICdwZXJjZW50YWdlJztcbiAgICB0aGlzLm51bWJlclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChOdW1iZXJTZXJ2aWNlKTtcblxuICAgIHRoaXMuc2V0Q29tcG9uZW50UGlwZSgpO1xuICB9XG5cbiAgc2V0Q29tcG9uZW50UGlwZSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudFBpcGUgPSBuZXcgT1BlcmNlbnRQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5waXBlQXJndW1lbnRzID0ge1xuICAgICAgbWluRGVjaW1hbERpZ2l0czogdGhpcy5taW5EZWNpbWFsRGlnaXRzLFxuICAgICAgbWF4RGVjaW1hbERpZ2l0czogdGhpcy5tYXhEZWNpbWFsRGlnaXRzLFxuICAgICAgZGVjaW1hbFNlcGFyYXRvcjogdGhpcy5kZWNpbWFsU2VwYXJhdG9yLFxuICAgICAgZ3JvdXBpbmc6IHRoaXMuZ3JvdXBpbmcsXG4gICAgICB0aG91c2FuZFNlcGFyYXRvcjogdGhpcy50aG91c2FuZFNlcGFyYXRvcixcbiAgICAgIHZhbHVlQmFzZTogdGhpcy52YWx1ZUJhc2VcbiAgICB9O1xuICB9XG5cbn1cbiJdfQ==