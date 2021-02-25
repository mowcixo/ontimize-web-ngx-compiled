import { AfterViewInit, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange, MatDialogRef, MatSelectionList } from '@angular/material';
import { OTableBaseDialogClass } from '../o-table-base-dialog.class';
export declare class OTableStoreConfigurationDialogComponent extends OTableBaseDialogClass implements AfterViewInit {
    dialogRef: MatDialogRef<OTableStoreConfigurationDialogComponent>;
    protected injector: Injector;
    propertiesList: MatSelectionList;
    properties: any[];
    formGroup: FormGroup;
    constructor(dialogRef: MatDialogRef<OTableStoreConfigurationDialogComponent>, injector: Injector);
    ngAfterViewInit(): void;
    areAllSelected(): boolean;
    onSelectAllChange(event: MatCheckboxChange): void;
    getConfigurationAttributes(): any;
    getSelectedTableProperties(): any[];
    isIndeterminate(): boolean;
}
