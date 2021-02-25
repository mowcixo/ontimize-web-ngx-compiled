import { Component, ElementRef, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { LoginService } from '../../services/login.service';
import { OUserInfoService } from '../../services/o-user-info.service';
export const DEFAULT_INPUTS_O_USER_INFO = [];
export const DEFAULT_OUTPUTS_O_USER_INFO = [];
export class OUserInfoComponent {
    constructor(elRef, injector, router) {
        this.elRef = elRef;
        this.injector = injector;
        this.router = router;
        this.dialogService = this.injector.get(DialogService);
        this.loginService = this.injector.get(LoginService);
        this.oUserInfoService = this.injector.get(OUserInfoService);
        this.userInfo = this.oUserInfoService.getUserInfo();
        this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
            this.userInfo = res;
        });
    }
    ngOnDestroy() {
        this.userInfoSubscription.unsubscribe();
    }
    onLogoutClick() {
        this.loginService.logoutWithConfirmationAndRedirect();
    }
    onSettingsClick() {
        this.router.navigate(['main/settings']);
    }
    get existsUserInfo() {
        return this.userInfo !== undefined;
    }
    get avatar() {
        return this.userInfo ? this.userInfo.avatar : undefined;
    }
    get username() {
        return this.userInfo ? this.userInfo.username : undefined;
    }
}
OUserInfoComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-user-info',
                inputs: DEFAULT_INPUTS_O_USER_INFO,
                outputs: DEFAULT_OUTPUTS_O_USER_INFO,
                template: "<div class=\"o-user-info-container\" fxLayout=\"row\" fxLayoutAlign=\"center\">\n  <ng-container *ngIf=\"existsUserInfo\">\n    <div class=\"o-user-info-wrapper\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <div fxLayout=\"row\" fxLayoutAlign=\"center center\" class=\"o-user-info-avatar-wrapper\">\n        <img [src]=\"avatar\" *ngIf=\"avatar\" />\n      </div>\n      <span class=\"o-user-info-username\" *ngIf=\"username\"> {{ username }}</span>\n      <mat-icon [matMenuTriggerFor]=\"menu\" svgIcon=\"ontimize:keyboard_arrow_down\"></mat-icon>\n    </div>\n    <mat-menu #menu=\"matMenu\" yPosition=\"below\">\n      <button type=\"button\" mat-menu-item (click)=\"onSettingsClick()\">\n        <mat-icon svgIcon=\"ontimize:settings\"></mat-icon>\n        <span>{{ 'SETTINGS' | oTranslate }}</span>\n      </button>\n      <button type=\"button\" mat-menu-item (click)=\"onLogoutClick()\">\n        <mat-icon svgIcon=\"ontimize:power_settings_new\"></mat-icon>\n        <span>{{ 'LOGOUT' | oTranslate }}</span>\n      </button>\n    </mat-menu>\n  </ng-container>\n</div>\n",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-user-info]': 'true'
                },
                styles: [".o-user-info .o-user-info-container{cursor:pointer;height:100%}.o-user-info .o-user-info-avatar-wrapper{width:30px;height:30px;overflow:hidden;border-radius:100%}.o-user-info .o-user-info-avatar-wrapper img{max-width:100%;height:auto}.o-user-info .o-user-info-username{padding-left:6px}.o-user-info mat-icon{padding-left:4px;font-size:16px;line-height:26px}"]
            }] }
];
OUserInfoComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: Router }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby11c2VyLWluZm8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3VzZXItaW5mby9vLXVzZXItaW5mby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFhLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBWSxNQUFNLG9DQUFvQyxDQUFDO0FBRWhGLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztBQUU3QyxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7QUFhOUMsTUFBTSxPQUFPLGtCQUFrQjtJQVM3QixZQUNZLEtBQWlCLEVBQ2pCLFFBQWtCLEVBQ2xCLE1BQWM7UUFGZCxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUV4QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN4RixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzFELENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDNUQsQ0FBQzs7O1lBekRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsTUFBTSxFQUFFLDBCQUEwQjtnQkFDbEMsT0FBTyxFQUFFLDJCQUEyQjtnQkFDcEMsK2tDQUEyQztnQkFFM0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixxQkFBcUIsRUFBRSxNQUFNO2lCQUM5Qjs7YUFDRjs7O1lBdEJtQixVQUFVO1lBQUUsUUFBUTtZQUMvQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3RvciwgT25EZXN0cm95LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9naW5TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbG9naW4uc2VydmljZSc7XG5pbXBvcnQgeyBPVXNlckluZm9TZXJ2aWNlLCBVc2VySW5mbyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL28tdXNlci1pbmZvLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19VU0VSX0lORk8gPSBbXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1VTRVJfSU5GTyA9IFtdO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXVzZXItaW5mbycsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19VU0VSX0lORk8sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1VTRVJfSU5GTyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdXNlci1pbmZvLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby11c2VyLWluZm8uY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby11c2VyLWluZm9dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1VzZXJJbmZvQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIGxvZ2luU2VydmljZTogTG9naW5TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgb1VzZXJJbmZvU2VydmljZTogT1VzZXJJbmZvU2VydmljZTtcblxuICB1c2VySW5mb1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgdXNlckluZm86IFVzZXJJbmZvO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlclxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLmxvZ2luU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvZ2luU2VydmljZSk7XG4gICAgdGhpcy5vVXNlckluZm9TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1VzZXJJbmZvU2VydmljZSk7XG5cbiAgICB0aGlzLnVzZXJJbmZvID0gdGhpcy5vVXNlckluZm9TZXJ2aWNlLmdldFVzZXJJbmZvKCk7XG4gICAgdGhpcy51c2VySW5mb1N1YnNjcmlwdGlvbiA9IHRoaXMub1VzZXJJbmZvU2VydmljZS5nZXRVc2VySW5mb09ic2VydmFibGUoKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMudXNlckluZm8gPSByZXM7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnVzZXJJbmZvU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBvbkxvZ291dENsaWNrKCkge1xuICAgIHRoaXMubG9naW5TZXJ2aWNlLmxvZ291dFdpdGhDb25maXJtYXRpb25BbmRSZWRpcmVjdCgpO1xuICB9XG5cbiAgb25TZXR0aW5nc0NsaWNrKCkge1xuICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFsnbWFpbi9zZXR0aW5ncyddKTtcbiAgfVxuXG4gIGdldCBleGlzdHNVc2VySW5mbygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy51c2VySW5mbyAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IGF2YXRhcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnVzZXJJbmZvID8gdGhpcy51c2VySW5mby5hdmF0YXIgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXQgdXNlcm5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy51c2VySW5mbyA/IHRoaXMudXNlckluZm8udXNlcm5hbWUgOiB1bmRlZmluZWQ7XG4gIH1cblxufVxuIl19