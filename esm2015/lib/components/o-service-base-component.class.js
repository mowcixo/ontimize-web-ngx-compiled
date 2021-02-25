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
export const DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT = [
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
export class OServiceBaseComponent {
    constructor(injector) {
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
    set oQueryRows(value) {
        if (Util.isDefined(value)) {
            this.originalQueryRows = value;
            this._queryRows = value;
        }
    }
    get queryRows() {
        return this._queryRows;
    }
    set queryRows(value) {
        if (Util.isDefined(value)) {
            this._queryRows = value;
        }
    }
    initialize() {
        if (!Util.isDefined(this.oattr) && Util.isDefined(this.entity)) {
            this.oattr = this.entity.replace('.', '_');
            this.oattrFromEntity = true;
        }
        this.keysArray = Util.parseArray(this.keys);
        this.colArray = Util.parseArray(this.columns, true);
        const pkArray = Util.parseArray(this.parentKeys);
        this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray, Codes.COLUMNS_ALIAS_SEPARATOR);
        if (this.storeState) {
            this.onRouteChangeStorageSubscription = this.localStorageService.onRouteChange.subscribe(res => {
                this.updateStateStorage();
                this.alreadyStored = false;
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
            const self = this;
            this.queryOnEventSubscription = this.queryOnEvent.subscribe((value) => {
                if (Util.isDefined(value) || this.queryWithNullParentKeys) {
                    self.queryData();
                }
            });
        }
        if (typeof this.queryFallbackFunction !== 'function') {
            this.queryFallbackFunction = undefined;
        }
    }
    afterViewInit() {
    }
    destroy() {
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
    }
    ngOnChanges(changes) {
        if (Util.isDefined(changes.staticData)) {
            this.setDataArray(changes.staticData.currentValue);
        }
    }
    beforeunloadHandler() {
        this.updateStateStorage();
    }
    getAttribute() {
        return this.oattr;
    }
    getComponentKey() {
        return this.getAttribute();
    }
    getDataToStore() {
        return this.state;
    }
    getRouteKey() {
        let route = this.router.url;
        this.actRoute.params.subscribe(params => {
            Object.keys(params).forEach(key => {
                route = route.replace(params[key], key);
            });
        });
        return route;
    }
    getKeys() {
        return this.keysArray;
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
    getDataArray() {
        return this.dataArray;
    }
    setDataArray(data) {
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
    }
    setFormComponent(form) {
        if (!Util.isDefined(this.form)) {
            this.form = form;
        }
        if (this.queryOnBind) {
            this.onFormDataSubscribe = this.form.onDataLoaded.subscribe(() => this.pageable ? this.reloadPaginatedDataFromStart() : this.reloadData());
        }
    }
    queryData(filter, ovrrArgs) {
        const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
            return;
        }
        const filterParentKeys = ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
        if (!ServiceUtils.filterContainsAllParentKeys(filterParentKeys, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
            this.setData([], []);
        }
        else {
            const queryArguments = this.getQueryArguments(filter, ovrrArgs);
            if (this.querySubscription) {
                this.querySubscription.unsubscribe();
            }
            if (this.loaderSubscription) {
                this.loaderSubscription.unsubscribe();
            }
            this.loaderSubscription = this.load();
            const self = this;
            this.queryArguments = queryArguments;
            this.querySubscription = this.dataService[queryMethodName]
                .apply(this.dataService, queryArguments)
                .subscribe((res) => {
                let data;
                this.sqlTypes = undefined;
                if (Util.isArray(res)) {
                    data = res;
                    this.sqlTypes = {};
                }
                else if (res.isSuccessful()) {
                    const arrData = (res.data !== undefined) ? res.data : [];
                    data = Util.isArray(arrData) ? arrData : [];
                    this.sqlTypes = res.sqlTypes;
                    if (this.pageable) {
                        this.updatePaginationInfo(res);
                    }
                }
                self.setData(data, this.sqlTypes, (ovrrArgs && ovrrArgs.replace));
                self.loaderSubscription.unsubscribe();
            }, err => {
                self.setData([], []);
                self.loaderSubscription.unsubscribe();
                if (Util.isDefined(self.queryFallbackFunction)) {
                    self.queryFallbackFunction(err);
                }
                else if (err && typeof err !== 'object') {
                    self.dialogService.alert('ERROR', err);
                }
                else {
                    self.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
                }
            });
        }
    }
    reloadData() {
        this.queryData();
    }
    reloadPaginatedDataFromStart() {
        this.reloadData();
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
    extractKeysFromRecord(item) {
        const result = {};
        if (Util.isObject(item)) {
            this.keysArray.forEach(key => {
                if (Util.isDefined(item[key])) {
                    result[key] = item[key];
                }
            });
        }
        return result;
    }
    getAttributesValuesToQuery() {
        const result = this.colArray;
        this.keysArray.forEach(key => {
            if (result.indexOf(key) === -1) {
                result.push(key);
            }
        });
        return result;
    }
    getQueryArguments(filter, ovrrArgs) {
        const compFilter = this.getComponentFilter(filter);
        const queryCols = this.getAttributesValuesToQuery();
        const sqlTypes = (ovrrArgs && ovrrArgs.hasOwnProperty('sqltypes')) ? ovrrArgs.sqltypes : this.form ? this.form.getAttributesSQLTypes() : {};
        let queryArguments = [compFilter, queryCols, this.entity, sqlTypes];
        if (this.pageable) {
            const queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.state.queryRecordOffset;
            const queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
            queryArguments = queryArguments.concat([queryOffset, queryRowsN, undefined]);
        }
        return queryArguments;
    }
    updatePaginationInfo(queryRes) {
        const resultEndIndex = queryRes.startRecordIndex + (queryRes.data ? queryRes.data.length : 0);
        if (queryRes.startRecordIndex !== undefined) {
            this.state.queryRecordOffset = resultEndIndex;
        }
        if (queryRes.totalQueryRecordsNumber !== undefined) {
            this.state.totalQueryRecordsNumber = queryRes.totalQueryRecordsNumber;
        }
    }
    getTotalRecordsNumber() {
        return (this.state && this.state.totalQueryRecordsNumber !== undefined) ? this.state.totalQueryRecordsNumber : undefined;
    }
    getComponentFilter(existingFilter = {}) {
        const filterParentKeys = ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
        existingFilter = Object.assign(existingFilter || {}, filterParentKeys);
        return existingFilter;
    }
    getSqlTypes() {
        return Util.isDefined(this.sqlTypes) ? this.sqlTypes : {};
    }
    get state() {
        return this._state;
    }
    set state(arg) {
        this._state = arg;
    }
    getParentKeysValues() {
        return ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
    }
    updateStateStorage() {
        if (this.localStorageService && this.storeState && !this.alreadyStored) {
            this.alreadyStored = true;
            this.localStorageService.updateComponentStorage(this, this.getRouteKey());
        }
    }
    setData(data, sqlTypes, replace) {
    }
    initializeState() {
        this.state = this.localStorageService.getComponentStorage(this, this.getRouteKey());
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLWJhc2UtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL28tc2VydmljZS1iYXNlLWNvbXBvbmVudC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBWSxNQUFNLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRWpFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUcvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXpELE1BQU0sQ0FBQyxNQUFNLHVDQUF1QyxHQUFHO0lBRXJELGFBQWE7SUFHYixTQUFTO0lBRVQsNEJBQTRCO0lBRzVCLFFBQVE7SUFHUiw0QkFBNEI7SUFHNUIsNEJBQTRCO0lBRTVCLDhCQUE4QjtJQUU5QixVQUFVO0lBR1YsU0FBUztJQUdULE1BQU07SUFHTix5QkFBeUI7SUFHekIseUJBQXlCO0lBR3pCLDJCQUEyQjtJQUczQiwrQ0FBK0M7SUFHL0Msd0JBQXdC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Q0FBQyxhQUFhLEVBQUU7WUFDdEUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7WUFDMUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHNCQUFzQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUMzRTtJQUNILENBQUM7SUFFUyxPQUFPLENBQUMsSUFBUyxFQUFFLFFBQWMsRUFBRSxPQUFpQjtJQUU5RCxDQUFDO0lBRUQsZUFBZTtRQUViLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN0RixDQUFDOzs7a0NBNVBBLFlBQVksU0FBQyxxQkFBcUIsRUFBRSxFQUFFOztBQTFMdkM7SUFEQyxjQUFjLEVBQUU7OzBEQUNXO0FBRTVCO0lBREMsY0FBYyxFQUFFOzswREFDVztBQUc1QjtJQURDLGNBQWMsRUFBRTs7dURBQ1M7QUFZMUI7SUFEQyxjQUFjLEVBQUU7Ozt1REFNaEI7QUFlRDtJQURDLGNBQWMsRUFBRTs7eURBQ1U7QUFFM0I7SUFEQyxjQUFjLEVBQUU7O3NFQUN3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBIb3N0TGlzdGVuZXIsIEluamVjdG9yLCBOZ1pvbmUsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUxvY2FsU3RvcmFnZUNvbXBvbmVudCB9IGZyb20gJy4uL2ludGVyZmFjZXMvbG9jYWwtc3RvcmFnZS1jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNwb25zZSB9IGZyb20gJy4uL2ludGVyZmFjZXMvc2VydmljZS1yZXNwb25zZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvb250aW1pemUvb250aW1pemUuc2VydmljZSc7XG5pbXBvcnQgeyBPUXVlcnlEYXRhQXJncyB9IGZyb20gJy4uL3R5cGVzL3F1ZXJ5LWRhdGEtYXJncy50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBTZXJ2aWNlVXRpbHMgfSBmcm9tICcuLi91dGlsL3NlcnZpY2UudXRpbHMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9CQVNFX0NPTVBPTkVOVCA9IFtcbiAgLy8gYXR0ciBbc3RyaW5nXTogbGlzdCBpZGVudGlmaWVyLiBJdCBpcyBtYW5kYXRvcnkgaWYgZGF0YSBhcmUgcHJvdmlkZWQgdGhyb3VnaCB0aGUgZGF0YSBhdHRyaWJ1dGUuIERlZmF1bHQ6IGVudGl0eSAoaWYgc2V0KS5cbiAgJ29hdHRyOiBhdHRyJyxcblxuICAvLyBzZXJ2aWNlIFtzdHJpbmddOiBKRUUgc2VydmljZSBwYXRoLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3NlcnZpY2UnLFxuXG4gICdzZXJ2aWNlVHlwZSA6IHNlcnZpY2UtdHlwZScsXG5cbiAgLy8gZW50aXR5IFtzdHJpbmddOiBlbnRpdHkgb2YgdGhlIHNlcnZpY2UuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnZW50aXR5JyxcblxuICAvLyBxdWVyeS1vbi1pbml0IFtub3x5ZXNdOiBxdWVyeSBvbiBpbml0LiBEZWZhdWx0OiB5ZXMuXG4gICdxdWVyeU9uSW5pdDogcXVlcnktb24taW5pdCcsXG5cbiAgLy8gcXVlcnktb24taW5pdCBbbm98eWVzXTogcXVlcnkgb24gYmluZC4gRGVmYXVsdDogeWVzLlxuICAncXVlcnlPbkJpbmQ6IHF1ZXJ5LW9uLWJpbmQnLFxuXG4gICdxdWVyeU9uRXZlbnQ6IHF1ZXJ5LW9uLWV2ZW50JyxcblxuICAncGFnZWFibGUnLFxuXG4gIC8vIGNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgb2YgdGhlIGVudGl0eSwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdjb2x1bW5zJyxcblxuICAvLyBrZXlzIFtzdHJpbmddOiBlbnRpdHkga2V5cywgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdrZXlzJyxcblxuICAvLyBwYXJlbnQta2V5cyBbc3RyaW5nXTogcGFyZW50IGtleXMgdG8gZmlsdGVyLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3BhcmVudEtleXM6IHBhcmVudC1rZXlzJyxcblxuICAvLyBzdGF0aWMtZGF0YSBbQXJyYXk8YW55Pl0gOiB3YXkgdG8gcG9wdWxhdGUgd2l0aCBzdGF0aWMgZGF0YS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdzdGF0aWNEYXRhOiBzdGF0aWMtZGF0YScsXG5cbiAgLy8gcXVlcnktbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHF1ZXJpZXMuIERlZmF1bHQ6IHF1ZXJ5LlxuICAncXVlcnlNZXRob2Q6IHF1ZXJ5LW1ldGhvZCcsXG5cbiAgLy8gcGFnaW5hdGVkLXF1ZXJ5LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBwYWdpbmF0ZWQgcXVlcmllcy4gRGVmYXVsdDogYWR2YW5jZWRRdWVyeS5cbiAgJ3BhZ2luYXRlZFF1ZXJ5TWV0aG9kIDogcGFnaW5hdGVkLXF1ZXJ5LW1ldGhvZCcsXG5cbiAgLy8gcXVlcnktcm93cyBbbnVtYmVyXTogbnVtYmVyIG9mIHJvd3MgcGVyIHBhZ2UuIERlZmF1bHQ6IDEwLlxuICAnb1F1ZXJ5Um93czogcXVlcnktcm93cycsXG5cbiAgLy8gaW5zZXJ0LW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSBpbnNlcnRzLiBEZWZhdWx0OiBpbnNlcnQuXG4gICdpbnNlcnRNZXRob2Q6IGluc2VydC1tZXRob2QnLFxuXG4gIC8vIHVwZGF0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gdXBkYXRlcy4gRGVmYXVsdDogdXBkYXRlLlxuICAndXBkYXRlTWV0aG9kOiB1cGRhdGUtbWV0aG9kJyxcblxuICAvLyBkZWxldGUtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGRlbGV0aW9ucy4gRGVmYXVsdDogZGVsZXRlLlxuICAnZGVsZXRlTWV0aG9kOiBkZWxldGUtbWV0aG9kJyxcblxuICAnc3RvcmVTdGF0ZTogc3RvcmUtc3RhdGUnLFxuXG4gIC8vIHF1ZXJ5LXdpdGgtbnVsbC1wYXJlbnQta2V5cyBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0byB0cmlnZ2VyIHF1ZXJ5IG1ldGhvZCB3aGVuIHBhcmVudC1rZXlzIGZpbHRlciBpcyBudWxsLiBEZWZhdWx0OiBmYWxzZVxuICAncXVlcnlXaXRoTnVsbFBhcmVudEtleXM6IHF1ZXJ5LXdpdGgtbnVsbC1wYXJlbnQta2V5cycsXG5cbiAgLy8gW2Z1bmN0aW9uXTogZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiBxdWVyeSBlcnJvci4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdxdWVyeUZhbGxiYWNrRnVuY3Rpb246IHF1ZXJ5LWZhbGxiYWNrLWZ1bmN0aW9uJ1xuICAvLyAsXG5cbiAgLy8gJ2luc2VydEZhbGxiYWNrRnVuY3Rpb246IGluc2VydC1mYWxsYmFjay1mdW5jdGlvbicsXG5cbiAgLy8gJ3VwZGF0ZUZhbGxiYWNrRnVuY3Rpb246IHVwZGF0ZS1mYWxsYmFjay1mdW5jdGlvbicsXG5cbiAgLy8gJ2RlbGV0ZUZhbGxiYWNrRnVuY3Rpb246IGRlbGV0ZS1mYWxsYmFjay1mdW5jdGlvbidcbl07XG5cbmV4cG9ydCBjbGFzcyBPU2VydmljZUJhc2VDb21wb25lbnQgaW1wbGVtZW50cyBJTG9jYWxTdG9yYWdlQ29tcG9uZW50LCBPbkNoYW5nZXMge1xuXG4gIHByb3RlY3RlZCBsb2NhbFN0b3JhZ2VTZXJ2aWNlOiBMb2NhbFN0b3JhZ2VTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcblxuICAvKiBpbnB1dHMgdmFyaWFibGVzICovXG4gIG9hdHRyOiBzdHJpbmc7XG4gIHNlcnZpY2U6IHN0cmluZztcbiAgc2VydmljZVR5cGU6IHN0cmluZztcbiAgZW50aXR5OiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHF1ZXJ5T25Jbml0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcXVlcnlPbkJpbmQ6IGJvb2xlYW4gPSB0cnVlO1xuICBxdWVyeU9uRXZlbnQ6IGFueTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcGFnZWFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29sdW1uczogc3RyaW5nO1xuICBrZXlzOiBzdHJpbmc7XG4gIHBhcmVudEtleXM6IHN0cmluZztcbiAgc3RhdGljRGF0YTogQXJyYXk8YW55PjtcbiAgcXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlFVRVJZX01FVEhPRDtcbiAgcGFnaW5hdGVkUXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlBBR0lOQVRFRF9RVUVSWV9NRVRIT0Q7XG5cbiAgb3JpZ2luYWxRdWVyeVJvd3M6IG51bWJlciA9IENvZGVzLkRFRkFVTFRfUVVFUllfUk9XUztcbiAgcHJvdGVjdGVkIF9xdWVyeVJvd3MgPSB0aGlzLm9yaWdpbmFsUXVlcnlSb3dzO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNldCBvUXVlcnlSb3dzKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICB0aGlzLm9yaWdpbmFsUXVlcnlSb3dzID0gdmFsdWU7XG4gICAgICB0aGlzLl9xdWVyeVJvd3MgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgcXVlcnlSb3dzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXJ5Um93cztcbiAgfVxuXG4gIHNldCBxdWVyeVJvd3ModmFsdWU6IG51bWJlcikge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX3F1ZXJ5Um93cyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICBpbnNlcnRNZXRob2Q6IHN0cmluZyA9IENvZGVzLklOU0VSVF9NRVRIT0Q7XG4gIHVwZGF0ZU1ldGhvZDogc3RyaW5nID0gQ29kZXMuVVBEQVRFX01FVEhPRDtcbiAgZGVsZXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5ERUxFVEVfTUVUSE9EO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdG9yZVN0YXRlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcXVlcnlXaXRoTnVsbFBhcmVudEtleXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcXVlcnlGYWxsYmFja0Z1bmN0aW9uOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIC8vIGluc2VydEZhbGxiYWNrRnVuY3Rpb246IChlcnI6IGFueSkgPT4gdm9pZDtcbiAgLy8gdXBkYXRlRmFsbGJhY2tGdW5jdGlvbjogKGVycjogYW55KSA9PiB2b2lkO1xuICAvLyBkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIC8qIGVuZCBvZiBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgLyogcGFyc2VkIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIGNvbEFycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHByb3RlY3RlZCBrZXlzQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgcHJvdGVjdGVkIF9wS2V5c0VxdWl2ID0ge307XG4gIGRhdGFBcnJheTogQXJyYXk8YW55PiA9IFtdO1xuICBwcm90ZWN0ZWQgb2F0dHJGcm9tRW50aXR5OiBib29sZWFuID0gZmFsc2U7XG4gIC8qIGVuZCBvZiBwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuXG4gIHByb3RlY3RlZCBvblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbjogYW55O1xuICBwcm90ZWN0ZWQgb25Gb3JtRGF0YVN1YnNjcmliZTogYW55O1xuXG4gIHByb3RlY3RlZCBsb2FkZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHF1ZXJ5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBkYXRhU2VydmljZTogYW55O1xuICBwcm90ZWN0ZWQgX3N0YXRlOiBhbnkgPSB7fTtcblxuICBwcm90ZWN0ZWQgbG9hZGluZ1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHVibGljIGxvYWRpbmc6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmxvYWRpbmdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByb3RlY3RlZCBmb3JtOiBPRm9ybUNvbXBvbmVudDtcbiAgcHJvdGVjdGVkIGFscmVhZHlTdG9yZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgcXVlcnlPbkV2ZW50U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWY7IC8vIGJvcnJhclxuICBwcm90ZWN0ZWQgcXVlcnlBcmd1bWVudHM6IGFueVtdO1xuXG4gIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcjtcbiAgcHJvdGVjdGVkIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZTtcblxuICBwcm90ZWN0ZWQgc3FsVHlwZXMgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChMb2NhbFN0b3JhZ2VTZXJ2aWNlKTtcbiAgICB0aGlzLnJvdXRlciA9IHRoaXMuaW5qZWN0b3IuZ2V0KFJvdXRlcik7XG4gICAgdGhpcy5hY3RSb3V0ZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFjdGl2YXRlZFJvdXRlKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5jZCA9IHRoaXMuaW5qZWN0b3IuZ2V0KENoYW5nZURldGVjdG9yUmVmKTtcbiAgICAgIHRoaXMuZm9ybSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtQ29tcG9uZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBubyBwYXJlbnQgZm9ybVxuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLm9hdHRyKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmVudGl0eSkpIHtcbiAgICAgIHRoaXMub2F0dHIgPSB0aGlzLmVudGl0eS5yZXBsYWNlKCcuJywgJ18nKTtcbiAgICAgIHRoaXMub2F0dHJGcm9tRW50aXR5ID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5rZXlzQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5rZXlzKTtcbiAgICB0aGlzLmNvbEFycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMuY29sdW1ucywgdHJ1ZSk7XG4gICAgY29uc3QgcGtBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnBhcmVudEtleXMpO1xuICAgIHRoaXMuX3BLZXlzRXF1aXYgPSBVdGlsLnBhcnNlUGFyZW50S2V5c0VxdWl2YWxlbmNlcyhwa0FycmF5LCBDb2Rlcy5DT0xVTU5TX0FMSUFTX1NFUEFSQVRPUik7XG5cbiAgICBpZiAodGhpcy5zdG9yZVN0YXRlKSB7XG4gICAgICB0aGlzLm9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uID0gdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLm9uUm91dGVDaGFuZ2Uuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gICAgICAgIC8vIHdoZW4gdGhlIHN0b3JhZ2UgaXMgdXBkYXRlZCBiZWNhdXNlIGEgcm91dGUgY2hhbmdlXG4gICAgICAgIC8vIHRoZSBhbHJlYWR5U3RvcmVkIGNvbnRyb2wgdmFyaWFibGUgaXMgY2hhbmdlZCB0byBpdHMgaW5pdGlhbCB2YWx1ZVxuICAgICAgICB0aGlzLmFscmVhZHlTdG9yZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmluaXRpYWxpemVTdGF0ZSgpO1xuXG4gICAgICAvLyBpZiBxdWVyeS1yb3dzIGluIGluaXRpYWwgY29uZmlndXJhdGlvbiBpcyBlcXVhbHMgdG8gb3JpZ2luYWwgcXVlcnktcm93cyBpbnB1dFxuICAgICAgLy8gcXVlcnlfcm93cyB3aWxsIGJlIHRoZSB2YWx1ZSBpbiBsb2NhbCBzdG9yYWdlXG4gICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgncXVlcnktcm93cycpKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdpbml0aWFsLWNvbmZpZ3VyYXRpb24nKSAmJiB0aGlzLnN0YXRlWydpbml0aWFsLWNvbmZpZ3VyYXRpb24nXS5oYXNPd25Qcm9wZXJ0eSgncXVlcnktcm93cycpXG4gICAgICAgICAgJiYgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ11bJ3F1ZXJ5LXJvd3MnXSA9PT0gdGhpcy5vcmlnaW5hbFF1ZXJ5Um93cykge1xuICAgICAgICAgIHRoaXMucXVlcnlSb3dzID0gdGhpcy5zdGF0ZVsncXVlcnktcm93cyddO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSkge1xuICAgICAgdGhpcy5xdWVyeU9uQmluZCA9IGZhbHNlO1xuICAgICAgdGhpcy5xdWVyeU9uSW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXREYXRhQXJyYXkodGhpcy5zdGF0aWNEYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9ybSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRhdGFTZXJ2aWNlKSkge1xuICAgICAgdGhpcy5zZXRGb3JtQ29tcG9uZW50KHRoaXMuZm9ybSk7XG4gICAgfVxuXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMucXVlcnlPbkV2ZW50KSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnF1ZXJ5T25FdmVudC5zdWJzY3JpYmUpKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMucXVlcnlPbkV2ZW50U3Vic2NyaXB0aW9uID0gdGhpcy5xdWVyeU9uRXZlbnQuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsdWUpIHx8IHRoaXMucXVlcnlXaXRoTnVsbFBhcmVudEtleXMpIHtcbiAgICAgICAgICBzZWxmLnF1ZXJ5RGF0YSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gaWYgKHR5cGVvZiB0aGlzLmluc2VydEZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyAgIHRoaXMuaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAvLyB9XG4gICAgLy8gaWYgKHR5cGVvZiB0aGlzLnVwZGF0ZUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyAgIHRoaXMudXBkYXRlRmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAvLyB9XG4gICAgLy8gaWYgKHR5cGVvZiB0aGlzLmRlbGV0ZUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyAgIHRoaXMuZGVsZXRlRmFsbGJhY2tGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAvLyB9XG4gIH1cblxuICBhZnRlclZpZXdJbml0KCkge1xuICAgIC8vXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLm9uRm9ybURhdGFTdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMub25Gb3JtRGF0YVN1YnNjcmliZS51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLm9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeU9uRXZlbnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVTdGF0ZVN0b3JhZ2UoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHsgW3Byb3BOYW1lOiBzdHJpbmddOiBTaW1wbGVDaGFuZ2UgfSkge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjaGFuZ2VzLnN0YXRpY0RhdGEpKSB7XG4gICAgICB0aGlzLnNldERhdGFBcnJheShjaGFuZ2VzLnN0YXRpY0RhdGEuY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JldW5sb2FkJywgW10pXG4gIGJlZm9yZXVubG9hZEhhbmRsZXIoKSB7XG4gICAgdGhpcy51cGRhdGVTdGF0ZVN0b3JhZ2UoKTtcbiAgfVxuXG4gIGdldEF0dHJpYnV0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9hdHRyO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50S2V5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QXR0cmlidXRlKCk7XG4gIH1cblxuICBnZXREYXRhVG9TdG9yZSgpOiBvYmplY3Qge1xuICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICB9XG5cbiAgZ2V0Um91dGVLZXkoKTogc3RyaW5nIHtcbiAgICBsZXQgcm91dGUgPSB0aGlzLnJvdXRlci51cmw7XG4gICAgdGhpcy5hY3RSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgcm91dGUgPSByb3V0ZS5yZXBsYWNlKHBhcmFtc1trZXldLCBrZXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgZ2V0S2V5cygpIHtcbiAgICByZXR1cm4gdGhpcy5rZXlzQXJyYXk7XG4gIH1cblxuICBjb25maWd1cmVTZXJ2aWNlKCkge1xuICAgIGxldCBsb2FkaW5nU2VydmljZTogYW55ID0gT250aW1pemVTZXJ2aWNlO1xuICAgIGlmICh0aGlzLnNlcnZpY2VUeXBlKSB7XG4gICAgICBsb2FkaW5nU2VydmljZSA9IHRoaXMuc2VydmljZVR5cGU7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQ8YW55Pihsb2FkaW5nU2VydmljZSk7XG4gICAgICBpZiAoVXRpbC5pc0RhdGFTZXJ2aWNlKHRoaXMuZGF0YVNlcnZpY2UpKSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2VDZmcgPSB0aGlzLmRhdGFTZXJ2aWNlLmdldERlZmF1bHRTZXJ2aWNlQ29uZmlndXJhdGlvbih0aGlzLnNlcnZpY2UpO1xuICAgICAgICBpZiAodGhpcy5lbnRpdHkpIHtcbiAgICAgICAgICBzZXJ2aWNlQ2ZnLmVudGl0eSA9IHRoaXMuZW50aXR5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGF0YVNlcnZpY2UuY29uZmlndXJlU2VydmljZShzZXJ2aWNlQ2ZnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldERhdGFBcnJheSgpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhQXJyYXk7XG4gIH1cblxuICBzZXREYXRhQXJyYXkoZGF0YTogYW55KTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNBcnJheShkYXRhKSkge1xuICAgICAgdGhpcy5kYXRhQXJyYXkgPSBkYXRhO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChkYXRhKSkge1xuICAgICAgdGhpcy5kYXRhQXJyYXkgPSBbZGF0YV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQ29tcG9uZW50IGhhcyByZWNlaXZlZCBub3Qgc3VwcG9ydGVkIHNlcnZpY2UgZGF0YS4gU3VwcG9ydGVkIGRhdGEgYXJlIEFycmF5IG9yIE9iamVjdCcpO1xuICAgICAgdGhpcy5kYXRhQXJyYXkgPSBbXTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0Rm9ybUNvbXBvbmVudChmb3JtOiBPRm9ybUNvbXBvbmVudCk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5mb3JtKSkge1xuICAgICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5xdWVyeU9uQmluZCkge1xuICAgICAgdGhpcy5vbkZvcm1EYXRhU3Vic2NyaWJlID0gdGhpcy5mb3JtLm9uRGF0YUxvYWRlZC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wYWdlYWJsZSA/IHRoaXMucmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpIDogdGhpcy5yZWxvYWREYXRhKCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBxdWVyeURhdGEoZmlsdGVyPzogYW55LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgcXVlcnlNZXRob2ROYW1lID0gdGhpcy5wYWdlYWJsZSA/IHRoaXMucGFnaW5hdGVkUXVlcnlNZXRob2QgOiB0aGlzLnF1ZXJ5TWV0aG9kO1xuICAgIGlmICghdGhpcy5kYXRhU2VydmljZSB8fCAhKHF1ZXJ5TWV0aG9kTmFtZSBpbiB0aGlzLmRhdGFTZXJ2aWNlKSB8fCAhdGhpcy5lbnRpdHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyUGFyZW50S2V5cyA9IFNlcnZpY2VVdGlscy5nZXRQYXJlbnRLZXlzRnJvbUZvcm0odGhpcy5fcEtleXNFcXVpdiwgdGhpcy5mb3JtKTtcbiAgICBpZiAoIVNlcnZpY2VVdGlscy5maWx0ZXJDb250YWluc0FsbFBhcmVudEtleXMoZmlsdGVyUGFyZW50S2V5cywgdGhpcy5fcEtleXNFcXVpdikgJiYgIXRoaXMucXVlcnlXaXRoTnVsbFBhcmVudEtleXMpIHtcbiAgICAgIHRoaXMuc2V0RGF0YShbXSwgW10pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBxdWVyeUFyZ3VtZW50cyA9IHRoaXMuZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyLCBvdnJyQXJncyk7XG4gICAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5sb2FkZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMucXVlcnlBcmd1bWVudHMgPSBxdWVyeUFyZ3VtZW50cztcbiAgICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24gPSB0aGlzLmRhdGFTZXJ2aWNlW3F1ZXJ5TWV0aG9kTmFtZV1cbiAgICAgICAgLmFwcGx5KHRoaXMuZGF0YVNlcnZpY2UsIHF1ZXJ5QXJndW1lbnRzKVxuICAgICAgICAuc3Vic2NyaWJlKChyZXM6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGxldCBkYXRhO1xuICAgICAgICAgIHRoaXMuc3FsVHlwZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKFV0aWwuaXNBcnJheShyZXMpKSB7XG4gICAgICAgICAgICBkYXRhID0gcmVzO1xuICAgICAgICAgICAgdGhpcy5zcWxUeXBlcyA9IHt9O1xuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmlzU3VjY2Vzc2Z1bCgpKSB7XG4gICAgICAgICAgICBjb25zdCBhcnJEYXRhID0gKHJlcy5kYXRhICE9PSB1bmRlZmluZWQpID8gcmVzLmRhdGEgOiBbXTtcbiAgICAgICAgICAgIGRhdGEgPSBVdGlsLmlzQXJyYXkoYXJyRGF0YSkgPyBhcnJEYXRhIDogW107XG4gICAgICAgICAgICB0aGlzLnNxbFR5cGVzID0gcmVzLnNxbFR5cGVzO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uSW5mbyhyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLnNldERhdGEoZGF0YSwgdGhpcy5zcWxUeXBlcywgKG92cnJBcmdzICYmIG92cnJBcmdzLnJlcGxhY2UpKTtcbiAgICAgICAgICBzZWxmLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgIHNlbGYuc2V0RGF0YShbXSwgW10pO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHNlbGYucXVlcnlGYWxsYmFja0Z1bmN0aW9uKSkge1xuICAgICAgICAgICAgc2VsZi5xdWVyeUZhbGxiYWNrRnVuY3Rpb24oZXJyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGVyciAmJiB0eXBlb2YgZXJyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgc2VsZi5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVycik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfUVVFUlknKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZWxvYWREYXRhKCk6IHZvaWQge1xuICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVsb2FkcyB0aGUgY29tcG9uZW50IGRhdGEgYW5kIHJlc3RhcnRzIHRoZSBwYWdpbmF0aW9uLlxuICAgKi9cbiAgcmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgfVxuXG4gIGxvYWQoKTogYW55IHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCB6b25lID0gdGhpcy5pbmplY3Rvci5nZXQoTmdab25lKTtcbiAgICBjb25zdCBsb2FkT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xuICAgICAgfSwgMjUwKTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBzZWxmLmxvYWRpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICB9KTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBsb2FkT2JzZXJ2YWJsZS5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgIHpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgc2VsZi5sb2FkaW5nU3ViamVjdC5uZXh0KHZhbCBhcyBib29sZWFuKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdGluZyB0aGUgZ2l2ZW4gcmVjb3JkIGtleXNcbiAgICogQHBhcmFtIGl0ZW0gcmVjb3JkIG9iamVjdFxuICAgKiBAcmV0dXJucyBvYmplY3QgY29udGFpbmluZyBpdGVtIG9iamVjdCBwcm9wZXJ0aWVzIGNvbnRhaW5lZCBpbiBrZXlzQXJyYXlcbiAgICovXG4gIGV4dHJhY3RLZXlzRnJvbVJlY29yZChpdGVtOiBhbnkpOiBvYmplY3Qge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGlmIChVdGlsLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChpdGVtW2tleV0pKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0QXR0cmlidXRlc1ZhbHVlc1RvUXVlcnkoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jb2xBcnJheTtcbiAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAocmVzdWx0LmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0UXVlcnlBcmd1bWVudHMoZmlsdGVyOiBvYmplY3QsIG92cnJBcmdzPzogT1F1ZXJ5RGF0YUFyZ3MpOiBBcnJheTxhbnk+IHtcbiAgICBjb25zdCBjb21wRmlsdGVyID0gdGhpcy5nZXRDb21wb25lbnRGaWx0ZXIoZmlsdGVyKTtcbiAgICBjb25zdCBxdWVyeUNvbHMgPSB0aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk7XG4gICAgY29uc3Qgc3FsVHlwZXMgPSAob3ZyckFyZ3MgJiYgb3ZyckFyZ3MuaGFzT3duUHJvcGVydHkoJ3NxbHR5cGVzJykpID8gb3ZyckFyZ3Muc3FsdHlwZXMgOiB0aGlzLmZvcm0gPyB0aGlzLmZvcm0uZ2V0QXR0cmlidXRlc1NRTFR5cGVzKCkgOiB7fTtcblxuICAgIGxldCBxdWVyeUFyZ3VtZW50cyA9IFtjb21wRmlsdGVyLCBxdWVyeUNvbHMsIHRoaXMuZW50aXR5LCBzcWxUeXBlc107XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5T2Zmc2V0ID0gKG92cnJBcmdzICYmIG92cnJBcmdzLmhhc093blByb3BlcnR5KCdvZmZzZXQnKSkgPyBvdnJyQXJncy5vZmZzZXQgOiB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgICAgY29uc3QgcXVlcnlSb3dzTiA9IChvdnJyQXJncyAmJiBvdnJyQXJncy5oYXNPd25Qcm9wZXJ0eSgnbGVuZ3RoJykpID8gb3ZyckFyZ3MubGVuZ3RoIDogdGhpcy5xdWVyeVJvd3M7XG4gICAgICBxdWVyeUFyZ3VtZW50cyA9IHF1ZXJ5QXJndW1lbnRzLmNvbmNhdChbcXVlcnlPZmZzZXQsIHF1ZXJ5Um93c04sIHVuZGVmaW5lZF0pO1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICB1cGRhdGVQYWdpbmF0aW9uSW5mbyhxdWVyeVJlczogU2VydmljZVJlc3BvbnNlKSB7XG4gICAgY29uc3QgcmVzdWx0RW5kSW5kZXggPSBxdWVyeVJlcy5zdGFydFJlY29yZEluZGV4ICsgKHF1ZXJ5UmVzLmRhdGEgPyBxdWVyeVJlcy5kYXRhLmxlbmd0aCA6IDApO1xuICAgIGlmIChxdWVyeVJlcy5zdGFydFJlY29yZEluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSByZXN1bHRFbmRJbmRleDtcbiAgICB9XG4gICAgaWYgKHF1ZXJ5UmVzLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgPSBxdWVyeVJlcy50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlcjtcbiAgICB9XG4gIH1cblxuICBnZXRUb3RhbFJlY29yZHNOdW1iZXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gKHRoaXMuc3RhdGUgJiYgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciAhPT0gdW5kZWZpbmVkKSA/IHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRDb21wb25lbnRGaWx0ZXIoZXhpc3RpbmdGaWx0ZXI6IGFueSA9IHt9KTogYW55IHtcbiAgICBjb25zdCBmaWx0ZXJQYXJlbnRLZXlzID0gU2VydmljZVV0aWxzLmdldFBhcmVudEtleXNGcm9tRm9ybSh0aGlzLl9wS2V5c0VxdWl2LCB0aGlzLmZvcm0pO1xuICAgIGV4aXN0aW5nRmlsdGVyID0gT2JqZWN0LmFzc2lnbihleGlzdGluZ0ZpbHRlciB8fCB7fSwgZmlsdGVyUGFyZW50S2V5cyk7XG4gICAgcmV0dXJuIGV4aXN0aW5nRmlsdGVyO1xuICB9XG5cbiAgZ2V0U3FsVHlwZXMoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuc3FsVHlwZXMpID8gdGhpcy5zcWxUeXBlcyA6IHt9O1xuICB9XG5cbiAgZ2V0IHN0YXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgc2V0IHN0YXRlKGFyZzogYW55KSB7XG4gICAgdGhpcy5fc3RhdGUgPSBhcmc7XG4gIH1cblxuICBnZXRQYXJlbnRLZXlzVmFsdWVzKCkge1xuICAgIHJldHVybiBTZXJ2aWNlVXRpbHMuZ2V0UGFyZW50S2V5c0Zyb21Gb3JtKHRoaXMuX3BLZXlzRXF1aXYsIHRoaXMuZm9ybSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGVTdG9yYWdlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UgJiYgdGhpcy5zdG9yZVN0YXRlICYmICF0aGlzLmFscmVhZHlTdG9yZWQpIHtcbiAgICAgIHRoaXMuYWxyZWFkeVN0b3JlZCA9IHRydWU7XG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UudXBkYXRlQ29tcG9uZW50U3RvcmFnZSh0aGlzLCB0aGlzLmdldFJvdXRlS2V5KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzZXREYXRhKGRhdGE6IGFueSwgc3FsVHlwZXM/OiBhbnksIHJlcGxhY2U/OiBib29sZWFuKTogdm9pZCB7XG4gICAgLy9cbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICAvLyBHZXQgcHJldmlvdXMgc3RhdHVzXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXRDb21wb25lbnRTdG9yYWdlKHRoaXMsIHRoaXMuZ2V0Um91dGVLZXkoKSk7XG4gIH1cbn1cbiJdfQ==