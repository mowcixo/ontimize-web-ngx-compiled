import { Injector, PipeTransform } from '@angular/core';
import { NumberService } from '../services/number.service';
export interface IIntegerPipeArgument {
    grouping?: boolean;
    thousandSeparator?: string;
    locale?: string;
}
export declare class OIntegerPipe implements PipeTransform {
    protected injector: Injector;
    protected numberService: NumberService;
    constructor(injector: Injector);
    transform(text: string, args: IIntegerPipeArgument): string;
}
