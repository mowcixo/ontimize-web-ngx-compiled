import { OnInit } from '@angular/core';
import { ORealInputComponent } from '../real-input/o-real-input.component';
export declare const DEFAULT_INPUTS_O_CURRENCY_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_CURRENCY_INPUT: string[];
export declare class OCurrencyInputComponent extends ORealInputComponent implements OnInit {
    static currency_icons: string[];
    currency_symbols: {
        CRC: string;
        NGN: string;
        PHP: string;
        PLN: string;
        PYG: string;
        THB: string;
        UAH: string;
        VND: string;
    };
    currencySymbol: string;
    currencySymbolPosition: string;
    protected existsOntimizeIcon(): boolean;
    useIcon(position: string): boolean;
    useSymbol(position: string): boolean;
}
