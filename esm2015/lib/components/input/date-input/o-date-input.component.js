import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepicker, MatDatepickerInput } from '@angular/material';
import moment from 'moment';
import { InputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OntimizeMomentDateAdapter } from '../../../shared/material/date/ontimize-moment-date-adapter';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT } from '../text-input/o-text-input.component';
export const DEFAULT_OUTPUTS_O_DATE_INPUT = [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];
export const DEFAULT_INPUTS_O_DATE_INPUT = [
    'valueType: value-type',
    'oformat: format',
    'olocale: locale',
    'oStartView: start-view',
    'oMinDate: min',
    'oMaxDate: max',
    'oTouchUi: touch-ui',
    'oStartAt: start-at',
    'filterDate: filter-date',
    'textInputEnabled: text-input-enabled',
    'dateClass: date-class',
    ...DEFAULT_INPUTS_O_TEXT_INPUT
];
export class ODateInputComponent extends OFormDataComponent {
    constructor(form, dateAdapter, elRef, injector) {
        super(form, elRef, injector);
        this.textInputEnabled = true;
        this._oformat = 'L';
        this.updateLocaleOnChange = false;
        this.oStartView = 'month';
        this._valueType = 'timestamp';
        this.momentDateAdapter = dateAdapter;
        this._defaultSQLTypeKey = 'DATE';
        this.momentSrv = this.injector.get(MomentService);
        this.media = this.injector.get(MediaObserver);
    }
    ngOnInit() {
        this.initialize();
        if (!this.olocale) {
            this.updateLocaleOnChange = true;
            this.olocale = this.momentSrv.getLocale();
        }
        if (this.oformat) {
            this.momentDateAdapter.oFormat = this.oformat;
        }
        this.momentDateAdapter.setLocale(this.olocale);
        if (this.oStartView) {
            this.datepicker.startView = this.oStartView;
        }
        if (this.oStartAt) {
            this.datepicker.startAt = new Date(this.oStartAt);
        }
        if (this.oMinDate) {
            const date = new Date(this.oMinDate);
            const momentD = moment(date);
            if (momentD.isValid()) {
                this.datepickerInput.min = date;
                this.minDateString = momentD.format(this.oformat);
            }
        }
        if (this.oMaxDate) {
            const date = new Date(this.oMaxDate);
            const momentD = moment(date);
            if (momentD.isValid()) {
                this.datepickerInput.max = date;
                this.maxDateString = momentD.format(this.oformat);
            }
        }
        if (this.updateLocaleOnChange) {
            this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
                this.momentDateAdapter.setLocale(this.translateService.getCurrentLang());
                this.setValue(this.getValue());
            });
        }
        this.subscribeToMediaChanges();
    }
    subscribeToMediaChanges() {
        this.mediaSubscription = this.media.asObservable().subscribe((change) => {
            if (['xs', 'sm'].indexOf(change[0].mqAlias) !== -1) {
                this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : true;
            }
            if (['md', 'lg', 'xl'].indexOf(change[0].mqAlias) !== -1) {
                this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : false;
            }
        });
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.mediaSubscription) {
            this.mediaSubscription.unsubscribe();
        }
        if (this.onLanguageChangeSubscription) {
            this.onLanguageChangeSubscription.unsubscribe();
        }
    }
    getValueAsDate() {
        return this.dateValue;
    }
    getValue() {
        let timestampValue = super.getValue();
        if (timestampValue && timestampValue instanceof Date) {
            timestampValue = timestampValue.getTime();
        }
        return timestampValue;
    }
    get showClearButton() {
        return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
    }
    open() {
        if (!this.isReadOnly && this.enabled) {
            this.datepicker.open();
        }
    }
    onChangeEvent(event) {
        const isValid = event.value && event.value.isValid && event.value.isValid();
        let val = isValid ? event.value.valueOf() : event.value;
        const m = moment(val);
        switch (this.valueType) {
            case 'string':
                if (val) {
                    val = m.format(this.oformat);
                }
                break;
            case 'date':
                val = new Date(val);
                break;
            case 'iso-8601':
                val = m.toISOString();
                break;
            case 'timestamp':
            default:
                break;
        }
        this.setValue(val, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    }
    onClickInput(e) {
        if (!this.textInputEnabled) {
            this.open();
        }
    }
    get filterDate() {
        return this._filterDate;
    }
    set filterDate(val) {
        this._filterDate = val;
    }
    get dateClass() {
        return this._dateClass;
    }
    set dateClass(val) {
        this._dateClass = val;
    }
    get oformat() {
        return this._oformat;
    }
    set oformat(val) {
        this._oformat = val;
    }
    get minDateString() {
        return this._minDateString;
    }
    set minDateString(val) {
        this._minDateString = val;
    }
    get maxDateString() {
        return this._maxDateString;
    }
    set maxDateString(val) {
        this._maxDateString = val;
    }
    get touchUi() {
        return this.oTouchUi || false;
    }
    set touchUi(val) {
        this.oTouchUi = val;
        this.datepicker.touchUi = this.touchUi;
    }
    ensureODateValueType(val) {
        if (!Util.isDefined(val)) {
            return val;
        }
        let result = val;
        switch (this.valueType) {
            case 'string':
                if (typeof val === 'string') {
                    const m = moment(val, this.oformat);
                    if (m.isValid()) {
                        this.dateValue = new Date(m.valueOf());
                    }
                }
                else {
                    result = undefined;
                }
                break;
            case 'date':
                if ((val instanceof Date)) {
                    this.dateValue = val;
                }
                else {
                    result = undefined;
                }
                break;
            case 'timestamp':
                if (typeof val === 'number') {
                    this.dateValue = new Date(val);
                }
                else {
                    result = undefined;
                }
                break;
            case 'iso-8601':
                if (typeof val !== 'string') {
                    const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
                    if (acceptTimestamp) {
                        this.dateValue = new Date(val);
                    }
                    else {
                        result = undefined;
                    }
                }
                else {
                    const m = moment(val);
                    if (m.isValid()) {
                        this.dateValue = new Date(m.valueOf());
                    }
                    else {
                        result = undefined;
                    }
                }
                break;
            default:
                break;
        }
        if (!Util.isDefined(result)) {
            console.warn(`ODateInputComponent value (${val}) is not consistent with value-type (${this.valueType})`);
        }
        return result;
    }
    setFormValue(val, options, setDirty = false) {
        let value = val;
        if (val instanceof OFormValue) {
            value = val.value;
        }
        this.ensureODateValueType(value);
        super.setFormValue(value, options, setDirty);
    }
    set valueType(val) {
        this._valueType = Util.convertToODateValueType(val);
    }
    get valueType() {
        return this._valueType;
    }
}
ODateInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-date-input',
                template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\" (click)=\"onClickInput($event)\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput #matInputRef [matDatepicker]=\"picker\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [placeholder]=\"placeHolder\" [readonly]=\"isReadOnly || !textInputEnabled\" (focus)=\"innerOnFocus($event)\"\n      (blur)=\"innerOnBlur($event)\" [matDatepickerFilter]=\"filterDate\" (dateChange)=\"onChangeEvent($event)\"\n      [required]=\"isRequired\" [value]=\"getValueAsDate()\">\n\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-datepicker-toggle matSuffix [disabled]=\"isReadOnly || !enabled\" [class.read-only]=\"isReadOnly\" [for]=\"picker\">\n      <mat-icon matDatepickerToggleIcon>today</mat-icon>\n    </mat-datepicker-toggle>\n    <mat-datepicker #picker [disabled]=\"isReadOnly || !enabled\" [dateClass]=\"dateClass\"></mat-datepicker>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('matDatepickerParse')\"\n      text=\"{{ 'FORM_VALIDATION.DATE_PARSE' | oTranslate }} {{ oformat }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('matDatepickerFilter')\" text=\"{{ 'FORM_VALIDATION.DATE_FILTER' | oTranslate }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('matDatepickerMin')\"\n      text=\"{{ 'FORM_VALIDATION.DATE_MIN' | oTranslate }} {{ minDateString }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('matDatepickerMax')\"\n      text=\"{{ 'FORM_VALIDATION.DATE_MAX' | oTranslate }} {{ maxDateString }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                outputs: DEFAULT_OUTPUTS_O_DATE_INPUT,
                inputs: DEFAULT_INPUTS_O_DATE_INPUT,
                providers: [
                    { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] }
                ],
                styles: [""]
            }] }
];
ODateInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: DateAdapter },
    { type: ElementRef },
    { type: Injector }
];
ODateInputComponent.propDecorators = {
    datepicker: [{ type: ViewChild, args: ['picker', { static: true },] }],
    datepickerInput: [{ type: ViewChild, args: [MatDatepickerInput, { static: true },] }],
    matInputRef: [{ type: ViewChild, args: ['matInputRef', { read: ElementRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ODateInputComponent.prototype, "textInputEnabled", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ODateInputComponent.prototype, "oTouchUi", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9kYXRlLWlucHV0L28tZGF0ZS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFxQixRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVILE9BQU8sRUFBZSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQTJCLE1BQU0sbUJBQW1CLENBQUM7QUFFN0gsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBRzVCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDakUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFLdkcsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRWpILE1BQU0sQ0FBQyxN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LEVBQUU7b0JBQ1QsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRTtpQkFDdkY7O2FBQ0Y7OztZQWxDUSxjQUFjLHVCQXlFbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBdkYvQyxXQUFXO1lBRkEsVUFBVTtZQUFzQixRQUFROzs7eUJBNEV6RCxTQUFTLFNBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs4QkFHcEMsU0FBUyxTQUFDLGtCQUFrQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTswQkFHOUMsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7QUE1QjVEO0lBREMsY0FBYyxFQUFFOzs2REFDdUI7QUFReEM7SUFEQyxjQUFjLEVBQUU7O3FEQUNXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWVkaWFDaGFuZ2UsIE1lZGlhT2JzZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciwgTUFUX0RBVEVfTE9DQUxFLCBNYXREYXRlcGlja2VyLCBNYXREYXRlcGlja2VySW5wdXQsIE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTW9tZW50RGF0ZUFkYXB0ZXIgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC1tb21lbnQtYWRhcHRlcic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBNb21lbnRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbW9tZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgT250aW1pemVNb21lbnREYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9tYXRlcmlhbC9kYXRlL29udGltaXplLW1vbWVudC1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgRGF0ZUN1c3RvbUNsYXNzRnVuY3Rpb24gfSBmcm9tICcuLi8uLi8uLi90eXBlcy9kYXRlLWN1c3RvbS1jbGFzcy50eXBlJztcbmltcG9ydCB7IERhdGVGaWx0ZXJGdW5jdGlvbiB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2RhdGUtZmlsdGVyLWZ1bmN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9EYXRlVmFsdWVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1kYXRlLXZhbHVlLnR5cGUnO1xuaW1wb3J0IHsgU1FMVHlwZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3NxbHR5cGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQgeyBPRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVQsIERFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVQgfSBmcm9tICcuLi90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fREFURV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fREFURV9JTlBVVCA9IFtcbiAgJ3ZhbHVlVHlwZTogdmFsdWUtdHlwZScsXG4gICdvZm9ybWF0OiBmb3JtYXQnLFxuICAnb2xvY2FsZTogbG9jYWxlJyxcbiAgJ29TdGFydFZpZXc6IHN0YXJ0LXZpZXcnLFxuICAnb01pbkRhdGU6IG1pbicsXG4gICdvTWF4RGF0ZTogbWF4JyxcbiAgJ29Ub3VjaFVpOiB0b3VjaC11aScsXG4gICdvU3RhcnRBdDogc3RhcnQtYXQnLFxuICAnZmlsdGVyRGF0ZTogZmlsdGVyLWRhdGUnLFxuICAndGV4dElucHV0RW5hYmxlZDogdGV4dC1pbnB1dC1lbmFibGVkJyxcbiAgJ2RhdGVDbGFzczogZGF0ZS1jbGFzcycsXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1kYXRlLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZGF0ZS1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZGF0ZS1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19EQVRFX0lOUFVULFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fREFURV9JTlBVVCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgeyBwcm92aWRlOiBEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE9udGltaXplTW9tZW50RGF0ZUFkYXB0ZXIsIGRlcHM6IFtNQVRfREFURV9MT0NBTEVdIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPRGF0ZUlucHV0Q29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyB0ZXh0SW5wdXRFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIF9vZm9ybWF0OiBzdHJpbmcgPSAnTCc7XG4gIHByb3RlY3RlZCBvbG9jYWxlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCB1cGRhdGVMb2NhbGVPbkNoYW5nZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgb1N0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyA9ICdtb250aCc7XG4gIHByb3RlY3RlZCBvTWluRGF0ZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgb01heERhdGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG9Ub3VjaFVpOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgb1N0YXJ0QXQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9maWx0ZXJEYXRlOiBEYXRlRmlsdGVyRnVuY3Rpb247XG4gIHByb3RlY3RlZCBfZGF0ZUNsYXNzOiBEYXRlQ3VzdG9tQ2xhc3NGdW5jdGlvblxuICBwcm90ZWN0ZWQgX3ZhbHVlVHlwZTogT0RhdGVWYWx1ZVR5cGUgPSAndGltZXN0YW1wJztcblxuICBwcm90ZWN0ZWQgX21pbkRhdGVTdHJpbmc6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9tYXhEYXRlU3RyaW5nOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIG1lZGlhOiBNZWRpYU9ic2VydmVyO1xuICBwcm90ZWN0ZWQgbWVkaWFTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIG9uTGFuZ3VhZ2VDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGRhdGVWYWx1ZTogRGF0ZTtcblxuICBAVmlld0NoaWxkKCdwaWNrZXInLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwdWJsaWMgZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlcjxEYXRlPjtcblxuICBAVmlld0NoaWxkKE1hdERhdGVwaWNrZXJJbnB1dCwgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHVibGljIGRhdGVwaWNrZXJJbnB1dDogTWF0RGF0ZXBpY2tlcklucHV0PERhdGU+O1xuXG4gIEBWaWV3Q2hpbGQoJ21hdElucHV0UmVmJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgcHJpdmF0ZSBtYXRJbnB1dFJlZiE6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSBtb21lbnRTcnY6IE1vbWVudFNlcnZpY2U7XG4gIHByaXZhdGUgbW9tZW50RGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPE1vbWVudERhdGVBZGFwdGVyPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBkYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8T250aW1pemVNb21lbnREYXRlQWRhcHRlcj4sXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5tb21lbnREYXRlQWRhcHRlciA9IGRhdGVBZGFwdGVyO1xuICAgIHRoaXMuX2RlZmF1bHRTUUxUeXBlS2V5ID0gJ0RBVEUnO1xuICAgIHRoaXMubW9tZW50U3J2ID0gdGhpcy5pbmplY3Rvci5nZXQoTW9tZW50U2VydmljZSk7XG4gICAgdGhpcy5tZWRpYSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1lZGlhT2JzZXJ2ZXIpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKCF0aGlzLm9sb2NhbGUpIHtcbiAgICAgIHRoaXMudXBkYXRlTG9jYWxlT25DaGFuZ2UgPSB0cnVlO1xuICAgICAgdGhpcy5vbG9jYWxlID0gdGhpcy5tb21lbnRTcnYuZ2V0TG9jYWxlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub2Zvcm1hdCkge1xuICAgICAgKHRoaXMubW9tZW50RGF0ZUFkYXB0ZXIgYXMgYW55KS5vRm9ybWF0ID0gdGhpcy5vZm9ybWF0O1xuICAgIH1cblxuICAgIHRoaXMubW9tZW50RGF0ZUFkYXB0ZXIuc2V0TG9jYWxlKHRoaXMub2xvY2FsZSk7XG5cbiAgICBpZiAodGhpcy5vU3RhcnRWaWV3KSB7XG4gICAgICB0aGlzLmRhdGVwaWNrZXIuc3RhcnRWaWV3ID0gdGhpcy5vU3RhcnRWaWV3O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9TdGFydEF0KSB7XG4gICAgICB0aGlzLmRhdGVwaWNrZXIuc3RhcnRBdCA9IG5ldyBEYXRlKHRoaXMub1N0YXJ0QXQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9NaW5EYXRlKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5vTWluRGF0ZSk7XG4gICAgICBjb25zdCBtb21lbnREID0gbW9tZW50KGRhdGUpO1xuICAgICAgaWYgKG1vbWVudEQuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1pbiA9IGRhdGU7XG4gICAgICAgIHRoaXMubWluRGF0ZVN0cmluZyA9IG1vbWVudEQuZm9ybWF0KHRoaXMub2Zvcm1hdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub01heERhdGUpIHtcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aGlzLm9NYXhEYXRlKTtcbiAgICAgIGNvbnN0IG1vbWVudEQgPSBtb21lbnQoZGF0ZSk7XG4gICAgICBpZiAobW9tZW50RC5pc1ZhbGlkKCkpIHtcbiAgICAgICAgdGhpcy5kYXRlcGlja2VySW5wdXQubWF4ID0gZGF0ZTtcbiAgICAgICAgdGhpcy5tYXhEYXRlU3RyaW5nID0gbW9tZW50RC5mb3JtYXQodGhpcy5vZm9ybWF0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy51cGRhdGVMb2NhbGVPbkNoYW5nZSkge1xuICAgICAgdGhpcy5vbkxhbmd1YWdlQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLm9uTGFuZ3VhZ2VDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMubW9tZW50RGF0ZUFkYXB0ZXIuc2V0TG9jYWxlKHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXRDdXJyZW50TGFuZygpKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpYmVUb01lZGlhQ2hhbmdlcygpO1xuICB9XG5cbiAgcHVibGljIHN1YnNjcmliZVRvTWVkaWFDaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMubWVkaWFTdWJzY3JpcHRpb24gPSB0aGlzLm1lZGlhLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoY2hhbmdlOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gICAgICBpZiAoWyd4cycsICdzbSddLmluZGV4T2YoY2hhbmdlWzBdLm1xQWxpYXMpICE9PSAtMSkge1xuICAgICAgICB0aGlzLnRvdWNoVWkgPSBVdGlsLmlzRGVmaW5lZCh0aGlzLm9Ub3VjaFVpKSA/IHRoaXMub1RvdWNoVWkgOiB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKFsnbWQnLCAnbGcnLCAneGwnXS5pbmRleE9mKGNoYW5nZVswXS5tcUFsaWFzKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy50b3VjaFVpID0gVXRpbC5pc0RlZmluZWQodGhpcy5vVG91Y2hVaSkgPyB0aGlzLm9Ub3VjaFVpIDogZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5tZWRpYVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5tZWRpYVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vbkxhbmd1YWdlQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLm9uTGFuZ3VhZ2VDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWVBc0RhdGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5kYXRlVmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWUoKTogYW55IHtcbiAgICBsZXQgdGltZXN0YW1wVmFsdWUgPSBzdXBlci5nZXRWYWx1ZSgpO1xuICAgIGlmICh0aW1lc3RhbXBWYWx1ZSAmJiB0aW1lc3RhbXBWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVzdGFtcFZhbHVlID0gdGltZXN0YW1wVmFsdWUuZ2V0VGltZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGltZXN0YW1wVmFsdWU7XG4gIH1cblxuICBnZXQgc2hvd0NsZWFyQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNsZWFyQnV0dG9uICYmICF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkICYmIHRoaXMubWF0SW5wdXRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2VFdmVudChldmVudDogTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8YW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGlzVmFsaWQgPSBldmVudC52YWx1ZSAmJiBldmVudC52YWx1ZS5pc1ZhbGlkICYmIGV2ZW50LnZhbHVlLmlzVmFsaWQoKTtcbiAgICBsZXQgdmFsID0gaXNWYWxpZCA/IGV2ZW50LnZhbHVlLnZhbHVlT2YoKSA6IGV2ZW50LnZhbHVlO1xuICAgIGNvbnN0IG0gPSBtb21lbnQodmFsKTtcbiAgICBzd2l0Y2ggKHRoaXMudmFsdWVUeXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgdmFsID0gbS5mb3JtYXQodGhpcy5vZm9ybWF0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2lzby04NjAxJzpcbiAgICAgICAgdmFsID0gbS50b0lTT1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RpbWVzdGFtcCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWwsIHtcbiAgICAgIGNoYW5nZVR5cGU6IE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFLFxuICAgICAgZW1pdEV2ZW50OiBmYWxzZSxcbiAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrSW5wdXQoZTogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudGV4dElucHV0RW5hYmxlZCkge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGZpbHRlckRhdGUoKTogRGF0ZUZpbHRlckZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsdGVyRGF0ZTtcbiAgfVxuXG4gIHNldCBmaWx0ZXJEYXRlKHZhbDogRGF0ZUZpbHRlckZ1bmN0aW9uKSB7XG4gICAgdGhpcy5fZmlsdGVyRGF0ZSA9IHZhbDtcbiAgfVxuXG4gIGdldCBkYXRlQ2xhc3MoKTogRGF0ZUN1c3RvbUNsYXNzRnVuY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kYXRlQ2xhc3M7XG4gIH1cblxuICBzZXQgZGF0ZUNsYXNzKHZhbDogRGF0ZUN1c3RvbUNsYXNzRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9kYXRlQ2xhc3MgPSB2YWw7XG4gIH1cbiAgZ2V0IG9mb3JtYXQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fb2Zvcm1hdDtcbiAgfVxuXG4gIHNldCBvZm9ybWF0KHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fb2Zvcm1hdCA9IHZhbDtcbiAgfVxuXG4gIGdldCBtaW5EYXRlU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkRhdGVTdHJpbmc7XG4gIH1cblxuICBzZXQgbWluRGF0ZVN0cmluZyh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX21pbkRhdGVTdHJpbmcgPSB2YWw7XG4gIH1cblxuICBnZXQgbWF4RGF0ZVN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tYXhEYXRlU3RyaW5nO1xuICB9XG5cbiAgc2V0IG1heERhdGVTdHJpbmcodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tYXhEYXRlU3RyaW5nID0gdmFsO1xuICB9XG5cbiAgZ2V0IHRvdWNoVWkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub1RvdWNoVWkgfHwgZmFsc2U7XG4gIH1cblxuICBzZXQgdG91Y2hVaSh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLm9Ub3VjaFVpID0gdmFsO1xuICAgIHRoaXMuZGF0ZXBpY2tlci50b3VjaFVpID0gdGhpcy50b3VjaFVpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGVuc3VyZU9EYXRlVmFsdWVUeXBlKHZhbDogYW55KTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gdmFsO1xuICAgIHN3aXRjaCAodGhpcy52YWx1ZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnN0IG0gPSBtb21lbnQodmFsLCB0aGlzLm9mb3JtYXQpO1xuICAgICAgICAgIGlmIChtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVmFsdWUgPSBuZXcgRGF0ZShtLnZhbHVlT2YoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICBpZiAoKHZhbCBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgdGhpcy5kYXRlVmFsdWUgPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZXN0YW1wJzpcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhpcy5kYXRlVmFsdWUgPSBuZXcgRGF0ZSh2YWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2lzby04NjAxJzpcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgY29uc3QgYWNjZXB0VGltZXN0YW1wID0gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgJiYgdGhpcy5nZXRTUUxUeXBlKCkgPT09IFNRTFR5cGVzLlRJTUVTVEFNUDtcbiAgICAgICAgICBpZiAoYWNjZXB0VGltZXN0YW1wKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGVWYWx1ZSA9IG5ldyBEYXRlKHZhbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgbSA9IG1vbWVudCh2YWwpO1xuICAgICAgICAgIGlmIChtLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVmFsdWUgPSBuZXcgRGF0ZShtLnZhbHVlT2YoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChyZXN1bHQpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYE9EYXRlSW5wdXRDb21wb25lbnQgdmFsdWUgKCR7dmFsfSkgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB2YWx1ZS10eXBlICgke3RoaXMudmFsdWVUeXBlfSlgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRGb3JtVmFsdWUodmFsOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zLCBzZXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgbGV0IHZhbHVlID0gdmFsO1xuICAgIGlmICh2YWwgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IHZhbC52YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5lbnN1cmVPRGF0ZVZhbHVlVHlwZSh2YWx1ZSk7XG4gICAgc3VwZXIuc2V0Rm9ybVZhbHVlKHZhbHVlLCBvcHRpb25zLCBzZXREaXJ0eSk7XG4gIH1cblxuICBzZXQgdmFsdWVUeXBlKHZhbDogYW55KSB7XG4gICAgdGhpcy5fdmFsdWVUeXBlID0gVXRpbC5jb252ZXJ0VG9PRGF0ZVZhbHVlVHlwZSh2YWwpO1xuICB9XG5cbiAgZ2V0IHZhbHVlVHlwZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVR5cGU7XG4gIH1cblxufVxuIl19