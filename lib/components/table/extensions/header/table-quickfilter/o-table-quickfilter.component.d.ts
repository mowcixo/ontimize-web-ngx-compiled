import { AfterViewInit, ElementRef, EventEmitter, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange, MatMenu } from '@angular/material';
import { Subscription } from 'rxjs';
import { OTableOptions } from '../../../../../interfaces/o-table-options.interface';
import { OTableQuickfilter } from '../../../../../interfaces/o-table-quickfilter.interface';
import { Expression } from '../../../../../types/expression.type';
import { OInputsOptions } from '../../../../../types/o-inputs-options.type';
import { OColumn } from '../../../column/o-column.class';
import { OTableComponent } from '../../../o-table.component';
export declare const DEFAULT_INPUTS_O_TABLE_QUICKFILTER: any[];
export declare const DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER: string[];
export declare class OTableQuickfilterComponent implements OTableQuickfilter, OnInit, AfterViewInit, OnDestroy {
    protected injector: Injector;
    protected elRef: ElementRef;
    protected table: OTableComponent;
    filter: ElementRef;
    matMenu: MatMenu;
    value: string;
    onChange: EventEmitter<string>;
    formControl: any;
    protected oInputsOptions: OInputsOptions;
    protected quickFilterObservable: Subscription;
    constructor(injector: Injector, elRef: ElementRef, table: OTableComponent);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    readonly oTableOptions: OTableOptions;
    readonly quickFilterColumns: OColumn[];
    readonly filterExpression: Expression;
    getUserFilter(): Expression;
    initializeEventFilter(): void;
    setValue(value: any, trigger?: boolean): void;
    onMenuClosed(): void;
    isChecked(column: OColumn): boolean;
    onCheckboxChange(column: OColumn, event: MatCheckboxChange): void;
    showCaseSensitiveCheckbox(): boolean;
    areAllColumnsChecked(): boolean;
    onSelectAllChange(event: MatCheckboxChange): void;
    protected isFilterableColumn(column: OColumn): boolean;
}