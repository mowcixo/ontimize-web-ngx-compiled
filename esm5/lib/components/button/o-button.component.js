import { Component, ViewEncapsulation } from '@angular/core';
export var DEFAULT_INPUTS_O_BUTTON = [
    'oattr: attr',
    'olabel: label',
    'otype: type',
    'icon',
    'svgIcon : svg-icon',
    'iconPosition: icon-position',
    'image'
];
var OButtonComponent = (function () {
    function OButtonComponent() {
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
                    template: "<button type=\"button\" *ngIf=\"isBasic()\" mat-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isRaised()\" mat-raised-button class=\"mat-raised-button\"\n  [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isStroked()\" mat-stroked-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isFlat()\" mat-flat-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isIconButton()\" mat-icon-button [class.mat-icon-button]=\"needsIconButtonClass\">\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n</button>\n\n<button type=\"button\" *ngIf=\"isFab()\" mat-fab>\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>\n\n<button type=\"button\" *ngIf=\"isMiniFab()\" mat-mini-fab>\n  <img src=\"{{ image }}\" class=\"o-button-image\" *ngIf=\"image!=undefined\" />\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}\n  </mat-icon>\n  <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\"\n    [svgIcon]=\"svgIcon\"></mat-icon>\n  <br *ngIf=\"iconPosition==='top'\" />\n  {{ olabel | oTranslate }}\n</button>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-button]': 'true'
                    },
                    styles: [".o-button{display:inline-block}.o-button .mat-icon-button .mat-button-ripple.mat-ripple{border-radius:50%}"]
                }] }
    ];
    OButtonComponent.ctorParameters = function () { return []; };
    return OButtonComponent;
}());
export { OButtonComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2J1dHRvbi9vLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRSxNQUFNLENBQUMsSUFBTSx1QkFBdUIsR0FBRztJQUNyQyxhQUFhO0lBQ2IsZUFBZTtJQUVmLGFBQWE7SUFFYixNQUFNO0lBQ04sb0JBQW9CO0lBQ3BCLDZCQUE2QjtJQUM3QixPQUFPO0NBQ1IsQ0FBQztBQUVGO0lBc0JFO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7SUFDN0MsQ0FBQztJQUVELG1DQUFRLEdBQVI7UUFDRSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQsc0JBQUksa0RBQW9CO2FBQXhCO1lBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdEYsQ0FBQzs7O09BQUE7SUFFRCxnQ0FBSyxHQUFMO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRUQsbUNBQVEsR0FBUjtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUM7SUFDakMsQ0FBQztJQUVELGlDQUFNLEdBQU47UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFFRCxvQ0FBUyxHQUFUO1FBQ0UsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxrQ0FBTyxHQUFQO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQztJQUNoQyxDQUFDO0lBRUQsb0NBQVMsR0FBVDtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxVQUFVLENBQUM7SUFDbkMsQ0FBQztJQUVELHVDQUFZLEdBQVo7UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDO0lBQy9CLENBQUM7SUFsRGdCLDZCQUFZLEdBQUcsU0FBUyxDQUFDOztnQkFaM0MsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQixNQUFNLEVBQUUsdUJBQXVCO29CQUMvQix5cUhBQXdDO29CQUV4QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGtCQUFrQixFQUFFLE1BQU07cUJBQzNCOztpQkFDRjs7O0lBc0RELHVCQUFDO0NBQUEsQUEvREQsSUErREM7U0FyRFksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JVVFRPTiA9IFtcbiAgJ29hdHRyOiBhdHRyJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAvLyB0eXBlIFtCQVNJQ3xSQUlTRUR8U1RST0tFRHxGTEFUfElDT058RkFCfE1JTkktRkFCXTogVGhlIHR5cGUgb2YgYnV0dG9uLiBEZWZhdWx0OiBTVFJPS0VELlxuICAnb3R5cGU6IHR5cGUnLFxuICAvLyBpY29uIFtzdHJpbmddOiBOYW1lIG9mIGdvb2dsZSBpY29uIChzZWUgaHR0cHM6Ly9kZXNpZ24uZ29vZ2xlLmNvbS9pY29ucy8pXG4gICdpY29uJyxcbiAgJ3N2Z0ljb24gOiBzdmctaWNvbicsXG4gICdpY29uUG9zaXRpb246IGljb24tcG9zaXRpb24nLFxuICAnaW1hZ2UnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWJ1dHRvbicsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19CVVRUT04sXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYnV0dG9uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYnV0dG9uXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9CdXR0b25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgREVGQVVMVF9UWVBFID0gJ1NUUk9LRUQnO1xuXG4gIHByb3RlY3RlZCBvYXR0cjogc3RyaW5nO1xuICBvbGFiZWw6IHN0cmluZztcbiAgcHJvdGVjdGVkIG90eXBlOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgc3ZnSWNvbjogc3RyaW5nO1xuICBpY29uUG9zaXRpb246IHN0cmluZzsgLy8gbGVmdCAoZGVmYXVsdCksIHRvcCwgVE9ETzogcmlnaHQsIGJvdHRvbT9cbiAgaW1hZ2U6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm90eXBlID0gT0J1dHRvbkNvbXBvbmVudC5ERUZBVUxUX1RZUEU7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vdHlwZSkge1xuICAgICAgdGhpcy5vdHlwZSA9IHRoaXMub3R5cGUudG9VcHBlckNhc2UoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbmVlZHNJY29uQnV0dG9uQ2xhc3MoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaWNvbiAhPT0gdW5kZWZpbmVkICYmICh0aGlzLm9sYWJlbCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMub2xhYmVsID09PSAnJyk7XG4gIH1cblxuICBpc0ZhYigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ0ZBQic7XG4gIH1cblxuICBpc1JhaXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdHlwZSA9PT0gJ1JBSVNFRCc7XG4gIH1cblxuICBpc0ZsYXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMub3R5cGUgPT09ICdGTEFUJztcbiAgfVxuXG4gIGlzU3Ryb2tlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMub3R5cGUgPT09ICdTVFJPS0VEJyB8fCAhdGhpcy5vdHlwZSk7XG4gIH1cblxuICBpc0Jhc2ljKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnQkFTSUMnO1xuICB9XG5cbiAgaXNNaW5pRmFiKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnRkFCLU1JTkknO1xuICB9XG5cbiAgaXNJY29uQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm90eXBlID09PSAnSUNPTic7XG4gIH1cbn1cbiJdfQ==