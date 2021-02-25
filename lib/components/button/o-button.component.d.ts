import { OnInit } from '@angular/core';
export declare const DEFAULT_INPUTS_O_BUTTON: string[];
export declare class OButtonComponent implements OnInit {
    protected static DEFAULT_TYPE: string;
    protected oattr: string;
    olabel: string;
    protected otype: string;
    icon: string;
    svgIcon: string;
    iconPosition: string;
    image: string;
    constructor();
    ngOnInit(): void;
    readonly needsIconButtonClass: boolean;
    isFab(): boolean;
    isRaised(): boolean;
    isFlat(): boolean;
    isStroked(): boolean;
    isBasic(): boolean;
    isMiniFab(): boolean;
    isIconButton(): boolean;
}
