import { Component, EventEmitter, Injector } from '@angular/core';
import { OTableExportButtonService } from './o-table-export-button.service';
export var DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON = [
    'icon',
    'svgIcon : svg-icon',
    'olabel: label',
    'exportType: export-type'
];
export var DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON = [
    'onClick'
];
var OTableExportButtonComponent = (function () {
    function OTableExportButtonComponent(injector) {
        this.injector = injector;
        this.onClick = new EventEmitter();
        this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
    }
    OTableExportButtonComponent.prototype.click = function () {
        this.onClick.emit(this.exportType);
        this.oTableExportButtonService.export$.next(this.exportType);
    };
    OTableExportButtonComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-export-button',
                    template: "<button type=\"button\" mat-raised-button (click)=\"click()\">\n  <div fxLayout=\"column\" fxLayoutAlign=\"center center\">\n    <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"icon!==undefined\" style=\"vertical-align:middle\">{{ icon }}</mat-icon>\n    <mat-icon class=\"material-icons o-button-icon\" *ngIf=\"svgIcon!==undefined\" style=\"vertical-align:middle\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <span>{{ olabel | oTranslate }}</span>\n  </div>\n</button>\n",
                    inputs: DEFAULT_INPUTS_O_TABLE_EXPORT_BUTTON,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_EXPORT_BUTTON
                }] }
    ];
    OTableExportButtonComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OTableExportButtonComponent;
}());
export { OTableExportButtonComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1leHBvcnQtYnV0dG9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2V4cG9ydC1idXR0b24vby10YWJsZS1leHBvcnQtYnV0dG9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFNUUsTUFBTSxDQUFDLElBQU0sb0NBQW9DLEdBQUc7SUFDbEQsTUFBTTtJQUNOLG9CQUFvQjtJQUNwQixlQUFlO0lBQ2YseUJBQXlCO0NBQzFCLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSxxQ0FBcUMsR0FBRztJQUNuRCxTQUFTO0NBQ1YsQ0FBQztBQUVGO0lBZUUscUNBQ1UsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUxyQixZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFPckQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELDJDQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQy9ELENBQUM7O2dCQXhCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsdWVBQXFEO29CQUNyRCxNQUFNLEVBQUUsb0NBQW9DO29CQUM1QyxPQUFPLEVBQUUscUNBQXFDO2lCQUMvQzs7O2dCQXBCaUMsUUFBUTs7SUF5QzFDLGtDQUFDO0NBQUEsQUExQkQsSUEwQkM7U0FwQlksMkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UgfSBmcm9tICcuL28tdGFibGUtZXhwb3J0LWJ1dHRvbi5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfRVhQT1JUX0JVVFRPTiA9IFtcbiAgJ2ljb24nLFxuICAnc3ZnSWNvbiA6IHN2Zy1pY29uJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAnZXhwb3J0VHlwZTogZXhwb3J0LXR5cGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfRVhQT1JUX0JVVFRPTiA9IFtcbiAgJ29uQ2xpY2snXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWV4cG9ydC1idXR0b24nLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1leHBvcnQtYnV0dG9uLmNvbXBvbmVudC5odG1sJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0VYUE9SVF9CVVRUT04sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0VYUE9SVF9CVVRUT05cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlRXhwb3J0QnV0dG9uQ29tcG9uZW50IHtcblxuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwdWJsaWMgc3ZnSWNvbjogc3RyaW5nO1xuICBwdWJsaWMgb2xhYmVsOiBzdHJpbmc7XG4gIHB1YmxpYyBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJvdGVjdGVkIGV4cG9ydFR5cGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIG9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2U6IE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5vVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZSk7XG4gIH1cblxuICBjbGljaygpIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh0aGlzLmV4cG9ydFR5cGUpO1xuICAgIHRoaXMub1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZS5leHBvcnQkLm5leHQodGhpcy5leHBvcnRUeXBlKTtcbiAgfVxuXG59XG4iXX0=