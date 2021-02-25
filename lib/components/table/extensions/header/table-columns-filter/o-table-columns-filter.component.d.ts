import { Injector, OnInit } from '@angular/core';
import { OColumn } from '../../../column/o-column.class';
import { OTableComponent } from '../../../o-table.component';
export declare const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_COLUMN_FILTER: any[];
export declare class OTableColumnsFilterComponent implements OnInit {
    protected injector: Injector;
    protected table: OTableComponent;
    static DEFAULT_COMPARISON_TYPE: string;
    static MODEL_COMPARISON_TYPE: string;
    static OTableColumnsFilterModes: string[];
    protected _columns: string;
    protected _mode: string;
    preloadValues: boolean;
    mode: string;
    protected _columnsArray: Array<string>;
    protected columnsComparisonProperty: object;
    constructor(injector: Injector, table: OTableComponent);
    ngOnInit(): void;
    isColumnFilterable(attr: string): boolean;
    getColumnComparisonValue(column: OColumn, val: any): any;
    columns: string;
    columnsArray: string[];
}
