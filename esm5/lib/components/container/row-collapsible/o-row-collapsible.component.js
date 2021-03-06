import * as tslib_1 from "tslib";
import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE, OContainerCollapsibleComponent, } from '../o-container-collapsible-component.class';
export var DEFAULT_INPUTS_O_ROW_COLLAPSIBLE = tslib_1.__spread(DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE);
var ORowCollapsibleComponent = (function (_super) {
    tslib_1.__extends(ORowCollapsibleComponent, _super);
    function ORowCollapsibleComponent(elRef, injector, matFormDefaultOption) {
        var _this = _super.call(this, elRef, injector, matFormDefaultOption) || this;
        _this.elRef = elRef;
        _this.injector = injector;
        _this.matFormDefaultOption = matFormDefaultOption;
        return _this;
    }
    ORowCollapsibleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-row-collapsible',
                    template: "<mat-expansion-panel #expPanel [expanded]=\"expanded\" class=\"o-container\">\n  <mat-expansion-panel-header #containerTitle [expandedHeight]=\"expandedHeight\" [collapsedHeight]=\"collapsedHeight\">\n    <mat-panel-title fxLayout=\"row\" fxLayoutAlign=\"start center\" class=\"o-container-title\">\n      <mat-icon *ngIf=\"icon\">{{ icon }}</mat-icon>\n      <span *ngIf=\"title\">{{ title | oTranslate }}</span>\n    </mat-panel-title>\n    <mat-panel-description fxLayout=\"row\" fxLayoutAlign=\"start center\">\n      <span>{{ description | oTranslate }}</span>\n    </mat-panel-description>\n  </mat-expansion-panel-header>\n  <div #containerContent id=\"innerRow\" fxLayout=\"row\" fxLayoutAlign=\"{{ layoutAlign }}\" fxLayoutGap=\"{{ layoutGap }}\"\n    class=\"o-container-scroll o-scroll\" fxFlex=\"grow\">\n    <ng-content></ng-content>\n  </div>\n</mat-expansion-panel>\n<div #container [class.o-container-outline-expanded]=\"expPanel.expanded\" class=\"o-container-outline\"\n  *ngIf=\"isAppearanceOutline()\">\n  <div class=\"o-container-outline-start\"></div>\n  <div class=\"o-container-outline-gap-title\"></div>\n  <div class=\"o-container-outline-gap-empty1\"></div>\n  <div class=\"o-container-outline-gap-description\"></div>\n  <div class=\"o-container-outline-gap-empty2\"></div>\n  <div class=\"o-container-outline-gap-icon\"></div>\n  <div class=\"o-container-outline-end\"></div>\n</div>",
                    inputs: DEFAULT_INPUTS_O_ROW_COLLAPSIBLE,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-row-collapsible]': 'true',
                        '[class.o-appearance-outline]': 'isAppearanceOutline()',
                        '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
                    },
                    styles: [""]
                }] }
    ];
    ORowCollapsibleComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
    ]; };
    return ORowCollapsibleComponent;
}(OContainerCollapsibleComponent));
export { ORowCollapsibleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yb3ctY29sbGFwc2libGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9yb3ctY29sbGFwc2libGUvby1yb3ctY29sbGFwc2libGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRSxPQUFPLEVBQ0wsc0NBQXNDLEVBQ3RDLDhCQUE4QixHQUMvQixNQUFNLDRDQUE0QyxDQUFDO0FBRXBELE1BQU0sQ0FBQyxJQUFNLGdDQUFnQyxvQkFDeEMsc0NBQXNDLENBQzFDLENBQUM7QUFFRjtJQVk4QyxvREFBOEI7SUFFMUUsa0NBQ1ksS0FBaUIsRUFDakIsUUFBa0IsRUFDa0Msb0JBQW9CO1FBSHBGLFlBS0Usa0JBQU0sS0FBSyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxTQUM3QztRQUxXLFdBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQUNrQywwQkFBb0IsR0FBcEIsb0JBQW9CLENBQUE7O0lBR3BGLENBQUM7O2dCQXBCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsZzVDQUFpRDtvQkFFakQsTUFBTSxFQUFFLGdDQUFnQztvQkFDeEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSiwyQkFBMkIsRUFBRSxNQUFNO3dCQUNuQyw4QkFBOEIsRUFBRSx1QkFBdUI7d0JBQ3ZELG9DQUFvQyxFQUFFLCtCQUErQjtxQkFDdEU7O2lCQUNGOzs7Z0JBdkJtQixVQUFVO2dCQUFVLFFBQVE7Z0RBNkIzQyxRQUFRLFlBQUksTUFBTSxTQUFDLDhCQUE4Qjs7SUFLdEQsK0JBQUM7Q0FBQSxBQXRCRCxDQVk4Qyw4QkFBOEIsR0FVM0U7U0FWWSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0NPTlRBSU5FUl9DT0xMQVBTSUJMRSxcbiAgT0NvbnRhaW5lckNvbGxhcHNpYmxlQ29tcG9uZW50LFxufSBmcm9tICcuLi9vLWNvbnRhaW5lci1jb2xsYXBzaWJsZS1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19ST1dfQ09MTEFQU0lCTEUgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSX0NPTExBUFNJQkxFXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXJvdy1jb2xsYXBzaWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXJvdy1jb2xsYXBzaWJsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tcm93LWNvbGxhcHNpYmxlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19ST1dfQ09MTEFQU0lCTEUsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tcm93LWNvbGxhcHNpYmxlXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm8tYXBwZWFyYW5jZS1vdXRsaW5lXSc6ICdpc0FwcGVhcmFuY2VPdXRsaW5lKCknLFxuICAgICdbY2xhc3Muby1hcHBlYXJhbmNlLW91dGxpbmUtdGl0bGVdJzogJ2hhc1RpdGxlSW5BcHBlYXJhbmNlT3V0bGluZSgpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Sb3dDb2xsYXBzaWJsZUNvbXBvbmVudCBleHRlbmRzIE9Db250YWluZXJDb2xsYXBzaWJsZUNvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByb3RlY3RlZCBtYXRGb3JtRGVmYXVsdE9wdGlvblxuICApIHtcbiAgICBzdXBlcihlbFJlZiwgaW5qZWN0b3IsIG1hdEZvcm1EZWZhdWx0T3B0aW9uKTtcbiAgfVxuXG59XG4iXX0=