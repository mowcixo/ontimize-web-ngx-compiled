import { Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IExportService } from '../../../../../interfaces/export-service.interface';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OTableExportButtonService } from '../../export-button/o-table-export-button.service';
import { OTableExportConfiguration } from '../../header/table-menu/o-table-export-configuration.class';
export declare class OTableExportDialogComponent implements OnInit, OnDestroy {
    dialogRef: MatDialogRef<OTableExportDialogComponent>;
    protected injector: Injector;
    config: OTableExportConfiguration;
    protected snackBarService: SnackBarService;
    protected exportService: IExportService;
    protected translateService: OTranslateService;
    protected oTableExportButtonService: OTableExportButtonService;
    protected visibleButtons: string[];
    private subscription;
    constructor(dialogRef: MatDialogRef<OTableExportDialogComponent>, injector: Injector, config: OTableExportConfiguration);
    ngOnInit(): void;
    ngOnDestroy(): void;
    initialize(): void;
    configureService(): void;
    export(exportType: string, button?: any): void;
    proccessExportData(data: object[], sqlTypes: object): void;
    isButtonVisible(btn: string): boolean;
    protected handleError(err: any): void;
}
