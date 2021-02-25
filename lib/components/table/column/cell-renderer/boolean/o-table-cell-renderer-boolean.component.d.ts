import { Injector, OnInit, TemplateRef } from '@angular/core';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export declare const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_BOOLEAN: string[];
export declare class OTableCellRendererBooleanComponent extends OBaseTableCellRenderer implements OnInit {
    protected injector: Injector;
    trueValue: any;
    falseValue: any;
    protected _renderTrueValue: any;
    protected _renderFalseValue: any;
    protected _renderType: string;
    protected _booleanType: string;
    protected translateService: OTranslateService;
    templateref: TemplateRef<any>;
    constructor(injector: Injector);
    initialize(): void;
    protected parseInputs(): void;
    protected parseStringInputs(): void;
    protected parseNumberInputs(): void;
    hasCellDataTrueValue(cellData: any): boolean;
    getCellData(cellvalue: any, rowvalue?: any): any;
    booleanType: string;
    renderType: string;
    renderTrueValue: string;
    renderFalseValue: string;
}
