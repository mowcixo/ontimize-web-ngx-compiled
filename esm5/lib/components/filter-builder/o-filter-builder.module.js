import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFilterBuilderComponent } from './o-filter-builder.component';
var OFilterBuilderModule = (function () {
    function OFilterBuilderModule() {
    }
    OFilterBuilderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        OSharedModule,
                        CommonModule
                    ],
                    declarations: [
                        OFilterBuilderComponent,
                        OFilterBuilderClearDirective,
                        OFilterBuilderQueryDirective
                    ],
                    exports: [
                        OFilterBuilderComponent,
                        OFilterBuilderClearDirective,
                        OFilterBuilderQueryDirective
                    ]
                },] }
    ];
    return OFilterBuilderModule;
}());
export { OFilterBuilderModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWx0ZXItYnVpbGRlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZmlsdGVyLWJ1aWxkZXIvby1maWx0ZXItYnVpbGRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFO0lBQUE7SUFnQm9DLENBQUM7O2dCQWhCcEMsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxhQUFhO3dCQUNiLFlBQVk7cUJBQ2I7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLHVCQUF1Qjt3QkFDdkIsNEJBQTRCO3dCQUM1Qiw0QkFBNEI7cUJBQzdCO29CQUNELE9BQU8sRUFBRTt3QkFDUCx1QkFBdUI7d0JBQ3ZCLDRCQUE0Qjt3QkFDNUIsNEJBQTRCO3FCQUM3QjtpQkFDRjs7SUFDbUMsMkJBQUM7Q0FBQSxBQWhCckMsSUFnQnFDO1NBQXhCLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0ZpbHRlckJ1aWxkZXJDbGVhckRpcmVjdGl2ZSB9IGZyb20gJy4vby1maWx0ZXItYnVpbGRlci1jbGVhci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgT0ZpbHRlckJ1aWxkZXJRdWVyeURpcmVjdGl2ZSB9IGZyb20gJy4vby1maWx0ZXItYnVpbGRlci1xdWVyeS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQgfSBmcm9tICcuL28tZmlsdGVyLWJ1aWxkZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIE9TaGFyZWRNb2R1bGUsXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE9GaWx0ZXJCdWlsZGVyQ29tcG9uZW50LFxuICAgIE9GaWx0ZXJCdWlsZGVyQ2xlYXJEaXJlY3RpdmUsXG4gICAgT0ZpbHRlckJ1aWxkZXJRdWVyeURpcmVjdGl2ZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQsXG4gICAgT0ZpbHRlckJ1aWxkZXJDbGVhckRpcmVjdGl2ZSxcbiAgICBPRmlsdGVyQnVpbGRlclF1ZXJ5RGlyZWN0aXZlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT0ZpbHRlckJ1aWxkZXJNb2R1bGUgeyB9XG4iXX0=