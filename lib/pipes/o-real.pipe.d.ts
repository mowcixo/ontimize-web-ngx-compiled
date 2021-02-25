import { Injector, PipeTransform } from '@angular/core';
import { OIntegerPipe } from './o-integer.pipe';
export interface IRealPipeArgument {
    grouping?: boolean;
    thousandSeparator?: string;
    locale?: string;
    decimalSeparator?: string;
    minDecimalDigits?: number;
    maxDecimalDigits?: number;
}
export declare class ORealPipe extends OIntegerPipe implements PipeTransform {
    protected injector: Injector;
    constructor(injector: Injector);
    transform(text: string, args: IRealPipeArgument): string;
}
