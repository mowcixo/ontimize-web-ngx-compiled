import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';
export var DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_MENU_ITEM, [
    'locale'
]);
var OLocaleBarMenuItemComponent = (function (_super) {
    tslib_1.__extends(OLocaleBarMenuItemComponent, _super);
    function OLocaleBarMenuItemComponent(menu, elRef, injector) {
        var _this = _super.call(this, menu, elRef, injector) || this;
        _this.menu = menu;
        _this.elRef = elRef;
        _this.injector = injector;
        return _this;
    }
    OLocaleBarMenuItemComponent.prototype.configureI18n = function () {
        if (this.isConfiguredLang()) {
            return;
        }
        if (this.translateService) {
            this.translateService.use(this.locale);
        }
        if (this.menu) {
            this.menu.collapseAll();
        }
    };
    OLocaleBarMenuItemComponent.prototype.isConfiguredLang = function () {
        if (this.translateService) {
            return (this.translateService.getCurrentLang() === this.locale);
        }
        return false;
    };
    OLocaleBarMenuItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-locale-bar-menu-item',
                    template: "<div class=\"fake-li mat-primary \" [class.fake-li-hover]=\"isHovered\" [class.is-selected]=\"isConfiguredLang()\">\n  <a fxLayout=\"row\" fxLayoutAlign=\"space-between center\" (click)=\"configureI18n()\" class=\"mat-list-item\">\n    <mat-icon *ngIf=\"icon !== undefined\" class=\"o-bar-menu-item-icon mat-24\">{{ icon }}</mat-icon>\n    <div fxFlex matLine class=\"o-bar-menu-item-title\">{{ title | oTranslate }}</div>\n    <mat-icon *ngIf=\"isConfiguredLang()\" class=\"o-bar-menu-item-icon configured-lang mat-24\" svgIcon=\"ontimize:check_circle\"></mat-icon>\n  </a>\n</div>",
                    inputs: DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-locale-bar-menu-item]': 'true'
                    },
                    styles: [".o-bar-menu-item-icon.configured-lang{flex:0 1 auto;line-height:24px}"]
                }] }
    ];
    OLocaleBarMenuItemComponent.ctorParameters = function () { return [
        { type: OBarMenuComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OBarMenuComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OLocaleBarMenuItemComponent;
}(OBaseMenuItemClass));
export { OLocaleBarMenuItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1sb2NhbGUtYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvbG9jYWxlLW1lbnUtaXRlbS9vLWxvY2FsZS1iYXItbWVudS1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdkcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFFLCtCQUErQixFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFaEcsTUFBTSxDQUFDLElBQU0scUNBQXFDLG9CQUM3QywrQkFBK0I7SUFFbEMsUUFBUTtFQUNULENBQUM7QUFFRjtJQVVpRCx1REFBa0I7SUFJakUscUNBQ3lELElBQXVCLEVBQ3BFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSDlCLFlBS0Usa0JBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FDN0I7UUFMd0QsVUFBSSxHQUFKLElBQUksQ0FBbUI7UUFDcEUsV0FBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixjQUFRLEdBQVIsUUFBUSxDQUFVOztJQUc5QixDQUFDO0lBRUQsbURBQWEsR0FBYjtRQUNFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEM7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELHNEQUFnQixHQUFoQjtRQUNFLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOztnQkF2Q0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLGtsQkFBc0Q7b0JBRXRELE1BQU0sRUFBRSxxQ0FBcUM7b0JBQzdDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osZ0NBQWdDLEVBQUUsTUFBTTtxQkFDekM7O2lCQUNGOzs7Z0JBbEJRLGlCQUFpQix1QkF3QnJCLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGlCQUFpQixFQUFqQixDQUFpQixDQUFDO2dCQTFCM0IsVUFBVTtnQkFBc0IsUUFBUTs7SUFtRDVELGtDQUFDO0NBQUEsQUF4Q0QsQ0FVaUQsa0JBQWtCLEdBOEJsRTtTQTlCWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9CYXJNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vby1iYXItbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX01FTlVfSVRFTSwgT0Jhc2VNZW51SXRlbUNsYXNzIH0gZnJvbSAnLi4vby1iYXNlLW1lbnUtaXRlbS5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0xPQ0FMRV9CQVJfTUVOVV9JVEVNID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0JBU0VfTUVOVV9JVEVNLFxuICAvLyBsb2NhbGUgW3N0cmluZ106IGxhbmd1YWdlLiBGb3IgZXhhbXBsZTogZXNcbiAgJ2xvY2FsZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbG9jYWxlLWJhci1tZW51LWl0ZW0nLFxuICB0ZW1wbGF0ZVVybDogJy4vby1sb2NhbGUtYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbG9jYWxlLWJhci1tZW51LWl0ZW0uY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xPQ0FMRV9CQVJfTUVOVV9JVEVNLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWxvY2FsZS1iYXItbWVudS1pdGVtXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Mb2NhbGVCYXJNZW51SXRlbUNvbXBvbmVudCBleHRlbmRzIE9CYXNlTWVudUl0ZW1DbGFzcyB7XG5cbiAgbG9jYWxlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9CYXJNZW51Q29tcG9uZW50KSkgcHJvdGVjdGVkIG1lbnU6IE9CYXJNZW51Q29tcG9uZW50LFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKG1lbnUsIGVsUmVmLCBpbmplY3Rvcik7XG4gIH1cblxuICBjb25maWd1cmVJMThuKCkge1xuICAgIGlmICh0aGlzLmlzQ29uZmlndXJlZExhbmcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UudXNlKHRoaXMubG9jYWxlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWVudSkge1xuICAgICAgdGhpcy5tZW51LmNvbGxhcHNlQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgaXNDb25maWd1cmVkTGFuZygpIHtcbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gKHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXRDdXJyZW50TGFuZygpID09PSB0aGlzLmxvY2FsZSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19