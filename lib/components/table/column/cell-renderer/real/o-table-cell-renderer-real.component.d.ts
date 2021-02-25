import { Injector, OnInit, TemplateRef } from '@angular/core';
import { IRealPipeArgument, ORealPipe } from '../../../../../pipes/o-real.pipe';
import { NumberService } from '../../../../../services/number.service';
import { OTableCellRendererIntegerComponent } from '../integer/o-table-cell-renderer-integer.component';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL: string[];
export declare class OTableCellRendererRealComponent extends OTableCellRendererIntegerComponent implements OnInit {
    protected injector: Injector;
    minDecimalDigits: number;
    maxDecimalDigits: number;
    protected decimalSeparator: string;
    protected numberService: NumberService;
    protected componentPipe: ORealPipe;
    protected pipeArguments: IRealPipeArgument;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    setComponentPipe(): void;
    initialize(): void;
}
