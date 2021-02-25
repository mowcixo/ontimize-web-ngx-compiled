import { AfterViewInit, ElementRef, Injector } from '@angular/core';
import { MatRadioChange } from '@angular/material';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormServiceComponent } from '../o-form-service-component.class';
export declare const DEFAULT_INPUTS_O_RADIO: string[];
export declare const DEFAULT_OUTPUTS_O_RADIO: string[];
export declare class ORadioComponent extends OFormServiceComponent implements AfterViewInit {
    translate: boolean;
    layout: 'row' | 'column';
    labelPosition: 'before' | 'after';
    value: OFormValue;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    ngAfterViewInit(): void;
    onMatRadioGroupChange(e: MatRadioChange): void;
    getOptionDescriptionValue(item?: any): string;
    getValueColumn(item: any): any;
    getDescriptionValue(): string;
}
