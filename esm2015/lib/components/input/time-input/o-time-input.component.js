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
export const DEFAULT_INPUTS_O_TIME_INPUT = [
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
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
];
export const DEFAULT_OUTPUTS_O_TIME_INPUT = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OTimeInputComponent extends OFormDataComponent {
    constructor(form, elRef, injector, cd) {
        super(form, elRef, injector);
        this.cd = cd;
        this.oDateFormat = 'L';
        this.oDateStartView = 'month';
        this.oDateTextInputEnabled = true;
        this.oHourFormat = 24;
        this.oHourTextInputEnabled = true;
        this.oHourPlaceholder = '';
        this.oDatePlaceholder = '';
        this.formGroup = new FormGroup({});
        this.subscription = new Subscription();
        this.dateAttr = 'dateInput';
        this.hourAttr = 'hourInput';
        this._defaultSQLTypeKey = 'DATE';
    }
    ngOnInit() {
        super.ngOnInit();
        this.dateAttr += '_' + this.oattr;
        this.hourAttr += '_' + this.oattr;
        const self = this;
        this.subscription.add(merge(this.dateInput.onValueChange, this.hourInput.onValueChange).subscribe((event) => {
            if (event.isUserChange()) {
                self.updateComponentValue();
                const newValue = self._fControl.value;
                self.emitOnValueChange(OValueChangeEvent.USER_CHANGE, newValue, self.oldValue);
                self.oldValue = newValue;
            }
        }));
    }
    ngAfterViewInit() {
        this.modifyFormControls();
        super.ngAfterViewInit();
        this.registerFormControls();
        this.setInnerComponentsData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    createFormControl(cfg, validators) {
        this._fControl = super.createFormControl(cfg, validators);
        this._fControl.fControlChildren = [this.dateInput, this.hourInput];
        return this._fControl;
    }
    onFormControlChange(value) {
        super.onFormControlChange(value);
        this.setInnerComponentsData();
    }
    setValue(newValue, options) {
        const changed = this.oldValue !== newValue;
        super.setValue(newValue, options);
        if (changed) {
            this.setInnerComponentsData();
        }
    }
    onClickClearValue(event) {
        event.stopPropagation();
        event.preventDefault();
        this.blockGroupValueChanges = true;
        this.clearValue();
        this.blockGroupValueChanges = false;
    }
    setInnerComponentsData() {
        let dateValue;
        let hourValue;
        if (Util.isDefined(this.value) && Util.isDefined(this.value.value)) {
            const momentD = moment(this.value.value);
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
    }
    updateComponentValue() {
        if (!this.value) {
            this.value = new OFormValue();
        }
        let timeValue;
        const values = this.formGroup.getRawValue();
        const mDate = (values[this.dateAttr] ? moment(values[this.dateAttr]) : moment()).startOf('day');
        const mHour = moment(values[this.hourAttr], this.hourInput.formatString);
        timeValue = mDate.clone()
            .set('hour', mHour.get('hour'))
            .set('minute', mHour.get('minutes'))
            .valueOf();
        if (this._fControl) {
            this._fControl.setValue(timeValue);
            this._fControl.markAsDirty();
        }
        this.ensureOFormValue(timeValue);
    }
    modifyFormControls() {
        if (this.dateInput) {
            const self = this;
            this.dateInput.getFormGroup = () => {
                return self.formGroup;
            };
        }
        if (this.hourInput) {
            const self = this;
            this.hourInput.getFormGroup = () => {
                return self.formGroup;
            };
        }
        if (this.form) {
            this.form.formGroup.removeControl(this.dateAttr);
            this.form.formGroup.removeControl(this.hourAttr);
        }
    }
    registerFormControls() {
        if (this.dateInput && this.dateInput.getFormControl()) {
            this.formGroup.registerControl(this.dateAttr, this.dateInput.getFormControl());
        }
        if (this.hourInput) {
            if (this.hourInput.getFormControl()) {
                this.formGroup.registerControl(this.hourAttr, this.hourInput.getFormControl());
            }
        }
    }
}
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
OTimeInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector },
    { type: ChangeDetectorRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10aW1lLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC90aW1lLWlucHV0L28tdGltZS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUdyRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsb0NBQW9DLEVBQUUscUNBQXFDLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNwSixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUczRSxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRztJQUN6QyxHQUFHLG9DQUFvQztJQUN2QywwQkFBMEI7SUFDMUIsMEJBQTBCO0lBQzFCLGlDQUFpQztJ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QyxDQUFDO1NBQ2hGO1FBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7YUFDaEY7U0FDRjtJQUNILENBQUM7OztZQXBMRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLHUvREFBNEM7Z0JBRTVDLE1BQU0sRUFBRSwyQkFBMkI7Z0JBQ25DLE9BQU8sRUFBRSw0QkFBNEI7Z0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osc0JBQXNCLEVBQUUsTUFBTTtpQkFDL0I7O2FBQ0Y7OztZQXpDUSxjQUFjLHVCQThFbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBaEd0RCxVQUFVO1lBR1YsUUFBUTtZQUxSLGlCQUFpQjs7O3dCQXNGaEIsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7d0JBR3ZDLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztBQW5CeEM7SUFEQyxjQUFjLEVBQUU7O3lEQUNZO0FBSTdCO0lBREMsY0FBYyxFQUFFOztrRUFDNEI7QUFLN0M7SUFEQyxjQUFjLEVBQUU7O2tFQUM0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IG1lcmdlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBEYXRlRmlsdGVyRnVuY3Rpb24gfSBmcm9tICcuLi8uLi8uLi90eXBlcy9kYXRlLWZpbHRlci1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuLi8uLi9mb3JtL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULCBERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULCBPRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPRGF0ZUlucHV0Q29tcG9uZW50IH0gZnJvbSAnLi4vZGF0ZS1pbnB1dC9vLWRhdGUtaW5wdXQuY29tcG9uZW50JztcbmltcG9ydCB7IE9Ib3VySW5wdXRDb21wb25lbnQgfSBmcm9tICcuLi9ob3VyLWlucHV0L28taG91ci1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1Db250cm9sIH0gZnJvbSAnLi4vby1mb3JtLWNvbnRyb2wuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19USU1FX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gICdvRGF0ZUZvcm1hdDogZGF0ZS1mb3JtYXQnLFxuICAnb0RhdGVMb2NhbGU6IGRhdGUtbG9jYWxlJyxcbiAgJ29EYXRlU3RhcnRWaWV3OiBkYXRlLXN0YXJ0LXZpZXcnLFxuICAnb0RhdGVNaW5EYXRlOiBkYXRlLW1pbicsXG4gICdvRGF0ZU1heERhdGU6IGRhdGUtbWF4JyxcbiAgJ29EYXRlVG91Y2hVaTogZGF0ZS10b3VjaC11aScsXG4gICdvRGF0ZVN0YXJ0QXQ6IGRhdGUtc3RhcnQtYXQnLFxuICAnb0RhdGVGaWx0ZXJEYXRlOiBkYXRlLWZpbHRlci1kYXRlJyxcbiAgJ29EYXRlVGV4dElucHV0RW5hYmxlZDogZGF0ZS10ZXh0LWlucHV0LWVuYWJsZWQnLFxuICAnb0hvdXJGb3JtYXQ6IGhvdXItZm9ybWF0JyxcbiAgJ29Ib3VyTWluOiBob3VyLW1pbicsXG4gICdvSG91ck1heDogaG91ci1tYXgnLFxuICAnb0hvdXJUZXh0SW5wdXRFbmFibGVkOiBob3VyLXRleHQtaW5wdXQtZW5hYmxlZCcsXG4gICdvSG91clBsYWNlaG9sZGVyOiBob3VyLXBsYWNlaG9sZGVyJyxcbiAgJ29EYXRlUGxhY2Vob2xkZXI6IGRhdGUtcGxhY2Vob2xkZXInXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVElNRV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10aW1lLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGltZS1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGltZS1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVElNRV9JTlBVVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVElNRV9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10aW1lLWlucHV0XSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9UaW1lSW5wdXRDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIG9EYXRlRm9ybWF0OiBzdHJpbmcgPSAnTCc7XG4gIHB1YmxpYyBvRGF0ZUxvY2FsZTogYW55O1xuICBwdWJsaWMgb0RhdGVTdGFydFZpZXc6ICdtb250aCcgfCAneWVhcicgPSAnbW9udGgnO1xuICBwdWJsaWMgb0RhdGVNaW5EYXRlOiBhbnk7XG4gIHB1YmxpYyBvRGF0ZU1heERhdGU6IGFueTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIG9EYXRlVG91Y2hVaTogYm9vbGVhbjtcbiAgcHVibGljIG9EYXRlU3RhcnRBdDogYW55O1xuICBwdWJsaWMgb0RhdGVGaWx0ZXJEYXRlOiBEYXRlRmlsdGVyRnVuY3Rpb247XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBvRGF0ZVRleHRJbnB1dEVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgb0hvdXJGb3JtYXQ6IG51bWJlciA9IDI0O1xuICBwdWJsaWMgb0hvdXJNaW46IHN0cmluZztcbiAgcHVibGljIG9Ib3VyTWF4OiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBvSG91clRleHRJbnB1dEVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgb0hvdXJQbGFjZWhvbGRlciA9ICcnO1xuICBwdWJsaWMgb0RhdGVQbGFjZWhvbGRlciA9ICcnO1xuXG4gIHByb3RlY3RlZCBibG9ja0dyb3VwVmFsdWVDaGFuZ2VzOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgZm9ybUdyb3VwOiBGb3JtR3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcblxuICBAVmlld0NoaWxkKCdkYXRlSW5wdXQnLCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwcm90ZWN0ZWQgZGF0ZUlucHV0OiBPRGF0ZUlucHV0Q29tcG9uZW50O1xuXG4gIEBWaWV3Q2hpbGQoJ2hvdXJJbnB1dCcsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHByb3RlY3RlZCBob3VySW5wdXQ6IE9Ib3VySW5wdXRDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIHB1YmxpYyBkYXRlQXR0ciA9ICdkYXRlSW5wdXQnO1xuICBwdWJsaWMgaG91ckF0dHIgPSAnaG91cklucHV0JztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnREFURSc7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcblxuICAgIHRoaXMuZGF0ZUF0dHIgKz0gJ18nICsgdGhpcy5vYXR0cjtcbiAgICB0aGlzLmhvdXJBdHRyICs9ICdfJyArIHRoaXMub2F0dHI7XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQoXG4gICAgICBtZXJnZSh0aGlzLmRhdGVJbnB1dC5vblZhbHVlQ2hhbmdlLCB0aGlzLmhvdXJJbnB1dC5vblZhbHVlQ2hhbmdlKS5zdWJzY3JpYmUoKGV2ZW50OiBPVmFsdWVDaGFuZ2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQuaXNVc2VyQ2hhbmdlKCkpIHtcbiAgICAgICAgICBzZWxmLnVwZGF0ZUNvbXBvbmVudFZhbHVlKCk7XG4gICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSBzZWxmLl9mQ29udHJvbC52YWx1ZTtcbiAgICAgICAgICBzZWxmLmVtaXRPblZhbHVlQ2hhbmdlKE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFLCBuZXdWYWx1ZSwgc2VsZi5vbGRWYWx1ZSk7XG4gICAgICAgICAgc2VsZi5vbGRWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubW9kaWZ5Rm9ybUNvbnRyb2xzKCk7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgdGhpcy5yZWdpc3RlckZvcm1Db250cm9scygpO1xuICAgIHRoaXMuc2V0SW5uZXJDb21wb25lbnRzRGF0YSgpO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlRm9ybUNvbnRyb2woY2ZnLCB2YWxpZGF0b3JzKTogT0Zvcm1Db250cm9sIHtcbiAgICB0aGlzLl9mQ29udHJvbCA9IHN1cGVyLmNyZWF0ZUZvcm1Db250cm9sKGNmZywgdmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fZkNvbnRyb2wuZkNvbnRyb2xDaGlsZHJlbiA9IFt0aGlzLmRhdGVJbnB1dCwgdGhpcy5ob3VySW5wdXRdO1xuICAgIHJldHVybiB0aGlzLl9mQ29udHJvbDtcbiAgfVxuXG4gIHB1YmxpYyBvbkZvcm1Db250cm9sQ2hhbmdlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBzdXBlci5vbkZvcm1Db250cm9sQ2hhbmdlKHZhbHVlKTtcbiAgICB0aGlzLnNldElubmVyQ29tcG9uZW50c0RhdGEoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZShuZXdWYWx1ZTogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLm9sZFZhbHVlICE9PSBuZXdWYWx1ZTtcbiAgICBzdXBlci5zZXRWYWx1ZShuZXdWYWx1ZSwgb3B0aW9ucyk7XG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMuc2V0SW5uZXJDb21wb25lbnRzRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrQ2xlYXJWYWx1ZShldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuYmxvY2tHcm91cFZhbHVlQ2hhbmdlcyA9IHRydWU7XG4gICAgdGhpcy5jbGVhclZhbHVlKCk7XG4gICAgdGhpcy5ibG9ja0dyb3VwVmFsdWVDaGFuZ2VzID0gZmFsc2U7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0SW5uZXJDb21wb25lbnRzRGF0YSgpOiB2b2lkIHtcbiAgICBsZXQgZGF0ZVZhbHVlOiBhbnk7XG4gICAgbGV0IGhvdXJWYWx1ZTogYW55O1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnZhbHVlKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnZhbHVlLnZhbHVlKSkge1xuICAgICAgY29uc3QgbW9tZW50RCA9IG1vbWVudCh0aGlzLnZhbHVlLnZhbHVlKTtcbiAgICAgIGlmIChtb21lbnRELmlzVmFsaWQoKSkge1xuICAgICAgICBkYXRlVmFsdWUgPSBtb21lbnRELmNsb25lKCkuc3RhcnRPZignZGF5JykudmFsdWVPZigpO1xuICAgICAgICBob3VyVmFsdWUgPSBtb21lbnRELmNsb25lKCkudmFsdWVPZigpIC0gZGF0ZVZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5kYXRlSW5wdXQpIHtcbiAgICAgIHRoaXMuZGF0ZUlucHV0LnNldFZhbHVlKGRhdGVWYWx1ZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhvdXJJbnB1dCkge1xuICAgICAgdGhpcy5ob3VySW5wdXQuc2V0VGltZXN0YW1wVmFsdWUoaG91clZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlQ29tcG9uZW50VmFsdWUoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUoKTtcbiAgICB9XG4gICAgbGV0IHRpbWVWYWx1ZTogbnVtYmVyO1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZm9ybUdyb3VwLmdldFJhd1ZhbHVlKCk7XG4gICAgY29uc3QgbURhdGUgPSAodmFsdWVzW3RoaXMuZGF0ZUF0dHJdID8gbW9tZW50KHZhbHVlc1t0aGlzLmRhdGVBdHRyXSkgOiBtb21lbnQoKSkuc3RhcnRPZignZGF5Jyk7XG4gICAgY29uc3QgbUhvdXIgPSBtb21lbnQodmFsdWVzW3RoaXMuaG91ckF0dHJdLCB0aGlzLmhvdXJJbnB1dC5mb3JtYXRTdHJpbmcpO1xuICAgIHRpbWVWYWx1ZSA9IG1EYXRlLmNsb25lKClcbiAgICAgIC5zZXQoJ2hvdXInLCBtSG91ci5nZXQoJ2hvdXInKSlcbiAgICAgIC5zZXQoJ21pbnV0ZScsIG1Ib3VyLmdldCgnbWludXRlcycpKVxuICAgICAgLnZhbHVlT2YoKTtcbiAgICBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgIHRoaXMuX2ZDb250cm9sLnNldFZhbHVlKHRpbWVWYWx1ZSk7XG4gICAgICB0aGlzLl9mQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgIH1cbiAgICB0aGlzLmVuc3VyZU9Gb3JtVmFsdWUodGltZVZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtb2RpZnlGb3JtQ29udHJvbHMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0ZUlucHV0KSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuZGF0ZUlucHV0LmdldEZvcm1Hcm91cCA9ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHNlbGYuZm9ybUdyb3VwO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3VySW5wdXQpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5ob3VySW5wdXQuZ2V0Rm9ybUdyb3VwID0gKCkgPT4ge1xuICAgICAgICByZXR1cm4gc2VsZi5mb3JtR3JvdXA7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgIHRoaXMuZm9ybS5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCh0aGlzLmRhdGVBdHRyKTtcbiAgICAgIHRoaXMuZm9ybS5mb3JtR3JvdXAucmVtb3ZlQ29udHJvbCh0aGlzLmhvdXJBdHRyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJGb3JtQ29udHJvbHMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0ZUlucHV0ICYmIHRoaXMuZGF0ZUlucHV0LmdldEZvcm1Db250cm9sKCkpIHtcbiAgICAgIHRoaXMuZm9ybUdyb3VwLnJlZ2lzdGVyQ29udHJvbCh0aGlzLmRhdGVBdHRyLCB0aGlzLmRhdGVJbnB1dC5nZXRGb3JtQ29udHJvbCgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaG91cklucHV0KSB7XG4gICAgICBpZiAodGhpcy5ob3VySW5wdXQuZ2V0Rm9ybUNvbnRyb2woKSkge1xuICAgICAgICB0aGlzLmZvcm1Hcm91cC5yZWdpc3RlckNvbnRyb2wodGhpcy5ob3VyQXR0ciwgdGhpcy5ob3VySW5wdXQuZ2V0Rm9ybUNvbnRyb2woKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==