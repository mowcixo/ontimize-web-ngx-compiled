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
export class LoginService {
    constructor(injector) {
        this.injector = injector;
        this.onLogin = new EventEmitter();
        this.onLogout = new EventEmitter();
        this._config = this.injector.get(AppConfig).getConfiguration();
        this.router = this.injector.get(Router);
        this.loginStorageService = this.injector.get(LoginStorageService);
        const sessionInfo = this.loginStorageService.getSessionInfo();
        if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
            this._user = sessionInfo.user;
        }
        this.dialogService = injector.get(DialogService);
    }
    get user() {
        return this._user;
    }
    get localStorageKey() {
        return this.loginStorageService._localStorageKey;
    }
    configureOntimizeAuthService(config) {
        this.ontService = this.injector.get(OntimizeService);
        const servConf = {};
        servConf[Codes.SESSION_KEY] = this.loginStorageService.getSessionInfo();
        this.ontService.configureService(servConf);
    }
    retrieveAuthService() {
        return new Promise(resolve => {
            if (this.ontService !== undefined) {
                resolve(this.ontService);
            }
            else {
                this.configureOntimizeAuthService(this._config);
                resolve(this.ontService);
            }
        });
    }
    login(user, password) {
        this._user = user;
        const dataObservable = new Observable(observer => {
            this.retrieveAuthService().then(service => {
                service.startsession(user, password).subscribe(resp => {
                    this.onLoginSuccess(resp);
                    const permissionsService = this.injector.get(PermissionsService);
                    const remoteConfigService = this.injector.get(ORemoteConfigurationService);
                    const pendingArray = [];
                    pendingArray.push(permissionsService.getUserPermissionsAsPromise());
                    pendingArray.push(remoteConfigService.initialize());
                    combineLatest(pendingArray).subscribe(() => {
                        observer.next();
                        observer.complete();
                    });
                }, error => {
                    this.onLoginError(error);
                    observer.error(error);
                });
            });
        });
        return dataObservable.pipe(share());
    }
    onLoginSuccess(sessionId) {
        const session = {
            user: this._user,
            id: sessionId
        };
        this.loginStorageService.storeSessionInfo(session);
        ObservableWrapper.callEmit(this.onLogin, session);
    }
    onLoginError(error) {
        this.dialogService.alert('ERROR', 'MESSAGES.ERROR_LOGIN');
    }
    logout() {
        ObservableWrapper.callEmit(this.onLogout, null);
        const sessionInfo = this.loginStorageService.getSessionInfo();
        const dataObservable = new Observable(innerObserver => {
            this.retrieveAuthService().then(service => {
                service.endsession(sessionInfo.user, sessionInfo.id).subscribe(resp => {
                    const remoteConfigService = this.injector.get(ORemoteConfigurationService);
                    remoteConfigService.finalize().subscribe(() => {
                        this.onLogoutSuccess(resp);
                        innerObserver.next();
                        innerObserver.complete();
                    });
                }, error => {
                    this.onLogoutError(error);
                    innerObserver.error(error);
                });
            });
        });
        return dataObservable.pipe(share());
    }
    onLogoutSuccess(sessionId) {
        if (sessionId === 0) {
            this.sessionExpired();
        }
    }
    onLogoutError(error) {
        console.error('Error on logout');
    }
    sessionExpired() {
        this.loginStorageService.sessionExpired();
    }
    isLoggedIn() {
        return this.loginStorageService.isLoggedIn();
    }
    logoutAndRedirect() {
        this.logout().subscribe(() => {
            ServiceUtils.redirectLogin(this.router, false);
        });
    }
    logoutWithConfirmationAndRedirect() {
        this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
            if (res) {
                this.logoutAndRedirect();
            }
        });
    }
    getSessionInfo() {
        return this.loginStorageService.getSessionInfo();
    }
    storeSessionInfo(info) {
        this.loginStorageService.storeSessionInfo(info);
    }
}
LoginService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
LoginService.ctorParameters = () => [
    { type: Injector }
];
LoginService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LoginService_Factory() { return new LoginService(i0.ɵɵinject(i0.INJECTOR)); }, token: LoginService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvbG9naW4uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHakQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBR2hGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7O0FBSzlELE1BQU0sT0FBTyxZQUFZO0lBWXZCLFlBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFWakMsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hELGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVV0RCxJQUFJLENBQUMsT0FBTyxHQUFHLElB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SUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLGlDQUFpQztRQUN0QyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUUsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDMUI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ25ELENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxJQUFpQjtRQUN2QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7O1lBckpGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBckJrQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBBcHBDb25maWcgfSBmcm9tICcuLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBJQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2F1dGgtc2VydmljZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUxvZ2luU2VydmljZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvbG9naW4tc2VydmljZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvcmVtb3RlLWNvbmZpZy5zZXJ2aWNlJztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL3R5cGVzL2NvbmZpZy50eXBlJztcbmltcG9ydCB7IFNlc3Npb25JbmZvIH0gZnJvbSAnLi4vdHlwZXMvc2Vzc2lvbi1pbmZvLnR5cGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZVdyYXBwZXIgfSBmcm9tICcuLi91dGlsL2FzeW5jJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBTZXJ2aWNlVXRpbHMgfSBmcm9tICcuLi91dGlsL3NlcnZpY2UudXRpbHMnO1xuaW1wb3J0IHsgTG9naW5TdG9yYWdlU2VydmljZSB9IGZyb20gJy4vbG9naW4tc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZSB9IGZyb20gJy4vb250aW1pemUvb250aW1pemUuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luU2VydmljZSBpbXBsZW1lbnRzIElMb2dpblNlcnZpY2Uge1xuXG4gIHB1YmxpYyBvbkxvZ2luOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uTG9nb3V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIF91c2VyOiBzdHJpbmc7XG4gIHByaXZhdGUgX2NvbmZpZzogQ29uZmlnO1xuICBwcml2YXRlIHJvdXRlcjogUm91dGVyO1xuICBwcml2YXRlIG9udFNlcnZpY2U6IE9udGltaXplU2VydmljZTtcbiAgcHJpdmF0ZSBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcml2YXRlIGxvZ2luU3RvcmFnZVNlcnZpY2U6IExvZ2luU3RvcmFnZVNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuX2NvbmZpZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcENvbmZpZykuZ2V0Q29uZmlndXJhdGlvbigpO1xuICAgIHRoaXMucm91dGVyID0gdGhpcy5pbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgICB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChMb2dpblN0b3JhZ2VTZXJ2aWNlKTtcbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgIGlmIChzZXNzaW9uSW5mbyAmJiBzZXNzaW9uSW5mby5pZCAmJiBzZXNzaW9uSW5mby51c2VyICYmIHNlc3Npb25JbmZvLnVzZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fdXNlciA9IHNlc3Npb25JbmZvLnVzZXI7XG4gICAgfVxuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IGluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgdXNlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl91c2VyO1xuICB9XG5cbiAgcHVibGljIGdldCBsb2NhbFN0b3JhZ2VLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLl9sb2NhbFN0b3JhZ2VLZXk7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlT250aW1pemVBdXRoU2VydmljZShjb25maWc6IG9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMub250U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9udGltaXplU2VydmljZSk7XG4gICAgY29uc3Qgc2VydkNvbmYgPSB7fTtcbiAgICBzZXJ2Q29uZltDb2Rlcy5TRVNTSU9OX0tFWV0gPSB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgICB0aGlzLm9udFNlcnZpY2UuY29uZmlndXJlU2VydmljZShzZXJ2Q29uZik7XG4gIH1cblxuICBwdWJsaWMgcmV0cmlldmVBdXRoU2VydmljZSgpOiBQcm9taXNlPElBdXRoU2VydmljZT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxJQXV0aFNlcnZpY2U+KHJlc29sdmUgPT4ge1xuICAgICAgaWYgKHRoaXMub250U2VydmljZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlc29sdmUodGhpcy5vbnRTZXJ2aWNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJlT250aW1pemVBdXRoU2VydmljZSh0aGlzLl9jb25maWcpO1xuICAgICAgICByZXNvbHZlKHRoaXMub250U2VydmljZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbG9naW4odXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICB0aGlzLl91c2VyID0gdXNlcjtcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+ID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgdGhpcy5yZXRyaWV2ZUF1dGhTZXJ2aWNlKCkudGhlbihzZXJ2aWNlID0+IHtcbiAgICAgICAgc2VydmljZS5zdGFydHNlc3Npb24odXNlciwgcGFzc3dvcmQpLnN1YnNjcmliZShyZXNwID0+IHtcbiAgICAgICAgICB0aGlzLm9uTG9naW5TdWNjZXNzKHJlc3ApO1xuICAgICAgICAgIGNvbnN0IHBlcm1pc3Npb25zU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFBlcm1pc3Npb25zU2VydmljZSk7XG4gICAgICAgICAgY29uc3QgcmVtb3RlQ29uZmlnU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9SZW1vdGVDb25maWd1cmF0aW9uU2VydmljZSk7XG4gICAgICAgICAgY29uc3QgcGVuZGluZ0FycmF5ID0gW107XG4gICAgICAgICAgcGVuZGluZ0FycmF5LnB1c2gocGVybWlzc2lvbnNTZXJ2aWNlLmdldFVzZXJQZXJtaXNzaW9uc0FzUHJvbWlzZSgpKTtcbiAgICAgICAgICBwZW5kaW5nQXJyYXkucHVzaChyZW1vdGVDb25maWdTZXJ2aWNlLmluaXRpYWxpemUoKSk7XG4gICAgICAgICAgY29tYmluZUxhdGVzdChwZW5kaW5nQXJyYXkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgdGhpcy5vbkxvZ2luRXJyb3IoZXJyb3IpO1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YU9ic2VydmFibGUucGlwZShzaGFyZSgpKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvZ2luU3VjY2VzcyhzZXNzaW9uSWQ6IHN0cmluZyB8IG51bWJlcik6IHZvaWQge1xuICAgIC8vIHNhdmUgdXNlciBhbmQgc2Vzc2lvbmlkIGludG8gbG9jYWwgc3RvcmFnZVxuICAgIGNvbnN0IHNlc3Npb24gPSB7XG4gICAgICB1c2VyOiB0aGlzLl91c2VyLFxuICAgICAgaWQ6IHNlc3Npb25JZFxuICAgIH07XG4gICAgdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLnN0b3JlU2Vzc2lvbkluZm8oc2Vzc2lvbik7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkxvZ2luLCBzZXNzaW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvZ2luRXJyb3IoZXJyb3I6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfTE9HSU4nKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2dvdXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uTG9nb3V0LCBudWxsKTtcbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgIGNvbnN0IGRhdGFPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPGFueT4gPSBuZXcgT2JzZXJ2YWJsZShpbm5lck9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMucmV0cmlldmVBdXRoU2VydmljZSgpLnRoZW4oc2VydmljZSA9PiB7XG4gICAgICAgIHNlcnZpY2UuZW5kc2Vzc2lvbihzZXNzaW9uSW5mby51c2VyLCBzZXNzaW9uSW5mby5pZCkuc3Vic2NyaWJlKHJlc3AgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlbW90ZUNvbmZpZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPUmVtb3RlQ29uZmlndXJhdGlvblNlcnZpY2UpO1xuICAgICAgICAgIHJlbW90ZUNvbmZpZ1NlcnZpY2UuZmluYWxpemUoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbkxvZ291dFN1Y2Nlc3MocmVzcCk7XG4gICAgICAgICAgICBpbm5lck9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgICAgIGlubmVyT2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgIHRoaXMub25Mb2dvdXRFcnJvcihlcnJvcik7XG4gICAgICAgICAgaW5uZXJPYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGFPYnNlcnZhYmxlLnBpcGUoc2hhcmUoKSk7XG4gIH1cblxuICBwdWJsaWMgb25Mb2dvdXRTdWNjZXNzKHNlc3Npb25JZDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHNlc3Npb25JZCA9PT0gMCkge1xuICAgICAgdGhpcy5zZXNzaW9uRXhwaXJlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkxvZ291dEVycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBvbiBsb2dvdXQnKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXNzaW9uRXhwaXJlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2Uuc2Vzc2lvbkV4cGlyZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0xvZ2dlZEluKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UuaXNMb2dnZWRJbigpO1xuICB9XG5cbiAgcHVibGljIGxvZ291dEFuZFJlZGlyZWN0KCk6IHZvaWQge1xuICAgIHRoaXMubG9nb3V0KCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIFNlcnZpY2VVdGlscy5yZWRpcmVjdExvZ2luKHRoaXMucm91dGVyLCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbG9nb3V0V2l0aENvbmZpcm1hdGlvbkFuZFJlZGlyZWN0KCk6IHZvaWQge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ01FU1NBR0VTLkNPTkZJUk1fTE9HT1VUJykudGhlbihyZXMgPT4ge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICB0aGlzLmxvZ291dEFuZFJlZGlyZWN0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2Vzc2lvbkluZm8oKTogU2Vzc2lvbkluZm8ge1xuICAgIHJldHVybiB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgfVxuXG4gIHB1YmxpYyBzdG9yZVNlc3Npb25JbmZvKGluZm86IFNlc3Npb25JbmZvKTogdm9pZCB7XG4gICAgdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlLnN0b3JlU2Vzc2lvbkluZm8oaW5mbyk7XG4gIH1cbn1cbiJdfQ==