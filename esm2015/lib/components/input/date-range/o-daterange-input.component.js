import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import * as _moment from 'moment';
import { InputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_DATE_INPUT } from '../date-input/o-date-input.component';
import { DEFAULT_OUTPUTS_O_TEXT_INPUT } from '../text-input/o-text-input.component';
import { ODaterangepickerDirective } from './o-daterange-input.directive';
export const DEFAULT_OUTPUTS_O_DATERANGE_INPUT = [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];
export const DEFAULT_INPUTS_O_DATERANGE_INPUT = [
    'separator',
    'showWeekNumbers:show-week-numbers',
    'showRanges:show-ranges',
    'olocale:locale',
    'startKey',
    'endKey',
    'valueType: value-type',
    ...DEFAULT_INPUTS_O_DATE_INPUT
];
const moment = _moment;
export class ODateRangeInputComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.textInputEnabled = true;
        this.showWeekNumbers = false;
        this.oTouchUi = false;
        this.showRanges = false;
        this._startKey = 'startDate';
        this._endKey = 'endDate';
        this._valueType = 'timestamp';
        this._separator = ' - ';
        this.oformat = 'L';
        this.oTranslate = this.injector.get(OTranslateService);
        this.momentSrv = this.injector.get(MomentService);
        this._localeOptions = {
            direction: 'ltr',
            separator: ' - ',
            weekLabel: this.oTranslate.get('DATERANGE.W'),
            applyLabel: this.oTranslate.get('DATERANGE.APPLYLABEL'),
            cancelLabel: this.oTranslate.get('CANCEL'),
            customRangeLabel: 'Custom range',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek(),
            format: 'L'
        };
    }
    get oMinDate() {
        return this._oMinDate;
    }
    set oMinDate(value) {
        this._oMinDate = moment(value, this.oformat);
    }
    get oMaxDate() {
        return this._oMaxDate;
    }
    set oMaxDate(value) {
        this._oMaxDate = moment(value, this.oformat);
    }
    get startKey() {
        return this._startKey;
    }
    set startKey(value) {
        this._startKey = value;
    }
    get endKey() {
        return this._endKey;
    }
    set endKey(value) {
        this._endKey = value;
    }
    get separator() {
        return this._separator;
    }
    set separator(value) {
        this._separator = value;
        if (this.getFormControl() && this.getFormControl().value) {
            this.updateElement();
        }
    }
    get showClearButton() {
        return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
    }
    get localeOptions() {
        return this._localeOptions;
    }
    ngOnInit() {
        super.ngOnInit();
        if (!this.olocale) {
            this.olocale = this.momentSrv.getLocale();
            moment.locale(this.olocale);
        }
        if (this.oformat) {
            this._localeOptions.format = this.oformat;
        }
    }
    openPicker() {
        this.pickerDirective.open();
    }
    onChangeEvent(event) {
        let objectValue;
        if (event instanceof Event) {
            const value = event.target.value;
            if (value !== '') {
                objectValue = this.getDateRangeToString(value);
            }
        }
        else {
            objectValue = event;
        }
        this.setValue(objectValue, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    }
    setValue(val, options = {}, setDirty = false) {
        super.setValue(val, options, setDirty);
        this.updateElement();
    }
    onClickClearValue(e) {
        super.onClickClearValue(e);
        this.pickerDirective.value = undefined;
        this.pickerDirective.datesUpdated.emit();
    }
    datesUpdated(range) {
        this.pickerDirective.close();
        this.setValue(range, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    }
    setData(newValue) {
        super.setData(newValue);
        this.pickerDirective.datesUpdated.emit(newValue);
        this.updateElement();
    }
    updateElement() {
        let chosenLabel;
        if (Util.isDefined(this.value.value) && !this.isObjectDataRangeNull(this.value)) {
            if (this.value.value[this.pickerDirective.startKey] && this.value.value[this.pickerDirective.endKey]) {
                this.value.value[this.pickerDirective.startKey] = this.ensureDateRangeValue(this.value.value[this.pickerDirective.startKey], this._valueType);
                this.value.value[this.pickerDirective.endKey] = this.ensureDateRangeValue(this.value.value[this.pickerDirective.endKey], this._valueType);
                chosenLabel = this.value.value[this.pickerDirective.startKey].format(this.oformat) +
                    this.separator + this.value.value[this.pickerDirective.endKey].format(this.oformat);
            }
            else {
                chosenLabel = null;
            }
        }
        else {
            chosenLabel = null;
        }
        this.pickerDirective._el.nativeElement.value = chosenLabel;
    }
    getDateRangeToString(valueToString) {
        const value = {};
        const range = valueToString.split(this.separator);
        value[this._startKey] = moment(range[0].trim(), this.oformat);
        value[this._endKey] = moment(range[1].trim(), this.oformat);
        return value;
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        validators.push(this.rangeDateValidator.bind(this));
        if (Util.isDefined(this._oMinDate)) {
            validators.push(this.minDateValidator.bind(this));
        }
        if (Util.isDefined(this._oMaxDate)) {
            validators.push(this.maxDateValidator.bind(this));
        }
        validators.push(this.parseDateValidator.bind(this));
        return validators;
    }
    isObjectDataRangeNull(objectValue) {
        return objectValue !== null && objectValue.value !== null &&
            !Util.isDefined(objectValue.value[this.pickerDirective.startKey]) &&
            !Util.isDefined(objectValue.value[this.pickerDirective.endKey]);
    }
    rangeDateValidator(control) {
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control) && control.value[this._endKey].isSameOrBefore(control.value[this._startKey])) {
            return {
                dateRange: true
            };
        }
        return {};
    }
    minDateValidator(control) {
        const mindate = moment(this._oMinDate);
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control) && control.value[this._startKey].isBefore(mindate)) {
            return {
                dateRangeMin: {
                    dateMin: mindate.format(this.oformat)
                }
            };
        }
        return {};
    }
    maxDateValidator(control) {
        const maxdate = moment(this._oMaxDate);
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control) && control.value[this._endKey].isAfter(maxdate)) {
            return {
                dateRangeMax: {
                    dateMax: maxdate.format(this.oformat)
                }
            };
        }
        return {};
    }
    parseDateValidator(control) {
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control)
            && ((control.value[this._startKey] && !control.value[this._startKey].isValid())
                || (control.value[this._endKey] && !control.value[this._endKey].isValid()))) {
            return {
                dateRangeParse: {
                    format: this.oformat + this._localeOptions.separator + this.oformat
                }
            };
        }
        return {};
    }
    ensureDateRangeValue(val, valueType) {
        if (!Util.isDefined(val)) {
            return val;
        }
        let result = val;
        if (!moment.isMoment(val)) {
            switch (valueType) {
                case 'string':
                case 'date':
                    if ((val instanceof Date) || typeof val === 'string') {
                        const dateString = moment(val).format('YYYY-MM-DDThh:mm') + 'Z';
                        const q = moment(dateString);
                        if (q.isValid()) {
                            result = q;
                        }
                        else {
                            result = undefined;
                        }
                    }
                    else {
                        result = undefined;
                    }
                    break;
                case 'timestamp':
                    if (typeof val === 'number') {
                        const dateString = moment.unix(val).format('YYYY-MM-DDThh:mm') + 'Z';
                        const t = moment(dateString);
                        if (t.isValid()) {
                            result = t;
                        }
                        else {
                            result = undefined;
                        }
                    }
                    else {
                        result = val;
                    }
                    break;
                case 'iso-8601':
                    const m = moment(val);
                    if (m.isValid()) {
                        result = m;
                    }
                    else {
                        result = undefined;
                    }
                    break;
                default:
                    break;
            }
        }
        if (!Util.isDefined(result)) {
            console.warn(`ODateRangeInputComponent value (${val}) is not consistent with value-type (${valueType})`);
        }
        return result;
    }
    set valueType(val) {
        this._valueType = Util.convertToODateValueType(val);
    }
    get valueType() {
        return this._valueType;
    }
}
ODateRangeInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-daterange-input',
                template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input #matInputRef matInput type=\"text\" o-daterange-input [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [required]=\"isRequired\" [placeholder]=\"placeHolder\" [readonly]=\"isReadOnly || !textInputEnabled\"\n      showDropdowns=\"true\" showCancel=\"true\" [showRanges]=\"showRanges\" \n      (datesUpdated)=\"datesUpdated($event)\" [oTouchUi]=\"oTouchUi\" [minDate]=\"oMinDate\" [maxDate]=\"oMaxDate\"\n      (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" (change)=\"onChangeEvent($event)\" [locale]=\"localeOptions\"  [separator]=\"separator\"\n      [startKey]=\"startKey\" [endKey]=\"endKey\" [showWeekNumbers]=\"showWeekNumbers\">\n    <button type=\"button\" matSuffix mat-icon-button (click)=\"openPicker()\" [disabled]=\"isReadOnly || !enabled\">\n      <mat-icon>today</mat-icon>\n    </button>\n\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\"\n      [disabled]=\"isReadOnly || !enabled\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('dateRange')\" text=\"{{ 'FORM_VALIDATION.DATERANGE_INVALID' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('dateRangeParse')\"\n      text=\"{{ 'FORM_VALIDATION.DATE_PARSE' | oTranslate }} : {{ getErrorValue('dateRangeParse', 'format') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('dateRangeMin')\"\n      text=\"{{ 'FORM_VALIDATION.DATERANGE_MIN' | oTranslate }} : {{ getErrorValue('dateRangeMin', 'dateMin') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('dateRangeMax')\"\n      text=\"{{ 'FORM_VALIDATION.DATERANGE_MAX' | oTranslate }} : {{ getErrorValue('dateRangeMax', 'dateMax') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                outputs: DEFAULT_OUTPUTS_O_DATERANGE_INPUT,
                inputs: DEFAULT_INPUTS_O_DATERANGE_INPUT,
                styles: [""]
            }] }
];
ODateRangeInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
ODateRangeInputComponent.propDecorators = {
    pickerDirective: [{ type: ViewChild, args: [ODaterangepickerDirective, { static: true },] }],
    matInputRef: [{ type: ViewChild, args: ['matInputRef', { read: ElementRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ODateRangeInputComponent.prototype, "textInputEnabled", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ODateRangeInputComponent.prototype, "showWeekNumbers", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ODateRangeInputComponent.prototype, "oTouchUi", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ODateRangeInputComponent.prototype, "showRanges", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2RhdGUtcmFuZ2Uvby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUVsQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBR3BGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbkYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHMUUsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUc7SUFDL0MsR0FBRyw0QkFBNEI7Q0FDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHO0lBQzlDLFdBQVc7SUFDWCxtQ0FBbUM7SUFDbkMsd0JBQXdC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QVU7WUFBc0IsUUFBUTs7OzhCQTRDekQsU0FBUyxTQUFDLHlCQUF5QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTswQkFHckQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7QUFJNUQ7SUFEQyxjQUFjLEVBQUU7O2tFQUN1QjtBQUd4QztJQURDLGNBQWMsRUFBRTs7aUVBQ3VCO0FBR3hDO0lBREMsY0FBYyxFQUFFOzswREFDZ0I7QUFHakM7SUFEQyxjQUFjLEVBQUU7OzREQUNrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCAqIGFzIF9tb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBNb21lbnRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbW9tZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT0RhdGVWYWx1ZVR5cGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLWRhdGUtdmFsdWUudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPVmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gJy4uLy4uL28tdmFsdWUtY2hhbmdlLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fREFURV9JTlBVVCB9IGZyb20gJy4uL2RhdGUtaW5wdXQvby1kYXRlLWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVUIH0gZnJvbSAnLi4vdGV4dC1pbnB1dC9vLXRleHQtaW5wdXQuY29tcG9uZW50JztcbmltcG9ydCB7IE9EYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUgfSBmcm9tICcuL28tZGF0ZXJhbmdlLWlucHV0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL28tZGF0ZXJhbmdlLXBpY2tlci5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fREFURVJBTkdFX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVUXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19EQVRFUkFOR0VfSU5QVVQgPSBbXG4gICdzZXBhcmF0b3InLFxuICAnc2hvd1dlZWtOdW1iZXJzOnNob3ctd2Vlay1udW1iZXJzJyxcbiAgJ3Nob3dSYW5nZXM6c2hvdy1yYW5nZXMnLFxuICAnb2xvY2FsZTpsb2NhbGUnLFxuICAnc3RhcnRLZXknLFxuICAnZW5kS2V5JyxcbiAgJ3ZhbHVlVHlwZTogdmFsdWUtdHlwZScsXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fREFURV9JTlBVVFxuXTtcblxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1kYXRlcmFuZ2UtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWRhdGVyYW5nZS1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19EQVRFUkFOR0VfSU5QVVQsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19EQVRFUkFOR0VfSU5QVVRcbn0pXG5leHBvcnQgY2xhc3MgT0RhdGVSYW5nZUlucHV0Q29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoT0RhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUgfSkgcGlja2VyRGlyZWN0aXZlOiBPRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlO1xuICBwaWNrZXIhOiBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQ7XG5cbiAgQFZpZXdDaGlsZCgnbWF0SW5wdXRSZWYnLCB7IHJlYWQ6IEVsZW1lbnRSZWYsIHN0YXRpYzogdHJ1ZSB9KVxuICBwcml2YXRlIG1hdElucHV0UmVmITogRWxlbWVudFJlZjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdGV4dElucHV0RW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBvVG91Y2hVaTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93UmFuZ2VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9vTWluRGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIGdldCBvTWluRGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb01pbkRhdGU7XG4gIH1cbiAgc2V0IG9NaW5EYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5fb01pbkRhdGUgPSBtb21lbnQodmFsdWUsIHRoaXMub2Zvcm1hdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX29NYXhEYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgZ2V0IG9NYXhEYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9vTWF4RGF0ZTtcbiAgfVxuICBzZXQgb01heERhdGUodmFsdWUpIHtcbiAgICB0aGlzLl9vTWF4RGF0ZSA9IG1vbWVudCh2YWx1ZSwgdGhpcy5vZm9ybWF0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfc3RhcnRLZXk6IHN0cmluZyA9ICdzdGFydERhdGUnO1xuICBnZXQgc3RhcnRLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0S2V5O1xuICB9XG4gIHNldCBzdGFydEtleSh2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXJ0S2V5ID0gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2VuZEtleTogc3RyaW5nID0gJ2VuZERhdGUnO1xuICBnZXQgZW5kS2V5KCkge1xuICAgIHJldHVybiB0aGlzLl9lbmRLZXk7XG4gIH1cbiAgc2V0IGVuZEtleSh2YWx1ZSkge1xuICAgIHRoaXMuX2VuZEtleSA9IHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF92YWx1ZVR5cGU6IE9EYXRlVmFsdWVUeXBlID0gJ3RpbWVzdGFtcCc7XG5cbiAgcHJvdGVjdGVkIF9zZXBhcmF0b3IgPSAnIC0gJztcbiAgZ2V0IHNlcGFyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VwYXJhdG9yO1xuICB9XG5cbiAgc2V0IHNlcGFyYXRvcih2YWx1ZSkge1xuICAgIHRoaXMuX3NlcGFyYXRvciA9IHZhbHVlO1xuICAgIGlmICh0aGlzLmdldEZvcm1Db250cm9sKCkgJiYgdGhpcy5nZXRGb3JtQ29udHJvbCgpLnZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2hvd0NsZWFyQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNsZWFyQnV0dG9uICYmICF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkICYmIHRoaXMubWF0SW5wdXRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIGdldCBsb2NhbGVPcHRpb25zKCkge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGVPcHRpb25zO1xuICB9XG5cbiAgcHVibGljIG9mb3JtYXQ6IHN0cmluZyA9ICdMJztcbiAgcHJvdGVjdGVkIF9sb2NhbGVPcHRpb25zOiBhbnk7XG4gIHByb3RlY3RlZCBvbG9jYWxlOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBtb21lbnRTcnY6IE1vbWVudFNlcnZpY2U7XG4gIHByaXZhdGUgb1RyYW5zbGF0ZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG5cblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgICB0aGlzLm9UcmFuc2xhdGUgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5tb21lbnRTcnYgPSB0aGlzLmluamVjdG9yLmdldChNb21lbnRTZXJ2aWNlKTtcbiAgICB0aGlzLl9sb2NhbGVPcHRpb25zID0ge1xuICAgICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICAgIHNlcGFyYXRvcjogJyAtICcsXG4gICAgICB3ZWVrTGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0RBVEVSQU5HRS5XJyksXG4gICAgICBhcHBseUxhYmVsOiB0aGlzLm9UcmFuc2xhdGUuZ2V0KCdEQVRFUkFOR0UuQVBQTFlMQUJFTCcpLFxuICAgICAgY2FuY2VsTGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0NBTkNFTCcpLFxuICAgICAgY3VzdG9tUmFuZ2VMYWJlbDogJ0N1c3RvbSByYW5nZScsXG4gICAgICBkYXlzT2ZXZWVrOiBtb21lbnQud2Vla2RheXNNaW4oKSxcbiAgICAgIG1vbnRoTmFtZXM6IG1vbWVudC5tb250aHNTaG9ydCgpLFxuICAgICAgZmlyc3REYXk6IG1vbWVudC5sb2NhbGVEYXRhKCkuZmlyc3REYXlPZldlZWsoKSxcbiAgICAgIGZvcm1hdDogJ0wnXG4gICAgfTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICBpZiAoIXRoaXMub2xvY2FsZSkge1xuICAgICAgdGhpcy5vbG9jYWxlID0gdGhpcy5tb21lbnRTcnYuZ2V0TG9jYWxlKCk7XG4gICAgICBtb21lbnQubG9jYWxlKHRoaXMub2xvY2FsZSk7XG5cbiAgICB9XG4gICAgaWYgKHRoaXMub2Zvcm1hdCkge1xuICAgICAgdGhpcy5fbG9jYWxlT3B0aW9ucy5mb3JtYXQgPSB0aGlzLm9mb3JtYXQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9wZW5QaWNrZXIoKSB7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUub3BlbigpO1xuICB9XG5cbiAgcHVibGljIG9uQ2hhbmdlRXZlbnQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGxldCBvYmplY3RWYWx1ZTtcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgY29uc3QgdmFsdWUgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgaWYgKHZhbHVlICE9PSAnJykge1xuICAgICAgICBvYmplY3RWYWx1ZSA9IHRoaXMuZ2V0RGF0ZVJhbmdlVG9TdHJpbmcodmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RWYWx1ZSA9IGV2ZW50O1xuICAgIH1cblxuICAgIHRoaXMuc2V0VmFsdWUob2JqZWN0VmFsdWUsIHtcbiAgICAgIGNoYW5nZVR5cGU6IE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFLFxuICAgICAgZW1pdEV2ZW50OiBmYWxzZSxcbiAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2VcbiAgICB9KTtcblxuICB9XG5cbiAgcHVibGljIHNldFZhbHVlKHZhbDogYW55LCBvcHRpb25zOiBGb3JtVmFsdWVPcHRpb25zID0ge30sIHNldERpcnR5OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBzdXBlci5zZXRWYWx1ZSh2YWwsIG9wdGlvbnMsIHNldERpcnR5KTtcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrQ2xlYXJWYWx1ZShlOiBFdmVudCk6IHZvaWQge1xuICAgIHN1cGVyLm9uQ2xpY2tDbGVhclZhbHVlKGUpO1xuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLmRhdGVzVXBkYXRlZC5lbWl0KCk7XG4gIH1cblxuICBkYXRlc1VwZGF0ZWQocmFuZ2UpIHtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS5jbG9zZSgpO1xuICAgIHRoaXMuc2V0VmFsdWUocmFuZ2UsXG4gICAgICB7XG4gICAgICAgIGNoYW5nZVR5cGU6IE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFLFxuICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlLFxuICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBzZXREYXRhKG5ld1ZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBzdXBlci5zZXREYXRhKG5ld1ZhbHVlKTtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS5kYXRlc1VwZGF0ZWQuZW1pdChuZXdWYWx1ZSk7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gIH1cblxuICB1cGRhdGVFbGVtZW50KCkge1xuICAgIGxldCBjaG9zZW5MYWJlbDogYW55O1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnZhbHVlLnZhbHVlKSAmJiAhdGhpcy5pc09iamVjdERhdGFSYW5nZU51bGwodGhpcy52YWx1ZSkpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLnN0YXJ0S2V5XSAmJiB0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLmVuZEtleV0pIHtcbiAgICAgICAgdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0gPSB0aGlzLmVuc3VyZURhdGVSYW5nZVZhbHVlKHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuc3RhcnRLZXldLCB0aGlzLl92YWx1ZVR5cGUpO1xuICAgICAgICB0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLmVuZEtleV0gID0gdGhpcy5lbnN1cmVEYXRlUmFuZ2VWYWx1ZSh0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLmVuZEtleV0sIHRoaXMuX3ZhbHVlVHlwZSk7XG4gICAgICAgIGNob3NlbkxhYmVsID0gdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0uZm9ybWF0KHRoaXMub2Zvcm1hdCkgK1xuICAgICAgICAgIHRoaXMuc2VwYXJhdG9yICsgdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldLmZvcm1hdCh0aGlzLm9mb3JtYXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hvc2VuTGFiZWwgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjaG9zZW5MYWJlbCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hvc2VuTGFiZWw7XG4gIH1cblxuXG4gIGdldERhdGVSYW5nZVRvU3RyaW5nKHZhbHVlVG9TdHJpbmc6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlID0ge307XG4gICAgY29uc3QgcmFuZ2UgPSB2YWx1ZVRvU3RyaW5nLnNwbGl0KHRoaXMuc2VwYXJhdG9yKTtcbiAgICB2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBtb21lbnQocmFuZ2VbMF0udHJpbSgpLCB0aGlzLm9mb3JtYXQpO1xuICAgIHZhbHVlW3RoaXMuX2VuZEtleV0gPSBtb21lbnQocmFuZ2VbMV0udHJpbSgpLCB0aGlzLm9mb3JtYXQpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG5cbiAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5yYW5nZURhdGVWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29NaW5EYXRlKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWluRGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29NYXhEYXRlKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4RGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5wYXJzZURhdGVWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBpc09iamVjdERhdGFSYW5nZU51bGwob2JqZWN0VmFsdWUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gb2JqZWN0VmFsdWUgIT09IG51bGwgJiYgb2JqZWN0VmFsdWUudmFsdWUgIT09IG51bGwgJiZcbiAgICAgICFVdGlsLmlzRGVmaW5lZChvYmplY3RWYWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0pICYmXG4gICAgICAhVXRpbC5pc0RlZmluZWQob2JqZWN0VmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XSk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCByYW5nZURhdGVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcblxuICAgIGlmICgoY29udHJvbC52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICYmICF0aGlzLmlzT2JqZWN0RGF0YVJhbmdlTnVsbChjb250cm9sKSAmJiBjb250cm9sLnZhbHVlW3RoaXMuX2VuZEtleV0uaXNTYW1lT3JCZWZvcmUoY29udHJvbC52YWx1ZVt0aGlzLl9zdGFydEtleV0pKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtaW5EYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgbWluZGF0ZSA9IG1vbWVudCh0aGlzLl9vTWluRGF0ZSk7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldLmlzQmVmb3JlKG1pbmRhdGUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VNaW46IHtcbiAgICAgICAgICBkYXRlTWluOiBtaW5kYXRlLmZvcm1hdCh0aGlzLm9mb3JtYXQpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXhEYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgbWF4ZGF0ZSA9IG1vbWVudCh0aGlzLl9vTWF4RGF0ZSk7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc0FmdGVyKG1heGRhdGUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VNYXg6IHtcbiAgICAgICAgICBkYXRlTWF4OiBtYXhkYXRlLmZvcm1hdCh0aGlzLm9mb3JtYXQpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuICBwcm90ZWN0ZWQgcGFyc2VEYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpXG4gICAgICAmJiAoKGNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldICYmICFjb250cm9sLnZhbHVlW3RoaXMuX3N0YXJ0S2V5XS5pc1ZhbGlkKCkpXG4gICAgICAgIHx8IChjb250cm9sLnZhbHVlW3RoaXMuX2VuZEtleV0gJiYgIWNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc1ZhbGlkKCkpKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0ZVJhbmdlUGFyc2U6IHtcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMub2Zvcm1hdCArIHRoaXMuX2xvY2FsZU9wdGlvbnMuc2VwYXJhdG9yICsgdGhpcy5vZm9ybWF0XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGVuc3VyZURhdGVSYW5nZVZhbHVlKHZhbDogYW55LCB2YWx1ZVR5cGU6IGFueSk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IHZhbDtcbiAgICBpZighbW9tZW50LmlzTW9tZW50KHZhbCkpIHtcbiAgICAgIHN3aXRjaCAodmFsdWVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgIGlmICggKHZhbCBpbnN0YW5jZW9mIERhdGUpIHx8IHR5cGVvZiB2YWwgPT09J3N0cmluZycgKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gbW9tZW50KHZhbCkuZm9ybWF0KCdZWVlZLU1NLUREVGhoOm1tJykgKyAnWic7XG4gICAgICAgICAgICBjb25zdCBxID0gbW9tZW50KGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKHEuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RpbWVzdGFtcCc6XG4gICAgICAgICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IG1vbWVudC51bml4KHZhbCkuZm9ybWF0KCdZWVlZLU1NLUREVGhoOm1tJykgKyAnWic7XG4gICAgICAgICAgICBjb25zdCB0ID0gbW9tZW50KGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKHQuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2lzby04NjAxJzpcbiAgICAgICAgICBjb25zdCBtID0gbW9tZW50KHZhbCk7XG4gICAgICAgICAgaWYgKG0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHJlc3VsdCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgT0RhdGVSYW5nZUlucHV0Q29tcG9uZW50IHZhbHVlICgke3ZhbH0pIGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdmFsdWUtdHlwZSAoJHt2YWx1ZVR5cGV9KWApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2V0IHZhbHVlVHlwZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlVHlwZSA9IFV0aWwuY29udmVydFRvT0RhdGVWYWx1ZVR5cGUodmFsKTtcbiAgfVxuXG4gIGdldCB2YWx1ZVR5cGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUeXBlO1xuICB9XG59XG4iXX0=