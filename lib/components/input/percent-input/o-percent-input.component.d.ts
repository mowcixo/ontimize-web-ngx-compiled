import { OnInit } from '@angular/core';
import { ORealInputComponent } from '../real-input/o-real-input.component';
export declare const DEFAULT_INPUTS_O_PERCENT_INPUT: string[];
export declare const DEFAULT_OUTPUTS_O_PERCENT_INPUT: string[];
export declare class OPercentInputComponent extends ORealInputComponent implements OnInit {
    grouping: boolean;
    ngOnInit(): void;
}
