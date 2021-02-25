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
export const DEFAULT_INPUTS_O_GRID = [
    ...DEFAULT_INPUTS_O_SERVICE_COMPONENT,
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
];
export const DEFAULT_OUTPUTS_O_GRID = [
    'onClick',
    'onDoubleClick',
    'onDataLoaded',
    'onPaginatedDataLoaded'
];
const PAGE_SIZE_OPTIONS = [8, 16, 24, 32, 64];
export class OGridComponent extends OServiceComponent {
    constructor(injector, elRef, form) {
        super(injector, elRef, form);
        this.queryRows = 32;
        this.fixedHeader = false;
        this.showPageSize = false;
        this.showSort = false;
        this.showFooter = true;
        this.gridItemHeight = '1:1';
        this.refreshButton = true;
        this.paginationControls = false;
        this.gutterSize = '1px';
        this.onClick = new EventEmitter();
        this.onDoubleClick = new EventEmitter();
        this.onDataLoaded = new EventEmitter();
        this.onPaginatedDataLoaded = new EventEmitter();
        this._sortableColumns = [];
        this._colsDefault = 1;
        this._pageSizeOptions = PAGE_SIZE_OPTIONS;
        this.dataResponseArray = [];
        this.storePaginationState = false;
        this._gridItems = [];
        this._currentPage = 0;
        this.subscription = new Subscription();
        this.media = this.injector.get(MediaObserver);
    }
    get cols() {
        return this._cols || this._colsDefault;
    }
    set cols(value) {
        this._cols = value;
    }
    get pageSizeOptions() {
        return this._pageSizeOptions;
    }
    set pageSizeOptions(val) {
        if (!(val instanceof Array)) {
            val = Util.parseArray(String(val)).map(a => parseInt(a, 10));
        }
        this._pageSizeOptions = val;
    }
    get sortableColumns() {
        return this._sortableColumns;
    }
    set sortableColumns(val) {
        let parsed = [];
        if (!Util.isArray(val)) {
            parsed = ServiceUtils.parseSortColumns(String(val));
        }
        this._sortableColumns = parsed;
    }
    set gridItems(value) {
        this._gridItems = value;
    }
    get gridItems() {
        return this._gridItems;
    }
    set currentPage(val) {
        this._currentPage = val;
    }
    get currentPage() {
        return this._currentPage;
    }
    ngOnInit() {
        this.initialize();
    }
    initialize() {
        super.initialize();
        if (this.state.hasOwnProperty('sort-column')) {
            this.sortColumn = this.state['sort-column'];
        }
        this.parseSortColumn();
        const existingOption = this.pageSizeOptions.find(option => option === this.queryRows);
        if (!Util.isDefined(existingOption)) {
            this._pageSizeOptions.push(this.queryRows);
            this._pageSizeOptions.sort((i, j) => i - j);
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
    }
    ngAfterViewInit() {
        super.afterViewInit();
        this.setGridItemDirectivesData();
        if (this.searchInputComponent) {
            this.registerQuickFilter(this.searchInputComponent);
        }
        this.subscribeToMediaChanges();
    }
    ngAfterContentInit() {
        this.gridItems = this.inputGridItems.toArray();
        this.subscription.add(this.inputGridItems.changes.subscribe(queryChanges => {
            this.gridItems = queryChanges._results;
        }));
    }
    subscribeToMediaChanges() {
        this.subscription.add(this.media.asObservable().subscribe((change) => {
            if (change && change[0]) {
                switch (change[0].mqAlias) {
                    case 'xs':
                    case 'sm':
                        this._colsDefault = 1;
                        break;
                    case 'md':
                        this._colsDefault = 2;
                        break;
                    case 'lg':
                    case 'xl':
                        this._colsDefault = 4;
                }
            }
        }));
    }
    reloadData() {
        let queryArgs = {};
        if (this.pageable) {
            this.state.queryRecordOffset = 0;
            queryArgs = {
                offset: this.paginationControls ? (this.currentPage * this.queryRows) : 0,
                length: Math.max(this.queryRows, this.dataResponseArray.length),
                replace: true
            };
        }
        this.queryData(void 0, queryArgs);
    }
    reloadPaginatedDataFromStart() {
        this.currentPage = 0;
        this.dataResponseArray = [];
        this.reloadData();
    }
    setDataArray(data) {
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
    }
    filterData(value, loadMore) {
        value = Util.isDefined(value) ? value : Util.isDefined(this.quickFilterComponent) ? this.quickFilterComponent.getValue() : void 0;
        if (this.state && Util.isDefined(value)) {
            this.state.filterValue = value;
        }
        if (this.pageable) {
            const queryArgs = {
                offset: 0,
                length: this.queryRows,
                replace: true
            };
            this.queryData(void 0, queryArgs);
            return;
        }
        if (this.dataResponseArray && this.dataResponseArray.length > 0) {
            let filteredData = this.dataResponseArray.slice(0);
            if (value && value.length > 0) {
                const caseSensitive = this.isFilterCaseSensitive();
                const self = this;
                filteredData = filteredData.filter(item => {
                    return self.getQuickFilterColumns().some(col => {
                        const regExpStr = Util.escapeSpecialCharacter(Util.normalizeString(value, !caseSensitive));
                        return new RegExp(regExpStr).test(Util.normalizeString(item[col] + '', !caseSensitive));
                    });
                });
            }
            if (Util.isDefined(this.sortColumnOrder)) {
                const sort = this.sortColumnOrder;
                const factor = (sort.ascendent ? 1 : -1);
                filteredData.sort((a, b) => {
                    const aOp = isNaN(a[sort.columnName]) ? Util.normalizeString(a[sort.columnName]) : a[sort.columnName];
                    const bOp = isNaN(b[sort.columnName]) ? Util.normalizeString(b[sort.columnName]) : b[sort.columnName];
                    return (aOp > bOp) ? (1 * factor) : (bOp > aOp) ? (-1 * factor) : 0;
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
    }
    registerGridItemDirective(item) {
        if (item) {
            const self = this;
            if (self.detailMode === Codes.DETAIL_MODE_CLICK) {
                item.onClick(gridItem => self.onItemDetailClick(gridItem));
            }
            if (Codes.isDoubleClickMode(self.detailMode)) {
                item.onDoubleClick(gridItem => self.onItemDetailDblClick(gridItem));
            }
        }
    }
    onItemDetailClick(item) {
        if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(item.getItemData());
            ObservableWrapper.callEmit(this.onClick, item);
        }
    }
    onItemDetailDblClick(item) {
        if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(item.getItemData());
            ObservableWrapper.callEmit(this.onDoubleClick, item);
        }
    }
    ngOnDestroy() {
        this.destroy();
    }
    destroy() {
        super.destroy();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    loadMore() {
        this.currentPage += 1;
        if (this.pageable) {
            const queryArgs = {
                offset: this.state.queryRecordOffset,
                length: this.queryRows
            };
            this.queryData(void 0, queryArgs);
        }
        else {
            this.filterData(void 0, true);
        }
    }
    get totalRecords() {
        if (this.pageable) {
            return this.getTotalRecordsNumber();
        }
        return this.dataResponseArray.length;
    }
    getQueryArguments(filter, ovrrArgs) {
        const queryArguments = super.getQueryArguments(filter, ovrrArgs);
        if (this.pageable && Util.isDefined(this.sortColumn)) {
            queryArguments[6] = this.sortColumnOrder ? [this.sortColumnOrder] : this.sortColumnOrder;
        }
        return queryArguments;
    }
    parseSortColumn() {
        const parsed = (ServiceUtils.parseSortColumns(this.sortColumn) || [])[0];
        const exists = parsed ? this.sortableColumns.find((item) => (item.columnName === parsed.columnName) && (item.ascendent === parsed.ascendent)) : false;
        if (exists) {
            this.sortColumnOrder = parsed;
        }
    }
    get currentOrderColumn() {
        if (!Util.isDefined(this.sortColumnOrder)) {
            return undefined;
        }
        let index;
        this.sortableColumns.forEach((item, i) => {
            if ((item.columnName === this.sortColumnOrder.columnName) &&
                (item.ascendent === this.sortColumnOrder.ascendent)) {
                index = i;
            }
        });
        return index;
    }
    set currentOrderColumn(val) {
        this.sortColumnOrder = this.sortableColumns[val];
    }
    onChangePage(e) {
        if (!this.pageable) {
            this.currentPage = e.pageIndex;
            this.queryRows = e.pageSize;
            this.filterData();
            return;
        }
        const tableState = this.state;
        const goingBack = e.pageIndex < this.currentPage;
        this.currentPage = e.pageIndex;
        const pageSize = e.pageSize;
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
        this.queryData(void 0, queryArgs);
    }
    getDataToStore() {
        const dataToStore = super.getDataToStore();
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
    }
    getSortOptionText(col) {
        let result;
        let colTextKey = `GRID.SORT_BY_${col.columnName.toUpperCase()}_` + (col.ascendent ? 'ASC' : 'DESC');
        result = this.translateService.get(colTextKey);
        if (result !== colTextKey) {
            return result;
        }
        colTextKey = 'GRID.SORT_BY_' + (col.ascendent ? 'ASC' : 'DESC');
        result = this.translateService.get(colTextKey, [(this.translateService.get(col.columnName) || '')]);
        return result;
    }
    setData(data, sqlTypes, replace) {
        if (Util.isArray(data)) {
            let dataArray = data;
            let respDataArray = data;
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
    }
    saveDataNavigationInLocalStorage() {
        super.saveDataNavigationInLocalStorage();
        this.storePaginationState = true;
    }
    setGridItemDirectivesData() {
        const self = this;
        this.gridItemDirectives.changes.subscribe(() => {
            this.gridItemDirectives.toArray().forEach((element, index) => {
                element.setItemData(self.dataArray[index]);
                element.setGridComponent(self);
                self.registerGridItemDirective(element);
            });
        });
    }
}
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
OGridComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] }
];
OGridComponent.propDecorators = {
    inputGridItems: [{ type: ContentChildren, args: [forwardRef(() => OGridItemComponent),] }],
    gridItemDirectives: [{ type: ViewChildren, args: [OGridItemDirective,] }],
    matpaginator: [{ type: ViewChild, args: [MatPaginator, { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OGridComponent.prototype, "queryRows", void 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ncmlkL28tZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBSVIsUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVwQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3JHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLHFC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QUMsQ0FBQztJQUNMLENBQUM7OztZQTFlRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRTtvQkFDVCx1QkFBdUI7aUJBQ3hCO2dCQUNELE1BQU0sRUFBRSxxQkFBcUI7Z0JBQzdCLE9BQU8sRUFBRSxzQkFBc0I7Z0JBQy9CLGt1SUFBc0M7Z0JBRXRDLElBQUksRUFBRTtvQkFDSixnQkFBZ0IsRUFBRSxNQUFNO29CQUN4QixzQkFBc0IsRUFBRSxhQUFhO2lCQUN0Qzs7YUFDRjs7O1lBL0VDLFFBQVE7WUFKUixVQUFVO1lBMEJILGNBQWMsdUJBdUtsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7Ozs2QkE3Q3JELGVBQWUsU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7aUNBRXBELFlBQVksU0FBQyxrQkFBa0I7MkJBRS9CLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQWhFMUM7SUFEQyxjQUFjLEVBQUU7O2lEQUNhO0FBRzlCO0lBREMsY0FBYyxFQUFFOzttREFDbUI7QUFHcEM7SUFEQyxjQUFjLEVBQUU7O29EQUNvQjtBQUdyQztJQURDLGNBQWMsRUFBRTs7Z0RBQ2dCO0FBR2pDO0lBREMsY0FBYyxFQUFFOztrREFDaUI7QUFLbEM7SUFEQyxjQUFjLEVBQUU7O3FEQUNvQjtBQUdyQztJQURDLGNBQWMsRUFBRTs7MERBQzBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW5cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNZWRpYUNoYW5nZSwgTWVkaWFPYnNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2ZsZXgtbGF5b3V0JztcbmltcG9ydCB7IE1hdFBhZ2luYXRvciwgUGFnZUV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUdyaWRJdGVtIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLWdyaWQtaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgT1F1ZXJ5RGF0YUFyZ3MgfSBmcm9tICcuLi8uLi90eXBlcy9xdWVyeS1kYXRhLWFyZ3MudHlwZSc7XG5pbXBvcnQgeyBTUUxPcmRlciB9IGZyb20gJy4uLy4uL3R5cGVzL3NxbC1vcmRlci50eXBlJztcbmltcG9ydCB7IE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0NPTVBPTkVOVCwgT1NlcnZpY2VDb21wb25lbnQgfSBmcm9tICcuLi9vLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9HcmlkSXRlbUNvbXBvbmVudCB9IGZyb20gJy4vZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPR3JpZEl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuL2dyaWQtaXRlbS9vLWdyaWQtaXRlbS5kaXJlY3RpdmUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19HUklEID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQ09NUE9ORU5ULFxuICAvLyBjb2xzOiBBbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZCBsaXN0LiBEZWZhdWx0IGluIGV4dHJhIHNtYWxsIGFuZCBzbWFsbCBzY3JlZW4gaXMgMSwgaW4gbWVkaXVtIHNjcmVlbiBpcyAyLCBpbiBsYXJnZSBzY3JlZW4gaXMgMyBhbmQgZXh0cmEgbGFyZ2Ugc2NyZWVuIGlzIDQuXG4gICdjb2xzJyxcbiAgLy8gcGFnZS1zaXplLW9wdGlvbnMgW3N0cmluZ106IFBhZ2Ugc2l6ZSBvcHRpb25zIHNlcGFyYXRlZCBieSAnOycuXG4gICdwYWdlU2l6ZU9wdGlvbnM6IHBhZ2Utc2l6ZS1vcHRpb25zJyxcbiAgLy8gc2hvdy1wYWdlLXNpemU6V2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuXG4gICdzaG93UGFnZVNpemU6IHNob3ctcGFnZS1zaXplJyxcbiAgLy8gc2hvdy1zb3J0OndoZXRoZXIgb3Igbm90IHRoZSBzb3J0IHNlbGVjdCBpcyBzaG93biBpbiB0aGUgdG9vbGJhclxuICAnc2hvd1NvcnQ6IG9yZGVyYWJsZScsXG4gIC8vIHNvcnRhYmxlW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIGZpbHRlciwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzb3J0YWJsZUNvbHVtbnM6IHNvcnRhYmxlLWNvbHVtbnMnLFxuICAvLyBzb3J0Q29sdW1uc1tzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBzb3J0aW5nY29sdW1ucywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzb3J0Q29sdW1uOiBzb3J0LWNvbHVtbicsXG4gIC8vIHF1aWNrLWZpbHRlci1jb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBmaWx0ZXIsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVpY2tGaWx0ZXJDb2x1bW5zOiBxdWljay1maWx0ZXItY29sdW1ucycsXG4gIC8vICBncmlkLWl0ZW0taGVpZ2h0W3N0cmluZ106IFNldCBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiByb3cgaGVpZ2h0IGZyb20gdGhlIHVzZXItcHJvdmlkZWQgdmFsdWUuLiBEZWZhdWx0OiAxOjEuXG4gICdncmlkSXRlbUhlaWdodDogZ3JpZC1pdGVtLWhlaWdodCcsXG4gIC8vIHJlZnJlc2gtYnV0dG9uIFtub3x5ZXNdOiBzaG93IHJlZnJlc2ggYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdyZWZyZXNoQnV0dG9uOiByZWZyZXNoLWJ1dHRvbicsXG4gIC8vIHBhZ2luYXRpb24tY29udHJvbHMgW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBwYWdpbmF0aW9uIGNvbnRyb2xzLiBEZWZhdWx0OiBuby5cbiAgJ3BhZ2luYXRpb25Db250cm9sczogcGFnaW5hdGlvbi1jb250cm9scycsXG4gIC8vIGd1dHRlclNpemU6IFNpemUgb2YgdGhlIGdyaWQgbGlzdCdzIGd1dHRlciBpbiBwaXhlbHMuXG4gICdndXR0ZXJTaXplOmd1dHRlci1zaXplJyxcbiAgLy8gZml4LWhlYWRlciBbeWVzfG5vfHRydWV8ZmFsc2VdOiBmaXhlZCBmb290ZXIgd2hlbiB0aGUgY29udGVudCBpcyBncmVhdGhlciB0aGFuIGl0cyBvd24gaGVpZ2h0LiBEZWZhdWx0OiBuby5cbiAgJ2ZpeGVkSGVhZGVyOmZpeGVkLWhlYWRlcicsXG4gIC8vIHNob3ctZm9vdGVyOkluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0byBzaG93IHRoZSBmb290ZXI6RGVmYXVsdDp0cnVlXG4gICdzaG93Rm9vdGVyOnNob3ctZm9vdGVyJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0dSSUQgPSBbXG4gICdvbkNsaWNrJyxcbiAgJ29uRG91YmxlQ2xpY2snLFxuICAnb25EYXRhTG9hZGVkJyxcbiAgJ29uUGFnaW5hdGVkRGF0YUxvYWRlZCdcbl07XG5cbmNvbnN0IFBBR0VfU0laRV9PUFRJT05TID0gWzgsIDE2LCAyNCwgMzIsIDY0XTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1ncmlkJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT250aW1pemVTZXJ2aWNlUHJvdmlkZXJcbiAgXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0dSSUQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0dSSUQsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWdyaWQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWdyaWQuY29tcG9uZW50LnNjc3MnXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1ncmlkXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm8tZ3JpZC1maXhlZF0nOiAnZml4ZWRIZWFkZXInLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9HcmlkQ29tcG9uZW50IGV4dGVuZHMgT1NlcnZpY2VDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0IHtcblxuICAvKiBJbnB1dHMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHF1ZXJ5Um93czogbnVtYmVyID0gMzI7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGZpeGVkSGVhZGVyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dQYWdlU2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93U29ydDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93Rm9vdGVyOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZ3JpZEl0ZW1IZWlnaHQgPSAnMToxJztcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgcmVmcmVzaEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHBhZ2luYXRpb25Db250cm9sczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBndXR0ZXJTaXplID0gJzFweCc7XG5cbiAgZ2V0IGNvbHMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY29scyB8fCB0aGlzLl9jb2xzRGVmYXVsdDtcbiAgfVxuICBzZXQgY29scyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY29scyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBhZ2VTaXplT3B0aW9ucygpOiBudW1iZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplT3B0aW9ucztcbiAgfVxuICBzZXQgcGFnZVNpemVPcHRpb25zKHZhbDogbnVtYmVyW10pIHtcbiAgICBpZiAoISh2YWwgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgIHZhbCA9IFV0aWwucGFyc2VBcnJheShTdHJpbmcodmFsKSkubWFwKGEgPT4gcGFyc2VJbnQoYSwgMTApKTtcbiAgICB9XG4gICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gdmFsO1xuICB9XG5cbiAgZ2V0IHNvcnRhYmxlQ29sdW1ucygpOiBTUUxPcmRlcltdIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydGFibGVDb2x1bW5zO1xuICB9XG4gIHNldCBzb3J0YWJsZUNvbHVtbnModmFsKSB7XG4gICAgbGV0IHBhcnNlZCA9IFtdO1xuICAgIGlmICghVXRpbC5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHBhcnNlZCA9IFNlcnZpY2VVdGlscy5wYXJzZVNvcnRDb2x1bW5zKFN0cmluZyh2YWwpKTtcbiAgICB9XG4gICAgdGhpcy5fc29ydGFibGVDb2x1bW5zID0gcGFyc2VkO1xuICB9XG5cbiAgcHVibGljIHF1aWNrRmlsdGVyQ29sdW1uczogc3RyaW5nO1xuICAvKiBFbmQgSW5wdXRzICovXG5cbiAgcHVibGljIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Eb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkRhdGFMb2FkZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25QYWdpbmF0ZWREYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gT0dyaWRJdGVtQ29tcG9uZW50KSlcbiAgcHVibGljIGlucHV0R3JpZEl0ZW1zOiBRdWVyeUxpc3Q8T0dyaWRJdGVtQ29tcG9uZW50PjtcbiAgQFZpZXdDaGlsZHJlbihPR3JpZEl0ZW1EaXJlY3RpdmUpXG4gIHB1YmxpYyBncmlkSXRlbURpcmVjdGl2ZXM6IFF1ZXJ5TGlzdDxPR3JpZEl0ZW1EaXJlY3RpdmU+O1xuICBAVmlld0NoaWxkKE1hdFBhZ2luYXRvciwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBtYXRwYWdpbmF0b3I6IE1hdFBhZ2luYXRvcjtcblxuICAvKiBQYXJzZWQgSW5wdXRzICovXG4gIHByb3RlY3RlZCBfc29ydGFibGVDb2x1bW5zOiBTUUxPcmRlcltdID0gW107XG4gIHByb3RlY3RlZCBzb3J0Q29sdW1uT3JkZXI6IFNRTE9yZGVyO1xuICAvKiBFbmQgcGFyc2VkIElucHV0cyAqL1xuXG4gIHByb3RlY3RlZCBfY29scztcbiAgcHJvdGVjdGVkIF9jb2xzRGVmYXVsdCA9IDE7XG4gIHByb3RlY3RlZCBfcGFnZVNpemVPcHRpb25zID0gUEFHRV9TSVpFX09QVElPTlM7XG4gIHByb3RlY3RlZCBzb3J0Q29sdW1uOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBkYXRhUmVzcG9uc2VBcnJheTogYW55W10gPSBbXTtcbiAgcHJvdGVjdGVkIHN0b3JlUGFnaW5hdGlvblN0YXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgc2V0IGdyaWRJdGVtcyh2YWx1ZTogSUdyaWRJdGVtW10pIHtcbiAgICB0aGlzLl9ncmlkSXRlbXMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBncmlkSXRlbXMoKTogSUdyaWRJdGVtW10ge1xuICAgIHJldHVybiB0aGlzLl9ncmlkSXRlbXM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2dyaWRJdGVtczogSUdyaWRJdGVtW10gPSBbXTtcblxuICBzZXQgY3VycmVudFBhZ2UodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jdXJyZW50UGFnZSA9IHZhbDtcbiAgfVxuXG4gIGdldCBjdXJyZW50UGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50UGFnZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY3VycmVudFBhZ2U6IG51bWJlciA9IDA7XG5cbiAgcHJvdGVjdGVkIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBwcm90ZWN0ZWQgbWVkaWE6IE1lZGlhT2JzZXJ2ZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50XG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbFJlZiwgZm9ybSk7XG4gICAgdGhpcy5tZWRpYSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1lZGlhT2JzZXJ2ZXIpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ3NvcnQtY29sdW1uJykpIHtcbiAgICAgIHRoaXMuc29ydENvbHVtbiA9IHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1uJ107XG4gICAgfVxuXG4gICAgdGhpcy5wYXJzZVNvcnRDb2x1bW4oKTtcblxuICAgIGNvbnN0IGV4aXN0aW5nT3B0aW9uID0gdGhpcy5wYWdlU2l6ZU9wdGlvbnMuZmluZChvcHRpb24gPT4gb3B0aW9uID09PSB0aGlzLnF1ZXJ5Um93cyk7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChleGlzdGluZ09wdGlvbikpIHtcbiAgICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucy5wdXNoKHRoaXMucXVlcnlSb3dzKTtcbiAgICAgIHRoaXMuX3BhZ2VTaXplT3B0aW9ucy5zb3J0KChpOiBudW1iZXIsIGo6IG51bWJlcikgPT4gaSAtIGopO1xuICAgIH1cblxuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbHVtbnMpKSB7XG4gICAgICB0aGlzLnF1aWNrRmlsdGVyQ29sdW1ucyA9IHRoaXMuY29sdW1ucztcbiAgICB9XG4gICAgdGhpcy5xdWlja0ZpbHRlckNvbEFycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMucXVpY2tGaWx0ZXJDb2x1bW5zLCB0cnVlKTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdjdXJyZW50UGFnZScpKSB7XG4gICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5zdGF0ZVsnY3VycmVudFBhZ2UnXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5xdWVyeU9uSW5pdCkge1xuICAgICAgdGhpcy5xdWVyeURhdGEoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLmFmdGVyVmlld0luaXQoKTtcbiAgICB0aGlzLnNldEdyaWRJdGVtRGlyZWN0aXZlc0RhdGEoKTtcbiAgICBpZiAodGhpcy5zZWFyY2hJbnB1dENvbXBvbmVudCkge1xuICAgICAgdGhpcy5yZWdpc3RlclF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoSW5wdXRDb21wb25lbnQpO1xuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZVRvTWVkaWFDaGFuZ2VzKCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZ3JpZEl0ZW1zID0gdGhpcy5pbnB1dEdyaWRJdGVtcy50b0FycmF5KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMuaW5wdXRHcmlkSXRlbXMuY2hhbmdlcy5zdWJzY3JpYmUocXVlcnlDaGFuZ2VzID0+IHtcbiAgICAgIHRoaXMuZ3JpZEl0ZW1zID0gcXVlcnlDaGFuZ2VzLl9yZXN1bHRzO1xuICAgIH0pKTtcbiAgfVxuXG4gIHB1YmxpYyBzdWJzY3JpYmVUb01lZGlhQ2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQodGhpcy5tZWRpYS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICAgICAgaWYgKGNoYW5nZSAmJiBjaGFuZ2VbMF0pIHtcbiAgICAgICAgc3dpdGNoIChjaGFuZ2VbMF0ubXFBbGlhcykge1xuICAgICAgICAgIGNhc2UgJ3hzJzpcbiAgICAgICAgICBjYXNlICdzbSc6XG4gICAgICAgICAgICB0aGlzLl9jb2xzRGVmYXVsdCA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdtZCc6XG4gICAgICAgICAgICB0aGlzLl9jb2xzRGVmYXVsdCA9IDI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdsZyc6XG4gICAgICAgICAgY2FzZSAneGwnOlxuICAgICAgICAgICAgdGhpcy5fY29sc0RlZmF1bHQgPSA0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZERhdGEoKTogdm9pZCB7XG4gICAgbGV0IHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3MgPSB7fTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgdGhpcy5zdGF0ZS5xdWVyeVJlY29yZE9mZnNldCA9IDA7XG4gICAgICBxdWVyeUFyZ3MgPSB7XG4gICAgICAgIG9mZnNldDogdGhpcy5wYWdpbmF0aW9uQ29udHJvbHMgPyAodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzKSA6IDAsXG4gICAgICAgIGxlbmd0aDogTWF0aC5tYXgodGhpcy5xdWVyeVJvd3MsIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoKSxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IDA7XG4gICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IFtdO1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cblxuICBwdWJsaWMgc2V0RGF0YUFycmF5KGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgPSBkYXRhO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChkYXRhKSkge1xuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IFtkYXRhXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgaGFzIHJlY2VpdmVkIG5vdCBzdXBwb3J0ZWQgc2VydmljZSBkYXRhLiBTdXBwb3J0ZWQgZGF0YSBhcmUgQXJyYXkgb3IgT2JqZWN0Jyk7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gW107XG4gICAgfVxuICAgIHRoaXMuZmlsdGVyRGF0YSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgZGF0YSBsb2NhbGx5XG4gICAqIEBwYXJhbSB2YWx1ZSB0aGUgZmlsdGVyaW5nIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgZmlsdGVyRGF0YSh2YWx1ZT86IHN0cmluZywgbG9hZE1vcmU/OiBib29sZWFuKTogdm9pZCB7XG4gICAgdmFsdWUgPSBVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgPyB2YWx1ZSA6IFV0aWwuaXNEZWZpbmVkKHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQpID8gdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5nZXRWYWx1ZSgpIDogdm9pZCAwO1xuICAgIGlmICh0aGlzLnN0YXRlICYmIFV0aWwuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgdGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBsZW5ndGg6IHRoaXMucXVlcnlSb3dzLFxuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9O1xuICAgICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRhdGFSZXNwb25zZUFycmF5ICYmIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkuc2xpY2UoMCk7XG4gICAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjYXNlU2Vuc2l0aXZlID0gdGhpcy5pc0ZpbHRlckNhc2VTZW5zaXRpdmUoKTtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhLmZpbHRlcihpdGVtID0+IHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5nZXRRdWlja0ZpbHRlckNvbHVtbnMoKS5zb21lKGNvbCA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWdFeHBTdHIgPSBVdGlsLmVzY2FwZVNwZWNpYWxDaGFyYWN0ZXIoVXRpbC5ub3JtYWxpemVTdHJpbmcodmFsdWUsICFjYXNlU2Vuc2l0aXZlKSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdFeHBTdHIpLnRlc3QoVXRpbC5ub3JtYWxpemVTdHJpbmcoaXRlbVtjb2xdICsgJycsICFjYXNlU2Vuc2l0aXZlKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5zb3J0Q29sdW1uT3JkZXIpKSB7XG4gICAgICAgIC8vIFNpbXBsZSBzb3J0aW5nXG4gICAgICAgIGNvbnN0IHNvcnQgPSB0aGlzLnNvcnRDb2x1bW5PcmRlcjtcbiAgICAgICAgY29uc3QgZmFjdG9yID0gKHNvcnQuYXNjZW5kZW50ID8gMSA6IC0xKTtcbiAgICAgICAgLy8gZmlsdGVyZWREYXRhID0gZmlsdGVyZWREYXRhLnNvcnQoKGEsIGIpID0+IChVdGlsLm5vcm1hbGl6ZVN0cmluZyhhW3NvcnQuY29sdW1uTmFtZV0pID4gVXRpbC5ub3JtYWxpemVTdHJpbmcoYltzb3J0LmNvbHVtbk5hbWVdKSkgPyAoMSAqIGZhY3RvcikgOiAoVXRpbC5ub3JtYWxpemVTdHJpbmcoYltzb3J0LmNvbHVtbk5hbWVdKSA+IFV0aWwubm9ybWFsaXplU3RyaW5nKGFbc29ydC5jb2x1bW5OYW1lXSkpID8gKC0xICogZmFjdG9yKSA6IDApO1xuICAgICAgICBmaWx0ZXJlZERhdGEuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGNvbnN0IGFPcCA9IGlzTmFOKGFbc29ydC5jb2x1bW5OYW1lXSkgPyBVdGlsLm5vcm1hbGl6ZVN0cmluZyhhW3NvcnQuY29sdW1uTmFtZV0pIDogYVtzb3J0LmNvbHVtbk5hbWVdO1xuICAgICAgICAgIGNvbnN0IGJPcCA9IGlzTmFOKGJbc29ydC5jb2x1bW5OYW1lXSkgPyBVdGlsLm5vcm1hbGl6ZVN0cmluZyhiW3NvcnQuY29sdW1uTmFtZV0pIDogYltzb3J0LmNvbHVtbk5hbWVdO1xuICAgICAgICAgIHJldHVybiAoYU9wID4gYk9wKSA/ICgxICogZmFjdG9yKSA6IChiT3AgPiBhT3ApID8gKC0xICogZmFjdG9yKSA6IDA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzKSB7XG4gICAgICAgIHRoaXMuZGF0YUFycmF5ID0gZmlsdGVyZWREYXRhLnNwbGljZSh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MsIHRoaXMucXVlcnlSb3dzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGF0YUFycmF5ID0gZmlsdGVyZWREYXRhLnNwbGljZSgwLCB0aGlzLnF1ZXJ5Um93cyAqICh0aGlzLmN1cnJlbnRQYWdlICsgMSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyR3JpZEl0ZW1EaXJlY3RpdmUoaXRlbTogT0dyaWRJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHNlbGYuZGV0YWlsTW9kZSA9PT0gQ29kZXMuREVUQUlMX01PREVfQ0xJQ0spIHtcbiAgICAgICAgaXRlbS5vbkNsaWNrKGdyaWRJdGVtID0+IHNlbGYub25JdGVtRGV0YWlsQ2xpY2soZ3JpZEl0ZW0pKTtcbiAgICAgIH1cbiAgICAgIGlmIChDb2Rlcy5pc0RvdWJsZUNsaWNrTW9kZShzZWxmLmRldGFpbE1vZGUpKSB7XG4gICAgICAgIGl0ZW0ub25Eb3VibGVDbGljayhncmlkSXRlbSA9PiBzZWxmLm9uSXRlbURldGFpbERibENsaWNrKGdyaWRJdGVtKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uSXRlbURldGFpbENsaWNrKGl0ZW06IE9HcmlkSXRlbURpcmVjdGl2ZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9lbmFibGVkICYmIHRoaXMuZGV0YWlsTW9kZSA9PT0gQ29kZXMuREVUQUlMX01PREVfQ0xJQ0spIHtcbiAgICAgIHRoaXMuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIHRoaXMudmlld0RldGFpbChpdGVtLmdldEl0ZW1EYXRhKCkpO1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vbkNsaWNrLCBpdGVtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25JdGVtRGV0YWlsRGJsQ2xpY2soaXRlbTogT0dyaWRJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgQ29kZXMuaXNEb3VibGVDbGlja01vZGUodGhpcy5kZXRhaWxNb2RlKSkge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGl0ZW0uZ2V0SXRlbURhdGEoKSk7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRG91YmxlQ2xpY2ssIGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGxvYWRNb3JlKCk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFBhZ2UgKz0gMTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0LFxuICAgICAgICBsZW5ndGg6IHRoaXMucXVlcnlSb3dzXG4gICAgICB9O1xuICAgICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbHRlckRhdGEodm9pZCAwLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdG90YWxSZWNvcmRzKCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRvdGFsUmVjb3Jkc051bWJlcigpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kYXRhUmVzcG9uc2VBcnJheS5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyOiBvYmplY3QsIG92cnJBcmdzPzogT1F1ZXJ5RGF0YUFyZ3MpOiBhbnlbXSB7XG4gICAgY29uc3QgcXVlcnlBcmd1bWVudHMgPSBzdXBlci5nZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXIsIG92cnJBcmdzKTtcbiAgICAvLyBxdWVyeUFyZ3VtZW50c1szXSA9IHRoaXMuZ2V0U3FsVHlwZXNGb3JGaWx0ZXIocXVlcnlBcmd1bWVudHNbMV0pO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuc29ydENvbHVtbikpIHtcbiAgICAgIHF1ZXJ5QXJndW1lbnRzWzZdID0gdGhpcy5zb3J0Q29sdW1uT3JkZXIgPyBbdGhpcy5zb3J0Q29sdW1uT3JkZXJdIDogdGhpcy5zb3J0Q29sdW1uT3JkZXI7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeUFyZ3VtZW50cztcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVNvcnRDb2x1bW4oKTogdm9pZCB7XG4gICAgY29uc3QgcGFyc2VkID0gKFNlcnZpY2VVdGlscy5wYXJzZVNvcnRDb2x1bW5zKHRoaXMuc29ydENvbHVtbikgfHwgW10pWzBdO1xuICAgIGNvbnN0IGV4aXN0cyA9IHBhcnNlZCA/IHRoaXMuc29ydGFibGVDb2x1bW5zLmZpbmQoKGl0ZW06IFNRTE9yZGVyKSA9PiAoaXRlbS5jb2x1bW5OYW1lID09PSBwYXJzZWQuY29sdW1uTmFtZSkgJiYgKGl0ZW0uYXNjZW5kZW50ID09PSBwYXJzZWQuYXNjZW5kZW50KSkgOiBmYWxzZTtcbiAgICBpZiAoZXhpc3RzKSB7XG4gICAgICB0aGlzLnNvcnRDb2x1bW5PcmRlciA9IHBhcnNlZDtcbiAgICB9XG4gIH1cblxuICBnZXQgY3VycmVudE9yZGVyQ29sdW1uKCk6IG51bWJlciB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnNvcnRDb2x1bW5PcmRlcikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGxldCBpbmRleDtcbiAgICB0aGlzLnNvcnRhYmxlQ29sdW1ucy5mb3JFYWNoKChpdGVtOiBTUUxPcmRlciwgaTogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAoKGl0ZW0uY29sdW1uTmFtZSA9PT0gdGhpcy5zb3J0Q29sdW1uT3JkZXIuY29sdW1uTmFtZSkgJiZcbiAgICAgICAgKGl0ZW0uYXNjZW5kZW50ID09PSB0aGlzLnNvcnRDb2x1bW5PcmRlci5hc2NlbmRlbnQpKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBzZXQgY3VycmVudE9yZGVyQ29sdW1uKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5zb3J0Q29sdW1uT3JkZXIgPSB0aGlzLnNvcnRhYmxlQ29sdW1uc1t2YWxdO1xuICB9XG5cbiAgcHVibGljIG9uQ2hhbmdlUGFnZShlOiBQYWdlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBlLnBhZ2VJbmRleDtcbiAgICAgIHRoaXMucXVlcnlSb3dzID0gZS5wYWdlU2l6ZTtcbiAgICAgIHRoaXMuZmlsdGVyRGF0YSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0YWJsZVN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGdvaW5nQmFjayA9IGUucGFnZUluZGV4IDwgdGhpcy5jdXJyZW50UGFnZTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gZS5wYWdlSW5kZXg7XG4gICAgY29uc3QgcGFnZVNpemUgPSBlLnBhZ2VTaXplO1xuXG4gICAgY29uc3Qgb2xkUXVlcnlSb3dzID0gdGhpcy5xdWVyeVJvd3M7XG4gICAgY29uc3QgY2hhbmdpbmdQYWdlU2l6ZSA9IChvbGRRdWVyeVJvd3MgIT09IHBhZ2VTaXplKTtcbiAgICB0aGlzLnF1ZXJ5Um93cyA9IHBhZ2VTaXplO1xuXG4gICAgbGV0IG5ld1N0YXJ0UmVjb3JkO1xuICAgIGxldCBxdWVyeUxlbmd0aDtcblxuICAgIGlmIChnb2luZ0JhY2sgfHwgY2hhbmdpbmdQYWdlU2l6ZSkge1xuICAgICAgbmV3U3RhcnRSZWNvcmQgPSAodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzKTtcbiAgICAgIHF1ZXJ5TGVuZ3RoID0gdGhpcy5xdWVyeVJvd3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1N0YXJ0UmVjb3JkID0gTWF0aC5tYXgodGFibGVTdGF0ZS5xdWVyeVJlY29yZE9mZnNldCwgKHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cykpO1xuICAgICAgY29uc3QgbmV3RW5kUmVjb3JkID0gTWF0aC5taW4obmV3U3RhcnRSZWNvcmQgKyB0aGlzLnF1ZXJ5Um93cywgdGFibGVTdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlcik7XG4gICAgICBxdWVyeUxlbmd0aCA9IE1hdGgubWluKHRoaXMucXVlcnlSb3dzLCBuZXdFbmRSZWNvcmQgLSBuZXdTdGFydFJlY29yZCk7XG4gICAgfVxuXG4gICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgIG9mZnNldDogbmV3U3RhcnRSZWNvcmQsXG4gICAgICBsZW5ndGg6IHF1ZXJ5TGVuZ3RoXG4gICAgfTtcbiAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RGF0YVRvU3RvcmUoKTogb2JqZWN0IHtcbiAgICBjb25zdCBkYXRhVG9TdG9yZSA9IHN1cGVyLmdldERhdGFUb1N0b3JlKCk7XG4gICAgZGF0YVRvU3RvcmVbJ2N1cnJlbnRQYWdlJ10gPSB0aGlzLmN1cnJlbnRQYWdlO1xuXG4gICAgaWYgKHRoaXMuc3RvcmVQYWdpbmF0aW9uU3RhdGUpIHtcbiAgICAgIGRhdGFUb1N0b3JlWydxdWVyeVJlY29yZE9mZnNldCddID0gTWF0aC5tYXgoXG4gICAgICAgICh0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0IC0gdGhpcy5kYXRhQXJyYXkubGVuZ3RoKSxcbiAgICAgICAgKHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgLSB0aGlzLnF1ZXJ5Um93cylcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSBkYXRhVG9TdG9yZVsncXVlcnlSZWNvcmRPZmZzZXQnXTtcbiAgICB9XG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5zb3J0Q29sdW1uT3JkZXIpKSB7XG4gICAgICBkYXRhVG9TdG9yZVsnc29ydC1jb2x1bW4nXSA9IHRoaXMuc29ydENvbHVtbk9yZGVyLmNvbHVtbk5hbWUgKyBDb2Rlcy5DT0xVTU5TX0FMSUFTX1NFUEFSQVRPUiArXG4gICAgICAgICh0aGlzLnNvcnRDb2x1bW5PcmRlci5hc2NlbmRlbnQgPyBDb2Rlcy5BU0NfU09SVCA6IENvZGVzLkRFU0NfU09SVCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhVG9TdG9yZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTb3J0T3B0aW9uVGV4dChjb2w6IFNRTE9yZGVyKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIGxldCBjb2xUZXh0S2V5ID0gYEdSSUQuU09SVF9CWV8ke2NvbC5jb2x1bW5OYW1lLnRvVXBwZXJDYXNlKCl9X2AgKyAoY29sLmFzY2VuZGVudCA/ICdBU0MnIDogJ0RFU0MnKTtcbiAgICByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KGNvbFRleHRLZXkpO1xuICAgIGlmIChyZXN1bHQgIT09IGNvbFRleHRLZXkpIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGNvbFRleHRLZXkgPSAnR1JJRC5TT1JUX0JZXycgKyAoY29sLmFzY2VuZGVudCA/ICdBU0MnIDogJ0RFU0MnKTtcbiAgICByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KGNvbFRleHRLZXksIFsodGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChjb2wuY29sdW1uTmFtZSkgfHwgJycpXSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXREYXRhKGRhdGE6IGFueSwgc3FsVHlwZXM/OiBhbnksIHJlcGxhY2U/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNBcnJheShkYXRhKSkge1xuICAgICAgbGV0IGRhdGFBcnJheSA9IGRhdGE7XG4gICAgICBsZXQgcmVzcERhdGFBcnJheSA9IGRhdGE7XG4gICAgICBpZiAoIXJlcGxhY2UpIHtcbiAgICAgICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgICBkYXRhQXJyYXkgPSB0aGlzLnBhZ2luYXRpb25Db250cm9scyA/IGRhdGEgOiAodGhpcy5kYXRhQXJyYXkgfHwgW10pLmNvbmNhdChkYXRhKTtcbiAgICAgICAgICByZXNwRGF0YUFycmF5ID0gdGhpcy5wYWdpbmF0aW9uQ29udHJvbHMgPyBkYXRhIDogKHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgfHwgW10pLmNvbmNhdChkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhQXJyYXkgPSBkYXRhLnNsaWNlKHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzID8gKCh0aGlzLnF1ZXJ5Um93cyAqICh0aGlzLmN1cnJlbnRQYWdlICsgMSkpIC0gdGhpcy5xdWVyeVJvd3MpIDogMCwgdGhpcy5xdWVyeVJvd3MgKiAodGhpcy5jdXJyZW50UGFnZSArIDEpKTtcbiAgICAgICAgICByZXNwRGF0YUFycmF5ID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kYXRhQXJyYXkgPSBkYXRhQXJyYXk7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gcmVzcERhdGFBcnJheTtcbiAgICAgIGlmICghdGhpcy5wYWdlYWJsZSkge1xuICAgICAgICB0aGlzLmZpbHRlckRhdGEoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhQXJyYXkgPSBbXTtcbiAgICAgIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgPSBbXTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblBhZ2luYXRlZERhdGFMb2FkZWQsIGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRGF0YUxvYWRlZCwgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTogdm9pZCB7XG4gICAgc3VwZXIuc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTtcbiAgICB0aGlzLnN0b3JlUGFnaW5hdGlvblN0YXRlID0gdHJ1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRHcmlkSXRlbURpcmVjdGl2ZXNEYXRhKCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZ3JpZEl0ZW1EaXJlY3RpdmVzLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuZ3JpZEl0ZW1EaXJlY3RpdmVzLnRvQXJyYXkoKS5mb3JFYWNoKChlbGVtZW50OiBPR3JpZEl0ZW1EaXJlY3RpdmUsIGluZGV4KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuc2V0SXRlbURhdGEoc2VsZi5kYXRhQXJyYXlbaW5kZXhdKTtcbiAgICAgICAgZWxlbWVudC5zZXRHcmlkQ29tcG9uZW50KHNlbGYpO1xuICAgICAgICBzZWxmLnJlZ2lzdGVyR3JpZEl0ZW1EaXJlY3RpdmUoZWxlbWVudCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=