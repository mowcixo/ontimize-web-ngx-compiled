import { Injector } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { OTableFiltersStatus } from '../../../../../types/o-table-filter-status.type';
import { OTableBaseDialogClass } from '../o-table-base-dialog.class';
export declare class OTableStoreFilterDialogComponent extends OTableBaseDialogClass {
    dialogRef: MatDialogRef<OTableStoreFilterDialogComponent>;
    protected injector: Injector;
    filterNames: Array<string>;
    formGroup: FormGroup;
    constructor(dialogRef: MatDialogRef<OTableStoreFilterDialogComponent>, injector: Injector, data: Array<string>);
    loadFilterNames(filterNames: any): void;
    getFilterAttributes(): OTableFiltersStatus;
    protected filterNameValidator(control: FormControl): {
        filterNameAlreadyExists: boolean;
    } | {
        filterNameAlreadyExists?: undefined;
    };
}
