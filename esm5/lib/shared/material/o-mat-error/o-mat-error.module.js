import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatTooltipModule } from '@angular/material';
import { OMatErrorComponent } from './o-mat-error';
var OMatErrorModule = (function () {
    function OMatErrorModule() {
    }
    OMatErrorModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OMatErrorComponent],
                    imports: [MatTooltipModule, MatFormFieldModule, CommonModule],
                    exports: [OMatErrorComponent]
                },] }
    ];
    return OMatErrorModule;
}());
export { OMatErrorModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtZXJyb3IubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvbWF0ZXJpYWwvby1tYXQtZXJyb3Ivby1tYXQtZXJyb3IubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXpFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRDtJQUFBO0lBTUEsQ0FBQzs7Z0JBTkEsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUNsQyxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLENBQUM7b0JBQzdELE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO2lCQUM5Qjs7SUFFRCxzQkFBQztDQUFBLEFBTkQsSUFNQztTQURZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSwgTWF0VG9vbHRpcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT01hdEVycm9yQ29tcG9uZW50IH0gZnJvbSAnLi9vLW1hdC1lcnJvcic7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09NYXRFcnJvckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtNYXRUb29sdGlwTW9kdWxlLCBNYXRGb3JtRmllbGRNb2R1bGUsIENvbW1vbk1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPTWF0RXJyb3JDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9NYXRFcnJvck1vZHVsZSB7XG59XG4iXX0=