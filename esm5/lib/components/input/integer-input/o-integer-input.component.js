import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { OIntegerPipe } from '../../../pipes/o-integer.pipe';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_TEXT_INPUT, DEFAULT_OUTPUTS_O_TEXT_INPUT, OTextInputComponent, } from '../text-input/o-text-input.component';
export var DEFAULT_INPUTS_O_INTEGER_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_TEXT_INPUT, [
    'min',
    'max',
    'step',
    'grouping',
    'thousandSeparator : thousand-separator',
    'olocale : locale'
]);
export var DEFAULT_OUTPUTS_O_INTEGER_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_INPUT);
var OIntegerInputComponent = (function (_super) {
    tslib_1.__extends(OIntegerInputComponent, _super);
    function OIntegerInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.inputType = 'number';
        _this.step = 1;
        _this.grouping = false;
        _this._defaultSQLTypeKey = 'INTEGER';
        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            _this.inputType = 'text';
        }
        _this.setComponentPipe();
        return _this;
    }
    OIntegerInputComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.initializeStep();
    };
    OIntegerInputComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OIntegerPipe(this.injector);
    };
    OIntegerInputComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pipeArguments = {
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator,
            locale: this.olocale
        };
        if (this.step === undefined) {
            this.step = 1;
        }
    };
    OIntegerInputComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
    };
    OIntegerInputComponent.prototype.setData = function (value) {
        var _this = this;
        _super.prototype.setData.call(this, value);
        setTimeout(function () {
            _this.setPipeValue();
        }, 0);
    };
    OIntegerInputComponent.prototype.setValue = function (val, options) {
        _super.prototype.setValue.call(this, val, options);
        this.setPipeValue();
    };
    OIntegerInputComponent.prototype.innerOnFocus = function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isReadOnly) {
            return;
        }
        this.setNumberDOMValue(this.getValue());
        _super.prototype.innerOnFocus.call(this, event);
    };
    OIntegerInputComponent.prototype.innerOnBlur = function (event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        if (this.isReadOnly) {
            return;
        }
        this.setPipeValue();
        var formControl = this.getControl();
        if (formControl) {
            formControl.updateValueAndValidity();
        }
        _super.prototype.innerOnBlur.call(this, event);
    };
    OIntegerInputComponent.prototype.setPipeValue = function () {
        if (typeof this.pipeArguments !== 'undefined' && !this.isEmpty()) {
            var parsedValue = this.componentPipe.transform(this.getValue(), this.pipeArguments);
            this.setTextDOMValue(parsedValue);
        }
    };
    OIntegerInputComponent.prototype.isEmpty = function () {
        if (this.value instanceof OFormValue) {
            if (this.value.value !== undefined) {
                return false;
            }
        }
        return true;
    };
    OIntegerInputComponent.prototype.getInputEl = function () {
        var inputElement;
        if (this.elRef.nativeElement.tagName === 'INPUT') {
            inputElement = this.elRef.nativeElement;
        }
        else {
            inputElement = this.elRef.nativeElement.getElementsByTagName('INPUT')[0];
        }
        return inputElement;
    };
    OIntegerInputComponent.prototype.setNumberDOMValue = function (val) {
        var inputElement = this.getInputEl();
        if (Util.isDefined(inputElement)) {
            if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
                inputElement.type = 'number';
            }
            inputElement.value = (val !== undefined) ? val : '';
        }
    };
    OIntegerInputComponent.prototype.setTextDOMValue = function (val) {
        var inputElement = this.getInputEl();
        if (Util.isDefined(inputElement)) {
            if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
                inputElement.type = 'text';
            }
            inputElement.value = (val !== undefined) ? val : '';
        }
    };
    OIntegerInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (Util.isDefined(this.min)) {
            validators.push(this.minValidator.bind(this));
        }
        if (Util.isDefined(this.max)) {
            validators.push(this.maxValidator.bind(this));
        }
        return validators;
    };
    OIntegerInputComponent.prototype.minValidator = function (control) {
        if ((typeof (control.value) === 'number') && (control.value < this.min)) {
            return {
                min: {
                    requiredMin: this.min
                }
            };
        }
        return {};
    };
    OIntegerInputComponent.prototype.maxValidator = function (control) {
        if ((typeof (control.value) === 'number') && (this.max < control.value)) {
            return {
                max: {
                    requiredMax: this.max
                }
            };
        }
        return {};
    };
    OIntegerInputComponent.prototype.initializeStep = function () {
        if (this.step <= 0) {
            this.step = 1;
            console.warn('`step` attribute must be greater than zero');
        }
    };
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
    OIntegerInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
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
    return OIntegerInputComponent;
}(OTextInputComponent));
export { OIntegerInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbnRlZ2VyLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9pbnRlZ2VyLWlucHV0L28taW50ZWdlci1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBd0IsWUFBWSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFbkYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDbkQsT0FBTyxFQUNMLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsbUJBQW1CLEdBQ3BCLE1BQU0sc0NBQXNDLENBQUM7QUFFOUMsTUFBTSxDQUFDLElBQU0sOEJBQThCLG9CQUN0QywyQkFBMkI7SUFDOUIsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sVUFBVTtJQUNWLHdDQUF3QztJQUN4QyxrQkFBa0I7RUFDbkIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLCtCQUErQixvQkFDdkMsNEJBQTRCLENBQ2hDLENBQUM7QUFFRjtJQVE0QyxrREFBbUI7SUFtQjdELGdDQUN3RCxJQUFvQixFQUMxRSxLQUFpQixFQUNqQixRQUFrQjtRQUhwQixZQUtFLGtCQUFNLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLFNBUzdCO1FBL0JELGVBQVMsR0FBVyxRQUFRLENBQUM7UUFPN0Is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bnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUludGVnZXJQaXBlQXJndW1lbnQsIE9JbnRlZ2VyUGlwZSB9IGZyb20gJy4uLy4uLy4uL3BpcGVzL28taW50ZWdlci5waXBlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuLi8uLi9mb3JtL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19URVhUX0lOUFVULFxuICBERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVULFxuICBPVGV4dElucHV0Q29tcG9uZW50LFxufSBmcm9tICcuLi90ZXh0LWlucHV0L28tdGV4dC1pbnB1dC5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19JTlRFR0VSX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RFWFRfSU5QVVQsXG4gICdtaW4nLFxuICAnbWF4JyxcbiAgJ3N0ZXAnLFxuICAnZ3JvdXBpbmcnLFxuICAndGhvdXNhbmRTZXBhcmF0b3IgOiB0aG91c2FuZC1zZXBhcmF0b3InLFxuICAnb2xvY2FsZSA6IGxvY2FsZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19JTlRFR0VSX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19URVhUX0lOUFVUXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWludGVnZXItaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1pbnRlZ2VyLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1pbnRlZ2VyLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19JTlRFR0VSX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19JTlRFR0VSX0lOUFVULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE9JbnRlZ2VySW5wdXRDb21wb25lbnQgZXh0ZW5kcyBPVGV4dElucHV0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcblxuICBpbnB1dFR5cGU6IHN0cmluZyA9ICdudW1iZXInO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbjogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXg6IG51bWJlcjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc3RlcDogbnVtYmVyID0gMTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgZ3JvdXBpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIHRob3VzYW5kU2VwYXJhdG9yOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvbG9jYWxlOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGNvbXBvbmVudFBpcGU6IE9JbnRlZ2VyUGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElJbnRlZ2VyUGlwZUFyZ3VtZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2RlZmF1bHRTUUxUeXBlS2V5ID0gJ0lOVEVHRVInO1xuXG4gICAgLy8gRmlyZWZveCB3b3JrYXJvdW5kXG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdmaXJlZm94JykgPiAtMSkge1xuICAgICAgdGhpcy5pbnB1dFR5cGUgPSAndGV4dCc7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRDb21wb25lbnRQaXBlKCk7XG4gIH1cblxuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmluaXRpYWxpemVTdGVwKCk7XG4gIH1cblxuICBzZXRDb21wb25lbnRQaXBlKCkge1xuICAgIHRoaXMuY29tcG9uZW50UGlwZSA9IG5ldyBPSW50ZWdlclBpcGUodGhpcy5pbmplY3Rvcik7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgdGhpcy5waXBlQXJndW1lbnRzID0ge1xuICAgICAgZ3JvdXBpbmc6IHRoaXMuZ3JvdXBpbmcsXG4gICAgICB0aG91c2FuZFNlcGFyYXRvcjogdGhpcy50aG91c2FuZFNlcGFyYXRvcixcbiAgICAgIGxvY2FsZTogdGhpcy5vbG9jYWxlXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0ZXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zdGVwID0gMTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gIH1cblxuICBzZXREYXRhKHZhbHVlOiBhbnkpIHtcbiAgICBzdXBlci5zZXREYXRhKHZhbHVlKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0UGlwZVZhbHVlKCk7XG4gICAgfSwgMCk7XG4gIH1cblxuICBzZXRWYWx1ZSh2YWw6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMpIHtcbiAgICBzdXBlci5zZXRWYWx1ZSh2YWwsIG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0UGlwZVZhbHVlKCk7XG4gIH1cblxuICBpbm5lck9uRm9jdXMoZXZlbnQ6IGFueSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuaXNSZWFkT25seSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNldE51bWJlckRPTVZhbHVlKHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgc3VwZXIuaW5uZXJPbkZvY3VzKGV2ZW50KTtcbiAgfVxuXG4gIGlubmVyT25CbHVyKGV2ZW50PzogYW55KSB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzUmVhZE9ubHkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5zZXRQaXBlVmFsdWUoKTtcbiAgICBjb25zdCBmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wgPSB0aGlzLmdldENvbnRyb2woKTtcbiAgICBpZiAoZm9ybUNvbnRyb2wpIHtcbiAgICAgIGZvcm1Db250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB9XG4gICAgc3VwZXIuaW5uZXJPbkJsdXIoZXZlbnQpO1xuICB9XG5cbiAgc2V0UGlwZVZhbHVlKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5waXBlQXJndW1lbnRzICE9PSAndW5kZWZpbmVkJyAmJiAhdGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gdGhpcy5jb21wb25lbnRQaXBlLnRyYW5zZm9ybSh0aGlzLmdldFZhbHVlKCksIHRoaXMucGlwZUFyZ3VtZW50cyk7XG4gICAgICB0aGlzLnNldFRleHRET01WYWx1ZShwYXJzZWRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGdldElucHV0RWwoKSB7XG4gICAgbGV0IGlucHV0RWxlbWVudDtcbiAgICBpZiAodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcpIHtcbiAgICAgIGlucHV0RWxlbWVudCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudDtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRFbGVtZW50ID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdJTlBVVCcpWzBdO1xuICAgIH1cbiAgICByZXR1cm4gaW5wdXRFbGVtZW50O1xuICB9XG5cbiAgc2V0TnVtYmVyRE9NVmFsdWUodmFsOiBhbnkpIHtcbiAgICBjb25zdCBpbnB1dEVsZW1lbnQgPSB0aGlzLmdldElucHV0RWwoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoaW5wdXRFbGVtZW50KSkge1xuICAgICAgLy8gRmlyZWZveCB3b3JrYXJvdW5kXG4gICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA9PT0gLTEpIHtcbiAgICAgICAgaW5wdXRFbGVtZW50LnR5cGUgPSAnbnVtYmVyJztcbiAgICAgIH1cbiAgICAgIGlucHV0RWxlbWVudC52YWx1ZSA9ICh2YWwgIT09IHVuZGVmaW5lZCkgPyB2YWwgOiAnJztcbiAgICB9XG4gIH1cblxuICBzZXRUZXh0RE9NVmFsdWUodmFsOiBhbnkpIHtcbiAgICBjb25zdCBpbnB1dEVsZW1lbnQgPSB0aGlzLmdldElucHV0RWwoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoaW5wdXRFbGVtZW50KSkge1xuICAgICAgLy8gRmlyZWZveCB3b3JrYXJvdW5kXG4gICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ2ZpcmVmb3gnKSA9PT0gLTEpIHtcbiAgICAgICAgaW5wdXRFbGVtZW50LnR5cGUgPSAndGV4dCc7XG4gICAgICB9XG4gICAgICBpbnB1dEVsZW1lbnQudmFsdWUgPSAodmFsICE9PSB1bmRlZmluZWQpID8gdmFsIDogJyc7XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMubWluKSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWluVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5tYXgpKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5tYXhWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1pblZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmICgodHlwZW9mIChjb250cm9sLnZhbHVlKSA9PT0gJ251bWJlcicpICYmIChjb250cm9sLnZhbHVlIDwgdGhpcy5taW4pKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW46IHtcbiAgICAgICAgICByZXF1aXJlZE1pbjogdGhpcy5taW5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIG1heFZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmICgodHlwZW9mIChjb250cm9sLnZhbHVlKSA9PT0gJ251bWJlcicpICYmICh0aGlzLm1heCA8IGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtYXg6IHtcbiAgICAgICAgICByZXF1aXJlZE1heDogdGhpcy5tYXhcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIGluaXRpYWxpemVTdGVwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN0ZXAgPD0gMCkge1xuICAgICAgdGhpcy5zdGVwID0gMTtcbiAgICAgIGNvbnNvbGUud2FybignYHN0ZXBgIGF0dHJpYnV0ZSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiB6ZXJvJyk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==