import { Injector, OnInit, TemplateRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN: string[];
export declare class OTableCellEditorBooleanComponent extends OBaseTableCellEditor implements OnInit {
    protected injector: Injector;
    templateref: TemplateRef<any>;
    indeterminate: boolean;
    indeterminateOnNull: boolean;
    trueValue: any;
    falseValue: any;
    booleanType: string;
    autoCommit: boolean;
    constructor(injector: Injector);
    initialize(): void;
    protected parseInputs(): void;
    protected parseStringInputs(): void;
    protected parseNumberInputs(): void;
    startEdition(data: any): void;
    getCellData(): any;
    hasCellDataTrueValue(cellData: any): boolean;
    protected parseValueByType(val: any): any;
    onChange(arg: MatCheckboxChange): void;
}
