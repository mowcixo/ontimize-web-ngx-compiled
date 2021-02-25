import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment from 'moment';
import { merge, Subscription } from 'rxjs';
import { InputConverter } from '../../../decorators/input-converter';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { ODateInputComponent } from '../date-input/o-date-input.component';
import { OHourInputComponent } from '../hour-input/o-hour-input.component';
export var DEFAULT_INPUTS_O_TIME_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, [
    'oDateFormat: date-format',
    'oDateLocale: date-locale',
    'oDateStartView: date-start-view',
    'oDateMinDate: date-min',
    'oDateMaxDate: date-max',
    'oDateTouchUi: date-touch-ui',
    'oDateStartAt: date-start-at',
    'oDateFilterDate: date-filter-date',
    'oDateTextInputEnabled: date-text-input-enabled',
    'oHourFormat: hour-format',
    'oHourMin: hour-min',
    'oHourMax: hour-max',
    'oHourTextInputEnabled: hour-text-input-enabled',
    'oHourPlaceholder: hour-placeholder',
    'oDatePlaceholder: date-placeholder'
]);
export var DEFAULT_OUTPUTS_O_TIME_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OTimeInputComponent = (function (_super) {
    tslib_1.__extends(OTimeInputComponent, _super);
    function OTimeInputComponent(form, elRef, injector, cd) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.cd = cd;
        _this.oDateFormat = 'L';
        _this.oDateStartView = 'month';
        _this.oDateTextInputEnabled = true;
        _this.oHourFormat = 24;
        _this.oHourTextInputEnabled = true;
        _this.oHourPlaceholder = '';
        _this.oDatePlaceholder = '';
        _this.formGroup = new FormGroup({});
        _this.subscription = new Subscription();
        _this.dateAttr = 'dateInput';
        _this.hourAttr = 'hourInput';
        _this._defaultSQLTypeKey = 'DATE';
        return _this;
    }
    OTimeInputComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.dateAttr += '_' + this.oattr;
        this.hourAttr += '_' + this.oattr;
        var self = this;
        this.subscription.add(merge(this.dateInput.onValueChange, this.hourInput.onValueChange).subscribe(function (event) {
            if (event.isUserChange()) {
                self.updateComponentValue();
                var newValue = self._fControl.value;
                self.emitOnValueChange(OValueChangeEvent.USER_CHANGE, newValue, self.oldValue);
                self.oldValue = newValue;
            }
        }));
    };
    OTimeInputComponent.prototype.ngAfterViewInit = function () {
        this.modifyFormControls();
        _super.prototype.ngAfterViewInit.call(this);
        this.registerFormControls();
        this.setInnerComponentsData();
    };
    OTimeInputComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    OTimeInputComponent.prototype.createFormControl = function (cfg, validators) {
        this._fControl = _super.prototype.createFormControl.call(this, cfg, validators);
        this._fControl.fControlChildren = [this.dateInput, this.hourInput];
        return this._fControl;
    };
    OTimeInputComponent.prototype.onFormControlChange = function (value) {
        _super.prototype.onFormControlChange.call(this, value);
        this.setInnerComponentsData();
    };
    OTimeInputComponent.prototype.setValue = function (newValue, options) {
        var changed = this.oldValue !== newValue;
        _super.prototype.setValue.call(this, newValue, options);
        if (changed) {
            this.setInnerComponentsData();
        }
    };
    OTimeInputComponent.prototype.onClickClearValue = function (event) {
        event.stopPropagation();
        event.preventDefault();
        this.blockGroupValueChanges = true;
        this.clearValue();
        this.blockGroupValueChanges = false;
    };
    OTimeInputComponent.prototype.setInnerComponentsData = function () {
        var dateValue;
        var hourValue;
        if (Util.isDefined(this.value) && Util.isDefined(this.value.value)) {
            var momentD = moment(this.value.value);
            if (momentD.isValid()) {
                dateValue = momentD.clone().startOf('day').valueOf();
                hourValue = momentD.clone().valueOf() - dateValue;
            }
        }
        if (this.dateInput) {
            this.dateInput.setValue(dateValue);
        }
        if (this.hourInput) {
            this.hourInput.setTimestampValue(hourValue);
        }
        this.cd.detectChanges();
    };
    OTimeInputComponent.prototype.updateComponentValue = function () {
        if (!this.value) {
            this.value = new OFormValue();
        }
        var timeValue;
        var values = this.formGroup.getRawValue();
        var mDate = (values[this.dateAttr] ? moment(values[this.dateAttr]) : moment()).startOf('day');
        var mHour = moment(values[this.hourAttr], this.hourInput.formatString);
        timeValue = mDate.clone()
            .set('hour', mHour.get('hour'))
            .set('minute', mHour.get('minutes'))
            .valueOf();
        if (this._fControl) {
            this._fControl.setValue(timeValue);
            this._fControl.markAsDirty();
        }
        this.ensureOFormValue(timeValue);
    };
    OTimeInputComponent.prototype.modifyFormControls = function () {
        if (this.dateInput) {
            var self_1 = this;
            this.dateInput.getFormGroup = function () {
                return self_1.formGroup;
            };
        }
        if (this.hourInput) {
            var self_2 = this;
            this.hourInput.getFormGroup = function () {
                return self_2.formGroup;
            };
        }
        if (this.form) {
            this.form.formGroup.removeControl(this.dateAttr);
            this.form.formGroup.removeControl(this.hourAttr);
        }
    };
    OTimeInputComponent.prototype.registerFormControls = function () {
        if (this.dateInput && this.dateInput.getFormControl()) {
            this.formGroup.registerControl(this.dateAttr, this.dateInput.getFormControl());
        }
        if (this.hourInput) {
            if (this.hourInput.getFormControl()) {
                this.formGroup.registerControl(this.hourAttr, this.hourInput.getFormControl());
            }
        }
    };
    OTimeInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-time-input',
                    template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <div class=\"mat-form-field mat-form-field-appearance-legacy\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\"\n    fxLayoutGap=\"8px\">\n    <o-date-input #dateInput fxFlex [attr]=\"dateAttr\" [read-only]=\"readOnly\" [enabled]=\"enabled\" [required]=\"isRequired\"\n      [label]=\"olabel\" clear-button=\"no\" automatic-registering=\"no\" automatic-binding=\"no\"\n      (onFocus)=\"innerOnFocus($event)\" (onBlur)=\"innerOnBlur($event)\" [format]=\"oDateFormat\" [locale]=\"oDateLocale\"\n      [start-view]=\"oDateStartView\" [min]=\"oDateMinDate\" [max]=\"oDateMaxDate\" [touch-ui]=\"oDateTouchUi\"\n      [start-at]=\"oDateStartAt\" [filter-date]=\"oDateFilterDate\" [text-input-enabled]=\"oDateTextInputEnabled\"\n      [placeholder]=\"oDatePlaceholder\" [label-visible]=\"labelVisible\" [hide-required-marker]=\"hideRequiredMarker\">\n    </o-date-input>\n\n    <span class=\"separator\">&ndash;</span>\n\n    <o-hour-input #hourInput fxFlex [attr]=\"hourAttr\" [read-only]=\"readOnly\" [enabled]=\"enabled\" [required]=\"isRequired\"\n      clear-button=\"no\" automatic-registering=\"no\" automatic-binding=\"no\" (onFocus)=\"innerOnFocus($event)\"\n      (onBlur)=\"innerOnBlur($event)\" [format]=\"oHourFormat\" [text-input-enabled]=\"oHourTextInputEnabled\"\n      [min]=\"oHourMin\" [max]=\"oHourMax\" hide-required-marker=\"yes\" label-visible=\"no\" [placeholder]=\"oHourPlaceholder\">\n    </o-hour-input>\n\n    <button class=\"mat-form-field-suffix\" type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button\n      (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n  </div>\n\n  <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n</div>",
                    inputs: DEFAULT_INPUTS_O_TIME_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_TIME_INPUT,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-time-input]': 'true'
                    },
                    styles: [".o-time-input .separator{cursor:default}.o-time-input .mat-form-field.icon-field:not(.custom-width).icon-field-1-suffix .mat-form-field-infix{width:auto}"]
                }] }
    ];
    OTimeInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector },
        { type: ChangeDetectorRef }
    ]; };
    OTimeInputComponent.propDecorators = {
        dateInput: [{ type: ViewChild, args: ['dateInput', { static: true },] }],
        hourInput: [{ type: ViewChild, args: ['hourInput', { static: true },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTimeInputComponent.prototype, "oDateTouchUi", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTimeInputComponent.prototype, "oDateTextInputEnabled", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTimeInputComponent.prototype, "oHourTextInputEnabled", void 0);
    return OTimeInputComponent;
}(OFormDataComponent));
export { OTimeInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10aW1lLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC90aW1lLWlucHV0L28tdGltZS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUdyRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNwSixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUczRSxNQUFNLENBQUMsSUFBTSwyQkFBMkIsb0JBQ25DLG9DQUFvQztJQUN2QywwQkFBMEI7SUFDMUIsMEJBQTBCO0lBQzFCLGlDQUFpQztJQUNqQyx3QkFB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Q0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7YUFDaEY7U0FDRjtJQUNILENBQUM7O2dCQXBMRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLHUvREFBNEM7b0JBRTVDLE1BQU0sRUFBRSwyQkFBMkI7b0JBQ25DLE9BQU8sRUFBRSw0QkFBNEI7b0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osc0JBQXNCLEVBQUUsTUFBTTtxQkFDL0I7O2lCQUNGOzs7Z0JBekNRLGNBQWMsdUJBOEVsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkFoR3RELFVBQVU7Z0JBR1YsUUFBUTtnQkFMUixpQkFBaUI7Ozs0QkFzRmhCLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzRCQUd2QyxTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFuQnhDO1FBREMsY0FBYyxFQUFFOzs2REFDWTtJQUk3QjtRQURDLGNBQWMsRUFBRTs7c0VBQzRCO0lBSzdDO1FBREMsY0FBYyxFQUFFOztzRUFDNEI7SUEwSi9DLDBCQUFDO0NBQUEsQUF0TEQsQ0FXeUMsa0JBQWtCLEdBMksxRDtTQTNLWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBtZXJnZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgRGF0ZUZpbHRlckZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZGF0ZS1maWx0ZXItZnVuY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybVZhbHVlIH0gZnJvbSAnLi4vLi4vZm9ybS9PRm9ybVZhbHVlJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCwgREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCwgT0Zvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9WYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSAnLi4vLi4vby12YWx1ZS1jaGFuZ2UtZXZlbnQuY2xhc3MnO1xuaW1wb3J0IHsgT0RhdGVJbnB1dENvbXBvbmVudCB9IGZyb20gJy4uL2RhdGUtaW5wdXQvby1kYXRlLWlucHV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPSG91cklucHV0Q29tcG9uZW50IH0gZnJvbSAnLi4vaG91ci1pbnB1dC9vLWhvdXItaW5wdXQuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtQ29udHJvbCB9IGZyb20gJy4uL28tZm9ybS1jb250cm9sLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVElNRV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnb0RhdGVGb3JtYXQ6IGRhdGUtZm9ybWF0JyxcbiAgJ29EYXRlTG9jYWxlOiBkYXRlLWxvY2FsZScsXG4gICdvRGF0ZVN0YXJ0VmlldzogZGF0ZS1zdGFydC12aWV3JyxcbiAgJ29EYXRlTWluRGF0ZTogZGF0ZS1taW4nLFxuICAnb0RhdGVNYXhEYXRlOiBkYXRlLW1heCcsXG4gICdvRGF0ZVRvdWNoVWk6IGRhdGUtdG91Y2gtdWknLFxuICAnb0RhdGVTdGFydEF0OiBkYXRlLXN0YXJ0LWF0JyxcbiAgJ29EYXRlRmlsdGVyRGF0ZTogZGF0ZS1maWx0ZXItZGF0ZScsXG4gICdvRGF0ZVRleHRJbnB1dEVuYWJsZWQ6IGRhdGUtdGV4dC1pbnB1dC1lbmFibGVkJyxcbiAgJ29Ib3VyRm9ybWF0OiBob3VyLWZvcm1hdCcsXG4gICdvSG91ck1pbjogaG91ci1taW4nLFxuICAnb0hvdXJNYXg6IGhvdXItbWF4JyxcbiAgJ29Ib3VyVGV4dElucHV0RW5hYmxlZDogaG91ci10ZXh0LWlucHV0LWVuYWJsZWQnLFxuICAnb0hvdXJQbGFjZWhvbGRlcjogaG91ci1wbGFjZWhvbGRlcicsXG4gICdvRGF0ZVBsYWNlaG9sZGVyOiBkYXRlLXBsYWNlaG9sZGVyJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RJTUVfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGltZS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRpbWUtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRpbWUtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RJTUVfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RJTUVfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tdGltZS1pbnB1dF0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGltZUlucHV0Q29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyBvRGF0ZUZvcm1hdDogc3RyaW5nID0gJ0wnO1xuICBwdWJsaWMgb0RhdGVMb2NhbGU6IGFueTtcbiAgcHVibGljIG9EYXRlU3RhcnRWaWV3OiAnbW9udGgnIHwgJ3llYXInID0gJ21vbnRoJztcbiAgcHVibGljIG9EYXRlTWluRGF0ZTogYW55O1xuICBwdWJsaWMgb0RhdGVNYXhEYXRlOiBhbnk7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBvRGF0ZVRvdWNoVWk6IGJvb2xlYW47XG4gIHB1YmxpYyBvRGF0ZVN0YXJ0QXQ6IGFueTtcbiAgcHVibGljIG9EYXRlRmlsdGVyRGF0ZTogRGF0ZUZpbHRlckZ1bmN0aW9uO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb0RhdGVUZXh0SW5wdXRFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIG9Ib3VyRm9ybWF0OiBudW1iZXIgPSAyNDtcbiAgcHVibGljIG9Ib3VyTWluOiBzdHJpbmc7XG4gIHB1YmxpYyBvSG91ck1heDogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb0hvdXJUZXh0SW5wdXRFbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIG9Ib3VyUGxhY2Vob2xkZXIgPSAnJztcbiAgcHVibGljIG9EYXRlUGxhY2Vob2xkZXIgPSAnJztcblxuICBwcm90ZWN0ZWQgYmxvY2tHcm91cFZhbHVlQ2hhbmdlczogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIGZvcm1Hcm91cDogRm9ybUdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG5cbiAgQFZpZXdDaGlsZCgnZGF0ZUlucHV0JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHJvdGVjdGVkIGRhdGVJbnB1dDogT0RhdGVJbnB1dENvbXBvbmVudDtcblxuICBAVmlld0NoaWxkKCdob3VySW5wdXQnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwcm90ZWN0ZWQgaG91cklucHV0OiBPSG91cklucHV0Q29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBwdWJsaWMgZGF0ZUF0dHIgPSAnZGF0ZUlucHV0JztcbiAgcHVibGljIGhvdXJBdHRyID0gJ2hvdXJJbnB1dCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2RlZmF1bHRTUUxUeXBlS2V5ID0gJ0RBVEUnO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICB0aGlzLmRhdGVBdHRyICs9ICdfJyArIHRoaXMub2F0dHI7XG4gICAgdGhpcy5ob3VyQXR0ciArPSAnXycgKyB0aGlzLm9hdHRyO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgbWVyZ2UodGhpcy5kYXRlSW5wdXQub25WYWx1ZUNoYW5nZSwgdGhpcy5ob3VySW5wdXQub25WYWx1ZUNoYW5nZSkuc3Vic2NyaWJlKChldmVudDogT1ZhbHVlQ2hhbmdlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmlzVXNlckNoYW5nZSgpKSB7XG4gICAgICAgICAgc2VsZi51cGRhdGVDb21wb25lbnRWYWx1ZSgpO1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gc2VsZi5fZkNvbnRyb2wudmFsdWU7XG4gICAgICAgICAgc2VsZi5lbWl0T25WYWx1ZUNoYW5nZShPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSwgbmV3VmFsdWUsIHNlbGYub2xkVmFsdWUpO1xuICAgICAgICAgIHNlbGYub2xkVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm1vZGlmeUZvcm1Db250cm9scygpO1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMucmVnaXN0ZXJGb3JtQ29udHJvbHMoKTtcbiAgICB0aGlzLnNldElubmVyQ29tcG9uZW50c0RhdGEoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZvcm1Db250cm9sKGNmZywgdmFsaWRhdG9ycyk6IE9Gb3JtQ29udHJvbCB7XG4gICAgdGhpcy5fZkNvbnRyb2wgPSBzdXBlci5jcmVhdGVGb3JtQ29udHJvbChjZmcsIHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2ZDb250cm9sLmZDb250cm9sQ2hpbGRyZW4gPSBbdGhpcy5kYXRlSW5wdXQsIHRoaXMuaG91cklucHV0XTtcbiAgICByZXR1cm4gdGhpcy5fZkNvbnRyb2w7XG4gIH1cblxuICBwdWJsaWMgb25Gb3JtQ29udHJvbENoYW5nZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgc3VwZXIub25Gb3JtQ29udHJvbENoYW5nZSh2YWx1ZSk7XG4gICAgdGhpcy5zZXRJbm5lckNvbXBvbmVudHNEYXRhKCk7XG4gIH1cblxuICBwdWJsaWMgc2V0VmFsdWUobmV3VmFsdWU6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gdGhpcy5vbGRWYWx1ZSAhPT0gbmV3VmFsdWU7XG4gICAgc3VwZXIuc2V0VmFsdWUobmV3VmFsdWUsIG9wdGlvbnMpO1xuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLnNldElubmVyQ29tcG9uZW50c0RhdGEoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0NsZWFyVmFsdWUoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmJsb2NrR3JvdXBWYWx1ZUNoYW5nZXMgPSB0cnVlO1xuICAgIHRoaXMuY2xlYXJWYWx1ZSgpO1xuICAgIHRoaXMuYmxvY2tHcm91cFZhbHVlQ2hhbmdlcyA9IGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldElubmVyQ29tcG9uZW50c0RhdGEoKTogdm9pZCB7XG4gICAgbGV0IGRhdGVWYWx1ZTogYW55O1xuICAgIGxldCBob3VyVmFsdWU6IGFueTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy52YWx1ZSkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy52YWx1ZS52YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG1vbWVudEQgPSBtb21lbnQodGhpcy52YWx1ZS52YWx1ZSk7XG4gICAgICBpZiAobW9tZW50RC5pc1ZhbGlkKCkpIHtcbiAgICAgICAgZGF0ZVZhbHVlID0gbW9tZW50RC5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKTtcbiAgICAgICAgaG91clZhbHVlID0gbW9tZW50RC5jbG9uZSgpLnZhbHVlT2YoKSAtIGRhdGVWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuZGF0ZUlucHV0KSB7XG4gICAgICB0aGlzLmRhdGVJbnB1dC5zZXRWYWx1ZShkYXRlVmFsdWUpO1xuICAgIH1cbiAgICBpZiAodGhpcy5ob3VySW5wdXQpIHtcbiAgICAgIHRoaXMuaG91cklucHV0LnNldFRpbWVzdGFtcFZhbHVlKGhvdXJWYWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZUNvbXBvbmVudFZhbHVlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy52YWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKCk7XG4gICAgfVxuICAgIGxldCB0aW1lVmFsdWU6IG51bWJlcjtcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmZvcm1Hcm91cC5nZXRSYXdWYWx1ZSgpO1xuICAgIGNvbnN0IG1EYXRlID0gKHZhbHVlc1t0aGlzLmRhdGVBdHRyXSA/IG1vbWVudCh2YWx1ZXNbdGhpcy5kYXRlQXR0cl0pIDogbW9tZW50KCkpLnN0YXJ0T2YoJ2RheScpO1xuICAgIGNvbnN0IG1Ib3VyID0gbW9tZW50KHZhbHVlc1t0aGlzLmhvdXJBdHRyXSwgdGhpcy5ob3VySW5wdXQuZm9ybWF0U3RyaW5nKTtcbiAgICB0aW1lVmFsdWUgPSBtRGF0ZS5jbG9uZSgpXG4gICAgICAuc2V0KCdob3VyJywgbUhvdXIuZ2V0KCdob3VyJykpXG4gICAgICAuc2V0KCdtaW51dGUnLCBtSG91ci5nZXQoJ21pbnV0ZXMnKSlcbiAgICAgIC52YWx1ZU9mKCk7XG4gICAgaWYgKHRoaXMuX2ZDb250cm9sKSB7XG4gICAgICB0aGlzLl9mQ29udHJvbC5zZXRWYWx1ZSh0aW1lVmFsdWUpO1xuICAgICAgdGhpcy5fZkNvbnRyb2wubWFya0FzRGlydHkoKTtcbiAgICB9XG4gICAgdGhpcy5lbnN1cmVPRm9ybVZhbHVlKHRpbWVWYWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgbW9kaWZ5Rm9ybUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGVJbnB1dCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmRhdGVJbnB1dC5nZXRGb3JtR3JvdXAgPSAoKSA9PiB7XG4gICAgICAgIHJldHVybiBzZWxmLmZvcm1Hcm91cDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaG91cklucHV0KSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuaG91cklucHV0LmdldEZvcm1Hcm91cCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZm9ybUdyb3VwO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICB0aGlzLmZvcm0uZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2wodGhpcy5kYXRlQXR0cik7XG4gICAgICB0aGlzLmZvcm0uZm9ybUdyb3VwLnJlbW92ZUNvbnRyb2wodGhpcy5ob3VyQXR0cik7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyRm9ybUNvbnRyb2xzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRhdGVJbnB1dCAmJiB0aGlzLmRhdGVJbnB1dC5nZXRGb3JtQ29udHJvbCgpKSB7XG4gICAgICB0aGlzLmZvcm1Hcm91cC5yZWdpc3RlckNvbnRyb2wodGhpcy5kYXRlQXR0ciwgdGhpcy5kYXRlSW5wdXQuZ2V0Rm9ybUNvbnRyb2woKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhvdXJJbnB1dCkge1xuICAgICAgaWYgKHRoaXMuaG91cklucHV0LmdldEZvcm1Db250cm9sKCkpIHtcbiAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVnaXN0ZXJDb250cm9sKHRoaXMuaG91ckF0dHIsIHRoaXMuaG91cklucHV0LmdldEZvcm1Db250cm9sKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG4iXX0=