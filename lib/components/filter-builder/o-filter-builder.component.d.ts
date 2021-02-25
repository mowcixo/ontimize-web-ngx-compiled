import { AfterViewInit, EventEmitter, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OFormComponent } from '../../components/form/o-form.component';
import { OServiceComponent } from '../../components/o-service-component.class';
import { IFilterBuilderCmpTarget } from '../../interfaces/filter-builder-component-target.interface';
import { BasicExpression } from '../../types/basic-expression.type';
import { Expression } from '../../types/expression.type';
export declare const DEFAULT_INPUTS_O_FILTER_BUILDER: string[];
export declare const DEFAULT_OUTPUTS_O_FILTER_BUILDER: string[];
export declare class OFilterBuilderComponent implements AfterViewInit, OnDestroy, OnInit {
    form: OFormComponent;
    onFilter: EventEmitter<any>;
    onClear: EventEmitter<any>;
    filters: string;
    targetCmp: OServiceComponent;
    expressionBuilder: (values: Array<{
        attr: any;
        value: any;
    }>) => Expression;
    queryOnChange: boolean;
    queryOnChangeDelay: number;
    protected filterComponents: Array<IFilterBuilderCmpTarget>;
    protected subscriptions: Subscription;
    constructor(form: OFormComponent, injector: Injector);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    initialize(): void;
    initializeListeners(): void;
    getExpression(): Expression;
    getBasicExpression(): BasicExpression;
    getTargetComponent(): OServiceComponent;
    triggerReload(): void;
    clearFilter(): void;
    protected getFilterAttrs(): Array<string>;
}
