import { Component, ContentChildren, EventEmitter, Injector, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { OComponentMenuItems } from './o-content-menu.class';
import { OContextMenuService } from './o-context-menu.service';
export var DEFAULT_OUTPUTS_O_CONTEXT_MENU = [
    'onShow',
    'onClose'
];
var OContextMenuComponent = (function () {
    function OContextMenuComponent(injector) {
        this.injector = injector;
        this.onShow = new EventEmitter();
        this.onClose = new EventEmitter();
        this.subscription = new Subscription();
        this.oContextMenuService = this.injector.get(OContextMenuService);
    }
    OContextMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription.add(this.oContextMenuService.showContextMenu.subscribe(function (param) { return _this.showContextMenu(param); }));
        this.subscription.add(this.oContextMenuService.closeContextMenu.subscribe(function (param) { return _this.onClose.emit(); }));
    };
    OContextMenuComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    OContextMenuComponent.prototype.showContextMenu = function (params) {
        this.origin = params.event.target;
        this.onShow.emit(params);
        if (params.contextMenu !== this) {
            return;
        }
        params.menuItems = this.oContextMenuItems;
        if (params.menuItems.length > 0) {
            this.oContextMenuService.openContextMenu(params);
        }
    };
    OContextMenuComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-context-menu',
                    template: ' ',
                    outputs: DEFAULT_OUTPUTS_O_CONTEXT_MENU
                }] }
    ];
    OContextMenuComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OContextMenuComponent.propDecorators = {
        oContextMenuItems: [{ type: ContentChildren, args: [OComponentMenuItems,] }]
    };
    return OContextMenuComponent;
}());
export { OContextMenuComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFxQixTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUdwQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvRCxNQUFNLENBQUMsSUFBTSw4QkFBOEIsR0FBRztJQUM1QyxRQUFRO0lBQ1IsU0FBUztDQUNWLENBQUM7QUFFRjtJQWlCRSwrQkFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBUHZCLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMvQyxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFHN0MsaUJBQVksR0FBaUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUt4RCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRU0sd0NBQVEsR0FBZjtRQUFBLGlCQUdDO1FBRkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUMsQ0FBQztRQUNoSCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUM7SUFDM0csQ0FBQztJQUVNLDJDQUFXLEdBQWxCO1FBQ0UsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRU0sK0NBQWUsR0FBdEIsVUFBdUIsTUFBNEI7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQXFCLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLElBQUksRUFBRTtZQUMvQixPQUFPO1NBQ1I7UUFDRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUMxQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQzs7Z0JBMUNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUsR0FBRztvQkFDYixPQUFPLEVBQUUsOEJBQThCO2lCQUN4Qzs7O2dCQWhCa0QsUUFBUTs7O29DQW1CeEQsZUFBZSxTQUFDLG1CQUFtQjs7SUFxQ3RDLDRCQUFDO0NBQUEsQUE1Q0QsSUE0Q0M7U0F2Q1kscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0LCBRdWVyeUxpc3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJT0NvbnRleHRNZW51Q29udGV4dCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1jb250ZXh0LW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9Db21wb25lbnRNZW51SXRlbXMgfSBmcm9tICcuL28tY29udGVudC1tZW51LmNsYXNzJztcbmltcG9ydCB7IE9Db250ZXh0TWVudVNlcnZpY2UgfSBmcm9tICcuL28tY29udGV4dC1tZW51LnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQ09OVEVYVF9NRU5VID0gW1xuICAnb25TaG93JyxcbiAgJ29uQ2xvc2UnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWNvbnRleHQtbWVudScsXG4gIHRlbXBsYXRlOiAnICcsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0NPTlRFWFRfTUVOVVxufSlcbmV4cG9ydCBjbGFzcyBPQ29udGV4dE1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihPQ29tcG9uZW50TWVudUl0ZW1zKVxuICBwdWJsaWMgb0NvbnRleHRNZW51SXRlbXM6IFF1ZXJ5TGlzdDxPQ29tcG9uZW50TWVudUl0ZW1zPjtcblxuICBwdWJsaWMgb3JpZ2luOiBIVE1MRWxlbWVudDtcbiAgcHVibGljIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwdWJsaWMgb0NvbnRleHRNZW51U2VydmljZTogT0NvbnRleHRNZW51U2VydmljZTtcbiAgcHJvdGVjdGVkIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5vQ29udGV4dE1lbnVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT0NvbnRleHRNZW51U2VydmljZSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMub0NvbnRleHRNZW51U2VydmljZS5zaG93Q29udGV4dE1lbnUuc3Vic2NyaWJlKHBhcmFtID0+IHRoaXMuc2hvd0NvbnRleHRNZW51KHBhcmFtKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZCh0aGlzLm9Db250ZXh0TWVudVNlcnZpY2UuY2xvc2VDb250ZXh0TWVudS5zdWJzY3JpYmUocGFyYW0gPT4gdGhpcy5vbkNsb3NlLmVtaXQoKSkpO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwdWJsaWMgc2hvd0NvbnRleHRNZW51KHBhcmFtczogSU9Db250ZXh0TWVudUNvbnRleHQpOiB2b2lkIHtcbiAgICB0aGlzLm9yaWdpbiA9IHBhcmFtcy5ldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgdGhpcy5vblNob3cuZW1pdChwYXJhbXMpO1xuICAgIGlmIChwYXJhbXMuY29udGV4dE1lbnUgIT09IHRoaXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGFyYW1zLm1lbnVJdGVtcyA9IHRoaXMub0NvbnRleHRNZW51SXRlbXM7XG4gICAgaWYgKHBhcmFtcy5tZW51SXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5vQ29udGV4dE1lbnVTZXJ2aWNlLm9wZW5Db250ZXh0TWVudShwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=