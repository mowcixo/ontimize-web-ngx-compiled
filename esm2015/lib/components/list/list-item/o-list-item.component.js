import { Component, ContentChild, ContentChildren, ElementRef, forwardRef, Inject, Injector, Optional, QueryList, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLine, MatListAvatarCssMatStyler, MatListItem } from '@angular/material';
import { Util } from '../../../util/util';
import { OListComponent } from '../o-list.component';
export class OListItemComponent {
    constructor(elRef, _renderer, _injector, _list) {
        this.elRef = elRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._list = _list;
        this._isSelected = false;
    }
    set _hasAvatar(avatar) {
        const listItemNativeEl = this.elRef.nativeElement.getElementsByTagName('mat-list-item');
        if (listItemNativeEl && listItemNativeEl.length === 1) {
            if ((avatar !== null && avatar !== undefined)) {
                this._renderer.addClass(listItemNativeEl[0], 'mat-list-avatar');
            }
            else {
                this._renderer.removeClass(listItemNativeEl[0], 'mat-list-avatar');
            }
        }
    }
    ngOnInit() {
        this._list.registerItem(this);
    }
    ngAfterContentInit() {
        const matLinesRef = this._lines;
        const ngAfterContentInitOriginal = this._innerListItem.ngAfterContentInit;
        this._innerListItem.ngAfterContentInit = function () {
            const emptyDiv = this._element.nativeElement.querySelector('.mat-list-text:empty');
            if (emptyDiv) {
                emptyDiv.remove();
            }
            this._lines = matLinesRef;
            ngAfterContentInitOriginal.apply(this);
        };
    }
    onClick(e) {
        if (!this._list.detailButtonInRow) {
            this._list.onItemDetailClick(this);
        }
    }
    onDoubleClick(e) {
        if (!this._list.detailButtonInRow) {
            this._list.onItemDetailDoubleClick(this);
        }
    }
    onDetailIconClicked(e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this._list.viewDetail(this.modelData);
    }
    onEditIconClicked(e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this._list.editDetail(this.modelData);
    }
    setItemData(data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    }
    getItemData() {
        return this.modelData;
    }
    onCheckboxChange(e) {
        if (this._list.selectable) {
            this._list.setSelected(this.modelData);
        }
    }
    get isSelected() {
        return this._list.selection.isSelected(this.modelData);
    }
}
OListItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-list-item',
                template: "<mat-list-item #innerListItem>\n  <div class=\"o-list-row-action o-list-item-selection-check\" *ngIf=\"_list && _list.selectable\">\n    <mat-checkbox [checked]=\"isSelected\" (change)=\"onCheckboxChange($event)\"></mat-checkbox>\n  </div>\n  <ng-content select=\"[o-list-item-avatar], [matListAvatar], [matListIcon]\"> </ng-content>\n  <div class=\"mat-list-text\">\n    <ng-content select=\"[matLine]\"></ng-content>\n  </div>\n  <ng-content></ng-content>\n  <div fxLayout=\"row\" class=\"row-buttons-container\">\n    <div class=\"o-list-row-action o-list-item-icon\" *ngIf=\"_list && _list.editButtonInRow\"\n      (click)=\"onEditIconClicked($event)\">\n      <mat-icon class=\"material-icons\">{{ _list.editButtonInRowIcon }}</mat-icon>\n    </div>\n    <div class=\"o-list-row-action o-list-item-icon\" *ngIf=\"_list && _list.detailButtonInRow\"\n      (click)=\"onDetailIconClicked($event)\">\n      <mat-icon class=\"material-icons\">{{ _list.detailButtonInRowIcon }}</mat-icon>\n    </div>\n  </div>\n</mat-list-item>",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-list-item]': 'true'
                },
                styles: [".o-list-item{display:flex}.o-list-item .mat-list-item{width:100%}.o-list-item .mat-list-item .o-list-item-selection-check{padding-right:16px}.o-list-item .mat-list-item .row-buttons-container .o-list-row-action{height:24px;text-align:center;cursor:pointer}.mat-list[dense] .o-list-item .o-list-row-action .mat-checkbox-inner-container{height:16px;width:16px}"]
            }] }
];
OListItemComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: OListComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OListComponent),] }] }
];
OListItemComponent.propDecorators = {
    _lines: [{ type: ContentChildren, args: [MatLine,] }],
    _innerListItem: [{ type: ViewChild, args: ['innerListItem', { static: true },] }],
    _hasAvatar: [{ type: ContentChild, args: [MatListAvatarCssMatStyler, { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2xpc3QvbGlzdC1pdGVtL28tbGlzdC1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUdwRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBV3JELE1BQU0sT0FBTyxrQkFBa0I7SUF1QjdCLFlBQ1MsS0FBaUIsRUFDZCxTQUFvQixFQUNwQixTQUFtQixFQUNnQyxLQUFxQjtRQUgzRSxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2QsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ2dDLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBeEIxRSxnQkFBVyxHQUFZLEtBQUssQ0FBQztJQXlCbkMsQ0FBQztJQWpCTCxJQUNJLFVBQVUsQ0FBQyxNQUFpQztRQUM5QyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hGLElBQUksZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNyRCxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxN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SSxFQUFFO29CQUNKLHFCQUFxQixFQUFFLE1BQU07aUJBQzlCOzthQUNGOzs7WUF6QkMsVUFBVTtZQU9WLFNBQVM7WUFKVCxRQUFRO1lBWUQsY0FBYyx1QkFzQ2xCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQzs7O3FCQXRCckQsZUFBZSxTQUFDLE9BQU87NkJBR3ZCLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFO3lCQUczQyxZQUFZLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRMaW5lLCBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLCBNYXRMaXN0SXRlbSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgSUxpc3RJdGVtIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLWxpc3QtaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPTGlzdENvbXBvbmVudCB9IGZyb20gJy4uL28tbGlzdC5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtaXRlbScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxpc3QtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbGlzdC1pdGVtLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tbGlzdC1pdGVtXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0SXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgSUxpc3RJdGVtLCBBZnRlckNvbnRlbnRJbml0IHtcblxuICBwdWJsaWMgbW9kZWxEYXRhOiBhbnk7XG4gIHByb3RlY3RlZCBfaXNTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSlcbiAgcHJvdGVjdGVkIF9saW5lczogUXVlcnlMaXN0PE1hdExpbmU+O1xuXG4gIEBWaWV3Q2hpbGQoJ2lubmVyTGlzdEl0ZW0nLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwcm90ZWN0ZWQgX2lubmVyTGlzdEl0ZW06IE1hdExpc3RJdGVtO1xuXG4gIEBDb250ZW50Q2hpbGQoTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlciwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHNldCBfaGFzQXZhdGFyKGF2YXRhcjogTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcikge1xuICAgIGNvbnN0IGxpc3RJdGVtTmF0aXZlRWwgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21hdC1saXN0LWl0ZW0nKTtcbiAgICBpZiAobGlzdEl0ZW1OYXRpdmVFbCAmJiBsaXN0SXRlbU5hdGl2ZUVsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKChhdmF0YXIgIT09IG51bGwgJiYgYXZhdGFyICE9PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKGxpc3RJdGVtTmF0aXZlRWxbMF0sICdtYXQtbGlzdC1hdmF0YXInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKGxpc3RJdGVtTmF0aXZlRWxbMF0sICdtYXQtbGlzdC1hdmF0YXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPTGlzdENvbXBvbmVudCkpIHB1YmxpYyBfbGlzdDogT0xpc3RDb21wb25lbnRcbiAgKSB7IH1cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fbGlzdC5yZWdpc3Rlckl0ZW0odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IG1hdExpbmVzUmVmID0gdGhpcy5fbGluZXM7XG5cbiAgICBjb25zdCBuZ0FmdGVyQ29udGVudEluaXRPcmlnaW5hbCA9IHRoaXMuX2lubmVyTGlzdEl0ZW0ubmdBZnRlckNvbnRlbnRJbml0O1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogc3BhY2UtYmVmb3JlLWZ1bmN0aW9uLXBhcmVuXG4gICAgdGhpcy5faW5uZXJMaXN0SXRlbS5uZ0FmdGVyQ29udGVudEluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBlbXB0eURpdiA9IHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWF0LWxpc3QtdGV4dDplbXB0eScpO1xuICAgICAgaWYgKGVtcHR5RGl2KSB7XG4gICAgICAgIGVtcHR5RGl2LnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fbGluZXMgPSBtYXRMaW5lc1JlZjtcbiAgICAgIG5nQWZ0ZXJDb250ZW50SW5pdE9yaWdpbmFsLmFwcGx5KHRoaXMpO1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgb25DbGljayhlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2xpc3QuZGV0YWlsQnV0dG9uSW5Sb3cpIHtcbiAgICAgIHRoaXMuX2xpc3Qub25JdGVtRGV0YWlsQ2xpY2sodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uRG91YmxlQ2xpY2soZT86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9saXN0LmRldGFpbEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLl9saXN0Lm9uSXRlbURldGFpbERvdWJsZUNsaWNrKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkRldGFpbEljb25DbGlja2VkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgdGhpcy5fbGlzdC52aWV3RGV0YWlsKHRoaXMubW9kZWxEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkVkaXRJY29uQ2xpY2tlZChlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZSkpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMuX2xpc3QuZWRpdERldGFpbCh0aGlzLm1vZGVsRGF0YSk7XG4gIH1cblxuICBwdWJsaWMgc2V0SXRlbURhdGEoZGF0YTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1vZGVsRGF0YSkge1xuICAgICAgdGhpcy5tb2RlbERhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRJdGVtRGF0YSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsRGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNoZWNrYm94Q2hhbmdlKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9saXN0LnNlbGVjdGFibGUpIHtcbiAgICAgIHRoaXMuX2xpc3Quc2V0U2VsZWN0ZWQodGhpcy5tb2RlbERhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc1NlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9saXN0LnNlbGVjdGlvbi5pc1NlbGVjdGVkKHRoaXMubW9kZWxEYXRhKTtcbiAgfVxuXG59XG4iXX0=