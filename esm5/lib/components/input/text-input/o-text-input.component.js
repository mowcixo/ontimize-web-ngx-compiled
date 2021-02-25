import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation, } from '@angular/core';
import { Validators } from '@angular/forms';
import { NumberConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export var DEFAULT_INPUTS_O_TEXT_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, [
    'minLength: min-length',
    'maxLength: max-length'
]);
export var DEFAULT_OUTPUTS_O_TEXT_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OTextInputComponent = (function (_super) {
    tslib_1.__extends(OTextInputComponent, _super);
    function OTextInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this._minLength = -1;
        _this._maxLength = -1;
        return _this;
    }
    OTextInputComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    OTextInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (this.minLength >= 0) {
            validators.push(Validators.minLength(this.minLength));
        }
        if (this.maxLength >= 0) {
            validators.push(Validators.maxLength(this.maxLength));
        }
        return validators;
    };
    Object.defineProperty(OTextInputComponent.prototype, "minLength", {
        get: function () {
            return this._minLength;
        },
        set: function (val) {
            var old = this._minLength;
            this._minLength = NumberConverter(val);
            if (val !== old) {
                this.updateValidators();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTextInputComponent.prototype, "maxLength", {
        get: function () {
            return this._maxLength;
        },
        set: function (val) {
            var old = this._maxLength;
            this._maxLength = NumberConverter(val);
            if (val !== old) {
                this.updateValidators();
            }
        },
        enumerable: true,
        configurable: true
    });
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
    OTextInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OTextInputComponent;
}(OFormDataComponent));
export { OTextInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10ZXh0LWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFFUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFlLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN0RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUNMLG9DQUFvQyxFQUNwQyxxQ0FBcUMsRUFDckMsa0JBQWtCLEdBQ25CLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsTUFBTSxDQUFDLElBQU0sMkJBQTJCLG9CQUNuQyxvQ0FBb0M7SUFDdkMsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtFQUN4QixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sNEJBQTRCLG9CQUNwQyxxQ0FBcUMsQ0FDekMsQ0FBQztBQUVGO0lBU3lDLCtDQUFrQjtJQUt6RCw2QkFDd0QsSUFBb0IsRUFDMUUsS0FBaUIsRUFDakIsUUFBa0I7UUFIcEIsWUFJRSxrQkFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUM3QjtRQVJTLGdCQUFVLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDeEIsZ0JBQVUsR0FBVyxDQUFDLENBQUMsQ0FBQzs7SUFPbEMsQ0FBQztJQUVELHNDQUFRLEdBQVI7UUFDRSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsK0NBQWlCLEdBQWpCO1FBQ0UsSUFBTSxVQUFVLEdBQWtCLGlCQUFNLGlCQUFpQixXQUFFLENBQUM7UUFFNUQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsRUFBRTtZQUN2QixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUN2RDtRQUVELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxzQkFBSSwwQ0FBUzthQVFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7YUFWRCxVQUFjLEdBQVc7WUFDdkIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7YUFDekI7UUFDSCxDQUFDOzs7T0FBQTtJQU1ELHNCQUFJLDBDQUFTO2FBUWI7WUFDRSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDekIsQ0FBQzthQVZELFVBQWMsR0FBVztZQUN2QixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtnQkFDZixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN6QjtRQUNILENBQUM7OztPQUFBOztnQkF4REYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxjQUFjO29CQUN4Qix5bURBQTRDO29CQUU1QyxNQUFNLEVBQUUsMkJBQTJCO29CQUNuQyxPQUFPLEVBQUUsNEJBQTRCO29CQUNyQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7aUJBQ3RDOzs7Z0JBeEJRLGNBQWMsdUJBZ0NsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkE3Q3RELFVBQVU7Z0JBR1YsUUFBUTs7SUF3RlYsMEJBQUM7Q0FBQSxBQTdERCxDQVN5QyxrQkFBa0IsR0FvRDFEO1NBcERZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWYWxpZGF0b3JGbiwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEVYVF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnbWluTGVuZ3RoOiBtaW4tbGVuZ3RoJyxcbiAgJ21heExlbmd0aDogbWF4LWxlbmd0aCdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRleHQtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10ZXh0LWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10ZXh0LWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuXG5leHBvcnQgY2xhc3MgT1RleHRJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIF9taW5MZW5ndGg6IG51bWJlciA9IC0xO1xuICBwcm90ZWN0ZWQgX21heExlbmd0aDogbnVtYmVyID0gLTE7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcblxuICAgIGlmICh0aGlzLm1pbkxlbmd0aCA+PSAwKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2goVmFsaWRhdG9ycy5taW5MZW5ndGgodGhpcy5taW5MZW5ndGgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF4TGVuZ3RoID49IDApIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLm1heExlbmd0aCh0aGlzLm1heExlbmd0aCkpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgc2V0IG1pbkxlbmd0aCh2YWw6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZCA9IHRoaXMuX21pbkxlbmd0aDtcbiAgICB0aGlzLl9taW5MZW5ndGggPSBOdW1iZXJDb252ZXJ0ZXIodmFsKTtcbiAgICBpZiAodmFsICE9PSBvbGQpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsaWRhdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBtaW5MZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluTGVuZ3RoO1xuICB9XG5cbiAgc2V0IG1heExlbmd0aCh2YWw6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZCA9IHRoaXMuX21heExlbmd0aDtcbiAgICB0aGlzLl9tYXhMZW5ndGggPSBOdW1iZXJDb252ZXJ0ZXIodmFsKTtcbiAgICBpZiAodmFsICE9PSBvbGQpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsaWRhdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBtYXhMZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4TGVuZ3RoO1xuICB9XG59XG4iXX0=