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
export var DEFAULT_INPUTS_O_TABLE_MENU = [
    'selectAllCheckbox: select-all-checkbox',
    'exportButton: export-button',
    'columnsVisibilityButton: columns-visibility-button',
    'showConfigurationOption: show-configuration-option',
    'showFilterOption: show-filter-option'
];
export var DEFAULT_OUTPUTS_O_TABLE_MENU = [];
var OTableMenuComponent = (function () {
    function OTableMenuComponent(injector, dialog, cd, table) {
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
    OTableMenuComponent.prototype.ngOnInit = function () {
        this.permissions = this.table.getMenuPermissions();
    };
    OTableMenuComponent.prototype.ngAfterViewInit = function () {
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
    };
    OTableMenuComponent.prototype.disableOTableOptionComponent = function (comp) {
        comp.enabled = false;
        var buttonEL = comp.elRef.nativeElement.querySelector('button');
        var obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
        this.mutationObservers.push(obs);
    };
    OTableMenuComponent.prototype.disableButton = function (buttonEL) {
        buttonEL.nativeElement.disabled = true;
        var obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL.nativeElement);
        this.mutationObservers.push(obs);
    };
    OTableMenuComponent.prototype.ngOnDestroy = function () {
        if (this.mutationObservers) {
            this.mutationObservers.forEach(function (m) {
                m.disconnect();
            });
        }
    };
    OTableMenuComponent.prototype.registerOptions = function (oTableOptions) {
        var items = this.permissions.items || [];
        var fixedOptions = ['select-all-checkbox', 'export', 'show-hide-columns', 'filter', 'configuration'];
        var userItems = items.filter(function (perm) { return fixedOptions.indexOf(perm.attr) === -1; });
        var self = this;
        userItems.forEach(function (perm) {
            var option = oTableOptions.find(function (oTableOption) { return oTableOption.oattr === perm.attr; });
            self.setPermissionsToOTableOption(perm, option);
        });
    };
    OTableMenuComponent.prototype.setPermissionsToOTableOption = function (perm, option) {
        if (perm.visible === false && option) {
            option.elRef.nativeElement.remove();
        }
        else if (perm.enabled === false && option) {
            option.enabled = false;
            var buttonEL = option.elRef.nativeElement.querySelector('button');
            var obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
            this.mutationObservers.push(obs);
        }
    };
    OTableMenuComponent.prototype.getPermissionByAttr = function (attr) {
        var items = this.permissions.items || [];
        return items.find(function (perm) { return perm.attr === attr; });
    };
    Object.defineProperty(OTableMenuComponent.prototype, "isSelectAllOptionActive", {
        get: function () {
            return this.table.oTableOptions.selectColumn.visible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "showColumnsFilterOption", {
        get: function () {
            return this.table.oTableColumnsFilterComponent !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "enabledColumnsFilterOption", {
        get: function () {
            return this.table.oTableColumnsFilterComponent !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "showSelectAllCheckbox", {
        get: function () {
            if (!this.selectAllCheckbox) {
                return false;
            }
            var perm = this.getPermissionByAttr('select-all-checkbox');
            return this.showFilterOption && !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "rowHeightObservable", {
        get: function () {
            return this.table.rowHeightObservable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "enabledSelectAllCheckbox", {
        get: function () {
            var perm = this.getPermissionByAttr('select-all-checkbox');
            return !(perm && perm.enabled === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "showExportButton", {
        get: function () {
            if (!this.exportButton) {
                return false;
            }
            var perm = this.getPermissionByAttr('export');
            return !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "enabledExportButton", {
        get: function () {
            var perm = this.getPermissionByAttr('export');
            return !(perm && perm.enabled === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "showColumnsVisibilityButton", {
        get: function () {
            if (!this.columnsVisibilityButton) {
                return false;
            }
            var perm = this.getPermissionByAttr('show-hide-columns');
            return !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "enabledColumnsVisibilityButton", {
        get: function () {
            var perm = this.getPermissionByAttr('show-hide-columns');
            return !(perm && perm.enabled === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "showFilterMenu", {
        get: function () {
            var perm = this.getPermissionByAttr('filter');
            return this.showFilterOption && !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "enabledFilterMenu", {
        get: function () {
            var perm = this.getPermissionByAttr('filter');
            return !(perm && perm.enabled === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "showConfigurationMenu", {
        get: function () {
            var perm = this.getPermissionByAttr('configuration');
            return this.showConfigurationOption && !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableMenuComponent.prototype, "enabledConfigurationMenu", {
        get: function () {
            var perm = this.getPermissionByAttr('configuration');
            return !(perm && perm.enabled === false);
        },
        enumerable: true,
        configurable: true
    });
    OTableMenuComponent.prototype.onShowsSelects = function () {
        var tableOptions = this.table.oTableOptions;
        tableOptions.selectColumn.visible = !tableOptions.selectColumn.visible;
        this.table.initializeCheckboxColumn();
    };
    OTableMenuComponent.prototype.onExportButtonClicked = function () {
        var _this = this;
        var tableOptions = this.table.oTableOptions;
        var exportCnfg = new OTableExportConfiguration();
        var colsNotIncluded = tableOptions.columns.filter(function (c) { return void 0 !== c.renderer && c.renderer instanceof OTableCellRendererImageComponent; }).map(function (c) { return c.attr; });
        colsNotIncluded.push(Codes.NAME_COLUMN_SELECT);
        switch (this.table.exportMode) {
            case Codes.EXPORT_MODE_ALL:
                exportCnfg.filter = this.table.getComponentFilter();
                break;
            case Codes.EXPORT_MODE_LOCAL:
                exportCnfg.data = this.table.getAllRenderedValues();
                colsNotIncluded.forEach(function (attr) { return exportCnfg.data.forEach(function (row) { return delete row[attr]; }); });
                break;
            default:
                exportCnfg.data = this.table.getRenderedValue();
                colsNotIncluded.forEach(function (attr) { return exportCnfg.data.forEach(function (row) { return delete row[attr]; }); });
                break;
        }
        exportCnfg.mode = this.table.exportMode;
        exportCnfg.entity = this.table.entity;
        exportCnfg.columns = tableOptions.visibleColumns.filter(function (c) { return colsNotIncluded.indexOf(c) === -1; });
        var tableColumnNames = {};
        tableOptions.visibleColumns.filter(function (c) { return colsNotIncluded.indexOf(c) === -1; }).forEach(function (c) {
            var oColumn = tableOptions.columns.find(function (oc) { return oc.attr === c; });
            tableColumnNames[c] = _this.translateService.get(oColumn.title ? oColumn.title : oColumn.attr);
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
    };
    OTableMenuComponent.prototype.onChangeColumnsVisibilityClicked = function () {
        var _this = this;
        var dialogRef = this.dialog.open(OTableVisibleColumnsDialogComponent, {
            data: {
                visibleColumns: Util.parseArray(this.table.visibleColumns, true),
                columnsData: this.table.oTableOptions.columns,
                rowHeight: this.table.rowHeight
            },
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.table.visibleColArray = dialogRef.componentInstance.getVisibleColumns();
                var columnsOrder_1 = dialogRef.componentInstance.getColumnsOrder();
                _this.table.oTableOptions.columns.sort(function (a, b) { return columnsOrder_1.indexOf(a.attr) - columnsOrder_1.indexOf(b.attr); });
                _this.table.refreshColumnsWidth();
                _this.table.onVisibleColumnsChange.emit(_this.table.visibleColArray);
            }
        });
    };
    OTableMenuComponent.prototype.onFilterByColumnClicked = function () {
        if (this.table.showFilterByColumnIcon && this.table.dataSource.isColumnValueFilterActive()) {
            var self_1 = this;
            this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DISCARD_FILTER_BY_COLUMN').then(function (res) {
                if (res) {
                    self_1.table.dataSource.clearColumnFilters();
                }
                self_1.table.showFilterByColumnIcon = !res;
                self_1.table.cd.detectChanges();
            });
        }
        else {
            this.table.showFilterByColumnIcon = !this.table.showFilterByColumnIcon;
            this.table.cd.detectChanges();
        }
    };
    OTableMenuComponent.prototype.onStoreFilterClicked = function () {
        var _this = this;
        var dialogRef = this.dialog.open(OTableStoreFilterDialogComponent, {
            data: this.table.oTableStorage.getStoredFilters().map(function (filter) { return filter.name; }),
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.table.oTableStorage.storeFilter(dialogRef.componentInstance.getFilterAttributes());
            }
        });
    };
    OTableMenuComponent.prototype.onLoadFilterClicked = function () {
        var _this = this;
        var dialogRef = this.dialog.open(OTableLoadFilterDialogComponent, {
            data: this.table.oTableStorage.getStoredFilters(),
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.componentInstance.onDelete.subscribe(function (filterName) { return _this.table.oTableStorage.deleteStoredFilter(filterName); });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                var selectedFilterName = dialogRef.componentInstance.getSelectedFilterName();
                if (selectedFilterName) {
                    var storedFilter = _this.table.oTableStorage.getStoredFilterConf(selectedFilterName);
                    if (storedFilter) {
                        _this.table.setFiltersConfiguration(storedFilter);
                        _this.table.reloadPaginatedDataFromStart();
                    }
                }
            }
        });
    };
    OTableMenuComponent.prototype.onClearFilterClicked = function () {
        var _this = this;
        this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_CLEAR_FILTER').then(function (result) {
            if (result) {
                _this.table.clearFilters();
                _this.table.reloadPaginatedDataFromStart();
            }
        });
    };
    OTableMenuComponent.prototype.onStoreConfigurationClicked = function () {
        var dialogRef = this.dialog.open(OTableStoreConfigurationDialogComponent, {
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        var self = this;
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                var configurationData = dialogRef.componentInstance.getConfigurationAttributes();
                var tableProperties = dialogRef.componentInstance.getSelectedTableProperties();
                self.table.oTableStorage.storeConfiguration(configurationData, tableProperties);
            }
        });
    };
    OTableMenuComponent.prototype.onApplyConfigurationClicked = function () {
        var _this = this;
        var dialogRef = this.dialog.open(OTableApplyConfigurationDialogComponent, {
            data: this.table.oTableStorage.getStoredConfigurations(),
            width: 'calc((75em - 100%) * 1000)',
            maxWidth: '65vw',
            minWidth: '30vw',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        var self = this;
        dialogRef.componentInstance.onDelete.subscribe(function (configurationName) { return _this.table.oTableStorage.deleteStoredConfiguration(configurationName); });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result && dialogRef.componentInstance.isDefaultConfigurationSelected()) {
                self.table.applyDefaultConfiguration();
            }
            else if (result) {
                var selectedConfigurationName = dialogRef.componentInstance.getSelectedConfigurationName();
                if (selectedConfigurationName) {
                    self.table.applyConfiguration(selectedConfigurationName);
                }
            }
        });
    };
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
    OTableMenuComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: MatDialog },
        { type: ChangeDetectorRef },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
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
    return OTableMenuComponent;
}());
export { OTableMenuComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1tZW51L28tdGFibGUtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBR1IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUUzRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBRzFGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNuRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEQsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sMkVBQTJFLENBQUM7QUFFN0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzdELE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLCtFQUErRSxDQUFDO0FBQ3hJLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLCtE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QUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTswQ0FFbEMsU0FBUyxTQUFDLHlCQUF5QixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtxQ0FFdEQsU0FBUyxTQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnREFFakQsU0FBUyxTQUFDLCtCQUErQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTttQ0FFNUQsU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOzBDQUVqRSxTQUFTLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7NkJBR3hFLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO29DQUV6QyxTQUFTLFNBQUMsbUJBQW1CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3FDQUVoRCxTQUFTLFNBQUMsb0JBQW9CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQWhDbEQ7UUFEQyxjQUFjLEVBQUU7O2tFQUNrQjtJQUVuQztRQURDLGNBQWMsRUFBRTs7NkRBQ1k7SUFFN0I7UUFEQyxjQUFjLEVBQUU7O3dFQUN1QjtJQUV4QztRQURDLGNBQWMsRUFBRTs7aUVBQ2dCO0lBRWpDO1FBREMsY0FBYyxFQUFFOzt3RUFDdUI7SUEyWDFDLDBCQUFDO0NBQUEsQUFuWkQsSUFtWkM7U0F2WVksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGlhbG9nLCBNYXRNZW51IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9UYWJsZU1lbnUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtbWVudS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlJztcbmltcG9ydCB7IFNuYWNrQmFyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL3NuYWNrYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlTWVudVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby10YWJsZS1tZW51LXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT1RhYmxlQ2VsbFJlbmRlcmVySW1hZ2VDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vY2VsbC1yZW5kZXJlci9pbWFnZS9vLXRhYmxlLWNlbGwtcmVuZGVyZXItaW1hZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQXBwbHlDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL2FwcGx5LWNvbmZpZ3VyYXRpb24vby10YWJsZS1hcHBseS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRXhwb3J0RGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL2V4cG9ydC9vLXRhYmxlLWV4cG9ydC1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUxvYWRGaWx0ZXJEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvbG9hZC1maWx0ZXIvby10YWJsZS1sb2FkLWZpbHRlci1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZVN0b3JlQ29uZmlndXJhdGlvbkRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uLy4uL2RpYWxvZy9zdG9yZS1jb25maWd1cmF0aW9uL28tdGFibGUtc3RvcmUtY29uZmlndXJhdGlvbi1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZVN0b3JlRmlsdGVyRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL3N0b3JlLWZpbHRlci9vLXRhYmxlLXN0b3JlLWZpbHRlci1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZVZpc2libGVDb2x1bW5zRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL3Zpc2libGUtY29sdW1ucy9vLXRhYmxlLXZpc2libGUtY29sdW1ucy1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbkNvbXBvbmVudCB9IGZyb20gJy4uL3RhYmxlLW9wdGlvbi9vLXRhYmxlLW9wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRXhwb3J0Q29uZmlndXJhdGlvbiB9IGZyb20gJy4vby10YWJsZS1leHBvcnQtY29uZmlndXJhdGlvbi5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX01FTlUgPSBbXG4gIC8vIHNlbGVjdC1hbGwtY2hlY2tib3ggW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBzZWxlY3Rpb24gY2hlY2sgYm94ZXMuIERlZmF1bHQ6IG5vLlxuICAnc2VsZWN0QWxsQ2hlY2tib3g6IHNlbGVjdC1hbGwtY2hlY2tib3gnLFxuXG4gIC8vIGV4cG9ydC1idXR0b24gW25vfHllc106IHNob3cgZXhwb3J0IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnZXhwb3J0QnV0dG9uOiBleHBvcnQtYnV0dG9uJyxcblxuICAvLyBjb2x1bW5zLXZpc2liaWxpdHktYnV0dG9uIFtub3x5ZXNdOiBzaG93IGNvbHVtbnMgdmlzaWJpbGl0eSBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2NvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBjb2x1bW5zLXZpc2liaWxpdHktYnV0dG9uJyxcblxuICAvLyBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgY29uZmlndXJhdGlvbiBidXR0b24gaW4gaGVhZGVyLiBEZWZhdWx0OiB5ZXMuXG4gICdzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogc2hvdy1jb25maWd1cmF0aW9uLW9wdGlvbicsXG5cbiAgLy8gc2hvdy1maWx0ZXItb3B0aW9uIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgZmlsdGVyIG1lbnUgb3B0aW9uIGluIHRoZSBoZWFkZXIgbWVudVxuICAnc2hvd0ZpbHRlck9wdGlvbjogc2hvdy1maWx0ZXItb3B0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX01FTlUgPSBbXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtbWVudS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtbWVudS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfTUVOVSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfTUVOVSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1tZW51XSc6ICd0cnVlJ1xuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVNZW51Q29tcG9uZW50IGltcGxlbWVudHMgT1RhYmxlTWVudSwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIC8qIElucHV0cyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZWxlY3RBbGxDaGVja2JveDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBleHBvcnRCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dGaWx0ZXJPcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIC8qIEVuZCBvZiBpbnB1dHMgKi9cblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJTZXJ2aWNlOiBTbmFja0JhclNlcnZpY2U7XG5cbiAgQFZpZXdDaGlsZCgnbWVudScsIHsgc3RhdGljOiB0cnVlIH0pXG4gIG1hdE1lbnU6IE1hdE1lbnU7XG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdEFsbENoZWNrYm94T3B0aW9uJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHNlbGVjdEFsbENoZWNrYm94T3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2V4cG9ydEJ1dHRvbk9wdGlvbicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBleHBvcnRCdXR0b25PcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb24nLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZmlsdGVyTWVudUJ1dHRvbicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBmaWx0ZXJNZW51QnV0dG9uOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdjb25maWd1cmF0aW9uTWVudUJ1dHRvbicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBjb25maWd1cmF0aW9uTWVudUJ1dHRvbjogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkKCdmaWx0ZXJNZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGZpbHRlck1lbnU6IE1hdE1lbnU7XG4gIEBWaWV3Q2hpbGQoJ2NvbmZpZ3VyYXRpb25NZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGNvbmZpZ3VyYXRpb25NZW51OiBNYXRNZW51O1xuICBAVmlld0NoaWxkKCdjb2x1bW5GaWx0ZXJPcHRpb24nLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgY29sdW1uRmlsdGVyT3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zOiBPVGFibGVNZW51UGVybWlzc2lvbnM7XG4gIHByb3RlY3RlZCBtdXRhdGlvbk9ic2VydmVyczogTXV0YXRpb25PYnNlcnZlcltdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZGlhbG9nOiBNYXREaWFsb2csXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnRcbiAgKSB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoU25hY2tCYXJTZXJ2aWNlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnRhYmxlLmdldE1lbnVQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmNvbHVtbkZpbHRlck9wdGlvbikge1xuICAgICAgdGhpcy5jb2x1bW5GaWx0ZXJPcHRpb24uc2V0QWN0aXZlKHRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbik7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGVybWlzc2lvbnMuaXRlbXMgfHwgdGhpcy5wZXJtaXNzaW9ucy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VsZWN0QWxsQ2hlY2tib3hPcHRpb24gJiYgIXRoaXMuZW5hYmxlZFNlbGVjdEFsbENoZWNrYm94KSB7XG4gICAgICB0aGlzLmRpc2FibGVPVGFibGVPcHRpb25Db21wb25lbnQodGhpcy5zZWxlY3RBbGxDaGVja2JveE9wdGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLmV4cG9ydEJ1dHRvbk9wdGlvbiAmJiAhdGhpcy5lbmFibGVkRXhwb3J0QnV0dG9uKSB7XG4gICAgICB0aGlzLmRpc2FibGVPVGFibGVPcHRpb25Db21wb25lbnQodGhpcy5leHBvcnRCdXR0b25PcHRpb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbk9wdGlvbiAmJiAhdGhpcy5lbmFibGVkQ29sdW1uc1Zpc2liaWxpdHlCdXR0b24pIHtcbiAgICAgIHRoaXMuZGlzYWJsZU9UYWJsZU9wdGlvbkNvbXBvbmVudCh0aGlzLmNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uT3B0aW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsdGVyTWVudUJ1dHRvbiAmJiAhdGhpcy5lbmFibGVkRmlsdGVyTWVudSkge1xuICAgICAgdGhpcy5kaXNhYmxlQnV0dG9uKHRoaXMuZmlsdGVyTWVudUJ1dHRvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbmZpZ3VyYXRpb25NZW51QnV0dG9uICYmICF0aGlzLmVuYWJsZWRDb25maWd1cmF0aW9uTWVudSkge1xuICAgICAgdGhpcy5kaXNhYmxlQnV0dG9uKHRoaXMuY29uZmlndXJhdGlvbk1lbnVCdXR0b24pO1xuICAgIH1cbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkaXNhYmxlT1RhYmxlT3B0aW9uQ29tcG9uZW50KGNvbXA6IE9UYWJsZU9wdGlvbkNvbXBvbmVudCkge1xuICAgIGNvbXAuZW5hYmxlZCA9IGZhbHNlO1xuICAgIGNvbnN0IGJ1dHRvbkVMID0gY29tcC5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgIGNvbnN0IG9icyA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbShidXR0b25FTCk7XG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9icyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGlzYWJsZUJ1dHRvbihidXR0b25FTDogRWxlbWVudFJlZikge1xuICAgIGJ1dHRvbkVMLm5hdGl2ZUVsZW1lbnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbnN0IG9icyA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbShidXR0b25FTC5uYXRpdmVFbGVtZW50KTtcbiAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLnB1c2gob2JzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLmZvckVhY2goKG06IE11dGF0aW9uT2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgbS5kaXNjb25uZWN0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9wdGlvbnMob1RhYmxlT3B0aW9uczogT1RhYmxlT3B0aW9uQ29tcG9uZW50W10pIHtcbiAgICBjb25zdCBpdGVtczogT1Blcm1pc3Npb25zW10gPSB0aGlzLnBlcm1pc3Npb25zLml0ZW1zIHx8IFtdO1xuICAgIGNvbnN0IGZpeGVkT3B0aW9ucyA9IFsnc2VsZWN0LWFsbC1jaGVja2JveCcsICdleHBvcnQnLCAnc2hvdy1oaWRlLWNvbHVtbnMnLCAnZmlsdGVyJywgJ2NvbmZpZ3VyYXRpb24nXTtcbiAgICBjb25zdCB1c2VySXRlbXM6IE9QZXJtaXNzaW9uc1tdID0gaXRlbXMuZmlsdGVyKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IGZpeGVkT3B0aW9ucy5pbmRleE9mKHBlcm0uYXR0cikgPT09IC0xKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB1c2VySXRlbXMuZm9yRWFjaCgocGVybTogT1Blcm1pc3Npb25zKSA9PiB7XG4gICAgICBjb25zdCBvcHRpb24gPSBvVGFibGVPcHRpb25zLmZpbmQoKG9UYWJsZU9wdGlvbjogT1RhYmxlT3B0aW9uQ29tcG9uZW50KSA9PiBvVGFibGVPcHRpb24ub2F0dHIgPT09IHBlcm0uYXR0cik7XG4gICAgICBzZWxmLnNldFBlcm1pc3Npb25zVG9PVGFibGVPcHRpb24ocGVybSwgb3B0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRQZXJtaXNzaW9uc1RvT1RhYmxlT3B0aW9uKHBlcm06IE9QZXJtaXNzaW9ucywgb3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQpIHtcbiAgICBpZiAocGVybS52aXNpYmxlID09PSBmYWxzZSAmJiBvcHRpb24pIHtcbiAgICAgIG9wdGlvbi5lbFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZSgpO1xuICAgIH0gZWxzZSBpZiAocGVybS5lbmFibGVkID09PSBmYWxzZSAmJiBvcHRpb24pIHtcbiAgICAgIG9wdGlvbi5lbmFibGVkID0gZmFsc2U7XG4gICAgICBjb25zdCBidXR0b25FTCA9IG9wdGlvbi5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgICAgY29uc3Qgb2JzID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGJ1dHRvbkVMKTtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBlcm1pc3Npb25CeUF0dHIoYXR0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbXM6IE9QZXJtaXNzaW9uc1tdID0gdGhpcy5wZXJtaXNzaW9ucy5pdGVtcyB8fCBbXTtcbiAgICByZXR1cm4gaXRlbXMuZmluZCgocGVybTogT1Blcm1pc3Npb25zKSA9PiBwZXJtLmF0dHIgPT09IGF0dHIpO1xuICB9XG5cbiAgZ2V0IGlzU2VsZWN0QWxsT3B0aW9uQWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGU7XG4gIH1cblxuICBnZXQgc2hvd0NvbHVtbnNGaWx0ZXJPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWRDb2x1bW5zRmlsdGVyT3B0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldCBzaG93U2VsZWN0QWxsQ2hlY2tib3goKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdEFsbENoZWNrYm94KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignc2VsZWN0LWFsbC1jaGVja2JveCcpO1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJPcHRpb24gJiYgIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHJvd0hlaWdodE9ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy50YWJsZS5yb3dIZWlnaHRPYnNlcnZhYmxlO1xuICB9XG4gIGdldCBlbmFibGVkU2VsZWN0QWxsQ2hlY2tib3goKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdzZWxlY3QtYWxsLWNoZWNrYm94Jyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93RXhwb3J0QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5leHBvcnRCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdleHBvcnQnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWRFeHBvcnRCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdleHBvcnQnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dDb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY29sdW1uc1Zpc2liaWxpdHlCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdzaG93LWhpZGUtY29sdW1ucycpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZENvbHVtbnNWaXNpYmlsaXR5QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignc2hvdy1oaWRlLWNvbHVtbnMnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dGaWx0ZXJNZW51KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZmlsdGVyJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlck9wdGlvbiAmJiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZEZpbHRlck1lbnUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdmaWx0ZXInKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dDb25maWd1cmF0aW9uTWVudSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2NvbmZpZ3VyYXRpb24nKTtcbiAgICByZXR1cm4gdGhpcy5zaG93Q29uZmlndXJhdGlvbk9wdGlvbiAmJiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgZW5hYmxlZENvbmZpZ3VyYXRpb25NZW51KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignY29uZmlndXJhdGlvbicpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBvblNob3dzU2VsZWN0cygpIHtcbiAgICBjb25zdCB0YWJsZU9wdGlvbnMgPSB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnM7XG4gICAgdGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gIXRhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZTtcbiAgICB0aGlzLnRhYmxlLmluaXRpYWxpemVDaGVja2JveENvbHVtbigpO1xuICB9XG5cbiAgb25FeHBvcnRCdXR0b25DbGlja2VkKCkge1xuICAgIGNvbnN0IHRhYmxlT3B0aW9ucyA9IHRoaXMudGFibGUub1RhYmxlT3B0aW9ucztcbiAgICBjb25zdCBleHBvcnRDbmZnOiBPVGFibGVFeHBvcnRDb25maWd1cmF0aW9uID0gbmV3IE9UYWJsZUV4cG9ydENvbmZpZ3VyYXRpb24oKTtcblxuICAgIC8vIGdldCBjb2x1bW4ncyBhdHRyIHdob3NlIHJlbmRlcmVyIGlzIE9UYWJsZUNlbGxSZW5kZXJlckltYWdlQ29tcG9uZW50XG4gICAgY29uc3QgY29sc05vdEluY2x1ZGVkOiBzdHJpbmdbXSA9IHRhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihjID0+IHZvaWQgMCAhPT0gYy5yZW5kZXJlciAmJiBjLnJlbmRlcmVyIGluc3RhbmNlb2YgT1RhYmxlQ2VsbFJlbmRlcmVySW1hZ2VDb21wb25lbnQpLm1hcChjID0+IGMuYXR0cik7XG4gICAgY29sc05vdEluY2x1ZGVkLnB1c2goQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKTtcblxuICAgIC8vIFRhYmxlIGRhdGEvZmlsdGVyc1xuICAgIHN3aXRjaCAodGhpcy50YWJsZS5leHBvcnRNb2RlKSB7XG4gICAgICBjYXNlIENvZGVzLkVYUE9SVF9NT0RFX0FMTDpcbiAgICAgICAgZXhwb3J0Q25mZy5maWx0ZXIgPSB0aGlzLnRhYmxlLmdldENvbXBvbmVudEZpbHRlcigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuRVhQT1JUX01PREVfTE9DQUw6XG4gICAgICAgIGV4cG9ydENuZmcuZGF0YSA9IHRoaXMudGFibGUuZ2V0QWxsUmVuZGVyZWRWYWx1ZXMoKTtcbiAgICAgICAgY29sc05vdEluY2x1ZGVkLmZvckVhY2goYXR0ciA9PiBleHBvcnRDbmZnLmRhdGEuZm9yRWFjaChyb3cgPT4gZGVsZXRlIHJvd1thdHRyXSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGV4cG9ydENuZmcuZGF0YSA9IHRoaXMudGFibGUuZ2V0UmVuZGVyZWRWYWx1ZSgpO1xuICAgICAgICBjb2xzTm90SW5jbHVkZWQuZm9yRWFjaChhdHRyID0+IGV4cG9ydENuZmcuZGF0YS5mb3JFYWNoKHJvdyA9PiBkZWxldGUgcm93W2F0dHJdKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBleHBvcnRDbmZnLm1vZGUgPSB0aGlzLnRhYmxlLmV4cG9ydE1vZGU7XG4gICAgZXhwb3J0Q25mZy5lbnRpdHkgPSB0aGlzLnRhYmxlLmVudGl0eTtcblxuICAgIC8vIFRhYmxlIGNvbHVtbnNcbiAgICBleHBvcnRDbmZnLmNvbHVtbnMgPSB0YWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuZmlsdGVyKGMgPT4gY29sc05vdEluY2x1ZGVkLmluZGV4T2YoYykgPT09IC0xKTtcbiAgICAvLyBUYWJsZSBjb2x1bW4gbmFtZXNcbiAgICBjb25zdCB0YWJsZUNvbHVtbk5hbWVzID0ge307XG4gICAgdGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmZpbHRlcihjID0+IGNvbHNOb3RJbmNsdWRlZC5pbmRleE9mKGMpID09PSAtMSkuZm9yRWFjaChjID0+IHtcbiAgICAgIGNvbnN0IG9Db2x1bW4gPSB0YWJsZU9wdGlvbnMuY29sdW1ucy5maW5kKG9jID0+IG9jLmF0dHIgPT09IGMpO1xuICAgICAgdGFibGVDb2x1bW5OYW1lc1tjXSA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQob0NvbHVtbi50aXRsZSA/IG9Db2x1bW4udGl0bGUgOiBvQ29sdW1uLmF0dHIpO1xuICAgIH0pO1xuICAgIGV4cG9ydENuZmcuY29sdW1uTmFtZXMgPSB0YWJsZUNvbHVtbk5hbWVzO1xuICAgIC8vIFRhYmxlIGNvbHVtbiBzcWxUeXBlc1xuICAgIGV4cG9ydENuZmcuc3FsVHlwZXMgPSB0aGlzLnRhYmxlLmdldFNxbFR5cGVzKCk7XG4gICAgLy8gVGFibGUgc2VydmljZSwgbmVlZGVkIGZvciBjb25maWd1cmluZyBvbnRpbWl6ZSBleHBvcnQgc2VydmljZSB3aXRoIHRhYmxlIHNlcnZpY2UgY29uZmlndXJhdGlvblxuICAgIGV4cG9ydENuZmcuc2VydmljZSA9IHRoaXMudGFibGUuc2VydmljZTtcbiAgICBleHBvcnRDbmZnLnNlcnZpY2VUeXBlID0gdGhpcy50YWJsZS5leHBvcnRTZXJ2aWNlVHlwZTtcbiAgICBleHBvcnRDbmZnLnZpc2libGVCdXR0b25zID0gdGhpcy50YWJsZS52aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9ucztcbiAgICBleHBvcnRDbmZnLm9wdGlvbnMgPSB0aGlzLnRhYmxlLmV4cG9ydE9wdHNUZW1wbGF0ZTtcblxuICAgIHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlRXhwb3J0RGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiBleHBvcnRDbmZnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gIH1cblxuICBvbkNoYW5nZUNvbHVtbnNWaXNpYmlsaXR5Q2xpY2tlZCgpIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZVZpc2libGVDb2x1bW5zRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZpc2libGVDb2x1bW5zOiBVdGlsLnBhcnNlQXJyYXkodGhpcy50YWJsZS52aXNpYmxlQ29sdW1ucywgdHJ1ZSksXG4gICAgICAgIGNvbHVtbnNEYXRhOiB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucyxcbiAgICAgICAgcm93SGVpZ2h0OiB0aGlzLnRhYmxlLnJvd0hlaWdodFxuICAgICAgfSxcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHBhbmVsQ2xhc3M6IFsnby1kaWFsb2ctY2xhc3MnLCAnby10YWJsZS1kaWFsb2cnXVxuICAgIH0pO1xuXG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMudGFibGUudmlzaWJsZUNvbEFycmF5ID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFZpc2libGVDb2x1bW5zKCk7XG4gICAgICAgIGNvbnN0IGNvbHVtbnNPcmRlciA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRDb2x1bW5zT3JkZXIoKTtcbiAgICAgICAgdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4gY29sdW1uc09yZGVyLmluZGV4T2YoYS5hdHRyKSAtIGNvbHVtbnNPcmRlci5pbmRleE9mKGIuYXR0cikpO1xuICAgICAgICB0aGlzLnRhYmxlLnJlZnJlc2hDb2x1bW5zV2lkdGgoKTtcbiAgICAgICAgdGhpcy50YWJsZS5vblZpc2libGVDb2x1bW5zQ2hhbmdlLmVtaXQodGhpcy50YWJsZS52aXNpYmxlQ29sQXJyYXkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb25GaWx0ZXJCeUNvbHVtbkNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiAmJiB0aGlzLnRhYmxlLmRhdGFTb3VyY2UuaXNDb2x1bW5WYWx1ZUZpbHRlckFjdGl2ZSgpKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ01FU1NBR0VTLkNPTkZJUk1fRElTQ0FSRF9GSUxURVJfQllfQ09MVU1OJykudGhlbihyZXMgPT4ge1xuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgc2VsZi50YWJsZS5kYXRhU291cmNlLmNsZWFyQ29sdW1uRmlsdGVycygpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9ICFyZXM7XG4gICAgICAgIHNlbGYudGFibGUuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9ICF0aGlzLnRhYmxlLnNob3dGaWx0ZXJCeUNvbHVtbkljb247XG4gICAgICB0aGlzLnRhYmxlLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25TdG9yZUZpbHRlckNsaWNrZWQoKTogdm9pZCB7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVTdG9yZUZpbHRlckRpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZEZpbHRlcnMoKS5tYXAoZmlsdGVyID0+IGZpbHRlci5uYW1lKSxcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcblxuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2Uuc3RvcmVGaWx0ZXIoZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldEZpbHRlckF0dHJpYnV0ZXMoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25Mb2FkRmlsdGVyQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZUxvYWRGaWx0ZXJEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IHRoaXMudGFibGUub1RhYmxlU3RvcmFnZS5nZXRTdG9yZWRGaWx0ZXJzKCksXG4gICAgICB3aWR0aDogJ2NhbGMoKDc1ZW0gLSAxMDAlKSAqIDEwMDApJyxcbiAgICAgIG1heFdpZHRoOiAnNjV2dycsXG4gICAgICBtaW5XaWR0aDogJzMwdncnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG5cbiAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2Uub25EZWxldGUuc3Vic2NyaWJlKGZpbHRlck5hbWUgPT4gdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmRlbGV0ZVN0b3JlZEZpbHRlcihmaWx0ZXJOYW1lKSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRmlsdGVyTmFtZTogc3RyaW5nID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFNlbGVjdGVkRmlsdGVyTmFtZSgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRGaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgY29uc3Qgc3RvcmVkRmlsdGVyID0gdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZEZpbHRlckNvbmYoc2VsZWN0ZWRGaWx0ZXJOYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmVkRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNldEZpbHRlcnNDb25maWd1cmF0aW9uKHN0b3JlZEZpbHRlcik7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2xlYXJGaWx0ZXJDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ1RBQkxFLkRJQUxPRy5DT05GSVJNX0NMRUFSX0ZJTFRFUicpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy50YWJsZS5jbGVhckZpbHRlcnMoKTtcbiAgICAgICAgdGhpcy50YWJsZS5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25TdG9yZUNvbmZpZ3VyYXRpb25DbGlja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlU3RvcmVDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICB3aWR0aDogJ2NhbGMoKDc1ZW0gLSAxMDAlKSAqIDEwMDApJyxcbiAgICAgIG1heFdpZHRoOiAnNjV2dycsXG4gICAgICBtaW5XaWR0aDogJzMwdncnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25EYXRhID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldENvbmZpZ3VyYXRpb25BdHRyaWJ1dGVzKCk7XG4gICAgICAgIGNvbnN0IHRhYmxlUHJvcGVydGllcyA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRTZWxlY3RlZFRhYmxlUHJvcGVydGllcygpO1xuICAgICAgICBzZWxmLnRhYmxlLm9UYWJsZVN0b3JhZ2Uuc3RvcmVDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25EYXRhLCB0YWJsZVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uQXBwbHlDb25maWd1cmF0aW9uQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZUFwcGx5Q29uZmlndXJhdGlvbkRpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZENvbmZpZ3VyYXRpb25zKCksXG4gICAgICB3aWR0aDogJ2NhbGMoKDc1ZW0gLSAxMDAlKSAqIDEwMDApJyxcbiAgICAgIG1heFdpZHRoOiAnNjV2dycsXG4gICAgICBtaW5XaWR0aDogJzMwdncnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLm9uRGVsZXRlLnN1YnNjcmliZShjb25maWd1cmF0aW9uTmFtZSA9PiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZGVsZXRlU3RvcmVkQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uTmFtZSkpO1xuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAmJiBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuaXNEZWZhdWx0Q29uZmlndXJhdGlvblNlbGVjdGVkKCkpIHtcbiAgICAgICAgc2VsZi50YWJsZS5hcHBseURlZmF1bHRDb25maWd1cmF0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZENvbmZpZ3VyYXRpb25OYW1lOiBzdHJpbmcgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0U2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSkge1xuICAgICAgICAgIHNlbGYudGFibGUuYXBwbHlDb25maWd1cmF0aW9uKHNlbGVjdGVkQ29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufVxuIl19