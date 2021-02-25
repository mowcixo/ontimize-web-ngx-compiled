import { EventEmitter, Injector } from '@angular/core';
import { OTableExportButtonService } from './o-table-export-button.service';
export declare const DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON: string[];
export declare const DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON: string[];
export declare class OTableExportButtonComponent {
    private injector;
    icon: string;
    svgIcon: string;
    olabel: string;
    onClick: EventEmitter<any>;
    protected exportType: string;
    protected oTableExportButtonService: OTableExportButtonService;
    constructor(injector: Injector);
    click(): void;
}
