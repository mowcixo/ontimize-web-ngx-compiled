import { Injector, PipeTransform } from '@angular/core';
import { MomentService } from '../services/moment.service';
export interface IMomentPipeArgument {
    format?: string;
}
export declare class OMomentPipe implements PipeTransform {
    protected injector: Injector;
    protected momentService: MomentService;
    constructor(injector: Injector);
    transform(value: any, args: IMomentPipeArgument): any;
}
