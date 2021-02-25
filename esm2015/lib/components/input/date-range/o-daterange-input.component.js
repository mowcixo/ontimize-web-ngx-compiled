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
        if (!this.olocale) {
            this.olocale = this.momentSrv.getLocale();
            moment.locale(this.olocale);
        }
        this._localeOptions = {
            direction: 'ltr',
            separator: ' - ',
            weekLabel: this.oTranslate.get('DATERANGE.W'),
            applyLabel: this.oTranslate.get('DATERANGE.APPLYLABEL'),
            cancelLabel: this.oTranslate.get('CANCEL'),
            customRangeLabel: 'Custom range',
            daysOfWeek: moment.localeData().weekdaysMin(),
            monthNames: moment.localeData().monthsShort(),
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
        if (Util.isDefined(this.value) && Util.isDefined(this.value.value) && !this.isObjectDataRangeNull(this.value)) {
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
            this.pickerDirective.value = undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2RhdGUtcmFuZ2Uvby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUVsQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBR3BGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbkYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHMUUsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUc7SUFDL0MsR0FBRyw0QkFBNEI7Q0FDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHO0lBQzlDLFdBQVc7SUFDWCxtQ0FBbUM7SUFDbkMsd0JBQXdC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QUFpQztnQkFDMUMsTUFBTSxFQUFFLGdDQUFnQzs7YUFDekM7OztZQS9CUSxjQUFjLHVCQW1IbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBN0hwQyxVQUFVO1lBQXNCLFFBQVE7Ozs4QkE0Q3pELFNBQVMsU0FBQyx5QkFBeUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7MEJBR3JELFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0FBSTVEO0lBREMsY0FBYyxFQUFFOztrRUFDdUI7QUFHeEM7SUFEQyxjQUFjLEVBQUU7O2lFQUN1QjtBQUd4QztJQURDLGNBQWMsRUFBRTs7MERBQ2dCO0FBR2pDO0lBREMsY0FBYyxFQUFFOzs0REFDa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0LCBPcHRpb25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgTW9tZW50U2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL21vbWVudC5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9EYXRlVmFsdWVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1kYXRlLXZhbHVlLnR5cGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0RBVEVfSU5QVVQgfSBmcm9tICcuLi9kYXRlLWlucHV0L28tZGF0ZS1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVCB9IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1pbnB1dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1waWNrZXIuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0RBVEVSQU5HRV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fREFURVJBTkdFX0lOUFVUID0gW1xuICAnc2VwYXJhdG9yJyxcbiAgJ3Nob3dXZWVrTnVtYmVyczpzaG93LXdlZWstbnVtYmVycycsXG4gICdzaG93UmFuZ2VzOnNob3ctcmFuZ2VzJyxcbiAgJ29sb2NhbGU6bG9jYWxlJyxcbiAgJ3N0YXJ0S2V5JyxcbiAgJ2VuZEtleScsXG4gICd2YWx1ZVR5cGU6IHZhbHVlLXR5cGUnLFxuICAuLi5ERUZBVUxUX0lOUFVUU19PX0RBVEVfSU5QVVRcbl07XG5cbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZGF0ZXJhbmdlLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZGF0ZXJhbmdlLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fREFURVJBTkdFX0lOUFVULFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fREFURVJBTkdFX0lOUFVUXG59KVxuZXhwb3J0IGNsYXNzIE9EYXRlUmFuZ2VJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcblxuICBAVmlld0NoaWxkKE9EYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlIH0pIHBpY2tlckRpcmVjdGl2ZTogT0RhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZTtcbiAgcGlja2VyITogRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50O1xuXG4gIEBWaWV3Q2hpbGQoJ21hdElucHV0UmVmJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgcHJpdmF0ZSBtYXRJbnB1dFJlZiE6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHRleHRJbnB1dEVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93V2Vla051bWJlcnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb1RvdWNoVWk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2hvd1JhbmdlczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBfb01pbkRhdGU6IF9tb21lbnQuTW9tZW50O1xuICBnZXQgb01pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29NaW5EYXRlO1xuICB9XG4gIHNldCBvTWluRGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX29NaW5EYXRlID0gbW9tZW50KHZhbHVlLCB0aGlzLm9mb3JtYXQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9vTWF4RGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIGdldCBvTWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb01heERhdGU7XG4gIH1cbiAgc2V0IG9NYXhEYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5fb01heERhdGUgPSBtb21lbnQodmFsdWUsIHRoaXMub2Zvcm1hdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3N0YXJ0S2V5OiBzdHJpbmcgPSAnc3RhcnREYXRlJztcbiAgZ2V0IHN0YXJ0S2V5KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydEtleTtcbiAgfVxuICBzZXQgc3RhcnRLZXkodmFsdWUpIHtcbiAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcbiAgZ2V0IGVuZEtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5kS2V5O1xuICB9XG4gIHNldCBlbmRLZXkodmFsdWUpIHtcbiAgICB0aGlzLl9lbmRLZXkgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsdWVUeXBlOiBPRGF0ZVZhbHVlVHlwZSA9ICd0aW1lc3RhbXAnO1xuXG4gIHByb3RlY3RlZCBfc2VwYXJhdG9yID0gJyAtICc7XG4gIGdldCBzZXBhcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcGFyYXRvcjtcbiAgfVxuXG4gIHNldCBzZXBhcmF0b3IodmFsdWUpIHtcbiAgICB0aGlzLl9zZXBhcmF0b3IgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5nZXRGb3JtQ29udHJvbCgpICYmIHRoaXMuZ2V0Rm9ybUNvbnRyb2woKS52YWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNob3dDbGVhckJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jbGVhckJ1dHRvbiAmJiAhdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuZW5hYmxlZCAmJiB0aGlzLm1hdElucHV0UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBnZXQgbG9jYWxlT3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlT3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBvZm9ybWF0OiBzdHJpbmcgPSAnTCc7XG4gIHByb3RlY3RlZCBfbG9jYWxlT3B0aW9uczogYW55O1xuICBwcm90ZWN0ZWQgb2xvY2FsZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgbW9tZW50U3J2OiBNb21lbnRTZXJ2aWNlO1xuICBwcml2YXRlIG9UcmFuc2xhdGU6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5vVHJhbnNsYXRlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMubW9tZW50U3J2ID0gdGhpcy5pbmplY3Rvci5nZXQoTW9tZW50U2VydmljZSk7XG4gICAgaWYgKCF0aGlzLm9sb2NhbGUpIHtcbiAgICAgIHRoaXMub2xvY2FsZSA9IHRoaXMubW9tZW50U3J2LmdldExvY2FsZSgpO1xuICAgICAgbW9tZW50LmxvY2FsZSh0aGlzLm9sb2NhbGUpO1xuICAgIH1cbiAgICB0aGlzLl9sb2NhbGVPcHRpb25zID0ge1xuICAgICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICAgIHNlcGFyYXRvcjogJyAtICcsXG4gICAgICB3ZWVrTGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0RBVEVSQU5HRS5XJyksXG4gICAgICBhcHBseUxhYmVsOiB0aGlzLm9UcmFuc2xhdGUuZ2V0KCdEQVRFUkFOR0UuQVBQTFlMQUJFTCcpLFxuICAgICAgY2FuY2VsTGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0NBTkNFTCcpLFxuICAgICAgY3VzdG9tUmFuZ2VMYWJlbDogJ0N1c3RvbSByYW5nZScsXG4gICAgICBkYXlzT2ZXZWVrOiBtb21lbnQubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKCksXG4gICAgICBtb250aE5hbWVzOiBtb21lbnQubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KCksXG4gICAgICBmaXJzdERheTogbW9tZW50LmxvY2FsZURhdGEoKS5maXJzdERheU9mV2VlaygpLFxuICAgICAgZm9ybWF0OiAnTCdcbiAgICB9O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIGlmICh0aGlzLm9mb3JtYXQpIHtcbiAgICAgIHRoaXMuX2xvY2FsZU9wdGlvbnMuZm9ybWF0ID0gdGhpcy5vZm9ybWF0O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvcGVuUGlja2VyKCkge1xuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLm9wZW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZUV2ZW50KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgb2JqZWN0VmFsdWU7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgb2JqZWN0VmFsdWUgPSB0aGlzLmdldERhdGVSYW5nZVRvU3RyaW5nKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0VmFsdWUgPSBldmVudDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFZhbHVlKG9iamVjdFZhbHVlLCB7XG4gICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2UsXG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgfSk7XG5cbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZSh2YWw6IGFueSwgb3B0aW9uczogRm9ybVZhbHVlT3B0aW9ucyA9IHt9LCBzZXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgc3VwZXIuc2V0VmFsdWUodmFsLCBvcHRpb25zLCBzZXREaXJ0eSk7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0NsZWFyVmFsdWUoZTogRXZlbnQpOiB2b2lkIHtcbiAgICBzdXBlci5vbkNsaWNrQ2xlYXJWYWx1ZShlKTtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS5kYXRlc1VwZGF0ZWQuZW1pdCgpO1xuICB9XG5cbiAgZGF0ZXNVcGRhdGVkKHJhbmdlKSB7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUuY2xvc2UoKTtcbiAgICB0aGlzLnNldFZhbHVlKHJhbmdlLFxuICAgICAge1xuICAgICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgICAgZW1pdEV2ZW50OiBmYWxzZSxcbiAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZVxuICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGF0YShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgc3VwZXIuc2V0RGF0YShuZXdWYWx1ZSk7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUuZGF0ZXNVcGRhdGVkLmVtaXQobmV3VmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICB9XG5cbiAgdXBkYXRlRWxlbWVudCgpIHtcbiAgICBsZXQgY2hvc2VuTGFiZWw6IGFueTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy52YWx1ZSkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy52YWx1ZS52YWx1ZSkgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKHRoaXMudmFsdWUpKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0gJiYgdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldKSB7XG4gICAgICAgIHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuc3RhcnRLZXldID0gdGhpcy5lbnN1cmVEYXRlUmFuZ2VWYWx1ZSh0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLnN0YXJ0S2V5XSwgdGhpcy5fdmFsdWVUeXBlKTtcbiAgICAgICAgdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldICA9IHRoaXMuZW5zdXJlRGF0ZVJhbmdlVmFsdWUodGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldLCB0aGlzLl92YWx1ZVR5cGUpO1xuICAgICAgICBjaG9zZW5MYWJlbCA9IHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuc3RhcnRLZXldLmZvcm1hdCh0aGlzLm9mb3JtYXQpICtcbiAgICAgICAgICB0aGlzLnNlcGFyYXRvciArIHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XS5mb3JtYXQodGhpcy5vZm9ybWF0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNob3NlbkxhYmVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hvc2VuTGFiZWwgPSBudWxsO1xuICAgICAgdGhpcy5waWNrZXJEaXJlY3RpdmUudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hvc2VuTGFiZWw7XG4gIH1cblxuXG4gIGdldERhdGVSYW5nZVRvU3RyaW5nKHZhbHVlVG9TdHJpbmc6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlID0ge307XG4gICAgY29uc3QgcmFuZ2UgPSB2YWx1ZVRvU3RyaW5nLnNwbGl0KHRoaXMuc2VwYXJhdG9yKTtcbiAgICB2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBtb21lbnQocmFuZ2VbMF0udHJpbSgpLCB0aGlzLm9mb3JtYXQpO1xuICAgIHZhbHVlW3RoaXMuX2VuZEtleV0gPSBtb21lbnQocmFuZ2VbMV0udHJpbSgpLCB0aGlzLm9mb3JtYXQpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG5cbiAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5yYW5nZURhdGVWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29NaW5EYXRlKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWluRGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29NYXhEYXRlKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4RGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5wYXJzZURhdGVWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBpc09iamVjdERhdGFSYW5nZU51bGwob2JqZWN0VmFsdWUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gb2JqZWN0VmFsdWUgIT09IG51bGwgJiYgb2JqZWN0VmFsdWUudmFsdWUgIT09IG51bGwgJiZcbiAgICAgICFVdGlsLmlzRGVmaW5lZChvYmplY3RWYWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0pICYmXG4gICAgICAhVXRpbC5pc0RlZmluZWQob2JqZWN0VmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XSk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCByYW5nZURhdGVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcblxuICAgIGlmICgoY29udHJvbC52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICYmICF0aGlzLmlzT2JqZWN0RGF0YVJhbmdlTnVsbChjb250cm9sKSAmJiBjb250cm9sLnZhbHVlW3RoaXMuX2VuZEtleV0uaXNTYW1lT3JCZWZvcmUoY29udHJvbC52YWx1ZVt0aGlzLl9zdGFydEtleV0pKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtaW5EYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgbWluZGF0ZSA9IG1vbWVudCh0aGlzLl9vTWluRGF0ZSk7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldLmlzQmVmb3JlKG1pbmRhdGUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VNaW46IHtcbiAgICAgICAgICBkYXRlTWluOiBtaW5kYXRlLmZvcm1hdCh0aGlzLm9mb3JtYXQpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXhEYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgbWF4ZGF0ZSA9IG1vbWVudCh0aGlzLl9vTWF4RGF0ZSk7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc0FmdGVyKG1heGRhdGUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VNYXg6IHtcbiAgICAgICAgICBkYXRlTWF4OiBtYXhkYXRlLmZvcm1hdCh0aGlzLm9mb3JtYXQpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuICBwcm90ZWN0ZWQgcGFyc2VEYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpXG4gICAgICAmJiAoKGNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldICYmICFjb250cm9sLnZhbHVlW3RoaXMuX3N0YXJ0S2V5XS5pc1ZhbGlkKCkpXG4gICAgICAgIHx8IChjb250cm9sLnZhbHVlW3RoaXMuX2VuZEtleV0gJiYgIWNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc1ZhbGlkKCkpKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0ZVJhbmdlUGFyc2U6IHtcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMub2Zvcm1hdCArIHRoaXMuX2xvY2FsZU9wdGlvbnMuc2VwYXJhdG9yICsgdGhpcy5vZm9ybWF0XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGVuc3VyZURhdGVSYW5nZVZhbHVlKHZhbDogYW55LCB2YWx1ZVR5cGU6IGFueSk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IHZhbDtcbiAgICBpZighbW9tZW50LmlzTW9tZW50KHZhbCkpIHtcbiAgICAgIHN3aXRjaCAodmFsdWVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgIGlmICggKHZhbCBpbnN0YW5jZW9mIERhdGUpIHx8IHR5cGVvZiB2YWwgPT09J3N0cmluZycgKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gbW9tZW50KHZhbCkuZm9ybWF0KCdZWVlZLU1NLUREVGhoOm1tJykgKyAnWic7XG4gICAgICAgICAgICBjb25zdCBxID0gbW9tZW50KGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKHEuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RpbWVzdGFtcCc6XG4gICAgICAgICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IG1vbWVudC51bml4KHZhbCkuZm9ybWF0KCdZWVlZLU1NLUREVGhoOm1tJykgKyAnWic7XG4gICAgICAgICAgICBjb25zdCB0ID0gbW9tZW50KGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKHQuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2lzby04NjAxJzpcbiAgICAgICAgICBjb25zdCBtID0gbW9tZW50KHZhbCk7XG4gICAgICAgICAgaWYgKG0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHJlc3VsdCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgT0RhdGVSYW5nZUlucHV0Q29tcG9uZW50IHZhbHVlICgke3ZhbH0pIGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdmFsdWUtdHlwZSAoJHt2YWx1ZVR5cGV9KWApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2V0IHZhbHVlVHlwZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlVHlwZSA9IFV0aWwuY29udmVydFRvT0RhdGVWYWx1ZVR5cGUodmFsKTtcbiAgfVxuXG4gIGdldCB2YWx1ZVR5cGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUeXBlO1xuICB9XG59XG4iXX0=