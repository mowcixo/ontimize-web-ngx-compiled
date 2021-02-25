import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OSliderComponent } from './o-slider.component';
var OSliderModule = (function () {
    function OSliderModule() {
    }
    OSliderModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OSliderComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OSliderComponent]
                },] }
    ];
    return OSliderModule;
}());
export { OSliderModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbGlkZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NsaWRlci9vLXNsaWRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXhEO0lBQUE7SUFLNkIsQ0FBQzs7Z0JBTDdCLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDaEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7aUJBQzVCOztJQUM0QixvQkFBQztDQUFBLEFBTDlCLElBSzhCO1NBQWpCLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9TbGlkZXJDb21wb25lbnQgfSBmcm9tICcuL28tc2xpZGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09TbGlkZXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09TbGlkZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9TbGlkZXJNb2R1bGUgeyB9XG4iXX0=