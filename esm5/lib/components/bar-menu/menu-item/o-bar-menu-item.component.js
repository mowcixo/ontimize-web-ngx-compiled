import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Util } from '../../../util/util';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';
export var DEFAULT_INPUTS_O_BAR_MENU_ITEM = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_MENU_ITEM, [
    'route',
    'action'
]);
var OBarMenuItemComponent = (function (_super) {
    tslib_1.__extends(OBarMenuItemComponent, _super);
    function OBarMenuItemComponent(menu, elRef, injector) {
        var _this = _super.call(this, menu, elRef, injector) || this;
        _this.menu = menu;
        _this.elRef = elRef;
        _this.injector = injector;
        _this.router = _this.injector.get(Router);
        return _this;
    }
    OBarMenuItemComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    OBarMenuItemComponent.prototype.collapseMenu = function (evt) {
        if (this.menu) {
            this.menu.collapseAll();
        }
    };
    OBarMenuItemComponent.prototype.onClick = function () {
        if (this.disabled) {
            return;
        }
        if (Util.isDefined(this.route)) {
            this.router.navigate([this.route]);
        }
        else if (Util.isDefined(this.action)) {
            this.action();
        }
    };
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
    OBarMenuItemComponent.ctorParameters = function () { return [
        { type: OBarMenuComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OBarMenuComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OBarMenuItemComponent;
}(OBaseMenuItemClass));
export { OBarMenuItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS1pdGVtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9iYXItbWVudS9tZW51LWl0ZW0vby1iYXItbWVudS1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0csT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVoRyxNQUFNLENBQUMsSUFBTSw4QkFBOEIsb0JBQ3RDLCtCQUErQjtJQUVsQyxPQUFPO0lBR1AsUUFBUTtFQUNULENBQUM7QUFFRjtJQVcyQyxpREFBa0I7SUFNM0QsK0JBQ3lELElBQXVCLEVBQ3BFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSDlCLFlBS0Usa0JBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FFN0I7UUFOd0QsVUFBSSxHQUFKLElBQUksQ0FBbUI7UUFDcEUsV0FBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixjQUFRLEdBQVIsUUFBUSxDQUFVO1FBRzVCLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0lBQzFDLENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBTUUsaUJBQU0sUUFBUSxXQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELDRDQUFZLEdBQVosVUFBYSxHQUFVO1FBQ3JCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsdUNBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDcEM7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQzs7Z0JBbERGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQiw2bUJBQStDO29CQUUvQyxNQUFNLEVBQUUsOEJBQThCO29CQUN0QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLHlCQUF5QixFQUFFLE1BQU07d0JBQ2pDLGlCQUFpQixFQUFFLFVBQVU7cUJBQzlCOztpQkFDRjs7O2dCQXRCUSxpQkFBaUIsdUJBOEJyQixNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxpQkFBaUIsRUFBakIsQ0FBaUIsQ0FBQztnQkFsQzNCLFVBQVU7Z0JBQXNCLFFBQVE7O0lBbUU1RCw0QkFBQztDQUFBLEFBbkRELENBVzJDLGtCQUFrQixHQXdDNUQ7U0F4Q1kscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9CYXJNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vby1iYXItbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX01FTlVfSVRFTSwgT0Jhc2VNZW51SXRlbUNsYXNzIH0gZnJvbSAnLi4vby1iYXNlLW1lbnUtaXRlbS5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JBUl9NRU5VX0lURU0gPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9NRU5VX0lURU0sXG4gIC8vIHJvdXRlIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzdGF0ZSB0byBuYXZpZ2F0ZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdyb3V0ZScsXG5cbiAgLy8gYWN0aW9uIFtmdW5jdGlvbl06IGZ1bmN0aW9uIHRvIGV4ZWN1dGUuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnYWN0aW9uJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1iYXItbWVudS1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQkFSX01FTlVfSVRFTSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1iYXItbWVudS1pdGVtXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9CYXJNZW51SXRlbUNvbXBvbmVudCBleHRlbmRzIE9CYXNlTWVudUl0ZW1DbGFzcyBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICByb3V0ZTogc3RyaW5nO1xuICBhY3Rpb246ICgpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9CYXJNZW51Q29tcG9uZW50KSkgcHJvdGVjdGVkIG1lbnU6IE9CYXJNZW51Q29tcG9uZW50LFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKG1lbnUsIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gaWYgKHR5cGVvZiAodGhpcy5yb3V0ZSkgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gICAvLyBUT0RPLCBwZXJtaXNvcyBwb3Igcm91dGU/XG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIHRoaXMucmVzdHJpY3RlZCA9IGZhbHNlO1xuICAgIC8vIH1cbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICB9XG5cbiAgY29sbGFwc2VNZW51KGV2dDogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tZW51KSB7XG4gICAgICB0aGlzLm1lbnUuY29sbGFwc2VBbGwoKTtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnJvdXRlKSkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGVdKTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuYWN0aW9uKSkge1xuICAgICAgdGhpcy5hY3Rpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==