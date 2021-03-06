import { MatDialogRef } from '@angular/material';
import { ODialogConfig } from './o-dialog.config';
export declare class ODialogComponent {
    dialogRef: MatDialogRef<ODialogComponent>;
    protected static DEFAULT_OK_BUTTON_TEXT: string;
    protected static DEFAULT_CANCEL_BUTTON_TEXT: string;
    protected _title: string;
    protected _message: string;
    protected _okButtonText: string;
    protected _cancelButtonText: string;
    protected _twoOptions: boolean;
    protected _useIcon: boolean;
    protected _icon: string;
    protected _alertType: string;
    constructor(dialogRef: MatDialogRef<ODialogComponent>);
    onOkClick(): void;
    alert(title: string, message: string, config?: ODialogConfig): void;
    info(title: string, message: string, config?: ODialogConfig): void;
    warn(title: string, message: string, config?: ODialogConfig): void;
    error(title: string, message: string, config?: ODialogConfig): void;
    confirm(title: string, message: string, config?: ODialogConfig): void;
    protected ensureConfig(config: ODialogConfig): ODialogConfig;
    protected configureDefaultAlert(title: string, message: string, config?: ODialogConfig): void;
    readonly isInfo: boolean;
    readonly isWarn: boolean;
    readonly isError: boolean;
    title: string;
    message: string;
    okButtonText: string;
    cancelButtonText: string;
    icon: string;
    alertType: string;
    twoOptions: boolean;
    useIcon: boolean;
}
