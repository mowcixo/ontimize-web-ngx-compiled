import { Component, ComponentFactoryResolver, Inject, Injector, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
export class OFormLayoutDialogComponent {
    constructor(dialogRef, injector, componentFactoryResolver, data) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
        if (data.title) {
            this.title = data.title;
        }
        if (data.data) {
            this.data = data.data;
            const component = data.data.component;
            this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
            this.params = data.data.params;
            this.queryParams = data.data.queryParams;
            this.urlSegments = data.data.urlSegments;
        }
        if (data.layoutManagerComponent) {
            this.formLayoutManager = data.layoutManagerComponent;
        }
    }
    ngAfterViewInit() {
        if (this.contentDirective && this.componentFactory) {
            const viewContainerRef = this.contentDirective.viewContainerRef;
            viewContainerRef.clear();
            viewContainerRef.createComponent(this.componentFactory);
        }
    }
    updateNavigation(data, id) {
        let label = this.formLayoutManager.getLabelFromData(data);
        if (label && label.length) {
            label = ': ' + label;
        }
        this.label = label;
    }
    updateActiveData(data) {
        this.data = Object.assign(this.data, data);
    }
    closeDialog() {
        this.dialogRef.close();
    }
    getRouteOfActiveItem() {
        const parentRoute = this.formLayoutManager.parentFormLayoutManager.getRouteOfActiveItem();
        const segments = (this.urlSegments || []);
        const route = [];
        segments.forEach((segment, index) => {
            if (parentRoute[index] !== segment.path) {
                route.push(segment.path);
            }
        });
        return route;
    }
    getParams() {
        return this.params;
    }
}
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
OFormLayoutDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
OFormLayoutDialogComponent.propDecorators = {
    contentDirective: [{ type: ViewChild, args: [OFormLayoutManagerContentDirective, { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9sYXlvdXRzL2Zvcm0tbGF5b3V0L2RpYWxvZy9vLWZvcm0tbGF5b3V0LWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCx3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHbEUsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLE1BQU0sdURBQXVELENBQUM7QUFXM0csTUFBTSxPQUFPLDBCQUEwQjtJQWFyQyxZQUNTLFNBQW1ELEVBQ2hELFFBQWtCLEVBQ2xCLHdCQUFrRCxFQUNuQyxJQUFTO1FBSDNCLGNBQVMsR0FBVCxTQUFTLENBQTBDO1FBQ2hELGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUc1RCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDekI7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN6RixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMxQztRQUNELElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7U0FDdEQ7SUFDSCxDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUNsRCxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNoRSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QixnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBUyxFQUFFLEVBQVU7UUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDekIsS0FBSyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7U0FDdEI7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBUztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUMxRixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDdkMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUI7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQzs7O1lBbEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxtZEFBa0Q7Z0JBRWxELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osOEJBQThCLEVBQUUsTUFBTTtpQkFDdkM7O2FBQ0Y7OztZQWJ5QixZQUFZO1lBSnBDLFFBQVE7WUFGUix3QkFBd0I7NENBcUNyQixNQUFNLFNBQUMsZUFBZTs7OytCQU54QixTQUFTLFNBQUMsa0NBQWtDLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9vLWZvcm0tbGF5b3V0LW1hbmFnZXItY29udGVudC5kaXJlY3RpdmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tbGF5b3V0LWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnby1mb3JtLWxheW91dC1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnby1mb3JtLWxheW91dC1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1mb3JtLWxheW91dC1kaWFsb2ddJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgZm9ybUxheW91dE1hbmFnZXI6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudDtcbiAgcXVlcnlQYXJhbXM6IGFueTtcbiAgcGFyYW1zOiBvYmplY3Q7XG4gIHVybFNlZ21lbnRzOiBhbnlbXTtcbiAgbGFiZWw6IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgZGF0YTogYW55O1xuXG4gIHByb3RlY3RlZCBjb21wb25lbnRGYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT47XG5cbiAgQFZpZXdDaGlsZChPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlLCB7IHN0YXRpYzogZmFsc2UgfSkgY29udGVudERpcmVjdGl2ZTogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29udGVudERpcmVjdGl2ZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQ+LFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBhbnlcbiAgKSB7XG4gICAgaWYgKGRhdGEudGl0bGUpIHtcbiAgICAgIHRoaXMudGl0bGUgPSBkYXRhLnRpdGxlO1xuICAgIH1cbiAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhLmRhdGE7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBkYXRhLmRhdGEuY29tcG9uZW50O1xuICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICAgIHRoaXMucGFyYW1zID0gZGF0YS5kYXRhLnBhcmFtcztcbiAgICAgIHRoaXMucXVlcnlQYXJhbXMgPSBkYXRhLmRhdGEucXVlcnlQYXJhbXM7XG4gICAgICB0aGlzLnVybFNlZ21lbnRzID0gZGF0YS5kYXRhLnVybFNlZ21lbnRzO1xuICAgIH1cbiAgICBpZiAoZGF0YS5sYXlvdXRNYW5hZ2VyQ29tcG9uZW50KSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyID0gZGF0YS5sYXlvdXRNYW5hZ2VyQ29tcG9uZW50O1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5jb250ZW50RGlyZWN0aXZlICYmIHRoaXMuY29tcG9uZW50RmFjdG9yeSkge1xuICAgICAgY29uc3Qgdmlld0NvbnRhaW5lclJlZiA9IHRoaXMuY29udGVudERpcmVjdGl2ZS52aWV3Q29udGFpbmVyUmVmO1xuICAgICAgdmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xuICAgICAgdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQodGhpcy5jb21wb25lbnRGYWN0b3J5KTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVOYXZpZ2F0aW9uKGRhdGE6IGFueSwgaWQ6IHN0cmluZykge1xuICAgIGxldCBsYWJlbCA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0TGFiZWxGcm9tRGF0YShkYXRhKTtcbiAgICBpZiAobGFiZWwgJiYgbGFiZWwubGVuZ3RoKSB7XG4gICAgICBsYWJlbCA9ICc6ICcgKyBsYWJlbDtcbiAgICB9XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICB9XG5cbiAgdXBkYXRlQWN0aXZlRGF0YShkYXRhOiBhbnkpIHtcbiAgICB0aGlzLmRhdGEgPSBPYmplY3QuYXNzaWduKHRoaXMuZGF0YSwgZGF0YSk7XG4gIH1cblxuICBjbG9zZURpYWxvZygpIHtcbiAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSgpO1xuICB9XG5cbiAgZ2V0Um91dGVPZkFjdGl2ZUl0ZW0oKTogYW55W10ge1xuICAgIGNvbnN0IHBhcmVudFJvdXRlID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5wYXJlbnRGb3JtTGF5b3V0TWFuYWdlci5nZXRSb3V0ZU9mQWN0aXZlSXRlbSgpO1xuICAgIGNvbnN0IHNlZ21lbnRzID0gKHRoaXMudXJsU2VnbWVudHMgfHwgW10pO1xuICAgIGNvbnN0IHJvdXRlID0gW107XG4gICAgc2VnbWVudHMuZm9yRWFjaCgoc2VnbWVudCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChwYXJlbnRSb3V0ZVtpbmRleF0gIT09IHNlZ21lbnQucGF0aCkge1xuICAgICAgICByb3V0ZS5wdXNoKHNlZ21lbnQucGF0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgZ2V0UGFyYW1zKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zO1xuICB9XG5cbn1cbiJdfQ==