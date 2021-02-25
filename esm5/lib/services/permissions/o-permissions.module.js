import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { permissionsServiceFactory } from '../factories';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { PermissionsGuardService } from './permissions-can-activate.guard';
import { PermissionsService } from './permissions.service';
export function getPermissionsServiceProvider(injector) {
    return new PermissionsService(injector);
}
var ɵ0 = permissionsServiceFactory;
var OPermissionsModule = (function () {
    function OPermissionsModule() {
    }
    OPermissionsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    providers: [
                        { provide: PermissionsGuardService, useClass: PermissionsGuardService },
                        { provide: PermissionsService, useFactory: getPermissionsServiceProvider, deps: [Injector] },
                        { provide: OntimizePermissionsService, useFactory: ɵ0, deps: [Injector] }
                    ]
                },] }
    ];
    return OPermissionsModule;
}());
export { OPermissionsModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wZXJtaXNzaW9ucy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL3Blcm1pc3Npb25zL28tcGVybWlzc2lvbnMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFM0QsTUFBTSxVQUFVLDZCQUE2QixDQUFDLFFBQWtCO0lBQzlELE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDO1NBT3NELHlCQUF5QjtBQUxoRjtJQUFBO0lBUWtDLENBQUM7O2dCQVJsQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixTQUFTLEVBQUU7d0JBQ1QsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFO3dCQUN2RSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsNkJBQTZCLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUU7d0JBQzVGLEVBQUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLFVBQVUsSUFBMkIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRTtxQkFDakc7aUJBQ0Y7O0lBQ2lDLHlCQUFDO0NBQUEsQUFSbkMsSUFRbUM7U0FBdEIsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdG9yLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBwZXJtaXNzaW9uc1NlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vZmFjdG9yaWVzJztcbmltcG9ydCB7IE9udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi9vbnRpbWl6ZS1wZXJtaXNzaW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zR3VhcmRTZXJ2aWNlIH0gZnJvbSAnLi9wZXJtaXNzaW9ucy1jYW4tYWN0aXZhdGUuZ3VhcmQnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi9wZXJtaXNzaW9ucy5zZXJ2aWNlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBlcm1pc3Npb25zU2VydmljZVByb3ZpZGVyKGluamVjdG9yOiBJbmplY3Rvcikge1xuICByZXR1cm4gbmV3IFBlcm1pc3Npb25zU2VydmljZShpbmplY3Rvcik7XG59XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IFBlcm1pc3Npb25zR3VhcmRTZXJ2aWNlLCB1c2VDbGFzczogUGVybWlzc2lvbnNHdWFyZFNlcnZpY2UgfSxcbiAgICB7IHByb3ZpZGU6IFBlcm1pc3Npb25zU2VydmljZSwgdXNlRmFjdG9yeTogZ2V0UGVybWlzc2lvbnNTZXJ2aWNlUHJvdmlkZXIsIGRlcHM6IFtJbmplY3Rvcl0gfSxcbiAgICB7IHByb3ZpZGU6IE9udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlLCB1c2VGYWN0b3J5OiBwZXJtaXNzaW9uc1NlcnZpY2VGYWN0b3J5LCBkZXBzOiBbSW5qZWN0b3JdIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPUGVybWlzc2lvbnNNb2R1bGUgeyB9XG4iXX0=