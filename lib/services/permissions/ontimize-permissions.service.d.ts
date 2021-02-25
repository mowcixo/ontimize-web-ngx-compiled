import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config/app-config';
import { IPermissionsService } from '../../interfaces/permissions-service.interface';
import { Config } from '../../types/config.type';
import { OntimizePermissionsConfig } from '../../types/ontimize-permissions-config.type';
export declare class OntimizePermissionsService implements IPermissionsService {
    protected injector: Injector;
    entity: string;
    keyColumn: string;
    valueColumn: string;
    protected httpClient: HttpClient;
    protected _sessionid: number;
    protected _user: string;
    protected _urlBase: string;
    protected _appConfig: Config;
    protected _config: AppConfig;
    constructor(injector: Injector);
    getDefaultServiceConfiguration(): any;
    configureService(permissionsConfig: OntimizePermissionsConfig): void;
    loadPermissions(): Observable<any>;
    protected buildHeaders(): HttpHeaders;
}
