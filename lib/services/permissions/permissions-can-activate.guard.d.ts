import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { ShareCanActivateChildService } from '../share-can-activate-child.service';
import { SnackBarService } from '../snackbar.service';
import { PermissionsService } from './permissions.service';
export declare class PermissionsGuardService implements CanActivateChild {
    protected injector: Injector;
    protected router: Router;
    protected permissionsService: PermissionsService;
    protected snackBarService: SnackBarService;
    protected shareCanActivateChildService: ShareCanActivateChildService;
    constructor(injector: Injector);
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean;
}
