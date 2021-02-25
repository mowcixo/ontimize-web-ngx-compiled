import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OSlideToggleComponent } from './o-slide-toggle.component';
var OSlideToggleModule = (function () {
    function OSlideToggleModule() {
    }
    OSlideToggleModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OSlideToggleComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OSlideToggleComponent]
                },] }
    ];
    return OSlideToggleModule;
}());
export { OSlideToggleModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbGlkZS10b2dnbGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NsaWRlLXRvZ2dsZS9vLXNsaWRlLXRvZ2dsZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRW5FO0lBQUE7SUFLa0MsQ0FBQzs7Z0JBTGxDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDckMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMscUJBQXFCLENBQUM7aUJBQ2pDOztJQUNpQyx5QkFBQztDQUFBLEFBTG5DLElBS21DO1NBQXRCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1NsaWRlVG9nZ2xlQ29tcG9uZW50IH0gZnJvbSAnLi9vLXNsaWRlLXRvZ2dsZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPU2xpZGVUb2dnbGVDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09TbGlkZVRvZ2dsZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT1NsaWRlVG9nZ2xlTW9kdWxlIHsgfVxuIl19