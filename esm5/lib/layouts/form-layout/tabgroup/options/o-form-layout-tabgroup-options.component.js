import * as tslib_1 from "tslib";
import { Component, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../../decorators/input-converter';
export var DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP_OPTIONS = [
    'backgroundColor:background-color',
    'color',
    'headerPosition:header-position',
    'disableAnimation:disable-animation',
    'icon',
    'iconPosition:icon-position'
];
var OFormLayoutTabGroupOptionsComponent = (function () {
    function OFormLayoutTabGroupOptionsComponent() {
        this.iconPosition = 'left';
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
    OFormLayoutTabGroupOptionsComponent.ctorParameters = function () { return []; };
    OFormLayoutTabGroupOptionsComponent.propDecorators = {
        templateMatTabLabel: [{ type: ContentChild, args: [TemplateRef, { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormLayoutTabGroupOptionsComponent.prototype, "disableAnimation", void 0);
    return OFormLayoutTabGroupOptionsComponent;
}());
export { OFormLayoutTabGroupOptionsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC10YWJncm91cC1vcHRpb25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9mb3JtLWxheW91dC90YWJncm91cC9vcHRpb25zL28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAtb3B0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUd4RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFFeEUsTUFBTSxDQUFDLElBQU0sNkNBQTZDLEdBQUc7SUFDM0Qsa0NBQWtDO0lBQ2xDLE9BQU87SUFDUCxnQ0FBZ0M7SUFDaEMsb0NBQW9DO0lBQ3BDLE1BQU07SUFDTiw0QkFBNEI7Q0FDN0IsQ0FBQztBQUVGO0lBVUU7UUFlTyxpQkFBWSxHQUFxQixNQUFNLENBQUM7SUFmL0IsQ0FBQzs7Z0JBVmxCLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0NBQWdDO29CQUMxQyxRQUFRLEVBQUUsR0FBRztvQkFDYixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsTUFBTSxFQUFFLDZDQUE2QztvQkFDckQsSUFBSSxFQUFFO3dCQUNKLHdDQUF3QyxFQUFFLE1BQU07cUJBQ2pEO2lCQUNGOzs7O3NDQWFFLFlBQVksU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQUo1QztRQURDLGNBQWMsRUFBRTs7aUZBQ2dCO0lBU25DLDBDQUFDO0NBQUEsQUExQkQsSUEwQkM7U0FqQlksbUNBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0VGFiSGVhZGVyUG9zaXRpb24gfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19GT1JNX0xBWU9VVF9UQUJHUk9VUF9PUFRJT05TID0gW1xuICAnYmFja2dyb3VuZENvbG9yOmJhY2tncm91bmQtY29sb3InLFxuICAnY29sb3InLFxuICAnaGVhZGVyUG9zaXRpb246aGVhZGVyLXBvc2l0aW9uJyxcbiAgJ2Rpc2FibGVBbmltYXRpb246ZGlzYWJsZS1hbmltYXRpb24nLFxuICAnaWNvbicsXG4gICdpY29uUG9zaXRpb246aWNvbi1wb3NpdGlvbidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAtb3B0aW9ucycsXG4gIHRlbXBsYXRlOiAnICcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GT1JNX0xBWU9VVF9UQUJHUk9VUF9PUFRJT05TLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZvcm0tbGF5b3V0LXRhYmdyb3VwLW9wdGlvbnNdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXRUYWJHcm91cE9wdGlvbnNDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuICAvLyBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KSkgcHJvdGVjdGVkIG9Gb3JtTGF5b3V0TWFuYWdlcjogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KSB7IH1cblxuICBwdWJsaWMgYmFja2dyb3VuZENvbG9yO1xuICBwdWJsaWMgY29sb3I7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGRpc2FibGVBbmltYXRpb246IGJvb2xlYW47XG5cbiAgcHVibGljIGhlYWRlclBvc2l0aW9uOiBNYXRUYWJIZWFkZXJQb3NpdGlvbjtcblxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgdGVtcGxhdGVNYXRUYWJMYWJlbDogVGVtcGxhdGVSZWY8YW55PjtcblxuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwdWJsaWMgaWNvblBvc2l0aW9uOiAnbGVmdCcgfCAncmlnaHQnID0gJ2xlZnQnO1xufVxuIl19