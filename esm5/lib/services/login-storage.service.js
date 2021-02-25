import { Injectable, Injector } from '@angular/core';
import { AppConfig } from '../config/app-config';
import { Codes } from '../util/codes';
import * as i0 from "@angular/core";
var LoginStorageService = (function () {
    function LoginStorageService(injector) {
        this.injector = injector;
        this._config = this.injector.get(AppConfig).getConfiguration();
        this._localStorageKey = this._config.uuid;
    }
    LoginStorageService.prototype.getSessionInfo = function () {
        var info = localStorage.getItem(this._localStorageKey);
        if (!info) {
            return {};
        }
        var stored = JSON.parse(info);
        return stored[Codes.SESSION_KEY] || {};
    };
    LoginStorageService.prototype.storeSessionInfo = function (sessionInfo) {
        if (sessionInfo !== undefined) {
            var info = localStorage.getItem(this._localStorageKey);
            var stored = null;
            if (info && info.length > 0) {
                stored = JSON.parse(info);
            }
            else {
                stored = {};
            }
            stored[Codes.SESSION_KEY] = sessionInfo;
            localStorage.setItem(this._localStorageKey, JSON.stringify(stored));
        }
    };
    LoginStorageService.prototype.sessionExpired = function () {
        var sessionInfo = this.getSessionInfo();
        delete sessionInfo.id;
        delete sessionInfo.user;
        this.storeSessionInfo(sessionInfo);
    };
    LoginStorageService.prototype.isLoggedIn = function () {
        var sessionInfo = this.getSessionInfo();
        if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
            if (typeof sessionInfo.id === 'number' && (isNaN(sessionInfo.id) || sessionInfo.id < 0)) {
                return false;
            }
            return true;
        }
        return false;
    };
    LoginStorageService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    LoginStorageService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    LoginStorageService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LoginStorageService_Factory() { return new LoginStorageService(i0.ɵɵinject(i0.INJECTOR)); }, token: LoginStorageService, providedIn: "root" });
    return LoginStorageService;
}());
export { LoginStorageService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9sb2dpbi1zdG9yYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBR2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRXRDO0lBT0UsNkJBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDdEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQy9ELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUM1QyxDQUFDO0lBRU0sNENBQWMsR0FBckI7UUFDRSxJQUFNLElBQUksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFTSw4Q0FBZ0IsR0FBdkIsVUFBd0IsV0FBd0I7UUFDOUMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQzdCLElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDekQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMzQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQjtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsRUFBRSxDQUFDO2FBQ2I7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUN4QyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBRU0sNENBQWMsR0FBckI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUMsT0FBTyxXQUFXLENBQUMsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLHdDQUFVLEdBQWpCO1FBQ0UsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFDLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxFQUFFLElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEYsSUFBSSxPQUFPLFdBQVcsQ0FBQyxFQUFFLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN2RixPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Z0JBbkRGLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OztnQkFUb0IsUUFBUTs7OzhCQUE3QjtDQTJEQyxBQXBERCxJQW9EQztTQWpEWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBcHBDb25maWcgfSBmcm9tICcuLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi90eXBlcy9jb25maWcudHlwZSc7XG5pbXBvcnQgeyBTZXNzaW9uSW5mbyB9IGZyb20gJy4uL3R5cGVzL3Nlc3Npb24taW5mby50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luU3RvcmFnZVNlcnZpY2Uge1xuICBwcml2YXRlIF9jb25maWc6IENvbmZpZztcbiAgcHVibGljIF9sb2NhbFN0b3JhZ2VLZXk6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5pbmplY3Rvci5nZXQoQXBwQ29uZmlnKS5nZXRDb25maWd1cmF0aW9uKCk7XG4gICAgdGhpcy5fbG9jYWxTdG9yYWdlS2V5ID0gdGhpcy5fY29uZmlnLnV1aWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2Vzc2lvbkluZm8oKTogU2Vzc2lvbkluZm8ge1xuICAgIGNvbnN0IGluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2VLZXkpO1xuICAgIGlmICghaW5mbykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKGluZm8pO1xuICAgIHJldHVybiBzdG9yZWRbQ29kZXMuU0VTU0lPTl9LRVldIHx8IHt9O1xuICB9XG5cbiAgcHVibGljIHN0b3JlU2Vzc2lvbkluZm8oc2Vzc2lvbkluZm86IFNlc3Npb25JbmZvKTogdm9pZCB7XG4gICAgaWYgKHNlc3Npb25JbmZvICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2VLZXkpO1xuICAgICAgbGV0IHN0b3JlZCA9IG51bGw7XG4gICAgICBpZiAoaW5mbyAmJiBpbmZvLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RvcmVkID0gSlNPTi5wYXJzZShpbmZvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0b3JlZCA9IHt9O1xuICAgICAgfVxuICAgICAgc3RvcmVkW0NvZGVzLlNFU1NJT05fS0VZXSA9IHNlc3Npb25JbmZvO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fbG9jYWxTdG9yYWdlS2V5LCBKU09OLnN0cmluZ2lmeShzdG9yZWQpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2Vzc2lvbkV4cGlyZWQoKTogdm9pZCB7XG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSB0aGlzLmdldFNlc3Npb25JbmZvKCk7XG4gICAgZGVsZXRlIHNlc3Npb25JbmZvLmlkO1xuICAgIGRlbGV0ZSBzZXNzaW9uSW5mby51c2VyO1xuICAgIHRoaXMuc3RvcmVTZXNzaW9uSW5mbyhzZXNzaW9uSW5mbyk7XG4gIH1cblxuICBwdWJsaWMgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHRoaXMuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgICBpZiAoc2Vzc2lvbkluZm8gJiYgc2Vzc2lvbkluZm8uaWQgJiYgc2Vzc2lvbkluZm8udXNlciAmJiBzZXNzaW9uSW5mby51c2VyLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0eXBlb2Ygc2Vzc2lvbkluZm8uaWQgPT09ICdudW1iZXInICYmIChpc05hTihzZXNzaW9uSW5mby5pZCkgfHwgc2Vzc2lvbkluZm8uaWQgPCAwKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=