import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export var DEFAULT_INPUTS_O_TEXTAREA_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_TEXT_INPUT, [
    'columns',
    'rows'
]);
export var DEFAULT_OUTPUTS_O_TEXTAREA_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_INPUT);
var OTextareaInputComponent = (function (_super) {
    tslib_1.__extends(OTextareaInputComponent, _super);
    function OTextareaInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.rows = 5;
        _this.columns = 3;
        return _this;
    }
    OTextareaInputComponent.prototype.isResizable = function () {
        var resizable = true;
        if (!this.enabled || this.isReadOnly) {
            resizable = false;
        }
        return resizable;
    };
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
    OTextareaInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTextareaInputComponent.prototype, "rows", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTextareaInputComponent.prototype, "columns", void 0);
    return OTextareaInputComponent;
}(OTextInputComponent));
export { OTextareaInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10ZXh0YXJlYS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvdGV4dGFyZWEtaW5wdXQvby10ZXh0YXJlYS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsNEJBQTRCLEVBQzVCLG1CQUFtQixHQUNwQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE1BQU0sQ0FBQyxJQUFNLCtCQUErQixvQkFDdkMsMkJBQTJCO0lBQzlCLFNBQVM7SUFDVCxNQUFNO0VBQ1AsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLGdDQUFnQyxvQkFDeEMsNEJBQTRCLENBQ2hDLENBQUM7QUFFRjtJQVE2QyxtREFBbUI7SUFPOUQsaUNBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSHBCLFlBSUUsa0JBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FDN0I7UUFUTSxVQUFJLEdBQVcsQ0FBQyxDQUFDO1FBRWpCLGFBQU8sR0FBVyxDQUFDLENBQUM7O0lBTzNCLENBQUM7SUFFTSw2Q0FBVyxHQUFsQjtRQUNFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDbkI7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDOztnQkE1QkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLHVvQ0FBZ0Q7b0JBRWhELE1BQU0sRUFBRSwrQkFBK0I7b0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7b0JBQ3pDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztpQkFDdEM7OztnQkF4QlEsY0FBYyx1QkFpQ2xCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxjQUFjLEVBQWQsQ0FBYyxDQUFDO2dCQXBDcEMsVUFBVTtnQkFBc0IsUUFBUTs7SUErQjFEO1FBREMsY0FBYyxFQUFFOzt5REFDTztJQUV4QjtRQURDLGNBQWMsRUFBRTs7NERBQ1U7SUFpQjdCLDhCQUFDO0NBQUEsQUE5QkQsQ0FRNkMsbUJBQW1CLEdBc0IvRDtTQXRCWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVCxcbiAgT1RleHRJbnB1dENvbXBvbmVudCxcbn0gZnJvbSAnLi4vdGV4dC1pbnB1dC9vLXRleHQtaW5wdXQuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEVYVEFSRUFfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVCxcbiAgJ2NvbHVtbnMnLFxuICAncm93cydcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19URVhUQVJFQV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10ZXh0YXJlYS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRleHRhcmVhLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10ZXh0YXJlYS1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEVYVEFSRUFfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RFWFRBUkVBX0lOUFVULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE9UZXh0YXJlYUlucHV0Q29tcG9uZW50IGV4dGVuZHMgT1RleHRJbnB1dENvbXBvbmVudCB7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHJvd3M6IG51bWJlciA9IDU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBjb2x1bW5zOiBudW1iZXIgPSAzO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gIH1cblxuICBwdWJsaWMgaXNSZXNpemFibGUoKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc2l6YWJsZSA9IHRydWU7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQgfHwgdGhpcy5pc1JlYWRPbmx5KSB7XG4gICAgICByZXNpemFibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc2l6YWJsZTtcbiAgfVxuXG59XG4iXX0=