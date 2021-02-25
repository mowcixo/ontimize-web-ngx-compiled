import { HostListener } from '@angular/core';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { PermissionsUtils } from '../../util/permissions';
import { Util } from '../../util/util';
export var DEFAULT_INPUTS_O_BASE_MENU_ITEM = [
    'title',
    'tooltip',
    'icon',
    'attr'
];
var OBaseMenuItemClass = (function () {
    function OBaseMenuItemClass(menu, elRef, injector) {
        var _this = this;
        this.menu = menu;
        this.elRef = elRef;
        this.injector = injector;
        this._isHovered = false;
        this.onMouseover = function () { return _this.isHovered = true; };
        this.onMouseout = function () { return _this.isHovered = false; };
        this.translateService = this.injector.get(OTranslateService);
    }
    OBaseMenuItemClass.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.tooltip) {
            this.tooltip = this.title;
        }
        if (this.translateService) {
            this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(function () {
                _this.setDOMTitle();
            });
            this.setDOMTitle();
        }
        this.parsePermissions();
    };
    OBaseMenuItemClass.prototype.ngOnDestroy = function () {
        if (this.onLanguageChangeSubscription) {
            this.onLanguageChangeSubscription.unsubscribe();
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
    };
    OBaseMenuItemClass.prototype.setDOMTitle = function () {
        var tooltip = this.translateService.get(this.tooltip);
        this.elRef.nativeElement.setAttribute('title', tooltip);
    };
    OBaseMenuItemClass.prototype.parsePermissions = function () {
        this.permissions = this.menu.getPermissionsService().getMenuPermissions(this.attr);
        if (!Util.isDefined(this.permissions)) {
            return;
        }
        this.restricted = this.permissions.visible === false;
        this.disabled = this.permissions.enabled === false;
        if (this.disabled) {
            this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.elRef.nativeElement, {
                checkStringValue: true
            });
        }
    };
    Object.defineProperty(OBaseMenuItemClass.prototype, "isHovered", {
        get: function () {
            return this._isHovered;
        },
        set: function (val) {
            if (!this.disabled) {
                this._isHovered = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    OBaseMenuItemClass.propDecorators = {
        onMouseover: [{ type: HostListener, args: ['mouseover',] }],
        onMouseout: [{ type: HostListener, args: ['mouseout',] }]
    };
    return OBaseMenuItemClass;
}());
export { OBaseMenuItemClass };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXNlLW1lbnUtaXRlbS5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9iYXItbWVudS9vLWJhc2UtbWVudS1pdGVtLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYyxZQUFZLEVBQStCLE1BQU0sZUFBZSxDQUFDO0FBR3RGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRWpGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd2QyxNQUFNLENBQUMsSUFBTSwrQkFBK0IsR0FBRztJQUU3QyxPQUFPO0lBR1AsU0FBUztJQUdULE1BQU07SUFFTixNQUFNO0NBQ1AsQ0FBQztBQUVGO0lBbUJFLDRCQUNZLElBQXVCLEVBQ3ZCLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSDlCLGlCQU1DO1FBTFcsU0FBSSxHQUFKLElBQUksQ0FBbUI7UUFDdkIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBVHBCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFHWCxnQkFBVyxHQUFHLGNBQU0sT0FBQSxLQUFJLENBQUMsU0FBUyxHQUFHLElBQUksRUFBckIsQ0FBcUIsQ0FBQztRQUMzQyxlQUFVLEdBQUcsY0FBTSxPQUFBLEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxFQUF0QixDQUFzQixDQUFDO1FBT2xFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxxQ0FBUSxHQUFSO1FBQUEsaUJBV0M7UUFWQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDM0I7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztnQkFDcEYsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELHdDQUFXLEdBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyw0QkFBNEIsRUFBRTtZQUNyQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakQ7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVTLDZDQUFnQixHQUExQjtRQUVFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDckMsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7UUFDckQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7UUFFbkQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtnQkFDOUYsZ0JBQWdCLEVBQUUsSUFBSTthQUN2QixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxzQkFBSSx5Q0FBUzthQUFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7YUFFRCxVQUFjLEdBQVk7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO2FBQ3ZCO1FBQ0gsQ0FBQzs7O09BTkE7OzhCQXhEQSxZQUFZLFNBQUMsV0FBVzs2QkFDeEIsWUFBWSxTQUFDLFVBQVU7O0lBOEQxQix5QkFBQztDQUFBLEFBL0VELElBK0VDO1NBL0VZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQmFyTWVudUNvbXBvbmVudCB9IGZyb20gJy4vby1iYXItbWVudS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19CQVNFX01FTlVfSVRFTSA9IFtcbiAgLy8gdGl0bGUgW3N0cmluZ106IG1lbnUgaXRlbSB0aXRsZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICd0aXRsZScsXG5cbiAgLy8gdG9vbHRpcCBbc3RyaW5nXTogbWVudSBncm91cCB0b29sdGlwLiBEZWZhdWx0OiAndGl0bGUnIHZhbHVlLlxuICAndG9vbHRpcCcsXG5cbiAgLy8gaWNvbiBbc3RyaW5nXTogbWF0ZXJpYWwgaWNvbi4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdpY29uJyxcblxuICAnYXR0cidcbl07XG5cbmV4cG9ydCBjbGFzcyBPQmFzZU1lbnVJdGVtQ2xhc3MgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgb25MYW5ndWFnZUNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zO1xuICBwcm90ZWN0ZWQgbXV0YXRpb25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcblxuICB0aXRsZTogc3RyaW5nO1xuICB0b29sdGlwOiBzdHJpbmc7XG4gIGljb246IHN0cmluZztcbiAgcmVzdHJpY3RlZDogYm9vbGVhbjtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBfaXNIb3ZlcmVkOiBib29sZWFuID0gZmFsc2U7XG4gIGF0dHI6IHN0cmluZztcblxuICBASG9zdExpc3RlbmVyKCdtb3VzZW92ZXInKSBvbk1vdXNlb3ZlciA9ICgpID0+IHRoaXMuaXNIb3ZlcmVkID0gdHJ1ZTtcbiAgQEhvc3RMaXN0ZW5lcignbW91c2VvdXQnKSBvbk1vdXNlb3V0ID0gKCkgPT4gdGhpcy5pc0hvdmVyZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgbWVudTogT0Jhck1lbnVDb21wb25lbnQsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcblxuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICB0aGlzLm9uTGFuZ3VhZ2VDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2Uub25MYW5ndWFnZUNoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRET01UaXRsZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNldERPTVRpdGxlKCk7XG4gICAgfVxuICAgIHRoaXMucGFyc2VQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub25MYW5ndWFnZUNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5vbkxhbmd1YWdlQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgc2V0RE9NVGl0bGUoKSB7XG4gICAgY29uc3QgdG9vbHRpcCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy50b29sdGlwKTtcbiAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aXRsZScsIHRvb2x0aXApO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlUGVybWlzc2lvbnMoKSB7XG4gICAgLy8gaWYgb2F0dHIgaW4gZm9ybSwgaXQgY2FuIGhhdmUgcGVybWlzc2lvbnNcbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy5tZW51LmdldFBlcm1pc3Npb25zU2VydmljZSgpLmdldE1lbnVQZXJtaXNzaW9ucyh0aGlzLmF0dHIpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5yZXN0cmljdGVkID0gdGhpcy5wZXJtaXNzaW9ucy52aXNpYmxlID09PSBmYWxzZTtcbiAgICB0aGlzLmRpc2FibGVkID0gdGhpcy5wZXJtaXNzaW9ucy5lbmFibGVkID09PSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20odGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIGNoZWNrU3RyaW5nVmFsdWU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0hvdmVyZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzSG92ZXJlZDtcbiAgfVxuXG4gIHNldCBpc0hvdmVyZWQodmFsOiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9pc0hvdmVyZWQgPSB2YWw7XG4gICAgfVxuICB9XG59XG4iXX0=