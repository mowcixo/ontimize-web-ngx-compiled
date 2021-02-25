import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { OFormComponent } from '../../../components/form/o-form.component';
import { InputConverter } from '../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export const DEFAULT_INPUTS_O_SLIDER_INPUT = [
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
    'color',
    'invert',
    'max',
    'min',
    'step',
    'thumbLabel:thumb-label',
    'tickInterval:tick-interval',
    'layout',
    'oDisplayWith:display-with'
];
export const DEFAULT_OUTPUTS_O_SLIDER_INPUT = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OSliderComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.layout = 'row';
        this.vertical = false;
        this.invert = false;
        this.thumbLabel = false;
        this.step = 1;
        this._tickInterval = 0;
    }
    set tickInterval(value) {
        this._tickInterval = value;
    }
    get tickInterval() {
        return this._tickInterval;
    }
    onClickBlocker(evt) {
        evt.stopPropagation();
    }
}
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
OSliderComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbGlkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NsaWRlci9vLXNsaWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMscUNBQXFDLEVBQ3JDLGtCQUFrQixHQUNuQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHO0lBQzNDLEdBQUcsb0NBQW9DO0lBQ3ZDLE9BQU87SUFDUCxRQUFRO0lBQ1IsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sd0JBQXdCO0lBQ3hCLDRCQUE0QjtJQUM1QixRQUFRO0lBQ1IsMkJBQTJCO0NBQzVCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw4QkFBOEIsR0FBRztJQUM1QyxHQUFHLHFDQUFxQztDQUN6QyxDQUFDO0FBZUYsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGtCQUFrQjtJQWtDdEQsWUFDd0QsSUFBb0IsRUFDMUUsS0FBaUIsRUFDakIsUUFBa0I7UUFFbEIsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFwQ3hCLFdBQU0sR0FBcUIsS0FBSyxDQUFDO1FBR2pDLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFHMUIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUd4QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBU25DLFNBQUksR0FBVyxDQUFDLENBQUM7UUFRakIsa0JBQWEsR0FBb0IsQ0FBQyxDQUFDO0lBV25DLENBQUM7SUFqQkQsSUFBSSxZQUFZLENBQUMsS0FBVTtRQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFjRCxjQUFjLENBQUMsR0FBVTtRQUN2QixHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDeEIsQ0FBQzs7O1lBdkRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxVQUFVO2lCQUNsQjtnQkFDRCx3c0JBQXNDO2dCQUV0QyxNQUFNLEVBQUUsNkJBQTZCO2dCQUNyQyxPQUFPLEVBQUUsOEJBQThCO2dCQUN2QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQXJDUSxjQUFjLHVCQXlFbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBM0VwQyxVQUFVO1lBQXNCLFFBQVE7O0FBOEMxRDtJQURDLGNBQWMsRUFBRTs7a0RBQ2dCO0FBR2pDO0lBREMsY0FBYyxFQUFFOztnREFDYztBQUcvQjtJQURDLGNBQWMsRUFBRTs7b0RBQ2tCO0FBR25DO0lBREMsY0FBYyxFQUFFOzs2Q0FDTDtBQUdaO0lBREMsY0FBYyxFQUFFOzs2Q0FDTDtBQUdaO0lBREMsY0FBYyxFQUFFOzs4Q0FDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vY29tcG9uZW50cy9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fU0xJREVSX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gICdjb2xvcicsXG4gICdpbnZlcnQnLFxuICAnbWF4JyxcbiAgJ21pbicsXG4gICdzdGVwJyxcbiAgJ3RodW1iTGFiZWw6dGh1bWItbGFiZWwnLFxuICAndGlja0ludGVydmFsOnRpY2staW50ZXJ2YWwnLFxuICAnbGF5b3V0JyxcbiAgJ29EaXNwbGF5V2l0aDpkaXNwbGF5LXdpdGgnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fU0xJREVSX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5leHBvcnQgdHlwZSBTbGlkZXJEaXNwbGF5RnVuY3Rpb24gPSAodmFsdWU6IG51bWJlciB8IG51bGwpID0+IHN0cmluZyB8IG51bWJlcjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1zbGlkZXInLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdvLXNsaWRlcidcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdvLXNsaWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tc2xpZGVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19TTElERVJfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1NMSURFUl9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPU2xpZGVyQ29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IHtcblxuICBwdWJsaWMgY29sb3I6IHN0cmluZztcbiAgcHVibGljIGxheW91dDogJ3JvdycgfCAnY29sdW1uJyA9ICdyb3cnO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyB2ZXJ0aWNhbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBpbnZlcnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdGh1bWJMYWJlbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbjogbnVtYmVyO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heDogbnVtYmVyO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHN0ZXA6IG51bWJlciA9IDE7XG5cbiAgc2V0IHRpY2tJbnRlcnZhbCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fdGlja0ludGVydmFsID0gdmFsdWU7XG4gIH1cbiAgZ2V0IHRpY2tJbnRlcnZhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdGlja0ludGVydmFsO1xuICB9XG4gIF90aWNrSW50ZXJ2YWw6ICdhdXRvJyB8IG51bWJlciA9IDA7XG5cblxuICBvRGlzcGxheVdpdGg6IFNsaWRlckRpc3BsYXlGdW5jdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgfVxuXG4gIG9uQ2xpY2tCbG9ja2VyKGV2dDogRXZlbnQpIHtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxufVxuIl19