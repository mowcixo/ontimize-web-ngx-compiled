import { Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class OUserInfoService {
    constructor(injector) {
        this.injector = injector;
        this.subject = new Subject();
    }
    setUserInfo(info) {
        this.storedInfo = info;
        this.subject.next(info);
    }
    getUserInfo() {
        return this.storedInfo;
    }
    getUserInfoObservable() {
        return this.subject.asObservable();
    }
}
OUserInfoService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
OUserInfoService.ctorParameters = () => [
    { type: Injector }
];
OUserInfoService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OUserInfoService_Factory() { return new OUserInfoService(i0.ɵɵinject(i0.INJECTOR)); }, token: OUserInfoService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby11c2VyLWluZm8uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvby11c2VyLWluZm8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQVUzQyxNQUFNLE9BQU8sZ0JBQWdCO0lBSTNCLFlBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFGaEMsWUFBTyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7SUFHckMsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFjO1FBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JDLENBQUM7OztZQXJCRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQVZvQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGludGVyZmFjZSBVc2VySW5mbyB7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBhdmF0YXI/OiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE9Vc2VySW5mb1NlcnZpY2Uge1xuICBwcm90ZWN0ZWQgc3RvcmVkSW5mbzogVXNlckluZm87XG4gIHByaXZhdGUgc3ViamVjdCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gIH1cblxuICBzZXRVc2VySW5mbyhpbmZvOiBVc2VySW5mbykge1xuICAgIHRoaXMuc3RvcmVkSW5mbyA9IGluZm87XG4gICAgdGhpcy5zdWJqZWN0Lm5leHQoaW5mbyk7XG4gIH1cblxuICBnZXRVc2VySW5mbygpOiBVc2VySW5mbyB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVkSW5mbztcbiAgfVxuXG4gIGdldFVzZXJJbmZvT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxufVxuIl19