import { Injector } from '@angular/core';
import { NumberService } from './number.service';
export declare class CurrencyService {
    protected injector: Injector;
    static DEFAULT_CURRENCY_SYMBOL: string;
    static DEFAULT_CURRENCY_SYMBOL_POSITION: string;
    protected _numberService: NumberService;
    protected _symbol: string;
    protected _symbolPosition: string;
    constructor(injector: Injector);
    symbol: string;
    symbolPosition: string;
    getCurrencyValue(value: any, args: any): any;
}
