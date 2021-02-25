import { Injector } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ODialogComponent } from '../shared/components/dialog/o-dialog.component';
import { ODialogConfig } from '../shared/components/dialog/o-dialog.config';
export declare class DialogService {
    protected injector: Injector;
    protected ng2Dialog: MatDialog;
    dialogRef: MatDialogRef<ODialogComponent>;
    constructor(injector: Injector);
    readonly dialog: ODialogComponent;
    alert(title: string, message: string, config?: ODialogConfig): Promise<any>;
    info(title: string, message: string, config?: ODialogConfig): Promise<any>;
    warn(title: string, message: string, config?: ODialogConfig): Promise<any>;
    error(title: string, message: string, config?: ODialogConfig): Promise<any>;
    confirm(title: string, message: string, config?: ODialogConfig): Promise<any>;
    protected openDialog(observer: any): void;
}
