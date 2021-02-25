import { Injector, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
export interface ICurrencyPipeArgument {
    currencySimbol?: string;
    currencySymbolPosition?: string;
    grouping?: boolean;
    thousandSeparator?: string;
    decimalSeparator?: string;
    minDecimalDigits?: number;
    maxDecimalDigits?: number;
}
export declare class OCurrencyPipe implements PipeTransform {
    protected injector: Injector;
    protected currencyService: CurrencyService;
    constructor(injector: Injector);
    transform(text: string, args: ICurrencyPipeArgument): string;
}
