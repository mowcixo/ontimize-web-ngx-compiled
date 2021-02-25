import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from './permissions/permissions.service';
import * as i0 from "@angular/core";
var ShareCanActivateChildService = (function () {
    function ShareCanActivateChildService(injector) {
        this.injector = injector;
        this.router = this.injector.get(Router);
        this.permissionsService = this.injector.get(PermissionsService);
    }
    ShareCanActivateChildService.prototype.setPermissionsGuard = function (guard) {
        this.permissionsGuard = guard;
    };
    ShareCanActivateChildService.prototype.canActivateChildUsingPermissions = function (childRoute, state) {
        if (this.permissionsGuard) {
            return this.permissionsGuard.canActivateChild(childRoute, state);
        }
        return true;
    };
    ShareCanActivateChildService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    ShareCanActivateChildService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    ShareCanActivateChildService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ShareCanActivateChildService_Factory() { return new ShareCanActivateChildService(i0.ɵɵinject(i0.INJECTOR)); }, token: ShareCanActivateChildService, providedIn: "root" });
    return ShareCanActivateChildService;
}());
export { ShareCanActivateChildService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmUtY2FuLWFjdGl2YXRlLWNoaWxkLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL3NoYXJlLWNhbi1hY3RpdmF0ZS1jaGlsZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBMEIsTUFBTSxFQUF1QixNQUFNLGlCQUFpQixDQUFDO0FBR3RGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOztBQUV2RTtJQVNFLHNDQUFzQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELDBEQUFtQixHQUFuQixVQUFvQixLQUE4QjtRQUNoRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFFRCx1RUFBZ0MsR0FBaEMsVUFBaUMsVUFBa0MsRUFBRSxLQUEwQjtRQUM3RixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEU7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O2dCQXZCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7Z0JBUm9CLFFBQVE7Ozt1Q0FBN0I7Q0E4QkMsQUF4QkQsSUF3QkM7U0FyQlksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlciwgUm91dGVyU3RhdGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IFBlcm1pc3Npb25zR3VhcmRTZXJ2aWNlIH0gZnJvbSAnLi9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy1jYW4tYWN0aXZhdGUuZ3VhcmQnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgU2hhcmVDYW5BY3RpdmF0ZUNoaWxkU2VydmljZSB7XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uc0d1YXJkOiBQZXJtaXNzaW9uc0d1YXJkU2VydmljZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICAgIHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoUGVybWlzc2lvbnNTZXJ2aWNlKTtcbiAgfVxuXG4gIHNldFBlcm1pc3Npb25zR3VhcmQoZ3VhcmQ6IFBlcm1pc3Npb25zR3VhcmRTZXJ2aWNlKSB7XG4gICAgdGhpcy5wZXJtaXNzaW9uc0d1YXJkID0gZ3VhcmQ7XG4gIH1cblxuICBjYW5BY3RpdmF0ZUNoaWxkVXNpbmdQZXJtaXNzaW9ucyhjaGlsZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnBlcm1pc3Npb25zR3VhcmQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBlcm1pc3Npb25zR3VhcmQuY2FuQWN0aXZhdGVDaGlsZChjaGlsZFJvdXRlLCBzdGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iXX0=