import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { OTranslateService } from '../services/translate/o-translate.service';
import * as i0 from "@angular/core";
export class OModulesInfoService {
    constructor(injector) {
        this.injector = injector;
        this.subject = new Subject();
        this.router = this.injector.get(Router);
        this.actRoute = this.injector.get(ActivatedRoute);
        this.translateService = this.injector.get(OTranslateService);
        this.router.events.subscribe(ev => {
            if (ev instanceof NavigationEnd) {
                const translation = this.translateService.get(ev.url);
                if (translation !== ev.url) {
                    this.setModuleInfo({
                        name: translation
                    });
                }
            }
        });
    }
    setModuleInfo(info) {
        this.storedInfo = info;
        this.subject.next(info);
    }
    getModuleInfo() {
        return this.storedInfo;
    }
    getModuleChangeObservable() {
        return this.subject.asObservable();
    }
}
OModulesInfoService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
OModulesInfoService.ctorParameters = () => [
    { type: Injector }
];
OModulesInfoService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OModulesInfoService_Factory() { return new OModulesInfoService(i0.ɵɵinject(i0.INJECTOR)); }, token: OModulesInfoService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tb2R1bGVzLWluZm8uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvby1tb2R1bGVzLWluZm8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4RSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDOztBQVU5RSxNQUFNLE9BQU8sbUJBQW1CO0lBUTlCLFlBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUh0QixZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUtuQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2hDLElBQUksRUFBRSxZQUFZLGFBQWEsRUFBRTtnQkFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RELElBQUksV0FBVyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxhQUFhLENBQUM7d0JBQ2pCLElBQUksRUFBRSxXQUFXO3FCQUNsQixDQUFDLENBQUM7aUJBQ0o7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFnQjtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQseUJBQXlCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQyxDQUFDOzs7WUF6Q0YsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7WUFib0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkVuZCwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9kdWxlSW5mbyB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHJvdXRlPzogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBPTW9kdWxlc0luZm9TZXJ2aWNlIHtcbiAgcHJvdGVjdGVkIHN0b3JlZEluZm86IE1vZHVsZUluZm87XG4gIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGU7XG4gIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcjtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuXG4gIHByaXZhdGUgc3ViamVjdCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMucm91dGVyID0gdGhpcy5pbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgICB0aGlzLmFjdFJvdXRlID0gdGhpcy5pbmplY3Rvci5nZXQoQWN0aXZhdGVkUm91dGUpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcblxuICAgIHRoaXMucm91dGVyLmV2ZW50cy5zdWJzY3JpYmUoZXYgPT4ge1xuICAgICAgaWYgKGV2IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkge1xuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbiA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoZXYudXJsKTtcbiAgICAgICAgaWYgKHRyYW5zbGF0aW9uICE9PSBldi51cmwpIHtcbiAgICAgICAgICB0aGlzLnNldE1vZHVsZUluZm8oe1xuICAgICAgICAgICAgbmFtZTogdHJhbnNsYXRpb25cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0TW9kdWxlSW5mbyhpbmZvOiBNb2R1bGVJbmZvKSB7XG4gICAgdGhpcy5zdG9yZWRJbmZvID0gaW5mbztcbiAgICB0aGlzLnN1YmplY3QubmV4dChpbmZvKTtcbiAgfVxuXG4gIGdldE1vZHVsZUluZm8oKTogTW9kdWxlSW5mbyB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmVkSW5mbztcbiAgfVxuXG4gIGdldE1vZHVsZUNoYW5nZU9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbn1cbiJdfQ==