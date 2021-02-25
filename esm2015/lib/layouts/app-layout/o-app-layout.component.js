import * as tslib_1 from "tslib";
import { Component, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import { OAppSidenavComponent } from '../../components/app-sidenav/o-app-sidenav.component';
import { InputConverter } from '../../decorators/input-converter';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
export const DEFAULT_INPUTS_O_APP_LAYOUT = [
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
export const DEFAULT_OUTPUTS_O_APP_LAYOUT = [
    'beforeOpenSidenav',
    'afterOpenSidenav',
    'beforeCloseSidenav',
    'afterCloseSidenav'
];
export class OAppLayoutComponent {
    constructor() {
        this.sidenavOpened = true;
        this.showUserInfo = true;
        this.showLanguageSelector = true;
        this.useFlagIcons = false;
        this.beforeOpenSidenav = new EventEmitter();
        this.afterOpenSidenav = new EventEmitter();
        this.beforeCloseSidenav = new EventEmitter();
        this.afterCloseSidenav = new EventEmitter();
    }
    get showHeader() {
        return this._showHeader;
    }
    set showHeader(val) {
        this._showHeader = val;
    }
    get mode() {
        return this._mode;
    }
    set mode(val) {
        const m = Codes.OAppLayoutModes.find(e => e === val);
        if (Util.isDefined(m)) {
            this._mode = m;
            if (this._mode === 'mobile' && !Util.isDefined(this.showHeader)) {
                this.showHeader = true;
            }
        }
        else {
            console.error('Invalid `o-app-layout` mode (' + val + ')');
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
        else {
            console.error('Invalid `o-app-layout` sidenav-mode (' + val + ')');
        }
    }
    sidenavToggle(opened) {
        opened ? this.beforeOpenSidenav.emit() : this.beforeCloseSidenav.emit();
    }
    afterToggle(opened) {
        opened ? this.afterOpenSidenav.emit() : this.afterCloseSidenav.emit();
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtbGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9hcHAtbGF5b3V0L28tYXBwLWxheW91dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUM1RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLEtBQUssRUFBZ0MsTUFBTSxrQkFBa0IsQ0FBQztBQUN2RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFdkMsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUc7SUFDekMsTUFBTTtJQUNOLDJCQUEyQjtJQUMzQiwrQkFBK0I7SUFDL0IsMEJBQTBCO0lBQzFCLDhCQUE4QjtJQUM5Qiw4Q0FBOEM7SUFDOUMsOEJBQThCO0lBQzlCLHdDQUF3QztJQUN4Qyx3Q0FBd0M7Q0FDekMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFVO0lBQ2pELG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsb0JBQW9CO0lBQ3BCLG1CQUFtQjtDQUNwQixDQUFDO0FBV0YsTUFBTSxPQUFPLG1CQUFtQjtJQVRoQztRQVlFLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBRTlCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBRTdCLHlCQUFvQixHQUFZLElBQUksQ0FBQztRQUVyQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQWE5QixzQkFBaUIsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN2RSxxQkFBZ0IsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN0RSx1QkFBa0IsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN4RSxzQkFBaUIsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztJQThDekUsQ0FBQztJQTVDQyxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLEdBQVk7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxJQUFJLENBQUMsR0FBbUI7UUFDMUIsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDckQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUMvRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzthQUN4QjtTQUNGO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksV0FBVyxDQUFDLEdBQWlCO1FBQy9CLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQsYUFBYSxDQUFDLE1BQWU7UUFDM0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxRSxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQWU7UUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4RSxDQUFDOzs7WUEvRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixNQUFNLEVBQUUsMkJBQTJCO2dCQUNuQyxPQUFPLEVBQUUsNEJBQTRCO2dCQUNyQyw0M0NBQTRDO2dCQUU1QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7Ozt5QkFlRSxTQUFTLFNBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7QUFWMUM7SUFEQyxjQUFjLEVBQUU7OzBEQUNhO0FBRTlCO0lBREMsY0FBYyxFQUFFOzt5REFDWTtBQUU3QjtJQURDLGNBQWMsRUFBRTs7aUVBQ29CO0FBRXJDO0lBREMsY0FBYyxFQUFFOzt5REFDYTtBQUU5QjtJQURDLGNBQWMsRUFBRTs7d0RBQ2MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPQXBwU2lkZW5hdkNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvby1hcHAtc2lkZW5hdi5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBDb2RlcywgT0FwcExheW91dE1vZGUsIE9TaWRlbmF2TW9kZSB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0FQUF9MQVlPVVQgPSBbXG4gICdtb2RlJyxcbiAgJ3NpZGVuYXZNb2RlOiBzaWRlbmF2LW1vZGUnLFxuICAnc2lkZW5hdk9wZW5lZDogc2lkZW5hdi1vcGVuZWQnLFxuICAnX3Nob3dIZWFkZXI6IHNob3ctaGVhZGVyJyxcbiAgJ3Nob3dVc2VySW5mbzogc2hvdy11c2VyLWluZm8nLFxuICAnc2hvd0xhbmd1YWdlU2VsZWN0b3I6IHNob3ctbGFuZ3VhZ2Utc2VsZWN0b3InLFxuICAndXNlRmxhZ0ljb25zOiB1c2UtZmxhZy1pY29ucycsXG4gICdvcGVuZWRTaWRlbmF2SW1nOiBvcGVuZWQtc2lkZW5hdi1pbWFnZScsXG4gICdjbG9zZWRTaWRlbmF2SW1nOiBjbG9zZWQtc2lkZW5hdi1pbWFnZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19BUFBfTEFZT1VUOiBhbnlbXSA9IFtcbiAgJ2JlZm9yZU9wZW5TaWRlbmF2JyxcbiAgJ2FmdGVyT3BlblNpZGVuYXYnLFxuICAnYmVmb3JlQ2xvc2VTaWRlbmF2JyxcbiAgJ2FmdGVyQ2xvc2VTaWRlbmF2J1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1hcHAtbGF5b3V0JyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0FQUF9MQVlPVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0FQUF9MQVlPVVQsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWFwcC1sYXlvdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWFwcC1sYXlvdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcblxuZXhwb3J0IGNsYXNzIE9BcHBMYXlvdXRDb21wb25lbnQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNpZGVuYXZPcGVuZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93VXNlckluZm86IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93TGFuZ3VhZ2VTZWxlY3RvcjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHVzZUZsYWdJY29uczogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgX3Nob3dIZWFkZXI6IGJvb2xlYW47XG5cbiAgQFZpZXdDaGlsZCgnYXBwU2lkZW5hdicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgYXBwU2lkZW5hdjogT0FwcFNpZGVuYXZDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIF9tb2RlOiBPQXBwTGF5b3V0TW9kZTtcbiAgcHJvdGVjdGVkIF9zaWRlbmF2TW9kZTogT1NpZGVuYXZNb2RlO1xuXG4gIG9wZW5lZFNpZGVuYXZJbWc6IHN0cmluZztcbiAgY2xvc2VkU2lkZW5hdkltZzogc3RyaW5nO1xuXG4gIGJlZm9yZU9wZW5TaWRlbmF2OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIGFmdGVyT3BlblNpZGVuYXY6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgYmVmb3JlQ2xvc2VTaWRlbmF2OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIGFmdGVyQ2xvc2VTaWRlbmF2OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgZ2V0IHNob3dIZWFkZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dIZWFkZXI7XG4gIH1cblxuICBzZXQgc2hvd0hlYWRlcih2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9zaG93SGVhZGVyID0gdmFsO1xuICB9XG5cbiAgZ2V0IG1vZGUoKTogT0FwcExheW91dE1vZGUge1xuICAgIHJldHVybiB0aGlzLl9tb2RlO1xuICB9XG5cbiAgc2V0IG1vZGUodmFsOiBPQXBwTGF5b3V0TW9kZSkge1xuICAgIGNvbnN0IG0gPSBDb2Rlcy5PQXBwTGF5b3V0TW9kZXMuZmluZChlID0+IGUgPT09IHZhbCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKG0pKSB7XG4gICAgICB0aGlzLl9tb2RlID0gbTtcbiAgICAgIGlmICh0aGlzLl9tb2RlID09PSAnbW9iaWxlJyAmJiAhVXRpbC5pc0RlZmluZWQodGhpcy5zaG93SGVhZGVyKSkge1xuICAgICAgICB0aGlzLnNob3dIZWFkZXIgPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGBvLWFwcC1sYXlvdXRgIG1vZGUgKCcgKyB2YWwgKyAnKScpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaWRlbmF2TW9kZSgpOiBPU2lkZW5hdk1vZGUge1xuICAgIHJldHVybiB0aGlzLl9zaWRlbmF2TW9kZTtcbiAgfVxuXG4gIHNldCBzaWRlbmF2TW9kZSh2YWw6IE9TaWRlbmF2TW9kZSkge1xuICAgIGNvbnN0IG0gPSBDb2Rlcy5PU2lkZW5hdk1vZGVzLmZpbmQoZSA9PiBlID09PSB2YWwpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChtKSkge1xuICAgICAgdGhpcy5fc2lkZW5hdk1vZGUgPSBtO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkIGBvLWFwcC1sYXlvdXRgIHNpZGVuYXYtbW9kZSAoJyArIHZhbCArICcpJyk7XG4gICAgfVxuICB9XG5cbiAgc2lkZW5hdlRvZ2dsZShvcGVuZWQ6IGJvb2xlYW4pIHtcbiAgICBvcGVuZWQgPyB0aGlzLmJlZm9yZU9wZW5TaWRlbmF2LmVtaXQoKSA6IHRoaXMuYmVmb3JlQ2xvc2VTaWRlbmF2LmVtaXQoKTtcbiAgfVxuXG4gIGFmdGVyVG9nZ2xlKG9wZW5lZDogYm9vbGVhbikge1xuICAgIG9wZW5lZCA/IHRoaXMuYWZ0ZXJPcGVuU2lkZW5hdi5lbWl0KCkgOiB0aGlzLmFmdGVyQ2xvc2VTaWRlbmF2LmVtaXQoKTtcbiAgfVxufVxuIl19