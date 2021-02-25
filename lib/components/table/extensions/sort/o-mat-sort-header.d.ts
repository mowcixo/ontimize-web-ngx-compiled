import { CdkColumnDef } from '@angular/cdk/table';
import { ChangeDetectorRef } from '@angular/core';
import { MatSortHeader, MatSortHeaderIntl } from '@angular/material';
import { OMatSort } from './o-mat-sort';
export declare class OMatSortHeader extends MatSortHeader {
    _intl: MatSortHeaderIntl;
    _sort: OMatSort;
    _cdkColumnDef: CdkColumnDef;
    constructor(_intl: MatSortHeaderIntl, changeDetectorRef: ChangeDetectorRef, _sort: OMatSort, _cdkColumnDef: CdkColumnDef);
    _handleClick(): void;
    _isSorted(): boolean;
    _updateArrowDirection(): void;
    refresh(): void;
}
