import { ComponentFactoryResolver, Injector } from '@angular/core';
import { OTableColumnCalculated } from '../../../../interfaces/o-table-column-calculated.interface';
import { OperatorFunction } from '../../../../types/operation-function.type';
import { OTableComponent } from '../../o-table.component';
import { OTableColumnComponent } from '../o-table-column.component';
export declare const DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED: string[];
export declare class OTableColumnCalculatedComponent extends OTableColumnComponent implements OTableColumnCalculated {
    table: OTableComponent;
    protected resolver: ComponentFactoryResolver;
    protected injector: Injector;
    operation: string;
    functionOperation: OperatorFunction;
    constructor(table: OTableComponent, resolver: ComponentFactoryResolver, injector: Injector);
}
