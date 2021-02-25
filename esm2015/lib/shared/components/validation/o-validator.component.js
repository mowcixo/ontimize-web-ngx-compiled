import { Component, Injector } from '@angular/core';
import { Util } from '../../../util/util';
export const DEFAULT_INPUTS_O_VALIDATOR = [
    'validatorFn: validator-function',
    'errorName: error-name',
    'errorText: error-text'
];
export class OValidatorComponent {
    constructor(injector) {
        this.injector = injector;
        this.validatorFn = null;
        this.errorsData = [];
    }
    registerError(oError) {
        this.errorsData.push({
            name: oError.getName(),
            text: oError.getText()
        });
    }
    getValidatorFn() {
        return this.validatorFn;
    }
    getErrorsData() {
        let result = [];
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
    }
}
OValidatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-validator',
                template: ' ',
                inputs: DEFAULT_INPUTS_O_VALIDATOR
            }] }
];
OValidatorComponent.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby12YWxpZGF0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29tcG9uZW50cy92YWxpZGF0aW9uL28tdmFsaWRhdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUlwRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQUc7SUFDeEMsaUNBQWlDO0lBQ2pDLHVCQUF1QjtJQUN2Qix1QkFBdUI7Q0FDeEIsQ0FBQztBQU9GLE1BQU0sT0FBTyxtQkFBbUI7SUFROUIsWUFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBUDlCLGdCQUFXLEdBQWdCLElBQUksQ0FBQztRQUl0QixlQUFVLEdBQWdCLEVBQUUsQ0FBQztJQU12QyxDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQXVCO1FBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1lBQ25CLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ3RCLElBQUksRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxjQUFjO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM5QixNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUMxQjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDM0UsTUFBTSxHQUFHLENBQUM7b0JBQ1IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO29CQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVM7aUJBQ3JCLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7O1lBekNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsTUFBTSxFQUFFLDBCQUEwQjthQUNuQzs7O1lBakJtQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEVycm9yRGF0YSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Vycm9yLWRhdGEudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9FcnJvckNvbXBvbmVudCB9IGZyb20gJy4vby1lcnJvci5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19WQUxJREFUT1IgPSBbXG4gICd2YWxpZGF0b3JGbjogdmFsaWRhdG9yLWZ1bmN0aW9uJyxcbiAgJ2Vycm9yTmFtZTogZXJyb3ItbmFtZScsXG4gICdlcnJvclRleHQ6IGVycm9yLXRleHQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXZhbGlkYXRvcicsXG4gIHRlbXBsYXRlOiAnICcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19WQUxJREFUT1Jcbn0pXG5leHBvcnQgY2xhc3MgT1ZhbGlkYXRvckNvbXBvbmVudCB7XG5cbiAgdmFsaWRhdG9yRm46IFZhbGlkYXRvckZuID0gbnVsbDtcbiAgZXJyb3JOYW1lOiBzdHJpbmc7XG4gIGVycm9yVGV4dDogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBlcnJvcnNEYXRhOiBFcnJvckRhdGFbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG5cbiAgfVxuXG4gIHJlZ2lzdGVyRXJyb3Iob0Vycm9yOiBPRXJyb3JDb21wb25lbnQpIHtcbiAgICB0aGlzLmVycm9yc0RhdGEucHVzaCh7XG4gICAgICBuYW1lOiBvRXJyb3IuZ2V0TmFtZSgpLFxuICAgICAgdGV4dDogb0Vycm9yLmdldFRleHQoKVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0VmFsaWRhdG9yRm4oKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRvckZuO1xuICB9XG5cbiAgZ2V0RXJyb3JzRGF0YSgpOiBFcnJvckRhdGFbXSB7XG4gICAgbGV0IHJlc3VsdDogRXJyb3JEYXRhW10gPSBbXTtcbiAgICBpZiAodGhpcy5lcnJvcnNEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuZXJyb3JzRGF0YTtcbiAgICB9IGVsc2UgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZXJyb3JOYW1lKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmVycm9yVGV4dCkpIHtcbiAgICAgIHJlc3VsdCA9IFt7XG4gICAgICAgIG5hbWU6IHRoaXMuZXJyb3JOYW1lLFxuICAgICAgICB0ZXh0OiB0aGlzLmVycm9yVGV4dFxuICAgICAgfV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==