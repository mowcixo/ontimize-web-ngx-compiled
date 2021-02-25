import { Component, Injector } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
export class OSnackBarConfig {
}
export class OSnackBarComponent {
    constructor(injector) {
        this.injector = injector;
        this.iconPosition = 'left';
        this.snackBarRef = this.injector.get(MatSnackBarRef);
    }
    open(message, config) {
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
    }
    onAction() {
        this.snackBarRef.dismissWithAction();
    }
}
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
OSnackBarComponent.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbmFja2Jhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9jb21wb25lbnRzL3NuYWNrYmFyL28tc25hY2tiYXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3BELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQU9uRCxNQUFNLE9BQU8sZUFBZTtDQVczQjtBQVVELE1BQU0sT0FBTyxrQkFBa0I7SUFTN0IsWUFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBTHZCLGlCQUFZLEdBQTBCLE1BQU0sQ0FBQztRQU9sRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSxJQUFJLENBQUMsT0FBZSxFQUFFLE1BQXdCO1FBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDN0I7WUFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQ3pCO1lBQ0QsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFDekM7U0FDRjtJQUNILENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7OztZQXhDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLCtmQUF3QztnQkFFeEMsSUFBSSxFQUFFO29CQUNKLG9CQUFvQixFQUFFLE1BQU07aUJBQzdCOzthQUNGOzs7WUE1Qm1CLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRTbmFja0JhclJlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuZXhwb3J0IGRlY2xhcmUgdHlwZSBPU25hY2tCYXJJY29uUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIHNob3dpbmcgYSBTbmFja0JhciB3aXRoIHRoZSBTbmFja0JhciBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgT1NuYWNrQmFyQ29uZmlnIHtcbiAgLyoqIFRleHQgc2hvd24gaW4gdGhlIGFjdGlvbiBidXR0b24uICovXG4gIHB1YmxpYyBhY3Rpb24/OiBzdHJpbmc7XG4gIC8qKiBUaW1lIHRoZSBTbmFja0JhciBpcyBzaG93bi4gKi9cbiAgcHVibGljIG1pbGxpc2Vjb25kcz86IG51bWJlcjtcbiAgLyoqIE1hdGVyaWFsIGljb24gc2hvd24gaW4gdGhlIFNuYWNrQmFyLiAqL1xuICBwdWJsaWMgaWNvbj86IHN0cmluZztcbiAgLyoqIFBvc2l0aW9uIHdoZXJlIHRoZSBpY29uIGlzIHNob3duLiBEZWZhdWx0IGxlZnQuICovXG4gIHB1YmxpYyBpY29uUG9zaXRpb24/OiBPU25hY2tCYXJJY29uUG9zaXRpb247XG4gIC8qKiBDU1MgY2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIHNuYWNrIGJhciBjb250YWluZXIgKi9cbiAgcHVibGljIGNzc0NsYXNzPzogc3RyaW5nO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXNuYWNrYmFyJyxcbiAgdGVtcGxhdGVVcmw6ICdvLXNuYWNrYmFyLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ28tc25hY2tiYXIuY29tcG9uZW50LnNjc3MnXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1zbmFja2Jhcl0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPU25hY2tCYXJDb21wb25lbnQge1xuXG4gIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmc7XG4gIHB1YmxpYyBhY3Rpb246IHN0cmluZztcbiAgcHVibGljIGljb246IHN0cmluZztcbiAgcHVibGljIGljb25Qb3NpdGlvbjogT1NuYWNrQmFySWNvblBvc2l0aW9uID0gJ2xlZnQnO1xuXG4gIHByb3RlY3RlZCBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8e30+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5zbmFja0JhclJlZiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdFNuYWNrQmFyUmVmKTtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuKG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT1NuYWNrQmFyQ29uZmlnKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBpZiAoY29uZmlnLmFjdGlvbikge1xuICAgICAgICB0aGlzLmFjdGlvbiA9IGNvbmZpZy5hY3Rpb247XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLmljb24pIHtcbiAgICAgICAgdGhpcy5pY29uID0gY29uZmlnLmljb247XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLmljb25Qb3NpdGlvbikge1xuICAgICAgICB0aGlzLmljb25Qb3NpdGlvbiA9IGNvbmZpZy5pY29uUG9zaXRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQWN0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuc25hY2tCYXJSZWYuZGlzbWlzc1dpdGhBY3Rpb24oKTtcbiAgfVxuXG59XG4iXX0=