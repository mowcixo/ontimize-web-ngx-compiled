import { Injector, OnInit } from '@angular/core';
import { OTablePaginator } from '../../../../../interfaces/o-table-paginator.interface';
import { OTableComponent } from '../../../o-table.component';
import { OBaseTablePaginator } from './o-base-table-paginator.class';
export declare const DEFAULT_PAGINATOR_TABLE: string[];
export declare class OTablePaginatorComponent extends OBaseTablePaginator implements OTablePaginator, OnInit {
    protected injector: Injector;
    protected table: OTableComponent;
    protected _pageIndex: number;
    protected _pageSize: number;
    protected _pageSizeOptions: Array<any>;
    showFirstLastButtons: boolean;
    constructor(injector: Injector, table: OTableComponent);
    ngOnInit(): void;
    pageIndex: number;
    isShowingAllRows(selectedLength: number): boolean;
}
