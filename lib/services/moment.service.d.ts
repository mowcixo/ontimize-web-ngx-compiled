import { Injector } from '@angular/core';
export declare class MomentService {
    protected injector: Injector;
    static DATE_FORMATS: string[];
    static defaultFormat: string;
    private _locale;
    private _config;
    constructor(injector: Injector);
    load(locale: string): void;
    parseDate(value: any, format?: string, locale?: string): any;
    getLocale(): string;
}
