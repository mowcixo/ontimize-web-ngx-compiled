import { ElementRef, Injector, TemplateRef } from '@angular/core';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT: string[];
export declare class OTableCellEditorTextComponent extends OBaseTableCellEditor {
    protected injector: Injector;
    templateref: TemplateRef<any>;
    inputRef: ElementRef;
    constructor(injector: Injector);
}
