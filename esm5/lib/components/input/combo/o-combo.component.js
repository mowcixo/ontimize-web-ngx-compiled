import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material';
import { Subscription } from 'rxjs';
import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT, OFormServiceComponent } from '../o-form-service-component.class';
export var DEFAULT_INPUTS_O_COMBO = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, [
    'translate',
    'multiple',
    'nullSelection: null-selection',
    'multipleTriggerLabel: multiple-trigger-label',
    'searchable'
]);
export var DEFAULT_OUTPUTS_O_COMBO = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT);
var OComboComponent = (function (_super) {
    tslib_1.__extends(OComboComponent, _super);
    function OComboComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.searchControl = new FormControl();
        _this.multipleTriggerLabel = false;
        _this.searchable = false;
        _this.translate = false;
        _this.nullSelection = true;
        _this._filteredDataArray = [];
        _this.subscription = new Subscription();
        _this.defaultValue = '';
        return _this;
    }
    Object.defineProperty(OComboComponent.prototype, "filteredDataArray", {
        get: function () {
            return this._filteredDataArray;
        },
        set: function (data) {
            if (Util.isArray(data)) {
                this._filteredDataArray = data;
            }
            else if (Util.isObject(data) && Object.keys(data).length > 0) {
                this._filteredDataArray = [data];
            }
            else {
                console.warn('Component has received not supported service data. Supported data are Array or not empty Object');
                this._filteredDataArray = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    OComboComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.subscription.add(this.searchControl.valueChanges.subscribe(function () { return _this.searchFilter(); }));
    };
    OComboComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
        if (this.queryOnInit) {
            this.queryData();
        }
        else if (this.queryOnBind) {
            this.syncDataIndex();
        }
    };
    OComboComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
        this.destroy();
    };
    OComboComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.multiple) {
            this.nullSelection = false;
            this.defaultValue = [];
        }
    };
    OComboComponent.prototype.ensureOFormValue = function (value) {
        if (value instanceof OFormValue) {
            this.value = new OFormValue(value.value);
        }
        else if (Util.isDefined(value) && !(value instanceof OFormValue)) {
            this.value = new OFormValue(value);
        }
        else if (!Util.isDefined(value) && this.nullSelection) {
            this.value = new OFormValue(undefined);
        }
        else {
            this.value = new OFormValue(this.defaultValue);
        }
    };
    OComboComponent.prototype.setDataArray = function (data) {
        _super.prototype.setDataArray.call(this, data);
        this.filteredDataArray = data;
    };
    OComboComponent.prototype.getDataArray = function () {
        return this.dataArray;
    };
    OComboComponent.prototype.getFilteredDataArray = function () {
        return this._filteredDataArray;
    };
    OComboComponent.prototype.hasNullSelection = function () {
        return this.nullSelection;
    };
    OComboComponent.prototype.syncDataIndex = function (queryIfNotFound) {
        if (queryIfNotFound === void 0) { queryIfNotFound = true; }
        _super.prototype.syncDataIndex.call(this, queryIfNotFound);
        if (this._currentIndex !== undefined && this.nullSelection) {
            this._currentIndex += 1;
        }
    };
    OComboComponent.prototype.getValue = function () {
        if (this.value instanceof OFormValue) {
            if (this.value.value !== undefined) {
                return this.value.value;
            }
            else if (this.value.value === undefined) {
                return this.getEmptyValue();
            }
        }
        return '';
    };
    OComboComponent.prototype.getEmptyValue = function () {
        if (this.multiple) {
            return [];
        }
        else {
            if (this.nullSelection) {
                return undefined;
            }
            else {
                return '';
            }
        }
    };
    OComboComponent.prototype.isEmpty = function () {
        if (!(this.value instanceof OFormValue)) {
            return true;
        }
        return this.value.value === undefined || (this.multiple && this.value.value.length === 0);
    };
    OComboComponent.prototype.clearValue = function (options, setDirty) {
        if (setDirty === void 0) { setDirty = false; }
        if (this.multiple) {
            this.setValue(this.defaultValue, options, setDirty);
            this.value.value = [];
        }
        else {
            _super.prototype.clearValue.call(this, options, setDirty);
        }
    };
    Object.defineProperty(OComboComponent.prototype, "showClearButton", {
        get: function () {
            return this.clearButton && !this.isReadOnly && this.enabled && this.isEmpty();
        },
        enumerable: true,
        configurable: true
    });
    OComboComponent.prototype.getMultiple = function () {
        return this.multiple;
    };
    OComboComponent.prototype.onSelectionChange = function (event) {
        if (!this.selectModel.panelOpen) {
            return;
        }
        var newValue = event.value;
        this.setValue(newValue, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    };
    OComboComponent.prototype.getOptionDescriptionValue = function (item) {
        if (item === void 0) { item = {}; }
        var descTxt = '';
        if (this.descriptionColArray && this.descriptionColArray.length > 0) {
            var self_1 = this;
            this.descriptionColArray.forEach(function (col, index) {
                var txt = item[col];
                if (Util.isDefined(txt)) {
                    if (self_1.translate && self_1.translateService) {
                        txt = self_1.translateService.get(txt);
                    }
                    descTxt += txt;
                }
                if (index < self_1.descriptionColArray.length - 1) {
                    descTxt += self_1.separator;
                }
            });
        }
        return descTxt;
    };
    OComboComponent.prototype.getValueColumn = function (item) {
        if (item && item.hasOwnProperty(this.valueColumn)) {
            var option = item[this.valueColumn];
            if (option === 'undefined') {
                option = null;
            }
            return option;
        }
        return '';
    };
    OComboComponent.prototype.isSelected = function (item, rowIndex) {
        var selected = false;
        if (item && item.hasOwnProperty(this.valueColumn) && this.value) {
            var val = item[this.valueColumn];
            if (val === this.value.value) {
                selected = true;
                this._currentIndex = rowIndex;
            }
        }
        return selected;
    };
    OComboComponent.prototype.setValue = function (val, options, setDirty) {
        var _this = this;
        if (setDirty === void 0) { setDirty = false; }
        if (!this.dataArray) {
            return;
        }
        var isDefinedVal = Util.isDefined(val);
        if (this.multiple && !isDefinedVal) {
            return;
        }
        if (!isDefinedVal && !this.nullSelection) {
            console.warn('`o-combo` with attr ' + this.oattr + ' cannot be set. `null-selection` attribute is false.');
            return;
        }
        if (isDefinedVal) {
            var record = this.dataArray.find(function (item) { return item[_this.valueColumn] === val; });
            if (!Util.isDefined(record)) {
                return;
            }
        }
        else {
            if (Util.isDefined(val)) {
                _super.prototype.setValue.call(this, val, options);
            }
        }
        _super.prototype.setValue.call(this, val, options);
    };
    OComboComponent.prototype.getSelectedItems = function () {
        return this.getValue();
    };
    OComboComponent.prototype.setSelectedItems = function (values) {
        this.setValue(values);
    };
    OComboComponent.prototype.getFirstSelectedValue = function () {
        return this.selectModel.selected[0].viewValue;
    };
    OComboComponent.prototype.setIsReadOnly = function (value) {
        _super.prototype.setIsReadOnly.call(this, value);
        var readOnly = Util.isDefined(this.readOnly) ? this.readOnly : value;
        if (this.enabled) {
            if (this._fControl && readOnly) {
                this._fControl.disable();
            }
            else if (this._fControl) {
                this._fControl.enable();
            }
        }
    };
    OComboComponent.prototype.parseByValueColumnType = function (val) {
        if (!Util.isDefined(this.multiple)) {
            return val;
        }
        var valueArr = this.multiple ? val : [val];
        if (this.valueColumnType === Codes.TYPE_INT) {
            valueArr.forEach(function (item, index) {
                var parsed = parseInt(item, 10);
                if (!isNaN(parsed)) {
                    valueArr[index] = parsed;
                }
            });
        }
        return this.multiple ? valueArr : valueArr[0];
    };
    OComboComponent.prototype.searchFilter = function () {
        var _this = this;
        if (this.dataArray || this.dataArray.length) {
            var search_1 = this.searchControl.value;
            if (!search_1) {
                this.filteredDataArray = this.dataArray.slice();
                return;
            }
            else {
                search_1 = search_1.toLowerCase();
            }
            this.filteredDataArray = this.dataArray.filter(function (item) { return _this.getOptionDescriptionValue(item).toLowerCase().indexOf(search_1) > -1; });
        }
    };
    OComboComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-combo',
                    providers: [
                        OntimizeServiceProvider,
                        { provide: OFormServiceComponent, useExisting: forwardRef(function () { return OComboComponent; }) }
                    ],
                    inputs: DEFAULT_INPUTS_O_COMBO,
                    outputs: DEFAULT_OUTPUTS_O_COMBO,
                    template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\"\n  [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [class.read-only]=\"isReadOnly\" [class.custom-width]=\"hasCustomWidth\"\n    [hideRequiredMarker]=\"hideRequiredMarker\" fxFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <mat-select [value]=\"getValue()\" #selectModel [id]=\"getAttribute()\" fxFill [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      [multiple]=\"getMultiple()\" [required]=\"isRequired\" [panelClass]=\"{ 'o-combo-panel': true, 'o-combo-panel-search': searchable }\"\n      (selectionChange)=\"onSelectionChange($event)\">\n      <o-combo-search *ngIf=\"searchable\" [formControl]=\"searchControl\"></o-combo-search>\n\n      <mat-select-trigger *ngIf=\"multiple && multipleTriggerLabel\">\n        {{ selectModel.selected[0] ? getFirstSelectedValue(): '' }}\n        <span *ngIf=\"getFormControl().value.length > 1\">\n          {{ 'INPUT.COMBO.MESSAGE_TRIGGER' | oTranslate: { values: [getFormControl().value.length -1] } }}\n        </span>\n      </mat-select-trigger>\n\n      <div class=\"o-combo-options-container\">\n        <mat-option *ngIf=\"hasNullSelection()\" [value]=\"null\"></mat-option>\n        <mat-option *ngFor=\"let item of getFilteredDataArray()\" [value]=\"getValueColumn(item)\">\n          {{ getOptionDescriptionValue(item) }}\n        </mat-option>\n      </div>\n    </mat-select>\n\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-combo]': 'true'
                    },
                    styles: [".o-combo .read-only .mat-select-arrow-wrapper{visibility:hidden}.o-combo .read-only .mat-form-field-underline{background-image:none}.o-combo .mat-select{line-height:normal}.o-combo-panel.o-combo-panel-search{height:100%}.o-combo-panel.o-combo-panel-search .o-combo-options-container{height:calc(100% - 3em);overflow:auto}"]
                }] }
    ];
    OComboComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    OComboComponent.propDecorators = {
        inputModel: [{ type: ViewChild, args: ['inputModel', { static: false },] }],
        selectModel: [{ type: ViewChild, args: ['selectModel', { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OComboComponent.prototype, "multiple", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OComboComponent.prototype, "multipleTriggerLabel", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OComboComponent.prototype, "searchable", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OComboComponent.prototype, "translate", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OComboComponent.prototype, "nullSelection", void 0);
    return OComboComponent;
}(OFormServiceComponent));
export { OComboComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21iby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY29tYm8vby1jb21iby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5SixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBbUIsTUFBTSxtQkFBbUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXBDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLHdDQUF3QyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFN0osTUFBTSxDQUFDLElBQU0sc0JBQXNCLG9CQUM5Qix1Q0FBdUM7SUFDMUMsV0FBVztJQUNYLFVBQVU7SUFDViwrQkFBK0I7SUFDL0IsOENBQThDO0lBQzlDLFlBQVk7RUFDYixDQUFDO0FBRUYsTUFB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U0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7Z0JBdkZyQixVQUFVO2dCQUFzQixRQUFROzs7NkJBNkR4RSxTQUFTLFNBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs4QkFHekMsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBZDNDO1FBREMsY0FBYyxFQUFFOztxREFDUTtJQUV6QjtRQURDLGNBQWMsRUFBRTs7aUVBQzRCO0lBRTdDO1FBREMsY0FBYyxFQUFFOzt1REFDa0I7SUFFbkM7UUFEQyxjQUFjLEVBQUU7O3NEQUNvQjtJQUVyQztRQURDLGNBQWMsRUFBRTs7MERBQ3VCO0lBaVMxQyxzQkFBQztDQUFBLEFBL1RELENBZXFDLHFCQUFxQixHQWdUekQ7U0FoVFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdFNlbGVjdCwgTWF0U2VsZWN0Q2hhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuLi8uLi9mb3JtL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsIE9Gb3JtU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL28tZm9ybS1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0NPTUJPID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsXG4gICd0cmFuc2xhdGUnLFxuICAnbXVsdGlwbGUnLFxuICAnbnVsbFNlbGVjdGlvbjogbnVsbC1zZWxlY3Rpb24nLFxuICAnbXVsdGlwbGVUcmlnZ2VyTGFiZWw6IG11bHRpcGxlLXRyaWdnZXItbGFiZWwnLFxuICAnc2VhcmNoYWJsZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19DT01CTyA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jb21ibycsXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplU2VydmljZVByb3ZpZGVyLFxuICAgIHsgcHJvdmlkZTogT0Zvcm1TZXJ2aWNlQ29tcG9uZW50LCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPQ29tYm9Db21wb25lbnQpIH1cbiAgXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0NPTUJPLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19DT01CTyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tY29tYm8uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWNvbWJvLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY29tYm9dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0NvbWJvQ29tcG9uZW50IGV4dGVuZHMgT0Zvcm1TZXJ2aWNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyB2YWx1ZTogT0Zvcm1WYWx1ZTtcbiAgcHVibGljIHNlYXJjaENvbnRyb2w6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG5cbiAgLyogSW5wdXRzICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtdWx0aXBsZTogYm9vbGVhbjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIG11bHRpcGxlVHJpZ2dlckxhYmVsOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzZWFyY2hhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCB0cmFuc2xhdGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG51bGxTZWxlY3Rpb246IGJvb2xlYW4gPSB0cnVlO1xuICAvKiBFbmQgaW5wdXRzKi9cblxuICBAVmlld0NoaWxkKCdpbnB1dE1vZGVsJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHByb3RlY3RlZCBpbnB1dE1vZGVsOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdE1vZGVsJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHByb3RlY3RlZCBzZWxlY3RNb2RlbDogTWF0U2VsZWN0O1xuXG4gIHByb3RlY3RlZCBfZmlsdGVyZWREYXRhQXJyYXk6IGFueVtdID0gW107XG5cbiAgc2V0IGZpbHRlcmVkRGF0YUFycmF5KGRhdGE6IGFueSkge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIHRoaXMuX2ZpbHRlcmVkRGF0YUFycmF5ID0gZGF0YTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNPYmplY3QoZGF0YSkgJiYgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fZmlsdGVyZWREYXRhQXJyYXkgPSBbZGF0YV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQ29tcG9uZW50IGhhcyByZWNlaXZlZCBub3Qgc3VwcG9ydGVkIHNlcnZpY2UgZGF0YS4gU3VwcG9ydGVkIGRhdGEgYXJlIEFycmF5IG9yIG5vdCBlbXB0eSBPYmplY3QnKTtcbiAgICAgIHRoaXMuX2ZpbHRlcmVkRGF0YUFycmF5ID0gW107XG4gICAgfVxuICB9XG5cbiAgZ2V0IGZpbHRlcmVkRGF0YUFycmF5KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbHRlcmVkRGF0YUFycmF5O1xuICB9XG5cbiAgcHJvdGVjdGVkIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gJyc7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQodGhpcy5zZWFyY2hDb250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zZWFyY2hGaWx0ZXIoKSkpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICBpZiAodGhpcy5xdWVyeU9uSW5pdCkge1xuICAgICAgdGhpcy5xdWVyeURhdGEoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucXVlcnlPbkJpbmQpIHtcbiAgICAgIC8vIFRPRE8gZG8gaXQgYmV0dGVyLiBXaGVuIGNoYW5naW5nIHRhYnMgaXQgaXMgbmVjZXNzYXJ5IHRvIGludm9rZSBuZXcgcXVlcnlcbiAgICAgIHRoaXMuc3luY0RhdGFJbmRleCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICB0aGlzLm51bGxTZWxlY3Rpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gW107XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGVuc3VyZU9Gb3JtVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh2YWx1ZS52YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpKSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoIVV0aWwuaXNEZWZpbmVkKHZhbHVlKSAmJiB0aGlzLm51bGxTZWxlY3Rpb24pIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodGhpcy5kZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgICAvLyBUaGlzIGNhbGwgbWFrZSB0aGUgY29tcG9uZW50IHF1ZXJ5aW5nIGl0cyBkYXRhIG11bHRpcGxlIHRpbWVzXG4gICAgLy8gdGhpcy5zeW5jRGF0YUluZGV4KCk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGF0YUFycmF5KGRhdGE6IGFueSk6IHZvaWQge1xuICAgIHN1cGVyLnNldERhdGFBcnJheShkYXRhKTtcbiAgICB0aGlzLmZpbHRlcmVkRGF0YUFycmF5ID0gZGF0YTtcbiAgfVxuXG4gIHB1YmxpYyBnZXREYXRhQXJyYXkoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmRhdGFBcnJheTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGaWx0ZXJlZERhdGFBcnJheSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbHRlcmVkRGF0YUFycmF5O1xuICB9XG5cbiAgcHVibGljIGhhc051bGxTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubnVsbFNlbGVjdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBzeW5jRGF0YUluZGV4KHF1ZXJ5SWZOb3RGb3VuZDogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBzdXBlci5zeW5jRGF0YUluZGV4KHF1ZXJ5SWZOb3RGb3VuZCk7XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRJbmRleCAhPT0gdW5kZWZpbmVkICYmIHRoaXMubnVsbFNlbGVjdGlvbikge1xuICAgICAgLy8gZmlyc3QgcG9zaXRpb24gaXMgZm9yIG51bGwgc2VsZWN0aW9uIHRoYXQgaXQgaXMgbm90IGluY2x1ZGVkIGludG8gZGF0YUFycmF5XG4gICAgICB0aGlzLl9jdXJyZW50SW5kZXggKz0gMTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWUoKTogYW55IHtcbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbXB0eVZhbHVlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHB1YmxpYyBnZXRFbXB0eVZhbHVlKCk6IGFueSB7XG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubnVsbFNlbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGlmICghKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnZhbHVlLnZhbHVlID09PSB1bmRlZmluZWQgfHwgKHRoaXMubXVsdGlwbGUgJiYgdGhpcy52YWx1ZS52YWx1ZS5sZW5ndGggPT09IDApO1xuICB9XG5cbiAgcHVibGljIGNsZWFyVmFsdWUob3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMsIHNldERpcnR5OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmRlZmF1bHRWYWx1ZSwgb3B0aW9ucywgc2V0RGlydHkpO1xuICAgICAgdGhpcy52YWx1ZS52YWx1ZSA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5jbGVhclZhbHVlKG9wdGlvbnMsIHNldERpcnR5KTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2hvd0NsZWFyQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNsZWFyQnV0dG9uICYmICF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkICYmIHRoaXMuaXNFbXB0eSgpO1xuICB9XG5cbiAgcHVibGljIGdldE11bHRpcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm11bHRpcGxlO1xuICB9XG5cbiAgcHVibGljIG9uU2VsZWN0aW9uQ2hhbmdlKGV2ZW50OiBNYXRTZWxlY3RDaGFuZ2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2VsZWN0TW9kZWwucGFuZWxPcGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5ld1ZhbHVlID0gZXZlbnQudmFsdWU7XG4gICAgdGhpcy5zZXRWYWx1ZShuZXdWYWx1ZSwge1xuICAgICAgY2hhbmdlVHlwZTogT1ZhbHVlQ2hhbmdlRXZlbnQuVVNFUl9DSEFOR0UsXG4gICAgICBlbWl0RXZlbnQ6IGZhbHNlLFxuICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldE9wdGlvbkRlc2NyaXB0aW9uVmFsdWUoaXRlbTogYW55ID0ge30pOiBzdHJpbmcge1xuICAgIGxldCBkZXNjVHh0ID0gJyc7XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheSAmJiB0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkuZm9yRWFjaCgoY29sLCBpbmRleCkgPT4ge1xuICAgICAgICBsZXQgdHh0ID0gaXRlbVtjb2xdO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQodHh0KSkge1xuICAgICAgICAgIGlmIChzZWxmLnRyYW5zbGF0ZSAmJiBzZWxmLnRyYW5zbGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHR4dCA9IHNlbGYudHJhbnNsYXRlU2VydmljZS5nZXQodHh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVzY1R4dCArPSB0eHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4IDwgc2VsZi5kZXNjcmlwdGlvbkNvbEFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkZXNjVHh0ICs9IHNlbGYuc2VwYXJhdG9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NUeHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWVDb2x1bW4oaXRlbTogYW55KTogYW55IHtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmhhc093blByb3BlcnR5KHRoaXMudmFsdWVDb2x1bW4pKSB7XG4gICAgICBsZXQgb3B0aW9uID0gaXRlbVt0aGlzLnZhbHVlQ29sdW1uXTtcbiAgICAgIGlmIChvcHRpb24gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9wdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBwdWJsaWMgaXNTZWxlY3RlZChpdGVtOiBhbnksIHJvd0luZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBsZXQgc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmhhc093blByb3BlcnR5KHRoaXMudmFsdWVDb2x1bW4pICYmIHRoaXMudmFsdWUpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGl0ZW1bdGhpcy52YWx1ZUNvbHVtbl07XG4gICAgICBpZiAodmFsID09PSB0aGlzLnZhbHVlLnZhbHVlKSB7XG4gICAgICAgIHNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fY3VycmVudEluZGV4ID0gcm93SW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RlZDtcbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZSh2YWw6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMsIHNldERpcnR5OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGF0YUFycmF5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzRGVmaW5lZFZhbCA9IFV0aWwuaXNEZWZpbmVkKHZhbCk7XG4gICAgaWYgKHRoaXMubXVsdGlwbGUgJiYgIWlzRGVmaW5lZFZhbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghaXNEZWZpbmVkVmFsICYmICF0aGlzLm51bGxTZWxlY3Rpb24pIHtcbiAgICAgIGNvbnNvbGUud2FybignYG8tY29tYm9gIHdpdGggYXR0ciAnICsgdGhpcy5vYXR0ciArICcgY2Fubm90IGJlIHNldC4gYG51bGwtc2VsZWN0aW9uYCBhdHRyaWJ1dGUgaXMgZmFsc2UuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzRGVmaW5lZFZhbCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5kYXRhQXJyYXkuZmluZChpdGVtID0+IGl0ZW1bdGhpcy52YWx1ZUNvbHVtbl0gPT09IHZhbCk7XG4gICAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHJlY29yZCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsKSkge1xuICAgICAgICBzdXBlci5zZXRWYWx1ZSh2YWwsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5zZXRWYWx1ZSh2YWwsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdldFNlbGVjdGVkSXRlbXMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCk7XG4gIH1cblxuICBwdWJsaWMgc2V0U2VsZWN0ZWRJdGVtcyh2YWx1ZXM6IGFueVtdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZXMpO1xuICB9XG5cbiAgcHVibGljIGdldEZpcnN0U2VsZWN0ZWRWYWx1ZSgpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RNb2RlbC5zZWxlY3RlZFswXS52aWV3VmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0SXNSZWFkT25seSh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHN1cGVyLnNldElzUmVhZE9ubHkodmFsdWUpO1xuICAgIGNvbnN0IHJlYWRPbmx5ID0gVXRpbC5pc0RlZmluZWQodGhpcy5yZWFkT25seSkgPyB0aGlzLnJlYWRPbmx5IDogdmFsdWU7XG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgaWYgKHRoaXMuX2ZDb250cm9sICYmIHJlYWRPbmx5KSB7XG4gICAgICAgIHRoaXMuX2ZDb250cm9sLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgICAgdGhpcy5fZkNvbnRyb2wuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCBwYXJzZUJ5VmFsdWVDb2x1bW5UeXBlKHZhbDogYW55KTogYW55IHtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMubXVsdGlwbGUpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZUFycjogYW55W10gPSB0aGlzLm11bHRpcGxlID8gdmFsIDogW3ZhbF07XG4gICAgaWYgKHRoaXMudmFsdWVDb2x1bW5UeXBlID09PSBDb2Rlcy5UWVBFX0lOVCkge1xuICAgICAgdmFsdWVBcnIuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoaXRlbSwgMTApO1xuICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZCkpIHtcbiAgICAgICAgICB2YWx1ZUFycltpbmRleF0gPSBwYXJzZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5tdWx0aXBsZSA/IHZhbHVlQXJyIDogdmFsdWVBcnJbMF07XG4gIH1cblxuICBwcm90ZWN0ZWQgc2VhcmNoRmlsdGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGFBcnJheSB8fCB0aGlzLmRhdGFBcnJheS5sZW5ndGgpIHtcblxuICAgICAgLy8gZ2V0IHRoZSBzZWFyY2gga2V5d29yZFxuICAgICAgbGV0IHNlYXJjaCA9IHRoaXMuc2VhcmNoQ29udHJvbC52YWx1ZTtcbiAgICAgIGlmICghc2VhcmNoKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyZWREYXRhQXJyYXkgPSB0aGlzLmRhdGFBcnJheS5zbGljZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWFyY2ggPSBzZWFyY2gudG9Mb3dlckNhc2UoKTtcbiAgICAgIH1cblxuICAgICAgLy8gZmlsdGVyXG4gICAgICB0aGlzLmZpbHRlcmVkRGF0YUFycmF5ID0gdGhpcy5kYXRhQXJyYXkuZmlsdGVyKGl0ZW0gPT4gdGhpcy5nZXRPcHRpb25EZXNjcmlwdGlvblZhbHVlKGl0ZW0pLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpID4gLTEpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=