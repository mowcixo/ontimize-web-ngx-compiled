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
export var DEFAULT_OUTPUTS_O_DATE_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_INPUT);
export var DEFAULT_INPUTS_O_DATE_INPUT = tslib_1.__spread([
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
    'dateClass: date-class'
], DEFAULT_INPUTS_O_TEXT_INPUT);
var ODateInputComponent = (function (_super) {
    tslib_1.__extends(ODateInputComponent, _super);
    function ODateInputComponent(form, dateAdapter, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.textInputEnabled = true;
        _this._oformat = 'L';
        _this.updateLocaleOnChange = false;
        _this.oStartView = 'month';
        _this._valueType = 'timestamp';
        _this.momentDateAdapter = dateAdapter;
        _this._defaultSQLTypeKey = 'DATE';
        _this.momentSrv = _this.injector.get(MomentService);
        _this.media = _this.injector.get(MediaObserver);
        return _this;
    }
    ODateInputComponent.prototype.ngOnInit = function () {
        var _this = this;
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
            var date = new Date(this.oMinDate);
            var momentD = moment(date);
            if (momentD.isValid()) {
                this.datepickerInput.min = date;
                this.minDateString = momentD.format(this.oformat);
            }
        }
        if (this.oMaxDate) {
            var date = new Date(this.oMaxDate);
            var momentD = moment(date);
            if (momentD.isValid()) {
                this.datepickerInput.max = date;
                this.maxDateString = momentD.format(this.oformat);
            }
        }
        if (this.updateLocaleOnChange) {
            this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(function () {
                _this.momentDateAdapter.setLocale(_this.translateService.getCurrentLang());
                _this.setValue(_this.getValue());
            });
        }
        this.subscribeToMediaChanges();
    };
    ODateInputComponent.prototype.subscribeToMediaChanges = function () {
        var _this = this;
        this.mediaSubscription = this.media.asObservable().subscribe(function (change) {
            if (['xs', 'sm'].indexOf(change[0].mqAlias) !== -1) {
                _this.touchUi = Util.isDefined(_this.oTouchUi) ? _this.oTouchUi : true;
            }
            if (['md', 'lg', 'xl'].indexOf(change[0].mqAlias) !== -1) {
                _this.touchUi = Util.isDefined(_this.oTouchUi) ? _this.oTouchUi : false;
            }
        });
    };
    ODateInputComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.mediaSubscription) {
            this.mediaSubscription.unsubscribe();
        }
        if (this.onLanguageChangeSubscription) {
            this.onLanguageChangeSubscription.unsubscribe();
        }
    };
    ODateInputComponent.prototype.getValueAsDate = function () {
        return this.dateValue;
    };
    ODateInputComponent.prototype.getValue = function () {
        var timestampValue = _super.prototype.getValue.call(this);
        if (timestampValue && timestampValue instanceof Date) {
            timestampValue = timestampValue.getTime();
        }
        return timestampValue;
    };
    Object.defineProperty(ODateInputComponent.prototype, "showClearButton", {
        get: function () {
            return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
        },
        enumerable: true,
        configurable: true
    });
    ODateInputComponent.prototype.open = function () {
        if (!this.isReadOnly && this.enabled) {
            this.datepicker.open();
        }
    };
    ODateInputComponent.prototype.onChangeEvent = function (event) {
        var isValid = event.value && event.value.isValid && event.value.isValid();
        var val = isValid ? event.value.valueOf() : event.value;
        var m = moment(val);
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
    };
    ODateInputComponent.prototype.onClickInput = function (e) {
        if (!this.textInputEnabled) {
            this.open();
        }
    };
    Object.defineProperty(ODateInputComponent.prototype, "filterDate", {
        get: function () {
            return this._filterDate;
        },
        set: function (val) {
            this._filterDate = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateInputComponent.prototype, "dateClass", {
        get: function () {
            return this._dateClass;
        },
        set: function (val) {
            this._dateClass = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateInputComponent.prototype, "oformat", {
        get: function () {
            return this._oformat;
        },
        set: function (val) {
            this._oformat = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateInputComponent.prototype, "minDateString", {
        get: function () {
            return this._minDateString;
        },
        set: function (val) {
            this._minDateString = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateInputComponent.prototype, "maxDateString", {
        get: function () {
            return this._maxDateString;
        },
        set: function (val) {
            this._maxDateString = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODateInputComponent.prototype, "touchUi", {
        get: function () {
            return this.oTouchUi || false;
        },
        set: function (val) {
            this.oTouchUi = val;
            this.datepicker.touchUi = this.touchUi;
        },
        enumerable: true,
        configurable: true
    });
    ODateInputComponent.prototype.ensureODateValueType = function (val) {
        if (!Util.isDefined(val)) {
            return val;
        }
        var result = val;
        switch (this.valueType) {
            case 'string':
                if (typeof val === 'string') {
                    var m = moment(val, this.oformat);
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
                    var acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
                    if (acceptTimestamp) {
                        this.dateValue = new Date(val);
                    }
                    else {
                        result = undefined;
                    }
                }
                else {
                    var m = moment(val);
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
            console.warn("ODateInputComponent value (" + val + ") is not consistent with value-type (" + this.valueType + ")");
        }
        return result;
    };
    ODateInputComponent.prototype.setFormValue = function (val, options, setDirty) {
        if (setDirty === void 0) { setDirty = false; }
        var value = val;
        if (val instanceof OFormValue) {
            value = val.value;
        }
        this.ensureODateValueType(value);
        _super.prototype.setFormValue.call(this, value, options, setDirty);
    };
    Object.defineProperty(ODateInputComponent.prototype, "valueType", {
        get: function () {
            return this._valueType;
        },
        set: function (val) {
            this._valueType = Util.convertToODateValueType(val);
        },
        enumerable: true,
        configurable: true
    });
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
    ODateInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: DateAdapter },
        { type: ElementRef },
        { type: Injector }
    ]; };
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
    return ODateInputComponent;
}(OFormDataComponent));
export { ODateInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9kYXRlLWlucHV0L28tZGF0ZS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFxQixRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVILE9BQU8sRUFBZSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQTJCLE1BQU0sbUJBQW1CLENBQUM7QUFFN0gsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBRzVCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDakUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFLdkcsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRWpILE1BQU0sQ0FBQyxJ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QUNULFFBQVEsRUFBRSxjQUFjO29CQUN4QiwyMEVBQTRDO29CQUU1QyxPQUFPLEVBQUUsNEJBQTRCO29CQUNyQyxNQUFNLEVBQUUsMkJBQTJCO29CQUNuQyxTQUFTLEVBQUU7d0JBQ1QsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRTtxQkFDdkY7O2lCQUNGOzs7Z0JBbENRLGNBQWMsdUJBeUVsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkF2Ri9DLFdBQVc7Z0JBRkEsVUFBVTtnQkFBc0IsUUFBUTs7OzZCQTRFekQsU0FBUyxTQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7a0NBR3BDLFNBQVMsU0FBQyxrQkFBa0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7OEJBRzlDLFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0lBNUI1RDtRQURDLGNBQWMsRUFBRTs7aUVBQ3VCO0lBUXhDO1FBREMsY0FBYyxFQUFFOzt5REFDVztJQThSOUIsMEJBQUM7Q0FBQSxBQW5URCxDQVV5QyxrQkFBa0IsR0F5UzFEO1NBelNZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1lZGlhQ2hhbmdlLCBNZWRpYU9ic2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuaW1wb3J0IHsgRGF0ZUFkYXB0ZXIsIE1BVF9EQVRFX0xPQ0FMRSwgTWF0RGF0ZXBpY2tlciwgTWF0RGF0ZXBpY2tlcklucHV0LCBNYXREYXRlcGlja2VySW5wdXRFdmVudCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IE1vbWVudERhdGVBZGFwdGVyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwtbW9tZW50LWFkYXB0ZXInO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgTW9tZW50U2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL21vbWVudC5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplTW9tZW50RGF0ZUFkYXB0ZXIgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvbWF0ZXJpYWwvZGF0ZS9vbnRpbWl6ZS1tb21lbnQtZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7IERhdGVDdXN0b21DbGFzc0Z1bmN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZGF0ZS1jdXN0b20tY2xhc3MudHlwZSc7XG5pbXBvcnQgeyBEYXRlRmlsdGVyRnVuY3Rpb24gfSBmcm9tICcuLi8uLi8uLi90eXBlcy9kYXRlLWZpbHRlci1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPRGF0ZVZhbHVlVHlwZSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL28tZGF0ZS12YWx1ZS50eXBlJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuLi8uLi9mb3JtL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHsgT0Zvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9WYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSAnLi4vLi4vby12YWx1ZS1jaGFuZ2UtZXZlbnQuY2xhc3MnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVULCBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVUIH0gZnJvbSAnLi4vdGV4dC1pbnB1dC9vLXRleHQtaW5wdXQuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0RBVEVfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0RBVEVfSU5QVVQgPSBbXG4gICd2YWx1ZVR5cGU6IHZhbHVlLXR5cGUnLFxuICAnb2Zvcm1hdDogZm9ybWF0JyxcbiAgJ29sb2NhbGU6IGxvY2FsZScsXG4gICdvU3RhcnRWaWV3OiBzdGFydC12aWV3JyxcbiAgJ29NaW5EYXRlOiBtaW4nLFxuICAnb01heERhdGU6IG1heCcsXG4gICdvVG91Y2hVaTogdG91Y2gtdWknLFxuICAnb1N0YXJ0QXQ6IHN0YXJ0LWF0JyxcbiAgJ2ZpbHRlckRhdGU6IGZpbHRlci1kYXRlJyxcbiAgJ3RleHRJbnB1dEVuYWJsZWQ6IHRleHQtaW5wdXQtZW5hYmxlZCcsXG4gICdkYXRlQ2xhc3M6IGRhdGUtY2xhc3MnLFxuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZGF0ZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWRhdGUtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWRhdGUtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fREFURV9JTlBVVCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0RBVEVfSU5QVVQsXG4gIHByb3ZpZGVyczogW1xuICAgIHsgcHJvdmlkZTogRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBPbnRpbWl6ZU1vbWVudERhdGVBZGFwdGVyLCBkZXBzOiBbTUFUX0RBVEVfTE9DQUxFXSB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT0RhdGVJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdGV4dElucHV0RW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBfb2Zvcm1hdDogc3RyaW5nID0gJ0wnO1xuICBwcm90ZWN0ZWQgb2xvY2FsZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgdXBkYXRlTG9jYWxlT25DaGFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIG9TdGFydFZpZXc6ICdtb250aCcgfCAneWVhcicgPSAnbW9udGgnO1xuICBwcm90ZWN0ZWQgb01pbkRhdGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIG9NYXhEYXRlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBvVG91Y2hVaTogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIG9TdGFydEF0OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfZmlsdGVyRGF0ZTogRGF0ZUZpbHRlckZ1bmN0aW9uO1xuICBwcm90ZWN0ZWQgX2RhdGVDbGFzczogRGF0ZUN1c3RvbUNsYXNzRnVuY3Rpb25cbiAgcHJvdGVjdGVkIF92YWx1ZVR5cGU6IE9EYXRlVmFsdWVUeXBlID0gJ3RpbWVzdGFtcCc7XG5cbiAgcHJvdGVjdGVkIF9taW5EYXRlU3RyaW5nOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfbWF4RGF0ZVN0cmluZzogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBtZWRpYTogTWVkaWFPYnNlcnZlcjtcbiAgcHJvdGVjdGVkIG1lZGlhU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBvbkxhbmd1YWdlQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBkYXRlVmFsdWU6IERhdGU7XG5cbiAgQFZpZXdDaGlsZCgncGlja2VyJywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHVibGljIGRhdGVwaWNrZXI6IE1hdERhdGVwaWNrZXI8RGF0ZT47XG5cbiAgQFZpZXdDaGlsZChNYXREYXRlcGlja2VySW5wdXQsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHB1YmxpYyBkYXRlcGlja2VySW5wdXQ6IE1hdERhdGVwaWNrZXJJbnB1dDxEYXRlPjtcblxuICBAVmlld0NoaWxkKCdtYXRJbnB1dFJlZicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiB0cnVlIH0pXG4gIHByaXZhdGUgbWF0SW5wdXRSZWYhOiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgbW9tZW50U3J2OiBNb21lbnRTZXJ2aWNlO1xuICBwcml2YXRlIG1vbWVudERhdGVBZGFwdGVyOiBEYXRlQWRhcHRlcjxNb21lbnREYXRlQWRhcHRlcj47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZGF0ZUFkYXB0ZXI6IERhdGVBZGFwdGVyPE9udGltaXplTW9tZW50RGF0ZUFkYXB0ZXI+LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMubW9tZW50RGF0ZUFkYXB0ZXIgPSBkYXRlQWRhcHRlcjtcbiAgICB0aGlzLl9kZWZhdWx0U1FMVHlwZUtleSA9ICdEQVRFJztcbiAgICB0aGlzLm1vbWVudFNydiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1vbWVudFNlcnZpY2UpO1xuICAgIHRoaXMubWVkaWEgPSB0aGlzLmluamVjdG9yLmdldChNZWRpYU9ic2VydmVyKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIGlmICghdGhpcy5vbG9jYWxlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxvY2FsZU9uQ2hhbmdlID0gdHJ1ZTtcbiAgICAgIHRoaXMub2xvY2FsZSA9IHRoaXMubW9tZW50U3J2LmdldExvY2FsZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9mb3JtYXQpIHtcbiAgICAgICh0aGlzLm1vbWVudERhdGVBZGFwdGVyIGFzIGFueSkub0Zvcm1hdCA9IHRoaXMub2Zvcm1hdDtcbiAgICB9XG5cbiAgICB0aGlzLm1vbWVudERhdGVBZGFwdGVyLnNldExvY2FsZSh0aGlzLm9sb2NhbGUpO1xuXG4gICAgaWYgKHRoaXMub1N0YXJ0Vmlldykge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLnN0YXJ0VmlldyA9IHRoaXMub1N0YXJ0VmlldztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vU3RhcnRBdCkge1xuICAgICAgdGhpcy5kYXRlcGlja2VyLnN0YXJ0QXQgPSBuZXcgRGF0ZSh0aGlzLm9TdGFydEF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vTWluRGF0ZSkge1xuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRoaXMub01pbkRhdGUpO1xuICAgICAgY29uc3QgbW9tZW50RCA9IG1vbWVudChkYXRlKTtcbiAgICAgIGlmIChtb21lbnRELmlzVmFsaWQoKSkge1xuICAgICAgICB0aGlzLmRhdGVwaWNrZXJJbnB1dC5taW4gPSBkYXRlO1xuICAgICAgICB0aGlzLm1pbkRhdGVTdHJpbmcgPSBtb21lbnRELmZvcm1hdCh0aGlzLm9mb3JtYXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9NYXhEYXRlKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5vTWF4RGF0ZSk7XG4gICAgICBjb25zdCBtb21lbnREID0gbW9tZW50KGRhdGUpO1xuICAgICAgaWYgKG1vbWVudEQuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRoaXMuZGF0ZXBpY2tlcklucHV0Lm1heCA9IGRhdGU7XG4gICAgICAgIHRoaXMubWF4RGF0ZVN0cmluZyA9IG1vbWVudEQuZm9ybWF0KHRoaXMub2Zvcm1hdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudXBkYXRlTG9jYWxlT25DaGFuZ2UpIHtcbiAgICAgIHRoaXMub25MYW5ndWFnZUNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5vbkxhbmd1YWdlQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLm1vbWVudERhdGVBZGFwdGVyLnNldExvY2FsZSh0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0Q3VycmVudExhbmcoKSk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuc3Vic2NyaWJlVG9NZWRpYUNoYW5nZXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdWJzY3JpYmVUb01lZGlhQ2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLm1lZGlhU3Vic2NyaXB0aW9uID0gdGhpcy5tZWRpYS5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUoKGNoYW5nZTogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICAgICAgaWYgKFsneHMnLCAnc20nXS5pbmRleE9mKGNoYW5nZVswXS5tcUFsaWFzKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy50b3VjaFVpID0gVXRpbC5pc0RlZmluZWQodGhpcy5vVG91Y2hVaSkgPyB0aGlzLm9Ub3VjaFVpIDogdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChbJ21kJywgJ2xnJywgJ3hsJ10uaW5kZXhPZihjaGFuZ2VbMF0ubXFBbGlhcykgIT09IC0xKSB7XG4gICAgICAgIHRoaXMudG91Y2hVaSA9IFV0aWwuaXNEZWZpbmVkKHRoaXMub1RvdWNoVWkpID8gdGhpcy5vVG91Y2hVaSA6IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgaWYgKHRoaXMubWVkaWFTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMubWVkaWFTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub25MYW5ndWFnZUNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5vbkxhbmd1YWdlQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFZhbHVlQXNEYXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0ZVZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldFZhbHVlKCk6IGFueSB7XG4gICAgbGV0IHRpbWVzdGFtcFZhbHVlID0gc3VwZXIuZ2V0VmFsdWUoKTtcbiAgICBpZiAodGltZXN0YW1wVmFsdWUgJiYgdGltZXN0YW1wVmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lc3RhbXBWYWx1ZSA9IHRpbWVzdGFtcFZhbHVlLmdldFRpbWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRpbWVzdGFtcFZhbHVlO1xuICB9XG5cbiAgZ2V0IHNob3dDbGVhckJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jbGVhckJ1dHRvbiAmJiAhdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuZW5hYmxlZCAmJiB0aGlzLm1hdElucHV0UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBwdWJsaWMgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQ2hhbmdlRXZlbnQoZXZlbnQ6IE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PGFueT4pOiB2b2lkIHtcbiAgICBjb25zdCBpc1ZhbGlkID0gZXZlbnQudmFsdWUgJiYgZXZlbnQudmFsdWUuaXNWYWxpZCAmJiBldmVudC52YWx1ZS5pc1ZhbGlkKCk7XG4gICAgbGV0IHZhbCA9IGlzVmFsaWQgPyBldmVudC52YWx1ZS52YWx1ZU9mKCkgOiBldmVudC52YWx1ZTtcbiAgICBjb25zdCBtID0gbW9tZW50KHZhbCk7XG4gICAgc3dpdGNoICh0aGlzLnZhbHVlVHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIHZhbCA9IG0uZm9ybWF0KHRoaXMub2Zvcm1hdCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgdmFsID0gbmV3IERhdGUodmFsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdpc28tODYwMSc6XG4gICAgICAgIHZhbCA9IG0udG9JU09TdHJpbmcoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd0aW1lc3RhbXAnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuc2V0VmFsdWUodmFsLCB7XG4gICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2UsXG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0lucHV0KGU6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnRleHRJbnB1dEVuYWJsZWQpIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBmaWx0ZXJEYXRlKCk6IERhdGVGaWx0ZXJGdW5jdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbHRlckRhdGU7XG4gIH1cblxuICBzZXQgZmlsdGVyRGF0ZSh2YWw6IERhdGVGaWx0ZXJGdW5jdGlvbikge1xuICAgIHRoaXMuX2ZpbHRlckRhdGUgPSB2YWw7XG4gIH1cblxuICBnZXQgZGF0ZUNsYXNzKCk6IERhdGVDdXN0b21DbGFzc0Z1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZUNsYXNzO1xuICB9XG5cbiAgc2V0IGRhdGVDbGFzcyh2YWw6IERhdGVDdXN0b21DbGFzc0Z1bmN0aW9uKSB7XG4gICAgdGhpcy5fZGF0ZUNsYXNzID0gdmFsO1xuICB9XG4gIGdldCBvZm9ybWF0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX29mb3JtYXQ7XG4gIH1cblxuICBzZXQgb2Zvcm1hdCh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX29mb3JtYXQgPSB2YWw7XG4gIH1cblxuICBnZXQgbWluRGF0ZVN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9taW5EYXRlU3RyaW5nO1xuICB9XG5cbiAgc2V0IG1pbkRhdGVTdHJpbmcodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9taW5EYXRlU3RyaW5nID0gdmFsO1xuICB9XG5cbiAgZ2V0IG1heERhdGVTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4RGF0ZVN0cmluZztcbiAgfVxuXG4gIHNldCBtYXhEYXRlU3RyaW5nKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWF4RGF0ZVN0cmluZyA9IHZhbDtcbiAgfVxuXG4gIGdldCB0b3VjaFVpKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9Ub3VjaFVpIHx8IGZhbHNlO1xuICB9XG5cbiAgc2V0IHRvdWNoVWkodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5vVG91Y2hVaSA9IHZhbDtcbiAgICB0aGlzLmRhdGVwaWNrZXIudG91Y2hVaSA9IHRoaXMudG91Y2hVaTtcbiAgfVxuXG4gIHByb3RlY3RlZCBlbnN1cmVPRGF0ZVZhbHVlVHlwZSh2YWw6IGFueSk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IHZhbDtcbiAgICBzd2l0Y2ggKHRoaXMudmFsdWVUeXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBjb25zdCBtID0gbW9tZW50KHZhbCwgdGhpcy5vZm9ybWF0KTtcbiAgICAgICAgICBpZiAobS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVZhbHVlID0gbmV3IERhdGUobS52YWx1ZU9mKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgaWYgKCh2YWwgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgIHRoaXMuZGF0ZVZhbHVlID0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RpbWVzdGFtcCc6XG4gICAgICAgIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRoaXMuZGF0ZVZhbHVlID0gbmV3IERhdGUodmFsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdpc28tODYwMSc6XG4gICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNvbnN0IGFjY2VwdFRpbWVzdGFtcCA9IHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmIHRoaXMuZ2V0U1FMVHlwZSgpID09PSBTUUxUeXBlcy5USU1FU1RBTVA7XG4gICAgICAgICAgaWYgKGFjY2VwdFRpbWVzdGFtcCkge1xuICAgICAgICAgICAgdGhpcy5kYXRlVmFsdWUgPSBuZXcgRGF0ZSh2YWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IG0gPSBtb21lbnQodmFsKTtcbiAgICAgICAgICBpZiAobS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVZhbHVlID0gbmV3IERhdGUobS52YWx1ZU9mKCkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQocmVzdWx0KSkge1xuICAgICAgY29uc29sZS53YXJuKGBPRGF0ZUlucHV0Q29tcG9uZW50IHZhbHVlICgke3ZhbH0pIGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdmFsdWUtdHlwZSAoJHt0aGlzLnZhbHVlVHlwZX0pYCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0Rm9ybVZhbHVlKHZhbDogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucywgc2V0RGlydHk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGxldCB2YWx1ZSA9IHZhbDtcbiAgICBpZiAodmFsIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWwudmFsdWU7XG4gICAgfVxuICAgIHRoaXMuZW5zdXJlT0RhdGVWYWx1ZVR5cGUodmFsdWUpO1xuICAgIHN1cGVyLnNldEZvcm1WYWx1ZSh2YWx1ZSwgb3B0aW9ucywgc2V0RGlydHkpO1xuICB9XG5cbiAgc2V0IHZhbHVlVHlwZSh2YWw6IGFueSkge1xuICAgIHRoaXMuX3ZhbHVlVHlwZSA9IFV0aWwuY29udmVydFRvT0RhdGVWYWx1ZVR5cGUodmFsKTtcbiAgfVxuXG4gIGdldCB2YWx1ZVR5cGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWVUeXBlO1xuICB9XG5cbn1cbiJdfQ==