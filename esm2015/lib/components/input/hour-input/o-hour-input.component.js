import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import moment from 'moment';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { InputConverter, NumberConverter } from '../../../decorators/input-converter';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
export const DEFAULT_INPUTS_O_HOUR_INPUT = [
    'format',
    'textInputEnabled: text-input-enabled',
    'min',
    'max',
    'valueType: value-type',
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];
export const DEFAULT_OUTPUTS_O_HOUR_INPUT = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OHourInputComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.textInputEnabled = true;
        this._format = Codes.TWENTY_FOUR_HOUR_FORMAT;
        this.onKeyboardInputDone = false;
        this._valueType = 'timestamp';
        this._defaultSQLTypeKey = 'TIMESTAMP';
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.modifyPickerMethods();
    }
    onKeyDown(e) {
        if (!Codes.isHourInputAllowed(e)) {
            e.preventDefault();
        }
    }
    innerOnBlur(event) {
        if (this.onKeyboardInputDone) {
            this.updateValeOnInputChange(event);
        }
        super.innerOnBlur(event);
    }
    registerOnFormControlChange() {
    }
    get formatString() {
        return (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? Codes.HourFormat.TWENTY_FOUR : Codes.HourFormat.TWELVE);
    }
    open(e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        if (this.picker) {
            this.picker.open();
        }
    }
    setTime(event) {
        event.preventDefault();
        event.stopPropagation();
        const value = super.getValue();
        this.picker.updateTime(value);
    }
    setTimestampValue(value, options) {
        let parsedValue;
        const momentV = Util.isDefined(value) ? moment(value) : value;
        if (momentV && momentV.isValid()) {
            parsedValue = momentV.utcOffset(0).format(this.formatString);
        }
        this.setValue(parsedValue, options);
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT) {
            validators.push(OValidators.twentyFourHourFormatValidator);
        }
        else {
            validators.push(OValidators.twelveHourFormatValidator);
        }
        return validators;
    }
    onFormControlChange(value) {
        if (this.oldValue === value) {
            return;
        }
        super.onFormControlChange(value);
    }
    set format(val) {
        const old = this._format;
        let parsedVal = NumberConverter(val);
        if (parsedVal !== Codes.TWELVE_FOUR_HOUR_FORMAT && parsedVal !== Codes.TWENTY_FOUR_HOUR_FORMAT) {
            parsedVal = Codes.TWENTY_FOUR_HOUR_FORMAT;
        }
        this._format = parsedVal;
        if (parsedVal !== old) {
            this.updateValidators();
        }
    }
    get format() {
        return this._format;
    }
    set valueType(val) {
        this._valueType = this.convertToOHourValueType(val);
    }
    get valueType() {
        return this._valueType;
    }
    convertToOHourValueType(val) {
        const result = 'string';
        const lowerVal = (val || '').toLowerCase();
        if (lowerVal === 'string' || lowerVal === 'timestamp') {
            return lowerVal;
        }
        return result;
    }
    onChangeEvent(arg) {
        this.onTimepickerChange(arg.target.value);
    }
    onTimepickerChange(event) {
        const value = this.getValueAsString(event);
        this.setValue(value, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    }
    modifyPickerMethods() {
        if (this.picker && this.picker.inputElement) {
            this.picker.inputElement.addEventListener('change', () => {
                this.onKeyboardInputDone = true;
            });
        }
    }
    ensureOFormValue(arg) {
        if (arg != null) {
            if (this.valueType === 'timestamp') {
                if (arg instanceof OFormValue) {
                    arg.value = this.getValueAsString(arg.value);
                }
                else {
                    arg = this.getValueAsString(arg);
                }
            }
        }
        super.ensureOFormValue(arg);
    }
    updateValeOnInputChange(blurEvent) {
        if (this.onKeyboardInputDone) {
            const value = this.parseHour(blurEvent.currentTarget.value);
            this.setValue(value);
        }
        this.onKeyboardInputDone = false;
    }
    parseHour(value) {
        const strArray = value.split(':');
        let hour = strArray[0];
        if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.format) {
            if (hour) {
                hour = parseInt(hour, 10);
                const period = hour <= 12 ? ' AM' : ' PM';
                if (hour > 12) {
                    hour = hour - 12;
                }
                strArray[0] = hour;
                value = strArray.join(':') + period;
            }
        }
        else if (Codes.TWENTY_FOUR_HOUR_FORMAT === this.format) {
        }
        return value;
    }
    emitOnValueChange(type, newValue, oldValue) {
        this.onChange.emit(newValue);
        super.emitOnValueChange(type, newValue, oldValue);
    }
    getValue() {
        let value = super.getValue();
        if (this.valueType === 'timestamp') {
            const valueTimestamp = moment(value, this.formatString).valueOf();
            if (!isNaN(valueTimestamp)) {
                value = valueTimestamp;
            }
        }
        return value;
    }
    getValueAsString(val) {
        let value;
        if (typeof val === 'number') {
            value = moment(val).format(this.formatString);
        }
        else {
            value = this.convertToFormatString(val);
        }
        return value;
    }
    convertToFormatString(value) {
        if (value === '00:00' || !Util.isDefined(value)) {
            return value;
        }
        const formatStr = this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
        let result;
        if (typeof value === 'number') {
            result = moment(value).format(formatStr);
        }
        else {
            result = value ? moment(value, 'h:mm A').format(formatStr) : value;
        }
        return result;
    }
}
OHourInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-hour-input',
                template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" fxFill [hideRequiredMarker]=\"hideRequiredMarker\">\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput [ngxTimepicker]=\"picker\" [id]=\"getAttribute()\" [placeholder]=\"placeHolder\" [formControlName]=\"getAttribute()\"\n      [readonly]=\"isReadOnly || !textInputEnabled\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" [required]=\"isRequired\"\n      (change)=\"onChangeEvent($event)\" [min]=\"min\" [max]=\"max\" (keydown)=\"onKeyDown($event)\" [format]=\"format\" [disableClick]=\"true\">\n\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <button type=\"button\" matSuffix mat-icon-button [disabled]=\"isReadOnly || !enabled\" (click)=\"open($event)\">\n      <mat-icon ngxMaterialTimepickerToggleIcon svgIcon=\"ontimize:clock\"></mat-icon>\n    </button>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }} \"></mat-error>\n    <mat-error *ngIf=\"hasError('invalidFormatHour')\" text=\"{{ 'FORM_VALIDATION.HOUR_FORMAT' | oTranslate }} {{ formatString }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>\n\n<ngx-material-timepicker #picker (timeSet)=\"onTimepickerChange($event)\" [confirmBtnTmpl]=\"confirmBtn\" [cancelBtnTmpl]=\"cancelBtn\">\n</ngx-material-timepicker>\n\n<ng-template #confirmBtn>\n  <button mat-stroked-button type=\"button\"><span>{{'OK' | oTranslate}}</span></button>\n</ng-template>\n\n<ng-template #cancelBtn>\n  <button mat-stroked-button type=\"button\"><span>{{'CANCEL' | oTranslate}}</span></button>\n</ng-template>\n",
                encapsulation: ViewEncapsulation.None,
                outputs: DEFAULT_OUTPUTS_O_HOUR_INPUT,
                inputs: DEFAULT_INPUTS_O_HOUR_INPUT,
                host: {
                    '[class.o-hour-input]': 'true'
                },
                styles: ["button.mat-stroked-button{margin:0 6px}"]
            }] }
];
OHourInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
OHourInputComponent.propDecorators = {
    picker: [{ type: ViewChild, args: ['picker', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OHourInputComponent.prototype, "textInputEnabled", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ob3VyLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9ob3VyLWlucHV0L28taG91ci1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV6RSxPQUFPLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRXRGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUNMLG9DQUFvQyxFQUNwQyxxQ0FBcUMsRUFDckMsa0JBQWtCLEdBQ25CLE1BQU0sbUNBQW1DLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFJckUsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUc7SUFDekMsUUFBUTtJQUNSLHNDQUFzQztJQUN0QyxLQUFLO0lBQ0wsS0FBSztJQUNMLHVCQUF1QjtJQUN2QixHQUFHLG9DQUFvQztDQUN4QyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNEJBQTRC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QyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUN0RixJQUFJLE1BQU0sQ0FBQztRQUNYLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ3BFO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7O1lBblBGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsZ3BFQUE0QztnQkFFNUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLE9BQU8sRUFBRSw0QkFBNEI7Z0JBQ3JDLE1BQU0sRUFBRSwyQkFBMkI7Z0JBQ25DLElBQUksRUFBRTtvQkFDSixzQkFBc0IsRUFBRSxNQUFNO2lCQUMvQjs7YUFDRjs7O1lBbENRLGNBQWMsdUJBaURsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFuRXRELFVBQVU7WUFHVixRQUFROzs7cUJBNERQLFNBQVMsU0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQVB0QztJQURDLGNBQWMsRUFBRTs7NkRBQ3VCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgTmd4TWF0ZXJpYWxUaW1lcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnbmd4LW1hdGVyaWFsLXRpbWVwaWNrZXInO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciwgTnVtYmVyQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9WYWxpZGF0b3JzIH0gZnJvbSAnLi4vLi4vLi4vdmFsaWRhdG9ycy9vLXZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9WYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSAnLi4vLi4vby12YWx1ZS1jaGFuZ2UtZXZlbnQuY2xhc3MnO1xuXG5leHBvcnQgdHlwZSBPSG91clZhbHVlVHlwZSA9ICdzdHJpbmcnIHwgJ3RpbWVzdGFtcCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0hPVVJfSU5QVVQgPSBbXG4gICdmb3JtYXQnLFxuICAndGV4dElucHV0RW5hYmxlZDogdGV4dC1pbnB1dC1lbmFibGVkJyxcbiAgJ21pbicsXG4gICdtYXgnLFxuICAndmFsdWVUeXBlOiB2YWx1ZS10eXBlJyxcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fSE9VUl9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1ob3VyLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28taG91ci1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28taG91ci1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19IT1VSX0lOUFVULFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fSE9VUl9JTlBVVCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1ob3VyLWlucHV0XSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Ib3VySW5wdXRDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyB0ZXh0SW5wdXRFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIG1pbjogc3RyaW5nO1xuICBwdWJsaWMgbWF4OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfZm9ybWF0OiBudW1iZXIgPSBDb2Rlcy5UV0VOVFlfRk9VUl9IT1VSX0ZPUk1BVDtcbiAgcHJvdGVjdGVkIG9uS2V5Ym9hcmRJbnB1dERvbmUgPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF92YWx1ZVR5cGU6IE9Ib3VyVmFsdWVUeXBlID0gJ3RpbWVzdGFtcCc7XG5cbiAgQFZpZXdDaGlsZCgncGlja2VyJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBwaWNrZXI6IE5neE1hdGVyaWFsVGltZXBpY2tlckNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgICB0aGlzLl9kZWZhdWx0U1FMVHlwZUtleSA9ICdUSU1FU1RBTVAnO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICB0aGlzLm1vZGlmeVBpY2tlck1ldGhvZHMoKTtcbiAgfVxuXG4gIHB1YmxpYyBvbktleURvd24oZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghQ29kZXMuaXNIb3VySW5wdXRBbGxvd2VkKGUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlubmVyT25CbHVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vbktleWJvYXJkSW5wdXREb25lKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbGVPbklucHV0Q2hhbmdlKGV2ZW50KTtcbiAgICB9XG4gICAgc3VwZXIuaW5uZXJPbkJsdXIoZXZlbnQpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyT25Gb3JtQ29udHJvbENoYW5nZSgpOiB2b2lkIHtcbiAgICAvLyBUaGlzIGNvbXBvbmVudCBkb2VzIG5vdCBuZWVkIHRoaXMgc3Vic2NyaXB0aW9uXG4gIH1cblxuICBnZXQgZm9ybWF0U3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh0aGlzLmZvcm1hdCA9PT0gQ29kZXMuVFdFTlRZX0ZPVVJfSE9VUl9GT1JNQVQgPyBDb2Rlcy5Ib3VyRm9ybWF0LlRXRU5UWV9GT1VSIDogQ29kZXMuSG91ckZvcm1hdC5UV0VMVkUpO1xuICB9XG5cbiAgcHVibGljIG9wZW4oZT86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGUpKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgICBpZiAodGhpcy5waWNrZXIpIHtcbiAgICAgIHRoaXMucGlja2VyLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICBzZXRUaW1lKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyBnZXR0aW5nIHZhbHVlIGZyb20gc3VwZXIgc28gd2UgY2FuIGFsd2F5cyBnZXQgYSBzdHJpbmcgdmFsdWVcbiAgICBjb25zdCB2YWx1ZSA9IHN1cGVyLmdldFZhbHVlKCk7XG4gICAgdGhpcy5waWNrZXIudXBkYXRlVGltZSh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgc2V0VGltZXN0YW1wVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpOiB2b2lkIHtcbiAgICBsZXQgcGFyc2VkVmFsdWU7XG4gICAgY29uc3QgbW9tZW50ViA9IFV0aWwuaXNEZWZpbmVkKHZhbHVlKSA/IG1vbWVudCh2YWx1ZSkgOiB2YWx1ZTtcbiAgICBpZiAobW9tZW50ViAmJiBtb21lbnRWLmlzVmFsaWQoKSkge1xuICAgICAgcGFyc2VkVmFsdWUgPSBtb21lbnRWLnV0Y09mZnNldCgwKS5mb3JtYXQodGhpcy5mb3JtYXRTdHJpbmcpO1xuICAgIH1cbiAgICB0aGlzLnNldFZhbHVlKHBhcnNlZFZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICBpZiAodGhpcy5mb3JtYXQgPT09IENvZGVzLlRXRU5UWV9GT1VSX0hPVVJfRk9STUFUKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2goT1ZhbGlkYXRvcnMudHdlbnR5Rm91ckhvdXJGb3JtYXRWYWxpZGF0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2goT1ZhbGlkYXRvcnMudHdlbHZlSG91ckZvcm1hdFZhbGlkYXRvcik7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgcHVibGljIG9uRm9ybUNvbnRyb2xDaGFuZ2UodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9sZFZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzdXBlci5vbkZvcm1Db250cm9sQ2hhbmdlKHZhbHVlKTtcbiAgfVxuXG4gIHNldCBmb3JtYXQodmFsOiBudW1iZXIpIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLl9mb3JtYXQ7XG4gICAgbGV0IHBhcnNlZFZhbCA9IE51bWJlckNvbnZlcnRlcih2YWwpO1xuICAgIGlmIChwYXJzZWRWYWwgIT09IENvZGVzLlRXRUxWRV9GT1VSX0hPVVJfRk9STUFUICYmIHBhcnNlZFZhbCAhPT0gQ29kZXMuVFdFTlRZX0ZPVVJfSE9VUl9GT1JNQVQpIHtcbiAgICAgIHBhcnNlZFZhbCA9IENvZGVzLlRXRU5UWV9GT1VSX0hPVVJfRk9STUFUO1xuICAgIH1cbiAgICB0aGlzLl9mb3JtYXQgPSBwYXJzZWRWYWw7XG4gICAgaWYgKHBhcnNlZFZhbCAhPT0gb2xkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZm9ybWF0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2Zvcm1hdDtcbiAgfVxuXG4gIHNldCB2YWx1ZVR5cGUodmFsOiBhbnkpIHtcbiAgICB0aGlzLl92YWx1ZVR5cGUgPSB0aGlzLmNvbnZlcnRUb09Ib3VyVmFsdWVUeXBlKHZhbCk7XG4gIH1cblxuICBnZXQgdmFsdWVUeXBlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlVHlwZTtcbiAgfVxuXG4gIHB1YmxpYyBjb252ZXJ0VG9PSG91clZhbHVlVHlwZSh2YWw6IGFueSk6IE9Ib3VyVmFsdWVUeXBlIHtcbiAgICBjb25zdCByZXN1bHQ6IE9Ib3VyVmFsdWVUeXBlID0gJ3N0cmluZyc7XG4gICAgY29uc3QgbG93ZXJWYWwgPSAodmFsIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChsb3dlclZhbCA9PT0gJ3N0cmluZycgfHwgbG93ZXJWYWwgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICByZXR1cm4gbG93ZXJWYWw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2VFdmVudChhcmc6IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25UaW1lcGlja2VyQ2hhbmdlKGFyZy50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIG9uVGltZXBpY2tlckNoYW5nZShldmVudDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFZhbHVlQXNTdHJpbmcoZXZlbnQpO1xuICAgIC8qKiBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlICBiZWNhdXNlIG9uQ2hhbmdlIGV2ZW50IGlzIHRyaWdnZXIgaW4gbmdNb2RlbENoYW5nZSAqL1xuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUsIHtcbiAgICAgIGNoYW5nZVR5cGU6IE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFLFxuICAgICAgZW1pdEV2ZW50OiBmYWxzZSxcbiAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtb2RpZnlQaWNrZXJNZXRob2RzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBpY2tlciAmJiB0aGlzLnBpY2tlci5pbnB1dEVsZW1lbnQpIHtcbiAgICAgIHRoaXMucGlja2VyLmlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMub25LZXlib2FyZElucHV0RG9uZSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZW5zdXJlT0Zvcm1WYWx1ZShhcmc6IGFueSk6IHZvaWQge1xuXG4gICAgaWYgKGFyZyAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZVR5cGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICAgIC8vIGJlY2F1c2Ugb2YgdGhlIG5neC1tYXRlcmlhbC10aW1lcGlja2VyIGVzcGVjaWZpY2F0aW9uLCBpdHMgc3RvcmVkIHZhbHVlIG11c3QgYmUgYWx3YXlzIGEgc3RyaW5nXG4gICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICAgICAgYXJnLnZhbHVlID0gdGhpcy5nZXRWYWx1ZUFzU3RyaW5nKGFyZy52YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJnID0gdGhpcy5nZXRWYWx1ZUFzU3RyaW5nKGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIuZW5zdXJlT0Zvcm1WYWx1ZShhcmcpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVZhbGVPbklucHV0Q2hhbmdlKGJsdXJFdmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMub25LZXlib2FyZElucHV0RG9uZSkge1xuICAgICAgLy8gbmd4LW1hdGVyaWFsLXRpbWVwaWNrZXIgZG9lcyBub3QgYWxsb3cgd3JpdGluZyBjaGFyYWN0ZXJzIG9uIGlucHV0LCBzbyB3ZSBhZGQgJ0FNL1BNJyBpbiBvcmRlciB0byBtYWtlIHZhbGlkYXRpb24gd29yayBwcm9wZXJseVxuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnBhcnNlSG91cihibHVyRXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG4gICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5vbktleWJvYXJkSW5wdXREb25lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVjZWl2ZXMgYW4gaG91ciBpbnB1dCBpbnRyb2R1Y2VkIGJ5IHRoZSB1c2VyIGFuZCByZXR1cm5zIHRoZSBob3VyIGZvcm1hdGVkIGFjb3JkaW5nIGN1cnJlbnQgZm9ybWF0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgcHJvdGVjdGVkIHBhcnNlSG91cih2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdHJBcnJheSA9IHZhbHVlLnNwbGl0KCc6Jyk7XG4gICAgbGV0IGhvdXI6IGFueSA9IHN0ckFycmF5WzBdO1xuXG4gICAgaWYgKENvZGVzLlRXRUxWRV9GT1VSX0hPVVJfRk9STUFUID09PSB0aGlzLmZvcm1hdCkge1xuICAgICAgaWYgKGhvdXIpIHtcbiAgICAgICAgaG91ciA9IHBhcnNlSW50KGhvdXIsIDEwKTtcbiAgICAgICAgY29uc3QgcGVyaW9kID0gaG91ciA8PSAxMiA/ICcgQU0nIDogJyBQTSc7XG4gICAgICAgIGlmIChob3VyID4gMTIpIHtcbiAgICAgICAgICBob3VyID0gaG91ciAtIDEyO1xuICAgICAgICB9XG4gICAgICAgIHN0ckFycmF5WzBdID0gaG91cjtcbiAgICAgICAgdmFsdWUgPSBzdHJBcnJheS5qb2luKCc6JykgKyBwZXJpb2Q7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChDb2Rlcy5UV0VOVFlfRk9VUl9IT1VSX0ZPUk1BVCA9PT0gdGhpcy5mb3JtYXQpIHtcbiAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGVtaXRPblZhbHVlQ2hhbmdlKHR5cGUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UuZW1pdChuZXdWYWx1ZSk7XG4gICAgc3VwZXIuZW1pdE9uVmFsdWVDaGFuZ2UodHlwZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZSgpOiBhbnkge1xuICAgIGxldCB2YWx1ZSA9IHN1cGVyLmdldFZhbHVlKCk7XG4gICAgaWYgKHRoaXMudmFsdWVUeXBlID09PSAndGltZXN0YW1wJykge1xuICAgICAgY29uc3QgdmFsdWVUaW1lc3RhbXAgPSBtb21lbnQodmFsdWUsIHRoaXMuZm9ybWF0U3RyaW5nKS52YWx1ZU9mKCk7XG4gICAgICBpZiAoIWlzTmFOKHZhbHVlVGltZXN0YW1wKSkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlVGltZXN0YW1wO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0VmFsdWVBc1N0cmluZyh2YWw6IGFueSk6IHN0cmluZyB7XG4gICAgbGV0IHZhbHVlO1xuICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUgPSBtb21lbnQodmFsKS5mb3JtYXQodGhpcy5mb3JtYXRTdHJpbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IHRoaXMuY29udmVydFRvRm9ybWF0U3RyaW5nKHZhbCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjb252ZXJ0VG9Gb3JtYXRTdHJpbmcodmFsdWUpOiBzdHJpbmcge1xuICAgIGlmICh2YWx1ZSA9PT0gJzAwOjAwJyB8fCAhVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGNvbnN0IGZvcm1hdFN0ciA9IHRoaXMuZm9ybWF0ID09PSBDb2Rlcy5UV0VOVFlfRk9VUl9IT1VSX0ZPUk1BVCA/ICdISDptbScgOiAnaGg6bW0gYSc7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgcmVzdWx0ID0gbW9tZW50KHZhbHVlKS5mb3JtYXQoZm9ybWF0U3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gdmFsdWUgPyBtb21lbnQodmFsdWUsICdoOm1tIEEnKS5mb3JtYXQoZm9ybWF0U3RyKSA6IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=