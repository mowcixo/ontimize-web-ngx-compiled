import { Component, ElementRef, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { DEFAULT_INPUTS_O_BASE_MENU_ITEM, OBaseMenuItemClass } from '../o-base-menu-item.class';
export const DEFAULT_INPUTS_O_BAR_MENU_GROUP = [
    ...DEFAULT_INPUTS_O_BASE_MENU_ITEM
];
export class OBarMenuGroupComponent extends OBaseMenuItemClass {
    constructor(menu, elRef, injector) {
        super(menu, elRef, injector);
        this.menu = menu;
        this.elRef = elRef;
        this.injector = injector;
        this.id = 'm_' + String((new Date()).getTime() + Math.random());
    }
}
OBarMenuGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-bar-menu-group',
                template: "<div class=\"fake-li\" [class.fake-li-hover]=\"isHovered\">\n  <label [attr.for]=\"id\" class=\"toggle mat-list-item\">\n    <mat-icon class=\"o-bar-menu-group-icon mat-24\">{{ icon }}</mat-icon>\n    {{ title | oTranslate }}\n    <mat-icon class=\"o-bar-menu-group-icon-arrow\" *ngIf=\"!checkbox.checked\">chevron_right</mat-icon>\n    <mat-icon class=\"o-bar-menu-group-icon-arrow\" *ngIf=\"checkbox.checked\">expand_more</mat-icon>\n  </label>\n  <a class=\"o-bar-menu-group-title\">\n    <mat-icon class=\"o-bar-menu-group-icon mat-24\">{{ icon }}</mat-icon> {{ title | oTranslate }}\n    <mat-icon class=\"o-bar-menu-group-icon-arrow\">chevron_right</mat-icon>\n  </a>\n  <input [attr.id]=\"id\" type=\"checkbox\" #checkbox />\n  <div *ngIf=\"!disabled\" class=\"fake-ul mat-primary mat-elevation-z4\">\n    <ng-content></ng-content>\n  </div>\n</div>",
                inputs: DEFAULT_INPUTS_O_BAR_MENU_GROUP,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-bar-menu-group]': 'true',
                    '[attr.disabled]': 'disabled'
                },
                styles: [".o-bar-menu-group[disabled=true] .fake-li{opacity:.5}.o-bar-menu-group[disabled=true] .fake-li a.o-bar-menu-group-title{cursor:default}.o-bar-menu-group .fake-li .o-bar-menu-group-icon,.o-bar-menu-group .fake-ul .o-bar-menu-group-icon{display:inline-block;margin:0 10px 0 0}.o-bar-menu-group .fake-li .o-bar-menu-group-icon~.o-bar-menu-group-title,.o-bar-menu-group .fake-ul .o-bar-menu-group-icon~.o-bar-menu-group-title{padding-left:0}.o-bar-menu-group .fake-li .o-bar-menu-group-icon-arrow,.o-bar-menu-group .fake-ul .o-bar-menu-group-icon-arrow{margin-left:auto}"]
            }] }
];
OBarMenuGroupComponent.ctorParameters = () => [
    { type: OBarMenuComponent, decorators: [{ type: Inject, args: [forwardRef(() => OBarMenuComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS1ncm91cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvbWVudS1ncm91cC9vLWJhci1tZW51LWdyb3VwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsK0JBQStCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVoRyxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRztJQUM3QyxHQUFHLCtCQUErQjtDQUNuQyxDQUFDO0FBYUYsTUFBTSxPQUFPLHNCQUF1QixTQUFRLGtCQUFrQjtJQUk1RCxZQUN5RCxJQUF1QixFQUNwRSxLQUFpQixFQUNqQixRQUFrQjtRQUU1QixLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUowQixTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUNwRSxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFHNUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7OztZQXRCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsbzJCQUFnRDtnQkFFaEQsTUFBTSxFQUFFLCtCQUErQjtnQkFDdkMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSiwwQkFBMEIsRUFBRSxNQUFNO29CQUNsQyxpQkFBaUIsRUFBRSxVQUFVO2lCQUM5Qjs7YUFDRjs7O1lBakJRLGlCQUFpQix1QkF1QnJCLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUF6QjNCLFVBQVU7WUFBc0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0Jhck1lbnVDb21wb25lbnQgfSBmcm9tICcuLi9vLWJhci1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0JBU0VfTUVOVV9JVEVNLCBPQmFzZU1lbnVJdGVtQ2xhc3MgfSBmcm9tICcuLi9vLWJhc2UtbWVudS1pdGVtLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQkFSX01FTlVfR1JPVVAgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQkFTRV9NRU5VX0lURU1cbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYmFyLW1lbnUtZ3JvdXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1iYXItbWVudS1ncm91cC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYmFyLW1lbnUtZ3JvdXAuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0JBUl9NRU5VX0dST1VQLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWJhci1tZW51LWdyb3VwXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuZGlzYWJsZWRdJzogJ2Rpc2FibGVkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9CYXJNZW51R3JvdXBDb21wb25lbnQgZXh0ZW5kcyBPQmFzZU1lbnVJdGVtQ2xhc3Mge1xuXG4gIGlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9CYXJNZW51Q29tcG9uZW50KSkgcHJvdGVjdGVkIG1lbnU6IE9CYXJNZW51Q29tcG9uZW50LFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKG1lbnUsIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5pZCA9ICdtXycgKyBTdHJpbmcoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSArIE1hdGgucmFuZG9tKCkpO1xuICB9XG59XG4iXX0=