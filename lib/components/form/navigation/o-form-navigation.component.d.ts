import { Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { NavigationService } from '../../../services/navigation.service';
import { OFormComponent } from '../o-form.component';
import { OFormNavigationClass } from './o-form.navigation.class';
export declare type QueryConfiguration = {
    serviceType: string;
    queryArguments: any[];
    entity: string;
    service: string;
    queryMethod: string;
    totalRecordsNumber: number;
    queryRows: number;
    queryRecordOffset: number;
};
export declare class OFormNavigationComponent implements OnDestroy {
    protected injector: Injector;
    private _form;
    private router;
    navigationData: Array<any>;
    private _currentIndex;
    protected formNavigation: OFormNavigationClass;
    protected navigationService: NavigationService;
    protected formLayoutManager: OFormLayoutManagerComponent;
    protected querySubscription: Subscription;
    protected dataService: any;
    protected queryConf: QueryConfiguration;
    constructor(injector: Injector, _form: OFormComponent, router: Router);
    configureService(): void;
    protected queryNavigationData(offset: number, length?: number): Promise<any>;
    ngOnDestroy(): void;
    protected getKeysArray(): string[];
    getCurrentIndex(): number;
    next(): void;
    previous(): void;
    first(): void;
    last(): void;
    isFirst(): boolean;
    isLast(): boolean;
    move(index: number): void;
    private moveWithoutManager;
    private moveInDialogManager;
    getRouteOfSelectedRow(item: any): any[];
    showNavigation(): boolean;
    currentIndex: number;
    getRecordIndex(): number;
    getTotalRecordsNumber(): number;
}
