import { CommonModule } from '@angular/common';
import { Injector, NgModule } from '@angular/core';
import { permissionsServiceFactory } from '../factories';
import { OntimizePermissionsService } from './ontimize-permissions.service';
import { PermissionsGuardService } from './permissions-can-activate.guard';
import { PermissionsService } from './permissions.service';
export function getPermissionsServiceProvider(injector) {
    return new PermissionsService(injector);
}
const ɵ0 = permissionsServiceFactory;
export class OPermissionsModule {
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
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wZXJtaXNzaW9ucy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL3Blcm1pc3Npb25zL28tcGVybWlzc2lvbnMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDNUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFM0QsTUFBTSxVQUFVLDZCQUE2QixDQUFDLFFBQWtCO0lBQzlELE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxDQUFDO1dBT3NELHlCQUF5QjtBQUdoRixNQUFNLE9BQU8sa0JBQWtCOzs7WUFSOUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsU0FBUyxFQUFFO29CQUNULEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSx1QkFBdUIsRUFBRTtvQkFDdkUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLDZCQUE2QixFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM1RixFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxVQUFVLElBQTJCLEVBQUUsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUU7aUJBQ2pHO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0b3IsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IHBlcm1pc3Npb25zU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgT250aW1pemVQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuL29udGltaXplLXBlcm1pc3Npb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNHdWFyZFNlcnZpY2UgfSBmcm9tICcuL3Blcm1pc3Npb25zLWNhbi1hY3RpdmF0ZS5ndWFyZCc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuL3Blcm1pc3Npb25zLnNlcnZpY2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGVybWlzc2lvbnNTZXJ2aWNlUHJvdmlkZXIoaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gIHJldHVybiBuZXcgUGVybWlzc2lvbnNTZXJ2aWNlKGluamVjdG9yKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogUGVybWlzc2lvbnNHdWFyZFNlcnZpY2UsIHVzZUNsYXNzOiBQZXJtaXNzaW9uc0d1YXJkU2VydmljZSB9LFxuICAgIHsgcHJvdmlkZTogUGVybWlzc2lvbnNTZXJ2aWNlLCB1c2VGYWN0b3J5OiBnZXRQZXJtaXNzaW9uc1NlcnZpY2VQcm92aWRlciwgZGVwczogW0luamVjdG9yXSB9LFxuICAgIHsgcHJvdmlkZTogT250aW1pemVQZXJtaXNzaW9uc1NlcnZpY2UsIHVzZUZhY3Rvcnk6IHBlcm1pc3Npb25zU2VydmljZUZhY3RvcnksIGRlcHM6IFtJbmplY3Rvcl0gfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE9QZXJtaXNzaW9uc01vZHVsZSB7IH1cbiJdfQ==