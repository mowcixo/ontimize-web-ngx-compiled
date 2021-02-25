import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation, } from '@angular/core';
import { Validators } from '@angular/forms';
import { NumberConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export const DEFAULT_INPUTS_O_TEXT_INPUT = [
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
    'minLength: min-length',
    'maxLength: max-length'
];
export const DEFAULT_OUTPUTS_O_TEXT_INPUT = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OTextInputComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this._minLength = -1;
        this._maxLength = -1;
    }
    ngOnInit() {
        super.ngOnInit();
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (this.minLength >= 0) {
            validators.push(Validators.minLength(this.minLength));
        }
        if (this.maxLength >= 0) {
            validators.push(Validators.maxLength(this.maxLength));
        }
        return validators;
    }
    set minLength(val) {
        const old = this._minLength;
        this._minLength = NumberConverter(val);
        if (val !== old) {
            this.updateValidators();
        }
    }
    get minLength() {
        return this._minLength;
    }
    set maxLength(val) {
        const old = this._maxLength;
        this._maxLength = NumberConverter(val);
        if (val !== old) {
            this.updateValidators();
        }
    }
    get maxLength() {
        return this._maxLength;
    }
}
OTextInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-text-input',
                template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" [class.icon-field]=\"showClearButton\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput type=\"text\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" [readonly]=\"isReadOnly\"\n      (change)=\"onChangeEvent($event)\" [required]=\"isRequired\" />\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('minlength')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_LENGTH' | oTranslate }}: {{ getErrorValue('minlength', 'requiredLength') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('maxlength')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_LENGTH' | oTranslate }}: {{ getErrorValue('maxlength', 'requiredLength') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                inputs: DEFAULT_INPUTS_O_TEXT_INPUT,
                outputs: DEFAULT_OUTPUTS_O_TEXT_INPUT,
                encapsulation: ViewEncapsulation.None,
                styles: [""]
            }] }
];
OTextInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10ZXh0LWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBRVIsUUFBUSxFQUVSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHekQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQ0wsb0NBQW9DLEVBQ3BDLHFDQUFxQyxFQUNyQyxrQkFBa0IsR0FDbkIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRztJQUN6QyxHQUFHLG9DQUFvQztJQUN2Qyx1QkFBdUI7SUFDdkIsdUJBQXVCO0NBQ3hCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxHQUFHLHFDQUFxQztDQUN6QyxDQUFDO0FBV0YsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGtCQUFrQjtJQUt6RCxZQUN3RCxJQUFvQixFQUMxRSxLQUFpQixFQUNqQixRQUFrQjtRQUNsQixLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQVByQixlQUFVLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsZUFBVSxHQUFXLENBQUMsQ0FBQyxDQUFDO0lBT2xDLENBQUM7SUFFRCxRQUFRO1FBQ04sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLFVBQVUsR0FBa0IsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFNUQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsRUFBRTtZQUN2QixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUN2RDtRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxHQUFXO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO1lBQ2YsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxHQUFXO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO1lBQ2YsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7OztZQTVERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLHltREFBNEM7Z0JBRTVDLE1BQU0sRUFBRSwyQkFBMkI7Z0JBQ25DLE9BQU8sRUFBRSw0QkFBNEI7Z0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7O1lBeEJRLGNBQWMsdUJBZ0NsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUE3Q3RELFVBQVU7WUFHVixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhbGlkYXRvckZuLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0SW5wdXQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IE51bWJlckNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgT0Zvcm1EYXRhQ29tcG9uZW50LFxufSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gICdtaW5MZW5ndGg6IG1pbi1sZW5ndGgnLFxuICAnbWF4TGVuZ3RoOiBtYXgtbGVuZ3RoJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGV4dC1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRleHQtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRleHQtaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGV4dElucHV0Q29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcm90ZWN0ZWQgX21pbkxlbmd0aDogbnVtYmVyID0gLTE7XG4gIHByb3RlY3RlZCBfbWF4TGVuZ3RoOiBudW1iZXIgPSAtMTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuXG4gICAgaWYgKHRoaXMubWluTGVuZ3RoID49IDApIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLm1pbkxlbmd0aCh0aGlzLm1pbkxlbmd0aCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXhMZW5ndGggPj0gMCkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKFZhbGlkYXRvcnMubWF4TGVuZ3RoKHRoaXMubWF4TGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBzZXQgbWluTGVuZ3RoKHZhbDogbnVtYmVyKSB7XG4gICAgY29uc3Qgb2xkID0gdGhpcy5fbWluTGVuZ3RoO1xuICAgIHRoaXMuX21pbkxlbmd0aCA9IE51bWJlckNvbnZlcnRlcih2YWwpO1xuICAgIGlmICh2YWwgIT09IG9sZCkge1xuICAgICAgdGhpcy51cGRhdGVWYWxpZGF0b3JzKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1pbkxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9taW5MZW5ndGg7XG4gIH1cblxuICBzZXQgbWF4TGVuZ3RoKHZhbDogbnVtYmVyKSB7XG4gICAgY29uc3Qgb2xkID0gdGhpcy5fbWF4TGVuZ3RoO1xuICAgIHRoaXMuX21heExlbmd0aCA9IE51bWJlckNvbnZlcnRlcih2YWwpO1xuICAgIGlmICh2YWwgIT09IG9sZCkge1xuICAgICAgdGhpcy51cGRhdGVWYWxpZGF0b3JzKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG1heExlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tYXhMZW5ndGg7XG4gIH1cbn1cbiJdfQ==