import { EventEmitter } from '@angular/core';
import { Util } from '../../../util/util';
export var DEFAULT_INPUTS_O_CARD_RENDERER = [
    'title',
    'subtitle',
    'image',
    'showImage: show-image',
    'action1Text: action-1-text',
    'action2Text: action-2-text'
];
export var DEFAULT_OUTPUTS_O_CARD_RENDERER = [
    'onAction1Click: action-1',
    'onAction2Click: action-2'
];
var OListItemCardRenderer = (function () {
    function OListItemCardRenderer(elRef, _renderer, _injector, _listItem) {
        this.elRef = elRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._listItem = _listItem;
        this._showImage = true;
        this.onAction1Click = new EventEmitter();
        this.onAction2Click = new EventEmitter();
    }
    OListItemCardRenderer.prototype.modifyMatListItemElement = function () {
        if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
            var matListItem = this.elRef.nativeElement.parentElement.parentElement;
            matListItem.querySelector('.mat-list-text').remove();
            matListItem.classList.add('o-card-item');
        }
    };
    OListItemCardRenderer.prototype.onAction1ButtonClick = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this.onAction1Click.emit(e);
    };
    OListItemCardRenderer.prototype.onAction2ButtonClick = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this.onAction2Click.emit(e);
    };
    OListItemCardRenderer.prototype.compareListHeight = function (height) {
        return (height === this._listItem._list.rowHeight) || undefined;
    };
    Object.defineProperty(OListItemCardRenderer.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (val) {
            this._title = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemCardRenderer.prototype, "subtitle", {
        get: function () {
            return this._subtitle;
        },
        set: function (val) {
            this._subtitle = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemCardRenderer.prototype, "image", {
        get: function () {
            return this._image;
        },
        set: function (val) {
            this._image = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemCardRenderer.prototype, "showImage", {
        get: function () {
            return this._showImage;
        },
        set: function (val) {
            this._showImage = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemCardRenderer.prototype, "action1Text", {
        get: function () {
            return this._action1Text;
        },
        set: function (val) {
            this._action1Text = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemCardRenderer.prototype, "action2Text", {
        get: function () {
            return this._action2Text;
        },
        set: function (val) {
            this._action2Text = val;
        },
        enumerable: true,
        configurable: true
    });
    return OListItemCardRenderer;
}());
export { OListItemCardRenderer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tY2FyZC1yZW5kZXJlci5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L3JlbmRlcmVycy9vLWxpc3QtaXRlbS1jYXJkLXJlbmRlcmVyLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxZQUFZLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBRTlFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxNQUFNLENBQUMsSUFBTSw4QkFBOEIsR0FBRztJQUM1QyxPQUFPO0lBQ1AsVUFBVTtJQUNWLE9BQU87SUFDUCx1QkFBdUI7SUFDdkIsNEJBQTRCO0lBQzVCLDRCQUE0QjtDQUM3QixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sK0JBQStCLEdBQUc7SUFDN0MsMEJBQTBCO0lBQzFCLDBCQUEwQjtDQUMzQixDQUFDO0FBRUY7SUFjRSwrQkFDUyxLQUFpQixFQUNkLFNBQW9CLEVBQ3BCLFNBQW1CLEVBQ25CLFNBQTZCO1FBSGhDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDZCxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFaL0IsZUFBVSxHQUFZLElBQUksQ0FBQztRQUlyQyxtQkFBYyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBQ2xFLG1CQUFjLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7SUFROUQsQ0FBQztJQUVMLHdEQUF3QixHQUF4QjtRQUNFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFO1lBQ3RFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7WUFDekUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3JELFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVELG9EQUFvQixHQUFwQixVQUFxQixDQUFTO1FBQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsb0RBQW9CLEdBQXBCLFVBQXFCLENBQVM7UUFDNUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNyQjtRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxpREFBaUIsR0FBakIsVUFBa0IsTUFBYztRQUM5QixPQUFPLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsc0JBQUksd0NBQUs7YUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO2FBRUQsVUFBVSxHQUFXO1lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksMkNBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDO2FBRUQsVUFBYSxHQUFXO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksd0NBQUs7YUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO2FBRUQsVUFBVSxHQUFXO1lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksNENBQVM7YUFBYjtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO2FBRUQsVUFBYyxHQUFZO1lBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksOENBQVc7YUFBZjtZQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQixDQUFDO2FBRUQsVUFBZ0IsR0FBVztZQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUMxQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDhDQUFXO2FBQWY7WUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDM0IsQ0FBQzthQUVELFVBQWdCLEdBQVc7WUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7UUFDMUIsQ0FBQzs7O09BSkE7SUFNSCw0QkFBQztBQUFELENBQUMsQUEvRkQsSUErRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdG9yLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPTGlzdEl0ZW1Db21wb25lbnQgfSBmcm9tICcuLi9saXN0LWl0ZW0vby1saXN0LWl0ZW0uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQ0FSRF9SRU5ERVJFUiA9IFtcbiAgJ3RpdGxlJyxcbiAgJ3N1YnRpdGxlJyxcbiAgJ2ltYWdlJyxcbiAgJ3Nob3dJbWFnZTogc2hvdy1pbWFnZScsXG4gICdhY3Rpb24xVGV4dDogYWN0aW9uLTEtdGV4dCcsXG4gICdhY3Rpb24yVGV4dDogYWN0aW9uLTItdGV4dCdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19DQVJEX1JFTkRFUkVSID0gW1xuICAnb25BY3Rpb24xQ2xpY2s6IGFjdGlvbi0xJyxcbiAgJ29uQWN0aW9uMkNsaWNrOiBhY3Rpb24tMidcbl07XG5cbmV4cG9ydCBjbGFzcyBPTGlzdEl0ZW1DYXJkUmVuZGVyZXIge1xuXG4gIC8qIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIF90aXRsZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX3N1YnRpdGxlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfaW1hZ2U6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9zaG93SW1hZ2U6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgX2FjdGlvbjFUZXh0OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfYWN0aW9uMlRleHQ6IHN0cmluZztcblxuICBvbkFjdGlvbjFDbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgb25BY3Rpb24yQ2xpY2s6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIC8qIGVuZCBvZiBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgX2xpc3RJdGVtOiBPTGlzdEl0ZW1Db21wb25lbnRcbiAgKSB7IH1cblxuICBtb2RpZnlNYXRMaXN0SXRlbUVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCAmJiB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgY29uc3QgbWF0TGlzdEl0ZW0gPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgbWF0TGlzdEl0ZW0ucXVlcnlTZWxlY3RvcignLm1hdC1saXN0LXRleHQnKS5yZW1vdmUoKTtcbiAgICAgIG1hdExpc3RJdGVtLmNsYXNzTGlzdC5hZGQoJ28tY2FyZC1pdGVtJyk7XG4gICAgfVxuICB9XG5cbiAgb25BY3Rpb24xQnV0dG9uQ2xpY2soZT86IEV2ZW50KSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGUpKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICB0aGlzLm9uQWN0aW9uMUNsaWNrLmVtaXQoZSk7XG4gIH1cblxuICBvbkFjdGlvbjJCdXR0b25DbGljayhlPzogRXZlbnQpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZSkpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMub25BY3Rpb24yQ2xpY2suZW1pdChlKTtcbiAgfVxuXG4gIGNvbXBhcmVMaXN0SGVpZ2h0KGhlaWdodDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIChoZWlnaHQgPT09IHRoaXMuX2xpc3RJdGVtLl9saXN0LnJvd0hlaWdodCkgfHwgdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IHRpdGxlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RpdGxlO1xuICB9XG5cbiAgc2V0IHRpdGxlKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB2YWw7XG4gIH1cblxuICBnZXQgc3VidGl0bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3VidGl0bGU7XG4gIH1cblxuICBzZXQgc3VidGl0bGUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zdWJ0aXRsZSA9IHZhbDtcbiAgfVxuXG4gIGdldCBpbWFnZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pbWFnZTtcbiAgfVxuXG4gIHNldCBpbWFnZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlID0gdmFsO1xuICB9XG5cbiAgZ2V0IHNob3dJbWFnZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd0ltYWdlO1xuICB9XG5cbiAgc2V0IHNob3dJbWFnZSh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93SW1hZ2UgPSB2YWw7XG4gIH1cblxuICBnZXQgYWN0aW9uMVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYWN0aW9uMVRleHQ7XG4gIH1cblxuICBzZXQgYWN0aW9uMVRleHQodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9hY3Rpb24xVGV4dCA9IHZhbDtcbiAgfVxuXG4gIGdldCBhY3Rpb24yVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9hY3Rpb24yVGV4dDtcbiAgfVxuXG4gIHNldCBhY3Rpb24yVGV4dCh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2FjdGlvbjJUZXh0ID0gdmFsO1xuICB9XG5cbn1cbiJdfQ==