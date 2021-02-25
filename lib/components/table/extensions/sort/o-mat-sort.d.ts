import { EventEmitter } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material';
import { SQLOrder } from '../../../../types/sql-order.type';
export declare type OMatSortGroupedData = {
    key: any;
    values: any[];
};
export declare class OMatSort extends MatSort {
    activeArray: Array<MatSortable>;
    directionById: any;
    protected multipleSort: boolean;
    protected activeSortColumn: string;
    protected activeSortDirection: string;
    readonly oSortChange: EventEmitter<any>;
    setMultipleSort(val: boolean): void;
    getSortColumns(): any[];
    setTableInfo(sortColArray: Array<SQLOrder>): void;
    addSortColumn(sortable: MatSortable): void;
    protected deleteSortColumn(id: string): void;
    isActive(sortable: MatSortable): boolean;
    hasDirection(id: any): boolean;
    getSortedData(data: any[]): any[];
    protected sortByColumns(data: any[], sortColumns: any[]): any[];
    protected getDataGrouped(data: any, sortColumns: any[], index: number): OMatSortGroupedData[];
    protected sortGroupedData(groupedData: OMatSortGroupedData[]): any[];
    sortFunction(a: any, b: any): number;
}
