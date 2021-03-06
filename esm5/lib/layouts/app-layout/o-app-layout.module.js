import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OAppHeaderModule } from '../../components/app-header/o-app-header.module';
import { OAppSidenavModule } from '../../components/app-sidenav/o-app-sidenav.module';
import { OSharedModule } from '../../shared/shared.module';
import { OAppLayoutHeaderComponent } from './app-layout-header/o-app-layout-header.component';
import { OAppLayoutSidenavComponent } from './app-layout-sidenav/o-app-layout-sidenav.component';
import { OAppLayoutComponent } from './o-app-layout.component';
var OAppLayoutModule = (function () {
    function OAppLayoutModule() {
    }
    OAppLayoutModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, OSharedModule, RouterModule, OAppSidenavModule, OAppHeaderModule],
                    declarations: [OAppLayoutComponent, OAppLayoutHeaderComponent, OAppLayoutSidenavComponent],
                    exports: [OAppLayoutComponent, OAppLayoutHeaderComponent, OAppLayoutSidenavComponent]
                },] }
    ];
    return OAppLayoutModule;
}());
export { OAppLayoutModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtbGF5b3V0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9hcHAtbGF5b3V0L28tYXBwLWxheW91dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQ25GLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxtREFBbUQsQ0FBQztBQUM5RixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUNqRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvRDtJQUFBO0lBS2dDLENBQUM7O2dCQUxoQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUM7b0JBQ3pGLFlBQVksRUFBRSxDQUFDLG1CQUFtQixFQUFFLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDO29CQUMxRixPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQztpQkFDdEY7O0lBQytCLHVCQUFDO0NBQUEsQUFMakMsSUFLaUM7U0FBcEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBPQXBwSGVhZGVyTW9kdWxlIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9hcHAtaGVhZGVyL28tYXBwLWhlYWRlci5tb2R1bGUnO1xuaW1wb3J0IHsgT0FwcFNpZGVuYXZNb2R1bGUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FwcC1zaWRlbmF2L28tYXBwLXNpZGVuYXYubW9kdWxlJztcbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPQXBwTGF5b3V0SGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAtbGF5b3V0LWhlYWRlci9vLWFwcC1sYXlvdXQtaGVhZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQXBwTGF5b3V0U2lkZW5hdkNvbXBvbmVudCB9IGZyb20gJy4vYXBwLWxheW91dC1zaWRlbmF2L28tYXBwLWxheW91dC1zaWRlbmF2LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQXBwTGF5b3V0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWFwcC1sYXlvdXQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgUm91dGVyTW9kdWxlLCBPQXBwU2lkZW5hdk1vZHVsZSwgT0FwcEhlYWRlck1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW09BcHBMYXlvdXRDb21wb25lbnQsIE9BcHBMYXlvdXRIZWFkZXJDb21wb25lbnQsIE9BcHBMYXlvdXRTaWRlbmF2Q29tcG9uZW50XSxcbiAgZXhwb3J0czogW09BcHBMYXlvdXRDb21wb25lbnQsIE9BcHBMYXlvdXRIZWFkZXJDb21wb25lbnQsIE9BcHBMYXlvdXRTaWRlbmF2Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPQXBwTGF5b3V0TW9kdWxlIHsgfVxuIl19