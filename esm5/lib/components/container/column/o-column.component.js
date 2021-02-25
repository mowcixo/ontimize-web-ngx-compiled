import * as tslib_1 from "tslib";
import { Component, ElementRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from '../o-container-component.class';
export var DEFAULT_INPUTS_O_COLUMN = tslib_1.__spread(DEFAULT_INPUTS_O_CONTAINER);
var OColumnComponent = (function (_super) {
    tslib_1.__extends(OColumnComponent, _super);
    function OColumnComponent(elRef, injector, matFormDefaultOption) {
        var _this = _super.call(this, elRef, injector, matFormDefaultOption) || this;
        _this.elRef = elRef;
        _this.injector = injector;
        _this.matFormDefaultOption = matFormDefaultOption;
        return _this;
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
    OColumnComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
    ]; };
    return OColumnComponent;
}(OContainerComponent));
export { OColumnComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb2x1bW4uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9jb2x1bW4vby1jb2x1bW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVqRyxNQUFNLENBQUMsSUFBTSx1QkFBdUIsb0JBQy9CLDBCQUEwQixDQUM5QixDQUFDO0FBRUY7SUFZc0MsNENBQW1CO0lBRXZELDBCQUNZLEtBQWlCLEVBQ2pCLFFBQWtCLEVBQ2tDLG9CQUFvQjtRQUhwRixZQUtFLGtCQUFNLEtBQUssRUFBRSxRQUFRLEVBQUUsb0JBQW9CLENBQUMsU0FDN0M7UUFMVyxXQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFDa0MsMEJBQW9CLEdBQXBCLG9CQUFvQixDQUFBOztJQUdwRixDQUFDOztnQkFwQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQix5MkJBQXdDO29CQUV4QyxNQUFNLEVBQUUsdUJBQXVCO29CQUMvQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGtCQUFrQixFQUFFLE1BQU07d0JBQzFCLDhCQUE4QixFQUFFLHVCQUF1Qjt3QkFDdkQsb0NBQW9DLEVBQUUsK0JBQStCO3FCQUN0RTs7aUJBQ0Y7OztnQkFwQm1CLFVBQVU7Z0JBQVUsUUFBUTtnREEwQjNDLFFBQVEsWUFBSSxNQUFNLFNBQUMsOEJBQThCOztJQUt0RCx1QkFBQztDQUFBLEFBdEJELENBWXNDLG1CQUFtQixHQVV4RDtTQVZZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSLCBPQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi4vby1jb250YWluZXItY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQ09MVU1OID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0NPTlRBSU5FUlxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jb2x1bW4nLFxuICB0ZW1wbGF0ZVVybDogJy4vby1jb2x1bW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWNvbHVtbi5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQ09MVU1OLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWNvbHVtbl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLWFwcGVhcmFuY2Utb3V0bGluZV0nOiAnaXNBcHBlYXJhbmNlT3V0bGluZSgpJyxcbiAgICAnW2NsYXNzLm8tYXBwZWFyYW5jZS1vdXRsaW5lLXRpdGxlXSc6ICdoYXNUaXRsZUluQXBwZWFyYW5jZU91dGxpbmUoKSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQ29sdW1uQ29tcG9uZW50IGV4dGVuZHMgT0NvbnRhaW5lckNvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByb3RlY3RlZCBtYXRGb3JtRGVmYXVsdE9wdGlvblxuICApIHtcbiAgICBzdXBlcihlbFJlZiwgaW5qZWN0b3IsIG1hdEZvcm1EZWZhdWx0T3B0aW9uKTtcbiAgfVxuXG59XG4iXX0=