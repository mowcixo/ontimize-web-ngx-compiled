import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = [
    ...DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER,
    'format'
];
export class OTableCellRendererDateComponent extends OBaseTableCellRenderer {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.tableColumn.type = 'date';
        this.setComponentPipe();
    }
    setComponentPipe() {
        this.componentPipe = new OMomentPipe(this.injector);
    }
    initialize() {
        super.initialize();
        this.pipeArguments = {
            format: this.format
        };
    }
}
OTableCellRendererDateComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-renderer-date',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n   {{getCellData(cellvalue)}}\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE
            }] }
];
OTableCellRendererDateComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellRendererDateComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWRhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2RhdGUvby10YWJsZS1jZWxsLXJlbmRlcmVyLWRhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFVLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFN0csT0FBTyxFQUF1QixXQUFXLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUN0RixPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsTUFBTSx5Q0FBeUMsR0FBRztJQUN2RCxHQUFHLHlDQUF5QztJQUU1QyxRQUFRO0NBQ1QsQ0FBQztBQVFGLE1BQU0sT0FBTywrQkFBZ0MsU0FBUSxzQkFBc0I7SUFTekUsWUFBc0IsUUFBa0I7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBREksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUV0QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELGdCQUFnQjtRQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxVQUFVO1FBQ1IsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRW5CLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDbkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUM7SUFDSixDQUFDOzs7WUEvQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw0QkFBNEI7Z0JBQ3RDLGlIQUEwRDtnQkFDMUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSx5Q0FBeUM7YUFDbEQ7OztZQWhCNEMsUUFBUTs7OzBCQXdCbEQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdG9yLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSU1vbWVudFBpcGVBcmd1bWVudCwgT01vbWVudFBpcGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9waXBlcy9vLW1vbWVudC5waXBlJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLCBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIH0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0RBVEUgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLFxuICAvLyBmb3JtYXQgW3N0cmluZ106IGRhdGUgZm9ybWF0LiBTZWUgTW9tZW50SlMgKGh0dHA6Ly9tb21lbnRqcy5jb20vKS5cbiAgJ2Zvcm1hdCdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci1kYXRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci1kYXRlLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX0RBVEVcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVyRGF0ZUNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByb3RlY3RlZCBjb21wb25lbnRQaXBlOiBPTW9tZW50UGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElNb21lbnRQaXBlQXJndW1lbnQ7XG5cbiAgcHJvdGVjdGVkIGZvcm1hdDogc3RyaW5nO1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICdkYXRlJztcbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFBpcGUoKSB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9Nb21lbnRQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgLy8gQ2FsbGVkIGFmdGVyIHRoZSBjb25zdHJ1Y3RvciwgaW5pdGlhbGl6aW5nIGlucHV0IHByb3BlcnRpZXMsIGFuZCB0aGUgZmlyc3QgY2FsbCB0byBuZ09uQ2hhbmdlcy5cbiAgICB0aGlzLnBpcGVBcmd1bWVudHMgPSB7XG4gICAgICBmb3JtYXQ6IHRoaXMuZm9ybWF0XG4gICAgfTtcbiAgfVxufVxuIl19