import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT, ORealInputComponent, } from '../real-input/o-real-input.component';
export const DEFAULT_INPUTS_O_PERCENT_INPUT = [
    ...DEFAULT_INPUTS_O_REAL_INPUT
];
export const DEFAULT_OUTPUTS_O_PERCENT_INPUT = [
    ...DEFAULT_OUTPUTS_O_REAL_INPUT
];
export class OPercentInputComponent extends ORealInputComponent {
    constructor() {
        super(...arguments);
        this.grouping = true;
    }
    ngOnInit() {
        if (typeof (this.min) === 'undefined') {
            this.min = 0;
        }
        if (typeof (this.max) === 'undefined') {
            this.max = 100;
        }
        super.ngOnInit();
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wZXJjZW50LWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9wZXJjZW50LWlucHV0L28tcGVyY2VudC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsNEJBQTRCLEVBQzVCLG1CQUFtQixHQUNwQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHO0lBQzVDLEdBQUcsMkJBQTJCO0NBQy9CLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRztJQUM3QyxHQUFHLDRCQUE0QjtDQUNoQyxDQUFDO0FBVUYsTUFBTSxPQUFPLHNCQUF1QixTQUFRLG1CQUFtQjtJQVIvRDs7UUFXRSxhQUFRLEdBQVksSUFBSSxDQUFDO0lBVzNCLENBQUM7SUFUUSxRQUFRO1FBQ2IsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNyQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNkO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNyQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUNoQjtRQUNELEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7WUFyQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLHlyRUFBK0M7Z0JBRS9DLE1BQU0sRUFBRSw4QkFBOEI7Z0JBQ3RDLE9BQU8sRUFBRSwrQkFBK0I7Z0JBQ3hDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7QUFJQztJQURDLGNBQWMsRUFBRTs7d0RBQ1EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1JFQUxfSU5QVVQsXG4gIERFRkFVTFRfT1VUUFVUU19PX1JFQUxfSU5QVVQsXG4gIE9SZWFsSW5wdXRDb21wb25lbnQsXG59IGZyb20gJy4uL3JlYWwtaW5wdXQvby1yZWFsLWlucHV0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1BFUkNFTlRfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fUkVBTF9JTlBVVFxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1BFUkNFTlRfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1JFQUxfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tcGVyY2VudC1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXBlcmNlbnQtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXBlcmNlbnQtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1BFUkNFTlRfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1BFUkNFTlRfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT1BlcmNlbnRJbnB1dENvbXBvbmVudCBleHRlbmRzIE9SZWFsSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGdyb3VwaW5nOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgaWYgKHR5cGVvZiAodGhpcy5taW4pID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5taW4gPSAwO1xuICAgIH1cbiAgICBpZiAodHlwZW9mICh0aGlzLm1heCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLm1heCA9IDEwMDtcbiAgICB9XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgfVxufVxuIl19