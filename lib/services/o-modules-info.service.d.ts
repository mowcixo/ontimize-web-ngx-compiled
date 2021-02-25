import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OTranslateService } from '../services/translate/o-translate.service';
export interface ModuleInfo {
    name?: string;
    route?: string;
}
export declare class OModulesInfoService {
    protected injector: Injector;
    protected storedInfo: ModuleInfo;
    protected actRoute: ActivatedRoute;
    protected router: Router;
    protected translateService: OTranslateService;
    private subject;
    constructor(injector: Injector);
    setModuleInfo(info: ModuleInfo): void;
    getModuleInfo(): ModuleInfo;
    getModuleChangeObservable(): Observable<any>;
}
