import { OTableCellEditorBooleanComponent } from './boolean/o-table-cell-editor-boolean.component';
import { OTableCellEditorDateComponent } from './date/o-table-cell-editor-date.component';
import { OTableCellEditorIntegerComponent } from './integer/o-table-cell-editor-integer.component';
import { OTableCellEditorRealComponent } from './real/o-table-cell-editor-real.component';
import { OTableCellEditorTextComponent } from './text/o-table-cell-editor-text.component';
import { OTableCellEditorTimeComponent } from './time/o-table-cell-editor-time.component';
export declare const O_TABLE_CELL_EDITORS: (typeof OTableCellEditorBooleanComponent | typeof OTableCellEditorDateComponent | typeof OTableCellEditorIntegerComponent | typeof OTableCellEditorRealComponent | typeof OTableCellEditorTextComponent | typeof OTableCellEditorTimeComponent)[];
export declare const O_TABLE_CELL_EDITORS_INPUTS: string[];
export declare const O_TABLE_CELL_EDITORS_OUTPUTS: string[];
export declare const editorsMapping: {
    boolean: typeof OTableCellEditorBooleanComponent;
    date: typeof OTableCellEditorDateComponent;
    integer: typeof OTableCellEditorIntegerComponent;
    real: typeof OTableCellEditorRealComponent;
    percentage: typeof OTableCellEditorRealComponent;
    currency: typeof OTableCellEditorRealComponent;
    text: typeof OTableCellEditorTextComponent;
    time: typeof OTableCellEditorTimeComponent;
};
