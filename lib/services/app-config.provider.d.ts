import { Injector } from '@angular/core';
import { Config } from '../types/config.type';
export declare class AppConfigFactory {
    protected injector: Injector;
    config: Config;
    constructor(injector: Injector);
    factory(): any;
}
export declare function appConfigFactory(injector: Injector): any;
