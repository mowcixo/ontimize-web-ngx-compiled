import { Component, Injector } from '@angular/core';
import { Util } from '../../../util/util';
export var DEFAULT_INPUTS_O_VALIDATOR = [
    'validatorFn: validator-function',
    'errorName: error-name',
    'errorText: error-text'
];
var OValidatorComponent = (function () {
    function OValidatorComponent(injector) {
        this.injector = injector;
        this.validatorFn = null;
        this.errorsData = [];
    }
    OValidatorComponent.prototype.registerError = function (oError) {
        this.errorsData.push({
            name: oError.getName(),
            text: oError.getText()
        });
    };
    OValidatorComponent.prototype.getValidatorFn = function () {
        return this.validatorFn;
    };
    OValidatorComponent.prototype.getErrorsData = function () {
        var result = [];
        if (this.errorsData.length > 0) {
            result = this.errorsData;
        }
        else if (Util.isDefined(this.errorName) && Util.isDefined(this.errorText)) {
            result = [{
                    name: this.errorName,
                    text: this.errorText
                }];
        }
        return result;
    };
    OValidatorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-validator',
                    template: ' ',
                    inputs: DEFAULT_INPUTS_O_VALIDATOR
                }] }
    ];
    OValidatorComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OValidatorComponent;
}());
export { OValidatorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby12YWxpZGF0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29tcG9uZW50cy92YWxpZGF0aW9uL28tdmFsaWRhdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUlwRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsTUFBTSxDQUFDLElBQU0sMEJBQTBCLEdBQUc7SUFDeEMsaUNBQWlDO0lBQ2pDLHVCQUF1QjtJQUN2Qix1QkFBdUI7Q0FDeEIsQ0FBQztBQUVGO0lBYUUsNkJBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVA5QixnQkFBVyxHQUFnQixJQUFJLENBQUM7UUFJdEIsZUFBVSxHQUFnQixFQUFFLENBQUM7SUFNdkMsQ0FBQztJQUVELDJDQUFhLEdBQWIsVUFBYyxNQUF1QjtRQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUNuQixJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUN0QixJQUFJLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNENBQWMsR0FBZDtRQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQsMkNBQWEsR0FBYjtRQUNFLElBQUksTUFBTSxHQUFnQixFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDMUI7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNFLE1BQU0sR0FBRyxDQUFDO29CQUNSLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUztvQkFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUNyQixDQUFDLENBQUM7U0FDSjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7O2dCQXpDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFFBQVEsRUFBRSxHQUFHO29CQUNiLE1BQU0sRUFBRSwwQkFBMEI7aUJBQ25DOzs7Z0JBakJtQixRQUFROztJQXVENUIsMEJBQUM7Q0FBQSxBQTFDRCxJQTBDQztTQXJDWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgRXJyb3JEYXRhIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZXJyb3ItZGF0YS50eXBlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Vycm9yQ29tcG9uZW50IH0gZnJvbSAnLi9vLWVycm9yLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1ZBTElEQVRPUiA9IFtcbiAgJ3ZhbGlkYXRvckZuOiB2YWxpZGF0b3ItZnVuY3Rpb24nLFxuICAnZXJyb3JOYW1lOiBlcnJvci1uYW1lJyxcbiAgJ2Vycm9yVGV4dDogZXJyb3ItdGV4dCdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdmFsaWRhdG9yJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1ZBTElEQVRPUlxufSlcbmV4cG9ydCBjbGFzcyBPVmFsaWRhdG9yQ29tcG9uZW50IHtcblxuICB2YWxpZGF0b3JGbjogVmFsaWRhdG9yRm4gPSBudWxsO1xuICBlcnJvck5hbWU6IHN0cmluZztcbiAgZXJyb3JUZXh0OiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGVycm9yc0RhdGE6IEVycm9yRGF0YVtdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcblxuICB9XG5cbiAgcmVnaXN0ZXJFcnJvcihvRXJyb3I6IE9FcnJvckNvbXBvbmVudCkge1xuICAgIHRoaXMuZXJyb3JzRGF0YS5wdXNoKHtcbiAgICAgIG5hbWU6IG9FcnJvci5nZXROYW1lKCksXG4gICAgICB0ZXh0OiBvRXJyb3IuZ2V0VGV4dCgpXG4gICAgfSk7XG4gIH1cblxuICBnZXRWYWxpZGF0b3JGbigpOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yRm47XG4gIH1cblxuICBnZXRFcnJvcnNEYXRhKCk6IEVycm9yRGF0YVtdIHtcbiAgICBsZXQgcmVzdWx0OiBFcnJvckRhdGFbXSA9IFtdO1xuICAgIGlmICh0aGlzLmVycm9yc0RhdGEubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5lcnJvcnNEYXRhO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5lcnJvck5hbWUpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZXJyb3JUZXh0KSkge1xuICAgICAgcmVzdWx0ID0gW3tcbiAgICAgICAgbmFtZTogdGhpcy5lcnJvck5hbWUsXG4gICAgICAgIHRleHQ6IHRoaXMuZXJyb3JUZXh0XG4gICAgICB9XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19