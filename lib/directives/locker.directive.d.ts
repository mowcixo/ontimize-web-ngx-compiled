import { ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { OFormServiceComponent } from '../components/input/o-form-service-component.class';
export declare const DEFAULT_INPUTS_O_LOCKER: string[];
export declare class OLockerDirective implements OnDestroy {
    private element;
    private renderer;
    private parent;
    private loadingParentDiv;
    private componentDiv;
    private _oLockerMode;
    private subscription;
    constructor(element: ElementRef, renderer: Renderer2, parent: OFormServiceComponent);
    ngOnDestroy(): void;
    private manageLockerMode;
    private manageDisableMode;
    private manageLoadMode;
    private addLoading;
    private removeLoading;
    oLockerMode: 'load' | 'disabled';
    oLockerDelay: number;
}
