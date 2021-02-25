import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class OBreadcrumbService {
    constructor(injector) {
        this.injector = injector;
        this.breadcrumbs$ = new BehaviorSubject([]);
    }
}
OBreadcrumbService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
OBreadcrumbService.ctorParameters = () => [
    { type: Injector }
];
OBreadcrumbService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OBreadcrumbService_Factory() { return new OBreadcrumbService(i0.ɵɵinject(i0.INJECTOR)); }, token: OBreadcrumbService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1icmVhZGNydW1iLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL28tYnJlYWRjcnVtYi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBS3ZDLE1BQU0sT0FBTyxrQkFBa0I7SUFJN0IsWUFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUZqQyxpQkFBWSxHQUFtQyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVsQyxDQUFDOzs7WUFMOUMsVUFBVSxTQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7O1lBTGIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT0JyZWFkY3J1bWIgfSBmcm9tICcuLi90eXBlcy9vLWJyZWFkY3J1bWItaXRlbS50eXBlJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBPQnJlYWRjcnVtYlNlcnZpY2Uge1xuXG4gIHB1YmxpYyBicmVhZGNydW1icyQ6IEJlaGF2aW9yU3ViamVjdDxPQnJlYWRjcnVtYltdPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoW10pO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHsgfVxuXG59XG4iXX0=