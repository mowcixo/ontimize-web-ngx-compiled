import { ElementRef, Injector } from '@angular/core';
import { OContainerCollapsibleComponent } from '../o-container-collapsible-component.class';
export declare const DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE: string[];
export declare class OColumnCollapsibleComponent extends OContainerCollapsibleComponent {
    protected elRef: ElementRef;
    protected injector: Injector;
    protected matFormDefaultOption: any;
    constructor(elRef: ElementRef, injector: Injector, matFormDefaultOption: any);
}
