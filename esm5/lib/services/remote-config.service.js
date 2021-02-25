import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HostListener, Injectable, Injector } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { AppConfig } from '../config/app-config';
import { Codes } from '../util/codes';
import { Util } from '../util/util';
import { LocalStorageService } from './local-storage.service';
import { LoginStorageService } from './login-storage.service';
import * as i0 from "@angular/core";
var ORemoteConfigurationService = (function () {
    function ORemoteConfigurationService(injector) {
        this.injector = injector;
        this._columns = {
            user: ORemoteConfigurationService.DEFAULT_COLUMN_USER,
            appId: ORemoteConfigurationService.DEFAULT_COLUMN_APPID,
            configuration: ORemoteConfigurationService.DEFAULT_COLUMN_CONFIG
        };
        this.httpClient = this.injector.get(HttpClient);
        this._appConfig = this.injector.get(AppConfig);
        this.loginStorageService = this.injector.get(LoginStorageService);
        this.localStorageService = this.injector.get(LocalStorageService);
        this.httpClient = this.injector.get(HttpClient);
        this._uuid = this._appConfig.getConfiguration().uuid;
        if (this._appConfig.useRemoteConfiguration()) {
            this._url = this._appConfig.getRemoteConfigurationEndpoint();
            var remoteConfig = this._appConfig.getRemoteConfigurationConfig();
            this._columns = (remoteConfig && remoteConfig.columns) ? Object.assign(this._columns, remoteConfig.columns) : this._columns;
            this._timeout = (remoteConfig && remoteConfig.timeout) ? remoteConfig.timeout : ORemoteConfigurationService.DEFAULT_STORAGE_TIMEOUT;
            var self_1 = this;
            this.localStorageService.onSetLocalStorage.subscribe(function () {
                if (self_1.storeSubscription) {
                    self_1.storeSubscription.unsubscribe();
                }
            });
        }
    }
    ORemoteConfigurationService.prototype.beforeunloadHandler = function () {
        this.finalize().subscribe(function () {
        });
    };
    ORemoteConfigurationService.prototype.getUserConfiguration = function () {
        var self = this;
        var observable = new Observable(function (observer) {
            var sessionInfo = self.loginStorageService.getSessionInfo();
            if (!self.hasSession(sessionInfo)) {
                observer.error();
                return;
            }
            var url = self._url + '/search';
            var body = {};
            body[self._columns.user] = sessionInfo.user;
            body[self._columns.appId] = self._uuid;
            var options = {
                headers: self.buildHeaders()
            };
            self.httpClient.post(url, body, options).subscribe(function (resp) {
                if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE && Util.isDefined(resp.data)) {
                    observer.next(resp);
                }
                else {
                    observer.error();
                }
            }, function (error) { return observer.error(error); }, function () { return observer.complete(); });
        });
        return observable;
    };
    ORemoteConfigurationService.prototype.storeUserConfiguration = function () {
        var self = this;
        if (self.storeSubscription) {
            self.storeSubscription.unsubscribe();
        }
        var observable = new Observable(function (observer) {
            var sessionInfo = self.loginStorageService.getSessionInfo();
            if (!self._appConfig.useRemoteConfiguration() || !self.hasSession(sessionInfo)) {
                observer.next();
                observer.complete();
                return;
            }
            var url = self._url;
            var body = { filter: {}, data: {} };
            body.filter[self._columns.user] = sessionInfo.user;
            body.filter[self._columns.appId] = self._uuid;
            var userData = self.localStorageService.getSessionUserComponentsData() || '';
            try {
                userData = btoa(JSON.stringify(userData));
            }
            catch (e) {
                userData = '';
            }
            body.data[self._columns.configuration] = userData;
            var options = {
                headers: self.buildHeaders()
            };
            self.httpClient.put(url, body, options).subscribe(function (resp) {
                if (resp && resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
                    observer.next(resp);
                }
                else {
                    observer.error();
                }
            }, function (error) { return observer.error(error); }, function () { return observer.complete(); });
        });
        return observable;
    };
    ORemoteConfigurationService.prototype.initialize = function () {
        var self = this;
        return new Observable(function (observer) {
            if (self._appConfig.useRemoteConfiguration()) {
                self.timerSubscription = timer(self._timeout, self._timeout).subscribe(function () {
                    self.storeSubscription = self.storeUserConfiguration().subscribe(function () {
                    });
                });
                self.getUserConfiguration().subscribe(function (resp) {
                    var storedConf;
                    if (Util.isArray(resp.data)) {
                        storedConf = resp.data[0][self._columns.configuration];
                    }
                    else {
                        storedConf = resp.data;
                    }
                    if (Util.isDefined(storedConf)) {
                        var componentsData = void 0;
                        try {
                            var decoded = atob(storedConf);
                            componentsData = JSON.parse(decoded);
                        }
                        catch (e) {
                            componentsData = {};
                        }
                        self.localStorageService.storeSessionUserComponentsData(componentsData);
                    }
                    observer.next();
                }, function () {
                    observer.next();
                });
            }
            else {
                observer.next();
            }
        });
    };
    ORemoteConfigurationService.prototype.finalize = function () {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        return this.storeUserConfiguration();
    };
    ORemoteConfigurationService.prototype.hasSession = function (sessionInfo) {
        return Util.isDefined(sessionInfo) && Util.isDefined(sessionInfo.user) && Util.isDefined(sessionInfo.id);
    };
    ORemoteConfigurationService.prototype.buildHeaders = function () {
        var sessionInfo = this.loginStorageService.getSessionInfo();
        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: 'Bearer ' + sessionInfo.id
        });
    };
    ORemoteConfigurationService.DEFAULT_COLUMN_USER = 'USER_';
    ORemoteConfigurationService.DEFAULT_COLUMN_APPID = 'APP_UUID';
    ORemoteConfigurationService.DEFAULT_COLUMN_CONFIG = 'CONFIGURATION';
    ORemoteConfigurationService.DEFAULT_STORAGE_TIMEOUT = 60000;
    ORemoteConfigurationService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    ORemoteConfigurationService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    ORemoteConfigurationService.propDecorators = {
        beforeunloadHandler: [{ type: HostListener, args: ['window:beforeunload', [],] }]
    };
    ORemoteConfigurationService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ORemoteConfigurationService_Factory() { return new ORemoteConfigurationService(i0.ɵɵinject(i0.INJECTOR)); }, token: ORemoteConfigurationService, providedIn: "root" });
    return ORemoteConfigurationService;
}());
export { ORemoteConfigurationService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3RlLWNvbmZpZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9yZW1vdGUtY29uZmlnLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkUsT0FBTyxFQUFFLFVBQVUsRUFBNEIsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRW5FLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUlqRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7O0FBRTlEO0lBaUNFLHFDQUFzQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBYjlCLGFBQVEsR0FBZ0M7WUFDaEQsSUFBSSxFQUFFLDJCQUEyQixDQUFDLG1CQUFtQjtZQUNyRCxLQUFLLEVBQUUsMkJBQTJCLENBQUMsb0JBQW9CO1lBQ3ZELGFBQWEsRUFBRSwyQkFBMkIsQ0FBQyxxQkFBcUI7U0FDakUsQ0FBQztRQVVBLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxD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OlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBIb3N0TGlzdGVuZXIsIEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJzY3JpcHRpb24sIHRpbWVyIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IFNlcnZpY2VSZXNwb25zZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvc2VydmljZS1yZXNwb25zZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1JlbW90ZUNvbmZpZ3VyYXRpb24sIE9SZW1vdGVDb25maWd1cmF0aW9uQ29sdW1ucyB9IGZyb20gJy4uL3R5cGVzL3JlbW90ZS1jb25maWd1cmF0aW9uLnR5cGUnO1xuaW1wb3J0IHsgU2Vzc2lvbkluZm8gfSBmcm9tICcuLi90eXBlcy9zZXNzaW9uLWluZm8udHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9naW5TdG9yYWdlU2VydmljZSB9IGZyb20gJy4vbG9naW4tc3RvcmFnZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlIHtcblxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfQ09MVU1OX1VTRVIgPSAnVVNFUl8nO1xuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfQ09MVU1OX0FQUElEID0gJ0FQUF9VVUlEJztcbiAgcHVibGljIHN0YXRpYyBERUZBVUxUX0NPTFVNTl9DT05GSUcgPSAnQ09ORklHVVJBVElPTic7XG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9TVE9SQUdFX1RJTUVPVVQgPSA2MDAwMDtcblxuICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlU2VydmljZTogTG9jYWxTdG9yYWdlU2VydmljZTtcbiAgcHJvdGVjdGVkIGxvZ2luU3RvcmFnZVNlcnZpY2U6IExvZ2luU3RvcmFnZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBodHRwQ2xpZW50OiBIdHRwQ2xpZW50O1xuICBwcm90ZWN0ZWQgX2FwcENvbmZpZzogQXBwQ29uZmlnO1xuICBwcm90ZWN0ZWQgX3VybDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX3V1aWQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIF90aW1lb3V0OiBudW1iZXI7XG4gIHByb3RlY3RlZCB0aW1lclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc3RvcmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcm90ZWN0ZWQgX2NvbHVtbnM6IE9SZW1vdGVDb25maWd1cmF0aW9uQ29sdW1ucyA9IHtcbiAgICB1c2VyOiBPUmVtb3RlQ29uZmlndXJhdGlvblNlcnZpY2UuREVGQVVMVF9DT0xVTU5fVVNFUixcbiAgICBhcHBJZDogT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlLkRFRkFVTFRfQ09MVU1OX0FQUElELFxuICAgIGNvbmZpZ3VyYXRpb246IE9SZW1vdGVDb25maWd1cmF0aW9uU2VydmljZS5ERUZBVUxUX0NPTFVNTl9DT05GSUdcbiAgfTtcblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JldW5sb2FkJywgW10pXG4gIGJlZm9yZXVubG9hZEhhbmRsZXIoKSB7XG4gICAgdGhpcy5maW5hbGl6ZSgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAvL1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuaHR0cENsaWVudCA9IHRoaXMuaW5qZWN0b3IuZ2V0KEh0dHBDbGllbnQpO1xuICAgIHRoaXMuX2FwcENvbmZpZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcENvbmZpZyk7XG4gICAgdGhpcy5sb2dpblN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9naW5TdG9yYWdlU2VydmljZSk7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxTdG9yYWdlU2VydmljZSk7XG5cbiAgICB0aGlzLmh0dHBDbGllbnQgPSB0aGlzLmluamVjdG9yLmdldChIdHRwQ2xpZW50KTtcbiAgICB0aGlzLl91dWlkID0gdGhpcy5fYXBwQ29uZmlnLmdldENvbmZpZ3VyYXRpb24oKS51dWlkO1xuXG4gICAgaWYgKHRoaXMuX2FwcENvbmZpZy51c2VSZW1vdGVDb25maWd1cmF0aW9uKCkpIHtcbiAgICAgIHRoaXMuX3VybCA9IHRoaXMuX2FwcENvbmZpZy5nZXRSZW1vdGVDb25maWd1cmF0aW9uRW5kcG9pbnQoKTtcblxuICAgICAgY29uc3QgcmVtb3RlQ29uZmlnOiBPUmVtb3RlQ29uZmlndXJhdGlvbiA9IHRoaXMuX2FwcENvbmZpZy5nZXRSZW1vdGVDb25maWd1cmF0aW9uQ29uZmlnKCk7XG4gICAgICB0aGlzLl9jb2x1bW5zID0gKHJlbW90ZUNvbmZpZyAmJiByZW1vdGVDb25maWcuY29sdW1ucykgPyBPYmplY3QuYXNzaWduKHRoaXMuX2NvbHVtbnMsIHJlbW90ZUNvbmZpZy5jb2x1bW5zKSA6IHRoaXMuX2NvbHVtbnM7XG5cbiAgICAgIHRoaXMuX3RpbWVvdXQgPSAocmVtb3RlQ29uZmlnICYmIHJlbW90ZUNvbmZpZy50aW1lb3V0KSA/IHJlbW90ZUNvbmZpZy50aW1lb3V0IDogT1JlbW90ZUNvbmZpZ3VyYXRpb25TZXJ2aWNlLkRFRkFVTFRfU1RPUkFHRV9USU1FT1VUO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uub25TZXRMb2NhbFN0b3JhZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHNlbGYuc3RvcmVTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgICBzZWxmLnN0b3JlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRVc2VyQ29uZmlndXJhdGlvbigpOiBPYnNlcnZhYmxlPFNlcnZpY2VSZXNwb25zZT4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IFN1YnNjcmliZXI8U2VydmljZVJlc3BvbnNlPikgPT4ge1xuICAgICAgY29uc3Qgc2Vzc2lvbkluZm8gPSBzZWxmLmxvZ2luU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgICAgIGlmICghc2VsZi5oYXNTZXNzaW9uKHNlc3Npb25JbmZvKSkge1xuICAgICAgICBvYnNlcnZlci5lcnJvcigpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCB1cmwgPSBzZWxmLl91cmwgKyAnL3NlYXJjaCc7XG4gICAgICBjb25zdCBib2R5OiBhbnkgPSB7fTtcbiAgICAgIGJvZHlbc2VsZi5fY29sdW1ucy51c2VyXSA9IHNlc3Npb25JbmZvLnVzZXI7XG4gICAgICBib2R5W3NlbGYuX2NvbHVtbnMuYXBwSWRdID0gc2VsZi5fdXVpZDtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGhlYWRlcnM6IHNlbGYuYnVpbGRIZWFkZXJzKClcbiAgICAgIH07XG4gICAgICBzZWxmLmh0dHBDbGllbnQucG9zdCh1cmwsIGJvZHksIG9wdGlvbnMpLnN1YnNjcmliZSgocmVzcDogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwICYmIHJlc3AuY29kZSA9PT0gQ29kZXMuT05USU1JWkVfU1VDQ0VTU0ZVTF9DT0RFICYmIFV0aWwuaXNEZWZpbmVkKHJlc3AuZGF0YSkpIHtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3ApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAgIChlcnJvcikgPT4gb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpLFxuICAgICAgICAoKSA9PiBvYnNlcnZlci5jb21wbGV0ZSgpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBzdG9yZVVzZXJDb25maWd1cmF0aW9uKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHNlbGYuc3RvcmVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHNlbGYuc3RvcmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogU3Vic2NyaWJlcjxTZXJ2aWNlUmVzcG9uc2U+KSA9PiB7XG4gICAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHNlbGYubG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgICAgaWYgKCFzZWxmLl9hcHBDb25maWcudXNlUmVtb3RlQ29uZmlndXJhdGlvbigpIHx8ICFzZWxmLmhhc1Nlc3Npb24oc2Vzc2lvbkluZm8pKSB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgdXJsID0gc2VsZi5fdXJsO1xuICAgICAgY29uc3QgYm9keTogYW55ID0geyBmaWx0ZXI6IHt9LCBkYXRhOiB7fSB9O1xuICAgICAgYm9keS5maWx0ZXJbc2VsZi5fY29sdW1ucy51c2VyXSA9IHNlc3Npb25JbmZvLnVzZXI7XG4gICAgICBib2R5LmZpbHRlcltzZWxmLl9jb2x1bW5zLmFwcElkXSA9IHNlbGYuX3V1aWQ7XG4gICAgICBsZXQgdXNlckRhdGEgPSBzZWxmLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0U2Vzc2lvblVzZXJDb21wb25lbnRzRGF0YSgpIHx8ICcnO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXNlckRhdGEgPSBidG9hKEpTT04uc3RyaW5naWZ5KHVzZXJEYXRhKSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHVzZXJEYXRhID0gJyc7XG4gICAgICB9XG4gICAgICBib2R5LmRhdGFbc2VsZi5fY29sdW1ucy5jb25maWd1cmF0aW9uXSA9IHVzZXJEYXRhO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgaGVhZGVyczogc2VsZi5idWlsZEhlYWRlcnMoKVxuICAgICAgfTtcbiAgICAgIHNlbGYuaHR0cENsaWVudC5wdXQodXJsLCBib2R5LCBvcHRpb25zKS5zdWJzY3JpYmUoKHJlc3A6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcCAmJiByZXNwLmNvZGUgPT09IENvZGVzLk9OVElNSVpFX1NVQ0NFU1NGVUxfQ09ERSkge1xuICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfSwgKGVycm9yKSA9PiBvYnNlcnZlci5lcnJvcihlcnJvciksXG4gICAgICAgICgpID0+IG9ic2VydmVyLmNvbXBsZXRlKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgaWYgKHNlbGYuX2FwcENvbmZpZy51c2VSZW1vdGVDb25maWd1cmF0aW9uKCkpIHtcbiAgICAgICAgc2VsZi50aW1lclN1YnNjcmlwdGlvbiA9IHRpbWVyKHNlbGYuX3RpbWVvdXQsIHNlbGYuX3RpbWVvdXQpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgc2VsZi5zdG9yZVN1YnNjcmlwdGlvbiA9IHNlbGYuc3RvcmVVc2VyQ29uZmlndXJhdGlvbigpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgc2VsZi5nZXRVc2VyQ29uZmlndXJhdGlvbigpLnN1YnNjcmliZSgocmVzcDogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgbGV0IHN0b3JlZENvbmY7XG4gICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShyZXNwLmRhdGEpKSB7XG4gICAgICAgICAgICBzdG9yZWRDb25mID0gcmVzcC5kYXRhWzBdW3NlbGYuX2NvbHVtbnMuY29uZmlndXJhdGlvbl07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0b3JlZENvbmYgPSByZXNwLmRhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChzdG9yZWRDb25mKSkge1xuICAgICAgICAgICAgbGV0IGNvbXBvbmVudHNEYXRhO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY29uc3QgZGVjb2RlZCA9IGF0b2Ioc3RvcmVkQ29uZik7XG4gICAgICAgICAgICAgIGNvbXBvbmVudHNEYXRhID0gSlNPTi5wYXJzZShkZWNvZGVkKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29tcG9uZW50c0RhdGEgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYubG9jYWxTdG9yYWdlU2VydmljZS5zdG9yZVNlc3Npb25Vc2VyQ29tcG9uZW50c0RhdGEoY29tcG9uZW50c0RhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGZpbmFsaXplKCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKHRoaXMudGltZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudGltZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVVc2VyQ29uZmlndXJhdGlvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhc1Nlc3Npb24oc2Vzc2lvbkluZm86IFNlc3Npb25JbmZvKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHNlc3Npb25JbmZvKSAmJiBVdGlsLmlzRGVmaW5lZChzZXNzaW9uSW5mby51c2VyKSAmJiBVdGlsLmlzRGVmaW5lZChzZXNzaW9uSW5mby5pZCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRIZWFkZXJzKCk6IEh0dHBIZWFkZXJzIHtcbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgIHJldHVybiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04JyxcbiAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHNlc3Npb25JbmZvLmlkXG4gICAgfSk7XG4gIH1cblxufVxuIl19