import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Injector, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { InputConverter } from '../../decorators/input-converter';
import { AppMenuService } from '../../services/app-menu.service';
import { OUserInfoService } from '../../services/o-user-info.service';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
export const DEFAULT_INPUTS_O_APP_SIDENAV = [
    'opened',
    'showUserInfo: show-user-info',
    'showToggleButton: show-toggle-button',
    'openedSidenavImg: opened-sidenav-image',
    'closedSidenavImg: closed-sidenav-image',
    'layoutMode: layout-mode',
    'sidenavMode: sidenav-mode'
];
export const DEFAULT_OUTPUTS_O_APP_SIDENAV = [
    'onSidenavOpenedChange',
    'onSidenavOpenedStart',
    'onSidenavClosedStart',
    'onSidenavToggle',
    'afterSidenavToggle'
];
export class OAppSidenavComponent {
    constructor(injector, router, elRef, cd, media) {
        this.injector = injector;
        this.router = router;
        this.elRef = elRef;
        this.cd = cd;
        this.media = media;
        this._menuRootArray = [];
        this._layoutMode = Codes.APP_LAYOUT_MODE_DESKTOP;
        this.opened = true;
        this._showUserInfo = true;
        this._showToggleButton = true;
        this.onSidenavOpenedChange = new EventEmitter();
        this.onSidenavOpenedStart = new EventEmitter();
        this.onSidenavClosedStart = new EventEmitter();
        this.onSidenavToggle = new EventEmitter();
        this.afterSidenavToggle = new EventEmitter();
        this.manuallyClosed = false;
        this.appMenuService = this.injector.get(AppMenuService);
        this.menuRootArray = this.appMenuService.getMenuRoots();
        this.oUserInfoService = this.injector.get(OUserInfoService);
        const self = this;
        this.mediaWatch = this.media.asObservable().subscribe(() => {
            if (self.isScreenSmall() && self.sidenav) {
                self.sidenav.close();
            }
        });
    }
    onResize() {
        if (!this.manuallyClosed && !this.isScreenSmall() && !this.isMobileMode()) {
            this.sidenav.open();
        }
    }
    ngOnInit() {
        this.routerSubscription = this.router.events.subscribe(() => {
            if (this.isScreenSmall()) {
                this.sidenav.close();
            }
        });
    }
    ngAfterViewInit() {
        if (this.showUserInfo && this.showToggleButton) {
            this.userInfo = this.oUserInfoService.getUserInfo();
            this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(res => {
                this.userInfo = res;
                this.refreshMenuRoots();
            });
        }
        this.refreshMenuRoots();
    }
    get layoutMode() {
        return this._layoutMode;
    }
    set layoutMode(val) {
        const m = Codes.OAppLayoutModes.find(e => e === val);
        if (Util.isDefined(m)) {
            this._layoutMode = m;
        }
    }
    get sidenavMode() {
        return this._sidenavMode;
    }
    set sidenavMode(val) {
        const m = Codes.OSidenavModes.find(e => e === val);
        if (Util.isDefined(m)) {
            this._sidenavMode = m;
        }
    }
    refreshMenuRoots() {
        if (this.showUserInfo && this.userInfo && this._showToggleButton) {
            const firstRoot = this.menuRootArray[0];
            const alreadyExistsUserInfo = firstRoot ? firstRoot.id === 'user-info' : false;
            if (alreadyExistsUserInfo) {
                const userInfoItem = this.menuRootArray[0].items[0];
                userInfoItem.id = this.userInfo.username;
                userInfoItem.name = this.userInfo.username;
                userInfoItem.user = this.userInfo.username;
                userInfoItem.avatar = this.userInfo.avatar;
            }
            else {
                const userInfoItem = {
                    id: this.userInfo.username,
                    name: this.userInfo.username,
                    user: this.userInfo.username,
                    avatar: this.userInfo.avatar
                };
                const menuGroupUserInfo = {
                    id: 'user-info',
                    name: 'APP_LAYOUT.USER_PROFILE',
                    items: [userInfoItem],
                    opened: true,
                    icon: 'person_pin'
                };
                this.menuRootArray.unshift(menuGroupUserInfo);
            }
        }
    }
    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.userInfoSubscription) {
            this.userInfoSubscription.unsubscribe();
        }
    }
    isScreenSmall() {
        return !this.manuallyClosed && this.media.isActive('lt-sm');
    }
    isMobileMode() {
        return this._layoutMode === Codes.APP_LAYOUT_MODE_MOBILE;
    }
    isDesktopMode() {
        return this._layoutMode === Codes.APP_LAYOUT_MODE_DESKTOP;
    }
    isSidenavOpened() {
        return this.opened && !this.isMobileMode() && !this.isScreenSmall();
    }
    get menuRootArray() {
        return this._menuRootArray;
    }
    set menuRootArray(val) {
        this._menuRootArray = val;
    }
    toggleSidenav() {
        const promise = this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
        const self = this;
        promise.then(() => {
            self.afterSidenavToggle.emit(self.sidenav.opened);
        });
        this.cd.detectChanges();
        this.opened = this.sidenav.opened;
        this.manuallyClosed = !this.opened;
        this.onSidenavToggle.emit(this.sidenav.opened);
    }
    get showUserInfo() {
        return this._showUserInfo;
    }
    set showUserInfo(arg) {
        this._showUserInfo = arg;
    }
    get showToggleButton() {
        return this._showToggleButton;
    }
    set showToggleButton(arg) {
        this._showToggleButton = arg;
    }
    onMenuItemClick() {
        if (this.isMobileMode()) {
            this.sidenav.close();
        }
    }
    sidenavClosedStart() {
        this.onSidenavClosedStart.emit();
    }
    sidenavOpenedStart() {
        this.onSidenavOpenedStart.emit();
    }
    sidenavOpenedChange() {
        this.onSidenavOpenedChange.emit();
    }
}
OAppSidenavComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-app-sidenav',
                inputs: DEFAULT_INPUTS_O_APP_SIDENAV,
                outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV,
                template: "<mat-sidenav-container class=\"o-app-sidenav-container\" [class.opened]=\"sidenav.opened\"\n  [class.o-app-sidenav-mode-desktop]=\"(layoutMode || 'desktop') === 'desktop'\"\n  [class.o-app-sidenav-mode-mobile]=\"(layoutMode || 'desktop') !== 'desktop'\">\n\n  <mat-sidenav #sidenav class=\"o-app-sidenav-sidenav o-scroll\" [opened]=\"isSidenavOpened()\"\n    [mode]=\"(sidenavMode || ((layoutMode || 'desktop') === 'desktop' ? 'side' : 'over'))\" [class.mat-drawer-opened]=\"sidenav.opened\"\n    [class.mat-drawer-closed]=\"!sidenav.opened\" fxLayout=\"column\" fxLayoutAlign=\"start stretch\" (openedChange)=\"sidenavOpenedChange()\"\n    (closedStart)=\"sidenavClosedStart()\" (openedStart)=\"sidenavOpenedStart()\">\n\n    <div fxLayout=\"row\" fxLayoutAlign=\"end\" class=\"sidenav-toggle-container\" *ngIf=\"isDesktopMode()\">\n      <mat-icon class=\"sidenav-toggle\" (click)=\"toggleSidenav()\" svgIcon=\"ontimize:menu\">menu</mat-icon>\n    </div>\n\n    <o-app-sidenav-image [opened-src]=\"openedSidenavImg\" [closed-src]=\"closedSidenavImg\"> </o-app-sidenav-image>\n\n    <ng-content select=\"o-app-layout-sidenav-projection-start\"></ng-content>\n\n    <nav *ngFor=\"let menuRootItem of menuRootArray\">\n\n      <ul *ngIf=\"appMenuService.getMenuItemType(menuRootItem) !== 'group'\">\n        <o-app-sidenav-menu-item [menu-item]=\"menuRootItem\" [menu-item-type]=\"appMenuService.getMenuItemType(menuRootItem)\"\n          [sidenav-opened]=\"sidenav.opened\" (onClick)=\"onMenuItemClick()\">\n        </o-app-sidenav-menu-item>\n      </ul>\n\n      <o-app-sidenav-menu-group [menu-group]=\"menuRootItem\" [sidenav-opened]=\"sidenav.opened\"\n        *ngIf=\"appMenuService.getMenuItemType(menuRootItem) === 'group'\" (onItemClick)=\"onMenuItemClick()\">\n      </o-app-sidenav-menu-group>\n    </nav>\n\n    <ng-content select=\"o-app-layout-sidenav-projection-end\"></ng-content>\n\n  </mat-sidenav>\n\n  <mat-sidenav-content class=\"o-app-sidenav-content\">\n    <ng-content></ng-content>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-app-sidenav]': 'true'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".o-app-sidenav.header-layout .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav{box-shadow:3px 56px 6px rgba(0,0,0,.24)}.o-app-sidenav .o-app-sidenav-menu-group[disabled=true] .mat-button-focus-overlay,.o-app-sidenav .o-app-sidenav-menu-group[disabled=true] .mat-ripple,.o-app-sidenav .o-app-sidenav-menu-item[disabled=true] .mat-button-focus-overlay,.o-app-sidenav .o-app-sidenav-menu-item[disabled=true] .mat-ripple{display:none}.o-app-sidenav .o-app-sidenav-menu-group[disabled=true] .o-app-sidenav-item,.o-app-sidenav .o-app-sidenav-menu-item[disabled=true] .o-app-sidenav-item{opacity:.5}.o-app-sidenav .o-app-sidenav-menu-group[disabled=true] a,.o-app-sidenav .o-app-sidenav-menu-item[disabled=true] a{cursor:initial}.o-app-sidenav .o-app-sidenav-container{width:100%;height:100%}.o-app-sidenav .o-app-sidenav-container.o-app-sidenav-mode-desktop:not(.opened) .o-app-sidenav-sidenav.mat-drawer-closed{visibility:visible!important;transform:translate3d(-191px,0,0)}.o-app-sidenav .o-app-sidenav-container.o-app-sidenav-mode-desktop:not(.opened) .o-app-sidenav-content.mat-drawer-content{margin-right:48px!important;transform:translate3d(48px,0,0)!important}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav{box-shadow:3px 0 6px rgba(0,0,0,.24);padding-bottom:36px;padding-top:5px;width:240px;bottom:0;overflow:auto;height:100%}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav h3{font-size:16px;border:none;line-height:24px;text-transform:capitalize;margin:0;padding-left:16px}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav ul{list-style-type:none;margin:0;padding:0}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav li{margin:0;padding:0}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav li>a{box-sizing:border-box;display:block;font-size:14px;font-weight:400;line-height:47px;text-decoration:none;padding:0 16px;position:relative}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav .sidenav-toggle{padding:4px 12px 8px;cursor:pointer}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav .o-app-sidenav-menugroup{transition:background-color .5s}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav .o-app-sidenav-menugroup.active+.o-app-sidenav-menugroup-items-container .o-app-sidenav-menu-item:last-child li{border-color:transparent}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav .o-app-sidenav-menugroup-items-container{overflow:hidden}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closing{transform:translate3d(-191px,0,0)}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed{text-align:center}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-item:not(.o-user-info){cursor:pointer}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-item.o-user-info:focus,.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-item.o-user-info:hover{color:inherit}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-item.o-app-sidenav-menuitem a{width:48px;max-width:48px;min-width:48px;line-height:48px;padding:0 8px;height:48px}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-item.o-app-sidenav-menugroup{padding:8px 8px 8px 12px;height:48px;justify-content:center!important}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed nav{width:48px;min-width:48px;margin-left:auto}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-image .o-app-sidenav-image-container{padding:0;text-align:end;max-height:48px}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav.mat-drawer-closed .o-app-sidenav-image .o-app-sidenav-image-container .o-app-sidenav-image{max-height:48px;margin:8px 8px 0 0}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav:not(.mat-drawer-closed) .o-app-sidenav-item{border-bottom-width:0;border-bottom-style:solid}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav:not(.mat-drawer-closed) .o-app-sidenav-menugroup{padding:16px;transition:padding .5s}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav:not(.mat-drawer-closed) .o-app-sidenav-menugroup .o-app-sidenav-menugroup-arrow{position:absolute;right:16px;transition:transform .5s cubic-bezier(.25,.8,.25,1)}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav:not(.mat-drawer-closed) .o-app-sidenav-menugroup.active .o-app-sidenav-menugroup-arrow{transform:rotate(90deg)}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav:not(.mat-drawer-closed) .o-app-sidenav-menugroup.active+.o-app-sidenav-menugroup-items-container ul li>a{padding-left:32px}.o-app-sidenav .o-app-sidenav-container .mat-drawer.o-app-sidenav-sidenav:not(.mat-drawer-closed) .o-app-sidenav-menuitem mat-icon{margin-right:16px}.o-app-sidenav .o-app-sidenav-container .o-app-sidenav-content{position:absolute;right:0;left:0;min-height:100%;display:flex;flex-direction:column}.o-app-sidenav .o-app-sidenav-container .o-app-sidenav-content router-outlet+*{flex-grow:1}"]
            }] }
];
OAppSidenavComponent.ctorParameters = () => [
    { type: Injector },
    { type: Router },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: MediaObserver }
];
OAppSidenavComponent.propDecorators = {
    sidenav: [{ type: ViewChild, args: [MatSidenav, { static: false },] }],
    onResize: [{ type: HostListener, args: ['window:resize', [],] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppSidenavComponent.prototype, "opened", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvby1hcHAtc2lkZW5hdi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixRQUFRLEVBR1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFbEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBWSxNQUFNLG9DQUFvQyxDQUFDO0FBRWhGLE9BQU8sRUFBRSxLQUFLLEVBQWdDLE1BQU0sa0JBQWtCLENBQUM7QUFDdkUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBQzFDLFFBQVE7SUFDUiw4QkFBOEI7SUFDOUIsc0NBQXNDO0lBQ3RDLHdDQUF3QztJQUN4Qyx3Q0FBd0M7SUFDeEMseUJBQXlCO0lBQ3pCLDJCQUEyQjtDQUM1QixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUc7SUFDM0MsdUJBQXVCO0lBQ3ZCLHNCQUFzQjtJQUN0QixzQkFBc0I7SUFDdEIsaUJBQWlCO0lBQ2pCLG9CQUFvQjtDQUNyQixDQUFDO0FBY0Ys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LEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTt1QkE2Q3ZDLFlBQVksU0FBQyxlQUFlLEVBQUUsRUFBRTs7QUFwQ2pDO0lBREMsY0FBYyxFQUFFOztvREFDZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNZWRpYU9ic2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuaW1wb3J0IHsgTWF0U2lkZW5hdiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBNZW51R3JvdXAsIE1lbnVJdGVtVXNlckluZm8gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2FwcC1tZW51LmludGVyZmFjZSc7XG5pbXBvcnQgeyBBcHBNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FwcC1tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgT1VzZXJJbmZvU2VydmljZSwgVXNlckluZm8gfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9vLXVzZXItaW5mby5zZXJ2aWNlJztcbmltcG9ydCB7IE1lbnVSb290SXRlbSB9IGZyb20gJy4uLy4uL3R5cGVzL21lbnUtcm9vdC1pdGVtLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMsIE9BcHBMYXlvdXRNb2RlLCBPU2lkZW5hdk1vZGUgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19BUFBfU0lERU5BViA9IFtcbiAgJ29wZW5lZCcsXG4gICdzaG93VXNlckluZm86IHNob3ctdXNlci1pbmZvJyxcbiAgJ3Nob3dUb2dnbGVCdXR0b246IHNob3ctdG9nZ2xlLWJ1dHRvbicsXG4gICdvcGVuZWRTaWRlbmF2SW1nOiBvcGVuZWQtc2lkZW5hdi1pbWFnZScsXG4gICdjbG9zZWRTaWRlbmF2SW1nOiBjbG9zZWQtc2lkZW5hdi1pbWFnZScsXG4gICdsYXlvdXRNb2RlOiBsYXlvdXQtbW9kZScsXG4gICdzaWRlbmF2TW9kZTogc2lkZW5hdi1tb2RlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0FQUF9TSURFTkFWID0gW1xuICAnb25TaWRlbmF2T3BlbmVkQ2hhbmdlJyxcbiAgJ29uU2lkZW5hdk9wZW5lZFN0YXJ0JyxcbiAgJ29uU2lkZW5hdkNsb3NlZFN0YXJ0JyxcbiAgJ29uU2lkZW5hdlRvZ2dsZScsXG4gICdhZnRlclNpZGVuYXZUb2dnbGUnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWFwcC1zaWRlbmF2JyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0FQUF9TSURFTkFWLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19BUFBfU0lERU5BVixcbiAgdGVtcGxhdGVVcmw6ICcuL28tYXBwLXNpZGVuYXYuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWFwcC1zaWRlbmF2LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYXBwLXNpZGVuYXZdJzogJ3RydWUnXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9BcHBTaWRlbmF2Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuXG4gIEBWaWV3Q2hpbGQoTWF0U2lkZW5hdiwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHNpZGVuYXY6IE1hdFNpZGVuYXY7XG5cbiAgcHJvdGVjdGVkIHJvdXRlclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBhcHBNZW51U2VydmljZTogQXBwTWVudVNlcnZpY2U7XG4gIHByb3RlY3RlZCBfbWVudVJvb3RBcnJheTogTWVudVJvb3RJdGVtW10gPSBbXTtcbiAgcHJvdGVjdGVkIF9sYXlvdXRNb2RlOiBPQXBwTGF5b3V0TW9kZSA9IENvZGVzLkFQUF9MQVlPVVRfTU9ERV9ERVNLVE9QO1xuICBwcm90ZWN0ZWQgX3NpZGVuYXZNb2RlOiBPU2lkZW5hdk1vZGU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBvcGVuZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBfc2hvd1VzZXJJbmZvOiBib29sZWFuID0gdHJ1ZTtcbiAgX3Nob3dUb2dnbGVCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBvcGVuZWRTaWRlbmF2SW1nOiBzdHJpbmc7XG4gIGNsb3NlZFNpZGVuYXZJbWc6IHN0cmluZztcblxuICBvblNpZGVuYXZPcGVuZWRDaGFuZ2U6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgb25TaWRlbmF2T3BlbmVkU3RhcnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgb25TaWRlbmF2Q2xvc2VkU3RhcnQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgb25TaWRlbmF2VG9nZ2xlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIGFmdGVyU2lkZW5hdlRvZ2dsZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBwcm90ZWN0ZWQgb1VzZXJJbmZvU2VydmljZTogT1VzZXJJbmZvU2VydmljZTtcbiAgcHJvdGVjdGVkIHVzZXJJbmZvU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCB1c2VySW5mbzogVXNlckluZm87XG5cbiAgcHJvdGVjdGVkIG1lZGlhV2F0Y2g6IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIG1hbnVhbGx5Q2xvc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJvdGVjdGVkIG1lZGlhOiBNZWRpYU9ic2VydmVyXG4gICkge1xuICAgIHRoaXMuYXBwTWVudVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChBcHBNZW51U2VydmljZSk7XG4gICAgdGhpcy5tZW51Um9vdEFycmF5ID0gdGhpcy5hcHBNZW51U2VydmljZS5nZXRNZW51Um9vdHMoKTtcbiAgICB0aGlzLm9Vc2VySW5mb1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVXNlckluZm9TZXJ2aWNlKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLm1lZGlhV2F0Y2ggPSB0aGlzLm1lZGlhLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAoc2VsZi5pc1NjcmVlblNtYWxsKCkgJiYgc2VsZi5zaWRlbmF2KSB7XG4gICAgICAgIHNlbGYuc2lkZW5hdi5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFtdKVxuICBvblJlc2l6ZSgpIHtcbiAgICBpZiAoIXRoaXMubWFudWFsbHlDbG9zZWQgJiYgIXRoaXMuaXNTY3JlZW5TbWFsbCgpICYmICF0aGlzLmlzTW9iaWxlTW9kZSgpKSB7XG4gICAgICB0aGlzLnNpZGVuYXYub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucm91dGVyU3Vic2NyaXB0aW9uID0gdGhpcy5yb3V0ZXIuZXZlbnRzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1NjcmVlblNtYWxsKCkpIHtcbiAgICAgICAgdGhpcy5zaWRlbmF2LmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuc2hvd1VzZXJJbmZvICYmIHRoaXMuc2hvd1RvZ2dsZUJ1dHRvbikge1xuICAgICAgdGhpcy51c2VySW5mbyA9IHRoaXMub1VzZXJJbmZvU2VydmljZS5nZXRVc2VySW5mbygpO1xuICAgICAgdGhpcy51c2VySW5mb1N1YnNjcmlwdGlvbiA9IHRoaXMub1VzZXJJbmZvU2VydmljZS5nZXRVc2VySW5mb09ic2VydmFibGUoKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy51c2VySW5mbyA9IHJlcztcbiAgICAgICAgdGhpcy5yZWZyZXNoTWVudVJvb3RzKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoTWVudVJvb3RzKCk7XG4gIH1cblxuICBnZXQgbGF5b3V0TW9kZSgpOiBPQXBwTGF5b3V0TW9kZSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dE1vZGU7XG4gIH1cblxuICBzZXQgbGF5b3V0TW9kZSh2YWw6IE9BcHBMYXlvdXRNb2RlKSB7XG4gICAgY29uc3QgbSA9IENvZGVzLk9BcHBMYXlvdXRNb2Rlcy5maW5kKGUgPT4gZSA9PT0gdmFsKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQobSkpIHtcbiAgICAgIHRoaXMuX2xheW91dE1vZGUgPSBtO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaWRlbmF2TW9kZSgpOiBPU2lkZW5hdk1vZGUge1xuICAgIHJldHVybiB0aGlzLl9zaWRlbmF2TW9kZTtcbiAgfVxuXG4gIHNldCBzaWRlbmF2TW9kZSh2YWw6IE9TaWRlbmF2TW9kZSkge1xuICAgIGNvbnN0IG0gPSBDb2Rlcy5PU2lkZW5hdk1vZGVzLmZpbmQoZSA9PiBlID09PSB2YWwpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChtKSkge1xuICAgICAgdGhpcy5fc2lkZW5hdk1vZGUgPSBtO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCByZWZyZXNoTWVudVJvb3RzKCkge1xuICAgIGlmICh0aGlzLnNob3dVc2VySW5mbyAmJiB0aGlzLnVzZXJJbmZvICYmIHRoaXMuX3Nob3dUb2dnbGVCdXR0b24pIHtcbiAgICAgIGNvbnN0IGZpcnN0Um9vdCA9IHRoaXMubWVudVJvb3RBcnJheVswXTtcbiAgICAgIGNvbnN0IGFscmVhZHlFeGlzdHNVc2VySW5mbyA9IGZpcnN0Um9vdCA/IGZpcnN0Um9vdC5pZCA9PT0gJ3VzZXItaW5mbycgOiBmYWxzZTtcbiAgICAgIGlmIChhbHJlYWR5RXhpc3RzVXNlckluZm8pIHtcbiAgICAgICAgY29uc3QgdXNlckluZm9JdGVtOiBNZW51SXRlbVVzZXJJbmZvID0gKHRoaXMubWVudVJvb3RBcnJheVswXSBhcyBNZW51R3JvdXApLml0ZW1zWzBdIGFzIE1lbnVJdGVtVXNlckluZm87XG4gICAgICAgIHVzZXJJbmZvSXRlbS5pZCA9IHRoaXMudXNlckluZm8udXNlcm5hbWU7XG4gICAgICAgIHVzZXJJbmZvSXRlbS5uYW1lID0gdGhpcy51c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgdXNlckluZm9JdGVtLnVzZXIgPSB0aGlzLnVzZXJJbmZvLnVzZXJuYW1lO1xuICAgICAgICB1c2VySW5mb0l0ZW0uYXZhdGFyID0gdGhpcy51c2VySW5mby5hdmF0YXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB1c2VySW5mb0l0ZW06IE1lbnVJdGVtVXNlckluZm8gPSB7XG4gICAgICAgICAgaWQ6IHRoaXMudXNlckluZm8udXNlcm5hbWUsXG4gICAgICAgICAgbmFtZTogdGhpcy51c2VySW5mby51c2VybmFtZSxcbiAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJbmZvLnVzZXJuYW1lLFxuICAgICAgICAgIGF2YXRhcjogdGhpcy51c2VySW5mby5hdmF0YXJcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgbWVudUdyb3VwVXNlckluZm86IE1lbnVHcm91cCA9IHtcbiAgICAgICAgICBpZDogJ3VzZXItaW5mbycsXG4gICAgICAgICAgbmFtZTogJ0FQUF9MQVlPVVQuVVNFUl9QUk9GSUxFJyxcbiAgICAgICAgICBpdGVtczogW3VzZXJJbmZvSXRlbV0sXG4gICAgICAgICAgb3BlbmVkOiB0cnVlLFxuICAgICAgICAgIGljb246ICdwZXJzb25fcGluJ1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm1lbnVSb290QXJyYXkudW5zaGlmdChtZW51R3JvdXBVc2VySW5mbyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMucm91dGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJvdXRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy51c2VySW5mb1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy51c2VySW5mb1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIGlzU2NyZWVuU21hbGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLm1hbnVhbGx5Q2xvc2VkICYmIHRoaXMubWVkaWEuaXNBY3RpdmUoJ2x0LXNtJyk7XG4gIH1cblxuICBpc01vYmlsZU1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dE1vZGUgPT09IENvZGVzLkFQUF9MQVlPVVRfTU9ERV9NT0JJTEU7XG4gIH1cblxuICBpc0Rlc2t0b3BNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9sYXlvdXRNb2RlID09PSBDb2Rlcy5BUFBfTEFZT1VUX01PREVfREVTS1RPUDtcbiAgfVxuXG4gIGlzU2lkZW5hdk9wZW5lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWQgJiYgIXRoaXMuaXNNb2JpbGVNb2RlKCkgJiYgIXRoaXMuaXNTY3JlZW5TbWFsbCgpO1xuICB9XG5cbiAgZ2V0IG1lbnVSb290QXJyYXkoKTogTWVudVJvb3RJdGVtW10ge1xuICAgIHJldHVybiB0aGlzLl9tZW51Um9vdEFycmF5O1xuICB9XG5cbiAgc2V0IG1lbnVSb290QXJyYXkodmFsOiBNZW51Um9vdEl0ZW1bXSkge1xuICAgIHRoaXMuX21lbnVSb290QXJyYXkgPSB2YWw7XG4gIH1cblxuICB0b2dnbGVTaWRlbmF2KCkge1xuICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLnNpZGVuYXYub3BlbmVkID8gdGhpcy5zaWRlbmF2LmNsb3NlKCkgOiB0aGlzLnNpZGVuYXYub3BlbigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBzZWxmLmFmdGVyU2lkZW5hdlRvZ2dsZS5lbWl0KHNlbGYuc2lkZW5hdi5vcGVuZWQpO1xuICAgIH0pO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHRoaXMub3BlbmVkID0gdGhpcy5zaWRlbmF2Lm9wZW5lZDtcbiAgICB0aGlzLm1hbnVhbGx5Q2xvc2VkID0gIXRoaXMub3BlbmVkO1xuICAgIHRoaXMub25TaWRlbmF2VG9nZ2xlLmVtaXQodGhpcy5zaWRlbmF2Lm9wZW5lZCk7XG4gIH1cblxuICBnZXQgc2hvd1VzZXJJbmZvKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93VXNlckluZm87XG4gIH1cblxuICBzZXQgc2hvd1VzZXJJbmZvKGFyZzogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3dVc2VySW5mbyA9IGFyZztcbiAgfVxuXG4gIGdldCBzaG93VG9nZ2xlQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93VG9nZ2xlQnV0dG9uO1xuICB9XG5cbiAgc2V0IHNob3dUb2dnbGVCdXR0b24oYXJnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1RvZ2dsZUJ1dHRvbiA9IGFyZztcbiAgfVxuXG4gIG9uTWVudUl0ZW1DbGljaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc01vYmlsZU1vZGUoKSkge1xuICAgICAgdGhpcy5zaWRlbmF2LmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgc2lkZW5hdkNsb3NlZFN0YXJ0KCkge1xuICAgIHRoaXMub25TaWRlbmF2Q2xvc2VkU3RhcnQuZW1pdCgpO1xuICB9XG5cbiAgc2lkZW5hdk9wZW5lZFN0YXJ0KCkge1xuICAgIHRoaXMub25TaWRlbmF2T3BlbmVkU3RhcnQuZW1pdCgpO1xuICB9XG5cbiAgc2lkZW5hdk9wZW5lZENoYW5nZSgpIHtcbiAgICB0aGlzLm9uU2lkZW5hdk9wZW5lZENoYW5nZS5lbWl0KCk7XG4gIH1cbn1cblxuIl19