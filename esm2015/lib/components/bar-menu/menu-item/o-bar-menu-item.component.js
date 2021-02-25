import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from '../../../util/util';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';
export const DEFAULT_INPUTS_O_BAR_MENU_ITEM = [
    ...DEFAULT_INPUTS_O_BASE_MENU_ITEM,
    'route',
    'action'
];
export class OBarMenuItemComponent extends OBaseMenuItemClass {
    constructor(menu, elRef, injector) {
        super(menu, elRef, injector);
        this.menu = menu;
        this.elRef = elRef;
        this.injector = injector;
        this.router = this.injector.get(Router);
    }
    ngOnInit() {
        super.ngOnInit();
    }
    collapseMenu(evt) {
        if (this.menu) {
            this.menu.collapseAll();
        }
    }
    onClick() {
        if (this.disabled) {
            return;
        }
        if (Util.isDefined(this.route)) {
            this.router.navigate([this.route]);
        }
        else if (Util.isDefined(this.action)) {
            this.action();
        }
    }
}
OBarMenuItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-bar-menu-item',
                template: "<div class=\"fake-li mat-primary\" *ngIf=\"!restricted\" (click)=\"collapseMenu($event)\" [class.fake-li-hover]=\"isHovered\">\n  <a *ngIf=\"action || route\" class=\"mat-list-item\" (click)=\"onClick()\">\n    <mat-icon class=\"o-bar-menu-item-icon mat-24\">{{ icon }}</mat-icon>\n    <div class=\"o-bar-menu-item-title\">{{ title | oTranslate }}</div>\n  </a>\n  <div *ngIf=\"!route && !action\" class=\"o-bar-menu-item-text mat-list-item\">\n    <mat-icon class=\"o-bar-menu-item-icon mat-24\">{{ icon }}</mat-icon>\n    <div class=\"o-bar-menu-item-title\">{{ title | oTranslate }}</div>\n  </div>\n</div>",
                inputs: DEFAULT_INPUTS_O_BAR_MENU_ITEM,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-bar-menu-item]': 'true',
                    '[attr.disabled]': 'disabled'
                },
                styles: [".o-bar-menu-item[disabled=true] .fake-li{opacity:.5}.o-bar-menu-item[disabled=true] .fake-li a.mat-list-item{cursor:default}.o-bar-menu-item .o-bar-menu-item-text{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;font-size:16px;height:48px;padding:0 16px}.o-bar-menu-item .o-bar-menu-item-icon{display:inline-block;margin:6px 10px 0 0}.o-bar-menu-item .o-bar-menu-item-icon~.o-bar-menu-item-title{padding-left:0}.o-bar-menu-item .o-bar-menu-item-title{display:inline-block;position:relative;top:3px;padding-left:40px}"]
            }] }
];
OBarMenuItemComponent.ctorParameters = () => [
    { type: OBarMenuComponent, decorators: [{ type: Inject, args: [forwardRef(() => OBarMenuComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9iYXItbWVudS9tZW51LWl0ZW0vby1iYXItbWVudS1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMvRyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRWhHLE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHO0lBQzVDLEdBQUcsK0JBQStCO0lBRWxDLE9BQU87SUFHUCxRQUFRO0NBQ1QsQ0FBQztBQWFGLE1BQU0sT0FBTyxxQkFBc0IsU0FBUSxrQkFBa0I7SUFNM0QsWUFDeUQsSUFBdUIsRUFDcEUsS0FBaUIsRUFDakIsUUFBa0I7UUFFNUIsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFKMEIsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFDcEUsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELFFBQVE7UUFNTixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFVO1FBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDcEM7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQzs7O1lBbERGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQiw2bUJBQStDO2dCQUUvQyxNQUFNLEVBQUUsOEJBQThCO2dCQUN0QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLHlCQUF5QixFQUFFLE1BQU07b0JBQ2pDLGlCQUFpQixFQUFFLFVBQVU7aUJBQzlCOzthQUNGOzs7WUF0QlEsaUJBQWlCLHVCQThCckIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztZQWxDM0IsVUFBVTtZQUFzQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9CYXJNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vby1iYXItbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX01FTlVfSVRFTSwgT0Jhc2VNZW51SXRlbUNsYXNzIH0gZnJvbSAnLi4vby1iYXNlLW1lbnUtaXRlbS5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JBUl9NRU5VX0lURU0gPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9NRU5VX0lURU0sXG4gIC8vIHJvdXRlIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzdGF0ZSB0byBuYXZpZ2F0ZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdyb3V0ZScsXG5cbiAgLy8gYWN0aW9uIFtmdW5jdGlvbl06IGZ1bmN0aW9uIHRvIGV4ZWN1dGUuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnYWN0aW9uJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1iYXItbWVudS1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQkFSX01FTlVfSVRFTSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1iYXItbWVudS1pdGVtXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9CYXJNZW51SXRlbUNvbXBvbmVudCBleHRlbmRzIE9CYXNlTWVudUl0ZW1DbGFzcyBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICByb3V0ZTogc3RyaW5nO1xuICBhY3Rpb246ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9CYXJNZW51Q29tcG9uZW50KSkgcHJvdGVjdGVkIG1lbnU6IE9CYXJNZW51Q29tcG9uZW50LFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKG1lbnUsIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gaWYgKHR5cGVvZiAodGhpcy5yb3V0ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gICAvLyBUT0RPLCBwZXJtaXNvcyBwb3Igcm91dGU/XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHRoaXMucmVzdHJpY3RlZCA9IGZhbHNlO1xuICAgIC8vIH1cbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICB9XG5cbiAgY29sbGFwc2VNZW51KGV2dDogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tZW51KSB7XG4gICAgICB0aGlzLm1lbnUuY29sbGFwc2VBbGwoKTtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnJvdXRlKSkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGVdKTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuYWN0aW9uKSkge1xuICAgICAgdGhpcy5hY3Rpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==