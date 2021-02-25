import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { OFormDataComponent } from '../o-form-data-component.class';
export declare class OFormControl extends FormControl {
    fControlChildren: (FormControl | OFormDataComponent)[];
    constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    markAsTouched(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsDirty(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsPristine(opts?: {
        onlySelf?: boolean;
    }): void;
    getValue(): any;
}
