import { CdkColumnDef } from '@angular/cdk/table';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Optional, ViewEncapsulation } from '@angular/core';
import { matSortAnimations, MatSortHeader, MatSortHeaderIntl } from '@angular/material';
import { OMatSort } from './o-mat-sort';
export class OMatSortHeader extends MatSortHeader {
    constructor(_intl, changeDetectorRef, _sort, _cdkColumnDef) {
        super(_intl, changeDetectorRef, _sort, _cdkColumnDef);
        this._intl = _intl;
        this._sort = _sort;
        this._cdkColumnDef = _cdkColumnDef;
    }
    _handleClick() {
        if (this._isDisabled()) {
            return;
        }
        this._sort.addSortColumn(this);
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
            this._disableViewStateAnimation = true;
        }
        const viewState = this._isSorted() ?
            { fromState: this._arrowDirection, toState: 'active' } :
            { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
        this._showIndicatorHint = false;
    }
    _isSorted() {
        return this._sort.isActive(this) && this._sort.hasDirection(this.id);
    }
    _updateArrowDirection() {
        this._arrowDirection = this._isSorted() ?
            this._sort.directionById[this.id] :
            (this.start || this._sort.start);
    }
    refresh() {
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
    }
}
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
OMatSortHeader.ctorParameters = () => [
    { type: MatSortHeaderIntl },
    { type: ChangeDetectorRef },
    { type: OMatSort, decorators: [{ type: Optional }] },
    { type: CdkColumnDef, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtc29ydC1oZWFkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQtaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuSCxPQUFPLEVBQTRCLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWxILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUE0QnhDLE1BQU0sT0FBTyxjQUFlLFNBQVEsYUFBYTtJQUUvQyxZQUFtQixLQUF3QixFQUN6QyxpQkFBb0MsRUFDakIsS0FBZSxFQUNmLGFBQTJCO1FBRTlDLEtBQUssQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBTHJDLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBRXRCLFVBQUssR0FBTCxLQUFLLENBQVU7UUFDZixrQkFBYSxHQUFiLGFBQWEsQ0FBYztJQUdoRCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBRW5DLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRy9CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUM5RSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDO1NBQ3hDO1FBSUQsTUFBTSxTQUFTLEdBQTZCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQzVELEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEQsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDekQsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQscUJBQXFCO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLElBQUksQ0FBQyw0QkFBNEIsQ0FBQztnQkFDaEMsU0FBUyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQzVDLE9BQU8sRUFBRSxRQUFRO2FBQ2xCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7U0FDakM7YUFBTTtZQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7OztZQTdFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsazBDQUFpQztnQkFFakMsSUFBSSxFQUFFO29CQUNKLFNBQVMsRUFBRSxnQkFBZ0I7b0JBQzNCLGNBQWMsRUFBRSxnQ0FBZ0M7b0JBQ2hELGFBQWEsRUFBRSxnQ0FBZ0M7b0JBQy9DLGNBQWMsRUFBRSxpQ0FBaUM7b0JBQ2pELGtCQUFrQixFQUFFLHlCQUF5QjtvQkFDN0Msa0NBQWtDLEVBQUUsZUFBZTtpQkFDcEQ7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRTtvQkFDVixpQkFBaUIsQ0FBQyxTQUFTO29CQUMzQixpQkFBaUIsQ0FBQyxXQUFXO29CQUM3QixpQkFBaUIsQ0FBQyxZQUFZO29CQUM5QixpQkFBaUIsQ0FBQyxZQUFZO29CQUM5QixpQkFBaUIsQ0FBQyxhQUFhO29CQUMvQixpQkFBaUIsQ0FBQyxhQUFhO2lCQUNoQzs7YUFDRjs7O1lBNUJvRSxpQkFBaUI7WUFEcEQsaUJBQWlCO1lBRzFDLFFBQVEsdUJBZ0NaLFFBQVE7WUFwQ0osWUFBWSx1QkFxQ2hCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZGtDb2x1bW5EZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uLCBtYXRTb3J0QW5pbWF0aW9ucywgTWF0U29ydEhlYWRlciwgTWF0U29ydEhlYWRlckludGwgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IE9NYXRTb3J0IH0gZnJvbSAnLi9vLW1hdC1zb3J0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW28tbWF0LXNvcnQtaGVhZGVyXScsXG4gIGV4cG9ydEFzOiAnb01hdFNvcnRIZWFkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vc29ydC1oZWFkZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NvcnQtaGVhZGVyLnNjc3MnXSxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ19oYW5kbGVDbGljaygpJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh0cnVlKScsXG4gICAgJyhsb25ncHJlc3MpJzogJ19zZXRJbmRpY2F0b3JIaW50VmlzaWJsZSh0cnVlKScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdfc2V0SW5kaWNhdG9ySGludFZpc2libGUoZmFsc2UpJyxcbiAgICAnW2F0dHIuYXJpYS1zb3J0XSc6ICdfZ2V0QXJpYVNvcnRBdHRyaWJ1dGUoKScsXG4gICAgJ1tjbGFzcy5tYXQtc29ydC1oZWFkZXItZGlzYWJsZWRdJzogJ19pc0Rpc2FibGVkKCknLFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5pbmRpY2F0b3IsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMubGVmdFBvaW50ZXIsXG4gICAgbWF0U29ydEFuaW1hdGlvbnMucmlnaHRQb2ludGVyLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFycm93T3BhY2l0eSxcbiAgICBtYXRTb3J0QW5pbWF0aW9ucy5hcnJvd1Bvc2l0aW9uLFxuICAgIG1hdFNvcnRBbmltYXRpb25zLmFsbG93Q2hpbGRyZW4sXG4gIF1cbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGNvbXBvbmVudC1jbGFzcy1zdWZmaXhcbmV4cG9ydCBjbGFzcyBPTWF0U29ydEhlYWRlciBleHRlbmRzIE1hdFNvcnRIZWFkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfaW50bDogTWF0U29ydEhlYWRlckludGwsXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIHB1YmxpYyBfc29ydDogT01hdFNvcnQsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIF9jZGtDb2x1bW5EZWY6IENka0NvbHVtbkRlZikge1xuXG4gICAgc3VwZXIoX2ludGwsIGNoYW5nZURldGVjdG9yUmVmLCBfc29ydCwgX2Nka0NvbHVtbkRlZik7XG4gIH1cblxuICBfaGFuZGxlQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuX2lzRGlzYWJsZWQoKSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvcnQuYWRkU29ydENvbHVtbih0aGlzKTtcblxuICAgIC8vIERvIG5vdCBzaG93IHRoZSBhbmltYXRpb24gaWYgdGhlIGhlYWRlciB3YXMgYWxyZWFkeSBzaG93biBpbiB0aGUgcmlnaHQgcG9zaXRpb24uXG4gICAgaWYgKHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID09PSAnaGludCcgfHwgdGhpcy5fdmlld1N0YXRlLnRvU3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlVmlld1N0YXRlQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgYXJyb3cgaXMgbm93IHNvcnRlZCwgYW5pbWF0ZSB0aGUgYXJyb3cgaW50byBwbGFjZS4gT3RoZXJ3aXNlLCBhbmltYXRlIGl0IGF3YXkgaW50b1xuICAgIC8vIHRoZSBkaXJlY3Rpb24gaXQgaXMgZmFjaW5nLlxuICAgIGNvbnN0IHZpZXdTdGF0ZTogQXJyb3dWaWV3U3RhdGVUcmFuc2l0aW9uID0gdGhpcy5faXNTb3J0ZWQoKSA/XG4gICAgICB7IGZyb21TdGF0ZTogdGhpcy5fYXJyb3dEaXJlY3Rpb24sIHRvU3RhdGU6ICdhY3RpdmUnIH0gOlxuICAgICAgeyBmcm9tU3RhdGU6ICdhY3RpdmUnLCB0b1N0YXRlOiB0aGlzLl9hcnJvd0RpcmVjdGlvbiB9O1xuICAgIHRoaXMuX3NldEFuaW1hdGlvblRyYW5zaXRpb25TdGF0ZSh2aWV3U3RhdGUpO1xuXG4gICAgdGhpcy5fc2hvd0luZGljYXRvckhpbnQgPSBmYWxzZTtcbiAgfVxuXG4gIF9pc1NvcnRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5pc0FjdGl2ZSh0aGlzKSAmJiB0aGlzLl9zb3J0Lmhhc0RpcmVjdGlvbih0aGlzLmlkKTtcbiAgfVxuXG4gIF91cGRhdGVBcnJvd0RpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9hcnJvd0RpcmVjdGlvbiA9IHRoaXMuX2lzU29ydGVkKCkgP1xuICAgICAgdGhpcy5fc29ydC5kaXJlY3Rpb25CeUlkW3RoaXMuaWRdIDpcbiAgICAgICh0aGlzLnN0YXJ0IHx8IHRoaXMuX3NvcnQuc3RhcnQpO1xuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICBpZiAodGhpcy5fc29ydC5pc0FjdGl2ZSh0aGlzKSkge1xuICAgICAgdGhpcy5fc2V0QW5pbWF0aW9uVHJhbnNpdGlvblN0YXRlKHtcbiAgICAgICAgZnJvbVN0YXRlOiB0aGlzLl9zb3J0LmRpcmVjdGlvbkJ5SWRbdGhpcy5pZF0sXG4gICAgICAgIHRvU3RhdGU6ICdhY3RpdmUnXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3Nob3dJbmRpY2F0b3JIaW50ID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3ZpZXdTdGF0ZS50b1N0YXRlID0gJ2FjdGl2ZSc7XG4gICAgICB0aGlzLl9pbnRsLmNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxufVxuIl19