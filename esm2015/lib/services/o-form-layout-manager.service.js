import { Injectable, Injector } from '@angular/core';
import * as i0 from "@angular/core";
export class OFormLayoutManagerService {
    constructor(injector) {
        this.injector = injector;
        this.registeredFormLayoutManagers = {};
    }
    registerFormLayoutManager(comp) {
        this.registeredFormLayoutManagers[comp.getAttribute()] = comp;
    }
    removeFormLayoutManager(comp) {
        delete this.registeredFormLayoutManagers[comp.getAttribute()];
    }
    get activeFormLayoutManager() {
        return this._activeFormLayoutManager;
    }
    set activeFormLayoutManager(arg) {
        this._activeFormLayoutManager = arg;
    }
}
OFormLayoutManagerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
OFormLayoutManagerService.ctorParameters = () => [
    { type: Injector }
];
OFormLayoutManagerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OFormLayoutManagerService_Factory() { return new OFormLayoutManagerService(i0.ɵɵinject(i0.INJECTOR)); }, token: OFormLayoutManagerService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL28tZm9ybS1sYXlvdXQtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQU9yRCxNQUFNLE9BQU8seUJBQXlCO0lBSXBDLFlBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFIOUIsaUNBQTRCLEdBQUcsRUFBRSxDQUFDO0lBSTVDLENBQUM7SUFFRCx5QkFBeUIsQ0FBQyxJQUFpQztRQUN6RCxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2hFLENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxJQUFpQztRQUN2RCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsSUFBSSx1QkFBdUI7UUFDekIsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksdUJBQXVCLENBQUMsR0FBZ0M7UUFDMUQsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEdBQUcsQ0FBQztJQUN0QyxDQUFDOzs7WUF4QkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7WUFOb0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtTGF5b3V0TWFuYWdlclNlcnZpY2Uge1xuICBwcm90ZWN0ZWQgcmVnaXN0ZXJlZEZvcm1MYXlvdXRNYW5hZ2VycyA9IHt9O1xuICBwcm90ZWN0ZWQgX2FjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICB9XG5cbiAgcmVnaXN0ZXJGb3JtTGF5b3V0TWFuYWdlcihjb21wOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpIHtcbiAgICB0aGlzLnJlZ2lzdGVyZWRGb3JtTGF5b3V0TWFuYWdlcnNbY29tcC5nZXRBdHRyaWJ1dGUoKV0gPSBjb21wO1xuICB9XG5cbiAgcmVtb3ZlRm9ybUxheW91dE1hbmFnZXIoY29tcDogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KSB7XG4gICAgZGVsZXRlIHRoaXMucmVnaXN0ZXJlZEZvcm1MYXlvdXRNYW5hZ2Vyc1tjb21wLmdldEF0dHJpYnV0ZSgpXTtcbiAgfVxuXG4gIGdldCBhY3RpdmVGb3JtTGF5b3V0TWFuYWdlcigpOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVGb3JtTGF5b3V0TWFuYWdlcjtcbiAgfVxuXG4gIHNldCBhY3RpdmVGb3JtTGF5b3V0TWFuYWdlcihhcmc6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCkge1xuICAgIHRoaXMuX2FjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyID0gYXJnO1xuICB9XG59XG4iXX0=