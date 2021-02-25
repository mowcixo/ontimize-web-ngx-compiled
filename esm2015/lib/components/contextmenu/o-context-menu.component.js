import { Component, ContentChildren, EventEmitter, Injector, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { OComponentMenuItems } from './o-content-menu.class';
import { OContextMenuService } from './o-context-menu.service';
export const DEFAULT_OUTPUTS_O_CONTEXT_MENU = [
    'onShow',
    'onClose'
];
export class OContextMenuComponent {
    constructor(injector) {
        this.injector = injector;
        this.onShow = new EventEmitter();
        this.onClose = new EventEmitter();
        this.subscription = new Subscription();
        this.oContextMenuService = this.injector.get(OContextMenuService);
    }
    ngOnInit() {
        this.subscription.add(this.oContextMenuService.showContextMenu.subscribe(param => this.showContextMenu(param)));
        this.subscription.add(this.oContextMenuService.closeContextMenu.subscribe(param => this.onClose.emit()));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    showContextMenu(params) {
        this.origin = params.event.target;
        this.onShow.emit(params);
        if (params.contextMenu !== this) {
            return;
        }
        params.menuItems = this.oContextMenuItems;
        if (params.menuItems.length > 0) {
            this.oContextMenuService.openContextMenu(params);
        }
    }
}
OContextMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-context-menu',
                template: ' ',
                outputs: DEFAULT_OUTPUTS_O_CONTEXT_MENU
            }] }
];
OContextMenuComponent.ctorParameters = () => [
    { type: Injector }
];
OContextMenuComponent.propDecorators = {
    oContextMenuItems: [{ type: ContentChildren, args: [OComponentMenuItems,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFxQixTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUdwQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUM3RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvRCxNQUFNLENBQUMsTUFBTSw4QkFBOEIsR0FBRztJQUM1QyxRQUFRO0lBQ1IsU0FBUztDQUNWLENBQUM7QUFPRixNQUFNLE9BQU8scUJBQXFCO0lBWWhDLFlBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVB2QixXQUFNLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDL0MsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzdDLGlCQUFZLEdBQWlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFLeEQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hILElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRyxDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxlQUFlLENBQUMsTUFBNEI7UUFDakQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQXFCLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsSUFBSSxNQUFNLENBQUMsV0FBVyxLQUFLLElBQUksRUFBRTtZQUMvQixPQUFPO1NBQ1I7UUFDRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUMxQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQzs7O1lBMUNGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsR0FBRztnQkFDYixPQUFPLEVBQUUsOEJBQThCO2FBQ3hDOzs7WUFoQmtELFFBQVE7OztnQ0FtQnhELGVBQWUsU0FBQyxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIENvbnRlbnRDaGlsZHJlbiwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQsIFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElPQ29udGV4dE1lbnVDb250ZXh0IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLWNvbnRleHQtbWVudS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT0NvbXBvbmVudE1lbnVJdGVtcyB9IGZyb20gJy4vby1jb250ZW50LW1lbnUuY2xhc3MnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4vby1jb250ZXh0LW1lbnUuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19DT05URVhUX01FTlUgPSBbXG4gICdvblNob3cnLFxuICAnb25DbG9zZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY29udGV4dC1tZW51JyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fQ09OVEVYVF9NRU5VXG59KVxuZXhwb3J0IGNsYXNzIE9Db250ZXh0TWVudUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcblxuICBAQ29udGVudENoaWxkcmVuKE9Db21wb25lbnRNZW51SXRlbXMpXG4gIHB1YmxpYyBvQ29udGV4dE1lbnVJdGVtczogUXVlcnlMaXN0PE9Db21wb25lbnRNZW51SXRlbXM+O1xuXG4gIHB1YmxpYyBvcmlnaW46IEhUTUxFbGVtZW50O1xuICBwdWJsaWMgb25TaG93OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uQ2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHB1YmxpYyBvQ29udGV4dE1lbnVTZXJ2aWNlOiBPQ29udGV4dE1lbnVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLm9Db250ZXh0TWVudVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPQ29udGV4dE1lbnVTZXJ2aWNlKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQodGhpcy5vQ29udGV4dE1lbnVTZXJ2aWNlLnNob3dDb250ZXh0TWVudS5zdWJzY3JpYmUocGFyYW0gPT4gdGhpcy5zaG93Q29udGV4dE1lbnUocGFyYW0pKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMub0NvbnRleHRNZW51U2VydmljZS5jbG9zZUNvbnRleHRNZW51LnN1YnNjcmliZShwYXJhbSA9PiB0aGlzLm9uQ2xvc2UuZW1pdCgpKSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93Q29udGV4dE1lbnUocGFyYW1zOiBJT0NvbnRleHRNZW51Q29udGV4dCk6IHZvaWQge1xuICAgIHRoaXMub3JpZ2luID0gcGFyYW1zLmV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICB0aGlzLm9uU2hvdy5lbWl0KHBhcmFtcyk7XG4gICAgaWYgKHBhcmFtcy5jb250ZXh0TWVudSAhPT0gdGhpcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwYXJhbXMubWVudUl0ZW1zID0gdGhpcy5vQ29udGV4dE1lbnVJdGVtcztcbiAgICBpZiAocGFyYW1zLm1lbnVJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLm9Db250ZXh0TWVudVNlcnZpY2Uub3BlbkNvbnRleHRNZW51KHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==