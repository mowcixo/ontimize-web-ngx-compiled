import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';
export const DEFAULT_INPUTS_O_ROW = [
    ...DEFAULT_INPUTS_O_CONTAINER
];
export class ORowComponent extends OContainerComponent {
    constructor(elRef, injector, matFormDefaultOption) {
        super(elRef, injector, matFormDefaultOption);
        this.elRef = elRef;
        this.injector = injector;
        this.matFormDefaultOption = matFormDefaultOption;
    }
}
ORowComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-row',
                template: "<div #container fxLayout=\"column\" class=\"o-container\" fxFill>\n  <div #containerTitle *ngIf=\"hasHeader()\" fxLayoutAlign=\"start center\" class=\"o-container-title\" layout-padding>\n    <mat-icon *ngIf=\"icon\">{{ icon }}</mat-icon>\n    <span *ngIf=\"title\">{{ title | oTranslate }}</span>\n  </div>\n  <div [class.o-container-gap]=\"hasHeader() || (elevation > 0 && elevation <= 12)\" class=\"o-container-scroll o-scroll\">\n    <div class=\"o-container-outline\" *ngIf=\"isAppearanceOutline() && hasHeader()\">\n      <div class=\"o-container-outline-start\"></div>\n      <div class=\"o-container-outline-gap\"></div>\n      <div class=\"o-container-outline-end\"></div>\n    </div>\n    <div fxLayout=\"row\" fxLayoutAlign=\"{{ layoutAlign }}\" fxLayoutGap=\"{{ layoutGap }}\" fxFlex=\"grow\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</div>",
                inputs: DEFAULT_INPUTS_O_ROW,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-row]': 'true',
                    '[class.o-appearance-outline]': 'isAppearanceOutline()',
                    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
                },
                styles: [".o-row>.o-container{width:100%}.o-row>.o-container .o-container-scroll{overflow:auto;position:relative}"]
            }] }
];
ORowComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9yb3cvby1yb3cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRW5FLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBRWpHLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHO0lBQ2xDLEdBQUcsMEJBQTBCO0NBQzlCLENBQUM7QUFjRixNQUFNLE9BQU8sYUFBYyxTQUFRLG1CQUFtQjtJQUVwRCxZQUNZLEtBQWlCLEVBQ2pCLFFBQWtCLEVBQ2tDLG9CQUFvQjtRQUVsRixLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1FBSm5DLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNrQyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQUE7SUFHcEYsQ0FBQzs7O1lBcEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsT0FBTztnQkFDakIsZzNCQUFxQztnQkFFckMsTUFBTSxFQUFFLG9CQUFvQjtnQkFDNUIsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixlQUFlLEVBQUUsTUFBTTtvQkFDdkIsOEJBQThCLEVBQUUsdUJBQXVCO29CQUN2RCxvQ0FBb0MsRUFBRSwrQkFBK0I7aUJBQ3RFOzthQUNGOzs7WUFwQm1CLFVBQVU7WUFBVSxRQUFROzRDQTBCM0MsUUFBUSxZQUFJLE1BQU0sU0FBQyw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0NPTlRBSU5FUiwgT0NvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4uL28tY29udGFpbmVyLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1JPVyA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVJcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tcm93JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tcm93LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1yb3cuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1JPVyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1yb3ddJzogJ3RydWUnLFxuICAgICdbY2xhc3Muby1hcHBlYXJhbmNlLW91dGxpbmVdJzogJ2lzQXBwZWFyYW5jZU91dGxpbmUoKScsXG4gICAgJ1tjbGFzcy5vLWFwcGVhcmFuY2Utb3V0bGluZS10aXRsZV0nOiAnaGFzVGl0bGVJbkFwcGVhcmFuY2VPdXRsaW5lKCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1Jvd0NvbXBvbmVudCBleHRlbmRzIE9Db250YWluZXJDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TKSBwcm90ZWN0ZWQgbWF0Rm9ybURlZmF1bHRPcHRpb25cbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIGluamVjdG9yLCBtYXRGb3JtRGVmYXVsdE9wdGlvbik7XG4gIH1cblxufVxuIl19