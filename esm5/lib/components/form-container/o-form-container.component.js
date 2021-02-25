import * as tslib_1 from "tslib";
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { OBreadcrumbComponent } from '../../components/breadcrumb/o-breadcrumb.component';
import { InputConverter } from '../../decorators/input-converter';
export var DEFAULT_INPUTS_O_FORM_CONTAINER = [
    'breadcrumb',
    'breadcrumbSeparator : breadcrumb-separator',
    'breadcrumbLabelColumns : breadcrumb-label-columns',
    'form'
];
var OFormContainerComponent = (function () {
    function OFormContainerComponent(resolver) {
        this.resolver = resolver;
        this.breadcrumb = false;
        this.breadcrumbSeparator = ' ';
    }
    OFormContainerComponent.prototype.ngAfterViewInit = function () {
        this.breadcrumb = this.breadcrumb && this.form && !this.formMananger;
        if (this.breadcrumb) {
            this.createBreadcrumb(this.breadContainer);
        }
    };
    OFormContainerComponent.prototype.setForm = function (form) {
        this.form = form;
        this.formMananger = form.getFormManager();
    };
    OFormContainerComponent.prototype.createBreadcrumb = function (container) {
        var factory = this.resolver.resolveComponentFactory(OBreadcrumbComponent);
        var ref = container.createComponent(factory);
        ref.instance.form = this.form;
        ref.instance.labelColumns = this.breadcrumbLabelColumns;
        ref.instance.separator = this.breadcrumbSeparator;
    };
    OFormContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-form-container',
                    template: "<div class=\"o-form-container-content\">\n  <ng-template #breadcrumb></ng-template>\n  <ng-content></ng-content>\n</div>",
                    inputs: DEFAULT_INPUTS_O_FORM_CONTAINER,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-form-container]': 'true',
                        '[class.breadcrumb]': 'breadcrumb'
                    },
                    styles: [".application-layout-content-wrapper .o-form-container{position:relative;width:100%;height:100%;display:block}.application-layout-content-wrapper .o-form-container .o-form-container-content{display:flex;flex:auto;flex-direction:column;max-height:100%}.application-layout-content-wrapper .o-form-container .o-form-container-content>.o-breadcrumb{padding-left:8px;padding-right:8px}"]
                }] }
    ];
    OFormContainerComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver }
    ]; };
    OFormContainerComponent.propDecorators = {
        breadContainer: [{ type: ViewChild, args: ['breadcrumb', { read: ViewContainerRef, static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormContainerComponent.prototype, "breadcrumb", void 0);
    return OFormContainerComponent;
}());
export { OFormContainerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybS1jb250YWluZXIvby1mb3JtLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLHdCQUF3QixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuSSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFJbEUsTUFBTSxDQUFDLElBQU0sK0JBQStCLEdBQUc7SUFFN0MsWUFBWTtJQUNaLDRDQUE0QztJQUM1QyxtREFBbUQ7SUFDbkQsTUFBTTtDQUNQLENBQUM7QUFFRjtJQXVCRSxpQ0FBb0IsUUFBa0M7UUFBbEMsYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFQdEQsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUVyQix3QkFBbUIsR0FBVyxHQUFHLENBQUM7SUFLaUIsQ0FBQztJQUUzRCxpREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JFLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVELHlDQUFPLEdBQVAsVUFBUSxJQUFvQjtRQUMxQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsa0RBQWdCLEdBQWhCLFVBQWlCLFNBQTJCO1FBQzFDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM1RSxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDOUIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDO1FBQ3hELEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNwRCxDQUFDOztnQkEzQ0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLG9JQUFnRDtvQkFFaEQsTUFBTSxFQUFFLCtCQUErQjtvQkFDdkMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSiwwQkFBMEIsRUFBRSxNQUFNO3dCQUNsQyxvQkFBb0IsRUFBRSxZQUFZO3FCQUNuQzs7aUJBQ0Y7OztnQkF6QmtDLHdCQUF3Qjs7O2lDQTRCeEQsU0FBUyxTQUFDLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQUdsRTtRQURDLGNBQWMsRUFBRTs7K0RBQ1c7SUE2QjlCLDhCQUFDO0NBQUEsQUE3Q0QsSUE2Q0M7U0FsQ1ksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0JyZWFkY3J1bWJDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2JyZWFkY3J1bWIvby1icmVhZGNydW1iLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk1fQ09OVEFJTkVSID0gW1xuICAvLyBicmVhZGNydW1iIFtib29sZWFuXTogc2hvdyBicmVhZHNjcnVtIG9mIHRoZSBmb3JtLiBEZWZhdWx0OiB5ZXMuXG4gICdicmVhZGNydW1iJyxcbiAgJ2JyZWFkY3J1bWJTZXBhcmF0b3IgOiBicmVhZGNydW1iLXNlcGFyYXRvcicsXG4gICdicmVhZGNydW1iTGFiZWxDb2x1bW5zIDogYnJlYWRjcnVtYi1sYWJlbC1jb2x1bW5zJyxcbiAgJ2Zvcm0nXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZm9ybS1jb250YWluZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWZvcm0tY29udGFpbmVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GT1JNX0NPTlRBSU5FUixcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1mb3JtLWNvbnRhaW5lcl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5icmVhZGNydW1iXSc6ICdicmVhZGNydW1iJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtQ29udGFpbmVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQFZpZXdDaGlsZCgnYnJlYWRjcnVtYicsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiwgc3RhdGljOiBmYWxzZSB9KSBicmVhZENvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBicmVhZGNydW1iOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBicmVhZGNydW1iTGFiZWxDb2x1bW5zOiBzdHJpbmc7XG4gIHB1YmxpYyBicmVhZGNydW1iU2VwYXJhdG9yOiBzdHJpbmcgPSAnICc7XG5cbiAgcHJvdGVjdGVkIGZvcm06IE9Gb3JtQ29tcG9uZW50O1xuICBwcm90ZWN0ZWQgZm9ybU1hbmFuZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSB7IH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5icmVhZGNydW1iID0gdGhpcy5icmVhZGNydW1iICYmIHRoaXMuZm9ybSAmJiAhdGhpcy5mb3JtTWFuYW5nZXI7XG4gICAgaWYgKHRoaXMuYnJlYWRjcnVtYikge1xuICAgICAgdGhpcy5jcmVhdGVCcmVhZGNydW1iKHRoaXMuYnJlYWRDb250YWluZXIpO1xuICAgIH1cbiAgfVxuXG4gIHNldEZvcm0oZm9ybTogT0Zvcm1Db21wb25lbnQpIHtcbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICAgIHRoaXMuZm9ybU1hbmFuZ2VyID0gZm9ybS5nZXRGb3JtTWFuYWdlcigpO1xuICB9XG5cbiAgY3JlYXRlQnJlYWRjcnVtYihjb250YWluZXI6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShPQnJlYWRjcnVtYkNvbXBvbmVudCk7XG4gICAgY29uc3QgcmVmID0gY29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcbiAgICByZWYuaW5zdGFuY2UuZm9ybSA9IHRoaXMuZm9ybTtcbiAgICByZWYuaW5zdGFuY2UubGFiZWxDb2x1bW5zID0gdGhpcy5icmVhZGNydW1iTGFiZWxDb2x1bW5zO1xuICAgIHJlZi5pbnN0YW5jZS5zZXBhcmF0b3IgPSB0aGlzLmJyZWFkY3J1bWJTZXBhcmF0b3I7XG4gIH1cblxufVxuIl19