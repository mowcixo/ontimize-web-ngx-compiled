import { AfterViewInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { OFormLayoutManagerComponent } from '../../layouts/form-layout/o-form-layout-manager.component';
import { OFormComponent } from '../form/o-form.component';
export declare const DEFAULT_INPUTS_O_FORM_CONTAINER: string[];
export declare class OFormContainerComponent implements AfterViewInit {
    private resolver;
    breadContainer: ViewContainerRef;
    breadcrumb: boolean;
    breadcrumbLabelColumns: string;
    breadcrumbSeparator: string;
    protected form: OFormComponent;
    protected formMananger: OFormLayoutManagerComponent;
    constructor(resolver: ComponentFactoryResolver);
    ngAfterViewInit(): void;
    setForm(form: OFormComponent): void;
    createBreadcrumb(container: ViewContainerRef): void;
}
