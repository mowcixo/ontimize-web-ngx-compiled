import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_SORT_HEADER_INTL_PROVIDER } from '@angular/material';
import { OMatSort } from './o-mat-sort';
import { OMatSortHeader } from './o-mat-sort-header';
var OMatSortModule = (function () {
    function OMatSortModule() {
    }
    OMatSortModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    exports: [OMatSort, OMatSortHeader],
                    declarations: [OMatSort, OMatSortHeader],
                    providers: [MAT_SORT_HEADER_INTL_PROVIDER]
                },] }
    ];
    return OMatSortModule;
}());
export { OMatSortModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtc29ydC1tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQtbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDeEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXJEO0lBQUE7SUFNOEIsQ0FBQzs7Z0JBTjlCLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUM7b0JBQ25DLFlBQVksRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUM7b0JBQ3hDLFNBQVMsRUFBRSxDQUFDLDZCQUE2QixDQUFDO2lCQUMzQzs7SUFDNkIscUJBQUM7Q0FBQSxBQU4vQixJQU0rQjtTQUFsQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfU09SVF9IRUFERVJfSU5UTF9QUk9WSURFUiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT01hdFNvcnQgfSBmcm9tICcuL28tbWF0LXNvcnQnO1xuaW1wb3J0IHsgT01hdFNvcnRIZWFkZXIgfSBmcm9tICcuL28tbWF0LXNvcnQtaGVhZGVyJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPTWF0U29ydCwgT01hdFNvcnRIZWFkZXJdLFxuICBkZWNsYXJhdGlvbnM6IFtPTWF0U29ydCwgT01hdFNvcnRIZWFkZXJdLFxuICBwcm92aWRlcnM6IFtNQVRfU09SVF9IRUFERVJfSU5UTF9QUk9WSURFUl1cbn0pXG5leHBvcnQgY2xhc3MgT01hdFNvcnRNb2R1bGUgeyB9XG4iXX0=