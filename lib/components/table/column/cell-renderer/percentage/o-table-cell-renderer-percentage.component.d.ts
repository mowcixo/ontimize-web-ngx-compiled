import { Injector, OnInit, TemplateRef } from '@angular/core';
import { IPercentPipeArgument, OPercentageValueBaseType, OPercentPipe } from '../../../../../pipes/o-percentage.pipe';
import { NumberService } from '../../../../../services/number.service';
import { OTableCellRendererRealComponent } from '../real/o-table-cell-renderer-real.component';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_PERCENTAGE: string[];
export declare class OTableCellRendererPercentageComponent extends OTableCellRendererRealComponent implements OnInit {
    protected injector: Injector;
    decimalSeparator: string;
    minDecimalDigits: number;
    maxDecimalDigits: number;
    valueBase: OPercentageValueBaseType;
    protected numberService: NumberService;
    protected componentPipe: OPercentPipe;
    protected pipeArguments: IPercentPipeArgument;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    setComponentPipe(): void;
    initialize(): void;
}
