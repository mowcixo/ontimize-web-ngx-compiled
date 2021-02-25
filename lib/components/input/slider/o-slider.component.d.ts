import { ElementRef, Injector } from '@angular/core';
import { OFormComponent } from '../../../components/form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
export declare const DEFAULT_INPUTS_O_SLIDER_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_SLIDER_INPUT: string[];
export declare type SliderDisplayFunction = (value: number | null) => string | number;
export declare class OSliderComponent extends OFormDataComponent {
    color: string;
    layout: 'row' | 'column';
    vertical: boolean;
    invert: boolean;
    thumbLabel: boolean;
    min: number;
    max: number;
    step: number;
    tickInterval: any;
    _tickInterval: 'auto' | number;
    oDisplayWith: SliderDisplayFunction;
    constructor(form: OFormComponent, elRef: ElementRef, injector: Injector);
    onClickBlocker(evt: Event): void;
}
