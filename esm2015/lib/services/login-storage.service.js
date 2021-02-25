import { Injectable, Injector } from '@angular/core';
import { AppConfig } from '../config/app-config';
import { Codes } from '../util/codes';
import * as i0 from "@angular/core";
export class LoginStorageService {
    constructor(injector) {
        this.injector = injector;
        this._config = this.injector.get(AppConfig).getConfiguration();
        this._localStorageKey = this._config.uuid;
    }
    getSessionInfo() {
        const info = localStorage.getItem(this._localStorageKey);
        if (!info) {
            return {};
        }
        const stored = JSON.parse(info);
        return stored[Codes.SESSION_KEY] || {};
    }
    storeSessionInfo(sessionInfo) {
        if (sessionInfo !== undefined) {
            const info = localStorage.getItem(this._localStorageKey);
            let stored = null;
            if (info && info.length > 0) {
                stored = JSON.parse(info);
            }
            else {
                stored = {};
            }
            stored[Codes.SESSION_KEY] = sessionInfo;
            localStorage.setItem(this._localStorageKey, JSON.stringify(stored));
        }
    }
    sessionExpired() {
        const sessionInfo = this.getSessionInfo();
        delete sessionInfo.id;
        delete sessionInfo.user;
        this.storeSessionInfo(sessionInfo);
    }
    isLoggedIn() {
        const sessionInfo = this.getSessionInfo();
        if (sessionInfo && sessionInfo.id && sessionInfo.user && sessionInfo.user.length > 0) {
            if (typeof sessionInfo.id === 'number' && (isNaN(sessionInfo.id) || sessionInfo.id < 0)) {
                return false;
            }
            return true;
        }
        return false;
    }
}
LoginStorageService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
LoginStorageService.ctorParameters = () => [
    { type: Injector }
];
LoginStorageService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function LoginStorageService_Factory() { return new LoginStorageService(i0.ɵɵinject(i0.INJECTOR)); }, token: LoginStorageService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tc3RvcmFnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9sb2dpbi1zdG9yYWdlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBR2pELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBS3RDLE1BQU0sT0FBTyxtQkFBbUI7SUFJOUIsWUFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDL0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQzVDLENBQUM7SUFFTSxjQUFjO1FBQ25CLE1BQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULE9BQU8sRUFBRSxDQUFDO1NBQ1g7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVNLGdCQUFnQixDQUFDLFdBQXdCO1FBQzlDLElBQUksV0FBVyxLQUFLLFNBQVMsRUFBRTtZQUM3QixNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3pELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0I7aUJBQU07Z0JBQ0wsTUFBTSxHQUFHLEVBQUUsQ0FBQzthQUNiO1lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7WUFDeEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQUVNLGNBQWM7UUFDbkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFDLE9BQU8sV0FBVyxDQUFDLEVBQUUsQ0FBQztRQUN0QixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTSxVQUFVO1FBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFDLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxFQUFFLElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEYsSUFBSSxPQUFPLFdBQVcsQ0FBQyxFQUFFLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxXQUFXLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN2RixPQUFPLEtBQUssQ0FBQzthQUNkO1lBQ0QsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7O1lBbkRGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBVG9CLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBcHBDb25maWcgfSBmcm9tICcuLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi90eXBlcy9jb25maWcudHlwZSc7XG5pbXBvcnQgeyBTZXNzaW9uSW5mbyB9IGZyb20gJy4uL3R5cGVzL3Nlc3Npb24taW5mby50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luU3RvcmFnZVNlcnZpY2Uge1xuICBwcml2YXRlIF9jb25maWc6IENvbmZpZztcbiAgcHVibGljIF9sb2NhbFN0b3JhZ2VLZXk6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5pbmplY3Rvci5nZXQoQXBwQ29uZmlnKS5nZXRDb25maWd1cmF0aW9uKCk7XG4gICAgdGhpcy5fbG9jYWxTdG9yYWdlS2V5ID0gdGhpcy5fY29uZmlnLnV1aWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2Vzc2lvbkluZm8oKTogU2Vzc2lvbkluZm8ge1xuICAgIGNvbnN0IGluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2VLZXkpO1xuICAgIGlmICghaW5mbykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBjb25zdCBzdG9yZWQgPSBKU09OLnBhcnNlKGluZm8pO1xuICAgIHJldHVybiBzdG9yZWRbQ29kZXMuU0VTU0lPTl9LRVldIHx8IHt9O1xuICB9XG5cbiAgcHVibGljIHN0b3JlU2Vzc2lvbkluZm8oc2Vzc2lvbkluZm86IFNlc3Npb25JbmZvKTogdm9pZCB7XG4gICAgaWYgKHNlc3Npb25JbmZvICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGluZm8gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2VLZXkpO1xuICAgICAgbGV0IHN0b3JlZCA9IG51bGw7XG4gICAgICBpZiAoaW5mbyAmJiBpbmZvLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc3RvcmVkID0gSlNPTi5wYXJzZShpbmZvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0b3JlZCA9IHt9O1xuICAgICAgfVxuICAgICAgc3RvcmVkW0NvZGVzLlNFU1NJT05fS0VZXSA9IHNlc3Npb25JbmZvO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fbG9jYWxTdG9yYWdlS2V5LCBKU09OLnN0cmluZ2lmeShzdG9yZWQpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2Vzc2lvbkV4cGlyZWQoKTogdm9pZCB7XG4gICAgY29uc3Qgc2Vzc2lvbkluZm8gPSB0aGlzLmdldFNlc3Npb25JbmZvKCk7XG4gICAgZGVsZXRlIHNlc3Npb25JbmZvLmlkO1xuICAgIGRlbGV0ZSBzZXNzaW9uSW5mby51c2VyO1xuICAgIHRoaXMuc3RvcmVTZXNzaW9uSW5mbyhzZXNzaW9uSW5mbyk7XG4gIH1cblxuICBwdWJsaWMgaXNMb2dnZWRJbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBzZXNzaW9uSW5mbyA9IHRoaXMuZ2V0U2Vzc2lvbkluZm8oKTtcbiAgICBpZiAoc2Vzc2lvbkluZm8gJiYgc2Vzc2lvbkluZm8uaWQgJiYgc2Vzc2lvbkluZm8udXNlciAmJiBzZXNzaW9uSW5mby51c2VyLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICh0eXBlb2Ygc2Vzc2lvbkluZm8uaWQgPT09ICdudW1iZXInICYmIChpc05hTihzZXNzaW9uSW5mby5pZCkgfHwgc2Vzc2lvbkluZm8uaWQgPCAwKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=