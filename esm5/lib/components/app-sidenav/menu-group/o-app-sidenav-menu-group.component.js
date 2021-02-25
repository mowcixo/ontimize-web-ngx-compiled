import * as tslib_1 from "tslib";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { AppMenuService } from '../../../services/app-menu.service';
import { PermissionsService } from '../../../services/permissions/permissions.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { PermissionsUtils } from '../../../util/permissions';
import { Util } from '../../../util/util';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
export var DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = [
    'menuGroup : menu-group',
    'sidenavOpened : sidenav-opened'
];
export var DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = [
    'onItemClick'
];
var OAppSidenavMenuGroupComponent = (function () {
    function OAppSidenavMenuGroupComponent(injector, elRef, cd) {
        this.injector = injector;
        this.elRef = elRef;
        this.cd = cd;
        this.onItemClick = new EventEmitter();
        this.sidenavOpened = true;
        this.translateService = this.injector.get(OTranslateService);
        this.appMenuService = this.injector.get(AppMenuService);
        this.permissionsService = this.injector.get(PermissionsService);
        this.sidenav = this.injector.get(OAppSidenavComponent);
    }
    OAppSidenavMenuGroupComponent.prototype.ngOnInit = function () {
        this.parsePermissions();
    };
    OAppSidenavMenuGroupComponent.prototype.ngAfterViewInit = function () {
        if (this.menuGroup.id === 'user-info' && this.sidenav) {
            var self_1 = this;
            this.sidenavSubscription = this.sidenav.onSidenavOpenedChange.subscribe(function (opened) {
                self_1.disabled = ((!opened && Util.isDefined(opened)) || (Util.isDefined(self_1.permissions) && self_1.permissions && self_1.permissions.enabled === false));
                self_1.updateContentExpansion();
                self_1.cd.markForCheck();
            });
        }
        this.updateContentExpansion();
    };
    OAppSidenavMenuGroupComponent.prototype.ngOnDestroy = function () {
        if (this.sidenavSubscription) {
            this.sidenavSubscription.unsubscribe();
        }
    };
    OAppSidenavMenuGroupComponent.prototype.parsePermissions = function () {
        this.permissions = this.permissionsService.getMenuPermissions(this.menuGroup.id);
        if (!Util.isDefined(this.permissions)) {
            return;
        }
        this.hidden = this.permissions.visible === false;
        this.disabled = this.permissions.enabled === false;
        if (this.disabled) {
            this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.elRef.nativeElement, {
                checkStringValue: true
            });
        }
    };
    OAppSidenavMenuGroupComponent.prototype.onClick = function () {
        if (this.disabled) {
            return;
        }
        this.menuGroup.opened = !this.menuGroup.opened;
        this.updateContentExpansion();
    };
    OAppSidenavMenuGroupComponent.prototype.updateContentExpansion = function () {
        var isOpened = this.menuGroup && this.menuGroup.opened;
        if (this.menuGroup.id === 'user-info') {
            isOpened = (this.sidenav && this.sidenav.sidenav && this.sidenav.sidenav.opened) && isOpened;
        }
        this.contentExpansion = isOpened ? 'expanded' : 'collapsed';
    };
    Object.defineProperty(OAppSidenavMenuGroupComponent.prototype, "contentExpansion", {
        get: function () {
            return this._contentExpansion;
        },
        set: function (val) {
            this._contentExpansion = val;
            this.cd.detectChanges();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OAppSidenavMenuGroupComponent.prototype, "tooltip", {
        get: function () {
            var result = this.translateService.get(this.menuGroup.name);
            if (Util.isDefined(this.menuGroup.tooltip)) {
                result += ': ' + this.translateService.get(this.menuGroup.tooltip);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    OAppSidenavMenuGroupComponent.prototype.onMenuItemClick = function (e) {
        this.onItemClick.emit(e);
    };
    OAppSidenavMenuGroupComponent.prototype.getClass = function () {
        var className = 'o-app-sidenav-menu-group';
        if (this.menuGroup.class) {
            className += ' ' + this.menuGroup.class;
        }
        return className;
    };
    OAppSidenavMenuGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-app-sidenav-menu-group',
                    inputs: DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP,
                    outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP,
                    template: "<ng-container *ngIf=\"!hidden\">\n  <button type=\"button\" mat-button class=\"o-app-sidenav-item o-app-sidenav-menugroup\" [class.active]=\"menuGroup.opened\"\n    fxLayout=\"column\" (click)=\"onClick()\">\n    <div fxLayout=\"row\" fxLayoutAlign=\"start center\" fxFill>\n      <ng-container *ngIf=\"sidenavOpened\">\n        <mat-icon *ngIf=\"menuGroup.icon\">{{ menuGroup.icon }}</mat-icon>\n        <h3>{{ menuGroup.name | oTranslate }}</h3>\n        <span class=\"fill-remaining\"></span>\n        <mat-icon class=\"o-app-sidenav-menugroup-arrow\" svgIcon=\"ontimize:keyboard_arrow_right\"></mat-icon>\n      </ng-container>\n      <ng-container *ngIf=\"!sidenavOpened\">\n        <mat-icon [matTooltip]=\"tooltip\" matTooltipClass=\"menugroup-tooltip\" matTooltipPosition=\"right\" *ngIf=\"menuGroup.icon\">{{\n          menuGroup.icon }}</mat-icon>\n      </ng-container>\n    </div>\n  </button>\n\n  <div class=\"o-app-sidenav-menugroup-items-container\">\n    <ul [@contentExpansion]=\"contentExpansion\" class=\"o-app-sidenav-menugroup-ul\">\n      <ng-container *ngFor=\"let menuItem of menuGroup.items\">\n        <o-app-sidenav-menu-item [sidenav-opened]=\"sidenavOpened\" [disabled]=\"disabled\" [menu-item]=\"menuItem\"\n          [menu-item-type]=\"appMenuService.getMenuItemType(menuItem)\" (onClick)=\"onMenuItemClick($event)\">\n        </o-app-sidenav-menu-item>\n      </ng-container>\n    </ul>\n  </div>\n</ng-container>",
                    encapsulation: ViewEncapsulation.None,
                    animations: [
                        trigger('contentExpansion', [
                            state('collapsed', style({ height: '0px' })),
                            state('expanded', style({ height: '*' })),
                            transition('collapsed => expanded', animate('200ms ease-in')),
                            transition('expanded => collapsed', animate('200ms ease-out'))
                        ])
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class]': 'getClass()',
                        '[attr.disabled]': 'disabled'
                    },
                    styles: [".o-app-sidenav-menu-group .o-app-sidenav-menugroup{width:100%}.o-app-sidenav-menu-group .o-app-sidenav-menugroup.mat-button{min-width:0}.o-app-sidenav-menu-group[disabled=true] .o-app-sidenav-menugroup{cursor:default}.o-app-sidenav-menu-group .mat-tooltip.menugroup-tooltip{margin-left:28px}"]
                }] }
    ];
    OAppSidenavMenuGroupComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: ChangeDetectorRef }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OAppSidenavMenuGroupComponent.prototype, "sidenavOpened", void 0);
    return OAppSidenavMenuGroupComponent;
}());
export { OAppSidenavMenuGroupComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi1tZW51LWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9hcHAtc2lkZW5hdi9tZW51LWdyb3VwL28tYXBwLXNpZGVuYXYtbWVudS1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUdSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRXBGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVsRSxNQUFNLENBQUMsSUFBTSx1Q0FBdUMsR0FBRztJQUNyRCx3QkFBd0I7SUFDeEIsZ0NBQWdDO0NBQ2pDLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSx3Q0FBd0MsR0FBRztJQUN0RCxhQUFhO0NBQ2QsQ0FBQztBQUVGO0lBMkNFLHVDQUNZLFFBQWtCLEVBQ2xCLEtBQWlCLEVBQ2pCLEVBQXFCO1FBRnJCLGFBQVEsR0FBUixR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QztTQXBIWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgTWVudUdyb3VwIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9hcHAtbWVudS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQXBwTWVudVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9hcHAtbWVudS5zZXJ2aWNlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3Blcm1pc3Npb25zL3Blcm1pc3Npb25zLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQXBwU2lkZW5hdkNvbXBvbmVudCB9IGZyb20gJy4uL28tYXBwLXNpZGVuYXYuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQVBQX1NJREVOQVZfTUVOVV9HUk9VUCA9IFtcbiAgJ21lbnVHcm91cCA6IG1lbnUtZ3JvdXAnLFxuICAnc2lkZW5hdk9wZW5lZCA6IHNpZGVuYXYtb3BlbmVkJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0FQUF9TSURFTkFWX01FTlVfR1JPVVAgPSBbXG4gICdvbkl0ZW1DbGljaydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYXBwLXNpZGVuYXYtbWVudS1ncm91cCcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19BUFBfU0lERU5BVl9NRU5VX0dST1VQLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19BUFBfU0lERU5BVl9NRU5VX0dST1VQLFxuICB0ZW1wbGF0ZVVybDogJy4vby1hcHAtc2lkZW5hdi1tZW51LWdyb3VwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1hcHAtc2lkZW5hdi1tZW51LWdyb3VwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdjb250ZW50RXhwYW5zaW9uJywgW1xuICAgICAgc3RhdGUoJ2NvbGxhcHNlZCcsIHN0eWxlKHsgaGVpZ2h0OiAnMHB4JyB9KSksXG4gICAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7IGhlaWdodDogJyonIH0pKSxcbiAgICAgIHRyYW5zaXRpb24oJ2NvbGxhcHNlZCA9PiBleHBhbmRlZCcsIGFuaW1hdGUoJzIwMG1zIGVhc2UtaW4nKSksXG4gICAgICB0cmFuc2l0aW9uKCdleHBhbmRlZCA9PiBjb2xsYXBzZWQnLCBhbmltYXRlKCcyMDBtcyBlYXNlLW91dCcpKVxuICAgIF0pXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOiAnZ2V0Q2xhc3MoKScsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICdkaXNhYmxlZCdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQXBwU2lkZW5hdk1lbnVHcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgb25JdGVtQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG5cbiAgYXBwTWVudVNlcnZpY2U6IEFwcE1lbnVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgc2lkZW5hdjogT0FwcFNpZGVuYXZDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBzaWRlbmF2U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zO1xuICBwcm90ZWN0ZWQgbXV0YXRpb25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcblxuICBwdWJsaWMgbWVudUdyb3VwOiBNZW51R3JvdXA7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgc2lkZW5hdk9wZW5lZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgaGlkZGVuOiBib29sZWFuO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9jb250ZW50RXhwYW5zaW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMuYXBwTWVudVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChBcHBNZW51U2VydmljZSk7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuXG4gICAgdGhpcy5zaWRlbmF2ID0gdGhpcy5pbmplY3Rvci5nZXQoT0FwcFNpZGVuYXZDb21wb25lbnQpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5wYXJzZVBlcm1pc3Npb25zKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMubWVudUdyb3VwLmlkID09PSAndXNlci1pbmZvJyAmJiB0aGlzLnNpZGVuYXYpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5zaWRlbmF2U3Vic2NyaXB0aW9uID0gdGhpcy5zaWRlbmF2Lm9uU2lkZW5hdk9wZW5lZENoYW5nZS5zdWJzY3JpYmUoKG9wZW5lZCkgPT4ge1xuICAgICAgICBzZWxmLmRpc2FibGVkID0gKCghb3BlbmVkICYmIFV0aWwuaXNEZWZpbmVkKG9wZW5lZCkpIHx8IChVdGlsLmlzRGVmaW5lZChzZWxmLnBlcm1pc3Npb25zKSAmJiBzZWxmLnBlcm1pc3Npb25zICYmIHNlbGYucGVybWlzc2lvbnMuZW5hYmxlZCA9PT0gZmFsc2UpKTtcbiAgICAgICAgc2VsZi51cGRhdGVDb250ZW50RXhwYW5zaW9uKCk7XG4gICAgICAgIHNlbGYuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVDb250ZW50RXhwYW5zaW9uKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zaWRlbmF2U3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNpZGVuYXZTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VQZXJtaXNzaW9ucygpIHtcbiAgICAvLyBpZiBvYXR0ciBpbiBmb3JtLCBpdCBjYW4gaGF2ZSBwZXJtaXNzaW9uc1xuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnBlcm1pc3Npb25zU2VydmljZS5nZXRNZW51UGVybWlzc2lvbnModGhpcy5tZW51R3JvdXAuaWQpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5oaWRkZW4gPSB0aGlzLnBlcm1pc3Npb25zLnZpc2libGUgPT09IGZhbHNlO1xuICAgIHRoaXMuZGlzYWJsZWQgPSB0aGlzLnBlcm1pc3Npb25zLmVuYWJsZWQgPT09IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlciA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbSh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgICAgY2hlY2tTdHJpbmdWYWx1ZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm1lbnVHcm91cC5vcGVuZWQgPSAhdGhpcy5tZW51R3JvdXAub3BlbmVkO1xuICAgIHRoaXMudXBkYXRlQ29udGVudEV4cGFuc2lvbigpO1xuICB9XG5cbiAgdXBkYXRlQ29udGVudEV4cGFuc2lvbigpIHtcbiAgICBsZXQgaXNPcGVuZWQgPSB0aGlzLm1lbnVHcm91cCAmJiB0aGlzLm1lbnVHcm91cC5vcGVuZWQ7XG4gICAgaWYgKHRoaXMubWVudUdyb3VwLmlkID09PSAndXNlci1pbmZvJykge1xuICAgICAgaXNPcGVuZWQgPSAodGhpcy5zaWRlbmF2ICYmIHRoaXMuc2lkZW5hdi5zaWRlbmF2ICYmIHRoaXMuc2lkZW5hdi5zaWRlbmF2Lm9wZW5lZCkgJiYgaXNPcGVuZWQ7XG4gICAgfVxuICAgIHRoaXMuY29udGVudEV4cGFuc2lvbiA9IGlzT3BlbmVkID8gJ2V4cGFuZGVkJyA6ICdjb2xsYXBzZWQnO1xuICB9XG5cbiAgZ2V0IGNvbnRlbnRFeHBhbnNpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudEV4cGFuc2lvbjtcbiAgfVxuXG4gIHNldCBjb250ZW50RXhwYW5zaW9uKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fY29udGVudEV4cGFuc2lvbiA9IHZhbDtcbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGdldCB0b29sdGlwKCkge1xuICAgIGxldCByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KHRoaXMubWVudUdyb3VwLm5hbWUpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1lbnVHcm91cC50b29sdGlwKSkge1xuICAgICAgcmVzdWx0ICs9ICc6ICcgKyB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KHRoaXMubWVudUdyb3VwLnRvb2x0aXApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgb25NZW51SXRlbUNsaWNrKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5vbkl0ZW1DbGljay5lbWl0KGUpO1xuICB9XG5cbiAgZ2V0Q2xhc3MoKSB7XG4gICAgbGV0IGNsYXNzTmFtZSA9ICdvLWFwcC1zaWRlbmF2LW1lbnUtZ3JvdXAnO1xuICAgIGlmICh0aGlzLm1lbnVHcm91cC5jbGFzcykge1xuICAgICAgY2xhc3NOYW1lICs9ICcgJyArIHRoaXMubWVudUdyb3VwLmNsYXNzO1xuICAgIH1cbiAgICByZXR1cm4gY2xhc3NOYW1lO1xuICB9XG59XG4iXX0=