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
export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = [
    'menuGroup : menu-group',
    'sidenavOpened : sidenav-opened'
];
export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = [
    'onItemClick'
];
export class OAppSidenavMenuGroupComponent {
    constructor(injector, elRef, cd) {
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
    ngOnInit() {
        this.parsePermissions();
    }
    ngAfterViewInit() {
        if (this.menuGroup.id === 'user-info' && this.sidenav) {
            const self = this;
            this.sidenavSubscription = this.sidenav.onSidenavOpenedChange.subscribe((opened) => {
                self.disabled = ((!opened && Util.isDefined(opened)) || (Util.isDefined(self.permissions) && self.permissions && self.permissions.enabled === false));
                self.updateContentExpansion();
                self.cd.markForCheck();
            });
        }
        this.updateContentExpansion();
    }
    ngOnDestroy() {
        if (this.sidenavSubscription) {
            this.sidenavSubscription.unsubscribe();
        }
    }
    parsePermissions() {
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
    }
    onClick() {
        if (this.disabled) {
            return;
        }
        this.menuGroup.opened = !this.menuGroup.opened;
        this.updateContentExpansion();
    }
    updateContentExpansion() {
        let isOpened = this.menuGroup && this.menuGroup.opened;
        if (this.menuGroup.id === 'user-info') {
            isOpened = (this.sidenav && this.sidenav.sidenav && this.sidenav.sidenav.opened) && isOpened;
        }
        this.contentExpansion = isOpened ? 'expanded' : 'collapsed';
    }
    get contentExpansion() {
        return this._contentExpansion;
    }
    set contentExpansion(val) {
        this._contentExpansion = val;
        this.cd.detectChanges();
    }
    get tooltip() {
        let result = this.translateService.get(this.menuGroup.name);
        if (Util.isDefined(this.menuGroup.tooltip)) {
            result += ': ' + this.translateService.get(this.menuGroup.tooltip);
        }
        return result;
    }
    onMenuItemClick(e) {
        this.onItemClick.emit(e);
    }
    getClass() {
        let className = 'o-app-sidenav-menu-group';
        if (this.menuGroup.class) {
            className += ' ' + this.menuGroup.class;
        }
        return className;
    }
}
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
OAppSidenavMenuGroupComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: ChangeDetectorRef }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OAppSidenavMenuGroupComponent.prototype, "sidenavOpened", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi1tZW51LWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9hcHAtc2lkZW5hdi9tZW51LWdyb3VwL28tYXBwLXNpZGVuYXYtbWVudS1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUdSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUd2QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFckUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBRXBGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzdELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUVsRSxNQUFNLENBQUMsTUFBTSx1Q0FBdUMsR0FBRztJQUNyRCx3QkFBd0I7SUFDeEIsZ0NBQWdDO0NBQ2pDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSx3Q0FBd0MsR0FBRztJQUN0RCxhQUFhO0NBQ2QsQ0FBQztBQXVCRixNQUFNLE9BQU8sNkJBQTZCO0lBc0J4QyxZQUNZLFFBQWtCLEVBQ2xCLEtBQWlCLEVBQ2pCLEVBQXFC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Z2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE1lbnVHcm91cCB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvYXBwLW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IEFwcE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYXBwLW1lbnUuc2VydmljZSc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1Blcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0FwcFNpZGVuYXZDb21wb25lbnQgfSBmcm9tICcuLi9vLWFwcC1zaWRlbmF2LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0FQUF9TSURFTkFWX01FTlVfR1JPVVAgPSBbXG4gICdtZW51R3JvdXAgOiBtZW51LWdyb3VwJyxcbiAgJ3NpZGVuYXZPcGVuZWQgOiBzaWRlbmF2LW9wZW5lZCdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19BUFBfU0lERU5BVl9NRU5VX0dST1VQID0gW1xuICAnb25JdGVtQ2xpY2snXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWFwcC1zaWRlbmF2LW1lbnUtZ3JvdXAnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQVBQX1NJREVOQVZfTUVOVV9HUk9VUCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fQVBQX1NJREVOQVZfTUVOVV9HUk9VUCxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYXBwLXNpZGVuYXYtbWVudS1ncm91cC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYXBwLXNpZGVuYXYtbWVudS1ncm91cC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignY29udGVudEV4cGFuc2lvbicsIFtcbiAgICAgIHN0YXRlKCdjb2xsYXBzZWQnLCBzdHlsZSh7IGhlaWdodDogJzBweCcgfSkpLFxuICAgICAgc3RhdGUoJ2V4cGFuZGVkJywgc3R5bGUoeyBoZWlnaHQ6ICcqJyB9KSksXG4gICAgICB0cmFuc2l0aW9uKCdjb2xsYXBzZWQgPT4gZXhwYW5kZWQnLCBhbmltYXRlKCcyMDBtcyBlYXNlLWluJykpLFxuICAgICAgdHJhbnNpdGlvbignZXhwYW5kZWQgPT4gY29sbGFwc2VkJywgYW5pbWF0ZSgnMjAwbXMgZWFzZS1vdXQnKSlcbiAgICBdKVxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3NdJzogJ2dldENsYXNzKCknLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnZGlzYWJsZWQnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0FwcFNpZGVuYXZNZW51R3JvdXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIG9uSXRlbUNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zU2VydmljZTogUGVybWlzc2lvbnNTZXJ2aWNlO1xuXG4gIGFwcE1lbnVTZXJ2aWNlOiBBcHBNZW51U2VydmljZTtcbiAgcHJvdGVjdGVkIHNpZGVuYXY6IE9BcHBTaWRlbmF2Q29tcG9uZW50O1xuICBwcm90ZWN0ZWQgc2lkZW5hdlN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucztcbiAgcHJvdGVjdGVkIG11dGF0aW9uT2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XG5cbiAgcHVibGljIG1lbnVHcm91cDogTWVudUdyb3VwO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNpZGVuYXZPcGVuZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGhpZGRlbjogYm9vbGVhbjtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIHByb3RlY3RlZCBfY29udGVudEV4cGFuc2lvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLmFwcE1lbnVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoQXBwTWVudVNlcnZpY2UpO1xuICAgIHRoaXMucGVybWlzc2lvbnNTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoUGVybWlzc2lvbnNTZXJ2aWNlKTtcblxuICAgIHRoaXMuc2lkZW5hdiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9BcHBTaWRlbmF2Q29tcG9uZW50KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMucGFyc2VQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLm1lbnVHcm91cC5pZCA9PT0gJ3VzZXItaW5mbycgJiYgdGhpcy5zaWRlbmF2KSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuc2lkZW5hdlN1YnNjcmlwdGlvbiA9IHRoaXMuc2lkZW5hdi5vblNpZGVuYXZPcGVuZWRDaGFuZ2Uuc3Vic2NyaWJlKChvcGVuZWQpID0+IHtcbiAgICAgICAgc2VsZi5kaXNhYmxlZCA9ICgoIW9wZW5lZCAmJiBVdGlsLmlzRGVmaW5lZChvcGVuZWQpKSB8fCAoVXRpbC5pc0RlZmluZWQoc2VsZi5wZXJtaXNzaW9ucykgJiYgc2VsZi5wZXJtaXNzaW9ucyAmJiBzZWxmLnBlcm1pc3Npb25zLmVuYWJsZWQgPT09IGZhbHNlKSk7XG4gICAgICAgIHNlbGYudXBkYXRlQ29udGVudEV4cGFuc2lvbigpO1xuICAgICAgICBzZWxmLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ29udGVudEV4cGFuc2lvbigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc2lkZW5hdlN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zaWRlbmF2U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlUGVybWlzc2lvbnMoKSB7XG4gICAgLy8gaWYgb2F0dHIgaW4gZm9ybSwgaXQgY2FuIGhhdmUgcGVybWlzc2lvbnNcbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UuZ2V0TWVudVBlcm1pc3Npb25zKHRoaXMubWVudUdyb3VwLmlkKTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaGlkZGVuID0gdGhpcy5wZXJtaXNzaW9ucy52aXNpYmxlID09PSBmYWxzZTtcbiAgICB0aGlzLmRpc2FibGVkID0gdGhpcy5wZXJtaXNzaW9ucy5lbmFibGVkID09PSBmYWxzZTtcblxuICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXIgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20odGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIGNoZWNrU3RyaW5nVmFsdWU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5tZW51R3JvdXAub3BlbmVkID0gIXRoaXMubWVudUdyb3VwLm9wZW5lZDtcbiAgICB0aGlzLnVwZGF0ZUNvbnRlbnRFeHBhbnNpb24oKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRlbnRFeHBhbnNpb24oKSB7XG4gICAgbGV0IGlzT3BlbmVkID0gdGhpcy5tZW51R3JvdXAgJiYgdGhpcy5tZW51R3JvdXAub3BlbmVkO1xuICAgIGlmICh0aGlzLm1lbnVHcm91cC5pZCA9PT0gJ3VzZXItaW5mbycpIHtcbiAgICAgIGlzT3BlbmVkID0gKHRoaXMuc2lkZW5hdiAmJiB0aGlzLnNpZGVuYXYuc2lkZW5hdiAmJiB0aGlzLnNpZGVuYXYuc2lkZW5hdi5vcGVuZWQpICYmIGlzT3BlbmVkO1xuICAgIH1cbiAgICB0aGlzLmNvbnRlbnRFeHBhbnNpb24gPSBpc09wZW5lZCA/ICdleHBhbmRlZCcgOiAnY29sbGFwc2VkJztcbiAgfVxuXG4gIGdldCBjb250ZW50RXhwYW5zaW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRFeHBhbnNpb247XG4gIH1cblxuICBzZXQgY29udGVudEV4cGFuc2lvbih2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2NvbnRlbnRFeHBhbnNpb24gPSB2YWw7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBnZXQgdG9vbHRpcCgpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCh0aGlzLm1lbnVHcm91cC5uYW1lKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5tZW51R3JvdXAudG9vbHRpcCkpIHtcbiAgICAgIHJlc3VsdCArPSAnOiAnICsgdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCh0aGlzLm1lbnVHcm91cC50b29sdGlwKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG9uTWVudUl0ZW1DbGljayhlOiBFdmVudCk6IHZvaWQge1xuICAgIHRoaXMub25JdGVtQ2xpY2suZW1pdChlKTtcbiAgfVxuXG4gIGdldENsYXNzKCkge1xuICAgIGxldCBjbGFzc05hbWUgPSAnby1hcHAtc2lkZW5hdi1tZW51LWdyb3VwJztcbiAgICBpZiAodGhpcy5tZW51R3JvdXAuY2xhc3MpIHtcbiAgICAgIGNsYXNzTmFtZSArPSAnICcgKyB0aGlzLm1lbnVHcm91cC5jbGFzcztcbiAgICB9XG4gICAgcmV0dXJuIGNsYXNzTmFtZTtcbiAgfVxufVxuIl19