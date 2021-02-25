import * as tslib_1 from "tslib";
import { CdkColumnDef } from '@angular/cdk/table';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Optional, ViewEncapsulation } from '@angular/core';
import { matSortAnimations, MatSortHeader, MatSortHeaderIntl } from '@angular/material';
import { OMatSort } from './o-mat-sort';
var OMatSortHeader = (function (_super) {
    tslib_1.__extends(OMatSortHeader, _super);
    function OMatSortHeader(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        var _this = _super.call(this, _intl, changeDetectorRef, _sort, _cdkColumnDef) || this;
        _this._intl = _intl;
        _this._sort = _sort;
        _this._cdkColumnDef = _cdkColumnDef;
        return _this;
    }
    OMatSortHeader.prototype._handleClick = function () {
        if (this._isDisabled()) {
            return;
        }
        this._sort.addSortColumn(this);
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
            this._disableViewStateAnimation = true;
        }
        var viewState = this._isSorted() ?
            { fromState: this._arrowDirection, toState: 'active' } :
            { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
        this._showIndicatorHint = false;
    };
    OMatSortHeader.prototype._isSorted = function () {
        return this._sort.isActive(this) && this._sort.hasDirection(this.id);
    };
    OMatSortHeader.prototype._updateArrowDirection = function () {
        this._arrowDirection = this._isSorted() ?
            this._sort.directionById[this.id] :
            (this.start || this._sort.start);
    };
    OMatSortHeader.prototype.refresh = function () {
        if (this._sort.isActive(this)) {
            this._setAnimationTransitionState({
                fromState: this._sort.directionById[this.id],
                toState: 'active'
            });
            this._showIndicatorHint = false;
        }
        else {
            this._viewState.toState = 'active';
            this._intl.changes.next();
        }
    };
    OMatSortHeader.decorators = [
        { type: Component, args: [{
                    selector: '[o-mat-sort-header]',
                    exportAs: 'oMatSortHeader',
                    template: "<div class=\"mat-sort-header-container\"\n     [class.mat-sort-header-sorted]=\"_isSorted()\"\n     [class.mat-sort-header-position-before]=\"arrowPosition == 'before'\">\n  <button class=\"mat-sort-header-button\" type=\"button\"\n          [attr.disabled]=\"_isDisabled() || null\"\n          [attr.aria-label]=\"_intl.sortButtonLabel(id)\"\n          (focus)=\"_setIndicatorHintVisible(true)\"\n          (blur)=\"_setIndicatorHintVisible(false)\">\n    <ng-content></ng-content>\n  </button>\n\n  <!-- Disable animations while a current animation is running -->\n  <div class=\"mat-sort-header-arrow\"\n       [@arrowOpacity]=\"_getArrowViewState()\"\n       [@arrowPosition]=\"_getArrowViewState()\"\n       [@allowChildren]=\"_getArrowDirectionState()\"\n       (@arrowPosition.start)=\"_disableViewStateAnimation = true\"\n       (@arrowPosition.done)=\"_disableViewStateAnimation = false\">\n    <div class=\"mat-sort-header-stem\"></div>\n    <div class=\"mat-sort-header-indicator\" [@indicator]=\"_getArrowDirectionState()\">\n      <div class=\"mat-sort-header-pointer-left\" [@leftPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-right\" [@rightPointer]=\"_getArrowDirectionState()\"></div>\n      <div class=\"mat-sort-header-pointer-middle\"></div>\n    </div>\n  </div>\n</div>",
                    host: {
                        '(click)': '_handleClick()',
                        '(mouseenter)': '_setIndicatorHintVisible(true)',
                        '(longpress)': '_setIndicatorHintVisible(true)',
                        '(mouseleave)': '_setIndicatorHintVisible(false)',
                        '[attr.aria-sort]': '_getAriaSortAttribute()',
                        '[class.mat-sort-header-disabled]': '_isDisabled()',
                    },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: ['disabled'],
                    animations: [
                        matSortAnimations.indicator,
                        matSortAnimations.leftPointer,
                        matSortAnimations.rightPointer,
                        matSortAnimations.arrowOpacity,
                        matSortAnimations.arrowPosition,
                        matSortAnimations.allowChildren,
                    ],
                    styles: [".mat-sort-header-container{display:flex;cursor:pointer}.mat-sort-header-disabled .mat-sort-header-container{cursor:default}.mat-sort-header-position-before{flex-direction:row-reverse}.mat-sort-header-button{border:none;background:0 0;display:flex;align-items:center;padding:0;cursor:inherit;outline:0;font:inherit;color:currentColor}.mat-sort-header-arrow{height:12px;width:12px;min-width:12px;margin:0 0 0 6px;position:relative;display:flex}.mat-sort-header-position-before .mat-sort-header-arrow{margin:0 6px 0 0}.mat-sort-header-stem{background:currentColor;height:10px;width:2px;margin:auto;display:flex;align-items:center}.mat-sort-header-indicator{width:100%;height:2px;display:flex;align-items:center;position:absolute;top:0;left:0}.mat-sort-header-pointer-middle{margin:auto;height:2px;width:2px;background:currentColor;transform:rotate(45deg)}.mat-sort-header-pointer-left,.mat-sort-header-pointer-right{background:currentColor;width:6px;height:2px;position:absolute;top:0}.mat-sort-header-pointer-left{transform-origin:right;left:0}.mat-sort-header-pointer-right{transform-origin:left;right:0}"]
                }] }
    ];
    OMatSortHeader.ctorParameters = function () { return [
        { type: MatSortHeaderIntl },
        { type: ChangeDetectorRef },
        { type: OMatSort, decorators: [{ type: Optional }] },
        { type: CdkColumnDef, decorators: [{ type: Optional }] }
    ]; };
    return OMatSortHeader;
}(MatSortHeader));
export { OMatSortHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtc29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQtaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkgsT0FBTyxFQUE0QixpQkFBaUIsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVsSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXhDO0lBMEJvQywwQ0FBYTtJQUUvQyx3QkFBbUIsS0FBd0IsRUFDekMsaUJBQW9DLEVBQ2pCLEtBQWUsRUFDZixhQUEyQjtRQUhoRCxZQUtFLGtCQUFNLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLFNBQ3REO1FBTmtCLFdBQUssR0FBTCxLQUFLLENBQW1CO1FBRXRCLFdBQUssR0FBTCxLQUFLLENBQVU7UUFDZixtQkFBYSxHQUFiLGFBQWEsQ0FBYzs7SUFHaEQsQ0FBQztJQUVELHFDQUFZLEdBQVo7UUFDRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUVuQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUcvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDOUUsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztTQUN4QztRQUlELElBQU0sU0FBUyxHQUE2QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUM1RCxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3hELEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3pELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxrQ0FBUyxHQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUVELDhDQUFxQixHQUFyQjtRQUNFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELGdDQUFPLEdBQVA7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQztnQkFDaEMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQzVDLE9BQU8sRUFBRSxRQUFRO2FBQ2xCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7U0FDakM7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7O2dCQTdFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsazBDQUFpQztvQkFFakMsSUFBSSxFQUFFO3dCQUNKLFNBQVMsRUFBRSxnQkFBZ0I7d0JBQzNCLGNBQWMsRUFBRSxnQ0FBZ0M7d0JBQ2hELGFBQWEsRUFBRSxnQ0FBZ0M7d0JBQy9DLGNBQWMsRUFBRSxpQ0FBaUM7d0JBQ2pELGtCQUFrQixFQUFFLHlCQUF5Qjt3QkFDN0Msa0NBQWtDLEVBQUUsZUFBZTtxQkFDcEQ7b0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3BCLFVBQVUsRUFBRTt3QkFDVixpQkFBaUIsQ0FBQyxTQUFTO3dCQUMzQixpQkFBaUIsQ0FBQyxXQUFXO3dCQUM3QixpQkFBaUIsQ0FBQyxZQUFZO3dCQUM5QixpQkFBaUIsQ0FBQyxZQUFZO3dCQUM5QixpQkFBaUIsQ0FBQyxhQUFhO3dCQUMvQixpQkFBaUIsQ0FBQyxhQUFhO3FCQUNoQzs7aUJBQ0Y7OztnQkE1Qm9FLGlCQUFpQjtnQkFEcEQsaUJBQWlCO2dCQUcxQyxRQUFRLHVCQWdDWixRQUFRO2dCQXBDSixZQUFZLHVCQXFDaEIsUUFBUTs7SUErQ2IscUJBQUM7Q0FBQSxBQTlFRCxDQTBCb0MsYUFBYSxHQW9EaEQ7U0FwRFksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka0NvbHVtbkRlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24sIG1hdFNvcnRBbmltYXRpb25zLCBNYXRTb3J0SGVhZGVyLCBNYXRTb3J0SGVhZGVySW50bCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT01hdFNvcnQgfSBmcm9tICcuL28tbWF0LXNvcnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbby1tYXQtc29ydC1oZWFkZXJdJyxcbiAgZXhwb3J0QXM6ICdvTWF0U29ydEhlYWRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zb3J0LWhlYWRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc29ydC1oZWFkZXIuc2NzcyddLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnX2hhbmRsZUNsaWNrKCknLFxuICAgICcobW91c2VlbnRlciknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHRydWUpJyxcbiAgICAnKGxvbmdwcmVzcyknOiAnX3NldEluZGljYXRvckhpbnRWaXNpYmxlKHRydWUpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZShmYWxzZSknLFxuICAgICdbYXR0ci5hcmlhLXNvcnRdJzogJ19nZXRBcmlhU29ydEF0dHJpYnV0ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1zb3J0LWhlYWRlci1kaXNhYmxlZF0nOiAnX2lzRGlzYWJsZWQoKScsXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnXSxcbiAgYW5pbWF0aW9uczogW1xuICAgIG1hdFNvcnRBbmltYXRpb25zLmluZGljYXRvcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5sZWZ0UG9pbnRlcixcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5yaWdodFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYXJyb3dPcGFjaXR5LFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93UG9zaXRpb24sXG4gICAgbWF0U29ydEFuaW1hdGlvbnMuYWxsb3dDaGlsZHJlbixcbiAgXVxufSlcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY29tcG9uZW50LWNsYXNzLXN1ZmZpeFxuZXhwb3J0IGNsYXNzIE9NYXRTb3J0SGVhZGVyIGV4dGVuZHMgTWF0U29ydEhlYWRlciB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIF9pbnRsOiBNYXRTb3J0SGVhZGVySW50bCxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9zb3J0OiBPTWF0U29ydCxcbiAgICBAT3B0aW9uYWwoKSBwdWJsaWMgX2Nka0NvbHVtbkRlZjogQ2RrQ29sdW1uRGVmKSB7XG5cbiAgICBzdXBlcihfaW50bCwgY2hhbmdlRGV0ZWN0b3JSZWYsIF9zb3J0LCBfY2RrQ29sdW1uRGVmKTtcbiAgfVxuXG4gIF9oYW5kbGVDbGljaygpIHtcbiAgICBpZiAodGhpcy5faXNEaXNhYmxlZCgpKSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fc29ydC5hZGRTb3J0Q29sdW1uKHRoaXMpO1xuXG4gICAgLy8gRG8gbm90IHNob3cgdGhlIGFuaW1hdGlvbiBpZiB0aGUgaGVhZGVyIHdhcyBhbHJlYWR5IHNob3duIGluIHRoZSByaWdodCBwb3NpdGlvbi5cbiAgICBpZiAodGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdoaW50JyB8fCB0aGlzLl92aWV3U3RhdGUudG9TdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVWaWV3U3RhdGVBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBhcnJvdyBpcyBub3cgc29ydGVkLCBhbmltYXRlIHRoZSBhcnJvdyBpbnRvIHBsYWNlLiBPdGhlcndpc2UsIGFuaW1hdGUgaXQgYXdheSBpbnRvXG4gICAgLy8gdGhlIGRpcmVjdGlvbiBpdCBpcyBmYWNpbmcuXG4gICAgY29uc3Qgdmlld1N0YXRlOiBBcnJvd1ZpZXdTdGF0ZVRyYW5zaXRpb24gPSB0aGlzLl9pc1NvcnRlZCgpID9cbiAgICAgIHsgZnJvbVN0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbiwgdG9TdGF0ZTogJ2FjdGl2ZScgfSA6XG4gICAgICB7IGZyb21TdGF0ZTogJ2FjdGl2ZScsIHRvU3RhdGU6IHRoaXMuX2Fycm93RGlyZWN0aW9uIH07XG4gICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHZpZXdTdGF0ZSk7XG5cbiAgICB0aGlzLl9zaG93SW5kaWNhdG9ySGludCA9IGZhbHNlO1xuICB9XG5cbiAgX2lzU29ydGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0LmlzQWN0aXZlKHRoaXMpICYmIHRoaXMuX3NvcnQuaGFzRGlyZWN0aW9uKHRoaXMuaWQpO1xuICB9XG5cbiAgX3VwZGF0ZUFycm93RGlyZWN0aW9uKCkge1xuICAgIHRoaXMuX2Fycm93RGlyZWN0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICB0aGlzLl9zb3J0LmRpcmVjdGlvbkJ5SWRbdGhpcy5pZF0gOlxuICAgICAgKHRoaXMuc3RhcnQgfHwgdGhpcy5fc29ydC5zdGFydCk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLl9zb3J0LmlzQWN0aXZlKHRoaXMpKSB7XG4gICAgICB0aGlzLl9zZXRBbmltYXRpb25UcmFuc2l0aW9uU3RhdGUoe1xuICAgICAgICBmcm9tU3RhdGU6IHRoaXMuX3NvcnQuZGlyZWN0aW9uQnlJZFt0aGlzLmlkXSxcbiAgICAgICAgdG9TdGF0ZTogJ2FjdGl2ZSdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fc2hvd0luZGljYXRvckhpbnQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPSAnYWN0aXZlJztcbiAgICAgIHRoaXMuX2ludGwuY2hhbmdlcy5uZXh0KCk7XG4gICAgfVxuICB9XG59XG4iXX0=