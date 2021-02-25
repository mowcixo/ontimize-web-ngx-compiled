import { Observable } from 'rxjs';
import { IDataService } from '../../interfaces/data-service.interface';
import { OntimizeBaseService } from './ontimize-base-service.class';
export declare class OntimizeService extends OntimizeBaseService implements IDataService {
    entity: string;
    protected user: string;
    configureService(config: any): void;
    startsession(user: string, password: string): Observable<string | number>;
    endsession(user: string, sessionId: number): Observable<number>;
    hassession(user: string, sessionId: number): Observable<boolean>;
    query(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object): Observable<any>;
    advancedQuery(kv?: object, av?: Array<string>, entity?: string, sqltypes?: object, offset?: number, pagesize?: number, orderby?: Array<object>): Observable<any>;
    insert(av?: object, entity?: string, sqltypes?: object): Observable<any>;
    update(kv?: object, av?: object, entity?: string, sqltypes?: object): Observable<any>;
    delete(kv?: object, entity?: string, sqltypes?: object): Observable<any>;
}
