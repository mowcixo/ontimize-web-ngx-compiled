import { Directive, ElementRef, EventEmitter, HostListener, Renderer2 } from '@angular/core';
import { ObservableWrapper } from '../../../util/async';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
export class OGridItemDirective {
    constructor(_el, renderer) {
        this._el = _el;
        this.renderer = renderer;
        this.mdClick = new EventEmitter();
        this.mdDoubleClick = new EventEmitter();
    }
    onMouseEnter() {
        if (Util.isDefined(this.grid) && this.grid.detailMode !== Codes.DETAIL_MODE_NONE) {
            this.renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
        }
    }
    onClick(onNext) {
        return ObservableWrapper.subscribe(this.mdClick, onNext);
    }
    onDoubleClick(onNext) {
        return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
    }
    onItemClicked(e) {
        ObservableWrapper.callEmit(this.mdClick, this);
    }
    onItemDoubleClicked(e) {
        ObservableWrapper.callEmit(this.mdDoubleClick, this);
    }
    setItemData(data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    }
    getItemData() {
        return this.modelData;
    }
    setGridComponent(grid) {
        this.grid = grid;
    }
}
OGridItemDirective.decorators = [
    { type: Directive, args: [{
                selector: 'mat-grid-tile[o-grid-item]',
                host: {
                    '(click)': 'onItemClicked($event)',
                    '(dblclick)': 'onItemDoubleClicked($event)'
                }
            },] }
];
OGridItemDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
OGridItemDirective.propDecorators = {
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2dyaWQvZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU3RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBVTFDLE1BQU0sT0FBTyxrQkFBa0I7SUFlN0IsWUFDUyxHQUFlLEVBQ2QsUUFBbUI7UUFEcEIsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFmN0IsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFlbEQsQ0FBQztJQVRMLFlBQVk7UUFDVixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBT00sT0FBTyxDQUFDLE1BQTBDO1FBQ3ZELE9BQU8saUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLGFBQWEsQ0FBQyxNQUEwQztRQUM3RCxPQUFPLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxhQUFhLENBQUMsQ0FBUztRQUNyQixpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsQ0FBUztRQUMzQixpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVk7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBb0I7UUFDbkMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQzs7O1lBdkRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxJQUFJLEVBQUU7b0JBQ0osU0FBUyxFQUFFLHVCQUF1QjtvQkFDbEMsWUFBWSxFQUFFLDZCQUE2QjtpQkFDNUM7YUFDRjs7O1lBYm1CLFVBQVU7WUFBOEIsU0FBUzs7OzJCQXNCbEUsWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT2JzZXJ2YWJsZVdyYXBwZXIgfSBmcm9tICcuLi8uLi8uLi91dGlsL2FzeW5jJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9HcmlkQ29tcG9uZW50IH0gZnJvbSAnLi4vby1ncmlkLmNvbXBvbmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGVbby1ncmlkLWl0ZW1dJyxcbiAgaG9zdDoge1xuICAgICcoY2xpY2spJzogJ29uSXRlbUNsaWNrZWQoJGV2ZW50KScsXG4gICAgJyhkYmxjbGljayknOiAnb25JdGVtRG91YmxlQ2xpY2tlZCgkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9HcmlkSXRlbURpcmVjdGl2ZSB7XG5cbiAgbWRDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIG1kRG91YmxlQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBtb2RlbERhdGE6IG9iamVjdDtcblxuICBwcm90ZWN0ZWQgZ3JpZDogT0dyaWRDb21wb25lbnQ7XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2VlbnRlcicpXG4gIG9uTW91c2VFbnRlcigpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5ncmlkKSAmJiB0aGlzLmdyaWQuZGV0YWlsTW9kZSAhPT0gQ29kZXMuREVUQUlMX01PREVfTk9ORSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9lbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ3BvaW50ZXInKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgX2VsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHsgfVxuXG4gIHB1YmxpYyBvbkNsaWNrKG9uTmV4dDogKGl0ZW06IE9HcmlkSXRlbURpcmVjdGl2ZSkgPT4gdm9pZCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh0aGlzLm1kQ2xpY2ssIG9uTmV4dCk7XG4gIH1cblxuICBwdWJsaWMgb25Eb3VibGVDbGljayhvbk5leHQ6IChpdGVtOiBPR3JpZEl0ZW1EaXJlY3RpdmUpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5tZERvdWJsZUNsaWNrLCBvbk5leHQpO1xuICB9XG5cbiAgb25JdGVtQ2xpY2tlZChlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm1kQ2xpY2ssIHRoaXMpO1xuICB9XG5cbiAgb25JdGVtRG91YmxlQ2xpY2tlZChlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm1kRG91YmxlQ2xpY2ssIHRoaXMpO1xuICB9XG5cbiAgc2V0SXRlbURhdGEoZGF0YTogb2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1vZGVsRGF0YSkge1xuICAgICAgdGhpcy5tb2RlbERhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGdldEl0ZW1EYXRhKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxEYXRhO1xuICB9XG5cbiAgc2V0R3JpZENvbXBvbmVudChncmlkOiBPR3JpZENvbXBvbmVudCk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZCA9IGdyaWQ7XG4gIH1cblxufVxuIl19