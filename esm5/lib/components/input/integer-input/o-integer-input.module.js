import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OIntegerInputComponent } from './o-integer-input.component';
var OIntegerInputModule = (function () {
    function OIntegerInputModule() {
    }
    OIntegerInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OIntegerInputComponent],
                    imports: [CommonModule, OSharedModule, OTextInputModule],
                    exports: [OIntegerInputComponent]
                },] }
    ];
    return OIntegerInputModule;
}());
export { OIntegerInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbnRlZ2VyLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9pbnRlZ2VyLWlucHV0L28taW50ZWdlci1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXJFO0lBQUE7SUFLbUMsQ0FBQzs7Z0JBTG5DLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDeEQsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOztJQUNrQywwQkFBQztDQUFBLEFBTHBDLElBS29DO1NBQXZCLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1RleHRJbnB1dE1vZHVsZSB9IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPSW50ZWdlcklucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWludGVnZXItaW5wdXQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT0ludGVnZXJJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGUsIE9UZXh0SW5wdXRNb2R1bGVdLFxuICBleHBvcnRzOiBbT0ludGVnZXJJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0ludGVnZXJJbnB1dE1vZHVsZSB7IH1cbiJdfQ==