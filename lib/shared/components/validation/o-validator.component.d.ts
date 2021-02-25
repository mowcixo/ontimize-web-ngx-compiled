import { Injector } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { ErrorData } from '../../../types/error-data.type';
import { OErrorComponent } from './o-error.component';
export declare const DEFAULT_INPUTS_O_VALIDATOR: string[];
export declare class OValidatorComponent {
    protected injector: Injector;
    validatorFn: ValidatorFn;
    errorName: string;
    errorText: string;
    protected errorsData: ErrorData[];
    constructor(injector: Injector);
    registerError(oError: OErrorComponent): void;
    getValidatorFn(): ValidatorFn;
    getErrorsData(): ErrorData[];
}
