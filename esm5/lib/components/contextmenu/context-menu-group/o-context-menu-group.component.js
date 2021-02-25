import * as tslib_1 from "tslib";
import { Component, ContentChildren, forwardRef, QueryList } from '@angular/core';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM, OContextMenuItemComponent, } from '../context-menu-item/o-context-menu-item.component';
import { OComponentMenuItems } from '../o-content-menu.class';
export var DEFAULT_CONTEXT_MENU_GROUP_INPUTS = tslib_1.__spread(DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM, [
    'children'
]);
var OContextMenuGroupComponent = (function (_super) {
    tslib_1.__extends(OContextMenuGroupComponent, _super);
    function OContextMenuGroupComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = OComponentMenuItems.TYPE_GROUP_MENU;
        _this.children = [];
        return _this;
    }
    OContextMenuGroupComponent.prototype.ngAfterContentInit = function () {
        this.children = this.oContextMenuItems.toArray().slice(1, this.oContextMenuItems.toArray().length);
    };
    OContextMenuGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-context-menu-group',
                    template: ' ',
                    inputs: DEFAULT_CONTEXT_MENU_GROUP_INPUTS,
                    providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(function () { return OContextMenuGroupComponent; }) }]
                }] }
    ];
    OContextMenuGroupComponent.propDecorators = {
        oContextMenuItems: [{ type: ContentChildren, args: [OComponentMenuItems,] }]
    };
    return OContextMenuGroupComponent;
}(OContextMenuItemComponent));
export { OContextMenuGroupComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUtZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRleHRtZW51L2NvbnRleHQtbWVudS1ncm91cC9vLWNvbnRleHQtbWVudS1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBb0IsU0FBUyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQVUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTVHLE9BQU8sRUFDTCxrQ0FBa0MsRUFDbEMseUJBQXlCLEdBQzFCLE1BQU0sb0RBQW9ELENBQUM7QUFDNUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFOUQsTUFBTSxDQUFDLElBQU0saUNBQWlDLG9CQUN6QyxrQ0FBa0M7SUFDckMsVUFBVTtFQUNYLENBQUM7QUFFRjtJQU1nRCxzREFBeUI7SUFOekU7UUFBQSxxRUFpQkM7UUFUUSxVQUFJLEdBQUcsbUJBQW1CLENBQUMsZUFBZSxDQUFDO1FBQzNDLGNBQVEsR0FBRyxFQUFFLENBQUM7O0lBUXZCLENBQUM7SUFKUSx1REFBa0IsR0FBekI7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRyxDQUFDOztnQkFmRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsTUFBTSxFQUFFLGlDQUFpQztvQkFDekMsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsMEJBQTBCLEVBQTFCLENBQTBCLENBQUMsRUFBRSxDQUFDO2lCQUN6Rzs7O29DQU1FLGVBQWUsU0FBQyxtQkFBbUI7O0lBTXRDLGlDQUFDO0NBQUEsQUFqQkQsQ0FNZ0QseUJBQXlCLEdBV3hFO1NBWFksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIGZvcndhcmRSZWYsIE9uSW5pdCwgUXVlcnlMaXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fQ09OVEVYVF9NRU5VX0lURU0sXG4gIE9Db250ZXh0TWVudUl0ZW1Db21wb25lbnQsXG59IGZyb20gJy4uL2NvbnRleHQtbWVudS1pdGVtL28tY29udGV4dC1tZW51LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Db21wb25lbnRNZW51SXRlbXMgfSBmcm9tICcuLi9vLWNvbnRlbnQtbWVudS5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTlRFWFRfTUVOVV9HUk9VUF9JTlBVVFMgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ09OVEVYVF9NRU5VX0lURU0sXG4gICdjaGlsZHJlbidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY29udGV4dC1tZW51LWdyb3VwJyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgaW5wdXRzOiBERUZBVUxUX0NPTlRFWFRfTUVOVV9HUk9VUF9JTlBVVFMsXG4gIHByb3ZpZGVyczogW3sgcHJvdmlkZTogT0NvbXBvbmVudE1lbnVJdGVtcywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gT0NvbnRleHRNZW51R3JvdXBDb21wb25lbnQpIH1dXG59KVxuZXhwb3J0IGNsYXNzIE9Db250ZXh0TWVudUdyb3VwQ29tcG9uZW50IGV4dGVuZHMgT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCB7XG5cbiAgcHVibGljIHR5cGUgPSBPQ29tcG9uZW50TWVudUl0ZW1zLlRZUEVfR1JPVVBfTUVOVTtcbiAgcHVibGljIGNoaWxkcmVuID0gW107XG5cbiAgQENvbnRlbnRDaGlsZHJlbihPQ29tcG9uZW50TWVudUl0ZW1zKSBwdWJsaWMgb0NvbnRleHRNZW51SXRlbXM6IFF1ZXJ5TGlzdDxPQ29tcG9uZW50TWVudUl0ZW1zPjtcblxuICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLm9Db250ZXh0TWVudUl0ZW1zLnRvQXJyYXkoKS5zbGljZSgxLCB0aGlzLm9Db250ZXh0TWVudUl0ZW1zLnRvQXJyYXkoKS5sZW5ndGgpO1xuICB9XG5cbn1cbiJdfQ==