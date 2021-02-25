import * as tslib_1 from "tslib";
import { Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Injector, Optional, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { InputConverter } from '../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../services/factories';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { DEFAULT_INPUTS_O_SERVICE_COMPONENT, OServiceComponent } from '../o-service-component.class';
import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';
export var DEFAULT_INPUTS_O_GRID = tslib_1.__spread(DEFAULT_INPUTS_O_SERVICE_COMPONENT, [
    'cols',
    'pageSizeOptions: page-size-options',
    'showPageSize: show-page-size',
    'showSort: orderable',
    'sortableColumns: sortable-columns',
    'sortColumn: sort-column',
    'quickFilterColumns: quick-filter-columns',
    'gridItemHeight: grid-item-height',
    'refreshButton: refresh-button',
    'paginationControls: pagination-controls',
    'gutterSize:gutter-size',
    'fixedHeader:fixed-header',
    'showFooter:show-footer'
]);
export var DEFAULT_OUTPUTS_O_GRID = [
    'onClick',
    'onDoubleClick',
    'onDataLoaded',
    'onPaginatedDataLoaded'
];
var PAGE_SIZE_OPTIONS = [8, 16, 24, 32, 64];
var OGridComponent = (function (_super) {
    tslib_1.__extends(OGridComponent, _super);
    function OGridComponent(injector, elRef, form) {
        var _this = _super.call(this, injector, elRef, form) || this;
        _this.queryRows = 32;
        _this.fixedHeader = false;
        _this.showPageSize = false;
        _this.showSort = false;
        _this.showFooter = true;
        _this.gridItemHeight = '1:1';
        _this.refreshButton = true;
        _this.paginationControls = false;
        _this.gutterSize = '1px';
        _this.onClick = new EventEmitter();
        _this.onDoubleClick = new EventEmitter();
        _this.onDataLoaded = new EventEmitter();
        _this.onPaginatedDataLoaded = new EventEmitter();
        _this._sortableColumns = [];
        _this._colsDefault = 1;
        _this._pageSizeOptions = PAGE_SIZE_OPTIONS;
        _this.dataResponseArray = [];
        _this.storePaginationState = false;
        _this._gridItems = [];
        _this._currentPage = 0;
        _this.subscription = new Subscription();
        _this.media = _this.injector.get(MediaObserver);
        return _this;
    }
    Object.defineProperty(OGridComponent.prototype, "cols", {
        get: function () {
            return this._cols || this._colsDefault;
        },
        set: function (value) {
            this._cols = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OGridComponent.prototype, "pageSizeOptions", {
        get: function () {
            return this._pageSizeOptions;
        },
        set: function (val) {
            if (!(val instanceof Array)) {
                val = Util.parseArray(String(val)).map(function (a) { return parseInt(a, 10); });
            }
            this._pageSizeOptions = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OGridComponent.prototype, "sortableColumns", {
        get: function () {
            return this._sortableColumns;
        },
        set: function (val) {
            var parsed = [];
            if (!Util.isArray(val)) {
                parsed = ServiceUtils.parseSortColumns(String(val));
            }
            this._sortableColumns = parsed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OGridComponent.prototype, "gridItems", {
        get: function () {
            return this._gridItems;
        },
        set: function (value) {
            this._gridItems = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OGridComponent.prototype, "currentPage", {
        get: function () {
            return this._currentPage;
        },
        set: function (val) {
            this._currentPage = val;
        },
        enumerable: true,
        configurable: true
    });
    OGridComponent.prototype.ngOnInit = function () {
        this.initialize();
    };
    OGridComponent.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        if (this.state.hasOwnProperty('sort-column')) {
            this.sortColumn = this.state['sort-column'];
        }
        this.parseSortColumn();
        var existingOption = this.pageSizeOptions.find(function (option) { return option === _this.queryRows; });
        if (!Util.isDefined(existingOption)) {
            this._pageSizeOptions.push(this.queryRows);
            this._pageSizeOptions.sort(function (i, j) { return i - j; });
        }
        if (!Util.isDefined(this.quickFilterColumns)) {
            this.quickFilterColumns = this.columns;
        }
        this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
        if (this.state.hasOwnProperty('currentPage')) {
            this.currentPage = this.state['currentPage'];
        }
        if (this.queryOnInit) {
            this.queryData();
        }
    };
    OGridComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.afterViewInit.call(this);
        this.setGridItemDirectivesData();
        if (this.searchInputComponent) {
            this.registerQuickFilter(this.searchInputComponent);
        }
        this.subscribeToMediaChanges();
    };
    OGridComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.gridItems = this.inputGridItems.toArray();
        this.subscription.add(this.inputGridItems.changes.subscribe(function (queryChanges) {
            _this.gridItems = queryChanges._results;
        }));
    };
    OGridComponent.prototype.subscribeToMediaChanges = function () {
        var _this = this;
        this.subscription.add(this.media.asObservable().subscribe(function (change) {
            if (change && change[0]) {
                switch (change[0].mqAlias) {
                    case 'xs':
                    case 'sm':
                        _this._colsDefault = 1;
                        break;
                    case 'md':
                        _this._colsDefault = 2;
                        break;
                    case 'lg':
                    case 'xl':
                        _this._colsDefault = 4;
                }
            }
        }));
    };
    OGridComponent.prototype.reloadData = function () {
        var queryArgs = {};
        if (this.pageable) {
            this.state.queryRecordOffset = 0;
            queryArgs = {
                offset: this.paginationControls ? (this.currentPage * this.queryRows) : 0,
                length: Math.max(this.queryRows, this.dataResponseArray.length),
                replace: true
            };
        }
        this.queryData(void 0, queryArgs);
    };
    OGridComponent.prototype.reloadPaginatedDataFromStart = function () {
        this.currentPage = 0;
        this.dataResponseArray = [];
        this.reloadData();
    };
    OGridComponent.prototype.setDataArray = function (data) {
        if (Util.isArray(data)) {
            this.dataResponseArray = data;
        }
        else if (Util.isObject(data)) {
            this.dataResponseArray = [data];
        }
        else {
            console.warn('Component has received not supported service data. Supported data are Array or Object');
            this.dataResponseArray = [];
        }
        this.filterData();
    };
    OGridComponent.prototype.filterData = function (value, loadMore) {
        value = Util.isDefined(value) ? value : Util.isDefined(this.quickFilterComponent) ? this.quickFilterComponent.getValue() : void 0;
        if (this.state && Util.isDefined(value)) {
            this.state.filterValue = value;
        }
        if (this.pageable) {
            var queryArgs = {
                offset: 0,
                length: this.queryRows,
                replace: true
            };
            this.queryData(void 0, queryArgs);
            return;
        }
        if (this.dataResponseArray && this.dataResponseArray.length > 0) {
            var filteredData = this.dataResponseArray.slice(0);
            if (value && value.length > 0) {
                var caseSensitive_1 = this.isFilterCaseSensitive();
                var self_1 = this;
                filteredData = filteredData.filter(function (item) {
                    return self_1.getQuickFilterColumns().some(function (col) {
                        var regExpStr = Util.escapeSpecialCharacter(Util.normalizeString(value, !caseSensitive_1));
                        return new RegExp(regExpStr).test(Util.normalizeString(item[col] + '', !caseSensitive_1));
                    });
                });
            }
            if (Util.isDefined(this.sortColumnOrder)) {
                var sort_1 = this.sortColumnOrder;
                var factor_1 = (sort_1.ascendent ? 1 : -1);
                filteredData.sort(function (a, b) {
                    var aOp = isNaN(a[sort_1.columnName]) ? Util.normalizeString(a[sort_1.columnName]) : a[sort_1.columnName];
                    var bOp = isNaN(b[sort_1.columnName]) ? Util.normalizeString(b[sort_1.columnName]) : b[sort_1.columnName];
                    return (aOp > bOp) ? (1 * factor_1) : (bOp > aOp) ? (-1 * factor_1) : 0;
                });
            }
            if (this.paginationControls) {
                this.dataArray = filteredData.splice(this.currentPage * this.queryRows, this.queryRows);
            }
            else {
                this.dataArray = filteredData.splice(0, this.queryRows * (this.currentPage + 1));
            }
        }
        else {
            this.dataArray = this.dataResponseArray;
        }
    };
    OGridComponent.prototype.registerGridItemDirective = function (item) {
        if (item) {
            var self_2 = this;
            if (self_2.detailMode === Codes.DETAIL_MODE_CLICK) {
                item.onClick(function (gridItem) { return self_2.onItemDetailClick(gridItem); });
            }
            if (Codes.isDoubleClickMode(self_2.detailMode)) {
                item.onDoubleClick(function (gridItem) { return self_2.onItemDetailDblClick(gridItem); });
            }
        }
    };
    OGridComponent.prototype.onItemDetailClick = function (item) {
        if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(item.getItemData());
            ObservableWrapper.callEmit(this.onClick, item);
        }
    };
    OGridComponent.prototype.onItemDetailDblClick = function (item) {
        if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(item.getItemData());
            ObservableWrapper.callEmit(this.onDoubleClick, item);
        }
    };
    OGridComponent.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    OGridComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    OGridComponent.prototype.loadMore = function () {
        this.currentPage += 1;
        if (this.pageable) {
            var queryArgs = {
                offset: this.state.queryRecordOffset,
                length: this.queryRows
            };
            this.queryData(void 0, queryArgs);
        }
        else {
            this.filterData(void 0, true);
        }
    };
    Object.defineProperty(OGridComponent.prototype, "totalRecords", {
        get: function () {
            if (this.pageable) {
                return this.getTotalRecordsNumber();
            }
            return this.dataResponseArray.length;
        },
        enumerable: true,
        configurable: true
    });
    OGridComponent.prototype.getQueryArguments = function (filter, ovrrArgs) {
        var queryArguments = _super.prototype.getQueryArguments.call(this, filter, ovrrArgs);
        if (this.pageable && Util.isDefined(this.sortColumn)) {
            queryArguments[6] = this.sortColumnOrder ? [this.sortColumnOrder] : this.sortColumnOrder;
        }
        return queryArguments;
    };
    OGridComponent.prototype.parseSortColumn = function () {
        var parsed = (ServiceUtils.parseSortColumns(this.sortColumn) || [])[0];
        var exists = parsed ? this.sortableColumns.find(function (item) { return (item.columnName === parsed.columnName) && (item.ascendent === parsed.ascendent); }) : false;
        if (exists) {
            this.sortColumnOrder = parsed;
        }
    };
    Object.defineProperty(OGridComponent.prototype, "currentOrderColumn", {
        get: function () {
            var _this = this;
            if (!Util.isDefined(this.sortColumnOrder)) {
                return undefined;
            }
            var index;
            this.sortableColumns.forEach(function (item, i) {
                if ((item.columnName === _this.sortColumnOrder.columnName) &&
                    (item.ascendent === _this.sortColumnOrder.ascendent)) {
                    index = i;
                }
            });
            return index;
        },
        set: function (val) {
            this.sortColumnOrder = this.sortableColumns[val];
        },
        enumerable: true,
        configurable: true
    });
    OGridComponent.prototype.onChangePage = function (e) {
        if (!this.pageable) {
            this.currentPage = e.pageIndex;
            this.queryRows = e.pageSize;
            this.filterData();
            return;
        }
        var tableState = this.state;
        var goingBack = e.pageIndex < this.currentPage;
        this.currentPage = e.pageIndex;
        var pageSize = e.pageSize;
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
        this.queryData(void 0, queryArgs);
    };
    OGridComponent.prototype.getDataToStore = function () {
        var dataToStore = _super.prototype.getDataToStore.call(this);
        dataToStore['currentPage'] = this.currentPage;
        if (this.storePaginationState) {
            dataToStore['queryRecordOffset'] = Math.max((this.state.queryRecordOffset - this.dataArray.length), (this.state.queryRecordOffset - this.queryRows));
        }
        else {
            delete dataToStore['queryRecordOffset'];
        }
        if (Util.isDefined(this.sortColumnOrder)) {
            dataToStore['sort-column'] = this.sortColumnOrder.columnName + Codes.COLUMNS_ALIAS_SEPARATOR +
                (this.sortColumnOrder.ascendent ? Codes.ASC_SORT : Codes.DESC_SORT);
        }
        return dataToStore;
    };
    OGridComponent.prototype.getSortOptionText = function (col) {
        var result;
        var colTextKey = "GRID.SORT_BY_" + col.columnName.toUpperCase() + "_" + (col.ascendent ? 'ASC' : 'DESC');
        result = this.translateService.get(colTextKey);
        if (result !== colTextKey) {
            return result;
        }
        colTextKey = 'GRID.SORT_BY_' + (col.ascendent ? 'ASC' : 'DESC');
        result = this.translateService.get(colTextKey, [(this.translateService.get(col.columnName) || '')]);
        return result;
    };
    OGridComponent.prototype.setData = function (data, sqlTypes, replace) {
        if (Util.isArray(data)) {
            var dataArray = data;
            var respDataArray = data;
            if (!replace) {
                if (this.pageable) {
                    dataArray = this.paginationControls ? data : (this.dataArray || []).concat(data);
                    respDataArray = this.paginationControls ? data : (this.dataResponseArray || []).concat(data);
                }
                else {
                    dataArray = data.slice(this.paginationControls ? ((this.queryRows * (this.currentPage + 1)) - this.queryRows) : 0, this.queryRows * (this.currentPage + 1));
                    respDataArray = data;
                }
            }
            this.dataArray = dataArray;
            this.dataResponseArray = respDataArray;
            if (!this.pageable) {
                this.filterData();
            }
        }
        else {
            this.dataArray = [];
            this.dataResponseArray = [];
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        if (this.pageable) {
            ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
        }
        ObservableWrapper.callEmit(this.onDataLoaded, this.dataResponseArray);
    };
    OGridComponent.prototype.saveDataNavigationInLocalStorage = function () {
        _super.prototype.saveDataNavigationInLocalStorage.call(this);
        this.storePaginationState = true;
    };
    OGridComponent.prototype.setGridItemDirectivesData = function () {
        var _this = this;
        var self = this;
        this.gridItemDirectives.changes.subscribe(function () {
            _this.gridItemDirectives.toArray().forEach(function (element, index) {
                element.setItemData(self.dataArray[index]);
                element.setGridComponent(self);
                self.registerGridItemDirective(element);
            });
        });
    };
    OGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-grid',
                    providers: [
                        OntimizeServiceProvider
                    ],
                    inputs: DEFAULT_INPUTS_O_GRID,
                    outputs: DEFAULT_OUTPUTS_O_GRID,
                    template: "<div [style.display]=\"isVisible()? '' : 'none'\" class=\"o-grid-container\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\">\n  <!--TOOLBAR-->\n  <mat-toolbar *ngIf=\"hasControls()\" class=\"o-grid-toolbar\">\n    <div class=\"mat-toolbar-tools\" fxLayout=\"row\" fxLayoutAlign=\"start center\" fxLayoutGap=\"8px\" fxFill>\n      <!--button refresh-->\n      <button type=\"button\" mat-icon-button aria-label=\"Refresh\" (click)=\"reloadData()\" *ngIf=\"refreshButton\">\n        <mat-icon svgIcon=\"ontimize:autorenew\"></mat-icon>\n      </button>\n\n      <!--O-GRID-PAGINATOR-->\n      <div class=\"o-grid-paginator\" *ngIf=\"showPageSize\">\n        <div class=\"o-grid-page-size-label\">{{ 'GRID.ITEMS_PER_PAGE' | oTranslate }}:</div>\n        <mat-form-field class=\"o-grid-select-page\" floatLabel=\"never\">\n          <mat-select placeholder=\"\" #pageSizeSelect [(value)]=\"queryRows\" (selectionChange)=\"reloadData()\">\n            <mat-option *ngFor=\"let page of pageSizeOptions\" [value]=\"page\">\n              {{ page }}\n            </mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n\n      <!--O-GRID-SORT-->\n      <div class=\"o-grid-sort\" *ngIf=\"showSort && sortableColumns.length > 0\">\n        <mat-form-field class=\"o-grid-select-sort\" floatLabel=\"never\">\n          <mat-icon matPrefix>sort</mat-icon>\n          <mat-select #sortSelect [(value)]=\"currentOrderColumn\" (selectionChange)=\"reloadData()\" placeholder=\" {{ 'GRID.SORT_BY' | oTranslate }}\">\n            <mat-option *ngFor=\"let column of sortableColumns; let i = index\" [value]=\"i\">\n              {{ getSortOptionText(column) }}\n            </mat-option>\n          </mat-select>\n        </mat-form-field>\n      </div>\n\n      <div fxLayoutAlign=\"center center\" fxFlex>\n        <span *ngIf=\"hasTitle()\" fxLayoutAlign=\"center center\">{{ title | oTranslate }}</span>\n      </div>\n      <o-search-input *ngIf=\"quickFilter\" [columns]=\"quickFilterColumns\" [filter-case-sensitive]=\"filterCaseSensitive\" \n        [show-case-sensitive-checkbox]=\"showCaseSensitiveCheckbox()\" placeholder=\"\" appearance=\"legacy\"></o-search-input>\n    </div>\n  </mat-toolbar>\n\n  <!--no results-->\n  <div class=\"o-grid-no-results fill-remaining\" *ngIf=\"gridItems.length === 0\" fxLayoutAlign=\"center start\" layout-padding>\n    {{'GRID.EMPTY' | oTranslate}}\n    <ng-container *ngIf=\"quickFilter && searchInputComponent && searchInputComponent.getValue() && searchInputComponent.getValue().length > 0\">\n      {{ 'GRID.EMPTY_USING_FILTER' | oTranslate : { values: [ searchInputComponent.getValue()] } }}\n    </ng-container>\n  </div>\n\n  <!--MAT-GRID-LIST-->\n  <mat-grid-list [cols]=\"cols\" [gutterSize]=\"gutterSize\" [rowHeight]=\"gridItemHeight\" class=\"o-mat-grid-list fill-remaining\"\n    *ngIf=\"gridItems.length > 0\">\n    <mat-grid-tile o-grid-item *ngFor=\"let item of gridItems\" [colspan]=\"item.colspan\" [rowspan]=\"item.rowspan\">\n      <ng-container *ngTemplateOutlet=\"item.template\"></ng-container>\n    </mat-grid-tile>\n  </mat-grid-list>\n\n  <!-- GRID FOOTER -->\n  <div *ngIf=\"!paginationControls && showFooter\" fxLayout=\"row\" fxLayoutAlign=\"center center\" class=\"o-grid-footer\">\n    <button type=\"button\" mat-button *ngIf=\"getDataArray().length < totalRecords\" (click)=\"loadMore()\" class=\"mat-raised-button\">\n      {{ 'GRID.BUTTON_NEXT' | oTranslate }}\n    </button>\n    <span fxFlex></span>\n    <span class=\"o-grid-totals\">{{ 'GRID.TEXT_SHOWN_ITEMS' | oTranslate :{values: [getDataArray().length, totalRecords]} }}</span>\n  </div>\n\n  <mat-paginator class=\"o-mat-paginator\" #paginator *ngIf=\"paginationControls && showFooter\" [length]=\"totalRecords\" [pageSize]=\"queryRows\"\n    [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"currentPage\" [showFirstLastButtons]=\"true\" (page)=\"onChangePage($event)\"></mat-paginator>\n\n  <div *ngIf=\"loading | async\" fxLayout=\"row\" fxLayoutAlign=\"center end\" class=\"o-loading-blocker\">\n    <div fxLayoutAlign=\"center center\" [class.o-spinner-container-controls]=\"hasControls()\" class=\"o-spinner-container\">\n      <mat-progress-spinner mode=\"indeterminate\" strokeWidth=\"3\"></mat-progress-spinner>\n    </div>\n  </div>\n\n</div>\n",
                    host: {
                        '[class.o-grid]': 'true',
                        '[class.o-grid-fixed]': 'fixedHeader',
                    },
                    styles: [":host.o-grid{height:100%}:host.o-grid .o-grid-container{position:relative;height:100%;display:flex}:host.o-grid .o-grid-container .o-grid-toolbar{flex:0 0 auto}:host.o-grid .o-grid-container .o-grid-no-results{padding:16px}:host.o-grid .o-grid-container .o-grid-paginator,:host.o-grid .o-grid-container .o-grid-sort{font-size:.8em;margin-right:1em}:host.o-grid .o-grid-container .o-grid-paginator{display:flex}:host.o-grid .o-grid-container .o-grid-paginator .o-grid-select-page{width:60px}:host.o-grid .o-grid-container .o-grid-paginator .o-grid-page-size-label{margin:0 4px 0 8px;align-self:center}:host.o-grid .o-grid-container .o-grid-footer .o-grid-totals{margin-right:8px;font-size:14px}:host.o-grid .o-grid-container .o-grid-footer,:host.o-grid .o-grid-container .o-mat-paginator{flex-shrink:0}:host.o-grid .o-grid-container .o-loading-blocker{position:absolute;top:0;left:0;right:0;bottom:0;z-index:500;visibility:visible;opacity:1;transition:opacity .25s linear}:host.o-grid .o-grid-container .o-loading-blocker .o-spinner-container{width:100%;height:100%}:host.o-grid .o-grid-container .o-loading-blocker .o-spinner-container.o-spinner-container-controls{height:calc(100% - 64px)}:host.o-grid.o-grid-fixed{max-height:100%;height:100%}:host.o-grid.o-grid-fixed .o-grid-container{max-height:100%;height:100%}:host.o-grid.o-grid-fixed .o-mat-grid-list{overflow:auto;padding-bottom:0!important}:host.o-grid.o-grid-fixed .o-grid-footer,:host.o-grid.o-grid-fixed .o-mat-paginator{flex:0 0 auto}"]
                }] }
    ];
    OGridComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] }
    ]; };
    OGridComponent.propDecorators = {
        inputGridItems: [{ type: ContentChildren, args: [forwardRef(function () { return OGridItemComponent; }),] }],
        gridItemDirectives: [{ type: ViewChildren, args: [OGridItemDirective,] }],
        matpaginator: [{ type: ViewChild, args: [MatPaginator, { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OGridComponent.prototype, "fixedHeader", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OGridComponent.prototype, "showPageSize", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OGridComponent.prototype, "showSort", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OGridComponent.prototype, "showFooter", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OGridComponent.prototype, "refreshButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OGridComponent.prototype, "paginationControls", void 0);
    return OGridComponent;
}(OServiceComponent));
export { OGridComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ncmlkL28tZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBSVIsUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVwQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3JHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXZFLE1BQU0sQ0FBQyxJQUFNLHFC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cEQ7U0E3ZFksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWVkaWFDaGFuZ2UsIE1lZGlhT2JzZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5pbXBvcnQgeyBNYXRQYWdpbmF0b3IsIFBhZ2VFdmVudCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElHcmlkSXRlbSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1ncmlkLWl0ZW0uaW50ZXJmYWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZmFjdG9yaWVzJztcbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuaW1wb3J0IHsgU1FMT3JkZXIgfSBmcm9tICcuLi8uLi90eXBlcy9zcWwtb3JkZXIudHlwZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQsIE9TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPR3JpZEl0ZW1Db21wb25lbnQgfSBmcm9tICcuL2dyaWQtaXRlbS9vLWdyaWQtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0dyaWRJdGVtRGlyZWN0aXZlIH0gZnJvbSAnLi9ncmlkLWl0ZW0vby1ncmlkLWl0ZW0uZGlyZWN0aXZlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fR1JJRCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0NPTVBPTkVOVCxcbiAgLy8gY29sczogQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQgbGlzdC4gRGVmYXVsdCBpbiBleHRyYSBzbWFsbCBhbmQgc21hbGwgc2NyZWVuIGlzIDEsIGluIG1lZGl1bSBzY3JlZW4gaXMgMiwgaW4gbGFyZ2Ugc2NyZWVuIGlzIDMgYW5kIGV4dHJhIGxhcmdlIHNjcmVlbiBpcyA0LlxuICAnY29scycsXG4gIC8vIHBhZ2Utc2l6ZS1vcHRpb25zIFtzdHJpbmddOiBQYWdlIHNpemUgb3B0aW9ucyBzZXBhcmF0ZWQgYnkgJzsnLlxuICAncGFnZVNpemVPcHRpb25zOiBwYWdlLXNpemUtb3B0aW9ucycsXG4gIC8vIHNob3ctcGFnZS1zaXplOldoZXRoZXIgdG8gaGlkZSB0aGUgcGFnZSBzaXplIHNlbGVjdGlvbiBVSSBmcm9tIHRoZSB1c2VyLlxuICAnc2hvd1BhZ2VTaXplOiBzaG93LXBhZ2Utc2l6ZScsXG4gIC8vIHNob3ctc29ydDp3aGV0aGVyIG9yIG5vdCB0aGUgc29ydCBzZWxlY3QgaXMgc2hvd24gaW4gdGhlIHRvb2xiYXJcbiAgJ3Nob3dTb3J0OiBvcmRlcmFibGUnLFxuICAvLyBzb3J0YWJsZVtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBmaWx0ZXIsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc29ydGFibGVDb2x1bW5zOiBzb3J0YWJsZS1jb2x1bW5zJyxcbiAgLy8gc29ydENvbHVtbnNbc3RyaW5nXTogY29sdW1ucyBvZiB0aGUgc29ydGluZ2NvbHVtbnMsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc29ydENvbHVtbjogc29ydC1jb2x1bW4nLFxuICAvLyBxdWljay1maWx0ZXItY29sdW1ucyBbc3RyaW5nXTogY29sdW1ucyBvZiB0aGUgZmlsdGVyLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3F1aWNrRmlsdGVyQ29sdW1uczogcXVpY2stZmlsdGVyLWNvbHVtbnMnLFxuICAvLyAgZ3JpZC1pdGVtLWhlaWdodFtzdHJpbmddOiBTZXQgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2Ygcm93IGhlaWdodCBmcm9tIHRoZSB1c2VyLXByb3ZpZGVkIHZhbHVlLi4gRGVmYXVsdDogMToxLlxuICAnZ3JpZEl0ZW1IZWlnaHQ6IGdyaWQtaXRlbS1oZWlnaHQnLFxuICAvLyByZWZyZXNoLWJ1dHRvbiBbbm98eWVzXTogc2hvdyByZWZyZXNoIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAncmVmcmVzaEJ1dHRvbjogcmVmcmVzaC1idXR0b24nLFxuICAvLyBwYWdpbmF0aW9uLWNvbnRyb2xzIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgcGFnaW5hdGlvbiBjb250cm9scy4gRGVmYXVsdDogbm8uXG4gICdwYWdpbmF0aW9uQ29udHJvbHM6IHBhZ2luYXRpb24tY29udHJvbHMnLFxuICAvLyBndXR0ZXJTaXplOiBTaXplIG9mIHRoZSBncmlkIGxpc3QncyBndXR0ZXIgaW4gcGl4ZWxzLlxuICAnZ3V0dGVyU2l6ZTpndXR0ZXItc2l6ZScsXG4gIC8vIGZpeC1oZWFkZXIgW3llc3xub3x0cnVlfGZhbHNlXTogZml4ZWQgZm9vdGVyIHdoZW4gdGhlIGNvbnRlbnQgaXMgZ3JlYXRoZXIgdGhhbiBpdHMgb3duIGhlaWdodC4gRGVmYXVsdDogbm8uXG4gICdmaXhlZEhlYWRlcjpmaXhlZC1oZWFkZXInLFxuICAvLyBzaG93LWZvb3RlcjpJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gc2hvdyB0aGUgZm9vdGVyOkRlZmF1bHQ6dHJ1ZVxuICAnc2hvd0Zvb3RlcjpzaG93LWZvb3Rlcidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19HUklEID0gW1xuICAnb25DbGljaycsXG4gICdvbkRvdWJsZUNsaWNrJyxcbiAgJ29uRGF0YUxvYWRlZCcsXG4gICdvblBhZ2luYXRlZERhdGFMb2FkZWQnXG5dO1xuXG5jb25zdCBQQUdFX1NJWkVfT1BUSU9OUyA9IFs4LCAxNiwgMjQsIDMyLCA2NF07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZ3JpZCcsXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplU2VydmljZVByb3ZpZGVyXG4gIF0sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19HUklELFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19HUklELFxuICB0ZW1wbGF0ZVVybDogJy4vby1ncmlkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1ncmlkLmNvbXBvbmVudC5zY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZ3JpZF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLWdyaWQtZml4ZWRdJzogJ2ZpeGVkSGVhZGVyJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPR3JpZENvbXBvbmVudCBleHRlbmRzIE9TZXJ2aWNlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cbiAgLyogSW5wdXRzICovXG4gIHB1YmxpYyBxdWVyeVJvd3M6IG51bWJlciA9IDMyO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBmaXhlZEhlYWRlcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93UGFnZVNpemU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2hvd1NvcnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2hvd0Zvb3RlcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHVibGljIGdyaWRJdGVtSGVpZ2h0ID0gJzE6MSc7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHJlZnJlc2hCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBwYWdpbmF0aW9uQ29udHJvbHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgZ3V0dGVyU2l6ZSA9ICcxcHgnO1xuXG4gIGdldCBjb2xzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHMgfHwgdGhpcy5fY29sc0RlZmF1bHQ7XG4gIH1cbiAgc2V0IGNvbHModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2NvbHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwYWdlU2l6ZU9wdGlvbnMoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9wYWdlU2l6ZU9wdGlvbnM7XG4gIH1cbiAgc2V0IHBhZ2VTaXplT3B0aW9ucyh2YWw6IG51bWJlcltdKSB7XG4gICAgaWYgKCEodmFsIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICB2YWwgPSBVdGlsLnBhcnNlQXJyYXkoU3RyaW5nKHZhbCkpLm1hcChhID0+IHBhcnNlSW50KGEsIDEwKSk7XG4gICAgfVxuICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucyA9IHZhbDtcbiAgfVxuXG4gIGdldCBzb3J0YWJsZUNvbHVtbnMoKTogU1FMT3JkZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnRhYmxlQ29sdW1ucztcbiAgfVxuICBzZXQgc29ydGFibGVDb2x1bW5zKHZhbCkge1xuICAgIGxldCBwYXJzZWQgPSBbXTtcbiAgICBpZiAoIVV0aWwuaXNBcnJheSh2YWwpKSB7XG4gICAgICBwYXJzZWQgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyhTdHJpbmcodmFsKSk7XG4gICAgfVxuICAgIHRoaXMuX3NvcnRhYmxlQ29sdW1ucyA9IHBhcnNlZDtcbiAgfVxuXG4gIHB1YmxpYyBxdWlja0ZpbHRlckNvbHVtbnM6IHN0cmluZztcbiAgLyogRW5kIElucHV0cyAqL1xuXG4gIHB1YmxpYyBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRG91YmxlQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUGFnaW5hdGVkRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihmb3J3YXJkUmVmKCgpID0+IE9HcmlkSXRlbUNvbXBvbmVudCkpXG4gIHB1YmxpYyBpbnB1dEdyaWRJdGVtczogUXVlcnlMaXN0PE9HcmlkSXRlbUNvbXBvbmVudD47XG4gIEBWaWV3Q2hpbGRyZW4oT0dyaWRJdGVtRGlyZWN0aXZlKVxuICBwdWJsaWMgZ3JpZEl0ZW1EaXJlY3RpdmVzOiBRdWVyeUxpc3Q8T0dyaWRJdGVtRGlyZWN0aXZlPjtcbiAgQFZpZXdDaGlsZChNYXRQYWdpbmF0b3IsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgbWF0cGFnaW5hdG9yOiBNYXRQYWdpbmF0b3I7XG5cbiAgLyogUGFyc2VkIElucHV0cyAqL1xuICBwcm90ZWN0ZWQgX3NvcnRhYmxlQ29sdW1uczogU1FMT3JkZXJbXSA9IFtdO1xuICBwcm90ZWN0ZWQgc29ydENvbHVtbk9yZGVyOiBTUUxPcmRlcjtcbiAgLyogRW5kIHBhcnNlZCBJbnB1dHMgKi9cblxuICBwcm90ZWN0ZWQgX2NvbHM7XG4gIHByb3RlY3RlZCBfY29sc0RlZmF1bHQgPSAxO1xuICBwcm90ZWN0ZWQgX3BhZ2VTaXplT3B0aW9ucyA9IFBBR0VfU0laRV9PUFRJT05TO1xuICBwcm90ZWN0ZWQgc29ydENvbHVtbjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGF0YVJlc3BvbnNlQXJyYXk6IGFueVtdID0gW107XG4gIHByb3RlY3RlZCBzdG9yZVBhZ2luYXRpb25TdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHNldCBncmlkSXRlbXModmFsdWU6IElHcmlkSXRlbVtdKSB7XG4gICAgdGhpcy5fZ3JpZEl0ZW1zID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZ3JpZEl0ZW1zKCk6IElHcmlkSXRlbVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZ3JpZEl0ZW1zO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9ncmlkSXRlbXM6IElHcmlkSXRlbVtdID0gW107XG5cbiAgc2V0IGN1cnJlbnRQYWdlKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fY3VycmVudFBhZ2UgPSB2YWw7XG4gIH1cblxuICBnZXQgY3VycmVudFBhZ2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFBhZ2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2N1cnJlbnRQYWdlOiBudW1iZXIgPSAwO1xuXG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgcHJvdGVjdGVkIG1lZGlhOiBNZWRpYU9ic2VydmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudFxuICApIHtcbiAgICBzdXBlcihpbmplY3RvciwgZWxSZWYsIGZvcm0pO1xuICAgIHRoaXMubWVkaWEgPSB0aGlzLmluamVjdG9yLmdldChNZWRpYU9ic2VydmVyKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdzb3J0LWNvbHVtbicpKSB7XG4gICAgICB0aGlzLnNvcnRDb2x1bW4gPSB0aGlzLnN0YXRlWydzb3J0LWNvbHVtbiddO1xuICAgIH1cblxuICAgIHRoaXMucGFyc2VTb3J0Q29sdW1uKCk7XG5cbiAgICBjb25zdCBleGlzdGluZ09wdGlvbiA9IHRoaXMucGFnZVNpemVPcHRpb25zLmZpbmQob3B0aW9uID0+IG9wdGlvbiA9PT0gdGhpcy5xdWVyeVJvd3MpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQoZXhpc3RpbmdPcHRpb24pKSB7XG4gICAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMucHVzaCh0aGlzLnF1ZXJ5Um93cyk7XG4gICAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMuc29ydCgoaTogbnVtYmVyLCBqOiBudW1iZXIpID0+IGkgLSBqKTtcbiAgICB9XG5cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucXVpY2tGaWx0ZXJDb2x1bW5zKSkge1xuICAgICAgdGhpcy5xdWlja0ZpbHRlckNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgfVxuICAgIHRoaXMucXVpY2tGaWx0ZXJDb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnF1aWNrRmlsdGVyQ29sdW1ucywgdHJ1ZSk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnY3VycmVudFBhZ2UnKSkge1xuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMuc3RhdGVbJ2N1cnJlbnRQYWdlJ107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVlcnlPbkluaXQpIHtcbiAgICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5hZnRlclZpZXdJbml0KCk7XG4gICAgdGhpcy5zZXRHcmlkSXRlbURpcmVjdGl2ZXNEYXRhKCk7XG4gICAgaWYgKHRoaXMuc2VhcmNoSW5wdXRDb21wb25lbnQpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJRdWlja0ZpbHRlcih0aGlzLnNlYXJjaElucHV0Q29tcG9uZW50KTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVUb01lZGlhQ2hhbmdlcygpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmdyaWRJdGVtcyA9IHRoaXMuaW5wdXRHcmlkSXRlbXMudG9BcnJheSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZCh0aGlzLmlucHV0R3JpZEl0ZW1zLmNoYW5nZXMuc3Vic2NyaWJlKHF1ZXJ5Q2hhbmdlcyA9PiB7XG4gICAgICB0aGlzLmdyaWRJdGVtcyA9IHF1ZXJ5Q2hhbmdlcy5fcmVzdWx0cztcbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgc3Vic2NyaWJlVG9NZWRpYUNoYW5nZXMoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMubWVkaWEuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKChjaGFuZ2U6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAgICAgIGlmIChjaGFuZ2UgJiYgY2hhbmdlWzBdKSB7XG4gICAgICAgIHN3aXRjaCAoY2hhbmdlWzBdLm1xQWxpYXMpIHtcbiAgICAgICAgICBjYXNlICd4cyc6XG4gICAgICAgICAgY2FzZSAnc20nOlxuICAgICAgICAgICAgdGhpcy5fY29sc0RlZmF1bHQgPSAxO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbWQnOlxuICAgICAgICAgICAgdGhpcy5fY29sc0RlZmF1bHQgPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbGcnOlxuICAgICAgICAgIGNhc2UgJ3hsJzpcbiAgICAgICAgICAgIHRoaXMuX2NvbHNEZWZhdWx0ID0gNDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWREYXRhKCk6IHZvaWQge1xuICAgIGxldCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge307XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSAwO1xuICAgICAgcXVlcnlBcmdzID0ge1xuICAgICAgICBvZmZzZXQ6IHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzID8gKHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cykgOiAwLFxuICAgICAgICBsZW5ndGg6IE1hdGgubWF4KHRoaXMucXVlcnlSb3dzLCB0aGlzLmRhdGFSZXNwb25zZUFycmF5Lmxlbmd0aCksXG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSAwO1xuICAgIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgPSBbXTtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfVxuXG5cbiAgcHVibGljIHNldERhdGFBcnJheShkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gZGF0YTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgPSBbZGF0YV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQ29tcG9uZW50IGhhcyByZWNlaXZlZCBub3Qgc3VwcG9ydGVkIHNlcnZpY2UgZGF0YS4gU3VwcG9ydGVkIGRhdGEgYXJlIEFycmF5IG9yIE9iamVjdCcpO1xuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IFtdO1xuICAgIH1cbiAgICB0aGlzLmZpbHRlckRhdGEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaWx0ZXJzIGRhdGEgbG9jYWxseVxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIGZpbHRlcmluZyB2YWx1ZVxuICAgKi9cbiAgcHVibGljIGZpbHRlckRhdGEodmFsdWU/OiBzdHJpbmcsIGxvYWRNb3JlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIHZhbHVlID0gVXRpbC5pc0RlZmluZWQodmFsdWUpID8gdmFsdWUgOiBVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSA/IHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQuZ2V0VmFsdWUoKSA6IHZvaWQgMDtcbiAgICBpZiAodGhpcy5zdGF0ZSAmJiBVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuc3RhdGUuZmlsdGVyVmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3MgPSB7XG4gICAgICAgIG9mZnNldDogMCxcbiAgICAgICAgbGVuZ3RoOiB0aGlzLnF1ZXJ5Um93cyxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXRhUmVzcG9uc2VBcnJheSAmJiB0aGlzLmRhdGFSZXNwb25zZUFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLmRhdGFSZXNwb25zZUFycmF5LnNsaWNlKDApO1xuICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY2FzZVNlbnNpdGl2ZSA9IHRoaXMuaXNGaWx0ZXJDYXNlU2Vuc2l0aXZlKCk7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYuZ2V0UXVpY2tGaWx0ZXJDb2x1bW5zKCkuc29tZShjb2wgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVnRXhwU3RyID0gVXRpbC5lc2NhcGVTcGVjaWFsQ2hhcmFjdGVyKFV0aWwubm9ybWFsaXplU3RyaW5nKHZhbHVlLCAhY2FzZVNlbnNpdGl2ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnRXhwU3RyKS50ZXN0KFV0aWwubm9ybWFsaXplU3RyaW5nKGl0ZW1bY29sXSArICcnLCAhY2FzZVNlbnNpdGl2ZSkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuc29ydENvbHVtbk9yZGVyKSkge1xuICAgICAgICAvLyBTaW1wbGUgc29ydGluZ1xuICAgICAgICBjb25zdCBzb3J0ID0gdGhpcy5zb3J0Q29sdW1uT3JkZXI7XG4gICAgICAgIGNvbnN0IGZhY3RvciA9IChzb3J0LmFzY2VuZGVudCA/IDEgOiAtMSk7XG4gICAgICAgIC8vIGZpbHRlcmVkRGF0YSA9IGZpbHRlcmVkRGF0YS5zb3J0KChhLCBiKSA9PiAoVXRpbC5ub3JtYWxpemVTdHJpbmcoYVtzb3J0LmNvbHVtbk5hbWVdKSA+IFV0aWwubm9ybWFsaXplU3RyaW5nKGJbc29ydC5jb2x1bW5OYW1lXSkpID8gKDEgKiBmYWN0b3IpIDogKFV0aWwubm9ybWFsaXplU3RyaW5nKGJbc29ydC5jb2x1bW5OYW1lXSkgPiBVdGlsLm5vcm1hbGl6ZVN0cmluZyhhW3NvcnQuY29sdW1uTmFtZV0pKSA/ICgtMSAqIGZhY3RvcikgOiAwKTtcbiAgICAgICAgZmlsdGVyZWREYXRhLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICBjb25zdCBhT3AgPSBpc05hTihhW3NvcnQuY29sdW1uTmFtZV0pID8gVXRpbC5ub3JtYWxpemVTdHJpbmcoYVtzb3J0LmNvbHVtbk5hbWVdKSA6IGFbc29ydC5jb2x1bW5OYW1lXTtcbiAgICAgICAgICBjb25zdCBiT3AgPSBpc05hTihiW3NvcnQuY29sdW1uTmFtZV0pID8gVXRpbC5ub3JtYWxpemVTdHJpbmcoYltzb3J0LmNvbHVtbk5hbWVdKSA6IGJbc29ydC5jb2x1bW5OYW1lXTtcbiAgICAgICAgICByZXR1cm4gKGFPcCA+IGJPcCkgPyAoMSAqIGZhY3RvcikgOiAoYk9wID4gYU9wKSA/ICgtMSAqIGZhY3RvcikgOiAwO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhZ2luYXRpb25Db250cm9scykge1xuICAgICAgICB0aGlzLmRhdGFBcnJheSA9IGZpbHRlcmVkRGF0YS5zcGxpY2UodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzLCB0aGlzLnF1ZXJ5Um93cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRhdGFBcnJheSA9IGZpbHRlcmVkRGF0YS5zcGxpY2UoMCwgdGhpcy5xdWVyeVJvd3MgKiAodGhpcy5jdXJyZW50UGFnZSArIDEpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhQXJyYXkgPSB0aGlzLmRhdGFSZXNwb25zZUFycmF5O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlckdyaWRJdGVtRGlyZWN0aXZlKGl0ZW06IE9HcmlkSXRlbURpcmVjdGl2ZSk6IHZvaWQge1xuICAgIGlmIChpdGVtKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIGlmIChzZWxmLmRldGFpbE1vZGUgPT09IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLKSB7XG4gICAgICAgIGl0ZW0ub25DbGljayhncmlkSXRlbSA9PiBzZWxmLm9uSXRlbURldGFpbENsaWNrKGdyaWRJdGVtKSk7XG4gICAgICB9XG4gICAgICBpZiAoQ29kZXMuaXNEb3VibGVDbGlja01vZGUoc2VsZi5kZXRhaWxNb2RlKSkge1xuICAgICAgICBpdGVtLm9uRG91YmxlQ2xpY2soZ3JpZEl0ZW0gPT4gc2VsZi5vbkl0ZW1EZXRhaWxEYmxDbGljayhncmlkSXRlbSkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkl0ZW1EZXRhaWxDbGljayhpdGVtOiBPR3JpZEl0ZW1EaXJlY3RpdmUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vZW5hYmxlZCAmJiB0aGlzLmRldGFpbE1vZGUgPT09IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLKSB7XG4gICAgICB0aGlzLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgICB0aGlzLnZpZXdEZXRhaWwoaXRlbS5nZXRJdGVtRGF0YSgpKTtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25DbGljaywgaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uSXRlbURldGFpbERibENsaWNrKGl0ZW06IE9HcmlkSXRlbURpcmVjdGl2ZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9lbmFibGVkICYmIENvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHRoaXMuZGV0YWlsTW9kZSkpIHtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMudmlld0RldGFpbChpdGVtLmdldEl0ZW1EYXRhKCkpO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkRvdWJsZUNsaWNrLCBpdGVtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBsb2FkTW9yZSgpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRQYWdlICs9IDE7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3MgPSB7XG4gICAgICAgIG9mZnNldDogdGhpcy5zdGF0ZS5xdWVyeVJlY29yZE9mZnNldCxcbiAgICAgICAgbGVuZ3RoOiB0aGlzLnF1ZXJ5Um93c1xuICAgICAgfTtcbiAgICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXJEYXRhKHZvaWQgMCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHRvdGFsUmVjb3JkcygpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRUb3RhbFJlY29yZHNOdW1iZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlcjogb2JqZWN0LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogYW55W10ge1xuICAgIGNvbnN0IHF1ZXJ5QXJndW1lbnRzID0gc3VwZXIuZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyLCBvdnJyQXJncyk7XG4gICAgLy8gcXVlcnlBcmd1bWVudHNbM10gPSB0aGlzLmdldFNxbFR5cGVzRm9yRmlsdGVyKHF1ZXJ5QXJndW1lbnRzWzFdKTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnNvcnRDb2x1bW4pKSB7XG4gICAgICBxdWVyeUFyZ3VtZW50c1s2XSA9IHRoaXMuc29ydENvbHVtbk9yZGVyID8gW3RoaXMuc29ydENvbHVtbk9yZGVyXSA6IHRoaXMuc29ydENvbHVtbk9yZGVyO1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VTb3J0Q29sdW1uKCk6IHZvaWQge1xuICAgIGNvbnN0IHBhcnNlZCA9IChTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyh0aGlzLnNvcnRDb2x1bW4pIHx8IFtdKVswXTtcbiAgICBjb25zdCBleGlzdHMgPSBwYXJzZWQgPyB0aGlzLnNvcnRhYmxlQ29sdW1ucy5maW5kKChpdGVtOiBTUUxPcmRlcikgPT4gKGl0ZW0uY29sdW1uTmFtZSA9PT0gcGFyc2VkLmNvbHVtbk5hbWUpICYmIChpdGVtLmFzY2VuZGVudCA9PT0gcGFyc2VkLmFzY2VuZGVudCkpIDogZmFsc2U7XG4gICAgaWYgKGV4aXN0cykge1xuICAgICAgdGhpcy5zb3J0Q29sdW1uT3JkZXIgPSBwYXJzZWQ7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGN1cnJlbnRPcmRlckNvbHVtbigpOiBudW1iZXIge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5zb3J0Q29sdW1uT3JkZXIpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBsZXQgaW5kZXg7XG4gICAgdGhpcy5zb3J0YWJsZUNvbHVtbnMuZm9yRWFjaCgoaXRlbTogU1FMT3JkZXIsIGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKChpdGVtLmNvbHVtbk5hbWUgPT09IHRoaXMuc29ydENvbHVtbk9yZGVyLmNvbHVtbk5hbWUpICYmXG4gICAgICAgIChpdGVtLmFzY2VuZGVudCA9PT0gdGhpcy5zb3J0Q29sdW1uT3JkZXIuYXNjZW5kZW50KSkge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgc2V0IGN1cnJlbnRPcmRlckNvbHVtbih2YWw6IG51bWJlcikge1xuICAgIHRoaXMuc29ydENvbHVtbk9yZGVyID0gdGhpcy5zb3J0YWJsZUNvbHVtbnNbdmFsXTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZVBhZ2UoZTogUGFnZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gZS5wYWdlSW5kZXg7XG4gICAgICB0aGlzLnF1ZXJ5Um93cyA9IGUucGFnZVNpemU7XG4gICAgICB0aGlzLmZpbHRlckRhdGEoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGFibGVTdGF0ZSA9IHRoaXMuc3RhdGU7XG5cbiAgICBjb25zdCBnb2luZ0JhY2sgPSBlLnBhZ2VJbmRleCA8IHRoaXMuY3VycmVudFBhZ2U7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IGUucGFnZUluZGV4O1xuICAgIGNvbnN0IHBhZ2VTaXplID0gZS5wYWdlU2l6ZTtcblxuICAgIGNvbnN0IG9sZFF1ZXJ5Um93cyA9IHRoaXMucXVlcnlSb3dzO1xuICAgIGNvbnN0IGNoYW5naW5nUGFnZVNpemUgPSAob2xkUXVlcnlSb3dzICE9PSBwYWdlU2l6ZSk7XG4gICAgdGhpcy5xdWVyeVJvd3MgPSBwYWdlU2l6ZTtcblxuICAgIGxldCBuZXdTdGFydFJlY29yZDtcbiAgICBsZXQgcXVlcnlMZW5ndGg7XG5cbiAgICBpZiAoZ29pbmdCYWNrIHx8IGNoYW5naW5nUGFnZVNpemUpIHtcbiAgICAgIG5ld1N0YXJ0UmVjb3JkID0gKHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cyk7XG4gICAgICBxdWVyeUxlbmd0aCA9IHRoaXMucXVlcnlSb3dzO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTdGFydFJlY29yZCA9IE1hdGgubWF4KHRhYmxlU3RhdGUucXVlcnlSZWNvcmRPZmZzZXQsICh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MpKTtcbiAgICAgIGNvbnN0IG5ld0VuZFJlY29yZCA9IE1hdGgubWluKG5ld1N0YXJ0UmVjb3JkICsgdGhpcy5xdWVyeVJvd3MsIHRhYmxlU3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIpO1xuICAgICAgcXVlcnlMZW5ndGggPSBNYXRoLm1pbih0aGlzLnF1ZXJ5Um93cywgbmV3RW5kUmVjb3JkIC0gbmV3U3RhcnRSZWNvcmQpO1xuICAgIH1cblxuICAgIGNvbnN0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3MgPSB7XG4gICAgICBvZmZzZXQ6IG5ld1N0YXJ0UmVjb3JkLFxuICAgICAgbGVuZ3RoOiBxdWVyeUxlbmd0aFxuICAgIH07XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgcHVibGljIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgY29uc3QgZGF0YVRvU3RvcmUgPSBzdXBlci5nZXREYXRhVG9TdG9yZSgpO1xuICAgIGRhdGFUb1N0b3JlWydjdXJyZW50UGFnZSddID0gdGhpcy5jdXJyZW50UGFnZTtcblxuICAgIGlmICh0aGlzLnN0b3JlUGFnaW5hdGlvblN0YXRlKSB7XG4gICAgICBkYXRhVG9TdG9yZVsncXVlcnlSZWNvcmRPZmZzZXQnXSA9IE1hdGgubWF4KFxuICAgICAgICAodGhpcy5zdGF0ZS5xdWVyeVJlY29yZE9mZnNldCAtIHRoaXMuZGF0YUFycmF5Lmxlbmd0aCksXG4gICAgICAgICh0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0IC0gdGhpcy5xdWVyeVJvd3MpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgZGF0YVRvU3RvcmVbJ3F1ZXJ5UmVjb3JkT2Zmc2V0J107XG4gICAgfVxuXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuc29ydENvbHVtbk9yZGVyKSkge1xuICAgICAgZGF0YVRvU3RvcmVbJ3NvcnQtY29sdW1uJ10gPSB0aGlzLnNvcnRDb2x1bW5PcmRlci5jb2x1bW5OYW1lICsgQ29kZXMuQ09MVU1OU19BTElBU19TRVBBUkFUT1IgK1xuICAgICAgICAodGhpcy5zb3J0Q29sdW1uT3JkZXIuYXNjZW5kZW50ID8gQ29kZXMuQVNDX1NPUlQgOiBDb2Rlcy5ERVNDX1NPUlQpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YVRvU3RvcmU7XG4gIH1cblxuICBwdWJsaWMgZ2V0U29ydE9wdGlvblRleHQoY29sOiBTUUxPcmRlcik6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBsZXQgY29sVGV4dEtleSA9IGBHUklELlNPUlRfQllfJHtjb2wuY29sdW1uTmFtZS50b1VwcGVyQ2FzZSgpfV9gICsgKGNvbC5hc2NlbmRlbnQgPyAnQVNDJyA6ICdERVNDJyk7XG4gICAgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChjb2xUZXh0S2V5KTtcbiAgICBpZiAocmVzdWx0ICE9PSBjb2xUZXh0S2V5KSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBjb2xUZXh0S2V5ID0gJ0dSSUQuU09SVF9CWV8nICsgKGNvbC5hc2NlbmRlbnQgPyAnQVNDJyA6ICdERVNDJyk7XG4gICAgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChjb2xUZXh0S2V5LCBbKHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoY29sLmNvbHVtbk5hbWUpIHx8ICcnKV0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0YShkYXRhOiBhbnksIHNxbFR5cGVzPzogYW55LCByZXBsYWNlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGxldCBkYXRhQXJyYXkgPSBkYXRhO1xuICAgICAgbGV0IHJlc3BEYXRhQXJyYXkgPSBkYXRhO1xuICAgICAgaWYgKCFyZXBsYWNlKSB7XG4gICAgICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICAgICAgZGF0YUFycmF5ID0gdGhpcy5wYWdpbmF0aW9uQ29udHJvbHMgPyBkYXRhIDogKHRoaXMuZGF0YUFycmF5IHx8IFtdKS5jb25jYXQoZGF0YSk7XG4gICAgICAgICAgcmVzcERhdGFBcnJheSA9IHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzID8gZGF0YSA6ICh0aGlzLmRhdGFSZXNwb25zZUFycmF5IHx8IFtdKS5jb25jYXQoZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YUFycmF5ID0gZGF0YS5zbGljZSh0aGlzLnBhZ2luYXRpb25Db250cm9scyA/ICgodGhpcy5xdWVyeVJvd3MgKiAodGhpcy5jdXJyZW50UGFnZSArIDEpKSAtIHRoaXMucXVlcnlSb3dzKSA6IDAsIHRoaXMucXVlcnlSb3dzICogKHRoaXMuY3VycmVudFBhZ2UgKyAxKSk7XG4gICAgICAgICAgcmVzcERhdGFBcnJheSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gZGF0YUFycmF5O1xuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IHJlc3BEYXRhQXJyYXk7XG4gICAgICBpZiAoIXRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJEYXRhKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gW107XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gW107XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25QYWdpbmF0ZWREYXRhTG9hZGVkLCBkYXRhKTtcbiAgICB9XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkRhdGFMb2FkZWQsIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk6IHZvaWQge1xuICAgIHN1cGVyLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSA9IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0R3JpZEl0ZW1EaXJlY3RpdmVzRGF0YSgpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmdyaWRJdGVtRGlyZWN0aXZlcy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmdyaWRJdGVtRGlyZWN0aXZlcy50b0FycmF5KCkuZm9yRWFjaCgoZWxlbWVudDogT0dyaWRJdGVtRGlyZWN0aXZlLCBpbmRleCkgPT4ge1xuICAgICAgICBlbGVtZW50LnNldEl0ZW1EYXRhKHNlbGYuZGF0YUFycmF5W2luZGV4XSk7XG4gICAgICAgIGVsZW1lbnQuc2V0R3JpZENvbXBvbmVudChzZWxmKTtcbiAgICAgICAgc2VsZi5yZWdpc3RlckdyaWRJdGVtRGlyZWN0aXZlKGVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxufVxuIl19