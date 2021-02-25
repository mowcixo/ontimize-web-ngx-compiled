import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputComponent } from './o-text-input.component';
export class OTextInputModule {
}
OTextInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OTextInputComponent],
                imports: [OSharedModule, CommonModule],
                exports: [OTextInputComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10ZXh0LWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBTy9ELE1BQU0sT0FBTyxnQkFBZ0I7OztZQUw1QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUM7Z0JBQ3RDLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2FBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPVGV4dElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLXRleHQtaW5wdXQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT1RleHRJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtPU2hhcmVkTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBleHBvcnRzOiBbT1RleHRJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT1RleHRJbnB1dE1vZHVsZSB7XG59XG4iXX0=