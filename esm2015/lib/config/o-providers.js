import { LOCATION_INITIALIZED } from '@angular/common';
import { Injector } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AppConfig, O_INPUTS_OPTIONS } from '../config/app-config';
import { appConfigFactory } from '../services/app-config.provider';
import { OntimizeServiceProvider } from '../services/factories';
import { LocalStorageService } from '../services/local-storage.service';
import { NavigationService } from '../services/navigation.service';
import { OntimizeMatIconRegistry } from '../services/ontimize-icon-registry.service';
import { OntimizeServiceResponseAdapter } from '../services/ontimize/ontimize-service-response.adapter';
import { ORemoteConfigurationService } from '../services/remote-config.service';
import { Error403Component } from '../shared/components/error403/o-error-403.component';
import { O_MAT_ERROR_OPTIONS } from '../shared/material/o-mat-error/o-mat-error';
import { Codes } from '../util/codes';
import { Util } from '../util/util';
function addPermissionsRouteGuard(injector) {
    const route = injector.get(Router);
    const exists403 = route.config.find(r => r.path === Codes.FORBIDDEN_ROUTE);
    if (!exists403) {
        route.config.push({ path: Codes.FORBIDDEN_ROUTE, component: Error403Component });
    }
}
export function appInitializerFactory(injector, config, oTranslate) {
    return () => new Promise((resolve) => {
        const observableArray = [];
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const storedLang = oTranslate.getStoredLanguage();
            const configLang = config['locale'];
            const browserLang = oTranslate.getBrowserLang();
            let userLang = Util.isDefined(config['defaultLocale']) ? config['defaultLocale'] : 'en';
            let defaultLang = Util.isDefined(config['defaultLocale']) ? config['defaultLocale'] : 'en';
            if (storedLang) {
                userLang = storedLang;
            }
            else if (configLang) {
                userLang = configLang;
                defaultLang = configLang;
            }
            else if (browserLang) {
                userLang = browserLang;
                defaultLang = browserLang;
            }
            oTranslate.setDefaultLang(defaultLang);
            const locales = new Set(config.applicationLocales || []);
            locales.add('en');
            locales.add(userLang);
            if (!config.applicationLocales) {
                config.applicationLocales = [...locales];
            }
            if (config.uuid == null || config.uuid === '') {
                console.error('Your app must have an \'uuid\' property defined on your app.config file. Otherwise, your application will not work correctly.');
                alert('Your app must have an \'uuid\' property defined on your app.config file. Otherwise, your application will not work correctly.');
            }
            injector.get(NavigationService).initialize();
            injector.get(OntimizeMatIconRegistry).initialize();
            injector.get(LocalStorageService).setBackwardCompatibility();
            addPermissionsRouteGuard(injector);
            observableArray.push(oTranslate.setAppLang(userLang));
            const remoteConfigService = injector.get(ORemoteConfigurationService);
            observableArray.push(remoteConfigService.initialize());
            combineLatest(observableArray).subscribe(() => {
                resolve();
            });
        });
    });
}
const ɵ0 = appConfigFactory, ɵ1 = { disabled: true }, ɵ2 = {}, ɵ3 = {};
export const ONTIMIZE_PROVIDERS = [
    { provide: AppConfig, useFactory: ɵ0, deps: [Injector] },
    OntimizeServiceProvider,
    OntimizeServiceResponseAdapter,
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: ɵ1 },
    { provide: O_MAT_ERROR_OPTIONS, useValue: ɵ2 },
    { provide: O_INPUTS_OPTIONS, useValue: ɵ3 }
];
export { ɵ0, ɵ1, ɵ2, ɵ3 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wcm92aWRlcnMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbmZpZy9vLXByb3ZpZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsUUFBUSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNuRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNyRixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUN4RyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUVoRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUN4RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUVqRixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFcEMs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QUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztZQUM3RCx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0RCxNQUFNLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUN0RSxlQUFlLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDdkQsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQzVDLE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztXQUdtQyxnQkFBZ0IsT0FJRixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FDeEIsRUFBRSxPQUNMLEVBQUU7QUFQM0MsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQWU7SUFDNUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsSUFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUN0RSx1QkFBdUI7SUFDdkIsOEJBQThCO0lBRTlCLEVBQUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFFBQVEsSUFBb0IsRUFBRTtJQUNwRSxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxRQUFRLElBQUksRUFBRTtJQUM5QyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLElBQUksRUFBRTtDQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTE9DQVRJT05fSU5JVElBTElaRUQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0b3IsIFByb3ZpZGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQXBwQ29uZmlnLCBPX0lOUFVUU19PUFRJT05TIH0gZnJvbSAnLi4vY29uZmlnL2FwcC1jb25maWcnO1xuaW1wb3J0IHsgYXBwQ29uZmlnRmFjdG9yeSB9IGZyb20gJy4uL3NlcnZpY2VzL2FwcC1jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL25hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZU1hdEljb25SZWdpc3RyeSB9IGZyb20gJy4uL3NlcnZpY2VzL29udGltaXplLWljb24tcmVnaXN0cnkuc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VSZXNwb25zZUFkYXB0ZXIgfSBmcm9tICcuLi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS1zZXJ2aWNlLXJlc3BvbnNlLmFkYXB0ZXInO1xuaW1wb3J0IHsgT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvcmVtb3RlLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXJyb3I0MDNDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvY29tcG9uZW50cy9lcnJvcjQwMy9vLWVycm9yLTQwMy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT19NQVRfRVJST1JfT1BUSU9OUyB9IGZyb20gJy4uL3NoYXJlZC9tYXRlcmlhbC9vLW1hdC1lcnJvci9vLW1hdC1lcnJvcic7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi90eXBlcy9jb25maWcudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmZ1bmN0aW9uIGFkZFBlcm1pc3Npb25zUm91dGVHdWFyZChpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgY29uc3Qgcm91dGUgPSBpbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgY29uc3QgZXhpc3RzNDAzID0gcm91dGUuY29uZmlnLmZpbmQociA9PiByLnBhdGggPT09IENvZGVzLkZPUkJJRERFTl9ST1VURSk7XG4gIGlmICghZXhpc3RzNDAzKSB7XG4gICAgcm91dGUuY29uZmlnLnB1c2goeyBwYXRoOiBDb2Rlcy5GT1JCSURERU5fUk9VVEUsIGNvbXBvbmVudDogRXJyb3I0MDNDb21wb25lbnQgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcEluaXRpYWxpemVyRmFjdG9yeShpbmplY3RvcjogSW5qZWN0b3IsIGNvbmZpZzogQ29uZmlnLCBvVHJhbnNsYXRlOiBPVHJhbnNsYXRlU2VydmljZSkge1xuICByZXR1cm4gKCkgPT4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZTogYW55KSA9PiB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZUFycmF5ID0gW107XG4gICAgY29uc3QgbG9jYXRpb25Jbml0aWFsaXplZCA9IGluamVjdG9yLmdldChMT0NBVElPTl9JTklUSUFMSVpFRCwgUHJvbWlzZS5yZXNvbHZlKG51bGwpKTtcbiAgICBsb2NhdGlvbkluaXRpYWxpemVkLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3Qgc3RvcmVkTGFuZyA9IG9UcmFuc2xhdGUuZ2V0U3RvcmVkTGFuZ3VhZ2UoKTtcbiAgICAgIGNvbnN0IGNvbmZpZ0xhbmcgPSBjb25maWdbJ2xvY2FsZSddO1xuICAgICAgY29uc3QgYnJvd3NlckxhbmcgPSBvVHJhbnNsYXRlLmdldEJyb3dzZXJMYW5nKCk7XG4gICAgICBsZXQgdXNlckxhbmcgPSBVdGlsLmlzRGVmaW5lZChjb25maWdbJ2RlZmF1bHRMb2NhbGUnXSkgPyBjb25maWdbJ2RlZmF1bHRMb2NhbGUnXSA6ICdlbic7XG4gICAgICBsZXQgZGVmYXVsdExhbmcgPSBVdGlsLmlzRGVmaW5lZChjb25maWdbJ2RlZmF1bHRMb2NhbGUnXSkgPyBjb25maWdbJ2RlZmF1bHRMb2NhbGUnXSA6ICdlbic7XG4gICAgICBpZiAoc3RvcmVkTGFuZykge1xuICAgICAgICB1c2VyTGFuZyA9IHN0b3JlZExhbmc7XG4gICAgICB9IGVsc2UgaWYgKGNvbmZpZ0xhbmcpIHtcbiAgICAgICAgdXNlckxhbmcgPSBjb25maWdMYW5nO1xuICAgICAgICBkZWZhdWx0TGFuZyA9IGNvbmZpZ0xhbmc7XG4gICAgICB9IGVsc2UgaWYgKGJyb3dzZXJMYW5nKSB7XG4gICAgICAgIHVzZXJMYW5nID0gYnJvd3Nlckxhbmc7XG4gICAgICAgIGRlZmF1bHRMYW5nID0gYnJvd3Nlckxhbmc7XG4gICAgICB9XG4gICAgICBvVHJhbnNsYXRlLnNldERlZmF1bHRMYW5nKGRlZmF1bHRMYW5nKTtcblxuICAgICAgY29uc3QgbG9jYWxlcyA9IG5ldyBTZXQoY29uZmlnLmFwcGxpY2F0aW9uTG9jYWxlcyB8fCBbXSk7XG4gICAgICBsb2NhbGVzLmFkZCgnZW4nKTtcbiAgICAgIGxvY2FsZXMuYWRkKHVzZXJMYW5nKTtcblxuICAgICAgLy8gaW5pdGlhbGl6ZSBhdmFpbGFibGUgbG9jYWxlcyBhcnJheSBpZiBuZWVkZWRcbiAgICAgIGlmICghY29uZmlnLmFwcGxpY2F0aW9uTG9jYWxlcykge1xuICAgICAgICBjb25maWcuYXBwbGljYXRpb25Mb2NhbGVzID0gWy4uLmxvY2FsZXNdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29uZmlnLnV1aWQgPT0gbnVsbCB8fCBjb25maWcudXVpZCA9PT0gJycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignWW91ciBhcHAgbXVzdCBoYXZlIGFuIFxcJ3V1aWRcXCcgcHJvcGVydHkgZGVmaW5lZCBvbiB5b3VyIGFwcC5jb25maWcgZmlsZS4gT3RoZXJ3aXNlLCB5b3VyIGFwcGxpY2F0aW9uIHdpbGwgbm90IHdvcmsgY29ycmVjdGx5LicpO1xuICAgICAgICBhbGVydCgnWW91ciBhcHAgbXVzdCBoYXZlIGFuIFxcJ3V1aWRcXCcgcHJvcGVydHkgZGVmaW5lZCBvbiB5b3VyIGFwcC5jb25maWcgZmlsZS4gT3RoZXJ3aXNlLCB5b3VyIGFwcGxpY2F0aW9uIHdpbGwgbm90IHdvcmsgY29ycmVjdGx5LicpO1xuICAgICAgfVxuICAgICAgaW5qZWN0b3IuZ2V0KE5hdmlnYXRpb25TZXJ2aWNlKS5pbml0aWFsaXplKCk7XG4gICAgICBpbmplY3Rvci5nZXQoT250aW1pemVNYXRJY29uUmVnaXN0cnkpLmluaXRpYWxpemUoKTtcbiAgICAgIGluamVjdG9yLmdldChMb2NhbFN0b3JhZ2VTZXJ2aWNlKS5zZXRCYWNrd2FyZENvbXBhdGliaWxpdHkoKTtcbiAgICAgIGFkZFBlcm1pc3Npb25zUm91dGVHdWFyZChpbmplY3Rvcik7XG4gICAgICBvYnNlcnZhYmxlQXJyYXkucHVzaChvVHJhbnNsYXRlLnNldEFwcExhbmcodXNlckxhbmcpKTtcbiAgICAgIGNvbnN0IHJlbW90ZUNvbmZpZ1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcbiAgICAgIG9ic2VydmFibGVBcnJheS5wdXNoKHJlbW90ZUNvbmZpZ1NlcnZpY2UuaW5pdGlhbGl6ZSgpKTtcbiAgICAgIGNvbWJpbmVMYXRlc3Qob2JzZXJ2YWJsZUFycmF5KS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBPTlRJTUlaRV9QUk9WSURFUlM6IFByb3ZpZGVyW10gPSBbXG4gIHsgcHJvdmlkZTogQXBwQ29uZmlnLCB1c2VGYWN0b3J5OiBhcHBDb25maWdGYWN0b3J5LCBkZXBzOiBbSW5qZWN0b3JdIH0sXG4gIE9udGltaXplU2VydmljZVByb3ZpZGVyLFxuICBPbnRpbWl6ZVNlcnZpY2VSZXNwb25zZUFkYXB0ZXIsXG4gIC8vIGRpc2FibGVkIGdsb2JhbCByaXBwbGVcbiAgeyBwcm92aWRlOiBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLCB1c2VWYWx1ZTogeyBkaXNhYmxlZDogdHJ1ZSB9IH0sXG4gIHsgcHJvdmlkZTogT19NQVRfRVJST1JfT1BUSU9OUywgdXNlVmFsdWU6IHt9IH0sXG4gIHsgcHJvdmlkZTogT19JTlBVVFNfT1BUSU9OUywgdXNlVmFsdWU6IHt9IH1cbl07XG4iXX0=