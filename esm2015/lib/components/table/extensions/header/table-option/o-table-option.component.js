import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
export const DEFAULT_INPUTS_O_TABLE_OPTION = [
    'oattr: attr',
    'enabled',
    'icon',
    'showActiveIcon : show-active-icon',
    'olabel: label',
    'active'
];
export const DEFAULT_OUTPUTS_O_TABLE_OPTION = [
    'onClick'
];
export class OTableOptionComponent {
    constructor(injector, elRef) {
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
    innerOnClick() {
        this.onClick.emit();
        this.setActive(!this.active);
    }
    showActiveOptionIcon() {
        return this.showActiveIcon && this.active;
    }
    setActive(val) {
        this.active = val;
        this.cd.detectChanges();
    }
}
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
OTableOptionComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1vcHRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLW9wdGlvbi9vLXRhYmxlLW9wdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFDUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHO0lBQzNDLGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBTTtJQUVOLG1DQUFtQztJQUNuQyxlQUFlO0lBQ2YsUUFBUTtDQUNULENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw4QkFBOEIsR0FBRztJQUM1QyxTQUFTO0NBQ1YsQ0FBQztBQWVGLE1BQU0sT0FBTyxxQkFBcUI7SUFrQmhDLFlBQ1ksUUFBa0IsRUFDckIsS0FBaUI7UUFEZCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3JCLFVBQUssR0FBTCxLQUFLLENBQVk7UUFoQjFCLFlBQU8sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUkzRCxZQUFPLEdBQVksSUFBSSxDQUFDO1FBSXhCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBRWhDLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFRdEIsSUFBSTtZQUNGLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUNoRDtRQUFDLE9BQU8sQ0FBQyxFQUFFO1NBQ1g7SUFDSCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsb0JBQW9CO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzVDLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBWTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFCLENBQUM7O0FBdENhLGlEQUEyQixHQUFHLHVCQUF1QixDQUFDOztZQWZyRSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsNlVBQThDO2dCQUU5QyxNQUFNLEVBQUUsNkJBQTZCO2dCQUNyQyxPQUFPLEVBQUUsOEJBQThCO2dCQUN2QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRTtvQkFDSix3QkFBd0IsRUFBRSxNQUFNO2lCQUNqQzs7YUFDRjs7O1lBL0JDLFFBQVE7WUFGUixVQUFVOztBQTJDVjtJQURDLGNBQWMsRUFBRTs7c0RBQ087QUFJeEI7SUFEQyxjQUFjLEVBQUU7OzZEQUNlO0FBRWhDO0lBREMsY0FBYyxFQUFFOztxREFDTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdG9yLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9PUFRJT04gPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICdlbmFibGVkJyxcbiAgJ2ljb24nLFxuICAvLyBzaG93LWFjdGl2ZS1pY29uIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogc2hvdyBpY29uIHdoZW4gb3B0aW9uIGlzIGFjdGl2ZS4gRGVmYXVsdCA6bm8uXG4gICdzaG93QWN0aXZlSWNvbiA6IHNob3ctYWN0aXZlLWljb24nLFxuICAnb2xhYmVsOiBsYWJlbCcsXG4gICdhY3RpdmUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfT1BUSU9OID0gW1xuICAnb25DbGljaydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtb3B0aW9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtb3B0aW9uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1vcHRpb24uY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX09QVElPTixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfT1BUSU9OLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1vcHRpb25dJzogJ3RydWUnLFxuICB9XG59KVxuXG5leHBvcnQgY2xhc3MgT1RhYmxlT3B0aW9uQ29tcG9uZW50IHtcblxuICBwdWJsaWMgc3RhdGljIE9fVEFCTEVfT1BUSU9OX0FDVElWRV9DTEFTUyA9ICdvLXRhYmxlLW9wdGlvbi1hY3RpdmUnO1xuXG4gIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgb2F0dHI6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgZW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gIGljb246IHN0cmluZztcbiAgb2xhYmVsOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dBY3RpdmVJY29uOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNkOiBDaGFuZ2VEZXRlY3RvclJlZjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHB1YmxpYyBlbFJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5jZCA9IHRoaXMuaW5qZWN0b3IuZ2V0KENoYW5nZURldGVjdG9yUmVmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG5cbiAgaW5uZXJPbkNsaWNrKCkge1xuICAgIHRoaXMub25DbGljay5lbWl0KCk7XG4gICAgdGhpcy5zZXRBY3RpdmUoIXRoaXMuYWN0aXZlKTtcbiAgfVxuXG4gIHNob3dBY3RpdmVPcHRpb25JY29uKCkge1xuICAgIHJldHVybiB0aGlzLnNob3dBY3RpdmVJY29uICYmIHRoaXMuYWN0aXZlO1xuICB9XG5cbiAgc2V0QWN0aXZlKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuYWN0aXZlID0gdmFsO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbn1cbiJdfQ==