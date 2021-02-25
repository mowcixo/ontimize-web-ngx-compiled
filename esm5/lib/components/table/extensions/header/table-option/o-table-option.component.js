import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
export var DEFAULT_INPUTS_O_TABLE_OPTION = [
    'oattr: attr',
    'enabled',
    'icon',
    'showActiveIcon : show-active-icon',
    'olabel: label',
    'active'
];
export var DEFAULT_OUTPUTS_O_TABLE_OPTION = [
    'onClick'
];
var OTableOptionComponent = (function () {
    function OTableOptionComponent(injector, elRef) {
        this.injector = injector;
        this.elRef = elRef;
        this.onClick = new EventEmitter();
        this.enabled = true;
        this.showActiveIcon = false;
        this.active = false;
        try {
            this.cd = this.injector.get(ChangeDetectorRef);
        }
        catch (e) {
        }
    }
    OTableOptionComponent.prototype.innerOnClick = function () {
        this.onClick.emit();
        this.setActive(!this.active);
    };
    OTableOptionComponent.prototype.showActiveOptionIcon = function () {
        return this.showActiveIcon && this.active;
    };
    OTableOptionComponent.prototype.setActive = function (val) {
        this.active = val;
        this.cd.detectChanges();
    };
    OTableOptionComponent.O_TABLE_OPTION_ACTIVE_CLASS = 'o-table-option-active';
    OTableOptionComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-option',
                    template: "<button [disabled]=\"!enabled\" type=\"button\" (click)=\"innerOnClick()\" mat-menu-item fxLayout=\"row\" fxLayoutAlign=\"start center\">\n  <mat-icon *ngIf=\"showActiveOptionIcon()\" svgIcon=\"ontimize:done\" fxLayout></mat-icon>\n  {{ olabel | oTranslate }}\n  <mat-icon *ngIf=\"icon\"> {{ icon }}</mat-icon>\n</button>",
                    inputs: DEFAULT_INPUTS_O_TABLE_OPTION,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_OPTION,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.o-table-option]': 'true',
                    },
                    styles: [""]
                }] }
    ];
    OTableOptionComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableOptionComponent.prototype, "enabled", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableOptionComponent.prototype, "showActiveIcon", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableOptionComponent.prototype, "active", void 0);
    return OTableOptionComponent;
}());
export { OTableOptionComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1vcHRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLW9wdGlvbi9vLXRhYmxlLW9wdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxJQUFNLDZCQUE2QixHQUFHO0lBQzNDLGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBTTtJQUVOLG1DQUFtQztJQUNuQyxlQUFlO0lBQ2YsUUFBUTtDQUNULENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSw4QkFBOEIsR0FBRztJQUM1QyxTQUFTO0NBQ1YsQ0FBQztBQUVGO0lBK0JFLCtCQUNZLFFBQWtCLEVBQ3JCLEtBQWlCO1FBRGQsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNyQixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBaEIxQixZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFJM0QsWUFBTyxHQUFZLElBQUksQ0FBQztRQUl4QixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQUVoQyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBUXRCLElBQUk7WUFDRixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDaEQ7UUFBQyxPQUFPLENBQUMsRUFBRTtTQUNYO0lBQ0gsQ0FBQztJQUVELDRDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELG9EQUFvQixHQUFwQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzVDLENBQUM7SUFFRCx5Q0FBUyxHQUFULFVBQVUsR0FBWTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUF0Q2EsaURBQTJCLEdBQUcsdUJBQXVCLENBQUM7O2dCQWZyRSxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsNlVBQThDO29CQUU5QyxNQUFNLEVBQUUsNkJBQTZCO29CQUNyQyxPQUFPLEVBQUUsOEJBQThCO29CQUN2QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLElBQUksRUFBRTt3QkFDSix3QkFBd0IsRUFBRSxNQUFNO3FCQUNqQzs7aUJBQ0Y7OztnQkEvQkMsUUFBUTtnQkFGUixVQUFVOztJQTJDVjtRQURDLGNBQWMsRUFBRTs7MERBQ087SUFJeEI7UUFEQyxjQUFjLEVBQUU7O2lFQUNlO0lBRWhDO1FBREMsY0FBYyxFQUFFOzt5REFDTztJQTRCMUIsNEJBQUM7Q0FBQSxBQXZERCxJQXVEQztTQTFDWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3RvcixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfT1BUSU9OID0gW1xuICAnb2F0dHI6IGF0dHInLFxuICAnZW5hYmxlZCcsXG4gICdpY29uJyxcbiAgLy8gc2hvdy1hY3RpdmUtaWNvbiBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06IHNob3cgaWNvbiB3aGVuIG9wdGlvbiBpcyBhY3RpdmUuIERlZmF1bHQgOm5vLlxuICAnc2hvd0FjdGl2ZUljb24gOiBzaG93LWFjdGl2ZS1pY29uJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAnYWN0aXZlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX09QVElPTiA9IFtcbiAgJ29uQ2xpY2snXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLW9wdGlvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLW9wdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9PUFRJT04sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX09QVElPTixcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tdGFibGUtb3B0aW9uXSc6ICd0cnVlJyxcbiAgfVxufSlcblxuZXhwb3J0IGNsYXNzIE9UYWJsZU9wdGlvbkNvbXBvbmVudCB7XG5cbiAgcHVibGljIHN0YXRpYyBPX1RBQkxFX09QVElPTl9BQ1RJVkVfQ0xBU1MgPSAnby10YWJsZS1vcHRpb24tYWN0aXZlJztcblxuICBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIG9hdHRyOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBpY29uOiBzdHJpbmc7XG4gIG9sYWJlbDogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93QWN0aXZlSWNvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjZDogQ2hhbmdlRGV0ZWN0b3JSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwdWJsaWMgZWxSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2QgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgfVxuXG4gIGlubmVyT25DbGljaygpIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCgpO1xuICAgIHRoaXMuc2V0QWN0aXZlKCF0aGlzLmFjdGl2ZSk7XG4gIH1cblxuICBzaG93QWN0aXZlT3B0aW9uSWNvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zaG93QWN0aXZlSWNvbiAmJiB0aGlzLmFjdGl2ZTtcbiAgfVxuXG4gIHNldEFjdGl2ZSh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmFjdGl2ZSA9IHZhbDtcbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG59XG4iXX0=