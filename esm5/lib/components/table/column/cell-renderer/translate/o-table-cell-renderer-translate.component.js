import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'translateArgsFn: translate-params'
]);
var OTableCellRendererTranslateComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererTranslateComponent, _super);
    function OTableCellRendererTranslateComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.pipeArguments = {};
        _this.tableColumn.type = 'translate';
        _this.setComponentPipe();
        return _this;
    }
    OTableCellRendererTranslateComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OTranslatePipe(this.injector);
    };
    OTableCellRendererTranslateComponent.prototype.getCellData = function (cellvalue, rowvalue) {
        this.pipeArguments = this.translateArgsFn ? { values: this.translateArgsFn(rowvalue) } : {};
        return _super.prototype.getCellData.call(this, cellvalue, rowvalue);
    };
    OTableCellRendererTranslateComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-translate',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  {{ getCellData(cellvalue, rowvalue) }}\n</ng-template>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE
                }] }
    ];
    OTableCellRendererTranslateComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererTranslateComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererTranslateComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererTranslateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXRyYW5zbGF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NlbGwtcmVuZGVyZXIvdHJhbnNsYXRlL28tdGFibGUtY2VsbC1yZW5kZXJlci10cmFuc2xhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJHLE9BQU8sRUFBMEIsY0FBYyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDL0YsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFeEgsTUFBTSxDQUFDLElBQU0sOENBQThDLG9CQUN0RCx5Q0FBeUM7SUFFNUMsbUNBQW1DO0VBQ3BDLENBQUM7QUFFRjtJQU0wRCxnRUFBc0I7SUFVOUUsOENBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBS2hCO1FBTnFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFGOUIsbUJBQWEsR0FBMkIsRUFBRSxDQUFDO1FBS25ELEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUVwQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7SUFDMUIsQ0FBQztJQUVNLCtEQUFnQixHQUF2QjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFTSwwREFBVyxHQUFsQixVQUFtQixTQUFjLEVBQUUsUUFBYztRQUMvQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVGLE9BQU8saUJBQU0sV0FBVyxZQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDOztnQkEvQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQ0FBaUM7b0JBQzNDLHdKQUErRDtvQkFDL0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSw4Q0FBOEM7aUJBQ3ZEOzs7Z0JBaEI0QyxRQUFROzs7OEJBbUJsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQXlCL0QsMkNBQUM7Q0FBQSxBQWpDRCxDQU0wRCxzQkFBc0IsR0EyQi9FO1NBM0JZLG9DQUFvQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdG9yLCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElUcmFuc2xhdGVQaXBlQXJndW1lbnQsIE9UcmFuc2xhdGVQaXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcGlwZXMvby10cmFuc2xhdGUucGlwZSc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUiwgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciB9IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9UUkFOU0xBVEUgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLFxuICAvLyB0cmFuc2xhdGUtcGFyYW1zIFsocm93RGF0YTogYW55KSA9PiBhbnlbXV06IGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIHJvdyBkYXRhIGFuZCByZXR1cm4gdGhlIHBhcmFtZXRlcnMgZm9yIHRoZSB0cmFuc2xhdGUgcGlwZS5cbiAgJ3RyYW5zbGF0ZUFyZ3NGbjogdHJhbnNsYXRlLXBhcmFtcydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci10cmFuc2xhdGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLXRyYW5zbGF0ZS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9UUkFOU0xBVEVcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVyVHJhbnNsYXRlQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciB7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHB1YmxpYyB0cmFuc2xhdGVBcmdzRm46IChyb3dEYXRhOiBhbnkpID0+IGFueVtdO1xuXG4gIHByb3RlY3RlZCBjb21wb25lbnRQaXBlOiBPVHJhbnNsYXRlUGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElUcmFuc2xhdGVQaXBlQXJndW1lbnQgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuXG4gICAgdGhpcy50YWJsZUNvbHVtbi50eXBlID0gJ3RyYW5zbGF0ZSc7XG5cbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRDb21wb25lbnRQaXBlKCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50UGlwZSA9IG5ldyBPVHJhbnNsYXRlUGlwZSh0aGlzLmluamVjdG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZWxsRGF0YShjZWxsdmFsdWU6IGFueSwgcm93dmFsdWU/OiBhbnkpOiBzdHJpbmcge1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cyA9IHRoaXMudHJhbnNsYXRlQXJnc0ZuID8geyB2YWx1ZXM6IHRoaXMudHJhbnNsYXRlQXJnc0ZuKHJvd3ZhbHVlKSB9IDoge307XG4gICAgcmV0dXJuIHN1cGVyLmdldENlbGxEYXRhKGNlbGx2YWx1ZSwgcm93dmFsdWUpO1xuICB9XG5cbn1cbiJdfQ==