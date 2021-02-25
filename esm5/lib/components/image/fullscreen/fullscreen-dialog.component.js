import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Util } from '../../../util/util';
var OFullScreenDialogComponent = (function () {
    function OFullScreenDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
        if (Util.isDefined(data)) {
            this.imageSrc = data;
        }
    }
    OFullScreenDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-fullscreen-dialog',
                    template: "<mat-toolbar color=\"primary\" class=\"mat-elevation-z5\">\n  <span fxFlex></span>\n  <button type=\"button\" mat-icon-button mat-dialog-close>\n    <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n  </button>\n</mat-toolbar>\n<mat-dialog-content fxLayoutAlign=\"center center\" class=\"o-fullscreen-dialog-content\">\n  <img [src]=\"imageSrc\" />\n</mat-dialog-content>\n",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-fullscreen-dialog]': 'true'
                    },
                    styles: [".o-image-fullscreen-dialog-cdk-overlay .mat-dialog-container{padding:0}.o-image-fullscreen-dialog-cdk-overlay .mat-dialog-container .o-fullscreen-dialog{height:100%;display:block}.o-image-fullscreen-dialog-cdk-overlay .mat-dialog-container .o-fullscreen-dialog .mat-dialog-content.o-fullscreen-dialog-content{margin:12px;height:100%;max-height:calc(100% - 64px - 24px)}"]
                }] }
    ];
    OFullScreenDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
    ]; };
    return OFullScreenDialogComponent;
}());
export { OFullScreenDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsbHNjcmVlbi1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2ltYWdlL2Z1bGxzY3JlZW4vZnVsbHNjcmVlbi1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTFDO0lBYUUsb0NBQ1MsU0FBbUQsRUFDMUIsSUFBUztRQURsQyxjQUFTLEdBQVQsU0FBUyxDQUEwQztRQUMxQixTQUFJLEdBQUosSUFBSSxDQUFLO1FBRXpDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUN0QjtJQUNILENBQUM7O2dCQXBCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsaVlBQWlEO29CQUVqRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLDZCQUE2QixFQUFFLE1BQU07cUJBQ3RDOztpQkFDRjs7O2dCQVp5QixZQUFZO2dEQW1CakMsTUFBTSxTQUFDLGVBQWU7O0lBTzNCLGlDQUFDO0NBQUEsQUF0QkQsSUFzQkM7U0FiWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSwgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1mdWxsc2NyZWVuLWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnLi9mdWxsc2NyZWVuLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2Z1bGxzY3JlZW4tZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZnVsbHNjcmVlbi1kaWFsb2ddJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Z1bGxTY3JlZW5EaWFsb2dDb21wb25lbnQge1xuXG4gIGltYWdlU3JjOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50PixcbiAgICBASW5qZWN0KE1BVF9ESUFMT0dfREFUQSkgcHVibGljIGRhdGE6IGFueVxuICApIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZGF0YSkpIHtcbiAgICAgIHRoaXMuaW1hZ2VTcmMgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=