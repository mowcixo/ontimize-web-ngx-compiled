import { Component, Injector, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { OComponentMenuItems } from '../../o-content-menu.class';
export var DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS = [
    'items',
    'class'
];
var OWrapperContentMenuComponent = (function () {
    function OWrapperContentMenuComponent(injector) {
        this.injector = injector;
    }
    OWrapperContentMenuComponent.prototype.onClick = function (item, event) {
        item.triggerExecute(item.data, event);
    };
    OWrapperContentMenuComponent.prototype.isGroup = function (item) {
        var isGroup = false;
        if (item && item.children && item.children.length > 0) {
            isGroup = true;
        }
        return isGroup;
    };
    OWrapperContentMenuComponent.prototype.isSepararor = function (item) {
        var isSepararor = false;
        if (item && item.type && item.type === OComponentMenuItems.TYPE_SEPARATOR_MENU) {
            isSepararor = true;
        }
        return isSepararor;
    };
    OWrapperContentMenuComponent.prototype.isItem = function (item) {
        var isItem = false;
        if (item && item.type && item.type === OComponentMenuItems.TYPE_ITEM_MENU) {
            isItem = true;
        }
        return isItem;
    };
    OWrapperContentMenuComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-wrapper-content-menu',
                    template: "<mat-menu #childMenu=\"matMenu\" [class]=\"class\" [overlapTrigger]=\"false\" [hasBackdrop]=\"false\">\n  <ng-container *ngFor=\"let child of items\">\n    <!-- Handle branch node menu items -->\n    <span *ngIf=\"isGroup(child) && child.isVisible\">\n      <button mat-menu-item color=\"primary\" [matMenuTriggerFor]=\"menu.childMenu\" [disabled]=\"child.disabled\">\n        <mat-icon *ngIf=\"child.svgIcon !== undefined\" [svgIcon]=\"child.svgIcon\"></mat-icon>\n        <mat-icon *ngIf=\"child.svgIcon === undefined\">{{ child.icon }}</mat-icon>\n        <span>{{ child.label | oTranslate}}</span>\n      </button>\n      <o-wrapper-content-menu #menu [items]=\"child.children\" [class]=\"class\"></o-wrapper-content-menu>\n    </span>\n    <!-- Handle leaf node menu items -->\n    <button mat-menu-item (click)=\"onClick(child, $event)\" [disabled]=\"child.disabled\" *ngIf=\"isItem(child) && child.isVisible\">\n      <mat-icon *ngIf=\"child.svgIcon !== undefined\" [svgIcon]=\"child.svgIcon\"></mat-icon>\n      <mat-icon *ngIf=\"child.svgIcon === undefined\">{{ child.icon }}</mat-icon>\n      <span>{{ child.label | oTranslate}} </span>\n    </button>\n    <!-- separator leaf node menu items -->\n    <mat-divider *ngIf=\"isSepararor(child) && child.isVisible\"></mat-divider>\n  </ng-container>\n</mat-menu>\n",
                    inputs: DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS,
                    styles: ["mat-divider.mat-divider:first-child,mat-divider.mat-divider:last-child{display:none}.mat-icon{display:inline-flex}"]
                }] }
    ];
    OWrapperContentMenuComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OWrapperContentMenuComponent.propDecorators = {
        items: [{ type: Input }],
        childMenu: [{ type: ViewChild, args: ['childMenu', { static: true },] }],
        menu: [{ type: ViewChild, args: [OWrapperContentMenuComponent, { static: true },] }]
    };
    return OWrapperContentMenuComponent;
}());
export { OWrapperContentMenuComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dC1tZW51L28td3JhcHBlci1jb250ZW50LW1lbnUvby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFakQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFakUsTUFBTSxDQUFDLElBQU0sd0NBQXdDLEdBQUc7SUFDdEQsT0FBTztJQUNQLE9BQU87Q0FDUixDQUFDO0FBRUY7SUFtQkUsc0NBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUMxQixDQUFDO0lBRUUsOENBQU8sR0FBZCxVQUFlLElBQUksRUFBRSxLQUFNO1FBQ3pCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sOENBQU8sR0FBZCxVQUFlLElBQUk7UUFDakIsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JELE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDaEI7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRU0sa0RBQVcsR0FBbEIsVUFBbUIsSUFBSTtRQUNyQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLG1CQUFtQixFQUFFO1lBQzlFLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDcEI7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU0sNkNBQU0sR0FBYixVQUFjLElBQUk7UUFDaEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUU7WUFDekUsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNmO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7Z0JBakRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxxekNBQW9EO29CQUVwRCxNQUFNLEVBQUUsd0NBQXdDOztpQkFDakQ7OztnQkFmbUIsUUFBUTs7O3dCQW9CekIsS0FBSzs0QkFHTCxTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt1QkFHdkMsU0FBUyxTQUFDLDRCQUE0QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFtQzNELG1DQUFDO0NBQUEsQUFuREQsSUFtREM7U0E3Q1ksNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RvciwgSW5wdXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0TWVudSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuXG5pbXBvcnQgeyBPQ29tcG9uZW50TWVudUl0ZW1zIH0gZnJvbSAnLi4vLi4vby1jb250ZW50LW1lbnUuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT05URVhUX01FTlVfQ09OVEVOVF9JVEVNX0lOUFVUUyA9IFtcbiAgJ2l0ZW1zJyxcbiAgJ2NsYXNzJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby13cmFwcGVyLWNvbnRlbnQtbWVudScsXG4gIHRlbXBsYXRlVXJsOiAnby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28td3JhcHBlci1jb250ZW50LW1lbnUuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0NPTlRFWFRfTUVOVV9DT05URU5UX0lURU1fSU5QVVRTXG59KVxuZXhwb3J0IGNsYXNzIE9XcmFwcGVyQ29udGVudE1lbnVDb21wb25lbnQge1xuXG4gIHB1YmxpYyBjbGFzczogc3RyaW5nO1xuXG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBpdGVtczogYW55W107XG5cbiAgQFZpZXdDaGlsZCgnY2hpbGRNZW51JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHVibGljIGNoaWxkTWVudTogTWF0TWVudTtcblxuICBAVmlld0NoaWxkKE9XcmFwcGVyQ29udGVudE1lbnVDb21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHB1YmxpYyBtZW51OiBPV3JhcHBlckNvbnRlbnRNZW51Q29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7IH1cblxuICBwdWJsaWMgb25DbGljayhpdGVtLCBldmVudD8pOiB2b2lkIHtcbiAgICBpdGVtLnRyaWdnZXJFeGVjdXRlKGl0ZW0uZGF0YSwgZXZlbnQpO1xuICB9XG5cbiAgcHVibGljIGlzR3JvdXAoaXRlbSk6IGJvb2xlYW4ge1xuICAgIGxldCBpc0dyb3VwID0gZmFsc2U7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGlzR3JvdXAgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNHcm91cDtcbiAgfVxuXG4gIHB1YmxpYyBpc1NlcGFyYXJvcihpdGVtKTogYm9vbGVhbiB7XG4gICAgbGV0IGlzU2VwYXJhcm9yID0gZmFsc2U7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS50eXBlICYmIGl0ZW0udHlwZSA9PT0gT0NvbXBvbmVudE1lbnVJdGVtcy5UWVBFX1NFUEFSQVRPUl9NRU5VKSB7XG4gICAgICBpc1NlcGFyYXJvciA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc1NlcGFyYXJvcjtcbiAgfVxuXG4gIHB1YmxpYyBpc0l0ZW0oaXRlbSk6IGJvb2xlYW4ge1xuICAgIGxldCBpc0l0ZW0gPSBmYWxzZTtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLnR5cGUgJiYgaXRlbS50eXBlID09PSBPQ29tcG9uZW50TWVudUl0ZW1zLlRZUEVfSVRFTV9NRU5VKSB7XG4gICAgICBpc0l0ZW0gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNJdGVtO1xuICB9XG5cbn1cbiJdfQ==