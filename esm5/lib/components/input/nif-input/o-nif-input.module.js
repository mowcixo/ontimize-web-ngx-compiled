import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { ONIFInputComponent } from './o-nif-input.component';
var ONIFInputModule = (function () {
    function ONIFInputModule() {
    }
    ONIFInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [ONIFInputComponent],
                    imports: [OSharedModule, CommonModule, OTextInputModule],
                    exports: [ONIFInputComponent]
                },] }
    ];
    return ONIFInputModule;
}());
export { ONIFInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1uaWYtaW5wdXQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L25pZi1pbnB1dC9vLW5pZi1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTdEO0lBQUE7SUFNQSxDQUFDOztnQkFOQSxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7b0JBQ3hELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUM5Qjs7SUFFRCxzQkFBQztDQUFBLEFBTkQsSUFNQztTQURZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9UZXh0SW5wdXRNb2R1bGUgfSBmcm9tICcuLi90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5tb2R1bGUnO1xuaW1wb3J0IHsgT05JRklucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLW5pZi1pbnB1dC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPTklGSW5wdXRDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbT1NoYXJlZE1vZHVsZSwgQ29tbW9uTW9kdWxlLCBPVGV4dElucHV0TW9kdWxlXSxcbiAgZXhwb3J0czogW09OSUZJbnB1dENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT05JRklucHV0TW9kdWxlIHtcbn1cbiJdfQ==