import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutDialogOptionsComponent } from './dialog/options/o-form-layout-dialog-options.component';
import { OFormLayoutManagerContentDirective } from './directives/o-form-layout-manager-content.directive';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutManagerComponent } from './o-form-layout-manager.component';
import { OFormLayoutTabGroupComponent } from './tabgroup/o-form-layout-tabgroup.component';
import { OFormLayoutTabGroupOptionsComponent } from './tabgroup/options/o-form-layout-tabgroup-options.component';
export class OFormLayoutManagerModule {
}
OFormLayoutManagerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, OSharedModule, RouterModule],
                declarations: [
                    OFormLayoutDialogComponent,
                    OFormLayoutManagerComponent,
                    OFormLayoutTabGroupComponent,
                    OFormLayoutManagerContentDirective,
                    OFormLayoutDialogOptionsComponent,
                    OFormLayoutTabGroupOptionsComponent
                ],
                exports: [
                    OFormLayoutManagerComponent,
                    OFormLayoutDialogOptionsComponent,
                    OFormLayoutTabGroupOptionsComponent
                ],
                entryComponents: [OFormLayoutDialogComponent],
                providers: [{
                        provide: CanActivateFormLayoutChildGuard,
                        useClass: CanActivateFormLayoutChildGuard
                    }],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1tYW5hZ2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFDckYsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0seURBQXlELENBQUM7QUFDNUcsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDMUcsT0FBTyxFQUFFLCtCQUErQixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDbEcsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDaEYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDM0YsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLE1BQU0sNkRBQTZELENBQUM7QUF3QmxILE1BQU0sT0FBTyx3QkFBd0I7OztZQXRCcEMsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO2dCQUNwRCxZQUFZLEVBQUU7b0JBQ1osMEJBQTBCO29CQUMxQiwyQkFBMkI7b0JBQzNCLDRCQUE0QjtvQkFDNUIsa0NBQWtDO29CQUNsQyxpQ0FBaUM7b0JBQ2pDLG1DQUFtQztpQkFDcEM7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLDJCQUEyQjtvQkFDM0IsaUNBQWlDO29CQUNqQyxtQ0FBbUM7aUJBQ3BDO2dCQUNELGVBQWUsRUFBRSxDQUFDLDBCQUEwQixDQUFDO2dCQUM3QyxTQUFTLEVBQUUsQ0FBQzt3QkFDVixPQUFPLEVBQUUsK0JBQStCO3dCQUN4QyxRQUFRLEVBQUUsK0JBQStCO3FCQUMxQyxDQUFDO2dCQUNGLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO2FBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UU19TQ0hFTUEsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy9vLWZvcm0tbGF5b3V0LWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXREaWFsb2dPcHRpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2cvb3B0aW9ucy9vLWZvcm0tbGF5b3V0LWRpYWxvZy1vcHRpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL28tZm9ybS1sYXlvdXQtbWFuYWdlci1jb250ZW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkIH0gZnJvbSAnLi9ndWFyZHMvby1mb3JtLWxheW91dC1jYW4tYWN0aXZhdGUtY2hpbGQuZ3VhcmQnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0VGFiR3JvdXBDb21wb25lbnQgfSBmcm9tICcuL3RhYmdyb3VwL28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0VGFiR3JvdXBPcHRpb25zQ29tcG9uZW50IH0gZnJvbSAnLi90YWJncm91cC9vcHRpb25zL28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAtb3B0aW9ucy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlLCBSb3V0ZXJNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCxcbiAgICBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQsXG4gICAgT0Zvcm1MYXlvdXRUYWJHcm91cENvbXBvbmVudCxcbiAgICBPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlLFxuICAgIE9Gb3JtTGF5b3V0RGlhbG9nT3B0aW9uc0NvbXBvbmVudCxcbiAgICBPRm9ybUxheW91dFRhYkdyb3VwT3B0aW9uc0NvbXBvbmVudFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50LFxuICAgIE9Gb3JtTGF5b3V0RGlhbG9nT3B0aW9uc0NvbXBvbmVudCxcbiAgICBPRm9ybUxheW91dFRhYkdyb3VwT3B0aW9uc0NvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkLFxuICAgIHVzZUNsYXNzOiBDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkXG4gIH1dLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXRNYW5hZ2VyTW9kdWxlIHsgfVxuIl19