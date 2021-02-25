import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { PermissionsGuardService } from './permissions/permissions-can-activate.guard';
import { PermissionsService } from './permissions/permissions.service';
export declare class ShareCanActivateChildService {
    protected injector: Injector;
    protected router: Router;
    protected permissionsService: PermissionsService;
    protected permissionsGuard: PermissionsGuardService;
    constructor(injector: Injector);
    setPermissionsGuard(guard: PermissionsGuardService): void;
    canActivateChildUsingPermissions(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
}
