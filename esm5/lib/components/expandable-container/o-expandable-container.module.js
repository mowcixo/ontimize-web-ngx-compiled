import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OExpandableContainerComponent } from './o-expandable-container.component';
var OExpandableContainerModule = (function () {
    function OExpandableContainerModule() {
    }
    OExpandableContainerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, OSharedModule],
                    exports: [OExpandableContainerComponent],
                    declarations: [
                        OExpandableContainerComponent
                    ],
                },] }
    ];
    return OExpandableContainerModule;
}());
export { OExpandableContainerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1leHBhbmRhYmxlLWNvbnRhaW5lci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZXhwYW5kYWJsZS1jb250YWluZXIvby1leHBhbmRhYmxlLWNvbnRhaW5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBRW5GO0lBQUE7SUFRMEMsQ0FBQzs7Z0JBUjFDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUN0QyxPQUFPLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQztvQkFDeEMsWUFBWSxFQUFFO3dCQUNiLDZCQUE2QjtxQkFDN0I7aUJBRUY7O0lBQ3lDLGlDQUFDO0NBQUEsQUFSM0MsSUFRMkM7U0FBOUIsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPRXhwYW5kYWJsZUNvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vby1leHBhbmRhYmxlLWNvbnRhaW5lci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50XSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICBPRXhwYW5kYWJsZUNvbnRhaW5lckNvbXBvbmVudFxuICBdLFxuXG59KVxuZXhwb3J0IGNsYXNzIE9FeHBhbmRhYmxlQ29udGFpbmVyTW9kdWxlIHsgfVxuIl19