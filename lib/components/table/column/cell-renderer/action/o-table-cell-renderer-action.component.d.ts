import { EventEmitter, Injector, OnInit, TemplateRef } from '@angular/core';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_ACTION: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_ACTION: string[];
export declare class OTableCellRendererActionComponent extends OBaseTableCellRenderer implements OnInit {
    protected injector: Injector;
    onClick: EventEmitter<object>;
    action: string;
    _icon: string;
    text: string;
    iconPosition: string;
    svgIcon: string;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    initialize(): void;
    getCellData(value: any): any;
    innerOnClick(event: any, rowData: any): void;
    icon: string;
    isIconPositionLeft(): boolean;
    isIconPositionRight(): boolean;
    isSvgIconPositionRight(): boolean;
    isSvgIconPositionLeft(): boolean;
}
