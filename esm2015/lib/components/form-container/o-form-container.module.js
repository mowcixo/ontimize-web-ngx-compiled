import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OBreadcrumbComponent } from '../../components/breadcrumb/o-breadcrumb.component';
import { OSharedModule } from '../../shared/shared.module';
import { OFormContainerComponent } from './o-form-container.component';
export class OFormContainerModule {
}
OFormContainerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OFormContainerComponent],
                imports: [OSharedModule, CommonModule],
                entryComponents: [OBreadcrumbComponent],
                exports: [OFormContainerComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWNvbnRhaW5lci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybS1jb250YWluZXIvby1mb3JtLWNvbnRhaW5lci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDMUYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBUXZFLE1BQU0sT0FBTyxvQkFBb0I7OztZQU5oQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7Z0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUM7Z0JBQ3RDLGVBQWUsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzthQUNuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPQnJlYWRjcnVtYkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYnJlYWRjcnVtYi9vLWJyZWFkY3J1bWIuY29tcG9uZW50JztcbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPRm9ybUNvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vby1mb3JtLWNvbnRhaW5lci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPRm9ybUNvbnRhaW5lckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtPU2hhcmVkTW9kdWxlLCBDb21tb25Nb2R1bGVdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtPQnJlYWRjcnVtYkNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtPRm9ybUNvbnRhaW5lckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1Db250YWluZXJNb2R1bGUge1xufVxuIl19