import { HttpHeaders } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { IExportService } from '../../interfaces/export-service.interface';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OntimizeBaseService } from './ontimize-base-service.class';
export declare class OntimizeExportService extends OntimizeBaseService implements IExportService {
    protected injector: Injector;
    exportPath: string;
    downloadPath: string;
    servicePath: string;
    protected _sessionid: string;
    protected exportAll: boolean;
    constructor(injector: Injector);
    configureService(config: any, modeAll?: boolean): void;
    protected buildHeaders(): HttpHeaders;
    exportData(data: any, format: string, entity?: string): Observable<any>;
    protected parseSuccessfulExportDataResponse(format: string, resp: ServiceResponse, subscriber: Subscriber<ServiceResponse>): void;
    downloadFile(fileId: string, fileExtension: string): Observable<any>;
}
