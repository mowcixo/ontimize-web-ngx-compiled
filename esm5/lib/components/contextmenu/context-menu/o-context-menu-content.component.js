import { Component, ContentChildren, EventEmitter, HostListener, Injector, QueryList, ViewChild, } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { OComponentMenuItems } from '../o-content-menu.class';
import { OWrapperContentMenuComponent } from './o-wrapper-content-menu/o-wrapper-content-menu.component';
export var DEFAULT_CONTEXT_MENU_CONTENT_INPUTS = [
    'menuItems',
    'overlay',
    'data',
    'menuClass'
];
export var DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS = [
    'execute',
    'close'
];
var OContextMenuContentComponent = (function () {
    function OContextMenuContentComponent(injector) {
        this.injector = injector;
        this.menuItems = [];
        this.execute = new EventEmitter();
        this.close = new EventEmitter();
    }
    OContextMenuContentComponent.prototype.click = function () {
        this.closeContent();
    };
    OContextMenuContentComponent.prototype.ngOnInit = function () {
        this.initialize();
    };
    OContextMenuContentComponent.prototype.ngAfterViewInit = function () {
        this.trigger.openMenu();
    };
    OContextMenuContentComponent.prototype.initialize = function () {
        this.setData(this.menuItems);
    };
    OContextMenuContentComponent.prototype.setData = function (items) {
        var _this = this;
        items.forEach(function (menuItem) {
            if (_this.data) {
                menuItem.data = _this.data;
                if (menuItem.children && menuItem.children.length > 0) {
                    _this.setData(menuItem.children);
                }
            }
        });
    };
    OContextMenuContentComponent.prototype.onMenuClosed = function (e) {
        this.closeContent();
    };
    OContextMenuContentComponent.prototype.closeContent = function () {
        this.trigger.closeMenu();
        this.close.emit();
    };
    OContextMenuContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-context-menu-content',
                    template: "<button mat-button [matMenuTriggerFor]=\"menu.childMenu\" (menuClosed)=\"onMenuClosed($event)\"></button>\n<o-wrapper-content-menu #menu [items]=\"menuItems\" [class]=\"menuClass\"> </o-wrapper-content-menu>",
                    inputs: DEFAULT_CONTEXT_MENU_CONTENT_INPUTS,
                    outputs: DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS,
                    host: {
                        '[class.o-context-menu-content]': 'true'
                    }
                }] }
    ];
    OContextMenuContentComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OContextMenuContentComponent.propDecorators = {
        oContextMenuItems: [{ type: ContentChildren, args: [OComponentMenuItems,] }],
        trigger: [{ type: ViewChild, args: [MatMenuTrigger, { static: false },] }],
        menu: [{ type: ViewChild, args: [OWrapperContentMenuComponent, { static: false },] }],
        click: [{ type: HostListener, args: ['document:click',] }]
    };
    return OContextMenuContentComponent;
}());
export { OContextMenuContentComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUtY29udGVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dC1tZW51L28tY29udGV4dC1tZW51LWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixZQUFZLEVBQ1osUUFBUSxFQUVSLFNBQVMsRUFDVCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR25ELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBRXpHLE1BQU0sQ0FBQyxJQUFNLG1DQUFtQyxHQUFHO0lBQ2pELFdBQVc7SUFDWCxTQUFTO0lBQ1QsTUFBTTtJQUNOLFdBQVc7Q0FDWixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sb0NBQW9DLEdBQUc7SUFDbEQsU0FBUztJQUNULE9BQU87Q0FDUixDQUFDO0FBRUY7SUF5QkUsc0NBQ1ksUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWZ2QixjQUFTLEdBQVUsRUFBRSxDQUFDO1FBSXRCLFlBQU8sR0FBbUYsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM3RyxVQUFLLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUFXakQsQ0FBQztJQUdFLDRDQUFLLEdBRFo7UUFFRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLCtDQUFRLEdBQWY7UUFDRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVNLHNEQUFlLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRU0saURBQVUsR0FBakI7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU0sOENBQU8sR0FBZCxVQUFlLEtBQUs7UUFBcEIsaUJBU0M7UUFSQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTtZQUNwQixJQUFJLEtBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMxQixJQUFJLFFBQVEsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNyRCxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDakM7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLG1EQUFZLEdBQW5CLFVBQW9CLENBQVE7UUFDMUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxtREFBWSxHQUFuQjtRQUNFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNwQixDQUFDOztnQkFoRUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLDJOQUFvRDtvQkFDcEQsTUFBTSxFQUFFLG1DQUFtQztvQkFDM0MsT0FBTyxFQUFFLG9DQUFvQztvQkFDN0MsSUFBSSxFQUFFO3dCQUNKLGdDQUFnQyxFQUFFLE1BQU07cUJBQ3pDO2lCQUNGOzs7Z0JBL0JDLFFBQVE7OztvQ0F5Q1AsZUFBZSxTQUFDLG1CQUFtQjswQkFFbkMsU0FBUyxTQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7dUJBRTNDLFNBQVMsU0FBQyw0QkFBNEIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7d0JBT3pELFlBQVksU0FBQyxnQkFBZ0I7O0lBcUNoQyxtQ0FBQztDQUFBLEFBbEVELElBa0VDO1NBekRZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXlSZWYgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdE1lbnVUcmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBPQ29udGV4dE1lbnVJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi4vY29udGV4dC1tZW51LWl0ZW0vby1jb250ZXh0LW1lbnUtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbXBvbmVudE1lbnVJdGVtcyB9IGZyb20gJy4uL28tY29udGVudC1tZW51LmNsYXNzJztcbmltcG9ydCB7IE9XcmFwcGVyQ29udGVudE1lbnVDb21wb25lbnQgfSBmcm9tICcuL28td3JhcHBlci1jb250ZW50LW1lbnUvby13cmFwcGVyLWNvbnRlbnQtbWVudS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT05URVhUX01FTlVfQ09OVEVOVF9JTlBVVFMgPSBbXG4gICdtZW51SXRlbXMnLFxuICAnb3ZlcmxheScsXG4gICdkYXRhJyxcbiAgJ21lbnVDbGFzcydcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTlRFWFRfTUVOVV9DT05URU5UX09VVFBVVFMgPSBbXG4gICdleGVjdXRlJyxcbiAgJ2Nsb3NlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jb250ZXh0LW1lbnUtY29udGVudCcsXG4gIHRlbXBsYXRlVXJsOiAnby1jb250ZXh0LW1lbnUtY29udGVudC5jb21wb25lbnQuaHRtbCcsXG4gIGlucHV0czogREVGQVVMVF9DT05URVhUX01FTlVfQ09OVEVOVF9JTlBVVFMsXG4gIG91dHB1dHM6IERFRkFVTFRfQ09OVEVYVF9NRU5VX0NPTlRFTlRfT1VUUFVUUyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jb250ZXh0LW1lbnUtY29udGVudF0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQ29udGV4dE1lbnVDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcblxuICBwdWJsaWMgbWVudUl0ZW1zOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgb3ZlcmxheTogT3ZlcmxheVJlZjtcbiAgcHVibGljIGRhdGE6IGFueTtcbiAgcHVibGljIG1lbnVDbGFzczogc3RyaW5nO1xuICBwdWJsaWMgZXhlY3V0ZTogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IEV2ZW50LCBkYXRhOiBhbnksIG1lbnVJdGVtOiBPQ29udGV4dE1lbnVJdGVtQ29tcG9uZW50IH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgY2xvc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oT0NvbXBvbmVudE1lbnVJdGVtcylcbiAgcHVibGljIG9Db250ZXh0TWVudUl0ZW1zOiBRdWVyeUxpc3Q8T0NvbXBvbmVudE1lbnVJdGVtcz47XG4gIEBWaWV3Q2hpbGQoTWF0TWVudVRyaWdnZXIsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgdHJpZ2dlcjogTWF0TWVudVRyaWdnZXI7XG4gIEBWaWV3Q2hpbGQoT1dyYXBwZXJDb250ZW50TWVudUNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBtZW51OiBPV3JhcHBlckNvbnRlbnRNZW51Q29tcG9uZW50O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7IH1cblxuICBASG9zdExpc3RlbmVyKCdkb2N1bWVudDpjbGljaycpXG4gIHB1YmxpYyBjbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlQ29udGVudCgpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIub3Blbk1lbnUoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RGF0YSh0aGlzLm1lbnVJdGVtcyk7XG4gIH1cblxuICBwdWJsaWMgc2V0RGF0YShpdGVtcyk6IHZvaWQge1xuICAgIGl0ZW1zLmZvckVhY2gobWVudUl0ZW0gPT4ge1xuICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICBtZW51SXRlbS5kYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICBpZiAobWVudUl0ZW0uY2hpbGRyZW4gJiYgbWVudUl0ZW0uY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YShtZW51SXRlbS5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbk1lbnVDbG9zZWQoZTogRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNsb3NlQ29udGVudCgpO1xuICB9XG5cbiAgcHVibGljIGNsb3NlQ29udGVudCgpOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIuY2xvc2VNZW51KCk7XG4gICAgdGhpcy5jbG9zZS5lbWl0KCk7XG4gIH1cblxufVxuIl19