import { ElementRef, Injector, OnInit } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { OFormComponent } from '../../form/o-form.component';
import { OTextInputComponent } from '../text-input/o-text-input.component';
export declare const DEFAULT_INPUTS_O_NIF_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_NIF_INPUT: string[];
export declare class ONIFInputComponent extends OTextInputComponent implements OnInit {
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    resolveValidators(): ValidatorFn[];
}
