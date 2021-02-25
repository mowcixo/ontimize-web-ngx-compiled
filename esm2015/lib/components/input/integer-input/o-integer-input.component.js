import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { OIntegerPipe } from '../../../pipes/o-integer.pipe';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export const DEFAULT_INPUTS_O_INTEGER_INPUT = [
    ...DEFAULT_INPUTS_O_TEXT_INPUT,
    'min',
    'max',
    'step',
    'grouping',
    'thousandSeparator : thousand-separator',
    'olocale : locale'
];
export const DEFAULT_OUTPUTS_O_INTEGER_INPUT = [
    ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];
export class OIntegerInputComponent extends OTextInputComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.inputType = 'number';
        this.step = 1;
        this.grouping = false;
        this._defaultSQLTypeKey = 'INTEGER';
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            this.inputType = 'text';
        }
        this.setComponentPipe();
    }
    initialize() {
        super.initialize();
        this.initializeStep();
    }
    setComponentPipe() {
        this.componentPipe = new OIntegerPipe(this.injector);
    }
    ngOnInit() {
        super.ngOnInit();
        this.pipeArguments = {
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator,
            locale: this.olocale
        };
        if (this.step === undefined) {
            this.step = 1;
        }
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
    }
    setData(value) {
        super.setData(value);
        setTimeout(() => {
            this.setPipeValue();
        }, 0);
    }
    setValue(val, options) {
        super.setValue(val, options);
        this.setPipeValue();
    }
    innerOnFocus(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isReadOnly) {
            return;
        }
        this.setNumberDOMValue(this.getValue());
        super.innerOnFocus(event);
    }
    innerOnBlur(event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (this.isReadOnly) {
            return;
        }
        this.setPipeValue();
        const formControl = this.getControl();
        if (formControl) {
            formControl.updateValueAndValidity();
        }
        super.innerOnBlur(event);
    }
    setPipeValue() {
        if (typeof this.pipeArguments !== 'undefined' && !this.isEmpty()) {
            const parsedValue = this.componentPipe.transform(this.getValue(), this.pipeArguments);
            this.setTextDOMValue(parsedValue);
        }
    }
    isEmpty() {
        if (this.value instanceof OFormValue) {
            if (this.value.value !== undefined) {
                return false;
            }
        }
        return true;
    }
    getInputEl() {
        let inputElement;
        if (this.elRef.nativeElement.tagName === 'INPUT') {
            inputElement = this.elRef.nativeElement;
        }
        else {
            inputElement = this.elRef.nativeElement.getElementsByTagName('INPUT')[0];
        }
        return inputElement;
    }
    setNumberDOMValue(val) {
        const inputElement = this.getInputEl();
        if (Util.isDefined(inputElement)) {
            if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
                inputElement.type = 'number';
            }
            inputElement.value = (val !== undefined) ? val : '';
        }
    }
    setTextDOMValue(val) {
        const inputElement = this.getInputEl();
        if (Util.isDefined(inputElement)) {
            if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
                inputElement.type = 'text';
            }
            inputElement.value = (val !== undefined) ? val : '';
        }
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (Util.isDefined(this.min)) {
            validators.push(this.minValidator.bind(this));
        }
        if (Util.isDefined(this.max)) {
            validators.push(this.maxValidator.bind(this));
        }
        return validators;
    }
    minValidator(control) {
        if ((typeof (control.value) === 'number') && (control.value < this.min)) {
            return {
                min: {
                    requiredMin: this.min
                }
            };
        }
        return {};
    }
    maxValidator(control) {
        if ((typeof (control.value) === 'number') && (this.max < control.value)) {
            return {
                max: {
                    requiredMax: this.max
                }
            };
        }
        return {};
    }
    initializeStep() {
        if (this.step <= 0) {
            this.step = 1;
            console.warn('`step` attribute must be greater than zero');
        }
    }
}
OIntegerInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-integer-input',
                template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\"\n  [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\"  [hideRequiredMarker]=\"hideRequiredMarker\" [class.custom-width]=\"hasCustomWidth\"\n    [class.icon-field]=\"showClearButton\" fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput [type]=\"inputType\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" (change)=\"onChangeEvent($event)\" [readonly]=\"isReadOnly\"\n      [min]=\"min\" [max]=\"max\" [step]=\"step\" [required]=\"isRequired\">\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('min')\" text=\"{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}: {{ getErrorValue('min', 'requiredMin') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('max')\" text=\"{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}: {{ getErrorValue('max', 'requiredMax') }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                inputs: DEFAULT_INPUTS_O_INTEGER_INPUT,
                outputs: DEFAULT_OUTPUTS_O_INTEGER_INPUT,
                encapsulation: ViewEncapsulation.None,
                styles: [""]
            }] }
];
OIntegerInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OIntegerInputComponent.prototype, "min", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OIntegerInputComponent.prototype, "max", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OIntegerInputComponent.prototype, "step", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OIntegerInputComponent.prototype, "grouping", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbnRlZ2VyLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9pbnRlZ2VyLWlucHV0L28taW50ZWdlci1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBd0IsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFbkYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUNMLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsbUJBQW1CLEdBQ3BCLE1BQU0sc0NBQXNDLENBQUM7QUFFOUMsTUFBTSxDQUFDLE1BQU0sOEJBQThCLEdBQUc7SUFDNUMsR0FBRywyQkFBMkI7SUFDOUIsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sVUFBVTtJQUNWLHdDQUF3QztJQUN4QyxrQkFBa0I7Q0FDbkIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFHO0lBQzdDLEdBQUcsNEJBQTRCO0NBQ2hDLENBQUM7QUFVRixNQUFNLE9BQU8sc0JBQXVCLFNBQVEsbUJBQW1CO0lBbUI3RCxZQUN3RCxJQUFvQixFQUMxRSxLQUFpQixFQUNqQixRQUFrQjtRQUVsQixLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztR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UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFUyxZQUFZLENBQUMsT0FBb0I7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUN2RSxPQUFPO2dCQUNMLEdBQUcsRUFBRTtvQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUc7aUJBQ3RCO2FBQ0YsQ0FBQztTQUNIO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRVMsY0FBYztRQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQzs7O1lBbE1GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQiw4bERBQStDO2dCQUUvQyxNQUFNLEVBQUUsOEJBQThCO2dCQUN0QyxPQUFPLEVBQUUsK0JBQStCO2dCQUN4QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQTdCUSxjQUFjLHVCQWtEbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBaEV0RCxVQUFVO1lBR1YsUUFBUTs7QUE4Q1I7SUFEQyxjQUFjLEVBQUU7O21EQUNMO0FBRVo7SUFEQyxjQUFjLEVBQUU7O21EQUNMO0FBRVo7SUFEQyxjQUFjLEVBQUU7O29EQUNBO0FBR2pCO0lBREMsY0FBYyxFQUFFOzt3REFDbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJSW50ZWdlclBpcGVBcmd1bWVudCwgT0ludGVnZXJQaXBlIH0gZnJvbSAnLi4vLi4vLi4vcGlwZXMvby1pbnRlZ2VyLnBpcGUnO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVQsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVQsXG4gIE9UZXh0SW5wdXRDb21wb25lbnQsXG59IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0lOVEVHRVJfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVCxcbiAgJ21pbicsXG4gICdtYXgnLFxuICAnc3RlcCcsXG4gICdncm91cGluZycsXG4gICd0aG91c2FuZFNlcGFyYXRvciA6IHRob3VzYW5kLXNlcGFyYXRvcicsXG4gICdvbG9jYWxlIDogbG9jYWxlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0lOVEVHRVJfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RFWFRfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28taW50ZWdlci1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWludGVnZXItaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWludGVnZXItaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0lOVEVHRVJfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0lOVEVHRVJfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT0ludGVnZXJJbnB1dENvbXBvbmVudCBleHRlbmRzIE9UZXh0SW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xuXG4gIGlucHV0VHlwZTogc3RyaW5nID0gJ251bWJlcic7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgbWluOiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heDogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdGVwOiBudW1iZXIgPSAxO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBncm91cGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgdGhvdXNhbmRTZXBhcmF0b3I6IHN0cmluZztcbiAgcHJvdGVjdGVkIG9sb2NhbGU6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgY29tcG9uZW50UGlwZTogT0ludGVnZXJQaXBlO1xuICBwcm90ZWN0ZWQgcGlwZUFyZ3VtZW50czogSUludGVnZXJQaXBlQXJndW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnSU5URUdFUic7XG5cbiAgICAvLyBGaXJlZm94IHdvcmthcm91bmRcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA+IC0xKSB7XG4gICAgICB0aGlzLmlucHV0VHlwZSA9ICd0ZXh0JztcbiAgICB9XG5cbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZVN0ZXAoKTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFBpcGUoKSB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9JbnRlZ2VyUGlwZSh0aGlzLmluamVjdG9yKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICB0aGlzLnBpcGVBcmd1bWVudHMgPSB7XG4gICAgICBncm91cGluZzogdGhpcy5ncm91cGluZyxcbiAgICAgIHRob3VzYW5kU2VwYXJhdG9yOiB0aGlzLnRob3VzYW5kU2VwYXJhdG9yLFxuICAgICAgbG9jYWxlOiB0aGlzLm9sb2NhbGVcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RlcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnN0ZXAgPSAxO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgfVxuXG4gIHNldERhdGEodmFsdWU6IGFueSkge1xuICAgIHN1cGVyLnNldERhdGEodmFsdWUpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRQaXBlVmFsdWUoKTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIHNldFZhbHVlKHZhbDogYW55LCBvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucykge1xuICAgIHN1cGVyLnNldFZhbHVlKHZhbCwgb3B0aW9ucyk7XG4gICAgdGhpcy5zZXRQaXBlVmFsdWUoKTtcbiAgfVxuXG4gIGlubmVyT25Gb2N1cyhldmVudDogYW55KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAodGhpcy5pc1JlYWRPbmx5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2V0TnVtYmVyRE9NVmFsdWUodGhpcy5nZXRWYWx1ZSgpKTtcbiAgICBzdXBlci5pbm5lck9uRm9jdXMoZXZlbnQpO1xuICB9XG5cbiAgaW5uZXJPbkJsdXIoZXZlbnQ/OiBhbnkpIHtcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNSZWFkT25seSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNldFBpcGVWYWx1ZSgpO1xuICAgIGNvbnN0IGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCA9IHRoaXMuZ2V0Q29udHJvbCgpO1xuICAgIGlmIChmb3JtQ29udHJvbCkge1xuICAgICAgZm9ybUNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIH1cbiAgICBzdXBlci5pbm5lck9uQmx1cihldmVudCk7XG4gIH1cblxuICBzZXRQaXBlVmFsdWUoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBpcGVBcmd1bWVudHMgIT09ICd1bmRlZmluZWQnICYmICF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgY29uc3QgcGFyc2VkVmFsdWUgPSB0aGlzLmNvbXBvbmVudFBpcGUudHJhbnNmb3JtKHRoaXMuZ2V0VmFsdWUoKSwgdGhpcy5waXBlQXJndW1lbnRzKTtcbiAgICAgIHRoaXMuc2V0VGV4dERPTVZhbHVlKHBhcnNlZFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgaWYgKHRoaXMudmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZ2V0SW5wdXRFbCgpIHtcbiAgICBsZXQgaW5wdXRFbGVtZW50O1xuICAgIGlmICh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQudGFnTmFtZSA9PT0gJ0lOUFVUJykge1xuICAgICAgaW5wdXRFbGVtZW50ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dEVsZW1lbnQgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ0lOUFVUJylbMF07XG4gICAgfVxuICAgIHJldHVybiBpbnB1dEVsZW1lbnQ7XG4gIH1cblxuICBzZXROdW1iZXJET01WYWx1ZSh2YWw6IGFueSkge1xuICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IHRoaXMuZ2V0SW5wdXRFbCgpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChpbnB1dEVsZW1lbnQpKSB7XG4gICAgICAvLyBGaXJlZm94IHdvcmthcm91bmRcbiAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID09PSAtMSkge1xuICAgICAgICBpbnB1dEVsZW1lbnQudHlwZSA9ICdudW1iZXInO1xuICAgICAgfVxuICAgICAgaW5wdXRFbGVtZW50LnZhbHVlID0gKHZhbCAhPT0gdW5kZWZpbmVkKSA/IHZhbCA6ICcnO1xuICAgIH1cbiAgfVxuXG4gIHNldFRleHRET01WYWx1ZSh2YWw6IGFueSkge1xuICAgIGNvbnN0IGlucHV0RWxlbWVudCA9IHRoaXMuZ2V0SW5wdXRFbCgpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChpbnB1dEVsZW1lbnQpKSB7XG4gICAgICAvLyBGaXJlZm94IHdvcmthcm91bmRcbiAgICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID09PSAtMSkge1xuICAgICAgICBpbnB1dEVsZW1lbnQudHlwZSA9ICd0ZXh0JztcbiAgICAgIH1cbiAgICAgIGlucHV0RWxlbWVudC52YWx1ZSA9ICh2YWwgIT09IHVuZGVmaW5lZCkgPyB2YWwgOiAnJztcbiAgICB9XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5taW4pKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5taW5WYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1heCkpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1heFZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWluVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKCh0eXBlb2YgKGNvbnRyb2wudmFsdWUpID09PSAnbnVtYmVyJykgJiYgKGNvbnRyb2wudmFsdWUgPCB0aGlzLm1pbikpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbjoge1xuICAgICAgICAgIHJlcXVpcmVkTWluOiB0aGlzLm1pblxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF4VmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKCh0eXBlb2YgKGNvbnRyb2wudmFsdWUpID09PSAnbnVtYmVyJykgJiYgKHRoaXMubWF4IDwgY29udHJvbC52YWx1ZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heDoge1xuICAgICAgICAgIHJlcXVpcmVkTWF4OiB0aGlzLm1heFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgaW5pdGlhbGl6ZVN0ZXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RlcCA8PSAwKSB7XG4gICAgICB0aGlzLnN0ZXAgPSAxO1xuICAgICAgY29uc29sZS53YXJuKCdgc3RlcGAgYXR0cmlidXRlIG11c3QgYmUgZ3JlYXRlciB0aGFuIHplcm8nKTtcbiAgICB9XG4gIH1cblxufVxuIl19