import { Injector, OnInit, TemplateRef } from '@angular/core';
import { IMomentPipeArgument, OMomentPipe } from '../../../../../pipes/o-moment.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TIME: string[];
export declare class OTableCellRendererTimeComponent extends OBaseTableCellRenderer implements OnInit {
    protected injector: Injector;
    protected componentPipe: OMomentPipe;
    protected pipeArguments: IMomentPipeArgument;
    protected _format: string;
    protected locale: string;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    format: string;
    setComponentPipe(): void;
    initialize(): void;
}
