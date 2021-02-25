import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OSearchInputModule } from '../search-input/o-search-input.module';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
import { OListPickerComponent } from './o-list-picker.component';
var OListPickerModule = (function () {
    function OListPickerModule() {
    }
    OListPickerModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OListPickerDialogComponent, OListPickerComponent],
                    imports: [CommonModule, OSharedModule, OSearchInputModule],
                    exports: [OListPickerComponent],
                    entryComponents: [OListPickerDialogComponent]
                },] }
    ];
    return OListPickerModule;
}());
export { OListPickerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvbGlzdHBpY2tlci9vLWxpc3QtcGlja2VyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFakU7SUFBQTtJQU1pQyxDQUFDOztnQkFOakMsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixDQUFDO29CQUNoRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxFQUFFLGtCQUFrQixDQUFDO29CQUMxRCxPQUFPLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDL0IsZUFBZSxFQUFFLENBQUMsMEJBQTBCLENBQUM7aUJBQzlDOztJQUNnQyx3QkFBQztDQUFBLEFBTmxDLElBTWtDO1NBQXJCLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1NlYXJjaElucHV0TW9kdWxlIH0gZnJvbSAnLi4vc2VhcmNoLWlucHV0L28tc2VhcmNoLWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPTGlzdFBpY2tlckRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9MaXN0UGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWxpc3QtcGlja2VyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50LCBPTGlzdFBpY2tlckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGUsIE9TZWFyY2hJbnB1dE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPTGlzdFBpY2tlckNvbXBvbmVudF0sXG4gIGVudHJ5Q29tcG9uZW50czogW09MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPTGlzdFBpY2tlck1vZHVsZSB7IH1cbiJdfQ==