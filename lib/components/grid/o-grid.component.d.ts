import { AfterViewInit, ElementRef, EventEmitter, Injector, OnChanges, OnDestroy, OnInit, QueryList } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatPaginator, PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { IGridItem } from '../../interfaces/o-grid-item.interface';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { SQLOrder } from '../../types/sql-order.type';
import { OFormComponent } from '../form/o-form.component';
import { OServiceComponent } from '../o-service-component.class';
import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';
export declare const DEFAULT_INPUTS_O_GRID: string[];
export declare const DEFAULT_OUTPUTS_O_GRID: string[];
export declare class OGridComponent extends OServiceComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
    queryRows: number;
    fixedHeader: boolean;
    showPageSize: boolean;
    showSort: boolean;
    showFooter: boolean;
    gridItemHeight: string;
    refreshButton: boolean;
    paginationControls: boolean;
    gutterSize: string;
    cols: number;
    pageSizeOptions: number[];
    sortableColumns: SQLOrder[];
    quickFilterColumns: string;
    onClick: EventEmitter<any>;
    onDoubleClick: EventEmitter<any>;
    onDataLoaded: EventEmitter<any>;
    onPaginatedDataLoaded: EventEmitter<any>;
    inputGridItems: QueryList<OGridItemComponent>;
    gridItemDirectives: QueryList<OGridItemDirective>;
    matpaginator: MatPaginator;
    protected _sortableColumns: SQLOrder[];
    protected sortColumnOrder: SQLOrder;
    protected _cols: any;
    protected _colsDefault: number;
    protected _pageSizeOptions: number[];
    protected sortColumn: string;
    protected dataResponseArray: any[];
    protected storePaginationState: boolean;
    gridItems: IGridItem[];
    protected _gridItems: IGridItem[];
    currentPage: number;
    protected _currentPage: number;
    protected subscription: Subscription;
    protected media: MediaObserver;
    constructor(injector: Injector, elRef: ElementRef, form: OFormComponent);
    ngOnInit(): void;
    initialize(): void;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    subscribeToMediaChanges(): void;
    reloadData(): void;
    reloadPaginatedDataFromStart(): void;
    setDataArray(data: any): void;
    filterData(value?: string, loadMore?: boolean): void;
    registerGridItemDirective(item: OGridItemDirective): void;
    onItemDetailClick(item: OGridItemDirective): void;
    onItemDetailDblClick(item: OGridItemDirective): void;
    ngOnDestroy(): void;
    destroy(): void;
    loadMore(): void;
    readonly totalRecords: number;
    getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): any[];
    parseSortColumn(): void;
    currentOrderColumn: number;
    onChangePage(e: PageEvent): void;
    getDataToStore(): object;
    getSortOptionText(col: SQLOrder): string;
    protected setData(data: any, sqlTypes?: any, replace?: boolean): void;
    protected saveDataNavigationInLocalStorage(): void;
    protected setGridItemDirectivesData(): void;
}
