import { Injectable, Injector } from '@angular/core';
import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';
import { ShareCanActivateChildService } from '../../../services/share-can-activate-child.service';
import { Util } from '../../../util/util';
var CanActivateFormLayoutChildGuard = (function () {
    function CanActivateFormLayoutChildGuard(injector) {
        this.injector = injector;
        this.shareCanActivateChildService = this.injector.get(ShareCanActivateChildService);
        try {
            this.oFormLayoutService = this.injector.get(OFormLayoutManagerService);
        }
        catch (e) {
            console.error(e);
        }
    }
    CanActivateFormLayoutChildGuard.prototype.canActivateChild = function (childRoute, state) {
        var formLayoutManager = this.oFormLayoutService.activeFormLayoutManager;
        this.oFormLayoutService.activeFormLayoutManager = undefined;
        if (formLayoutManager) {
            var oPermission = childRoute.data ? childRoute.data['oPermission'] : undefined;
            var permissionId = (oPermission || {})['permissionId'];
            if (Util.isDefined(permissionId)) {
                var restricted = !this.shareCanActivateChildService.canActivateChildUsingPermissions(childRoute, state);
                if (restricted) {
                    return false;
                }
            }
            formLayoutManager.addDetailComponent(childRoute, state.url.substring(0, state.url.indexOf('?')));
            return false;
        }
        return true;
    };
    CanActivateFormLayoutChildGuard.decorators = [
        { type: Injectable }
    ];
    CanActivateFormLayoutChildGuard.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return CanActivateFormLayoutChildGuard;
}());
export { CanActivateFormLayoutChildGuard };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1jYW4tYWN0aXZhdGUtY2hpbGQuZ3VhcmQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2xheW91dHMvZm9ybS1sYXlvdXQvZ3VhcmRzL28tZm9ybS1sYXlvdXQtY2FuLWFjdGl2YXRlLWNoaWxkLmd1YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXJELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUcxQztJQU1FLHlDQUFzQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3RDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ3BGLElBQUk7WUFDRixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUN4RTtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRCwwREFBZ0IsR0FBaEIsVUFBaUIsVUFBa0MsRUFBRSxLQUEwQjtRQUM3RSxJQUFNLGlCQUFpQixHQUFnQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsdUJBQXVCLENBQUM7UUFDdkcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHVCQUF1QixHQUFHLFNBQVMsQ0FBQztRQUM1RCxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNqRixJQUFNLFlBQVksR0FBVyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNqRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ2hDLElBQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLGdDQUFnQyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDMUcsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsT0FBTyxLQUFLLENBQUM7aUJBQ2Q7YUFDRjtZQUNELGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pHLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O2dCQS9CRixVQUFVOzs7Z0JBVFUsUUFBUTs7SUF5QzdCLHNDQUFDO0NBQUEsQUFoQ0QsSUFnQ0M7U0EvQlksK0JBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIENhbkFjdGl2YXRlQ2hpbGQsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvby1mb3JtLWxheW91dC1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2hhcmVDYW5BY3RpdmF0ZUNoaWxkU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3NoYXJlLWNhbi1hY3RpdmF0ZS1jaGlsZC5zZXJ2aWNlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkIGltcGxlbWVudHMgQ2FuQWN0aXZhdGVDaGlsZCB7XG5cbiAgcHJvdGVjdGVkIG9Gb3JtTGF5b3V0U2VydmljZTogT0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZTtcbiAgcHJvdGVjdGVkIHNoYXJlQ2FuQWN0aXZhdGVDaGlsZFNlcnZpY2U6IFNoYXJlQ2FuQWN0aXZhdGVDaGlsZFNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuc2hhcmVDYW5BY3RpdmF0ZUNoaWxkU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNoYXJlQ2FuQWN0aXZhdGVDaGlsZFNlcnZpY2UpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm9Gb3JtTGF5b3V0U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtTGF5b3V0TWFuYWdlclNlcnZpY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgY2FuQWN0aXZhdGVDaGlsZChjaGlsZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBzdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCk6IGJvb2xlYW4gfCBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZm9ybUxheW91dE1hbmFnZXI6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCA9IHRoaXMub0Zvcm1MYXlvdXRTZXJ2aWNlLmFjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyO1xuICAgIHRoaXMub0Zvcm1MYXlvdXRTZXJ2aWNlLmFjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyID0gdW5kZWZpbmVkO1xuICAgIGlmIChmb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgY29uc3Qgb1Blcm1pc3Npb24gPSBjaGlsZFJvdXRlLmRhdGEgPyBjaGlsZFJvdXRlLmRhdGFbJ29QZXJtaXNzaW9uJ10gOiB1bmRlZmluZWQ7XG4gICAgICBjb25zdCBwZXJtaXNzaW9uSWQ6IHN0cmluZyA9IChvUGVybWlzc2lvbiB8fCB7fSlbJ3Blcm1pc3Npb25JZCddO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHBlcm1pc3Npb25JZCkpIHtcbiAgICAgICAgY29uc3QgcmVzdHJpY3RlZCA9ICF0aGlzLnNoYXJlQ2FuQWN0aXZhdGVDaGlsZFNlcnZpY2UuY2FuQWN0aXZhdGVDaGlsZFVzaW5nUGVybWlzc2lvbnMoY2hpbGRSb3V0ZSwgc3RhdGUpO1xuICAgICAgICBpZiAocmVzdHJpY3RlZCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9ybUxheW91dE1hbmFnZXIuYWRkRGV0YWlsQ29tcG9uZW50KGNoaWxkUm91dGUsIHN0YXRlLnVybC5zdWJzdHJpbmcoMCwgc3RhdGUudXJsLmluZGV4T2YoJz8nKSkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl19