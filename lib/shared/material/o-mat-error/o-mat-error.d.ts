import { ChangeDetectorRef, ElementRef, InjectionToken, Injector } from '@angular/core';
import { OMatErrorOptions, OMatErrorType } from '../../../types/o-mat-error.type';
export declare const O_MAT_ERROR_OPTIONS: InjectionToken<OMatErrorOptions>;
export declare class OMatErrorComponent {
    protected injector: Injector;
    protected elementRef: ElementRef;
    protected cd: ChangeDetectorRef;
    id: string;
    text: string;
    protected errorOptions: OMatErrorOptions;
    protected errorType: OMatErrorType;
    constructor(injector: Injector, elementRef: ElementRef, cd: ChangeDetectorRef, errorOptions: OMatErrorOptions);
    readonly isStandardError: boolean;
}
