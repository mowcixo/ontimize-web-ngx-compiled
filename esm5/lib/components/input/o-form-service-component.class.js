import * as tslib_1 from "tslib";
import { EventEmitter, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InputConverter } from '../../decorators/input-converter';
import { DialogService } from '../../services/dialog.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../o-form-data-component.class';
export var DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, [
    'staticData: static-data',
    'entity',
    'service',
    'columns',
    'valueColumn: value-column',
    'valueColumnType: value-column-type',
    'parentKeys: parent-keys',
    'visibleColumns: visible-columns',
    'descriptionColumns: description-columns',
    'separator',
    'queryOnInit: query-on-init',
    'queryOnBind: query-on-bind',
    'queryOnEvent: query-on-event',
    'queryMethod: query-method',
    'serviceType: service-type',
    'queryWithNullParentKeys: query-with-null-parent-keys',
    'setValueOnValueChange: set-value-on-value-change',
    'queryFallbackFunction: query-fallback-function'
]);
export var DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, [
    'onSetValueOnValueChange',
    'onDataLoaded'
]);
var OFormServiceComponent = (function (_super) {
    tslib_1.__extends(OFormServiceComponent, _super);
    function OFormServiceComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.valueColumnType = Codes.TYPE_INT;
        _this.separator = Codes.SPACE_SEPARATOR;
        _this.queryOnInit = true;
        _this.queryOnBind = false;
        _this.queryMethod = Codes.QUERY_METHOD;
        _this.queryWithNullParentKeys = false;
        _this.onSetValueOnValueChange = new EventEmitter();
        _this.onDataLoaded = new EventEmitter();
        _this.dataArray = [];
        _this.colArray = [];
        _this.visibleColArray = [];
        _this.descriptionColArray = [];
        _this.loading = false;
        _this.cacheQueried = false;
        _this._pKeysEquiv = {};
        _this._setValueOnValueChangeEquiv = {};
        _this.delayLoad = 250;
        _this.loadingSubject = new BehaviorSubject(false);
        _this.form = form;
        _this.elRef = elRef;
        _this.dialogService = injector.get(DialogService);
        return _this;
    }
    OFormServiceComponent.prototype.initialize = function () {
        var _this = this;
        _super.prototype.initialize.call(this);
        this.cacheQueried = false;
        this.colArray = Util.parseArray(this.columns, true);
        this.visibleColArray = Util.parseArray(this.visibleColumns, true);
        if (Util.isArrayEmpty(this.visibleColArray)) {
            this.visibleColumns = this.columns;
            this.visibleColArray = this.colArray;
        }
        this.descriptionColArray = Util.parseArray(this.descriptionColumns);
        if (Util.isArrayEmpty(this.descriptionColArray)) {
            this.descriptionColArray = this.visibleColArray;
        }
        var pkArray = Util.parseArray(this.parentKeys);
        this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
        var setValueSetArray = Util.parseArray(this.setValueOnValueChange);
        this._setValueOnValueChangeEquiv = Util.parseParentKeysEquivalences(setValueSetArray);
        if (this.form && this.queryOnBind) {
            var self_1 = this;
            this._formDataSubcribe = this.form.onDataLoaded.subscribe(function () { return self_1.queryData(); });
        }
        if (this.staticData) {
            this.queryOnBind = false;
            this.queryOnInit = false;
            this.setDataArray(this.staticData);
        }
        else {
            this.configureService();
        }
        if (this.queryOnEvent !== undefined && this.queryOnEvent.subscribe !== undefined) {
            var self_2 = this;
            this.queryOnEventSubscription = this.queryOnEvent.subscribe(function (value) {
                if (Util.isDefined(value) || _this.queryWithNullParentKeys) {
                    self_2.queryData();
                }
            });
        }
        if (typeof this.queryFallbackFunction !== 'function') {
            this.queryFallbackFunction = undefined;
        }
    };
    OFormServiceComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this._formDataSubcribe) {
            this._formDataSubcribe.unsubscribe();
        }
        if (this.queryOnEventSubscription) {
            this.queryOnEventSubscription.unsubscribe();
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    };
    OFormServiceComponent.prototype.emitOnValueChange = function (type, newValue, oldValue) {
        var _this = this;
        _super.prototype.emitOnValueChange.call(this, type, newValue, oldValue);
        var record = this.getSelectedRecord();
        this.onSetValueOnValueChange.emit(record);
        var setValueSetKeys = Object.keys(this._setValueOnValueChangeEquiv);
        if (setValueSetKeys.length) {
            var formComponents_1 = this.form.getComponents();
            if (Util.isDefined(record)) {
                setValueSetKeys.forEach(function (key) {
                    var comp = formComponents_1[_this._setValueOnValueChangeEquiv[key]];
                    if (Util.isDefined(comp)) {
                        comp.setValue(record[key]);
                    }
                });
            }
        }
    };
    OFormServiceComponent.prototype.configureService = function () {
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
    OFormServiceComponent.prototype.getAttributesValuesToQuery = function (columns) {
        var result = Util.isDefined(columns) ? columns : this.colArray;
        if (result.indexOf(this.valueColumn) === -1) {
            result.push(this.valueColumn);
        }
        return result;
    };
    OFormServiceComponent.prototype.queryData = function (filter) {
        var _this = this;
        if (!this.dataService || !(this.queryMethod in this.dataService) || !this.entity) {
            console.warn('Service not properly configured! aborting query');
            return;
        }
        filter = Object.assign(filter || {}, ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form));
        if (!ServiceUtils.filterContainsAllParentKeys(filter, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
            this.setDataArray([]);
        }
        else {
            if (this.querySuscription) {
                this.querySuscription.unsubscribe();
            }
            if (this.loaderSubscription) {
                this.loaderSubscription.unsubscribe();
            }
            var queryCols = this.getAttributesValuesToQuery();
            this.loaderSubscription = this.load();
            this.querySuscription = this.dataService[this.queryMethod](filter, queryCols, this.entity)
                .subscribe(function (resp) {
                if (resp.isSuccessful()) {
                    _this.cacheQueried = true;
                    _this.setDataArray(resp.data);
                }
                _this.loadingSubject.next(false);
                _this.loaderSubscription.unsubscribe();
            }, function (err) {
                console.error(err);
                _this.loadingSubject.next(false);
                _this.loaderSubscription.unsubscribe();
                if (Util.isDefined(_this.queryFallbackFunction)) {
                    _this.queryFallbackFunction(err);
                }
                else if (err && !Util.isObject(err)) {
                    _this.dialogService.alert('ERROR', err);
                }
                else {
                    _this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
                }
            });
        }
    };
    OFormServiceComponent.prototype.getDataArray = function () {
        return this.dataArray;
    };
    OFormServiceComponent.prototype.setDataArray = function (data) {
        if (Util.isArray(data)) {
            this.dataArray = data;
            this.syncDataIndex(false);
        }
        else if (Util.isObject(data) && Object.keys(data).length > 0) {
            this.dataArray = [data];
        }
        else {
            console.warn('Component has received not supported service data. Supported data are Array or not empty Object');
            this.dataArray = [];
        }
        this.onDataLoaded.emit(this.dataArray);
    };
    OFormServiceComponent.prototype.syncDataIndex = function (queryIfNotFound) {
        var _this = this;
        if (queryIfNotFound === void 0) { queryIfNotFound = true; }
        this._currentIndex = undefined;
        if (this.value && this.value.value && this.dataArray) {
            var self_3 = this;
            this.dataArray.forEach(function (item, index) {
                if (_this.value.value instanceof Array) {
                    _this._currentIndex = [];
                    _this.value.value.forEach(function (itemValue, indexValue) {
                        if (item[self_3.valueColumn] === itemValue) {
                            _this._currentIndex[_this._currentIndex.length] = indexValue;
                        }
                    });
                }
                else if (item[self_3.valueColumn] === _this.value.value) {
                    self_3._currentIndex = index;
                }
                if (item[self_3.valueColumn] === _this.value.value) {
                    self_3._currentIndex = index;
                }
            });
            if (this._currentIndex === undefined && queryIfNotFound) {
                if (this.queryOnBind && this.dataArray && this.dataArray.length === 0
                    && !this.cacheQueried && !this.isEmpty()) {
                    this.queryData();
                }
                return;
            }
        }
    };
    OFormServiceComponent.prototype.parseByValueColumnType = function (val) {
        var value = val;
        if (this.valueColumnType === Codes.TYPE_INT) {
            var parsed = parseInt(value, 10);
            if (!isNaN(parsed)) {
                value = parsed;
            }
        }
        return value;
    };
    OFormServiceComponent.prototype.setValue = function (val, options) {
        var value = this.parseByValueColumnType(val);
        _super.prototype.setValue.call(this, value, options);
    };
    OFormServiceComponent.prototype.setData = function (val) {
        var value = this.parseByValueColumnType(val);
        _super.prototype.setData.call(this, value);
    };
    OFormServiceComponent.prototype.getSelectedRecord = function () {
        var _this = this;
        var result;
        var selectedValue = this.getValue();
        if (Util.isDefined(selectedValue)) {
            result = this.getDataArray().find(function (item) { return item[_this.valueColumn] === selectedValue; });
        }
        return result;
    };
    OFormServiceComponent.prototype.load = function () {
        var self = this;
        var zone = this.injector.get(NgZone);
        var loadObservable = new Observable(function (observer) {
            var timer = window.setTimeout(function () {
                observer.next(true);
            }, self.delayLoad);
            return function () {
                window.clearTimeout(timer);
                zone.run(function () {
                    observer.next(false);
                    self.loading = false;
                });
            };
        });
        var subscription = loadObservable.subscribe(function (val) {
            zone.run(function () {
                self.loading = val;
                self.loadingSubject.next(val);
            });
        });
        return subscription;
    };
    OFormServiceComponent.prototype.onFormControlChange = function (value) {
        if (this.oldValue === value) {
            return;
        }
        _super.prototype.onFormControlChange.call(this, value);
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormServiceComponent.prototype, "queryOnInit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormServiceComponent.prototype, "queryOnBind", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormServiceComponent.prototype, "queryWithNullParentKeys", void 0);
    return OFormServiceComponent;
}(OFormDataComponent));
export { OFormServiceComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L28tZm9ybS1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFjLFlBQVksRUFBWSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRWpFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUVsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBRTNFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMscUNBQXFDLEVBQ3JDLGtCQUFrQixHQUNuQixNQUFNLGdDQUFnQyxDQUFDO0FBRXhDLE1BQU0sQ0FBQyxJQUFNLHVDQUF1QyxvQkFDL0Msb0NBQW9DO0lBRXZDLHlCQUF5QjtJQUN6QixRQUFRO0lBQ1IsU0FBUztJQUNULFNBQVM7SUFDVCwyQkFBMkI7SUFDM0Isb0NBQW9DO0lBQ3BDLHlCQUF5QjtJQUV6QixpQ0FBaUM7SUFFakMseUNBQXlDO0lBRXpDLFdBQVc7SUFFWCw0QkFBNEI7SUFDNUIsNEJBQTRCO0lBQzVCLDhCQUE4QjtJQUc5QiwyQkFBMkI7SUFFM0IsMkJBQTJCO0lBRzNCLHNEQUFzRDtJQUd0RCxrREFBa0Q7SUFHbEQsZ0RBQWdEO0VBUWpELENBQUM7QUFFRixN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LENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDO1FBRUosQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNQLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBYyxDQUFDO2dCQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFjLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELG1EQUFtQixHQUFuQixVQUFvQixLQUFVO1FBQzVCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBQ0QsaUJBQU0sbUJBQW1CLFlBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQW5VRDtRQURDLGNBQWMsRUFBRTs7OERBQ3FCO0lBRXRDO1FBREMsY0FBYyxFQUFFOzs4REFDc0I7SUFLdkM7UUFEQyxjQUFjLEVBQUU7OzBFQUN3QjtJQThUM0MsNEJBQUM7Q0FBQSxBQW5WRCxDQUEyQyxrQkFBa0IsR0FtVjVEO1NBblZZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE5nWm9uZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICBERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICBPRm9ybURhdGFDb21wb25lbnQsXG59IGZyb20gJy4uL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgLy8gc3RhdGljLWRhdGEgW0FycmF5PGFueT5dIDogd2F5IHRvIHBvcHVsYXRlIHdpdGggc3RhdGljIGRhdGEuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc3RhdGljRGF0YTogc3RhdGljLWRhdGEnLFxuICAnZW50aXR5JyxcbiAgJ3NlcnZpY2UnLFxuICAnY29sdW1ucycsXG4gICd2YWx1ZUNvbHVtbjogdmFsdWUtY29sdW1uJyxcbiAgJ3ZhbHVlQ29sdW1uVHlwZTogdmFsdWUtY29sdW1uLXR5cGUnLFxuICAncGFyZW50S2V5czogcGFyZW50LWtleXMnLFxuICAvLyBWaXNpYmxlIGNvbHVtbnMgaW50byBzZWxlY3Rpb24gZGlhbG9nIGZyb20gcGFyYW1ldGVyICdjb2x1bW5zJy4gV2l0aCBlbXB0eSBwYXJhbWV0ZXIgYWxsIGNvbHVtbnMgYXJlIHZpc2libGUuXG4gICd2aXNpYmxlQ29sdW1uczogdmlzaWJsZS1jb2x1bW5zJyxcbiAgLy8gVmlzaWJsZSBjb2x1bW5zIGluIHRleHQgZmllbGQuIEJ5IGRlZmF1bHQsIGl0IGlzIHRoZSBwYXJhbWV0ZXIgdmFsdWUgb2YgdmlzaWJsZSBjb2x1bW5zLlxuICAnZGVzY3JpcHRpb25Db2x1bW5zOiBkZXNjcmlwdGlvbi1jb2x1bW5zJyxcblxuICAnc2VwYXJhdG9yJyxcblxuICAncXVlcnlPbkluaXQ6IHF1ZXJ5LW9uLWluaXQnLFxuICAncXVlcnlPbkJpbmQ6IHF1ZXJ5LW9uLWJpbmQnLFxuICAncXVlcnlPbkV2ZW50OiBxdWVyeS1vbi1ldmVudCcsXG5cbiAgLy8gcXVlcnktbWV0aG9kIFtzdHJpbmddOiBuYW1lIG9mIHRoZSBzZXJ2aWNlIG1ldGhvZCB0byBwZXJmb3JtIHF1ZXJpZXMuIERlZmF1bHQ6IHF1ZXJ5LlxuICAncXVlcnlNZXRob2Q6IHF1ZXJ5LW1ldGhvZCcsXG5cbiAgJ3NlcnZpY2VUeXBlOiBzZXJ2aWNlLXR5cGUnLFxuXG4gIC8vIHF1ZXJ5LXdpdGgtbnVsbC1wYXJlbnQta2V5cyBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0byB0cmlnZ2VyIHF1ZXJ5IG1ldGhvZCB3aGVuIHBhcmVudC1rZXlzIGZpbHRlciBpcyBudWxsLiBEZWZhdWx0OiBmYWxzZVxuICAncXVlcnlXaXRoTnVsbFBhcmVudEtleXM6IHF1ZXJ5LXdpdGgtbnVsbC1wYXJlbnQta2V5cycsXG5cbiAgLy8gc2V0LXZhbHVlLW9uLXZhbHVlLWNoYW5nZSBbc3RyaW5nXTogRm9ybSBjb21wb25lbnQgYXR0cmlidXRlcyB3aG9zZSB2YWx1ZSB3aWxsIGJlIHNldCB3aGVuIHRoZSB2YWx1ZSBvZiB0aGUgY3VycmVudCBjb21wb25lbnQgY2hhbmdlcyBkdWUgdG8gdXNlciBpbnRlcmFjdGlvbi4gU2VwYXJhdGVkIGJ5ICc7Jy4gQWNjZXB0ZWQgZm9ybWF0OiBhdHRyIHwgY29sdW1uTmFtZTphdHRyXG4gICdzZXRWYWx1ZU9uVmFsdWVDaGFuZ2U6IHNldC12YWx1ZS1vbi12YWx1ZS1jaGFuZ2UnLFxuXG4gIC8vIFtmdW5jdGlvbl06IGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gcXVlcnkgZXJyb3IuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVlcnlGYWxsYmFja0Z1bmN0aW9uOiBxdWVyeS1mYWxsYmFjay1mdW5jdGlvbidcbiAgLy8gLFxuXG4gIC8vICdpbnNlcnRGYWxsYmFja0Z1bmN0aW9uOiBpbnNlcnQtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICd1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiB1cGRhdGUtZmFsbGJhY2stZnVuY3Rpb24nLFxuXG4gIC8vICdkZWxldGVGYWxsYmFja0Z1bmN0aW9uOiBkZWxldGUtZmFsbGJhY2stZnVuY3Rpb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgJ29uU2V0VmFsdWVPblZhbHVlQ2hhbmdlJyxcbiAgJ29uRGF0YUxvYWRlZCdcbl07XG5cbmV4cG9ydCBjbGFzcyBPRm9ybVNlcnZpY2VDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQge1xuXG4gIC8qIElucHV0cyAqL1xuICBwcm90ZWN0ZWQgc3RhdGljRGF0YTogQXJyYXk8YW55PjtcbiAgcHJvdGVjdGVkIGVudGl0eTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgc2VydmljZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgY29sdW1uczogc3RyaW5nO1xuICBwcm90ZWN0ZWQgdmFsdWVDb2x1bW46IHN0cmluZztcbiAgcHJvdGVjdGVkIHZhbHVlQ29sdW1uVHlwZTogc3RyaW5nID0gQ29kZXMuVFlQRV9JTlQ7XG4gIHByb3RlY3RlZCBwYXJlbnRLZXlzOiBzdHJpbmc7XG4gIHByb3RlY3RlZCB2aXNpYmxlQ29sdW1uczogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGVzY3JpcHRpb25Db2x1bW5zOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBzZXBhcmF0b3I6IHN0cmluZyA9IENvZGVzLlNQQUNFX1NFUEFSQVRPUjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHF1ZXJ5T25Jbml0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHF1ZXJ5T25CaW5kOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBxdWVyeU9uRXZlbnQ6IGFueTtcbiAgcHJvdGVjdGVkIHF1ZXJ5TWV0aG9kOiBzdHJpbmcgPSBDb2Rlcy5RVUVSWV9NRVRIT0Q7XG4gIHByb3RlY3RlZCBzZXJ2aWNlVHlwZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBxdWVyeVdpdGhOdWxsUGFyZW50S2V5czogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgc2V0VmFsdWVPblZhbHVlQ2hhbmdlOiBzdHJpbmc7XG4gIHB1YmxpYyBxdWVyeUZhbGxiYWNrRnVuY3Rpb246IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAvLyBwdWJsaWMgaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbjogRnVuY3Rpb247XG4gIC8vIHB1YmxpYyB1cGRhdGVGYWxsYmFja0Z1bmN0aW9uOiBGdW5jdGlvbjtcbiAgLy8gcHVibGljIGRlbGV0ZUZhbGxiYWNrRnVuY3Rpb246IEZ1bmN0aW9uO1xuXG4gIC8qIE91dHB1dHMgKi9cbiAgcHVibGljIG9uU2V0VmFsdWVPblZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIC8qIEludGVybmFsIHZhcmlhYmxlcyAqL1xuICBwcm90ZWN0ZWQgZGF0YUFycmF5OiBhbnlbXSA9IFtdO1xuICBwcm90ZWN0ZWQgY29sQXJyYXk6IHN0cmluZ1tdID0gW107XG4gIHByb3RlY3RlZCB2aXNpYmxlQ29sQXJyYXk6IHN0cmluZ1tdID0gW107XG4gIHByb3RlY3RlZCBkZXNjcmlwdGlvbkNvbEFycmF5OiBzdHJpbmdbXSA9IFtdO1xuICBwcm90ZWN0ZWQgZGF0YVNlcnZpY2U6IE9udGltaXplU2VydmljZTtcbiAgcHVibGljIGxvYWRlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBsb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5U3VzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGNhY2hlUXVlcmllZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3BLZXlzRXF1aXYgPSB7fTtcbiAgcHJvdGVjdGVkIF9zZXRWYWx1ZU9uVmFsdWVDaGFuZ2VFcXVpdiA9IHt9O1xuICBwcm90ZWN0ZWQgX2Zvcm1EYXRhU3ViY3JpYmU7XG4gIHByb3RlY3RlZCBfY3VycmVudEluZGV4O1xuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcblxuICBwcm90ZWN0ZWQgcXVlcnlPbkV2ZW50U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHB1YmxpYyBkZWxheUxvYWQgPSAyNTA7XG4gIHB1YmxpYyBsb2FkaW5nU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgdGhpcy5lbFJlZiA9IGVsUmVmO1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IGluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5jYWNoZVF1ZXJpZWQgPSBmYWxzZTtcbiAgICB0aGlzLmNvbEFycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMuY29sdW1ucywgdHJ1ZSk7XG5cbiAgICB0aGlzLnZpc2libGVDb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnZpc2libGVDb2x1bW5zLCB0cnVlKTtcbiAgICBpZiAoVXRpbC5pc0FycmF5RW1wdHkodGhpcy52aXNpYmxlQ29sQXJyYXkpKSB7XG4gICAgICAvLyBJdCBpcyBuZWNlc3NhcnkgdG8gYXNzaW5nIHZhbHVlIHRvIHZpc2libGVDb2x1bW5zIHRvIHByb3BhZ2F0ZSB0aGUgcGFyYW1ldGVyLlxuICAgICAgdGhpcy52aXNpYmxlQ29sdW1ucyA9IHRoaXMuY29sdW1ucztcbiAgICAgIHRoaXMudmlzaWJsZUNvbEFycmF5ID0gdGhpcy5jb2xBcnJheTtcbiAgICB9XG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5kZXNjcmlwdGlvbkNvbHVtbnMpO1xuICAgIGlmIChVdGlsLmlzQXJyYXlFbXB0eSh0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkpKSB7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkgPSB0aGlzLnZpc2libGVDb2xBcnJheTtcbiAgICB9XG5cbiAgICBjb25zdCBwa0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMucGFyZW50S2V5cyk7XG4gICAgdGhpcy5fcEtleXNFcXVpdiA9IFV0aWwucGFyc2VQYXJlbnRLZXlzRXF1aXZhbGVuY2VzKHBrQXJyYXkpO1xuXG4gICAgY29uc3Qgc2V0VmFsdWVTZXRBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnNldFZhbHVlT25WYWx1ZUNoYW5nZSk7XG4gICAgdGhpcy5fc2V0VmFsdWVPblZhbHVlQ2hhbmdlRXF1aXYgPSBVdGlsLnBhcnNlUGFyZW50S2V5c0VxdWl2YWxlbmNlcyhzZXRWYWx1ZVNldEFycmF5KTtcblxuICAgIGlmICh0aGlzLmZvcm0gJiYgdGhpcy5xdWVyeU9uQmluZCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLl9mb3JtRGF0YVN1YmNyaWJlID0gdGhpcy5mb3JtLm9uRGF0YUxvYWRlZC5zdWJzY3JpYmUoKCkgPT4gc2VsZi5xdWVyeURhdGEoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSkge1xuICAgICAgdGhpcy5xdWVyeU9uQmluZCA9IGZhbHNlO1xuICAgICAgdGhpcy5xdWVyeU9uSW5pdCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZXREYXRhQXJyYXkodGhpcy5zdGF0aWNEYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVlcnlPbkV2ZW50ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5xdWVyeU9uRXZlbnQuc3Vic2NyaWJlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5xdWVyeU9uRXZlbnRTdWJzY3JpcHRpb24gPSB0aGlzLnF1ZXJ5T25FdmVudC5zdWJzY3JpYmUoKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgfHwgdGhpcy5xdWVyeVdpdGhOdWxsUGFyZW50S2V5cykge1xuICAgICAgICAgIHNlbGYucXVlcnlEYXRhKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMucXVlcnlGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMuaW5zZXJ0RmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy5pbnNlcnRGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMudXBkYXRlRmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy51cGRhdGVGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgICAvLyBpZiAodHlwZW9mIHRoaXMuZGVsZXRlRmFsbGJhY2tGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vICAgdGhpcy5kZWxldGVGYWxsYmFja0Z1bmN0aW9uID0gdW5kZWZpbmVkO1xuICAgIC8vIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLl9mb3JtRGF0YVN1YmNyaWJlKSB7XG4gICAgICB0aGlzLl9mb3JtRGF0YVN1YmNyaWJlLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnF1ZXJ5T25FdmVudFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeU9uRXZlbnRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBlbWl0T25WYWx1ZUNoYW5nZSh0eXBlLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICBzdXBlci5lbWl0T25WYWx1ZUNoYW5nZSh0eXBlLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgIC8vIFNldCB2YWx1ZSBmb3IgJ3NldC12YWx1ZS1vbi12YWx1ZS1jaGFuZ2UnIGNvbXBvbmVudHNcbiAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldFNlbGVjdGVkUmVjb3JkKCk7XG4gICAgdGhpcy5vblNldFZhbHVlT25WYWx1ZUNoYW5nZS5lbWl0KHJlY29yZCk7XG4gICAgY29uc3Qgc2V0VmFsdWVTZXRLZXlzID0gT2JqZWN0LmtleXModGhpcy5fc2V0VmFsdWVPblZhbHVlQ2hhbmdlRXF1aXYpO1xuICAgIGlmIChzZXRWYWx1ZVNldEtleXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBmb3JtQ29tcG9uZW50cyA9IHRoaXMuZm9ybS5nZXRDb21wb25lbnRzKCk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQocmVjb3JkKSkge1xuICAgICAgICBzZXRWYWx1ZVNldEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbXAgPSBmb3JtQ29tcG9uZW50c1t0aGlzLl9zZXRWYWx1ZU9uVmFsdWVDaGFuZ2VFcXVpdltrZXldXTtcbiAgICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29tcCkpIHtcbiAgICAgICAgICAgIGNvbXAuc2V0VmFsdWUocmVjb3JkW2tleV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyogVXRpbGl0eSBtZXRob2RzICovXG4gIGNvbmZpZ3VyZVNlcnZpY2UoKSB7XG4gICAgbGV0IGxvYWRpbmdTZXJ2aWNlOiBhbnkgPSBPbnRpbWl6ZVNlcnZpY2U7XG4gICAgaWYgKHRoaXMuc2VydmljZVR5cGUpIHtcbiAgICAgIGxvYWRpbmdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlVHlwZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZGF0YVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldDxhbnk+KGxvYWRpbmdTZXJ2aWNlKTtcblxuICAgICAgaWYgKFV0aWwuaXNEYXRhU2VydmljZSh0aGlzLmRhdGFTZXJ2aWNlKSkge1xuICAgICAgICBjb25zdCBzZXJ2aWNlQ2ZnID0gdGhpcy5kYXRhU2VydmljZS5nZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24odGhpcy5zZXJ2aWNlKTtcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5KSB7XG4gICAgICAgICAgc2VydmljZUNmZy5lbnRpdHkgPSB0aGlzLmVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNvbmZpZ3VyZVNlcnZpY2Uoc2VydmljZUNmZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9RdWVyeShjb2x1bW5zPzogQXJyYXk8YW55Pikge1xuICAgIGNvbnN0IHJlc3VsdCA9IFV0aWwuaXNEZWZpbmVkKGNvbHVtbnMpID8gY29sdW1ucyA6IHRoaXMuY29sQXJyYXk7XG4gICAgaWYgKHJlc3VsdC5pbmRleE9mKHRoaXMudmFsdWVDb2x1bW4pID09PSAtMSkge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy52YWx1ZUNvbHVtbik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBxdWVyeURhdGEoZmlsdGVyPzogYW55KSB7XG4gICAgaWYgKCF0aGlzLmRhdGFTZXJ2aWNlIHx8ICEodGhpcy5xdWVyeU1ldGhvZCBpbiB0aGlzLmRhdGFTZXJ2aWNlKSB8fCAhdGhpcy5lbnRpdHkpIHtcbiAgICAgIGNvbnNvbGUud2FybignU2VydmljZSBub3QgcHJvcGVybHkgY29uZmlndXJlZCEgYWJvcnRpbmcgcXVlcnknKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlsdGVyID0gT2JqZWN0LmFzc2lnbihmaWx0ZXIgfHwge30sIFNlcnZpY2VVdGlscy5nZXRQYXJlbnRLZXlzRnJvbUZvcm0odGhpcy5fcEtleXNFcXVpdiwgdGhpcy5mb3JtKSk7XG4gICAgaWYgKCFTZXJ2aWNlVXRpbHMuZmlsdGVyQ29udGFpbnNBbGxQYXJlbnRLZXlzKGZpbHRlciwgdGhpcy5fcEtleXNFcXVpdikgJiYgIXRoaXMucXVlcnlXaXRoTnVsbFBhcmVudEtleXMpIHtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KFtdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMucXVlcnlTdXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnF1ZXJ5U3VzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxvYWRlclN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBxdWVyeUNvbHMgPSB0aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb1F1ZXJ5KCk7XG5cbiAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uID0gdGhpcy5sb2FkKCk7XG4gICAgICB0aGlzLnF1ZXJ5U3VzY3JpcHRpb24gPSB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMucXVlcnlNZXRob2RdKGZpbHRlciwgcXVlcnlDb2xzLCB0aGlzLmVudGl0eSlcbiAgICAgICAgLnN1YnNjcmliZSgocmVzcDogU2VydmljZVJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3AuaXNTdWNjZXNzZnVsKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGVRdWVyaWVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YUFycmF5KHJlc3AuZGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5sb2FkaW5nID0gZmFsc2U7IHNlbGYubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7IHNlbGYubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7IH0sIDEwMDAwKTtcbiAgICAgICAgICB0aGlzLmxvYWRpbmdTdWJqZWN0Lm5leHQoZmFsc2UpO1xuICAgICAgICAgIHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgIHRoaXMubG9hZGluZ1N1YmplY3QubmV4dChmYWxzZSk7XG4gICAgICAgICAgdGhpcy5sb2FkZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWVyeUZhbGxiYWNrRnVuY3Rpb24pKSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXJ5RmFsbGJhY2tGdW5jdGlvbihlcnIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyICYmICFVdGlsLmlzT2JqZWN0KGVycikpIHtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCBlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuYWxlcnQoJ0VSUk9SJywgJ01FU1NBR0VTLkVSUk9SX1FVRVJZJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXREYXRhQXJyYXkoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmRhdGFBcnJheTtcbiAgfVxuXG4gIHNldERhdGFBcnJheShkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0FycmF5KGRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IGRhdGE7XG4gICAgICB0aGlzLnN5bmNEYXRhSW5kZXgoZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChkYXRhKSAmJiBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRhdGFBcnJheSA9IFtkYXRhXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgaGFzIHJlY2VpdmVkIG5vdCBzdXBwb3J0ZWQgc2VydmljZSBkYXRhLiBTdXBwb3J0ZWQgZGF0YSBhcmUgQXJyYXkgb3Igbm90IGVtcHR5IE9iamVjdCcpO1xuICAgICAgdGhpcy5kYXRhQXJyYXkgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5vbkRhdGFMb2FkZWQuZW1pdCh0aGlzLmRhdGFBcnJheSk7XG4gIH1cblxuICBzeW5jRGF0YUluZGV4KHF1ZXJ5SWZOb3RGb3VuZDogYm9vbGVhbiA9IHRydWUpIHtcbiAgICB0aGlzLl9jdXJyZW50SW5kZXggPSB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMudmFsdWUgJiYgdGhpcy52YWx1ZS52YWx1ZSAmJiB0aGlzLmRhdGFBcnJheSkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmRhdGFBcnJheS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gW107XG4gICAgICAgICAgdGhpcy52YWx1ZS52YWx1ZS5mb3JFYWNoKChpdGVtVmFsdWUsIGluZGV4VmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmIChpdGVtW3NlbGYudmFsdWVDb2x1bW5dID09PSBpdGVtVmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy5fY3VycmVudEluZGV4W3RoaXMuX2N1cnJlbnRJbmRleC5sZW5ndGhdID0gaW5kZXhWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChpdGVtW3NlbGYudmFsdWVDb2x1bW5dID09PSB0aGlzLnZhbHVlLnZhbHVlKSB7XG4gICAgICAgICAgc2VsZi5fY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW1bc2VsZi52YWx1ZUNvbHVtbl0gPT09IHRoaXMudmFsdWUudmFsdWUpIHtcbiAgICAgICAgICBzZWxmLl9jdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLl9jdXJyZW50SW5kZXggPT09IHVuZGVmaW5lZCAmJiBxdWVyeUlmTm90Rm91bmQpIHtcbiAgICAgICAgaWYgKHRoaXMucXVlcnlPbkJpbmQgJiYgdGhpcy5kYXRhQXJyYXkgJiYgdGhpcy5kYXRhQXJyYXkubGVuZ3RoID09PSAwXG4gICAgICAgICAgJiYgIXRoaXMuY2FjaGVRdWVyaWVkICYmICF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZUJ5VmFsdWVDb2x1bW5UeXBlKHZhbDogYW55KSB7XG4gICAgbGV0IHZhbHVlID0gdmFsO1xuXG4gICAgaWYgKHRoaXMudmFsdWVDb2x1bW5UeXBlID09PSBDb2Rlcy5UWVBFX0lOVCkge1xuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgIGlmICghaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICB2YWx1ZSA9IHBhcnNlZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlQnlWYWx1ZUNvbHVtblR5cGUodmFsKTtcbiAgICBzdXBlci5zZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICBzZXREYXRhKHZhbDogYW55KSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlQnlWYWx1ZUNvbHVtblR5cGUodmFsKTtcbiAgICBzdXBlci5zZXREYXRhKHZhbHVlKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkUmVjb3JkKCkge1xuICAgIGxldCByZXN1bHQ7XG4gICAgY29uc3Qgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoc2VsZWN0ZWRWYWx1ZSkpIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuZ2V0RGF0YUFycmF5KCkuZmluZChpdGVtID0+IGl0ZW1bdGhpcy52YWx1ZUNvbHVtbl0gPT09IHNlbGVjdGVkVmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgbG9hZCgpOiBhbnkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHpvbmUgPSB0aGlzLmluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIGNvbnN0IGxvYWRPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgdGltZXIgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQodHJ1ZSk7XG4gICAgICB9LCBzZWxmLmRlbGF5TG9hZCk7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB6b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChmYWxzZSk7XG4gICAgICAgICAgc2VsZi5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgIH0pO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGxvYWRPYnNlcnZhYmxlLnN1YnNjcmliZSh2YWwgPT4ge1xuICAgICAgem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBzZWxmLmxvYWRpbmcgPSB2YWwgYXMgYm9vbGVhbjtcbiAgICAgICAgc2VsZi5sb2FkaW5nU3ViamVjdC5uZXh0KHZhbCBhcyBib29sZWFuKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBvbkZvcm1Db250cm9sQ2hhbmdlKHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5vbGRWYWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3VwZXIub25Gb3JtQ29udHJvbENoYW5nZSh2YWx1ZSk7XG4gIH1cblxufVxuIl19