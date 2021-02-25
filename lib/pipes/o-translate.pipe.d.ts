import { ChangeDetectorRef, Injector, ModuleWithProviders, OnDestroy, PipeTransform } from '@angular/core';
import { OTranslateService } from '../services/translate/o-translate.service';
export interface ITranslatePipeArgument {
    values?: any[];
}
export declare class OTranslatePipe implements PipeTransform, OnDestroy {
    protected injector: Injector;
    value: string;
    lastKey: string;
    lastParams: any;
    onLanguageChanged: any;
    protected oTranslateService: OTranslateService;
    protected _ref: ChangeDetectorRef;
    constructor(injector: Injector);
    ngOnDestroy(): void;
    transform(text: string, args?: ITranslatePipeArgument): string;
    updateValue(key: string): void;
    protected _dispose(): void;
}
export declare class OTranslateModule {
    static forRoot(): ModuleWithProviders;
}
