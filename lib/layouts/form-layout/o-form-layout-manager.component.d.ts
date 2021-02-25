import { AfterViewInit, ElementRef, EventEmitter, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { OServiceComponent } from '../../components/o-service-component.class';
import { ILocalStorageComponent } from '../../interfaces/local-storage-component.interface';
import { OFormLayoutTabGroup } from '../../interfaces/o-form-layout-tab-group.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { NavigationService } from '../../services/navigation.service';
import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { FormLayoutDetailComponentData } from '../../types/form-layout-detail-component-data.type';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutDialogOptionsComponent } from './dialog/options/o-form-layout-dialog-options.component';
import { OFormLayoutTabGroupOptionsComponent } from './tabgroup/options/o-form-layout-tabgroup-options.component';
export declare const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER: string[];
export declare const DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER: string[];
export declare class OFormLayoutManagerComponent implements AfterViewInit, OnInit, OnDestroy, ILocalStorageComponent {
    protected injector: Injector;
    protected router: Router;
    protected actRoute: ActivatedRoute;
    protected dialog: MatDialog;
    protected elRef: ElementRef;
    parentFormLayoutManager: OFormLayoutManagerComponent;
    static guardClassName: string;
    static DIALOG_MODE: string;
    static TAB_MODE: string;
    oattr: string;
    mode: string;
    labelColumns: string;
    separator: string;
    title: string;
    storeState: boolean;
    titleDataOrigin: string;
    dialogWidth: string;
    dialogMinWidth: string;
    dialogMaxWidth: string;
    dialogHeight: string;
    dialogMinHeight: string;
    dialogMaxHeight: string;
    dialogClass: string;
    oTabGroup: OFormLayoutTabGroup;
    dialogRef: MatDialogRef<OFormLayoutDialogComponent>;
    onMainTabSelected: EventEmitter<any>;
    onSelectedTabChange: EventEmitter<any>;
    onCloseTab: EventEmitter<any>;
    protected labelColsArray: string[];
    protected translateService: OTranslateService;
    protected oFormLayoutManagerService: OFormLayoutManagerService;
    protected localStorageService: LocalStorageService;
    protected onRouteChangeStorageSubscription: any;
    tabGroupOptions: OFormLayoutTabGroupOptionsComponent;
    dialogOptions: OFormLayoutDialogOptionsComponent;
    protected addingGuard: boolean;
    navigationService: NavigationService;
    markForUpdate: boolean;
    onTriggerUpdate: EventEmitter<any>;
    constructor(injector: Injector, router: Router, actRoute: ActivatedRoute, dialog: MatDialog, elRef: ElementRef, parentFormLayoutManager: OFormLayoutManagerComponent);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    getAttribute(): string;
    getComponentKey(): string;
    getDataToStore(): object;
    beforeunloadHandler(): void;
    getLabelFromUrlParams(urlParams: object): string;
    getFormDataFromLabelColumns(data: any): {};
    addActivateChildGuard(): void;
    destroyAactivateChildGuard(): void;
    isDialogMode(): boolean;
    isTabMode(): boolean;
    addDetailComponent(childRoute: ActivatedRouteSnapshot, url: string): void;
    closeDetail(id?: string): void;
    openFormLayoutDialog(detailComp: FormLayoutDetailComponentData): void;
    getFormCacheData(formId: string): FormLayoutDetailComponentData;
    getLastTabId(): string;
    setModifiedState(modified: boolean, id: string): void;
    getLabelFromData(data: any): string;
    updateNavigation(data: any, id: string, insertionMode?: boolean): void;
    updateActiveData(data: any): void;
    getRouteOfActiveItem(): any[];
    isMainComponent(comp: OServiceComponent): boolean;
    getRouteForComponent(comp: OServiceComponent): any[];
    setAsActiveFormLayoutManager(): void;
    reloadMainComponents(): void;
    allowToUpdateNavigation(formAttr: string): boolean;
    protected updateStateStorage(): void;
    private getParentActRouteRoute;
    updateIfNeeded(): void;
    getParams(): any;
}