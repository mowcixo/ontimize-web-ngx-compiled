import { Directive, ElementRef, EventEmitter, HostListener, Renderer2 } from '@angular/core';
import { ObservableWrapper } from '../../../util/async';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
var OGridItemDirective = (function () {
    function OGridItemDirective(_el, renderer) {
        this._el = _el;
        this.renderer = renderer;
        this.mdClick = new EventEmitter();
        this.mdDoubleClick = new EventEmitter();
    }
    OGridItemDirective.prototype.onMouseEnter = function () {
        if (Util.isDefined(this.grid) && this.grid.detailMode !== Codes.DETAIL_MODE_NONE) {
            this.renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
        }
    };
    OGridItemDirective.prototype.onClick = function (onNext) {
        return ObservableWrapper.subscribe(this.mdClick, onNext);
    };
    OGridItemDirective.prototype.onDoubleClick = function (onNext) {
        return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
    };
    OGridItemDirective.prototype.onItemClicked = function (e) {
        ObservableWrapper.callEmit(this.mdClick, this);
    };
    OGridItemDirective.prototype.onItemDoubleClicked = function (e) {
        ObservableWrapper.callEmit(this.mdDoubleClick, this);
    };
    OGridItemDirective.prototype.setItemData = function (data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    };
    OGridItemDirective.prototype.getItemData = function () {
        return this.modelData;
    };
    OGridItemDirective.prototype.setGridComponent = function (grid) {
        this.grid = grid;
    };
    OGridItemDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-grid-tile[o-grid-item]',
                    host: {
                        '(click)': 'onItemClicked($event)',
                        '(dblclick)': 'onItemDoubleClicked($event)'
                    }
                },] }
    ];
    OGridItemDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    OGridItemDirective.propDecorators = {
        onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }]
    };
    return OGridItemDirective;
}());
export { OGridItemDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2dyaWQvZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRzFDO0lBc0JFLDRCQUNTLEdBQWUsRUFDZCxRQUFtQjtRQURwQixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQWY3QixZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEQsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQWVsRCxDQUFDO0lBVEwseUNBQVksR0FEWjtRQUVFLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQ2hGLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNyRTtJQUNILENBQUM7SUFPTSxvQ0FBTyxHQUFkLFVBQWUsTUFBMEM7UUFDdkQsT0FBTyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sMENBQWEsR0FBcEIsVUFBcUIsTUFBMEM7UUFDN0QsT0FBTyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsMENBQWEsR0FBYixVQUFjLENBQVM7UUFDckIsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGdEQUFtQixHQUFuQixVQUFvQixDQUFTO1FBQzNCLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCx3Q0FBVyxHQUFYLFVBQVksSUFBWTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCx3Q0FBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCw2Q0FBZ0IsR0FBaEIsVUFBaUIsSUFBb0I7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQzs7Z0JBdkRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLHVCQUF1Qjt3QkFDbEMsWUFBWSxFQUFFLDZCQUE2QjtxQkFDNUM7aUJBQ0Y7OztnQkFibUIsVUFBVTtnQkFBOEIsU0FBUzs7OytCQXNCbEUsWUFBWSxTQUFDLFlBQVk7O0lBMEM1Qix5QkFBQztDQUFBLEFBekRELElBeURDO1NBbERZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0TGlzdGVuZXIsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0dyaWRDb21wb25lbnQgfSBmcm9tICcuLi9vLWdyaWQuY29tcG9uZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZVtvLWdyaWQtaXRlbV0nLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnb25JdGVtQ2xpY2tlZCgkZXZlbnQpJyxcbiAgICAnKGRibGNsaWNrKSc6ICdvbkl0ZW1Eb3VibGVDbGlja2VkKCRldmVudCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0dyaWRJdGVtRGlyZWN0aXZlIHtcblxuICBtZENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgbWREb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIG1vZGVsRGF0YTogb2JqZWN0O1xuXG4gIHByb3RlY3RlZCBncmlkOiBPR3JpZENvbXBvbmVudDtcblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgb25Nb3VzZUVudGVyKCk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLmdyaWQpICYmIHRoaXMuZ3JpZC5kZXRhaWxNb2RlICE9PSBDb2Rlcy5ERVRBSUxfTU9ERV9OT05FKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAncG9pbnRlcicpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXG4gICkgeyB9XG5cbiAgcHVibGljIG9uQ2xpY2sob25OZXh0OiAoaXRlbTogT0dyaWRJdGVtRGlyZWN0aXZlKSA9PiB2b2lkKTogb2JqZWN0IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKHRoaXMubWRDbGljaywgb25OZXh0KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkRvdWJsZUNsaWNrKG9uTmV4dDogKGl0ZW06IE9HcmlkSXRlbURpcmVjdGl2ZSkgPT4gdm9pZCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh0aGlzLm1kRG91YmxlQ2xpY2ssIG9uTmV4dCk7XG4gIH1cblxuICBvbkl0ZW1DbGlja2VkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMubWRDbGljaywgdGhpcyk7XG4gIH1cblxuICBvbkl0ZW1Eb3VibGVDbGlja2VkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMubWREb3VibGVDbGljaywgdGhpcyk7XG4gIH1cblxuICBzZXRJdGVtRGF0YShkYXRhOiBvYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubW9kZWxEYXRhKSB7XG4gICAgICB0aGlzLm1vZGVsRGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG5cbiAgZ2V0SXRlbURhdGEoKTogb2JqZWN0IHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbERhdGE7XG4gIH1cblxuICBzZXRHcmlkQ29tcG9uZW50KGdyaWQ6IE9HcmlkQ29tcG9uZW50KTogdm9pZCB7XG4gICAgdGhpcy5ncmlkID0gZ3JpZDtcbiAgfVxuXG59XG4iXX0=