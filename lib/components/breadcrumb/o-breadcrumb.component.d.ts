import { AfterViewInit, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { OBreadcrumbService } from '../../services/o-breadcrumb.service';
import { OBreadcrumb } from '../../types/o-breadcrumb-item.type';
import { OFormComponent } from '../form/o-form.component';
export declare const DEFAULT_INPUTS_O_BREADCRUMB: string[];
export declare class OBreadcrumbComponent implements AfterViewInit, OnDestroy, OnInit {
    protected injector: Injector;
    labelColumns: string;
    separator: string;
    breadcrumbs: BehaviorSubject<OBreadcrumb[]>;
    protected router: Router;
    form: OFormComponent;
    protected _formRef: OFormComponent;
    protected labelColsArray: Array<string>;
    protected navigationService: NavigationService;
    protected subscription: Subscription;
    protected oBreadcrumService: OBreadcrumbService;
    constructor(injector: Injector);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    isCurrentRoute(route: OBreadcrumb): boolean;
    onRouteClick(route: OBreadcrumb): void;
}
