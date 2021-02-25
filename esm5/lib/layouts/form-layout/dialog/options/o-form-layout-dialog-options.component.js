import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../../decorators/input-converter';
export var DEFAULT_INPUTS_O_FORM_LAYOUT_DIALOG_OPTIONS = [
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
var OFormLayoutDialogOptionsComponent = (function () {
    function OFormLayoutDialogOptionsComponent() {
        this.width = '';
        this.height = '';
        this.class = '';
        this.closeOnNavigation = true;
        this.disableClose = true;
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
    OFormLayoutDialogOptionsComponent.ctorParameters = function () { return []; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormLayoutDialogOptionsComponent.prototype, "closeOnNavigation", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormLayoutDialogOptionsComponent.prototype, "disableClose", void 0);
    return OFormLayoutDialogOptionsComponent;
}());
export { OFormLayoutDialogOptionsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1kaWFsb2ctb3B0aW9ucy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2xheW91dHMvZm9ybS1sYXlvdXQvZGlhbG9nL29wdGlvbnMvby1mb3JtLWxheW91dC1kaWFsb2ctb3B0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHN0QsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXhFLE1BQU0sQ0FBQyxJQUFNLDJDQUEyQyxHQUFHO0lBQ3pELE9BQU87SUFDUCxxQkFBcUI7SUFDckIscUJBQXFCO0lBQ3JCLFFBQVE7SUFDUix1QkFBdUI7SUFDdkIsc0JBQXNCO0lBQ3RCLE9BQU87SUFDUCxVQUFVO0lBQ1YsK0JBQStCO0lBQy9CLHdDQUF3QztJQUN4Qyw0QkFBNEI7Q0FDN0IsQ0FBQztBQUVGO0lBV0U7UUFDTyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBTW5CLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFNcEIsVUFBSyxHQUFzQixFQUFFLENBQUM7UUFPOUIsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBR2xDLGlCQUFZLEdBQVksSUFBSSxDQUFDO0lBdkJwQixDQUFDOztnQkFYbEIsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSw4QkFBOEI7b0JBQ3hDLFFBQVEsRUFBRSxHQUFHO29CQUNiLE1BQU0sRUFBRSwyQ0FBMkM7b0JBQ25ELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osc0NBQXNDLEVBQUUsTUFBTTtxQkFDL0M7aUJBQ0Y7OztJQXVCQztRQURDLGNBQWMsRUFBRTs7Z0ZBQ3dCO0lBR3pDO1FBREMsY0FBYyxFQUFFOzsyRUFDbUI7SUFFdEMsd0NBQUM7Q0FBQSxBQXBDRCxJQW9DQztTQTNCWSxpQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEaWFsb2dQb3NpdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX0RJQUxPR19PUFRJT05TID0gW1xuICAnd2lkdGgnLFxuICAnbWluV2lkdGg6IG1pbi13aWR0aCcsXG4gICdtYXhXaWR0aDogbWF4LXdpZHRoJyxcbiAgJ2hlaWdodCcsXG4gICdtaW5IZWlnaHQ6IG1pbi1oZWlnaHQnLFxuICAnbWF4SGVpZ2h0IG1heC1oZWlnaHQnLFxuICAnY2xhc3MnLFxuICAncG9zaXRpb24nLFxuICAnYmFja2Ryb3BDbGFzczogYmFja2Ryb3AtY2xhc3MnLFxuICAnY2xvc2VPbk5hdmlnYXRpb246IGNsb3NlLW9uLW5hdmlnYXRpb24nLFxuICAnZGlzYWJsZUNsb3NlOmRpc2FibGUtY2xvc2UnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tbGF5b3V0LWRpYWxvZy1vcHRpb25zJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX0RJQUxPR19PUFRJT05TLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZvcm0tbGF5b3V0LWRpYWxvZy1vcHRpb25zXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtTGF5b3V0RGlhbG9nT3B0aW9uc0NvbXBvbmVudCB7XG4gIC8vIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpKSBwcm90ZWN0ZWQgb0Zvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpIHsgfVxuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgd2lkdGg6IHN0cmluZyA9ICcnO1xuXG4gIHB1YmxpYyBtaW5XaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIHB1YmxpYyBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIHB1YmxpYyBoZWlnaHQ6IHN0cmluZyA9ICcnO1xuXG4gIHB1YmxpYyBtaW5IZWlnaHQ6IG51bWJlciB8IHN0cmluZztcblxuICBwdWJsaWMgbWF4SGVpZ2h0OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgcHVibGljIGNsYXNzOiBzdHJpbmcgfCBzdHJpbmdbXSA9ICcnO1xuXG4gIHB1YmxpYyBwb3NpdGlvbjogRGlhbG9nUG9zaXRpb247XG5cbiAgcHVibGljIGJhY2tkcm9wQ2xhc3M6IHN0cmluZztcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgY2xvc2VPbk5hdmlnYXRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBkaXNhYmxlQ2xvc2U6IGJvb2xlYW4gPSB0cnVlO1xuXG59XG4iXX0=