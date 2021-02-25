import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { OUserInfoService } from '../services/o-user-info.service';
import { Codes } from '../util/codes';
import { LoginStorageService } from './login-storage.service';
import { PermissionsService } from './permissions/permissions.service';
import * as i0 from "@angular/core";
var AuthGuardService = (function () {
    function AuthGuardService(injector) {
        this.injector = injector;
        this.router = this.injector.get(Router);
        this.loginStorageService = this.injector.get(LoginStorageService);
        this.oUserInfoService = this.injector.get(OUserInfoService);
        this.permissionsService = this.injector.get(PermissionsService);
    }
    AuthGuardService.prototype.canActivate = function (next, state) {
        var isLoggedIn = this.loginStorageService.isLoggedIn();
        var result = isLoggedIn;
        if (!isLoggedIn) {
            this.permissionsService.restart();
            this.router.navigate([Codes.LOGIN_ROUTE]);
        }
        if (isLoggedIn) {
            this.setUserInformation();
            if (!this.permissionsService.hasPermissions()) {
                result = this.permissionsService.getUserPermissionsAsPromise();
            }
        }
        return result;
    };
    AuthGuardService.prototype.setUserInformation = function () {
        var sessionInfo = this.loginStorageService.getSessionInfo();
        this.oUserInfoService.setUserInfo({
            username: sessionInfo.user,
            avatar: './assets/images/user_profile.png'
        });
    };
    AuthGuardService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    AuthGuardService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    AuthGuardService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function AuthGuardService_Factory() { return new AuthGuardService(i0.ɵɵinject(i0.INJECTOR)); }, token: AuthGuardService, providedIn: "root" });
    return AuthGuardService;
}());
export { AuthGuardService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1ndWFyZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9hdXRoLWd1YXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUF1QyxNQUFNLEVBQXVCLE1BQU0saUJBQWlCLENBQUM7QUFFbkcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFFdkU7SUFVRSwwQkFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxzQ0FBVyxHQUFYLFVBQVksSUFBNEIsRUFBRSxLQUEwQjtRQUNsRSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDekQsSUFBSSxNQUFNLEdBQStCLFVBQVUsQ0FBQztRQUNwRCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFDRCxJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQzdDLE1BQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCLEVBQUUsQ0FBQzthQUNoRTtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELDZDQUFrQixHQUFsQjtRQUNFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUU5RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO1lBQ2hDLFFBQVEsRUFBRSxXQUFXLENBQUMsSUFBSTtZQUMxQixNQUFNLEVBQUUsa0NBQWtDO1NBQzNDLENBQUMsQ0FBQztJQUNMLENBQUM7O2dCQXhDRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Z0JBVm9CLFFBQVE7OzsyQkFBN0I7Q0FpREMsQUF6Q0QsSUF5Q0M7U0F0Q1ksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlLCBSb3V0ZXIsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBPVXNlckluZm9TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvby11c2VyLWluZm8uc2VydmljZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgTG9naW5TdG9yYWdlU2VydmljZSB9IGZyb20gJy4vbG9naW4tc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4vcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEF1dGhHdWFyZFNlcnZpY2UgaW1wbGVtZW50cyBDYW5BY3RpdmF0ZSB7XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBwcm90ZWN0ZWQgbG9naW5TdG9yYWdlU2VydmljZTogTG9naW5TdG9yYWdlU2VydmljZTtcbiAgcHJvdGVjdGVkIG9Vc2VySW5mb1NlcnZpY2U6IE9Vc2VySW5mb1NlcnZpY2U7XG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uc1NlcnZpY2U6IFBlcm1pc3Npb25zU2VydmljZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICAgIHRoaXMubG9naW5TdG9yYWdlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvZ2luU3RvcmFnZVNlcnZpY2UpO1xuICAgIHRoaXMub1VzZXJJbmZvU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Vc2VySW5mb1NlcnZpY2UpO1xuICAgIHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoUGVybWlzc2lvbnNTZXJ2aWNlKTtcbiAgfVxuXG4gIGNhbkFjdGl2YXRlKG5leHQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogUHJvbWlzZTxib29sZWFuPiB8IGJvb2xlYW4ge1xuICAgIGNvbnN0IGlzTG9nZ2VkSW4gPSB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UuaXNMb2dnZWRJbigpO1xuICAgIGxldCByZXN1bHQ6IFByb21pc2U8Ym9vbGVhbj4gfCBib29sZWFuID0gaXNMb2dnZWRJbjtcbiAgICBpZiAoIWlzTG9nZ2VkSW4pIHtcbiAgICAgIHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlLnJlc3RhcnQoKTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtDb2Rlcy5MT0dJTl9ST1VURV0pO1xuICAgIH1cbiAgICBpZiAoaXNMb2dnZWRJbikge1xuICAgICAgdGhpcy5zZXRVc2VySW5mb3JtYXRpb24oKTtcbiAgICAgIGlmICghdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UuaGFzUGVybWlzc2lvbnMoKSkge1xuICAgICAgICByZXN1bHQgPSB0aGlzLnBlcm1pc3Npb25zU2VydmljZS5nZXRVc2VyUGVybWlzc2lvbnNBc1Byb21pc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNldFVzZXJJbmZvcm1hdGlvbigpIHtcbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgIC8vIFRPRE8gcXVlcnkgdXNlciBpbmZvcm1hdGlvblxuICAgIHRoaXMub1VzZXJJbmZvU2VydmljZS5zZXRVc2VySW5mbyh7XG4gICAgICB1c2VybmFtZTogc2Vzc2lvbkluZm8udXNlcixcbiAgICAgIGF2YXRhcjogJy4vYXNzZXRzL2ltYWdlcy91c2VyX3Byb2ZpbGUucG5nJ1xuICAgIH0pO1xuICB9XG59XG4iXX0=