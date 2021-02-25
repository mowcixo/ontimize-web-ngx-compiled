import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, NgZone, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { InputConverter } from '../../decorators/input-converter';
import { DialogService } from '../../services/dialog.service';
import { OntimizeServiceProvider } from '../../services/factories';
import { NavigationService } from '../../services/navigation.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { SnackBarService } from '../../services/snackbar.service';
import { Codes } from '../../util/codes';
import { SQLTypes } from '../../util/sqltypes';
import { Util } from '../../util/util';
import { OFormContainerComponent } from '../form-container/o-form-container.component';
import { OFormControl } from '../input/o-form-control.class';
import { OFormCacheClass } from './cache/o-form.cache.class';
import { CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormNavigationClass } from './navigation/o-form.navigation.class';
import { OFormValue } from './OFormValue';
export const DEFAULT_INPUTS_O_FORM = [
    'showHeader: show-header',
    'headerMode: header-mode',
    'headerPosition: header-position',
    'labelheader: label-header',
    'labelHeaderAlign: label-header-align',
    'headeractions: header-actions',
    'showHeaderActionsText: show-header-actions-text',
    'entity',
    'keys',
    'columns',
    'service',
    'stayInRecordAfterEdit: stay-in-record-after-edit',
    'afterInsertMode: after-insert-mode',
    'serviceType : service-type',
    'queryOnInit : query-on-init',
    'parentKeys: parent-keys',
    'queryMethod: query-method',
    'insertMethod: insert-method',
    'updateMethod: update-method',
    'deleteMethod: delete-method',
    'layoutDirection: layout-direction',
    'layoutAlign: layout-align',
    'editableDetail: editable-detail',
    'keysSqlTypes: keys-sql-types',
    'undoButton: undo-button',
    'showHeaderNavigation: show-header-navigation',
    'oattr:attr',
    'includeBreadcrumb: include-breadcrumb',
    'detectChangesOnBlur: detect-changes-on-blur',
    'confirmExit: confirm-exit',
    'queryFallbackFunction: query-fallback-function'
];
export const DEFAULT_OUTPUTS_O_FORM = [
    'onDataLoaded',
    'beforeCloseDetail',
    'beforeGoEditMode',
    'onFormModeChange',
    'onInsert',
    'onUpdate',
    'onDelete',
    'beforeInsertMode',
    'beforeUpdateMode',
    'beforeInitialMode',
    'onInsertMode',
    'onUpdateMode',
    'onInitialMode'
];
export class OFormComponent {
    constructor(router, actRoute, zone, cd, injector, elRef) {
        this.router = router;
        this.actRoute = actRoute;
        this.zone = zone;
        this.cd = cd;
        this.injector = injector;
        this.elRef = elRef;
        this.showHeader = true;
        this.headerMode = 'floating';
        this.headerPosition = 'top';
        this.labelheader = '';
        this.labelHeaderAlign = 'center';
        this.headeractions = '';
        this.showHeaderActionsText = 'yes';
        this.keys = '';
        this.columns = '';
        this.stayInRecordAfterEdit = false;
        this.afterInsertMode = null;
        this.queryOnInit = true;
        this.queryMethod = Codes.QUERY_METHOD;
        this.insertMethod = Codes.INSERT_METHOD;
        this.updateMethod = Codes.UPDATE_METHOD;
        this.deleteMethod = Codes.DELETE_METHOD;
        this._layoutDirection = OFormComponent.DEFAULT_LAYOUT_DIRECTION;
        this._layoutAlign = 'start stretch';
        this.editableDetail = true;
        this.undoButton = true;
        this.showHeaderNavigation = false;
        this.oattr = '';
        this.includeBreadcrumb = false;
        this.detectChangesOnBlur = true;
        this.confirmExit = true;
        this.isDetailForm = false;
        this.keysArray = [];
        this.colsArray = [];
        this._pKeysEquiv = {};
        this.keysSqlTypesArray = [];
        this.onDataLoaded = new EventEmitter();
        this.beforeCloseDetail = new EventEmitter();
        this.beforeGoEditMode = new EventEmitter();
        this.beforeInsertMode = new EventEmitter();
        this.beforeUpdateMode = new EventEmitter();
        this.beforeInitialMode = new EventEmitter();
        this.onInsertMode = new EventEmitter();
        this.onUpdateMode = new EventEmitter();
        this.onInitialMode = new EventEmitter();
        this.onFormModeChange = new EventEmitter();
        this.onInsert = new EventEmitter();
        this.onUpdate = new EventEmitter();
        this.onDelete = new EventEmitter();
        this.loadingSubject = new BehaviorSubject(false);
        this.loading = this.loadingSubject.asObservable();
        this.formData = {};
        this.navigationData = [];
        this.currentIndex = 0;
        this.mode = OFormComponent.Mode().INITIAL;
        this._components = {};
        this._compSQLTypes = {};
        this.onFormInitStream = new EventEmitter();
        this.ignoreFormCacheKeys = [];
        this.formCache = new OFormCacheClass(this);
        this.formNavigation = new OFormNavigationClass(this.injector, this, this.router, this.actRoute);
        this.dialogService = injector.get(DialogService);
        this.navigationService = injector.get(NavigationService);
        this.snackBarService = injector.get(SnackBarService);
        this.permissionsService = this.injector.get(PermissionsService);
        const self = this;
        this.reloadStream = combineLatest([
            self.onFormInitStream.asObservable(),
            self.formNavigation.navigationStream.asObservable()
        ]);
        this.reloadStreamSubscription = this.reloadStream.subscribe(valArr => {
            if (Util.isArray(valArr) && valArr.length === 2 && !self.isInInsertMode()) {
                const valArrValues = valArr[0] === true && valArr[1] === true;
                if (self.queryOnInit && valArrValues) {
                    self.reload(true);
                }
                else {
                    self.initializeFields();
                }
            }
        });
        try {
            this.formContainer = injector.get(OFormContainerComponent);
            this.formContainer.setForm(this);
        }
        catch (e) {
        }
    }
    static Mode() {
        let m;
        (function (m) {
            m[m["QUERY"] = 0] = "QUERY";
            m[m["INSERT"] = 1] = "INSERT";
            m[m["UPDATE"] = 2] = "UPDATE";
            m[m["INITIAL"] = 3] = "INITIAL";
        })(m || (m = {}));
        return m;
    }
    registerFormComponent(comp) {
        if (comp) {
            const attr = comp.getAttribute();
            if (attr && attr.length > 0) {
                if (!comp.isAutomaticRegistering()) {
                    return;
                }
                if (this._components.hasOwnProperty(attr)) {
                    comp.repeatedAttr = true;
                    console.error('There is already a component registered in the form with the attr: ' + attr);
                    return;
                }
                this._components[attr] = comp;
                if (this.formParentKeysValues && this.formParentKeysValues[attr] !== undefined) {
                    const val = this.formParentKeysValues[attr];
                    this._components[attr].setValue(val, {
                        emitModelToViewChange: false,
                        emitEvent: false
                    });
                }
                const cachedValue = this.formCache.getCachedValue(attr);
                if (Util.isDefined(cachedValue) && this.getDataValues() && this._components.hasOwnProperty(attr)) {
                    this._components[attr].setValue(cachedValue, {
                        emitModelToViewChange: false,
                        emitEvent: false
                    });
                }
            }
        }
    }
    registerSQLTypeFormComponent(comp) {
        if (comp.repeatedAttr) {
            return;
        }
        if (comp) {
            const type = comp.getSQLType();
            const attr = comp.getAttribute();
            if (type !== SQLTypes.OTHER && attr && attr.length > 0 && this.ignoreFormCacheKeys.indexOf(attr) === -1) {
                this._compSQLTypes[attr] = type;
            }
        }
    }
    registerFormControlComponent(comp) {
        if (comp.repeatedAttr) {
            return;
        }
        if (comp) {
            const attr = comp.getAttribute();
            if (attr && attr.length > 0) {
                const control = comp.getControl();
                if (control) {
                    this.formGroup.registerControl(attr, control);
                    if (!comp.isAutomaticRegistering()) {
                        this.ignoreFormCacheKeys.push(comp.getAttribute());
                    }
                }
            }
        }
    }
    unregisterFormComponent(comp) {
        if (comp) {
            const attr = comp.getAttribute();
            if (attr && attr.length > 0 && this._components.hasOwnProperty(attr)) {
                delete this._components[attr];
            }
        }
    }
    unregisterFormControlComponent(comp) {
        if (comp && comp.isAutomaticRegistering()) {
            const control = comp.getControl();
            const attr = comp.getAttribute();
            if (control && attr && attr.length > 0) {
                this.formGroup.removeControl(attr);
            }
        }
    }
    unregisterSQLTypeFormComponent(comp) {
        if (comp) {
            const attr = comp.getAttribute();
            if (attr && attr.length > 0) {
                delete this._compSQLTypes[attr];
            }
        }
    }
    registerToolbar(fToolbar) {
        if (fToolbar) {
            this._formToolbar = fToolbar;
            this._formToolbar.isDetail = this.isDetailForm;
        }
    }
    getComponents() {
        return this._components;
    }
    load() {
        const self = this;
        const zone = this.injector.get(NgZone);
        const loadObservable = new Observable(observer => {
            const timer = window.setTimeout(() => {
                observer.next(true);
            }, 250);
            return () => {
                window.clearTimeout(timer);
                zone.run(() => {
                    self.loadingSubject.next(false);
                });
            };
        });
        const subscription = loadObservable.subscribe(val => {
            zone.run(() => {
                self.loadingSubject.next(val);
            });
        });
        return subscription;
    }
    getDataValue(attr) {
        if (this.isInInsertMode()) {
            const urlParams = this.formNavigation.getFilterFromUrlParams();
            const val = this.formGroup.value[attr] || urlParams[attr];
            return new OFormValue(val);
        }
        else if (this.isInInitialMode() && !this.isEditableDetail()) {
            const data = this.formData;
            if (data && data.hasOwnProperty(attr)) {
                return data[attr];
            }
        }
        else if (this.isInUpdateMode() || this.isEditableDetail()) {
            if (this.formData && Object.keys(this.formData).length > 0) {
                const val = this.formCache.getCachedValue(attr);
                if (this.formGroup.dirty && val) {
                    if (val instanceof OFormValue) {
                        return val;
                    }
                    return new OFormValue(val);
                }
                else {
                    const data = this.formData;
                    if (data && data.hasOwnProperty(attr)) {
                        return data[attr];
                    }
                }
            }
        }
        return new OFormValue();
    }
    getDataValues() {
        return this.formData;
    }
    clearData() {
        const filter = this.formNavigation.getFilterFromUrlParams();
        this.formGroup.reset({}, {
            emitEvent: false
        });
        this.setData(filter);
    }
    canDeactivate() {
        if (!this.confirmExit) {
            return true;
        }
        const canDiscardChanges = this.canDiscardChanges;
        this.canDiscardChanges = false;
        return canDiscardChanges || this.showConfirmDiscardChanges();
    }
    showConfirmDiscardChanges() {
        return this.formNavigation.showConfirmDiscardChanges();
    }
    executeToolbarAction(action, options) {
        switch (action) {
            case Codes.BACK_ACTION:
                this.back();
                break;
            case Codes.CLOSE_DETAIL_ACTION:
                this.closeDetail(options);
                break;
            case Codes.RELOAD_ACTION:
                this.reload(true);
                break;
            case Codes.GO_INSERT_ACTION:
                this.goInsertMode(options);
                break;
            case Codes.INSERT_ACTION:
                this.insert();
                break;
            case Codes.GO_EDIT_ACTION:
                this.goEditMode(options);
                break;
            case Codes.EDIT_ACTION:
                this.update();
                break;
            case Codes.UNDO_LAST_CHANGE_ACTION:
                this.undo();
                break;
            case Codes.DELETE_ACTION: return this.delete();
            default: break;
        }
        return undefined;
    }
    ngOnInit() {
        this.addDeactivateGuard();
        this.formGroup = new FormGroup({});
        this.formNavigation.initialize();
        this.initialize();
    }
    addDeactivateGuard() {
        if (this.isInInitialMode() && !this.isEditableDetail()) {
            return;
        }
        if (!this.actRoute || !this.actRoute.routeConfig) {
            return;
        }
        this.deactivateGuard = this.injector.get(CanDeactivateFormGuard);
        this.deactivateGuard.setForm(this);
        const canDeactivateArray = (this.actRoute.routeConfig.canDeactivate || []);
        let previouslyAdded = false;
        for (let i = 0, len = canDeactivateArray.length; i < len; i++) {
            previouslyAdded = ((canDeactivateArray[i].hasOwnProperty('CLASSNAME') && canDeactivateArray[i].CLASSNAME) === OFormComponent.guardClassName);
            if (previouslyAdded) {
                break;
            }
        }
        if (!previouslyAdded) {
            canDeactivateArray.push(this.deactivateGuard.constructor);
            this.actRoute.routeConfig.canDeactivate = canDeactivateArray;
        }
    }
    destroyDeactivateGuard() {
        try {
            if (!this.deactivateGuard || !this.actRoute || !this.actRoute.routeConfig || !this.actRoute.routeConfig.canDeactivate) {
                return;
            }
            this.deactivateGuard.setForm(undefined);
            for (let i = this.actRoute.routeConfig.canDeactivate.length - 1; i >= 0; i--) {
                if (this.actRoute.routeConfig.canDeactivate[i].name === OFormComponent.guardClassName) {
                    this.actRoute.routeConfig.canDeactivate.splice(i, 1);
                    break;
                }
            }
            if (this.actRoute.routeConfig.canDeactivate.length === 0) {
                delete this.actRoute.routeConfig.canDeactivate;
            }
        }
        catch (e) {
        }
    }
    hasDeactivateGuard() {
        return Util.isDefined(this.deactivateGuard);
    }
    initialize() {
        const self = this;
        if (this.headeractions === 'all') {
            this.headeractions = 'R;I;U;D';
        }
        this.keysArray = Util.parseArray(this.keys, true);
        this.colsArray = Util.parseArray(this.columns, true);
        const pkArray = Util.parseArray(this.parentKeys);
        this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
        this.keysSqlTypesArray = Util.parseArray(this.keysSqlTypes);
        this.configureService();
        this.formNavigation.subscribeToQueryParams();
        this.formNavigation.subscribeToUrlParams();
        this.formNavigation.subscribeToUrl();
        this.formNavigation.subscribeToCacheChanges(this.formCache.onCacheEmptyStateChanges);
        if (this.navigationService) {
            this.navigationService.onVisibleChange(visible => {
                self.showHeader = visible;
            });
        }
        this.mode = OFormComponent.Mode().INITIAL;
        this.permissions = this.permissionsService.getFormPermissions(this.oattr, this.actRoute);
        if (typeof this.queryFallbackFunction !== 'function') {
            this.queryFallbackFunction = undefined;
        }
    }
    reinitialize(options) {
        if (options && Object.keys(options).length) {
            const clonedOpts = Object.assign({}, options);
            for (const prop in clonedOpts) {
                if (clonedOpts.hasOwnProperty(prop)) {
                    this[prop] = clonedOpts[prop];
                }
            }
            this.destroy();
            this.initialize();
        }
    }
    configureService() {
        let loadingService = OntimizeService;
        if (this.serviceType) {
            loadingService = this.serviceType;
        }
        try {
            this.dataService = this.injector.get(loadingService);
            if (Util.isDataService(this.dataService)) {
                const serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
                if (this.entity) {
                    serviceCfg.entity = this.entity;
                }
                this.dataService.configureService(serviceCfg);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    ngOnDestroy() {
        this.destroy();
    }
    destroy() {
        if (this.reloadStreamSubscription) {
            this.reloadStreamSubscription.unsubscribe();
        }
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.formCache.destroy();
        this.formNavigation.destroy();
        this.destroyDeactivateGuard();
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.determinateFormMode();
            this.onFormInitStream.emit(true);
        }, 0);
    }
    _setComponentsEditable(state) {
        const components = this.getComponents();
        Object.keys(components).forEach(compKey => {
            const component = components[compKey];
            component.isReadOnly = !state;
        });
    }
    setFormMode(mode) {
        switch (mode) {
            case OFormComponent.Mode().INITIAL:
                this.beforeInitialMode.emit();
                this.mode = mode;
                if (this._formToolbar) {
                    this._formToolbar.setInitialMode();
                }
                this._setComponentsEditable(this.isEditableDetail());
                this.onFormModeChange.emit(this.mode);
                this.onInitialMode.emit();
                break;
            case OFormComponent.Mode().INSERT:
                this.beforeInsertMode.emit();
                this.mode = mode;
                if (this._formToolbar) {
                    this._formToolbar.setInsertMode();
                }
                this.clearData();
                this._setComponentsEditable(true);
                this.onFormModeChange.emit(this.mode);
                this.onInsertMode.emit();
                break;
            case OFormComponent.Mode().UPDATE:
                this.beforeUpdateMode.emit();
                this.mode = mode;
                if (this._formToolbar) {
                    this._formToolbar.setEditMode();
                }
                this._setComponentsEditable(true);
                this.onFormModeChange.emit(this.mode);
                this.onUpdateMode.emit();
                break;
            case OFormComponent.Mode().QUERY:
                console.error('Form QUERY mode is not implemented');
                break;
            default:
                break;
        }
    }
    setData(data) {
        if (Util.isArray(data)) {
            if (data.length > 1) {
                console.warn('[OFormComponent] Form data has more than a single record. Storing empty data');
            }
            const currentData = data.length === 1 ? data[0] : {};
            this._updateFormData(this.toFormValueData(currentData));
            this._emitData(currentData);
        }
        else if (Util.isObject(data)) {
            this._updateFormData(this.toFormValueData(data));
            this._emitData(data);
        }
        else {
            console.warn('Form has received not supported service data. Supported data are Array or Object');
            this._updateFormData({});
        }
    }
    _setData(data) {
        console.warn('Method `OFormComponent._setData` is deprecated and will be removed in the furute. Use `setData` instead');
        this.setData(data);
    }
    _emitData(data) {
        this.onDataLoaded.emit(data);
    }
    _backAction() {
        console.warn('Method `OFormComponent._backAction` is deprecated and will be removed in the furute. Use `back` instead');
        this.back();
    }
    back() {
        this.formNavigation.navigateBack();
    }
    _closeDetailAction(options) {
        console.warn('Method `OFormComponent._closeDetailAction` is deprecated and will be removed in the furute. Use `closeDetail` instead');
        this.closeDetail(options);
    }
    closeDetail(options) {
        this.formNavigation.closeDetailAction(options);
    }
    _stayInRecordAfterInsert(insertedKeys) {
        this.formNavigation.stayInRecordAfterInsert(insertedKeys);
    }
    _reloadAction(useFilter = false) {
        console.warn('Method `OFormComponent._reloadAction` is deprecated and will be removed in the furute. Use `reload` instead');
        this.reload(useFilter);
    }
    reload(useFilter = false) {
        let filter = {};
        if (useFilter) {
            filter = this.getCurrentKeysValues();
        }
        this.queryData(filter);
    }
    _goInsertMode(options) {
        console.warn('Method `OFormComponent._goInsertMode` is deprecated and will be removed in the furute. Use `goInsertMode` instead');
        this.goInsertMode(options);
    }
    goInsertMode(options) {
        this.formNavigation.goInsertMode(options);
    }
    _clearFormAfterInsert() {
        this.clearData();
        this._setComponentsEditable(true);
    }
    _insertAction() {
        console.warn('Method `OFormComponent._insertAction` is deprecated and will be removed in the furute. Use `insert` instead');
        this.insert();
    }
    insert() {
        Object.keys(this.formGroup.controls).forEach((control) => {
            this.formGroup.controls[control].markAsTouched();
        });
        if (!this.formGroup.valid) {
            this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
            return;
        }
        const self = this;
        const values = this.getAttributesValuesToInsert();
        const sqlTypes = this.getAttributesSQLTypes();
        this.insertData(values, sqlTypes).subscribe(resp => {
            self.postCorrectInsert(resp);
            self.formCache.setCacheSnapshot();
            self.markFormLayoutManagerToUpdate();
            if (self.afterInsertMode === 'detail') {
                self._stayInRecordAfterInsert(resp);
            }
            else if (self.afterInsertMode === 'new') {
                this._clearFormAfterInsert();
            }
            else {
                self.closeDetail();
            }
        }, error => {
            self.postIncorrectInsert(error);
        });
    }
    _goEditMode(options) {
        console.warn('Method `OFormComponent._goEditMode` is deprecated and will be removed in the furute. Use `goEditMode` instead');
        this.goEditMode(options);
    }
    goEditMode(options) {
        this.formNavigation.goEditMode();
    }
    _editAction() {
        console.warn('Method `OFormComponent._editAction` is deprecated and will be removed in the furute. Use `update` instead');
        this.update();
    }
    update() {
        Object.keys(this.formGroup.controls).forEach((control) => {
            this.formGroup.controls[control].markAsTouched();
        });
        if (!this.formGroup.valid) {
            this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
            return;
        }
        const self = this;
        const filter = this.getKeysValues();
        const values = this.getAttributesValuesToUpdate();
        const sqlTypes = this.getAttributesSQLTypes();
        if (Object.keys(values).length === 0) {
            this.dialogService.alert('INFO', 'MESSAGES.FORM_NOTHING_TO_UPDATE_INFO');
            return;
        }
        this.updateData(filter, values, sqlTypes).subscribe(resp => {
            self.postCorrectUpdate(resp);
            self.formCache.setCacheSnapshot();
            self.markFormLayoutManagerToUpdate();
            if (self.stayInRecordAfterEdit) {
                self.reload(true);
            }
            else {
                self.closeDetail();
            }
        }, error => {
            self.postIncorrectUpdate(error);
        });
    }
    _deleteAction() {
        console.warn('Method `OFormComponent._deleteAction` is deprecated and will be removed in the furute. Use `delete` instead');
        return this.delete();
    }
    delete() {
        const filter = this.getKeysValues();
        return this.deleteData(filter);
    }
    queryData(filter) {
        if (!Util.isDefined(this.dataService)) {
            console.warn('OFormComponent: no service configured! aborting query');
            return;
        }
        if (!Util.isDefined(filter) || Object.keys(filter).length === 0) {
            console.warn('OFormComponent: no filter configured! aborting query');
            return;
        }
        this.formCache.restartCache();
        this.clearComponentsOldValue();
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        const av = this.getAttributesToQuery();
        const sqlTypes = this.getAttributesSQLTypes();
        this.querySubscription = this.dataService[this.queryMethod](filter, av, this.entity, sqlTypes)
            .subscribe((resp) => {
            if (resp.isSuccessful()) {
                this.setData(resp.data);
            }
            else {
                this._updateFormData({});
                this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
                console.error('ERROR: ' + resp.message);
            }
            this.loaderSubscription.unsubscribe();
        }, err => {
            console.error(err);
            this._updateFormData({});
            if (Util.isDefined(this.queryFallbackFunction)) {
                this.queryFallbackFunction(err);
            }
            else if (err && err.statusText) {
                this.dialogService.alert('ERROR', err.statusText);
            }
            else {
                this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
            }
            this.loaderSubscription.unsubscribe();
        });
    }
    getAttributesToQuery() {
        let attributes = [];
        if (this.keysArray && this.keysArray.length > 0) {
            attributes.push(...this.keysArray);
        }
        const components = this.getComponents();
        Object.keys(components).forEach(item => {
            if (attributes.indexOf(item) < 0 &&
                components[item].isAutomaticRegistering() && components[item].isAutomaticBinding()) {
                attributes.push(item);
            }
        });
        const dataCache = this.formCache.getDataCache();
        if (dataCache) {
            Object.keys(dataCache).forEach(item => {
                if (item !== undefined && attributes.indexOf(item) === -1) {
                    attributes.push(item);
                }
            });
        }
        attributes = attributes.concat(this.colsArray.filter(col => attributes.indexOf(col) < 0));
        return attributes;
    }
    insertData(values, sqlTypes) {
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        const self = this;
        const observable = new Observable(observer => {
            this.dataService[this.insertMethod](values, this.entity, sqlTypes).subscribe(resp => {
                if (resp.isSuccessful()) {
                    observer.next(resp.data);
                    observer.complete();
                }
                else {
                    observer.error(resp.message);
                }
                self.loaderSubscription.unsubscribe();
            }, err => {
                observer.error(err);
                self.loaderSubscription.unsubscribe();
            });
        });
        return observable;
    }
    getAttributesValuesToInsert() {
        const attrValues = {};
        if (this.formParentKeysValues) {
            Object.assign(attrValues, this.formParentKeysValues);
        }
        return Object.assign(attrValues, this.getRegisteredFieldsValues());
    }
    getAttributesSQLTypes() {
        const types = {};
        this.keysSqlTypesArray.forEach((kst, i) => types[this.keysArray[i]] = SQLTypes.getSQLTypeValue(kst));
        if (this._compSQLTypes && Object.keys(this._compSQLTypes).length > 0) {
            Object.assign(types, this._compSQLTypes);
        }
        return types;
    }
    updateData(filter, values, sqlTypes) {
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        const self = this;
        const observable = new Observable(observer => {
            this.dataService[this.updateMethod](filter, values, this.entity, sqlTypes).subscribe(resp => {
                if (resp.isSuccessful()) {
                    observer.next(resp.data);
                    observer.complete();
                }
                else {
                    observer.error(resp.message);
                }
                self.loaderSubscription.unsubscribe();
            }, err => {
                observer.error(err);
                self.loaderSubscription.unsubscribe();
            });
        });
        return observable;
    }
    getAttributesValuesToUpdate() {
        const values = {};
        const self = this;
        const changedAttrs = this.formCache.getChangedFormControlsAttr();
        Object.keys(this.formGroup.controls).filter(controlName => self.ignoreFormCacheKeys.indexOf(controlName) === -1 &&
            changedAttrs.indexOf(controlName) !== -1).forEach((item) => {
            const control = self.formGroup.controls[item];
            if (control instanceof OFormControl) {
                values[item] = control.getValue();
            }
            else {
                values[item] = control.value;
            }
            if (values[item] === undefined) {
                values[item] = null;
            }
        });
        return values;
    }
    deleteData(filter) {
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        const self = this;
        const observable = new Observable(observer => {
            this.canDiscardChanges = true;
            this.dataService[this.deleteMethod](filter, this.entity).subscribe(resp => {
                if (resp.isSuccessful()) {
                    self.formCache.setCacheSnapshot();
                    self.markFormLayoutManagerToUpdate();
                    self.postCorrectDelete(resp);
                    observer.next(resp.data);
                    observer.complete();
                }
                else {
                    self.postIncorrectDelete(resp);
                    observer.error(resp.message);
                }
                self.loaderSubscription.unsubscribe();
            }, err => {
                self.postIncorrectDelete(err);
                observer.error(err);
                self.loaderSubscription.unsubscribe();
            });
        });
        return observable;
    }
    toJSONData(data) {
        if (!data) {
            data = {};
        }
        const valueData = {};
        Object.keys(data).forEach((item) => {
            valueData[item] = data[item].value;
        });
        return valueData;
    }
    toFormValueData(data) {
        if (data && Util.isArray(data)) {
            const valueData = [];
            const self = this;
            data.forEach(item => {
                valueData.push(self.objectToFormValueData(item));
            });
            return valueData;
        }
        else if (data && Util.isObject(data)) {
            return this.objectToFormValueData(data);
        }
        return undefined;
    }
    getKeysValues() {
        const filter = {};
        const currentRecord = this.formData;
        if (!this.keysArray) {
            return filter;
        }
        this.keysArray.forEach(key => {
            if (currentRecord[key] !== undefined) {
                let currentData = currentRecord[key];
                if (currentData instanceof OFormValue) {
                    currentData = currentData.value;
                }
                filter[key] = currentData;
            }
        });
        return filter;
    }
    isInQueryMode() {
        return this.mode === OFormComponent.Mode().QUERY;
    }
    isInInsertMode() {
        return this.mode === OFormComponent.Mode().INSERT;
    }
    isInUpdateMode() {
        return this.mode === OFormComponent.Mode().UPDATE;
    }
    isInInitialMode() {
        return this.mode === OFormComponent.Mode().INITIAL;
    }
    setQueryMode() {
        this.setFormMode(OFormComponent.Mode().QUERY);
    }
    setInsertMode() {
        this.setFormMode(OFormComponent.Mode().INSERT);
    }
    setUpdateMode() {
        this.setFormMode(OFormComponent.Mode().UPDATE);
    }
    setInitialMode() {
        this.setFormMode(OFormComponent.Mode().INITIAL);
    }
    registerDynamicFormComponent(dynamicForm) {
        if (!Util.isDefined(dynamicForm)) {
            return;
        }
        const self = this;
        this.dynamicFormSubscription = dynamicForm.render.subscribe(res => {
            if (res) {
                self.refreshComponentsEditableState();
                if (!self.isInInsertMode() && self.queryOnInit) {
                    self.reload(true);
                }
                if (self.formParentKeysValues) {
                    Object.keys(self.formParentKeysValues).forEach(parentKey => {
                        const value = self.formParentKeysValues[parentKey];
                        const comp = self.getFieldReference(parentKey);
                        if (Util.isFormDataComponent(comp) && comp.isAutomaticBinding()) {
                            comp.setValue(value, {
                                emitModelToViewChange: false,
                                emitEvent: false
                            });
                        }
                    });
                }
            }
        });
    }
    unregisterDynamicFormComponent(dynamicForm) {
        if (dynamicForm && this.dynamicFormSubscription) {
            this.dynamicFormSubscription.unsubscribe();
        }
    }
    getRequiredComponents() {
        const requiredCompontents = {};
        const components = this.getComponents();
        if (components) {
            Object.keys(components).forEach(key => {
                const comp = components[key];
                const attr = comp.getAttribute();
                if (comp.isRequired && attr && attr.length > 0) {
                    requiredCompontents[attr] = comp;
                }
            });
        }
        return requiredCompontents;
    }
    get layoutDirection() {
        return this._layoutDirection;
    }
    set layoutDirection(val) {
        const parsedVal = (val || '').toLowerCase();
        this._layoutDirection = ['row', 'column', 'row-reverse', 'column-reverse'].indexOf(parsedVal) !== -1 ? parsedVal : OFormComponent.DEFAULT_LAYOUT_DIRECTION;
    }
    get layoutAlign() {
        return this._layoutAlign;
    }
    set layoutAlign(val) {
        this._layoutAlign = val;
    }
    get showFloatingToolbar() {
        return this.showHeader && this.headerMode === 'floating';
    }
    get showNotFloatingToolbar() {
        return this.showHeader && this.headerMode !== 'floating';
    }
    isEditableDetail() {
        return this.editableDetail;
    }
    isInitialStateChanged() {
        return this.formCache.isInitialStateChanged();
    }
    _undoLastChangeAction() {
        console.warn('Method `OFormComponent._undoLastChangeAction` is deprecated and will be removed in the furute. Use `undo` instead');
        this.undo();
    }
    undo() {
        this.formCache.undoLastChange();
    }
    get isCacheStackEmpty() {
        return this.formCache.isCacheStackEmpty;
    }
    undoKeyboardPressed() {
        this.formCache.undoLastChange({
            keyboardEvent: true
        });
    }
    getFormToolbar() {
        return this._formToolbar;
    }
    getFormManager() {
        return this.formNavigation.formLayoutManager;
    }
    getFormNavigation() {
        return this.formNavigation;
    }
    getFormCache() {
        return this.formCache;
    }
    getUrlParam(arg) {
        return this.getFormNavigation().getUrlParams()[arg];
    }
    getUrlParams() {
        return this.getFormNavigation().getUrlParams();
    }
    setUrlParamsAndReload(val) {
        this.formNavigation.setUrlParams(val);
        this.reload(true);
    }
    getRegisteredFieldsValues() {
        const values = {};
        const components = this.getComponents();
        const self = this;
        const componentsKeys = Object.keys(components).filter(key => self.ignoreFormCacheKeys.indexOf(key) === -1);
        componentsKeys.forEach(compKey => {
            const comp = components[compKey];
            values[compKey] = comp.getValue();
        });
        return values;
    }
    getFieldValue(attr) {
        let value = null;
        const comp = this.getFieldReference(attr);
        if (comp) {
            value = comp.getValue();
        }
        return value;
    }
    getFieldValues(attrs) {
        const arr = {};
        attrs.forEach(key => arr[key] = this.getFieldValue(key));
        return arr;
    }
    setFieldValue(attr, value, options) {
        const comp = this.getFieldReference(attr);
        if (comp) {
            comp.setValue(value, options);
        }
    }
    setFieldValues(values, options) {
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                this.setFieldValue(key, values[key], options);
            }
        }
    }
    clearFieldValue(attr, options) {
        const comp = this.getFieldReference(attr);
        if (comp) {
            comp.clearValue(options);
        }
    }
    clearFieldValues(attrs, options) {
        const self = this;
        attrs.forEach((key) => {
            self.clearFieldValue(key, options);
        });
    }
    getFieldReference(attr) {
        return this._components[attr];
    }
    getFieldReferences(attrs) {
        const arr = {};
        const self = this;
        attrs.forEach((key, index) => {
            arr[key] = self.getFieldReference(key);
        });
        return arr;
    }
    getFormComponentPermissions(attr) {
        let permissions;
        if (Util.isDefined(this.permissions)) {
            permissions = (this.permissions.components || []).find(comp => comp.attr === attr);
        }
        return permissions;
    }
    getActionsPermissions() {
        let permissions;
        if (Util.isDefined(this.permissions)) {
            permissions = (this.permissions.actions || []);
        }
        return permissions;
    }
    determinateFormMode() {
        const urlSegments = this.formNavigation.getUrlSegments();
        if (urlSegments.length > 0) {
            const segment = urlSegments[urlSegments.length - 1];
            this.determinateModeFromUrlSegment(segment);
        }
        else if (this.actRoute.parent) {
            this.actRoute.parent.url.subscribe(segments => {
                const segment = segments[segments.length - 1];
                this.determinateModeFromUrlSegment(segment);
            });
        }
        else {
            this.setFormMode(OFormComponent.Mode().INITIAL);
        }
        this.stayInRecordAfterEdit = this.stayInRecordAfterEdit || this.isEditableDetail();
    }
    determinateModeFromUrlSegment(segment) {
        const _path = segment ? segment.path : '';
        if (this.isInsertModePath(_path)) {
            this.setInsertMode();
            return;
        }
        else if (this.isUpdateModePath(_path)) {
            this.setUpdateMode();
        }
        else {
            this.setInitialMode();
        }
    }
    _updateFormData(newFormData) {
        const self = this;
        this.zone.run(() => {
            this.formData = newFormData;
            const components = this.getComponents();
            if (components) {
                Object.keys(components).forEach(key => {
                    const comp = components[key];
                    if (Util.isFormDataComponent(comp)) {
                        try {
                            if (comp.isAutomaticBinding()) {
                                comp.data = self.getDataValue(key);
                            }
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                });
                self.initializeFields();
            }
        });
    }
    initializeFields() {
        Object.keys(this.formGroup.controls).forEach(control => {
            this.formGroup.controls[control].markAsPristine();
        });
        this.formCache.registerCache();
        this.formNavigation.updateNavigation();
    }
    clearComponentsOldValue() {
        const components = this.getComponents();
        const self = this;
        const componentsKeys = Object.keys(components).filter(key => self.ignoreFormCacheKeys.indexOf(key) === -1);
        componentsKeys.forEach(compKey => {
            const comp = components[compKey];
            comp.oldValue = undefined;
            comp.getFormControl().setValue(undefined);
        });
    }
    postCorrectInsert(result) {
        this.snackBarService.open('MESSAGES.INSERTED', { icon: 'check_circle' });
        this.onInsert.emit(result);
    }
    postIncorrectInsert(result) {
        this.showError('insert', result);
    }
    postIncorrectDelete(result) {
        this.showError('delete', result);
    }
    postIncorrectUpdate(result) {
        this.showError('update', result);
    }
    postCorrectUpdate(result) {
        this.snackBarService.open('MESSAGES.SAVED', { icon: 'check_circle' });
        this.onUpdate.emit(result);
    }
    postCorrectDelete(result) {
        this.snackBarService.open('MESSAGES.DELETED', { icon: 'check_circle' });
        this.onDelete.emit(result);
    }
    markFormLayoutManagerToUpdate() {
        const formLayoutManager = this.getFormManager();
        if (Util.isDefined(formLayoutManager)) {
            formLayoutManager.markForUpdate = true;
        }
    }
    objectToFormValueData(data = {}) {
        const valueData = {};
        Object.keys(data).forEach((item) => {
            valueData[item] = new OFormValue(data[item]);
        });
        return valueData;
    }
    getCurrentKeysValues() {
        return this.formNavigation.getCurrentKeysValues();
    }
    refreshComponentsEditableState() {
        switch (this.mode) {
            case OFormComponent.Mode().INITIAL:
                this._setComponentsEditable(this.isEditableDetail());
                break;
            case OFormComponent.Mode().INSERT:
            case OFormComponent.Mode().UPDATE:
                this._setComponentsEditable(true);
                break;
            default:
                break;
        }
    }
    isInsertModePath(path) {
        const navData = this.navigationService.getLastItem();
        return Util.isDefined(navData) && path === navData.getInsertFormRoute();
    }
    isUpdateModePath(path) {
        const navData = this.navigationService.getPreviousRouteData();
        return Util.isDefined(navData) && path === navData.getEditFormRoute();
    }
    showError(operation, result) {
        if (result && typeof result !== 'object') {
            this.dialogService.alert('ERROR', result);
        }
        else {
            let message = 'MESSAGES.ERROR_DELETE';
            switch (operation) {
                case 'update':
                    message = 'MESSAGES.ERROR_UPDATE';
                    break;
                case 'insert':
                    message = 'MESSAGES.ERROR_INSERT';
                    break;
            }
            this.dialogService.alert('ERROR', message);
        }
    }
}
OFormComponent.DEFAULT_LAYOUT_DIRECTION = 'column';
OFormComponent.guardClassName = 'CanDeactivateFormGuard';
OFormComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-form',
                providers: [
                    OntimizeServiceProvider
                ],
                template: "<ng-template #customFormToolbarButtons>\n  <ng-content select=\"[o-form-toolbar-buttons]\"></ng-content>\n</ng-template>\n\n<o-form-toolbar *ngIf=\"showFloatingToolbar && headerPosition==='top'\" [label-header]=\"labelheader\"\n  [label-header-align]=\"labelHeaderAlign\" [header-actions]=\"headeractions\"\n  [show-header-navigation]=\"showHeaderNavigation\" [show-header-actions-text]=\"showHeaderActionsText\" layout-padding>\n  <div o-custom-form-toolbar-buttons-wrapper fxLayout=\"row\" fxLayoutAlign=\"end center\">\n    <ng-container *ngTemplateOutlet=\"customFormToolbarButtons\"></ng-container>\n  </div>\n</o-form-toolbar>\n\n<ng-host oKeyboardListener keyboardKeys=\"17;90\" (onKeysPressed)=\"undoKeyboardPressed()\" class=\"scrolling o-scroll\">\n  <div fxFlex=\"grow\">\n    <o-form-toolbar *ngIf=\"showNotFloatingToolbar && headerPosition==='top'\" [label-header]=\"labelheader\"\n      [label-header-align]=\"labelHeaderAlign\" [header-actions]=\"headeractions\"\n      [show-header-navigation]=\"showHeaderNavigation\" [show-header-actions-text]=\"showHeaderActionsText\" layout-padding>\n      <div o-custom-form-toolbar-buttons-wrapper fxLayout=\"row\" fxLayoutAlign=\"end center\">\n        <div o-custom-form-toolbar-buttons-wrapper fxLayout=\"row\" fxLayoutAlign=\"end center\">\n          <ng-container *ngTemplateOutlet=\"customFormToolbarButtons\"></ng-container>\n        </div>\n      </div>\n    </o-form-toolbar>\n\n    <form #innerForm [formGroup]=\"formGroup\" class=\"inner-form\" [class.form-no-toolbar]=\"!showHeader\" autocomplete=\"off\"\n      autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n      <div *ngIf=\"loading | async\" class=\"progress-bar-container\">\n        <mat-progress-bar mode=\"indeterminate\"></mat-progress-bar>\n      </div>\n      <div layout-padding [fxLayout]=\"layoutDirection\" [fxLayoutAlign]=\"layoutAlign\" class=\"o-form-content-wrapper\">\n        <ng-content></ng-content>\n      </div>\n    </form>\n\n    <o-form-toolbar *ngIf=\"showNotFloatingToolbar && headerPosition==='bottom'\" [label-header]=\"labelheader\"\n      [label-header-align]=\"labelHeaderAlign\" [header-actions]=\"headeractions\"\n      [show-header-navigation]=\"showHeaderNavigation\" [show-header-actions-text]=\"showHeaderActionsText\" layout-padding>\n      <div o-custom-form-toolbar-buttons-wrapper fxLayout=\"row\" fxLayoutAlign=\"end center\">\n        <ng-container *ngTemplateOutlet=\"customFormToolbarButtons\"></ng-container>\n      </div>\n    </o-form-toolbar>\n  </div>\n</ng-host>\n\n<o-form-toolbar *ngIf=\"showFloatingToolbar && headerPosition==='bottom'\" [label-header]=\"labelheader\"\n  [label-header-align]=\"labelHeaderAlign\" [header-actions]=\"headeractions\"\n  [show-header-navigation]=\"showHeaderNavigation\" [show-header-actions-text]=\"showHeaderActionsText\" layout-padding>\n  <div o-custom-form-toolbar-buttons-wrapper fxLayout=\"row\" fxLayoutAlign=\"end center\">\n    <ng-container *ngTemplateOutlet=\"customFormToolbarButtons\"></ng-container>\n  </div>\n</o-form-toolbar>",
                inputs: DEFAULT_INPUTS_O_FORM,
                outputs: DEFAULT_OUTPUTS_O_FORM,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-form]': 'true'
                },
                styles: [".o-form{display:flex;flex:auto;flex-direction:column;max-height:100%}.o-form .scrolling{display:flex;flex:auto;overflow-y:auto;flex-direction:column}.o-form form.inner-form{display:flex;flex:auto;flex-direction:column;max-height:100%}.o-form form.inner-form .progress-bar-container{padding:8px}.o-form form.form-no-toolbar{top:0}.o-form form .o-form-content-wrapper{height:100%;width:100%;box-sizing:border-box}"]
            }] }
];
OFormComponent.ctorParameters = () => [
    { type: Router },
    { type: ActivatedRoute },
    { type: NgZone },
    { type: ChangeDetectorRef },
    { type: Injector },
    { type: ElementRef }
];
OFormComponent.propDecorators = {
    innerFormEl: [{ type: ViewChild, args: ['innerForm', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "showHeader", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "stayInRecordAfterEdit", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "queryOnInit", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "editableDetail", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "undoButton", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "showHeaderNavigation", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "includeBreadcrumb", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "detectChangesOnBlur", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormComponent.prototype, "confirmExit", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9mb3JtL28tZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUNSLE1BQU0sRUFHTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBYyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFaEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBTWxFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sbUNBQW1DLENBQUM7QUFDdkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUtsRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFB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LEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQTNHekM7SUFEQyxjQUFjLEVBQUU7O2tEQUNVO0FBWTNCO0lBREMsY0FBYyxFQUFFOzs2REFDc0I7QUFJdkM7SUFEQyxjQUFjLEVBQUU7O21EQUNxQjtBQVN0QztJQURDLGNBQWMsRUFBRTs7c0RBQ3dCO0FBR3pDO0lBREMsY0FBYyxFQUFFOztrREFDVTtBQUUzQjtJQURDLGNBQWMsRUFBRTs7NERBQ3FCO0FBR3RDO0lBREMsY0FBYyxFQUFFOzt5REFDa0I7QUFFbkM7SUFEQyxjQUFjLEVBQUU7OzJEQUNtQjtBQUVwQztJQURDLGNBQWMsRUFBRTs7bURBQ1ciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIsIFVybFNlZ21lbnQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElGb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZvcm1EYXRhVHlwZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLXR5cGUtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UsIE9OYXZpZ2F0aW9uSXRlbSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT0Zvcm1Jbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLWZvcm0taW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9Gb3JtUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLWZvcm0tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS1jb250YWluZXIvby1mb3JtLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1Db250cm9sIH0gZnJvbSAnLi4vaW5wdXQvby1mb3JtLWNvbnRyb2wuY2xhc3MnO1xuaW1wb3J0IHsgT0Zvcm1DYWNoZUNsYXNzIH0gZnJvbSAnLi9jYWNoZS9vLWZvcm0uY2FjaGUuY2xhc3MnO1xuaW1wb3J0IHsgQ2FuQ29tcG9uZW50RGVhY3RpdmF0ZSwgQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCB9IGZyb20gJy4vZ3VhcmRzL28tZm9ybS1jYW4tZGVhY3RpdmF0ZS5ndWFyZCc7XG5pbXBvcnQgeyBPRm9ybU5hdmlnYXRpb25DbGFzcyB9IGZyb20gJy4vbmF2aWdhdGlvbi9vLWZvcm0ubmF2aWdhdGlvbi5jbGFzcyc7XG5pbXBvcnQgeyBPRm9ybVZhbHVlIH0gZnJvbSAnLi9PRm9ybVZhbHVlJztcbmltcG9ydCB7IE9Gb3JtVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQnO1xuXG5pbnRlcmZhY2UgSUZvcm1EYXRhQ29tcG9uZW50SGFzaCB7XG4gIFthdHRyOiBzdHJpbmddOiBJRm9ybURhdGFDb21wb25lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk0gPSBbXG4gIC8vIHNob3ctaGVhZGVyIFtib29sZWFuXTogdmlzaWJpbGl0eSBvZiBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dIZWFkZXI6IHNob3ctaGVhZGVyJyxcblxuICAvLyBoZWFkZXItbW9kZSBbc3RyaW5nXVsgbm9uZSB8IGZsb2F0aW5nIF06IHBhaW50aW5nIG1vZGUgb2YgZm9ybSB0b29sYmFyLiBEZWZhdWx0OiAnZmxvYXRpbmcnXG4gICdoZWFkZXJNb2RlOiBoZWFkZXItbW9kZScsXG5cbiAgLy8gaGVhZGVyLXBvc2l0aW9uIFsgdG9wIHwgYm90dG9tIF06IHBvc2l0aW9uIG9mIHRoZSBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6ICd0b3AnXG4gICdoZWFkZXJQb3NpdGlvbjogaGVhZGVyLXBvc2l0aW9uJyxcblxuICAvLyBsYWJlbC1oZWFkZXIgW3N0cmluZ106IGRpc3BsYXlhYmxlIHRleHQgb24gZm9ybSB0b29sYmFyLiBEZWZhdWx0OiAnJy5cbiAgJ2xhYmVsaGVhZGVyOiBsYWJlbC1oZWFkZXInLFxuXG4gIC8vIGxhYmVsLWhlYWRlci1hbGlnbiBbc3RyaW5nXVtzdGFydCB8IGNlbnRlciB8IGVuZF06IGFsaWdubWVudCBvZiBmb3JtIHRvb2xiYXIgdGV4dC4gRGVmYXVsdDogJ2NlbnRlcidcbiAgJ2xhYmVsSGVhZGVyQWxpZ246IGxhYmVsLWhlYWRlci1hbGlnbicsXG5cbiAgLy8gaGVhZGVyLWFjdGlvbnMgW3N0cmluZ106IGF2YWlsYWJsZSBhY3Rpb24gYnV0dG9ucyBvbiBmb3JtIHRvb2xiYXIgb2Ygc3RhbmRhcmQgQ1JVRCBvcGVyYXRpb25zLCBzZXBhcmF0ZWQgYnkgJzsnLiBBdmFpbGFibGUgb3B0aW9ucyBhcmUgUjtJO1U7RCAoUmVmcmVzaCwgSW5zZXJ0LCBVcGRhdGUsIERlbGV0ZSkuIERlZmF1bHQ6IFI7STtVO0RcbiAgJ2hlYWRlcmFjdGlvbnM6IGhlYWRlci1hY3Rpb25zJyxcblxuICAvLyBzaG93LWhlYWRlci1hY3Rpb25zLXRleHQgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHRleHQgb2YgZm9ybSB0b29sYmFyIGJ1dHRvbnMuIERlZmF1bHQgeWVzXG4gICdzaG93SGVhZGVyQWN0aW9uc1RleHQ6IHNob3ctaGVhZGVyLWFjdGlvbnMtdGV4dCcsXG5cbiAgLy8gZW50aXR5IFtzdHJpbmddOiBlbnRpdHkgb2YgdGhlIHNlcnZpY2UuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnZW50aXR5JyxcblxuICAvLyBrZXlzIFtzdHJpbmddOiBlbnRpdHkga2V5cywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdrZXlzJyxcblxuICAvLyBjb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBlbnRpdHksIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnY29sdW1ucycsXG5cbiAgLy8gc2VydmljZSBbc3RyaW5nXTogSkVFIHNlcnZpY2UgcGF0aC4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzZXJ2aWNlJyxcblxuICAvLyBzdGF5LWluLXJlY29yZC1hZnRlci1lZGl0IFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogc2hvd3MgZWRpdCBmb3JtIGFmdGVyIGVkaXQgYSByZWNvcmQuIERlZmF1bHQ6IGZhbHNlO1xuICAnc3RheUluUmVjb3JkQWZ0ZXJFZGl0OiBzdGF5LWluLXJlY29yZC1hZnRlci1lZGl0JyxcblxuICAvLyBbc3RyaW5nXVtuZXcgfCBkZXRhaWxdOiBzaG93cyByZXNldGVkIGZvcm0gYWZ0ZXIgaW5zZXJ0IGEgbmV3IHJlY29yZCAobmV3KSBvciBzaG93cyB0aGUgaW5zZXJ0ZWQgcmVjb3JkIGFmdGVyIChkZXRhaWwpXG4gICdhZnRlckluc2VydE1vZGU6IGFmdGVyLWluc2VydC1tb2RlJyxcblxuICAnc2VydmljZVR5cGUgOiBzZXJ2aWNlLXR5cGUnLFxuXG4gICdxdWVyeU9uSW5pdCA6IHF1ZXJ5LW9uLWluaXQnLFxuXG4gICdwYXJlbnRLZXlzOiBwYXJlbnQta2V5cycsXG5cbiAgLy8gcXVlcnktbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHF1ZXJpZXMuIERlZmF1bHQ6IHF1ZXJ5LlxuICAncXVlcnlNZXRob2Q6IHF1ZXJ5LW1ldGhvZCcsXG5cbiAgLy8gaW5zZXJ0LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBpbnNlcnRzLiBEZWZhdWx0OiBpbnNlcnQuXG4gICdpbnNlcnRNZXRob2Q6IGluc2VydC1tZXRob2QnLFxuXG4gIC8vIHVwZGF0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gdXBkYXRlcy4gRGVmYXVsdDogdXBkYXRlLlxuICAndXBkYXRlTWV0aG9kOiB1cGRhdGUtbWV0aG9kJyxcblxuICAvLyBkZWxldGUtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGRlbGV0aW9ucy4gRGVmYXVsdDogZGVsZXRlLlxuICAnZGVsZXRlTWV0aG9kOiBkZWxldGUtbWV0aG9kJyxcblxuICAvLyBsYXlvdXQtZGlyZWN0aW9uIFtzdHJpbmddW2NvbHVtbnxyb3ddOiBEZWZhdWx0OiBjb2x1bW5cbiAgJ2xheW91dERpcmVjdGlvbjogbGF5b3V0LWRpcmVjdGlvbicsXG5cbiAgLy8gZnhMYXlvdXRBbGlnbiB2YWx1ZS4gRGVmYXVsdDogJ3N0YXJ0IHN0YXJ0J1xuICAnbGF5b3V0QWxpZ246IGxheW91dC1hbGlnbicsXG5cbiAgLy8gZWRpdGFibGUtZGV0YWlsIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogRGVmYXVsdDogdHJ1ZTtcbiAgJ2VkaXRhYmxlRGV0YWlsOiBlZGl0YWJsZS1kZXRhaWwnLFxuXG4gIC8vIGtleXMtc3FsLXR5cGVzIFtzdHJpbmddOiBlbnRpdHkga2V5cyB0eXBlcywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdrZXlzU3FsVHlwZXM6IGtleXMtc3FsLXR5cGVzJyxcblxuICAvLyB1bmRvLWJ1dHRvbiBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluY2x1ZGUgdW5kbyBidXR0b24gaW4gZm9ybS10b29sYmFyLiBEZWZhdWx0OiB0cnVlO1xuICAndW5kb0J1dHRvbjogdW5kby1idXR0b24nLFxuXG4gIC8vIHNob3ctaGVhZGVyLW5hdmlnYXRpb24gW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBJbmNsdWRlIG5hdmlnYXRpb25zIGJ1dHRvbnMgaW4gZm9ybS10b29sYmFyLiBEZWZhdWx0OiBmYWxzZTtcbiAgJ3Nob3dIZWFkZXJOYXZpZ2F0aW9uOiBzaG93LWhlYWRlci1uYXZpZ2F0aW9uJyxcblxuICAvLyBhdHRyXG4gICdvYXR0cjphdHRyJyxcblxuICAnaW5jbHVkZUJyZWFkY3J1bWI6IGluY2x1ZGUtYnJlYWRjcnVtYicsXG5cbiAgJ2RldGVjdENoYW5nZXNPbkJsdXI6IGRldGVjdC1jaGFuZ2VzLW9uLWJsdXInLFxuXG4gICdjb25maXJtRXhpdDogY29uZmlybS1leGl0JyxcblxuICAvLyBbZnVuY3Rpb25dOiBmdW5jdGlvbiB0byBleGVjdXRlIG9uIHF1ZXJ5IGVycm9yLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3F1ZXJ5RmFsbGJhY2tGdW5jdGlvbjogcXVlcnktZmFsbGJhY2stZnVuY3Rpb24nXG4gIC8vICxcblxuICAvLyAnaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogaW5zZXJ0LWZhbGxiYWNrLWZ1bmN0aW9uJyxcblxuICAvLyAndXBkYXRlRmFsbGJhY2tGdW5jdGlvbjogdXBkYXRlLWZhbGxiYWNrLWZ1bmN0aW9uJyxcblxuICAvLyAnZGVsZXRlRmFsbGJhY2tGdW5jdGlvbjogZGVsZXRlLWZhbGxiYWNrLWZ1bmN0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0ZPUk0gPSBbXG4gICdvbkRhdGFMb2FkZWQnLFxuICAnYmVmb3JlQ2xvc2VEZXRhaWwnLFxuICAnYmVmb3JlR29FZGl0TW9kZScsXG4gICdvbkZvcm1Nb2RlQ2hhbmdlJyxcbiAgJ29uSW5zZXJ0JyxcbiAgJ29uVXBkYXRlJyxcbiAgJ29uRGVsZXRlJyxcbiAgJ2JlZm9yZUluc2VydE1vZGUnLFxuICAnYmVmb3JlVXBkYXRlTW9kZScsXG4gICdiZWZvcmVJbml0aWFsTW9kZScsXG4gICdvbkluc2VydE1vZGUnLFxuICAnb25VcGRhdGVNb2RlJyxcbiAgJ29uSW5pdGlhbE1vZGUnXG5dO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1mb3JtJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT250aW1pemVTZXJ2aWNlUHJvdmlkZXJcbiAgXSxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZm9ybS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZm9ybS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fRk9STSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fRk9STSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1mb3JtXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkNvbXBvbmVudERlYWN0aXZhdGUsIEFmdGVyVmlld0luaXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9MQVlPVVRfRElSRUNUSU9OID0gJ2NvbHVtbic7XG4gIHB1YmxpYyBzdGF0aWMgZ3VhcmRDbGFzc05hbWUgPSAnQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCc7XG5cbiAgLyogaW5wdXRzIHZhcmlhYmxlcyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93SGVhZGVyOiBib29sZWFuID0gdHJ1ZTtcbiAgaGVhZGVyTW9kZTogc3RyaW5nID0gJ2Zsb2F0aW5nJztcbiAgaGVhZGVyUG9zaXRpb246ICd0b3AnIHwgJ2JvdHRvbScgPSAndG9wJztcbiAgbGFiZWxoZWFkZXI6IHN0cmluZyA9ICcnO1xuICBsYWJlbEhlYWRlckFsaWduOiBzdHJpbmcgPSAnY2VudGVyJztcbiAgaGVhZGVyYWN0aW9uczogc3RyaW5nID0gJyc7XG4gIHNob3dIZWFkZXJBY3Rpb25zVGV4dDogc3RyaW5nID0gJ3llcyc7XG4gIGVudGl0eTogc3RyaW5nO1xuICBrZXlzOiBzdHJpbmcgPSAnJztcbiAgY29sdW1uczogc3RyaW5nID0gJyc7XG4gIHNlcnZpY2U6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgc3RheUluUmVjb3JkQWZ0ZXJFZGl0OiBib29sZWFuID0gZmFsc2U7XG4gIGFmdGVySW5zZXJ0TW9kZTogJ25ldycgfCAnZGV0YWlsJyA9IG51bGw7XG4gIHNlcnZpY2VUeXBlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBxdWVyeU9uSW5pdDogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBwYXJlbnRLZXlzOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBxdWVyeU1ldGhvZDogc3RyaW5nID0gQ29kZXMuUVVFUllfTUVUSE9EO1xuICBwcm90ZWN0ZWQgaW5zZXJ0TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5JTlNFUlRfTUVUSE9EO1xuICBwcm90ZWN0ZWQgdXBkYXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5VUERBVEVfTUVUSE9EO1xuICBwcm90ZWN0ZWQgZGVsZXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5ERUxFVEVfTUVUSE9EO1xuICBwcm90ZWN0ZWQgX2xheW91dERpcmVjdGlvbjogc3RyaW5nID0gT0Zvcm1Db21wb25lbnQuREVGQVVMVF9MQVlPVVRfRElSRUNUSU9OO1xuICBwcm90ZWN0ZWQgX2xheW91dEFsaWduOiBzdHJpbmcgPSAnc3RhcnQgc3RyZXRjaCc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBlZGl0YWJsZURldGFpbDogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBrZXlzU3FsVHlwZXM6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgdW5kb0J1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dIZWFkZXJOYXZpZ2F0aW9uOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBvYXR0cjogc3RyaW5nID0gJyc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGluY2x1ZGVCcmVhZGNydW1iOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRldGVjdENoYW5nZXNPbkJsdXI6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBjb25maXJtRXhpdDogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBxdWVyeUZhbGxiYWNrRnVuY3Rpb246IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAvLyBwdWJsaWMgaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb247XG4gIC8vIHB1YmxpYyB1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbjtcbiAgLy8gcHVibGljIGRlbGV0ZUZhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uO1xuXG4gIC8qIGVuZCBvZiBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgLypwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuICBpc0RldGFpbEZvcm06IGJvb2xlYW4gPSBmYWxzZTtcbiAga2V5c0FycmF5OiBzdHJpbmdbXSA9IFtdO1xuICBjb2xzQXJyYXk6IHN0cmluZ1tdID0gW107XG4gIGRhdGFTZXJ2aWNlOiBhbnk7XG4gIF9wS2V5c0VxdWl2ID0ge307XG4gIGtleXNTcWxUeXBlc0FycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIC8qIGVuZCBvZiBwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuICBvbkRhdGFMb2FkZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIGJlZm9yZUNsb3NlRGV0YWlsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBiZWZvcmVVcGRhdGVNb2RlYCBpbnN0ZWFkXG4gICAqL1xuICBiZWZvcmVHb0VkaXRNb2RlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBiZWZvcmVJbnNlcnRNb2RlID0gbmV3IEV2ZW50RW1pdHRlcjxudWxsPigpO1xuICBiZWZvcmVVcGRhdGVNb2RlID0gbmV3IEV2ZW50RW1pdHRlcjxudWxsPigpO1xuICBiZWZvcmVJbml0aWFsTW9kZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVsbD4oKTtcbiAgb25JbnNlcnRNb2RlID0gbmV3IEV2ZW50RW1pdHRlcjxudWxsPigpO1xuICBvblVwZGF0ZU1vZGUgPSBuZXcgRXZlbnRFbWl0dGVyPG51bGw+KCk7XG4gIG9uSW5pdGlhbE1vZGUgPSBuZXcgRXZlbnRFbWl0dGVyPG51bGw+KCk7XG4gIG9uRm9ybU1vZGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG4gIHB1YmxpYyBvbkluc2VydDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvblVwZGF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkRlbGV0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJvdGVjdGVkIGxvYWRpbmdTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHB1YmxpYyBsb2FkaW5nOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5sb2FkaW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgcHVibGljIGZvcm1EYXRhOiBvYmplY3QgPSB7fTtcbiAgcHVibGljIG5hdmlnYXRpb25EYXRhOiBBcnJheTxhbnk+ID0gW107XG4gIHB1YmxpYyBjdXJyZW50SW5kZXggPSAwO1xuICBwdWJsaWMgbW9kZTogbnVtYmVyID0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUw7XG5cbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG4gIHByb3RlY3RlZCBuYXZpZ2F0aW9uU2VydmljZTogTmF2aWdhdGlvblNlcnZpY2U7XG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcblxuICBwcm90ZWN0ZWQgX2Zvcm1Ub29sYmFyOiBPRm9ybVRvb2xiYXJDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIF9jb21wb25lbnRzOiBJRm9ybURhdGFDb21wb25lbnRIYXNoID0ge307XG4gIHByb3RlY3RlZCBfY29tcFNRTFR5cGVzOiBvYmplY3QgPSB7fTtcblxuICBmb3JtUGFyZW50S2V5c1ZhbHVlczogb2JqZWN0O1xuXG4gIHB1YmxpYyBvbkZvcm1Jbml0U3RyZWFtOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIHByb3RlY3RlZCByZWxvYWRTdHJlYW06IE9ic2VydmFibGU8YW55PjtcbiAgcHJvdGVjdGVkIHJlbG9hZFN0cmVhbVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByb3RlY3RlZCBxdWVyeVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgbG9hZGVyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBkeW5hbWljRm9ybVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByb3RlY3RlZCBkZWFjdGl2YXRlR3VhcmQ6IENhbkRlYWN0aXZhdGVGb3JtR3VhcmQ7XG4gIHByb3RlY3RlZCBmb3JtQ2FjaGU6IE9Gb3JtQ2FjaGVDbGFzcztcbiAgcHJvdGVjdGVkIGZvcm1OYXZpZ2F0aW9uOiBPRm9ybU5hdmlnYXRpb25DbGFzcztcblxuICBwdWJsaWMgZm9ybUNvbnRhaW5lcjogT0Zvcm1Db250YWluZXJDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zU2VydmljZTogUGVybWlzc2lvbnNTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnM6IE9Gb3JtUGVybWlzc2lvbnM7XG5cbiAgQFZpZXdDaGlsZCgnaW5uZXJGb3JtJywgeyBzdGF0aWM6IGZhbHNlIH0pIGlubmVyRm9ybUVsOiBFbGVtZW50UmVmO1xuXG4gIGlnbm9yZUZvcm1DYWNoZUtleXM6IEFycmF5PGFueT4gPSBbXTtcbiAgY2FuRGlzY2FyZENoYW5nZXM6IGJvb2xlYW47XG5cbiAgcHVibGljIHN0YXRpYyBNb2RlKCk6IGFueSB7XG4gICAgZW51bSBtIHtcbiAgICAgIFFVRVJZLFxuICAgICAgSU5TRVJULFxuICAgICAgVVBEQVRFLFxuICAgICAgSU5JVElBTFxuICAgIH1cbiAgICByZXR1cm4gbTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcixcbiAgICBwcm90ZWN0ZWQgYWN0Um91dGU6IEFjdGl2YXRlZFJvdXRlLFxuICAgIHByb3RlY3RlZCB6b25lOiBOZ1pvbmUsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZlxuICApIHtcblxuICAgIHRoaXMuZm9ybUNhY2hlID0gbmV3IE9Gb3JtQ2FjaGVDbGFzcyh0aGlzKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uID0gbmV3IE9Gb3JtTmF2aWdhdGlvbkNsYXNzKHRoaXMuaW5qZWN0b3IsIHRoaXMsIHRoaXMucm91dGVyLCB0aGlzLmFjdFJvdXRlKTtcblxuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IGluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KE5hdmlnYXRpb25TZXJ2aWNlKTtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IGluamVjdG9yLmdldChTbmFja0JhclNlcnZpY2UpO1xuICAgIHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoUGVybWlzc2lvbnNTZXJ2aWNlKTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMucmVsb2FkU3RyZWFtID0gY29tYmluZUxhdGVzdChbXG4gICAgICBzZWxmLm9uRm9ybUluaXRTdHJlYW0uYXNPYnNlcnZhYmxlKCksXG4gICAgICBzZWxmLmZvcm1OYXZpZ2F0aW9uLm5hdmlnYXRpb25TdHJlYW0uYXNPYnNlcnZhYmxlKClcbiAgICBdKTtcblxuICAgIHRoaXMucmVsb2FkU3RyZWFtU3Vic2NyaXB0aW9uID0gdGhpcy5yZWxvYWRTdHJlYW0uc3Vic2NyaWJlKHZhbEFyciA9PiB7XG4gICAgICBpZiAoVXRpbC5pc0FycmF5KHZhbEFycikgJiYgdmFsQXJyLmxlbmd0aCA9PT0gMiAmJiAhc2VsZi5pc0luSW5zZXJ0TW9kZSgpKSB7XG4gICAgICAgIGNvbnN0IHZhbEFyclZhbHVlcyA9IHZhbEFyclswXSA9PT0gdHJ1ZSAmJiB2YWxBcnJbMV0gPT09IHRydWU7XG4gICAgICAgIGlmIChzZWxmLnF1ZXJ5T25Jbml0ICYmIHZhbEFyclZhbHVlcykge1xuICAgICAgICAgIHNlbGYucmVsb2FkKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuaW5pdGlhbGl6ZUZpZWxkcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5mb3JtQ29udGFpbmVyID0gaW5qZWN0b3IuZ2V0KE9Gb3JtQ29udGFpbmVyQ29tcG9uZW50KTtcbiAgICAgIHRoaXMuZm9ybUNvbnRhaW5lci5zZXRGb3JtKHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vXG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJGb3JtQ29tcG9uZW50KGNvbXA6IGFueSkge1xuICAgIGlmIChjb21wKSB7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmIChhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmICghY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICAgIGNvbXAucmVwZWF0ZWRBdHRyID0gdHJ1ZTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGVyZSBpcyBhbHJlYWR5IGEgY29tcG9uZW50IHJlZ2lzdGVyZWQgaW4gdGhlIGZvcm0gd2l0aCB0aGUgYXR0cjogJyArIGF0dHIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHNbYXR0cl0gPSBjb21wO1xuICAgICAgICAvLyBTZXR0aW5nIHBhcmVudCBrZXkgdmFsdWVzLi4uXG4gICAgICAgIGlmICh0aGlzLmZvcm1QYXJlbnRLZXlzVmFsdWVzICYmIHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXNbYXR0cl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXNbYXR0cl07XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50c1thdHRyXS5zZXRWYWx1ZSh2YWwsIHtcbiAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXG4gICAgICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgKiBUT0RPLiBDaGVjayBpdCEhIVxuICAgICAgICAqIEVuIHVuIGZvcm11bGFyaW8gY29uIHRhYnMsIGN1YW5kbyBzZSBjYW1iaWEgZGUgdW5vIGEgb3Rybywgc2UgZGVzdHJ1eWVuIGxhcyB2aXN0YXNcbiAgICAgICAgKiBkZSBsb3MgY29tcG9uZW50ZXMgaGlqbyBkZWwgZm9ybXVsYXJpby5cbiAgICAgICAgKiBmb3JtRGF0YUNhY2hlIGNvbnRpZW5lIGxvcyB2YWxvcmVzIChvcmlnaW5hbGVzIMOzIGVkaXRhZG9zKSBkZSBsb3MgY2FtcG9zIGRlbCBmb3JtdWxhcmlvLlxuICAgICAgICAqIExhIGlkZWEgZXMgYXNpZ25hciBlc2UgdmFsb3IgYWwgY2FtcG8gY3VhbmRvIHNlIHJlZ2lzdHJlIGRlIG51ZXZvIChIYXkgcXVlIGFzZWd1cmFyIGVsIHByb2Nlc29cbiAgICAgICAgKiBwYXJhIHF1ZSBzw7NsbyBzZWEgY3VhbmRvIHNlIHJlZ2lzdHJhIGRlIG51ZXZvIDspIClcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2FjaGVkVmFsdWUgPSB0aGlzLmZvcm1DYWNoZS5nZXRDYWNoZWRWYWx1ZShhdHRyKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNhY2hlZFZhbHVlKSAmJiB0aGlzLmdldERhdGFWYWx1ZXMoKSAmJiB0aGlzLl9jb21wb25lbnRzLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50c1thdHRyXS5zZXRWYWx1ZShjYWNoZWRWYWx1ZSwge1xuICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyU1FMVHlwZUZvcm1Db21wb25lbnQoY29tcDogSUZvcm1EYXRhVHlwZUNvbXBvbmVudCkge1xuICAgIGlmICgoY29tcCBhcyBhbnkpLnJlcGVhdGVkQXR0cikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29tcCkge1xuICAgICAgY29uc3QgdHlwZSA9IGNvbXAuZ2V0U1FMVHlwZSgpO1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAodHlwZSAhPT0gU1FMVHlwZXMuT1RIRVIgJiYgYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDAgJiYgdGhpcy5pZ25vcmVGb3JtQ2FjaGVLZXlzLmluZGV4T2YoYXR0cikgPT09IC0xKSB7XG4gICAgICAgIC8vIFJpZ2h0IG5vdyBqdXN0IHN0b3JlIHZhbHVlcyBkaWZmZXJlbnQgb2YgJ09USEVSJ1xuICAgICAgICB0aGlzLl9jb21wU1FMVHlwZXNbYXR0cl0gPSB0eXBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRm9ybUNvbnRyb2xDb21wb25lbnQoY29tcDogSUZvcm1EYXRhQ29tcG9uZW50KSB7XG4gICAgaWYgKChjb21wIGFzIGFueSkucmVwZWF0ZWRBdHRyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb21wKSB7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmIChhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb250cm9sOiBGb3JtQ29udHJvbCA9IGNvbXAuZ2V0Q29udHJvbCgpO1xuICAgICAgICBpZiAoY29udHJvbCkge1xuICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlZ2lzdGVyQ29udHJvbChhdHRyLCBjb250cm9sKTtcbiAgICAgICAgICBpZiAoIWNvbXAuaXNBdXRvbWF0aWNSZWdpc3RlcmluZygpKSB7XG4gICAgICAgICAgICB0aGlzLmlnbm9yZUZvcm1DYWNoZUtleXMucHVzaChjb21wLmdldEF0dHJpYnV0ZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnJlZ2lzdGVyRm9ybUNvbXBvbmVudChjb21wOiBJQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwICYmIHRoaXMuX2NvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbXBvbmVudHNbYXR0cl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlckZvcm1Db250cm9sQ29tcG9uZW50KGNvbXA6IElGb3JtRGF0YUNvbXBvbmVudCkge1xuICAgIGlmIChjb21wICYmIGNvbXAuaXNBdXRvbWF0aWNSZWdpc3RlcmluZygpKSB7XG4gICAgICBjb25zdCBjb250cm9sOiBGb3JtQ29udHJvbCA9IGNvbXAuZ2V0Q29udHJvbCgpO1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAoY29udHJvbCAmJiBhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKGF0dHIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXJTUUxUeXBlRm9ybUNvbXBvbmVudChjb21wOiBJRm9ybURhdGFUeXBlQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb21wU1FMVHlwZXNbYXR0cl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJUb29sYmFyKGZUb29sYmFyOiBPRm9ybVRvb2xiYXJDb21wb25lbnQpIHtcbiAgICBpZiAoZlRvb2xiYXIpIHtcbiAgICAgIHRoaXMuX2Zvcm1Ub29sYmFyID0gZlRvb2xiYXI7XG4gICAgICB0aGlzLl9mb3JtVG9vbGJhci5pc0RldGFpbCA9IHRoaXMuaXNEZXRhaWxGb3JtO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbXBvbmVudHMoKTogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XG4gIH1cblxuICBwdWJsaWMgbG9hZCgpOiBhbnkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHpvbmUgPSB0aGlzLmluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIGNvbnN0IGxvYWRPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XG4gICAgICB9LCAyNTApO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHNlbGYubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH0pO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGxvYWRPYnNlcnZhYmxlLnN1YnNjcmliZSh2YWwgPT4ge1xuICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBzZWxmLmxvYWRpbmdTdWJqZWN0Lm5leHQodmFsIGFzIGJvb2xlYW4pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIGdldERhdGFWYWx1ZShhdHRyOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pc0luSW5zZXJ0TW9kZSgpKSB7XG4gICAgICBjb25zdCB1cmxQYXJhbXMgPSB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldEZpbHRlckZyb21VcmxQYXJhbXMoKTtcbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZm9ybUdyb3VwLnZhbHVlW2F0dHJdIHx8IHVybFBhcmFtc1thdHRyXTtcbiAgICAgIHJldHVybiBuZXcgT0Zvcm1WYWx1ZSh2YWwpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0luSW5pdGlhbE1vZGUoKSAmJiAhdGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuICAgICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICByZXR1cm4gZGF0YVthdHRyXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNJblVwZGF0ZU1vZGUoKSB8fCB0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSkge1xuICAgICAgaWYgKHRoaXMuZm9ybURhdGEgJiYgT2JqZWN0LmtleXModGhpcy5mb3JtRGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmZvcm1DYWNoZS5nZXRDYWNoZWRWYWx1ZShhdHRyKTtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUdyb3VwLmRpcnR5ICYmIHZhbCkge1xuICAgICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IE9Gb3JtVmFsdWUodmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXR1cm4gb3JpZ2luYWwgdmFsdWUgc3RvcmVkIGludG8gZm9ybSBkYXRhLi4uXG4gICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZm9ybURhdGE7XG4gICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFbYXR0cl07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgT0Zvcm1WYWx1ZSgpO1xuICB9XG5cbiAgZ2V0RGF0YVZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGZvcm0gZGF0YS4gVGhlIGRhdGEgcmVsYXRlZCB0byB1cmwgcGFyYW1zIGFuZCBwYXJlbnQga2V5cyByZW1haW4gdW5jaGFuZ2VkLlxuICAgKi9cbiAgY2xlYXJEYXRhKCkge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZm9ybU5hdmlnYXRpb24uZ2V0RmlsdGVyRnJvbVVybFBhcmFtcygpO1xuICAgIHRoaXMuZm9ybUdyb3VwLnJlc2V0KHt9LCB7XG4gICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5zZXREYXRhKGZpbHRlcik7XG4gIH1cblxuICBjYW5EZWFjdGl2YXRlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4gfCBQcm9taXNlPGJvb2xlYW4+IHwgYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmNvbmZpcm1FeGl0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgY2FuRGlzY2FyZENoYW5nZXMgPSB0aGlzLmNhbkRpc2NhcmRDaGFuZ2VzO1xuICAgIHRoaXMuY2FuRGlzY2FyZENoYW5nZXMgPSBmYWxzZTtcbiAgICByZXR1cm4gY2FuRGlzY2FyZENoYW5nZXMgfHwgdGhpcy5zaG93Q29uZmlybURpc2NhcmRDaGFuZ2VzKCk7XG4gIH1cblxuICBzaG93Q29uZmlybURpc2NhcmRDaGFuZ2VzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1OYXZpZ2F0aW9uLnNob3dDb25maXJtRGlzY2FyZENoYW5nZXMoKTtcbiAgfVxuXG4gIGV4ZWN1dGVUb29sYmFyQWN0aW9uKGFjdGlvbjogc3RyaW5nLCBvcHRpb25zPzogYW55KSB7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgQ29kZXMuQkFDS19BQ1RJT046IHRoaXMuYmFjaygpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuQ0xPU0VfREVUQUlMX0FDVElPTjogdGhpcy5jbG9zZURldGFpbChvcHRpb25zKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLlJFTE9BRF9BQ1RJT046IHRoaXMucmVsb2FkKHRydWUpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuR09fSU5TRVJUX0FDVElPTjogdGhpcy5nb0luc2VydE1vZGUob3B0aW9ucyk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5JTlNFUlRfQUNUSU9OOiB0aGlzLmluc2VydCgpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuR09fRURJVF9BQ1RJT046IHRoaXMuZ29FZGl0TW9kZShvcHRpb25zKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLkVESVRfQUNUSU9OOiB0aGlzLnVwZGF0ZSgpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuVU5ET19MQVNUX0NIQU5HRV9BQ1RJT046IHRoaXMudW5kbygpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuREVMRVRFX0FDVElPTjogcmV0dXJuIHRoaXMuZGVsZXRlKCk7XG4gICAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYWRkRGVhY3RpdmF0ZUd1YXJkKCk7XG5cbiAgICB0aGlzLmZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuXG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGFkZERlYWN0aXZhdGVHdWFyZCgpIHtcbiAgICBpZiAodGhpcy5pc0luSW5pdGlhbE1vZGUoKSAmJiAhdGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmFjdFJvdXRlIHx8ICF0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVhY3RpdmF0ZUd1YXJkID0gdGhpcy5pbmplY3Rvci5nZXQoQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCk7XG4gICAgdGhpcy5kZWFjdGl2YXRlR3VhcmQuc2V0Rm9ybSh0aGlzKTtcbiAgICBjb25zdCBjYW5EZWFjdGl2YXRlQXJyYXkgPSAodGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlIHx8IFtdKTtcbiAgICBsZXQgcHJldmlvdXNseUFkZGVkID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbkRlYWN0aXZhdGVBcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcHJldmlvdXNseUFkZGVkID0gKChjYW5EZWFjdGl2YXRlQXJyYXlbaV0uaGFzT3duUHJvcGVydHkoJ0NMQVNTTkFNRScpICYmIGNhbkRlYWN0aXZhdGVBcnJheVtpXS5DTEFTU05BTUUpID09PSBPRm9ybUNvbXBvbmVudC5ndWFyZENsYXNzTmFtZSk7XG4gICAgICBpZiAocHJldmlvdXNseUFkZGVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzbHlBZGRlZCkge1xuICAgICAgY2FuRGVhY3RpdmF0ZUFycmF5LnB1c2godGhpcy5kZWFjdGl2YXRlR3VhcmQuY29uc3RydWN0b3IpO1xuICAgICAgdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlID0gY2FuRGVhY3RpdmF0ZUFycmF5O1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lEZWFjdGl2YXRlR3VhcmQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5kZWFjdGl2YXRlR3VhcmQgfHwgIXRoaXMuYWN0Um91dGUgfHwgIXRoaXMuYWN0Um91dGUucm91dGVDb25maWcgfHwgIXRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmRlYWN0aXZhdGVHdWFyZC5zZXRGb3JtKHVuZGVmaW5lZCk7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGVbaV0ubmFtZSA9PT0gT0Zvcm1Db21wb25lbnQuZ3VhcmRDbGFzc05hbWUpIHtcbiAgICAgICAgICB0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vXG4gICAgfVxuICB9XG5cbiAgaGFzRGVhY3RpdmF0ZUd1YXJkKCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRlYWN0aXZhdGVHdWFyZCk7XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBtZXRob2RzXG4gICAqL1xuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuaGVhZGVyYWN0aW9ucyA9PT0gJ2FsbCcpIHtcbiAgICAgIHRoaXMuaGVhZGVyYWN0aW9ucyA9ICdSO0k7VTtEJztcbiAgICB9XG4gICAgdGhpcy5rZXlzQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5rZXlzLCB0cnVlKTtcbiAgICB0aGlzLmNvbHNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGNvbnN0IHBrQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5wYXJlbnRLZXlzKTtcbiAgICB0aGlzLl9wS2V5c0VxdWl2ID0gVXRpbC5wYXJzZVBhcmVudEtleXNFcXVpdmFsZW5jZXMocGtBcnJheSk7XG4gICAgdGhpcy5rZXlzU3FsVHlwZXNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmtleXNTcWxUeXBlcyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNlcnZpY2UoKTtcblxuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3Vic2NyaWJlVG9RdWVyeVBhcmFtcygpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3Vic2NyaWJlVG9VcmxQYXJhbXMoKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN1YnNjcmliZVRvVXJsKCk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zdWJzY3JpYmVUb0NhY2hlQ2hhbmdlcyh0aGlzLmZvcm1DYWNoZS5vbkNhY2hlRW1wdHlTdGF0ZUNoYW5nZXMpO1xuXG4gICAgaWYgKHRoaXMubmF2aWdhdGlvblNlcnZpY2UpIHtcbiAgICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2Uub25WaXNpYmxlQ2hhbmdlKHZpc2libGUgPT4ge1xuICAgICAgICBzZWxmLnNob3dIZWFkZXIgPSB2aXNpYmxlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlID0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUw7XG5cbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UuZ2V0Rm9ybVBlcm1pc3Npb25zKHRoaXMub2F0dHIsIHRoaXMuYWN0Um91dGUpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmluc2VydEZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLnVwZGF0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmRlbGV0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICB9XG5cbiAgcmVpbml0aWFsaXplKG9wdGlvbnM6IE9Gb3JtSW5pdGlhbGl6YXRpb25PcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgJiYgT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjbG9uZWRPcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG4gICAgICBmb3IgKGNvbnN0IHByb3AgaW4gY2xvbmVkT3B0cykge1xuICAgICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHRoaXNbcHJvcF0gPSBjbG9uZWRPcHRzW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbmZpZ3VyZVNlcnZpY2UoKSB7XG4gICAgbGV0IGxvYWRpbmdTZXJ2aWNlOiBhbnkgPSBPbnRpbWl6ZVNlcnZpY2U7XG4gICAgaWYgKHRoaXMuc2VydmljZVR5cGUpIHtcbiAgICAgIGxvYWRpbmdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlVHlwZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChsb2FkaW5nU2VydmljZSk7XG4gICAgICBpZiAoVXRpbC5pc0RhdGFTZXJ2aWNlKHRoaXMuZGF0YVNlcnZpY2UpKSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2VDZmcgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldERlZmF1bHRTZXJ2aWNlQ29uZmlndXJhdGlvbih0aGlzLnNlcnZpY2UpO1xuICAgICAgICBpZiAodGhpcy5lbnRpdHkpIHtcbiAgICAgICAgICBzZXJ2aWNlQ2ZnLmVudGl0eSA9IHRoaXMuZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVNlcnZpY2UuY29uZmlndXJlU2VydmljZShzZXJ2aWNlQ2ZnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5yZWxvYWRTdHJlYW1TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVsb2FkU3RyZWFtU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5mb3JtQ2FjaGUuZGVzdHJveSgpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uZGVzdHJveSgpO1xuICAgIHRoaXMuZGVzdHJveURlYWN0aXZhdGVHdWFyZCgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5kZXRlcm1pbmF0ZUZvcm1Nb2RlKCk7XG4gICAgICB0aGlzLm9uRm9ybUluaXRTdHJlYW0uZW1pdCh0cnVlKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIC8qXG4gICAqIElubmVyIG1ldGhvZHNcbiAgICovXG5cbiAgX3NldENvbXBvbmVudHNFZGl0YWJsZShzdGF0ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IGFueSA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZvckVhY2goY29tcEtleSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBLZXldO1xuICAgICAgY29tcG9uZW50LmlzUmVhZE9ubHkgPSAhc3RhdGU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtIG9wZXJhdGlvbiBtb2RlLlxuICAgKiBAcGFyYW0gbW9kZSBUaGUgbW9kZSB0byBiZSBlc3RhYmxpc2hlZFxuICAgKi9cbiAgc2V0Rm9ybU1vZGUobW9kZTogbnVtYmVyKSB7XG4gICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMOlxuICAgICAgICB0aGlzLmJlZm9yZUluaXRpYWxNb2RlLmVtaXQoKTtcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1Ub29sYmFyKSB7XG4gICAgICAgICAgdGhpcy5fZm9ybVRvb2xiYXIuc2V0SW5pdGlhbE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpO1xuICAgICAgICB0aGlzLm9uRm9ybU1vZGVDaGFuZ2UuZW1pdCh0aGlzLm1vZGUpO1xuICAgICAgICB0aGlzLm9uSW5pdGlhbE1vZGUuZW1pdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOU0VSVDpcbiAgICAgICAgdGhpcy5iZWZvcmVJbnNlcnRNb2RlLmVtaXQoKTtcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1Ub29sYmFyKSB7XG4gICAgICAgICAgdGhpcy5fZm9ybVRvb2xiYXIuc2V0SW5zZXJ0TW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhKCk7XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkZvcm1Nb2RlQ2hhbmdlLmVtaXQodGhpcy5tb2RlKTtcbiAgICAgICAgdGhpcy5vbkluc2VydE1vZGUuZW1pdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURTpcbiAgICAgICAgdGhpcy5iZWZvcmVVcGRhdGVNb2RlLmVtaXQoKTtcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1Ub29sYmFyKSB7XG4gICAgICAgICAgdGhpcy5fZm9ybVRvb2xiYXIuc2V0RWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodHJ1ZSk7XG4gICAgICAgIHRoaXMub25Gb3JtTW9kZUNoYW5nZS5lbWl0KHRoaXMubW9kZSk7XG4gICAgICAgIHRoaXMub25VcGRhdGVNb2RlLmVtaXQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5RVUVSWTpcbiAgICAgICAgY29uc29sZS5lcnJvcignRm9ybSBRVUVSWSBtb2RlIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNldERhdGEoZGF0YSk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdbT0Zvcm1Db21wb25lbnRdIEZvcm0gZGF0YSBoYXMgbW9yZSB0aGFuIGEgc2luZ2xlIHJlY29yZC4gU3RvcmluZyBlbXB0eSBkYXRhJyk7XG4gICAgICB9XG4gICAgICBjb25zdCBjdXJyZW50RGF0YSA9IGRhdGEubGVuZ3RoID09PSAxID8gZGF0YVswXSA6IHt9O1xuICAgICAgdGhpcy5fdXBkYXRlRm9ybURhdGEodGhpcy50b0Zvcm1WYWx1ZURhdGEoY3VycmVudERhdGEpKTtcbiAgICAgIHRoaXMuX2VtaXREYXRhKGN1cnJlbnREYXRhKTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHRoaXMudG9Gb3JtVmFsdWVEYXRhKGRhdGEpKTtcbiAgICAgIHRoaXMuX2VtaXREYXRhKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0Zvcm0gaGFzIHJlY2VpdmVkIG5vdCBzdXBwb3J0ZWQgc2VydmljZSBkYXRhLiBTdXBwb3J0ZWQgZGF0YSBhcmUgQXJyYXkgb3IgT2JqZWN0Jyk7XG4gICAgICB0aGlzLl91cGRhdGVGb3JtRGF0YSh7fSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgc2V0RGF0YShkYXRhKWAgaW5zdGVhZFxuICAgKi9cbiAgX3NldERhdGEoZGF0YSkge1xuICAgIGNvbnNvbGUud2FybignTWV0aG9kIGBPRm9ybUNvbXBvbmVudC5fc2V0RGF0YWAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXJ1dGUuIFVzZSBgc2V0RGF0YWAgaW5zdGVhZCcpO1xuICAgIHRoaXMuc2V0RGF0YShkYXRhKTtcbiAgfVxuXG4gIF9lbWl0RGF0YShkYXRhKSB7XG4gICAgdGhpcy5vbkRhdGFMb2FkZWQuZW1pdChkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGJhY2soKWAgaW5zdGVhZFxuICAgKi9cbiAgX2JhY2tBY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdNZXRob2QgYE9Gb3JtQ29tcG9uZW50Ll9iYWNrQWN0aW9uYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGBiYWNrYCBpbnN0ZWFkJyk7XG4gICAgdGhpcy5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGUgYmFja1xuICAgKi9cbiAgYmFjaygpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLm5hdmlnYXRlQmFjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgY2xvc2VEZXRhaWwob3B0aW9ucz86IGFueSlgIGluc3RlYWRcbiAgICovXG4gIF9jbG9zZURldGFpbEFjdGlvbihvcHRpb25zPzogYW55KSB7XG4gICAgY29uc29sZS53YXJuKCdNZXRob2QgYE9Gb3JtQ29tcG9uZW50Ll9jbG9zZURldGFpbEFjdGlvbmAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXJ1dGUuIFVzZSBgY2xvc2VEZXRhaWxgIGluc3RlYWQnKTtcbiAgICB0aGlzLmNsb3NlRGV0YWlsKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlIGN1cnJlbnQgZGV0YWlsIGZvcm1cbiAgICovXG4gIGNsb3NlRGV0YWlsKG9wdGlvbnM/OiBhbnkpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmNsb3NlRGV0YWlsQWN0aW9uKG9wdGlvbnMpO1xuICB9XG5cbiAgX3N0YXlJblJlY29yZEFmdGVySW5zZXJ0KGluc2VydGVkS2V5czogb2JqZWN0KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zdGF5SW5SZWNvcmRBZnRlckluc2VydChpbnNlcnRlZEtleXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgcmVsb2FkKHVzZUZpbHRlcjogYm9vbGVhbiA9IGZhbHNlKWAgaW5zdGVhZFxuICAgKi9cbiAgX3JlbG9hZEFjdGlvbih1c2VGaWx0ZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnNvbGUud2FybignTWV0aG9kIGBPRm9ybUNvbXBvbmVudC5fcmVsb2FkQWN0aW9uYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGByZWxvYWRgIGluc3RlYWQnKTtcbiAgICB0aGlzLnJlbG9hZCh1c2VGaWx0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbG9hZCB0aGUgZm9ybSBkYXRhXG4gICAqL1xuICByZWxvYWQodXNlRmlsdGVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBsZXQgZmlsdGVyID0ge307XG4gICAgaWYgKHVzZUZpbHRlcikge1xuICAgICAgZmlsdGVyID0gdGhpcy5nZXRDdXJyZW50S2V5c1ZhbHVlcygpO1xuICAgIH1cbiAgICB0aGlzLnF1ZXJ5RGF0YShmaWx0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byAnaW5zZXJ0JyBtb2RlXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZ29JbnNlcnRNb2RlKG9wdGlvbnM/OiBhbnkpYCBpbnN0ZWFkXG4gICAqL1xuICBfZ29JbnNlcnRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2dvSW5zZXJ0TW9kZWAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXJ1dGUuIFVzZSBgZ29JbnNlcnRNb2RlYCBpbnN0ZWFkJyk7XG4gICAgdGhpcy5nb0luc2VydE1vZGUob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvICdpbnNlcnQnIG1vZGVcbiAgICovXG4gIGdvSW5zZXJ0TW9kZShvcHRpb25zPzogYW55KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5nb0luc2VydE1vZGUob3B0aW9ucyk7XG4gIH1cblxuICBfY2xlYXJGb3JtQWZ0ZXJJbnNlcnQoKSB7XG4gICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgaW5zZXJ0IGFjdGlvbi5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBpbnNlcnQoKWAgaW5zdGVhZFxuICAgKi9cbiAgX2luc2VydEFjdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2luc2VydEFjdGlvbmAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXJ1dGUuIFVzZSBgaW5zZXJ0YCBpbnN0ZWFkJyk7XG4gICAgdGhpcy5pbnNlcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBpbnNlcnQgYWN0aW9uLlxuICAgKi9cbiAgaW5zZXJ0KCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKS5mb3JFYWNoKChjb250cm9sKSA9PiB7XG4gICAgICB0aGlzLmZvcm1Hcm91cC5jb250cm9sc1tjb250cm9sXS5tYXJrQXNUb3VjaGVkKCk7XG4gICAgfSk7XG5cbiAgICBpZiAoIXRoaXMuZm9ybUdyb3VwLnZhbGlkKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkZPUk1fVkFMSURBVElPTl9FUlJPUicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlc1RvSW5zZXJ0KCk7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNTUUxUeXBlcygpO1xuICAgIHRoaXMuaW5zZXJ0RGF0YSh2YWx1ZXMsIHNxbFR5cGVzKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICBzZWxmLnBvc3RDb3JyZWN0SW5zZXJ0KHJlc3ApO1xuICAgICAgc2VsZi5mb3JtQ2FjaGUuc2V0Q2FjaGVTbmFwc2hvdCgpO1xuICAgICAgc2VsZi5tYXJrRm9ybUxheW91dE1hbmFnZXJUb1VwZGF0ZSgpO1xuICAgICAgaWYgKHNlbGYuYWZ0ZXJJbnNlcnRNb2RlID09PSAnZGV0YWlsJykge1xuICAgICAgICBzZWxmLl9zdGF5SW5SZWNvcmRBZnRlckluc2VydChyZXNwKTtcbiAgICAgIH0gZWxzZSBpZiAoc2VsZi5hZnRlckluc2VydE1vZGUgPT09ICduZXcnKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyRm9ybUFmdGVySW5zZXJ0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmNsb3NlRGV0YWlsKCk7XG4gICAgICB9XG4gICAgfSwgZXJyb3IgPT4ge1xuICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0SW5zZXJ0KGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gJ2VkaXQnIG1vZGVcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnb0VkaXRNb2RlKG9wdGlvbnM/OiBhbnkpYCBpbnN0ZWFkXG4gICAqL1xuICBfZ29FZGl0TW9kZShvcHRpb25zPzogYW55KSB7XG4gICAgY29uc29sZS53YXJuKCdNZXRob2QgYE9Gb3JtQ29tcG9uZW50Ll9nb0VkaXRNb2RlYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGBnb0VkaXRNb2RlYCBpbnN0ZWFkJyk7XG4gICAgdGhpcy5nb0VkaXRNb2RlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byAnZWRpdCcgbW9kZVxuICAgKi9cbiAgZ29FZGl0TW9kZShvcHRpb25zPzogYW55KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5nb0VkaXRNb2RlKCk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgJ2VkaXQnIGFjdGlvblxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHVwZGF0ZSgpYCBpbnN0ZWFkXG4gICAqL1xuICBfZWRpdEFjdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2VkaXRBY3Rpb25gIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnVydXRlLiBVc2UgYHVwZGF0ZWAgaW5zdGVhZCcpO1xuICAgIHRoaXMudXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgJ2VkaXQnIGFjdGlvblxuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKS5mb3JFYWNoKFxuICAgICAgKGNvbnRyb2wpID0+IHtcbiAgICAgICAgdGhpcy5mb3JtR3JvdXAuY29udHJvbHNbY29udHJvbF0ubWFya0FzVG91Y2hlZCgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoIXRoaXMuZm9ybUdyb3VwLnZhbGlkKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkZPUk1fVkFMSURBVElPTl9FUlJPUicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJldHJpZXZpbmcga2V5cy4uLlxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZ2V0S2V5c1ZhbHVlcygpO1xuXG4gICAgLy8gcmV0cmlldmluZyB2YWx1ZXMgdG8gdXBkYXRlLi4uXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9VcGRhdGUoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk7XG5cbiAgICBpZiAoT2JqZWN0LmtleXModmFsdWVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIE5vdGhpbmcgdG8gdXBkYXRlXG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0lORk8nLCAnTUVTU0FHRVMuRk9STV9OT1RISU5HX1RPX1VQREFURV9JTkZPJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaW52b2tlIHVwZGF0ZSBtZXRob2QuLi5cbiAgICB0aGlzLnVwZGF0ZURhdGEoZmlsdGVyLCB2YWx1ZXMsIHNxbFR5cGVzKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICBzZWxmLnBvc3RDb3JyZWN0VXBkYXRlKHJlc3ApO1xuICAgICAgc2VsZi5mb3JtQ2FjaGUuc2V0Q2FjaGVTbmFwc2hvdCgpO1xuICAgICAgc2VsZi5tYXJrRm9ybUxheW91dE1hbmFnZXJUb1VwZGF0ZSgpO1xuICAgICAgaWYgKHNlbGYuc3RheUluUmVjb3JkQWZ0ZXJFZGl0KSB7XG4gICAgICAgIHNlbGYucmVsb2FkKHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5jbG9zZURldGFpbCgpO1xuICAgICAgfVxuICAgIH0sIGVycm9yID0+IHtcbiAgICAgIHNlbGYucG9zdEluY29ycmVjdFVwZGF0ZShlcnJvcik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgJ2RlbGV0ZScgYWN0aW9uXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgZGVsZXRlKClgIGluc3RlYWRcbiAgICovXG4gIF9kZWxldGVBY3Rpb24oKSB7XG4gICAgY29uc29sZS53YXJuKCdNZXRob2QgYE9Gb3JtQ29tcG9uZW50Ll9kZWxldGVBY3Rpb25gIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnVydXRlLiBVc2UgYGRlbGV0ZWAgaW5zdGVhZCcpO1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zICdkZWxldGUnIGFjdGlvblxuICAgKi9cbiAgZGVsZXRlKCkge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZ2V0S2V5c1ZhbHVlcygpO1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZURhdGEoZmlsdGVyKTtcbiAgfVxuXG4gIC8qXG4gIFV0aWxpdHkgbWV0aG9kc1xuICAqL1xuXG4gIHF1ZXJ5RGF0YShmaWx0ZXIpIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuZGF0YVNlcnZpY2UpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ09Gb3JtQ29tcG9uZW50OiBubyBzZXJ2aWNlIGNvbmZpZ3VyZWQhIGFib3J0aW5nIHF1ZXJ5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoZmlsdGVyKSB8fCBPYmplY3Qua2V5cyhmaWx0ZXIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdPRm9ybUNvbXBvbmVudDogbm8gZmlsdGVyIGNvbmZpZ3VyZWQhIGFib3J0aW5nIHF1ZXJ5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZm9ybUNhY2hlLnJlc3RhcnRDYWNoZSgpO1xuICAgIHRoaXMuY2xlYXJDb21wb25lbnRzT2xkVmFsdWUoKTtcbiAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgY29uc3QgYXYgPSB0aGlzLmdldEF0dHJpYnV0ZXNUb1F1ZXJ5KCk7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNTUUxUeXBlcygpO1xuICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24gPSB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMucXVlcnlNZXRob2RdKGZpbHRlciwgYXYsIHRoaXMuZW50aXR5LCBzcWxUeXBlcylcbiAgICAgIC5zdWJzY3JpYmUoKHJlc3A6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YShyZXNwLmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHt9KTtcbiAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX1FVRVJZJyk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6ICcgKyByZXNwLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9LCBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHt9KTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uKSkge1xuICAgICAgICAgIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uKGVycik7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIGVyci5zdGF0dXNUZXh0KSB7XG4gICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVyci5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX1FVRVJZJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1RvUXVlcnkoKTogQXJyYXk8YW55PiB7XG4gICAgbGV0IGF0dHJpYnV0ZXM6IEFycmF5PGFueT4gPSBbXTtcbiAgICAvLyBhZGQgZm9ybSBrZXlzLi4uXG4gICAgaWYgKHRoaXMua2V5c0FycmF5ICYmIHRoaXMua2V5c0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaCguLi50aGlzLmtleXNBcnJheSk7XG4gICAgfVxuICAgIGNvbnN0IGNvbXBvbmVudHM6IGFueSA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIC8vIGFkZCBvbmx5IHRoZSBmaWVsZHMgY29udGFpbmVkIGludG8gdGhlIGZvcm0uLi5cbiAgICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZXMuaW5kZXhPZihpdGVtKSA8IDAgJiZcbiAgICAgICAgY29tcG9uZW50c1tpdGVtXS5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkgJiYgY29tcG9uZW50c1tpdGVtXS5pc0F1dG9tYXRpY0JpbmRpbmcoKSkge1xuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgZmllbGRzIHN0b3JlZCBpbnRvIGZvcm0gY2FjaGUuLi5cbiAgICBjb25zdCBkYXRhQ2FjaGUgPSB0aGlzLmZvcm1DYWNoZS5nZXREYXRhQ2FjaGUoKTtcbiAgICBpZiAoZGF0YUNhY2hlKSB7XG4gICAgICBPYmplY3Qua2V5cyhkYXRhQ2FjaGUpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmIChpdGVtICE9PSB1bmRlZmluZWQgJiYgYXR0cmlidXRlcy5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLmNvbmNhdCh0aGlzLmNvbHNBcnJheS5maWx0ZXIoY29sID0+IGF0dHJpYnV0ZXMuaW5kZXhPZihjb2wpIDwgMCkpO1xuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgaW5zZXJ0RGF0YSh2YWx1ZXMsIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5pbnNlcnRNZXRob2RdKHZhbHVlcywgdGhpcy5lbnRpdHksIHNxbFR5cGVzKS5zdWJzY3JpYmUoXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3AuZGF0YSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihyZXNwLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9JbnNlcnQoKTogb2JqZWN0IHtcbiAgICBjb25zdCBhdHRyVmFsdWVzID0ge307XG4gICAgaWYgKHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXMpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24oYXR0clZhbHVlcywgdGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlcyk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGF0dHJWYWx1ZXMsIHRoaXMuZ2V0UmVnaXN0ZXJlZEZpZWxkc1ZhbHVlcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBzcWwgdHlwZXMgZnJvbSB0aGUgZm9ybSBjb21wb25lbnRzIGFuZCB0aGUgZm9ybSBrZXlzXG4gICAqL1xuICBwdWJsaWMgZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk6IG9iamVjdCB7XG4gICAgY29uc3QgdHlwZXM6IG9iamVjdCA9IHt9O1xuICAgIC8vIEFkZCBmb3JtIGtleXMgc3FsIHR5cGVzXG4gICAgdGhpcy5rZXlzU3FsVHlwZXNBcnJheS5mb3JFYWNoKChrc3QsIGkpID0+IHR5cGVzW3RoaXMua2V5c0FycmF5W2ldXSA9IFNRTFR5cGVzLmdldFNRTFR5cGVWYWx1ZShrc3QpKTtcbiAgICAvLyBBZGQgZm9ybSBjb21wb25lbnRzIHNxbCB0eXBlc1xuICAgIGlmICh0aGlzLl9jb21wU1FMVHlwZXMgJiYgT2JqZWN0LmtleXModGhpcy5fY29tcFNRTFR5cGVzKS5sZW5ndGggPiAwKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHR5cGVzLCB0aGlzLl9jb21wU1FMVHlwZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZXM7XG4gIH1cblxuICB1cGRhdGVEYXRhKGZpbHRlciwgdmFsdWVzLCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbiA9IHRoaXMubG9hZCgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMudXBkYXRlTWV0aG9kXShmaWx0ZXIsIHZhbHVlcywgdGhpcy5lbnRpdHksIHNxbFR5cGVzKS5zdWJzY3JpYmUoXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3AuZGF0YSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihyZXNwLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9VcGRhdGUoKTogb2JqZWN0IHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjaGFuZ2VkQXR0cnMgPSB0aGlzLmZvcm1DYWNoZS5nZXRDaGFuZ2VkRm9ybUNvbnRyb2xzQXR0cigpO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKS5maWx0ZXIoY29udHJvbE5hbWUgPT5cbiAgICAgIHNlbGYuaWdub3JlRm9ybUNhY2hlS2V5cy5pbmRleE9mKGNvbnRyb2xOYW1lKSA9PT0gLTEgJiZcbiAgICAgIGNoYW5nZWRBdHRycy5pbmRleE9mKGNvbnRyb2xOYW1lKSAhPT0gLTFcbiAgICApLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSBzZWxmLmZvcm1Hcm91cC5jb250cm9sc1tpdGVtXTtcbiAgICAgIGlmIChjb250cm9sIGluc3RhbmNlb2YgT0Zvcm1Db250cm9sKSB7XG4gICAgICAgIHZhbHVlc1tpdGVtXSA9IGNvbnRyb2wuZ2V0VmFsdWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlc1tpdGVtXSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWVzW2l0ZW1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWVzW2l0ZW1dID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgZGVsZXRlRGF0YShmaWx0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgdGhpcy5jYW5EaXNjYXJkQ2hhbmdlcyA9IHRydWU7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMuZGVsZXRlTWV0aG9kXShmaWx0ZXIsIHRoaXMuZW50aXR5KS5zdWJzY3JpYmUoXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBzZWxmLmZvcm1DYWNoZS5zZXRDYWNoZVNuYXBzaG90KCk7XG4gICAgICAgICAgICBzZWxmLm1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk7XG4gICAgICAgICAgICBzZWxmLnBvc3RDb3JyZWN0RGVsZXRlKHJlc3ApO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwLmRhdGEpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0RGVsZXRlKHJlc3ApO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IocmVzcC5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICBzZWxmLnBvc3RJbmNvcnJlY3REZWxldGUoZXJyKTtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgdG9KU09ORGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlRGF0YSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHZhbHVlRGF0YVtpdGVtXSA9IGRhdGFbaXRlbV0udmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlRGF0YTtcbiAgfVxuXG4gIHRvRm9ybVZhbHVlRGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBjb25zdCB2YWx1ZURhdGE6IEFycmF5PG9iamVjdD4gPSBbXTtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgZGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICB2YWx1ZURhdGEucHVzaChzZWxmLm9iamVjdFRvRm9ybVZhbHVlRGF0YShpdGVtKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWx1ZURhdGE7XG4gICAgfSBlbHNlIGlmIChkYXRhICYmIFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdFRvRm9ybVZhbHVlRGF0YShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEtleXNWYWx1ZXMoKSB7XG4gICAgY29uc3QgZmlsdGVyID0ge307XG4gICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuZm9ybURhdGE7XG4gICAgaWYgKCF0aGlzLmtleXNBcnJheSkge1xuICAgICAgcmV0dXJuIGZpbHRlcjtcbiAgICB9XG4gICAgdGhpcy5rZXlzQXJyYXkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRSZWNvcmRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBjdXJyZW50RGF0YSA9IGN1cnJlbnRSZWNvcmRba2V5XTtcbiAgICAgICAgaWYgKGN1cnJlbnREYXRhIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgICAgIGN1cnJlbnREYXRhID0gY3VycmVudERhdGEudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZmlsdGVyW2tleV0gPSBjdXJyZW50RGF0YTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgaXNJblF1ZXJ5TW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuUVVFUlk7XG4gIH1cblxuICBpc0luSW5zZXJ0TW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5TRVJUO1xuICB9XG5cbiAgaXNJblVwZGF0ZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURTtcbiAgfVxuXG4gIGlzSW5Jbml0aWFsTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDtcbiAgfVxuXG4gIHNldFF1ZXJ5TW9kZSgpIHtcbiAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5RVUVSWSk7XG4gIH1cblxuICBzZXRJbnNlcnRNb2RlKCkge1xuICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOU0VSVCk7XG4gIH1cblxuICBzZXRVcGRhdGVNb2RlKCkge1xuICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURSk7XG4gIH1cblxuICBzZXRJbml0aWFsTW9kZSgpIHtcbiAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMKTtcbiAgfVxuXG4gIHJlZ2lzdGVyRHluYW1pY0Zvcm1Db21wb25lbnQoZHluYW1pY0Zvcm0pIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKGR5bmFtaWNGb3JtKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmR5bmFtaWNGb3JtU3Vic2NyaXB0aW9uID0gZHluYW1pY0Zvcm0ucmVuZGVyLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICBzZWxmLnJlZnJlc2hDb21wb25lbnRzRWRpdGFibGVTdGF0ZSgpO1xuICAgICAgICBpZiAoIXNlbGYuaXNJbkluc2VydE1vZGUoKSAmJiBzZWxmLnF1ZXJ5T25Jbml0KSB7XG4gICAgICAgICAgc2VsZi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuZm9ybVBhcmVudEtleXNWYWx1ZXMpIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhzZWxmLmZvcm1QYXJlbnRLZXlzVmFsdWVzKS5mb3JFYWNoKHBhcmVudEtleSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNlbGYuZm9ybVBhcmVudEtleXNWYWx1ZXNbcGFyZW50S2V5XTtcbiAgICAgICAgICAgIGNvbnN0IGNvbXAgPSBzZWxmLmdldEZpZWxkUmVmZXJlbmNlKHBhcmVudEtleSk7XG4gICAgICAgICAgICBpZiAoVXRpbC5pc0Zvcm1EYXRhQ29tcG9uZW50KGNvbXApICYmIGNvbXAuaXNBdXRvbWF0aWNCaW5kaW5nKCkpIHtcbiAgICAgICAgICAgICAgY29tcC5zZXRWYWx1ZSh2YWx1ZSwge1xuICAgICAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZW1pdEV2ZW50OiBmYWxzZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdW5yZWdpc3RlckR5bmFtaWNGb3JtQ29tcG9uZW50KGR5bmFtaWNGb3JtKSB7XG4gICAgaWYgKGR5bmFtaWNGb3JtICYmIHRoaXMuZHluYW1pY0Zvcm1TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuZHluYW1pY0Zvcm1TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBnZXRSZXF1aXJlZENvbXBvbmVudHMoKTogb2JqZWN0IHtcbiAgICBjb25zdCByZXF1aXJlZENvbXBvbnRlbnRzOiBvYmplY3QgPSB7fTtcbiAgICBjb25zdCBjb21wb25lbnRzID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICAgIE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgY29uc3QgY29tcCA9IGNvbXBvbmVudHNba2V5XTtcbiAgICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICAgIGlmICgoY29tcCBhcyBhbnkpLmlzUmVxdWlyZWQgJiYgYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXF1aXJlZENvbXBvbnRlbnRzW2F0dHJdID0gY29tcDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXF1aXJlZENvbXBvbnRlbnRzO1xuICB9XG5cbiAgZ2V0IGxheW91dERpcmVjdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9sYXlvdXREaXJlY3Rpb247XG4gIH1cblxuICBzZXQgbGF5b3V0RGlyZWN0aW9uKHZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFyc2VkVmFsID0gKHZhbCB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICB0aGlzLl9sYXlvdXREaXJlY3Rpb24gPSBbJ3JvdycsICdjb2x1bW4nLCAncm93LXJldmVyc2UnLCAnY29sdW1uLXJldmVyc2UnXS5pbmRleE9mKHBhcnNlZFZhbCkgIT09IC0xID8gcGFyc2VkVmFsIDogT0Zvcm1Db21wb25lbnQuREVGQVVMVF9MQVlPVVRfRElSRUNUSU9OO1xuICB9XG5cbiAgZ2V0IGxheW91dEFsaWduKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dEFsaWduO1xuICB9XG5cbiAgc2V0IGxheW91dEFsaWduKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fbGF5b3V0QWxpZ24gPSB2YWw7XG4gIH1cblxuICBnZXQgc2hvd0Zsb2F0aW5nVG9vbGJhcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93SGVhZGVyICYmIHRoaXMuaGVhZGVyTW9kZSA9PT0gJ2Zsb2F0aW5nJztcbiAgfVxuXG4gIGdldCBzaG93Tm90RmxvYXRpbmdUb29sYmFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dIZWFkZXIgJiYgdGhpcy5oZWFkZXJNb2RlICE9PSAnZmxvYXRpbmcnO1xuICB9XG5cbiAgaXNFZGl0YWJsZURldGFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0YWJsZURldGFpbDtcbiAgfVxuXG4gIGlzSW5pdGlhbFN0YXRlQ2hhbmdlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtQ2FjaGUuaXNJbml0aWFsU3RhdGVDaGFuZ2VkKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGB1bmRvKClgIGluc3RlYWRcbiAgICovXG4gIF91bmRvTGFzdENoYW5nZUFjdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX3VuZG9MYXN0Q2hhbmdlQWN0aW9uYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGB1bmRvYCBpbnN0ZWFkJyk7XG4gICAgdGhpcy51bmRvKCk7XG4gIH1cblxuICAvKipcbiAgICogVW5kbyBsYXN0IGNoYW5nZVxuICAgKi9cbiAgdW5kbygpIHtcbiAgICB0aGlzLmZvcm1DYWNoZS51bmRvTGFzdENoYW5nZSgpO1xuICB9XG5cbiAgZ2V0IGlzQ2FjaGVTdGFja0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1DYWNoZS5pc0NhY2hlU3RhY2tFbXB0eTtcbiAgfVxuXG4gIHVuZG9LZXlib2FyZFByZXNzZWQoKSB7XG4gICAgdGhpcy5mb3JtQ2FjaGUudW5kb0xhc3RDaGFuZ2Uoe1xuICAgICAga2V5Ym9hcmRFdmVudDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Rm9ybVRvb2xiYXIoKTogT0Zvcm1Ub29sYmFyQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVRvb2xiYXI7XG4gIH1cblxuICBnZXRGb3JtTWFuYWdlcigpOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLmZvcm1OYXZpZ2F0aW9uLmZvcm1MYXlvdXRNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0Rm9ybU5hdmlnYXRpb24oKTogT0Zvcm1OYXZpZ2F0aW9uQ2xhc3Mge1xuICAgIHJldHVybiB0aGlzLmZvcm1OYXZpZ2F0aW9uO1xuICB9XG5cbiAgZ2V0Rm9ybUNhY2hlKCk6IE9Gb3JtQ2FjaGVDbGFzcyB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybUNhY2hlO1xuICB9XG5cbiAgZ2V0VXJsUGFyYW0oYXJnOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGb3JtTmF2aWdhdGlvbigpLmdldFVybFBhcmFtcygpW2FyZ107XG4gIH1cblxuICBnZXRVcmxQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Rm9ybU5hdmlnYXRpb24oKS5nZXRVcmxQYXJhbXMoKTtcbiAgfVxuXG4gIHNldFVybFBhcmFtc0FuZFJlbG9hZCh2YWw6IG9iamVjdCkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc2V0VXJsUGFyYW1zKHZhbCk7XG4gICAgdGhpcy5yZWxvYWQodHJ1ZSk7XG4gIH1cblxuICBnZXRSZWdpc3RlcmVkRmllbGRzVmFsdWVzKCkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHt9O1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IElGb3JtRGF0YUNvbXBvbmVudEhhc2ggPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjb21wb25lbnRzS2V5cyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZpbHRlcihrZXkgPT4gc2VsZi5pZ25vcmVGb3JtQ2FjaGVLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpO1xuICAgIGNvbXBvbmVudHNLZXlzLmZvckVhY2goY29tcEtleSA9PiB7XG4gICAgICBjb25zdCBjb21wOiBJRm9ybURhdGFDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBLZXldO1xuICAgICAgdmFsdWVzW2NvbXBLZXldID0gY29tcC5nZXRWYWx1ZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRyIHRoZSBhdHRyIG9mIHRoZSBmb3JtIGZpZWxkXG4gICAqL1xuICBnZXRGaWVsZFZhbHVlKGF0dHI6IHN0cmluZyk6IGFueSB7XG4gICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICBjb25zdCBjb21wID0gdGhpcy5nZXRGaWVsZFJlZmVyZW5jZShhdHRyKTtcbiAgICBpZiAoY29tcCkge1xuICAgICAgdmFsdWUgPSBjb21wLmdldFZhbHVlKCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIHZhbHVlcyBvZiBlYWNoIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIGF0dHIncyBvZiB0aGUgZm9ybSBmaWVsZHNcbiAgICovXG4gIGdldEZpZWxkVmFsdWVzKGF0dHJzOiBzdHJpbmdbXSk6IGFueSB7XG4gICAgY29uc3QgYXJyID0ge307XG4gICAgYXR0cnMuZm9yRWFjaChrZXkgPT4gYXJyW2tleV0gPSB0aGlzLmdldEZpZWxkVmFsdWUoa2V5KSk7XG4gICAgcmV0dXJuIGFycjtcblxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGluIHRoZSBmb3JtLlxuICAgKiBAcGFyYW0gYXR0ciBhdHRyaWJ1dGUgb2YgY29udHJvbFxuICAgKiBAcGFyYW0gdmFsdWUgdmFsdWVcbiAgICovXG4gIHNldEZpZWxkVmFsdWUoYXR0cjogc3RyaW5nLCB2YWx1ZTogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbXAgPSB0aGlzLmdldEZpZWxkUmVmZXJlbmNlKGF0dHIpO1xuICAgIGlmIChjb21wKSB7XG4gICAgICBjb21wLnNldFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgZWFjaCBjb250cm9sIGluIHRoZSBmb3JtLlxuICAgKiBAcGFyYW0gdmFsdWVzIHRoZSB2YWx1ZXNcbiAgICovXG4gIHNldEZpZWxkVmFsdWVzKHZhbHVlczogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHRoaXMuc2V0RmllbGRWYWx1ZShrZXksIHZhbHVlc1trZXldLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIHZhbHVlIG9mIGVhY2ggY29udHJvbCBpbiB0aGUgZm9ybVxuICAgKiBAcGFyYW0gYXR0ciB0aGUgYXR0ciBvZiB0aGUgZm9ybSBmaWVsZFxuICAgKi9cbiAgY2xlYXJGaWVsZFZhbHVlKGF0dHI6IHN0cmluZywgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpIHtcbiAgICBjb25zdCBjb21wID0gdGhpcy5nZXRGaWVsZFJlZmVyZW5jZShhdHRyKTtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29tcC5jbGVhclZhbHVlKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgdmFsdWUgb2YgZWFjaCBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRycyB0aGUgYXR0cidzIG9mIHRoZSBmb3JtIGZpZWxkc1xuICAgKi9cbiAgY2xlYXJGaWVsZFZhbHVlcyhhdHRyczogc3RyaW5nW10sIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgYXR0cnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzZWxmLmNsZWFyRmllbGRWYWx1ZShrZXksIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcmVmZXJlbmNlIG9mIHRoZSBjb250cm9sIGluIHRoZSBmb3JtLlxuICAgKiBAcGFyYW0gYXR0ciB0aGUgYXR0ciBvZiB0aGUgZm9ybSBmaWVsZFxuICAgKi9cbiAgZ2V0RmllbGRSZWZlcmVuY2UoYXR0cjogc3RyaW5nKTogSUZvcm1EYXRhQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1thdHRyXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIHJlZmVyZW5jZSBvZiBlYWNoIGNvbnRyb2wgaW4gdGhlIGZvcm1cbiAgICogQHBhcmFtIGF0dHJzIHRoZSBhdHRyJ3Mgb2YgdGhlIGZvcm0gZmlsZWRzXG4gICAqL1xuICBnZXRGaWVsZFJlZmVyZW5jZXMoYXR0cnM6IHN0cmluZ1tdKTogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCB7XG4gICAgY29uc3QgYXJyOiBJRm9ybURhdGFDb21wb25lbnRIYXNoID0ge307XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgYXR0cnMuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgYXJyW2tleV0gPSBzZWxmLmdldEZpZWxkUmVmZXJlbmNlKGtleSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIGdldEZvcm1Db21wb25lbnRQZXJtaXNzaW9ucyhhdHRyOiBzdHJpbmcpOiBPUGVybWlzc2lvbnMge1xuICAgIGxldCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgcGVybWlzc2lvbnMgPSAodGhpcy5wZXJtaXNzaW9ucy5jb21wb25lbnRzIHx8IFtdKS5maW5kKGNvbXAgPT4gY29tcC5hdHRyID09PSBhdHRyKTtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9XG5cbiAgZ2V0QWN0aW9uc1Blcm1pc3Npb25zKCk6IE9QZXJtaXNzaW9uc1tdIHtcbiAgICBsZXQgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9uc1tdO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgcGVybWlzc2lvbnMgPSAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKTtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVybWluYXRlRm9ybU1vZGUoKTogdm9pZCB7XG4gICAgY29uc3QgdXJsU2VnbWVudHMgPSB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldFVybFNlZ21lbnRzKCk7XG4gICAgaWYgKHVybFNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHNlZ21lbnQgPSB1cmxTZWdtZW50c1t1cmxTZWdtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgIHRoaXMuZGV0ZXJtaW5hdGVNb2RlRnJvbVVybFNlZ21lbnQoc2VnbWVudCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjdFJvdXRlLnBhcmVudCkge1xuICAgICAgdGhpcy5hY3RSb3V0ZS5wYXJlbnQudXJsLnN1YnNjcmliZShzZWdtZW50cyA9PiB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5kZXRlcm1pbmF0ZU1vZGVGcm9tVXJsU2VnbWVudChzZWdtZW50KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMKTtcbiAgICB9XG4gICAgLy8gc3RheUluUmVjb3JkQWZ0ZXJFZGl0IGlzIHRydWUgaWYgZm9ybSBoYXMgZWRpdGFibGUgZGV0YWlsID0gdHJ1ZVxuICAgIHRoaXMuc3RheUluUmVjb3JkQWZ0ZXJFZGl0ID0gdGhpcy5zdGF5SW5SZWNvcmRBZnRlckVkaXQgfHwgdGhpcy5pc0VkaXRhYmxlRGV0YWlsKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGV0ZXJtaW5hdGVNb2RlRnJvbVVybFNlZ21lbnQoc2VnbWVudDogVXJsU2VnbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IF9wYXRoID0gc2VnbWVudCA/IHNlZ21lbnQucGF0aCA6ICcnO1xuICAgIGlmICh0aGlzLmlzSW5zZXJ0TW9kZVBhdGgoX3BhdGgpKSB7XG4gICAgICB0aGlzLnNldEluc2VydE1vZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNVcGRhdGVNb2RlUGF0aChfcGF0aCkpIHtcbiAgICAgIHRoaXMuc2V0VXBkYXRlTW9kZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEluaXRpYWxNb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF91cGRhdGVGb3JtRGF0YShuZXdGb3JtRGF0YTogb2JqZWN0KTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gbmV3Rm9ybURhdGE7XG4gICAgICBjb25zdCBjb21wb25lbnRzID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tcCA9IGNvbXBvbmVudHNba2V5XTtcbiAgICAgICAgICBpZiAoVXRpbC5pc0Zvcm1EYXRhQ29tcG9uZW50KGNvbXApKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoY29tcC5pc0F1dG9tYXRpY0JpbmRpbmcoKSkge1xuICAgICAgICAgICAgICAgIGNvbXAuZGF0YSA9IHNlbGYuZ2V0RGF0YVZhbHVlKGtleSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYuaW5pdGlhbGl6ZUZpZWxkcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxpemVGaWVsZHMoKTogdm9pZCB7XG4gICAgT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goY29udHJvbCA9PiB7XG4gICAgICB0aGlzLmZvcm1Hcm91cC5jb250cm9sc1tjb250cm9sXS5tYXJrQXNQcmlzdGluZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9ybUNhY2hlLnJlZ2lzdGVyQ2FjaGUoKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnVwZGF0ZU5hdmlnYXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhckNvbXBvbmVudHNPbGRWYWx1ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBjb21wb25lbnRzOiBJRm9ybURhdGFDb21wb25lbnRIYXNoID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgY29tcG9uZW50c0tleXMgPSBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5maWx0ZXIoa2V5ID0+IHNlbGYuaWdub3JlRm9ybUNhY2hlS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKTtcbiAgICBjb21wb25lbnRzS2V5cy5mb3JFYWNoKGNvbXBLZXkgPT4ge1xuICAgICAgY29uc3QgY29tcDogSUZvcm1EYXRhQ29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wS2V5XTtcbiAgICAgIChjb21wIGFzIGFueSkub2xkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICBjb21wLmdldEZvcm1Db250cm9sKCkuc2V0VmFsdWUodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0Q29ycmVjdEluc2VydChyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLklOU0VSVEVEJywgeyBpY29uOiAnY2hlY2tfY2lyY2xlJyB9KTtcbiAgICB0aGlzLm9uSW5zZXJ0LmVtaXQocmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0SW5jb3JyZWN0SW5zZXJ0KHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zaG93RXJyb3IoJ2luc2VydCcsIHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdEluY29ycmVjdERlbGV0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2hvd0Vycm9yKCdkZWxldGUnLCByZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RJbmNvcnJlY3RVcGRhdGUocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dFcnJvcigndXBkYXRlJywgcmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0Q29ycmVjdFVwZGF0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLlNBVkVEJywgeyBpY29uOiAnY2hlY2tfY2lyY2xlJyB9KTtcbiAgICB0aGlzLm9uVXBkYXRlLmVtaXQocmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0Q29ycmVjdERlbGV0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLkRFTEVURUQnLCB7IGljb246ICdjaGVja19jaXJjbGUnIH0pO1xuICAgIHRoaXMub25EZWxldGUuZW1pdChyZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGZvcm1MYXlvdXRNYW5hZ2VyID0gdGhpcy5nZXRGb3JtTWFuYWdlcigpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChmb3JtTGF5b3V0TWFuYWdlcikpIHtcbiAgICAgIGZvcm1MYXlvdXRNYW5hZ2VyLm1hcmtGb3JVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvYmplY3RUb0Zvcm1WYWx1ZURhdGEoZGF0YTogb2JqZWN0ID0ge30pOiBvYmplY3Qge1xuICAgIGNvbnN0IHZhbHVlRGF0YSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHZhbHVlRGF0YVtpdGVtXSA9IG5ldyBPRm9ybVZhbHVlKGRhdGFbaXRlbV0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZURhdGE7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q3VycmVudEtleXNWYWx1ZXMoKTogb2JqZWN0IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtTmF2aWdhdGlvbi5nZXRDdXJyZW50S2V5c1ZhbHVlcygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hDb21wb25lbnRzRWRpdGFibGVTdGF0ZSgpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDpcbiAgICAgICAgdGhpcy5fc2V0Q29tcG9uZW50c0VkaXRhYmxlKHRoaXMuaXNFZGl0YWJsZURldGFpbCgpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTlNFUlQ6XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5VUERBVEU6XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNJbnNlcnRNb2RlUGF0aChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuYXZEYXRhOiBPTmF2aWdhdGlvbkl0ZW0gPSB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmdldExhc3RJdGVtKCk7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKG5hdkRhdGEpICYmIHBhdGggPT09IG5hdkRhdGEuZ2V0SW5zZXJ0Rm9ybVJvdXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNVcGRhdGVNb2RlUGF0aChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuYXZEYXRhOiBPTmF2aWdhdGlvbkl0ZW0gPSB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmdldFByZXZpb3VzUm91dGVEYXRhKCk7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKG5hdkRhdGEpICYmIHBhdGggPT09IG5hdkRhdGEuZ2V0RWRpdEZvcm1Sb3V0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93RXJyb3Iob3BlcmF0aW9uOiBzdHJpbmcsIHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBtZXNzYWdlID0gJ01FU1NBR0VTLkVSUk9SX0RFTEVURSc7XG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlICd1cGRhdGUnOlxuICAgICAgICAgIG1lc3NhZ2UgPSAnTUVTU0FHRVMuRVJST1JfVVBEQVRFJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaW5zZXJ0JzpcbiAgICAgICAgICBtZXNzYWdlID0gJ01FU1NBR0VTLkVSUk9SX0lOU0VSVCc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==