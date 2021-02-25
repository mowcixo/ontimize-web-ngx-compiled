import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { ODateRangeInputComponent } from './o-daterange-input.component';
import { ODaterangepickerDirective } from './o-daterange-input.directive';
import { DaterangepickerComponent } from './o-daterange-picker.component';
var ODateRangeInputModule = (function () {
    function ODateRangeInputModule() {
    }
    ODateRangeInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [DaterangepickerComponent, ODateRangeInputComponent, ODaterangepickerDirective],
                    imports: [CommonModule, OSharedModule],
                    exports: [ODateRangeInputComponent],
                    entryComponents: [DaterangepickerComponent]
                },] }
    ];
    return ODateRangeInputModule;
}());
export { ODateRangeInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtaW5wdXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2RhdGUtcmFuZ2Uvby1kYXRlcmFuZ2UtaW5wdXQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUUxRTtJQUFBO0lBTXFDLENBQUM7O2dCQU5yQyxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsd0JBQXdCLEVBQUUsd0JBQXdCLEVBQUUseUJBQXlCLENBQUM7b0JBQzdGLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7b0JBQ3RDLE9BQU8sRUFBRSxDQUFDLHdCQUF3QixDQUFDO29CQUNuQyxlQUFlLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztpQkFDNUM7O0lBQ29DLDRCQUFDO0NBQUEsQUFOdEMsSUFNc0M7U0FBekIscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPRGF0ZVJhbmdlSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL28tZGF0ZXJhbmdlLWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1pbnB1dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1waWNrZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50LCBPRGF0ZVJhbmdlSW5wdXRDb21wb25lbnQsIE9EYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmVdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09EYXRlUmFuZ2VJbnB1dENvbXBvbmVudF0sXG4gIGVudHJ5Q29tcG9uZW50czogW0RhdGVyYW5nZXBpY2tlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0RhdGVSYW5nZUlucHV0TW9kdWxlIHsgfVxuIl19