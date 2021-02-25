import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { ORealInputModule } from '../real-input/o-real-input.module';
import { OCurrencyInputComponent } from './o-currency-input.component';
export class OCurrencyInputModule {
}
OCurrencyInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OCurrencyInputComponent],
                imports: [CommonModule, OSharedModule, ORealInputModule],
                exports: [OCurrencyInputComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jdXJyZW5jeS1pbnB1dC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY3VycmVuY3ktaW5wdXQvby1jdXJyZW5jeS1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBT3ZFLE1BQU0sT0FBTyxvQkFBb0I7OztZQUxoQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3hELE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO2FBQ25DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPUmVhbElucHV0TW9kdWxlIH0gZnJvbSAnLi4vcmVhbC1pbnB1dC9vLXJlYWwtaW5wdXQubW9kdWxlJztcbmltcG9ydCB7IE9DdXJyZW5jeUlucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWN1cnJlbmN5LWlucHV0LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09DdXJyZW5jeUlucHV0Q29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgT1JlYWxJbnB1dE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPQ3VycmVuY3lJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0N1cnJlbmN5SW5wdXRNb2R1bGUgeyB9XG4iXX0=