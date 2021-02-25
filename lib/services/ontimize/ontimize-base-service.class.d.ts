import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { BaseService } from '../base-service.class';
export declare class OntimizeBaseService extends BaseService implements IAuthService {
    protected injector: Injector;
    protected _sessionid: string;
    protected _startSessionPath: string;
    kv: {};
    av: string[];
    sqltypes: {};
    pagesize: number;
    offset: number;
    orderby: Array<object>;
    totalsize: number;
    constructor(injector: Injector);
    configureService(config: any): void;
    startsession(user: string, password: string): Observable<any>;
    endsession(user: string, sessionId: number): Observable<any>;
    hassession(user: string, sessionId: string | number): Observable<boolean>;
    redirectLogin(sessionExpired?: boolean): void;
    clientErrorFallback(errorCode: number): void;
}
