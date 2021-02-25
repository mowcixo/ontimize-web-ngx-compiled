import { Injector } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
export declare type OSnackBarIconPosition = 'left' | 'right';
export declare class OSnackBarConfig {
    action?: string;
    milliseconds?: number;
    icon?: string;
    iconPosition?: OSnackBarIconPosition;
    cssClass?: string;
}
export declare class OSnackBarComponent {
    protected injector: Injector;
    message: string;
    action: string;
    icon: string;
    iconPosition: OSnackBarIconPosition;
    protected snackBarRef: MatSnackBarRef<{}>;
    constructor(injector: Injector);
    open(message: string, config?: OSnackBarConfig): void;
    onAction(): void;
}
