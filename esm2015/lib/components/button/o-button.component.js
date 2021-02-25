import { Component, ViewEncapsulation } from '@angular/core';
export const DEFAULT_INPUTS_O_BUTTON = [
    'oattr: attr',
    'olabel: label',
    'otype: type',
    'icon',
    'svgIcon : svg-icon',
    'iconPosition: icon-position',
    'image'
];
export class OButtonComponent {
    constructor() {
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
                template: "<button type=\"button\" *ngIf=\"isBasic()\" mat-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isRaised()\" mat-raised-button class=\"mat-raised-button\"\n  [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isStroked()\" mat-stroked-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isFlat()\" mat-flat-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isIconButton()\" mat-icon-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n</button>\n\n<button type=\"button\" *ngIf=\"isFab()\" mat-fab>\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isMiniFab()\" mat-mini-fab>\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-button]': 'true'
                },
                styles: [".o-button{display:inline-block}.o-button .mat-icon-button .mat-button-ripple.mat-ripple{border-radius:50%}"]
            }] }
];
OButtonComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2J1dHRvbi9vLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRSxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRztJQUNyQyxhQUFhO0lBQ2IsZUFBZTtJQUVmLGFBQWE7SUFFYixNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLDZCQUE2QjtJQUM3QixPQUFPO0NBQ1IsQ0FBQztBQVlGLE1BQU0sT0FBTyxnQkFBZ0I7SUFZM0I7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLGdCQUFnQixDQUFDLFlBQVksQ0FBQztJQUM3QyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCxJQUFJLG9CQUFvQjtRQUN0QixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxFQUFFLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQztJQUMvQixDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDO0lBQ25DLENBQUM7SUFFRCxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQztJQUMvQixDQUFDOztBQWxEZ0IsNkJBQVksR0FBRyxTQUFTLENBQUM7O1lBWjNDLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsTUFBTSxFQUFFLHVCQUF1QjtnQkFDL0IseXFIQUF3QztnQkFFeEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixrQkFBa0IsRUFBRSxNQUFNO2lCQUMzQjs7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19CVVRUT04gPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICdvbGFiZWw6IGxhYmVsJyxcbiAgLy8gdHlwZSBbQkFTSUN8UkFJU0VEfFNUUk9LRUR8RkxBVHxJQ09OfEZBQnxNSU5JLUZBQl06IFRoZSB0eXBlIG9mIGJ1dHRvbi4gRGVmYXVsdDogU1RST0tFRC5cbiAgJ290eXBlOiB0eXBlJyxcbiAgLy8gaWNvbiBbc3RyaW5nXTogTmFtZSBvZiBnb29nbGUgaWNvbiAoc2VlIGh0dHBzOi8vZGVzaWduLmdvb2dsZS5jb20vaWNvbnMvKVxuICAnaWNvbicsXG4gICdzdmdJY29uIDogc3ZnLWljb24nLFxuICAnaWNvblBvc2l0aW9uOiBpY29uLXBvc2l0aW9uJyxcbiAgJ2ltYWdlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1idXR0b24nLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQlVUVE9OLFxuICB0ZW1wbGF0ZVVybDogJy4vby1idXR0b24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWJ1dHRvbi5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWJ1dHRvbl0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcm90ZWN0ZWQgc3RhdGljIERFRkFVTFRfVFlQRSA9ICdTVFJPS0VEJztcblxuICBwcm90ZWN0ZWQgb2F0dHI6IHN0cmluZztcbiAgb2xhYmVsOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvdHlwZTogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIHN2Z0ljb246IHN0cmluZztcbiAgaWNvblBvc2l0aW9uOiBzdHJpbmc7IC8vIGxlZnQgKGRlZmF1bHQpLCB0b3AsIFRPRE86IHJpZ2h0LCBib3R0b20/XG4gIGltYWdlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5vdHlwZSA9IE9CdXR0b25Db21wb25lbnQuREVGQVVMVF9UWVBFO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3R5cGUpIHtcbiAgICAgIHRoaXMub3R5cGUgPSB0aGlzLm90eXBlLnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG5lZWRzSWNvbkJ1dHRvbkNsYXNzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmljb24gIT09IHVuZGVmaW5lZCAmJiAodGhpcy5vbGFiZWwgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm9sYWJlbCA9PT0gJycpO1xuICB9XG5cbiAgaXNGYWIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdGQUInO1xuICB9XG5cbiAgaXNSYWlzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdSQUlTRUQnO1xuICB9XG5cbiAgaXNGbGF0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnRkxBVCc7XG4gIH1cblxuICBpc1N0cm9rZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLm90eXBlID09PSAnU1RST0tFRCcgfHwgIXRoaXMub3R5cGUpO1xuICB9XG5cbiAgaXNCYXNpYygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0JBU0lDJztcbiAgfVxuXG4gIGlzTWluaUZhYigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0ZBQi1NSU5JJztcbiAgfVxuXG4gIGlzSWNvbkJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0lDT04nO1xuICB9XG59XG4iXX0=