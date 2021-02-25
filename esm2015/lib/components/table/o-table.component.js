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
export const DEFAULT_INPUTS_O_TABLE = [
    ...DEFAULT_INPUTS_O_SERVICE_COMPONENT,
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
];
export const DEFAULT_OUTPUTS_O_TABLE = [
    'onClick',
    'onDoubleClick',
    'onRowSelected',
    'onRowDeselected',
    'onRowDeleted',
    'onDataLoaded',
    'onPaginatedDataLoaded'
];
export class OTableComponent extends OServiceComponent {
    constructor(injector, elRef, dialog, _viewContainerRef, appRef, _componentFactoryResolver, form) {
        super(injector, elRef, form);
        this.dialog = dialog;
        this._viewContainerRef = _viewContainerRef;
        this.appRef = appRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this.selectAllCheckbox = false;
        this.exportButton = true;
        this.showConfigurationOption = true;
        this.columnsVisibilityButton = true;
        this.showFilterOption = true;
        this.showButtonsText = true;
        this.originalFilterColumnActiveByDefault = false;
        this.filterCaseSensitivePvt = false;
        this.insertButton = true;
        this.refreshButton = true;
        this.deleteButton = true;
        this.paginationControls = true;
        this.fixedHeader = false;
        this.showTitle = false;
        this.editionMode = Codes.DETAIL_MODE_NONE;
        this.selectionMode = Codes.SELECTION_MODE_MULTIPLE;
        this._horizontalScroll = false;
        this.showPaginatorFirstLastButtons = true;
        this.autoAlignTitles = false;
        this.multipleSort = true;
        this.orderable = true;
        this.resizable = true;
        this.autoAdjust = false;
        this._enabled = true;
        this.keepSelectedItems = true;
        this.exportMode = Codes.EXPORT_MODE_VISIBLE;
        this._visibleColArray = [];
        this.sortColArray = [];
        this.pendingQuery = false;
        this.pendingQueryFilter = undefined;
        this.setStaticData = false;
        this.avoidQueryColumns = [];
        this.asyncLoadColumns = [];
        this.asyncLoadSubscriptions = {};
        this.finishQuerySubscription = false;
        this.onClick = new EventEmitter();
        this.onDoubleClick = new EventEmitter();
        this.onRowSelected = new EventEmitter();
        this.onRowDeselected = new EventEmitter();
        this.onRowDeleted = new EventEmitter();
        this.onDataLoaded = new EventEmitter();
        this.onPaginatedDataLoaded = new EventEmitter();
        this.onReinitialize = new EventEmitter();
        this.onContentChange = new EventEmitter();
        this.onVisibleColumnsChange = new EventEmitter();
        this.onFilterByColumnChange = new EventEmitter();
        this.showFilterByColumnIcon = false;
        this.showTotalsSubject = new BehaviorSubject(false);
        this.showTotals = this.showTotalsSubject.asObservable();
        this.loadingSortingSubject = new BehaviorSubject(false);
        this.loadingSorting = this.loadingSortingSubject.asObservable();
        this.loadingScrollSubject = new BehaviorSubject(false);
        this.loadingScroll = this.loadingScrollSubject.asObservable();
        this.showFirstInsertableRow = false;
        this.showLastInsertableRow = false;
        this.expandableItem = new SelectionModel(false, []);
        this.clickDelay = 200;
        this.clickPrevent = false;
        this._currentPage = 0;
        this.onUpdateScrolledState = new EventEmitter();
        this.storePaginationState = false;
        this.pageScrollVirtual = 1;
        this._oTableOptions = new DefaultOTableOptions();
        this._oTableOptions.selectColumn = this.createOColumn();
        try {
            this.tabGroupContainer = this.injector.get(MatTabGroup);
            this.tabContainer = this.injector.get(MatTab);
        }
        catch (error) {
        }
        this.snackBarService = this.injector.get(SnackBarService);
        this.oTableStorage = new OTableStorage(this);
    }
    get diameterSpinner() {
        const minHeight = OTableComponent.DEFAULT_BASE_SIZE_SPINNER;
        let height = 0;
        if (this.spinnerContainer && this.spinnerContainer.nativeElement) {
            height = this.spinnerContainer.nativeElement.offsetHeight;
        }
        if (height > 0 && height <= 100) {
            return Math.floor(height - (height * 0.1));
        }
        else {
            return minHeight;
        }
    }
    set filterColumnActiveByDefault(value) {
        const result = BooleanConverter(value);
        this.originalFilterColumnActiveByDefault = result;
        this.showFilterByColumnIcon = result;
    }
    get filterColumnActiveByDefault() {
        return this.showFilterByColumnIcon;
    }
    get oTableOptions() {
        return this._oTableOptions;
    }
    set oTableOptions(value) {
        this._oTableOptions = value;
    }
    set quickFilter(value) {
        value = Util.parseBoolean(String(value));
        this._quickFilter = value;
        this._oTableOptions.filter = value;
    }
    get quickFilter() {
        return this._quickFilter;
    }
    set filterCaseSensitive(value) {
        this.filterCaseSensitivePvt = BooleanConverter(value);
        if (this._oTableOptions) {
            this._oTableOptions.filterCaseSensitive = this.filterCaseSensitivePvt;
        }
    }
    get filterCaseSensitive() {
        return this.filterCaseSensitivePvt;
    }
    set horizontalScroll(value) {
        this._horizontalScroll = BooleanConverter(value);
        this.refreshColumnsWidth();
    }
    get horizontalScroll() {
        return this._horizontalScroll;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(val) {
        val = Util.parseBoolean(String(val));
        this._enabled = val;
    }
    set selectAllCheckboxVisible(value) {
        this._selectAllCheckboxVisible = BooleanConverter(this.state['select-column-visible']) || BooleanConverter(value);
        this._oTableOptions.selectColumn.visible = this._selectAllCheckboxVisible;
        this.initializeCheckboxColumn();
    }
    get selectAllCheckboxVisible() {
        return this._selectAllCheckboxVisible;
    }
    get visibleColArray() {
        return this._visibleColArray;
    }
    set visibleColArray(arg) {
        const permissionsBlocked = this.permissions ? this.permissions.columns.filter(col => col.visible === false).map(col => col.attr) : [];
        const permissionsChecked = arg.filter(value => permissionsBlocked.indexOf(value) === -1);
        this._visibleColArray = permissionsChecked;
        if (this._oTableOptions) {
            const containsSelectionCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_SELECT) !== -1;
            const containsExpandableCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_EXPANDABLE) !== -1;
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
    }
    set currentPage(val) {
        this._currentPage = val;
        if (this.paginator) {
            this.paginator.pageIndex = val;
            if (this.matpaginator) {
                this.matpaginator.pageIndex = val;
            }
        }
    }
    get currentPage() {
        return this._currentPage;
    }
    updateScrolledState() {
        if (this.horizontalScroll) {
            setTimeout(() => {
                const bodyWidth = this.tableBodyEl.nativeElement.clientWidth;
                const scrollWidth = this.tableBodyEl.nativeElement.scrollWidth;
                const previousState = this.horizontalScrolled;
                this.horizontalScrolled = scrollWidth > bodyWidth;
                if (previousState !== this.horizontalScrolled) {
                    this.onUpdateScrolledState.emit(this.horizontalScrolled);
                }
            }, 0);
        }
        this.refreshColumnsWidth();
    }
    ngOnInit() {
        this.initialize();
        if (this.oTableButtons) {
            this.oTableButtons.registerButtons(this.tableButtons.toArray());
        }
    }
    ngAfterViewInit() {
        this.afterViewInit();
        this.initTableAfterViewInit();
        if (this.oTableMenu) {
            this.matMenu = this.oTableMenu.matMenu;
            this.oTableMenu.registerOptions(this.tableOptions.toArray());
        }
        if (this.tableRowExpandable) {
            this.createExpandableColumn();
        }
    }
    createExpandableColumn() {
        this._oTableOptions.expandableColumn = new OColumn();
        this._oTableOptions.expandableColumn.visible = this.tableRowExpandable && this.tableRowExpandable.expandableColumnVisible;
        this.updateStateExpandedColumn();
    }
    ngOnDestroy() {
        this.destroy();
    }
    getSuffixColumnInsertable() {
        return Codes.SUFFIX_COLUMN_INSERTABLE;
    }
    getActionsPermissions() {
        return this.permissions ? (this.permissions.actions || []) : [];
    }
    getMenuPermissions() {
        const result = this.permissions ? this.permissions.menu : undefined;
        return result ? result : {
            visible: true,
            enabled: true,
            items: []
        };
    }
    getOColumnPermissions(attr) {
        const columns = this.permissions ? (this.permissions.columns || []) : [];
        return columns.find(comp => comp.attr === attr) || { attr: attr, enabled: true, visible: true };
    }
    getActionPermissions(attr) {
        const actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
        const permissions = actionsPerm.find(p => p.attr === attr);
        return permissions || {
            attr: attr,
            visible: true,
            enabled: true
        };
    }
    checkEnabledActionPermission(attr) {
        const actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
        const permissions = actionsPerm.find(p => p.attr === attr);
        const enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
        if (!enabledPermision) {
            this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
        }
        return enabledPermision;
    }
    initialize() {
        super.initialize();
        this._oTableOptions = new DefaultOTableOptions();
        if (this.tabGroupContainer && this.tabContainer) {
            this.registerTabListener();
        }
        this.initializeParams();
        this.initializeDao();
        this.permissions = this.permissionsService.getTablePermissions(this.oattr, this.actRoute);
    }
    initializeDao() {
        const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        const methods = {
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
    }
    reinitialize(options) {
        if (options) {
            const clonedOpts = Object.assign({}, options);
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
    }
    initTableAfterViewInit() {
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
    }
    destroy() {
        super.destroy();
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
        Object.keys(this.asyncLoadSubscriptions).forEach(idx => {
            if (this.asyncLoadSubscriptions[idx]) {
                this.asyncLoadSubscriptions[idx].unsubscribe();
            }
        });
    }
    getDataToStore() {
        return this.oTableStorage.getDataToStore();
    }
    registerQuickFilter(arg) {
        const quickFilter = arg;
        this.quickFilterComponent = undefined;
        this.oTableQuickFilterComponent = quickFilter;
        this.oTableQuickFilterComponent.setValue(this.state.filter, false);
    }
    registerPagination(value) {
        this.paginationControls = true;
        this.paginator = value;
    }
    registerContextMenu(value) {
        this.tableContextMenu = value;
        this.contextMenuSubscription = this.tableContextMenu.onShow.subscribe((params) => {
            params.class = 'o-table-context-menu ' + this.rowHeight;
            if (params.data && !this.selection.isSelected(params.data.rowValue)) {
                this.clearSelection();
                this.selectedRow(params.data.rowValue);
            }
        });
    }
    registerDefaultColumn(column) {
        if (Util.isDefined(this.getOColumn(column))) {
            return;
        }
        const colDef = this.createOColumn(column, this);
        this.pushOColumnDefinition(colDef);
    }
    registerColumn(column) {
        const columnAttr = (typeof column === 'string') ? column : column.attr;
        const columnPermissions = this.getOColumnPermissions(columnAttr);
        if (!columnPermissions.visible) {
            return;
        }
        if (typeof column === 'string') {
            this.registerDefaultColumn(column);
            return;
        }
        const columnDef = this.getOColumn(column.attr);
        if (Util.isDefined(columnDef) && Util.isDefined(columnDef.definition)) {
            return;
        }
        const colDef = this.createOColumn(column.attr, this, column);
        let columnWidth = column.width;
        const storedCols = this.state['oColumns-display'];
        if (Util.isDefined(storedCols)) {
            const storedData = storedCols.find(oCol => oCol.attr === colDef.attr);
            if (Util.isDefined(storedData) && Util.isDefined(storedData.width)) {
                if (this.state.hasOwnProperty('initial-configuration')) {
                    if (this.state['initial-configuration'].hasOwnProperty('oColumns-display')) {
                        const initialStoredCols = this.state['initial-configuration']['oColumns-display'];
                        initialStoredCols.forEach(element => {
                            if (colDef.attr === element.attr && element.width === colDef.definition.originalWidth) {
                                columnWidth = storedData.width;
                            }
                        });
                    }
                    else {
                        columnWidth = storedData.width;
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
    }
    pushOColumnDefinition(colDef) {
        colDef.visible = (this._visibleColArray.indexOf(colDef.attr) !== -1);
        const alreadyExisting = this.getOColumn(colDef.attr);
        if (alreadyExisting !== undefined) {
            const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
            this._oTableOptions.columns[replacingIndex] = colDef;
        }
        else {
            this._oTableOptions.columns.push(colDef);
        }
        this.refreshEditionModeWarn();
    }
    refreshEditionModeWarn() {
        if (this.editionMode !== Codes.DETAIL_MODE_NONE) {
            return;
        }
        const editableColumns = this._oTableOptions.columns.filter(col => {
            return Util.isDefined(col.editor);
        });
        if (editableColumns.length > 0) {
            console.warn('Using a column with a editor but there is no edition-mode defined');
        }
    }
    registerColumnAggregate(column) {
        this.showTotalsSubject.next(true);
        const alreadyExisting = this.getOColumn(column.attr);
        if (alreadyExisting !== undefined) {
            const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
            this._oTableOptions.columns[replacingIndex].aggregate = column;
        }
    }
    parseVisibleColumns() {
        if (this.state.hasOwnProperty('oColumns-display')) {
            let stateCols = [];
            this.state['oColumns-display'].forEach((oCol, index) => {
                const isVisibleColInColumns = this._oTableOptions.columns.find(col => col.attr === oCol.attr) !== undefined;
                if (isVisibleColInColumns) {
                    stateCols.push(oCol);
                }
                else {
                    console.warn('Unable to load the column ' + oCol.attr + ' from the localstorage');
                }
            });
            stateCols = this.checkChangesVisibleColummnsInInitialConfiguration(stateCols);
            this.visibleColArray = stateCols.filter(item => item.visible).map(item => item.attr);
        }
        else {
            this.visibleColArray = Util.parseArray(this.visibleColumns, true);
            this._oTableOptions.columns.sort((a, b) => this.visibleColArray.indexOf(a.attr) - this.visibleColArray.indexOf(b.attr));
        }
    }
    checkChangesVisibleColummnsInInitialConfiguration(stateCols) {
        if (this.state.hasOwnProperty('initial-configuration')) {
            if (this.state['initial-configuration'].hasOwnProperty('oColumns-display')) {
                const originalVisibleColArray = this.state['initial-configuration']['oColumns-display'].map(x => {
                    if (x.visible === true) {
                        return x.attr;
                    }
                });
                const visibleColArray = Util.parseArray(this.visibleColumns, true);
                const colToAddInVisibleCol = Util.differenceArrays(visibleColArray, originalVisibleColArray);
                if (colToAddInVisibleCol.length > 0) {
                    colToAddInVisibleCol.forEach((colAdd, index) => {
                        if (stateCols.filter(col => col.attr === colAdd).length > 0) {
                            stateCols = stateCols.map(col => {
                                if (colToAddInVisibleCol.indexOf(col.attr) > -1) {
                                    col.visible = true;
                                }
                                return col;
                            });
                        }
                        else {
                            this.colArray.forEach((element, i) => {
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
                const colToDeleteInVisibleCol = Util.differenceArrays(originalVisibleColArray, visibleColArray);
                if (colToDeleteInVisibleCol.length > 0) {
                    stateCols = stateCols.map(col => {
                        if (colToDeleteInVisibleCol.indexOf(col.attr) > -1) {
                            col.visible = false;
                        }
                        return col;
                    });
                }
            }
        }
        return stateCols;
    }
    parseSortColumns() {
        const sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
        this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
        if (this.state['sort-columns'] && this.state['initial-configuration']['sort-columns']) {
            const initialConfigSortColumnsArray = ServiceUtils.parseSortColumns(this.state['initial-configuration']['sort-columns']);
            const originalSortColumnsArray = ServiceUtils.parseSortColumns(this.sortColumns);
            const colToAddInVisibleCol = Util.differenceArrays(originalSortColumnsArray, initialConfigSortColumnsArray);
            if (colToAddInVisibleCol.length > 0) {
                colToAddInVisibleCol.forEach(colAdd => {
                    this.sortColArray.push(colAdd);
                });
            }
            const colToDelInVisibleCol = Util.differenceArrays(initialConfigSortColumnsArray, originalSortColumnsArray);
            if (colToDelInVisibleCol.length > 0) {
                colToDelInVisibleCol.forEach((colDel) => {
                    this.sortColArray.forEach((col, i) => {
                        if (col.columnName === colDel.columnName) {
                            this.sortColArray.splice(i, 1);
                        }
                    });
                });
            }
        }
        for (let i = this.sortColArray.length - 1; i >= 0; i--) {
            const colName = this.sortColArray[i].columnName;
            const oCol = this.getOColumn(colName);
            if (!Util.isDefined(oCol) || !oCol.orderable) {
                this.sortColArray.splice(i, 1);
            }
        }
    }
    initializeParams() {
        if (!this.visibleColumns) {
            this.visibleColumns = this.columns;
        }
        if (this.colArray.length) {
            this.colArray.forEach((x) => this.registerColumn(x));
            let columnsOrder = [];
            if (this.state.hasOwnProperty('oColumns-display')) {
                columnsOrder = this.state['oColumns-display'].map(item => item.attr);
            }
            else {
                columnsOrder = this.colArray.filter(attr => this.visibleColArray.indexOf(attr) === -1);
                columnsOrder.push(...this.visibleColArray);
            }
            this._oTableOptions.columns.sort((a, b) => {
                if (columnsOrder.indexOf(a.attr) === -1) {
                    return 0;
                }
                else {
                    return columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr);
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
    }
    updateStateExpandedColumn() {
        if (!this.tableRowExpandable || !this.tableRowExpandable.expandableColumnVisible) {
            return;
        }
        if (this._oTableOptions.visibleColumns[0] === Codes.NAME_COLUMN_SELECT && this._oTableOptions.visibleColumns[1] !== Codes.NAME_COLUMN_EXPANDABLE) {
            this._oTableOptions.visibleColumns = [this._oTableOptions.visibleColumns[0]].concat(Codes.NAME_COLUMN_EXPANDABLE, this._oTableOptions.visibleColumns.splice(1));
        }
        else if (this._oTableOptions.visibleColumns[0] !== Codes.NAME_COLUMN_EXPANDABLE) {
            this._oTableOptions.visibleColumns.unshift(Codes.NAME_COLUMN_EXPANDABLE);
        }
    }
    registerTabListener() {
        this.tabGroupChangeSubscription = this.tabGroupContainer.selectedTabChange.subscribe((evt) => {
            let interval;
            const timerCallback = (tab) => {
                if (tab && tab.content.isAttached) {
                    clearInterval(interval);
                    if (tab === this.tabContainer) {
                        this.insideTabBugWorkaround();
                        if (this.pendingQuery) {
                            this.queryData(this.pendingQueryFilter);
                        }
                    }
                }
            };
            interval = setInterval(() => { timerCallback(evt.tab); }, 100);
        });
    }
    insideTabBugWorkaround() {
        this.sortHeaders.forEach(sortH => {
            sortH.refresh();
        });
    }
    registerSortListener() {
        if (Util.isDefined(this.sort)) {
            this.sortSubscription = this.sort.oSortChange.subscribe(this.onSortChange.bind(this));
            this.sort.setMultipleSort(this.multipleSort);
            if (Util.isDefined(this._oTableOptions.columns) && (this.sortColArray.length > 0)) {
                this.sort.setTableInfo(this.sortColArray);
            }
        }
    }
    onSortChange(sortArray) {
        this.sortColArray = [];
        sortArray.forEach((sort) => {
            if (sort.direction !== '') {
                this.sortColArray.push({
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
    }
    setDatasource() {
        const dataSourceService = this.injector.get(OTableDataSourceService);
        this.dataSource = dataSourceService.getInstance(this);
    }
    registerDataSourceListeners() {
        if (!this.pageable) {
            this.onRenderedDataChange = this.dataSource.onRenderedDataChange.subscribe(() => {
                setTimeout(() => {
                    this.loadingSortingSubject.next(false);
                    if (this.cd && !this.cd.destroyed) {
                        this.cd.detectChanges();
                    }
                }, 500);
            });
        }
    }
    get showLoading() {
        return combineLatest([this.loading, this.loadingSorting, this.loadingScroll])
            .pipe(map((res) => (res[0] || res[1] || res[2])));
    }
    getExpandedRowContainerClass(rowIndex) {
        return OTableComponent.EXPANDED_ROW_CONTAINER_CLASS + rowIndex;
    }
    getExpandableItems() {
        return this.expandableItem.selected;
    }
    toogleRowExpandable(item, rowIndex, event) {
        event.stopPropagation();
        event.preventDefault();
        this.expandableItem.toggle(item);
        if (this.getStateExpand(item) === 'collapsed') {
            this.portalHost.detach();
            this.cd.detectChanges();
            const eventTableRowExpandableChange = this.emitTableRowExpandableChangeEvent(item, rowIndex);
            this.tableRowExpandable.onCollapsed.emit(eventTableRowExpandableChange);
        }
        else {
            this.portalHost = new DomPortalOutlet(this.elRef.nativeElement.querySelector('.' + this.getExpandedRowContainerClass(rowIndex)), this._componentFactoryResolver, this.appRef, this.injector);
            const templatePortal = new TemplatePortal(this.tableRowExpandable.templateRef, this._viewContainerRef, { $implicit: item });
            this.portalHost.attachTemplatePortal(templatePortal);
            setTimeout(() => {
                const eventTableRowExpandableChange = this.emitTableRowExpandableChangeEvent(item, rowIndex);
                this.tableRowExpandable.onExpanded.emit(eventTableRowExpandableChange);
            }, 250);
        }
    }
    emitTableRowExpandableChangeEvent(data, rowIndex) {
        const event = new OTableRowExpandedChange();
        event.rowIndex = rowIndex;
        event.data = data;
        return event;
    }
    isExpanded(data) {
        return this.expandableItem.isSelected(data);
    }
    getStateExpand(row) {
        return this.isExpanded(row) ? 'expanded' : 'collapsed';
    }
    isColumnExpandable() {
        return (Util.isDefined(this.tableRowExpandable) && Util.isDefined(this._oTableOptions.expandableColumn)) ? this._oTableOptions.expandableColumn.visible : false;
    }
    hasExpandedRow() {
        return Util.isDefined(this.tableRowExpandable);
    }
    getNumVisibleColumns() {
        return this.oTableOptions.visibleColumns.length;
    }
    queryData(filter, ovrrArgs) {
        if (this.isInsideInactiveTab()) {
            this.pendingQuery = true;
            this.pendingQueryFilter = filter;
            return;
        }
        this.pendingQuery = false;
        this.pendingQueryFilter = undefined;
        super.queryData(filter, ovrrArgs);
    }
    isInsideInactiveTab() {
        let result = false;
        if (this.tabContainer && this.tabGroupContainer) {
            result = !(this.tabContainer.isActive || (this.tabGroupContainer.selectedIndex === this.tabContainer.position));
        }
        return result;
    }
    getComponentFilter(existingFilter = {}) {
        let filter = existingFilter;
        if (this.pageable) {
            if (Object.keys(filter).length > 0) {
                const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
                filter = {};
                filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = parentItemExpr;
            }
            const beColFilter = this.getColumnFiltersExpression();
            if (beColFilter && !Util.isDefined(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY])) {
                filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = beColFilter;
            }
            else if (beColFilter) {
                filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] =
                    FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY], beColFilter, FilterExpressionUtils.OP_AND);
            }
        }
        return super.getComponentFilter(filter);
    }
    getQuickFilterExpression() {
        if (Util.isDefined(this.oTableQuickFilterComponent) && this.pageable) {
            return this.oTableQuickFilterComponent.filterExpression;
        }
        return undefined;
    }
    getColumnFiltersExpression() {
        const columnFilters = this.dataSource.getColumnValueFilters();
        const beColumnFilters = [];
        columnFilters.forEach(colFilter => {
            switch (colFilter.operator) {
                case ColumnValueFilterOperator.IN:
                    if (Util.isArray(colFilter.values)) {
                        const besIn = colFilter.values.map(value => FilterExpressionUtils.buildExpressionEquals(colFilter.attr, value));
                        let beIn = besIn.pop();
                        besIn.forEach(be => {
                            beIn = FilterExpressionUtils.buildComplexExpression(beIn, be, FilterExpressionUtils.OP_OR);
                        });
                        beColumnFilters.push(beIn);
                    }
                    break;
                case ColumnValueFilterOperator.BETWEEN:
                    if (Util.isArray(colFilter.values) && colFilter.values.length === 2) {
                        let beFrom = FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values[0]);
                        let beTo = FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values[1]);
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
        let beColFilter = beColumnFilters.pop();
        beColumnFilters.forEach(be => {
            beColFilter = FilterExpressionUtils.buildComplexExpression(beColFilter, be, FilterExpressionUtils.OP_AND);
        });
        return beColFilter;
    }
    updatePaginationInfo(queryRes) {
        super.updatePaginationInfo(queryRes);
    }
    setData(data, sqlTypes) {
        this.daoTable.sqlTypesChange.next(sqlTypes);
        this.daoTable.setDataArray(data);
        this.updateScrolledState();
        if (this.pageable) {
            ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
        }
        ObservableWrapper.callEmit(this.onDataLoaded, this.daoTable.data);
    }
    showDialogError(error, errorOptional) {
        if (Util.isDefined(error) && !Util.isObject(error)) {
            this.dialogService.alert('ERROR', error);
        }
        else {
            this.dialogService.alert('ERROR', errorOptional);
        }
    }
    projectContentChanged() {
        setTimeout(() => {
            this.loadingSortingSubject.next(false);
        }, 500);
        this.loadingScrollSubject.next(false);
        if (this.previousRendererData !== this.dataSource.renderedData) {
            this.previousRendererData = this.dataSource.renderedData;
            ObservableWrapper.callEmit(this.onContentChange, this.dataSource.renderedData);
        }
        if (this.state.hasOwnProperty('selection') && this.dataSource.renderedData.length > 0 && this.getSelectedItems().length === 0) {
            this.state.selection.forEach(selectedItem => {
                const foundItem = this.dataSource.renderedData.find(data => {
                    let result = true;
                    Object.keys(selectedItem).forEach(key => {
                        result = result && (data[key] === selectedItem[key]);
                    });
                    return result;
                });
                if (foundItem) {
                    this.selection.select(foundItem);
                }
            });
        }
    }
    getAttributesValuesToQuery() {
        const columns = super.getAttributesValuesToQuery();
        if (this.avoidQueryColumns.length > 0) {
            for (let i = columns.length - 1; i >= 0; i--) {
                const col = columns[i];
                if (this.avoidQueryColumns.indexOf(col) !== -1) {
                    columns.splice(i, 1);
                }
            }
        }
        return columns;
    }
    getQueryArguments(filter, ovrrArgs) {
        const queryArguments = super.getQueryArguments(filter, ovrrArgs);
        queryArguments[3] = this.getSqlTypesForFilter(queryArguments[1]);
        Object.assign(queryArguments[3], ovrrArgs ? ovrrArgs.sqltypes || {} : {});
        if (this.pageable) {
            queryArguments[5] = this.paginator.isShowingAllRows(queryArguments[5]) ? this.state.totalQueryRecordsNumber : queryArguments[5];
            queryArguments[6] = this.sortColArray;
        }
        return queryArguments;
    }
    getSqlTypesForFilter(filter) {
        const allSqlTypes = {};
        this._oTableOptions.columns.forEach((col) => {
            if (col.sqlType) {
                allSqlTypes[col.attr] = col.sqlType;
            }
        });
        Object.assign(allSqlTypes, this.getSqlTypes());
        const filterCols = Util.getValuesFromObject(filter);
        const sqlTypes = {};
        Object.keys(allSqlTypes).forEach(key => {
            if (filterCols.indexOf(key) !== -1 && allSqlTypes[key] !== SQLTypes.OTHER) {
                sqlTypes[key] = allSqlTypes[key];
            }
        });
        return sqlTypes;
    }
    onExportButtonClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onExportButtonClicked();
        }
    }
    onChangeColumnsVisibilityClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onChangeColumnsVisibilityClicked();
        }
    }
    onMatTableContentChanged() {
    }
    add() {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
            return;
        }
        super.insertDetail();
    }
    remove(clearSelectedItems = false) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_DELETE)) {
            return;
        }
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) {
            this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
                if (res === true) {
                    if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
                        const filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
                        this.daoTable.removeQuery(filters).subscribe(() => {
                            ObservableWrapper.callEmit(this.onRowDeleted, selectedItems);
                        }, error => {
                            this.showDialogError(error, 'MESSAGES.ERROR_DELETE');
                        }, () => {
                            this.reloadData();
                        });
                    }
                    else {
                        this.deleteLocalItems();
                    }
                }
                else if (clearSelectedItems) {
                    this.clearSelection();
                }
            });
        }
    }
    refresh() {
        this.reloadData();
    }
    showAndSelectAllCheckbox() {
        if (this.isSelectionModeMultiple()) {
            if (this.selectAllCheckbox) {
                this._oTableOptions.selectColumn.visible = true;
            }
            this.initializeCheckboxColumn();
            this.selectAll();
        }
    }
    reloadPaginatedDataFromStart() {
        if (this.pageable) {
            this.currentPage = 0;
            this.reloadData();
        }
    }
    reloadData() {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_REFRESH)) {
            return;
        }
        Object.assign(this.state, this.oTableStorage.getTablePropertyToStore('selection'));
        this.clearSelection();
        this.finishQuerySubscription = false;
        this.pendingQuery = true;
        let queryArgs;
        if (this.pageable) {
            queryArgs = {
                offset: this.currentPage * this.queryRows,
                length: this.queryRows
            };
        }
        this.editingCell = undefined;
        this.queryData(void 0, queryArgs);
    }
    handleClick(item, rowIndex, $event) {
        this.clickTimer = setTimeout(() => {
            if (!this.clickPrevent) {
                this.doHandleClick(item, rowIndex, $event);
            }
            this.clickPrevent = false;
        }, this.clickDelay);
    }
    doHandleClick(item, rowIndex, $event) {
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
            const selectedItems = this.getSelectedItems();
            if (this.selection.isSelected(item) && selectedItems.length === 1 && this.editionEnabled) {
                return;
            }
            else {
                this.clearSelectionAndEditing();
            }
            this.selectedRow(item);
            this.onClick.emit({ row: item, rowIndex: rowIndex, mouseEvent: $event });
        }
    }
    handleMultipleSelection(item) {
        if (this.selection.selected.length > 0) {
            const first = this.dataSource.renderedData.indexOf(this.selection.selected[0]);
            const last = this.dataSource.renderedData.indexOf(item);
            const indexFrom = Math.min(first, last);
            const indexTo = Math.max(first, last);
            this.clearSelection();
            this.dataSource.renderedData.slice(indexFrom, indexTo + 1).forEach(e => this.selectedRow(e));
            ObservableWrapper.callEmit(this.onClick, this.selection.selected);
        }
    }
    saveDataNavigationInLocalStorage() {
        super.saveDataNavigationInLocalStorage();
        this.storePaginationState = true;
    }
    handleDoubleClick(item, event) {
        clearTimeout(this.clickTimer);
        this.clickPrevent = true;
        ObservableWrapper.callEmit(this.onDoubleClick, item);
        if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(item);
        }
    }
    get editionEnabled() {
        return this._oTableOptions.columns.some(item => item.editing);
    }
    handleDOMClick(event) {
        if (this._oTableOptions.selectColumn.visible) {
            return;
        }
        if (this.editionEnabled) {
            return;
        }
        const overlayContainer = document.body.getElementsByClassName('cdk-overlay-container')[0];
        if (overlayContainer && overlayContainer.contains(event.target)) {
            return;
        }
        const tableContainer = this.elRef.nativeElement.querySelector('.o-table-container');
        const tableContent = this.elRef.nativeElement.querySelector('.o-table-container table.mat-table');
        if (tableContainer && tableContent && tableContainer.contains(event.target) && !tableContent.contains(event.target)) {
            this.clearSelection();
        }
    }
    handleCellClick(column, row, event) {
        if (this.oenabled && column.editor
            && (this.detailMode !== Codes.DETAIL_MODE_CLICK)
            && (this.editionMode === Codes.DETAIL_MODE_CLICK)) {
            this.activateColumnEdition(column, row, event);
        }
    }
    handleCellDoubleClick(column, row, event) {
        if (this.oenabled && column.editor
            && (!Codes.isDoubleClickMode(this.detailMode))
            && (Codes.isDoubleClickMode(this.editionMode))) {
            this.activateColumnEdition(column, row, event);
        }
    }
    activateColumnEdition(column, row, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (event && column.editing && this.editingCell === event.currentTarget) {
            return;
        }
        const columnPermissions = this.getOColumnPermissions(column.attr);
        if (columnPermissions.enabled === false) {
            console.warn(`${column.attr} edition not allowed due to permissions`);
            return;
        }
        this.clearSelectionAndEditing();
        this.selectedRow(row);
        if (event) {
            this.editingCell = event.currentTarget;
        }
        const rowData = {};
        this.keysArray.forEach((key) => {
            rowData[key] = row[key];
        });
        rowData[column.attr] = row[column.attr];
        this.editingRow = row;
        column.editing = true;
        column.editor.startEdition(rowData);
        this.cd.detectChanges();
    }
    updateCellData(column, data, saveChanges) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
            const res = new Observable(innerObserver => {
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
            const toUpdate = {};
            toUpdate[column.attr] = data[column.attr];
            const kv = this.extractKeysFromRecord(data);
            return this.updateRecord(kv, toUpdate);
        }
        return undefined;
    }
    getKeysValues() {
        const data = this.getAllValues();
        return data.map((row) => {
            const obj = {};
            this.keysArray.forEach((key) => {
                if (row[key] !== undefined) {
                    obj[key] = row[key];
                }
            });
            return obj;
        });
    }
    onShowsSelects() {
        if (this.oTableMenu) {
            this.oTableMenu.onShowsSelects();
        }
    }
    initializeCheckboxColumn() {
        if (!this.selectionChangeSubscription && this._oTableOptions.selectColumn.visible) {
            this.selectionChangeSubscription = this.selection.changed.subscribe((selectionData) => {
                if (selectionData && selectionData.added.length > 0) {
                    ObservableWrapper.callEmit(this.onRowSelected, selectionData.added);
                }
                if (selectionData && selectionData.removed.length > 0) {
                    ObservableWrapper.callEmit(this.onRowDeselected, selectionData.removed);
                }
            });
        }
        this.updateSelectionColumnState();
    }
    updateSelectionColumnState() {
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
    }
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource ? this.dataSource.renderedData.length : undefined;
        return numSelected > 0 && numSelected === numRows;
    }
    masterToggle(event) {
        event.checked ? this.selectAll() : this.clearSelection();
    }
    selectAll() {
        this.dataSource.renderedData.forEach(row => this.selection.select(row));
    }
    selectionCheckboxToggle(event, row) {
        if (this.isSelectionModeSingle()) {
            this.clearSelection();
        }
        this.selectedRow(row);
    }
    selectedRow(row) {
        this.setSelected(row);
        this.cd.detectChanges();
    }
    get showDeleteButton() {
        return this.deleteButton;
    }
    getTrackByFunction() {
        const self = this;
        return (index, item) => {
            if (self.hasScrollableContainer() && index < (self.pageScrollVirtual - 1) * Codes.LIMIT_SCROLLVIRTUAL) {
                return null;
            }
            let itemId = '';
            const keysLenght = self.keysArray.length;
            self.keysArray.forEach((key, idx) => {
                const suffix = idx < (keysLenght - 1) ? ';' : '';
                itemId += item[key] + suffix;
            });
            const asyncAndVisible = self.asyncLoadColumns.filter(c => self._oTableOptions.visibleColumns.indexOf(c) !== -1);
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
    }
    queryRowAsyncData(rowIndex, rowData) {
        const kv = ServiceUtils.getObjectProperties(rowData, this.keysArray);
        const av = this.asyncLoadColumns.filter(c => this._oTableOptions.visibleColumns.indexOf(c) !== -1);
        if (av.length === 0) {
            return;
        }
        const columnQueryArgs = [kv, av, this.entity, undefined, undefined, undefined, undefined];
        const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
            if (this.asyncLoadSubscriptions[rowIndex]) {
                this.asyncLoadSubscriptions[rowIndex].unsubscribe();
            }
            this.asyncLoadSubscriptions[rowIndex] = this.dataService[queryMethodName]
                .apply(this.dataService, columnQueryArgs)
                .subscribe((res) => {
                if (res.isSuccessful()) {
                    let data;
                    if (Util.isArray(res.data) && res.data.length === 1) {
                        data = res.data[0];
                    }
                    else if (Util.isObject(res.data)) {
                        data = res.data;
                    }
                    this.daoTable.setAsynchronousColumn(data, rowData);
                    this.cd.detectChanges();
                }
            });
        }
    }
    getValue() {
        return this.dataSource.getCurrentData();
    }
    getAllValues() {
        return this.dataSource.getCurrentAllData();
    }
    getAllRenderedValues() {
        return this.dataSource.getAllRendererData();
    }
    getRenderedValue() {
        return this.dataSource.getCurrentRendererData();
    }
    getSqlTypes() {
        return Util.isDefined(this.dataSource.sqlTypes) ? this.dataSource.sqlTypes : {};
    }
    setOTableColumnsFilter(tableColumnsFilter) {
        this.oTableColumnsFilterComponent = tableColumnsFilter;
    }
    get filterColumns() {
        if (this.state.hasOwnProperty('initial-configuration') &&
            this.state['initial-configuration'].hasOwnProperty('filter-columns') &&
            this.state.hasOwnProperty('filter-columns') &&
            this.state['initial-configuration']['filter-columns'] === this.originalFilterColumns) {
            if (this.state.hasOwnProperty('filter-columns')) {
                return this.state['filter-columns'];
            }
        }
        return this.originalFilterColumns;
    }
    get originalFilterColumns() {
        let sortColumnsFilter = [];
        if (this.oTableColumnsFilterComponent) {
            sortColumnsFilter = this.oTableColumnsFilterComponent.columnsArray;
        }
        return sortColumnsFilter;
    }
    getStoredColumnsFilters() {
        return this.oTableStorage.getStoredColumnsFilters();
    }
    onFilterByColumnClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onFilterByColumnClicked();
        }
    }
    onStoreFilterClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onStoreFilterClicked();
        }
    }
    onLoadFilterClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onLoadFilterClicked();
        }
    }
    onClearFilterClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onClearFilterClicked();
        }
    }
    clearFilters(triggerDatasourceUpdate = true) {
        this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
        if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
            this.oTableMenu.columnFilterOption.setActive(this.showFilterByColumnIcon);
        }
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        if (this.oTableQuickFilterComponent) {
            this.oTableQuickFilterComponent.setValue(void 0);
        }
    }
    clearColumnFilter(attr, triggerDatasourceUpdate = true) {
        this.dataSource.clearColumnFilter(attr, triggerDatasourceUpdate);
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        this.reloadPaginatedDataFromStart();
    }
    filterByColumn(columnValueFilter) {
        this.dataSource.addColumnFilter(columnValueFilter);
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        this.reloadPaginatedDataFromStart();
    }
    clearColumnFilters(triggerDatasourceUpdate = true) {
        this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
        this.onFilterByColumnChange.emit(this.dataSource.getColumnValueFilters());
        this.reloadPaginatedDataFromStart();
    }
    isColumnFilterable(column) {
        return (this.oTableColumnsFilterComponent && this.oTableColumnsFilterComponent.isColumnFilterable(column.attr));
    }
    isModeColumnFilterable(column) {
        return this.showFilterByColumnIcon &&
            (this.oTableColumnsFilterComponent && this.oTableColumnsFilterComponent.isColumnFilterable(column.attr));
    }
    isColumnFilterActive(column) {
        return this.showFilterByColumnIcon &&
            this.dataSource.getColumnValueFilterByAttr(column.attr) !== undefined;
    }
    openColumnFilterDialog(column, event) {
        event.stopPropagation();
        event.preventDefault();
        const dialogRef = this.dialog.open(OTableFilterByColumnDataDialogComponent, {
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
        dialogRef.afterClosed().subscribe(result => {
            switch (result) {
                case TableFilterByColumnDialogResult.ACCEPT:
                    const columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
                    this.filterByColumn(columnValueFilter);
                    break;
                case TableFilterByColumnDialogResult.CLEAR:
                    const col = dialogRef.componentInstance.column;
                    this.clearColumnFilter(col.attr);
                    break;
            }
        });
        dialogRef.componentInstance.onSortFilterValuesChange.subscribe(sortedFilterableColumn => {
            this.storeFilterColumns(sortedFilterableColumn);
        });
    }
    storeFilterColumns(sortColumnFilter) {
        if (this.state.hasOwnProperty('filter-columns') && this.state['filter-columns']) {
            let storeSortColumnsFilterState = this.oTableStorage.getFilterColumnsState();
            if (storeSortColumnsFilterState['filter-columns'].filter(x => x.attr === sortColumnFilter.attr).length > 0) {
                storeSortColumnsFilterState['filter-columns'].forEach(element => {
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
    }
    getSortFilterColumn(column) {
        let sortColumn;
        if (this.state.hasOwnProperty('filter-columns')) {
            this.state['filter-columns'].forEach((element) => {
                if (element.attr === column.attr) {
                    sortColumn = element.sort;
                }
            });
        }
        if (!Util.isDefined(sortColumn) && this.oTableColumnsFilterComponent) {
            sortColumn = this.oTableColumnsFilterComponent.getSortValueOfFilterColumn(column.attr);
        }
        if (!Util.isDefined(sortColumn)) {
            if (this.sortColArray.find(x => x.columnName === column.attr)) {
                sortColumn = this.isColumnSortActive(column) ? 'asc' : 'desc';
            }
        }
        return sortColumn;
    }
    get disableTableMenuButton() {
        return !!(this.permissions && this.permissions.menu && this.permissions.menu.enabled === false);
    }
    get showTableMenuButton() {
        const permissionHidden = !!(this.permissions && this.permissions.menu && this.permissions.menu.visible === false);
        if (permissionHidden) {
            return false;
        }
        const staticOpt = this.selectAllCheckbox || this.exportButton || this.showConfigurationOption || this.columnsVisibilityButton || (this.showFilterOption && this.oTableColumnsFilterComponent !== undefined);
        return staticOpt || this.tableOptions.length > 0;
    }
    setOTableInsertableRow(tableInsertableRow) {
        const insertPerm = this.getActionPermissions(PermissionsUtils.ACTION_INSERT);
        if (insertPerm.visible) {
            tableInsertableRow.enabled = insertPerm.enabled;
            this.oTableInsertableRowComponent = tableInsertableRow;
            this.showFirstInsertableRow = this.oTableInsertableRowComponent.isFirstRow();
            this.showLastInsertableRow = !this.showFirstInsertableRow;
            this.oTableInsertableRowComponent.initializeEditors();
        }
    }
    clearSelectionAndEditing() {
        this.selection.clear();
        this._oTableOptions.columns.forEach(item => {
            item.editing = false;
        });
    }
    useDetailButton(column) {
        return column.type === 'editButtonInRow' || column.type === 'detailButtonInRow';
    }
    onDetailButtonClick(column, row, event) {
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
    }
    getDetailButtonIcon(column) {
        let result = '';
        switch (column.type) {
            case 'editButtonInRow':
                result = this.editButtonInRowIcon;
                break;
            case 'detailButtonInRow':
                result = this.detailButtonInRowIcon;
                break;
        }
        return result;
    }
    usePlainRender(column, row) {
        return !this.useDetailButton(column) && !column.renderer && (!column.editor || (!column.editing || !this.selection.isSelected(row)));
    }
    useCellRenderer(column, row) {
        return column.renderer && (!column.editing || column.editing && !this.selection.isSelected(row));
    }
    useCellEditor(column, row) {
        if (column.editor && column.editor.autoCommit) {
            return false;
        }
        return column.editor && column.editing && this.selection.isSelected(row);
    }
    isSelectionModeMultiple() {
        return this.selectionMode === Codes.SELECTION_MODE_MULTIPLE;
    }
    isSelectionModeSingle() {
        return this.selectionMode === Codes.SELECTION_MODE_SINGLE;
    }
    isSelectionModeNone() {
        return this.selectionMode === Codes.SELECTION_MODE_NONE;
    }
    onChangePage(evt) {
        this.finishQuerySubscription = false;
        if (!this.pageable) {
            this.currentPage = evt.pageIndex;
            return;
        }
        const tableState = this.state;
        const goingBack = evt.pageIndex < this.currentPage;
        this.currentPage = evt.pageIndex;
        const pageSize = this.paginator.isShowingAllRows(evt.pageSize) ? tableState.totalQueryRecordsNumber : evt.pageSize;
        const oldQueryRows = this.queryRows;
        const changingPageSize = (oldQueryRows !== pageSize);
        this.queryRows = pageSize;
        let newStartRecord;
        let queryLength;
        if (goingBack || changingPageSize) {
            newStartRecord = (this.currentPage * this.queryRows);
            queryLength = this.queryRows;
        }
        else {
            newStartRecord = Math.max(tableState.queryRecordOffset, (this.currentPage * this.queryRows));
            const newEndRecord = Math.min(newStartRecord + this.queryRows, tableState.totalQueryRecordsNumber);
            queryLength = Math.min(this.queryRows, newEndRecord - newStartRecord);
        }
        const queryArgs = {
            offset: newStartRecord,
            length: queryLength
        };
        this.finishQuerySubscription = false;
        this.queryData(void 0, queryArgs);
    }
    getOColumn(attr) {
        return this._oTableOptions ? this._oTableOptions.columns.find(item => item.name === attr) : undefined;
    }
    insertRecord(recordData, sqlTypes) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
            return undefined;
        }
        if (!Util.isDefined(sqlTypes)) {
            const allSqlTypes = this.getSqlTypes();
            sqlTypes = {};
            Object.keys(recordData).forEach(key => {
                sqlTypes[key] = allSqlTypes[key];
            });
        }
        return this.daoTable.insertQuery(recordData, sqlTypes);
    }
    updateRecord(filter, updateData, sqlTypes) {
        if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
            return of(this.dataSource.data);
        }
        const sqlTypesArg = sqlTypes || {};
        if (!Util.isDefined(sqlTypes)) {
            const allSqlTypes = this.getSqlTypes();
            Object.keys(filter).forEach(key => {
                sqlTypesArg[key] = allSqlTypes[key];
            });
            Object.keys(updateData).forEach(key => {
                sqlTypesArg[key] = allSqlTypes[key];
            });
        }
        return this.daoTable.updateQuery(filter, updateData, sqlTypesArg);
    }
    getDataArray() {
        return this.daoTable.data;
    }
    setDataArray(data) {
        if (this.daoTable) {
            this.pageable = false;
            this.staticData = data;
            this.daoTable.usingStaticData = true;
            this.daoTable.setDataArray(this.staticData);
        }
    }
    deleteLocalItems() {
        const dataArray = this.getDataArray();
        const selectedItems = this.getSelectedItems();
        selectedItems.forEach((selectedItem) => {
            for (let j = dataArray.length - 1; j >= 0; --j) {
                if (Util.equals(selectedItem, dataArray[j])) {
                    dataArray.splice(j, 1);
                    break;
                }
            }
        });
        this.clearSelection();
        this.setDataArray(dataArray);
    }
    isColumnSortActive(column) {
        const found = this.sortColArray.find(sortC => sortC.columnName === column.attr);
        return found !== undefined;
    }
    isColumnDescSortActive(column) {
        const found = this.sortColArray.find(sortC => sortC.columnName === column.attr && !sortC.ascendent);
        return found !== undefined;
    }
    hasTabGroupChangeSubscription() {
        return this.tabGroupChangeSubscription !== undefined;
    }
    isEmpty(value) {
        return !Util.isDefined(value) || ((typeof value === 'string') && !value);
    }
    setFiltersConfiguration(conf) {
        if (Util.isDefined(this.filterCaseSensitive) && this.state.hasOwnProperty('initial-configuration') &&
            this.state['initial-configuration'].hasOwnProperty('filter-case-sensitive') &&
            this.filterCaseSensitive === conf['initial-configuration']['filter-case-sensitive']) {
            this.filterCaseSensitive = conf.hasOwnProperty('filter-case-sensitive') ? conf['filter-case-sensitive'] : this.filterCaseSensitive;
        }
        const storedColumnFilters = this.oTableStorage.getStoredColumnsFilters(conf);
        if (Util.isDefined(this.filterColumnActiveByDefault) && this.state.hasOwnProperty('initial-configuration') &&
            this.state['initial-configuration'].hasOwnProperty('filter-column-active-by-default') &&
            this.originalFilterColumnActiveByDefault !== conf['initial-configuration']['filter-column-active-by-default']) {
            this.showFilterByColumnIcon = this.originalFilterColumnActiveByDefault;
        }
        else {
            const filterColumnActiveByDefaultState = conf.hasOwnProperty('filter-column-active-by-default') ? conf['filter-column-active-by-default'] : this.filterColumnActiveByDefault;
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
            const storedColumnsData = conf.oColumns || [];
            storedColumnsData.forEach((oColData) => {
                const oCol = this.getOColumn(oColData.attr);
                if (oCol) {
                    if (oColData.hasOwnProperty('searching')) {
                        oCol.searching = oColData.searching;
                    }
                }
            });
        }
    }
    onStoreConfigurationClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onStoreConfigurationClicked();
        }
    }
    onApplyConfigurationClicked() {
        if (this.oTableMenu) {
            this.oTableMenu.onApplyConfigurationClicked();
        }
    }
    applyDefaultConfiguration() {
        this.oTableStorage.reset();
        this.initializeParams();
        this.parseVisibleColumns();
        this._oTableOptions.columns.sort((a, b) => this.visibleColArray.indexOf(a.attr) - this.visibleColArray.indexOf(b.attr));
        this.insideTabBugWorkaround();
        this.onReinitialize.emit(null);
        this.clearFilters(false);
        this.reloadData();
    }
    applyConfiguration(configurationName) {
        const storedConfiguration = this.oTableStorage.getStoredConfiguration(configurationName);
        if (storedConfiguration) {
            const properties = storedConfiguration[OTableStorage.STORED_PROPERTIES_KEY] || [];
            const conf = storedConfiguration[OTableStorage.STORED_CONFIGURATION_KEY];
            properties.forEach(property => {
                switch (property) {
                    case 'sort':
                        this.state['sort-columns'] = conf['sort-columns'];
                        this.parseSortColumns();
                        break;
                    case 'columns-display':
                        this.state['oColumns-display'] = conf['oColumns-display'];
                        this.parseVisibleColumns();
                        this.state['select-column-visible'] = conf['select-column-visible'];
                        this.initializeCheckboxColumn();
                        break;
                    case 'quick-filter':
                    case 'columns-filter':
                        this.setFiltersConfiguration(conf);
                        break;
                    case 'page':
                        this.state.currentPage = conf.currentPage;
                        this.currentPage = conf.currentPage;
                        if (this.pageable) {
                            this.state.totalQueryRecordsNumber = conf.totalQueryRecordsNumber;
                            this.state.queryRecordOffset = conf.queryRecordOffset;
                        }
                        this.queryRows = conf['query-rows'];
                        break;
                }
            });
            this.reloadData();
        }
    }
    getTitleAlignClass(oCol) {
        let align;
        const hasTitleAlign = Util.isDefined(oCol.definition) && Util.isDefined(oCol.definition.titleAlign);
        const autoAlign = (this.autoAlignTitles && !hasTitleAlign) || (hasTitleAlign && oCol.definition.titleAlign === Codes.COLUMN_TITLE_ALIGN_AUTO);
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
    }
    getCellAlignClass(column) {
        return Util.isDefined(column.definition) && Util.isDefined(column.definition.contentAlign) ? 'o-' + column.definition.contentAlign : '';
    }
    onTableScroll(e) {
        if (this.hasScrollableContainer()) {
            const tableViewHeight = e.target.offsetHeight;
            const tableScrollHeight = e.target.scrollHeight;
            const scrollLocation = e.target.scrollTop;
            const buffer = 100;
            const limit_SCROLLVIRTUAL = tableScrollHeight - tableViewHeight - buffer;
            if (scrollLocation > limit_SCROLLVIRTUAL) {
                this.getDataScrollable();
            }
        }
    }
    getDataScrollable() {
        const pageVirtualBefore = this.pageScrollVirtual;
        const pageVirtualEnd = Math.ceil(this.dataSource.resultsLength / Codes.LIMIT_SCROLLVIRTUAL);
        if (pageVirtualEnd !== this.pageScrollVirtual) {
            this.pageScrollVirtual++;
        }
        if (pageVirtualBefore !== this.pageScrollVirtual) {
            this.loadingScrollSubject.next(true);
            this.dataSource.loadDataScrollable = this.pageScrollVirtual;
        }
    }
    hasScrollableContainer() {
        return this.dataSource && !this.paginationControls && !this.pageable;
    }
    addDefaultRowButtons() {
        if (this.editButtonInRow) {
            this.addButtonInRow('editButtonInRow');
        }
        if (this.detailButtonInRow) {
            this.addButtonInRow('detailButtonInRow');
        }
    }
    addButtonInRow(name) {
        const colDef = this.createOColumn(name, this);
        colDef.type = name;
        colDef.visible = true;
        colDef.searchable = false;
        colDef.orderable = false;
        colDef.resizable = false;
        colDef.title = undefined;
        colDef.width = '48px';
        this.pushOColumnDefinition(colDef);
        this._oTableOptions.visibleColumns.push(name);
    }
    get headerHeight() {
        let height = 0;
        if (this.tableHeaderEl && this.tableHeaderEl.nativeElement) {
            height += this.tableHeaderEl.nativeElement.offsetHeight;
        }
        if (this.tableToolbarEl && this.tableToolbarEl.nativeElement) {
            height += this.tableToolbarEl.nativeElement.offsetHeight;
        }
        return height;
    }
    isDetailMode() {
        return this.detailMode !== Codes.DETAIL_MODE_NONE;
    }
    copyAll() {
        Util.copyToClipboard(JSON.stringify(this.getRenderedValue()));
    }
    copySelection() {
        const selectedItems = this.dataSource.getRenderedData(this.getSelectedItems());
        Util.copyToClipboard(JSON.stringify(selectedItems));
    }
    viewDetail(item) {
        if (!this.checkEnabledActionPermission('detail')) {
            return;
        }
        super.viewDetail(item);
    }
    editDetail(item) {
        if (!this.checkEnabledActionPermission('edit')) {
            return;
        }
        super.editDetail(item);
    }
    getOColumnFromTh(th) {
        let result;
        const classList = [].slice.call(th.classList);
        const columnClass = classList.find((className) => (className.startsWith('mat-column-')));
        if (Util.isDefined(columnClass)) {
            result = this.getOColumn(columnClass.substr('mat-column-'.length));
        }
        return result;
    }
    getThWidthFromOColumn(oColumn) {
        let widthColumn;
        const thArray = [].slice.call(this.tableHeaderEl.nativeElement.children);
        for (const th of thArray) {
            const classList = [].slice.call(th.classList);
            const columnClass = classList.find((className) => (className === 'mat-column-' + oColumn.attr));
            if (columnClass && columnClass.length > 1) {
                widthColumn = th.clientWidth;
                break;
            }
        }
        return widthColumn;
    }
    getColumnInsertable(name) {
        return name + this.getSuffixColumnInsertable();
    }
    isRowSelected(row) {
        return !this.isSelectionModeNone() && this.selection.isSelected(row);
    }
    getColumnsWidthFromDOM() {
        if (Util.isDefined(this.tableHeaderEl)) {
            [].slice.call(this.tableHeaderEl.nativeElement.children).forEach(thEl => {
                const oCol = this.getOColumnFromTh(thEl);
                if (Util.isDefined(oCol) && thEl.clientWidth > 0 && oCol.DOMWidth !== thEl.clientWidth) {
                    oCol.DOMWidth = thEl.clientWidth;
                }
            });
        }
    }
    refreshColumnsWidth() {
        setTimeout(() => {
            this._oTableOptions.columns.filter(c => c.visible).forEach(c => {
                if (Util.isDefined(c.definition) && Util.isDefined(c.definition.width)) {
                    c.width = c.definition.width;
                }
                c.getRenderWidth(this.horizontalScroll, this.getClientWidthColumn(c));
            });
            this.cd.detectChanges();
        }, 0);
    }
    createOColumn(attr, table, column) {
        const instance = new OColumn();
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
    }
    registerOTableButtons(arg) {
        this.oTableButtons = arg;
        if (this.oTableButtons) {
            this.oTableButtons.registerButtons(this.tableButtons.toArray());
        }
    }
    getClientWidthColumn(col) {
        return col.DOMWidth || this.getThWidthFromOColumn(col);
    }
    getMinWidthColumn(col) {
        return Util.extractPixelsValue(col.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH) + 'px';
    }
}
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
OTableComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: MatDialog },
    { type: ViewContainerRef },
    { type: ApplicationRef },
    { type: ComponentFactoryResolver },
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFtQixjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RFLE9BQU8sRUFFTCxjQUFjLEVBQ2QsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsWUFBWSxFQUNaLGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsWUFBWSxFQUNaLGdCQUFnQixFQUNoQixpQkFBaUIsRUFFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFxQixTQUFTLEVBQVcsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUN4SCxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNwRixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBV3BGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMs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REFDaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IFNlbGVjdGlvbkNoYW5nZSwgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgRG9tUG9ydGFsT3V0bGV0LCBUZW1wbGF0ZVBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQXBwbGljYXRpb25SZWYsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld1JlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdENoZWNrYm94Q2hhbmdlLCBNYXREaWFsb2csIE1hdE1lbnUsIE1hdFBhZ2luYXRvciwgTWF0VGFiLCBNYXRUYWJHcm91cCwgUGFnZUV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEJvb2xlYW5Db252ZXJ0ZXIsIElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgU2VydmljZVJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBJT0NvbnRleHRNZW51Q29udGV4dCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1jb250ZXh0LW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1idXR0b24uaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtYnV0dG9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlRGF0YVNvdXJjZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1kYXRhc291cmNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVNZW51IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9uQ2xpY2tUYWJsZUV2ZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW9uY2xpY2suaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLXBhZ2luYXRvci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUXVpY2tmaWx0ZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtcXVpY2tmaWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZmFjdG9yaWVzJztcbmltcG9ydCB7IFNuYWNrQmFyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NuYWNrYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgVGFibGVGaWx0ZXJCeUNvbHVtbkRpYWxvZ1Jlc3VsdCB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tICcuLi8uLi90eXBlcy9leHByZXNzaW9uLnR5cGUnO1xuaW1wb3J0IHsgT0NvbHVtbkFnZ3JlZ2F0ZSB9IGZyb20gJy4uLy4uL3R5cGVzL28tY29sdW1uLWFnZ3JlZ2F0ZS50eXBlJztcbmltcG9ydCB7IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IsIE9Db2x1bW5WYWx1ZUZpbHRlciB9IGZyb20gJy4uLy4uL3R5cGVzL28tY29sdW1uLXZhbHVlLWZpbHRlci50eXBlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPVGFibGVJbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXRhYmxlLWluaXRpYWxpemF0aW9uLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPVGFibGVNZW51UGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXRhYmxlLW1lbnUtcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPVGFibGVQZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tdGFibGUtcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPUXVlcnlEYXRhQXJncyB9IGZyb20gJy4uLy4uL3R5cGVzL3F1ZXJ5LWRhdGEtYXJncy50eXBlJztcbmltcG9ydCB7IFF1aWNrRmlsdGVyRnVuY3Rpb24gfSBmcm9tICcuLi8uLi90eXBlcy9xdWljay1maWx0ZXItZnVuY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBTUUxPcmRlciB9IGZyb20gJy4uLy4uL3R5cGVzL3NxbC1vcmRlci50eXBlJztcbmltcG9ydCB7IE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgRmlsdGVyRXhwcmVzc2lvblV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9maWx0ZXItZXhwcmVzc2lvbi51dGlscyc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1V0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBTZXJ2aWNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3NlcnZpY2UudXRpbHMnO1xuaW1wb3J0IHsgU1FMVHlwZXMgfSBmcm9tICcuLi8uLi91dGlsL3NxbHR5cGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vY29udGV4dG1lbnUvby1jb250ZXh0LW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQsIE9TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5DYWxjdWxhdGVkQ29tcG9uZW50IH0gZnJvbSAnLi9jb2x1bW4vY2FsY3VsYXRlZC9vLXRhYmxlLWNvbHVtbi1jYWxjdWxhdGVkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi9jb2x1bW4vby10YWJsZS1jb2x1bW4uY29tcG9uZW50JztcbmltcG9ydCB7IERlZmF1bHRPVGFibGVPcHRpb25zIH0gZnJvbSAnLi9leHRlbnNpb25zL2RlZmF1bHQtby10YWJsZS1vcHRpb25zLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9kaWFsb2cvZmlsdGVyLWJ5LWNvbHVtbi9vLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9CYXNlVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL3BhZ2luYXRvci9vLWJhc2UtdGFibGUtcGFnaW5hdG9yLmNsYXNzJztcbmltcG9ydCB7IE9GaWx0ZXJDb2x1bW4gfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWNvbHVtbnMtZmlsdGVyL2NvbHVtbnMvby10YWJsZS1jb2x1bW5zLWZpbHRlci1jb2x1bW4uY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWNvbHVtbnMtZmlsdGVyL28tdGFibGUtY29sdW1ucy1maWx0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWluc2VydGFibGUtcm93L28tdGFibGUtaW5zZXJ0YWJsZS1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtb3B0aW9uL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVEYXRhU291cmNlU2VydmljZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9vLXRhYmxlLWRhdGFzb3VyY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVTdG9yYWdlIH0gZnJvbSAnLi9leHRlbnNpb25zL28tdGFibGUtc3RvcmFnZS5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVEYW8gfSBmcm9tICcuL2V4dGVuc2lvbnMvby10YWJsZS5kYW8nO1xuaW1wb3J0IHsgT1RhYmxlUm93RXhwYW5kYWJsZUNvbXBvbmVudCwgT1RhYmxlUm93RXhwYW5kZWRDaGFuZ2UgfSBmcm9tICcuL2V4dGVuc2lvbnMvcm93L3RhYmxlLXJvdy1leHBhbmRhYmxlL28tdGFibGUtcm93LWV4cGFuZGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9NYXRTb3J0IH0gZnJvbSAnLi9leHRlbnNpb25zL3NvcnQvby1tYXQtc29ydCc7XG5pbXBvcnQgeyBPTWF0U29ydEhlYWRlciB9IGZyb20gJy4vZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQtaGVhZGVyJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEUgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQsXG5cbiAgLy8gdmlzaWJsZS1jb2x1bW5zIFtzdHJpbmddOiB2aXNpYmxlIGNvbHVtbnMsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAndmlzaWJsZUNvbHVtbnM6IHZpc2libGUtY29sdW1ucycsXG5cbiAgLy8gZWRpdGFibGUtY29sdW1ucyBbc3RyaW5nXTogY29sdW1ucyB0aGF0IGNhbiBiZSBlZGl0ZWQgZGlyZWN0bHkgb3ZlciB0aGUgdGFibGUsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAvLyAnZWRpdGFibGVDb2x1bW5zOiBlZGl0YWJsZS1jb2x1bW5zJyxcblxuICAvLyBzb3J0LWNvbHVtbnMgW3N0cmluZ106IGluaXRpYWwgc29ydGluZywgd2l0aCB0aGUgZm9ybWF0IGNvbHVtbjpbQVNDfERFU0NdLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NvcnRDb2x1bW5zOiBzb3J0LWNvbHVtbnMnLFxuXG4gICdxdWlja0ZpbHRlckNhbGxiYWNrOiBxdWljay1maWx0ZXItZnVuY3Rpb24nLFxuXG4gIC8vIGRlbGV0ZS1idXR0b24gW25vfHllc106IHNob3cgZGVsZXRlIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnZGVsZXRlQnV0dG9uOiBkZWxldGUtYnV0dG9uJyxcblxuICAvLyByZWZyZXNoLWJ1dHRvbiBbbm98eWVzXTogc2hvdyByZWZyZXNoIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAncmVmcmVzaEJ1dHRvbjogcmVmcmVzaC1idXR0b24nLFxuXG4gIC8vIGNvbHVtbnMtdmlzaWJpbGl0eS1idXR0b24gW25vfHllc106IHNob3cgY29sdW1ucyB2aXNpYmlsaXR5IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnY29sdW1uc1Zpc2liaWxpdHlCdXR0b246IGNvbHVtbnMtdmlzaWJpbGl0eS1idXR0b24nLFxuXG4gIC8vIC8vIGNvbHVtbnMtcmVzaXplLWJ1dHRvbiBbbm98eWVzXTogc2hvdyBjb2x1bW5zIHJlc2l6ZSBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgLy8gJ2NvbHVtbnNSZXNpemVCdXR0b246IGNvbHVtbnMtcmVzaXplLWJ1dHRvbicsXG5cbiAgLy8gLy8gY29sdW1ucy1ncm91cC1idXR0b24gW25vfHllc106IHNob3cgY29sdW1ucyBncm91cCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgLy8gJ2NvbHVtbnNHcm91cEJ1dHRvbjogY29sdW1ucy1ncm91cC1idXR0b24nLFxuXG4gIC8vIGV4cG9ydC1idXR0b24gW25vfHllc106IHNob3cgZXhwb3J0IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnZXhwb3J0QnV0dG9uOiBleHBvcnQtYnV0dG9uJyxcblxuICAvLyBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgY29uZmlndXJhdGlvbiBidXR0b24gaW4gaGVhZGVyLiBEZWZhdWx0OiB5ZXMuXG4gICdzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogc2hvdy1jb25maWd1cmF0aW9uLW9wdGlvbicsXG5cbiAgLy8gc2hvdy1idXR0b25zLXRleHQgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyB0ZXh0IG9mIGhlYWRlciBidXR0b25zLiBEZWZhdWx0OiB5ZXMuXG4gICdzaG93QnV0dG9uc1RleHQ6IHNob3ctYnV0dG9ucy10ZXh0JyxcblxuICAvLyBzZWxlY3QtYWxsLWNoZWNrYm94IFt5ZXN8bm98dHJ1ZXxmYWxzZV06ICBzaG93IGluIHRoZSBtZW51IHRoZSBvcHRpb24gb2Ygc2VsZWN0aW9uIGNoZWNrIGJveGVzIC4gRGVmYXVsdDogbm8uXG4gICdzZWxlY3RBbGxDaGVja2JveDogc2VsZWN0LWFsbC1jaGVja2JveCcsXG5cbiAgLy8gcGFnaW5hdGlvbi1jb250cm9scyBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHBhZ2luYXRpb24gY29udHJvbHMuIERlZmF1bHQ6IHllcy5cbiAgJ3BhZ2luYXRpb25Db250cm9sczogcGFnaW5hdGlvbi1jb250cm9scycsXG5cbiAgLy8gZml4LWhlYWRlciBbeWVzfG5vfHRydWV8ZmFsc2VdOiBmaXhlZCBoZWFkZXIgYW5kIGZvb3RlciB3aGVuIHRoZSBjb250ZW50IGlzIGdyZWF0aGVyIHRoYW4gaXRzIG93biBoZWlnaHQuIERlZmF1bHQ6IG5vLlxuICAnZml4ZWRIZWFkZXI6IGZpeGVkLWhlYWRlcicsXG5cbiAgLy8gc2hvdy10aXRsZSBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHRoZSB0YWJsZSB0aXRsZS4gRGVmYXVsdDogbm8uXG4gICdzaG93VGl0bGU6IHNob3ctdGl0bGUnLFxuXG4gIC8vIGVkaXRpb24tbW9kZSBbbm9uZSB8IGlubGluZSB8IGNsaWNrIHwgZGJsY2xpY2tdOiBlZGl0aW9uIG1vZGUuIERlZmF1bHQgbm9uZVxuICAnZWRpdGlvbk1vZGU6IGVkaXRpb24tbW9kZScsXG5cbiAgLy8gc2VsZWN0aW9uLW1vZGUgW25vbmUgfCBzaW1wbGUgfCBtdWx0aXBsZSBdOiBzZWxlY3Rpb24gbW9kZS4gRGVmYXVsdCBtdWx0aXBsZVxuICAnc2VsZWN0aW9uTW9kZTogc2VsZWN0aW9uLW1vZGUnLFxuXG4gICdob3Jpem9udGFsU2Nyb2xsOiBob3Jpem9udGFsLXNjcm9sbCcsXG5cbiAgJ3Nob3dQYWdpbmF0b3JGaXJzdExhc3RCdXR0b25zOiBzaG93LXBhZ2luYXRvci1maXJzdC1sYXN0LWJ1dHRvbnMnLFxuXG4gICdhdXRvQWxpZ25UaXRsZXM6IGF1dG8tYWxpZ24tdGl0bGVzJyxcblxuICAnbXVsdGlwbGVTb3J0OiBtdWx0aXBsZS1zb3J0JyxcbiAgLy8gc2VsZWN0LWFsbC1jaGVja2JveC12aXNpYmxlIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgc2VsZWN0aW9uIGNoZWNrIGJveGVzLkRlZmF1bHQ6IG5vLlxuICAnc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlOiBzZWxlY3QtYWxsLWNoZWNrYm94LXZpc2libGUnLFxuXG4gICdvcmRlcmFibGUnLFxuXG4gICdyZXNpemFibGUnLFxuXG4gIC8vIGVuYWJsZWQgW3llc3xub3x0cnVlfGZhbHNlXTogZW5hYmxlcyBkZSB0YWJsZS4gRGVmYXVsdDogeWVzXG4gICdlbmFibGVkJyxcblxuICAna2VlcFNlbGVjdGVkSXRlbXM6IGtlZXAtc2VsZWN0ZWQtaXRlbXMnLFxuXG4gIC8vIGV4cG9ydC1tb2RlIFsndmlzaWJsZSd8J2xvY2FsJ3wnYWxsJ106IHNldHMgdGhlIG1vZGUgdG8gZXhwb3J0IGRhdGEuIERlZmF1bHQ6ICd2aXNpYmxlJ1xuICAnZXhwb3J0TW9kZTogZXhwb3J0LW1vZGUnLFxuXG4gIC8vIGV4cG9ydFNlcnZpY2VUeXBlIFsgc3RyaW5nIF06IFRoZSBzZXJ2aWNlIHVzZWQgYnkgdGhlIHRhYmxlIGZvciBleHBvcnRpbmcgaXQncyBkYXRhLCBpdCBtdXN0IGltcGxlbWVudCAnSUV4cG9ydFNlcnZpY2UnIGludGVyZmFjZS4gRGVmYXVsdDogJ09udGltaXplRXhwb3J0U2VydmljZSdcbiAgJ2V4cG9ydFNlcnZpY2VUeXBlOiBleHBvcnQtc2VydmljZS10eXBlJyxcblxuICAvLyBhdXRvLWFkanVzdCBbdHJ1ZXxmYWxzZV06IEF1dG8gYWRqdXN0IGNvbHVtbiB3aWR0aCB0byBmaXQgaXRzIGNvbnRlbnQuIERlZmF1bHQ6IGZhbHNlXG4gICdhdXRvQWRqdXN0OiBhdXRvLWFkanVzdCcsXG5cbiAgLy8gc2hvdy1maWx0ZXItb3B0aW9uIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgZmlsdGVyIG1lbnUgb3B0aW9uIGluIHRoZSBoZWFkZXIgbWVudS4gRGVmYXVsdDogeWVzLlxuICAnc2hvd0ZpbHRlck9wdGlvbjogc2hvdy1maWx0ZXItb3B0aW9uJyxcblxuICAvLyB2aXNpYmxlLWV4cG9ydC1kaWFsb2ctYnV0dG9ucyBbc3RyaW5nXTogdmlzaWJsZSBidXR0b25zIGluIGV4cG9ydCBkaWFsb2csIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQvbm8gY29uZmlndXJlZDogc2hvdyBhbGwuIEVtcHR5IHZhbHVlOiBoaWRlIGFsbC5cbiAgJ3Zpc2libGVFeHBvcnREaWFsb2dCdXR0b25zOiB2aXNpYmxlLWV4cG9ydC1kaWFsb2ctYnV0dG9ucycsXG5cbiAgLy8gcm93LWNsYXNzIFtmdW5jdGlvbiwgKHJvd0RhdGE6IGFueSwgcm93SW5kZXg6IG51bWJlcikgPT4gc3RyaW5nIHwgc3RyaW5nW11dOiBhZGRzIHRoZSBjbGFzcyBvciBjbGFzc2VzIHJldHVybmVkIGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbiB0byB0aGUgdGFibGUgcm93cy5cbiAgJ3Jvd0NsYXNzOiByb3ctY2xhc3MnLFxuXG4gIC8vIGZpbHRlci1jb2x1bW4tYWN0aXZlLWJ5LWRlZmF1bHQgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBpY29uIGZpbHRlciBieSBkZWZhdWx0IGluIHRoZSB0YWJsZVxuICAnZmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0OmZpbHRlci1jb2x1bW4tYWN0aXZlLWJ5LWRlZmF1bHQnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEUgPSBbXG4gICdvbkNsaWNrJyxcbiAgJ29uRG91YmxlQ2xpY2snLFxuICAnb25Sb3dTZWxlY3RlZCcsXG4gICdvblJvd0Rlc2VsZWN0ZWQnLFxuICAnb25Sb3dEZWxldGVkJyxcbiAgJ29uRGF0YUxvYWRlZCcsXG4gICdvblBhZ2luYXRlZERhdGFMb2FkZWQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplU2VydmljZVByb3ZpZGVyLFxuICAgIE9UYWJsZURhdGFTb3VyY2VTZXJ2aWNlXG4gIF0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdkZXRhaWxFeHBhbmQnLCBbXG4gICAgICBzdGF0ZSgnY29sbGFwc2VkJywgc3R5bGUoeyBoZWlnaHQ6ICcwcHgnLCBtaW5IZWlnaHQ6ICcwJyB9KSksXG4gICAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7IGhlaWdodDogJyonIH0pKSxcbiAgICAgIHRyYW5zaXRpb24oJ2V4cGFuZGVkIDw9PiBjb2xsYXBzZWQnLCBhbmltYXRlKCcyMjVtcyBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSknKSksXG4gICAgXSlcbiAgXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tdGFibGVdJzogJ3RydWUnLFxuICAgICdbY2xhc3Mub250aW1pemUtdGFibGVdJzogJ3RydWUnLFxuICAgICdbY2xhc3Muby10YWJsZS1maXhlZF0nOiAnZml4ZWRIZWFkZXInLFxuICAgICdbY2xhc3Muby10YWJsZS1kaXNhYmxlZF0nOiAnIWVuYWJsZWQnLFxuICAgICcoZG9jdW1lbnQ6Y2xpY2spJzogJ2hhbmRsZURPTUNsaWNrKCRldmVudCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ29tcG9uZW50IGV4dGVuZHMgT1NlcnZpY2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgcHVibGljIHN0YXRpYyBERUZBVUxUX0JBU0VfU0laRV9TUElOTkVSID0gMTAwO1xuICBwdWJsaWMgc3RhdGljIEZJUlNUX0xBU1RfQ0VMTF9QQURESU5HID0gMjQ7XG4gIHB1YmxpYyBzdGF0aWMgRVhQQU5ERURfUk9XX0NPTlRBSU5FUl9DTEFTUyA9ICdleHBhbmRlZC1yb3ctY29udGFpbmVyLSc7XG5cbiAgcHJvdGVjdGVkIHNuYWNrQmFyU2VydmljZTogU25hY2tCYXJTZXJ2aWNlO1xuXG4gIHB1YmxpYyBwYWdpbmF0b3I6IE9UYWJsZVBhZ2luYXRvcjtcbiAgQFZpZXdDaGlsZChNYXRQYWdpbmF0b3IsIHsgc3RhdGljOiBmYWxzZSB9KSBtYXRwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcbiAgQFZpZXdDaGlsZChPTWF0U29ydCwgeyBzdGF0aWM6IHRydWUgfSkgc29ydDogT01hdFNvcnQ7XG5cbiAgLy8gb25seSBmb3IgaW5zaWRlVGFiQnVnV29ya2Fyb3VuZFxuICBAVmlld0NoaWxkcmVuKE9NYXRTb3J0SGVhZGVyKSBwcm90ZWN0ZWQgc29ydEhlYWRlcnM6IFF1ZXJ5TGlzdDxPTWF0U29ydEhlYWRlcj47XG5cbiAgQFZpZXdDaGlsZCgnc3Bpbm5lckNvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBzcGlubmVyQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gIEBDb250ZW50Q2hpbGQoT1RhYmxlUm93RXhwYW5kYWJsZUNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHRhYmxlUm93RXhwYW5kYWJsZTogT1RhYmxlUm93RXhwYW5kYWJsZUNvbXBvbmVudDtcblxuICBfZmlsdGVyQ29sdW1uczogQXJyYXk8T0ZpbHRlckNvbHVtbj47XG4gIHBvcnRhbEhvc3Q6IERvbVBvcnRhbE91dGxldDtcblxuICBnZXQgZGlhbWV0ZXJTcGlubmVyKCkge1xuICAgIGNvbnN0IG1pbkhlaWdodCA9IE9UYWJsZUNvbXBvbmVudC5ERUZBVUxUX0JBU0VfU0laRV9TUElOTkVSO1xuICAgIGxldCBoZWlnaHQgPSAwO1xuICAgIGlmICh0aGlzLnNwaW5uZXJDb250YWluZXIgJiYgdGhpcy5zcGlubmVyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuc3Bpbm5lckNvbnRhaW5lci5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9XG4gICAgaWYgKGhlaWdodCA+IDAgJiYgaGVpZ2h0IDw9IDEwMCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoaGVpZ2h0IC0gKGhlaWdodCAqIDAuMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbWluSGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB0YWJsZUNvbnRleHRNZW51OiBPQ29udGV4dE1lbnVDb21wb25lbnQ7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgc2VsZWN0QWxsQ2hlY2tib3g6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgZXhwb3J0QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0NvbmZpZ3VyYXRpb25PcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dGaWx0ZXJPcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93QnV0dG9uc1RleHQ6IGJvb2xlYW4gPSB0cnVlO1xuXG5cbiAgb3JpZ2luYWxGaWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2V0IGZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IHJlc3VsdCA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMub3JpZ2luYWxGaWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHQgPSByZXN1bHQ7XG4gICAgdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gcmVzdWx0O1xuICB9XG5cbiAgZ2V0IGZpbHRlckNvbHVtbkFjdGl2ZUJ5RGVmYXVsdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9vVGFibGVPcHRpb25zOiBPVGFibGVPcHRpb25zO1xuXG4gIGdldCBvVGFibGVPcHRpb25zKCk6IE9UYWJsZU9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vVGFibGVPcHRpb25zO1xuICB9XG5cbiAgc2V0IG9UYWJsZU9wdGlvbnModmFsdWU6IE9UYWJsZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zID0gdmFsdWU7XG4gIH1cblxuICBzZXQgcXVpY2tGaWx0ZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKFN0cmluZyh2YWx1ZSkpO1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5maWx0ZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBxdWlja0ZpbHRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcXVpY2tGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgZmlsdGVyQ2FzZVNlbnNpdGl2ZVB2dDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZXQgZmlsdGVyQ2FzZVNlbnNpdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZVB2dCA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIGlmICh0aGlzLl9vVGFibGVPcHRpb25zKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmZpbHRlckNhc2VTZW5zaXRpdmUgPSB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQ7XG4gICAgfVxuICB9XG4gIGdldCBmaWx0ZXJDYXNlU2Vuc2l0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQ7XG4gIH1cbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5zZXJ0QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcmVmcmVzaEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHBhZ2luYXRpb25Db250cm9sczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGZpeGVkSGVhZGVyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dUaXRsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBlZGl0aW9uTW9kZTogc3RyaW5nID0gQ29kZXMuREVUQUlMX01PREVfTk9ORTtcbiAgc2VsZWN0aW9uTW9kZTogc3RyaW5nID0gQ29kZXMuU0VMRUNUSU9OX01PREVfTVVMVElQTEU7XG5cbiAgcHJvdGVjdGVkIF9ob3Jpem9udGFsU2Nyb2xsID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNldCBob3Jpem9udGFsU2Nyb2xsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5faG9yaXpvbnRhbFNjcm9sbCA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMucmVmcmVzaENvbHVtbnNXaWR0aCgpO1xuXG4gIH1cblxuICBnZXQgaG9yaXpvbnRhbFNjcm9sbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faG9yaXpvbnRhbFNjcm9sbDtcbiAgfVxuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dQYWdpbmF0b3JGaXJzdExhc3RCdXR0b25zOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgYXV0b0FsaWduVGl0bGVzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG11bHRpcGxlU29ydDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG9yZGVyYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHJlc2l6YWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGF1dG9BZGp1c3Q6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgfVxuICBzZXQgZW5hYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5fZW5hYmxlZCA9IHZhbDtcbiAgfVxuICBwcm90ZWN0ZWQgX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTogYm9vbGVhbjtcbiAgc2V0IHNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZSA9IEJvb2xlYW5Db252ZXJ0ZXIodGhpcy5zdGF0ZVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ10pIHx8IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSB0aGlzLl9zZWxlY3RBbGxDaGVja2JveFZpc2libGU7XG4gICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgfVxuXG4gIGdldCBzZWxlY3RBbGxDaGVja2JveFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTtcbiAgfVxuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGtlZXBTZWxlY3RlZEl0ZW1zOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZXhwb3J0TW9kZTogc3RyaW5nID0gQ29kZXMuRVhQT1JUX01PREVfVklTSUJMRTtcbiAgcHVibGljIGV4cG9ydFNlcnZpY2VUeXBlOiBzdHJpbmc7XG4gIHB1YmxpYyB2aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9uczogc3RyaW5nO1xuICBwdWJsaWMgZGFvVGFibGU6IE9UYWJsZURhbyB8IG51bGw7XG4gIHB1YmxpYyBkYXRhU291cmNlOiBPVGFibGVEYXRhU291cmNlIHwgbnVsbDtcbiAgcHVibGljIHZpc2libGVDb2x1bW5zOiBzdHJpbmc7XG4gIHB1YmxpYyBzb3J0Q29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgcm93Q2xhc3M6IChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIF92aXNpYmxlQ29sQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBnZXQgdmlzaWJsZUNvbEFycmF5KCk6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlQ29sQXJyYXk7XG4gIH1cblxuICBzZXQgdmlzaWJsZUNvbEFycmF5KGFyZzogQXJyYXk8YW55Pikge1xuICAgIGNvbnN0IHBlcm1pc3Npb25zQmxvY2tlZCA9IHRoaXMucGVybWlzc2lvbnMgPyB0aGlzLnBlcm1pc3Npb25zLmNvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wudmlzaWJsZSA9PT0gZmFsc2UpLm1hcChjb2wgPT4gY29sLmF0dHIpIDogW107XG4gICAgY29uc3QgcGVybWlzc2lvbnNDaGVja2VkID0gYXJnLmZpbHRlcih2YWx1ZSA9PiBwZXJtaXNzaW9uc0Jsb2NrZWQuaW5kZXhPZih2YWx1ZSkgPT09IC0xKTtcbiAgICB0aGlzLl92aXNpYmxlQ29sQXJyYXkgPSBwZXJtaXNzaW9uc0NoZWNrZWQ7XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5zU2VsZWN0aW9uQ29sID0gdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCkgIT09IC0xO1xuICAgICAgY29uc3QgY29udGFpbnNFeHBhbmRhYmxlQ29sID0gdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKENvZGVzLk5BTUVfQ09MVU1OX0VYUEFOREFCTEUpICE9PSAtMTtcbiAgICAgIGlmIChjb250YWluc1NlbGVjdGlvbkNvbCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlQ29sQXJyYXkudW5zaGlmdChDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uQ29sICYmIGNvbnRhaW5zRXhwYW5kYWJsZUNvbCkge1xuICAgICAgICB0aGlzLl92aXNpYmxlQ29sQXJyYXkgPSBbdGhpcy5fdmlzaWJsZUNvbEFycmF5WzBdXS5jb25jYXQoQ29kZXMuTkFNRV9DT0xVTU5fRVhQQU5EQUJMRSwgdGhpcy5fdmlzaWJsZUNvbEFycmF5LnNwbGljZSgxKSk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjb250YWluc0V4cGFuZGFibGVDb2wpIHtcbiAgICAgICAgICB0aGlzLl92aXNpYmxlQ29sQXJyYXkudW5zaGlmdChDb2Rlcy5OQU1FX0NPTFVNTl9FWFBBTkRBQkxFKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucyA9IHRoaXMuX3Zpc2libGVDb2xBcnJheTtcbiAgICB9XG4gIH1cblxuICBzb3J0Q29sQXJyYXk6IEFycmF5PFNRTE9yZGVyPiA9IFtdO1xuICAvKmVuZCBvZiBwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIHByb3RlY3RlZCB0YWJHcm91cENvbnRhaW5lcjogTWF0VGFiR3JvdXA7XG4gIHByb3RlY3RlZCB0YWJDb250YWluZXI6IE1hdFRhYjtcbiAgdGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcm90ZWN0ZWQgcGVuZGluZ1F1ZXJ5OiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBwZW5kaW5nUXVlcnlGaWx0ZXIgPSB1bmRlZmluZWQ7XG5cbiAgcHJvdGVjdGVkIHNldFN0YXRpY0RhdGE6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGF2b2lkUXVlcnlDb2x1bW5zOiBBcnJheTxhbnk+ID0gW107XG4gIHByb3RlY3RlZCBhc3luY0xvYWRDb2x1bW5zOiBBcnJheTxhbnk+ID0gW107XG4gIHByb3RlY3RlZCBhc3luY0xvYWRTdWJzY3JpcHRpb25zOiBvYmplY3QgPSB7fTtcblxuICBwcm90ZWN0ZWQgcXVlcnlTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGNvbnRleHRNZW51U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBmaW5pc2hRdWVyeVN1YnNjcmlwdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8T25DbGlja1RhYmxlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Eb3VibGVDbGljazogRXZlbnRFbWl0dGVyPE9uQ2xpY2tUYWJsZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUm93U2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Sb3dEZXNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUm93RGVsZXRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkRhdGFMb2FkZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25QYWdpbmF0ZWREYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUmVpbml0aWFsaXplOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uQ29udGVudENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblZpc2libGVDb2x1bW5zQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRmlsdGVyQnlDb2x1bW5DaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByb3RlY3RlZCBzZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwdWJsaWMgb1RhYmxlRmlsdGVyQnlDb2x1bW5EYXRhRGlhbG9nQ29tcG9uZW50OiBPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQ7XG4gIHB1YmxpYyBvVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50OiBPVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50O1xuICBwdWJsaWMgc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG5cbiAgcHJpdmF0ZSBzaG93VG90YWxzU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwdWJsaWMgc2hvd1RvdGFsczogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMuc2hvd1RvdGFsc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHByaXZhdGUgbG9hZGluZ1NvcnRpbmdTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHByb3RlY3RlZCBsb2FkaW5nU29ydGluZzogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMubG9hZGluZ1NvcnRpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBwcml2YXRlIGxvYWRpbmdTY3JvbGxTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHB1YmxpYyBsb2FkaW5nU2Nyb2xsOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5sb2FkaW5nU2Nyb2xsU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICBwdWJsaWMgb1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudDogT1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudDtcbiAgcHVibGljIHNob3dGaXJzdEluc2VydGFibGVSb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHNob3dMYXN0SW5zZXJ0YWJsZVJvdzogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgZXhwYW5kYWJsZUl0ZW0gPSBuZXcgU2VsZWN0aW9uTW9kZWw8RWxlbWVudD4oZmFsc2UsIFtdKTtcblxuICBwcm90ZWN0ZWQgY2xpY2tUaW1lcjtcbiAgcHJvdGVjdGVkIGNsaWNrRGVsYXkgPSAyMDA7XG4gIHByb3RlY3RlZCBjbGlja1ByZXZlbnQgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGVkaXRpbmdDZWxsOiBhbnk7XG4gIHByb3RlY3RlZCBlZGl0aW5nUm93OiBhbnk7XG5cbiAgcHJvdGVjdGVkIF9jdXJyZW50UGFnZTogbnVtYmVyID0gMDtcblxuICBzZXQgY3VycmVudFBhZ2UodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jdXJyZW50UGFnZSA9IHZhbDtcbiAgICBpZiAodGhpcy5wYWdpbmF0b3IpIHtcbiAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCA9IHZhbDtcbiAgICAgIGlmICh0aGlzLm1hdHBhZ2luYXRvcikge1xuICAgICAgICB0aGlzLm1hdHBhZ2luYXRvci5wYWdlSW5kZXggPSB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGN1cnJlbnRQYWdlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYWdlO1xuICB9XG5cbiAgcHVibGljIG9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50OiBPVGFibGVRdWlja2ZpbHRlcjtcbiAgcHJvdGVjdGVkIHNvcnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIG9uUmVuZGVyZWREYXRhQ2hhbmdlOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBwcmV2aW91c1JlbmRlcmVyRGF0YTtcblxuICBxdWlja0ZpbHRlckNhbGxiYWNrOiBRdWlja0ZpbHRlckZ1bmN0aW9uO1xuXG4gIEBWaWV3Q2hpbGQoJ3RhYmxlQm9keScsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgdGFibGVCb2R5RWw6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYmxlSGVhZGVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIHRhYmxlSGVhZGVyRWw6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3RhYmxlVG9vbGJhcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICB0YWJsZVRvb2xiYXJFbDogRWxlbWVudFJlZjtcblxuICBob3Jpem9udGFsU2Nyb2xsZWQ6IGJvb2xlYW47XG4gIHB1YmxpYyBvblVwZGF0ZVNjcm9sbGVkU3RhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgcm93V2lkdGg7XG5cbiAgb1RhYmxlU3RvcmFnZTogT1RhYmxlU3RvcmFnZTtcbiAgc3RvcmVQYWdpbmF0aW9uU3RhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiBJbiB0aGUgY2FzZSB0aGUgdGFibGUgaGF2ZW50IHBhZ2luYXRpb25Db250cm9sIGFuZCBwYWdlYWJsZSwgdGhlIHRhYmxlIGhhcyBwYWdpbmF0aW9uIHZpcnR1YWwqL1xuICBwYWdlU2Nyb2xsVmlydHVhbCA9IDE7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zOiBPVGFibGVQZXJtaXNzaW9ucztcbiAgbWF0TWVudTogTWF0TWVudTtcblxuICBAVmlld0NoaWxkKCd0YWJsZU1lbnUnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgb1RhYmxlTWVudTogT1RhYmxlTWVudTtcblxuICBAQ29udGVudENoaWxkcmVuKE9UYWJsZU9wdGlvbkNvbXBvbmVudClcbiAgdGFibGVPcHRpb25zOiBRdWVyeUxpc3Q8T1RhYmxlT3B0aW9uQ29tcG9uZW50PjtcblxuICBvVGFibGVCdXR0b25zOiBPVGFibGVCdXR0b25zO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oJ28tdGFibGUtYnV0dG9uJylcbiAgdGFibGVCdXR0b25zOiBRdWVyeUxpc3Q8T1RhYmxlQnV0dG9uPjtcblxuICBAQ29udGVudENoaWxkKCdvLXRhYmxlLXF1aWNrZmlsdGVyJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcXVpY2tmaWx0ZXJDb250ZW50Q2hpbGQ6IE9UYWJsZVF1aWNrZmlsdGVyO1xuXG4gIEBWaWV3Q2hpbGQoJ2V4cG9ydE9wdHNUZW1wbGF0ZScsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBleHBvcnRPcHRzVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFtdKVxuICB1cGRhdGVTY3JvbGxlZFN0YXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhvcml6b250YWxTY3JvbGwpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBib2R5V2lkdGggPSB0aGlzLnRhYmxlQm9keUVsLm5hdGl2ZUVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIGNvbnN0IHNjcm9sbFdpZHRoID0gdGhpcy50YWJsZUJvZHlFbC5uYXRpdmVFbGVtZW50LnNjcm9sbFdpZHRoO1xuICAgICAgICBjb25zdCBwcmV2aW91c1N0YXRlID0gdGhpcy5ob3Jpem9udGFsU2Nyb2xsZWQ7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGVkID0gc2Nyb2xsV2lkdGggPiBib2R5V2lkdGg7XG4gICAgICAgIGlmIChwcmV2aW91c1N0YXRlICE9PSB0aGlzLmhvcml6b250YWxTY3JvbGxlZCkge1xuICAgICAgICAgIHRoaXMub25VcGRhdGVTY3JvbGxlZFN0YXRlLmVtaXQodGhpcy5ob3Jpem9udGFsU2Nyb2xsZWQpO1xuICAgICAgICB9XG4gICAgICB9LCAwKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoQ29sdW1uc1dpZHRoKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGRpYWxvZzogTWF0RGlhbG9nLFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHByaXZhdGUgX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50XG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbFJlZiwgZm9ybSk7XG5cbiAgICB0aGlzLl9vVGFibGVPcHRpb25zID0gbmV3IERlZmF1bHRPVGFibGVPcHRpb25zKCk7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4gPSB0aGlzLmNyZWF0ZU9Db2x1bW4oKTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLnRhYkdyb3VwQ29udGFpbmVyID0gdGhpcy5pbmplY3Rvci5nZXQoTWF0VGFiR3JvdXApO1xuICAgICAgdGhpcy50YWJDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRUYWIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBEbyBub3RoaW5nIGR1ZSB0byBub3QgYWx3YXlzIGlzIGNvbnRhaW5lZCBvbiB0YWIuXG4gICAgfVxuXG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChTbmFja0JhclNlcnZpY2UpO1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZSA9IG5ldyBPVGFibGVTdG9yYWdlKHRoaXMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgaWYgKHRoaXMub1RhYmxlQnV0dG9ucykge1xuICAgICAgdGhpcy5vVGFibGVCdXR0b25zLnJlZ2lzdGVyQnV0dG9ucyh0aGlzLnRhYmxlQnV0dG9ucy50b0FycmF5KCkpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmFmdGVyVmlld0luaXQoKTtcbiAgICB0aGlzLmluaXRUYWJsZUFmdGVyVmlld0luaXQoKTtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm1hdE1lbnUgPSB0aGlzLm9UYWJsZU1lbnUubWF0TWVudTtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5yZWdpc3Rlck9wdGlvbnModGhpcy50YWJsZU9wdGlvbnMudG9BcnJheSgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGFibGVSb3dFeHBhbmRhYmxlKSB7XG4gICAgICB0aGlzLmNyZWF0ZUV4cGFuZGFibGVDb2x1bW4oKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY3JlYXRlRXhwYW5kYWJsZUNvbHVtbigpIHtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmV4cGFuZGFibGVDb2x1bW4gPSBuZXcgT0NvbHVtbigpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuZXhwYW5kYWJsZUNvbHVtbi52aXNpYmxlID0gdGhpcy50YWJsZVJvd0V4cGFuZGFibGUgJiYgdGhpcy50YWJsZVJvd0V4cGFuZGFibGUuZXhwYW5kYWJsZUNvbHVtblZpc2libGU7XG4gICAgdGhpcy51cGRhdGVTdGF0ZUV4cGFuZGVkQ29sdW1uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldFN1ZmZpeENvbHVtbkluc2VydGFibGUoKSB7XG4gICAgcmV0dXJuIENvZGVzLlNVRkZJWF9DT0xVTU5fSU5TRVJUQUJMRTtcbiAgfVxuXG4gIGdldEFjdGlvbnNQZXJtaXNzaW9ucygpOiBPUGVybWlzc2lvbnNbXSB7XG4gICAgcmV0dXJuIHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICB9XG5cbiAgZ2V0TWVudVBlcm1pc3Npb25zKCk6IE9UYWJsZU1lbnVQZXJtaXNzaW9ucyB7XG4gICAgY29uc3QgcmVzdWx0OiBPVGFibGVNZW51UGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zID8gdGhpcy5wZXJtaXNzaW9ucy5tZW51IDogdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQgOiB7XG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiBbXVxuICAgIH07XG4gIH1cblxuICBnZXRPQ29sdW1uUGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wZXJtaXNzaW9ucyA/ICh0aGlzLnBlcm1pc3Npb25zLmNvbHVtbnMgfHwgW10pIDogW107XG4gICAgcmV0dXJuIGNvbHVtbnMuZmluZChjb21wID0+IGNvbXAuYXR0ciA9PT0gYXR0cikgfHwgeyBhdHRyOiBhdHRyLCBlbmFibGVkOiB0cnVlLCB2aXNpYmxlOiB0cnVlIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0QWN0aW9uUGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBjb25zdCBhY3Rpb25zUGVybSA9IHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICAgIGNvbnN0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSBhY3Rpb25zUGVybS5maW5kKHAgPT4gcC5hdHRyID09PSBhdHRyKTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnMgfHwge1xuICAgICAgYXR0cjogYXR0cixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBlbmFibGVkOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKGF0dHI6IHN0cmluZykge1xuICAgIGNvbnN0IGFjdGlvbnNQZXJtID0gdGhpcy5wZXJtaXNzaW9ucyA/ICh0aGlzLnBlcm1pc3Npb25zLmFjdGlvbnMgfHwgW10pIDogW107XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9IGFjdGlvbnNQZXJtLmZpbmQocCA9PiBwLmF0dHIgPT09IGF0dHIpO1xuICAgIGNvbnN0IGVuYWJsZWRQZXJtaXNpb24gPSBQZXJtaXNzaW9uc1V0aWxzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24ocGVybWlzc2lvbnMpO1xuICAgIGlmICghZW5hYmxlZFBlcm1pc2lvbikge1xuICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuT1BFUkFUSU9OX05PVF9BTExPV0VEX1BFUk1JU1NJT04nKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZWRQZXJtaXNpb247XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHdoYXQgaW5pdGlhbGl6ZSB2YXJzIGFuZCBjb25maWd1cmF0aW9uXG4gICAqL1xuICBpbml0aWFsaXplKCk6IGFueSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucyA9IG5ldyBEZWZhdWx0T1RhYmxlT3B0aW9ucygpO1xuICAgIGlmICh0aGlzLnRhYkdyb3VwQ29udGFpbmVyICYmIHRoaXMudGFiQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyVGFiTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHBhcmFtcyBvZiB0aGUgdGFibGVcbiAgICB0aGlzLmluaXRpYWxpemVQYXJhbXMoKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZURhbygpO1xuXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlLmdldFRhYmxlUGVybWlzc2lvbnModGhpcy5vYXR0ciwgdGhpcy5hY3RSb3V0ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZURhbygpIHtcbiAgICAvLyBDb25maWd1cmUgZGFvIG1ldGhvZHNcbiAgICBjb25zdCBxdWVyeU1ldGhvZE5hbWUgPSB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2Q7XG4gICAgY29uc3QgbWV0aG9kcyA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeU1ldGhvZE5hbWUsXG4gICAgICB1cGRhdGU6IHRoaXMudXBkYXRlTWV0aG9kLFxuICAgICAgZGVsZXRlOiB0aGlzLmRlbGV0ZU1ldGhvZCxcbiAgICAgIGluc2VydDogdGhpcy5pbnNlcnRNZXRob2RcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSkge1xuICAgICAgdGhpcy5xdWVyeU9uQmluZCA9IGZhbHNlO1xuICAgICAgdGhpcy5xdWVyeU9uSW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5kYW9UYWJsZSA9IG5ldyBPVGFibGVEYW8odW5kZWZpbmVkLCB0aGlzLmVudGl0eSwgbWV0aG9kcyk7XG4gICAgICB0aGlzLnNldERhdGFBcnJheSh0aGlzLnN0YXRpY0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZVNlcnZpY2UoKTtcbiAgICAgIHRoaXMuZGFvVGFibGUgPSBuZXcgT1RhYmxlRGFvKHRoaXMuZGF0YVNlcnZpY2UsIHRoaXMuZW50aXR5LCBtZXRob2RzKTtcbiAgICB9XG4gIH1cblxuICByZWluaXRpYWxpemUob3B0aW9uczogT1RhYmxlSW5pdGlhbGl6YXRpb25PcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNsb25lZE9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdlbnRpdHknKSkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IGNsb25lZE9wdHMuZW50aXR5O1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ3NlcnZpY2UnKSkge1xuICAgICAgICB0aGlzLnNlcnZpY2UgPSBjbG9uZWRPcHRzLnNlcnZpY2U7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnY29sdW1ucycpKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IGNsb25lZE9wdHMuY29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCd2aXNpYmxlQ29sdW1ucycpKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZUNvbHVtbnMgPSBjbG9uZWRPcHRzLnZpc2libGVDb2x1bW5zO1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ2tleXMnKSkge1xuICAgICAgICB0aGlzLmtleXMgPSBjbG9uZWRPcHRzLmtleXM7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnc29ydENvbHVtbnMnKSkge1xuICAgICAgICB0aGlzLnNvcnRDb2x1bW5zID0gY2xvbmVkT3B0cy5zb3J0Q29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdwYXJlbnRLZXlzJykpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRLZXlzID0gY2xvbmVkT3B0cy5wYXJlbnRLZXlzO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyQ29sdW1ucycpKSB7XG4gICAgICAgIGlmICghdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICAgICAgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50ID0gbmV3IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQodGhpcy5pbmplY3RvciwgdGhpcyk7XG4gICAgICAgICAgdGhpcy5vVGFibGVNZW51Lm9uVmlzaWJsZUZpbHRlck9wdGlvbkNoYW5nZS5uZXh0KHRoaXMuZmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuY29sdW1ucyA9IGNsb25lZE9wdHMuZmlsdGVyQ29sdW1ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9UYWJsZVN0b3JhZ2UucmVzZXQoKTtcbiAgICB0aGlzLmluaXRUYWJsZUFmdGVyVmlld0luaXQoKTtcbiAgICB0aGlzLm9uUmVpbml0aWFsaXplLmVtaXQobnVsbCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdFRhYmxlQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnBhcnNlVmlzaWJsZUNvbHVtbnMoKTtcbiAgICB0aGlzLnNldERhdGFzb3VyY2UoKTtcbiAgICB0aGlzLnJlZ2lzdGVyRGF0YVNvdXJjZUxpc3RlbmVycygpO1xuICAgIHRoaXMucGFyc2VTb3J0Q29sdW1ucygpO1xuICAgIHRoaXMucmVnaXN0ZXJTb3J0TGlzdGVuZXIoKTtcbiAgICB0aGlzLnNldEZpbHRlcnNDb25maWd1cmF0aW9uKHRoaXMuc3RhdGUpO1xuICAgIHRoaXMuYWRkRGVmYXVsdFJvd0J1dHRvbnMoKTtcblxuICAgIGlmICh0aGlzLnF1ZXJ5T25Jbml0KSB7XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLnRhYkdyb3VwQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnRhYkdyb3VwQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zb3J0U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNvcnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UpIHtcbiAgICAgIHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UudW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb250ZXh0TWVudVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jb250ZXh0TWVudVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyh0aGlzLmFzeW5jTG9hZFN1YnNjcmlwdGlvbnMpLmZvckVhY2goaWR4ID0+IHtcbiAgICAgIGlmICh0aGlzLmFzeW5jTG9hZFN1YnNjcmlwdGlvbnNbaWR4XSkge1xuICAgICAgICB0aGlzLmFzeW5jTG9hZFN1YnNjcmlwdGlvbnNbaWR4XS51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB1cGRhdGUgc3RvcmUgbG9jYWxzdG9yYWdlLCBjYWxsIG9mIHRoZSBJTG9jYWxTdG9yYWdlXG4gICAqL1xuICBnZXREYXRhVG9TdG9yZSgpIHtcbiAgICByZXR1cm4gdGhpcy5vVGFibGVTdG9yYWdlLmdldERhdGFUb1N0b3JlKCk7XG4gIH1cblxuICByZWdpc3RlclF1aWNrRmlsdGVyKGFyZzogYW55KSB7XG4gICAgY29uc3QgcXVpY2tGaWx0ZXIgPSAoYXJnIGFzIE9UYWJsZVF1aWNrZmlsdGVyKTtcbiAgICAvLyBmb3JjaW5nIHF1aWNrRmlsdGVyQ29tcG9uZW50IHRvIGJlIHVuZGVmaW5lZCwgdGFibGUgdXNlcyBvVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudFxuICAgIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudCA9IHF1aWNrRmlsdGVyO1xuICAgIHRoaXMub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQuc2V0VmFsdWUodGhpcy5zdGF0ZS5maWx0ZXIsIGZhbHNlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyUGFnaW5hdGlvbih2YWx1ZTogT1RhYmxlUGFnaW5hdG9yKSB7XG4gICAgdGhpcy5wYWdpbmF0aW9uQ29udHJvbHMgPSB0cnVlO1xuICAgIHRoaXMucGFnaW5hdG9yID0gdmFsdWU7XG4gIH1cblxuICByZWdpc3RlckNvbnRleHRNZW51KHZhbHVlOiBPQ29udGV4dE1lbnVDb21wb25lbnQpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlQ29udGV4dE1lbnUgPSB2YWx1ZTtcbiAgICB0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uID0gdGhpcy50YWJsZUNvbnRleHRNZW51Lm9uU2hvdy5zdWJzY3JpYmUoKHBhcmFtczogSU9Db250ZXh0TWVudUNvbnRleHQpID0+IHtcbiAgICAgIHBhcmFtcy5jbGFzcyA9ICdvLXRhYmxlLWNvbnRleHQtbWVudSAnICsgdGhpcy5yb3dIZWlnaHQ7XG4gICAgICBpZiAocGFyYW1zLmRhdGEgJiYgIXRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQocGFyYW1zLmRhdGEucm93VmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFJvdyhwYXJhbXMuZGF0YS5yb3dWYWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3RlckRlZmF1bHRDb2x1bW4oY29sdW1uOiBzdHJpbmcpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5nZXRPQ29sdW1uKGNvbHVtbikpKSB7XG4gICAgICAvLyBhIGRlZmF1bHQgY29sdW1uIGRlZmluaXRpb24gdHJ5aW5nIHRvIHJlcGxhY2UgYW4gYWxyZWFkeSBleGlzdGluZyBkZWZpbml0aW9uXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbERlZjogT0NvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbihjb2x1bW4sIHRoaXMpO1xuICAgIHRoaXMucHVzaE9Db2x1bW5EZWZpbml0aW9uKGNvbERlZik7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgYWxsIGNvbHVtbnMgYW5kIHByb3BlcnRpZXMgaW4gdmFyIGNvbHVtbnNBcnJheVxuICAgKiBAcGFyYW0gY29sdW1uXG4gICAqL1xuICByZWdpc3RlckNvbHVtbihjb2x1bW46IE9UYWJsZUNvbHVtbkNvbXBvbmVudCB8IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQgfCBhbnkpIHtcbiAgICBjb25zdCBjb2x1bW5BdHRyID0gKHR5cGVvZiBjb2x1bW4gPT09ICdzdHJpbmcnKSA/IGNvbHVtbiA6IGNvbHVtbi5hdHRyO1xuICAgIGNvbnN0IGNvbHVtblBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldE9Db2x1bW5QZXJtaXNzaW9ucyhjb2x1bW5BdHRyKTtcbiAgICBpZiAoIWNvbHVtblBlcm1pc3Npb25zLnZpc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbHVtbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJEZWZhdWx0Q29sdW1uKGNvbHVtbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29sdW1uRGVmID0gdGhpcy5nZXRPQ29sdW1uKGNvbHVtbi5hdHRyKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uRGVmKSAmJiBVdGlsLmlzRGVmaW5lZChjb2x1bW5EZWYuZGVmaW5pdGlvbikpIHtcbiAgICAgIC8vIGEgby10YWJsZS1jb2x1bW4gZGVmaW5pdGlvbiB0cnlpbmcgdG8gcmVwbGFjZSBhbiBhbHJlYWR5IGV4aXN0aW5nIG8tdGFibGUtY29sdW1uIGRlZmluaXRpb25cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sRGVmOiBPQ29sdW1uID0gdGhpcy5jcmVhdGVPQ29sdW1uKGNvbHVtbi5hdHRyLCB0aGlzLCBjb2x1bW4pO1xuICAgIGxldCBjb2x1bW5XaWR0aCA9IGNvbHVtbi53aWR0aDtcbiAgICBjb25zdCBzdG9yZWRDb2xzID0gdGhpcy5zdGF0ZVsnb0NvbHVtbnMtZGlzcGxheSddO1xuXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHN0b3JlZENvbHMpKSB7XG4gICAgICBjb25zdCBzdG9yZWREYXRhID0gc3RvcmVkQ29scy5maW5kKG9Db2wgPT4gb0NvbC5hdHRyID09PSBjb2xEZWYuYXR0cik7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQoc3RvcmVkRGF0YSkgJiYgVXRpbC5pc0RlZmluZWQoc3RvcmVkRGF0YS53aWR0aCkpIHtcbiAgICAgICAgLy8gY2hlY2sgdGhhdCB0aGUgd2lkdGggb2YgdGhlIGNvbHVtbnMgc2F2ZWQgaW4gdGhlIGluaXRpYWwgY29uZmlndXJhdGlvblxuICAgICAgICAvLyBpbiB0aGUgbG9jYWwgc3RvcmFnZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdvQ29sdW1ucy1kaXNwbGF5JykpIHtcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxTdG9yZWRDb2xzID0gdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ29Db2x1bW5zLWRpc3BsYXknXTtcbiAgICAgICAgICAgIGluaXRpYWxTdG9yZWRDb2xzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgIGlmIChjb2xEZWYuYXR0ciA9PT0gZWxlbWVudC5hdHRyICYmIGVsZW1lbnQud2lkdGggPT09IGNvbERlZi5kZWZpbml0aW9uLm9yaWdpbmFsV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5XaWR0aCA9IHN0b3JlZERhdGEud2lkdGg7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb2x1bW5XaWR0aCA9IHN0b3JlZERhdGEud2lkdGg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW5XaWR0aCkpIHtcbiAgICAgIGNvbERlZi53aWR0aCA9IGNvbHVtbldpZHRoO1xuICAgIH1cbiAgICBpZiAoY29sdW1uICYmIChjb2x1bW4uYXN5bmNMb2FkIHx8IGNvbHVtbi50eXBlID09PSAnYWN0aW9uJykpIHtcbiAgICAgIHRoaXMuYXZvaWRRdWVyeUNvbHVtbnMucHVzaChjb2x1bW4uYXR0cik7XG4gICAgICBpZiAoY29sdW1uLmFzeW5jTG9hZCkge1xuICAgICAgICB0aGlzLmFzeW5jTG9hZENvbHVtbnMucHVzaChjb2x1bW4uYXR0cik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucHVzaE9Db2x1bW5EZWZpbml0aW9uKGNvbERlZik7XG4gIH1cblxuICBwcm90ZWN0ZWQgcHVzaE9Db2x1bW5EZWZpbml0aW9uKGNvbERlZjogT0NvbHVtbikge1xuICAgIGNvbERlZi52aXNpYmxlID0gKHRoaXMuX3Zpc2libGVDb2xBcnJheS5pbmRleE9mKGNvbERlZi5hdHRyKSAhPT0gLTEpO1xuICAgIC8vIEZpbmQgY29sdW1uIGRlZmluaXRpb24gYnkgbmFtZVxuICAgIGNvbnN0IGFscmVhZHlFeGlzdGluZyA9IHRoaXMuZ2V0T0NvbHVtbihjb2xEZWYuYXR0cik7XG4gICAgaWYgKGFscmVhZHlFeGlzdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCByZXBsYWNpbmdJbmRleCA9IHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5pbmRleE9mKGFscmVhZHlFeGlzdGluZyk7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnNbcmVwbGFjaW5nSW5kZXhdID0gY29sRGVmO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMucHVzaChjb2xEZWYpO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2hFZGl0aW9uTW9kZVdhcm4oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWZyZXNoRWRpdGlvbk1vZGVXYXJuKCkge1xuICAgIGlmICh0aGlzLmVkaXRpb25Nb2RlICE9PSBDb2Rlcy5ERVRBSUxfTU9ERV9OT05FKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGVkaXRhYmxlQ29sdW1ucyA9IHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIoY29sID0+IHtcbiAgICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZChjb2wuZWRpdG9yKTtcbiAgICB9KTtcbiAgICBpZiAoZWRpdGFibGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUud2FybignVXNpbmcgYSBjb2x1bW4gd2l0aCBhIGVkaXRvciBidXQgdGhlcmUgaXMgbm8gZWRpdGlvbi1tb2RlIGRlZmluZWQnKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckNvbHVtbkFnZ3JlZ2F0ZShjb2x1bW46IE9Db2x1bW5BZ2dyZWdhdGUpIHtcbiAgICB0aGlzLnNob3dUb3RhbHNTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgY29uc3QgYWxyZWFkeUV4aXN0aW5nID0gdGhpcy5nZXRPQ29sdW1uKGNvbHVtbi5hdHRyKTtcbiAgICBpZiAoYWxyZWFkeUV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHJlcGxhY2luZ0luZGV4ID0gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmluZGV4T2YoYWxyZWFkeUV4aXN0aW5nKTtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1uc1tyZXBsYWNpbmdJbmRleF0uYWdncmVnYXRlID0gY29sdW1uO1xuICAgIH1cbiAgfVxuXG4gIHBhcnNlVmlzaWJsZUNvbHVtbnMoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ29Db2x1bW5zLWRpc3BsYXknKSkge1xuICAgICAgLy8gZmlsdGVyaW5nIGNvbHVtbnMgdGhhdCBtaWdodCBiZSBpbiBzdGF0ZSBzdG9yYWdlIGJ1dCBub3QgaW4gdGhlIGFjdHVhbCB0YWJsZSBkZWZpbml0aW9uXG4gICAgICBsZXQgc3RhdGVDb2xzID0gW107XG4gICAgICB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J10uZm9yRWFjaCgob0NvbCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgaXNWaXNpYmxlQ29sSW5Db2x1bW5zID0gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbmQoY29sID0+IGNvbC5hdHRyID09PSBvQ29sLmF0dHIpICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChpc1Zpc2libGVDb2xJbkNvbHVtbnMpIHtcbiAgICAgICAgICBzdGF0ZUNvbHMucHVzaChvQ29sKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1VuYWJsZSB0byBsb2FkIHRoZSBjb2x1bW4gJyArIG9Db2wuYXR0ciArICcgZnJvbSB0aGUgbG9jYWxzdG9yYWdlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc3RhdGVDb2xzID0gdGhpcy5jaGVja0NoYW5nZXNWaXNpYmxlQ29sdW1tbnNJbkluaXRpYWxDb25maWd1cmF0aW9uKHN0YXRlQ29scyk7XG4gICAgICB0aGlzLnZpc2libGVDb2xBcnJheSA9IHN0YXRlQ29scy5maWx0ZXIoaXRlbSA9PiBpdGVtLnZpc2libGUpLm1hcChpdGVtID0+IGl0ZW0uYXR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlzaWJsZUNvbEFycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMudmlzaWJsZUNvbHVtbnMsIHRydWUpO1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLnNvcnQoKGE6IE9Db2x1bW4sIGI6IE9Db2x1bW4pID0+IHRoaXMudmlzaWJsZUNvbEFycmF5LmluZGV4T2YoYS5hdHRyKSAtIHRoaXMudmlzaWJsZUNvbEFycmF5LmluZGV4T2YoYi5hdHRyKSk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tDaGFuZ2VzVmlzaWJsZUNvbHVtbW5zSW5Jbml0aWFsQ29uZmlndXJhdGlvbihzdGF0ZUNvbHMpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgnb0NvbHVtbnMtZGlzcGxheScpKSB7XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxWaXNpYmxlQ29sQXJyYXkgPSB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnb0NvbHVtbnMtZGlzcGxheSddLm1hcCh4ID0+IHtcbiAgICAgICAgICBpZiAoeC52aXNpYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4geC5hdHRyO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHZpc2libGVDb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnZpc2libGVDb2x1bW5zLCB0cnVlKTtcblxuICAgICAgICAvLyBGaW5kIHZhbHVlcyBpbiB2aXNpYmxlLWNvbHVtbnMgdGhhdCB0aGV5IGFyZW50IGluIG9yaWdpbmFsLXZpc2libGUtY29sdW1ucyBpbiBsb2NhbHN0b3JhZ2VcbiAgICAgICAgLy8gaW4gdGhpcyBjYXNlIHlvdSBoYXZlIHRvIGFkZCB0aGlzIGNvbHVtbiB0byB0aGlzLnZpc2libGVDb2xBcnJheVxuICAgICAgICBjb25zdCBjb2xUb0FkZEluVmlzaWJsZUNvbCA9IFV0aWwuZGlmZmVyZW5jZUFycmF5cyh2aXNpYmxlQ29sQXJyYXksIG9yaWdpbmFsVmlzaWJsZUNvbEFycmF5KTtcbiAgICAgICAgaWYgKGNvbFRvQWRkSW5WaXNpYmxlQ29sLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb2xUb0FkZEluVmlzaWJsZUNvbC5mb3JFYWNoKChjb2xBZGQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoc3RhdGVDb2xzLmZpbHRlcihjb2wgPT4gY29sLmF0dHIgPT09IGNvbEFkZCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBzdGF0ZUNvbHMgPSBzdGF0ZUNvbHMubWFwKGNvbCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbFRvQWRkSW5WaXNpYmxlQ29sLmluZGV4T2YoY29sLmF0dHIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgIGNvbC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmNvbEFycmF5LmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCA9PT0gY29sQWRkKSB7XG4gICAgICAgICAgICAgICAgICBzdGF0ZUNvbHMuc3BsaWNlKGkgKyAxLCAwLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cjogY29sQWRkLFxuICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5kIHZhbHVlcyBpbiBvcmlnaW5hbC12aXNpYmxlLWNvbHVtbnMgaW4gbG9jYWxzdG9yYWdlIHRoYXQgdGhleSBhcmVudCBpbiB0aGlzLnZpc2libGVDb2xBcnJheVxuICAgICAgICAvLyBpbiB0aGlzIGNhc2UgeW91IGhhdmUgdG8gZGVsZXRlIHRoaXMgY29sdW1uIHRvIHRoaXMudmlzaWJsZUNvbEFycmF5XG4gICAgICAgIGNvbnN0IGNvbFRvRGVsZXRlSW5WaXNpYmxlQ29sID0gVXRpbC5kaWZmZXJlbmNlQXJyYXlzKG9yaWdpbmFsVmlzaWJsZUNvbEFycmF5LCB2aXNpYmxlQ29sQXJyYXkpO1xuICAgICAgICBpZiAoY29sVG9EZWxldGVJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHN0YXRlQ29scyA9IHN0YXRlQ29scy5tYXAoY29sID0+IHtcbiAgICAgICAgICAgIGlmIChjb2xUb0RlbGV0ZUluVmlzaWJsZUNvbC5pbmRleE9mKGNvbC5hdHRyKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGNvbC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29sO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZUNvbHM7XG4gIH1cblxuICBwYXJzZVNvcnRDb2x1bW5zKCkge1xuICAgIGNvbnN0IHNvcnRDb2x1bW5zUGFyYW0gPSB0aGlzLnN0YXRlWydzb3J0LWNvbHVtbnMnXSB8fCB0aGlzLnNvcnRDb2x1bW5zO1xuICAgIHRoaXMuc29ydENvbEFycmF5ID0gU2VydmljZVV0aWxzLnBhcnNlU29ydENvbHVtbnMoc29ydENvbHVtbnNQYXJhbSk7XG5cbiAgICAvLyBjaGVja2luZyB0aGUgb3JpZ2luYWwgc29ydCBjb2x1bW5zIHdpdGggdGhlIHNvcnQgY29sdW1ucyBpbiBpbml0aWFsIGNvbmZpZ3VyYXRpb24gaW4gbG9jYWwgc3RvcmFnZVxuICAgIGlmICh0aGlzLnN0YXRlWydzb3J0LWNvbHVtbnMnXSAmJiB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnc29ydC1jb2x1bW5zJ10pIHtcblxuICAgICAgY29uc3QgaW5pdGlhbENvbmZpZ1NvcnRDb2x1bW5zQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyh0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnc29ydC1jb2x1bW5zJ10pO1xuICAgICAgY29uc3Qgb3JpZ2luYWxTb3J0Q29sdW1uc0FycmF5ID0gU2VydmljZVV0aWxzLnBhcnNlU29ydENvbHVtbnModGhpcy5zb3J0Q29sdW1ucyk7XG4gICAgICAvLyBGaW5kIHZhbHVlcyBpbiB2aXNpYmxlLWNvbHVtbnMgdGhhdCB0aGV5IGFyZW50IGluIG9yaWdpbmFsLXZpc2libGUtY29sdW1ucyBpbiBsb2NhbHN0b3JhZ2VcbiAgICAgIC8vIGluIHRoaXMgY2FzZSB5b3UgaGF2ZSB0byBhZGQgdGhpcyBjb2x1bW4gdG8gdGhpcy52aXNpYmxlQ29sQXJyYXlcbiAgICAgIGNvbnN0IGNvbFRvQWRkSW5WaXNpYmxlQ29sID0gVXRpbC5kaWZmZXJlbmNlQXJyYXlzKG9yaWdpbmFsU29ydENvbHVtbnNBcnJheSwgaW5pdGlhbENvbmZpZ1NvcnRDb2x1bW5zQXJyYXkpO1xuICAgICAgaWYgKGNvbFRvQWRkSW5WaXNpYmxlQ29sLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29sVG9BZGRJblZpc2libGVDb2wuZm9yRWFjaChjb2xBZGQgPT4ge1xuICAgICAgICAgIHRoaXMuc29ydENvbEFycmF5LnB1c2goY29sQWRkKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbFRvRGVsSW5WaXNpYmxlQ29sID0gVXRpbC5kaWZmZXJlbmNlQXJyYXlzKGluaXRpYWxDb25maWdTb3J0Q29sdW1uc0FycmF5LCBvcmlnaW5hbFNvcnRDb2x1bW5zQXJyYXkpO1xuICAgICAgaWYgKGNvbFRvRGVsSW5WaXNpYmxlQ29sLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29sVG9EZWxJblZpc2libGVDb2wuZm9yRWFjaCgoY29sRGVsKSA9PiB7XG4gICAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkuZm9yRWFjaCgoY29sLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29sLmNvbHVtbk5hbWUgPT09IGNvbERlbC5jb2x1bW5OYW1lKSB7XG4gICAgICAgICAgICAgIHRoaXMuc29ydENvbEFycmF5LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZW5zdXJpbmcgY29sdW1uIGV4aXN0ZW5jZSBhbmQgY2hlY2tpbmcgaXRzIG9yZGVyYWJsZSBzdGF0ZVxuICAgIGZvciAobGV0IGkgPSB0aGlzLnNvcnRDb2xBcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgY29sTmFtZSA9IHRoaXMuc29ydENvbEFycmF5W2ldLmNvbHVtbk5hbWU7XG4gICAgICBjb25zdCBvQ29sID0gdGhpcy5nZXRPQ29sdW1uKGNvbE5hbWUpO1xuICAgICAgaWYgKCFVdGlsLmlzRGVmaW5lZChvQ29sKSB8fCAhb0NvbC5vcmRlcmFibGUpIHtcbiAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemVQYXJhbXMoKTogdm9pZCB7XG4gICAgLy8gSWYgdmlzaWJsZS1jb2x1bW5zIGlzIG5vdCBwcmVzZW50IHRoZW4gdmlzaWJsZS1jb2x1bW5zIGlzIGFsbCBjb2x1bW5zXG4gICAgaWYgKCF0aGlzLnZpc2libGVDb2x1bW5zKSB7XG4gICAgICB0aGlzLnZpc2libGVDb2x1bW5zID0gdGhpcy5jb2x1bW5zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbEFycmF5Lmxlbmd0aCkge1xuICAgICAgdGhpcy5jb2xBcnJheS5mb3JFYWNoKCh4OiBzdHJpbmcpID0+IHRoaXMucmVnaXN0ZXJDb2x1bW4oeCkpO1xuXG4gICAgICBsZXQgY29sdW1uc09yZGVyID0gW107XG4gICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnb0NvbHVtbnMtZGlzcGxheScpKSB7XG4gICAgICAgIGNvbHVtbnNPcmRlciA9IHRoaXMuc3RhdGVbJ29Db2x1bW5zLWRpc3BsYXknXS5tYXAoaXRlbSA9PiBpdGVtLmF0dHIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29sdW1uc09yZGVyID0gdGhpcy5jb2xBcnJheS5maWx0ZXIoYXR0ciA9PiB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGF0dHIpID09PSAtMSk7XG4gICAgICAgIGNvbHVtbnNPcmRlci5wdXNoKC4uLnRoaXMudmlzaWJsZUNvbEFycmF5KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLnNvcnQoKGE6IE9Db2x1bW4sIGI6IE9Db2x1bW4pID0+IHtcbiAgICAgICAgaWYgKGNvbHVtbnNPcmRlci5pbmRleE9mKGEuYXR0cikgPT09IC0xKSB7XG4gICAgICAgICAgLy8gaWYgaXQgaXMgbm90IGluIGxvY2FsIHN0b3JhZ2UgYmVjYXVzZSBpdCBpcyBuZXcsIGtlZXAgb3JkZXJcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gY29sdW1uc09yZGVyLmluZGV4T2YoYS5hdHRyKSAtIGNvbHVtbnNPcmRlci5pbmRleE9mKGIuYXR0cik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbGl6ZSBxdWlja0ZpbHRlclxuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuZmlsdGVyID0gdGhpcy5xdWlja0ZpbHRlcjtcblxuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdjdXJyZW50UGFnZScpKSB7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5zdGF0ZS5jdXJyZW50UGFnZTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHBhZ2luYXRvclxuICAgIGlmICghdGhpcy5wYWdpbmF0b3IgJiYgdGhpcy5wYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgIHRoaXMucGFnaW5hdG9yID0gbmV3IE9CYXNlVGFibGVQYWdpbmF0b3IoKTtcbiAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2VTaXplID0gdGhpcy5xdWVyeVJvd3M7XG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggPSB0aGlzLmN1cnJlbnRQYWdlO1xuICAgICAgdGhpcy5wYWdpbmF0b3Iuc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSB0aGlzLnNob3dQYWdpbmF0b3JGaXJzdExhc3RCdXR0b25zO1xuICAgIH1cblxuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5zZWxlY3RBbGxDaGVja2JveFZpc2libGUpKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gISF0aGlzLnN0YXRlWydzZWxlY3QtY29sdW1uLXZpc2libGUnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2hlY2tpbmcgdGhlIG9yaWdpbmFsIHNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSB3aXRoIHNlbGVjdC1jb2x1bW4tdmlzaWJsZSBpbiBpbml0aWFsIGNvbmZpZ3VyYXRpb24gaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpICYmIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdzZWxlY3QtY29sdW1uLXZpc2libGUnKVxuICAgICAgICAmJiB0aGlzLnNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSA9PT0gdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddKSB7XG4gICAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSAhIXRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSA9IHRoaXMuc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vSW5pdGlhbGl6ZSBzaG93IGZpbHRlciBieSBjb2x1bW4gaWNvblxuICAgIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9IHRoaXMub3JpZ2luYWxGaWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHQ7XG5cbiAgICB0aGlzLmluaXRpYWxpemVDaGVja2JveENvbHVtbigpO1xuXG4gIH1cbiAgdXBkYXRlU3RhdGVFeHBhbmRlZENvbHVtbigpIHtcbiAgICBpZiAoIXRoaXMudGFibGVSb3dFeHBhbmRhYmxlIHx8ICF0aGlzLnRhYmxlUm93RXhwYW5kYWJsZS5leHBhbmRhYmxlQ29sdW1uVmlzaWJsZSkgeyByZXR1cm47IH1cbiAgICBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1uc1swXSA9PT0gQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUICYmIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnNbMV0gIT09IENvZGVzLk5BTUVfQ09MVU1OX0VYUEFOREFCTEUpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMgPSBbdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1uc1swXV0uY29uY2F0KENvZGVzLk5BTUVfQ09MVU1OX0VYUEFOREFCTEUsIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuc3BsaWNlKDEpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnNbMF0gIT09IENvZGVzLk5BTUVfQ09MVU1OX0VYUEFOREFCTEUpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMudW5zaGlmdChDb2Rlcy5OQU1FX0NPTFVNTl9FWFBBTkRBQkxFKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlclRhYkxpc3RlbmVyKCkge1xuICAgIC8vIFdoZW4gdGFibGUgaXMgY29udGFpbmVkIGludG8gdGFiIGNvbXBvbmVudCwgaXQgaXMgbmVjZXNzYXJ5IHRvIGluaXQgdGFibGUgY29tcG9uZW50IHdoZW4gYXR0YWNoZWQgdG8gRE9NLlxuICAgIHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnRhYkdyb3VwQ29udGFpbmVyLnNlbGVjdGVkVGFiQ2hhbmdlLnN1YnNjcmliZSgoZXZ0KSA9PiB7XG4gICAgICBsZXQgaW50ZXJ2YWw7XG4gICAgICBjb25zdCB0aW1lckNhbGxiYWNrID0gKHRhYjogTWF0VGFiKSA9PiB7XG4gICAgICAgIGlmICh0YWIgJiYgdGFiLmNvbnRlbnQuaXNBdHRhY2hlZCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgIGlmICh0YWIgPT09IHRoaXMudGFiQ29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmluc2lkZVRhYkJ1Z1dvcmthcm91bmQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBlbmRpbmdRdWVyeSkge1xuICAgICAgICAgICAgICB0aGlzLnF1ZXJ5RGF0YSh0aGlzLnBlbmRpbmdRdWVyeUZpbHRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7IHRpbWVyQ2FsbGJhY2soZXZ0LnRhYik7IH0sIDEwMCk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5zaWRlVGFiQnVnV29ya2Fyb3VuZCgpIHtcbiAgICB0aGlzLnNvcnRIZWFkZXJzLmZvckVhY2goc29ydEggPT4ge1xuICAgICAgc29ydEgucmVmcmVzaCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJTb3J0TGlzdGVuZXIoKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuc29ydCkpIHtcbiAgICAgIHRoaXMuc29ydFN1YnNjcmlwdGlvbiA9IHRoaXMuc29ydC5vU29ydENoYW5nZS5zdWJzY3JpYmUodGhpcy5vblNvcnRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLnNvcnQuc2V0TXVsdGlwbGVTb3J0KHRoaXMubXVsdGlwbGVTb3J0KTtcblxuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucykgJiYgKHRoaXMuc29ydENvbEFycmF5Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgIHRoaXMuc29ydC5zZXRUYWJsZUluZm8odGhpcy5zb3J0Q29sQXJyYXkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvblNvcnRDaGFuZ2Uoc29ydEFycmF5OiBhbnlbXSkge1xuICAgIHRoaXMuc29ydENvbEFycmF5ID0gW107XG4gICAgc29ydEFycmF5LmZvckVhY2goKHNvcnQpID0+IHtcbiAgICAgIGlmIChzb3J0LmRpcmVjdGlvbiAhPT0gJycpIHtcbiAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkucHVzaCh7XG4gICAgICAgICAgY29sdW1uTmFtZTogc29ydC5pZCxcbiAgICAgICAgICBhc2NlbmRlbnQ6IHNvcnQuZGlyZWN0aW9uID09PSBDb2Rlcy5BU0NfU09SVFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubG9hZGluZ1NvcnRpbmdTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBzZXREYXRhc291cmNlKCkge1xuICAgIGNvbnN0IGRhdGFTb3VyY2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RhYmxlRGF0YVNvdXJjZVNlcnZpY2UpO1xuICAgIHRoaXMuZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2VTZXJ2aWNlLmdldEluc3RhbmNlKHRoaXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyRGF0YVNvdXJjZUxpc3RlbmVycygpIHtcbiAgICBpZiAoIXRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMub25SZW5kZXJlZERhdGFDaGFuZ2UgPSB0aGlzLmRhdGFTb3VyY2Uub25SZW5kZXJlZERhdGFDaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5sb2FkaW5nU29ydGluZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgICAgaWYgKHRoaXMuY2QgJiYgISh0aGlzLmNkIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCA1MDApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNob3dMb2FkaW5nKCkge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLmxvYWRpbmcsIHRoaXMubG9hZGluZ1NvcnRpbmcsIHRoaXMubG9hZGluZ1Njcm9sbF0pXG4gICAgICAucGlwZShtYXAoKHJlczogYW55W10pID0+IChyZXNbMF0gfHwgcmVzWzFdIHx8IHJlc1syXSkpKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRFeHBhbmRlZFJvd0NvbnRhaW5lckNsYXNzKHJvd0luZGV4OiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBPVGFibGVDb21wb25lbnQuRVhQQU5ERURfUk9XX0NPTlRBSU5FUl9DTEFTUyArIHJvd0luZGV4O1xuICB9XG5cbiAgcHVibGljIGdldEV4cGFuZGFibGVJdGVtcygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kYWJsZUl0ZW0uc2VsZWN0ZWQ7XG4gIH1cblxuICBwdWJsaWMgdG9vZ2xlUm93RXhwYW5kYWJsZShpdGVtOiBhbnksIHJvd0luZGV4OiBudW1iZXIsIGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLmV4cGFuZGFibGVJdGVtLnRvZ2dsZShpdGVtKTtcblxuXG5cbiAgICBpZiAodGhpcy5nZXRTdGF0ZUV4cGFuZChpdGVtKSA9PT0gJ2NvbGxhcHNlZCcpIHtcbiAgICAgIHRoaXMucG9ydGFsSG9zdC5kZXRhY2goKTtcbiAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgY29uc3QgZXZlbnRUYWJsZVJvd0V4cGFuZGFibGVDaGFuZ2UgPSB0aGlzLmVtaXRUYWJsZVJvd0V4cGFuZGFibGVDaGFuZ2VFdmVudChpdGVtLCByb3dJbmRleCk7XG4gICAgICB0aGlzLnRhYmxlUm93RXhwYW5kYWJsZS5vbkNvbGxhcHNlZC5lbWl0KGV2ZW50VGFibGVSb3dFeHBhbmRhYmxlQ2hhbmdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb3J0YWxIb3N0ID0gbmV3IERvbVBvcnRhbE91dGxldChcbiAgICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy4nICsgdGhpcy5nZXRFeHBhbmRlZFJvd0NvbnRhaW5lckNsYXNzKHJvd0luZGV4KSksXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgdGhpcy5hcHBSZWYsXG4gICAgICAgIHRoaXMuaW5qZWN0b3JcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlUG9ydGFsID0gbmV3IFRlbXBsYXRlUG9ydGFsKHRoaXMudGFibGVSb3dFeHBhbmRhYmxlLnRlbXBsYXRlUmVmLCB0aGlzLl92aWV3Q29udGFpbmVyUmVmLCB7ICRpbXBsaWNpdDogaXRlbSB9KTtcbiAgICAgIHRoaXMucG9ydGFsSG9zdC5hdHRhY2hUZW1wbGF0ZVBvcnRhbCh0ZW1wbGF0ZVBvcnRhbCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZXZlbnRUYWJsZVJvd0V4cGFuZGFibGVDaGFuZ2UgPSB0aGlzLmVtaXRUYWJsZVJvd0V4cGFuZGFibGVDaGFuZ2VFdmVudChpdGVtLCByb3dJbmRleCk7XG4gICAgICAgIHRoaXMudGFibGVSb3dFeHBhbmRhYmxlLm9uRXhwYW5kZWQuZW1pdChldmVudFRhYmxlUm93RXhwYW5kYWJsZUNoYW5nZSk7XG4gICAgICB9LCAyNTApO1xuXG5cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVtaXRUYWJsZVJvd0V4cGFuZGFibGVDaGFuZ2VFdmVudChkYXRhLCByb3dJbmRleCkge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE9UYWJsZVJvd0V4cGFuZGVkQ2hhbmdlKCk7XG4gICAgZXZlbnQucm93SW5kZXggPSByb3dJbmRleDtcbiAgICBldmVudC5kYXRhID0gZGF0YTtcblxuICAgIHJldHVybiBldmVudDtcbiAgfVxuXG4gIHB1YmxpYyBpc0V4cGFuZGVkKGRhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGVJdGVtLmlzU2VsZWN0ZWQoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGVFeHBhbmQocm93KSB7XG4gICAgcmV0dXJuIHRoaXMuaXNFeHBhbmRlZChyb3cpID8gJ2V4cGFuZGVkJyA6ICdjb2xsYXBzZWQnO1xuICB9XG5cbiAgcHVibGljIGlzQ29sdW1uRXhwYW5kYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFV0aWwuaXNEZWZpbmVkKHRoaXMudGFibGVSb3dFeHBhbmRhYmxlKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLl9vVGFibGVPcHRpb25zLmV4cGFuZGFibGVDb2x1bW4pKSA/IHRoaXMuX29UYWJsZU9wdGlvbnMuZXhwYW5kYWJsZUNvbHVtbi52aXNpYmxlIDogZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgaGFzRXhwYW5kZWRSb3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMudGFibGVSb3dFeHBhbmRhYmxlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROdW1WaXNpYmxlQ29sdW1ucygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIG1hbmFnZXMgdGhlIGNhbGwgdG8gdGhlIHNlcnZpY2VcbiAgICogQHBhcmFtIGZpbHRlclxuICAgKiBAcGFyYW0gb3ZyckFyZ3NcbiAgICovXG4gIHF1ZXJ5RGF0YShmaWx0ZXI/OiBhbnksIG92cnJBcmdzPzogT1F1ZXJ5RGF0YUFyZ3MpIHtcbiAgICAvLyBJZiB0YWIgZXhpc3RzIGFuZCBpcyBub3QgYWN0aXZlIHRoZW4gd2FpdCBmb3IgcXVlcnlEYXRhXG4gICAgaWYgKHRoaXMuaXNJbnNpZGVJbmFjdGl2ZVRhYigpKSB7XG4gICAgICB0aGlzLnBlbmRpbmdRdWVyeSA9IHRydWU7XG4gICAgICB0aGlzLnBlbmRpbmdRdWVyeUZpbHRlciA9IGZpbHRlcjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5wZW5kaW5nUXVlcnkgPSBmYWxzZTtcbiAgICB0aGlzLnBlbmRpbmdRdWVyeUZpbHRlciA9IHVuZGVmaW5lZDtcbiAgICBzdXBlci5xdWVyeURhdGEoZmlsdGVyLCBvdnJyQXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNJbnNpZGVJbmFjdGl2ZVRhYigpOiBib29sZWFuIHtcbiAgICBsZXQgcmVzdWx0OiBib29sZWFuID0gZmFsc2U7XG4gICAgaWYgKHRoaXMudGFiQ29udGFpbmVyICYmIHRoaXMudGFiR3JvdXBDb250YWluZXIpIHtcbiAgICAgIHJlc3VsdCA9ICEodGhpcy50YWJDb250YWluZXIuaXNBY3RpdmUgfHwgKHRoaXMudGFiR3JvdXBDb250YWluZXIuc2VsZWN0ZWRJbmRleCA9PT0gdGhpcy50YWJDb250YWluZXIucG9zaXRpb24pKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldENvbXBvbmVudEZpbHRlcihleGlzdGluZ0ZpbHRlcjogYW55ID0ge30pOiBhbnkge1xuICAgIGxldCBmaWx0ZXIgPSBleGlzdGluZ0ZpbHRlcjtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGZpbHRlcikubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBwYXJlbnRJdGVtRXhwciA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25Gcm9tT2JqZWN0KGZpbHRlcik7XG4gICAgICAgIGZpbHRlciA9IHt9O1xuICAgICAgICBmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0gPSBwYXJlbnRJdGVtRXhwcjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGJlQ29sRmlsdGVyID0gdGhpcy5nZXRDb2x1bW5GaWx0ZXJzRXhwcmVzc2lvbigpO1xuICAgICAgLy8gQWRkIGNvbHVtbiBmaWx0ZXJzIGJhc2ljIGV4cHJlc3Npb24gdG8gY3VycmVudCBmaWx0ZXJcbiAgICAgIGlmIChiZUNvbEZpbHRlciAmJiAhVXRpbC5pc0RlZmluZWQoZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5GSUxURVJfRVhQUkVTU0lPTl9LRVldKSkge1xuICAgICAgICBmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0gPSBiZUNvbEZpbHRlcjtcbiAgICAgIH0gZWxzZSBpZiAoYmVDb2xGaWx0ZXIpIHtcbiAgICAgICAgZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5GSUxURVJfRVhQUkVTU0lPTl9LRVldID1cbiAgICAgICAgICBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0sIGJlQ29sRmlsdGVyLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmdldENvbXBvbmVudEZpbHRlcihmaWx0ZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFF1aWNrRmlsdGVyRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudCkgJiYgdGhpcy5wYWdlYWJsZSkge1xuICAgICAgcmV0dXJuIHRoaXMub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQuZmlsdGVyRXhwcmVzc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRDb2x1bW5GaWx0ZXJzRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICAvLyBBcHBseSBjb2x1bW4gZmlsdGVyc1xuICAgIGNvbnN0IGNvbHVtbkZpbHRlcnM6IE9Db2x1bW5WYWx1ZUZpbHRlcltdID0gdGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVycygpO1xuICAgIGNvbnN0IGJlQ29sdW1uRmlsdGVyczogQXJyYXk8RXhwcmVzc2lvbj4gPSBbXTtcbiAgICBjb2x1bW5GaWx0ZXJzLmZvckVhY2goY29sRmlsdGVyID0+IHtcbiAgICAgIC8vIFByZXBhcmUgYmFzaWMgZXhwcmVzc2lvbnNcbiAgICAgIHN3aXRjaCAoY29sRmlsdGVyLm9wZXJhdG9yKSB7XG4gICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTjpcbiAgICAgICAgICBpZiAoVXRpbC5pc0FycmF5KGNvbEZpbHRlci52YWx1ZXMpKSB7XG4gICAgICAgICAgICBjb25zdCBiZXNJbjogQXJyYXk8RXhwcmVzc2lvbj4gPSBjb2xGaWx0ZXIudmFsdWVzLm1hcCh2YWx1ZSA9PiBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uRXF1YWxzKGNvbEZpbHRlci5hdHRyLCB2YWx1ZSkpO1xuICAgICAgICAgICAgbGV0IGJlSW46IEV4cHJlc3Npb24gPSBiZXNJbi5wb3AoKTtcbiAgICAgICAgICAgIGJlc0luLmZvckVhY2goYmUgPT4ge1xuICAgICAgICAgICAgICBiZUluID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oYmVJbiwgYmUsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9PUik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJlQ29sdW1uRmlsdGVycy5wdXNoKGJlSW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU46XG4gICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShjb2xGaWx0ZXIudmFsdWVzKSAmJiBjb2xGaWx0ZXIudmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgbGV0IGJlRnJvbSA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25Nb3JlRXF1YWwoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXNbMF0pO1xuICAgICAgICAgICAgbGV0IGJlVG8gPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTGVzc0VxdWFsKGNvbEZpbHRlci5hdHRyLCBjb2xGaWx0ZXIudmFsdWVzWzFdKTtcbiAgICAgICAgICAgIGJlQ29sdW1uRmlsdGVycy5wdXNoKEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKGJlRnJvbSwgYmVUbywgRmlsdGVyRXhwcmVzc2lvblV0aWxzLk9QX0FORCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMOlxuICAgICAgICAgIGJlQ29sdW1uRmlsdGVycy5wdXNoKEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25MaWtlKGNvbEZpbHRlci5hdHRyLCBjb2xGaWx0ZXIudmFsdWVzKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMOlxuICAgICAgICAgIGJlQ29sdW1uRmlsdGVycy5wdXNoKEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25MZXNzRXF1YWwoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXMpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLk1PUkVfRVFVQUw6XG4gICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbk1vcmVFcXVhbChjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgLy8gQnVpbGQgY29tcGxldGUgY29sdW1uIGZpbHRlcnMgYmFzaWMgZXhwcmVzc2lvblxuICAgIGxldCBiZUNvbEZpbHRlcjogRXhwcmVzc2lvbiA9IGJlQ29sdW1uRmlsdGVycy5wb3AoKTtcbiAgICBiZUNvbHVtbkZpbHRlcnMuZm9yRWFjaChiZSA9PiB7XG4gICAgICBiZUNvbEZpbHRlciA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKGJlQ29sRmlsdGVyLCBiZSwgRmlsdGVyRXhwcmVzc2lvblV0aWxzLk9QX0FORCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJlQ29sRmlsdGVyO1xuICB9XG5cbiAgdXBkYXRlUGFnaW5hdGlvbkluZm8ocXVlcnlSZXM6IGFueSkge1xuICAgIHN1cGVyLnVwZGF0ZVBhZ2luYXRpb25JbmZvKHF1ZXJ5UmVzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXREYXRhKGRhdGE6IGFueSwgc3FsVHlwZXM6IGFueSkge1xuICAgIHRoaXMuZGFvVGFibGUuc3FsVHlwZXNDaGFuZ2UubmV4dChzcWxUeXBlcyk7XG4gICAgdGhpcy5kYW9UYWJsZS5zZXREYXRhQXJyYXkoZGF0YSk7XG4gICAgdGhpcy51cGRhdGVTY3JvbGxlZFN0YXRlKCk7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25QYWdpbmF0ZWREYXRhTG9hZGVkLCBkYXRhKTtcbiAgICB9XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkRhdGFMb2FkZWQsIHRoaXMuZGFvVGFibGUuZGF0YSk7XG4gIH1cblxuICBzaG93RGlhbG9nRXJyb3IoZXJyb3I6IHN0cmluZywgZXJyb3JPcHRpb25hbD86IHN0cmluZykge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlcnJvcikgJiYgIVV0aWwuaXNPYmplY3QoZXJyb3IpKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgZXJyb3JPcHRpb25hbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvamVjdENvbnRlbnRDaGFuZ2VkKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5sb2FkaW5nU29ydGluZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgfSwgNTAwKTtcbiAgICB0aGlzLmxvYWRpbmdTY3JvbGxTdWJqZWN0Lm5leHQoZmFsc2UpO1xuXG4gICAgaWYgKHRoaXMucHJldmlvdXNSZW5kZXJlckRhdGEgIT09IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEpIHtcbiAgICAgIHRoaXMucHJldmlvdXNSZW5kZXJlckRhdGEgPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNvbnRlbnRDaGFuZ2UsIHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdzZWxlY3Rpb24nKSAmJiB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmxlbmd0aCA+IDAgJiYgdGhpcy5nZXRTZWxlY3RlZEl0ZW1zKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGlvbi5mb3JFYWNoKHNlbGVjdGVkSXRlbSA9PiB7XG4gICAgICAgIC8vIGZpbmRpbmcgc2VsZWN0ZWQgaXRlbSBkYXRhIGluIHRoZSB0YWJsZSByZW5kZXJlZCBkYXRhXG4gICAgICAgIGNvbnN0IGZvdW5kSXRlbSA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuZmluZChkYXRhID0+IHtcbiAgICAgICAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICBPYmplY3Qua2V5cyhzZWxlY3RlZEl0ZW0pLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiAoZGF0YVtrZXldID09PSBzZWxlY3RlZEl0ZW1ba2V5XSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChmb3VuZEl0ZW0pIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3QoZm91bmRJdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1ZhbHVlc1RvUXVlcnkoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgY29sdW1ucyA9IHN1cGVyLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk7XG4gICAgaWYgKHRoaXMuYXZvaWRRdWVyeUNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgaSA9IGNvbHVtbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgY29sID0gY29sdW1uc1tpXTtcbiAgICAgICAgaWYgKHRoaXMuYXZvaWRRdWVyeUNvbHVtbnMuaW5kZXhPZihjb2wpICE9PSAtMSkge1xuICAgICAgICAgIGNvbHVtbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG5cbiAgZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyOiBvYmplY3QsIG92cnJBcmdzPzogT1F1ZXJ5RGF0YUFyZ3MpOiBBcnJheTxhbnk+IHtcbiAgICBjb25zdCBxdWVyeUFyZ3VtZW50cyA9IHN1cGVyLmdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlciwgb3ZyckFyZ3MpO1xuICAgIHF1ZXJ5QXJndW1lbnRzWzNdID0gdGhpcy5nZXRTcWxUeXBlc0ZvckZpbHRlcihxdWVyeUFyZ3VtZW50c1sxXSk7XG4gICAgT2JqZWN0LmFzc2lnbihxdWVyeUFyZ3VtZW50c1szXSwgb3ZyckFyZ3MgPyBvdnJyQXJncy5zcWx0eXBlcyB8fCB7fSA6IHt9KTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgcXVlcnlBcmd1bWVudHNbNV0gPSB0aGlzLnBhZ2luYXRvci5pc1Nob3dpbmdBbGxSb3dzKHF1ZXJ5QXJndW1lbnRzWzVdKSA/IHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgOiBxdWVyeUFyZ3VtZW50c1s1XTtcbiAgICAgIHF1ZXJ5QXJndW1lbnRzWzZdID0gdGhpcy5zb3J0Q29sQXJyYXk7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeUFyZ3VtZW50cztcbiAgfVxuXG4gIGdldFNxbFR5cGVzRm9yRmlsdGVyKGZpbHRlcik6IG9iamVjdCB7XG4gICAgY29uc3QgYWxsU3FsVHlwZXMgPSB7fTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZm9yRWFjaCgoY29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICBpZiAoY29sLnNxbFR5cGUpIHtcbiAgICAgICAgYWxsU3FsVHlwZXNbY29sLmF0dHJdID0gY29sLnNxbFR5cGU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmFzc2lnbihhbGxTcWxUeXBlcywgdGhpcy5nZXRTcWxUeXBlcygpKTtcbiAgICBjb25zdCBmaWx0ZXJDb2xzID0gVXRpbC5nZXRWYWx1ZXNGcm9tT2JqZWN0KGZpbHRlcik7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhhbGxTcWxUeXBlcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGZpbHRlckNvbHMuaW5kZXhPZihrZXkpICE9PSAtMSAmJiBhbGxTcWxUeXBlc1trZXldICE9PSBTUUxUeXBlcy5PVEhFUikge1xuICAgICAgICBzcWxUeXBlc1trZXldID0gYWxsU3FsVHlwZXNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3FsVHlwZXM7XG4gIH1cblxuICBvbkV4cG9ydEJ1dHRvbkNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uRXhwb3J0QnV0dG9uQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2hhbmdlQ29sdW1uc1Zpc2liaWxpdHlDbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkNoYW5nZUNvbHVtbnNWaXNpYmlsaXR5Q2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTWF0VGFibGVDb250ZW50Q2hhbmdlZCgpIHtcbiAgICAvL1xuICB9XG5cbiAgYWRkKCkge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0lOU0VSVCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3VwZXIuaW5zZXJ0RGV0YWlsKCk7XG4gIH1cblxuICByZW1vdmUoY2xlYXJTZWxlY3RlZEl0ZW1zOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9ERUxFVEUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0RFTEVURScpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLmRhdGFTZXJ2aWNlICYmICh0aGlzLmRlbGV0ZU1ldGhvZCBpbiB0aGlzLmRhdGFTZXJ2aWNlKSAmJiB0aGlzLmVudGl0eSAmJiAodGhpcy5rZXlzQXJyYXkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcnMgPSBTZXJ2aWNlVXRpbHMuZ2V0QXJyYXlQcm9wZXJ0aWVzKHNlbGVjdGVkSXRlbXMsIHRoaXMua2V5c0FycmF5KTtcbiAgICAgICAgICAgIHRoaXMuZGFvVGFibGUucmVtb3ZlUXVlcnkoZmlsdGVycykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblJvd0RlbGV0ZWQsIHNlbGVjdGVkSXRlbXMpO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNob3dEaWFsb2dFcnJvcihlcnJvciwgJ01FU1NBR0VTLkVSUk9SX0RFTEVURScpO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUxvY2FsSXRlbXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2xlYXJTZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgc2hvd0FuZFNlbGVjdEFsbENoZWNrYm94KCkge1xuICAgIGlmICh0aGlzLmlzU2VsZWN0aW9uTW9kZU11bHRpcGxlKCkpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdEFsbENoZWNrYm94KSB7XG4gICAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgICAgIHRoaXMuc2VsZWN0QWxsKCk7XG4gICAgfVxuICB9XG5cbiAgcmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpIHtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgLy8gSW5pdGlhbGl6ZSBwYWdlIGluZGV4XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbG9hZERhdGEoKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fUkVGUkVTSCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0YXRlLCB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0VGFibGVQcm9wZXJ0eVRvU3RvcmUoJ3NlbGVjdGlvbicpKTtcbiAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgdGhpcy5maW5pc2hRdWVyeVN1YnNjcmlwdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMucGVuZGluZ1F1ZXJ5ID0gdHJ1ZTtcbiAgICAvLyB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsID0gMTtcbiAgICBsZXQgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncztcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgcXVlcnlBcmdzID0ge1xuICAgICAgICBvZmZzZXQ6IHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cyxcbiAgICAgICAgbGVuZ3RoOiB0aGlzLnF1ZXJ5Um93c1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5lZGl0aW5nQ2VsbCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gIH1cblxuICBoYW5kbGVDbGljayhpdGVtOiBhbnksIHJvd0luZGV4OiBudW1iZXIsICRldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuY2xpY2tUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmNsaWNrUHJldmVudCkge1xuICAgICAgICB0aGlzLmRvSGFuZGxlQ2xpY2soaXRlbSwgcm93SW5kZXgsICRldmVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsaWNrUHJldmVudCA9IGZhbHNlO1xuICAgIH0sIHRoaXMuY2xpY2tEZWxheSk7XG4gIH1cblxuICBkb0hhbmRsZUNsaWNrKGl0ZW06IGFueSwgcm93SW5kZXg6IG51bWJlciwgJGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLm9lbmFibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgodGhpcy5kZXRhaWxNb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykpIHtcbiAgICAgIHRoaXMub25DbGljay5lbWl0KHsgcm93OiBpdGVtLCByb3dJbmRleDogcm93SW5kZXgsIG1vdXNlRXZlbnQ6ICRldmVudCB9KTtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmNsZWFyKCk7XG4gICAgICB0aGlzLnNlbGVjdGVkUm93KGl0ZW0pO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGl0ZW0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpICYmICgkZXZlbnQuY3RybEtleSB8fCAkZXZlbnQubWV0YUtleSkpIHtcbiAgICAgIC8vIFRPRE86IHRlc3QgJGV2ZW50Lm1ldGFLZXkgb24gTUFDXG4gICAgICB0aGlzLnNlbGVjdGVkUm93KGl0ZW0pO1xuICAgICAgdGhpcy5vbkNsaWNrLmVtaXQoeyByb3c6IGl0ZW0sIHJvd0luZGV4OiByb3dJbmRleCwgbW91c2VFdmVudDogJGV2ZW50IH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpICYmICRldmVudC5zaGlmdEtleSkge1xuICAgICAgdGhpcy5oYW5kbGVNdWx0aXBsZVNlbGVjdGlvbihpdGVtKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2VsZWN0aW9uTW9kZU5vbmUoKSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQoaXRlbSkgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGggPT09IDEgJiYgdGhpcy5lZGl0aW9uRW5hYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uQW5kRWRpdGluZygpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZWxlY3RlZFJvdyhpdGVtKTtcbiAgICAgIHRoaXMub25DbGljay5lbWl0KHsgcm93OiBpdGVtLCByb3dJbmRleDogcm93SW5kZXgsIG1vdXNlRXZlbnQ6ICRldmVudCB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVNdWx0aXBsZVNlbGVjdGlvbihpdGVtOiBhbnkpIHtcbiAgICBpZiAodGhpcy5zZWxlY3Rpb24uc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmlyc3QgPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmluZGV4T2YodGhpcy5zZWxlY3Rpb24uc2VsZWN0ZWRbMF0pO1xuICAgICAgY29uc3QgbGFzdCA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuaW5kZXhPZihpdGVtKTtcbiAgICAgIGNvbnN0IGluZGV4RnJvbSA9IE1hdGgubWluKGZpcnN0LCBsYXN0KTtcbiAgICAgIGNvbnN0IGluZGV4VG8gPSBNYXRoLm1heChmaXJzdCwgbGFzdCk7XG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLnNsaWNlKGluZGV4RnJvbSwgaW5kZXhUbyArIDEpLmZvckVhY2goZSA9PiB0aGlzLnNlbGVjdGVkUm93KGUpKTtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25DbGljaywgdGhpcy5zZWxlY3Rpb24uc2VsZWN0ZWQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpIHtcbiAgICBzdXBlci5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgIHRoaXMuc3RvcmVQYWdpbmF0aW9uU3RhdGUgPSB0cnVlO1xuICB9XG5cbiAgaGFuZGxlRG91YmxlQ2xpY2soaXRlbTogYW55LCBldmVudD8pIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5jbGlja1RpbWVyKTtcbiAgICB0aGlzLmNsaWNrUHJldmVudCA9IHRydWU7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkRvdWJsZUNsaWNrLCBpdGVtKTtcbiAgICBpZiAodGhpcy5vZW5hYmxlZCAmJiBDb2Rlcy5pc0RvdWJsZUNsaWNrTW9kZSh0aGlzLmRldGFpbE1vZGUpKSB7XG4gICAgICB0aGlzLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgICB0aGlzLnZpZXdEZXRhaWwoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGVkaXRpb25FbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuc29tZShpdGVtID0+IGl0ZW0uZWRpdGluZyk7XG4gIH1cblxuICBoYW5kbGVET01DbGljayhldmVudCkge1xuICAgIGlmICh0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZWRpdGlvbkVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvdmVybGF5Q29udGFpbmVyID0gZG9jdW1lbnQuYm9keS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjZGstb3ZlcmxheS1jb250YWluZXInKVswXTtcbiAgICBpZiAob3ZlcmxheUNvbnRhaW5lciAmJiBvdmVybGF5Q29udGFpbmVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUNvbnRhaW5lciA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuby10YWJsZS1jb250YWluZXInKTtcbiAgICBjb25zdCB0YWJsZUNvbnRlbnQgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm8tdGFibGUtY29udGFpbmVyIHRhYmxlLm1hdC10YWJsZScpO1xuICAgIGlmICh0YWJsZUNvbnRhaW5lciAmJiB0YWJsZUNvbnRlbnQgJiYgdGFibGVDb250YWluZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJiAhdGFibGVDb250ZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDZWxsQ2xpY2soY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ/KSB7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgY29sdW1uLmVkaXRvclxuICAgICAgJiYgKHRoaXMuZGV0YWlsTW9kZSAhPT0gQ29kZXMuREVUQUlMX01PREVfQ0xJQ0spXG4gICAgICAmJiAodGhpcy5lZGl0aW9uTW9kZSA9PT0gQ29kZXMuREVUQUlMX01PREVfQ0xJQ0spKSB7XG5cbiAgICAgIHRoaXMuYWN0aXZhdGVDb2x1bW5FZGl0aW9uKGNvbHVtbiwgcm93LCBldmVudCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2VsbERvdWJsZUNsaWNrKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnksIGV2ZW50Pykge1xuICAgIGlmICh0aGlzLm9lbmFibGVkICYmIGNvbHVtbi5lZGl0b3JcbiAgICAgICYmICghQ29kZXMuaXNEb3VibGVDbGlja01vZGUodGhpcy5kZXRhaWxNb2RlKSlcbiAgICAgICYmIChDb2Rlcy5pc0RvdWJsZUNsaWNrTW9kZSh0aGlzLmVkaXRpb25Nb2RlKSkpIHtcblxuICAgICAgdGhpcy5hY3RpdmF0ZUNvbHVtbkVkaXRpb24oY29sdW1uLCByb3csIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYWN0aXZhdGVDb2x1bW5FZGl0aW9uKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnksIGV2ZW50Pykge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBpZiAoZXZlbnQgJiYgY29sdW1uLmVkaXRpbmcgJiYgdGhpcy5lZGl0aW5nQ2VsbCA9PT0gZXZlbnQuY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2x1bW5QZXJtaXNzaW9uczogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRPQ29sdW1uUGVybWlzc2lvbnMoY29sdW1uLmF0dHIpO1xuICAgIGlmIChjb2x1bW5QZXJtaXNzaW9ucy5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgY29uc29sZS53YXJuKGAke2NvbHVtbi5hdHRyfSBlZGl0aW9uIG5vdCBhbGxvd2VkIGR1ZSB0byBwZXJtaXNzaW9uc2ApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb25BbmRFZGl0aW5nKCk7XG4gICAgdGhpcy5zZWxlY3RlZFJvdyhyb3cpO1xuICAgIGlmIChldmVudCkge1xuICAgICAgdGhpcy5lZGl0aW5nQ2VsbCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgfVxuICAgIGNvbnN0IHJvd0RhdGEgPSB7fTtcbiAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHJvd0RhdGFba2V5XSA9IHJvd1trZXldO1xuICAgIH0pO1xuICAgIHJvd0RhdGFbY29sdW1uLmF0dHJdID0gcm93W2NvbHVtbi5hdHRyXTtcbiAgICB0aGlzLmVkaXRpbmdSb3cgPSByb3c7XG4gICAgY29sdW1uLmVkaXRpbmcgPSB0cnVlO1xuICAgIGNvbHVtbi5lZGl0b3Iuc3RhcnRFZGl0aW9uKHJvd0RhdGEpO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgdXBkYXRlQ2VsbERhdGEoY29sdW1uOiBPQ29sdW1uLCBkYXRhOiBhbnksIHNhdmVDaGFuZ2VzOiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fVVBEQVRFKSkge1xuICAgICAgY29uc3QgcmVzID0gbmV3IE9ic2VydmFibGUoaW5uZXJPYnNlcnZlciA9PiB7XG4gICAgICAgIGlubmVyT2JzZXJ2ZXIuZXJyb3IoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgY29sdW1uLmVkaXRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmVkaXRpbmdDZWxsID0gdW5kZWZpbmVkO1xuICAgIGlmIChzYXZlQ2hhbmdlcyAmJiB0aGlzLmVkaXRpbmdSb3cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRpbmdSb3csIGRhdGEpO1xuICAgIH1cbiAgICB0aGlzLmVkaXRpbmdSb3cgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHNhdmVDaGFuZ2VzICYmIGNvbHVtbi5lZGl0b3IudXBkYXRlUmVjb3JkT25FZGl0KSB7XG4gICAgICBjb25zdCB0b1VwZGF0ZSA9IHt9O1xuICAgICAgdG9VcGRhdGVbY29sdW1uLmF0dHJdID0gZGF0YVtjb2x1bW4uYXR0cl07XG4gICAgICBjb25zdCBrdiA9IHRoaXMuZXh0cmFjdEtleXNGcm9tUmVjb3JkKGRhdGEpO1xuICAgICAgcmV0dXJuIHRoaXMudXBkYXRlUmVjb3JkKGt2LCB0b1VwZGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0S2V5c1ZhbHVlcygpOiBhbnlbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZ2V0QWxsVmFsdWVzKCk7XG4gICAgcmV0dXJuIGRhdGEubWFwKChyb3cpID0+IHtcbiAgICAgIGNvbnN0IG9iaiA9IHt9O1xuICAgICAgdGhpcy5rZXlzQXJyYXkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChyb3dba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgb2JqW2tleV0gPSByb3dba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSk7XG4gIH1cblxuICBvblNob3dzU2VsZWN0cygpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25TaG93c1NlbGVjdHMoKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKSB7XG4gICAgLy8gSW5pdGlhbGl6aW5nIHJvdyBzZWxlY3Rpb24gbGlzdGVuZXJcbiAgICBpZiAoIXRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uICYmIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5zZWxlY3Rpb24uY2hhbmdlZC5zdWJzY3JpYmUoKHNlbGVjdGlvbkRhdGE6IFNlbGVjdGlvbkNoYW5nZTxhbnk+KSA9PiB7XG4gICAgICAgIGlmIChzZWxlY3Rpb25EYXRhICYmIHNlbGVjdGlvbkRhdGEuYWRkZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Sb3dTZWxlY3RlZCwgc2VsZWN0aW9uRGF0YS5hZGRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGlvbkRhdGEgJiYgc2VsZWN0aW9uRGF0YS5yZW1vdmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uUm93RGVzZWxlY3RlZCwgc2VsZWN0aW9uRGF0YS5yZW1vdmVkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uQ29sdW1uU3RhdGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVTZWxlY3Rpb25Db2x1bW5TdGF0ZSgpIHtcbiAgICBpZiAoIXRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUpIHtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMgJiYgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZVxuICAgICAgJiYgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1uc1swXSAhPT0gQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLnVuc2hpZnQoQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMgJiYgIXRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGVcbiAgICAgICYmIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnNbMF0gPT09IENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCkge1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5zaGlmdCgpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVN0YXRlRXhwYW5kZWRDb2x1bW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0FsbFNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG51bVNlbGVjdGVkID0gdGhpcy5zZWxlY3Rpb24uc2VsZWN0ZWQubGVuZ3RoO1xuICAgIGNvbnN0IG51bVJvd3MgPSB0aGlzLmRhdGFTb3VyY2UgPyB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmxlbmd0aCA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gbnVtU2VsZWN0ZWQgPiAwICYmIG51bVNlbGVjdGVkID09PSBudW1Sb3dzO1xuICB9XG5cbiAgcHVibGljIG1hc3RlclRvZ2dsZShldmVudDogTWF0Q2hlY2tib3hDaGFuZ2UpOiB2b2lkIHtcbiAgICBldmVudC5jaGVja2VkID8gdGhpcy5zZWxlY3RBbGwoKSA6IHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5mb3JFYWNoKHJvdyA9PiB0aGlzLnNlbGVjdGlvbi5zZWxlY3Qocm93KSk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0aW9uQ2hlY2tib3hUb2dnbGUoZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlLCByb3c6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzU2VsZWN0aW9uTW9kZVNpbmdsZSgpKSB7XG4gICAgICB0aGlzLmNsZWFyU2VsZWN0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWRSb3cocm93KTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RlZFJvdyhyb3c6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2V0U2VsZWN0ZWQocm93KTtcbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGdldCBzaG93RGVsZXRlQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZUJ1dHRvbjtcbiAgfVxuXG4gIGdldFRyYWNrQnlGdW5jdGlvbigpOiAoaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSA9PiBzdHJpbmcge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgcmV0dXJuIChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHtcbiAgICAgIGlmIChzZWxmLmhhc1Njcm9sbGFibGVDb250YWluZXIoKSAmJiBpbmRleCA8IChzZWxmLnBhZ2VTY3JvbGxWaXJ0dWFsIC0gMSkgKiBDb2Rlcy5MSU1JVF9TQ1JPTExWSVJUVUFMKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBsZXQgaXRlbUlkOiBzdHJpbmcgPSAnJztcbiAgICAgIGNvbnN0IGtleXNMZW5naHQgPSBzZWxmLmtleXNBcnJheS5sZW5ndGg7XG4gICAgICBzZWxmLmtleXNBcnJheS5mb3JFYWNoKChrZXk6IHN0cmluZywgaWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3Qgc3VmZml4ID0gaWR4IDwgKGtleXNMZW5naHQgLSAxKSA/ICc7JyA6ICcnO1xuICAgICAgICBpdGVtSWQgKz0gaXRlbVtrZXldICsgc3VmZml4O1xuICAgICAgfSk7XG5cblxuICAgICAgY29uc3QgYXN5bmNBbmRWaXNpYmxlID0gc2VsZi5hc3luY0xvYWRDb2x1bW5zLmZpbHRlcihjID0+IHNlbGYuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMuaW5kZXhPZihjKSAhPT0gLTEpO1xuICAgICAgaWYgKHNlbGYuYXN5bmNMb2FkQ29sdW1ucy5sZW5ndGggJiYgYXN5bmNBbmRWaXNpYmxlLmxlbmd0aCA+IDAgJiYgIXNlbGYuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgc2VsZi5xdWVyeVJvd0FzeW5jRGF0YShpbmRleCwgaXRlbSk7XG4gICAgICAgIGlmIChzZWxmLnBhZ2luYXRvciAmJiBpbmRleCA9PT0gKHNlbGYucGFnaW5hdG9yLnBhZ2VTaXplIC0gMSkpIHtcbiAgICAgICAgICBzZWxmLmZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbUlkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1JZDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcXVlcnlSb3dBc3luY0RhdGEocm93SW5kZXg6IG51bWJlciwgcm93RGF0YTogYW55KSB7XG4gICAgY29uc3Qga3YgPSBTZXJ2aWNlVXRpbHMuZ2V0T2JqZWN0UHJvcGVydGllcyhyb3dEYXRhLCB0aGlzLmtleXNBcnJheSk7XG4gICAgLy8gUmVwZWF0aW5nIGNoZWNraW5nIG9mIHZpc2libGUgY29sdW1uXG4gICAgY29uc3QgYXYgPSB0aGlzLmFzeW5jTG9hZENvbHVtbnMuZmlsdGVyKGMgPT4gdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKGMpICE9PSAtMSk7XG4gICAgaWYgKGF2Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gU2tpcHBpbmcgcXVlcnkgaWYgdGhlcmUgYXJlIG5vdCB2aXNpYmxlIGFzeW5jcm9uIGNvbHVtbnNcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sdW1uUXVlcnlBcmdzID0gW2t2LCBhdiwgdGhpcy5lbnRpdHksIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZF07XG4gICAgY29uc3QgcXVlcnlNZXRob2ROYW1lID0gdGhpcy5wYWdlYWJsZSA/IHRoaXMucGFnaW5hdGVkUXVlcnlNZXRob2QgOiB0aGlzLnF1ZXJ5TWV0aG9kO1xuICAgIGlmICh0aGlzLmRhdGFTZXJ2aWNlICYmIChxdWVyeU1ldGhvZE5hbWUgaW4gdGhpcy5kYXRhU2VydmljZSkgJiYgdGhpcy5lbnRpdHkpIHtcbiAgICAgIGlmICh0aGlzLmFzeW5jTG9hZFN1YnNjcmlwdGlvbnNbcm93SW5kZXhdKSB7XG4gICAgICAgIHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tyb3dJbmRleF0udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tyb3dJbmRleF0gPSB0aGlzLmRhdGFTZXJ2aWNlW3F1ZXJ5TWV0aG9kTmFtZV1cbiAgICAgICAgLmFwcGx5KHRoaXMuZGF0YVNlcnZpY2UsIGNvbHVtblF1ZXJ5QXJncylcbiAgICAgICAgLnN1YnNjcmliZSgocmVzOiBTZXJ2aWNlUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAocmVzLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkocmVzLmRhdGEpICYmIHJlcy5kYXRhLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICBkYXRhID0gcmVzLmRhdGFbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QocmVzLmRhdGEpKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSByZXMuZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGFvVGFibGUuc2V0QXN5bmNocm9ub3VzQ29sdW1uKGRhdGEsIHJvd0RhdGEpO1xuICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEN1cnJlbnREYXRhKCk7XG4gIH1cblxuICBnZXRBbGxWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5nZXRDdXJyZW50QWxsRGF0YSgpO1xuICB9XG5cbiAgZ2V0QWxsUmVuZGVyZWRWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5nZXRBbGxSZW5kZXJlckRhdGEoKTtcbiAgfVxuXG4gIGdldFJlbmRlcmVkVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNvdXJjZS5nZXRDdXJyZW50UmVuZGVyZXJEYXRhKCk7XG4gIH1cblxuICBnZXRTcWxUeXBlcygpIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhU291cmNlLnNxbFR5cGVzKSA/IHRoaXMuZGF0YVNvdXJjZS5zcWxUeXBlcyA6IHt9O1xuICB9XG5cbiAgc2V0T1RhYmxlQ29sdW1uc0ZpbHRlcih0YWJsZUNvbHVtbnNGaWx0ZXI6IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQpIHtcbiAgICB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgPSB0YWJsZUNvbHVtbnNGaWx0ZXI7XG4gIH1cblxuICBnZXQgZmlsdGVyQ29sdW1ucygpIHtcblxuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSAmJlxuICAgICAgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW5zJykgJiZcbiAgICAgIHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW5zJykgJiZcbiAgICAgIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydmaWx0ZXItY29sdW1ucyddID09PSB0aGlzLm9yaWdpbmFsRmlsdGVyQ29sdW1ucykge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW5zJykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ107XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3JpZ2luYWxGaWx0ZXJDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IG9yaWdpbmFsRmlsdGVyQ29sdW1ucygpOiBBcnJheTxPRmlsdGVyQ29sdW1uPiB7XG4gICAgbGV0IHNvcnRDb2x1bW5zRmlsdGVyID0gW107XG4gICAgaWYgKHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgc29ydENvbHVtbnNGaWx0ZXIgPSB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuY29sdW1uc0FycmF5O1xuICAgIH1cbiAgICByZXR1cm4gc29ydENvbHVtbnNGaWx0ZXI7XG4gIH1cblxuICBnZXRTdG9yZWRDb2x1bW5zRmlsdGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5vVGFibGVTdG9yYWdlLmdldFN0b3JlZENvbHVtbnNGaWx0ZXJzKCk7XG4gIH1cblxuICBvbkZpbHRlckJ5Q29sdW1uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25GaWx0ZXJCeUNvbHVtbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvblN0b3JlRmlsdGVyQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25TdG9yZUZpbHRlckNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkxvYWRGaWx0ZXJDbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkxvYWRGaWx0ZXJDbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgb25DbGVhckZpbHRlckNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uQ2xlYXJGaWx0ZXJDbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJGaWx0ZXJzKHRyaWdnZXJEYXRhc291cmNlVXBkYXRlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuZGF0YVNvdXJjZS5jbGVhckNvbHVtbkZpbHRlcnModHJpZ2dlckRhdGFzb3VyY2VVcGRhdGUpO1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUgJiYgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbikge1xuICAgICAgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbi5zZXRBY3RpdmUodGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uKTtcbiAgICB9XG4gICAgdGhpcy5vbkZpbHRlckJ5Q29sdW1uQ2hhbmdlLmVtaXQodGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVycygpKTtcbiAgICBpZiAodGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5zZXRWYWx1ZSh2b2lkIDApO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyQ29sdW1uRmlsdGVyKGF0dHI6IHN0cmluZywgdHJpZ2dlckRhdGFzb3VyY2VVcGRhdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlLmNsZWFyQ29sdW1uRmlsdGVyKGF0dHIsIHRyaWdnZXJEYXRhc291cmNlVXBkYXRlKTtcbiAgICB0aGlzLm9uRmlsdGVyQnlDb2x1bW5DaGFuZ2UuZW1pdCh0aGlzLmRhdGFTb3VyY2UuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJzKCkpO1xuICAgIHRoaXMucmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpO1xuICB9XG5cbiAgZmlsdGVyQnlDb2x1bW4oY29sdW1uVmFsdWVGaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlcikge1xuICAgIHRoaXMuZGF0YVNvdXJjZS5hZGRDb2x1bW5GaWx0ZXIoY29sdW1uVmFsdWVGaWx0ZXIpO1xuICAgIHRoaXMub25GaWx0ZXJCeUNvbHVtbkNoYW5nZS5lbWl0KHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKSk7XG4gICAgdGhpcy5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk7XG4gIH1cblxuICBjbGVhckNvbHVtbkZpbHRlcnModHJpZ2dlckRhdGFzb3VyY2VVcGRhdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlLmNsZWFyQ29sdW1uRmlsdGVycyh0cmlnZ2VyRGF0YXNvdXJjZVVwZGF0ZSk7XG4gICAgdGhpcy5vbkZpbHRlckJ5Q29sdW1uQ2hhbmdlLmVtaXQodGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVycygpKTtcbiAgICB0aGlzLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgfVxuXG4gIGlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAmJiB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuaXNDb2x1bW5GaWx0ZXJhYmxlKGNvbHVtbi5hdHRyKSk7XG4gIH1cblxuICBpc01vZGVDb2x1bW5GaWx0ZXJhYmxlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gJiZcbiAgICAgICh0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW4uYXR0cikpO1xuICB9XG5cbiAgaXNDb2x1bW5GaWx0ZXJBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiAmJlxuICAgICAgdGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGNvbHVtbi5hdHRyKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgb3BlbkNvbHVtbkZpbHRlckRpYWxvZyhjb2x1bW46IE9Db2x1bW4sIGV2ZW50OiBFdmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcHJldmlvdXNGaWx0ZXI6IHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlckJ5QXR0cihjb2x1bW4uYXR0ciksXG4gICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICBhY3RpdmVTb3J0RGlyZWN0aW9uOiB0aGlzLmdldFNvcnRGaWx0ZXJDb2x1bW4oY29sdW1uKSxcbiAgICAgICAgdGFibGVEYXRhOiB0aGlzLmRhdGFTb3VyY2UuZ2V0VGFibGVEYXRhKCksXG4gICAgICAgIHByZWxvYWRWYWx1ZXM6IHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5wcmVsb2FkVmFsdWVzLFxuICAgICAgICBtb2RlOiB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQubW9kZVxuICAgICAgfSxcbiAgICAgIG1pbldpZHRoOiAnMzgwcHgnLFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG5cbiAgICBkaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIHN3aXRjaCAocmVzdWx0KSB7XG4gICAgICAgIGNhc2UgVGFibGVGaWx0ZXJCeUNvbHVtbkRpYWxvZ1Jlc3VsdC5BQ0NFUFQ6XG4gICAgICAgICAgY29uc3QgY29sdW1uVmFsdWVGaWx0ZXIgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0Q29sdW1uVmFsdWVzRmlsdGVyKCk7XG4gICAgICAgICAgdGhpcy5maWx0ZXJCeUNvbHVtbihjb2x1bW5WYWx1ZUZpbHRlcik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVGFibGVGaWx0ZXJCeUNvbHVtbkRpYWxvZ1Jlc3VsdC5DTEVBUjpcbiAgICAgICAgICBjb25zdCBjb2wgPSBkaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuY29sdW1uO1xuICAgICAgICAgIHRoaXMuY2xlYXJDb2x1bW5GaWx0ZXIoY29sLmF0dHIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5vblNvcnRGaWx0ZXJWYWx1ZXNDaGFuZ2Uuc3Vic2NyaWJlKHNvcnRlZEZpbHRlcmFibGVDb2x1bW4gPT4ge1xuICAgICAgLy8gZ3VhcmRhciBlbiBsb2NhbHN0b3JhZ2UgZWwgY2FtYmlvXG4gICAgICB0aGlzLnN0b3JlRmlsdGVyQ29sdW1ucyhzb3J0ZWRGaWx0ZXJhYmxlQ29sdW1uKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0b3JlRmlsdGVyQ29sdW1ucyhzb3J0Q29sdW1uRmlsdGVyOiBPRmlsdGVyQ29sdW1uKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW5zJykgJiYgdGhpcy5zdGF0ZVsnZmlsdGVyLWNvbHVtbnMnXSkge1xuICAgICAgbGV0IHN0b3JlU29ydENvbHVtbnNGaWx0ZXJTdGF0ZSA9IHRoaXMub1RhYmxlU3RvcmFnZS5nZXRGaWx0ZXJDb2x1bW5zU3RhdGUoKTtcbiAgICAgIC8vaWYgZXhpc3RzIGluIHN0YXRlIHRoZW4gdXBkYXRlZCBzb3J0IHZhbHVlXG4gICAgICBpZiAoc3RvcmVTb3J0Q29sdW1uc0ZpbHRlclN0YXRlWydmaWx0ZXItY29sdW1ucyddLmZpbHRlcih4ID0+IHguYXR0ciA9PT0gc29ydENvbHVtbkZpbHRlci5hdHRyKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHN0b3JlU29ydENvbHVtbnNGaWx0ZXJTdGF0ZVsnZmlsdGVyLWNvbHVtbnMnXS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmIChlbGVtZW50LmF0dHIgPT09IHNvcnRDb2x1bW5GaWx0ZXIuYXR0cikge1xuICAgICAgICAgICAgZWxlbWVudC5zb3J0ID0gc29ydENvbHVtbkZpbHRlci5zb3J0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2Vsc2UgZXhpc3RzIGluIHN0YXRlIHRoZW4gYWRkZWQgZmlsdGVyIGNvbHVtblxuICAgICAgICBzdG9yZVNvcnRDb2x1bW5zRmlsdGVyU3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ10ucHVzaChzb3J0Q29sdW1uRmlsdGVyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ10gPSBzdG9yZVNvcnRDb2x1bW5zRmlsdGVyU3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGVbJ2ZpbHRlci1jb2x1bW5zJ10gPSB0aGlzLmZpbHRlckNvbHVtbnM7XG4gICAgfVxuXG4gIH1cblxuICBnZXRTb3J0RmlsdGVyQ29sdW1uKGNvbHVtbjogT0NvbHVtbik6IHN0cmluZyB7XG4gICAgbGV0IHNvcnRDb2x1bW47XG4gICAgLy8gYXQgZmlyc3QsIGdldCBzdGF0ZSBpbiBsb2NhbHN0b3JhZ2VcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyLWNvbHVtbnMnKSkge1xuICAgICAgdGhpcy5zdGF0ZVsnZmlsdGVyLWNvbHVtbnMnXS5mb3JFYWNoKChlbGVtZW50OiBPRmlsdGVyQ29sdW1uKSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50LmF0dHIgPT09IGNvbHVtbi5hdHRyKSB7XG4gICAgICAgICAgc29ydENvbHVtbiA9IGVsZW1lbnQuc29ydDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9pZiBub3QgdmFsdWUgaW4gbG9jYWxzdG9yYWdlLCBnZXQgc29ydCB2YWx1ZSBpbiBvLXRhYmxlLWNvbHVtbi1maWx0ZXItY29sdW1uIGNvbXBvbmVudFxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc29ydENvbHVtbikgJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICBzb3J0Q29sdW1uID0gdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmdldFNvcnRWYWx1ZU9mRmlsdGVyQ29sdW1uKGNvbHVtbi5hdHRyKTtcbiAgICB9XG5cbiAgICAvL2lmIGVpdGhlciB2YWx1ZSBpbiBvLXRhYmxlLWNvbHVtbi1maWx0ZXItY29sdW1uIG9yIGxvY2Fsc3RvcmFnZSwgZ2V0IHNvcnQgdmFsdWUgaW4gc29ydENvbEFycmF5XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChzb3J0Q29sdW1uKSkge1xuICAgICAgaWYgKHRoaXMuc29ydENvbEFycmF5LmZpbmQoeCA9PiB4LmNvbHVtbk5hbWUgPT09IGNvbHVtbi5hdHRyKSkge1xuICAgICAgICBzb3J0Q29sdW1uID0gdGhpcy5pc0NvbHVtblNvcnRBY3RpdmUoY29sdW1uKSA/ICdhc2MnIDogJ2Rlc2MnXG4gICAgICB9XG4gICAgfVxuXG5cblxuICAgIHJldHVybiBzb3J0Q29sdW1uO1xuICB9XG5cbiAgZ2V0IGRpc2FibGVUYWJsZU1lbnVCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKHRoaXMucGVybWlzc2lvbnMgJiYgdGhpcy5wZXJtaXNzaW9ucy5tZW51ICYmIHRoaXMucGVybWlzc2lvbnMubWVudS5lbmFibGVkID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd1RhYmxlTWVudUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtaXNzaW9uSGlkZGVuID0gISEodGhpcy5wZXJtaXNzaW9ucyAmJiB0aGlzLnBlcm1pc3Npb25zLm1lbnUgJiYgdGhpcy5wZXJtaXNzaW9ucy5tZW51LnZpc2libGUgPT09IGZhbHNlKTtcbiAgICBpZiAocGVybWlzc2lvbkhpZGRlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBzdGF0aWNPcHQgPSB0aGlzLnNlbGVjdEFsbENoZWNrYm94IHx8IHRoaXMuZXhwb3J0QnV0dG9uIHx8IHRoaXMuc2hvd0NvbmZpZ3VyYXRpb25PcHRpb24gfHwgdGhpcy5jb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbiB8fCAodGhpcy5zaG93RmlsdGVyT3B0aW9uICYmIHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAhPT0gdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gc3RhdGljT3B0IHx8IHRoaXMudGFibGVPcHRpb25zLmxlbmd0aCA+IDA7XG4gIH1cblxuICBzZXRPVGFibGVJbnNlcnRhYmxlUm93KHRhYmxlSW5zZXJ0YWJsZVJvdzogT1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudCkge1xuICAgIGNvbnN0IGluc2VydFBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0QWN0aW9uUGVybWlzc2lvbnMoUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fSU5TRVJUKTtcbiAgICBpZiAoaW5zZXJ0UGVybS52aXNpYmxlKSB7XG4gICAgICB0YWJsZUluc2VydGFibGVSb3cuZW5hYmxlZCA9IGluc2VydFBlcm0uZW5hYmxlZDtcbiAgICAgIHRoaXMub1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudCA9IHRhYmxlSW5zZXJ0YWJsZVJvdztcbiAgICAgIHRoaXMuc2hvd0ZpcnN0SW5zZXJ0YWJsZVJvdyA9IHRoaXMub1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudC5pc0ZpcnN0Um93KCk7XG4gICAgICB0aGlzLnNob3dMYXN0SW5zZXJ0YWJsZVJvdyA9ICF0aGlzLnNob3dGaXJzdEluc2VydGFibGVSb3c7XG4gICAgICB0aGlzLm9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQuaW5pdGlhbGl6ZUVkaXRvcnMoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhclNlbGVjdGlvbkFuZEVkaXRpbmcoKSB7XG4gICAgdGhpcy5zZWxlY3Rpb24uY2xlYXIoKTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uZWRpdGluZyA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgdXNlRGV0YWlsQnV0dG9uKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb2x1bW4udHlwZSA9PT0gJ2VkaXRCdXR0b25JblJvdycgfHwgY29sdW1uLnR5cGUgPT09ICdkZXRhaWxCdXR0b25JblJvdyc7XG4gIH1cblxuICBvbkRldGFpbEJ1dHRvbkNsaWNrKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnksIGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHN3aXRjaCAoY29sdW1uLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2VkaXRCdXR0b25JblJvdyc6XG4gICAgICAgIHRoaXMuZWRpdERldGFpbChyb3cpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RldGFpbEJ1dHRvbkluUm93JzpcbiAgICAgICAgdGhpcy52aWV3RGV0YWlsKHJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGdldERldGFpbEJ1dHRvbkljb24oY29sdW1uOiBPQ29sdW1uKSB7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgIHN3aXRjaCAoY29sdW1uLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2VkaXRCdXR0b25JblJvdyc6XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuZWRpdEJ1dHRvbkluUm93SWNvbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZXRhaWxCdXR0b25JblJvdyc6XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuZGV0YWlsQnV0dG9uSW5Sb3dJY29uO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHVzZVBsYWluUmVuZGVyKGNvbHVtbjogT0NvbHVtbiwgcm93OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMudXNlRGV0YWlsQnV0dG9uKGNvbHVtbikgJiYgIWNvbHVtbi5yZW5kZXJlciAmJiAoIWNvbHVtbi5lZGl0b3IgfHwgKCFjb2x1bW4uZWRpdGluZyB8fCAhdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChyb3cpKSk7XG4gIH1cblxuICB1c2VDZWxsUmVuZGVyZXIoY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb2x1bW4ucmVuZGVyZXIgJiYgKCFjb2x1bW4uZWRpdGluZyB8fCBjb2x1bW4uZWRpdGluZyAmJiAhdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChyb3cpKTtcbiAgfVxuXG4gIHVzZUNlbGxFZGl0b3IoY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSk6IGJvb2xlYW4ge1xuICAgIC8vIFRPRE8gQWRkIGNvbHVtbi5lZGl0b3IgaW5zdGFuY2VvZiBPVGFibGVDZWxsRWRpdG9yQm9vbGVhbkNvbXBvbmVudCB0byBjb25kaXRpb25cbiAgICBpZiAoY29sdW1uLmVkaXRvciAmJiBjb2x1bW4uZWRpdG9yLmF1dG9Db21taXQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbHVtbi5lZGl0b3IgJiYgY29sdW1uLmVkaXRpbmcgJiYgdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChyb3cpO1xuICB9XG5cbiAgaXNTZWxlY3Rpb25Nb2RlTXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gQ29kZXMuU0VMRUNUSU9OX01PREVfTVVMVElQTEU7XG4gIH1cblxuICBpc1NlbGVjdGlvbk1vZGVTaW5nbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gQ29kZXMuU0VMRUNUSU9OX01PREVfU0lOR0xFO1xuICB9XG5cbiAgaXNTZWxlY3Rpb25Nb2RlTm9uZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSBDb2Rlcy5TRUxFQ1RJT05fTU9ERV9OT05FO1xuICB9XG5cbiAgb25DaGFuZ2VQYWdlKGV2dDogUGFnZUV2ZW50KSB7XG4gICAgdGhpcy5maW5pc2hRdWVyeVN1YnNjcmlwdGlvbiA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5wYWdlYWJsZSkge1xuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IGV2dC5wYWdlSW5kZXg7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRhYmxlU3RhdGUgPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgZ29pbmdCYWNrID0gZXZ0LnBhZ2VJbmRleCA8IHRoaXMuY3VycmVudFBhZ2U7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IGV2dC5wYWdlSW5kZXg7XG4gICAgY29uc3QgcGFnZVNpemUgPSB0aGlzLnBhZ2luYXRvci5pc1Nob3dpbmdBbGxSb3dzKGV2dC5wYWdlU2l6ZSkgPyB0YWJsZVN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyIDogZXZ0LnBhZ2VTaXplO1xuXG4gICAgY29uc3Qgb2xkUXVlcnlSb3dzID0gdGhpcy5xdWVyeVJvd3M7XG4gICAgY29uc3QgY2hhbmdpbmdQYWdlU2l6ZSA9IChvbGRRdWVyeVJvd3MgIT09IHBhZ2VTaXplKTtcbiAgICB0aGlzLnF1ZXJ5Um93cyA9IHBhZ2VTaXplO1xuXG4gICAgbGV0IG5ld1N0YXJ0UmVjb3JkO1xuICAgIGxldCBxdWVyeUxlbmd0aDtcblxuICAgIGlmIChnb2luZ0JhY2sgfHwgY2hhbmdpbmdQYWdlU2l6ZSkge1xuICAgICAgbmV3U3RhcnRSZWNvcmQgPSAodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzKTtcbiAgICAgIHF1ZXJ5TGVuZ3RoID0gdGhpcy5xdWVyeVJvd3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1N0YXJ0UmVjb3JkID0gTWF0aC5tYXgodGFibGVTdGF0ZS5xdWVyeVJlY29yZE9mZnNldCwgKHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cykpO1xuICAgICAgY29uc3QgbmV3RW5kUmVjb3JkID0gTWF0aC5taW4obmV3U3RhcnRSZWNvcmQgKyB0aGlzLnF1ZXJ5Um93cywgdGFibGVTdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlcik7XG4gICAgICBxdWVyeUxlbmd0aCA9IE1hdGgubWluKHRoaXMucXVlcnlSb3dzLCBuZXdFbmRSZWNvcmQgLSBuZXdTdGFydFJlY29yZCk7XG4gICAgfVxuXG4gICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgIG9mZnNldDogbmV3U3RhcnRSZWNvcmQsXG4gICAgICBsZW5ndGg6IHF1ZXJ5TGVuZ3RoXG4gICAgfTtcbiAgICB0aGlzLmZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgZ2V0T0NvbHVtbihhdHRyOiBzdHJpbmcpOiBPQ29sdW1uIHtcbiAgICByZXR1cm4gdGhpcy5fb1RhYmxlT3B0aW9ucyA/IHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBhdHRyKSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGluc2VydFJlY29yZChyZWNvcmREYXRhOiBhbnksIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHNxbFR5cGVzKSkge1xuICAgICAgY29uc3QgYWxsU3FsVHlwZXMgPSB0aGlzLmdldFNxbFR5cGVzKCk7XG4gICAgICBzcWxUeXBlcyA9IHt9O1xuICAgICAgT2JqZWN0LmtleXMocmVjb3JkRGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBzcWxUeXBlc1trZXldID0gYWxsU3FsVHlwZXNba2V5XTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kYW9UYWJsZS5pbnNlcnRRdWVyeShyZWNvcmREYXRhLCBzcWxUeXBlcyk7XG4gIH1cblxuICB1cGRhdGVSZWNvcmQoZmlsdGVyOiBhbnksIHVwZGF0ZURhdGE6IGFueSwgc3FsVHlwZXM/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSkpIHtcbiAgICAgIHJldHVybiBvZih0aGlzLmRhdGFTb3VyY2UuZGF0YSk7XG4gICAgfVxuICAgIGNvbnN0IHNxbFR5cGVzQXJnID0gc3FsVHlwZXMgfHwge307XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChzcWxUeXBlcykpIHtcbiAgICAgIGNvbnN0IGFsbFNxbFR5cGVzID0gdGhpcy5nZXRTcWxUeXBlcygpO1xuICAgICAgT2JqZWN0LmtleXMoZmlsdGVyKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHNxbFR5cGVzQXJnW2tleV0gPSBhbGxTcWxUeXBlc1trZXldO1xuICAgICAgfSk7XG4gICAgICBPYmplY3Qua2V5cyh1cGRhdGVEYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHNxbFR5cGVzQXJnW2tleV0gPSBhbGxTcWxUeXBlc1trZXldO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRhb1RhYmxlLnVwZGF0ZVF1ZXJ5KGZpbHRlciwgdXBkYXRlRGF0YSwgc3FsVHlwZXNBcmcpO1xuICB9XG5cbiAgZ2V0RGF0YUFycmF5KCkge1xuICAgIHJldHVybiB0aGlzLmRhb1RhYmxlLmRhdGE7XG4gIH1cblxuICBzZXREYXRhQXJyYXkoZGF0YTogQXJyYXk8YW55Pikge1xuICAgIGlmICh0aGlzLmRhb1RhYmxlKSB7XG4gICAgICAvLyByZW1vdGUgcGFnaW5hdGlvbiBoYXMgbm8gc2Vuc2Ugd2hlbiB1c2luZyBzdGF0aWMtZGF0YVxuICAgICAgdGhpcy5wYWdlYWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5zdGF0aWNEYXRhID0gZGF0YTtcbiAgICAgIHRoaXMuZGFvVGFibGUudXNpbmdTdGF0aWNEYXRhID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGFvVGFibGUuc2V0RGF0YUFycmF5KHRoaXMuc3RhdGljRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGRlbGV0ZUxvY2FsSXRlbXMoKSB7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gdGhpcy5nZXREYXRhQXJyYXkoKTtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgc2VsZWN0ZWRJdGVtcy5mb3JFYWNoKChzZWxlY3RlZEl0ZW06IGFueSkgPT4ge1xuICAgICAgZm9yIChsZXQgaiA9IGRhdGFBcnJheS5sZW5ndGggLSAxOyBqID49IDA7IC0taikge1xuICAgICAgICBpZiAoVXRpbC5lcXVhbHMoc2VsZWN0ZWRJdGVtLCBkYXRhQXJyYXlbal0pKSB7XG4gICAgICAgICAgZGF0YUFycmF5LnNwbGljZShqLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB0aGlzLnNldERhdGFBcnJheShkYXRhQXJyYXkpO1xuICB9XG5cbiAgaXNDb2x1bW5Tb3J0QWN0aXZlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZvdW5kID0gdGhpcy5zb3J0Q29sQXJyYXkuZmluZChzb3J0QyA9PiBzb3J0Qy5jb2x1bW5OYW1lID09PSBjb2x1bW4uYXR0cik7XG4gICAgcmV0dXJuIGZvdW5kICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0NvbHVtbkRlc2NTb3J0QWN0aXZlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGZvdW5kID0gdGhpcy5zb3J0Q29sQXJyYXkuZmluZChzb3J0QyA9PiBzb3J0Qy5jb2x1bW5OYW1lID09PSBjb2x1bW4uYXR0ciAmJiAhc29ydEMuYXNjZW5kZW50KTtcbiAgICByZXR1cm4gZm91bmQgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGhhc1RhYkdyb3VwQ2hhbmdlU3Vic2NyaXB0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYkdyb3VwQ2hhbmdlU3Vic2NyaXB0aW9uICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0VtcHR5KHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIVV0aWwuaXNEZWZpbmVkKHZhbHVlKSB8fCAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpICYmICF2YWx1ZSk7XG4gIH1cblxuICBzZXRGaWx0ZXJzQ29uZmlndXJhdGlvbihjb25mOiBhbnkpIHtcbiAgICAvLyBpbml0aWFsaXplIGZpbHRlckNhc2VTZW5zaXRpdmVcblxuICAgIC8qXG4gICAgICBDaGVja2luZyB0aGUgb3JpZ2luYWwgZmlsdGVyQ2FzZVNlbnNpdGl2ZSB3aXRoIHRoZSBmaWx0ZXJDYXNlU2Vuc2l0aXZlIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICBpZiBmaWx0ZXJDYXNlU2Vuc2l0aXZlIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpcyBlcXVhbHMgdG8gb3JpZ2luYWwgZmlsdGVyQ2FzZVNlbnNpdGl2ZSBpbnB1dFxuICAgICAgZmlsdGVyQ2FzZVNlbnNpdGl2ZSB3aWxsIGJlIHRoZSB2YWx1ZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgKi9cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlKSAmJiB0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSAmJlxuICAgICAgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZScpICYmXG4gICAgICB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmUgPT09IGNvbmZbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydmaWx0ZXItY2FzZS1zZW5zaXRpdmUnXSkge1xuICAgICAgdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlID0gY29uZi5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJykgPyBjb25mWydmaWx0ZXItY2FzZS1zZW5zaXRpdmUnXSA6IHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yZWRDb2x1bW5GaWx0ZXJzID0gdGhpcy5vVGFibGVTdG9yYWdlLmdldFN0b3JlZENvbHVtbnNGaWx0ZXJzKGNvbmYpO1xuXG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5maWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHQpICYmIHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpICYmXG4gICAgICB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyLWNvbHVtbi1hY3RpdmUtYnktZGVmYXVsdCcpICYmXG4gICAgICB0aGlzLm9yaWdpbmFsRmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0ICE9PSBjb25mWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnZmlsdGVyLWNvbHVtbi1hY3RpdmUtYnktZGVmYXVsdCddKSB7XG4gICAgICB0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gPSB0aGlzLm9yaWdpbmFsRmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBmaWx0ZXJDb2x1bW5BY3RpdmVCeURlZmF1bHRTdGF0ZSA9IGNvbmYuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jb2x1bW4tYWN0aXZlLWJ5LWRlZmF1bHQnKSA/IGNvbmZbJ2ZpbHRlci1jb2x1bW4tYWN0aXZlLWJ5LWRlZmF1bHQnXSA6IHRoaXMuZmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0O1xuICAgICAgdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gZmlsdGVyQ29sdW1uQWN0aXZlQnlEZWZhdWx0U3RhdGUgfHwgc3RvcmVkQ29sdW1uRmlsdGVycy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUgJiYgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbikge1xuICAgICAgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbi5zZXRBY3RpdmUodGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UuaW5pdGlhbGl6ZUNvbHVtbnNGaWx0ZXJzKHN0b3JlZENvbHVtbkZpbHRlcnMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50LnNldFZhbHVlKGNvbmYuZmlsdGVyKTtcbiAgICAgIGNvbnN0IHN0b3JlZENvbHVtbnNEYXRhID0gY29uZi5vQ29sdW1ucyB8fCBbXTtcbiAgICAgIHN0b3JlZENvbHVtbnNEYXRhLmZvckVhY2goKG9Db2xEYXRhOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb0NvbCA9IHRoaXMuZ2V0T0NvbHVtbihvQ29sRGF0YS5hdHRyKTtcbiAgICAgICAgaWYgKG9Db2wpIHtcbiAgICAgICAgICBpZiAob0NvbERhdGEuaGFzT3duUHJvcGVydHkoJ3NlYXJjaGluZycpKSB7XG4gICAgICAgICAgICBvQ29sLnNlYXJjaGluZyA9IG9Db2xEYXRhLnNlYXJjaGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RvcmVDb25maWd1cmF0aW9uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25TdG9yZUNvbmZpZ3VyYXRpb25DbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgb25BcHBseUNvbmZpZ3VyYXRpb25DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkFwcGx5Q29uZmlndXJhdGlvbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBhcHBseURlZmF1bHRDb25maWd1cmF0aW9uKCkge1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZS5yZXNldCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVBhcmFtcygpO1xuICAgIHRoaXMucGFyc2VWaXNpYmxlQ29sdW1ucygpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb3J0KChhOiBPQ29sdW1uLCBiOiBPQ29sdW1uKSA9PiB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGEuYXR0cikgLSB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGIuYXR0cikpO1xuICAgIHRoaXMuaW5zaWRlVGFiQnVnV29ya2Fyb3VuZCgpO1xuICAgIHRoaXMub25SZWluaXRpYWxpemUuZW1pdChudWxsKTtcbiAgICB0aGlzLmNsZWFyRmlsdGVycyhmYWxzZSk7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gIH1cblxuICBhcHBseUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbk5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHN0b3JlZENvbmZpZ3VyYXRpb24gPSB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uTmFtZSk7XG4gICAgaWYgKHN0b3JlZENvbmZpZ3VyYXRpb24pIHtcbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBzdG9yZWRDb25maWd1cmF0aW9uW09UYWJsZVN0b3JhZ2UuU1RPUkVEX1BST1BFUlRJRVNfS0VZXSB8fCBbXTtcbiAgICAgIGNvbnN0IGNvbmYgPSBzdG9yZWRDb25maWd1cmF0aW9uW09UYWJsZVN0b3JhZ2UuU1RPUkVEX0NPTkZJR1VSQVRJT05fS0VZXTtcbiAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgICBjYXNlICdzb3J0JzpcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddID0gY29uZlsnc29ydC1jb2x1bW5zJ107XG4gICAgICAgICAgICB0aGlzLnBhcnNlU29ydENvbHVtbnMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2NvbHVtbnMtZGlzcGxheSc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J10gPSBjb25mWydvQ29sdW1ucy1kaXNwbGF5J107XG4gICAgICAgICAgICB0aGlzLnBhcnNlVmlzaWJsZUNvbHVtbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddID0gY29uZlsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ107XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVDaGVja2JveENvbHVtbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncXVpY2stZmlsdGVyJzpcbiAgICAgICAgICBjYXNlICdjb2x1bW5zLWZpbHRlcic6XG4gICAgICAgICAgICB0aGlzLnNldEZpbHRlcnNDb25maWd1cmF0aW9uKGNvbmYpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncGFnZSc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlID0gY29uZi5jdXJyZW50UGFnZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBjb25mLmN1cnJlbnRQYWdlO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciA9IGNvbmYudG90YWxRdWVyeVJlY29yZHNOdW1iZXI7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSBjb25mLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWVyeVJvd3MgPSBjb25mWydxdWVyeS1yb3dzJ107XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICBnZXRUaXRsZUFsaWduQ2xhc3Mob0NvbDogT0NvbHVtbikge1xuICAgIGxldCBhbGlnbjtcbiAgICBjb25zdCBoYXNUaXRsZUFsaWduID0gVXRpbC5pc0RlZmluZWQob0NvbC5kZWZpbml0aW9uKSAmJiBVdGlsLmlzRGVmaW5lZChvQ29sLmRlZmluaXRpb24udGl0bGVBbGlnbik7XG4gICAgY29uc3QgYXV0b0FsaWduID0gKHRoaXMuYXV0b0FsaWduVGl0bGVzICYmICFoYXNUaXRsZUFsaWduKSB8fCAoaGFzVGl0bGVBbGlnbiAmJiBvQ29sLmRlZmluaXRpb24udGl0bGVBbGlnbiA9PT0gQ29kZXMuQ09MVU1OX1RJVExFX0FMSUdOX0FVVE8pO1xuICAgIGlmICghYXV0b0FsaWduKSB7XG4gICAgICByZXR1cm4gb0NvbC5nZXRUaXRsZUFsaWduQ2xhc3MoKTtcbiAgICB9XG4gICAgc3dpdGNoIChvQ29sLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAnYWN0aW9uJzpcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9DRU5URVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3VycmVuY3knOlxuICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICBjYXNlICdyZWFsJzpcbiAgICAgIGNhc2UgJ3BlcmNlbnRhZ2UnOlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9FTkQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VydmljZSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9TVEFSVDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBhbGlnbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZWxsQWxpZ25DbGFzcyhjb2x1bW46IE9Db2x1bW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZChjb2x1bW4uZGVmaW5pdGlvbikgJiYgVXRpbC5pc0RlZmluZWQoY29sdW1uLmRlZmluaXRpb24uY29udGVudEFsaWduKSA/ICdvLScgKyBjb2x1bW4uZGVmaW5pdGlvbi5jb250ZW50QWxpZ24gOiAnJztcbiAgfVxuXG4gIG9uVGFibGVTY3JvbGwoZSkge1xuICAgIGlmICh0aGlzLmhhc1Njcm9sbGFibGVDb250YWluZXIoKSkge1xuICAgICAgY29uc3QgdGFibGVWaWV3SGVpZ2h0ID0gZS50YXJnZXQub2Zmc2V0SGVpZ2h0OyAvLyB2aWV3cG9ydDogfjUwMHB4XG4gICAgICBjb25zdCB0YWJsZVNjcm9sbEhlaWdodCA9IGUudGFyZ2V0LnNjcm9sbEhlaWdodDsgLy8gbGVuZ3RoIG9mIGFsbCB0YWJsZVxuICAgICAgY29uc3Qgc2Nyb2xsTG9jYXRpb24gPSBlLnRhcmdldC5zY3JvbGxUb3A7IC8vIGhvdyBmYXIgdXNlciBzY3JvbGxlZFxuXG4gICAgICAvLyBJZiB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgd2l0aGluIDIwMHB4IG9mIHRoZSBib3R0b20sIGFkZCBtb3JlIGRhdGFcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IDEwMDtcbiAgICAgIGNvbnN0IGxpbWl0X1NDUk9MTFZJUlRVQUwgPSB0YWJsZVNjcm9sbEhlaWdodCAtIHRhYmxlVmlld0hlaWdodCAtIGJ1ZmZlcjtcbiAgICAgIGlmIChzY3JvbGxMb2NhdGlvbiA+IGxpbWl0X1NDUk9MTFZJUlRVQUwpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhU2Nyb2xsYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldERhdGFTY3JvbGxhYmxlKCk6IGFueSB7XG4gICAgY29uc3QgcGFnZVZpcnR1YWxCZWZvcmUgPSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsO1xuICAgIGNvbnN0IHBhZ2VWaXJ0dWFsRW5kID0gTWF0aC5jZWlsKHRoaXMuZGF0YVNvdXJjZS5yZXN1bHRzTGVuZ3RoIC8gQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCk7XG5cbiAgICBpZiAocGFnZVZpcnR1YWxFbmQgIT09IHRoaXMucGFnZVNjcm9sbFZpcnR1YWwpIHtcbiAgICAgIHRoaXMucGFnZVNjcm9sbFZpcnR1YWwrKztcbiAgICB9XG5cbiAgICAvLyB0aHJvdyBldmVudCBjaGFuZ2Ugc2Nyb2xsXG4gICAgaWYgKHBhZ2VWaXJ0dWFsQmVmb3JlICE9PSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsKSB7XG4gICAgICB0aGlzLmxvYWRpbmdTY3JvbGxTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UubG9hZERhdGFTY3JvbGxhYmxlID0gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbDtcbiAgICB9XG4gIH1cblxuICBoYXNTY3JvbGxhYmxlQ29udGFpbmVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UgJiYgIXRoaXMucGFnaW5hdGlvbkNvbnRyb2xzICYmICF0aGlzLnBhZ2VhYmxlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZERlZmF1bHRSb3dCdXR0b25zKCkge1xuICAgIC8vIGNoZWNrIHBlcm1pc3Npb25zXG4gICAgaWYgKHRoaXMuZWRpdEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLmFkZEJ1dHRvbkluUm93KCdlZGl0QnV0dG9uSW5Sb3cnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGV0YWlsQnV0dG9uSW5Sb3cpIHtcbiAgICAgIHRoaXMuYWRkQnV0dG9uSW5Sb3coJ2RldGFpbEJ1dHRvbkluUm93Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFkZEJ1dHRvbkluUm93KG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbERlZjogT0NvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbihuYW1lLCB0aGlzKTtcbiAgICBjb2xEZWYudHlwZSA9IG5hbWU7XG4gICAgY29sRGVmLnZpc2libGUgPSB0cnVlO1xuICAgIGNvbERlZi5zZWFyY2hhYmxlID0gZmFsc2U7XG4gICAgY29sRGVmLm9yZGVyYWJsZSA9IGZhbHNlO1xuICAgIGNvbERlZi5yZXNpemFibGUgPSBmYWxzZTtcbiAgICBjb2xEZWYudGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgY29sRGVmLndpZHRoID0gJzQ4cHgnO1xuICAgIHRoaXMucHVzaE9Db2x1bW5EZWZpbml0aW9uKGNvbERlZik7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5wdXNoKG5hbWUpO1xuICB9XG5cbiAgZ2V0IGhlYWRlckhlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gMDtcbiAgICBpZiAodGhpcy50YWJsZUhlYWRlckVsICYmIHRoaXMudGFibGVIZWFkZXJFbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgKz0gdGhpcy50YWJsZUhlYWRlckVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBpZiAodGhpcy50YWJsZVRvb2xiYXJFbCAmJiB0aGlzLnRhYmxlVG9vbGJhckVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGhlaWdodCArPSB0aGlzLnRhYmxlVG9vbGJhckVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0O1xuICB9XG5cbiAgaXNEZXRhaWxNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRldGFpbE1vZGUgIT09IENvZGVzLkRFVEFJTF9NT0RFX05PTkU7XG4gIH1cblxuICBjb3B5QWxsKCkge1xuICAgIFV0aWwuY29weVRvQ2xpcGJvYXJkKEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0UmVuZGVyZWRWYWx1ZSgpKSk7XG4gIH1cblxuICBjb3B5U2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmRhdGFTb3VyY2UuZ2V0UmVuZGVyZWREYXRhKHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpKTtcbiAgICBVdGlsLmNvcHlUb0NsaXBib2FyZChKU09OLnN0cmluZ2lmeShzZWxlY3RlZEl0ZW1zKSk7XG4gIH1cblxuICB2aWV3RGV0YWlsKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKCdkZXRhaWwnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdXBlci52aWV3RGV0YWlsKGl0ZW0pO1xuICB9XG5cbiAgZWRpdERldGFpbChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbignZWRpdCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLmVkaXREZXRhaWwoaXRlbSk7XG4gIH1cblxuICBnZXRPQ29sdW1uRnJvbVRoKHRoOiBhbnkpOiBPQ29sdW1uIHtcbiAgICBsZXQgcmVzdWx0OiBPQ29sdW1uO1xuICAgIGNvbnN0IGNsYXNzTGlzdDogYW55W10gPSBbXS5zbGljZS5jYWxsKCh0aCBhcyBFbGVtZW50KS5jbGFzc0xpc3QpO1xuICAgIGNvbnN0IGNvbHVtbkNsYXNzID0gY2xhc3NMaXN0LmZpbmQoKGNsYXNzTmFtZTogc3RyaW5nKSA9PiAoY2xhc3NOYW1lLnN0YXJ0c1dpdGgoJ21hdC1jb2x1bW4tJykpKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uQ2xhc3MpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uQ2xhc3Muc3Vic3RyKCdtYXQtY29sdW1uLScubGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRUaFdpZHRoRnJvbU9Db2x1bW4ob0NvbHVtbjogT0NvbHVtbik6IGFueSB7XG4gICAgbGV0IHdpZHRoQ29sdW1uOiBudW1iZXI7XG4gICAgY29uc3QgdGhBcnJheSA9IFtdLnNsaWNlLmNhbGwodGhpcy50YWJsZUhlYWRlckVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW4pO1xuICAgIGZvciAoY29uc3QgdGggb2YgdGhBcnJheSkge1xuICAgICAgY29uc3QgY2xhc3NMaXN0OiBhbnlbXSA9IFtdLnNsaWNlLmNhbGwoKHRoIGFzIEVsZW1lbnQpLmNsYXNzTGlzdCk7XG4gICAgICBjb25zdCBjb2x1bW5DbGFzcyA9IGNsYXNzTGlzdC5maW5kKChjbGFzc05hbWU6IHN0cmluZykgPT4gKGNsYXNzTmFtZSA9PT0gJ21hdC1jb2x1bW4tJyArIG9Db2x1bW4uYXR0cikpO1xuICAgICAgaWYgKGNvbHVtbkNsYXNzICYmIGNvbHVtbkNsYXNzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgd2lkdGhDb2x1bW4gPSB0aC5jbGllbnRXaWR0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB3aWR0aENvbHVtbjtcbiAgfVxuXG4gIGdldENvbHVtbkluc2VydGFibGUobmFtZSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5hbWUgKyB0aGlzLmdldFN1ZmZpeENvbHVtbkluc2VydGFibGUoKTtcbiAgfVxuXG4gIGlzUm93U2VsZWN0ZWQocm93OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNTZWxlY3Rpb25Nb2RlTm9uZSgpICYmIHRoaXMuc2VsZWN0aW9uLmlzU2VsZWN0ZWQocm93KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRDb2x1bW5zV2lkdGhGcm9tRE9NKCkge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnRhYmxlSGVhZGVyRWwpKSB7XG4gICAgICBbXS5zbGljZS5jYWxsKHRoaXMudGFibGVIZWFkZXJFbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuKS5mb3JFYWNoKHRoRWwgPT4ge1xuICAgICAgICBjb25zdCBvQ29sOiBPQ29sdW1uID0gdGhpcy5nZXRPQ29sdW1uRnJvbVRoKHRoRWwpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQob0NvbCkgJiYgdGhFbC5jbGllbnRXaWR0aCA+IDAgJiYgb0NvbC5ET01XaWR0aCAhPT0gdGhFbC5jbGllbnRXaWR0aCkge1xuICAgICAgICAgIG9Db2wuRE9NV2lkdGggPSB0aEVsLmNsaWVudFdpZHRoO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZWZyZXNoQ29sdW1uc1dpZHRoKCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihjID0+IGMudmlzaWJsZSkuZm9yRWFjaChjID0+IHtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGMuZGVmaW5pdGlvbikgJiYgVXRpbC5pc0RlZmluZWQoYy5kZWZpbml0aW9uLndpZHRoKSkge1xuICAgICAgICAgIGMud2lkdGggPSBjLmRlZmluaXRpb24ud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgYy5nZXRSZW5kZXJXaWR0aCh0aGlzLmhvcml6b250YWxTY3JvbGwsIHRoaXMuZ2V0Q2xpZW50V2lkdGhDb2x1bW4oYykpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT0NvbHVtbihhdHRyPzogc3RyaW5nLCB0YWJsZT86IE9UYWJsZUNvbXBvbmVudCwgY29sdW1uPzogT1RhYmxlQ29sdW1uQ29tcG9uZW50ICYgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCk6IE9Db2x1bW4ge1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IE9Db2x1bW4oKTtcbiAgICBpZiAoYXR0cikge1xuICAgICAgaW5zdGFuY2UuYXR0ciA9IGF0dHI7XG4gICAgfVxuICAgIGlmICh0YWJsZSkge1xuICAgICAgaW5zdGFuY2Uuc2V0RGVmYXVsdFByb3BlcnRpZXMoe1xuICAgICAgICBvcmRlcmFibGU6IHRoaXMub3JkZXJhYmxlLFxuICAgICAgICByZXNpemFibGU6IHRoaXMucmVzaXphYmxlXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGNvbHVtbikge1xuICAgICAgaW5zdGFuY2Uuc2V0Q29sdW1uUHJvcGVydGllcyhjb2x1bW4pO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPVGFibGVCdXR0b25zKGFyZzogT1RhYmxlQnV0dG9ucykge1xuICAgIHRoaXMub1RhYmxlQnV0dG9ucyA9IGFyZztcbiAgICBpZiAodGhpcy5vVGFibGVCdXR0b25zKSB7XG4gICAgICB0aGlzLm9UYWJsZUJ1dHRvbnMucmVnaXN0ZXJCdXR0b25zKHRoaXMudGFibGVCdXR0b25zLnRvQXJyYXkoKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldENsaWVudFdpZHRoQ29sdW1uKGNvbDogT0NvbHVtbik6IG51bWJlciB7XG4gICAgcmV0dXJuIGNvbC5ET01XaWR0aCB8fCB0aGlzLmdldFRoV2lkdGhGcm9tT0NvbHVtbihjb2wpO1xuICB9XG5cbiAgcHVibGljIGdldE1pbldpZHRoQ29sdW1uKGNvbDogT0NvbHVtbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIFV0aWwuZXh0cmFjdFBpeGVsc1ZhbHVlKGNvbC5taW5XaWR0aCwgQ29kZXMuREVGQVVMVF9DT0xVTU5fTUlOX1dJRFRIKSArICdweCc7XG4gIH1cblxufVxuIl19