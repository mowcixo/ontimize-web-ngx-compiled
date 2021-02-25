import { ElementRef, Injector } from '@angular/core';
import { OContainerComponent } from '../o-container-component.class';
export declare const DEFAULT_INPUTS_O_COLUMN: string[];
export declare class OColumnComponent extends OContainerComponent {
    protected elRef: ElementRef;
    protected injector: Injector;
    protected matFormDefaultOption: any;
    constructor(elRef: ElementRef, injector: Injector, matFormDefaultOption: any);
}
