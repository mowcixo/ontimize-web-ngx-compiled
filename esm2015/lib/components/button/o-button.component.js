import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../decorators/input-converter';
export const DEFAULT_INPUTS_O_BUTTON = [
    'oattr: attr',
    'olabel: label',
    'otype: type',
    'icon',
    'svgIcon : svg-icon',
    'iconPosition: icon-position',
    'image',
    'enabled',
    'color'
];
export class OButtonComponent {
    constructor() {
        this.enabled = true;
        this.otype = OButtonComponent.DEFAULT_TYPE;
    }
    ngOnInit() {
        if (this.otype) {
            this.otype = this.otype.toUpperCase();
        }
    }
    get needsIconButtonClass() {
        return this.icon !== undefined && (this.olabel === undefined || this.olabel === '');
    }
    isFab() {
        return this.otype === 'FAB';
    }
    isRaised() {
        return this.otype === 'RAISED';
    }
    isFlat() {
        return this.otype === 'FLAT';
    }
    isStroked() {
        return (this.otype === 'STROKED' || !this.otype);
    }
    isBasic() {
        return this.otype === 'BASIC';
    }
    isMiniFab() {
        return this.otype === 'FAB-MINI';
    }
    isIconButton() {
        return this.otype === 'ICON';
    }
}
OButtonComponent.DEFAULT_TYPE = 'STROKED';
OButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-button',
                inputs: DEFAULT_INPUTS_O_BUTTON,
                template: "<button type=\"button\" *ngIf=\"isBasic()\" mat-button [class.mat-icon-button]=\"needsIconButtonClass\" [disabled]=\"!enabled\" [color]=\"color\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isRaised()\" mat-raised-button class=\"mat-raised-button\" [class.mat-icon-button]=\"needsIconButtonClass\"\n  [disabled]=\"!enabled\" [color]=\"color\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isStroked()\" mat-stroked-button [class.mat-icon-button]=\"needsIconButtonClass\" [disabled]=\"!enabled\" [color]=\"color\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isFlat()\" mat-flat-button [class.mat-icon-button]=\"needsIconButtonClass\" [disabled]=\"!enabled\" [color]=\"color\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isIconButton()\" mat-icon-button [class.mat-icon-button]=\"needsIconButtonClass\" [disabled]=\"!enabled\" [color]=\"color\">\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n</button>\n\n<button type=\"button\" *ngIf=\"isFab()\" mat-fab [disabled]=\"!enabled\" [color]=\"color\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isMiniFab()\" mat-mini-fab [disabled]=\"!enabled\" [color]=\"color\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-button]': 'true'
                },
                styles: [".o-button{display:inline-block}.o-button .mat-icon-button .mat-button-ripple.mat-ripple{border-radius:50%}"]
            }] }
];
OButtonComponent.ctorParameters = () => [];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OButtonComponent.prototype, "enabled", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2J1dHRvbi9vLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR2xFLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ3JDLGFBQWE7SUFDYixlQUFlO0lBRWYsYUFBYTtJQUViLE1BQU07SUFDTixvQkFBb0I7SUFDcEIsNkJBQTZCO0lBQzdCLE9BQU87SUFFUCxTQUFTO0lBRVQsT0FBTztDQUNSLENBQUM7QUFZRixNQUFNLE9BQU8sZ0JBQWdCO0lBYzNCO1FBSGtCLFlBQU8sR0FBWSxJQUFJLENBQUM7UUFJeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7SUFDN0MsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxvQkFBb0I7UUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdEYsQ0FBQztJQUVELEtBQUs7UUFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0lBRUQsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUM7SUFDL0IsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUM7SUFDL0IsQ0FBQzs7QUFwRGdCLDZCQUFZLEdBQUcsU0FBUyxDQUFDOztZQVozQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLE1BQU0sRUFBRSx1QkFBdUI7Z0JBQy9CLDg2SEFBd0M7Z0JBRXhDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osa0JBQWtCLEVBQUUsTUFBTTtpQkFDM0I7O2FBQ0Y7OztBQVltQjtJQUFqQixjQUFjLEVBQUU7O2lEQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGhlbWVQYWxldHRlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQlVUVE9OID0gW1xuICAnb2F0dHI6IGF0dHInLFxuICAnb2xhYmVsOiBsYWJlbCcsXG4gIC8vIHR5cGUgW0JBU0lDfFJBSVNFRHxTVFJPS0VEfEZMQVR8SUNPTnxGQUJ8TUlOSS1GQUJdOiBUaGUgdHlwZSBvZiBidXR0b24uIERlZmF1bHQ6IFNUUk9LRUQuXG4gICdvdHlwZTogdHlwZScsXG4gIC8vIGljb24gW3N0cmluZ106IE5hbWUgb2YgZ29vZ2xlIGljb24gKHNlZSBodHRwczovL2Rlc2lnbi5nb29nbGUuY29tL2ljb25zLylcbiAgJ2ljb24nLFxuICAnc3ZnSWNvbiA6IHN2Zy1pY29uJyxcbiAgJ2ljb25Qb3NpdGlvbjogaWNvbi1wb3NpdGlvbicsXG4gICdpbWFnZScsXG4gIC8vIGVuYWJsZWQgW3llc3xub3x0cnVlfGZhbHNlXTogV2hldGhlciB0aGUgYnV0dG9uIGlzIGVuYWJsZWQuIERlZmF1bHQ6IHllc1xuICAnZW5hYmxlZCcsXG4gIC8vIGNvbG9yOiBUaGVtZSBjb2xvciBwYWxldHRlIGZvciB0aGUgY29tcG9uZW50LlxuICAnY29sb3InXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWJ1dHRvbicsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19CVVRUT04sXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYnV0dG9uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYnV0dG9uXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9CdXR0b25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgREVGQVVMVF9UWVBFID0gJ1NUUk9LRUQnO1xuXG4gIHByb3RlY3RlZCBvYXR0cjogc3RyaW5nO1xuICBwdWJsaWMgb2xhYmVsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvdHlwZTogc3RyaW5nO1xuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwdWJsaWMgc3ZnSWNvbjogc3RyaW5nO1xuICBwdWJsaWMgaWNvblBvc2l0aW9uOiBzdHJpbmc7IC8vIGxlZnQgKGRlZmF1bHQpLCB0b3AsIFRPRE86IHJpZ2h0LCBib3R0b20/XG4gIHB1YmxpYyBpbWFnZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKSBlbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5vdHlwZSA9IE9CdXR0b25Db21wb25lbnQuREVGQVVMVF9UWVBFO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3R5cGUpIHtcbiAgICAgIHRoaXMub3R5cGUgPSB0aGlzLm90eXBlLnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG5lZWRzSWNvbkJ1dHRvbkNsYXNzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmljb24gIT09IHVuZGVmaW5lZCAmJiAodGhpcy5vbGFiZWwgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm9sYWJlbCA9PT0gJycpO1xuICB9XG5cbiAgaXNGYWIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdGQUInO1xuICB9XG5cbiAgaXNSYWlzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdSQUlTRUQnO1xuICB9XG5cbiAgaXNGbGF0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnRkxBVCc7XG4gIH1cblxuICBpc1N0cm9rZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLm90eXBlID09PSAnU1RST0tFRCcgfHwgIXRoaXMub3R5cGUpO1xuICB9XG5cbiAgaXNCYXNpYygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0JBU0lDJztcbiAgfVxuXG4gIGlzTWluaUZhYigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0ZBQi1NSU5JJztcbiAgfVxuXG4gIGlzSWNvbkJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0lDT04nO1xuICB9XG59XG4iXX0=