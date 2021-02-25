import { Component, forwardRef, Inject, Injector, Optional } from '@angular/core';
import { OValidatorComponent } from './o-validator.component';
export const DEFAULT_INPUTS_O_ERROR = [
    'name',
    'text'
];
export class OErrorComponent {
    constructor(oValidator, injector) {
        this.oValidator = oValidator;
        this.injector = injector;
    }
    ngOnInit() {
        this.registerValidatorError();
    }
    registerValidatorError() {
        if (this.oValidator) {
            this.oValidator.registerError(this);
        }
    }
    getName() {
        return this.name;
    }
    getText() {
        return this.text;
    }
}
OErrorComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-error',
                template: ' ',
                inputs: DEFAULT_INPUTS_O_ERROR
            }] }
];
OErrorComponent.ctorParameters = () => [
    { type: OValidatorComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OValidatorComponent),] }] },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1lcnJvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9jb21wb25lbnRzL3ZhbGlkYXRpb24vby1lcnJvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFOUQsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsTUFBTTtJQUNOLE1BQU07Q0FDUCxDQUFDO0FBT0YsTUFBTSxPQUFPLGVBQWU7SUFLMUIsWUFDdUUsVUFBK0IsRUFDMUYsUUFBa0I7UUFEeUMsZUFBVSxHQUFWLFVBQVUsQ0FBcUI7UUFDMUYsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUU5QixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxzQkFBc0I7UUFDcEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQzs7O1lBaENGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsTUFBTSxFQUFFLHNCQUFzQjthQUMvQjs7O1lBWFEsbUJBQW1CLHVCQWtCdkIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUM7WUFwQnJCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uSW5pdCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1ZhbGlkYXRvckNvbXBvbmVudCB9IGZyb20gJy4vby12YWxpZGF0b3IuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRVJST1IgPSBbXG4gICduYW1lJyxcbiAgJ3RleHQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWVycm9yJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0VSUk9SXG59KVxuZXhwb3J0IGNsYXNzIE9FcnJvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgbmFtZTogc3RyaW5nO1xuICB0ZXh0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9WYWxpZGF0b3JDb21wb25lbnQpKSBwcm90ZWN0ZWQgb1ZhbGlkYXRvcjogT1ZhbGlkYXRvckNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yZWdpc3RlclZhbGlkYXRvckVycm9yKCk7XG4gIH1cblxuICByZWdpc3RlclZhbGlkYXRvckVycm9yKCkge1xuICAgIGlmICh0aGlzLm9WYWxpZGF0b3IpIHtcbiAgICAgIHRoaXMub1ZhbGlkYXRvci5yZWdpc3RlckVycm9yKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgZ2V0VGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRleHQ7XG4gIH1cblxufVxuIl19