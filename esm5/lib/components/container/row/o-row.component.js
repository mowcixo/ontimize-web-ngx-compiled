import * as tslib_1 from "tslib";
import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';
export var DEFAULT_INPUTS_O_ROW = tslib_1.__spread(DEFAULT_INPUTS_O_CONTAINER);
var ORowComponent = (function (_super) {
    tslib_1.__extends(ORowComponent, _super);
    function ORowComponent(elRef, injector, matFormDefaultOption) {
        var _this = _super.call(this, elRef, injector, matFormDefaultOption) || this;
        _this.elRef = elRef;
        _this.injector = injector;
        _this.matFormDefaultOption = matFormDefaultOption;
        return _this;
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
    ORowComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
    ]; };
    return ORowComponent;
}(OContainerComponent));
export { ORowComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9yb3cvby1yb3cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVqRyxNQUFNLENBQUMsSUFBTSxvQkFBb0Isb0JBQzVCLDBCQUEwQixDQUM5QixDQUFDO0FBRUY7SUFZbUMseUNBQW1CO0lBRXBELHVCQUNZLEtBQWlCLEVBQ2pCLFFBQWtCLEVBQ2tDLG9CQUFvQjtRQUhwRixZQUtFLGtCQUFNLEtBQUssRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsU0FDN0M7UUFMVyxXQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFDa0MsMEJBQW9CLEdBQXBCLG9CQUFvQixDQUFBOztJQUdwRixDQUFDOztnQkFwQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxPQUFPO29CQUNqQixnM0JBQXFDO29CQUVyQyxNQUFNLEVBQUUsb0JBQW9CO29CQUM1QixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGVBQWUsRUFBRSxNQUFNO3dCQUN2Qiw4QkFBOEIsRUFBRSx1QkFBdUI7d0JBQ3ZELG9DQUFvQyxFQUFFLCtCQUErQjtxQkFDdEU7O2lCQUNGOzs7Z0JBcEJtQixVQUFVO2dCQUFVLFFBQVE7Z0RBMEIzQyxRQUFRLFlBQUksTUFBTSxTQUFDLDhCQUE4Qjs7SUFLdEQsb0JBQUM7Q0FBQSxBQXRCRCxDQVltQyxtQkFBbUIsR0FVckQ7U0FWWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVIsIE9Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuLi9vLWNvbnRhaW5lci1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19ST1cgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXJvdycsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXJvdy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tcm93LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19ST1csXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tcm93XSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm8tYXBwZWFyYW5jZS1vdXRsaW5lXSc6ICdpc0FwcGVhcmFuY2VPdXRsaW5lKCknLFxuICAgICdbY2xhc3Muby1hcHBlYXJhbmNlLW91dGxpbmUtdGl0bGVdJzogJ2hhc1RpdGxlSW5BcHBlYXJhbmNlT3V0bGluZSgpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Sb3dDb21wb25lbnQgZXh0ZW5kcyBPQ29udGFpbmVyQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUykgcHJvdGVjdGVkIG1hdEZvcm1EZWZhdWx0T3B0aW9uXG4gICkge1xuICAgIHN1cGVyKGVsUmVmLCBpbmplY3RvciwgbWF0Rm9ybURlZmF1bHRPcHRpb24pO1xuICB9XG5cbn1cbiJdfQ==