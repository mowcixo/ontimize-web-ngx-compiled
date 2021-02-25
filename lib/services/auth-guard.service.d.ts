import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OUserInfoService } from '../services/o-user-info.service';
import { LoginStorageService } from './login-storage.service';
import { PermissionsService } from './permissions/permissions.service';
export declare class AuthGuardService implements CanActivate {
    protected injector: Injector;
    protected router: Router;
    protected loginStorageService: LoginStorageService;
    protected oUserInfoService: OUserInfoService;
    protected permissionsService: PermissionsService;
    constructor(injector: Injector);
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean;
    setUserInformation(): void;
}
