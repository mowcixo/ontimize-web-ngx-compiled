import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { ORealPipe } from '../../../pipes/o-real.pipe';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_INTEGER_INPUT, DEFAULT_OUTPUTS_O_INTEGER_INPUT, OIntegerInputComponent, } from '../integer-input/o-integer-input.component';
export var DEFAULT_INPUTS_O_REAL_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_INTEGER_INPUT, [
    'minDecimalDigits: min-decimal-digits',
    'maxDecimalDigits: max-decimal-digits',
    'decimalSeparator : decimal-separator'
]);
export var DEFAULT_OUTPUTS_O_REAL_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_INTEGER_INPUT);
var ORealInputComponent = (function (_super) {
    tslib_1.__extends(ORealInputComponent, _super);
    function ORealInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.minDecimalDigits = 2;
        _this.maxDecimalDigits = 2;
        _this.step = 0.01;
        _this.grouping = true;
        _this._defaultSQLTypeKey = 'FLOAT';
        return _this;
    }
    ORealInputComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new ORealPipe(this.injector);
    };
    ORealInputComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pipeArguments.decimalSeparator = this.decimalSeparator;
        this.pipeArguments.minDecimalDigits = this.minDecimalDigits;
        this.pipeArguments.maxDecimalDigits = this.maxDecimalDigits;
    };
    ORealInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (Util.isDefined(this.minDecimalDigits)) {
            validators.push(this.minDecimalDigitsValidator.bind(this));
        }
        if (Util.isDefined(this.maxDecimalDigits)) {
            validators.push(this.maxDecimalDigitsValidator.bind(this));
        }
        return validators;
    };
    ORealInputComponent.prototype.minDecimalDigitsValidator = function (control) {
        var ctrlValue = control.value;
        if (typeof control.value === 'number') {
            ctrlValue = ctrlValue.toString();
        }
        if (ctrlValue && ctrlValue.length) {
            var valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
            if (Util.isDefined(this.minDecimalDigits) && (this.minDecimalDigits > 0) && Util.isDefined(valArray[1]) && (valArray[1].length < this.minDecimalDigits)) {
                return {
                    minDecimaldigits: {
                        requiredMinDecimaldigits: this.minDecimalDigits
                    }
                };
            }
        }
        return {};
    };
    ORealInputComponent.prototype.maxDecimalDigitsValidator = function (control) {
        var ctrlValue = control.value;
        if (typeof control.value === 'number') {
            ctrlValue = ctrlValue.toString();
        }
        if (ctrlValue && ctrlValue.length) {
            var valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
            if (Util.isDefined(this.maxDecimalDigits) && (this.maxDecimalDigits > 0) && Util.isDefined(valArray[1]) && (valArray[1].length > this.maxDecimalDigits)) {
                return {
                    maxDecimaldigits: {
                        requiredMaxDecimaldigits: this.maxDecimalDigits
                    }
                };
            }
        }
        return {};
    };
    ORealInputComponent.prototype.initializeStep = function () {
        if (this.step <= 0) {
            this.step = 1 / Math.pow(10, this.maxDecimalDigits);
            console.warn('`step` attribute must be greater than zero');
        }
    };
    ORealInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-real-input',
                    template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" [class.icon-field]=\"showClearButton\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput [type]=\"inputType\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [placeholder]=\"placeHolder\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\"\n      (change)=\"onChangeEvent($event)\" [readonly]=\"isReadOnly\" [min]=\"min\" [max]=\"max\" [step]=\"step\"\n      [required]=\"isRequired\">\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('min')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}: {{ getErrorValue('min', 'requiredMin') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('max')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}: {{ getErrorValue('max', 'requiredMax') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('minDecimaldigits')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_DECIMAL_DIGITS' | oTranslate }}: {{ getErrorValue('minDecimaldigits', 'requiredMinDecimaldigits') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('maxDecimaldigits')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_DECIMAL_DIGITS' | oTranslate }}: {{ getErrorValue('maxDecimaldigits', 'requiredMaxDecimaldigits') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                    inputs: DEFAULT_INPUTS_O_REAL_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_REAL_INPUT,
                    encapsulation: ViewEncapsulation.None,
                    styles: [""]
                }] }
    ];
    ORealInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], ORealInputComponent.prototype, "minDecimalDigits", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], ORealInputComponent.prototype, "maxDecimalDigits", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], ORealInputComponent.prototype, "step", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], ORealInputComponent.prototype, "grouping", void 0);
    return ORealInputComponent;
}(OIntegerInputComponent));
export { ORealInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yZWFsLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9yZWFsLWlucHV0L28tcmVhbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFVLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd6SCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFxQixTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFDTCw4QkFBOEIsRUFDOUIsK0JBQStCLEVBQy9CLHNCQUFzQixHQUN2QixNQUFNLDRDQUE0QyxDQUFDO0FBRXBELE1BQU0sQ0FBQyxJQUFNLDJCQUEyQixvQkFDbkMsOEJBQThCO0lBQ2pDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0VBQ3ZDLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSw0QkFBNEIsb0JBQ3BDLCtCQUErQixDQUNuQyxDQUFDO0FBRUY7SUFReUMsK0NBQXNCO0lBaUI3RCw2QkFDd0QsSUFBb0IsRUFDMUUsS0FBaUIsRUFDakIsUUFBa0I7UUFIcEIsWUFLRSxrQkFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUU3QjtRQXJCRCxzQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFHN0Isc0JBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBRzdCLFVBQUksR0FBVyxJQUFJLENBQUM7UUFHcEIsY0FBUSxHQUFZLElBQUksQ0FBQztRQVd2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RlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElSZWFsUGlwZUFyZ3VtZW50LCBPUmVhbFBpcGUgfSBmcm9tICcuLi8uLi8uLi9waXBlcy9vLXJlYWwucGlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fSU5URUdFUl9JTlBVVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fSU5URUdFUl9JTlBVVCxcbiAgT0ludGVnZXJJbnB1dENvbXBvbmVudCxcbn0gZnJvbSAnLi4vaW50ZWdlci1pbnB1dC9vLWludGVnZXItaW5wdXQuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fUkVBTF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19JTlRFR0VSX0lOUFVULFxuICAnbWluRGVjaW1hbERpZ2l0czogbWluLWRlY2ltYWwtZGlnaXRzJyxcbiAgJ21heERlY2ltYWxEaWdpdHM6IG1heC1kZWNpbWFsLWRpZ2l0cycsXG4gICdkZWNpbWFsU2VwYXJhdG9yIDogZGVjaW1hbC1zZXBhcmF0b3InXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fUkVBTF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fSU5URUdFUl9JTlBVVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1yZWFsLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tcmVhbC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tcmVhbC1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fUkVBTF9JTlBVVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fUkVBTF9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPUmVhbElucHV0Q29tcG9uZW50IGV4dGVuZHMgT0ludGVnZXJJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgbWluRGVjaW1hbERpZ2l0czogbnVtYmVyID0gMjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXhEZWNpbWFsRGlnaXRzOiBudW1iZXIgPSAyO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHN0ZXA6IG51bWJlciA9IDAuMDE7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgZ3JvdXBpbmc6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHByb3RlY3RlZCBkZWNpbWFsU2VwYXJhdG9yOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBwaXBlQXJndW1lbnRzOiBJUmVhbFBpcGVBcmd1bWVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgICB0aGlzLl9kZWZhdWx0U1FMVHlwZUtleSA9ICdGTE9BVCc7XG4gIH1cblxuICBzZXRDb21wb25lbnRQaXBlKCk6IHZvaWQge1xuICAgIHRoaXMuY29tcG9uZW50UGlwZSA9IG5ldyBPUmVhbFBpcGUodGhpcy5pbmplY3Rvcik7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cy5kZWNpbWFsU2VwYXJhdG9yID0gdGhpcy5kZWNpbWFsU2VwYXJhdG9yO1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cy5taW5EZWNpbWFsRGlnaXRzID0gdGhpcy5taW5EZWNpbWFsRGlnaXRzO1xuICAgIHRoaXMucGlwZUFyZ3VtZW50cy5tYXhEZWNpbWFsRGlnaXRzID0gdGhpcy5tYXhEZWNpbWFsRGlnaXRzO1xuICB9XG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMubWluRGVjaW1hbERpZ2l0cykpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1pbkRlY2ltYWxEaWdpdHNWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1heERlY2ltYWxEaWdpdHMpKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5tYXhEZWNpbWFsRGlnaXRzVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbiAgfVxuXG4gIHByb3RlY3RlZCBtaW5EZWNpbWFsRGlnaXRzVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgbGV0IGN0cmxWYWx1ZTogc3RyaW5nID0gY29udHJvbC52YWx1ZTtcbiAgICBpZiAodHlwZW9mIGNvbnRyb2wudmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBjdHJsVmFsdWUgPSBjdHJsVmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKGN0cmxWYWx1ZSAmJiBjdHJsVmFsdWUubGVuZ3RoKSB7XG4gICAgICBjb25zdCB2YWxBcnJheSA9IGN0cmxWYWx1ZS5zcGxpdCh0aGlzLmRlY2ltYWxTZXBhcmF0b3IgPyB0aGlzLmRlY2ltYWxTZXBhcmF0b3IgOiAnLicpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMubWluRGVjaW1hbERpZ2l0cykgJiYgKHRoaXMubWluRGVjaW1hbERpZ2l0cyA+IDApICYmIFV0aWwuaXNEZWZpbmVkKHZhbEFycmF5WzFdKSAmJiAodmFsQXJyYXlbMV0ubGVuZ3RoIDwgdGhpcy5taW5EZWNpbWFsRGlnaXRzKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG1pbkRlY2ltYWxkaWdpdHM6IHtcbiAgICAgICAgICAgIHJlcXVpcmVkTWluRGVjaW1hbGRpZ2l0czogdGhpcy5taW5EZWNpbWFsRGlnaXRzXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF4RGVjaW1hbERpZ2l0c1ZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGxldCBjdHJsVmFsdWU6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgaWYgKHR5cGVvZiBjb250cm9sLnZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgY3RybFZhbHVlID0gY3RybFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChjdHJsVmFsdWUgJiYgY3RybFZhbHVlLmxlbmd0aCkge1xuICAgICAgY29uc3QgdmFsQXJyYXkgPSBjdHJsVmFsdWUuc3BsaXQodGhpcy5kZWNpbWFsU2VwYXJhdG9yID8gdGhpcy5kZWNpbWFsU2VwYXJhdG9yIDogJy4nKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1heERlY2ltYWxEaWdpdHMpICYmICh0aGlzLm1heERlY2ltYWxEaWdpdHMgPiAwKSAmJiBVdGlsLmlzRGVmaW5lZCh2YWxBcnJheVsxXSkgJiYgKHZhbEFycmF5WzFdLmxlbmd0aCA+IHRoaXMubWF4RGVjaW1hbERpZ2l0cykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBtYXhEZWNpbWFsZGlnaXRzOiB7XG4gICAgICAgICAgICByZXF1aXJlZE1heERlY2ltYWxkaWdpdHM6IHRoaXMubWF4RGVjaW1hbERpZ2l0c1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxpemVTdGVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0ZXAgPD0gMCkge1xuICAgICAgdGhpcy5zdGVwID0gMSAvIE1hdGgucG93KDEwLCB0aGlzLm1heERlY2ltYWxEaWdpdHMpO1xuICAgICAgY29uc29sZS53YXJuKCdgc3RlcGAgYXR0cmlidXRlIG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8nKTtcbiAgICB9XG4gIH1cblxufVxuIl19