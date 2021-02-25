import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT, ORealInputComponent, } from '../real-input/o-real-input.component';
export var DEFAULT_INPUTS_O_PERCENT_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_REAL_INPUT);
export var DEFAULT_OUTPUTS_O_PERCENT_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_REAL_INPUT);
var OPercentInputComponent = (function (_super) {
    tslib_1.__extends(OPercentInputComponent, _super);
    function OPercentInputComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.grouping = true;
        return _this;
    }
    OPercentInputComponent.prototype.ngOnInit = function () {
        if (typeof (this.min) === 'undefined') {
            this.min = 0;
        }
        if (typeof (this.max) === 'undefined') {
            this.max = 100;
        }
        _super.prototype.ngOnInit.call(this);
    };
    OPercentInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-percent-input',
                    template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput [type]=\"inputType\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [placeholder]=\"placeHolder\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" [readonly]=\"isReadOnly\"\n      (change)=\"onChangeEvent($event)\" [min]=\"min\" [max]=\"max\" [step]=\"step\" [required]=\"isRequired\">\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-icon svgIcon=\"ontimize:PERCENT\" matSuffix class=\"svg-icon\" [class.mat-disabled]=\"!enabled\"></mat-icon>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('min')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}: {{ getErrorValue('min', 'requiredMin') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('max')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}: {{ getErrorValue('max', 'requiredMax') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('minDecimaldigits')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_DECIMAL_DIGITS' | oTranslate }}: {{ getErrorValue('minDecimaldigits', 'requiredMinDecimaldigits') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('maxDecimaldigits')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_DECIMAL_DIGITS' | oTranslate }}: {{ getErrorValue('maxDecimaldigits', 'requiredMaxDecimaldigits') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                    inputs: DEFAULT_INPUTS_O_PERCENT_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_PERCENT_INPUT,
                    encapsulation: ViewEncapsulation.None,
                    styles: [""]
                }] }
    ];
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OPercentInputComponent.prototype, "grouping", void 0);
    return OPercentInputComponent;
}(ORealInputComponent));
export { OPercentInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wZXJjZW50LWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9wZXJjZW50LWlucHV0L28tcGVyY2VudC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsNEJBQTRCLEVBQzVCLG1CQUFtQixHQUNwQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE1BQU0sQ0FBQyxJQUFNLDhCQUE4QixvQkFDdEMsMkJBQTJCLENBQy9CLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSwrQkFBK0Isb0JBQ3ZDLDRCQUE0QixDQUNoQyxDQUFDO0FBRUY7SUFRNEMsa0RBQW1CO0lBUi9EO1FBQUEscUVBc0JDO1FBWEMsY0FBUSxHQUFZLElBQUksQ0FBQzs7SUFXM0IsQ0FBQztJQVRRLHlDQUFRLEdBQWY7UUFDRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQ2hCO1FBQ0QsaUJBQU0sUUFBUSxXQUFFLENBQUM7SUFDbkIsQ0FBQzs7Z0JBckJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQix5ckVBQStDO29CQUUvQyxNQUFNLEVBQUUsOEJBQThCO29CQUN0QyxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7aUJBQ3RDOztJQUlDO1FBREMsY0FBYyxFQUFFOzs0REFDUTtJQVczQiw2QkFBQztDQUFBLEFBdEJELENBUTRDLG1CQUFtQixHQWM5RDtTQWRZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fUkVBTF9JTlBVVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fUkVBTF9JTlBVVCxcbiAgT1JlYWxJbnB1dENvbXBvbmVudCxcbn0gZnJvbSAnLi4vcmVhbC1pbnB1dC9vLXJlYWwtaW5wdXQuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fUEVSQ0VOVF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19SRUFMX0lOUFVUXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fUEVSQ0VOVF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fUkVBTF9JTlBVVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1wZXJjZW50LWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tcGVyY2VudC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tcGVyY2VudC1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fUEVSQ0VOVF9JTlBVVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fUEVSQ0VOVF9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPUGVyY2VudElucHV0Q29tcG9uZW50IGV4dGVuZHMgT1JlYWxJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgZ3JvdXBpbmc6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICBpZiAodHlwZW9mICh0aGlzLm1pbikgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLm1pbiA9IDA7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgKHRoaXMubWF4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMubWF4ID0gMTAwO1xuICAgIH1cbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICB9XG59XG4iXX0=