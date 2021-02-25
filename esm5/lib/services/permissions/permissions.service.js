import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';
import { Util } from '../../util/util';
import { OntimizeEEPermissionsService } from './ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './ontimize-permissions.service';
var PermissionsService = (function () {
    function PermissionsService(injector) {
        this.injector = injector;
        var appConfig = this.injector.get(AppConfig).getConfiguration();
        if (Util.isDefined(appConfig.permissionsConfiguration)) {
            this.ontimizePermissionsConfig = appConfig.permissionsConfiguration;
        }
    }
    PermissionsService.prototype.configureService = function () {
        var loadingService = OntimizePermissionsService;
        try {
            this.permissionsService = this.injector.get(loadingService);
            if (Util.isPermissionsService(this.permissionsService)) {
                if (this.permissionsService instanceof OntimizePermissionsService) {
                    this.permissionsService.configureService(this.ontimizePermissionsConfig);
                }
                else if (this.permissionsService instanceof OntimizeEEPermissionsService) {
                    this.permissionsService.configureService(this.ontimizePermissionsConfig);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    PermissionsService.prototype.restart = function () {
        this.permissions = undefined;
    };
    PermissionsService.prototype.hasPermissions = function () {
        return this.permissions !== undefined;
    };
    PermissionsService.prototype.getUserPermissionsAsPromise = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.permissions = {};
            if (Util.isDefined(self.ontimizePermissionsConfig)) {
                self.configureService();
                self.queryPermissions().subscribe(function () {
                    resolve(true);
                }, function (error) {
                    resolve(true);
                });
            }
            else {
                resolve(true);
            }
        });
    };
    PermissionsService.prototype.queryPermissions = function () {
        var self = this;
        var dataObservable = new Observable(function (innerObserver) {
            self.permissionsService.loadPermissions().subscribe(function (res) {
                self.permissions = res;
                innerObserver.next(res);
            }, function (err) {
                console.error('[Permissions.queryPermissions]: error', err);
                innerObserver.error(err);
            }, function () {
                innerObserver.complete();
            });
        });
        return dataObservable.pipe(share());
    };
    PermissionsService.prototype.getPermissionIdFromActRoute = function (actRoute) {
        var result;
        var snapshot = actRoute.snapshot;
        result = ((snapshot.data || {})['oPermission'] || {})['permissionId'];
        while (Util.isDefined(snapshot.firstChild) && !Util.isDefined(result)) {
            snapshot = snapshot.firstChild;
            result = ((snapshot.data || {})['oPermission'] || {})['permissionId'];
        }
        return result;
    };
    PermissionsService.prototype.getComponentPermissionsUsingRoute = function (attr, actRoute) {
        var result;
        var permissionId = this.getPermissionIdFromActRoute(actRoute);
        if (Util.isDefined(permissionId)) {
            var routePermissions = (this.permissions.routes || []).find(function (route) { return route.permissionId === permissionId; });
            if (Util.isDefined(routePermissions)) {
                result = (routePermissions.components || []).find(function (comp) { return comp.attr === attr; });
            }
        }
        return result;
    };
    PermissionsService.prototype.getOComponentPermissions = function (attr, actRoute, selector) {
        if (!Util.isDefined(this.permissions)) {
            return undefined;
        }
        var routePermissions;
        var genericRoutePerm = this.getComponentPermissionsUsingRoute(attr, actRoute);
        if (genericRoutePerm && genericRoutePerm.selector === selector) {
            routePermissions = genericRoutePerm;
        }
        var compPermissions;
        var attrPermissions = (this.permissions.components || []).find(function (comp) { return comp.attr === attr; });
        if (attrPermissions && attrPermissions.selector === selector) {
            compPermissions = attrPermissions;
        }
        return {
            route: routePermissions,
            component: compPermissions
        };
    };
    PermissionsService.prototype.getTablePermissions = function (attr, actRoute) {
        if (!Util.isDefined(this.permissions)) {
            return undefined;
        }
        var perm = this.getOComponentPermissions(attr, actRoute, 'o-table');
        var routePerm = perm.route;
        var compPerm = perm.component;
        if (!Util.isDefined(routePerm) || !Util.isDefined(compPerm)) {
            return compPerm || routePerm;
        }
        var permissions = {
            selector: 'o-table',
            attr: routePerm.attr,
            menu: this.mergeOTableMenuPermissions(compPerm.menu, routePerm.menu),
            columns: this.mergeOPermissionsArrays(compPerm.columns, routePerm.columns),
            actions: this.mergeOPermissionsArrays(compPerm.actions, routePerm.actions),
            contextMenu: this.mergeOPermissionsArrays(compPerm.contextMenu, routePerm.contextMenu)
        };
        return permissions;
    };
    PermissionsService.prototype.getFormPermissions = function (attr, actRoute) {
        if (!Util.isDefined(this.permissions)) {
            return undefined;
        }
        var perm = this.getOComponentPermissions(attr, actRoute, 'o-form');
        var routePerm = perm.route;
        var compPerm = perm.component;
        if (!Util.isDefined(routePerm) || !Util.isDefined(compPerm)) {
            return compPerm || routePerm;
        }
        var permissions = {
            selector: 'o-form',
            attr: routePerm.attr,
            components: this.mergeOPermissionsArrays(compPerm.components, routePerm.components),
            actions: this.mergeOPermissionsArrays(compPerm.actions, routePerm.actions)
        };
        return permissions;
    };
    PermissionsService.prototype.getMenuPermissions = function (attr) {
        var permissions;
        if (!Util.isDefined(this.permissions)) {
            return undefined;
        }
        var allMenu = this.permissions.menu || [];
        permissions = allMenu.find(function (comp) { return comp.attr === attr; });
        return permissions;
    };
    PermissionsService.prototype.mergeOPermissionsArrays = function (permissionsA, permissionsB) {
        if (!Util.isDefined(permissionsA) || !Util.isDefined(permissionsB)) {
            return permissionsA || permissionsB;
        }
        var result = Object.assign([], permissionsA);
        permissionsB.forEach(function (perm) {
            var found = result.find(function (r) { return r.attr === perm.attr; });
            if (found) {
                found.visible = perm.visible;
                found.enabled = perm.enabled;
            }
            else {
                result.push(perm);
            }
        });
        return result;
    };
    PermissionsService.prototype.mergeOTableMenuPermissions = function (permissionsA, permissionsB) {
        if (!Util.isDefined(permissionsA) || !Util.isDefined(permissionsB)) {
            return permissionsA || permissionsB;
        }
        var result = {
            visible: permissionsB.visible,
            enabled: permissionsB.enabled,
            items: this.mergeOPermissionsArrays(permissionsA.items, permissionsB.items)
        };
        return result;
    };
    PermissionsService.prototype.isPermissionIdRouteRestricted = function (permissionId) {
        var routeData = (this.permissions.routes || []).find(function (route) { return route.permissionId === permissionId; });
        return Util.isDefined(routeData) && routeData.enabled === false;
    };
    PermissionsService.decorators = [
        { type: Injectable }
    ];
    PermissionsService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return PermissionsService;
}());
export { PermissionsService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFRcEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRTVFO0lBUUUsNEJBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDdEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUVsRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7WUFDdEQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztTQUNyRTtJQUNILENBQUM7SUFFUyw2Q0FBZ0IsR0FBMUI7UUFDRSxJQUFNLGNBQWMsR0FBUSwwQkFBMEIsQ0FBQztRQUN2RCxJQUFJO1lBQ0YsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzVELElBQUksSUFBSSxDQUFDLG9CQUFvQixDQUFD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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IE9Db21wb25lbnRQZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tY29tcG9uZW50LXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT0Zvcm1QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tZm9ybS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9uc0RlZmluaXRpb24gfSBmcm9tICcuLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLWRlZmluaXRpb24udHlwZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1JvdXRlUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXJvdXRlLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlTWVudVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby10YWJsZS1tZW51LXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXRhYmxlLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPbnRpbWl6ZUVFUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi9vbnRpbWl6ZS1lZS1wZXJtaXNzaW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi9vbnRpbWl6ZS1wZXJtaXNzaW9ucy5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBlcm1pc3Npb25zU2VydmljZSB7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zU2VydmljZTogYW55O1xuICBwcm90ZWN0ZWQgb250aW1pemVQZXJtaXNzaW9uc0NvbmZpZzogYW55O1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zRGVmaW5pdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgY29uc3QgYXBwQ29uZmlnID0gdGhpcy5pbmplY3Rvci5nZXQoQXBwQ29uZmlnKS5nZXRDb25maWd1cmF0aW9uKCk7XG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoYXBwQ29uZmlnLnBlcm1pc3Npb25zQ29uZmlndXJhdGlvbikpIHtcbiAgICAgIHRoaXMub250aW1pemVQZXJtaXNzaW9uc0NvbmZpZyA9IGFwcENvbmZpZy5wZXJtaXNzaW9uc0NvbmZpZ3VyYXRpb247XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvbmZpZ3VyZVNlcnZpY2UoKSB7XG4gICAgY29uc3QgbG9hZGluZ1NlcnZpY2U6IGFueSA9IE9udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnBlcm1pc3Npb25zU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KGxvYWRpbmdTZXJ2aWNlKTtcbiAgICAgIGlmIChVdGlsLmlzUGVybWlzc2lvbnNTZXJ2aWNlKHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlKSkge1xuICAgICAgICBpZiAodGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgaW5zdGFuY2VvZiBPbnRpbWl6ZVBlcm1pc3Npb25zU2VydmljZSkge1xuICAgICAgICAgICh0aGlzLnBlcm1pc3Npb25zU2VydmljZSBhcyBPbnRpbWl6ZVBlcm1pc3Npb25zU2VydmljZSkuY29uZmlndXJlU2VydmljZSh0aGlzLm9udGltaXplUGVybWlzc2lvbnNDb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlIGluc3RhbmNlb2YgT250aW1pemVFRVBlcm1pc3Npb25zU2VydmljZSkge1xuICAgICAgICAgICh0aGlzLnBlcm1pc3Npb25zU2VydmljZSBhcyBPbnRpbWl6ZUVFUGVybWlzc2lvbnNTZXJ2aWNlKS5jb25maWd1cmVTZXJ2aWNlKHRoaXMub250aW1pemVQZXJtaXNzaW9uc0NvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3RhcnQoKSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGhhc1Blcm1pc3Npb25zKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBlcm1pc3Npb25zICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRVc2VyUGVybWlzc2lvbnNBc1Byb21pc2UoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlOiBhbnksIHJlamVjdDogYW55KSA9PiB7XG4gICAgICBzZWxmLnBlcm1pc3Npb25zID0ge307XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQoc2VsZi5vbnRpbWl6ZVBlcm1pc3Npb25zQ29uZmlnKSkge1xuICAgICAgICBzZWxmLmNvbmZpZ3VyZVNlcnZpY2UoKTtcbiAgICAgICAgc2VsZi5xdWVyeVBlcm1pc3Npb25zKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5UGVybWlzc2lvbnMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+ID0gbmV3IE9ic2VydmFibGUoaW5uZXJPYnNlcnZlciA9PiB7XG4gICAgICBzZWxmLnBlcm1pc3Npb25zU2VydmljZS5sb2FkUGVybWlzc2lvbnMoKS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgIHNlbGYucGVybWlzc2lvbnMgPSByZXM7XG4gICAgICAgIGlubmVyT2JzZXJ2ZXIubmV4dChyZXMpO1xuICAgICAgfSwgKGVycjogYW55KSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1tQZXJtaXNzaW9ucy5xdWVyeVBlcm1pc3Npb25zXTogZXJyb3InLCBlcnIpO1xuICAgICAgICBpbm5lck9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIGlubmVyT2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFBlcm1pc3Npb25JZEZyb21BY3RSb3V0ZShhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUpOiBzdHJpbmcge1xuICAgIGxldCByZXN1bHQ6IHN0cmluZztcbiAgICBsZXQgc25hcHNob3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSBhY3RSb3V0ZS5zbmFwc2hvdDtcbiAgICByZXN1bHQgPSAoKHNuYXBzaG90LmRhdGEgfHwge30pWydvUGVybWlzc2lvbiddIHx8IHt9KVsncGVybWlzc2lvbklkJ107XG4gICAgd2hpbGUgKFV0aWwuaXNEZWZpbmVkKHNuYXBzaG90LmZpcnN0Q2hpbGQpICYmICFVdGlsLmlzRGVmaW5lZChyZXN1bHQpKSB7XG4gICAgICBzbmFwc2hvdCA9IHNuYXBzaG90LmZpcnN0Q2hpbGQ7XG4gICAgICByZXN1bHQgPSAoKHNuYXBzaG90LmRhdGEgfHwge30pWydvUGVybWlzc2lvbiddIHx8IHt9KVsncGVybWlzc2lvbklkJ107XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29tcG9uZW50UGVybWlzc2lvbnNVc2luZ1JvdXRlKGF0dHI6IHN0cmluZywgYWN0Um91dGU6IEFjdGl2YXRlZFJvdXRlKTogT0NvbXBvbmVudFBlcm1pc3Npb25zIHtcbiAgICBsZXQgcmVzdWx0OiBPQ29tcG9uZW50UGVybWlzc2lvbnM7XG4gICAgY29uc3QgcGVybWlzc2lvbklkID0gdGhpcy5nZXRQZXJtaXNzaW9uSWRGcm9tQWN0Um91dGUoYWN0Um91dGUpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChwZXJtaXNzaW9uSWQpKSB7XG4gICAgICBjb25zdCByb3V0ZVBlcm1pc3Npb25zOiBPUm91dGVQZXJtaXNzaW9ucyA9ICh0aGlzLnBlcm1pc3Npb25zLnJvdXRlcyB8fCBbXSkuZmluZChyb3V0ZSA9PiByb3V0ZS5wZXJtaXNzaW9uSWQgPT09IHBlcm1pc3Npb25JZCk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQocm91dGVQZXJtaXNzaW9ucykpIHtcbiAgICAgICAgcmVzdWx0ID0gKHJvdXRlUGVybWlzc2lvbnMuY29tcG9uZW50cyB8fCBbXSkuZmluZChjb21wID0+IGNvbXAuYXR0ciA9PT0gYXR0cik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0T0NvbXBvbmVudFBlcm1pc3Npb25zKGF0dHI6IHN0cmluZywgYWN0Um91dGU6IEFjdGl2YXRlZFJvdXRlLCBzZWxlY3Rvcjogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBsZXQgcm91dGVQZXJtaXNzaW9uczogYW55O1xuICAgIGNvbnN0IGdlbmVyaWNSb3V0ZVBlcm06IE9Db21wb25lbnRQZXJtaXNzaW9ucyA9IHRoaXMuZ2V0Q29tcG9uZW50UGVybWlzc2lvbnNVc2luZ1JvdXRlKGF0dHIsIGFjdFJvdXRlKTtcbiAgICBpZiAoZ2VuZXJpY1JvdXRlUGVybSAmJiBnZW5lcmljUm91dGVQZXJtLnNlbGVjdG9yID09PSBzZWxlY3Rvcikge1xuICAgICAgcm91dGVQZXJtaXNzaW9ucyA9IGdlbmVyaWNSb3V0ZVBlcm07XG4gICAgfVxuICAgIGxldCBjb21wUGVybWlzc2lvbnM6IGFueTtcbiAgICBjb25zdCBhdHRyUGVybWlzc2lvbnMgPSAodGhpcy5wZXJtaXNzaW9ucy5jb21wb25lbnRzIHx8IFtdKS5maW5kKGNvbXAgPT4gY29tcC5hdHRyID09PSBhdHRyKTtcbiAgICBpZiAoYXR0clBlcm1pc3Npb25zICYmIGF0dHJQZXJtaXNzaW9ucy5zZWxlY3RvciA9PT0gc2VsZWN0b3IpIHtcbiAgICAgIGNvbXBQZXJtaXNzaW9ucyA9IGF0dHJQZXJtaXNzaW9ucztcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvdXRlOiByb3V0ZVBlcm1pc3Npb25zLFxuICAgICAgY29tcG9uZW50OiBjb21wUGVybWlzc2lvbnNcbiAgICB9O1xuICB9XG5cbiAgZ2V0VGFibGVQZXJtaXNzaW9ucyhhdHRyOiBzdHJpbmcsIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IE9UYWJsZVBlcm1pc3Npb25zIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBwZXJtID0gdGhpcy5nZXRPQ29tcG9uZW50UGVybWlzc2lvbnMoYXR0ciwgYWN0Um91dGUsICdvLXRhYmxlJyk7XG4gICAgY29uc3Qgcm91dGVQZXJtOiBPVGFibGVQZXJtaXNzaW9ucyA9IDxPVGFibGVQZXJtaXNzaW9ucz5wZXJtLnJvdXRlO1xuICAgIGNvbnN0IGNvbXBQZXJtOiBPVGFibGVQZXJtaXNzaW9ucyA9IDxPVGFibGVQZXJtaXNzaW9ucz5wZXJtLmNvbXBvbmVudDtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHJvdXRlUGVybSkgfHwgIVV0aWwuaXNEZWZpbmVkKGNvbXBQZXJtKSkge1xuICAgICAgcmV0dXJuIGNvbXBQZXJtIHx8IHJvdXRlUGVybTtcbiAgICB9XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9UYWJsZVBlcm1pc3Npb25zID0ge1xuICAgICAgc2VsZWN0b3I6ICdvLXRhYmxlJyxcbiAgICAgIGF0dHI6IHJvdXRlUGVybS5hdHRyLFxuICAgICAgbWVudTogdGhpcy5tZXJnZU9UYWJsZU1lbnVQZXJtaXNzaW9ucyhjb21wUGVybS5tZW51LCByb3V0ZVBlcm0ubWVudSksXG4gICAgICBjb2x1bW5zOiB0aGlzLm1lcmdlT1Blcm1pc3Npb25zQXJyYXlzKGNvbXBQZXJtLmNvbHVtbnMsIHJvdXRlUGVybS5jb2x1bW5zKSxcbiAgICAgIGFjdGlvbnM6IHRoaXMubWVyZ2VPUGVybWlzc2lvbnNBcnJheXMoY29tcFBlcm0uYWN0aW9ucywgcm91dGVQZXJtLmFjdGlvbnMpLFxuICAgICAgY29udGV4dE1lbnU6IHRoaXMubWVyZ2VPUGVybWlzc2lvbnNBcnJheXMoY29tcFBlcm0uY29udGV4dE1lbnUsIHJvdXRlUGVybS5jb250ZXh0TWVudSlcbiAgICB9O1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfVxuXG4gIGdldEZvcm1QZXJtaXNzaW9ucyhhdHRyOiBzdHJpbmcsIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IE9Gb3JtUGVybWlzc2lvbnMge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IHBlcm0gPSB0aGlzLmdldE9Db21wb25lbnRQZXJtaXNzaW9ucyhhdHRyLCBhY3RSb3V0ZSwgJ28tZm9ybScpO1xuICAgIGNvbnN0IHJvdXRlUGVybTogT0Zvcm1QZXJtaXNzaW9ucyA9IDxPRm9ybVBlcm1pc3Npb25zPnBlcm0ucm91dGU7XG4gICAgY29uc3QgY29tcFBlcm06IE9Gb3JtUGVybWlzc2lvbnMgPSA8T0Zvcm1QZXJtaXNzaW9ucz5wZXJtLmNvbXBvbmVudDtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHJvdXRlUGVybSkgfHwgIVV0aWwuaXNEZWZpbmVkKGNvbXBQZXJtKSkge1xuICAgICAgcmV0dXJuIGNvbXBQZXJtIHx8IHJvdXRlUGVybTtcbiAgICB9XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9Gb3JtUGVybWlzc2lvbnMgPSB7XG4gICAgICBzZWxlY3RvcjogJ28tZm9ybScsXG4gICAgICBhdHRyOiByb3V0ZVBlcm0uYXR0cixcbiAgICAgIGNvbXBvbmVudHM6IHRoaXMubWVyZ2VPUGVybWlzc2lvbnNBcnJheXMoY29tcFBlcm0uY29tcG9uZW50cywgcm91dGVQZXJtLmNvbXBvbmVudHMpLFxuICAgICAgYWN0aW9uczogdGhpcy5tZXJnZU9QZXJtaXNzaW9uc0FycmF5cyhjb21wUGVybS5hY3Rpb25zLCByb3V0ZVBlcm0uYWN0aW9ucylcbiAgICB9O1xuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfVxuXG4gIGdldE1lbnVQZXJtaXNzaW9ucyhhdHRyOiBzdHJpbmcpOiBPUGVybWlzc2lvbnMge1xuICAgIGxldCBwZXJtaXNzaW9ucztcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBhbGxNZW51OiBPUGVybWlzc2lvbnNbXSA9IHRoaXMucGVybWlzc2lvbnMubWVudSB8fCBbXTtcblxuICAgIHBlcm1pc3Npb25zID0gYWxsTWVudS5maW5kKGNvbXAgPT4gY29tcC5hdHRyID09PSBhdHRyKTtcblxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfVxuXG4gIHByb3RlY3RlZCBtZXJnZU9QZXJtaXNzaW9uc0FycmF5cyhwZXJtaXNzaW9uc0E6IE9QZXJtaXNzaW9uc1tdLCBwZXJtaXNzaW9uc0I6IE9QZXJtaXNzaW9uc1tdKTogT1Blcm1pc3Npb25zW10ge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQocGVybWlzc2lvbnNBKSB8fCAhVXRpbC5pc0RlZmluZWQocGVybWlzc2lvbnNCKSkge1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zQSB8fCBwZXJtaXNzaW9uc0I7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5hc3NpZ24oW10sIHBlcm1pc3Npb25zQSk7XG4gICAgcGVybWlzc2lvbnNCLmZvckVhY2goKHBlcm06IE9QZXJtaXNzaW9ucykgPT4ge1xuICAgICAgY29uc3QgZm91bmQgPSByZXN1bHQuZmluZChyID0+IHIuYXR0ciA9PT0gcGVybS5hdHRyKTtcbiAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICBmb3VuZC52aXNpYmxlID0gcGVybS52aXNpYmxlO1xuICAgICAgICBmb3VuZC5lbmFibGVkID0gcGVybS5lbmFibGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocGVybSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBtZXJnZU9UYWJsZU1lbnVQZXJtaXNzaW9ucyhwZXJtaXNzaW9uc0E6IE9UYWJsZU1lbnVQZXJtaXNzaW9ucywgcGVybWlzc2lvbnNCOiBPVGFibGVNZW51UGVybWlzc2lvbnMpOiBPVGFibGVNZW51UGVybWlzc2lvbnMge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQocGVybWlzc2lvbnNBKSB8fCAhVXRpbC5pc0RlZmluZWQocGVybWlzc2lvbnNCKSkge1xuICAgICAgcmV0dXJuIHBlcm1pc3Npb25zQSB8fCBwZXJtaXNzaW9uc0I7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgIHZpc2libGU6IHBlcm1pc3Npb25zQi52aXNpYmxlLFxuICAgICAgZW5hYmxlZDogcGVybWlzc2lvbnNCLmVuYWJsZWQsXG4gICAgICBpdGVtczogdGhpcy5tZXJnZU9QZXJtaXNzaW9uc0FycmF5cyhwZXJtaXNzaW9uc0EuaXRlbXMsIHBlcm1pc3Npb25zQi5pdGVtcylcbiAgICB9O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpc1Blcm1pc3Npb25JZFJvdXRlUmVzdHJpY3RlZChwZXJtaXNzaW9uSWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJvdXRlRGF0YSA9ICh0aGlzLnBlcm1pc3Npb25zLnJvdXRlcyB8fCBbXSkuZmluZChyb3V0ZSA9PiByb3V0ZS5wZXJtaXNzaW9uSWQgPT09IHBlcm1pc3Npb25JZCk7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHJvdXRlRGF0YSkgJiYgcm91dGVEYXRhLmVuYWJsZWQgPT09IGZhbHNlO1xuICB9XG59XG4iXX0=