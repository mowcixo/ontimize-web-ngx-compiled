import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { OColumn } from '../../../column/o-column.class';
export declare class OTableVisibleColumnsDialogComponent {
    protected injector: Injector;
    dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>;
    columns: Array<any>;
    protected cd: ChangeDetectorRef;
    rowHeight: string;
    constructor(injector: Injector, dialogRef: MatDialogRef<OTableVisibleColumnsDialogComponent>, data: any);
    getVisibleColumns(): Array<string>;
    getColumnsOrder(): Array<string>;
    onClickColumn(col: OColumn): void;
    drop(event: CdkDragDrop<string[]>): void;
}
