import { Injectable, Injector } from '@angular/core';
import * as i0 from "@angular/core";
var OFormLayoutManagerService = (function () {
    function OFormLayoutManagerService(injector) {
        this.injector = injector;
        this.registeredFormLayoutManagers = {};
    }
    OFormLayoutManagerService.prototype.registerFormLayoutManager = function (comp) {
        this.registeredFormLayoutManagers[comp.getAttribute()] = comp;
    };
    OFormLayoutManagerService.prototype.removeFormLayoutManager = function (comp) {
        delete this.registeredFormLayoutManagers[comp.getAttribute()];
    };
    Object.defineProperty(OFormLayoutManagerService.prototype, "activeFormLayoutManager", {
        get: function () {
            return this._activeFormLayoutManager;
        },
        set: function (arg) {
            this._activeFormLayoutManager = arg;
        },
        enumerable: true,
        configurable: true
    });
    OFormLayoutManagerService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    OFormLayoutManagerService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OFormLayoutManagerService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OFormLayoutManagerService_Factory() { return new OFormLayoutManagerService(i0.ɵɵinject(i0.INJECTOR)); }, token: OFormLayoutManagerService, providedIn: "root" });
    return OFormLayoutManagerService;
}());
export { OFormLayoutManagerService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL28tZm9ybS1sYXlvdXQtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUlyRDtJQU9FLG1DQUFzQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBSDlCLGlDQUE0QixHQUFHLEVBQUUsQ0FBQztJQUk1QyxDQUFDO0lBRUQsNkRBQXlCLEdBQXpCLFVBQTBCLElBQWlDO1FBQ3pELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDaEUsQ0FBQztJQUVELDJEQUF1QixHQUF2QixVQUF3QixJQUFpQztRQUN2RCxPQUFPLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsc0JBQUksOERBQXVCO2FBQTNCO1lBQ0UsT0FBTyxJQUFJLENBQUMsd0JBQXdCLENBQUM7UUFDdkMsQ0FBQzthQUVELFVBQTRCLEdBQWdDO1lBQzFELElBQUksQ0FBQyx3QkFBd0IsR0FBRyxHQUFHLENBQUM7UUFDdEMsQ0FBQzs7O09BSkE7O2dCQXBCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Z0JBTm9CLFFBQVE7OztvQ0FBN0I7Q0E2QkMsQUF6QkQsSUF5QkM7U0F0QlkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50JztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZSB7XG4gIHByb3RlY3RlZCByZWdpc3RlcmVkRm9ybUxheW91dE1hbmFnZXJzID0ge307XG4gIHByb3RlY3RlZCBfYWN0aXZlRm9ybUxheW91dE1hbmFnZXI6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gIH1cblxuICByZWdpc3RlckZvcm1MYXlvdXRNYW5hZ2VyKGNvbXA6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCkge1xuICAgIHRoaXMucmVnaXN0ZXJlZEZvcm1MYXlvdXRNYW5hZ2Vyc1tjb21wLmdldEF0dHJpYnV0ZSgpXSA9IGNvbXA7XG4gIH1cblxuICByZW1vdmVGb3JtTGF5b3V0TWFuYWdlcihjb21wOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpIHtcbiAgICBkZWxldGUgdGhpcy5yZWdpc3RlcmVkRm9ybUxheW91dE1hbmFnZXJzW2NvbXAuZ2V0QXR0cmlidXRlKCldO1xuICB9XG5cbiAgZ2V0IGFjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyKCk6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyO1xuICB9XG5cbiAgc2V0IGFjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyKGFyZzogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KSB7XG4gICAgdGhpcy5fYWN0aXZlRm9ybUxheW91dE1hbmFnZXIgPSBhcmc7XG4gIH1cbn1cbiJdfQ==