import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OBreadcrumbComponent } from './o-breadcrumb.component';
var OBreadcrumbModule = (function () {
    function OBreadcrumbModule() {
    }
    OBreadcrumbModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, OSharedModule, RouterModule],
                    exports: [OBreadcrumbComponent],
                    declarations: [OBreadcrumbComponent]
                },] }
    ];
    return OBreadcrumbModule;
}());
export { OBreadcrumbModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1icmVhZGNydW1iLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9icmVhZGNydW1iL28tYnJlYWRjcnVtYi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRTtJQUFBO0lBS2lDLENBQUM7O2dCQUxqQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUM7b0JBQ3BELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO29CQUMvQixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztpQkFDckM7O0lBQ2dDLHdCQUFDO0NBQUEsQUFMbEMsSUFLa0M7U0FBckIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0JyZWFkY3J1bWJDb21wb25lbnQgfSBmcm9tICcuL28tYnJlYWRjcnVtYi5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlLCBSb3V0ZXJNb2R1bGVdLFxuICBleHBvcnRzOiBbT0JyZWFkY3J1bWJDb21wb25lbnRdLFxuICBkZWNsYXJhdGlvbnM6IFtPQnJlYWRjcnVtYkNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0JyZWFkY3J1bWJNb2R1bGUgeyB9XG4iXX0=