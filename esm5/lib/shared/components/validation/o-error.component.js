import { Component, forwardRef, Inject, Injector, Optional } from '@angular/core';
import { OValidatorComponent } from './o-validator.component';
export var DEFAULT_INPUTS_O_ERROR = [
    'name',
    'text'
];
var OErrorComponent = (function () {
    function OErrorComponent(oValidator, injector) {
        this.oValidator = oValidator;
        this.injector = injector;
    }
    OErrorComponent.prototype.ngOnInit = function () {
        this.registerValidatorError();
    };
    OErrorComponent.prototype.registerValidatorError = function () {
        if (this.oValidator) {
            this.oValidator.registerError(this);
        }
    };
    OErrorComponent.prototype.getName = function () {
        return this.name;
    };
    OErrorComponent.prototype.getText = function () {
        return this.text;
    };
    OErrorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-error',
                    template: ' ',
                    inputs: DEFAULT_INPUTS_O_ERROR
                }] }
    ];
    OErrorComponent.ctorParameters = function () { return [
        { type: OValidatorComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OValidatorComponent; }),] }] },
        { type: Injector }
    ]; };
    return OErrorComponent;
}());
export { OErrorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1lcnJvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9jb21wb25lbnRzL3ZhbGlkYXRpb24vby1lcnJvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFOUQsTUFBTSxDQUFDLElBQU0sc0JBQXNCLEdBQUc7SUFDcEMsTUFBTTtJQUNOLE1BQU07Q0FDUCxDQUFDO0FBRUY7SUFVRSx5QkFDdUUsVUFBK0IsRUFDMUYsUUFBa0I7UUFEeUMsZUFBVSxHQUFWLFVBQVUsQ0FBcUI7UUFDMUYsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUU5QixDQUFDO0lBRUQsa0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxnREFBc0IsR0FBdEI7UUFDRSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsaUNBQU8sR0FBUDtRQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsaUNBQU8sR0FBUDtRQUNFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDOztnQkFoQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxTQUFTO29CQUNuQixRQUFRLEVBQUUsR0FBRztvQkFDYixNQUFNLEVBQUUsc0JBQXNCO2lCQUMvQjs7O2dCQVhRLG1CQUFtQix1QkFrQnZCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxtQkFBbUIsRUFBbkIsQ0FBbUIsQ0FBQztnQkFwQnJCLFFBQVE7O0lBMkNoRCxzQkFBQztDQUFBLEFBbENELElBa0NDO1NBN0JZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uSW5pdCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1ZhbGlkYXRvckNvbXBvbmVudCB9IGZyb20gJy4vby12YWxpZGF0b3IuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRVJST1IgPSBbXG4gICduYW1lJyxcbiAgJ3RleHQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWVycm9yJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0VSUk9SXG59KVxuZXhwb3J0IGNsYXNzIE9FcnJvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgbmFtZTogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9WYWxpZGF0b3JDb21wb25lbnQpKSBwcm90ZWN0ZWQgb1ZhbGlkYXRvcjogT1ZhbGlkYXRvckNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yZWdpc3RlclZhbGlkYXRvckVycm9yKCk7XG4gIH1cblxuICByZWdpc3RlclZhbGlkYXRvckVycm9yKCkge1xuICAgIGlmICh0aGlzLm9WYWxpZGF0b3IpIHtcbiAgICAgIHRoaXMub1ZhbGlkYXRvci5yZWdpc3RlckVycm9yKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgZ2V0VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRleHQ7XG4gIH1cblxufVxuIl19