import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppMenuService } from '../../../services/app-menu.service';
export const DEFAULT_INPUTS_O_BAR_MENU_NESTED = [
    'items'
];
export class OBarMenuNestedComponent {
    constructor(injector) {
        this.injector = injector;
        this.appMenuService = this.injector.get(AppMenuService);
    }
    getValueOfAttr(menu, attr) {
        let valAttr = '';
        if (menu.hasOwnProperty(attr)) {
            valAttr = menu[attr];
        }
        return valAttr;
    }
    isMenuGroup(item) {
        return this.appMenuService.getMenuItemType(item) === 'group';
    }
}
OBarMenuNestedComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-bar-menu-nested',
                template: "<ng-container *ngFor=\"let item of items\">\n  <!--menu-group-->\n  <o-bar-menu-group *ngIf=\"isMenuGroup(item)\" [title]=\"getValueOfAttr(item, 'name')\" [attr]=\"getValueOfAttr(item,'id')\"\n    [tooltip]=\"getValueOfAttr(item, 'tooltip')\" [icon]=\"getValueOfAttr(item,'icon')\" [ngClass]=\"item.class\">\n    <o-bar-menu-nested [items]=\"item.items\"> </o-bar-menu-nested>\n  </o-bar-menu-group>\n  <!--menu-item-->\n  <o-bar-menu-item *ngIf=\"!isMenuGroup(item)\" [title]=\"getValueOfAttr(item,'name')\" [attr]=\"getValueOfAttr(item,'id')\"\n    [tooltip]=\"getValueOfAttr(item, 'tooltip') \" [icon]=\"getValueOfAttr(item, 'icon') \"\n    [route]=\"getValueOfAttr(item, 'route') \" [ngClass]=\"item.class\">\n  </o-bar-menu-item>\n</ng-container>",
                inputs: DEFAULT_INPUTS_O_BAR_MENU_NESTED,
                encapsulation: ViewEncapsulation.None
            }] }
];
OBarMenuNestedComponent.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS1uZXN0ZWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Jhci1tZW51L21lbnUtbmVzdGVkL28tYmFyLW1lbnUtbmVzdGVkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHcEUsTUFBTSxDQUFDLE1BQU0sZ0NBQWdDLEdBQUc7SUFDOUMsT0FBTztDQUNSLENBQUM7QUFRRixNQUFNLE9BQU8sdUJBQXVCO0lBS2xDLFlBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxjQUFjLENBQUMsSUFBWSxFQUFFLElBQVk7UUFDdkMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFTO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssT0FBTyxDQUFDO0lBQy9ELENBQUM7OztZQTFCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsMnZCQUFpRDtnQkFDakQsTUFBTSxFQUFFLGdDQUFnQztnQkFDeEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7YUFDdEM7OztZQWRtQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RvciwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQXBwTWVudVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9hcHAtbWVudS5zZXJ2aWNlJztcbmltcG9ydCB7IE1lbnVSb290SXRlbSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL21lbnUtcm9vdC1pdGVtLnR5cGUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19CQVJfTUVOVV9ORVNURUQgPSBbXG4gICdpdGVtcydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYmFyLW1lbnUtbmVzdGVkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYmFyLW1lbnUtbmVzdGVkLmNvbXBvbmVudC5odG1sJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0JBUl9NRU5VX05FU1RFRCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPQmFyTWVudU5lc3RlZENvbXBvbmVudCB7XG5cbiAgcHJpdmF0ZSBhcHBNZW51U2VydmljZTogQXBwTWVudVNlcnZpY2U7XG4gIHB1YmxpYyBpdGVtczogTWVudVJvb3RJdGVtW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuYXBwTWVudVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChBcHBNZW51U2VydmljZSk7XG4gIH1cblxuICBnZXRWYWx1ZU9mQXR0cihtZW51OiBvYmplY3QsIGF0dHI6IHN0cmluZykge1xuICAgIGxldCB2YWxBdHRyID0gJyc7XG4gICAgaWYgKG1lbnUuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgIHZhbEF0dHIgPSBtZW51W2F0dHJdO1xuICAgIH1cbiAgICByZXR1cm4gdmFsQXR0cjtcbiAgfVxuXG4gIGlzTWVudUdyb3VwKGl0ZW06IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFwcE1lbnVTZXJ2aWNlLmdldE1lbnVJdGVtVHlwZShpdGVtKSA9PT0gJ2dyb3VwJztcbiAgfVxufVxuIl19