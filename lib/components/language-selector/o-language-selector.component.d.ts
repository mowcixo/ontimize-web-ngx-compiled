import { EventEmitter, Injector } from '@angular/core';
import { AppConfig } from '../../config/app-config';
import { OTranslateService } from '../../services/translate/o-translate.service';
export declare const DEFAULT_INPUTS_O_LANGUAGE_SELECTOR: string[];
export declare const DEFAULT_OUTPUTS_LANGUAGE_SELECTOR: string[];
export declare class OLanguageSelectorComponent {
    protected injector: Injector;
    useFlagIcons: boolean;
    onChange: EventEmitter<object>;
    protected translateService: OTranslateService;
    protected appConfig: AppConfig;
    protected availableLangs: string[];
    constructor(injector: Injector);
    getFlagClass(lang: string): string;
    getAvailableLangs(): string[];
    configureI18n(lang: any): void;
    getCurrentLang(): string;
    getCurrentCountry(): string;
}
