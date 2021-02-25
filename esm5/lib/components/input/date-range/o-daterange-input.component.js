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
        if (!_this.olocale) {
            _this.olocale = _this.momentSrv.getLocale();
            moment.locale(_this.olocale);
        }
        _this._localeOptions = {
            direction: 'ltr',
            separator: ' - ',
            weekLabel: _this.oTranslate.get('DATERANGE.W'),
            applyLabel: _this.oTranslate.get('DATERANGE.APPLYLABEL'),
            cancelLabel: _this.oTranslate.get('CANCEL'),
            customRangeLabel: 'Custom range',
            daysOfWeek: moment.localeData().weekdaysMin(),
            monthNames: moment.localeData().monthsShort(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2RhdGUtcmFuZ2Uvby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1SCxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUVsQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBR3BGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbkYsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDcEYsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFHMUUsTUFBTSxDQUFDLElBQU0saUNBQWlDLG9CQUN6Qyw0QkFBNEIsQ0FDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLGdDQUFnQztJQUMzQyxXQUFXO0lBQ1gsbUNBQW1DO0lBQ25DLHdCQUF3QjtJQUN4QixnQkFBZ0I7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SUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEQsQ0FBQzs7O09BQUE7O2dCQXZVRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsNGlGQUFpRDtvQkFFakQsT0FBTyxFQUFFLGlDQUFpQztvQkFDMUMsTUFBTSxFQUFFLGdDQUFnQzs7aUJBQ3pDOzs7Z0JBL0JRLGNBQWMsdUJBbUhsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkE3SHBDLFVBQVU7Z0JBQXNCLFFBQVE7OztrQ0E0Q3pELFNBQVMsU0FBQyx5QkFBeUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7OEJBR3JELFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0lBSTVEO1FBREMsY0FBYyxFQUFFOztzRUFDdUI7SUFHeEM7UUFEQyxjQUFjLEVBQUU7O3FFQUN1QjtJQUd4QztRQURDLGNBQWMsRUFBRTs7OERBQ2dCO0lBR2pDO1FBREMsY0FBYyxFQUFFOztnRUFDa0I7SUFtVHJDLCtCQUFDO0NBQUEsQUE1VUQsQ0FPOEMsa0JBQWtCLEdBcVUvRDtTQXJVWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0LCBPcHRpb25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgTW9tZW50U2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL21vbWVudC5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9EYXRlVmFsdWVUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1kYXRlLXZhbHVlLnR5cGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0RBVEVfSU5QVVQgfSBmcm9tICcuLi9kYXRlLWlucHV0L28tZGF0ZS1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVCB9IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRGF0ZXJhbmdlcGlja2VyRGlyZWN0aXZlIH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1pbnB1dC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWRhdGVyYW5nZS1waWNrZXIuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0RBVEVSQU5HRV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fREFURVJBTkdFX0lOUFVUID0gW1xuICAnc2VwYXJhdG9yJyxcbiAgJ3Nob3dXZWVrTnVtYmVyczpzaG93LXdlZWstbnVtYmVycycsXG4gICdzaG93UmFuZ2VzOnNob3ctcmFuZ2VzJyxcbiAgJ29sb2NhbGU6bG9jYWxlJyxcbiAgJ3N0YXJ0S2V5JyxcbiAgJ2VuZEtleScsXG4gICd2YWx1ZVR5cGU6IHZhbHVlLXR5cGUnLFxuICAuLi5ERUZBVUxUX0lOUFVUU19PX0RBVEVfSU5QVVRcbl07XG5cbmNvbnN0IG1vbWVudCA9IF9tb21lbnQ7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZGF0ZXJhbmdlLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZGF0ZXJhbmdlLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1kYXRlcmFuZ2UtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fREFURVJBTkdFX0lOUFVULFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fREFURVJBTkdFX0lOUFVUXG59KVxuZXhwb3J0IGNsYXNzIE9EYXRlUmFuZ2VJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcblxuICBAVmlld0NoaWxkKE9EYXRlcmFuZ2VwaWNrZXJEaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlIH0pIHBpY2tlckRpcmVjdGl2ZTogT0RhdGVyYW5nZXBpY2tlckRpcmVjdGl2ZTtcbiAgcGlja2VyITogRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50O1xuXG4gIEBWaWV3Q2hpbGQoJ21hdElucHV0UmVmJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSlcbiAgcHJpdmF0ZSBtYXRJbnB1dFJlZiE6IEVsZW1lbnRSZWY7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHRleHRJbnB1dEVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93V2Vla051bWJlcnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb1RvdWNoVWk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2hvd1JhbmdlczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBfb01pbkRhdGU6IF9tb21lbnQuTW9tZW50O1xuICBnZXQgb01pbkRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29NaW5EYXRlO1xuICB9XG4gIHNldCBvTWluRGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX29NaW5EYXRlID0gbW9tZW50KHZhbHVlLCB0aGlzLm9mb3JtYXQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9vTWF4RGF0ZTogX21vbWVudC5Nb21lbnQ7XG4gIGdldCBvTWF4RGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb01heERhdGU7XG4gIH1cbiAgc2V0IG9NYXhEYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5fb01heERhdGUgPSBtb21lbnQodmFsdWUsIHRoaXMub2Zvcm1hdCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3N0YXJ0S2V5OiBzdHJpbmcgPSAnc3RhcnREYXRlJztcbiAgZ2V0IHN0YXJ0S2V5KCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFydEtleTtcbiAgfVxuICBzZXQgc3RhcnRLZXkodmFsdWUpIHtcbiAgICB0aGlzLl9zdGFydEtleSA9IHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lbmRLZXk6IHN0cmluZyA9ICdlbmREYXRlJztcbiAgZ2V0IGVuZEtleSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW5kS2V5O1xuICB9XG4gIHNldCBlbmRLZXkodmFsdWUpIHtcbiAgICB0aGlzLl9lbmRLZXkgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdmFsdWVUeXBlOiBPRGF0ZVZhbHVlVHlwZSA9ICd0aW1lc3RhbXAnO1xuXG4gIHByb3RlY3RlZCBfc2VwYXJhdG9yID0gJyAtICc7XG4gIGdldCBzZXBhcmF0b3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlcGFyYXRvcjtcbiAgfVxuXG4gIHNldCBzZXBhcmF0b3IodmFsdWUpIHtcbiAgICB0aGlzLl9zZXBhcmF0b3IgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5nZXRGb3JtQ29udHJvbCgpICYmIHRoaXMuZ2V0Rm9ybUNvbnRyb2woKS52YWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNob3dDbGVhckJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jbGVhckJ1dHRvbiAmJiAhdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuZW5hYmxlZCAmJiB0aGlzLm1hdElucHV0UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBnZXQgbG9jYWxlT3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlT3B0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyBvZm9ybWF0OiBzdHJpbmcgPSAnTCc7XG4gIHByb3RlY3RlZCBfbG9jYWxlT3B0aW9uczogYW55O1xuICBwcm90ZWN0ZWQgb2xvY2FsZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgbW9tZW50U3J2OiBNb21lbnRTZXJ2aWNlO1xuICBwcml2YXRlIG9UcmFuc2xhdGU6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5vVHJhbnNsYXRlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMubW9tZW50U3J2ID0gdGhpcy5pbmplY3Rvci5nZXQoTW9tZW50U2VydmljZSk7XG4gICAgaWYgKCF0aGlzLm9sb2NhbGUpIHtcbiAgICAgIHRoaXMub2xvY2FsZSA9IHRoaXMubW9tZW50U3J2LmdldExvY2FsZSgpO1xuICAgICAgbW9tZW50LmxvY2FsZSh0aGlzLm9sb2NhbGUpO1xuICAgIH1cbiAgICB0aGlzLl9sb2NhbGVPcHRpb25zID0ge1xuICAgICAgZGlyZWN0aW9uOiAnbHRyJyxcbiAgICAgIHNlcGFyYXRvcjogJyAtICcsXG4gICAgICB3ZWVrTGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0RBVEVSQU5HRS5XJyksXG4gICAgICBhcHBseUxhYmVsOiB0aGlzLm9UcmFuc2xhdGUuZ2V0KCdEQVRFUkFOR0UuQVBQTFlMQUJFTCcpLFxuICAgICAgY2FuY2VsTGFiZWw6IHRoaXMub1RyYW5zbGF0ZS5nZXQoJ0NBTkNFTCcpLFxuICAgICAgY3VzdG9tUmFuZ2VMYWJlbDogJ0N1c3RvbSByYW5nZScsXG4gICAgICBkYXlzT2ZXZWVrOiBtb21lbnQubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKCksXG4gICAgICBtb250aE5hbWVzOiBtb21lbnQubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KCksXG4gICAgICBmaXJzdERheTogbW9tZW50LmxvY2FsZURhdGEoKS5maXJzdERheU9mV2VlaygpLFxuICAgICAgZm9ybWF0OiAnTCdcbiAgICB9O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIGlmICh0aGlzLm9mb3JtYXQpIHtcbiAgICAgIHRoaXMuX2xvY2FsZU9wdGlvbnMuZm9ybWF0ID0gdGhpcy5vZm9ybWF0O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvcGVuUGlja2VyKCkge1xuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLm9wZW4oKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNoYW5nZUV2ZW50KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgb2JqZWN0VmFsdWU7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgb2JqZWN0VmFsdWUgPSB0aGlzLmdldERhdGVSYW5nZVRvU3RyaW5nKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0VmFsdWUgPSBldmVudDtcbiAgICB9XG5cbiAgICB0aGlzLnNldFZhbHVlKG9iamVjdFZhbHVlLCB7XG4gICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2UsXG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgfSk7XG5cbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZSh2YWw6IGFueSwgb3B0aW9uczogRm9ybVZhbHVlT3B0aW9ucyA9IHt9LCBzZXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgc3VwZXIuc2V0VmFsdWUodmFsLCBvcHRpb25zLCBzZXREaXJ0eSk7XG4gICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0NsZWFyVmFsdWUoZTogRXZlbnQpOiB2b2lkIHtcbiAgICBzdXBlci5vbkNsaWNrQ2xlYXJWYWx1ZShlKTtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnBpY2tlckRpcmVjdGl2ZS5kYXRlc1VwZGF0ZWQuZW1pdCgpO1xuICB9XG5cbiAgZGF0ZXNVcGRhdGVkKHJhbmdlKSB7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUuY2xvc2UoKTtcbiAgICB0aGlzLnNldFZhbHVlKHJhbmdlLFxuICAgICAge1xuICAgICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgICAgZW1pdEV2ZW50OiBmYWxzZSxcbiAgICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZVxuICAgICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGF0YShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgc3VwZXIuc2V0RGF0YShuZXdWYWx1ZSk7XG4gICAgdGhpcy5waWNrZXJEaXJlY3RpdmUuZGF0ZXNVcGRhdGVkLmVtaXQobmV3VmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICB9XG5cbiAgdXBkYXRlRWxlbWVudCgpIHtcbiAgICBsZXQgY2hvc2VuTGFiZWw6IGFueTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy52YWx1ZSkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy52YWx1ZS52YWx1ZSkgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKHRoaXMudmFsdWUpKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0gJiYgdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldKSB7XG4gICAgICAgIHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuc3RhcnRLZXldID0gdGhpcy5lbnN1cmVEYXRlUmFuZ2VWYWx1ZSh0aGlzLnZhbHVlLnZhbHVlW3RoaXMucGlja2VyRGlyZWN0aXZlLnN0YXJ0S2V5XSwgdGhpcy5fdmFsdWVUeXBlKTtcbiAgICAgICAgdGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldICA9IHRoaXMuZW5zdXJlRGF0ZVJhbmdlVmFsdWUodGhpcy52YWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5lbmRLZXldLCB0aGlzLl92YWx1ZVR5cGUpO1xuICAgICAgICBjaG9zZW5MYWJlbCA9IHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuc3RhcnRLZXldLmZvcm1hdCh0aGlzLm9mb3JtYXQpICtcbiAgICAgICAgICB0aGlzLnNlcGFyYXRvciArIHRoaXMudmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XS5mb3JtYXQodGhpcy5vZm9ybWF0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNob3NlbkxhYmVsID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hvc2VuTGFiZWwgPSBudWxsO1xuICAgICAgdGhpcy5waWNrZXJEaXJlY3RpdmUudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMucGlja2VyRGlyZWN0aXZlLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlID0gY2hvc2VuTGFiZWw7XG4gIH1cblxuXG4gIGdldERhdGVSYW5nZVRvU3RyaW5nKHZhbHVlVG9TdHJpbmc6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbHVlID0ge307XG4gICAgY29uc3QgcmFuZ2UgPSB2YWx1ZVRvU3RyaW5nLnNwbGl0KHRoaXMuc2VwYXJhdG9yKTtcbiAgICB2YWx1ZVt0aGlzLl9zdGFydEtleV0gPSBtb21lbnQocmFuZ2VbMF0udHJpbSgpLCB0aGlzLm9mb3JtYXQpO1xuICAgIHZhbHVlW3RoaXMuX2VuZEtleV0gPSBtb21lbnQocmFuZ2VbMV0udHJpbSgpLCB0aGlzLm9mb3JtYXQpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG5cbiAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5yYW5nZURhdGVWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29NaW5EYXRlKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWluRGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuX29NYXhEYXRlKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4RGF0ZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5wYXJzZURhdGVWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBpc09iamVjdERhdGFSYW5nZU51bGwob2JqZWN0VmFsdWUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gb2JqZWN0VmFsdWUgIT09IG51bGwgJiYgb2JqZWN0VmFsdWUudmFsdWUgIT09IG51bGwgJiZcbiAgICAgICFVdGlsLmlzRGVmaW5lZChvYmplY3RWYWx1ZS52YWx1ZVt0aGlzLnBpY2tlckRpcmVjdGl2ZS5zdGFydEtleV0pICYmXG4gICAgICAhVXRpbC5pc0RlZmluZWQob2JqZWN0VmFsdWUudmFsdWVbdGhpcy5waWNrZXJEaXJlY3RpdmUuZW5kS2V5XSk7XG4gIH1cblxuXG4gIHByb3RlY3RlZCByYW5nZURhdGVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcblxuICAgIGlmICgoY29udHJvbC52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICYmICF0aGlzLmlzT2JqZWN0RGF0YVJhbmdlTnVsbChjb250cm9sKSAmJiBjb250cm9sLnZhbHVlW3RoaXMuX2VuZEtleV0uaXNTYW1lT3JCZWZvcmUoY29udHJvbC52YWx1ZVt0aGlzLl9zdGFydEtleV0pKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtaW5EYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgbWluZGF0ZSA9IG1vbWVudCh0aGlzLl9vTWluRGF0ZSk7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldLmlzQmVmb3JlKG1pbmRhdGUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VNaW46IHtcbiAgICAgICAgICBkYXRlTWluOiBtaW5kYXRlLmZvcm1hdCh0aGlzLm9mb3JtYXQpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXhEYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgY29uc3QgbWF4ZGF0ZSA9IG1vbWVudCh0aGlzLl9vTWF4RGF0ZSk7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpICYmIGNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc0FmdGVyKG1heGRhdGUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkYXRlUmFuZ2VNYXg6IHtcbiAgICAgICAgICBkYXRlTWF4OiBtYXhkYXRlLmZvcm1hdCh0aGlzLm9mb3JtYXQpXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuICBwcm90ZWN0ZWQgcGFyc2VEYXRlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKChjb250cm9sLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgICAgJiYgIXRoaXMuaXNPYmplY3REYXRhUmFuZ2VOdWxsKGNvbnRyb2wpXG4gICAgICAmJiAoKGNvbnRyb2wudmFsdWVbdGhpcy5fc3RhcnRLZXldICYmICFjb250cm9sLnZhbHVlW3RoaXMuX3N0YXJ0S2V5XS5pc1ZhbGlkKCkpXG4gICAgICAgIHx8IChjb250cm9sLnZhbHVlW3RoaXMuX2VuZEtleV0gJiYgIWNvbnRyb2wudmFsdWVbdGhpcy5fZW5kS2V5XS5pc1ZhbGlkKCkpKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGF0ZVJhbmdlUGFyc2U6IHtcbiAgICAgICAgICBmb3JtYXQ6IHRoaXMub2Zvcm1hdCArIHRoaXMuX2xvY2FsZU9wdGlvbnMuc2VwYXJhdG9yICsgdGhpcy5vZm9ybWF0XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGVuc3VyZURhdGVSYW5nZVZhbHVlKHZhbDogYW55LCB2YWx1ZVR5cGU6IGFueSk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IHZhbDtcbiAgICBpZighbW9tZW50LmlzTW9tZW50KHZhbCkpIHtcbiAgICAgIHN3aXRjaCAodmFsdWVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgIGlmICggKHZhbCBpbnN0YW5jZW9mIERhdGUpIHx8IHR5cGVvZiB2YWwgPT09J3N0cmluZycgKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRlU3RyaW5nID0gbW9tZW50KHZhbCkuZm9ybWF0KCdZWVlZLU1NLUREVGhoOm1tJykgKyAnWic7XG4gICAgICAgICAgICBjb25zdCBxID0gbW9tZW50KGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKHEuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3RpbWVzdGFtcCc6XG4gICAgICAgICAgaWYgKCB0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uc3QgZGF0ZVN0cmluZyA9IG1vbWVudC51bml4KHZhbCkuZm9ybWF0KCdZWVlZLU1NLUREVGhoOm1tJykgKyAnWic7XG4gICAgICAgICAgICBjb25zdCB0ID0gbW9tZW50KGRhdGVTdHJpbmcpO1xuICAgICAgICAgICAgaWYgKHQuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHZhbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2lzby04NjAxJzpcbiAgICAgICAgICBjb25zdCBtID0gbW9tZW50KHZhbCk7XG4gICAgICAgICAgaWYgKG0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHJlc3VsdCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgT0RhdGVSYW5nZUlucHV0Q29tcG9uZW50IHZhbHVlICgke3ZhbH0pIGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdmFsdWUtdHlwZSAoJHt2YWx1ZVR5cGV9KWApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgc2V0IHZhbHVlVHlwZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlVHlwZSA9IFV0aWwuY29udmVydFRvT0RhdGVWYWx1ZVR5cGUodmFsKTtcbiAgfVxuXG4gIGdldCB2YWx1ZVR5cGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUeXBlO1xuICB9XG59XG4iXX0=