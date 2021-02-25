import { Component, ElementRef, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { LoginService } from '../../services/login.service';
import { OUserInfoService } from '../../services/o-user-info.service';
export var DEFAULT_INPUTS_O_USER_INFO = [];
export var DEFAULT_OUTPUTS_O_USER_INFO = [];
var OUserInfoComponent = (function () {
    function OUserInfoComponent(elRef, injector, router) {
        var _this = this;
        this.elRef = elRef;
        this.injector = injector;
        this.router = router;
        this.dialogService = this.injector.get(DialogService);
        this.loginService = this.injector.get(LoginService);
        this.oUserInfoService = this.injector.get(OUserInfoService);
        this.userInfo = this.oUserInfoService.getUserInfo();
        this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(function (res) {
            _this.userInfo = res;
        });
    }
    OUserInfoComponent.prototype.ngOnDestroy = function () {
        this.userInfoSubscription.unsubscribe();
    };
    OUserInfoComponent.prototype.onLogoutClick = function () {
        this.loginService.logoutWithConfirmationAndRedirect();
    };
    OUserInfoComponent.prototype.onSettingsClick = function () {
        this.router.navigate(['main/settings']);
    };
    Object.defineProperty(OUserInfoComponent.prototype, "existsUserInfo", {
        get: function () {
            return this.userInfo !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OUserInfoComponent.prototype, "avatar", {
        get: function () {
            return this.userInfo ? this.userInfo.avatar : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OUserInfoComponent.prototype, "username", {
        get: function () {
            return this.userInfo ? this.userInfo.username : undefined;
        },
        enumerable: true,
        configurable: true
    });
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
    OUserInfoComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector },
        { type: Router }
    ]; };
    return OUserInfoComponent;
}());
export { OUserInfoComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby11c2VyLWluZm8uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3VzZXItaW5mby9vLXVzZXItaW5mby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFhLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzVELE9BQU8sRUFBRSxnQkFBZ0IsRUFBWSxNQUFNLG9DQUFvQyxDQUFDO0FBRWhGLE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixHQUFHLEVBQUUsQ0FBQztBQUU3QyxNQUFNLENBQUMsSUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7QUFFOUM7SUFvQkUsNEJBQ1ksS0FBaUIsRUFDakIsUUFBa0IsRUFDbEIsTUFBYztRQUgxQixpQkFhQztRQVpXLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRXhCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUNyRixLQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx3Q0FBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCwwQ0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQ0FBaUMsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFRCw0Q0FBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxzQkFBSSw4Q0FBYzthQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7UUFDckMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSxzQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzFELENBQUM7OztPQUFBO0lBRUQsc0JBQUksd0NBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUM1RCxDQUFDOzs7T0FBQTs7Z0JBekRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsTUFBTSxFQUFFLDBCQUEwQjtvQkFDbEMsT0FBTyxFQUFFLDJCQUEyQjtvQkFDcEMsK2tDQUEyQztvQkFFM0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixxQkFBcUIsRUFBRSxNQUFNO3FCQUM5Qjs7aUJBQ0Y7OztnQkF0Qm1CLFVBQVU7Z0JBQUUsUUFBUTtnQkFDL0IsTUFBTTs7SUFzRWYseUJBQUM7Q0FBQSxBQTNERCxJQTJEQztTQWhEWSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPbkRlc3Ryb3ksIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBMb2dpblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2dpbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9Vc2VySW5mb1NlcnZpY2UsIFVzZXJJbmZvIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvby11c2VyLWluZm8uc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1VTRVJfSU5GTyA9IFtdO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVVNFUl9JTkZPID0gW107XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdXNlci1pbmZvJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1VTRVJfSU5GTyxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVVNFUl9JTkZPLFxuICB0ZW1wbGF0ZVVybDogJy4vby11c2VyLWluZm8uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXVzZXItaW5mby5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXVzZXItaW5mb10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVXNlckluZm9Db21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbG9naW5TZXJ2aWNlOiBMb2dpblNlcnZpY2U7XG4gIHByb3RlY3RlZCBvVXNlckluZm9TZXJ2aWNlOiBPVXNlckluZm9TZXJ2aWNlO1xuXG4gIHVzZXJJbmZvU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCB1c2VySW5mbzogVXNlckluZm87XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyXG4gICkge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMubG9naW5TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9naW5TZXJ2aWNlKTtcbiAgICB0aGlzLm9Vc2VySW5mb1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVXNlckluZm9TZXJ2aWNlKTtcblxuICAgIHRoaXMudXNlckluZm8gPSB0aGlzLm9Vc2VySW5mb1NlcnZpY2UuZ2V0VXNlckluZm8oKTtcbiAgICB0aGlzLnVzZXJJbmZvU3Vic2NyaXB0aW9uID0gdGhpcy5vVXNlckluZm9TZXJ2aWNlLmdldFVzZXJJbmZvT2JzZXJ2YWJsZSgpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgdGhpcy51c2VySW5mbyA9IHJlcztcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMudXNlckluZm9TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG9uTG9nb3V0Q2xpY2soKSB7XG4gICAgdGhpcy5sb2dpblNlcnZpY2UubG9nb3V0V2l0aENvbmZpcm1hdGlvbkFuZFJlZGlyZWN0KCk7XG4gIH1cblxuICBvblNldHRpbmdzQ2xpY2soKSB7XG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoWydtYWluL3NldHRpbmdzJ10pO1xuICB9XG5cbiAgZ2V0IGV4aXN0c1VzZXJJbmZvKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnVzZXJJbmZvICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXQgYXZhdGFyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudXNlckluZm8gPyB0aGlzLnVzZXJJbmZvLmF2YXRhciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldCB1c2VybmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnVzZXJJbmZvID8gdGhpcy51c2VySW5mby51c2VybmFtZSA6IHVuZGVmaW5lZDtcbiAgfVxuXG59XG4iXX0=