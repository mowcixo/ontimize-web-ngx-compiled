import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { OTableComponent } from '../../../o-table.component';
import { OBaseTablePaginator } from './o-base-table-paginator.class';
export var DEFAULT_PAGINATOR_TABLE = [
    'pageSize: page-size',
    'showFirstLastButtons: show-first-last-buttons'
];
var OTablePaginatorComponent = (function (_super) {
    tslib_1.__extends(OTablePaginatorComponent, _super);
    function OTablePaginatorComponent(injector, table) {
        var _this = _super.call(this) || this;
        _this.injector = injector;
        _this.table = table;
        _this._pageIndex = 0;
        _this._pageSize = 10;
        _this.showFirstLastButtons = true;
        _this.pageSize = _this.table.queryRows;
        _this.pageIndex = _this.table.currentPage;
        _this.showFirstLastButtons = _this.table.showPaginatorFirstLastButtons;
        return _this;
    }
    OTablePaginatorComponent.prototype.ngOnInit = function () {
        this.table.registerPagination(this);
    };
    Object.defineProperty(OTablePaginatorComponent.prototype, "pageIndex", {
        get: function () {
            return this._pageIndex;
        },
        set: function (value) {
            this._pageIndex = value;
            if (this.table.matpaginator) {
                this.table.matpaginator.pageIndex = this._pageIndex;
            }
        },
        enumerable: true,
        configurable: true
    });
    OTablePaginatorComponent.prototype.isShowingAllRows = function (selectedLength) {
        return false;
    };
    OTablePaginatorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-paginator',
                    template: ' ',
                    inputs: DEFAULT_PAGINATOR_TABLE,
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    OTablePaginatorComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTablePaginatorComponent.prototype, "showFirstLastButtons", void 0);
    return OTablePaginatorComponent;
}(OBaseTablePaginator));
export { OTablePaginatorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1wYWdpbmF0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvZm9vdGVyL3BhZ2luYXRvci9vLXRhYmxlLXBhZ2luYXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFekcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRTNFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVyRSxNQUFNLENBQUMsSUFBTSx1QkFBdUIsR0FBRztJQUVyQyxxQkFBcUI7SUFDckIsK0NBQStDO0NBQ2hELENBQUM7QUFFRjtJQU04QyxvREFBbUI7SUFTL0Qsa0NBQ1ksUUFBa0IsRUFDeUIsS0FBc0I7UUFGN0UsWUFJRSxpQkFBTyxTQUlSO1FBUFcsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQUN5QixXQUFLLEdBQUwsS0FBSyxDQUFpQjtRQVRuRSxnQkFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixlQUFTLEdBQVcsRUFBRSxDQUFDO1FBSWpDLDBCQUFvQixHQUFZLElBQUksQ0FBQztRQU9uQyxLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3JDLEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7UUFDeEMsS0FBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUM7O0lBQ3ZFLENBQUM7SUFFRCwyQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsc0JBQUksK0NBQVM7YUFBYjtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO2FBRUQsVUFBYyxLQUFhO1lBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3JEO1FBQ0gsQ0FBQzs7O09BUEE7SUFTTSxtREFBZ0IsR0FBdkIsVUFBd0IsY0FBc0I7UUFHNUMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOztnQkE1Q0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRSxHQUFHO29CQUNiLE1BQU0sRUFBRSx1QkFBdUI7b0JBQy9CLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2lCQUNoRDs7O2dCQWxCZ0UsUUFBUTtnQkFJaEUsZUFBZSx1QkEwQm5CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7O0lBSjNDO1FBREMsY0FBYyxFQUFFOzswRUFDb0I7SUFnQ3ZDLCtCQUFDO0NBQUEsQUE3Q0QsQ0FNOEMsbUJBQW1CLEdBdUNoRTtTQXZDWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtcGFnaW5hdG9yLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQmFzZVRhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9vLWJhc2UtdGFibGUtcGFnaW5hdG9yLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfUEFHSU5BVE9SX1RBQkxFID0gW1xuICAvLyBwYWdlLXNpemUgW251bWJlcl06IE51bWJlciBvZiBpdGVtcyB0byBkaXNwbGF5IG9uIGEgcGFnZS4gQnkgZGVmYXVsdCBzZXQgdG8gNTAuXG4gICdwYWdlU2l6ZTogcGFnZS1zaXplJyxcbiAgJ3Nob3dGaXJzdExhc3RCdXR0b25zOiBzaG93LWZpcnN0LWxhc3QtYnV0dG9ucydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtcGFnaW5hdG9yJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgaW5wdXRzOiBERUZBVUxUX1BBR0lOQVRPUl9UQUJMRSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlUGFnaW5hdG9yQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZVBhZ2luYXRvciBpbXBsZW1lbnRzIE9UYWJsZVBhZ2luYXRvciwgT25Jbml0IHtcblxuICBwcm90ZWN0ZWQgX3BhZ2VJbmRleDogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIF9wYWdlU2l6ZTogbnVtYmVyID0gMTA7XG4gIHByb3RlY3RlZCBfcGFnZVNpemVPcHRpb25zOiBBcnJheTxhbnk+O1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dGaXJzdExhc3RCdXR0b25zOiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwcm90ZWN0ZWQgdGFibGU6IE9UYWJsZUNvbXBvbmVudFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucGFnZVNpemUgPSB0aGlzLnRhYmxlLnF1ZXJ5Um93cztcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMudGFibGUuY3VycmVudFBhZ2U7XG4gICAgdGhpcy5zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IHRoaXMudGFibGUuc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnRhYmxlLnJlZ2lzdGVyUGFnaW5hdGlvbih0aGlzKTtcbiAgfVxuXG4gIGdldCBwYWdlSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZUluZGV4O1xuICB9XG5cbiAgc2V0IHBhZ2VJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fcGFnZUluZGV4ID0gdmFsdWU7XG4gICAgaWYgKHRoaXMudGFibGUubWF0cGFnaW5hdG9yKSB7XG4gICAgICB0aGlzLnRhYmxlLm1hdHBhZ2luYXRvci5wYWdlSW5kZXggPSB0aGlzLl9wYWdlSW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzU2hvd2luZ0FsbFJvd3Moc2VsZWN0ZWRMZW5ndGg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIC8vIHJldHVybiB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMuaW5kZXhPZihzZWxlY3RlZExlbmd0aCkgPT09ICh0aGlzLl9wYWdlU2l6ZU9wdGlvbnMubGVuZ3RoIC0gMSk7XG4gICAgLy8gdGVtcG9yYWwgd2hpbGUgbm90IGhhdmluZyBhbiBvcHRpb24gZm9yIHNob3dpbmcgYWxsIHJlY29yZHMgaW4gcGFnaW5hdGVkIHRhYmxlc1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19