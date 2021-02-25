import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'format'
]);
var OTableCellRendererTimeComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererTimeComponent, _super);
    function OTableCellRendererTimeComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this._format = 'L HH:mm a';
        _this.tableColumn.type = 'time';
        _this.setComponentPipe();
        return _this;
    }
    Object.defineProperty(OTableCellRendererTimeComponent.prototype, "format", {
        set: function (value) {
            if (Util.isDefined(value)) {
                this._format = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    OTableCellRendererTimeComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OMomentPipe(this.injector);
    };
    OTableCellRendererTimeComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.pipeArguments = {
            format: this._format
        };
    };
    OTableCellRendererTimeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-time',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n   {{getCellData(cellvalue)}}\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME
                }] }
    ];
    OTableCellRendererTimeComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererTimeComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererTimeComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererTimeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXRpbWUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3RpbWUvby10YWJsZS1jZWxsLXJlbmRlcmVyLXRpbWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBdUIsV0FBVyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDdEYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSx5Q0FBeUMsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRXhILE1BQU0sQ0FBQyxJQUFNLHlDQUF5QyxvQkFDakQseUNBQXlDO0lBQzVDLFFBQVE7RUFDVCxDQUFDO0FBRUY7SUFNcUQsMkRBQXNCO0lBVXpFLHlDQUFzQixRQUFrQjtRQUF4QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxTQUdoQjtRQUpxQixjQUFRLEdBQVIsUUFBUSxDQUFVO1FBTDlCLGFBQU8sR0FBVyxXQUFXLENBQUM7UUFPdEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQy9CLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztJQUMxQixDQUFDO0lBRUQsc0JBQUksbURBQU07YUFBVixVQUFXLEtBQWE7WUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzthQUN0QjtRQUNILENBQUM7OztPQUFBO0lBQ0QsMERBQWdCLEdBQWhCO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELG9EQUFVLEdBQVY7UUFDRSxpQkFBTSxVQUFVLFdBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTztTQUNyQixDQUFDO0lBQ0osQ0FBQzs7Z0JBcENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxpSEFBMEQ7b0JBQzFELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUseUNBQXlDO2lCQUNsRDs7O2dCQWhCNEMsUUFBUTs7OzhCQXlCbEQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUF1Qi9ELHNDQUFDO0NBQUEsQUFyQ0QsQ0FNcUQsc0JBQXNCLEdBK0IxRTtTQS9CWSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElNb21lbnRQaXBlQXJndW1lbnQsIE9Nb21lbnRQaXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcGlwZXMvby1tb21lbnQucGlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLCBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIH0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1RJTUUgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9UQUJMRV9DRUxMX1JFTkRFUkVSLFxuICAnZm9ybWF0J1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLXJlbmRlcmVyLXRpbWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLXRpbWUuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfVElNRVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsUmVuZGVyZXJUaW1lQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIGNvbXBvbmVudFBpcGU6IE9Nb21lbnRQaXBlO1xuICBwcm90ZWN0ZWQgcGlwZUFyZ3VtZW50czogSU1vbWVudFBpcGVBcmd1bWVudDtcblxuICBwcm90ZWN0ZWQgX2Zvcm1hdDogc3RyaW5nID0gJ0wgSEg6bW0gYSc7XG4gIHByb3RlY3RlZCBsb2NhbGU6IHN0cmluZztcblxuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLnRhYmxlQ29sdW1uLnR5cGUgPSAndGltZSc7XG4gICAgdGhpcy5zZXRDb21wb25lbnRQaXBlKCk7XG4gIH1cblxuICBzZXQgZm9ybWF0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICB0aGlzLl9mb3JtYXQgPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgc2V0Q29tcG9uZW50UGlwZSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudFBpcGUgPSBuZXcgT01vbWVudFBpcGUodGhpcy5pbmplY3Rvcik7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnBpcGVBcmd1bWVudHMgPSB7XG4gICAgICBmb3JtYXQ6IHRoaXMuX2Zvcm1hdFxuICAgIH07XG4gIH1cbn1cbiJdfQ==