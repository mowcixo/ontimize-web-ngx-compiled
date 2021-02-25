import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export const DEFAULT_INPUTS_O_EMAIL_INPUT = [
    ...DEFAULT_INPUTS_O_TEXT_INPUT
];
export const DEFAULT_OUTPUTS_O_EMAIL_INPUT = [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];
export class OEmailInputComponent extends OTextInputComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        validators.push(OValidators.emailValidator);
        return validators;
    }
}
OEmailInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-email-input',
                template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput type=\"email\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" [readonly]=\"isReadOnly\" [required]=\"isRequired\"\n      (change)=\"onChangeEvent($event)\">\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-icon matSuffix [class.mat-disabled]=\"!enabled\" svgIcon=\"ontimize:mail_outline\"></mat-icon>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('minlength')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_LENGTH' | oTranslate }}: {{ getErrorValue('minlength', 'requiredLength') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('maxlength')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_LENGTH' | oTranslate }}: {{ getErrorValue('maxlength', 'requiredLength') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('invalidEmailAddress')\" text=\"{{ 'FORM_VALIDATION.EMAIL_FORMAT' | oTranslate }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                inputs: DEFAULT_INPUTS_O_EMAIL_INPUT,
                outputs: DEFAULT_OUTPUTS_O_EMAIL_INPUT,
                encapsulation: ViewEncapsulation.None,
                styles: [""]
            }] }
];
OEmailInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1lbWFpbC1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvZW1haWwtaW5wdXQvby1lbWFpbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3pILE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUNMLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsbUJBQW1CLEdBQ3BCLE1BQU0sc0NBQXNDLENBQUM7QUFFOUMsTUFBTSxDQUFDLE1BQU0sNEJBQTRCLEdBQUc7SUFDMUMsR0FBRywyQkFBMkI7Q0FDL0IsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHO0lBQzNDLEdBQUcsNEJBQTRCO0NBQ2hDLENBQUM7QUFVRixNQUFNLE9BQU8sb0JBQXFCLFNBQVEsbUJBQW1CO0lBRTNELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLFVBQVUsR0FBa0IsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFNUQsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUMsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzs7O1lBdEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsKzNEQUE2QztnQkFFN0MsTUFBTSxFQUFFLDRCQUE0QjtnQkFDcEMsT0FBTyxFQUFFLDZCQUE2QjtnQkFDdEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7WUF0QlEsY0FBYyx1QkEwQmxCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztZQTlCcEMsVUFBVTtZQUFzQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IE9WYWxpZGF0b3JzIH0gZnJvbSAnLi4vLi4vLi4vdmFsaWRhdG9ycy9vLXZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVULFxuICBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVULFxuICBPVGV4dElucHV0Q29tcG9uZW50LFxufSBmcm9tICcuLi90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19FTUFJTF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVUXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fRU1BSUxfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZW1haWwtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1lbWFpbC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZW1haWwtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0VNQUlMX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19FTUFJTF9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPRW1haWxJbnB1dENvbXBvbmVudCBleHRlbmRzIE9UZXh0SW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICAvLyBJbmplY3QgZW1haWwgdmFsaWRhdG9yXG4gICAgdmFsaWRhdG9ycy5wdXNoKE9WYWxpZGF0b3JzLmVtYWlsVmFsaWRhdG9yKTtcbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbiAgfVxuXG59XG4iXX0=