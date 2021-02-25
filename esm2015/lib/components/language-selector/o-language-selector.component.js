import * as tslib_1 from "tslib";
import { Component, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { AppConfig } from '../../config/app-config';
import { InputConverter } from '../../decorators/input-converter';
import { OTranslateService } from '../../services/translate/o-translate.service';
import LocaleCode from '../../util/locale';
export const DEFAULT_INPUTS_O_LANGUAGE_SELECTOR = [
    'useFlagIcons: use-flag-icons'
];
export const DEFAULT_OUTPUTS_LANGUAGE_SELECTOR = [
    'onChange'
];
export class OLanguageSelectorComponent {
    constructor(injector) {
        this.injector = injector;
        this.useFlagIcons = false;
        this.onChange = new EventEmitter();
        this.translateService = this.injector.get(OTranslateService);
        this.appConfig = this.injector.get(AppConfig);
        this.availableLangs = this.appConfig.getConfiguration().applicationLocales;
    }
    getFlagClass(lang) {
        let flagName = LocaleCode.getCountryCode(lang);
        flagName = (flagName !== 'en') ? flagName : 'gb';
        return 'flag-icon-' + flagName;
    }
    getAvailableLangs() {
        return this.availableLangs;
    }
    configureI18n(lang) {
        if (this.translateService && this.translateService.getCurrentLang() !== lang) {
            this.translateService.use(lang);
            this.onChange.emit(lang);
        }
    }
    getCurrentLang() {
        return this.translateService.getCurrentLang();
    }
    getCurrentCountry() {
        return LocaleCode.getCountryCode(this.getCurrentLang());
    }
}
OLanguageSelectorComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-language-selector',
                inputs: DEFAULT_INPUTS_O_LANGUAGE_SELECTOR,
                outputs: DEFAULT_OUTPUTS_LANGUAGE_SELECTOR,
                template: "<div fxLayout fxLayoutAlign=\"center center\" fxFill>\n  <button type=\"button\" *ngIf=\"useFlagIcons\" class=\"menu-button\" mat-icon-button [matMenuTriggerFor]=\"langMenu\">\n    <span class=\"flag-icon {{ getFlagClass(getCurrentCountry()) }}\"></span>\n  </button>\n\n  <button type=\"button\" *ngIf=\"!useFlagIcons\" class=\"menu-button o-language-selector-text\" mat-button [matMenuTriggerFor]=\"langMenu\">\n    <span>{{ 'LOCALE_' + getCurrentLang() | oTranslate }}</span>\n  </button>\n</div>\n\n<mat-menu #langMenu=\"matMenu\" yPosition=\"below\">\n  <button type=\"button\" mat-menu-item *ngFor=\"let lang of getAvailableLangs()\" (click)=\"configureI18n(lang)\">\n    <span *ngIf=\"useFlagIcons\" class=\"flag-icon {{ getFlagClass(lang) }}\"></span>\n    <span>{{ 'LOCALE_' + lang | oTranslate }}</span>\n  </button>\n</mat-menu>\n",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-language-selector]': 'true'
                },
                styles: [".o-language-selector .menu-button{margin-left:6px}.o-language-selector .menu-button.o-language-selector-text{padding:0;min-width:40px}"]
            }] }
];
OLanguageSelectorComponent.ctorParameters = () => [
    { type: Injector }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OLanguageSelectorComponent.prototype, "useFlagIcons", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1sYW5ndWFnZS1zZWxlY3Rvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGFuZ3VhZ2Utc2VsZWN0b3Ivby1sYW5ndWFnZS1zZWxlY3Rvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2pGLE9BQU8sVUFBVSxNQUFNLG1CQUFtQixDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLGtDQUFrQyxHQUFHO0lBQ2hELDhCQUE4QjtDQUMvQixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUc7SUFDL0MsVUFBVTtDQUNYLENBQUM7QUFjRixNQUFNLE9BQU8sMEJBQTBCO0lBV3JDLFlBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFSeEMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFFOUIsYUFBUSxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBTzFELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUMsa0JBQWtCLENBQUM7SUFDN0UsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFZO1FBQ3ZCLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsUUFBUSxHQUFHLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqRCxPQUFPLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDakMsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBRUQsYUFBYSxDQUFDLElBQVM7UUFDckIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7OztZQXBERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsTUFBTSxFQUFFLGtDQUFrQztnQkFDMUMsT0FBTyxFQUFFLGlDQUFpQztnQkFDMUMscTFCQUFtRDtnQkFFbkQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSiw2QkFBNkIsRUFBRSxNQUFNO2lCQUN0Qzs7YUFDRjs7O1lBekJpQyxRQUFROztBQThCeEM7SUFEQyxjQUFjLEVBQUU7O2dFQUNhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdG9yLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBcHBDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IExvY2FsZUNvZGUgZnJvbSAnLi4vLi4vdXRpbC9sb2NhbGUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MQU5HVUFHRV9TRUxFQ1RPUiA9IFtcbiAgJ3VzZUZsYWdJY29uczogdXNlLWZsYWctaWNvbnMnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX0xBTkdVQUdFX1NFTEVDVE9SID0gW1xuICAnb25DaGFuZ2UnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxhbmd1YWdlLXNlbGVjdG9yJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xBTkdVQUdFX1NFTEVDVE9SLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfTEFOR1VBR0VfU0VMRUNUT1IsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxhbmd1YWdlLXNlbGVjdG9yLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1sYW5ndWFnZS1zZWxlY3Rvci5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWxhbmd1YWdlLXNlbGVjdG9yXSc6ICd0cnVlJ1xuICB9XG59KVxuXG5leHBvcnQgY2xhc3MgT0xhbmd1YWdlU2VsZWN0b3JDb21wb25lbnQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHVzZUZsYWdJY29uczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIGFwcENvbmZpZzogQXBwQ29uZmlnO1xuICBwcm90ZWN0ZWQgYXZhaWxhYmxlTGFuZ3M6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5hcHBDb25maWcgPSB0aGlzLmluamVjdG9yLmdldChBcHBDb25maWcpO1xuICAgIHRoaXMuYXZhaWxhYmxlTGFuZ3MgPSB0aGlzLmFwcENvbmZpZy5nZXRDb25maWd1cmF0aW9uKCkuYXBwbGljYXRpb25Mb2NhbGVzO1xuICB9XG5cbiAgZ2V0RmxhZ0NsYXNzKGxhbmc6IHN0cmluZykge1xuICAgIGxldCBmbGFnTmFtZSA9IExvY2FsZUNvZGUuZ2V0Q291bnRyeUNvZGUobGFuZyk7XG4gICAgZmxhZ05hbWUgPSAoZmxhZ05hbWUgIT09ICdlbicpID8gZmxhZ05hbWUgOiAnZ2InO1xuICAgIHJldHVybiAnZmxhZy1pY29uLScgKyBmbGFnTmFtZTtcbiAgfVxuXG4gIGdldEF2YWlsYWJsZUxhbmdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5hdmFpbGFibGVMYW5ncztcbiAgfVxuXG4gIGNvbmZpZ3VyZUkxOG4obGFuZzogYW55KSB7XG4gICAgaWYgKHRoaXMudHJhbnNsYXRlU2VydmljZSAmJiB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0Q3VycmVudExhbmcoKSAhPT0gbGFuZykge1xuICAgICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlLnVzZShsYW5nKTtcbiAgICAgIHRoaXMub25DaGFuZ2UuZW1pdChsYW5nKTtcbiAgICB9XG4gIH1cblxuICBnZXRDdXJyZW50TGFuZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0Q3VycmVudExhbmcoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRDb3VudHJ5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIExvY2FsZUNvZGUuZ2V0Q291bnRyeUNvZGUodGhpcy5nZXRDdXJyZW50TGFuZygpKTtcbiAgfVxuXG59XG4iXX0=