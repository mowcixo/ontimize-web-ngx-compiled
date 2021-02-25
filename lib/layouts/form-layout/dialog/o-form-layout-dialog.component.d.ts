import { AfterViewInit, ComponentFactory, ComponentFactoryResolver, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
export declare class OFormLayoutDialogComponent implements AfterViewInit {
    dialogRef: MatDialogRef<OFormLayoutDialogComponent>;
    protected injector: Injector;
    protected componentFactoryResolver: ComponentFactoryResolver;
    formLayoutManager: OFormLayoutManagerComponent;
    queryParams: any;
    params: object;
    urlSegments: any[];
    label: string;
    title: string;
    data: any;
    protected componentFactory: ComponentFactory<any>;
    contentDirective: OFormLayoutManagerContentDirective;
    constructor(dialogRef: MatDialogRef<OFormLayoutDialogComponent>, injector: Injector, componentFactoryResolver: ComponentFactoryResolver, data: any);
    ngAfterViewInit(): void;
    updateNavigation(data: any, id: string): void;
    updateActiveData(data: any): void;
    closeDialog(): void;
    getRouteOfActiveItem(): any[];
    getParams(): any;
}
