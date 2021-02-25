import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.module';
import { OAppSidenavImageComponent } from './image/o-app-sidenav-image.component';
import { OAppSidenavMenuGroupComponent } from './menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavMenuItemComponent } from './menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavComponent } from './o-app-sidenav.component';
export class OAppSidenavModule {
}
OAppSidenavModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, OSharedModule, RouterModule, OLanguageSelectorModule],
                declarations: [
                    OAppSidenavComponent,
                    OAppSidenavMenuGroupComponent,
                    OAppSidenavImageComponent,
                    OAppSidenavMenuItemComponent
                ],
                exports: [OAppSidenavComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvby1hcHAtc2lkZW5hdi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUMxRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNsRixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUNoRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUM3RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVlqRSxNQUFNLE9BQU8saUJBQWlCOzs7WUFWN0IsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixDQUFDO2dCQUM3RSxZQUFZLEVBQUU7b0JBQ1Ysb0JBQW9CO29CQUNwQiw2QkFBNkI7b0JBQzdCLHlCQUF5QjtvQkFDekIsNEJBQTRCO2lCQUMvQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQzthQUNsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9MYW5ndWFnZVNlbGVjdG9yTW9kdWxlIH0gZnJvbSAnLi4vbGFuZ3VhZ2Utc2VsZWN0b3Ivby1sYW5ndWFnZS1zZWxlY3Rvci5tb2R1bGUnO1xuaW1wb3J0IHsgT0FwcFNpZGVuYXZJbWFnZUNvbXBvbmVudCB9IGZyb20gJy4vaW1hZ2Uvby1hcHAtc2lkZW5hdi1pbWFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0FwcFNpZGVuYXZNZW51R3JvdXBDb21wb25lbnQgfSBmcm9tICcuL21lbnUtZ3JvdXAvby1hcHAtc2lkZW5hdi1tZW51LWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQXBwU2lkZW5hdk1lbnVJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9tZW51LWl0ZW0vby1hcHAtc2lkZW5hdi1tZW51LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9BcHBTaWRlbmF2Q29tcG9uZW50IH0gZnJvbSAnLi9vLWFwcC1zaWRlbmF2LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgUm91dGVyTW9kdWxlLCBPTGFuZ3VhZ2VTZWxlY3Rvck1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIE9BcHBTaWRlbmF2Q29tcG9uZW50LFxuICAgICAgICBPQXBwU2lkZW5hdk1lbnVHcm91cENvbXBvbmVudCxcbiAgICAgICAgT0FwcFNpZGVuYXZJbWFnZUNvbXBvbmVudCxcbiAgICAgICAgT0FwcFNpZGVuYXZNZW51SXRlbUNvbXBvbmVudFxuICAgIF0sXG4gICAgZXhwb3J0czogW09BcHBTaWRlbmF2Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPQXBwU2lkZW5hdk1vZHVsZSB7IH1cbiJdfQ==