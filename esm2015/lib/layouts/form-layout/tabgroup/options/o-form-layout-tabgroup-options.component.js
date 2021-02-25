import * as tslib_1 from "tslib";
import { Component, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../../decorators/input-converter';
export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP_OPTIONS = [
    'backgroundColor:background-color',
    'color',
    'headerPosition:header-position',
    'disableAnimation:disable-animation',
    'icon',
    'iconPosition:icon-position'
];
export class OFormLayoutTabGroupOptionsComponent {
    constructor() {
        this.iconPosition = 'left';
    }
}
OFormLayoutTabGroupOptionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-form-layout-tabgroup-options',
                template: ' ',
                encapsulation: ViewEncapsulation.None,
                inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP_OPTIONS,
                host: {
                    '[class.o-form-layout-tabgroup-options]': 'true'
                }
            }] }
];
OFormLayoutTabGroupOptionsComponent.ctorParameters = () => [];
OFormLayoutTabGroupOptionsComponent.propDecorators = {
    templateMatTabLabel: [{ type: ContentChild, args: [TemplateRef, { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormLayoutTabGroupOptionsComponent.prototype, "disableAnimation", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC10YWJncm91cC1vcHRpb25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9mb3JtLWxheW91dC90YWJncm91cC9vcHRpb25zL28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAtb3B0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd4RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFFeEUsTUFBTSxDQUFDLE1BQU0sNkNBQTZDLEdBQUc7SUFDM0Qsa0NBQWtDO0lBQ2xDLE9BQU87SUFDUCxnQ0FBZ0M7SUFDaEMsb0NBQW9DO0lBQ3BDLE1BQU07SUFDTiw0QkFBNEI7Q0FDN0IsQ0FBQztBQVdGLE1BQU0sT0FBTyxtQ0FBbUM7SUFDOUM7UUFlTyxpQkFBWSxHQUFxQixNQUFNLENBQUM7SUFmL0IsQ0FBQzs7O1lBVmxCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0NBQWdDO2dCQUMxQyxRQUFRLEVBQUUsR0FBRztnQkFDYixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsTUFBTSxFQUFFLDZDQUE2QztnQkFDckQsSUFBSSxFQUFFO29CQUNKLHdDQUF3QyxFQUFFLE1BQU07aUJBQ2pEO2FBQ0Y7Ozs7a0NBYUUsWUFBWSxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0FBSjVDO0lBREMsY0FBYyxFQUFFOzs2RUFDZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRUYWJIZWFkZXJQb3NpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX1RBQkdST1VQX09QVElPTlMgPSBbXG4gICdiYWNrZ3JvdW5kQ29sb3I6YmFja2dyb3VuZC1jb2xvcicsXG4gICdjb2xvcicsXG4gICdoZWFkZXJQb3NpdGlvbjpoZWFkZXItcG9zaXRpb24nLFxuICAnZGlzYWJsZUFuaW1hdGlvbjpkaXNhYmxlLWFuaW1hdGlvbicsXG4gICdpY29uJyxcbiAgJ2ljb25Qb3NpdGlvbjppY29uLXBvc2l0aW9uJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1mb3JtLWxheW91dC10YWJncm91cC1vcHRpb25zJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX1RBQkdST1VQX09QVElPTlMsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS1sYXlvdXQtdGFiZ3JvdXAtb3B0aW9uc10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPRm9ybUxheW91dFRhYkdyb3VwT3B0aW9uc0NvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIC8vIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpKSBwcm90ZWN0ZWQgb0Zvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpIHsgfVxuXG4gIHB1YmxpYyBiYWNrZ3JvdW5kQ29sb3I7XG4gIHB1YmxpYyBjb2xvcjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZGlzYWJsZUFuaW1hdGlvbjogYm9vbGVhbjtcblxuICBwdWJsaWMgaGVhZGVyUG9zaXRpb246IE1hdFRhYkhlYWRlclBvc2l0aW9uO1xuXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYsIHsgc3RhdGljOiBmYWxzZSB9KVxuICB0ZW1wbGF0ZU1hdFRhYkxhYmVsOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHB1YmxpYyBpY29uOiBzdHJpbmc7XG4gIHB1YmxpYyBpY29uUG9zaXRpb246ICdsZWZ0JyB8ICdyaWdodCcgPSAnbGVmdCc7XG59XG4iXX0=