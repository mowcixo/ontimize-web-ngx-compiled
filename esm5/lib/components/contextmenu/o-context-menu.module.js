import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OContextMenuGroupComponent } from './context-menu-group/o-context-menu-group.component';
import { OContextMenuItemComponent } from './context-menu-item/o-context-menu-item.component';
import { OContextMenuSeparatorComponent } from './context-menu-separator/o-context-menu-separator.component';
import { OContextMenuContentComponent } from './context-menu/o-context-menu-content.component';
import { OWrapperContentMenuComponent } from './context-menu/o-wrapper-content-menu/o-wrapper-content-menu.component';
import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuDirective } from './o-context-menu.directive';
var OContextMenuModule = (function () {
    function OContextMenuModule() {
    }
    OContextMenuModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, OSharedModule],
                    entryComponents: [OContextMenuContentComponent, OContextMenuComponent],
                    exports: [CommonModule, OContextMenuDirective, OContextMenuComponent, OContextMenuItemComponent, OContextMenuGroupComponent, OContextMenuSeparatorComponent],
                    declarations: [
                        OContextMenuDirective,
                        OContextMenuContentComponent,
                        OContextMenuComponent,
                        OContextMenuItemComponent,
                        OContextMenuGroupComponent,
                        OWrapperContentMenuComponent,
                        OContextMenuSeparatorComponent
                    ]
                },] }
    ];
    return OContextMenuModule;
}());
export { OContextMenuModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDOUYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDN0csT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDL0YsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sd0VBQXdFLENBQUM7QUFDdEgsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbkU7SUFBQTtJQWFrQyxDQUFDOztnQkFibEMsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7b0JBQ3RDLGVBQWUsRUFBRSxDQUFDLDRCQUE0QixFQUFFLHFCQUFxQixDQUFDO29CQUN0RSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUseUJBQXlCLEVBQUUsMEJBQTBCLEVBQUUsOEJBQThCLENBQUM7b0JBQzVKLFlBQVksRUFBRTt3QkFDWixxQkFBcUI7d0JBQ3JCLDRCQUE0Qjt3QkFDNUIscUJBQXFCO3dCQUNyQix5QkFBeUI7d0JBQ3pCLDBCQUEwQjt3QkFDMUIsNEJBQTRCO3dCQUM1Qiw4QkFBOEI7cUJBQUM7aUJBQ2xDOztJQUNpQyx5QkFBQztDQUFBLEFBYm5DLElBYW1DO1NBQXRCLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51R3JvdXBDb21wb25lbnQgfSBmcm9tICcuL2NvbnRleHQtbWVudS1ncm91cC9vLWNvbnRleHQtbWVudS1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vY29udGV4dC1tZW51LWl0ZW0vby1jb250ZXh0LW1lbnUtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51U2VwYXJhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb250ZXh0LW1lbnUtc2VwYXJhdG9yL28tY29udGV4dC1tZW51LXNlcGFyYXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51Q29udGVudENvbXBvbmVudCB9IGZyb20gJy4vY29udGV4dC1tZW51L28tY29udGV4dC1tZW51LWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IE9XcmFwcGVyQ29udGVudE1lbnVDb21wb25lbnQgfSBmcm9tICcuL2NvbnRleHQtbWVudS9vLXdyYXBwZXItY29udGVudC1tZW51L28td3JhcHBlci1jb250ZW50LW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db250ZXh0TWVudUNvbXBvbmVudCB9IGZyb20gJy4vby1jb250ZXh0LW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db250ZXh0TWVudURpcmVjdGl2ZSB9IGZyb20gJy4vby1jb250ZXh0LW1lbnUuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGVudHJ5Q29tcG9uZW50czogW09Db250ZXh0TWVudUNvbnRlbnRDb21wb25lbnQsIE9Db250ZXh0TWVudUNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtDb21tb25Nb2R1bGUsIE9Db250ZXh0TWVudURpcmVjdGl2ZSwgT0NvbnRleHRNZW51Q29tcG9uZW50LCBPQ29udGV4dE1lbnVJdGVtQ29tcG9uZW50LCBPQ29udGV4dE1lbnVHcm91cENvbXBvbmVudCwgT0NvbnRleHRNZW51U2VwYXJhdG9yQ29tcG9uZW50XSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgT0NvbnRleHRNZW51RGlyZWN0aXZlLFxuICAgIE9Db250ZXh0TWVudUNvbnRlbnRDb21wb25lbnQsXG4gICAgT0NvbnRleHRNZW51Q29tcG9uZW50LFxuICAgIE9Db250ZXh0TWVudUl0ZW1Db21wb25lbnQsXG4gICAgT0NvbnRleHRNZW51R3JvdXBDb21wb25lbnQsXG4gICAgT1dyYXBwZXJDb250ZW50TWVudUNvbXBvbmVudCxcbiAgICBPQ29udGV4dE1lbnVTZXBhcmF0b3JDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9Db250ZXh0TWVudU1vZHVsZSB7IH1cbiJdfQ==