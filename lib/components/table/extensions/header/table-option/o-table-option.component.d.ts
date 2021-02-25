import { ChangeDetectorRef, ElementRef, EventEmitter, Injector } from '@angular/core';
export declare const DEFAULT_INPUTS_O_TABLE_OPTION: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_OPTION: string[];
export declare class OTableOptionComponent {
    protected injector: Injector;
    elRef: ElementRef;
    static O_TABLE_OPTION_ACTIVE_CLASS: string;
    onClick: EventEmitter<object>;
    oattr: string;
    enabled: boolean;
    icon: string;
    olabel: string;
    showActiveIcon: boolean;
    active: boolean;
    cd: ChangeDetectorRef;
    constructor(injector: Injector, elRef: ElementRef);
    innerOnClick(): void;
    showActiveOptionIcon(): boolean;
    setActive(val: boolean): void;
}
