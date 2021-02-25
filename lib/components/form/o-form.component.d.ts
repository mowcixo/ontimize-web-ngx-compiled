import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, Injector, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IComponent } from '../../interfaces/component.interface';
import { IFormDataComponent } from '../../interfaces/form-data-component.interface';
import { IFormDataTypeComponent } from '../../interfaces/form-data-type-component.interface';
import { OFormLayoutManagerComponent } from '../../layouts/form-layout/o-form-layout-manager.component';
import { DialogService } from '../../services/dialog.service';
import { NavigationService } from '../../services/navigation.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { SnackBarService } from '../../services/snackbar.service';
import { FormValueOptions } from '../../types/form-value-options.type';
import { OFormInitializationOptions } from '../../types/o-form-initialization-options.type';
import { OFormPermissions } from '../../types/o-form-permissions.type';
import { OPermissions } from '../../types/o-permissions.type';
import { OFormContainerComponent } from '../form-container/o-form-container.component';
import { OFormCacheClass } from './cache/o-form.cache.class';
import { CanComponentDeactivate, CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormNavigationClass } from './navigation/o-form.navigation.class';
import { OFormToolbarComponent } from './toolbar/o-form-toolbar.component';
interface IFormDataComponentHash {
    [attr: string]: IFormDataComponent;
}
export declare const DEFAULT_INPUTS_O_FORM: string[];
export declare const DEFAULT_OUTPUTS_O_FORM: string[];
export declare class OFormComponent implements OnInit, OnDestroy, CanComponentDeactivate, AfterViewInit {
    protected router: Router;
    protected actRoute: ActivatedRoute;
    protected zone: NgZone;
    protected cd: ChangeDetectorRef;
    protected injector: Injector;
    protected elRef: ElementRef;
    static DEFAULT_LAYOUT_DIRECTION: string;
    static guardClassName: string;
    showHeader: boolean;
    headerMode: string;
    headerPosition: 'top' | 'bottom';
    labelheader: string;
    labelHeaderAlign: string;
    headeractions: string;
    showHeaderActionsText: string;
    entity: string;
    keys: string;
    columns: string;
    service: string;
    stayInRecordAfterEdit: boolean;
    afterInsertMode: 'new' | 'detail';
    serviceType: string;
    protected queryOnInit: boolean;
    protected parentKeys: string;
    protected queryMethod: string;
    protected insertMethod: string;
    protected updateMethod: string;
    protected deleteMethod: string;
    protected _layoutDirection: string;
    protected _layoutAlign: string;
    protected editableDetail: boolean;
    protected keysSqlTypes: string;
    undoButton: boolean;
    showHeaderNavigation: boolean;
    oattr: string;
    includeBreadcrumb: boolean;
    detectChangesOnBlur: boolean;
    confirmExit: boolean;
    queryFallbackFunction: (error: any) => void;
    isDetailForm: boolean;
    keysArray: string[];
    colsArray: string[];
    dataService: any;
    _pKeysEquiv: {};
    keysSqlTypesArray: Array<string>;
    formGroup: FormGroup;
    onDataLoaded: EventEmitter<object>;
    beforeCloseDetail: EventEmitter<any>;
    beforeGoEditMode: EventEmitter<any>;
    onFormModeChange: EventEmitter<number>;
    onInsert: EventEmitter<any>;
    onUpdate: EventEmitter<any>;
    onDelete: EventEmitter<any>;
    protected loadingSubject: BehaviorSubject<boolean>;
    loading: Observable<boolean>;
    formData: object;
    navigationData: Array<any>;
    currentIndex: number;
    mode: number;
    protected dialogService: DialogService;
    protected navigationService: NavigationService;
    protected snackBarService: SnackBarService;
    protected _formToolbar: OFormToolbarComponent;
    protected _components: IFormDataComponentHash;
    protected _compSQLTypes: object;
    formParentKeysValues: object;
    onFormInitStream: EventEmitter<boolean>;
    protected reloadStream: Observable<any>;
    protected reloadStreamSubscription: Subscription;
    protected querySubscription: Subscription;
    protected loaderSubscription: Subscription;
    protected dynamicFormSubscription: Subscription;
    protected deactivateGuard: CanDeactivateFormGuard;
    protected formCache: OFormCacheClass;
    protected formNavigation: OFormNavigationClass;
    formContainer: OFormContainerComponent;
    protected permissionsService: PermissionsService;
    protected permissions: OFormPermissions;
    innerFormEl: ElementRef;
    ignoreFormCacheKeys: Array<any>;
    canDiscardChanges: boolean;
    static Mode(): any;
    constructor(router: Router, actRoute: ActivatedRoute, zone: NgZone, cd: ChangeDetectorRef, injector: Injector, elRef: ElementRef);
    registerFormComponent(comp: any): void;
    registerSQLTypeFormComponent(comp: IFormDataTypeComponent): void;
    registerFormControlComponent(comp: IFormDataComponent): void;
    unregisterFormComponent(comp: IComponent): void;
    unregisterFormControlComponent(comp: IFormDataComponent): void;
    unregisterSQLTypeFormComponent(comp: IFormDataTypeComponent): void;
    registerToolbar(fToolbar: OFormToolbarComponent): void;
    getComponents(): IFormDataComponentHash;
    load(): any;
    getDataValue(attr: string): any;
    getDataValues(): object;
    clearData(): void;
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
    showConfirmDiscardChanges(): Promise<boolean>;
    executeToolbarAction(action: string, options?: any): Observable<any>;
    ngOnInit(): void;
    addDeactivateGuard(): void;
    destroyDeactivateGuard(): void;
    hasDeactivateGuard(): boolean;
    initialize(): void;
    reinitialize(options: OFormInitializationOptions): void;
    configureService(): void;
    ngOnDestroy(): void;
    destroy(): void;
    ngAfterViewInit(): void;
    _setComponentsEditable(state: boolean): void;
    setFormMode(mode: number): void;
    _setData(data: any): void;
    _emitData(data: any): void;
    _backAction(): void;
    _closeDetailAction(options?: any): void;
    _stayInRecordAfterInsert(insertedKeys: object): void;
    _reloadAction(useFilter?: boolean): void;
    _goInsertMode(options?: any): void;
    _clearFormAfterInsert(): void;
    _insertAction(): void;
    _goEditMode(options?: any): void;
    _editAction(): void;
    _deleteAction(): Observable<any>;
    queryData(filter: any): void;
    getAttributesToQuery(): Array<any>;
    insertData(values: any, sqlTypes?: object): Observable<any>;
    getAttributesValuesToInsert(): object;
    getAttributesSQLTypes(): object;
    updateData(filter: any, values: any, sqlTypes?: object): Observable<any>;
    getAttributesValuesToUpdate(): object;
    deleteData(filter: any): Observable<any>;
    toJSONData(data: any): {};
    toFormValueData(data: any): object;
    getKeysValues(): {};
    isInQueryMode(): boolean;
    isInInsertMode(): boolean;
    isInUpdateMode(): boolean;
    isInInitialMode(): boolean;
    setQueryMode(): void;
    setInsertMode(): void;
    setUpdateMode(): void;
    setInitialMode(): void;
    registerDynamicFormComponent(dynamicForm: any): void;
    unregisterDynamicFormComponent(dynamicForm: any): void;
    getRequiredComponents(): object;
    layoutDirection: string;
    layoutAlign: string;
    readonly showFloatingToolbar: boolean;
    readonly showNotFloatingToolbar: boolean;
    isEditableDetail(): boolean;
    isInitialStateChanged(): boolean;
    _undoLastChangeAction(): void;
    readonly isCacheStackEmpty: boolean;
    undoKeyboardPressed(): void;
    getFormToolbar(): OFormToolbarComponent;
    getFormManager(): OFormLayoutManagerComponent;
    getFormNavigation(): OFormNavigationClass;
    getFormCache(): OFormCacheClass;
    getUrlParam(arg: string): any;
    getUrlParams(): object;
    setUrlParamsAndReload(val: object): void;
    getRegisteredFieldsValues(): {};
    getFieldValue(attr: string): any;
    getFieldValues(attrs: string[]): any;
    setFieldValue(attr: string, value: any, options?: FormValueOptions): void;
    setFieldValues(values: any, options?: FormValueOptions): void;
    clearFieldValue(attr: string, options?: FormValueOptions): void;
    clearFieldValues(attrs: string[], options?: FormValueOptions): void;
    getFieldReference(attr: string): IFormDataComponent;
    getFieldReferences(attrs: string[]): IFormDataComponentHash;
    getFormComponentPermissions(attr: string): OPermissions;
    getActionsPermissions(): OPermissions[];
    protected determinateFormMode(): void;
    protected determinateModeFromUrlSegment(segment: UrlSegment): void;
    protected _updateFormData(newFormData: object): void;
    protected initializeFields(): void;
    protected clearComponentsOldValue(): void;
    protected postCorrectInsert(result: any): void;
    protected postIncorrectInsert(result: any): void;
    protected postIncorrectDelete(result: any): void;
    protected postIncorrectUpdate(result: any): void;
    protected postCorrectUpdate(result: any): void;
    protected postCorrectDelete(result: any): void;
    protected markFormLayoutManagerToUpdate(): void;
    protected objectToFormValueData(data?: object): object;
    protected getCurrentKeysValues(): object;
    protected refreshComponentsEditableState(): void;
    protected isInsertModePath(path: string): boolean;
    protected isUpdateModePath(path: string): boolean;
    private showError;
}
export {};
