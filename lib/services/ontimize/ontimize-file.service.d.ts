import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFileService } from '../../interfaces/file-service.interface';
import { OntimizeBaseService } from './ontimize-base-service.class';
export declare class OntimizeFileService extends OntimizeBaseService implements IFileService {
    path: string;
    configureService(config: any): void;
    upload(files: any[], entity: string, data?: object): Observable<any>;
    protected buildHeaders(): HttpHeaders;
}
