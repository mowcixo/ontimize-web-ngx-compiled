import { Injector } from '@angular/core';
export declare class NumberService {
    protected injector: Injector;
    static DEFAULT_DECIMAL_DIGITS: number;
    protected _grouping: boolean;
    protected _minDecimalDigits: number;
    protected _maxDecimalDigits: number;
    protected _locale: string;
    private _config;
    constructor(injector: Injector);
    grouping: boolean;
    minDecimalDigits: number;
    maxDecimalDigits: number;
    locale: string;
    getIntegerValue(value: any, args: any): any;
    getRealValue(value: any, args: any): any;
    getPercentValue(value: any, args: any): string;
}
