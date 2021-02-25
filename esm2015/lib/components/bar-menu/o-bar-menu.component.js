import { Component, ElementRef, Injector, ViewEncapsulation } from '@angular/core';
import { AppMenuService } from '../../services/app-menu.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
export const DEFAULT_INPUTS_O_BAR_MENU = [
    'menuTitle: title',
    'tooltip',
];
export class OBarMenuComponent {
    constructor(elRef, injector) {
        this.elRef = elRef;
        this.injector = injector;
        this.id = 'm_' + String((new Date()).getTime() + Math.random());
        this.permissionsService = this.injector.get(PermissionsService);
        this.translateService = this.injector.get(OTranslateService);
        this.appMenuService = this.injector.get(AppMenuService);
        this.menuRoots = this.appMenuService.getMenuRoots();
    }
    ngOnInit() {
        if (!this.tooltip) {
            this.tooltip = this.menuTitle;
        }
        if (this.translateService) {
            this.translateService.onLanguageChanged.subscribe(() => {
                this.setDOMTitle();
            });
            this.setDOMTitle();
        }
    }
    setDOMTitle() {
        const tooltip = this.translateService.get(this.tooltip);
        this.elRef.nativeElement.setAttribute('title', tooltip);
    }
    collapseAll() {
        const inputs = this.elRef.nativeElement.querySelectorAll('input');
        if (inputs) {
            inputs.forEach(element => {
                element.checked = false;
            });
        }
        const fakeLis = this.elRef.nativeElement.querySelectorAll('.fake-li-hover');
        if (fakeLis) {
            fakeLis.forEach(element => {
                element.classList.remove('fake-li-hover');
            });
        }
    }
    getPermissionsService() {
        return this.permissionsService;
    }
    get menuTitle() {
        return this._menuTitle;
    }
    set menuTitle(val) {
        this._menuTitle = val;
    }
    get tooltip() {
        return this._tooltip;
    }
    set tooltip(val) {
        this._tooltip = val;
    }
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    get menuItems() {
        return this.menuRoots;
    }
}
OBarMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-bar-menu',
                template: "<mat-toolbar color=\"primary\">\n  <nav>\n    <mat-icon class=\"mat-24 menu-icon toggle\" (click)=\"input.checked = !input.checked\" svgIcon=\"ontimize:menu\"></mat-icon>\n    <label [attr.for]=\"id\" class=\"toggle title-label\">{{ menuTitle | oTranslate }}</label>\n    <input #input [attr.id]=\"id\" type=\"checkbox\" />\n    <div class=\"fake-ul mat-primary menu\">\n      <ng-container>\n        <o-bar-menu-nested [items]=\"menuItems\"> </o-bar-menu-nested>\n      </ng-container>\n      <ng-content></ng-content>\n    </div>\n  </nav>\n</mat-toolbar>",
                inputs: DEFAULT_INPUTS_O_BAR_MENU,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-bar-menu]': 'true'
                },
                styles: [".o-bar-menu .toggle,.o-bar-menu input{display:none}.o-bar-menu nav{margin:0;padding:0}.o-bar-menu nav:after{content:\"\";display:table;clear:both}.o-bar-menu nav .fake-li a{cursor:pointer}.o-bar-menu nav .fake-ul{float:right;padding:0;margin:0;list-style:none;position:relative}.o-bar-menu nav .fake-ul.menu>.o-bar-menu-item .o-bar-menu-item-title{top:0;padding-left:0}.o-bar-menu nav .fake-ul .fake-li{margin:0;display:inline-block}.o-bar-menu nav .fake-ul .fake-ul{display:none;position:absolute;top:60px}.o-bar-menu nav .fake-ul .fake-ul .fake-li{min-width:250px;width:250px;float:none;display:list-item;position:relative;white-space:nowrap}.o-bar-menu nav .fake-ul .fake-ul .fake-ul{top:0}.o-bar-menu nav .fake-ul .fake-ul .fake-ul .fake-li{position:relative;top:0;left:0}.o-bar-menu nav a{display:flex;align-items:center;padding:0 20px;font-size:20px;line-height:60px;text-decoration:none}.o-bar-menu .fake-li>a:only-child:after{content:''}@media all and (min-width:768px){.o-bar-menu nav .fake-ul .fake-li-hover>.fake-ul{display:inline-block;z-index:1000}.o-bar-menu nav .fake-ul .fake-ul .fake-li-hover>.fake-ul{display:inline-block;z-index:1000;left:250px}}@media all and (max-width:767px){.o-bar-menu .mat-toolbar{height:auto!important}.o-bar-menu nav{margin:10px 0;width:100%}.o-bar-menu nav .o-bar-menu-group,.o-bar-menu nav .o-bar-menu-item,.o-bar-menu nav .o-bar-menu-separator,.o-bar-menu nav .o-locale-bar-menu-item{display:flex}.o-bar-menu nav .o-bar-menu-group .mat-list-item,.o-bar-menu nav .o-bar-menu-item .mat-list-item,.o-bar-menu nav .o-bar-menu-separator .mat-list-item,.o-bar-menu nav .o-locale-bar-menu-item .mat-list-item{display:flex;justify-content:flex-start;align-items:center}.o-bar-menu nav .fake-ul,.o-bar-menu nav .fake-ul .fake-li{width:100%}.o-bar-menu nav .fake-ul .fake-ul{float:none;position:static;width:100%}.o-bar-menu nav .fake-ul .fake-ul .fake-li{padding-left:20px;width:100%}.o-bar-menu nav .fake-ul .fake-ul .mat-elevation-z4{box-shadow:none}.o-bar-menu .toggle{display:inline-block;padding:0 20px;font-size:20px;line-height:60px;text-decoration:none;border:none;cursor:pointer}.o-bar-menu .toggle+a{display:none!important}.o-bar-menu .menu{display:none;float:left!important}.o-bar-menu label.title-label{display:inline-block}.o-bar-menu .mat-icon.menu-icon{vertical-align:middle;display:inline-block;line-height:1;padding:0 4px}.o-bar-menu input:checked+.fake-ul{display:block}}@media all and (max-width:330px){.o-bar-menu nav .fake-ul .fake-li{width:94%}}"]
            }] }
];
OBarMenuComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvby1iYXItbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFVLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNwRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUdqRixNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBRztJQUV2QyxrQkFBa0I7SUFFbEIsU0FBUztDQUNWLENBQUM7QUFZRixNQUFNLE9BQU8saUJBQWlCO0lBVzVCLFlBQ1ksS0FBaUIsRUFDakIsUUFBa0I7UUFEbEIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQzVCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBR00sUUFBUTtRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUMvQjtRQUNELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUNyRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3ZCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzVFLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxxQkFBcUI7UUFDbkIsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxTQUFTLENBQUMsR0FBVztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxHQUFXO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFDSixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQUksRUFBRSxDQUFDLEdBQVc7UUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDOzs7WUE5RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0Qix5akJBQTBDO2dCQUUxQyxNQUFNLEVBQUUseUJBQXlCO2dCQUNqQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLG9CQUFvQixFQUFFLE1BQU07aUJBQzdCOzthQUNGOzs7WUF2Qm1CLFVBQVU7WUFBRSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3RvciwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBcHBNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FwcC1tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE1lbnVSb290SXRlbSB9IGZyb20gJy4uLy4uL3R5cGVzL21lbnUtcm9vdC1pdGVtLnR5cGUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19CQVJfTUVOVSA9IFtcbiAgLy8gdGl0bGUgW3N0cmluZ106IG1lbnUgdGl0bGUuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnbWVudVRpdGxlOiB0aXRsZScsXG4gIC8vIHRvb2x0aXAgW3N0cmluZ106IG1lbnUgdG9vbHRpcC4gRGVmYXVsdDogJ3RpdGxlJyB2YWx1ZS5cbiAgJ3Rvb2x0aXAnLFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1iYXItbWVudScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWJhci1tZW51LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1iYXItbWVudS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQkFSX01FTlUsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYmFyLW1lbnVdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Jhck1lbnVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uc1NlcnZpY2U6IFBlcm1pc3Npb25zU2VydmljZTtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcml2YXRlIGFwcE1lbnVTZXJ2aWNlOiBBcHBNZW51U2VydmljZTtcbiAgcHJpdmF0ZSBtZW51Um9vdHM6IE1lbnVSb290SXRlbVtdO1xuXG4gIHByb3RlY3RlZCBfbWVudVRpdGxlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfdG9vbHRpcDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2lkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLmlkID0gJ21fJyArIFN0cmluZygobmV3IERhdGUoKSkuZ2V0VGltZSgpICsgTWF0aC5yYW5kb20oKSk7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLmFwcE1lbnVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoQXBwTWVudVNlcnZpY2UpO1xuICAgIHRoaXMubWVudVJvb3RzID0gdGhpcy5hcHBNZW51U2VydmljZS5nZXRNZW51Um9vdHMoKTtcbiAgfVxuXG5cbiAgcHVibGljIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLm1lbnVUaXRsZTtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJhbnNsYXRlU2VydmljZSkge1xuICAgICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlLm9uTGFuZ3VhZ2VDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RE9NVGl0bGUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zZXRET01UaXRsZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNldERPTVRpdGxlKCkge1xuICAgIGNvbnN0IHRvb2x0aXAgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KHRoaXMudG9vbHRpcCk7XG4gICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnNldEF0dHJpYnV0ZSgndGl0bGUnLCB0b29sdGlwKTtcbiAgfVxuXG4gIGNvbGxhcHNlQWxsKCkge1xuICAgIGNvbnN0IGlucHV0cyA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgIGlmIChpbnB1dHMpIHtcbiAgICAgIGlucHV0cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBmYWtlTGlzID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mYWtlLWxpLWhvdmVyJyk7XG4gICAgaWYgKGZha2VMaXMpIHtcbiAgICAgIGZha2VMaXMuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdmYWtlLWxpLWhvdmVyJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRQZXJtaXNzaW9uc1NlcnZpY2UoKTogUGVybWlzc2lvbnNTZXJ2aWNlIHtcbiAgICByZXR1cm4gdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2U7XG4gIH1cblxuICBnZXQgbWVudVRpdGxlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21lbnVUaXRsZTtcbiAgfVxuXG4gIHNldCBtZW51VGl0bGUodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9tZW51VGl0bGUgPSB2YWw7XG4gIH1cblxuICBnZXQgdG9vbHRpcCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl90b29sdGlwO1xuICB9XG5cbiAgc2V0IHRvb2x0aXAodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90b29sdGlwID0gdmFsO1xuICB9XG5cbiAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgc2V0IGlkKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWQgPSB2YWw7XG4gIH1cblxuICBnZXQgbWVudUl0ZW1zKCk6IE1lbnVSb290SXRlbVtdIHtcbiAgICByZXR1cm4gdGhpcy5tZW51Um9vdHM7XG4gIH1cbn1cbiJdfQ==