import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OIntegerInputModule } from '../integer-input/o-integer-input.module';
import { ORealInputComponent } from './o-real-input.component';
export class ORealInputModule {
}
ORealInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ORealInputComponent],
                imports: [CommonModule, OSharedModule, OIntegerInputModule],
                exports: [ORealInputComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yZWFsLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9yZWFsLWlucHV0L28tcmVhbC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBTy9ELE1BQU0sT0FBTyxnQkFBZ0I7OztZQUw1QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsbUJBQW1CLENBQUM7Z0JBQzNELE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2FBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPSW50ZWdlcklucHV0TW9kdWxlIH0gZnJvbSAnLi4vaW50ZWdlci1pbnB1dC9vLWludGVnZXItaW5wdXQubW9kdWxlJztcbmltcG9ydCB7IE9SZWFsSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL28tcmVhbC1pbnB1dC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPUmVhbElucHV0Q29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgT0ludGVnZXJJbnB1dE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPUmVhbElucHV0Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPUmVhbElucHV0TW9kdWxlIHsgfVxuIl19