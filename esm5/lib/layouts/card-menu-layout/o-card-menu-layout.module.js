import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OCardMenuItemModule } from '../../components/card-menu-item/o-card-menu-item.module';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuLayoutComponent } from './o-card-menu-layout.component';
var OCardMenuLayoutModule = (function () {
    function OCardMenuLayoutModule() {
    }
    OCardMenuLayoutModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OCardMenuLayoutComponent],
                    imports: [CommonModule, OCardMenuItemModule, OSharedModule],
                    exports: [OCardMenuLayoutComponent]
                },] }
    ];
    return OCardMenuLayoutModule;
}());
export { OCardMenuLayoutModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jYXJkLW1lbnUtbGF5b3V0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9jYXJkLW1lbnUtbGF5b3V0L28tY2FyZC1tZW51LWxheW91dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFDOUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRTFFO0lBQUE7SUFLcUMsQ0FBQzs7Z0JBTHJDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztvQkFDeEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsQ0FBQztvQkFDM0QsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7aUJBQ3BDOztJQUNvQyw0QkFBQztDQUFBLEFBTHRDLElBS3NDO1NBQXpCLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPQ2FyZE1lbnVJdGVtTW9kdWxlIH0gZnJvbSAnLi4vLi4vY29tcG9uZW50cy9jYXJkLW1lbnUtaXRlbS9vLWNhcmQtbWVudS1pdGVtLm1vZHVsZSc7XG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0NhcmRNZW51TGF5b3V0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWNhcmQtbWVudS1sYXlvdXQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT0NhcmRNZW51TGF5b3V0Q29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT0NhcmRNZW51SXRlbU1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPQ2FyZE1lbnVMYXlvdXRDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9DYXJkTWVudUxheW91dE1vZHVsZSB7IH1cbiJdfQ==