import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OFormNavigationComponent } from '../navigation/o-form-navigation.component';
import { OFormToolbarComponent } from './o-form-toolbar.component';
var OFormToolbarModule = (function () {
    function OFormToolbarModule() {
    }
    OFormToolbarModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OFormNavigationComponent, OFormToolbarComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OFormNavigationComponent, OFormToolbarComponent]
                },] }
    ];
    return OFormToolbarModule;
}());
export { OFormToolbarModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLXRvb2xiYXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Zvcm0vdG9vbGJhci9vLWZvcm0tdG9vbGJhci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRW5FO0lBQUE7SUFLa0MsQ0FBQzs7Z0JBTGxDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxxQkFBcUIsQ0FBQztvQkFDL0QsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsd0JBQXdCLEVBQUUscUJBQXFCLENBQUM7aUJBQzNEOztJQUNpQyx5QkFBQztDQUFBLEFBTG5DLElBS21DO1NBQXRCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0Zvcm1OYXZpZ2F0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vbmF2aWdhdGlvbi9vLWZvcm0tbmF2aWdhdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1Ub29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPRm9ybU5hdmlnYXRpb25Db21wb25lbnQsIE9Gb3JtVG9vbGJhckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGVdLFxuICBleHBvcnRzOiBbT0Zvcm1OYXZpZ2F0aW9uQ29tcG9uZW50LCBPRm9ybVRvb2xiYXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtVG9vbGJhck1vZHVsZSB7IH1cbiJdfQ==