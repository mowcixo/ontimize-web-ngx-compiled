import { EventEmitter, Injector } from '@angular/core';
import { ILocalStorageComponent } from '../interfaces/local-storage-component.interface';
export declare class LocalStorageService {
    protected injector: Injector;
    static COMPONENTS_STORAGE_KEY: string;
    static USERS_STORAGE_KEY: string;
    static SESSION_STORAGE_KEY: string;
    onRouteChange: EventEmitter<any>;
    onSetLocalStorage: EventEmitter<any>;
    private _config;
    private _router;
    private loginStorageService;
    constructor(injector: Injector);
    getComponentStorage(comp: ILocalStorageComponent, routeKey?: string): object;
    updateComponentStorage(comp: ILocalStorageComponent, routeKey?: string): void;
    private getAppComponentData;
    updateAppComponentStorage(componentKey: string, componentData: object): void;
    getSessionUserComponentsData(): object;
    storeSessionUserComponentsData(componentsData: object): void;
    private storeComponentInSessionUser;
    getStoredData(): object;
    setBackwardCompatibility(): void;
    protected setLocalStorage(appData: any): void;
}
