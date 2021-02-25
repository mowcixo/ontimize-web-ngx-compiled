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
        try {
            this.expandableContainer = this.injector.get(OExpandableContainerComponent);
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
    getParentKeysFromContext(parentKeys, context) {
        let result = {};
        if (context instanceof OExpandableContainerComponent) {
            result = ServiceUtils.getParentKeysFromExpandableContainer(parentKeys, context);
        }
        else {
            result = ServiceUtils.getParentKeysFromForm(parentKeys, context);
        }
        return result;
    }
    queryData(filter, ovrrArgs) {
        const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
        if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
            return;
        }
        const filterParentKeys = this.getParentKeysValues();
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
    getContextComponent() {
        return this.expandableContainer || this.form;
    }
    getComponentFilter(existingFilter = {}) {
        const filterParentKeys = this.getParentKeysFromContext(this._pKeysEquiv, this.getContextComponent());
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
        const context = this.getContextComponent();
        return this.getParentKeysFromContext(this._pKeysEquiv, context);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLWJhc2UtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL28tc2VydmljZS1iYXNlLWNvbXBvbmVudC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBWSxNQUFNLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQzNHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRWpFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUcvRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBRXhHLE1BQU0sQ0FBQyxNQUFNLHVDQUF1QyxHQUFHO0lBRXJELGFBQWE7SUFHYixTQUFTO0lBRVQsNEJBQTRCO0lBRzVCLFFBQVE7SUFHUiw0QkFBNEI7SUFHNUIsNEJBQTRCO0lBRTVCLDhCQUE4QjtJQUU5QixVQUFVO0lBR1YsU0FBUztJQUdULE1BQU07SUFHTix5QkFBeUI7SUFHekIs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QjtJQURDLGNBQWMsRUFBRTs7MERBQ1c7QUFHNUI7SUFEQyxjQUFjLEVBQUU7O3VEQUNTO0FBWTFCO0lBREMsY0FBYyxFQUFFOzs7dURBTWhCO0FBZUQ7SUFEQyxjQUFjLEVBQUU7O3lEQUNVO0FBRTNCO0lBREMsY0FBYyxFQUFFOztzRUFDd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgSG9zdExpc3RlbmVyLCBJbmplY3RvciwgTmdab25lLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElMb2NhbFN0b3JhZ2VDb21wb25lbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2xvY2FsLXN0b3JhZ2UtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbG9jYWwtc3RvcmFnZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL29udGltaXplL29udGltaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1F1ZXJ5RGF0YUFyZ3MgfSBmcm9tICcuLi90eXBlcy9xdWVyeS1kYXRhLWFyZ3MudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRXhwYW5kYWJsZUNvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vZXhwYW5kYWJsZS1jb250YWluZXIvby1leHBhbmRhYmxlLWNvbnRhaW5lci5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19TRVJWSUNFX0JBU0VfQ09NUE9ORU5UID0gW1xuICAvLyBhdHRyIFtzdHJpbmddOiBsaXN0IGlkZW50aWZpZXIuIEl0IGlzIG1hbmRhdG9yeSBpZiBkYXRhIGFyZSBwcm92aWRlZCB0aHJvdWdoIHRoZSBkYXRhIGF0dHJpYnV0ZS4gRGVmYXVsdDogZW50aXR5IChpZiBzZXQpLlxuICAnb2F0dHI6IGF0dHInLFxuXG4gIC8vIHNlcnZpY2UgW3N0cmluZ106IEpFRSBzZXJ2aWNlIHBhdGguIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc2VydmljZScsXG5cbiAgJ3NlcnZpY2VUeXBlIDogc2VydmljZS10eXBlJyxcblxuICAvLyBlbnRpdHkgW3N0cmluZ106IGVudGl0eSBvZiB0aGUgc2VydmljZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdlbnRpdHknLFxuXG4gIC8vIHF1ZXJ5LW9uLWluaXQgW25vfHllc106IHF1ZXJ5IG9uIGluaXQuIERlZmF1bHQ6IHllcy5cbiAgJ3F1ZXJ5T25Jbml0OiBxdWVyeS1vbi1pbml0JyxcblxuICAvLyBxdWVyeS1vbi1pbml0IFtub3x5ZXNdOiBxdWVyeSBvbiBiaW5kLiBEZWZhdWx0OiB5ZXMuXG4gICdxdWVyeU9uQmluZDogcXVlcnktb24tYmluZCcsXG5cbiAgJ3F1ZXJ5T25FdmVudDogcXVlcnktb24tZXZlbnQnLFxuXG4gICdwYWdlYWJsZScsXG5cbiAgLy8gY29sdW1ucyBbc3RyaW5nXTogY29sdW1ucyBvZiB0aGUgZW50aXR5LCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2NvbHVtbnMnLFxuXG4gIC8vIGtleXMgW3N0cmluZ106IGVudGl0eSBrZXlzLCBzZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2tleXMnLFxuXG4gIC8vIHBhcmVudC1rZXlzIFtzdHJpbmddOiBwYXJlbnQga2V5cyB0byBmaWx0ZXIsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncGFyZW50S2V5czogcGFyZW50LWtleXMnLFxuXG4gIC8vIHN0YXRpYy1kYXRhIFtBcnJheTxhbnk+XSA6IHdheSB0byBwb3B1bGF0ZSB3aXRoIHN0YXRpYyBkYXRhLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3N0YXRpY0RhdGE6IHN0YXRpYy1kYXRhJyxcblxuICAvLyBxdWVyeS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gcXVlcmllcy4gRGVmYXVsdDogcXVlcnkuXG4gICdxdWVyeU1ldGhvZDogcXVlcnktbWV0aG9kJyxcblxuICAvLyBwYWdpbmF0ZWQtcXVlcnktbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHBhZ2luYXRlZCBxdWVyaWVzLiBEZWZhdWx0OiBhZHZhbmNlZFF1ZXJ5LlxuICAncGFnaW5hdGVkUXVlcnlNZXRob2QgOiBwYWdpbmF0ZWQtcXVlcnktbWV0aG9kJyxcblxuICAvLyBxdWVyeS1yb3dzIFtudW1iZXJdOiBudW1iZXIgb2Ygcm93cyBwZXIgcGFnZS4gRGVmYXVsdDogMTAuXG4gICdvUXVlcnlSb3dzOiBxdWVyeS1yb3dzJyxcblxuICAvLyBpbnNlcnQtbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIGluc2VydHMuIERlZmF1bHQ6IGluc2VydC5cbiAgJ2luc2VydE1ldGhvZDogaW5zZXJ0LW1ldGhvZCcsXG5cbiAgLy8gdXBkYXRlLW1ldGhvZCBbc3RyaW5nXTogbmFtZSBvZiB0aGUgc2VydmljZSBtZXRob2QgdG8gcGVyZm9ybSB1cGRhdGVzLiBEZWZhdWx0OiB1cGRhdGUuXG4gICd1cGRhdGVNZXRob2Q6IHVwZGF0ZS1tZXRob2QnLFxuXG4gIC8vIGRlbGV0ZS1tZXRob2QgW3N0cmluZ106IG5hbWUgb2YgdGhlIHNlcnZpY2UgbWV0aG9kIHRvIHBlcmZvcm0gZGVsZXRpb25zLiBEZWZhdWx0OiBkZWxldGUuXG4gICdkZWxldGVNZXRob2Q6IGRlbGV0ZS1tZXRob2QnLFxuXG4gICdzdG9yZVN0YXRlOiBzdG9yZS1zdGF0ZScsXG5cbiAgLy8gcXVlcnktd2l0aC1udWxsLXBhcmVudC1rZXlzIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRvIHRyaWdnZXIgcXVlcnkgbWV0aG9kIHdoZW4gcGFyZW50LWtleXMgZmlsdGVyIGlzIG51bGwuIERlZmF1bHQ6IGZhbHNlXG4gICdxdWVyeVdpdGhOdWxsUGFyZW50S2V5czogcXVlcnktd2l0aC1udWxsLXBhcmVudC1rZXlzJyxcblxuICAvLyBbZnVuY3Rpb25dOiBmdW5jdGlvbiB0byBleGVjdXRlIG9uIHF1ZXJ5IGVycm9yLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ3F1ZXJ5RmFsbGJhY2tGdW5jdGlvbjogcXVlcnktZmFsbGJhY2stZnVuY3Rpb24nXG4gIC8vICxcblxuICAvLyAnaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogaW5zZXJ0LWZhbGxiYWNrLWZ1bmN0aW9uJyxcblxuICAvLyAndXBkYXRlRmFsbGJhY2tGdW5jdGlvbjogdXBkYXRlLWZhbGxiYWNrLWZ1bmN0aW9uJyxcblxuICAvLyAnZGVsZXRlRmFsbGJhY2tGdW5jdGlvbjogZGVsZXRlLWZhbGxiYWNrLWZ1bmN0aW9uJ1xuXTtcblxuZXhwb3J0IGNsYXNzIE9TZXJ2aWNlQmFzZUNvbXBvbmVudCBpbXBsZW1lbnRzIElMb2NhbFN0b3JhZ2VDb21wb25lbnQsIE9uQ2hhbmdlcyB7XG5cbiAgcHJvdGVjdGVkIGxvY2FsU3RvcmFnZVNlcnZpY2U6IExvY2FsU3RvcmFnZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuXG4gIC8qIGlucHV0cyB2YXJpYWJsZXMgKi9cbiAgb2F0dHI6IHN0cmluZztcbiAgc2VydmljZTogc3RyaW5nO1xuICBzZXJ2aWNlVHlwZTogc3RyaW5nO1xuICBlbnRpdHk6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcXVlcnlPbkluaXQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBxdWVyeU9uQmluZDogYm9vbGVhbiA9IHRydWU7XG4gIHF1ZXJ5T25FdmVudDogYW55O1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwYWdlYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBjb2x1bW5zOiBzdHJpbmc7XG4gIGtleXM6IHN0cmluZztcbiAgcGFyZW50S2V5czogc3RyaW5nO1xuICBzdGF0aWNEYXRhOiBBcnJheTxhbnk+O1xuICBxdWVyeU1ldGhvZDogc3RyaW5nID0gQ29kZXMuUVVFUllfTUVUSE9EO1xuICBwYWdpbmF0ZWRRdWVyeU1ldGhvZDogc3RyaW5nID0gQ29kZXMuUEFHSU5BVEVEX1FVRVJZX01FVEhPRDtcblxuICBvcmlnaW5hbFF1ZXJ5Um93czogbnVtYmVyID0gQ29kZXMuREVGQVVMVF9RVUVSWV9ST1dTO1xuICBwcm90ZWN0ZWQgX3F1ZXJ5Um93cyA9IHRoaXMub3JpZ2luYWxRdWVyeVJvd3M7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgc2V0IG9RdWVyeVJvd3ModmFsdWU6IG51bWJlcikge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMub3JpZ2luYWxRdWVyeVJvd3MgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3F1ZXJ5Um93cyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBxdWVyeVJvd3MoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcXVlcnlSb3dzO1xuICB9XG5cbiAgc2V0IHF1ZXJ5Um93cyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgdGhpcy5fcXVlcnlSb3dzID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIGluc2VydE1ldGhvZDogc3RyaW5nID0gQ29kZXMuSU5TRVJUX01FVEhPRDtcbiAgdXBkYXRlTWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5VUERBVEVfTUVUSE9EO1xuICBkZWxldGVNZXRob2Q6IHN0cmluZyA9IENvZGVzLkRFTEVURV9NRVRIT0Q7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHN0b3JlU3RhdGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBxdWVyeVdpdGhOdWxsUGFyZW50S2V5czogYm9vbGVhbiA9IGZhbHNlO1xuICBxdWVyeUZhbGxiYWNrRnVuY3Rpb246IChlcnI6IGFueSkgPT4gdm9pZDtcbiAgLy8gaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogKGVycjogYW55KSA9PiB2b2lkO1xuICAvLyB1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gIC8vIGRlbGV0ZUZhbGxiYWNrRnVuY3Rpb246IChlcnI6IGFueSkgPT4gdm9pZDtcbiAgLyogZW5kIG9mIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICAvKiBwYXJzZWQgaW5wdXRzIHZhcmlhYmxlcyAqL1xuICBwcm90ZWN0ZWQgY29sQXJyYXk6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgcHJvdGVjdGVkIGtleXNBcnJheTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBwcm90ZWN0ZWQgX3BLZXlzRXF1aXYgPSB7fTtcbiAgZGF0YUFycmF5OiBBcnJheTxhbnk+ID0gW107XG4gIHByb3RlY3RlZCBvYXR0ckZyb21FbnRpdHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyogZW5kIG9mIHBhcnNlZCBpbnB1dHMgdmFyaWFibGVzICovXG5cbiAgcHJvdGVjdGVkIG9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uOiBhbnk7XG4gIHByb3RlY3RlZCBvbkZvcm1EYXRhU3Vic2NyaWJlOiBhbnk7XG5cbiAgcHJvdGVjdGVkIGxvYWRlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgcXVlcnlTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGRhdGFTZXJ2aWNlOiBhbnk7XG4gIHByb3RlY3RlZCBfc3RhdGU6IGFueSA9IHt9O1xuXG4gIHByb3RlY3RlZCBsb2FkaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwdWJsaWMgbG9hZGluZzogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMubG9hZGluZ1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgcHJvdGVjdGVkIGZvcm06IE9Gb3JtQ29tcG9uZW50O1xuICBwdWJsaWMgZXhwYW5kYWJsZUNvbnRhaW5lcjogT0V4cGFuZGFibGVDb250YWluZXJDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBhbHJlYWR5U3RvcmVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmOyAvLyBib3JyYXJcbiAgcHJvdGVjdGVkIHF1ZXJ5QXJndW1lbnRzOiBhbnlbXTtcblxuICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXI7XG4gIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGU7XG5cbiAgcHJvdGVjdGVkIHNxbFR5cGVzID0gdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxTdG9yYWdlU2VydmljZSk7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICAgIHRoaXMuYWN0Um91dGUgPSB0aGlzLmluamVjdG9yLmdldChBY3RpdmF0ZWRSb3V0ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2QgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgICB0aGlzLmZvcm0gPSB0aGlzLmluamVjdG9yLmdldChPRm9ybUNvbXBvbmVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm8gcGFyZW50IGZvcm1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZXhwYW5kYWJsZUNvbnRhaW5lciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9FeHBhbmRhYmxlQ29udGFpbmVyQ29tcG9uZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBObyBwYXJlbnQgT0V4cGFuZGFibGVDb250YWluZXJDb21wb25lbnRcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5vYXR0cikgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5lbnRpdHkpKSB7XG4gICAgICB0aGlzLm9hdHRyID0gdGhpcy5lbnRpdHkucmVwbGFjZSgnLicsICdfJyk7XG4gICAgICB0aGlzLm9hdHRyRnJvbUVudGl0eSA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMua2V5c0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMua2V5cyk7XG4gICAgdGhpcy5jb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGNvbnN0IHBrQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5wYXJlbnRLZXlzKTtcbiAgICB0aGlzLl9wS2V5c0VxdWl2ID0gVXRpbC5wYXJzZVBhcmVudEtleXNFcXVpdmFsZW5jZXMocGtBcnJheSwgQ29kZXMuQ09MVU1OU19BTElBU19TRVBBUkFUT1IpO1xuXG4gICAgaWYgKHRoaXMuc3RvcmVTdGF0ZSkge1xuICAgICAgdGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbiA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5vblJvdXRlQ2hhbmdlLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlU3RvcmFnZSgpO1xuICAgICAgICAvLyB3aGVuIHRoZSBzdG9yYWdlIGlzIHVwZGF0ZWQgYmVjYXVzZSBhIHJvdXRlIGNoYW5nZVxuICAgICAgICAvLyB0aGUgYWxyZWFkeVN0b3JlZCBjb250cm9sIHZhcmlhYmxlIGlzIGNoYW5nZWQgdG8gaXRzIGluaXRpYWwgdmFsdWVcbiAgICAgICAgdGhpcy5hbHJlYWR5U3RvcmVkID0gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pbml0aWFsaXplU3RhdGUoKTtcblxuICAgICAgLy8gaWYgcXVlcnktcm93cyBpbiBpbml0aWFsIGNvbmZpZ3VyYXRpb24gaXMgZXF1YWxzIHRvIG9yaWdpbmFsIHF1ZXJ5LXJvd3MgaW5wdXRcbiAgICAgIC8vIHF1ZXJ5X3Jvd3Mgd2lsbCBiZSB0aGUgdmFsdWUgaW4gbG9jYWwgc3RvcmFnZVxuICAgICAgaWYgKHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ3F1ZXJ5LXJvd3MnKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdGlhbC1jb25maWd1cmF0aW9uJykgJiYgdGhpcy5zdGF0ZVsnaW5pdGlhbC1jb25maWd1cmF0aW9uJ10uaGFzT3duUHJvcGVydHkoJ3F1ZXJ5LXJvd3MnKVxuICAgICAgICAgICYmIHRoaXMuc3RhdGVbJ2luaXRpYWwtY29uZmlndXJhdGlvbiddWydxdWVyeS1yb3dzJ10gPT09IHRoaXMub3JpZ2luYWxRdWVyeVJvd3MpIHtcbiAgICAgICAgICB0aGlzLnF1ZXJ5Um93cyA9IHRoaXMuc3RhdGVbJ3F1ZXJ5LXJvd3MnXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRpY0RhdGEpIHtcbiAgICAgIHRoaXMucXVlcnlPbkJpbmQgPSBmYWxzZTtcbiAgICAgIHRoaXMucXVlcnlPbkluaXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KHRoaXMuc3RhdGljRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlndXJlU2VydmljZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvcm0gJiYgVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgIHRoaXMuc2V0Rm9ybUNvbXBvbmVudCh0aGlzLmZvcm0pO1xuICAgIH1cblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnF1ZXJ5T25FdmVudCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5xdWVyeU9uRXZlbnQuc3Vic2NyaWJlKSkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbiA9IHRoaXMucXVlcnlPbkV2ZW50LnN1YnNjcmliZSgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHZhbHVlKSB8fCB0aGlzLnF1ZXJ5V2l0aE51bGxQYXJlbnRLZXlzKSB7XG4gICAgICAgICAgc2VsZi5xdWVyeURhdGEoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmluc2VydEZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLnVwZGF0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICAgIC8vIGlmICh0eXBlb2YgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gICB0aGlzLmRlbGV0ZUZhbGxiYWNrRnVuY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgLy8gfVxuICB9XG5cbiAgYWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvL1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5vbkZvcm1EYXRhU3Vic2NyaWJlKSB7XG4gICAgICB0aGlzLm9uRm9ybURhdGFTdWJzY3JpYmUudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucXVlcnlTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeU9uRXZlbnRTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucXVlcnlPbkV2ZW50U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7IFtwcm9wTmFtZTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlIH0pIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2hhbmdlcy5zdGF0aWNEYXRhKSkge1xuICAgICAgdGhpcy5zZXREYXRhQXJyYXkoY2hhbmdlcy5zdGF0aWNEYXRhLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmJlZm9yZXVubG9hZCcsIFtdKVxuICBiZWZvcmV1bmxvYWRIYW5kbGVyKCkge1xuICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vYXR0cjtcbiAgfVxuXG4gIGdldENvbXBvbmVudEtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZSgpO1xuICB9XG5cbiAgZ2V0RGF0YVRvU3RvcmUoKTogb2JqZWN0IHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgfVxuXG4gIGdldFJvdXRlS2V5KCk6IHN0cmluZyB7XG4gICAgbGV0IHJvdXRlID0gdGhpcy5yb3V0ZXIudXJsO1xuICAgIHRoaXMuYWN0Um91dGUucGFyYW1zLnN1YnNjcmliZShwYXJhbXMgPT4ge1xuICAgICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHJvdXRlID0gcm91dGUucmVwbGFjZShwYXJhbXNba2V5XSwga2V5KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByb3V0ZTtcbiAgfVxuXG4gIGdldEtleXMoKSB7XG4gICAgcmV0dXJuIHRoaXMua2V5c0FycmF5O1xuICB9XG5cbiAgY29uZmlndXJlU2VydmljZSgpIHtcbiAgICBsZXQgbG9hZGluZ1NlcnZpY2U6IGFueSA9IE9udGltaXplU2VydmljZTtcbiAgICBpZiAodGhpcy5zZXJ2aWNlVHlwZSkge1xuICAgICAgbG9hZGluZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VUeXBlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0PGFueT4obG9hZGluZ1NlcnZpY2UpO1xuICAgICAgaWYgKFV0aWwuaXNEYXRhU2VydmljZSh0aGlzLmRhdGFTZXJ2aWNlKSkge1xuICAgICAgICBjb25zdCBzZXJ2aWNlQ2ZnID0gdGhpcy5kYXRhU2VydmljZS5nZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24odGhpcy5zZXJ2aWNlKTtcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5KSB7XG4gICAgICAgICAgc2VydmljZUNmZy5lbnRpdHkgPSB0aGlzLmVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNvbmZpZ3VyZVNlcnZpY2Uoc2VydmljZUNmZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICBnZXREYXRhQXJyYXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YUFycmF5O1xuICB9XG5cbiAgc2V0RGF0YUFycmF5KGRhdGE6IGFueSk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gZGF0YTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gW2RhdGFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCBoYXMgcmVjZWl2ZWQgbm90IHN1cHBvcnRlZCBzZXJ2aWNlIGRhdGEuIFN1cHBvcnRlZCBkYXRhIGFyZSBBcnJheSBvciBPYmplY3QnKTtcbiAgICAgIHRoaXMuZGF0YUFycmF5ID0gW107XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldEZvcm1Db21wb25lbnQoZm9ybTogT0Zvcm1Db21wb25lbnQpOiB2b2lkIHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuZm9ybSkpIHtcbiAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVlcnlPbkJpbmQpIHtcbiAgICAgIHRoaXMub25Gb3JtRGF0YVN1YnNjcmliZSA9IHRoaXMuZm9ybS5vbkRhdGFMb2FkZWQuc3Vic2NyaWJlKCgpID0+IHRoaXMucGFnZWFibGUgPyB0aGlzLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKSA6IHRoaXMucmVsb2FkRGF0YSgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0UGFyZW50S2V5c0Zyb21Db250ZXh0KHBhcmVudEtleXM6IG9iamVjdCwgY29udGV4dDogYW55KSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGlmIChjb250ZXh0IGluc3RhbmNlb2YgT0V4cGFuZGFibGVDb250YWluZXJDb21wb25lbnQpIHtcbiAgICAgIHJlc3VsdCA9IFNlcnZpY2VVdGlscy5nZXRQYXJlbnRLZXlzRnJvbUV4cGFuZGFibGVDb250YWluZXIocGFyZW50S2V5cywgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IFNlcnZpY2VVdGlscy5nZXRQYXJlbnRLZXlzRnJvbUZvcm0ocGFyZW50S2V5cywgY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG5cbiAgfVxuXG4gIHB1YmxpYyBxdWVyeURhdGEoZmlsdGVyPzogYW55LCBvdnJyQXJncz86IE9RdWVyeURhdGFBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgcXVlcnlNZXRob2ROYW1lID0gdGhpcy5wYWdlYWJsZSA/IHRoaXMucGFnaW5hdGVkUXVlcnlNZXRob2QgOiB0aGlzLnF1ZXJ5TWV0aG9kO1xuICAgIGlmICghdGhpcy5kYXRhU2VydmljZSB8fCAhKHF1ZXJ5TWV0aG9kTmFtZSBpbiB0aGlzLmRhdGFTZXJ2aWNlKSB8fCAhdGhpcy5lbnRpdHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZmlsdGVyUGFyZW50S2V5cyA9IHRoaXMuZ2V0UGFyZW50S2V5c1ZhbHVlcygpO1xuICAgIGlmICghU2VydmljZVV0aWxzLmZpbHRlckNvbnRhaW5zQWxsUGFyZW50S2V5cyhmaWx0ZXJQYXJlbnRLZXlzLCB0aGlzLl9wS2V5c0VxdWl2KSAmJiAhdGhpcy5xdWVyeVdpdGhOdWxsUGFyZW50S2V5cykge1xuICAgICAgdGhpcy5zZXREYXRhKFtdLCBbXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHF1ZXJ5QXJndW1lbnRzID0gdGhpcy5nZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXIsIG92cnJBcmdzKTtcbiAgICAgIGlmICh0aGlzLnF1ZXJ5U3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMucXVlcnlTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24gPSB0aGlzLmxvYWQoKTtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5xdWVyeUFyZ3VtZW50cyA9IHF1ZXJ5QXJndW1lbnRzO1xuICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbiA9IHRoaXMuZGF0YVNlcnZpY2VbcXVlcnlNZXRob2ROYW1lXVxuICAgICAgICAuYXBwbHkodGhpcy5kYXRhU2VydmljZSwgcXVlcnlBcmd1bWVudHMpXG4gICAgICAgIC5zdWJzY3JpYmUoKHJlczogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgICAgdGhpcy5zcWxUeXBlcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBpZiAoVXRpbC5pc0FycmF5KHJlcykpIHtcbiAgICAgICAgICAgIGRhdGEgPSByZXM7XG4gICAgICAgICAgICB0aGlzLnNxbFR5cGVzID0ge307XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXMuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyckRhdGEgPSAocmVzLmRhdGEgIT09IHVuZGVmaW5lZCkgPyByZXMuZGF0YSA6IFtdO1xuICAgICAgICAgICAgZGF0YSA9IFV0aWwuaXNBcnJheShhcnJEYXRhKSA/IGFyckRhdGEgOiBbXTtcbiAgICAgICAgICAgIHRoaXMuc3FsVHlwZXMgPSByZXMuc3FsVHlwZXM7XG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb25JbmZvKHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGYuc2V0RGF0YShkYXRhLCB0aGlzLnNxbFR5cGVzLCAob3ZyckFyZ3MgJiYgb3ZyckFyZ3MucmVwbGFjZSkpO1xuICAgICAgICAgIHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgc2VsZi5zZXREYXRhKFtdLCBbXSk7XG4gICAgICAgICAgc2VsZi5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoc2VsZi5xdWVyeUZhbGxiYWNrRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICBzZWxmLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbihlcnIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyICYmIHR5cGVvZiBlcnIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBzZWxmLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgZXJyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsICdNRVNTQUdFUy5FUlJPUl9RVUVSWScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbG9hZERhdGEoKTogdm9pZCB7XG4gICAgdGhpcy5xdWVyeURhdGEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWxvYWRzIHRoZSBjb21wb25lbnQgZGF0YSBhbmQgcmVzdGFydHMgdGhlIHBhZ2luYXRpb24uXG4gICAqL1xuICByZWxvYWRQYWdpbmF0ZWREYXRhRnJvbVN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgbG9hZCgpOiBhbnkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHpvbmUgPSB0aGlzLmluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIGNvbnN0IGxvYWRPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XG4gICAgICB9LCAyNTApO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHNlbGYubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH0pO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGxvYWRPYnNlcnZhYmxlLnN1YnNjcmliZSh2YWwgPT4ge1xuICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBzZWxmLmxvYWRpbmdTdWJqZWN0Lm5leHQodmFsIGFzIGJvb2xlYW4pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0aW5nIHRoZSBnaXZlbiByZWNvcmQga2V5c1xuICAgKiBAcGFyYW0gaXRlbSByZWNvcmQgb2JqZWN0XG4gICAqIEByZXR1cm5zIG9iamVjdCBjb250YWluaW5nIGl0ZW0gb2JqZWN0IHByb3BlcnRpZXMgY29udGFpbmVkIGluIGtleXNBcnJheVxuICAgKi9cbiAgZXh0cmFjdEtleXNGcm9tUmVjb3JkKGl0ZW06IGFueSk6IG9iamVjdCB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgaWYgKFV0aWwuaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHRoaXMua2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGl0ZW1ba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9RdWVyeSgpOiBBcnJheTxzdHJpbmc+IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmNvbEFycmF5O1xuICAgIHRoaXMua2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChyZXN1bHQuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBnZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXI6IG9iamVjdCwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncyk6IEFycmF5PGFueT4ge1xuICAgIGNvbnN0IGNvbXBGaWx0ZXIgPSB0aGlzLmdldENvbXBvbmVudEZpbHRlcihmaWx0ZXIpO1xuICAgIGNvbnN0IHF1ZXJ5Q29scyA9IHRoaXMuZ2V0QXR0cmlidXRlc1ZhbHVlc1RvUXVlcnkoKTtcbiAgICBjb25zdCBzcWxUeXBlcyA9IChvdnJyQXJncyAmJiBvdnJyQXJncy5oYXNPd25Qcm9wZXJ0eSgnc3FsdHlwZXMnKSkgPyBvdnJyQXJncy5zcWx0eXBlcyA6IHRoaXMuZm9ybSA/IHRoaXMuZm9ybS5nZXRBdHRyaWJ1dGVzU1FMVHlwZXMoKSA6IHt9O1xuXG4gICAgbGV0IHF1ZXJ5QXJndW1lbnRzID0gW2NvbXBGaWx0ZXIsIHF1ZXJ5Q29scywgdGhpcy5lbnRpdHksIHNxbFR5cGVzXTtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgY29uc3QgcXVlcnlPZmZzZXQgPSAob3ZyckFyZ3MgJiYgb3ZyckFyZ3MuaGFzT3duUHJvcGVydHkoJ29mZnNldCcpKSA/IG92cnJBcmdzLm9mZnNldCA6IHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQ7XG4gICAgICBjb25zdCBxdWVyeVJvd3NOID0gKG92cnJBcmdzICYmIG92cnJBcmdzLmhhc093blByb3BlcnR5KCdsZW5ndGgnKSkgPyBvdnJyQXJncy5sZW5ndGggOiB0aGlzLnF1ZXJ5Um93cztcbiAgICAgIHF1ZXJ5QXJndW1lbnRzID0gcXVlcnlBcmd1bWVudHMuY29uY2F0KFtxdWVyeU9mZnNldCwgcXVlcnlSb3dzTiwgdW5kZWZpbmVkXSk7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeUFyZ3VtZW50cztcbiAgfVxuXG4gIHVwZGF0ZVBhZ2luYXRpb25JbmZvKHF1ZXJ5UmVzOiBTZXJ2aWNlUmVzcG9uc2UpIHtcbiAgICBjb25zdCByZXN1bHRFbmRJbmRleCA9IHF1ZXJ5UmVzLnN0YXJ0UmVjb3JkSW5kZXggKyAocXVlcnlSZXMuZGF0YSA/IHF1ZXJ5UmVzLmRhdGEubGVuZ3RoIDogMCk7XG4gICAgaWYgKHF1ZXJ5UmVzLnN0YXJ0UmVjb3JkSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zdGF0ZS5xdWVyeVJlY29yZE9mZnNldCA9IHJlc3VsdEVuZEluZGV4O1xuICAgIH1cbiAgICBpZiAocXVlcnlSZXMudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciA9IHF1ZXJ5UmVzLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyO1xuICAgIH1cbiAgfVxuXG4gIGdldFRvdGFsUmVjb3Jkc051bWJlcigpOiBudW1iZXIge1xuICAgIHJldHVybiAodGhpcy5zdGF0ZSAmJiB0aGlzLnN0YXRlLnRvdGFsUXVlcnlSZWNvcmRzTnVtYmVyICE9PSB1bmRlZmluZWQpID8gdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlciA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldENvbnRleHRDb21wb25lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kYWJsZUNvbnRhaW5lciB8fCB0aGlzLmZvcm07XG4gIH1cblxuICBnZXRDb21wb25lbnRGaWx0ZXIoZXhpc3RpbmdGaWx0ZXI6IGFueSA9IHt9KTogYW55IHtcbiAgICBjb25zdCBmaWx0ZXJQYXJlbnRLZXlzID0gdGhpcy5nZXRQYXJlbnRLZXlzRnJvbUNvbnRleHQodGhpcy5fcEtleXNFcXVpdiwgdGhpcy5nZXRDb250ZXh0Q29tcG9uZW50KCkpO1xuICAgIGV4aXN0aW5nRmlsdGVyID0gT2JqZWN0LmFzc2lnbihleGlzdGluZ0ZpbHRlciB8fCB7fSwgZmlsdGVyUGFyZW50S2V5cyk7XG4gICAgcmV0dXJuIGV4aXN0aW5nRmlsdGVyO1xuICB9XG5cbiAgZ2V0U3FsVHlwZXMoKSB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMuc3FsVHlwZXMpID8gdGhpcy5zcWxUeXBlcyA6IHt9O1xuICB9XG5cbiAgZ2V0IHN0YXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9XG5cbiAgc2V0IHN0YXRlKGFyZzogYW55KSB7XG4gICAgdGhpcy5fc3RhdGUgPSBhcmc7XG4gIH1cblxuICBnZXRQYXJlbnRLZXlzVmFsdWVzKCkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHRDb21wb25lbnQoKTtcbiAgICByZXR1cm4gdGhpcy5nZXRQYXJlbnRLZXlzRnJvbUNvbnRleHQodGhpcy5fcEtleXNFcXVpdiwgY29udGV4dCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlU3RhdGVTdG9yYWdlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UgJiYgdGhpcy5zdG9yZVN0YXRlICYmICF0aGlzLmFscmVhZHlTdG9yZWQpIHtcbiAgICAgIHRoaXMuYWxyZWFkeVN0b3JlZCA9IHRydWU7XG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UudXBkYXRlQ29tcG9uZW50U3RvcmFnZSh0aGlzLCB0aGlzLmdldFJvdXRlS2V5KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzZXREYXRhKGRhdGE6IGFueSwgc3FsVHlwZXM/OiBhbnksIHJlcGxhY2U/OiBib29sZWFuKTogdm9pZCB7XG4gICAgLy9cbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICAvLyBHZXQgcHJldmlvdXMgc3RhdHVzXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXRDb21wb25lbnRTdG9yYWdlKHRoaXMsIHRoaXMuZ2V0Um91dGVLZXkoKSk7XG4gIH1cbn1cbiJdfQ==