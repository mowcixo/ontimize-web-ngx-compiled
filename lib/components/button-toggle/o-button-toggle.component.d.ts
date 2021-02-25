import { EventEmitter, ViewContainerRef } from '@angular/core';
import { MatButtonToggle, MatButtonToggleChange } from '@angular/material';
export declare const DEFAULT_INPUTS_O_BUTTON_TOGGLE: string[];
export declare const DEFAULT_OUTPUTS_O_BUTTON_TOGGLE: string[];
export declare class OButtonToggleComponent {
    viewContainerRef: ViewContainerRef;
    DEFAULT_INPUTS_O_BUTTON_TOGGLE: string[];
    DEFAULT_OUTPUTS_O_BUTTON_TOGGLE: string[];
    oattr: string;
    label: string;
    icon: string;
    iconPosition: 'before' | 'after';
    protected _checked: boolean;
    protected _enabled: boolean;
    name: string;
    onChange: EventEmitter<MatButtonToggleChange>;
    _innerButtonToggle: MatButtonToggle;
    constructor(viewContainerRef: ViewContainerRef);
    checked: boolean;
    enabled: boolean;
    value: any;
}
