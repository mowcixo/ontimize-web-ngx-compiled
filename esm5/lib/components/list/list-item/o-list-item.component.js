import { Component, ContentChild, ContentChildren, ElementRef, forwardRef, Inject, Injector, Optional, QueryList, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatLine, MatListAvatarCssMatStyler, MatListItem } from '@angular/material';
import { Util } from '../../../util/util';
import { OListComponent } from '../o-list.component';
var OListItemComponent = (function () {
    function OListItemComponent(elRef, _renderer, _injector, _list) {
        this.elRef = elRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._list = _list;
        this._isSelected = false;
    }
    Object.defineProperty(OListItemComponent.prototype, "_hasAvatar", {
        set: function (avatar) {
            var listItemNativeEl = this.elRef.nativeElement.getElementsByTagName('mat-list-item');
            if (listItemNativeEl && listItemNativeEl.length === 1) {
                if ((avatar !== null && avatar !== undefined)) {
                    this._renderer.addClass(listItemNativeEl[0], 'mat-list-avatar');
                }
                else {
                    this._renderer.removeClass(listItemNativeEl[0], 'mat-list-avatar');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    OListItemComponent.prototype.ngOnInit = function () {
        this._list.registerItem(this);
    };
    OListItemComponent.prototype.ngAfterContentInit = function () {
        var matLinesRef = this._lines;
        var ngAfterContentInitOriginal = this._innerListItem.ngAfterContentInit;
        this._innerListItem.ngAfterContentInit = function () {
            var emptyDiv = this._element.nativeElement.querySelector('.mat-list-text:empty');
            if (emptyDiv) {
                emptyDiv.remove();
            }
            this._lines = matLinesRef;
            ngAfterContentInitOriginal.apply(this);
        };
    };
    OListItemComponent.prototype.onClick = function (e) {
        if (!this._list.detailButtonInRow) {
            this._list.onItemDetailClick(this);
        }
    };
    OListItemComponent.prototype.onDoubleClick = function (e) {
        if (!this._list.detailButtonInRow) {
            this._list.onItemDetailDoubleClick(this);
        }
    };
    OListItemComponent.prototype.onDetailIconClicked = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this._list.viewDetail(this.modelData);
    };
    OListItemComponent.prototype.onEditIconClicked = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this._list.editDetail(this.modelData);
    };
    OListItemComponent.prototype.setItemData = function (data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    };
    OListItemComponent.prototype.getItemData = function () {
        return this.modelData;
    };
    OListItemComponent.prototype.onCheckboxChange = function (e) {
        if (this._list.selectable) {
            this._list.setSelected(this.modelData);
        }
    };
    Object.defineProperty(OListItemComponent.prototype, "isSelected", {
        get: function () {
            return this._list.selection.isSelected(this.modelData);
        },
        enumerable: true,
        configurable: true
    });
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
    OListItemComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector },
        { type: OListComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OListComponent; }),] }] }
    ]; };
    OListItemComponent.propDecorators = {
        _lines: [{ type: ContentChildren, args: [MatLine,] }],
        _innerListItem: [{ type: ViewChild, args: ['innerListItem', { static: true },] }],
        _hasAvatar: [{ type: ContentChild, args: [MatListAvatarCssMatStyler, { static: false },] }]
    };
    return OListItemComponent;
}());
export { OListItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2xpc3QvbGlzdC1pdGVtL28tbGlzdC1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixTQUFTLEVBQ1QsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUdwRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXJEO0lBZ0NFLDRCQUNTLEtBQWlCLEVBQ2QsU0FBb0IsRUFDcEIsU0FBbUIsRUFDZ0MsS0FBcUI7UUFIM0UsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNkLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDcEIsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNnQyxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQXhCMUUsZ0JBQVcsR0FBWSxLQUFLLENBQUM7SUF5Qm5DLENBQUM7SUFqQkwsc0JBQ0ksMENBQVU7YUFEZCxVQUNlLE1BQWlDO1lBQzlDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDeEYsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyRCxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLEtBQUssU0FBUyxDQUFDLEVBQUU7b0JBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7aUJBQ2pFO3FCQUFNO29CQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7aUJBQ3BFO2FBQ0Y7UUFDSCxDQUFDOzs7T0FBQTtJQVNNLHFDQUFRLEdBQWY7UUFDRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sK0NBQWtCLEdBQXpCO1FBQ0UsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVoQyxJQUFNLDBCQUEwQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUM7UUFFMUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRztZQUN2QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNuRixJQUFJLFFBQVEsRUFBRTtnQkFDWixRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbkI7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQztZQUMxQiwwQkFBMEIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVNLG9DQUFPLEdBQWQsVUFBZSxDQUFTO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFO1lBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRU0sMENBQWEsR0FBcEIsVUFBcUIsQ0FBUztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVNLGdEQUFtQixHQUExQixVQUEyQixDQUFTO1FBQ2xDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLDhDQUFpQixHQUF4QixVQUF5QixDQUFTO1FBQ2hDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLHdDQUFXLEdBQWxCLFVBQW1CLElBQVM7UUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRU0sd0NBQVcsR0FBbEI7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDeEIsQ0FBQztJQUVNLDZDQUFnQixHQUF2QixVQUF3QixDQUFTO1FBQy9CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELHNCQUFJLDBDQUFVO2FBQWQ7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekQsQ0FBQzs7O09BQUE7O2dCQXRHRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLCtnQ0FBMkM7b0JBRTNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0oscUJBQXFCLEVBQUUsTUFBTTtxQkFDOUI7O2lCQUNGOzs7Z0JBekJDLFVBQVU7Z0JBT1YsU0FBUztnQkFKVCxRQUFRO2dCQVlELGNBQWMsdUJBc0NsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQzs7O3lCQXRCckQsZUFBZSxTQUFDLE9BQU87aUNBR3ZCLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzZCQUczQyxZQUFZLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQW9GNUQseUJBQUM7Q0FBQSxBQXhHRCxJQXdHQztTQS9GWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdExpbmUsIE1hdExpc3RBdmF0YXJDc3NNYXRTdHlsZXIsIE1hdExpc3RJdGVtIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBJTGlzdEl0ZW0gfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL28tbGlzdC1pdGVtLmludGVyZmFjZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9MaXN0Q29tcG9uZW50IH0gZnJvbSAnLi4vby1saXN0LmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbGlzdC1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC1pdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1saXN0LWl0ZW0uY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1saXN0LWl0ZW1dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBJTGlzdEl0ZW0sIEFmdGVyQ29udGVudEluaXQge1xuXG4gIHB1YmxpYyBtb2RlbERhdGE6IGFueTtcbiAgcHJvdGVjdGVkIF9pc1NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaW5lKVxuICBwcm90ZWN0ZWQgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG5cbiAgQFZpZXdDaGlsZCgnaW5uZXJMaXN0SXRlbScsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHByb3RlY3RlZCBfaW5uZXJMaXN0SXRlbTogTWF0TGlzdEl0ZW07XG5cbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgc2V0IF9oYXNBdmF0YXIoYXZhdGFyOiBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyKSB7XG4gICAgY29uc3QgbGlzdEl0ZW1OYXRpdmVFbCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWF0LWxpc3QtaXRlbScpO1xuICAgIGlmIChsaXN0SXRlbU5hdGl2ZUVsICYmIGxpc3RJdGVtTmF0aXZlRWwubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoKGF2YXRhciAhPT0gbnVsbCAmJiBhdmF0YXIgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobGlzdEl0ZW1OYXRpdmVFbFswXSwgJ21hdC1saXN0LWF2YXRhcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3MobGlzdEl0ZW1OYXRpdmVFbFswXSwgJ21hdC1saXN0LWF2YXRhcicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJvdGVjdGVkIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9MaXN0Q29tcG9uZW50KSkgcHVibGljIF9saXN0OiBPTGlzdENvbXBvbmVudFxuICApIHsgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9saXN0LnJlZ2lzdGVySXRlbSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgbWF0TGluZXNSZWYgPSB0aGlzLl9saW5lcztcblxuICAgIGNvbnN0IG5nQWZ0ZXJDb250ZW50SW5pdE9yaWdpbmFsID0gdGhpcy5faW5uZXJMaXN0SXRlbS5uZ0FmdGVyQ29udGVudEluaXQ7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBzcGFjZS1iZWZvcmUtZnVuY3Rpb24tcGFyZW5cbiAgICB0aGlzLl9pbm5lckxpc3RJdGVtLm5nQWZ0ZXJDb250ZW50SW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IGVtcHR5RGl2ID0gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYXQtbGlzdC10ZXh0OmVtcHR5Jyk7XG4gICAgICBpZiAoZW1wdHlEaXYpIHtcbiAgICAgICAgZW1wdHlEaXYucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9saW5lcyA9IG1hdExpbmVzUmVmO1xuICAgICAgbmdBZnRlckNvbnRlbnRJbml0T3JpZ2luYWwuYXBwbHkodGhpcyk7XG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fbGlzdC5kZXRhaWxCdXR0b25JblJvdykge1xuICAgICAgdGhpcy5fbGlzdC5vbkl0ZW1EZXRhaWxDbGljayh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25Eb3VibGVDbGljayhlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2xpc3QuZGV0YWlsQnV0dG9uSW5Sb3cpIHtcbiAgICAgIHRoaXMuX2xpc3Qub25JdGVtRGV0YWlsRG91YmxlQ2xpY2sodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uRGV0YWlsSWNvbkNsaWNrZWQoZT86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGUpKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICB0aGlzLl9saXN0LnZpZXdEZXRhaWwodGhpcy5tb2RlbERhdGEpO1xuICB9XG5cbiAgcHVibGljIG9uRWRpdEljb25DbGlja2VkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgdGhpcy5fbGlzdC5lZGl0RGV0YWlsKHRoaXMubW9kZWxEYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRJdGVtRGF0YShkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubW9kZWxEYXRhKSB7XG4gICAgICB0aGlzLm1vZGVsRGF0YSA9IGRhdGE7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldEl0ZW1EYXRhKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxEYXRhO1xuICB9XG5cbiAgcHVibGljIG9uQ2hlY2tib3hDaGFuZ2UoZT86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2xpc3Quc2VsZWN0YWJsZSkge1xuICAgICAgdGhpcy5fbGlzdC5zZXRTZWxlY3RlZCh0aGlzLm1vZGVsRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGlzU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3Quc2VsZWN0aW9uLmlzU2VsZWN0ZWQodGhpcy5tb2RlbERhdGEpO1xuICB9XG5cbn1cbiJdfQ==