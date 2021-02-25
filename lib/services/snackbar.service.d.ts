import { Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { OSnackBarComponent, OSnackBarConfig } from '../shared/components/snackbar/o-snackbar.component';
export declare class SnackBarService {
    protected injector: Injector;
    protected static DEFAULT_DURATION: number;
    protected static DEFAULT_CONTAINER_CLASS: string;
    protected matSnackBar: MatSnackBar;
    protected snackBarRef: MatSnackBarRef<OSnackBarComponent>;
    constructor(injector: Injector);
    open(message: string, config?: OSnackBarConfig): Promise<any>;
}
