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
export class OContextMenuModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDOUYsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sNkRBQTZELENBQUM7QUFDN0csT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDL0YsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sd0VBQXdFLENBQUM7QUFDdEgsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFlbkUsTUFBTSxPQUFPLGtCQUFrQjs7O1lBYjlCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO2dCQUN0QyxlQUFlLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxxQkFBcUIsQ0FBQztnQkFDdEUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLHlCQUF5QixFQUFFLDBCQUEwQixFQUFFLDhCQUE4QixDQUFDO2dCQUM1SixZQUFZLEVBQUU7b0JBQ1oscUJBQXFCO29CQUNyQiw0QkFBNEI7b0JBQzVCLHFCQUFxQjtvQkFDckIseUJBQXlCO29CQUN6QiwwQkFBMEI7b0JBQzFCLDRCQUE0QjtvQkFDNUIsOEJBQThCO2lCQUFDO2FBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVHcm91cENvbXBvbmVudCB9IGZyb20gJy4vY29udGV4dC1tZW51LWdyb3VwL28tY29udGV4dC1tZW51LWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9jb250ZXh0LW1lbnUtaXRlbS9vLWNvbnRleHQtbWVudS1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVTZXBhcmF0b3JDb21wb25lbnQgfSBmcm9tICcuL2NvbnRleHQtbWVudS1zZXBhcmF0b3Ivby1jb250ZXh0LW1lbnUtc2VwYXJhdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb250ZXh0LW1lbnUvby1jb250ZXh0LW1lbnUtY29udGVudC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1dyYXBwZXJDb250ZW50TWVudUNvbXBvbmVudCB9IGZyb20gJy4vY29udGV4dC1tZW51L28td3JhcHBlci1jb250ZW50LW1lbnUvby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51Q29tcG9uZW50IH0gZnJvbSAnLi9vLWNvbnRleHQtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51RGlyZWN0aXZlIH0gZnJvbSAnLi9vLWNvbnRleHQtbWVudS5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZW50cnlDb21wb25lbnRzOiBbT0NvbnRleHRNZW51Q29udGVudENvbXBvbmVudCwgT0NvbnRleHRNZW51Q29tcG9uZW50XSxcbiAgZXhwb3J0czogW0NvbW1vbk1vZHVsZSwgT0NvbnRleHRNZW51RGlyZWN0aXZlLCBPQ29udGV4dE1lbnVDb21wb25lbnQsIE9Db250ZXh0TWVudUl0ZW1Db21wb25lbnQsIE9Db250ZXh0TWVudUdyb3VwQ29tcG9uZW50LCBPQ29udGV4dE1lbnVTZXBhcmF0b3JDb21wb25lbnRdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBPQ29udGV4dE1lbnVEaXJlY3RpdmUsXG4gICAgT0NvbnRleHRNZW51Q29udGVudENvbXBvbmVudCxcbiAgICBPQ29udGV4dE1lbnVDb21wb25lbnQsXG4gICAgT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCxcbiAgICBPQ29udGV4dE1lbnVHcm91cENvbXBvbmVudCxcbiAgICBPV3JhcHBlckNvbnRlbnRNZW51Q29tcG9uZW50LFxuICAgIE9Db250ZXh0TWVudVNlcGFyYXRvckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0NvbnRleHRNZW51TW9kdWxlIHsgfVxuIl19