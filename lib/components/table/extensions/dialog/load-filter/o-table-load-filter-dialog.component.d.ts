import { ChangeDetectorRef, EventEmitter, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services/dialog.service';
import { OTableFiltersStatus } from '../../../../../types/o-table-filter-status.type';
export declare class OTableLoadFilterDialogComponent implements OnInit {
    dialogRef: MatDialogRef<OTableLoadFilterDialogComponent>;
    protected injector: Injector;
    filterList: MatSelectionList;
    filters: Array<OTableFiltersStatus>;
    onDelete: EventEmitter<string>;
    protected dialogService: DialogService;
    protected cd: ChangeDetectorRef;
    constructor(dialogRef: MatDialogRef<OTableLoadFilterDialogComponent>, data: Array<OTableFiltersStatus>, injector: Injector);
    ngOnInit(): void;
    loadFilters(filters: Array<OTableFiltersStatus>): void;
    getSelectedFilterName(): string;
    removeFilter(filterName: string): void;
}
