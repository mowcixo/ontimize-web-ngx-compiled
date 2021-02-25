import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../decorators/input-converter';
export var DEFAULT_INPUTS_O_BUTTON = [
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
var OButtonComponent = (function () {
    function OButtonComponent() {
        this.enabled = true;
        this.otype = OButtonComponent.DEFAULT_TYPE;
    }
    OButtonComponent.prototype.ngOnInit = function () {
        if (this.otype) {
            this.otype = this.otype.toUpperCase();
        }
    };
    Object.defineProperty(OButtonComponent.prototype, "needsIconButtonClass", {
        get: function () {
            return this.icon !== undefined && (this.olabel === undefined || this.olabel === '');
        },
        enumerable: true,
        configurable: true
    });
    OButtonComponent.prototype.isFab = function () {
        return this.otype === 'FAB';
    };
    OButtonComponent.prototype.isRaised = function () {
        return this.otype === 'RAISED';
    };
    OButtonComponent.prototype.isFlat = function () {
        return this.otype === 'FLAT';
    };
    OButtonComponent.prototype.isStroked = function () {
        return (this.otype === 'STROKED' || !this.otype);
    };
    OButtonComponent.prototype.isBasic = function () {
        return this.otype === 'BASIC';
    };
    OButtonComponent.prototype.isMiniFab = function () {
        return this.otype === 'FAB-MINI';
    };
    OButtonComponent.prototype.isIconButton = function () {
        return this.otype === 'ICON';
    };
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
    OButtonComponent.ctorParameters = function () { return []; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OButtonComponent.prototype, "enabled", void 0);
    return OButtonComponent;
}());
export { OButtonComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2J1dHRvbi9vLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR2xFLE1BQU0sQ0FBQyxJQUFNLHVCQUF1QixHQUFHO0lBQ3JDLGFBQWE7SUFDYixlQUFlO0lBRWYsYUFBYTtJQUViLE1BQU07SUFDTixvQkFBb0I7SUFDcEIsNkJBQTZCO0lBQzdCLE9BQU87SUFFUCxTQUFTO0lBRVQsT0FBTztDQUNSLENBQUM7QUFFRjtJQXdCRTtRQUhrQixZQUFPLEdBQVksSUFBSSxDQUFDO1FBSXhDLElBQUksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO0lBQzdDLENBQUM7SUFFRCxtQ0FBUSxHQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELHNCQUFJLGtEQUFvQjthQUF4QjtZQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7OztPQUFBO0lBRUQsZ0NBQUssR0FBTDtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVELG1DQUFRLEdBQVI7UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxpQ0FBTSxHQUFOO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQztJQUMvQixDQUFDO0lBRUQsb0NBQVMsR0FBVDtRQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsa0NBQU8sR0FBUDtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQUVELG9DQUFTLEdBQVQ7UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDO0lBQ25DLENBQUM7SUFFRCx1Q0FBWSxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLE1BQU0sQ0FBQztJQUMvQixDQUFDO0lBcERnQiw2QkFBWSxHQUFHLFNBQVMsQ0FBQzs7Z0JBWjNDLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtvQkFDcEIsTUFBTSxFQUFFLHVCQUF1QjtvQkFDL0IsODZIQUF3QztvQkFFeEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixrQkFBa0IsRUFBRSxNQUFNO3FCQUMzQjs7aUJBQ0Y7OztJQVltQjtRQUFqQixjQUFjLEVBQUU7O3FEQUF5QjtJQTRDNUMsdUJBQUM7Q0FBQSxBQWpFRCxJQWlFQztTQXZEWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRoZW1lUGFsZXR0ZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuXG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JVVFRPTiA9IFtcbiAgJ29hdHRyOiBhdHRyJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAvLyB0eXBlIFtCQVNJQ3xSQUlTRUR8U1RST0tFRHxGTEFUfElDT058RkFCfE1JTkktRkFCXTogVGhlIHR5cGUgb2YgYnV0dG9uLiBEZWZhdWx0OiBTVFJPS0VELlxuICAnb3R5cGU6IHR5cGUnLFxuICAvLyBpY29uIFtzdHJpbmddOiBOYW1lIG9mIGdvb2dsZSBpY29uIChzZWUgaHR0cHM6Ly9kZXNpZ24uZ29vZ2xlLmNvbS9pY29ucy8pXG4gICdpY29uJyxcbiAgJ3N2Z0ljb24gOiBzdmctaWNvbicsXG4gICdpY29uUG9zaXRpb246IGljb24tcG9zaXRpb24nLFxuICAnaW1hZ2UnLFxuICAvLyBlbmFibGVkIFt5ZXN8bm98dHJ1ZXxmYWxzZV06IFdoZXRoZXIgdGhlIGJ1dHRvbiBpcyBlbmFibGVkLiBEZWZhdWx0OiB5ZXNcbiAgJ2VuYWJsZWQnLFxuICAvLyBjb2xvcjogVGhlbWUgY29sb3IgcGFsZXR0ZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgJ2NvbG9yJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1idXR0b24nLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQlVUVE9OLFxuICB0ZW1wbGF0ZVVybDogJy4vby1idXR0b24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWJ1dHRvbi5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWJ1dHRvbl0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQnV0dG9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwcm90ZWN0ZWQgc3RhdGljIERFRkFVTFRfVFlQRSA9ICdTVFJPS0VEJztcblxuICBwcm90ZWN0ZWQgb2F0dHI6IHN0cmluZztcbiAgcHVibGljIG9sYWJlbDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgb3R5cGU6IHN0cmluZztcbiAgcHVibGljIGljb246IHN0cmluZztcbiAgcHVibGljIHN2Z0ljb246IHN0cmluZztcbiAgcHVibGljIGljb25Qb3NpdGlvbjogc3RyaW5nOyAvLyBsZWZ0IChkZWZhdWx0KSwgdG9wLCBUT0RPOiByaWdodCwgYm90dG9tP1xuICBwdWJsaWMgaW1hZ2U6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKCkgZW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMub3R5cGUgPSBPQnV0dG9uQ29tcG9uZW50LkRFRkFVTFRfVFlQRTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm90eXBlKSB7XG4gICAgICB0aGlzLm90eXBlID0gdGhpcy5vdHlwZS50b1VwcGVyQ2FzZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuZWVkc0ljb25CdXR0b25DbGFzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pY29uICE9PSB1bmRlZmluZWQgJiYgKHRoaXMub2xhYmVsID09PSB1bmRlZmluZWQgfHwgdGhpcy5vbGFiZWwgPT09ICcnKTtcbiAgfVxuXG4gIGlzRmFiKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnRkFCJztcbiAgfVxuXG4gIGlzUmFpc2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnUkFJU0VEJztcbiAgfVxuXG4gIGlzRmxhdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0ZMQVQnO1xuICB9XG5cbiAgaXNTdHJva2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5vdHlwZSA9PT0gJ1NUUk9LRUQnIHx8ICF0aGlzLm90eXBlKTtcbiAgfVxuXG4gIGlzQmFzaWMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdCQVNJQyc7XG4gIH1cblxuICBpc01pbmlGYWIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdGQUItTUlOSSc7XG4gIH1cblxuICBpc0ljb25CdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdJQ09OJztcbiAgfVxufVxuIl19