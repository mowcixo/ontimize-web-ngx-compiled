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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ncmlkL28tZ3JpZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBSVIsUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsWUFBWSxFQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVwQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFbEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdkMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzFELE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3JHLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLHFC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QUMsQ0FBQztJQUNMLENBQUM7OztZQXplRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFNBQVMsRUFBRTtvQkFDVCx1QkFBdUI7aUJBQ3hCO2dCQUNELE1BQU0sRUFBRSxxQkFBcUI7Z0JBQzdCLE9BQU8sRUFBRSxzQkFBc0I7Z0JBQy9CLGt1SUFBc0M7Z0JBRXRDLElBQUksRUFBRTtvQkFDSixnQkFBZ0IsRUFBRSxNQUFNO29CQUN4QixzQkFBc0IsRUFBRSxhQUFhO2lCQUN0Qzs7YUFDRjs7O1lBL0VDLFFBQVE7WUFKUixVQUFVO1lBMEJILGNBQWMsdUJBc0tsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7Ozs2QkE3Q3JELGVBQWUsU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7aUNBRXBELFlBQVksU0FBQyxrQkFBa0I7MkJBRS9CLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQTdEMUM7SUFEQyxjQUFjLEVBQUU7O21EQUNtQjtBQUdwQztJQURDLGNBQWMsRUFBRTs7b0RBQ29CO0FBR3JDO0lBREMsY0FBYyxFQUFFOztnREFDZ0I7QUFHakM7SUFEQyxjQUFjLEVBQUU7O2tEQUNpQjtBQUtsQztJQURDLGNBQWMsRUFBRTs7cURBQ29CO0FBR3JDO0lBREMsY0FBYyxFQUFFOzswREFDMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1lZGlhQ2hhbmdlLCBNZWRpYU9ic2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuaW1wb3J0IHsgTWF0UGFnaW5hdG9yLCBQYWdlRXZlbnQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJR3JpZEl0ZW0gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tZ3JpZC1pdGVtLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBPUXVlcnlEYXRhQXJncyB9IGZyb20gJy4uLy4uL3R5cGVzL3F1ZXJ5LWRhdGEtYXJncy50eXBlJztcbmltcG9ydCB7IFNRTE9yZGVyIH0gZnJvbSAnLi4vLi4vdHlwZXMvc3FsLW9yZGVyLnR5cGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZVdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlsL2FzeW5jJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBTZXJ2aWNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3NlcnZpY2UudXRpbHMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQ09NUE9ORU5ULCBPU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL28tc2VydmljZS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT0dyaWRJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLWl0ZW0vby1ncmlkLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9HcmlkSXRlbURpcmVjdGl2ZSB9IGZyb20gJy4vZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmRpcmVjdGl2ZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0dSSUQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQsXG4gIC8vIGNvbHM6IEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkIGxpc3QuIERlZmF1bHQgaW4gZXh0cmEgc21hbGwgYW5kIHNtYWxsIHNjcmVlbiBpcyAxLCBpbiBtZWRpdW0gc2NyZWVuIGlzIDIsIGluIGxhcmdlIHNjcmVlbiBpcyAzIGFuZCBleHRyYSBsYXJnZSBzY3JlZW4gaXMgNC5cbiAgJ2NvbHMnLFxuICAvLyBwYWdlLXNpemUtb3B0aW9ucyBbc3RyaW5nXTogUGFnZSBzaXplIG9wdGlvbnMgc2VwYXJhdGVkIGJ5ICc7Jy5cbiAgJ3BhZ2VTaXplT3B0aW9uczogcGFnZS1zaXplLW9wdGlvbnMnLFxuICAvLyBzaG93LXBhZ2Utc2l6ZTpXaGV0aGVyIHRvIGhpZGUgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rpb24gVUkgZnJvbSB0aGUgdXNlci5cbiAgJ3Nob3dQYWdlU2l6ZTogc2hvdy1wYWdlLXNpemUnLFxuICAvLyBzaG93LXNvcnQ6d2hldGhlciBvciBub3QgdGhlIHNvcnQgc2VsZWN0IGlzIHNob3duIGluIHRoZSB0b29sYmFyXG4gICdzaG93U29ydDogb3JkZXJhYmxlJyxcbiAgLy8gc29ydGFibGVbc3RyaW5nXTogY29sdW1ucyBvZiB0aGUgZmlsdGVyLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NvcnRhYmxlQ29sdW1uczogc29ydGFibGUtY29sdW1ucycsXG4gIC8vIHNvcnRDb2x1bW5zW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIHNvcnRpbmdjb2x1bW5zLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NvcnRDb2x1bW46IHNvcnQtY29sdW1uJyxcbiAgLy8gcXVpY2stZmlsdGVyLWNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIGZpbHRlciwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdxdWlja0ZpbHRlckNvbHVtbnM6IHF1aWNrLWZpbHRlci1jb2x1bW5zJyxcbiAgLy8gIGdyaWQtaXRlbS1oZWlnaHRbc3RyaW5nXTogU2V0IGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHJvdyBoZWlnaHQgZnJvbSB0aGUgdXNlci1wcm92aWRlZCB2YWx1ZS4uIERlZmF1bHQ6IDE6MS5cbiAgJ2dyaWRJdGVtSGVpZ2h0OiBncmlkLWl0ZW0taGVpZ2h0JyxcbiAgLy8gcmVmcmVzaC1idXR0b24gW25vfHllc106IHNob3cgcmVmcmVzaCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ3JlZnJlc2hCdXR0b246IHJlZnJlc2gtYnV0dG9uJyxcbiAgLy8gcGFnaW5hdGlvbi1jb250cm9scyBbeWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHBhZ2luYXRpb24gY29udHJvbHMuIERlZmF1bHQ6IG5vLlxuICAncGFnaW5hdGlvbkNvbnRyb2xzOiBwYWdpbmF0aW9uLWNvbnRyb2xzJyxcbiAgLy8gZ3V0dGVyU2l6ZTogU2l6ZSBvZiB0aGUgZ3JpZCBsaXN0J3MgZ3V0dGVyIGluIHBpeGVscy5cbiAgJ2d1dHRlclNpemU6Z3V0dGVyLXNpemUnLFxuICAvLyBmaXgtaGVhZGVyIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IGZpeGVkIGZvb3RlciB3aGVuIHRoZSBjb250ZW50IGlzIGdyZWF0aGVyIHRoYW4gaXRzIG93biBoZWlnaHQuIERlZmF1bHQ6IG5vLlxuICAnZml4ZWRIZWFkZXI6Zml4ZWQtaGVhZGVyJyxcbiAgLy8gc2hvdy1mb290ZXI6SW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRvIHNob3cgdGhlIGZvb3RlcjpEZWZhdWx0OnRydWVcbiAgJ3Nob3dGb290ZXI6c2hvdy1mb290ZXInXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fR1JJRCA9IFtcbiAgJ29uQ2xpY2snLFxuICAnb25Eb3VibGVDbGljaycsXG4gICdvbkRhdGFMb2FkZWQnLFxuICAnb25QYWdpbmF0ZWREYXRhTG9hZGVkJ1xuXTtcblxuY29uc3QgUEFHRV9TSVpFX09QVElPTlMgPSBbOCwgMTYsIDI0LCAzMiwgNjRdO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWdyaWQnLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlclxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fR1JJRCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fR1JJRCxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZ3JpZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZ3JpZC5jb21wb25lbnQuc2NzcyddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWdyaWRdJzogJ3RydWUnLFxuICAgICdbY2xhc3Muby1ncmlkLWZpeGVkXSc6ICdmaXhlZEhlYWRlcicsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0dyaWRDb21wb25lbnQgZXh0ZW5kcyBPU2VydmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQge1xuXG4gIC8qIElucHV0cyAqL1xuICBwdWJsaWMgcXVlcnlSb3dzOiBudW1iZXIgPSAzMjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZml4ZWRIZWFkZXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2hvd1BhZ2VTaXplOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dTb3J0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dGb290ZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHB1YmxpYyBncmlkSXRlbUhlaWdodCA9ICcxOjEnO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyByZWZyZXNoQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgcGFnaW5hdGlvbkNvbnRyb2xzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIGd1dHRlclNpemUgPSAnMXB4JztcblxuICBnZXQgY29scygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jb2xzIHx8IHRoaXMuX2NvbHNEZWZhdWx0O1xuICB9XG4gIHNldCBjb2xzKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb2xzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcGFnZVNpemVPcHRpb25zKCk6IG51bWJlcltdIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZVNpemVPcHRpb25zO1xuICB9XG4gIHNldCBwYWdlU2l6ZU9wdGlvbnModmFsOiBudW1iZXJbXSkge1xuICAgIGlmICghKHZhbCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgdmFsID0gVXRpbC5wYXJzZUFycmF5KFN0cmluZyh2YWwpKS5tYXAoYSA9PiBwYXJzZUludChhLCAxMCkpO1xuICAgIH1cbiAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMgPSB2YWw7XG4gIH1cblxuICBnZXQgc29ydGFibGVDb2x1bW5zKCk6IFNRTE9yZGVyW10ge1xuICAgIHJldHVybiB0aGlzLl9zb3J0YWJsZUNvbHVtbnM7XG4gIH1cbiAgc2V0IHNvcnRhYmxlQ29sdW1ucyh2YWwpIHtcbiAgICBsZXQgcGFyc2VkID0gW107XG4gICAgaWYgKCFVdGlsLmlzQXJyYXkodmFsKSkge1xuICAgICAgcGFyc2VkID0gU2VydmljZVV0aWxzLnBhcnNlU29ydENvbHVtbnMoU3RyaW5nKHZhbCkpO1xuICAgIH1cbiAgICB0aGlzLl9zb3J0YWJsZUNvbHVtbnMgPSBwYXJzZWQ7XG4gIH1cblxuICBwdWJsaWMgcXVpY2tGaWx0ZXJDb2x1bW5zOiBzdHJpbmc7XG4gIC8qIEVuZCBJbnB1dHMgKi9cblxuICBwdWJsaWMgb25DbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkRvdWJsZUNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblBhZ2luYXRlZERhdGFMb2FkZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBPR3JpZEl0ZW1Db21wb25lbnQpKVxuICBwdWJsaWMgaW5wdXRHcmlkSXRlbXM6IFF1ZXJ5TGlzdDxPR3JpZEl0ZW1Db21wb25lbnQ+O1xuICBAVmlld0NoaWxkcmVuKE9HcmlkSXRlbURpcmVjdGl2ZSlcbiAgcHVibGljIGdyaWRJdGVtRGlyZWN0aXZlczogUXVlcnlMaXN0PE9HcmlkSXRlbURpcmVjdGl2ZT47XG4gIEBWaWV3Q2hpbGQoTWF0UGFnaW5hdG9yLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIG1hdHBhZ2luYXRvcjogTWF0UGFnaW5hdG9yO1xuXG4gIC8qIFBhcnNlZCBJbnB1dHMgKi9cbiAgcHJvdGVjdGVkIF9zb3J0YWJsZUNvbHVtbnM6IFNRTE9yZGVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHNvcnRDb2x1bW5PcmRlcjogU1FMT3JkZXI7XG4gIC8qIEVuZCBwYXJzZWQgSW5wdXRzICovXG5cbiAgcHJvdGVjdGVkIF9jb2xzO1xuICBwcm90ZWN0ZWQgX2NvbHNEZWZhdWx0ID0gMTtcbiAgcHJvdGVjdGVkIF9wYWdlU2l6ZU9wdGlvbnMgPSBQQUdFX1NJWkVfT1BUSU9OUztcbiAgcHJvdGVjdGVkIHNvcnRDb2x1bW46IHN0cmluZztcbiAgcHJvdGVjdGVkIGRhdGFSZXNwb25zZUFycmF5OiBhbnlbXSA9IFtdO1xuICBwcm90ZWN0ZWQgc3RvcmVQYWdpbmF0aW9uU3RhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBzZXQgZ3JpZEl0ZW1zKHZhbHVlOiBJR3JpZEl0ZW1bXSkge1xuICAgIHRoaXMuX2dyaWRJdGVtcyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGdyaWRJdGVtcygpOiBJR3JpZEl0ZW1bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2dyaWRJdGVtcztcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ3JpZEl0ZW1zOiBJR3JpZEl0ZW1bXSA9IFtdO1xuXG4gIHNldCBjdXJyZW50UGFnZSh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX2N1cnJlbnRQYWdlID0gdmFsO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQYWdlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYWdlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jdXJyZW50UGFnZTogbnVtYmVyID0gMDtcblxuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gIHByb3RlY3RlZCBtZWRpYTogTWVkaWFPYnNlcnZlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnRcbiAgKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IsIGVsUmVmLCBmb3JtKTtcbiAgICB0aGlzLm1lZGlhID0gdGhpcy5pbmplY3Rvci5nZXQoTWVkaWFPYnNlcnZlcik7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnc29ydC1jb2x1bW4nKSkge1xuICAgICAgdGhpcy5zb3J0Q29sdW1uID0gdGhpcy5zdGF0ZVsnc29ydC1jb2x1bW4nXTtcbiAgICB9XG5cbiAgICB0aGlzLnBhcnNlU29ydENvbHVtbigpO1xuXG4gICAgY29uc3QgZXhpc3RpbmdPcHRpb24gPSB0aGlzLnBhZ2VTaXplT3B0aW9ucy5maW5kKG9wdGlvbiA9PiBvcHRpb24gPT09IHRoaXMucXVlcnlSb3dzKTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKGV4aXN0aW5nT3B0aW9uKSkge1xuICAgICAgdGhpcy5fcGFnZVNpemVPcHRpb25zLnB1c2godGhpcy5xdWVyeVJvd3MpO1xuICAgICAgdGhpcy5fcGFnZVNpemVPcHRpb25zLnNvcnQoKGk6IG51bWJlciwgajogbnVtYmVyKSA9PiBpIC0gaik7XG4gICAgfVxuXG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29sdW1ucykpIHtcbiAgICAgIHRoaXMucXVpY2tGaWx0ZXJDb2x1bW5zID0gdGhpcy5jb2x1bW5zO1xuICAgIH1cbiAgICB0aGlzLnF1aWNrRmlsdGVyQ29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5xdWlja0ZpbHRlckNvbHVtbnMsIHRydWUpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2N1cnJlbnRQYWdlJykpIHtcbiAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnN0YXRlWydjdXJyZW50UGFnZSddO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnF1ZXJ5T25Jbml0KSB7XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIuYWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMuc2V0R3JpZEl0ZW1EaXJlY3RpdmVzRGF0YSgpO1xuICAgIGlmICh0aGlzLnNlYXJjaElucHV0Q29tcG9uZW50KSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyUXVpY2tGaWx0ZXIodGhpcy5zZWFyY2hJbnB1dENvbXBvbmVudCk7XG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlVG9NZWRpYUNoYW5nZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5ncmlkSXRlbXMgPSB0aGlzLmlucHV0R3JpZEl0ZW1zLnRvQXJyYXkoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQodGhpcy5pbnB1dEdyaWRJdGVtcy5jaGFuZ2VzLnN1YnNjcmliZShxdWVyeUNoYW5nZXMgPT4ge1xuICAgICAgdGhpcy5ncmlkSXRlbXMgPSBxdWVyeUNoYW5nZXMuX3Jlc3VsdHM7XG4gICAgfSkpO1xuICB9XG5cbiAgcHVibGljIHN1YnNjcmliZVRvTWVkaWFDaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZCh0aGlzLm1lZGlhLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoY2hhbmdlOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gICAgICBpZiAoY2hhbmdlICYmIGNoYW5nZVswXSkge1xuICAgICAgICBzd2l0Y2ggKGNoYW5nZVswXS5tcUFsaWFzKSB7XG4gICAgICAgICAgY2FzZSAneHMnOlxuICAgICAgICAgIGNhc2UgJ3NtJzpcbiAgICAgICAgICAgIHRoaXMuX2NvbHNEZWZhdWx0ID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ21kJzpcbiAgICAgICAgICAgIHRoaXMuX2NvbHNEZWZhdWx0ID0gMjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2xnJzpcbiAgICAgICAgICBjYXNlICd4bCc6XG4gICAgICAgICAgICB0aGlzLl9jb2xzRGVmYXVsdCA9IDQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgcmVsb2FkRGF0YSgpOiB2b2lkIHtcbiAgICBsZXQgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHt9O1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0ID0gMDtcbiAgICAgIHF1ZXJ5QXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiB0aGlzLnBhZ2luYXRpb25Db250cm9scyA/ICh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MpIDogMCxcbiAgICAgICAgbGVuZ3RoOiBNYXRoLm1heCh0aGlzLnF1ZXJ5Um93cywgdGhpcy5kYXRhUmVzcG9uc2VBcnJheS5sZW5ndGgpLFxuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9O1xuICAgIH1cbiAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gIH1cblxuICBwdWJsaWMgcmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gMDtcbiAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gW107XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gIH1cblxuXG4gIHB1YmxpYyBzZXREYXRhQXJyYXkoZGF0YTogYW55KTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNBcnJheShkYXRhKSkge1xuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IGRhdGE7XG4gICAgfSBlbHNlIGlmIChVdGlsLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gW2RhdGFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCBoYXMgcmVjZWl2ZWQgbm90IHN1cHBvcnRlZCBzZXJ2aWNlIGRhdGEuIFN1cHBvcnRlZCBkYXRhIGFyZSBBcnJheSBvciBPYmplY3QnKTtcbiAgICAgIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5maWx0ZXJEYXRhKCk7XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVycyBkYXRhIGxvY2FsbHlcbiAgICogQHBhcmFtIHZhbHVlIHRoZSBmaWx0ZXJpbmcgdmFsdWVcbiAgICovXG4gIHB1YmxpYyBmaWx0ZXJEYXRhKHZhbHVlPzogc3RyaW5nLCBsb2FkTW9yZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB2YWx1ZSA9IFV0aWwuaXNEZWZpbmVkKHZhbHVlKSA/IHZhbHVlIDogVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkgPyB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50LmdldFZhbHVlKCkgOiB2b2lkIDA7XG4gICAgaWYgKHRoaXMuc3RhdGUgJiYgVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICB0aGlzLnN0YXRlLmZpbHRlclZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgICBvZmZzZXQ6IDAsXG4gICAgICAgIGxlbmd0aDogdGhpcy5xdWVyeVJvd3MsXG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH07XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgJiYgdGhpcy5kYXRhUmVzcG9uc2VBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgZmlsdGVyZWREYXRhID0gdGhpcy5kYXRhUmVzcG9uc2VBcnJheS5zbGljZSgwKTtcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGNhc2VTZW5zaXRpdmUgPSB0aGlzLmlzRmlsdGVyQ2FzZVNlbnNpdGl2ZSgpO1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGEuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICAgIHJldHVybiBzZWxmLmdldFF1aWNrRmlsdGVyQ29sdW1ucygpLnNvbWUoY29sID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlZ0V4cFN0ciA9IFV0aWwuZXNjYXBlU3BlY2lhbENoYXJhY3RlcihVdGlsLm5vcm1hbGl6ZVN0cmluZyh2YWx1ZSwgIWNhc2VTZW5zaXRpdmUpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHJlZ0V4cFN0cikudGVzdChVdGlsLm5vcm1hbGl6ZVN0cmluZyhpdGVtW2NvbF0gKyAnJywgIWNhc2VTZW5zaXRpdmUpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnNvcnRDb2x1bW5PcmRlcikpIHtcbiAgICAgICAgLy8gU2ltcGxlIHNvcnRpbmdcbiAgICAgICAgY29uc3Qgc29ydCA9IHRoaXMuc29ydENvbHVtbk9yZGVyO1xuICAgICAgICBjb25zdCBmYWN0b3IgPSAoc29ydC5hc2NlbmRlbnQgPyAxIDogLTEpO1xuICAgICAgICAvLyBmaWx0ZXJlZERhdGEgPSBmaWx0ZXJlZERhdGEuc29ydCgoYSwgYikgPT4gKFV0aWwubm9ybWFsaXplU3RyaW5nKGFbc29ydC5jb2x1bW5OYW1lXSkgPiBVdGlsLm5vcm1hbGl6ZVN0cmluZyhiW3NvcnQuY29sdW1uTmFtZV0pKSA/ICgxICogZmFjdG9yKSA6IChVdGlsLm5vcm1hbGl6ZVN0cmluZyhiW3NvcnQuY29sdW1uTmFtZV0pID4gVXRpbC5ub3JtYWxpemVTdHJpbmcoYVtzb3J0LmNvbHVtbk5hbWVdKSkgPyAoLTEgKiBmYWN0b3IpIDogMCk7XG4gICAgICAgIGZpbHRlcmVkRGF0YS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgY29uc3QgYU9wID0gaXNOYU4oYVtzb3J0LmNvbHVtbk5hbWVdKSA/IFV0aWwubm9ybWFsaXplU3RyaW5nKGFbc29ydC5jb2x1bW5OYW1lXSkgOiBhW3NvcnQuY29sdW1uTmFtZV07XG4gICAgICAgICAgY29uc3QgYk9wID0gaXNOYU4oYltzb3J0LmNvbHVtbk5hbWVdKSA/IFV0aWwubm9ybWFsaXplU3RyaW5nKGJbc29ydC5jb2x1bW5OYW1lXSkgOiBiW3NvcnQuY29sdW1uTmFtZV07XG4gICAgICAgICAgcmV0dXJuIChhT3AgPiBiT3ApID8gKDEgKiBmYWN0b3IpIDogKGJPcCA+IGFPcCkgPyAoLTEgKiBmYWN0b3IpIDogMDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgICAgdGhpcy5kYXRhQXJyYXkgPSBmaWx0ZXJlZERhdGEuc3BsaWNlKHRoaXMuY3VycmVudFBhZ2UgKiB0aGlzLnF1ZXJ5Um93cywgdGhpcy5xdWVyeVJvd3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYXRhQXJyYXkgPSBmaWx0ZXJlZERhdGEuc3BsaWNlKDAsIHRoaXMucXVlcnlSb3dzICogKHRoaXMuY3VycmVudFBhZ2UgKyAxKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gdGhpcy5kYXRhUmVzcG9uc2VBcnJheTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJHcmlkSXRlbURpcmVjdGl2ZShpdGVtOiBPR3JpZEl0ZW1EaXJlY3RpdmUpOiB2b2lkIHtcbiAgICBpZiAoaXRlbSkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBpZiAoc2VsZi5kZXRhaWxNb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykge1xuICAgICAgICBpdGVtLm9uQ2xpY2soZ3JpZEl0ZW0gPT4gc2VsZi5vbkl0ZW1EZXRhaWxDbGljayhncmlkSXRlbSkpO1xuICAgICAgfVxuICAgICAgaWYgKENvZGVzLmlzRG91YmxlQ2xpY2tNb2RlKHNlbGYuZGV0YWlsTW9kZSkpIHtcbiAgICAgICAgaXRlbS5vbkRvdWJsZUNsaWNrKGdyaWRJdGVtID0+IHNlbGYub25JdGVtRGV0YWlsRGJsQ2xpY2soZ3JpZEl0ZW0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25JdGVtRGV0YWlsQ2xpY2soaXRlbTogT0dyaWRJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgdGhpcy5kZXRhaWxNb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGl0ZW0uZ2V0SXRlbURhdGEoKSk7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ2xpY2ssIGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkl0ZW1EZXRhaWxEYmxDbGljayhpdGVtOiBPR3JpZEl0ZW1EaXJlY3RpdmUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vZW5hYmxlZCAmJiBDb2Rlcy5pc0RvdWJsZUNsaWNrTW9kZSh0aGlzLmRldGFpbE1vZGUpKSB7XG4gICAgICB0aGlzLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgICB0aGlzLnZpZXdEZXRhaWwoaXRlbS5nZXRJdGVtRGF0YSgpKTtcbiAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Eb3VibGVDbGljaywgaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbG9hZE1vcmUoKTogdm9pZCB7XG4gICAgdGhpcy5jdXJyZW50UGFnZSArPSAxO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgICBvZmZzZXQ6IHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQsXG4gICAgICAgIGxlbmd0aDogdGhpcy5xdWVyeVJvd3NcbiAgICAgIH07XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSh2b2lkIDAsIHF1ZXJ5QXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsdGVyRGF0YSh2b2lkIDAsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0b3RhbFJlY29yZHMoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0VG90YWxSZWNvcmRzTnVtYmVyKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRhdGFSZXNwb25zZUFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXI6IG9iamVjdCwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncyk6IGFueVtdIHtcbiAgICBjb25zdCBxdWVyeUFyZ3VtZW50cyA9IHN1cGVyLmdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlciwgb3ZyckFyZ3MpO1xuICAgIC8vIHF1ZXJ5QXJndW1lbnRzWzNdID0gdGhpcy5nZXRTcWxUeXBlc0ZvckZpbHRlcihxdWVyeUFyZ3VtZW50c1sxXSk7XG4gICAgaWYgKHRoaXMucGFnZWFibGUgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5zb3J0Q29sdW1uKSkge1xuICAgICAgcXVlcnlBcmd1bWVudHNbNl0gPSB0aGlzLnNvcnRDb2x1bW5PcmRlciA/IFt0aGlzLnNvcnRDb2x1bW5PcmRlcl0gOiB0aGlzLnNvcnRDb2x1bW5PcmRlcjtcbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5QXJndW1lbnRzO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU29ydENvbHVtbigpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJzZWQgPSAoU2VydmljZVV0aWxzLnBhcnNlU29ydENvbHVtbnModGhpcy5zb3J0Q29sdW1uKSB8fCBbXSlbMF07XG4gICAgY29uc3QgZXhpc3RzID0gcGFyc2VkID8gdGhpcy5zb3J0YWJsZUNvbHVtbnMuZmluZCgoaXRlbTogU1FMT3JkZXIpID0+IChpdGVtLmNvbHVtbk5hbWUgPT09IHBhcnNlZC5jb2x1bW5OYW1lKSAmJiAoaXRlbS5hc2NlbmRlbnQgPT09IHBhcnNlZC5hc2NlbmRlbnQpKSA6IGZhbHNlO1xuICAgIGlmIChleGlzdHMpIHtcbiAgICAgIHRoaXMuc29ydENvbHVtbk9yZGVyID0gcGFyc2VkO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjdXJyZW50T3JkZXJDb2x1bW4oKTogbnVtYmVyIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuc29ydENvbHVtbk9yZGVyKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgbGV0IGluZGV4O1xuICAgIHRoaXMuc29ydGFibGVDb2x1bW5zLmZvckVhY2goKGl0ZW06IFNRTE9yZGVyLCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGlmICgoaXRlbS5jb2x1bW5OYW1lID09PSB0aGlzLnNvcnRDb2x1bW5PcmRlci5jb2x1bW5OYW1lKSAmJlxuICAgICAgICAoaXRlbS5hc2NlbmRlbnQgPT09IHRoaXMuc29ydENvbHVtbk9yZGVyLmFzY2VuZGVudCkpIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHNldCBjdXJyZW50T3JkZXJDb2x1bW4odmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLnNvcnRDb2x1bW5PcmRlciA9IHRoaXMuc29ydGFibGVDb2x1bW5zW3ZhbF07XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2VQYWdlKGU6IFBhZ2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wYWdlYWJsZSkge1xuICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IGUucGFnZUluZGV4O1xuICAgICAgdGhpcy5xdWVyeVJvd3MgPSBlLnBhZ2VTaXplO1xuICAgICAgdGhpcy5maWx0ZXJEYXRhKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRhYmxlU3RhdGUgPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgZ29pbmdCYWNrID0gZS5wYWdlSW5kZXggPCB0aGlzLmN1cnJlbnRQYWdlO1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSBlLnBhZ2VJbmRleDtcbiAgICBjb25zdCBwYWdlU2l6ZSA9IGUucGFnZVNpemU7XG5cbiAgICBjb25zdCBvbGRRdWVyeVJvd3MgPSB0aGlzLnF1ZXJ5Um93cztcbiAgICBjb25zdCBjaGFuZ2luZ1BhZ2VTaXplID0gKG9sZFF1ZXJ5Um93cyAhPT0gcGFnZVNpemUpO1xuICAgIHRoaXMucXVlcnlSb3dzID0gcGFnZVNpemU7XG5cbiAgICBsZXQgbmV3U3RhcnRSZWNvcmQ7XG4gICAgbGV0IHF1ZXJ5TGVuZ3RoO1xuXG4gICAgaWYgKGdvaW5nQmFjayB8fCBjaGFuZ2luZ1BhZ2VTaXplKSB7XG4gICAgICBuZXdTdGFydFJlY29yZCA9ICh0aGlzLmN1cnJlbnRQYWdlICogdGhpcy5xdWVyeVJvd3MpO1xuICAgICAgcXVlcnlMZW5ndGggPSB0aGlzLnF1ZXJ5Um93cztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U3RhcnRSZWNvcmQgPSBNYXRoLm1heCh0YWJsZVN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0LCAodGhpcy5jdXJyZW50UGFnZSAqIHRoaXMucXVlcnlSb3dzKSk7XG4gICAgICBjb25zdCBuZXdFbmRSZWNvcmQgPSBNYXRoLm1pbihuZXdTdGFydFJlY29yZCArIHRoaXMucXVlcnlSb3dzLCB0YWJsZVN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyKTtcbiAgICAgIHF1ZXJ5TGVuZ3RoID0gTWF0aC5taW4odGhpcy5xdWVyeVJvd3MsIG5ld0VuZFJlY29yZCAtIG5ld1N0YXJ0UmVjb3JkKTtcbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgb2Zmc2V0OiBuZXdTdGFydFJlY29yZCxcbiAgICAgIGxlbmd0aDogcXVlcnlMZW5ndGhcbiAgICB9O1xuICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREYXRhVG9TdG9yZSgpOiBvYmplY3Qge1xuICAgIGNvbnN0IGRhdGFUb1N0b3JlID0gc3VwZXIuZ2V0RGF0YVRvU3RvcmUoKTtcbiAgICBkYXRhVG9TdG9yZVsnY3VycmVudFBhZ2UnXSA9IHRoaXMuY3VycmVudFBhZ2U7XG5cbiAgICBpZiAodGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSkge1xuICAgICAgZGF0YVRvU3RvcmVbJ3F1ZXJ5UmVjb3JkT2Zmc2V0J10gPSBNYXRoLm1heChcbiAgICAgICAgKHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgLSB0aGlzLmRhdGFBcnJheS5sZW5ndGgpLFxuICAgICAgICAodGhpcy5zdGF0ZS5xdWVyeVJlY29yZE9mZnNldCAtIHRoaXMucXVlcnlSb3dzKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIGRhdGFUb1N0b3JlWydxdWVyeVJlY29yZE9mZnNldCddO1xuICAgIH1cblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnNvcnRDb2x1bW5PcmRlcikpIHtcbiAgICAgIGRhdGFUb1N0b3JlWydzb3J0LWNvbHVtbiddID0gdGhpcy5zb3J0Q29sdW1uT3JkZXIuY29sdW1uTmFtZSArIENvZGVzLkNPTFVNTlNfQUxJQVNfU0VQQVJBVE9SICtcbiAgICAgICAgKHRoaXMuc29ydENvbHVtbk9yZGVyLmFzY2VuZGVudCA/IENvZGVzLkFTQ19TT1JUIDogQ29kZXMuREVTQ19TT1JUKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFUb1N0b3JlO1xuICB9XG5cbiAgcHVibGljIGdldFNvcnRPcHRpb25UZXh0KGNvbDogU1FMT3JkZXIpOiBzdHJpbmcge1xuICAgIGxldCByZXN1bHQ7XG4gICAgbGV0IGNvbFRleHRLZXkgPSBgR1JJRC5TT1JUX0JZXyR7Y29sLmNvbHVtbk5hbWUudG9VcHBlckNhc2UoKX1fYCArIChjb2wuYXNjZW5kZW50ID8gJ0FTQycgOiAnREVTQycpO1xuICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoY29sVGV4dEtleSk7XG4gICAgaWYgKHJlc3VsdCAhPT0gY29sVGV4dEtleSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgY29sVGV4dEtleSA9ICdHUklELlNPUlRfQllfJyArIChjb2wuYXNjZW5kZW50ID8gJ0FTQycgOiAnREVTQycpO1xuICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoY29sVGV4dEtleSwgWyh0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KGNvbC5jb2x1bW5OYW1lKSB8fCAnJyldKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldERhdGEoZGF0YTogYW55LCBzcWxUeXBlcz86IGFueSwgcmVwbGFjZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBsZXQgZGF0YUFycmF5ID0gZGF0YTtcbiAgICAgIGxldCByZXNwRGF0YUFycmF5ID0gZGF0YTtcbiAgICAgIGlmICghcmVwbGFjZSkge1xuICAgICAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgICAgIGRhdGFBcnJheSA9IHRoaXMucGFnaW5hdGlvbkNvbnRyb2xzID8gZGF0YSA6ICh0aGlzLmRhdGFBcnJheSB8fCBbXSkuY29uY2F0KGRhdGEpO1xuICAgICAgICAgIHJlc3BEYXRhQXJyYXkgPSB0aGlzLnBhZ2luYXRpb25Db250cm9scyA/IGRhdGEgOiAodGhpcy5kYXRhUmVzcG9uc2VBcnJheSB8fCBbXSkuY29uY2F0KGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGFBcnJheSA9IGRhdGEuc2xpY2UodGhpcy5wYWdpbmF0aW9uQ29udHJvbHMgPyAoKHRoaXMucXVlcnlSb3dzICogKHRoaXMuY3VycmVudFBhZ2UgKyAxKSkgLSB0aGlzLnF1ZXJ5Um93cykgOiAwLCB0aGlzLnF1ZXJ5Um93cyAqICh0aGlzLmN1cnJlbnRQYWdlICsgMSkpO1xuICAgICAgICAgIHJlc3BEYXRhQXJyYXkgPSBkYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IGRhdGFBcnJheTtcbiAgICAgIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkgPSByZXNwRGF0YUFycmF5O1xuICAgICAgaWYgKCF0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyRGF0YSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IFtdO1xuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IFtdO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uUGFnaW5hdGVkRGF0YUxvYWRlZCwgZGF0YSk7XG4gICAgfVxuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25EYXRhTG9hZGVkLCB0aGlzLmRhdGFSZXNwb25zZUFycmF5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpOiB2b2lkIHtcbiAgICBzdXBlci5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgIHRoaXMuc3RvcmVQYWdpbmF0aW9uU3RhdGUgPSB0cnVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldEdyaWRJdGVtRGlyZWN0aXZlc0RhdGEoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5ncmlkSXRlbURpcmVjdGl2ZXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5ncmlkSXRlbURpcmVjdGl2ZXMudG9BcnJheSgpLmZvckVhY2goKGVsZW1lbnQ6IE9HcmlkSXRlbURpcmVjdGl2ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgZWxlbWVudC5zZXRJdGVtRGF0YShzZWxmLmRhdGFBcnJheVtpbmRleF0pO1xuICAgICAgICBlbGVtZW50LnNldEdyaWRDb21wb25lbnQoc2VsZik7XG4gICAgICAgIHNlbGYucmVnaXN0ZXJHcmlkSXRlbURpcmVjdGl2ZShlbGVtZW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==