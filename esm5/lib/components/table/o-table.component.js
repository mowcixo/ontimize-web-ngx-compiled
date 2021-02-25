import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, HostListener, Inject, Injector, Optional, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatTab, MatTabGroup } from '@angular/material';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BooleanConverter, InputConverter } from '../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../services/factories';
import { SnackBarService } from '../../services/snackbar.service';
import { ColumnValueFilterOperator } from '../../types/o-column-value-filter.type';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { PermissionsUtils } from '../../util/permissions';
import { ServiceUtils } from '../../util/service.utils';
import { SQLTypes } from '../../util/sqltypes';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { DEFAULT_INPUTS_O_SERVICE_COMPONENT, OServiceComponent } from '../o-service-component.class';
import { OColumn } from './column/o-column.class';
import { DefaultOTableOptions } from './extensions/default-o-table-options.class';
import { OTableFilterByColumnDataDialogComponent } from './extensions/dialog/filter-by-column/o-table-filter-by-column-data-dialog.component';
import { OBaseTablePaginator } from './extensions/footer/paginator/o-base-table-paginator.class';
import { OTableOptionComponent } from './extensions/header/table-option/o-table-option.component';
import { OTableDataSourceService } from './extensions/o-table-datasource.service';
import { OTableStorage } from './extensions/o-table-storage.class';
import { OTableDao } from './extensions/o-table.dao';
import { OMatSort } from './extensions/sort/o-mat-sort';
import { OMatSortHeader } from './extensions/sort/o-mat-sort-header';
export var DEFAULT_INPUTS_O_TABLE = tslib_1.__spread(DEFAULT_INPUTS_O_SERVICE_COMPONENT, [
    'visibleColumns: visible-columns',
    'sortColumns: sort-columns',
    'quickFilterCallback: quick-filter-function',
    'deleteButton: delete-button',
    'refreshButton: refresh-button',
    'columnsVisibilityButton: columns-visibility-button',
    'exportButton: export-button',
    'showConfigurationOption: show-configuration-option',
    'showButtonsText: show-buttons-text',
    'selectAllCheckbox: select-all-checkbox',
    'paginationControls: pagination-controls',
    'fixedHeader: fixed-header',
    'showTitle: show-title',
    'editionMode: edition-mode',
    'selectionMode: selection-mode',
    'horizontalScroll: horizontal-scroll',
    'showPaginatorFirstLastButtons: show-paginator-first-last-buttons',
    'autoAlignTitles: auto-align-titles',
    'multipleSort: multiple-sort',
    'selectAllCheckboxVisible: select-all-checkbox-visible',
    'orderable',
    'resizable',
    'enabled',
    'keepSelectedItems: keep-selected-items',
    'exportMode: export-mode',
    'exportServiceType: export-service-type',
    'autoAdjust: auto-adjust',
    'showFilterOption: show-filter-option',
    'visibleExportDialogButtons: visible-export-dialog-buttons',
    'rowClass: row-class'
]);
export var DEFAULT_OUTPUTS_O_TABLE = [
    'onClick',
    'onDoubleClick',
    'onRowSelected',
    'onRowDeselected',
    'onRowDeleted',
    'onDataLoaded',
    'onPaginatedDataLoaded'
];
var OTableComponent = (function (_super) {
    tslib_1.__extends(OTableComponent, _super);
    function OTableComponent(injector, elRef, dialog, form) {
        var _this = _super.call(this, injector, elRef, form) || this;
        _this.dialog = dialog;
        _this.selectAllCheckbox = false;
        _this.exportButton = true;
        _this.showConfigurationOption = true;
        _this.columnsVisibilityButton = true;
        _this.showFilterOption = true;
        _this.showButtonsText = true;
        _this.filterCaseSensitivePvt = false;
        _this.insertButton = true;
        _this.refreshButton = true;
        _this.deleteButton = true;
        _this.paginationControls = true;
        _this.fixedHeader = false;
        _this.showTitle = false;
        _this.editionMode = Codes.DETAIL_MODE_NONE;
        _this.selectionMode = Codes.SELECTION_MODE_MULTIPLE;
        _this.horizontalScroll = false;
        _this.showPaginatorFirstLastButtons = true;
        _this.autoAlignTitles = false;
        _this.multipleSort = true;
        _this.orderable = true;
        _this.resizable = true;
        _this.autoAdjust = true;
        _this._enabled = true;
        _this.keepSelectedItems = true;
        _this.exportMode = Codes.EXPORT_MODE_VISIBLE;
        _this._visibleColArray = [];
        _this.sortColArray = [];
        _this.pendingQuery = false;
        _this.pendingQueryFilter = undefined;
        _this.setStaticData = false;
        _this.avoidQueryColumns = [];
        _this.asyncLoadColumns = [];
        _this.asyncLoadSubscriptions = {};
        _this.finishQuerySubscription = false;
        _this.onClick = new EventEmitter();
        _this.onDoubleClick = new EventEmitter();
        _this.onRowSelected = new EventEmitter();
        _this.onRowDeselected = new EventEmitter();
        _this.onRowDeleted = new EventEmitter();
        _this.onDataLoaded = new EventEmitter();
        _this.onPaginatedDataLoaded = new EventEmitter();
        _this.onReinitialize = new EventEmitter();
        _this.onContentChange = new EventEmitter();
        _this.onVisibleColumnsChange = new EventEmitter();
        _this.showFilterByColumnIcon = false;
        _this.showTotalsSubject = new BehaviorSubject(false);
        _this.showTotals = _this.showTotalsSubject.asObservable();
        _this.loadingSortingSubject = new BehaviorSubject(false);
        _this.loadingSorting = _this.loadingSortingSubject.asObservable();
        _this.loadingScrollSubject = new BehaviorSubject(false);
        _this.loadingScroll = _this.loadingScrollSubject.asObservable();
        _this.showFirstInsertableRow = false;
        _this.showLastInsertableRow = false;
        _this.clickDelay = 200;
        _this.clickPrevent = false;
        _this._currentPage = 0;
        _this.onUpdateScrolledState = new EventEmitter();
        _this.storePaginationState = false;
        _this.pageScrollVirtual = 1;
        _this._oTableOptions = new DefaultOTableOptions();
        _this._oTableOptions.selectColumn = _this.createOColumn();
        try {
            _this.tabGroupContainer = _this.injector.get(MatTabGroup);
            _this.tabContainer = _this.injector.get(MatTab);
        }
        catch (error) {
        }
        _this.snackBarService = _this.injector.get(SnackBarService);
        _this.oTableStorage = new OTableStorage(_this);
        return _this;
    }
    Object.defineProperty(OTableComponent.prototype, "diameterSpinner", {
        get: function () {
            var minHeight = OTableComponent.DEFAULT_BASE_SIZE_SPINNER;
            var height = 0;
            if (this.spinnerContainer && this.spinnerContainer.nativeElement) {
                height = this.spinnerContainer.nativeElement.offsetHeight;
            }
            if (height > 0 && height <= 100) {
                return Math.floor(height - (height * 0.1));
            }
            else {
                return minHeight;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "oTableOptions", {
        get: function () {
            return this._oTableOptions;
        },
        set: function (value) {
            this._oTableOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "quickFilter", {
        get: function () {
            return this._quickFilter;
        },
        set: function (value) {
            value = Util.parseBoolean(String(value));
            this._quickFilter = value;
            this._oTableOptions.filter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "filterCaseSensitive", {
        get: function () {
            return this.filterCaseSensitivePvt;
        },
        set: function (value) {
            this.filterCaseSensitivePvt = BooleanConverter(value);
            if (this._oTableOptions) {
                this._oTableOptions.filterCaseSensitive = this.filterCaseSensitivePvt;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (val) {
            val = Util.parseBoolean(String(val));
            this._enabled = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "selectAllCheckboxVisible", {
        get: function () {
            return this._selectAllCheckboxVisible;
        },
        set: function (value) {
            this._selectAllCheckboxVisible = BooleanConverter(this.state['select-column-visible']) || BooleanConverter(value);
            this._oTableOptions.selectColumn.visible = this._selectAllCheckboxVisible;
            this.initializeCheckboxColumn();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "visibleColArray", {
        get: function () {
            return this._visibleColArray;
        },
        set: function (arg) {
            var permissionsBlocked = this.permissions ? this.permissions.columns.filter(function (col) { return col.visible === false; }).map(function (col) { return col.attr; }) : [];
            var permissionsChecked = arg.filter(function (value) { return permissionsBlocked.indexOf(value) === -1; });
            this._visibleColArray = permissionsChecked;
            if (this._oTableOptions) {
                var containsSelectionCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_SELECT) !== -1;
                if (containsSelectionCol) {
                    this._visibleColArray.unshift(Codes.NAME_COLUMN_SELECT);
                }
                this._oTableOptions.visibleColumns = this._visibleColArray;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "currentPage", {
        get: function () {
            return this._currentPage;
        },
        set: function (val) {
            this._currentPage = val;
            if (this.paginator) {
                this.paginator.pageIndex = val;
                if (this.matpaginator) {
                    this.matpaginator.pageIndex = val;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    OTableComponent.prototype.updateScrolledState = function () {
        var _this = this;
        if (this.horizontalScroll) {
            setTimeout(function () {
                var bodyWidth = _this.tableBodyEl.nativeElement.clientWidth;
                var scrollWidth = _this.tableBodyEl.nativeElement.scrollWidth;
                var previousState = _this.horizontalScrolled;
                _this.horizontalScrolled = scrollWidth > bodyWidth;
                if (previousState !== _this.horizontalScrolled) {
                    _this.onUpdateScrolledState.emit(_this.horizontalScrolled);
                }
            }, 0);
        }
        this.refreshColumnsWidth();
    };
    OTableComponent.prototype.ngOnInit = function () {
        this.initialize();
    };
    OTableComponent.prototype.ngAfterViewInit = function () {
        this.afterViewInit();
        this.initTableAfterViewInit();
        if (this.oTableMenu) {
            this.matMenu = this.oTableMenu.matMenu;
            this.oTableMenu.registerOptions(this.tableOptions.toArray());
        }
        if (this.oTableButtons) {
            this.oTableButtons.registerButtons(this.tableButtons.toArray());
        }
    };
    OTableComponent.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    OTableComponent.prototype.getSuffixColumnInsertable = function () {
        return Codes.SUFFIX_COLUMN_INSERTABLE;
    };
    OTableComponent.prototype.getActionsPermissions = function () {
        return this.permissions ? (this.permissions.actions || []) : [];
    };
    OTableComponent.prototype.getMenuPermissions = function () {
        var result = this.permissions ? this.permissions.menu : undefined;
        return result ? result : {
            visible: true,
            enabled: true,
            items: []
        };
    };
    OTableComponent.prototype.getOColumnPermissions = function (attr) {
        var columns = this.permissions ? (this.permissions.columns || []) : [];
        return columns.find(function (comp) { return comp.attr === attr; }) || { attr: attr, enabled: true, visible: true };
    };
    OTableComponent.prototype.getActionPermissions = function (attr) {
        var actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
        var permissions = actionsPerm.find(function (p) { return p.attr === attr; });
        return permissions || {
            attr: attr,
            visible: true,
            enabled: true
        };
    };
    OTableComponent.prototype.checkEnabledActionPermission = function (attr) {
        var actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
        var permissions = actionsPerm.find(function (p) { return p.attr === attr; });
        var enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
        if (!enabledPermision) {
            this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
        }
        return enabledPermision;
    };
    OTableComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this._oTableOptions = new DefaultOTableOptions();
        if (this.tabGroupContainer && this.tabContainer) {
            this.registerTabListener();
        }
        this.initializeParams();
        this.initializeDao();
        this.permissions = this.permissionsService.getTablePermissions(this.oattr, this.actRoute);
    };
    OTableComponent.prototype.initializeDao = function () {
        var queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        var methods = {
            query: queryMethodName,
            update: this.updateMethod,
            delete: this.deleteMethod,
            insert: this.insertMethod
        };
        if (this.staticData) {
            this.queryOnBind = false;
            this.queryOnInit = false;
            this.daoTable = new OTableDao(undefined, this.entity, methods);
            this.setDataArray(this.staticData);
        }
        else {
            this.configureService();
            this.daoTable = new OTableDao(this.dataService, this.entity, methods);
        }
    };
    OTableComponent.prototype.reinitialize = function (options) {
        if (options) {
            var clonedOpts = Object.assign({}, options);
            if (clonedOpts.hasOwnProperty('entity')) {
                this.entity = clonedOpts.entity;
            }
            if (clonedOpts.hasOwnProperty('service')) {
                this.service = clonedOpts.service;
            }
            if (clonedOpts.hasOwnProperty('columns')) {
                this.columns = clonedOpts.columns;
            }
            if (clonedOpts.hasOwnProperty('visibleColumns')) {
                this.visibleColumns = clonedOpts.visibleColumns;
            }
            if (clonedOpts.hasOwnProperty('keys')) {
                this.keys = clonedOpts.keys;
            }
            if (clonedOpts.hasOwnProperty('sortColumns')) {
                this.sortColumns = clonedOpts.sortColumns;
            }
            if (clonedOpts.hasOwnProperty('parentKeys')) {
                this.parentKeys = clonedOpts.parentKeys;
            }
        }
        this.destroy();
        this.initialize();
        this.oTableStorage.reset();
        this.initTableAfterViewInit();
        this.onReinitialize.emit(null);
    };
    OTableComponent.prototype.initTableAfterViewInit = function () {
        this.parseVisibleColumns();
        this.setDatasource();
        this.registerDataSourceListeners();
        this.parseSortColumns();
        this.registerSortListener();
        this.setFiltersConfiguration(this.state);
        this.addDefaultRowButtons();
        if (this.queryOnInit) {
            this.queryData();
        }
    };
    OTableComponent.prototype.destroy = function () {
        var _this = this;
        _super.prototype.destroy.call(this);
        if (this.tabGroupChangeSubscription) {
            this.tabGroupChangeSubscription.unsubscribe();
        }
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }
        if (this.sortSubscription) {
            this.sortSubscription.unsubscribe();
        }
        if (this.onRenderedDataChange) {
            this.onRenderedDataChange.unsubscribe();
        }
        if (this.contextMenuSubscription) {
            this.contextMenuSubscription.unsubscribe();
        }
        Object.keys(this.asyncLoadSubscriptions).forEach(function (idx) {
            if (_this.asyncLoadSubscriptions[idx]) {
                _this.asyncLoadSubscriptions[idx].unsubscribe();
            }
        });
    };
    OTableComponent.prototype.getDataToStore = function () {
        return this.oTableStorage.getDataToStore();
    };
    OTableComponent.prototype.registerQuickFilter = function (arg) {
        var quickFilter = arg;
        this.quickFilterComponent = undefined;
        this.oTableQuickFilterComponent = quickFilter;
        this.oTableQuickFilterComponent.setValue(this.state.filter, false);
    };
    OTableComponent.prototype.registerPagination = function (value) {
        this.paginationControls = true;
        this.paginator = value;
    };
    OTableComponent.prototype.registerContextMenu = function (value) {
        var _this = this;
        this.tableContextMenu = value;
        this.contextMenuSubscription = this.tableContextMenu.onShow.subscribe(function (params) {
            params.class = 'o-table-context-menu ' + _this.rowHeight;
            if (params.data && !_this.selection.isSelected(params.data.rowValue)) {
                _this.clearSelection();
                _this.selectedRow(params.data.rowValue);
            }
        });
    };
    OTableComponent.prototype.registerDefaultColumn = function (column) {
        if (Util.isDefined(this.getOColumn(column))) {
            return;
        }
        var colDef = this.createOColumn(column, this);
        this.pushOColumnDefinition(colDef);
    };
    OTableComponent.prototype.registerColumn = function (column) {
        var columnAttr = (typeof column === 'string') ? column : column.attr;
        var columnPermissions = this.getOColumnPermissions(columnAttr);
        if (!columnPermissions.visible) {
            return;
        }
        if (typeof column === 'string') {
            this.registerDefaultColumn(column);
            return;
        }
        var columnDef = this.getOColumn(column.attr);
        if (Util.isDefined(columnDef) && Util.isDefined(columnDef.definition)) {
            return;
        }
        var colDef = this.createOColumn(column.attr, this, column);
        var columnWidth = column.width;
        var storedCols = this.state['oColumns-display'];
        if (Util.isDefined(storedCols)) {
            var storedData_1 = storedCols.find(function (oCol) { return oCol.attr === colDef.attr; });
            if (Util.isDefined(storedData_1) && Util.isDefined(storedData_1.width)) {
                if (this.state.hasOwnProperty('initial-configuration')) {
                    if (this.state['initial-configuration'].hasOwnProperty('oColumns-display')) {
                        var initialStoredCols = this.state['initial-configuration']['oColumns-display'];
                        initialStoredCols.forEach(function (element) {
                            if (colDef.attr === element.attr && element.width === colDef.definition.originalWidth) {
                                columnWidth = storedData_1.width;
                            }
                        });
                    }
                    else {
                        columnWidth = storedData_1.width;
                    }
                }
            }
        }
        if (Util.isDefined(columnWidth)) {
            colDef.width = columnWidth;
        }
        if (column && (column.asyncLoad || column.type === 'action')) {
            this.avoidQueryColumns.push(column.attr);
            if (column.asyncLoad) {
                this.asyncLoadColumns.push(column.attr);
            }
        }
        this.pushOColumnDefinition(colDef);
    };
    OTableComponent.prototype.pushOColumnDefinition = function (colDef) {
        colDef.visible = (this._visibleColArray.indexOf(colDef.attr) !== -1);
        var alreadyExisting = this.getOColumn(colDef.attr);
        if (alreadyExisting !== undefined) {
            var replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
            this._oTableOptions.columns[replacingIndex] = colDef;
        }
        else {
            this._oTableOptions.columns.push(colDef);
        }
        this.refreshEditionModeWarn();
    };
    OTableComponent.prototype.refreshEditionModeWarn = function () {
        if (this.editionMode !== Codes.DETAIL_MODE_NONE) {
            return;
        }
        var editableColumns = this._oTableOptions.columns.filter(function (col) {
            return Util.isDefined(col.editor);
        });
        if (editableColumns.length > 0) {
            console.warn('Using a column with a editor but there is no edition-mode defined');
        }
    };
    OTableComponent.prototype.registerColumnAggregate = function (column) {
        this.showTotalsSubject.next(true);
        var alreadyExisting = this.getOColumn(column.attr);
        if (alreadyExisting !== undefined) {
            var replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
            this._oTableOptions.columns[replacingIndex].aggregate = column;
        }
    };
    OTableComponent.prototype.parseVisibleColumns = function () {
        var _this = this;
        if (this.state.hasOwnProperty('oColumns-display')) {
            var stateCols_1 = [];
            this.state['oColumns-display'].forEach(function (oCol, index) {
                var isVisibleColInColumns = _this._oTableOptions.columns.find(function (col) { return col.attr === oCol.attr; }) !== undefined;
                if (isVisibleColInColumns) {
                    stateCols_1.push(oCol);
                }
                else {
                    console.warn('Unable to load the column ' + oCol.attr + ' from the localstorage');
                }
            });
            stateCols_1 = this.checkChangesVisibleColummnsInInitialConfiguration(stateCols_1);
            this.visibleColArray = stateCols_1.filter(function (item) { return item.visible; }).map(function (item) { return item.attr; });
        }
        else {
            this.visibleColArray = Util.parseArray(this.visibleColumns, true);
            this._oTableOptions.columns.sort(function (a, b) { return _this.visibleColArray.indexOf(a.attr) - _this.visibleColArray.indexOf(b.attr); });
        }
    };
    OTableComponent.prototype.checkChangesVisibleColummnsInInitialConfiguration = function (stateCols) {
        var _this = this;
        if (this.state.hasOwnProperty('initial-configuration')) {
            if (this.state['initial-configuration'].hasOwnProperty('oColumns-display')) {
                var originalVisibleColArray = this.state['initial-configuration']['oColumns-display'].map(function (x) {
                    if (x.visible === true) {
                        return x.attr;
                    }
                });
                var visibleColArray = Util.parseArray(this.visibleColumns, true);
                var colToAddInVisibleCol_1 = Util.differenceArrays(visibleColArray, originalVisibleColArray);
                if (colToAddInVisibleCol_1.length > 0) {
                    colToAddInVisibleCol_1.forEach(function (colAdd, index) {
                        if (stateCols.filter(function (col) { return col.attr === colAdd; }).length > 0) {
                            stateCols = stateCols.map(function (col) {
                                if (colToAddInVisibleCol_1.indexOf(col.attr) > -1) {
                                    col.visible = true;
                                }
                                return col;
                            });
                        }
                        else {
                            _this.colArray.forEach(function (element, i) {
                                if (element === colAdd) {
                                    stateCols.splice(i + 1, 0, {
                                        attr: colAdd,
                                        visible: true,
                                        width: undefined
                                    });
                                }
                            });
                        }
                    });
                }
                var colToDeleteInVisibleCol_1 = Util.differenceArrays(originalVisibleColArray, visibleColArray);
                if (colToDeleteInVisibleCol_1.length > 0) {
                    stateCols = stateCols.map(function (col) {
                        if (colToDeleteInVisibleCol_1.indexOf(col.attr) > -1) {
                            col.visible = false;
                        }
                        return col;
                    });
                }
            }
        }
        return stateCols;
    };
    OTableComponent.prototype.parseSortColumns = function () {
        var _this = this;
        var sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
        this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
        if (this.state['sort-columns'] && this.state['initial-configuration']['sort-columns']) {
            var initialConfigSortColumnsArray = ServiceUtils.parseSortColumns(this.state['initial-configuration']['sort-columns']);
            var originalSortColumnsArray = ServiceUtils.parseSortColumns(this.sortColumns);
            var colToAddInVisibleCol = Util.differenceArrays(originalSortColumnsArray, initialConfigSortColumnsArray);
            if (colToAddInVisibleCol.length > 0) {
                colToAddInVisibleCol.forEach(function (colAdd) {
                    _this.sortColArray.push(colAdd);
                });
            }
            var colToDelInVisibleCol = Util.differenceArrays(initialConfigSortColumnsArray, originalSortColumnsArray);
            if (colToDelInVisibleCol.length > 0) {
                colToDelInVisibleCol.forEach(function (colDel) {
                    _this.sortColArray.forEach(function (col, i) {
                        if (col.columnName === colDel.columnName) {
                            _this.sortColArray.splice(i, 1);
                        }
                    });
                });
            }
        }
        for (var i = this.sortColArray.length - 1; i >= 0; i--) {
            var colName = this.sortColArray[i].columnName;
            var oCol = this.getOColumn(colName);
            if (!Util.isDefined(oCol) || !oCol.orderable) {
                this.sortColArray.splice(i, 1);
            }
        }
    };
    OTableComponent.prototype.initializeParams = function () {
        var _this = this;
        if (!this.visibleColumns) {
            this.visibleColumns = this.columns;
        }
        if (this.colArray.length) {
            this.colArray.forEach(function (x) { return _this.registerColumn(x); });
            var columnsOrder_1 = [];
            if (this.state.hasOwnProperty('oColumns-display')) {
                columnsOrder_1 = this.state['oColumns-display'].map(function (item) { return item.attr; });
            }
            else {
                columnsOrder_1 = this.colArray.filter(function (attr) { return _this.visibleColArray.indexOf(attr) === -1; });
                columnsOrder_1.push.apply(columnsOrder_1, tslib_1.__spread(this.visibleColArray));
            }
            this._oTableOptions.columns.sort(function (a, b) {
                if (columnsOrder_1.indexOf(a.attr) === -1) {
                    return 0;
                }
                else {
                    return columnsOrder_1.indexOf(a.attr) - columnsOrder_1.indexOf(b.attr);
                }
            });
        }
        this._oTableOptions.filter = this.quickFilter;
        if (this.state.hasOwnProperty('currentPage')) {
            this.currentPage = this.state.currentPage;
        }
        if (!this.paginator && this.paginationControls) {
            this.paginator = new OBaseTablePaginator();
            this.paginator.pageSize = this.queryRows;
            this.paginator.pageIndex = this.currentPage;
            this.paginator.showFirstLastButtons = this.showPaginatorFirstLastButtons;
        }
        if (!Util.isDefined(this.selectAllCheckboxVisible)) {
            this._oTableOptions.selectColumn.visible = !!this.state['select-column-visible'];
        }
        else {
            if (this.state.hasOwnProperty('initial-configuration') && this.state['initial-configuration'].hasOwnProperty('select-column-visible')
                && this.selectAllCheckboxVisible === this.state['initial-configuration']['select-column-visible']) {
                this._oTableOptions.selectColumn.visible = !!this.state['select-column-visible'];
            }
            else {
                this._oTableOptions.selectColumn.visible = this.selectAllCheckboxVisible;
            }
        }
        this.initializeCheckboxColumn();
    };
    OTableComponent.prototype.registerTabListener = function () {
        var _this = this;
        this.tabGroupChangeSubscription = this.tabGroupContainer.selectedTabChange.subscribe(function (evt) {
            var interval;
            var timerCallback = function (tab) {
                if (tab && tab.content.isAttached) {
                    clearInterval(interval);
                    if (tab === _this.tabContainer) {
                        _this.insideTabBugWorkaround();
                        if (_this.pendingQuery) {
                            _this.queryData(_this.pendingQueryFilter);
                        }
                    }
                }
            };
            interval = setInterval(function () { timerCallback(evt.tab); }, 100);
        });
    };
    OTableComponent.prototype.insideTabBugWorkaround = function () {
        this.sortHeaders.forEach(function (sortH) {
            sortH.refresh();
        });
    };
    OTableComponent.prototype.registerSortListener = function () {
        if (Util.isDefined(this.sort)) {
            this.sortSubscription = this.sort.oSortChange.subscribe(this.onSortChange.bind(this));
            this.sort.setMultipleSort(this.multipleSort);
            if (Util.isDefined(this._oTableOptions.columns) && (this.sortColArray.length > 0)) {
                this.sort.setTableInfo(this.sortColArray);
            }
        }
    };
    OTableComponent.prototype.onSortChange = function (sortArray) {
        var _this = this;
        this.sortColArray = [];
        sortArray.forEach(function (sort) {
            if (sort.direction !== '') {
                _this.sortColArray.push({
                    columnName: sort.id,
                    ascendent: sort.direction === Codes.ASC_SORT
                });
            }
        });
        if (this.pageable) {
            this.reloadData();
        }
        else {
            this.loadingSortingSubject.next(true);
            this.cd.detectChanges();
        }
    };
    OTableComponent.prototype.setDatasource = function () {
        var dataSourceService = this.injector.get(OTableDataSourceService);
        this.dataSource = dataSourceService.getInstance(this);
    };
    OTableComponent.prototype.registerDataSourceListeners = function () {
        var _this = this;
        if (!this.pageable) {
            this.onRenderedDataChange = this.dataSource.onRenderedDataChange.subscribe(function () {
                setTimeout(function () {
                    _this.loadingSortingSubject.next(false);
                    if (_this.cd && !_this.cd.destroyed) {
                        _this.cd.detectChanges();
                    }
                }, 500);
            });
        }
    };
    Object.defineProperty(OTableComponent.prototype, "showLoading", {
        get: function () {
            return combineLatest([this.loading, this.loadingSorting, this.loadingScroll])
                .pipe(map(function (res) { return (res[0] || res[1] || res[2]); }));
        },
        enumerable: true,
        configurable: true
    });
    OTableComponent.prototype.queryData = function (filter, ovrrArgs) {
        if (this.isInsideInactiveTab()) {
            this.pendingQuery = true;
            this.pendingQueryFilter = filter;
            return;
        }
        this.pendingQuery = false;
        this.pendingQueryFilter = undefined;
        _super.prototype.queryData.call(this, filter, ovrrArgs);
    };
    OTableComponent.prototype.isInsideInactiveTab = function () {
        var result = false;
        if (this.tabContainer && this.tabGroupContainer) {
            result = !(this.tabContainer.isActive || (this.tabGroupContainer.selectedIndex === this.tabContainer.position));
        }
        return result;
    };
    OTableComponent.prototype.getComponentFilter = function (existingFilter) {
        if (existingFilter === void 0) { existingFilter = {}; }
        var filter = existingFilter;
        if (this.pageable) {
            if (Object.keys(filter).length > 0) {
                var parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
                filter = {};
                filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = parentItemExpr;
            }
            var beColFilter = this.getColumnFiltersExpression();
            if (beColFilter && !Util.isDefined(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY])) {
                filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = beColFilter;
            }
            else if (beColFilter) {
                filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] =
                    FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY], beColFilter, FilterExpressionUtils.OP_AND);
            }
        }
        return _super.prototype.getComponentFilter.call(this, filter);
    };
    OTableComponent.prototype.getQuickFilterExpression = function () {
        if (Util.isDefined(this.oTableQuickFilterComponent) && this.pageable) {
            return this.oTableQuickFilterComponent.filterExpression;
        }
        return undefined;
    };
    OTableComponent.prototype.getColumnFiltersExpression = function () {
        var columnFilters = this.dataSource.getColumnValueFilters();
        var beColumnFilters = [];
        columnFilters.forEach(function (colFilter) {
            switch (colFilter.operator) {
                case ColumnValueFilterOperator.IN:
                    if (Util.isArray(colFilter.values)) {
                        var besIn = colFilter.values.map(function (value) { return FilterExpressionUtils.buildExpressionEquals(colFilter.attr, value); });
                        var beIn_1 = besIn.pop();
                        besIn.forEach(function (be) {
                            beIn_1 = FilterExpressionUtils.buildComplexExpression(beIn_1, be, FilterExpressionUtils.OP_OR);
                        });
                        beColumnFilters.push(beIn_1);
                    }
                    break;
                case ColumnValueFilterOperator.BETWEEN:
                    if (Util.isArray(colFilter.values) && colFilter.values.length === 2) {
                        var beFrom = FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values[0]);
                        var beTo = FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values[1]);
                        beColumnFilters.push(FilterExpressionUtils.buildComplexExpression(beFrom, beTo, FilterExpressionUtils.OP_AND));
                    }
                    break;
                case ColumnValueFilterOperator.EQUAL:
                    beColumnFilters.push(FilterExpressionUtils.buildExpressionLike(colFilter.attr, colFilter.values));
                    break;
                case ColumnValueFilterOperator.LESS_EQUAL:
                    beColumnFilters.push(FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values));
                    break;
                case ColumnValueFilterOperator.MORE_EQUAL:
                    beColumnFilters.push(FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values));
                    break;
            }
        });
        var beColFilter = beColumnFilters.pop();
        beColumnFilters.forEach(function (be) {
            beColFilter = FilterExpressionUtils.buildComplexExpression(beColFilter, be, FilterExpressionUtils.OP_AND);
        });
        return beColFilter;
    };
    OTableComponent.prototype.updatePaginationInfo = function (queryRes) {
        _super.prototype.updatePaginationInfo.call(this, queryRes);
    };
    OTableComponent.prototype.setData = function (data, sqlTypes) {
        this.daoTable.sqlTypesChange.next(sqlTypes);
        this.daoTable.setDataArray(data);
        this.updateScrolledState();
        if (this.pageable) {
            ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
        }
        ObservableWrapper.callEmit(this.onDataLoaded, this.daoTable.data);
    };
    OTableComponent.prototype.showDialogError = function (error, errorOptional) {
        if (Util.isDefined(error) && !Util.isObject(error)) {
            this.dialogService.alert('ERROR', error);
        }
        else {
            this.dialogService.alert('ERROR', errorOptional);
        }
    };
    OTableComponent.prototype.projectContentChanged = function () {
        var _this = this;
        setTimeout(function () {
            _this.loadingSortingSubject.next(false);
        }, 500);
        this.loadingScrollSubject.next(false);
        if (this.previousRendererData !== this.dataSource.renderedData) {
            this.previousRendererData = this.dataSource.renderedData;
            ObservableWrapper.callEmit(this.onContentChange, this.dataSource.renderedData);
        }
        this.getColumnsWidthFromDOM();
        if (this.state.hasOwnProperty('selection') && this.dataSource.renderedData.length > 0 && this.getSelectedItems().length === 0) {
            this.state.selection.forEach(function (selectedItem) {
                var foundItem = _this.dataSource.renderedData.find(function (data) {
                    var result = true;
                    Object.keys(selectedItem).forEach(function (key) {
                        result = result && (data[key] === selectedItem[key]);
                    });
                    return result;
                });
                if (foundItem) {
                    _this.selection.select(foundItem);
                }
            });
        }
    };
    OTableComponent.prototype.getAttributesValuesToQuery = function () {
        var columns = _super.prototype.getAttributesValuesToQuery.call(this);
        if (this.avoidQueryColumns.length > 0) {
            for (var i = columns.length - 1; i >= 0; i--) {
                var col = columns[i];
                if (this.avoidQueryColumns.indexOf(col) !== -1) {
                    columns.splice(i, 1);
                }
            }
        }
        return columns;
    };
    OTableComponent.prototype.getQueryArguments = function (filter, ovrrArgs) {
        var queryArguments = _super.prototype.getQueryArguments.call(this, filter, ovrrArgs);
        queryArguments[3] = this.getSqlTypesForFilter(queryArguments[1]);
        Object.assign(queryArguments[3], ovrrArgs ? ovrrArgs.sqltypes || {} : {});
        if (this.pageable) {
            queryArguments[5] = this.paginator.isShowingAllRows(queryArguments[5]) ? this.state.totalQueryRecordsNumber : queryArguments[5];
            queryArguments[6] = this.sortColArray;
        }
        return queryArguments;
    };
    OTableComponent.prototype.getSqlTypesForFilter = function (filter) {
        var allSqlTypes = {};
        this._oTableOptions.columns.forEach(function (col) {
            if (col.sqlType) {
                allSqlTypes[col.attr] = col.sqlType;
            }
        });
        Object.assign(allSqlTypes, this.getSqlTypes());
        var filterCols = Util.getValuesFromObject(filter);
        var sqlTypes = {};
        Object.keys(allSqlTypes).forEach(function (key) {
            if (filterCols.indexOf(key) !== -1 && allSqlTypes[key] !== SQLTypes.OTHER) {
                sqlTypes[key] = allSqlTypes[key];
            }
        });
        return sqlTypes;
    };
    OTableComponent.prototype.onExportButtonClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onExportButtonClicked();
        }
    };
    OTableComponent.prototype.onChangeColumnsVisibilityClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onChangeColumnsVisibilityClicked();
        }
    };
    OTableComponent.prototype.onMatTableContentChanged = function () {
    };
    OTableComponent.prototype.add = function () {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
            return;
        }
        _super.prototype.insertDetail.call(this);
    };
    OTableComponent.prototype.remove = function (clearSelectedItems) {
        var _this = this;
        if (clearSelectedItems === void 0) { clearSelectedItems = false; }
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_DELETE)) {
            return;
        }
        var selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) {
            this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(function (res) {
                if (res === true) {
                    if (_this.dataService && (_this.deleteMethod in _this.dataService) && _this.entity && (_this.keysArray.length > 0)) {
                        var filters = ServiceUtils.getArrayProperties(selectedItems, _this.keysArray);
                        _this.daoTable.removeQuery(filters).subscribe(function () {
                            ObservableWrapper.callEmit(_this.onRowDeleted, selectedItems);
                        }, function (error) {
                            _this.showDialogError(error, 'MESSAGES.ERROR_DELETE');
                        }, function () {
                            _this.reloadData();
                        });
                    }
                    else {
                        _this.deleteLocalItems();
                    }
                }
                else if (clearSelectedItems) {
                    _this.clearSelection();
                }
            });
        }
    };
    OTableComponent.prototype.refresh = function () {
        this.reloadData();
    };
    OTableComponent.prototype.showAndSelectAllCheckbox = function () {
        if (this.isSelectionModeMultiple()) {
            if (this.selectAllCheckbox) {
                this._oTableOptions.selectColumn.visible = true;
            }
            this.initializeCheckboxColumn();
            this.selectAll();
        }
    };
    OTableComponent.prototype.reloadPaginatedDataFromStart = function () {
        if (this.pageable) {
            this.currentPage = 0;
            this.reloadData();
        }
    };
    OTableComponent.prototype.reloadData = function () {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_REFRESH)) {
            return;
        }
        Object.assign(this.state, this.oTableStorage.getTablePropertyToStore('selection'));
        this.clearSelection();
        this.finishQuerySubscription = false;
        this.pendingQuery = true;
        var queryArgs;
        if (this.pageable) {
            queryArgs = {
                offset: this.currentPage * this.queryRows,
                length: this.queryRows
            };
        }
        this.editingCell = undefined;
        this.queryData(void 0, queryArgs);
    };
    OTableComponent.prototype.handleClick = function (item, $event) {
        var _this = this;
        this.clickTimer = setTimeout(function () {
            if (!_this.clickPrevent) {
                _this.doHandleClick(item, $event);
            }
            _this.clickPrevent = false;
        }, this.clickDelay);
    };
    OTableComponent.prototype.doHandleClick = function (item, $event) {
        if (!this.oenabled) {
            return;
        }
        if ((this.detailMode === Codes.DETAIL_MODE_CLICK)) {
            ObservableWrapper.callEmit(this.onClick, item);
            this.saveDataNavigationInLocalStorage();
            this.selection.clear();
            this.selectedRow(item);
            this.viewDetail(item);
            return;
        }
        if (this.isSelectionModeMultiple() && ($event.ctrlKey || $event.metaKey)) {
            this.selectedRow(item);
            ObservableWrapper.callEmit(this.onClick, item);
        }
        else if (this.isSelectionModeMultiple() && $event.shiftKey) {
            this.handleMultipleSelection(item);
        }
        else if (!this.isSelectionModeNone()) {
            var selectedItems = this.getSelectedItems();
            if (this.selection.isSelected(item) && selectedItems.length === 1 && this.editionEnabled) {
                return;
            }
            else {
                this.clearSelectionAndEditing();
            }
            this.selectedRow(item);
            ObservableWrapper.callEmit(this.onClick, item);
        }
    };
    OTableComponent.prototype.handleMultipleSelection = function (item) {
        var _this = this;
        if (this.selection.selected.length > 0) {
            var first = this.dataSource.renderedData.indexOf(this.selection.selected[0]);
            var last = this.dataSource.renderedData.indexOf(item);
            var indexFrom = Math.min(first, last);
            var indexTo = Math.max(first, last);
            this.clearSelection();
            this.dataSource.renderedData.slice(indexFrom, indexTo + 1).forEach(function (e) { return _this.selectedRow(e); });
            ObservableWrapper.callEmit(this.onClick, this.selection.selected);
        }
    };
    OTableComponent.prototype.saveDataNavigationInLocalStorage = function () {
        _super.prototype.saveDataNavigationInLocalStorage.call(this);
        this.storePaginationState = true;
    };
    OTableComponent.prototype.handleDoubleClick = function (item, event) {
        clearTimeout(this.clickTimer);
        this.clickPrevent = true;
        ObservableWrapper.callEmit(this.onDoubleClick, item);
        if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(item);
        }
    };
    Object.defineProperty(OTableComponent.prototype, "editionEnabled", {
        get: function () {
            return this._oTableOptions.columns.some(function (item) { return item.editing; });
        },
        enumerable: true,
        configurable: true
    });
    OTableComponent.prototype.handleDOMClick = function (event) {
        if (this._oTableOptions.selectColumn.visible) {
            return;
        }
        if (this.editionEnabled) {
            return;
        }
        var overlayContainer = document.body.getElementsByClassName('cdk-overlay-container')[0];
        if (overlayContainer && overlayContainer.contains(event.target)) {
            return;
        }
        var tableContainer = this.elRef.nativeElement.querySelector('.o-table-container');
        var tableContent = this.elRef.nativeElement.querySelector('.o-table-container table.mat-table');
        if (tableContainer && tableContent && tableContainer.contains(event.target) && !tableContent.contains(event.target)) {
            this.clearSelection();
        }
    };
    OTableComponent.prototype.handleCellClick = function (column, row, event) {
        if (this.oenabled && column.editor
            && (this.detailMode !== Codes.DETAIL_MODE_CLICK)
            && (this.editionMode === Codes.DETAIL_MODE_CLICK)) {
            this.activateColumnEdition(column, row, event);
        }
    };
    OTableComponent.prototype.handleCellDoubleClick = function (column, row, event) {
        if (this.oenabled && column.editor
            && (!Codes.isDoubleClickMode(this.detailMode))
            && (Codes.isDoubleClickMode(this.editionMode))) {
            this.activateColumnEdition(column, row, event);
        }
    };
    OTableComponent.prototype.activateColumnEdition = function (column, row, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (event && column.editing && this.editingCell === event.currentTarget) {
            return;
        }
        var columnPermissions = this.getOColumnPermissions(column.attr);
        if (columnPermissions.enabled === false) {
            console.warn(column.attr + " edition not allowed due to permissions");
            return;
        }
        this.clearSelectionAndEditing();
        this.selectedRow(row);
        if (event) {
            this.editingCell = event.currentTarget;
        }
        var rowData = {};
        this.keysArray.forEach(function (key) {
            rowData[key] = row[key];
        });
        rowData[column.attr] = row[column.attr];
        this.editingRow = row;
        column.editing = true;
        column.editor.startEdition(rowData);
        this.cd.detectChanges();
    };
    OTableComponent.prototype.updateCellData = function (column, data, saveChanges) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
            var res = new Observable(function (innerObserver) {
                innerObserver.error();
            });
            return res;
        }
        column.editing = false;
        this.editingCell = undefined;
        if (saveChanges && this.editingRow !== undefined) {
            Object.assign(this.editingRow, data);
        }
        this.editingRow = undefined;
        if (saveChanges && column.editor.updateRecordOnEdit) {
            var toUpdate = {};
            toUpdate[column.attr] = data[column.attr];
            var kv = this.extractKeysFromRecord(data);
            return this.updateRecord(kv, toUpdate);
        }
        return undefined;
    };
    OTableComponent.prototype.getKeysValues = function () {
        var _this = this;
        var data = this.getAllValues();
        return data.map(function (row) {
            var obj = {};
            _this.keysArray.forEach(function (key) {
                if (row[key] !== undefined) {
                    obj[key] = row[key];
                }
            });
            return obj;
        });
    };
    OTableComponent.prototype.onShowsSelects = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onShowsSelects();
        }
    };
    OTableComponent.prototype.initializeCheckboxColumn = function () {
        var _this = this;
        if (!this.selectionChangeSubscription && this._oTableOptions.selectColumn.visible) {
            this.selectionChangeSubscription = this.selection.changed.subscribe(function (selectionData) {
                if (selectionData && selectionData.added.length > 0) {
                    ObservableWrapper.callEmit(_this.onRowSelected, selectionData.added);
                }
                if (selectionData && selectionData.removed.length > 0) {
                    ObservableWrapper.callEmit(_this.onRowDeselected, selectionData.removed);
                }
            });
        }
        this.updateSelectionColumnState();
    };
    OTableComponent.prototype.updateSelectionColumnState = function () {
        if (!this._oTableOptions.selectColumn.visible) {
            this.clearSelection();
        }
        if (this._oTableOptions.visibleColumns && this._oTableOptions.selectColumn.visible
            && this._oTableOptions.visibleColumns[0] !== Codes.NAME_COLUMN_SELECT) {
            this._oTableOptions.visibleColumns.unshift(Codes.NAME_COLUMN_SELECT);
        }
        else if (this._oTableOptions.visibleColumns && !this._oTableOptions.selectColumn.visible
            && this._oTableOptions.visibleColumns[0] === Codes.NAME_COLUMN_SELECT) {
            this._oTableOptions.visibleColumns.shift();
        }
    };
    OTableComponent.prototype.isAllSelected = function () {
        var numSelected = this.selection.selected.length;
        var numRows = this.dataSource ? this.dataSource.renderedData.length : undefined;
        return numSelected > 0 && numSelected === numRows;
    };
    OTableComponent.prototype.masterToggle = function (event) {
        event.checked ? this.selectAll() : this.clearSelection();
    };
    OTableComponent.prototype.selectAll = function () {
        var _this = this;
        this.dataSource.renderedData.forEach(function (row) { return _this.selection.select(row); });
    };
    OTableComponent.prototype.selectionCheckboxToggle = function (event, row) {
        if (this.isSelectionModeSingle()) {
            this.clearSelection();
        }
        this.selectedRow(row);
    };
    OTableComponent.prototype.selectedRow = function (row) {
        this.setSelected(row);
        this.cd.detectChanges();
    };
    Object.defineProperty(OTableComponent.prototype, "showDeleteButton", {
        get: function () {
            return this.deleteButton;
        },
        enumerable: true,
        configurable: true
    });
    OTableComponent.prototype.getTrackByFunction = function () {
        var self = this;
        return function (index, item) {
            if (self.hasScrollableContainer() && index < (self.pageScrollVirtual - 1) * Codes.LIMIT_SCROLLVIRTUAL) {
                return null;
            }
            var itemId = '';
            var keysLenght = self.keysArray.length;
            self.keysArray.forEach(function (key, idx) {
                var suffix = idx < (keysLenght - 1) ? ';' : '';
                itemId += item[key] + suffix;
            });
            var asyncAndVisible = self.asyncLoadColumns.filter(function (c) { return self._oTableOptions.visibleColumns.indexOf(c) !== -1; });
            if (self.asyncLoadColumns.length && asyncAndVisible.length > 0 && !self.finishQuerySubscription) {
                self.queryRowAsyncData(index, item);
                if (self.paginator && index === (self.paginator.pageSize - 1)) {
                    self.finishQuerySubscription = true;
                }
                return itemId;
            }
            else {
                return itemId;
            }
        };
    };
    OTableComponent.prototype.queryRowAsyncData = function (rowIndex, rowData) {
        var _this = this;
        var kv = ServiceUtils.getObjectProperties(rowData, this.keysArray);
        var av = this.asyncLoadColumns.filter(function (c) { return _this._oTableOptions.visibleColumns.indexOf(c) !== -1; });
        if (av.length === 0) {
            return;
        }
        var columnQueryArgs = [kv, av, this.entity, undefined, undefined, undefined, undefined];
        var queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
            if (this.asyncLoadSubscriptions[rowIndex]) {
                this.asyncLoadSubscriptions[rowIndex].unsubscribe();
            }
            this.asyncLoadSubscriptions[rowIndex] = this.dataService[queryMethodName]
                .apply(this.dataService, columnQueryArgs)
                .subscribe(function (res) {
                if (res.isSuccessful()) {
                    var data = void 0;
                    if (Util.isArray(res.data) && res.data.length === 1) {
                        data = res.data[0];
                    }
                    else if (Util.isObject(res.data)) {
                        data = res.data;
                    }
                    _this.daoTable.setAsynchronousColumn(data, rowData);
                    _this.cd.detectChanges();
                }
            });
        }
    };
    OTableComponent.prototype.getValue = function () {
        return this.dataSource.getCurrentData();
    };
    OTableComponent.prototype.getAllValues = function () {
        return this.dataSource.getCurrentAllData();
    };
    OTableComponent.prototype.getAllRenderedValues = function () {
        return this.dataSource.getAllRendererData();
    };
    OTableComponent.prototype.getRenderedValue = function () {
        return this.dataSource.getCurrentRendererData();
    };
    OTableComponent.prototype.getSqlTypes = function () {
        return Util.isDefined(this.dataSource.sqlTypes) ? this.dataSource.sqlTypes : {};
    };
    OTableComponent.prototype.setOTableColumnsFilter = function (tableColumnsFilter) {
        this.oTableColumnsFilterComponent = tableColumnsFilter;
    };
    OTableComponent.prototype.getStoredColumnsFilters = function () {
        return this.oTableStorage.getStoredColumnsFilters();
    };
    OTableComponent.prototype.onFilterByColumnClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onFilterByColumnClicked();
        }
    };
    OTableComponent.prototype.onStoreFilterClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onStoreFilterClicked();
        }
    };
    OTableComponent.prototype.onLoadFilterClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onLoadFilterClicked();
        }
    };
    OTableComponent.prototype.onClearFilterClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onClearFilterClicked();
        }
    };
    OTableComponent.prototype.clearFilters = function (triggerDatasourceUpdate) {
        if (triggerDatasourceUpdate === void 0) { triggerDatasourceUpdate = true; }
        this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
        if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
            this.oTableMenu.columnFilterOption.setActive(this.showFilterByColumnIcon);
        }
        if (this.oTableQuickFilterComponent) {
            this.oTableQuickFilterComponent.setValue(void 0);
        }
    };
    OTableComponent.prototype.isColumnFilterable = function (column) {
        return (this.oTableColumnsFilterComponent && this.oTableColumnsFilterComponent.isColumnFilterable(column.attr));
    };
    OTableComponent.prototype.isModeColumnFilterable = function (column) {
        return this.showFilterByColumnIcon &&
            (this.oTableColumnsFilterComponent && this.oTableColumnsFilterComponent.isColumnFilterable(column.attr));
    };
    OTableComponent.prototype.isColumnFilterActive = function (column) {
        return this.showFilterByColumnIcon &&
            this.dataSource.getColumnValueFilterByAttr(column.attr) !== undefined;
    };
    OTableComponent.prototype.openColumnFilterDialog = function (column, event) {
        var _this = this;
        event.stopPropagation();
        event.preventDefault();
        var dialogRef = this.dialog.open(OTableFilterByColumnDataDialogComponent, {
            data: {
                previousFilter: this.dataSource.getColumnValueFilterByAttr(column.attr),
                column: column,
                tableData: this.dataSource.getTableData(),
                preloadValues: this.oTableColumnsFilterComponent.preloadValues,
                mode: this.oTableColumnsFilterComponent.mode
            },
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                var columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
                _this.dataSource.addColumnFilter(columnValueFilter);
                _this.reloadPaginatedDataFromStart();
            }
        });
    };
    Object.defineProperty(OTableComponent.prototype, "disableTableMenuButton", {
        get: function () {
            return !!(this.permissions && this.permissions.menu && this.permissions.menu.enabled === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "showTableMenuButton", {
        get: function () {
            var permissionHidden = !!(this.permissions && this.permissions.menu && this.permissions.menu.visible === false);
            if (permissionHidden) {
                return false;
            }
            var staticOpt = this.selectAllCheckbox || this.exportButton || this.showConfigurationOption || this.columnsVisibilityButton || (this.showFilterOption && this.oTableColumnsFilterComponent !== undefined);
            return staticOpt || this.tableOptions.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    OTableComponent.prototype.setOTableInsertableRow = function (tableInsertableRow) {
        var insertPerm = this.getActionPermissions(PermissionsUtils.ACTION_INSERT);
        if (insertPerm.visible) {
            tableInsertableRow.enabled = insertPerm.enabled;
            this.oTableInsertableRowComponent = tableInsertableRow;
            this.showFirstInsertableRow = this.oTableInsertableRowComponent.isFirstRow();
            this.showLastInsertableRow = !this.showFirstInsertableRow;
            this.oTableInsertableRowComponent.initializeEditors();
        }
    };
    OTableComponent.prototype.clearSelectionAndEditing = function () {
        this.selection.clear();
        this._oTableOptions.columns.forEach(function (item) {
            item.editing = false;
        });
    };
    OTableComponent.prototype.useDetailButton = function (column) {
        return column.type === 'editButtonInRow' || column.type === 'detailButtonInRow';
    };
    OTableComponent.prototype.onDetailButtonClick = function (column, row, event) {
        event.preventDefault();
        event.stopPropagation();
        switch (column.type) {
            case 'editButtonInRow':
                this.editDetail(row);
                break;
            case 'detailButtonInRow':
                this.viewDetail(row);
                break;
        }
    };
    OTableComponent.prototype.getDetailButtonIcon = function (column) {
        var result = '';
        switch (column.type) {
            case 'editButtonInRow':
                result = this.editButtonInRowIcon;
                break;
            case 'detailButtonInRow':
                result = this.detailButtonInRowIcon;
                break;
        }
        return result;
    };
    OTableComponent.prototype.usePlainRender = function (column, row) {
        return !this.useDetailButton(column) && !column.renderer && (!column.editor || (!column.editing || !this.selection.isSelected(row)));
    };
    OTableComponent.prototype.useCellRenderer = function (column, row) {
        return column.renderer && (!column.editing || column.editing && !this.selection.isSelected(row));
    };
    OTableComponent.prototype.useCellEditor = function (column, row) {
        if (column.editor && column.editor.autoCommit) {
            return false;
        }
        return column.editor && column.editing && this.selection.isSelected(row);
    };
    OTableComponent.prototype.isSelectionModeMultiple = function () {
        return this.selectionMode === Codes.SELECTION_MODE_MULTIPLE;
    };
    OTableComponent.prototype.isSelectionModeSingle = function () {
        return this.selectionMode === Codes.SELECTION_MODE_SINGLE;
    };
    OTableComponent.prototype.isSelectionModeNone = function () {
        return this.selectionMode === Codes.SELECTION_MODE_NONE;
    };
    OTableComponent.prototype.onChangePage = function (evt) {
        this.finishQuerySubscription = false;
        if (!this.pageable) {
            this.currentPage = evt.pageIndex;
            return;
        }
        var tableState = this.state;
        var goingBack = evt.pageIndex < this.currentPage;
        this.currentPage = evt.pageIndex;
        var pageSize = this.paginator.isShowingAllRows(evt.pageSize) ? tableState.totalQueryRecordsNumber : evt.pageSize;
        var oldQueryRows = this.queryRows;
        var changingPageSize = (oldQueryRows !== pageSize);
        this.queryRows = pageSize;
        var newStartRecord;
        var queryLength;
        if (goingBack || changingPageSize) {
            newStartRecord = (this.currentPage * this.queryRows);
            queryLength = this.queryRows;
        }
        else {
            newStartRecord = Math.max(tableState.queryRecordOffset, (this.currentPage * this.queryRows));
            var newEndRecord = Math.min(newStartRecord + this.queryRows, tableState.totalQueryRecordsNumber);
            queryLength = Math.min(this.queryRows, newEndRecord - newStartRecord);
        }
        var queryArgs = {
            offset: newStartRecord,
            length: queryLength
        };
        this.finishQuerySubscription = false;
        this.queryData(void 0, queryArgs);
    };
    OTableComponent.prototype.getOColumn = function (attr) {
        return this._oTableOptions ? this._oTableOptions.columns.find(function (item) { return item.name === attr; }) : undefined;
    };
    OTableComponent.prototype.insertRecord = function (recordData, sqlTypes) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
            return undefined;
        }
        if (!Util.isDefined(sqlTypes)) {
            var allSqlTypes_1 = this.getSqlTypes();
            sqlTypes = {};
            Object.keys(recordData).forEach(function (key) {
                sqlTypes[key] = allSqlTypes_1[key];
            });
        }
        return this.daoTable.insertQuery(recordData, sqlTypes);
    };
    OTableComponent.prototype.updateRecord = function (filter, updateData, sqlTypes) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
            return of(this.dataSource.data);
        }
        var sqlTypesArg = sqlTypes || {};
        if (!Util.isDefined(sqlTypes)) {
            var allSqlTypes_2 = this.getSqlTypes();
            Object.keys(filter).forEach(function (key) {
                sqlTypesArg[key] = allSqlTypes_2[key];
            });
            Object.keys(updateData).forEach(function (key) {
                sqlTypesArg[key] = allSqlTypes_2[key];
            });
        }
        return this.daoTable.updateQuery(filter, updateData, sqlTypesArg);
    };
    OTableComponent.prototype.getDataArray = function () {
        return this.daoTable.data;
    };
    OTableComponent.prototype.setDataArray = function (data) {
        if (this.daoTable) {
            this.pageable = false;
            this.staticData = data;
            this.daoTable.usingStaticData = true;
            this.daoTable.setDataArray(this.staticData);
        }
    };
    OTableComponent.prototype.deleteLocalItems = function () {
        var dataArray = this.getDataArray();
        var selectedItems = this.getSelectedItems();
        selectedItems.forEach(function (selectedItem) {
            for (var j = dataArray.length - 1; j >= 0; --j) {
                if (Util.equals(selectedItem, dataArray[j])) {
                    dataArray.splice(j, 1);
                    break;
                }
            }
        });
        this.clearSelection();
        this.setDataArray(dataArray);
    };
    OTableComponent.prototype.isColumnSortActive = function (column) {
        var found = this.sortColArray.find(function (sortC) { return sortC.columnName === column.attr; });
        return found !== undefined;
    };
    OTableComponent.prototype.isColumnDescSortActive = function (column) {
        var found = this.sortColArray.find(function (sortC) { return sortC.columnName === column.attr && !sortC.ascendent; });
        return found !== undefined;
    };
    OTableComponent.prototype.hasTabGroupChangeSubscription = function () {
        return this.tabGroupChangeSubscription !== undefined;
    };
    OTableComponent.prototype.isEmpty = function (value) {
        return !Util.isDefined(value) || ((typeof value === 'string') && !value);
    };
    OTableComponent.prototype.setFiltersConfiguration = function (conf) {
        var _this = this;
        if (Util.isDefined(this.filterCaseSensitive) && this.state.hasOwnProperty('initial-configuration') &&
            this.state['initial-configuration'].hasOwnProperty('filter-case-sensitive') &&
            this.filterCaseSensitive === conf['initial-configuration']['filter-case-sensitive']) {
            this.filterCaseSensitive = conf.hasOwnProperty('filter-case-sensitive') ? conf['filter-case-sensitive'] : this.filterCaseSensitive;
        }
        var storedColumnFilters = this.oTableStorage.getStoredColumnsFilters(conf);
        this.showFilterByColumnIcon = storedColumnFilters.length > 0;
        if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
            this.oTableMenu.columnFilterOption.setActive(this.showFilterByColumnIcon);
        }
        if (this.oTableColumnsFilterComponent) {
            this.dataSource.initializeColumnsFilters(storedColumnFilters);
        }
        if (this.oTableQuickFilterComponent) {
            this.oTableQuickFilterComponent.setValue(conf.filter);
            var storedColumnsData = conf.oColumns || [];
            storedColumnsData.forEach(function (oColData) {
                var oCol = _this.getOColumn(oColData.attr);
                if (oCol) {
                    if (oColData.hasOwnProperty('searching')) {
                        oCol.searching = oColData.searching;
                    }
                }
            });
        }
    };
    OTableComponent.prototype.onStoreConfigurationClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onStoreConfigurationClicked();
        }
    };
    OTableComponent.prototype.onApplyConfigurationClicked = function () {
        if (this.oTableMenu) {
            this.oTableMenu.onApplyConfigurationClicked();
        }
    };
    OTableComponent.prototype.applyDefaultConfiguration = function () {
        var _this = this;
        this.oTableStorage.reset();
        this.initializeParams();
        this.parseVisibleColumns();
        this._oTableOptions.columns.sort(function (a, b) { return _this.visibleColArray.indexOf(a.attr) - _this.visibleColArray.indexOf(b.attr); });
        this.insideTabBugWorkaround();
        this.onReinitialize.emit(null);
        this.clearFilters(false);
        this.reloadData();
    };
    OTableComponent.prototype.applyConfiguration = function (configurationName) {
        var _this = this;
        var storedConfiguration = this.oTableStorage.getStoredConfiguration(configurationName);
        if (storedConfiguration) {
            var properties = storedConfiguration[OTableStorage.STORED_PROPERTIES_KEY] || [];
            var conf_1 = storedConfiguration[OTableStorage.STORED_CONFIGURATION_KEY];
            properties.forEach(function (property) {
                switch (property) {
                    case 'sort':
                        _this.state['sort-columns'] = conf_1['sort-columns'];
                        _this.parseSortColumns();
                        break;
                    case 'columns-display':
                        _this.state['oColumns-display'] = conf_1['oColumns-display'];
                        _this.parseVisibleColumns();
                        _this.state['select-column-visible'] = conf_1['select-column-visible'];
                        _this.initializeCheckboxColumn();
                        break;
                    case 'quick-filter':
                    case 'columns-filter':
                        _this.setFiltersConfiguration(conf_1);
                        break;
                    case 'page':
                        _this.state.currentPage = conf_1.currentPage;
                        _this.currentPage = conf_1.currentPage;
                        if (_this.pageable) {
                            _this.state.totalQueryRecordsNumber = conf_1.totalQueryRecordsNumber;
                            _this.state.queryRecordOffset = conf_1.queryRecordOffset;
                        }
                        _this.queryRows = conf_1['query-rows'];
                        break;
                }
            });
            this.reloadData();
        }
    };
    OTableComponent.prototype.getTitleAlignClass = function (oCol) {
        var align;
        var hasTitleAlign = Util.isDefined(oCol.definition) && Util.isDefined(oCol.definition.titleAlign);
        var autoAlign = (this.autoAlignTitles && !hasTitleAlign) || (hasTitleAlign && oCol.definition.titleAlign === Codes.COLUMN_TITLE_ALIGN_AUTO);
        if (!autoAlign) {
            return oCol.getTitleAlignClass();
        }
        switch (oCol.type) {
            case 'image':
            case 'date':
            case 'action':
            case 'boolean':
                align = Codes.COLUMN_TITLE_ALIGN_CENTER;
                break;
            case 'currency':
            case 'integer':
            case 'real':
            case 'percentage':
                align = Codes.COLUMN_TITLE_ALIGN_END;
                break;
            case 'service':
            default:
                align = Codes.COLUMN_TITLE_ALIGN_START;
                break;
        }
        return align;
    };
    OTableComponent.prototype.getCellAlignClass = function (column) {
        return Util.isDefined(column.definition) && Util.isDefined(column.definition.contentAlign) ? 'o-' + column.definition.contentAlign : '';
    };
    OTableComponent.prototype.onTableScroll = function (e) {
        if (this.hasScrollableContainer()) {
            var tableViewHeight = e.target.offsetHeight;
            var tableScrollHeight = e.target.scrollHeight;
            var scrollLocation = e.target.scrollTop;
            var buffer = 100;
            var limit_SCROLLVIRTUAL = tableScrollHeight - tableViewHeight - buffer;
            if (scrollLocation > limit_SCROLLVIRTUAL) {
                this.getDataScrollable();
            }
        }
    };
    OTableComponent.prototype.getDataScrollable = function () {
        var pageVirtualBefore = this.pageScrollVirtual;
        var pageVirtualEnd = Math.ceil(this.dataSource.resultsLength / Codes.LIMIT_SCROLLVIRTUAL);
        if (pageVirtualEnd !== this.pageScrollVirtual) {
            this.pageScrollVirtual++;
        }
        if (pageVirtualBefore !== this.pageScrollVirtual) {
            this.loadingScrollSubject.next(true);
            this.dataSource.loadDataScrollable = this.pageScrollVirtual;
        }
    };
    OTableComponent.prototype.hasScrollableContainer = function () {
        return this.dataSource && !this.paginationControls && !this.pageable;
    };
    OTableComponent.prototype.addDefaultRowButtons = function () {
        if (this.editButtonInRow) {
            this.addButtonInRow('editButtonInRow');
        }
        if (this.detailButtonInRow) {
            this.addButtonInRow('detailButtonInRow');
        }
    };
    OTableComponent.prototype.addButtonInRow = function (name) {
        var colDef = this.createOColumn(name, this);
        colDef.type = name;
        colDef.visible = true;
        colDef.searchable = false;
        colDef.orderable = false;
        colDef.resizable = false;
        colDef.title = undefined;
        colDef.width = '48px';
        this.pushOColumnDefinition(colDef);
        this._oTableOptions.visibleColumns.push(name);
    };
    Object.defineProperty(OTableComponent.prototype, "headerHeight", {
        get: function () {
            var height = 0;
            if (this.tableHeaderEl && this.tableHeaderEl.nativeElement) {
                height += this.tableHeaderEl.nativeElement.offsetHeight;
            }
            if (this.tableToolbarEl && this.tableToolbarEl.nativeElement) {
                height += this.tableToolbarEl.nativeElement.offsetHeight;
            }
            return height;
        },
        enumerable: true,
        configurable: true
    });
    OTableComponent.prototype.isDetailMode = function () {
        return this.detailMode !== Codes.DETAIL_MODE_NONE;
    };
    OTableComponent.prototype.copyAll = function () {
        Util.copyToClipboard(JSON.stringify(this.getRenderedValue()));
    };
    OTableComponent.prototype.copySelection = function () {
        var selectedItems = this.dataSource.getRenderedData(this.getSelectedItems());
        Util.copyToClipboard(JSON.stringify(selectedItems));
    };
    OTableComponent.prototype.viewDetail = function (item) {
        if (!this.checkEnabledActionPermission('detail')) {
            return;
        }
        _super.prototype.viewDetail.call(this, item);
    };
    OTableComponent.prototype.editDetail = function (item) {
        if (!this.checkEnabledActionPermission('edit')) {
            return;
        }
        _super.prototype.editDetail.call(this, item);
    };
    OTableComponent.prototype.getOColumnFromTh = function (th) {
        var result;
        var classList = [].slice.call(th.classList);
        var columnClass = classList.find(function (className) { return (className.startsWith('mat-column-')); });
        if (Util.isDefined(columnClass)) {
            result = this.getOColumn(columnClass.substr('mat-column-'.length));
        }
        return result;
    };
    OTableComponent.prototype.getColumnInsertable = function (name) {
        return name + this.getSuffixColumnInsertable();
    };
    OTableComponent.prototype.isRowSelected = function (row) {
        return !this.isSelectionModeNone() && this.selection.isSelected(row);
    };
    OTableComponent.prototype.getColumnsWidthFromDOM = function () {
        var _this = this;
        if (Util.isDefined(this.tableHeaderEl)) {
            [].slice.call(this.tableHeaderEl.nativeElement.children).forEach(function (thEl) {
                var oCol = _this.getOColumnFromTh(thEl);
                if (Util.isDefined(oCol) && thEl.clientWidth > 0 && oCol.DOMWidth !== thEl.clientWidth) {
                    oCol.DOMWidth = thEl.clientWidth;
                }
            });
        }
    };
    OTableComponent.prototype.refreshColumnsWidth = function () {
        var _this = this;
        this._oTableOptions.columns.filter(function (c) { return c.visible; }).forEach(function (c) {
            c.DOMWidth = undefined;
        });
        this.cd.detectChanges();
        setTimeout(function () {
            _this.getColumnsWidthFromDOM();
            _this._oTableOptions.columns.filter(function (c) { return c.visible; }).forEach(function (c) {
                if (Util.isDefined(c.definition) && Util.isDefined(c.definition.width) && _this.horizontalScroll) {
                    c.width = c.definition.width;
                }
                c.getRenderWidth(_this.horizontalScroll);
            });
            _this.cd.detectChanges();
        }, 0);
    };
    OTableComponent.prototype.createOColumn = function (attr, table, column) {
        var instance = new OColumn();
        if (attr) {
            instance.attr = attr;
        }
        if (table) {
            instance.setDefaultProperties({
                orderable: this.orderable,
                resizable: this.resizable
            });
        }
        if (column) {
            instance.setColumnProperties(column);
        }
        return instance;
    };
    OTableComponent.DEFAULT_BASE_SIZE_SPINNER = 100;
    OTableComponent.FIRST_LAST_CELL_PADDING = 24;
    OTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table',
                    template: "<div class=\"o-table-container\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\"\n  [style.display]=\"isVisible()? '' : 'none'\" (scroll)=\"onTableScroll($event)\" [class.block-events]=\"showLoading | async\"\n  [class.o-scrollable-container]=\"hasScrollableContainer()\">\n  <div #tableToolbar *ngIf=\"hasControls()\" class=\"toolbar\">\n    <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n      <o-table-buttons #tableButtons [insert-button]=\"insertButton\" [refresh-button]=\"refreshButton\"\n        [delete-button]=\"showDeleteButton\">\n        <ng-content select=\"o-table-button\"></ng-content>\n      </o-table-buttons>\n      <div fxLayout fxFlex>\n        <span *ngIf=\"showTitle\" class=\"table-title\" fxFlex>{{ title | oTranslate }}</span>\n      </div>\n\n      <ng-container *ngIf=\"quickfilterContentChild; else defaultQuickFilter\">\n        <ng-content select=\"o-table-quickfilter\"></ng-content>\n      </ng-container>\n      <ng-template #defaultQuickFilter>\n        <ng-container *ngIf=\"quickFilter\">\n          <o-table-quickfilter (onChange)=\"reloadPaginatedDataFromStart()\"></o-table-quickfilter>\n        </ng-container>\n      </ng-template>\n\n      <button type=\"button\" *ngIf=\"showTableMenuButton\" mat-icon-button class=\"o-table-menu-button\"\n        [matMenuTriggerFor]=\"tableMenu.matMenu\" (click)=\"$event.stopPropagation()\">\n        <mat-icon svgIcon=\"ontimize:more_vert\"></mat-icon>\n      </button>\n      <o-table-menu #tableMenu [select-all-checkbox]=\"selectAllCheckbox\" [export-button]=\"exportButton\"\n        [columns-visibility-button]=\"columnsVisibilityButton\" [show-configuration-option]=\"showConfigurationOption\"\n        [show-filter-option]=\"showFilterOption\">\n        <ng-content select=\"o-table-option\"></ng-content>\n      </o-table-menu>\n      <ng-template #exportOptsTemplate>\n        <ng-content select=\"o-table-export-button\"></ng-content>\n      </ng-template>\n    </div>\n  </div>\n\n  <div #tableBody class=\"o-table-body o-scroll\" [class.horizontal-scroll]=\"horizontalScroll\"\n    [class.scrolled]=\"horizontalScrolled\">\n    <div class=\"o-table-overflow o-scroll\">\n      <table mat-table #table [class.autoadjusted]=\"autoAdjust\" [trackBy]=\"getTrackByFunction()\"\n        [dataSource]=\"dataSource\" oMatSort [ngClass]=\"rowHeightObservable | async\" (scroll)=\"onTableScroll($event)\"\n        (cdkObserveContent)=\"projectContentChanged()\" oTableExpandedFooter>\n\n        <!--Checkbox Column -->\n        <ng-container [matColumnDef]=\"oTableOptions.selectColumn.name\" *ngIf=\"oTableOptions.selectColumn.visible\">\n          <th mat-header-cell *matHeaderCellDef>\n            <mat-checkbox (click)=\"$event.stopPropagation()\" (change)=\"masterToggle($event)\" [checked]=\"isAllSelected()\"\n              [indeterminate]=\"selection.hasValue() && !isAllSelected()\"></mat-checkbox>\n          </th>\n          <td mat-cell *matCellDef=\"let row\">\n            <mat-checkbox name=\"id[]\" (click)=\"$event.stopPropagation()\" (change)=\"selectionCheckboxToggle($event, row)\"\n              [checked]=\"selection.isSelected(row)\"></mat-checkbox>\n          </td>\n        </ng-container>\n\n        <!-- Generic column definition -->\n        <ng-container *ngFor=\"let column of oTableOptions.columns\" [matColumnDef]=\"column.name\">\n          <!--Define header-cell-->\n\n          <th mat-header-cell *matHeaderCellDef [ngClass]=\"getTitleAlignClass(column)\" [class.resizable]=\"resizable\"\n            [style.width]=\"column.getRenderWidth(horizontalScroll)\">\n            <div class=\"content\">\n              <mat-icon *ngIf=\"isModeColumnFilterable(column)\" class=\"column-filter-icon\"\n                [class.active]=\"isColumnFilterActive(column)\" (click)=\"openColumnFilterDialog(column, $event)\"\n                svgIcon=\"ontimize:filter_list\">\n              </mat-icon>\n\n              <ng-container *ngIf=\"column.orderable\">\n                <span o-mat-sort-header>{{ column.title | oTranslate }}</span>\n              </ng-container>\n              <ng-container *ngIf=\"!column.orderable\">\n                <span class=\"header-title-container\">{{ column.title | oTranslate }}</span>\n              </ng-container>\n\n              <o-table-column-resizer *ngIf=\"resizable\" [column]=\"column\"></o-table-column-resizer>\n            </div>\n          </th>\n\n          <!--Define mat-cell-->\n          <td mat-cell *matCellDef=\"let row\" [ngClass]=\"[column.className, getCellAlignClass(column)]\"\n            (click)=\"handleCellClick(column, row, $event)\" (dblclick)=\"handleCellDoubleClick(column, row, $event)\"\n            [class.empty-cell]=\"isEmpty(row[column.name])\" [matTooltipDisabled]=\"!column.hasTooltip()\"\n            [matTooltip]=\"column.getTooltip(row)\" matTooltipPosition=\"below\" matTooltipShowDelay=\"750\"\n            matTooltipClass=\"o-table-cell-tooltip\" [class.o-mat-cell-multiline]=\"(column.isMultiline | async)\"\n            [oContextMenu]=\"tableContextMenu\" [oContextMenuData]=\"{ cellName:column.name, rowValue:row}\"\n            [style.width]=\"column.getRenderWidth(horizontalScroll)\">\n            <div class=\"content\">\n\n              <ng-container [ngSwitch]=\"true\">\n                <ng-container\n                  *ngSwitchCase=\"column.renderer != null && (!column.editing || column.editing && !selection.isSelected(row))\">\n                  <ng-template\n                    *ngTemplateOutlet=\"column.renderer?.templateref; context:{ cellvalue: row[column.name], rowvalue:row }\">\n                  </ng-template>\n                </ng-container>\n                <ng-container *ngSwitchCase=\"selection.isSelected(row) && column.editing\">\n                  <ng-template\n                    *ngTemplateOutlet=\"column.editor?.templateref; context:{ cellvalue: row[column.name], rowvalue:row }\">\n                  </ng-template>\n                </ng-container>\n\n                <ng-container *ngSwitchCase=\"column.type === 'editButtonInRow' || column.type === 'detailButtonInRow'\">\n                  <div fxLayoutAlign=\"center center\" class=\"o-action-cell-renderer\"\n                    (click)=\"onDetailButtonClick(column, row, $event)\">\n                    <mat-icon>{{ getDetailButtonIcon(column) }}</mat-icon>\n                  </div>\n                </ng-container>\n                <ng-container *ngSwitchDefault>{{ row[column.name] }}</ng-container>\n              </ng-container>\n\n            </div>\n          </td>\n          <!--Define mat-footer-cell-->\n          <ng-container *ngIf=\"showTotals | async\">\n            <td mat-footer-cell *matFooterCellDef [ngClass]=\"column.className\">\n              <div class=\"title\" *ngIf=\"column.aggregate && column.aggregate.title\">\n                {{ column.aggregate.title | oTranslate }}\n              </div>\n              <ng-container *ngIf=\"!column.renderer\">\n                {{ dataSource.getAggregateData(column) }}\n              </ng-container>\n              <ng-template *ngIf=\"column.renderer && column.aggregate\" [ngTemplateOutlet]=\"column.renderer.templateref\"\n                [ngTemplateOutletContext]=\"{cellvalue: dataSource.getAggregateData(column)}\"></ng-template>\n            </td>\n          </ng-container>\n\n        </ng-container>\n\n        <!--FOOTER-INSERTABLE-->\n        <ng-container *ngIf=\"showLastInsertableRow && oTableInsertableRowComponent\">\n          <ng-container [matColumnDef]=\"oTableOptions.selectColumn.name + getSuffixColumnInsertable()\"\n            *ngIf=\"oTableOptions.selectColumn.visible\">\n            <td mat-footer-cell *matFooterCellDef>\n            </td>\n          </ng-container>\n          <ng-container *ngFor=\"let column of oTableOptions.columns\"\n            [matColumnDef]=\"column.name+ getSuffixColumnInsertable()\">\n\n            <td mat-footer-cell *matFooterCellDef [ngClass]=\"column.className\">\n              <ng-container\n                *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && !oTableInsertableRowComponent.useCellEditor(column)\">\n                <mat-form-field class=\"insertable-form-field\" [hideRequiredMarker]=\"false\" floatLabel=\"never\">\n                  <input matInput type=\"text\" [placeholder]=\"oTableInsertableRowComponent.getPlaceholder(column)\"\n                    [id]=\"column.attr\" [formControl]=\"oTableInsertableRowComponent.getControl(column)\"\n                    [required]=\"oTableInsertableRowComponent.isColumnRequired(column)\">\n                  <mat-error *ngIf=\"oTableInsertableRowComponent.columnHasError(column, 'required')\">\n                    {{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\n                  </mat-error>\n                </mat-form-field>\n              </ng-container>\n\n              <ng-container\n                *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && oTableInsertableRowComponent.useCellEditor(column)\">\n                <ng-template [ngTemplateOutlet]=\"oTableInsertableRowComponent.columnEditors[column.attr].templateref\"\n                  [ngTemplateOutletContext]=\"{ rowvalue: oTableInsertableRowComponent.rowData }\">\n                </ng-template>\n              </ng-container>\n            </td>\n          </ng-container>\n\n        </ng-container>\n\n        <ng-container *ngIf=\"showFirstInsertableRow && oTableInsertableRowComponent\">\n          <ng-container [matColumnDef]=\"getColumnInsertable(oTableOptions.selectColumn.name)\"\n            *ngIf=\"oTableOptions.selectColumn.visible\">\n            <td mat-header-cell *matHeaderCellDef>\n            </td>\n          </ng-container>\n          <ng-container *ngFor=\"let column of oTableOptions.columns\" [matColumnDef]=\"getColumnInsertable(column.name)\">\n\n            <td mat-header-cell *matHeaderCellDef [ngClass]=\"column.className\">\n              <ng-container\n                *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && !oTableInsertableRowComponent.useCellEditor(column)\">\n                <mat-form-field class=\"insertable-form-field\" [hideRequiredMarker]=\"false\" floatLabel=\"never\">\n                  <input matInput type=\"text\" [placeholder]=\"oTableInsertableRowComponent.getPlaceholder(column)\"\n                    [id]=\"column.attr\" [formControl]=\"oTableInsertableRowComponent.getControl(column)\"\n                    [required]=\"oTableInsertableRowComponent.isColumnRequired(column)\">\n                  <mat-error *ngIf=\"oTableInsertableRowComponent.columnHasError(column, 'required')\">\n                    {{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\n                  </mat-error>\n                </mat-form-field>\n              </ng-container>\n\n              <ng-container\n                *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && oTableInsertableRowComponent.useCellEditor(column)\">\n                <ng-template [ngTemplateOutlet]=\"oTableInsertableRowComponent.columnEditors[column.attr].templateref\"\n                  [ngTemplateOutletContext]=\"{ rowvalue: oTableInsertableRowComponent.rowData }\">\n                </ng-template>\n              </ng-container>\n            </td>\n          </ng-container>\n\n        </ng-container>\n\n\n        <tr #tableHeader mat-header-row *matHeaderRowDef=\"oTableOptions.visibleColumns; sticky: fixedHeader\"></tr>\n\n        <tr mat-row oTableRow *matRowDef=\"let row; columns: oTableOptions.visibleColumns;let i = index;\"\n          (click)=\"handleClick(row, $event)\" (dblclick)=\"handleDoubleClick(row, $event)\"\n          [class.selected]=\"isRowSelected(row)\" [ngClass]=\"row | oTableRowClass: i: rowClass\">\n        </tr>\n        <ng-container *ngIf=\"showLastInsertableRow\">\n          <tr mat-footer-row *matFooterRowDef=\"oTableOptions.columnsInsertables; sticky: true\"\n            (keyup)=\"oTableInsertableRowComponent.handleKeyboardEvent($event)\" class=\"o-table-insertable\"></tr>\n        </ng-container>\n        <ng-container *ngIf=\"showFirstInsertableRow\">\n          <tr mat-header-row *matHeaderRowDef=\"oTableOptions.columnsInsertables; sticky: true\"\n            (keyup)=\"oTableInsertableRowComponent.handleKeyboardEvent($event)\" class=\"o-table-insertable\"> </tr>\n        </ng-container>\n        <ng-container *ngIf=\"showTotals | async\">\n          <tr mat-footer-row *matFooterRowDef=\"oTableOptions.visibleColumns; sticky: true\" class=\"o-table-aggregate\">\n          </tr>\n        </ng-container>\n      </table>\n    </div>\n  </div>\n\n  <!--TABLE PAGINATOR-->\n  <mat-paginator *ngIf=\"paginator\" #matpaginator [length]=\"dataSource?.resultsLength\" [pageIndex]=\"paginator.pageIndex\"\n    [pageSize]=\"queryRows\" [pageSizeOptions]=\"paginator.pageSizeOptions\" (page)=\"onChangePage($event)\"\n    [showFirstLastButtons]=\"paginator.showFirstLastButtons\">\n  </mat-paginator>\n\n  <!--LOADING-->\n  <div #spinnerContainer *ngIf=\"showLoading | async\" fxLayout=\"column\" fxLayoutAlign=\"center center\"\n    [ngStyle]=\"{'top.px': headerHeight}\" class=\"spinner-container\"\n    [class.spinner-container-scrollable]=\"loadingScroll | async\">\n    <mat-progress-spinner mode=\"indeterminate\" strokeWidth=\"3\" [diameter]=\"diameterSpinner\"></mat-progress-spinner>\n  </div>\n\n  <!-- Disable blocker -->\n  <div *ngIf=\"!enabled\" class=\"o-table-disabled-blocker\"></div>\n</div>",
                    providers: [
                        OntimizeServiceProvider,
                        OTableDataSourceService
                    ],
                    inputs: DEFAULT_INPUTS_O_TABLE,
                    outputs: DEFAULT_OUTPUTS_O_TABLE,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.o-table]': 'true',
                        '[class.ontimize-table]': 'true',
                        '[class.o-table-fixed]': 'fixedHeader',
                        '[class.o-table-disabled]': '!enabled',
                        '(document:click)': 'handleDOMClick($event)'
                    },
                    styles: [".o-table{height:100%;max-height:100%;width:100%}.o-table.o-table-disabled{opacity:.4}.o-table .o-table-container{height:100%;display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:flex-start;align-items:flex-start;align-content:stretch;min-width:100%;min-height:100%;position:relative;padding:0 .5%}.o-table .o-table-container .o-table-body .o-table-overflow{overflow-y:auto;min-width:100%}.o-table .o-table-container .o-table-body thead .mat-header-row th:last-child .o-table-column-resizer{display:none}.o-table .o-table-container.block-events{pointer-events:none}.o-table .o-table-container.block-events>.o-table-body .mat-header-row,.o-table .o-table-container.block-events>.toolbar{opacity:.75}.o-table .o-table-container .toolbar{height:40px}.o-table .o-table-container .toolbar>div{max-height:100%}.o-table .o-table-container .toolbar .buttons{margin:0 10px 0 4px}.o-table .o-table-container .toolbar .table-title{font-size:18px;font-weight:400;text-align:center}.o-table .o-table-container .o-table-body{display:flex;flex:1 1 auto;max-width:100%;height:100%;overflow:hidden;position:relative}.o-table .o-table-container .o-table-body:not(.horizontal-scroll){overflow-x:hidden}.o-table .o-table-container .o-table-body .table-title{font-size:18px;font-weight:400;text-align:center}.o-table .o-table-container .o-table-body .spinner-container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:500;visibility:visible;opacity:1;transition:opacity .25s linear}.o-table .o-table-container .o-table-body.horizontal-scroll{overflow-x:auto;padding-bottom:16px}.o-table .o-table-container .o-table-body.horizontal-scroll .mat-header-cell{width:150px}.o-table .o-table-container .o-table-body .o-table-no-results{cursor:default;text-align:center}.o-table .o-table-container .o-table-body .o-table-no-results td{text-align:center}.o-table .o-table-container .mat-table{table-layout:fixed;width:100%}.o-table .o-table-container .mat-table.autoadjusted{overflow:auto;height:auto}.o-table .o-table-container .mat-table.autoadjusted td .content,.o-table .o-table-container .mat-table.autoadjusted th .content{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;display:block}.o-table .o-table-container .mat-table.small .column-filter-icon,.o-table .o-table-container .mat-table.small .mat-sort-header-arrow{margin-top:2px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-checkbox-inner-container,.o-table .o-table-container .mat-table.small .mat-row .mat-checkbox-inner-container{height:16px;width:16px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path,.o-table .o-table-container .mat-table.small .mat-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path{width:2.13333px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-checkbox-inner-container .mat-checkbox-mixedmark,.o-table .o-table-container .mat-table.small .mat-row .mat-checkbox-inner-container .mat-checkbox-mixedmark{height:2px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.small .mat-header-row .mat-header-cell .image-avatar,.o-table .o-table-container .mat-table.small .mat-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.small .mat-row .mat-header-cell .image-avatar{width:22px;height:22px}.o-table .o-table-container .mat-table.medium .column-filter-icon{margin-top:4px}.o-table .o-table-container .mat-table.medium .mat-sort-header-arrow{margin-top:6px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.medium .mat-header-row .mat-header-cell .image-avatar,.o-table .o-table-container .mat-table.medium .mat-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.medium .mat-row .mat-header-cell .image-avatar{width:28px;height:28px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-checkbox-inner-container,.o-table .o-table-container .mat-table.medium .mat-row .mat-checkbox-inner-container{height:18px;width:18px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path,.o-table .o-table-container .mat-table.medium .mat-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path{width:2.4px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-checkbox-inner-container .mat-checkbox-mixedmark,.o-table .o-table-container .mat-table.medium .mat-row .mat-checkbox-inner-container .mat-checkbox-mixedmark{height:2px}.o-table .o-table-container .mat-table.large .column-filter-icon,.o-table .o-table-container .mat-table.large .mat-sort-header-arrow{margin-top:8px}.o-table .o-table-container .mat-table .mat-row{box-sizing:border-box;transition:background-color .2s;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.o-table .o-table-container .mat-table .mat-row .mat-cell{padding:0 12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.o-table .o-table-container .mat-table .mat-row .mat-cell:not(.o-column-image):first-of-type{padding-left:24px}.o-table .o-table-container .mat-table .mat-row .mat-cell:last-of-type{padding-right:24px}.o-table .o-table-container .mat-table .mat-row .mat-cell.empty-cell{min-height:16px}.o-table .o-table-container .mat-table .mat-row .mat-cell .action-cell-renderer{cursor:pointer}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-start{text-align:start}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-center{text-align:center}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-end{text-align:end}.o-table .o-table-container .mat-table .mat-row .mat-cell *{vertical-align:middle}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-mat-cell-multiline{overflow:initial;white-space:normal;text-overflow:unset}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-mat-cell-multiline:not(.mat-header-cell){padding:6px 12px}.o-table .o-table-container .mat-table .mat-row .mat-cell .image-avatar{width:34px;height:34px;margin:1px auto;overflow:hidden;border-radius:50%;position:relative;z-index:1}.o-table .o-table-container .mat-table .mat-row .mat-cell .image-avatar img{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%;max-width:inherit;max-height:inherit}.o-table .o-table-container .mat-table .o-action-cell-renderer{display:inline-block;cursor:pointer}.o-table .o-table-container .mat-table .mat-header-cell{overflow:hidden;position:relative;box-sizing:border-box;padding:0 12px;vertical-align:middle}.o-table .o-table-container .mat-table .mat-header-cell.resizable{padding-right:24px}.o-table .o-table-container .mat-table .mat-header-cell:first-of-type,.o-table .o-table-container .mat-table .mat-header-cell:last-of-type{padding-left:0;padding-right:0}.o-table .o-table-container .mat-table .mat-header-cell:not(.o-column-image){overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.o-table .o-table-container .mat-table .mat-header-cell.o-mat-cell-multiline{overflow:initial;white-space:normal;text-overflow:unset}.o-table .o-table-container .mat-table .mat-header-cell.o-mat-cell-multiline:not(.mat-header-cell){padding:6px 12px}.o-table .o-table-container .mat-table .mat-header-cell .column-filter-icon{cursor:pointer;float:left;font-size:20px;width:20px;height:20px;margin-right:2px;line-height:1}.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-button{flex:1;display:block;place-content:center}.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-arrow{position:absolute;right:0}.o-table .o-table-container .mat-table .mat-header-cell .header-title-container{cursor:default}.o-table .o-table-container .mat-table .mat-header-cell.resizable .mat-sort-header-arrow{margin-right:12px}.o-table .o-table-container .mat-table .mat-header-cell .header-title-container,.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.o-table .o-table-container .mat-table .mat-header-cell.start,.o-table .o-table-container .mat-table .mat-header-cell.start .mat-sort-header-button{text-align:left}.o-table .o-table-container .mat-table .mat-header-cell.center,.o-table .o-table-container .mat-table .mat-header-cell.center .mat-sort-header-button{text-align:center}.o-table .o-table-container .mat-table .mat-header-cell.center [o-mat-sort-header] .mat-sort-header-button{padding-left:12px}.o-table .o-table-container .mat-table .mat-header-cell.end,.o-table .o-table-container .mat-table .mat-header-cell.end .mat-sort-header-button{text-align:right}.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-container{padding-top:4px}.o-table .o-table-container .mat-table .mat-cell.mat-column-select,.o-table .o-table-container .mat-table .mat-header-cell.mat-column-select{width:18px;box-sizing:content-box;padding:0 0 0 24px;overflow:initial}.o-table .o-table-container .o-table-disabled-blocker{bottom:0;left:0;position:absolute;right:0;top:0;z-index:100}.o-table .spinner-container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:500;visibility:visible;opacity:1;transition:opacity .25s linear}.o-table .spinner-container-scrollable{position:relative}.o-table.o-table-fixed{display:flex}.o-table.o-table-fixed .o-table-container{display:flex;flex-direction:column}.o-table.o-table-fixed .o-table-body{display:flex;flex:1}.o-table.o-table-fixed .o-table-body .o-table-overflow{flex:1;overflow:auto}.mat-tooltip.o-table-cell-tooltip{word-wrap:break-word;max-height:64px;overflow:hidden;min-width:140px}"]
                }] }
    ];
    OTableComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: MatDialog },
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] }
    ]; };
    OTableComponent.propDecorators = {
        matpaginator: [{ type: ViewChild, args: [MatPaginator, { static: false },] }],
        sort: [{ type: ViewChild, args: [OMatSort, { static: true },] }],
        sortHeaders: [{ type: ViewChildren, args: [OMatSortHeader,] }],
        spinnerContainer: [{ type: ViewChild, args: ['spinnerContainer', { read: ElementRef, static: false },] }],
        tableBodyEl: [{ type: ViewChild, args: ['tableBody', { static: false },] }],
        tableHeaderEl: [{ type: ViewChild, args: ['tableHeader', { read: ElementRef, static: false },] }],
        tableToolbarEl: [{ type: ViewChild, args: ['tableToolbar', { read: ElementRef, static: false },] }],
        oTableMenu: [{ type: ViewChild, args: ['tableMenu', { static: false },] }],
        tableOptions: [{ type: ContentChildren, args: [OTableOptionComponent,] }],
        oTableButtons: [{ type: ViewChild, args: ['tableButtons', { static: false },] }],
        tableButtons: [{ type: ContentChildren, args: ['o-table-button',] }],
        quickfilterContentChild: [{ type: ContentChild, args: ['o-table-quickfilter', { static: true },] }],
        exportOptsTemplate: [{ type: ViewChild, args: ['exportOptsTemplate', { static: false },] }],
        updateScrolledState: [{ type: HostListener, args: ['window:resize', [],] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "selectAllCheckbox", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "exportButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "showConfigurationOption", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "columnsVisibilityButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "showFilterOption", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "showButtonsText", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean),
        tslib_1.__metadata("design:paramtypes", [Boolean])
    ], OTableComponent.prototype, "filterCaseSensitive", null);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "insertButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "refreshButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "deleteButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "paginationControls", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "fixedHeader", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "showTitle", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "horizontalScroll", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "showPaginatorFirstLastButtons", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "autoAlignTitles", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "multipleSort", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "orderable", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "resizable", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "autoAdjust", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableComponent.prototype, "keepSelectedItems", void 0);
    return OTableComponent;
}(OServiceComponent));
export { OTableComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBR1IsUUFBUSxFQUNSLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFxQixTQUFTLEVBQVcsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUN4SCxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNwRixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBVXBGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUdsRSxPQUFPLEVBQUUseUJBQXlCLEVBQXNCLE1BQU0sd0NBQXdDLENBQUM7QUFRdkcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFN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RUFBRTtxQ0FHcEQsU0FBUyxTQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtzQ0FHakQsWUFBWSxTQUFDLGVBQWUsRUFBRSxFQUFFOztJQS9PakM7UUFEQyxjQUFjLEVBQUU7OzhEQUNrQjtJQUVuQztRQURDLGNBQWMsRUFBRTs7eURBQ1k7SUFFN0I7UUFEQyxjQUFjLEVBQUU7O29FQUN1QjtJQUV4QztRQURDLGNBQWMsRUFBRTs7b0VBQ3VCO0lBRXhDO1FBREMsY0FBYyxFQUFFOzs2REFDZ0I7SUFFakM7UUFEQyxjQUFjLEVBQUU7OzREQUNlO0lBd0JoQztRQURDLGNBQWMsRUFBRTs7OzhEQU1oQjtJQUtEO1FBREMsY0FBYyxFQUFFOzt5REFDWTtJQUU3QjtRQURDLGNBQWMsRUFBRTs7MERBQ2E7SUFFOUI7UUFEQyxjQUFjLEVBQUU7O3lEQUNZO0lBRTdCO1FBREMsY0FBYyxFQUFFOzsrREFDa0I7SUFFbkM7UUFEQyxjQUFjLEVBQUU7O3dEQUNZO0lBRTdCO1FBREMsY0FBYyxFQUFFOztzREFDVTtJQUkzQjtRQURDLGNBQWMsRUFBRTs7NkRBQ2lCO0lBRWxDO1FBREMsY0FBYyxFQUFFOzswRUFDNkI7SUFFOUM7UUFEQyxjQUFjLEVBQUU7OzREQUNnQjtJQUVqQztRQURDLGNBQWMsRUFBRTs7eURBQ1k7SUFFN0I7UUFEQyxjQUFjLEVBQUU7O3NEQUNTO0lBRTFCO1FBREMsY0FBYyxFQUFFOztzREFDUztJQUUxQjtRQURDLGNBQWMsRUFBRTs7dURBQ1U7SUF1QjNCO1FBREMsY0FBYyxFQUFFOzs4REFDaUI7SUEyM0RwQyxzQkFBQztDQUFBLEFBNWdFRCxDQW9CcUMsaUJBQWlCLEdBdy9EckQ7U0F4L0RZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWxlY3Rpb25DaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld1JlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdENoZWNrYm94Q2hhbmdlLCBNYXREaWFsb2csIE1hdE1lbnUsIE1hdFBhZ2luYXRvciwgTWF0VGFiLCBNYXRUYWJHcm91cCwgUGFnZUV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEJvb2xlYW5Db252ZXJ0ZXIsIElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgU2VydmljZVJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBJT0NvbnRleHRNZW51Q29udGV4dCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1jb250ZXh0LW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1idXR0b24uaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtYnV0dG9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlRGF0YVNvdXJjZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1kYXRhc291cmNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVNZW51IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLXBhZ2luYXRvci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUXVpY2tmaWx0ZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtcXVpY2tmaWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZmFjdG9yaWVzJztcbmltcG9ydCB7IFNuYWNrQmFyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NuYWNrYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uL3R5cGVzL2V4cHJlc3Npb24udHlwZSc7XG5pbXBvcnQgeyBPQ29sdW1uQWdncmVnYXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMvby1jb2x1bW4tYWdncmVnYXRlLnR5cGUnO1xuaW1wb3J0IHsgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvciwgT0NvbHVtblZhbHVlRmlsdGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvby1jb2x1bW4tdmFsdWUtZmlsdGVyLnR5cGUnO1xuaW1wb3J0IHsgT1Blcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZUluaXRpYWxpemF0aW9uT3B0aW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tdGFibGUtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZU1lbnVQZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tdGFibGUtbWVudS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby10YWJsZS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuaW1wb3J0IHsgUXVpY2tGaWx0ZXJGdW5jdGlvbiB9IGZyb20gJy4uLy4uL3R5cGVzL3F1aWNrLWZpbHRlci1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IFNRTE9yZGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvc3FsLW9yZGVyLnR5cGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZVdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlsL2FzeW5jJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBTUUxUeXBlcyB9IGZyb20gJy4uLy4uL3V0aWwvc3FsdHlwZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVDb21wb25lbnQgfSBmcm9tICcuLi9jb250ZXh0bWVudS9vLWNvbnRleHQtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0NPTVBPTkVOVCwgT1NlcnZpY2VDb21wb25lbnQgfSBmcm9tICcuLi9vLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9jYWxjdWxhdGVkL28tdGFibGUtY29sdW1uLWNhbGN1bGF0ZWQuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuL2NvbHVtbi9vLWNvbHVtbi5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGVmYXVsdE9UYWJsZU9wdGlvbnMgfSBmcm9tICcuL2V4dGVuc2lvbnMvZGVmYXVsdC1vLXRhYmxlLW9wdGlvbnMuY2xhc3MnO1xuaW1wb3J0IHtcbiAgT1RhYmxlRmlsdGVyQnlDb2x1bW5EYXRhRGlhbG9nQ29tcG9uZW50XG59IGZyb20gJy4vZXh0ZW5zaW9ucy9kaWFsb2cvZmlsdGVyLWJ5LWNvbHVtbi9vLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9CYXNlVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL3BhZ2luYXRvci9vLWJhc2UtdGFibGUtcGFnaW5hdG9yLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWNvbHVtbnMtZmlsdGVyL28tdGFibGUtY29sdW1ucy1maWx0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWluc2VydGFibGUtcm93L28tdGFibGUtaW5zZXJ0YWJsZS1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtb3B0aW9uL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVEYXRhU291cmNlU2VydmljZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9vLXRhYmxlLWRhdGFzb3VyY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVTdG9yYWdlIH0gZnJvbSAnLi9leHRlbnNpb25zL28tdGFibGUtc3RvcmFnZS5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVEYW8gfSBmcm9tICcuL2V4dGVuc2lvbnMvby10YWJsZS5kYW8nO1xuaW1wb3J0IHsgT01hdFNvcnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvc29ydC9vLW1hdC1zb3J0JztcbmltcG9ydCB7IE9NYXRTb3J0SGVhZGVyIH0gZnJvbSAnLi9leHRlbnNpb25zL3NvcnQvby1tYXQtc29ydC1oZWFkZXInO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0NPTVBPTkVOVCxcblxuICAvLyB2aXNpYmxlLWNvbHVtbnMgW3N0cmluZ106IHZpc2libGUgY29sdW1ucywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICd2aXNpYmxlQ29sdW1uczogdmlzaWJsZS1jb2x1bW5zJyxcblxuICAvLyBlZGl0YWJsZS1jb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIHRoYXQgY2FuIGJlIGVkaXRlZCBkaXJlY3RseSBvdmVyIHRoZSB0YWJsZSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gIC8vICdlZGl0YWJsZUNvbHVtbnM6IGVkaXRhYmxlLWNvbHVtbnMnLFxuXG4gIC8vIHNvcnQtY29sdW1ucyBbc3RyaW5nXTogaW5pdGlhbCBzb3J0aW5nLCB3aXRoIHRoZSBmb3JtYXQgY29sdW1uOltBU0N8REVTQ10sIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc29ydENvbHVtbnM6IHNvcnQtY29sdW1ucycsXG5cbiAgJ3F1aWNrRmlsdGVyQ2FsbGJhY2s6IHF1aWNrLWZpbHRlci1mdW5jdGlvbicsXG5cbiAgLy8gZGVsZXRlLWJ1dHRvbiBbbm98eWVzXTogc2hvdyBkZWxldGUgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdkZWxldGVCdXR0b246IGRlbGV0ZS1idXR0b24nLFxuXG4gIC8vIHJlZnJlc2gtYnV0dG9uIFtub3x5ZXNdOiBzaG93IHJlZnJlc2ggYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdyZWZyZXNoQnV0dG9uOiByZWZyZXNoLWJ1dHRvbicsXG5cbiAgLy8gY29sdW1ucy12aXNpYmlsaXR5LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBjb2x1bW5zIHZpc2liaWxpdHkgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbjogY29sdW1ucy12aXNpYmlsaXR5LWJ1dHRvbicsXG5cbiAgLy8gLy8gY29sdW1ucy1yZXNpemUtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGNvbHVtbnMgcmVzaXplIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAvLyAnY29sdW1uc1Jlc2l6ZUJ1dHRvbjogY29sdW1ucy1yZXNpemUtYnV0dG9uJyxcblxuICAvLyAvLyBjb2x1bW5zLWdyb3VwLWJ1dHRvbiBbbm98eWVzXTogc2hvdyBjb2x1bW5zIGdyb3VwIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAvLyAnY29sdW1uc0dyb3VwQnV0dG9uOiBjb2x1bW5zLWdyb3VwLWJ1dHRvbicsXG5cbiAgLy8gZXhwb3J0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBleHBvcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdleHBvcnRCdXR0b246IGV4cG9ydC1idXR0b24nLFxuXG4gIC8vIHNob3ctY29uZmlndXJhdGlvbi1vcHRpb24gW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBjb25maWd1cmF0aW9uIGJ1dHRvbiBpbiBoZWFkZXIuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dDb25maWd1cmF0aW9uT3B0aW9uOiBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uJyxcblxuICAvLyBzaG93LWJ1dHRvbnMtdGV4dCBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHRleHQgb2YgaGVhZGVyIGJ1dHRvbnMuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dCdXR0b25zVGV4dDogc2hvdy1idXR0b25zLXRleHQnLFxuXG4gIC8vIHNlbGVjdC1hbGwtY2hlY2tib3ggW3llc3xub3x0cnVlfGZhbHNlXTogIHNob3cgaW4gdGhlIG1lbnUgdGhlIG9wdGlvbiBvZiBzZWxlY3Rpb24gY2hlY2sgYm94ZXMgLiBEZWZhdWx0OiBuby5cbiAgJ3NlbGVjdEFsbENoZWNrYm94OiBzZWxlY3QtYWxsLWNoZWNrYm94JyxcblxuICAvLyBwYWdpbmF0aW9uLWNvbnRyb2xzIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgcGFnaW5hdGlvbiBjb250cm9scy4gRGVmYXVsdDogeWVzLlxuICAncGFnaW5hdGlvbkNvbnRyb2xzOiBwYWdpbmF0aW9uLWNvbnRyb2xzJyxcblxuICAvLyBmaXgtaGVhZGVyIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IGZpeGVkIGhlYWRlciBhbmQgZm9vdGVyIHdoZW4gdGhlIGNvbnRlbnQgaXMgZ3JlYXRoZXIgdGhhbiBpdHMgb3duIGhlaWdodC4gRGVmYXVsdDogbm8uXG4gICdmaXhlZEhlYWRlcjogZml4ZWQtaGVhZGVyJyxcblxuICAvLyBzaG93LXRpdGxlIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgdGhlIHRhYmxlIHRpdGxlLiBEZWZhdWx0OiBuby5cbiAgJ3Nob3dUaXRsZTogc2hvdy10aXRsZScsXG5cbiAgLy8gZWRpdGlvbi1tb2RlIFtub25lIHwgaW5saW5lIHwgY2xpY2sgfCBkYmxjbGlja106IGVkaXRpb24gbW9kZS4gRGVmYXVsdCBub25lXG4gICdlZGl0aW9uTW9kZTogZWRpdGlvbi1tb2RlJyxcblxuICAvLyBzZWxlY3Rpb24tbW9kZSBbbm9uZSB8IHNpbXBsZSB8IG11bHRpcGxlIF06IHNlbGVjdGlvbiBtb2RlLiBEZWZhdWx0IG11bHRpcGxlXG4gICdzZWxlY3Rpb25Nb2RlOiBzZWxlY3Rpb24tbW9kZScsXG5cbiAgJ2hvcml6b250YWxTY3JvbGw6IGhvcml6b250YWwtc2Nyb2xsJyxcblxuICAnc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM6IHNob3ctcGFnaW5hdG9yLWZpcnN0LWxhc3QtYnV0dG9ucycsXG5cbiAgJ2F1dG9BbGlnblRpdGxlczogYXV0by1hbGlnbi10aXRsZXMnLFxuXG4gICdtdWx0aXBsZVNvcnQ6IG11bHRpcGxlLXNvcnQnLFxuICAvLyBzZWxlY3QtYWxsLWNoZWNrYm94LXZpc2libGUgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBzZWxlY3Rpb24gY2hlY2sgYm94ZXMuRGVmYXVsdDogbm8uXG4gICdzZWxlY3RBbGxDaGVja2JveFZpc2libGU6IHNlbGVjdC1hbGwtY2hlY2tib3gtdmlzaWJsZScsXG5cbiAgJ29yZGVyYWJsZScsXG5cbiAgJ3Jlc2l6YWJsZScsXG5cbiAgLy8gZW5hYmxlZCBbeWVzfG5vfHRydWV8ZmFsc2VdOiBlbmFibGVzIGRlIHRhYmxlLiBEZWZhdWx0OiB5ZXNcbiAgJ2VuYWJsZWQnLFxuXG4gICdrZWVwU2VsZWN0ZWRJdGVtczoga2VlcC1zZWxlY3RlZC1pdGVtcycsXG5cbiAgLy8gZXhwb3J0LW1vZGUgWyd2aXNpYmxlJ3wnbG9jYWwnfCdhbGwnXTogc2V0cyB0aGUgbW9kZSB0byBleHBvcnQgZGF0YS4gRGVmYXVsdDogJ3Zpc2libGUnXG4gICdleHBvcnRNb2RlOiBleHBvcnQtbW9kZScsXG5cbiAgLy8gZXhwb3J0U2VydmljZVR5cGUgWyBzdHJpbmcgXTogVGhlIHNlcnZpY2UgdXNlZCBieSB0aGUgdGFibGUgZm9yIGV4cG9ydGluZyBpdCdzIGRhdGEsIGl0IG11c3QgaW1wbGVtZW50ICdJRXhwb3J0U2VydmljZScgaW50ZXJmYWNlLiBEZWZhdWx0OiAnT250aW1pemVFeHBvcnRTZXJ2aWNlJ1xuICAnZXhwb3J0U2VydmljZVR5cGU6IGV4cG9ydC1zZXJ2aWNlLXR5cGUnLFxuXG4gIC8vIGF1dG8tYWRqdXN0IFt0cnVlfGZhbHNlXTogQXV0byBhZGp1c3QgY29sdW1uIHdpZHRoIHRvIGZpdCBpdHMgY29udGVudC4gRGVmYXVsdDogdHJ1ZVxuICAnYXV0b0FkanVzdDogYXV0by1hZGp1c3QnLFxuXG4gIC8vIHNob3ctZmlsdGVyLW9wdGlvbiBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IGZpbHRlciBtZW51IG9wdGlvbiBpbiB0aGUgaGVhZGVyIG1lbnUuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dGaWx0ZXJPcHRpb246IHNob3ctZmlsdGVyLW9wdGlvbicsXG5cbiAgLy8gdmlzaWJsZS1leHBvcnQtZGlhbG9nLWJ1dHRvbnMgW3N0cmluZ106IHZpc2libGUgYnV0dG9ucyBpbiBleHBvcnQgZGlhbG9nLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0L25vIGNvbmZpZ3VyZWQ6IHNob3cgYWxsLiBFbXB0eSB2YWx1ZTogaGlkZSBhbGwuXG4gICd2aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9uczogdmlzaWJsZS1leHBvcnQtZGlhbG9nLWJ1dHRvbnMnLFxuXG4gIC8vIHJvdy1jbGFzcyBbZnVuY3Rpb24sIChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHN0cmluZ1tdXTogYWRkcyB0aGUgY2xhc3Mgb3IgY2xhc3NlcyByZXR1cm5lZCBieSB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gdG8gdGhlIHRhYmxlIHJvd3MuXG4gICdyb3dDbGFzczogcm93LWNsYXNzJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFID0gW1xuICAnb25DbGljaycsXG4gICdvbkRvdWJsZUNsaWNrJyxcbiAgJ29uUm93U2VsZWN0ZWQnLFxuICAnb25Sb3dEZXNlbGVjdGVkJyxcbiAgJ29uUm93RGVsZXRlZCcsXG4gICdvbkRhdGFMb2FkZWQnLFxuICAnb25QYWdpbmF0ZWREYXRhTG9hZGVkJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlcixcbiAgICBPVGFibGVEYXRhU291cmNlU2VydmljZVxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEUsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vbnRpbWl6ZS10YWJsZV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLXRhYmxlLWZpeGVkXSc6ICdmaXhlZEhlYWRlcicsXG4gICAgJ1tjbGFzcy5vLXRhYmxlLWRpc2FibGVkXSc6ICchZW5hYmxlZCcsXG4gICAgJyhkb2N1bWVudDpjbGljayknOiAnaGFuZGxlRE9NQ2xpY2soJGV2ZW50KSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDb21wb25lbnQgZXh0ZW5kcyBPU2VydmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfQkFTRV9TSVpFX1NQSU5ORVIgPSAxMDA7XG4gIHB1YmxpYyBzdGF0aWMgRklSU1RfTEFTVF9DRUxMX1BBRERJTkcgPSAyNDtcblxuICBwcm90ZWN0ZWQgc25hY2tCYXJTZXJ2aWNlOiBTbmFja0JhclNlcnZpY2U7XG5cbiAgcHVibGljIHBhZ2luYXRvcjogT1RhYmxlUGFnaW5hdG9yO1xuICBAVmlld0NoaWxkKE1hdFBhZ2luYXRvciwgeyBzdGF0aWM6IGZhbHNlIH0pIG1hdHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xuICBAVmlld0NoaWxkKE9NYXRTb3J0LCB7IHN0YXRpYzogdHJ1ZSB9KSBzb3J0OiBPTWF0U29ydDtcblxuICAvLyBvbmx5IGZvciBpbnNpZGVUYWJCdWdXb3JrYXJvdW5kXG4gIEBWaWV3Q2hpbGRyZW4oT01hdFNvcnRIZWFkZXIpIHByb3RlY3RlZCBzb3J0SGVhZGVyczogUXVlcnlMaXN0PE9NYXRTb3J0SGVhZGVyPjtcblxuICBAVmlld0NoaWxkKCdzcGlubmVyQ29udGFpbmVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIHNwaW5uZXJDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIGdldCBkaWFtZXRlclNwaW5uZXIoKSB7XG4gICAgY29uc3QgbWluSGVpZ2h0ID0gT1RhYmxlQ29tcG9uZW50LkRFRkFVTFRfQkFTRV9TSVpFX1NQSU5ORVI7XG4gICAgbGV0IGhlaWdodCA9IDA7XG4gICAgaWYgKHRoaXMuc3Bpbm5lckNvbnRhaW5lciAmJiB0aGlzLnNwaW5uZXJDb250YWluZXIubmF0aXZlRWxlbWVudCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5zcGlubmVyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBpZiAoaGVpZ2h0ID4gMCAmJiBoZWlnaHQgPD0gMTAwKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihoZWlnaHQgLSAoaGVpZ2h0ICogMC4xKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaW5IZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRhYmxlQ29udGV4dE1lbnU6IE9Db250ZXh0TWVudUNvbXBvbmVudDtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZWxlY3RBbGxDaGVja2JveDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBleHBvcnRCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0ZpbHRlck9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dCdXR0b25zVGV4dDogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHJvdGVjdGVkIF9vVGFibGVPcHRpb25zOiBPVGFibGVPcHRpb25zO1xuXG4gIGdldCBvVGFibGVPcHRpb25zKCk6IE9UYWJsZU9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vVGFibGVPcHRpb25zO1xuICB9XG5cbiAgc2V0IG9UYWJsZU9wdGlvbnModmFsdWU6IE9UYWJsZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zID0gdmFsdWU7XG4gIH1cblxuICBzZXQgcXVpY2tGaWx0ZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKFN0cmluZyh2YWx1ZSkpO1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5maWx0ZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBxdWlja0ZpbHRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcXVpY2tGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgZmlsdGVyQ2FzZVNlbnNpdGl2ZVB2dDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZXQgZmlsdGVyQ2FzZVNlbnNpdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZVB2dCA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIGlmICh0aGlzLl9vVGFibGVPcHRpb25zKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmZpbHRlckNhc2VTZW5zaXRpdmUgPSB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQ7XG4gICAgfVxuICB9XG4gIGdldCBmaWx0ZXJDYXNlU2Vuc2l0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQ7XG4gIH1cbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5zZXJ0QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcmVmcmVzaEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHBhZ2luYXRpb25Db250cm9sczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGZpeGVkSGVhZGVyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dUaXRsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBlZGl0aW9uTW9kZTogc3RyaW5nID0gQ29kZXMuREVUQUlMX01PREVfTk9ORTtcbiAgc2VsZWN0aW9uTW9kZTogc3RyaW5nID0gQ29kZXMuU0VMRUNUSU9OX01PREVfTVVMVElQTEU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGhvcml6b250YWxTY3JvbGw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBhdXRvQWxpZ25UaXRsZXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgbXVsdGlwbGVTb3J0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgb3JkZXJhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcmVzaXphYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgYXV0b0FkanVzdDogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHJvdGVjdGVkIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XG4gIH1cbiAgc2V0IGVuYWJsZWQodmFsOiBib29sZWFuKSB7XG4gICAgdmFsID0gVXRpbC5wYXJzZUJvb2xlYW4oU3RyaW5nKHZhbCkpO1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTogYm9vbGVhbjtcbiAgc2V0IHNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZSA9IEJvb2xlYW5Db252ZXJ0ZXIodGhpcy5zdGF0ZVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ10pIHx8IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSB0aGlzLl9zZWxlY3RBbGxDaGVja2JveFZpc2libGU7XG4gICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgfVxuXG4gIGdldCBzZWxlY3RBbGxDaGVja2JveFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTtcbiAgfVxuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGtlZXBTZWxlY3RlZEl0ZW1zOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZXhwb3J0TW9kZTogc3RyaW5nID0gQ29kZXMuRVhQT1JUX01PREVfVklTSUJMRTtcbiAgcHVibGljIGV4cG9ydFNlcnZpY2VUeXBlOiBzdHJpbmc7XG4gIHB1YmxpYyB2aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9uczogc3RyaW5nO1xuICBwdWJsaWMgZGFvVGFibGU6IE9UYWJsZURhbyB8IG51bGw7XG4gIHB1YmxpYyBkYXRhU291cmNlOiBPVGFibGVEYXRhU291cmNlIHwgbnVsbDtcbiAgcHVibGljIHZpc2libGVDb2x1bW5zOiBzdHJpbmc7XG4gIHB1YmxpYyBzb3J0Q29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgcm93Q2xhc3M6IChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIF92aXNpYmxlQ29sQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBnZXQgdmlzaWJsZUNvbEFycmF5KCk6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlQ29sQXJyYXk7XG4gIH1cblxuICBzZXQgdmlzaWJsZUNvbEFycmF5KGFyZzogQXJyYXk8YW55Pikge1xuICAgIGNvbnN0IHBlcm1pc3Npb25zQmxvY2tlZCA9IHRoaXMucGVybWlzc2lvbnMgPyB0aGlzLnBlcm1pc3Npb25zLmNvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wudmlzaWJsZSA9PT0gZmFsc2UpLm1hcChjb2wgPT4gY29sLmF0dHIpIDogW107XG4gICAgY29uc3QgcGVybWlzc2lvbnNDaGVja2VkID0gYXJnLmZpbHRlcih2YWx1ZSA9PiBwZXJtaXNzaW9uc0Jsb2NrZWQuaW5kZXhPZih2YWx1ZSkgPT09IC0xKTtcbiAgICB0aGlzLl92aXNpYmxlQ29sQXJyYXkgPSBwZXJtaXNzaW9uc0NoZWNrZWQ7XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5zU2VsZWN0aW9uQ29sID0gdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCkgIT09IC0xO1xuICAgICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uQ29sKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGVDb2xBcnJheS51bnNoaWZ0KENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zID0gdGhpcy5fdmlzaWJsZUNvbEFycmF5O1xuICAgIH1cbiAgfVxuXG4gIHNvcnRDb2xBcnJheTogQXJyYXk8U1FMT3JkZXI+ID0gW107XG4gIC8qZW5kIG9mIHBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgcHJvdGVjdGVkIHRhYkdyb3VwQ29udGFpbmVyOiBNYXRUYWJHcm91cDtcbiAgcHJvdGVjdGVkIHRhYkNvbnRhaW5lcjogTWF0VGFiO1xuICB0YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByb3RlY3RlZCBwZW5kaW5nUXVlcnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIHBlbmRpbmdRdWVyeUZpbHRlciA9IHVuZGVmaW5lZDtcblxuICBwcm90ZWN0ZWQgc2V0U3RhdGljRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgYXZvaWRRdWVyeUNvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIGFzeW5jTG9hZENvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIGFzeW5jTG9hZFN1YnNjcmlwdGlvbnM6IG9iamVjdCA9IHt9O1xuXG4gIHByb3RlY3RlZCBxdWVyeVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgY29udGV4dE1lbnVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Eb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJvd1NlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUm93RGVzZWxlY3RlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJvd0RlbGV0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUGFnaW5hdGVkRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJlaW5pdGlhbGl6ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkNvbnRlbnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25WaXNpYmxlQ29sdW1uc0NoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJvdGVjdGVkIHNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHB1YmxpYyBvVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQ6IE9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudDtcbiAgcHVibGljIG9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQ6IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQ7XG4gIHB1YmxpYyBzaG93RmlsdGVyQnlDb2x1bW5JY29uOiBib29sZWFuID0gZmFsc2U7XG5cblxuICBwcml2YXRlIHNob3dUb3RhbHNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHB1YmxpYyBzaG93VG90YWxzOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5zaG93VG90YWxzU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgcHJpdmF0ZSBsb2FkaW5nU29ydGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHJvdGVjdGVkIGxvYWRpbmdTb3J0aW5nOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5sb2FkaW5nU29ydGluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHByaXZhdGUgbG9hZGluZ1Njcm9sbFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGxvYWRpbmdTY3JvbGw6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTY3JvbGxTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHB1YmxpYyBvVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50OiBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50O1xuICBwdWJsaWMgc2hvd0ZpcnN0SW5zZXJ0YWJsZVJvdzogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgc2hvd0xhc3RJbnNlcnRhYmxlUm93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIGNsaWNrVGltZXI7XG4gIHByb3RlY3RlZCBjbGlja0RlbGF5ID0gMjAwO1xuICBwcm90ZWN0ZWQgY2xpY2tQcmV2ZW50ID0gZmFsc2U7XG4gIHByb3RlY3RlZCBlZGl0aW5nQ2VsbDogYW55O1xuICBwcm90ZWN0ZWQgZWRpdGluZ1JvdzogYW55O1xuXG4gIHByb3RlY3RlZCBfY3VycmVudFBhZ2U6IG51bWJlciA9IDA7XG5cbiAgc2V0IGN1cnJlbnRQYWdlKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSB2YWw7XG4gICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggPSB2YWw7XG4gICAgICBpZiAodGhpcy5tYXRwYWdpbmF0b3IpIHtcbiAgICAgICAgdGhpcy5tYXRwYWdpbmF0b3IucGFnZUluZGV4ID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBjdXJyZW50UGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UGFnZTtcbiAgfVxuXG4gIHB1YmxpYyBvVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudDogT1RhYmxlUXVpY2tmaWx0ZXI7XG4gIHByb3RlY3RlZCBzb3J0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBvblJlbmRlcmVkRGF0YUNoYW5nZTogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgcHJldmlvdXNSZW5kZXJlckRhdGE7XG5cbiAgcXVpY2tGaWx0ZXJDYWxsYmFjazogUXVpY2tGaWx0ZXJGdW5jdGlvbjtcblxuICBAVmlld0NoaWxkKCd0YWJsZUJvZHknLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIHRhYmxlQm9keUVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZUhlYWRlcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICB0YWJsZUhlYWRlckVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZVRvb2xiYXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgdGFibGVUb29sYmFyRWw6IEVsZW1lbnRSZWY7XG5cbiAgaG9yaXpvbnRhbFNjcm9sbGVkOiBib29sZWFuO1xuICBwdWJsaWMgb25VcGRhdGVTY3JvbGxlZFN0YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIHJvd1dpZHRoO1xuXG4gIG9UYWJsZVN0b3JhZ2U6IE9UYWJsZVN0b3JhZ2U7XG4gIHN0b3JlUGFnaW5hdGlvblN0YXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyogSW4gdGhlIGNhc2UgdGhlIHRhYmxlIGhhdmVudCBwYWdpbmF0aW9uQ29udHJvbCBhbmQgcGFnZWFibGUsIHRoZSB0YWJsZSBoYXMgcGFnaW5hdGlvbiB2aXJ0dWFsKi9cbiAgcGFnZVNjcm9sbFZpcnR1YWwgPSAxO1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1RhYmxlUGVybWlzc2lvbnM7XG4gIG1hdE1lbnU6IE1hdE1lbnU7XG5cbiAgQFZpZXdDaGlsZCgndGFibGVNZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIG9UYWJsZU1lbnU6IE9UYWJsZU1lbnU7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihPVGFibGVPcHRpb25Db21wb25lbnQpXG4gIHRhYmxlT3B0aW9uczogUXVlcnlMaXN0PE9UYWJsZU9wdGlvbkNvbXBvbmVudD47XG5cbiAgQFZpZXdDaGlsZCgndGFibGVCdXR0b25zJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIG9UYWJsZUJ1dHRvbnM6IE9UYWJsZUJ1dHRvbnM7XG5cbiAgQENvbnRlbnRDaGlsZHJlbignby10YWJsZS1idXR0b24nKVxuICB0YWJsZUJ1dHRvbnM6IFF1ZXJ5TGlzdDxPVGFibGVCdXR0b24+O1xuXG4gIEBDb250ZW50Q2hpbGQoJ28tdGFibGUtcXVpY2tmaWx0ZXInLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBxdWlja2ZpbHRlckNvbnRlbnRDaGlsZDogT1RhYmxlUXVpY2tmaWx0ZXI7XG5cbiAgQFZpZXdDaGlsZCgnZXhwb3J0T3B0c1RlbXBsYXRlJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGV4cG9ydE9wdHNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgW10pXG4gIHVwZGF0ZVNjcm9sbGVkU3RhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJvZHlXaWR0aCA9IHRoaXMudGFibGVCb2R5RWwubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsV2lkdGggPSB0aGlzLnRhYmxlQm9keUVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSB0aGlzLmhvcml6b250YWxTY3JvbGxlZDtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsZWQgPSBzY3JvbGxXaWR0aCA+IGJvZHlXaWR0aDtcbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUgIT09IHRoaXMuaG9yaXpvbnRhbFNjcm9sbGVkKSB7XG4gICAgICAgICAgdGhpcy5vblVwZGF0ZVNjcm9sbGVkU3RhdGUuZW1pdCh0aGlzLmhvcml6b250YWxTY3JvbGxlZCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2hDb2x1bW5zV2lkdGgoKTtcbiAgICAvLyBpZiAodGhpcy5yZXNpemFibGUpIHtcblxuICAgIC8vIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgZGlhbG9nOiBNYXREaWFsb2csXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnRcbiAgKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGVsUmVmLCBmb3JtKTtcblxuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMgPSBuZXcgRGVmYXVsdE9UYWJsZU9wdGlvbnMoKTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbigpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGFiR3JvdXBDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRUYWJHcm91cCk7XG4gICAgICB0aGlzLnRhYkNvbnRhaW5lciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdFRhYik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIERvIG5vdGhpbmcgZHVlIHRvIG5vdCBhbHdheXMgaXMgY29udGFpbmVkIG9uIHRhYi5cbiAgICB9XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChTbmFja0JhclNlcnZpY2UpO1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZSA9IG5ldyBPVGFibGVTdG9yYWdlKHRoaXMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5hZnRlclZpZXdJbml0KCk7XG4gICAgdGhpcy5pbml0VGFibGVBZnRlclZpZXdJbml0KCk7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5tYXRNZW51ID0gdGhpcy5vVGFibGVNZW51Lm1hdE1lbnU7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUucmVnaXN0ZXJPcHRpb25zKHRoaXMudGFibGVPcHRpb25zLnRvQXJyYXkoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9UYWJsZUJ1dHRvbnMpIHtcbiAgICAgIHRoaXMub1RhYmxlQnV0dG9ucy5yZWdpc3RlckJ1dHRvbnModGhpcy50YWJsZUJ1dHRvbnMudG9BcnJheSgpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldFN1ZmZpeENvbHVtbkluc2VydGFibGUoKSB7XG4gICAgcmV0dXJuIENvZGVzLlNVRkZJWF9DT0xVTU5fSU5TRVJUQUJMRTtcbiAgfVxuXG4gIGdldEFjdGlvbnNQZXJtaXNzaW9ucygpOiBPUGVybWlzc2lvbnNbXSB7XG4gICAgcmV0dXJuIHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICB9XG5cbiAgZ2V0TWVudVBlcm1pc3Npb25zKCk6IE9UYWJsZU1lbnVQZXJtaXNzaW9ucyB7XG4gICAgY29uc3QgcmVzdWx0OiBPVGFibGVNZW51UGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zID8gdGhpcy5wZXJtaXNzaW9ucy5tZW51IDogdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQgOiB7XG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiBbXVxuICAgIH07XG4gIH1cblxuICBnZXRPQ29sdW1uUGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wZXJtaXNzaW9ucyA/ICh0aGlzLnBlcm1pc3Npb25zLmNvbHVtbnMgfHwgW10pIDogW107XG4gICAgcmV0dXJuIGNvbHVtbnMuZmluZChjb21wID0+IGNvbXAuYXR0ciA9PT0gYXR0cikgfHwgeyBhdHRyOiBhdHRyLCBlbmFibGVkOiB0cnVlLCB2aXNpYmxlOiB0cnVlIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0QWN0aW9uUGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBjb25zdCBhY3Rpb25zUGVybSA9IHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICAgIGNvbnN0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSBhY3Rpb25zUGVybS5maW5kKHAgPT4gcC5hdHRyID09PSBhdHRyKTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnMgfHwge1xuICAgICAgYXR0cjogYXR0cixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBlbmFibGVkOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKGF0dHI6IHN0cmluZykge1xuICAgIGNvbnN0IGFjdGlvbnNQZXJtID0gdGhpcy5wZXJtaXNzaW9ucyA/ICh0aGlzLnBlcm1pc3Npb25zLmFjdGlvbnMgfHwgW10pIDogW107XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9IGFjdGlvbnNQZXJtLmZpbmQocCA9PiBwLmF0dHIgPT09IGF0dHIpO1xuICAgIGNvbnN0IGVuYWJsZWRQZXJtaXNpb24gPSBQZXJtaXNzaW9uc1V0aWxzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24ocGVybWlzc2lvbnMpO1xuICAgIGlmICghZW5hYmxlZFBlcm1pc2lvbikge1xuICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuT1BFUkFUSU9OX05PVF9BTExPV0VEX1BFUk1JU1NJT04nKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZWRQZXJtaXNpb247XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHdoYXQgaW5pdGlhbGl6ZSB2YXJzIGFuZCBjb25maWd1cmF0aW9uXG4gICAqL1xuICBpbml0aWFsaXplKCk6IGFueSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucyA9IG5ldyBEZWZhdWx0T1RhYmxlT3B0aW9ucygpO1xuICAgIGlmICh0aGlzLnRhYkdyb3VwQ29udGFpbmVyICYmIHRoaXMudGFiQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyVGFiTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHBhcmFtcyBvZiB0aGUgdGFibGVcbiAgICB0aGlzLmluaXRpYWxpemVQYXJhbXMoKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZURhbygpO1xuXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlLmdldFRhYmxlUGVybWlzc2lvbnModGhpcy5vYXR0ciwgdGhpcy5hY3RSb3V0ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZURhbygpIHtcbiAgICAvLyBDb25maWd1cmUgZGFvIG1ldGhvZHNcbiAgICBjb25zdCBxdWVyeU1ldGhvZE5hbWUgPSB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2Q7XG4gICAgY29uc3QgbWV0aG9kcyA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeU1ldGhvZE5hbWUsXG4gICAgICB1cGRhdGU6IHRoaXMudXBkYXRlTWV0aG9kLFxuICAgICAgZGVsZXRlOiB0aGlzLmRlbGV0ZU1ldGhvZCxcbiAgICAgIGluc2VydDogdGhpcy5pbnNlcnRNZXRob2RcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSkge1xuICAgICAgdGhpcy5xdWVyeU9uQmluZCA9IGZhbHNlO1xuICAgICAgdGhpcy5xdWVyeU9uSW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5kYW9UYWJsZSA9IG5ldyBPVGFibGVEYW8odW5kZWZpbmVkLCB0aGlzLmVudGl0eSwgbWV0aG9kcyk7XG4gICAgICB0aGlzLnNldERhdGFBcnJheSh0aGlzLnN0YXRpY0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZVNlcnZpY2UoKTtcbiAgICAgIHRoaXMuZGFvVGFibGUgPSBuZXcgT1RhYmxlRGFvKHRoaXMuZGF0YVNlcnZpY2UsIHRoaXMuZW50aXR5LCBtZXRob2RzKTtcbiAgICB9XG4gIH1cblxuICByZWluaXRpYWxpemUob3B0aW9uczogT1RhYmxlSW5pdGlhbGl6YXRpb25PcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNsb25lZE9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdlbnRpdHknKSkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IGNsb25lZE9wdHMuZW50aXR5O1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ3NlcnZpY2UnKSkge1xuICAgICAgICB0aGlzLnNlcnZpY2UgPSBjbG9uZWRPcHRzLnNlcnZpY2U7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnY29sdW1ucycpKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IGNsb25lZE9wdHMuY29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCd2aXNpYmxlQ29sdW1ucycpKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZUNvbHVtbnMgPSBjbG9uZWRPcHRzLnZpc2libGVDb2x1bW5zO1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ2tleXMnKSkge1xuICAgICAgICB0aGlzLmtleXMgPSBjbG9uZWRPcHRzLmtleXM7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnc29ydENvbHVtbnMnKSkge1xuICAgICAgICB0aGlzLnNvcnRDb2x1bW5zID0gY2xvbmVkT3B0cy5zb3J0Q29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdwYXJlbnRLZXlzJykpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRLZXlzID0gY2xvbmVkT3B0cy5wYXJlbnRLZXlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZS5yZXNldCgpO1xuICAgIHRoaXMuaW5pdFRhYmxlQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMub25SZWluaXRpYWxpemUuZW1pdChudWxsKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0VGFibGVBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucGFyc2VWaXNpYmxlQ29sdW1ucygpO1xuICAgIHRoaXMuc2V0RGF0YXNvdXJjZSgpO1xuICAgIHRoaXMucmVnaXN0ZXJEYXRhU291cmNlTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5wYXJzZVNvcnRDb2x1bW5zKCk7XG4gICAgdGhpcy5yZWdpc3RlclNvcnRMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2V0RmlsdGVyc0NvbmZpZ3VyYXRpb24odGhpcy5zdGF0ZSk7XG4gICAgdGhpcy5hZGREZWZhdWx0Um93QnV0dG9ucygpO1xuXG4gICAgaWYgKHRoaXMucXVlcnlPbkluaXQpIHtcbiAgICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNvcnRTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc29ydFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vblJlbmRlcmVkRGF0YUNoYW5nZSkge1xuICAgICAgdGhpcy5vblJlbmRlcmVkRGF0YUNoYW5nZS51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9ucykuZm9yRWFjaChpZHggPT4ge1xuICAgICAgaWYgKHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tpZHhdKSB7XG4gICAgICAgIHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tpZHhdLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHVwZGF0ZSBzdG9yZSBsb2NhbHN0b3JhZ2UsIGNhbGwgb2YgdGhlIElMb2NhbFN0b3JhZ2VcbiAgICovXG4gIGdldERhdGFUb1N0b3JlKCkge1xuICAgIHJldHVybiB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0RGF0YVRvU3RvcmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyUXVpY2tGaWx0ZXIoYXJnOiBhbnkpIHtcbiAgICBjb25zdCBxdWlja0ZpbHRlciA9IChhcmcgYXMgT1RhYmxlUXVpY2tmaWx0ZXIpO1xuICAgIC8vIGZvcmNpbmcgcXVpY2tGaWx0ZXJDb21wb25lbnQgdG8gYmUgdW5kZWZpbmVkLCB0YWJsZSB1c2VzIG9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50XG4gICAgdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50ID0gcXVpY2tGaWx0ZXI7XG4gICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5zZXRWYWx1ZSh0aGlzLnN0YXRlLmZpbHRlciwgZmFsc2UpO1xuICB9XG5cbiAgcmVnaXN0ZXJQYWdpbmF0aW9uKHZhbHVlOiBPVGFibGVQYWdpbmF0b3IpIHtcbiAgICB0aGlzLnBhZ2luYXRpb25Db250cm9scyA9IHRydWU7XG4gICAgdGhpcy5wYWdpbmF0b3IgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29udGV4dE1lbnUodmFsdWU6IE9Db250ZXh0TWVudUNvbXBvbmVudCk6IHZvaWQge1xuICAgIHRoaXMudGFibGVDb250ZXh0TWVudSA9IHZhbHVlO1xuICAgIHRoaXMuY29udGV4dE1lbnVTdWJzY3JpcHRpb24gPSB0aGlzLnRhYmxlQ29udGV4dE1lbnUub25TaG93LnN1YnNjcmliZSgocGFyYW1zOiBJT0NvbnRleHRNZW51Q29udGV4dCkgPT4ge1xuICAgICAgcGFyYW1zLmNsYXNzID0gJ28tdGFibGUtY29udGV4dC1tZW51ICcgKyB0aGlzLnJvd0hlaWdodDtcbiAgICAgIGlmIChwYXJhbXMuZGF0YSAmJiAhdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChwYXJhbXMuZGF0YS5yb3dWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkUm93KHBhcmFtcy5kYXRhLnJvd1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyRGVmYXVsdENvbHVtbihjb2x1bW46IHN0cmluZykge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLmdldE9Db2x1bW4oY29sdW1uKSkpIHtcbiAgICAgIC8vIGEgZGVmYXVsdCBjb2x1bW4gZGVmaW5pdGlvbiB0cnlpbmcgdG8gcmVwbGFjZSBhbiBhbHJlYWR5IGV4aXN0aW5nIGRlZmluaXRpb25cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sRGVmOiBPQ29sdW1uID0gdGhpcy5jcmVhdGVPQ29sdW1uKGNvbHVtbiwgdGhpcyk7XG4gICAgdGhpcy5wdXNoT0NvbHVtbkRlZmluaXRpb24oY29sRGVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSBhbGwgY29sdW1ucyBhbmQgcHJvcGVydGllcyBpbiB2YXIgY29sdW1uc0FycmF5XG4gICAqIEBwYXJhbSBjb2x1bW5cbiAgICovXG4gIHJlZ2lzdGVyQ29sdW1uKGNvbHVtbjogT1RhYmxlQ29sdW1uQ29tcG9uZW50IHwgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCB8IGFueSkge1xuICAgIGNvbnN0IGNvbHVtbkF0dHIgPSAodHlwZW9mIGNvbHVtbiA9PT0gJ3N0cmluZycpID8gY29sdW1uIDogY29sdW1uLmF0dHI7XG4gICAgY29uc3QgY29sdW1uUGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0T0NvbHVtblBlcm1pc3Npb25zKGNvbHVtbkF0dHIpO1xuICAgIGlmICghY29sdW1uUGVybWlzc2lvbnMudmlzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29sdW1uID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5yZWdpc3RlckRlZmF1bHRDb2x1bW4oY29sdW1uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2x1bW5EZWYgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uLmF0dHIpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW5EZWYpICYmIFV0aWwuaXNEZWZpbmVkKGNvbHVtbkRlZi5kZWZpbml0aW9uKSkge1xuICAgICAgLy8gYSBvLXRhYmxlLWNvbHVtbiBkZWZpbml0aW9uIHRyeWluZyB0byByZXBsYWNlIGFuIGFscmVhZHkgZXhpc3Rpbmcgby10YWJsZS1jb2x1bW4gZGVmaW5pdGlvblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2xEZWY6IE9Db2x1bW4gPSB0aGlzLmNyZWF0ZU9Db2x1bW4oY29sdW1uLmF0dHIsIHRoaXMsIGNvbHVtbik7XG4gICAgbGV0IGNvbHVtbldpZHRoID0gY29sdW1uLndpZHRoO1xuICAgIGNvbnN0IHN0b3JlZENvbHMgPSB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J107XG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoc3RvcmVkQ29scykpIHtcbiAgICAgIGNvbnN0IHN0b3JlZERhdGEgPSBzdG9yZWRDb2xzLmZpbmQob0NvbCA9PiBvQ29sLmF0dHIgPT09IGNvbERlZi5hdHRyKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChzdG9yZWREYXRhKSAmJiBVdGlsLmlzRGVmaW5lZChzdG9yZWREYXRhLndpZHRoKSkge1xuICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB3aWR0aCBvZiB0aGUgY29sdW1ucyBzYXZlZCBpbiB0aGUgaW5pdGlhbCBjb25maWd1cmF0aW9uXG4gICAgICAgIC8vIGluIHRoZSBsb2NhbCBzdG9yYWdlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ29Db2x1bW5zLWRpc3BsYXknKSkge1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFN0b3JlZENvbHMgPSB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnb0NvbHVtbnMtZGlzcGxheSddO1xuICAgICAgICAgICAgaW5pdGlhbFN0b3JlZENvbHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGNvbERlZi5hdHRyID09PSBlbGVtZW50LmF0dHIgJiYgZWxlbWVudC53aWR0aCA9PT0gY29sRGVmLmRlZmluaXRpb24ub3JpZ2luYWxXaWR0aCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbldpZHRoID0gc3RvcmVkRGF0YS53aWR0aDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbHVtbldpZHRoID0gc3RvcmVkRGF0YS53aWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbldpZHRoKSkge1xuICAgICAgY29sRGVmLndpZHRoID0gY29sdW1uV2lkdGg7XG4gICAgfVxuICAgIGlmIChjb2x1bW4gJiYgKGNvbHVtbi5hc3luY0xvYWQgfHwgY29sdW1uLnR5cGUgPT09ICdhY3Rpb24nKSkge1xuICAgICAgdGhpcy5hdm9pZFF1ZXJ5Q29sdW1ucy5wdXNoKGNvbHVtbi5hdHRyKTtcbiAgICAgIGlmIChjb2x1bW4uYXN5bmNMb2FkKSB7XG4gICAgICAgIHRoaXMuYXN5bmNMb2FkQ29sdW1ucy5wdXNoKGNvbHVtbi5hdHRyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wdXNoT0NvbHVtbkRlZmluaXRpb24oY29sRGVmKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwdXNoT0NvbHVtbkRlZmluaXRpb24oY29sRGVmOiBPQ29sdW1uKSB7XG4gICAgY29sRGVmLnZpc2libGUgPSAodGhpcy5fdmlzaWJsZUNvbEFycmF5LmluZGV4T2YoY29sRGVmLmF0dHIpICE9PSAtMSk7XG4gICAgLy8gRmluZCBjb2x1bW4gZGVmaW5pdGlvbiBieSBuYW1lXG4gICAgY29uc3QgYWxyZWFkeUV4aXN0aW5nID0gdGhpcy5nZXRPQ29sdW1uKGNvbERlZi5hdHRyKTtcbiAgICBpZiAoYWxyZWFkeUV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHJlcGxhY2luZ0luZGV4ID0gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmluZGV4T2YoYWxyZWFkeUV4aXN0aW5nKTtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1uc1tyZXBsYWNpbmdJbmRleF0gPSBjb2xEZWY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5wdXNoKGNvbERlZik7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaEVkaXRpb25Nb2RlV2FybigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hFZGl0aW9uTW9kZVdhcm4oKSB7XG4gICAgaWYgKHRoaXMuZWRpdGlvbk1vZGUgIT09IENvZGVzLkRFVEFJTF9NT0RFX05PTkUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZWRpdGFibGVDb2x1bW5zID0gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihjb2wgPT4ge1xuICAgICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKGNvbC5lZGl0b3IpO1xuICAgIH0pO1xuICAgIGlmIChlZGl0YWJsZUNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdVc2luZyBhIGNvbHVtbiB3aXRoIGEgZWRpdG9yIGJ1dCB0aGVyZSBpcyBubyBlZGl0aW9uLW1vZGUgZGVmaW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyQ29sdW1uQWdncmVnYXRlKGNvbHVtbjogT0NvbHVtbkFnZ3JlZ2F0ZSkge1xuICAgIHRoaXMuc2hvd1RvdGFsc1N1YmplY3QubmV4dCh0cnVlKTtcbiAgICBjb25zdCBhbHJlYWR5RXhpc3RpbmcgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uLmF0dHIpO1xuICAgIGlmIChhbHJlYWR5RXhpc3RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmVwbGFjaW5nSW5kZXggPSB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuaW5kZXhPZihhbHJlYWR5RXhpc3RpbmcpO1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zW3JlcGxhY2luZ0luZGV4XS5hZ2dyZWdhdGUgPSBjb2x1bW47XG4gICAgfVxuICB9XG5cbiAgcGFyc2VWaXNpYmxlQ29sdW1ucygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnb0NvbHVtbnMtZGlzcGxheScpKSB7XG4gICAgICAvLyBmaWx0ZXJpbmcgY29sdW1ucyB0aGF0IG1pZ2h0IGJlIGluIHN0YXRlIHN0b3JhZ2UgYnV0IG5vdCBpbiB0aGUgYWN0dWFsIHRhYmxlIGRlZmluaXRpb25cbiAgICAgIGxldCBzdGF0ZUNvbHMgPSBbXTtcbiAgICAgIHRoaXMuc3RhdGVbJ29Db2x1bW5zLWRpc3BsYXknXS5mb3JFYWNoKChvQ29sLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpc1Zpc2libGVDb2xJbkNvbHVtbnMgPSB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmluZChjb2wgPT4gY29sLmF0dHIgPT09IG9Db2wuYXR0cikgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGlzVmlzaWJsZUNvbEluQ29sdW1ucykge1xuICAgICAgICAgIHN0YXRlQ29scy5wdXNoKG9Db2wpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIGxvYWQgdGhlIGNvbHVtbiAnICsgb0NvbC5hdHRyICsgJyBmcm9tIHRoZSBsb2NhbHN0b3JhZ2UnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzdGF0ZUNvbHMgPSB0aGlzLmNoZWNrQ2hhbmdlc1Zpc2libGVDb2x1bW1uc0luSW5pdGlhbENvbmZpZ3VyYXRpb24oc3RhdGVDb2xzKTtcbiAgICAgIHRoaXMudmlzaWJsZUNvbEFycmF5ID0gc3RhdGVDb2xzLmZpbHRlcihpdGVtID0+IGl0ZW0udmlzaWJsZSkubWFwKGl0ZW0gPT4gaXRlbS5hdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aXNpYmxlQ29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy52aXNpYmxlQ29sdW1ucywgdHJ1ZSk7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihhLmF0dHIpIC0gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihiLmF0dHIpKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NoYW5nZXNWaXNpYmxlQ29sdW1tbnNJbkluaXRpYWxDb25maWd1cmF0aW9uKHN0YXRlQ29scykge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdvQ29sdW1ucy1kaXNwbGF5JykpIHtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbFZpc2libGVDb2xBcnJheSA9IHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydvQ29sdW1ucy1kaXNwbGF5J10ubWFwKHggPT4ge1xuICAgICAgICAgIGlmICh4LnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB4LmF0dHI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdmlzaWJsZUNvbEFycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMudmlzaWJsZUNvbHVtbnMsIHRydWUpO1xuXG4gICAgICAgIC8vIEZpbmQgdmFsdWVzIGluIHZpc2libGUtY29sdW1ucyB0aGF0IHRoZXkgYXJlbnQgaW4gb3JpZ2luYWwtdmlzaWJsZS1jb2x1bW5zIGluIGxvY2Fsc3RvcmFnZVxuICAgICAgICAvLyBpbiB0aGlzIGNhc2UgeW91IGhhdmUgdG8gYWRkIHRoaXMgY29sdW1uIHRvIHRoaXMudmlzaWJsZUNvbEFycmF5XG4gICAgICAgIGNvbnN0IGNvbFRvQWRkSW5WaXNpYmxlQ29sID0gVXRpbC5kaWZmZXJlbmNlQXJyYXlzKHZpc2libGVDb2xBcnJheSwgb3JpZ2luYWxWaXNpYmxlQ29sQXJyYXkpO1xuICAgICAgICBpZiAoY29sVG9BZGRJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbFRvQWRkSW5WaXNpYmxlQ29sLmZvckVhY2goKGNvbEFkZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0ZUNvbHMuZmlsdGVyKGNvbCA9PiBjb2wuYXR0ciA9PT0gY29sQWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHN0YXRlQ29scyA9IHN0YXRlQ29scy5tYXAoY29sID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29sVG9BZGRJblZpc2libGVDb2wuaW5kZXhPZihjb2wuYXR0cikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgY29sLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29sO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY29sQXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09PSBjb2xBZGQpIHtcbiAgICAgICAgICAgICAgICAgIHN0YXRlQ29scy5zcGxpY2UoaSArIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyOiBjb2xBZGQsXG4gICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgdmFsdWVzIGluIG9yaWdpbmFsLXZpc2libGUtY29sdW1ucyBpbiBsb2NhbHN0b3JhZ2UgdGhhdCB0aGV5IGFyZW50IGluIHRoaXMudmlzaWJsZUNvbEFycmF5XG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSB5b3UgaGF2ZSB0byBkZWxldGUgdGhpcyBjb2x1bW4gdG8gdGhpcy52aXNpYmxlQ29sQXJyYXlcbiAgICAgICAgY29uc3QgY29sVG9EZWxldGVJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXMob3JpZ2luYWxWaXNpYmxlQ29sQXJyYXksIHZpc2libGVDb2xBcnJheSk7XG4gICAgICAgIGlmIChjb2xUb0RlbGV0ZUluVmlzaWJsZUNvbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc3RhdGVDb2xzID0gc3RhdGVDb2xzLm1hcChjb2wgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbFRvRGVsZXRlSW5WaXNpYmxlQ29sLmluZGV4T2YoY29sLmF0dHIpID4gLTEpIHtcbiAgICAgICAgICAgICAgY29sLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb2w7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlQ29scztcbiAgfVxuXG4gIHBhcnNlU29ydENvbHVtbnMoKSB7XG4gICAgY29uc3Qgc29ydENvbHVtbnNQYXJhbSA9IHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddIHx8IHRoaXMuc29ydENvbHVtbnM7XG4gICAgdGhpcy5zb3J0Q29sQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyhzb3J0Q29sdW1uc1BhcmFtKTtcblxuICAgIC8vIGNoZWNraW5nIHRoZSBvcmlnaW5hbCBzb3J0IGNvbHVtbnMgd2l0aCB0aGUgc29ydCBjb2x1bW5zIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddICYmIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydzb3J0LWNvbHVtbnMnXSkge1xuXG4gICAgICBjb25zdCBpbml0aWFsQ29uZmlnU29ydENvbHVtbnNBcnJheSA9IFNlcnZpY2VVdGlscy5wYXJzZVNvcnRDb2x1bW5zKHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydzb3J0LWNvbHVtbnMnXSk7XG4gICAgICBjb25zdCBvcmlnaW5hbFNvcnRDb2x1bW5zQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyh0aGlzLnNvcnRDb2x1bW5zKTtcbiAgICAgIC8vIEZpbmQgdmFsdWVzIGluIHZpc2libGUtY29sdW1ucyB0aGF0IHRoZXkgYXJlbnQgaW4gb3JpZ2luYWwtdmlzaWJsZS1jb2x1bW5zIGluIGxvY2Fsc3RvcmFnZVxuICAgICAgLy8gaW4gdGhpcyBjYXNlIHlvdSBoYXZlIHRvIGFkZCB0aGlzIGNvbHVtbiB0byB0aGlzLnZpc2libGVDb2xBcnJheVxuICAgICAgY29uc3QgY29sVG9BZGRJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXMob3JpZ2luYWxTb3J0Q29sdW1uc0FycmF5LCBpbml0aWFsQ29uZmlnU29ydENvbHVtbnNBcnJheSk7XG4gICAgICBpZiAoY29sVG9BZGRJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICBjb2xUb0FkZEluVmlzaWJsZUNvbC5mb3JFYWNoKGNvbEFkZCA9PiB7XG4gICAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkucHVzaChjb2xBZGQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sVG9EZWxJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXMoaW5pdGlhbENvbmZpZ1NvcnRDb2x1bW5zQXJyYXksIG9yaWdpbmFsU29ydENvbHVtbnNBcnJheSk7XG4gICAgICBpZiAoY29sVG9EZWxJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICBjb2xUb0RlbEluVmlzaWJsZUNvbC5mb3JFYWNoKChjb2xEZWwpID0+IHtcbiAgICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5mb3JFYWNoKChjb2wsIGkpID0+IHtcbiAgICAgICAgICAgIGlmIChjb2wuY29sdW1uTmFtZSA9PT0gY29sRGVsLmNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlbnN1cmluZyBjb2x1bW4gZXhpc3RlbmNlIGFuZCBjaGVja2luZyBpdHMgb3JkZXJhYmxlIHN0YXRlXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuc29ydENvbEFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBjb2xOYW1lID0gdGhpcy5zb3J0Q29sQXJyYXlbaV0uY29sdW1uTmFtZTtcbiAgICAgIGNvbnN0IG9Db2wgPSB0aGlzLmdldE9Db2x1bW4oY29sTmFtZSk7XG4gICAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKG9Db2wpIHx8ICFvQ29sLm9yZGVyYWJsZSkge1xuICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZVBhcmFtcygpOiB2b2lkIHtcbiAgICAvLyBJZiB2aXNpYmxlLWNvbHVtbnMgaXMgbm90IHByZXNlbnQgdGhlbiB2aXNpYmxlLWNvbHVtbnMgaXMgYWxsIGNvbHVtbnNcbiAgICBpZiAoIXRoaXMudmlzaWJsZUNvbHVtbnMpIHtcbiAgICAgIHRoaXMudmlzaWJsZUNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sQXJyYXkubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNvbEFycmF5LmZvckVhY2goKHg6IHN0cmluZykgPT4gdGhpcy5yZWdpc3RlckNvbHVtbih4KSk7XG5cbiAgICAgIGxldCBjb2x1bW5zT3JkZXIgPSBbXTtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdvQ29sdW1ucy1kaXNwbGF5JykpIHtcbiAgICAgICAgY29sdW1uc09yZGVyID0gdGhpcy5zdGF0ZVsnb0NvbHVtbnMtZGlzcGxheSddLm1hcChpdGVtID0+IGl0ZW0uYXR0cik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5zT3JkZXIgPSB0aGlzLmNvbEFycmF5LmZpbHRlcihhdHRyID0+IHRoaXMudmlzaWJsZUNvbEFycmF5LmluZGV4T2YoYXR0cikgPT09IC0xKTtcbiAgICAgICAgY29sdW1uc09yZGVyLnB1c2goLi4udGhpcy52aXNpYmxlQ29sQXJyYXkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4ge1xuICAgICAgICBpZiAoY29sdW1uc09yZGVyLmluZGV4T2YoYS5hdHRyKSA9PT0gLTEpIHtcbiAgICAgICAgICAvLyBpZiBpdCBpcyBub3QgaW4gbG9jYWwgc3RvcmFnZSBiZWNhdXNlIGl0IGlzIG5ldywga2VlcCBvcmRlclxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjb2x1bW5zT3JkZXIuaW5kZXhPZihhLmF0dHIpIC0gY29sdW1uc09yZGVyLmluZGV4T2YoYi5hdHRyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHF1aWNrRmlsdGVyXG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5maWx0ZXIgPSB0aGlzLnF1aWNrRmlsdGVyO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2N1cnJlbnRQYWdlJykpIHtcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgcGFnaW5hdG9yXG4gICAgaWYgKCF0aGlzLnBhZ2luYXRvciAmJiB0aGlzLnBhZ2luYXRpb25Db250cm9scykge1xuICAgICAgdGhpcy5wYWdpbmF0b3IgPSBuZXcgT0Jhc2VUYWJsZVBhZ2luYXRvcigpO1xuICAgICAgdGhpcy5wYWdpbmF0b3IucGFnZVNpemUgPSB0aGlzLnF1ZXJ5Um93cztcbiAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCA9IHRoaXMuY3VycmVudFBhZ2U7XG4gICAgICB0aGlzLnBhZ2luYXRvci5zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IHRoaXMuc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM7XG4gICAgfVxuXG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSkpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSAhIXRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjaGVja2luZyB0aGUgb3JpZ2luYWwgc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlIHdpdGggc2VsZWN0LWNvbHVtbi12aXNpYmxlIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykgJiYgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZScpXG4gICAgICAgICYmIHRoaXMuc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlID09PSB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ10pIHtcbiAgICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSA9ICEhdGhpcy5zdGF0ZVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gdGhpcy5zZWxlY3RBbGxDaGVja2JveFZpc2libGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgfVxuXG4gIHJlZ2lzdGVyVGFiTGlzdGVuZXIoKSB7XG4gICAgLy8gV2hlbiB0YWJsZSBpcyBjb250YWluZWQgaW50byB0YWIgY29tcG9uZW50LCBpdCBpcyBuZWNlc3NhcnkgdG8gaW5pdCB0YWJsZSBjb21wb25lbnQgd2hlbiBhdHRhY2hlZCB0byBET00uXG4gICAgdGhpcy50YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMudGFiR3JvdXBDb250YWluZXIuc2VsZWN0ZWRUYWJDaGFuZ2Uuc3Vic2NyaWJlKChldnQpID0+IHtcbiAgICAgIGxldCBpbnRlcnZhbDtcbiAgICAgIGNvbnN0IHRpbWVyQ2FsbGJhY2sgPSAodGFiOiBNYXRUYWIpID0+IHtcbiAgICAgICAgaWYgKHRhYiAmJiB0YWIuY29udGVudC5pc0F0dGFjaGVkKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgaWYgKHRhYiA9PT0gdGhpcy50YWJDb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zaWRlVGFiQnVnV29ya2Fyb3VuZCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucGVuZGluZ1F1ZXJ5KSB7XG4gICAgICAgICAgICAgIHRoaXMucXVlcnlEYXRhKHRoaXMucGVuZGluZ1F1ZXJ5RmlsdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHsgdGltZXJDYWxsYmFjayhldnQudGFiKTsgfSwgMTAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbnNpZGVUYWJCdWdXb3JrYXJvdW5kKCkge1xuICAgIHRoaXMuc29ydEhlYWRlcnMuZm9yRWFjaChzb3J0SCA9PiB7XG4gICAgICBzb3J0SC5yZWZyZXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3RlclNvcnRMaXN0ZW5lcigpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5zb3J0KSkge1xuICAgICAgdGhpcy5zb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5zb3J0Lm9Tb3J0Q2hhbmdlLnN1YnNjcmliZSh0aGlzLm9uU29ydENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc29ydC5zZXRNdWx0aXBsZVNvcnQodGhpcy5tdWx0aXBsZVNvcnQpO1xuXG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zKSAmJiAodGhpcy5zb3J0Q29sQXJyYXkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhpcy5zb3J0LnNldFRhYmxlSW5mbyh0aGlzLnNvcnRDb2xBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG9uU29ydENoYW5nZShzb3J0QXJyYXk6IGFueVtdKSB7XG4gICAgdGhpcy5zb3J0Q29sQXJyYXkgPSBbXTtcbiAgICBzb3J0QXJyYXkuZm9yRWFjaCgoc29ydCkgPT4ge1xuICAgICAgaWYgKHNvcnQuZGlyZWN0aW9uICE9PSAnJykge1xuICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5wdXNoKHtcbiAgICAgICAgICBjb2x1bW5OYW1lOiBzb3J0LmlkLFxuICAgICAgICAgIGFzY2VuZGVudDogc29ydC5kaXJlY3Rpb24gPT09IENvZGVzLkFTQ19TT1JUXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2FkaW5nU29ydGluZ1N1YmplY3QubmV4dCh0cnVlKTtcbiAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGFzb3VyY2UoKSB7XG4gICAgY29uc3QgZGF0YVNvdXJjZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVGFibGVEYXRhU291cmNlU2VydmljZSk7XG4gICAgdGhpcy5kYXRhU291cmNlID0gZGF0YVNvdXJjZVNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJEYXRhU291cmNlTGlzdGVuZXJzKCkge1xuICAgIGlmICghdGhpcy5wYWdlYWJsZSkge1xuICAgICAgdGhpcy5vblJlbmRlcmVkRGF0YUNoYW5nZSA9IHRoaXMuZGF0YVNvdXJjZS5vblJlbmRlcmVkRGF0YUNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRpbmdTb3J0aW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICAgICAgICBpZiAodGhpcy5jZCAmJiAhKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2hvd0xvYWRpbmcoKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMubG9hZGluZywgdGhpcy5sb2FkaW5nU29ydGluZywgdGhpcy5sb2FkaW5nU2Nyb2xsXSlcbiAgICAgIC5waXBlKG1hcCgocmVzOiBhbnlbXSkgPT4gKHJlc1swXSB8fCByZXNbMV0gfHwgcmVzWzJdKSkpO1xuICB9XG5cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgbWFuYWdlcyB0aGUgY2FsbCB0byB0aGUgc2VydmljZVxuICAgKiBAcGFyYW0gZmlsdGVyXG4gICAqIEBwYXJhbSBvdnJyQXJnc1xuICAgKi9cbiAgcXVlcnlEYXRhKGZpbHRlcj86IGFueSwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncykge1xuICAgIC8vIElmIHRhYiBleGlzdHMgYW5kIGlzIG5vdCBhY3RpdmUgdGhlbiB3YWl0IGZvciBxdWVyeURhdGFcbiAgICBpZiAodGhpcy5pc0luc2lkZUluYWN0aXZlVGFiKCkpIHtcbiAgICAgIHRoaXMucGVuZGluZ1F1ZXJ5ID0gdHJ1ZTtcbiAgICAgIHRoaXMucGVuZGluZ1F1ZXJ5RmlsdGVyID0gZmlsdGVyO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBlbmRpbmdRdWVyeSA9IGZhbHNlO1xuICAgIHRoaXMucGVuZGluZ1F1ZXJ5RmlsdGVyID0gdW5kZWZpbmVkO1xuICAgIHN1cGVyLnF1ZXJ5RGF0YShmaWx0ZXIsIG92cnJBcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc0luc2lkZUluYWN0aXZlVGFiKCk6IGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpZiAodGhpcy50YWJDb250YWluZXIgJiYgdGhpcy50YWJHcm91cENvbnRhaW5lcikge1xuICAgICAgcmVzdWx0ID0gISh0aGlzLnRhYkNvbnRhaW5lci5pc0FjdGl2ZSB8fCAodGhpcy50YWJHcm91cENvbnRhaW5lci5zZWxlY3RlZEluZGV4ID09PSB0aGlzLnRhYkNvbnRhaW5lci5wb3NpdGlvbikpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50RmlsdGVyKGV4aXN0aW5nRmlsdGVyOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgbGV0IGZpbHRlciA9IGV4aXN0aW5nRmlsdGVyO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoZmlsdGVyKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEl0ZW1FeHByID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkZyb21PYmplY3QoZmlsdGVyKTtcbiAgICAgICAgZmlsdGVyID0ge307XG4gICAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSA9IHBhcmVudEl0ZW1FeHByO1xuICAgICAgfVxuICAgICAgY29uc3QgYmVDb2xGaWx0ZXIgPSB0aGlzLmdldENvbHVtbkZpbHRlcnNFeHByZXNzaW9uKCk7XG4gICAgICAvLyBBZGQgY29sdW1uIGZpbHRlcnMgYmFzaWMgZXhwcmVzc2lvbiB0byBjdXJyZW50IGZpbHRlclxuICAgICAgaWYgKGJlQ29sRmlsdGVyICYmICFVdGlsLmlzRGVmaW5lZChmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0pKSB7XG4gICAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSA9IGJlQ29sRmlsdGVyO1xuICAgICAgfSBlbHNlIGlmIChiZUNvbEZpbHRlcikge1xuICAgICAgICBmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0gPVxuICAgICAgICAgIEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSwgYmVDb2xGaWx0ZXIsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9BTkQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZ2V0Q29tcG9uZW50RmlsdGVyKGZpbHRlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0UXVpY2tGaWx0ZXJFeHByZXNzaW9uKCk6IEV4cHJlc3Npb24ge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50KSAmJiB0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5maWx0ZXJFeHByZXNzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENvbHVtbkZpbHRlcnNFeHByZXNzaW9uKCk6IEV4cHJlc3Npb24ge1xuICAgIC8vIEFwcGx5IGNvbHVtbiBmaWx0ZXJzXG4gICAgY29uc3QgY29sdW1uRmlsdGVyczogT0NvbHVtblZhbHVlRmlsdGVyW10gPSB0aGlzLmRhdGFTb3VyY2UuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJzKCk7XG4gICAgY29uc3QgYmVDb2x1bW5GaWx0ZXJzOiBBcnJheTxFeHByZXNzaW9uPiA9IFtdO1xuICAgIGNvbHVtbkZpbHRlcnMuZm9yRWFjaChjb2xGaWx0ZXIgPT4ge1xuICAgICAgLy8gUHJlcGFyZSBiYXNpYyBleHByZXNzaW9uc1xuICAgICAgc3dpdGNoIChjb2xGaWx0ZXIub3BlcmF0b3IpIHtcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOOlxuICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkoY29sRmlsdGVyLnZhbHVlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGJlc0luOiBBcnJheTxFeHByZXNzaW9uPiA9IGNvbEZpbHRlci52YWx1ZXMubWFwKHZhbHVlID0+IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25FcXVhbHMoY29sRmlsdGVyLmF0dHIsIHZhbHVlKSk7XG4gICAgICAgICAgICBsZXQgYmVJbjogRXhwcmVzc2lvbiA9IGJlc0luLnBvcCgpO1xuICAgICAgICAgICAgYmVzSW4uZm9yRWFjaChiZSA9PiB7XG4gICAgICAgICAgICAgIGJlSW4gPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihiZUluLCBiZSwgRmlsdGVyRXhwcmVzc2lvblV0aWxzLk9QX09SKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goYmVJbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTjpcbiAgICAgICAgICBpZiAoVXRpbC5pc0FycmF5KGNvbEZpbHRlci52YWx1ZXMpICYmIGNvbEZpbHRlci52YWx1ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgYmVGcm9tID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbk1vcmVFcXVhbChjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlc1swXSk7XG4gICAgICAgICAgICBsZXQgYmVUbyA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25MZXNzRXF1YWwoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXNbMV0pO1xuICAgICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oYmVGcm9tLCBiZVRvLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuRVFVQUw6XG4gICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkxpa2UoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXMpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkxFU1NfRVFVQUw6XG4gICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkxlc3NFcXVhbChjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTDpcbiAgICAgICAgICBiZUNvbHVtbkZpbHRlcnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTW9yZUVxdWFsKGNvbEZpbHRlci5hdHRyLCBjb2xGaWx0ZXIudmFsdWVzKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICAvLyBCdWlsZCBjb21wbGV0ZSBjb2x1bW4gZmlsdGVycyBiYXNpYyBleHByZXNzaW9uXG4gICAgbGV0IGJlQ29sRmlsdGVyOiBFeHByZXNzaW9uID0gYmVDb2x1bW5GaWx0ZXJzLnBvcCgpO1xuICAgIGJlQ29sdW1uRmlsdGVycy5mb3JFYWNoKGJlID0+IHtcbiAgICAgIGJlQ29sRmlsdGVyID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oYmVDb2xGaWx0ZXIsIGJlLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYmVDb2xGaWx0ZXI7XG4gIH1cblxuICB1cGRhdGVQYWdpbmF0aW9uSW5mbyhxdWVyeVJlczogYW55KSB7XG4gICAgc3VwZXIudXBkYXRlUGFnaW5hdGlvbkluZm8ocXVlcnlSZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldERhdGEoZGF0YTogYW55LCBzcWxUeXBlczogYW55KSB7XG4gICAgdGhpcy5kYW9UYWJsZS5zcWxUeXBlc0NoYW5nZS5uZXh0KHNxbFR5cGVzKTtcbiAgICB0aGlzLmRhb1RhYmxlLnNldERhdGFBcnJheShkYXRhKTtcbiAgICB0aGlzLnVwZGF0ZVNjcm9sbGVkU3RhdGUoKTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblBhZ2luYXRlZERhdGFMb2FkZWQsIGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRGF0YUxvYWRlZCwgdGhpcy5kYW9UYWJsZS5kYXRhKTtcbiAgfVxuXG4gIHNob3dEaWFsb2dFcnJvcihlcnJvcjogc3RyaW5nLCBlcnJvck9wdGlvbmFsPzogc3RyaW5nKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVycm9yKSAmJiAhVXRpbC5pc09iamVjdChlcnJvcikpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnJvck9wdGlvbmFsKTtcbiAgICB9XG4gIH1cblxuICBwcm9qZWN0Q29udGVudENoYW5nZWQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmxvYWRpbmdTb3J0aW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICB9LCA1MDApO1xuICAgIHRoaXMubG9hZGluZ1Njcm9sbFN1YmplY3QubmV4dChmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5wcmV2aW91c1JlbmRlcmVyRGF0YSAhPT0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YSkge1xuICAgICAgdGhpcy5wcmV2aW91c1JlbmRlcmVyRGF0YSA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGE7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ29udGVudENoYW5nZSwgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRDb2x1bW5zV2lkdGhGcm9tRE9NKCk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0aW9uJykgJiYgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5sZW5ndGggPiAwICYmIHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZm9yRWFjaChzZWxlY3RlZEl0ZW0gPT4ge1xuICAgICAgICAvLyBmaW5kaW5nIHNlbGVjdGVkIGl0ZW0gZGF0YSBpbiB0aGUgdGFibGUgcmVuZGVyZWQgZGF0YVxuICAgICAgICBjb25zdCBmb3VuZEl0ZW0gPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmZpbmQoZGF0YSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgT2JqZWN0LmtleXMoc2VsZWN0ZWRJdGVtKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgJiYgKGRhdGFba2V5XSA9PT0gc2VsZWN0ZWRJdGVtW2tleV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZm91bmRJdGVtKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0KGZvdW5kSXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IGNvbHVtbnMgPSBzdXBlci5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9RdWVyeSgpO1xuICAgIGlmICh0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSBjb2x1bW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvbHVtbnNbaV07XG4gICAgICAgIGlmICh0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLmluZGV4T2YoY29sKSAhPT0gLTEpIHtcbiAgICAgICAgICBjb2x1bW5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIGdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlcjogb2JqZWN0LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogQXJyYXk8YW55PiB7XG4gICAgY29uc3QgcXVlcnlBcmd1bWVudHMgPSBzdXBlci5nZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXIsIG92cnJBcmdzKTtcbiAgICBxdWVyeUFyZ3VtZW50c1szXSA9IHRoaXMuZ2V0U3FsVHlwZXNGb3JGaWx0ZXIocXVlcnlBcmd1bWVudHNbMV0pO1xuICAgIE9iamVjdC5hc3NpZ24ocXVlcnlBcmd1bWVudHNbM10sIG92cnJBcmdzID8gb3ZyckFyZ3Muc3FsdHlwZXMgfHwge30gOiB7fSk7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHF1ZXJ5QXJndW1lbnRzWzVdID0gdGhpcy5wYWdpbmF0b3IuaXNTaG93aW5nQWxsUm93cyhxdWVyeUFyZ3VtZW50c1s1XSkgPyB0aGlzLnN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyIDogcXVlcnlBcmd1bWVudHNbNV07XG4gICAgICBxdWVyeUFyZ3VtZW50c1s2XSA9IHRoaXMuc29ydENvbEFycmF5O1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICBnZXRTcWxUeXBlc0ZvckZpbHRlcihmaWx0ZXIpOiBvYmplY3Qge1xuICAgIGNvbnN0IGFsbFNxbFR5cGVzID0ge307XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZvckVhY2goKGNvbDogT0NvbHVtbikgPT4ge1xuICAgICAgaWYgKGNvbC5zcWxUeXBlKSB7XG4gICAgICAgIGFsbFNxbFR5cGVzW2NvbC5hdHRyXSA9IGNvbC5zcWxUeXBlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5hc3NpZ24oYWxsU3FsVHlwZXMsIHRoaXMuZ2V0U3FsVHlwZXMoKSk7XG4gICAgY29uc3QgZmlsdGVyQ29scyA9IFV0aWwuZ2V0VmFsdWVzRnJvbU9iamVjdChmaWx0ZXIpO1xuICAgIGNvbnN0IHNxbFR5cGVzID0ge307XG4gICAgT2JqZWN0LmtleXMoYWxsU3FsVHlwZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChmaWx0ZXJDb2xzLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiYgYWxsU3FsVHlwZXNba2V5XSAhPT0gU1FMVHlwZXMuT1RIRVIpIHtcbiAgICAgICAgc3FsVHlwZXNba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNxbFR5cGVzO1xuICB9XG5cbiAgb25FeHBvcnRCdXR0b25DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkV4cG9ydEJ1dHRvbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZUNvbHVtbnNWaXNpYmlsaXR5Q2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25DaGFuZ2VDb2x1bW5zVmlzaWJpbGl0eUNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbk1hdFRhYmxlQ29udGVudENoYW5nZWQoKSB7XG4gICAgLy9cbiAgfVxuXG4gIGFkZCgpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLmluc2VydERldGFpbCgpO1xuICB9XG5cbiAgcmVtb3ZlKGNsZWFyU2VsZWN0ZWRJdGVtczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fREVMRVRFKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuQ09ORklSTV9ERUxFVEUnKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhU2VydmljZSAmJiAodGhpcy5kZWxldGVNZXRob2QgaW4gdGhpcy5kYXRhU2VydmljZSkgJiYgdGhpcy5lbnRpdHkgJiYgKHRoaXMua2V5c0FycmF5Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJzID0gU2VydmljZVV0aWxzLmdldEFycmF5UHJvcGVydGllcyhzZWxlY3RlZEl0ZW1zLCB0aGlzLmtleXNBcnJheSk7XG4gICAgICAgICAgICB0aGlzLmRhb1RhYmxlLnJlbW92ZVF1ZXJ5KGZpbHRlcnMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Sb3dEZWxldGVkLCBzZWxlY3RlZEl0ZW1zKTtcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nRXJyb3IoZXJyb3IsICdNRVNTQUdFUy5FUlJPUl9ERUxFVEUnKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVMb2NhbEl0ZW1zKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsZWFyU2VsZWN0ZWRJdGVtcykge1xuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfVxuXG4gIHNob3dBbmRTZWxlY3RBbGxDaGVja2JveCgpIHtcbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RBbGxDaGVja2JveCkge1xuICAgICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoZWNrYm94Q29sdW1uKCk7XG4gICAgICB0aGlzLnNlbGVjdEFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIC8vIEluaXRpYWxpemUgcGFnZSBpbmRleFxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDA7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICByZWxvYWREYXRhKCkge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1JFRlJFU0gpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdGF0ZSwgdGhpcy5vVGFibGVTdG9yYWdlLmdldFRhYmxlUHJvcGVydHlUb1N0b3JlKCdzZWxlY3Rpb24nKSk7XG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIHRoaXMuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICB0aGlzLnBlbmRpbmdRdWVyeSA9IHRydWU7XG4gICAgLy8gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbCA9IDE7XG4gICAgbGV0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3M7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHF1ZXJ5QXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiB0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MsXG4gICAgICAgIGxlbmd0aDogdGhpcy5xdWVyeVJvd3NcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZWRpdGluZ0NlbGwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soaXRlbTogYW55LCAkZXZlbnQ/KSB7XG4gICAgdGhpcy5jbGlja1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuY2xpY2tQcmV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9IYW5kbGVDbGljayhpdGVtLCAkZXZlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGlja1ByZXZlbnQgPSBmYWxzZTtcbiAgICB9LCB0aGlzLmNsaWNrRGVsYXkpO1xuICB9XG5cbiAgZG9IYW5kbGVDbGljayhpdGVtOiBhbnksICRldmVudD8pIHtcbiAgICBpZiAoIXRoaXMub2VuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCh0aGlzLmRldGFpbE1vZGUgPT09IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLKSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCBpdGVtKTtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmNsZWFyKCk7XG4gICAgICB0aGlzLnNlbGVjdGVkUm93KGl0ZW0pO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGl0ZW0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpICYmICgkZXZlbnQuY3RybEtleSB8fCAkZXZlbnQubWV0YUtleSkpIHtcbiAgICAgIC8vIFRPRE86IHRlc3QgJGV2ZW50Lm1ldGFLZXkgb24gTUFDXG4gICAgICB0aGlzLnNlbGVjdGVkUm93KGl0ZW0pO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCBpdGVtKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTZWxlY3Rpb25Nb2RlTXVsdGlwbGUoKSAmJiAkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHRoaXMuaGFuZGxlTXVsdGlwbGVTZWxlY3Rpb24oaXRlbSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1NlbGVjdGlvbk1vZGVOb25lKCkpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKGl0ZW0pICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxICYmIHRoaXMuZWRpdGlvbkVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbkFuZEVkaXRpbmcoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VsZWN0ZWRSb3coaXRlbSk7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ2xpY2ssIGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU11bHRpcGxlU2VsZWN0aW9uKGl0ZW06IGFueSkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdCA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuaW5kZXhPZih0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZFswXSk7XG4gICAgICBjb25zdCBsYXN0ID0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5pbmRleE9mKGl0ZW0pO1xuICAgICAgY29uc3QgaW5kZXhGcm9tID0gTWF0aC5taW4oZmlyc3QsIGxhc3QpO1xuICAgICAgY29uc3QgaW5kZXhUbyA9IE1hdGgubWF4KGZpcnN0LCBsYXN0KTtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuc2xpY2UoaW5kZXhGcm9tLCBpbmRleFRvICsgMSkuZm9yRWFjaChlID0+IHRoaXMuc2VsZWN0ZWRSb3coZSkpO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCkge1xuICAgIHN1cGVyLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSA9IHRydWU7XG4gIH1cblxuICBoYW5kbGVEb3VibGVDbGljayhpdGVtOiBhbnksIGV2ZW50Pykge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmNsaWNrVGltZXIpO1xuICAgIHRoaXMuY2xpY2tQcmV2ZW50ID0gdHJ1ZTtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRG91YmxlQ2xpY2ssIGl0ZW0pO1xuICAgIGlmICh0aGlzLm9lbmFibGVkICYmIENvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHRoaXMuZGV0YWlsTW9kZSkpIHtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMudmlld0RldGFpbChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZWRpdGlvbkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb21lKGl0ZW0gPT4gaXRlbS5lZGl0aW5nKTtcbiAgfVxuXG4gIGhhbmRsZURPTUNsaWNrKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lZGl0aW9uRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG92ZXJsYXlDb250YWluZXIgPSBkb2N1bWVudC5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nkay1vdmVybGF5LWNvbnRhaW5lcicpWzBdO1xuICAgIGlmIChvdmVybGF5Q29udGFpbmVyICYmIG92ZXJsYXlDb250YWluZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlQ29udGFpbmVyID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vLXRhYmxlLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IHRhYmxlQ29udGVudCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuby10YWJsZS1jb250YWluZXIgdGFibGUubWF0LXRhYmxlJyk7XG4gICAgaWYgKHRhYmxlQ29udGFpbmVyICYmIHRhYmxlQ29udGVudCAmJiB0YWJsZUNvbnRhaW5lci5jb250YWlucyhldmVudC50YXJnZXQpICYmICF0YWJsZUNvbnRlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNlbGxDbGljayhjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55LCBldmVudD8pIHtcbiAgICBpZiAodGhpcy5vZW5hYmxlZCAmJiBjb2x1bW4uZWRpdG9yXG4gICAgICAmJiAodGhpcy5kZXRhaWxNb2RlICE9PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSylcbiAgICAgICYmICh0aGlzLmVkaXRpb25Nb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykpIHtcblxuICAgICAgdGhpcy5hY3RpdmF0ZUNvbHVtbkVkaXRpb24oY29sdW1uLCByb3csIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDZWxsRG91YmxlQ2xpY2soY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ/KSB7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgY29sdW1uLmVkaXRvclxuICAgICAgJiYgKCFDb2Rlcy5pc0RvdWJsZUNsaWNrTW9kZSh0aGlzLmRldGFpbE1vZGUpKVxuICAgICAgJiYgKENvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHRoaXMuZWRpdGlvbk1vZGUpKSkge1xuXG4gICAgICB0aGlzLmFjdGl2YXRlQ29sdW1uRWRpdGlvbihjb2x1bW4sIHJvdywgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhY3RpdmF0ZUNvbHVtbkVkaXRpb24oY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ/KSB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmIChldmVudCAmJiBjb2x1bW4uZWRpdGluZyAmJiB0aGlzLmVkaXRpbmdDZWxsID09PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbHVtblBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldE9Db2x1bW5QZXJtaXNzaW9ucyhjb2x1bW4uYXR0cik7XG4gICAgaWYgKGNvbHVtblBlcm1pc3Npb25zLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYCR7Y29sdW1uLmF0dHJ9IGVkaXRpb24gbm90IGFsbG93ZWQgZHVlIHRvIHBlcm1pc3Npb25zYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbkFuZEVkaXRpbmcoKTtcbiAgICB0aGlzLnNlbGVjdGVkUm93KHJvdyk7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICB0aGlzLmVkaXRpbmdDZWxsID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICB9XG4gICAgY29uc3Qgcm93RGF0YSA9IHt9O1xuICAgIHRoaXMua2V5c0FycmF5LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgcm93RGF0YVtrZXldID0gcm93W2tleV07XG4gICAgfSk7XG4gICAgcm93RGF0YVtjb2x1bW4uYXR0cl0gPSByb3dbY29sdW1uLmF0dHJdO1xuICAgIHRoaXMuZWRpdGluZ1JvdyA9IHJvdztcbiAgICBjb2x1bW4uZWRpdGluZyA9IHRydWU7XG4gICAgY29sdW1uLmVkaXRvci5zdGFydEVkaXRpb24ocm93RGF0YSk7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICB1cGRhdGVDZWxsRGF0YShjb2x1bW46IE9Db2x1bW4sIGRhdGE6IGFueSwgc2F2ZUNoYW5nZXM6IGJvb2xlYW4pIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUpKSB7XG4gICAgICBjb25zdCByZXMgPSBuZXcgT2JzZXJ2YWJsZShpbm5lck9ic2VydmVyID0+IHtcbiAgICAgICAgaW5uZXJPYnNlcnZlci5lcnJvcigpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBjb2x1bW4uZWRpdGluZyA9IGZhbHNlO1xuICAgIHRoaXMuZWRpdGluZ0NlbGwgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHNhdmVDaGFuZ2VzICYmIHRoaXMuZWRpdGluZ1JvdyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdGluZ1JvdywgZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuZWRpdGluZ1JvdyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoc2F2ZUNoYW5nZXMgJiYgY29sdW1uLmVkaXRvci51cGRhdGVSZWNvcmRPbkVkaXQpIHtcbiAgICAgIGNvbnN0IHRvVXBkYXRlID0ge307XG4gICAgICB0b1VwZGF0ZVtjb2x1bW4uYXR0cl0gPSBkYXRhW2NvbHVtbi5hdHRyXTtcbiAgICAgIGNvbnN0IGt2ID0gdGhpcy5leHRyYWN0S2V5c0Zyb21SZWNvcmQoZGF0YSk7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVSZWNvcmQoa3YsIHRvVXBkYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRLZXlzVmFsdWVzKCk6IGFueVtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRBbGxWYWx1ZXMoKTtcbiAgICByZXR1cm4gZGF0YS5tYXAoKHJvdykgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKHJvd1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvYmpba2V5XSA9IHJvd1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgfVxuXG4gIG9uU2hvd3NTZWxlY3RzKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vblNob3dzU2VsZWN0cygpO1xuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemVDaGVja2JveENvbHVtbigpIHtcbiAgICAvLyBJbml0aWFsaXppbmcgcm93IHNlbGVjdGlvbiBsaXN0ZW5lclxuICAgIGlmICghdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24gJiYgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnNlbGVjdGlvbi5jaGFuZ2VkLnN1YnNjcmliZSgoc2VsZWN0aW9uRGF0YTogU2VsZWN0aW9uQ2hhbmdlPGFueT4pID0+IHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbkRhdGEgJiYgc2VsZWN0aW9uRGF0YS5hZGRlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblJvd1NlbGVjdGVkLCBzZWxlY3Rpb25EYXRhLmFkZGVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0aW9uRGF0YSAmJiBzZWxlY3Rpb25EYXRhLnJlbW92ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Sb3dEZXNlbGVjdGVkLCBzZWxlY3Rpb25EYXRhLnJlbW92ZWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVTZWxlY3Rpb25Db2x1bW5TdGF0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVNlbGVjdGlvbkNvbHVtblN0YXRlKCkge1xuICAgIGlmICghdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSkge1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucyAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlXG4gICAgICAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zWzBdICE9PSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMudW5zaGlmdChDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucyAmJiAhdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZVxuICAgICAgJiYgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1uc1swXSA9PT0gQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLnNoaWZ0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzQWxsU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbnVtU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGg7XG4gICAgY29uc3QgbnVtUm93cyA9IHRoaXMuZGF0YVNvdXJjZSA/IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEubGVuZ3RoIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBudW1TZWxlY3RlZCA+IDAgJiYgbnVtU2VsZWN0ZWQgPT09IG51bVJvd3M7XG4gIH1cblxuICBwdWJsaWMgbWFzdGVyVG9nZ2xlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSk6IHZvaWQge1xuICAgIGV2ZW50LmNoZWNrZWQgPyB0aGlzLnNlbGVjdEFsbCgpIDogdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdEFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmZvckVhY2gocm93ID0+IHRoaXMuc2VsZWN0aW9uLnNlbGVjdChyb3cpKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3Rpb25DaGVja2JveFRvZ2dsZShldmVudDogTWF0Q2hlY2tib3hDaGFuZ2UsIHJvdzogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNTZWxlY3Rpb25Nb2RlU2luZ2xlKCkpIHtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZFJvdyhyb3cpO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdGVkUm93KHJvdzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zZXRTZWxlY3RlZChyb3cpO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0IHNob3dEZWxldGVCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlQnV0dG9uO1xuICB9XG5cbiAgZ2V0VHJhY2tCeUZ1bmN0aW9uKCk6IChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHN0cmluZyB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4ge1xuICAgICAgaWYgKHNlbGYuaGFzU2Nyb2xsYWJsZUNvbnRhaW5lcigpICYmIGluZGV4IDwgKHNlbGYucGFnZVNjcm9sbFZpcnR1YWwgLSAxKSAqIENvZGVzLkxJTUlUX1NDUk9MTFZJUlRVQUwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGxldCBpdGVtSWQ6IHN0cmluZyA9ICcnO1xuICAgICAgY29uc3Qga2V5c0xlbmdodCA9IHNlbGYua2V5c0FycmF5Lmxlbmd0aDtcbiAgICAgIHNlbGYua2V5c0FycmF5LmZvckVhY2goKGtleTogc3RyaW5nLCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBzdWZmaXggPSBpZHggPCAoa2V5c0xlbmdodCAtIDEpID8gJzsnIDogJyc7XG4gICAgICAgIGl0ZW1JZCArPSBpdGVtW2tleV0gKyBzdWZmaXg7XG4gICAgICB9KTtcblxuXG4gICAgICBjb25zdCBhc3luY0FuZFZpc2libGUgPSBzZWxmLmFzeW5jTG9hZENvbHVtbnMuZmlsdGVyKGMgPT4gc2VsZi5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKGMpICE9PSAtMSk7XG4gICAgICBpZiAoc2VsZi5hc3luY0xvYWRDb2x1bW5zLmxlbmd0aCAmJiBhc3luY0FuZFZpc2libGUubGVuZ3RoID4gMCAmJiAhc2VsZi5maW5pc2hRdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgICBzZWxmLnF1ZXJ5Um93QXN5bmNEYXRhKGluZGV4LCBpdGVtKTtcbiAgICAgICAgaWYgKHNlbGYucGFnaW5hdG9yICYmIGluZGV4ID09PSAoc2VsZi5wYWdpbmF0b3IucGFnZVNpemUgLSAxKSkge1xuICAgICAgICAgIHNlbGYuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbUlkO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBxdWVyeVJvd0FzeW5jRGF0YShyb3dJbmRleDogbnVtYmVyLCByb3dEYXRhOiBhbnkpIHtcbiAgICBjb25zdCBrdiA9IFNlcnZpY2VVdGlscy5nZXRPYmplY3RQcm9wZXJ0aWVzKHJvd0RhdGEsIHRoaXMua2V5c0FycmF5KTtcbiAgICAvLyBSZXBlYXRpbmcgY2hlY2tpbmcgb2YgdmlzaWJsZSBjb2x1bW5cbiAgICBjb25zdCBhdiA9IHRoaXMuYXN5bmNMb2FkQ29sdW1ucy5maWx0ZXIoYyA9PiB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmluZGV4T2YoYykgIT09IC0xKTtcbiAgICBpZiAoYXYubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBTa2lwcGluZyBxdWVyeSBpZiB0aGVyZSBhcmUgbm90IHZpc2libGUgYXN5bmNyb24gY29sdW1uc1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2x1bW5RdWVyeUFyZ3MgPSBba3YsIGF2LCB0aGlzLmVudGl0eSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXTtcbiAgICBjb25zdCBxdWVyeU1ldGhvZE5hbWUgPSB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2Q7XG4gICAgaWYgKHRoaXMuZGF0YVNlcnZpY2UgJiYgKHF1ZXJ5TWV0aG9kTmFtZSBpbiB0aGlzLmRhdGFTZXJ2aWNlKSAmJiB0aGlzLmVudGl0eSkge1xuICAgICAgaWYgKHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tyb3dJbmRleF0pIHtcbiAgICAgICAgdGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW3Jvd0luZGV4XS51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW3Jvd0luZGV4XSA9IHRoaXMuZGF0YVNlcnZpY2VbcXVlcnlNZXRob2ROYW1lXVxuICAgICAgICAuYXBwbHkodGhpcy5kYXRhU2VydmljZSwgY29sdW1uUXVlcnlBcmdzKVxuICAgICAgICAuc3Vic2NyaWJlKChyZXM6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXMuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShyZXMuZGF0YSkgJiYgcmVzLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSByZXMuZGF0YVswXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChyZXMuZGF0YSkpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYW9UYWJsZS5zZXRBc3luY2hyb25vdXNDb2x1bW4oZGF0YSwgcm93RGF0YSk7XG4gICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UuZ2V0Q3VycmVudERhdGEoKTtcbiAgfVxuXG4gIGdldEFsbFZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEN1cnJlbnRBbGxEYXRhKCk7XG4gIH1cblxuICBnZXRBbGxSZW5kZXJlZFZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEFsbFJlbmRlcmVyRGF0YSgpO1xuICB9XG5cbiAgZ2V0UmVuZGVyZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEN1cnJlbnRSZW5kZXJlckRhdGEoKTtcbiAgfVxuXG4gIGdldFNxbFR5cGVzKCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRhdGFTb3VyY2Uuc3FsVHlwZXMpID8gdGhpcy5kYXRhU291cmNlLnNxbFR5cGVzIDoge307XG4gIH1cblxuICBzZXRPVGFibGVDb2x1bW5zRmlsdGVyKHRhYmxlQ29sdW1uc0ZpbHRlcjogT1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgIHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCA9IHRhYmxlQ29sdW1uc0ZpbHRlcjtcbiAgfVxuXG4gIGdldFN0b3JlZENvbHVtbnNGaWx0ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29sdW1uc0ZpbHRlcnMoKTtcbiAgfVxuXG4gIG9uRmlsdGVyQnlDb2x1bW5DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkZpbHRlckJ5Q29sdW1uQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RvcmVGaWx0ZXJDbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vblN0b3JlRmlsdGVyQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTG9hZEZpbHRlckNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uTG9hZEZpbHRlckNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNsZWFyRmlsdGVyQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25DbGVhckZpbHRlckNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckZpbHRlcnModHJpZ2dlckRhdGFzb3VyY2VVcGRhdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlLmNsZWFyQ29sdW1uRmlsdGVycyh0cmlnZ2VyRGF0YXNvdXJjZVVwZGF0ZSk7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSAmJiB0aGlzLm9UYWJsZU1lbnUuY29sdW1uRmlsdGVyT3B0aW9uKSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUuY29sdW1uRmlsdGVyT3B0aW9uLnNldEFjdGl2ZSh0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5zZXRWYWx1ZSh2b2lkIDApO1xuICAgIH1cbiAgfVxuXG4gIGlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAmJiB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuaXNDb2x1bW5GaWx0ZXJhYmxlKGNvbHVtbi5hdHRyKSk7XG4gIH1cblxuICBpc01vZGVDb2x1bW5GaWx0ZXJhYmxlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gJiZcbiAgICAgICh0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW4uYXR0cikpO1xuICB9XG5cbiAgaXNDb2x1bW5GaWx0ZXJBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiAmJlxuICAgICAgdGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGNvbHVtbi5hdHRyKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgb3BlbkNvbHVtbkZpbHRlckRpYWxvZyhjb2x1bW46IE9Db2x1bW4sIGV2ZW50OiBFdmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcHJldmlvdXNGaWx0ZXI6IHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlckJ5QXR0cihjb2x1bW4uYXR0ciksXG4gICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICB0YWJsZURhdGE6IHRoaXMuZGF0YVNvdXJjZS5nZXRUYWJsZURhdGEoKSxcbiAgICAgICAgcHJlbG9hZFZhbHVlczogdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LnByZWxvYWRWYWx1ZXMsXG4gICAgICAgIG1vZGU6IHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5tb2RlXG4gICAgICB9LFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGNvbHVtblZhbHVlRmlsdGVyID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldENvbHVtblZhbHVlc0ZpbHRlcigpO1xuICAgICAgICB0aGlzLmRhdGFTb3VyY2UuYWRkQ29sdW1uRmlsdGVyKGNvbHVtblZhbHVlRmlsdGVyKTtcbiAgICAgICAgdGhpcy5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgZGlzYWJsZVRhYmxlTWVudUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEodGhpcy5wZXJtaXNzaW9ucyAmJiB0aGlzLnBlcm1pc3Npb25zLm1lbnUgJiYgdGhpcy5wZXJtaXNzaW9ucy5tZW51LmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93VGFibGVNZW51QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm1pc3Npb25IaWRkZW4gPSAhISh0aGlzLnBlcm1pc3Npb25zICYmIHRoaXMucGVybWlzc2lvbnMubWVudSAmJiB0aGlzLnBlcm1pc3Npb25zLm1lbnUudmlzaWJsZSA9PT0gZmFsc2UpO1xuICAgIGlmIChwZXJtaXNzaW9uSGlkZGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHN0YXRpY09wdCA9IHRoaXMuc2VsZWN0QWxsQ2hlY2tib3ggfHwgdGhpcy5leHBvcnRCdXR0b24gfHwgdGhpcy5zaG93Q29uZmlndXJhdGlvbk9wdGlvbiB8fCB0aGlzLmNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uIHx8ICh0aGlzLnNob3dGaWx0ZXJPcHRpb24gJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBzdGF0aWNPcHQgfHwgdGhpcy50YWJsZU9wdGlvbnMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHNldE9UYWJsZUluc2VydGFibGVSb3codGFibGVJbnNlcnRhYmxlUm93OiBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50KSB7XG4gICAgY29uc3QgaW5zZXJ0UGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRBY3Rpb25QZXJtaXNzaW9ucyhQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQpO1xuICAgIGlmIChpbnNlcnRQZXJtLnZpc2libGUpIHtcbiAgICAgIHRhYmxlSW5zZXJ0YWJsZVJvdy5lbmFibGVkID0gaW5zZXJ0UGVybS5lbmFibGVkO1xuICAgICAgdGhpcy5vVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50ID0gdGFibGVJbnNlcnRhYmxlUm93O1xuICAgICAgdGhpcy5zaG93Rmlyc3RJbnNlcnRhYmxlUm93ID0gdGhpcy5vVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50LmlzRmlyc3RSb3coKTtcbiAgICAgIHRoaXMuc2hvd0xhc3RJbnNlcnRhYmxlUm93ID0gIXRoaXMuc2hvd0ZpcnN0SW5zZXJ0YWJsZVJvdztcbiAgICAgIHRoaXMub1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudC5pbml0aWFsaXplRWRpdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyU2VsZWN0aW9uQW5kRWRpdGluZygpIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcigpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5lZGl0aW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICB1c2VEZXRhaWxCdXR0b24oY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbHVtbi50eXBlID09PSAnZWRpdEJ1dHRvbkluUm93JyB8fCBjb2x1bW4udHlwZSA9PT0gJ2RldGFpbEJ1dHRvbkluUm93JztcbiAgfVxuXG4gIG9uRGV0YWlsQnV0dG9uQ2xpY2soY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3dpdGNoIChjb2x1bW4udHlwZSkge1xuICAgICAgY2FzZSAnZWRpdEJ1dHRvbkluUm93JzpcbiAgICAgICAgdGhpcy5lZGl0RGV0YWlsKHJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGV0YWlsQnV0dG9uSW5Sb3cnOlxuICAgICAgICB0aGlzLnZpZXdEZXRhaWwocm93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGV0YWlsQnV0dG9uSWNvbihjb2x1bW46IE9Db2x1bW4pIHtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgc3dpdGNoIChjb2x1bW4udHlwZSkge1xuICAgICAgY2FzZSAnZWRpdEJ1dHRvbkluUm93JzpcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5lZGl0QnV0dG9uSW5Sb3dJY29uO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RldGFpbEJ1dHRvbkluUm93JzpcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5kZXRhaWxCdXR0b25JblJvd0ljb247XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdXNlUGxhaW5SZW5kZXIoY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy51c2VEZXRhaWxCdXR0b24oY29sdW1uKSAmJiAhY29sdW1uLnJlbmRlcmVyICYmICghY29sdW1uLmVkaXRvciB8fCAoIWNvbHVtbi5lZGl0aW5nIHx8ICF0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdykpKTtcbiAgfVxuXG4gIHVzZUNlbGxSZW5kZXJlcihjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbHVtbi5yZW5kZXJlciAmJiAoIWNvbHVtbi5lZGl0aW5nIHx8IGNvbHVtbi5lZGl0aW5nICYmICF0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdykpO1xuICB9XG5cbiAgdXNlQ2VsbEVkaXRvcihjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgLy8gVE9ETyBBZGQgY29sdW1uLmVkaXRvciBpbnN0YW5jZW9mIE9UYWJsZUNlbGxFZGl0b3JCb29sZWFuQ29tcG9uZW50IHRvIGNvbmRpdGlvblxuICAgIGlmIChjb2x1bW4uZWRpdG9yICYmIGNvbHVtbi5lZGl0b3IuYXV0b0NvbW1pdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gY29sdW1uLmVkaXRvciAmJiBjb2x1bW4uZWRpdGluZyAmJiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdyk7XG4gIH1cblxuICBpc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSBDb2Rlcy5TRUxFQ1RJT05fTU9ERV9NVUxUSVBMRTtcbiAgfVxuXG4gIGlzU2VsZWN0aW9uTW9kZVNpbmdsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSBDb2Rlcy5TRUxFQ1RJT05fTU9ERV9TSU5HTEU7XG4gIH1cblxuICBpc1NlbGVjdGlvbk1vZGVOb25lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT09IENvZGVzLlNFTEVDVElPTl9NT0RFX05PTkU7XG4gIH1cblxuICBvbkNoYW5nZVBhZ2UoZXZ0OiBQYWdlRXZlbnQpIHtcbiAgICB0aGlzLmZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gZXZ0LnBhZ2VJbmRleDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGFibGVTdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBnb2luZ0JhY2sgPSBldnQucGFnZUluZGV4IDwgdGhpcy5jdXJyZW50UGFnZTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gZXZ0LnBhZ2VJbmRleDtcbiAgICBjb25zdCBwYWdlU2l6ZSA9IHRoaXMucGFnaW5hdG9yLmlzU2hvd2luZ0FsbFJvd3MoZXZ0LnBhZ2VTaXplKSA/IHRhYmxlU3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgOiBldnQucGFnZVNpemU7XG5cbiAgICBjb25zdCBvbGRRdWVyeVJvd3MgPSB0aGlzLnF1ZXJ5Um93cztcbiAgICBjb25zdCBjaGFuZ2luZ1BhZ2VTaXplID0gKG9sZFF1ZXJ5Um93cyAhPT0gcGFnZVNpemUpO1xuICAgIHRoaXMucXVlcnlSb3dzID0gcGFnZVNpemU7XG5cbiAgICBsZXQgbmV3U3RhcnRSZWNvcmQ7XG4gICAgbGV0IHF1ZXJ5TGVuZ3RoO1xuXG4gICAgaWYgKGdvaW5nQmFjayB8fCBjaGFuZ2luZ1BhZ2VTaXplKSB7XG4gICAgICBuZXdTdGFydFJlY29yZCA9ICh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MpO1xuICAgICAgcXVlcnlMZW5ndGggPSB0aGlzLnF1ZXJ5Um93cztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U3RhcnRSZWNvcmQgPSBNYXRoLm1heCh0YWJsZVN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0LCAodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzKSk7XG4gICAgICBjb25zdCBuZXdFbmRSZWNvcmQgPSBNYXRoLm1pbihuZXdTdGFydFJlY29yZCArIHRoaXMucXVlcnlSb3dzLCB0YWJsZVN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyKTtcbiAgICAgIHF1ZXJ5TGVuZ3RoID0gTWF0aC5taW4odGhpcy5xdWVyeVJvd3MsIG5ld0VuZFJlY29yZCAtIG5ld1N0YXJ0UmVjb3JkKTtcbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgb2Zmc2V0OiBuZXdTdGFydFJlY29yZCxcbiAgICAgIGxlbmd0aDogcXVlcnlMZW5ndGhcbiAgICB9O1xuICAgIHRoaXMuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gIH1cblxuICBnZXRPQ29sdW1uKGF0dHI6IHN0cmluZyk6IE9Db2x1bW4ge1xuICAgIHJldHVybiB0aGlzLl9vVGFibGVPcHRpb25zID8gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbmQoaXRlbSA9PiBpdGVtLm5hbWUgPT09IGF0dHIpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgaW5zZXJ0UmVjb3JkKHJlY29yZERhdGE6IGFueSwgc3FsVHlwZXM/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0lOU0VSVCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc3FsVHlwZXMpKSB7XG4gICAgICBjb25zdCBhbGxTcWxUeXBlcyA9IHRoaXMuZ2V0U3FsVHlwZXMoKTtcbiAgICAgIHNxbFR5cGVzID0ge307XG4gICAgICBPYmplY3Qua2V5cyhyZWNvcmREYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHNxbFR5cGVzW2tleV0gPSBhbGxTcWxUeXBlc1trZXldO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRhb1RhYmxlLmluc2VydFF1ZXJ5KHJlY29yZERhdGEsIHNxbFR5cGVzKTtcbiAgfVxuXG4gIHVwZGF0ZVJlY29yZChmaWx0ZXI6IGFueSwgdXBkYXRlRGF0YTogYW55LCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fVVBEQVRFKSkge1xuICAgICAgcmV0dXJuIG9mKHRoaXMuZGF0YVNvdXJjZS5kYXRhKTtcbiAgICB9XG4gICAgY29uc3Qgc3FsVHlwZXNBcmcgPSBzcWxUeXBlcyB8fCB7fTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHNxbFR5cGVzKSkge1xuICAgICAgY29uc3QgYWxsU3FsVHlwZXMgPSB0aGlzLmdldFNxbFR5cGVzKCk7XG4gICAgICBPYmplY3Qua2V5cyhmaWx0ZXIpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgc3FsVHlwZXNBcmdba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5rZXlzKHVwZGF0ZURhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgc3FsVHlwZXNBcmdba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGFvVGFibGUudXBkYXRlUXVlcnkoZmlsdGVyLCB1cGRhdGVEYXRhLCBzcWxUeXBlc0FyZyk7XG4gIH1cblxuICBnZXREYXRhQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGFvVGFibGUuZGF0YTtcbiAgfVxuXG4gIHNldERhdGFBcnJheShkYXRhOiBBcnJheTxhbnk+KSB7XG4gICAgaWYgKHRoaXMuZGFvVGFibGUpIHtcbiAgICAgIC8vIHJlbW90ZSBwYWdpbmF0aW9uIGhhcyBubyBzZW5zZSB3aGVuIHVzaW5nIHN0YXRpYy1kYXRhXG4gICAgICB0aGlzLnBhZ2VhYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXRpY0RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5kYW9UYWJsZS51c2luZ1N0YXRpY0RhdGEgPSB0cnVlO1xuICAgICAgdGhpcy5kYW9UYWJsZS5zZXREYXRhQXJyYXkodGhpcy5zdGF0aWNEYXRhKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZGVsZXRlTG9jYWxJdGVtcygpIHtcbiAgICBjb25zdCBkYXRhQXJyYXkgPSB0aGlzLmdldERhdGFBcnJheSgpO1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBzZWxlY3RlZEl0ZW1zLmZvckVhY2goKHNlbGVjdGVkSXRlbTogYW55KSA9PiB7XG4gICAgICBmb3IgKGxldCBqID0gZGF0YUFycmF5Lmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgIGlmIChVdGlsLmVxdWFscyhzZWxlY3RlZEl0ZW0sIGRhdGFBcnJheVtqXSkpIHtcbiAgICAgICAgICBkYXRhQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIHRoaXMuc2V0RGF0YUFycmF5KGRhdGFBcnJheSk7XG4gIH1cblxuICBpc0NvbHVtblNvcnRBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLnNvcnRDb2xBcnJheS5maW5kKHNvcnRDID0+IHNvcnRDLmNvbHVtbk5hbWUgPT09IGNvbHVtbi5hdHRyKTtcbiAgICByZXR1cm4gZm91bmQgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlzQ29sdW1uRGVzY1NvcnRBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLnNvcnRDb2xBcnJheS5maW5kKHNvcnRDID0+IHNvcnRDLmNvbHVtbk5hbWUgPT09IGNvbHVtbi5hdHRyICYmICFzb3J0Qy5hc2NlbmRlbnQpO1xuICAgIHJldHVybiBmb3VuZCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaGFzVGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlzRW1wdHkodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhVXRpbC5pc0RlZmluZWQodmFsdWUpIHx8ICgodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgJiYgIXZhbHVlKTtcbiAgfVxuXG4gIHNldEZpbHRlcnNDb25maWd1cmF0aW9uKGNvbmY6IGFueSkge1xuICAgIC8vIGluaXRpYWxpemUgZmlsdGVyQ2FzZVNlbnNpdGl2ZVxuXG4gICAgLypcbiAgICAgIENoZWNraW5nIHRoZSBvcmlnaW5hbCBmaWx0ZXJDYXNlU2Vuc2l0aXZlIHdpdGggdGhlIGZpbHRlckNhc2VTZW5zaXRpdmUgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmIGZpbHRlckNhc2VTZW5zaXRpdmUgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGlzIGVxdWFscyB0byBvcmlnaW5hbCBmaWx0ZXJDYXNlU2Vuc2l0aXZlIGlucHV0XG4gICAgICBmaWx0ZXJDYXNlU2Vuc2l0aXZlIHdpbGwgYmUgdGhlIHZhbHVlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAqL1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmUpICYmIHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpICYmXG4gICAgICB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJykgJiZcbiAgICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9PT0gY29uZlsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZSddKSB7XG4gICAgICB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmUgPSBjb25mLmhhc093blByb3BlcnR5KCdmaWx0ZXItY2FzZS1zZW5zaXRpdmUnKSA/IGNvbmZbJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZSddIDogdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlO1xuICAgIH1cblxuICAgIGNvbnN0IHN0b3JlZENvbHVtbkZpbHRlcnMgPSB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29sdW1uc0ZpbHRlcnMoY29uZik7XG4gICAgdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gc3RvcmVkQ29sdW1uRmlsdGVycy5sZW5ndGggPiAwO1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUgJiYgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbikge1xuICAgICAgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbi5zZXRBY3RpdmUodGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UuaW5pdGlhbGl6ZUNvbHVtbnNGaWx0ZXJzKHN0b3JlZENvbHVtbkZpbHRlcnMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50LnNldFZhbHVlKGNvbmYuZmlsdGVyKTtcbiAgICAgIGNvbnN0IHN0b3JlZENvbHVtbnNEYXRhID0gY29uZi5vQ29sdW1ucyB8fCBbXTtcbiAgICAgIHN0b3JlZENvbHVtbnNEYXRhLmZvckVhY2goKG9Db2xEYXRhOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb0NvbCA9IHRoaXMuZ2V0T0NvbHVtbihvQ29sRGF0YS5hdHRyKTtcbiAgICAgICAgaWYgKG9Db2wpIHtcbiAgICAgICAgICBpZiAob0NvbERhdGEuaGFzT3duUHJvcGVydHkoJ3NlYXJjaGluZycpKSB7XG4gICAgICAgICAgICBvQ29sLnNlYXJjaGluZyA9IG9Db2xEYXRhLnNlYXJjaGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RvcmVDb25maWd1cmF0aW9uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25TdG9yZUNvbmZpZ3VyYXRpb25DbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgb25BcHBseUNvbmZpZ3VyYXRpb25DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkFwcGx5Q29uZmlndXJhdGlvbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBhcHBseURlZmF1bHRDb25maWd1cmF0aW9uKCkge1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZS5yZXNldCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVBhcmFtcygpO1xuICAgIHRoaXMucGFyc2VWaXNpYmxlQ29sdW1ucygpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb3J0KChhOiBPQ29sdW1uLCBiOiBPQ29sdW1uKSA9PiB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGEuYXR0cikgLSB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGIuYXR0cikpO1xuICAgIHRoaXMuaW5zaWRlVGFiQnVnV29ya2Fyb3VuZCgpO1xuICAgIHRoaXMub25SZWluaXRpYWxpemUuZW1pdChudWxsKTtcbiAgICB0aGlzLmNsZWFyRmlsdGVycyhmYWxzZSk7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gIH1cblxuICBhcHBseUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbk5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHN0b3JlZENvbmZpZ3VyYXRpb24gPSB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uTmFtZSk7XG4gICAgaWYgKHN0b3JlZENvbmZpZ3VyYXRpb24pIHtcbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBzdG9yZWRDb25maWd1cmF0aW9uW09UYWJsZVN0b3JhZ2UuU1RPUkVEX1BST1BFUlRJRVNfS0VZXSB8fCBbXTtcbiAgICAgIGNvbnN0IGNvbmYgPSBzdG9yZWRDb25maWd1cmF0aW9uW09UYWJsZVN0b3JhZ2UuU1RPUkVEX0NPTkZJR1VSQVRJT05fS0VZXTtcbiAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgICBjYXNlICdzb3J0JzpcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddID0gY29uZlsnc29ydC1jb2x1bW5zJ107XG4gICAgICAgICAgICB0aGlzLnBhcnNlU29ydENvbHVtbnMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2NvbHVtbnMtZGlzcGxheSc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J10gPSBjb25mWydvQ29sdW1ucy1kaXNwbGF5J107XG4gICAgICAgICAgICB0aGlzLnBhcnNlVmlzaWJsZUNvbHVtbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddID0gY29uZlsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ107XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVDaGVja2JveENvbHVtbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncXVpY2stZmlsdGVyJzpcbiAgICAgICAgICBjYXNlICdjb2x1bW5zLWZpbHRlcic6XG4gICAgICAgICAgICB0aGlzLnNldEZpbHRlcnNDb25maWd1cmF0aW9uKGNvbmYpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncGFnZSc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlID0gY29uZi5jdXJyZW50UGFnZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBjb25mLmN1cnJlbnRQYWdlO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciA9IGNvbmYudG90YWxRdWVyeVJlY29yZHNOdW1iZXI7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSBjb25mLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWVyeVJvd3MgPSBjb25mWydxdWVyeS1yb3dzJ107XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICBnZXRUaXRsZUFsaWduQ2xhc3Mob0NvbDogT0NvbHVtbikge1xuICAgIGxldCBhbGlnbjtcbiAgICBjb25zdCBoYXNUaXRsZUFsaWduID0gVXRpbC5pc0RlZmluZWQob0NvbC5kZWZpbml0aW9uKSAmJiBVdGlsLmlzRGVmaW5lZChvQ29sLmRlZmluaXRpb24udGl0bGVBbGlnbik7XG4gICAgY29uc3QgYXV0b0FsaWduID0gKHRoaXMuYXV0b0FsaWduVGl0bGVzICYmICFoYXNUaXRsZUFsaWduKSB8fCAoaGFzVGl0bGVBbGlnbiAmJiBvQ29sLmRlZmluaXRpb24udGl0bGVBbGlnbiA9PT0gQ29kZXMuQ09MVU1OX1RJVExFX0FMSUdOX0FVVE8pO1xuICAgIGlmICghYXV0b0FsaWduKSB7XG4gICAgICByZXR1cm4gb0NvbC5nZXRUaXRsZUFsaWduQ2xhc3MoKTtcbiAgICB9XG4gICAgc3dpdGNoIChvQ29sLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAnYWN0aW9uJzpcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9DRU5URVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3VycmVuY3knOlxuICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICBjYXNlICdyZWFsJzpcbiAgICAgIGNhc2UgJ3BlcmNlbnRhZ2UnOlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9FTkQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VydmljZSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9TVEFSVDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBhbGlnbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZWxsQWxpZ25DbGFzcyhjb2x1bW46IE9Db2x1bW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZChjb2x1bW4uZGVmaW5pdGlvbikgJiYgVXRpbC5pc0RlZmluZWQoY29sdW1uLmRlZmluaXRpb24uY29udGVudEFsaWduKSA/ICdvLScgKyBjb2x1bW4uZGVmaW5pdGlvbi5jb250ZW50QWxpZ24gOiAnJztcbiAgfVxuXG4gIG9uVGFibGVTY3JvbGwoZSkge1xuICAgIGlmICh0aGlzLmhhc1Njcm9sbGFibGVDb250YWluZXIoKSkge1xuICAgICAgY29uc3QgdGFibGVWaWV3SGVpZ2h0ID0gZS50YXJnZXQub2Zmc2V0SGVpZ2h0OyAvLyB2aWV3cG9ydDogfjUwMHB4XG4gICAgICBjb25zdCB0YWJsZVNjcm9sbEhlaWdodCA9IGUudGFyZ2V0LnNjcm9sbEhlaWdodDsgLy8gbGVuZ3RoIG9mIGFsbCB0YWJsZVxuICAgICAgY29uc3Qgc2Nyb2xsTG9jYXRpb24gPSBlLnRhcmdldC5zY3JvbGxUb3A7IC8vIGhvdyBmYXIgdXNlciBzY3JvbGxlZFxuXG4gICAgICAvLyBJZiB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgd2l0aGluIDIwMHB4IG9mIHRoZSBib3R0b20sIGFkZCBtb3JlIGRhdGFcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IDEwMDtcbiAgICAgIGNvbnN0IGxpbWl0X1NDUk9MTFZJUlRVQUwgPSB0YWJsZVNjcm9sbEhlaWdodCAtIHRhYmxlVmlld0hlaWdodCAtIGJ1ZmZlcjtcbiAgICAgIGlmIChzY3JvbGxMb2NhdGlvbiA+IGxpbWl0X1NDUk9MTFZJUlRVQUwpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhU2Nyb2xsYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldERhdGFTY3JvbGxhYmxlKCk6IGFueSB7XG4gICAgY29uc3QgcGFnZVZpcnR1YWxCZWZvcmUgPSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsO1xuICAgIGNvbnN0IHBhZ2VWaXJ0dWFsRW5kID0gTWF0aC5jZWlsKHRoaXMuZGF0YVNvdXJjZS5yZXN1bHRzTGVuZ3RoIC8gQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCk7XG5cbiAgICBpZiAocGFnZVZpcnR1YWxFbmQgIT09IHRoaXMucGFnZVNjcm9sbFZpcnR1YWwpIHtcbiAgICAgIHRoaXMucGFnZVNjcm9sbFZpcnR1YWwrKztcbiAgICB9XG5cbiAgICAvLyB0aHJvdyBldmVudCBjaGFuZ2Ugc2Nyb2xsXG4gICAgaWYgKHBhZ2VWaXJ0dWFsQmVmb3JlICE9PSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsKSB7XG4gICAgICB0aGlzLmxvYWRpbmdTY3JvbGxTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UubG9hZERhdGFTY3JvbGxhYmxlID0gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbDtcbiAgICB9XG4gIH1cblxuICBoYXNTY3JvbGxhYmxlQ29udGFpbmVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UgJiYgIXRoaXMucGFnaW5hdGlvbkNvbnRyb2xzICYmICF0aGlzLnBhZ2VhYmxlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZERlZmF1bHRSb3dCdXR0b25zKCkge1xuICAgIC8vIGNoZWNrIHBlcm1pc3Npb25zXG4gICAgaWYgKHRoaXMuZWRpdEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLmFkZEJ1dHRvbkluUm93KCdlZGl0QnV0dG9uSW5Sb3cnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGV0YWlsQnV0dG9uSW5Sb3cpIHtcbiAgICAgIHRoaXMuYWRkQnV0dG9uSW5Sb3coJ2RldGFpbEJ1dHRvbkluUm93Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFkZEJ1dHRvbkluUm93KG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbERlZjogT0NvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbihuYW1lLCB0aGlzKTtcbiAgICBjb2xEZWYudHlwZSA9IG5hbWU7XG4gICAgY29sRGVmLnZpc2libGUgPSB0cnVlO1xuICAgIGNvbERlZi5zZWFyY2hhYmxlID0gZmFsc2U7XG4gICAgY29sRGVmLm9yZGVyYWJsZSA9IGZhbHNlO1xuICAgIGNvbERlZi5yZXNpemFibGUgPSBmYWxzZTtcbiAgICBjb2xEZWYudGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgY29sRGVmLndpZHRoID0gJzQ4cHgnO1xuICAgIHRoaXMucHVzaE9Db2x1bW5EZWZpbml0aW9uKGNvbERlZik7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5wdXNoKG5hbWUpO1xuICB9XG5cbiAgZ2V0IGhlYWRlckhlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gMDtcbiAgICBpZiAodGhpcy50YWJsZUhlYWRlckVsICYmIHRoaXMudGFibGVIZWFkZXJFbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgKz0gdGhpcy50YWJsZUhlYWRlckVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBpZiAodGhpcy50YWJsZVRvb2xiYXJFbCAmJiB0aGlzLnRhYmxlVG9vbGJhckVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGhlaWdodCArPSB0aGlzLnRhYmxlVG9vbGJhckVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0O1xuICB9XG5cbiAgaXNEZXRhaWxNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRldGFpbE1vZGUgIT09IENvZGVzLkRFVEFJTF9NT0RFX05PTkU7XG4gIH1cblxuICBjb3B5QWxsKCkge1xuICAgIFV0aWwuY29weVRvQ2xpcGJvYXJkKEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0UmVuZGVyZWRWYWx1ZSgpKSk7XG4gIH1cblxuICBjb3B5U2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmRhdGFTb3VyY2UuZ2V0UmVuZGVyZWREYXRhKHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpKTtcbiAgICBVdGlsLmNvcHlUb0NsaXBib2FyZChKU09OLnN0cmluZ2lmeShzZWxlY3RlZEl0ZW1zKSk7XG4gIH1cblxuICB2aWV3RGV0YWlsKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKCdkZXRhaWwnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdXBlci52aWV3RGV0YWlsKGl0ZW0pO1xuICB9XG5cbiAgZWRpdERldGFpbChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbignZWRpdCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLmVkaXREZXRhaWwoaXRlbSk7XG4gIH1cblxuICBnZXRPQ29sdW1uRnJvbVRoKHRoOiBhbnkpOiBPQ29sdW1uIHtcbiAgICBsZXQgcmVzdWx0OiBPQ29sdW1uO1xuICAgIGNvbnN0IGNsYXNzTGlzdDogYW55W10gPSBbXS5zbGljZS5jYWxsKCh0aCBhcyBFbGVtZW50KS5jbGFzc0xpc3QpO1xuICAgIGNvbnN0IGNvbHVtbkNsYXNzID0gY2xhc3NMaXN0LmZpbmQoKGNsYXNzTmFtZTogc3RyaW5nKSA9PiAoY2xhc3NOYW1lLnN0YXJ0c1dpdGgoJ21hdC1jb2x1bW4tJykpKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uQ2xhc3MpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uQ2xhc3Muc3Vic3RyKCdtYXQtY29sdW1uLScubGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDb2x1bW5JbnNlcnRhYmxlKG5hbWUpOiBzdHJpbmcge1xuICAgIHJldHVybiBuYW1lICsgdGhpcy5nZXRTdWZmaXhDb2x1bW5JbnNlcnRhYmxlKCk7XG4gIH1cblxuICBpc1Jvd1NlbGVjdGVkKHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzU2VsZWN0aW9uTW9kZU5vbmUoKSAmJiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29sdW1uc1dpZHRoRnJvbURPTSgpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy50YWJsZUhlYWRlckVsKSkge1xuICAgICAgW10uc2xpY2UuY2FsbCh0aGlzLnRhYmxlSGVhZGVyRWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbikuZm9yRWFjaCh0aEVsID0+IHtcbiAgICAgICAgY29uc3Qgb0NvbDogT0NvbHVtbiA9IHRoaXMuZ2V0T0NvbHVtbkZyb21UaCh0aEVsKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG9Db2wpICYmIHRoRWwuY2xpZW50V2lkdGggPiAwICYmIG9Db2wuRE9NV2lkdGggIT09IHRoRWwuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgICBvQ29sLkRPTVdpZHRoID0gdGhFbC5jbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaENvbHVtbnNXaWR0aCgpIHtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKGMgPT4gYy52aXNpYmxlKS5mb3JFYWNoKChjKSA9PiB7XG4gICAgICBjLkRPTVdpZHRoID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5nZXRDb2x1bW5zV2lkdGhGcm9tRE9NKCk7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKGMgPT4gYy52aXNpYmxlKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoYy5kZWZpbml0aW9uKSAmJiBVdGlsLmlzRGVmaW5lZChjLmRlZmluaXRpb24ud2lkdGgpICYmIHRoaXMuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgICAgIGMud2lkdGggPSBjLmRlZmluaXRpb24ud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgYy5nZXRSZW5kZXJXaWR0aCh0aGlzLmhvcml6b250YWxTY3JvbGwpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT0NvbHVtbihhdHRyPzogc3RyaW5nLCB0YWJsZT86IE9UYWJsZUNvbXBvbmVudCwgY29sdW1uPzogT1RhYmxlQ29sdW1uQ29tcG9uZW50ICYgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCk6IE9Db2x1bW4ge1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IE9Db2x1bW4oKTtcbiAgICBpZiAoYXR0cikge1xuICAgICAgaW5zdGFuY2UuYXR0ciA9IGF0dHI7XG4gICAgfVxuICAgIGlmICh0YWJsZSkge1xuICAgICAgaW5zdGFuY2Uuc2V0RGVmYXVsdFByb3BlcnRpZXMoe1xuICAgICAgICBvcmRlcmFibGU6IHRoaXMub3JkZXJhYmxlLFxuICAgICAgICByZXNpemFibGU6IHRoaXMucmVzaXphYmxlXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGNvbHVtbikge1xuICAgICAgaW5zdGFuY2Uuc2V0Q29sdW1uUHJvcGVydGllcyhjb2x1bW4pO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cbn1cbiJdfQ==