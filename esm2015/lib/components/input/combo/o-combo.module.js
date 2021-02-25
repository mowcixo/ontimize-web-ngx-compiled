import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OComboSearchComponent } from './combo-search/o-combo-search.component';
import { OComboComponent } from './o-combo.component';
export class OComboModule {
}
OComboModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OComboComponent, OComboSearchComponent],
                imports: [CommonModule, OSharedModule],
                exports: [OComboComponent, OComboSearchComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21iby5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY29tYm8vby1jb21iby5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQU90RCxNQUFNLE9BQU8sWUFBWTs7O1lBTHhCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7Z0JBQ3RDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQzthQUNsRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0NvbWJvU2VhcmNoQ29tcG9uZW50IH0gZnJvbSAnLi9jb21iby1zZWFyY2gvby1jb21iby1zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCB7IE9Db21ib0NvbXBvbmVudCB9IGZyb20gJy4vby1jb21iby5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPQ29tYm9Db21wb25lbnQsIE9Db21ib1NlYXJjaENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGVdLFxuICBleHBvcnRzOiBbT0NvbWJvQ29tcG9uZW50LCBPQ29tYm9TZWFyY2hDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9Db21ib01vZHVsZSB7IH1cbiJdfQ==