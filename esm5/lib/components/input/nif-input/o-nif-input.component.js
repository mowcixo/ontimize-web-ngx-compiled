import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export var DEFAULT_INPUTS_O_NIF_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_TEXT_INPUT);
export var DEFAULT_OUTPUTS_O_NIF_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_INPUT);
var ONIFInputComponent = (function (_super) {
    tslib_1.__extends(ONIFInputComponent, _super);
    function ONIFInputComponent(form, elRef, injector) {
        return _super.call(this, form, elRef, injector) || this;
    }
    ONIFInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        validators.push(OValidators.nifValidator);
        return validators;
    };
    ONIFInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-nif-input',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput type=\"text\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" (change)=\"onChangeEvent($event)\"\n      [readonly]=\"isReadOnly\" [required]=\"isRequired\">\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-icon matSuffix [class.mat-disabled]=\"!enabled\" svgIcon=\"ontimize:perm_identity\"></mat-icon>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('invalidNIF')\" text=\"{{ 'FORM_VALIDATION.NIF_FORMAT' | oTranslate}}\"></mat-error>\n    <mat-error *ngIf=\"hasError('invalidNIFLetter')\" text=\"{{ 'FORM_VALIDATION.DNI_LETTER' | oTranslate}}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                    inputs: DEFAULT_INPUTS_O_NIF_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_NIF_INPUT,
                    encapsulation: ViewEncapsulation.None,
                    styles: [""]
                }] }
    ];
    ONIFInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return ONIFInputComponent;
}(OTextInputComponent));
export { ONIFInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1uaWYtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L25pZi1pbnB1dC9vLW5pZi1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFVLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd6SCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDL0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsNEJBQTRCLEVBQzVCLG1CQUFtQixHQUNwQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixvQkFDbEMsMkJBQTJCLENBQy9CLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSwyQkFBMkIsb0JBQ25DLDRCQUE0QixDQUNoQyxDQUFDO0FBRUY7SUFRd0MsOENBQW1CO0lBRXpELDRCQUN3RCxJQUFvQixFQUMxRSxLQUFpQixFQUNqQixRQUFrQjtlQUNsQixrQkFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBRUQsOENBQWlCLEdBQWpCO1FBQ0UsSUFBTSxVQUFVLEdBQWtCLGlCQUFNLGlCQUFpQixXQUFFLENBQUM7UUFFNUQsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUMsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzs7Z0JBdEJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsMm5EQUEyQztvQkFFM0MsTUFBTSxFQUFFLDBCQUEwQjtvQkFDbEMsT0FBTyxFQUFFLDJCQUEyQjtvQkFDcEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7O2dCQXRCUSxjQUFjLHVCQTBCbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7Z0JBOUJwQyxVQUFVO2dCQUFzQixRQUFROztJQTJDNUQseUJBQUM7Q0FBQSxBQXhCRCxDQVF3QyxtQkFBbUIsR0FnQjFEO1NBaEJZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25Jbml0LCBPcHRpb25hbCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBPVmFsaWRhdG9ycyB9IGZyb20gJy4uLy4uLy4uL3ZhbGlkYXRvcnMvby12YWxpZGF0b3JzJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVCxcbiAgT1RleHRJbnB1dENvbXBvbmVudCxcbn0gZnJvbSAnLi4vdGV4dC1pbnB1dC9vLXRleHQtaW5wdXQuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTklGX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19OSUZfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbmlmLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbmlmLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1uaWYtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX05JRl9JTlBVVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fTklGX0lOUFVULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE9OSUZJbnB1dENvbXBvbmVudCBleHRlbmRzIE9UZXh0SW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICAvLyBJbmplY3QgTklGIHZhbGlkYXRvclxuICAgIHZhbGlkYXRvcnMucHVzaChPVmFsaWRhdG9ycy5uaWZWYWxpZGF0b3IpO1xuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbn1cbiJdfQ==