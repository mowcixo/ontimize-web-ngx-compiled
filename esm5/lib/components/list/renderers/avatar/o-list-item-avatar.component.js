import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_TEXT_RENDERER, DEFAULT_OUTPUTS_O_TEXT_RENDERER, OListItemTextRenderer, } from '../o-list-item-text-renderer.class';
export var DEFAULT_INPUTS_O_LIST_ITEM_AVATAR = tslib_1.__spread(DEFAULT_INPUTS_O_TEXT_RENDERER, [
    'avatar',
    'emptyAvatar: empty-avatar',
    'avatarType: avatar-type'
]);
export var DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_RENDERER);
var OListItemAvatarComponent = (function (_super) {
    tslib_1.__extends(OListItemAvatarComponent, _super);
    function OListItemAvatarComponent(elRef, _renderer, _injector, _listItem, sanitizer) {
        var _this = _super.call(this, elRef, _renderer, _injector, _listItem) || this;
        _this._listItem = _listItem;
        _this.sanitizer = sanitizer;
        return _this;
    }
    OListItemAvatarComponent.prototype.ngAfterViewInit = function () {
        this.modifyMatListItemElement();
    };
    OListItemAvatarComponent.prototype.ngOnInit = function () {
        var avatarValue = this.avatar;
        if (!this.avatar) {
            avatarValue = this.emptyAvatar;
        }
        else {
            switch (this.avatarType) {
                case 'base64':
                    avatarValue = ('data:image/png;base64,' + ((typeof (avatarValue.bytes) !== 'undefined') ? avatarValue.bytes : avatarValue));
                    break;
                case 'url':
                default:
                    avatarValue = this.avatar;
                    break;
            }
        }
        this.avatarSrc = this.sanitizer.bypassSecurityTrustResourceUrl(avatarValue);
    };
    Object.defineProperty(OListItemAvatarComponent.prototype, "avatarSrc", {
        get: function () {
            return this._avatarSrc;
        },
        set: function (val) {
            this._avatarSrc = val;
        },
        enumerable: true,
        configurable: true
    });
    OListItemAvatarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-list-item-avatar',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <img matListAvatar class=\"avatar\" [src]=\"avatarSrc\" [alt]=\"title\">\n  <div class=\"mat-list-text\">\n    <h3 matLine class=\"primary-text\"> {{ title }} </h3>\n    <h4 *ngIf=\"primaryText !== undefined\" matLine class=\"primary-text\">{{ primaryText }}</h4>\n    <p *ngIf=\"secondaryText !== undefined\" matLine class=\"secondary-text\">{{ secondaryText }}</p>\n  </div>\n  <mat-icon *ngIf=\"icon !== undefined\" class=\"material-icons o-list-item-icon\" (click)=\"onActionIconClick($event)\">{{ icon\n    }}\n  </mat-icon>\n</div>\n",
                    inputs: DEFAULT_INPUTS_O_LIST_ITEM_AVATAR,
                    outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-custom-list-item]': 'true',
                        '[class.o-list-item-avatar]': 'true'
                    },
                    styles: [".o-list-row-action+.o-list-item-avatar{padding:0 0 0 10px}.mat-list.selectable .o-list-item-avatar .mat-list-text{padding-right:0}.mat-list .mat-list-item .mat-list-item-content .o-list-item-avatar.o-custom-list-item .mat-list-text,.mat-nav-list .mat-list-item .mat-list-item-content .o-list-item-avatar.o-custom-list-item .mat-list-text{padding:0 16px}"]
                }] }
    ];
    OListItemAvatarComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector },
        { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OListItemComponent; }),] }] },
        { type: DomSanitizer }
    ]; };
    return OListItemAvatarComponent;
}(OListItemTextRenderer));
export { OListItemAvatarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L3JlbmRlcmVycy9hdmF0YXIvby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBRVIsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBbUIsTUFBTSwyQkFBMkIsQ0FBQztBQUUxRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsOEJBQThCLEVBQzlCLCtCQUErQixFQUMvQixxQkFBcUIsR0FDdEIsTUFBTSxvQ0FBb0MsQ0FBQztBQUU1QyxNQUFNLENBQUMsSUFBTSxpQ0FBaUMsb0JBQ3pDLDhCQUE4QjtJQUNqQyxRQUFRO0lBQ1IsMkJBQTJCO0lBRTNCLHlCQUF5QjtFQUMxQixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sa0NBQWtDLG9CQUMxQywrQkFBK0IsQ0FDbkMsQ0FBQztBQUVGO0lBWThDLG9EQUFxQjtJQU9qRSxrQ0FDRSxLQUFpQixFQUNqQixTQUFvQixFQUNwQixTQUFtQixFQUNpRCxTQUE2QixFQUMxRixTQUF1QjtRQUxoQyxZQU9FLGtCQUFNLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUM5QztRQUpxRSxlQUFTLEdBQVQsU0FBUyxDQUFvQjtRQUMxRixlQUFTLEdBQVQsU0FBUyxDQUFjOztJQUdoQyxDQUFDO0lBRUQsa0RBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCwyQ0FBUSxHQUFSO1FBQ0UsSUFBSSxXQUFXLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNoQzthQUFNO1lBQ0wsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUN2QixLQUFLLFFBQVE7b0JBQ1gsV0FBVyxHQUFHLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzVILE1BQU07Z0JBQ1IsS0FBSyxLQUFLLENBQUM7Z0JBQ1g7b0JBQ0UsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7b0JBQzFCLE1BQU07YUFDVDtTQUNGO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxzQkFBSSwrQ0FBUzthQUFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7YUFFRCxVQUFjLEdBQW9CO1lBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLENBQUM7OztPQUpBOztnQkFyREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLGltQkFBa0Q7b0JBRWxELE1BQU0sRUFBRSxpQ0FBaUM7b0JBQ3pDLE9BQU8sRUFBRSxrQ0FBa0M7b0JBQzNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osNEJBQTRCLEVBQUUsTUFBTTt3QkFDcEMsNEJBQTRCLEVBQUUsTUFBTTtxQkFDckM7O2lCQUNGOzs7Z0JBekNDLFVBQVU7Z0JBTVYsU0FBUztnQkFIVCxRQUFRO2dCQVFELGtCQUFrQix1QkEwQ3RCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxrQkFBa0IsRUFBbEIsQ0FBa0IsQ0FBQztnQkE1Q25ELFlBQVk7O0lBZ0ZyQiwrQkFBQztDQUFBLEFBM0RELENBWThDLHFCQUFxQixHQStDbEU7U0EvQ1ksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZVJlc291cmNlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IE9MaXN0SXRlbUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2xpc3QtaXRlbS9vLWxpc3QtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19URVhUX1JFTkRFUkVSLFxuICBERUZBVUxUX09VVFBVVFNfT19URVhUX1JFTkRFUkVSLFxuICBPTGlzdEl0ZW1UZXh0UmVuZGVyZXIsXG59IGZyb20gJy4uL28tbGlzdC1pdGVtLXRleHQtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MSVNUX0lURU1fQVZBVEFSID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RFWFRfUkVOREVSRVIsXG4gICdhdmF0YXInLFxuICAnZW1wdHlBdmF0YXI6IGVtcHR5LWF2YXRhcicsXG4gIC8vIGF2YXRhci10eXBlIFtiYXNlNjR8dXJsXTogYXZhdGFyIHR5cGUgKGV4dGVybiB1cmwgb3IgYmFzZTY0KS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdhdmF0YXJUeXBlOiBhdmF0YXItdHlwZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19MSVNUX0lURU1fQVZBVEFSID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19URVhUX1JFTkRFUkVSXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtaXRlbS1hdmF0YXInLFxuICB0ZW1wbGF0ZVVybDogJy4vby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19MSVNUX0lURU1fQVZBVEFSLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19MSVNUX0lURU1fQVZBVEFSLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWN1c3RvbS1saXN0LWl0ZW1dJzogJ3RydWUnLFxuICAgICdbY2xhc3Muby1saXN0LWl0ZW0tYXZhdGFyXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0SXRlbUF2YXRhckNvbXBvbmVudCBleHRlbmRzIE9MaXN0SXRlbVRleHRSZW5kZXJlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIGF2YXRhcjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgYXZhdGFyVHlwZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW1wdHlBdmF0YXI6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9hdmF0YXJTcmM6IFNhZmVSZXNvdXJjZVVybDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPTGlzdEl0ZW1Db21wb25lbnQpKSBwcm90ZWN0ZWQgX2xpc3RJdGVtOiBPTGlzdEl0ZW1Db21wb25lbnQsXG4gICAgcHVibGljIHNhbml0aXplcjogRG9tU2FuaXRpemVyXG4gICkge1xuICAgIHN1cGVyKGVsUmVmLCBfcmVuZGVyZXIsIF9pbmplY3RvciwgX2xpc3RJdGVtKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLm1vZGlmeU1hdExpc3RJdGVtRWxlbWVudCgpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgbGV0IGF2YXRhclZhbHVlOiBhbnkgPSB0aGlzLmF2YXRhcjtcbiAgICBpZiAoIXRoaXMuYXZhdGFyKSB7XG4gICAgICBhdmF0YXJWYWx1ZSA9IHRoaXMuZW1wdHlBdmF0YXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAodGhpcy5hdmF0YXJUeXBlKSB7XG4gICAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgICAgYXZhdGFyVmFsdWUgPSAoJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnICsgKCh0eXBlb2YgKGF2YXRhclZhbHVlLmJ5dGVzKSAhPT0gJ3VuZGVmaW5lZCcpID8gYXZhdGFyVmFsdWUuYnl0ZXMgOiBhdmF0YXJWYWx1ZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd1cmwnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGF2YXRhclZhbHVlID0gdGhpcy5hdmF0YXI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYXZhdGFyU3JjID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKGF2YXRhclZhbHVlKTtcbiAgfVxuXG4gIGdldCBhdmF0YXJTcmMoKTogU2FmZVJlc291cmNlVXJsIHtcbiAgICByZXR1cm4gdGhpcy5fYXZhdGFyU3JjO1xuICB9XG5cbiAgc2V0IGF2YXRhclNyYyh2YWw6IFNhZmVSZXNvdXJjZVVybCkge1xuICAgIHRoaXMuX2F2YXRhclNyYyA9IHZhbDtcbiAgfVxuXG59XG4iXX0=