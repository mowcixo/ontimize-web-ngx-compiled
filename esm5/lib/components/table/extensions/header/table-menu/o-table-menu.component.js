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
        this.onVisibleFilterOptionChange = new EventEmitter();
        this.showColumnsFilterOptionSubject = new BehaviorSubject(false);
        this.showColumnsFilterOption = this.showColumnsFilterOptionSubject.asObservable();
        this.mutationObservers = [];
        this.dialogService = this.injector.get(DialogService);
        this.translateService = this.injector.get(OTranslateService);
        this.snackBarService = this.injector.get(SnackBarService);
        var self = this;
        this.subscription = this.onVisibleFilterOptionChange.subscribe(function (x) { return self.showColumnsFilterOptionSubject.next(x); });
    }
    OTableMenuComponent.prototype.ngOnInit = function () {
        this.permissions = this.table.getMenuPermissions();
    };
    Object.defineProperty(OTableMenuComponent.prototype, "isColumnFilterOptionActive", {
        get: function () {
            return this.table && this.table.showFilterByColumnIcon;
        },
        enumerable: true,
        configurable: true
    });
    OTableMenuComponent.prototype.ngAfterViewInit = function () {
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
        this.subscription.unsubscribe();
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
                _this.table.cd.detectChanges();
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
                    self_1.table.clearColumnFilters();
                }
                self_1.table.showFilterByColumnIcon = !res;
            });
        }
        else {
            this.table.showFilterByColumnIcon = !this.table.showFilterByColumnIcon;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1tZW51L28tdGFibGUtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBR1IsU0FBUyxFQUNULGlCQUFpQixFQUNqQixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN2RCxPQUFPLEVBQWMsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVqRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUcxRixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLDJFQUEyRSxDQUFDO0FBRTdILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUNBQXVDLEVBQUUsTUFBTSwrRUFBK0UsQ0FBQztBQUN4SSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUs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c0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdE1lbnUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9UYWJsZU1lbnUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtbWVudS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlJztcbmltcG9ydCB7IFNuYWNrQmFyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL3NuYWNrYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlTWVudVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby10YWJsZS1tZW51LXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT1RhYmxlQ2VsbFJlbmRlcmVySW1hZ2VDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vY2VsbC1yZW5kZXJlci9pbWFnZS9vLXRhYmxlLWNlbGwtcmVuZGVyZXItaW1hZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQXBwbHlDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL2FwcGx5LWNvbmZpZ3VyYXRpb24vby10YWJsZS1hcHBseS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRXhwb3J0RGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL2V4cG9ydC9vLXRhYmxlLWV4cG9ydC1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUxvYWRGaWx0ZXJEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuLi8uLi9kaWFsb2cvbG9hZC1maWx0ZXIvby10YWJsZS1sb2FkLWZpbHRlci1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZVN0b3JlQ29uZmlndXJhdGlvbkRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uLy4uL2RpYWxvZy9zdG9yZS1jb25maWd1cmF0aW9uL28tdGFibGUtc3RvcmUtY29uZmlndXJhdGlvbi1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZVN0b3JlRmlsdGVyRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL3N0b3JlLWZpbHRlci9vLXRhYmxlLXN0b3JlLWZpbHRlci1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZVZpc2libGVDb2x1bW5zRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZGlhbG9nL3Zpc2libGUtY29sdW1ucy9vLXRhYmxlLXZpc2libGUtY29sdW1ucy1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbkNvbXBvbmVudCB9IGZyb20gJy4uL3RhYmxlLW9wdGlvbi9vLXRhYmxlLW9wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRXhwb3J0Q29uZmlndXJhdGlvbiB9IGZyb20gJy4vby10YWJsZS1leHBvcnQtY29uZmlndXJhdGlvbi5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX01FTlUgPSBbXG4gIC8vIHNlbGVjdC1hbGwtY2hlY2tib3ggW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBzZWxlY3Rpb24gY2hlY2sgYm94ZXMuIERlZmF1bHQ6IG5vLlxuICAnc2VsZWN0QWxsQ2hlY2tib3g6IHNlbGVjdC1hbGwtY2hlY2tib3gnLFxuXG4gIC8vIGV4cG9ydC1idXR0b24gW25vfHllc106IHNob3cgZXhwb3J0IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnZXhwb3J0QnV0dG9uOiBleHBvcnQtYnV0dG9uJyxcblxuICAvLyBjb2x1bW5zLXZpc2liaWxpdHktYnV0dG9uIFtub3x5ZXNdOiBzaG93IGNvbHVtbnMgdmlzaWJpbGl0eSBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2NvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBjb2x1bW5zLXZpc2liaWxpdHktYnV0dG9uJyxcblxuICAvLyBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgY29uZmlndXJhdGlvbiBidXR0b24gaW4gaGVhZGVyLiBEZWZhdWx0OiB5ZXMuXG4gICdzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogc2hvdy1jb25maWd1cmF0aW9uLW9wdGlvbicsXG5cbiAgLy8gc2hvdy1maWx0ZXItb3B0aW9uIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgZmlsdGVyIG1lbnUgb3B0aW9uIGluIHRoZSBoZWFkZXIgbWVudVxuICAnc2hvd0ZpbHRlck9wdGlvbjogc2hvdy1maWx0ZXItb3B0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX01FTlUgPSBbXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtbWVudS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtbWVudS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfTUVOVSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfTUVOVSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1tZW51XSc6ICd0cnVlJ1xuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVNZW51Q29tcG9uZW50IGltcGxlbWVudHMgT1RhYmxlTWVudSwgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIC8qIElucHV0cyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZWxlY3RBbGxDaGVja2JveDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBleHBvcnRCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dGaWx0ZXJPcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHVibGljIG9uVmlzaWJsZUZpbHRlck9wdGlvbkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIC8qIEVuZCBvZiBpbnB1dHMgKi9cblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJTZXJ2aWNlOiBTbmFja0JhclNlcnZpY2U7XG5cbiAgQFZpZXdDaGlsZCgnbWVudScsIHsgc3RhdGljOiB0cnVlIH0pXG4gIG1hdE1lbnU6IE1hdE1lbnU7XG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdEFsbENoZWNrYm94T3B0aW9uJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHNlbGVjdEFsbENoZWNrYm94T3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ2V4cG9ydEJ1dHRvbk9wdGlvbicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBleHBvcnRCdXR0b25PcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb24nLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb246IE9UYWJsZU9wdGlvbkNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZmlsdGVyTWVudUJ1dHRvbicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBmaWx0ZXJNZW51QnV0dG9uOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdjb25maWd1cmF0aW9uTWVudUJ1dHRvbicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBjb25maWd1cmF0aW9uTWVudUJ1dHRvbjogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkKCdmaWx0ZXJNZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGZpbHRlck1lbnU6IE1hdE1lbnU7XG4gIEBWaWV3Q2hpbGQoJ2NvbmZpZ3VyYXRpb25NZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGNvbmZpZ3VyYXRpb25NZW51OiBNYXRNZW51O1xuICBAVmlld0NoaWxkKCdjb2x1bW5GaWx0ZXJPcHRpb24nLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgY29sdW1uRmlsdGVyT3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQ7XG5cbiAgcHJpdmF0ZSBzaG93Q29sdW1uc0ZpbHRlck9wdGlvblN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIHNob3dDb2x1bW5zRmlsdGVyT3B0aW9uOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5zaG93Q29sdW1uc0ZpbHRlck9wdGlvblN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zOiBPVGFibGVNZW51UGVybWlzc2lvbnM7XG4gIHByb3RlY3RlZCBtdXRhdGlvbk9ic2VydmVyczogTXV0YXRpb25PYnNlcnZlcltdID0gW107XG5cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBkaWFsb2c6IE1hdERpYWxvZyxcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwcm90ZWN0ZWQgdGFibGU6IE9UYWJsZUNvbXBvbmVudFxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChTbmFja0JhclNlcnZpY2UpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLm9uVmlzaWJsZUZpbHRlck9wdGlvbkNoYW5nZS5zdWJzY3JpYmUoKHg6IGJvb2xlYW4pID0+IHNlbGYuc2hvd0NvbHVtbnNGaWx0ZXJPcHRpb25TdWJqZWN0Lm5leHQoeCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMudGFibGUuZ2V0TWVudVBlcm1pc3Npb25zKCk7XG4gIH1cblxuICBnZXQgaXNDb2x1bW5GaWx0ZXJPcHRpb25BY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUgJiYgdGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuXG4gICAgdGhpcy5zaG93Q29sdW1uc0ZpbHRlck9wdGlvblN1YmplY3QubmV4dCh0aGlzLnRhYmxlLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgIT09IHVuZGVmaW5lZCk7XG5cblxuICAgIGlmICghdGhpcy5wZXJtaXNzaW9ucy5pdGVtcyB8fCB0aGlzLnBlcm1pc3Npb25zLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZWxlY3RBbGxDaGVja2JveE9wdGlvbiAmJiAhdGhpcy5lbmFibGVkU2VsZWN0QWxsQ2hlY2tib3gpIHtcbiAgICAgIHRoaXMuZGlzYWJsZU9UYWJsZU9wdGlvbkNvbXBvbmVudCh0aGlzLnNlbGVjdEFsbENoZWNrYm94T3B0aW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZXhwb3J0QnV0dG9uT3B0aW9uICYmICF0aGlzLmVuYWJsZWRFeHBvcnRCdXR0b24pIHtcbiAgICAgIHRoaXMuZGlzYWJsZU9UYWJsZU9wdGlvbkNvbXBvbmVudCh0aGlzLmV4cG9ydEJ1dHRvbk9wdGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uT3B0aW9uICYmICF0aGlzLmVuYWJsZWRDb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbikge1xuICAgICAgdGhpcy5kaXNhYmxlT1RhYmxlT3B0aW9uQ29tcG9uZW50KHRoaXMuY29sdW1uc1Zpc2liaWxpdHlCdXR0b25PcHRpb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5maWx0ZXJNZW51QnV0dG9uICYmICF0aGlzLmVuYWJsZWRGaWx0ZXJNZW51KSB7XG4gICAgICB0aGlzLmRpc2FibGVCdXR0b24odGhpcy5maWx0ZXJNZW51QnV0dG9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29uZmlndXJhdGlvbk1lbnVCdXR0b24gJiYgIXRoaXMuZW5hYmxlZENvbmZpZ3VyYXRpb25NZW51KSB7XG4gICAgICB0aGlzLmRpc2FibGVCdXR0b24odGhpcy5jb25maWd1cmF0aW9uTWVudUJ1dHRvbik7XG4gICAgfVxuXG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGlzYWJsZU9UYWJsZU9wdGlvbkNvbXBvbmVudChjb21wOiBPVGFibGVPcHRpb25Db21wb25lbnQpIHtcbiAgICBjb21wLmVuYWJsZWQgPSBmYWxzZTtcbiAgICBjb25zdCBidXR0b25FTCA9IGNvbXAuZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcbiAgICBjb25zdCBvYnMgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20oYnV0dG9uRUwpO1xuICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRpc2FibGVCdXR0b24oYnV0dG9uRUw6IEVsZW1lbnRSZWYpIHtcbiAgICBidXR0b25FTC5uYXRpdmVFbGVtZW50LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjb25zdCBvYnMgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20oYnV0dG9uRUwubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9icyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5tdXRhdGlvbk9ic2VydmVycykge1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5mb3JFYWNoKChtOiBNdXRhdGlvbk9ic2VydmVyKSA9PiB7XG4gICAgICAgIG0uZGlzY29ubmVjdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICByZWdpc3Rlck9wdGlvbnMob1RhYmxlT3B0aW9uczogT1RhYmxlT3B0aW9uQ29tcG9uZW50W10pIHtcbiAgICBjb25zdCBpdGVtczogT1Blcm1pc3Npb25zW10gPSB0aGlzLnBlcm1pc3Npb25zLml0ZW1zIHx8IFtdO1xuICAgIGNvbnN0IGZpeGVkT3B0aW9ucyA9IFsnc2VsZWN0LWFsbC1jaGVja2JveCcsICdleHBvcnQnLCAnc2hvdy1oaWRlLWNvbHVtbnMnLCAnZmlsdGVyJywgJ2NvbmZpZ3VyYXRpb24nXTtcbiAgICBjb25zdCB1c2VySXRlbXM6IE9QZXJtaXNzaW9uc1tdID0gaXRlbXMuZmlsdGVyKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IGZpeGVkT3B0aW9ucy5pbmRleE9mKHBlcm0uYXR0cikgPT09IC0xKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB1c2VySXRlbXMuZm9yRWFjaCgocGVybTogT1Blcm1pc3Npb25zKSA9PiB7XG4gICAgICBjb25zdCBvcHRpb24gPSBvVGFibGVPcHRpb25zLmZpbmQoKG9UYWJsZU9wdGlvbjogT1RhYmxlT3B0aW9uQ29tcG9uZW50KSA9PiBvVGFibGVPcHRpb24ub2F0dHIgPT09IHBlcm0uYXR0cik7XG4gICAgICBzZWxmLnNldFBlcm1pc3Npb25zVG9PVGFibGVPcHRpb24ocGVybSwgb3B0aW9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRQZXJtaXNzaW9uc1RvT1RhYmxlT3B0aW9uKHBlcm06IE9QZXJtaXNzaW9ucywgb3B0aW9uOiBPVGFibGVPcHRpb25Db21wb25lbnQpIHtcbiAgICBpZiAocGVybS52aXNpYmxlID09PSBmYWxzZSAmJiBvcHRpb24pIHtcbiAgICAgIG9wdGlvbi5lbFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZSgpO1xuICAgIH0gZWxzZSBpZiAocGVybS5lbmFibGVkID09PSBmYWxzZSAmJiBvcHRpb24pIHtcbiAgICAgIG9wdGlvbi5lbmFibGVkID0gZmFsc2U7XG4gICAgICBjb25zdCBidXR0b25FTCA9IG9wdGlvbi5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgICAgY29uc3Qgb2JzID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGJ1dHRvbkVMKTtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBlcm1pc3Npb25CeUF0dHIoYXR0cjogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbXM6IE9QZXJtaXNzaW9uc1tdID0gdGhpcy5wZXJtaXNzaW9ucy5pdGVtcyB8fCBbXTtcbiAgICByZXR1cm4gaXRlbXMuZmluZCgocGVybTogT1Blcm1pc3Npb25zKSA9PiBwZXJtLmF0dHIgPT09IGF0dHIpO1xuICB9XG5cbiAgZ2V0IGlzU2VsZWN0QWxsT3B0aW9uQWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGU7XG4gIH1cblxuICBnZXQgc2hvd1NlbGVjdEFsbENoZWNrYm94KCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5zZWxlY3RBbGxDaGVja2JveCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ3NlbGVjdC1hbGwtY2hlY2tib3gnKTtcbiAgICByZXR1cm4gdGhpcy5zaG93RmlsdGVyT3B0aW9uICYmICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCByb3dIZWlnaHRPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUucm93SGVpZ2h0T2JzZXJ2YWJsZTtcbiAgfVxuICBnZXQgZW5hYmxlZFNlbGVjdEFsbENoZWNrYm94KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignc2VsZWN0LWFsbC1jaGVja2JveCcpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd0V4cG9ydEJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuZXhwb3J0QnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZXhwb3J0Jyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBlbmFibGVkRXhwb3J0QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZXhwb3J0Jyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93Q29sdW1uc1Zpc2liaWxpdHlCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignc2hvdy1oaWRlLWNvbHVtbnMnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWRDb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ3Nob3ctaGlkZS1jb2x1bW5zJyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93RmlsdGVyTWVudSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2ZpbHRlcicpO1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJPcHRpb24gJiYgIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWRGaWx0ZXJNZW51KCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZmlsdGVyJyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93Q29uZmlndXJhdGlvbk1lbnUoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdjb25maWd1cmF0aW9uJyk7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0NvbmZpZ3VyYXRpb25PcHRpb24gJiYgIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IGVuYWJsZWRDb25maWd1cmF0aW9uTWVudSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2NvbmZpZ3VyYXRpb24nKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgb25TaG93c1NlbGVjdHMoKSB7XG4gICAgY29uc3QgdGFibGVPcHRpb25zID0gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zO1xuICAgIHRhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSA9ICF0YWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGU7XG4gICAgdGhpcy50YWJsZS5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgfVxuXG4gIG9uRXhwb3J0QnV0dG9uQ2xpY2tlZCgpIHtcbiAgICBjb25zdCB0YWJsZU9wdGlvbnMgPSB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnM7XG4gICAgY29uc3QgZXhwb3J0Q25mZzogT1RhYmxlRXhwb3J0Q29uZmlndXJhdGlvbiA9IG5ldyBPVGFibGVFeHBvcnRDb25maWd1cmF0aW9uKCk7XG5cbiAgICAvLyBnZXQgY29sdW1uJ3MgYXR0ciB3aG9zZSByZW5kZXJlciBpcyBPVGFibGVDZWxsUmVuZGVyZXJJbWFnZUNvbXBvbmVudFxuICAgIGNvbnN0IGNvbHNOb3RJbmNsdWRlZDogc3RyaW5nW10gPSB0YWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIoYyA9PiB2b2lkIDAgIT09IGMucmVuZGVyZXIgJiYgYy5yZW5kZXJlciBpbnN0YW5jZW9mIE9UYWJsZUNlbGxSZW5kZXJlckltYWdlQ29tcG9uZW50KS5tYXAoYyA9PiBjLmF0dHIpO1xuICAgIGNvbHNOb3RJbmNsdWRlZC5wdXNoKENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCk7XG5cbiAgICAvLyBUYWJsZSBkYXRhL2ZpbHRlcnNcbiAgICBzd2l0Y2ggKHRoaXMudGFibGUuZXhwb3J0TW9kZSkge1xuICAgICAgY2FzZSBDb2Rlcy5FWFBPUlRfTU9ERV9BTEw6XG4gICAgICAgIGV4cG9ydENuZmcuZmlsdGVyID0gdGhpcy50YWJsZS5nZXRDb21wb25lbnRGaWx0ZXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLkVYUE9SVF9NT0RFX0xPQ0FMOlxuICAgICAgICBleHBvcnRDbmZnLmRhdGEgPSB0aGlzLnRhYmxlLmdldEFsbFJlbmRlcmVkVmFsdWVzKCk7XG4gICAgICAgIGNvbHNOb3RJbmNsdWRlZC5mb3JFYWNoKGF0dHIgPT4gZXhwb3J0Q25mZy5kYXRhLmZvckVhY2gocm93ID0+IGRlbGV0ZSByb3dbYXR0cl0pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBleHBvcnRDbmZnLmRhdGEgPSB0aGlzLnRhYmxlLmdldFJlbmRlcmVkVmFsdWUoKTtcbiAgICAgICAgY29sc05vdEluY2x1ZGVkLmZvckVhY2goYXR0ciA9PiBleHBvcnRDbmZnLmRhdGEuZm9yRWFjaChyb3cgPT4gZGVsZXRlIHJvd1thdHRyXSkpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgZXhwb3J0Q25mZy5tb2RlID0gdGhpcy50YWJsZS5leHBvcnRNb2RlO1xuICAgIGV4cG9ydENuZmcuZW50aXR5ID0gdGhpcy50YWJsZS5lbnRpdHk7XG5cbiAgICAvLyBUYWJsZSBjb2x1bW5zXG4gICAgZXhwb3J0Q25mZy5jb2x1bW5zID0gdGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmZpbHRlcihjID0+IGNvbHNOb3RJbmNsdWRlZC5pbmRleE9mKGMpID09PSAtMSk7XG4gICAgLy8gVGFibGUgY29sdW1uIG5hbWVzXG4gICAgY29uc3QgdGFibGVDb2x1bW5OYW1lcyA9IHt9O1xuICAgIHRhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5maWx0ZXIoYyA9PiBjb2xzTm90SW5jbHVkZWQuaW5kZXhPZihjKSA9PT0gLTEpLmZvckVhY2goYyA9PiB7XG4gICAgICBjb25zdCBvQ29sdW1uID0gdGFibGVPcHRpb25zLmNvbHVtbnMuZmluZChvYyA9PiBvYy5hdHRyID09PSBjKTtcbiAgICAgIHRhYmxlQ29sdW1uTmFtZXNbY10gPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KG9Db2x1bW4udGl0bGUgPyBvQ29sdW1uLnRpdGxlIDogb0NvbHVtbi5hdHRyKTtcbiAgICB9KTtcbiAgICBleHBvcnRDbmZnLmNvbHVtbk5hbWVzID0gdGFibGVDb2x1bW5OYW1lcztcbiAgICAvLyBUYWJsZSBjb2x1bW4gc3FsVHlwZXNcbiAgICBleHBvcnRDbmZnLnNxbFR5cGVzID0gdGhpcy50YWJsZS5nZXRTcWxUeXBlcygpO1xuICAgIC8vIFRhYmxlIHNlcnZpY2UsIG5lZWRlZCBmb3IgY29uZmlndXJpbmcgb250aW1pemUgZXhwb3J0IHNlcnZpY2Ugd2l0aCB0YWJsZSBzZXJ2aWNlIGNvbmZpZ3VyYXRpb25cbiAgICBleHBvcnRDbmZnLnNlcnZpY2UgPSB0aGlzLnRhYmxlLnNlcnZpY2U7XG4gICAgZXhwb3J0Q25mZy5zZXJ2aWNlVHlwZSA9IHRoaXMudGFibGUuZXhwb3J0U2VydmljZVR5cGU7XG4gICAgZXhwb3J0Q25mZy52aXNpYmxlQnV0dG9ucyA9IHRoaXMudGFibGUudmlzaWJsZUV4cG9ydERpYWxvZ0J1dHRvbnM7XG4gICAgZXhwb3J0Q25mZy5vcHRpb25zID0gdGhpcy50YWJsZS5leHBvcnRPcHRzVGVtcGxhdGU7XG5cbiAgICB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZUV4cG9ydERpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogZXhwb3J0Q25mZyxcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHBhbmVsQ2xhc3M6IFsnby1kaWFsb2ctY2xhc3MnLCAnby10YWJsZS1kaWFsb2cnXVxuICAgIH0pO1xuICB9XG5cbiAgb25DaGFuZ2VDb2x1bW5zVmlzaWJpbGl0eUNsaWNrZWQoKSB7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVWaXNpYmxlQ29sdW1uc0RpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YToge1xuICAgICAgICB2aXNpYmxlQ29sdW1uczogVXRpbC5wYXJzZUFycmF5KHRoaXMudGFibGUudmlzaWJsZUNvbHVtbnMsIHRydWUpLFxuICAgICAgICBjb2x1bW5zRGF0YTogdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLmNvbHVtbnMsXG4gICAgICAgIHJvd0hlaWdodDogdGhpcy50YWJsZS5yb3dIZWlnaHRcbiAgICAgIH0sXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcblxuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnRhYmxlLnZpc2libGVDb2xBcnJheSA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRWaXNpYmxlQ29sdW1ucygpO1xuICAgICAgICBjb25zdCBjb2x1bW5zT3JkZXIgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0Q29sdW1uc09yZGVyKCk7XG4gICAgICAgIHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5jb2x1bW5zLnNvcnQoKGE6IE9Db2x1bW4sIGI6IE9Db2x1bW4pID0+IGNvbHVtbnNPcmRlci5pbmRleE9mKGEuYXR0cikgLSBjb2x1bW5zT3JkZXIuaW5kZXhPZihiLmF0dHIpKTtcbiAgICAgICAgdGhpcy50YWJsZS5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIHRoaXMudGFibGUucmVmcmVzaENvbHVtbnNXaWR0aCgpO1xuICAgICAgICB0aGlzLnRhYmxlLm9uVmlzaWJsZUNvbHVtbnNDaGFuZ2UuZW1pdCh0aGlzLnRhYmxlLnZpc2libGVDb2xBcnJheSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvbkZpbHRlckJ5Q29sdW1uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uICYmIHRoaXMudGFibGUuZGF0YVNvdXJjZS5pc0NvbHVtblZhbHVlRmlsdGVyQWN0aXZlKCkpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuQ09ORklSTV9ESVNDQVJEX0ZJTFRFUl9CWV9DT0xVTU4nKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICBzZWxmLnRhYmxlLmNsZWFyQ29sdW1uRmlsdGVycygpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9ICFyZXM7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50YWJsZS5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gIXRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbjtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25TdG9yZUZpbHRlckNsaWNrZWQoKTogdm9pZCB7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVTdG9yZUZpbHRlckRpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZEZpbHRlcnMoKS5tYXAoZmlsdGVyID0+IGZpbHRlci5uYW1lKSxcbiAgICAgIHdpZHRoOiAnY2FsYygoNzVlbSAtIDEwMCUpICogMTAwMCknLFxuICAgICAgbWF4V2lkdGg6ICc2NXZ3JyxcbiAgICAgIG1pbldpZHRoOiAnMzB2dycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tdGFibGUtZGlhbG9nJ11cbiAgICB9KTtcblxuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2Uuc3RvcmVGaWx0ZXIoZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldEZpbHRlckF0dHJpYnV0ZXMoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25Mb2FkRmlsdGVyQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZUxvYWRGaWx0ZXJEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IHRoaXMudGFibGUub1RhYmxlU3RvcmFnZS5nZXRTdG9yZWRGaWx0ZXJzKCksXG4gICAgICB3aWR0aDogJ2NhbGMoKDc1ZW0gLSAxMDAlKSAqIDEwMDApJyxcbiAgICAgIG1heFdpZHRoOiAnNjV2dycsXG4gICAgICBtaW5XaWR0aDogJzMwdncnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG5cbiAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2Uub25EZWxldGUuc3Vic2NyaWJlKGZpbHRlck5hbWUgPT4gdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmRlbGV0ZVN0b3JlZEZpbHRlcihmaWx0ZXJOYW1lKSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRmlsdGVyTmFtZTogc3RyaW5nID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFNlbGVjdGVkRmlsdGVyTmFtZSgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRGaWx0ZXJOYW1lKSB7XG4gICAgICAgICAgY29uc3Qgc3RvcmVkRmlsdGVyID0gdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZEZpbHRlckNvbmYoc2VsZWN0ZWRGaWx0ZXJOYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmVkRmlsdGVyKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnNldEZpbHRlcnNDb25maWd1cmF0aW9uKHN0b3JlZEZpbHRlcik7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9uQ2xlYXJGaWx0ZXJDbGlja2VkKCk6IHZvaWQge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ1RBQkxFLkRJQUxPRy5DT05GSVJNX0NMRUFSX0ZJTFRFUicpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy50YWJsZS5jbGVhckZpbHRlcnMoKTtcbiAgICAgICAgdGhpcy50YWJsZS5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25TdG9yZUNvbmZpZ3VyYXRpb25DbGlja2VkKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlU3RvcmVDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICB3aWR0aDogJ2NhbGMoKDc1ZW0gLSAxMDAlKSAqIDEwMDApJyxcbiAgICAgIG1heFdpZHRoOiAnNjV2dycsXG4gICAgICBtaW5XaWR0aDogJzMwdncnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25EYXRhID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldENvbmZpZ3VyYXRpb25BdHRyaWJ1dGVzKCk7XG4gICAgICAgIGNvbnN0IHRhYmxlUHJvcGVydGllcyA9IGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRTZWxlY3RlZFRhYmxlUHJvcGVydGllcygpO1xuICAgICAgICBzZWxmLnRhYmxlLm9UYWJsZVN0b3JhZ2Uuc3RvcmVDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25EYXRhLCB0YWJsZVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uQXBwbHlDb25maWd1cmF0aW9uQ2xpY2tlZCgpOiB2b2lkIHtcbiAgICBjb25zdCBkaWFsb2dSZWYgPSB0aGlzLmRpYWxvZy5vcGVuKE9UYWJsZUFwcGx5Q29uZmlndXJhdGlvbkRpYWxvZ0NvbXBvbmVudCwge1xuICAgICAgZGF0YTogdGhpcy50YWJsZS5vVGFibGVTdG9yYWdlLmdldFN0b3JlZENvbmZpZ3VyYXRpb25zKCksXG4gICAgICB3aWR0aDogJ2NhbGMoKDc1ZW0gLSAxMDAlKSAqIDEwMDApJyxcbiAgICAgIG1heFdpZHRoOiAnNjV2dycsXG4gICAgICBtaW5XaWR0aDogJzMwdncnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLm9uRGVsZXRlLnN1YnNjcmliZShjb25maWd1cmF0aW9uTmFtZSA9PiB0aGlzLnRhYmxlLm9UYWJsZVN0b3JhZ2UuZGVsZXRlU3RvcmVkQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uTmFtZSkpO1xuICAgIGRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCAmJiBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuaXNEZWZhdWx0Q29uZmlndXJhdGlvblNlbGVjdGVkKCkpIHtcbiAgICAgICAgc2VsZi50YWJsZS5hcHBseURlZmF1bHRDb25maWd1cmF0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKHJlc3VsdCkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZENvbmZpZ3VyYXRpb25OYW1lOiBzdHJpbmcgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0U2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSgpO1xuICAgICAgICBpZiAoc2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSkge1xuICAgICAgICAgIHNlbGYudGFibGUuYXBwbHlDb25maWd1cmF0aW9uKHNlbGVjdGVkQ29uZmlndXJhdGlvbk5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufVxuIl19