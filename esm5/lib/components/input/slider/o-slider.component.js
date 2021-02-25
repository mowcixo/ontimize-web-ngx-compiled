import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { OFormComponent } from '../../../components/form/o-form.component';
import { InputConverter } from '../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export var DEFAULT_INPUTS_O_SLIDER_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, [
    'color',
    'invert',
    'max',
    'min',
    'step',
    'thumbLabel:thumb-label',
    'tickInterval:tick-interval',
    'layout',
    'oDisplayWith:display-with'
]);
export var DEFAULT_OUTPUTS_O_SLIDER_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OSliderComponent = (function (_super) {
    tslib_1.__extends(OSliderComponent, _super);
    function OSliderComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.layout = 'row';
        _this.vertical = false;
        _this.invert = false;
        _this.thumbLabel = false;
        _this.step = 1;
        _this._tickInterval = 0;
        return _this;
    }
    Object.defineProperty(OSliderComponent.prototype, "tickInterval", {
        get: function () {
            return this._tickInterval;
        },
        set: function (value) {
            this._tickInterval = value;
        },
        enumerable: true,
        configurable: true
    });
    OSliderComponent.prototype.onClickBlocker = function (evt) {
        evt.stopPropagation();
    };
    OSliderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-slider',
                    host: {
                        class: 'o-slider'
                    },
                    template: "<div [formGroup]=\"getFormGroup()\" class=\"relative\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-slider [color]=\"color\" [invert]=\"invert\" [max]=\"max\" [min]=\"min\" [step]=\"step\" [thumbLabel]=\"thumbLabel\"\n    [tickInterval]=\"tickInterval\" [vertical]=\"layout==='column'\" [id]=\"getAttribute()\"\n    [formControlName]=\"getAttribute()\" (change)=\"onChangeEvent($event)\" [displayWith]=\"oDisplayWith\"></mat-slider>\n  <div *ngIf=\"isReadOnly\" (click)=\"onClickBlocker($event)\" class=\"read-only-blocker\" fxFill></div>\n</div>",
                    inputs: DEFAULT_INPUTS_O_SLIDER_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_SLIDER_INPUT,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".o-slider mat-slider{width:100%}.o-slider .read-only-blocker{z-index:2;position:absolute;top:0;left:0;right:0}"]
                }] }
    ];
    OSliderComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OSliderComponent.prototype, "vertical", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OSliderComponent.prototype, "invert", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OSliderComponent.prototype, "thumbLabel", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OSliderComponent.prototype, "min", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OSliderComponent.prototype, "max", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OSliderComponent.prototype, "step", void 0);
    return OSliderComponent;
}(OFormDataComponent));
export { OSliderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NsaWRlci9vLXNsaWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMscUNBQXFDLEVBQ3JDLGtCQUFrQixHQUNuQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE1BQU0sQ0FBQyxJQUFNLDZCQUE2QixvQkFDckMsb0NBQW9DO0lBQ3ZDLE9BQU87SUFDUCxRQUFRO0lBQ1IsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sd0JBQXdCO0lBQ3hCLDRCQUE0QjtJQUM1QixRQUFRO0lBQ1IsMkJBQTJCO0VBQzVCLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSw4QkFBOEIsb0JBQ3RDLHFDQUFxQyxDQUN6QyxDQUFDO0FBSUY7SUFXc0MsNENBQWtCO0lBa0N0RCwwQkFDd0QsSUFBb0IsRUFDMUUsS0FBaUIsRUFDakIsUUFBa0I7UUFIcEIsWUFLRSxrQkFBTSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxTQUM3QjtRQXJDTSxZQUFNLEdBQXFCLEtBQUssQ0FBQztRQUdqQyxjQUFRLEdBQVksS0FBSyxDQUFDO1FBRzFCLFlBQU0sR0FBWSxLQUFLLENBQUM7UUFHeEIsZ0JBQVUsR0FBWSxLQUFLLENBQUM7UUFTbkMsVUFBSSxHQUFXLENBQUMsQ0FBQztRQVFqQixtQkFBYSxHQUFvQixDQUFDLENBQUM7O0lBV25DLENBQUM7SUFqQkQsc0JBQUksMENBQVk7YUFHaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQzthQUxELFVBQWlCLEtBQVU7WUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFpQkQseUNBQWMsR0FBZCxVQUFlLEdBQVU7UUFDdkIsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3hCLENBQUM7O2dCQXZERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFVBQVU7b0JBQ3BCLElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsVUFBVTtxQkFDbEI7b0JBQ0Qsd3NCQUFzQztvQkFFdEMsTUFBTSxFQUFFLDZCQUE2QjtvQkFDckMsT0FBTyxFQUFFLDhCQUE4QjtvQkFDdkMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7O2dCQXJDUSxjQUFjLHVCQXlFbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7Z0JBM0VwQyxVQUFVO2dCQUFzQixRQUFROztJQThDMUQ7UUFEQyxjQUFjLEVBQUU7O3NEQUNnQjtJQUdqQztRQURDLGNBQWMsRUFBRTs7b0RBQ2M7SUFHL0I7UUFEQyxjQUFjLEVBQUU7O3dEQUNrQjtJQUduQztRQURDLGNBQWMsRUFBRTs7aURBQ0w7SUFHWjtRQURDLGNBQWMsRUFBRTs7aURBQ0w7SUFHWjtRQURDLGNBQWMsRUFBRTs7a0RBQ0E7SUF5Qm5CLHVCQUFDO0NBQUEsQUF6REQsQ0FXc0Msa0JBQWtCLEdBOEN2RDtTQTlDWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2NvbXBvbmVudHMvZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICBERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICBPRm9ybURhdGFDb21wb25lbnQsXG59IGZyb20gJy4uLy4uL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1NMSURFUl9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnY29sb3InLFxuICAnaW52ZXJ0JyxcbiAgJ21heCcsXG4gICdtaW4nLFxuICAnc3RlcCcsXG4gICd0aHVtYkxhYmVsOnRodW1iLWxhYmVsJyxcbiAgJ3RpY2tJbnRlcnZhbDp0aWNrLWludGVydmFsJyxcbiAgJ2xheW91dCcsXG4gICdvRGlzcGxheVdpdGg6ZGlzcGxheS13aXRoJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1NMSURFUl9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuZXhwb3J0IHR5cGUgU2xpZGVyRGlzcGxheUZ1bmN0aW9uID0gKHZhbHVlOiBudW1iZXIgfCBudWxsKSA9PiBzdHJpbmcgfCBudW1iZXI7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tc2xpZGVyJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnby1zbGlkZXInXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnby1zbGlkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXNsaWRlci5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fU0xJREVSX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19TTElERVJfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT1NsaWRlckNvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCB7XG5cbiAgcHVibGljIGNvbG9yOiBzdHJpbmc7XG4gIHB1YmxpYyBsYXlvdXQ6ICdyb3cnIHwgJ2NvbHVtbicgPSAncm93JztcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdmVydGljYWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgaW52ZXJ0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHRodW1iTGFiZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtaW46IG51bWJlcjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXg6IG51bWJlcjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdGVwOiBudW1iZXIgPSAxO1xuXG4gIHNldCB0aWNrSW50ZXJ2YWwodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3RpY2tJbnRlcnZhbCA9IHZhbHVlO1xuICB9XG4gIGdldCB0aWNrSW50ZXJ2YWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RpY2tJbnRlcnZhbDtcbiAgfVxuICBfdGlja0ludGVydmFsOiAnYXV0bycgfCBudW1iZXIgPSAwO1xuXG5cbiAgb0Rpc3BsYXlXaXRoOiBTbGlkZXJEaXNwbGF5RnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gIH1cblxuICBvbkNsaWNrQmxvY2tlcihldnQ6IEV2ZW50KSB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbn1cbiJdfQ==