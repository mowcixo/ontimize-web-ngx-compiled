import * as tslib_1 from "tslib";
import { Component, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { OAppSidenavComponent } from '../../components/app-sidenav/o-app-sidenav.component';
import { InputConverter } from '../../decorators/input-converter';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
export var DEFAULT_INPUTS_O_APP_LAYOUT = [
    'mode',
    'sidenavMode: sidenav-mode',
    'sidenavOpened: sidenav-opened',
    '_showHeader: show-header',
    'showUserInfo: show-user-info',
    'showLanguageSelector: show-language-selector',
    'useFlagIcons: use-flag-icons',
    'openedSidenavImg: opened-sidenav-image',
    'closedSidenavImg: closed-sidenav-image'
];
export var DEFAULT_OUTPUTS_O_APP_LAYOUT = [
    'beforeOpenSidenav',
    'afterOpenSidenav',
    'beforeCloseSidenav',
    'afterCloseSidenav'
];
var OAppLayoutComponent = (function () {
    function OAppLayoutComponent() {
        this.sidenavOpened = true;
        this.showUserInfo = true;
        this.showLanguageSelector = true;
        this.useFlagIcons = false;
        this.beforeOpenSidenav = new EventEmitter();
        this.afterOpenSidenav = new EventEmitter();
        this.beforeCloseSidenav = new EventEmitter();
        this.afterCloseSidenav = new EventEmitter();
    }
    Object.defineProperty(OAppLayoutComponent.prototype, "showHeader", {
        get: function () {
            return this._showHeader;
        },
        set: function (val) {
            this._showHeader = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAppLayoutComponent.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (val) {
            var m = Codes.OAppLayoutModes.find(function (e) { return e === val; });
            if (Util.isDefined(m)) {
                this._mode = m;
                if (this._mode === 'mobile' && !Util.isDefined(this.showHeader)) {
                    this.showHeader = true;
                }
            }
            else {
                console.error('Invalid `o-app-layout` mode (' + val + ')');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAppLayoutComponent.prototype, "sidenavMode", {
        get: function () {
            return this._sidenavMode;
        },
        set: function (val) {
            var m = Codes.OSidenavModes.find(function (e) { return e === val; });
            if (Util.isDefined(m)) {
                this._sidenavMode = m;
            }
            else {
                console.error('Invalid `o-app-layout` sidenav-mode (' + val + ')');
            }
        },
        enumerable: true,
        configurable: true
    });
    OAppLayoutComponent.prototype.sidenavToggle = function (opened) {
        opened ? this.beforeOpenSidenav.emit() : this.beforeCloseSidenav.emit();
    };
    OAppLayoutComponent.prototype.afterToggle = function (opened) {
        opened ? this.afterOpenSidenav.emit() : this.afterCloseSidenav.emit();
    };
    OAppLayoutComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-app-layout',
                    inputs: DEFAULT_INPUTS_O_APP_LAYOUT,
                    outputs: DEFAULT_OUTPUTS_O_APP_LAYOUT,
                    template: "<o-app-sidenav #appSidenav [sidenav-mode]=\"sidenavMode\" [opened]=\"sidenavOpened\" [show-user-info]=\"showUserInfo\" [show-toggle-button]=\"!showHeader\"\n  [opened-sidenav-image]=\"openedSidenavImg\" [closed-sidenav-image]=\"closedSidenavImg\" [layout-mode]=\"mode\" [class.header-layout]=\"showHeader\"\n  (onSidenavToggle)=\"sidenavToggle($event)\" (afterSidenavToggle)=\"afterToggle($event)\">\n\n  <ng-content select=\"o-app-layout-sidenav[position=start]\" ngProjectAs=\"o-app-layout-sidenav-projection-start\">\n  </ng-content>\n  <ng-content select=\"o-app-layout-sidenav[position=end]\" ngProjectAs=\"o-app-layout-sidenav-projection-end\">\n  </ng-content>\n  <ng-content select=\"o-app-layout-sidenav\" ngProjectAs=\"o-app-layout-sidenav-projection-end\"></ng-content>\n\n  <o-app-header #appHeader *ngIf=\"showHeader\" [show-user-info]=\"showUserInfo\" [show-language-selector]=\"showLanguageSelector\"\n    [use-flag-icons]=\"useFlagIcons\" (onSidenavToggle)=\"appSidenav.toggleSidenav()\">\n    <mat-icon class=\"sidenav-toggle\" svgIcon=\"ontimize:menu\" (click)=\"appSidenav.toggleSidenav()\" *ngIf=\"appSidenav.isMobileMode()\"></mat-icon>\n    <ng-content select=\"o-app-layout-header\"></ng-content>\n  </o-app-header>\n\n  <div class=\"application-layout-content-wrapper\" [class.header-layout]=\"showHeader\">\n    <ng-content></ng-content>\n  </div>\n</o-app-sidenav>\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: [".application-layout-content-wrapper{z-index:1;position:absolute;top:0;bottom:0;left:0;right:0;overflow:auto;padding:8px}.application-layout-content-wrapper.header-layout{top:56px}"]
                }] }
    ];
    OAppLayoutComponent.propDecorators = {
        appSidenav: [{ type: ViewChild, args: ['appSidenav', { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppLayoutComponent.prototype, "sidenavOpened", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppLayoutComponent.prototype, "showUserInfo", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppLayoutComponent.prototype, "showLanguageSelector", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppLayoutComponent.prototype, "useFlagIcons", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppLayoutComponent.prototype, "_showHeader", void 0);
    return OAppLayoutComponent;
}());
export { OAppLayoutComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtbGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9hcHAtbGF5b3V0L28tYXBwLWxheW91dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLEtBQUssRUFBZ0MsTUFBTSxrQkFBa0IsQ0FBQztBQUN2RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsTUFBTSxDQUFDLElBQU0sMkJBQTJCLEdBQUc7SUFDekMsTUFBTTtJQUNOLDJCQUEyQjtJQUMzQiwrQkFBK0I7SUFDL0IsMEJBQTBCO0lBQzFCLDhCQUE4QjtJQUM5Qiw4Q0FBOEM7SUFDOUMsOEJBQThCO0lBQzlCLHdDQUF3QztJQUN4Qyx3Q0FBd0M7Q0FDekMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLDRCQUE0QixHQUFVO0lBQ2pELG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsb0JBQW9CO0lBQ3BCLG1CQUFtQjtDQUNwQixDQUFDO0FBRUY7SUFBQTtRQVlFLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBRTlCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBRTdCLHlCQUFvQixHQUFZLElBQUksQ0FBQztRQUVyQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQWE5QixzQkFBaUIsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN2RSxxQkFBZ0IsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN0RSx1QkFBa0IsR0FBMEIsSUFBSSxZQUFZLEVB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Vmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0FwcFNpZGVuYXZDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2FwcC1zaWRlbmF2L28tYXBwLXNpZGVuYXYuY29tcG9uZW50JztcbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgQ29kZXMsIE9BcHBMYXlvdXRNb2RlLCBPU2lkZW5hdk1vZGUgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19BUFBfTEFZT1VUID0gW1xuICAnbW9kZScsXG4gICdzaWRlbmF2TW9kZTogc2lkZW5hdi1tb2RlJyxcbiAgJ3NpZGVuYXZPcGVuZWQ6IHNpZGVuYXYtb3BlbmVkJyxcbiAgJ19zaG93SGVhZGVyOiBzaG93LWhlYWRlcicsXG4gICdzaG93VXNlckluZm86IHNob3ctdXNlci1pbmZvJyxcbiAgJ3Nob3dMYW5ndWFnZVNlbGVjdG9yOiBzaG93LWxhbmd1YWdlLXNlbGVjdG9yJyxcbiAgJ3VzZUZsYWdJY29uczogdXNlLWZsYWctaWNvbnMnLFxuICAnb3BlbmVkU2lkZW5hdkltZzogb3BlbmVkLXNpZGVuYXYtaW1hZ2UnLFxuICAnY2xvc2VkU2lkZW5hdkltZzogY2xvc2VkLXNpZGVuYXYtaW1hZ2UnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQVBQX0xBWU9VVDogYW55W10gPSBbXG4gICdiZWZvcmVPcGVuU2lkZW5hdicsXG4gICdhZnRlck9wZW5TaWRlbmF2JyxcbiAgJ2JlZm9yZUNsb3NlU2lkZW5hdicsXG4gICdhZnRlckNsb3NlU2lkZW5hdidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYXBwLWxheW91dCcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19BUFBfTEFZT1VULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19BUFBfTEFZT1VULFxuICB0ZW1wbGF0ZVVybDogJy4vby1hcHAtbGF5b3V0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1hcHAtbGF5b3V0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5cbmV4cG9ydCBjbGFzcyBPQXBwTGF5b3V0Q29tcG9uZW50IHtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaWRlbmF2T3BlbmVkOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd1VzZXJJbmZvOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0xhbmd1YWdlU2VsZWN0b3I6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICB1c2VGbGFnSWNvbnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIF9zaG93SGVhZGVyOiBib29sZWFuO1xuXG4gIEBWaWV3Q2hpbGQoJ2FwcFNpZGVuYXYnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIGFwcFNpZGVuYXY6IE9BcHBTaWRlbmF2Q29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBfbW9kZTogT0FwcExheW91dE1vZGU7XG4gIHByb3RlY3RlZCBfc2lkZW5hdk1vZGU6IE9TaWRlbmF2TW9kZTtcblxuICBvcGVuZWRTaWRlbmF2SW1nOiBzdHJpbmc7XG4gIGNsb3NlZFNpZGVuYXZJbWc6IHN0cmluZztcblxuICBiZWZvcmVPcGVuU2lkZW5hdjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBhZnRlck9wZW5TaWRlbmF2OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIGJlZm9yZUNsb3NlU2lkZW5hdjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBhZnRlckNsb3NlU2lkZW5hdjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIGdldCBzaG93SGVhZGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93SGVhZGVyO1xuICB9XG5cbiAgc2V0IHNob3dIZWFkZXIodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd0hlYWRlciA9IHZhbDtcbiAgfVxuXG4gIGdldCBtb2RlKCk6IE9BcHBMYXlvdXRNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgfVxuXG4gIHNldCBtb2RlKHZhbDogT0FwcExheW91dE1vZGUpIHtcbiAgICBjb25zdCBtID0gQ29kZXMuT0FwcExheW91dE1vZGVzLmZpbmQoZSA9PiBlID09PSB2YWwpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChtKSkge1xuICAgICAgdGhpcy5fbW9kZSA9IG07XG4gICAgICBpZiAodGhpcy5fbW9kZSA9PT0gJ21vYmlsZScgJiYgIVV0aWwuaXNEZWZpbmVkKHRoaXMuc2hvd0hlYWRlcikpIHtcbiAgICAgICAgdGhpcy5zaG93SGVhZGVyID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBgby1hcHAtbGF5b3V0YCBtb2RlICgnICsgdmFsICsgJyknKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2lkZW5hdk1vZGUoKTogT1NpZGVuYXZNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fc2lkZW5hdk1vZGU7XG4gIH1cblxuICBzZXQgc2lkZW5hdk1vZGUodmFsOiBPU2lkZW5hdk1vZGUpIHtcbiAgICBjb25zdCBtID0gQ29kZXMuT1NpZGVuYXZNb2Rlcy5maW5kKGUgPT4gZSA9PT0gdmFsKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQobSkpIHtcbiAgICAgIHRoaXMuX3NpZGVuYXZNb2RlID0gbTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCBgby1hcHAtbGF5b3V0YCBzaWRlbmF2LW1vZGUgKCcgKyB2YWwgKyAnKScpO1xuICAgIH1cbiAgfVxuXG4gIHNpZGVuYXZUb2dnbGUob3BlbmVkOiBib29sZWFuKSB7XG4gICAgb3BlbmVkID8gdGhpcy5iZWZvcmVPcGVuU2lkZW5hdi5lbWl0KCkgOiB0aGlzLmJlZm9yZUNsb3NlU2lkZW5hdi5lbWl0KCk7XG4gIH1cblxuICBhZnRlclRvZ2dsZShvcGVuZWQ6IGJvb2xlYW4pIHtcbiAgICBvcGVuZWQgPyB0aGlzLmFmdGVyT3BlblNpZGVuYXYuZW1pdCgpIDogdGhpcy5hZnRlckNsb3NlU2lkZW5hdi5lbWl0KCk7XG4gIH1cbn1cbiJdfQ==