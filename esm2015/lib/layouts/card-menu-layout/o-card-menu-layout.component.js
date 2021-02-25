import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewEncapsulation, } from '@angular/core';
import { AppMenuService } from '../../services/app-menu.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
export const DEFAULT_INPUTS_O_MENU_LAYOUT = [
    'parentMenuId : parent-menu-id'
];
export const DEFAULT_OUTPUTS_O_MENU_LAYOUT = [];
export class OCardMenuLayoutComponent {
    constructor(injector, cd) {
        this.injector = injector;
        this.cd = cd;
        this.translateService = this.injector.get(OTranslateService);
        this.appMenuService = this.injector.get(AppMenuService);
        this.menuRoots = this.appMenuService.getMenuRoots();
        this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
            this.cd.detectChanges();
        });
    }
    ngAfterViewInit() {
        this.setCardMenuItems();
    }
    ngOnDestroy() {
        if (this.translateServiceSubscription) {
            this.translateServiceSubscription.unsubscribe();
        }
    }
    setCardMenuItems() {
        let cardItemsAux = [];
        if (!this.parentMenuId) {
            cardItemsAux = this.menuRoots.filter(item => !this.appMenuService.isMenuGroup(item));
        }
        else {
            cardItemsAux = this.getItemsFilteredByParentId(this.menuRoots);
        }
        this.cardItems = cardItemsAux;
    }
    get cardItems() {
        return this.cardItemsArray;
    }
    set cardItems(val) {
        this.cardItemsArray = val;
        this.cd.detectChanges();
    }
    getItemsFilteredByParentId(array) {
        let result;
        const groups = array.filter(item => this.appMenuService.isMenuGroup(item));
        for (let i = 0, len = groups.length; i < len; i++) {
            const menuGroup = groups[i];
            if (menuGroup.id === this.parentMenuId) {
                result = menuGroup.items;
                break;
            }
            else {
                result = this.getItemsFilteredByParentId(menuGroup.items);
            }
        }
        return result;
    }
}
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
OCardMenuLayoutComponent.ctorParameters = () => [
    { type: Injector },
    { type: ChangeDetectorRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jYXJkLW1lbnUtbGF5b3V0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9jYXJkLW1lbnUtbGF5b3V0L28tY2FyZC1tZW51LWxheW91dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFFBQVEsRUFFUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFJdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR2pGLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBQzFDLCtCQUErQjtDQUNoQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsRUFDNUMsQ0FBQztBQWNGLE1BQU0sT0FBTyx3QkFBd0I7SUFTbkMsWUFDVSxRQUFrQixFQUNsQixFQUFxQjtRQURyQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBRTdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXBELElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN6RixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLGVBQWU7UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVNLFdBQVc7UUFDaEIsSUFBSSxJQUFJLENBQUMsNEJBQTRCLEVBQUU7WUFDckMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3RGO2FBQU07WUFDTCxZQUFZLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNoRTtRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLEdBQW1CO1FBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1FBQzFCLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVTLDBCQUEwQixDQUFDLEtBQXFCO1FBQ3hELElBQUksTUFBc0IsQ0FBQztRQUMzQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUUzRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELE1BQU0sU0FBUyxHQUFJLE1BQU0sQ0FBQyxDQUFDLENBQWUsQ0FBQztZQUMzQyxJQUFJLFNBQVMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3pCLE1BQU07YUFDUDtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUMzRDtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7O1lBOUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5Qix5cUJBQWtEO2dCQUVsRCxNQUFNLEVBQUUsNEJBQTRCO2dCQUNwQyxPQUFPLEVBQUUsNkJBQTZCO2dCQUN0QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLHVCQUF1QixFQUFFLE1BQU07aUJBQ2hDO2dCQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOzthQUNoRDs7O1lBN0JDLFFBQVE7WUFGUixpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE1lbnVHcm91cCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvYXBwLW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IEFwcE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXBwLW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1lbnVSb290SXRlbSB9IGZyb20gJy4uLy4uL3R5cGVzL21lbnUtcm9vdC1pdGVtLnR5cGUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19NRU5VX0xBWU9VVCA9IFtcbiAgJ3BhcmVudE1lbnVJZCA6IHBhcmVudC1tZW51LWlkJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX01FTlVfTEFZT1VUID0gW1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jYXJkLW1lbnUtbGF5b3V0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tY2FyZC1tZW51LWxheW91dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tY2FyZC1tZW51LWxheW91dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTUVOVV9MQVlPVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX01FTlVfTEFZT1VULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLW1lbnUtbGF5b3V0XSc6ICd0cnVlJ1xuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBPQ2FyZE1lbnVMYXlvdXRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGFwcE1lbnVTZXJ2aWNlOiBBcHBNZW51U2VydmljZTtcbiAgcHJvdGVjdGVkIG1lbnVSb290czogTWVudVJvb3RJdGVtW107XG4gIHByb3RlY3RlZCBjYXJkSXRlbXNBcnJheTogTWVudVJvb3RJdGVtW107XG4gIHByb3RlY3RlZCBwYXJlbnRNZW51SWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5hcHBNZW51U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcE1lbnVTZXJ2aWNlKTtcbiAgICB0aGlzLm1lbnVSb290cyA9IHRoaXMuYXBwTWVudVNlcnZpY2UuZ2V0TWVudVJvb3RzKCk7XG5cbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2VTdWJzY3JpcHRpb24gPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2Uub25MYW5ndWFnZUNoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldENhcmRNZW51SXRlbXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0Q2FyZE1lbnVJdGVtcygpOiB2b2lkIHtcbiAgICBsZXQgY2FyZEl0ZW1zQXV4ID0gW107XG4gICAgaWYgKCF0aGlzLnBhcmVudE1lbnVJZCkge1xuICAgICAgY2FyZEl0ZW1zQXV4ID0gdGhpcy5tZW51Um9vdHMuZmlsdGVyKGl0ZW0gPT4gIXRoaXMuYXBwTWVudVNlcnZpY2UuaXNNZW51R3JvdXAoaXRlbSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXJkSXRlbXNBdXggPSB0aGlzLmdldEl0ZW1zRmlsdGVyZWRCeVBhcmVudElkKHRoaXMubWVudVJvb3RzKTtcbiAgICB9XG5cbiAgICB0aGlzLmNhcmRJdGVtcyA9IGNhcmRJdGVtc0F1eDtcbiAgfVxuXG4gIGdldCBjYXJkSXRlbXMoKTogTWVudVJvb3RJdGVtW10ge1xuICAgIHJldHVybiB0aGlzLmNhcmRJdGVtc0FycmF5O1xuICB9XG5cbiAgc2V0IGNhcmRJdGVtcyh2YWw6IE1lbnVSb290SXRlbVtdKSB7XG4gICAgdGhpcy5jYXJkSXRlbXNBcnJheSA9IHZhbDtcbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRJdGVtc0ZpbHRlcmVkQnlQYXJlbnRJZChhcnJheTogTWVudVJvb3RJdGVtW10pOiBNZW51Um9vdEl0ZW1bXSB7XG4gICAgbGV0IHJlc3VsdDogTWVudVJvb3RJdGVtW107XG4gICAgY29uc3QgZ3JvdXBzID0gYXJyYXkuZmlsdGVyKGl0ZW0gPT4gdGhpcy5hcHBNZW51U2VydmljZS5pc01lbnVHcm91cChpdGVtKSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZ3JvdXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBtZW51R3JvdXAgPSAoZ3JvdXBzW2ldIGFzIE1lbnVHcm91cCk7XG4gICAgICBpZiAobWVudUdyb3VwLmlkID09PSB0aGlzLnBhcmVudE1lbnVJZCkge1xuICAgICAgICByZXN1bHQgPSBtZW51R3JvdXAuaXRlbXM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5nZXRJdGVtc0ZpbHRlcmVkQnlQYXJlbnRJZChtZW51R3JvdXAuaXRlbXMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbn1cbiJdfQ==