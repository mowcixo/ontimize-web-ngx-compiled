import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var OTableExportButtonService = (function () {
    function OTableExportButtonService() {
        this.export$ = new Subject();
    }
    OTableExportButtonService.decorators = [
        { type: Injectable }
    ];
    return OTableExportButtonService;
}());
export { OTableExportButtonService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1leHBvcnQtYnV0dG9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9leHBvcnQtYnV0dG9uL28tdGFibGUtZXhwb3J0LWJ1dHRvbi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQjtJQUFBO1FBR1MsWUFBTyxHQUFvQixJQUFJLE9BQU8sRUFBRSxDQUFDO0lBRWxELENBQUM7O2dCQUxBLFVBQVU7O0lBS1gsZ0NBQUM7Q0FBQSxBQUxELElBS0M7U0FKWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBPVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlIHtcblxuICBwdWJsaWMgZXhwb3J0JDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcblxufVxuIl19