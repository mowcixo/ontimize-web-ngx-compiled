import { ElementRef, Renderer2 } from '@angular/core';
export declare type OTabMode = 'ontimize' | 'material';
export declare class OTabGroupDirective {
    protected renderer: Renderer2;
    protected el: ElementRef;
    protected static OTabModes: {
        ontimize: string;
        material: string;
    };
    protected _mode: OTabMode;
    protected _defaultMode: OTabMode;
    mode: OTabMode;
    constructor(renderer: Renderer2, el: ElementRef);
    protected applyMode(mode?: OTabMode): void;
}
