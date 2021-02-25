import { Component, Injector, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { OComponentMenuItems } from '../../o-content-menu.class';
export const DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS = [
    'items',
    'class'
];
export class OWrapperContentMenuComponent {
    constructor(injector) {
        this.injector = injector;
    }
    onClick(item, event) {
        item.triggerExecute(item.data, event);
    }
    isGroup(item) {
        let isGroup = false;
        if (item && item.children && item.children.length > 0) {
            isGroup = true;
        }
        return isGroup;
    }
    isSepararor(item) {
        let isSepararor = false;
        if (item && item.type && item.type === OComponentMenuItems.TYPE_SEPARATOR_MENU) {
            isSepararor = true;
        }
        return isSepararor;
    }
    isItem(item) {
        let isItem = false;
        if (item && item.type && item.type === OComponentMenuItems.TYPE_ITEM_MENU) {
            isItem = true;
        }
        return isItem;
    }
}
OWrapperContentMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-wrapper-content-menu',
                template: "<mat-menu #childMenu=\"matMenu\" [class]=\"class\" [overlapTrigger]=\"false\" [hasBackdrop]=\"false\">\n  <ng-container *ngFor=\"let child of items\">\n    <!-- Handle branch node menu items -->\n    <span *ngIf=\"isGroup(child) && child.isVisible\">\n      <button mat-menu-item color=\"primary\" [matMenuTriggerFor]=\"menu.childMenu\" [disabled]=\"child.disabled\">\n        <mat-icon *ngIf=\"child.svgIcon !== undefined\" [svgIcon]=\"child.svgIcon\"></mat-icon>\n        <mat-icon *ngIf=\"child.svgIcon === undefined\">{{ child.icon }}</mat-icon>\n        <span>{{ child.label | oTranslate}}</span>\n      </button>\n      <o-wrapper-content-menu #menu [items]=\"child.children\" [class]=\"class\"></o-wrapper-content-menu>\n    </span>\n    <!-- Handle leaf node menu items -->\n    <button mat-menu-item (click)=\"onClick(child, $event)\" [disabled]=\"child.disabled\" *ngIf=\"isItem(child) && child.isVisible\">\n      <mat-icon *ngIf=\"child.svgIcon !== undefined\" [svgIcon]=\"child.svgIcon\"></mat-icon>\n      <mat-icon *ngIf=\"child.svgIcon === undefined\">{{ child.icon }}</mat-icon>\n      <span>{{ child.label | oTranslate}} </span>\n    </button>\n    <!-- separator leaf node menu items -->\n    <mat-divider *ngIf=\"isSepararor(child) && child.isVisible\"></mat-divider>\n  </ng-container>\n</mat-menu>\n",
                inputs: DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS,
                styles: ["mat-divider.mat-divider:first-child,mat-divider.mat-divider:last-child{display:none}.mat-icon{display:inline-flex}"]
            }] }
];
OWrapperContentMenuComponent.ctorParameters = () => [
    { type: Injector }
];
OWrapperContentMenuComponent.propDecorators = {
    items: [{ type: Input }],
    childMenu: [{ type: ViewChild, args: ['childMenu', { static: true },] }],
    menu: [{ type: ViewChild, args: [OWrapperContentMenuComponent, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dC1tZW51L28td3JhcHBlci1jb250ZW50LW1lbnUvby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFakQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFakUsTUFBTSxDQUFDLE1BQU0sd0NBQXdDLEdBQUc7SUFDdEQsT0FBTztJQUNQLE9BQU87Q0FDUixDQUFDO0FBUUYsTUFBTSxPQUFPLDRCQUE0QjtJQWF2QyxZQUNZLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7SUFDMUIsQ0FBQztJQUVFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBTTtRQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLE9BQU8sQ0FBQyxJQUFJO1FBQ2pCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyRCxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVNLFdBQVcsQ0FBQyxJQUFJO1FBQ3JCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssbUJBQW1CLENBQUMsbUJBQW1CLEVBQUU7WUFDOUUsV0FBVyxHQUFHLElBQUksQ0FBQztTQUNwQjtRQUNELE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBSTtRQUNoQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLG1CQUFtQixDQUFDLGNBQWMsRUFBRTtZQUN6RSxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzs7WUFqREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLHF6Q0FBb0Q7Z0JBRXBELE1BQU0sRUFBRSx3Q0FBd0M7O2FBQ2pEOzs7WUFmbUIsUUFBUTs7O29CQW9CekIsS0FBSzt3QkFHTCxTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTttQkFHdkMsU0FBUyxTQUFDLDRCQUE0QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0b3IsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdE1lbnUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcblxuaW1wb3J0IHsgT0NvbXBvbmVudE1lbnVJdGVtcyB9IGZyb20gJy4uLy4uL28tY29udGVudC1tZW51LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09OVEVYVF9NRU5VX0NPTlRFTlRfSVRFTV9JTlBVVFMgPSBbXG4gICdpdGVtcycsXG4gICdjbGFzcydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28td3JhcHBlci1jb250ZW50LW1lbnUnLFxuICB0ZW1wbGF0ZVVybDogJ28td3JhcHBlci1jb250ZW50LW1lbnUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXdyYXBwZXItY29udGVudC1tZW51LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9DT05URVhUX01FTlVfQ09OVEVOVF9JVEVNX0lOUFVUU1xufSlcbmV4cG9ydCBjbGFzcyBPV3JhcHBlckNvbnRlbnRNZW51Q29tcG9uZW50IHtcblxuICBwdWJsaWMgY2xhc3M6IHN0cmluZztcblxuICBASW5wdXQoKVxuICBwdWJsaWMgaXRlbXM6IGFueVtdO1xuXG4gIEBWaWV3Q2hpbGQoJ2NoaWxkTWVudScsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHB1YmxpYyBjaGlsZE1lbnU6IE1hdE1lbnU7XG5cbiAgQFZpZXdDaGlsZChPV3JhcHBlckNvbnRlbnRNZW51Q29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwdWJsaWMgbWVudTogT1dyYXBwZXJDb250ZW50TWVudUNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkgeyB9XG5cbiAgcHVibGljIG9uQ2xpY2soaXRlbSwgZXZlbnQ/KTogdm9pZCB7XG4gICAgaXRlbS50cmlnZ2VyRXhlY3V0ZShpdGVtLmRhdGEsIGV2ZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBpc0dyb3VwKGl0ZW0pOiBib29sZWFuIHtcbiAgICBsZXQgaXNHcm91cCA9IGZhbHNlO1xuICAgIGlmIChpdGVtICYmIGl0ZW0uY2hpbGRyZW4gJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICBpc0dyb3VwID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzR3JvdXA7XG4gIH1cblxuICBwdWJsaWMgaXNTZXBhcmFyb3IoaXRlbSk6IGJvb2xlYW4ge1xuICAgIGxldCBpc1NlcGFyYXJvciA9IGZhbHNlO1xuICAgIGlmIChpdGVtICYmIGl0ZW0udHlwZSAmJiBpdGVtLnR5cGUgPT09IE9Db21wb25lbnRNZW51SXRlbXMuVFlQRV9TRVBBUkFUT1JfTUVOVSkge1xuICAgICAgaXNTZXBhcmFyb3IgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNTZXBhcmFyb3I7XG4gIH1cblxuICBwdWJsaWMgaXNJdGVtKGl0ZW0pOiBib29sZWFuIHtcbiAgICBsZXQgaXNJdGVtID0gZmFsc2U7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS50eXBlICYmIGl0ZW0udHlwZSA9PT0gT0NvbXBvbmVudE1lbnVJdGVtcy5UWVBFX0lURU1fTUVOVSkge1xuICAgICAgaXNJdGVtID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGlzSXRlbTtcbiAgfVxuXG59XG4iXX0=