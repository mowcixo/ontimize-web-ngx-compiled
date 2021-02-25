import { ElementRef, Injector, OnInit } from '@angular/core';
import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IRealPipeArgument } from '../../../pipes/o-real.pipe';
import { OFormComponent } from '../../form/o-form.component';
import { OIntegerInputComponent } from '../integer-input/o-integer-input.component';
export declare const DEFAULT_INPUTS_O_REAL_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_REAL_INPUT: string[];
export declare class ORealInputComponent extends OIntegerInputComponent implements OnInit {
    minDecimalDigits: number;
    maxDecimalDigits: number;
    step: number;
    grouping: boolean;
    protected decimalSeparator: string;
    protected pipeArguments: IRealPipeArgument;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    setComponentPipe(): void;
    ngOnInit(): void;
    resolveValidators(): ValidatorFn[];
    protected minDecimalDigitsValidator(control: FormControl): ValidationErrors;
    protected maxDecimalDigitsValidator(control: FormControl): ValidationErrors;
    protected initializeStep(): void;
}
