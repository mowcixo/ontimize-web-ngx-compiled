import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE = [
    ...DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER,
    'translateArgsFn: translate-params'
];
export class OTableCellRendererTranslateComponent extends OBaseTableCellRenderer {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.pipeArguments = {};
        this.tableColumn.type = 'translate';
        this.setComponentPipe();
    }
    setComponentPipe() {
        this.componentPipe = new OTranslatePipe(this.injector);
    }
    getCellData(cellvalue, rowvalue) {
        this.pipeArguments = this.translateArgsFn ? { values: this.translateArgsFn(rowvalue) } : {};
        return super.getCellData(cellvalue, rowvalue);
    }
}
OTableCellRendererTranslateComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-renderer-translate',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  {{ getCellData(cellvalue, rowvalue) }}\n</ng-template>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE
            }] }
];
OTableCellRendererTranslateComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellRendererTranslateComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXRyYW5zbGF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NlbGwtcmVuZGVyZXIvdHJhbnNsYXRlL28tdGFibGUtY2VsbC1yZW5kZXJlci10cmFuc2xhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckcsT0FBTyxFQUEwQixjQUFjLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMvRixPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsTUFBTSw4Q0FBOEMsR0FBRztJQUM1RCxHQUFHLHlDQUF5QztJQUU1QyxtQ0FBbUM7Q0FDcEMsQ0FBQztBQVFGLE1BQU0sT0FBTyxvQ0FBcUMsU0FBUSxzQkFBc0I7SUFVOUUsWUFBc0IsUUFBa0I7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBREksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUY5QixrQkFBYSxHQUEyQixFQUFFLENBQUM7UUFLbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO1FBRXBDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTSxnQkFBZ0I7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVNLFdBQVcsQ0FBQyxTQUFjLEVBQUUsUUFBYztRQUMvQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVGLE9BQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7O1lBL0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUNBQWlDO2dCQUMzQyx3SkFBK0Q7Z0JBQy9ELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxNQUFNLEVBQUUsOENBQThDO2FBQ3ZEOzs7WUFoQjRDLFFBQVE7OzswQkFtQmxELFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJVHJhbnNsYXRlUGlwZUFyZ3VtZW50LCBPVHJhbnNsYXRlUGlwZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3BpcGVzL28tdHJhbnNsYXRlLnBpcGUnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgfSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1yZW5kZXJlci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfVFJBTlNMQVRFID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUixcbiAgLy8gdHJhbnNsYXRlLXBhcmFtcyBbKHJvd0RhdGE6IGFueSkgPT4gYW55W11dOiBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSByb3cgZGF0YSBhbmQgcmV0dXJuIHRoZSBwYXJhbWV0ZXJzIGZvciB0aGUgdHJhbnNsYXRlIHBpcGUuXG4gICd0cmFuc2xhdGVBcmdzRm46IHRyYW5zbGF0ZS1wYXJhbXMnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtcmVuZGVyZXItdHJhbnNsYXRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci10cmFuc2xhdGUuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfVFJBTlNMQVRFXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxSZW5kZXJlclRyYW5zbGF0ZUNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIge1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBwdWJsaWMgdHJhbnNsYXRlQXJnc0ZuOiAocm93RGF0YTogYW55KSA9PiBhbnlbXTtcblxuICBwcm90ZWN0ZWQgY29tcG9uZW50UGlwZTogT1RyYW5zbGF0ZVBpcGU7XG4gIHByb3RlY3RlZCBwaXBlQXJndW1lbnRzOiBJVHJhbnNsYXRlUGlwZUFyZ3VtZW50ID0ge307XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcblxuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICd0cmFuc2xhdGUnO1xuXG4gICAgdGhpcy5zZXRDb21wb25lbnRQaXBlKCk7XG4gIH1cblxuICBwdWJsaWMgc2V0Q29tcG9uZW50UGlwZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvbmVudFBpcGUgPSBuZXcgT1RyYW5zbGF0ZVBpcGUodGhpcy5pbmplY3Rvcik7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VsbERhdGEoY2VsbHZhbHVlOiBhbnksIHJvd3ZhbHVlPzogYW55KTogc3RyaW5nIHtcbiAgICB0aGlzLnBpcGVBcmd1bWVudHMgPSB0aGlzLnRyYW5zbGF0ZUFyZ3NGbiA/IHsgdmFsdWVzOiB0aGlzLnRyYW5zbGF0ZUFyZ3NGbihyb3d2YWx1ZSkgfSA6IHt9O1xuICAgIHJldHVybiBzdXBlci5nZXRDZWxsRGF0YShjZWxsdmFsdWUsIHJvd3ZhbHVlKTtcbiAgfVxuXG59XG4iXX0=