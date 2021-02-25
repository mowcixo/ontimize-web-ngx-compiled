import { Injector, OnInit, TemplateRef } from '@angular/core';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_IMAGE: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_CELL_RENDERER_IMAGE: string[];
export declare class OTableCellRendererImageComponent extends OBaseTableCellRenderer implements OnInit {
    protected injector: Injector;
    imageType: string;
    emptyImage: string;
    protected _source: string;
    avatar: string;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    initialize(): void;
    getSource(cellData: any): string;
}
