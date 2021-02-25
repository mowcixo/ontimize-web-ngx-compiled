import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { ORowCollapsibleComponent } from './o-row-collapsible.component';
export class ORowCollapsibleModule {
}
ORowCollapsibleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ORowCollapsibleComponent],
                imports: [CommonModule, OSharedModule],
                exports: [ORowCollapsibleComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yb3ctY29sbGFwc2libGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9yb3ctY29sbGFwc2libGUvby1yb3ctY29sbGFwc2libGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQU96RSxNQUFNLE9BQU8scUJBQXFCOzs7WUFMakMsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLHdCQUF3QixDQUFDO2dCQUN4QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO2dCQUN0QyxPQUFPLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQzthQUNwQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1Jvd0NvbGxhcHNpYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9vLXJvdy1jb2xsYXBzaWJsZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPUm93Q29sbGFwc2libGVDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09Sb3dDb2xsYXBzaWJsZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT1Jvd0NvbGxhcHNpYmxlTW9kdWxlIHsgfVxuIl19