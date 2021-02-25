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
export var DEFAULT_OUTPUTS_O_DATERANGE_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_INPUT);
export var DEFAULT_INPUTS_O_DATERANGE_INPUT = tslib_1.__spread([
    'separator',
    'showWeekNumbers:show-week-numbers',
    'showRanges:show-ranges',
    'olocale:locale',
    'startKey',
    'endKey',
    'valueType: value-type'
], DEFAULT_INPUTS_O_DATE_INPUT);
var moment = _moment;
var ODateRangeInputComponent = (function (_super) {
    tslib_1.__extends(ODateRangeInputComponent, _super);
    function ODateRangeInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.textInputEnabled = true;
        _this.showWeekNumbers = false;
        _this.oTouchUi = false;
        _this.showRanges = false;
        _this._startKey = 'startDate';
        _this._endKey = 'endDate';
        _this._valueType = 'timestamp';
        _this._separator = ' - ';
        _this.oformat = 'L';
        _this.oTranslate = _this.injector.get(OTranslateService);
        _this.momentSrv = _this.injector.get(MomentService);
        _this._localeOptions = {
            direction: 'ltr',
            separator: ' - ',
            weekLabel: _this.oTranslate.get('DATERANGE.W'),
            applyLabel: _this.oTranslate.get('DATERANGE.APPLYLABEL'),
            cancelLabel: _this.oTranslate.get('CANCEL'),
            customRangeLabel: 'Custom range',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek(),
            format: 'L'
        };
        return _this;
    }
    Object.defineProperty(ODateRangeInputComponent.prototype, "oMinDate", {
        get: function () {
            return this._oMinDate;
        },
        set: function (value) {
            this._oMinDate = moment(value, this.oformat);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateRangeInputComponent.prototype, "oMaxDate", {
        get: function () {
            return this._oMaxDate;
        },
        set: function (value) {
            this._oMaxDate = moment(value, this.oformat);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateRangeInputComponent.prototype, "startKey", {
        get: function () {
            return this._startKey;
        },
        set: function (value) {
            this._startKey = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateRangeInputComponent.prototype, "endKey", {
        get: function () {
            return this._endKey;
        },
        set: function (value) {
            this._endKey = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateRangeInputComponent.prototype, "separator", {
        get: function () {
            return this._separator;
        },
        set: function (value) {
            this._separator = value;
            if (this.getFormControl() && this.getFormControl().value) {
                this.updateElement();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateRangeInputComponent.prototype, "showClearButton", {
        get: function () {
            return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateRangeInputComponent.prototype, "localeOptions", {
        get: function () {
            return this._localeOptions;
        },
        enumerable: true,
        configurable: true
    });
    ODateRangeInputComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (!this.olocale) {
            this.olocale = this.momentSrv.getLocale();
            moment.locale(this.olocale);
        }
        if (this.oformat) {
            this._localeOptions.format = this.oformat;
        }
    };
    ODateRangeInputComponent.prototype.openPicker = function () {
        this.pickerDirective.open();
    };
    ODateRangeInputComponent.prototype.onChangeEvent = function (event) {
        var objectValue;
        if (event instanceof Event) {
            var value = event.target.value;
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
    };
    ODateRangeInputComponent.prototype.setValue = function (val, options, setDirty) {
        if (options === void 0) { options = {}; }
        if (setDirty === void 0) { setDirty = false; }
        _super.prototype.setValue.call(this, val, options, setDirty);
        this.updateElement();
    };
    ODateRangeInputComponent.prototype.onClickClearValue = function (e) {
        _super.prototype.onClickClearValue.call(this, e);
        this.pickerDirective.value = undefined;
        this.pickerDirective.datesUpdated.emit();
    };
    ODateRangeInputComponent.prototype.datesUpdated = function (range) {
        this.pickerDirective.close();
        this.setValue(range, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    };
    ODateRangeInputComponent.prototype.setData = function (newValue) {
        _super.prototype.setData.call(this, newValue);
        this.pickerDirective.datesUpdated.emit(newValue);
        this.updateElement();
    };
    ODateRangeInputComponent.prototype.updateElement = function () {
        var chosenLabel;
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
    };
    ODateRangeInputComponent.prototype.getDateRangeToString = function (valueToString) {
        var value = {};
        var range = valueToString.split(this.separator);
        value[this._startKey] = moment(range[0].trim(), this.oformat);
        value[this._endKey] = moment(range[1].trim(), this.oformat);
        return value;
    };
    ODateRangeInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        validators.push(this.rangeDateValidator.bind(this));
        if (Util.isDefined(this._oMinDate)) {
            validators.push(this.minDateValidator.bind(this));
        }
        if (Util.isDefined(this._oMaxDate)) {
            validators.push(this.maxDateValidator.bind(this));
        }
        validators.push(this.parseDateValidator.bind(this));
        return validators;
    };
    ODateRangeInputComponent.prototype.isObjectDataRangeNull = function (objectValue) {
        return objectValue !== null && objectValue.value !== null &&
            !Util.isDefined(objectValue.value[this.pickerDirective.startKey]) &&
            !Util.isDefined(objectValue.value[this.pickerDirective.endKey]);
    };
    ODateRangeInputComponent.prototype.rangeDateValidator = function (control) {
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control) && control.value[this._endKey].isSameOrBefore(control.value[this._startKey])) {
            return {
                dateRange: true
            };
        }
        return {};
    };
    ODateRangeInputComponent.prototype.minDateValidator = function (control) {
        var mindate = moment(this._oMinDate);
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control) && control.value[this._startKey].isBefore(mindate)) {
            return {
                dateRangeMin: {
                    dateMin: mindate.format(this.oformat)
                }
            };
        }
        return {};
    };
    ODateRangeInputComponent.prototype.maxDateValidator = function (control) {
        var maxdate = moment(this._oMaxDate);
        if ((control.value instanceof Object)
            && !this.isObjectDataRangeNull(control) && control.value[this._endKey].isAfter(maxdate)) {
            return {
                dateRangeMax: {
                    dateMax: maxdate.format(this.oformat)
                }
            };
        }
        return {};
    };
    ODateRangeInputComponent.prototype.parseDateValidator = function (control) {
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
    };
    ODateRangeInputComponent.prototype.ensureDateRangeValue = function (val, valueType) {
        if (!Util.isDefined(val)) {
            return val;
        }
        var result = val;
        if (!moment.isMoment(val)) {
            switch (valueType) {
                case 'string':
                case 'date':
                    if ((val instanceof Date) || typeof val === 'string') {
                        var dateString = moment(val).format('YYYY-MM-DDThh:mm') + 'Z';
                        var q = moment(dateString);
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
                        var dateString = moment.unix(val).format('YYYY-MM-DDThh:mm') + 'Z';
                        var t = moment(dateString);
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
                    var m = moment(val);
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
            console.warn("ODateRangeInputComponent value (" + val + ") is not consistent with value-type (" + valueType + ")");
        }
        return result;
    };
    Object.defineProperty(ODateRangeInputComponent.prototype, "valueType", {
        get: function () {
            return this._valueType;
        },
        set: function (val) {
            this._valueType = Util.convertToODateValueType(val);
        },
        enumerable: true,
        configurable: true
    });
    ODateRangeInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-daterange-input',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input #matInputRef matInput type=\"text\" o-daterange-input [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [required]=\"isRequired\" [placeholder]=\"placeHolder\" [readonly]=\"isReadOnly || !textInputEnabled\"\n      showDropdowns=\"true\" showCancel=\"true\" [showRanges]=\"showRanges\" \n      (datesUpdated)=\"datesUpdated($event)\" [oTouchUi]=\"oTouchUi\" [minDate]=\"oMinDate\" [maxDate]=\"oMaxDate\"\n      (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" (change)=\"onChangeEvent($event)\" [locale]=\"localeOptions\"  [separator]=\"separator\"\n      [startKey]=\"startKey\" [endKey]=\"endKey\" [showWeekNumbers]=\"showWeekNumbers\">\n    <button type=\"button\" matSuffix mat-icon-button (click)=\"openPicker()\" [disabled]=\"isReadOnly || !enabled\">\n      <mat-icon>today</mat-icon>\n    </button>\n\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\"\n      [disabled]=\"isReadOnly || !enabled\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('dateRange')\" text=\"{{ 'FORM_VALIDATION.DATERANGE_INVALID' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('dateRangeParse')\"\n      text=\"{{ 'FORM_VALIDATION.DATE_PARSE' | oTranslate }} : {{ getErrorValue('dateRangeParse', 'format') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('dateRangeMin')\"\n      text=\"{{ 'FORM_VALIDATION.DATERANGE_MIN' | oTranslate }} : {{ getErrorValue('dateRangeMin', 'dateMin') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('dateRangeMax')\"\n      text=\"{{ 'FORM_VALIDATION.DATERANGE_MAX' | oTranslate }} : {{ getErrorValue('dateRangeMax', 'dateMax') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                    outputs: DEFAULT_OUTPUTS_O_DATERANGE_INPUT,
                    inputs: DEFAULT_INPUTS_O_DATERANGE_INPUT,
                    styles: [""]
                }] }
    ];
    ODateRangeInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
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
    return ODateRangeInputComponent;
}(OFormDataComponent));
export { ODateRangeInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2RhdGUtcmFuZ2Uvby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUVsQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBR3BGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbkYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHMUUsTUFBTSxDQUFDLElBQU0saUNBQWlDLG9CQUN6Qyw0QkFBNEIsQ0FDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLGdDQUFnQztJQUMzQyxXQUFXO0lBQ1gsbUNBQW1DO0lBQ25DLHdCQUF3QjtJQUN4QixnQkFBZ0I7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LDRpRkFBaUQ7b0JBRWpELE9BQU8sRUFBRSxpQ0FBaUM7b0JBQzFDLE1BQU0sRUFBRSxnQ0FBZ0M7O2lCQUN6Qzs7O2dCQS9CUSxjQUFjLHVCQW1IbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7Z0JBN0hwQyxVQUFVO2dCQUFzQixRQUFROzs7a0NBNEN6RCxTQUFTLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzhCQUdyRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQUk1RDtRQURDLGNBQWMsRUFBRTs7c0VBQ3VCO0lBR3hDO1FBREMsY0FBYyxFQUFFOztxRUFDdUI7SUFHeEM7UUFEQyxjQUFjLEVBQUU7OzhEQUNnQjtJQUdqQztRQURDLGNBQWMsRUFBRTs7Z0VBQ2tCO0lBbVRyQywrQkFBQztDQUFBLEFBNVVELENBTzhDLGtCQUFrQixHQXFVL0Q7U0FyVVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE1vbWVudFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9tb21lbnQuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPRGF0ZVZhbHVlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL28tZGF0ZS12YWx1ZS50eXBlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9WYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSAnLi4vLi4vby12YWx1ZS1jaGFuZ2UtZXZlbnQuY2xhc3MnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19EQVRFX0lOUFVUIH0gZnJvbSAnLi4vZGF0ZS1pbnB1dC9vLWRhdGUtaW5wdXQuY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVQgfSBmcm9tICcuLi90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0RhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZSB9IGZyb20gJy4vby1kYXRlcmFuZ2UtaW5wdXQuZGlyZWN0aXZlJztcbmltcG9ydCB7IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vby1kYXRlcmFuZ2UtcGlja2VyLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19EQVRFUkFOR0VfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0RBVEVSQU5HRV9JTlBVVCA9IFtcbiAgJ3NlcGFyYXRvcicsXG4gICdzaG93V2Vla051bWJlcnM6c2hvdy13ZWVrLW51bWJlcnMnLFxuICAnc2hvd1JhbmdlczpzaG93LXJhbmdlcycsXG4gICdvbG9jYWxlOmxvY2FsZScsXG4gICdzdGFydEtleScsXG4gICdlbmRLZXknLFxuICAndmFsdWVUeXBlOiB2YWx1ZS10eXBlJyxcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19EQVRFX0lOUFVUXG5dO1xuXG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWRhdGVyYW5nZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWRhdGVyYW5nZS1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZGF0ZXJhbmdlLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0RBVEVSQU5HRV9JTlBVVCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0RBVEVSQU5HRV9JTlBVVFxufSlcbmV4cG9ydCBjbGFzcyBPRGF0ZVJhbmdlSW5wdXRDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cbiAgQFZpZXdDaGlsZChPRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSB9KSBwaWNrZXJEaXJlY3RpdmU6IE9EYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmU7XG4gIHBpY2tlciE6IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudDtcblxuICBAVmlld0NoaWxkKCdtYXRJbnB1dFJlZicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIHByaXZhdGUgbWF0SW5wdXRSZWYhOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyB0ZXh0SW5wdXRFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2hvd1dlZWtOdW1iZXJzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIG9Ub3VjaFVpOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dSYW5nZXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX29NaW5EYXRlOiBfbW9tZW50Lk1vbWVudDtcbiAgZ2V0IG9NaW5EYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9vTWluRGF0ZTtcbiAgfVxuICBzZXQgb01pbkRhdGUodmFsdWUpIHtcbiAgICB0aGlzLl9vTWluRGF0ZSA9IG1vbWVudCh2YWx1ZSwgdGhpcy5vZm9ybWF0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfb01heERhdGU6IF9tb21lbnQuTW9tZW50O1xuICBnZXQgb01heERhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29NYXhEYXRlO1xuICB9XG4gIHNldCBvTWF4RGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX29NYXhEYXRlID0gbW9tZW50KHZhbHVlLCB0aGlzLm9mb3JtYXQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9zdGFydEtleTogc3RyaW5nID0gJ3N0YXJ0RGF0ZSc7XG4gIGdldCBzdGFydEtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRLZXk7XG4gIH1cbiAgc2V0IHN0YXJ0S2V5KHZhbHVlKSB7XG4gICAgdGhpcy5fc3RhcnRLZXkgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZW5kS2V5OiBzdHJpbmcgPSAnZW5kRGF0ZSc7XG4gIGdldCBlbmRLZXkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VuZEtleTtcbiAgfVxuICBzZXQgZW5kS2V5KHZhbHVlKSB7XG4gICAgdGhpcy5fZW5kS2V5ID0gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3ZhbHVlVHlwZTogT0RhdGVWYWx1ZVR5cGUgPSAndGltZXN0YW1wJztcblxuICBwcm90ZWN0ZWQgX3NlcGFyYXRvciA9ICcgLSAnO1xuICBnZXQgc2VwYXJhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXBhcmF0b3I7XG4gIH1cblxuICBzZXQgc2VwYXJhdG9yKHZhbHVlKSB7XG4gICAgdGhpcy5fc2VwYXJhdG9yID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuZ2V0Rm9ybUNvbnRyb2woKSAmJiB0aGlzLmdldEZvcm1Db250cm9sKCkudmFsdWUpIHtcbiAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaG93Q2xlYXJCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJCdXR0b24gJiYgIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQgJiYgdGhpcy5tYXRJbnB1dFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICB9XG5cbiAgZ2V0IGxvY2FsZU9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZU9wdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgb2Zvcm1hdDogc3RyaW5nID0gJ0wnO1xuICBwcm90ZWN0ZWQgX2xvY2FsZU9wdGlvbnM6IGFueTtcbiAgcHJvdGVjdGVkIG9sb2NhbGU6IHN0cmluZztcblxuICBwcml2YXRlIG1vbWVudFNydjogTW9tZW50U2VydmljZTtcbiAgcHJpdmF0ZSBvVHJhbnNsYXRlOiBPVHJhbnNsYXRlU2VydmljZTtcblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMub1RyYW5zbGF0ZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLm1vbWVudFNydiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1vbWVudFNlcnZpY2UpO1xuICAgIHRoaXMuX2xvY2FsZU9wdGlvbnMgPSB7XG4gICAgICBkaXJlY3Rpb246ICdsdHInLFxuICAgICAgc2VwYXJhdG9yOiAnIC0gJyxcbiAgICAgIHdlZWtMYWJlbDogdGhpcy5vVHJhbnNsYXRlLmdldCgnREFURVJBTkdFLlcnKSxcbiAgICAgIGFwcGx5TGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0RBVEVSQU5HRS5BUFBMWUxBQkVMJyksXG4gICAgICBjYW5jZWxMYWJlbDogdGhpcy5vVHJhbnNsYXRlLmdldCgnQ0FOQ0VMJyksXG4gICAgICBjdXN0b21SYW5nZUxhYmVsOiAnQ3VzdG9tIHJhbmdlJyxcbiAgICAgIGRheXNPZldlZWs6IG1vbWVudC53ZWVrZGF5c01pbigpLFxuICAgICAgbW9udGhOYW1lczogbW9tZW50Lm1vbnRoc1Nob3J0KCksXG4gICAgICBmaXJzdERheTogbW9tZW50LmxvY2FsZURhdGEoKS5maXJzdERheU9mV2VlaygpLFxuICAgICAgZm9ybWF0OiAnTCdcbiAgICB9O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIGlmICghdGhpcy5vbG9jYWxlKSB7XG4gICAgICB0aGlzLm9sb2NhbGUgPSB0aGlzLm1vbWVudFNydi5nZXRMb2NhbGUoKTtcbiAgICAgIG1vbWVudC5sb2NhbGUodGhpcy5vbG9jYWxlKTtcblxuICAgIH1cbiAgICBpZiAodGhpcy5vZm9ybWF0KSB7XG4gICAgICB0aGlzLl9sb2NhbGVPcHRpb25zLmZvcm1hdCA9IHRoaXMub2Zvcm1hdDtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb3BlblBpY2tlcigpIHtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS5vcGVuKCk7XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2VFdmVudChldmVudDogYW55KTogdm9pZCB7XG4gICAgbGV0IG9iamVjdFZhbHVlO1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIEV2ZW50KSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XG4gICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgIG9iamVjdFZhbHVlID0gdGhpcy5nZXREYXRlUmFuZ2VUb1N0cmluZyh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdFZhbHVlID0gZXZlbnQ7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRWYWx1ZShvYmplY3RWYWx1ZSwge1xuICAgICAgY2hhbmdlVHlwZTogT1ZhbHVlQ2hhbmdlRXZlbnQuVVNFUl9DSEFOR0UsXG4gICAgICBlbWl0RXZlbnQ6IGZhbHNlLFxuICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZVxuICAgIH0pO1xuXG4gIH1cblxuICBwdWJsaWMgc2V0VmFsdWUodmFsOiBhbnksIG9wdGlvbnM6IEZvcm1WYWx1ZU9wdGlvbnMgPSB7fSwgc2V0RGlydHk6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHN1cGVyLnNldFZhbHVlKHZhbCwgb3B0aW9ucywgc2V0RGlydHkpO1xuICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICB9XG5cbiAgcHVibGljIG9uQ2xpY2tDbGVhclZhbHVlKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIub25DbGlja0NsZWFyVmFsdWUoZSk7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUuZGF0ZXNVcGRhdGVkLmVtaXQoKTtcbiAgfVxuXG4gIGRhdGVzVXBkYXRlZChyYW5nZSkge1xuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLmNsb3NlKCk7XG4gICAgdGhpcy5zZXRWYWx1ZShyYW5nZSxcbiAgICAgIHtcbiAgICAgICAgY2hhbmdlVHlwZTogT1ZhbHVlQ2hhbmdlRXZlbnQuVVNFUl9DSEFOR0UsXG4gICAgICAgIGVtaXRFdmVudDogZmFsc2UsXG4gICAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2VcbiAgICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHNldERhdGEobmV3VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHN1cGVyLnNldERhdGEobmV3VmFsdWUpO1xuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLmRhdGVzVXBkYXRlZC5lbWl0KG5ld1ZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgfVxuXG4gIHVwZGF0ZUVsZW1lbnQoKSB7XG4gICAgbGV0IGNob3NlbkxhYmVsOiBhbnk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMudmFsdWUudmFsdWUpICYmICF0aGlzLmlzT2JqZWN0RGF0YVJhbmdlTnVsbCh0aGlzLnZhbHVlKSkge1xuICAgICAgaWYgKHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuc3RhcnRLZXldICYmIHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XSkge1xuICAgICAgICB0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLnN0YXJ0S2V5XSA9IHRoaXMuZW5zdXJlRGF0ZVJhbmdlVmFsdWUodGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0sIHRoaXMuX3ZhbHVlVHlwZSk7XG4gICAgICAgIHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XSAgPSB0aGlzLmVuc3VyZURhdGVSYW5nZVZhbHVlKHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XSwgdGhpcy5fdmFsdWVUeXBlKTtcbiAgICAgICAgY2hvc2VuTGFiZWwgPSB0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLnN0YXJ0S2V5XS5mb3JtYXQodGhpcy5vZm9ybWF0KSArXG4gICAgICAgICAgdGhpcy5zZXBhcmF0b3IgKyB0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLmVuZEtleV0uZm9ybWF0KHRoaXMub2Zvcm1hdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaG9zZW5MYWJlbCA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNob3NlbkxhYmVsID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBjaG9zZW5MYWJlbDtcbiAgfVxuXG5cbiAgZ2V0RGF0ZVJhbmdlVG9TdHJpbmcodmFsdWVUb1N0cmluZzogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFsdWUgPSB7fTtcbiAgICBjb25zdCByYW5nZSA9IHZhbHVlVG9TdHJpbmcuc3BsaXQodGhpcy5zZXBhcmF0b3IpO1xuICAgIHZhbHVlW3RoaXMuX3N0YXJ0S2V5XSA9IG1vbWVudChyYW5nZVswXS50cmltKCksIHRoaXMub2Zvcm1hdCk7XG4gICAgdmFsdWVbdGhpcy5fZW5kS2V5XSA9IG1vbWVudChyYW5nZVsxXS50cmltKCksIHRoaXMub2Zvcm1hdCk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcblxuICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLnJhbmdlRGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5fb01pbkRhdGUpKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5taW5EYXRlVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5fb01heERhdGUpKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5tYXhEYXRlVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLnBhcnNlRGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbiAgfVxuXG4gIGlzT2JqZWN0RGF0YVJhbmdlTnVsbChvYmplY3RWYWx1ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBvYmplY3RWYWx1ZSAhPT0gbnVsbCAmJiBvYmplY3RWYWx1ZS52YWx1ZSAhPT0gbnVsbCAmJlxuICAgICAgIVV0aWwuaXNEZWZpbmVkKG9iamVjdFZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLnN0YXJ0S2V5XSkgJiZcbiAgICAgICFVdGlsLmlzRGVmaW5lZChvYmplY3RWYWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldKTtcbiAgfVxuXG5cbiAgcHJvdGVjdGVkIHJhbmdlRGF0ZVZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuXG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc1NhbWVPckJlZm9yZShjb250cm9sLnZhbHVlW3RoaXMuX3N0YXJ0S2V5XSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGVSYW5nZTogdHJ1ZVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIG1pbkRhdGVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBjb25zdCBtaW5kYXRlID0gbW9tZW50KHRoaXMuX29NaW5EYXRlKTtcbiAgICBpZiAoKGNvbnRyb2wudmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgICAmJiAhdGhpcy5pc09iamVjdERhdGFSYW5nZU51bGwoY29udHJvbCkgJiYgY29udHJvbC52YWx1ZVt0aGlzLl9zdGFydEtleV0uaXNCZWZvcmUobWluZGF0ZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGVSYW5nZU1pbjoge1xuICAgICAgICAgIGRhdGVNaW46IG1pbmRhdGUuZm9ybWF0KHRoaXMub2Zvcm1hdClcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIG1heERhdGVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBjb25zdCBtYXhkYXRlID0gbW9tZW50KHRoaXMuX29NYXhEYXRlKTtcbiAgICBpZiAoKGNvbnRyb2wudmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgICAmJiAhdGhpcy5pc09iamVjdERhdGFSYW5nZU51bGwoY29udHJvbCkgJiYgY29udHJvbC52YWx1ZVt0aGlzLl9lbmRLZXldLmlzQWZ0ZXIobWF4ZGF0ZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRhdGVSYW5nZU1heDoge1xuICAgICAgICAgIGRhdGVNYXg6IG1heGRhdGUuZm9ybWF0KHRoaXMub2Zvcm1hdClcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIHByb3RlY3RlZCBwYXJzZURhdGVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBpZiAoKGNvbnRyb2wudmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgICAmJiAhdGhpcy5pc09iamVjdERhdGFSYW5nZU51bGwoY29udHJvbClcbiAgICAgICYmICgoY29udHJvbC52YWx1ZVt0aGlzLl9zdGFydEtleV0gJiYgIWNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldLmlzVmFsaWQoKSlcbiAgICAgICAgfHwgKGNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XSAmJiAhY29udHJvbC52YWx1ZVt0aGlzLl9lbmRLZXldLmlzVmFsaWQoKSkpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VQYXJzZToge1xuICAgICAgICAgIGZvcm1hdDogdGhpcy5vZm9ybWF0ICsgdGhpcy5fbG9jYWxlT3B0aW9ucy5zZXBhcmF0b3IgKyB0aGlzLm9mb3JtYXRcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZW5zdXJlRGF0ZVJhbmdlVmFsdWUodmFsOiBhbnksIHZhbHVlVHlwZTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gdmFsO1xuICAgIGlmKCFtb21lbnQuaXNNb21lbnQodmFsKSkge1xuICAgICAgc3dpdGNoICh2YWx1ZVR5cGUpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgICAgaWYgKCAodmFsIGluc3RhbmNlb2YgRGF0ZSkgfHwgdHlwZW9mIHZhbCA9PT0nc3RyaW5nJyApIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVTdHJpbmcgPSBtb21lbnQodmFsKS5mb3JtYXQoJ1lZWVktTU0tRERUaGg6bW0nKSArICdaJztcbiAgICAgICAgICAgIGNvbnN0IHEgPSBtb21lbnQoZGF0ZVN0cmluZyk7XG4gICAgICAgICAgICBpZiAocS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gcTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAndGltZXN0YW1wJzpcbiAgICAgICAgICBpZiAoIHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gbW9tZW50LnVuaXgodmFsKS5mb3JtYXQoJ1lZWVktTU0tRERUaGg6bW0nKSArICdaJztcbiAgICAgICAgICAgIGNvbnN0IHQgPSBtb21lbnQoZGF0ZVN0cmluZyk7XG4gICAgICAgICAgICBpZiAodC5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gdDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaXNvLTg2MDEnOlxuICAgICAgICAgIGNvbnN0IG0gPSBtb21lbnQodmFsKTtcbiAgICAgICAgICBpZiAobS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IG07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQocmVzdWx0KSkge1xuICAgICAgY29uc29sZS53YXJuKGBPRGF0ZVJhbmdlSW5wdXRDb21wb25lbnQgdmFsdWUgKCR7dmFsfSkgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB2YWx1ZS10eXBlICgke3ZhbHVlVHlwZX0pYCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBzZXQgdmFsdWVUeXBlKHZhbDogYW55KSB7XG4gICAgdGhpcy5fdmFsdWVUeXBlID0gVXRpbC5jb252ZXJ0VG9PRGF0ZVZhbHVlVHlwZSh2YWwpO1xuICB9XG5cbiAgZ2V0IHZhbHVlVHlwZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZVR5cGU7XG4gIH1cbn1cbiJdfQ==