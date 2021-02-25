import { OTableOptions } from '../../../interfaces/o-table-options.interface';
import { OColumn } from '../column/o-column.class';
export declare class DefaultOTableOptions implements OTableOptions {
    columns: Array<OColumn>;
    filter: boolean;
    filterCaseSensitive: boolean;
    protected _visibleColumns: Array<any>;
    protected _selectColumn: OColumn;
    protected _expandableColumn: OColumn;
    constructor();
    visibleColumns: Array<any>;
    readonly columnsInsertables: Array<string>;
    selectColumn: OColumn;
    expandableColumn: OColumn;
}
