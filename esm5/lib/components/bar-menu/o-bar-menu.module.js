import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OLocaleBarMenuItemComponent } from './locale-menu-item/o-locale-bar-menu-item.component';
import { OBarMenuGroupComponent } from './menu-group/o-bar-menu-group.component';
import { OBarMenuItemComponent } from './menu-item/o-bar-menu-item.component';
import { OBarMenuNestedComponent } from './menu-nested/o-bar-menu-nested.component';
import { OBarMenuSeparatorComponent } from './menu-separator/o-bar-menu-separator.component';
import { OBarMenuComponent } from './o-bar-menu.component';
var OBarMenuModule = (function () {
    function OBarMenuModule() {
    }
    OBarMenuModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        OBarMenuComponent,
                        OBarMenuItemComponent,
                        OBarMenuGroupComponent,
                        OLocaleBarMenuItemComponent,
                        OBarMenuSeparatorComponent,
                        OBarMenuNestedComponent
                    ],
                    imports: [
                        CommonModule,
                        OSharedModule,
                        RouterModule
                    ],
                    exports: [
                        OBarMenuComponent,
                        OBarMenuItemComponent,
                        OBarMenuGroupComponent,
                        OLocaleBarMenuItemComponent,
                        OBarMenuSeparatorComponent,
                        OBarMenuNestedComponent
                    ]
                },] }
    ];
    return OBarMenuModule;
}());
export { OBarMenuModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvby1iYXItbWVudS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxxREFBcUQsQ0FBQztBQUNsRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUNqRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM5RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUNwRixPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpREFBaUQsQ0FBQztBQUM3RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUUzRDtJQUFBO0lBd0JBLENBQUM7O2dCQXhCQSxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFO3dCQUNaLGlCQUFpQjt3QkFDakIscUJBQXFCO3dCQUNyQixzQkFBc0I7d0JBQ3RCLDJCQUEyQjt3QkFDM0IsMEJBQTBCO3dCQUMxQix1QkFBdUI7cUJBQ3hCO29CQUNELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGFBQWE7d0JBQ2IsWUFBWTtxQkFDYjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsaUJBQWlCO3dCQUNqQixxQkFBcUI7d0JBQ3JCLHNCQUFzQjt3QkFDdEIsMkJBQTJCO3dCQUMzQiwwQkFBMEI7d0JBQzFCLHVCQUF1QjtxQkFDeEI7aUJBQ0Y7O0lBRUQscUJBQUM7Q0FBQSxBQXhCRCxJQXdCQztTQURZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPTG9jYWxlQmFyTWVudUl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2xvY2FsZS1tZW51LWl0ZW0vby1sb2NhbGUtYmFyLW1lbnUtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Jhck1lbnVHcm91cENvbXBvbmVudCB9IGZyb20gJy4vbWVudS1ncm91cC9vLWJhci1tZW51LWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQmFyTWVudUl0ZW1Db21wb25lbnQgfSBmcm9tICcuL21lbnUtaXRlbS9vLWJhci1tZW51LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9CYXJNZW51TmVzdGVkQ29tcG9uZW50IH0gZnJvbSAnLi9tZW51LW5lc3RlZC9vLWJhci1tZW51LW5lc3RlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Jhck1lbnVTZXBhcmF0b3JDb21wb25lbnQgfSBmcm9tICcuL21lbnUtc2VwYXJhdG9yL28tYmFyLW1lbnUtc2VwYXJhdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQmFyTWVudUNvbXBvbmVudCB9IGZyb20gJy4vby1iYXItbWVudS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBPQmFyTWVudUNvbXBvbmVudCxcbiAgICBPQmFyTWVudUl0ZW1Db21wb25lbnQsXG4gICAgT0Jhck1lbnVHcm91cENvbXBvbmVudCxcbiAgICBPTG9jYWxlQmFyTWVudUl0ZW1Db21wb25lbnQsXG4gICAgT0Jhck1lbnVTZXBhcmF0b3JDb21wb25lbnQsXG4gICAgT0Jhck1lbnVOZXN0ZWRDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBPU2hhcmVkTW9kdWxlLFxuICAgIFJvdXRlck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgT0Jhck1lbnVDb21wb25lbnQsXG4gICAgT0Jhck1lbnVJdGVtQ29tcG9uZW50LFxuICAgIE9CYXJNZW51R3JvdXBDb21wb25lbnQsXG4gICAgT0xvY2FsZUJhck1lbnVJdGVtQ29tcG9uZW50LFxuICAgIE9CYXJNZW51U2VwYXJhdG9yQ29tcG9uZW50LFxuICAgIE9CYXJNZW51TmVzdGVkQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT0Jhck1lbnVNb2R1bGUge1xufVxuIl19