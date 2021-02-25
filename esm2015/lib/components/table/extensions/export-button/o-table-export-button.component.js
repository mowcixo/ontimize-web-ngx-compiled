import { Component, EventEmitter, Injector } from '@angular/core';
import { OTableExportButtonService } from './o-table-export-button.service';
export const DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON = [
    'icon',
    'svgIcon : svg-icon',
    'olabel: label',
    'exportType: export-type'
];
export const DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON = [
    'onClick'
];
export class OTableExportButtonComponent {
    constructor(injector) {
        this.injector = injector;
        this.onClick = new EventEmitter();
        this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
    }
    click() {
        this.onClick.emit(this.exportType);
        this.oTableExportButtonService.export$.next(this.exportType);
    }
}
OTableExportButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-export-button',
                template: "<button type=\"button\" mat-raised-button (click)=\"click()\">\n  <div fxLayout=\"column\" fxLayoutAlign=\"center center\">\n    <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}</mat-icon>\n    <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <span>{{ olabel | oTranslate }}</span>\n  </div>\n</button>\n",
                inputs: DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON,
                outputs: DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON
            }] }
];
OTableExportButtonComponent.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1leHBvcnQtYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2V4cG9ydC1idXR0b24vby10YWJsZS1leHBvcnQtYnV0dG9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFNUUsTUFBTSxDQUFDLE1BQU0sb0NBQW9DLEdBQUc7SUFDbEQsTUFBTTtJQUNOLG9CQUFvQjtJQUNwQixlQUFlO0lBQ2YseUJBQXlCO0NBQzFCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxxQ0FBcUMsR0FBRztJQUNuRCxTQUFTO0NBQ1YsQ0FBQztBQVFGLE1BQU0sT0FBTywyQkFBMkI7SUFTdEMsWUFDVSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBTHJCLFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU9yRCxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMseUJBQXlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0QsQ0FBQzs7O1lBeEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyx1ZUFBcUQ7Z0JBQ3JELE1BQU0sRUFBRSxvQ0FBb0M7Z0JBQzVDLE9BQU8sRUFBRSxxQ0FBcUM7YUFDL0M7OztZQXBCaUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlIH0gZnJvbSAnLi9vLXRhYmxlLWV4cG9ydC1idXR0b24uc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0VYUE9SVF9CVVRUT04gPSBbXG4gICdpY29uJyxcbiAgJ3N2Z0ljb24gOiBzdmctaWNvbicsXG4gICdvbGFiZWw6IGxhYmVsJyxcbiAgJ2V4cG9ydFR5cGU6IGV4cG9ydC10eXBlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0VYUE9SVF9CVVRUT04gPSBbXG4gICdvbkNsaWNrJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1leHBvcnQtYnV0dG9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtZXhwb3J0LWJ1dHRvbi5jb21wb25lbnQuaHRtbCcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9FWFBPUlRfQlVUVE9OLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9FWFBPUlRfQlVUVE9OXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUV4cG9ydEJ1dHRvbkNvbXBvbmVudCB7XG5cbiAgcHVibGljIGljb246IHN0cmluZztcbiAgcHVibGljIHN2Z0ljb246IHN0cmluZztcbiAgcHVibGljIG9sYWJlbDogc3RyaW5nO1xuICBwdWJsaWMgb25DbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHByb3RlY3RlZCBleHBvcnRUeXBlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlOiBPVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMub1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UpO1xuICB9XG5cbiAgY2xpY2soKSB7XG4gICAgdGhpcy5vbkNsaWNrLmVtaXQodGhpcy5leHBvcnRUeXBlKTtcbiAgICB0aGlzLm9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UuZXhwb3J0JC5uZXh0KHRoaXMuZXhwb3J0VHlwZSk7XG4gIH1cblxufVxuIl19