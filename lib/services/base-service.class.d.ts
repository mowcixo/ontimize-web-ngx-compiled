import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { AppConfig } from '../config/app-config';
import { ServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { Config } from '../types/config.type';
import { ServiceRequestParam } from '../types/service-request-param.type';
import { BaseServiceResponse } from './base-service-response.class';
import { LoginStorageService } from './login-storage.service';
import { OntimizeServiceResponseParser } from './parser/o-service-response.parser';
export declare class BaseService {
    protected injector: Injector;
    protected httpClient: HttpClient;
    protected router: Router;
    protected _urlBase: string;
    protected _appConfig: Config;
    protected _config: AppConfig;
    protected responseParser: OntimizeServiceResponseParser;
    protected loginStorageService: LoginStorageService;
    protected adapter: ServiceResponseAdapter<BaseServiceResponse>;
    constructor(injector: Injector);
    configureAdapter(): void;
    configureService(config: any): void;
    getDefaultServiceConfiguration(serviceName?: string): any;
    urlBase: string;
    doRequest(param: ServiceRequestParam): Observable<ServiceResponse>;
    protected buildHeaders(): HttpHeaders;
    clientErrorFallback(errorCode: number): void;
    serverErrorFallback(errorCode: number): void;
    protected parseSuccessfulResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseSuccessfulQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseSuccessfulAdvancedQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseSuccessfulInsertResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseSuccessfulUpdateResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseSuccessfulDeleteResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseUnsuccessfulResponse(error: any, observer: Subscriber<ServiceResponse>): void;
    protected parseUnsuccessfulQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseUnsuccessfulAdvancedQueryResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseUnsuccessfulInsertResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseUnsuccessfulUpdateResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
    protected parseUnsuccessfulDeleteResponse(resp: ServiceResponse, observer: Subscriber<ServiceResponse>): void;
}
