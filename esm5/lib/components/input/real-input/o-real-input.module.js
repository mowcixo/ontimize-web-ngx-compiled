import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OIntegerInputModule } from '../integer-input/o-integer-input.module';
import { ORealInputComponent } from './o-real-input.component';
var ORealInputModule = (function () {
    function ORealInputModule() {
    }
    ORealInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [ORealInputComponent],
                    imports: [CommonModule, OSharedModule, OIntegerInputModule],
                    exports: [ORealInputComponent]
                },] }
    ];
    return ORealInputModule;
}());
export { ORealInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yZWFsLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9yZWFsLWlucHV0L28tcmVhbC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRS9EO0lBQUE7SUFLZ0MsQ0FBQzs7Z0JBTGhDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDbkMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQztvQkFDM0QsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQy9COztJQUMrQix1QkFBQztDQUFBLEFBTGpDLElBS2lDO1NBQXBCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0ludGVnZXJJbnB1dE1vZHVsZSB9IGZyb20gJy4uL2ludGVnZXItaW5wdXQvby1pbnRlZ2VyLWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPUmVhbElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLXJlYWwtaW5wdXQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT1JlYWxJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGUsIE9JbnRlZ2VySW5wdXRNb2R1bGVdLFxuICBleHBvcnRzOiBbT1JlYWxJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT1JlYWxJbnB1dE1vZHVsZSB7IH1cbiJdfQ==