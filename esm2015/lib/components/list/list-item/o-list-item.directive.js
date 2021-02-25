import { Directive, ElementRef, EventEmitter, HostListener, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ObservableWrapper } from '../../../util/async';
import { Codes } from '../../../util/codes';
export class OListItemDirective {
    constructor(_el, renderer, actRoute) {
        this._el = _el;
        this.renderer = renderer;
        this.actRoute = actRoute;
        this.mdClick = new EventEmitter();
        this.mdDoubleClick = new EventEmitter();
        this.selectable = false;
    }
    ngOnInit() {
        this.subcription = this.actRoute.params.subscribe(params => this.updateActiveState(params));
    }
    ngOnDestroy() {
        if (this.subcription) {
            this.subcription.unsubscribe();
        }
    }
    onMouseEnter() {
        if (!this.selectable && this._list.detailMode !== Codes.DETAIL_MODE_NONE) {
            this.renderer.setStyle(this._el.nativeElement, 'cursor', 'pointer');
        }
    }
    updateActiveState(params) {
        if (this._list) {
            const aKeys = this._list.getKeys();
            if (this.modelData) {
                let _act = false;
                if (aKeys.length > 0) {
                    for (let k = 0; k < aKeys.length; ++k) {
                        const key = aKeys[k];
                        const id = params[key];
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
    }
    onItemClicked(e) {
        if (!this.selectable) {
            ObservableWrapper.callEmit(this.mdClick, this);
        }
    }
    onClick(onNext) {
        return ObservableWrapper.subscribe(this.mdClick, onNext);
    }
    onItemDoubleClicked(e) {
        if (!this.selectable) {
            ObservableWrapper.callEmit(this.mdDoubleClick, this);
        }
    }
    onDoubleClick(onNext) {
        return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
    }
    isSelected() {
        return this._list.isItemSelected(this.modelData);
    }
    onSelect() {
        this._list.setSelected(this.modelData);
    }
    setListComponent(list) {
        this._list = list;
    }
    setItemData(data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    }
    getItemData() {
        return this.modelData;
    }
}
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
OListItemDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ActivatedRoute }
];
OListItemDirective.propDecorators = {
    modelData: [{ type: Input, args: ['o-list-item',] }],
    selectable: [{ type: Input }],
    onMouseEnter: [{ type: HostListener, args: ['mouseenter',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2xpc3QvbGlzdC1pdGVtL28tbGlzdC1pdGVtLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUdqRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFXNUMsTUFBTSxPQUFPLGtCQUFrQjtJQWM3QixZQUNTLEdBQWUsRUFDZCxRQUFtQixFQUNwQixRQUF3QjtRQUZ4QixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNwQixhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQWYxQixZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEQsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU10RCxlQUFVLEdBQVksS0FBSyxDQUFDO0lBUy9CLENBQUM7SUFFRSxRQUFRO1FBQ2IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFH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LElBQUksQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFTSxXQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDOzs7WUFoSEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnRUFBZ0U7Z0JBQzFFLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixJQUFJLEVBQUU7b0JBQ0oscUJBQXFCLEVBQUUsTUFBTTtvQkFDN0IsU0FBUyxFQUFFLHVCQUF1QjtvQkFDbEMsWUFBWSxFQUFFLDZCQUE2QjtpQkFDNUM7YUFDRjs7O1lBZm1CLFVBQVU7WUFBd0QsU0FBUztZQUN0RixjQUFjOzs7d0JBb0JwQixLQUFLLFNBQUMsYUFBYTt5QkFHbkIsS0FBSzsyQkFzQkwsWUFBWSxTQUFDLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBJTGlzdCB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvby1saXN0LmludGVyZmFjZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnby1saXN0LWl0ZW0sIG1hdC1saXN0LWl0ZW1bby1saXN0LWl0ZW1dLCBtYXQtY2FyZFtvLWxpc3QtaXRlbV0nLFxuICBleHBvcnRBczogJ29saXN0aXRlbScsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tbGlzdC1pdGVtXSc6ICd0cnVlJyxcbiAgICAnKGNsaWNrKSc6ICdvbkl0ZW1DbGlja2VkKCRldmVudCknLFxuICAgICcoZGJsY2xpY2spJzogJ29uSXRlbURvdWJsZUNsaWNrZWQoJGV2ZW50KSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPTGlzdEl0ZW1EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIG1kQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgbWREb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQElucHV0KCdvLWxpc3QtaXRlbScpXG4gIHB1YmxpYyBtb2RlbERhdGE6IG9iamVjdDtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgc2VsZWN0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBfbGlzdDogSUxpc3Q7XG4gIHByb3RlY3RlZCBzdWJjcmlwdGlvbjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGVcbiAgKSB7IH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJjcmlwdGlvbiA9IHRoaXMuYWN0Um91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4gdGhpcy51cGRhdGVBY3RpdmVTdGF0ZShwYXJhbXMpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZW50ZXInKVxuICBwdWJsaWMgb25Nb3VzZUVudGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RhYmxlICYmIHRoaXMuX2xpc3QuZGV0YWlsTW9kZSAhPT0gQ29kZXMuREVUQUlMX01PREVfTk9ORSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLl9lbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ3BvaW50ZXInKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQWN0aXZlU3RhdGUocGFyYW1zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2xpc3QpIHtcbiAgICAgIGNvbnN0IGFLZXlzID0gdGhpcy5fbGlzdC5nZXRLZXlzKCk7XG4gICAgICBpZiAodGhpcy5tb2RlbERhdGEpIHtcbiAgICAgICAgbGV0IF9hY3QgPSBmYWxzZTtcbiAgICAgICAgaWYgKGFLZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGFLZXlzLmxlbmd0aDsgKytrKSB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBhS2V5c1trXTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gcGFyYW1zW2tleV07XG4gICAgICAgICAgICBfYWN0ID0gKHRoaXMubW9kZWxEYXRhW2tleV0gPT09IGlkKTtcbiAgICAgICAgICAgIGlmIChfYWN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF9hY3QpIHtcbiAgICAgICAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1hY3RpdmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21hdC1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWwubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdtYXQtYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uSXRlbUNsaWNrZWQoZT86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMubWRDbGljaywgdGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQ2xpY2sob25OZXh0OiAoaXRlbTogT0xpc3RJdGVtRGlyZWN0aXZlKSA9PiB2b2lkKTogb2JqZWN0IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKHRoaXMubWRDbGljaywgb25OZXh0KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkl0ZW1Eb3VibGVDbGlja2VkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RhYmxlKSB7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm1kRG91YmxlQ2xpY2ssIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkRvdWJsZUNsaWNrKG9uTmV4dDogKGl0ZW06IE9MaXN0SXRlbURpcmVjdGl2ZSkgPT4gdm9pZCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh0aGlzLm1kRG91YmxlQ2xpY2ssIG9uTmV4dCk7XG4gIH1cblxuICBwdWJsaWMgaXNTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdC5pc0l0ZW1TZWxlY3RlZCh0aGlzLm1vZGVsRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgb25TZWxlY3QoKTogdm9pZCB7XG4gICAgdGhpcy5fbGlzdC5zZXRTZWxlY3RlZCh0aGlzLm1vZGVsRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc2V0TGlzdENvbXBvbmVudChsaXN0OiBJTGlzdCk6IHZvaWQge1xuICAgIHRoaXMuX2xpc3QgPSBsaXN0O1xuICB9XG5cbiAgcHVibGljIHNldEl0ZW1EYXRhKGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tb2RlbERhdGEpIHtcbiAgICAgIHRoaXMubW9kZWxEYXRhID0gZGF0YTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0SXRlbURhdGEoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbERhdGE7XG4gIH1cblxufVxuIl19