import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { NumberService } from '../../../../../services/number.service';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, OTableCellRendererRealComponent, } from '../real/o-table-cell-renderer-real.component';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, [
    'valueBase: value-base'
]);
var OTableCellRendererPercentageComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererPercentageComponent, _super);
    function OTableCellRendererPercentageComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.decimalSeparator = '.';
        _this.minDecimalDigits = 0;
        _this.maxDecimalDigits = 0;
        _this.valueBase = 1;
        _this.tableColumn.type = 'percentage';
        _this.numberService = _this.injector.get(NumberService);
        _this.setComponentPipe();
        return _this;
    }
    OTableCellRendererPercentageComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OPercentPipe(this.injector);
    };
    OTableCellRendererPercentageComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.pipeArguments = {
            minDecimalDigits: this.minDecimalDigits,
            maxDecimalDigits: this.maxDecimalDigits,
            decimalSeparator: this.decimalSeparator,
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator,
            valueBase: this.valueBase
        };
    };
    OTableCellRendererPercentageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-percentage',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n        {{ getCellData(cellvalue)}}\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE
                }] }
    ];
    OTableCellRendererPercentageComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererPercentageComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererPercentageComponent;
}(OTableCellRendererRealComponent));
export { OTableCellRendererPercentageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXBlcmNlbnRhZ2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3BlcmNlbnRhZ2Uvby10YWJsZS1jZWxsLXJlbmRlcmVyLXBlcmNlbnRhZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBa0QsWUFBWSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDdEgsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3ZFLE9BQU8sRUFDTCx5Q0FBeUMsRUFDekMsK0JBQStCLEdBQ2hDLE1BQU0sOENBQThDLENBQUM7QUFFdEQsTUFBTSxDQUFDLElBQU0sK0NBQStDLG9CQUN2RCx5Q0FBeUM7SUFDNUMsdUJBQXVCO0VBQ3hCLENBQUM7QUFFRjtJQU0yRCxpRUFBK0I7SUFjeEYsK0NBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBS2hCO1FBTnFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFaeEMsc0JBQWdCLEdBQVcsR0FBRyxDQUFDO1FBQy9CLHNCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixzQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFDckIsZUFBUyxHQUE2QixDQUFDLENBQUM7UUFXdEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO1FBQ3JDLEtBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFdEQsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7O0lBQzFCLENBQUM7SUFFRCxnRUFBZ0IsR0FBaEI7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsMERBQVUsR0FBVjtRQUNFLGlCQUFNLFVBQVUsV0FBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUc7WUFDbkIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7WUFDekMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzFCLENBQUM7SUFDSixDQUFDOztnQkExQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQ0FBa0M7b0JBQzVDLHVIQUFnRTtvQkFDaEUsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSwrQ0FBK0M7aUJBQ3hEOzs7Z0JBbkI0QyxRQUFROzs7OEJBZ0NsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQTBCL0QsNENBQUM7Q0FBQSxBQTVDRCxDQU0yRCwrQkFBK0IsR0FzQ3pGO1NBdENZLHFDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdG9yLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSVBlcmNlbnRQaXBlQXJndW1lbnQsIE9QZXJjZW50YWdlVmFsdWVCYXNlVHlwZSwgT1BlcmNlbnRQaXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcGlwZXMvby1wZXJjZW50YWdlLnBpcGUnO1xuaW1wb3J0IHsgTnVtYmVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL251bWJlci5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9SRUFMLFxuICBPVGFibGVDZWxsUmVuZGVyZXJSZWFsQ29tcG9uZW50LFxufSBmcm9tICcuLi9yZWFsL28tdGFibGUtY2VsbC1yZW5kZXJlci1yZWFsLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfUEVSQ0VOVEFHRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1JFQUwsXG4gICd2YWx1ZUJhc2U6IHZhbHVlLWJhc2UnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtcmVuZGVyZXItcGVyY2VudGFnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtcmVuZGVyZXItcGVyY2VudGFnZS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9QRVJDRU5UQUdFXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxSZW5kZXJlclBlcmNlbnRhZ2VDb21wb25lbnQgZXh0ZW5kcyBPVGFibGVDZWxsUmVuZGVyZXJSZWFsQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBkZWNpbWFsU2VwYXJhdG9yOiBzdHJpbmcgPSAnLic7XG4gIG1pbkRlY2ltYWxEaWdpdHMgPSAwO1xuICBtYXhEZWNpbWFsRGlnaXRzID0gMDtcbiAgdmFsdWVCYXNlOiBPUGVyY2VudGFnZVZhbHVlQmFzZVR5cGUgPSAxO1xuXG4gIHByb3RlY3RlZCBudW1iZXJTZXJ2aWNlOiBOdW1iZXJTZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBjb21wb25lbnRQaXBlOiBPUGVyY2VudFBpcGU7XG4gIHByb3RlY3RlZCBwaXBlQXJndW1lbnRzOiBJUGVyY2VudFBpcGVBcmd1bWVudDtcblxuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLnRhYmxlQ29sdW1uLnR5cGUgPSAncGVyY2VudGFnZSc7XG4gICAgdGhpcy5udW1iZXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTnVtYmVyU2VydmljZSk7XG5cbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFBpcGUoKSB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9QZXJjZW50UGlwZSh0aGlzLmluamVjdG9yKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cyA9IHtcbiAgICAgIG1pbkRlY2ltYWxEaWdpdHM6IHRoaXMubWluRGVjaW1hbERpZ2l0cyxcbiAgICAgIG1heERlY2ltYWxEaWdpdHM6IHRoaXMubWF4RGVjaW1hbERpZ2l0cyxcbiAgICAgIGRlY2ltYWxTZXBhcmF0b3I6IHRoaXMuZGVjaW1hbFNlcGFyYXRvcixcbiAgICAgIGdyb3VwaW5nOiB0aGlzLmdyb3VwaW5nLFxuICAgICAgdGhvdXNhbmRTZXBhcmF0b3I6IHRoaXMudGhvdXNhbmRTZXBhcmF0b3IsXG4gICAgICB2YWx1ZUJhc2U6IHRoaXMudmFsdWVCYXNlXG4gICAgfTtcbiAgfVxuXG59XG4iXX0=