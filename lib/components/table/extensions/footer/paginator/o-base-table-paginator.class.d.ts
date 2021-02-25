import { OTablePaginator } from '../../../../../interfaces/o-table-paginator.interface';
export declare class OBaseTablePaginator implements OTablePaginator {
    protected _pageIndex: number;
    protected _pageSize: number;
    protected _pageSizeOptions: Array<any>;
    showFirstLastButtons: boolean;
    constructor();
    pageLenght: number;
    pageIndex: number;
    pageSize: number;
    pageSizeOptions: Array<any>;
    isShowingAllRows(selectedLength: any): boolean;
}
