import { ElementRef, Injector, OnInit } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
export declare const DEFAULT_INPUTS_O_TEXT_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_TEXT_INPUT: string[];
export declare class OTextInputComponent extends OFormDataComponent implements OnInit {
    protected _minLength: number;
    protected _maxLength: number;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    resolveValidators(): ValidatorFn[];
    minLength: number;
    maxLength: number;
}
