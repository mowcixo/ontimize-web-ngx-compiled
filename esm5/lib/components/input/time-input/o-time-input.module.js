import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { ODateInputModule } from '../date-input/o-date-input.module';
import { OHourInputModule } from '../hour-input/o-hour-input.module';
import { OTimeInputComponent } from './o-time-input.component';
var OTimeInputModule = (function () {
    function OTimeInputModule() {
    }
    OTimeInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OTimeInputComponent],
                    imports: [CommonModule, ODateInputModule, OHourInputModule, OSharedModule],
                    exports: [OTimeInputComponent]
                },] }
    ];
    return OTimeInputModule;
}());
export { OTimeInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10aW1lLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC90aW1lLWlucHV0L28tdGltZS1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRS9EO0lBQUE7SUFLZ0MsQ0FBQzs7Z0JBTGhDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbkMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGFBQWEsQ0FBQztvQkFDMUUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQy9COztJQUMrQix1QkFBQztDQUFBLEFBTGpDLElBS2lDO1NBQXBCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0RhdGVJbnB1dE1vZHVsZSB9IGZyb20gJy4uL2RhdGUtaW5wdXQvby1kYXRlLWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPSG91cklucHV0TW9kdWxlIH0gZnJvbSAnLi4vaG91ci1pbnB1dC9vLWhvdXItaW5wdXQubW9kdWxlJztcbmltcG9ydCB7IE9UaW1lSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL28tdGltZS1pbnB1dC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPVGltZUlucHV0Q29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT0RhdGVJbnB1dE1vZHVsZSwgT0hvdXJJbnB1dE1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPVGltZUlucHV0Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPVGltZUlucHV0TW9kdWxlIHsgfVxuIl19