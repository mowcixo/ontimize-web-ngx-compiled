import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OFormLayoutManagerService } from '../../../services/o-form-layout-manager.service';
import { ShareCanActivateChildService } from '../../../services/share-can-activate-child.service';
export declare class CanActivateFormLayoutChildGuard implements CanActivateChild {
    protected injector: Injector;
    protected oFormLayoutService: OFormLayoutManagerService;
    protected shareCanActivateChildService: ShareCanActivateChildService;
    constructor(injector: Injector);
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>;
}
