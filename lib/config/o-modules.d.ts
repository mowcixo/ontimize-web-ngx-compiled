import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { AppConfig } from '../config/app-config';
import { OTranslateHttpLoader } from '../services/translate/o-translate-http-loader';
import { OTranslateParser } from '../services/translate/o-translate.parser';
export declare const INTERNAL_ONTIMIZE_MODULES_EXPORTED: any;
export declare function OHttpLoaderFactory(http: HttpClient, injector: Injector, appConfig: AppConfig): OTranslateHttpLoader;
export declare function OTranslateParserFactory(): OTranslateParser;
export declare const INTERNAL_ONTIMIZE_MODULES: any;
export declare class OntimizeWebTranslateModule {
}
export declare const ONTIMIZE_MODULES: any;
export declare const ONTIMIZE_MODULES_WITHOUT_ANIMATIONS: any;
