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
export var DEFAULT_INPUTS_O_HOUR_INPUT = tslib_1.__spread([
    'format',
    'textInputEnabled: text-input-enabled',
    'min',
    'max',
    'valueType: value-type'
], DEFAULT_INPUTS_O_FORM_DATA_COMPONENT);
export var DEFAULT_OUTPUTS_O_HOUR_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OHourInputComponent = (function (_super) {
    tslib_1.__extends(OHourInputComponent, _super);
    function OHourInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.textInputEnabled = true;
        _this._format = Codes.TWENTY_FOUR_HOUR_FORMAT;
        _this.onKeyboardInputDone = false;
        _this._valueType = 'timestamp';
        _this._defaultSQLTypeKey = 'TIMESTAMP';
        return _this;
    }
    OHourInputComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
        this.modifyPickerMethods();
    };
    OHourInputComponent.prototype.onKeyDown = function (e) {
        if (!Codes.isHourInputAllowed(e)) {
            e.preventDefault();
        }
    };
    OHourInputComponent.prototype.innerOnBlur = function (event) {
        if (this.onKeyboardInputDone) {
            this.updateValeOnInputChange(event);
        }
        _super.prototype.innerOnBlur.call(this, event);
    };
    OHourInputComponent.prototype.registerOnFormControlChange = function () {
    };
    Object.defineProperty(OHourInputComponent.prototype, "formatString", {
        get: function () {
            return (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? Codes.HourFormat.TWENTY_FOUR : Codes.HourFormat.TWELVE);
        },
        enumerable: true,
        configurable: true
    });
    OHourInputComponent.prototype.open = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        if (this.picker) {
            this.picker.open();
        }
    };
    OHourInputComponent.prototype.setTime = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var value = _super.prototype.getValue.call(this);
        this.picker.updateTime(value);
    };
    OHourInputComponent.prototype.setTimestampValue = function (value, options) {
        var parsedValue;
        var momentV = Util.isDefined(value) ? moment(value) : value;
        if (momentV && momentV.isValid()) {
            parsedValue = momentV.utcOffset(0).format(this.formatString);
        }
        this.setValue(parsedValue, options);
    };
    OHourInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT) {
            validators.push(OValidators.twentyFourHourFormatValidator);
        }
        else {
            validators.push(OValidators.twelveHourFormatValidator);
        }
        return validators;
    };
    OHourInputComponent.prototype.onFormControlChange = function (value) {
        if (this.oldValue === value) {
            return;
        }
        _super.prototype.onFormControlChange.call(this, value);
    };
    Object.defineProperty(OHourInputComponent.prototype, "format", {
        get: function () {
            return this._format;
        },
        set: function (val) {
            var old = this._format;
            var parsedVal = NumberConverter(val);
            if (parsedVal !== Codes.TWELVE_FOUR_HOUR_FORMAT && parsedVal !== Codes.TWENTY_FOUR_HOUR_FORMAT) {
                parsedVal = Codes.TWENTY_FOUR_HOUR_FORMAT;
            }
            this._format = parsedVal;
            if (parsedVal !== old) {
                this.updateValidators();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OHourInputComponent.prototype, "valueType", {
        get: function () {
            return this._valueType;
        },
        set: function (val) {
            this._valueType = this.convertToOHourValueType(val);
        },
        enumerable: true,
        configurable: true
    });
    OHourInputComponent.prototype.convertToOHourValueType = function (val) {
        var result = 'string';
        var lowerVal = (val || '').toLowerCase();
        if (lowerVal === 'string' || lowerVal === 'timestamp') {
            return lowerVal;
        }
        return result;
    };
    OHourInputComponent.prototype.onChangeEvent = function (arg) {
        this.onTimepickerChange(arg.target.value);
    };
    OHourInputComponent.prototype.onTimepickerChange = function (event) {
        var value = this.getValueAsString(event);
        this.setValue(value, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    };
    OHourInputComponent.prototype.modifyPickerMethods = function () {
        var _this = this;
        if (this.picker && this.picker.inputElement) {
            this.picker.inputElement.addEventListener('change', function () {
                _this.onKeyboardInputDone = true;
            });
        }
    };
    OHourInputComponent.prototype.ensureOFormValue = function (arg) {
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
        _super.prototype.ensureOFormValue.call(this, arg);
    };
    OHourInputComponent.prototype.updateValeOnInputChange = function (blurEvent) {
        if (this.onKeyboardInputDone) {
            var value = this.parseHour(blurEvent.currentTarget.value);
            this.setValue(value);
        }
        this.onKeyboardInputDone = false;
    };
    OHourInputComponent.prototype.parseHour = function (value) {
        var strArray = value.split(':');
        var hour = strArray[0];
        if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.format) {
            if (hour) {
                hour = parseInt(hour, 10);
                var period = hour <= 12 ? ' AM' : ' PM';
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
    };
    OHourInputComponent.prototype.emitOnValueChange = function (type, newValue, oldValue) {
        this.onChange.emit(newValue);
        _super.prototype.emitOnValueChange.call(this, type, newValue, oldValue);
    };
    OHourInputComponent.prototype.getValue = function () {
        var value = _super.prototype.getValue.call(this);
        if (this.valueType === 'timestamp') {
            var valueTimestamp = moment(value, this.formatString).valueOf();
            if (!isNaN(valueTimestamp)) {
                value = valueTimestamp;
            }
        }
        return value;
    };
    OHourInputComponent.prototype.getValueAsString = function (val) {
        var value;
        if (typeof val === 'number') {
            value = moment(val).format(this.formatString);
        }
        else {
            value = this.convertToFormatString(val);
        }
        return value;
    };
    OHourInputComponent.prototype.convertToFormatString = function (value) {
        if (value === '00:00' || !Util.isDefined(value)) {
            return value;
        }
        var formatStr = this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
        var result;
        if (typeof value === 'number') {
            result = moment(value).format(formatStr);
        }
        else {
            result = value ? moment(value, 'h:mm A').format(formatStr) : value;
        }
        return result;
    };
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
    OHourInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    OHourInputComponent.propDecorators = {
        picker: [{ type: ViewChild, args: ['picker', { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OHourInputComponent.prototype, "textInputEnabled", void 0);
    return OHourInputComponent;
}(OFormDataComponent));
export { OHourInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ob3VyLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9ob3VyLWlucHV0L28taG91ci1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV6RSxPQUFPLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRXRGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQy9ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUNMLG9DQUFvQyxFQUNwQyxxQ0FBcUMsRUFDckMsa0JBQWtCLEdBQ25CLE1BQU0sbUNBQW1DLENBQUM7QUFDM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFJckUsTUFBTSxDQUFDLElBQU0sMkJBQTJCO0lBQ3RDLFFBQVE7SUFDUixzQ0FBc0M7SUFDdEMsS0FBSztJQUNMLEtBQUs7SUFDTCx1QkFBdUI7R0FDcEIsb0NBQW9DLENBQ3hDLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSw0QkFBNEIsb0JBQ3BDLHFD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ICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBOZ3hNYXRlcmlhbFRpbWVwaWNrZXJDb21wb25lbnQgfSBmcm9tICduZ3gtbWF0ZXJpYWwtdGltZXBpY2tlcic7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyLCBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT1ZhbGlkYXRvcnMgfSBmcm9tICcuLi8uLi8uLi92YWxpZGF0b3JzL28tdmFsaWRhdG9ycyc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybVZhbHVlIH0gZnJvbSAnLi4vLi4vZm9ybS9PRm9ybVZhbHVlJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgT0Zvcm1EYXRhQ29tcG9uZW50LFxufSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5cbmV4cG9ydCB0eXBlIE9Ib3VyVmFsdWVUeXBlID0gJ3N0cmluZycgfCAndGltZXN0YW1wJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fSE9VUl9JTlBVVCA9IFtcbiAgJ2Zvcm1hdCcsXG4gICd0ZXh0SW5wdXRFbmFibGVkOiB0ZXh0LWlucHV0LWVuYWJsZWQnLFxuICAnbWluJyxcbiAgJ21heCcsXG4gICd2YWx1ZVR5cGU6IHZhbHVlLXR5cGUnLFxuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlRcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19IT1VSX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWhvdXItaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1ob3VyLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1ob3VyLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0hPVVJfSU5QVVQsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19IT1VSX0lOUFVULFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWhvdXItaW5wdXRdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0hvdXJJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHRleHRJbnB1dEVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgbWluOiBzdHJpbmc7XG4gIHB1YmxpYyBtYXg6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9mb3JtYXQ6IG51bWJlciA9IENvZGVzLlRXRU5UWV9GT1VSX0hPVVJfRk9STUFUO1xuICBwcm90ZWN0ZWQgb25LZXlib2FyZElucHV0RG9uZSA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3ZhbHVlVHlwZTogT0hvdXJWYWx1ZVR5cGUgPSAndGltZXN0YW1wJztcblxuICBAVmlld0NoaWxkKCdwaWNrZXInLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIHBpY2tlcjogTmd4TWF0ZXJpYWxUaW1lcGlja2VyQ29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2RlZmF1bHRTUUxUeXBlS2V5ID0gJ1RJTUVTVEFNUCc7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMubW9kaWZ5UGlja2VyTWV0aG9kcygpO1xuICB9XG5cbiAgcHVibGljIG9uS2V5RG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCFDb2Rlcy5pc0hvdXJJbnB1dEFsbG93ZWQoZSkpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5uZXJPbkJsdXIoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uS2V5Ym9hcmRJbnB1dERvbmUpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsZU9uSW5wdXRDaGFuZ2UoZXZlbnQpO1xuICAgIH1cbiAgICBzdXBlci5pbm5lck9uQmx1cihldmVudCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJPbkZvcm1Db250cm9sQ2hhbmdlKCk6IHZvaWQge1xuICAgIC8vIFRoaXMgY29tcG9uZW50IGRvZXMgbm90IG5lZWQgdGhpcyBzdWJzY3JpcHRpb25cbiAgfVxuXG4gIGdldCBmb3JtYXRTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gKHRoaXMuZm9ybWF0ID09PSBDb2Rlcy5UV0VOVFlfRk9VUl9IT1VSX0ZPUk1BVCA/IENvZGVzLkhvdXJGb3JtYXQuVFdFTlRZX0ZPVVIgOiBDb2Rlcy5Ib3VyRm9ybWF0LlRXRUxWRSk7XG4gIH1cblxuICBwdWJsaWMgb3BlbihlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZSkpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBpY2tlcikge1xuICAgICAgdGhpcy5waWNrZXIub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIHNldFRpbWUoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIC8vIGdldHRpbmcgdmFsdWUgZnJvbSBzdXBlciBzbyB3ZSBjYW4gYWx3YXlzIGdldCBhIHN0cmluZyB2YWx1ZVxuICAgIGNvbnN0IHZhbHVlID0gc3VwZXIuZ2V0VmFsdWUoKTtcbiAgICB0aGlzLnBpY2tlci51cGRhdGVUaW1lKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRUaW1lc3RhbXBWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucyk6IHZvaWQge1xuICAgIGxldCBwYXJzZWRWYWx1ZTtcbiAgICBjb25zdCBtb21lbnRWID0gVXRpbC5pc0RlZmluZWQodmFsdWUpID8gbW9tZW50KHZhbHVlKSA6IHZhbHVlO1xuICAgIGlmIChtb21lbnRWICYmIG1vbWVudFYuaXNWYWxpZCgpKSB7XG4gICAgICBwYXJzZWRWYWx1ZSA9IG1vbWVudFYudXRjT2Zmc2V0KDApLmZvcm1hdCh0aGlzLmZvcm1hdFN0cmluZyk7XG4gICAgfVxuICAgIHRoaXMuc2V0VmFsdWUocGFyc2VkVmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmICh0aGlzLmZvcm1hdCA9PT0gQ29kZXMuVFdFTlRZX0ZPVVJfSE9VUl9GT1JNQVQpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChPVmFsaWRhdG9ycy50d2VudHlGb3VySG91ckZvcm1hdFZhbGlkYXRvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChPVmFsaWRhdG9ycy50d2VsdmVIb3VyRm9ybWF0VmFsaWRhdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBwdWJsaWMgb25Gb3JtQ29udHJvbENoYW5nZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMub2xkVmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN1cGVyLm9uRm9ybUNvbnRyb2xDaGFuZ2UodmFsdWUpO1xuICB9XG5cbiAgc2V0IGZvcm1hdCh2YWw6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZCA9IHRoaXMuX2Zvcm1hdDtcbiAgICBsZXQgcGFyc2VkVmFsID0gTnVtYmVyQ29udmVydGVyKHZhbCk7XG4gICAgaWYgKHBhcnNlZFZhbCAhPT0gQ29kZXMuVFdFTFZFX0ZPVVJfSE9VUl9GT1JNQVQgJiYgcGFyc2VkVmFsICE9PSBDb2Rlcy5UV0VOVFlfRk9VUl9IT1VSX0ZPUk1BVCkge1xuICAgICAgcGFyc2VkVmFsID0gQ29kZXMuVFdFTlRZX0ZPVVJfSE9VUl9GT1JNQVQ7XG4gICAgfVxuICAgIHRoaXMuX2Zvcm1hdCA9IHBhcnNlZFZhbDtcbiAgICBpZiAocGFyc2VkVmFsICE9PSBvbGQpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsaWRhdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBmb3JtYXQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybWF0O1xuICB9XG5cbiAgc2V0IHZhbHVlVHlwZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlVHlwZSA9IHRoaXMuY29udmVydFRvT0hvdXJWYWx1ZVR5cGUodmFsKTtcbiAgfVxuXG4gIGdldCB2YWx1ZVR5cGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUeXBlO1xuICB9XG5cbiAgcHVibGljIGNvbnZlcnRUb09Ib3VyVmFsdWVUeXBlKHZhbDogYW55KTogT0hvdXJWYWx1ZVR5cGUge1xuICAgIGNvbnN0IHJlc3VsdDogT0hvdXJWYWx1ZVR5cGUgPSAnc3RyaW5nJztcbiAgICBjb25zdCBsb3dlclZhbCA9ICh2YWwgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGxvd2VyVmFsID09PSAnc3RyaW5nJyB8fCBsb3dlclZhbCA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgIHJldHVybiBsb3dlclZhbDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZUV2ZW50KGFyZzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vblRpbWVwaWNrZXJDaGFuZ2UoYXJnLnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgb25UaW1lcGlja2VyQ2hhbmdlKGV2ZW50OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWVBc1N0cmluZyhldmVudCk7XG4gICAgLyoqIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UgIGJlY2F1c2Ugb25DaGFuZ2UgZXZlbnQgaXMgdHJpZ2dlciBpbiBuZ01vZGVsQ2hhbmdlICovXG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSwge1xuICAgICAgY2hhbmdlVHlwZTogT1ZhbHVlQ2hhbmdlRXZlbnQuVVNFUl9DSEFOR0UsXG4gICAgICBlbWl0RXZlbnQ6IGZhbHNlLFxuICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1vZGlmeVBpY2tlck1ldGhvZHMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGlja2VyICYmIHRoaXMucGlja2VyLmlucHV0RWxlbWVudCkge1xuICAgICAgdGhpcy5waWNrZXIuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbktleWJvYXJkSW5wdXREb25lID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlbnN1cmVPRm9ybVZhbHVlKGFyZzogYW55KTogdm9pZCB7XG5cbiAgICBpZiAoYXJnICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlVHlwZSA9PT0gJ3RpbWVzdGFtcCcpIHtcbiAgICAgICAgLy8gYmVjYXVzZSBvZiB0aGUgbmd4LW1hdGVyaWFsLXRpbWVwaWNrZXIgZXNwZWNpZmljYXRpb24sIGl0cyBzdG9yZWQgdmFsdWUgbXVzdCBiZSBhbHdheXMgYSBzdHJpbmdcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgICAgICBhcmcudmFsdWUgPSB0aGlzLmdldFZhbHVlQXNTdHJpbmcoYXJnLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmcgPSB0aGlzLmdldFZhbHVlQXNTdHJpbmcoYXJnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5lbnN1cmVPRm9ybVZhbHVlKGFyZyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlVmFsZU9uSW5wdXRDaGFuZ2UoYmx1ckV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vbktleWJvYXJkSW5wdXREb25lKSB7XG4gICAgICAvLyBuZ3gtbWF0ZXJpYWwtdGltZXBpY2tlciBkb2VzIG5vdCBhbGxvdyB3cml0aW5nIGNoYXJhY3RlcnMgb24gaW5wdXQsIHNvIHdlIGFkZCAnQU0vUE0nIGluIG9yZGVyIHRvIG1ha2UgdmFsaWRhdGlvbiB3b3JrIHByb3Blcmx5XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMucGFyc2VIb3VyKGJsdXJFdmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcbiAgICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLm9uS2V5Ym9hcmRJbnB1dERvbmUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNlaXZlcyBhbiBob3VyIGlucHV0IGludHJvZHVjZWQgYnkgdGhlIHVzZXIgYW5kIHJldHVybnMgdGhlIGhvdXIgZm9ybWF0ZWQgYWNvcmRpbmcgY3VycmVudCBmb3JtYXRcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBwcm90ZWN0ZWQgcGFyc2VIb3VyKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0ckFycmF5ID0gdmFsdWUuc3BsaXQoJzonKTtcbiAgICBsZXQgaG91cjogYW55ID0gc3RyQXJyYXlbMF07XG5cbiAgICBpZiAoQ29kZXMuVFdFTFZFX0ZPVVJfSE9VUl9GT1JNQVQgPT09IHRoaXMuZm9ybWF0KSB7XG4gICAgICBpZiAoaG91cikge1xuICAgICAgICBob3VyID0gcGFyc2VJbnQoaG91ciwgMTApO1xuICAgICAgICBjb25zdCBwZXJpb2QgPSBob3VyIDw9IDEyID8gJyBBTScgOiAnIFBNJztcbiAgICAgICAgaWYgKGhvdXIgPiAxMikge1xuICAgICAgICAgIGhvdXIgPSBob3VyIC0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgc3RyQXJyYXlbMF0gPSBob3VyO1xuICAgICAgICB2YWx1ZSA9IHN0ckFycmF5LmpvaW4oJzonKSArIHBlcmlvZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKENvZGVzLlRXRU5UWV9GT1VSX0hPVVJfRk9STUFUID09PSB0aGlzLmZvcm1hdCkge1xuICAgICAgLy8gZG8gbm90aGluZ1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgZW1pdE9uVmFsdWVDaGFuZ2UodHlwZSwgbmV3VmFsdWUsIG9sZFZhbHVlKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZS5lbWl0KG5ld1ZhbHVlKTtcbiAgICBzdXBlci5lbWl0T25WYWx1ZUNoYW5nZSh0eXBlLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGdldFZhbHVlKCk6IGFueSB7XG4gICAgbGV0IHZhbHVlID0gc3VwZXIuZ2V0VmFsdWUoKTtcbiAgICBpZiAodGhpcy52YWx1ZVR5cGUgPT09ICd0aW1lc3RhbXAnKSB7XG4gICAgICBjb25zdCB2YWx1ZVRpbWVzdGFtcCA9IG1vbWVudCh2YWx1ZSwgdGhpcy5mb3JtYXRTdHJpbmcpLnZhbHVlT2YoKTtcbiAgICAgIGlmICghaXNOYU4odmFsdWVUaW1lc3RhbXApKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVUaW1lc3RhbXA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRWYWx1ZUFzU3RyaW5nKHZhbDogYW55KTogc3RyaW5nIHtcbiAgICBsZXQgdmFsdWU7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgICB2YWx1ZSA9IG1vbWVudCh2YWwpLmZvcm1hdCh0aGlzLmZvcm1hdFN0cmluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gdGhpcy5jb252ZXJ0VG9Gb3JtYXRTdHJpbmcodmFsKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnRUb0Zvcm1hdFN0cmluZyh2YWx1ZSk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlID09PSAnMDA6MDAnIHx8ICFVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgZm9ybWF0U3RyID0gdGhpcy5mb3JtYXQgPT09IENvZGVzLlRXRU5UWV9GT1VSX0hPVVJfRk9STUFUID8gJ0hIOm1tJyA6ICdoaDptbSBhJztcbiAgICBsZXQgcmVzdWx0O1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXN1bHQgPSBtb21lbnQodmFsdWUpLmZvcm1hdChmb3JtYXRTdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSB2YWx1ZSA/IG1vbWVudCh2YWx1ZSwgJ2g6bW0gQScpLmZvcm1hdChmb3JtYXRTdHIpIDogdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==