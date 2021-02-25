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
    'onDelete'
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
                    self._reloadAction(true);
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
        this._setData(filter);
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
                this._backAction();
                break;
            case Codes.CLOSE_DETAIL_ACTION:
                this._closeDetailAction(options);
                break;
            case Codes.RELOAD_ACTION:
                this._reloadAction(true);
                break;
            case Codes.GO_INSERT_ACTION:
                this._goInsertMode(options);
                break;
            case Codes.INSERT_ACTION:
                this._insertAction();
                break;
            case Codes.GO_EDIT_ACTION:
                this._goEditMode(options);
                break;
            case Codes.EDIT_ACTION:
                this._editAction();
                break;
            case Codes.UNDO_LAST_CHANGE_ACTION:
                this._undoLastChangeAction();
                break;
            case Codes.DELETE_ACTION: return this._deleteAction();
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
                this.mode = mode;
                if (this._formToolbar) {
                    this._formToolbar.setInitialMode();
                }
                this._setComponentsEditable(this.isEditableDetail());
                this.onFormModeChange.emit(this.mode);
                break;
            case OFormComponent.Mode().INSERT:
                this.mode = mode;
                if (this._formToolbar) {
                    this._formToolbar.setInsertMode();
                }
                this.clearData();
                this._setComponentsEditable(true);
                this.onFormModeChange.emit(this.mode);
                break;
            case OFormComponent.Mode().UPDATE:
                this.mode = mode;
                if (this._formToolbar) {
                    this._formToolbar.setEditMode();
                }
                this._setComponentsEditable(true);
                this.onFormModeChange.emit(this.mode);
                break;
            default:
                break;
        }
    }
    _setData(data) {
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
    _emitData(data) {
        this.onDataLoaded.emit(data);
    }
    _backAction() {
        this.formNavigation.navigateBack();
    }
    _closeDetailAction(options) {
        this.formNavigation.closeDetailAction(options);
    }
    _stayInRecordAfterInsert(insertedKeys) {
        this.formNavigation.stayInRecordAfterInsert(insertedKeys);
    }
    _reloadAction(useFilter = false) {
        let filter = {};
        if (useFilter) {
            filter = this.getCurrentKeysValues();
        }
        this.queryData(filter);
    }
    _goInsertMode(options) {
        this.formNavigation.goInsertMode(options);
    }
    _clearFormAfterInsert() {
        this.clearData();
        this._setComponentsEditable(true);
    }
    _insertAction() {
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
                self._closeDetailAction();
            }
        }, error => {
            self.postIncorrectInsert(error);
        });
    }
    _goEditMode(options) {
        this.formNavigation.goEditMode();
    }
    _editAction() {
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
                self._reloadAction(true);
            }
            else {
                self._closeDetailAction();
            }
        }, error => {
            self.postIncorrectUpdate(error);
        });
    }
    _deleteAction() {
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
                this._setData(resp.data);
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
                    self._reloadAction(true);
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
        this._reloadAction(true);
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
        const self = this;
        const arr = {};
        attrs.forEach((key) => {
            arr[key] = self.getFieldValue(key);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9mb3JtL28tZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUNSLE1BQU0sRUFHTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBYyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFaEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBTWxFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sbUNBQW1DLENBQUM7QUFDdkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUtsRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFB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aUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osZ0JBQWdCLEVBQUUsTUFBTTtpQkFDekI7O2FBQ0Y7OztZQXhKd0IsTUFBTTtZQUF0QixjQUFjO1lBUHJCLE1BQU07WUFMTixpQkFBaUI7WUFJakIsUUFBUTtZQUZSLFVBQVU7OzswQkE0UVQsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0FBbEd6QztJQURDLGNBQWMsRUFBRTs7a0RBQ1U7QUFZM0I7SUFEQyxjQUFjLEVBQUU7OzZEQUNzQjtBQUl2QztJQURDLGNBQWMsRUFBRTs7bURBQ3FCO0FBU3RDO0lBREMsY0FBYyxFQUFFOztzREFDd0I7QUFHekM7SUFEQyxjQUFjLEVBQUU7O2tEQUNVO0FBRTNCO0lBREMsY0FBYyxFQUFFOzs0REFDcUI7QUFHdEM7SUFEQyxjQUFjLEVBQUU7O3lEQUNrQjtBQUVuQztJQURDLGNBQWMsRUFBRTs7MkRBQ21CO0FBRXBDO0lBREMsY0FBYyxFQUFFOzttREFDVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0b3IsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciwgVXJsU2VnbWVudCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElDb21wb25lbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9mb3JtLWRhdGEtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRm9ybURhdGFUeXBlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9mb3JtLWRhdGEtdHlwZS1jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNwb25zZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvc2VydmljZS1yZXNwb25zZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50JztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSwgT05hdmlnYXRpb25JdGVtIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL29udGltaXplL29udGltaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBTbmFja0JhclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zbmFja2Jhci5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPRm9ybUluaXRpYWxpemF0aW9uT3B0aW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tZm9ybS1pbml0aWFsaXphdGlvbi1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT0Zvcm1QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tZm9ybS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU1FMVHlwZXMgfSBmcm9tICcuLi8uLi91dGlsL3NxbHR5cGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9mb3JtLWNvbnRhaW5lci9vLWZvcm0tY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9pbnB1dC9vLWZvcm0tY29udHJvbC5jbGFzcyc7XG5pbXBvcnQgeyBPRm9ybUNhY2hlQ2xhc3MgfSBmcm9tICcuL2NhY2hlL28tZm9ybS5jYWNoZS5jbGFzcyc7XG5pbXBvcnQgeyBDYW5Db21wb25lbnREZWFjdGl2YXRlLCBDYW5EZWFjdGl2YXRlRm9ybUd1YXJkIH0gZnJvbSAnLi9ndWFyZHMvby1mb3JtLWNhbi1kZWFjdGl2YXRlLmd1YXJkJztcbmltcG9ydCB7IE9Gb3JtTmF2aWdhdGlvbkNsYXNzIH0gZnJvbSAnLi9uYXZpZ2F0aW9uL28tZm9ybS5uYXZpZ2F0aW9uLmNsYXNzJztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHsgT0Zvcm1Ub29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL28tZm9ybS10b29sYmFyLmNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBJRm9ybURhdGFDb21wb25lbnRIYXNoIHtcbiAgW2F0dHI6IHN0cmluZ106IElGb3JtRGF0YUNvbXBvbmVudDtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRk9STSA9IFtcbiAgLy8gc2hvdy1oZWFkZXIgW2Jvb2xlYW5dOiB2aXNpYmlsaXR5IG9mIGZvcm0gdG9vbGJhci4gRGVmYXVsdDogeWVzLlxuICAnc2hvd0hlYWRlcjogc2hvdy1oZWFkZXInLFxuXG4gIC8vIGhlYWRlci1tb2RlIFtzdHJpbmddWyBub25lIHwgZmxvYXRpbmcgXTogcGFpbnRpbmcgbW9kZSBvZiBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6ICdmbG9hdGluZydcbiAgJ2hlYWRlck1vZGU6IGhlYWRlci1tb2RlJyxcblxuICAvLyBoZWFkZXItcG9zaXRpb24gWyB0b3AgfCBib3R0b20gXTogcG9zaXRpb24gb2YgdGhlIGZvcm0gdG9vbGJhci4gRGVmYXVsdDogJ3RvcCdcbiAgJ2hlYWRlclBvc2l0aW9uOiBoZWFkZXItcG9zaXRpb24nLFxuXG4gIC8vIGxhYmVsLWhlYWRlciBbc3RyaW5nXTogZGlzcGxheWFibGUgdGV4dCBvbiBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6ICcnLlxuICAnbGFiZWxoZWFkZXI6IGxhYmVsLWhlYWRlcicsXG5cbiAgLy8gbGFiZWwtaGVhZGVyLWFsaWduIFtzdHJpbmddW3N0YXJ0IHwgY2VudGVyIHwgZW5kXTogYWxpZ25tZW50IG9mIGZvcm0gdG9vbGJhciB0ZXh0LiBEZWZhdWx0OiAnY2VudGVyJ1xuICAnbGFiZWxIZWFkZXJBbGlnbjogbGFiZWwtaGVhZGVyLWFsaWduJyxcblxuICAvLyBoZWFkZXItYWN0aW9ucyBbc3RyaW5nXTogYXZhaWxhYmxlIGFjdGlvbiBidXR0b25zIG9uIGZvcm0gdG9vbGJhciBvZiBzdGFuZGFyZCBDUlVEIG9wZXJhdGlvbnMsIHNlcGFyYXRlZCBieSAnOycuIEF2YWlsYWJsZSBvcHRpb25zIGFyZSBSO0k7VTtEIChSZWZyZXNoLCBJbnNlcnQsIFVwZGF0ZSwgRGVsZXRlKS4gRGVmYXVsdDogUjtJO1U7RFxuICAnaGVhZGVyYWN0aW9uczogaGVhZGVyLWFjdGlvbnMnLFxuXG4gIC8vIHNob3ctaGVhZGVyLWFjdGlvbnMtdGV4dCBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgdGV4dCBvZiBmb3JtIHRvb2xiYXIgYnV0dG9ucy4gRGVmYXVsdCB5ZXNcbiAgJ3Nob3dIZWFkZXJBY3Rpb25zVGV4dDogc2hvdy1oZWFkZXItYWN0aW9ucy10ZXh0JyxcblxuICAvLyBlbnRpdHkgW3N0cmluZ106IGVudGl0eSBvZiB0aGUgc2VydmljZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdlbnRpdHknLFxuXG4gIC8vIGtleXMgW3N0cmluZ106IGVudGl0eSBrZXlzLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2tleXMnLFxuXG4gIC8vIGNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIGVudGl0eSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdjb2x1bW5zJyxcblxuICAvLyBzZXJ2aWNlIFtzdHJpbmddOiBKRUUgc2VydmljZSBwYXRoLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NlcnZpY2UnLFxuXG4gIC8vIHN0YXktaW4tcmVjb3JkLWFmdGVyLWVkaXQgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93cyBlZGl0IGZvcm0gYWZ0ZXIgZWRpdCBhIHJlY29yZC4gRGVmYXVsdDogZmFsc2U7XG4gICdzdGF5SW5SZWNvcmRBZnRlckVkaXQ6IHN0YXktaW4tcmVjb3JkLWFmdGVyLWVkaXQnLFxuXG4gIC8vIFtzdHJpbmddW25ldyB8IGRldGFpbF06IHNob3dzIHJlc2V0ZWQgZm9ybSBhZnRlciBpbnNlcnQgYSBuZXcgcmVjb3JkIChuZXcpIG9yIHNob3dzIHRoZSBpbnNlcnRlZCByZWNvcmQgYWZ0ZXIgKGRldGFpbClcbiAgJ2FmdGVySW5zZXJ0TW9kZTogYWZ0ZXItaW5zZXJ0LW1vZGUnLFxuXG4gICdzZXJ2aWNlVHlwZSA6IHNlcnZpY2UtdHlwZScsXG5cbiAgJ3F1ZXJ5T25Jbml0IDogcXVlcnktb24taW5pdCcsXG5cbiAgJ3BhcmVudEtleXM6IHBhcmVudC1rZXlzJyxcblxuICAvLyBxdWVyeS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gcXVlcmllcy4gRGVmYXVsdDogcXVlcnkuXG4gICdxdWVyeU1ldGhvZDogcXVlcnktbWV0aG9kJyxcblxuICAvLyBpbnNlcnQtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGluc2VydHMuIERlZmF1bHQ6IGluc2VydC5cbiAgJ2luc2VydE1ldGhvZDogaW5zZXJ0LW1ldGhvZCcsXG5cbiAgLy8gdXBkYXRlLW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSB1cGRhdGVzLiBEZWZhdWx0OiB1cGRhdGUuXG4gICd1cGRhdGVNZXRob2Q6IHVwZGF0ZS1tZXRob2QnLFxuXG4gIC8vIGRlbGV0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gZGVsZXRpb25zLiBEZWZhdWx0OiBkZWxldGUuXG4gICdkZWxldGVNZXRob2Q6IGRlbGV0ZS1tZXRob2QnLFxuXG4gIC8vIGxheW91dC1kaXJlY3Rpb24gW3N0cmluZ11bY29sdW1ufHJvd106IERlZmF1bHQ6IGNvbHVtblxuICAnbGF5b3V0RGlyZWN0aW9uOiBsYXlvdXQtZGlyZWN0aW9uJyxcblxuICAvLyBmeExheW91dEFsaWduIHZhbHVlLiBEZWZhdWx0OiAnc3RhcnQgc3RhcnQnXG4gICdsYXlvdXRBbGlnbjogbGF5b3V0LWFsaWduJyxcblxuICAvLyBlZGl0YWJsZS1kZXRhaWwgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBEZWZhdWx0OiB0cnVlO1xuICAnZWRpdGFibGVEZXRhaWw6IGVkaXRhYmxlLWRldGFpbCcsXG5cbiAgLy8ga2V5cy1zcWwtdHlwZXMgW3N0cmluZ106IGVudGl0eSBrZXlzIHR5cGVzLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2tleXNTcWxUeXBlczoga2V5cy1zcWwtdHlwZXMnLFxuXG4gIC8vIHVuZG8tYnV0dG9uIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogSW5jbHVkZSB1bmRvIGJ1dHRvbiBpbiBmb3JtLXRvb2xiYXIuIERlZmF1bHQ6IHRydWU7XG4gICd1bmRvQnV0dG9uOiB1bmRvLWJ1dHRvbicsXG5cbiAgLy8gc2hvdy1oZWFkZXItbmF2aWdhdGlvbiBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluY2x1ZGUgbmF2aWdhdGlvbnMgYnV0dG9ucyBpbiBmb3JtLXRvb2xiYXIuIERlZmF1bHQ6IGZhbHNlO1xuICAnc2hvd0hlYWRlck5hdmlnYXRpb246IHNob3ctaGVhZGVyLW5hdmlnYXRpb24nLFxuXG4gIC8vIGF0dHJcbiAgJ29hdHRyOmF0dHInLFxuXG4gICdpbmNsdWRlQnJlYWRjcnVtYjogaW5jbHVkZS1icmVhZGNydW1iJyxcblxuICAnZGV0ZWN0Q2hhbmdlc09uQmx1cjogZGV0ZWN0LWNoYW5nZXMtb24tYmx1cicsXG5cbiAgJ2NvbmZpcm1FeGl0OiBjb25maXJtLWV4aXQnLFxuXG4gIC8vIFtmdW5jdGlvbl06IGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gcXVlcnkgZXJyb3IuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVlcnlGYWxsYmFja0Z1bmN0aW9uOiBxdWVyeS1mYWxsYmFjay1mdW5jdGlvbidcbiAgLy8gLFxuXG4gIC8vICdpbnNlcnRGYWxsYmFja0Z1bmN0aW9uOiBpbnNlcnQtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICd1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiB1cGRhdGUtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICdkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiBkZWxldGUtZmFsbGJhY2stZnVuY3Rpb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fRk9STSA9IFtcbiAgJ29uRGF0YUxvYWRlZCcsXG4gICdiZWZvcmVDbG9zZURldGFpbCcsXG4gICdiZWZvcmVHb0VkaXRNb2RlJyxcbiAgJ29uRm9ybU1vZGVDaGFuZ2UnLFxuICAnb25JbnNlcnQnLFxuICAnb25VcGRhdGUnLFxuICAnb25EZWxldGUnXG5dO1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1mb3JtJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT250aW1pemVTZXJ2aWNlUHJvdmlkZXJcbiAgXSxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZm9ybS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZm9ybS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fRk9STSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fRk9STSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1mb3JtXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkNvbXBvbmVudERlYWN0aXZhdGUsIEFmdGVyVmlld0luaXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9MQVlPVVRfRElSRUNUSU9OID0gJ2NvbHVtbic7XG4gIHB1YmxpYyBzdGF0aWMgZ3VhcmRDbGFzc05hbWUgPSAnQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCc7XG5cbiAgLyogaW5wdXRzIHZhcmlhYmxlcyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93SGVhZGVyOiBib29sZWFuID0gdHJ1ZTtcbiAgaGVhZGVyTW9kZTogc3RyaW5nID0gJ2Zsb2F0aW5nJztcbiAgaGVhZGVyUG9zaXRpb246ICd0b3AnIHwgJ2JvdHRvbScgPSAndG9wJztcbiAgbGFiZWxoZWFkZXI6IHN0cmluZyA9ICcnO1xuICBsYWJlbEhlYWRlckFsaWduOiBzdHJpbmcgPSAnY2VudGVyJztcbiAgaGVhZGVyYWN0aW9uczogc3RyaW5nID0gJyc7XG4gIHNob3dIZWFkZXJBY3Rpb25zVGV4dDogc3RyaW5nID0gJ3llcyc7XG4gIGVudGl0eTogc3RyaW5nO1xuICBrZXlzOiBzdHJpbmcgPSAnJztcbiAgY29sdW1uczogc3RyaW5nID0gJyc7XG4gIHNlcnZpY2U6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgc3RheUluUmVjb3JkQWZ0ZXJFZGl0OiBib29sZWFuID0gZmFsc2U7XG4gIGFmdGVySW5zZXJ0TW9kZTogJ25ldycgfCAnZGV0YWlsJyA9IG51bGw7XG4gIHNlcnZpY2VUeXBlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBxdWVyeU9uSW5pdDogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBwYXJlbnRLZXlzOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBxdWVyeU1ldGhvZDogc3RyaW5nID0gQ29kZXMuUVVFUllfTUVUSE9EO1xuICBwcm90ZWN0ZWQgaW5zZXJ0TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5JTlNFUlRfTUVUSE9EO1xuICBwcm90ZWN0ZWQgdXBkYXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5VUERBVEVfTUVUSE9EO1xuICBwcm90ZWN0ZWQgZGVsZXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5ERUxFVEVfTUVUSE9EO1xuICBwcm90ZWN0ZWQgX2xheW91dERpcmVjdGlvbjogc3RyaW5nID0gT0Zvcm1Db21wb25lbnQuREVGQVVMVF9MQVlPVVRfRElSRUNUSU9OO1xuICBwcm90ZWN0ZWQgX2xheW91dEFsaWduOiBzdHJpbmcgPSAnc3RhcnQgc3RyZXRjaCc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBlZGl0YWJsZURldGFpbDogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBrZXlzU3FsVHlwZXM6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgdW5kb0J1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dIZWFkZXJOYXZpZ2F0aW9uOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBvYXR0cjogc3RyaW5nID0gJyc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGluY2x1ZGVCcmVhZGNydW1iOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGRldGVjdENoYW5nZXNPbkJsdXI6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBjb25maXJtRXhpdDogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBxdWVyeUZhbGxiYWNrRnVuY3Rpb246IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAvLyBwdWJsaWMgaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb247XG4gIC8vIHB1YmxpYyB1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbjtcbiAgLy8gcHVibGljIGRlbGV0ZUZhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uO1xuXG4gIC8qIGVuZCBvZiBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgLypwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuICBpc0RldGFpbEZvcm06IGJvb2xlYW4gPSBmYWxzZTtcbiAga2V5c0FycmF5OiBzdHJpbmdbXSA9IFtdO1xuICBjb2xzQXJyYXk6IHN0cmluZ1tdID0gW107XG4gIGRhdGFTZXJ2aWNlOiBhbnk7XG4gIF9wS2V5c0VxdWl2ID0ge307XG4gIGtleXNTcWxUeXBlc0FycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIC8qIGVuZCBvZiBwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuICBvbkRhdGFMb2FkZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG4gIGJlZm9yZUNsb3NlRGV0YWlsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBiZWZvcmVHb0VkaXRNb2RlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBvbkZvcm1Nb2RlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuICBwdWJsaWMgb25JbnNlcnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25VcGRhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EZWxldGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHByb3RlY3RlZCBsb2FkaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwdWJsaWMgbG9hZGluZzogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMubG9hZGluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gIHB1YmxpYyBmb3JtRGF0YTogb2JqZWN0ID0ge307XG4gIHB1YmxpYyBuYXZpZ2F0aW9uRGF0YTogQXJyYXk8YW55PiA9IFtdO1xuICBwdWJsaWMgY3VycmVudEluZGV4ID0gMDtcbiAgcHVibGljIG1vZGU6IG51bWJlciA9IE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMO1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbmF2aWdhdGlvblNlcnZpY2U6IE5hdmlnYXRpb25TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJTZXJ2aWNlOiBTbmFja0JhclNlcnZpY2U7XG5cbiAgcHJvdGVjdGVkIF9mb3JtVG9vbGJhcjogT0Zvcm1Ub29sYmFyQ29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBfY29tcG9uZW50czogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCA9IHt9O1xuICBwcm90ZWN0ZWQgX2NvbXBTUUxUeXBlczogb2JqZWN0ID0ge307XG5cbiAgZm9ybVBhcmVudEtleXNWYWx1ZXM6IG9iamVjdDtcblxuICBwdWJsaWMgb25Gb3JtSW5pdFN0cmVhbTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBwcm90ZWN0ZWQgcmVsb2FkU3RyZWFtOiBPYnNlcnZhYmxlPGFueT47XG4gIHByb3RlY3RlZCByZWxvYWRTdHJlYW1TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcm90ZWN0ZWQgcXVlcnlTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGxvYWRlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgZHluYW1pY0Zvcm1TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcm90ZWN0ZWQgZGVhY3RpdmF0ZUd1YXJkOiBDYW5EZWFjdGl2YXRlRm9ybUd1YXJkO1xuICBwcm90ZWN0ZWQgZm9ybUNhY2hlOiBPRm9ybUNhY2hlQ2xhc3M7XG4gIHByb3RlY3RlZCBmb3JtTmF2aWdhdGlvbjogT0Zvcm1OYXZpZ2F0aW9uQ2xhc3M7XG5cbiAgcHVibGljIGZvcm1Db250YWluZXI6IE9Gb3JtQ29udGFpbmVyQ29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uc1NlcnZpY2U6IFBlcm1pc3Npb25zU2VydmljZTtcbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zOiBPRm9ybVBlcm1pc3Npb25zO1xuXG4gIEBWaWV3Q2hpbGQoJ2lubmVyRm9ybScsIHsgc3RhdGljOiBmYWxzZSB9KSBpbm5lckZvcm1FbDogRWxlbWVudFJlZjtcblxuICBpZ25vcmVGb3JtQ2FjaGVLZXlzOiBBcnJheTxhbnk+ID0gW107XG4gIGNhbkRpc2NhcmRDaGFuZ2VzOiBib29sZWFuO1xuXG4gIHB1YmxpYyBzdGF0aWMgTW9kZSgpOiBhbnkge1xuICAgIGVudW0gbSB7XG4gICAgICBRVUVSWSxcbiAgICAgIElOU0VSVCxcbiAgICAgIFVQREFURSxcbiAgICAgIElOSVRJQUxcbiAgICB9XG4gICAgcmV0dXJuIG07XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJvdGVjdGVkIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcm90ZWN0ZWQgem9uZTogTmdab25lLFxuICAgIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG5cbiAgICB0aGlzLmZvcm1DYWNoZSA9IG5ldyBPRm9ybUNhY2hlQ2xhc3ModGhpcyk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbiA9IG5ldyBPRm9ybU5hdmlnYXRpb25DbGFzcyh0aGlzLmluamVjdG9yLCB0aGlzLCB0aGlzLnJvdXRlciwgdGhpcy5hY3RSb3V0ZSk7XG5cbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZSA9IGluamVjdG9yLmdldChOYXZpZ2F0aW9uU2VydmljZSk7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSBpbmplY3Rvci5nZXQoU25hY2tCYXJTZXJ2aWNlKTtcbiAgICB0aGlzLnBlcm1pc3Npb25zU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFBlcm1pc3Npb25zU2VydmljZSk7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLnJlbG9hZFN0cmVhbSA9IGNvbWJpbmVMYXRlc3QoW1xuICAgICAgc2VsZi5vbkZvcm1Jbml0U3RyZWFtLmFzT2JzZXJ2YWJsZSgpLFxuICAgICAgc2VsZi5mb3JtTmF2aWdhdGlvbi5uYXZpZ2F0aW9uU3RyZWFtLmFzT2JzZXJ2YWJsZSgpXG4gICAgXSk7XG5cbiAgICB0aGlzLnJlbG9hZFN0cmVhbVN1YnNjcmlwdGlvbiA9IHRoaXMucmVsb2FkU3RyZWFtLnN1YnNjcmliZSh2YWxBcnIgPT4ge1xuICAgICAgaWYgKFV0aWwuaXNBcnJheSh2YWxBcnIpICYmIHZhbEFyci5sZW5ndGggPT09IDIgJiYgIXNlbGYuaXNJbkluc2VydE1vZGUoKSkge1xuICAgICAgICBjb25zdCB2YWxBcnJWYWx1ZXMgPSB2YWxBcnJbMF0gPT09IHRydWUgJiYgdmFsQXJyWzFdID09PSB0cnVlO1xuICAgICAgICBpZiAoc2VsZi5xdWVyeU9uSW5pdCAmJiB2YWxBcnJWYWx1ZXMpIHtcbiAgICAgICAgICBzZWxmLl9yZWxvYWRBY3Rpb24odHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5pbml0aWFsaXplRmllbGRzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZvcm1Db250YWluZXIgPSBpbmplY3Rvci5nZXQoT0Zvcm1Db250YWluZXJDb21wb25lbnQpO1xuICAgICAgdGhpcy5mb3JtQ29udGFpbmVyLnNldEZvcm0odGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9cbiAgICB9XG4gIH1cblxuICByZWdpc3RlckZvcm1Db21wb25lbnQoY29tcDogYW55KSB7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgaWYgKCFjb21wLmlzQXV0b21hdGljUmVnaXN0ZXJpbmcoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jb21wb25lbnRzLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgY29tcC5yZXBlYXRlZEF0dHIgPSB0cnVlO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZXJlIGlzIGFscmVhZHkgYSBjb21wb25lbnQgcmVnaXN0ZXJlZCBpbiB0aGUgZm9ybSB3aXRoIHRoZSBhdHRyOiAnICsgYXR0cik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29tcG9uZW50c1thdHRyXSA9IGNvbXA7XG4gICAgICAgIC8vIFNldHRpbmcgcGFyZW50IGtleSB2YWx1ZXMuLi5cbiAgICAgICAgaWYgKHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXMgJiYgdGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlc1thdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlc1thdHRyXTtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnRzW2F0dHJdLnNldFZhbHVlKHZhbCwge1xuICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAqIFRPRE8uIENoZWNrIGl0ISEhXG4gICAgICAgICogRW4gdW4gZm9ybXVsYXJpbyBjb24gdGFicywgY3VhbmRvIHNlIGNhbWJpYSBkZSB1bm8gYSBvdHJvLCBzZSBkZXN0cnV5ZW4gbGFzIHZpc3Rhc1xuICAgICAgICAqIGRlIGxvcyBjb21wb25lbnRlcyBoaWpvIGRlbCBmb3JtdWxhcmlvLlxuICAgICAgICAqIGZvcm1EYXRhQ2FjaGUgY29udGllbmUgbG9zIHZhbG9yZXMgKG9yaWdpbmFsZXMgw7MgZWRpdGFkb3MpIGRlIGxvcyBjYW1wb3MgZGVsIGZvcm11bGFyaW8uXG4gICAgICAgICogTGEgaWRlYSBlcyBhc2lnbmFyIGVzZSB2YWxvciBhbCBjYW1wbyBjdWFuZG8gc2UgcmVnaXN0cmUgZGUgbnVldm8gKEhheSBxdWUgYXNlZ3VyYXIgZWwgcHJvY2Vzb1xuICAgICAgICAqIHBhcmEgcXVlIHPDs2xvIHNlYSBjdWFuZG8gc2UgcmVnaXN0cmEgZGUgbnVldm8gOykgKVxuICAgICAgICAqL1xuICAgICAgICBjb25zdCBjYWNoZWRWYWx1ZSA9IHRoaXMuZm9ybUNhY2hlLmdldENhY2hlZFZhbHVlKGF0dHIpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2FjaGVkVmFsdWUpICYmIHRoaXMuZ2V0RGF0YVZhbHVlcygpICYmIHRoaXMuX2NvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnRzW2F0dHJdLnNldFZhbHVlKGNhY2hlZFZhbHVlLCB7XG4gICAgICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgZW1pdEV2ZW50OiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJTUUxUeXBlRm9ybUNvbXBvbmVudChjb21wOiBJRm9ybURhdGFUeXBlQ29tcG9uZW50KSB7XG4gICAgaWYgKChjb21wIGFzIGFueSkucmVwZWF0ZWRBdHRyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb21wKSB7XG4gICAgICBjb25zdCB0eXBlID0gY29tcC5nZXRTUUxUeXBlKCk7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmICh0eXBlICE9PSBTUUxUeXBlcy5PVEhFUiAmJiBhdHRyICYmIGF0dHIubGVuZ3RoID4gMCAmJiB0aGlzLmlnbm9yZUZvcm1DYWNoZUtleXMuaW5kZXhPZihhdHRyKSA9PT0gLTEpIHtcbiAgICAgICAgLy8gUmlnaHQgbm93IGp1c3Qgc3RvcmUgdmFsdWVzIGRpZmZlcmVudCBvZiAnT1RIRVInXG4gICAgICAgIHRoaXMuX2NvbXBTUUxUeXBlc1thdHRyXSA9IHR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJGb3JtQ29udHJvbENvbXBvbmVudChjb21wOiBJRm9ybURhdGFDb21wb25lbnQpIHtcbiAgICBpZiAoKGNvbXAgYXMgYW55KS5yZXBlYXRlZEF0dHIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2w6IEZvcm1Db250cm9sID0gY29tcC5nZXRDb250cm9sKCk7XG4gICAgICAgIGlmIChjb250cm9sKSB7XG4gICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVnaXN0ZXJDb250cm9sKGF0dHIsIGNvbnRyb2wpO1xuICAgICAgICAgIGlmICghY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMuaWdub3JlRm9ybUNhY2hlS2V5cy5wdXNoKGNvbXAuZ2V0QXR0cmlidXRlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXJGb3JtQ29tcG9uZW50KGNvbXA6IElDb21wb25lbnQpIHtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAoYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDAgJiYgdGhpcy5fY29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1thdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnJlZ2lzdGVyRm9ybUNvbnRyb2xDb21wb25lbnQoY29tcDogSUZvcm1EYXRhQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXAgJiYgY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2w6IEZvcm1Db250cm9sID0gY29tcC5nZXRDb250cm9sKCk7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmIChjb250cm9sICYmIGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woYXR0cik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlclNRTFR5cGVGb3JtQ29tcG9uZW50KGNvbXA6IElGb3JtRGF0YVR5cGVDb21wb25lbnQpIHtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAoYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbXBTUUxUeXBlc1thdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3RlclRvb2xiYXIoZlRvb2xiYXI6IE9Gb3JtVG9vbGJhckNvbXBvbmVudCkge1xuICAgIGlmIChmVG9vbGJhcikge1xuICAgICAgdGhpcy5fZm9ybVRvb2xiYXIgPSBmVG9vbGJhcjtcbiAgICAgIHRoaXMuX2Zvcm1Ub29sYmFyLmlzRGV0YWlsID0gdGhpcy5pc0RldGFpbEZvcm07XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50cygpOiBJRm9ybURhdGFDb21wb25lbnRIYXNoIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcbiAgfVxuXG4gIHB1YmxpYyBsb2FkKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgem9uZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgY29uc3QgbG9hZE9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgIH0sIDI1MCk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc2VsZi5sb2FkaW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbG9hZE9ic2VydmFibGUuc3Vic2NyaWJlKHZhbCA9PiB7XG4gICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHNlbGYubG9hZGluZ1N1YmplY3QubmV4dCh2YWwgYXMgYm9vbGVhbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0RGF0YVZhbHVlKGF0dHI6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmlzSW5JbnNlcnRNb2RlKCkpIHtcbiAgICAgIGNvbnN0IHVybFBhcmFtcyA9IHRoaXMuZm9ybU5hdmlnYXRpb24uZ2V0RmlsdGVyRnJvbVVybFBhcmFtcygpO1xuICAgICAgY29uc3QgdmFsID0gdGhpcy5mb3JtR3JvdXAudmFsdWVbYXR0cl0gfHwgdXJsUGFyYW1zW2F0dHJdO1xuICAgICAgcmV0dXJuIG5ldyBPRm9ybVZhbHVlKHZhbCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSW5Jbml0aWFsTW9kZSgpICYmICF0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSkge1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZm9ybURhdGE7XG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgIHJldHVybiBkYXRhW2F0dHJdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0luVXBkYXRlTW9kZSgpIHx8IHRoaXMuaXNFZGl0YWJsZURldGFpbCgpKSB7XG4gICAgICBpZiAodGhpcy5mb3JtRGF0YSAmJiBPYmplY3Qua2V5cyh0aGlzLmZvcm1EYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZm9ybUNhY2hlLmdldENhY2hlZFZhbHVlKGF0dHIpO1xuICAgICAgICBpZiAodGhpcy5mb3JtR3JvdXAuZGlydHkgJiYgdmFsKSB7XG4gICAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgT0Zvcm1WYWx1ZSh2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJldHVybiBvcmlnaW5hbCB2YWx1ZSBzdG9yZWQgaW50byBmb3JtIGRhdGEuLi5cbiAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5mb3JtRGF0YTtcbiAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVthdHRyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPRm9ybVZhbHVlKCk7XG4gIH1cblxuICBnZXREYXRhVmFsdWVzKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm1EYXRhO1xuICB9XG5cbiAgY2xlYXJEYXRhKCkge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZm9ybU5hdmlnYXRpb24uZ2V0RmlsdGVyRnJvbVVybFBhcmFtcygpO1xuICAgIHRoaXMuZm9ybUdyb3VwLnJlc2V0KHt9LCB7XG4gICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgfSk7XG4gICAgdGhpcy5fc2V0RGF0YShmaWx0ZXIpO1xuICB9XG5cbiAgY2FuRGVhY3RpdmF0ZSgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgUHJvbWlzZTxib29sZWFuPiB8IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5jb25maXJtRXhpdCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGNhbkRpc2NhcmRDaGFuZ2VzID0gdGhpcy5jYW5EaXNjYXJkQ2hhbmdlcztcbiAgICB0aGlzLmNhbkRpc2NhcmRDaGFuZ2VzID0gZmFsc2U7XG4gICAgcmV0dXJuIGNhbkRpc2NhcmRDaGFuZ2VzIHx8IHRoaXMuc2hvd0NvbmZpcm1EaXNjYXJkQ2hhbmdlcygpO1xuICB9XG5cbiAgc2hvd0NvbmZpcm1EaXNjYXJkQ2hhbmdlcygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtTmF2aWdhdGlvbi5zaG93Q29uZmlybURpc2NhcmRDaGFuZ2VzKCk7XG4gIH1cblxuICBleGVjdXRlVG9vbGJhckFjdGlvbihhY3Rpb246IHN0cmluZywgb3B0aW9ucz86IGFueSkge1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlIENvZGVzLkJBQ0tfQUNUSU9OOiB0aGlzLl9iYWNrQWN0aW9uKCk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5DTE9TRV9ERVRBSUxfQUNUSU9OOiB0aGlzLl9jbG9zZURldGFpbEFjdGlvbihvcHRpb25zKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLlJFTE9BRF9BQ1RJT046IHRoaXMuX3JlbG9hZEFjdGlvbih0cnVlKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLkdPX0lOU0VSVF9BQ1RJT046IHRoaXMuX2dvSW5zZXJ0TW9kZShvcHRpb25zKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLklOU0VSVF9BQ1RJT046IHRoaXMuX2luc2VydEFjdGlvbigpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuR09fRURJVF9BQ1RJT046IHRoaXMuX2dvRWRpdE1vZGUob3B0aW9ucyk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5FRElUX0FDVElPTjogdGhpcy5fZWRpdEFjdGlvbigpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuVU5ET19MQVNUX0NIQU5HRV9BQ1RJT046IHRoaXMuX3VuZG9MYXN0Q2hhbmdlQWN0aW9uKCk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5ERUxFVEVfQUNUSU9OOiByZXR1cm4gdGhpcy5fZGVsZXRlQWN0aW9uKCk7XG4gICAgICBkZWZhdWx0OiBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYWRkRGVhY3RpdmF0ZUd1YXJkKCk7XG5cbiAgICB0aGlzLmZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuXG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGFkZERlYWN0aXZhdGVHdWFyZCgpIHtcbiAgICBpZiAodGhpcy5pc0luSW5pdGlhbE1vZGUoKSAmJiAhdGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmFjdFJvdXRlIHx8ICF0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVhY3RpdmF0ZUd1YXJkID0gdGhpcy5pbmplY3Rvci5nZXQoQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCk7XG4gICAgdGhpcy5kZWFjdGl2YXRlR3VhcmQuc2V0Rm9ybSh0aGlzKTtcbiAgICBjb25zdCBjYW5EZWFjdGl2YXRlQXJyYXkgPSAodGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlIHx8IFtdKTtcbiAgICBsZXQgcHJldmlvdXNseUFkZGVkID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNhbkRlYWN0aXZhdGVBcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgcHJldmlvdXNseUFkZGVkID0gKChjYW5EZWFjdGl2YXRlQXJyYXlbaV0uaGFzT3duUHJvcGVydHkoJ0NMQVNTTkFNRScpICYmIGNhbkRlYWN0aXZhdGVBcnJheVtpXS5DTEFTU05BTUUpID09PSBPRm9ybUNvbXBvbmVudC5ndWFyZENsYXNzTmFtZSk7XG4gICAgICBpZiAocHJldmlvdXNseUFkZGVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXByZXZpb3VzbHlBZGRlZCkge1xuICAgICAgY2FuRGVhY3RpdmF0ZUFycmF5LnB1c2godGhpcy5kZWFjdGl2YXRlR3VhcmQuY29uc3RydWN0b3IpO1xuICAgICAgdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlID0gY2FuRGVhY3RpdmF0ZUFycmF5O1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lEZWFjdGl2YXRlR3VhcmQoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghdGhpcy5kZWFjdGl2YXRlR3VhcmQgfHwgIXRoaXMuYWN0Um91dGUgfHwgIXRoaXMuYWN0Um91dGUucm91dGVDb25maWcgfHwgIXRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmRlYWN0aXZhdGVHdWFyZC5zZXRGb3JtKHVuZGVmaW5lZCk7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmICh0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGVbaV0ubmFtZSA9PT0gT0Zvcm1Db21wb25lbnQuZ3VhcmRDbGFzc05hbWUpIHtcbiAgICAgICAgICB0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vXG4gICAgfVxuICB9XG5cbiAgaGFzRGVhY3RpdmF0ZUd1YXJkKCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRlYWN0aXZhdGVHdWFyZCk7XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBtZXRob2RzXG4gICAqL1xuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuaGVhZGVyYWN0aW9ucyA9PT0gJ2FsbCcpIHtcbiAgICAgIHRoaXMuaGVhZGVyYWN0aW9ucyA9ICdSO0k7VTtEJztcbiAgICB9XG4gICAgdGhpcy5rZXlzQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5rZXlzLCB0cnVlKTtcbiAgICB0aGlzLmNvbHNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGNvbnN0IHBrQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5wYXJlbnRLZXlzKTtcbiAgICB0aGlzLl9wS2V5c0VxdWl2ID0gVXRpbC5wYXJzZVBhcmVudEtleXNFcXVpdmFsZW5jZXMocGtBcnJheSk7XG4gICAgdGhpcy5rZXlzU3FsVHlwZXNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmtleXNTcWxUeXBlcyk7XG5cbiAgICB0aGlzLmNvbmZpZ3VyZVNlcnZpY2UoKTtcblxuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3Vic2NyaWJlVG9RdWVyeVBhcmFtcygpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3Vic2NyaWJlVG9VcmxQYXJhbXMoKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN1YnNjcmliZVRvVXJsKCk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zdWJzY3JpYmVUb0NhY2hlQ2hhbmdlcyh0aGlzLmZvcm1DYWNoZS5vbkNhY2hlRW1wdHlTdGF0ZUNoYW5nZXMpO1xuXG4gICAgaWYgKHRoaXMubmF2aWdhdGlvblNlcnZpY2UpIHtcbiAgICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2Uub25WaXNpYmxlQ2hhbmdlKHZpc2libGUgPT4ge1xuICAgICAgICBzZWxmLnNob3dIZWFkZXIgPSB2aXNpYmxlO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlID0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUw7XG5cbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UuZ2V0Rm9ybVBlcm1pc3Npb25zKHRoaXMub2F0dHIsIHRoaXMuYWN0Um91dGUpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmluc2VydEZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLnVwZGF0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmRlbGV0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICB9XG5cbiAgcmVpbml0aWFsaXplKG9wdGlvbnM6IE9Gb3JtSW5pdGlhbGl6YXRpb25PcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgJiYgT2JqZWN0LmtleXMob3B0aW9ucykubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjbG9uZWRPcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG4gICAgICBmb3IgKGNvbnN0IHByb3AgaW4gY2xvbmVkT3B0cykge1xuICAgICAgICBpZiAoY2xvbmVkT3B0cy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgIHRoaXNbcHJvcF0gPSBjbG9uZWRPcHRzW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbmZpZ3VyZVNlcnZpY2UoKSB7XG4gICAgbGV0IGxvYWRpbmdTZXJ2aWNlOiBhbnkgPSBPbnRpbWl6ZVNlcnZpY2U7XG4gICAgaWYgKHRoaXMuc2VydmljZVR5cGUpIHtcbiAgICAgIGxvYWRpbmdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlVHlwZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChsb2FkaW5nU2VydmljZSk7XG4gICAgICBpZiAoVXRpbC5pc0RhdGFTZXJ2aWNlKHRoaXMuZGF0YVNlcnZpY2UpKSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2VDZmcgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldERlZmF1bHRTZXJ2aWNlQ29uZmlndXJhdGlvbih0aGlzLnNlcnZpY2UpO1xuICAgICAgICBpZiAodGhpcy5lbnRpdHkpIHtcbiAgICAgICAgICBzZXJ2aWNlQ2ZnLmVudGl0eSA9IHRoaXMuZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVNlcnZpY2UuY29uZmlndXJlU2VydmljZShzZXJ2aWNlQ2ZnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5yZWxvYWRTdHJlYW1TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVsb2FkU3RyZWFtU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5mb3JtQ2FjaGUuZGVzdHJveSgpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uZGVzdHJveSgpO1xuICAgIHRoaXMuZGVzdHJveURlYWN0aXZhdGVHdWFyZCgpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5kZXRlcm1pbmF0ZUZvcm1Nb2RlKCk7XG4gICAgICB0aGlzLm9uRm9ybUluaXRTdHJlYW0uZW1pdCh0cnVlKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIC8qXG4gICAqIElubmVyIG1ldGhvZHNcbiAgICovXG5cbiAgX3NldENvbXBvbmVudHNFZGl0YWJsZShzdGF0ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IGFueSA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZvckVhY2goY29tcEtleSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBLZXldO1xuICAgICAgY29tcG9uZW50LmlzUmVhZE9ubHkgPSAhc3RhdGU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb3JtIG9wZXJhdGlvbiBtb2RlLlxuICAgKiBAcGFyYW0gbW9kZSBUaGUgbW9kZSB0byBiZSBlc3RhYmxpc2hlZFxuICAgKi9cbiAgc2V0Rm9ybU1vZGUobW9kZTogbnVtYmVyKSB7XG4gICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMOlxuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICBpZiAodGhpcy5fZm9ybVRvb2xiYXIpIHtcbiAgICAgICAgICB0aGlzLl9mb3JtVG9vbGJhci5zZXRJbml0aWFsTW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSk7XG4gICAgICAgIHRoaXMub25Gb3JtTW9kZUNoYW5nZS5lbWl0KHRoaXMubW9kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5TRVJUOlxuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICBpZiAodGhpcy5fZm9ybVRvb2xiYXIpIHtcbiAgICAgICAgICB0aGlzLl9mb3JtVG9vbGJhci5zZXRJbnNlcnRNb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICAgICAgdGhpcy5fc2V0Q29tcG9uZW50c0VkaXRhYmxlKHRydWUpO1xuICAgICAgICB0aGlzLm9uRm9ybU1vZGVDaGFuZ2UuZW1pdCh0aGlzLm1vZGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURTpcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1Ub29sYmFyKSB7XG4gICAgICAgICAgdGhpcy5fZm9ybVRvb2xiYXIuc2V0RWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodHJ1ZSk7XG4gICAgICAgIHRoaXMub25Gb3JtTW9kZUNoYW5nZS5lbWl0KHRoaXMubW9kZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgX3NldERhdGEoZGF0YSkge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGlmIChkYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdbT0Zvcm1Db21wb25lbnRdIEZvcm0gZGF0YSBoYXMgbW9yZSB0aGFuIGEgc2luZ2xlIHJlY29yZC4gU3RvcmluZyBlbXB0eSBkYXRhJyk7XG4gICAgICB9XG4gICAgICBjb25zdCBjdXJyZW50RGF0YSA9IGRhdGEubGVuZ3RoID09PSAxID8gZGF0YVswXSA6IHt9O1xuICAgICAgdGhpcy5fdXBkYXRlRm9ybURhdGEodGhpcy50b0Zvcm1WYWx1ZURhdGEoY3VycmVudERhdGEpKTtcbiAgICAgIHRoaXMuX2VtaXREYXRhKGN1cnJlbnREYXRhKTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHRoaXMudG9Gb3JtVmFsdWVEYXRhKGRhdGEpKTtcbiAgICAgIHRoaXMuX2VtaXREYXRhKGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0Zvcm0gaGFzIHJlY2VpdmVkIG5vdCBzdXBwb3J0ZWQgc2VydmljZSBkYXRhLiBTdXBwb3J0ZWQgZGF0YSBhcmUgQXJyYXkgb3IgT2JqZWN0Jyk7XG4gICAgICB0aGlzLl91cGRhdGVGb3JtRGF0YSh7fSk7XG4gICAgfVxuICB9XG5cbiAgX2VtaXREYXRhKGRhdGEpIHtcbiAgICB0aGlzLm9uRGF0YUxvYWRlZC5lbWl0KGRhdGEpO1xuICB9XG5cbiAgX2JhY2tBY3Rpb24oKSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5uYXZpZ2F0ZUJhY2soKTtcbiAgfVxuXG4gIF9jbG9zZURldGFpbEFjdGlvbihvcHRpb25zPzogYW55KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5jbG9zZURldGFpbEFjdGlvbihvcHRpb25zKTtcbiAgfVxuXG4gIF9zdGF5SW5SZWNvcmRBZnRlckluc2VydChpbnNlcnRlZEtleXM6IG9iamVjdCkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3RheUluUmVjb3JkQWZ0ZXJJbnNlcnQoaW5zZXJ0ZWRLZXlzKTtcbiAgfVxuXG4gIF9yZWxvYWRBY3Rpb24odXNlRmlsdGVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBsZXQgZmlsdGVyID0ge307XG4gICAgaWYgKHVzZUZpbHRlcikge1xuICAgICAgZmlsdGVyID0gdGhpcy5nZXRDdXJyZW50S2V5c1ZhbHVlcygpO1xuICAgIH1cbiAgICB0aGlzLnF1ZXJ5RGF0YShmaWx0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byAnaW5zZXJ0JyBtb2RlXG4gICAqL1xuICBfZ29JbnNlcnRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdvSW5zZXJ0TW9kZShvcHRpb25zKTtcbiAgfVxuXG4gIF9jbGVhckZvcm1BZnRlckluc2VydCgpIHtcbiAgICB0aGlzLmNsZWFyRGF0YSgpO1xuICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBpbnNlcnQgYWN0aW9uLlxuICAgKi9cbiAgX2luc2VydEFjdGlvbigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmZvcm1Hcm91cC5jb250cm9scykuZm9yRWFjaCgoY29udHJvbCkgPT4ge1xuICAgICAgdGhpcy5mb3JtR3JvdXAuY29udHJvbHNbY29udHJvbF0ubWFya0FzVG91Y2hlZCgpO1xuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLmZvcm1Hcm91cC52YWxpZCkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsICdNRVNTQUdFUy5GT1JNX1ZBTElEQVRJT05fRVJST1InKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb0luc2VydCgpO1xuICAgIGNvbnN0IHNxbFR5cGVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzU1FMVHlwZXMoKTtcbiAgICB0aGlzLmluc2VydERhdGEodmFsdWVzLCBzcWxUeXBlcykuc3Vic2NyaWJlKHJlc3AgPT4ge1xuICAgICAgc2VsZi5wb3N0Q29ycmVjdEluc2VydChyZXNwKTtcbiAgICAgIHNlbGYuZm9ybUNhY2hlLnNldENhY2hlU25hcHNob3QoKTtcbiAgICAgIHNlbGYubWFya0Zvcm1MYXlvdXRNYW5hZ2VyVG9VcGRhdGUoKTtcbiAgICAgIGlmIChzZWxmLmFmdGVySW5zZXJ0TW9kZSA9PT0gJ2RldGFpbCcpIHtcbiAgICAgICAgc2VsZi5fc3RheUluUmVjb3JkQWZ0ZXJJbnNlcnQocmVzcCk7XG4gICAgICB9IGVsc2UgaWYgKHNlbGYuYWZ0ZXJJbnNlcnRNb2RlID09PSAnbmV3Jykge1xuICAgICAgICB0aGlzLl9jbGVhckZvcm1BZnRlckluc2VydCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5fY2xvc2VEZXRhaWxBY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9LCBlcnJvciA9PiB7XG4gICAgICBzZWxmLnBvc3RJbmNvcnJlY3RJbnNlcnQoZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byAnZWRpdCcgbW9kZVxuICAgKi9cbiAgX2dvRWRpdE1vZGUob3B0aW9ucz86IGFueSkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uZ29FZGl0TW9kZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zICdlZGl0JyBhY3Rpb25cbiAgICovXG4gIF9lZGl0QWN0aW9uKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKS5mb3JFYWNoKFxuICAgICAgKGNvbnRyb2wpID0+IHtcbiAgICAgICAgdGhpcy5mb3JtR3JvdXAuY29udHJvbHNbY29udHJvbF0ubWFya0FzVG91Y2hlZCgpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBpZiAoIXRoaXMuZm9ybUdyb3VwLnZhbGlkKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkZPUk1fVkFMSURBVElPTl9FUlJPUicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHJldHJpZXZpbmcga2V5cy4uLlxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZ2V0S2V5c1ZhbHVlcygpO1xuXG4gICAgLy8gcmV0cmlldmluZyB2YWx1ZXMgdG8gdXBkYXRlLi4uXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9VcGRhdGUoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk7XG5cbiAgICBpZiAoT2JqZWN0LmtleXModmFsdWVzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIE5vdGhpbmcgdG8gdXBkYXRlXG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0lORk8nLCAnTUVTU0FHRVMuRk9STV9OT1RISU5HX1RPX1VQREFURV9JTkZPJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaW52b2tlIHVwZGF0ZSBtZXRob2QuLi5cbiAgICB0aGlzLnVwZGF0ZURhdGEoZmlsdGVyLCB2YWx1ZXMsIHNxbFR5cGVzKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICBzZWxmLnBvc3RDb3JyZWN0VXBkYXRlKHJlc3ApO1xuICAgICAgc2VsZi5mb3JtQ2FjaGUuc2V0Q2FjaGVTbmFwc2hvdCgpO1xuICAgICAgc2VsZi5tYXJrRm9ybUxheW91dE1hbmFnZXJUb1VwZGF0ZSgpO1xuICAgICAgaWYgKHNlbGYuc3RheUluUmVjb3JkQWZ0ZXJFZGl0KSB7XG4gICAgICAgIHNlbGYuX3JlbG9hZEFjdGlvbih0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX2Nsb3NlRGV0YWlsQWN0aW9uKCk7XG4gICAgICB9XG4gICAgfSwgZXJyb3IgPT4ge1xuICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0VXBkYXRlKGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyAnZGVsZXRlJyBhY3Rpb25cbiAgICovXG4gIF9kZWxldGVBY3Rpb24oKSB7XG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5nZXRLZXlzVmFsdWVzKCk7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlRGF0YShmaWx0ZXIpO1xuICB9XG5cbiAgLypcbiAgVXRpbGl0eSBtZXRob2RzXG4gICovXG5cbiAgcXVlcnlEYXRhKGZpbHRlcikge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignT0Zvcm1Db21wb25lbnQ6IG5vIHNlcnZpY2UgY29uZmlndXJlZCEgYWJvcnRpbmcgcXVlcnknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChmaWx0ZXIpIHx8IE9iamVjdC5rZXlzKGZpbHRlcikubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ09Gb3JtQ29tcG9uZW50OiBubyBmaWx0ZXIgY29uZmlndXJlZCEgYWJvcnRpbmcgcXVlcnknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5mb3JtQ2FjaGUucmVzdGFydENhY2hlKCk7XG4gICAgdGhpcy5jbGVhckNvbXBvbmVudHNPbGRWYWx1ZSgpO1xuICAgIGlmICh0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBhdiA9IHRoaXMuZ2V0QXR0cmlidXRlc1RvUXVlcnkoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk7XG4gICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbiA9IHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5xdWVyeU1ldGhvZF0oZmlsdGVyLCBhdiwgdGhpcy5lbnRpdHksIHNxbFR5cGVzKVxuICAgICAgLnN1YnNjcmliZSgocmVzcDogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgdGhpcy5fc2V0RGF0YShyZXNwLmRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHt9KTtcbiAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX1FVRVJZJyk7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRVJST1I6ICcgKyByZXNwLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9LCBlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHt9KTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uKSkge1xuICAgICAgICAgIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uKGVycik7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIGVyci5zdGF0dXNUZXh0KSB7XG4gICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVyci5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX1FVRVJZJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1RvUXVlcnkoKTogQXJyYXk8YW55PiB7XG4gICAgbGV0IGF0dHJpYnV0ZXM6IEFycmF5PGFueT4gPSBbXTtcbiAgICAvLyBhZGQgZm9ybSBrZXlzLi4uXG4gICAgaWYgKHRoaXMua2V5c0FycmF5ICYmIHRoaXMua2V5c0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGF0dHJpYnV0ZXMucHVzaCguLi50aGlzLmtleXNBcnJheSk7XG4gICAgfVxuICAgIGNvbnN0IGNvbXBvbmVudHM6IGFueSA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIC8vIGFkZCBvbmx5IHRoZSBmaWVsZHMgY29udGFpbmVkIGludG8gdGhlIGZvcm0uLi5cbiAgICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZXMuaW5kZXhPZihpdGVtKSA8IDAgJiZcbiAgICAgICAgY29tcG9uZW50c1tpdGVtXS5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkgJiYgY29tcG9uZW50c1tpdGVtXS5pc0F1dG9tYXRpY0JpbmRpbmcoKSkge1xuICAgICAgICBhdHRyaWJ1dGVzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgZmllbGRzIHN0b3JlZCBpbnRvIGZvcm0gY2FjaGUuLi5cbiAgICBjb25zdCBkYXRhQ2FjaGUgPSB0aGlzLmZvcm1DYWNoZS5nZXREYXRhQ2FjaGUoKTtcbiAgICBpZiAoZGF0YUNhY2hlKSB7XG4gICAgICBPYmplY3Qua2V5cyhkYXRhQ2FjaGUpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGlmIChpdGVtICE9PSB1bmRlZmluZWQgJiYgYXR0cmlidXRlcy5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzLmNvbmNhdCh0aGlzLmNvbHNBcnJheS5maWx0ZXIoY29sID0+IGF0dHJpYnV0ZXMuaW5kZXhPZihjb2wpIDwgMCkpO1xuICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICB9XG5cbiAgaW5zZXJ0RGF0YSh2YWx1ZXMsIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5pbnNlcnRNZXRob2RdKHZhbHVlcywgdGhpcy5lbnRpdHksIHNxbFR5cGVzKS5zdWJzY3JpYmUoXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3AuZGF0YSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihyZXNwLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9JbnNlcnQoKTogb2JqZWN0IHtcbiAgICBjb25zdCBhdHRyVmFsdWVzID0ge307XG4gICAgaWYgKHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXMpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24oYXR0clZhbHVlcywgdGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlcyk7XG4gICAgfVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGF0dHJWYWx1ZXMsIHRoaXMuZ2V0UmVnaXN0ZXJlZEZpZWxkc1ZhbHVlcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBzcWwgdHlwZXMgZnJvbSB0aGUgZm9ybSBjb21wb25lbnRzIGFuZCB0aGUgZm9ybSBrZXlzXG4gICAqL1xuICBwdWJsaWMgZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk6IG9iamVjdCB7XG4gICAgY29uc3QgdHlwZXM6IG9iamVjdCA9IHt9O1xuICAgIC8vIEFkZCBmb3JtIGtleXMgc3FsIHR5cGVzXG4gICAgdGhpcy5rZXlzU3FsVHlwZXNBcnJheS5mb3JFYWNoKChrc3QsIGkpID0+IHR5cGVzW3RoaXMua2V5c0FycmF5W2ldXSA9IFNRTFR5cGVzLmdldFNRTFR5cGVWYWx1ZShrc3QpKTtcbiAgICAvLyBBZGQgZm9ybSBjb21wb25lbnRzIHNxbCB0eXBlc1xuICAgIGlmICh0aGlzLl9jb21wU1FMVHlwZXMgJiYgT2JqZWN0LmtleXModGhpcy5fY29tcFNRTFR5cGVzKS5sZW5ndGggPiAwKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHR5cGVzLCB0aGlzLl9jb21wU1FMVHlwZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZXM7XG4gIH1cblxuICB1cGRhdGVEYXRhKGZpbHRlciwgdmFsdWVzLCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbiA9IHRoaXMubG9hZCgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMudXBkYXRlTWV0aG9kXShmaWx0ZXIsIHZhbHVlcywgdGhpcy5lbnRpdHksIHNxbFR5cGVzKS5zdWJzY3JpYmUoXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3AuZGF0YSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihyZXNwLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9VcGRhdGUoKTogb2JqZWN0IHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjaGFuZ2VkQXR0cnMgPSB0aGlzLmZvcm1DYWNoZS5nZXRDaGFuZ2VkRm9ybUNvbnRyb2xzQXR0cigpO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKS5maWx0ZXIoY29udHJvbE5hbWUgPT5cbiAgICAgIHNlbGYuaWdub3JlRm9ybUNhY2hlS2V5cy5pbmRleE9mKGNvbnRyb2xOYW1lKSA9PT0gLTEgJiZcbiAgICAgIGNoYW5nZWRBdHRycy5pbmRleE9mKGNvbnRyb2xOYW1lKSAhPT0gLTFcbiAgICApLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSBzZWxmLmZvcm1Hcm91cC5jb250cm9sc1tpdGVtXTtcbiAgICAgIGlmIChjb250cm9sIGluc3RhbmNlb2YgT0Zvcm1Db250cm9sKSB7XG4gICAgICAgIHZhbHVlc1tpdGVtXSA9IGNvbnRyb2wuZ2V0VmFsdWUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlc1tpdGVtXSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWVzW2l0ZW1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWVzW2l0ZW1dID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgZGVsZXRlRGF0YShmaWx0ZXIpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgdGhpcy5jYW5EaXNjYXJkQ2hhbmdlcyA9IHRydWU7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMuZGVsZXRlTWV0aG9kXShmaWx0ZXIsIHRoaXMuZW50aXR5KS5zdWJzY3JpYmUoXG4gICAgICAgIHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBzZWxmLmZvcm1DYWNoZS5zZXRDYWNoZVNuYXBzaG90KCk7XG4gICAgICAgICAgICBzZWxmLm1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk7XG4gICAgICAgICAgICBzZWxmLnBvc3RDb3JyZWN0RGVsZXRlKHJlc3ApO1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwLmRhdGEpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0RGVsZXRlKHJlc3ApO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IocmVzcC5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICBzZWxmLnBvc3RJbmNvcnJlY3REZWxldGUoZXJyKTtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgdG9KU09ORGF0YShkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICBkYXRhID0ge307XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlRGF0YSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHZhbHVlRGF0YVtpdGVtXSA9IGRhdGFbaXRlbV0udmFsdWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlRGF0YTtcbiAgfVxuXG4gIHRvRm9ybVZhbHVlRGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEgJiYgVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBjb25zdCB2YWx1ZURhdGE6IEFycmF5PG9iamVjdD4gPSBbXTtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgZGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICB2YWx1ZURhdGEucHVzaChzZWxmLm9iamVjdFRvRm9ybVZhbHVlRGF0YShpdGVtKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWx1ZURhdGE7XG4gICAgfSBlbHNlIGlmIChkYXRhICYmIFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdFRvRm9ybVZhbHVlRGF0YShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEtleXNWYWx1ZXMoKSB7XG4gICAgY29uc3QgZmlsdGVyID0ge307XG4gICAgY29uc3QgY3VycmVudFJlY29yZCA9IHRoaXMuZm9ybURhdGE7XG4gICAgaWYgKCF0aGlzLmtleXNBcnJheSkge1xuICAgICAgcmV0dXJuIGZpbHRlcjtcbiAgICB9XG4gICAgdGhpcy5rZXlzQXJyYXkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRSZWNvcmRba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBjdXJyZW50RGF0YSA9IGN1cnJlbnRSZWNvcmRba2V5XTtcbiAgICAgICAgaWYgKGN1cnJlbnREYXRhIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgICAgIGN1cnJlbnREYXRhID0gY3VycmVudERhdGEudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZmlsdGVyW2tleV0gPSBjdXJyZW50RGF0YTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgaXNJblF1ZXJ5TW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuUVVFUlk7XG4gIH1cblxuICBpc0luSW5zZXJ0TW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5TRVJUO1xuICB9XG5cbiAgaXNJblVwZGF0ZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURTtcbiAgfVxuXG4gIGlzSW5Jbml0aWFsTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDtcbiAgfVxuXG4gIHNldFF1ZXJ5TW9kZSgpIHtcbiAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5RVUVSWSk7XG4gIH1cblxuICBzZXRJbnNlcnRNb2RlKCkge1xuICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOU0VSVCk7XG4gIH1cblxuICBzZXRVcGRhdGVNb2RlKCkge1xuICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURSk7XG4gIH1cblxuICBzZXRJbml0aWFsTW9kZSgpIHtcbiAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMKTtcbiAgfVxuXG4gIHJlZ2lzdGVyRHluYW1pY0Zvcm1Db21wb25lbnQoZHluYW1pY0Zvcm0pIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKGR5bmFtaWNGb3JtKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmR5bmFtaWNGb3JtU3Vic2NyaXB0aW9uID0gZHluYW1pY0Zvcm0ucmVuZGVyLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICBzZWxmLnJlZnJlc2hDb21wb25lbnRzRWRpdGFibGVTdGF0ZSgpO1xuICAgICAgICBpZiAoIXNlbGYuaXNJbkluc2VydE1vZGUoKSAmJiBzZWxmLnF1ZXJ5T25Jbml0KSB7XG4gICAgICAgICAgc2VsZi5fcmVsb2FkQWN0aW9uKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmZvcm1QYXJlbnRLZXlzVmFsdWVzKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoc2VsZi5mb3JtUGFyZW50S2V5c1ZhbHVlcykuZm9yRWFjaChwYXJlbnRLZXkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzZWxmLmZvcm1QYXJlbnRLZXlzVmFsdWVzW3BhcmVudEtleV07XG4gICAgICAgICAgICBjb25zdCBjb21wID0gc2VsZi5nZXRGaWVsZFJlZmVyZW5jZShwYXJlbnRLZXkpO1xuICAgICAgICAgICAgaWYgKFV0aWwuaXNGb3JtRGF0YUNvbXBvbmVudChjb21wKSAmJiBjb21wLmlzQXV0b21hdGljQmluZGluZygpKSB7XG4gICAgICAgICAgICAgIGNvbXAuc2V0VmFsdWUodmFsdWUsIHtcbiAgICAgICAgICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJEeW5hbWljRm9ybUNvbXBvbmVudChkeW5hbWljRm9ybSkge1xuICAgIGlmIChkeW5hbWljRm9ybSAmJiB0aGlzLmR5bmFtaWNGb3JtU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmR5bmFtaWNGb3JtU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UmVxdWlyZWRDb21wb25lbnRzKCk6IG9iamVjdCB7XG4gICAgY29uc3QgcmVxdWlyZWRDb21wb250ZW50czogb2JqZWN0ID0ge307XG4gICAgY29uc3QgY29tcG9uZW50cyA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbXAgPSBjb21wb25lbnRzW2tleV07XG4gICAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgICBpZiAoKGNvbXAgYXMgYW55KS5pc1JlcXVpcmVkICYmIGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVxdWlyZWRDb21wb250ZW50c1thdHRyXSA9IGNvbXA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVxdWlyZWRDb21wb250ZW50cztcbiAgfVxuXG4gIGdldCBsYXlvdXREaXJlY3Rpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0RGlyZWN0aW9uO1xuICB9XG5cbiAgc2V0IGxheW91dERpcmVjdGlvbih2YWw6IHN0cmluZykge1xuICAgIGNvbnN0IHBhcnNlZFZhbCA9ICh2YWwgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5fbGF5b3V0RGlyZWN0aW9uID0gWydyb3cnLCAnY29sdW1uJywgJ3Jvdy1yZXZlcnNlJywgJ2NvbHVtbi1yZXZlcnNlJ10uaW5kZXhPZihwYXJzZWRWYWwpICE9PSAtMSA/IHBhcnNlZFZhbCA6IE9Gb3JtQ29tcG9uZW50LkRFRkFVTFRfTEFZT1VUX0RJUkVDVElPTjtcbiAgfVxuXG4gIGdldCBsYXlvdXRBbGlnbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9sYXlvdXRBbGlnbjtcbiAgfVxuXG4gIHNldCBsYXlvdXRBbGlnbih2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2xheW91dEFsaWduID0gdmFsO1xuICB9XG5cbiAgZ2V0IHNob3dGbG9hdGluZ1Rvb2xiYXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0hlYWRlciAmJiB0aGlzLmhlYWRlck1vZGUgPT09ICdmbG9hdGluZyc7XG4gIH1cblxuICBnZXQgc2hvd05vdEZsb2F0aW5nVG9vbGJhcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93SGVhZGVyICYmIHRoaXMuaGVhZGVyTW9kZSAhPT0gJ2Zsb2F0aW5nJztcbiAgfVxuXG4gIGlzRWRpdGFibGVEZXRhaWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdGFibGVEZXRhaWw7XG4gIH1cblxuICBpc0luaXRpYWxTdGF0ZUNoYW5nZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybUNhY2hlLmlzSW5pdGlhbFN0YXRlQ2hhbmdlZCgpO1xuICB9XG5cbiAgX3VuZG9MYXN0Q2hhbmdlQWN0aW9uKCkge1xuICAgIHRoaXMuZm9ybUNhY2hlLnVuZG9MYXN0Q2hhbmdlKCk7XG4gIH1cblxuICBnZXQgaXNDYWNoZVN0YWNrRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybUNhY2hlLmlzQ2FjaGVTdGFja0VtcHR5O1xuICB9XG5cbiAgdW5kb0tleWJvYXJkUHJlc3NlZCgpIHtcbiAgICB0aGlzLmZvcm1DYWNoZS51bmRvTGFzdENoYW5nZSh7XG4gICAgICBrZXlib2FyZEV2ZW50OiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBnZXRGb3JtVG9vbGJhcigpOiBPRm9ybVRvb2xiYXJDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9mb3JtVG9vbGJhcjtcbiAgfVxuXG4gIGdldEZvcm1NYW5hZ2VyKCk6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb24uZm9ybUxheW91dE1hbmFnZXI7XG4gIH1cblxuICBnZXRGb3JtTmF2aWdhdGlvbigpOiBPRm9ybU5hdmlnYXRpb25DbGFzcyB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb247XG4gIH1cblxuICBnZXRGb3JtQ2FjaGUoKTogT0Zvcm1DYWNoZUNsYXNzIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtQ2FjaGU7XG4gIH1cblxuICBnZXRVcmxQYXJhbShhcmc6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmdldEZvcm1OYXZpZ2F0aW9uKCkuZ2V0VXJsUGFyYW1zKClbYXJnXTtcbiAgfVxuXG4gIGdldFVybFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGb3JtTmF2aWdhdGlvbigpLmdldFVybFBhcmFtcygpO1xuICB9XG5cbiAgc2V0VXJsUGFyYW1zQW5kUmVsb2FkKHZhbDogb2JqZWN0KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zZXRVcmxQYXJhbXModmFsKTtcbiAgICB0aGlzLl9yZWxvYWRBY3Rpb24odHJ1ZSk7XG4gIH1cblxuICBnZXRSZWdpc3RlcmVkRmllbGRzVmFsdWVzKCkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHt9O1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IElGb3JtRGF0YUNvbXBvbmVudEhhc2ggPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjb21wb25lbnRzS2V5cyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZpbHRlcihrZXkgPT4gc2VsZi5pZ25vcmVGb3JtQ2FjaGVLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpO1xuICAgIGNvbXBvbmVudHNLZXlzLmZvckVhY2goY29tcEtleSA9PiB7XG4gICAgICBjb25zdCBjb21wOiBJRm9ybURhdGFDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBLZXldO1xuICAgICAgdmFsdWVzW2NvbXBLZXldID0gY29tcC5nZXRWYWx1ZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRyXG4gICAqL1xuICBnZXRGaWVsZFZhbHVlKGF0dHI6IHN0cmluZyk6IGFueSB7XG4gICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICBjb25zdCBjb21wID0gdGhpcy5nZXRGaWVsZFJlZmVyZW5jZShhdHRyKTtcbiAgICBpZiAoY29tcCkge1xuICAgICAgdmFsdWUgPSBjb21wLmdldFZhbHVlKCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIHZhbHVlcyBvZiBlYWNoIGF0dHJpYnV0ZVxuICAgKiBAcGFyYW0gYXR0cnNcbiAgICovXG4gIGdldEZpZWxkVmFsdWVzKGF0dHJzOiBzdHJpbmdbXSk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgYXJyID0ge307XG4gICAgYXR0cnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBhcnJba2V5XSA9IHNlbGYuZ2V0RmllbGRWYWx1ZShrZXkpO1xuICAgIH0pO1xuICAgIHJldHVybiBhcnI7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBpbiB0aGUgZm9ybS5cbiAgICogQHBhcmFtIGF0dHIgYXR0cmlidXRlIG9mIGNvbnRyb2xcbiAgICogQHBhcmFtIHZhbHVlIHZhbHVlXG4gICAqL1xuICBzZXRGaWVsZFZhbHVlKGF0dHI6IHN0cmluZywgdmFsdWU6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpIHtcbiAgICBjb25zdCBjb21wID0gdGhpcy5nZXRGaWVsZFJlZmVyZW5jZShhdHRyKTtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29tcC5zZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIGVhY2ggY29udHJvbCBpbiB0aGUgZm9ybS5cbiAgICogQHBhcmFtIHZhbHVlc1xuICAgKi9cbiAgc2V0RmllbGRWYWx1ZXModmFsdWVzOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdGhpcy5zZXRGaWVsZFZhbHVlKGtleSwgdmFsdWVzW2tleV0sIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciB0aGUgdmFsdWUgb2YgZWFjaCBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRyXG4gICAqL1xuICBjbGVhckZpZWxkVmFsdWUoYXR0cjogc3RyaW5nLCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbXAgPSB0aGlzLmdldEZpZWxkUmVmZXJlbmNlKGF0dHIpO1xuICAgIGlmIChjb21wKSB7XG4gICAgICBjb21wLmNsZWFyVmFsdWUob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSB2YWx1ZSBvZiBlYWNoIGNvbnRyb2wgaW4gdGhlIGZvcm1cbiAgICogQHBhcmFtIGF0dHJzXG4gICAqL1xuICBjbGVhckZpZWxkVmFsdWVzKGF0dHJzOiBzdHJpbmdbXSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBhdHRycy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHNlbGYuY2xlYXJGaWVsZFZhbHVlKGtleSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSByZWZlcmVuY2Ugb2YgdGhlIGNvbnRyb2wgaW4gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSBhdHRyXG4gICAqL1xuICBnZXRGaWVsZFJlZmVyZW5jZShhdHRyOiBzdHJpbmcpOiBJRm9ybURhdGFDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzW2F0dHJdO1xuICB9XG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIHJlZmVyZW5jZSBvZiBlYWNoIGNvbnRyb2wgaW4gdGhlIGZvcm1cbiAgICogQHBhcmFtIGF0dHJzXG4gICAqL1xuICBnZXRGaWVsZFJlZmVyZW5jZXMoYXR0cnM6IHN0cmluZ1tdKTogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCB7XG4gICAgY29uc3QgYXJyOiBJRm9ybURhdGFDb21wb25lbnRIYXNoID0ge307XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgYXR0cnMuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgYXJyW2tleV0gPSBzZWxmLmdldEZpZWxkUmVmZXJlbmNlKGtleSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIGdldEZvcm1Db21wb25lbnRQZXJtaXNzaW9ucyhhdHRyOiBzdHJpbmcpOiBPUGVybWlzc2lvbnMge1xuICAgIGxldCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgcGVybWlzc2lvbnMgPSAodGhpcy5wZXJtaXNzaW9ucy5jb21wb25lbnRzIHx8IFtdKS5maW5kKGNvbXAgPT4gY29tcC5hdHRyID09PSBhdHRyKTtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9XG5cbiAgZ2V0QWN0aW9uc1Blcm1pc3Npb25zKCk6IE9QZXJtaXNzaW9uc1tdIHtcbiAgICBsZXQgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9uc1tdO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnBlcm1pc3Npb25zKSkge1xuICAgICAgcGVybWlzc2lvbnMgPSAodGhpcy5wZXJtaXNzaW9ucy5hY3Rpb25zIHx8IFtdKTtcbiAgICB9XG4gICAgcmV0dXJuIHBlcm1pc3Npb25zO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVybWluYXRlRm9ybU1vZGUoKTogdm9pZCB7XG4gICAgY29uc3QgdXJsU2VnbWVudHMgPSB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldFVybFNlZ21lbnRzKCk7XG4gICAgaWYgKHVybFNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHNlZ21lbnQgPSB1cmxTZWdtZW50c1t1cmxTZWdtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgIHRoaXMuZGV0ZXJtaW5hdGVNb2RlRnJvbVVybFNlZ21lbnQoc2VnbWVudCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmFjdFJvdXRlLnBhcmVudCkge1xuICAgICAgdGhpcy5hY3RSb3V0ZS5wYXJlbnQudXJsLnN1YnNjcmliZShzZWdtZW50cyA9PiB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5kZXRlcm1pbmF0ZU1vZGVGcm9tVXJsU2VnbWVudChzZWdtZW50KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMKTtcbiAgICB9XG4gICAgLy8gc3RheUluUmVjb3JkQWZ0ZXJFZGl0IGlzIHRydWUgaWYgZm9ybSBoYXMgZWRpdGFibGUgZGV0YWlsID0gdHJ1ZVxuICAgIHRoaXMuc3RheUluUmVjb3JkQWZ0ZXJFZGl0ID0gdGhpcy5zdGF5SW5SZWNvcmRBZnRlckVkaXQgfHwgdGhpcy5pc0VkaXRhYmxlRGV0YWlsKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGV0ZXJtaW5hdGVNb2RlRnJvbVVybFNlZ21lbnQoc2VnbWVudDogVXJsU2VnbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IF9wYXRoID0gc2VnbWVudCA/IHNlZ21lbnQucGF0aCA6ICcnO1xuICAgIGlmICh0aGlzLmlzSW5zZXJ0TW9kZVBhdGgoX3BhdGgpKSB7XG4gICAgICB0aGlzLnNldEluc2VydE1vZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNVcGRhdGVNb2RlUGF0aChfcGF0aCkpIHtcbiAgICAgIHRoaXMuc2V0VXBkYXRlTW9kZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldEluaXRpYWxNb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF91cGRhdGVGb3JtRGF0YShuZXdGb3JtRGF0YTogb2JqZWN0KTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gbmV3Rm9ybURhdGE7XG4gICAgICBjb25zdCBjb21wb25lbnRzID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tcCA9IGNvbXBvbmVudHNba2V5XTtcbiAgICAgICAgICBpZiAoVXRpbC5pc0Zvcm1EYXRhQ29tcG9uZW50KGNvbXApKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBpZiAoY29tcC5pc0F1dG9tYXRpY0JpbmRpbmcoKSkge1xuICAgICAgICAgICAgICAgIGNvbXAuZGF0YSA9IHNlbGYuZ2V0RGF0YVZhbHVlKGtleSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYuaW5pdGlhbGl6ZUZpZWxkcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxpemVGaWVsZHMoKTogdm9pZCB7XG4gICAgT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goY29udHJvbCA9PiB7XG4gICAgICB0aGlzLmZvcm1Hcm91cC5jb250cm9sc1tjb250cm9sXS5tYXJrQXNQcmlzdGluZSgpO1xuICAgIH0pO1xuICAgIHRoaXMuZm9ybUNhY2hlLnJlZ2lzdGVyQ2FjaGUoKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnVwZGF0ZU5hdmlnYXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhckNvbXBvbmVudHNPbGRWYWx1ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBjb21wb25lbnRzOiBJRm9ybURhdGFDb21wb25lbnRIYXNoID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgY29tcG9uZW50c0tleXMgPSBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5maWx0ZXIoa2V5ID0+IHNlbGYuaWdub3JlRm9ybUNhY2hlS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKTtcbiAgICBjb21wb25lbnRzS2V5cy5mb3JFYWNoKGNvbXBLZXkgPT4ge1xuICAgICAgY29uc3QgY29tcDogSUZvcm1EYXRhQ29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wS2V5XTtcbiAgICAgIChjb21wIGFzIGFueSkub2xkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICBjb21wLmdldEZvcm1Db250cm9sKCkuc2V0VmFsdWUodW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0Q29ycmVjdEluc2VydChyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLklOU0VSVEVEJywgeyBpY29uOiAnY2hlY2tfY2lyY2xlJyB9KTtcbiAgICB0aGlzLm9uSW5zZXJ0LmVtaXQocmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0SW5jb3JyZWN0SW5zZXJ0KHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zaG93RXJyb3IoJ2luc2VydCcsIHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdEluY29ycmVjdERlbGV0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2hvd0Vycm9yKCdkZWxldGUnLCByZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RJbmNvcnJlY3RVcGRhdGUocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dFcnJvcigndXBkYXRlJywgcmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0Q29ycmVjdFVwZGF0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLlNBVkVEJywgeyBpY29uOiAnY2hlY2tfY2lyY2xlJyB9KTtcbiAgICB0aGlzLm9uVXBkYXRlLmVtaXQocmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0Q29ycmVjdERlbGV0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLkRFTEVURUQnLCB7IGljb246ICdjaGVja19jaXJjbGUnIH0pO1xuICAgIHRoaXMub25EZWxldGUuZW1pdChyZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGZvcm1MYXlvdXRNYW5hZ2VyID0gdGhpcy5nZXRGb3JtTWFuYWdlcigpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChmb3JtTGF5b3V0TWFuYWdlcikpIHtcbiAgICAgIGZvcm1MYXlvdXRNYW5hZ2VyLm1hcmtGb3JVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBvYmplY3RUb0Zvcm1WYWx1ZURhdGEoZGF0YTogb2JqZWN0ID0ge30pOiBvYmplY3Qge1xuICAgIGNvbnN0IHZhbHVlRGF0YSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHZhbHVlRGF0YVtpdGVtXSA9IG5ldyBPRm9ybVZhbHVlKGRhdGFbaXRlbV0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZURhdGE7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q3VycmVudEtleXNWYWx1ZXMoKTogb2JqZWN0IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtTmF2aWdhdGlvbi5nZXRDdXJyZW50S2V5c1ZhbHVlcygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hDb21wb25lbnRzRWRpdGFibGVTdGF0ZSgpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDpcbiAgICAgICAgdGhpcy5fc2V0Q29tcG9uZW50c0VkaXRhYmxlKHRoaXMuaXNFZGl0YWJsZURldGFpbCgpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTlNFUlQ6XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5VUERBVEU6XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNJbnNlcnRNb2RlUGF0aChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuYXZEYXRhOiBPTmF2aWdhdGlvbkl0ZW0gPSB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmdldExhc3RJdGVtKCk7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKG5hdkRhdGEpICYmIHBhdGggPT09IG5hdkRhdGEuZ2V0SW5zZXJ0Rm9ybVJvdXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNVcGRhdGVNb2RlUGF0aChwYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBuYXZEYXRhOiBPTmF2aWdhdGlvbkl0ZW0gPSB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmdldFByZXZpb3VzUm91dGVEYXRhKCk7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKG5hdkRhdGEpICYmIHBhdGggPT09IG5hdkRhdGEuZ2V0RWRpdEZvcm1Sb3V0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzaG93RXJyb3Iob3BlcmF0aW9uOiBzdHJpbmcsIHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIHJlc3VsdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBtZXNzYWdlID0gJ01FU1NBR0VTLkVSUk9SX0RFTEVURSc7XG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlICd1cGRhdGUnOlxuICAgICAgICAgIG1lc3NhZ2UgPSAnTUVTU0FHRVMuRVJST1JfVVBEQVRFJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaW5zZXJ0JzpcbiAgICAgICAgICBtZXNzYWdlID0gJ01FU1NBR0VTLkVSUk9SX0lOU0VSVCc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==