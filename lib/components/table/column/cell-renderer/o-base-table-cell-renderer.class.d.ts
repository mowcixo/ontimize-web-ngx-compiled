import { AfterContentInit, Injector, PipeTransform, TemplateRef, OnInit } from '@angular/core';
import { OTableColumn } from '../../../../interfaces/o-table-column.interface';
import { OTableComponent } from '../../o-table.component';
export declare const DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER: string[];
export declare class OBaseTableCellRenderer implements OnInit, AfterContentInit {
    protected injector: Injector;
    templateref: TemplateRef<any>;
    tableColumn: OTableColumn;
    _filterSource: 'render' | 'data' | 'both';
    filterFunction: (cellValue: any, rowValue: any, quickFilter?: string) => boolean;
    protected type: string;
    protected pipeArguments: any;
    protected componentPipe: PipeTransform;
    constructor(injector: Injector);
    ngOnInit(): void;
    initialize(): void;
    ngAfterContentInit(): void;
    readonly table: OTableComponent;
    readonly column: string;
    registerRenderer(): void;
    getCellData(cellvalue: any, rowvalue?: any): string;
    getTooltip(cellValue: any, rowValue: any): string;
    filterSource: string;
    getFilter(cellValue: any, rowValue?: any): any[];
}
