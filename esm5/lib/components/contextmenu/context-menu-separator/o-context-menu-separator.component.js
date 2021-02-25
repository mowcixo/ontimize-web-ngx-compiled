import * as tslib_1 from "tslib";
import { Component, forwardRef } from '@angular/core';
import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuItems } from '../o-content-menu.class';
export var DEFAULT_CONTEXT_MENU_ITEM_INPUTS = tslib_1.__spread(DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS);
var OContextMenuSeparatorComponent = (function (_super) {
    tslib_1.__extends(OContextMenuSeparatorComponent, _super);
    function OContextMenuSeparatorComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = OComponentMenuItems.TYPE_SEPARATOR_MENU;
        return _this;
    }
    OContextMenuSeparatorComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    OContextMenuSeparatorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-context-menu-separator',
                    template: ' ',
                    inputs: DEFAULT_CONTEXT_MENU_ITEM_INPUTS,
                    providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(function () { return OContextMenuSeparatorComponent; }) }]
                }] }
    ];
    return OContextMenuSeparatorComponent;
}(OContextMenuItemComponent));
export { OContextMenuSeparatorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUtc2VwYXJhdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9jb250ZXh0bWVudS9jb250ZXh0LW1lbnUtc2VwYXJhdG9yL28tY29udGV4dC1tZW51LXNlcGFyYXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRW5HLE1BQU0sQ0FBQyxJQUFNLGdDQUFnQyxvQkFDeEMsbUNBQW1DLENBQ3ZDLENBQUM7QUFFRjtJQU1vRCwwREFBeUI7SUFON0U7UUFBQSxxRUFjQztRQU5RLFVBQUksR0FBRyxtQkFBbUIsQ0FBQyxtQkFBbUIsQ0FBQzs7SUFNeEQsQ0FBQztJQUpRLGlEQUFRLEdBQWY7UUFDRSxpQkFBTSxRQUFRLFdBQUUsQ0FBQztJQUNuQixDQUFDOztnQkFaRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsTUFBTSxFQUFFLGdDQUFnQztvQkFDeEMsU0FBUyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsOEJBQThCLEVBQTlCLENBQThCLENBQUMsRUFBRSxDQUFDO2lCQUM3Rzs7SUFTRCxxQ0FBQztDQUFBLEFBZEQsQ0FNb0QseUJBQXlCLEdBUTVFO1NBUlksOEJBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbnRleHQtbWVudS1pdGVtL28tY29udGV4dC1tZW51LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQ09OVEVYVF9NRU5VX0lURU1TLCBPQ29tcG9uZW50TWVudUl0ZW1zIH0gZnJvbSAnLi4vby1jb250ZW50LW1lbnUuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT05URVhUX01FTlVfSVRFTV9JTlBVVFMgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ09OVEVYVF9NRU5VX0lURU1TXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWNvbnRleHQtbWVudS1zZXBhcmF0b3InLFxuICB0ZW1wbGF0ZTogJyAnLFxuICBpbnB1dHM6IERFRkFVTFRfQ09OVEVYVF9NRU5VX0lURU1fSU5QVVRTLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE9Db21wb25lbnRNZW51SXRlbXMsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9Db250ZXh0TWVudVNlcGFyYXRvckNvbXBvbmVudCkgfV1cbn0pXG5leHBvcnQgY2xhc3MgT0NvbnRleHRNZW51U2VwYXJhdG9yQ29tcG9uZW50IGV4dGVuZHMgT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHVibGljIHR5cGUgPSBPQ29tcG9uZW50TWVudUl0ZW1zLlRZUEVfU0VQQVJBVE9SX01FTlU7XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG4gIH1cblxufVxuIl19