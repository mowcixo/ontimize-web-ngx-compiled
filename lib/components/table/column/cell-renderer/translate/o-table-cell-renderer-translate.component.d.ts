import { Injector, TemplateRef } from '@angular/core';
import { ITranslatePipeArgument, OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_TRANSLATE: string[];
export declare class OTableCellRendererTranslateComponent extends OBaseTableCellRenderer {
    protected injector: Injector;
    templateref: TemplateRef<any>;
    translateArgsFn: (rowData: any) => any[];
    protected componentPipe: OTranslatePipe;
    protected pipeArguments: ITranslatePipeArgument;
    constructor(injector: Injector);
    setComponentPipe(): void;
    getCellData(cellvalue: any, rowvalue?: any): string;
}
