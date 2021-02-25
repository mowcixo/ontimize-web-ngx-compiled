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
    OServiceBaseComponent.prototype.queryData = function (filter, ovrrArgs) {
        var _this = this;
        var queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
            return;
        }
        var filterParentKeys = ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
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
    OServiceBaseComponent.prototype.getComponentFilter = function (existingFilter) {
        if (existingFilter === void 0) { existingFilter = {}; }
        var filterParentKeys = ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
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
        return ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLWJhc2UtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL28tc2VydmljZS1iYXNlLWNvbXBvbmVudC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBWSxNQUFNLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRWpFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUcvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXpELE1BQU0sQ0FBQyxJQUFNLHVDQUF1QyxHQUFHO0lBRXJELGFBQWE7SUFHYixTQUFTO0lBRVQsNEJBQTRCO0lBRzVCLFFBQVE7SUFHUiw0QkFBNEI7SUFHNUIsNEJBQTRCO0lBRTVCLDhCQUE4QjtJQUU5QixVQUFVO0lBR1YsU0FBUztJQUdULE1BQU07SUFHTix5QkFBeUI7SUFHekIseUJBQXlCO0lBR3pCLDJCQUEyQjtJQUczQiwrQ0FBK0M7SUFHL0Msd0JBQXdC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QUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFUyxrREFBa0IsR0FBNUI7UUFDRSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQzNFO0lBQ0gsQ0FBQztJQUVTLHVDQUFPLEdBQWpCLFVBQWtCLElBQVMsRUFBRSxRQUFjLEVBQUUsT0FBaUI7SUFFOUQsQ0FBQztJQUVELCtDQUFlLEdBQWY7UUFFRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdEYsQ0FBQzs7c0NBNVBBLFlBQVksU0FBQyxxQkFBcUIsRUFBRSxFQUFFOztJQTFMdkM7UUFEQyxjQUFjLEVBQUU7OzhEQUNXO0lBRTVCO1FBREMsY0FBYyxFQUFFOzs4REFDVztJQUc1QjtRQURDLGNBQWMsRUFBRTs7MkRBQ1M7SUFZMUI7UUFEQyxjQUFjLEVBQUU7OzsyREFNaEI7SUFlRDtRQURDLGNBQWMsRUFBRTs7NkRBQ1U7SUFFM0I7UUFEQyxjQUFjLEVBQUU7OzBFQUN3QjtJQWdaM0MsNEJBQUM7Q0FBQSxBQWxjRCxJQWtjQztTQWxjWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgSG9zdExpc3RlbmVyLCBJbmplY3RvciwgTmdab25lLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElMb2NhbFN0b3JhZ2VDb21wb25lbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2xvY2FsLXN0b3JhZ2UtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbG9jYWwtc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL29udGltaXplL29udGltaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1F1ZXJ5RGF0YUFyZ3MgfSBmcm9tICcuLi90eXBlcy9xdWVyeS1kYXRhLWFyZ3MudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQkFTRV9DT01QT05FTlQgPSBbXG4gIC8vIGF0dHIgW3N0cmluZ106IGxpc3QgaWRlbnRpZmllci4gSXQgaXMgbWFuZGF0b3J5IGlmIGRhdGEgYXJlIHByb3ZpZGVkIHRocm91Z2ggdGhlIGRhdGEgYXR0cmlidXRlLiBEZWZhdWx0OiBlbnRpdHkgKGlmIHNldCkuXG4gICdvYXR0cjogYXR0cicsXG5cbiAgLy8gc2VydmljZSBbc3RyaW5nXTogSkVFIHNlcnZpY2UgcGF0aC4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzZXJ2aWNlJyxcblxuICAnc2VydmljZVR5cGUgOiBzZXJ2aWNlLXR5cGUnLFxuXG4gIC8vIGVudGl0eSBbc3RyaW5nXTogZW50aXR5IG9mIHRoZSBzZXJ2aWNlLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2VudGl0eScsXG5cbiAgLy8gcXVlcnktb24taW5pdCBbbm98eWVzXTogcXVlcnkgb24gaW5pdC4gRGVmYXVsdDogeWVzLlxuICAncXVlcnlPbkluaXQ6IHF1ZXJ5LW9uLWluaXQnLFxuXG4gIC8vIHF1ZXJ5LW9uLWluaXQgW25vfHllc106IHF1ZXJ5IG9uIGJpbmQuIERlZmF1bHQ6IHllcy5cbiAgJ3F1ZXJ5T25CaW5kOiBxdWVyeS1vbi1iaW5kJyxcblxuICAncXVlcnlPbkV2ZW50OiBxdWVyeS1vbi1ldmVudCcsXG5cbiAgJ3BhZ2VhYmxlJyxcblxuICAvLyBjb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBlbnRpdHksIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnY29sdW1ucycsXG5cbiAgLy8ga2V5cyBbc3RyaW5nXTogZW50aXR5IGtleXMsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAna2V5cycsXG5cbiAgLy8gcGFyZW50LWtleXMgW3N0cmluZ106IHBhcmVudCBrZXlzIHRvIGZpbHRlciwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdwYXJlbnRLZXlzOiBwYXJlbnQta2V5cycsXG5cbiAgLy8gc3RhdGljLWRhdGEgW0FycmF5PGFueT5dIDogd2F5IHRvIHBvcHVsYXRlIHdpdGggc3RhdGljIGRhdGEuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc3RhdGljRGF0YTogc3RhdGljLWRhdGEnLFxuXG4gIC8vIHF1ZXJ5LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBxdWVyaWVzLiBEZWZhdWx0OiBxdWVyeS5cbiAgJ3F1ZXJ5TWV0aG9kOiBxdWVyeS1tZXRob2QnLFxuXG4gIC8vIHBhZ2luYXRlZC1xdWVyeS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gcGFnaW5hdGVkIHF1ZXJpZXMuIERlZmF1bHQ6IGFkdmFuY2VkUXVlcnkuXG4gICdwYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHBhZ2luYXRlZC1xdWVyeS1tZXRob2QnLFxuXG4gIC8vIHF1ZXJ5LXJvd3MgW251bWJlcl06IG51bWJlciBvZiByb3dzIHBlciBwYWdlLiBEZWZhdWx0OiAxMC5cbiAgJ29RdWVyeVJvd3M6IHF1ZXJ5LXJvd3MnLFxuXG4gIC8vIGluc2VydC1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gaW5zZXJ0cy4gRGVmYXVsdDogaW5zZXJ0LlxuICAnaW5zZXJ0TWV0aG9kOiBpbnNlcnQtbWV0aG9kJyxcblxuICAvLyB1cGRhdGUtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHVwZGF0ZXMuIERlZmF1bHQ6IHVwZGF0ZS5cbiAgJ3VwZGF0ZU1ldGhvZDogdXBkYXRlLW1ldGhvZCcsXG5cbiAgLy8gZGVsZXRlLW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBkZWxldGlvbnMuIERlZmF1bHQ6IGRlbGV0ZS5cbiAgJ2RlbGV0ZU1ldGhvZDogZGVsZXRlLW1ldGhvZCcsXG5cbiAgJ3N0b3JlU3RhdGU6IHN0b3JlLXN0YXRlJyxcblxuICAvLyBxdWVyeS13aXRoLW51bGwtcGFyZW50LWtleXMgW3N0cmluZ11beWVzfG5vfHRydWV8ZmFsc2VdOiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gdHJpZ2dlciBxdWVyeSBtZXRob2Qgd2hlbiBwYXJlbnQta2V5cyBmaWx0ZXIgaXMgbnVsbC4gRGVmYXVsdDogZmFsc2VcbiAgJ3F1ZXJ5V2l0aE51bGxQYXJlbnRLZXlzOiBxdWVyeS13aXRoLW51bGwtcGFyZW50LWtleXMnLFxuXG4gIC8vIFtmdW5jdGlvbl06IGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gcXVlcnkgZXJyb3IuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVlcnlGYWxsYmFja0Z1bmN0aW9uOiBxdWVyeS1mYWxsYmFjay1mdW5jdGlvbidcbiAgLy8gLFxuXG4gIC8vICdpbnNlcnRGYWxsYmFja0Z1bmN0aW9uOiBpbnNlcnQtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICd1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiB1cGRhdGUtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICdkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiBkZWxldGUtZmFsbGJhY2stZnVuY3Rpb24nXG5dO1xuXG5leHBvcnQgY2xhc3MgT1NlcnZpY2VCYXNlQ29tcG9uZW50IGltcGxlbWVudHMgSUxvY2FsU3RvcmFnZUNvbXBvbmVudCwgT25DaGFuZ2VzIHtcblxuICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlU2VydmljZTogTG9jYWxTdG9yYWdlU2VydmljZTtcbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG5cbiAgLyogaW5wdXRzIHZhcmlhYmxlcyAqL1xuICBvYXR0cjogc3RyaW5nO1xuICBzZXJ2aWNlOiBzdHJpbmc7XG4gIHNlcnZpY2VUeXBlOiBzdHJpbmc7XG4gIGVudGl0eTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBxdWVyeU9uSW5pdDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHF1ZXJ5T25CaW5kOiBib29sZWFuID0gdHJ1ZTtcbiAgcXVlcnlPbkV2ZW50OiBhbnk7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHBhZ2VhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gIGNvbHVtbnM6IHN0cmluZztcbiAga2V5czogc3RyaW5nO1xuICBwYXJlbnRLZXlzOiBzdHJpbmc7XG4gIHN0YXRpY0RhdGE6IEFycmF5PGFueT47XG4gIHF1ZXJ5TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5RVUVSWV9NRVRIT0Q7XG4gIHBhZ2luYXRlZFF1ZXJ5TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5QQUdJTkFURURfUVVFUllfTUVUSE9EO1xuXG4gIG9yaWdpbmFsUXVlcnlSb3dzOiBudW1iZXIgPSBDb2Rlcy5ERUZBVUxUX1FVRVJZX1JPV1M7XG4gIHByb3RlY3RlZCBfcXVlcnlSb3dzID0gdGhpcy5vcmlnaW5hbFF1ZXJ5Um93cztcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzZXQgb1F1ZXJ5Um93cyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgdGhpcy5vcmlnaW5hbFF1ZXJ5Um93cyA9IHZhbHVlO1xuICAgICAgdGhpcy5fcXVlcnlSb3dzID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHF1ZXJ5Um93cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9xdWVyeVJvd3M7XG4gIH1cblxuICBzZXQgcXVlcnlSb3dzKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICB0aGlzLl9xdWVyeVJvd3MgPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgaW5zZXJ0TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5JTlNFUlRfTUVUSE9EO1xuICB1cGRhdGVNZXRob2Q6IHN0cmluZyA9IENvZGVzLlVQREFURV9NRVRIT0Q7XG4gIGRlbGV0ZU1ldGhvZDogc3RyaW5nID0gQ29kZXMuREVMRVRFX01FVEhPRDtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc3RvcmVTdGF0ZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHF1ZXJ5V2l0aE51bGxQYXJlbnRLZXlzOiBib29sZWFuID0gZmFsc2U7XG4gIHF1ZXJ5RmFsbGJhY2tGdW5jdGlvbjogKGVycjogYW55KSA9PiB2b2lkO1xuICAvLyBpbnNlcnRGYWxsYmFja0Z1bmN0aW9uOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIC8vIHVwZGF0ZUZhbGxiYWNrRnVuY3Rpb246IChlcnI6IGFueSkgPT4gdm9pZDtcbiAgLy8gZGVsZXRlRmFsbGJhY2tGdW5jdGlvbjogKGVycjogYW55KSA9PiB2b2lkO1xuICAvKiBlbmQgb2YgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIC8qIHBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG4gIHByb3RlY3RlZCBjb2xBcnJheTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBwcm90ZWN0ZWQga2V5c0FycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHByb3RlY3RlZCBfcEtleXNFcXVpdiA9IHt9O1xuICBkYXRhQXJyYXk6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIG9hdHRyRnJvbUVudGl0eTogYm9vbGVhbiA9IGZhbHNlO1xuICAvKiBlbmQgb2YgcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICBwcm90ZWN0ZWQgb25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb246IGFueTtcbiAgcHJvdGVjdGVkIG9uRm9ybURhdGFTdWJzY3JpYmU6IGFueTtcblxuICBwcm90ZWN0ZWQgbG9hZGVyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBxdWVyeVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgZGF0YVNlcnZpY2U6IGFueTtcbiAgcHJvdGVjdGVkIF9zdGF0ZTogYW55ID0ge307XG5cbiAgcHJvdGVjdGVkIGxvYWRpbmdTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHB1YmxpYyBsb2FkaW5nOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5sb2FkaW5nU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICBwcm90ZWN0ZWQgZm9ybTogT0Zvcm1Db21wb25lbnQ7XG4gIHByb3RlY3RlZCBhbHJlYWR5U3RvcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmOyAvLyBib3JyYXJcbiAgcHJvdGVjdGVkIHF1ZXJ5QXJndW1lbnRzOiBhbnlbXTtcblxuICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXI7XG4gIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGU7XG5cbiAgcHJvdGVjdGVkIHNxbFR5cGVzID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxTdG9yYWdlU2VydmljZSk7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICAgIHRoaXMuYWN0Um91dGUgPSB0aGlzLmluamVjdG9yLmdldChBY3RpdmF0ZWRSb3V0ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2QgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgICB0aGlzLmZvcm0gPSB0aGlzLmluamVjdG9yLmdldChPRm9ybUNvbXBvbmVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm8gcGFyZW50IGZvcm1cbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5vYXR0cikgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5lbnRpdHkpKSB7XG4gICAgICB0aGlzLm9hdHRyID0gdGhpcy5lbnRpdHkucmVwbGFjZSgnLicsICdfJyk7XG4gICAgICB0aGlzLm9hdHRyRnJvbUVudGl0eSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMua2V5c0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMua2V5cyk7XG4gICAgdGhpcy5jb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGNvbnN0IHBrQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5wYXJlbnRLZXlzKTtcbiAgICB0aGlzLl9wS2V5c0VxdWl2ID0gVXRpbC5wYXJzZVBhcmVudEtleXNFcXVpdmFsZW5jZXMocGtBcnJheSwgQ29kZXMuQ09MVU1OU19BTElBU19TRVBBUkFUT1IpO1xuXG4gICAgaWYgKHRoaXMuc3RvcmVTdGF0ZSkge1xuICAgICAgdGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbiA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5vblJvdXRlQ2hhbmdlLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlU3RvcmFnZSgpO1xuICAgICAgICAvLyB3aGVuIHRoZSBzdG9yYWdlIGlzIHVwZGF0ZWQgYmVjYXVzZSBhIHJvdXRlIGNoYW5nZVxuICAgICAgICAvLyB0aGUgYWxyZWFkeVN0b3JlZCBjb250cm9sIHZhcmlhYmxlIGlzIGNoYW5nZWQgdG8gaXRzIGluaXRpYWwgdmFsdWVcbiAgICAgICAgdGhpcy5hbHJlYWR5U3RvcmVkID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pbml0aWFsaXplU3RhdGUoKTtcblxuICAgICAgLy8gaWYgcXVlcnktcm93cyBpbiBpbml0aWFsIGNvbmZpZ3VyYXRpb24gaXMgZXF1YWxzIHRvIG9yaWdpbmFsIHF1ZXJ5LXJvd3MgaW5wdXRcbiAgICAgIC8vIHF1ZXJ5X3Jvd3Mgd2lsbCBiZSB0aGUgdmFsdWUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ3F1ZXJ5LXJvd3MnKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykgJiYgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ3F1ZXJ5LXJvd3MnKVxuICAgICAgICAgICYmIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydxdWVyeS1yb3dzJ10gPT09IHRoaXMub3JpZ2luYWxRdWVyeVJvd3MpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5Um93cyA9IHRoaXMuc3RhdGVbJ3F1ZXJ5LXJvd3MnXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRpY0RhdGEpIHtcbiAgICAgIHRoaXMucXVlcnlPbkJpbmQgPSBmYWxzZTtcbiAgICAgIHRoaXMucXVlcnlPbkluaXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KHRoaXMuc3RhdGljRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU2VydmljZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvcm0gJiYgVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgIHRoaXMuc2V0Rm9ybUNvbXBvbmVudCh0aGlzLmZvcm0pO1xuICAgIH1cblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnF1ZXJ5T25FdmVudCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5xdWVyeU9uRXZlbnQuc3Vic2NyaWJlKSkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbiA9IHRoaXMucXVlcnlPbkV2ZW50LnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHZhbHVlKSB8fCB0aGlzLnF1ZXJ5V2l0aE51bGxQYXJlbnRLZXlzKSB7XG4gICAgICAgICAgc2VsZi5xdWVyeURhdGEoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmluc2VydEZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLnVwZGF0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmRlbGV0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICB9XG5cbiAgYWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvL1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5vbkZvcm1EYXRhU3Vic2NyaWJlKSB7XG4gICAgICB0aGlzLm9uRm9ybURhdGFTdWJzY3JpYmUudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucXVlcnlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeU9uRXZlbnRTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucXVlcnlPbkV2ZW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7IFtwcm9wTmFtZTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlIH0pIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2hhbmdlcy5zdGF0aWNEYXRhKSkge1xuICAgICAgdGhpcy5zZXREYXRhQXJyYXkoY2hhbmdlcy5zdGF0aWNEYXRhLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmJlZm9yZXVubG9hZCcsIFtdKVxuICBiZWZvcmV1bmxvYWRIYW5kbGVyKCkge1xuICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vYXR0cjtcbiAgfVxuXG4gIGdldENvbXBvbmVudEtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgpO1xuICB9XG5cbiAgZ2V0RGF0YVRvU3RvcmUoKTogb2JqZWN0IHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfVxuXG4gIGdldFJvdXRlS2V5KCk6IHN0cmluZyB7XG4gICAgbGV0IHJvdXRlID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgIHRoaXMuYWN0Um91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHJvdXRlID0gcm91dGUucmVwbGFjZShwYXJhbXNba2V5XSwga2V5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByb3V0ZTtcbiAgfVxuXG4gIGdldEtleXMoKSB7XG4gICAgcmV0dXJuIHRoaXMua2V5c0FycmF5O1xuICB9XG5cbiAgY29uZmlndXJlU2VydmljZSgpIHtcbiAgICBsZXQgbG9hZGluZ1NlcnZpY2U6IGFueSA9IE9udGltaXplU2VydmljZTtcbiAgICBpZiAodGhpcy5zZXJ2aWNlVHlwZSkge1xuICAgICAgbG9hZGluZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VUeXBlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0PGFueT4obG9hZGluZ1NlcnZpY2UpO1xuICAgICAgaWYgKFV0aWwuaXNEYXRhU2VydmljZSh0aGlzLmRhdGFTZXJ2aWNlKSkge1xuICAgICAgICBjb25zdCBzZXJ2aWNlQ2ZnID0gdGhpcy5kYXRhU2VydmljZS5nZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24odGhpcy5zZXJ2aWNlKTtcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5KSB7XG4gICAgICAgICAgc2VydmljZUNmZy5lbnRpdHkgPSB0aGlzLmVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNvbmZpZ3VyZVNlcnZpY2Uoc2VydmljZUNmZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICBnZXREYXRhQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YUFycmF5O1xuICB9XG5cbiAgc2V0RGF0YUFycmF5KGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gZGF0YTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gW2RhdGFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCBoYXMgcmVjZWl2ZWQgbm90IHN1cHBvcnRlZCBzZXJ2aWNlIGRhdGEuIFN1cHBvcnRlZCBkYXRhIGFyZSBBcnJheSBvciBPYmplY3QnKTtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gW107XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldEZvcm1Db21wb25lbnQoZm9ybTogT0Zvcm1Db21wb25lbnQpOiB2b2lkIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuZm9ybSkpIHtcbiAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVlcnlPbkJpbmQpIHtcbiAgICAgIHRoaXMub25Gb3JtRGF0YVN1YnNjcmliZSA9IHRoaXMuZm9ybS5vbkRhdGFMb2FkZWQuc3Vic2NyaWJlKCgpID0+IHRoaXMucGFnZWFibGUgPyB0aGlzLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKSA6IHRoaXMucmVsb2FkRGF0YSgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcXVlcnlEYXRhKGZpbHRlcj86IGFueSwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHF1ZXJ5TWV0aG9kTmFtZSA9IHRoaXMucGFnZWFibGUgPyB0aGlzLnBhZ2luYXRlZFF1ZXJ5TWV0aG9kIDogdGhpcy5xdWVyeU1ldGhvZDtcbiAgICBpZiAoIXRoaXMuZGF0YVNlcnZpY2UgfHwgIShxdWVyeU1ldGhvZE5hbWUgaW4gdGhpcy5kYXRhU2VydmljZSkgfHwgIXRoaXMuZW50aXR5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGZpbHRlclBhcmVudEtleXMgPSBTZXJ2aWNlVXRpbHMuZ2V0UGFyZW50S2V5c0Zyb21Gb3JtKHRoaXMuX3BLZXlzRXF1aXYsIHRoaXMuZm9ybSk7XG4gICAgaWYgKCFTZXJ2aWNlVXRpbHMuZmlsdGVyQ29udGFpbnNBbGxQYXJlbnRLZXlzKGZpbHRlclBhcmVudEtleXMsIHRoaXMuX3BLZXlzRXF1aXYpICYmICF0aGlzLnF1ZXJ5V2l0aE51bGxQYXJlbnRLZXlzKSB7XG4gICAgICB0aGlzLnNldERhdGEoW10sIFtdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcXVlcnlBcmd1bWVudHMgPSB0aGlzLmdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlciwgb3ZyckFyZ3MpO1xuICAgICAgaWYgKHRoaXMucXVlcnlTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbiA9IHRoaXMubG9hZCgpO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnF1ZXJ5QXJndW1lbnRzID0gcXVlcnlBcmd1bWVudHM7XG4gICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uID0gdGhpcy5kYXRhU2VydmljZVtxdWVyeU1ldGhvZE5hbWVdXG4gICAgICAgIC5hcHBseSh0aGlzLmRhdGFTZXJ2aWNlLCBxdWVyeUFyZ3VtZW50cylcbiAgICAgICAgLnN1YnNjcmliZSgocmVzOiBTZXJ2aWNlUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgICB0aGlzLnNxbFR5cGVzID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChVdGlsLmlzQXJyYXkocmVzKSkge1xuICAgICAgICAgICAgZGF0YSA9IHJlcztcbiAgICAgICAgICAgIHRoaXMuc3FsVHlwZXMgPSB7fTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgICAgY29uc3QgYXJyRGF0YSA9IChyZXMuZGF0YSAhPT0gdW5kZWZpbmVkKSA/IHJlcy5kYXRhIDogW107XG4gICAgICAgICAgICBkYXRhID0gVXRpbC5pc0FycmF5KGFyckRhdGEpID8gYXJyRGF0YSA6IFtdO1xuICAgICAgICAgICAgdGhpcy5zcWxUeXBlcyA9IHJlcy5zcWxUeXBlcztcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbkluZm8ocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZi5zZXREYXRhKGRhdGEsIHRoaXMuc3FsVHlwZXMsIChvdnJyQXJncyAmJiBvdnJyQXJncy5yZXBsYWNlKSk7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgICBzZWxmLnNldERhdGEoW10sIFtdKTtcbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChzZWxmLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbikpIHtcbiAgICAgICAgICAgIHNlbGYucXVlcnlGYWxsYmFja0Z1bmN0aW9uKGVycik7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnIgJiYgdHlwZW9mIGVyciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHNlbGYuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX1FVRVJZJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVsb2FkRGF0YSgpOiB2b2lkIHtcbiAgICB0aGlzLnF1ZXJ5RGF0YSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbG9hZHMgdGhlIGNvbXBvbmVudCBkYXRhIGFuZCByZXN0YXJ0cyB0aGUgcGFnaW5hdGlvbi5cbiAgICovXG4gIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5yZWxvYWREYXRhKCk7XG4gIH1cblxuICBsb2FkKCk6IGFueSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgem9uZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgY29uc3QgbG9hZE9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgIH0sIDI1MCk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgc2VsZi5sb2FkaW5nU3ViamVjdC5uZXh0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgfSk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbG9hZE9ic2VydmFibGUuc3Vic2NyaWJlKHZhbCA9PiB7XG4gICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHNlbGYubG9hZGluZ1N1YmplY3QubmV4dCh2YWwgYXMgYm9vbGVhbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RpbmcgdGhlIGdpdmVuIHJlY29yZCBrZXlzXG4gICAqIEBwYXJhbSBpdGVtIHJlY29yZCBvYmplY3RcbiAgICogQHJldHVybnMgb2JqZWN0IGNvbnRhaW5pbmcgaXRlbSBvYmplY3QgcHJvcGVydGllcyBjb250YWluZWQgaW4ga2V5c0FycmF5XG4gICAqL1xuICBleHRyYWN0S2V5c0Zyb21SZWNvcmQoaXRlbTogYW55KTogb2JqZWN0IHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBpZiAoVXRpbC5pc09iamVjdChpdGVtKSkge1xuICAgICAgdGhpcy5rZXlzQXJyYXkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoaXRlbVtrZXldKSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk6IEFycmF5PHN0cmluZz4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY29sQXJyYXk7XG4gICAgdGhpcy5rZXlzQXJyYXkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlcjogb2JqZWN0LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogQXJyYXk8YW55PiB7XG4gICAgY29uc3QgY29tcEZpbHRlciA9IHRoaXMuZ2V0Q29tcG9uZW50RmlsdGVyKGZpbHRlcik7XG4gICAgY29uc3QgcXVlcnlDb2xzID0gdGhpcy5nZXRBdHRyaWJ1dGVzVmFsdWVzVG9RdWVyeSgpO1xuICAgIGNvbnN0IHNxbFR5cGVzID0gKG92cnJBcmdzICYmIG92cnJBcmdzLmhhc093blByb3BlcnR5KCdzcWx0eXBlcycpKSA/IG92cnJBcmdzLnNxbHR5cGVzIDogdGhpcy5mb3JtID8gdGhpcy5mb3JtLmdldEF0dHJpYnV0ZXNTUUxUeXBlcygpIDoge307XG5cbiAgICBsZXQgcXVlcnlBcmd1bWVudHMgPSBbY29tcEZpbHRlciwgcXVlcnlDb2xzLCB0aGlzLmVudGl0eSwgc3FsVHlwZXNdO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBjb25zdCBxdWVyeU9mZnNldCA9IChvdnJyQXJncyAmJiBvdnJyQXJncy5oYXNPd25Qcm9wZXJ0eSgnb2Zmc2V0JykpID8gb3ZyckFyZ3Mub2Zmc2V0IDogdGhpcy5zdGF0ZS5xdWVyeVJlY29yZE9mZnNldDtcbiAgICAgIGNvbnN0IHF1ZXJ5Um93c04gPSAob3ZyckFyZ3MgJiYgb3ZyckFyZ3MuaGFzT3duUHJvcGVydHkoJ2xlbmd0aCcpKSA/IG92cnJBcmdzLmxlbmd0aCA6IHRoaXMucXVlcnlSb3dzO1xuICAgICAgcXVlcnlBcmd1bWVudHMgPSBxdWVyeUFyZ3VtZW50cy5jb25jYXQoW3F1ZXJ5T2Zmc2V0LCBxdWVyeVJvd3NOLCB1bmRlZmluZWRdKTtcbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5QXJndW1lbnRzO1xuICB9XG5cbiAgdXBkYXRlUGFnaW5hdGlvbkluZm8ocXVlcnlSZXM6IFNlcnZpY2VSZXNwb25zZSkge1xuICAgIGNvbnN0IHJlc3VsdEVuZEluZGV4ID0gcXVlcnlSZXMuc3RhcnRSZWNvcmRJbmRleCArIChxdWVyeVJlcy5kYXRhID8gcXVlcnlSZXMuZGF0YS5sZW5ndGggOiAwKTtcbiAgICBpZiAocXVlcnlSZXMuc3RhcnRSZWNvcmRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0ID0gcmVzdWx0RW5kSW5kZXg7XG4gICAgfVxuICAgIGlmIChxdWVyeVJlcy50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyID0gcXVlcnlSZXMudG90YWxRdWVyeVJlY29yZHNOdW1iZXI7XG4gICAgfVxuICB9XG5cbiAgZ2V0VG90YWxSZWNvcmRzTnVtYmVyKCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgIT09IHVuZGVmaW5lZCkgPyB0aGlzLnN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50RmlsdGVyKGV4aXN0aW5nRmlsdGVyOiBhbnkgPSB7fSk6IGFueSB7XG4gICAgY29uc3QgZmlsdGVyUGFyZW50S2V5cyA9IFNlcnZpY2VVdGlscy5nZXRQYXJlbnRLZXlzRnJvbUZvcm0odGhpcy5fcEtleXNFcXVpdiwgdGhpcy5mb3JtKTtcbiAgICBleGlzdGluZ0ZpbHRlciA9IE9iamVjdC5hc3NpZ24oZXhpc3RpbmdGaWx0ZXIgfHwge30sIGZpbHRlclBhcmVudEtleXMpO1xuICAgIHJldHVybiBleGlzdGluZ0ZpbHRlcjtcbiAgfVxuXG4gIGdldFNxbFR5cGVzKCkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLnNxbFR5cGVzKSA/IHRoaXMuc3FsVHlwZXMgOiB7fTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIHNldCBzdGF0ZShhcmc6IGFueSkge1xuICAgIHRoaXMuX3N0YXRlID0gYXJnO1xuICB9XG5cbiAgZ2V0UGFyZW50S2V5c1ZhbHVlcygpIHtcbiAgICByZXR1cm4gU2VydmljZVV0aWxzLmdldFBhcmVudEtleXNGcm9tRm9ybSh0aGlzLl9wS2V5c0VxdWl2LCB0aGlzLmZvcm0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlU3RvcmFnZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlICYmIHRoaXMuc3RvcmVTdGF0ZSAmJiAhdGhpcy5hbHJlYWR5U3RvcmVkKSB7XG4gICAgICB0aGlzLmFscmVhZHlTdG9yZWQgPSB0cnVlO1xuICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZUNvbXBvbmVudFN0b3JhZ2UodGhpcywgdGhpcy5nZXRSb3V0ZUtleSgpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0YShkYXRhOiBhbnksIHNxbFR5cGVzPzogYW55LCByZXBsYWNlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vXG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgLy8gR2V0IHByZXZpb3VzIHN0YXR1c1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0Q29tcG9uZW50U3RvcmFnZSh0aGlzLCB0aGlzLmdldFJvdXRlS2V5KCkpO1xuICB9XG59XG4iXX0=