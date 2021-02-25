import { Directive, ElementRef, EventEmitter, HostListener, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableWrapper } from '../../../util/async';
import { Codes } from '../../../util/codes';
var OListItemDirective = (function () {
    function OListItemDirective(_el, renderer, actRoute) {
        this._el = _el;
        this.renderer = renderer;
        this.actRoute = actRoute;
        this.mdClick = new EventEmitter();
        this.mdDoubleClick = new EventEmitter();
        this.selectable = false;
    }
    OListItemDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.subcription = this.actRoute.params.subscribe(function (params) { return _this.updateActiveState(params); });
    };
    OListItemDirective.prototype.ngOnDestroy = function () {
        if (this.subcription) {
            this.subcription.unsubscribe();
        }
    };
    OListItemDirective.prototype.onMouseEnter = function () {
        if (!this.selectable && this._list.detailMode !== Codes.DETAIL_MODE_NONE) {
            this.renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
        }
    };
    OListItemDirective.prototype.updateActiveState = function (params) {
        if (this._list) {
            var aKeys = this._list.getKeys();
            if (this.modelData) {
                var _act = false;
                if (aKeys.length > 0) {
                    for (var k = 0; k < aKeys.length; ++k) {
                        var key = aKeys[k];
                        var id = params[key];
                        _act = (this.modelData[key] === id);
                        if (_act === false) {
                            break;
                        }
                    }
                }
                if (_act) {
                    this._el.nativeElement.classList.add('mat-active');
                }
                else {
                    this._el.nativeElement.classList.remove('mat-active');
                }
            }
            else {
                this._el.nativeElement.classList.remove('mat-active');
            }
        }
    };
    OListItemDirective.prototype.onItemClicked = function (e) {
        if (!this.selectable) {
            ObservableWrapper.callEmit(this.mdClick, this);
        }
    };
    OListItemDirective.prototype.onClick = function (onNext) {
        return ObservableWrapper.subscribe(this.mdClick, onNext);
    };
    OListItemDirective.prototype.onItemDoubleClicked = function (e) {
        if (!this.selectable) {
            ObservableWrapper.callEmit(this.mdDoubleClick, this);
        }
    };
    OListItemDirective.prototype.onDoubleClick = function (onNext) {
        return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
    };
    OListItemDirective.prototype.isSelected = function () {
        return this._list.isItemSelected(this.modelData);
    };
    OListItemDirective.prototype.onSelect = function () {
        this._list.setSelected(this.modelData);
    };
    OListItemDirective.prototype.setListComponent = function (list) {
        this._list = list;
    };
    OListItemDirective.prototype.setItemData = function (data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    };
    OListItemDirective.prototype.getItemData = function () {
        return this.modelData;
    };
    OListItemDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'o-list-item, mat-list-item[o-list-item], mat-card[o-list-item]',
                    exportAs: 'olistitem',
                    host: {
                        '[class.o-list-item]': 'true',
                        '(click)': 'onItemClicked($event)',
                        '(dblclick)': 'onItemDoubleClicked($event)'
                    }
                },] }
    ];
    OListItemDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ActivatedRoute }
    ]; };
    OListItemDirective.propDecorators = {
        modelData: [{ type: Input, args: ['o-list-item',] }],
        selectable: [{ type: Input }],
        onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }]
    };
    return OListItemDirective;
}());
export { OListItemDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2xpc3QvbGlzdC1pdGVtL28tbGlzdC1pdGVtLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUdqRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFNUM7SUF1QkUsNEJBQ1MsR0FBZSxFQUNkLFFBQW1CLEVBQ3BCLFFBQXdCO1FBRnhCLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3BCLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBZjFCLFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoRCxrQkFBYSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBTXRELGVBQVUsR0FBWSxLQUFLLENBQUM7SUFTL0IsQ0FBQztJQUVFLHFDQUFRLEdBQWY7UUFBQSxpQkFFQztRQURDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsS0FBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUE5QixDQUE4QixDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVNLHdDQUFXLEdBQWxCO1FBQ0UsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7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SUFFTSx3Q0FBVyxHQUFsQixVQUFtQixJQUFTO1FBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUVNLHdDQUFXLEdBQWxCO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7O2dCQWhIRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdFQUFnRTtvQkFDMUUsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLElBQUksRUFBRTt3QkFDSixxQkFBcUIsRUFBRSxNQUFNO3dCQUM3QixTQUFTLEVBQUUsdUJBQXVCO3dCQUNsQyxZQUFZLEVBQUUsNkJBQTZCO3FCQUM1QztpQkFDRjs7O2dCQWZtQixVQUFVO2dCQUF3RCxTQUFTO2dCQUN0RixjQUFjOzs7NEJBb0JwQixLQUFLLFNBQUMsYUFBYTs2QkFHbkIsS0FBSzsrQkFzQkwsWUFBWSxTQUFDLFlBQVk7O0lBMkU1Qix5QkFBQztDQUFBLEFBbEhELElBa0hDO1NBekdZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IElMaXN0IH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLWxpc3QuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtaXRlbSwgbWF0LWxpc3QtaXRlbVtvLWxpc3QtaXRlbV0sIG1hdC1jYXJkW28tbGlzdC1pdGVtXScsXG4gIGV4cG9ydEFzOiAnb2xpc3RpdGVtJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1saXN0LWl0ZW1dJzogJ3RydWUnLFxuICAgICcoY2xpY2spJzogJ29uSXRlbUNsaWNrZWQoJGV2ZW50KScsXG4gICAgJyhkYmxjbGljayknOiAnb25JdGVtRG91YmxlQ2xpY2tlZCgkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0SXRlbURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgbWRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBtZERvdWJsZUNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBASW5wdXQoJ28tbGlzdC1pdGVtJylcbiAgcHVibGljIG1vZGVsRGF0YTogb2JqZWN0O1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBzZWxlY3RhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9saXN0OiBJTGlzdDtcbiAgcHJvdGVjdGVkIHN1YmNyaXB0aW9uOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9lbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVxuICApIHsgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YmNyaXB0aW9uID0gdGhpcy5hY3RSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB0aGlzLnVwZGF0ZUFjdGl2ZVN0YXRlKHBhcmFtcykpO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YmNyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YmNyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gIHB1YmxpYyBvbk1vdXNlRW50ZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdGFibGUgJiYgdGhpcy5fbGlzdC5kZXRhaWxNb2RlICE9PSBDb2Rlcy5ERVRBSUxfTU9ERV9OT05FKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAncG9pbnRlcicpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVBY3RpdmVTdGF0ZShwYXJhbXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fbGlzdCkge1xuICAgICAgY29uc3QgYUtleXMgPSB0aGlzLl9saXN0LmdldEtleXMoKTtcbiAgICAgIGlmICh0aGlzLm1vZGVsRGF0YSkge1xuICAgICAgICBsZXQgX2FjdCA9IGZhbHNlO1xuICAgICAgICBpZiAoYUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYUtleXMubGVuZ3RoOyArK2spIHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGFLZXlzW2tdO1xuICAgICAgICAgICAgY29uc3QgaWQgPSBwYXJhbXNba2V5XTtcbiAgICAgICAgICAgIF9hY3QgPSAodGhpcy5tb2RlbERhdGFba2V5XSA9PT0gaWQpO1xuICAgICAgICAgICAgaWYgKF9hY3QgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoX2FjdCkge1xuICAgICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LWFjdGl2ZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0LWFjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21hdC1hY3RpdmUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25JdGVtQ2xpY2tlZChlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2VsZWN0YWJsZSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5tZENsaWNrLCB0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25DbGljayhvbk5leHQ6IChpdGVtOiBPTGlzdEl0ZW1EaXJlY3RpdmUpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5tZENsaWNrLCBvbk5leHQpO1xuICB9XG5cbiAgcHVibGljIG9uSXRlbURvdWJsZUNsaWNrZWQoZT86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMubWREb3VibGVDbGljaywgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uRG91YmxlQ2xpY2sob25OZXh0OiAoaXRlbTogT0xpc3RJdGVtRGlyZWN0aXZlKSA9PiB2b2lkKTogb2JqZWN0IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKHRoaXMubWREb3VibGVDbGljaywgb25OZXh0KTtcbiAgfVxuXG4gIHB1YmxpYyBpc1NlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9saXN0LmlzSXRlbVNlbGVjdGVkKHRoaXMubW9kZWxEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBvblNlbGVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9saXN0LnNldFNlbGVjdGVkKHRoaXMubW9kZWxEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRMaXN0Q29tcG9uZW50KGxpc3Q6IElMaXN0KTogdm9pZCB7XG4gICAgdGhpcy5fbGlzdCA9IGxpc3Q7XG4gIH1cblxuICBwdWJsaWMgc2V0SXRlbURhdGEoZGF0YTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1vZGVsRGF0YSkge1xuICAgICAgdGhpcy5tb2RlbERhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRJdGVtRGF0YSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsRGF0YTtcbiAgfVxuXG59XG4iXX0=