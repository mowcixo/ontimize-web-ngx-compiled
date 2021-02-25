import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuItemComponent } from './o-card-menu-item.component';
var OCardMenuItemModule = (function () {
    function OCardMenuItemModule() {
    }
    OCardMenuItemModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OCardMenuItemComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OCardMenuItemComponent]
                },] }
    ];
    return OCardMenuItemModule;
}());
export { OCardMenuItemModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jYXJkLW1lbnUtaXRlbS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY2FyZC1tZW51LWl0ZW0vby1jYXJkLW1lbnUtaXRlbS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXRFO0lBQUE7SUFLbUMsQ0FBQzs7Z0JBTG5DLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOztJQUNrQywwQkFBQztDQUFBLEFBTHBDLElBS29DO1NBQXZCLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0NhcmRNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vby1jYXJkLW1lbnUtaXRlbS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPQ2FyZE1lbnVJdGVtQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPQ2FyZE1lbnVJdGVtQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPQ2FyZE1lbnVJdGVtTW9kdWxlIHsgfVxuIl19