import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatMenu } from '@angular/material';
import { InputConverter } from '../../../../../decorators/input-converter';
import { DialogService } from '../../../../../services/dialog.service';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Codes } from '../../../../../util/codes';
import { PermissionsUtils } from '../../../../../util/permissions';
import { Util } from '../../../../../util/util';
import { OTableCellRendererImageComponent } from '../../../column/cell-renderer/image/o-table-cell-renderer-image.component';
import { OTableComponent } from '../../../o-table.component';
import { OTableApplyConfigurationDialogComponent } from '../../dialog/apply-configuration/o-table-apply-configuration-dialog.component';
import { OTableExportDialogComponent } from '../../dialog/export/o-table-export-dialog.component';
import { OTableLoadFilterDialogComponent } from '../../dialog/load-filter/o-table-load-filter-dialog.component';
import { OTableStoreConfigurationDialogComponent } from '../../dialog/store-configuration/o-table-store-configuration-dialog.component';
import { OTableStoreFilterDialogComponent } from '../../dialog/store-filter/o-table-store-filter-dialog.component';
import { OTableVisibleColumnsDialogComponent } from '../../dialog/visible-columns/o-table-visible-columns-dialog.component';
import { OTableOptionComponent } from '../table-option/o-table-option.component';
import { OTableExportConfiguration } from './o-table-export-configuration.class';
export const DEFAULT_INPUTS_O_TABLE_MENU = [
    'selectAllCheckbox: select-all-checkbox',
    'exportButton: export-button',
    'columnsVisibilityButton: columns-visibility-button',
    'showConfigurationOption: show-configuration-option',
    'showFilterOption: show-filter-option'
];
export const DEFAULT_OUTPUTS_O_TABLE_MENU = [];
export class OTableMenuComponent {
    constructor(injector, dialog, cd, table) {
        this.injector = injector;
        this.dialog = dialog;
        this.cd = cd;
        this.table = table;
        this.selectAllCheckbox = false;
        this.exportButton = true;
        this.showConfigurationOption = true;
        this.showFilterOption = true;
        this.columnsVisibilityButton = true;
        this.mutationObservers = [];
        this.dialogService = this.injector.get(DialogService);
        this.translateService = this.injector.get(OTranslateService);
        this.snackBarService = this.injector.get(SnackBarService);
    }
    ngOnInit() {
        this.permissions = this.table.getMenuPermissions();
    }
    ngAfterViewInit() {
        if (this.columnFilterOption) {
            this.columnFilterOption.setActive(this.table.showFilterByColumnIcon);
            this.cd.detectChanges();
        }
        if (!this.permissions.items || this.permissions.items.length === 0) {
            return;
        }
        if (this.selectAllCheckboxOption && !this.enabledSelectAllCheckbox) {
            this.disableOTableOptionComponent(this.selectAllCheckboxOption);
        }
        if (this.exportButtonOption && !this.enabledExportButton) {
            this.disableOTableOptionComponent(this.exportButtonOption);
        }
        if (this.columnsVisibilityButtonOption && !this.enabledColumnsVisibilityButton) {
            this.disableOTableOptionComponent(this.columnsVisibilityButtonOption);
        }
        if (this.filterMenuButton && !this.enabledFilterMenu) {
            this.disableButton(this.filterMenuButton);
        }
        if (this.configurationMenuButton && !this.enabledConfigurationMenu) {
            this.disableButton(this.configurationMenuButton);
        }
        this.cd.detectChanges();
    }
    disableOTableOptionComponent(comp) {
        comp.enabled = false;
        const buttonEL = comp.elRef.nativeElement.querySelector('button');
        const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
        this.mutationObservers.push(obs);
    }
    disableButton(buttonEL) {
        buttonEL.nativeElement.disabled = true;
        const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL.nativeElement);
        this.mutationObservers.push(obs);
    }
    ngOnDestroy() {
        if (this.mutationObservers) {
            this.mutationObservers.forEach((m) => {
                m.disconnect();
            });
        }
    }
    registerOptions(oTableOptions) {
        const items = this.permissions.items || [];
        const fixedOptions = ['select-all-checkbox', 'export', 'show-hide-columns', 'filter', 'configuration'];
        const userItems = items.filter((perm) => fixedOptions.indexOf(perm.attr) === -1);
        const self = this;
        userItems.forEach((perm) => {
            const option = oTableOptions.find((oTableOption) => oTableOption.oattr === perm.attr);
            self.setPermissionsToOTableOption(perm, option);
        });
    }
    setPermissionsToOTableOption(perm, option) {
        if (perm.visible === false && option) {
            option.elRef.nativeElement.remove();
        }
        else if (perm.enabled === false && option) {
            option.enabled = false;
            const buttonEL = option.elRef.nativeElement.querySelector('button');
            const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
            this.mutationObservers.push(obs);
        }
    }
    getPermissionByAttr(attr) {
        const items = this.permissions.items || [];
        return items.find((perm) => perm.attr === attr);
    }
    get isSelectAllOptionActive() {
        return this.table.oTableOptions.selectColumn.visible;
    }
    get showColumnsFilterOption() {
        return this.table.oTableColumnsFilterComponent !== undefined;
    }
    get enabledColumnsFilterOption() {
        return this.table.oTableColumnsFilterComponent !== undefined;
    }
    get showSelectAllCheckbox() {
        if (!this.selectAllCheckbox) {
            return false;
        }
        const perm = this.getPermissionByAttr('select-all-checkbox');
        return this.showFilterOption && !(perm && perm.visible === false);
    }
    get rowHeightObservable() {
        return this.table.rowHeightObservable;
    }
    get enabledSelectAllCheckbox() {
        const perm = this.getPermissionByAttr('select-all-checkbox');
        return !(perm && perm.enabled === false);
    }
    get showExportButton() {
        if (!this.exportButton) {
            return false;
        }
        const perm = this.getPermissionByAttr('export');
        return !(perm && perm.visible === false);
    }
    get enabledExportButton() {
        const perm = this.getPermissionByAttr('export');
        return !(perm && perm.enabled === false);
    }
    get showColumnsVisibilityButton() {
        if (!this.columnsVisibilityButton) {
            return false;
        }
        const perm = this.getPermissionByAttr('show-hide-columns');
        return !(perm && perm.visible === false);
    }
    get enabledColumnsVisibilityButton() {
        const perm = this.getPermissionByAttr('show-hide-columns');
        return !(perm && perm.enabled === false);
    }
    get showFilterMenu() {
        const perm = this.getPermissionByAttr('filter');
        return this.showFilterOption && !(perm && perm.visible === false);
    }
    get enabledFilterMenu() {
        const perm = this.getPermissionByAttr('filter');
        return !(perm && perm.enabled === false);
    }
    get showConfigurationMenu() {
        const perm = this.getPermissionByAttr('configuration');
        return this.showConfigurationOption && !(perm && perm.visible === false);
    }
    get enabledConfigurationMenu() {
        const perm = this.getPermissionByAttr('configuration');
        return !(perm && perm.enabled === false);
    }
    onShowsSelects() {
        const tableOptions = this.table.oTableOptions;
        tableOptions.selectColumn.visible = !tableOptions.selectColumn.visible;
        this.table.initializeCheckboxColumn();
    }
    onExportButtonClicked() {
        const tableOptions = this.table.oTableOptions;
        const exportCnfg = new OTableExportConfiguration();
        const colsNotIncluded = tableOptions.columns.filter(c => void 0 !== c.renderer && c.renderer instanceof OTableCellRendererImageComponent).map(c => c.attr);
        colsNotIncluded.push(Codes.NAME_COLUMN_SELECT);
        switch (this.table.exportMode) {
            case Codes.EXPORT_MODE_ALL:
                exportCnfg.filter = this.table.getComponentFilter();
                break;
            case Codes.EXPORT_MODE_LOCAL:
                exportCnfg.data = this.table.getAllRenderedValues();
                colsNotIncluded.forEach(attr => exportCnfg.data.forEach(row => delete row[attr]));
                break;
            default:
                exportCnfg.data = this.table.getRenderedValue();
                colsNotIncluded.forEach(attr => exportCnfg.data.forEach(row => delete row[attr]));
                break;
        }
        exportCnfg.mode = this.table.exportMode;
        exportCnfg.entity = this.table.entity;
        exportCnfg.columns = tableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1);
        const tableColumnNames = {};
        tableOptions.visibleColumns.filter(c => colsNotIncluded.indexOf(c) === -1).forEach(c => {
            const oColumn = tableOptions.columns.find(oc => oc.attr === c);
            tableColumnNames[c] = this.translateService.get(oColumn.title ? oColumn.title : oColumn.attr);
        });
        exportCnfg.columnNames = tableColumnNames;
        exportCnfg.sqlTypes = this.table.getSqlTypes();
        exportCnfg.service = this.table.service;
        exportCnfg.serviceType = this.table.exportServiceType;
        exportCnfg.visibleButtons = this.table.visibleExportDialogButtons;
        exportCnfg.options = this.table.exportOptsTemplate;
        this.dialog.open(OTableExportDialogComponent, {
            data: exportCnfg,
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
    }
    onChangeColumnsVisibilityClicked() {
        const dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
            data: {
                visibleColumns: Util.parseArray(this.table.visibleColumns, true),
                columnsData: this.table.oTableOptions.columns,
                rowHeight: this.table.rowHeight
            },
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.table.visibleColArray = dialogRef.componentInstance.getVisibleColumns();
                const columnsOrder = dialogRef.componentInstance.getColumnsOrder();
                this.table.oTableOptions.columns.sort((a, b) => columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr));
                this.table.refreshColumnsWidth();
                this.table.onVisibleColumnsChange.emit(this.table.visibleColArray);
            }
        });
    }
    onFilterByColumnClicked() {
        if (this.table.showFilterByColumnIcon && this.table.dataSource.isColumnValueFilterActive()) {
            const self = this;
            this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DISCARD_FILTER_BY_COLUMN').then(res => {
                if (res) {
                    self.table.dataSource.clearColumnFilters();
                }
                self.table.showFilterByColumnIcon = !res;
                self.table.cd.detectChanges();
            });
        }
        else {
            this.table.showFilterByColumnIcon = !this.table.showFilterByColumnIcon;
            this.table.cd.detectChanges();
        }
    }
    onStoreFilterClicked() {
        const dialogRef = this.dialog.open(OTableStoreFilterDialogComponent, {
            data: this.table.oTableStorage.getStoredFilters().map(filter => filter.name),
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.table.oTableStorage.storeFilter(dialogRef.componentInstance.getFilterAttributes());
            }
        });
    }
    onLoadFilterClicked() {
        const dialogRef = this.dialog.open(OTableLoadFilterDialogComponent, {
            data: this.table.oTableStorage.getStoredFilters(),
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.componentInstance.onDelete.subscribe(filterName => this.table.oTableStorage.deleteStoredFilter(filterName));
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const selectedFilterName = dialogRef.componentInstance.getSelectedFilterName();
                if (selectedFilterName) {
                    const storedFilter = this.table.oTableStorage.getStoredFilterConf(selectedFilterName);
                    if (storedFilter) {
                        this.table.setFiltersConfiguration(storedFilter);
                        this.table.reloadPaginatedDataFromStart();
                    }
                }
            }
        });
    }
    onClearFilterClicked() {
        this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_CLEAR_FILTER').then(result => {
            if (result) {
                this.table.clearFilters();
                this.table.reloadPaginatedDataFromStart();
            }
        });
    }
    onStoreConfigurationClicked() {
        const dialogRef = this.dialog.open(OTableStoreConfigurationDialogComponent, {
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        const self = this;
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const configurationData = dialogRef.componentInstance.getConfigurationAttributes();
                const tableProperties = dialogRef.componentInstance.getSelectedTableProperties();
                self.table.oTableStorage.storeConfiguration(configurationData, tableProperties);
            }
        });
    }
    onApplyConfigurationClicked() {
        const dialogRef = this.dialog.open(OTableApplyConfigurationDialogComponent, {
            data: this.table.oTableStorage.getStoredConfigurations(),
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        const self = this;
        dialogRef.componentInstance.onDelete.subscribe(configurationName => this.table.oTableStorage.deleteStoredConfiguration(configurationName));
        dialogRef.afterClosed().subscribe(result => {
            if (result && dialogRef.componentInstance.isDefaultConfigurationSelected()) {
                self.table.applyDefaultConfiguration();
            }
            else if (result) {
                const selectedConfigurationName = dialogRef.componentInstance.getSelectedConfigurationName();
                if (selectedConfigurationName) {
                    self.table.applyConfiguration(selectedConfigurationName);
                }
            }
        });
    }
}
OTableMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-menu',
                template: "<mat-menu #menu=\"matMenu\" x-position=\"before\" [class]=\"(rowHeightObservable | async) +' o-table-menu'\">\n  <o-table-option #selectAllCheckboxOption *ngIf=\"showSelectAllCheckbox\" [active]=\"isSelectAllOptionActive\"\n    (onClick)=\"onShowsSelects()\" label=\"TABLE.BUTTONS.SELECT\" show-active-icon=\"true\"></o-table-option>\n  <o-table-option #exportButtonOption *ngIf=\"showExportButton\" (onClick)=\"onExportButtonClicked()\"\n    label=\"TABLE.BUTTONS.EXPORT\"></o-table-option>\n  <o-table-option #columnsVisibilityButtonOption *ngIf=\"showColumnsVisibilityButton\"\n    (onClick)=\"onChangeColumnsVisibilityClicked()\" label=\"TABLE.BUTTONS.COLVIS\"></o-table-option>\n\n  <button type=\"button\" #filterMenuButton *ngIf=\"showFilterMenu\" mat-menu-item [matMenuTriggerFor]=\"filterMenu\">{{\n    'TABLE.BUTTONS.FILTER' | oTranslate }}</button>\n  <button type=\"button\" #configurationMenuButton *ngIf=\"showConfigurationMenu\" mat-menu-item\n    [matMenuTriggerFor]=\"configurationMenu\">{{\n    'TABLE.BUTTONS.CONFIGURATION' | oTranslate }}</button>\n  <ng-content></ng-content>\n</mat-menu>\n\n<mat-menu #filterMenu=\"matMenu\" [class]=\"(rowHeightObservable| async) +' o-table-menu'\">\n  <o-table-option #columnFilterOption *ngIf=\"showColumnsFilterOption\" show-active-icon=\"true\"\n    (onClick)=\"onFilterByColumnClicked()\" label=\"TABLE.BUTTONS.FILTER_BY_COLUMN\">\n  </o-table-option>\n  <button type=\"button\" mat-menu-item\n    (click)=\"onStoreFilterClicked()\">{{ 'TABLE.BUTTONS.FILTER_SAVE' | oTranslate }}</button>\n  <button type=\"button\" mat-menu-item\n    (click)=\"onLoadFilterClicked()\">{{ 'TABLE.BUTTONS.FILTER_LOAD' | oTranslate }}</button>\n  <button type=\"button\" mat-menu-item\n    (click)=\"onClearFilterClicked()\">{{ 'TABLE.BUTTONS.FILTER_CLEAR' | oTranslate }}</button>\n</mat-menu>\n\n<mat-menu #configurationMenu=\"matMenu\" [class]=\"(rowHeightObservable | async) +' o-table-menu'\">\n  <button type=\"button\" mat-menu-item (click)=\"onStoreConfigurationClicked()\">{{ 'TABLE.BUTTONS.SAVE_CONFIGURATION' |\n    oTranslate }}</button>\n  <button type=\"button\" mat-menu-item (click)=\"onApplyConfigurationClicked()\">{{ 'TABLE.BUTTONS.APPLY_CONFIGURATION' |\n    oTranslate }}</button>\n</mat-menu>",
                inputs: DEFAULT_INPUTS_O_TABLE_MENU,
                outputs: DEFAULT_OUTPUTS_O_TABLE_MENU,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-table-menu]': 'true'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [""]
            }] }
];
OTableMenuComponent.ctorParameters = () => [
    { type: Injector },
    { type: MatDialog },
    { type: ChangeDetectorRef },
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
OTableMenuComponent.propDecorators = {
    matMenu: [{ type: ViewChild, args: ['menu', { static: true },] }],
    selectAllCheckboxOption: [{ type: ViewChild, args: ['selectAllCheckboxOption', { static: false },] }],
    exportButtonOption: [{ type: ViewChild, args: ['exportButtonOption', { static: false },] }],
    columnsVisibilityButtonOption: [{ type: ViewChild, args: ['columnsVisibilityButtonOption', { static: false },] }],
    filterMenuButton: [{ type: ViewChild, args: ['filterMenuButton', { read: ElementRef, static: false },] }],
    configurationMenuButton: [{ type: ViewChild, args: ['configurationMenuButton', { read: ElementRef, static: false },] }],
    filterMenu: [{ type: ViewChild, args: ['filterMenu', { static: false },] }],
    configurationMenu: [{ type: ViewChild, args: ['configurationMenu', { static: false },] }],
    columnFilterOption: [{ type: ViewChild, args: ['columnFilterOption', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableMenuComponent.prototype, "selectAllCheckbox", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableMenuComponent.prototype, "exportButton", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableMenuComponent.prototype, "showConfigurationOption", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableMenuComponent.prototype, "showFilterOption", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableMenuComponent.prototype, "columnsVisibilityButton", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1tZW51L28tdGFibGUtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBR1IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUUzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBRzFGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sMkVBQTJFLENBQUM7QUFFN0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLCtFQUErRSxDQUFDO0FBQ3hJLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtEQUErRCxDQUFDO0FBQ2hILE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLCtFQUErRSxDQUFDO0FBQ3hJLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLGlFQUFpRSxDQUFDO0FBQ25ILE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLHVFQUF1RSxDQUFDO0FBQzVILE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ2pGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRWpGLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHO0lBRXpDLHdDQUF3QztJQUd4Qyw2QkFBNkI7SUFHN0Isb0RBQW9EO0lBR3BELG9EQUFvRDtJQUdwRCxzQ0FBc0M7Q0FDdkMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHLEVBQUUsQ0FBQztBQWMvQyxNQUFNLE9BQU8sbUJBQW1CO0lBMEM5QixZQUNZLFFBQWtCLEVBQ2xCLE1BQWlCLEVBQ2pCLEVBQXFCLEVBQ3NCLEtBQXNCO1FBSGpFLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNqQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNzQixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQTFDN0Usc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBRW5DLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBRTdCLDRCQUF1QixHQUFZLElBQUksQ0FBQztRQUV4QyxxQkFBZ0IsR0FBWSxJQUFJLENBQUM7UUFFakMsNEJBQXVCLEdBQVksSUFBSSxDQUFDO1FBNEI5QixzQkFBaUIsR0FBdUIsRUFBRSxDQUFDO1FBUW5ELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ3JELENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN6QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xFLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFO1lBQ2xFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUNqRTtRQUNELElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ3hELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksSUFBSSxDQUFDLDZCQUE2QixJQUFJLENBQUMsSUFBSSxDQUFDLDhCQUE4QixFQUFFO1lBQzlFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUN2RTtRQUNELElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3BELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0M7UUFDRCxJQUFJLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtZQUNsRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRVMsNEJBQTRCLENBQUMsSUFBMkI7UUFDaEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVTLGFBQWEsQ0FBQyxRQUFvQjtRQUMxQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdkMsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBbUIsRUFBRSxFQUFFO2dCQUNyRCxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxlQUFlLENBQUMsYUFBc0M7UUFDcEQsTUFBTSxLQUFLLEdBQW1CLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUMzRCxNQUFNLFlBQVksR0FBRyxDQUFDLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDdkcsTUFBTSxTQUFTLEdBQW1CLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9HLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBa0IsRUFBRSxFQUFFO1lBQ3ZDLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFtQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLDRCQUE0QixDQUFDLElBQWtCLEVBQUUsTUFBNkI7UUFDdEYsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDcEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckM7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLE1BQU0sRUFBRTtZQUMzQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN2QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEUsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxJQUFZO1FBQzlCLE1BQU0sS0FBSyxHQUFtQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDM0QsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsSUFBSSx1QkFBdUI7UUFDekIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxJQUFJLHVCQUF1QjtRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssU0FBUyxDQUFDO0lBQy9ELENBQUM7SUFFRCxJQUFJLDBCQUEwQjtRQUM1QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEtBQUssU0FBUyxDQUFDO0lBQy9ELENBQUM7SUFFRCxJQUFJLHFCQUFxQjtRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzNCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxNQUFNLElBQUksR0FBaUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDM0UsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxJQUFJLG1CQUFtQjtRQUNyQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUM7SUFDeEMsQ0FBQztJQUNELElBQUksd0JBQXdCO1FBQzFCLE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUMzRSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELElBQUksbUJBQW1CO1FBQ3JCLE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELElBQUksMkJBQTJCO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDakMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUN6RSxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSw4QkFBOEI7UUFDaEMsTUFBTSxJQUFJLEdBQWlCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsTUFBTSxJQUFJLEdBQWlCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5RCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELElBQUkscUJBQXFCO1FBQ3ZCLE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckUsT0FBTyxJQUFJLENBQUMsdUJBQXVCLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxJQUFJLHdCQUF3QjtRQUMxQixNQUFNLElBQUksR0FBaUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxjQUFjO1FBQ1osTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDOUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQztRQUN2RSxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELHFCQUFxQjtRQUNuQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztRQUM5QyxNQUFNLFVBQVUsR0FBOEIsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1FBRzlFLE1BQU0sZUFBZSxHQUFhLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUSxZQUFZLGdDQUFnQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JLLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFHL0MsUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUM3QixLQUFLLEtBQUssQ0FBQyxlQUFlO2dCQUN4QixVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDcEQsTUFBTTtZQUNSLEtBQUssS0FBSyxDQUFDLGlCQUFpQjtnQkFDMUIsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLENBQUM7Z0JBQ3BELGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEYsTUFBTTtZQUNSO2dCQUNFLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUNoRCxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLE1BQU07U0FDVDtRQUNELFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDeEMsVUFBVSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUd0QyxVQUFVLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhHLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzVCLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyRixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDL0QsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEcsQ0FBQyxDQUFDLENBQUM7UUFDSCxVQUFVLENBQUMsV0FBVyxHQUFHLGdCQUFnQixDQUFDO1FBRTFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUUvQyxVQUFVLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3hDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUN0RCxVQUFVLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUM7UUFDbEUsVUFBVSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBRW5ELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQzVDLElBQUksRUFBRSxVQUFVO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO1NBQ2pELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQ0FBZ0M7UUFDOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLEVBQUU7WUFDdEUsSUFBSSxFQUFFO2dCQUNKLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQztnQkFDaEUsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU87Z0JBQzdDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7YUFDaEM7WUFDRCxZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFVLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztTQUNqRCxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUM3RSxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ25FLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFVLEVBQUUsQ0FBVSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvSCxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDcEU7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx1QkFBdUI7UUFDckIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLHlCQUF5QixFQUFFLEVBQUU7WUFDMUYsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUYsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztpQkFDNUM7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLEdBQUcsQ0FBQztnQkFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUM7WUFDdkUsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRU0sb0JBQW9CO1FBQ3pCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFO1lBQ25FLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDNUUsS0FBSyxFQUFFLDRCQUE0QjtZQUNuQyxRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsTUFBTTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFVLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztTQUNqRCxDQUFDLENBQUM7UUFFSCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO2FBQ3pGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sbUJBQW1CO1FBQ3hCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFO1lBQ2xFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNqRCxLQUFLLEVBQUUsNEJBQTRCO1lBQ25DLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO1NBQ2pELENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN0SCxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksTUFBTSxFQUFFO2dCQUNWLE1BQU0sa0JBQWtCLEdBQVcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQ3ZGLElBQUksa0JBQWtCLEVBQUU7b0JBQ3RCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ3RGLElBQUksWUFBWSxFQUFFO3dCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLENBQUM7cUJBQzNDO2lCQUNGO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLG1DQUFtQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3ZGLElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLDJCQUEyQjtRQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxRSxLQUFLLEVBQUUsNEJBQTRCO1lBQ25DLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO1NBQ2pELENBQUMsQ0FBQztRQUNILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksTUFBTSxFQUFFO2dCQUNWLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLDBCQUEwQixFQUFFLENBQUM7Z0JBQ25GLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQywwQkFBMEIsRUFBRSxDQUFDO2dCQUNqRixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQzthQUNqRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLDJCQUEyQjtRQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsdUJBQXVCLEVBQUU7WUFDeEQsS0FBSyxFQUFFLDRCQUE0QjtZQUNuQyxRQUFRLEVBQUUsTUFBTTtZQUNoQixRQUFRLEVBQUUsTUFBTTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFVLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztTQUNqRCxDQUFDLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUMzSSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3pDLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsRUFBRSxFQUFFO2dCQUMxRSxJQUFJLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUM7YUFDeEM7aUJBQU0sSUFBSSxNQUFNLEVBQUU7Z0JBQ2pCLE1BQU0seUJBQXlCLEdBQVcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLDRCQUE0QixFQUFFLENBQUM7Z0JBQ3JHLElBQUkseUJBQXlCLEVBQUU7b0JBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMseUJBQXlCLENBQUMsQ0FBQztpQkFDMUQ7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBalpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsNHRFQUE0QztnQkFFNUMsTUFBTSxFQUFFLDJCQUEyQjtnQkFDbkMsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixzQkFBc0IsRUFBRSxNQUFNO2lCQUMvQjtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztZQTdEQyxRQUFRO1lBTUQsU0FBUztZQVhoQixpQkFBaUI7WUEwQlYsZUFBZSx1QkF1Rm5CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDOzs7c0JBM0IxQyxTQUFTLFNBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtzQ0FFbEMsU0FBUyxTQUFDLHlCQUF5QixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtpQ0FFdEQsU0FBUyxTQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs0Q0FFakQsU0FBUyxTQUFDLCtCQUErQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTsrQkFFNUQsU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3NDQUVqRSxTQUFTLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7eUJBR3hFLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQUV6QyxTQUFTLFNBQUMsbUJBQW1CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2lDQUVoRCxTQUFTLFNBQUMsb0JBQW9CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQWhDbEQ7SUFEQyxjQUFjLEVBQUU7OzhEQUNrQjtBQUVuQztJQURDLGNBQWMsRUFBRTs7eURBQ1k7QUFFN0I7SUFEQyxjQUFjLEVBQUU7O29FQUN1QjtBQUV4QztJQURDLGNBQWMsRUFBRTs7NkRBQ2dCO0FBRWpDO0lBREMsY0FBYyxFQUFFOztvRUFDdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdE1lbnUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RhYmxlTWVudSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1tZW51LmludGVyZmFjZSc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPVGFibGVNZW51UGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXRhYmxlLW1lbnUtcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPVGFibGVDZWxsUmVuZGVyZXJJbWFnZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2ltYWdlL28tdGFibGUtY2VsbC1yZW5kZXJlci1pbWFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbHVtbiB9IGZyb20gJy4uLy4uLy4uL2NvbHVtbi9vLWNvbHVtbi5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVBcHBseUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvYXBwbHktY29uZmlndXJhdGlvbi9vLXRhYmxlLWFwcGx5LWNvbmZpZ3VyYXRpb24tZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVFeHBvcnREaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvZXhwb3J0L28tdGFibGUtZXhwb3J0LWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlTG9hZEZpbHRlckRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uLy4uL2RpYWxvZy9sb2FkLWZpbHRlci9vLXRhYmxlLWxvYWQtZmlsdGVyLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlU3RvcmVDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL3N0b3JlLWNvbmZpZ3VyYXRpb24vby10YWJsZS1zdG9yZS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlU3RvcmVGaWx0ZXJEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvc3RvcmUtZmlsdGVyL28tdGFibGUtc3RvcmUtZmlsdGVyLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlVmlzaWJsZUNvbHVtbnNEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvdmlzaWJsZS1jb2x1bW5zL28tdGFibGUtdmlzaWJsZS1jb2x1bW5zLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vdGFibGUtb3B0aW9uL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVFeHBvcnRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9vLXRhYmxlLWV4cG9ydC1jb25maWd1cmF0aW9uLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfTUVOVSA9IFtcbiAgLy8gc2VsZWN0LWFsbC1jaGVja2JveCBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHNlbGVjdGlvbiBjaGVjayBib3hlcy4gRGVmYXVsdDogbm8uXG4gICdzZWxlY3RBbGxDaGVja2JveDogc2VsZWN0LWFsbC1jaGVja2JveCcsXG5cbiAgLy8gZXhwb3J0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBleHBvcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdleHBvcnRCdXR0b246IGV4cG9ydC1idXR0b24nLFxuXG4gIC8vIGNvbHVtbnMtdmlzaWJpbGl0eS1idXR0b24gW25vfHllc106IHNob3cgY29sdW1ucyB2aXNpYmlsaXR5IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnY29sdW1uc1Zpc2liaWxpdHlCdXR0b246IGNvbHVtbnMtdmlzaWJpbGl0eS1idXR0b24nLFxuXG4gIC8vIHNob3ctY29uZmlndXJhdGlvbi1vcHRpb24gW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBjb25maWd1cmF0aW9uIGJ1dHRvbiBpbiBoZWFkZXIuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dDb25maWd1cmF0aW9uT3B0aW9uOiBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uJyxcblxuICAvLyBzaG93LWZpbHRlci1vcHRpb24gW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBmaWx0ZXIgbWVudSBvcHRpb24gaW4gdGhlIGhlYWRlciBtZW51XG4gICdzaG93RmlsdGVyT3B0aW9uOiBzaG93LWZpbHRlci1vcHRpb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfTUVOVSA9IFtdO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1tZW51LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1tZW51LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9NRU5VLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9NRU5VLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLW1lbnVdJzogJ3RydWUnXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZU1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPVGFibGVNZW51LCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgLyogSW5wdXRzICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNlbGVjdEFsbENoZWNrYm94OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGV4cG9ydEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dDb25maWd1cmF0aW9uT3B0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0ZpbHRlck9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgLyogRW5kIG9mIGlucHV0cyAqL1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcblxuICBAVmlld0NoaWxkKCdtZW51JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgbWF0TWVudTogTWF0TWVudTtcbiAgQFZpZXdDaGlsZCgnc2VsZWN0QWxsQ2hlY2tib3hPcHRpb24nLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgc2VsZWN0QWxsQ2hlY2tib3hPcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZXhwb3J0QnV0dG9uT3B0aW9uJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGV4cG9ydEJ1dHRvbk9wdGlvbjogT1RhYmxlT3B0aW9uQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbk9wdGlvbicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbk9wdGlvbjogT1RhYmxlT3B0aW9uQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdmaWx0ZXJNZW51QnV0dG9uJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIGZpbHRlck1lbnVCdXR0b246IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbmZpZ3VyYXRpb25NZW51QnV0dG9uJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIGNvbmZpZ3VyYXRpb25NZW51QnV0dG9uOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlck1lbnUnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgZmlsdGVyTWVudTogTWF0TWVudTtcbiAgQFZpZXdDaGlsZCgnY29uZmlndXJhdGlvbk1lbnUnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgY29uZmlndXJhdGlvbk1lbnU6IE1hdE1lbnU7XG4gIEBWaWV3Q2hpbGQoJ2NvbHVtbkZpbHRlck9wdGlvbicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBjb2x1bW5GaWx0ZXJPcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnM6IE9UYWJsZU1lbnVQZXJtaXNzaW9ucztcbiAgcHJvdGVjdGVkIG11dGF0aW9uT2JzZXJ2ZXJzOiBNdXRhdGlvbk9ic2VydmVyW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBkaWFsb2c6IE1hdERpYWxvZyxcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwcm90ZWN0ZWQgdGFibGU6IE9UYWJsZUNvbXBvbmVudFxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChTbmFja0JhclNlcnZpY2UpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMudGFibGUuZ2V0TWVudVBlcm1pc3Npb25zKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuY29sdW1uRmlsdGVyT3B0aW9uKSB7XG4gICAgICB0aGlzLmNvbHVtbkZpbHRlck9wdGlvbi5zZXRBY3RpdmUodGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uKTtcbiAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wZXJtaXNzaW9ucy5pdGVtcyB8fCB0aGlzLnBlcm1pc3Npb25zLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZWxlY3RBbGxDaGVja2JveE9wdGlvbiAmJiAhdGhpcy5lbmFibGVkU2VsZWN0QWxsQ2hlY2tib3gpIHtcbiAgICAgIHRoaXMuZGlzYWJsZU9UYWJsZU9wdGlvbkNvbXBvbmVudCh0aGlzLnNlbGVjdEFsbENoZWNrYm94T3B0aW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZXhwb3J0QnV0dG9uT3B0aW9uICYmICF0aGlzLmVuYWJsZWRFeHBvcnRCdXR0b24pIHtcbiAgICAgIHRoaXMuZGlzYWJsZU9UYWJsZU9wdGlvbkNvbXBvbmVudCh0aGlzLmV4cG9ydEJ1dHRvbk9wdGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uT3B0aW9uICYmICF0aGlzLmVuYWJsZWRDb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbikge1xuICAgICAgdGhpcy5kaXNhYmxlT1RhYmxlT3B0aW9uQ29tcG9uZW50KHRoaXMuY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5maWx0ZXJNZW51QnV0dG9uICYmICF0aGlzLmVuYWJsZWRGaWx0ZXJNZW51KSB7XG4gICAgICB0aGlzLmRpc2FibGVCdXR0b24odGhpcy5maWx0ZXJNZW51QnV0dG9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29uZmlndXJhdGlvbk1lbnVCdXR0b24gJiYgIXRoaXMuZW5hYmxlZENvbmZpZ3VyYXRpb25NZW51KSB7XG4gICAgICB0aGlzLmRpc2FibGVCdXR0b24odGhpcy5jb25maWd1cmF0aW9uTWVudUJ1dHRvbik7XG4gICAgfVxuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRpc2FibGVPVGFibGVPcHRpb25Db21wb25lbnQoY29tcDogT1RhYmxlT3B0aW9uQ29tcG9uZW50KSB7XG4gICAgY29tcC5lbmFibGVkID0gZmFsc2U7XG4gICAgY29uc3QgYnV0dG9uRUwgPSBjb21wLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgY29uc3Qgb2JzID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGJ1dHRvbkVMKTtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLnB1c2gob2JzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkaXNhYmxlQnV0dG9uKGJ1dHRvbkVMOiBFbGVtZW50UmVmKSB7XG4gICAgYnV0dG9uRUwubmF0aXZlRWxlbWVudC5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29uc3Qgb2JzID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGJ1dHRvbkVMLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMubXV0YXRpb25PYnNlcnZlcnMpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMuZm9yRWFjaCgobTogTXV0YXRpb25PYnNlcnZlcikgPT4ge1xuICAgICAgICBtLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyT3B0aW9ucyhvVGFibGVPcHRpb25zOiBPVGFibGVPcHRpb25Db21wb25lbnRbXSkge1xuICAgIGNvbnN0IGl0ZW1zOiBPUGVybWlzc2lvbnNbXSA9IHRoaXMucGVybWlzc2lvbnMuaXRlbXMgfHwgW107XG4gICAgY29uc3QgZml4ZWRPcHRpb25zID0gWydzZWxlY3QtYWxsLWNoZWNrYm94JywgJ2V4cG9ydCcsICdzaG93LWhpZGUtY29sdW1ucycsICdmaWx0ZXInLCAnY29uZmlndXJhdGlvbiddO1xuICAgIGNvbnN0IHVzZXJJdGVtczogT1Blcm1pc3Npb25zW10gPSBpdGVtcy5maWx0ZXIoKHBlcm06IE9QZXJtaXNzaW9ucykgPT4gZml4ZWRPcHRpb25zLmluZGV4T2YocGVybS5hdHRyKSA9PT0gLTEpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHVzZXJJdGVtcy5mb3JFYWNoKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IG9UYWJsZU9wdGlvbnMuZmluZCgob1RhYmxlT3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQpID0+IG9UYWJsZU9wdGlvbi5vYXR0ciA9PT0gcGVybS5hdHRyKTtcbiAgICAgIHNlbGYuc2V0UGVybWlzc2lvbnNUb09UYWJsZU9wdGlvbihwZXJtLCBvcHRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFBlcm1pc3Npb25zVG9PVGFibGVPcHRpb24ocGVybTogT1Blcm1pc3Npb25zLCBvcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudCkge1xuICAgIGlmIChwZXJtLnZpc2libGUgPT09IGZhbHNlICYmIG9wdGlvbikge1xuICAgICAgb3B0aW9uLmVsUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfSBlbHNlIGlmIChwZXJtLmVuYWJsZWQgPT09IGZhbHNlICYmIG9wdGlvbikge1xuICAgICAgb3B0aW9uLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IGJ1dHRvbkVMID0gb3B0aW9uLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICBjb25zdCBvYnMgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20oYnV0dG9uRUwpO1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9icyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGVybWlzc2lvbkJ5QXR0cihhdHRyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpdGVtczogT1Blcm1pc3Npb25zW10gPSB0aGlzLnBlcm1pc3Npb25zLml0ZW1zIHx8IFtdO1xuICAgIHJldHVybiBpdGVtcy5maW5kKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IHBlcm0uYXR0ciA9PT0gYXR0cik7XG4gIH1cblxuICBnZXQgaXNTZWxlY3RBbGxPcHRpb25BY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZTtcbiAgfVxuXG4gIGdldCBzaG93Q29sdW1uc0ZpbHRlck9wdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZS5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50ICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXQgZW5hYmxlZENvbHVtbnNGaWx0ZXJPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IHNob3dTZWxlY3RBbGxDaGVja2JveCgpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuc2VsZWN0QWxsQ2hlY2tib3gpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdzZWxlY3QtYWxsLWNoZWNrYm94Jyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlck9wdGlvbiAmJiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgcm93SGVpZ2h0T2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLnJvd0hlaWdodE9ic2VydmFibGU7XG4gIH1cbiAgZ2V0IGVuYWJsZWRTZWxlY3RBbGxDaGVja2JveCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ3NlbGVjdC1hbGwtY2hlY2tib3gnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dFeHBvcnRCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmV4cG9ydEJ1dHRvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2V4cG9ydCcpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZEV4cG9ydEJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2V4cG9ydCcpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd0NvbHVtbnNWaXNpYmlsaXR5QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5jb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ3Nob3ctaGlkZS1jb2x1bW5zJyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBlbmFibGVkQ29sdW1uc1Zpc2liaWxpdHlCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdzaG93LWhpZGUtY29sdW1ucycpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd0ZpbHRlck1lbnUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdmaWx0ZXInKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RmlsdGVyT3B0aW9uICYmICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBlbmFibGVkRmlsdGVyTWVudSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2ZpbHRlcicpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd0NvbmZpZ3VyYXRpb25NZW51KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignY29uZmlndXJhdGlvbicpO1xuICAgIHJldHVybiB0aGlzLnNob3dDb25maWd1cmF0aW9uT3B0aW9uICYmICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBlbmFibGVkQ29uZmlndXJhdGlvbk1lbnUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdjb25maWd1cmF0aW9uJyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIG9uU2hvd3NTZWxlY3RzKCkge1xuICAgIGNvbnN0IHRhYmxlT3B0aW9ucyA9IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucztcbiAgICB0YWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSAhdGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlO1xuICAgIHRoaXMudGFibGUuaW5pdGlhbGl6ZUNoZWNrYm94Q29sdW1uKCk7XG4gIH1cblxuICBvbkV4cG9ydEJ1dHRvbkNsaWNrZWQoKSB7XG4gICAgY29uc3QgdGFibGVPcHRpb25zID0gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zO1xuICAgIGNvbnN0IGV4cG9ydENuZmc6IE9UYWJsZUV4cG9ydENvbmZpZ3VyYXRpb24gPSBuZXcgT1RhYmxlRXhwb3J0Q29uZmlndXJhdGlvbigpO1xuXG4gICAgLy8gZ2V0IGNvbHVtbidzIGF0dHIgd2hvc2UgcmVuZGVyZXIgaXMgT1RhYmxlQ2VsbFJlbmRlcmVySW1hZ2VDb21wb25lbnRcbiAgICBjb25zdCBjb2xzTm90SW5jbHVkZWQ6IHN0cmluZ1tdID0gdGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKGMgPT4gdm9pZCAwICE9PSBjLnJlbmRlcmVyICYmIGMucmVuZGVyZXIgaW5zdGFuY2VvZiBPVGFibGVDZWxsUmVuZGVyZXJJbWFnZUNvbXBvbmVudCkubWFwKGMgPT4gYy5hdHRyKTtcbiAgICBjb2xzTm90SW5jbHVkZWQucHVzaChDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpO1xuXG4gICAgLy8gVGFibGUgZGF0YS9maWx0ZXJzXG4gICAgc3dpdGNoICh0aGlzLnRhYmxlLmV4cG9ydE1vZGUpIHtcbiAgICAgIGNhc2UgQ29kZXMuRVhQT1JUX01PREVfQUxMOlxuICAgICAgICBleHBvcnRDbmZnLmZpbHRlciA9IHRoaXMudGFibGUuZ2V0Q29tcG9uZW50RmlsdGVyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5FWFBPUlRfTU9ERV9MT0NBTDpcbiAgICAgICAgZXhwb3J0Q25mZy5kYXRhID0gdGhpcy50YWJsZS5nZXRBbGxSZW5kZXJlZFZhbHVlcygpO1xuICAgICAgICBjb2xzTm90SW5jbHVkZWQuZm9yRWFjaChhdHRyID0+IGV4cG9ydENuZmcuZGF0YS5mb3JFYWNoKHJvdyA9PiBkZWxldGUgcm93W2F0dHJdKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZXhwb3J0Q25mZy5kYXRhID0gdGhpcy50YWJsZS5nZXRSZW5kZXJlZFZhbHVlKCk7XG4gICAgICAgIGNvbHNOb3RJbmNsdWRlZC5mb3JFYWNoKGF0dHIgPT4gZXhwb3J0Q25mZy5kYXRhLmZvckVhY2gocm93ID0+IGRlbGV0ZSByb3dbYXR0cl0pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGV4cG9ydENuZmcubW9kZSA9IHRoaXMudGFibGUuZXhwb3J0TW9kZTtcbiAgICBleHBvcnRDbmZnLmVudGl0eSA9IHRoaXMudGFibGUuZW50aXR5O1xuXG4gICAgLy8gVGFibGUgY29sdW1uc1xuICAgIGV4cG9ydENuZmcuY29sdW1ucyA9IHRhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5maWx0ZXIoYyA9PiBjb2xzTm90SW5jbHVkZWQuaW5kZXhPZihjKSA9PT0gLTEpO1xuICAgIC8vIFRhYmxlIGNvbHVtbiBuYW1lc1xuICAgIGNvbnN0IHRhYmxlQ29sdW1uTmFtZXMgPSB7fTtcbiAgICB0YWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuZmlsdGVyKGMgPT4gY29sc05vdEluY2x1ZGVkLmluZGV4T2YoYykgPT09IC0xKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgY29uc3Qgb0NvbHVtbiA9IHRhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbmQob2MgPT4gb2MuYXR0ciA9PT0gYyk7XG4gICAgICB0YWJsZUNvbHVtbk5hbWVzW2NdID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChvQ29sdW1uLnRpdGxlID8gb0NvbHVtbi50aXRsZSA6IG9Db2x1bW4uYXR0cik7XG4gICAgfSk7XG4gICAgZXhwb3J0Q25mZy5jb2x1bW5OYW1lcyA9IHRhYmxlQ29sdW1uTmFtZXM7XG4gICAgLy8gVGFibGUgY29sdW1uIHNxbFR5cGVzXG4gICAgZXhwb3J0Q25mZy5zcWxUeXBlcyA9IHRoaXMudGFibGUuZ2V0U3FsVHlwZXMoKTtcbiAgICAvLyBUYWJsZSBzZXJ2aWNlLCBuZWVkZWQgZm9yIGNvbmZpZ3VyaW5nIG9udGltaXplIGV4cG9ydCBzZXJ2aWNlIHdpdGggdGFibGUgc2VydmljZSBjb25maWd1cmF0aW9uXG4gICAgZXhwb3J0Q25mZy5zZXJ2aWNlID0gdGhpcy50YWJsZS5zZXJ2aWNlO1xuICAgIGV4cG9ydENuZmcuc2VydmljZVR5cGUgPSB0aGlzLnRhYmxlLmV4cG9ydFNlcnZpY2VUeXBlO1xuICAgIGV4cG9ydENuZmcudmlzaWJsZUJ1dHRvbnMgPSB0aGlzLnRhYmxlLnZpc2libGVFeHBvcnREaWFsb2dCdXR0b25zO1xuICAgIGV4cG9ydENuZmcub3B0aW9ucyA9IHRoaXMudGFibGUuZXhwb3J0T3B0c1RlbXBsYXRlO1xuXG4gICAgdGhpcy5kaWFsb2cub3BlbihPVGFibGVFeHBvcnREaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IGV4cG9ydENuZmcsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2hhbmdlQ29sdW1uc1Zpc2liaWxpdHlDbGlja2VkKCkge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlVmlzaWJsZUNvbHVtbnNEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmlzaWJsZUNvbHVtbnM6IFV0aWwucGFyc2VBcnJheSh0aGlzLnRhYmxlLnZpc2libGVDb2x1bW5zLCB0cnVlKSxcbiAgICAgICAgY29sdW1uc0RhdGE6IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5jb2x1bW5zLFxuICAgICAgICByb3dIZWlnaHQ6IHRoaXMudGFibGUucm93SGVpZ2h0XG4gICAgICB9LFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG5cbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy50YWJsZS52aXNpYmxlQ29sQXJyYXkgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0VmlzaWJsZUNvbHVtbnMoKTtcbiAgICAgICAgY29uc3QgY29sdW1uc09yZGVyID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldENvbHVtbnNPcmRlcigpO1xuICAgICAgICB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucy5zb3J0KChhOiBPQ29sdW1uLCBiOiBPQ29sdW1uKSA9PiBjb2x1bW5zT3JkZXIuaW5kZXhPZihhLmF0dHIpIC0gY29sdW1uc09yZGVyLmluZGV4T2YoYi5hdHRyKSk7XG4gICAgICAgIHRoaXMudGFibGUucmVmcmVzaENvbHVtbnNXaWR0aCgpO1xuICAgICAgICB0aGlzLnRhYmxlLm9uVmlzaWJsZUNvbHVtbnNDaGFuZ2UuZW1pdCh0aGlzLnRhYmxlLnZpc2libGVDb2xBcnJheSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbkZpbHRlckJ5Q29sdW1uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uICYmIHRoaXMudGFibGUuZGF0YVNvdXJjZS5pc0NvbHVtblZhbHVlRmlsdGVyQWN0aXZlKCkpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuQ09ORklSTV9ESVNDQVJEX0ZJTFRFUl9CWV9DT0xVTU4nKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICBzZWxmLnRhYmxlLmRhdGFTb3VyY2UuY2xlYXJDb2x1bW5GaWx0ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gIXJlcztcbiAgICAgICAgc2VsZi50YWJsZS5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gIXRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbjtcbiAgICAgIHRoaXMudGFibGUuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblN0b3JlRmlsdGVyQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZVN0b3JlRmlsdGVyRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkRmlsdGVycygpLm1hcChmaWx0ZXIgPT4gZmlsdGVyLm5hbWUpLFxuICAgICAgd2lkdGg6ICdjYWxjKCg3NWVtIC0gMTAwJSkgKiAxMDAwKScsXG4gICAgICBtYXhXaWR0aDogJzY1dncnLFxuICAgICAgbWluV2lkdGg6ICczMHZ3JyxcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHBhbmVsQ2xhc3M6IFsnby1kaWFsb2ctY2xhc3MnLCAnby10YWJsZS1kaWFsb2cnXVxuICAgIH0pO1xuXG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMudGFibGUub1RhYmxlU3RvcmFnZS5zdG9yZUZpbHRlcihkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0RmlsdGVyQXR0cmlidXRlcygpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvYWRGaWx0ZXJDbGlja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlTG9hZEZpbHRlckRpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZEZpbHRlcnMoKSxcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcblxuICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5vbkRlbGV0ZS5zdWJzY3JpYmUoZmlsdGVyTmFtZSA9PiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZGVsZXRlU3RvcmVkRmlsdGVyKGZpbHRlck5hbWUpKTtcbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRGaWx0ZXJOYW1lOiBzdHJpbmcgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0U2VsZWN0ZWRGaWx0ZXJOYW1lKCk7XG4gICAgICAgIGlmIChzZWxlY3RlZEZpbHRlck5hbWUpIHtcbiAgICAgICAgICBjb25zdCBzdG9yZWRGaWx0ZXIgPSB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkRmlsdGVyQ29uZihzZWxlY3RlZEZpbHRlck5hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZWRGaWx0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2V0RmlsdGVyc0NvbmZpZ3VyYXRpb24oc3RvcmVkRmlsdGVyKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUucmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25DbGVhckZpbHRlckNsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnVEFCTEUuRElBTE9HLkNPTkZJUk1fQ0xFQVJfRklMVEVSJykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnRhYmxlLmNsZWFyRmlsdGVycygpO1xuICAgICAgICB0aGlzLnRhYmxlLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblN0b3JlQ29uZmlndXJhdGlvbkNsaWNrZWQoKTogdm9pZCB7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVTdG9yZUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbkRhdGEgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0Q29uZmlndXJhdGlvbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgY29uc3QgdGFibGVQcm9wZXJ0aWVzID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFNlbGVjdGVkVGFibGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHNlbGYudGFibGUub1RhYmxlU3RvcmFnZS5zdG9yZUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbkRhdGEsIHRhYmxlUHJvcGVydGllcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25BcHBseUNvbmZpZ3VyYXRpb25DbGlja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlQXBwbHlDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29uZmlndXJhdGlvbnMoKSxcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2Uub25EZWxldGUuc3Vic2NyaWJlKGNvbmZpZ3VyYXRpb25OYW1lID0+IHRoaXMudGFibGUub1RhYmxlU3RvcmFnZS5kZWxldGVTdG9yZWRDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25OYW1lKSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0ICYmIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5pc0RlZmF1bHRDb25maWd1cmF0aW9uU2VsZWN0ZWQoKSkge1xuICAgICAgICBzZWxmLnRhYmxlLmFwcGx5RGVmYXVsdENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkQ29uZmlndXJhdGlvbk5hbWU6IHN0cmluZyA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRTZWxlY3RlZENvbmZpZ3VyYXRpb25OYW1lKCk7XG4gICAgICAgIGlmIChzZWxlY3RlZENvbmZpZ3VyYXRpb25OYW1lKSB7XG4gICAgICAgICAgc2VsZi50YWJsZS5hcHBseUNvbmZpZ3VyYXRpb24oc2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=