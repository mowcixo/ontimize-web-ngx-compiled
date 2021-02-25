import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OComboSearchComponent } from './combo-search/o-combo-search.component';
import { OComboComponent } from './o-combo.component';
var OComboModule = (function () {
    function OComboModule() {
    }
    OComboModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OComboComponent, OComboSearchComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OComboComponent, OComboSearchComponent]
                },] }
    ];
    return OComboModule;
}());
export { OComboModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21iby5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY29tYm8vby1jb21iby5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RDtJQUFBO0lBSzRCLENBQUM7O2dCQUw1QixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLHFCQUFxQixDQUFDO29CQUN0RCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUN0QyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7aUJBQ2xEOztJQUMyQixtQkFBQztDQUFBLEFBTDdCLElBSzZCO1NBQWhCLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9Db21ib1NlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vY29tYm8tc2VhcmNoL28tY29tYm8tc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29tYm9Db21wb25lbnQgfSBmcm9tICcuL28tY29tYm8uY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT0NvbWJvQ29tcG9uZW50LCBPQ29tYm9TZWFyY2hDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09Db21ib0NvbXBvbmVudCwgT0NvbWJvU2VhcmNoQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPQ29tYm9Nb2R1bGUgeyB9XG4iXX0=