import { Injector } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
export declare class OTableMatPaginatorIntl extends MatPaginatorIntl {
    protected injector: Injector;
    itemsPerPageLabel: any;
    nextPageLabel: any;
    previousPageLabel: any;
    translateService: OTranslateService;
    protected onLanguageChangeSubscribe: any;
    constructor(injector: Injector);
    getORangeLabel(page: number, pageSize: number, length: number): string;
}
