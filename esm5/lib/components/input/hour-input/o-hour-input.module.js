import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OSharedModule } from '../../../shared/shared.module';
import { OHourInputComponent } from './o-hour-input.component';
var OHourInputModule = (function () {
    function OHourInputModule() {
    }
    OHourInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OHourInputComponent],
                    imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule],
                    exports: [OHourInputComponent]
                },] }
    ];
    return OHourInputModule;
}());
export { OHourInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ob3VyLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9ob3VyLWlucHV0L28taG91ci1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRS9EO0lBQUE7SUFLZ0MsQ0FBQzs7Z0JBTGhDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbkMsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLFlBQVksRUFBRSwyQkFBMkIsQ0FBQztvQkFDbkUsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQy9COztJQUMrQix1QkFBQztDQUFBLEFBTGpDLElBS2lDO1NBQXBCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmd4TWF0ZXJpYWxUaW1lcGlja2VyTW9kdWxlIH0gZnJvbSAnbmd4LW1hdGVyaWFsLXRpbWVwaWNrZXInO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0hvdXJJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vby1ob3VyLWlucHV0LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09Ib3VySW5wdXRDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbT1NoYXJlZE1vZHVsZSwgQ29tbW9uTW9kdWxlLCBOZ3hNYXRlcmlhbFRpbWVwaWNrZXJNb2R1bGVdLFxuICBleHBvcnRzOiBbT0hvdXJJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0hvdXJJbnB1dE1vZHVsZSB7IH1cbiJdfQ==