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
    'onDelete',
    'beforeInsertMode',
    'beforeUpdateMode',
    'beforeInitialMode',
    'onInsertMode',
    'onUpdateMode',
    'onInitialMode'
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
        var self = this;
        this.reloadStream = combineLatest([
            self.onFormInitStream.asObservable(),
            self.formNavigation.navigationStream.asObservable()
        ]);
        this.reloadStreamSubscription = this.reloadStream.subscribe(function (valArr) {
            if (Util.isArray(valArr) && valArr.length === 2 && !self.isInInsertMode()) {
                var valArrValues = valArr[0] === true && valArr[1] === true;
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
        this.setData(filter);
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
    };
    OFormComponent.prototype.setData = function (data) {
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
    OFormComponent.prototype._setData = function (data) {
        console.warn('Method `OFormComponent._setData` is deprecated and will be removed in the furute. Use `setData` instead');
        this.setData(data);
    };
    OFormComponent.prototype._emitData = function (data) {
        this.onDataLoaded.emit(data);
    };
    OFormComponent.prototype._backAction = function () {
        console.warn('Method `OFormComponent._backAction` is deprecated and will be removed in the furute. Use `back` instead');
        this.back();
    };
    OFormComponent.prototype.back = function () {
        this.formNavigation.navigateBack();
    };
    OFormComponent.prototype._closeDetailAction = function (options) {
        console.warn('Method `OFormComponent._closeDetailAction` is deprecated and will be removed in the furute. Use `closeDetail` instead');
        this.closeDetail(options);
    };
    OFormComponent.prototype.closeDetail = function (options) {
        this.formNavigation.closeDetailAction(options);
    };
    OFormComponent.prototype._stayInRecordAfterInsert = function (insertedKeys) {
        this.formNavigation.stayInRecordAfterInsert(insertedKeys);
    };
    OFormComponent.prototype._reloadAction = function (useFilter) {
        if (useFilter === void 0) { useFilter = false; }
        console.warn('Method `OFormComponent._reloadAction` is deprecated and will be removed in the furute. Use `reload` instead');
        this.reload(useFilter);
    };
    OFormComponent.prototype.reload = function (useFilter) {
        if (useFilter === void 0) { useFilter = false; }
        var filter = {};
        if (useFilter) {
            filter = this.getCurrentKeysValues();
        }
        this.queryData(filter);
    };
    OFormComponent.prototype._goInsertMode = function (options) {
        console.warn('Method `OFormComponent._goInsertMode` is deprecated and will be removed in the furute. Use `goInsertMode` instead');
        this.goInsertMode(options);
    };
    OFormComponent.prototype.goInsertMode = function (options) {
        this.formNavigation.goInsertMode(options);
    };
    OFormComponent.prototype._clearFormAfterInsert = function () {
        this.clearData();
        this._setComponentsEditable(true);
    };
    OFormComponent.prototype._insertAction = function () {
        console.warn('Method `OFormComponent._insertAction` is deprecated and will be removed in the furute. Use `insert` instead');
        this.insert();
    };
    OFormComponent.prototype.insert = function () {
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
                self.closeDetail();
            }
        }, function (error) {
            self.postIncorrectInsert(error);
        });
    };
    OFormComponent.prototype._goEditMode = function (options) {
        console.warn('Method `OFormComponent._goEditMode` is deprecated and will be removed in the furute. Use `goEditMode` instead');
        this.goEditMode(options);
    };
    OFormComponent.prototype.goEditMode = function (options) {
        this.formNavigation.goEditMode();
    };
    OFormComponent.prototype._editAction = function () {
        console.warn('Method `OFormComponent._editAction` is deprecated and will be removed in the furute. Use `update` instead');
        this.update();
    };
    OFormComponent.prototype.update = function () {
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
                self.reload(true);
            }
            else {
                self.closeDetail();
            }
        }, function (error) {
            self.postIncorrectUpdate(error);
        });
    };
    OFormComponent.prototype._deleteAction = function () {
        console.warn('Method `OFormComponent._deleteAction` is deprecated and will be removed in the furute. Use `delete` instead');
        return this.delete();
    };
    OFormComponent.prototype.delete = function () {
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
                _this.setData(resp.data);
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
                    self.reload(true);
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
        console.warn('Method `OFormComponent._undoLastChangeAction` is deprecated and will be removed in the furute. Use `undo` instead');
        this.undo();
    };
    OFormComponent.prototype.undo = function () {
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
        this.reload(true);
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
        var _this = this;
        var arr = {};
        attrs.forEach(function (key) { return arr[key] = _this.getFieldValue(key); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9mb3JtL28tZm9ybS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUNSLE1BQU0sRUFHTixTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBYyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFFaEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBTWxFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sbUNBQW1DLENBQUM7QUFDdkYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQ3BGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUtsRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFB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OztnRUFDcUI7SUFHdEM7UUFEQyxjQUFjLEVBQUU7OzZEQUNrQjtJQUVuQztRQURDLGNBQWMsRUFBRTs7K0RBQ21CO0lBRXBDO1FBREMsY0FBYyxFQUFFOzt1REFDVztJQWs4QzlCLHFCQUFDO0NBQUEsQUE1L0NELElBNC9DQztTQTkrQ1ksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0b3IsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciwgVXJsU2VnbWVudCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElDb21wb25lbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2NvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9mb3JtLWRhdGEtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRm9ybURhdGFUeXBlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9mb3JtLWRhdGEtdHlwZS1jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNwb25zZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvc2VydmljZS1yZXNwb25zZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50JztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSwgT05hdmlnYXRpb25JdGVtIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL29udGltaXplL29udGltaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBTbmFja0JhclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9zbmFja2Jhci5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPRm9ybUluaXRpYWxpemF0aW9uT3B0aW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tZm9ybS1pbml0aWFsaXphdGlvbi1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT0Zvcm1QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tZm9ybS1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uL3R5cGVzL28tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU1FMVHlwZXMgfSBmcm9tICcuLi8uLi91dGlsL3NxbHR5cGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9mb3JtLWNvbnRhaW5lci9vLWZvcm0tY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9pbnB1dC9vLWZvcm0tY29udHJvbC5jbGFzcyc7XG5pbXBvcnQgeyBPRm9ybUNhY2hlQ2xhc3MgfSBmcm9tICcuL2NhY2hlL28tZm9ybS5jYWNoZS5jbGFzcyc7XG5pbXBvcnQgeyBDYW5Db21wb25lbnREZWFjdGl2YXRlLCBDYW5EZWFjdGl2YXRlRm9ybUd1YXJkIH0gZnJvbSAnLi9ndWFyZHMvby1mb3JtLWNhbi1kZWFjdGl2YXRlLmd1YXJkJztcbmltcG9ydCB7IE9Gb3JtTmF2aWdhdGlvbkNsYXNzIH0gZnJvbSAnLi9uYXZpZ2F0aW9uL28tZm9ybS5uYXZpZ2F0aW9uLmNsYXNzJztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHsgT0Zvcm1Ub29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sYmFyL28tZm9ybS10b29sYmFyLmNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBJRm9ybURhdGFDb21wb25lbnRIYXNoIHtcbiAgW2F0dHI6IHN0cmluZ106IElGb3JtRGF0YUNvbXBvbmVudDtcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRk9STSA9IFtcbiAgLy8gc2hvdy1oZWFkZXIgW2Jvb2xlYW5dOiB2aXNpYmlsaXR5IG9mIGZvcm0gdG9vbGJhci4gRGVmYXVsdDogeWVzLlxuICAnc2hvd0hlYWRlcjogc2hvdy1oZWFkZXInLFxuXG4gIC8vIGhlYWRlci1tb2RlIFtzdHJpbmddWyBub25lIHwgZmxvYXRpbmcgXTogcGFpbnRpbmcgbW9kZSBvZiBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6ICdmbG9hdGluZydcbiAgJ2hlYWRlck1vZGU6IGhlYWRlci1tb2RlJyxcblxuICAvLyBoZWFkZXItcG9zaXRpb24gWyB0b3AgfCBib3R0b20gXTogcG9zaXRpb24gb2YgdGhlIGZvcm0gdG9vbGJhci4gRGVmYXVsdDogJ3RvcCdcbiAgJ2hlYWRlclBvc2l0aW9uOiBoZWFkZXItcG9zaXRpb24nLFxuXG4gIC8vIGxhYmVsLWhlYWRlciBbc3RyaW5nXTogZGlzcGxheWFibGUgdGV4dCBvbiBmb3JtIHRvb2xiYXIuIERlZmF1bHQ6ICcnLlxuICAnbGFiZWxoZWFkZXI6IGxhYmVsLWhlYWRlcicsXG5cbiAgLy8gbGFiZWwtaGVhZGVyLWFsaWduIFtzdHJpbmddW3N0YXJ0IHwgY2VudGVyIHwgZW5kXTogYWxpZ25tZW50IG9mIGZvcm0gdG9vbGJhciB0ZXh0LiBEZWZhdWx0OiAnY2VudGVyJ1xuICAnbGFiZWxIZWFkZXJBbGlnbjogbGFiZWwtaGVhZGVyLWFsaWduJyxcblxuICAvLyBoZWFkZXItYWN0aW9ucyBbc3RyaW5nXTogYXZhaWxhYmxlIGFjdGlvbiBidXR0b25zIG9uIGZvcm0gdG9vbGJhciBvZiBzdGFuZGFyZCBDUlVEIG9wZXJhdGlvbnMsIHNlcGFyYXRlZCBieSAnOycuIEF2YWlsYWJsZSBvcHRpb25zIGFyZSBSO0k7VTtEIChSZWZyZXNoLCBJbnNlcnQsIFVwZGF0ZSwgRGVsZXRlKS4gRGVmYXVsdDogUjtJO1U7RFxuICAnaGVhZGVyYWN0aW9uczogaGVhZGVyLWFjdGlvbnMnLFxuXG4gIC8vIHNob3ctaGVhZGVyLWFjdGlvbnMtdGV4dCBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgdGV4dCBvZiBmb3JtIHRvb2xiYXIgYnV0dG9ucy4gRGVmYXVsdCB5ZXNcbiAgJ3Nob3dIZWFkZXJBY3Rpb25zVGV4dDogc2hvdy1oZWFkZXItYWN0aW9ucy10ZXh0JyxcblxuICAvLyBlbnRpdHkgW3N0cmluZ106IGVudGl0eSBvZiB0aGUgc2VydmljZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdlbnRpdHknLFxuXG4gIC8vIGtleXMgW3N0cmluZ106IGVudGl0eSBrZXlzLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2tleXMnLFxuXG4gIC8vIGNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIGVudGl0eSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdjb2x1bW5zJyxcblxuICAvLyBzZXJ2aWNlIFtzdHJpbmddOiBKRUUgc2VydmljZSBwYXRoLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NlcnZpY2UnLFxuXG4gIC8vIHN0YXktaW4tcmVjb3JkLWFmdGVyLWVkaXQgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBzaG93cyBlZGl0IGZvcm0gYWZ0ZXIgZWRpdCBhIHJlY29yZC4gRGVmYXVsdDogZmFsc2U7XG4gICdzdGF5SW5SZWNvcmRBZnRlckVkaXQ6IHN0YXktaW4tcmVjb3JkLWFmdGVyLWVkaXQnLFxuXG4gIC8vIFtzdHJpbmddW25ldyB8IGRldGFpbF06IHNob3dzIHJlc2V0ZWQgZm9ybSBhZnRlciBpbnNlcnQgYSBuZXcgcmVjb3JkIChuZXcpIG9yIHNob3dzIHRoZSBpbnNlcnRlZCByZWNvcmQgYWZ0ZXIgKGRldGFpbClcbiAgJ2FmdGVySW5zZXJ0TW9kZTogYWZ0ZXItaW5zZXJ0LW1vZGUnLFxuXG4gICdzZXJ2aWNlVHlwZSA6IHNlcnZpY2UtdHlwZScsXG5cbiAgJ3F1ZXJ5T25Jbml0IDogcXVlcnktb24taW5pdCcsXG5cbiAgJ3BhcmVudEtleXM6IHBhcmVudC1rZXlzJyxcblxuICAvLyBxdWVyeS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gcXVlcmllcy4gRGVmYXVsdDogcXVlcnkuXG4gICdxdWVyeU1ldGhvZDogcXVlcnktbWV0aG9kJyxcblxuICAvLyBpbnNlcnQtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGluc2VydHMuIERlZmF1bHQ6IGluc2VydC5cbiAgJ2luc2VydE1ldGhvZDogaW5zZXJ0LW1ldGhvZCcsXG5cbiAgLy8gdXBkYXRlLW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSB1cGRhdGVzLiBEZWZhdWx0OiB1cGRhdGUuXG4gICd1cGRhdGVNZXRob2Q6IHVwZGF0ZS1tZXRob2QnLFxuXG4gIC8vIGRlbGV0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gZGVsZXRpb25zLiBEZWZhdWx0OiBkZWxldGUuXG4gICdkZWxldGVNZXRob2Q6IGRlbGV0ZS1tZXRob2QnLFxuXG4gIC8vIGxheW91dC1kaXJlY3Rpb24gW3N0cmluZ11bY29sdW1ufHJvd106IERlZmF1bHQ6IGNvbHVtblxuICAnbGF5b3V0RGlyZWN0aW9uOiBsYXlvdXQtZGlyZWN0aW9uJyxcblxuICAvLyBmeExheW91dEFsaWduIHZhbHVlLiBEZWZhdWx0OiAnc3RhcnQgc3RhcnQnXG4gICdsYXlvdXRBbGlnbjogbGF5b3V0LWFsaWduJyxcblxuICAvLyBlZGl0YWJsZS1kZXRhaWwgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBEZWZhdWx0OiB0cnVlO1xuICAnZWRpdGFibGVEZXRhaWw6IGVkaXRhYmxlLWRldGFpbCcsXG5cbiAgLy8ga2V5cy1zcWwtdHlwZXMgW3N0cmluZ106IGVudGl0eSBrZXlzIHR5cGVzLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2tleXNTcWxUeXBlczoga2V5cy1zcWwtdHlwZXMnLFxuXG4gIC8vIHVuZG8tYnV0dG9uIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogSW5jbHVkZSB1bmRvIGJ1dHRvbiBpbiBmb3JtLXRvb2xiYXIuIERlZmF1bHQ6IHRydWU7XG4gICd1bmRvQnV0dG9uOiB1bmRvLWJ1dHRvbicsXG5cbiAgLy8gc2hvdy1oZWFkZXItbmF2aWdhdGlvbiBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluY2x1ZGUgbmF2aWdhdGlvbnMgYnV0dG9ucyBpbiBmb3JtLXRvb2xiYXIuIERlZmF1bHQ6IGZhbHNlO1xuICAnc2hvd0hlYWRlck5hdmlnYXRpb246IHNob3ctaGVhZGVyLW5hdmlnYXRpb24nLFxuXG4gIC8vIGF0dHJcbiAgJ29hdHRyOmF0dHInLFxuXG4gICdpbmNsdWRlQnJlYWRjcnVtYjogaW5jbHVkZS1icmVhZGNydW1iJyxcblxuICAnZGV0ZWN0Q2hhbmdlc09uQmx1cjogZGV0ZWN0LWNoYW5nZXMtb24tYmx1cicsXG5cbiAgJ2NvbmZpcm1FeGl0OiBjb25maXJtLWV4aXQnLFxuXG4gIC8vIFtmdW5jdGlvbl06IGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gcXVlcnkgZXJyb3IuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVlcnlGYWxsYmFja0Z1bmN0aW9uOiBxdWVyeS1mYWxsYmFjay1mdW5jdGlvbidcbiAgLy8gLFxuXG4gIC8vICdpbnNlcnRGYWxsYmFja0Z1bmN0aW9uOiBpbnNlcnQtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICd1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiB1cGRhdGUtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICdkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiBkZWxldGUtZmFsbGJhY2stZnVuY3Rpb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fRk9STSA9IFtcbiAgJ29uRGF0YUxvYWRlZCcsXG4gICdiZWZvcmVDbG9zZURldGFpbCcsXG4gICdiZWZvcmVHb0VkaXRNb2RlJyxcbiAgJ29uRm9ybU1vZGVDaGFuZ2UnLFxuICAnb25JbnNlcnQnLFxuICAnb25VcGRhdGUnLFxuICAnb25EZWxldGUnLFxuICAnYmVmb3JlSW5zZXJ0TW9kZScsXG4gICdiZWZvcmVVcGRhdGVNb2RlJyxcbiAgJ2JlZm9yZUluaXRpYWxNb2RlJyxcbiAgJ29uSW5zZXJ0TW9kZScsXG4gICdvblVwZGF0ZU1vZGUnLFxuICAnb25Jbml0aWFsTW9kZSdcbl07XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0nLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlclxuICBdLFxuICB0ZW1wbGF0ZVVybDogJy4vby1mb3JtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1mb3JtLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GT1JNLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19GT1JNLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZvcm1dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQ2FuQ29tcG9uZW50RGVhY3RpdmF0ZSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgcHVibGljIHN0YXRpYyBERUZBVUxUX0xBWU9VVF9ESVJFQ1RJT04gPSAnY29sdW1uJztcbiAgcHVibGljIHN0YXRpYyBndWFyZENsYXNzTmFtZSA9ICdDYW5EZWFjdGl2YXRlRm9ybUd1YXJkJztcblxuICAvKiBpbnB1dHMgdmFyaWFibGVzICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dIZWFkZXI6IGJvb2xlYW4gPSB0cnVlO1xuICBoZWFkZXJNb2RlOiBzdHJpbmcgPSAnZmxvYXRpbmcnO1xuICBoZWFkZXJQb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJyA9ICd0b3AnO1xuICBsYWJlbGhlYWRlcjogc3RyaW5nID0gJyc7XG4gIGxhYmVsSGVhZGVyQWxpZ246IHN0cmluZyA9ICdjZW50ZXInO1xuICBoZWFkZXJhY3Rpb25zOiBzdHJpbmcgPSAnJztcbiAgc2hvd0hlYWRlckFjdGlvbnNUZXh0OiBzdHJpbmcgPSAneWVzJztcbiAgZW50aXR5OiBzdHJpbmc7XG4gIGtleXM6IHN0cmluZyA9ICcnO1xuICBjb2x1bW5zOiBzdHJpbmcgPSAnJztcbiAgc2VydmljZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdGF5SW5SZWNvcmRBZnRlckVkaXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgYWZ0ZXJJbnNlcnRNb2RlOiAnbmV3JyB8ICdkZXRhaWwnID0gbnVsbDtcbiAgc2VydmljZVR5cGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHF1ZXJ5T25Jbml0OiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIHBhcmVudEtleXM6IHN0cmluZztcbiAgcHJvdGVjdGVkIHF1ZXJ5TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5RVUVSWV9NRVRIT0Q7XG4gIHByb3RlY3RlZCBpbnNlcnRNZXRob2Q6IHN0cmluZyA9IENvZGVzLklOU0VSVF9NRVRIT0Q7XG4gIHByb3RlY3RlZCB1cGRhdGVNZXRob2Q6IHN0cmluZyA9IENvZGVzLlVQREFURV9NRVRIT0Q7XG4gIHByb3RlY3RlZCBkZWxldGVNZXRob2Q6IHN0cmluZyA9IENvZGVzLkRFTEVURV9NRVRIT0Q7XG4gIHByb3RlY3RlZCBfbGF5b3V0RGlyZWN0aW9uOiBzdHJpbmcgPSBPRm9ybUNvbXBvbmVudC5ERUZBVUxUX0xBWU9VVF9ESVJFQ1RJT047XG4gIHByb3RlY3RlZCBfbGF5b3V0QWxpZ246IHN0cmluZyA9ICdzdGFydCBzdHJldGNoJztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIGVkaXRhYmxlRGV0YWlsOiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIGtleXNTcWxUeXBlczogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICB1bmRvQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0hlYWRlck5hdmlnYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIG9hdHRyOiBzdHJpbmcgPSAnJztcbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5jbHVkZUJyZWFkY3J1bWI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgZGV0ZWN0Q2hhbmdlc09uQmx1cjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGNvbmZpcm1FeGl0OiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHF1ZXJ5RmFsbGJhY2tGdW5jdGlvbjogKGVycm9yOiBhbnkpID0+IHZvaWQ7XG4gIC8vIHB1YmxpYyBpbnNlcnRGYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbjtcbiAgLy8gcHVibGljIHVwZGF0ZUZhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uO1xuICAvLyBwdWJsaWMgZGVsZXRlRmFsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb247XG5cbiAgLyogZW5kIG9mIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICAvKnBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG4gIGlzRGV0YWlsRm9ybTogYm9vbGVhbiA9IGZhbHNlO1xuICBrZXlzQXJyYXk6IHN0cmluZ1tdID0gW107XG4gIGNvbHNBcnJheTogc3RyaW5nW10gPSBbXTtcbiAgZGF0YVNlcnZpY2U6IGFueTtcbiAgX3BLZXlzRXF1aXYgPSB7fTtcbiAga2V5c1NxbFR5cGVzQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgLyogZW5kIG9mIHBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG4gIG9uRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcbiAgYmVmb3JlQ2xvc2VEZXRhaWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGJlZm9yZVVwZGF0ZU1vZGVgIGluc3RlYWRcbiAgICovXG4gIGJlZm9yZUdvRWRpdE1vZGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGJlZm9yZUluc2VydE1vZGUgPSBuZXcgRXZlbnRFbWl0dGVyPG51bGw+KCk7XG4gIGJlZm9yZVVwZGF0ZU1vZGUgPSBuZXcgRXZlbnRFbWl0dGVyPG51bGw+KCk7XG4gIGJlZm9yZUluaXRpYWxNb2RlID0gbmV3IEV2ZW50RW1pdHRlcjxudWxsPigpO1xuICBvbkluc2VydE1vZGUgPSBuZXcgRXZlbnRFbWl0dGVyPG51bGw+KCk7XG4gIG9uVXBkYXRlTW9kZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVsbD4oKTtcbiAgb25Jbml0aWFsTW9kZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVsbD4oKTtcbiAgb25Gb3JtTW9kZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgcHVibGljIG9uSW5zZXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uVXBkYXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRGVsZXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcm90ZWN0ZWQgbG9hZGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGxvYWRpbmc6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBwdWJsaWMgZm9ybURhdGE6IG9iamVjdCA9IHt9O1xuICBwdWJsaWMgbmF2aWdhdGlvbkRhdGE6IEFycmF5PGFueT4gPSBbXTtcbiAgcHVibGljIGN1cnJlbnRJbmRleCA9IDA7XG4gIHB1YmxpYyBtb2RlOiBudW1iZXIgPSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDtcblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcbiAgcHJvdGVjdGVkIHNuYWNrQmFyU2VydmljZTogU25hY2tCYXJTZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBfZm9ybVRvb2xiYXI6IE9Gb3JtVG9vbGJhckNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgX2NvbXBvbmVudHM6IElGb3JtRGF0YUNvbXBvbmVudEhhc2ggPSB7fTtcbiAgcHJvdGVjdGVkIF9jb21wU1FMVHlwZXM6IG9iamVjdCA9IHt9O1xuXG4gIGZvcm1QYXJlbnRLZXlzVmFsdWVzOiBvYmplY3Q7XG5cbiAgcHVibGljIG9uRm9ybUluaXRTdHJlYW06IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgcHJvdGVjdGVkIHJlbG9hZFN0cmVhbTogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcm90ZWN0ZWQgcmVsb2FkU3RyZWFtU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBsb2FkZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGR5bmFtaWNGb3JtU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJvdGVjdGVkIGRlYWN0aXZhdGVHdWFyZDogQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZDtcbiAgcHJvdGVjdGVkIGZvcm1DYWNoZTogT0Zvcm1DYWNoZUNsYXNzO1xuICBwcm90ZWN0ZWQgZm9ybU5hdmlnYXRpb246IE9Gb3JtTmF2aWdhdGlvbkNsYXNzO1xuXG4gIHB1YmxpYyBmb3JtQ29udGFpbmVyOiBPRm9ybUNvbnRhaW5lckNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT0Zvcm1QZXJtaXNzaW9ucztcblxuICBAVmlld0NoaWxkKCdpbm5lckZvcm0nLCB7IHN0YXRpYzogZmFsc2UgfSkgaW5uZXJGb3JtRWw6IEVsZW1lbnRSZWY7XG5cbiAgaWdub3JlRm9ybUNhY2hlS2V5czogQXJyYXk8YW55PiA9IFtdO1xuICBjYW5EaXNjYXJkQ2hhbmdlczogYm9vbGVhbjtcblxuICBwdWJsaWMgc3RhdGljIE1vZGUoKTogYW55IHtcbiAgICBlbnVtIG0ge1xuICAgICAgUVVFUlksXG4gICAgICBJTlNFUlQsXG4gICAgICBVUERBVEUsXG4gICAgICBJTklUSUFMXG4gICAgfVxuICAgIHJldHVybiBtO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmXG4gICkge1xuXG4gICAgdGhpcy5mb3JtQ2FjaGUgPSBuZXcgT0Zvcm1DYWNoZUNsYXNzKHRoaXMpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24gPSBuZXcgT0Zvcm1OYXZpZ2F0aW9uQ2xhc3ModGhpcy5pbmplY3RvciwgdGhpcywgdGhpcy5yb3V0ZXIsIHRoaXMuYWN0Um91dGUpO1xuXG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UgPSBpbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5yZWxvYWRTdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFtcbiAgICAgIHNlbGYub25Gb3JtSW5pdFN0cmVhbS5hc09ic2VydmFibGUoKSxcbiAgICAgIHNlbGYuZm9ybU5hdmlnYXRpb24ubmF2aWdhdGlvblN0cmVhbS5hc09ic2VydmFibGUoKVxuICAgIF0pO1xuXG4gICAgdGhpcy5yZWxvYWRTdHJlYW1TdWJzY3JpcHRpb24gPSB0aGlzLnJlbG9hZFN0cmVhbS5zdWJzY3JpYmUodmFsQXJyID0+IHtcbiAgICAgIGlmIChVdGlsLmlzQXJyYXkodmFsQXJyKSAmJiB2YWxBcnIubGVuZ3RoID09PSAyICYmICFzZWxmLmlzSW5JbnNlcnRNb2RlKCkpIHtcbiAgICAgICAgY29uc3QgdmFsQXJyVmFsdWVzID0gdmFsQXJyWzBdID09PSB0cnVlICYmIHZhbEFyclsxXSA9PT0gdHJ1ZTtcbiAgICAgICAgaWYgKHNlbGYucXVlcnlPbkluaXQgJiYgdmFsQXJyVmFsdWVzKSB7XG4gICAgICAgICAgc2VsZi5yZWxvYWQodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5pbml0aWFsaXplRmllbGRzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZvcm1Db250YWluZXIgPSBpbmplY3Rvci5nZXQoT0Zvcm1Db250YWluZXJDb21wb25lbnQpO1xuICAgICAgdGhpcy5mb3JtQ29udGFpbmVyLnNldEZvcm0odGhpcyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9cbiAgICB9XG4gIH1cblxuICByZWdpc3RlckZvcm1Db21wb25lbnQoY29tcDogYW55KSB7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgaWYgKCFjb21wLmlzQXV0b21hdGljUmVnaXN0ZXJpbmcoKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jb21wb25lbnRzLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgY29tcC5yZXBlYXRlZEF0dHIgPSB0cnVlO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZXJlIGlzIGFscmVhZHkgYSBjb21wb25lbnQgcmVnaXN0ZXJlZCBpbiB0aGUgZm9ybSB3aXRoIHRoZSBhdHRyOiAnICsgYXR0cik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29tcG9uZW50c1thdHRyXSA9IGNvbXA7XG4gICAgICAgIC8vIFNldHRpbmcgcGFyZW50IGtleSB2YWx1ZXMuLi5cbiAgICAgICAgaWYgKHRoaXMuZm9ybVBhcmVudEtleXNWYWx1ZXMgJiYgdGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlc1thdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgdmFsID0gdGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlc1thdHRyXTtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnRzW2F0dHJdLnNldFZhbHVlKHZhbCwge1xuICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAqIFRPRE8uIENoZWNrIGl0ISEhXG4gICAgICAgICogRW4gdW4gZm9ybXVsYXJpbyBjb24gdGFicywgY3VhbmRvIHNlIGNhbWJpYSBkZSB1bm8gYSBvdHJvLCBzZSBkZXN0cnV5ZW4gbGFzIHZpc3Rhc1xuICAgICAgICAqIGRlIGxvcyBjb21wb25lbnRlcyBoaWpvIGRlbCBmb3JtdWxhcmlvLlxuICAgICAgICAqIGZvcm1EYXRhQ2FjaGUgY29udGllbmUgbG9zIHZhbG9yZXMgKG9yaWdpbmFsZXMgw7MgZWRpdGFkb3MpIGRlIGxvcyBjYW1wb3MgZGVsIGZvcm11bGFyaW8uXG4gICAgICAgICogTGEgaWRlYSBlcyBhc2lnbmFyIGVzZSB2YWxvciBhbCBjYW1wbyBjdWFuZG8gc2UgcmVnaXN0cmUgZGUgbnVldm8gKEhheSBxdWUgYXNlZ3VyYXIgZWwgcHJvY2Vzb1xuICAgICAgICAqIHBhcmEgcXVlIHPDs2xvIHNlYSBjdWFuZG8gc2UgcmVnaXN0cmEgZGUgbnVldm8gOykgKVxuICAgICAgICAqL1xuICAgICAgICBjb25zdCBjYWNoZWRWYWx1ZSA9IHRoaXMuZm9ybUNhY2hlLmdldENhY2hlZFZhbHVlKGF0dHIpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2FjaGVkVmFsdWUpICYmIHRoaXMuZ2V0RGF0YVZhbHVlcygpICYmIHRoaXMuX2NvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnRzW2F0dHJdLnNldFZhbHVlKGNhY2hlZFZhbHVlLCB7XG4gICAgICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxuICAgICAgICAgICAgZW1pdEV2ZW50OiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJTUUxUeXBlRm9ybUNvbXBvbmVudChjb21wOiBJRm9ybURhdGFUeXBlQ29tcG9uZW50KSB7XG4gICAgaWYgKChjb21wIGFzIGFueSkucmVwZWF0ZWRBdHRyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChjb21wKSB7XG4gICAgICBjb25zdCB0eXBlID0gY29tcC5nZXRTUUxUeXBlKCk7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmICh0eXBlICE9PSBTUUxUeXBlcy5PVEhFUiAmJiBhdHRyICYmIGF0dHIubGVuZ3RoID4gMCAmJiB0aGlzLmlnbm9yZUZvcm1DYWNoZUtleXMuaW5kZXhPZihhdHRyKSA9PT0gLTEpIHtcbiAgICAgICAgLy8gUmlnaHQgbm93IGp1c3Qgc3RvcmUgdmFsdWVzIGRpZmZlcmVudCBvZiAnT1RIRVInXG4gICAgICAgIHRoaXMuX2NvbXBTUUxUeXBlc1thdHRyXSA9IHR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJGb3JtQ29udHJvbENvbXBvbmVudChjb21wOiBJRm9ybURhdGFDb21wb25lbnQpIHtcbiAgICBpZiAoKGNvbXAgYXMgYW55KS5yZXBlYXRlZEF0dHIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbnN0IGF0dHIgPSBjb21wLmdldEF0dHJpYnV0ZSgpO1xuICAgICAgaWYgKGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2w6IEZvcm1Db250cm9sID0gY29tcC5nZXRDb250cm9sKCk7XG4gICAgICAgIGlmIChjb250cm9sKSB7XG4gICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVnaXN0ZXJDb250cm9sKGF0dHIsIGNvbnRyb2wpO1xuICAgICAgICAgIGlmICghY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMuaWdub3JlRm9ybUNhY2hlS2V5cy5wdXNoKGNvbXAuZ2V0QXR0cmlidXRlKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVucmVnaXN0ZXJGb3JtQ29tcG9uZW50KGNvbXA6IElDb21wb25lbnQpIHtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAoYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDAgJiYgdGhpcy5fY29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1thdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1bnJlZ2lzdGVyRm9ybUNvbnRyb2xDb21wb25lbnQoY29tcDogSUZvcm1EYXRhQ29tcG9uZW50KSB7XG4gICAgaWYgKGNvbXAgJiYgY29tcC5pc0F1dG9tYXRpY1JlZ2lzdGVyaW5nKCkpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2w6IEZvcm1Db250cm9sID0gY29tcC5nZXRDb250cm9sKCk7XG4gICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgIGlmIChjb250cm9sICYmIGF0dHIgJiYgYXR0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2woYXR0cik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdW5yZWdpc3RlclNRTFR5cGVGb3JtQ29tcG9uZW50KGNvbXA6IElGb3JtRGF0YVR5cGVDb21wb25lbnQpIHtcbiAgICBpZiAoY29tcCkge1xuICAgICAgY29uc3QgYXR0ciA9IGNvbXAuZ2V0QXR0cmlidXRlKCk7XG4gICAgICBpZiAoYXR0ciAmJiBhdHRyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbXBTUUxUeXBlc1thdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWdpc3RlclRvb2xiYXIoZlRvb2xiYXI6IE9Gb3JtVG9vbGJhckNvbXBvbmVudCkge1xuICAgIGlmIChmVG9vbGJhcikge1xuICAgICAgdGhpcy5fZm9ybVRvb2xiYXIgPSBmVG9vbGJhcjtcbiAgICAgIHRoaXMuX2Zvcm1Ub29sYmFyLmlzRGV0YWlsID0gdGhpcy5pc0RldGFpbEZvcm07XG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50cygpOiBJRm9ybURhdGFDb21wb25lbnRIYXNoIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50cztcbiAgfVxuXG4gIHB1YmxpYyBsb2FkKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgem9uZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgY29uc3QgbG9hZE9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgIH0sIDI1MCk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc2VsZi5sb2FkaW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbG9hZE9ic2VydmFibGUuc3Vic2NyaWJlKHZhbCA9PiB7XG4gICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHNlbGYubG9hZGluZ1N1YmplY3QubmV4dCh2YWwgYXMgYm9vbGVhbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0RGF0YVZhbHVlKGF0dHI6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmlzSW5JbnNlcnRNb2RlKCkpIHtcbiAgICAgIGNvbnN0IHVybFBhcmFtcyA9IHRoaXMuZm9ybU5hdmlnYXRpb24uZ2V0RmlsdGVyRnJvbVVybFBhcmFtcygpO1xuICAgICAgY29uc3QgdmFsID0gdGhpcy5mb3JtR3JvdXAudmFsdWVbYXR0cl0gfHwgdXJsUGFyYW1zW2F0dHJdO1xuICAgICAgcmV0dXJuIG5ldyBPRm9ybVZhbHVlKHZhbCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSW5Jbml0aWFsTW9kZSgpICYmICF0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSkge1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZm9ybURhdGE7XG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgIHJldHVybiBkYXRhW2F0dHJdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0luVXBkYXRlTW9kZSgpIHx8IHRoaXMuaXNFZGl0YWJsZURldGFpbCgpKSB7XG4gICAgICBpZiAodGhpcy5mb3JtRGF0YSAmJiBPYmplY3Qua2V5cyh0aGlzLmZvcm1EYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHRoaXMuZm9ybUNhY2hlLmdldENhY2hlZFZhbHVlKGF0dHIpO1xuICAgICAgICBpZiAodGhpcy5mb3JtR3JvdXAuZGlydHkgJiYgdmFsKSB7XG4gICAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgT0Zvcm1WYWx1ZSh2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFJldHVybiBvcmlnaW5hbCB2YWx1ZSBzdG9yZWQgaW50byBmb3JtIGRhdGEuLi5cbiAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5mb3JtRGF0YTtcbiAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVthdHRyXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPRm9ybVZhbHVlKCk7XG4gIH1cblxuICBnZXREYXRhVmFsdWVzKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm1EYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgZm9ybSBkYXRhLiBUaGUgZGF0YSByZWxhdGVkIHRvIHVybCBwYXJhbXMgYW5kIHBhcmVudCBrZXlzIHJlbWFpbiB1bmNoYW5nZWQuXG4gICAqL1xuICBjbGVhckRhdGEoKSB7XG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5mb3JtTmF2aWdhdGlvbi5nZXRGaWx0ZXJGcm9tVXJsUGFyYW1zKCk7XG4gICAgdGhpcy5mb3JtR3JvdXAucmVzZXQoe30sIHtcbiAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICB9KTtcbiAgICB0aGlzLnNldERhdGEoZmlsdGVyKTtcbiAgfVxuXG4gIGNhbkRlYWN0aXZhdGUoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB8IFByb21pc2U8Ym9vbGVhbj4gfCBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuY29uZmlybUV4aXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBjYW5EaXNjYXJkQ2hhbmdlcyA9IHRoaXMuY2FuRGlzY2FyZENoYW5nZXM7XG4gICAgdGhpcy5jYW5EaXNjYXJkQ2hhbmdlcyA9IGZhbHNlO1xuICAgIHJldHVybiBjYW5EaXNjYXJkQ2hhbmdlcyB8fCB0aGlzLnNob3dDb25maXJtRGlzY2FyZENoYW5nZXMoKTtcbiAgfVxuXG4gIHNob3dDb25maXJtRGlzY2FyZENoYW5nZXMoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb24uc2hvd0NvbmZpcm1EaXNjYXJkQ2hhbmdlcygpO1xuICB9XG5cbiAgZXhlY3V0ZVRvb2xiYXJBY3Rpb24oYWN0aW9uOiBzdHJpbmcsIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgY2FzZSBDb2Rlcy5CQUNLX0FDVElPTjogdGhpcy5iYWNrKCk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5DTE9TRV9ERVRBSUxfQUNUSU9OOiB0aGlzLmNsb3NlRGV0YWlsKG9wdGlvbnMpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuUkVMT0FEX0FDVElPTjogdGhpcy5yZWxvYWQodHJ1ZSk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5HT19JTlNFUlRfQUNUSU9OOiB0aGlzLmdvSW5zZXJ0TW9kZShvcHRpb25zKTsgYnJlYWs7XG4gICAgICBjYXNlIENvZGVzLklOU0VSVF9BQ1RJT046IHRoaXMuaW5zZXJ0KCk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5HT19FRElUX0FDVElPTjogdGhpcy5nb0VkaXRNb2RlKG9wdGlvbnMpOyBicmVhaztcbiAgICAgIGNhc2UgQ29kZXMuRURJVF9BQ1RJT046IHRoaXMudXBkYXRlKCk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5VTkRPX0xBU1RfQ0hBTkdFX0FDVElPTjogdGhpcy51bmRvKCk7IGJyZWFrO1xuICAgICAgY2FzZSBDb2Rlcy5ERUxFVEVfQUNUSU9OOiByZXR1cm4gdGhpcy5kZWxldGUoKTtcbiAgICAgIGRlZmF1bHQ6IGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5hZGREZWFjdGl2YXRlR3VhcmQoKTtcblxuICAgIHRoaXMuZm9ybUdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG5cbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgYWRkRGVhY3RpdmF0ZUd1YXJkKCkge1xuICAgIGlmICh0aGlzLmlzSW5Jbml0aWFsTW9kZSgpICYmICF0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuYWN0Um91dGUgfHwgIXRoaXMuYWN0Um91dGUucm91dGVDb25maWcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZWFjdGl2YXRlR3VhcmQgPSB0aGlzLmluamVjdG9yLmdldChDYW5EZWFjdGl2YXRlRm9ybUd1YXJkKTtcbiAgICB0aGlzLmRlYWN0aXZhdGVHdWFyZC5zZXRGb3JtKHRoaXMpO1xuICAgIGNvbnN0IGNhbkRlYWN0aXZhdGVBcnJheSA9ICh0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUgfHwgW10pO1xuICAgIGxldCBwcmV2aW91c2x5QWRkZWQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuRGVhY3RpdmF0ZUFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwcmV2aW91c2x5QWRkZWQgPSAoKGNhbkRlYWN0aXZhdGVBcnJheVtpXS5oYXNPd25Qcm9wZXJ0eSgnQ0xBU1NOQU1FJykgJiYgY2FuRGVhY3RpdmF0ZUFycmF5W2ldLkNMQVNTTkFNRSkgPT09IE9Gb3JtQ29tcG9uZW50Lmd1YXJkQ2xhc3NOYW1lKTtcbiAgICAgIGlmIChwcmV2aW91c2x5QWRkZWQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcHJldmlvdXNseUFkZGVkKSB7XG4gICAgICBjYW5EZWFjdGl2YXRlQXJyYXkucHVzaCh0aGlzLmRlYWN0aXZhdGVHdWFyZC5jb25zdHJ1Y3Rvcik7XG4gICAgICB0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUgPSBjYW5EZWFjdGl2YXRlQXJyYXk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveURlYWN0aXZhdGVHdWFyZCgpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCF0aGlzLmRlYWN0aXZhdGVHdWFyZCB8fCAhdGhpcy5hY3RSb3V0ZSB8fCAhdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZyB8fCAhdGhpcy5hY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jYW5EZWFjdGl2YXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVhY3RpdmF0ZUd1YXJkLnNldEZvcm0odW5kZWZpbmVkKTtcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZVtpXS5uYW1lID09PSBPRm9ybUNvbXBvbmVudC5ndWFyZENsYXNzTmFtZSkge1xuICAgICAgICAgIHRoaXMuYWN0Um91dGUucm91dGVDb25maWcuY2FuRGVhY3RpdmF0ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmFjdFJvdXRlLnJvdXRlQ29uZmlnLmNhbkRlYWN0aXZhdGU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9cbiAgICB9XG4gIH1cblxuICBoYXNEZWFjdGl2YXRlR3VhcmQoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGVhY3RpdmF0ZUd1YXJkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbmd1bGFyIG1ldGhvZHNcbiAgICovXG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAodGhpcy5oZWFkZXJhY3Rpb25zID09PSAnYWxsJykge1xuICAgICAgdGhpcy5oZWFkZXJhY3Rpb25zID0gJ1I7STtVO0QnO1xuICAgIH1cbiAgICB0aGlzLmtleXNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmtleXMsIHRydWUpO1xuICAgIHRoaXMuY29sc0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMuY29sdW1ucywgdHJ1ZSk7XG4gICAgY29uc3QgcGtBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnBhcmVudEtleXMpO1xuICAgIHRoaXMuX3BLZXlzRXF1aXYgPSBVdGlsLnBhcnNlUGFyZW50S2V5c0VxdWl2YWxlbmNlcyhwa0FycmF5KTtcbiAgICB0aGlzLmtleXNTcWxUeXBlc0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMua2V5c1NxbFR5cGVzKTtcblxuICAgIHRoaXMuY29uZmlndXJlU2VydmljZSgpO1xuXG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zdWJzY3JpYmVUb1F1ZXJ5UGFyYW1zKCk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zdWJzY3JpYmVUb1VybFBhcmFtcygpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uc3Vic2NyaWJlVG9VcmwoKTtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN1YnNjcmliZVRvQ2FjaGVDaGFuZ2VzKHRoaXMuZm9ybUNhY2hlLm9uQ2FjaGVFbXB0eVN0YXRlQ2hhbmdlcyk7XG5cbiAgICBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZSkge1xuICAgICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5vblZpc2libGVDaGFuZ2UodmlzaWJsZSA9PiB7XG4gICAgICAgIHNlbGYuc2hvd0hlYWRlciA9IHZpc2libGU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGUgPSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5JVElBTDtcblxuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zU2VydmljZS5nZXRGb3JtUGVybWlzc2lvbnModGhpcy5vYXR0ciwgdGhpcy5hY3RSb3V0ZSk7XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gaWYgKHR5cGVvZiB0aGlzLmluc2VydEZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyAgIHRoaXMuaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAvLyB9XG4gICAgLy8gaWYgKHR5cGVvZiB0aGlzLnVwZGF0ZUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyAgIHRoaXMudXBkYXRlRmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAvLyB9XG4gICAgLy8gaWYgKHR5cGVvZiB0aGlzLmRlbGV0ZUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyAgIHRoaXMuZGVsZXRlRmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAvLyB9XG4gIH1cblxuICByZWluaXRpYWxpemUob3B0aW9uczogT0Zvcm1Jbml0aWFsaXphdGlvbk9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyAmJiBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsb25lZE9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBjbG9uZWRPcHRzKSB7XG4gICAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgdGhpc1twcm9wXSA9IGNsb25lZE9wdHNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgY29uZmlndXJlU2VydmljZSgpIHtcbiAgICBsZXQgbG9hZGluZ1NlcnZpY2U6IGFueSA9IE9udGltaXplU2VydmljZTtcbiAgICBpZiAodGhpcy5zZXJ2aWNlVHlwZSkge1xuICAgICAgbG9hZGluZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VUeXBlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KGxvYWRpbmdTZXJ2aWNlKTtcbiAgICAgIGlmIChVdGlsLmlzRGF0YVNlcnZpY2UodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgICAgY29uc3Qgc2VydmljZUNmZyA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKHRoaXMuc2VydmljZSk7XG4gICAgICAgIGlmICh0aGlzLmVudGl0eSkge1xuICAgICAgICAgIHNlcnZpY2VDZmcuZW50aXR5ID0gdGhpcy5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU2VydmljZS5jb25maWd1cmVTZXJ2aWNlKHNlcnZpY2VDZmcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnJlbG9hZFN0cmVhbVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5yZWxvYWRTdHJlYW1TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucXVlcnlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmZvcm1DYWNoZS5kZXN0cm95KCk7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5kZXN0cm95KCk7XG4gICAgdGhpcy5kZXN0cm95RGVhY3RpdmF0ZUd1YXJkKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmRldGVybWluYXRlRm9ybU1vZGUoKTtcbiAgICAgIHRoaXMub25Gb3JtSW5pdFN0cmVhbS5lbWl0KHRydWUpO1xuICAgIH0sIDApO1xuICB9XG5cbiAgLypcbiAgICogSW5uZXIgbWV0aG9kc1xuICAgKi9cblxuICBfc2V0Q29tcG9uZW50c0VkaXRhYmxlKHN0YXRlOiBib29sZWFuKSB7XG4gICAgY29uc3QgY29tcG9uZW50czogYW55ID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgT2JqZWN0LmtleXMoY29tcG9uZW50cykuZm9yRWFjaChjb21wS2V5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcEtleV07XG4gICAgICBjb21wb25lbnQuaXNSZWFkT25seSA9ICFzdGF0ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZvcm0gb3BlcmF0aW9uIG1vZGUuXG4gICAqIEBwYXJhbSBtb2RlIFRoZSBtb2RlIHRvIGJlIGVzdGFibGlzaGVkXG4gICAqL1xuICBzZXRGb3JtTW9kZShtb2RlOiBudW1iZXIpIHtcbiAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUw6XG4gICAgICAgIHRoaXMuYmVmb3JlSW5pdGlhbE1vZGUuZW1pdCgpO1xuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICBpZiAodGhpcy5fZm9ybVRvb2xiYXIpIHtcbiAgICAgICAgICB0aGlzLl9mb3JtVG9vbGJhci5zZXRJbml0aWFsTW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0aGlzLmlzRWRpdGFibGVEZXRhaWwoKSk7XG4gICAgICAgIHRoaXMub25Gb3JtTW9kZUNoYW5nZS5lbWl0KHRoaXMubW9kZSk7XG4gICAgICAgIHRoaXMub25Jbml0aWFsTW9kZS5lbWl0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5TRVJUOlxuICAgICAgICB0aGlzLmJlZm9yZUluc2VydE1vZGUuZW1pdCgpO1xuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICBpZiAodGhpcy5fZm9ybVRvb2xiYXIpIHtcbiAgICAgICAgICB0aGlzLl9mb3JtVG9vbGJhci5zZXRJbnNlcnRNb2RlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICAgICAgdGhpcy5fc2V0Q29tcG9uZW50c0VkaXRhYmxlKHRydWUpO1xuICAgICAgICB0aGlzLm9uRm9ybU1vZGVDaGFuZ2UuZW1pdCh0aGlzLm1vZGUpO1xuICAgICAgICB0aGlzLm9uSW5zZXJ0TW9kZS5lbWl0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuVVBEQVRFOlxuICAgICAgICB0aGlzLmJlZm9yZVVwZGF0ZU1vZGUuZW1pdCgpO1xuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICBpZiAodGhpcy5fZm9ybVRvb2xiYXIpIHtcbiAgICAgICAgICB0aGlzLl9mb3JtVG9vbGJhci5zZXRFZGl0TW9kZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgICAgICAgdGhpcy5vbkZvcm1Nb2RlQ2hhbmdlLmVtaXQodGhpcy5tb2RlKTtcbiAgICAgICAgdGhpcy5vblVwZGF0ZU1vZGUuZW1pdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLlFVRVJZOlxuICAgICAgICBjb25zb2xlLmVycm9yKCdGb3JtIFFVRVJZIG1vZGUgaXMgbm90IGltcGxlbWVudGVkJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgc2V0RGF0YShkYXRhKTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNBcnJheShkYXRhKSkge1xuICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tPRm9ybUNvbXBvbmVudF0gRm9ybSBkYXRhIGhhcyBtb3JlIHRoYW4gYSBzaW5nbGUgcmVjb3JkLiBTdG9yaW5nIGVtcHR5IGRhdGEnKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGN1cnJlbnREYXRhID0gZGF0YS5sZW5ndGggPT09IDEgPyBkYXRhWzBdIDoge307XG4gICAgICB0aGlzLl91cGRhdGVGb3JtRGF0YSh0aGlzLnRvRm9ybVZhbHVlRGF0YShjdXJyZW50RGF0YSkpO1xuICAgICAgdGhpcy5fZW1pdERhdGEoY3VycmVudERhdGEpO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChkYXRhKSkge1xuICAgICAgdGhpcy5fdXBkYXRlRm9ybURhdGEodGhpcy50b0Zvcm1WYWx1ZURhdGEoZGF0YSkpO1xuICAgICAgdGhpcy5fZW1pdERhdGEoZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignRm9ybSBoYXMgcmVjZWl2ZWQgbm90IHN1cHBvcnRlZCBzZXJ2aWNlIGRhdGEuIFN1cHBvcnRlZCBkYXRhIGFyZSBBcnJheSBvciBPYmplY3QnKTtcbiAgICAgIHRoaXMuX3VwZGF0ZUZvcm1EYXRhKHt9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBzZXREYXRhKGRhdGEpYCBpbnN0ZWFkXG4gICAqL1xuICBfc2V0RGF0YShkYXRhKSB7XG4gICAgY29uc29sZS53YXJuKCdNZXRob2QgYE9Gb3JtQ29tcG9uZW50Ll9zZXREYXRhYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGBzZXREYXRhYCBpbnN0ZWFkJyk7XG4gICAgdGhpcy5zZXREYXRhKGRhdGEpO1xuICB9XG5cbiAgX2VtaXREYXRhKGRhdGEpIHtcbiAgICB0aGlzLm9uRGF0YUxvYWRlZC5lbWl0KGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYmFjaygpYCBpbnN0ZWFkXG4gICAqL1xuICBfYmFja0FjdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2JhY2tBY3Rpb25gIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnVydXRlLiBVc2UgYGJhY2tgIGluc3RlYWQnKTtcbiAgICB0aGlzLmJhY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZSBiYWNrXG4gICAqL1xuICBiYWNrKCkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24ubmF2aWdhdGVCYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBjbG9zZURldGFpbChvcHRpb25zPzogYW55KWAgaW5zdGVhZFxuICAgKi9cbiAgX2Nsb3NlRGV0YWlsQWN0aW9uKG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2Nsb3NlRGV0YWlsQWN0aW9uYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGBjbG9zZURldGFpbGAgaW5zdGVhZCcpO1xuICAgIHRoaXMuY2xvc2VEZXRhaWwob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2UgY3VycmVudCBkZXRhaWwgZm9ybVxuICAgKi9cbiAgY2xvc2VEZXRhaWwob3B0aW9ucz86IGFueSkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24uY2xvc2VEZXRhaWxBY3Rpb24ob3B0aW9ucyk7XG4gIH1cblxuICBfc3RheUluUmVjb3JkQWZ0ZXJJbnNlcnQoaW5zZXJ0ZWRLZXlzOiBvYmplY3QpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLnN0YXlJblJlY29yZEFmdGVySW5zZXJ0KGluc2VydGVkS2V5cyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGByZWxvYWQodXNlRmlsdGVyOiBib29sZWFuID0gZmFsc2UpYCBpbnN0ZWFkXG4gICAqL1xuICBfcmVsb2FkQWN0aW9uKHVzZUZpbHRlcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc29sZS53YXJuKCdNZXRob2QgYE9Gb3JtQ29tcG9uZW50Ll9yZWxvYWRBY3Rpb25gIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnVydXRlLiBVc2UgYHJlbG9hZGAgaW5zdGVhZCcpO1xuICAgIHRoaXMucmVsb2FkKHVzZUZpbHRlcik7XG4gIH1cblxuICAvKipcbiAgICogUmVsb2FkIHRoZSBmb3JtIGRhdGFcbiAgICovXG4gIHJlbG9hZCh1c2VGaWx0ZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGxldCBmaWx0ZXIgPSB7fTtcbiAgICBpZiAodXNlRmlsdGVyKSB7XG4gICAgICBmaWx0ZXIgPSB0aGlzLmdldEN1cnJlbnRLZXlzVmFsdWVzKCk7XG4gICAgfVxuICAgIHRoaXMucXVlcnlEYXRhKGZpbHRlcik7XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvICdpbnNlcnQnIG1vZGVcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBnb0luc2VydE1vZGUob3B0aW9ucz86IGFueSlgIGluc3RlYWRcbiAgICovXG4gIF9nb0luc2VydE1vZGUob3B0aW9ucz86IGFueSkge1xuICAgIGNvbnNvbGUud2FybignTWV0aG9kIGBPRm9ybUNvbXBvbmVudC5fZ29JbnNlcnRNb2RlYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGBnb0luc2VydE1vZGVgIGluc3RlYWQnKTtcbiAgICB0aGlzLmdvSW5zZXJ0TW9kZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gJ2luc2VydCcgbW9kZVxuICAgKi9cbiAgZ29JbnNlcnRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdvSW5zZXJ0TW9kZShvcHRpb25zKTtcbiAgfVxuXG4gIF9jbGVhckZvcm1BZnRlckluc2VydCgpIHtcbiAgICB0aGlzLmNsZWFyRGF0YSgpO1xuICAgIHRoaXMuX3NldENvbXBvbmVudHNFZGl0YWJsZSh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBpbnNlcnQgYWN0aW9uLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGluc2VydCgpYCBpbnN0ZWFkXG4gICAqL1xuICBfaW5zZXJ0QWN0aW9uKCkge1xuICAgIGNvbnNvbGUud2FybignTWV0aG9kIGBPRm9ybUNvbXBvbmVudC5faW5zZXJ0QWN0aW9uYCBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1cnV0ZS4gVXNlIGBpbnNlcnRgIGluc3RlYWQnKTtcbiAgICB0aGlzLmluc2VydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGluc2VydCBhY3Rpb24uXG4gICAqL1xuICBpbnNlcnQoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goKGNvbnRyb2wpID0+IHtcbiAgICAgIHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzW2NvbnRyb2xdLm1hcmtBc1RvdWNoZWQoKTtcbiAgICB9KTtcblxuICAgIGlmICghdGhpcy5mb3JtR3JvdXAudmFsaWQpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRk9STV9WQUxJREFUSU9OX0VSUk9SJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9JbnNlcnQoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk7XG4gICAgdGhpcy5pbnNlcnREYXRhKHZhbHVlcywgc3FsVHlwZXMpLnN1YnNjcmliZShyZXNwID0+IHtcbiAgICAgIHNlbGYucG9zdENvcnJlY3RJbnNlcnQocmVzcCk7XG4gICAgICBzZWxmLmZvcm1DYWNoZS5zZXRDYWNoZVNuYXBzaG90KCk7XG4gICAgICBzZWxmLm1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk7XG4gICAgICBpZiAoc2VsZi5hZnRlckluc2VydE1vZGUgPT09ICdkZXRhaWwnKSB7XG4gICAgICAgIHNlbGYuX3N0YXlJblJlY29yZEFmdGVySW5zZXJ0KHJlc3ApO1xuICAgICAgfSBlbHNlIGlmIChzZWxmLmFmdGVySW5zZXJ0TW9kZSA9PT0gJ25ldycpIHtcbiAgICAgICAgdGhpcy5fY2xlYXJGb3JtQWZ0ZXJJbnNlcnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuY2xvc2VEZXRhaWwoKTtcbiAgICAgIH1cbiAgICB9LCBlcnJvciA9PiB7XG4gICAgICBzZWxmLnBvc3RJbmNvcnJlY3RJbnNlcnQoZXJyb3IpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byAnZWRpdCcgbW9kZVxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGdvRWRpdE1vZGUob3B0aW9ucz86IGFueSlgIGluc3RlYWRcbiAgICovXG4gIF9nb0VkaXRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2dvRWRpdE1vZGVgIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnVydXRlLiBVc2UgYGdvRWRpdE1vZGVgIGluc3RlYWQnKTtcbiAgICB0aGlzLmdvRWRpdE1vZGUob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvICdlZGl0JyBtb2RlXG4gICAqL1xuICBnb0VkaXRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdvRWRpdE1vZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyAnZWRpdCcgYWN0aW9uXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgdXBkYXRlKClgIGluc3RlYWRcbiAgICovXG4gIF9lZGl0QWN0aW9uKCkge1xuICAgIGNvbnNvbGUud2FybignTWV0aG9kIGBPRm9ybUNvbXBvbmVudC5fZWRpdEFjdGlvbmAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXJ1dGUuIFVzZSBgdXBkYXRlYCBpbnN0ZWFkJyk7XG4gICAgdGhpcy51cGRhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyAnZWRpdCcgYWN0aW9uXG4gICAqL1xuICB1cGRhdGUoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpLmZvckVhY2goXG4gICAgICAoY29udHJvbCkgPT4ge1xuICAgICAgICB0aGlzLmZvcm1Hcm91cC5jb250cm9sc1tjb250cm9sXS5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIGlmICghdGhpcy5mb3JtR3JvdXAudmFsaWQpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRk9STV9WQUxJREFUSU9OX0VSUk9SJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gcmV0cmlldmluZyBrZXlzLi4uXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5nZXRLZXlzVmFsdWVzKCk7XG5cbiAgICAvLyByZXRyaWV2aW5nIHZhbHVlcyB0byB1cGRhdGUuLi5cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb1VwZGF0ZSgpO1xuICAgIGNvbnN0IHNxbFR5cGVzID0gdGhpcy5nZXRBdHRyaWJ1dGVzU1FMVHlwZXMoKTtcblxuICAgIGlmIChPYmplY3Qua2V5cyh2YWx1ZXMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gTm90aGluZyB0byB1cGRhdGVcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnSU5GTycsICdNRVNTQUdFUy5GT1JNX05PVEhJTkdfVE9fVVBEQVRFX0lORk8nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpbnZva2UgdXBkYXRlIG1ldGhvZC4uLlxuICAgIHRoaXMudXBkYXRlRGF0YShmaWx0ZXIsIHZhbHVlcywgc3FsVHlwZXMpLnN1YnNjcmliZShyZXNwID0+IHtcbiAgICAgIHNlbGYucG9zdENvcnJlY3RVcGRhdGUocmVzcCk7XG4gICAgICBzZWxmLmZvcm1DYWNoZS5zZXRDYWNoZVNuYXBzaG90KCk7XG4gICAgICBzZWxmLm1hcmtGb3JtTGF5b3V0TWFuYWdlclRvVXBkYXRlKCk7XG4gICAgICBpZiAoc2VsZi5zdGF5SW5SZWNvcmRBZnRlckVkaXQpIHtcbiAgICAgICAgc2VsZi5yZWxvYWQodHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmNsb3NlRGV0YWlsKCk7XG4gICAgICB9XG4gICAgfSwgZXJyb3IgPT4ge1xuICAgICAgc2VsZi5wb3N0SW5jb3JyZWN0VXBkYXRlKGVycm9yKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyAnZGVsZXRlJyBhY3Rpb25cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBkZWxldGUoKWAgaW5zdGVhZFxuICAgKi9cbiAgX2RlbGV0ZUFjdGlvbigpIHtcbiAgICBjb25zb2xlLndhcm4oJ01ldGhvZCBgT0Zvcm1Db21wb25lbnQuX2RlbGV0ZUFjdGlvbmAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXJ1dGUuIFVzZSBgZGVsZXRlYCBpbnN0ZWFkJyk7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgJ2RlbGV0ZScgYWN0aW9uXG4gICAqL1xuICBkZWxldGUoKSB7XG4gICAgY29uc3QgZmlsdGVyID0gdGhpcy5nZXRLZXlzVmFsdWVzKCk7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlRGF0YShmaWx0ZXIpO1xuICB9XG5cbiAgLypcbiAgVXRpbGl0eSBtZXRob2RzXG4gICovXG5cbiAgcXVlcnlEYXRhKGZpbHRlcikge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignT0Zvcm1Db21wb25lbnQ6IG5vIHNlcnZpY2UgY29uZmlndXJlZCEgYWJvcnRpbmcgcXVlcnknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChmaWx0ZXIpIHx8IE9iamVjdC5rZXlzKGZpbHRlcikubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ09Gb3JtQ29tcG9uZW50OiBubyBmaWx0ZXIgY29uZmlndXJlZCEgYWJvcnRpbmcgcXVlcnknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5mb3JtQ2FjaGUucmVzdGFydENhY2hlKCk7XG4gICAgdGhpcy5jbGVhckNvbXBvbmVudHNPbGRWYWx1ZSgpO1xuICAgIGlmICh0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBhdiA9IHRoaXMuZ2V0QXR0cmlidXRlc1RvUXVlcnkoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IHRoaXMuZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCk7XG4gICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbiA9IHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5xdWVyeU1ldGhvZF0oZmlsdGVyLCBhdiwgdGhpcy5lbnRpdHksIHNxbFR5cGVzKVxuICAgICAgLnN1YnNjcmliZSgocmVzcDogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGlmIChyZXNwLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhKHJlc3AuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlRm9ybURhdGEoe30pO1xuICAgICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfUVVFUlknKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFUlJPUjogJyArIHJlc3AubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlRm9ybURhdGEoe30pO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24pKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24oZXJyKTtcbiAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgZXJyLnN0YXR1c1RleHQpIHtcbiAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgZXJyLnN0YXR1c1RleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfUVVFUlknKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVG9RdWVyeSgpOiBBcnJheTxhbnk+IHtcbiAgICBsZXQgYXR0cmlidXRlczogQXJyYXk8YW55PiA9IFtdO1xuICAgIC8vIGFkZCBmb3JtIGtleXMuLi5cbiAgICBpZiAodGhpcy5rZXlzQXJyYXkgJiYgdGhpcy5rZXlzQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgYXR0cmlidXRlcy5wdXNoKC4uLnRoaXMua2V5c0FycmF5KTtcbiAgICB9XG4gICAgY29uc3QgY29tcG9uZW50czogYW55ID0gdGhpcy5nZXRDb21wb25lbnRzKCk7XG4gICAgLy8gYWRkIG9ubHkgdGhlIGZpZWxkcyBjb250YWluZWQgaW50byB0aGUgZm9ybS4uLlxuICAgIE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBpZiAoYXR0cmlidXRlcy5pbmRleE9mKGl0ZW0pIDwgMCAmJlxuICAgICAgICBjb21wb25lbnRzW2l0ZW1dLmlzQXV0b21hdGljUmVnaXN0ZXJpbmcoKSAmJiBjb21wb25lbnRzW2l0ZW1dLmlzQXV0b21hdGljQmluZGluZygpKSB7XG4gICAgICAgIGF0dHJpYnV0ZXMucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGFkZCBmaWVsZHMgc3RvcmVkIGludG8gZm9ybSBjYWNoZS4uLlxuICAgIGNvbnN0IGRhdGFDYWNoZSA9IHRoaXMuZm9ybUNhY2hlLmdldERhdGFDYWNoZSgpO1xuICAgIGlmIChkYXRhQ2FjaGUpIHtcbiAgICAgIE9iamVjdC5rZXlzKGRhdGFDYWNoZSkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaWYgKGl0ZW0gIT09IHVuZGVmaW5lZCAmJiBhdHRyaWJ1dGVzLmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICAgICAgYXR0cmlidXRlcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuY29uY2F0KHRoaXMuY29sc0FycmF5LmZpbHRlcihjb2wgPT4gYXR0cmlidXRlcy5pbmRleE9mKGNvbCkgPCAwKSk7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXM7XG4gIH1cblxuICBpbnNlcnREYXRhKHZhbHVlcywgc3FsVHlwZXM/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgdGhpcy5kYXRhU2VydmljZVt0aGlzLmluc2VydE1ldGhvZF0odmFsdWVzLCB0aGlzLmVudGl0eSwgc3FsVHlwZXMpLnN1YnNjcmliZShcbiAgICAgICAgcmVzcCA9PiB7XG4gICAgICAgICAgaWYgKHJlc3AuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcC5kYXRhKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHJlc3AubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNWYWx1ZXNUb0luc2VydCgpOiBvYmplY3Qge1xuICAgIGNvbnN0IGF0dHJWYWx1ZXMgPSB7fTtcbiAgICBpZiAodGhpcy5mb3JtUGFyZW50S2V5c1ZhbHVlcykge1xuICAgICAgT2JqZWN0LmFzc2lnbihhdHRyVmFsdWVzLCB0aGlzLmZvcm1QYXJlbnRLZXlzVmFsdWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYXR0clZhbHVlcywgdGhpcy5nZXRSZWdpc3RlcmVkRmllbGRzVmFsdWVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIHNxbCB0eXBlcyBmcm9tIHRoZSBmb3JtIGNvbXBvbmVudHMgYW5kIHRoZSBmb3JtIGtleXNcbiAgICovXG4gIHB1YmxpYyBnZXRBdHRyaWJ1dGVzU1FMVHlwZXMoKTogb2JqZWN0IHtcbiAgICBjb25zdCB0eXBlczogb2JqZWN0ID0ge307XG4gICAgLy8gQWRkIGZvcm0ga2V5cyBzcWwgdHlwZXNcbiAgICB0aGlzLmtleXNTcWxUeXBlc0FycmF5LmZvckVhY2goKGtzdCwgaSkgPT4gdHlwZXNbdGhpcy5rZXlzQXJyYXlbaV1dID0gU1FMVHlwZXMuZ2V0U1FMVHlwZVZhbHVlKGtzdCkpO1xuICAgIC8vIEFkZCBmb3JtIGNvbXBvbmVudHMgc3FsIHR5cGVzXG4gICAgaWYgKHRoaXMuX2NvbXBTUUxUeXBlcyAmJiBPYmplY3Qua2V5cyh0aGlzLl9jb21wU1FMVHlwZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odHlwZXMsIHRoaXMuX2NvbXBTUUxUeXBlcyk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlcztcbiAgfVxuXG4gIHVwZGF0ZURhdGEoZmlsdGVyLCB2YWx1ZXMsIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2VbdGhpcy51cGRhdGVNZXRob2RdKGZpbHRlciwgdmFsdWVzLCB0aGlzLmVudGl0eSwgc3FsVHlwZXMpLnN1YnNjcmliZShcbiAgICAgICAgcmVzcCA9PiB7XG4gICAgICAgICAgaWYgKHJlc3AuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcC5kYXRhKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHJlc3AubWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNWYWx1ZXNUb1VwZGF0ZSgpOiBvYmplY3Qge1xuICAgIGNvbnN0IHZhbHVlcyA9IHt9O1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGNoYW5nZWRBdHRycyA9IHRoaXMuZm9ybUNhY2hlLmdldENoYW5nZWRGb3JtQ29udHJvbHNBdHRyKCk7XG4gICAgT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpLmZpbHRlcihjb250cm9sTmFtZSA9PlxuICAgICAgc2VsZi5pZ25vcmVGb3JtQ2FjaGVLZXlzLmluZGV4T2YoY29udHJvbE5hbWUpID09PSAtMSAmJlxuICAgICAgY2hhbmdlZEF0dHJzLmluZGV4T2YoY29udHJvbE5hbWUpICE9PSAtMVxuICAgICkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgY29udHJvbCA9IHNlbGYuZm9ybUdyb3VwLmNvbnRyb2xzW2l0ZW1dO1xuICAgICAgaWYgKGNvbnRyb2wgaW5zdGFuY2VvZiBPRm9ybUNvbnRyb2wpIHtcbiAgICAgICAgdmFsdWVzW2l0ZW1dID0gY29udHJvbC5nZXRWYWx1ZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzW2l0ZW1dID0gY29udHJvbC52YWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZXNbaXRlbV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWx1ZXNbaXRlbV0gPSBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBkZWxldGVEYXRhKGZpbHRlcik6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbiA9IHRoaXMubG9hZCgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICB0aGlzLmNhbkRpc2NhcmRDaGFuZ2VzID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5kZWxldGVNZXRob2RdKGZpbHRlciwgdGhpcy5lbnRpdHkpLnN1YnNjcmliZShcbiAgICAgICAgcmVzcCA9PiB7XG4gICAgICAgICAgaWYgKHJlc3AuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIHNlbGYuZm9ybUNhY2hlLnNldENhY2hlU25hcHNob3QoKTtcbiAgICAgICAgICAgIHNlbGYubWFya0Zvcm1MYXlvdXRNYW5hZ2VyVG9VcGRhdGUoKTtcbiAgICAgICAgICAgIHNlbGYucG9zdENvcnJlY3REZWxldGUocmVzcCk7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3AuZGF0YSk7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLnBvc3RJbmNvcnJlY3REZWxldGUocmVzcCk7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihyZXNwLm1lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIHNlbGYucG9zdEluY29ycmVjdERlbGV0ZShlcnIpO1xuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cblxuICB0b0pTT05EYXRhKGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIGRhdGEgPSB7fTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWVEYXRhID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgdmFsdWVEYXRhW2l0ZW1dID0gZGF0YVtpdGVtXS52YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWVEYXRhO1xuICB9XG5cbiAgdG9Gb3JtVmFsdWVEYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YSAmJiBVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGNvbnN0IHZhbHVlRGF0YTogQXJyYXk8b2JqZWN0PiA9IFtdO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBkYXRhLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIHZhbHVlRGF0YS5wdXNoKHNlbGYub2JqZWN0VG9Gb3JtVmFsdWVEYXRhKGl0ZW0pKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZhbHVlRGF0YTtcbiAgICB9IGVsc2UgaWYgKGRhdGEgJiYgVXRpbC5pc09iamVjdChkYXRhKSkge1xuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0VG9Gb3JtVmFsdWVEYXRhKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0S2V5c1ZhbHVlcygpIHtcbiAgICBjb25zdCBmaWx0ZXIgPSB7fTtcbiAgICBjb25zdCBjdXJyZW50UmVjb3JkID0gdGhpcy5mb3JtRGF0YTtcbiAgICBpZiAoIXRoaXMua2V5c0FycmF5KSB7XG4gICAgICByZXR1cm4gZmlsdGVyO1xuICAgIH1cbiAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoY3VycmVudFJlY29yZFtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IGN1cnJlbnREYXRhID0gY3VycmVudFJlY29yZFtrZXldO1xuICAgICAgICBpZiAoY3VycmVudERhdGEgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICAgICAgY3VycmVudERhdGEgPSBjdXJyZW50RGF0YS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBmaWx0ZXJba2V5XSA9IGN1cnJlbnREYXRhO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBpc0luUXVlcnlNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09IE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5RVUVSWTtcbiAgfVxuXG4gIGlzSW5JbnNlcnRNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09IE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTlNFUlQ7XG4gIH1cblxuICBpc0luVXBkYXRlTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUNvbXBvbmVudC5Nb2RlKCkuVVBEQVRFO1xuICB9XG5cbiAgaXNJbkluaXRpYWxNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09IE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMO1xuICB9XG5cbiAgc2V0UXVlcnlNb2RlKCkge1xuICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLlFVRVJZKTtcbiAgfVxuXG4gIHNldEluc2VydE1vZGUoKSB7XG4gICAgdGhpcy5zZXRGb3JtTW9kZShPRm9ybUNvbXBvbmVudC5Nb2RlKCkuSU5TRVJUKTtcbiAgfVxuXG4gIHNldFVwZGF0ZU1vZGUoKSB7XG4gICAgdGhpcy5zZXRGb3JtTW9kZShPRm9ybUNvbXBvbmVudC5Nb2RlKCkuVVBEQVRFKTtcbiAgfVxuXG4gIHNldEluaXRpYWxNb2RlKCkge1xuICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUwpO1xuICB9XG5cbiAgcmVnaXN0ZXJEeW5hbWljRm9ybUNvbXBvbmVudChkeW5hbWljRm9ybSkge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQoZHluYW1pY0Zvcm0pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZHluYW1pY0Zvcm1TdWJzY3JpcHRpb24gPSBkeW5hbWljRm9ybS5yZW5kZXIuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICBpZiAocmVzKSB7XG4gICAgICAgIHNlbGYucmVmcmVzaENvbXBvbmVudHNFZGl0YWJsZVN0YXRlKCk7XG4gICAgICAgIGlmICghc2VsZi5pc0luSW5zZXJ0TW9kZSgpICYmIHNlbGYucXVlcnlPbkluaXQpIHtcbiAgICAgICAgICBzZWxmLnJlbG9hZCh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5mb3JtUGFyZW50S2V5c1ZhbHVlcykge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHNlbGYuZm9ybVBhcmVudEtleXNWYWx1ZXMpLmZvckVhY2gocGFyZW50S2V5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2VsZi5mb3JtUGFyZW50S2V5c1ZhbHVlc1twYXJlbnRLZXldO1xuICAgICAgICAgICAgY29uc3QgY29tcCA9IHNlbGYuZ2V0RmllbGRSZWZlcmVuY2UocGFyZW50S2V5KTtcbiAgICAgICAgICAgIGlmIChVdGlsLmlzRm9ybURhdGFDb21wb25lbnQoY29tcCkgJiYgY29tcC5pc0F1dG9tYXRpY0JpbmRpbmcoKSkge1xuICAgICAgICAgICAgICBjb21wLnNldFZhbHVlKHZhbHVlLCB7XG4gICAgICAgICAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnJlZ2lzdGVyRHluYW1pY0Zvcm1Db21wb25lbnQoZHluYW1pY0Zvcm0pIHtcbiAgICBpZiAoZHluYW1pY0Zvcm0gJiYgdGhpcy5keW5hbWljRm9ybVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5keW5hbWljRm9ybVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFJlcXVpcmVkQ29tcG9uZW50cygpOiBvYmplY3Qge1xuICAgIGNvbnN0IHJlcXVpcmVkQ29tcG9udGVudHM6IG9iamVjdCA9IHt9O1xuICAgIGNvbnN0IGNvbXBvbmVudHMgPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICBpZiAoY29tcG9uZW50cykge1xuICAgICAgT2JqZWN0LmtleXMoY29tcG9uZW50cykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCBjb21wID0gY29tcG9uZW50c1trZXldO1xuICAgICAgICBjb25zdCBhdHRyID0gY29tcC5nZXRBdHRyaWJ1dGUoKTtcbiAgICAgICAgaWYgKChjb21wIGFzIGFueSkuaXNSZXF1aXJlZCAmJiBhdHRyICYmIGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlcXVpcmVkQ29tcG9udGVudHNbYXR0cl0gPSBjb21wO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcXVpcmVkQ29tcG9udGVudHM7XG4gIH1cblxuICBnZXQgbGF5b3V0RGlyZWN0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dERpcmVjdGlvbjtcbiAgfVxuXG4gIHNldCBsYXlvdXREaXJlY3Rpb24odmFsOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYXJzZWRWYWwgPSAodmFsIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuX2xheW91dERpcmVjdGlvbiA9IFsncm93JywgJ2NvbHVtbicsICdyb3ctcmV2ZXJzZScsICdjb2x1bW4tcmV2ZXJzZSddLmluZGV4T2YocGFyc2VkVmFsKSAhPT0gLTEgPyBwYXJzZWRWYWwgOiBPRm9ybUNvbXBvbmVudC5ERUZBVUxUX0xBWU9VVF9ESVJFQ1RJT047XG4gIH1cblxuICBnZXQgbGF5b3V0QWxpZ24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0QWxpZ247XG4gIH1cblxuICBzZXQgbGF5b3V0QWxpZ24odmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9sYXlvdXRBbGlnbiA9IHZhbDtcbiAgfVxuXG4gIGdldCBzaG93RmxvYXRpbmdUb29sYmFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dIZWFkZXIgJiYgdGhpcy5oZWFkZXJNb2RlID09PSAnZmxvYXRpbmcnO1xuICB9XG5cbiAgZ2V0IHNob3dOb3RGbG9hdGluZ1Rvb2xiYXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0hlYWRlciAmJiB0aGlzLmhlYWRlck1vZGUgIT09ICdmbG9hdGluZyc7XG4gIH1cblxuICBpc0VkaXRhYmxlRGV0YWlsKCkge1xuICAgIHJldHVybiB0aGlzLmVkaXRhYmxlRGV0YWlsO1xuICB9XG5cbiAgaXNJbml0aWFsU3RhdGVDaGFuZ2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1DYWNoZS5pc0luaXRpYWxTdGF0ZUNoYW5nZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHVuZG8oKWAgaW5zdGVhZFxuICAgKi9cbiAgX3VuZG9MYXN0Q2hhbmdlQWN0aW9uKCkge1xuICAgIGNvbnNvbGUud2FybignTWV0aG9kIGBPRm9ybUNvbXBvbmVudC5fdW5kb0xhc3RDaGFuZ2VBY3Rpb25gIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnVydXRlLiBVc2UgYHVuZG9gIGluc3RlYWQnKTtcbiAgICB0aGlzLnVuZG8oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbmRvIGxhc3QgY2hhbmdlXG4gICAqL1xuICB1bmRvKCkge1xuICAgIHRoaXMuZm9ybUNhY2hlLnVuZG9MYXN0Q2hhbmdlKCk7XG4gIH1cblxuICBnZXQgaXNDYWNoZVN0YWNrRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybUNhY2hlLmlzQ2FjaGVTdGFja0VtcHR5O1xuICB9XG5cbiAgdW5kb0tleWJvYXJkUHJlc3NlZCgpIHtcbiAgICB0aGlzLmZvcm1DYWNoZS51bmRvTGFzdENoYW5nZSh7XG4gICAgICBrZXlib2FyZEV2ZW50OiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBnZXRGb3JtVG9vbGJhcigpOiBPRm9ybVRvb2xiYXJDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9mb3JtVG9vbGJhcjtcbiAgfVxuXG4gIGdldEZvcm1NYW5hZ2VyKCk6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb24uZm9ybUxheW91dE1hbmFnZXI7XG4gIH1cblxuICBnZXRGb3JtTmF2aWdhdGlvbigpOiBPRm9ybU5hdmlnYXRpb25DbGFzcyB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybU5hdmlnYXRpb247XG4gIH1cblxuICBnZXRGb3JtQ2FjaGUoKTogT0Zvcm1DYWNoZUNsYXNzIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtQ2FjaGU7XG4gIH1cblxuICBnZXRVcmxQYXJhbShhcmc6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmdldEZvcm1OYXZpZ2F0aW9uKCkuZ2V0VXJsUGFyYW1zKClbYXJnXTtcbiAgfVxuXG4gIGdldFVybFBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGb3JtTmF2aWdhdGlvbigpLmdldFVybFBhcmFtcygpO1xuICB9XG5cbiAgc2V0VXJsUGFyYW1zQW5kUmVsb2FkKHZhbDogb2JqZWN0KSB7XG4gICAgdGhpcy5mb3JtTmF2aWdhdGlvbi5zZXRVcmxQYXJhbXModmFsKTtcbiAgICB0aGlzLnJlbG9hZCh0cnVlKTtcbiAgfVxuXG4gIGdldFJlZ2lzdGVyZWRGaWVsZHNWYWx1ZXMoKSB7XG4gICAgY29uc3QgdmFsdWVzID0ge307XG4gICAgY29uc3QgY29tcG9uZW50czogSUZvcm1EYXRhQ29tcG9uZW50SGFzaCA9IHRoaXMuZ2V0Q29tcG9uZW50cygpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IGNvbXBvbmVudHNLZXlzID0gT2JqZWN0LmtleXMoY29tcG9uZW50cykuZmlsdGVyKGtleSA9PiBzZWxmLmlnbm9yZUZvcm1DYWNoZUtleXMuaW5kZXhPZihrZXkpID09PSAtMSk7XG4gICAgY29tcG9uZW50c0tleXMuZm9yRWFjaChjb21wS2V5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXA6IElGb3JtRGF0YUNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcEtleV07XG4gICAgICB2YWx1ZXNbY29tcEtleV0gPSBjb21wLmdldFZhbHVlKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaW4gdGhlIGZvcm1cbiAgICogQHBhcmFtIGF0dHIgdGhlIGF0dHIgb2YgdGhlIGZvcm0gZmllbGRcbiAgICovXG4gIGdldEZpZWxkVmFsdWUoYXR0cjogc3RyaW5nKTogYW55IHtcbiAgICBsZXQgdmFsdWUgPSBudWxsO1xuICAgIGNvbnN0IGNvbXAgPSB0aGlzLmdldEZpZWxkUmVmZXJlbmNlKGF0dHIpO1xuICAgIGlmIChjb21wKSB7XG4gICAgICB2YWx1ZSA9IGNvbXAuZ2V0VmFsdWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBvYmplY3Qgd2l0aCB0aGUgdmFsdWVzIG9mIGVhY2ggYXR0cmlidXRlXG4gICAqIEBwYXJhbSBhdHRycyB0aGUgYXR0cidzIG9mIHRoZSBmb3JtIGZpZWxkc1xuICAgKi9cbiAgZ2V0RmllbGRWYWx1ZXMoYXR0cnM6IHN0cmluZ1tdKTogYW55IHtcbiAgICBjb25zdCBhcnIgPSB7fTtcbiAgICBhdHRycy5mb3JFYWNoKGtleSA9PiBhcnJba2V5XSA9IHRoaXMuZ2V0RmllbGRWYWx1ZShrZXkpKTtcbiAgICByZXR1cm4gYXJyO1xuXG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgaW4gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSBhdHRyIGF0dHJpYnV0ZSBvZiBjb250cm9sXG4gICAqIEBwYXJhbSB2YWx1ZSB2YWx1ZVxuICAgKi9cbiAgc2V0RmllbGRWYWx1ZShhdHRyOiBzdHJpbmcsIHZhbHVlOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgY29uc3QgY29tcCA9IHRoaXMuZ2V0RmllbGRSZWZlcmVuY2UoYXR0cik7XG4gICAgaWYgKGNvbXApIHtcbiAgICAgIGNvbXAuc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBlYWNoIGNvbnRyb2wgaW4gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSB2YWx1ZXMgdGhlIHZhbHVlc1xuICAgKi9cbiAgc2V0RmllbGRWYWx1ZXModmFsdWVzOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdmFsdWVzKSB7XG4gICAgICBpZiAodmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdGhpcy5zZXRGaWVsZFZhbHVlKGtleSwgdmFsdWVzW2tleV0sIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciB0aGUgdmFsdWUgb2YgZWFjaCBjb250cm9sIGluIHRoZSBmb3JtXG4gICAqIEBwYXJhbSBhdHRyIHRoZSBhdHRyIG9mIHRoZSBmb3JtIGZpZWxkXG4gICAqL1xuICBjbGVhckZpZWxkVmFsdWUoYXR0cjogc3RyaW5nLCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbXAgPSB0aGlzLmdldEZpZWxkUmVmZXJlbmNlKGF0dHIpO1xuICAgIGlmIChjb21wKSB7XG4gICAgICBjb21wLmNsZWFyVmFsdWUob3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSB2YWx1ZSBvZiBlYWNoIGNvbnRyb2wgaW4gdGhlIGZvcm1cbiAgICogQHBhcmFtIGF0dHJzIHRoZSBhdHRyJ3Mgb2YgdGhlIGZvcm0gZmllbGRzXG4gICAqL1xuICBjbGVhckZpZWxkVmFsdWVzKGF0dHJzOiBzdHJpbmdbXSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBhdHRycy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIHNlbGYuY2xlYXJGaWVsZFZhbHVlKGtleSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSByZWZlcmVuY2Ugb2YgdGhlIGNvbnRyb2wgaW4gdGhlIGZvcm0uXG4gICAqIEBwYXJhbSBhdHRyIHRoZSBhdHRyIG9mIHRoZSBmb3JtIGZpZWxkXG4gICAqL1xuICBnZXRGaWVsZFJlZmVyZW5jZShhdHRyOiBzdHJpbmcpOiBJRm9ybURhdGFDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzW2F0dHJdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgcmVmZXJlbmNlIG9mIGVhY2ggY29udHJvbCBpbiB0aGUgZm9ybVxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIGF0dHIncyBvZiB0aGUgZm9ybSBmaWxlZHNcbiAgICovXG4gIGdldEZpZWxkUmVmZXJlbmNlcyhhdHRyczogc3RyaW5nW10pOiBJRm9ybURhdGFDb21wb25lbnRIYXNoIHtcbiAgICBjb25zdCBhcnI6IElGb3JtRGF0YUNvbXBvbmVudEhhc2ggPSB7fTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBhdHRycy5mb3JFYWNoKChrZXksIGluZGV4KSA9PiB7XG4gICAgICBhcnJba2V5XSA9IHNlbGYuZ2V0RmllbGRSZWZlcmVuY2Uoa2V5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgZ2V0Rm9ybUNvbXBvbmVudFBlcm1pc3Npb25zKGF0dHI6IHN0cmluZyk6IE9QZXJtaXNzaW9ucyB7XG4gICAgbGV0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnM7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9ICh0aGlzLnBlcm1pc3Npb25zLmNvbXBvbmVudHMgfHwgW10pLmZpbmQoY29tcCA9PiBjb21wLmF0dHIgPT09IGF0dHIpO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH1cblxuICBnZXRBY3Rpb25zUGVybWlzc2lvbnMoKTogT1Blcm1pc3Npb25zW10ge1xuICAgIGxldCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zW107XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICBwZXJtaXNzaW9ucyA9ICh0aGlzLnBlcm1pc3Npb25zLmFjdGlvbnMgfHwgW10pO1xuICAgIH1cbiAgICByZXR1cm4gcGVybWlzc2lvbnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgZGV0ZXJtaW5hdGVGb3JtTW9kZSgpOiB2b2lkIHtcbiAgICBjb25zdCB1cmxTZWdtZW50cyA9IHRoaXMuZm9ybU5hdmlnYXRpb24uZ2V0VXJsU2VnbWVudHMoKTtcbiAgICBpZiAodXJsU2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VnbWVudCA9IHVybFNlZ21lbnRzW3VybFNlZ21lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgdGhpcy5kZXRlcm1pbmF0ZU1vZGVGcm9tVXJsU2VnbWVudChzZWdtZW50KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWN0Um91dGUucGFyZW50KSB7XG4gICAgICB0aGlzLmFjdFJvdXRlLnBhcmVudC51cmwuc3Vic2NyaWJlKHNlZ21lbnRzID0+IHtcbiAgICAgICAgY29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICB0aGlzLmRldGVybWluYXRlTW9kZUZyb21VcmxTZWdtZW50KHNlZ21lbnQpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0Rm9ybU1vZGUoT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOSVRJQUwpO1xuICAgIH1cbiAgICAvLyBzdGF5SW5SZWNvcmRBZnRlckVkaXQgaXMgdHJ1ZSBpZiBmb3JtIGhhcyBlZGl0YWJsZSBkZXRhaWwgPSB0cnVlXG4gICAgdGhpcy5zdGF5SW5SZWNvcmRBZnRlckVkaXQgPSB0aGlzLnN0YXlJblJlY29yZEFmdGVyRWRpdCB8fCB0aGlzLmlzRWRpdGFibGVEZXRhaWwoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBkZXRlcm1pbmF0ZU1vZGVGcm9tVXJsU2VnbWVudChzZWdtZW50OiBVcmxTZWdtZW50KTogdm9pZCB7XG4gICAgY29uc3QgX3BhdGggPSBzZWdtZW50ID8gc2VnbWVudC5wYXRoIDogJyc7XG4gICAgaWYgKHRoaXMuaXNJbnNlcnRNb2RlUGF0aChfcGF0aCkpIHtcbiAgICAgIHRoaXMuc2V0SW5zZXJ0TW9kZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1VwZGF0ZU1vZGVQYXRoKF9wYXRoKSkge1xuICAgICAgdGhpcy5zZXRVcGRhdGVNb2RlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0SW5pdGlhbE1vZGUoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX3VwZGF0ZUZvcm1EYXRhKG5ld0Zvcm1EYXRhOiBvYmplY3QpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBuZXdGb3JtRGF0YTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudHMgPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICAgIGlmIChjb21wb25lbnRzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBjb25zdCBjb21wID0gY29tcG9uZW50c1trZXldO1xuICAgICAgICAgIGlmIChVdGlsLmlzRm9ybURhdGFDb21wb25lbnQoY29tcCkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChjb21wLmlzQXV0b21hdGljQmluZGluZygpKSB7XG4gICAgICAgICAgICAgICAgY29tcC5kYXRhID0gc2VsZi5nZXREYXRhVmFsdWUoa2V5KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2VsZi5pbml0aWFsaXplRmllbGRzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZUZpZWxkcygpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmZvcm1Hcm91cC5jb250cm9scykuZm9yRWFjaChjb250cm9sID0+IHtcbiAgICAgIHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzW2NvbnRyb2xdLm1hcmtBc1ByaXN0aW5lKCk7XG4gICAgfSk7XG4gICAgdGhpcy5mb3JtQ2FjaGUucmVnaXN0ZXJDYWNoZSgpO1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24udXBkYXRlTmF2aWdhdGlvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNsZWFyQ29tcG9uZW50c09sZFZhbHVlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbXBvbmVudHM6IElGb3JtRGF0YUNvbXBvbmVudEhhc2ggPSB0aGlzLmdldENvbXBvbmVudHMoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBjb21wb25lbnRzS2V5cyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudHMpLmZpbHRlcihrZXkgPT4gc2VsZi5pZ25vcmVGb3JtQ2FjaGVLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpO1xuICAgIGNvbXBvbmVudHNLZXlzLmZvckVhY2goY29tcEtleSA9PiB7XG4gICAgICBjb25zdCBjb21wOiBJRm9ybURhdGFDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBLZXldO1xuICAgICAgKGNvbXAgYXMgYW55KS5vbGRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIGNvbXAuZ2V0Rm9ybUNvbnRyb2woKS5zZXRWYWx1ZSh1bmRlZmluZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RDb3JyZWN0SW5zZXJ0KHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuSU5TRVJURUQnLCB7IGljb246ICdjaGVja19jaXJjbGUnIH0pO1xuICAgIHRoaXMub25JbnNlcnQuZW1pdChyZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RJbmNvcnJlY3RJbnNlcnQocmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnNob3dFcnJvcignaW5zZXJ0JywgcmVzdWx0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwb3N0SW5jb3JyZWN0RGVsZXRlKHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zaG93RXJyb3IoJ2RlbGV0ZScsIHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcG9zdEluY29ycmVjdFVwZGF0ZShyZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2hvd0Vycm9yKCd1cGRhdGUnLCByZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RDb3JyZWN0VXBkYXRlKHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuU0FWRUQnLCB7IGljb246ICdjaGVja19jaXJjbGUnIH0pO1xuICAgIHRoaXMub25VcGRhdGUuZW1pdChyZXN1bHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBvc3RDb3JyZWN0RGVsZXRlKHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuREVMRVRFRCcsIHsgaWNvbjogJ2NoZWNrX2NpcmNsZScgfSk7XG4gICAgdGhpcy5vbkRlbGV0ZS5lbWl0KHJlc3VsdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWFya0Zvcm1MYXlvdXRNYW5hZ2VyVG9VcGRhdGUoKTogdm9pZCB7XG4gICAgY29uc3QgZm9ybUxheW91dE1hbmFnZXIgPSB0aGlzLmdldEZvcm1NYW5hZ2VyKCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGZvcm1MYXlvdXRNYW5hZ2VyKSkge1xuICAgICAgZm9ybUxheW91dE1hbmFnZXIubWFya0ZvclVwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG9iamVjdFRvRm9ybVZhbHVlRGF0YShkYXRhOiBvYmplY3QgPSB7fSk6IG9iamVjdCB7XG4gICAgY29uc3QgdmFsdWVEYXRhID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgdmFsdWVEYXRhW2l0ZW1dID0gbmV3IE9Gb3JtVmFsdWUoZGF0YVtpdGVtXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlRGF0YTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRDdXJyZW50S2V5c1ZhbHVlcygpOiBvYmplY3Qge1xuICAgIHJldHVybiB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldEN1cnJlbnRLZXlzVmFsdWVzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVmcmVzaENvbXBvbmVudHNFZGl0YWJsZVN0YXRlKCk6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICBjYXNlIE9Gb3JtQ29tcG9uZW50Lk1vZGUoKS5JTklUSUFMOlxuICAgICAgICB0aGlzLl9zZXRDb21wb25lbnRzRWRpdGFibGUodGhpcy5pc0VkaXRhYmxlRGV0YWlsKCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLklOU0VSVDpcbiAgICAgIGNhc2UgT0Zvcm1Db21wb25lbnQuTW9kZSgpLlVQREFURTpcbiAgICAgICAgdGhpcy5fc2V0Q29tcG9uZW50c0VkaXRhYmxlKHRydWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBpc0luc2VydE1vZGVQYXRoKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdEl0ZW0oKTtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQobmF2RGF0YSkgJiYgcGF0aCA9PT0gbmF2RGF0YS5nZXRJbnNlcnRGb3JtUm91dGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc1VwZGF0ZU1vZGVQYXRoKHBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0UHJldmlvdXNSb3V0ZURhdGEoKTtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQobmF2RGF0YSkgJiYgcGF0aCA9PT0gbmF2RGF0YS5nZXRFZGl0Rm9ybVJvdXRlKCk7XG4gIH1cblxuICBwcml2YXRlIHNob3dFcnJvcihvcGVyYXRpb246IHN0cmluZywgcmVzdWx0OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgcmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG1lc3NhZ2UgPSAnTUVTU0FHRVMuRVJST1JfREVMRVRFJztcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICAgIGNhc2UgJ3VwZGF0ZSc6XG4gICAgICAgICAgbWVzc2FnZSA9ICdNRVNTQUdFUy5FUlJPUl9VUERBVEUnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdpbnNlcnQnOlxuICAgICAgICAgIG1lc3NhZ2UgPSAnTUVTU0FHRVMuRVJST1JfSU5TRVJUJztcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxufVxuIl19