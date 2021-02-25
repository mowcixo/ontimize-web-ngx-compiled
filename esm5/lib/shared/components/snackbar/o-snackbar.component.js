import { Component, Injector } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
var OSnackBarConfig = (function () {
    function OSnackBarConfig() {
    }
    return OSnackBarConfig;
}());
export { OSnackBarConfig };
var OSnackBarComponent = (function () {
    function OSnackBarComponent(injector) {
        this.injector = injector;
        this.iconPosition = 'left';
        this.snackBarRef = this.injector.get(MatSnackBarRef);
    }
    OSnackBarComponent.prototype.open = function (message, config) {
        this.message = message;
        if (config) {
            if (config.action) {
                this.action = config.action;
            }
            if (config.icon) {
                this.icon = config.icon;
            }
            if (config.iconPosition) {
                this.iconPosition = config.iconPosition;
            }
        }
    };
    OSnackBarComponent.prototype.onAction = function () {
        this.snackBarRef.dismissWithAction();
    };
    OSnackBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-snackbar',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"start center\">\n  <mat-icon *ngIf=\"icon && iconPosition==='left'\" class=\"o-snackbar-icon\">{{ icon }}</mat-icon>\n  <span fxFlex class=\"o-snackbar-message\">\n    {{ message | oTranslate }}\n  </span>\n  <mat-icon *ngIf=\"icon && iconPosition==='right'\" class=\"o-snackbar-icon\">{{ icon }}</mat-icon>\n  <button type=\"button\" *ngIf=\"action\" (click)=\"onAction()\"\n    class=\"mat-simple-snackbar-action\">{{ action | oTranslate }}</button>\n</div>\n",
                    host: {
                        '[class.o-snackbar]': 'true'
                    },
                    styles: [".o-snackbar-message{padding:0 8px}.mat-simple-snackbar-action{-webkit-user-select:none;user-select:none;cursor:pointer;outline:0;border:none;-webkit-tap-highlight-color:transparent;background:0 0}"]
                }] }
    ];
    OSnackBarComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OSnackBarComponent;
}());
export { OSnackBarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbmFja2Jhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9jb21wb25lbnRzL3NuYWNrYmFyL28tc25hY2tiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQU9uRDtJQUFBO0lBV0EsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7O0FBRUQ7SUFpQkUsNEJBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUx2QixpQkFBWSxHQUEwQixNQUFNLENBQUM7UUFPbEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU0saUNBQUksR0FBWCxVQUFZLE9BQWUsRUFBRSxNQUF3QjtRQUNuRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO2dCQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQzthQUN6QjtZQUNELElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQ3pDO1NBQ0Y7SUFDSCxDQUFDO0lBRU0scUNBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUN2QyxDQUFDOztnQkF4Q0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QiwrZkFBd0M7b0JBRXhDLElBQUksRUFBRTt3QkFDSixvQkFBb0IsRUFBRSxNQUFNO3FCQUM3Qjs7aUJBQ0Y7OztnQkE1Qm1CLFFBQVE7O0lBK0Q1Qix5QkFBQztDQUFBLEFBMUNELElBMENDO1NBbENZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFNuYWNrQmFyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5leHBvcnQgZGVjbGFyZSB0eXBlIE9TbmFja0Jhckljb25Qb3NpdGlvbiA9ICdsZWZ0JyB8ICdyaWdodCc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3Igc2hvd2luZyBhIFNuYWNrQmFyIHdpdGggdGhlIFNuYWNrQmFyIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBPU25hY2tCYXJDb25maWcge1xuICAvKiogVGV4dCBzaG93biBpbiB0aGUgYWN0aW9uIGJ1dHRvbi4gKi9cbiAgcHVibGljIGFjdGlvbj86IHN0cmluZztcbiAgLyoqIFRpbWUgdGhlIFNuYWNrQmFyIGlzIHNob3duLiAqL1xuICBwdWJsaWMgbWlsbGlzZWNvbmRzPzogbnVtYmVyO1xuICAvKiogTWF0ZXJpYWwgaWNvbiBzaG93biBpbiB0aGUgU25hY2tCYXIuICovXG4gIHB1YmxpYyBpY29uPzogc3RyaW5nO1xuICAvKiogUG9zaXRpb24gd2hlcmUgdGhlIGljb24gaXMgc2hvd24uIERlZmF1bHQgbGVmdC4gKi9cbiAgcHVibGljIGljb25Qb3NpdGlvbj86IE9TbmFja0Jhckljb25Qb3NpdGlvbjtcbiAgLyoqIENTUyBjbGFzcyB0byBiZSBhZGRlZCB0byB0aGUgc25hY2sgYmFyIGNvbnRhaW5lciAqL1xuICBwdWJsaWMgY3NzQ2xhc3M/OiBzdHJpbmc7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tc25hY2tiYXInLFxuICB0ZW1wbGF0ZVVybDogJ28tc25hY2tiYXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnby1zbmFja2Jhci5jb21wb25lbnQuc2NzcyddLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXNuYWNrYmFyXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9TbmFja0JhckNvbXBvbmVudCB7XG5cbiAgcHVibGljIG1lc3NhZ2U6IHN0cmluZztcbiAgcHVibGljIGFjdGlvbjogc3RyaW5nO1xuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwdWJsaWMgaWNvblBvc2l0aW9uOiBPU25hY2tCYXJJY29uUG9zaXRpb24gPSAnbGVmdCc7XG5cbiAgcHJvdGVjdGVkIHNuYWNrQmFyUmVmOiBNYXRTbmFja0JhclJlZjx7fT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLnNuYWNrQmFyUmVmID0gdGhpcy5pbmplY3Rvci5nZXQoTWF0U25hY2tCYXJSZWYpO1xuICB9XG5cbiAgcHVibGljIG9wZW4obWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPU25hY2tCYXJDb25maWcpOiB2b2lkIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgIGlmIChjb25maWcuYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gY29uZmlnLmFjdGlvbjtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuaWNvbikge1xuICAgICAgICB0aGlzLmljb24gPSBjb25maWcuaWNvbjtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuaWNvblBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMuaWNvblBvc2l0aW9uID0gY29uZmlnLmljb25Qb3NpdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25BY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zbmFja0JhclJlZi5kaXNtaXNzV2l0aEFjdGlvbigpO1xuICB9XG5cbn1cbiJdfQ==