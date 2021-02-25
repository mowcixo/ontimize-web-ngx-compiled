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
    'rowClass: row-class'
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
    constructor(injector, elRef, dialog, form) {
        super(injector, elRef, form);
        this.dialog = dialog;
        this.selectAllCheckbox = false;
        this.exportButton = true;
        this.showConfigurationOption = true;
        this.columnsVisibilityButton = true;
        this.showFilterOption = true;
        this.showButtonsText = true;
        this.filterCaseSensitivePvt = false;
        this.insertButton = true;
        this.refreshButton = true;
        this.deleteButton = true;
        this.paginationControls = true;
        this.fixedHeader = false;
        this.showTitle = false;
        this.editionMode = Codes.DETAIL_MODE_NONE;
        this.selectionMode = Codes.SELECTION_MODE_MULTIPLE;
        this.horizontalScroll = false;
        this.showPaginatorFirstLastButtons = true;
        this.autoAlignTitles = false;
        this.multipleSort = true;
        this.orderable = true;
        this.resizable = true;
        this.autoAdjust = true;
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
        this.showFilterByColumnIcon = false;
        this.showTotalsSubject = new BehaviorSubject(false);
        this.showTotals = this.showTotalsSubject.asObservable();
        this.loadingSortingSubject = new BehaviorSubject(false);
        this.loadingSorting = this.loadingSortingSubject.asObservable();
        this.loadingScrollSubject = new BehaviorSubject(false);
        this.loadingScroll = this.loadingScrollSubject.asObservable();
        this.showFirstInsertableRow = false;
        this.showLastInsertableRow = false;
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
            if (containsSelectionCol) {
                this._visibleColArray.unshift(Codes.NAME_COLUMN_SELECT);
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
    }
    ngAfterViewInit() {
        this.afterViewInit();
        this.initTableAfterViewInit();
        if (this.oTableMenu) {
            this.matMenu = this.oTableMenu.matMenu;
            this.oTableMenu.registerOptions(this.tableOptions.toArray());
        }
        if (this.oTableButtons) {
            this.oTableButtons.registerButtons(this.tableButtons.toArray());
        }
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
        this.initializeCheckboxColumn();
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
        this.getColumnsWidthFromDOM();
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
    handleClick(item, $event) {
        this.clickTimer = setTimeout(() => {
            if (!this.clickPrevent) {
                this.doHandleClick(item, $event);
            }
            this.clickPrevent = false;
        }, this.clickDelay);
    }
    doHandleClick(item, $event) {
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
            const selectedItems = this.getSelectedItems();
            if (this.selection.isSelected(item) && selectedItems.length === 1 && this.editionEnabled) {
                return;
            }
            else {
                this.clearSelectionAndEditing();
            }
            this.selectedRow(item);
            ObservableWrapper.callEmit(this.onClick, item);
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
        if (this.oTableQuickFilterComponent) {
            this.oTableQuickFilterComponent.setValue(void 0);
        }
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
                tableData: this.dataSource.getTableData(),
                preloadValues: this.oTableColumnsFilterComponent.preloadValues,
                mode: this.oTableColumnsFilterComponent.mode
            },
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-table-dialog']
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
                this.dataSource.addColumnFilter(columnValueFilter);
                this.reloadPaginatedDataFromStart();
            }
        });
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
        this.showFilterByColumnIcon = storedColumnFilters.length > 0;
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
        this._oTableOptions.columns.filter(c => c.visible).forEach((c) => {
            c.DOMWidth = undefined;
        });
        this.cd.detectChanges();
        setTimeout(() => {
            this.getColumnsWidthFromDOM();
            this._oTableOptions.columns.filter(c => c.visible).forEach(c => {
                if (Util.isDefined(c.definition) && Util.isDefined(c.definition.width) && this.horizontalScroll) {
                    c.width = c.definition.width;
                }
                c.getRenderWidth(this.horizontalScroll);
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
}
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
OTableComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: MatDialog },
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBR1IsUUFBUSxFQUNSLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFFbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFxQixTQUFTLEVBQVcsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQWEsTUFBTSxtQkFBbUIsQ0FBQztBQUN4SCxPQUFPLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNwRixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBVXBGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUdsRSxPQUFPLEVBQUUseUJBQXlCLEVBQXNCLE1BQU0sd0NBQXdDLENBQUM7QUFRdkcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFN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SUFEQyxjQUFjLEVBQUU7O3dEQUNlO0FBd0JoQztJQURDLGNBQWMsRUFBRTs7OzBEQU1oQjtBQUtEO0lBREMsY0FBYyxFQUFFOztxREFDWTtBQUU3QjtJQURDLGNBQWMsRUFBRTs7c0RBQ2E7QUFFOUI7SUFEQyxjQUFjLEVBQUU7O3FEQUNZO0FBRTdCO0lBREMsY0FBYyxFQUFFOzsyREFDa0I7QUFFbkM7SUFEQyxjQUFjLEVBQUU7O29EQUNZO0FBRTdCO0lBREMsY0FBYyxFQUFFOztrREFDVTtBQUkzQjtJQURDLGNBQWMsRUFBRTs7eURBQ2lCO0FBRWxDO0lBREMsY0FBYyxFQUFFOztzRUFDNkI7QUFFOUM7SUFEQyxjQUFjLEVBQUU7O3dEQUNnQjtBQUVqQztJQURDLGNBQWMsRUFBRTs7cURBQ1k7QUFFN0I7SUFEQyxjQUFjLEVBQUU7O2tEQUNTO0FBRTFCO0lBREMsY0FBYyxFQUFFOztrREFDUztBQUUxQjtJQURDLGNBQWMsRUFBRTs7bURBQ1U7QUF1QjNCO0lBREMsY0FBYyxFQUFFOzswREFDaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZWxlY3Rpb25DaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgVmlld1JlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdENoZWNrYm94Q2hhbmdlLCBNYXREaWFsb2csIE1hdE1lbnUsIE1hdFBhZ2luYXRvciwgTWF0VGFiLCBNYXRUYWJHcm91cCwgUGFnZUV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBvZiwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEJvb2xlYW5Db252ZXJ0ZXIsIElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgU2VydmljZVJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBJT0NvbnRleHRNZW51Q29udGV4dCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1jb250ZXh0LW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1idXR0b24uaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtYnV0dG9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlRGF0YVNvdXJjZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1kYXRhc291cmNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVNZW51IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbnMgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLXBhZ2luYXRvci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUXVpY2tmaWx0ZXIgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtcXVpY2tmaWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZmFjdG9yaWVzJztcbmltcG9ydCB7IFNuYWNrQmFyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NuYWNrYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uL3R5cGVzL2V4cHJlc3Npb24udHlwZSc7XG5pbXBvcnQgeyBPQ29sdW1uQWdncmVnYXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMvby1jb2x1bW4tYWdncmVnYXRlLnR5cGUnO1xuaW1wb3J0IHsgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvciwgT0NvbHVtblZhbHVlRmlsdGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvby1jb2x1bW4tdmFsdWUtZmlsdGVyLnR5cGUnO1xuaW1wb3J0IHsgT1Blcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZUluaXRpYWxpemF0aW9uT3B0aW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tdGFibGUtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZU1lbnVQZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tdGFibGUtbWVudS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZVBlcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvby10YWJsZS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuaW1wb3J0IHsgUXVpY2tGaWx0ZXJGdW5jdGlvbiB9IGZyb20gJy4uLy4uL3R5cGVzL3F1aWNrLWZpbHRlci1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IFNRTE9yZGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvc3FsLW9yZGVyLnR5cGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZVdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlsL2FzeW5jJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBTUUxUeXBlcyB9IGZyb20gJy4uLy4uL3V0aWwvc3FsdHlwZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVDb21wb25lbnQgfSBmcm9tICcuLi9jb250ZXh0bWVudS9vLWNvbnRleHQtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0NPTVBPTkVOVCwgT1NlcnZpY2VDb21wb25lbnQgfSBmcm9tICcuLi9vLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9jYWxjdWxhdGVkL28tdGFibGUtY29sdW1uLWNhbGN1bGF0ZWQuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuL2NvbHVtbi9vLWNvbHVtbi5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGVmYXVsdE9UYWJsZU9wdGlvbnMgfSBmcm9tICcuL2V4dGVuc2lvbnMvZGVmYXVsdC1vLXRhYmxlLW9wdGlvbnMuY2xhc3MnO1xuaW1wb3J0IHtcbiAgT1RhYmxlRmlsdGVyQnlDb2x1bW5EYXRhRGlhbG9nQ29tcG9uZW50XG59IGZyb20gJy4vZXh0ZW5zaW9ucy9kaWFsb2cvZmlsdGVyLWJ5LWNvbHVtbi9vLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9CYXNlVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL3BhZ2luYXRvci9vLWJhc2UtdGFibGUtcGFnaW5hdG9yLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWNvbHVtbnMtZmlsdGVyL28tdGFibGUtY29sdW1ucy1maWx0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUluc2VydGFibGVSb3dDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWluc2VydGFibGUtcm93L28tdGFibGUtaW5zZXJ0YWJsZS1yb3cuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbkNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtb3B0aW9uL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVEYXRhU291cmNlU2VydmljZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9vLXRhYmxlLWRhdGFzb3VyY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVTdG9yYWdlIH0gZnJvbSAnLi9leHRlbnNpb25zL28tdGFibGUtc3RvcmFnZS5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVEYW8gfSBmcm9tICcuL2V4dGVuc2lvbnMvby10YWJsZS5kYW8nO1xuaW1wb3J0IHsgT01hdFNvcnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvc29ydC9vLW1hdC1zb3J0JztcbmltcG9ydCB7IE9NYXRTb3J0SGVhZGVyIH0gZnJvbSAnLi9leHRlbnNpb25zL3NvcnQvby1tYXQtc29ydC1oZWFkZXInO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0NPTVBPTkVOVCxcblxuICAvLyB2aXNpYmxlLWNvbHVtbnMgW3N0cmluZ106IHZpc2libGUgY29sdW1ucywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICd2aXNpYmxlQ29sdW1uczogdmlzaWJsZS1jb2x1bW5zJyxcblxuICAvLyBlZGl0YWJsZS1jb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIHRoYXQgY2FuIGJlIGVkaXRlZCBkaXJlY3RseSBvdmVyIHRoZSB0YWJsZSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gIC8vICdlZGl0YWJsZUNvbHVtbnM6IGVkaXRhYmxlLWNvbHVtbnMnLFxuXG4gIC8vIHNvcnQtY29sdW1ucyBbc3RyaW5nXTogaW5pdGlhbCBzb3J0aW5nLCB3aXRoIHRoZSBmb3JtYXQgY29sdW1uOltBU0N8REVTQ10sIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc29ydENvbHVtbnM6IHNvcnQtY29sdW1ucycsXG5cbiAgJ3F1aWNrRmlsdGVyQ2FsbGJhY2s6IHF1aWNrLWZpbHRlci1mdW5jdGlvbicsXG5cbiAgLy8gZGVsZXRlLWJ1dHRvbiBbbm98eWVzXTogc2hvdyBkZWxldGUgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdkZWxldGVCdXR0b246IGRlbGV0ZS1idXR0b24nLFxuXG4gIC8vIHJlZnJlc2gtYnV0dG9uIFtub3x5ZXNdOiBzaG93IHJlZnJlc2ggYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdyZWZyZXNoQnV0dG9uOiByZWZyZXNoLWJ1dHRvbicsXG5cbiAgLy8gY29sdW1ucy12aXNpYmlsaXR5LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBjb2x1bW5zIHZpc2liaWxpdHkgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdjb2x1bW5zVmlzaWJpbGl0eUJ1dHRvbjogY29sdW1ucy12aXNpYmlsaXR5LWJ1dHRvbicsXG5cbiAgLy8gLy8gY29sdW1ucy1yZXNpemUtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGNvbHVtbnMgcmVzaXplIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAvLyAnY29sdW1uc1Jlc2l6ZUJ1dHRvbjogY29sdW1ucy1yZXNpemUtYnV0dG9uJyxcblxuICAvLyAvLyBjb2x1bW5zLWdyb3VwLWJ1dHRvbiBbbm98eWVzXTogc2hvdyBjb2x1bW5zIGdyb3VwIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAvLyAnY29sdW1uc0dyb3VwQnV0dG9uOiBjb2x1bW5zLWdyb3VwLWJ1dHRvbicsXG5cbiAgLy8gZXhwb3J0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBleHBvcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdleHBvcnRCdXR0b246IGV4cG9ydC1idXR0b24nLFxuXG4gIC8vIHNob3ctY29uZmlndXJhdGlvbi1vcHRpb24gW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBjb25maWd1cmF0aW9uIGJ1dHRvbiBpbiBoZWFkZXIuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dDb25maWd1cmF0aW9uT3B0aW9uOiBzaG93LWNvbmZpZ3VyYXRpb24tb3B0aW9uJyxcblxuICAvLyBzaG93LWJ1dHRvbnMtdGV4dCBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHRleHQgb2YgaGVhZGVyIGJ1dHRvbnMuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dCdXR0b25zVGV4dDogc2hvdy1idXR0b25zLXRleHQnLFxuXG4gIC8vIHNlbGVjdC1hbGwtY2hlY2tib3ggW3llc3xub3x0cnVlfGZhbHNlXTogIHNob3cgaW4gdGhlIG1lbnUgdGhlIG9wdGlvbiBvZiBzZWxlY3Rpb24gY2hlY2sgYm94ZXMgLiBEZWZhdWx0OiBuby5cbiAgJ3NlbGVjdEFsbENoZWNrYm94OiBzZWxlY3QtYWxsLWNoZWNrYm94JyxcblxuICAvLyBwYWdpbmF0aW9uLWNvbnRyb2xzIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgcGFnaW5hdGlvbiBjb250cm9scy4gRGVmYXVsdDogeWVzLlxuICAncGFnaW5hdGlvbkNvbnRyb2xzOiBwYWdpbmF0aW9uLWNvbnRyb2xzJyxcblxuICAvLyBmaXgtaGVhZGVyIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IGZpeGVkIGhlYWRlciBhbmQgZm9vdGVyIHdoZW4gdGhlIGNvbnRlbnQgaXMgZ3JlYXRoZXIgdGhhbiBpdHMgb3duIGhlaWdodC4gRGVmYXVsdDogbm8uXG4gICdmaXhlZEhlYWRlcjogZml4ZWQtaGVhZGVyJyxcblxuICAvLyBzaG93LXRpdGxlIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgdGhlIHRhYmxlIHRpdGxlLiBEZWZhdWx0OiBuby5cbiAgJ3Nob3dUaXRsZTogc2hvdy10aXRsZScsXG5cbiAgLy8gZWRpdGlvbi1tb2RlIFtub25lIHwgaW5saW5lIHwgY2xpY2sgfCBkYmxjbGlja106IGVkaXRpb24gbW9kZS4gRGVmYXVsdCBub25lXG4gICdlZGl0aW9uTW9kZTogZWRpdGlvbi1tb2RlJyxcblxuICAvLyBzZWxlY3Rpb24tbW9kZSBbbm9uZSB8IHNpbXBsZSB8IG11bHRpcGxlIF06IHNlbGVjdGlvbiBtb2RlLiBEZWZhdWx0IG11bHRpcGxlXG4gICdzZWxlY3Rpb25Nb2RlOiBzZWxlY3Rpb24tbW9kZScsXG5cbiAgJ2hvcml6b250YWxTY3JvbGw6IGhvcml6b250YWwtc2Nyb2xsJyxcblxuICAnc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM6IHNob3ctcGFnaW5hdG9yLWZpcnN0LWxhc3QtYnV0dG9ucycsXG5cbiAgJ2F1dG9BbGlnblRpdGxlczogYXV0by1hbGlnbi10aXRsZXMnLFxuXG4gICdtdWx0aXBsZVNvcnQ6IG11bHRpcGxlLXNvcnQnLFxuICAvLyBzZWxlY3QtYWxsLWNoZWNrYm94LXZpc2libGUgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBzZWxlY3Rpb24gY2hlY2sgYm94ZXMuRGVmYXVsdDogbm8uXG4gICdzZWxlY3RBbGxDaGVja2JveFZpc2libGU6IHNlbGVjdC1hbGwtY2hlY2tib3gtdmlzaWJsZScsXG5cbiAgJ29yZGVyYWJsZScsXG5cbiAgJ3Jlc2l6YWJsZScsXG5cbiAgLy8gZW5hYmxlZCBbeWVzfG5vfHRydWV8ZmFsc2VdOiBlbmFibGVzIGRlIHRhYmxlLiBEZWZhdWx0OiB5ZXNcbiAgJ2VuYWJsZWQnLFxuXG4gICdrZWVwU2VsZWN0ZWRJdGVtczoga2VlcC1zZWxlY3RlZC1pdGVtcycsXG5cbiAgLy8gZXhwb3J0LW1vZGUgWyd2aXNpYmxlJ3wnbG9jYWwnfCdhbGwnXTogc2V0cyB0aGUgbW9kZSB0byBleHBvcnQgZGF0YS4gRGVmYXVsdDogJ3Zpc2libGUnXG4gICdleHBvcnRNb2RlOiBleHBvcnQtbW9kZScsXG5cbiAgLy8gZXhwb3J0U2VydmljZVR5cGUgWyBzdHJpbmcgXTogVGhlIHNlcnZpY2UgdXNlZCBieSB0aGUgdGFibGUgZm9yIGV4cG9ydGluZyBpdCdzIGRhdGEsIGl0IG11c3QgaW1wbGVtZW50ICdJRXhwb3J0U2VydmljZScgaW50ZXJmYWNlLiBEZWZhdWx0OiAnT250aW1pemVFeHBvcnRTZXJ2aWNlJ1xuICAnZXhwb3J0U2VydmljZVR5cGU6IGV4cG9ydC1zZXJ2aWNlLXR5cGUnLFxuXG4gIC8vIGF1dG8tYWRqdXN0IFt0cnVlfGZhbHNlXTogQXV0byBhZGp1c3QgY29sdW1uIHdpZHRoIHRvIGZpdCBpdHMgY29udGVudC4gRGVmYXVsdDogdHJ1ZVxuICAnYXV0b0FkanVzdDogYXV0by1hZGp1c3QnLFxuXG4gIC8vIHNob3ctZmlsdGVyLW9wdGlvbiBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IGZpbHRlciBtZW51IG9wdGlvbiBpbiB0aGUgaGVhZGVyIG1lbnUuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dGaWx0ZXJPcHRpb246IHNob3ctZmlsdGVyLW9wdGlvbicsXG5cbiAgLy8gdmlzaWJsZS1leHBvcnQtZGlhbG9nLWJ1dHRvbnMgW3N0cmluZ106IHZpc2libGUgYnV0dG9ucyBpbiBleHBvcnQgZGlhbG9nLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0L25vIGNvbmZpZ3VyZWQ6IHNob3cgYWxsLiBFbXB0eSB2YWx1ZTogaGlkZSBhbGwuXG4gICd2aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9uczogdmlzaWJsZS1leHBvcnQtZGlhbG9nLWJ1dHRvbnMnLFxuXG4gIC8vIHJvdy1jbGFzcyBbZnVuY3Rpb24sIChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHN0cmluZ1tdXTogYWRkcyB0aGUgY2xhc3Mgb3IgY2xhc3NlcyByZXR1cm5lZCBieSB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gdG8gdGhlIHRhYmxlIHJvd3MuXG4gICdyb3dDbGFzczogcm93LWNsYXNzJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFID0gW1xuICAnb25DbGljaycsXG4gICdvbkRvdWJsZUNsaWNrJyxcbiAgJ29uUm93U2VsZWN0ZWQnLFxuICAnb25Sb3dEZXNlbGVjdGVkJyxcbiAgJ29uUm93RGVsZXRlZCcsXG4gICdvbkRhdGFMb2FkZWQnLFxuICAnb25QYWdpbmF0ZWREYXRhTG9hZGVkJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS5jb21wb25lbnQuc2NzcyddLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlcixcbiAgICBPVGFibGVEYXRhU291cmNlU2VydmljZVxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEUsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vbnRpbWl6ZS10YWJsZV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLXRhYmxlLWZpeGVkXSc6ICdmaXhlZEhlYWRlcicsXG4gICAgJ1tjbGFzcy5vLXRhYmxlLWRpc2FibGVkXSc6ICchZW5hYmxlZCcsXG4gICAgJyhkb2N1bWVudDpjbGljayknOiAnaGFuZGxlRE9NQ2xpY2soJGV2ZW50KSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDb21wb25lbnQgZXh0ZW5kcyBPU2VydmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfQkFTRV9TSVpFX1NQSU5ORVIgPSAxMDA7XG4gIHB1YmxpYyBzdGF0aWMgRklSU1RfTEFTVF9DRUxMX1BBRERJTkcgPSAyNDtcblxuICBwcm90ZWN0ZWQgc25hY2tCYXJTZXJ2aWNlOiBTbmFja0JhclNlcnZpY2U7XG5cbiAgcHVibGljIHBhZ2luYXRvcjogT1RhYmxlUGFnaW5hdG9yO1xuICBAVmlld0NoaWxkKE1hdFBhZ2luYXRvciwgeyBzdGF0aWM6IGZhbHNlIH0pIG1hdHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xuICBAVmlld0NoaWxkKE9NYXRTb3J0LCB7IHN0YXRpYzogdHJ1ZSB9KSBzb3J0OiBPTWF0U29ydDtcblxuICAvLyBvbmx5IGZvciBpbnNpZGVUYWJCdWdXb3JrYXJvdW5kXG4gIEBWaWV3Q2hpbGRyZW4oT01hdFNvcnRIZWFkZXIpIHByb3RlY3RlZCBzb3J0SGVhZGVyczogUXVlcnlMaXN0PE9NYXRTb3J0SGVhZGVyPjtcblxuICBAVmlld0NoaWxkKCdzcGlubmVyQ29udGFpbmVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIHNwaW5uZXJDb250YWluZXI6IEVsZW1lbnRSZWY7XG4gIGdldCBkaWFtZXRlclNwaW5uZXIoKSB7XG4gICAgY29uc3QgbWluSGVpZ2h0ID0gT1RhYmxlQ29tcG9uZW50LkRFRkFVTFRfQkFTRV9TSVpFX1NQSU5ORVI7XG4gICAgbGV0IGhlaWdodCA9IDA7XG4gICAgaWYgKHRoaXMuc3Bpbm5lckNvbnRhaW5lciAmJiB0aGlzLnNwaW5uZXJDb250YWluZXIubmF0aXZlRWxlbWVudCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5zcGlubmVyQ29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBpZiAoaGVpZ2h0ID4gMCAmJiBoZWlnaHQgPD0gMTAwKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihoZWlnaHQgLSAoaGVpZ2h0ICogMC4xKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBtaW5IZWlnaHQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHRhYmxlQ29udGV4dE1lbnU6IE9Db250ZXh0TWVudUNvbXBvbmVudDtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZWxlY3RBbGxDaGVja2JveDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBleHBvcnRCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93Q29uZmlndXJhdGlvbk9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0ZpbHRlck9wdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dCdXR0b25zVGV4dDogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHJvdGVjdGVkIF9vVGFibGVPcHRpb25zOiBPVGFibGVPcHRpb25zO1xuXG4gIGdldCBvVGFibGVPcHRpb25zKCk6IE9UYWJsZU9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLl9vVGFibGVPcHRpb25zO1xuICB9XG5cbiAgc2V0IG9UYWJsZU9wdGlvbnModmFsdWU6IE9UYWJsZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zID0gdmFsdWU7XG4gIH1cblxuICBzZXQgcXVpY2tGaWx0ZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKFN0cmluZyh2YWx1ZSkpO1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5maWx0ZXIgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBxdWlja0ZpbHRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcXVpY2tGaWx0ZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgZmlsdGVyQ2FzZVNlbnNpdGl2ZVB2dDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZXQgZmlsdGVyQ2FzZVNlbnNpdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZVB2dCA9IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIGlmICh0aGlzLl9vVGFibGVPcHRpb25zKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmZpbHRlckNhc2VTZW5zaXRpdmUgPSB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQ7XG4gICAgfVxuICB9XG4gIGdldCBmaWx0ZXJDYXNlU2Vuc2l0aXZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmVQdnQ7XG4gIH1cbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5zZXJ0QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcmVmcmVzaEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHBhZ2luYXRpb25Db250cm9sczogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGZpeGVkSGVhZGVyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dUaXRsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBlZGl0aW9uTW9kZTogc3RyaW5nID0gQ29kZXMuREVUQUlMX01PREVfTk9ORTtcbiAgc2VsZWN0aW9uTW9kZTogc3RyaW5nID0gQ29kZXMuU0VMRUNUSU9OX01PREVfTVVMVElQTEU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGhvcml6b250YWxTY3JvbGw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBhdXRvQWxpZ25UaXRsZXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgbXVsdGlwbGVTb3J0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgb3JkZXJhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcmVzaXphYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgYXV0b0FkanVzdDogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHJvdGVjdGVkIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQ7XG4gIH1cbiAgc2V0IGVuYWJsZWQodmFsOiBib29sZWFuKSB7XG4gICAgdmFsID0gVXRpbC5wYXJzZUJvb2xlYW4oU3RyaW5nKHZhbCkpO1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTogYm9vbGVhbjtcbiAgc2V0IHNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZSA9IEJvb2xlYW5Db252ZXJ0ZXIodGhpcy5zdGF0ZVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ10pIHx8IEJvb2xlYW5Db252ZXJ0ZXIodmFsdWUpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSB0aGlzLl9zZWxlY3RBbGxDaGVja2JveFZpc2libGU7XG4gICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgfVxuXG4gIGdldCBzZWxlY3RBbGxDaGVja2JveFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdEFsbENoZWNrYm94VmlzaWJsZTtcbiAgfVxuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGtlZXBTZWxlY3RlZEl0ZW1zOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZXhwb3J0TW9kZTogc3RyaW5nID0gQ29kZXMuRVhQT1JUX01PREVfVklTSUJMRTtcbiAgcHVibGljIGV4cG9ydFNlcnZpY2VUeXBlOiBzdHJpbmc7XG4gIHB1YmxpYyB2aXNpYmxlRXhwb3J0RGlhbG9nQnV0dG9uczogc3RyaW5nO1xuICBwdWJsaWMgZGFvVGFibGU6IE9UYWJsZURhbyB8IG51bGw7XG4gIHB1YmxpYyBkYXRhU291cmNlOiBPVGFibGVEYXRhU291cmNlIHwgbnVsbDtcbiAgcHVibGljIHZpc2libGVDb2x1bW5zOiBzdHJpbmc7XG4gIHB1YmxpYyBzb3J0Q29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgcm93Q2xhc3M6IChyb3dEYXRhOiBhbnksIHJvd0luZGV4OiBudW1iZXIpID0+IHN0cmluZyB8IHN0cmluZ1tdO1xuXG4gIC8qcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIF92aXNpYmxlQ29sQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcblxuICBnZXQgdmlzaWJsZUNvbEFycmF5KCk6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiB0aGlzLl92aXNpYmxlQ29sQXJyYXk7XG4gIH1cblxuICBzZXQgdmlzaWJsZUNvbEFycmF5KGFyZzogQXJyYXk8YW55Pikge1xuICAgIGNvbnN0IHBlcm1pc3Npb25zQmxvY2tlZCA9IHRoaXMucGVybWlzc2lvbnMgPyB0aGlzLnBlcm1pc3Npb25zLmNvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wudmlzaWJsZSA9PT0gZmFsc2UpLm1hcChjb2wgPT4gY29sLmF0dHIpIDogW107XG4gICAgY29uc3QgcGVybWlzc2lvbnNDaGVja2VkID0gYXJnLmZpbHRlcih2YWx1ZSA9PiBwZXJtaXNzaW9uc0Jsb2NrZWQuaW5kZXhPZih2YWx1ZSkgPT09IC0xKTtcbiAgICB0aGlzLl92aXNpYmxlQ29sQXJyYXkgPSBwZXJtaXNzaW9uc0NoZWNrZWQ7XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5zU2VsZWN0aW9uQ29sID0gdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCkgIT09IC0xO1xuICAgICAgaWYgKGNvbnRhaW5zU2VsZWN0aW9uQ29sKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGVDb2xBcnJheS51bnNoaWZ0KENvZGVzLk5BTUVfQ09MVU1OX1NFTEVDVCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zID0gdGhpcy5fdmlzaWJsZUNvbEFycmF5O1xuICAgIH1cbiAgfVxuXG4gIHNvcnRDb2xBcnJheTogQXJyYXk8U1FMT3JkZXI+ID0gW107XG4gIC8qZW5kIG9mIHBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgcHJvdGVjdGVkIHRhYkdyb3VwQ29udGFpbmVyOiBNYXRUYWJHcm91cDtcbiAgcHJvdGVjdGVkIHRhYkNvbnRhaW5lcjogTWF0VGFiO1xuICB0YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByb3RlY3RlZCBwZW5kaW5nUXVlcnk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIHBlbmRpbmdRdWVyeUZpbHRlciA9IHVuZGVmaW5lZDtcblxuICBwcm90ZWN0ZWQgc2V0U3RhdGljRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgYXZvaWRRdWVyeUNvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIGFzeW5jTG9hZENvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIGFzeW5jTG9hZFN1YnNjcmlwdGlvbnM6IG9iamVjdCA9IHt9O1xuXG4gIHByb3RlY3RlZCBxdWVyeVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgY29udGV4dE1lbnVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Eb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJvd1NlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUm93RGVzZWxlY3RlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJvd0RlbGV0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUGFnaW5hdGVkRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblJlaW5pdGlhbGl6ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkNvbnRlbnRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25WaXNpYmxlQ29sdW1uc0NoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJvdGVjdGVkIHNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHB1YmxpYyBvVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQ6IE9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudDtcbiAgcHVibGljIG9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQ6IE9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQ7XG4gIHB1YmxpYyBzaG93RmlsdGVyQnlDb2x1bW5JY29uOiBib29sZWFuID0gZmFsc2U7XG5cblxuICBwcml2YXRlIHNob3dUb3RhbHNTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHB1YmxpYyBzaG93VG90YWxzOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5zaG93VG90YWxzU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgcHJpdmF0ZSBsb2FkaW5nU29ydGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHJvdGVjdGVkIGxvYWRpbmdTb3J0aW5nOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5sb2FkaW5nU29ydGluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHByaXZhdGUgbG9hZGluZ1Njcm9sbFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGxvYWRpbmdTY3JvbGw6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTY3JvbGxTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHB1YmxpYyBvVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50OiBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50O1xuICBwdWJsaWMgc2hvd0ZpcnN0SW5zZXJ0YWJsZVJvdzogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgc2hvd0xhc3RJbnNlcnRhYmxlUm93OiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIGNsaWNrVGltZXI7XG4gIHByb3RlY3RlZCBjbGlja0RlbGF5ID0gMjAwO1xuICBwcm90ZWN0ZWQgY2xpY2tQcmV2ZW50ID0gZmFsc2U7XG4gIHByb3RlY3RlZCBlZGl0aW5nQ2VsbDogYW55O1xuICBwcm90ZWN0ZWQgZWRpdGluZ1JvdzogYW55O1xuXG4gIHByb3RlY3RlZCBfY3VycmVudFBhZ2U6IG51bWJlciA9IDA7XG5cbiAgc2V0IGN1cnJlbnRQYWdlKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSB2YWw7XG4gICAgaWYgKHRoaXMucGFnaW5hdG9yKSB7XG4gICAgICB0aGlzLnBhZ2luYXRvci5wYWdlSW5kZXggPSB2YWw7XG4gICAgICBpZiAodGhpcy5tYXRwYWdpbmF0b3IpIHtcbiAgICAgICAgdGhpcy5tYXRwYWdpbmF0b3IucGFnZUluZGV4ID0gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBjdXJyZW50UGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UGFnZTtcbiAgfVxuXG4gIHB1YmxpYyBvVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudDogT1RhYmxlUXVpY2tmaWx0ZXI7XG4gIHByb3RlY3RlZCBzb3J0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBvblJlbmRlcmVkRGF0YUNoYW5nZTogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgcHJldmlvdXNSZW5kZXJlckRhdGE7XG5cbiAgcXVpY2tGaWx0ZXJDYWxsYmFjazogUXVpY2tGaWx0ZXJGdW5jdGlvbjtcblxuICBAVmlld0NoaWxkKCd0YWJsZUJvZHknLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIHRhYmxlQm9keUVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZUhlYWRlcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICB0YWJsZUhlYWRlckVsOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZVRvb2xiYXInLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgdGFibGVUb29sYmFyRWw6IEVsZW1lbnRSZWY7XG5cbiAgaG9yaXpvbnRhbFNjcm9sbGVkOiBib29sZWFuO1xuICBwdWJsaWMgb25VcGRhdGVTY3JvbGxlZFN0YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIHJvd1dpZHRoO1xuXG4gIG9UYWJsZVN0b3JhZ2U6IE9UYWJsZVN0b3JhZ2U7XG4gIHN0b3JlUGFnaW5hdGlvblN0YXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyogSW4gdGhlIGNhc2UgdGhlIHRhYmxlIGhhdmVudCBwYWdpbmF0aW9uQ29udHJvbCBhbmQgcGFnZWFibGUsIHRoZSB0YWJsZSBoYXMgcGFnaW5hdGlvbiB2aXJ0dWFsKi9cbiAgcGFnZVNjcm9sbFZpcnR1YWwgPSAxO1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1RhYmxlUGVybWlzc2lvbnM7XG4gIG1hdE1lbnU6IE1hdE1lbnU7XG5cbiAgQFZpZXdDaGlsZCgndGFibGVNZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIG9UYWJsZU1lbnU6IE9UYWJsZU1lbnU7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihPVGFibGVPcHRpb25Db21wb25lbnQpXG4gIHRhYmxlT3B0aW9uczogUXVlcnlMaXN0PE9UYWJsZU9wdGlvbkNvbXBvbmVudD47XG5cbiAgQFZpZXdDaGlsZCgndGFibGVCdXR0b25zJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIG9UYWJsZUJ1dHRvbnM6IE9UYWJsZUJ1dHRvbnM7XG5cbiAgQENvbnRlbnRDaGlsZHJlbignby10YWJsZS1idXR0b24nKVxuICB0YWJsZUJ1dHRvbnM6IFF1ZXJ5TGlzdDxPVGFibGVCdXR0b24+O1xuXG4gIEBDb250ZW50Q2hpbGQoJ28tdGFibGUtcXVpY2tmaWx0ZXInLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBxdWlja2ZpbHRlckNvbnRlbnRDaGlsZDogT1RhYmxlUXVpY2tmaWx0ZXI7XG5cbiAgQFZpZXdDaGlsZCgnZXhwb3J0T3B0c1RlbXBsYXRlJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIGV4cG9ydE9wdHNUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgW10pXG4gIHVwZGF0ZVNjcm9sbGVkU3RhdGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGJvZHlXaWR0aCA9IHRoaXMudGFibGVCb2R5RWwubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsV2lkdGggPSB0aGlzLnRhYmxlQm9keUVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgICAgIGNvbnN0IHByZXZpb3VzU3RhdGUgPSB0aGlzLmhvcml6b250YWxTY3JvbGxlZDtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsZWQgPSBzY3JvbGxXaWR0aCA+IGJvZHlXaWR0aDtcbiAgICAgICAgaWYgKHByZXZpb3VzU3RhdGUgIT09IHRoaXMuaG9yaXpvbnRhbFNjcm9sbGVkKSB7XG4gICAgICAgICAgdGhpcy5vblVwZGF0ZVNjcm9sbGVkU3RhdGUuZW1pdCh0aGlzLmhvcml6b250YWxTY3JvbGxlZCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2hDb2x1bW5zV2lkdGgoKTtcbiAgICAvLyBpZiAodGhpcy5yZXNpemFibGUpIHtcblxuICAgIC8vIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgZGlhbG9nOiBNYXREaWFsb2csXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnRcbiAgKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGVsUmVmLCBmb3JtKTtcblxuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMgPSBuZXcgRGVmYXVsdE9UYWJsZU9wdGlvbnMoKTtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbigpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGFiR3JvdXBDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRUYWJHcm91cCk7XG4gICAgICB0aGlzLnRhYkNvbnRhaW5lciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdFRhYik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIERvIG5vdGhpbmcgZHVlIHRvIG5vdCBhbHdheXMgaXMgY29udGFpbmVkIG9uIHRhYi5cbiAgICB9XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChTbmFja0JhclNlcnZpY2UpO1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZSA9IG5ldyBPVGFibGVTdG9yYWdlKHRoaXMpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5hZnRlclZpZXdJbml0KCk7XG4gICAgdGhpcy5pbml0VGFibGVBZnRlclZpZXdJbml0KCk7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5tYXRNZW51ID0gdGhpcy5vVGFibGVNZW51Lm1hdE1lbnU7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUucmVnaXN0ZXJPcHRpb25zKHRoaXMudGFibGVPcHRpb25zLnRvQXJyYXkoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9UYWJsZUJ1dHRvbnMpIHtcbiAgICAgIHRoaXMub1RhYmxlQnV0dG9ucy5yZWdpc3RlckJ1dHRvbnModGhpcy50YWJsZUJ1dHRvbnMudG9BcnJheSgpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldFN1ZmZpeENvbHVtbkluc2VydGFibGUoKSB7XG4gICAgcmV0dXJuIENvZGVzLlNVRkZJWF9DT0xVTU5fSU5TRVJUQUJMRTtcbiAgfVxuXG4gIGdldEFjdGlvbnNQZXJtaXNzaW9ucygpOiBPUGVybWlzc2lvbnNbXSB7XG4gICAgcmV0dXJuIHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICB9XG5cbiAgZ2V0TWVudVBlcm1pc3Npb25zKCk6IE9UYWJsZU1lbnVQZXJtaXNzaW9ucyB7XG4gICAgY29uc3QgcmVzdWx0OiBPVGFibGVNZW51UGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zID8gdGhpcy5wZXJtaXNzaW9ucy5tZW51IDogdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQgOiB7XG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiBbXVxuICAgIH07XG4gIH1cblxuICBnZXRPQ29sdW1uUGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wZXJtaXNzaW9ucyA/ICh0aGlzLnBlcm1pc3Npb25zLmNvbHVtbnMgfHwgW10pIDogW107XG4gICAgcmV0dXJuIGNvbHVtbnMuZmluZChjb21wID0+IGNvbXAuYXR0ciA9PT0gYXR0cikgfHwgeyBhdHRyOiBhdHRyLCBlbmFibGVkOiB0cnVlLCB2aXNpYmxlOiB0cnVlIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0QWN0aW9uUGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBjb25zdCBhY3Rpb25zUGVybSA9IHRoaXMucGVybWlzc2lvbnMgPyAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKSA6IFtdO1xuICAgIGNvbnN0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSBhY3Rpb25zUGVybS5maW5kKHAgPT4gcC5hdHRyID09PSBhdHRyKTtcbiAgICByZXR1cm4gcGVybWlzc2lvbnMgfHwge1xuICAgICAgYXR0cjogYXR0cixcbiAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICBlbmFibGVkOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKGF0dHI6IHN0cmluZykge1xuICAgIGNvbnN0IGFjdGlvbnNQZXJtID0gdGhpcy5wZXJtaXNzaW9ucyA/ICh0aGlzLnBlcm1pc3Npb25zLmFjdGlvbnMgfHwgW10pIDogW107XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9IGFjdGlvbnNQZXJtLmZpbmQocCA9PiBwLmF0dHIgPT09IGF0dHIpO1xuICAgIGNvbnN0IGVuYWJsZWRQZXJtaXNpb24gPSBQZXJtaXNzaW9uc1V0aWxzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24ocGVybWlzc2lvbnMpO1xuICAgIGlmICghZW5hYmxlZFBlcm1pc2lvbikge1xuICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuT1BFUkFUSU9OX05PVF9BTExPV0VEX1BFUk1JU1NJT04nKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZWRQZXJtaXNpb247XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHdoYXQgaW5pdGlhbGl6ZSB2YXJzIGFuZCBjb25maWd1cmF0aW9uXG4gICAqL1xuICBpbml0aWFsaXplKCk6IGFueSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucyA9IG5ldyBEZWZhdWx0T1RhYmxlT3B0aW9ucygpO1xuICAgIGlmICh0aGlzLnRhYkdyb3VwQ29udGFpbmVyICYmIHRoaXMudGFiQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyVGFiTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHBhcmFtcyBvZiB0aGUgdGFibGVcbiAgICB0aGlzLmluaXRpYWxpemVQYXJhbXMoKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZURhbygpO1xuXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlLmdldFRhYmxlUGVybWlzc2lvbnModGhpcy5vYXR0ciwgdGhpcy5hY3RSb3V0ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZURhbygpIHtcbiAgICAvLyBDb25maWd1cmUgZGFvIG1ldGhvZHNcbiAgICBjb25zdCBxdWVyeU1ldGhvZE5hbWUgPSB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2Q7XG4gICAgY29uc3QgbWV0aG9kcyA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeU1ldGhvZE5hbWUsXG4gICAgICB1cGRhdGU6IHRoaXMudXBkYXRlTWV0aG9kLFxuICAgICAgZGVsZXRlOiB0aGlzLmRlbGV0ZU1ldGhvZCxcbiAgICAgIGluc2VydDogdGhpcy5pbnNlcnRNZXRob2RcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSkge1xuICAgICAgdGhpcy5xdWVyeU9uQmluZCA9IGZhbHNlO1xuICAgICAgdGhpcy5xdWVyeU9uSW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5kYW9UYWJsZSA9IG5ldyBPVGFibGVEYW8odW5kZWZpbmVkLCB0aGlzLmVudGl0eSwgbWV0aG9kcyk7XG4gICAgICB0aGlzLnNldERhdGFBcnJheSh0aGlzLnN0YXRpY0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZVNlcnZpY2UoKTtcbiAgICAgIHRoaXMuZGFvVGFibGUgPSBuZXcgT1RhYmxlRGFvKHRoaXMuZGF0YVNlcnZpY2UsIHRoaXMuZW50aXR5LCBtZXRob2RzKTtcbiAgICB9XG4gIH1cblxuICByZWluaXRpYWxpemUob3B0aW9uczogT1RhYmxlSW5pdGlhbGl6YXRpb25PcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGNsb25lZE9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdlbnRpdHknKSkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IGNsb25lZE9wdHMuZW50aXR5O1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ3NlcnZpY2UnKSkge1xuICAgICAgICB0aGlzLnNlcnZpY2UgPSBjbG9uZWRPcHRzLnNlcnZpY2U7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnY29sdW1ucycpKSB7XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IGNsb25lZE9wdHMuY29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCd2aXNpYmxlQ29sdW1ucycpKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZUNvbHVtbnMgPSBjbG9uZWRPcHRzLnZpc2libGVDb2x1bW5zO1xuICAgICAgfVxuICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkoJ2tleXMnKSkge1xuICAgICAgICB0aGlzLmtleXMgPSBjbG9uZWRPcHRzLmtleXM7XG4gICAgICB9XG4gICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eSgnc29ydENvbHVtbnMnKSkge1xuICAgICAgICB0aGlzLnNvcnRDb2x1bW5zID0gY2xvbmVkT3B0cy5zb3J0Q29sdW1ucztcbiAgICAgIH1cbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdwYXJlbnRLZXlzJykpIHtcbiAgICAgICAgdGhpcy5wYXJlbnRLZXlzID0gY2xvbmVkT3B0cy5wYXJlbnRLZXlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZS5yZXNldCgpO1xuICAgIHRoaXMuaW5pdFRhYmxlQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMub25SZWluaXRpYWxpemUuZW1pdChudWxsKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0VGFibGVBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMucGFyc2VWaXNpYmxlQ29sdW1ucygpO1xuICAgIHRoaXMuc2V0RGF0YXNvdXJjZSgpO1xuICAgIHRoaXMucmVnaXN0ZXJEYXRhU291cmNlTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5wYXJzZVNvcnRDb2x1bW5zKCk7XG4gICAgdGhpcy5yZWdpc3RlclNvcnRMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2V0RmlsdGVyc0NvbmZpZ3VyYXRpb24odGhpcy5zdGF0ZSk7XG4gICAgdGhpcy5hZGREZWZhdWx0Um93QnV0dG9ucygpO1xuXG4gICAgaWYgKHRoaXMucXVlcnlPbkluaXQpIHtcbiAgICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNvcnRTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc29ydFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vblJlbmRlcmVkRGF0YUNoYW5nZSkge1xuICAgICAgdGhpcy5vblJlbmRlcmVkRGF0YUNoYW5nZS51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9ucykuZm9yRWFjaChpZHggPT4ge1xuICAgICAgaWYgKHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tpZHhdKSB7XG4gICAgICAgIHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tpZHhdLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHVwZGF0ZSBzdG9yZSBsb2NhbHN0b3JhZ2UsIGNhbGwgb2YgdGhlIElMb2NhbFN0b3JhZ2VcbiAgICovXG4gIGdldERhdGFUb1N0b3JlKCkge1xuICAgIHJldHVybiB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0RGF0YVRvU3RvcmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyUXVpY2tGaWx0ZXIoYXJnOiBhbnkpIHtcbiAgICBjb25zdCBxdWlja0ZpbHRlciA9IChhcmcgYXMgT1RhYmxlUXVpY2tmaWx0ZXIpO1xuICAgIC8vIGZvcmNpbmcgcXVpY2tGaWx0ZXJDb21wb25lbnQgdG8gYmUgdW5kZWZpbmVkLCB0YWJsZSB1c2VzIG9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50XG4gICAgdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50ID0gcXVpY2tGaWx0ZXI7XG4gICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5zZXRWYWx1ZSh0aGlzLnN0YXRlLmZpbHRlciwgZmFsc2UpO1xuICB9XG5cbiAgcmVnaXN0ZXJQYWdpbmF0aW9uKHZhbHVlOiBPVGFibGVQYWdpbmF0b3IpIHtcbiAgICB0aGlzLnBhZ2luYXRpb25Db250cm9scyA9IHRydWU7XG4gICAgdGhpcy5wYWdpbmF0b3IgPSB2YWx1ZTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29udGV4dE1lbnUodmFsdWU6IE9Db250ZXh0TWVudUNvbXBvbmVudCk6IHZvaWQge1xuICAgIHRoaXMudGFibGVDb250ZXh0TWVudSA9IHZhbHVlO1xuICAgIHRoaXMuY29udGV4dE1lbnVTdWJzY3JpcHRpb24gPSB0aGlzLnRhYmxlQ29udGV4dE1lbnUub25TaG93LnN1YnNjcmliZSgocGFyYW1zOiBJT0NvbnRleHRNZW51Q29udGV4dCkgPT4ge1xuICAgICAgcGFyYW1zLmNsYXNzID0gJ28tdGFibGUtY29udGV4dC1tZW51ICcgKyB0aGlzLnJvd0hlaWdodDtcbiAgICAgIGlmIChwYXJhbXMuZGF0YSAmJiAhdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChwYXJhbXMuZGF0YS5yb3dWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkUm93KHBhcmFtcy5kYXRhLnJvd1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyRGVmYXVsdENvbHVtbihjb2x1bW46IHN0cmluZykge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLmdldE9Db2x1bW4oY29sdW1uKSkpIHtcbiAgICAgIC8vIGEgZGVmYXVsdCBjb2x1bW4gZGVmaW5pdGlvbiB0cnlpbmcgdG8gcmVwbGFjZSBhbiBhbHJlYWR5IGV4aXN0aW5nIGRlZmluaXRpb25cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29sRGVmOiBPQ29sdW1uID0gdGhpcy5jcmVhdGVPQ29sdW1uKGNvbHVtbiwgdGhpcyk7XG4gICAgdGhpcy5wdXNoT0NvbHVtbkRlZmluaXRpb24oY29sRGVmKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSBhbGwgY29sdW1ucyBhbmQgcHJvcGVydGllcyBpbiB2YXIgY29sdW1uc0FycmF5XG4gICAqIEBwYXJhbSBjb2x1bW5cbiAgICovXG4gIHJlZ2lzdGVyQ29sdW1uKGNvbHVtbjogT1RhYmxlQ29sdW1uQ29tcG9uZW50IHwgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCB8IGFueSkge1xuICAgIGNvbnN0IGNvbHVtbkF0dHIgPSAodHlwZW9mIGNvbHVtbiA9PT0gJ3N0cmluZycpID8gY29sdW1uIDogY29sdW1uLmF0dHI7XG4gICAgY29uc3QgY29sdW1uUGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0T0NvbHVtblBlcm1pc3Npb25zKGNvbHVtbkF0dHIpO1xuICAgIGlmICghY29sdW1uUGVybWlzc2lvbnMudmlzaWJsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29sdW1uID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5yZWdpc3RlckRlZmF1bHRDb2x1bW4oY29sdW1uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb2x1bW5EZWYgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uLmF0dHIpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW5EZWYpICYmIFV0aWwuaXNEZWZpbmVkKGNvbHVtbkRlZi5kZWZpbml0aW9uKSkge1xuICAgICAgLy8gYSBvLXRhYmxlLWNvbHVtbiBkZWZpbml0aW9uIHRyeWluZyB0byByZXBsYWNlIGFuIGFscmVhZHkgZXhpc3Rpbmcgby10YWJsZS1jb2x1bW4gZGVmaW5pdGlvblxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2xEZWY6IE9Db2x1bW4gPSB0aGlzLmNyZWF0ZU9Db2x1bW4oY29sdW1uLmF0dHIsIHRoaXMsIGNvbHVtbik7XG4gICAgbGV0IGNvbHVtbldpZHRoID0gY29sdW1uLndpZHRoO1xuICAgIGNvbnN0IHN0b3JlZENvbHMgPSB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J107XG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoc3RvcmVkQ29scykpIHtcbiAgICAgIGNvbnN0IHN0b3JlZERhdGEgPSBzdG9yZWRDb2xzLmZpbmQob0NvbCA9PiBvQ29sLmF0dHIgPT09IGNvbERlZi5hdHRyKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChzdG9yZWREYXRhKSAmJiBVdGlsLmlzRGVmaW5lZChzdG9yZWREYXRhLndpZHRoKSkge1xuICAgICAgICAvLyBjaGVjayB0aGF0IHRoZSB3aWR0aCBvZiB0aGUgY29sdW1ucyBzYXZlZCBpbiB0aGUgaW5pdGlhbCBjb25maWd1cmF0aW9uXG4gICAgICAgIC8vIGluIHRoZSBsb2NhbCBzdG9yYWdlIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbCB2YWx1ZVxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ29Db2x1bW5zLWRpc3BsYXknKSkge1xuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFN0b3JlZENvbHMgPSB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnb0NvbHVtbnMtZGlzcGxheSddO1xuICAgICAgICAgICAgaW5pdGlhbFN0b3JlZENvbHMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGNvbERlZi5hdHRyID09PSBlbGVtZW50LmF0dHIgJiYgZWxlbWVudC53aWR0aCA9PT0gY29sRGVmLmRlZmluaXRpb24ub3JpZ2luYWxXaWR0aCkge1xuICAgICAgICAgICAgICAgIGNvbHVtbldpZHRoID0gc3RvcmVkRGF0YS53aWR0aDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbHVtbldpZHRoID0gc3RvcmVkRGF0YS53aWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbldpZHRoKSkge1xuICAgICAgY29sRGVmLndpZHRoID0gY29sdW1uV2lkdGg7XG4gICAgfVxuICAgIGlmIChjb2x1bW4gJiYgKGNvbHVtbi5hc3luY0xvYWQgfHwgY29sdW1uLnR5cGUgPT09ICdhY3Rpb24nKSkge1xuICAgICAgdGhpcy5hdm9pZFF1ZXJ5Q29sdW1ucy5wdXNoKGNvbHVtbi5hdHRyKTtcbiAgICAgIGlmIChjb2x1bW4uYXN5bmNMb2FkKSB7XG4gICAgICAgIHRoaXMuYXN5bmNMb2FkQ29sdW1ucy5wdXNoKGNvbHVtbi5hdHRyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wdXNoT0NvbHVtbkRlZmluaXRpb24oY29sRGVmKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwdXNoT0NvbHVtbkRlZmluaXRpb24oY29sRGVmOiBPQ29sdW1uKSB7XG4gICAgY29sRGVmLnZpc2libGUgPSAodGhpcy5fdmlzaWJsZUNvbEFycmF5LmluZGV4T2YoY29sRGVmLmF0dHIpICE9PSAtMSk7XG4gICAgLy8gRmluZCBjb2x1bW4gZGVmaW5pdGlvbiBieSBuYW1lXG4gICAgY29uc3QgYWxyZWFkeUV4aXN0aW5nID0gdGhpcy5nZXRPQ29sdW1uKGNvbERlZi5hdHRyKTtcbiAgICBpZiAoYWxyZWFkeUV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHJlcGxhY2luZ0luZGV4ID0gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmluZGV4T2YoYWxyZWFkeUV4aXN0aW5nKTtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1uc1tyZXBsYWNpbmdJbmRleF0gPSBjb2xEZWY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5wdXNoKGNvbERlZik7XG4gICAgfVxuICAgIHRoaXMucmVmcmVzaEVkaXRpb25Nb2RlV2FybigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hFZGl0aW9uTW9kZVdhcm4oKSB7XG4gICAgaWYgKHRoaXMuZWRpdGlvbk1vZGUgIT09IENvZGVzLkRFVEFJTF9NT0RFX05PTkUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZWRpdGFibGVDb2x1bW5zID0gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihjb2wgPT4ge1xuICAgICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKGNvbC5lZGl0b3IpO1xuICAgIH0pO1xuICAgIGlmIChlZGl0YWJsZUNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdVc2luZyBhIGNvbHVtbiB3aXRoIGEgZWRpdG9yIGJ1dCB0aGVyZSBpcyBubyBlZGl0aW9uLW1vZGUgZGVmaW5lZCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyQ29sdW1uQWdncmVnYXRlKGNvbHVtbjogT0NvbHVtbkFnZ3JlZ2F0ZSkge1xuICAgIHRoaXMuc2hvd1RvdGFsc1N1YmplY3QubmV4dCh0cnVlKTtcbiAgICBjb25zdCBhbHJlYWR5RXhpc3RpbmcgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uLmF0dHIpO1xuICAgIGlmIChhbHJlYWR5RXhpc3RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcmVwbGFjaW5nSW5kZXggPSB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuaW5kZXhPZihhbHJlYWR5RXhpc3RpbmcpO1xuICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zW3JlcGxhY2luZ0luZGV4XS5hZ2dyZWdhdGUgPSBjb2x1bW47XG4gICAgfVxuICB9XG5cbiAgcGFyc2VWaXNpYmxlQ29sdW1ucygpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnb0NvbHVtbnMtZGlzcGxheScpKSB7XG4gICAgICAvLyBmaWx0ZXJpbmcgY29sdW1ucyB0aGF0IG1pZ2h0IGJlIGluIHN0YXRlIHN0b3JhZ2UgYnV0IG5vdCBpbiB0aGUgYWN0dWFsIHRhYmxlIGRlZmluaXRpb25cbiAgICAgIGxldCBzdGF0ZUNvbHMgPSBbXTtcbiAgICAgIHRoaXMuc3RhdGVbJ29Db2x1bW5zLWRpc3BsYXknXS5mb3JFYWNoKChvQ29sLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpc1Zpc2libGVDb2xJbkNvbHVtbnMgPSB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmluZChjb2wgPT4gY29sLmF0dHIgPT09IG9Db2wuYXR0cikgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGlzVmlzaWJsZUNvbEluQ29sdW1ucykge1xuICAgICAgICAgIHN0YXRlQ29scy5wdXNoKG9Db2wpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybignVW5hYmxlIHRvIGxvYWQgdGhlIGNvbHVtbiAnICsgb0NvbC5hdHRyICsgJyBmcm9tIHRoZSBsb2NhbHN0b3JhZ2UnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzdGF0ZUNvbHMgPSB0aGlzLmNoZWNrQ2hhbmdlc1Zpc2libGVDb2x1bW1uc0luSW5pdGlhbENvbmZpZ3VyYXRpb24oc3RhdGVDb2xzKTtcbiAgICAgIHRoaXMudmlzaWJsZUNvbEFycmF5ID0gc3RhdGVDb2xzLmZpbHRlcihpdGVtID0+IGl0ZW0udmlzaWJsZSkubWFwKGl0ZW0gPT4gaXRlbS5hdHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aXNpYmxlQ29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy52aXNpYmxlQ29sdW1ucywgdHJ1ZSk7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihhLmF0dHIpIC0gdGhpcy52aXNpYmxlQ29sQXJyYXkuaW5kZXhPZihiLmF0dHIpKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0NoYW5nZXNWaXNpYmxlQ29sdW1tbnNJbkluaXRpYWxDb25maWd1cmF0aW9uKHN0YXRlQ29scykge1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdvQ29sdW1ucy1kaXNwbGF5JykpIHtcblxuICAgICAgICBjb25zdCBvcmlnaW5hbFZpc2libGVDb2xBcnJheSA9IHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydvQ29sdW1ucy1kaXNwbGF5J10ubWFwKHggPT4ge1xuICAgICAgICAgIGlmICh4LnZpc2libGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB4LmF0dHI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgdmlzaWJsZUNvbEFycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMudmlzaWJsZUNvbHVtbnMsIHRydWUpO1xuXG4gICAgICAgIC8vIEZpbmQgdmFsdWVzIGluIHZpc2libGUtY29sdW1ucyB0aGF0IHRoZXkgYXJlbnQgaW4gb3JpZ2luYWwtdmlzaWJsZS1jb2x1bW5zIGluIGxvY2Fsc3RvcmFnZVxuICAgICAgICAvLyBpbiB0aGlzIGNhc2UgeW91IGhhdmUgdG8gYWRkIHRoaXMgY29sdW1uIHRvIHRoaXMudmlzaWJsZUNvbEFycmF5XG4gICAgICAgIGNvbnN0IGNvbFRvQWRkSW5WaXNpYmxlQ29sID0gVXRpbC5kaWZmZXJlbmNlQXJyYXlzKHZpc2libGVDb2xBcnJheSwgb3JpZ2luYWxWaXNpYmxlQ29sQXJyYXkpO1xuICAgICAgICBpZiAoY29sVG9BZGRJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbFRvQWRkSW5WaXNpYmxlQ29sLmZvckVhY2goKGNvbEFkZCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmIChzdGF0ZUNvbHMuZmlsdGVyKGNvbCA9PiBjb2wuYXR0ciA9PT0gY29sQWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHN0YXRlQ29scyA9IHN0YXRlQ29scy5tYXAoY29sID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY29sVG9BZGRJblZpc2libGVDb2wuaW5kZXhPZihjb2wuYXR0cikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgY29sLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gY29sO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY29sQXJyYXkuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09PSBjb2xBZGQpIHtcbiAgICAgICAgICAgICAgICAgIHN0YXRlQ29scy5zcGxpY2UoaSArIDEsIDAsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyOiBjb2xBZGQsXG4gICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgdmFsdWVzIGluIG9yaWdpbmFsLXZpc2libGUtY29sdW1ucyBpbiBsb2NhbHN0b3JhZ2UgdGhhdCB0aGV5IGFyZW50IGluIHRoaXMudmlzaWJsZUNvbEFycmF5XG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSB5b3UgaGF2ZSB0byBkZWxldGUgdGhpcyBjb2x1bW4gdG8gdGhpcy52aXNpYmxlQ29sQXJyYXlcbiAgICAgICAgY29uc3QgY29sVG9EZWxldGVJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXMob3JpZ2luYWxWaXNpYmxlQ29sQXJyYXksIHZpc2libGVDb2xBcnJheSk7XG4gICAgICAgIGlmIChjb2xUb0RlbGV0ZUluVmlzaWJsZUNvbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc3RhdGVDb2xzID0gc3RhdGVDb2xzLm1hcChjb2wgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbFRvRGVsZXRlSW5WaXNpYmxlQ29sLmluZGV4T2YoY29sLmF0dHIpID4gLTEpIHtcbiAgICAgICAgICAgICAgY29sLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb2w7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlQ29scztcbiAgfVxuXG4gIHBhcnNlU29ydENvbHVtbnMoKSB7XG4gICAgY29uc3Qgc29ydENvbHVtbnNQYXJhbSA9IHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddIHx8IHRoaXMuc29ydENvbHVtbnM7XG4gICAgdGhpcy5zb3J0Q29sQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyhzb3J0Q29sdW1uc1BhcmFtKTtcblxuICAgIC8vIGNoZWNraW5nIHRoZSBvcmlnaW5hbCBzb3J0IGNvbHVtbnMgd2l0aCB0aGUgc29ydCBjb2x1bW5zIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpbiBsb2NhbCBzdG9yYWdlXG4gICAgaWYgKHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddICYmIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydzb3J0LWNvbHVtbnMnXSkge1xuXG4gICAgICBjb25zdCBpbml0aWFsQ29uZmlnU29ydENvbHVtbnNBcnJheSA9IFNlcnZpY2VVdGlscy5wYXJzZVNvcnRDb2x1bW5zKHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydzb3J0LWNvbHVtbnMnXSk7XG4gICAgICBjb25zdCBvcmlnaW5hbFNvcnRDb2x1bW5zQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyh0aGlzLnNvcnRDb2x1bW5zKTtcbiAgICAgIC8vIEZpbmQgdmFsdWVzIGluIHZpc2libGUtY29sdW1ucyB0aGF0IHRoZXkgYXJlbnQgaW4gb3JpZ2luYWwtdmlzaWJsZS1jb2x1bW5zIGluIGxvY2Fsc3RvcmFnZVxuICAgICAgLy8gaW4gdGhpcyBjYXNlIHlvdSBoYXZlIHRvIGFkZCB0aGlzIGNvbHVtbiB0byB0aGlzLnZpc2libGVDb2xBcnJheVxuICAgICAgY29uc3QgY29sVG9BZGRJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXMob3JpZ2luYWxTb3J0Q29sdW1uc0FycmF5LCBpbml0aWFsQ29uZmlnU29ydENvbHVtbnNBcnJheSk7XG4gICAgICBpZiAoY29sVG9BZGRJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICBjb2xUb0FkZEluVmlzaWJsZUNvbC5mb3JFYWNoKGNvbEFkZCA9PiB7XG4gICAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkucHVzaChjb2xBZGQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sVG9EZWxJblZpc2libGVDb2wgPSBVdGlsLmRpZmZlcmVuY2VBcnJheXMoaW5pdGlhbENvbmZpZ1NvcnRDb2x1bW5zQXJyYXksIG9yaWdpbmFsU29ydENvbHVtbnNBcnJheSk7XG4gICAgICBpZiAoY29sVG9EZWxJblZpc2libGVDb2wubGVuZ3RoID4gMCkge1xuICAgICAgICBjb2xUb0RlbEluVmlzaWJsZUNvbC5mb3JFYWNoKChjb2xEZWwpID0+IHtcbiAgICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5mb3JFYWNoKChjb2wsIGkpID0+IHtcbiAgICAgICAgICAgIGlmIChjb2wuY29sdW1uTmFtZSA9PT0gY29sRGVsLmNvbHVtbk5hbWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zb3J0Q29sQXJyYXkuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBlbnN1cmluZyBjb2x1bW4gZXhpc3RlbmNlIGFuZCBjaGVja2luZyBpdHMgb3JkZXJhYmxlIHN0YXRlXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuc29ydENvbEFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBjb25zdCBjb2xOYW1lID0gdGhpcy5zb3J0Q29sQXJyYXlbaV0uY29sdW1uTmFtZTtcbiAgICAgIGNvbnN0IG9Db2wgPSB0aGlzLmdldE9Db2x1bW4oY29sTmFtZSk7XG4gICAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKG9Db2wpIHx8ICFvQ29sLm9yZGVyYWJsZSkge1xuICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZVBhcmFtcygpOiB2b2lkIHtcbiAgICAvLyBJZiB2aXNpYmxlLWNvbHVtbnMgaXMgbm90IHByZXNlbnQgdGhlbiB2aXNpYmxlLWNvbHVtbnMgaXMgYWxsIGNvbHVtbnNcbiAgICBpZiAoIXRoaXMudmlzaWJsZUNvbHVtbnMpIHtcbiAgICAgIHRoaXMudmlzaWJsZUNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sQXJyYXkubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNvbEFycmF5LmZvckVhY2goKHg6IHN0cmluZykgPT4gdGhpcy5yZWdpc3RlckNvbHVtbih4KSk7XG5cbiAgICAgIGxldCBjb2x1bW5zT3JkZXIgPSBbXTtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdvQ29sdW1ucy1kaXNwbGF5JykpIHtcbiAgICAgICAgY29sdW1uc09yZGVyID0gdGhpcy5zdGF0ZVsnb0NvbHVtbnMtZGlzcGxheSddLm1hcChpdGVtID0+IGl0ZW0uYXR0cik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW5zT3JkZXIgPSB0aGlzLmNvbEFycmF5LmZpbHRlcihhdHRyID0+IHRoaXMudmlzaWJsZUNvbEFycmF5LmluZGV4T2YoYXR0cikgPT09IC0xKTtcbiAgICAgICAgY29sdW1uc09yZGVyLnB1c2goLi4udGhpcy52aXNpYmxlQ29sQXJyYXkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuc29ydCgoYTogT0NvbHVtbiwgYjogT0NvbHVtbikgPT4ge1xuICAgICAgICBpZiAoY29sdW1uc09yZGVyLmluZGV4T2YoYS5hdHRyKSA9PT0gLTEpIHtcbiAgICAgICAgICAvLyBpZiBpdCBpcyBub3QgaW4gbG9jYWwgc3RvcmFnZSBiZWNhdXNlIGl0IGlzIG5ldywga2VlcCBvcmRlclxuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBjb2x1bW5zT3JkZXIuaW5kZXhPZihhLmF0dHIpIC0gY29sdW1uc09yZGVyLmluZGV4T2YoYi5hdHRyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvLyBJbml0aWFsaXplIHF1aWNrRmlsdGVyXG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5maWx0ZXIgPSB0aGlzLnF1aWNrRmlsdGVyO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2N1cnJlbnRQYWdlJykpIHtcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlO1xuICAgIH1cblxuICAgIC8vIEluaXRpYWxpemUgcGFnaW5hdG9yXG4gICAgaWYgKCF0aGlzLnBhZ2luYXRvciAmJiB0aGlzLnBhZ2luYXRpb25Db250cm9scykge1xuICAgICAgdGhpcy5wYWdpbmF0b3IgPSBuZXcgT0Jhc2VUYWJsZVBhZ2luYXRvcigpO1xuICAgICAgdGhpcy5wYWdpbmF0b3IucGFnZVNpemUgPSB0aGlzLnF1ZXJ5Um93cztcbiAgICAgIHRoaXMucGFnaW5hdG9yLnBhZ2VJbmRleCA9IHRoaXMuY3VycmVudFBhZ2U7XG4gICAgICB0aGlzLnBhZ2luYXRvci5zaG93Rmlyc3RMYXN0QnV0dG9ucyA9IHRoaXMuc2hvd1BhZ2luYXRvckZpcnN0TGFzdEJ1dHRvbnM7XG4gICAgfVxuXG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnNlbGVjdEFsbENoZWNrYm94VmlzaWJsZSkpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUgPSAhIXRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjaGVja2luZyB0aGUgb3JpZ2luYWwgc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlIHdpdGggc2VsZWN0LWNvbHVtbi12aXNpYmxlIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykgJiYgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZScpXG4gICAgICAgICYmIHRoaXMuc2VsZWN0QWxsQ2hlY2tib3hWaXNpYmxlID09PSB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ10pIHtcbiAgICAgICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSA9ICEhdGhpcy5zdGF0ZVsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gdGhpcy5zZWxlY3RBbGxDaGVja2JveFZpc2libGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsaXplQ2hlY2tib3hDb2x1bW4oKTtcbiAgfVxuXG4gIHJlZ2lzdGVyVGFiTGlzdGVuZXIoKSB7XG4gICAgLy8gV2hlbiB0YWJsZSBpcyBjb250YWluZWQgaW50byB0YWIgY29tcG9uZW50LCBpdCBpcyBuZWNlc3NhcnkgdG8gaW5pdCB0YWJsZSBjb21wb25lbnQgd2hlbiBhdHRhY2hlZCB0byBET00uXG4gICAgdGhpcy50YWJHcm91cENoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMudGFiR3JvdXBDb250YWluZXIuc2VsZWN0ZWRUYWJDaGFuZ2Uuc3Vic2NyaWJlKChldnQpID0+IHtcbiAgICAgIGxldCBpbnRlcnZhbDtcbiAgICAgIGNvbnN0IHRpbWVyQ2FsbGJhY2sgPSAodGFiOiBNYXRUYWIpID0+IHtcbiAgICAgICAgaWYgKHRhYiAmJiB0YWIuY29udGVudC5pc0F0dGFjaGVkKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgaWYgKHRhYiA9PT0gdGhpcy50YWJDb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuaW5zaWRlVGFiQnVnV29ya2Fyb3VuZCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucGVuZGluZ1F1ZXJ5KSB7XG4gICAgICAgICAgICAgIHRoaXMucXVlcnlEYXRhKHRoaXMucGVuZGluZ1F1ZXJ5RmlsdGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHsgdGltZXJDYWxsYmFjayhldnQudGFiKTsgfSwgMTAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbnNpZGVUYWJCdWdXb3JrYXJvdW5kKCkge1xuICAgIHRoaXMuc29ydEhlYWRlcnMuZm9yRWFjaChzb3J0SCA9PiB7XG4gICAgICBzb3J0SC5yZWZyZXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3RlclNvcnRMaXN0ZW5lcigpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5zb3J0KSkge1xuICAgICAgdGhpcy5zb3J0U3Vic2NyaXB0aW9uID0gdGhpcy5zb3J0Lm9Tb3J0Q2hhbmdlLnN1YnNjcmliZSh0aGlzLm9uU29ydENoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuc29ydC5zZXRNdWx0aXBsZVNvcnQodGhpcy5tdWx0aXBsZVNvcnQpO1xuXG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zKSAmJiAodGhpcy5zb3J0Q29sQXJyYXkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgdGhpcy5zb3J0LnNldFRhYmxlSW5mbyh0aGlzLnNvcnRDb2xBcnJheSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG9uU29ydENoYW5nZShzb3J0QXJyYXk6IGFueVtdKSB7XG4gICAgdGhpcy5zb3J0Q29sQXJyYXkgPSBbXTtcbiAgICBzb3J0QXJyYXkuZm9yRWFjaCgoc29ydCkgPT4ge1xuICAgICAgaWYgKHNvcnQuZGlyZWN0aW9uICE9PSAnJykge1xuICAgICAgICB0aGlzLnNvcnRDb2xBcnJheS5wdXNoKHtcbiAgICAgICAgICBjb2x1bW5OYW1lOiBzb3J0LmlkLFxuICAgICAgICAgIGFzY2VuZGVudDogc29ydC5kaXJlY3Rpb24gPT09IENvZGVzLkFTQ19TT1JUXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2FkaW5nU29ydGluZ1N1YmplY3QubmV4dCh0cnVlKTtcbiAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGFzb3VyY2UoKSB7XG4gICAgY29uc3QgZGF0YVNvdXJjZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVGFibGVEYXRhU291cmNlU2VydmljZSk7XG4gICAgdGhpcy5kYXRhU291cmNlID0gZGF0YVNvdXJjZVNlcnZpY2UuZ2V0SW5zdGFuY2UodGhpcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJEYXRhU291cmNlTGlzdGVuZXJzKCkge1xuICAgIGlmICghdGhpcy5wYWdlYWJsZSkge1xuICAgICAgdGhpcy5vblJlbmRlcmVkRGF0YUNoYW5nZSA9IHRoaXMuZGF0YVNvdXJjZS5vblJlbmRlcmVkRGF0YUNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvYWRpbmdTb3J0aW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICAgICAgICBpZiAodGhpcy5jZCAmJiAhKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2hvd0xvYWRpbmcoKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMubG9hZGluZywgdGhpcy5sb2FkaW5nU29ydGluZywgdGhpcy5sb2FkaW5nU2Nyb2xsXSlcbiAgICAgIC5waXBlKG1hcCgocmVzOiBhbnlbXSkgPT4gKHJlc1swXSB8fCByZXNbMV0gfHwgcmVzWzJdKSkpO1xuICB9XG5cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgbWFuYWdlcyB0aGUgY2FsbCB0byB0aGUgc2VydmljZVxuICAgKiBAcGFyYW0gZmlsdGVyXG4gICAqIEBwYXJhbSBvdnJyQXJnc1xuICAgKi9cbiAgcXVlcnlEYXRhKGZpbHRlcj86IGFueSwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncykge1xuICAgIC8vIElmIHRhYiBleGlzdHMgYW5kIGlzIG5vdCBhY3RpdmUgdGhlbiB3YWl0IGZvciBxdWVyeURhdGFcbiAgICBpZiAodGhpcy5pc0luc2lkZUluYWN0aXZlVGFiKCkpIHtcbiAgICAgIHRoaXMucGVuZGluZ1F1ZXJ5ID0gdHJ1ZTtcbiAgICAgIHRoaXMucGVuZGluZ1F1ZXJ5RmlsdGVyID0gZmlsdGVyO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBlbmRpbmdRdWVyeSA9IGZhbHNlO1xuICAgIHRoaXMucGVuZGluZ1F1ZXJ5RmlsdGVyID0gdW5kZWZpbmVkO1xuICAgIHN1cGVyLnF1ZXJ5RGF0YShmaWx0ZXIsIG92cnJBcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc0luc2lkZUluYWN0aXZlVGFiKCk6IGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBpZiAodGhpcy50YWJDb250YWluZXIgJiYgdGhpcy50YWJHcm91cENvbnRhaW5lcikge1xuICAgICAgcmVzdWx0ID0gISh0aGlzLnRhYkNvbnRhaW5lci5pc0FjdGl2ZSB8fCAodGhpcy50YWJHcm91cENvbnRhaW5lci5zZWxlY3RlZEluZGV4ID09PSB0aGlzLnRhYkNvbnRhaW5lci5wb3NpdGlvbikpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50RmlsdGVyKGV4aXN0aW5nRmlsdGVyOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgbGV0IGZpbHRlciA9IGV4aXN0aW5nRmlsdGVyO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoZmlsdGVyKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudEl0ZW1FeHByID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkZyb21PYmplY3QoZmlsdGVyKTtcbiAgICAgICAgZmlsdGVyID0ge307XG4gICAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSA9IHBhcmVudEl0ZW1FeHByO1xuICAgICAgfVxuICAgICAgY29uc3QgYmVDb2xGaWx0ZXIgPSB0aGlzLmdldENvbHVtbkZpbHRlcnNFeHByZXNzaW9uKCk7XG4gICAgICAvLyBBZGQgY29sdW1uIGZpbHRlcnMgYmFzaWMgZXhwcmVzc2lvbiB0byBjdXJyZW50IGZpbHRlclxuICAgICAgaWYgKGJlQ29sRmlsdGVyICYmICFVdGlsLmlzRGVmaW5lZChmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0pKSB7XG4gICAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSA9IGJlQ29sRmlsdGVyO1xuICAgICAgfSBlbHNlIGlmIChiZUNvbEZpbHRlcikge1xuICAgICAgICBmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkZJTFRFUl9FWFBSRVNTSU9OX0tFWV0gPVxuICAgICAgICAgIEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuRklMVEVSX0VYUFJFU1NJT05fS0VZXSwgYmVDb2xGaWx0ZXIsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9BTkQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuZ2V0Q29tcG9uZW50RmlsdGVyKGZpbHRlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0UXVpY2tGaWx0ZXJFeHByZXNzaW9uKCk6IEV4cHJlc3Npb24ge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50KSAmJiB0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5maWx0ZXJFeHByZXNzaW9uO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENvbHVtbkZpbHRlcnNFeHByZXNzaW9uKCk6IEV4cHJlc3Npb24ge1xuICAgIC8vIEFwcGx5IGNvbHVtbiBmaWx0ZXJzXG4gICAgY29uc3QgY29sdW1uRmlsdGVyczogT0NvbHVtblZhbHVlRmlsdGVyW10gPSB0aGlzLmRhdGFTb3VyY2UuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJzKCk7XG4gICAgY29uc3QgYmVDb2x1bW5GaWx0ZXJzOiBBcnJheTxFeHByZXNzaW9uPiA9IFtdO1xuICAgIGNvbHVtbkZpbHRlcnMuZm9yRWFjaChjb2xGaWx0ZXIgPT4ge1xuICAgICAgLy8gUHJlcGFyZSBiYXNpYyBleHByZXNzaW9uc1xuICAgICAgc3dpdGNoIChjb2xGaWx0ZXIub3BlcmF0b3IpIHtcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOOlxuICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkoY29sRmlsdGVyLnZhbHVlcykpIHtcbiAgICAgICAgICAgIGNvbnN0IGJlc0luOiBBcnJheTxFeHByZXNzaW9uPiA9IGNvbEZpbHRlci52YWx1ZXMubWFwKHZhbHVlID0+IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25FcXVhbHMoY29sRmlsdGVyLmF0dHIsIHZhbHVlKSk7XG4gICAgICAgICAgICBsZXQgYmVJbjogRXhwcmVzc2lvbiA9IGJlc0luLnBvcCgpO1xuICAgICAgICAgICAgYmVzSW4uZm9yRWFjaChiZSA9PiB7XG4gICAgICAgICAgICAgIGJlSW4gPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihiZUluLCBiZSwgRmlsdGVyRXhwcmVzc2lvblV0aWxzLk9QX09SKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goYmVJbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTjpcbiAgICAgICAgICBpZiAoVXRpbC5pc0FycmF5KGNvbEZpbHRlci52YWx1ZXMpICYmIGNvbEZpbHRlci52YWx1ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBsZXQgYmVGcm9tID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbk1vcmVFcXVhbChjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlc1swXSk7XG4gICAgICAgICAgICBsZXQgYmVUbyA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25MZXNzRXF1YWwoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXNbMV0pO1xuICAgICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oYmVGcm9tLCBiZVRvLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuRVFVQUw6XG4gICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkxpa2UoY29sRmlsdGVyLmF0dHIsIGNvbEZpbHRlci52YWx1ZXMpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkxFU1NfRVFVQUw6XG4gICAgICAgICAgYmVDb2x1bW5GaWx0ZXJzLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkxlc3NFcXVhbChjb2xGaWx0ZXIuYXR0ciwgY29sRmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTDpcbiAgICAgICAgICBiZUNvbHVtbkZpbHRlcnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTW9yZUVxdWFsKGNvbEZpbHRlci5hdHRyLCBjb2xGaWx0ZXIudmFsdWVzKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICAvLyBCdWlsZCBjb21wbGV0ZSBjb2x1bW4gZmlsdGVycyBiYXNpYyBleHByZXNzaW9uXG4gICAgbGV0IGJlQ29sRmlsdGVyOiBFeHByZXNzaW9uID0gYmVDb2x1bW5GaWx0ZXJzLnBvcCgpO1xuICAgIGJlQ29sdW1uRmlsdGVycy5mb3JFYWNoKGJlID0+IHtcbiAgICAgIGJlQ29sRmlsdGVyID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oYmVDb2xGaWx0ZXIsIGJlLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKTtcbiAgICB9KTtcbiAgICByZXR1cm4gYmVDb2xGaWx0ZXI7XG4gIH1cblxuICB1cGRhdGVQYWdpbmF0aW9uSW5mbyhxdWVyeVJlczogYW55KSB7XG4gICAgc3VwZXIudXBkYXRlUGFnaW5hdGlvbkluZm8ocXVlcnlSZXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldERhdGEoZGF0YTogYW55LCBzcWxUeXBlczogYW55KSB7XG4gICAgdGhpcy5kYW9UYWJsZS5zcWxUeXBlc0NoYW5nZS5uZXh0KHNxbFR5cGVzKTtcbiAgICB0aGlzLmRhb1RhYmxlLnNldERhdGFBcnJheShkYXRhKTtcbiAgICB0aGlzLnVwZGF0ZVNjcm9sbGVkU3RhdGUoKTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblBhZ2luYXRlZERhdGFMb2FkZWQsIGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRGF0YUxvYWRlZCwgdGhpcy5kYW9UYWJsZS5kYXRhKTtcbiAgfVxuXG4gIHNob3dEaWFsb2dFcnJvcihlcnJvcjogc3RyaW5nLCBlcnJvck9wdGlvbmFsPzogc3RyaW5nKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVycm9yKSAmJiAhVXRpbC5pc09iamVjdChlcnJvcikpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnJvck9wdGlvbmFsKTtcbiAgICB9XG4gIH1cblxuICBwcm9qZWN0Q29udGVudENoYW5nZWQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmxvYWRpbmdTb3J0aW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICB9LCA1MDApO1xuICAgIHRoaXMubG9hZGluZ1Njcm9sbFN1YmplY3QubmV4dChmYWxzZSk7XG5cbiAgICBpZiAodGhpcy5wcmV2aW91c1JlbmRlcmVyRGF0YSAhPT0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YSkge1xuICAgICAgdGhpcy5wcmV2aW91c1JlbmRlcmVyRGF0YSA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGE7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ29udGVudENoYW5nZSwgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRDb2x1bW5zV2lkdGhGcm9tRE9NKCk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0aW9uJykgJiYgdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5sZW5ndGggPiAwICYmIHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3Rpb24uZm9yRWFjaChzZWxlY3RlZEl0ZW0gPT4ge1xuICAgICAgICAvLyBmaW5kaW5nIHNlbGVjdGVkIGl0ZW0gZGF0YSBpbiB0aGUgdGFibGUgcmVuZGVyZWQgZGF0YVxuICAgICAgICBjb25zdCBmb3VuZEl0ZW0gPSB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmZpbmQoZGF0YSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgT2JqZWN0LmtleXMoc2VsZWN0ZWRJdGVtKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgJiYgKGRhdGFba2V5XSA9PT0gc2VsZWN0ZWRJdGVtW2tleV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZm91bmRJdGVtKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0KGZvdW5kSXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IGNvbHVtbnMgPSBzdXBlci5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9RdWVyeSgpO1xuICAgIGlmICh0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAobGV0IGkgPSBjb2x1bW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGNvbCA9IGNvbHVtbnNbaV07XG4gICAgICAgIGlmICh0aGlzLmF2b2lkUXVlcnlDb2x1bW5zLmluZGV4T2YoY29sKSAhPT0gLTEpIHtcbiAgICAgICAgICBjb2x1bW5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sdW1ucztcbiAgfVxuXG4gIGdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlcjogb2JqZWN0LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogQXJyYXk8YW55PiB7XG4gICAgY29uc3QgcXVlcnlBcmd1bWVudHMgPSBzdXBlci5nZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXIsIG92cnJBcmdzKTtcbiAgICBxdWVyeUFyZ3VtZW50c1szXSA9IHRoaXMuZ2V0U3FsVHlwZXNGb3JGaWx0ZXIocXVlcnlBcmd1bWVudHNbMV0pO1xuICAgIE9iamVjdC5hc3NpZ24ocXVlcnlBcmd1bWVudHNbM10sIG92cnJBcmdzID8gb3ZyckFyZ3Muc3FsdHlwZXMgfHwge30gOiB7fSk7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHF1ZXJ5QXJndW1lbnRzWzVdID0gdGhpcy5wYWdpbmF0b3IuaXNTaG93aW5nQWxsUm93cyhxdWVyeUFyZ3VtZW50c1s1XSkgPyB0aGlzLnN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyIDogcXVlcnlBcmd1bWVudHNbNV07XG4gICAgICBxdWVyeUFyZ3VtZW50c1s2XSA9IHRoaXMuc29ydENvbEFycmF5O1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICBnZXRTcWxUeXBlc0ZvckZpbHRlcihmaWx0ZXIpOiBvYmplY3Qge1xuICAgIGNvbnN0IGFsbFNxbFR5cGVzID0ge307XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZvckVhY2goKGNvbDogT0NvbHVtbikgPT4ge1xuICAgICAgaWYgKGNvbC5zcWxUeXBlKSB7XG4gICAgICAgIGFsbFNxbFR5cGVzW2NvbC5hdHRyXSA9IGNvbC5zcWxUeXBlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5hc3NpZ24oYWxsU3FsVHlwZXMsIHRoaXMuZ2V0U3FsVHlwZXMoKSk7XG4gICAgY29uc3QgZmlsdGVyQ29scyA9IFV0aWwuZ2V0VmFsdWVzRnJvbU9iamVjdChmaWx0ZXIpO1xuICAgIGNvbnN0IHNxbFR5cGVzID0ge307XG4gICAgT2JqZWN0LmtleXMoYWxsU3FsVHlwZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChmaWx0ZXJDb2xzLmluZGV4T2Yoa2V5KSAhPT0gLTEgJiYgYWxsU3FsVHlwZXNba2V5XSAhPT0gU1FMVHlwZXMuT1RIRVIpIHtcbiAgICAgICAgc3FsVHlwZXNba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNxbFR5cGVzO1xuICB9XG5cbiAgb25FeHBvcnRCdXR0b25DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkV4cG9ydEJ1dHRvbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNoYW5nZUNvbHVtbnNWaXNpYmlsaXR5Q2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25DaGFuZ2VDb2x1bW5zVmlzaWJpbGl0eUNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbk1hdFRhYmxlQ29udGVudENoYW5nZWQoKSB7XG4gICAgLy9cbiAgfVxuXG4gIGFkZCgpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLmluc2VydERldGFpbCgpO1xuICB9XG5cbiAgcmVtb3ZlKGNsZWFyU2VsZWN0ZWRJdGVtczogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fREVMRVRFKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5nZXRTZWxlY3RlZEl0ZW1zKCk7XG4gICAgaWYgKHNlbGVjdGVkSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuQ09ORklSTV9ERUxFVEUnKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAodGhpcy5kYXRhU2VydmljZSAmJiAodGhpcy5kZWxldGVNZXRob2QgaW4gdGhpcy5kYXRhU2VydmljZSkgJiYgdGhpcy5lbnRpdHkgJiYgKHRoaXMua2V5c0FycmF5Lmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXJzID0gU2VydmljZVV0aWxzLmdldEFycmF5UHJvcGVydGllcyhzZWxlY3RlZEl0ZW1zLCB0aGlzLmtleXNBcnJheSk7XG4gICAgICAgICAgICB0aGlzLmRhb1RhYmxlLnJlbW92ZVF1ZXJ5KGZpbHRlcnMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Sb3dEZWxldGVkLCBzZWxlY3RlZEl0ZW1zKTtcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zaG93RGlhbG9nRXJyb3IoZXJyb3IsICdNRVNTQUdFUy5FUlJPUl9ERUxFVEUnKTtcbiAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVMb2NhbEl0ZW1zKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsZWFyU2VsZWN0ZWRJdGVtcykge1xuICAgICAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaCgpIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfVxuXG4gIHNob3dBbmRTZWxlY3RBbGxDaGVja2JveCgpIHtcbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RBbGxDaGVja2JveCkge1xuICAgICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUNoZWNrYm94Q29sdW1uKCk7XG4gICAgICB0aGlzLnNlbGVjdEFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIC8vIEluaXRpYWxpemUgcGFnZSBpbmRleFxuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IDA7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICByZWxvYWREYXRhKCkge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1JFRlJFU0gpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdGF0ZSwgdGhpcy5vVGFibGVTdG9yYWdlLmdldFRhYmxlUHJvcGVydHlUb1N0b3JlKCdzZWxlY3Rpb24nKSk7XG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIHRoaXMuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICB0aGlzLnBlbmRpbmdRdWVyeSA9IHRydWU7XG4gICAgLy8gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbCA9IDE7XG4gICAgbGV0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3M7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHF1ZXJ5QXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiB0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MsXG4gICAgICAgIGxlbmd0aDogdGhpcy5xdWVyeVJvd3NcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZWRpdGluZ0NlbGwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soaXRlbTogYW55LCAkZXZlbnQ/KSB7XG4gICAgdGhpcy5jbGlja1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuY2xpY2tQcmV2ZW50KSB7XG4gICAgICAgIHRoaXMuZG9IYW5kbGVDbGljayhpdGVtLCAkZXZlbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGlja1ByZXZlbnQgPSBmYWxzZTtcbiAgICB9LCB0aGlzLmNsaWNrRGVsYXkpO1xuICB9XG5cbiAgZG9IYW5kbGVDbGljayhpdGVtOiBhbnksICRldmVudD8pIHtcbiAgICBpZiAoIXRoaXMub2VuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCh0aGlzLmRldGFpbE1vZGUgPT09IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLKSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCBpdGVtKTtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uLmNsZWFyKCk7XG4gICAgICB0aGlzLnNlbGVjdGVkUm93KGl0ZW0pO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGl0ZW0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpICYmICgkZXZlbnQuY3RybEtleSB8fCAkZXZlbnQubWV0YUtleSkpIHtcbiAgICAgIC8vIFRPRE86IHRlc3QgJGV2ZW50Lm1ldGFLZXkgb24gTUFDXG4gICAgICB0aGlzLnNlbGVjdGVkUm93KGl0ZW0pO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCBpdGVtKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTZWxlY3Rpb25Nb2RlTXVsdGlwbGUoKSAmJiAkZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgIHRoaXMuaGFuZGxlTXVsdGlwbGVTZWxlY3Rpb24oaXRlbSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5pc1NlbGVjdGlvbk1vZGVOb25lKCkpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKGl0ZW0pICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoID09PSAxICYmIHRoaXMuZWRpdGlvbkVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbkFuZEVkaXRpbmcoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2VsZWN0ZWRSb3coaXRlbSk7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ2xpY2ssIGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU11bHRpcGxlU2VsZWN0aW9uKGl0ZW06IGFueSkge1xuICAgIGlmICh0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaXJzdCA9IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuaW5kZXhPZih0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZFswXSk7XG4gICAgICBjb25zdCBsYXN0ID0gdGhpcy5kYXRhU291cmNlLnJlbmRlcmVkRGF0YS5pbmRleE9mKGl0ZW0pO1xuICAgICAgY29uc3QgaW5kZXhGcm9tID0gTWF0aC5taW4oZmlyc3QsIGxhc3QpO1xuICAgICAgY29uc3QgaW5kZXhUbyA9IE1hdGgubWF4KGZpcnN0LCBsYXN0KTtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEuc2xpY2UoaW5kZXhGcm9tLCBpbmRleFRvICsgMSkuZm9yRWFjaChlID0+IHRoaXMuc2VsZWN0ZWRSb3coZSkpO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCkge1xuICAgIHN1cGVyLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSA9IHRydWU7XG4gIH1cblxuICBoYW5kbGVEb3VibGVDbGljayhpdGVtOiBhbnksIGV2ZW50Pykge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmNsaWNrVGltZXIpO1xuICAgIHRoaXMuY2xpY2tQcmV2ZW50ID0gdHJ1ZTtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRG91YmxlQ2xpY2ssIGl0ZW0pO1xuICAgIGlmICh0aGlzLm9lbmFibGVkICYmIENvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHRoaXMuZGV0YWlsTW9kZSkpIHtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMudmlld0RldGFpbChpdGVtKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZWRpdGlvbkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb21lKGl0ZW0gPT4gaXRlbS5lZGl0aW5nKTtcbiAgfVxuXG4gIGhhbmRsZURPTUNsaWNrKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX29UYWJsZU9wdGlvbnMuc2VsZWN0Q29sdW1uLnZpc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lZGl0aW9uRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG92ZXJsYXlDb250YWluZXIgPSBkb2N1bWVudC5ib2R5LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nkay1vdmVybGF5LWNvbnRhaW5lcicpWzBdO1xuICAgIGlmIChvdmVybGF5Q29udGFpbmVyICYmIG92ZXJsYXlDb250YWluZXIuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlQ29udGFpbmVyID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vLXRhYmxlLWNvbnRhaW5lcicpO1xuICAgIGNvbnN0IHRhYmxlQ29udGVudCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuby10YWJsZS1jb250YWluZXIgdGFibGUubWF0LXRhYmxlJyk7XG4gICAgaWYgKHRhYmxlQ29udGFpbmVyICYmIHRhYmxlQ29udGVudCAmJiB0YWJsZUNvbnRhaW5lci5jb250YWlucyhldmVudC50YXJnZXQpICYmICF0YWJsZUNvbnRlbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUNlbGxDbGljayhjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55LCBldmVudD8pIHtcbiAgICBpZiAodGhpcy5vZW5hYmxlZCAmJiBjb2x1bW4uZWRpdG9yXG4gICAgICAmJiAodGhpcy5kZXRhaWxNb2RlICE9PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSylcbiAgICAgICYmICh0aGlzLmVkaXRpb25Nb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykpIHtcblxuICAgICAgdGhpcy5hY3RpdmF0ZUNvbHVtbkVkaXRpb24oY29sdW1uLCByb3csIGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDZWxsRG91YmxlQ2xpY2soY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ/KSB7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgY29sdW1uLmVkaXRvclxuICAgICAgJiYgKCFDb2Rlcy5pc0RvdWJsZUNsaWNrTW9kZSh0aGlzLmRldGFpbE1vZGUpKVxuICAgICAgJiYgKENvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHRoaXMuZWRpdGlvbk1vZGUpKSkge1xuXG4gICAgICB0aGlzLmFjdGl2YXRlQ29sdW1uRWRpdGlvbihjb2x1bW4sIHJvdywgZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhY3RpdmF0ZUNvbHVtbkVkaXRpb24oY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ/KSB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmIChldmVudCAmJiBjb2x1bW4uZWRpdGluZyAmJiB0aGlzLmVkaXRpbmdDZWxsID09PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbHVtblBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldE9Db2x1bW5QZXJtaXNzaW9ucyhjb2x1bW4uYXR0cik7XG4gICAgaWYgKGNvbHVtblBlcm1pc3Npb25zLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYCR7Y29sdW1uLmF0dHJ9IGVkaXRpb24gbm90IGFsbG93ZWQgZHVlIHRvIHBlcm1pc3Npb25zYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbkFuZEVkaXRpbmcoKTtcbiAgICB0aGlzLnNlbGVjdGVkUm93KHJvdyk7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICB0aGlzLmVkaXRpbmdDZWxsID0gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICB9XG4gICAgY29uc3Qgcm93RGF0YSA9IHt9O1xuICAgIHRoaXMua2V5c0FycmF5LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgcm93RGF0YVtrZXldID0gcm93W2tleV07XG4gICAgfSk7XG4gICAgcm93RGF0YVtjb2x1bW4uYXR0cl0gPSByb3dbY29sdW1uLmF0dHJdO1xuICAgIHRoaXMuZWRpdGluZ1JvdyA9IHJvdztcbiAgICBjb2x1bW4uZWRpdGluZyA9IHRydWU7XG4gICAgY29sdW1uLmVkaXRvci5zdGFydEVkaXRpb24ocm93RGF0YSk7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICB1cGRhdGVDZWxsRGF0YShjb2x1bW46IE9Db2x1bW4sIGRhdGE6IGFueSwgc2F2ZUNoYW5nZXM6IGJvb2xlYW4pIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbihQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUpKSB7XG4gICAgICBjb25zdCByZXMgPSBuZXcgT2JzZXJ2YWJsZShpbm5lck9ic2VydmVyID0+IHtcbiAgICAgICAgaW5uZXJPYnNlcnZlci5lcnJvcigpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBjb2x1bW4uZWRpdGluZyA9IGZhbHNlO1xuICAgIHRoaXMuZWRpdGluZ0NlbGwgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHNhdmVDaGFuZ2VzICYmIHRoaXMuZWRpdGluZ1JvdyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuZWRpdGluZ1JvdywgZGF0YSk7XG4gICAgfVxuICAgIHRoaXMuZWRpdGluZ1JvdyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoc2F2ZUNoYW5nZXMgJiYgY29sdW1uLmVkaXRvci51cGRhdGVSZWNvcmRPbkVkaXQpIHtcbiAgICAgIGNvbnN0IHRvVXBkYXRlID0ge307XG4gICAgICB0b1VwZGF0ZVtjb2x1bW4uYXR0cl0gPSBkYXRhW2NvbHVtbi5hdHRyXTtcbiAgICAgIGNvbnN0IGt2ID0gdGhpcy5leHRyYWN0S2V5c0Zyb21SZWNvcmQoZGF0YSk7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVSZWNvcmQoa3YsIHRvVXBkYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRLZXlzVmFsdWVzKCk6IGFueVtdIHtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRBbGxWYWx1ZXMoKTtcbiAgICByZXR1cm4gZGF0YS5tYXAoKHJvdykgPT4ge1xuICAgICAgY29uc3Qgb2JqID0ge307XG4gICAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKHJvd1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBvYmpba2V5XSA9IHJvd1trZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgfVxuXG4gIG9uU2hvd3NTZWxlY3RzKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vblNob3dzU2VsZWN0cygpO1xuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemVDaGVja2JveENvbHVtbigpIHtcbiAgICAvLyBJbml0aWFsaXppbmcgcm93IHNlbGVjdGlvbiBsaXN0ZW5lclxuICAgIGlmICghdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24gJiYgdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSkge1xuICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnNlbGVjdGlvbi5jaGFuZ2VkLnN1YnNjcmliZSgoc2VsZWN0aW9uRGF0YTogU2VsZWN0aW9uQ2hhbmdlPGFueT4pID0+IHtcbiAgICAgICAgaWYgKHNlbGVjdGlvbkRhdGEgJiYgc2VsZWN0aW9uRGF0YS5hZGRlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblJvd1NlbGVjdGVkLCBzZWxlY3Rpb25EYXRhLmFkZGVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0aW9uRGF0YSAmJiBzZWxlY3Rpb25EYXRhLnJlbW92ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Sb3dEZXNlbGVjdGVkLCBzZWxlY3Rpb25EYXRhLnJlbW92ZWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVTZWxlY3Rpb25Db2x1bW5TdGF0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVNlbGVjdGlvbkNvbHVtblN0YXRlKCkge1xuICAgIGlmICghdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZSkge1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucyAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnNlbGVjdENvbHVtbi52aXNpYmxlXG4gICAgICAmJiB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zWzBdICE9PSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpIHtcbiAgICAgIHRoaXMuX29UYWJsZU9wdGlvbnMudmlzaWJsZUNvbHVtbnMudW5zaGlmdChDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1QpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucyAmJiAhdGhpcy5fb1RhYmxlT3B0aW9ucy5zZWxlY3RDb2x1bW4udmlzaWJsZVxuICAgICAgJiYgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1uc1swXSA9PT0gQ29kZXMuTkFNRV9DT0xVTU5fU0VMRUNUKSB7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLnNoaWZ0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzQWxsU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbnVtU2VsZWN0ZWQgPSB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZC5sZW5ndGg7XG4gICAgY29uc3QgbnVtUm93cyA9IHRoaXMuZGF0YVNvdXJjZSA/IHRoaXMuZGF0YVNvdXJjZS5yZW5kZXJlZERhdGEubGVuZ3RoIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBudW1TZWxlY3RlZCA+IDAgJiYgbnVtU2VsZWN0ZWQgPT09IG51bVJvd3M7XG4gIH1cblxuICBwdWJsaWMgbWFzdGVyVG9nZ2xlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSk6IHZvaWQge1xuICAgIGV2ZW50LmNoZWNrZWQgPyB0aGlzLnNlbGVjdEFsbCgpIDogdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdEFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLmRhdGFTb3VyY2UucmVuZGVyZWREYXRhLmZvckVhY2gocm93ID0+IHRoaXMuc2VsZWN0aW9uLnNlbGVjdChyb3cpKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3Rpb25DaGVja2JveFRvZ2dsZShldmVudDogTWF0Q2hlY2tib3hDaGFuZ2UsIHJvdzogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNTZWxlY3Rpb25Nb2RlU2luZ2xlKCkpIHtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RlZFJvdyhyb3cpO1xuICB9XG5cbiAgcHVibGljIHNlbGVjdGVkUm93KHJvdzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zZXRTZWxlY3RlZChyb3cpO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgZ2V0IHNob3dEZWxldGVCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlQnV0dG9uO1xuICB9XG5cbiAgZ2V0VHJhY2tCeUZ1bmN0aW9uKCk6IChpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpID0+IHN0cmluZyB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICByZXR1cm4gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4ge1xuICAgICAgaWYgKHNlbGYuaGFzU2Nyb2xsYWJsZUNvbnRhaW5lcigpICYmIGluZGV4IDwgKHNlbGYucGFnZVNjcm9sbFZpcnR1YWwgLSAxKSAqIENvZGVzLkxJTUlUX1NDUk9MTFZJUlRVQUwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGxldCBpdGVtSWQ6IHN0cmluZyA9ICcnO1xuICAgICAgY29uc3Qga2V5c0xlbmdodCA9IHNlbGYua2V5c0FycmF5Lmxlbmd0aDtcbiAgICAgIHNlbGYua2V5c0FycmF5LmZvckVhY2goKGtleTogc3RyaW5nLCBpZHg6IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBzdWZmaXggPSBpZHggPCAoa2V5c0xlbmdodCAtIDEpID8gJzsnIDogJyc7XG4gICAgICAgIGl0ZW1JZCArPSBpdGVtW2tleV0gKyBzdWZmaXg7XG4gICAgICB9KTtcblxuXG4gICAgICBjb25zdCBhc3luY0FuZFZpc2libGUgPSBzZWxmLmFzeW5jTG9hZENvbHVtbnMuZmlsdGVyKGMgPT4gc2VsZi5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5pbmRleE9mKGMpICE9PSAtMSk7XG4gICAgICBpZiAoc2VsZi5hc3luY0xvYWRDb2x1bW5zLmxlbmd0aCAmJiBhc3luY0FuZFZpc2libGUubGVuZ3RoID4gMCAmJiAhc2VsZi5maW5pc2hRdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgICBzZWxmLnF1ZXJ5Um93QXN5bmNEYXRhKGluZGV4LCBpdGVtKTtcbiAgICAgICAgaWYgKHNlbGYucGFnaW5hdG9yICYmIGluZGV4ID09PSAoc2VsZi5wYWdpbmF0b3IucGFnZVNpemUgLSAxKSkge1xuICAgICAgICAgIHNlbGYuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtSWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaXRlbUlkO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBxdWVyeVJvd0FzeW5jRGF0YShyb3dJbmRleDogbnVtYmVyLCByb3dEYXRhOiBhbnkpIHtcbiAgICBjb25zdCBrdiA9IFNlcnZpY2VVdGlscy5nZXRPYmplY3RQcm9wZXJ0aWVzKHJvd0RhdGEsIHRoaXMua2V5c0FycmF5KTtcbiAgICAvLyBSZXBlYXRpbmcgY2hlY2tpbmcgb2YgdmlzaWJsZSBjb2x1bW5cbiAgICBjb25zdCBhdiA9IHRoaXMuYXN5bmNMb2FkQ29sdW1ucy5maWx0ZXIoYyA9PiB0aGlzLl9vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zLmluZGV4T2YoYykgIT09IC0xKTtcbiAgICBpZiAoYXYubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBTa2lwcGluZyBxdWVyeSBpZiB0aGVyZSBhcmUgbm90IHZpc2libGUgYXN5bmNyb24gY29sdW1uc1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb2x1bW5RdWVyeUFyZ3MgPSBba3YsIGF2LCB0aGlzLmVudGl0eSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkXTtcbiAgICBjb25zdCBxdWVyeU1ldGhvZE5hbWUgPSB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2Q7XG4gICAgaWYgKHRoaXMuZGF0YVNlcnZpY2UgJiYgKHF1ZXJ5TWV0aG9kTmFtZSBpbiB0aGlzLmRhdGFTZXJ2aWNlKSAmJiB0aGlzLmVudGl0eSkge1xuICAgICAgaWYgKHRoaXMuYXN5bmNMb2FkU3Vic2NyaXB0aW9uc1tyb3dJbmRleF0pIHtcbiAgICAgICAgdGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW3Jvd0luZGV4XS51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5hc3luY0xvYWRTdWJzY3JpcHRpb25zW3Jvd0luZGV4XSA9IHRoaXMuZGF0YVNlcnZpY2VbcXVlcnlNZXRob2ROYW1lXVxuICAgICAgICAuYXBwbHkodGhpcy5kYXRhU2VydmljZSwgY29sdW1uUXVlcnlBcmdzKVxuICAgICAgICAuc3Vic2NyaWJlKChyZXM6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmIChyZXMuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShyZXMuZGF0YSkgJiYgcmVzLmRhdGEubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgIGRhdGEgPSByZXMuZGF0YVswXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChyZXMuZGF0YSkpIHtcbiAgICAgICAgICAgICAgZGF0YSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYW9UYWJsZS5zZXRBc3luY2hyb25vdXNDb2x1bW4oZGF0YSwgcm93RGF0YSk7XG4gICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UuZ2V0Q3VycmVudERhdGEoKTtcbiAgfVxuXG4gIGdldEFsbFZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEN1cnJlbnRBbGxEYXRhKCk7XG4gIH1cblxuICBnZXRBbGxSZW5kZXJlZFZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEFsbFJlbmRlcmVyRGF0YSgpO1xuICB9XG5cbiAgZ2V0UmVuZGVyZWRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU291cmNlLmdldEN1cnJlbnRSZW5kZXJlckRhdGEoKTtcbiAgfVxuXG4gIGdldFNxbFR5cGVzKCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRhdGFTb3VyY2Uuc3FsVHlwZXMpID8gdGhpcy5kYXRhU291cmNlLnNxbFR5cGVzIDoge307XG4gIH1cblxuICBzZXRPVGFibGVDb2x1bW5zRmlsdGVyKHRhYmxlQ29sdW1uc0ZpbHRlcjogT1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCkge1xuICAgIHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCA9IHRhYmxlQ29sdW1uc0ZpbHRlcjtcbiAgfVxuXG4gIGdldFN0b3JlZENvbHVtbnNGaWx0ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29sdW1uc0ZpbHRlcnMoKTtcbiAgfVxuXG4gIG9uRmlsdGVyQnlDb2x1bW5DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkZpbHRlckJ5Q29sdW1uQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RvcmVGaWx0ZXJDbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vblN0b3JlRmlsdGVyQ2xpY2tlZCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTG9hZEZpbHRlckNsaWNrZWQoKSB7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSkge1xuICAgICAgdGhpcy5vVGFibGVNZW51Lm9uTG9hZEZpbHRlckNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBvbkNsZWFyRmlsdGVyQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25DbGVhckZpbHRlckNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckZpbHRlcnModHJpZ2dlckRhdGFzb3VyY2VVcGRhdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlLmNsZWFyQ29sdW1uRmlsdGVycyh0cmlnZ2VyRGF0YXNvdXJjZVVwZGF0ZSk7XG4gICAgaWYgKHRoaXMub1RhYmxlTWVudSAmJiB0aGlzLm9UYWJsZU1lbnUuY29sdW1uRmlsdGVyT3B0aW9uKSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUuY29sdW1uRmlsdGVyT3B0aW9uLnNldEFjdGl2ZSh0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudCkge1xuICAgICAgdGhpcy5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC5zZXRWYWx1ZSh2b2lkIDApO1xuICAgIH1cbiAgfVxuXG4gIGlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudCAmJiB0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQuaXNDb2x1bW5GaWx0ZXJhYmxlKGNvbHVtbi5hdHRyKSk7XG4gIH1cblxuICBpc01vZGVDb2x1bW5GaWx0ZXJhYmxlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gJiZcbiAgICAgICh0aGlzLm9UYWJsZUNvbHVtbnNGaWx0ZXJDb21wb25lbnQgJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LmlzQ29sdW1uRmlsdGVyYWJsZShjb2x1bW4uYXR0cikpO1xuICB9XG5cbiAgaXNDb2x1bW5GaWx0ZXJBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiAmJlxuICAgICAgdGhpcy5kYXRhU291cmNlLmdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKGNvbHVtbi5hdHRyKSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgb3BlbkNvbHVtbkZpbHRlckRpYWxvZyhjb2x1bW46IE9Db2x1bW4sIGV2ZW50OiBFdmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgY29uc3QgZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQsIHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcHJldmlvdXNGaWx0ZXI6IHRoaXMuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlckJ5QXR0cihjb2x1bW4uYXR0ciksXG4gICAgICAgIGNvbHVtbjogY29sdW1uLFxuICAgICAgICB0YWJsZURhdGE6IHRoaXMuZGF0YVNvdXJjZS5nZXRUYWJsZURhdGEoKSxcbiAgICAgICAgcHJlbG9hZFZhbHVlczogdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50LnByZWxvYWRWYWx1ZXMsXG4gICAgICAgIG1vZGU6IHRoaXMub1RhYmxlQ29sdW1uc0ZpbHRlckNvbXBvbmVudC5tb2RlXG4gICAgICB9LFxuICAgICAgZGlzYWJsZUNsb3NlOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogWydvLWRpYWxvZy1jbGFzcycsICdvLXRhYmxlLWRpYWxvZyddXG4gICAgfSk7XG4gICAgZGlhbG9nUmVmLmFmdGVyQ2xvc2VkKCkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IGNvbHVtblZhbHVlRmlsdGVyID0gZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldENvbHVtblZhbHVlc0ZpbHRlcigpO1xuICAgICAgICB0aGlzLmRhdGFTb3VyY2UuYWRkQ29sdW1uRmlsdGVyKGNvbHVtblZhbHVlRmlsdGVyKTtcbiAgICAgICAgdGhpcy5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgZGlzYWJsZVRhYmxlTWVudUJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEodGhpcy5wZXJtaXNzaW9ucyAmJiB0aGlzLnBlcm1pc3Npb25zLm1lbnUgJiYgdGhpcy5wZXJtaXNzaW9ucy5tZW51LmVuYWJsZWQgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93VGFibGVNZW51QnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBlcm1pc3Npb25IaWRkZW4gPSAhISh0aGlzLnBlcm1pc3Npb25zICYmIHRoaXMucGVybWlzc2lvbnMubWVudSAmJiB0aGlzLnBlcm1pc3Npb25zLm1lbnUudmlzaWJsZSA9PT0gZmFsc2UpO1xuICAgIGlmIChwZXJtaXNzaW9uSGlkZGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHN0YXRpY09wdCA9IHRoaXMuc2VsZWN0QWxsQ2hlY2tib3ggfHwgdGhpcy5leHBvcnRCdXR0b24gfHwgdGhpcy5zaG93Q29uZmlndXJhdGlvbk9wdGlvbiB8fCB0aGlzLmNvbHVtbnNWaXNpYmlsaXR5QnV0dG9uIHx8ICh0aGlzLnNob3dGaWx0ZXJPcHRpb24gJiYgdGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpO1xuICAgIHJldHVybiBzdGF0aWNPcHQgfHwgdGhpcy50YWJsZU9wdGlvbnMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHNldE9UYWJsZUluc2VydGFibGVSb3codGFibGVJbnNlcnRhYmxlUm93OiBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50KSB7XG4gICAgY29uc3QgaW5zZXJ0UGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRBY3Rpb25QZXJtaXNzaW9ucyhQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQpO1xuICAgIGlmIChpbnNlcnRQZXJtLnZpc2libGUpIHtcbiAgICAgIHRhYmxlSW5zZXJ0YWJsZVJvdy5lbmFibGVkID0gaW5zZXJ0UGVybS5lbmFibGVkO1xuICAgICAgdGhpcy5vVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50ID0gdGFibGVJbnNlcnRhYmxlUm93O1xuICAgICAgdGhpcy5zaG93Rmlyc3RJbnNlcnRhYmxlUm93ID0gdGhpcy5vVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50LmlzRmlyc3RSb3coKTtcbiAgICAgIHRoaXMuc2hvd0xhc3RJbnNlcnRhYmxlUm93ID0gIXRoaXMuc2hvd0ZpcnN0SW5zZXJ0YWJsZVJvdztcbiAgICAgIHRoaXMub1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudC5pbml0aWFsaXplRWRpdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyU2VsZWN0aW9uQW5kRWRpdGluZygpIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcigpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5lZGl0aW5nID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICB1c2VEZXRhaWxCdXR0b24oY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbHVtbi50eXBlID09PSAnZWRpdEJ1dHRvbkluUm93JyB8fCBjb2x1bW4udHlwZSA9PT0gJ2RldGFpbEJ1dHRvbkluUm93JztcbiAgfVxuXG4gIG9uRGV0YWlsQnV0dG9uQ2xpY2soY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSwgZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc3dpdGNoIChjb2x1bW4udHlwZSkge1xuICAgICAgY2FzZSAnZWRpdEJ1dHRvbkluUm93JzpcbiAgICAgICAgdGhpcy5lZGl0RGV0YWlsKHJvdyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGV0YWlsQnV0dG9uSW5Sb3cnOlxuICAgICAgICB0aGlzLnZpZXdEZXRhaWwocm93KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGV0YWlsQnV0dG9uSWNvbihjb2x1bW46IE9Db2x1bW4pIHtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgc3dpdGNoIChjb2x1bW4udHlwZSkge1xuICAgICAgY2FzZSAnZWRpdEJ1dHRvbkluUm93JzpcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5lZGl0QnV0dG9uSW5Sb3dJY29uO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RldGFpbEJ1dHRvbkluUm93JzpcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5kZXRhaWxCdXR0b25JblJvd0ljb247XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgdXNlUGxhaW5SZW5kZXIoY29sdW1uOiBPQ29sdW1uLCByb3c6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy51c2VEZXRhaWxCdXR0b24oY29sdW1uKSAmJiAhY29sdW1uLnJlbmRlcmVyICYmICghY29sdW1uLmVkaXRvciB8fCAoIWNvbHVtbi5lZGl0aW5nIHx8ICF0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdykpKTtcbiAgfVxuXG4gIHVzZUNlbGxSZW5kZXJlcihjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbHVtbi5yZW5kZXJlciAmJiAoIWNvbHVtbi5lZGl0aW5nIHx8IGNvbHVtbi5lZGl0aW5nICYmICF0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdykpO1xuICB9XG5cbiAgdXNlQ2VsbEVkaXRvcihjb2x1bW46IE9Db2x1bW4sIHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgLy8gVE9ETyBBZGQgY29sdW1uLmVkaXRvciBpbnN0YW5jZW9mIE9UYWJsZUNlbGxFZGl0b3JCb29sZWFuQ29tcG9uZW50IHRvIGNvbmRpdGlvblxuICAgIGlmIChjb2x1bW4uZWRpdG9yICYmIGNvbHVtbi5lZGl0b3IuYXV0b0NvbW1pdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gY29sdW1uLmVkaXRvciAmJiBjb2x1bW4uZWRpdGluZyAmJiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdyk7XG4gIH1cblxuICBpc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSBDb2Rlcy5TRUxFQ1RJT05fTU9ERV9NVUxUSVBMRTtcbiAgfVxuXG4gIGlzU2VsZWN0aW9uTW9kZVNpbmdsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb25Nb2RlID09PSBDb2Rlcy5TRUxFQ1RJT05fTU9ERV9TSU5HTEU7XG4gIH1cblxuICBpc1NlbGVjdGlvbk1vZGVOb25lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbk1vZGUgPT09IENvZGVzLlNFTEVDVElPTl9NT0RFX05PTkU7XG4gIH1cblxuICBvbkNoYW5nZVBhZ2UoZXZ0OiBQYWdlRXZlbnQpIHtcbiAgICB0aGlzLmZpbmlzaFF1ZXJ5U3Vic2NyaXB0aW9uID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gZXZ0LnBhZ2VJbmRleDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGFibGVTdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBnb2luZ0JhY2sgPSBldnQucGFnZUluZGV4IDwgdGhpcy5jdXJyZW50UGFnZTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gZXZ0LnBhZ2VJbmRleDtcbiAgICBjb25zdCBwYWdlU2l6ZSA9IHRoaXMucGFnaW5hdG9yLmlzU2hvd2luZ0FsbFJvd3MoZXZ0LnBhZ2VTaXplKSA/IHRhYmxlU3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgOiBldnQucGFnZVNpemU7XG5cbiAgICBjb25zdCBvbGRRdWVyeVJvd3MgPSB0aGlzLnF1ZXJ5Um93cztcbiAgICBjb25zdCBjaGFuZ2luZ1BhZ2VTaXplID0gKG9sZFF1ZXJ5Um93cyAhPT0gcGFnZVNpemUpO1xuICAgIHRoaXMucXVlcnlSb3dzID0gcGFnZVNpemU7XG5cbiAgICBsZXQgbmV3U3RhcnRSZWNvcmQ7XG4gICAgbGV0IHF1ZXJ5TGVuZ3RoO1xuXG4gICAgaWYgKGdvaW5nQmFjayB8fCBjaGFuZ2luZ1BhZ2VTaXplKSB7XG4gICAgICBuZXdTdGFydFJlY29yZCA9ICh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MpO1xuICAgICAgcXVlcnlMZW5ndGggPSB0aGlzLnF1ZXJ5Um93cztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U3RhcnRSZWNvcmQgPSBNYXRoLm1heCh0YWJsZVN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0LCAodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzKSk7XG4gICAgICBjb25zdCBuZXdFbmRSZWNvcmQgPSBNYXRoLm1pbihuZXdTdGFydFJlY29yZCArIHRoaXMucXVlcnlSb3dzLCB0YWJsZVN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyKTtcbiAgICAgIHF1ZXJ5TGVuZ3RoID0gTWF0aC5taW4odGhpcy5xdWVyeVJvd3MsIG5ld0VuZFJlY29yZCAtIG5ld1N0YXJ0UmVjb3JkKTtcbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgb2Zmc2V0OiBuZXdTdGFydFJlY29yZCxcbiAgICAgIGxlbmd0aDogcXVlcnlMZW5ndGhcbiAgICB9O1xuICAgIHRoaXMuZmluaXNoUXVlcnlTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gIH1cblxuICBnZXRPQ29sdW1uKGF0dHI6IHN0cmluZyk6IE9Db2x1bW4ge1xuICAgIHJldHVybiB0aGlzLl9vVGFibGVPcHRpb25zID8gdGhpcy5fb1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbmQoaXRlbSA9PiBpdGVtLm5hbWUgPT09IGF0dHIpIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgaW5zZXJ0UmVjb3JkKHJlY29yZERhdGE6IGFueSwgc3FsVHlwZXM/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0lOU0VSVCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc3FsVHlwZXMpKSB7XG4gICAgICBjb25zdCBhbGxTcWxUeXBlcyA9IHRoaXMuZ2V0U3FsVHlwZXMoKTtcbiAgICAgIHNxbFR5cGVzID0ge307XG4gICAgICBPYmplY3Qua2V5cyhyZWNvcmREYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHNxbFR5cGVzW2tleV0gPSBhbGxTcWxUeXBlc1trZXldO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRhb1RhYmxlLmluc2VydFF1ZXJ5KHJlY29yZERhdGEsIHNxbFR5cGVzKTtcbiAgfVxuXG4gIHVwZGF0ZVJlY29yZChmaWx0ZXI6IGFueSwgdXBkYXRlRGF0YTogYW55LCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZEFjdGlvblBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fVVBEQVRFKSkge1xuICAgICAgcmV0dXJuIG9mKHRoaXMuZGF0YVNvdXJjZS5kYXRhKTtcbiAgICB9XG4gICAgY29uc3Qgc3FsVHlwZXNBcmcgPSBzcWxUeXBlcyB8fCB7fTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHNxbFR5cGVzKSkge1xuICAgICAgY29uc3QgYWxsU3FsVHlwZXMgPSB0aGlzLmdldFNxbFR5cGVzKCk7XG4gICAgICBPYmplY3Qua2V5cyhmaWx0ZXIpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgc3FsVHlwZXNBcmdba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5rZXlzKHVwZGF0ZURhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgc3FsVHlwZXNBcmdba2V5XSA9IGFsbFNxbFR5cGVzW2tleV07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGFvVGFibGUudXBkYXRlUXVlcnkoZmlsdGVyLCB1cGRhdGVEYXRhLCBzcWxUeXBlc0FyZyk7XG4gIH1cblxuICBnZXREYXRhQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGFvVGFibGUuZGF0YTtcbiAgfVxuXG4gIHNldERhdGFBcnJheShkYXRhOiBBcnJheTxhbnk+KSB7XG4gICAgaWYgKHRoaXMuZGFvVGFibGUpIHtcbiAgICAgIC8vIHJlbW90ZSBwYWdpbmF0aW9uIGhhcyBubyBzZW5zZSB3aGVuIHVzaW5nIHN0YXRpYy1kYXRhXG4gICAgICB0aGlzLnBhZ2VhYmxlID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXRpY0RhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5kYW9UYWJsZS51c2luZ1N0YXRpY0RhdGEgPSB0cnVlO1xuICAgICAgdGhpcy5kYW9UYWJsZS5zZXREYXRhQXJyYXkodGhpcy5zdGF0aWNEYXRhKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZGVsZXRlTG9jYWxJdGVtcygpIHtcbiAgICBjb25zdCBkYXRhQXJyYXkgPSB0aGlzLmdldERhdGFBcnJheSgpO1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBzZWxlY3RlZEl0ZW1zLmZvckVhY2goKHNlbGVjdGVkSXRlbTogYW55KSA9PiB7XG4gICAgICBmb3IgKGxldCBqID0gZGF0YUFycmF5Lmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgIGlmIChVdGlsLmVxdWFscyhzZWxlY3RlZEl0ZW0sIGRhdGFBcnJheVtqXSkpIHtcbiAgICAgICAgICBkYXRhQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgIHRoaXMuc2V0RGF0YUFycmF5KGRhdGFBcnJheSk7XG4gIH1cblxuICBpc0NvbHVtblNvcnRBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLnNvcnRDb2xBcnJheS5maW5kKHNvcnRDID0+IHNvcnRDLmNvbHVtbk5hbWUgPT09IGNvbHVtbi5hdHRyKTtcbiAgICByZXR1cm4gZm91bmQgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlzQ29sdW1uRGVzY1NvcnRBY3RpdmUoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgY29uc3QgZm91bmQgPSB0aGlzLnNvcnRDb2xBcnJheS5maW5kKHNvcnRDID0+IHNvcnRDLmNvbHVtbk5hbWUgPT09IGNvbHVtbi5hdHRyICYmICFzb3J0Qy5hc2NlbmRlbnQpO1xuICAgIHJldHVybiBmb3VuZCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgaGFzVGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudGFiR3JvdXBDaGFuZ2VTdWJzY3JpcHRpb24gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlzRW1wdHkodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhVXRpbC5pc0RlZmluZWQodmFsdWUpIHx8ICgodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgJiYgIXZhbHVlKTtcbiAgfVxuXG4gIHNldEZpbHRlcnNDb25maWd1cmF0aW9uKGNvbmY6IGFueSkge1xuICAgIC8vIGluaXRpYWxpemUgZmlsdGVyQ2FzZVNlbnNpdGl2ZVxuXG4gICAgLypcbiAgICAgIENoZWNraW5nIHRoZSBvcmlnaW5hbCBmaWx0ZXJDYXNlU2Vuc2l0aXZlIHdpdGggdGhlIGZpbHRlckNhc2VTZW5zaXRpdmUgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmIGZpbHRlckNhc2VTZW5zaXRpdmUgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGlzIGVxdWFscyB0byBvcmlnaW5hbCBmaWx0ZXJDYXNlU2Vuc2l0aXZlIGlucHV0XG4gICAgICBmaWx0ZXJDYXNlU2Vuc2l0aXZlIHdpbGwgYmUgdGhlIHZhbHVlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAqL1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmUpICYmIHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpICYmXG4gICAgICB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJykgJiZcbiAgICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9PT0gY29uZlsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZSddKSB7XG4gICAgICB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmUgPSBjb25mLmhhc093blByb3BlcnR5KCdmaWx0ZXItY2FzZS1zZW5zaXRpdmUnKSA/IGNvbmZbJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZSddIDogdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlO1xuICAgIH1cblxuICAgIGNvbnN0IHN0b3JlZENvbHVtbkZpbHRlcnMgPSB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29sdW1uc0ZpbHRlcnMoY29uZik7XG4gICAgdGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uID0gc3RvcmVkQ29sdW1uRmlsdGVycy5sZW5ndGggPiAwO1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUgJiYgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbikge1xuICAgICAgdGhpcy5vVGFibGVNZW51LmNvbHVtbkZpbHRlck9wdGlvbi5zZXRBY3RpdmUodGhpcy5zaG93RmlsdGVyQnlDb2x1bW5JY29uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vVGFibGVDb2x1bW5zRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UuaW5pdGlhbGl6ZUNvbHVtbnNGaWx0ZXJzKHN0b3JlZENvbHVtbkZpbHRlcnMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50LnNldFZhbHVlKGNvbmYuZmlsdGVyKTtcbiAgICAgIGNvbnN0IHN0b3JlZENvbHVtbnNEYXRhID0gY29uZi5vQ29sdW1ucyB8fCBbXTtcbiAgICAgIHN0b3JlZENvbHVtbnNEYXRhLmZvckVhY2goKG9Db2xEYXRhOiBhbnkpID0+IHtcbiAgICAgICAgY29uc3Qgb0NvbCA9IHRoaXMuZ2V0T0NvbHVtbihvQ29sRGF0YS5hdHRyKTtcbiAgICAgICAgaWYgKG9Db2wpIHtcbiAgICAgICAgICBpZiAob0NvbERhdGEuaGFzT3duUHJvcGVydHkoJ3NlYXJjaGluZycpKSB7XG4gICAgICAgICAgICBvQ29sLnNlYXJjaGluZyA9IG9Db2xEYXRhLnNlYXJjaGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uU3RvcmVDb25maWd1cmF0aW9uQ2xpY2tlZCgpIHtcbiAgICBpZiAodGhpcy5vVGFibGVNZW51KSB7XG4gICAgICB0aGlzLm9UYWJsZU1lbnUub25TdG9yZUNvbmZpZ3VyYXRpb25DbGlja2VkKCk7XG4gICAgfVxuICB9XG5cbiAgb25BcHBseUNvbmZpZ3VyYXRpb25DbGlja2VkKCkge1xuICAgIGlmICh0aGlzLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMub1RhYmxlTWVudS5vbkFwcGx5Q29uZmlndXJhdGlvbkNsaWNrZWQoKTtcbiAgICB9XG4gIH1cblxuICBhcHBseURlZmF1bHRDb25maWd1cmF0aW9uKCkge1xuICAgIHRoaXMub1RhYmxlU3RvcmFnZS5yZXNldCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVBhcmFtcygpO1xuICAgIHRoaXMucGFyc2VWaXNpYmxlQ29sdW1ucygpO1xuICAgIHRoaXMuX29UYWJsZU9wdGlvbnMuY29sdW1ucy5zb3J0KChhOiBPQ29sdW1uLCBiOiBPQ29sdW1uKSA9PiB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGEuYXR0cikgLSB0aGlzLnZpc2libGVDb2xBcnJheS5pbmRleE9mKGIuYXR0cikpO1xuICAgIHRoaXMuaW5zaWRlVGFiQnVnV29ya2Fyb3VuZCgpO1xuICAgIHRoaXMub25SZWluaXRpYWxpemUuZW1pdChudWxsKTtcbiAgICB0aGlzLmNsZWFyRmlsdGVycyhmYWxzZSk7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gIH1cblxuICBhcHBseUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbk5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHN0b3JlZENvbmZpZ3VyYXRpb24gPSB0aGlzLm9UYWJsZVN0b3JhZ2UuZ2V0U3RvcmVkQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uTmFtZSk7XG4gICAgaWYgKHN0b3JlZENvbmZpZ3VyYXRpb24pIHtcbiAgICAgIGNvbnN0IHByb3BlcnRpZXMgPSBzdG9yZWRDb25maWd1cmF0aW9uW09UYWJsZVN0b3JhZ2UuU1RPUkVEX1BST1BFUlRJRVNfS0VZXSB8fCBbXTtcbiAgICAgIGNvbnN0IGNvbmYgPSBzdG9yZWRDb25maWd1cmF0aW9uW09UYWJsZVN0b3JhZ2UuU1RPUkVEX0NPTkZJR1VSQVRJT05fS0VZXTtcbiAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChwcm9wZXJ0eSA9PiB7XG4gICAgICAgIHN3aXRjaCAocHJvcGVydHkpIHtcbiAgICAgICAgICBjYXNlICdzb3J0JzpcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddID0gY29uZlsnc29ydC1jb2x1bW5zJ107XG4gICAgICAgICAgICB0aGlzLnBhcnNlU29ydENvbHVtbnMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2NvbHVtbnMtZGlzcGxheSc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlWydvQ29sdW1ucy1kaXNwbGF5J10gPSBjb25mWydvQ29sdW1ucy1kaXNwbGF5J107XG4gICAgICAgICAgICB0aGlzLnBhcnNlVmlzaWJsZUNvbHVtbnMoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVbJ3NlbGVjdC1jb2x1bW4tdmlzaWJsZSddID0gY29uZlsnc2VsZWN0LWNvbHVtbi12aXNpYmxlJ107XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVDaGVja2JveENvbHVtbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncXVpY2stZmlsdGVyJzpcbiAgICAgICAgICBjYXNlICdjb2x1bW5zLWZpbHRlcic6XG4gICAgICAgICAgICB0aGlzLnNldEZpbHRlcnNDb25maWd1cmF0aW9uKGNvbmYpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncGFnZSc6XG4gICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlID0gY29uZi5jdXJyZW50UGFnZTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBjb25mLmN1cnJlbnRQYWdlO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciA9IGNvbmYudG90YWxRdWVyeVJlY29yZHNOdW1iZXI7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSBjb25mLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5xdWVyeVJvd3MgPSBjb25mWydxdWVyeS1yb3dzJ107XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICB9XG4gIH1cblxuICBnZXRUaXRsZUFsaWduQ2xhc3Mob0NvbDogT0NvbHVtbikge1xuICAgIGxldCBhbGlnbjtcbiAgICBjb25zdCBoYXNUaXRsZUFsaWduID0gVXRpbC5pc0RlZmluZWQob0NvbC5kZWZpbml0aW9uKSAmJiBVdGlsLmlzRGVmaW5lZChvQ29sLmRlZmluaXRpb24udGl0bGVBbGlnbik7XG4gICAgY29uc3QgYXV0b0FsaWduID0gKHRoaXMuYXV0b0FsaWduVGl0bGVzICYmICFoYXNUaXRsZUFsaWduKSB8fCAoaGFzVGl0bGVBbGlnbiAmJiBvQ29sLmRlZmluaXRpb24udGl0bGVBbGlnbiA9PT0gQ29kZXMuQ09MVU1OX1RJVExFX0FMSUdOX0FVVE8pO1xuICAgIGlmICghYXV0b0FsaWduKSB7XG4gICAgICByZXR1cm4gb0NvbC5nZXRUaXRsZUFsaWduQ2xhc3MoKTtcbiAgICB9XG4gICAgc3dpdGNoIChvQ29sLnR5cGUpIHtcbiAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgY2FzZSAnYWN0aW9uJzpcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9DRU5URVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY3VycmVuY3knOlxuICAgICAgY2FzZSAnaW50ZWdlcic6XG4gICAgICBjYXNlICdyZWFsJzpcbiAgICAgIGNhc2UgJ3BlcmNlbnRhZ2UnOlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9FTkQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2VydmljZSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhbGlnbiA9IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9TVEFSVDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBhbGlnbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDZWxsQWxpZ25DbGFzcyhjb2x1bW46IE9Db2x1bW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZChjb2x1bW4uZGVmaW5pdGlvbikgJiYgVXRpbC5pc0RlZmluZWQoY29sdW1uLmRlZmluaXRpb24uY29udGVudEFsaWduKSA/ICdvLScgKyBjb2x1bW4uZGVmaW5pdGlvbi5jb250ZW50QWxpZ24gOiAnJztcbiAgfVxuXG4gIG9uVGFibGVTY3JvbGwoZSkge1xuICAgIGlmICh0aGlzLmhhc1Njcm9sbGFibGVDb250YWluZXIoKSkge1xuICAgICAgY29uc3QgdGFibGVWaWV3SGVpZ2h0ID0gZS50YXJnZXQub2Zmc2V0SGVpZ2h0OyAvLyB2aWV3cG9ydDogfjUwMHB4XG4gICAgICBjb25zdCB0YWJsZVNjcm9sbEhlaWdodCA9IGUudGFyZ2V0LnNjcm9sbEhlaWdodDsgLy8gbGVuZ3RoIG9mIGFsbCB0YWJsZVxuICAgICAgY29uc3Qgc2Nyb2xsTG9jYXRpb24gPSBlLnRhcmdldC5zY3JvbGxUb3A7IC8vIGhvdyBmYXIgdXNlciBzY3JvbGxlZFxuXG4gICAgICAvLyBJZiB0aGUgdXNlciBoYXMgc2Nyb2xsZWQgd2l0aGluIDIwMHB4IG9mIHRoZSBib3R0b20sIGFkZCBtb3JlIGRhdGFcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IDEwMDtcbiAgICAgIGNvbnN0IGxpbWl0X1NDUk9MTFZJUlRVQUwgPSB0YWJsZVNjcm9sbEhlaWdodCAtIHRhYmxlVmlld0hlaWdodCAtIGJ1ZmZlcjtcbiAgICAgIGlmIChzY3JvbGxMb2NhdGlvbiA+IGxpbWl0X1NDUk9MTFZJUlRVQUwpIHtcbiAgICAgICAgdGhpcy5nZXREYXRhU2Nyb2xsYWJsZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldERhdGFTY3JvbGxhYmxlKCk6IGFueSB7XG4gICAgY29uc3QgcGFnZVZpcnR1YWxCZWZvcmUgPSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsO1xuICAgIGNvbnN0IHBhZ2VWaXJ0dWFsRW5kID0gTWF0aC5jZWlsKHRoaXMuZGF0YVNvdXJjZS5yZXN1bHRzTGVuZ3RoIC8gQ29kZXMuTElNSVRfU0NST0xMVklSVFVBTCk7XG5cbiAgICBpZiAocGFnZVZpcnR1YWxFbmQgIT09IHRoaXMucGFnZVNjcm9sbFZpcnR1YWwpIHtcbiAgICAgIHRoaXMucGFnZVNjcm9sbFZpcnR1YWwrKztcbiAgICB9XG5cbiAgICAvLyB0aHJvdyBldmVudCBjaGFuZ2Ugc2Nyb2xsXG4gICAgaWYgKHBhZ2VWaXJ0dWFsQmVmb3JlICE9PSB0aGlzLnBhZ2VTY3JvbGxWaXJ0dWFsKSB7XG4gICAgICB0aGlzLmxvYWRpbmdTY3JvbGxTdWJqZWN0Lm5leHQodHJ1ZSk7XG4gICAgICB0aGlzLmRhdGFTb3VyY2UubG9hZERhdGFTY3JvbGxhYmxlID0gdGhpcy5wYWdlU2Nyb2xsVmlydHVhbDtcbiAgICB9XG4gIH1cblxuICBoYXNTY3JvbGxhYmxlQ29udGFpbmVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRhdGFTb3VyY2UgJiYgIXRoaXMucGFnaW5hdGlvbkNvbnRyb2xzICYmICF0aGlzLnBhZ2VhYmxlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZERlZmF1bHRSb3dCdXR0b25zKCkge1xuICAgIC8vIGNoZWNrIHBlcm1pc3Npb25zXG4gICAgaWYgKHRoaXMuZWRpdEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLmFkZEJ1dHRvbkluUm93KCdlZGl0QnV0dG9uSW5Sb3cnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGV0YWlsQnV0dG9uSW5Sb3cpIHtcbiAgICAgIHRoaXMuYWRkQnV0dG9uSW5Sb3coJ2RldGFpbEJ1dHRvbkluUm93Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFkZEJ1dHRvbkluUm93KG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGNvbERlZjogT0NvbHVtbiA9IHRoaXMuY3JlYXRlT0NvbHVtbihuYW1lLCB0aGlzKTtcbiAgICBjb2xEZWYudHlwZSA9IG5hbWU7XG4gICAgY29sRGVmLnZpc2libGUgPSB0cnVlO1xuICAgIGNvbERlZi5zZWFyY2hhYmxlID0gZmFsc2U7XG4gICAgY29sRGVmLm9yZGVyYWJsZSA9IGZhbHNlO1xuICAgIGNvbERlZi5yZXNpemFibGUgPSBmYWxzZTtcbiAgICBjb2xEZWYudGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgY29sRGVmLndpZHRoID0gJzQ4cHgnO1xuICAgIHRoaXMucHVzaE9Db2x1bW5EZWZpbml0aW9uKGNvbERlZik7XG4gICAgdGhpcy5fb1RhYmxlT3B0aW9ucy52aXNpYmxlQ29sdW1ucy5wdXNoKG5hbWUpO1xuICB9XG5cbiAgZ2V0IGhlYWRlckhlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gMDtcbiAgICBpZiAodGhpcy50YWJsZUhlYWRlckVsICYmIHRoaXMudGFibGVIZWFkZXJFbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBoZWlnaHQgKz0gdGhpcy50YWJsZUhlYWRlckVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBpZiAodGhpcy50YWJsZVRvb2xiYXJFbCAmJiB0aGlzLnRhYmxlVG9vbGJhckVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIGhlaWdodCArPSB0aGlzLnRhYmxlVG9vbGJhckVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICByZXR1cm4gaGVpZ2h0O1xuICB9XG5cbiAgaXNEZXRhaWxNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRldGFpbE1vZGUgIT09IENvZGVzLkRFVEFJTF9NT0RFX05PTkU7XG4gIH1cblxuICBjb3B5QWxsKCkge1xuICAgIFV0aWwuY29weVRvQ2xpcGJvYXJkKEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0UmVuZGVyZWRWYWx1ZSgpKSk7XG4gIH1cblxuICBjb3B5U2VsZWN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmRhdGFTb3VyY2UuZ2V0UmVuZGVyZWREYXRhKHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpKTtcbiAgICBVdGlsLmNvcHlUb0NsaXBib2FyZChKU09OLnN0cmluZ2lmeShzZWxlY3RlZEl0ZW1zKSk7XG4gIH1cblxuICB2aWV3RGV0YWlsKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRBY3Rpb25QZXJtaXNzaW9uKCdkZXRhaWwnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdXBlci52aWV3RGV0YWlsKGl0ZW0pO1xuICB9XG5cbiAgZWRpdERldGFpbChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tFbmFibGVkQWN0aW9uUGVybWlzc2lvbignZWRpdCcpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLmVkaXREZXRhaWwoaXRlbSk7XG4gIH1cblxuICBnZXRPQ29sdW1uRnJvbVRoKHRoOiBhbnkpOiBPQ29sdW1uIHtcbiAgICBsZXQgcmVzdWx0OiBPQ29sdW1uO1xuICAgIGNvbnN0IGNsYXNzTGlzdDogYW55W10gPSBbXS5zbGljZS5jYWxsKCh0aCBhcyBFbGVtZW50KS5jbGFzc0xpc3QpO1xuICAgIGNvbnN0IGNvbHVtbkNsYXNzID0gY2xhc3NMaXN0LmZpbmQoKGNsYXNzTmFtZTogc3RyaW5nKSA9PiAoY2xhc3NOYW1lLnN0YXJ0c1dpdGgoJ21hdC1jb2x1bW4tJykpKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uQ2xhc3MpKSB7XG4gICAgICByZXN1bHQgPSB0aGlzLmdldE9Db2x1bW4oY29sdW1uQ2xhc3Muc3Vic3RyKCdtYXQtY29sdW1uLScubGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRDb2x1bW5JbnNlcnRhYmxlKG5hbWUpOiBzdHJpbmcge1xuICAgIHJldHVybiBuYW1lICsgdGhpcy5nZXRTdWZmaXhDb2x1bW5JbnNlcnRhYmxlKCk7XG4gIH1cblxuICBpc1Jvd1NlbGVjdGVkKHJvdzogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzU2VsZWN0aW9uTW9kZU5vbmUoKSAmJiB0aGlzLnNlbGVjdGlvbi5pc1NlbGVjdGVkKHJvdyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29sdW1uc1dpZHRoRnJvbURPTSgpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy50YWJsZUhlYWRlckVsKSkge1xuICAgICAgW10uc2xpY2UuY2FsbCh0aGlzLnRhYmxlSGVhZGVyRWwubmF0aXZlRWxlbWVudC5jaGlsZHJlbikuZm9yRWFjaCh0aEVsID0+IHtcbiAgICAgICAgY29uc3Qgb0NvbDogT0NvbHVtbiA9IHRoaXMuZ2V0T0NvbHVtbkZyb21UaCh0aEVsKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG9Db2wpICYmIHRoRWwuY2xpZW50V2lkdGggPiAwICYmIG9Db2wuRE9NV2lkdGggIT09IHRoRWwuY2xpZW50V2lkdGgpIHtcbiAgICAgICAgICBvQ29sLkRPTVdpZHRoID0gdGhFbC5jbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVmcmVzaENvbHVtbnNXaWR0aCgpIHtcbiAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKGMgPT4gYy52aXNpYmxlKS5mb3JFYWNoKChjKSA9PiB7XG4gICAgICBjLkRPTVdpZHRoID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5nZXRDb2x1bW5zV2lkdGhGcm9tRE9NKCk7XG4gICAgICB0aGlzLl9vVGFibGVPcHRpb25zLmNvbHVtbnMuZmlsdGVyKGMgPT4gYy52aXNpYmxlKS5mb3JFYWNoKGMgPT4ge1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoYy5kZWZpbml0aW9uKSAmJiBVdGlsLmlzRGVmaW5lZChjLmRlZmluaXRpb24ud2lkdGgpICYmIHRoaXMuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgICAgIGMud2lkdGggPSBjLmRlZmluaXRpb24ud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgYy5nZXRSZW5kZXJXaWR0aCh0aGlzLmhvcml6b250YWxTY3JvbGwpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlT0NvbHVtbihhdHRyPzogc3RyaW5nLCB0YWJsZT86IE9UYWJsZUNvbXBvbmVudCwgY29sdW1uPzogT1RhYmxlQ29sdW1uQ29tcG9uZW50ICYgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCk6IE9Db2x1bW4ge1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IE9Db2x1bW4oKTtcbiAgICBpZiAoYXR0cikge1xuICAgICAgaW5zdGFuY2UuYXR0ciA9IGF0dHI7XG4gICAgfVxuICAgIGlmICh0YWJsZSkge1xuICAgICAgaW5zdGFuY2Uuc2V0RGVmYXVsdFByb3BlcnRpZXMoe1xuICAgICAgICBvcmRlcmFibGU6IHRoaXMub3JkZXJhYmxlLFxuICAgICAgICByZXNpemFibGU6IHRoaXMucmVzaXphYmxlXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGNvbHVtbikge1xuICAgICAgaW5zdGFuY2Uuc2V0Q29sdW1uUHJvcGVydGllcyhjb2x1bW4pO1xuICAgIH1cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cbn1cbiJdfQ==