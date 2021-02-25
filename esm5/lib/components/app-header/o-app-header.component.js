import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { InputConverter } from '../../decorators/input-converter';
import { DialogService } from '../../services/dialog.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
import { ServiceUtils } from '../../util/service.utils';
export var DEFAULT_INPUTS_O_APP_HEADER = [
    'showUserInfo: show-user-info',
    'showLanguageSelector: show-language-selector',
    'useFlagIcons: use-flag-icons'
];
export var DEFAULT_OUTPUTS_O_APP_HEADER = [
    'onSidenavToggle'
];
var OAppHeaderComponent = (function () {
    function OAppHeaderComponent(router, injector, elRef) {
        var _this = this;
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
        this.modulesInfoSubscription = this.modulesInfoService.getModuleChangeObservable().subscribe(function (res) {
            _this.headerTitle = res.name;
        });
    }
    OAppHeaderComponent.prototype.ngOnDestroy = function () {
        this.modulesInfoSubscription.unsubscribe();
    };
    OAppHeaderComponent.prototype.onLogoutClick = function () {
        var _this = this;
        this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_LOGOUT').then(function (res) {
            if (res) {
                ServiceUtils.redirectLogin(_this.router, false);
            }
        });
    };
    Object.defineProperty(OAppHeaderComponent.prototype, "headerTitle", {
        get: function () {
            return this._headerTitle;
        },
        set: function (value) {
            this._headerTitle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAppHeaderComponent.prototype, "showHeaderTitle", {
        get: function () {
            return this._headerTitle.length > 0;
        },
        enumerable: true,
        configurable: true
    });
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
    OAppHeaderComponent.ctorParameters = function () { return [
        { type: Router },
        { type: Injector },
        { type: ElementRef }
    ]; };
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
    return OAppHeaderComponent;
}());
export { OAppHeaderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtaGVhZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9hcHAtaGVhZGVyL28tYXBwLWhlYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQWEsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDNUcsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDOUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDNUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRXhELE1BQU0sQ0FBQyxJQUFNLDJCQUEyQixHQUFHO0lBQ3pDLDhCQUE4QjtJQUM5Qiw4Q0FBOEM7SUFDOUMsOEJBQThCO0NBQy9CLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSw0QkFBNEIsR0FBRztJQUMxQyxpQkFBaUI7Q0FDbEIsQ0FBQztBQUVGO0lBNEJFLDZCQUNZLE1BQWMsRUFDZCxRQUFrQixFQUNsQixLQUFpQjtRQUg3QixpQkFXQztRQVZXLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFVBQUssR0FBTCxLQUFLLENBQVk7UUFoQm5CLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBSzVCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBRTdCLHlCQUFvQixHQUFZLElBQUksQ0FBQztRQUVyQyxpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUV2QixvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFPaEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHlCQUF5QixFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUM5RixLQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQseUNBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsMkNBQWEsR0FBYjtRQUFBLGlCQU1DO1FBTEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztZQUN2RSxJQUFJLEdBQUcsRUFBRTtnQkFDUCxZQUFZLENBQUMsYUFBYSxDQUFDLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDaEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxzQkFBSSw0Q0FBVzthQUFmO1lBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzNCLENBQUM7YUFFRCxVQUFnQixLQUFhO1lBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzVCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksZ0RBQWU7YUFBbkI7WUFDRSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTs7Z0JBL0RGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsTUFBTSxFQUFFLDJCQUEyQjtvQkFDbkMsT0FBTyxFQUFFLDRCQUE0QjtvQkFDckMsNm9CQUE0QztvQkFFNUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixzQkFBc0IsRUFBRSxNQUFNO3FCQUMvQjs7aUJBQ0Y7OztnQkE1QlEsTUFBTTtnQkFEK0IsUUFBUTtnQkFBbEMsVUFBVTs7SUF1QzVCO1FBREMsY0FBYyxFQUFFOzs2REFDWTtJQUU3QjtRQURDLGNBQWMsRUFBRTs7cUVBQ29CO0lBRXJDO1FBREMsY0FBYyxFQUFFOzs2REFDYTtJQXlDaEMsMEJBQUM7Q0FBQSxBQWpFRCxJQWlFQztTQXREWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE9uRGVzdHJveSwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgT01vZHVsZXNJbmZvU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL28tbW9kdWxlcy1pbmZvLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQVBQX0hFQURFUiA9IFtcbiAgJ3Nob3dVc2VySW5mbzogc2hvdy11c2VyLWluZm8nLFxuICAnc2hvd0xhbmd1YWdlU2VsZWN0b3I6IHNob3ctbGFuZ3VhZ2Utc2VsZWN0b3InLFxuICAndXNlRmxhZ0ljb25zOiB1c2UtZmxhZy1pY29ucydcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19BUFBfSEVBREVSID0gW1xuICAnb25TaWRlbmF2VG9nZ2xlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1hcHAtaGVhZGVyJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0FQUF9IRUFERVIsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0FQUF9IRUFERVIsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWFwcC1oZWFkZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWFwcC1oZWFkZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1hcHAtaGVhZGVyXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9BcHBIZWFkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbW9kdWxlc0luZm9TZXJ2aWNlOiBPTW9kdWxlc0luZm9TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgX2hlYWRlclRpdGxlID0gJyc7XG5cbiAgcHJvdGVjdGVkIG1vZHVsZXNJbmZvU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd1VzZXJJbmZvOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd0xhbmd1YWdlU2VsZWN0b3I6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICB1c2VGbGFnSWNvbnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgb25TaWRlbmF2VG9nZ2xlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLm1vZHVsZXNJbmZvU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Nb2R1bGVzSW5mb1NlcnZpY2UpO1xuXG4gICAgdGhpcy5tb2R1bGVzSW5mb1N1YnNjcmlwdGlvbiA9IHRoaXMubW9kdWxlc0luZm9TZXJ2aWNlLmdldE1vZHVsZUNoYW5nZU9ic2VydmFibGUoKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMuaGVhZGVyVGl0bGUgPSByZXMubmFtZTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMubW9kdWxlc0luZm9TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG9uTG9nb3V0Q2xpY2soKSB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuQ09ORklSTV9MT0dPVVQnKS50aGVuKHJlcyA9PiB7XG4gICAgICBpZiAocmVzKSB7XG4gICAgICAgIFNlcnZpY2VVdGlscy5yZWRpcmVjdExvZ2luKHRoaXMucm91dGVyLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgaGVhZGVyVGl0bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZGVyVGl0bGU7XG4gIH1cblxuICBzZXQgaGVhZGVyVGl0bGUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2hlYWRlclRpdGxlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2hvd0hlYWRlclRpdGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oZWFkZXJUaXRsZS5sZW5ndGggPiAwO1xuICB9XG5cbn1cbiJdfQ==