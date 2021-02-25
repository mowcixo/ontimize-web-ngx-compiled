import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../../decorators/input-converter';
export const DEFAULT_INPUTS_O_FORM_LAYOUT_DIALOG_OPTIONS = [
    'width',
    'minWidth: min-width',
    'maxWidth: max-width',
    'height',
    'minHeight: min-height',
    'maxHeight max-height',
    'class',
    'position',
    'backdropClass: backdrop-class',
    'closeOnNavigation: close-on-navigation',
    'disableClose:disable-close'
];
export class OFormLayoutDialogOptionsComponent {
    constructor() {
        this.width = '';
        this.height = '';
        this.class = '';
        this.closeOnNavigation = true;
        this.disableClose = true;
    }
}
OFormLayoutDialogOptionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-form-layout-dialog-options',
                template: ' ',
                inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_DIALOG_OPTIONS,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-form-layout-dialog-options]': 'true'
                }
            }] }
];
OFormLayoutDialogOptionsComponent.ctorParameters = () => [];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormLayoutDialogOptionsComponent.prototype, "closeOnNavigation", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormLayoutDialogOptionsComponent.prototype, "disableClose", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1kaWFsb2ctb3B0aW9ucy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2xheW91dHMvZm9ybS1sYXlvdXQvZGlhbG9nL29wdGlvbnMvby1mb3JtLWxheW91dC1kaWFsb2ctb3B0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHN0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXhFLE1BQU0sQ0FBQyxNQUFNLDJDQUEyQyxHQUFHO0lBQ3pELE9BQU87SUFDUCxxQkFBcUI7SUFDckIscUJBQXFCO0lBQ3JCLFFBQVE7SUFDUix1QkFBdUI7SUFDdkIsc0JBQXNCO0lBQ3RCLE9BQU87SUFDUCxVQUFVO0lBQ1YsK0JBQStCO0lBQy9CLHdDQUF3QztJQUN4Qyw0QkFBNEI7Q0FDN0IsQ0FBQztBQVdGLE1BQU0sT0FBTyxpQ0FBaUM7SUFFNUM7UUFDTyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBTW5CLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFNcEIsVUFBSyxHQUFzQixFQUFFLENBQUM7UUFPOUIsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBR2xDLGlCQUFZLEdBQVksSUFBSSxDQUFDO0lBdkJwQixDQUFDOzs7WUFYbEIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw4QkFBOEI7Z0JBQ3hDLFFBQVEsRUFBRSxHQUFHO2dCQUNiLE1BQU0sRUFBRSwyQ0FBMkM7Z0JBQ25ELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osc0NBQXNDLEVBQUUsTUFBTTtpQkFDL0M7YUFDRjs7O0FBdUJDO0lBREMsY0FBYyxFQUFFOzs0RUFDd0I7QUFHekM7SUFEQyxjQUFjLEVBQUU7O3VFQUNtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERpYWxvZ1Bvc2l0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRk9STV9MQVlPVVRfRElBTE9HX09QVElPTlMgPSBbXG4gICd3aWR0aCcsXG4gICdtaW5XaWR0aDogbWluLXdpZHRoJyxcbiAgJ21heFdpZHRoOiBtYXgtd2lkdGgnLFxuICAnaGVpZ2h0JyxcbiAgJ21pbkhlaWdodDogbWluLWhlaWdodCcsXG4gICdtYXhIZWlnaHQgbWF4LWhlaWdodCcsXG4gICdjbGFzcycsXG4gICdwb3NpdGlvbicsXG4gICdiYWNrZHJvcENsYXNzOiBiYWNrZHJvcC1jbGFzcycsXG4gICdjbG9zZU9uTmF2aWdhdGlvbjogY2xvc2Utb24tbmF2aWdhdGlvbicsXG4gICdkaXNhYmxlQ2xvc2U6ZGlzYWJsZS1jbG9zZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZm9ybS1sYXlvdXQtZGlhbG9nLW9wdGlvbnMnLFxuICB0ZW1wbGF0ZTogJyAnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fRk9STV9MQVlPVVRfRElBTE9HX09QVElPTlMsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS1sYXlvdXQtZGlhbG9nLW9wdGlvbnNdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXREaWFsb2dPcHRpb25zQ29tcG9uZW50IHtcbiAgLy8gY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCkpIHByb3RlY3RlZCBvRm9ybUxheW91dE1hbmFnZXI6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCkgeyB9XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyB3aWR0aDogc3RyaW5nID0gJyc7XG5cbiAgcHVibGljIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgcHVibGljIG1heFdpZHRoOiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgcHVibGljIGhlaWdodDogc3RyaW5nID0gJyc7XG5cbiAgcHVibGljIG1pbkhlaWdodDogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIHB1YmxpYyBtYXhIZWlnaHQ6IG51bWJlciB8IHN0cmluZztcblxuICBwdWJsaWMgY2xhc3M6IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgcHVibGljIHBvc2l0aW9uOiBEaWFsb2dQb3NpdGlvbjtcblxuICBwdWJsaWMgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBjbG9zZU9uTmF2aWdhdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGRpc2FibGVDbG9zZTogYm9vbGVhbiA9IHRydWU7XG5cbn1cbiJdfQ==