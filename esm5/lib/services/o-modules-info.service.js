import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { OTranslateService } from '../services/translate/o-translate.service';
import * as i0 from "@angular/core";
var OModulesInfoService = (function () {
    function OModulesInfoService(injector) {
        var _this = this;
        this.injector = injector;
        this.subject = new Subject();
        this.router = this.injector.get(Router);
        this.actRoute = this.injector.get(ActivatedRoute);
        this.translateService = this.injector.get(OTranslateService);
        this.router.events.subscribe(function (ev) {
            if (ev instanceof NavigationEnd) {
                var translation = _this.translateService.get(ev.url);
                if (translation !== ev.url) {
                    _this.setModuleInfo({
                        name: translation
                    });
                }
            }
        });
    }
    OModulesInfoService.prototype.setModuleInfo = function (info) {
        this.storedInfo = info;
        this.subject.next(info);
    };
    OModulesInfoService.prototype.getModuleInfo = function () {
        return this.storedInfo;
    };
    OModulesInfoService.prototype.getModuleChangeObservable = function () {
        return this.subject.asObservable();
    };
    OModulesInfoService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    OModulesInfoService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OModulesInfoService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OModulesInfoService_Factory() { return new OModulesInfoService(i0.ɵɵinject(i0.INJECTOR)); }, token: OModulesInfoService, providedIn: "root" });
    return OModulesInfoService;
}());
export { OModulesInfoService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tb2R1bGVzLWluZm8uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvby1tb2R1bGVzLWluZm8uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN4RSxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDOztBQU85RTtJQVdFLDZCQUNZLFFBQWtCO1FBRDlCLGlCQWlCQztRQWhCVyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBSHRCLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBS25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxFQUFFO1lBQzdCLElBQUksRUFBRSxZQUFZLGFBQWEsRUFBRTtnQkFDL0IsSUFBTSxXQUFXLEdBQUcsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RELElBQUksV0FBVyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUU7b0JBQzFCLEtBQUksQ0FBQyxhQUFhLENBQUM7d0JBQ2pCLElBQUksRUFBRSxXQUFXO3FCQUNsQixDQUFDLENBQUM7aUJBQ0o7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELDJDQUFhLEdBQWIsVUFBYyxJQUFnQjtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsMkNBQWEsR0FBYjtRQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsdURBQXlCLEdBQXpCO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3JDLENBQUM7O2dCQXpDRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Z0JBYm9CLFFBQVE7Ozs4QkFBN0I7Q0FzREMsQUEzQ0QsSUEyQ0M7U0F4Q1ksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBNb2R1bGVJbmZvIHtcbiAgbmFtZT86IHN0cmluZztcbiAgcm91dGU/OiBzdHJpbmc7XG59XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE9Nb2R1bGVzSW5mb1NlcnZpY2Uge1xuICBwcm90ZWN0ZWQgc3RvcmVkSW5mbzogTW9kdWxlSW5mbztcbiAgcHJvdGVjdGVkIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZTtcbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG5cbiAgcHJpdmF0ZSBzdWJqZWN0ID0gbmV3IFN1YmplY3Q8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICAgIHRoaXMuYWN0Um91dGUgPSB0aGlzLmluamVjdG9yLmdldChBY3RpdmF0ZWRSb3V0ZSk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzLnN1YnNjcmliZShldiA9PiB7XG4gICAgICBpZiAoZXYgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChldi51cmwpO1xuICAgICAgICBpZiAodHJhbnNsYXRpb24gIT09IGV2LnVybCkge1xuICAgICAgICAgIHRoaXMuc2V0TW9kdWxlSW5mbyh7XG4gICAgICAgICAgICBuYW1lOiB0cmFuc2xhdGlvblxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRNb2R1bGVJbmZvKGluZm86IE1vZHVsZUluZm8pIHtcbiAgICB0aGlzLnN0b3JlZEluZm8gPSBpbmZvO1xuICAgIHRoaXMuc3ViamVjdC5uZXh0KGluZm8pO1xuICB9XG5cbiAgZ2V0TW9kdWxlSW5mbygpOiBNb2R1bGVJbmZvIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yZWRJbmZvO1xuICB9XG5cbiAgZ2V0TW9kdWxlQ2hhbmdlT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxufVxuIl19