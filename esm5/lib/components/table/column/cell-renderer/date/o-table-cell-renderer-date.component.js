import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'format'
]);
var OTableCellRendererDateComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererDateComponent, _super);
    function OTableCellRendererDateComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.tableColumn.type = 'date';
        _this.setComponentPipe();
        return _this;
    }
    OTableCellRendererDateComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OMomentPipe(this.injector);
    };
    OTableCellRendererDateComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.pipeArguments = {
            format: this.format
        };
    };
    OTableCellRendererDateComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-date',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n   {{getCellData(cellvalue)}}\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_DATE
                }] }
    ];
    OTableCellRendererDateComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererDateComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererDateComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererDateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWRhdGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2RhdGUvby10YWJsZS1jZWxsLXJlbmRlcmVyLWRhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBdUIsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdEYsT0FBTyxFQUFFLHlDQUF5QyxFQUFFLHNCQUFzQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFeEgsTUFBTSxDQUFDLElBQU0seUNBQXlDLG9CQUNqRCx5Q0FBeUM7SUFFNUMsUUFBUTtFQUNULENBQUM7QUFFRjtJQU1xRCwyREFBc0I7SUFTekUseUNBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBR2hCO1FBSnFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFFdEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQy9CLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztJQUMxQixDQUFDO0lBRUQsMERBQWdCLEdBQWhCO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELG9EQUFVLEdBQVY7UUFDRSxpQkFBTSxVQUFVLFdBQUUsQ0FBQztRQUVuQixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDO0lBQ0osQ0FBQzs7Z0JBL0JGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxpSEFBMEQ7b0JBQzFELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUseUNBQXlDO2lCQUNsRDs7O2dCQWhCNEMsUUFBUTs7OzhCQXdCbEQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFtQi9ELHNDQUFDO0NBQUEsQUFoQ0QsQ0FNcUQsc0JBQXNCLEdBMEIxRTtTQTFCWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElNb21lbnRQaXBlQXJndW1lbnQsIE9Nb21lbnRQaXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcGlwZXMvby1tb21lbnQucGlwZSc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUiwgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciB9IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9EQVRFID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0JBU0VfVEFCTEVfQ0VMTF9SRU5ERVJFUixcbiAgLy8gZm9ybWF0IFtzdHJpbmddOiBkYXRlIGZvcm1hdC4gU2VlIE1vbWVudEpTIChodHRwOi8vbW9tZW50anMuY29tLykuXG4gICdmb3JtYXQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtcmVuZGVyZXItZGF0ZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtcmVuZGVyZXItZGF0ZS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9EQVRFXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxSZW5kZXJlckRhdGVDb21wb25lbnQgZXh0ZW5kcyBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcm90ZWN0ZWQgY29tcG9uZW50UGlwZTogT01vbWVudFBpcGU7XG4gIHByb3RlY3RlZCBwaXBlQXJndW1lbnRzOiBJTW9tZW50UGlwZUFyZ3VtZW50O1xuXG4gIHByb3RlY3RlZCBmb3JtYXQ6IHN0cmluZztcblxuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLnRhYmxlQ29sdW1uLnR5cGUgPSAnZGF0ZSc7XG4gICAgdGhpcy5zZXRDb21wb25lbnRQaXBlKCk7XG4gIH1cblxuICBzZXRDb21wb25lbnRQaXBlKCkge1xuICAgIHRoaXMuY29tcG9uZW50UGlwZSA9IG5ldyBPTW9tZW50UGlwZSh0aGlzLmluamVjdG9yKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIC8vIENhbGxlZCBhZnRlciB0aGUgY29uc3RydWN0b3IsIGluaXRpYWxpemluZyBpbnB1dCBwcm9wZXJ0aWVzLCBhbmQgdGhlIGZpcnN0IGNhbGwgdG8gbmdPbkNoYW5nZXMuXG4gICAgdGhpcy5waXBlQXJndW1lbnRzID0ge1xuICAgICAgZm9ybWF0OiB0aGlzLmZvcm1hdFxuICAgIH07XG4gIH1cbn1cbiJdfQ==