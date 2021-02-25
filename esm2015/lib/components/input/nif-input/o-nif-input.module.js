import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { ONIFInputComponent } from './o-nif-input.component';
export class ONIFInputModule {
}
ONIFInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ONIFInputComponent],
                imports: [OSharedModule, CommonModule, OTextInputModule],
                exports: [ONIFInputComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1uaWYtaW5wdXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L25pZi1pbnB1dC9vLW5pZi1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBTzdELE1BQU0sT0FBTyxlQUFlOzs7WUFMM0IsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixDQUFDO2dCQUN4RCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQzthQUM5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1RleHRJbnB1dE1vZHVsZSB9IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPTklGSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL28tbmlmLWlucHV0LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09OSUZJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtPU2hhcmVkTW9kdWxlLCBDb21tb25Nb2R1bGUsIE9UZXh0SW5wdXRNb2R1bGVdLFxuICBleHBvcnRzOiBbT05JRklucHV0Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPTklGSW5wdXRNb2R1bGUge1xufVxuIl19