import { OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OColumnValueFilter } from '../../../../../types/o-column-value-filter.type';
import { OColumn } from '../../../column';
import { OTableComponent } from '../../../o-table.component';
export declare const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON: string[];
export declare class OTableHeaderColumnFilterIconComponent implements OnInit, OnDestroy {
    table: OTableComponent;
    column: OColumn;
    columnValueFilters: Array<OColumnValueFilter>;
    isColumnFilterActive: BehaviorSubject<boolean>;
    indicatorNumber: BehaviorSubject<string>;
    private subscription;
    constructor(table: OTableComponent);
    ngOnInit(): void;
    updateStateColumnFilter(columnValueFilters: Array<OColumnValueFilter>): void;
    getColumnValueFilterByAttr(): OColumnValueFilter;
    openColumnFilterDialog(event: any): void;
    getFilterIndicatorNumbered(): string;
    ngOnDestroy(): void;
}
