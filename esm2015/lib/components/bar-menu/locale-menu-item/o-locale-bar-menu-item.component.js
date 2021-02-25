import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';
export const DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM = [
    ...DEFAULT_INPUTS_O_BASE_MENU_ITEM,
    'locale'
];
export class OLocaleBarMenuItemComponent extends OBaseMenuItemClass {
    constructor(menu, elRef, injector) {
        super(menu, elRef, injector);
        this.menu = menu;
        this.elRef = elRef;
        this.injector = injector;
    }
    configureI18n() {
        if (this.isConfiguredLang()) {
            return;
        }
        if (this.translateService) {
            this.translateService.use(this.locale);
        }
        if (this.menu) {
            this.menu.collapseAll();
        }
    }
    isConfiguredLang() {
        if (this.translateService) {
            return (this.translateService.getCurrentLang() === this.locale);
        }
        return false;
    }
}
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
OLocaleBarMenuItemComponent.ctorParameters = () => [
    { type: OBarMenuComponent, decorators: [{ type: Inject, args: [forwardRef(() => OBarMenuComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1sb2NhbGUtYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvbG9jYWxlLW1lbnUtaXRlbS9vLWxvY2FsZS1iYXItbWVudS1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVoRyxNQUFNLENBQUMsTUFBTSxxQ0FBcUMsR0FBRztJQUNuRCxHQUFHLCtCQUErQjtJQUVsQyxRQUFRO0NBQ1QsQ0FBQztBQVlGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSxrQkFBa0I7SUFJakUsWUFDeUQsSUFBdUIsRUFDcEUsS0FBaUIsRUFDakIsUUFBa0I7UUFFNUIsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFKMEIsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFDcEUsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBRzlCLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtZQUMzQixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakU7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7OztZQXZDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsa2xCQUFzRDtnQkFFdEQsTUFBTSxFQUFFLHFDQUFxQztnQkFDN0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixnQ0FBZ0MsRUFBRSxNQUFNO2lCQUN6Qzs7YUFDRjs7O1lBbEJRLGlCQUFpQix1QkF3QnJCLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUExQjNCLFVBQVU7WUFBc0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0Jhck1lbnVDb21wb25lbnQgfSBmcm9tICcuLi9vLWJhci1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfTUVOVV9JVEVNLCBPQmFzZU1lbnVJdGVtQ2xhc3MgfSBmcm9tICcuLi9vLWJhc2UtbWVudS1pdGVtLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTE9DQUxFX0JBUl9NRU5VX0lURU0gPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9NRU5VX0lURU0sXG4gIC8vIGxvY2FsZSBbc3RyaW5nXTogbGFuZ3VhZ2UuIEZvciBleGFtcGxlOiBlc1xuICAnbG9jYWxlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1sb2NhbGUtYmFyLW1lbnUtaXRlbScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxvY2FsZS1iYXItbWVudS1pdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1sb2NhbGUtYmFyLW1lbnUtaXRlbS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTE9DQUxFX0JBUl9NRU5VX0lURU0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tbG9jYWxlLWJhci1tZW51LWl0ZW1dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xvY2FsZUJhck1lbnVJdGVtQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VNZW51SXRlbUNsYXNzIHtcblxuICBsb2NhbGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Jhck1lbnVDb21wb25lbnQpKSBwcm90ZWN0ZWQgbWVudTogT0Jhck1lbnVDb21wb25lbnQsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIobWVudSwgZWxSZWYsIGluamVjdG9yKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZUkxOG4oKSB7XG4gICAgaWYgKHRoaXMuaXNDb25maWd1cmVkTGFuZygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnRyYW5zbGF0ZVNlcnZpY2UpIHtcbiAgICAgIHRoaXMudHJhbnNsYXRlU2VydmljZS51c2UodGhpcy5sb2NhbGUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tZW51KSB7XG4gICAgICB0aGlzLm1lbnUuY29sbGFwc2VBbGwoKTtcbiAgICB9XG4gIH1cblxuICBpc0NvbmZpZ3VyZWRMYW5nKCkge1xuICAgIGlmICh0aGlzLnRyYW5zbGF0ZVNlcnZpY2UpIHtcbiAgICAgIHJldHVybiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldEN1cnJlbnRMYW5nKCkgPT09IHRoaXMubG9jYWxlKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=