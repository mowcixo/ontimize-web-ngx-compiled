import { ElementRef, Injector } from '@angular/core';
import { ThemePalette } from '@angular/material';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
export declare const DEFAULT_INPUTS_O_SLIDETOGGLE: string[];
export declare const DEFAULT_OUTPUTS_O_SLIDETOGGLE: string[];
export declare class OSlideToggleComponent extends OFormDataComponent {
    trueValue: number | boolean | string;
    falseValue: number | boolean | string;
    booleanType: 'number' | 'boolean' | 'string';
    color: ThemePalette;
    labelPosition: 'before' | 'after';
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    initialize(): void;
    ensureOFormValue(value: any): void;
    isChecked(): boolean;
    onClickBlocker(e: MouseEvent): void;
}
