import { EventEmitter, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../config/app-config';
import { DialogService } from '../services/dialog.service';
import { PermissionsService } from '../services/permissions/permissions.service';
import { ORemoteConfigurationService } from '../services/remote-config.service';
import { ObservableWrapper } from '../util/async';
import { Codes } from '../util/codes';
import { ServiceUtils } from '../util/service.utils';
import { LoginStorageService } from './login-storage.service';
import { OntimizeService } from './ontimize/ontimize.service';
import * as i0 from "@angular/core";
var LoginService = (function () {
    function LoginService(injector) {
        this.injector = injector;
        this.onLogin = new EventEmitter();
        this.onLogout = new EventEmitter();
        this._config = this.injector.get(AppConfig).getConfiguration();
        this.router = this.injector.get(Router);
        this.loginStorageService = this.injector.get(LoginStorageService);
        var sessionInfo = this.loginStorageService.getSessionInfo();
        if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
            this._user = sessionInfo.user;
        }
        this.dialogService = injector.get(DialogService);
    }
    Object.defineProperty(LoginService.prototype, "user", {
        get: function () {
            return this._user;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoginService.prototype, "localStorageKey", {
        get: function () {
            return this.loginStorageService._localStorageKey;
        },
        enumerable: true,
        configurable: true
    });
    LoginService.prototype.configureOntimizeAuthService = function (config) {
        this.ontService = this.injector.get(OntimizeService);
        var servConf = {};
        servConf[Codes.SESSION_KEY] = this.loginStorageService.getSessionInfo();
        this.ontService.configureService(servConf);
    };
    LoginService.prototype.retrieveAuthService = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.ontService !== undefined) {
                resolve(_this.ontService);
            }
            else {
                _this.configureOntimizeAuthService(_this._config);
                resolve(_this.ontService);
            }
        });
    };
    LoginService.prototype.login = function (user, password) {
        var _this = this;
        this._user = user;
        var dataObservable = new Observable(function (observer) {
            _this.retrieveAuthService().then(function (service) {
                service.startsession(user, password).subscribe(function (resp) {
                    _this.onLoginSuccess(resp);
                    var permissionsService = _this.injector.get(PermissionsService);
                    var remoteConfigService = _this.injector.get(ORemoteConfigurationService);
                    var pendingArray = [];
                    pendingArray.push(permissionsService.getUserPermissionsAsPromise());
                    pendingArray.push(remoteConfigService.initialize());
                    combineLatest(pendingArray).subscribe(function () {
                        observer.next();
                        observer.complete();
                    });
                }, function (error) {
                    _this.onLoginError(error);
                    observer.error(error);
                });
            });
        });
        return dataObservable.pipe(share());
    };
    LoginService.prototype.onLoginSuccess = function (sessionId) {
        var session = {
            user: this._user,
            id: sessionId
        };
        this.loginStorageService.storeSessionInfo(session);
        ObservableWrapper.callEmit(this.onLogin, session);
    };
    LoginService.prototype.onLoginError = function (error) {
        this.dialogService.alert('ERROR', 'MESSAGES.ERROR_LOGIN');
    };
    LoginService.prototype.logout = function () {
        var _this = this;
        ObservableWrapper.callEmit(this.onLogout, null);
        var sessionInfo = this.loginStorageService.getSessionInfo();
        var dataObservable = new Observable(function (innerObserver) {
            _this.retrieveAuthService().then(function (service) {
                service.endsession(sessionInfo.user, sessionInfo.id).subscribe(function (resp) {
                    var remoteConfigService = _this.injector.get(ORemoteConfigurationService);
                    remoteConfigService.finalize().subscribe(function () {
                        _this.onLogoutSuccess(resp);
                        innerObserver.next();
                        innerObserver.complete();
                    });
                }, function (error) {
                    _this.onLogoutError(error);
                    innerObserver.error(error);
                });
            });
        });
        return dataObservable.pipe(share());
    };
    LoginService.prototype.onLogoutSuccess = function (sessionId) {
        if (sessionId === 0) {
            this.sessionExpired();
        }
    };
    LoginService.prototype.onLogoutError = function (error) {
        console.error('Error on logout');
    };
    LoginService.prototype.sessionExpired = function () {
        this.loginStorageService.sessionExpired();
    };
    LoginService.prototype.isLoggedIn = function () {
        return this.loginStorageService.isLoggedIn();
    };
    LoginService.prototype.logoutAndRedirect = function () {
        var _this = this;
        this.logout().subscribe(function () {
            ServiceUtils.redirectLogin(_this.router, false);
        });
    };
    LoginService.prototype.logoutWithConfirmationAndRedirect = function () {
        var _this = this;
        this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(function (res) {
            if (res) {
                _this.logoutAndRedirect();
            }
        });
    };
    LoginService.prototype.getSessionInfo = function () {
        return this.loginStorageService.getSessionInfo();
    };
    LoginService.prototype.storeSessionInfo = function (info) {
        this.loginStorageService.storeSessionInfo(info);
    };
    LoginService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    LoginService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    LoginService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LoginService_Factory() { return new LoginService(i0.ɵɵinject(i0.INJECTOR)); }, token: LoginService, providedIn: "root" });
    return LoginService;
}());
export { LoginService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvbG9naW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBR2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBRTlEO0lBZUUsc0JBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFWakMsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hELGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVV0RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENB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QUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFTSx3Q0FBaUIsR0FBeEI7UUFBQSxpQkFJQztRQUhDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDdEIsWUFBWSxDQUFDLGFBQWEsQ0FBQyxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLHdEQUFpQyxHQUF4QztRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUN2RSxJQUFJLEdBQUcsRUFBRTtnQkFDUCxLQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLHFDQUFjLEdBQXJCO1FBQ0UsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVNLHVDQUFnQixHQUF2QixVQUF3QixJQUFpQjtRQUN2QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7Z0JBckpGLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OztnQkFyQmtDLFFBQVE7Ozt1QkFBM0M7Q0F5S0MsQUF0SkQsSUFzSkM7U0FuSlksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciwgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzaGFyZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQXBwQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2FwcC1jb25maWcnO1xuaW1wb3J0IHsgSUF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9hdXRoLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IElMb2dpblNlcnZpY2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2xvZ2luLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IE9SZW1vdGVDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3JlbW90ZS1jb25maWcuc2VydmljZSc7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi90eXBlcy9jb25maWcudHlwZSc7XG5pbXBvcnQgeyBTZXNzaW9uSW5mbyB9IGZyb20gJy4uL3R5cGVzL3Nlc3Npb24taW5mby50eXBlJztcbmltcG9ydCB7IE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IExvZ2luU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuL2xvZ2luLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2UgfSBmcm9tICcuL29udGltaXplL29udGltaXplLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBMb2dpblNlcnZpY2UgaW1wbGVtZW50cyBJTG9naW5TZXJ2aWNlIHtcblxuICBwdWJsaWMgb25Mb2dpbjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkxvZ291dDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBfdXNlcjogc3RyaW5nO1xuICBwcml2YXRlIF9jb25maWc6IENvbmZpZztcbiAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcjtcbiAgcHJpdmF0ZSBvbnRTZXJ2aWNlOiBPbnRpbWl6ZVNlcnZpY2U7XG4gIHByaXZhdGUgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJpdmF0ZSBsb2dpblN0b3JhZ2VTZXJ2aWNlOiBMb2dpblN0b3JhZ2VTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLmluamVjdG9yLmdldChBcHBDb25maWcpLmdldENvbmZpZ3VyYXRpb24oKTtcbiAgICB0aGlzLnJvdXRlciA9IHRoaXMuaW5qZWN0b3IuZ2V0KFJvdXRlcik7XG4gICAgdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9naW5TdG9yYWdlU2VydmljZSk7XG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgICBpZiAoc2Vzc2lvbkluZm8gJiYgc2Vzc2lvbkluZm8uaWQgJiYgc2Vzc2lvbkluZm8udXNlciAmJiBzZXNzaW9uSW5mby51c2VyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX3VzZXIgPSBzZXNzaW9uSW5mby51c2VyO1xuICAgIH1cbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHVzZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlcjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbG9jYWxTdG9yYWdlS2V5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5fbG9jYWxTdG9yYWdlS2V5O1xuICB9XG5cbiAgcHVibGljIGNvbmZpZ3VyZU9udGltaXplQXV0aFNlcnZpY2UoY29uZmlnOiBvYmplY3QpOiB2b2lkIHtcbiAgICB0aGlzLm9udFNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPbnRpbWl6ZVNlcnZpY2UpO1xuICAgIGNvbnN0IHNlcnZDb25mID0ge307XG4gICAgc2VydkNvbmZbQ29kZXMuU0VTU0lPTl9LRVldID0gdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25JbmZvKCk7XG4gICAgdGhpcy5vbnRTZXJ2aWNlLmNvbmZpZ3VyZVNlcnZpY2Uoc2VydkNvbmYpO1xuICB9XG5cbiAgcHVibGljIHJldHJpZXZlQXV0aFNlcnZpY2UoKTogUHJvbWlzZTxJQXV0aFNlcnZpY2U+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SUF1dGhTZXJ2aWNlPihyZXNvbHZlID0+IHtcbiAgICAgIGlmICh0aGlzLm9udFNlcnZpY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXNvbHZlKHRoaXMub250U2VydmljZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbmZpZ3VyZU9udGltaXplQXV0aFNlcnZpY2UodGhpcy5fY29uZmlnKTtcbiAgICAgICAgcmVzb2x2ZSh0aGlzLm9udFNlcnZpY2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGxvZ2luKHVzZXI6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgdGhpcy5fdXNlciA9IHVzZXI7XG4gICAgY29uc3QgZGF0YU9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PiA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMucmV0cmlldmVBdXRoU2VydmljZSgpLnRoZW4oc2VydmljZSA9PiB7XG4gICAgICAgIHNlcnZpY2Uuc3RhcnRzZXNzaW9uKHVzZXIsIHBhc3N3b3JkKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICAgICAgdGhpcy5vbkxvZ2luU3VjY2VzcyhyZXNwKTtcbiAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuICAgICAgICAgIGNvbnN0IHJlbW90ZUNvbmZpZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPUmVtb3RlQ29uZmlndXJhdGlvblNlcnZpY2UpO1xuICAgICAgICAgIGNvbnN0IHBlbmRpbmdBcnJheSA9IFtdO1xuICAgICAgICAgIHBlbmRpbmdBcnJheS5wdXNoKHBlcm1pc3Npb25zU2VydmljZS5nZXRVc2VyUGVybWlzc2lvbnNBc1Byb21pc2UoKSk7XG4gICAgICAgICAgcGVuZGluZ0FycmF5LnB1c2gocmVtb3RlQ29uZmlnU2VydmljZS5pbml0aWFsaXplKCkpO1xuICAgICAgICAgIGNvbWJpbmVMYXRlc3QocGVuZGluZ0FycmF5KS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgIHRoaXMub25Mb2dpbkVycm9yKGVycm9yKTtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGFPYnNlcnZhYmxlLnBpcGUoc2hhcmUoKSk7XG4gIH1cblxuICBwdWJsaWMgb25Mb2dpblN1Y2Nlc3Moc2Vzc2lvbklkOiBzdHJpbmcgfCBudW1iZXIpOiB2b2lkIHtcbiAgICAvLyBzYXZlIHVzZXIgYW5kIHNlc3Npb25pZCBpbnRvIGxvY2FsIHN0b3JhZ2VcbiAgICBjb25zdCBzZXNzaW9uID0ge1xuICAgICAgdXNlcjogdGhpcy5fdXNlcixcbiAgICAgIGlkOiBzZXNzaW9uSWRcbiAgICB9O1xuICAgIHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5zdG9yZVNlc3Npb25JbmZvKHNlc3Npb24pO1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Mb2dpbiwgc2Vzc2lvbik7XG4gIH1cblxuICBwdWJsaWMgb25Mb2dpbkVycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX0xPR0lOJyk7XG4gIH1cblxuICBwdWJsaWMgbG9nb3V0KCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkxvZ291dCwgbnVsbCk7XG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+ID0gbmV3IE9ic2VydmFibGUoaW5uZXJPYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLnJldHJpZXZlQXV0aFNlcnZpY2UoKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICBzZXJ2aWNlLmVuZHNlc3Npb24oc2Vzc2lvbkluZm8udXNlciwgc2Vzc2lvbkluZm8uaWQpLnN1YnNjcmliZShyZXNwID0+IHtcbiAgICAgICAgICBjb25zdCByZW1vdGVDb25maWdTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlKTtcbiAgICAgICAgICByZW1vdGVDb25maWdTZXJ2aWNlLmZpbmFsaXplKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Mb2dvdXRTdWNjZXNzKHJlc3ApO1xuICAgICAgICAgICAgaW5uZXJPYnNlcnZlci5uZXh0KCk7XG4gICAgICAgICAgICBpbm5lck9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICB0aGlzLm9uTG9nb3V0RXJyb3IoZXJyb3IpO1xuICAgICAgICAgIGlubmVyT2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgcHVibGljIG9uTG9nb3V0U3VjY2VzcyhzZXNzaW9uSWQ6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChzZXNzaW9uSWQgPT09IDApIHtcbiAgICAgIHRoaXMuc2Vzc2lvbkV4cGlyZWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25Mb2dvdXRFcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3Igb24gbG9nb3V0Jyk7XG4gIH1cblxuICBwdWJsaWMgc2Vzc2lvbkV4cGlyZWQoKTogdm9pZCB7XG4gICAgdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLnNlc3Npb25FeHBpcmVkKCk7XG4gIH1cblxuICBwdWJsaWMgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLmlzTG9nZ2VkSW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2dvdXRBbmRSZWRpcmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ291dCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBTZXJ2aWNlVXRpbHMucmVkaXJlY3RMb2dpbih0aGlzLnJvdXRlciwgZmFsc2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGxvZ291dFdpdGhDb25maXJtYXRpb25BbmRSZWRpcmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0xPR09VVCcpLnRoZW4ocmVzID0+IHtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgdGhpcy5sb2dvdXRBbmRSZWRpcmVjdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldFNlc3Npb25JbmZvKCk6IFNlc3Npb25JbmZvIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLmdldFNlc3Npb25JbmZvKCk7XG4gIH1cblxuICBwdWJsaWMgc3RvcmVTZXNzaW9uSW5mbyhpbmZvOiBTZXNzaW9uSW5mbyk6IHZvaWQge1xuICAgIHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5zdG9yZVNlc3Npb25JbmZvKGluZm8pO1xuICB9XG59XG4iXX0=