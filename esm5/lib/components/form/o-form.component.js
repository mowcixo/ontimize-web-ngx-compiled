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
export var DEFAULT_INPUTS_O_FORM = [
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
export var DEFAULT_OUTPUTS_O_FORM = [
    'onDataLoaded',
    'beforeCloseDetail',
    'beforeGoEditMode',
    'onFormModeChange',
    'onInsert',
    'onUpdate',
    'onDelete'
];
var OFormComponent = (function () {
    function OFormComponent(router, actRoute, zone, cd, injector, elRef) {
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
        var self = this;
        this.reloadStream = combineLatest([
            self.onFormInitStream.asObservable(),
            self.formNavigation.navigationStream.asObservable()
        ]);
        this.reloadStreamSubscription = this.reloadStream.subscribe(function (valArr) {
            if (Util.isArray(valArr) && valArr.length === 2 && !self.isInInsertMode()) {
                var valArrValues = valArr[0] === true && valArr[1] === true;
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
    OFormComponent.Mode = function () {
        var m;
        (function (m) {
            m[m["QUERY"] = 0] = "QUERY";
            m[m["INSERT"] = 1] = "INSERT";
            m[m["UPDATE"] = 2] = "UPDATE";
            m[m["INITIAL"] = 3] = "INITIAL";
        })(m || (m = {}));
        return m;
    };
    OFormComponent.prototype.registerFormComponent = function (comp) {
        if (comp) {
            var attr = comp.getAttribute();
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
                    var val = this.formParentKeysValues[attr];
                    this._components[attr].setValue(val, {
                        emitModelToViewChange: false,
                        emitEvent: false
                    });
                }
                var cachedValue = this.formCache.getCachedValue(attr);
                if (Util.isDefined(cachedValue) && this.getDataValues() && this._components.hasOwnProperty(attr)) {
                    this._components[attr].setValue(cachedValue, {
                        emitModelToViewChange: false,
                        emitEvent: false
                    });
                }
            }
        }
    };
    OFormComponent.prototype.registerSQLTypeFormComponent = function (comp) {
        if (comp.repeatedAttr) {
            return;
        }
        if (comp) {
            var type = comp.getSQLType();
            var attr = comp.getAttribute();
            if (type !== SQLTypes.OTHER && attr && attr.length > 0 && this.ignoreFormCacheKeys.indexOf(attr) === -1) {
                this._compSQLTypes[attr] = type;
            }
        }
    };
    OFormComponent.prototype.registerFormControlComponent = function (comp) {
        if (comp.repeatedAttr) {
            return;
        }
        if (comp) {
            var attr = comp.getAttribute();
            if (attr && attr.length > 0) {
                var control = comp.getControl();
                if (control) {
                    this.formGroup.registerControl(attr, control);
                    if (!comp.isAutomaticRegistering()) {
                        this.ignoreFormCacheKeys.push(comp.getAttribute());
                    }
                }
            }
        }
    };
    OFormComponent.prototype.unregisterFormComponent = function (comp) {
        if (comp) {
            var attr = comp.getAttribute();
            if (attr && attr.length > 0 && this._components.hasOwnProperty(attr)) {
                delete this._components[attr];
            }
        }
    };
    OFormComponent.prototype.unregisterFormControlComponent = function (comp) {
        if (comp && comp.isAutomaticRegistering()) {
            var control = comp.getControl();
            var attr = comp.getAttribute();
            if (control && attr && attr.length > 0) {
                this.formGroup.removeControl(attr);
            }
        }
    };
    OFormComponent.prototype.unregisterSQLTypeFormComponent = function (comp) {
        if (comp) {
            var attr = comp.getAttribute();
            if (attr && attr.length > 0) {
                delete this._compSQLTypes[attr];
            }
        }
    };
    OFormComponent.prototype.registerToolbar = function (fToolbar) {
        if (fToolbar) {
            this._formToolbar = fToolbar;
            this._formToolbar.isDetail = this.isDetailForm;
        }
    };
    OFormComponent.prototype.getComponents = function () {
        return this._components;
    };
    OFormComponent.prototype.load = function () {
        var self = this;
        var zone = this.injector.get(NgZone);
        var loadObservable = new Observable(function (observer) {
            var timer = window.setTimeout(function () {
                observer.next(true);
            }, 250);
            return function () {
                window.clearTimeout(timer);
                zone.run(function () {
                    self.loadingSubject.next(false);
                });
            };
        });
        var subscription = loadObservable.subscribe(function (val) {
            zone.run(function () {
                self.loadingSubject.next(val);
            });
        });
        return subscription;
    };
    OFormComponent.prototype.getDataValue = function (attr) {
        if (this.isInInsertMode()) {
            var urlParams = this.formNavigation.getFilterFromUrlParams();
            var val = this.formGroup.value[attr] || urlParams[attr];
            return new OFormValue(val);
        }
        else if (this.isInInitialMode() && !this.isEditableDetail()) {
            var data = this.formData;
            if (data && data.hasOwnProperty(attr)) {
                return data[attr];
            }
        }
        else if (this.isInUpdateMode() || this.isEditableDetail()) {
            if (this.formData && Object.keys(this.formData).length > 0) {
                var val = this.formCache.getCachedValue(attr);
                if (this.formGroup.dirty && val) {
                    if (val instanceof OFormValue) {
                        return val;
                    }
                    return new OFormValue(val);
                }
                else {
                    var data = this.formData;
                    if (data && data.hasOwnProperty(attr)) {
                        return data[attr];
                    }
                }
            }
        }
        return new OFormValue();
    };
    OFormComponent.prototype.getDataValues = function () {
        return this.formData;
    };
    OFormComponent.prototype.clearData = function () {
        var filter = this.formNavigation.getFilterFromUrlParams();
        this.formGroup.reset({}, {
            emitEvent: false
        });
        this._setData(filter);
    };
    OFormComponent.prototype.canDeactivate = function () {
        if (!this.confirmExit) {
            return true;
        }
        var canDiscardChanges = this.canDiscardChanges;
        this.canDiscardChanges = false;
        return canDiscardChanges || this.showConfirmDiscardChanges();
    };
    OFormComponent.prototype.showConfirmDiscardChanges = function () {
        return this.formNavigation.showConfirmDiscardChanges();
    };
    OFormComponent.prototype.executeToolbarAction = function (action, options) {
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
    };
    OFormComponent.prototype.ngOnInit = function () {
        this.addDeactivateGuard();
        this.formGroup = new FormGroup({});
        this.formNavigation.initialize();
        this.initialize();
    };
    OFormComponent.prototype.addDeactivateGuard = function () {
        if (this.isInInitialMode() && !this.isEditableDetail()) {
            return;
        }
        if (!this.actRoute || !this.actRoute.routeConfig) {
            return;
        }
        this.deactivateGuard = this.injector.get(CanDeactivateFormGuard);
        this.deactivateGuard.setForm(this);
        var canDeactivateArray = (this.actRoute.routeConfig.canDeactivate || []);
        var previouslyAdded = false;
        for (var i = 0, len = canDeactivateArray.length; i < len; i++) {
            previouslyAdded = ((canDeactivateArray[i].hasOwnProperty('CLASSNAME') && canDeactivateArray[i].CLASSNAME) === OFormComponent.guardClassName);
            if (previouslyAdded) {
                break;
            }
        }
        if (!previouslyAdded) {
            canDeactivateArray.push(this.deactivateGuard.constructor);
            this.actRoute.routeConfig.canDeactivate = canDeactivateArray;
        }
    };
    OFormComponent.prototype.destroyDeactivateGuard = function () {
        try {
            if (!this.deactivateGuard || !this.actRoute || !this.actRoute.routeConfig || !this.actRoute.routeConfig.canDeactivate) {
                return;
            }
            this.deactivateGuard.setForm(undefined);
            for (var i = this.actRoute.routeConfig.canDeactivate.length - 1; i >= 0; i--) {
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
    };
    OFormComponent.prototype.hasDeactivateGuard = function () {
        return Util.isDefined(this.deactivateGuard);
    };
    OFormComponent.prototype.initialize = function () {
        var self = this;
        if (this.headeractions === 'all') {
            this.headeractions = 'R;I;U;D';
        }
        this.keysArray = Util.parseArray(this.keys, true);
        this.colsArray = Util.parseArray(this.columns, true);
        var pkArray = Util.parseArray(this.parentKeys);
        this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
        this.keysSqlTypesArray = Util.parseArray(this.keysSqlTypes);
        this.configureService();
        this.formNavigation.subscribeToQueryParams();
        this.formNavigation.subscribeToUrlParams();
        this.formNavigation.subscribeToUrl();
        this.formNavigation.subscribeToCacheChanges(this.formCache.onCacheEmptyStateChanges);
        if (this.navigationService) {
            this.navigationService.onVisibleChange(function (visible) {
                self.showHeader = visible;
            });
        }
        this.mode = OFormComponent.Mode().INITIAL;
        this.permissions = this.permissionsService.getFormPermissions(this.oattr, this.actRoute);
        if (typeof this.queryFallbackFunction !== 'function') {
            this.queryFallbackFunction = undefined;
        }
    };
    OFormComponent.prototype.reinitialize = function (options) {
        if (options && Object.keys(options).length) {
            var clonedOpts = Object.assign({}, options);
            for (var prop in clonedOpts) {
                if (clonedOpts.hasOwnProperty(prop)) {
                    this[prop] = clonedOpts[prop];
                }
            }
            this.destroy();
            this.initialize();
        }
    };
    OFormComponent.prototype.configureService = function () {
        var loadingService = OntimizeService;
        if (this.serviceType) {
            loadingService = this.serviceType;
        }
        try {
            this.dataService = this.injector.get(loadingService);
            if (Util.isDataService(this.dataService)) {
                var serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
                if (this.entity) {
                    serviceCfg.entity = this.entity;
                }
                this.dataService.configureService(serviceCfg);
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    OFormComponent.prototype.ngOnDestroy = function () {
        this.destroy();
    };
    OFormComponent.prototype.destroy = function () {
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
    };
    OFormComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.determinateFormMode();
            _this.onFormInitStream.emit(true);
        }, 0);
    };
    OFormComponent.prototype._setComponentsEditable = function (state) {
        var components = this.getComponents();
        Object.keys(components).forEach(function (compKey) {
            var component = components[compKey];
            component.isReadOnly = !state;
        });
    };
    OFormComponent.prototype.setFormMode = function (mode) {
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
    };
    OFormComponent.prototype._setData = function (data) {
        if (Util.isArray(data)) {
            if (data.length > 1) {
                console.warn('[OFormComponent] Form data has more than a single record. Storing empty data');
            }
            var currentData = data.length === 1 ? data[0] : {};
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
    };
    OFormComponent.prototype._emitData = function (data) {
        this.onDataLoaded.emit(data);
    };
    OFormComponent.prototype._backAction = function () {
        this.formNavigation.navigateBack();
    };
    OFormComponent.prototype._closeDetailAction = function (options) {
        this.formNavigation.closeDetailAction(options);
    };
    OFormComponent.prototype._stayInRecordAfterInsert = function (insertedKeys) {
        this.formNavigation.stayInRecordAfterInsert(insertedKeys);
    };
    OFormComponent.prototype._reloadAction = function (useFilter) {
        if (useFilter === void 0) { useFilter = false; }
        var filter = {};
        if (useFilter) {
            filter = this.getCurrentKeysValues();
        }
        this.queryData(filter);
    };
    OFormComponent.prototype._goInsertMode = function (options) {
        this.formNavigation.goInsertMode(options);
    };
    OFormComponent.prototype._clearFormAfterInsert = function () {
        this.clearData();
        this._setComponentsEditable(true);
    };
    OFormComponent.prototype._insertAction = function () {
        var _this = this;
        Object.keys(this.formGroup.controls).forEach(function (control) {
            _this.formGroup.controls[control].markAsTouched();
        });
        if (!this.formGroup.valid) {
            this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
            return;
        }
        var self = this;
        var values = this.getAttributesValuesToInsert();
        var sqlTypes = this.getAttributesSQLTypes();
        this.insertData(values, sqlTypes).subscribe(function (resp) {
            self.postCorrectInsert(resp);
            self.formCache.setCacheSnapshot();
            self.markFormLayoutManagerToUpdate();
            if (self.afterInsertMode === 'detail') {
                self._stayInRecordAfterInsert(resp);
            }
            else if (self.afterInsertMode === 'new') {
                _this._clearFormAfterInsert();
            }
            else {
                self._closeDetailAction();
            }
        }, function (error) {
            self.postIncorrectInsert(error);
        });
    };
    OFormComponent.prototype._goEditMode = function (options) {
        this.formNavigation.goEditMode();
    };
    OFormComponent.prototype._editAction = function () {
        var _this = this;
        Object.keys(this.formGroup.controls).forEach(function (control) {
            _this.formGroup.controls[control].markAsTouched();
        });
        if (!this.formGroup.valid) {
            this.dialogService.alert('ERROR', 'MESSAGES.FORM_VALIDATION_ERROR');
            return;
        }
        var self = this;
        var filter = this.getKeysValues();
        var values = this.getAttributesValuesToUpdate();
        var sqlTypes = this.getAttributesSQLTypes();
        if (Object.keys(values).length === 0) {
            this.dialogService.alert('INFO', 'MESSAGES.FORM_NOTHING_TO_UPDATE_INFO');
            return;
        }
        this.updateData(filter, values, sqlTypes).subscribe(function (resp) {
            self.postCorrectUpdate(resp);
            self.formCache.setCacheSnapshot();
            self.markFormLayoutManagerToUpdate();
            if (self.stayInRecordAfterEdit) {
                self._reloadAction(true);
            }
            else {
                self._closeDetailAction();
            }
        }, function (error) {
            self.postIncorrectUpdate(error);
        });
    };
    OFormComponent.prototype._deleteAction = function () {
        var filter = this.getKeysValues();
        return this.deleteData(filter);
    };
    OFormComponent.prototype.queryData = function (filter) {
        var _this = this;
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
        var av = this.getAttributesToQuery();
        var sqlTypes = this.getAttributesSQLTypes();
        this.querySubscription = this.dataService[this.queryMethod](filter, av, this.entity, sqlTypes)
            .subscribe(function (resp) {
            if (resp.isSuccessful()) {
                _this._setData(resp.data);
            }
            else {
                _this._updateFormData({});
                _this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
                console.error('ERROR: ' + resp.message);
            }
            _this.loaderSubscription.unsubscribe();
        }, function (err) {
            console.error(err);
            _this._updateFormData({});
            if (Util.isDefined(_this.queryFallbackFunction)) {
                _this.queryFallbackFunction(err);
            }
            else if (err && err.statusText) {
                _this.dialogService.alert('ERROR', err.statusText);
            }
            else {
                _this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
            }
            _this.loaderSubscription.unsubscribe();
        });
    };
    OFormComponent.prototype.getAttributesToQuery = function () {
        var attributes = [];
        if (this.keysArray && this.keysArray.length > 0) {
            attributes.push.apply(attributes, tslib_1.__spread(this.keysArray));
        }
        var components = this.getComponents();
        Object.keys(components).forEach(function (item) {
            if (attributes.indexOf(item) < 0 &&
                components[item].isAutomaticRegistering() && components[item].isAutomaticBinding()) {
                attributes.push(item);
            }
        });
        var dataCache = this.formCache.getDataCache();
        if (dataCache) {
            Object.keys(dataCache).forEach(function (item) {
                if (item !== undefined && attributes.indexOf(item) === -1) {
                    attributes.push(item);
                }
            });
        }
        attributes = attributes.concat(this.colsArray.filter(function (col) { return attributes.indexOf(col) < 0; }));
        return attributes;
    };
    OFormComponent.prototype.insertData = function (values, sqlTypes) {
        var _this = this;
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        var self = this;
        var observable = new Observable(function (observer) {
            _this.dataService[_this.insertMethod](values, _this.entity, sqlTypes).subscribe(function (resp) {
                if (resp.isSuccessful()) {
                    observer.next(resp.data);
                    observer.complete();
                }
                else {
                    observer.error(resp.message);
                }
                self.loaderSubscription.unsubscribe();
            }, function (err) {
                observer.error(err);
                self.loaderSubscription.unsubscribe();
            });
        });
        return observable;
    };
    OFormComponent.prototype.getAttributesValuesToInsert = function () {
        var attrValues = {};
        if (this.formParentKeysValues) {
            Object.assign(attrValues, this.formParentKeysValues);
        }
        return Object.assign(attrValues, this.getRegisteredFieldsValues());
    };
    OFormComponent.prototype.getAttributesSQLTypes = function () {
        var _this = this;
        var types = {};
        this.keysSqlTypesArray.forEach(function (kst, i) { return types[_this.keysArray[i]] = SQLTypes.getSQLTypeValue(kst); });
        if (this._compSQLTypes && Object.keys(this._compSQLTypes).length > 0) {
            Object.assign(types, this._compSQLTypes);
        }
        return types;
    };
    OFormComponent.prototype.updateData = function (filter, values, sqlTypes) {
        var _this = this;
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        var self = this;
        var observable = new Observable(function (observer) {
            _this.dataService[_this.updateMethod](filter, values, _this.entity, sqlTypes).subscribe(function (resp) {
                if (resp.isSuccessful()) {
                    observer.next(resp.data);
                    observer.complete();
                }
                else {
                    observer.error(resp.message);
                }
                self.loaderSubscription.unsubscribe();
            }, function (err) {
                observer.error(err);
                self.loaderSubscription.unsubscribe();
            });
        });
        return observable;
    };
    OFormComponent.prototype.getAttributesValuesToUpdate = function () {
        var values = {};
        var self = this;
        var changedAttrs = this.formCache.getChangedFormControlsAttr();
        Object.keys(this.formGroup.controls).filter(function (controlName) {
            return self.ignoreFormCacheKeys.indexOf(controlName) === -1 &&
                changedAttrs.indexOf(controlName) !== -1;
        }).forEach(function (item) {
            var control = self.formGroup.controls[item];
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
    };
    OFormComponent.prototype.deleteData = function (filter) {
        var _this = this;
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        this.loaderSubscription = this.load();
        var self = this;
        var observable = new Observable(function (observer) {
            _this.canDiscardChanges = true;
            _this.dataService[_this.deleteMethod](filter, _this.entity).subscribe(function (resp) {
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
            }, function (err) {
                self.postIncorrectDelete(err);
                observer.error(err);
                self.loaderSubscription.unsubscribe();
            });
        });
        return observable;
    };
    OFormComponent.prototype.toJSONData = function (data) {
        if (!data) {
            data = {};
        }
        var valueData = {};
        Object.keys(data).forEach(function (item) {
            valueData[item] = data[item].value;
        });
        return valueData;
    };
    OFormComponent.prototype.toFormValueData = function (data) {
        if (data && Util.isArray(data)) {
            var valueData_1 = [];
            var self_1 = this;
            data.forEach(function (item) {
                valueData_1.push(self_1.objectToFormValueData(item));
            });
            return valueData_1;
        }
        else if (data && Util.isObject(data)) {
            return this.objectToFormValueData(data);
        }
        return undefined;
    };
    OFormComponent.prototype.getKeysValues = function () {
        var filter = {};
        var currentRecord = this.formData;
        if (!this.keysArray) {
            return filter;
        }
        this.keysArray.forEach(function (key) {
            if (currentRecord[key] !== undefined) {
                var currentData = currentRecord[key];
                if (currentData instanceof OFormValue) {
                    currentData = currentData.value;
                }
                filter[key] = currentData;
            }
        });
        return filter;
    };
    OFormComponent.prototype.isInQueryMode = function () {
        return this.mode === OFormComponent.Mode().QUERY;
    };
    OFormComponent.prototype.isInInsertMode = function () {
        return this.mode === OFormComponent.Mode().INSERT;
    };
    OFormComponent.prototype.isInUpdateMode = function () {
        return this.mode === OFormComponent.Mode().UPDATE;
    };
    OFormComponent.prototype.isInInitialMode = function () {
        return this.mode === OFormComponent.Mode().INITIAL;
    };
    OFormComponent.prototype.setQueryMode = function () {
        this.setFormMode(OFormComponent.Mode().QUERY);
    };
    OFormComponent.prototype.setInsertMode = function () {
        this.setFormMode(OFormComponent.Mode().INSERT);
    };
    OFormComponent.prototype.setUpdateMode = function () {
        this.setFormMode(OFormComponent.Mode().UPDATE);
    };
    OFormComponent.prototype.setInitialMode = function () {
        this.setFormMode(OFormComponent.Mode().INITIAL);
    };
    OFormComponent.prototype.registerDynamicFormComponent = function (dynamicForm) {
        if (!Util.isDefined(dynamicForm)) {
            return;
        }
        var self = this;
        this.dynamicFormSubscription = dynamicForm.render.subscribe(function (res) {
            if (res) {
                self.refreshComponentsEditableState();
                if (!self.isInInsertMode() && self.queryOnInit) {
                    self._reloadAction(true);
                }
                if (self.formParentKeysValues) {
                    Object.keys(self.formParentKeysValues).forEach(function (parentKey) {
                        var value = self.formParentKeysValues[parentKey];
                        var comp = self.getFieldReference(parentKey);
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
    };
    OFormComponent.prototype.unregisterDynamicFormComponent = function (dynamicForm) {
        if (dynamicForm && this.dynamicFormSubscription) {
            this.dynamicFormSubscription.unsubscribe();
        }
    };
    OFormComponent.prototype.getRequiredComponents = function () {
        var requiredCompontents = {};
        var components = this.getComponents();
        if (components) {
            Object.keys(components).forEach(function (key) {
                var comp = components[key];
                var attr = comp.getAttribute();
                if (comp.isRequired && attr && attr.length > 0) {
                    requiredCompontents[attr] = comp;
                }
            });
        }
        return requiredCompontents;
    };
    Object.defineProperty(OFormComponent.prototype, "layoutDirection", {
        get: function () {
            return this._layoutDirection;
        },
        set: function (val) {
            var parsedVal = (val || '').toLowerCase();
            this._layoutDirection = ['row', 'column', 'row-reverse', 'column-reverse'].indexOf(parsedVal) !== -1 ? parsedVal : OFormComponent.DEFAULT_LAYOUT_DIRECTION;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormComponent.prototype, "layoutAlign", {
        get: function () {
            return this._layoutAlign;
        },
        set: function (val) {
            this._layoutAlign = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormComponent.prototype, "showFloatingToolbar", {
        get: function () {
            return this.showHeader && this.headerMode === 'floating';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormComponent.prototype, "showNotFloatingToolbar", {
        get: function () {
            return this.showHeader && this.headerMode !== 'floating';
        },
        enumerable: true,
        configurable: true
    });
    OFormComponent.prototype.isEditableDetail = function () {
        return this.editableDetail;
    };
    OFormComponent.prototype.isInitialStateChanged = function () {
        return this.formCache.isInitialStateChanged();
    };
    OFormComponent.prototype._undoLastChangeAction = function () {
        this.formCache.undoLastChange();
    };
    Object.defineProperty(OFormComponent.prototype, "isCacheStackEmpty", {
        get: function () {
            return this.formCache.isCacheStackEmpty;
        },
        enumerable: true,
        configurable: true
    });
    OFormComponent.prototype.undoKeyboardPressed = function () {
        this.formCache.undoLastChange({
            keyboardEvent: true
        });
    };
    OFormComponent.prototype.getFormToolbar = function () {
        return this._formToolbar;
    };
    OFormComponent.prototype.getFormManager = function () {
        return this.formNavigation.formLayoutManager;
    };
    OFormComponent.prototype.getFormNavigation = function () {
        return this.formNavigation;
    };
    OFormComponent.prototype.getFormCache = function () {
        return this.formCache;
    };
    OFormComponent.prototype.getUrlParam = function (arg) {
        return this.getFormNavigation().getUrlParams()[arg];
    };
    OFormComponent.prototype.getUrlParams = function () {
        return this.getFormNavigation().getUrlParams();
    };
    OFormComponent.prototype.setUrlParamsAndReload = function (val) {
        this.formNavigation.setUrlParams(val);
        this._reloadAction(true);
    };
    OFormComponent.prototype.getRegisteredFieldsValues = function () {
        var values = {};
        var components = this.getComponents();
        var self = this;
        var componentsKeys = Object.keys(components).filter(function (key) { return self.ignoreFormCacheKeys.indexOf(key) === -1; });
        componentsKeys.forEach(function (compKey) {
            var comp = components[compKey];
            values[compKey] = comp.getValue();
        });
        return values;
    };
    OFormComponent.prototype.getFieldValue = function (attr) {
        var value = null;
        var comp = this.getFieldReference(attr);
        if (comp) {
            value = comp.getValue();
        }
        return value;
    };
    OFormComponent.prototype.getFieldValues = function (attrs) {
        var self = this;
        var arr = {};
        attrs.forEach(function (key) {
            arr[key] = self.getFieldValue(key);
        });
        return arr;
    };
    OFormComponent.prototype.setFieldValue = function (attr, value, options) {
        var comp = this.getFieldReference(attr);
        if (comp) {
            comp.setValue(value, options);
        }
    };
    OFormComponent.prototype.setFieldValues = function (values, options) {
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                this.setFieldValue(key, values[key], options);
            }
        }
    };
    OFormComponent.prototype.clearFieldValue = function (attr, options) {
        var comp = this.getFieldReference(attr);
        if (comp) {
            comp.clearValue(options);
        }
    };
    OFormComponent.prototype.clearFieldValues = function (attrs, options) {
        var self = this;
        attrs.forEach(function (key) {
            self.clearFieldValue(key, options);
        });
    };
    OFormComponent.prototype.getFieldReference = function (attr) {
        return this._components[attr];
    };
    OFormComponent.prototype.getFieldReferences = function (attrs) {
        var arr = {};
        var self = this;
        attrs.forEach(function (key, index) {
            arr[key] = self.getFieldReference(key);
        });
        return arr;
    };
    OFormComponent.prototype.getFormComponentPermissions = function (attr) {
        var permissions;
        if (Util.isDefined(this.permissions)) {
            permissions = (this.permissions.components || []).find(function (comp) { return comp.attr === attr; });
        }
        return permissions;
    };
    OFormComponent.prototype.getActionsPermissions = function () {
        var permissions;
        if (Util.isDefined(this.permissions)) {
            permissions = (this.permissions.actions || []);
        }
        return permissions;
    };
    OFormComponent.prototype.determinateFormMode = function () {
        var _this = this;
        var urlSegments = this.formNavigation.getUrlSegments();
        if (urlSegments.length > 0) {
            var segment = urlSegments[urlSegments.length - 1];
            this.determinateModeFromUrlSegment(segment);
        }
        else if (this.actRoute.parent) {
            this.actRoute.parent.url.subscribe(function (segments) {
                var segment = segments[segments.length - 1];
                _this.determinateModeFromUrlSegment(segment);
            });
        }
        else {
            this.setFormMode(OFormComponent.Mode().INITIAL);
        }
        this.stayInRecordAfterEdit = this.stayInRecordAfterEdit || this.isEditableDetail();
    };
    OFormComponent.prototype.determinateModeFromUrlSegment = function (segment) {
        var _path = segment ? segment.path : '';
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
    };
    OFormComponent.prototype._updateFormData = function (newFormData) {
        var _this = this;
        var self = this;
        this.zone.run(function () {
            _this.formData = newFormData;
            var components = _this.getComponents();
            if (components) {
                Object.keys(components).forEach(function (key) {
                    var comp = components[key];
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
    };
    OFormComponent.prototype.initializeFields = function () {
        var _this = this;
        Object.keys(this.formGroup.controls).forEach(function (control) {
            _this.formGroup.controls[control].markAsPristine();
        });
        this.formCache.registerCache();
        this.formNavigation.updateNavigation();
    };
    OFormComponent.prototype.clearComponentsOldValue = function () {
        var components = this.getComponents();
        var self = this;
        var componentsKeys = Object.keys(components).filter(function (key) { return self.ignoreFormCacheKeys.indexOf(key) === -1; });
        componentsKeys.forEach(function (compKey) {
            var comp = components[compKey];
            comp.oldValue = undefined;
            comp.getFormControl().setValue(undefined);
        });
    };
    OFormComponent.prototype.postCorrectInsert = function (result) {
        this.snackBarService.open('MESSAGES.INSERTED', { icon: 'check_circle' });
        this.onInsert.emit(result);
    };
    OFormComponent.prototype.postIncorrectInsert = function (result) {
        this.showError('insert', result);
    };
    OFormComponent.prototype.postIncorrectDelete = function (result) {
        this.showError('delete', result);
    };
    OFormComponent.prototype.postIncorrectUpdate = function (result) {
        this.showError('update', result);
    };
    OFormComponent.prototype.postCorrectUpdate = function (result) {
        this.snackBarService.open('MESSAGES.SAVED', { icon: 'check_circle' });
        this.onUpdate.emit(result);
    };
    OFormComponent.prototype.postCorrectDelete = function (result) {
        this.snackBarService.open('MESSAGES.DELETED', { icon: 'check_circle' });
        this.onDelete.emit(result);
    };
    OFormComponent.prototype.markFormLayoutManagerToUpdate = function () {
        var formLayoutManager = this.getFormManager();
        if (Util.isDefined(formLayoutManager)) {
            formLayoutManager.markForUpdate = true;
        }
    };
    OFormComponent.prototype.objectToFormValueData = function (data) {
        if (data === void 0) { data = {}; }
        var valueData = {};
        Object.keys(data).forEach(function (item) {
            valueData[item] = new OFormValue(data[item]);
        });
        return valueData;
    };
    OFormComponent.prototype.getCurrentKeysValues = function () {
        return this.formNavigation.getCurrentKeysValues();
    };
    OFormComponent.prototype.refreshComponentsEditableState = function () {
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
    };
    OFormComponent.prototype.isInsertModePath = function (path) {
        var navData = this.navigationService.getLastItem();
        return Util.isDefined(navData) && path === navData.getInsertFormRoute();
    };
    OFormComponent.prototype.isUpdateModePath = function (path) {
        var navData = this.navigationService.getPreviousRouteData();
        return Util.isDefined(navData) && path === navData.getEditFormRoute();
    };
    OFormComponent.prototype.showError = function (operation, result) {
        if (result && typeof result !== 'object') {
            this.dialogService.alert('ERROR', result);
        }
        else {
            var message = 'MESSAGES.ERROR_DELETE';
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
    };
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
    OFormComponent.ctorParameters = function () { return [
        { type: Router },
        { type: ActivatedRoute },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: Injector },
        { type: ElementRef }
    ]; };
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
    return OFormComponent;
}());
export { OFormComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9mb3JtL28tZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUNSLE1BQU0sRUFHTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBYyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFaEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBTWxFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sbUNBQW1DLENBQUM7QUFDdkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUtsRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFB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R3pDO1FBREMsY0FBYyxFQUFFOztzREFDVTtJQUUzQjtRQURDLGNBQWMsRUFBRTs7Z0VBQ3FCO0lBR3RDO1FBREMsY0FBYyxFQUFFOzs2REFDa0I7SUFFbkM7UUFEQyxjQUFjLEVBQUU7OytEQUNtQjtJQUVwQztRQURDLGNBQWMsRUFBRTs7dURBQ1c7SUE4MEM5QixxQkFBQztDQUFBLEFBeDRDRCxJQXc0Q0M7U0ExM0NZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIsIFVybFNlZ21lbnQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IElGb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZvcm1EYXRhVHlwZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLXR5cGUtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UsIE9OYXZpZ2F0aW9uSXRlbSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT0Zvcm1Jbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLWZvcm0taW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9Gb3JtUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLWZvcm0tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS1jb250YWluZXIvby1mb3JtLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1Db250cm9sIH0gZnJvbSAnLi4vaW5wdXQvby1mb3JtLWNvbnRyb2wuY2xhc3MnO1xuaW1wb3J0IHsgT0Zvcm1DYWNoZUNsYXNzIH0gZnJvbSAnLi9jYWNoZS9vLWZvcm0uY2FjaGUuY2xhc3MnO1xuaW1wb3J0IHsgQ2FuQ29tcG9uZW50RGVhY3RpdmF0ZSwgQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCB9IGZyb20gJy4vZ3VhcmRzL28tZm9ybS1jYW4tZGVhY3RpdmF0ZS5ndWFyZCc7XG5pbXBvcnQgeyBPRm9ybU5hdmlnYXRpb25DbGFzcyB9IGZyb20gJy4vbmF2aWdhdGlvbi9vLWZvcm0ubmF2aWdhdGlvbi5jbGFzcyc7XG5pbXBvcnQgeyBPRm9ybVZhbHVlIH0gZnJvbSAnLi9PRm9ybVZhbHVlJztcbmltcG9ydCB7IE9Gb3JtVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vdG9vbGJhci9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQnO1xuXG5pbnRlcmZhY2UgSUZvcm1EYXRhQ29tcG9uZW50SGFzaCB7XG4gIFthdHRyOiBzdHJpbmddOiBJRm9ybURhdGFDb21wb25lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk0gPSBbXG4gIC8vIHNob3ctaGVhZGVyIFtib29sZWFuXTogdmlzaWJpbGl0eSBvZiBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6IHllcy5cbiAgJ3Nob3dIZWFkZXI6IHNob3ctaGVhZGVyJyxcblxuICAvLyBoZWFkZXItbW9kZSBbc3RyaW5nXVsgbm9uZSB8IGZsb2F0aW5nIF06IHBhaW50aW5nIG1vZGUgb2YgZm9ybSB0b29sYmFyLiBEZWZhdWx0OiAnZmxvYXRpbmcnXG4gICdoZWFkZXJNb2RlOiBoZWFkZXItbW9kZScsXG5cbiAgLy8gaGVhZGVyLXBvc2l0aW9uIFsgdG9wIHwgYm90dG9tIF06IHBvc2l0aW9uIG9mIHRoZSBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6ICd0b3AnXG4gICdoZWFkZXJQb3NpdGlvbjogaGVhZGVyLXBvc2l0aW9uJyxcblxuICAvLyBsYWJlbC1oZWFkZXIgW3N0cmluZ106IGRpc3BsYXlhYmxlIHRleHQgb24gZm9ybSB0b29sYmFyLiBEZWZhdWx0OiAnJy5cbiAgJ2xhYmVsaGVhZGVyOiBsYWJlbC1oZWFkZXInLFxuXG4gIC8vIGxhYmVsLWhlYWRlci1hbGlnbiBbc3RyaW5nXVtzdGFydCB8IGNlbnRlciB8IGVuZF06IGFsaWdubWVudCBvZiBmb3JtIHRvb2xiYXIgdGV4dC4gRGVmYXVsdDogJ2NlbnRlcidcbiAgJ2xhYmVsSGVhZGVyQWxpZ246IGxhYmVsLWhlYWRlci1hbGlnbicsXG5cbiAgLy8gaGVhZGVyLWFjdGlvbnMgW3N0cmluZ106IGF2YWlsYWJsZSBhY3Rpb24gYnV0dG9ucyBvbiBmb3JtIHRvb2xiYXIgb2Ygc3RhbmRhcmQgQ1JVRCBvcGVyYXRpb25zLCBzZXBhcmF0ZWQgYnkgJzsnLiBBdmFpbGFibGUgb3B0aW9ucyBhcmUgUjtJO1U7RCAoUmVmcmVzaCwgSW5zZXJ0LCBVcGRhdGUsIERlbGV0ZSkuIERlZmF1bHQ6IFI7STtVO0RcbiAgJ2hlYWRlcmFjdGlvbnM6IGhlYWRlci1hY3Rpb25zJyxcblxuICAvLyBzaG93LWhlYWRlci1hY3Rpb25zLXRleHQgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93IHRleHQgb2YgZm9ybSB0b29sYmFyIGJ1dHRvbnMuIERlZmF1bHQgeWVzXG4gICdzaG93SGVhZGVyQWN0aW9uc1RleHQ6IHNob3ctaGVhZGVyLWFjdGlvbnMtdGV4dCcsXG5cbiAgLy8gZW50aXR5IFtzdHJpbmddOiBlbnRpdHkgb2YgdGhlIHNlcnZpY2UuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnZW50aXR5JyxcblxuICAvLyBrZXlzIFtzdHJpbmddOiBlbnRpdHkga2V5cywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdrZXlzJyxcblxuICAvLyBjb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBlbnRpdHksIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnY29sdW1ucycsXG5cbiAgLy8gc2VydmljZSBbc3RyaW5nXTogSkVFIHNlcnZpY2UgcGF0aC4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzZXJ2aWNlJyxcblxuICAvLyBzdGF5LWluLXJlY29yZC1hZnRlci1lZGl0IFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogc2hvd3MgZWRpdCBmb3JtIGFmdGVyIGVkaXQgYSByZWNvcmQuIERlZmF1bHQ6IGZhbHNlO1xuICAnc3RheUluUmVjb3JkQWZ0ZXJFZGl0OiBzdGF5LWluLXJlY29yZC1hZnRlci1lZGl0JyxcblxuICAvLyBbc3RyaW5nXVtuZXcgfCBkZXRhaWxdOiBzaG93cyByZXNldGVkIGZvcm0gYWZ0ZXIgaW5zZXJ0IGEgbmV3IHJlY29yZCAobmV3KSBvciBzaG93cyB0aGUgaW5zZXJ0ZWQgcmVjb3JkIGFmdGVyIChkZXRhaWwpXG4gICdhZnRlckluc2VydE1vZGU6IGFmdGVyLWluc2VydC1tb2RlJyxcblxuICAnc2VydmljZVR5cGUgOiBzZXJ2aWNlLXR5cGUnLFxuXG4gICdxdWVyeU9uSW5pdCA6IHF1ZXJ5LW9uLWluaXQnLFxuXG4gICdwYXJlbnRLZXlzOiBwYXJlbnQta2V5cycsXG5cbiAgLy8gcXVlcnktbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHF1ZXJpZXMuIERlZmF1bHQ6IHF1ZXJ5LlxuICAncXVlcnlNZXRob2Q6IHF1ZXJ5LW1ldGhvZCcsXG5cbiAgLy8gaW5zZXJ0LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBpbnNlcnRzLiBEZWZhdWx0OiBpbnNlcnQuXG4gICdpbnNlcnRNZXRob2Q6IGluc2VydC1tZXRob2QnLFxuXG4gIC8vIHVwZGF0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gdXBkYXRlcy4gRGVmYXVsdDogdXBkYXRlLlxuICAndXBkYXRlTWV0aG9kOiB1cGRhdGUtbWV0aG9kJyxcblxuICAvLyBkZWxldGUtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGRlbGV0aW9ucy4gRGVmYXVsdDogZGVsZXRlLlxuICAnZGVsZXRlTWV0aG9kOiBkZWxldGUtbWV0aG9kJyxcblxuICAvLyBsYXlvdXQtZGlyZWN0aW9uIFtzdHJpbmddW2NvbHVtbnxyb3ddOiBEZWZhdWx0OiBjb2x1bW5cbiAgJ2xheW91dERpcmVjdGlvbjogbGF5b3V0LWRpcmVjdGlvbicsXG5cbiAgLy8gZnhMYXlvdXRBbGlnbiB2YWx1ZS4gRGVmYXVsdDogJ3N0YXJ0IHN0YXJ0J1xuICAnbGF5b3V0QWxpZ246IGxheW91dC1hbGlnbicsXG5cbiAgLy8gZWRpdGFibGUtZGV0YWlsIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogRGVmYXVsdDogdHJ1ZTtcbiAgJ2VkaXRhYmxlRGV0YWlsOiBlZGl0YWJsZS1kZXRhaWwnLFxuXG4gIC8vIGtleXMtc3FsLXR5cGVzIFtzdHJpbmddOiBlbnRpdHkga2V5cyB0eXBlcywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdrZXlzU3FsVHlwZXM6IGtleXMtc3FsLXR5cGVzJyxcblxuICAvLyB1bmRvLWJ1dHRvbiBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluY2x1ZGUgdW5kbyBidXR0b24gaW4gZm9ybS10b29sYmFyLiBEZWZhdWx0OiB0cnVlO1xuICAndW5kb0J1dHRvbjogdW5kby1idXR0b24nLFxuXG4gIC8vIHNob3ctaGVhZGVyLW5hdmlnYXRpb24gW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBJbmNsdWRlIG5hdmlnYXRpb25zIGJ1dHRvbnMgaW4gZm9ybS10b29sYmFyLiBEZWZhdWx0OiBmYWxzZTtcbiAgJ3Nob3dIZWFkZXJOYXZpZ2F0aW9uOiBzaG93LWhlYWRlci1uYXZpZ2F0aW9uJyxcblxuICAvLyBhdHRyXG4gICdvYXR0cjphdHRyJyxcblxuICAnaW5jbHVkZUJyZWFkY3J1bWI6IGluY2x1ZGUtYnJlYWRjcnVtYicsXG5cbiAgJ2RldGVjdENoYW5nZXNPbkJsdXI6IGRldGVjdC1jaGFuZ2VzLW9uLWJsdXInLFxuXG4gICdjb25maXJtRXhpdDogY29uZmlybS1leGl0JyxcblxuICAvLyBbZnVuY3Rpb25dOiBmdW5jdGlvbiB0byBleGVjdXRlIG9uIHF1ZXJ5IGVycm9yLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3F1ZXJ5RmFsbGJhY2tGdW5jdGlvbjogcXVlcnktZmFsbGJhY2stZnVuY3Rpb24nXG4gIC8vICxcblxuICAvLyAnaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogaW5zZXJ0LWZhbGxiYWNrLWZ1bmN0aW9uJyxcblxuICAvLyAndXBkYXRlRmFsbGJhY2tGdW5jdGlvbjogdXBkYXRlLWZhbGxiYWNrLWZ1bmN0aW9uJyxcblxuICAvLyAnZGVsZXRlRmFsbGJhY2tGdW5jdGlvbjogZGVsZXRlLWZhbGxiYWNrLWZ1bmN0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0ZPUk0gPSBbXG4gICdvbkRhdGFMb2FkZWQnLFxuICAnYmVmb3JlQ2xvc2VEZXRhaWwnLFxuICAnYmVmb3JlR29FZGl0TW9kZScsXG4gICdvbkZvcm1Nb2RlQ2hhbmdlJyxcbiAgJ29uSW5zZXJ0JyxcbiAgJ29uVXBkYXRlJyxcbiAgJ29uRGVsZXRlJ1xuXTtcbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZm9ybScsXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplU2VydmljZVByb3ZpZGVyXG4gIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWZvcm0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWZvcm0uY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0ZPUk0sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0ZPUk0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybV0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPRm9ybUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBDYW5Db21wb25lbnREZWFjdGl2YXRlLCBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfTEFZT1VUX0RJUkVDVElPTiA9ICdjb2x1bW4nO1xuICBwdWJsaWMgc3RhdGljIGd1YXJkQ2xhc3NOYW1lID0gJ0NhbkRlYWN0aXZhdGVGb3JtR3VhcmQnO1xuXG4gIC8qIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0hlYWRlcjogYm9vbGVhbiA9IHRydWU7XG4gIGhlYWRlck1vZGU6IHN0cmluZyA9ICdmbG9hdGluZyc7XG4gIGhlYWRlclBvc2l0aW9uOiAndG9wJyB8ICdib3R0b20nID0gJ3RvcCc7XG4gIGxhYmVsaGVhZGVyOiBzdHJpbmcgPSAnJztcbiAgbGFiZWxIZWFkZXJBbGlnbjogc3RyaW5nID0gJ2NlbnRlcic7XG4gIGhlYWRlcmFjdGlvbnM6IHN0cmluZyA9ICcnO1xuICBzaG93SGVhZGVyQWN0aW9uc1RleHQ6IHN0cmluZyA9ICd5ZXMnO1xuICBlbnRpdHk6IHN0cmluZztcbiAga2V5czogc3RyaW5nID0gJyc7XG4gIGNvbHVtbnM6IHN0cmluZyA9ICcnO1xuICBzZXJ2aWNlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHN0YXlJblJlY29yZEFmdGVyRWRpdDogYm9vbGVhbiA9IGZhbHNlO1xuICBhZnRlckluc2VydE1vZGU6ICduZXcnIHwgJ2RldGFpbCcgPSBudWxsO1xuICBzZXJ2aWNlVHlwZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgcXVlcnlPbkluaXQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgcGFyZW50S2V5czogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlFVRVJZX01FVEhPRDtcbiAgcHJvdGVjdGVkIGluc2VydE1ldGhvZDogc3RyaW5nID0gQ29kZXMuSU5TRVJUX01FVEhPRDtcbiAgcHJvdGVjdGVkIHVwZGF0ZU1ldGhvZDogc3RyaW5nID0gQ29kZXMuVVBEQVRFX01FVEhPRDtcbiAgcHJvdGVjdGVkIGRlbGV0ZU1ldGhvZDogc3RyaW5nID0gQ29kZXMuREVMRVRFX01FVEhPRDtcbiAgcHJvdGVjdGVkIF9sYXlvdXREaXJlY3Rpb246IHN0cmluZyA9IE9Gb3JtQ29tcG9uZW50LkRFRkFVTFRfTEFZT1VUX0RJUkVDVElPTjtcbiAgcHJvdGVjdGVkIF9sYXlvdXRBbGlnbjogc3RyaW5nID0gJ3N0YXJ0IHN0cmV0Y2gnO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgZWRpdGFibGVEZXRhaWw6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQga2V5c1NxbFR5cGVzOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHVuZG9CdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93SGVhZGVyTmF2aWdhdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgb2F0dHI6IHN0cmluZyA9ICcnO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBpbmNsdWRlQnJlYWRjcnVtYjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBkZXRlY3RDaGFuZ2VzT25CbHVyOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgY29uZmlybUV4aXQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgcXVlcnlGYWxsYmFja0Z1bmN0aW9uOiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgLy8gcHVibGljIGluc2VydEZhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uO1xuICAvLyBwdWJsaWMgdXBkYXRlRmFsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb247XG4gIC8vIHB1YmxpYyBkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbjtcblxuICAvKiBlbmQgb2YgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIC8qcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgaXNEZXRhaWxGb3JtOiBib29sZWFuID0gZmFsc2U7XG4gIGtleXNBcnJheTogc3RyaW5nW10gPSBbXTtcbiAgY29sc0FycmF5OiBzdHJpbmdbXSA9IFtdO1xuICBkYXRhU2VydmljZTogYW55O1xuICBfcEtleXNFcXVpdiA9IHt9O1xuICBrZXlzU3FsVHlwZXNBcnJheTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAvKiBlbmQgb2YgcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICBmb3JtR3JvdXA6IEZvcm1Hcm91cDtcbiAgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICBiZWZvcmVDbG9zZURldGFpbDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgYmVmb3JlR29FZGl0TW9kZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgb25Gb3JtTW9kZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgcHVibGljIG9uSW5zZXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uVXBkYXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRGVsZXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcm90ZWN0ZWQgbG9hZGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGxvYWRpbmc6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBwdWJsaWMgZm9ybURhdGE6IG9iamVjdCA9IHt9O1xuICBwdWJsaWMgbmF2aWdhdGlvbkRhdGE6IEFycmF5PGFueT4gPSBbXTtcbiAgcHVibGljIGN1cnJlbnRJbmRleCA9IDA7XG4gIHB1YmxpYyBtb2RlOiBudW1iZXIgPSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDtcblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcbiAgcHJvdGVjdGVkIHNuYWNrQmFyU2VydmljZTogU25hY2tCYXJTZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBfZm9ybVRvb2xiYXI6IE9Gb3JtVG9vbGJhckNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgX2NvbXBvbmVudHM6IElGb3JtRGF0YUNvbXBvbmVudEhhc2ggPSB7fTtcbiAgcHJvdGVjdGVkIF9jb21wU1FMVHlwZXM6IG9iamVjdCA9IHt9O1xuXG4gIGZvcm1QYXJlbnRLZXlzVmFsdWVzOiBvYmplY3Q7XG5cbiAgcHVibGljIG9uRm9ybUluaXRTdHJlYW06IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgcHJvdGVjdGVkIHJlbG9hZFN0cmVhbTogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcm90ZWN0ZWQgcmVsb2FkU3RyZWFtU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBsb2FkZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGR5bmFtaWNGb3JtU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJvdGVjdGVkIGRlYWN0aXZhdGVHdWFyZDogQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZDtcbiAgcHJvdGVjdGVkIGZvcm1DYWNoZTogT0Zvcm1DYWNoZUNsYXNzO1xuICBwcm90ZWN0ZWQgZm9ybU5hdmlnYXRpb246IE9Gb3JtTmF2aWdhdGlvbkNsYXNzO1xuXG4gIHB1YmxpYyBmb3JtQ29udGFpbmVyOiBPRm9ybUNvbnRhaW5lckNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT0Zvcm1QZXJtaXNzaW9ucztcblxuICBAVmlld0NoaWxkKCdpbm5lckZvcm0nLCB7IHN0YXRpYzogZmFsc2UgfSkgaW5uZXJGb3JtRWw6IEVsZW1lbnRSZWY7XG5cbiAgaWdub3JlRm9ybUNhY2hlS2V5czogQXJyYXk8YW55PiA9IFtdO1xuICBjYW5EaXNjYXJkQ2hhbmdlczogYm9vbGVhbjtcblxuICBwdWJsaWMgc3RhdGljIE1vZGUoKTogYW55IHtcbiAgICBlbnVtIG0ge1xuICAgICAgUVVFUlksXG4gICAgICBJTlNFUlQsXG4gICAgICBVUERBVEUsXG4gICAgICBJTklUSUFMXG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmXG4gICkge1xuXG4gICAgdGhpcy5mb3JtQ2FjaGUgPSBuZXcgT0Zvcm1DYWNoZUNsYXNzKHRoaXMpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24gPSBuZXcgT0Zvcm1OYXZpZ2F0aW9uQ2xhc3ModGhpcy5pbmplY3RvciwgdGhpcywgdGhpcy5yb3V0ZXIsIHRoaXMuYWN0Um91dGUpO1xuXG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UgPSBpbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5yZWxvYWRTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFtcbiAgICAgIHNlbGYub25Gb3JtSW5pdFN0cmVhbS5hc09ic2VydmFibGUoKSxcbiAgICAgIHNlbGYuZm9ybU5hdmlnYXRpb24ubmF2aWdhdGlvblN0cmVhbS5hc09ic2VydmFibGUoKVxuICAgIF0pO1xuXG4gICAgdGhpcy5yZWxvYWRTdHJlYW1TdWJzY3JpcHRpb24gPSB0aGlzLnJlbG9hZFN0cmVhbS5zdWJzY3JpYmUodmFsQXJyID0+IHtcbiAgICAgIGlmIChVdGlsLmlzQXJyYXkodmFsQXJyKSAmJiB2YWxBcnIubGVuZ3RoID09PSAyICYmICFzZWxmLmlzSW5JbnNlcnRNb2RlKCkpIHtcbiAgICAgICAgY29uc3QgdmFsQXJyVmFsdWVzID0gdmFsQXJyWzBdID09PSB0cnVlICYmIHZhbEFyclsxXSA9PT0gdHJ1ZTtcbiAgICAgICAgaWYgKHNlbGYucXVlcnlPbkluaXQgJiYgdmFsQXJyVmFsdWVzKSB7XG4gICAgICAgICAgc2VsZi5fcmVsb2FkQWN0aW9uKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYuaW5pdGlhbGl6ZUZpZWxkcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5mb3JtQ29udGFpbmVyID0gaW5qZWN0b3IuZ2V0KE9Gb3JtQ29udGFpbmVyQ29tcG9uZW50KTtcbiAgICAgIHRoaXMuZm9ybUNvbnRhaW5lci5zZXRGb3JtKHRoaXMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vXG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJGb3JtQ29tcG9uZW50KGNvbXA6IGFueSkge1xuICAgIGlmIChjb21wKSB7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmIChhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIGlmICghY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICAgIGNvbXAucmVwZWF0ZWRBdHRyID0gdHJ1ZTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGVyZSBpcyBhbHJlYWR5IGEgY29tcG9uZW50IHJlZ2lzdGVyZWQgaW4gdGhlIGZvcm0gd2l0aCB0aGUgYXR0cjogJyArIGF0dHIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHNbYXR0cl0gPSBjb21wO1xuICAgICAgICAvLyBTZXR0aW5nIHBhcmVudCBrZXkgdmFsdWVzLi4uXG4gICAgICAgIGlmICh0aGlzLmZvcm1QYXJlbnRLZXlzVmFsdWVzICYmIHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXNbYXR0cl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXNbYXR0cl07XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50c1thdHRyXS5zZXRWYWx1ZSh2YWwsIHtcbiAgICAgICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UsXG4gICAgICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLypcbiAgICAgICAgKiBUT0RPLiBDaGVjayBpdCEhIVxuICAgICAgICAqIEVuIHVuIGZvcm11bGFyaW8gY29uIHRhYnMsIGN1YW5kbyBzZSBjYW1iaWEgZGUgdW5vIGEgb3Rybywgc2UgZGVzdHJ1eWVuIGxhcyB2aXN0YXNcbiAgICAgICAgKiBkZSBsb3MgY29tcG9uZW50ZXMgaGlqbyBkZWwgZm9ybXVsYXJpby5cbiAgICAgICAgKiBmb3JtRGF0YUNhY2hlIGNvbnRpZW5lIGxvcyB2YWxvcmVzIChvcmlnaW5hbGVzIMOzIGVkaXRhZG9zKSBkZSBsb3MgY2FtcG9zIGRlbCBmb3JtdWxhcmlvLlxuICAgICAgICAqIExhIGlkZWEgZXMgYXNpZ25hciBlc2UgdmFsb3IgYWwgY2FtcG8gY3VhbmRvIHNlIHJlZ2lzdHJlIGRlIG51ZXZvIChIYXkgcXVlIGFzZWd1cmFyIGVsIHByb2Nlc29cbiAgICAgICAgKiBwYXJhIHF1ZSBzw7NsbyBzZWEgY3VhbmRvIHNlIHJlZ2lzdHJhIGRlIG51ZXZvIDspIClcbiAgICAgICAgKi9cbiAgICAgICAgY29uc3QgY2FjaGVkVmFsdWUgPSB0aGlzLmZvcm1DYWNoZS5nZXRDYWNoZWRWYWx1ZShhdHRyKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNhY2hlZFZhbHVlKSAmJiB0aGlzLmdldERhdGFWYWx1ZXMoKSAmJiB0aGlzLl9jb21wb25lbnRzLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50c1thdHRyXS5zZXRWYWx1ZShjYWNoZWRWYWx1ZSwge1xuICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyU1FMVHlwZUZvcm1Db21wb25lbnQoY29tcDogSUZvcm1EYXRhVHlwZUNvbXBvbmVudCkge1xuICAgIGlmICgoY29tcCBhcyBhbnkpLnJlcGVhdGVkQXR0cikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY29tcCkge1xuICAgICAgY29uc3QgdHlwZSA9IGNvbXAuZ2V0U1FMVHlwZSgpO1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAodHlwZSAhPT0gU1FMVHlwZXMuT1RIRVIgJiYgYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDAgJiYgdGhpcy5pZ25vcmVGb3JtQ2FjaGVLZXlzLmluZGV4T2YoYXR0cikgPT09IC0xKSB7XG4gICAgICAgIC8vIFJpZ2h0IG5vdyBqdXN0IHN0b3JlIHZhbHVlcyBkaWZmZXJlbnQgb2YgJ09USEVSJ1xuICAgICAgICB0aGlzLl9jb21wU1FMVHlwZXNbYXR0cl0gPSB0eXBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyRm9ybUNvbnRyb2xDb21wb25lbnQoY29tcDogSUZvcm1EYXRhQ29tcG9uZW50KSB7XG4gICAgaWYgKChjb21wIGFzIGFueSkucmVwZWF0ZWRBdHRyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb21wKSB7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmIChhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb250cm9sOiBGb3JtQ29udHJvbCA9IGNvbXAuZ2V0Q29udHJvbCgpO1xuICAgICAgICBpZiAoY29udHJvbCkge1xuICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlZ2lzdGVyQ29udHJvbChhdHRyLCBjb250cm9sKTtcbiAgICAgICAgICBpZiAoIWNvbXAuaXNBdXRvbWF0aWNSZWdpc3RlcmluZygpKSB7XG4gICAgICAgICAgICB0aGlzLmlnbm9yZUZvcm1DYWNoZUtleXMucHVzaChjb21wLmdldEF0dHJpYnV0ZSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnJlZ2lzdGVyRm9ybUNvbXBvbmVudChjb21wOiBJQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwICYmIHRoaXMuX2NvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbXBvbmVudHNbYXR0cl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlckZvcm1Db250cm9sQ29tcG9uZW50KGNvbXA6IElGb3JtRGF0YUNvbXBvbmVudCkge1xuICAgIGlmIChjb21wICYmIGNvbXAuaXNBdXRvbWF0aWNSZWdpc3RlcmluZygpKSB7XG4gICAgICBjb25zdCBjb250cm9sOiBGb3JtQ29udHJvbCA9IGNvbXAuZ2V0Q29udHJvbCgpO1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAoY29udHJvbCAmJiBhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZW1vdmVDb250cm9sKGF0dHIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXJTUUxUeXBlRm9ybUNvbXBvbmVudChjb21wOiBJRm9ybURhdGFUeXBlQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb21wU1FMVHlwZXNbYXR0cl07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJUb29sYmFyKGZUb29sYmFyOiBPRm9ybVRvb2xiYXJDb21wb25lbnQpIHtcbiAgICBpZiAoZlRvb2xiYXIpIHtcbiAgICAgIHRoaXMuX2Zvcm1Ub29sYmFyID0gZlRvb2xiYXI7XG4gICAgICB0aGlzLl9mb3JtVG9vbGJhci5pc0RldGFpbCA9IHRoaXMuaXNEZXRhaWxGb3JtO1xuICAgIH1cbiAgfVxuXG4gIGdldENvbXBvbmVudHMoKTogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XG4gIH1cblxuICBwdWJsaWMgbG9hZCgpOiBhbnkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHpvbmUgPSB0aGlzLmluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIGNvbnN0IGxvYWRPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XG4gICAgICB9LCAyNTApO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHNlbGYubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH0pO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGxvYWRPYnNlcnZhYmxlLnN1YnNjcmliZSh2YWwgPT4ge1xuICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBzZWxmLmxvYWRpbmdTdWJqZWN0Lm5leHQodmFsIGFzIGJvb2xlYW4pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIGdldERhdGFWYWx1ZShhdHRyOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pc0luSW5zZXJ0TW9kZSgpKSB7XG4gICAgICBjb25zdCB1cmxQYXJhbXMgPSB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldEZpbHRlckZyb21VcmxQYXJhbXMoKTtcbiAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZm9ybUdyb3VwLnZhbHVlW2F0dHJdIHx8IHVybFBhcmFtc1thdHRyXTtcbiAgICAgIHJldHVybiBuZXcgT0Zvcm1WYWx1ZSh2YWwpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0luSW5pdGlhbE1vZGUoKSAmJiAhdGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZvcm1EYXRhO1xuICAgICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICByZXR1cm4gZGF0YVthdHRyXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNJblVwZGF0ZU1vZGUoKSB8fCB0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSkge1xuICAgICAgaWYgKHRoaXMuZm9ybURhdGEgJiYgT2JqZWN0LmtleXModGhpcy5mb3JtRGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB2YWwgPSB0aGlzLmZvcm1DYWNoZS5nZXRDYWNoZWRWYWx1ZShhdHRyKTtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUdyb3VwLmRpcnR5ICYmIHZhbCkge1xuICAgICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbmV3IE9Gb3JtVmFsdWUodmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBSZXR1cm4gb3JpZ2luYWwgdmFsdWUgc3RvcmVkIGludG8gZm9ybSBkYXRhLi4uXG4gICAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZm9ybURhdGE7XG4gICAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFbYXR0cl07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgT0Zvcm1WYWx1ZSgpO1xuICB9XG5cbiAgZ2V0RGF0YVZhbHVlcygpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGF0YTtcbiAgfVxuXG4gIGNsZWFyRGF0YSgpIHtcbiAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldEZpbHRlckZyb21VcmxQYXJhbXMoKTtcbiAgICB0aGlzLmZvcm1Hcm91cC5yZXNldCh7fSwge1xuICAgICAgZW1pdEV2ZW50OiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMuX3NldERhdGEoZmlsdGVyKTtcbiAgfVxuXG4gIGNhbkRlYWN0aXZhdGUoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB8IFByb21pc2U8Ym9vbGVhbj4gfCBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY29uZmlybUV4aXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBjYW5EaXNjYXJkQ2hhbmdlcyA9IHRoaXMuY2FuRGlzY2FyZENoYW5nZXM7XG4gICAgdGhpcy5jYW5EaXNjYXJkQ2hhbmdlcyA9IGZhbHNlO1xuICAgIHJldHVybiBjYW5EaXNjYXJkQ2hhbmdlcyB8fCB0aGlzLnNob3dDb25maXJtRGlzY2FyZENoYW5nZXMoKTtcbiAgfVxuXG4gIHNob3dDb25maXJtRGlzY2FyZENoYW5nZXMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb24uc2hvd0NvbmZpcm1EaXNjYXJkQ2hhbmdlcygpO1xuICB9XG5cbiAgZXhlY3V0ZVRvb2xiYXJBY3Rpb24oYWN0aW9uOiBzdHJpbmcsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSBDb2Rlcy5CQUNLX0FDVElPTjogdGhpcy5fYmFja0FjdGlvbigpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuQ0xPU0VfREVUQUlMX0FDVElPTjogdGhpcy5fY2xvc2VEZXRhaWxBY3Rpb24ob3B0aW9ucyk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5SRUxPQURfQUNUSU9OOiB0aGlzLl9yZWxvYWRBY3Rpb24odHJ1ZSk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5HT19JTlNFUlRfQUNUSU9OOiB0aGlzLl9nb0luc2VydE1vZGUob3B0aW9ucyk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5JTlNFUlRfQUNUSU9OOiB0aGlzLl9pbnNlcnRBY3Rpb24oKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLkdPX0VESVRfQUNUSU9OOiB0aGlzLl9nb0VkaXRNb2RlKG9wdGlvbnMpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuRURJVF9BQ1RJT046IHRoaXMuX2VkaXRBY3Rpb24oKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLlVORE9fTEFTVF9DSEFOR0VfQUNUSU9OOiB0aGlzLl91bmRvTGFzdENoYW5nZUFjdGlvbigpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuREVMRVRFX0FDVElPTjogcmV0dXJuIHRoaXMuX2RlbGV0ZUFjdGlvbigpO1xuICAgICAgZGVmYXVsdDogYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmFkZERlYWN0aXZhdGVHdWFyZCgpO1xuXG4gICAgdGhpcy5mb3JtR3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcblxuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBhZGREZWFjdGl2YXRlR3VhcmQoKSB7XG4gICAgaWYgKHRoaXMuaXNJbkluaXRpYWxNb2RlKCkgJiYgIXRoaXMuaXNFZGl0YWJsZURldGFpbCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5hY3RSb3V0ZSB8fCAhdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlYWN0aXZhdGVHdWFyZCA9IHRoaXMuaW5qZWN0b3IuZ2V0KENhbkRlYWN0aXZhdGVGb3JtR3VhcmQpO1xuICAgIHRoaXMuZGVhY3RpdmF0ZUd1YXJkLnNldEZvcm0odGhpcyk7XG4gICAgY29uc3QgY2FuRGVhY3RpdmF0ZUFycmF5ID0gKHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZSB8fCBbXSk7XG4gICAgbGV0IHByZXZpb3VzbHlBZGRlZCA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5EZWFjdGl2YXRlQXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHByZXZpb3VzbHlBZGRlZCA9ICgoY2FuRGVhY3RpdmF0ZUFycmF5W2ldLmhhc093blByb3BlcnR5KCdDTEFTU05BTUUnKSAmJiBjYW5EZWFjdGl2YXRlQXJyYXlbaV0uQ0xBU1NOQU1FKSA9PT0gT0Zvcm1Db21wb25lbnQuZ3VhcmRDbGFzc05hbWUpO1xuICAgICAgaWYgKHByZXZpb3VzbHlBZGRlZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFwcmV2aW91c2x5QWRkZWQpIHtcbiAgICAgIGNhbkRlYWN0aXZhdGVBcnJheS5wdXNoKHRoaXMuZGVhY3RpdmF0ZUd1YXJkLmNvbnN0cnVjdG9yKTtcbiAgICAgIHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZSA9IGNhbkRlYWN0aXZhdGVBcnJheTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95RGVhY3RpdmF0ZUd1YXJkKCkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMuZGVhY3RpdmF0ZUd1YXJkIHx8ICF0aGlzLmFjdFJvdXRlIHx8ICF0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnIHx8ICF0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5kZWFjdGl2YXRlR3VhcmQuc2V0Rm9ybSh1bmRlZmluZWQpO1xuICAgICAgZm9yIChsZXQgaSA9IHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAodGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlW2ldLm5hbWUgPT09IE9Gb3JtQ29tcG9uZW50Lmd1YXJkQ2xhc3NOYW1lKSB7XG4gICAgICAgICAgdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvL1xuICAgIH1cbiAgfVxuXG4gIGhhc0RlYWN0aXZhdGVHdWFyZCgpIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5kZWFjdGl2YXRlR3VhcmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuZ3VsYXIgbWV0aG9kc1xuICAgKi9cblxuICBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLmhlYWRlcmFjdGlvbnMgPT09ICdhbGwnKSB7XG4gICAgICB0aGlzLmhlYWRlcmFjdGlvbnMgPSAnUjtJO1U7RCc7XG4gICAgfVxuICAgIHRoaXMua2V5c0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMua2V5cywgdHJ1ZSk7XG4gICAgdGhpcy5jb2xzQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5jb2x1bW5zLCB0cnVlKTtcbiAgICBjb25zdCBwa0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMucGFyZW50S2V5cyk7XG4gICAgdGhpcy5fcEtleXNFcXVpdiA9IFV0aWwucGFyc2VQYXJlbnRLZXlzRXF1aXZhbGVuY2VzKHBrQXJyYXkpO1xuICAgIHRoaXMua2V5c1NxbFR5cGVzQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5rZXlzU3FsVHlwZXMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG5cbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN1YnNjcmliZVRvUXVlcnlQYXJhbXMoKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN1YnNjcmliZVRvVXJsUGFyYW1zKCk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zdWJzY3JpYmVUb1VybCgpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3Vic2NyaWJlVG9DYWNoZUNoYW5nZXModGhpcy5mb3JtQ2FjaGUub25DYWNoZUVtcHR5U3RhdGVDaGFuZ2VzKTtcblxuICAgIGlmICh0aGlzLm5hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLm9uVmlzaWJsZUNoYW5nZSh2aXNpYmxlID0+IHtcbiAgICAgICAgc2VsZi5zaG93SGVhZGVyID0gdmlzaWJsZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMubW9kZSA9IE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMO1xuXG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlLmdldEZvcm1QZXJtaXNzaW9ucyh0aGlzLm9hdHRyLCB0aGlzLmFjdFJvdXRlKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMuaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMudXBkYXRlRmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMuZGVsZXRlRmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgfVxuXG4gIHJlaW5pdGlhbGl6ZShvcHRpb25zOiBPRm9ybUluaXRpYWxpemF0aW9uT3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zICYmIE9iamVjdC5rZXlzKG9wdGlvbnMpLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2xvbmVkT3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xuICAgICAgZm9yIChjb25zdCBwcm9wIGluIGNsb25lZE9wdHMpIHtcbiAgICAgICAgaWYgKGNsb25lZE9wdHMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICB0aGlzW3Byb3BdID0gY2xvbmVkT3B0c1twcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICB9XG4gIH1cblxuICBjb25maWd1cmVTZXJ2aWNlKCkge1xuICAgIGxldCBsb2FkaW5nU2VydmljZTogYW55ID0gT250aW1pemVTZXJ2aWNlO1xuICAgIGlmICh0aGlzLnNlcnZpY2VUeXBlKSB7XG4gICAgICBsb2FkaW5nU2VydmljZSA9IHRoaXMuc2VydmljZVR5cGU7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQobG9hZGluZ1NlcnZpY2UpO1xuICAgICAgaWYgKFV0aWwuaXNEYXRhU2VydmljZSh0aGlzLmRhdGFTZXJ2aWNlKSkge1xuICAgICAgICBjb25zdCBzZXJ2aWNlQ2ZnID0gdGhpcy5kYXRhU2VydmljZS5nZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24odGhpcy5zZXJ2aWNlKTtcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5KSB7XG4gICAgICAgICAgc2VydmljZUNmZy5lbnRpdHkgPSB0aGlzLmVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNvbmZpZ3VyZVNlcnZpY2Uoc2VydmljZUNmZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMucmVsb2FkU3RyZWFtU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJlbG9hZFN0cmVhbVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuZm9ybUNhY2hlLmRlc3Ryb3koKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmRlc3Ryb3koKTtcbiAgICB0aGlzLmRlc3Ryb3lEZWFjdGl2YXRlR3VhcmQoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuZGV0ZXJtaW5hdGVGb3JtTW9kZSgpO1xuICAgICAgdGhpcy5vbkZvcm1Jbml0U3RyZWFtLmVtaXQodHJ1ZSk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKlxuICAgKiBJbm5lciBtZXRob2RzXG4gICAqL1xuXG4gIF9zZXRDb21wb25lbnRzRWRpdGFibGUoc3RhdGU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjb21wb25lbnRzOiBhbnkgPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5mb3JFYWNoKGNvbXBLZXkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wS2V5XTtcbiAgICAgIGNvbXBvbmVudC5pc1JlYWRPbmx5ID0gIXN0YXRlO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9ybSBvcGVyYXRpb24gbW9kZS5cbiAgICogQHBhcmFtIG1vZGUgVGhlIG1vZGUgdG8gYmUgZXN0YWJsaXNoZWRcbiAgICovXG4gIHNldEZvcm1Nb2RlKG1vZGU6IG51bWJlcikge1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDpcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1Ub29sYmFyKSB7XG4gICAgICAgICAgdGhpcy5fZm9ybVRvb2xiYXIuc2V0SW5pdGlhbE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpO1xuICAgICAgICB0aGlzLm9uRm9ybU1vZGVDaGFuZ2UuZW1pdCh0aGlzLm1vZGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOU0VSVDpcbiAgICAgICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICAgICAgaWYgKHRoaXMuX2Zvcm1Ub29sYmFyKSB7XG4gICAgICAgICAgdGhpcy5fZm9ybVRvb2xiYXIuc2V0SW5zZXJ0TW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYXJEYXRhKCk7XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkZvcm1Nb2RlQ2hhbmdlLmVtaXQodGhpcy5tb2RlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5VUERBVEU6XG4gICAgICAgIHRoaXMubW9kZSA9IG1vZGU7XG4gICAgICAgIGlmICh0aGlzLl9mb3JtVG9vbGJhcikge1xuICAgICAgICAgIHRoaXMuX2Zvcm1Ub29sYmFyLnNldEVkaXRNb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0Q29tcG9uZW50c0VkaXRhYmxlKHRydWUpO1xuICAgICAgICB0aGlzLm9uRm9ybU1vZGVDaGFuZ2UuZW1pdCh0aGlzLm1vZGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIF9zZXREYXRhKGRhdGEpIHtcbiAgICBpZiAoVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICBpZiAoZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignW09Gb3JtQ29tcG9uZW50XSBGb3JtIGRhdGEgaGFzIG1vcmUgdGhhbiBhIHNpbmdsZSByZWNvcmQuIFN0b3JpbmcgZW1wdHkgZGF0YScpO1xuICAgICAgfVxuICAgICAgY29uc3QgY3VycmVudERhdGEgPSBkYXRhLmxlbmd0aCA9PT0gMSA/IGRhdGFbMF0gOiB7fTtcbiAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHRoaXMudG9Gb3JtVmFsdWVEYXRhKGN1cnJlbnREYXRhKSk7XG4gICAgICB0aGlzLl9lbWl0RGF0YShjdXJyZW50RGF0YSk7XG4gICAgfSBlbHNlIGlmIChVdGlsLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICB0aGlzLl91cGRhdGVGb3JtRGF0YSh0aGlzLnRvRm9ybVZhbHVlRGF0YShkYXRhKSk7XG4gICAgICB0aGlzLl9lbWl0RGF0YShkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdGb3JtIGhhcyByZWNlaXZlZCBub3Qgc3VwcG9ydGVkIHNlcnZpY2UgZGF0YS4gU3VwcG9ydGVkIGRhdGEgYXJlIEFycmF5IG9yIE9iamVjdCcpO1xuICAgICAgdGhpcy5fdXBkYXRlRm9ybURhdGEoe30pO1xuICAgIH1cbiAgfVxuXG4gIF9lbWl0RGF0YShkYXRhKSB7XG4gICAgdGhpcy5vbkRhdGFMb2FkZWQuZW1pdChkYXRhKTtcbiAgfVxuXG4gIF9iYWNrQWN0aW9uKCkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24ubmF2aWdhdGVCYWNrKCk7XG4gIH1cblxuICBfY2xvc2VEZXRhaWxBY3Rpb24ob3B0aW9ucz86IGFueSkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uY2xvc2VEZXRhaWxBY3Rpb24ob3B0aW9ucyk7XG4gIH1cblxuICBfc3RheUluUmVjb3JkQWZ0ZXJJbnNlcnQoaW5zZXJ0ZWRLZXlzOiBvYmplY3QpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN0YXlJblJlY29yZEFmdGVySW5zZXJ0KGluc2VydGVkS2V5cyk7XG4gIH1cblxuICBfcmVsb2FkQWN0aW9uKHVzZUZpbHRlcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgbGV0IGZpbHRlciA9IHt9O1xuICAgIGlmICh1c2VGaWx0ZXIpIHtcbiAgICAgIGZpbHRlciA9IHRoaXMuZ2V0Q3VycmVudEtleXNWYWx1ZXMoKTtcbiAgICB9XG4gICAgdGhpcy5xdWVyeURhdGEoZmlsdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gJ2luc2VydCcgbW9kZVxuICAgKi9cbiAgX2dvSW5zZXJ0TW9kZShvcHRpb25zPzogYW55KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5nb0luc2VydE1vZGUob3B0aW9ucyk7XG4gIH1cblxuICBfY2xlYXJGb3JtQWZ0ZXJJbnNlcnQoKSB7XG4gICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgaW5zZXJ0IGFjdGlvbi5cbiAgICovXG4gIF9pbnNlcnRBY3Rpb24oKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goKGNvbnRyb2wpID0+IHtcbiAgICAgIHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzW2NvbnRyb2xdLm1hcmtBc1RvdWNoZWQoKTtcbiAgICB9KTtcblxuICAgIGlmICghdGhpcy5mb3JtR3JvdXAudmFsaWQpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRk9STV9WQUxJREFUSU9OX0VSUk9SJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9JbnNlcnQoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk7XG4gICAgdGhpcy5pbnNlcnREYXRhKHZhbHVlcywgc3FsVHlwZXMpLnN1YnNjcmliZShyZXNwID0+IHtcbiAgICAgIHNlbGYucG9zdENvcnJlY3RJbnNlcnQocmVzcCk7XG4gICAgICBzZWxmLmZvcm1DYWNoZS5zZXRDYWNoZVNuYXBzaG90KCk7XG4gICAgICBzZWxmLm1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk7XG4gICAgICBpZiAoc2VsZi5hZnRlckluc2VydE1vZGUgPT09ICdkZXRhaWwnKSB7XG4gICAgICAgIHNlbGYuX3N0YXlJblJlY29yZEFmdGVySW5zZXJ0KHJlc3ApO1xuICAgICAgfSBlbHNlIGlmIChzZWxmLmFmdGVySW5zZXJ0TW9kZSA9PT0gJ25ldycpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJGb3JtQWZ0ZXJJbnNlcnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuX2Nsb3NlRGV0YWlsQWN0aW9uKCk7XG4gICAgICB9XG4gICAgfSwgZXJyb3IgPT4ge1xuICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0SW5zZXJ0KGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gJ2VkaXQnIG1vZGVcbiAgICovXG4gIF9nb0VkaXRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdvRWRpdE1vZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyAnZWRpdCcgYWN0aW9uXG4gICAqL1xuICBfZWRpdEFjdGlvbigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmZvcm1Hcm91cC5jb250cm9scykuZm9yRWFjaChcbiAgICAgIChjb250cm9sKSA9PiB7XG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzW2NvbnRyb2xdLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKCF0aGlzLmZvcm1Hcm91cC52YWxpZCkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsICdNRVNTQUdFUy5GT1JNX1ZBTElEQVRJT05fRVJST1InKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyByZXRyaWV2aW5nIGtleXMuLi5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmdldEtleXNWYWx1ZXMoKTtcblxuICAgIC8vIHJldHJpZXZpbmcgdmFsdWVzIHRvIHVwZGF0ZS4uLlxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlc1RvVXBkYXRlKCk7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNTUUxUeXBlcygpO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKHZhbHVlcykubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIHVwZGF0ZVxuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdJTkZPJywgJ01FU1NBR0VTLkZPUk1fTk9USElOR19UT19VUERBVEVfSU5GTycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGludm9rZSB1cGRhdGUgbWV0aG9kLi4uXG4gICAgdGhpcy51cGRhdGVEYXRhKGZpbHRlciwgdmFsdWVzLCBzcWxUeXBlcykuc3Vic2NyaWJlKHJlc3AgPT4ge1xuICAgICAgc2VsZi5wb3N0Q29ycmVjdFVwZGF0ZShyZXNwKTtcbiAgICAgIHNlbGYuZm9ybUNhY2hlLnNldENhY2hlU25hcHNob3QoKTtcbiAgICAgIHNlbGYubWFya0Zvcm1MYXlvdXRNYW5hZ2VyVG9VcGRhdGUoKTtcbiAgICAgIGlmIChzZWxmLnN0YXlJblJlY29yZEFmdGVyRWRpdCkge1xuICAgICAgICBzZWxmLl9yZWxvYWRBY3Rpb24odHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLl9jbG9zZURldGFpbEFjdGlvbigpO1xuICAgICAgfVxuICAgIH0sIGVycm9yID0+IHtcbiAgICAgIHNlbGYucG9zdEluY29ycmVjdFVwZGF0ZShlcnJvcik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgJ2RlbGV0ZScgYWN0aW9uXG4gICAqL1xuICBfZGVsZXRlQWN0aW9uKCkge1xuICAgIGNvbnN0IGZpbHRlciA9IHRoaXMuZ2V0S2V5c1ZhbHVlcygpO1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZURhdGEoZmlsdGVyKTtcbiAgfVxuXG4gIC8qXG4gIFV0aWxpdHkgbWV0aG9kc1xuICAqL1xuXG4gIHF1ZXJ5RGF0YShmaWx0ZXIpIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuZGF0YVNlcnZpY2UpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ09Gb3JtQ29tcG9uZW50OiBubyBzZXJ2aWNlIGNvbmZpZ3VyZWQhIGFib3J0aW5nIHF1ZXJ5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoZmlsdGVyKSB8fCBPYmplY3Qua2V5cyhmaWx0ZXIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc29sZS53YXJuKCdPRm9ybUNvbXBvbmVudDogbm8gZmlsdGVyIGNvbmZpZ3VyZWQhIGFib3J0aW5nIHF1ZXJ5Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZm9ybUNhY2hlLnJlc3RhcnRDYWNoZSgpO1xuICAgIHRoaXMuY2xlYXJDb21wb25lbnRzT2xkVmFsdWUoKTtcbiAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgY29uc3QgYXYgPSB0aGlzLmdldEF0dHJpYnV0ZXNUb1F1ZXJ5KCk7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNTUUxUeXBlcygpO1xuICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24gPSB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMucXVlcnlNZXRob2RdKGZpbHRlciwgYXYsIHRoaXMuZW50aXR5LCBzcWxUeXBlcylcbiAgICAgIC5zdWJzY3JpYmUoKHJlc3A6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgIHRoaXMuX3NldERhdGEocmVzcC5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl91cGRhdGVGb3JtRGF0YSh7fSk7XG4gICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsICdNRVNTQUdFUy5FUlJPUl9RVUVSWScpO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0VSUk9SOiAnICsgcmVzcC5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB0aGlzLl91cGRhdGVGb3JtRGF0YSh7fSk7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbikpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbihlcnIpO1xuICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiBlcnIuc3RhdHVzVGV4dCkge1xuICAgICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnIuc3RhdHVzVGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsICdNRVNTQUdFUy5FUlJPUl9RVUVSWScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNUb1F1ZXJ5KCk6IEFycmF5PGFueT4ge1xuICAgIGxldCBhdHRyaWJ1dGVzOiBBcnJheTxhbnk+ID0gW107XG4gICAgLy8gYWRkIGZvcm0ga2V5cy4uLlxuICAgIGlmICh0aGlzLmtleXNBcnJheSAmJiB0aGlzLmtleXNBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2goLi4udGhpcy5rZXlzQXJyYXkpO1xuICAgIH1cbiAgICBjb25zdCBjb21wb25lbnRzOiBhbnkgPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICAvLyBhZGQgb25seSB0aGUgZmllbGRzIGNvbnRhaW5lZCBpbnRvIHRoZSBmb3JtLi4uXG4gICAgT2JqZWN0LmtleXMoY29tcG9uZW50cykuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmIChhdHRyaWJ1dGVzLmluZGV4T2YoaXRlbSkgPCAwICYmXG4gICAgICAgIGNvbXBvbmVudHNbaXRlbV0uaXNBdXRvbWF0aWNSZWdpc3RlcmluZygpICYmIGNvbXBvbmVudHNbaXRlbV0uaXNBdXRvbWF0aWNCaW5kaW5nKCkpIHtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gYWRkIGZpZWxkcyBzdG9yZWQgaW50byBmb3JtIGNhY2hlLi4uXG4gICAgY29uc3QgZGF0YUNhY2hlID0gdGhpcy5mb3JtQ2FjaGUuZ2V0RGF0YUNhY2hlKCk7XG4gICAgaWYgKGRhdGFDYWNoZSkge1xuICAgICAgT2JqZWN0LmtleXMoZGF0YUNhY2hlKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpZiAoaXRlbSAhPT0gdW5kZWZpbmVkICYmIGF0dHJpYnV0ZXMuaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5jb25jYXQodGhpcy5jb2xzQXJyYXkuZmlsdGVyKGNvbCA9PiBhdHRyaWJ1dGVzLmluZGV4T2YoY29sKSA8IDApKTtcbiAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgfVxuXG4gIGluc2VydERhdGEodmFsdWVzLCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbiA9IHRoaXMubG9hZCgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMuaW5zZXJ0TWV0aG9kXSh2YWx1ZXMsIHRoaXMuZW50aXR5LCBzcWxUeXBlcykuc3Vic2NyaWJlKFxuICAgICAgICByZXNwID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwLmRhdGEpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IocmVzcC5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1ZhbHVlc1RvSW5zZXJ0KCk6IG9iamVjdCB7XG4gICAgY29uc3QgYXR0clZhbHVlcyA9IHt9O1xuICAgIGlmICh0aGlzLmZvcm1QYXJlbnRLZXlzVmFsdWVzKSB7XG4gICAgICBPYmplY3QuYXNzaWduKGF0dHJWYWx1ZXMsIHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXMpO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihhdHRyVmFsdWVzLCB0aGlzLmdldFJlZ2lzdGVyZWRGaWVsZHNWYWx1ZXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgc3FsIHR5cGVzIGZyb20gdGhlIGZvcm0gY29tcG9uZW50cyBhbmQgdGhlIGZvcm0ga2V5c1xuICAgKi9cbiAgcHVibGljIGdldEF0dHJpYnV0ZXNTUUxUeXBlcygpOiBvYmplY3Qge1xuICAgIGNvbnN0IHR5cGVzOiBvYmplY3QgPSB7fTtcbiAgICAvLyBBZGQgZm9ybSBrZXlzIHNxbCB0eXBlc1xuICAgIHRoaXMua2V5c1NxbFR5cGVzQXJyYXkuZm9yRWFjaCgoa3N0LCBpKSA9PiB0eXBlc1t0aGlzLmtleXNBcnJheVtpXV0gPSBTUUxUeXBlcy5nZXRTUUxUeXBlVmFsdWUoa3N0KSk7XG4gICAgLy8gQWRkIGZvcm0gY29tcG9uZW50cyBzcWwgdHlwZXNcbiAgICBpZiAodGhpcy5fY29tcFNRTFR5cGVzICYmIE9iamVjdC5rZXlzKHRoaXMuX2NvbXBTUUxUeXBlcykubGVuZ3RoID4gMCkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0eXBlcywgdGhpcy5fY29tcFNRTFR5cGVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVzO1xuICB9XG5cbiAgdXBkYXRlRGF0YShmaWx0ZXIsIHZhbHVlcywgc3FsVHlwZXM/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgdGhpcy5kYXRhU2VydmljZVt0aGlzLnVwZGF0ZU1ldGhvZF0oZmlsdGVyLCB2YWx1ZXMsIHRoaXMuZW50aXR5LCBzcWxUeXBlcykuc3Vic2NyaWJlKFxuICAgICAgICByZXNwID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwLmRhdGEpO1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IocmVzcC5tZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyID0+IHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1ZhbHVlc1RvVXBkYXRlKCk6IG9iamVjdCB7XG4gICAgY29uc3QgdmFsdWVzID0ge307XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgY2hhbmdlZEF0dHJzID0gdGhpcy5mb3JtQ2FjaGUuZ2V0Q2hhbmdlZEZvcm1Db250cm9sc0F0dHIoKTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmZvcm1Hcm91cC5jb250cm9scykuZmlsdGVyKGNvbnRyb2xOYW1lID0+XG4gICAgICBzZWxmLmlnbm9yZUZvcm1DYWNoZUtleXMuaW5kZXhPZihjb250cm9sTmFtZSkgPT09IC0xICYmXG4gICAgICBjaGFuZ2VkQXR0cnMuaW5kZXhPZihjb250cm9sTmFtZSkgIT09IC0xXG4gICAgKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sID0gc2VsZi5mb3JtR3JvdXAuY29udHJvbHNbaXRlbV07XG4gICAgICBpZiAoY29udHJvbCBpbnN0YW5jZW9mIE9Gb3JtQ29udHJvbCkge1xuICAgICAgICB2YWx1ZXNbaXRlbV0gPSBjb250cm9sLmdldFZhbHVlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZXNbaXRlbV0gPSBjb250cm9sLnZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlc1tpdGVtXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhbHVlc1tpdGVtXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIGRlbGV0ZURhdGEoZmlsdGVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuY2FuRGlzY2FyZENoYW5nZXMgPSB0cnVlO1xuICAgICAgdGhpcy5kYXRhU2VydmljZVt0aGlzLmRlbGV0ZU1ldGhvZF0oZmlsdGVyLCB0aGlzLmVudGl0eSkuc3Vic2NyaWJlKFxuICAgICAgICByZXNwID0+IHtcbiAgICAgICAgICBpZiAocmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgICAgc2VsZi5mb3JtQ2FjaGUuc2V0Q2FjaGVTbmFwc2hvdCgpO1xuICAgICAgICAgICAgc2VsZi5tYXJrRm9ybUxheW91dE1hbmFnZXJUb1VwZGF0ZSgpO1xuICAgICAgICAgICAgc2VsZi5wb3N0Q29ycmVjdERlbGV0ZShyZXNwKTtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcC5kYXRhKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYucG9zdEluY29ycmVjdERlbGV0ZShyZXNwKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHJlc3AubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0RGVsZXRlKGVycik7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIHRvSlNPTkRhdGEoZGF0YSkge1xuICAgIGlmICghZGF0YSkge1xuICAgICAgZGF0YSA9IHt9O1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZURhdGEgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICB2YWx1ZURhdGFbaXRlbV0gPSBkYXRhW2l0ZW1dLnZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZURhdGE7XG4gIH1cblxuICB0b0Zvcm1WYWx1ZURhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhICYmIFV0aWwuaXNBcnJheShkYXRhKSkge1xuICAgICAgY29uc3QgdmFsdWVEYXRhOiBBcnJheTxvYmplY3Q+ID0gW107XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIGRhdGEuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgdmFsdWVEYXRhLnB1c2goc2VsZi5vYmplY3RUb0Zvcm1WYWx1ZURhdGEoaXRlbSkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmFsdWVEYXRhO1xuICAgIH0gZWxzZSBpZiAoZGF0YSAmJiBVdGlsLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICByZXR1cm4gdGhpcy5vYmplY3RUb0Zvcm1WYWx1ZURhdGEoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRLZXlzVmFsdWVzKCkge1xuICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSB0aGlzLmZvcm1EYXRhO1xuICAgIGlmICghdGhpcy5rZXlzQXJyYXkpIHtcbiAgICAgIHJldHVybiBmaWx0ZXI7XG4gICAgfVxuICAgIHRoaXMua2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChjdXJyZW50UmVjb3JkW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgY3VycmVudERhdGEgPSBjdXJyZW50UmVjb3JkW2tleV07XG4gICAgICAgIGlmIChjdXJyZW50RGF0YSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgICAgICBjdXJyZW50RGF0YSA9IGN1cnJlbnREYXRhLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGZpbHRlcltrZXldID0gY3VycmVudERhdGE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGlzSW5RdWVyeU1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLlFVRVJZO1xuICB9XG5cbiAgaXNJbkluc2VydE1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOU0VSVDtcbiAgfVxuXG4gIGlzSW5VcGRhdGVNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09IE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5VUERBVEU7XG4gIH1cblxuICBpc0luSW5pdGlhbE1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUw7XG4gIH1cblxuICBzZXRRdWVyeU1vZGUoKSB7XG4gICAgdGhpcy5zZXRGb3JtTW9kZShPRm9ybUNvbXBvbmVudC5Nb2RlKCkuUVVFUlkpO1xuICB9XG5cbiAgc2V0SW5zZXJ0TW9kZSgpIHtcbiAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTlNFUlQpO1xuICB9XG5cbiAgc2V0VXBkYXRlTW9kZSgpIHtcbiAgICB0aGlzLnNldEZvcm1Nb2RlKE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5VUERBVEUpO1xuICB9XG5cbiAgc2V0SW5pdGlhbE1vZGUoKSB7XG4gICAgdGhpcy5zZXRGb3JtTW9kZShPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTCk7XG4gIH1cblxuICByZWdpc3RlckR5bmFtaWNGb3JtQ29tcG9uZW50KGR5bmFtaWNGb3JtKSB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChkeW5hbWljRm9ybSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5keW5hbWljRm9ybVN1YnNjcmlwdGlvbiA9IGR5bmFtaWNGb3JtLnJlbmRlci5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgc2VsZi5yZWZyZXNoQ29tcG9uZW50c0VkaXRhYmxlU3RhdGUoKTtcbiAgICAgICAgaWYgKCFzZWxmLmlzSW5JbnNlcnRNb2RlKCkgJiYgc2VsZi5xdWVyeU9uSW5pdCkge1xuICAgICAgICAgIHNlbGYuX3JlbG9hZEFjdGlvbih0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5mb3JtUGFyZW50S2V5c1ZhbHVlcykge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHNlbGYuZm9ybVBhcmVudEtleXNWYWx1ZXMpLmZvckVhY2gocGFyZW50S2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2VsZi5mb3JtUGFyZW50S2V5c1ZhbHVlc1twYXJlbnRLZXldO1xuICAgICAgICAgICAgY29uc3QgY29tcCA9IHNlbGYuZ2V0RmllbGRSZWZlcmVuY2UocGFyZW50S2V5KTtcbiAgICAgICAgICAgIGlmIChVdGlsLmlzRm9ybURhdGFDb21wb25lbnQoY29tcCkgJiYgY29tcC5pc0F1dG9tYXRpY0JpbmRpbmcoKSkge1xuICAgICAgICAgICAgICBjb21wLnNldFZhbHVlKHZhbHVlLCB7XG4gICAgICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnJlZ2lzdGVyRHluYW1pY0Zvcm1Db21wb25lbnQoZHluYW1pY0Zvcm0pIHtcbiAgICBpZiAoZHluYW1pY0Zvcm0gJiYgdGhpcy5keW5hbWljRm9ybVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5keW5hbWljRm9ybVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFJlcXVpcmVkQ29tcG9uZW50cygpOiBvYmplY3Qge1xuICAgIGNvbnN0IHJlcXVpcmVkQ29tcG9udGVudHM6IG9iamVjdCA9IHt9O1xuICAgIGNvbnN0IGNvbXBvbmVudHMgPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgT2JqZWN0LmtleXMoY29tcG9uZW50cykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCBjb21wID0gY29tcG9uZW50c1trZXldO1xuICAgICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgICAgaWYgKChjb21wIGFzIGFueSkuaXNSZXF1aXJlZCAmJiBhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlcXVpcmVkQ29tcG9udGVudHNbYXR0cl0gPSBjb21wO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcXVpcmVkQ29tcG9udGVudHM7XG4gIH1cblxuICBnZXQgbGF5b3V0RGlyZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dERpcmVjdGlvbjtcbiAgfVxuXG4gIHNldCBsYXlvdXREaXJlY3Rpb24odmFsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZWRWYWwgPSAodmFsIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuX2xheW91dERpcmVjdGlvbiA9IFsncm93JywgJ2NvbHVtbicsICdyb3ctcmV2ZXJzZScsICdjb2x1bW4tcmV2ZXJzZSddLmluZGV4T2YocGFyc2VkVmFsKSAhPT0gLTEgPyBwYXJzZWRWYWwgOiBPRm9ybUNvbXBvbmVudC5ERUZBVUxUX0xBWU9VVF9ESVJFQ1RJT047XG4gIH1cblxuICBnZXQgbGF5b3V0QWxpZ24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0QWxpZ247XG4gIH1cblxuICBzZXQgbGF5b3V0QWxpZ24odmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9sYXlvdXRBbGlnbiA9IHZhbDtcbiAgfVxuXG4gIGdldCBzaG93RmxvYXRpbmdUb29sYmFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dIZWFkZXIgJiYgdGhpcy5oZWFkZXJNb2RlID09PSAnZmxvYXRpbmcnO1xuICB9XG5cbiAgZ2V0IHNob3dOb3RGbG9hdGluZ1Rvb2xiYXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0hlYWRlciAmJiB0aGlzLmhlYWRlck1vZGUgIT09ICdmbG9hdGluZyc7XG4gIH1cblxuICBpc0VkaXRhYmxlRGV0YWlsKCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRhYmxlRGV0YWlsO1xuICB9XG5cbiAgaXNJbml0aWFsU3RhdGVDaGFuZ2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1DYWNoZS5pc0luaXRpYWxTdGF0ZUNoYW5nZWQoKTtcbiAgfVxuXG4gIF91bmRvTGFzdENoYW5nZUFjdGlvbigpIHtcbiAgICB0aGlzLmZvcm1DYWNoZS51bmRvTGFzdENoYW5nZSgpO1xuICB9XG5cbiAgZ2V0IGlzQ2FjaGVTdGFja0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1DYWNoZS5pc0NhY2hlU3RhY2tFbXB0eTtcbiAgfVxuXG4gIHVuZG9LZXlib2FyZFByZXNzZWQoKSB7XG4gICAgdGhpcy5mb3JtQ2FjaGUudW5kb0xhc3RDaGFuZ2Uoe1xuICAgICAga2V5Ym9hcmRFdmVudDogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Rm9ybVRvb2xiYXIoKTogT0Zvcm1Ub29sYmFyQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybVRvb2xiYXI7XG4gIH1cblxuICBnZXRGb3JtTWFuYWdlcigpOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLmZvcm1OYXZpZ2F0aW9uLmZvcm1MYXlvdXRNYW5hZ2VyO1xuICB9XG5cbiAgZ2V0Rm9ybU5hdmlnYXRpb24oKTogT0Zvcm1OYXZpZ2F0aW9uQ2xhc3Mge1xuICAgIHJldHVybiB0aGlzLmZvcm1OYXZpZ2F0aW9uO1xuICB9XG5cbiAgZ2V0Rm9ybUNhY2hlKCk6IE9Gb3JtQ2FjaGVDbGFzcyB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybUNhY2hlO1xuICB9XG5cbiAgZ2V0VXJsUGFyYW0oYXJnOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGb3JtTmF2aWdhdGlvbigpLmdldFVybFBhcmFtcygpW2FyZ107XG4gIH1cblxuICBnZXRVcmxQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Rm9ybU5hdmlnYXRpb24oKS5nZXRVcmxQYXJhbXMoKTtcbiAgfVxuXG4gIHNldFVybFBhcmFtc0FuZFJlbG9hZCh2YWw6IG9iamVjdCkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc2V0VXJsUGFyYW1zKHZhbCk7XG4gICAgdGhpcy5fcmVsb2FkQWN0aW9uKHRydWUpO1xuICB9XG5cbiAgZ2V0UmVnaXN0ZXJlZEZpZWxkc1ZhbHVlcygpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcbiAgICBjb25zdCBjb21wb25lbnRzOiBJRm9ybURhdGFDb21wb25lbnRIYXNoID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgY29tcG9uZW50c0tleXMgPSBPYmplY3Qua2V5cyhjb21wb25lbnRzKS5maWx0ZXIoa2V5ID0+IHNlbGYuaWdub3JlRm9ybUNhY2hlS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKTtcbiAgICBjb21wb25lbnRzS2V5cy5mb3JFYWNoKGNvbXBLZXkgPT4ge1xuICAgICAgY29uc3QgY29tcDogSUZvcm1EYXRhQ29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wS2V5XTtcbiAgICAgIHZhbHVlc1tjb21wS2V5XSA9IGNvbXAuZ2V0VmFsdWUoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgY29udHJvbCBpbiB0aGUgZm9ybVxuICAgKiBAcGFyYW0gYXR0clxuICAgKi9cbiAgZ2V0RmllbGRWYWx1ZShhdHRyOiBzdHJpbmcpOiBhbnkge1xuICAgIGxldCB2YWx1ZSA9IG51bGw7XG4gICAgY29uc3QgY29tcCA9IHRoaXMuZ2V0RmllbGRSZWZlcmVuY2UoYXR0cik7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIHZhbHVlID0gY29tcC5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSB2YWx1ZXMgb2YgZWFjaCBhdHRyaWJ1dGVcbiAgICogQHBhcmFtIGF0dHJzXG4gICAqL1xuICBnZXRGaWVsZFZhbHVlcyhhdHRyczogc3RyaW5nW10pOiBhbnkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGFyciA9IHt9O1xuICAgIGF0dHJzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgYXJyW2tleV0gPSBzZWxmLmdldEZpZWxkVmFsdWUoa2V5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYXJyO1xuXG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaW4gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSBhdHRyIGF0dHJpYnV0ZSBvZiBjb250cm9sXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZVxuICAgKi9cbiAgc2V0RmllbGRWYWx1ZShhdHRyOiBzdHJpbmcsIHZhbHVlOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgY29uc3QgY29tcCA9IHRoaXMuZ2V0RmllbGRSZWZlcmVuY2UoYXR0cik7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbXAuc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBlYWNoIGNvbnRyb2wgaW4gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSB2YWx1ZXNcbiAgICovXG4gIHNldEZpZWxkVmFsdWVzKHZhbHVlczogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHZhbHVlcykge1xuICAgICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHRoaXMuc2V0RmllbGRWYWx1ZShrZXksIHZhbHVlc1trZXldLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIHZhbHVlIG9mIGVhY2ggY29udHJvbCBpbiB0aGUgZm9ybVxuICAgKiBAcGFyYW0gYXR0clxuICAgKi9cbiAgY2xlYXJGaWVsZFZhbHVlKGF0dHI6IHN0cmluZywgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpIHtcbiAgICBjb25zdCBjb21wID0gdGhpcy5nZXRGaWVsZFJlZmVyZW5jZShhdHRyKTtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29tcC5jbGVhclZhbHVlKG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgdmFsdWUgb2YgZWFjaCBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRyc1xuICAgKi9cbiAgY2xlYXJGaWVsZFZhbHVlcyhhdHRyczogc3RyaW5nW10sIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgYXR0cnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBzZWxmLmNsZWFyRmllbGRWYWx1ZShrZXksIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcmVmZXJlbmNlIG9mIHRoZSBjb250cm9sIGluIHRoZSBmb3JtLlxuICAgKiBAcGFyYW0gYXR0clxuICAgKi9cbiAgZ2V0RmllbGRSZWZlcmVuY2UoYXR0cjogc3RyaW5nKTogSUZvcm1EYXRhQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1thdHRyXTtcbiAgfVxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSByZWZlcmVuY2Ugb2YgZWFjaCBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRyc1xuICAgKi9cbiAgZ2V0RmllbGRSZWZlcmVuY2VzKGF0dHJzOiBzdHJpbmdbXSk6IElGb3JtRGF0YUNvbXBvbmVudEhhc2gge1xuICAgIGNvbnN0IGFycjogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCA9IHt9O1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGF0dHJzLmZvckVhY2goKGtleSwgaW5kZXgpID0+IHtcbiAgICAgIGFycltrZXldID0gc2VsZi5nZXRGaWVsZFJlZmVyZW5jZShrZXkpO1xuICAgIH0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBnZXRGb3JtQ29tcG9uZW50UGVybWlzc2lvbnMoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICBsZXQgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucztcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gKHRoaXMucGVybWlzc2lvbnMuY29tcG9uZW50cyB8fCBbXSkuZmluZChjb21wID0+IGNvbXAuYXR0ciA9PT0gYXR0cik7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfVxuXG4gIGdldEFjdGlvbnNQZXJtaXNzaW9ucygpOiBPUGVybWlzc2lvbnNbXSB7XG4gICAgbGV0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnNbXTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHBlcm1pc3Npb25zID0gKHRoaXMucGVybWlzc2lvbnMuYWN0aW9ucyB8fCBbXSk7XG4gICAgfVxuICAgIHJldHVybiBwZXJtaXNzaW9ucztcbiAgfVxuXG4gIHByb3RlY3RlZCBkZXRlcm1pbmF0ZUZvcm1Nb2RlKCk6IHZvaWQge1xuICAgIGNvbnN0IHVybFNlZ21lbnRzID0gdGhpcy5mb3JtTmF2aWdhdGlvbi5nZXRVcmxTZWdtZW50cygpO1xuICAgIGlmICh1cmxTZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBzZWdtZW50ID0gdXJsU2VnbWVudHNbdXJsU2VnbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmRldGVybWluYXRlTW9kZUZyb21VcmxTZWdtZW50KHNlZ21lbnQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RSb3V0ZS5wYXJlbnQpIHtcbiAgICAgIHRoaXMuYWN0Um91dGUucGFyZW50LnVybC5zdWJzY3JpYmUoc2VnbWVudHMgPT4ge1xuICAgICAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICAgIHRoaXMuZGV0ZXJtaW5hdGVNb2RlRnJvbVVybFNlZ21lbnQoc2VnbWVudCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRGb3JtTW9kZShPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTCk7XG4gICAgfVxuICAgIC8vIHN0YXlJblJlY29yZEFmdGVyRWRpdCBpcyB0cnVlIGlmIGZvcm0gaGFzIGVkaXRhYmxlIGRldGFpbCA9IHRydWVcbiAgICB0aGlzLnN0YXlJblJlY29yZEFmdGVyRWRpdCA9IHRoaXMuc3RheUluUmVjb3JkQWZ0ZXJFZGl0IHx8IHRoaXMuaXNFZGl0YWJsZURldGFpbCgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRldGVybWluYXRlTW9kZUZyb21VcmxTZWdtZW50KHNlZ21lbnQ6IFVybFNlZ21lbnQpOiB2b2lkIHtcbiAgICBjb25zdCBfcGF0aCA9IHNlZ21lbnQgPyBzZWdtZW50LnBhdGggOiAnJztcbiAgICBpZiAodGhpcy5pc0luc2VydE1vZGVQYXRoKF9wYXRoKSkge1xuICAgICAgdGhpcy5zZXRJbnNlcnRNb2RlKCk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzVXBkYXRlTW9kZVBhdGgoX3BhdGgpKSB7XG4gICAgICB0aGlzLnNldFVwZGF0ZU1vZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRJbml0aWFsTW9kZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfdXBkYXRlRm9ybURhdGEobmV3Rm9ybURhdGE6IG9iamVjdCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5mb3JtRGF0YSA9IG5ld0Zvcm1EYXRhO1xuICAgICAgY29uc3QgY29tcG9uZW50cyA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgICAgaWYgKGNvbXBvbmVudHMpIHtcbiAgICAgICAgT2JqZWN0LmtleXMoY29tcG9uZW50cykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbXAgPSBjb21wb25lbnRzW2tleV07XG4gICAgICAgICAgaWYgKFV0aWwuaXNGb3JtRGF0YUNvbXBvbmVudChjb21wKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKGNvbXAuaXNBdXRvbWF0aWNCaW5kaW5nKCkpIHtcbiAgICAgICAgICAgICAgICBjb21wLmRhdGEgPSBzZWxmLmdldERhdGFWYWx1ZShrZXkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLmluaXRpYWxpemVGaWVsZHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0aWFsaXplRmllbGRzKCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzKS5mb3JFYWNoKGNvbnRyb2wgPT4ge1xuICAgICAgdGhpcy5mb3JtR3JvdXAuY29udHJvbHNbY29udHJvbF0ubWFya0FzUHJpc3RpbmUoKTtcbiAgICB9KTtcbiAgICB0aGlzLmZvcm1DYWNoZS5yZWdpc3RlckNhY2hlKCk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi51cGRhdGVOYXZpZ2F0aW9uKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY2xlYXJDb21wb25lbnRzT2xkVmFsdWUoKTogdm9pZCB7XG4gICAgY29uc3QgY29tcG9uZW50czogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGNvbXBvbmVudHNLZXlzID0gT2JqZWN0LmtleXMoY29tcG9uZW50cykuZmlsdGVyKGtleSA9PiBzZWxmLmlnbm9yZUZvcm1DYWNoZUtleXMuaW5kZXhPZihrZXkpID09PSAtMSk7XG4gICAgY29tcG9uZW50c0tleXMuZm9yRWFjaChjb21wS2V5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXA6IElGb3JtRGF0YUNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcEtleV07XG4gICAgICAoY29tcCBhcyBhbnkpLm9sZFZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgY29tcC5nZXRGb3JtQ29udHJvbCgpLnNldFZhbHVlKHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdENvcnJlY3RJbnNlcnQocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZS5vcGVuKCdNRVNTQUdFUy5JTlNFUlRFRCcsIHsgaWNvbjogJ2NoZWNrX2NpcmNsZScgfSk7XG4gICAgdGhpcy5vbkluc2VydC5lbWl0KHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdEluY29ycmVjdEluc2VydChyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2hvd0Vycm9yKCdpbnNlcnQnLCByZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RJbmNvcnJlY3REZWxldGUocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dFcnJvcignZGVsZXRlJywgcmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0SW5jb3JyZWN0VXBkYXRlKHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zaG93RXJyb3IoJ3VwZGF0ZScsIHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdENvcnJlY3RVcGRhdGUocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZS5vcGVuKCdNRVNTQUdFUy5TQVZFRCcsIHsgaWNvbjogJ2NoZWNrX2NpcmNsZScgfSk7XG4gICAgdGhpcy5vblVwZGF0ZS5lbWl0KHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdENvcnJlY3REZWxldGUocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZS5vcGVuKCdNRVNTQUdFUy5ERUxFVEVEJywgeyBpY29uOiAnY2hlY2tfY2lyY2xlJyB9KTtcbiAgICB0aGlzLm9uRGVsZXRlLmVtaXQocmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXJrRm9ybUxheW91dE1hbmFnZXJUb1VwZGF0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBmb3JtTGF5b3V0TWFuYWdlciA9IHRoaXMuZ2V0Rm9ybU1hbmFnZXIoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZm9ybUxheW91dE1hbmFnZXIpKSB7XG4gICAgICBmb3JtTGF5b3V0TWFuYWdlci5tYXJrRm9yVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgb2JqZWN0VG9Gb3JtVmFsdWVEYXRhKGRhdGE6IG9iamVjdCA9IHt9KTogb2JqZWN0IHtcbiAgICBjb25zdCB2YWx1ZURhdGEgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICB2YWx1ZURhdGFbaXRlbV0gPSBuZXcgT0Zvcm1WYWx1ZShkYXRhW2l0ZW1dKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWVEYXRhO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldEN1cnJlbnRLZXlzVmFsdWVzKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb24uZ2V0Q3VycmVudEtleXNWYWx1ZXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWZyZXNoQ29tcG9uZW50c0VkaXRhYmxlU3RhdGUoKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUw6XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5TRVJUOlxuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuVVBEQVRFOlxuICAgICAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodHJ1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGlzSW5zZXJ0TW9kZVBhdGgocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0SXRlbSgpO1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZChuYXZEYXRhKSAmJiBwYXRoID09PSBuYXZEYXRhLmdldEluc2VydEZvcm1Sb3V0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGlzVXBkYXRlTW9kZVBhdGgocGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRQcmV2aW91c1JvdXRlRGF0YSgpO1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZChuYXZEYXRhKSAmJiBwYXRoID09PSBuYXZEYXRhLmdldEVkaXRGb3JtUm91dGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd0Vycm9yKG9wZXJhdGlvbjogc3RyaW5nLCByZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIGlmIChyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCByZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbWVzc2FnZSA9ICdNRVNTQUdFUy5FUlJPUl9ERUxFVEUnO1xuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSAndXBkYXRlJzpcbiAgICAgICAgICBtZXNzYWdlID0gJ01FU1NBR0VTLkVSUk9SX1VQREFURSc7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2luc2VydCc6XG4gICAgICAgICAgbWVzc2FnZSA9ICdNRVNTQUdFUy5FUlJPUl9JTlNFUlQnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=