import { EventEmitter } from '@angular/core';
import { Util } from '../../../util/util';
export var DEFAULT_INPUTS_O_TEXT_RENDERER = [
    'title',
    'primaryText : primary-text',
    'secondaryText : secondary-text',
    'icon'
];
export var DEFAULT_OUTPUTS_O_TEXT_RENDERER = [
    'onIconClick : icon-action'
];
var OListItemTextRenderer = (function () {
    function OListItemTextRenderer(elRef, _renderer, _injector, _listItem) {
        this.elRef = elRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._listItem = _listItem;
        this.onIconClick = new EventEmitter();
    }
    OListItemTextRenderer.prototype.modifyMatListItemElement = function () {
        if (this.elRef.nativeElement && this.elRef.nativeElement.parentElement) {
            var listItem = this.elRef.nativeElement.parentElement.parentElement;
            if (listItem && listItem.nodeName === 'MAT-LIST-ITEM') {
                var linesNo = 3;
                if (this.title === undefined) {
                    linesNo--;
                }
                if (this.primaryText === undefined) {
                    linesNo--;
                }
                if (this.secondaryText === undefined) {
                    linesNo--;
                }
                listItem.classList.add('mat-' + linesNo + '-line');
                listItem.querySelector('.mat-list-text').remove();
            }
        }
    };
    OListItemTextRenderer.prototype.onActionIconClick = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this.onIconClick.emit(e);
    };
    Object.defineProperty(OListItemTextRenderer.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (val) {
            this._title = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemTextRenderer.prototype, "primaryText", {
        get: function () {
            return this._primaryText;
        },
        set: function (val) {
            this._primaryText = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemTextRenderer.prototype, "secondaryText", {
        get: function () {
            return this._secondaryText;
        },
        set: function (val) {
            this._secondaryText = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OListItemTextRenderer.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (val) {
            this._icon = val;
        },
        enumerable: true,
        configurable: true
    });
    return OListItemTextRenderer;
}());
export { OListItemTextRenderer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tdGV4dC1yZW5kZXJlci5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L3JlbmRlcmVycy9vLWxpc3QtaXRlbS10ZXh0LXJlbmRlcmVyLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxZQUFZLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBRTlFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQyxNQUFNLENBQUMsSUFBTSw4QkFBOEIsR0FBRztJQUM1QyxPQUFPO0lBQ1AsNEJBQTRCO0lBQzVCLGdDQUFnQztJQUNoQyxNQUFNO0NBQ1AsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLCtCQUErQixHQUFHO0lBQzdDLDJCQUEyQjtDQUM1QixDQUFDO0FBRUY7SUFVRSwrQkFDUyxLQUFpQixFQUNkLFNBQW9CLEVBQ3BCLFNBQW1CLEVBQ25CLFNBQTZCO1FBSGhDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDZCxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFDbkIsY0FBUyxHQUFULFNBQVMsQ0FBb0I7UUFOekMsZ0JBQVcsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztJQU8zRCxDQUFDO0lBRUwsd0RBQXdCLEdBQXhCO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUU7WUFDdEUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQztZQUN0RSxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxLQUFLLGVBQWUsRUFBRTtnQkFDckQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO29CQUM1QixPQUFPLEVBQUUsQ0FBQztpQkFDWDtnQkFDRCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO29CQUNsQyxPQUFPLEVBQUUsQ0FBQztpQkFDWDtnQkFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxFQUFFO29CQUNwQyxPQUFPLEVBQUUsQ0FBQztpQkFDWDtnQkFDRCxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDO2dCQUNuRCxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDbkQ7U0FDRjtJQUNILENBQUM7SUFFRCxpREFBaUIsR0FBakIsVUFBa0IsQ0FBUztRQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQ3JCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELHNCQUFJLHdDQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzthQUVELFVBQVUsR0FBVztZQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNwQixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLDhDQUFXO2FBQWY7WUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDM0IsQ0FBQzthQUVELFVBQWdCLEdBQVc7WUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7UUFDMUIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSxnREFBYTthQUFqQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixDQUFDO2FBRUQsVUFBa0IsR0FBVztZQUMzQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUM1QixDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLHVDQUFJO2FBQVI7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQUVELFVBQVMsR0FBVztZQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNuQixDQUFDOzs7T0FKQTtJQU1ILDRCQUFDO0FBQUQsQ0FBQyxBQTVFRCxJQTRFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9MaXN0SXRlbUNvbXBvbmVudCB9IGZyb20gJy4uL2xpc3QtaXRlbS9vLWxpc3QtaXRlbS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19URVhUX1JFTkRFUkVSID0gW1xuICAndGl0bGUnLFxuICAncHJpbWFyeVRleHQgOiBwcmltYXJ5LXRleHQnLFxuICAnc2Vjb25kYXJ5VGV4dCA6IHNlY29uZGFyeS10ZXh0JyxcbiAgJ2ljb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEVYVF9SRU5ERVJFUiA9IFtcbiAgJ29uSWNvbkNsaWNrIDogaWNvbi1hY3Rpb24nXG5dO1xuXG5leHBvcnQgY2xhc3MgT0xpc3RJdGVtVGV4dFJlbmRlcmVyIHtcblxuICAvKiBpbnB1dHMgdmFyaWFibGVzICovXG4gIHByb3RlY3RlZCBfdGl0bGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9wcmltYXJ5VGV4dDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX3NlY29uZGFyeVRleHQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9pY29uOiBzdHJpbmc7XG5cbiAgb25JY29uQ2xpY2s6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgX2xpc3RJdGVtOiBPTGlzdEl0ZW1Db21wb25lbnRcbiAgKSB7IH1cblxuICBtb2RpZnlNYXRMaXN0SXRlbUVsZW1lbnQoKSB7XG4gICAgaWYgKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCAmJiB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgY29uc3QgbGlzdEl0ZW0gPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgaWYgKGxpc3RJdGVtICYmIGxpc3RJdGVtLm5vZGVOYW1lID09PSAnTUFULUxJU1QtSVRFTScpIHtcbiAgICAgICAgbGV0IGxpbmVzTm8gPSAzO1xuICAgICAgICBpZiAodGhpcy50aXRsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGluZXNOby0tO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByaW1hcnlUZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsaW5lc05vLS07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kYXJ5VGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbGluZXNOby0tO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RJdGVtLmNsYXNzTGlzdC5hZGQoJ21hdC0nICsgbGluZXNObyArICctbGluZScpO1xuICAgICAgICBsaXN0SXRlbS5xdWVyeVNlbGVjdG9yKCcubWF0LWxpc3QtdGV4dCcpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQWN0aW9uSWNvbkNsaWNrKGU/OiBFdmVudCkge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlKSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgdGhpcy5vbkljb25DbGljay5lbWl0KGUpO1xuICB9XG5cbiAgZ2V0IHRpdGxlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3RpdGxlO1xuICB9XG5cbiAgc2V0IHRpdGxlKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUgPSB2YWw7XG4gIH1cblxuICBnZXQgcHJpbWFyeVRleHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcHJpbWFyeVRleHQ7XG4gIH1cblxuICBzZXQgcHJpbWFyeVRleHQodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9wcmltYXJ5VGV4dCA9IHZhbDtcbiAgfVxuXG4gIGdldCBzZWNvbmRhcnlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3NlY29uZGFyeVRleHQ7XG4gIH1cblxuICBzZXQgc2Vjb25kYXJ5VGV4dCh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX3NlY29uZGFyeVRleHQgPSB2YWw7XG4gIH1cblxuICBnZXQgaWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pY29uO1xuICB9XG5cbiAgc2V0IGljb24odmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pY29uID0gdmFsO1xuICB9XG5cbn1cbiJdfQ==