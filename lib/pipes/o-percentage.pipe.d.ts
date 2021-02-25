import { Injector, PipeTransform } from '@angular/core';
import { ORealPipe } from './o-real.pipe';
export declare type OPercentageValueBaseType = 1 | 100;
export interface IPercentPipeArgument {
    grouping?: boolean;
    thousandSeparator?: string;
    locale?: string;
    decimalSeparator?: string;
    minDecimalDigits?: number;
    maxDecimalDigits?: number;
    valueBase?: OPercentageValueBaseType;
}
export declare class OPercentPipe extends ORealPipe implements PipeTransform {
    protected injector: Injector;
    constructor(injector: Injector);
    transform(text: string, args: IPercentPipeArgument): string;
    protected parseValueBase(value: OPercentageValueBaseType): OPercentageValueBaseType;
}
