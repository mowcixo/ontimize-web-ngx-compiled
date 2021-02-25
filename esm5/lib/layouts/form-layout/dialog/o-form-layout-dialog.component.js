import { Component, ComponentFactoryResolver, Inject, Injector, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
var OFormLayoutDialogComponent = (function () {
    function OFormLayoutDialogComponent(dialogRef, injector, componentFactoryResolver, data) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
        if (data.title) {
            this.title = data.title;
        }
        if (data.data) {
            this.data = data.data;
            var component = data.data.component;
            this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
            this.params = data.data.params;
            this.queryParams = data.data.queryParams;
            this.urlSegments = data.data.urlSegments;
        }
        if (data.layoutManagerComponent) {
            this.formLayoutManager = data.layoutManagerComponent;
        }
    }
    OFormLayoutDialogComponent.prototype.ngAfterViewInit = function () {
        if (this.contentDirective && this.componentFactory) {
            var viewContainerRef = this.contentDirective.viewContainerRef;
            viewContainerRef.clear();
            viewContainerRef.createComponent(this.componentFactory);
        }
    };
    OFormLayoutDialogComponent.prototype.updateNavigation = function (data, id) {
        var label = this.formLayoutManager.getLabelFromData(data);
        if (label && label.length) {
            label = ': ' + label;
        }
        this.label = label;
    };
    OFormLayoutDialogComponent.prototype.updateActiveData = function (data) {
        this.data = Object.assign(this.data, data);
    };
    OFormLayoutDialogComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    OFormLayoutDialogComponent.prototype.getRouteOfActiveItem = function () {
        var parentRoute = this.formLayoutManager.parentFormLayoutManager.getRouteOfActiveItem();
        var segments = (this.urlSegments || []);
        var route = [];
        segments.forEach(function (segment, index) {
            if (parentRoute[index] !== segment.path) {
                route.push(segment.path);
            }
        });
        return route;
    };
    OFormLayoutDialogComponent.prototype.getParams = function () {
        return this.params;
    };
    OFormLayoutDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-form-layout-dialog',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" class=\"title-container\">\n  <span fxFlex fxLayoutAlign=\"center center\" mat-dialog-title> {{ (title || 'LAYOUT_MANANGER.DIALOG_TITLE') | oTranslate }}{{ label }} </span>\n  <mat-icon (click)=\"closeDialog()\" svgIcon=\"ontimize:close\"></mat-icon>\n</div>\n\n<div mat-dialog-content class=\"form-layout-dialog-container\">\n  <ng-template o-form-layout-manager-content></ng-template>\n</div>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-form-layout-dialog]': 'true'
                    },
                    styles: [".o-form-layout-dialog-overlay{width:65%;height:90%}.o-form-layout-dialog-overlay .title-container{cursor:default;height:64px;padding:0 16px}.o-form-layout-dialog-overlay .title-container .mat-dialog-title{width:100%;padding-left:24px;text-align:center;margin:0}.o-form-layout-dialog-overlay .title-container .mat-icon{cursor:pointer}.o-form-layout-dialog-overlay .mat-dialog-container{padding:0!important;overflow:hidden}.o-form-layout-dialog-overlay .mat-dialog-container .mat-dialog-content.form-layout-dialog-container{display:block;padding-top:16px;margin:0;max-height:calc(100% - 78px);height:100%}.o-form-layout-dialog-overlay .mat-dialog-container .o-form-layout-dialog o-form-toolbar .mat-toolbar{padding:0}.o-form-layout-dialog-overlay .mat-dialog-container .o-form-layout-dialog .o-form form.inner-form{position:relative;margin-top:0}"]
                }] }
    ];
    OFormLayoutDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: Injector },
        { type: ComponentFactoryResolver },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
    ]; };
    OFormLayoutDialogComponent.propDecorators = {
        contentDirective: [{ type: ViewChild, args: [OFormLayoutManagerContentDirective, { static: false },] }]
    };
    return OFormLayoutDialogComponent;
}());
export { OFormLayoutDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9sYXlvdXRzL2Zvcm0tbGF5b3V0L2RpYWxvZy9vLWZvcm0tbGF5b3V0LWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCx3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHbEUsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFFM0c7SUFzQkUsb0NBQ1MsU0FBbUQsRUFDaEQsUUFBa0IsRUFDbEIsd0JBQWtELEVBQ25DLElBQVM7UUFIM0IsY0FBUyxHQUFULFNBQVMsQ0FBMEM7UUFDaEQsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBRzVELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUN6QjtRQUNELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUN0QixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN0QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztTQUN0RDtJQUNILENBQUM7SUFFRCxvREFBZSxHQUFmO1FBQ0UsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ2xELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDO1lBQ2hFLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3pCLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUN6RDtJQUNILENBQUM7SUFFRCxxREFBZ0IsR0FBaEIsVUFBaUIsSUFBUyxFQUFFLEVBQVU7UUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDekIsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7U0FDdEI7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQscURBQWdCLEdBQWhCLFVBQWlCLElBQVM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELGdEQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx5REFBb0IsR0FBcEI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUMxRixJQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUM7UUFDMUMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsS0FBSztZQUM5QixJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFO2dCQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsOENBQVMsR0FBVDtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOztnQkFsRkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLG1kQUFrRDtvQkFFbEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSiw4QkFBOEIsRUFBRSxNQUFNO3FCQUN2Qzs7aUJBQ0Y7OztnQkFieUIsWUFBWTtnQkFKcEMsUUFBUTtnQkFGUix3QkFBd0I7Z0RBcUNyQixNQUFNLFNBQUMsZUFBZTs7O21DQU54QixTQUFTLFNBQUMsa0NBQWtDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQWdFbEUsaUNBQUM7Q0FBQSxBQXBGRCxJQW9GQztTQTNFWSwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudEZhY3RvcnksXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRElBTE9HX0RBVEEsIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbnRlbnREaXJlY3RpdmUgfSBmcm9tICcuLi9kaXJlY3RpdmVzL28tZm9ybS1sYXlvdXQtbWFuYWdlci1jb250ZW50LmRpcmVjdGl2ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZm9ybS1sYXlvdXQtZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICdvLWZvcm0tbGF5b3V0LWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydvLWZvcm0tbGF5b3V0LWRpYWxvZy5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZvcm0tbGF5b3V0LWRpYWxvZ10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBmb3JtTGF5b3V0TWFuYWdlcjogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50O1xuICBxdWVyeVBhcmFtczogYW55O1xuICBwYXJhbXM6IG9iamVjdDtcbiAgdXJsU2VnbWVudHM6IGFueVtdO1xuICBsYWJlbDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBkYXRhOiBhbnk7XG5cbiAgcHJvdGVjdGVkIGNvbXBvbmVudEZhY3Rvcnk6IENvbXBvbmVudEZhY3Rvcnk8YW55PjtcblxuICBAVmlld0NoaWxkKE9Gb3JtTGF5b3V0TWFuYWdlckNvbnRlbnREaXJlY3RpdmUsIHsgc3RhdGljOiBmYWxzZSB9KSBjb250ZW50RGlyZWN0aXZlOiBPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudD4sXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IGFueVxuICApIHtcbiAgICBpZiAoZGF0YS50aXRsZSkge1xuICAgICAgdGhpcy50aXRsZSA9IGRhdGEudGl0bGU7XG4gICAgfVxuICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGEuZGF0YTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGRhdGEuZGF0YS5jb21wb25lbnQ7XG4gICAgICB0aGlzLmNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShjb21wb25lbnQpO1xuICAgICAgdGhpcy5wYXJhbXMgPSBkYXRhLmRhdGEucGFyYW1zO1xuICAgICAgdGhpcy5xdWVyeVBhcmFtcyA9IGRhdGEuZGF0YS5xdWVyeVBhcmFtcztcbiAgICAgIHRoaXMudXJsU2VnbWVudHMgPSBkYXRhLmRhdGEudXJsU2VnbWVudHM7XG4gICAgfVxuICAgIGlmIChkYXRhLmxheW91dE1hbmFnZXJDb21wb25lbnQpIHtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPSBkYXRhLmxheW91dE1hbmFnZXJDb21wb25lbnQ7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmNvbnRlbnREaXJlY3RpdmUgJiYgdGhpcy5jb21wb25lbnRGYWN0b3J5KSB7XG4gICAgICBjb25zdCB2aWV3Q29udGFpbmVyUmVmID0gdGhpcy5jb250ZW50RGlyZWN0aXZlLnZpZXdDb250YWluZXJSZWY7XG4gICAgICB2aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgICB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudCh0aGlzLmNvbXBvbmVudEZhY3RvcnkpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU5hdmlnYXRpb24oZGF0YTogYW55LCBpZDogc3RyaW5nKSB7XG4gICAgbGV0IGxhYmVsID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5nZXRMYWJlbEZyb21EYXRhKGRhdGEpO1xuICAgIGlmIChsYWJlbCAmJiBsYWJlbC5sZW5ndGgpIHtcbiAgICAgIGxhYmVsID0gJzogJyArIGxhYmVsO1xuICAgIH1cbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gIH1cblxuICB1cGRhdGVBY3RpdmVEYXRhKGRhdGE6IGFueSkge1xuICAgIHRoaXMuZGF0YSA9IE9iamVjdC5hc3NpZ24odGhpcy5kYXRhLCBkYXRhKTtcbiAgfVxuXG4gIGNsb3NlRGlhbG9nKCkge1xuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKCk7XG4gIH1cblxuICBnZXRSb3V0ZU9mQWN0aXZlSXRlbSgpOiBhbnlbXSB7XG4gICAgY29uc3QgcGFyZW50Um91dGUgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLnBhcmVudEZvcm1MYXlvdXRNYW5hZ2VyLmdldFJvdXRlT2ZBY3RpdmVJdGVtKCk7XG4gICAgY29uc3Qgc2VnbWVudHMgPSAodGhpcy51cmxTZWdtZW50cyB8fCBbXSk7XG4gICAgY29uc3Qgcm91dGUgPSBbXTtcbiAgICBzZWdtZW50cy5mb3JFYWNoKChzZWdtZW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHBhcmVudFJvdXRlW2luZGV4XSAhPT0gc2VnbWVudC5wYXRoKSB7XG4gICAgICAgIHJvdXRlLnB1c2goc2VnbWVudC5wYXRoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcm91dGU7XG4gIH1cblxuICBnZXRQYXJhbXMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXM7XG4gIH1cblxufVxuIl19