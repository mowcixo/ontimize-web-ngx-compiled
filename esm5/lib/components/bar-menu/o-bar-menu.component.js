import { Component, ElementRef, Injector, ViewEncapsulation } from '@angular/core';
import { AppMenuService } from '../../services/app-menu.service';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
export var DEFAULT_INPUTS_O_BAR_MENU = [
    'menuTitle: title',
    'tooltip',
];
var OBarMenuComponent = (function () {
    function OBarMenuComponent(elRef, injector) {
        this.elRef = elRef;
        this.injector = injector;
        this.id = 'm_' + String((new Date()).getTime() + Math.random());
        this.permissionsService = this.injector.get(PermissionsService);
        this.translateService = this.injector.get(OTranslateService);
        this.appMenuService = this.injector.get(AppMenuService);
        this.menuRoots = this.appMenuService.getMenuRoots();
    }
    OBarMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.tooltip) {
            this.tooltip = this.menuTitle;
        }
        if (this.translateService) {
            this.translateService.onLanguageChanged.subscribe(function () {
                _this.setDOMTitle();
            });
            this.setDOMTitle();
        }
    };
    OBarMenuComponent.prototype.setDOMTitle = function () {
        var tooltip = this.translateService.get(this.tooltip);
        this.elRef.nativeElement.setAttribute('title', tooltip);
    };
    OBarMenuComponent.prototype.collapseAll = function () {
        var inputs = this.elRef.nativeElement.querySelectorAll('input');
        if (inputs) {
            inputs.forEach(function (element) {
                element.checked = false;
            });
        }
        var fakeLis = this.elRef.nativeElement.querySelectorAll('.fake-li-hover');
        if (fakeLis) {
            fakeLis.forEach(function (element) {
                element.classList.remove('fake-li-hover');
            });
        }
    };
    OBarMenuComponent.prototype.getPermissionsService = function () {
        return this.permissionsService;
    };
    Object.defineProperty(OBarMenuComponent.prototype, "menuTitle", {
        get: function () {
            return this._menuTitle;
        },
        set: function (val) {
            this._menuTitle = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBarMenuComponent.prototype, "tooltip", {
        get: function () {
            return this._tooltip;
        },
        set: function (val) {
            this._tooltip = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBarMenuComponent.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (val) {
            this._id = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBarMenuComponent.prototype, "menuItems", {
        get: function () {
            return this.menuRoots;
        },
        enumerable: true,
        configurable: true
    });
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
    OBarMenuComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OBarMenuComponent;
}());
export { OBarMenuComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXItbWVudS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYmFyLW1lbnUvby1iYXItbWVudS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFVLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNqRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUNwRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUdqRixNQUFNLENBQUMsSUFBTSx5QkFBeUIsR0FBRztJQUV2QyxrQkFBa0I7SUFFbEIsU0FBUztDQUNWLENBQUM7QUFFRjtJQXFCRSwyQkFDWSxLQUFpQixFQUNqQixRQUFrQjtRQURsQixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDNUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFHTSxvQ0FBUSxHQUFmO1FBQUEsaUJBVUM7UUFUQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDL0I7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDO2dCQUNoRCxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsdUNBQVcsR0FBWDtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELHVDQUFXLEdBQVg7UUFDRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUNwQixPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM1RSxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO2dCQUNyQixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELGlEQUFxQixHQUFyQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRCxzQkFBSSx3Q0FBUzthQUFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3pCLENBQUM7YUFFRCxVQUFjLEdBQVc7WUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFDeEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSxzQ0FBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFFRCxVQUFZLEdBQVc7WUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDdEIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSxpQ0FBRTthQUFOO1lBQ0UsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2xCLENBQUM7YUFFRCxVQUFPLEdBQVc7WUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDakIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSx3Q0FBUzthQUFiO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3hCLENBQUM7OztPQUFBOztnQkE5RkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0Qix5akJBQTBDO29CQUUxQyxNQUFNLEVBQUUseUJBQXlCO29CQUNqQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLG9CQUFvQixFQUFFLE1BQU07cUJBQzdCOztpQkFDRjs7O2dCQXZCbUIsVUFBVTtnQkFBRSxRQUFROztJQTZHeEMsd0JBQUM7Q0FBQSxBQS9GRCxJQStGQztTQXJGWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEFwcE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYXBwLW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTWVudVJvb3RJdGVtIH0gZnJvbSAnLi4vLi4vdHlwZXMvbWVudS1yb290LWl0ZW0udHlwZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JBUl9NRU5VID0gW1xuICAvLyB0aXRsZSBbc3RyaW5nXTogbWVudSB0aXRsZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdtZW51VGl0bGU6IHRpdGxlJyxcbiAgLy8gdG9vbHRpcCBbc3RyaW5nXTogbWVudSB0b29sdGlwLiBEZWZhdWx0OiAndGl0bGUnIHZhbHVlLlxuICAndG9vbHRpcCcsXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWJhci1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYmFyLW1lbnUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWJhci1tZW51LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19CQVJfTUVOVSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1iYXItbWVudV0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQmFyTWVudUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zU2VydmljZTogUGVybWlzc2lvbnNTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByaXZhdGUgYXBwTWVudVNlcnZpY2U6IEFwcE1lbnVTZXJ2aWNlO1xuICBwcml2YXRlIG1lbnVSb290czogTWVudVJvb3RJdGVtW107XG5cbiAgcHJvdGVjdGVkIF9tZW51VGl0bGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIF90b29sdGlwOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfaWQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMuaWQgPSAnbV8nICsgU3RyaW5nKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKTtcbiAgICB0aGlzLnBlcm1pc3Npb25zU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFBlcm1pc3Npb25zU2VydmljZSk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMuYXBwTWVudVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChBcHBNZW51U2VydmljZSk7XG4gICAgdGhpcy5tZW51Um9vdHMgPSB0aGlzLmFwcE1lbnVTZXJ2aWNlLmdldE1lbnVSb290cygpO1xuICB9XG5cblxuICBwdWJsaWMgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IHRoaXMubWVudVRpdGxlO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2Uub25MYW5ndWFnZUNoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRET01UaXRsZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNldERPTVRpdGxlKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0RE9NVGl0bGUoKSB7XG4gICAgY29uc3QgdG9vbHRpcCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy50b29sdGlwKTtcbiAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aXRsZScsIHRvb2x0aXApO1xuICB9XG5cbiAgY29sbGFwc2VBbGwoKSB7XG4gICAgY29uc3QgaW5wdXRzID0gdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XG4gICAgaWYgKGlucHV0cykge1xuICAgICAgaW5wdXRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIGVsZW1lbnQuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGZha2VMaXMgPSB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZha2UtbGktaG92ZXInKTtcbiAgICBpZiAoZmFrZUxpcykge1xuICAgICAgZmFrZUxpcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Zha2UtbGktaG92ZXInKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFBlcm1pc3Npb25zU2VydmljZSgpOiBQZXJtaXNzaW9uc1NlcnZpY2Uge1xuICAgIHJldHVybiB0aGlzLnBlcm1pc3Npb25zU2VydmljZTtcbiAgfVxuXG4gIGdldCBtZW51VGl0bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWVudVRpdGxlO1xuICB9XG5cbiAgc2V0IG1lbnVUaXRsZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX21lbnVUaXRsZSA9IHZhbDtcbiAgfVxuXG4gIGdldCB0b29sdGlwKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Rvb2x0aXA7XG4gIH1cblxuICBzZXQgdG9vbHRpcCh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX3Rvb2x0aXAgPSB2YWw7XG4gIH1cblxuICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cblxuICBzZXQgaWQodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pZCA9IHZhbDtcbiAgfVxuXG4gIGdldCBtZW51SXRlbXMoKTogTWVudVJvb3RJdGVtW10ge1xuICAgIHJldHVybiB0aGlzLm1lbnVSb290cztcbiAgfVxufVxuIl19