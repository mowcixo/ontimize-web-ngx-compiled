import { Injector, OnInit } from '@angular/core';
import { OValidatorComponent } from './o-validator.component';
export declare const DEFAULT_INPUTS_O_ERROR: string[];
export declare class OErrorComponent implements OnInit {
    protected oValidator: OValidatorComponent;
    protected injector: Injector;
    name: string;
    text: string;
    constructor(oValidator: OValidatorComponent, injector: Injector);
    ngOnInit(): void;
    registerValidatorError(): void;
    getName(): string;
    getText(): string;
}
