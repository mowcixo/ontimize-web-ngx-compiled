import { AfterViewInit, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { OSearchInputComponent } from '../../input/search-input/o-search-input.component';
export declare const DEFAULT_INPUTS_O_LIST_PICKER_DIALOG: string[];
export declare class OListPickerDialogComponent implements AfterViewInit {
    dialogRef: MatDialogRef<OListPickerDialogComponent>;
    protected injector: Injector;
    filter: boolean;
    visibleData: any;
    searchVal: string;
    searchInput: OSearchInputComponent;
    protected data: any[];
    menuColumns: string;
    protected visibleColsArray: string[];
    protected _startIndex: number;
    protected recordsNumber: number;
    protected scrollThreshold: number;
    constructor(dialogRef: MatDialogRef<OListPickerDialogComponent>, injector: Injector, data: any);
    ngAfterViewInit(): void;
    startIndex: number;
    onClickListItem(e: any, value: any): void;
    trackByFn(index: number, item: any): number;
    onScroll(event: any): void;
    onFilterList(searchVal: any): void;
    isEmptyData(): boolean;
    private transform;
    private _isBlank;
}
