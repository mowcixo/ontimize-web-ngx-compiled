import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Injector, ViewChild, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialog, MatMenu } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
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
        this.onVisibleFilterOptionChange = new EventEmitter();
        this.showColumnsFilterOptionSubject = new BehaviorSubject(false);
        this.showColumnsFilterOption = this.showColumnsFilterOptionSubject.asObservable();
        this.mutationObservers = [];
        this.dialogService = this.injector.get(DialogService);
        this.translateService = this.injector.get(OTranslateService);
        this.snackBarService = this.injector.get(SnackBarService);
        const self = this;
        this.subscription = this.onVisibleFilterOptionChange.subscribe((x) => self.showColumnsFilterOptionSubject.next(x));
    }
    ngOnInit() {
        this.permissions = this.table.getMenuPermissions();
    }
    get isColumnFilterOptionActive() {
        return this.table && this.table.showFilterByColumnIcon;
    }
    ngAfterViewInit() {
        this.showColumnsFilterOptionSubject.next(this.table.oTableColumnsFilterComponent !== undefined);
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
        this.subscription.unsubscribe();
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
                this.table.cd.detectChanges();
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
                    self.table.clearColumnFilters();
                }
                self.table.showFilterByColumnIcon = !res;
            });
        }
        else {
            this.table.showFilterByColumnIcon = !this.table.showFilterByColumnIcon;
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
                template: "<mat-menu #menu=\"matMenu\" x-position=\"before\" [class]=\"(rowHeightObservable | async) +' o-table-menu'\">\n  <o-table-option #selectAllCheckboxOption *ngIf=\"showSelectAllCheckbox\" [active]=\"isSelectAllOptionActive\"\n    (onClick)=\"onShowsSelects()\" label=\"TABLE.BUTTONS.SELECT\" show-active-icon=\"true\"></o-table-option>\n  <o-table-option #exportButtonOption *ngIf=\"showExportButton\" (onClick)=\"onExportButtonClicked()\"\n    label=\"TABLE.BUTTONS.EXPORT\"></o-table-option>\n  <o-table-option #columnsVisibilityButtonOption *ngIf=\"showColumnsVisibilityButton\"\n    (onClick)=\"onChangeColumnsVisibilityClicked()\" label=\"TABLE.BUTTONS.COLVIS\"></o-table-option>\n\n  <button type=\"button\" #filterMenuButton *ngIf=\"showFilterMenu\" mat-menu-item [matMenuTriggerFor]=\"filterMenu\">{{\n    'TABLE.BUTTONS.FILTER' | oTranslate }}</button>\n  <button type=\"button\" #configurationMenuButton *ngIf=\"showConfigurationMenu\" mat-menu-item\n    [matMenuTriggerFor]=\"configurationMenu\">{{\n    'TABLE.BUTTONS.CONFIGURATION' | oTranslate }}</button>\n  <ng-content></ng-content>\n</mat-menu>\n\n<mat-menu #filterMenu=\"matMenu\" [class]=\"(rowHeightObservable| async) +' o-table-menu'\">\n  <o-table-option #columnFilterOption *ngIf=\"showColumnsFilterOption | async\" show-active-icon=\"true\" [active]=\"isColumnFilterOptionActive\"\n    (onClick)=\"onFilterByColumnClicked()\" label=\"TABLE.BUTTONS.FILTER_BY_COLUMN\">\n  </o-table-option>\n  <button type=\"button\" mat-menu-item\n    (click)=\"onStoreFilterClicked()\">{{ 'TABLE.BUTTONS.FILTER_SAVE' | oTranslate }}</button>\n  <button type=\"button\" mat-menu-item\n    (click)=\"onLoadFilterClicked()\">{{ 'TABLE.BUTTONS.FILTER_LOAD' | oTranslate }}</button>\n  <button type=\"button\" mat-menu-item\n    (click)=\"onClearFilterClicked()\">{{ 'TABLE.BUTTONS.FILTER_CLEAR' | oTranslate }}</button>\n</mat-menu>\n\n<mat-menu #configurationMenu=\"matMenu\" [class]=\"(rowHeightObservable | async) +' o-table-menu'\">\n  <button type=\"button\" mat-menu-item (click)=\"onStoreConfigurationClicked()\">{{ 'TABLE.BUTTONS.SAVE_CONFIGURATION' |\n    oTranslate }}</button>\n  <button type=\"button\" mat-menu-item (click)=\"onApplyConfigurationClicked()\">{{ 'TABLE.BUTTONS.APPLY_CONFIGURATION' |\n    oTranslate }}</button>\n</mat-menu>",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1tZW51L28tdGFibGUtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBR1IsU0FBUyxFQUNULGlCQUFpQixFQUNqQixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN2RCxPQUFPLEVBQWMsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVqRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUcxRixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLDJFQUEyRSxDQUFDO0FBRTdILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUNBQXVDLEVBQUUsTUFBTSwrRUFBK0UsQ0FBQztBQUN4SSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUs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LEVBQUUsS0FBSyxFQUFFO3NDQUVqRSxTQUFTLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7eUJBR3hFLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQUV6QyxTQUFTLFNBQUMsbUJBQW1CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2lDQUVoRCxTQUFTLFNBQUMsb0JBQW9CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQWxDbEQ7SUFEQyxjQUFjLEVBQUU7OzhEQUNrQjtBQUVuQztJQURDLGNBQWMsRUFBRTs7eURBQ1k7QUFFN0I7SUFEQyxjQUFjLEVBQUU7O29FQUN1QjtBQUV4QztJQURDLGNBQWMsRUFBRTs7NkRBQ2dCO0FBRWpDO0lBREMsY0FBYyxFQUFFOztvRUFDdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdERpYWxvZywgTWF0TWVudSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IE9ic2VydmFibGUsIEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RhYmxlTWVudSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1tZW51LmludGVyZmFjZSc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPVGFibGVNZW51UGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXRhYmxlLW1lbnUtcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPVGFibGVDZWxsUmVuZGVyZXJJbWFnZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2NvbHVtbi9jZWxsLXJlbmRlcmVyL2ltYWdlL28tdGFibGUtY2VsbC1yZW5kZXJlci1pbWFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbHVtbiB9IGZyb20gJy4uLy4uLy4uL2NvbHVtbi9vLWNvbHVtbi5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVBcHBseUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvYXBwbHktY29uZmlndXJhdGlvbi9vLXRhYmxlLWFwcGx5LWNvbmZpZ3VyYXRpb24tZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVFeHBvcnREaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvZXhwb3J0L28tdGFibGUtZXhwb3J0LWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlTG9hZEZpbHRlckRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uLy4uL2RpYWxvZy9sb2FkLWZpbHRlci9vLXRhYmxlLWxvYWQtZmlsdGVyLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlU3RvcmVDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL3N0b3JlLWNvbmZpZ3VyYXRpb24vby10YWJsZS1zdG9yZS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlU3RvcmVGaWx0ZXJEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvc3RvcmUtZmlsdGVyL28tdGFibGUtc3RvcmUtZmlsdGVyLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlVmlzaWJsZUNvbHVtbnNEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvdmlzaWJsZS1jb2x1bW5zL28tdGFibGUtdmlzaWJsZS1jb2x1bW5zLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi4vdGFibGUtb3B0aW9uL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVFeHBvcnRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9vLXRhYmxlLWV4cG9ydC1jb25maWd1cmF0aW9uLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfTUVOVSA9IFtcbiAgLy8gc2VsZWN0LWFsbC1jaGVja2JveCBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHNlbGVjdGlvbiBjaGVjayBib3hlcy4gRGVmYXVsdDogbm8uXG4gICdzZWxlY3RBbGxDaGVja2JveDogc2VsZWN0LWFsbC1jaGVja2JveCcsXG5cbiAgLy8gZXhwb3J0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBleHBvcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdleHBvcnRCdXR0b246IGV4cG9ydC1idXR0b24nLFxuXG4gIC8vIGNvbHVtbnMtdmlzaWJpbGl0eS1idXR0b24gW25vfHllc106IHNob3cgY29sdW1ucyB2aXNpYmlsaXR5IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnY29sdW1uc1Zpc2liaWxpdHlCdXR0b246IGNvbHVtbnMtdmlzaWJpbGl0eS1idXR0b24nLFxuXG4gIC8vIHNob3ctY29uZmlndXJhdGlvbi1vcHRpb24gW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBjb25maWd1cmF0aW9uIGJ1dHRvbiBpbiBoZWFkZXIuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dDb25maWd1cmF0aW9uT3B0aW9uOiBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uJyxcblxuICAvLyBzaG93LWZpbHRlci1vcHRpb24gW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBmaWx0ZXIgbWVudSBvcHRpb24gaW4gdGhlIGhlYWRlciBtZW51XG4gICdzaG93RmlsdGVyT3B0aW9uOiBzaG93LWZpbHRlci1vcHRpb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfTUVOVSA9IFtdO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1tZW51LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1tZW51LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9NRU5VLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9NRU5VLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLW1lbnVdJzogJ3RydWUnXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZU1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPVGFibGVNZW51LCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgLyogSW5wdXRzICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNlbGVjdEFsbENoZWNrYm94OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGV4cG9ydEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dDb25maWd1cmF0aW9uT3B0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0ZpbHRlck9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgb25WaXNpYmxlRmlsdGVyT3B0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyogRW5kIG9mIGlucHV0cyAqL1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcblxuICBAVmlld0NoaWxkKCdtZW51JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgbWF0TWVudTogTWF0TWVudTtcbiAgQFZpZXdDaGlsZCgnc2VsZWN0QWxsQ2hlY2tib3hPcHRpb24nLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgc2VsZWN0QWxsQ2hlY2tib3hPcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZXhwb3J0QnV0dG9uT3B0aW9uJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGV4cG9ydEJ1dHRvbk9wdGlvbjogT1RhYmxlT3B0aW9uQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbk9wdGlvbicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbk9wdGlvbjogT1RhYmxlT3B0aW9uQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKCdmaWx0ZXJNZW51QnV0dG9uJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIGZpbHRlck1lbnVCdXR0b246IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbmZpZ3VyYXRpb25NZW51QnV0dG9uJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIGNvbmZpZ3VyYXRpb25NZW51QnV0dG9uOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlck1lbnUnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgZmlsdGVyTWVudTogTWF0TWVudTtcbiAgQFZpZXdDaGlsZCgnY29uZmlndXJhdGlvbk1lbnUnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgY29uZmlndXJhdGlvbk1lbnU6IE1hdE1lbnU7XG4gIEBWaWV3Q2hpbGQoJ2NvbHVtbkZpbHRlck9wdGlvbicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBjb2x1bW5GaWx0ZXJPcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcblxuICBwcml2YXRlIHNob3dDb2x1bW5zRmlsdGVyT3B0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwdWJsaWMgc2hvd0NvbHVtbnNGaWx0ZXJPcHRpb246IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLnNob3dDb2x1bW5zRmlsdGVyT3B0aW9uU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnM6IE9UYWJsZU1lbnVQZXJtaXNzaW9ucztcbiAgcHJvdGVjdGVkIG11dGF0aW9uT2JzZXJ2ZXJzOiBNdXRhdGlvbk9ic2VydmVyW10gPSBbXTtcblxuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGRpYWxvZzogTWF0RGlhbG9nLFxuICAgIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHByb3RlY3RlZCB0YWJsZTogT1RhYmxlQ29tcG9uZW50XG4gICkge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMub25WaXNpYmxlRmlsdGVyT3B0aW9uQ2hhbmdlLnN1YnNjcmliZSgoeDogYm9vbGVhbikgPT4gc2VsZi5zaG93Q29sdW1uc0ZpbHRlck9wdGlvblN1YmplY3QubmV4dCh4KSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy50YWJsZS5nZXRNZW51UGVybWlzc2lvbnMoKTtcbiAgfVxuXG4gIGdldCBpc0NvbHVtbkZpbHRlck9wdGlvbkFjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZSAmJiB0aGlzLnRhYmxlLnNob3dGaWx0ZXJCeUNvbHVtbkljb247XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG5cbiAgICB0aGlzLnNob3dDb2x1bW5zRmlsdGVyT3B0aW9uU3ViamVjdC5uZXh0KHRoaXMudGFibGUub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKTtcblxuXG4gICAgaWYgKCF0aGlzLnBlcm1pc3Npb25zLml0ZW1zIHx8IHRoaXMucGVybWlzc2lvbnMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdEFsbENoZWNrYm94T3B0aW9uICYmICF0aGlzLmVuYWJsZWRTZWxlY3RBbGxDaGVja2JveCkge1xuICAgICAgdGhpcy5kaXNhYmxlT1RhYmxlT3B0aW9uQ29tcG9uZW50KHRoaXMuc2VsZWN0QWxsQ2hlY2tib3hPcHRpb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5leHBvcnRCdXR0b25PcHRpb24gJiYgIXRoaXMuZW5hYmxlZEV4cG9ydEJ1dHRvbikge1xuICAgICAgdGhpcy5kaXNhYmxlT1RhYmxlT3B0aW9uQ29tcG9uZW50KHRoaXMuZXhwb3J0QnV0dG9uT3B0aW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb24gJiYgIXRoaXMuZW5hYmxlZENvbHVtbnNWaXNpYmlsaXR5QnV0dG9uKSB7XG4gICAgICB0aGlzLmRpc2FibGVPVGFibGVPcHRpb25Db21wb25lbnQodGhpcy5jb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbk9wdGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLmZpbHRlck1lbnVCdXR0b24gJiYgIXRoaXMuZW5hYmxlZEZpbHRlck1lbnUpIHtcbiAgICAgIHRoaXMuZGlzYWJsZUJ1dHRvbih0aGlzLmZpbHRlck1lbnVCdXR0b24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb25maWd1cmF0aW9uTWVudUJ1dHRvbiAmJiAhdGhpcy5lbmFibGVkQ29uZmlndXJhdGlvbk1lbnUpIHtcbiAgICAgIHRoaXMuZGlzYWJsZUJ1dHRvbih0aGlzLmNvbmZpZ3VyYXRpb25NZW51QnV0dG9uKTtcbiAgICB9XG5cbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkaXNhYmxlT1RhYmxlT3B0aW9uQ29tcG9uZW50KGNvbXA6IE9UYWJsZU9wdGlvbkNvbXBvbmVudCkge1xuICAgIGNvbXAuZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGJ1dHRvbkVMID0gY29tcC5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgIGNvbnN0IG9icyA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbShidXR0b25FTCk7XG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9icyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGlzYWJsZUJ1dHRvbihidXR0b25FTDogRWxlbWVudFJlZikge1xuICAgIGJ1dHRvbkVMLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbnN0IG9icyA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbShidXR0b25FTC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLnB1c2gob2JzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLmZvckVhY2goKG06IE11dGF0aW9uT2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgbS5kaXNjb25uZWN0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT3B0aW9ucyhvVGFibGVPcHRpb25zOiBPVGFibGVPcHRpb25Db21wb25lbnRbXSkge1xuICAgIGNvbnN0IGl0ZW1zOiBPUGVybWlzc2lvbnNbXSA9IHRoaXMucGVybWlzc2lvbnMuaXRlbXMgfHwgW107XG4gICAgY29uc3QgZml4ZWRPcHRpb25zID0gWydzZWxlY3QtYWxsLWNoZWNrYm94JywgJ2V4cG9ydCcsICdzaG93LWhpZGUtY29sdW1ucycsICdmaWx0ZXInLCAnY29uZmlndXJhdGlvbiddO1xuICAgIGNvbnN0IHVzZXJJdGVtczogT1Blcm1pc3Npb25zW10gPSBpdGVtcy5maWx0ZXIoKHBlcm06IE9QZXJtaXNzaW9ucykgPT4gZml4ZWRPcHRpb25zLmluZGV4T2YocGVybS5hdHRyKSA9PT0gLTEpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHVzZXJJdGVtcy5mb3JFYWNoKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IG9UYWJsZU9wdGlvbnMuZmluZCgob1RhYmxlT3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQpID0+IG9UYWJsZU9wdGlvbi5vYXR0ciA9PT0gcGVybS5hdHRyKTtcbiAgICAgIHNlbGYuc2V0UGVybWlzc2lvbnNUb09UYWJsZU9wdGlvbihwZXJtLCBvcHRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFBlcm1pc3Npb25zVG9PVGFibGVPcHRpb24ocGVybTogT1Blcm1pc3Npb25zLCBvcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudCkge1xuICAgIGlmIChwZXJtLnZpc2libGUgPT09IGZhbHNlICYmIG9wdGlvbikge1xuICAgICAgb3B0aW9uLmVsUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfSBlbHNlIGlmIChwZXJtLmVuYWJsZWQgPT09IGZhbHNlICYmIG9wdGlvbikge1xuICAgICAgb3B0aW9uLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IGJ1dHRvbkVMID0gb3B0aW9uLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICBjb25zdCBvYnMgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20oYnV0dG9uRUwpO1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9icyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGVybWlzc2lvbkJ5QXR0cihhdHRyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBpdGVtczogT1Blcm1pc3Npb25zW10gPSB0aGlzLnBlcm1pc3Npb25zLml0ZW1zIHx8IFtdO1xuICAgIHJldHVybiBpdGVtcy5maW5kKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IHBlcm0uYXR0ciA9PT0gYXR0cik7XG4gIH1cblxuICBnZXQgaXNTZWxlY3RBbGxPcHRpb25BY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZTtcbiAgfVxuXG4gIGdldCBzaG93U2VsZWN0QWxsQ2hlY2tib3goKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdEFsbENoZWNrYm94KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignc2VsZWN0LWFsbC1jaGVja2JveCcpO1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJPcHRpb24gJiYgIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHJvd0hlaWdodE9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy50YWJsZS5yb3dIZWlnaHRPYnNlcnZhYmxlO1xuICB9XG4gIGdldCBlbmFibGVkU2VsZWN0QWxsQ2hlY2tib3goKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdzZWxlY3QtYWxsLWNoZWNrYm94Jyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93RXhwb3J0QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5leHBvcnRCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdleHBvcnQnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWRFeHBvcnRCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdleHBvcnQnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dDb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY29sdW1uc1Zpc2liaWxpdHlCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdzaG93LWhpZGUtY29sdW1ucycpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZENvbHVtbnNWaXNpYmlsaXR5QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignc2hvdy1oaWRlLWNvbHVtbnMnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dGaWx0ZXJNZW51KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZmlsdGVyJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlck9wdGlvbiAmJiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZEZpbHRlck1lbnUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdmaWx0ZXInKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dDb25maWd1cmF0aW9uTWVudSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2NvbmZpZ3VyYXRpb24nKTtcbiAgICByZXR1cm4gdGhpcy5zaG93Q29uZmlndXJhdGlvbk9wdGlvbiAmJiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZENvbmZpZ3VyYXRpb25NZW51KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignY29uZmlndXJhdGlvbicpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBvblNob3dzU2VsZWN0cygpIHtcbiAgICBjb25zdCB0YWJsZU9wdGlvbnMgPSB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnM7XG4gICAgdGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gIXRhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZTtcbiAgICB0aGlzLnRhYmxlLmluaXRpYWxpemVDaGVja2JveENvbHVtbigpO1xuICB9XG5cbiAgb25FeHBvcnRCdXR0b25DbGlja2VkKCkge1xuICAgIGNvbnN0IHRhYmxlT3B0aW9ucyA9IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucztcbiAgICBjb25zdCBleHBvcnRDbmZnOiBPVGFibGVFeHBvcnRDb25maWd1cmF0aW9uID0gbmV3IE9UYWJsZUV4cG9ydENvbmZpZ3VyYXRpb24oKTtcblxuICAgIC8vIGdldCBjb2x1bW4ncyBhdHRyIHdob3NlIHJlbmRlcmVyIGlzIE9UYWJsZUNlbGxSZW5kZXJlckltYWdlQ29tcG9uZW50XG4gICAgY29uc3QgY29sc05vdEluY2x1ZGVkOiBzdHJpbmdbXSA9IHRhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihjID0+IHZvaWQgMCAhPT0gYy5yZW5kZXJlciAmJiBjLnJlbmRlcmVyIGluc3RhbmNlb2YgT1RhYmxlQ2VsbFJlbmRlcmVySW1hZ2VDb21wb25lbnQpLm1hcChjID0+IGMuYXR0cik7XG4gICAgY29sc05vdEluY2x1ZGVkLnB1c2goQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKTtcblxuICAgIC8vIFRhYmxlIGRhdGEvZmlsdGVyc1xuICAgIHN3aXRjaCAodGhpcy50YWJsZS5leHBvcnRNb2RlKSB7XG4gICAgICBjYXNlIENvZGVzLkVYUE9SVF9NT0RFX0FMTDpcbiAgICAgICAgZXhwb3J0Q25mZy5maWx0ZXIgPSB0aGlzLnRhYmxlLmdldENvbXBvbmVudEZpbHRlcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuRVhQT1JUX01PREVfTE9DQUw6XG4gICAgICAgIGV4cG9ydENuZmcuZGF0YSA9IHRoaXMudGFibGUuZ2V0QWxsUmVuZGVyZWRWYWx1ZXMoKTtcbiAgICAgICAgY29sc05vdEluY2x1ZGVkLmZvckVhY2goYXR0ciA9PiBleHBvcnRDbmZnLmRhdGEuZm9yRWFjaChyb3cgPT4gZGVsZXRlIHJvd1thdHRyXSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGV4cG9ydENuZmcuZGF0YSA9IHRoaXMudGFibGUuZ2V0UmVuZGVyZWRWYWx1ZSgpO1xuICAgICAgICBjb2xzTm90SW5jbHVkZWQuZm9yRWFjaChhdHRyID0+IGV4cG9ydENuZmcuZGF0YS5mb3JFYWNoKHJvdyA9PiBkZWxldGUgcm93W2F0dHJdKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBleHBvcnRDbmZnLm1vZGUgPSB0aGlzLnRhYmxlLmV4cG9ydE1vZGU7XG4gICAgZXhwb3J0Q25mZy5lbnRpdHkgPSB0aGlzLnRhYmxlLmVudGl0eTtcblxuICAgIC8vIFRhYmxlIGNvbHVtbnNcbiAgICBleHBvcnRDbmZnLmNvbHVtbnMgPSB0YWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuZmlsdGVyKGMgPT4gY29sc05vdEluY2x1ZGVkLmluZGV4T2YoYykgPT09IC0xKTtcbiAgICAvLyBUYWJsZSBjb2x1bW4gbmFtZXNcbiAgICBjb25zdCB0YWJsZUNvbHVtbk5hbWVzID0ge307XG4gICAgdGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmZpbHRlcihjID0+IGNvbHNOb3RJbmNsdWRlZC5pbmRleE9mKGMpID09PSAtMSkuZm9yRWFjaChjID0+IHtcbiAgICAgIGNvbnN0IG9Db2x1bW4gPSB0YWJsZU9wdGlvbnMuY29sdW1ucy5maW5kKG9jID0+IG9jLmF0dHIgPT09IGMpO1xuICAgICAgdGFibGVDb2x1bW5OYW1lc1tjXSA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQob0NvbHVtbi50aXRsZSA/IG9Db2x1bW4udGl0bGUgOiBvQ29sdW1uLmF0dHIpO1xuICAgIH0pO1xuICAgIGV4cG9ydENuZmcuY29sdW1uTmFtZXMgPSB0YWJsZUNvbHVtbk5hbWVzO1xuICAgIC8vIFRhYmxlIGNvbHVtbiBzcWxUeXBlc1xuICAgIGV4cG9ydENuZmcuc3FsVHlwZXMgPSB0aGlzLnRhYmxlLmdldFNxbFR5cGVzKCk7XG4gICAgLy8gVGFibGUgc2VydmljZSwgbmVlZGVkIGZvciBjb25maWd1cmluZyBvbnRpbWl6ZSBleHBvcnQgc2VydmljZSB3aXRoIHRhYmxlIHNlcnZpY2UgY29uZmlndXJhdGlvblxuICAgIGV4cG9ydENuZmcuc2VydmljZSA9IHRoaXMudGFibGUuc2VydmljZTtcbiAgICBleHBvcnRDbmZnLnNlcnZpY2VUeXBlID0gdGhpcy50YWJsZS5leHBvcnRTZXJ2aWNlVHlwZTtcbiAgICBleHBvcnRDbmZnLnZpc2libGVCdXR0b25zID0gdGhpcy50YWJsZS52aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9ucztcbiAgICBleHBvcnRDbmZnLm9wdGlvbnMgPSB0aGlzLnRhYmxlLmV4cG9ydE9wdHNUZW1wbGF0ZTtcblxuICAgIHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlRXhwb3J0RGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiBleHBvcnRDbmZnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gIH1cblxuICBvbkNoYW5nZUNvbHVtbnNWaXNpYmlsaXR5Q2xpY2tlZCgpIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZVZpc2libGVDb2x1bW5zRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZpc2libGVDb2x1bW5zOiBVdGlsLnBhcnNlQXJyYXkodGhpcy50YWJsZS52aXNpYmxlQ29sdW1ucywgdHJ1ZSksXG4gICAgICAgIGNvbHVtbnNEYXRhOiB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucyxcbiAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnRhYmxlLnJvd0hlaWdodFxuICAgICAgfSxcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHBhbmVsQ2xhc3M6IFsnby1kaWFsb2ctY2xhc3MnLCAnby10YWJsZS1kaWFsb2cnXVxuICAgIH0pO1xuXG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMudGFibGUudmlzaWJsZUNvbEFycmF5ID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFZpc2libGVDb2x1bW5zKCk7XG4gICAgICAgIGNvbnN0IGNvbHVtbnNPcmRlciA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRDb2x1bW5zT3JkZXIoKTtcbiAgICAgICAgdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4gY29sdW1uc09yZGVyLmluZGV4T2YoYS5hdHRyKSAtIGNvbHVtbnNPcmRlci5pbmRleE9mKGIuYXR0cikpO1xuICAgICAgICB0aGlzLnRhYmxlLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdGhpcy50YWJsZS5yZWZyZXNoQ29sdW1uc1dpZHRoKCk7XG4gICAgICAgIHRoaXMudGFibGUub25WaXNpYmxlQ29sdW1uc0NoYW5nZS5lbWl0KHRoaXMudGFibGUudmlzaWJsZUNvbEFycmF5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uRmlsdGVyQnlDb2x1bW5DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLnRhYmxlLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gJiYgdGhpcy50YWJsZS5kYXRhU291cmNlLmlzQ29sdW1uVmFsdWVGaWx0ZXJBY3RpdmUoKSkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0RJU0NBUkRfRklMVEVSX0JZX0NPTFVNTicpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgIHNlbGYudGFibGUuY2xlYXJDb2x1bW5GaWx0ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gIXJlcztcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRhYmxlLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gPSAhdGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblN0b3JlRmlsdGVyQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZVN0b3JlRmlsdGVyRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkRmlsdGVycygpLm1hcChmaWx0ZXIgPT4gZmlsdGVyLm5hbWUpLFxuICAgICAgd2lkdGg6ICdjYWxjKCg3NWVtIC0gMTAwJSkgKiAxMDAwKScsXG4gICAgICBtYXhXaWR0aDogJzY1dncnLFxuICAgICAgbWluV2lkdGg6ICczMHZ3JyxcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHBhbmVsQ2xhc3M6IFsnby1kaWFsb2ctY2xhc3MnLCAnby10YWJsZS1kaWFsb2cnXVxuICAgIH0pO1xuXG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMudGFibGUub1RhYmxlU3RvcmFnZS5zdG9yZUZpbHRlcihkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0RmlsdGVyQXR0cmlidXRlcygpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvYWRGaWx0ZXJDbGlja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlTG9hZEZpbHRlckRpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZEZpbHRlcnMoKSxcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcblxuICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5vbkRlbGV0ZS5zdWJzY3JpYmUoZmlsdGVyTmFtZSA9PiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZGVsZXRlU3RvcmVkRmlsdGVyKGZpbHRlck5hbWUpKTtcbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRGaWx0ZXJOYW1lOiBzdHJpbmcgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0U2VsZWN0ZWRGaWx0ZXJOYW1lKCk7XG4gICAgICAgIGlmIChzZWxlY3RlZEZpbHRlck5hbWUpIHtcbiAgICAgICAgICBjb25zdCBzdG9yZWRGaWx0ZXIgPSB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkRmlsdGVyQ29uZihzZWxlY3RlZEZpbHRlck5hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZWRGaWx0ZXIpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2V0RmlsdGVyc0NvbmZpZ3VyYXRpb24oc3RvcmVkRmlsdGVyKTtcbiAgICAgICAgICAgIHRoaXMudGFibGUucmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25DbGVhckZpbHRlckNsaWNrZWQoKTogdm9pZCB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnVEFCTEUuRElBTE9HLkNPTkZJUk1fQ0xFQVJfRklMVEVSJykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnRhYmxlLmNsZWFyRmlsdGVycygpO1xuICAgICAgICB0aGlzLnRhYmxlLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblN0b3JlQ29uZmlndXJhdGlvbkNsaWNrZWQoKTogdm9pZCB7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVTdG9yZUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbkRhdGEgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0Q29uZmlndXJhdGlvbkF0dHJpYnV0ZXMoKTtcbiAgICAgICAgY29uc3QgdGFibGVQcm9wZXJ0aWVzID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFNlbGVjdGVkVGFibGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHNlbGYudGFibGUub1RhYmxlU3RvcmFnZS5zdG9yZUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbkRhdGEsIHRhYmxlUHJvcGVydGllcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25BcHBseUNvbmZpZ3VyYXRpb25DbGlja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlQXBwbHlDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29uZmlndXJhdGlvbnMoKSxcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2Uub25EZWxldGUuc3Vic2NyaWJlKGNvbmZpZ3VyYXRpb25OYW1lID0+IHRoaXMudGFibGUub1RhYmxlU3RvcmFnZS5kZWxldGVTdG9yZWRDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25OYW1lKSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0ICYmIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5pc0RlZmF1bHRDb25maWd1cmF0aW9uU2VsZWN0ZWQoKSkge1xuICAgICAgICBzZWxmLnRhYmxlLmFwcGx5RGVmYXVsdENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkQ29uZmlndXJhdGlvbk5hbWU6IHN0cmluZyA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRTZWxlY3RlZENvbmZpZ3VyYXRpb25OYW1lKCk7XG4gICAgICAgIGlmIChzZWxlY3RlZENvbmZpZ3VyYXRpb25OYW1lKSB7XG4gICAgICAgICAgc2VsZi50YWJsZS5hcHBseUNvbmZpZ3VyYXRpb24oc2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=