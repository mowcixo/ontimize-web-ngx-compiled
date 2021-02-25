import { AfterViewInit, ComponentFactoryResolver, EventEmitter, OnInit, QueryList, ViewContainerRef } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material';
import { OButtonToggleComponent } from '../o-button-toggle.component';
export declare const DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP: string[];
export declare const DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP: string[];
export declare class OButtonToggleGroupComponent implements AfterViewInit, OnInit {
    protected resolver: ComponentFactoryResolver;
    DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP: string[];
    DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP: string[];
    protected oattr: string;
    name: string;
    enabled: boolean;
    protected _enabled: boolean;
    layout: 'row' | 'column';
    multiple: boolean;
    value: any;
    onChange: EventEmitter<MatButtonToggleChange>;
    protected _innerButtonToggleGroup: MatButtonToggleGroup;
    protected _viewContainerRef: ViewContainerRef;
    protected _children: QueryList<OButtonToggleComponent>;
    constructor(resolver: ComponentFactoryResolver);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    protected buildChildren(): void;
    getValue(): any;
    setValue(val: any): void;
}
