import { Injector, TemplateRef } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER: string[];
export declare class OTableCellEditorIntegerComponent extends OBaseTableCellEditor {
    protected injector: Injector;
    templateref: TemplateRef<any>;
    min: number;
    max: number;
    step: number;
    constructor(injector: Injector);
    getCellData(): number;
    resolveValidators(): ValidatorFn[];
    protected minValidator(control: FormControl): {
        min: {
            requiredMin: number;
        };
    } | {
        min?: undefined;
    };
    protected maxValidator(control: FormControl): {
        max: {
            requiredMax: number;
        };
    } | {
        max?: undefined;
    };
}
