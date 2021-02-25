import { EventEmitter, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services/dialog.service';
import { OTableConfiguration } from '../../../../../types/o-table-configuration.type';
export declare class OTableApplyConfigurationDialogComponent implements OnInit {
    dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>;
    protected injector: Injector;
    default_configuration: string;
    configurations: OTableConfiguration[];
    onDelete: EventEmitter<string>;
    protected configurationList: MatSelectionList;
    protected dialogService: DialogService;
    constructor(dialogRef: MatDialogRef<OTableApplyConfigurationDialogComponent>, data: OTableConfiguration[], injector: Injector);
    ngOnInit(): void;
    loadConfigurations(configurations: OTableConfiguration[]): void;
    removeConfiguration(configurationName: string): void;
    isDefaultConfigurationSelected(): boolean;
    getSelectedConfigurationName(): string;
}
