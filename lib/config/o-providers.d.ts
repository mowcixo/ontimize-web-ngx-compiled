import { Injector, Provider } from '@angular/core';
import { OTranslateService } from '../services/translate/o-translate.service';
import { Config } from '../types/config.type';
export declare function appInitializerFactory(injector: Injector, config: Config, oTranslate: OTranslateService): () => Promise<any>;
export declare const ONTIMIZE_PROVIDERS: Provider[];
