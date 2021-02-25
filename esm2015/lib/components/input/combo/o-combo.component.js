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
export const DEFAULT_INPUTS_O_COMBO = [
    ...DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
    'translate',
    'multiple',
    'nullSelection: null-selection',
    'multipleTriggerLabel: multiple-trigger-label',
    'searchable'
];
export const DEFAULT_OUTPUTS_O_COMBO = [
    ...DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT
];
export class OComboComponent extends OFormServiceComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.searchControl = new FormControl();
        this.multipleTriggerLabel = false;
        this.searchable = false;
        this.translate = false;
        this.nullSelection = true;
        this._filteredDataArray = [];
        this.subscription = new Subscription();
        this.defaultValue = '';
    }
    set filteredDataArray(data) {
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
    }
    get filteredDataArray() {
        return this._filteredDataArray;
    }
    ngOnInit() {
        super.ngOnInit();
        this.subscription.add(this.searchControl.valueChanges.subscribe(() => this.searchFilter()));
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.queryOnInit) {
            this.queryData();
        }
        else if (this.queryOnBind) {
            this.syncDataIndex();
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.destroy();
    }
    initialize() {
        super.initialize();
        if (this.multiple) {
            this.nullSelection = false;
            this.defaultValue = [];
        }
    }
    ensureOFormValue(value) {
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
    }
    setDataArray(data) {
        super.setDataArray(data);
        this.filteredDataArray = data;
    }
    getDataArray() {
        return this.dataArray;
    }
    getFilteredDataArray() {
        return this._filteredDataArray;
    }
    hasNullSelection() {
        return this.nullSelection;
    }
    syncDataIndex(queryIfNotFound = true) {
        super.syncDataIndex(queryIfNotFound);
        if (this._currentIndex !== undefined && this.nullSelection) {
            this._currentIndex += 1;
        }
    }
    getValue() {
        if (this.value instanceof OFormValue) {
            if (this.value.value !== undefined) {
                return this.value.value;
            }
            else if (this.value.value === undefined) {
                return this.getEmptyValue();
            }
        }
        return '';
    }
    getEmptyValue() {
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
    }
    isEmpty() {
        if (!(this.value instanceof OFormValue)) {
            return true;
        }
        return this.value.value === undefined || (this.multiple && this.value.value.length === 0);
    }
    clearValue(options, setDirty = false) {
        if (this.multiple) {
            this.setValue(this.defaultValue, options, setDirty);
            this.value.value = [];
        }
        else {
            super.clearValue(options, setDirty);
        }
    }
    get showClearButton() {
        return this.clearButton && !this.isReadOnly && this.enabled && this.isEmpty();
    }
    getMultiple() {
        return this.multiple;
    }
    onSelectionChange(event) {
        if (!this.selectModel.panelOpen) {
            return;
        }
        const newValue = event.value;
        this.setValue(newValue, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    }
    getOptionDescriptionValue(item = {}) {
        let descTxt = '';
        if (this.descriptionColArray && this.descriptionColArray.length > 0) {
            const self = this;
            this.descriptionColArray.forEach((col, index) => {
                let txt = item[col];
                if (Util.isDefined(txt)) {
                    if (self.translate && self.translateService) {
                        txt = self.translateService.get(txt);
                    }
                    descTxt += txt;
                }
                if (index < self.descriptionColArray.length - 1) {
                    descTxt += self.separator;
                }
            });
        }
        return descTxt;
    }
    getValueColumn(item) {
        if (item && item.hasOwnProperty(this.valueColumn)) {
            let option = item[this.valueColumn];
            if (option === 'undefined') {
                option = null;
            }
            return option;
        }
        return '';
    }
    isSelected(item, rowIndex) {
        let selected = false;
        if (item && item.hasOwnProperty(this.valueColumn) && this.value) {
            const val = item[this.valueColumn];
            if (val === this.value.value) {
                selected = true;
                this._currentIndex = rowIndex;
            }
        }
        return selected;
    }
    setValue(val, options, setDirty = false) {
        if (!this.dataArray) {
            return;
        }
        const isDefinedVal = Util.isDefined(val);
        if (this.multiple && !isDefinedVal) {
            return;
        }
        if (!isDefinedVal && !this.nullSelection) {
            console.warn('`o-combo` with attr ' + this.oattr + ' cannot be set. `null-selection` attribute is false.');
            return;
        }
        if (isDefinedVal) {
            const record = this.dataArray.find(item => item[this.valueColumn] === val);
            if (!Util.isDefined(record)) {
                return;
            }
        }
        else {
            if (Util.isDefined(val)) {
                super.setValue(val, options);
            }
        }
        super.setValue(val, options);
    }
    getSelectedItems() {
        return this.getValue();
    }
    setSelectedItems(values) {
        this.setValue(values);
    }
    getFirstSelectedValue() {
        return this.selectModel.selected[0].viewValue;
    }
    setIsReadOnly(value) {
        super.setIsReadOnly(value);
        const readOnly = Util.isDefined(this.readOnly) ? this.readOnly : value;
        if (this.enabled) {
            if (this._fControl && readOnly) {
                this._fControl.disable();
            }
            else if (this._fControl) {
                this._fControl.enable();
            }
        }
    }
    parseByValueColumnType(val) {
        if (!Util.isDefined(this.multiple)) {
            return val;
        }
        const valueArr = this.multiple ? val : [val];
        if (this.valueColumnType === Codes.TYPE_INT) {
            valueArr.forEach((item, index) => {
                const parsed = parseInt(item, 10);
                if (!isNaN(parsed)) {
                    valueArr[index] = parsed;
                }
            });
        }
        return this.multiple ? valueArr : valueArr[0];
    }
    searchFilter() {
        if (this.dataArray || this.dataArray.length) {
            let search = this.searchControl.value;
            if (!search) {
                this.filteredDataArray = this.dataArray.slice();
                return;
            }
            else {
                search = search.toLowerCase();
            }
            this.filteredDataArray = this.dataArray.filter(item => this.getOptionDescriptionValue(item).toLowerCase().indexOf(search) > -1);
        }
    }
}
OComboComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-combo',
                providers: [
                    OntimizeServiceProvider,
                    { provide: OFormServiceComponent, useExisting: forwardRef(() => OComboComponent) }
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
OComboComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb21iby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY29tYm8vby1jb21iby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5SixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLFNBQVMsRUFBbUIsTUFBTSxtQkFBbUIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXBDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLHdDQUF3QyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFN0osTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsR0FBRyx1Q0FBdUM7SUFDMUMsV0FBVztJQUNYLFVBQVU7SUFDViwrQkFBK0I7SUFDL0IsOENBQThDO0lBQzlDLFlBQVk7Q0FDYixDQUFD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a0I7QUFFbkM7SUFEQyxjQUFjLEVBQUU7O2tEQUNvQjtBQUVyQztJQURDLGNBQWMsRUFBRTs7c0RBQ3VCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0U2VsZWN0LCBNYXRTZWxlY3RDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQgeyBPVmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gJy4uLy4uL28tdmFsdWUtY2hhbmdlLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCwgREVGQVVMVF9PVVRQVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCwgT0Zvcm1TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1mb3JtLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQ09NQk8gPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCxcbiAgJ3RyYW5zbGF0ZScsXG4gICdtdWx0aXBsZScsXG4gICdudWxsU2VsZWN0aW9uOiBudWxsLXNlbGVjdGlvbicsXG4gICdtdWx0aXBsZVRyaWdnZXJMYWJlbDogbXVsdGlwbGUtdHJpZ2dlci1sYWJlbCcsXG4gICdzZWFyY2hhYmxlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0NPTUJPID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5UXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWNvbWJvJyxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIsXG4gICAgeyBwcm92aWRlOiBPRm9ybVNlcnZpY2VDb21wb25lbnQsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9Db21ib0NvbXBvbmVudCkgfVxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQ09NQk8sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0NPTUJPLFxuICB0ZW1wbGF0ZVVybDogJy4vby1jb21iby5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tY29tYm8uY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jb21ib10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQ29tYm9Db21wb25lbnQgZXh0ZW5kcyBPRm9ybVNlcnZpY2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIHZhbHVlOiBPRm9ybVZhbHVlO1xuICBwdWJsaWMgc2VhcmNoQ29udHJvbDogRm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcblxuICAvKiBJbnB1dHMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIG11bHRpcGxlOiBib29sZWFuO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgbXVsdGlwbGVUcmlnZ2VyTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNlYXJjaGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgbnVsbFNlbGVjdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIC8qIEVuZCBpbnB1dHMqL1xuXG4gIEBWaWV3Q2hpbGQoJ2lucHV0TW9kZWwnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIGlucHV0TW9kZWw6IEVsZW1lbnRSZWY7XG5cbiAgQFZpZXdDaGlsZCgnc2VsZWN0TW9kZWwnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIHNlbGVjdE1vZGVsOiBNYXRTZWxlY3Q7XG5cbiAgcHJvdGVjdGVkIF9maWx0ZXJlZERhdGFBcnJheTogYW55W10gPSBbXTtcblxuICBzZXQgZmlsdGVyZWREYXRhQXJyYXkoZGF0YTogYW55KSB7XG4gICAgaWYgKFV0aWwuaXNBcnJheShkYXRhKSkge1xuICAgICAgdGhpcy5fZmlsdGVyZWREYXRhQXJyYXkgPSBkYXRhO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc09iamVjdChkYXRhKSAmJiBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9maWx0ZXJlZERhdGFBcnJheSA9IFtkYXRhXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgaGFzIHJlY2VpdmVkIG5vdCBzdXBwb3J0ZWQgc2VydmljZSBkYXRhLiBTdXBwb3J0ZWQgZGF0YSBhcmUgQXJyYXkgb3Igbm90IGVtcHR5IE9iamVjdCcpO1xuICAgICAgdGhpcy5fZmlsdGVyZWREYXRhQXJyYXkgPSBbXTtcbiAgICB9XG4gIH1cblxuICBnZXQgZmlsdGVyZWREYXRhQXJyYXkoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZmlsdGVyZWREYXRhQXJyYXk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSAnJztcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZCh0aGlzLnNlYXJjaENvbnRyb2wudmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLnNlYXJjaEZpbHRlcigpKSk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIGlmICh0aGlzLnF1ZXJ5T25Jbml0KSB7XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5xdWVyeU9uQmluZCkge1xuICAgICAgLy8gVE9ETyBkbyBpdCBiZXR0ZXIuIFdoZW4gY2hhbmdpbmcgdGFicyBpdCBpcyBuZWNlc3NhcnkgdG8gaW52b2tlIG5ldyBxdWVyeVxuICAgICAgdGhpcy5zeW5jRGF0YUluZGV4KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIHRoaXMubnVsbFNlbGVjdGlvbiA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBbXTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZW5zdXJlT0Zvcm1WYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbHVlLnZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNEZWZpbmVkKHZhbHVlKSAmJiAhKHZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh2YWx1ZSk7XG4gICAgfSBlbHNlIGlmICghVXRpbC5pc0RlZmluZWQodmFsdWUpICYmIHRoaXMubnVsbFNlbGVjdGlvbikge1xuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHVuZGVmaW5lZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh0aGlzLmRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIC8vIFRoaXMgY2FsbCBtYWtlIHRoZSBjb21wb25lbnQgcXVlcnlpbmcgaXRzIGRhdGEgbXVsdGlwbGUgdGltZXNcbiAgICAvLyB0aGlzLnN5bmNEYXRhSW5kZXgoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXREYXRhQXJyYXkoZGF0YTogYW55KTogdm9pZCB7XG4gICAgc3VwZXIuc2V0RGF0YUFycmF5KGRhdGEpO1xuICAgIHRoaXMuZmlsdGVyZWREYXRhQXJyYXkgPSBkYXRhO1xuICB9XG5cbiAgcHVibGljIGdldERhdGFBcnJheSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YUFycmF5O1xuICB9XG5cbiAgcHVibGljIGdldEZpbHRlcmVkRGF0YUFycmF5KCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsdGVyZWREYXRhQXJyYXk7XG4gIH1cblxuICBwdWJsaWMgaGFzTnVsbFNlbGVjdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5udWxsU2VsZWN0aW9uO1xuICB9XG5cbiAgcHVibGljIHN5bmNEYXRhSW5kZXgocXVlcnlJZk5vdEZvdW5kOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHN1cGVyLnN5bmNEYXRhSW5kZXgocXVlcnlJZk5vdEZvdW5kKTtcbiAgICBpZiAodGhpcy5fY3VycmVudEluZGV4ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5udWxsU2VsZWN0aW9uKSB7XG4gICAgICAvLyBmaXJzdCBwb3NpdGlvbiBpcyBmb3IgbnVsbCBzZWxlY3Rpb24gdGhhdCBpdCBpcyBub3QgaW5jbHVkZWQgaW50byBkYXRhQXJyYXlcbiAgICAgIHRoaXMuX2N1cnJlbnRJbmRleCArPSAxO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZSgpOiBhbnkge1xuICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgaWYgKHRoaXMudmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS52YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVtcHR5VmFsdWUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHVibGljIGdldEVtcHR5VmFsdWUoKTogYW55IHtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5udWxsU2VsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7XG4gICAgaWYgKCEodGhpcy52YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmFsdWUudmFsdWUgPT09IHVuZGVmaW5lZCB8fCAodGhpcy5tdWx0aXBsZSAmJiB0aGlzLnZhbHVlLnZhbHVlLmxlbmd0aCA9PT0gMCk7XG4gIH1cblxuICBwdWJsaWMgY2xlYXJWYWx1ZShvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucywgc2V0RGlydHk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICB0aGlzLnNldFZhbHVlKHRoaXMuZGVmYXVsdFZhbHVlLCBvcHRpb25zLCBzZXREaXJ0eSk7XG4gICAgICB0aGlzLnZhbHVlLnZhbHVlID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyLmNsZWFyVmFsdWUob3B0aW9ucywgc2V0RGlydHkpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaG93Q2xlYXJCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJCdXR0b24gJiYgIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQgJiYgdGhpcy5pc0VtcHR5KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0TXVsdGlwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubXVsdGlwbGU7XG4gIH1cblxuICBwdWJsaWMgb25TZWxlY3Rpb25DaGFuZ2UoZXZlbnQ6IE1hdFNlbGVjdENoYW5nZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zZWxlY3RNb2RlbC5wYW5lbE9wZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3VmFsdWUgPSBldmVudC52YWx1ZTtcbiAgICB0aGlzLnNldFZhbHVlKG5ld1ZhbHVlLCB7XG4gICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2UsXG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0T3B0aW9uRGVzY3JpcHRpb25WYWx1ZShpdGVtOiBhbnkgPSB7fSk6IHN0cmluZyB7XG4gICAgbGV0IGRlc2NUeHQgPSAnJztcbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5ICYmIHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheS5mb3JFYWNoKChjb2wsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCB0eHQgPSBpdGVtW2NvbF07XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0eHQpKSB7XG4gICAgICAgICAgaWYgKHNlbGYudHJhbnNsYXRlICYmIHNlbGYudHJhbnNsYXRlU2VydmljZSkge1xuICAgICAgICAgICAgdHh0ID0gc2VsZi50cmFuc2xhdGVTZXJ2aWNlLmdldCh0eHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXNjVHh0ICs9IHR4dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPCBzZWxmLmRlc2NyaXB0aW9uQ29sQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRlc2NUeHQgKz0gc2VsZi5zZXBhcmF0b3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY1R4dDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZUNvbHVtbihpdGVtOiBhbnkpOiBhbnkge1xuICAgIGlmIChpdGVtICYmIGl0ZW0uaGFzT3duUHJvcGVydHkodGhpcy52YWx1ZUNvbHVtbikpIHtcbiAgICAgIGxldCBvcHRpb24gPSBpdGVtW3RoaXMudmFsdWVDb2x1bW5dO1xuICAgICAgaWYgKG9wdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb247XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHB1YmxpYyBpc1NlbGVjdGVkKGl0ZW06IGFueSwgcm93SW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGxldCBzZWxlY3RlZCA9IGZhbHNlO1xuICAgIGlmIChpdGVtICYmIGl0ZW0uaGFzT3duUHJvcGVydHkodGhpcy52YWx1ZUNvbHVtbikgJiYgdGhpcy52YWx1ZSkge1xuICAgICAgY29uc3QgdmFsID0gaXRlbVt0aGlzLnZhbHVlQ29sdW1uXTtcbiAgICAgIGlmICh2YWwgPT09IHRoaXMudmFsdWUudmFsdWUpIHtcbiAgICAgICAgc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9jdXJyZW50SW5kZXggPSByb3dJbmRleDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdGVkO1xuICB9XG5cbiAgcHVibGljIHNldFZhbHVlKHZhbDogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucywgc2V0RGlydHk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5kYXRhQXJyYXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgaXNEZWZpbmVkVmFsID0gVXRpbC5pc0RlZmluZWQodmFsKTtcbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiAhaXNEZWZpbmVkVmFsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFpc0RlZmluZWRWYWwgJiYgIXRoaXMubnVsbFNlbGVjdGlvbikge1xuICAgICAgY29uc29sZS53YXJuKCdgby1jb21ib2Agd2l0aCBhdHRyICcgKyB0aGlzLm9hdHRyICsgJyBjYW5ub3QgYmUgc2V0LiBgbnVsbC1zZWxlY3Rpb25gIGF0dHJpYnV0ZSBpcyBmYWxzZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNEZWZpbmVkVmFsKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmRhdGFBcnJheS5maW5kKGl0ZW0gPT4gaXRlbVt0aGlzLnZhbHVlQ29sdW1uXSA9PT0gdmFsKTtcbiAgICAgIGlmICghVXRpbC5pc0RlZmluZWQocmVjb3JkKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWwpKSB7XG4gICAgICAgIHN1cGVyLnNldFZhbHVlKHZhbCwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyLnNldFZhbHVlKHZhbCwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VsZWN0ZWRJdGVtcygpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRTZWxlY3RlZEl0ZW1zKHZhbHVlczogYW55W10pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlcyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rmlyc3RTZWxlY3RlZFZhbHVlKCk6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdE1vZGVsLnNlbGVjdGVkWzBdLnZpZXdWYWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRJc1JlYWRPbmx5KHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgc3VwZXIuc2V0SXNSZWFkT25seSh2YWx1ZSk7XG4gICAgY29uc3QgcmVhZE9ubHkgPSBVdGlsLmlzRGVmaW5lZCh0aGlzLnJlYWRPbmx5KSA/IHRoaXMucmVhZE9ubHkgOiB2YWx1ZTtcbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICBpZiAodGhpcy5fZkNvbnRyb2wgJiYgcmVhZE9ubHkpIHtcbiAgICAgICAgdGhpcy5fZkNvbnRyb2wuZGlzYWJsZSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9mQ29udHJvbCkge1xuICAgICAgICB0aGlzLl9mQ29udHJvbC5lbmFibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIHBhcnNlQnlWYWx1ZUNvbHVtblR5cGUodmFsOiBhbnkpOiBhbnkge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5tdWx0aXBsZSkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlQXJyOiBhbnlbXSA9IHRoaXMubXVsdGlwbGUgPyB2YWwgOiBbdmFsXTtcbiAgICBpZiAodGhpcy52YWx1ZUNvbHVtblR5cGUgPT09IENvZGVzLlRZUEVfSU5UKSB7XG4gICAgICB2YWx1ZUFyci5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChpdGVtLCAxMCk7XG4gICAgICAgIGlmICghaXNOYU4ocGFyc2VkKSkge1xuICAgICAgICAgIHZhbHVlQXJyW2luZGV4XSA9IHBhcnNlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm11bHRpcGxlID8gdmFsdWVBcnIgOiB2YWx1ZUFyclswXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZWFyY2hGaWx0ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0YUFycmF5IHx8IHRoaXMuZGF0YUFycmF5Lmxlbmd0aCkge1xuXG4gICAgICAvLyBnZXQgdGhlIHNlYXJjaCBrZXl3b3JkXG4gICAgICBsZXQgc2VhcmNoID0gdGhpcy5zZWFyY2hDb250cm9sLnZhbHVlO1xuICAgICAgaWYgKCFzZWFyY2gpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJlZERhdGFBcnJheSA9IHRoaXMuZGF0YUFycmF5LnNsaWNlKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlYXJjaCA9IHNlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBmaWx0ZXJcbiAgICAgIHRoaXMuZmlsdGVyZWREYXRhQXJyYXkgPSB0aGlzLmRhdGFBcnJheS5maWx0ZXIoaXRlbSA9PiB0aGlzLmdldE9wdGlvbkRlc2NyaXB0aW9uVmFsdWUoaXRlbSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgPiAtMSk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==