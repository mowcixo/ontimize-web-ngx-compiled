import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export const DEFAULT_INPUTS_O_TEXTAREA_INPUT = [
    ...DEFAULT_INPUTS_O_TEXT_INPUT,
    'columns',
    'rows'
];
export const DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];
export class OTextareaInputComponent extends OTextInputComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.rows = 5;
        this.columns = 3;
    }
    isResizable() {
        let resizable = true;
        if (!this.enabled || this.isReadOnly) {
            resizable = false;
        }
        return resizable;
    }
}
OTextareaInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-textarea-input',
                template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <textarea matInput class=\"mat-textarea\" type=\"text\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [placeholder]=\"placeHolder\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" [readonly]=\"isReadOnly\"\n      [class.no-resize]=\"!isResizable()\" [rows]=\"rows\" [cols]=\"columns\" [required]=\"isRequired\"\n      (change)=\"onChangeEvent($event)\"></textarea>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                inputs: DEFAULT_INPUTS_O_TEXTAREA_INPUT,
                outputs: DEFAULT_OUTPUTS_O_TEXTAREA_INPUT,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-textarea.no-resize{resize:none}.mat-textarea{resize:vertical}"]
            }] }
];
OTextareaInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTextareaInputComponent.prototype, "rows", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTextareaInputComponent.prototype, "columns", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10ZXh0YXJlYS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvdGV4dGFyZWEtaW5wdXQvby10ZXh0YXJlYS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsNEJBQTRCLEVBQzVCLG1CQUFtQixHQUNwQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFHO0lBQzdDLEdBQUcsMkJBQTJCO0lBQzlCLFNBQVM7SUFDVCxNQUFNO0NBQ1AsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHO0lBQzlDLEdBQUcsNEJBQTRCO0NBQ2hDLENBQUM7QUFVRixNQUFNLE9BQU8sdUJBQXdCLFNBQVEsbUJBQW1CO0lBTzlELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBUnhCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFFakIsWUFBTyxHQUFXLENBQUMsQ0FBQztJQU8zQixDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7O1lBNUJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1Qix1b0NBQWdEO2dCQUVoRCxNQUFNLEVBQUUsK0JBQStCO2dCQUN2QyxPQUFPLEVBQUUsZ0NBQWdDO2dCQUN6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQXhCUSxjQUFjLHVCQWlDbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBcENwQyxVQUFVO1lBQXNCLFFBQVE7O0FBK0IxRDtJQURDLGNBQWMsRUFBRTs7cURBQ087QUFFeEI7SUFEQyxjQUFjLEVBQUU7O3dEQUNVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVQsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVQsXG4gIE9UZXh0SW5wdXRDb21wb25lbnQsXG59IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RFWFRBUkVBX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVQsXG4gICdjb2x1bW5zJyxcbiAgJ3Jvd3MnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEVYVEFSRUFfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGV4dGFyZWEtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10ZXh0YXJlYS1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGV4dGFyZWEtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RFWFRBUkVBX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19URVhUQVJFQV9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPVGV4dGFyZWFJbnB1dENvbXBvbmVudCBleHRlbmRzIE9UZXh0SW5wdXRDb21wb25lbnQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyByb3dzOiBudW1iZXIgPSA1O1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgY29sdW1uczogbnVtYmVyID0gMztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICB9XG5cbiAgcHVibGljIGlzUmVzaXphYmxlKCk6IGJvb2xlYW4ge1xuICAgIGxldCByZXNpemFibGUgPSB0cnVlO1xuICAgIGlmICghdGhpcy5lbmFibGVkIHx8IHRoaXMuaXNSZWFkT25seSkge1xuICAgICAgcmVzaXphYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiByZXNpemFibGU7XG4gIH1cblxufVxuIl19