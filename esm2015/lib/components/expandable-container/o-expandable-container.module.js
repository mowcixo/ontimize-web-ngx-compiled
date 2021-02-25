import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OExpandableContainerComponent } from './o-expandable-container.component';
export class OExpandableContainerModule {
}
OExpandableContainerModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, OSharedModule],
                exports: [OExpandableContainerComponent],
                declarations: [
                    OExpandableContainerComponent
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1leHBhbmRhYmxlLWNvbnRhaW5lci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZXhwYW5kYWJsZS1jb250YWluZXIvby1leHBhbmRhYmxlLWNvbnRhaW5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBVW5GLE1BQU0sT0FBTywwQkFBMEI7OztZQVJ0QyxRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztnQkFDdEMsT0FBTyxFQUFFLENBQUMsNkJBQTZCLENBQUM7Z0JBQ3hDLFlBQVksRUFBRTtvQkFDYiw2QkFBNkI7aUJBQzdCO2FBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWV4cGFuZGFibGUtY29udGFpbmVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGVdLFxuICBleHBvcnRzOiBbT0V4cGFuZGFibGVDb250YWluZXJDb21wb25lbnRdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgIE9FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50XG4gIF0sXG5cbn0pXG5leHBvcnQgY2xhc3MgT0V4cGFuZGFibGVDb250YWluZXJNb2R1bGUgeyB9XG4iXX0=