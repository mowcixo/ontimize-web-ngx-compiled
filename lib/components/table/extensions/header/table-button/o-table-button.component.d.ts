import { ElementRef, EventEmitter, Injector, OnInit } from '@angular/core';
import { OTableComponent } from '../../../o-table.component';
import { OTableButton } from '../../../../../interfaces/o-table-button.interface';
export declare const DEFAULT_INPUTS_O_TABLE_BUTTON: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_BUTTON: string[];
export declare class OTableButtonComponent implements OTableButton, OnInit {
    protected injector: Injector;
    elRef: ElementRef;
    protected _table: OTableComponent;
    onClick: EventEmitter<object>;
    oattr: string;
    enabled: boolean;
    icon: string;
    svgIcon: string;
    olabel: string;
    iconPosition: string;
    constructor(injector: Injector, elRef: ElementRef, _table: OTableComponent);
    ngOnInit(): void;
    innerOnClick(event: any): void;
    isIconPositionLeft(): boolean;
    readonly table: OTableComponent;
}
