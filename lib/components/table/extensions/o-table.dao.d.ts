import { BehaviorSubject, Observable } from 'rxjs';
import { OQueryDataArgs } from '../../../types/query-data-args.type';
export declare class OTableDao {
    private dataService;
    private entity;
    private methods;
    usingStaticData: boolean;
    protected loadingTimer: any;
    protected _isLoadingResults: boolean;
    dataChange: BehaviorSubject<any[]>;
    sqlTypesChange: BehaviorSubject<object>;
    readonly data: any[];
    readonly sqlTypes: object;
    constructor(dataService: any, entity: string, methods: any);
    getQuery(queryArgs: OQueryDataArgs): Observable<any>;
    removeQuery(filters: any): Observable<any>;
    insertQuery(av: object, sqlTypes?: object): Observable<any>;
    updateQuery(kv: object, av: object, sqlTypes?: object): Observable<any>;
    setDataArray(data: Array<any>): Observable<any[]>;
    setAsynchronousColumn(value: Array<any>, rowData: any): void;
    isLoadingResults: boolean;
    protected cleanTimer(): void;
}
