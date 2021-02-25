import { Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OBreadcrumb } from '../types/o-breadcrumb-item.type';
export declare class OBreadcrumbService {
    protected injector: Injector;
    breadcrumbs$: BehaviorSubject<OBreadcrumb[]>;
    constructor(injector: Injector);
}
