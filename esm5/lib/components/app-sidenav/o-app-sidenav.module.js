import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.module';
import { OAppSidenavImageComponent } from './image/o-app-sidenav-image.component';
import { OAppSidenavMenuGroupComponent } from './menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavMenuItemComponent } from './menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavComponent } from './o-app-sidenav.component';
var OAppSidenavModule = (function () {
    function OAppSidenavModule() {
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
    return OAppSidenavModule;
}());
export { OAppSidenavModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvby1hcHAtc2lkZW5hdi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUMxRixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNsRixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUNoRyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUM3RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVqRTtJQUFBO0lBVWlDLENBQUM7O2dCQVZqQyxRQUFRLFNBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsdUJBQXVCLENBQUM7b0JBQzdFLFlBQVksRUFBRTt3QkFDVixvQkFBb0I7d0JBQ3BCLDZCQUE2Qjt3QkFDN0IseUJBQXlCO3dCQUN6Qiw0QkFBNEI7cUJBQy9CO29CQUNELE9BQU8sRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNsQzs7SUFDZ0Msd0JBQUM7Q0FBQSxBQVZsQyxJQVVrQztTQUFyQixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPTGFuZ3VhZ2VTZWxlY3Rvck1vZHVsZSB9IGZyb20gJy4uL2xhbmd1YWdlLXNlbGVjdG9yL28tbGFuZ3VhZ2Utc2VsZWN0b3IubW9kdWxlJztcbmltcG9ydCB7IE9BcHBTaWRlbmF2SW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL2ltYWdlL28tYXBwLXNpZGVuYXYtaW1hZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE9BcHBTaWRlbmF2TWVudUdyb3VwQ29tcG9uZW50IH0gZnJvbSAnLi9tZW51LWdyb3VwL28tYXBwLXNpZGVuYXYtbWVudS1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0FwcFNpZGVuYXZNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vbWVudS1pdGVtL28tYXBwLXNpZGVuYXYtbWVudS1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQXBwU2lkZW5hdkNvbXBvbmVudCB9IGZyb20gJy4vby1hcHAtc2lkZW5hdi5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGUsIFJvdXRlck1vZHVsZSwgT0xhbmd1YWdlU2VsZWN0b3JNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBPQXBwU2lkZW5hdkNvbXBvbmVudCxcbiAgICAgICAgT0FwcFNpZGVuYXZNZW51R3JvdXBDb21wb25lbnQsXG4gICAgICAgIE9BcHBTaWRlbmF2SW1hZ2VDb21wb25lbnQsXG4gICAgICAgIE9BcHBTaWRlbmF2TWVudUl0ZW1Db21wb25lbnRcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtPQXBwU2lkZW5hdkNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0FwcFNpZGVuYXZNb2R1bGUgeyB9XG4iXX0=