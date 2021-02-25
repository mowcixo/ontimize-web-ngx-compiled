import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { ORealPipe } from '../../../pipes/o-real.pipe';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_INTEGER_INPUT, DEFAULT_OUTPUTS_O_INTEGER_INPUT, OIntegerInputComponent, } from '../integer-input/o-integer-input.component';
export const DEFAULT_INPUTS_O_REAL_INPUT = [
    ...DEFAULT_INPUTS_O_INTEGER_INPUT,
    'minDecimalDigits: min-decimal-digits',
    'maxDecimalDigits: max-decimal-digits',
    'decimalSeparator : decimal-separator'
];
export const DEFAULT_OUTPUTS_O_REAL_INPUT = [
    ...DEFAULT_OUTPUTS_O_INTEGER_INPUT
];
export class ORealInputComponent extends OIntegerInputComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.minDecimalDigits = 2;
        this.maxDecimalDigits = 2;
        this.step = 0.01;
        this.grouping = true;
        this._defaultSQLTypeKey = 'FLOAT';
    }
    setComponentPipe() {
        this.componentPipe = new ORealPipe(this.injector);
    }
    ngOnInit() {
        super.ngOnInit();
        this.pipeArguments.decimalSeparator = this.decimalSeparator;
        this.pipeArguments.minDecimalDigits = this.minDecimalDigits;
        this.pipeArguments.maxDecimalDigits = this.maxDecimalDigits;
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (Util.isDefined(this.minDecimalDigits)) {
            validators.push(this.minDecimalDigitsValidator.bind(this));
        }
        if (Util.isDefined(this.maxDecimalDigits)) {
            validators.push(this.maxDecimalDigitsValidator.bind(this));
        }
        return validators;
    }
    minDecimalDigitsValidator(control) {
        let ctrlValue = control.value;
        if (typeof control.value === 'number') {
            ctrlValue = ctrlValue.toString();
        }
        if (ctrlValue && ctrlValue.length) {
            const valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
            if (Util.isDefined(this.minDecimalDigits) && (this.minDecimalDigits > 0) && Util.isDefined(valArray[1]) && (valArray[1].length < this.minDecimalDigits)) {
                return {
                    minDecimaldigits: {
                        requiredMinDecimaldigits: this.minDecimalDigits
                    }
                };
            }
        }
        return {};
    }
    maxDecimalDigitsValidator(control) {
        let ctrlValue = control.value;
        if (typeof control.value === 'number') {
            ctrlValue = ctrlValue.toString();
        }
        if (ctrlValue && ctrlValue.length) {
            const valArray = ctrlValue.split(this.decimalSeparator ? this.decimalSeparator : '.');
            if (Util.isDefined(this.maxDecimalDigits) && (this.maxDecimalDigits > 0) && Util.isDefined(valArray[1]) && (valArray[1].length > this.maxDecimalDigits)) {
                return {
                    maxDecimaldigits: {
                        requiredMaxDecimaldigits: this.maxDecimalDigits
                    }
                };
            }
        }
        return {};
    }
    initializeStep() {
        if (this.step <= 0) {
            this.step = 1 / Math.pow(10, this.maxDecimalDigits);
            console.warn('`step` attribute must be greater than zero');
        }
    }
}
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
ORealInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yZWFsLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9yZWFsLWlucHV0L28tcmVhbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFVLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd6SCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFxQixTQUFTLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFDTCw4QkFBOEIsRUFDOUIsK0JBQStCLEVBQy9CLHNCQUFzQixHQUN2QixNQUFNLDRDQUE0QyxDQUFDO0FBRXBELE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHO0lBQ3pDLEdBQUcsOEJBQThCO0lBQ2pDLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0NBQ3ZDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxHQUFHLCtCQUErQjtDQUNuQyxDQUFDO0FBVUYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLHNCQUFzQjtJQWlCN0QsWUFDd0QsSUFBb0IsRUFDMUUsS0FBaUIsRUFDakIsUUFBa0I7UUFFbEIsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFuQi9CLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUc3QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFHN0IsU0FBSSxHQUFXLElBQUksQ0FB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d2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25Jbml0LCBPcHRpb25hbCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJUmVhbFBpcGVBcmd1bWVudCwgT1JlYWxQaXBlIH0gZnJvbSAnLi4vLi4vLi4vcGlwZXMvby1yZWFsLnBpcGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0lOVEVHRVJfSU5QVVQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0lOVEVHRVJfSU5QVVQsXG4gIE9JbnRlZ2VySW5wdXRDb21wb25lbnQsXG59IGZyb20gJy4uL2ludGVnZXItaW5wdXQvby1pbnRlZ2VyLWlucHV0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1JFQUxfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fSU5URUdFUl9JTlBVVCxcbiAgJ21pbkRlY2ltYWxEaWdpdHM6IG1pbi1kZWNpbWFsLWRpZ2l0cycsXG4gICdtYXhEZWNpbWFsRGlnaXRzOiBtYXgtZGVjaW1hbC1kaWdpdHMnLFxuICAnZGVjaW1hbFNlcGFyYXRvciA6IGRlY2ltYWwtc2VwYXJhdG9yJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1JFQUxfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0lOVEVHRVJfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tcmVhbC1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXJlYWwtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXJlYWwtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1JFQUxfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1JFQUxfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT1JlYWxJbnB1dENvbXBvbmVudCBleHRlbmRzIE9JbnRlZ2VySW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbkRlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgbWF4RGVjaW1hbERpZ2l0czogbnVtYmVyID0gMjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdGVwOiBudW1iZXIgPSAwLjAxO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGdyb3VwaW5nOiBib29sZWFuID0gdHJ1ZTtcblxuICBwcm90ZWN0ZWQgZGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcGlwZUFyZ3VtZW50czogSVJlYWxQaXBlQXJndW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnRkxPQVQnO1xuICB9XG5cbiAgc2V0Q29tcG9uZW50UGlwZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBvbmVudFBpcGUgPSBuZXcgT1JlYWxQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICB0aGlzLnBpcGVBcmd1bWVudHMuZGVjaW1hbFNlcGFyYXRvciA9IHRoaXMuZGVjaW1hbFNlcGFyYXRvcjtcbiAgICB0aGlzLnBpcGVBcmd1bWVudHMubWluRGVjaW1hbERpZ2l0cyA9IHRoaXMubWluRGVjaW1hbERpZ2l0cztcbiAgICB0aGlzLnBpcGVBcmd1bWVudHMubWF4RGVjaW1hbERpZ2l0cyA9IHRoaXMubWF4RGVjaW1hbERpZ2l0cztcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1pbkRlY2ltYWxEaWdpdHMpKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5taW5EZWNpbWFsRGlnaXRzVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5tYXhEZWNpbWFsRGlnaXRzKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4RGVjaW1hbERpZ2l0c1ZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWluRGVjaW1hbERpZ2l0c1ZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGxldCBjdHJsVmFsdWU6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgaWYgKHR5cGVvZiBjb250cm9sLnZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgY3RybFZhbHVlID0gY3RybFZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmIChjdHJsVmFsdWUgJiYgY3RybFZhbHVlLmxlbmd0aCkge1xuICAgICAgY29uc3QgdmFsQXJyYXkgPSBjdHJsVmFsdWUuc3BsaXQodGhpcy5kZWNpbWFsU2VwYXJhdG9yID8gdGhpcy5kZWNpbWFsU2VwYXJhdG9yIDogJy4nKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1pbkRlY2ltYWxEaWdpdHMpICYmICh0aGlzLm1pbkRlY2ltYWxEaWdpdHMgPiAwKSAmJiBVdGlsLmlzRGVmaW5lZCh2YWxBcnJheVsxXSkgJiYgKHZhbEFycmF5WzFdLmxlbmd0aCA8IHRoaXMubWluRGVjaW1hbERpZ2l0cykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBtaW5EZWNpbWFsZGlnaXRzOiB7XG4gICAgICAgICAgICByZXF1aXJlZE1pbkRlY2ltYWxkaWdpdHM6IHRoaXMubWluRGVjaW1hbERpZ2l0c1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIG1heERlY2ltYWxEaWdpdHNWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBsZXQgY3RybFZhbHVlOiBzdHJpbmcgPSBjb250cm9sLnZhbHVlO1xuICAgIGlmICh0eXBlb2YgY29udHJvbC52YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGN0cmxWYWx1ZSA9IGN0cmxWYWx1ZS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoY3RybFZhbHVlICYmIGN0cmxWYWx1ZS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHZhbEFycmF5ID0gY3RybFZhbHVlLnNwbGl0KHRoaXMuZGVjaW1hbFNlcGFyYXRvciA/IHRoaXMuZGVjaW1hbFNlcGFyYXRvciA6ICcuJyk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5tYXhEZWNpbWFsRGlnaXRzKSAmJiAodGhpcy5tYXhEZWNpbWFsRGlnaXRzID4gMCkgJiYgVXRpbC5pc0RlZmluZWQodmFsQXJyYXlbMV0pICYmICh2YWxBcnJheVsxXS5sZW5ndGggPiB0aGlzLm1heERlY2ltYWxEaWdpdHMpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbWF4RGVjaW1hbGRpZ2l0czoge1xuICAgICAgICAgICAgcmVxdWlyZWRNYXhEZWNpbWFsZGlnaXRzOiB0aGlzLm1heERlY2ltYWxEaWdpdHNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0aWFsaXplU3RlcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGVwIDw9IDApIHtcbiAgICAgIHRoaXMuc3RlcCA9IDEgLyBNYXRoLnBvdygxMCwgdGhpcy5tYXhEZWNpbWFsRGlnaXRzKTtcbiAgICAgIGNvbnNvbGUud2FybignYHN0ZXBgIGF0dHJpYnV0ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB6ZXJvJyk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==