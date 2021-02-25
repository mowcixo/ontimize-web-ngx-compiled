import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OBreadcrumbComponent } from '../../components/breadcrumb/o-breadcrumb.component';
import { OSharedModule } from '../../shared/shared.module';
import { OFormContainerComponent } from './o-form-container.component';
var OFormContainerModule = (function () {
    function OFormContainerModule() {
    }
    OFormContainerModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OFormContainerComponent],
                    imports: [OSharedModule, CommonModule],
                    entryComponents: [OBreadcrumbComponent],
                    exports: [OFormContainerComponent]
                },] }
    ];
    return OFormContainerModule;
}());
export { OFormContainerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWNvbnRhaW5lci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybS1jb250YWluZXIvby1mb3JtLWNvbnRhaW5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDMUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFO0lBQUE7SUFPQSxDQUFDOztnQkFQQSxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUM7b0JBQ3RDLGVBQWUsRUFBRSxDQUFDLG9CQUFvQixDQUFDO29CQUN2QyxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDbkM7O0lBRUQsMkJBQUM7Q0FBQSxBQVBELElBT0M7U0FEWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0JyZWFkY3J1bWJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2JyZWFkY3J1bWIvby1icmVhZGNydW1iLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0Zvcm1Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL28tZm9ybS1jb250YWluZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT0Zvcm1Db250YWluZXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbT1NoYXJlZE1vZHVsZSwgQ29tbW9uTW9kdWxlXSxcbiAgZW50cnlDb21wb25lbnRzOiBbT0JyZWFkY3J1bWJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbT0Zvcm1Db250YWluZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtQ29udGFpbmVyTW9kdWxlIHtcbn1cbiJdfQ==