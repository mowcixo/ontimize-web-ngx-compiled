import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatTooltipModule } from '@angular/material';
import { OMatErrorComponent } from './o-mat-error';
export class OMatErrorModule {
}
OMatErrorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OMatErrorComponent],
                imports: [MatTooltipModule, MatFormFieldModule, CommonModule],
                exports: [OMatErrorComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtZXJyb3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvbWF0ZXJpYWwvby1tYXQtZXJyb3Ivby1tYXQtZXJyb3IubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXpFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU9uRCxNQUFNLE9BQU8sZUFBZTs7O1lBTDNCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDbEMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxDQUFDO2dCQUM3RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQzthQUM5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkTW9kdWxlLCBNYXRUb29sdGlwTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBPTWF0RXJyb3JDb21wb25lbnQgfSBmcm9tICcuL28tbWF0LWVycm9yJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT01hdEVycm9yQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW01hdFRvb2x0aXBNb2R1bGUsIE1hdEZvcm1GaWVsZE1vZHVsZSwgQ29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW09NYXRFcnJvckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT01hdEVycm9yTW9kdWxlIHtcbn1cbiJdfQ==