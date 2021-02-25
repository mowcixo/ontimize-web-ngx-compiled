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
export var DEFAULT_INPUTS_O_APP_SIDENAV = [
    'opened',
    'showUserInfo: show-user-info',
    'showToggleButton: show-toggle-button',
    'openedSidenavImg: opened-sidenav-image',
    'closedSidenavImg: closed-sidenav-image',
    'layoutMode: layout-mode',
    'sidenavMode: sidenav-mode'
];
export var DEFAULT_OUTPUTS_O_APP_SIDENAV = [
    'onSidenavOpenedChange',
    'onSidenavOpenedStart',
    'onSidenavClosedStart',
    'onSidenavToggle',
    'afterSidenavToggle'
];
var OAppSidenavComponent = (function () {
    function OAppSidenavComponent(injector, router, elRef, cd, media) {
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
        var self = this;
        this.mediaWatch = this.media.asObservable().subscribe(function () {
            if (self.isScreenSmall() && self.sidenav) {
                self.sidenav.close();
            }
        });
    }
    OAppSidenavComponent.prototype.onResize = function () {
        if (!this.manuallyClosed && !this.isScreenSmall() && !this.isMobileMode()) {
            this.sidenav.open();
        }
    };
    OAppSidenavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.routerSubscription = this.router.events.subscribe(function () {
            if (_this.isScreenSmall()) {
                _this.sidenav.close();
            }
        });
    };
    OAppSidenavComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.showUserInfo && this.showToggleButton) {
            this.userInfo = this.oUserInfoService.getUserInfo();
            this.userInfoSubscription = this.oUserInfoService.getUserInfoObservable().subscribe(function (res) {
                _this.userInfo = res;
                _this.refreshMenuRoots();
            });
        }
        this.refreshMenuRoots();
    };
    Object.defineProperty(OAppSidenavComponent.prototype, "layoutMode", {
        get: function () {
            return this._layoutMode;
        },
        set: function (val) {
            var m = Codes.OAppLayoutModes.find(function (e) { return e === val; });
            if (Util.isDefined(m)) {
                this._layoutMode = m;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAppSidenavComponent.prototype, "sidenavMode", {
        get: function () {
            return this._sidenavMode;
        },
        set: function (val) {
            var m = Codes.OSidenavModes.find(function (e) { return e === val; });
            if (Util.isDefined(m)) {
                this._sidenavMode = m;
            }
        },
        enumerable: true,
        configurable: true
    });
    OAppSidenavComponent.prototype.refreshMenuRoots = function () {
        if (this.showUserInfo && this.userInfo && this._showToggleButton) {
            var firstRoot = this.menuRootArray[0];
            var alreadyExistsUserInfo = firstRoot ? firstRoot.id === 'user-info' : false;
            if (alreadyExistsUserInfo) {
                var userInfoItem = this.menuRootArray[0].items[0];
                userInfoItem.id = this.userInfo.username;
                userInfoItem.name = this.userInfo.username;
                userInfoItem.user = this.userInfo.username;
                userInfoItem.avatar = this.userInfo.avatar;
            }
            else {
                var userInfoItem = {
                    id: this.userInfo.username,
                    name: this.userInfo.username,
                    user: this.userInfo.username,
                    avatar: this.userInfo.avatar
                };
                var menuGroupUserInfo = {
                    id: 'user-info',
                    name: 'APP_LAYOUT.USER_PROFILE',
                    items: [userInfoItem],
                    opened: true,
                    icon: 'person_pin'
                };
                this.menuRootArray.unshift(menuGroupUserInfo);
            }
        }
    };
    OAppSidenavComponent.prototype.ngOnDestroy = function () {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
        if (this.userInfoSubscription) {
            this.userInfoSubscription.unsubscribe();
        }
    };
    OAppSidenavComponent.prototype.isScreenSmall = function () {
        return !this.manuallyClosed && this.media.isActive('lt-sm');
    };
    OAppSidenavComponent.prototype.isMobileMode = function () {
        return this._layoutMode === Codes.APP_LAYOUT_MODE_MOBILE;
    };
    OAppSidenavComponent.prototype.isDesktopMode = function () {
        return this._layoutMode === Codes.APP_LAYOUT_MODE_DESKTOP;
    };
    OAppSidenavComponent.prototype.isSidenavOpened = function () {
        return this.opened && !this.isMobileMode() && !this.isScreenSmall();
    };
    Object.defineProperty(OAppSidenavComponent.prototype, "menuRootArray", {
        get: function () {
            return this._menuRootArray;
        },
        set: function (val) {
            this._menuRootArray = val;
        },
        enumerable: true,
        configurable: true
    });
    OAppSidenavComponent.prototype.toggleSidenav = function () {
        var promise = this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
        var self = this;
        promise.then(function () {
            self.afterSidenavToggle.emit(self.sidenav.opened);
        });
        this.cd.detectChanges();
        this.opened = this.sidenav.opened;
        this.manuallyClosed = !this.opened;
        this.onSidenavToggle.emit(this.sidenav.opened);
    };
    Object.defineProperty(OAppSidenavComponent.prototype, "showUserInfo", {
        get: function () {
            return this._showUserInfo;
        },
        set: function (arg) {
            this._showUserInfo = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAppSidenavComponent.prototype, "showToggleButton", {
        get: function () {
            return this._showToggleButton;
        },
        set: function (arg) {
            this._showToggleButton = arg;
        },
        enumerable: true,
        configurable: true
    });
    OAppSidenavComponent.prototype.onMenuItemClick = function () {
        if (this.isMobileMode()) {
            this.sidenav.close();
        }
    };
    OAppSidenavComponent.prototype.sidenavClosedStart = function () {
        this.onSidenavClosedStart.emit();
    };
    OAppSidenavComponent.prototype.sidenavOpenedStart = function () {
        this.onSidenavOpenedStart.emit();
    };
    OAppSidenavComponent.prototype.sidenavOpenedChange = function () {
        this.onSidenavOpenedChange.emit();
    };
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
    OAppSidenavComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: Router },
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: MediaObserver }
    ]; };
    OAppSidenavComponent.propDecorators = {
        sidenav: [{ type: ViewChild, args: [MatSidenav, { static: false },] }],
        onResize: [{ type: HostListener, args: ['window:resize', [],] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppSidenavComponent.prototype, "opened", void 0);
    return OAppSidenavComponent;
}());
export { OAppSidenavComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvby1hcHAtc2lkZW5hdi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixRQUFRLEVBR1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd6QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFbEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBWSxNQUFNLG9DQUFvQyxDQUFDO0FBRWhGLE9BQU8sRUFBRSxLQUFLLEVBQWdDLE1BQU0sa0JBQWtCLENBQUM7QUFDdkUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxJQUFNLDRCQUE0QixHQUFHO0lBQzFDLFFBQVE7SUFDUiw4QkFBOEI7SUFDOUIsc0NBQXNDO0lBQ3RDLHdDQUF3QztJQUN4Qyx3Q0FBd0M7SUFDeEMseUJBQXlCO0lBQ3pCLDJCQUEyQjtDQUM1QixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sNkJBQTZCLEdBQUc7SUFDM0MsdUJBQXVCO0lBQ3ZCLHNCQUFzQjtJQUN0QixzQkFBc0I7SUFDdEIsaUJBQWlCO0lBQ2pCLG9CQUFvQjtDQUNyQixDQUFDO0FBRUY7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QU07O2lCQUNoRDs7O2dCQWhEQyxRQUFRO2dCQVFELE1BQU07Z0JBWGIsVUFBVTtnQkFGVixpQkFBaUI7Z0JBV1YsYUFBYTs7OzBCQTZDbkIsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7MkJBNkN2QyxZQUFZLFNBQUMsZUFBZSxFQUFFLEVBQUU7O0lBcENqQztRQURDLGNBQWMsRUFBRTs7d0RBQ2dCO0lBK0xuQywyQkFBQztDQUFBLEFBdE5ELElBc05DO1NBMU1ZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1lZGlhT2JzZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5pbXBvcnQgeyBNYXRTaWRlbmF2IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE1lbnVHcm91cCwgTWVudUl0ZW1Vc2VySW5mbyB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvYXBwLW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IEFwcE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXBwLW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBPVXNlckluZm9TZXJ2aWNlLCBVc2VySW5mbyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL28tdXNlci1pbmZvLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVudVJvb3RJdGVtIH0gZnJvbSAnLi4vLi4vdHlwZXMvbWVudS1yb290LWl0ZW0udHlwZSc7XG5pbXBvcnQgeyBDb2RlcywgT0FwcExheW91dE1vZGUsIE9TaWRlbmF2TW9kZSB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0FQUF9TSURFTkFWID0gW1xuICAnb3BlbmVkJyxcbiAgJ3Nob3dVc2VySW5mbzogc2hvdy11c2VyLWluZm8nLFxuICAnc2hvd1RvZ2dsZUJ1dHRvbjogc2hvdy10b2dnbGUtYnV0dG9uJyxcbiAgJ29wZW5lZFNpZGVuYXZJbWc6IG9wZW5lZC1zaWRlbmF2LWltYWdlJyxcbiAgJ2Nsb3NlZFNpZGVuYXZJbWc6IGNsb3NlZC1zaWRlbmF2LWltYWdlJyxcbiAgJ2xheW91dE1vZGU6IGxheW91dC1tb2RlJyxcbiAgJ3NpZGVuYXZNb2RlOiBzaWRlbmF2LW1vZGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQVBQX1NJREVOQVYgPSBbXG4gICdvblNpZGVuYXZPcGVuZWRDaGFuZ2UnLFxuICAnb25TaWRlbmF2T3BlbmVkU3RhcnQnLFxuICAnb25TaWRlbmF2Q2xvc2VkU3RhcnQnLFxuICAnb25TaWRlbmF2VG9nZ2xlJyxcbiAgJ2FmdGVyU2lkZW5hdlRvZ2dsZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYXBwLXNpZGVuYXYnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQVBQX1NJREVOQVYsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0FQUF9TSURFTkFWLFxuICB0ZW1wbGF0ZVVybDogJy4vby1hcHAtc2lkZW5hdi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYXBwLXNpZGVuYXYuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1hcHAtc2lkZW5hdl0nOiAndHJ1ZSdcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT0FwcFNpZGVuYXZDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQFZpZXdDaGlsZChNYXRTaWRlbmF2LCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgc2lkZW5hdjogTWF0U2lkZW5hdjtcblxuICBwcm90ZWN0ZWQgcm91dGVyU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIGFwcE1lbnVTZXJ2aWNlOiBBcHBNZW51U2VydmljZTtcbiAgcHJvdGVjdGVkIF9tZW51Um9vdEFycmF5OiBNZW51Um9vdEl0ZW1bXSA9IFtdO1xuICBwcm90ZWN0ZWQgX2xheW91dE1vZGU6IE9BcHBMYXlvdXRNb2RlID0gQ29kZXMuQVBQX0xBWU9VVF9NT0RFX0RFU0tUT1A7XG4gIHByb3RlY3RlZCBfc2lkZW5hdk1vZGU6IE9TaWRlbmF2TW9kZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG9wZW5lZDogYm9vbGVhbiA9IHRydWU7XG4gIF9zaG93VXNlckluZm86IGJvb2xlYW4gPSB0cnVlO1xuICBfc2hvd1RvZ2dsZUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIG9wZW5lZFNpZGVuYXZJbWc6IHN0cmluZztcbiAgY2xvc2VkU2lkZW5hdkltZzogc3RyaW5nO1xuXG4gIG9uU2lkZW5hdk9wZW5lZENoYW5nZTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBvblNpZGVuYXZPcGVuZWRTdGFydDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBvblNpZGVuYXZDbG9zZWRTdGFydDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBvblNpZGVuYXZUb2dnbGU6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgYWZ0ZXJTaWRlbmF2VG9nZ2xlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIHByb3RlY3RlZCBvVXNlckluZm9TZXJ2aWNlOiBPVXNlckluZm9TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdXNlckluZm9TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHVzZXJJbmZvOiBVc2VySW5mbztcblxuICBwcm90ZWN0ZWQgbWVkaWFXYXRjaDogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgbWFudWFsbHlDbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcixcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgbWVkaWE6IE1lZGlhT2JzZXJ2ZXJcbiAgKSB7XG4gICAgdGhpcy5hcHBNZW51U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcE1lbnVTZXJ2aWNlKTtcbiAgICB0aGlzLm1lbnVSb290QXJyYXkgPSB0aGlzLmFwcE1lbnVTZXJ2aWNlLmdldE1lbnVSb290cygpO1xuICAgIHRoaXMub1VzZXJJbmZvU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Vc2VySW5mb1NlcnZpY2UpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubWVkaWFXYXRjaCA9IHRoaXMubWVkaWEuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChzZWxmLmlzU2NyZWVuU21hbGwoKSAmJiBzZWxmLnNpZGVuYXYpIHtcbiAgICAgICAgc2VsZi5zaWRlbmF2LmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgW10pXG4gIG9uUmVzaXplKCkge1xuICAgIGlmICghdGhpcy5tYW51YWxseUNsb3NlZCAmJiAhdGhpcy5pc1NjcmVlblNtYWxsKCkgJiYgIXRoaXMuaXNNb2JpbGVNb2RlKCkpIHtcbiAgICAgIHRoaXMuc2lkZW5hdi5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yb3V0ZXJTdWJzY3JpcHRpb24gPSB0aGlzLnJvdXRlci5ldmVudHMuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmlzU2NyZWVuU21hbGwoKSkge1xuICAgICAgICB0aGlzLnNpZGVuYXYuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5zaG93VXNlckluZm8gJiYgdGhpcy5zaG93VG9nZ2xlQnV0dG9uKSB7XG4gICAgICB0aGlzLnVzZXJJbmZvID0gdGhpcy5vVXNlckluZm9TZXJ2aWNlLmdldFVzZXJJbmZvKCk7XG4gICAgICB0aGlzLnVzZXJJbmZvU3Vic2NyaXB0aW9uID0gdGhpcy5vVXNlckluZm9TZXJ2aWNlLmdldFVzZXJJbmZvT2JzZXJ2YWJsZSgpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICB0aGlzLnVzZXJJbmZvID0gcmVzO1xuICAgICAgICB0aGlzLnJlZnJlc2hNZW51Um9vdHMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2hNZW51Um9vdHMoKTtcbiAgfVxuXG4gIGdldCBsYXlvdXRNb2RlKCk6IE9BcHBMYXlvdXRNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0TW9kZTtcbiAgfVxuXG4gIHNldCBsYXlvdXRNb2RlKHZhbDogT0FwcExheW91dE1vZGUpIHtcbiAgICBjb25zdCBtID0gQ29kZXMuT0FwcExheW91dE1vZGVzLmZpbmQoZSA9PiBlID09PSB2YWwpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChtKSkge1xuICAgICAgdGhpcy5fbGF5b3V0TW9kZSA9IG07XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNpZGVuYXZNb2RlKCk6IE9TaWRlbmF2TW9kZSB7XG4gICAgcmV0dXJuIHRoaXMuX3NpZGVuYXZNb2RlO1xuICB9XG5cbiAgc2V0IHNpZGVuYXZNb2RlKHZhbDogT1NpZGVuYXZNb2RlKSB7XG4gICAgY29uc3QgbSA9IENvZGVzLk9TaWRlbmF2TW9kZXMuZmluZChlID0+IGUgPT09IHZhbCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKG0pKSB7XG4gICAgICB0aGlzLl9zaWRlbmF2TW9kZSA9IG07XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHJlZnJlc2hNZW51Um9vdHMoKSB7XG4gICAgaWYgKHRoaXMuc2hvd1VzZXJJbmZvICYmIHRoaXMudXNlckluZm8gJiYgdGhpcy5fc2hvd1RvZ2dsZUJ1dHRvbikge1xuICAgICAgY29uc3QgZmlyc3RSb290ID0gdGhpcy5tZW51Um9vdEFycmF5WzBdO1xuICAgICAgY29uc3QgYWxyZWFkeUV4aXN0c1VzZXJJbmZvID0gZmlyc3RSb290ID8gZmlyc3RSb290LmlkID09PSAndXNlci1pbmZvJyA6IGZhbHNlO1xuICAgICAgaWYgKGFscmVhZHlFeGlzdHNVc2VySW5mbykge1xuICAgICAgICBjb25zdCB1c2VySW5mb0l0ZW06IE1lbnVJdGVtVXNlckluZm8gPSAodGhpcy5tZW51Um9vdEFycmF5WzBdIGFzIE1lbnVHcm91cCkuaXRlbXNbMF0gYXMgTWVudUl0ZW1Vc2VySW5mbztcbiAgICAgICAgdXNlckluZm9JdGVtLmlkID0gdGhpcy51c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgdXNlckluZm9JdGVtLm5hbWUgPSB0aGlzLnVzZXJJbmZvLnVzZXJuYW1lO1xuICAgICAgICB1c2VySW5mb0l0ZW0udXNlciA9IHRoaXMudXNlckluZm8udXNlcm5hbWU7XG4gICAgICAgIHVzZXJJbmZvSXRlbS5hdmF0YXIgPSB0aGlzLnVzZXJJbmZvLmF2YXRhcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHVzZXJJbmZvSXRlbTogTWVudUl0ZW1Vc2VySW5mbyA9IHtcbiAgICAgICAgICBpZDogdGhpcy51c2VySW5mby51c2VybmFtZSxcbiAgICAgICAgICBuYW1lOiB0aGlzLnVzZXJJbmZvLnVzZXJuYW1lLFxuICAgICAgICAgIHVzZXI6IHRoaXMudXNlckluZm8udXNlcm5hbWUsXG4gICAgICAgICAgYXZhdGFyOiB0aGlzLnVzZXJJbmZvLmF2YXRhclxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtZW51R3JvdXBVc2VySW5mbzogTWVudUdyb3VwID0ge1xuICAgICAgICAgIGlkOiAndXNlci1pbmZvJyxcbiAgICAgICAgICBuYW1lOiAnQVBQX0xBWU9VVC5VU0VSX1BST0ZJTEUnLFxuICAgICAgICAgIGl0ZW1zOiBbdXNlckluZm9JdGVtXSxcbiAgICAgICAgICBvcGVuZWQ6IHRydWUsXG4gICAgICAgICAgaWNvbjogJ3BlcnNvbl9waW4nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubWVudVJvb3RBcnJheS51bnNoaWZ0KG1lbnVHcm91cFVzZXJJbmZvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5yb3V0ZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucm91dGVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVzZXJJbmZvU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnVzZXJJbmZvU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgaXNTY3JlZW5TbWFsbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMubWFudWFsbHlDbG9zZWQgJiYgdGhpcy5tZWRpYS5pc0FjdGl2ZSgnbHQtc20nKTtcbiAgfVxuXG4gIGlzTW9iaWxlTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5b3V0TW9kZSA9PT0gQ29kZXMuQVBQX0xBWU9VVF9NT0RFX01PQklMRTtcbiAgfVxuXG4gIGlzRGVza3RvcE1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dE1vZGUgPT09IENvZGVzLkFQUF9MQVlPVVRfTU9ERV9ERVNLVE9QO1xuICB9XG5cbiAgaXNTaWRlbmF2T3BlbmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9wZW5lZCAmJiAhdGhpcy5pc01vYmlsZU1vZGUoKSAmJiAhdGhpcy5pc1NjcmVlblNtYWxsKCk7XG4gIH1cblxuICBnZXQgbWVudVJvb3RBcnJheSgpOiBNZW51Um9vdEl0ZW1bXSB7XG4gICAgcmV0dXJuIHRoaXMuX21lbnVSb290QXJyYXk7XG4gIH1cblxuICBzZXQgbWVudVJvb3RBcnJheSh2YWw6IE1lbnVSb290SXRlbVtdKSB7XG4gICAgdGhpcy5fbWVudVJvb3RBcnJheSA9IHZhbDtcbiAgfVxuXG4gIHRvZ2dsZVNpZGVuYXYoKSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IHRoaXMuc2lkZW5hdi5vcGVuZWQgPyB0aGlzLnNpZGVuYXYuY2xvc2UoKSA6IHRoaXMuc2lkZW5hdi5vcGVuKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHNlbGYuYWZ0ZXJTaWRlbmF2VG9nZ2xlLmVtaXQoc2VsZi5zaWRlbmF2Lm9wZW5lZCk7XG4gICAgfSk7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgdGhpcy5vcGVuZWQgPSB0aGlzLnNpZGVuYXYub3BlbmVkO1xuICAgIHRoaXMubWFudWFsbHlDbG9zZWQgPSAhdGhpcy5vcGVuZWQ7XG4gICAgdGhpcy5vblNpZGVuYXZUb2dnbGUuZW1pdCh0aGlzLnNpZGVuYXYub3BlbmVkKTtcbiAgfVxuXG4gIGdldCBzaG93VXNlckluZm8oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dVc2VySW5mbztcbiAgfVxuXG4gIHNldCBzaG93VXNlckluZm8oYXJnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1VzZXJJbmZvID0gYXJnO1xuICB9XG5cbiAgZ2V0IHNob3dUb2dnbGVCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dUb2dnbGVCdXR0b247XG4gIH1cblxuICBzZXQgc2hvd1RvZ2dsZUJ1dHRvbihhcmc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93VG9nZ2xlQnV0dG9uID0gYXJnO1xuICB9XG5cbiAgb25NZW51SXRlbUNsaWNrKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzTW9iaWxlTW9kZSgpKSB7XG4gICAgICB0aGlzLnNpZGVuYXYuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBzaWRlbmF2Q2xvc2VkU3RhcnQoKSB7XG4gICAgdGhpcy5vblNpZGVuYXZDbG9zZWRTdGFydC5lbWl0KCk7XG4gIH1cblxuICBzaWRlbmF2T3BlbmVkU3RhcnQoKSB7XG4gICAgdGhpcy5vblNpZGVuYXZPcGVuZWRTdGFydC5lbWl0KCk7XG4gIH1cblxuICBzaWRlbmF2T3BlbmVkQ2hhbmdlKCkge1xuICAgIHRoaXMub25TaWRlbmF2T3BlbmVkQ2hhbmdlLmVtaXQoKTtcbiAgfVxufVxuXG4iXX0=