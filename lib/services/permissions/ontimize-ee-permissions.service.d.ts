import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config/app-config';
import { IPermissionsService } from '../../interfaces/permissions-service.interface';
import { Config } from '../../types/config.type';
import { OntimizeEEPermissionsConfig } from '../../types/ontimize-ee-permissions-config.type';
export declare class OntimizeEEPermissionsService implements IPermissionsService {
    protected injector: Injector;
    static DEFAULT_PERMISSIONS_PATH: string;
    static PERMISSIONS_KEY: string;
    path: string;
    protected httpClient: HttpClient;
    protected _sessionid: number;
    protected _user: string;
    protected _urlBase: string;
    protected _appConfig: Config;
    protected _config: AppConfig;
    constructor(injector: Injector);
    getDefaultServiceConfiguration(permissionsConfig: OntimizeEEPermissionsConfig): any;
    configureService(permissionsConfig: OntimizeEEPermissionsConfig): void;
    loadPermissions(): Observable<any>;
    protected buildHeaders(): HttpHeaders;
}
