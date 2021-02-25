import { Component, ContentChildren, EventEmitter, HostListener, Injector, QueryList, ViewChild, } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { OComponentMenuItems } from '../o-content-menu.class';
import { OWrapperContentMenuComponent } from './o-wrapper-content-menu/o-wrapper-content-menu.component';
export const DEFAULT_CONTEXT_MENU_CONTENT_INPUTS = [
    'menuItems',
    'overlay',
    'data',
    'menuClass'
];
export const DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS = [
    'execute',
    'close'
];
export class OContextMenuContentComponent {
    constructor(injector) {
        this.injector = injector;
        this.menuItems = [];
        this.execute = new EventEmitter();
        this.close = new EventEmitter();
    }
    click() {
        this.closeContent();
    }
    ngOnInit() {
        this.initialize();
    }
    ngAfterViewInit() {
        this.trigger.openMenu();
    }
    initialize() {
        this.setData(this.menuItems);
    }
    setData(items) {
        items.forEach(menuItem => {
            if (this.data) {
                menuItem.data = this.data;
                if (menuItem.children && menuItem.children.length > 0) {
                    this.setData(menuItem.children);
                }
            }
        });
    }
    onMenuClosed(e) {
        this.closeContent();
    }
    closeContent() {
        this.trigger.closeMenu();
        this.close.emit();
    }
}
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
OContextMenuContentComponent.ctorParameters = () => [
    { type: Injector }
];
OContextMenuContentComponent.propDecorators = {
    oContextMenuItems: [{ type: ContentChildren, args: [OComponentMenuItems,] }],
    trigger: [{ type: ViewChild, args: [MatMenuTrigger, { static: false },] }],
    menu: [{ type: ViewChild, args: [OWrapperContentMenuComponent, { static: false },] }],
    click: [{ type: HostListener, args: ['document:click',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUtY29udGVudC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dC1tZW51L28tY29udGV4dC1tZW51LWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsZUFBZSxFQUNmLFlBQVksRUFDWixZQUFZLEVBQ1osUUFBUSxFQUVSLFNBQVMsRUFDVCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR25ELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLDJEQUEyRCxDQUFDO0FBRXpHLE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFHO0lBQ2pELFdBQVc7SUFDWCxTQUFTO0lBQ1QsTUFBTTtJQUNOLFdBQVc7Q0FDWixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sb0NBQW9DLEdBQUc7SUFDbEQsU0FBUztJQUNULE9BQU87Q0FDUixDQUFDO0FBV0YsTUFBTSxPQUFPLDRCQUE0QjtJQWdCdkMsWUFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBZnZCLGNBQVMsR0FBVSxFQUFFLENBQUM7UUFJdEIsWUFBTyxHQUFtRixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzdHLFVBQUssR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQVdqRCxDQUFDO0lBR0UsS0FBSztRQUNWLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sUUFBUTtRQUNiLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sZUFBZTtRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTSxVQUFVO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVNLE9BQU8sQ0FBQyxLQUFLO1FBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNiLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDMUIsSUFBSSxRQUFRLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ2pDO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxZQUFZLENBQUMsQ0FBUTtRQUMxQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLFlBQVk7UUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BCLENBQUM7OztZQWhFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsMk5BQW9EO2dCQUNwRCxNQUFNLEVBQUUsbUNBQW1DO2dCQUMzQyxPQUFPLEVBQUUsb0NBQW9DO2dCQUM3QyxJQUFJLEVBQUU7b0JBQ0osZ0NBQWdDLEVBQUUsTUFBTTtpQkFDekM7YUFDRjs7O1lBL0JDLFFBQVE7OztnQ0F5Q1AsZUFBZSxTQUFDLG1CQUFtQjtzQkFFbkMsU0FBUyxTQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7bUJBRTNDLFNBQVMsU0FBQyw0QkFBNEIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7b0JBT3pELFlBQVksU0FBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRNZW51VHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbnRleHQtbWVudS1pdGVtL28tY29udGV4dC1tZW51LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Db21wb25lbnRNZW51SXRlbXMgfSBmcm9tICcuLi9vLWNvbnRlbnQtbWVudS5jbGFzcyc7XG5pbXBvcnQgeyBPV3JhcHBlckNvbnRlbnRNZW51Q29tcG9uZW50IH0gZnJvbSAnLi9vLXdyYXBwZXItY29udGVudC1tZW51L28td3JhcHBlci1jb250ZW50LW1lbnUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfQ09OVEVYVF9NRU5VX0NPTlRFTlRfSU5QVVRTID0gW1xuICAnbWVudUl0ZW1zJyxcbiAgJ292ZXJsYXknLFxuICAnZGF0YScsXG4gICdtZW51Q2xhc3MnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT05URVhUX01FTlVfQ09OVEVOVF9PVVRQVVRTID0gW1xuICAnZXhlY3V0ZScsXG4gICdjbG9zZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY29udGV4dC1tZW51LWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJ28tY29udGV4dC1tZW51LWNvbnRlbnQuY29tcG9uZW50Lmh0bWwnLFxuICBpbnB1dHM6IERFRkFVTFRfQ09OVEVYVF9NRU5VX0NPTlRFTlRfSU5QVVRTLFxuICBvdXRwdXRzOiBERUZBVUxUX0NPTlRFWFRfTUVOVV9DT05URU5UX09VVFBVVFMsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY29udGV4dC1tZW51LWNvbnRlbnRdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0NvbnRleHRNZW51Q29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XG5cbiAgcHVibGljIG1lbnVJdGVtczogYW55W10gPSBbXTtcbiAgcHVibGljIG92ZXJsYXk6IE92ZXJsYXlSZWY7XG4gIHB1YmxpYyBkYXRhOiBhbnk7XG4gIHB1YmxpYyBtZW51Q2xhc3M6IHN0cmluZztcbiAgcHVibGljIGV4ZWN1dGU6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBFdmVudCwgZGF0YTogYW55LCBtZW51SXRlbTogT0NvbnRleHRNZW51SXRlbUNvbXBvbmVudCB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIGNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAQ29udGVudENoaWxkcmVuKE9Db21wb25lbnRNZW51SXRlbXMpXG4gIHB1YmxpYyBvQ29udGV4dE1lbnVJdGVtczogUXVlcnlMaXN0PE9Db21wb25lbnRNZW51SXRlbXM+O1xuICBAVmlld0NoaWxkKE1hdE1lbnVUcmlnZ2VyLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIHRyaWdnZXI6IE1hdE1lbnVUcmlnZ2VyO1xuICBAVmlld0NoaWxkKE9XcmFwcGVyQ29udGVudE1lbnVDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgbWVudTogT1dyYXBwZXJDb250ZW50TWVudUNvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkgeyB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snKVxuICBwdWJsaWMgY2xpY2soKTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZUNvbnRlbnQoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyLm9wZW5NZW51KCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldERhdGEodGhpcy5tZW51SXRlbXMpO1xuICB9XG5cbiAgcHVibGljIHNldERhdGEoaXRlbXMpOiB2b2lkIHtcbiAgICBpdGVtcy5mb3JFYWNoKG1lbnVJdGVtID0+IHtcbiAgICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgICAgbWVudUl0ZW0uZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgaWYgKG1lbnVJdGVtLmNoaWxkcmVuICYmIG1lbnVJdGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLnNldERhdGEobWVudUl0ZW0uY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25NZW51Q2xvc2VkKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZUNvbnRlbnQoKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9zZUNvbnRlbnQoKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyLmNsb3NlTWVudSgpO1xuICAgIHRoaXMuY2xvc2UuZW1pdCgpO1xuICB9XG5cbn1cbiJdfQ==