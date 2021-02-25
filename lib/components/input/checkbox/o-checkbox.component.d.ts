import { ElementRef, Injector } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
export declare const DEFAULT_INPUTS_O_CHECKBOX: string[];
export declare const DEFAULT_OUTPUTS_O_CHECKBOX: string[];
export declare class OCheckboxComponent extends OFormDataComponent {
    trueValue: any;
    falseValue: any;
    booleanType: 'number' | 'boolean' | 'string';
    color: ThemePalette;
    labelPosition: 'before' | 'after';
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    initialize(): void;
    ensureOFormValue(value: any): void;
    onClickBlocker(evt: Event): void;
    parseValueByType(value: any): any;
    protected parseStringInputs(): void;
    protected parseNumberInputs(): void;
    protected parseInputs(): void;
}
