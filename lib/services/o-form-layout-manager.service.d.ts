import { Injector } from '@angular/core';
import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';
export declare class OFormLayoutManagerService {
    protected injector: Injector;
    protected registeredFormLayoutManagers: {};
    protected _activeFormLayoutManager: OFormLayoutManagerComponent;
    constructor(injector: Injector);
    registerFormLayoutManager(comp: OFormLayoutManagerComponent): void;
    removeFormLayoutManager(comp: OFormLayoutManagerComponent): void;
    activeFormLayoutManager: OFormLayoutManagerComponent;
}
