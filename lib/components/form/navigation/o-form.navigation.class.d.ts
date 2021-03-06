import { EventEmitter, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { OFormLayoutDialogComponent } from '../../../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { DialogService } from '../../../services/dialog.service';
import { NavigationService } from '../../../services/navigation.service';
import { OFormComponent } from '../o-form.component';
export declare class OFormNavigationClass {
    protected injector: Injector;
    protected form: OFormComponent;
    protected router: Router;
    protected actRoute: ActivatedRoute;
    formLayoutManager: OFormLayoutManagerComponent;
    formLayoutDialog: OFormLayoutDialogComponent;
    id: string;
    protected dialogService: DialogService;
    protected navigationService: NavigationService;
    protected qParamSub: Subscription;
    protected queryParams: any;
    protected urlParamSub: Subscription;
    protected urlParams: object;
    protected urlSub: Subscription;
    protected urlSegments: any;
    protected combinedNavigationStream: Observable<any>;
    protected combinedNavigationStreamSubscription: Subscription;
    protected onUrlParamChangedStream: EventEmitter<boolean>;
    navigationStream: EventEmitter<boolean>;
    protected onCloseTabSubscription: Subscription;
    protected cacheStateSubscription: Subscription;
    constructor(injector: Injector, form: OFormComponent, router: Router, actRoute: ActivatedRoute);
    initialize(): void;
    destroy(): void;
    subscribeToQueryParams(): void;
    private parseQueryParams;
    subscribeToUrlParams(): void;
    private parseUrlParams;
    subscribeToUrl(): void;
    subscribeToCacheChanges(onCacheEmptyStateChanges: EventEmitter<boolean>): void;
    getCurrentKeysValues(): object;
    private getFilterFromObject;
    getFilterFromUrlParams(): {} & object;
    getUrlSegments(): any;
    getQueryParams(): any;
    setUrlParams(val: object): void;
    getUrlParams(): object;
    setModifiedState(modified: boolean): void;
    updateNavigation(): void;
    navigateBack(): void;
    closeDetailAction(options?: any): void;
    stayInRecordAfterInsert(insertedKeys: object): void;
    goInsertMode(options?: any): void;
    goEditMode(options?: any): void;
    getNestedLevelsNumber(): number;
    getFullUrlSegments(): any[];
    showConfirmDiscardChanges(): Promise<boolean>;
    protected storeNavigationFormRoutes(activeMode: string): void;
}
