import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { InputConverter } from '../../decorators/input-converter';
import { DialogService } from '../../services/dialog.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
import { ServiceUtils } from '../../util/service.utils';
export const DEFAULT_INPUTS_O_APP_HEADER = [
    'showUserInfo: show-user-info',
    'showLanguageSelector: show-language-selector',
    'useFlagIcons: use-flag-icons'
];
export const DEFAULT_OUTPUTS_O_APP_HEADER = [
    'onSidenavToggle'
];
export class OAppHeaderComponent {
    constructor(router, injector, elRef) {
        this.router = router;
        this.injector = injector;
        this.elRef = elRef;
        this._headerTitle = '';
        this.showUserInfo = true;
        this.showLanguageSelector = true;
        this.useFlagIcons = false;
        this.onSidenavToggle = new EventEmitter();
        this.dialogService = this.injector.get(DialogService);
        this.modulesInfoService = this.injector.get(OModulesInfoService);
        this.modulesInfoSubscription = this.modulesInfoService.getModuleChangeObservable().subscribe(res => {
            this.headerTitle = res.name;
        });
    }
    ngOnDestroy() {
        this.modulesInfoSubscription.unsubscribe();
    }
    onLogoutClick() {
        this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(res => {
            if (res) {
                ServiceUtils.redirectLogin(this.router, false);
            }
        });
    }
    get headerTitle() {
        return this._headerTitle;
    }
    set headerTitle(value) {
        this._headerTitle = value;
    }
    get showHeaderTitle() {
        return this._headerTitle.length > 0;
    }
}
OAppHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-app-header',
                inputs: DEFAULT_INPUTS_O_APP_HEADER,
                outputs: DEFAULT_OUTPUTS_O_APP_HEADER,
                template: "<nav fxFlex fxLayout=\"row\" fxLayoutAlign=\"space-between stretch\">\n  <div fxFlex fxLayout=\"row\" fxLayoutAlign=\"space-between stretch\">\n    <ng-content></ng-content>\n    <span *ngIf=\"showHeaderTitle\" class=\"o-app-header-title\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      {{ headerTitle | oTranslate }}\n    </span>\n    <div fxLayout=\"row\" fxLayoutAlign=\"end stretch\" class=\"o-app-header-default-actions\">\n      <o-user-info *ngIf=\"showUserInfo\"></o-user-info>\n      <o-language-selector *ngIf=\"showLanguageSelector\" [use-flag-icons]=\"useFlagIcons\"></o-language-selector>\n    </div>\n  </div>\n</nav>",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-app-header]': 'true'
                },
                styles: [".o-app-header{z-index:2;box-shadow:0 2px 6px rgba(0,0,0,.24);height:56px}.o-app-header nav{padding-right:16px}.o-app-header nav .sidenav-toggle{text-align:center;padding:16px;cursor:pointer}.o-app-header nav .o-app-header-title{padding:0 16px;cursor:default}.o-app-header nav .o-app-header-default-actions{margin-left:auto}"]
            }] }
];
OAppHeaderComponent.ctorParameters = () => [
    { type: Router },
    { type: Injector },
    { type: ElementRef }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppHeaderComponent.prototype, "showUserInfo", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppHeaderComponent.prototype, "showLanguageSelector", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppHeaderComponent.prototype, "useFlagIcons", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9hcHAtaGVhZGVyL28tYXBwLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQWEsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUcsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDNUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXhELE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHO0lBQ3pDLDhCQUE4QjtJQUM5Qiw4Q0FBOEM7SUFDOUMsOEJBQThCO0NBQy9CLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxpQkFBaUI7Q0FDbEIsQ0FBQztBQWFGLE1BQU0sT0FBTyxtQkFBbUI7SUFpQjlCLFlBQ1ksTUFBYyxFQUNkLFFBQWtCLEVBQ2xCLEtBQWlCO1FBRmpCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFVBQUssR0FBTCxLQUFLLENBQVk7UUFoQm5CLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBSzVCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBRTdCLHlCQUFvQixHQUFZLElBQUksQ0FBQztRQUVyQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUV2QixvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFPaEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHlCQUF5QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2pHLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzFFLElBQUksR0FBRyxFQUFFO2dCQUNQLFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNoRDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxXQUFXLENBQUMsS0FBYTtRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7OztZQS9ERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLE1BQU0sRUFBRSwyQkFBMkI7Z0JBQ25DLE9BQU8sRUFBRSw0QkFBNEI7Z0JBQ3JDLDZvQkFBNEM7Z0JBRTVDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osc0JBQXNCLEVBQUUsTUFBTTtpQkFDL0I7O2FBQ0Y7OztZQTVCUSxNQUFNO1lBRCtCLFFBQVE7WUFBbEMsVUFBVTs7QUF1QzVCO0lBREMsY0FBYyxFQUFFOzt5REFDWTtBQUU3QjtJQURDLGNBQWMsRUFBRTs7aUVBQ29CO0FBRXJDO0lBREMsY0FBYyxFQUFFOzt5REFDYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciwgT25EZXN0cm95LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPTW9kdWxlc0luZm9TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvby1tb2R1bGVzLWluZm8uc2VydmljZSc7XG5pbXBvcnQgeyBTZXJ2aWNlVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL3NlcnZpY2UudXRpbHMnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19BUFBfSEVBREVSID0gW1xuICAnc2hvd1VzZXJJbmZvOiBzaG93LXVzZXItaW5mbycsXG4gICdzaG93TGFuZ3VhZ2VTZWxlY3Rvcjogc2hvdy1sYW5ndWFnZS1zZWxlY3RvcicsXG4gICd1c2VGbGFnSWNvbnM6IHVzZS1mbGFnLWljb25zJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0FQUF9IRUFERVIgPSBbXG4gICdvblNpZGVuYXZUb2dnbGUnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWFwcC1oZWFkZXInLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQVBQX0hFQURFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fQVBQX0hFQURFUixcbiAgdGVtcGxhdGVVcmw6ICcuL28tYXBwLWhlYWRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYXBwLWhlYWRlci5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWFwcC1oZWFkZXJdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0FwcEhlYWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG4gIHByb3RlY3RlZCBtb2R1bGVzSW5mb1NlcnZpY2U6IE9Nb2R1bGVzSW5mb1NlcnZpY2U7XG4gIHByb3RlY3RlZCBfaGVhZGVyVGl0bGUgPSAnJztcblxuICBwcm90ZWN0ZWQgbW9kdWxlc0luZm9TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93VXNlckluZm86IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93TGFuZ3VhZ2VTZWxlY3RvcjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHVzZUZsYWdJY29uczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBvblNpZGVuYXZUb2dnbGUgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmXG4gICkge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMubW9kdWxlc0luZm9TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT01vZHVsZXNJbmZvU2VydmljZSk7XG5cbiAgICB0aGlzLm1vZHVsZXNJbmZvU3Vic2NyaXB0aW9uID0gdGhpcy5tb2R1bGVzSW5mb1NlcnZpY2UuZ2V0TW9kdWxlQ2hhbmdlT2JzZXJ2YWJsZSgpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgdGhpcy5oZWFkZXJUaXRsZSA9IHJlcy5uYW1lO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5tb2R1bGVzSW5mb1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgb25Mb2dvdXRDbGljaygpIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0xPR09VVCcpLnRoZW4ocmVzID0+IHtcbiAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgU2VydmljZVV0aWxzLnJlZGlyZWN0TG9naW4odGhpcy5yb3V0ZXIsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBoZWFkZXJUaXRsZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9oZWFkZXJUaXRsZTtcbiAgfVxuXG4gIHNldCBoZWFkZXJUaXRsZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faGVhZGVyVGl0bGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzaG93SGVhZGVyVGl0bGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hlYWRlclRpdGxlLmxlbmd0aCA+IDA7XG4gIH1cblxufVxuIl19