import * as tslib_1 from "tslib";
import { Component, EventEmitter, forwardRef } from '@angular/core';
import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuItems } from '../o-content-menu.class';
export var DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS = [
    'execute'
];
export var DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM = tslib_1.__spread(DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, [
    'icon',
    'data',
    'label',
    'oenabled: enabled',
    'svgIcon: svg-icon'
]);
var OContextMenuItemComponent = (function (_super) {
    tslib_1.__extends(OContextMenuItemComponent, _super);
    function OContextMenuItemComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.execute = new EventEmitter();
        _this.type = OComponentMenuItems.TYPE_ITEM_MENU;
        _this.enabled = true;
        return _this;
    }
    OContextMenuItemComponent.prototype.ngOnInit = function () {
        this.enabled = this.parseInput(this.oenabled, true);
    };
    OContextMenuItemComponent.prototype.onClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.triggerExecute(this.data, event);
    };
    OContextMenuItemComponent.prototype.triggerExecute = function (data, $event) {
        if (!this.enabled) {
            return;
        }
        this.execute.emit({ event: $event, data: data });
    };
    Object.defineProperty(OContextMenuItemComponent.prototype, "disabled", {
        get: function () {
            if (this.enabled instanceof Function) {
                return !this.enabled(this.data);
            }
            return !this.enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OContextMenuItemComponent.prototype, "isVisible", {
        get: function () {
            if (this.ovisible instanceof Function) {
                return this.ovisible(this.data);
            }
            return this.ovisible;
        },
        enumerable: true,
        configurable: true
    });
    OContextMenuItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-context-menu-item',
                    template: ' ',
                    inputs: DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM,
                    outputs: DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS,
                    providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(function () { return OContextMenuItemComponent; }) }]
                }] }
    ];
    return OContextMenuItemComponent;
}(OComponentMenuItems));
export { OContextMenuItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUtaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dC1tZW51LWl0ZW0vby1jb250ZXh0LW1lbnUtaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUU1RSxPQUFPLEVBQUUsbUNBQW1DLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVuRyxNQUFNLENBQUMsSUFBTSxpQ0FBaUMsR0FBRztJQUMvQyxTQUFTO0NBQ1YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLGtDQUFrQyxvQkFDMUMsbUNBQW1DO0lBQ3RDLE1BQU07SUFDTixNQUFNO0lBQ04sT0FBTztJQUNQLG1CQUFtQjtJQUNuQixtQkFBbUI7RUFBQyxDQUFDO0FBRXZCO0lBTytDLHFEQUFtQjtJQVBsRTtRQUFBLHFFQWlEQztRQXhDUSxhQUFPLEdBQThDLElBQUksWUFBWSxFQUFFLENBQUM7UUFDeEUsVUFBSSxHQUFHLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztRQUkxQyxhQUFPLEdBQXVDLElBQUksQ0FBQzs7SUFtQzVELENBQUM7SUEvQlEsNENBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFTSwyQ0FBTyxHQUFkLFVBQWUsS0FBaUI7UUFDOUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVNLGtEQUFjLEdBQXJCLFVBQXNCLElBQVMsRUFBRSxNQUFjO1FBQzdDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsc0JBQVcsK0NBQVE7YUFBbkI7WUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLFlBQVksUUFBUSxFQUFFO2dCQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakM7WUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN2QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLGdEQUFTO2FBQXBCO1lBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxZQUFZLFFBQVEsRUFBRTtnQkFDckMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztZQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDOzs7T0FBQTs7Z0JBL0NGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUscUJBQXFCO29CQUMvQixRQUFRLEVBQUUsR0FBRztvQkFDYixNQUFNLEVBQUUsa0NBQWtDO29CQUMxQyxPQUFPLEVBQUUsaUNBQWlDO29CQUMxQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSx5QkFBeUIsRUFBekIsQ0FBeUIsQ0FBQyxFQUFFLENBQUM7aUJBQ3hHOztJQTJDRCxnQ0FBQztDQUFBLEFBakRELENBTytDLG1CQUFtQixHQTBDakU7U0ExQ1kseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0NPTlRFWFRfTUVOVV9JVEVNUywgT0NvbXBvbmVudE1lbnVJdGVtcyB9IGZyb20gJy4uL28tY29udGVudC1tZW51LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09OVEVYVF9NRU5VX0lURU1fT1VUUFVUUyA9IFtcbiAgJ2V4ZWN1dGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19DT05URVhUX01FTlVfSVRFTSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19DT05URVhUX01FTlVfSVRFTVMsXG4gICdpY29uJyxcbiAgJ2RhdGEnLFxuICAnbGFiZWwnLFxuICAnb2VuYWJsZWQ6IGVuYWJsZWQnLFxuICAnc3ZnSWNvbjogc3ZnLWljb24nXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jb250ZXh0LW1lbnUtaXRlbScsXG4gIHRlbXBsYXRlOiAnICcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19DT05URVhUX01FTlVfSVRFTSxcbiAgb3V0cHV0czogREVGQVVMVF9DT05URVhUX01FTlVfSVRFTV9PVVRQVVRTLFxuICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IE9Db21wb25lbnRNZW51SXRlbXMsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9Db250ZXh0TWVudUl0ZW1Db21wb25lbnQpIH1dXG59KVxuZXhwb3J0IGNsYXNzIE9Db250ZXh0TWVudUl0ZW1Db21wb25lbnQgZXh0ZW5kcyBPQ29tcG9uZW50TWVudUl0ZW1zIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwdWJsaWMgZXhlY3V0ZTogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IEV2ZW50LCBkYXRhOiBhbnkgfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyB0eXBlID0gT0NvbXBvbmVudE1lbnVJdGVtcy5UWVBFX0lURU1fTUVOVTtcbiAgcHVibGljIGljb246IHN0cmluZztcbiAgcHVibGljIGRhdGE6IGFueTtcbiAgcHVibGljIGxhYmVsOiBzdHJpbmc7XG4gIHB1YmxpYyBlbmFibGVkOiBib29sZWFuIHwgKChpdGVtOiBhbnkpID0+IGJvb2xlYW4pID0gdHJ1ZTtcbiAgcHVibGljIHN2Z0ljb246IHN0cmluZztcbiAgcHJvdGVjdGVkIG9lbmFibGVkO1xuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0aGlzLnBhcnNlSW5wdXQodGhpcy5vZW5hYmxlZCwgdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy50cmlnZ2VyRXhlY3V0ZSh0aGlzLmRhdGEsIGV2ZW50KTtcbiAgfVxuXG4gIHB1YmxpYyB0cmlnZ2VyRXhlY3V0ZShkYXRhOiBhbnksICRldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5leGVjdXRlLmVtaXQoeyBldmVudDogJGV2ZW50LCBkYXRhOiBkYXRhIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5lbmFibGVkIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiAhdGhpcy5lbmFibGVkKHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiAhdGhpcy5lbmFibGVkO1xuICB9XG5cbiAgcHVibGljIGdldCBpc1Zpc2libGUoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMub3Zpc2libGUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMub3Zpc2libGUodGhpcy5kYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3Zpc2libGU7XG4gIH1cblxufVxuIl19