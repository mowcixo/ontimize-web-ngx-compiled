import { Component, ElementRef, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_TEXT_RENDERER, DEFAULT_OUTPUTS_O_TEXT_RENDERER, OListItemTextRenderer, } from '../o-list-item-text-renderer.class';
export const DEFAULT_INPUTS_O_LIST_ITEM_AVATAR = [
    ...DEFAULT_INPUTS_O_TEXT_RENDERER,
    'avatar',
    'emptyAvatar: empty-avatar',
    'avatarType: avatar-type'
];
export const DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR = [
    ...DEFAULT_OUTPUTS_O_TEXT_RENDERER
];
export class OListItemAvatarComponent extends OListItemTextRenderer {
    constructor(elRef, _renderer, _injector, _listItem, sanitizer) {
        super(elRef, _renderer, _injector, _listItem);
        this._listItem = _listItem;
        this.sanitizer = sanitizer;
    }
    ngAfterViewInit() {
        this.modifyMatListItemElement();
    }
    ngOnInit() {
        let avatarValue = this.avatar;
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
    }
    get avatarSrc() {
        return this._avatarSrc;
    }
    set avatarSrc(val) {
        this._avatarSrc = val;
    }
}
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
OListItemAvatarComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OListItemComponent),] }] },
    { type: DomSanitizer }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L3JlbmRlcmVycy9hdmF0YXIvby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFFUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFtQixNQUFNLDJCQUEyQixDQUFDO0FBRTFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQzNFLE9BQU8sRUFDTCw4QkFBOEIsRUFDOUIsK0JBQStCLEVBQy9CLHFCQUFxQixHQUN0QixNQUFNLG9DQUFvQyxDQUFDO0FBRTVDLE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHO0lBQy9DLEdBQUcsOEJBQThCO0lBQ2pDLFFBQVE7SUFDUiwyQkFBMkI7SUFFM0IseUJBQXlCO0NBQzFCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxrQ0FBa0MsR0FBRztJQUNoRCxHQUFHLCtCQUErQjtDQUNuQyxDQUFDO0FBY0YsTUFBTSxPQUFPLHdCQUF5QixTQUFRLHFCQUFxQjtJQU9qRSxZQUNFLEtBQWlCLEVBQ2pCLFNBQW9CLEVBQ3BCLFNBQW1CLEVBQ2lELFNBQTZCLEVBQzFGLFNBQXVCO1FBRTlCLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUhzQixjQUFTLEdBQVQsU0FBUyxDQUFvQjtRQUMxRixjQUFTLEdBQVQsU0FBUyxDQUFjO0lBR2hDLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLFdBQVcsR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ2hDO2FBQU07WUFDTCxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3ZCLEtBQUssUUFBUTtvQkFDWCxXQUFXLEdBQUcsQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDNUgsTUFBTTtnQkFDUixLQUFLLEtBQUssQ0FBQztnQkFDWDtvQkFDRSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDMUIsTUFBTTthQUNUO1NBQ0Y7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxTQUFTLENBQUMsR0FBb0I7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDeEIsQ0FBQzs7O1lBekRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixpbUJBQWtEO2dCQUVsRCxNQUFNLEVBQUUsaUNBQWlDO2dCQUN6QyxPQUFPLEVBQUUsa0NBQWtDO2dCQUMzQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLDRCQUE0QixFQUFFLE1BQU07b0JBQ3BDLDRCQUE0QixFQUFFLE1BQU07aUJBQ3JDOzthQUNGOzs7WUF6Q0MsVUFBVTtZQU1WLFNBQVM7WUFIVCxRQUFRO1lBUUQsa0JBQWtCLHVCQTBDdEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7WUE1Q25ELFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFJlbmRlcmVyMixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlUmVzb3VyY2VVcmwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgT0xpc3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vbGlzdC1pdGVtL28tbGlzdC1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RFWFRfUkVOREVSRVIsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RFWFRfUkVOREVSRVIsXG4gIE9MaXN0SXRlbVRleHRSZW5kZXJlcixcbn0gZnJvbSAnLi4vby1saXN0LWl0ZW0tdGV4dC1yZW5kZXJlci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0xJU1RfSVRFTV9BVkFUQVIgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEVYVF9SRU5ERVJFUixcbiAgJ2F2YXRhcicsXG4gICdlbXB0eUF2YXRhcjogZW1wdHktYXZhdGFyJyxcbiAgLy8gYXZhdGFyLXR5cGUgW2Jhc2U2NHx1cmxdOiBhdmF0YXIgdHlwZSAoZXh0ZXJuIHVybCBvciBiYXNlNjQpLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2F2YXRhclR5cGU6IGF2YXRhci10eXBlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfSVRFTV9BVkFUQVIgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfUkVOREVSRVJcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbGlzdC1pdGVtLWF2YXRhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxpc3QtaXRlbS1hdmF0YXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWxpc3QtaXRlbS1hdmF0YXIuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xJU1RfSVRFTV9BVkFUQVIsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfSVRFTV9BVkFUQVIsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY3VzdG9tLWxpc3QtaXRlbV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLWxpc3QtaXRlbS1hdmF0YXJdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RJdGVtQXZhdGFyQ29tcG9uZW50IGV4dGVuZHMgT0xpc3RJdGVtVGV4dFJlbmRlcmVyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcblxuICBwcm90ZWN0ZWQgYXZhdGFyOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhdmF0YXJUeXBlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBlbXB0eUF2YXRhcjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2F2YXRhclNyYzogU2FmZVJlc291cmNlVXJsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9MaXN0SXRlbUNvbXBvbmVudCkpIHByb3RlY3RlZCBfbGlzdEl0ZW06IE9MaXN0SXRlbUNvbXBvbmVudCxcbiAgICBwdWJsaWMgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXJcbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIF9yZW5kZXJlciwgX2luamVjdG9yLCBfbGlzdEl0ZW0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMubW9kaWZ5TWF0TGlzdEl0ZW1FbGVtZW50KCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBsZXQgYXZhdGFyVmFsdWU6IGFueSA9IHRoaXMuYXZhdGFyO1xuICAgIGlmICghdGhpcy5hdmF0YXIpIHtcbiAgICAgIGF2YXRhclZhbHVlID0gdGhpcy5lbXB0eUF2YXRhcjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoICh0aGlzLmF2YXRhclR5cGUpIHtcbiAgICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgICBhdmF0YXJWYWx1ZSA9ICgnZGF0YTppbWFnZS9wbmc7YmFzZTY0LCcgKyAoKHR5cGVvZiAoYXZhdGFyVmFsdWUuYnl0ZXMpICE9PSAndW5kZWZpbmVkJykgPyBhdmF0YXJWYWx1ZS5ieXRlcyA6IGF2YXRhclZhbHVlKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYXZhdGFyVmFsdWUgPSB0aGlzLmF2YXRhcjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hdmF0YXJTcmMgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwoYXZhdGFyVmFsdWUpO1xuICB9XG5cbiAgZ2V0IGF2YXRhclNyYygpOiBTYWZlUmVzb3VyY2VVcmwge1xuICAgIHJldHVybiB0aGlzLl9hdmF0YXJTcmM7XG4gIH1cblxuICBzZXQgYXZhdGFyU3JjKHZhbDogU2FmZVJlc291cmNlVXJsKSB7XG4gICAgdGhpcy5fYXZhdGFyU3JjID0gdmFsO1xuICB9XG5cbn1cbiJdfQ==