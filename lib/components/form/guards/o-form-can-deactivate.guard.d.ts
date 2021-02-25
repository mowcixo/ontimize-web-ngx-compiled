import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { OFormComponent } from '../o-form.component';
export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
export declare class CanDeactivateFormGuard implements CanDeactivate<CanComponentDeactivate> {
    oForm: OFormComponent;
    static CLASSNAME: string;
    canDeactivate(component: CanComponentDeactivate, curr: ActivatedRouteSnapshot, state: RouterStateSnapshot, future: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean>;
    setForm(form: OFormComponent): void;
}
