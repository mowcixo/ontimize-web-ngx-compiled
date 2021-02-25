import { Injector, OnInit, TemplateRef } from '@angular/core';
import { ICurrencyPipeArgument, OCurrencyPipe } from '../../../../../pipes/o-currency.pipe';
import { CurrencyService } from '../../../../../services/currency.service';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY: string[];
export declare class OTableCellRendererCurrencyComponent extends OBaseTableCellRenderer implements OnInit {
    protected injector: Injector;
    minDecimalDigits: number;
    maxDecimalDigits: number;
    protected currencySymbol: string;
    protected currencySymbolPosition: string;
    protected decimalSeparator: string;
    protected grouping: boolean;
    protected thousandSeparator: string;
    protected currencyService: CurrencyService;
    protected componentPipe: OCurrencyPipe;
    protected pipeArguments: ICurrencyPipeArgument;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    setComponentPipe(): void;
    initialize(): void;
}
