import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, ViewEncapsulation, } from '@angular/core';
import { Router } from '@angular/router';
import { InputConverter } from '../../../decorators/input-converter';
import { OAppLayoutComponent } from '../../../layouts/app-layout/o-app-layout.component';
import { DialogService } from '../../../services/dialog.service';
import { LoginService } from '../../../services/login.service';
import { OUserInfoService } from '../../../services/o-user-info.service';
import { PermissionsService } from '../../../services/permissions/permissions.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { PermissionsUtils } from '../../../util/permissions';
import { Util } from '../../../util/util';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM = [
    'menuItem : menu-item',
    'menuItemType : menu-item-type',
    'sidenavOpened : sidenav-opened',
    'disabled'
];
export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM = [
    'onClick'
];
export class OAppSidenavMenuItemComponent {
    constructor(injector, elRef, cd) {
        this.injector = injector;
        this.elRef = elRef;
        this.cd = cd;
        this.onClick = new EventEmitter();
        this.sidenavOpened = true;
        this.disabled = false;
        this.translateService = this.injector.get(OTranslateService);
        this.loginService = this.injector.get(LoginService);
        this.dialogService = this.injector.get(DialogService);
        this.permissionsService = this.injector.get(PermissionsService);
        this.oUserInfoService = this.injector.get(OUserInfoService);
        this.sidenav = this.injector.get(OAppSidenavComponent);
        this.oAppLayoutComponent = this.injector.get(OAppLayoutComponent);
        this.router = this.injector.get(Router);
        this.routerSubscription = this.router.events.subscribe(() => {
            this.cd.detectChanges();
        });
    }
    ngOnInit() {
        this.parsePermissions();
    }
    ngAfterViewInit() {
        if (this.isUserInfoItem() && this.sidenav) {
            this.setUserInfoImage();
            this.appSidenavToggleSubscription = this.sidenav.onSidenavOpenedChange.subscribe(() => {
                if (this.sidenav.sidenav.opened) {
                    this.setUserInfoImage();
                    this.setUserInfoImage();
                }
            });
            this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
                if (Util.isDefined(res.avatar) && this.sidenav.sidenav.opened) {
                    this.menuItem.avatar = res.avatar;
                    this.setUserInfoImage();
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.appSidenavToggleSubscription) {
            this.appSidenavToggleSubscription.unsubscribe();
        }
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        if (this.userInfoSubscription) {
            this.userInfoSubscription.unsubscribe();
        }
    }
    parsePermissions() {
        this.permissions = this.permissionsService.getMenuPermissions(this.menuItem.id);
        if (!Util.isDefined(this.permissions)) {
            return;
        }
        this.hidden = this.permissions.visible === false;
        if (!this.disabled) {
            this.disabled = this.permissions.enabled === false;
        }
        if (this.disabled) {
            this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.elRef.nativeElement, {
                checkStringValue: true
            });
        }
    }
    setUserInfoImage() {
        const imgEl = this.elRef.nativeElement.getElementsByClassName('o-user-info-image')[0];
        if (imgEl !== undefined) {
            const item = this.menuItem;
            imgEl.setAttribute('style', 'background-image: url(\'' + item.avatar + '\')');
        }
        this.cd.detectChanges();
    }
    executeItemAction() {
        const actionItem = this.menuItem;
        if (Util.parseBoolean(actionItem.confirm, false)) {
            this.dialogService.confirm('CONFIRM', actionItem.confirmText || 'MESSAGES.CONFIRM_ACTION').then(result => result ? actionItem.action() : null);
        }
        else {
            actionItem.action();
        }
    }
    configureI18n() {
        const localeItem = this.menuItem;
        if (this.isConfiguredLang()) {
            return;
        }
        if (this.translateService) {
            this.translateService.use(localeItem.locale);
        }
    }
    isConfiguredLang() {
        const localeItem = this.menuItem;
        if (this.translateService) {
            return (this.translateService.getCurrentLang() === localeItem.locale);
        }
        return false;
    }
    logout() {
        const menuItem = this.menuItem;
        if (Util.parseBoolean(menuItem.confirm, true)) {
            this.loginService.logoutWithConfirmationAndRedirect();
        }
        else {
            this.loginService.logoutAndRedirect();
        }
    }
    navigate() {
        const route = this.menuItem.route;
        if (this.router.url !== route) {
            this.router.navigate([route]);
        }
    }
    triggerClick(e) {
        if (this.disabled) {
            return;
        }
        switch (this.menuItemType) {
            case 'action':
                this.executeItemAction();
                break;
            case 'locale':
                this.configureI18n();
                break;
            case 'logout':
                this.logout();
                break;
            case 'route':
                this.navigate();
                break;
            default:
                break;
        }
        this.onClick.emit(e);
    }
    isRouteItem() {
        return this.menuItemType === 'route';
    }
    isActionItem() {
        return this.menuItemType === 'action';
    }
    isLocaleItem() {
        return this.menuItemType === 'locale';
    }
    isLogoutItem() {
        return this.menuItemType === 'logout';
    }
    isUserInfoItem() {
        return this.menuItemType === 'user-info';
    }
    isDefaultItem() {
        return this.menuItemType === 'default';
    }
    get useFlagIcons() {
        return this.oAppLayoutComponent && this.oAppLayoutComponent.useFlagIcons;
    }
    isActiveItem() {
        if (!this.isRouteItem()) {
            return false;
        }
        const route = this.menuItem.route;
        return this.router.url === route || this.router.url.startsWith(route + '/');
    }
    get tooltip() {
        let result = this.translateService.get(this.menuItem.name);
        if (Util.isDefined(this.menuItem.tooltip)) {
            result += ': ' + this.translateService.get(this.menuItem.tooltip);
        }
        return result;
    }
    getClass() {
        let className = 'o-app-sidenav-menu-item';
        if (this.menuItem.class) {
            className += ' ' + this.menuItem.class;
        }
        return className;
    }
}
OAppSidenavMenuItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-app-sidenav-menu-item',
                inputs: DEFAULT_INPUTS_O_APP_SIDENAV_MENU_ITEM,
                outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_ITEM,
                template: "<ng-container *ngIf=\"sidenavOpened\">\n  <li *ngIf=\"!hidden\" class=\"o-app-sidenav-menuitem o-app-sidenav-item\" [class.o-user-info]=\"isUserInfoItem()\">\n\n    <a mat-button *ngIf=\"!isUserInfoItem() && !isLocaleItem()\" (click)=\"triggerClick($event)\"\n      [class.o-app-sidenav-viewer-sidenav-item-selected]=\"isActiveItem()\">\n      <div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n        <mat-icon *ngIf=\"menuItem.icon\">{{ menuItem.icon }}</mat-icon>\n        {{ menuItem.name | oTranslate }}\n      </div>\n    </a>\n\n    <a mat-button *ngIf=\"isLocaleItem()\" (click)=\"triggerClick($event)\">\n      <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n        <mat-icon *ngIf=\"menuItem.icon\">{{ menuItem.icon }}</mat-icon>\n        {{ menuItem.name | oTranslate }}\n        <mat-icon *ngIf=\"isConfiguredLang()\" class=\"configured-lang\">check_circle</mat-icon>\n      </div>\n    </a>\n\n    <div *ngIf=\"isUserInfoItem()\" fxLayout=\"column\" fxLayoutAlign=\"center center\" class=\"o-user-info-menu-item\">\n      <div class=\"o-user-info-image\" fxFlexFill></div>\n      <div class=\"o-user-info-item\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxFlexFill>\n        <div class=\"o-user-info-name\">{{ menuItem.user }} </div>\n        <o-language-selector [use-flag-icons]=\"useFlagIcons\"></o-language-selector>\n      </div>\n    </div>\n  </li>\n</ng-container>\n\n<ng-container *ngIf=\"!sidenavOpened\">\n  <li *ngIf=\"!hidden\" class=\"o-app-sidenav-menuitem o-app-sidenav-item\">\n    <a [matTooltip]=\"tooltip\" matTooltipClass=\"menuitem-tooltip\" matTooltipPosition=\"right\" mat-button (click)=\"triggerClick($event)\"\n      [class.o-app-sidenav-viewer-sidenav-item-selected]=\"isActiveItem()\">\n      <mat-icon *ngIf=\"menuItem.icon\">{{ menuItem.icon }}</mat-icon>\n    </a>\n  </li>\n</ng-container>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class]': 'getClass()',
                    '[attr.disabled]': 'disabled'
                },
                styles: [".o-app-sidenav-menu-item .o-user-info-menu-item{cursor:default}.o-app-sidenav-menu-item .o-user-info-menu-item .o-user-info-image{background-repeat:no-repeat;background-position:center;background-size:cover;width:100%;height:200px!important}.o-app-sidenav-menu-item .o-user-info-menu-item .o-user-info-item{padding:0 8px 0 16px}.o-app-sidenav-menu-item .o-user-info-menu-item .o-user-info-name{text-transform:uppercase;font-weight:600}"]
            }] }
];
OAppSidenavMenuItemComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppSidenavMenuItemComponent.prototype, "sidenavOpened", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppSidenavMenuItemComponent.prototype, "disabled", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi1tZW51LWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2FwcC1zaWRlbmF2L21lbnUtaXRlbS9vLWFwcC1zaWRlbmF2LW1lbnUtaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFHUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQVFyRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUN6RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDakUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRXBGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVsRSxNQUFNLENBQUMsTUFBTSxzQ0FBc0MsR0FBRztJQUNwRCxzQkFBc0I7SUFDdEIsK0JBQStCO0lBQy9CLGdDQUFnQztJQUNoQyxVQUFVO0NBQ1gsQ0FBQztBQUVG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TSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkU7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksU0FBUyxHQUFHLHlCQUF5QixDQUFDO1FBQzFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7WUFDdkIsU0FBUyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztTQUN4QztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7OztZQWpQRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsTUFBTSxFQUFFLHNDQUFzQztnQkFDOUMsT0FBTyxFQUFFLHVDQUF1QztnQkFDaEQsMDFEQUF1RDtnQkFFdkQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxJQUFJLEVBQUU7b0JBQ0osU0FBUyxFQUFFLFlBQVk7b0JBQ3ZCLGlCQUFpQixFQUFFLFVBQVU7aUJBQzlCOzthQUNGOzs7WUFsREMsUUFBUTtZQUZSLFVBQVU7WUFGVixpQkFBaUI7O0FBd0VqQjtJQURDLGNBQWMsRUFBRTs7bUVBQ2E7QUFFOUI7SUFEQyxjQUFjLEVBQUU7OzhEQUNTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHtcbiAgTWVudUl0ZW1BY3Rpb24sXG4gIE1lbnVJdGVtTG9jYWxlLFxuICBNZW51SXRlbUxvZ291dCxcbiAgTWVudUl0ZW1Sb3V0ZSxcbiAgTWVudUl0ZW1Vc2VySW5mbyxcbn0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9hcHAtbWVudS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT0FwcExheW91dENvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2xheW91dHMvYXBwLWxheW91dC9vLWFwcC1sYXlvdXQuY29tcG9uZW50JztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9sb2dpbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9Vc2VySW5mb1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9vLXVzZXItaW5mby5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQXBwU2lkZW5hdkNvbXBvbmVudCB9IGZyb20gJy4uL28tYXBwLXNpZGVuYXYuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQVBQX1NJREVOQVZfTUVOVV9JVEVNID0gW1xuICAnbWVudUl0ZW0gOiBtZW51LWl0ZW0nLFxuICAnbWVudUl0ZW1UeXBlIDogbWVudS1pdGVtLXR5cGUnLFxuICAnc2lkZW5hdk9wZW5lZCA6IHNpZGVuYXYtb3BlbmVkJyxcbiAgJ2Rpc2FibGVkJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0FQUF9TSURFTkFWX01FTlVfSVRFTSA9IFtcbiAgJ29uQ2xpY2snXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWFwcC1zaWRlbmF2LW1lbnUtaXRlbScsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19BUFBfU0lERU5BVl9NRU5VX0lURU0sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0FQUF9TSURFTkFWX01FTlVfSVRFTSxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYXBwLXNpZGVuYXYtbWVudS1pdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1hcHAtc2lkZW5hdi1tZW51LWl0ZW0uY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzXSc6ICdnZXRDbGFzcygpJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9BcHBTaWRlbmF2TWVudUl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbG9naW5TZXJ2aWNlOiBMb2dpblNlcnZpY2U7XG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG4gIHByb3RlY3RlZCBvVXNlckluZm9TZXJ2aWNlOiBPVXNlckluZm9TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdXNlckluZm9TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcm90ZWN0ZWQgc2lkZW5hdjogT0FwcFNpZGVuYXZDb21wb25lbnQ7XG4gIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcjtcblxuICBtZW51SXRlbTogYW55OyAvLyBUT0RPIE1lbnVSb290SXRlbTtcbiAgbWVudUl0ZW1UeXBlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNpZGVuYXZPcGVuZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBhcHBTaWRlbmF2VG9nZ2xlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCByb3V0ZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIG9BcHBMYXlvdXRDb21wb25lbnQ6IE9BcHBMYXlvdXRDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnM7XG4gIHByb3RlY3RlZCBtdXRhdGlvbk9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyO1xuXG4gIGhpZGRlbjogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5sb2dpblNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChMb2dpblNlcnZpY2UpO1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoUGVybWlzc2lvbnNTZXJ2aWNlKTtcbiAgICB0aGlzLm9Vc2VySW5mb1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVXNlckluZm9TZXJ2aWNlKTtcbiAgICB0aGlzLnNpZGVuYXYgPSB0aGlzLmluamVjdG9yLmdldChPQXBwU2lkZW5hdkNvbXBvbmVudCk7XG4gICAgdGhpcy5vQXBwTGF5b3V0Q29tcG9uZW50ID0gdGhpcy5pbmplY3Rvci5nZXQoT0FwcExheW91dENvbXBvbmVudCk7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICAgIHRoaXMucm91dGVyU3Vic2NyaXB0aW9uID0gdGhpcy5yb3V0ZXIuZXZlbnRzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucGFyc2VQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmlzVXNlckluZm9JdGVtKCkgJiYgdGhpcy5zaWRlbmF2KSB7XG4gICAgICB0aGlzLnNldFVzZXJJbmZvSW1hZ2UoKTtcbiAgICAgIHRoaXMuYXBwU2lkZW5hdlRvZ2dsZVN1YnNjcmlwdGlvbiA9IHRoaXMuc2lkZW5hdi5vblNpZGVuYXZPcGVuZWRDaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc2lkZW5hdi5zaWRlbmF2Lm9wZW5lZCkge1xuICAgICAgICAgIHRoaXMuc2V0VXNlckluZm9JbWFnZSgpO1xuICAgICAgICAgIHRoaXMuc2V0VXNlckluZm9JbWFnZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMudXNlckluZm9TdWJzY3JpcHRpb24gPSB0aGlzLm9Vc2VySW5mb1NlcnZpY2UuZ2V0VXNlckluZm9PYnNlcnZhYmxlKCkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChyZXMuYXZhdGFyKSAmJiB0aGlzLnNpZGVuYXYuc2lkZW5hdi5vcGVuZWQpIHtcbiAgICAgICAgICAodGhpcy5tZW51SXRlbSBhcyBNZW51SXRlbVVzZXJJbmZvKS5hdmF0YXIgPSByZXMuYXZhdGFyO1xuICAgICAgICAgIHRoaXMuc2V0VXNlckluZm9JbWFnZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5hcHBTaWRlbmF2VG9nZ2xlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmFwcFNpZGVuYXZUb2dnbGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucm91dGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJvdXRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VySW5mb1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy51c2VySW5mb1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZVBlcm1pc3Npb25zKCkge1xuICAgIC8vIGlmIG9hdHRyIGluIGZvcm0sIGl0IGNhbiBoYXZlIHBlcm1pc3Npb25zXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlLmdldE1lbnVQZXJtaXNzaW9ucyh0aGlzLm1lbnVJdGVtLmlkKTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaGlkZGVuID0gdGhpcy5wZXJtaXNzaW9ucy52aXNpYmxlID09PSBmYWxzZTtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIC8vIGlmIHRoZSBkaXNhYmxlZCBpbnB1dCBpcyB0cnVlIGl0IG1lYW5zIHRoYXQgaXRzIHBhcmVudCBpcyBkaXNhYmxlZCB1c2luZyBwZXJtaXNzaW9uc1xuICAgICAgdGhpcy5kaXNhYmxlZCA9IHRoaXMucGVybWlzc2lvbnMuZW5hYmxlZCA9PT0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlciA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbSh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgICAgY2hlY2tTdHJpbmdWYWx1ZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldFVzZXJJbmZvSW1hZ2UoKSB7XG4gICAgY29uc3QgaW1nRWwgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnby11c2VyLWluZm8taW1hZ2UnKVswXTtcbiAgICBpZiAoaW1nRWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgaXRlbSA9IHRoaXMubWVudUl0ZW0gYXMgTWVudUl0ZW1Vc2VySW5mbztcbiAgICAgIGltZ0VsLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcJycgKyBpdGVtLmF2YXRhciArICdcXCcpJyk7XG4gICAgfVxuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZXhlY3V0ZUl0ZW1BY3Rpb24oKSB7XG4gICAgY29uc3QgYWN0aW9uSXRlbSA9ICh0aGlzLm1lbnVJdGVtIGFzIE1lbnVJdGVtQWN0aW9uKTtcbiAgICBpZiAoVXRpbC5wYXJzZUJvb2xlYW4oYWN0aW9uSXRlbS5jb25maXJtLCBmYWxzZSkpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgYWN0aW9uSXRlbS5jb25maXJtVGV4dCB8fCAnTUVTU0FHRVMuQ09ORklSTV9BQ1RJT04nKS50aGVuKHJlc3VsdCA9PiByZXN1bHQgPyBhY3Rpb25JdGVtLmFjdGlvbigpIDogbnVsbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbkl0ZW0uYWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlndXJlSTE4bigpIHtcbiAgICBjb25zdCBsb2NhbGVJdGVtID0gKHRoaXMubWVudUl0ZW0gYXMgTWVudUl0ZW1Mb2NhbGUpO1xuICAgIGlmICh0aGlzLmlzQ29uZmlndXJlZExhbmcoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UudXNlKGxvY2FsZUl0ZW0ubG9jYWxlKTtcbiAgICB9XG4gIH1cblxuICBpc0NvbmZpZ3VyZWRMYW5nKCkge1xuICAgIGNvbnN0IGxvY2FsZUl0ZW0gPSAodGhpcy5tZW51SXRlbSBhcyBNZW51SXRlbUxvY2FsZSk7XG4gICAgaWYgKHRoaXMudHJhbnNsYXRlU2VydmljZSkge1xuICAgICAgcmV0dXJuICh0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0Q3VycmVudExhbmcoKSA9PT0gbG9jYWxlSXRlbS5sb2NhbGUpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgY29uc3QgbWVudUl0ZW0gPSAodGhpcy5tZW51SXRlbSBhcyBNZW51SXRlbUxvZ291dCk7XG4gICAgaWYgKFV0aWwucGFyc2VCb29sZWFuKG1lbnVJdGVtLmNvbmZpcm0sIHRydWUpKSB7XG4gICAgICB0aGlzLmxvZ2luU2VydmljZS5sb2dvdXRXaXRoQ29uZmlybWF0aW9uQW5kUmVkaXJlY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2dpblNlcnZpY2UubG9nb3V0QW5kUmVkaXJlY3QoKTtcbiAgICB9XG4gIH1cblxuICBuYXZpZ2F0ZSgpIHtcbiAgICBjb25zdCByb3V0ZSA9ICh0aGlzLm1lbnVJdGVtIGFzIE1lbnVJdGVtUm91dGUpLnJvdXRlO1xuICAgIGlmICh0aGlzLnJvdXRlci51cmwgIT09IHJvdXRlKSB7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcm91dGVdKTtcbiAgICB9XG4gIH1cblxuICB0cmlnZ2VyQ2xpY2soZTogRXZlbnQpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzd2l0Y2ggKHRoaXMubWVudUl0ZW1UeXBlKSB7XG4gICAgICBjYXNlICdhY3Rpb24nOlxuICAgICAgICB0aGlzLmV4ZWN1dGVJdGVtQWN0aW9uKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbG9jYWxlJzpcbiAgICAgICAgdGhpcy5jb25maWd1cmVJMThuKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbG9nb3V0JzpcbiAgICAgICAgdGhpcy5sb2dvdXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3V0ZSc6XG4gICAgICAgIHRoaXMubmF2aWdhdGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5vbkNsaWNrLmVtaXQoZSk7XG4gIH1cblxuICBpc1JvdXRlSXRlbSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tZW51SXRlbVR5cGUgPT09ICdyb3V0ZSc7XG4gIH1cblxuICBpc0FjdGlvbkl0ZW0oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubWVudUl0ZW1UeXBlID09PSAnYWN0aW9uJztcbiAgfVxuXG4gIGlzTG9jYWxlSXRlbSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tZW51SXRlbVR5cGUgPT09ICdsb2NhbGUnO1xuICB9XG5cbiAgaXNMb2dvdXRJdGVtKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1lbnVJdGVtVHlwZSA9PT0gJ2xvZ291dCc7XG4gIH1cblxuICBpc1VzZXJJbmZvSXRlbSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tZW51SXRlbVR5cGUgPT09ICd1c2VyLWluZm8nO1xuICB9XG5cbiAgaXNEZWZhdWx0SXRlbSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tZW51SXRlbVR5cGUgPT09ICdkZWZhdWx0JztcbiAgfVxuXG4gIGdldCB1c2VGbGFnSWNvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub0FwcExheW91dENvbXBvbmVudCAmJiB0aGlzLm9BcHBMYXlvdXRDb21wb25lbnQudXNlRmxhZ0ljb25zO1xuICB9XG5cbiAgaXNBY3RpdmVJdGVtKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pc1JvdXRlSXRlbSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHJvdXRlID0gKHRoaXMubWVudUl0ZW0gYXMgTWVudUl0ZW1Sb3V0ZSkucm91dGU7XG4gICAgcmV0dXJuIHRoaXMucm91dGVyLnVybCA9PT0gcm91dGUgfHwgdGhpcy5yb3V0ZXIudXJsLnN0YXJ0c1dpdGgocm91dGUgKyAnLycpO1xuICB9XG5cbiAgZ2V0IHRvb2x0aXAoKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCh0aGlzLm1lbnVJdGVtLm5hbWUpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1lbnVJdGVtLnRvb2x0aXApKSB7XG4gICAgICByZXN1bHQgKz0gJzogJyArIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy5tZW51SXRlbS50b29sdGlwKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldENsYXNzKCkge1xuICAgIGxldCBjbGFzc05hbWUgPSAnby1hcHAtc2lkZW5hdi1tZW51LWl0ZW0nO1xuICAgIGlmICh0aGlzLm1lbnVJdGVtLmNsYXNzKSB7XG4gICAgICBjbGFzc05hbWUgKz0gJyAnICsgdGhpcy5tZW51SXRlbS5jbGFzcztcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbiAgfVxuXG59XG4iXX0=