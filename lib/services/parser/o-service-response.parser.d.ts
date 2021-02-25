import { Injector } from '@angular/core';
import { Subscriber } from 'rxjs';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { BaseService } from '../base-service.class';
export declare class OntimizeServiceResponseParser {
    protected injector: Injector;
    constructor(injector: Injector);
    parseSuccessfulResponse(resp: ServiceResponse, subscriber: Subscriber<ServiceResponse>, service: BaseService): void;
    parseUnsuccessfulResponse(error: any, subscriber: Subscriber<ServiceResponse>, service: BaseService): void;
}
