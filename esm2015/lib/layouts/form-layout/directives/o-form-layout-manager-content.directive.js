import { Directive, Input, ViewContainerRef } from '@angular/core';
export class OFormLayoutManagerContentDirective {
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}
OFormLayoutManagerContentDirective.decorators = [
    { type: Directive, args: [{
                selector: '[o-form-layout-manager-content]',
            },] }
];
OFormLayoutManagerContentDirective.ctorParameters = () => [
    { type: ViewContainerRef }
];
OFormLayoutManagerContentDirective.propDecorators = {
    index: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1tYW5hZ2VyLWNvbnRlbnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9sYXlvdXRzL2Zvcm0tbGF5b3V0L2RpcmVjdGl2ZXMvby1mb3JtLWxheW91dC1tYW5hZ2VyLWNvbnRlbnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBS25FLE1BQU0sT0FBTyxrQ0FBa0M7SUFJN0MsWUFBbUIsZ0JBQWtDO1FBQWxDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7SUFBSSxDQUFDOzs7WUFQM0QsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQ0FBaUM7YUFDNUM7OztZQUowQixnQkFBZ0I7OztvQkFPeEMsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW28tZm9ybS1sYXlvdXQtbWFuYWdlci1jb250ZW50XScsXG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtTGF5b3V0TWFuYWdlckNvbnRlbnREaXJlY3RpdmUge1xuXG4gIEBJbnB1dCgpIGluZGV4OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHsgfVxufVxuIl19