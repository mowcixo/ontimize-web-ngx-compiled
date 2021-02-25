import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OEmailInputComponent } from './o-email-input.component';
export class OEmailInputModule {
}
OEmailInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OEmailInputComponent],
                imports: [OSharedModule, CommonModule, OTextInputModule],
                exports: [OEmailInputComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1lbWFpbC1pbnB1dC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvZW1haWwtaW5wdXQvby1lbWFpbC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBT2pFLE1BQU0sT0FBTyxpQkFBaUI7OztZQUw3QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsb0JBQW9CLENBQUM7Z0JBQ3BDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3hELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO2FBQ2hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPVGV4dElucHV0TW9kdWxlIH0gZnJvbSAnLi4vdGV4dC1pbnB1dC9vLXRleHQtaW5wdXQubW9kdWxlJztcbmltcG9ydCB7IE9FbWFpbElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWVtYWlsLWlucHV0LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09FbWFpbElucHV0Q29tcG9uZW50XSxcbiAgaW1wb3J0czogW09TaGFyZWRNb2R1bGUsIENvbW1vbk1vZHVsZSwgT1RleHRJbnB1dE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPRW1haWxJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0VtYWlsSW5wdXRNb2R1bGUge1xufVxuIl19