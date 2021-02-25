import { QueryList, ViewChildren } from '@angular/core';
import { O_MAT_ERROR_OPTIONS, OMatErrorComponent } from '../../../../shared/material/o-mat-error/o-mat-error';
import { Codes } from '../../../../util/codes';
import { Util } from '../../../../util/util';
var OTableBaseDialogClass = (function () {
    function OTableBaseDialogClass(injector) {
        this.injector = injector;
        try {
            this.errorOptions = this.injector.get(O_MAT_ERROR_OPTIONS) || {};
        }
        catch (e) {
            this.errorOptions = {};
        }
    }
    OTableBaseDialogClass.prototype.setFormControl = function (formControl) {
        this.formControl = formControl;
    };
    Object.defineProperty(OTableBaseDialogClass.prototype, "tooltipClass", {
        get: function () {
            var result;
            var liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
            if (liteError && Util.isDefined(this.formControl) && this.formControlHasErrors()) {
                result = "o-tooltip o-mat-error";
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableBaseDialogClass.prototype, "tooltipText", {
        get: function () {
            var result;
            var liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
            if (liteError && this.formControlHasErrors() && this.oMatErrorChildren && this.oMatErrorChildren.length > 0) {
                result = '';
                this.oMatErrorChildren.forEach(function (oMatError) {
                    result += oMatError.text + "\n";
                });
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    OTableBaseDialogClass.prototype.formControlHasErrors = function () {
        return Util.isDefined(this.formControl) && this.formControl.touched && Util.isDefined(this.formControl.errors);
    };
    OTableBaseDialogClass.propDecorators = {
        oMatErrorChildren: [{ type: ViewChildren, args: [OMatErrorComponent,] }]
    };
    return OTableBaseDialogClass;
}());
export { OTableBaseDialogClass };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1iYXNlLWRpYWxvZy5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9vLXRhYmxlLWJhc2UtZGlhbG9nLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBWSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR2xFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBRTlHLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFN0M7SUFPRSwrQkFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRTVCLElBQUk7WUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2xFO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFUyw4Q0FBYyxHQUF4QixVQUF5QixXQUE0QjtRQUNuRCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDO0lBRUQsc0JBQUksK0NBQVk7YUFBaEI7WUFDRSxJQUFJLE1BQWMsQ0FBQztZQUNuQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7WUFDcEUsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUU7Z0JBQ2hGLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQzthQUNsQztZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksOENBQVc7YUFBZjtZQUNFLElBQUksTUFBYyxDQUFDO1lBQ25CLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwRSxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNHLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ1osSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQTZCO29CQUMzRCxNQUFNLElBQU8sU0FBUyxDQUFDLElBQUksT0FBSSxDQUFDO2dCQUNsQyxDQUFDLENBQUMsQ0FBQzthQUNKO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQzs7O09BQUE7SUFFUyxvREFBb0IsR0FBOUI7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqSCxDQUFDOztvQ0F6Q0EsWUFBWSxTQUFDLGtCQUFrQjs7SUEwQ2xDLDRCQUFDO0NBQUEsQUE3Q0QsSUE2Q0M7U0E3Q1kscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0b3IsIFF1ZXJ5TGlzdCwgVmlld0NoaWxkcmVuIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBYnN0cmFjdENvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IE9fTUFUX0VSUk9SX09QVElPTlMsIE9NYXRFcnJvckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uLy4uL3NoYXJlZC9tYXRlcmlhbC9vLW1hdC1lcnJvci9vLW1hdC1lcnJvcic7XG5pbXBvcnQgeyBPTWF0RXJyb3JPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMvby1tYXQtZXJyb3IudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBPVGFibGVCYXNlRGlhbG9nQ2xhc3Mge1xuXG4gIHByb3RlY3RlZCBlcnJvck9wdGlvbnM6IE9NYXRFcnJvck9wdGlvbnM7XG4gIEBWaWV3Q2hpbGRyZW4oT01hdEVycm9yQ29tcG9uZW50KVxuICBwcm90ZWN0ZWQgb01hdEVycm9yQ2hpbGRyZW46IFF1ZXJ5TGlzdDxPTWF0RXJyb3JDb21wb25lbnQ+O1xuICBwcm90ZWN0ZWQgZm9ybUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVycm9yT3B0aW9ucyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9fTUFUX0VSUk9SX09QVElPTlMpIHx8IHt9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuZXJyb3JPcHRpb25zID0ge307XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHNldEZvcm1Db250cm9sKGZvcm1Db250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICB0aGlzLmZvcm1Db250cm9sID0gZm9ybUNvbnRyb2w7XG4gIH1cblxuICBnZXQgdG9vbHRpcENsYXNzKCk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdDogc3RyaW5nO1xuICAgIGNvbnN0IGxpdGVFcnJvciA9IHRoaXMuZXJyb3JPcHRpb25zLnR5cGUgPT09IENvZGVzLk9fTUFUX0VSUk9SX0xJVEU7XG4gICAgaWYgKGxpdGVFcnJvciAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm1Db250cm9sKSAmJiB0aGlzLmZvcm1Db250cm9sSGFzRXJyb3JzKCkpIHtcbiAgICAgIHJlc3VsdCA9IGBvLXRvb2x0aXAgby1tYXQtZXJyb3JgO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0IHRvb2x0aXBUZXh0KCk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdDogc3RyaW5nO1xuICAgIGNvbnN0IGxpdGVFcnJvciA9IHRoaXMuZXJyb3JPcHRpb25zLnR5cGUgPT09IENvZGVzLk9fTUFUX0VSUk9SX0xJVEU7XG4gICAgaWYgKGxpdGVFcnJvciAmJiB0aGlzLmZvcm1Db250cm9sSGFzRXJyb3JzKCkgJiYgdGhpcy5vTWF0RXJyb3JDaGlsZHJlbiAmJiB0aGlzLm9NYXRFcnJvckNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgdGhpcy5vTWF0RXJyb3JDaGlsZHJlbi5mb3JFYWNoKChvTWF0RXJyb3I6IE9NYXRFcnJvckNvbXBvbmVudCkgPT4ge1xuICAgICAgICByZXN1bHQgKz0gYCR7b01hdEVycm9yLnRleHR9XFxuYDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIGZvcm1Db250cm9sSGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm1Db250cm9sKSAmJiB0aGlzLmZvcm1Db250cm9sLnRvdWNoZWQgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5mb3JtQ29udHJvbC5lcnJvcnMpO1xuICB9XG59XG4iXX0=