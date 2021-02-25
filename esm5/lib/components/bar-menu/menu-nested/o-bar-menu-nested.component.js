import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppMenuService } from '../../../services/app-menu.service';
export var DEFAULT_INPUTS_O_BAR_MENU_NESTED = [
    'items'
];
var OBarMenuNestedComponent = (function () {
    function OBarMenuNestedComponent(injector) {
        this.injector = injector;
        this.appMenuService = this.injector.get(AppMenuService);
    }
    OBarMenuNestedComponent.prototype.getValueOfAttr = function (menu, attr) {
        var valAttr = '';
        if (menu.hasOwnProperty(attr)) {
            valAttr = menu[attr];
        }
        return valAttr;
    };
    OBarMenuNestedComponent.prototype.isMenuGroup = function (item) {
        return this.appMenuService.getMenuItemType(item) === 'group';
    };
    OBarMenuNestedComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-bar-menu-nested',
                    template: "<ng-container *ngFor=\"let item of items\">\n  <!--menu-group-->\n  <o-bar-menu-group *ngIf=\"isMenuGroup(item)\" [title]=\"getValueOfAttr(item, 'name')\" [attr]=\"getValueOfAttr(item,'id')\"\n    [tooltip]=\"getValueOfAttr(item, 'tooltip')\" [icon]=\"getValueOfAttr(item,'icon')\" [ngClass]=\"item.class\">\n    <o-bar-menu-nested [items]=\"item.items\"> </o-bar-menu-nested>\n  </o-bar-menu-group>\n  <!--menu-item-->\n  <o-bar-menu-item *ngIf=\"!isMenuGroup(item)\" [title]=\"getValueOfAttr(item,'name')\" [attr]=\"getValueOfAttr(item,'id')\"\n    [tooltip]=\"getValueOfAttr(item, 'tooltip') \" [icon]=\"getValueOfAttr(item, 'icon') \"\n    [route]=\"getValueOfAttr(item, 'route') \" [ngClass]=\"item.class\">\n  </o-bar-menu-item>\n</ng-container>",
                    inputs: DEFAULT_INPUTS_O_BAR_MENU_NESTED,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    OBarMenuNestedComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OBarMenuNestedComponent;
}());
export { OBarMenuNestedComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS1uZXN0ZWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Jhci1tZW51L21lbnUtbmVzdGVkL28tYmFyLW1lbnUtbmVzdGVkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV2RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFHcEUsTUFBTSxDQUFDLElBQU0sZ0NBQWdDLEdBQUc7SUFDOUMsT0FBTztDQUNSLENBQUM7QUFFRjtJQVdFLGlDQUNZLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsZ0RBQWMsR0FBZCxVQUFlLElBQVksRUFBRSxJQUFZO1FBQ3ZDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDN0IsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCw2Q0FBVyxHQUFYLFVBQVksSUFBUztRQUNuQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLE9BQU8sQ0FBQztJQUMvRCxDQUFDOztnQkExQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLDJ2QkFBaUQ7b0JBQ2pELE1BQU0sRUFBRSxnQ0FBZ0M7b0JBQ3hDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs7O2dCQWRtQixRQUFROztJQW9DNUIsOEJBQUM7Q0FBQSxBQTNCRCxJQTJCQztTQXJCWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEluamVjdG9yLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBcHBNZW51U2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2FwcC1tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVudVJvb3RJdGVtIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvbWVudS1yb290LWl0ZW0udHlwZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JBUl9NRU5VX05FU1RFRCA9IFtcbiAgJ2l0ZW1zJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1iYXItbWVudS1uZXN0ZWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1iYXItbWVudS1uZXN0ZWQuY29tcG9uZW50Lmh0bWwnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQkFSX01FTlVfTkVTVEVELFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE9CYXJNZW51TmVzdGVkQ29tcG9uZW50IHtcblxuICBwcml2YXRlIGFwcE1lbnVTZXJ2aWNlOiBBcHBNZW51U2VydmljZTtcbiAgcHVibGljIGl0ZW1zOiBNZW51Um9vdEl0ZW1bXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5hcHBNZW51U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcE1lbnVTZXJ2aWNlKTtcbiAgfVxuXG4gIGdldFZhbHVlT2ZBdHRyKG1lbnU6IG9iamVjdCwgYXR0cjogc3RyaW5nKSB7XG4gICAgbGV0IHZhbEF0dHIgPSAnJztcbiAgICBpZiAobWVudS5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgdmFsQXR0ciA9IG1lbnVbYXR0cl07XG4gICAgfVxuICAgIHJldHVybiB2YWxBdHRyO1xuICB9XG5cbiAgaXNNZW51R3JvdXAoaXRlbTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYXBwTWVudVNlcnZpY2UuZ2V0TWVudUl0ZW1UeXBlKGl0ZW0pID09PSAnZ3JvdXAnO1xuICB9XG59XG4iXX0=