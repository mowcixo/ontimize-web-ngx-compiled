import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
var OBreadcrumbService = (function () {
    function OBreadcrumbService(injector) {
        this.injector = injector;
        this.breadcrumbs$ = new BehaviorSubject([]);
    }
    OBreadcrumbService.decorators = [
        { type: Injectable, args: [{ providedIn: 'root' },] }
    ];
    OBreadcrumbService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OBreadcrumbService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OBreadcrumbService_Factory() { return new OBreadcrumbService(i0.ɵɵinject(i0.INJECTOR)); }, token: OBreadcrumbService, providedIn: "root" });
    return OBreadcrumbService;
}());
export { OBreadcrumbService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1icmVhZGNydW1iLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL28tYnJlYWRjcnVtYi5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBSXZDO0lBS0UsNEJBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFGakMsaUJBQVksR0FBbUMsSUFBSSxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFbEMsQ0FBQzs7Z0JBTDlDLFVBQVUsU0FBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OztnQkFMYixRQUFROzs7NkJBQTdCO0NBWUMsQUFQRCxJQU9DO1NBTlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPQnJlYWRjcnVtYiB9IGZyb20gJy4uL3R5cGVzL28tYnJlYWRjcnVtYi1pdGVtLnR5cGUnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE9CcmVhZGNydW1iU2VydmljZSB7XG5cbiAgcHVibGljIGJyZWFkY3J1bWJzJDogQmVoYXZpb3JTdWJqZWN0PE9CcmVhZGNydW1iW10+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcikgeyB9XG5cbn1cbiJdfQ==