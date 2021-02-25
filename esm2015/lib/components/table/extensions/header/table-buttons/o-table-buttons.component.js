import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ViewEncapsulation, } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InputConverter } from '../../../../../decorators/input-converter';
import { PermissionsUtils } from '../../../../../util/permissions';
import { OTableComponent } from '../../../o-table.component';
export const DEFAULT_INPUTS_O_TABLE_BUTTONS = [
    'insertButton: insert-button',
    'refreshButton: refresh-button',
    'deleteButton: delete-button'
];
export const DEFAULT_OUTPUTS_O_TABLE_BUTTONS = [];
export class OTableButtonsComponent {
    constructor(injector, table) {
        this.injector = injector;
        this.table = table;
        this.insertButton = true;
        this.refreshButton = true;
        this.deleteButton = true;
        this.enabledInsertButton = new BehaviorSubject(true);
        this.enabledRefreshButton = new BehaviorSubject(true);
        this.enabledDeleteButton = new BehaviorSubject(false);
        this.mutationObservers = [];
        this.permissions = this.table.getActionsPermissions();
    }
    ngOnInit() {
        const insertPerm = this.getPermissionByAttr('insert');
        const refreshPerm = this.getPermissionByAttr('refresh');
        const deletePerm = this.getPermissionByAttr('delete');
        if (this.insertButton && (insertPerm && insertPerm.enabled === false)) {
            this.enabledInsertButton.next(false);
        }
        if (this.refreshButton && (refreshPerm && refreshPerm.enabled === false)) {
            this.enabledRefreshButton.next(false);
        }
        this.subscription = this.table.selection.changed.subscribe(() => deletePerm ? this.enabledDeleteButton.next(deletePerm.enabled && !this.table.selection.isEmpty()) : this.enabledDeleteButton.next(!this.table.selection.isEmpty()));
        this.table.registerOTableButtons(this);
    }
    ngOnDestroy() {
        if (this.mutationObservers) {
            this.mutationObservers.forEach((m) => {
                m.disconnect();
            });
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    add() {
        this.table.add();
    }
    reloadData() {
        this.table.reloadData();
    }
    remove() {
        this.table.remove();
    }
    getPermissionByAttr(attr) {
        return this.permissions.find((perm) => perm.attr === attr);
    }
    registerButtons(oTableButtons) {
        const fixedButtons = ['insert', 'refresh', 'delete'];
        const userItems = this.permissions.filter((perm) => fixedButtons.indexOf(perm.attr) === -1);
        const self = this;
        userItems.forEach((perm) => {
            const button = oTableButtons.find((oTableButton) => oTableButton.oattr === perm.attr);
            self.setPermissionsToOTableButton(perm, button);
        });
    }
    get showInsertOButton() {
        if (!this.insertButton) {
            return false;
        }
        const perm = this.getPermissionByAttr('insert');
        return !(perm && perm.visible === false);
    }
    get showRefreshOButton() {
        if (!this.refreshButton) {
            return false;
        }
        const perm = this.getPermissionByAttr('refresh');
        return !(perm && perm.visible === false);
    }
    get showDeleteOButton() {
        if (!this.deleteButton) {
            return false;
        }
        const perm = this.getPermissionByAttr('delete');
        return !(perm && perm.visible === false);
    }
    setPermissionsToOTableButton(perm, button) {
        if (perm.visible === false && button) {
            button.elRef.nativeElement.remove();
        }
        else if (perm.enabled === false && button) {
            button.enabled = false;
            const buttonEL = button.elRef.nativeElement.querySelector('button');
            const obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
            this.mutationObservers.push(obs);
        }
    }
}
OTableButtonsComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-buttons',
                template: "<div class=\"buttons\" fxLayout>\n  <o-table-button *ngIf=\"showInsertOButton\" [enabled]=\"enabledInsertButton | async\" label=\"TABLE.BUTTONS.ADD\"\n    svg-icon=\"ontimize:add\" (onClick)=\"add()\" class=\"o-table-button-add\"></o-table-button>\n  <o-table-button *ngIf=\"showRefreshOButton\" [enabled]=\"enabledRefreshButton | async\" label=\"TABLE.BUTTONS.REFRESH\"\n    svg-icon=\"ontimize:autorenew\" (onClick)=\"reloadData()\" class=\"o-table-button-refresh\">\n  </o-table-button>\n  <o-table-button *ngIf=\"showDeleteOButton\" [enabled]=\"enabledDeleteButton | async\" label=\"TABLE.BUTTONS.DELETE\"\n    svg-icon=\"ontimize:delete\" (onClick)=\"remove()\" class=\"o-table-button-delete\"></o-table-button>\n  <ng-content></ng-content>\n</div>",
                inputs: DEFAULT_INPUTS_O_TABLE_BUTTONS,
                outputs: DEFAULT_OUTPUTS_O_TABLE_BUTTONS,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class.o-table-buttons]': 'true',
                },
                styles: [""]
            }] }
];
OTableButtonsComponent.ctorParameters = () => [
    { type: Injector },
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableButtonsComponent.prototype, "insertButton", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableButtonsComponent.prototype, "refreshButton", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableButtonsComponent.prototype, "deleteButton", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1idXR0b25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1idXR0b25zL28tdGFibGUtYnV0dG9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUdSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHM0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRzdELE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHO0lBRTVDLDZCQUE2QjtJQUU3QiwrQkFBK0I7SUFFL0IsNkJBQTZCO0NBQzlCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRyxFQUFFLENBQUM7QUFjbEQsTUFBTSxPQUFPLHNCQUFzQjtJQW1CakMsWUFDWSxRQUFrQixFQUN5QixLQUFzQjtRQURqRSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3lCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBakJ0RSxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUU3QixrQkFBYSxHQUFZLElBQUksQ0FBQztRQUU5QixpQkFBWSxHQUFZLElBQUksQ0FBQztRQUc3Qix3QkFBbUIsR0FBNkIsSUFBSSxlQUFlLENBQVUsSUFBSSxDQUFDLENBQUM7UUFDbkYseUJBQW9CLEdBQTZCLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ3BGLHdCQUFtQixHQUE2QixJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUdqRixzQkFBaUIsR0FBdUIsRUFBRSxDQUFDO1FBT25ELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3hELENBQUM7SUFFTSxRQUFRO1FBQ2IsTUFBTSxVQUFVLEdBQWlCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRSxNQUFNLFdBQVcsR0FBaUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sVUFBVSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEUsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDckUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ3hFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQzlELFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQ25LLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxXQUFXO1FBQ2hCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFtQixFQUFFLEVBQUU7Z0JBQ3JELENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRU0sR0FBRztRQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVNLFVBQVU7UUFDZixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sbUJBQW1CLENBQUMsSUFBWTtRQUNyQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBa0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRU0sZUFBZSxDQUFDLGFBQXNDO1FBQzNELE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLFNBQVMsR0FBbUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBa0IsRUFBRSxFQUFFO1lBQ3ZDLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFtQyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3RyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxNQUFNLElBQUksR0FBaUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUFJLGtCQUFrQjtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsTUFBTSxJQUFJLEdBQWlCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxpQkFBaUI7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sSUFBSSxHQUFpQixJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUQsT0FBTyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVTLDRCQUE0QixDQUFDLElBQWtCLEVBQUUsTUFBNkI7UUFDdEYsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssSUFBSSxNQUFNLEVBQUU7WUFDcEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckM7YUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLE1BQU0sRUFBRTtZQUMzQyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUN2QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEUsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7OztZQTdIRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsNnZCQUErQztnQkFFL0MsTUFBTSxFQUFFLDhCQUE4QjtnQkFDdEMsT0FBTyxFQUFFLCtCQUErQjtnQkFDeEMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxJQUFJLEVBQUU7b0JBQ0oseUJBQXlCLEVBQUUsTUFBTTtpQkFDbEM7O2FBQ0Y7OztZQXBDQyxRQUFRO1lBV0QsZUFBZSx1QkErQ25CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDOztBQWpCM0M7SUFEQyxjQUFjLEVBQUU7OzREQUNtQjtBQUVwQztJQURDLGNBQWMsRUFBRTs7NkRBQ29CO0FBRXJDO0lBREMsY0FBYyxFQUFFOzs0REFDbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPVGFibGVCdXR0b25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWJ1dHRvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9QZXJtaXNzaW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tcGVybWlzc2lvbnMudHlwZSc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1V0aWxzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9wZXJtaXNzaW9ucyc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVCdXR0b25Db21wb25lbnQgfSBmcm9tICcuLi90YWJsZS1idXR0b24vby10YWJsZS1idXR0b24uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQlVUVE9OUyA9IFtcbiAgLy8gaW5zZXJ0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBpbnNlcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdpbnNlcnRCdXR0b246IGluc2VydC1idXR0b24nLFxuICAvLyByZWZyZXNoLWJ1dHRvbiBbbm98eWVzXTogc2hvdyByZWZyZXNoIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAncmVmcmVzaEJ1dHRvbjogcmVmcmVzaC1idXR0b24nLFxuICAvLyBkZWxldGUtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGRlbGV0ZSBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2RlbGV0ZUJ1dHRvbjogZGVsZXRlLWJ1dHRvbidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9CVVRUT05TID0gW107XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtYnV0dG9ucycsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWJ1dHRvbnMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLWJ1dHRvbnMuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0JVVFRPTlMsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0JVVFRPTlMsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLWJ1dHRvbnNdJzogJ3RydWUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUJ1dHRvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPVGFibGVCdXR0b25zLCBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgLyogSW5wdXRzICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBpbnNlcnRCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgcmVmcmVzaEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBkZWxldGVCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICAvKiBFbmQgb2YgaW5wdXRzICovXG5cbiAgcHVibGljIGVuYWJsZWRJbnNlcnRCdXR0b246IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4odHJ1ZSk7XG4gIHB1YmxpYyBlbmFibGVkUmVmcmVzaEJ1dHRvbjogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPih0cnVlKTtcbiAgcHVibGljIGVuYWJsZWREZWxldGVCdXR0b246IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuXG4gIHByb3RlY3RlZCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zW107XG4gIHByb3RlY3RlZCBtdXRhdGlvbk9ic2VydmVyczogTXV0YXRpb25PYnNlcnZlcltdID0gW107XG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwcm90ZWN0ZWQgdGFibGU6IE9UYWJsZUNvbXBvbmVudFxuICApIHtcbiAgICB0aGlzLnBlcm1pc3Npb25zID0gdGhpcy50YWJsZS5nZXRBY3Rpb25zUGVybWlzc2lvbnMoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBpbnNlcnRQZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2luc2VydCcpO1xuICAgIGNvbnN0IHJlZnJlc2hQZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ3JlZnJlc2gnKTtcbiAgICBjb25zdCBkZWxldGVQZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2RlbGV0ZScpO1xuXG4gICAgaWYgKHRoaXMuaW5zZXJ0QnV0dG9uICYmIChpbnNlcnRQZXJtICYmIGluc2VydFBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpKSB7XG4gICAgICB0aGlzLmVuYWJsZWRJbnNlcnRCdXR0b24ubmV4dChmYWxzZSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlZnJlc2hCdXR0b24gJiYgKHJlZnJlc2hQZXJtICYmIHJlZnJlc2hQZXJtLmVuYWJsZWQgPT09IGZhbHNlKSkge1xuICAgICAgdGhpcy5lbmFibGVkUmVmcmVzaEJ1dHRvbi5uZXh0KGZhbHNlKTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLnRhYmxlLnNlbGVjdGlvbi5jaGFuZ2VkLnN1YnNjcmliZSgoKSA9PlxuICAgICAgZGVsZXRlUGVybSA/IHRoaXMuZW5hYmxlZERlbGV0ZUJ1dHRvbi5uZXh0KGRlbGV0ZVBlcm0uZW5hYmxlZCAmJiAhdGhpcy50YWJsZS5zZWxlY3Rpb24uaXNFbXB0eSgpKSA6IHRoaXMuZW5hYmxlZERlbGV0ZUJ1dHRvbi5uZXh0KCF0aGlzLnRhYmxlLnNlbGVjdGlvbi5pc0VtcHR5KCkpXG4gICAgKTtcbiAgICB0aGlzLnRhYmxlLnJlZ2lzdGVyT1RhYmxlQnV0dG9ucyh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tdXRhdGlvbk9ic2VydmVycykge1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5mb3JFYWNoKChtOiBNdXRhdGlvbk9ic2VydmVyKSA9PiB7XG4gICAgICAgIG0uZGlzY29ubmVjdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkKCk6IHZvaWQge1xuICAgIHRoaXMudGFibGUuYWRkKCk7XG4gIH1cblxuICBwdWJsaWMgcmVsb2FkRGF0YSgpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnJlbG9hZERhdGEoKTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmUoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5yZW1vdmUoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRQZXJtaXNzaW9uQnlBdHRyKGF0dHI6IHN0cmluZyk6IE9QZXJtaXNzaW9ucyB7XG4gICAgcmV0dXJuIHRoaXMucGVybWlzc2lvbnMuZmluZCgocGVybTogT1Blcm1pc3Npb25zKSA9PiBwZXJtLmF0dHIgPT09IGF0dHIpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyQnV0dG9ucyhvVGFibGVCdXR0b25zOiBPVGFibGVCdXR0b25Db21wb25lbnRbXSk6IHZvaWQge1xuICAgIGNvbnN0IGZpeGVkQnV0dG9ucyA9IFsnaW5zZXJ0JywgJ3JlZnJlc2gnLCAnZGVsZXRlJ107XG4gICAgY29uc3QgdXNlckl0ZW1zOiBPUGVybWlzc2lvbnNbXSA9IHRoaXMucGVybWlzc2lvbnMuZmlsdGVyKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IGZpeGVkQnV0dG9ucy5pbmRleE9mKHBlcm0uYXR0cikgPT09IC0xKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB1c2VySXRlbXMuZm9yRWFjaCgocGVybTogT1Blcm1pc3Npb25zKSA9PiB7XG4gICAgICBjb25zdCBidXR0b24gPSBvVGFibGVCdXR0b25zLmZpbmQoKG9UYWJsZUJ1dHRvbjogT1RhYmxlQnV0dG9uQ29tcG9uZW50KSA9PiBvVGFibGVCdXR0b24ub2F0dHIgPT09IHBlcm0uYXR0cik7XG4gICAgICBzZWxmLnNldFBlcm1pc3Npb25zVG9PVGFibGVCdXR0b24ocGVybSwgYnV0dG9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzaG93SW5zZXJ0T0J1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaW5zZXJ0QnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignaW5zZXJ0Jyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93UmVmcmVzaE9CdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLnJlZnJlc2hCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdyZWZyZXNoJyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIGdldCBzaG93RGVsZXRlT0J1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuZGVsZXRlQnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZGVsZXRlJyk7XG4gICAgcmV0dXJuICEocGVybSAmJiBwZXJtLnZpc2libGUgPT09IGZhbHNlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRQZXJtaXNzaW9uc1RvT1RhYmxlQnV0dG9uKHBlcm06IE9QZXJtaXNzaW9ucywgYnV0dG9uOiBPVGFibGVCdXR0b25Db21wb25lbnQpOiB2b2lkIHtcbiAgICBpZiAocGVybS52aXNpYmxlID09PSBmYWxzZSAmJiBidXR0b24pIHtcbiAgICAgIGJ1dHRvbi5lbFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZSgpO1xuICAgIH0gZWxzZSBpZiAocGVybS5lbmFibGVkID09PSBmYWxzZSAmJiBidXR0b24pIHtcbiAgICAgIGJ1dHRvbi5lbmFibGVkID0gZmFsc2U7XG4gICAgICBjb25zdCBidXR0b25FTCA9IGJ1dHRvbi5lbFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuICAgICAgY29uc3Qgb2JzID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGJ1dHRvbkVMKTtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMucHVzaChvYnMpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=