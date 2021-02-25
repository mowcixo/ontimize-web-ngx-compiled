import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OUserInfoComponent } from './o-user-info.component';
var OUserInfoModule = (function () {
    function OUserInfoModule() {
    }
    OUserInfoModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OUserInfoComponent],
                    imports: [CommonModule, OSharedModule, RouterModule],
                    exports: [OUserInfoComponent]
                },] }
    ];
    return OUserInfoModule;
}());
export { OUserInfoModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby11c2VyLWluZm8ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3VzZXItaW5mby9vLXVzZXItaW5mby5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU3RDtJQUFBO0lBSytCLENBQUM7O2dCQUwvQixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQ2xDLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO29CQUNwRCxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDOUI7O0lBQzhCLHNCQUFDO0NBQUEsQUFMaEMsSUFLZ0M7U0FBbkIsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9Vc2VySW5mb0NvbXBvbmVudCB9IGZyb20gJy4vby11c2VyLWluZm8uY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT1VzZXJJbmZvQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgZXhwb3J0czogW09Vc2VySW5mb0NvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT1VzZXJJbmZvTW9kdWxlIHsgfVxuIl19