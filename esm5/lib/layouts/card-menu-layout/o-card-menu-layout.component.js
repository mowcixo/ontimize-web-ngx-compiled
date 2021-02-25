import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewEncapsulation, } from '@angular/core';
import { AppMenuService } from '../../services/app-menu.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
export var DEFAULT_INPUTS_O_MENU_LAYOUT = [
    'parentMenuId : parent-menu-id'
];
export var DEFAULT_OUTPUTS_O_MENU_LAYOUT = [];
var OCardMenuLayoutComponent = (function () {
    function OCardMenuLayoutComponent(injector, cd) {
        var _this = this;
        this.injector = injector;
        this.cd = cd;
        this.translateService = this.injector.get(OTranslateService);
        this.appMenuService = this.injector.get(AppMenuService);
        this.menuRoots = this.appMenuService.getMenuRoots();
        this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(function () {
            _this.cd.detectChanges();
        });
    }
    OCardMenuLayoutComponent.prototype.ngAfterViewInit = function () {
        this.setCardMenuItems();
    };
    OCardMenuLayoutComponent.prototype.ngOnDestroy = function () {
        if (this.translateServiceSubscription) {
            this.translateServiceSubscription.unsubscribe();
        }
    };
    OCardMenuLayoutComponent.prototype.setCardMenuItems = function () {
        var _this = this;
        var cardItemsAux = [];
        if (!this.parentMenuId) {
            cardItemsAux = this.menuRoots.filter(function (item) { return !_this.appMenuService.isMenuGroup(item); });
        }
        else {
            cardItemsAux = this.getItemsFilteredByParentId(this.menuRoots);
        }
        this.cardItems = cardItemsAux;
    };
    Object.defineProperty(OCardMenuLayoutComponent.prototype, "cardItems", {
        get: function () {
            return this.cardItemsArray;
        },
        set: function (val) {
            this.cardItemsArray = val;
            this.cd.detectChanges();
        },
        enumerable: true,
        configurable: true
    });
    OCardMenuLayoutComponent.prototype.getItemsFilteredByParentId = function (array) {
        var _this = this;
        var result;
        var groups = array.filter(function (item) { return _this.appMenuService.isMenuGroup(item); });
        for (var i = 0, len = groups.length; i < len; i++) {
            var menuGroup = groups[i];
            if (menuGroup.id === this.parentMenuId) {
                result = menuGroup.items;
                break;
            }
            else {
                result = this.getItemsFilteredByParentId(menuGroup.items);
            }
        }
        return result;
    };
    OCardMenuLayoutComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-card-menu-layout',
                    template: "<div fxLayout=\"row wrap\" fxLayout.lt-md=\"column\" fxLayoutAlign=\"space-around center\" fxLayoutGap=\"0px\" fxLayoutGap.gt-sm=\"8px\" fxFill>\n  <ng-container *ngFor=\"let item of cardItems\">\n    <o-card-menu-item *ngIf=\"item['show-in-card-menu'] !== false\" button-text=\"CARD_MENU_LAYOUT.BUTTON_TEXT\" [route]=\"item.route\"\n      [title]=\"item.name\" [tooltip]=\"item.tooltip\" [icon]=\"item.icon\" [image]=\"item.image\" [detail-component]=\"item.component\"\n      [detail-component-inputs]=\"item['component-inputs']\" [ngClass]=\"item.class\">\n    </o-card-menu-item>\n  </ng-container>\n  <ng-content select=\"o-card-menu-item\"></ng-content>\n</div>\n",
                    inputs: DEFAULT_INPUTS_O_MENU_LAYOUT,
                    outputs: DEFAULT_OUTPUTS_O_MENU_LAYOUT,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-menu-layout]': 'true'
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".o-menu-layout{display:block;height:100%;width:100%}.o-menu-layout .o-card-menu-item{height:45%;margin:16px 0;max-width:290px;min-height:180px;min-width:290px}.o-menu-layout .o-card-menu-item.compact{height:30%;max-height:250px}"]
                }] }
    ];
    OCardMenuLayoutComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ChangeDetectorRef }
    ]; };
    return OCardMenuLayoutComponent;
}());
export { OCardMenuLayoutComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jYXJkLW1lbnUtbGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9jYXJkLW1lbnUtbGF5b3V0L28tY2FyZC1tZW51LWxheW91dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFFBQVEsRUFFUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR2pGLE1BQU0sQ0FBQyxJQUFNLDRCQUE0QixHQUFHO0lBQzFDLCtCQUErQjtDQUNoQyxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sNkJBQTZCLEdBQUcsRUFDNUMsQ0FBQztBQUVGO0lBcUJFLGtDQUNVLFFBQWtCLEVBQ2xCLEVBQXFCO1FBRi9CLGlCQVdDO1FBVlMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUU3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwRCxJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQztZQUNwRixLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLGtEQUFlLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLDhDQUFXLEdBQWxCO1FBQ0UsSUFBSSxJQUFJLENBQUMsNEJBQTRCLEVBQUU7WUFDckMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztJQUVNLG1EQUFnQixHQUF2QjtRQUFBLGlCQVNDO1FBUkMsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQXRDLENBQXNDLENBQUMsQ0FBQztTQUN0RjthQUFNO1lBQ0wsWUFBWSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztJQUNoQyxDQUFDO0lBRUQsc0JBQUksK0NBQVM7YUFBYjtZQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUM3QixDQUFDO2FBRUQsVUFBYyxHQUFtQjtZQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztZQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFCLENBQUM7OztPQUxBO0lBT1MsNkRBQTBCLEdBQXBDLFVBQXFDLEtBQXFCO1FBQTFELGlCQWNDO1FBYkMsSUFBSSxNQUFzQixDQUFDO1FBQzNCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1FBRTNFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakQsSUFBTSxTQUFTLEdBQUksTUFBTSxDQUFDLENBQUMsQ0FBZSxDQUFDO1lBQzNDLElBQUksU0FBUyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QyxNQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztnQkFDekIsTUFBTTthQUNQO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNEO1NBQ0Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOztnQkE5RUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7b0JBQzlCLHlxQkFBa0Q7b0JBRWxELE1BQU0sRUFBRSw0QkFBNEI7b0JBQ3BDLE9BQU8sRUFBRSw2QkFBNkI7b0JBQ3RDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osdUJBQXVCLEVBQUUsTUFBTTtxQkFDaEM7b0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2lCQUNoRDs7O2dCQTdCQyxRQUFRO2dCQUZSLGlCQUFpQjs7SUFvR25CLCtCQUFDO0NBQUEsQUFoRkQsSUFnRkM7U0FwRVksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBNZW51R3JvdXAgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2FwcC1tZW51LmludGVyZmFjZSc7XG5pbXBvcnQgeyBBcHBNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FwcC1tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBNZW51Um9vdEl0ZW0gfSBmcm9tICcuLi8uLi90eXBlcy9tZW51LXJvb3QtaXRlbS50eXBlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTUVOVV9MQVlPVVQgPSBbXG4gICdwYXJlbnRNZW51SWQgOiBwYXJlbnQtbWVudS1pZCdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19NRU5VX0xBWU9VVCA9IFtcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY2FyZC1tZW51LWxheW91dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWNhcmQtbWVudS1sYXlvdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWNhcmQtbWVudS1sYXlvdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX01FTlVfTEFZT1VULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19NRU5VX0xBWU9VVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1tZW51LWxheW91dF0nOiAndHJ1ZSdcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT0NhcmRNZW51TGF5b3V0Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBhcHBNZW51U2VydmljZTogQXBwTWVudVNlcnZpY2U7XG4gIHByb3RlY3RlZCBtZW51Um9vdHM6IE1lbnVSb290SXRlbVtdO1xuICBwcm90ZWN0ZWQgY2FyZEl0ZW1zQXJyYXk6IE1lbnVSb290SXRlbVtdO1xuICBwcm90ZWN0ZWQgcGFyZW50TWVudUlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMuYXBwTWVudVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChBcHBNZW51U2VydmljZSk7XG4gICAgdGhpcy5tZW51Um9vdHMgPSB0aGlzLmFwcE1lbnVTZXJ2aWNlLmdldE1lbnVSb290cygpO1xuXG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLm9uTGFuZ3VhZ2VDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRDYXJkTWVudUl0ZW1zKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMudHJhbnNsYXRlU2VydmljZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldENhcmRNZW51SXRlbXMoKTogdm9pZCB7XG4gICAgbGV0IGNhcmRJdGVtc0F1eCA9IFtdO1xuICAgIGlmICghdGhpcy5wYXJlbnRNZW51SWQpIHtcbiAgICAgIGNhcmRJdGVtc0F1eCA9IHRoaXMubWVudVJvb3RzLmZpbHRlcihpdGVtID0+ICF0aGlzLmFwcE1lbnVTZXJ2aWNlLmlzTWVudUdyb3VwKGl0ZW0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FyZEl0ZW1zQXV4ID0gdGhpcy5nZXRJdGVtc0ZpbHRlcmVkQnlQYXJlbnRJZCh0aGlzLm1lbnVSb290cyk7XG4gICAgfVxuXG4gICAgdGhpcy5jYXJkSXRlbXMgPSBjYXJkSXRlbXNBdXg7XG4gIH1cblxuICBnZXQgY2FyZEl0ZW1zKCk6IE1lbnVSb290SXRlbVtdIHtcbiAgICByZXR1cm4gdGhpcy5jYXJkSXRlbXNBcnJheTtcbiAgfVxuXG4gIHNldCBjYXJkSXRlbXModmFsOiBNZW51Um9vdEl0ZW1bXSkge1xuICAgIHRoaXMuY2FyZEl0ZW1zQXJyYXkgPSB2YWw7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0SXRlbXNGaWx0ZXJlZEJ5UGFyZW50SWQoYXJyYXk6IE1lbnVSb290SXRlbVtdKTogTWVudVJvb3RJdGVtW10ge1xuICAgIGxldCByZXN1bHQ6IE1lbnVSb290SXRlbVtdO1xuICAgIGNvbnN0IGdyb3VwcyA9IGFycmF5LmZpbHRlcihpdGVtID0+IHRoaXMuYXBwTWVudVNlcnZpY2UuaXNNZW51R3JvdXAoaXRlbSkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGdyb3Vwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgbWVudUdyb3VwID0gKGdyb3Vwc1tpXSBhcyBNZW51R3JvdXApO1xuICAgICAgaWYgKG1lbnVHcm91cC5pZCA9PT0gdGhpcy5wYXJlbnRNZW51SWQpIHtcbiAgICAgICAgcmVzdWx0ID0gbWVudUdyb3VwLml0ZW1zO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMuZ2V0SXRlbXNGaWx0ZXJlZEJ5UGFyZW50SWQobWVudUdyb3VwLml0ZW1zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG59XG4iXX0=