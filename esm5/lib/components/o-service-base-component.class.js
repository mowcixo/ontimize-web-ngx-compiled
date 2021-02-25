import * as tslib_1 from "tslib";
import { ChangeDetectorRef, HostListener, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { InputConverter } from '../decorators/input-converter';
import { DialogService } from '../services/dialog.service';
import { LocalStorageService } from '../services/local-storage.service';
import { OntimizeService } from '../services/ontimize/ontimize.service';
import { Codes } from '../util/codes';
import { ServiceUtils } from '../util/service.utils';
import { Util } from '../util/util';
import { OFormComponent } from './form/o-form.component';
import { OExpandableContainerComponent } from './expandable-container/o-expandable-container.component';
export var DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT = [
    'oattr: attr',
    'service',
    'serviceType : service-type',
    'entity',
    'queryOnInit: query-on-init',
    'queryOnBind: query-on-bind',
    'queryOnEvent: query-on-event',
    'pageable',
    'columns',
    'keys',
    'parentKeys: parent-keys',
    'staticData: static-data',
    'queryMethod: query-method',
    'paginatedQueryMethod : paginated-query-method',
    'oQueryRows: query-rows',
    'insertMethod: insert-method',
    'updateMethod: update-method',
    'deleteMethod: delete-method',
    'storeState: store-state',
    'queryWithNullParentKeys: query-with-null-parent-keys',
    'queryFallbackFunction: query-fallback-function'
];
var OServiceBaseComponent = (function () {
    function OServiceBaseComponent(injector) {
        this.injector = injector;
        this.queryOnInit = true;
        this.queryOnBind = true;
        this.pageable = false;
        this.queryMethod = Codes.QUERY_METHOD;
        this.paginatedQueryMethod = Codes.PAGINATED_QUERY_METHOD;
        this.originalQueryRows = Codes.DEFAULT_QUERY_ROWS;
        this._queryRows = this.originalQueryRows;
        this.insertMethod = Codes.INSERT_METHOD;
        this.updateMethod = Codes.UPDATE_METHOD;
        this.deleteMethod = Codes.DELETE_METHOD;
        this.storeState = true;
        this.queryWithNullParentKeys = false;
        this.colArray = [];
        this.keysArray = [];
        this._pKeysEquiv = {};
        this.dataArray = [];
        this.oattrFromEntity = false;
        this._state = {};
        this.loadingSubject = new BehaviorSubject(false);
        this.loading = this.loadingSubject.asObservable();
        this.alreadyStored = false;
        this.sqlTypes = undefined;
        this.dialogService = this.injector.get(DialogService);
        this.localStorageService = this.injector.get(LocalStorageService);
        this.router = this.injector.get(Router);
        this.actRoute = this.injector.get(ActivatedRoute);
        try {
            this.cd = this.injector.get(ChangeDetectorRef);
            this.form = this.injector.get(OFormComponent);
        }
        catch (e) {
        }
        try {
            this.expandableContainer = this.injector.get(OExpandableContainerComponent);
        }
        catch (e) {
        }
    }
    Object.defineProperty(OServiceBaseComponent.prototype, "oQueryRows", {
        set: function (value) {
            if (Util.isDefined(value)) {
                this.originalQueryRows = value;
                this._queryRows = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OServiceBaseComponent.prototype, "queryRows", {
        get: function () {
            return this._queryRows;
        },
        set: function (value) {
            if (Util.isDefined(value)) {
                this._queryRows = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    OServiceBaseComponent.prototype.initialize = function () {
        var _this = this;
        if (!Util.isDefined(this.oattr) && Util.isDefined(this.entity)) {
            this.oattr = this.entity.replace('.', '_');
            this.oattrFromEntity = true;
        }
        this.keysArray = Util.parseArray(this.keys);
        this.colArray = Util.parseArray(this.columns, true);
        var pkArray = Util.parseArray(this.parentKeys);
        this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray, Codes.COLUMNS_ALIAS_SEPARATOR);
        if (this.storeState) {
            this.onRouteChangeStorageSubscription = this.localStorageService.onRouteChange.subscribe(function (res) {
                _this.updateStateStorage();
                _this.alreadyStored = false;
            });
            this.initializeState();
            if (this.state.hasOwnProperty('query-rows')) {
                if (this.state.hasOwnProperty('initial-configuration') && this.state['initial-configuration'].hasOwnProperty('query-rows')
                    && this.state['initial-configuration']['query-rows'] === this.originalQueryRows) {
                    this.queryRows = this.state['query-rows'];
                }
            }
        }
        if (this.staticData) {
            this.queryOnBind = false;
            this.queryOnInit = false;
            this.setDataArray(this.staticData);
        }
        else {
            this.configureService();
        }
        if (this.form && Util.isDefined(this.dataService)) {
            this.setFormComponent(this.form);
        }
        if (Util.isDefined(this.queryOnEvent) && Util.isDefined(this.queryOnEvent.subscribe)) {
            var self_1 = this;
            this.queryOnEventSubscription = this.queryOnEvent.subscribe(function (value) {
                if (Util.isDefined(value) || _this.queryWithNullParentKeys) {
                    self_1.queryData();
                }
            });
        }
        if (typeof this.queryFallbackFunction !== 'function') {
            this.queryFallbackFunction = undefined;
        }
    };
    OServiceBaseComponent.prototype.afterViewInit = function () {
    };
    OServiceBaseComponent.prototype.destroy = function () {
        if (this.onFormDataSubscribe) {
            this.onFormDataSubscribe.unsubscribe();
        }
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        if (this.onRouteChangeStorageSubscription) {
            this.onRouteChangeStorageSubscription.unsubscribe();
        }
        if (this.queryOnEventSubscription) {
            this.queryOnEventSubscription.unsubscribe();
        }
        this.updateStateStorage();
    };
    OServiceBaseComponent.prototype.ngOnChanges = function (changes) {
        if (Util.isDefined(changes.staticData)) {
            this.setDataArray(changes.staticData.currentValue);
        }
    };
    OServiceBaseComponent.prototype.beforeunloadHandler = function () {
        this.updateStateStorage();
    };
    OServiceBaseComponent.prototype.getAttribute = function () {
        return this.oattr;
    };
    OServiceBaseComponent.prototype.getComponentKey = function () {
        return this.getAttribute();
    };
    OServiceBaseComponent.prototype.getDataToStore = function () {
        return this.state;
    };
    OServiceBaseComponent.prototype.getRouteKey = function () {
        var route = this.router.url;
        this.actRoute.params.subscribe(function (params) {
            Object.keys(params).forEach(function (key) {
                route = route.replace(params[key], key);
            });
        });
        return route;
    };
    OServiceBaseComponent.prototype.getKeys = function () {
        return this.keysArray;
    };
    OServiceBaseComponent.prototype.configureService = function () {
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
    OServiceBaseComponent.prototype.getDataArray = function () {
        return this.dataArray;
    };
    OServiceBaseComponent.prototype.setDataArray = function (data) {
        if (Util.isArray(data)) {
            this.dataArray = data;
        }
        else if (Util.isObject(data)) {
            this.dataArray = [data];
        }
        else {
            console.warn('Component has received not supported service data. Supported data are Array or Object');
            this.dataArray = [];
        }
    };
    OServiceBaseComponent.prototype.setFormComponent = function (form) {
        var _this = this;
        if (!Util.isDefined(this.form)) {
            this.form = form;
        }
        if (this.queryOnBind) {
            this.onFormDataSubscribe = this.form.onDataLoaded.subscribe(function () { return _this.pageable ? _this.reloadPaginatedDataFromStart() : _this.reloadData(); });
        }
    };
    OServiceBaseComponent.prototype.getParentKeysFromContext = function (parentKeys, context) {
        var result = {};
        if (context instanceof OExpandableContainerComponent) {
            result = ServiceUtils.getParentKeysFromExpandableContainer(parentKeys, context);
        }
        else {
            result = ServiceUtils.getParentKeysFromForm(parentKeys, context);
        }
        return result;
    };
    OServiceBaseComponent.prototype.queryData = function (filter, ovrrArgs) {
        var _this = this;
        var queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
            return;
        }
        var filterParentKeys = this.getParentKeysValues();
        if (!ServiceUtils.filterContainsAllParentKeys(filterParentKeys, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
            this.setData([], []);
        }
        else {
            var queryArguments = this.getQueryArguments(filter, ovrrArgs);
            if (this.querySubscription) {
                this.querySubscription.unsubscribe();
            }
            if (this.loaderSubscription) {
                this.loaderSubscription.unsubscribe();
            }
            this.loaderSubscription = this.load();
            var self_2 = this;
            this.queryArguments = queryArguments;
            this.querySubscription = this.dataService[queryMethodName]
                .apply(this.dataService, queryArguments)
                .subscribe(function (res) {
                var data;
                _this.sqlTypes = undefined;
                if (Util.isArray(res)) {
                    data = res;
                    _this.sqlTypes = {};
                }
                else if (res.isSuccessful()) {
                    var arrData = (res.data !== undefined) ? res.data : [];
                    data = Util.isArray(arrData) ? arrData : [];
                    _this.sqlTypes = res.sqlTypes;
                    if (_this.pageable) {
                        _this.updatePaginationInfo(res);
                    }
                }
                self_2.setData(data, _this.sqlTypes, (ovrrArgs && ovrrArgs.replace));
                self_2.loaderSubscription.unsubscribe();
            }, function (err) {
                self_2.setData([], []);
                self_2.loaderSubscription.unsubscribe();
                if (Util.isDefined(self_2.queryFallbackFunction)) {
                    self_2.queryFallbackFunction(err);
                }
                else if (err && typeof err !== 'object') {
                    self_2.dialogService.alert('ERROR', err);
                }
                else {
                    self_2.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
                }
            });
        }
    };
    OServiceBaseComponent.prototype.reloadData = function () {
        this.queryData();
    };
    OServiceBaseComponent.prototype.reloadPaginatedDataFromStart = function () {
        this.reloadData();
    };
    OServiceBaseComponent.prototype.load = function () {
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
    OServiceBaseComponent.prototype.extractKeysFromRecord = function (item) {
        var result = {};
        if (Util.isObject(item)) {
            this.keysArray.forEach(function (key) {
                if (Util.isDefined(item[key])) {
                    result[key] = item[key];
                }
            });
        }
        return result;
    };
    OServiceBaseComponent.prototype.getAttributesValuesToQuery = function () {
        var result = this.colArray;
        this.keysArray.forEach(function (key) {
            if (result.indexOf(key) === -1) {
                result.push(key);
            }
        });
        return result;
    };
    OServiceBaseComponent.prototype.getQueryArguments = function (filter, ovrrArgs) {
        var compFilter = this.getComponentFilter(filter);
        var queryCols = this.getAttributesValuesToQuery();
        var sqlTypes = (ovrrArgs && ovrrArgs.hasOwnProperty('sqltypes')) ? ovrrArgs.sqltypes : this.form ? this.form.getAttributesSQLTypes() : {};
        var queryArguments = [compFilter, queryCols, this.entity, sqlTypes];
        if (this.pageable) {
            var queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.state.queryRecordOffset;
            var queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
            queryArguments = queryArguments.concat([queryOffset, queryRowsN, undefined]);
        }
        return queryArguments;
    };
    OServiceBaseComponent.prototype.updatePaginationInfo = function (queryRes) {
        var resultEndIndex = queryRes.startRecordIndex + (queryRes.data ? queryRes.data.length : 0);
        if (queryRes.startRecordIndex !== undefined) {
            this.state.queryRecordOffset = resultEndIndex;
        }
        if (queryRes.totalQueryRecordsNumber !== undefined) {
            this.state.totalQueryRecordsNumber = queryRes.totalQueryRecordsNumber;
        }
    };
    OServiceBaseComponent.prototype.getTotalRecordsNumber = function () {
        return (this.state && this.state.totalQueryRecordsNumber !== undefined) ? this.state.totalQueryRecordsNumber : undefined;
    };
    OServiceBaseComponent.prototype.getContextComponent = function () {
        return this.expandableContainer || this.form;
    };
    OServiceBaseComponent.prototype.getComponentFilter = function (existingFilter) {
        if (existingFilter === void 0) { existingFilter = {}; }
        var filterParentKeys = this.getParentKeysFromContext(this._pKeysEquiv, this.getContextComponent());
        existingFilter = Object.assign(existingFilter || {}, filterParentKeys);
        return existingFilter;
    };
    OServiceBaseComponent.prototype.getSqlTypes = function () {
        return Util.isDefined(this.sqlTypes) ? this.sqlTypes : {};
    };
    Object.defineProperty(OServiceBaseComponent.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (arg) {
            this._state = arg;
        },
        enumerable: true,
        configurable: true
    });
    OServiceBaseComponent.prototype.getParentKeysValues = function () {
        var context = this.getContextComponent();
        return this.getParentKeysFromContext(this._pKeysEquiv, context);
    };
    OServiceBaseComponent.prototype.updateStateStorage = function () {
        if (this.localStorageService && this.storeState && !this.alreadyStored) {
            this.alreadyStored = true;
            this.localStorageService.updateComponentStorage(this, this.getRouteKey());
        }
    };
    OServiceBaseComponent.prototype.setData = function (data, sqlTypes, replace) {
    };
    OServiceBaseComponent.prototype.initializeState = function () {
        this.state = this.localStorageService.getComponentStorage(this, this.getRouteKey());
    };
    OServiceBaseComponent.propDecorators = {
        beforeunloadHandler: [{ type: HostListener, args: ['window:beforeunload', [],] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceBaseComponent.prototype, "queryOnInit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceBaseComponent.prototype, "queryOnBind", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceBaseComponent.prototype, "pageable", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number),
        tslib_1.__metadata("design:paramtypes", [Number])
    ], OServiceBaseComponent.prototype, "oQueryRows", null);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceBaseComponent.prototype, "storeState", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceBaseComponent.prototype, "queryWithNullParentKeys", void 0);
    return OServiceBaseComponent;
}());
export { OServiceBaseComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLWJhc2UtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL28tc2VydmljZS1iYXNlLWNvbXBvbmVudC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBWSxNQUFNLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRWpFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUcvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBRXhHLE1BQU0sQ0FBQyxJQUFNLHVDQUF1QyxHQUFHO0lBRXJELGFBQWE7SUFHYixTQUFTO0lBRVQsNEJBQTRCO0lBRzVCLFFBQVE7SUFHUiw0QkFBNEI7SUFHNUIsNEJBQTRCO0lBRTVCLDhCQUE4QjtJQUU5QixVQUFVO0lBR1YsU0FBUztJQUdULE1BQU07SUFHTix5QkFBeUI7SUFHekIs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R0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7O3NDQTVRQSxZQUFZLFNBQUMscUJBQXFCLEVBQUUsRUFBRTs7SUFoTXZDO1FBREMsY0FBYyxFQUFFOzs4REFDVztJQUU1QjtRQURDLGNBQWMsRUFBRTs7OERBQ1c7SUFHNUI7UUFEQyxjQUFjLEVBQUU7OzJEQUNTO0lBWTFCO1FBREMsY0FBYyxFQUFFOzs7MkRBTWhCO0lBZUQ7UUFEQyxjQUFjLEVBQUU7OzZEQUNVO0lBRTNCO1FBREMsY0FBYyxFQUFFOzswRUFDd0I7SUFzYTNDLDRCQUFDO0NBQUEsQUF4ZEQsSUF3ZEM7U0F4ZFkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IsIE5nWm9uZSwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJTG9jYWxTdG9yYWdlQ29tcG9uZW50IH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9sb2NhbC1zdG9yYWdlLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgU2VydmljZVJlc3BvbnNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zZXJ2aWNlLXJlc3BvbnNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0V4cGFuZGFibGVDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL2V4cGFuZGFibGUtY29udGFpbmVyL28tZXhwYW5kYWJsZS1jb250YWluZXIuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9CQVNFX0NPTVBPTkVOVCA9IFtcbiAgLy8gYXR0ciBbc3RyaW5nXTogbGlzdCBpZGVudGlmaWVyLiBJdCBpcyBtYW5kYXRvcnkgaWYgZGF0YSBhcmUgcHJvdmlkZWQgdGhyb3VnaCB0aGUgZGF0YSBhdHRyaWJ1dGUuIERlZmF1bHQ6IGVudGl0eSAoaWYgc2V0KS5cbiAgJ29hdHRyOiBhdHRyJyxcblxuICAvLyBzZXJ2aWNlIFtzdHJpbmddOiBKRUUgc2VydmljZSBwYXRoLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NlcnZpY2UnLFxuXG4gICdzZXJ2aWNlVHlwZSA6IHNlcnZpY2UtdHlwZScsXG5cbiAgLy8gZW50aXR5IFtzdHJpbmddOiBlbnRpdHkgb2YgdGhlIHNlcnZpY2UuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnZW50aXR5JyxcblxuICAvLyBxdWVyeS1vbi1pbml0IFtub3x5ZXNdOiBxdWVyeSBvbiBpbml0LiBEZWZhdWx0OiB5ZXMuXG4gICdxdWVyeU9uSW5pdDogcXVlcnktb24taW5pdCcsXG5cbiAgLy8gcXVlcnktb24taW5pdCBbbm98eWVzXTogcXVlcnkgb24gYmluZC4gRGVmYXVsdDogeWVzLlxuICAncXVlcnlPbkJpbmQ6IHF1ZXJ5LW9uLWJpbmQnLFxuXG4gICdxdWVyeU9uRXZlbnQ6IHF1ZXJ5LW9uLWV2ZW50JyxcblxuICAncGFnZWFibGUnLFxuXG4gIC8vIGNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIGVudGl0eSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdjb2x1bW5zJyxcblxuICAvLyBrZXlzIFtzdHJpbmddOiBlbnRpdHkga2V5cywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdrZXlzJyxcblxuICAvLyBwYXJlbnQta2V5cyBbc3RyaW5nXTogcGFyZW50IGtleXMgdG8gZmlsdGVyLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3BhcmVudEtleXM6IHBhcmVudC1rZXlzJyxcblxuICAvLyBzdGF0aWMtZGF0YSBbQXJyYXk8YW55Pl0gOiB3YXkgdG8gcG9wdWxhdGUgd2l0aCBzdGF0aWMgZGF0YS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzdGF0aWNEYXRhOiBzdGF0aWMtZGF0YScsXG5cbiAgLy8gcXVlcnktbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHF1ZXJpZXMuIERlZmF1bHQ6IHF1ZXJ5LlxuICAncXVlcnlNZXRob2Q6IHF1ZXJ5LW1ldGhvZCcsXG5cbiAgLy8gcGFnaW5hdGVkLXF1ZXJ5LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBwYWdpbmF0ZWQgcXVlcmllcy4gRGVmYXVsdDogYWR2YW5jZWRRdWVyeS5cbiAgJ3BhZ2luYXRlZFF1ZXJ5TWV0aG9kIDogcGFnaW5hdGVkLXF1ZXJ5LW1ldGhvZCcsXG5cbiAgLy8gcXVlcnktcm93cyBbbnVtYmVyXTogbnVtYmVyIG9mIHJvd3MgcGVyIHBhZ2UuIERlZmF1bHQ6IDEwLlxuICAnb1F1ZXJ5Um93czogcXVlcnktcm93cycsXG5cbiAgLy8gaW5zZXJ0LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBpbnNlcnRzLiBEZWZhdWx0OiBpbnNlcnQuXG4gICdpbnNlcnRNZXRob2Q6IGluc2VydC1tZXRob2QnLFxuXG4gIC8vIHVwZGF0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gdXBkYXRlcy4gRGVmYXVsdDogdXBkYXRlLlxuICAndXBkYXRlTWV0aG9kOiB1cGRhdGUtbWV0aG9kJyxcblxuICAvLyBkZWxldGUtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGRlbGV0aW9ucy4gRGVmYXVsdDogZGVsZXRlLlxuICAnZGVsZXRlTWV0aG9kOiBkZWxldGUtbWV0aG9kJyxcblxuICAnc3RvcmVTdGF0ZTogc3RvcmUtc3RhdGUnLFxuXG4gIC8vIHF1ZXJ5LXdpdGgtbnVsbC1wYXJlbnQta2V5cyBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0byB0cmlnZ2VyIHF1ZXJ5IG1ldGhvZCB3aGVuIHBhcmVudC1rZXlzIGZpbHRlciBpcyBudWxsLiBEZWZhdWx0OiBmYWxzZVxuICAncXVlcnlXaXRoTnVsbFBhcmVudEtleXM6IHF1ZXJ5LXdpdGgtbnVsbC1wYXJlbnQta2V5cycsXG5cbiAgLy8gW2Z1bmN0aW9uXTogZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBxdWVyeSBlcnJvci4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdxdWVyeUZhbGxiYWNrRnVuY3Rpb246IHF1ZXJ5LWZhbGxiYWNrLWZ1bmN0aW9uJ1xuICAvLyAsXG5cbiAgLy8gJ2luc2VydEZhbGxiYWNrRnVuY3Rpb246IGluc2VydC1mYWxsYmFjay1mdW5jdGlvbicsXG5cbiAgLy8gJ3VwZGF0ZUZhbGxiYWNrRnVuY3Rpb246IHVwZGF0ZS1mYWxsYmFjay1mdW5jdGlvbicsXG5cbiAgLy8gJ2RlbGV0ZUZhbGxiYWNrRnVuY3Rpb246IGRlbGV0ZS1mYWxsYmFjay1mdW5jdGlvbidcbl07XG5cbmV4cG9ydCBjbGFzcyBPU2VydmljZUJhc2VDb21wb25lbnQgaW1wbGVtZW50cyBJTG9jYWxTdG9yYWdlQ29tcG9uZW50LCBPbkNoYW5nZXMge1xuXG4gIHByb3RlY3RlZCBsb2NhbFN0b3JhZ2VTZXJ2aWNlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcblxuICAvKiBpbnB1dHMgdmFyaWFibGVzICovXG4gIG9hdHRyOiBzdHJpbmc7XG4gIHNlcnZpY2U6IHN0cmluZztcbiAgc2VydmljZVR5cGU6IHN0cmluZztcbiAgZW50aXR5OiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHF1ZXJ5T25Jbml0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcXVlcnlPbkJpbmQ6IGJvb2xlYW4gPSB0cnVlO1xuICBxdWVyeU9uRXZlbnQ6IGFueTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcGFnZWFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29sdW1uczogc3RyaW5nO1xuICBrZXlzOiBzdHJpbmc7XG4gIHBhcmVudEtleXM6IHN0cmluZztcbiAgc3RhdGljRGF0YTogQXJyYXk8YW55PjtcbiAgcXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlFVRVJZX01FVEhPRDtcbiAgcGFnaW5hdGVkUXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlBBR0lOQVRFRF9RVUVSWV9NRVRIT0Q7XG5cbiAgb3JpZ2luYWxRdWVyeVJvd3M6IG51bWJlciA9IENvZGVzLkRFRkFVTFRfUVVFUllfUk9XUztcbiAgcHJvdGVjdGVkIF9xdWVyeVJvd3MgPSB0aGlzLm9yaWdpbmFsUXVlcnlSb3dzO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNldCBvUXVlcnlSb3dzKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICB0aGlzLm9yaWdpbmFsUXVlcnlSb3dzID0gdmFsdWU7XG4gICAgICB0aGlzLl9xdWVyeVJvd3MgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgcXVlcnlSb3dzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5Um93cztcbiAgfVxuXG4gIHNldCBxdWVyeVJvd3ModmFsdWU6IG51bWJlcikge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX3F1ZXJ5Um93cyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICBpbnNlcnRNZXRob2Q6IHN0cmluZyA9IENvZGVzLklOU0VSVF9NRVRIT0Q7XG4gIHVwZGF0ZU1ldGhvZDogc3RyaW5nID0gQ29kZXMuVVBEQVRFX01FVEhPRDtcbiAgZGVsZXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5ERUxFVEVfTUVUSE9EO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdG9yZVN0YXRlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcXVlcnlXaXRoTnVsbFBhcmVudEtleXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcXVlcnlGYWxsYmFja0Z1bmN0aW9uOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIC8vIGluc2VydEZhbGxiYWNrRnVuY3Rpb246IChlcnI6IGFueSkgPT4gdm9pZDtcbiAgLy8gdXBkYXRlRmFsbGJhY2tGdW5jdGlvbjogKGVycjogYW55KSA9PiB2b2lkO1xuICAvLyBkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIC8qIGVuZCBvZiBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgLyogcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIGNvbEFycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHByb3RlY3RlZCBrZXlzQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgcHJvdGVjdGVkIF9wS2V5c0VxdWl2ID0ge307XG4gIGRhdGFBcnJheTogQXJyYXk8YW55PiA9IFtdO1xuICBwcm90ZWN0ZWQgb2F0dHJGcm9tRW50aXR5OiBib29sZWFuID0gZmFsc2U7XG4gIC8qIGVuZCBvZiBwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIHByb3RlY3RlZCBvblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbjogYW55O1xuICBwcm90ZWN0ZWQgb25Gb3JtRGF0YVN1YnNjcmliZTogYW55O1xuXG4gIHByb3RlY3RlZCBsb2FkZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHF1ZXJ5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBkYXRhU2VydmljZTogYW55O1xuICBwcm90ZWN0ZWQgX3N0YXRlOiBhbnkgPSB7fTtcblxuICBwcm90ZWN0ZWQgbG9hZGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGxvYWRpbmc6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByb3RlY3RlZCBmb3JtOiBPRm9ybUNvbXBvbmVudDtcbiAgcHVibGljIGV4cGFuZGFibGVDb250YWluZXI6IE9FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50O1xuICBwcm90ZWN0ZWQgYWxyZWFkeVN0b3JlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBxdWVyeU9uRXZlbnRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZjsgLy8gYm9ycmFyXG4gIHByb3RlY3RlZCBxdWVyeUFyZ3VtZW50czogYW55W107XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBwcm90ZWN0ZWQgYWN0Um91dGU6IEFjdGl2YXRlZFJvdXRlO1xuXG4gIHByb3RlY3RlZCBzcWxUeXBlcyA9IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvY2FsU3RvcmFnZVNlcnZpY2UpO1xuICAgIHRoaXMucm91dGVyID0gdGhpcy5pbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgICB0aGlzLmFjdFJvdXRlID0gdGhpcy5pbmplY3Rvci5nZXQoQWN0aXZhdGVkUm91dGUpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmNkID0gdGhpcy5pbmplY3Rvci5nZXQoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgICAgdGhpcy5mb3JtID0gdGhpcy5pbmplY3Rvci5nZXQoT0Zvcm1Db21wb25lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIG5vIHBhcmVudCBmb3JtXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmV4cGFuZGFibGVDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChPRXhwYW5kYWJsZUNvbnRhaW5lckNvbXBvbmVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gTm8gcGFyZW50IE9FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMub2F0dHIpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZW50aXR5KSkge1xuICAgICAgdGhpcy5vYXR0ciA9IHRoaXMuZW50aXR5LnJlcGxhY2UoJy4nLCAnXycpO1xuICAgICAgdGhpcy5vYXR0ckZyb21FbnRpdHkgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLmtleXNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmtleXMpO1xuICAgIHRoaXMuY29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5jb2x1bW5zLCB0cnVlKTtcbiAgICBjb25zdCBwa0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMucGFyZW50S2V5cyk7XG4gICAgdGhpcy5fcEtleXNFcXVpdiA9IFV0aWwucGFyc2VQYXJlbnRLZXlzRXF1aXZhbGVuY2VzKHBrQXJyYXksIENvZGVzLkNPTFVNTlNfQUxJQVNfU0VQQVJBVE9SKTtcblxuICAgIGlmICh0aGlzLnN0b3JlU3RhdGUpIHtcbiAgICAgIHRoaXMub25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uub25Sb3V0ZUNoYW5nZS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZVN0b3JhZ2UoKTtcbiAgICAgICAgLy8gd2hlbiB0aGUgc3RvcmFnZSBpcyB1cGRhdGVkIGJlY2F1c2UgYSByb3V0ZSBjaGFuZ2VcbiAgICAgICAgLy8gdGhlIGFscmVhZHlTdG9yZWQgY29udHJvbCB2YXJpYWJsZSBpcyBjaGFuZ2VkIHRvIGl0cyBpbml0aWFsIHZhbHVlXG4gICAgICAgIHRoaXMuYWxyZWFkeVN0b3JlZCA9IGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgICAgIC8vIGlmIHF1ZXJ5LXJvd3MgaW4gaW5pdGlhbCBjb25maWd1cmF0aW9uIGlzIGVxdWFscyB0byBvcmlnaW5hbCBxdWVyeS1yb3dzIGlucHV0XG4gICAgICAvLyBxdWVyeV9yb3dzIHdpbGwgYmUgdGhlIHZhbHVlIGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdxdWVyeS1yb3dzJykpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2luaXRpYWwtY29uZmlndXJhdGlvbicpICYmIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddLmhhc093blByb3BlcnR5KCdxdWVyeS1yb3dzJylcbiAgICAgICAgICAmJiB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXVsncXVlcnktcm93cyddID09PSB0aGlzLm9yaWdpbmFsUXVlcnlSb3dzKSB7XG4gICAgICAgICAgdGhpcy5xdWVyeVJvd3MgPSB0aGlzLnN0YXRlWydxdWVyeS1yb3dzJ107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0aWNEYXRhKSB7XG4gICAgICB0aGlzLnF1ZXJ5T25CaW5kID0gZmFsc2U7XG4gICAgICB0aGlzLnF1ZXJ5T25Jbml0ID0gZmFsc2U7XG4gICAgICB0aGlzLnNldERhdGFBcnJheSh0aGlzLnN0YXRpY0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZ3VyZVNlcnZpY2UoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb3JtICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGF0YVNlcnZpY2UpKSB7XG4gICAgICB0aGlzLnNldEZvcm1Db21wb25lbnQodGhpcy5mb3JtKTtcbiAgICB9XG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWVyeU9uRXZlbnQpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMucXVlcnlPbkV2ZW50LnN1YnNjcmliZSkpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5xdWVyeU9uRXZlbnRTdWJzY3JpcHRpb24gPSB0aGlzLnF1ZXJ5T25FdmVudC5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgfHwgdGhpcy5xdWVyeVdpdGhOdWxsUGFyZW50S2V5cykge1xuICAgICAgICAgIHNlbGYucXVlcnlEYXRhKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMuaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMudXBkYXRlRmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMuZGVsZXRlRmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgfVxuXG4gIGFmdGVyVmlld0luaXQoKSB7XG4gICAgLy9cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMub25Gb3JtRGF0YVN1YnNjcmliZSkge1xuICAgICAgdGhpcy5vbkZvcm1EYXRhU3Vic2NyaWJlLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMub25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucXVlcnlPbkV2ZW50U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVN0YXRlU3RvcmFnZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNoYW5nZXMuc3RhdGljRGF0YSkpIHtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KGNoYW5nZXMuc3RhdGljRGF0YS5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpiZWZvcmV1bmxvYWQnLCBbXSlcbiAgYmVmb3JldW5sb2FkSGFuZGxlcigpIHtcbiAgICB0aGlzLnVwZGF0ZVN0YXRlU3RvcmFnZSgpO1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMub2F0dHI7XG4gIH1cblxuICBnZXRDb21wb25lbnRLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoKTtcbiAgfVxuXG4gIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gIH1cblxuICBnZXRSb3V0ZUtleSgpOiBzdHJpbmcge1xuICAgIGxldCByb3V0ZSA9IHRoaXMucm91dGVyLnVybDtcbiAgICB0aGlzLmFjdFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgIE9iamVjdC5rZXlzKHBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICByb3V0ZSA9IHJvdXRlLnJlcGxhY2UocGFyYW1zW2tleV0sIGtleSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm91dGU7XG4gIH1cblxuICBnZXRLZXlzKCkge1xuICAgIHJldHVybiB0aGlzLmtleXNBcnJheTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVNlcnZpY2UoKSB7XG4gICAgbGV0IGxvYWRpbmdTZXJ2aWNlOiBhbnkgPSBPbnRpbWl6ZVNlcnZpY2U7XG4gICAgaWYgKHRoaXMuc2VydmljZVR5cGUpIHtcbiAgICAgIGxvYWRpbmdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlVHlwZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldDxhbnk+KGxvYWRpbmdTZXJ2aWNlKTtcbiAgICAgIGlmIChVdGlsLmlzRGF0YVNlcnZpY2UodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgICAgY29uc3Qgc2VydmljZUNmZyA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKHRoaXMuc2VydmljZSk7XG4gICAgICAgIGlmICh0aGlzLmVudGl0eSkge1xuICAgICAgICAgIHNlcnZpY2VDZmcuZW50aXR5ID0gdGhpcy5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU2VydmljZS5jb25maWd1cmVTZXJ2aWNlKHNlcnZpY2VDZmcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGF0YUFycmF5KCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFBcnJheTtcbiAgfVxuXG4gIHNldERhdGFBcnJheShkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IGRhdGE7XG4gICAgfSBlbHNlIGlmIChVdGlsLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IFtkYXRhXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgaGFzIHJlY2VpdmVkIG5vdCBzdXBwb3J0ZWQgc2VydmljZSBkYXRhLiBTdXBwb3J0ZWQgZGF0YSBhcmUgQXJyYXkgb3IgT2JqZWN0Jyk7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRGb3JtQ29tcG9uZW50KGZvcm06IE9Gb3JtQ29tcG9uZW50KTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm0pKSB7XG4gICAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnF1ZXJ5T25CaW5kKSB7XG4gICAgICB0aGlzLm9uRm9ybURhdGFTdWJzY3JpYmUgPSB0aGlzLmZvcm0ub25EYXRhTG9hZGVkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnBhZ2VhYmxlID8gdGhpcy5yZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCkgOiB0aGlzLnJlbG9hZERhdGEoKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFBhcmVudEtleXNGcm9tQ29udGV4dChwYXJlbnRLZXlzOiBvYmplY3QsIGNvbnRleHQ6IGFueSkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBpZiAoY29udGV4dCBpbnN0YW5jZW9mIE9FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50KSB7XG4gICAgICByZXN1bHQgPSBTZXJ2aWNlVXRpbHMuZ2V0UGFyZW50S2V5c0Zyb21FeHBhbmRhYmxlQ29udGFpbmVyKHBhcmVudEtleXMsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBTZXJ2aWNlVXRpbHMuZ2V0UGFyZW50S2V5c0Zyb21Gb3JtKHBhcmVudEtleXMsIGNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuXG4gIH1cblxuICBwdWJsaWMgcXVlcnlEYXRhKGZpbHRlcj86IGFueSwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHF1ZXJ5TWV0aG9kTmFtZSA9IHRoaXMucGFnZWFibGUgPyB0aGlzLnBhZ2luYXRlZFF1ZXJ5TWV0aG9kIDogdGhpcy5xdWVyeU1ldGhvZDtcbiAgICBpZiAoIXRoaXMuZGF0YVNlcnZpY2UgfHwgIShxdWVyeU1ldGhvZE5hbWUgaW4gdGhpcy5kYXRhU2VydmljZSkgfHwgIXRoaXMuZW50aXR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZpbHRlclBhcmVudEtleXMgPSB0aGlzLmdldFBhcmVudEtleXNWYWx1ZXMoKTtcbiAgICBpZiAoIVNlcnZpY2VVdGlscy5maWx0ZXJDb250YWluc0FsbFBhcmVudEtleXMoZmlsdGVyUGFyZW50S2V5cywgdGhpcy5fcEtleXNFcXVpdikgJiYgIXRoaXMucXVlcnlXaXRoTnVsbFBhcmVudEtleXMpIHtcbiAgICAgIHRoaXMuc2V0RGF0YShbXSwgW10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBxdWVyeUFyZ3VtZW50cyA9IHRoaXMuZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyLCBvdnJyQXJncyk7XG4gICAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMucXVlcnlBcmd1bWVudHMgPSBxdWVyeUFyZ3VtZW50cztcbiAgICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24gPSB0aGlzLmRhdGFTZXJ2aWNlW3F1ZXJ5TWV0aG9kTmFtZV1cbiAgICAgICAgLmFwcGx5KHRoaXMuZGF0YVNlcnZpY2UsIHF1ZXJ5QXJndW1lbnRzKVxuICAgICAgICAuc3Vic2NyaWJlKChyZXM6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgIHRoaXMuc3FsVHlwZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShyZXMpKSB7XG4gICAgICAgICAgICBkYXRhID0gcmVzO1xuICAgICAgICAgICAgdGhpcy5zcWxUeXBlcyA9IHt9O1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBjb25zdCBhcnJEYXRhID0gKHJlcy5kYXRhICE9PSB1bmRlZmluZWQpID8gcmVzLmRhdGEgOiBbXTtcbiAgICAgICAgICAgIGRhdGEgPSBVdGlsLmlzQXJyYXkoYXJyRGF0YSkgPyBhcnJEYXRhIDogW107XG4gICAgICAgICAgICB0aGlzLnNxbFR5cGVzID0gcmVzLnNxbFR5cGVzO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uSW5mbyhyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnNldERhdGEoZGF0YSwgdGhpcy5zcWxUeXBlcywgKG92cnJBcmdzICYmIG92cnJBcmdzLnJlcGxhY2UpKTtcbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgIHNlbGYuc2V0RGF0YShbXSwgW10pO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHNlbGYucXVlcnlGYWxsYmFja0Z1bmN0aW9uKSkge1xuICAgICAgICAgICAgc2VsZi5xdWVyeUZhbGxiYWNrRnVuY3Rpb24oZXJyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiB0eXBlb2YgZXJyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgc2VsZi5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfUVVFUlknKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWxvYWREYXRhKCk6IHZvaWQge1xuICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVsb2FkcyB0aGUgY29tcG9uZW50IGRhdGEgYW5kIHJlc3RhcnRzIHRoZSBwYWdpbmF0aW9uLlxuICAgKi9cbiAgcmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfVxuXG4gIGxvYWQoKTogYW55IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCB6b25lID0gdGhpcy5pbmplY3Rvci5nZXQoTmdab25lKTtcbiAgICBjb25zdCBsb2FkT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xuICAgICAgfSwgMjUwKTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBzZWxmLmxvYWRpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9KTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBsb2FkT2JzZXJ2YWJsZS5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgc2VsZi5sb2FkaW5nU3ViamVjdC5uZXh0KHZhbCBhcyBib29sZWFuKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdGluZyB0aGUgZ2l2ZW4gcmVjb3JkIGtleXNcbiAgICogQHBhcmFtIGl0ZW0gcmVjb3JkIG9iamVjdFxuICAgKiBAcmV0dXJucyBvYmplY3QgY29udGFpbmluZyBpdGVtIG9iamVjdCBwcm9wZXJ0aWVzIGNvbnRhaW5lZCBpbiBrZXlzQXJyYXlcbiAgICovXG4gIGV4dHJhY3RLZXlzRnJvbVJlY29yZChpdGVtOiBhbnkpOiBvYmplY3Qge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGlmIChVdGlsLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChpdGVtW2tleV0pKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1ZhbHVlc1RvUXVlcnkoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jb2xBcnJheTtcbiAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAocmVzdWx0LmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyOiBvYmplY3QsIG92cnJBcmdzPzogT1F1ZXJ5RGF0YUFyZ3MpOiBBcnJheTxhbnk+IHtcbiAgICBjb25zdCBjb21wRmlsdGVyID0gdGhpcy5nZXRDb21wb25lbnRGaWx0ZXIoZmlsdGVyKTtcbiAgICBjb25zdCBxdWVyeUNvbHMgPSB0aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSAob3ZyckFyZ3MgJiYgb3ZyckFyZ3MuaGFzT3duUHJvcGVydHkoJ3NxbHR5cGVzJykpID8gb3ZyckFyZ3Muc3FsdHlwZXMgOiB0aGlzLmZvcm0gPyB0aGlzLmZvcm0uZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCkgOiB7fTtcblxuICAgIGxldCBxdWVyeUFyZ3VtZW50cyA9IFtjb21wRmlsdGVyLCBxdWVyeUNvbHMsIHRoaXMuZW50aXR5LCBzcWxUeXBlc107XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5T2Zmc2V0ID0gKG92cnJBcmdzICYmIG92cnJBcmdzLmhhc093blByb3BlcnR5KCdvZmZzZXQnKSkgPyBvdnJyQXJncy5vZmZzZXQgOiB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgICAgY29uc3QgcXVlcnlSb3dzTiA9IChvdnJyQXJncyAmJiBvdnJyQXJncy5oYXNPd25Qcm9wZXJ0eSgnbGVuZ3RoJykpID8gb3ZyckFyZ3MubGVuZ3RoIDogdGhpcy5xdWVyeVJvd3M7XG4gICAgICBxdWVyeUFyZ3VtZW50cyA9IHF1ZXJ5QXJndW1lbnRzLmNvbmNhdChbcXVlcnlPZmZzZXQsIHF1ZXJ5Um93c04sIHVuZGVmaW5lZF0pO1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICB1cGRhdGVQYWdpbmF0aW9uSW5mbyhxdWVyeVJlczogU2VydmljZVJlc3BvbnNlKSB7XG4gICAgY29uc3QgcmVzdWx0RW5kSW5kZXggPSBxdWVyeVJlcy5zdGFydFJlY29yZEluZGV4ICsgKHF1ZXJ5UmVzLmRhdGEgPyBxdWVyeVJlcy5kYXRhLmxlbmd0aCA6IDApO1xuICAgIGlmIChxdWVyeVJlcy5zdGFydFJlY29yZEluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSByZXN1bHRFbmRJbmRleDtcbiAgICB9XG4gICAgaWYgKHF1ZXJ5UmVzLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgPSBxdWVyeVJlcy50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlcjtcbiAgICB9XG4gIH1cblxuICBnZXRUb3RhbFJlY29yZHNOdW1iZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciAhPT0gdW5kZWZpbmVkKSA/IHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRDb250ZXh0Q29tcG9uZW50KCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuZGFibGVDb250YWluZXIgfHwgdGhpcy5mb3JtO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50RmlsdGVyKGV4aXN0aW5nRmlsdGVyOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgY29uc3QgZmlsdGVyUGFyZW50S2V5cyA9IHRoaXMuZ2V0UGFyZW50S2V5c0Zyb21Db250ZXh0KHRoaXMuX3BLZXlzRXF1aXYsIHRoaXMuZ2V0Q29udGV4dENvbXBvbmVudCgpKTtcbiAgICBleGlzdGluZ0ZpbHRlciA9IE9iamVjdC5hc3NpZ24oZXhpc3RpbmdGaWx0ZXIgfHwge30sIGZpbHRlclBhcmVudEtleXMpO1xuICAgIHJldHVybiBleGlzdGluZ0ZpbHRlcjtcbiAgfVxuXG4gIGdldFNxbFR5cGVzKCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLnNxbFR5cGVzKSA/IHRoaXMuc3FsVHlwZXMgOiB7fTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIHNldCBzdGF0ZShhcmc6IGFueSkge1xuICAgIHRoaXMuX3N0YXRlID0gYXJnO1xuICB9XG5cbiAgZ2V0UGFyZW50S2V5c1ZhbHVlcygpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5nZXRDb250ZXh0Q29tcG9uZW50KCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UGFyZW50S2V5c0Zyb21Db250ZXh0KHRoaXMuX3BLZXlzRXF1aXYsIGNvbnRleHQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlU3RvcmFnZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlICYmIHRoaXMuc3RvcmVTdGF0ZSAmJiAhdGhpcy5hbHJlYWR5U3RvcmVkKSB7XG4gICAgICB0aGlzLmFscmVhZHlTdG9yZWQgPSB0cnVlO1xuICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZUNvbXBvbmVudFN0b3JhZ2UodGhpcywgdGhpcy5nZXRSb3V0ZUtleSgpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0YShkYXRhOiBhbnksIHNxbFR5cGVzPzogYW55LCByZXBsYWNlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vXG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgLy8gR2V0IHByZXZpb3VzIHN0YXR1c1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0Q29tcG9uZW50U3RvcmFnZSh0aGlzLCB0aGlzLmdldFJvdXRlS2V5KCkpO1xuICB9XG59XG4iXX0=