import * as tslib_1 from "tslib";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { ApplicationRef, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ContentChild, ContentChildren, ElementRef, EventEmitter, forwardRef, HostListener, Inject, Injector, Optional, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatPaginator, MatTab, MatTabGroup } from '@angular/material';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BooleanConverter, InputConverter } from '../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../services/factories';
import { SnackBarService } from '../../services/snackbar.service';
import { TableFilterByColumnDialogResult } from '../../types';
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
import { OTableColumnsFilterComponent } from './extensions/header/table-columns-filter/o-table-columns-filter.component';
import { OTableOptionComponent } from './extensions/header/table-option/o-table-option.component';
import { OTableDataSourceService } from './extensions/o-table-datasource.service';
import { OTableStorage } from './extensions/o-table-storage.class';
import { OTableDao } from './extensions/o-table.dao';
import { OTableRowExpandableComponent, OTableRowExpandedChange } from './extensions/row/table-row-expandable/o-table-row-expandable.component';
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
    'rowClass: row-class',
    'filterColumnActiveByDefault:filter-column-active-by-default'
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
    function OTableComponent(injector, elRef, dialog, _viewContainerRef, appRef, _componentFactoryResolver, form) {
        var _this = _super.call(this, injector, elRef, form) || this;
        _this.dialog = dialog;
        _this._viewContainerRef = _viewContainerRef;
        _this.appRef = appRef;
        _this._componentFactoryResolver = _componentFactoryResolver;
        _this.selectAllCheckbox = false;
        _this.exportButton = true;
        _this.showConfigurationOption = true;
        _this.columnsVisibilityButton = true;
        _this.showFilterOption = true;
        _this.showButtonsText = true;
        _this.originalFilterColumnActiveByDefault = false;
        _this.filterCaseSensitivePvt = false;
        _this.insertButton = true;
        _this.refreshButton = true;
        _this.deleteButton = true;
        _this.paginationControls = true;
        _this.fixedHeader = false;
        _this.showTitle = false;
        _this.editionMode = Codes.DETAIL_MODE_NONE;
        _this.selectionMode = Codes.SELECTION_MODE_MULTIPLE;
        _this._horizontalScroll = false;
        _this.showPaginatorFirstLastButtons = true;
        _this.autoAlignTitles = false;
        _this.multipleSort = true;
        _this.orderable = true;
        _this.resizable = true;
        _this.autoAdjust = false;
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
        _this.onFilterByColumnChange = new EventEmitter();
        _this.showFilterByColumnIcon = false;
        _this.showTotalsSubject = new BehaviorSubject(false);
        _this.showTotals = _this.showTotalsSubject.asObservable();
        _this.loadingSortingSubject = new BehaviorSubject(false);
        _this.loadingSorting = _this.loadingSortingSubject.asObservable();
        _this.loadingScrollSubject = new BehaviorSubject(false);
        _this.loadingScroll = _this.loadingScrollSubject.asObservable();
        _this.showFirstInsertableRow = false;
        _this.showLastInsertableRow = false;
        _this.expandableItem = new SelectionModel(false, []);
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
    Object.defineProperty(OTableComponent.prototype, "filterColumnActiveByDefault", {
        get: function () {
            return this.showFilterByColumnIcon;
        },
        set: function (value) {
            var result = BooleanConverter(value);
            this.originalFilterColumnActiveByDefault = result;
            this.showFilterByColumnIcon = result;
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
    Object.defineProperty(OTableComponent.prototype, "horizontalScroll", {
        get: function () {
            return this._horizontalScroll;
        },
        set: function (value) {
            this._horizontalScroll = BooleanConverter(value);
            this.refreshColumnsWidth();
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
                var containsExpandableCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_EXPANDABLE) !== -1;
                if (containsSelectionCol) {
                    this._visibleColArray.unshift(Codes.NAME_COLUMN_SELECT);
                }
                if (containsSelectionCol && containsExpandableCol) {
                    this._visibleColArray = [this._visibleColArray[0]].concat(Codes.NAME_COLUMN_EXPANDABLE, this._visibleColArray.splice(1));
                }
                else {
                    if (containsExpandableCol) {
                        this._visibleColArray.unshift(Codes.NAME_COLUMN_EXPANDABLE);
                    }
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
        if (this.oTableButtons) {
            this.oTableButtons.registerButtons(this.tableButtons.toArray());
        }
    };
    OTableComponent.prototype.ngAfterViewInit = function () {
        this.afterViewInit();
        this.initTableAfterViewInit();
        if (this.oTableMenu) {
            this.matMenu = this.oTableMenu.matMenu;
            this.oTableMenu.registerOptions(this.tableOptions.toArray());
        }
        if (this.tableRowExpandable) {
            this.createExpandableColumn();
        }
    };
    OTableComponent.prototype.createExpandableColumn = function () {
        this._oTableOptions.expandableColumn = new OColumn();
        this._oTableOptions.expandableColumn.visible = this.tableRowExpandable && this.tableRowExpandable.expandableColumnVisible;
        this.updateStateExpandedColumn();
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
            if (clonedOpts.hasOwnProperty('filterColumns')) {
                if (!this.oTableColumnsFilterComponent) {
                    this.oTableColumnsFilterComponent = new OTableColumnsFilterComponent(this.injector, this);
                    this.oTableMenu.onVisibleFilterOptionChange.next(this.filterColumnActiveByDefault);
                }
                this.oTableColumnsFilterComponent.columns = clonedOpts.filterColumns;
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
        this.showFilterByColumnIcon = this.originalFilterColumnActiveByDefault;
        this.initializeCheckboxColumn();
    };
    OTableComponent.prototype.updateStateExpandedColumn = function () {
        if (!this.tableRowExpandable || !this.tableRowExpandable.expandableColumnVisible) {
            return;
        }
        if (this._oTableOptions.visibleColumns[0] === Codes.NAME_COLUMN_SELECT && this._oTableOptions.visibleColumns[1] !== Codes.NAME_COLUMN_EXPANDABLE) {
            this._oTableOptions.visibleColumns = [this._oTableOptions.visibleColumns[0]].concat(Codes.NAME_COLUMN_EXPANDABLE, this._oTableOptions.visibleColumns.splice(1));
        }
        else if (this._oTableOptions.visibleColumns[0] !== Codes.NAME_COLUMN_EXPANDABLE) {
            this._oTableOptions.visibleColumns.unshift(Codes.NAME_COLUMN_EXPANDABLE);
        }
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
    OTableComponent.prototype.getExpandedRowContainerClass = function (rowIndex) {
        return OTableComponent.EXPANDED_ROW_CONTAINER_CLASS + rowIndex;
    };
    OTableComponent.prototype.getExpandableItems = function () {
        return this.expandableItem.selected;
    };
    OTableComponent.prototype.toogleRowExpandable = function (item, rowIndex, event) {
        var _this = this;
        event.stopPropagation();
        event.preventDefault();
        this.expandableItem.toggle(item);
        if (this.getStateExpand(item) === 'collapsed') {
            this.portalHost.detach();
            this.cd.detectChanges();
            var eventTableRowExpandableChange = this.emitTableRowExpandableChangeEvent(item, rowIndex);
            this.tableRowExpandable.onCollapsed.emit(eventTableRowExpandableChange);
        }
        else {
            this.portalHost = new DomPortalOutlet(this.elRef.nativeElement.querySelector('.' + this.getExpandedRowContainerClass(rowIndex)), this._componentFactoryResolver, this.appRef, this.injector);
            var templatePortal = new TemplatePortal(this.tableRowExpandable.templateRef, this._viewContainerRef, { $implicit: item });
            this.portalHost.attachTemplatePortal(templatePortal);
            setTimeout(function () {
                var eventTableRowExpandableChange = _this.emitTableRowExpandableChangeEvent(item, rowIndex);
                _this.tableRowExpandable.onExpanded.emit(eventTableRowExpandableChange);
            }, 250);
        }
    };
    OTableComponent.prototype.emitTableRowExpandableChangeEvent = function (data, rowIndex) {
        var event = new OTableRowExpandedChange();
        event.rowIndex = rowIndex;
        event.data = data;
        return event;
    };
    OTableComponent.prototype.isExpanded = function (data) {
        return this.expandableItem.isSelected(data);
    };
    OTableComponent.prototype.getStateExpand = function (row) {
        return this.isExpanded(row) ? 'expanded' : 'collapsed';
    };
    OTableComponent.prototype.isColumnExpandable = function () {
        return (Util.isDefined(this.tableRowExpandable) && Util.isDefined(this._oTableOptions.expandableColumn)) ? this._oTableOptions.expandableColumn.visible : false;
    };
    OTableComponent.prototype.hasExpandedRow = function () {
        return Util.isDefined(this.tableRowExpandable);
    };
    OTableComponent.prototype.getNumVisibleColumns = function () {
        return this.oTableOptions.visibleColumns.length;
    };
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
    OTableComponent.prototype.handleClick = function (item, rowIndex, $event) {
        var _this = this;
        this.clickTimer = setTimeout(function () {
            if (!_this.clickPrevent) {
                _this.doHandleClick(item, rowIndex, $event);
            }
            _this.clickPrevent = false;
        }, this.clickDelay);
    };
    OTableComponent.prototype.doHandleClick = function (item, rowIndex, $event) {
        if (!this.oenabled) {
            return;
        }
        if ((this.detailMode === Codes.DETAIL_MODE_CLICK)) {
            this.onClick.emit({ row: item, rowIndex: rowIndex, mouseEvent: $event });
            this.saveDataNavigationInLocalStorage();
            this.selection.clear();
            this.selectedRow(item);
            this.viewDetail(item);
            return;
        }
        if (this.isSelectionModeMultiple() && ($event.ctrlKey || $event.metaKey)) {
            this.selectedRow(item);
            this.onClick.emit({ row: item, rowIndex: rowIndex, mouseEvent: $event });
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
            this.onClick.emit({ row: item, rowIndex: rowIndex, mouseEvent: $event });
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
        this.updateStateExpandedColumn();
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
    Object.defineProperty(OTableComponent.prototype, "filterColumns", {
        get: function () {
            if (this.state.hasOwnProperty('initial-configuration') &&
                this.state['initial-configuration'].hasOwnProperty('filter-columns') &&
                this.state.hasOwnProperty('filter-columns') &&
                this.state['initial-configuration']['filter-columns'] === this.originalFilterColumns) {
                if (this.state.hasOwnProperty('filter-columns')) {
                    return this.state['filter-columns'];
                }
            }
            return this.originalFilterColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableComponent.prototype, "originalFilterColumns", {
        get: function () {
            var sortColumnsFilter = [];
            if (this.oTableColumnsFilterComponent) {
                sortColumnsFilter = this.oTableColumnsFilterComponent.columnsArray;
            }
            return sortColumnsFilter;
        },
        enumerable: true,
        configurable: true
    });
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
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        if (this.oTableQuickFilterComponent) {
            this.oTableQuickFilterComponent.setValue(void 0);
        }
    };
    OTableComponent.prototype.clearColumnFilter = function (attr, triggerDatasourceUpdate) {
        if (triggerDatasourceUpdate === void 0) { triggerDatasourceUpdate = true; }
        this.dataSource.clearColumnFilter(attr, triggerDatasourceUpdate);
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        this.reloadPaginatedDataFromStart();
    };
    OTableComponent.prototype.filterByColumn = function (columnValueFilter) {
        this.dataSource.addColumnFilter(columnValueFilter);
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        this.reloadPaginatedDataFromStart();
    };
    OTableComponent.prototype.clearColumnFilters = function (triggerDatasourceUpdate) {
        if (triggerDatasourceUpdate === void 0) { triggerDatasourceUpdate = true; }
        this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        this.reloadPaginatedDataFromStart();
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
                activeSortDirection: this.getSortFilterColumn(column),
                tableData: this.dataSource.getTableData(),
                preloadValues: this.oTableColumnsFilterComponent.preloadValues,
                mode: this.oTableColumnsFilterComponent.mode
            },
            minWidth: '380px',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(function (result) {
            switch (result) {
                case TableFilterByColumnDialogResult.ACCEPT:
                    var columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
                    _this.filterByColumn(columnValueFilter);
                    break;
                case TableFilterByColumnDialogResult.CLEAR:
                    var col = dialogRef.componentInstance.column;
                    _this.clearColumnFilter(col.attr);
                    break;
            }
        });
        dialogRef.componentInstance.onSortFilterValuesChange.subscribe(function (sortedFilterableColumn) {
            _this.storeFilterColumns(sortedFilterableColumn);
        });
    };
    OTableComponent.prototype.storeFilterColumns = function (sortColumnFilter) {
        if (this.state.hasOwnProperty('filter-columns') && this.state['filter-columns']) {
            var storeSortColumnsFilterState = this.oTableStorage.getFilterColumnsState();
            if (storeSortColumnsFilterState['filter-columns'].filter(function (x) { return x.attr === sortColumnFilter.attr; }).length > 0) {
                storeSortColumnsFilterState['filter-columns'].forEach(function (element) {
                    if (element.attr === sortColumnFilter.attr) {
                        element.sort = sortColumnFilter.sort;
                    }
                });
            }
            else {
                storeSortColumnsFilterState['filter-columns'].push(sortColumnFilter);
            }
            this.state['filter-columns'] = storeSortColumnsFilterState['filter-columns'];
        }
        else {
            this.state['filter-columns'] = this.filterColumns;
        }
    };
    OTableComponent.prototype.getSortFilterColumn = function (column) {
        var sortColumn;
        if (this.state.hasOwnProperty('filter-columns')) {
            this.state['filter-columns'].forEach(function (element) {
                if (element.attr === column.attr) {
                    sortColumn = element.sort;
                }
            });
        }
        if (!Util.isDefined(sortColumn) && this.oTableColumnsFilterComponent) {
            sortColumn = this.oTableColumnsFilterComponent.getSortValueOfFilterColumn(column.attr);
        }
        if (!Util.isDefined(sortColumn)) {
            if (this.sortColArray.find(function (x) { return x.columnName === column.attr; })) {
                sortColumn = this.isColumnSortActive(column) ? 'asc' : 'desc';
            }
        }
        return sortColumn;
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
        if (Util.isDefined(this.filterColumnActiveByDefault) && this.state.hasOwnProperty('initial-configuration') &&
            this.state['initial-configuration'].hasOwnProperty('filter-column-active-by-default') &&
            this.originalFilterColumnActiveByDefault !== conf['initial-configuration']['filter-column-active-by-default']) {
            this.showFilterByColumnIcon = this.originalFilterColumnActiveByDefault;
        }
        else {
            var filterColumnActiveByDefaultState = conf.hasOwnProperty('filter-column-active-by-default') ? conf['filter-column-active-by-default'] : this.filterColumnActiveByDefault;
            this.showFilterByColumnIcon = filterColumnActiveByDefaultState || storedColumnFilters.length > 0;
        }
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
    OTableComponent.prototype.getThWidthFromOColumn = function (oColumn) {
        var e_1, _a;
        var widthColumn;
        var thArray = [].slice.call(this.tableHeaderEl.nativeElement.children);
        try {
            for (var thArray_1 = tslib_1.__values(thArray), thArray_1_1 = thArray_1.next(); !thArray_1_1.done; thArray_1_1 = thArray_1.next()) {
                var th = thArray_1_1.value;
                var classList = [].slice.call(th.classList);
                var columnClass = classList.find(function (className) { return (className === 'mat-column-' + oColumn.attr); });
                if (columnClass && columnClass.length > 1) {
                    widthColumn = th.clientWidth;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (thArray_1_1 && !thArray_1_1.done && (_a = thArray_1.return)) _a.call(thArray_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return widthColumn;
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
        setTimeout(function () {
            _this._oTableOptions.columns.filter(function (c) { return c.visible; }).forEach(function (c) {
                if (Util.isDefined(c.definition) && Util.isDefined(c.definition.width)) {
                    c.width = c.definition.width;
                }
                c.getRenderWidth(_this.horizontalScroll, _this.getClientWidthColumn(c));
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
    OTableComponent.prototype.registerOTableButtons = function (arg) {
        this.oTableButtons = arg;
        if (this.oTableButtons) {
            this.oTableButtons.registerButtons(this.tableButtons.toArray());
        }
    };
    OTableComponent.prototype.getClientWidthColumn = function (col) {
        return col.DOMWidth || this.getThWidthFromOColumn(col);
    };
    OTableComponent.prototype.getMinWidthColumn = function (col) {
        return Util.extractPixelsValue(col.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH) + 'px';
    };
    OTableComponent.DEFAULT_BASE_SIZE_SPINNER = 100;
    OTableComponent.FIRST_LAST_CELL_PADDING = 24;
    OTableComponent.EXPANDED_ROW_CONTAINER_CLASS = 'expanded-row-container-';
    OTableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table',
                    template: "<div class=\"o-table-container\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\" [style.display]=\"isVisible()? '' : 'none'\"\n  (scroll)=\"onTableScroll($event)\" [class.block-events]=\"showLoading | async\" [class.o-scrollable-container]=\"hasScrollableContainer()\">\n  <div #tableToolbar *ngIf=\"hasControls()\" class=\"toolbar\">\n    <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n      <o-table-buttons #tableButtons [insert-button]=\"insertButton\" [refresh-button]=\"refreshButton\" [delete-button]=\"showDeleteButton\">\n        <ng-content select=\"o-table-button\"></ng-content>\n      </o-table-buttons>\n\n      <ng-content select=\"[o-table-custom-toolbar]\"></ng-content>\n\n      <div fxLayout fxFlex>\n        <span *ngIf=\"showTitle\" class=\"table-title\" fxFlex>{{ title | oTranslate }}</span>\n      </div>\n\n      <ng-container *ngIf=\"quickfilterContentChild; else defaultQuickFilter\">\n        <ng-content select=\"o-table-quickfilter\"></ng-content>\n      </ng-container>\n      <ng-template #defaultQuickFilter>\n        <ng-container *ngIf=\"quickFilter\">\n          <o-table-quickfilter (onChange)=\"reloadPaginatedDataFromStart()\"></o-table-quickfilter>\n        </ng-container>\n      </ng-template>\n\n\n      <button type=\"button\" *ngIf=\"showTableMenuButton\" mat-icon-button class=\"o-table-menu-button\" [matMenuTriggerFor]=\"tableMenu.matMenu\"\n        (click)=\"$event.stopPropagation()\">\n        <mat-icon svgIcon=\"ontimize:more_vert\"></mat-icon>\n      </button>\n      <o-table-menu #tableMenu [select-all-checkbox]=\"selectAllCheckbox\" [export-button]=\"exportButton\"\n        [columns-visibility-button]=\"columnsVisibilityButton\" [show-configuration-option]=\"showConfigurationOption\"\n        [show-filter-option]=\"showFilterOption\">\n        <ng-content select=\"o-table-option\"></ng-content>\n      </o-table-menu>\n      <ng-template #exportOptsTemplate>\n        <ng-content select=\"o-table-export-button\"></ng-content>\n      </ng-template>\n    </div>\n  </div>\n\n  <div #tableBody class=\"o-table-body o-scroll\" [class.horizontal-scroll]=\"horizontalScroll\" [class.scrolled]=\"horizontalScrolled\">\n    <div class=\"o-table-overflow o-scroll\">\n      <table mat-table #table [class.autoadjusted]=\"autoAdjust\" [trackBy]=\"getTrackByFunction()\" [dataSource]=\"dataSource\" oMatSort\n        [ngClass]=\"rowHeightObservable | async\" (scroll)=\"onTableScroll($event)\" (cdkObserveContent)=\"projectContentChanged()\" oTableExpandedFooter\n        multiTemplateDataRows=\"showExpandedColumn()\">\n\n        <!--Checkbox Column -->\n        <ng-container [matColumnDef]=\"oTableOptions.selectColumn.name\" *ngIf=\"oTableOptions.selectColumn.visible\">\n          <th mat-header-cell *matHeaderCellDef>\n            <mat-checkbox (click)=\"$event.stopPropagation()\" (change)=\"masterToggle($event)\" [checked]=\"isAllSelected()\"\n              [indeterminate]=\"selection.hasValue() && !isAllSelected()\"></mat-checkbox>\n          </th>\n          <td mat-cell *matCellDef=\"let row\">\n            <mat-checkbox name=\"id[]\" (click)=\"$event.stopPropagation()\" (change)=\"selectionCheckboxToggle($event, row)\"\n              [checked]=\"selection.isSelected(row)\"></mat-checkbox>\n          </td>\n        </ng-container>\n\n        <!--Expandable Column -->\n        <ng-container [matColumnDef]=\"oTableOptions.expandableColumn.name\" *ngIf=\"isColumnExpandable()\">\n          <th mat-header-cell *matHeaderCellDef>\n            {{ oTableOptions.expandableColumn.title }}\n          </th>\n          <td mat-cell *matCellDef=\"let row;let rowIndex = dataIndex\">\n            <mat-icon (click)=\"toogleRowExpandable(row, rowIndex, $event)\">\n              <ng-container *ngIf=\"isExpanded(row)\">{{ tableRowExpandable.iconCollapse }}</ng-container>\n              <ng-container *ngIf=\"!isExpanded(row)\">{{ tableRowExpandable.iconExpand }}</ng-container>\n            </mat-icon>\n          </td>\n        </ng-container>\n\n        <!-- Generic column definition -->\n        <ng-container *ngFor=\"let column of oTableOptions.columns\" [matColumnDef]=\"column.name\">\n          <!--Define header-cell-->\n\n          <th mat-header-cell *matHeaderCellDef [ngClass]=\"getTitleAlignClass(column)\" [class.resizable]=\"resizable\"\n            [style.width]=\"column.getRenderWidth(horizontalScroll, this.getClientWidthColumn(column))\" [style.min-width]=\"getMinWidthColumn(column)\"\n            [style.max-width]=\"column.maxWidth\">\n            <div class=\"content\">\n              <o-table-header-column-filter-icon *ngIf=\"isModeColumnFilterable(column)\" [column]=\"column\"></o-table-header-column-filter-icon>\n\n              <ng-container *ngIf=\"column.orderable\">\n                <span o-mat-sort-header>{{ column.title | oTranslate }}</span>\n              </ng-container>\n              <ng-container *ngIf=\"!column.orderable\">\n                <span class=\"header-title-container\">{{ column.title | oTranslate }}</span>\n              </ng-container>\n\n              <o-table-column-resizer *ngIf=\"resizable\" [column]=\"column\"></o-table-column-resizer>\n            </div>\n          </th>\n\n          <!--Define mat-cell-->\n          <td mat-cell *matCellDef=\"let row;let rowIndex=dataIndex\" [ngClass]=\"[column.className, getCellAlignClass(column)]\"\n            (click)=\"handleCellClick(column, row, $event)\" (dblclick)=\"handleCellDoubleClick(column, row, $event)\"\n            [class.empty-cell]=\"isEmpty(row[column.name])\" [matTooltipDisabled]=\"!column.hasTooltip()\" [matTooltip]=\"column.getTooltip(row)\"\n            matTooltipPosition=\"below\" matTooltipShowDelay=\"750\" matTooltipClass=\"o-table-cell-tooltip\"\n            [class.o-mat-cell-multiline]=\"(column.isMultiline | async)\" [oContextMenu]=\"tableContextMenu\"\n            [oContextMenuData]=\"{ cellName:column.name, rowValue:row, rowIndex:rowIndex}\"\n            [style.width]=\"column.getRenderWidth(horizontalScroll, this.getClientWidthColumn(column))\" [style.min-width]=\"getMinWidthColumn(column)\"\n            [style.max-width]=\"column.maxWidth\">\n            <div class=\"content\">\n\n              <ng-container [ngSwitch]=\"true\">\n                <ng-container *ngSwitchCase=\"column.renderer != null && (!column.editing || column.editing && !selection.isSelected(row))\">\n                  <ng-template *ngTemplateOutlet=\"column.renderer?.templateref; context:{ cellvalue: row[column.name], rowvalue:row }\">\n                  </ng-template>\n                </ng-container>\n                <ng-container *ngSwitchCase=\"selection.isSelected(row) && column.editing\">\n                  <ng-template *ngTemplateOutlet=\"column.editor?.templateref; context:{ cellvalue: row[column.name], rowvalue:row }\">\n                  </ng-template>\n                </ng-container>\n\n                <ng-container *ngSwitchCase=\"column.type === 'editButtonInRow' || column.type === 'detailButtonInRow'\">\n                  <div fxLayoutAlign=\"center center\" class=\"o-action-cell-renderer\" (click)=\"onDetailButtonClick(column, row, $event)\">\n                    <mat-icon>{{ getDetailButtonIcon(column) }}</mat-icon>\n                  </div>\n                </ng-container>\n                <ng-container *ngSwitchDefault>{{ row[column.name] }}</ng-container>\n              </ng-container>\n\n            </div>\n          </td>\n          <!--Define mat-footer-cell-->\n          <ng-container *ngIf=\"showTotals | async\">\n            <td mat-footer-cell *matFooterCellDef [ngClass]=\"column.className\">\n              <div class=\"title\" *ngIf=\"column.aggregate && column.aggregate.title\">\n                {{ column.aggregate.title | oTranslate }}\n              </div>\n              <ng-container *ngIf=\"!column.renderer\">\n                {{ dataSource.getAggregateData(column) }}\n              </ng-container>\n              <ng-template *ngIf=\"column.renderer && column.aggregate\" [ngTemplateOutlet]=\"column.renderer.templateref\"\n                [ngTemplateOutletContext]=\"{cellvalue: dataSource.getAggregateData(column)}\"></ng-template>\n            </td>\n          </ng-container>\n\n        </ng-container>\n\n        <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->\n        <ng-container *ngIf=\"hasExpandedRow()\">\n          <ng-container matColumnDef=\"expandedDetail\">\n            <td mat-cell *matCellDef=\"let row;let rowIndex= dataIndex\" [attr.colspan]=\"getNumVisibleColumns()\">\n              <div [ngClass]=\"getExpandedRowContainerClass(rowIndex)\" [@detailExpand]=\"getStateExpand(row)\">\n              </div>\n            </td>\n          </ng-container>\n        </ng-container>\n\n        <!--FOOTER-INSERTABLE-->\n        <ng-container *ngIf=\"showLastInsertableRow && oTableInsertableRowComponent\">\n          <ng-container [matColumnDef]=\"oTableOptions.selectColumn.name + getSuffixColumnInsertable()\" *ngIf=\"oTableOptions.selectColumn.visible\">\n            <td mat-footer-cell *matFooterCellDef>\n            </td>\n          </ng-container>\n          <ng-container *ngFor=\"let column of oTableOptions.columns\" [matColumnDef]=\"column.name+ getSuffixColumnInsertable()\">\n\n            <td mat-footer-cell *matFooterCellDef [ngClass]=\"column.className\">\n              <ng-container *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && !oTableInsertableRowComponent.useCellEditor(column)\">\n                <mat-form-field class=\"insertable-form-field\" [hideRequiredMarker]=\"false\" floatLabel=\"never\">\n                  <input matInput type=\"text\" [placeholder]=\"oTableInsertableRowComponent.getPlaceholder(column)\" [id]=\"column.attr\"\n                    [formControl]=\"oTableInsertableRowComponent.getControl(column)\"\n                    [required]=\"oTableInsertableRowComponent.isColumnRequired(column)\">\n                  <mat-error *ngIf=\"oTableInsertableRowComponent.columnHasError(column, 'required')\">\n                    {{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\n                  </mat-error>\n                </mat-form-field>\n              </ng-container>\n\n              <ng-container *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && oTableInsertableRowComponent.useCellEditor(column)\">\n                <ng-template [ngTemplateOutlet]=\"oTableInsertableRowComponent.columnEditors[column.attr].templateref\"\n                  [ngTemplateOutletContext]=\"{ rowvalue: oTableInsertableRowComponent.rowData }\">\n                </ng-template>\n              </ng-container>\n            </td>\n          </ng-container>\n\n        </ng-container>\n\n        <ng-container *ngIf=\"showFirstInsertableRow && oTableInsertableRowComponent\">\n          <ng-container [matColumnDef]=\"getColumnInsertable(oTableOptions.selectColumn.name)\" *ngIf=\"oTableOptions.selectColumn.visible\">\n            <td mat-header-cell *matHeaderCellDef>\n            </td>\n          </ng-container>\n          <ng-container *ngFor=\"let column of oTableOptions.columns\" [matColumnDef]=\"getColumnInsertable(column.name)\">\n\n            <td mat-header-cell *matHeaderCellDef [ngClass]=\"column.className\">\n              <ng-container *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && !oTableInsertableRowComponent.useCellEditor(column)\">\n                <mat-form-field class=\"insertable-form-field\" [hideRequiredMarker]=\"false\" floatLabel=\"never\">\n                  <input matInput type=\"text\" [placeholder]=\"oTableInsertableRowComponent.getPlaceholder(column)\" [id]=\"column.attr\"\n                    [formControl]=\"oTableInsertableRowComponent.getControl(column)\"\n                    [required]=\"oTableInsertableRowComponent.isColumnRequired(column)\">\n                  <mat-error *ngIf=\"oTableInsertableRowComponent.columnHasError(column, 'required')\">\n                    {{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\n                  </mat-error>\n                </mat-form-field>\n              </ng-container>\n\n              <ng-container *ngIf=\"oTableInsertableRowComponent.isColumnInsertable(column) && oTableInsertableRowComponent.useCellEditor(column)\">\n                <ng-template [ngTemplateOutlet]=\"oTableInsertableRowComponent.columnEditors[column.attr].templateref\"\n                  [ngTemplateOutletContext]=\"{ rowvalue: oTableInsertableRowComponent.rowData }\">\n                </ng-template>\n              </ng-container>\n            </td>\n          </ng-container>\n\n        </ng-container>\n\n\n        <tr #tableHeader mat-header-row *matHeaderRowDef=\"oTableOptions.visibleColumns; sticky: fixedHeader\"></tr>\n\n        <tr mat-row oTableRow *matRowDef=\"let row; columns: oTableOptions.visibleColumns;let i = index;let rowIndex = dataIndex\"\n          (click)=\"handleClick(row, rowIndex, $event)\" (dblclick)=\"handleDoubleClick(row, $event)\" [class.selected]=\"isRowSelected(row)\"\n          [ngClass]=\"row | oTableRowClass: i: rowClass\">\n        </tr>\n\n        <ng-container *ngIf=\"hasExpandedRow()\">\n          <tr mat-row *matRowDef=\"let row; columns: ['expandedDetail']\" class=\"o-table-row-expanded\"></tr>\n        </ng-container>\n\n        <ng-container *ngIf=\"showLastInsertableRow\">\n          <tr mat-footer-row *matFooterRowDef=\"oTableOptions.columnsInsertables; sticky: true\"\n            (keyup)=\"oTableInsertableRowComponent.handleKeyboardEvent($event)\" class=\"o-table-insertable\"></tr>\n        </ng-container>\n        <ng-container *ngIf=\"showFirstInsertableRow\">\n          <tr mat-header-row *matHeaderRowDef=\"oTableOptions.columnsInsertables; sticky: true\"\n            (keyup)=\"oTableInsertableRowComponent.handleKeyboardEvent($event)\" class=\"o-table-insertable\"> </tr>\n        </ng-container>\n        <ng-container *ngIf=\"showTotals | async\">\n          <tr mat-footer-row *matFooterRowDef=\"oTableOptions.visibleColumns; sticky: true\" class=\"o-table-aggregate\">\n          </tr>\n        </ng-container>\n      </table>\n    </div>\n  </div>\n\n  <!--TABLE PAGINATOR-->\n  <mat-paginator *ngIf=\"paginator\" #matpaginator [length]=\"dataSource?.resultsLength\" [pageIndex]=\"paginator.pageIndex\" [pageSize]=\"queryRows\"\n    [pageSizeOptions]=\"paginator.pageSizeOptions\" (page)=\"onChangePage($event)\" [showFirstLastButtons]=\"paginator.showFirstLastButtons\">\n  </mat-paginator>\n\n  <!--LOADING-->\n  <div #spinnerContainer *ngIf=\"showLoading | async\" fxLayout=\"column\" fxLayoutAlign=\"center center\" [ngStyle]=\"{'top.px': headerHeight}\"\n    class=\"spinner-container\" [class.spinner-container-scrollable]=\"loadingScroll | async\">\n    <mat-progress-spinner mode=\"indeterminate\" strokeWidth=\"3\" [diameter]=\"diameterSpinner\"></mat-progress-spinner>\n  </div>\n\n  <!-- Disable blocker -->\n  <div *ngIf=\"!enabled\" class=\"o-table-disabled-blocker\"></div>\n</div>\n",
                    providers: [
                        OntimizeServiceProvider,
                        OTableDataSourceService
                    ],
                    animations: [
                        trigger('detailExpand', [
                            state('collapsed', style({ height: '0px', minHeight: '0' })),
                            state('expanded', style({ height: '*' })),
                            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
                        ])
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
                    styles: [".o-table{height:100%;max-height:100%;width:100%}.o-table.o-table-disabled{opacity:.4}.o-table .o-table-container{height:100%;display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:flex-start;align-items:flex-start;align-content:stretch;min-width:100%;min-height:100%;position:relative;padding:0 .5%}.o-table .o-table-container .o-table-body .o-table-overflow{overflow-y:auto;overflow-x:hidden;min-width:100%}.o-table .o-table-container .o-table-body.horizontal-scroll .o-table-overflow{overflow-x:auto}.o-table .o-table-container .o-table-body thead .mat-header-row th:last-child .o-table-column-resizer{display:none}.o-table .o-table-container.block-events{pointer-events:none}.o-table .o-table-container.block-events>.o-table-body .mat-header-row,.o-table .o-table-container.block-events>.toolbar{opacity:.75}.o-table .o-table-container .toolbar{height:40px}.o-table .o-table-container .toolbar>div{max-height:100%}.o-table .o-table-container .toolbar .buttons{margin:0 10px 0 4px}.o-table .o-table-container .toolbar .table-title{font-size:18px;font-weight:400;text-align:center}.o-table .o-table-container .o-table-body{display:flex;flex:1 1 auto;max-width:100%;height:100%;overflow:hidden;position:relative}.o-table .o-table-container .o-table-body .table-title{font-size:18px;font-weight:400;text-align:center}.o-table .o-table-container .o-table-body .spinner-container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:500;visibility:visible;opacity:1;transition:opacity .25s linear}.o-table .o-table-container .o-table-body.horizontal-scroll{overflow-x:auto;padding-bottom:16px}.o-table .o-table-container .o-table-body.horizontal-scroll .mat-header-cell{width:150px}.o-table .o-table-container .o-table-body .o-table-no-results{cursor:default;text-align:center}.o-table .o-table-container .o-table-body .o-table-no-results td{text-align:center}.o-table .o-table-container .mat-table{table-layout:fixed;width:100%}.o-table .o-table-container .mat-table.autoadjusted{table-layout:auto}.o-table .o-table-container .mat-table td .content,.o-table .o-table-container .mat-table th .content{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.o-table .o-table-container .mat-table.small .column-filter-icon,.o-table .o-table-container .mat-table.small .mat-sort-header-arrow{margin-top:2px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-checkbox-inner-container,.o-table .o-table-container .mat-table.small .mat-row .mat-checkbox-inner-container{height:16px;width:16px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path,.o-table .o-table-container .mat-table.small .mat-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path{width:2.13333px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-checkbox-inner-container .mat-checkbox-mixedmark,.o-table .o-table-container .mat-table.small .mat-row .mat-checkbox-inner-container .mat-checkbox-mixedmark{height:2px}.o-table .o-table-container .mat-table.small .mat-header-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.small .mat-header-row .mat-header-cell .image-avatar,.o-table .o-table-container .mat-table.small .mat-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.small .mat-row .mat-header-cell .image-avatar{width:22px;height:22px}.o-table .o-table-container .mat-table.medium .column-filter-icon,.o-table .o-table-container .mat-table.medium .mat-sort-header-arrow{margin-top:6px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.medium .mat-header-row .mat-header-cell .image-avatar,.o-table .o-table-container .mat-table.medium .mat-row .mat-cell .image-avatar,.o-table .o-table-container .mat-table.medium .mat-row .mat-header-cell .image-avatar{width:28px;height:28px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-checkbox-inner-container,.o-table .o-table-container .mat-table.medium .mat-row .mat-checkbox-inner-container{height:18px;width:18px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path,.o-table .o-table-container .mat-table.medium .mat-row .mat-checkbox-inner-container .mat-checkbox-checkmark-path{width:2.4px}.o-table .o-table-container .mat-table.medium .mat-header-row .mat-checkbox-inner-container .mat-checkbox-mixedmark,.o-table .o-table-container .mat-table.medium .mat-row .mat-checkbox-inner-container .mat-checkbox-mixedmark{height:2px}.o-table .o-table-container .mat-table.large .column-filter-icon,.o-table .o-table-container .mat-table.large .mat-sort-header-arrow{margin-top:8px}.o-table .o-table-container .mat-table tr.mat-row.o-table-row-expanded{height:0}.o-table .o-table-container .mat-table .mat-row{box-sizing:border-box;transition:background-color .2s;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.o-table .o-table-container .mat-table .mat-row .mat-cell{padding:0 12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.o-table .o-table-container .mat-table .mat-row .mat-cell:not(.o-column-image):first-of-type{padding-left:24px}.o-table .o-table-container .mat-table .mat-row .mat-cell:last-of-type{padding-right:24px}.o-table .o-table-container .mat-table .mat-row .mat-cell.empty-cell{min-height:16px}.o-table .o-table-container .mat-table .mat-row .mat-cell .action-cell-renderer{cursor:pointer}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-start{text-align:start}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-center{text-align:center}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-end{text-align:end}.o-table .o-table-container .mat-table .mat-row .mat-cell *{vertical-align:middle}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-mat-cell-multiline:not(.mat-header-cell){padding:6px 12px}.o-table .o-table-container .mat-table .mat-row .mat-cell.o-mat-cell-multiline .content{overflow:initial;white-space:normal;text-overflow:unset}.o-table .o-table-container .mat-table .mat-row .mat-cell .image-avatar{width:34px;height:34px;margin:1px auto;overflow:hidden;border-radius:50%;position:relative;z-index:1}.o-table .o-table-container .mat-table .mat-row .mat-cell .image-avatar img{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:100%;max-width:inherit;max-height:inherit}.o-table .o-table-container .mat-table .o-action-cell-renderer{display:inline-block;cursor:pointer}.o-table .o-table-container .mat-table .mat-header-cell{overflow:hidden;position:relative;box-sizing:border-box;padding:0 12px;vertical-align:middle}.o-table .o-table-container .mat-table .mat-header-cell.resizable{padding-right:24px}.o-table .o-table-container .mat-table .mat-header-cell:first-of-type{padding-left:0;padding-right:0}.o-table .o-table-container .mat-table .mat-header-cell:not(.o-column-image){overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.o-table .o-table-container .mat-table .mat-header-cell .o-table-header-indicator-numbered{font-size:8px;position:absolute;text-align:center;display:inline-block;width:18px;height:18px;line-height:18px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;pointer-events:none;bottom:-10px;right:-9px}.o-table .o-table-container .mat-table .mat-header-cell .column-filter-icon{cursor:pointer;float:left;font-size:18px;width:18px;height:18px;margin-right:2px;line-height:1}.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-button{flex:1;display:block;place-content:center}.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-arrow{position:absolute;right:0}.o-table .o-table-container .mat-table .mat-header-cell .header-title-container{cursor:default}.o-table .o-table-container .mat-table .mat-header-cell.resizable .mat-sort-header-arrow{margin-right:12px}.o-table .o-table-container .mat-table .mat-header-cell .header-title-container,.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-button{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.o-table .o-table-container .mat-table .mat-header-cell.start,.o-table .o-table-container .mat-table .mat-header-cell.start .mat-sort-header-button{text-align:left}.o-table .o-table-container .mat-table .mat-header-cell.center,.o-table .o-table-container .mat-table .mat-header-cell.center .mat-sort-header-button{text-align:center}.o-table .o-table-container .mat-table .mat-header-cell.center [o-mat-sort-header] .mat-sort-header-button{padding-left:12px}.o-table .o-table-container .mat-table .mat-header-cell.end,.o-table .o-table-container .mat-table .mat-header-cell.end .mat-sort-header-button{text-align:right}.o-table .o-table-container .mat-table .mat-header-cell .mat-sort-header-container{padding-top:4px}.o-table .o-table-container .mat-table .mat-cell.mat-column-select,.o-table .o-table-container .mat-table .mat-header-cell.mat-column-select{width:18px;box-sizing:content-box;padding:0 0 0 24px;overflow:initial}.o-table .o-table-container .mat-table .mat-cell.mat-column-expandable,.o-table .o-table-container .mat-table .mat-header-cell.mat-column-expandable{width:40px;box-sizing:content-box;padding:0 0 0 24px;overflow:initial}.o-table .o-table-container .mat-table .mat-cell .row-container-expanded{overflow:hidden;display:flex}.o-table .o-table-container .o-table-disabled-blocker{bottom:0;left:0;position:absolute;right:0;top:0;z-index:100}.o-table .spinner-container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:500;visibility:visible;opacity:1;transition:opacity .25s linear}.o-table .spinner-container-scrollable{position:relative}.o-table.o-table-fixed{display:flex}.o-table.o-table-fixed .o-table-container{display:flex;flex-direction:column}.o-table.o-table-fixed .o-table-body{display:flex;flex:1}.o-table.o-table-fixed .o-table-body .o-table-overflow{flex:1;overflow-y:auto}.mat-tooltip.o-table-cell-tooltip{word-wrap:break-word;max-height:64px;overflow:hidden;min-width:140px}"]
                }] }
    ];
    OTableComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: MatDialog },
        { type: ViewContainerRef },
        { type: ApplicationRef },
        { type: ComponentFactoryResolver },
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] }
    ]; };
    OTableComponent.propDecorators = {
        matpaginator: [{ type: ViewChild, args: [MatPaginator, { static: false },] }],
        sort: [{ type: ViewChild, args: [OMatSort, { static: true },] }],
        sortHeaders: [{ type: ViewChildren, args: [OMatSortHeader,] }],
        spinnerContainer: [{ type: ViewChild, args: ['spinnerContainer', { read: ElementRef, static: false },] }],
        tableRowExpandable: [{ type: ContentChild, args: [OTableRowExpandableComponent, { static: false },] }],
        tableBodyEl: [{ type: ViewChild, args: ['tableBody', { static: false },] }],
        tableHeaderEl: [{ type: ViewChild, args: ['tableHeader', { read: ElementRef, static: false },] }],
        tableToolbarEl: [{ type: ViewChild, args: ['tableToolbar', { read: ElementRef, static: false },] }],
        oTableMenu: [{ type: ViewChild, args: ['tableMenu', { static: false },] }],
        tableOptions: [{ type: ContentChildren, args: [OTableOptionComponent,] }],
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
    ], OTableComponent.prototype, "filterColumnActiveByDefault", null);
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
        tslib_1.__metadata("design:type", Boolean),
        tslib_1.__metadata("design:paramtypes", [Boolean])
    ], OTableComponent.prototype, "horizontalScroll", null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFtQixjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RFLE9BQU8sRUFFTCxjQUFjLEVBQ2QsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixpQkFBaUIsRUFFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFxQixTQUFTLEVBQVcsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUN4SCxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNwRixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBV3BGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMs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QUFFOztvRUFDdUI7SUFFeEM7UUFEQyxjQUFjLEVBQUU7OzZEQUNnQjtJQUVqQztRQURDLGNBQWMsRUFBRTs7NERBQ2U7SUFLaEM7UUFEQyxjQUFjLEVBQUU7OztzRUFLaEI7SUE0QkQ7UUFEQyxjQUFjLEVBQUU7Ozs4REFNaEI7SUFLRDtRQURDLGNBQWMsRUFBRTs7eURBQ1k7SUFFN0I7UUFEQyxjQUFjLEVBQUU7OzBEQUNhO0lBRTlCO1FBREMsY0FBYyxFQUFFOzt5REFDWTtJQUU3QjtRQURDLGNBQWMsRUFBRTs7K0RBQ2tCO0lBRW5DO1FBREMsY0FBYyxFQUFFOzt3REFDWTtJQUU3QjtRQURDLGNBQWMsRUFBRTs7c0RBQ1U7SUFNM0I7UUFEQyxjQUFjLEVBQUU7OzsyREFLaEI7SUFPRDtRQURDLGNBQWMsRUFBRTs7MEVBQzZCO0lBRTlDO1FBREMsY0FBYyxFQUFFOzs0REFDZ0I7SUFFakM7UUFEQyxjQUFjLEVBQUU7O3lEQUNZO0lBRTdCO1FBREMsY0FBYyxFQUFFOztzREFDUztJQUUxQjtRQURDLGNBQWMsRUFBRTs7c0RBQ1M7SUFFMUI7UUFEQyxjQUFjLEVBQUU7O3VEQUNXO0lBc0I1QjtRQURDLGNBQWMsRUFBRTs7OERBQ2lCO0lBOG1FcEMsc0JBQUM7Q0FBQSxBQXJ5RUQsQ0EyQnFDLGlCQUFpQixHQTB3RXJEO1NBMXdFWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYW5pbWF0ZSwgc3RhdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBTZWxlY3Rpb25DaGFuZ2UsIFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7IERvbVBvcnRhbE91dGxldCwgVGVtcGxhdGVQb3J0YWwgfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIEFwcGxpY2F0aW9uUmVmLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbnRlbnRDaGlsZCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIFZpZXdSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRDaGVja2JveENoYW5nZSwgTWF0RGlhbG9nLCBNYXRNZW51LCBNYXRQYWdpbmF0b3IsIE1hdFRhYiwgTWF0VGFiR3JvdXAsIFBhZ2VFdmVudCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgb2YsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBCb29sZWFuQ29udmVydGVyLCBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IFNlcnZpY2VSZXNwb25zZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgSU9Db250ZXh0TWVudUNvbnRleHQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tY29udGV4dC1tZW51LmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVCdXR0b24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtYnV0dG9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVCdXR0b25zIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWJ1dHRvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZURhdGFTb3VyY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtZGF0YXNvdXJjZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlTWVudSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1tZW51LmludGVyZmFjZSc7XG5pbXBvcnQgeyBPbkNsaWNrVGFibGVFdmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1vbmNsaWNrLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZVBhZ2luYXRvciB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1wYWdpbmF0b3IuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZVF1aWNrZmlsdGVyIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLXF1aWNrZmlsdGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBTbmFja0JhclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zbmFja2Jhci5zZXJ2aWNlJztcbmltcG9ydCB7IFRhYmxlRmlsdGVyQnlDb2x1bW5EaWFsb2dSZXN1bHQgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IE9Db2x1bW5BZ2dyZWdhdGUgfSBmcm9tICcuLi8uLi90eXBlcy9vLWNvbHVtbi1hZ2dyZWdhdGUudHlwZSc7XG5pbXBvcnQgeyBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLCBPQ29sdW1uVmFsdWVGaWx0ZXIgfSBmcm9tICcuLi8uLi90eXBlcy9vLWNvbHVtbi12YWx1ZS1maWx0ZXIudHlwZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlSW5pdGlhbGl6YXRpb25PcHRpb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby10YWJsZS1pbml0aWFsaXphdGlvbi1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlTWVudVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby10YWJsZS1tZW51LXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXRhYmxlLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgT1F1ZXJ5RGF0YUFyZ3MgfSBmcm9tICcuLi8uLi90eXBlcy9xdWVyeS1kYXRhLWFyZ3MudHlwZSc7XG5pbXBvcnQgeyBRdWlja0ZpbHRlckZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vdHlwZXMvcXVpY2stZmlsdGVyLWZ1bmN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgU1FMT3JkZXIgfSBmcm9tICcuLi8uLi90eXBlcy9zcWwtb3JkZXIudHlwZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IEZpbHRlckV4cHJlc3Npb25VdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvZmlsdGVyLWV4cHJlc3Npb24udXRpbHMnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db250ZXh0TWVudUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQ09NUE9ORU5ULCBPU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL28tc2VydmljZS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uL2NhbGN1bGF0ZWQvby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbHVtbiB9IGZyb20gJy4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uL28tdGFibGUtY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEZWZhdWx0T1RhYmxlT3B0aW9ucyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9kZWZhdWx0LW8tdGFibGUtb3B0aW9ucy5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvZGlhbG9nL2ZpbHRlci1ieS1jb2x1bW4vby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQmFzZVRhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi9leHRlbnNpb25zL2Zvb3Rlci9wYWdpbmF0b3Ivby1iYXNlLXRhYmxlLXBhZ2luYXRvci5jbGFzcyc7XG5pbXBvcnQgeyBPRmlsdGVyQ29sdW1uIH0gZnJvbSAnLi9leHRlbnNpb25zL2hlYWRlci90YWJsZS1jb2x1bW5zLWZpbHRlci9jb2x1bW5zL28tdGFibGUtY29sdW1ucy1maWx0ZXItY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9leHRlbnNpb25zL2hlYWRlci90YWJsZS1jb2x1bW5zLWZpbHRlci9vLXRhYmxlLWNvbHVtbnMtZmlsdGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50IH0gZnJvbSAnLi9leHRlbnNpb25zL2hlYWRlci90YWJsZS1pbnNlcnRhYmxlLXJvdy9vLXRhYmxlLWluc2VydGFibGUtcm93LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVPcHRpb25Db21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLW9wdGlvbi9vLXRhYmxlLW9wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRGF0YVNvdXJjZVNlcnZpY2UgfSBmcm9tICcuL2V4dGVuc2lvbnMvby10YWJsZS1kYXRhc291cmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RhYmxlU3RvcmFnZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9vLXRhYmxlLXN0b3JhZ2UuY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlRGFvIH0gZnJvbSAnLi9leHRlbnNpb25zL28tdGFibGUuZGFvJztcbmltcG9ydCB7IE9UYWJsZVJvd0V4cGFuZGFibGVDb21wb25lbnQsIE9UYWJsZVJvd0V4cGFuZGVkQ2hhbmdlIH0gZnJvbSAnLi9leHRlbnNpb25zL3Jvdy90YWJsZS1yb3ctZXhwYW5kYWJsZS9vLXRhYmxlLXJvdy1leHBhbmRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPTWF0U29ydCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQnO1xuaW1wb3J0IHsgT01hdFNvcnRIZWFkZXIgfSBmcm9tICcuL2V4dGVuc2lvbnMvc29ydC9vLW1hdC1zb3J0LWhlYWRlcic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQ09NUE9ORU5ULFxuXG4gIC8vIHZpc2libGUtY29sdW1ucyBbc3RyaW5nXTogdmlzaWJsZSBjb2x1bW5zLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3Zpc2libGVDb2x1bW5zOiB2aXNpYmxlLWNvbHVtbnMnLFxuXG4gIC8vIGVkaXRhYmxlLWNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgdGhhdCBjYW4gYmUgZWRpdGVkIGRpcmVjdGx5IG92ZXIgdGhlIHRhYmxlLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgLy8gJ2VkaXRhYmxlQ29sdW1uczogZWRpdGFibGUtY29sdW1ucycsXG5cbiAgLy8gc29ydC1jb2x1bW5zIFtzdHJpbmddOiBpbml0aWFsIHNvcnRpbmcsIHdpdGggdGhlIGZvcm1hdCBjb2x1bW46W0FTQ3xERVNDXSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzb3J0Q29sdW1uczogc29ydC1jb2x1bW5zJyxcblxuICAncXVpY2tGaWx0ZXJDYWxsYmFjazogcXVpY2stZmlsdGVyLWZ1bmN0aW9uJyxcblxuICAvLyBkZWxldGUtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGRlbGV0ZSBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2RlbGV0ZUJ1dHRvbjogZGVsZXRlLWJ1dHRvbicsXG5cbiAgLy8gcmVmcmVzaC1idXR0b24gW25vfHllc106IHNob3cgcmVmcmVzaCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ3JlZnJlc2hCdXR0b246IHJlZnJlc2gtYnV0dG9uJyxcblxuICAvLyBjb2x1bW5zLXZpc2liaWxpdHktYnV0dG9uIFtub3x5ZXNdOiBzaG93IGNvbHVtbnMgdmlzaWJpbGl0eSBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2NvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBjb2x1bW5zLXZpc2liaWxpdHktYnV0dG9uJyxcblxuICAvLyAvLyBjb2x1bW5zLXJlc2l6ZS1idXR0b24gW25vfHllc106IHNob3cgY29sdW1ucyByZXNpemUgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gIC8vICdjb2x1bW5zUmVzaXplQnV0dG9uOiBjb2x1bW5zLXJlc2l6ZS1idXR0b24nLFxuXG4gIC8vIC8vIGNvbHVtbnMtZ3JvdXAtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGNvbHVtbnMgZ3JvdXAgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gIC8vICdjb2x1bW5zR3JvdXBCdXR0b246IGNvbHVtbnMtZ3JvdXAtYnV0dG9uJyxcblxuICAvLyBleHBvcnQtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGV4cG9ydCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2V4cG9ydEJ1dHRvbjogZXhwb3J0LWJ1dHRvbicsXG5cbiAgLy8gc2hvdy1jb25maWd1cmF0aW9uLW9wdGlvbiBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IGNvbmZpZ3VyYXRpb24gYnV0dG9uIGluIGhlYWRlci4gRGVmYXVsdDogeWVzLlxuICAnc2hvd0NvbmZpZ3VyYXRpb25PcHRpb246IHNob3ctY29uZmlndXJhdGlvbi1vcHRpb24nLFxuXG4gIC8vIHNob3ctYnV0dG9ucy10ZXh0IFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgdGV4dCBvZiBoZWFkZXIgYnV0dG9ucy4gRGVmYXVsdDogeWVzLlxuICAnc2hvd0J1dHRvbnNUZXh0OiBzaG93LWJ1dHRvbnMtdGV4dCcsXG5cbiAgLy8gc2VsZWN0LWFsbC1jaGVja2JveCBbeWVzfG5vfHRydWV8ZmFsc2VdOiAgc2hvdyBpbiB0aGUgbWVudSB0aGUgb3B0aW9uIG9mIHNlbGVjdGlvbiBjaGVjayBib3hlcyAuIERlZmF1bHQ6IG5vLlxuICAnc2VsZWN0QWxsQ2hlY2tib3g6IHNlbGVjdC1hbGwtY2hlY2tib3gnLFxuXG4gIC8vIHBhZ2luYXRpb24tY29udHJvbHMgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBwYWdpbmF0aW9uIGNvbnRyb2xzLiBEZWZhdWx0OiB5ZXMuXG4gICdwYWdpbmF0aW9uQ29udHJvbHM6IHBhZ2luYXRpb24tY29udHJvbHMnLFxuXG4gIC8vIGZpeC1oZWFkZXIgW3llc3xub3x0cnVlfGZhbHNlXTogZml4ZWQgaGVhZGVyIGFuZCBmb290ZXIgd2hlbiB0aGUgY29udGVudCBpcyBncmVhdGhlciB0aGFuIGl0cyBvd24gaGVpZ2h0LiBEZWZhdWx0OiBuby5cbiAgJ2ZpeGVkSGVhZGVyOiBmaXhlZC1oZWFkZXInLFxuXG4gIC8vIHNob3ctdGl0bGUgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyB0aGUgdGFibGUgdGl0bGUuIERlZmF1bHQ6IG5vLlxuICAnc2hvd1RpdGxlOiBzaG93LXRpdGxlJyxcblxuICAvLyBlZGl0aW9uLW1vZGUgW25vbmUgfCBpbmxpbmUgfCBjbGljayB8IGRibGNsaWNrXTogZWRpdGlvbiBtb2RlLiBEZWZhdWx0IG5vbmVcbiAgJ2VkaXRpb25Nb2RlOiBlZGl0aW9uLW1vZGUnLFxuXG4gIC8vIHNlbGVjdGlvbi1tb2RlIFtub25lIHwgc2ltcGxlIHwgbXVsdGlwbGUgXTogc2VsZWN0aW9uIG1vZGUuIERlZmF1bHQgbXVsdGlwbGVcbiAgJ3NlbGVjdGlvbk1vZGU6IHNlbGVjdGlvbi1tb2RlJyxcblxuICAnaG9yaXpvbnRhbFNjcm9sbDogaG9yaXpvbnRhbC1zY3JvbGwnLFxuXG4gICdzaG93UGFnaW5hdG9yRmlyc3RMYXN0QnV0dG9uczogc2hvdy1wYWdpbmF0b3ItZmlyc3QtbGFzdC1idXR0b25zJyxcblxuICAnYXV0b0FsaWduVGl0bGVzOiBhdXRvLWFsaWduLXRpdGxlcycsXG5cbiAgJ211bHRpcGxlU29ydDogbXVsdGlwbGUtc29ydCcsXG4gIC8vIHNlbGVjdC1hbGwtY2hlY2tib3gtdmlzaWJsZSBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHNlbGVjdGlvbiBjaGVjayBib3hlcy5EZWZhdWx0OiBuby5cbiAgJ3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTogc2VsZWN0LWFsbC1jaGVja2JveC12aXNpYmxlJyxcblxuICAnb3JkZXJhYmxlJyxcblxuICAncmVzaXphYmxlJyxcblxuICAvLyBlbmFibGVkIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IGVuYWJsZXMgZGUgdGFibGUuIERlZmF1bHQ6IHllc1xuICAnZW5hYmxlZCcsXG5cbiAgJ2tlZXBTZWxlY3RlZEl0ZW1zOiBrZWVwLXNlbGVjdGVkLWl0ZW1zJyxcblxuICAvLyBleHBvcnQtbW9kZSBbJ3Zpc2libGUnfCdsb2NhbCd8J2FsbCddOiBzZXRzIHRoZSBtb2RlIHRvIGV4cG9ydCBkYXRhLiBEZWZhdWx0OiAndmlzaWJsZSdcbiAgJ2V4cG9ydE1vZGU6IGV4cG9ydC1tb2RlJyxcblxuICAvLyBleHBvcnRTZXJ2aWNlVHlwZSBbIHN0cmluZyBdOiBUaGUgc2VydmljZSB1c2VkIGJ5IHRoZSB0YWJsZSBmb3IgZXhwb3J0aW5nIGl0J3MgZGF0YSwgaXQgbXVzdCBpbXBsZW1lbnQgJ0lFeHBvcnRTZXJ2aWNlJyBpbnRlcmZhY2UuIERlZmF1bHQ6ICdPbnRpbWl6ZUV4cG9ydFNlcnZpY2UnXG4gICdleHBvcnRTZXJ2aWNlVHlwZTogZXhwb3J0LXNlcnZpY2UtdHlwZScsXG5cbiAgLy8gYXV0by1hZGp1c3QgW3RydWV8ZmFsc2VdOiBBdXRvIGFkanVzdCBjb2x1bW4gd2lkdGggdG8gZml0IGl0cyBjb250ZW50LiBEZWZhdWx0OiBmYWxzZVxuICAnYXV0b0FkanVzdDogYXV0by1hZGp1c3QnLFxuXG4gIC8vIHNob3ctZmlsdGVyLW9wdGlvbiBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IGZpbHRlciBtZW51IG9wdGlvbiBpbiB0aGUgaGVhZGVyIG1lbnUuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dGaWx0ZXJPcHRpb246IHNob3ctZmlsdGVyLW9wdGlvbicsXG5cbiAgLy8gdmlzaWJsZS1leHBvcnQtZGlhbG9nLWJ1dHRvbnMgW3N0cmluZ106IHZpc2libGUgYnV0dG9ucyBpbiBleHBvcnQgZGlhbG9nLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0L25vIGNvbmZpZ3VyZWQ6IHNob3cgYWxsLiBFbXB0eSB2YWx1ZTogaGlkZSBhbGwuXG4gICd2aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9uczogdmlzaWJsZS1leHBvcnQtZGlhbG9nLWJ1dHRvbnMnLFxuXG4gIC8vIHJvdy1jbGFzcyBbZnVuY3Rpb24sIChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHN0cmluZ1tdXTogYWRkcyB0aGUgY2xhc3Mgb3IgY2xhc3NlcyByZXR1cm5lZCBieSB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gdG8gdGhlIHRhYmxlIHJvd3MuXG4gICdyb3dDbGFzczogcm93LWNsYXNzJyxcblxuICAvLyBmaWx0ZXItY29sdW1uLWFjdGl2ZS1ieS1kZWZhdWx0IFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgaWNvbiBmaWx0ZXIgYnkgZGVmYXVsdCBpbiB0aGUgdGFibGVcbiAgJ2ZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdDpmaWx0ZXItY29sdW1uLWFjdGl2ZS1ieS1kZWZhdWx0J1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFID0gW1xuICAnb25DbGljaycsXG4gICdvbkRvdWJsZUNsaWNrJyxcbiAgJ29uUm93U2VsZWN0ZWQnLFxuICAnb25Sb3dEZXNlbGVjdGVkJyxcbiAgJ29uUm93RGVsZXRlZCcsXG4gICdvbkRhdGFMb2FkZWQnLFxuICAnb25QYWdpbmF0ZWREYXRhTG9hZGVkJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlcixcbiAgICBPVGFibGVEYXRhU291cmNlU2VydmljZVxuICBdLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignZGV0YWlsRXhwYW5kJywgW1xuICAgICAgc3RhdGUoJ2NvbGxhcHNlZCcsIHN0eWxlKHsgaGVpZ2h0OiAnMHB4JywgbWluSGVpZ2h0OiAnMCcgfSkpLFxuICAgICAgc3RhdGUoJ2V4cGFuZGVkJywgc3R5bGUoeyBoZWlnaHQ6ICcqJyB9KSksXG4gICAgICB0cmFuc2l0aW9uKCdleHBhbmRlZCA8PT4gY29sbGFwc2VkJywgYW5pbWF0ZSgnMjI1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJykpLFxuICAgIF0pXG4gIF0sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEUsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm9udGltaXplLXRhYmxlXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm8tdGFibGUtZml4ZWRdJzogJ2ZpeGVkSGVhZGVyJyxcbiAgICAnW2NsYXNzLm8tdGFibGUtZGlzYWJsZWRdJzogJyFlbmFibGVkJyxcbiAgICAnKGRvY3VtZW50OmNsaWNrKSc6ICdoYW5kbGVET01DbGljaygkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNvbXBvbmVudCBleHRlbmRzIE9TZXJ2aWNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9CQVNFX1NJWkVfU1BJTk5FUiA9IDEwMDtcbiAgcHVibGljIHN0YXRpYyBGSVJTVF9MQVNUX0NFTExfUEFERElORyA9IDI0O1xuICBwdWJsaWMgc3RhdGljIEVYUEFOREVEX1JPV19DT05UQUlORVJfQ0xBU1MgPSAnZXhwYW5kZWQtcm93LWNvbnRhaW5lci0nO1xuXG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcblxuICBwdWJsaWMgcGFnaW5hdG9yOiBPVGFibGVQYWdpbmF0b3I7XG4gIEBWaWV3Q2hpbGQoTWF0UGFnaW5hdG9yLCB7IHN0YXRpYzogZmFsc2UgfSkgbWF0cGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XG4gIEBWaWV3Q2hpbGQoT01hdFNvcnQsIHsgc3RhdGljOiB0cnVlIH0pIHNvcnQ6IE9NYXRTb3J0O1xuXG4gIC8vIG9ubHkgZm9yIGluc2lkZVRhYkJ1Z1dvcmthcm91bmRcbiAgQFZpZXdDaGlsZHJlbihPTWF0U29ydEhlYWRlcikgcHJvdGVjdGVkIHNvcnRIZWFkZXJzOiBRdWVyeUxpc3Q8T01hdFNvcnRIZWFkZXI+O1xuXG4gIEBWaWV3Q2hpbGQoJ3NwaW5uZXJDb250YWluZXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgc3Bpbm5lckNvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICBAQ29udGVudENoaWxkKE9UYWJsZVJvd0V4cGFuZGFibGVDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KVxuICB0YWJsZVJvd0V4cGFuZGFibGU6IE9UYWJsZVJvd0V4cGFuZGFibGVDb21wb25lbnQ7XG5cbiAgX2ZpbHRlckNvbHVtbnM6IEFycmF5PE9GaWx0ZXJDb2x1bW4+O1xuICBwb3J0YWxIb3N0OiBEb21Qb3J0YWxPdXRsZXQ7XG5cbiAgZ2V0IGRpYW1ldGVyU3Bpbm5lcigpIHtcbiAgICBjb25zdCBtaW5IZWlnaHQgPSBPVGFibGVDb21wb25lbnQuREVGQVVMVF9CQVNFX1NJWkVfU1BJTk5FUjtcbiAgICBsZXQgaGVpZ2h0ID0gMDtcbiAgICBpZiAodGhpcy5zcGlubmVyQ29udGFpbmVyICYmIHRoaXMuc3Bpbm5lckNvbnRhaW5lci5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLnNwaW5uZXJDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuICAgIGlmIChoZWlnaHQgPiAwICYmIGhlaWdodCA8PSAxMDApIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKGhlaWdodCAtIChoZWlnaHQgKiAwLjEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG1pbkhlaWdodDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdGFibGVDb250ZXh0TWVudTogT0NvbnRleHRNZW51Q29tcG9uZW50O1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNlbGVjdEFsbENoZWNrYm94OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGV4cG9ydEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dDb25maWd1cmF0aW9uT3B0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgY29sdW1uc1Zpc2liaWxpdHlCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93RmlsdGVyT3B0aW9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0J1dHRvbnNUZXh0OiBib29sZWFuID0gdHJ1ZTtcblxuXG4gIG9yaWdpbmFsRmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNldCBmaWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCByZXN1bHQgPSBCb29sZWFuQ29udmVydGVyKHZhbHVlKTtcbiAgICB0aGlzLm9yaWdpbmFsRmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0ID0gcmVzdWx0O1xuICAgIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9IHJlc3VsdDtcbiAgfVxuXG4gIGdldCBmaWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbjtcbiAgfVxuXG4gIHByb3RlY3RlZCBfb1RhYmxlT3B0aW9uczogT1RhYmxlT3B0aW9ucztcblxuICBnZXQgb1RhYmxlT3B0aW9ucygpOiBPVGFibGVPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy5fb1RhYmxlT3B0aW9ucztcbiAgfVxuXG4gIHNldCBvVGFibGVPcHRpb25zKHZhbHVlOiBPVGFibGVPcHRpb25zKSB7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucyA9IHZhbHVlO1xuICB9XG5cbiAgc2V0IHF1aWNrRmlsdGVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdmFsdWUgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsdWUpKTtcbiAgICB0aGlzLl9xdWlja0ZpbHRlciA9IHZhbHVlO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuZmlsdGVyID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcXVpY2tGaWx0ZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3F1aWNrRmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZpbHRlckNhc2VTZW5zaXRpdmVQdnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2V0IGZpbHRlckNhc2VTZW5zaXRpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQgPSBCb29sZWFuQ29udmVydGVyKHZhbHVlKTtcbiAgICBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucykge1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5maWx0ZXJDYXNlU2Vuc2l0aXZlID0gdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlUHZ0O1xuICAgIH1cbiAgfVxuICBnZXQgZmlsdGVyQ2FzZVNlbnNpdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlUHZ0O1xuICB9XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGluc2VydEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHJlZnJlc2hCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBkZWxldGVCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwYWdpbmF0aW9uQ29udHJvbHM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBmaXhlZEhlYWRlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93VGl0bGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZWRpdGlvbk1vZGU6IHN0cmluZyA9IENvZGVzLkRFVEFJTF9NT0RFX05PTkU7XG4gIHNlbGVjdGlvbk1vZGU6IHN0cmluZyA9IENvZGVzLlNFTEVDVElPTl9NT0RFX01VTFRJUExFO1xuXG4gIHByb3RlY3RlZCBfaG9yaXpvbnRhbFNjcm9sbCA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZXQgaG9yaXpvbnRhbFNjcm9sbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2hvcml6b250YWxTY3JvbGwgPSBCb29sZWFuQ29udmVydGVyKHZhbHVlKTtcbiAgICB0aGlzLnJlZnJlc2hDb2x1bW5zV2lkdGgoKTtcblxuICB9XG5cbiAgZ2V0IGhvcml6b250YWxTY3JvbGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hvcml6b250YWxTY3JvbGw7XG4gIH1cblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93UGFnaW5hdG9yRmlyc3RMYXN0QnV0dG9uczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGF1dG9BbGlnblRpdGxlczogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtdWx0aXBsZVNvcnQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBvcmRlcmFibGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICByZXNpemFibGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBhdXRvQWRqdXN0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XG4gIH1cbiAgc2V0IGVuYWJsZWQodmFsOiBib29sZWFuKSB7XG4gICAgdmFsID0gVXRpbC5wYXJzZUJvb2xlYW4oU3RyaW5nKHZhbCkpO1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWw7XG4gIH1cbiAgcHJvdGVjdGVkIF9zZWxlY3RBbGxDaGVja2JveFZpc2libGU6IGJvb2xlYW47XG4gIHNldCBzZWxlY3RBbGxDaGVja2JveFZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zZWxlY3RBbGxDaGVja2JveFZpc2libGUgPSBCb29sZWFuQ29udmVydGVyKHRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddKSB8fCBCb29sZWFuQ29udmVydGVyKHZhbHVlKTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gdGhpcy5fc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUNoZWNrYm94Q29sdW1uKCk7XG4gIH1cblxuICBnZXQgc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RBbGxDaGVja2JveFZpc2libGU7XG4gIH1cblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBrZWVwU2VsZWN0ZWRJdGVtczogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHVibGljIGV4cG9ydE1vZGU6IHN0cmluZyA9IENvZGVzLkVYUE9SVF9NT0RFX1ZJU0lCTEU7XG4gIHB1YmxpYyBleHBvcnRTZXJ2aWNlVHlwZTogc3RyaW5nO1xuICBwdWJsaWMgdmlzaWJsZUV4cG9ydERpYWxvZ0J1dHRvbnM6IHN0cmluZztcbiAgcHVibGljIGRhb1RhYmxlOiBPVGFibGVEYW8gfCBudWxsO1xuICBwdWJsaWMgZGF0YVNvdXJjZTogT1RhYmxlRGF0YVNvdXJjZSB8IG51bGw7XG4gIHB1YmxpYyB2aXNpYmxlQ29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgc29ydENvbHVtbnM6IHN0cmluZztcbiAgcHVibGljIHJvd0NsYXNzOiAocm93RGF0YTogYW55LCByb3dJbmRleDogbnVtYmVyKSA9PiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKnBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG4gIHByb3RlY3RlZCBfdmlzaWJsZUNvbEFycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgZ2V0IHZpc2libGVDb2xBcnJheSgpOiBBcnJheTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUNvbEFycmF5O1xuICB9XG5cbiAgc2V0IHZpc2libGVDb2xBcnJheShhcmc6IEFycmF5PGFueT4pIHtcbiAgICBjb25zdCBwZXJtaXNzaW9uc0Jsb2NrZWQgPSB0aGlzLnBlcm1pc3Npb25zID8gdGhpcy5wZXJtaXNzaW9ucy5jb2x1bW5zLmZpbHRlcihjb2wgPT4gY29sLnZpc2libGUgPT09IGZhbHNlKS5tYXAoY29sID0+IGNvbC5hdHRyKSA6IFtdO1xuICAgIGNvbnN0IHBlcm1pc3Npb25zQ2hlY2tlZCA9IGFyZy5maWx0ZXIodmFsdWUgPT4gcGVybWlzc2lvbnNCbG9ja2VkLmluZGV4T2YodmFsdWUpID09PSAtMSk7XG4gICAgdGhpcy5fdmlzaWJsZUNvbEFycmF5ID0gcGVybWlzc2lvbnNDaGVja2VkO1xuICAgIGlmICh0aGlzLl9vVGFibGVPcHRpb25zKSB7XG4gICAgICBjb25zdCBjb250YWluc1NlbGVjdGlvbkNvbCA9IHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuaW5kZXhPZihDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpICE9PSAtMTtcbiAgICAgIGNvbnN0IGNvbnRhaW5zRXhwYW5kYWJsZUNvbCA9IHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuaW5kZXhPZihDb2Rlcy5OQU1FX0NPTFVNTl9FWFBBTkRBQkxFKSAhPT0gLTE7XG4gICAgICBpZiAoY29udGFpbnNTZWxlY3Rpb25Db2wpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZUNvbEFycmF5LnVuc2hpZnQoQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250YWluc1NlbGVjdGlvbkNvbCAmJiBjb250YWluc0V4cGFuZGFibGVDb2wpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZUNvbEFycmF5ID0gW3RoaXMuX3Zpc2libGVDb2xBcnJheVswXV0uY29uY2F0KENvZGVzLk5BTUVfQ09MVU1OX0VYUEFOREFCTEUsIHRoaXMuX3Zpc2libGVDb2xBcnJheS5zcGxpY2UoMSkpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoY29udGFpbnNFeHBhbmRhYmxlQ29sKSB7XG4gICAgICAgICAgdGhpcy5fdmlzaWJsZUNvbEFycmF5LnVuc2hpZnQoQ29kZXMuTkFNRV9DT0xVTU5fRVhQQU5EQUJMRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMgPSB0aGlzLl92aXNpYmxlQ29sQXJyYXk7XG4gICAgfVxuICB9XG5cbiAgc29ydENvbEFycmF5OiBBcnJheTxTUUxPcmRlcj4gPSBbXTtcbiAgLyplbmQgb2YgcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICBwcm90ZWN0ZWQgdGFiR3JvdXBDb250YWluZXI6IE1hdFRhYkdyb3VwO1xuICBwcm90ZWN0ZWQgdGFiQ29udGFpbmVyOiBNYXRUYWI7XG4gIHRhYkdyb3VwQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJvdGVjdGVkIHBlbmRpbmdRdWVyeTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgcGVuZGluZ1F1ZXJ5RmlsdGVyID0gdW5kZWZpbmVkO1xuXG4gIHByb3RlY3RlZCBzZXRTdGF0aWNEYXRhOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBhdm9pZFF1ZXJ5Q29sdW1uczogQXJyYXk8YW55PiA9IFtdO1xuICBwcm90ZWN0ZWQgYXN5bmNMb2FkQ29sdW1uczogQXJyYXk8YW55PiA9IFtdO1xuICBwcm90ZWN0ZWQgYXN5bmNMb2FkU3Vic2NyaXB0aW9uczogb2JqZWN0ID0ge307XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBjb250ZXh0TWVudVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgZmluaXNoUXVlcnlTdWJzY3JpcHRpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgb25DbGljazogRXZlbnRFbWl0dGVyPE9uQ2xpY2tUYWJsZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRG91YmxlQ2xpY2s6IEV2ZW50RW1pdHRlcjxPbkNsaWNrVGFibGVFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJvd1NlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUm93RGVzZWxlY3RlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJvd0RlbGV0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUGFnaW5hdGVkRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJlaW5pdGlhbGl6ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkNvbnRlbnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25WaXNpYmxlQ29sdW1uc0NoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkZpbHRlckJ5Q29sdW1uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcm90ZWN0ZWQgc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHVibGljIG9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudDogT1RhYmxlRmlsdGVyQnlDb2x1bW5EYXRhRGlhbG9nQ29tcG9uZW50O1xuICBwdWJsaWMgb1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudDogT1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudDtcbiAgcHVibGljIHNob3dGaWx0ZXJCeUNvbHVtbkljb246IGJvb2xlYW4gPSBmYWxzZTtcblxuXG4gIHByaXZhdGUgc2hvd1RvdGFsc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIHNob3dUb3RhbHM6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLnNob3dUb3RhbHNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBwcml2YXRlIGxvYWRpbmdTb3J0aW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwcm90ZWN0ZWQgbG9hZGluZ1NvcnRpbmc6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTb3J0aW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgcHJpdmF0ZSBsb2FkaW5nU2Nyb2xsU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwdWJsaWMgbG9hZGluZ1Njcm9sbDogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMubG9hZGluZ1Njcm9sbFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHVibGljIG9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQ6IE9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQ7XG4gIHB1YmxpYyBzaG93Rmlyc3RJbnNlcnRhYmxlUm93OiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBzaG93TGFzdEluc2VydGFibGVSb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGV4cGFuZGFibGVJdGVtID0gbmV3IFNlbGVjdGlvbk1vZGVsPEVsZW1lbnQ+KGZhbHNlLCBbXSk7XG5cbiAgcHJvdGVjdGVkIGNsaWNrVGltZXI7XG4gIHByb3RlY3RlZCBjbGlja0RlbGF5ID0gMjAwO1xuICBwcm90ZWN0ZWQgY2xpY2tQcmV2ZW50ID0gZmFsc2U7XG4gIHByb3RlY3RlZCBlZGl0aW5nQ2VsbDogYW55O1xuICBwcm90ZWN0ZWQgZWRpdGluZ1JvdzogYW55O1xuXG4gIHByb3RlY3RlZCBfY3VycmVudFBhZ2U6IG51bWJlciA9IDA7XG5cbiAgc2V0IGN1cnJlbnRQYWdlKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSB2YWw7XG4gICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggPSB2YWw7XG4gICAgICBpZiAodGhpcy5tYXRwYWdpbmF0b3IpIHtcbiAgICAgICAgdGhpcy5tYXRwYWdpbmF0b3IucGFnZUluZGV4ID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBjdXJyZW50UGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UGFnZTtcbiAgfVxuXG4gIHB1YmxpYyBvVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudDogT1RhYmxlUXVpY2tmaWx0ZXI7XG4gIHByb3RlY3RlZCBzb3J0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBvblJlbmRlcmVkRGF0YUNoYW5nZTogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgcHJldmlvdXNSZW5kZXJlckRhdGE7XG5cbiAgcXVpY2tGaWx0ZXJDYWxsYmFjazogUXVpY2tGaWx0ZXJGdW5jdGlvbjtcblxuICBAVmlld0NoaWxkKCd0YWJsZUJvZHknLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIHRhYmxlQm9keUVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZUhlYWRlcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICB0YWJsZUhlYWRlckVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZVRvb2xiYXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgdGFibGVUb29sYmFyRWw6IEVsZW1lbnRSZWY7XG5cbiAgaG9yaXpvbnRhbFNjcm9sbGVkOiBib29sZWFuO1xuICBwdWJsaWMgb25VcGRhdGVTY3JvbGxlZFN0YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIHJvd1dpZHRoO1xuXG4gIG9UYWJsZVN0b3JhZ2U6IE9UYWJsZVN0b3JhZ2U7XG4gIHN0b3JlUGFnaW5hdGlvblN0YXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyogSW4gdGhlIGNhc2UgdGhlIHRhYmxlIGhhdmVudCBwYWdpbmF0aW9uQ29udHJvbCBhbmQgcGFnZWFibGUsIHRoZSB0YWJsZSBoYXMgcGFnaW5hdGlvbiB2aXJ0dWFsKi9cbiAgcGFnZVNjcm9sbFZpcnR1YWwgPSAxO1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1RhYmxlUGVybWlzc2lvbnM7XG4gIG1hdE1lbnU6IE1hdE1lbnU7XG5cbiAgQFZpZXdDaGlsZCgndGFibGVNZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIG9UYWJsZU1lbnU6IE9UYWJsZU1lbnU7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihPVGFibGVPcHRpb25Db21wb25lbnQpXG4gIHRhYmxlT3B0aW9uczogUXVlcnlMaXN0PE9UYWJsZU9wdGlvbkNvbXBvbmVudD47XG5cbiAgb1RhYmxlQnV0dG9uczogT1RhYmxlQnV0dG9ucztcblxuICBAQ29udGVudENoaWxkcmVuKCdvLXRhYmxlLWJ1dHRvbicpXG4gIHRhYmxlQnV0dG9uczogUXVlcnlMaXN0PE9UYWJsZUJ1dHRvbj47XG5cbiAgQENvbnRlbnRDaGlsZCgnby10YWJsZS1xdWlja2ZpbHRlcicsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHF1aWNrZmlsdGVyQ29udGVudENoaWxkOiBPVGFibGVRdWlja2ZpbHRlcjtcblxuICBAVmlld0NoaWxkKCdleHBvcnRPcHRzVGVtcGxhdGUnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgZXhwb3J0T3B0c1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnLCBbXSlcbiAgdXBkYXRlU2Nyb2xsZWRTdGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ob3Jpem9udGFsU2Nyb2xsKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgYm9keVdpZHRoID0gdGhpcy50YWJsZUJvZHlFbC5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICBjb25zdCBzY3JvbGxXaWR0aCA9IHRoaXMudGFibGVCb2R5RWwubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aDtcbiAgICAgICAgY29uc3QgcHJldmlvdXNTdGF0ZSA9IHRoaXMuaG9yaXpvbnRhbFNjcm9sbGVkO1xuICAgICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxlZCA9IHNjcm9sbFdpZHRoID4gYm9keVdpZHRoO1xuICAgICAgICBpZiAocHJldmlvdXNTdGF0ZSAhPT0gdGhpcy5ob3Jpem9udGFsU2Nyb2xsZWQpIHtcbiAgICAgICAgICB0aGlzLm9uVXBkYXRlU2Nyb2xsZWRTdGF0ZS5lbWl0KHRoaXMuaG9yaXpvbnRhbFNjcm9sbGVkKTtcbiAgICAgICAgfVxuICAgICAgfSwgMCk7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaENvbHVtbnNXaWR0aCgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBkaWFsb2c6IE1hdERpYWxvZyxcbiAgICBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudFxuICApIHtcbiAgICBzdXBlcihpbmplY3RvciwgZWxSZWYsIGZvcm0pO1xuXG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucyA9IG5ldyBEZWZhdWx0T1RhYmxlT3B0aW9ucygpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uID0gdGhpcy5jcmVhdGVPQ29sdW1uKCk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy50YWJHcm91cENvbnRhaW5lciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdFRhYkdyb3VwKTtcbiAgICAgIHRoaXMudGFiQ29udGFpbmVyID0gdGhpcy5pbmplY3Rvci5nZXQoTWF0VGFiKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gRG8gbm90aGluZyBkdWUgdG8gbm90IGFsd2F5cyBpcyBjb250YWluZWQgb24gdGFiLlxuICAgIH1cblxuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoU25hY2tCYXJTZXJ2aWNlKTtcbiAgICB0aGlzLm9UYWJsZVN0b3JhZ2UgPSBuZXcgT1RhYmxlU3RvcmFnZSh0aGlzKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIGlmICh0aGlzLm9UYWJsZUJ1dHRvbnMpIHtcbiAgICAgIHRoaXMub1RhYmxlQnV0dG9ucy5yZWdpc3RlckJ1dHRvbnModGhpcy50YWJsZUJ1dHRvbnMudG9BcnJheSgpKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5hZnRlclZpZXdJbml0KCk7XG4gICAgdGhpcy5pbml0VGFibGVBZnRlclZpZXdJbml0KCk7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5tYXRNZW51ID0gdGhpcy5vVGFibGVNZW51Lm1hdE1lbnU7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUucmVnaXN0ZXJPcHRpb25zKHRoaXMudGFibGVPcHRpb25zLnRvQXJyYXkoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRhYmxlUm93RXhwYW5kYWJsZSkge1xuICAgICAgdGhpcy5jcmVhdGVFeHBhbmRhYmxlQ29sdW1uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNyZWF0ZUV4cGFuZGFibGVDb2x1bW4oKSB7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5leHBhbmRhYmxlQ29sdW1uID0gbmV3IE9Db2x1bW4oKTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmV4cGFuZGFibGVDb2x1bW4udmlzaWJsZSA9IHRoaXMudGFibGVSb3dFeHBhbmRhYmxlICYmIHRoaXMudGFibGVSb3dFeHBhbmRhYmxlLmV4cGFuZGFibGVDb2x1bW5WaXNpYmxlO1xuICAgIHRoaXMudXBkYXRlU3RhdGVFeHBhbmRlZENvbHVtbigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBnZXRTdWZmaXhDb2x1bW5JbnNlcnRhYmxlKCkge1xuICAgIHJldHVybiBDb2Rlcy5TVUZGSVhfQ09MVU1OX0lOU0VSVEFCTEU7XG4gIH1cblxuICBnZXRBY3Rpb25zUGVybWlzc2lvbnMoKTogT1Blcm1pc3Npb25zW10ge1xuICAgIHJldHVybiB0aGlzLnBlcm1pc3Npb25zID8gKHRoaXMucGVybWlzc2lvbnMuYWN0aW9ucyB8fCBbXSkgOiBbXTtcbiAgfVxuXG4gIGdldE1lbnVQZXJtaXNzaW9ucygpOiBPVGFibGVNZW51UGVybWlzc2lvbnMge1xuICAgIGNvbnN0IHJlc3VsdDogT1RhYmxlTWVudVBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9ucyA/IHRoaXMucGVybWlzc2lvbnMubWVudSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0IDoge1xuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBpdGVtczogW11cbiAgICB9O1xuICB9XG5cbiAgZ2V0T0NvbHVtblBlcm1pc3Npb25zKGF0dHI6IHN0cmluZyk6IE9QZXJtaXNzaW9ucyB7XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5jb2x1bW5zIHx8IFtdKSA6IFtdO1xuICAgIHJldHVybiBjb2x1bW5zLmZpbmQoY29tcCA9PiBjb21wLmF0dHIgPT09IGF0dHIpIHx8IHsgYXR0cjogYXR0ciwgZW5hYmxlZDogdHJ1ZSwgdmlzaWJsZTogdHJ1ZSB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEFjdGlvblBlcm1pc3Npb25zKGF0dHI6IHN0cmluZyk6IE9QZXJtaXNzaW9ucyB7XG4gICAgY29uc3QgYWN0aW9uc1Blcm0gPSB0aGlzLnBlcm1pc3Npb25zID8gKHRoaXMucGVybWlzc2lvbnMuYWN0aW9ucyB8fCBbXSkgOiBbXTtcbiAgICBjb25zdCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zID0gYWN0aW9uc1Blcm0uZmluZChwID0+IHAuYXR0ciA9PT0gYXR0cik7XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zIHx8IHtcbiAgICAgIGF0dHI6IGF0dHIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihhdHRyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBhY3Rpb25zUGVybSA9IHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICAgIGNvbnN0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSBhY3Rpb25zUGVybS5maW5kKHAgPT4gcC5hdHRyID09PSBhdHRyKTtcbiAgICBjb25zdCBlbmFibGVkUGVybWlzaW9uID0gUGVybWlzc2lvbnNVdGlscy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKHBlcm1pc3Npb25zKTtcbiAgICBpZiAoIWVuYWJsZWRQZXJtaXNpb24pIHtcbiAgICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLk9QRVJBVElPTl9OT1RfQUxMT1dFRF9QRVJNSVNTSU9OJyk7XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVkUGVybWlzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB3aGF0IGluaXRpYWxpemUgdmFycyBhbmQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpOiBhbnkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMgPSBuZXcgRGVmYXVsdE9UYWJsZU9wdGlvbnMoKTtcbiAgICBpZiAodGhpcy50YWJHcm91cENvbnRhaW5lciAmJiB0aGlzLnRhYkNvbnRhaW5lcikge1xuICAgICAgdGhpcy5yZWdpc3RlclRhYkxpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSBwYXJhbXMgb2YgdGhlIHRhYmxlXG4gICAgdGhpcy5pbml0aWFsaXplUGFyYW1zKCk7XG5cbiAgICB0aGlzLmluaXRpYWxpemVEYW8oKTtcblxuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zU2VydmljZS5nZXRUYWJsZVBlcm1pc3Npb25zKHRoaXMub2F0dHIsIHRoaXMuYWN0Um91dGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxpemVEYW8oKSB7XG4gICAgLy8gQ29uZmlndXJlIGRhbyBtZXRob2RzXG4gICAgY29uc3QgcXVlcnlNZXRob2ROYW1lID0gdGhpcy5wYWdlYWJsZSA/IHRoaXMucGFnaW5hdGVkUXVlcnlNZXRob2QgOiB0aGlzLnF1ZXJ5TWV0aG9kO1xuICAgIGNvbnN0IG1ldGhvZHMgPSB7XG4gICAgICBxdWVyeTogcXVlcnlNZXRob2ROYW1lLFxuICAgICAgdXBkYXRlOiB0aGlzLnVwZGF0ZU1ldGhvZCxcbiAgICAgIGRlbGV0ZTogdGhpcy5kZWxldGVNZXRob2QsXG4gICAgICBpbnNlcnQ6IHRoaXMuaW5zZXJ0TWV0aG9kXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXRpY0RhdGEpIHtcbiAgICAgIHRoaXMucXVlcnlPbkJpbmQgPSBmYWxzZTtcbiAgICAgIHRoaXMucXVlcnlPbkluaXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGFvVGFibGUgPSBuZXcgT1RhYmxlRGFvKHVuZGVmaW5lZCwgdGhpcy5lbnRpdHksIG1ldGhvZHMpO1xuICAgICAgdGhpcy5zZXREYXRhQXJyYXkodGhpcy5zdGF0aWNEYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gICAgICB0aGlzLmRhb1RhYmxlID0gbmV3IE9UYWJsZURhbyh0aGlzLmRhdGFTZXJ2aWNlLCB0aGlzLmVudGl0eSwgbWV0aG9kcyk7XG4gICAgfVxuICB9XG5cbiAgcmVpbml0aWFsaXplKG9wdGlvbnM6IE9UYWJsZUluaXRpYWxpemF0aW9uT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBjb25zdCBjbG9uZWRPcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnZW50aXR5JykpIHtcbiAgICAgICAgdGhpcy5lbnRpdHkgPSBjbG9uZWRPcHRzLmVudGl0eTtcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdzZXJ2aWNlJykpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gY2xvbmVkT3B0cy5zZXJ2aWNlO1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ2NvbHVtbnMnKSkge1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBjbG9uZWRPcHRzLmNvbHVtbnM7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgndmlzaWJsZUNvbHVtbnMnKSkge1xuICAgICAgICB0aGlzLnZpc2libGVDb2x1bW5zID0gY2xvbmVkT3B0cy52aXNpYmxlQ29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdrZXlzJykpIHtcbiAgICAgICAgdGhpcy5rZXlzID0gY2xvbmVkT3B0cy5rZXlzO1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ3NvcnRDb2x1bW5zJykpIHtcbiAgICAgICAgdGhpcy5zb3J0Q29sdW1ucyA9IGNsb25lZE9wdHMuc29ydENvbHVtbnM7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgncGFyZW50S2V5cycpKSB7XG4gICAgICAgIHRoaXMucGFyZW50S2V5cyA9IGNsb25lZE9wdHMucGFyZW50S2V5cztcbiAgICAgIH1cblxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ2ZpbHRlckNvbHVtbnMnKSkge1xuICAgICAgICBpZiAoIXRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgICAgIHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCA9IG5ldyBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KHRoaXMuaW5qZWN0b3IsIHRoaXMpO1xuICAgICAgICAgIHRoaXMub1RhYmxlTWVudS5vblZpc2libGVGaWx0ZXJPcHRpb25DaGFuZ2UubmV4dCh0aGlzLmZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmNvbHVtbnMgPSBjbG9uZWRPcHRzLmZpbHRlckNvbHVtbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0cm95KCk7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vVGFibGVTdG9yYWdlLnJlc2V0KCk7XG4gICAgdGhpcy5pbml0VGFibGVBZnRlclZpZXdJbml0KCk7XG4gICAgdGhpcy5vblJlaW5pdGlhbGl6ZS5lbWl0KG51bGwpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRUYWJsZUFmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5wYXJzZVZpc2libGVDb2x1bW5zKCk7XG4gICAgdGhpcy5zZXREYXRhc291cmNlKCk7XG4gICAgdGhpcy5yZWdpc3RlckRhdGFTb3VyY2VMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnBhcnNlU29ydENvbHVtbnMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU29ydExpc3RlbmVyKCk7XG4gICAgdGhpcy5zZXRGaWx0ZXJzQ29uZmlndXJhdGlvbih0aGlzLnN0YXRlKTtcbiAgICB0aGlzLmFkZERlZmF1bHRSb3dCdXR0b25zKCk7XG5cbiAgICBpZiAodGhpcy5xdWVyeU9uSW5pdCkge1xuICAgICAgdGhpcy5xdWVyeURhdGEoKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy50YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy50YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc29ydFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zb3J0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uUmVuZGVyZWREYXRhQ2hhbmdlKSB7XG4gICAgICB0aGlzLm9uUmVuZGVyZWREYXRhQ2hhbmdlLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29udGV4dE1lbnVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuY29udGV4dE1lbnVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgT2JqZWN0LmtleXModGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zKS5mb3JFYWNoKGlkeCA9PiB7XG4gICAgICBpZiAodGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW2lkeF0pIHtcbiAgICAgICAgdGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW2lkeF0udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdXBkYXRlIHN0b3JlIGxvY2Fsc3RvcmFnZSwgY2FsbCBvZiB0aGUgSUxvY2FsU3RvcmFnZVxuICAgKi9cbiAgZ2V0RGF0YVRvU3RvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMub1RhYmxlU3RvcmFnZS5nZXREYXRhVG9TdG9yZSgpO1xuICB9XG5cbiAgcmVnaXN0ZXJRdWlja0ZpbHRlcihhcmc6IGFueSkge1xuICAgIGNvbnN0IHF1aWNrRmlsdGVyID0gKGFyZyBhcyBPVGFibGVRdWlja2ZpbHRlcik7XG4gICAgLy8gZm9yY2luZyBxdWlja0ZpbHRlckNvbXBvbmVudCB0byBiZSB1bmRlZmluZWQsIHRhYmxlIHVzZXMgb1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnRcbiAgICB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQgPSBxdWlja0ZpbHRlcjtcbiAgICB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50LnNldFZhbHVlKHRoaXMuc3RhdGUuZmlsdGVyLCBmYWxzZSk7XG4gIH1cblxuICByZWdpc3RlclBhZ2luYXRpb24odmFsdWU6IE9UYWJsZVBhZ2luYXRvcikge1xuICAgIHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzID0gdHJ1ZTtcbiAgICB0aGlzLnBhZ2luYXRvciA9IHZhbHVlO1xuICB9XG5cbiAgcmVnaXN0ZXJDb250ZXh0TWVudSh2YWx1ZTogT0NvbnRleHRNZW51Q29tcG9uZW50KTogdm9pZCB7XG4gICAgdGhpcy50YWJsZUNvbnRleHRNZW51ID0gdmFsdWU7XG4gICAgdGhpcy5jb250ZXh0TWVudVN1YnNjcmlwdGlvbiA9IHRoaXMudGFibGVDb250ZXh0TWVudS5vblNob3cuc3Vic2NyaWJlKChwYXJhbXM6IElPQ29udGV4dE1lbnVDb250ZXh0KSA9PiB7XG4gICAgICBwYXJhbXMuY2xhc3MgPSAnby10YWJsZS1jb250ZXh0LW1lbnUgJyArIHRoaXMucm93SGVpZ2h0O1xuICAgICAgaWYgKHBhcmFtcy5kYXRhICYmICF0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHBhcmFtcy5kYXRhLnJvd1ZhbHVlKSkge1xuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3cocGFyYW1zLmRhdGEucm93VmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJEZWZhdWx0Q29sdW1uKGNvbHVtbjogc3RyaW5nKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZ2V0T0NvbHVtbihjb2x1bW4pKSkge1xuICAgICAgLy8gYSBkZWZhdWx0IGNvbHVtbiBkZWZpbml0aW9uIHRyeWluZyB0byByZXBsYWNlIGFuIGFscmVhZHkgZXhpc3RpbmcgZGVmaW5pdGlvblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2xEZWY6IE9Db2x1bW4gPSB0aGlzLmNyZWF0ZU9Db2x1bW4oY29sdW1uLCB0aGlzKTtcbiAgICB0aGlzLnB1c2hPQ29sdW1uRGVmaW5pdGlvbihjb2xEZWYpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIGFsbCBjb2x1bW5zIGFuZCBwcm9wZXJ0aWVzIGluIHZhciBjb2x1bW5zQXJyYXlcbiAgICogQHBhcmFtIGNvbHVtblxuICAgKi9cbiAgcmVnaXN0ZXJDb2x1bW4oY29sdW1uOiBPVGFibGVDb2x1bW5Db21wb25lbnQgfCBPVGFibGVDb2x1bW5DYWxjdWxhdGVkQ29tcG9uZW50IHwgYW55KSB7XG4gICAgY29uc3QgY29sdW1uQXR0ciA9ICh0eXBlb2YgY29sdW1uID09PSAnc3RyaW5nJykgPyBjb2x1bW4gOiBjb2x1bW4uYXR0cjtcbiAgICBjb25zdCBjb2x1bW5QZXJtaXNzaW9uczogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRPQ29sdW1uUGVybWlzc2lvbnMoY29sdW1uQXR0cik7XG4gICAgaWYgKCFjb2x1bW5QZXJtaXNzaW9ucy52aXNpYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb2x1bW4gPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyRGVmYXVsdENvbHVtbihjb2x1bW4pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbHVtbkRlZiA9IHRoaXMuZ2V0T0NvbHVtbihjb2x1bW4uYXR0cik7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbkRlZikgJiYgVXRpbC5pc0RlZmluZWQoY29sdW1uRGVmLmRlZmluaXRpb24pKSB7XG4gICAgICAvLyBhIG8tdGFibGUtY29sdW1uIGRlZmluaXRpb24gdHJ5aW5nIHRvIHJlcGxhY2UgYW4gYWxyZWFkeSBleGlzdGluZyBvLXRhYmxlLWNvbHVtbiBkZWZpbml0aW9uXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbERlZjogT0NvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbihjb2x1bW4uYXR0ciwgdGhpcywgY29sdW1uKTtcbiAgICBsZXQgY29sdW1uV2lkdGggPSBjb2x1bW4ud2lkdGg7XG4gICAgY29uc3Qgc3RvcmVkQ29scyA9IHRoaXMuc3RhdGVbJ29Db2x1bW5zLWRpc3BsYXknXTtcblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChzdG9yZWRDb2xzKSkge1xuICAgICAgY29uc3Qgc3RvcmVkRGF0YSA9IHN0b3JlZENvbHMuZmluZChvQ29sID0+IG9Db2wuYXR0ciA9PT0gY29sRGVmLmF0dHIpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHN0b3JlZERhdGEpICYmIFV0aWwuaXNEZWZpbmVkKHN0b3JlZERhdGEud2lkdGgpKSB7XG4gICAgICAgIC8vIGNoZWNrIHRoYXQgdGhlIHdpZHRoIG9mIHRoZSBjb2x1bW5zIHNhdmVkIGluIHRoZSBpbml0aWFsIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgLy8gaW4gdGhlIGxvY2FsIHN0b3JhZ2UgaXMgZGlmZmVyZW50IGZyb20gdGhlIG9yaWdpbmFsIHZhbHVlXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgnb0NvbHVtbnMtZGlzcGxheScpKSB7XG4gICAgICAgICAgICBjb25zdCBpbml0aWFsU3RvcmVkQ29scyA9IHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydvQ29sdW1ucy1kaXNwbGF5J107XG4gICAgICAgICAgICBpbml0aWFsU3RvcmVkQ29scy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICBpZiAoY29sRGVmLmF0dHIgPT09IGVsZW1lbnQuYXR0ciAmJiBlbGVtZW50LndpZHRoID09PSBjb2xEZWYuZGVmaW5pdGlvbi5vcmlnaW5hbFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgY29sdW1uV2lkdGggPSBzdG9yZWREYXRhLndpZHRoO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sdW1uV2lkdGggPSBzdG9yZWREYXRhLndpZHRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uV2lkdGgpKSB7XG4gICAgICBjb2xEZWYud2lkdGggPSBjb2x1bW5XaWR0aDtcbiAgICB9XG4gICAgaWYgKGNvbHVtbiAmJiAoY29sdW1uLmFzeW5jTG9hZCB8fCBjb2x1bW4udHlwZSA9PT0gJ2FjdGlvbicpKSB7XG4gICAgICB0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLnB1c2goY29sdW1uLmF0dHIpO1xuICAgICAgaWYgKGNvbHVtbi5hc3luY0xvYWQpIHtcbiAgICAgICAgdGhpcy5hc3luY0xvYWRDb2x1bW5zLnB1c2goY29sdW1uLmF0dHIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnB1c2hPQ29sdW1uRGVmaW5pdGlvbihjb2xEZWYpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHB1c2hPQ29sdW1uRGVmaW5pdGlvbihjb2xEZWY6IE9Db2x1bW4pIHtcbiAgICBjb2xEZWYudmlzaWJsZSA9ICh0aGlzLl92aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihjb2xEZWYuYXR0cikgIT09IC0xKTtcbiAgICAvLyBGaW5kIGNvbHVtbiBkZWZpbml0aW9uIGJ5IG5hbWVcbiAgICBjb25zdCBhbHJlYWR5RXhpc3RpbmcgPSB0aGlzLmdldE9Db2x1bW4oY29sRGVmLmF0dHIpO1xuICAgIGlmIChhbHJlYWR5RXhpc3RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmVwbGFjaW5nSW5kZXggPSB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuaW5kZXhPZihhbHJlYWR5RXhpc3RpbmcpO1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zW3JlcGxhY2luZ0luZGV4XSA9IGNvbERlZjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLnB1c2goY29sRGVmKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoRWRpdGlvbk1vZGVXYXJuKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVmcmVzaEVkaXRpb25Nb2RlV2FybigpIHtcbiAgICBpZiAodGhpcy5lZGl0aW9uTW9kZSAhPT0gQ29kZXMuREVUQUlMX01PREVfTk9ORSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBlZGl0YWJsZUNvbHVtbnMgPSB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKGNvbCA9PiB7XG4gICAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQoY29sLmVkaXRvcik7XG4gICAgfSk7XG4gICAgaWYgKGVkaXRhYmxlQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1VzaW5nIGEgY29sdW1uIHdpdGggYSBlZGl0b3IgYnV0IHRoZXJlIGlzIG5vIGVkaXRpb24tbW9kZSBkZWZpbmVkJyk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJDb2x1bW5BZ2dyZWdhdGUoY29sdW1uOiBPQ29sdW1uQWdncmVnYXRlKSB7XG4gICAgdGhpcy5zaG93VG90YWxzU3ViamVjdC5uZXh0KHRydWUpO1xuICAgIGNvbnN0IGFscmVhZHlFeGlzdGluZyA9IHRoaXMuZ2V0T0NvbHVtbihjb2x1bW4uYXR0cik7XG4gICAgaWYgKGFscmVhZHlFeGlzdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCByZXBsYWNpbmdJbmRleCA9IHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5pbmRleE9mKGFscmVhZHlFeGlzdGluZyk7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnNbcmVwbGFjaW5nSW5kZXhdLmFnZ3JlZ2F0ZSA9IGNvbHVtbjtcbiAgICB9XG4gIH1cblxuICBwYXJzZVZpc2libGVDb2x1bW5zKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdvQ29sdW1ucy1kaXNwbGF5JykpIHtcbiAgICAgIC8vIGZpbHRlcmluZyBjb2x1bW5zIHRoYXQgbWlnaHQgYmUgaW4gc3RhdGUgc3RvcmFnZSBidXQgbm90IGluIHRoZSBhY3R1YWwgdGFibGUgZGVmaW5pdGlvblxuICAgICAgbGV0IHN0YXRlQ29scyA9IFtdO1xuICAgICAgdGhpcy5zdGF0ZVsnb0NvbHVtbnMtZGlzcGxheSddLmZvckVhY2goKG9Db2wsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGlzVmlzaWJsZUNvbEluQ29sdW1ucyA9IHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5maW5kKGNvbCA9PiBjb2wuYXR0ciA9PT0gb0NvbC5hdHRyKSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoaXNWaXNpYmxlQ29sSW5Db2x1bW5zKSB7XG4gICAgICAgICAgc3RhdGVDb2xzLnB1c2gob0NvbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdVbmFibGUgdG8gbG9hZCB0aGUgY29sdW1uICcgKyBvQ29sLmF0dHIgKyAnIGZyb20gdGhlIGxvY2Fsc3RvcmFnZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHN0YXRlQ29scyA9IHRoaXMuY2hlY2tDaGFuZ2VzVmlzaWJsZUNvbHVtbW5zSW5Jbml0aWFsQ29uZmlndXJhdGlvbihzdGF0ZUNvbHMpO1xuICAgICAgdGhpcy52aXNpYmxlQ29sQXJyYXkgPSBzdGF0ZUNvbHMuZmlsdGVyKGl0ZW0gPT4gaXRlbS52aXNpYmxlKS5tYXAoaXRlbSA9PiBpdGVtLmF0dHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpc2libGVDb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnZpc2libGVDb2x1bW5zLCB0cnVlKTtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb3J0KChhOiBPQ29sdW1uLCBiOiBPQ29sdW1uKSA9PiB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGEuYXR0cikgLSB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGIuYXR0cikpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrQ2hhbmdlc1Zpc2libGVDb2x1bW1uc0luSW5pdGlhbENvbmZpZ3VyYXRpb24oc3RhdGVDb2xzKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ29Db2x1bW5zLWRpc3BsYXknKSkge1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmlzaWJsZUNvbEFycmF5ID0gdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ29Db2x1bW5zLWRpc3BsYXknXS5tYXAoeCA9PiB7XG4gICAgICAgICAgaWYgKHgudmlzaWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHguYXR0cjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB2aXNpYmxlQ29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy52aXNpYmxlQ29sdW1ucywgdHJ1ZSk7XG5cbiAgICAgICAgLy8gRmluZCB2YWx1ZXMgaW4gdmlzaWJsZS1jb2x1bW5zIHRoYXQgdGhleSBhcmVudCBpbiBvcmlnaW5hbC12aXNpYmxlLWNvbHVtbnMgaW4gbG9jYWxzdG9yYWdlXG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSB5b3UgaGF2ZSB0byBhZGQgdGhpcyBjb2x1bW4gdG8gdGhpcy52aXNpYmxlQ29sQXJyYXlcbiAgICAgICAgY29uc3QgY29sVG9BZGRJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXModmlzaWJsZUNvbEFycmF5LCBvcmlnaW5hbFZpc2libGVDb2xBcnJheSk7XG4gICAgICAgIGlmIChjb2xUb0FkZEluVmlzaWJsZUNvbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29sVG9BZGRJblZpc2libGVDb2wuZm9yRWFjaCgoY29sQWRkLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0YXRlQ29scy5maWx0ZXIoY29sID0+IGNvbC5hdHRyID09PSBjb2xBZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgc3RhdGVDb2xzID0gc3RhdGVDb2xzLm1hcChjb2wgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjb2xUb0FkZEluVmlzaWJsZUNvbC5pbmRleE9mKGNvbC5hdHRyKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICBjb2wudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjb2w7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jb2xBcnJheS5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT09IGNvbEFkZCkge1xuICAgICAgICAgICAgICAgICAgc3RhdGVDb2xzLnNwbGljZShpICsgMSwgMCxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHI6IGNvbEFkZCxcbiAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluZCB2YWx1ZXMgaW4gb3JpZ2luYWwtdmlzaWJsZS1jb2x1bW5zIGluIGxvY2Fsc3RvcmFnZSB0aGF0IHRoZXkgYXJlbnQgaW4gdGhpcy52aXNpYmxlQ29sQXJyYXlcbiAgICAgICAgLy8gaW4gdGhpcyBjYXNlIHlvdSBoYXZlIHRvIGRlbGV0ZSB0aGlzIGNvbHVtbiB0byB0aGlzLnZpc2libGVDb2xBcnJheVxuICAgICAgICBjb25zdCBjb2xUb0RlbGV0ZUluVmlzaWJsZUNvbCA9IFV0aWwuZGlmZmVyZW5jZUFycmF5cyhvcmlnaW5hbFZpc2libGVDb2xBcnJheSwgdmlzaWJsZUNvbEFycmF5KTtcbiAgICAgICAgaWYgKGNvbFRvRGVsZXRlSW5WaXNpYmxlQ29sLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzdGF0ZUNvbHMgPSBzdGF0ZUNvbHMubWFwKGNvbCA9PiB7XG4gICAgICAgICAgICBpZiAoY29sVG9EZWxldGVJblZpc2libGVDb2wuaW5kZXhPZihjb2wuYXR0cikgPiAtMSkge1xuICAgICAgICAgICAgICBjb2wudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNvbDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVDb2xzO1xuICB9XG5cbiAgcGFyc2VTb3J0Q29sdW1ucygpIHtcbiAgICBjb25zdCBzb3J0Q29sdW1uc1BhcmFtID0gdGhpcy5zdGF0ZVsnc29ydC1jb2x1bW5zJ10gfHwgdGhpcy5zb3J0Q29sdW1ucztcbiAgICB0aGlzLnNvcnRDb2xBcnJheSA9IFNlcnZpY2VVdGlscy5wYXJzZVNvcnRDb2x1bW5zKHNvcnRDb2x1bW5zUGFyYW0pO1xuXG4gICAgLy8gY2hlY2tpbmcgdGhlIG9yaWdpbmFsIHNvcnQgY29sdW1ucyB3aXRoIHRoZSBzb3J0IGNvbHVtbnMgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGluIGxvY2FsIHN0b3JhZ2VcbiAgICBpZiAodGhpcy5zdGF0ZVsnc29ydC1jb2x1bW5zJ10gJiYgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ3NvcnQtY29sdW1ucyddKSB7XG5cbiAgICAgIGNvbnN0IGluaXRpYWxDb25maWdTb3J0Q29sdW1uc0FycmF5ID0gU2VydmljZVV0aWxzLnBhcnNlU29ydENvbHVtbnModGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ3NvcnQtY29sdW1ucyddKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsU29ydENvbHVtbnNBcnJheSA9IFNlcnZpY2VVdGlscy5wYXJzZVNvcnRDb2x1bW5zKHRoaXMuc29ydENvbHVtbnMpO1xuICAgICAgLy8gRmluZCB2YWx1ZXMgaW4gdmlzaWJsZS1jb2x1bW5zIHRoYXQgdGhleSBhcmVudCBpbiBvcmlnaW5hbC12aXNpYmxlLWNvbHVtbnMgaW4gbG9jYWxzdG9yYWdlXG4gICAgICAvLyBpbiB0aGlzIGNhc2UgeW91IGhhdmUgdG8gYWRkIHRoaXMgY29sdW1uIHRvIHRoaXMudmlzaWJsZUNvbEFycmF5XG4gICAgICBjb25zdCBjb2xUb0FkZEluVmlzaWJsZUNvbCA9IFV0aWwuZGlmZmVyZW5jZUFycmF5cyhvcmlnaW5hbFNvcnRDb2x1bW5zQXJyYXksIGluaXRpYWxDb25maWdTb3J0Q29sdW1uc0FycmF5KTtcbiAgICAgIGlmIChjb2xUb0FkZEluVmlzaWJsZUNvbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbFRvQWRkSW5WaXNpYmxlQ29sLmZvckVhY2goY29sQWRkID0+IHtcbiAgICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5wdXNoKGNvbEFkZCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb2xUb0RlbEluVmlzaWJsZUNvbCA9IFV0aWwuZGlmZmVyZW5jZUFycmF5cyhpbml0aWFsQ29uZmlnU29ydENvbHVtbnNBcnJheSwgb3JpZ2luYWxTb3J0Q29sdW1uc0FycmF5KTtcbiAgICAgIGlmIChjb2xUb0RlbEluVmlzaWJsZUNvbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbFRvRGVsSW5WaXNpYmxlQ29sLmZvckVhY2goKGNvbERlbCkgPT4ge1xuICAgICAgICAgIHRoaXMuc29ydENvbEFycmF5LmZvckVhY2goKGNvbCwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbC5jb2x1bW5OYW1lID09PSBjb2xEZWwuY29sdW1uTmFtZSkge1xuICAgICAgICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGVuc3VyaW5nIGNvbHVtbiBleGlzdGVuY2UgYW5kIGNoZWNraW5nIGl0cyBvcmRlcmFibGUgc3RhdGVcbiAgICBmb3IgKGxldCBpID0gdGhpcy5zb3J0Q29sQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGNvbE5hbWUgPSB0aGlzLnNvcnRDb2xBcnJheVtpXS5jb2x1bW5OYW1lO1xuICAgICAgY29uc3Qgb0NvbCA9IHRoaXMuZ2V0T0NvbHVtbihjb2xOYW1lKTtcbiAgICAgIGlmICghVXRpbC5pc0RlZmluZWQob0NvbCkgfHwgIW9Db2wub3JkZXJhYmxlKSB7XG4gICAgICAgIHRoaXMuc29ydENvbEFycmF5LnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplUGFyYW1zKCk6IHZvaWQge1xuICAgIC8vIElmIHZpc2libGUtY29sdW1ucyBpcyBub3QgcHJlc2VudCB0aGVuIHZpc2libGUtY29sdW1ucyBpcyBhbGwgY29sdW1uc1xuICAgIGlmICghdGhpcy52aXNpYmxlQ29sdW1ucykge1xuICAgICAgdGhpcy52aXNpYmxlQ29sdW1ucyA9IHRoaXMuY29sdW1ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2xBcnJheS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY29sQXJyYXkuZm9yRWFjaCgoeDogc3RyaW5nKSA9PiB0aGlzLnJlZ2lzdGVyQ29sdW1uKHgpKTtcblxuICAgICAgbGV0IGNvbHVtbnNPcmRlciA9IFtdO1xuICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ29Db2x1bW5zLWRpc3BsYXknKSkge1xuICAgICAgICBjb2x1bW5zT3JkZXIgPSB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J10ubWFwKGl0ZW0gPT4gaXRlbS5hdHRyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtbnNPcmRlciA9IHRoaXMuY29sQXJyYXkuZmlsdGVyKGF0dHIgPT4gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihhdHRyKSA9PT0gLTEpO1xuICAgICAgICBjb2x1bW5zT3JkZXIucHVzaCguLi50aGlzLnZpc2libGVDb2xBcnJheSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb3J0KChhOiBPQ29sdW1uLCBiOiBPQ29sdW1uKSA9PiB7XG4gICAgICAgIGlmIChjb2x1bW5zT3JkZXIuaW5kZXhPZihhLmF0dHIpID09PSAtMSkge1xuICAgICAgICAgIC8vIGlmIGl0IGlzIG5vdCBpbiBsb2NhbCBzdG9yYWdlIGJlY2F1c2UgaXQgaXMgbmV3LCBrZWVwIG9yZGVyXG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGNvbHVtbnNPcmRlci5pbmRleE9mKGEuYXR0cikgLSBjb2x1bW5zT3JkZXIuaW5kZXhPZihiLmF0dHIpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgcXVpY2tGaWx0ZXJcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmZpbHRlciA9IHRoaXMucXVpY2tGaWx0ZXI7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnY3VycmVudFBhZ2UnKSkge1xuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMuc3RhdGUuY3VycmVudFBhZ2U7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSBwYWdpbmF0b3JcbiAgICBpZiAoIXRoaXMucGFnaW5hdG9yICYmIHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzKSB7XG4gICAgICB0aGlzLnBhZ2luYXRvciA9IG5ldyBPQmFzZVRhYmxlUGFnaW5hdG9yKCk7XG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlU2l6ZSA9IHRoaXMucXVlcnlSb3dzO1xuICAgICAgdGhpcy5wYWdpbmF0b3IucGFnZUluZGV4ID0gdGhpcy5jdXJyZW50UGFnZTtcbiAgICAgIHRoaXMucGFnaW5hdG9yLnNob3dGaXJzdExhc3RCdXR0b25zID0gdGhpcy5zaG93UGFnaW5hdG9yRmlyc3RMYXN0QnV0dG9ucztcbiAgICB9XG5cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlKSkge1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSA9ICEhdGhpcy5zdGF0ZVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNoZWNraW5nIHRoZSBvcmlnaW5hbCBzZWxlY3RBbGxDaGVja2JveFZpc2libGUgd2l0aCBzZWxlY3QtY29sdW1uLXZpc2libGUgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSAmJiB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0LWNvbHVtbi12aXNpYmxlJylcbiAgICAgICAgJiYgdGhpcy5zZWxlY3RBbGxDaGVja2JveFZpc2libGUgPT09IHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydzZWxlY3QtY29sdW1uLXZpc2libGUnXSkge1xuICAgICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gISF0aGlzLnN0YXRlWydzZWxlY3QtY29sdW1uLXZpc2libGUnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSB0aGlzLnNlbGVjdEFsbENoZWNrYm94VmlzaWJsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL0luaXRpYWxpemUgc2hvdyBmaWx0ZXIgYnkgY29sdW1uIGljb25cbiAgICB0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gPSB0aGlzLm9yaWdpbmFsRmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0O1xuXG4gICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcblxuICB9XG4gIHVwZGF0ZVN0YXRlRXhwYW5kZWRDb2x1bW4oKSB7XG4gICAgaWYgKCF0aGlzLnRhYmxlUm93RXhwYW5kYWJsZSB8fCAhdGhpcy50YWJsZVJvd0V4cGFuZGFibGUuZXhwYW5kYWJsZUNvbHVtblZpc2libGUpIHsgcmV0dXJuOyB9XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnNbMF0gPT09IENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zWzFdICE9PSBDb2Rlcy5OQU1FX0NPTFVNTl9FWFBBTkRBQkxFKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zID0gW3RoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnNbMF1dLmNvbmNhdChDb2Rlcy5OQU1FX0NPTFVNTl9FWFBBTkRBQkxFLCB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLnNwbGljZSgxKSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zWzBdICE9PSBDb2Rlcy5OQU1FX0NPTFVNTl9FWFBBTkRBQkxFKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLnVuc2hpZnQoQ29kZXMuTkFNRV9DT0xVTU5fRVhQQU5EQUJMRSk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJUYWJMaXN0ZW5lcigpIHtcbiAgICAvLyBXaGVuIHRhYmxlIGlzIGNvbnRhaW5lZCBpbnRvIHRhYiBjb21wb25lbnQsIGl0IGlzIG5lY2Vzc2FyeSB0byBpbml0IHRhYmxlIGNvbXBvbmVudCB3aGVuIGF0dGFjaGVkIHRvIERPTS5cbiAgICB0aGlzLnRhYkdyb3VwQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy50YWJHcm91cENvbnRhaW5lci5zZWxlY3RlZFRhYkNoYW5nZS5zdWJzY3JpYmUoKGV2dCkgPT4ge1xuICAgICAgbGV0IGludGVydmFsO1xuICAgICAgY29uc3QgdGltZXJDYWxsYmFjayA9ICh0YWI6IE1hdFRhYikgPT4ge1xuICAgICAgICBpZiAodGFiICYmIHRhYi5jb250ZW50LmlzQXR0YWNoZWQpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICBpZiAodGFiID09PSB0aGlzLnRhYkNvbnRhaW5lcikge1xuICAgICAgICAgICAgdGhpcy5pbnNpZGVUYWJCdWdXb3JrYXJvdW5kKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5wZW5kaW5nUXVlcnkpIHtcbiAgICAgICAgICAgICAgdGhpcy5xdWVyeURhdGEodGhpcy5wZW5kaW5nUXVlcnlGaWx0ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4geyB0aW1lckNhbGxiYWNrKGV2dC50YWIpOyB9LCAxMDApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluc2lkZVRhYkJ1Z1dvcmthcm91bmQoKSB7XG4gICAgdGhpcy5zb3J0SGVhZGVycy5mb3JFYWNoKHNvcnRIID0+IHtcbiAgICAgIHNvcnRILnJlZnJlc2goKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyU29ydExpc3RlbmVyKCkge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnNvcnQpKSB7XG4gICAgICB0aGlzLnNvcnRTdWJzY3JpcHRpb24gPSB0aGlzLnNvcnQub1NvcnRDaGFuZ2Uuc3Vic2NyaWJlKHRoaXMub25Tb3J0Q2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5zb3J0LnNldE11bHRpcGxlU29ydCh0aGlzLm11bHRpcGxlU29ydCk7XG5cbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMpICYmICh0aGlzLnNvcnRDb2xBcnJheS5sZW5ndGggPiAwKSkge1xuICAgICAgICB0aGlzLnNvcnQuc2V0VGFibGVJbmZvKHRoaXMuc29ydENvbEFycmF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Tb3J0Q2hhbmdlKHNvcnRBcnJheTogYW55W10pIHtcbiAgICB0aGlzLnNvcnRDb2xBcnJheSA9IFtdO1xuICAgIHNvcnRBcnJheS5mb3JFYWNoKChzb3J0KSA9PiB7XG4gICAgICBpZiAoc29ydC5kaXJlY3Rpb24gIT09ICcnKSB7XG4gICAgICAgIHRoaXMuc29ydENvbEFycmF5LnB1c2goe1xuICAgICAgICAgIGNvbHVtbk5hbWU6IHNvcnQuaWQsXG4gICAgICAgICAgYXNjZW5kZW50OiBzb3J0LmRpcmVjdGlvbiA9PT0gQ29kZXMuQVNDX1NPUlRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvYWRpbmdTb3J0aW5nU3ViamVjdC5uZXh0KHRydWUpO1xuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0RGF0YXNvdXJjZSgpIHtcbiAgICBjb25zdCBkYXRhU291cmNlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UYWJsZURhdGFTb3VyY2VTZXJ2aWNlKTtcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlU2VydmljZS5nZXRJbnN0YW5jZSh0aGlzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3RlckRhdGFTb3VyY2VMaXN0ZW5lcnMoKSB7XG4gICAgaWYgKCF0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLm9uUmVuZGVyZWREYXRhQ2hhbmdlID0gdGhpcy5kYXRhU291cmNlLm9uUmVuZGVyZWREYXRhQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMubG9hZGluZ1NvcnRpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xuICAgICAgICAgIGlmICh0aGlzLmNkICYmICEodGhpcy5jZCBhcyBWaWV3UmVmKS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaG93TG9hZGluZygpIHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5sb2FkaW5nLCB0aGlzLmxvYWRpbmdTb3J0aW5nLCB0aGlzLmxvYWRpbmdTY3JvbGxdKVxuICAgICAgLnBpcGUobWFwKChyZXM6IGFueVtdKSA9PiAocmVzWzBdIHx8IHJlc1sxXSB8fCByZXNbMl0pKSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RXhwYW5kZWRSb3dDb250YWluZXJDbGFzcyhyb3dJbmRleDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gT1RhYmxlQ29tcG9uZW50LkVYUEFOREVEX1JPV19DT05UQUlORVJfQ0xBU1MgKyByb3dJbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRFeHBhbmRhYmxlSXRlbXMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGVJdGVtLnNlbGVjdGVkO1xuICB9XG5cbiAgcHVibGljIHRvb2dsZVJvd0V4cGFuZGFibGUoaXRlbTogYW55LCByb3dJbmRleDogbnVtYmVyLCBldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5leHBhbmRhYmxlSXRlbS50b2dnbGUoaXRlbSk7XG5cblxuXG4gICAgaWYgKHRoaXMuZ2V0U3RhdGVFeHBhbmQoaXRlbSkgPT09ICdjb2xsYXBzZWQnKSB7XG4gICAgICB0aGlzLnBvcnRhbEhvc3QuZGV0YWNoKCk7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIGNvbnN0IGV2ZW50VGFibGVSb3dFeHBhbmRhYmxlQ2hhbmdlID0gdGhpcy5lbWl0VGFibGVSb3dFeHBhbmRhYmxlQ2hhbmdlRXZlbnQoaXRlbSwgcm93SW5kZXgpO1xuICAgICAgdGhpcy50YWJsZVJvd0V4cGFuZGFibGUub25Db2xsYXBzZWQuZW1pdChldmVudFRhYmxlUm93RXhwYW5kYWJsZUNoYW5nZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucG9ydGFsSG9zdCA9IG5ldyBEb21Qb3J0YWxPdXRsZXQoXG4gICAgICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuZ2V0RXhwYW5kZWRSb3dDb250YWluZXJDbGFzcyhyb3dJbmRleCkpLFxuICAgICAgICB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgICAgIHRoaXMuYXBwUmVmLFxuICAgICAgICB0aGlzLmluamVjdG9yXG4gICAgICApO1xuXG4gICAgICBjb25zdCB0ZW1wbGF0ZVBvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbCh0aGlzLnRhYmxlUm93RXhwYW5kYWJsZS50ZW1wbGF0ZVJlZiwgdGhpcy5fdmlld0NvbnRhaW5lclJlZiwgeyAkaW1wbGljaXQ6IGl0ZW0gfSk7XG4gICAgICB0aGlzLnBvcnRhbEhvc3QuYXR0YWNoVGVtcGxhdGVQb3J0YWwodGVtcGxhdGVQb3J0YWwpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGV2ZW50VGFibGVSb3dFeHBhbmRhYmxlQ2hhbmdlID0gdGhpcy5lbWl0VGFibGVSb3dFeHBhbmRhYmxlQ2hhbmdlRXZlbnQoaXRlbSwgcm93SW5kZXgpO1xuICAgICAgICB0aGlzLnRhYmxlUm93RXhwYW5kYWJsZS5vbkV4cGFuZGVkLmVtaXQoZXZlbnRUYWJsZVJvd0V4cGFuZGFibGVDaGFuZ2UpO1xuICAgICAgfSwgMjUwKTtcblxuXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBlbWl0VGFibGVSb3dFeHBhbmRhYmxlQ2hhbmdlRXZlbnQoZGF0YSwgcm93SW5kZXgpIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBPVGFibGVSb3dFeHBhbmRlZENoYW5nZSgpO1xuICAgIGV2ZW50LnJvd0luZGV4ID0gcm93SW5kZXg7XG4gICAgZXZlbnQuZGF0YSA9IGRhdGE7XG5cbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICBwdWJsaWMgaXNFeHBhbmRlZChkYXRhOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRhYmxlSXRlbS5pc1NlbGVjdGVkKGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGdldFN0YXRlRXhwYW5kKHJvdykge1xuICAgIHJldHVybiB0aGlzLmlzRXhwYW5kZWQocm93KSA/ICdleHBhbmRlZCcgOiAnY29sbGFwc2VkJztcbiAgfVxuXG4gIHB1YmxpYyBpc0NvbHVtbkV4cGFuZGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChVdGlsLmlzRGVmaW5lZCh0aGlzLnRhYmxlUm93RXhwYW5kYWJsZSkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5fb1RhYmxlT3B0aW9ucy5leHBhbmRhYmxlQ29sdW1uKSkgPyB0aGlzLl9vVGFibGVPcHRpb25zLmV4cGFuZGFibGVDb2x1bW4udmlzaWJsZSA6IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGhhc0V4cGFuZGVkUm93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLnRhYmxlUm93RXhwYW5kYWJsZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TnVtVmlzaWJsZUNvbHVtbnMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBtYW5hZ2VzIHRoZSBjYWxsIHRvIHRoZSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBmaWx0ZXJcbiAgICogQHBhcmFtIG92cnJBcmdzXG4gICAqL1xuICBxdWVyeURhdGEoZmlsdGVyPzogYW55LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKSB7XG4gICAgLy8gSWYgdGFiIGV4aXN0cyBhbmQgaXMgbm90IGFjdGl2ZSB0aGVuIHdhaXQgZm9yIHF1ZXJ5RGF0YVxuICAgIGlmICh0aGlzLmlzSW5zaWRlSW5hY3RpdmVUYWIoKSkge1xuICAgICAgdGhpcy5wZW5kaW5nUXVlcnkgPSB0cnVlO1xuICAgICAgdGhpcy5wZW5kaW5nUXVlcnlGaWx0ZXIgPSBmaWx0ZXI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGVuZGluZ1F1ZXJ5ID0gZmFsc2U7XG4gICAgdGhpcy5wZW5kaW5nUXVlcnlGaWx0ZXIgPSB1bmRlZmluZWQ7XG4gICAgc3VwZXIucXVlcnlEYXRhKGZpbHRlciwgb3ZyckFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzSW5zaWRlSW5hY3RpdmVUYWIoKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGlmICh0aGlzLnRhYkNvbnRhaW5lciAmJiB0aGlzLnRhYkdyb3VwQ29udGFpbmVyKSB7XG4gICAgICByZXN1bHQgPSAhKHRoaXMudGFiQ29udGFpbmVyLmlzQWN0aXZlIHx8ICh0aGlzLnRhYkdyb3VwQ29udGFpbmVyLnNlbGVjdGVkSW5kZXggPT09IHRoaXMudGFiQ29udGFpbmVyLnBvc2l0aW9uKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDb21wb25lbnRGaWx0ZXIoZXhpc3RpbmdGaWx0ZXI6IGFueSA9IHt9KTogYW55IHtcbiAgICBsZXQgZmlsdGVyID0gZXhpc3RpbmdGaWx0ZXI7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhmaWx0ZXIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGFyZW50SXRlbUV4cHIgPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uRnJvbU9iamVjdChmaWx0ZXIpO1xuICAgICAgICBmaWx0ZXIgPSB7fTtcbiAgICAgICAgZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5GSUxURVJfRVhQUkVTU0lPTl9LRVldID0gcGFyZW50SXRlbUV4cHI7XG4gICAgICB9XG4gICAgICBjb25zdCBiZUNvbEZpbHRlciA9IHRoaXMuZ2V0Q29sdW1uRmlsdGVyc0V4cHJlc3Npb24oKTtcbiAgICAgIC8vIEFkZCBjb2x1bW4gZmlsdGVycyBiYXNpYyBleHByZXNzaW9uIHRvIGN1cnJlbnQgZmlsdGVyXG4gICAgICBpZiAoYmVDb2xGaWx0ZXIgJiYgIVV0aWwuaXNEZWZpbmVkKGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSkpIHtcbiAgICAgICAgZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5GSUxURVJfRVhQUkVTU0lPTl9LRVldID0gYmVDb2xGaWx0ZXI7XG4gICAgICB9IGVsc2UgaWYgKGJlQ29sRmlsdGVyKSB7XG4gICAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSA9XG4gICAgICAgICAgRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5GSUxURVJfRVhQUkVTU0lPTl9LRVldLCBiZUNvbEZpbHRlciwgRmlsdGVyRXhwcmVzc2lvblV0aWxzLk9QX0FORCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5nZXRDb21wb25lbnRGaWx0ZXIoZmlsdGVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRRdWlja0ZpbHRlckV4cHJlc3Npb24oKTogRXhwcmVzc2lvbiB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQpICYmIHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHJldHVybiB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50LmZpbHRlckV4cHJlc3Npb247XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29sdW1uRmlsdGVyc0V4cHJlc3Npb24oKTogRXhwcmVzc2lvbiB7XG4gICAgLy8gQXBwbHkgY29sdW1uIGZpbHRlcnNcbiAgICBjb25zdCBjb2x1bW5GaWx0ZXJzOiBPQ29sdW1uVmFsdWVGaWx0ZXJbXSA9IHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKTtcbiAgICBjb25zdCBiZUNvbHVtbkZpbHRlcnM6IEFycmF5PEV4cHJlc3Npb24+ID0gW107XG4gICAgY29sdW1uRmlsdGVycy5mb3JFYWNoKGNvbEZpbHRlciA9PiB7XG4gICAgICAvLyBQcmVwYXJlIGJhc2ljIGV4cHJlc3Npb25zXG4gICAgICBzd2l0Y2ggKGNvbEZpbHRlci5vcGVyYXRvcikge1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU46XG4gICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShjb2xGaWx0ZXIudmFsdWVzKSkge1xuICAgICAgICAgICAgY29uc3QgYmVzSW46IEFycmF5PEV4cHJlc3Npb24+ID0gY29sRmlsdGVyLnZhbHVlcy5tYXAodmFsdWUgPT4gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkVxdWFscyhjb2xGaWx0ZXIuYXR0ciwgdmFsdWUpKTtcbiAgICAgICAgICAgIGxldCBiZUluOiBFeHByZXNzaW9uID0gYmVzSW4ucG9wKCk7XG4gICAgICAgICAgICBiZXNJbi5mb3JFYWNoKGJlID0+IHtcbiAgICAgICAgICAgICAgYmVJbiA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKGJlSW4sIGJlLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfT1IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBiZUNvbHVtbkZpbHRlcnMucHVzaChiZUluKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5CRVRXRUVOOlxuICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkoY29sRmlsdGVyLnZhbHVlcykgJiYgY29sRmlsdGVyLnZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgIGxldCBiZUZyb20gPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTW9yZUVxdWFsKGNvbEZpbHRlci5hdHRyLCBjb2xGaWx0ZXIudmFsdWVzWzBdKTtcbiAgICAgICAgICAgIGxldCBiZVRvID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkxlc3NFcXVhbChjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlc1sxXSk7XG4gICAgICAgICAgICBiZUNvbHVtbkZpbHRlcnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihiZUZyb20sIGJlVG8sIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9BTkQpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5FUVVBTDpcbiAgICAgICAgICBiZUNvbHVtbkZpbHRlcnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTGlrZShjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTEVTU19FUVVBTDpcbiAgICAgICAgICBiZUNvbHVtbkZpbHRlcnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTGVzc0VxdWFsKGNvbEZpbHRlci5hdHRyLCBjb2xGaWx0ZXIudmFsdWVzKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5NT1JFX0VRVUFMOlxuICAgICAgICAgIGJlQ29sdW1uRmlsdGVycy5wdXNoKEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25Nb3JlRXF1YWwoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXMpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIC8vIEJ1aWxkIGNvbXBsZXRlIGNvbHVtbiBmaWx0ZXJzIGJhc2ljIGV4cHJlc3Npb25cbiAgICBsZXQgYmVDb2xGaWx0ZXI6IEV4cHJlc3Npb24gPSBiZUNvbHVtbkZpbHRlcnMucG9wKCk7XG4gICAgYmVDb2x1bW5GaWx0ZXJzLmZvckVhY2goYmUgPT4ge1xuICAgICAgYmVDb2xGaWx0ZXIgPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihiZUNvbEZpbHRlciwgYmUsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9BTkQpO1xuICAgIH0pO1xuICAgIHJldHVybiBiZUNvbEZpbHRlcjtcbiAgfVxuXG4gIHVwZGF0ZVBhZ2luYXRpb25JbmZvKHF1ZXJ5UmVzOiBhbnkpIHtcbiAgICBzdXBlci51cGRhdGVQYWdpbmF0aW9uSW5mbyhxdWVyeVJlcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0YShkYXRhOiBhbnksIHNxbFR5cGVzOiBhbnkpIHtcbiAgICB0aGlzLmRhb1RhYmxlLnNxbFR5cGVzQ2hhbmdlLm5leHQoc3FsVHlwZXMpO1xuICAgIHRoaXMuZGFvVGFibGUuc2V0RGF0YUFycmF5KGRhdGEpO1xuICAgIHRoaXMudXBkYXRlU2Nyb2xsZWRTdGF0ZSgpO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uUGFnaW5hdGVkRGF0YUxvYWRlZCwgZGF0YSk7XG4gICAgfVxuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25EYXRhTG9hZGVkLCB0aGlzLmRhb1RhYmxlLmRhdGEpO1xuICB9XG5cbiAgc2hvd0RpYWxvZ0Vycm9yKGVycm9yOiBzdHJpbmcsIGVycm9yT3B0aW9uYWw/OiBzdHJpbmcpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZXJyb3IpICYmICFVdGlsLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVycm9yT3B0aW9uYWwpO1xuICAgIH1cbiAgfVxuXG4gIHByb2plY3RDb250ZW50Q2hhbmdlZCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMubG9hZGluZ1NvcnRpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xuICAgIH0sIDUwMCk7XG4gICAgdGhpcy5sb2FkaW5nU2Nyb2xsU3ViamVjdC5uZXh0KGZhbHNlKTtcblxuICAgIGlmICh0aGlzLnByZXZpb3VzUmVuZGVyZXJEYXRhICE9PSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhKSB7XG4gICAgICB0aGlzLnByZXZpb3VzUmVuZGVyZXJEYXRhID0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YTtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Db250ZW50Q2hhbmdlLCB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0aW9uJykgJiYgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5sZW5ndGggPiAwICYmIHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZm9yRWFjaChzZWxlY3RlZEl0ZW0gPT4ge1xuICAgICAgICAvLyBmaW5kaW5nIHNlbGVjdGVkIGl0ZW0gZGF0YSBpbiB0aGUgdGFibGUgcmVuZGVyZWQgZGF0YVxuICAgICAgICBjb25zdCBmb3VuZEl0ZW0gPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmZpbmQoZGF0YSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgT2JqZWN0LmtleXMoc2VsZWN0ZWRJdGVtKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgJiYgKGRhdGFba2V5XSA9PT0gc2VsZWN0ZWRJdGVtW2tleV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZm91bmRJdGVtKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0KGZvdW5kSXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IGNvbHVtbnMgPSBzdXBlci5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9RdWVyeSgpO1xuICAgIGlmICh0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSBjb2x1bW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvbHVtbnNbaV07XG4gICAgICAgIGlmICh0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLmluZGV4T2YoY29sKSAhPT0gLTEpIHtcbiAgICAgICAgICBjb2x1bW5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIGdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlcjogb2JqZWN0LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogQXJyYXk8YW55PiB7XG4gICAgY29uc3QgcXVlcnlBcmd1bWVudHMgPSBzdXBlci5nZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXIsIG92cnJBcmdzKTtcbiAgICBxdWVyeUFyZ3VtZW50c1szXSA9IHRoaXMuZ2V0U3FsVHlwZXNGb3JGaWx0ZXIocXVlcnlBcmd1bWVudHNbMV0pO1xuICAgIE9iamVjdC5hc3NpZ24ocXVlcnlBcmd1bWVudHNbM10sIG92cnJBcmdzID8gb3ZyckFyZ3Muc3FsdHlwZXMgfHwge30gOiB7fSk7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHF1ZXJ5QXJndW1lbnRzWzVdID0gdGhpcy5wYWdpbmF0b3IuaXNTaG93aW5nQWxsUm93cyhxdWVyeUFyZ3VtZW50c1s1XSkgPyB0aGlzLnN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyIDogcXVlcnlBcmd1bWVudHNbNV07XG4gICAgICBxdWVyeUFyZ3VtZW50c1s2XSA9IHRoaXMuc29ydENvbEFycmF5O1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICBnZXRTcWxUeXBlc0ZvckZpbHRlcihmaWx0ZXIpOiBvYmplY3Qge1xuICAgIGNvbnN0IGFsbFNxbFR5cGVzID0ge307XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZvckVhY2goKGNvbDogT0NvbHVtbikgPT4ge1xuICAgICAgaWYgKGNvbC5zcWxUeXBlKSB7XG4gICAgICAgIGFsbFNxbFR5cGVzW2NvbC5hdHRyXSA9IGNvbC5zcWxUeXBlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5hc3NpZ24oYWxsU3FsVHlwZXMsIHRoaXMuZ2V0U3FsVHlwZXMoKSk7XG4gICAgY29uc3QgZmlsdGVyQ29scyA9IFV0aWwuZ2V0VmFsdWVzRnJvbU9iamVjdChmaWx0ZXIpO1xuICAgIGNvbnN0IHNxbFR5cGVzID0ge307XG4gICAgT2JqZWN0LmtleXMoYWxsU3FsVHlwZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChmaWx0ZXJDb2xzLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiYgYWxsU3FsVHlwZXNba2V5XSAhPT0gU1FMVHlwZXMuT1RIRVIpIHtcbiAgICAgICAgc3FsVHlwZXNba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNxbFR5cGVzO1xuICB9XG5cbiAgb25FeHBvcnRCdXR0b25DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkV4cG9ydEJ1dHRvbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZUNvbHVtbnNWaXNpYmlsaXR5Q2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25DaGFuZ2VDb2x1bW5zVmlzaWJpbGl0eUNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbk1hdFRhYmxlQ29udGVudENoYW5nZWQoKSB7XG4gICAgLy9cbiAgfVxuXG4gIGFkZCgpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLmluc2VydERldGFpbCgpO1xuICB9XG5cbiAgcmVtb3ZlKGNsZWFyU2VsZWN0ZWRJdGVtczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fREVMRVRFKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuQ09ORklSTV9ERUxFVEUnKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhU2VydmljZSAmJiAodGhpcy5kZWxldGVNZXRob2QgaW4gdGhpcy5kYXRhU2VydmljZSkgJiYgdGhpcy5lbnRpdHkgJiYgKHRoaXMua2V5c0FycmF5Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJzID0gU2VydmljZVV0aWxzLmdldEFycmF5UHJvcGVydGllcyhzZWxlY3RlZEl0ZW1zLCB0aGlzLmtleXNBcnJheSk7XG4gICAgICAgICAgICB0aGlzLmRhb1RhYmxlLnJlbW92ZVF1ZXJ5KGZpbHRlcnMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Sb3dEZWxldGVkLCBzZWxlY3RlZEl0ZW1zKTtcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nRXJyb3IoZXJyb3IsICdNRVNTQUdFUy5FUlJPUl9ERUxFVEUnKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVMb2NhbEl0ZW1zKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsZWFyU2VsZWN0ZWRJdGVtcykge1xuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfVxuXG4gIHNob3dBbmRTZWxlY3RBbGxDaGVja2JveCgpIHtcbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RBbGxDaGVja2JveCkge1xuICAgICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoZWNrYm94Q29sdW1uKCk7XG4gICAgICB0aGlzLnNlbGVjdEFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIC8vIEluaXRpYWxpemUgcGFnZSBpbmRleFxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDA7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICByZWxvYWREYXRhKCkge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1JFRlJFU0gpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdGF0ZSwgdGhpcy5vVGFibGVTdG9yYWdlLmdldFRhYmxlUHJvcGVydHlUb1N0b3JlKCdzZWxlY3Rpb24nKSk7XG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIHRoaXMuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICB0aGlzLnBlbmRpbmdRdWVyeSA9IHRydWU7XG4gICAgLy8gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbCA9IDE7XG4gICAgbGV0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3M7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHF1ZXJ5QXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiB0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MsXG4gICAgICAgIGxlbmd0aDogdGhpcy5xdWVyeVJvd3NcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZWRpdGluZ0NlbGwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soaXRlbTogYW55LCByb3dJbmRleDogbnVtYmVyLCAkZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLmNsaWNrVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5jbGlja1ByZXZlbnQpIHtcbiAgICAgICAgdGhpcy5kb0hhbmRsZUNsaWNrKGl0ZW0sIHJvd0luZGV4LCAkZXZlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGlja1ByZXZlbnQgPSBmYWxzZTtcbiAgICB9LCB0aGlzLmNsaWNrRGVsYXkpO1xuICB9XG5cbiAgZG9IYW5kbGVDbGljayhpdGVtOiBhbnksIHJvd0luZGV4OiBudW1iZXIsICRldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmICghdGhpcy5vZW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKHRoaXMuZGV0YWlsTW9kZSA9PT0gQ29kZXMuREVUQUlMX01PREVfQ0xJQ0spKSB7XG4gICAgICB0aGlzLm9uQ2xpY2suZW1pdCh7IHJvdzogaXRlbSwgcm93SW5kZXg6IHJvd0luZGV4LCBtb3VzZUV2ZW50OiAkZXZlbnQgfSk7XG4gICAgICB0aGlzLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcigpO1xuICAgICAgdGhpcy5zZWxlY3RlZFJvdyhpdGVtKTtcbiAgICAgIHRoaXMudmlld0RldGFpbChpdGVtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNTZWxlY3Rpb25Nb2RlTXVsdGlwbGUoKSAmJiAoJGV2ZW50LmN0cmxLZXkgfHwgJGV2ZW50Lm1ldGFLZXkpKSB7XG4gICAgICAvLyBUT0RPOiB0ZXN0ICRldmVudC5tZXRhS2V5IG9uIE1BQ1xuICAgICAgdGhpcy5zZWxlY3RlZFJvdyhpdGVtKTtcbiAgICAgIHRoaXMub25DbGljay5lbWl0KHsgcm93OiBpdGVtLCByb3dJbmRleDogcm93SW5kZXgsIG1vdXNlRXZlbnQ6ICRldmVudCB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTZWxlY3Rpb25Nb2RlTXVsdGlwbGUoKSAmJiAkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHRoaXMuaGFuZGxlTXVsdGlwbGVTZWxlY3Rpb24oaXRlbSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1NlbGVjdGlvbk1vZGVOb25lKCkpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKGl0ZW0pICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxICYmIHRoaXMuZWRpdGlvbkVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbkFuZEVkaXRpbmcoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VsZWN0ZWRSb3coaXRlbSk7XG4gICAgICB0aGlzLm9uQ2xpY2suZW1pdCh7IHJvdzogaXRlbSwgcm93SW5kZXg6IHJvd0luZGV4LCBtb3VzZUV2ZW50OiAkZXZlbnQgfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTXVsdGlwbGVTZWxlY3Rpb24oaXRlbTogYW55KSB7XG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGZpcnN0ID0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5pbmRleE9mKHRoaXMuc2VsZWN0aW9uLnNlbGVjdGVkWzBdKTtcbiAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmluZGV4T2YoaXRlbSk7XG4gICAgICBjb25zdCBpbmRleEZyb20gPSBNYXRoLm1pbihmaXJzdCwgbGFzdCk7XG4gICAgICBjb25zdCBpbmRleFRvID0gTWF0aC5tYXgoZmlyc3QsIGxhc3QpO1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5zbGljZShpbmRleEZyb20sIGluZGV4VG8gKyAxKS5mb3JFYWNoKGUgPT4gdGhpcy5zZWxlY3RlZFJvdyhlKSk7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ2xpY2ssIHRoaXMuc2VsZWN0aW9uLnNlbGVjdGVkKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgc3VwZXIuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICB0aGlzLnN0b3JlUGFnaW5hdGlvblN0YXRlID0gdHJ1ZTtcbiAgfVxuXG4gIGhhbmRsZURvdWJsZUNsaWNrKGl0ZW06IGFueSwgZXZlbnQ/KSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2xpY2tUaW1lcik7XG4gICAgdGhpcy5jbGlja1ByZXZlbnQgPSB0cnVlO1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Eb3VibGVDbGljaywgaXRlbSk7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgQ29kZXMuaXNEb3VibGVDbGlja01vZGUodGhpcy5kZXRhaWxNb2RlKSkge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBlZGl0aW9uRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLnNvbWUoaXRlbSA9PiBpdGVtLmVkaXRpbmcpO1xuICB9XG5cbiAgaGFuZGxlRE9NQ2xpY2soZXZlbnQpIHtcbiAgICBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVkaXRpb25FbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3ZlcmxheUNvbnRhaW5lciA9IGRvY3VtZW50LmJvZHkuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2RrLW92ZXJsYXktY29udGFpbmVyJylbMF07XG4gICAgaWYgKG92ZXJsYXlDb250YWluZXIgJiYgb3ZlcmxheUNvbnRhaW5lci5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFibGVDb250YWluZXIgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm8tdGFibGUtY29udGFpbmVyJyk7XG4gICAgY29uc3QgdGFibGVDb250ZW50ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vLXRhYmxlLWNvbnRhaW5lciB0YWJsZS5tYXQtdGFibGUnKTtcbiAgICBpZiAodGFibGVDb250YWluZXIgJiYgdGFibGVDb250ZW50ICYmIHRhYmxlQ29udGFpbmVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgJiYgIXRhYmxlQ29udGVudC5jb250YWlucyhldmVudC50YXJnZXQpKSB7XG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2VsbENsaWNrKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnksIGV2ZW50Pykge1xuICAgIGlmICh0aGlzLm9lbmFibGVkICYmIGNvbHVtbi5lZGl0b3JcbiAgICAgICYmICh0aGlzLmRldGFpbE1vZGUgIT09IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLKVxuICAgICAgJiYgKHRoaXMuZWRpdGlvbk1vZGUgPT09IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLKSkge1xuXG4gICAgICB0aGlzLmFjdGl2YXRlQ29sdW1uRWRpdGlvbihjb2x1bW4sIHJvdywgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNlbGxEb3VibGVDbGljayhjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55LCBldmVudD8pIHtcbiAgICBpZiAodGhpcy5vZW5hYmxlZCAmJiBjb2x1bW4uZWRpdG9yXG4gICAgICAmJiAoIUNvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHRoaXMuZGV0YWlsTW9kZSkpXG4gICAgICAmJiAoQ29kZXMuaXNEb3VibGVDbGlja01vZGUodGhpcy5lZGl0aW9uTW9kZSkpKSB7XG5cbiAgICAgIHRoaXMuYWN0aXZhdGVDb2x1bW5FZGl0aW9uKGNvbHVtbiwgcm93LCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFjdGl2YXRlQ29sdW1uRWRpdGlvbihjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55LCBldmVudD8pIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKGV2ZW50ICYmIGNvbHVtbi5lZGl0aW5nICYmIHRoaXMuZWRpdGluZ0NlbGwgPT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sdW1uUGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0T0NvbHVtblBlcm1pc3Npb25zKGNvbHVtbi5hdHRyKTtcbiAgICBpZiAoY29sdW1uUGVybWlzc2lvbnMuZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbnNvbGUud2FybihgJHtjb2x1bW4uYXR0cn0gZWRpdGlvbiBub3QgYWxsb3dlZCBkdWUgdG8gcGVybWlzc2lvbnNgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uQW5kRWRpdGluZygpO1xuICAgIHRoaXMuc2VsZWN0ZWRSb3cocm93KTtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIHRoaXMuZWRpdGluZ0NlbGwgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuICAgIH1cbiAgICBjb25zdCByb3dEYXRhID0ge307XG4gICAgdGhpcy5rZXlzQXJyYXkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICByb3dEYXRhW2tleV0gPSByb3dba2V5XTtcbiAgICB9KTtcbiAgICByb3dEYXRhW2NvbHVtbi5hdHRyXSA9IHJvd1tjb2x1bW4uYXR0cl07XG4gICAgdGhpcy5lZGl0aW5nUm93ID0gcm93O1xuICAgIGNvbHVtbi5lZGl0aW5nID0gdHJ1ZTtcbiAgICBjb2x1bW4uZWRpdG9yLnN0YXJ0RWRpdGlvbihyb3dEYXRhKTtcbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHVwZGF0ZUNlbGxEYXRhKGNvbHVtbjogT0NvbHVtbiwgZGF0YTogYW55LCBzYXZlQ2hhbmdlczogYm9vbGVhbikge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSkpIHtcbiAgICAgIGNvbnN0IHJlcyA9IG5ldyBPYnNlcnZhYmxlKGlubmVyT2JzZXJ2ZXIgPT4ge1xuICAgICAgICBpbm5lck9ic2VydmVyLmVycm9yKCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGNvbHVtbi5lZGl0aW5nID0gZmFsc2U7XG4gICAgdGhpcy5lZGl0aW5nQ2VsbCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoc2F2ZUNoYW5nZXMgJiYgdGhpcy5lZGl0aW5nUm93ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0aW5nUm93LCBkYXRhKTtcbiAgICB9XG4gICAgdGhpcy5lZGl0aW5nUm93ID0gdW5kZWZpbmVkO1xuICAgIGlmIChzYXZlQ2hhbmdlcyAmJiBjb2x1bW4uZWRpdG9yLnVwZGF0ZVJlY29yZE9uRWRpdCkge1xuICAgICAgY29uc3QgdG9VcGRhdGUgPSB7fTtcbiAgICAgIHRvVXBkYXRlW2NvbHVtbi5hdHRyXSA9IGRhdGFbY29sdW1uLmF0dHJdO1xuICAgICAgY29uc3Qga3YgPSB0aGlzLmV4dHJhY3RLZXlzRnJvbVJlY29yZChkYXRhKTtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVJlY29yZChrdiwgdG9VcGRhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEtleXNWYWx1ZXMoKTogYW55W10ge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmdldEFsbFZhbHVlcygpO1xuICAgIHJldHVybiBkYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIHRoaXMua2V5c0FycmF5LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAocm93W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG9ialtrZXldID0gcm93W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0pO1xuICB9XG5cbiAgb25TaG93c1NlbGVjdHMoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uU2hvd3NTZWxlY3RzKCk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUNoZWNrYm94Q29sdW1uKCkge1xuICAgIC8vIEluaXRpYWxpemluZyByb3cgc2VsZWN0aW9uIGxpc3RlbmVyXG4gICAgaWYgKCF0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbiAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmNoYW5nZWQuc3Vic2NyaWJlKChzZWxlY3Rpb25EYXRhOiBTZWxlY3Rpb25DaGFuZ2U8YW55PikgPT4ge1xuICAgICAgICBpZiAoc2VsZWN0aW9uRGF0YSAmJiBzZWxlY3Rpb25EYXRhLmFkZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uUm93U2VsZWN0ZWQsIHNlbGVjdGlvbkRhdGEuYWRkZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxlY3Rpb25EYXRhICYmIHNlbGVjdGlvbkRhdGEucmVtb3ZlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblJvd0Rlc2VsZWN0ZWQsIHNlbGVjdGlvbkRhdGEucmVtb3ZlZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbkNvbHVtblN0YXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlU2VsZWN0aW9uQ29sdW1uU3RhdGUoKSB7XG4gICAgaWYgKCF0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlKSB7XG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zICYmIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGVcbiAgICAgICYmIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnNbMF0gIT09IENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCkge1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy51bnNoaWZ0KENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zICYmICF0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlXG4gICAgICAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zWzBdID09PSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuc2hpZnQoKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVTdGF0ZUV4cGFuZGVkQ29sdW1uKCk7XG4gIH1cblxuICBwdWJsaWMgaXNBbGxTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCBudW1TZWxlY3RlZCA9IHRoaXMuc2VsZWN0aW9uLnNlbGVjdGVkLmxlbmd0aDtcbiAgICBjb25zdCBudW1Sb3dzID0gdGhpcy5kYXRhU291cmNlID8gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5sZW5ndGggOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIG51bVNlbGVjdGVkID4gMCAmJiBudW1TZWxlY3RlZCA9PT0gbnVtUm93cztcbiAgfVxuXG4gIHB1YmxpYyBtYXN0ZXJUb2dnbGUoZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlKTogdm9pZCB7XG4gICAgZXZlbnQuY2hlY2tlZCA/IHRoaXMuc2VsZWN0QWxsKCkgOiB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0QWxsKCk6IHZvaWQge1xuICAgIHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuZm9yRWFjaChyb3cgPT4gdGhpcy5zZWxlY3Rpb24uc2VsZWN0KHJvdykpO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdGlvbkNoZWNrYm94VG9nZ2xlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSwgcm93OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVTaW5nbGUoKSkge1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cbiAgICB0aGlzLnNlbGVjdGVkUm93KHJvdyk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0ZWRSb3cocm93OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNldFNlbGVjdGVkKHJvdyk7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBnZXQgc2hvd0RlbGV0ZUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kZWxldGVCdXR0b247XG4gIH1cblxuICBnZXRUcmFja0J5RnVuY3Rpb24oKTogKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gc3RyaW5nIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgIHJldHVybiAoaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSA9PiB7XG4gICAgICBpZiAoc2VsZi5oYXNTY3JvbGxhYmxlQ29udGFpbmVyKCkgJiYgaW5kZXggPCAoc2VsZi5wYWdlU2Nyb2xsVmlydHVhbCAtIDEpICogQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgbGV0IGl0ZW1JZDogc3RyaW5nID0gJyc7XG4gICAgICBjb25zdCBrZXlzTGVuZ2h0ID0gc2VsZi5rZXlzQXJyYXkubGVuZ3RoO1xuICAgICAgc2VsZi5rZXlzQXJyYXkuZm9yRWFjaCgoa2V5OiBzdHJpbmcsIGlkeDogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHN1ZmZpeCA9IGlkeCA8IChrZXlzTGVuZ2h0IC0gMSkgPyAnOycgOiAnJztcbiAgICAgICAgaXRlbUlkICs9IGl0ZW1ba2V5XSArIHN1ZmZpeDtcbiAgICAgIH0pO1xuXG5cbiAgICAgIGNvbnN0IGFzeW5jQW5kVmlzaWJsZSA9IHNlbGYuYXN5bmNMb2FkQ29sdW1ucy5maWx0ZXIoYyA9PiBzZWxmLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmluZGV4T2YoYykgIT09IC0xKTtcbiAgICAgIGlmIChzZWxmLmFzeW5jTG9hZENvbHVtbnMubGVuZ3RoICYmIGFzeW5jQW5kVmlzaWJsZS5sZW5ndGggPiAwICYmICFzZWxmLmZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHNlbGYucXVlcnlSb3dBc3luY0RhdGEoaW5kZXgsIGl0ZW0pO1xuICAgICAgICBpZiAoc2VsZi5wYWdpbmF0b3IgJiYgaW5kZXggPT09IChzZWxmLnBhZ2luYXRvci5wYWdlU2l6ZSAtIDEpKSB7XG4gICAgICAgICAgc2VsZi5maW5pc2hRdWVyeVN1YnNjcmlwdGlvbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW1JZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpdGVtSWQ7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHF1ZXJ5Um93QXN5bmNEYXRhKHJvd0luZGV4OiBudW1iZXIsIHJvd0RhdGE6IGFueSkge1xuICAgIGNvbnN0IGt2ID0gU2VydmljZVV0aWxzLmdldE9iamVjdFByb3BlcnRpZXMocm93RGF0YSwgdGhpcy5rZXlzQXJyYXkpO1xuICAgIC8vIFJlcGVhdGluZyBjaGVja2luZyBvZiB2aXNpYmxlIGNvbHVtblxuICAgIGNvbnN0IGF2ID0gdGhpcy5hc3luY0xvYWRDb2x1bW5zLmZpbHRlcihjID0+IHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuaW5kZXhPZihjKSAhPT0gLTEpO1xuICAgIGlmIChhdi5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIFNraXBwaW5nIHF1ZXJ5IGlmIHRoZXJlIGFyZSBub3QgdmlzaWJsZSBhc3luY3JvbiBjb2x1bW5zXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbHVtblF1ZXJ5QXJncyA9IFtrdiwgYXYsIHRoaXMuZW50aXR5LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWRdO1xuICAgIGNvbnN0IHF1ZXJ5TWV0aG9kTmFtZSA9IHRoaXMucGFnZWFibGUgPyB0aGlzLnBhZ2luYXRlZFF1ZXJ5TWV0aG9kIDogdGhpcy5xdWVyeU1ldGhvZDtcbiAgICBpZiAodGhpcy5kYXRhU2VydmljZSAmJiAocXVlcnlNZXRob2ROYW1lIGluIHRoaXMuZGF0YVNlcnZpY2UpICYmIHRoaXMuZW50aXR5KSB7XG4gICAgICBpZiAodGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW3Jvd0luZGV4XSkge1xuICAgICAgICB0aGlzLmFzeW5jTG9hZFN1YnNjcmlwdGlvbnNbcm93SW5kZXhdLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmFzeW5jTG9hZFN1YnNjcmlwdGlvbnNbcm93SW5kZXhdID0gdGhpcy5kYXRhU2VydmljZVtxdWVyeU1ldGhvZE5hbWVdXG4gICAgICAgIC5hcHBseSh0aGlzLmRhdGFTZXJ2aWNlLCBjb2x1bW5RdWVyeUFyZ3MpXG4gICAgICAgIC5zdWJzY3JpYmUoKHJlczogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcy5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgICBpZiAoVXRpbC5pc0FycmF5KHJlcy5kYXRhKSAmJiByZXMuZGF0YS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IHJlcy5kYXRhWzBdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChVdGlsLmlzT2JqZWN0KHJlcy5kYXRhKSkge1xuICAgICAgICAgICAgICBkYXRhID0gcmVzLmRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRhb1RhYmxlLnNldEFzeW5jaHJvbm91c0NvbHVtbihkYXRhLCByb3dEYXRhKTtcbiAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5nZXRDdXJyZW50RGF0YSgpO1xuICB9XG5cbiAgZ2V0QWxsVmFsdWVzKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UuZ2V0Q3VycmVudEFsbERhdGEoKTtcbiAgfVxuXG4gIGdldEFsbFJlbmRlcmVkVmFsdWVzKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UuZ2V0QWxsUmVuZGVyZXJEYXRhKCk7XG4gIH1cblxuICBnZXRSZW5kZXJlZFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UuZ2V0Q3VycmVudFJlbmRlcmVyRGF0YSgpO1xuICB9XG5cbiAgZ2V0U3FsVHlwZXMoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGF0YVNvdXJjZS5zcWxUeXBlcykgPyB0aGlzLmRhdGFTb3VyY2Uuc3FsVHlwZXMgOiB7fTtcbiAgfVxuXG4gIHNldE9UYWJsZUNvbHVtbnNGaWx0ZXIodGFibGVDb2x1bW5zRmlsdGVyOiBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50ID0gdGFibGVDb2x1bW5zRmlsdGVyO1xuICB9XG5cbiAgZ2V0IGZpbHRlckNvbHVtbnMoKSB7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykgJiZcbiAgICAgIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdmaWx0ZXItY29sdW1ucycpICYmXG4gICAgICB0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdmaWx0ZXItY29sdW1ucycpICYmXG4gICAgICB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnZmlsdGVyLWNvbHVtbnMnXSA9PT0gdGhpcy5vcmlnaW5hbEZpbHRlckNvbHVtbnMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdmaWx0ZXItY29sdW1ucycpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlWydmaWx0ZXItY29sdW1ucyddO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9yaWdpbmFsRmlsdGVyQ29sdW1ucztcbiAgfVxuXG4gIGdldCBvcmlnaW5hbEZpbHRlckNvbHVtbnMoKTogQXJyYXk8T0ZpbHRlckNvbHVtbj4ge1xuICAgIGxldCBzb3J0Q29sdW1uc0ZpbHRlciA9IFtdO1xuICAgIGlmICh0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQpIHtcbiAgICAgIHNvcnRDb2x1bW5zRmlsdGVyID0gdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmNvbHVtbnNBcnJheTtcbiAgICB9XG4gICAgcmV0dXJuIHNvcnRDb2x1bW5zRmlsdGVyO1xuICB9XG5cbiAgZ2V0U3RvcmVkQ29sdW1uc0ZpbHRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMub1RhYmxlU3RvcmFnZS5nZXRTdG9yZWRDb2x1bW5zRmlsdGVycygpO1xuICB9XG5cbiAgb25GaWx0ZXJCeUNvbHVtbkNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uRmlsdGVyQnlDb2x1bW5DbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgb25TdG9yZUZpbHRlckNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uU3RvcmVGaWx0ZXJDbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgb25Mb2FkRmlsdGVyQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25Mb2FkRmlsdGVyQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xlYXJGaWx0ZXJDbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkNsZWFyRmlsdGVyQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyRmlsdGVycyh0cmlnZ2VyRGF0YXNvdXJjZVVwZGF0ZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGFTb3VyY2UuY2xlYXJDb2x1bW5GaWx0ZXJzKHRyaWdnZXJEYXRhc291cmNlVXBkYXRlKTtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51ICYmIHRoaXMub1RhYmxlTWVudS5jb2x1bW5GaWx0ZXJPcHRpb24pIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5jb2x1bW5GaWx0ZXJPcHRpb24uc2V0QWN0aXZlKHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbik7XG4gICAgfVxuICAgIHRoaXMub25GaWx0ZXJCeUNvbHVtbkNoYW5nZS5lbWl0KHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKSk7XG4gICAgaWYgKHRoaXMub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQpIHtcbiAgICAgIHRoaXMub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQuc2V0VmFsdWUodm9pZCAwKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckNvbHVtbkZpbHRlcihhdHRyOiBzdHJpbmcsIHRyaWdnZXJEYXRhc291cmNlVXBkYXRlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuZGF0YVNvdXJjZS5jbGVhckNvbHVtbkZpbHRlcihhdHRyLCB0cmlnZ2VyRGF0YXNvdXJjZVVwZGF0ZSk7XG4gICAgdGhpcy5vbkZpbHRlckJ5Q29sdW1uQ2hhbmdlLmVtaXQodGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVycygpKTtcbiAgICB0aGlzLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgfVxuXG4gIGZpbHRlckJ5Q29sdW1uKGNvbHVtblZhbHVlRmlsdGVyOiBPQ29sdW1uVmFsdWVGaWx0ZXIpIHtcbiAgICB0aGlzLmRhdGFTb3VyY2UuYWRkQ29sdW1uRmlsdGVyKGNvbHVtblZhbHVlRmlsdGVyKTtcbiAgICB0aGlzLm9uRmlsdGVyQnlDb2x1bW5DaGFuZ2UuZW1pdCh0aGlzLmRhdGFTb3VyY2UuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJzKCkpO1xuICAgIHRoaXMucmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpO1xuICB9XG5cbiAgY2xlYXJDb2x1bW5GaWx0ZXJzKHRyaWdnZXJEYXRhc291cmNlVXBkYXRlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuZGF0YVNvdXJjZS5jbGVhckNvbHVtbkZpbHRlcnModHJpZ2dlckRhdGFzb3VyY2VVcGRhdGUpO1xuICAgIHRoaXMub25GaWx0ZXJCeUNvbHVtbkNoYW5nZS5lbWl0KHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKSk7XG4gICAgdGhpcy5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk7XG4gIH1cblxuICBpc0NvbHVtbkZpbHRlcmFibGUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW4uYXR0cikpO1xuICB9XG5cbiAgaXNNb2RlQ29sdW1uRmlsdGVyYWJsZShjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uICYmXG4gICAgICAodGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50ICYmIHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5pc0NvbHVtbkZpbHRlcmFibGUoY29sdW1uLmF0dHIpKTtcbiAgfVxuXG4gIGlzQ29sdW1uRmlsdGVyQWN0aXZlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gJiZcbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlckJ5QXR0cihjb2x1bW4uYXR0cikgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIG9wZW5Db2x1bW5GaWx0ZXJEaWFsb2coY29sdW1uOiBPQ29sdW1uLCBldmVudDogRXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IGRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT1RhYmxlRmlsdGVyQnlDb2x1bW5EYXRhRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHByZXZpb3VzRmlsdGVyOiB0aGlzLmRhdGFTb3VyY2UuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJCeUF0dHIoY29sdW1uLmF0dHIpLFxuICAgICAgICBjb2x1bW46IGNvbHVtbixcbiAgICAgICAgYWN0aXZlU29ydERpcmVjdGlvbjogdGhpcy5nZXRTb3J0RmlsdGVyQ29sdW1uKGNvbHVtbiksXG4gICAgICAgIHRhYmxlRGF0YTogdGhpcy5kYXRhU291cmNlLmdldFRhYmxlRGF0YSgpLFxuICAgICAgICBwcmVsb2FkVmFsdWVzOiB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQucHJlbG9hZFZhbHVlcyxcbiAgICAgICAgbW9kZTogdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50Lm1vZGVcbiAgICAgIH0sXG4gICAgICBtaW5XaWR0aDogJzM4MHB4JyxcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHBhbmVsQ2xhc3M6IFsnby1kaWFsb2ctY2xhc3MnLCAnby10YWJsZS1kaWFsb2cnXVxuICAgIH0pO1xuXG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBzd2l0Y2ggKHJlc3VsdCkge1xuICAgICAgICBjYXNlIFRhYmxlRmlsdGVyQnlDb2x1bW5EaWFsb2dSZXN1bHQuQUNDRVBUOlxuICAgICAgICAgIGNvbnN0IGNvbHVtblZhbHVlRmlsdGVyID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldENvbHVtblZhbHVlc0ZpbHRlcigpO1xuICAgICAgICAgIHRoaXMuZmlsdGVyQnlDb2x1bW4oY29sdW1uVmFsdWVGaWx0ZXIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFRhYmxlRmlsdGVyQnlDb2x1bW5EaWFsb2dSZXN1bHQuQ0xFQVI6XG4gICAgICAgICAgY29uc3QgY29sID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmNvbHVtbjtcbiAgICAgICAgICB0aGlzLmNsZWFyQ29sdW1uRmlsdGVyKGNvbC5hdHRyKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2Uub25Tb3J0RmlsdGVyVmFsdWVzQ2hhbmdlLnN1YnNjcmliZShzb3J0ZWRGaWx0ZXJhYmxlQ29sdW1uID0+IHtcbiAgICAgIC8vIGd1YXJkYXIgZW4gbG9jYWxzdG9yYWdlIGVsIGNhbWJpb1xuICAgICAgdGhpcy5zdG9yZUZpbHRlckNvbHVtbnMoc29ydGVkRmlsdGVyYWJsZUNvbHVtbik7XG4gICAgfSk7XG4gIH1cblxuICBzdG9yZUZpbHRlckNvbHVtbnMoc29ydENvbHVtbkZpbHRlcjogT0ZpbHRlckNvbHVtbikge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdmaWx0ZXItY29sdW1ucycpICYmIHRoaXMuc3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ10pIHtcbiAgICAgIGxldCBzdG9yZVNvcnRDb2x1bW5zRmlsdGVyU3RhdGUgPSB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0RmlsdGVyQ29sdW1uc1N0YXRlKCk7XG4gICAgICAvL2lmIGV4aXN0cyBpbiBzdGF0ZSB0aGVuIHVwZGF0ZWQgc29ydCB2YWx1ZVxuICAgICAgaWYgKHN0b3JlU29ydENvbHVtbnNGaWx0ZXJTdGF0ZVsnZmlsdGVyLWNvbHVtbnMnXS5maWx0ZXIoeCA9PiB4LmF0dHIgPT09IHNvcnRDb2x1bW5GaWx0ZXIuYXR0cikubGVuZ3RoID4gMCkge1xuICAgICAgICBzdG9yZVNvcnRDb2x1bW5zRmlsdGVyU3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ10uZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5hdHRyID09PSBzb3J0Q29sdW1uRmlsdGVyLmF0dHIpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc29ydCA9IHNvcnRDb2x1bW5GaWx0ZXIuc29ydDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9lbHNlIGV4aXN0cyBpbiBzdGF0ZSB0aGVuIGFkZGVkIGZpbHRlciBjb2x1bW5cbiAgICAgICAgc3RvcmVTb3J0Q29sdW1uc0ZpbHRlclN0YXRlWydmaWx0ZXItY29sdW1ucyddLnB1c2goc29ydENvbHVtbkZpbHRlcik7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXRlWydmaWx0ZXItY29sdW1ucyddID0gc3RvcmVTb3J0Q29sdW1uc0ZpbHRlclN0YXRlWydmaWx0ZXItY29sdW1ucyddO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlWydmaWx0ZXItY29sdW1ucyddID0gdGhpcy5maWx0ZXJDb2x1bW5zO1xuICAgIH1cblxuICB9XG5cbiAgZ2V0U29ydEZpbHRlckNvbHVtbihjb2x1bW46IE9Db2x1bW4pOiBzdHJpbmcge1xuICAgIGxldCBzb3J0Q29sdW1uO1xuICAgIC8vIGF0IGZpcnN0LCBnZXQgc3RhdGUgaW4gbG9jYWxzdG9yYWdlXG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW5zJykpIHtcbiAgICAgIHRoaXMuc3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ10uZm9yRWFjaCgoZWxlbWVudDogT0ZpbHRlckNvbHVtbikgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5hdHRyID09PSBjb2x1bW4uYXR0cikge1xuICAgICAgICAgIHNvcnRDb2x1bW4gPSBlbGVtZW50LnNvcnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vaWYgbm90IHZhbHVlIGluIGxvY2Fsc3RvcmFnZSwgZ2V0IHNvcnQgdmFsdWUgaW4gby10YWJsZS1jb2x1bW4tZmlsdGVyLWNvbHVtbiBjb21wb25lbnRcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHNvcnRDb2x1bW4pICYmIHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgc29ydENvbHVtbiA9IHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5nZXRTb3J0VmFsdWVPZkZpbHRlckNvbHVtbihjb2x1bW4uYXR0cik7XG4gICAgfVxuXG4gICAgLy9pZiBlaXRoZXIgdmFsdWUgaW4gby10YWJsZS1jb2x1bW4tZmlsdGVyLWNvbHVtbiBvciBsb2NhbHN0b3JhZ2UsIGdldCBzb3J0IHZhbHVlIGluIHNvcnRDb2xBcnJheVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc29ydENvbHVtbikpIHtcbiAgICAgIGlmICh0aGlzLnNvcnRDb2xBcnJheS5maW5kKHggPT4geC5jb2x1bW5OYW1lID09PSBjb2x1bW4uYXR0cikpIHtcbiAgICAgICAgc29ydENvbHVtbiA9IHRoaXMuaXNDb2x1bW5Tb3J0QWN0aXZlKGNvbHVtbikgPyAnYXNjJyA6ICdkZXNjJ1xuICAgICAgfVxuICAgIH1cblxuXG5cbiAgICByZXR1cm4gc29ydENvbHVtbjtcbiAgfVxuXG4gIGdldCBkaXNhYmxlVGFibGVNZW51QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLnBlcm1pc3Npb25zICYmIHRoaXMucGVybWlzc2lvbnMubWVudSAmJiB0aGlzLnBlcm1pc3Npb25zLm1lbnUuZW5hYmxlZCA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dUYWJsZU1lbnVCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGVybWlzc2lvbkhpZGRlbiA9ICEhKHRoaXMucGVybWlzc2lvbnMgJiYgdGhpcy5wZXJtaXNzaW9ucy5tZW51ICYmIHRoaXMucGVybWlzc2lvbnMubWVudS52aXNpYmxlID09PSBmYWxzZSk7XG4gICAgaWYgKHBlcm1pc3Npb25IaWRkZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdGljT3B0ID0gdGhpcy5zZWxlY3RBbGxDaGVja2JveCB8fCB0aGlzLmV4cG9ydEJ1dHRvbiB8fCB0aGlzLnNob3dDb25maWd1cmF0aW9uT3B0aW9uIHx8IHRoaXMuY29sdW1uc1Zpc2liaWxpdHlCdXR0b24gfHwgKHRoaXMuc2hvd0ZpbHRlck9wdGlvbiAmJiB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgIT09IHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIHN0YXRpY09wdCB8fCB0aGlzLnRhYmxlT3B0aW9ucy5sZW5ndGggPiAwO1xuICB9XG5cbiAgc2V0T1RhYmxlSW5zZXJ0YWJsZVJvdyh0YWJsZUluc2VydGFibGVSb3c6IE9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQpIHtcbiAgICBjb25zdCBpbnNlcnRQZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldEFjdGlvblBlcm1pc3Npb25zKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0lOU0VSVCk7XG4gICAgaWYgKGluc2VydFBlcm0udmlzaWJsZSkge1xuICAgICAgdGFibGVJbnNlcnRhYmxlUm93LmVuYWJsZWQgPSBpbnNlcnRQZXJtLmVuYWJsZWQ7XG4gICAgICB0aGlzLm9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQgPSB0YWJsZUluc2VydGFibGVSb3c7XG4gICAgICB0aGlzLnNob3dGaXJzdEluc2VydGFibGVSb3cgPSB0aGlzLm9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQuaXNGaXJzdFJvdygpO1xuICAgICAgdGhpcy5zaG93TGFzdEluc2VydGFibGVSb3cgPSAhdGhpcy5zaG93Rmlyc3RJbnNlcnRhYmxlUm93O1xuICAgICAgdGhpcy5vVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50LmluaXRpYWxpemVFZGl0b3JzKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJTZWxlY3Rpb25BbmRFZGl0aW5nKCkge1xuICAgIHRoaXMuc2VsZWN0aW9uLmNsZWFyKCk7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpdGVtLmVkaXRpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIHVzZURldGFpbEJ1dHRvbihjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY29sdW1uLnR5cGUgPT09ICdlZGl0QnV0dG9uSW5Sb3cnIHx8IGNvbHVtbi50eXBlID09PSAnZGV0YWlsQnV0dG9uSW5Sb3cnO1xuICB9XG5cbiAgb25EZXRhaWxCdXR0b25DbGljayhjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55LCBldmVudDogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzd2l0Y2ggKGNvbHVtbi50eXBlKSB7XG4gICAgICBjYXNlICdlZGl0QnV0dG9uSW5Sb3cnOlxuICAgICAgICB0aGlzLmVkaXREZXRhaWwocm93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZXRhaWxCdXR0b25JblJvdyc6XG4gICAgICAgIHRoaXMudmlld0RldGFpbChyb3cpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBnZXREZXRhaWxCdXR0b25JY29uKGNvbHVtbjogT0NvbHVtbikge1xuICAgIGxldCByZXN1bHQgPSAnJztcbiAgICBzd2l0Y2ggKGNvbHVtbi50eXBlKSB7XG4gICAgICBjYXNlICdlZGl0QnV0dG9uSW5Sb3cnOlxuICAgICAgICByZXN1bHQgPSB0aGlzLmVkaXRCdXR0b25JblJvd0ljb247XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGV0YWlsQnV0dG9uSW5Sb3cnOlxuICAgICAgICByZXN1bHQgPSB0aGlzLmRldGFpbEJ1dHRvbkluUm93SWNvbjtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB1c2VQbGFpblJlbmRlcihjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnVzZURldGFpbEJ1dHRvbihjb2x1bW4pICYmICFjb2x1bW4ucmVuZGVyZXIgJiYgKCFjb2x1bW4uZWRpdG9yIHx8ICghY29sdW1uLmVkaXRpbmcgfHwgIXRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQocm93KSkpO1xuICB9XG5cbiAgdXNlQ2VsbFJlbmRlcmVyKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gY29sdW1uLnJlbmRlcmVyICYmICghY29sdW1uLmVkaXRpbmcgfHwgY29sdW1uLmVkaXRpbmcgJiYgIXRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQocm93KSk7XG4gIH1cblxuICB1c2VDZWxsRWRpdG9yKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnkpOiBib29sZWFuIHtcbiAgICAvLyBUT0RPIEFkZCBjb2x1bW4uZWRpdG9yIGluc3RhbmNlb2YgT1RhYmxlQ2VsbEVkaXRvckJvb2xlYW5Db21wb25lbnQgdG8gY29uZGl0aW9uXG4gICAgaWYgKGNvbHVtbi5lZGl0b3IgJiYgY29sdW1uLmVkaXRvci5hdXRvQ29tbWl0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjb2x1bW4uZWRpdG9yICYmIGNvbHVtbi5lZGl0aW5nICYmIHRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQocm93KTtcbiAgfVxuXG4gIGlzU2VsZWN0aW9uTW9kZU11bHRpcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT09IENvZGVzLlNFTEVDVElPTl9NT0RFX01VTFRJUExFO1xuICB9XG5cbiAgaXNTZWxlY3Rpb25Nb2RlU2luZ2xlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT09IENvZGVzLlNFTEVDVElPTl9NT0RFX1NJTkdMRTtcbiAgfVxuXG4gIGlzU2VsZWN0aW9uTW9kZU5vbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gQ29kZXMuU0VMRUNUSU9OX01PREVfTk9ORTtcbiAgfVxuXG4gIG9uQ2hhbmdlUGFnZShldnQ6IFBhZ2VFdmVudCkge1xuICAgIHRoaXMuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICBpZiAoIXRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBldnQucGFnZUluZGV4O1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0YWJsZVN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGdvaW5nQmFjayA9IGV2dC5wYWdlSW5kZXggPCB0aGlzLmN1cnJlbnRQYWdlO1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSBldnQucGFnZUluZGV4O1xuICAgIGNvbnN0IHBhZ2VTaXplID0gdGhpcy5wYWdpbmF0b3IuaXNTaG93aW5nQWxsUm93cyhldnQucGFnZVNpemUpID8gdGFibGVTdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciA6IGV2dC5wYWdlU2l6ZTtcblxuICAgIGNvbnN0IG9sZFF1ZXJ5Um93cyA9IHRoaXMucXVlcnlSb3dzO1xuICAgIGNvbnN0IGNoYW5naW5nUGFnZVNpemUgPSAob2xkUXVlcnlSb3dzICE9PSBwYWdlU2l6ZSk7XG4gICAgdGhpcy5xdWVyeVJvd3MgPSBwYWdlU2l6ZTtcblxuICAgIGxldCBuZXdTdGFydFJlY29yZDtcbiAgICBsZXQgcXVlcnlMZW5ndGg7XG5cbiAgICBpZiAoZ29pbmdCYWNrIHx8IGNoYW5naW5nUGFnZVNpemUpIHtcbiAgICAgIG5ld1N0YXJ0UmVjb3JkID0gKHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cyk7XG4gICAgICBxdWVyeUxlbmd0aCA9IHRoaXMucXVlcnlSb3dzO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTdGFydFJlY29yZCA9IE1hdGgubWF4KHRhYmxlU3RhdGUucXVlcnlSZWNvcmRPZmZzZXQsICh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MpKTtcbiAgICAgIGNvbnN0IG5ld0VuZFJlY29yZCA9IE1hdGgubWluKG5ld1N0YXJ0UmVjb3JkICsgdGhpcy5xdWVyeVJvd3MsIHRhYmxlU3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIpO1xuICAgICAgcXVlcnlMZW5ndGggPSBNYXRoLm1pbih0aGlzLnF1ZXJ5Um93cywgbmV3RW5kUmVjb3JkIC0gbmV3U3RhcnRSZWNvcmQpO1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3MgPSB7XG4gICAgICBvZmZzZXQ6IG5ld1N0YXJ0UmVjb3JkLFxuICAgICAgbGVuZ3RoOiBxdWVyeUxlbmd0aFxuICAgIH07XG4gICAgdGhpcy5maW5pc2hRdWVyeVN1YnNjcmlwdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgfVxuXG4gIGdldE9Db2x1bW4oYXR0cjogc3RyaW5nKTogT0NvbHVtbiB7XG4gICAgcmV0dXJuIHRoaXMuX29UYWJsZU9wdGlvbnMgPyB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gYXR0cikgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBpbnNlcnRSZWNvcmQocmVjb3JkRGF0YTogYW55LCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fSU5TRVJUKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChzcWxUeXBlcykpIHtcbiAgICAgIGNvbnN0IGFsbFNxbFR5cGVzID0gdGhpcy5nZXRTcWxUeXBlcygpO1xuICAgICAgc3FsVHlwZXMgPSB7fTtcbiAgICAgIE9iamVjdC5rZXlzKHJlY29yZERhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgc3FsVHlwZXNba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGFvVGFibGUuaW5zZXJ0UXVlcnkocmVjb3JkRGF0YSwgc3FsVHlwZXMpO1xuICB9XG5cbiAgdXBkYXRlUmVjb3JkKGZpbHRlcjogYW55LCB1cGRhdGVEYXRhOiBhbnksIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUpKSB7XG4gICAgICByZXR1cm4gb2YodGhpcy5kYXRhU291cmNlLmRhdGEpO1xuICAgIH1cbiAgICBjb25zdCBzcWxUeXBlc0FyZyA9IHNxbFR5cGVzIHx8IHt9O1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc3FsVHlwZXMpKSB7XG4gICAgICBjb25zdCBhbGxTcWxUeXBlcyA9IHRoaXMuZ2V0U3FsVHlwZXMoKTtcbiAgICAgIE9iamVjdC5rZXlzKGZpbHRlcikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBzcWxUeXBlc0FyZ1trZXldID0gYWxsU3FsVHlwZXNba2V5XTtcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmtleXModXBkYXRlRGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBzcWxUeXBlc0FyZ1trZXldID0gYWxsU3FsVHlwZXNba2V5XTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kYW9UYWJsZS51cGRhdGVRdWVyeShmaWx0ZXIsIHVwZGF0ZURhdGEsIHNxbFR5cGVzQXJnKTtcbiAgfVxuXG4gIGdldERhdGFBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYW9UYWJsZS5kYXRhO1xuICB9XG5cbiAgc2V0RGF0YUFycmF5KGRhdGE6IEFycmF5PGFueT4pIHtcbiAgICBpZiAodGhpcy5kYW9UYWJsZSkge1xuICAgICAgLy8gcmVtb3RlIHBhZ2luYXRpb24gaGFzIG5vIHNlbnNlIHdoZW4gdXNpbmcgc3RhdGljLWRhdGFcbiAgICAgIHRoaXMucGFnZWFibGUgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhdGljRGF0YSA9IGRhdGE7XG4gICAgICB0aGlzLmRhb1RhYmxlLnVzaW5nU3RhdGljRGF0YSA9IHRydWU7XG4gICAgICB0aGlzLmRhb1RhYmxlLnNldERhdGFBcnJheSh0aGlzLnN0YXRpY0RhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBkZWxldGVMb2NhbEl0ZW1zKCkge1xuICAgIGNvbnN0IGRhdGFBcnJheSA9IHRoaXMuZ2V0RGF0YUFycmF5KCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIHNlbGVjdGVkSXRlbXMuZm9yRWFjaCgoc2VsZWN0ZWRJdGVtOiBhbnkpID0+IHtcbiAgICAgIGZvciAobGV0IGogPSBkYXRhQXJyYXkubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgaWYgKFV0aWwuZXF1YWxzKHNlbGVjdGVkSXRlbSwgZGF0YUFycmF5W2pdKSkge1xuICAgICAgICAgIGRhdGFBcnJheS5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgdGhpcy5zZXREYXRhQXJyYXkoZGF0YUFycmF5KTtcbiAgfVxuXG4gIGlzQ29sdW1uU29ydEFjdGl2ZShjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuc29ydENvbEFycmF5LmZpbmQoc29ydEMgPT4gc29ydEMuY29sdW1uTmFtZSA9PT0gY29sdW1uLmF0dHIpO1xuICAgIHJldHVybiBmb3VuZCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaXNDb2x1bW5EZXNjU29ydEFjdGl2ZShjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBmb3VuZCA9IHRoaXMuc29ydENvbEFycmF5LmZpbmQoc29ydEMgPT4gc29ydEMuY29sdW1uTmFtZSA9PT0gY29sdW1uLmF0dHIgJiYgIXNvcnRDLmFzY2VuZGVudCk7XG4gICAgcmV0dXJuIGZvdW5kICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBoYXNUYWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaXNFbXB0eSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgfHwgKCh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSAmJiAhdmFsdWUpO1xuICB9XG5cbiAgc2V0RmlsdGVyc0NvbmZpZ3VyYXRpb24oY29uZjogYW55KSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBmaWx0ZXJDYXNlU2Vuc2l0aXZlXG5cbiAgICAvKlxuICAgICAgQ2hlY2tpbmcgdGhlIG9yaWdpbmFsIGZpbHRlckNhc2VTZW5zaXRpdmUgd2l0aCB0aGUgZmlsdGVyQ2FzZVNlbnNpdGl2ZSBpbiBpbml0aWFsIGNvbmZpZ3VyYXRpb24gaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgaWYgZmlsdGVyQ2FzZVNlbnNpdGl2ZSBpbiBpbml0aWFsIGNvbmZpZ3VyYXRpb24gaXMgZXF1YWxzIHRvIG9yaWdpbmFsIGZpbHRlckNhc2VTZW5zaXRpdmUgaW5wdXRcbiAgICAgIGZpbHRlckNhc2VTZW5zaXRpdmUgd2lsbCBiZSB0aGUgdmFsdWUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICovXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSkgJiYgdGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykgJiZcbiAgICAgIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdmaWx0ZXItY2FzZS1zZW5zaXRpdmUnKSAmJlxuICAgICAgdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlID09PSBjb25mWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJ10pIHtcbiAgICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9IGNvbmYuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZScpID8gY29uZlsnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJ10gOiB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmU7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcmVkQ29sdW1uRmlsdGVycyA9IHRoaXMub1RhYmxlU3RvcmFnZS5nZXRTdG9yZWRDb2x1bW5zRmlsdGVycyhjb25mKTtcblxuXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0KSAmJiB0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSAmJlxuICAgICAgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW4tYWN0aXZlLWJ5LWRlZmF1bHQnKSAmJlxuICAgICAgdGhpcy5vcmlnaW5hbEZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdCAhPT0gY29uZlsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ2ZpbHRlci1jb2x1bW4tYWN0aXZlLWJ5LWRlZmF1bHQnXSkge1xuICAgICAgdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gdGhpcy5vcmlnaW5hbEZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0U3RhdGUgPSBjb25mLmhhc093blByb3BlcnR5KCdmaWx0ZXItY29sdW1uLWFjdGl2ZS1ieS1kZWZhdWx0JykgPyBjb25mWydmaWx0ZXItY29sdW1uLWFjdGl2ZS1ieS1kZWZhdWx0J10gOiB0aGlzLmZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdDtcbiAgICAgIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9IGZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdFN0YXRlIHx8IHN0b3JlZENvbHVtbkZpbHRlcnMubGVuZ3RoID4gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vVGFibGVNZW51ICYmIHRoaXMub1RhYmxlTWVudS5jb2x1bW5GaWx0ZXJPcHRpb24pIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5jb2x1bW5GaWx0ZXJPcHRpb24uc2V0QWN0aXZlKHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgdGhpcy5kYXRhU291cmNlLmluaXRpYWxpemVDb2x1bW5zRmlsdGVycyhzdG9yZWRDb2x1bW5GaWx0ZXJzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5zZXRWYWx1ZShjb25mLmZpbHRlcik7XG4gICAgICBjb25zdCBzdG9yZWRDb2x1bW5zRGF0YSA9IGNvbmYub0NvbHVtbnMgfHwgW107XG4gICAgICBzdG9yZWRDb2x1bW5zRGF0YS5mb3JFYWNoKChvQ29sRGF0YTogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IG9Db2wgPSB0aGlzLmdldE9Db2x1bW4ob0NvbERhdGEuYXR0cik7XG4gICAgICAgIGlmIChvQ29sKSB7XG4gICAgICAgICAgaWYgKG9Db2xEYXRhLmhhc093blByb3BlcnR5KCdzZWFyY2hpbmcnKSkge1xuICAgICAgICAgICAgb0NvbC5zZWFyY2hpbmcgPSBvQ29sRGF0YS5zZWFyY2hpbmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvblN0b3JlQ29uZmlndXJhdGlvbkNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uU3RvcmVDb25maWd1cmF0aW9uQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uQXBwbHlDb25maWd1cmF0aW9uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25BcHBseUNvbmZpZ3VyYXRpb25DbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgYXBwbHlEZWZhdWx0Q29uZmlndXJhdGlvbigpIHtcbiAgICB0aGlzLm9UYWJsZVN0b3JhZ2UucmVzZXQoKTtcbiAgICB0aGlzLmluaXRpYWxpemVQYXJhbXMoKTtcbiAgICB0aGlzLnBhcnNlVmlzaWJsZUNvbHVtbnMoKTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihhLmF0dHIpIC0gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihiLmF0dHIpKTtcbiAgICB0aGlzLmluc2lkZVRhYkJ1Z1dvcmthcm91bmQoKTtcbiAgICB0aGlzLm9uUmVpbml0aWFsaXplLmVtaXQobnVsbCk7XG4gICAgdGhpcy5jbGVhckZpbHRlcnMoZmFsc2UpO1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgYXBwbHlDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25OYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzdG9yZWRDb25maWd1cmF0aW9uID0gdGhpcy5vVGFibGVTdG9yYWdlLmdldFN0b3JlZENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbk5hbWUpO1xuICAgIGlmIChzdG9yZWRDb25maWd1cmF0aW9uKSB7XG4gICAgICBjb25zdCBwcm9wZXJ0aWVzID0gc3RvcmVkQ29uZmlndXJhdGlvbltPVGFibGVTdG9yYWdlLlNUT1JFRF9QUk9QRVJUSUVTX0tFWV0gfHwgW107XG4gICAgICBjb25zdCBjb25mID0gc3RvcmVkQ29uZmlndXJhdGlvbltPVGFibGVTdG9yYWdlLlNUT1JFRF9DT05GSUdVUkFUSU9OX0tFWV07XG4gICAgICBwcm9wZXJ0aWVzLmZvckVhY2gocHJvcGVydHkgPT4ge1xuICAgICAgICBzd2l0Y2ggKHByb3BlcnR5KSB7XG4gICAgICAgICAgY2FzZSAnc29ydCc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlWydzb3J0LWNvbHVtbnMnXSA9IGNvbmZbJ3NvcnQtY29sdW1ucyddO1xuICAgICAgICAgICAgdGhpcy5wYXJzZVNvcnRDb2x1bW5zKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdjb2x1bW5zLWRpc3BsYXknOlxuICAgICAgICAgICAgdGhpcy5zdGF0ZVsnb0NvbHVtbnMtZGlzcGxheSddID0gY29uZlsnb0NvbHVtbnMtZGlzcGxheSddO1xuICAgICAgICAgICAgdGhpcy5wYXJzZVZpc2libGVDb2x1bW5zKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlWydzZWxlY3QtY29sdW1uLXZpc2libGUnXSA9IGNvbmZbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddO1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3F1aWNrLWZpbHRlcic6XG4gICAgICAgICAgY2FzZSAnY29sdW1ucy1maWx0ZXInOlxuICAgICAgICAgICAgdGhpcy5zZXRGaWx0ZXJzQ29uZmlndXJhdGlvbihjb25mKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3BhZ2UnOlxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSA9IGNvbmYuY3VycmVudFBhZ2U7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gY29uZi5jdXJyZW50UGFnZTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgPSBjb25mLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyO1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0ID0gY29uZi5xdWVyeVJlY29yZE9mZnNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucXVlcnlSb3dzID0gY29uZlsncXVlcnktcm93cyddO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGl0bGVBbGlnbkNsYXNzKG9Db2w6IE9Db2x1bW4pIHtcbiAgICBsZXQgYWxpZ247XG4gICAgY29uc3QgaGFzVGl0bGVBbGlnbiA9IFV0aWwuaXNEZWZpbmVkKG9Db2wuZGVmaW5pdGlvbikgJiYgVXRpbC5pc0RlZmluZWQob0NvbC5kZWZpbml0aW9uLnRpdGxlQWxpZ24pO1xuICAgIGNvbnN0IGF1dG9BbGlnbiA9ICh0aGlzLmF1dG9BbGlnblRpdGxlcyAmJiAhaGFzVGl0bGVBbGlnbikgfHwgKGhhc1RpdGxlQWxpZ24gJiYgb0NvbC5kZWZpbml0aW9uLnRpdGxlQWxpZ24gPT09IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9BVVRPKTtcbiAgICBpZiAoIWF1dG9BbGlnbikge1xuICAgICAgcmV0dXJuIG9Db2wuZ2V0VGl0bGVBbGlnbkNsYXNzKCk7XG4gICAgfVxuICAgIHN3aXRjaCAob0NvbC50eXBlKSB7XG4gICAgICBjYXNlICdpbWFnZSc6XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgIGNhc2UgJ2FjdGlvbic6XG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgYWxpZ24gPSBDb2Rlcy5DT0xVTU5fVElUTEVfQUxJR05fQ0VOVEVSO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2N1cnJlbmN5JzpcbiAgICAgIGNhc2UgJ2ludGVnZXInOlxuICAgICAgY2FzZSAncmVhbCc6XG4gICAgICBjYXNlICdwZXJjZW50YWdlJzpcbiAgICAgICAgYWxpZ24gPSBDb2Rlcy5DT0xVTU5fVElUTEVfQUxJR05fRU5EO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NlcnZpY2UnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYWxpZ24gPSBDb2Rlcy5DT0xVTU5fVElUTEVfQUxJR05fU1RBUlQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gYWxpZ247XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VsbEFsaWduQ2xhc3MoY29sdW1uOiBPQ29sdW1uKTogc3RyaW5nIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQoY29sdW1uLmRlZmluaXRpb24pICYmIFV0aWwuaXNEZWZpbmVkKGNvbHVtbi5kZWZpbml0aW9uLmNvbnRlbnRBbGlnbikgPyAnby0nICsgY29sdW1uLmRlZmluaXRpb24uY29udGVudEFsaWduIDogJyc7XG4gIH1cblxuICBvblRhYmxlU2Nyb2xsKGUpIHtcbiAgICBpZiAodGhpcy5oYXNTY3JvbGxhYmxlQ29udGFpbmVyKCkpIHtcbiAgICAgIGNvbnN0IHRhYmxlVmlld0hlaWdodCA9IGUudGFyZ2V0Lm9mZnNldEhlaWdodDsgLy8gdmlld3BvcnQ6IH41MDBweFxuICAgICAgY29uc3QgdGFibGVTY3JvbGxIZWlnaHQgPSBlLnRhcmdldC5zY3JvbGxIZWlnaHQ7IC8vIGxlbmd0aCBvZiBhbGwgdGFibGVcbiAgICAgIGNvbnN0IHNjcm9sbExvY2F0aW9uID0gZS50YXJnZXQuc2Nyb2xsVG9wOyAvLyBob3cgZmFyIHVzZXIgc2Nyb2xsZWRcblxuICAgICAgLy8gSWYgdGhlIHVzZXIgaGFzIHNjcm9sbGVkIHdpdGhpbiAyMDBweCBvZiB0aGUgYm90dG9tLCBhZGQgbW9yZSBkYXRhXG4gICAgICBjb25zdCBidWZmZXIgPSAxMDA7XG4gICAgICBjb25zdCBsaW1pdF9TQ1JPTExWSVJUVUFMID0gdGFibGVTY3JvbGxIZWlnaHQgLSB0YWJsZVZpZXdIZWlnaHQgLSBidWZmZXI7XG4gICAgICBpZiAoc2Nyb2xsTG9jYXRpb24gPiBsaW1pdF9TQ1JPTExWSVJUVUFMKSB7XG4gICAgICAgIHRoaXMuZ2V0RGF0YVNjcm9sbGFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXREYXRhU2Nyb2xsYWJsZSgpOiBhbnkge1xuICAgIGNvbnN0IHBhZ2VWaXJ0dWFsQmVmb3JlID0gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbDtcbiAgICBjb25zdCBwYWdlVmlydHVhbEVuZCA9IE1hdGguY2VpbCh0aGlzLmRhdGFTb3VyY2UucmVzdWx0c0xlbmd0aCAvIENvZGVzLkxJTUlUX1NDUk9MTFZJUlRVQUwpO1xuXG4gICAgaWYgKHBhZ2VWaXJ0dWFsRW5kICE9PSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsKSB7XG4gICAgICB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsKys7XG4gICAgfVxuXG4gICAgLy8gdGhyb3cgZXZlbnQgY2hhbmdlIHNjcm9sbFxuICAgIGlmIChwYWdlVmlydHVhbEJlZm9yZSAhPT0gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbCkge1xuICAgICAgdGhpcy5sb2FkaW5nU2Nyb2xsU3ViamVjdC5uZXh0KHRydWUpO1xuICAgICAgdGhpcy5kYXRhU291cmNlLmxvYWREYXRhU2Nyb2xsYWJsZSA9IHRoaXMucGFnZVNjcm9sbFZpcnR1YWw7XG4gICAgfVxuICB9XG5cbiAgaGFzU2Nyb2xsYWJsZUNvbnRhaW5lcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlICYmICF0aGlzLnBhZ2luYXRpb25Db250cm9scyAmJiAhdGhpcy5wYWdlYWJsZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhZGREZWZhdWx0Um93QnV0dG9ucygpIHtcbiAgICAvLyBjaGVjayBwZXJtaXNzaW9uc1xuICAgIGlmICh0aGlzLmVkaXRCdXR0b25JblJvdykge1xuICAgICAgdGhpcy5hZGRCdXR0b25JblJvdygnZWRpdEJ1dHRvbkluUm93Jyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmRldGFpbEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLmFkZEJ1dHRvbkluUm93KCdkZXRhaWxCdXR0b25JblJvdycpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhZGRCdXR0b25JblJvdyhuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBjb2xEZWY6IE9Db2x1bW4gPSB0aGlzLmNyZWF0ZU9Db2x1bW4obmFtZSwgdGhpcyk7XG4gICAgY29sRGVmLnR5cGUgPSBuYW1lO1xuICAgIGNvbERlZi52aXNpYmxlID0gdHJ1ZTtcbiAgICBjb2xEZWYuc2VhcmNoYWJsZSA9IGZhbHNlO1xuICAgIGNvbERlZi5vcmRlcmFibGUgPSBmYWxzZTtcbiAgICBjb2xEZWYucmVzaXphYmxlID0gZmFsc2U7XG4gICAgY29sRGVmLnRpdGxlID0gdW5kZWZpbmVkO1xuICAgIGNvbERlZi53aWR0aCA9ICc0OHB4JztcbiAgICB0aGlzLnB1c2hPQ29sdW1uRGVmaW5pdGlvbihjb2xEZWYpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMucHVzaChuYW1lKTtcbiAgfVxuXG4gIGdldCBoZWFkZXJIZWlnaHQoKSB7XG4gICAgbGV0IGhlaWdodCA9IDA7XG4gICAgaWYgKHRoaXMudGFibGVIZWFkZXJFbCAmJiB0aGlzLnRhYmxlSGVhZGVyRWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgaGVpZ2h0ICs9IHRoaXMudGFibGVIZWFkZXJFbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9XG4gICAgaWYgKHRoaXMudGFibGVUb29sYmFyRWwgJiYgdGhpcy50YWJsZVRvb2xiYXJFbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgKz0gdGhpcy50YWJsZVRvb2xiYXJFbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9XG4gICAgcmV0dXJuIGhlaWdodDtcbiAgfVxuXG4gIGlzRGV0YWlsTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kZXRhaWxNb2RlICE9PSBDb2Rlcy5ERVRBSUxfTU9ERV9OT05FO1xuICB9XG5cbiAgY29weUFsbCgpIHtcbiAgICBVdGlsLmNvcHlUb0NsaXBib2FyZChKU09OLnN0cmluZ2lmeSh0aGlzLmdldFJlbmRlcmVkVmFsdWUoKSkpO1xuICB9XG5cbiAgY29weVNlbGVjdGlvbigpIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5kYXRhU291cmNlLmdldFJlbmRlcmVkRGF0YSh0aGlzLmdldFNlbGVjdGVkSXRlbXMoKSk7XG4gICAgVXRpbC5jb3B5VG9DbGlwYm9hcmQoSlNPTi5zdHJpbmdpZnkoc2VsZWN0ZWRJdGVtcykpO1xuICB9XG5cbiAgdmlld0RldGFpbChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbignZGV0YWlsJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3VwZXIudmlld0RldGFpbChpdGVtKTtcbiAgfVxuXG4gIGVkaXREZXRhaWwoaXRlbTogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oJ2VkaXQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdXBlci5lZGl0RGV0YWlsKGl0ZW0pO1xuICB9XG5cbiAgZ2V0T0NvbHVtbkZyb21UaCh0aDogYW55KTogT0NvbHVtbiB7XG4gICAgbGV0IHJlc3VsdDogT0NvbHVtbjtcbiAgICBjb25zdCBjbGFzc0xpc3Q6IGFueVtdID0gW10uc2xpY2UuY2FsbCgodGggYXMgRWxlbWVudCkuY2xhc3NMaXN0KTtcbiAgICBjb25zdCBjb2x1bW5DbGFzcyA9IGNsYXNzTGlzdC5maW5kKChjbGFzc05hbWU6IHN0cmluZykgPT4gKGNsYXNzTmFtZS5zdGFydHNXaXRoKCdtYXQtY29sdW1uLScpKSk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbkNsYXNzKSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5nZXRPQ29sdW1uKGNvbHVtbkNsYXNzLnN1YnN0cignbWF0LWNvbHVtbi0nLmxlbmd0aCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0VGhXaWR0aEZyb21PQ29sdW1uKG9Db2x1bW46IE9Db2x1bW4pOiBhbnkge1xuICAgIGxldCB3aWR0aENvbHVtbjogbnVtYmVyO1xuICAgIGNvbnN0IHRoQXJyYXkgPSBbXS5zbGljZS5jYWxsKHRoaXMudGFibGVIZWFkZXJFbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuKTtcbiAgICBmb3IgKGNvbnN0IHRoIG9mIHRoQXJyYXkpIHtcbiAgICAgIGNvbnN0IGNsYXNzTGlzdDogYW55W10gPSBbXS5zbGljZS5jYWxsKCh0aCBhcyBFbGVtZW50KS5jbGFzc0xpc3QpO1xuICAgICAgY29uc3QgY29sdW1uQ2xhc3MgPSBjbGFzc0xpc3QuZmluZCgoY2xhc3NOYW1lOiBzdHJpbmcpID0+IChjbGFzc05hbWUgPT09ICdtYXQtY29sdW1uLScgKyBvQ29sdW1uLmF0dHIpKTtcbiAgICAgIGlmIChjb2x1bW5DbGFzcyAmJiBjb2x1bW5DbGFzcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHdpZHRoQ29sdW1uID0gdGguY2xpZW50V2lkdGg7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gd2lkdGhDb2x1bW47XG4gIH1cblxuICBnZXRDb2x1bW5JbnNlcnRhYmxlKG5hbWUpOiBzdHJpbmcge1xuICAgIHJldHVybiBuYW1lICsgdGhpcy5nZXRTdWZmaXhDb2x1bW5JbnNlcnRhYmxlKCk7XG4gIH1cblxuICBpc1Jvd1NlbGVjdGVkKHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzU2VsZWN0aW9uTW9kZU5vbmUoKSAmJiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29sdW1uc1dpZHRoRnJvbURPTSgpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy50YWJsZUhlYWRlckVsKSkge1xuICAgICAgW10uc2xpY2UuY2FsbCh0aGlzLnRhYmxlSGVhZGVyRWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbikuZm9yRWFjaCh0aEVsID0+IHtcbiAgICAgICAgY29uc3Qgb0NvbDogT0NvbHVtbiA9IHRoaXMuZ2V0T0NvbHVtbkZyb21UaCh0aEVsKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG9Db2wpICYmIHRoRWwuY2xpZW50V2lkdGggPiAwICYmIG9Db2wuRE9NV2lkdGggIT09IHRoRWwuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgICBvQ29sLkRPTVdpZHRoID0gdGhFbC5jbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaENvbHVtbnNXaWR0aCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIoYyA9PiBjLnZpc2libGUpLmZvckVhY2goYyA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChjLmRlZmluaXRpb24pICYmIFV0aWwuaXNEZWZpbmVkKGMuZGVmaW5pdGlvbi53aWR0aCkpIHtcbiAgICAgICAgICBjLndpZHRoID0gYy5kZWZpbml0aW9uLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGMuZ2V0UmVuZGVyV2lkdGgodGhpcy5ob3Jpem9udGFsU2Nyb2xsLCB0aGlzLmdldENsaWVudFdpZHRoQ29sdW1uKGMpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZU9Db2x1bW4oYXR0cj86IHN0cmluZywgdGFibGU/OiBPVGFibGVDb21wb25lbnQsIGNvbHVtbj86IE9UYWJsZUNvbHVtbkNvbXBvbmVudCAmIE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQpOiBPQ29sdW1uIHtcbiAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBPQ29sdW1uKCk7XG4gICAgaWYgKGF0dHIpIHtcbiAgICAgIGluc3RhbmNlLmF0dHIgPSBhdHRyO1xuICAgIH1cbiAgICBpZiAodGFibGUpIHtcbiAgICAgIGluc3RhbmNlLnNldERlZmF1bHRQcm9wZXJ0aWVzKHtcbiAgICAgICAgb3JkZXJhYmxlOiB0aGlzLm9yZGVyYWJsZSxcbiAgICAgICAgcmVzaXphYmxlOiB0aGlzLnJlc2l6YWJsZVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChjb2x1bW4pIHtcbiAgICAgIGluc3RhbmNlLnNldENvbHVtblByb3BlcnRpZXMoY29sdW1uKTtcbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT1RhYmxlQnV0dG9ucyhhcmc6IE9UYWJsZUJ1dHRvbnMpIHtcbiAgICB0aGlzLm9UYWJsZUJ1dHRvbnMgPSBhcmc7XG4gICAgaWYgKHRoaXMub1RhYmxlQnV0dG9ucykge1xuICAgICAgdGhpcy5vVGFibGVCdXR0b25zLnJlZ2lzdGVyQnV0dG9ucyh0aGlzLnRhYmxlQnV0dG9ucy50b0FycmF5KCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRDbGllbnRXaWR0aENvbHVtbihjb2w6IE9Db2x1bW4pOiBudW1iZXIge1xuICAgIHJldHVybiBjb2wuRE9NV2lkdGggfHwgdGhpcy5nZXRUaFdpZHRoRnJvbU9Db2x1bW4oY29sKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRNaW5XaWR0aENvbHVtbihjb2w6IE9Db2x1bW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBVdGlsLmV4dHJhY3RQaXhlbHNWYWx1ZShjb2wubWluV2lkdGgsIENvZGVzLkRFRkFVTFRfQ09MVU1OX01JTl9XSURUSCkgKyAncHgnO1xuICB9XG5cbn1cbiJdfQ==