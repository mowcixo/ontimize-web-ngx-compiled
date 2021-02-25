import { DataSource } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OTableDataSource } from '../../../interfaces/o-table-datasource.interface';
import { OTableOptions } from '../../../interfaces/o-table-options.interface';
import { OColumnValueFilter } from '../../../types/o-column-value-filter.type';
import { OColumn } from '../column/o-column.class';
import { OTableComponent } from '../o-table.component';
import { OTableDao } from './o-table.dao';
import { OMatSort } from './sort/o-mat-sort';
export declare const SCROLLVIRTUAL = "scroll";
export interface ITableOScrollEvent {
    type: string;
    data: number;
}
export declare class OTableScrollEvent implements ITableOScrollEvent {
    data: number;
    type: string;
    constructor(data: number);
}
export declare class DefaultOTableDataSource extends DataSource<any> implements OTableDataSource {
    protected table: OTableComponent;
    dataTotalsChange: BehaviorSubject<any[]>;
    readonly data: any[];
    protected _database: OTableDao;
    protected _paginator: MatPaginator;
    protected _tableOptions: OTableOptions;
    protected _sort: OMatSort;
    protected _quickFilterChange: BehaviorSubject<string>;
    protected _columnValueFilterChange: Subject<unknown>;
    protected _loadDataScrollableChange: BehaviorSubject<OTableScrollEvent>;
    protected filteredData: any[];
    protected aggregateData: any;
    onRenderedDataChange: EventEmitter<any>;
    loadDataScrollable: number;
    protected _renderedData: any[];
    resultsLength: number;
    quickFilter: string;
    private columnValueFilters;
    constructor(table: OTableComponent);
    sortFunction(a: any, b: any): number;
    renderedData: any[];
    connect(): Observable<any[]>;
    getAggregatesData(data: any[]): any;
    getColumnCalculatedData(data: any[]): any[];
    protected transformFormula(formulaArg: any, row: any): string;
    getQuickFilterData(data: any[]): any[];
    getPaginationData(data: any[]): any[];
    disconnect(): void;
    protected fulfillsCustomFilterFunctions(filter: string, item: any): boolean;
    protected fulfillsQuickfilter(filter: string, item: any): boolean;
    protected getSortedData(data: any[]): any[];
    getTableData(): any[];
    getCurrentData(): any[];
    getCurrentAllData(): any[];
    getCurrentRendererData(): any[];
    getAllRendererData(): any[];
    readonly sqlTypes: any;
    protected getData(): any[];
    getRenderedData(data: any[]): {}[];
    protected getAllData(usingRendererers?: boolean, onlyVisibleColumns?: boolean): {}[];
    private getRenderersData;
    getColumnData(ocolumn: string): {}[];
    initializeColumnsFilters(filters: OColumnValueFilter[]): void;
    isColumnValueFilterActive(): boolean;
    getColumnValueFilters(): OColumnValueFilter[];
    getColumnValueFilterByAttr(attr: string): OColumnValueFilter;
    clearColumnFilters(trigger?: boolean): void;
    clearColumnFilter(attr: string, trigger?: boolean): void;
    addColumnFilter(filter: OColumnValueFilter): void;
    getColumnValueFilterData(data: any[]): any[];
    getAggregateData(column: OColumn): string | {}[];
    calculateAggregate(data: any[], column: OColumn): any;
    sum(column: any, data: any): number;
    count(column: any, data: any): number;
    avg(column: any, data: any): number;
    min(column: any, data: any): number;
    max(column: any, data: any): number;
    protected existsAnyCalculatedColumn(): boolean;
    updateRenderedRowData(rowData: any): void;
}