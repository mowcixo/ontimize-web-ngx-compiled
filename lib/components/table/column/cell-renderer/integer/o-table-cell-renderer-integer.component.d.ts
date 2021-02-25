import { AfterContentInit, Injector, OnInit, TemplateRef } from '@angular/core';
import { IIntegerPipeArgument, OIntegerPipe } from '../../../../../pipes/o-integer.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_INTEGER: string[];
export declare class OTableCellRendererIntegerComponent extends OBaseTableCellRenderer implements AfterContentInit, OnInit {
    protected injector: Injector;
    protected grouping: boolean;
    protected thousandSeparator: string;
    protected componentPipe: OIntegerPipe;
    protected pipeArguments: IIntegerPipeArgument;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    setComponentPipe(): void;
    initialize(): void;
}
