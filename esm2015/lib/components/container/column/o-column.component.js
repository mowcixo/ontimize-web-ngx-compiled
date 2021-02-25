import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';
export const DEFAULT_INPUTS_O_COLUMN = [
    ...DEFAULT_INPUTS_O_CONTAINER
];
export class OColumnComponent extends OContainerComponent {
    constructor(elRef, injector, matFormDefaultOption) {
        super(elRef, injector, matFormDefaultOption);
        this.elRef = elRef;
        this.injector = injector;
        this.matFormDefaultOption = matFormDefaultOption;
    }
}
OColumnComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-column',
                template: "<div #container fxLayout=\"column\" class=\"o-container\" fxFill>\n  <div #containerTitle *ngIf=\"hasHeader()\" fxLayoutAlign=\"start center\" class=\"o-container-title\" layout-padding>\n    <mat-icon *ngIf=\"icon\">{{ icon }}</mat-icon>\n    <span *ngIf=\"title\">{{ title | oTranslate }}</span>\n  </div>\n  <div [class.o-container-gap]=\"hasHeader() || (elevation > 0 && elevation <= 12)\" class=\"o-container-scroll o-scroll\">\n    <div class=\"o-container-outline\" *ngIf=\"isAppearanceOutline() && hasHeader()\">\n      <div class=\"o-container-outline-start\"></div>\n      <div class=\"o-container-outline-gap\"></div>\n      <div class=\"o-container-outline-end\"></div>\n    </div>\n    <div fxLayout=\"column\" fxLayoutAlign=\"{{ layoutAlign }}\" fxLayoutGap=\"{{ layoutGap }}\" fxFlex=\"grow\">\n      <ng-content></ng-content>\n    </div>\n</div>",
                inputs: DEFAULT_INPUTS_O_COLUMN,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-column]': 'true',
                    '[class.o-appearance-outline]': 'isAppearanceOutline()',
                    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
                },
                styles: [".o-column .o-container{flex:1;display:flex;flex-direction:column}.o-column .o-container .o-container-scroll{overflow:auto;position:relative}"]
            }] }
];
OColumnComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb2x1bW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9jb2x1bW4vby1jb2x1bW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRW5FLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRWpHLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ3JDLEdBQUcsMEJBQTBCO0NBQzlCLENBQUM7QUFjRixNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsbUJBQW1CO0lBRXZELFlBQ1ksS0FBaUIsRUFDakIsUUFBa0IsRUFDa0Msb0JBQW9CO1FBRWxGLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFKbkMsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2tDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBQTtJQUdwRixDQUFDOzs7WUFwQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxVQUFVO2dCQUNwQix5MkJBQXdDO2dCQUV4QyxNQUFNLEVBQUUsdUJBQXVCO2dCQUMvQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLGtCQUFrQixFQUFFLE1BQU07b0JBQzFCLDhCQUE4QixFQUFFLHVCQUF1QjtvQkFDdkQsb0NBQW9DLEVBQUUsK0JBQStCO2lCQUN0RTs7YUFDRjs7O1lBcEJtQixVQUFVO1lBQVUsUUFBUTs0Q0EwQjNDLFFBQVEsWUFBSSxNQUFNLFNBQUMsOEJBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVIsIE9Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9vLWNvbnRhaW5lci1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19DT0xVTU4gPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWNvbHVtbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWNvbHVtbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tY29sdW1uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19DT0xVTU4sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY29sdW1uXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm8tYXBwZWFyYW5jZS1vdXRsaW5lXSc6ICdpc0FwcGVhcmFuY2VPdXRsaW5lKCknLFxuICAgICdbY2xhc3Muby1hcHBlYXJhbmNlLW91dGxpbmUtdGl0bGVdJzogJ2hhc1RpdGxlSW5BcHBlYXJhbmNlT3V0bGluZSgpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Db2x1bW5Db21wb25lbnQgZXh0ZW5kcyBPQ29udGFpbmVyQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUykgcHJvdGVjdGVkIG1hdEZvcm1EZWZhdWx0T3B0aW9uXG4gICkge1xuICAgIHN1cGVyKGVsUmVmLCBpbmplY3RvciwgbWF0Rm9ybURlZmF1bHRPcHRpb24pO1xuICB9XG5cbn1cbiJdfQ==