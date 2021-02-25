import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export const DEFAULT_INPUTS_O_NIF_INPUT = [
    ...DEFAULT_INPUTS_O_TEXT_INPUT
];
export const DEFAULT_OUTPUTS_O_NIF_INPUT = [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];
export class ONIFInputComponent extends OTextInputComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        validators.push(OValidators.nifValidator);
        return validators;
    }
}
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
ONIFInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1uaWYtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L25pZi1pbnB1dC9vLW5pZi1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3pILE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUNMLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsbUJBQW1CLEdBQ3BCLE1BQU0sc0NBQXNDLENBQUM7QUFFOUMsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUc7SUFDeEMsR0FBRywyQkFBMkI7Q0FDL0IsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHO0lBQ3pDLEdBQUcsNEJBQTRCO0NBQ2hDLENBQUM7QUFVRixNQUFNLE9BQU8sa0JBQW1CLFNBQVEsbUJBQW1CO0lBRXpELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLFVBQVUsR0FBa0IsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFNUQsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUMsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzs7O1lBdEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsMm5EQUEyQztnQkFFM0MsTUFBTSxFQUFFLDBCQUEwQjtnQkFDbEMsT0FBTyxFQUFFLDJCQUEyQjtnQkFDcEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7WUF0QlEsY0FBYyx1QkEwQmxCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztZQTlCcEMsVUFBVTtZQUFzQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IE9WYWxpZGF0b3JzIH0gZnJvbSAnLi4vLi4vLi4vdmFsaWRhdG9ycy9vLXZhbGlkYXRvcnMnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVULFxuICBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVULFxuICBPVGV4dElucHV0Q29tcG9uZW50LFxufSBmcm9tICcuLi90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19OSUZfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX05JRl9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEVYVF9JTlBVVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1uaWYtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1uaWYtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLW5pZi1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTklGX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19OSUZfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT05JRklucHV0Q29tcG9uZW50IGV4dGVuZHMgT1RleHRJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIC8vIEluamVjdCBOSUYgdmFsaWRhdG9yXG4gICAgdmFsaWRhdG9ycy5wdXNoKE9WYWxpZGF0b3JzLm5pZlZhbGlkYXRvcik7XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxufVxuIl19