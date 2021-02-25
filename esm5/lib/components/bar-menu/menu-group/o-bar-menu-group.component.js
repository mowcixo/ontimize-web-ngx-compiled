import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';
export var DEFAULT_INPUTS_O_BAR_MENU_GROUP = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_MENU_ITEM);
var OBarMenuGroupComponent = (function (_super) {
    tslib_1.__extends(OBarMenuGroupComponent, _super);
    function OBarMenuGroupComponent(menu, elRef, injector) {
        var _this = _super.call(this, menu, elRef, injector) || this;
        _this.menu = menu;
        _this.elRef = elRef;
        _this.injector = injector;
        _this.id = 'm_' + String((new Date()).getTime() + Math.random());
        return _this;
    }
    OBarMenuGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-bar-menu-group',
                    template: "<div class=\"fake-li\" [class.fake-li-hover]=\"isHovered\">\n  <label [attr.for]=\"id\" class=\"toggle mat-list-item\">\n    <mat-icon class=\"o-bar-menu-group-icon mat-24\">{{ icon }}</mat-icon>\n    {{ title | oTranslate }}\n    <mat-icon class=\"o-bar-menu-group-icon-arrow\" *ngIf=\"!checkbox.checked\">chevron_right</mat-icon>\n    <mat-icon class=\"o-bar-menu-group-icon-arrow\" *ngIf=\"checkbox.checked\">expand_more</mat-icon>\n  </label>\n  <a class=\"o-bar-menu-group-title\">\n    <mat-icon class=\"o-bar-menu-group-icon mat-24\">{{ icon }}</mat-icon> {{ title | oTranslate }}\n    <mat-icon class=\"o-bar-menu-group-icon-arrow\">chevron_right</mat-icon>\n  </a>\n  <input [attr.id]=\"id\" type=\"checkbox\" #checkbox />\n  <div *ngIf=\"!disabled\" class=\"fake-ul mat-primary mat-elevation-z4\">\n    <ng-content></ng-content>\n  </div>\n</div>",
                    inputs: DEFAULT_INPUTS_O_BAR_MENU_GROUP,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-bar-menu-group]': 'true',
                        '[attr.disabled]': 'disabled'
                    },
                    styles: [".o-bar-menu-group[disabled=true] .fake-li{opacity:.5}.o-bar-menu-group[disabled=true] .fake-li a.o-bar-menu-group-title{cursor:default}.o-bar-menu-group .fake-li .o-bar-menu-group-icon,.o-bar-menu-group .fake-ul .o-bar-menu-group-icon{display:inline-block;margin:0 10px 0 0}.o-bar-menu-group .fake-li .o-bar-menu-group-icon~.o-bar-menu-group-title,.o-bar-menu-group .fake-ul .o-bar-menu-group-icon~.o-bar-menu-group-title{padding-left:0}.o-bar-menu-group .fake-li .o-bar-menu-group-icon-arrow,.o-bar-menu-group .fake-ul .o-bar-menu-group-icon-arrow{margin-left:auto}"]
                }] }
    ];
    OBarMenuGroupComponent.ctorParameters = function () { return [
        { type: OBarMenuComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OBarMenuComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OBarMenuGroupComponent;
}(OBaseMenuItemClass));
export { OBarMenuGroupComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS1ncm91cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvbWVudS1ncm91cC9vLWJhci1tZW51LWdyb3VwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFFLCtCQUErQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFaEcsTUFBTSxDQUFDLElBQU0sK0JBQStCLG9CQUN2QywrQkFBK0IsQ0FDbkMsQ0FBQztBQUVGO0lBVzRDLGtEQUFrQjtJQUk1RCxnQ0FDeUQsSUFBdUIsRUFDcEUsS0FBaUIsRUFDakIsUUFBa0I7UUFIOUIsWUFLRSxrQkFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUU3QjtRQU53RCxVQUFJLEdBQUosSUFBSSxDQUFtQjtRQUNwRSxXQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFHNUIsS0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDOztJQUNsRSxDQUFDOztnQkF0QkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLG8yQkFBZ0Q7b0JBRWhELE1BQU0sRUFBRSwrQkFBK0I7b0JBQ3ZDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osMEJBQTBCLEVBQUUsTUFBTTt3QkFDbEMsaUJBQWlCLEVBQUUsVUFBVTtxQkFDOUI7O2lCQUNGOzs7Z0JBakJRLGlCQUFpQix1QkF1QnJCLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGlCQUFpQixFQUFqQixDQUFpQixDQUFDO2dCQXpCM0IsVUFBVTtnQkFBc0IsUUFBUTs7SUFnQzVELDZCQUFDO0NBQUEsQUF2QkQsQ0FXNEMsa0JBQWtCLEdBWTdEO1NBWlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPQmFyTWVudUNvbXBvbmVudCB9IGZyb20gJy4uL28tYmFyLW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQkFTRV9NRU5VX0lURU0sIE9CYXNlTWVudUl0ZW1DbGFzcyB9IGZyb20gJy4uL28tYmFzZS1tZW51LWl0ZW0uY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19CQVJfTUVOVV9HUk9VUCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19CQVNFX01FTlVfSVRFTVxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1iYXItbWVudS1ncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWJhci1tZW51LWdyb3VwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1iYXItbWVudS1ncm91cC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQkFSX01FTlVfR1JPVVAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYmFyLW1lbnUtZ3JvdXBdJzogJ3RydWUnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Jhck1lbnVHcm91cENvbXBvbmVudCBleHRlbmRzIE9CYXNlTWVudUl0ZW1DbGFzcyB7XG5cbiAgaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Jhck1lbnVDb21wb25lbnQpKSBwcm90ZWN0ZWQgbWVudTogT0Jhck1lbnVDb21wb25lbnQsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIobWVudSwgZWxSZWYsIGluamVjdG9yKTtcbiAgICB0aGlzLmlkID0gJ21fJyArIFN0cmluZygobmV3IERhdGUoKSkuZ2V0VGltZSgpICsgTWF0aC5yYW5kb20oKSk7XG4gIH1cbn1cbiJdfQ==