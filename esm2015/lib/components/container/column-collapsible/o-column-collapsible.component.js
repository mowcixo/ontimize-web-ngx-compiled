import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE, OContainerCollapsibleComponent, } from '../o-container-collapsible-component.class';
export const DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE = [
    ...DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE
];
export class OColumnCollapsibleComponent extends OContainerCollapsibleComponent {
    constructor(elRef, injector, matFormDefaultOption) {
        super(elRef, injector, matFormDefaultOption);
        this.elRef = elRef;
        this.injector = injector;
        this.matFormDefaultOption = matFormDefaultOption;
    }
}
OColumnCollapsibleComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-column-collapsible',
                template: "<mat-expansion-panel #expPanel [expanded]=\"expanded\" class=\"o-container\">\n  <mat-expansion-panel-header #containerTitle [expandedHeight]=\"expandedHeight\" [collapsedHeight]=\"collapsedHeight\">\n    <mat-panel-title fxLayout=\"row\" fxLayoutAlign=\"start center\" class=\"o-container-title\">\n      <mat-icon *ngIf=\"icon\">{{ icon }}</mat-icon>\n      <span *ngIf=\"title\">{{ title | oTranslate }}</span>\n    </mat-panel-title>\n    <mat-panel-description fxLayout=\"row\" fxLayoutAlign=\"start center\">\n      <span>{{ description | oTranslate }}</span>\n    </mat-panel-description>\n  </mat-expansion-panel-header>\n  <div #containerContent id=\"innerCol\" fxLayout=\"column\" fxLayoutAlign=\"{{ layoutAlign }}\" fxLayoutGap=\"{{ layoutGap }}\"\n    class=\"o-container-scroll o-scroll\" fxFlex=\"grow\">\n    <ng-content></ng-content>\n  </div>\n</mat-expansion-panel>\n<div #container [class.o-container-outline-expanded]=\"expPanel.expanded\" class=\"o-container-outline\"\n  *ngIf=\"isAppearanceOutline()\">\n  <div class=\"o-container-outline-start\"></div>\n  <div class=\"o-container-outline-gap-title\"></div>\n  <div class=\"o-container-outline-gap-empty1\"></div>\n  <div class=\"o-container-outline-gap-description\"></div>\n  <div class=\"o-container-outline-gap-empty2\"></div>\n  <div class=\"o-container-outline-gap-icon\"></div>\n  <div class=\"o-container-outline-end\"></div>\n</div>",
                inputs: DEFAULT_INPUTS_O_COLUMN_COLLAPSIBLE,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-column-collapsible]': 'true',
                    '[class.o-appearance-outline]': 'isAppearanceOutline()',
                    '[class.o-appearance-outline-title]': 'hasTitleInAppearanceOutline()'
                },
                styles: [""]
            }] }
];
OColumnCollapsibleComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb2x1bW4tY29sbGFwc2libGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9jb2x1bW4tY29sbGFwc2libGUvby1jb2x1bW4tY29sbGFwc2libGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JHLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRW5FLE9BQU8sRUFDTCxzQ0FBc0MsRUFDdEMsOEJBQThCLEdBQy9CLE1BQU0sNENBQTRDLENBQUM7QUFFcEQsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQUc7SUFDakQsR0FBRyxzQ0FBc0M7Q0FDMUMsQ0FBQztBQWNGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSw4QkFBOEI7SUFFN0UsWUFDWSxLQUFpQixFQUNqQixRQUFrQixFQUNrQyxvQkFBb0I7UUFFbEYsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUpuQyxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDa0MseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFBO0lBR3BGLENBQUM7OztZQXBCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsbTVDQUFvRDtnQkFFcEQsTUFBTSxFQUFFLG1DQUFtQztnQkFDM0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSiw4QkFBOEIsRUFBRSxNQUFNO29CQUN0Qyw4QkFBOEIsRUFBRSx1QkFBdUI7b0JBQ3ZELG9DQUFvQyxFQUFFLCtCQUErQjtpQkFDdEU7O2FBQ0Y7OztZQXZCbUIsVUFBVTtZQUFVLFFBQVE7NENBNkIzQyxRQUFRLFlBQUksTUFBTSxTQUFDLDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSX0NPTExBUFNJQkxFLFxuICBPQ29udGFpbmVyQ29sbGFwc2libGVDb21wb25lbnQsXG59IGZyb20gJy4uL28tY29udGFpbmVyLWNvbGxhcHNpYmxlLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0NPTFVNTl9DT0xMQVBTSUJMRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVJfQ09MTEFQU0lCTEVcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY29sdW1uLWNvbGxhcHNpYmxlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tY29sdW1uLWNvbGxhcHNpYmxlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1jb2x1bW4tY29sbGFwc2libGUuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0NPTFVNTl9DT0xMQVBTSUJMRSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jb2x1bW4tY29sbGFwc2libGVdJzogJ3RydWUnLFxuICAgICdbY2xhc3Muby1hcHBlYXJhbmNlLW91dGxpbmVdJzogJ2lzQXBwZWFyYW5jZU91dGxpbmUoKScsXG4gICAgJ1tjbGFzcy5vLWFwcGVhcmFuY2Utb3V0bGluZS10aXRsZV0nOiAnaGFzVGl0bGVJbkFwcGVhcmFuY2VPdXRsaW5lKCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0NvbHVtbkNvbGxhcHNpYmxlQ29tcG9uZW50IGV4dGVuZHMgT0NvbnRhaW5lckNvbGxhcHNpYmxlQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUykgcHJvdGVjdGVkIG1hdEZvcm1EZWZhdWx0T3B0aW9uXG4gICkge1xuICAgIHN1cGVyKGVsUmVmLCBpbmplY3RvciwgbWF0Rm9ybURlZmF1bHRPcHRpb24pO1xuICB9XG5cbn1cbiJdfQ==