import { Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AggregateFunction } from '../../../../../types/aggregate-function.type';
import { OTableComponent } from '../../../o-table.component';
export declare const DEFAULT_TABLE_COLUMN_AGGREGATE: string[];
export declare class OTableColumnAggregateComponent implements OnDestroy, OnInit {
    protected injector: Injector;
    static DEFAULT_AGGREGATE: string;
    attr: string;
    aggregate: string;
    table: OTableComponent;
    title: string;
    protected _aggregateFunction: AggregateFunction;
    protected subscription: Subscription;
    constructor(table: OTableComponent, injector: Injector);
    functionAggregate: AggregateFunction;
    getColumnData(attr: any): any[];
    ngOnInit(): void;
    ngOnDestroy(): void;
}
