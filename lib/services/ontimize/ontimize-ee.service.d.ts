import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDataService } from '../../interfaces/data-service.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OntimizeBaseService } from './ontimize-base-service.class';
export declare class OntimizeEEService extends OntimizeBaseService implements IDataService {
    path: string;
    configureService(config: any): void;
    startsession(user: string, password: string): Observable<string | number>;
    endsession(user: string, sessionId: any): Observable<number>;
    hassession(user: string, sessionId: any): Observable<boolean>;
    query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
    advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object, offset?: number, pagesize?: number, orderby?: Array<object>): Observable<ServiceResponse>;
    insert(av: object, entity: string, sqltypes?: object): Observable<ServiceResponse>;
    update(kv?: object, av?: object, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
    delete(kv?: object, entity?: string, sqltypes?: object): Observable<ServiceResponse>;
    protected buildHeaders(): HttpHeaders;
}
