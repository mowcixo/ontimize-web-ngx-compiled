import { TemplateRef, EventEmitter } from '@angular/core';
export declare const DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE: string[];
export declare const DEFAULT_INPUTS_O_TABLE_ROW_EXPANDABLE: string[];
export declare class OTableRowExpandedChange {
    data: any;
    rowIndex: number;
}
export declare class OTableRowExpandableComponent {
    constructor();
    templateRef: TemplateRef<any>;
    onExpanded: EventEmitter<OTableRowExpandedChange>;
    onCollapsed: EventEmitter<OTableRowExpandedChange>;
    private _iconCollapse;
    private _iconExpand;
    expandableColumnVisible: boolean;
    iconCollapse: string;
    iconExpand: string;
}
