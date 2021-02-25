import { Injectable } from '@angular/core';
import { DefaultOTableDataSource } from './default-o-table.datasource';
var OTableDataSourceService = (function () {
    function OTableDataSourceService() {
    }
    OTableDataSourceService.prototype.getInstance = function (table) {
        return new DefaultOTableDataSource(table);
    };
    OTableDataSourceService.decorators = [
        { type: Injectable }
    ];
    OTableDataSourceService.ctorParameters = function () { return []; };
    return OTableDataSourceService;
}());
export { OTableDataSourceService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1kYXRhc291cmNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9vLXRhYmxlLWRhdGFzb3VyY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFO0lBR0U7SUFBZ0IsQ0FBQztJQUVqQiw2Q0FBVyxHQUFYLFVBQVksS0FBc0I7UUFDaEMsT0FBTyxJQUFJLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7O2dCQVBGLFVBQVU7OztJQVFYLDhCQUFDO0NBQUEsQUFSRCxJQVFDO1NBUFksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEZWZhdWx0T1RhYmxlRGF0YVNvdXJjZSB9IGZyb20gJy4vZGVmYXVsdC1vLXRhYmxlLmRhdGFzb3VyY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT1RhYmxlRGF0YVNvdXJjZVNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgZ2V0SW5zdGFuY2UodGFibGU6IE9UYWJsZUNvbXBvbmVudCkge1xuICAgIHJldHVybiBuZXcgRGVmYXVsdE9UYWJsZURhdGFTb3VyY2UodGFibGUpO1xuICB9XG59XG4iXX0=