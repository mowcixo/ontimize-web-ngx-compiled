import { ElementRef, Injector } from '@angular/core';
import { OFormComponent } from '../../form/o-form.component';
import { OTextInputComponent } from '../text-input/o-text-input.component';
export declare const DEFAULT_INPUTS_O_TEXTAREA_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_TEXTAREA_INPUT: string[];
export declare class OTextareaInputComponent extends OTextInputComponent {
    rows: number;
    columns: number;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    isResizable(): boolean;
}
