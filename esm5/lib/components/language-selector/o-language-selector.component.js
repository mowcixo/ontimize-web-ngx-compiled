import * as tslib_1 from "tslib";
import { Component, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { AppConfig } from '../../config/app-config';
import { InputConverter } from '../../decorators/input-converter';
import { OTranslateService } from '../../services/translate/o-translate.service';
import LocaleCode from '../../util/locale';
export var DEFAULT_INPUTS_O_LANGUAGE_SELECTOR = [
    'useFlagIcons: use-flag-icons'
];
export var DEFAULT_OUTPUTS_LANGUAGE_SELECTOR = [
    'onChange'
];
var OLanguageSelectorComponent = (function () {
    function OLanguageSelectorComponent(injector) {
        this.injector = injector;
        this.useFlagIcons = false;
        this.onChange = new EventEmitter();
        this.translateService = this.injector.get(OTranslateService);
        this.appConfig = this.injector.get(AppConfig);
        this.availableLangs = this.appConfig.getConfiguration().applicationLocales;
    }
    OLanguageSelectorComponent.prototype.getFlagClass = function (lang) {
        var flagName = LocaleCode.getCountryCode(lang);
        flagName = (flagName !== 'en') ? flagName : 'gb';
        return 'flag-icon-' + flagName;
    };
    OLanguageSelectorComponent.prototype.getAvailableLangs = function () {
        return this.availableLangs;
    };
    OLanguageSelectorComponent.prototype.configureI18n = function (lang) {
        if (this.translateService && this.translateService.getCurrentLang() !== lang) {
            this.translateService.use(lang);
            this.onChange.emit(lang);
        }
    };
    OLanguageSelectorComponent.prototype.getCurrentLang = function () {
        return this.translateService.getCurrentLang();
    };
    OLanguageSelectorComponent.prototype.getCurrentCountry = function () {
        return LocaleCode.getCountryCode(this.getCurrentLang());
    };
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
    OLanguageSelectorComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OLanguageSelectorComponent.prototype, "useFlagIcons", void 0);
    return OLanguageSelectorComponent;
}());
export { OLanguageSelectorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1sYW5ndWFnZS1zZWxlY3Rvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGFuZ3VhZ2Utc2VsZWN0b3Ivby1sYW5ndWFnZS1zZWxlY3Rvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBQ2pGLE9BQU8sVUFBVSxNQUFNLG1CQUFtQixDQUFDO0FBRTNDLE1BQU0sQ0FBQyxJQUFNLGtDQUFrQyxHQUFHO0lBQ2hELDhCQUE4QjtDQUMvQixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0saUNBQWlDLEdBQUc7SUFDL0MsVUFBVTtDQUNYLENBQUM7QUFFRjtJQXVCRSxvQ0FBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVJ4QyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUU5QixhQUFRLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFPMUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztJQUM3RSxDQUFDO0lBRUQsaURBQVksR0FBWixVQUFhLElBQVk7UUFDdkIsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2pELE9BQU8sWUFBWSxHQUFHLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0lBRUQsc0RBQWlCLEdBQWpCO1FBQ0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFRCxrREFBYSxHQUFiLFVBQWMsSUFBUztRQUNyQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzVFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRUQsbURBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRCxzREFBaUIsR0FBakI7UUFDRSxPQUFPLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQzs7Z0JBcERGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixNQUFNLEVBQUUsa0NBQWtDO29CQUMxQyxPQUFPLEVBQUUsaUNBQWlDO29CQUMxQyxxMUJBQW1EO29CQUVuRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLDZCQUE2QixFQUFFLE1BQU07cUJBQ3RDOztpQkFDRjs7O2dCQXpCaUMsUUFBUTs7SUE4QnhDO1FBREMsY0FBYyxFQUFFOztvRUFDYTtJQXVDaEMsaUNBQUM7Q0FBQSxBQXRERCxJQXNEQztTQTFDWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgTG9jYWxlQ29kZSBmcm9tICcuLi8uLi91dGlsL2xvY2FsZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0xBTkdVQUdFX1NFTEVDVE9SID0gW1xuICAndXNlRmxhZ0ljb25zOiB1c2UtZmxhZy1pY29ucydcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfTEFOR1VBR0VfU0VMRUNUT1IgPSBbXG4gICdvbkNoYW5nZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbGFuZ3VhZ2Utc2VsZWN0b3InLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTEFOR1VBR0VfU0VMRUNUT1IsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19MQU5HVUFHRV9TRUxFQ1RPUixcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGFuZ3VhZ2Utc2VsZWN0b3IuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWxhbmd1YWdlLXNlbGVjdG9yLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tbGFuZ3VhZ2Utc2VsZWN0b3JdJzogJ3RydWUnXG4gIH1cbn0pXG5cbmV4cG9ydCBjbGFzcyBPTGFuZ3VhZ2VTZWxlY3RvckNvbXBvbmVudCB7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgdXNlRmxhZ0ljb25zOiBib29sZWFuID0gZmFsc2U7XG5cbiAgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgYXBwQ29uZmlnOiBBcHBDb25maWc7XG4gIHByb3RlY3RlZCBhdmFpbGFibGVMYW5nczogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLmFwcENvbmZpZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcENvbmZpZyk7XG4gICAgdGhpcy5hdmFpbGFibGVMYW5ncyA9IHRoaXMuYXBwQ29uZmlnLmdldENvbmZpZ3VyYXRpb24oKS5hcHBsaWNhdGlvbkxvY2FsZXM7XG4gIH1cblxuICBnZXRGbGFnQ2xhc3MobGFuZzogc3RyaW5nKSB7XG4gICAgbGV0IGZsYWdOYW1lID0gTG9jYWxlQ29kZS5nZXRDb3VudHJ5Q29kZShsYW5nKTtcbiAgICBmbGFnTmFtZSA9IChmbGFnTmFtZSAhPT0gJ2VuJykgPyBmbGFnTmFtZSA6ICdnYic7XG4gICAgcmV0dXJuICdmbGFnLWljb24tJyArIGZsYWdOYW1lO1xuICB9XG5cbiAgZ2V0QXZhaWxhYmxlTGFuZ3MoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLmF2YWlsYWJsZUxhbmdzO1xuICB9XG5cbiAgY29uZmlndXJlSTE4bihsYW5nOiBhbnkpIHtcbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlICYmIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXRDdXJyZW50TGFuZygpICE9PSBsYW5nKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UudXNlKGxhbmcpO1xuICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KGxhbmcpO1xuICAgIH1cbiAgfVxuXG4gIGdldEN1cnJlbnRMYW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXRDdXJyZW50TGFuZygpO1xuICB9XG5cbiAgZ2V0Q3VycmVudENvdW50cnkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gTG9jYWxlQ29kZS5nZXRDb3VudHJ5Q29kZSh0aGlzLmdldEN1cnJlbnRMYW5nKCkpO1xuICB9XG5cbn1cbiJdfQ==