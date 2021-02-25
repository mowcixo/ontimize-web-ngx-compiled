import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ViewEncapsulation, } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InputConverter } from '../../../../../decorators/input-converter';
import { PermissionsUtils } from '../../../../../util/permissions';
import { OTableComponent } from '../../../o-table.component';
export var DEFAULT_INPUTS_O_TABLE_BUTTONS = [
    'insertButton: insert-button',
    'refreshButton: refresh-button',
    'deleteButton: delete-button'
];
export var DEFAULT_OUTPUTS_O_TABLE_BUTTONS = [];
var OTableButtonsComponent = (function () {
    function OTableButtonsComponent(injector, table) {
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
    OTableButtonsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var insertPerm = this.getPermissionByAttr('insert');
        var refreshPerm = this.getPermissionByAttr('refresh');
        var deletePerm = this.getPermissionByAttr('delete');
        if (this.insertButton && (insertPerm && insertPerm.enabled === false)) {
            this.enabledInsertButton.next(false);
        }
        if (this.refreshButton && (refreshPerm && refreshPerm.enabled === false)) {
            this.enabledRefreshButton.next(false);
        }
        this.subscription = this.table.selection.changed.subscribe(function () {
            return deletePerm ? _this.enabledDeleteButton.next(deletePerm.enabled && !_this.table.selection.isEmpty()) : _this.enabledDeleteButton.next(!_this.table.selection.isEmpty());
        });
    };
    OTableButtonsComponent.prototype.ngOnDestroy = function () {
        if (this.mutationObservers) {
            this.mutationObservers.forEach(function (m) {
                m.disconnect();
            });
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    OTableButtonsComponent.prototype.add = function () {
        this.table.add();
    };
    OTableButtonsComponent.prototype.reloadData = function () {
        this.table.reloadData();
    };
    OTableButtonsComponent.prototype.remove = function () {
        this.table.remove();
    };
    OTableButtonsComponent.prototype.getPermissionByAttr = function (attr) {
        return this.permissions.find(function (perm) { return perm.attr === attr; });
    };
    OTableButtonsComponent.prototype.registerButtons = function (oTableButtons) {
        var fixedButtons = ['insert', 'refresh', 'delete'];
        var userItems = this.permissions.filter(function (perm) { return fixedButtons.indexOf(perm.attr) === -1; });
        var self = this;
        userItems.forEach(function (perm) {
            var button = oTableButtons.find(function (oTableButton) { return oTableButton.oattr === perm.attr; });
            self.setPermissionsToOTableButton(perm, button);
        });
    };
    Object.defineProperty(OTableButtonsComponent.prototype, "showInsertOButton", {
        get: function () {
            if (!this.insertButton) {
                return false;
            }
            var perm = this.getPermissionByAttr('insert');
            return !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableButtonsComponent.prototype, "showRefreshOButton", {
        get: function () {
            if (!this.refreshButton) {
                return false;
            }
            var perm = this.getPermissionByAttr('refresh');
            return !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableButtonsComponent.prototype, "showDeleteOButton", {
        get: function () {
            if (!this.deleteButton) {
                return false;
            }
            var perm = this.getPermissionByAttr('delete');
            return !(perm && perm.visible === false);
        },
        enumerable: true,
        configurable: true
    });
    OTableButtonsComponent.prototype.setPermissionsToOTableButton = function (perm, button) {
        if (perm.visible === false && button) {
            button.elRef.nativeElement.remove();
        }
        else if (perm.enabled === false && button) {
            button.enabled = false;
            var buttonEL = button.elRef.nativeElement.querySelector('button');
            var obs = PermissionsUtils.registerDisabledChangesInDom(buttonEL);
            this.mutationObservers.push(obs);
        }
    };
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
    OTableButtonsComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
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
    return OTableButtonsComponent;
}());
export { OTableButtonsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1idXR0b25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1idXR0b25zL28tdGFibGUtYnV0dG9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUdSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHM0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRzdELE1BQU0sQ0FBQyxJQUFNLDhCQUE4QixHQUFHO0lBRTVDLDZCQUE2QjtJQUU3QiwrQkFBK0I7SUFFL0IsNkJBQTZCO0NBQzlCLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSwrQkFBK0IsR0FBRyxFQUFFLENBQUM7QUFFbEQ7SUErQkUsZ0NBQ1ksUUFBa0IsRUFDeUIsS0FBc0I7UUFEakUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN5QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQWpCdEUsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFFN0Isa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFFOUIsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFHN0Isd0JBQW1CLEdBQTZCLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ25GLHlCQUFvQixHQUE2QixJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztRQUNwRix3QkFBbUIsR0FBNkIsSUFBSSxlQUFl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O1NBbEhZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtYnV0dG9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1Blcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4uL3RhYmxlLWJ1dHRvbi9vLXRhYmxlLWJ1dHRvbi5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9CVVRUT05TID0gW1xuICAvLyBpbnNlcnQtYnV0dG9uIFtub3x5ZXNdOiBzaG93IGluc2VydCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ2luc2VydEJ1dHRvbjogaW5zZXJ0LWJ1dHRvbicsXG4gIC8vIHJlZnJlc2gtYnV0dG9uIFtub3x5ZXNdOiBzaG93IHJlZnJlc2ggYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdyZWZyZXNoQnV0dG9uOiByZWZyZXNoLWJ1dHRvbicsXG4gIC8vIGRlbGV0ZS1idXR0b24gW25vfHllc106IHNob3cgZGVsZXRlIGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnZGVsZXRlQnV0dG9uOiBkZWxldGUtYnV0dG9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0JVVFRPTlMgPSBbXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1idXR0b25zJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtYnV0dG9ucy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtYnV0dG9ucy5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQlVUVE9OUyxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQlVUVE9OUyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tdGFibGUtYnV0dG9uc10nOiAndHJ1ZScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQnV0dG9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9UYWJsZUJ1dHRvbnMsIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICAvKiBJbnB1dHMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGluc2VydEJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyByZWZyZXNoQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGRlbGV0ZUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIC8qIEVuZCBvZiBpbnB1dHMgKi9cblxuICBwdWJsaWMgZW5hYmxlZEluc2VydEJ1dHRvbjogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPih0cnVlKTtcbiAgcHVibGljIGVuYWJsZWRSZWZyZXNoQnV0dG9uOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KHRydWUpO1xuICBwdWJsaWMgZW5hYmxlZERlbGV0ZUJ1dHRvbjogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnNbXTtcbiAgcHJvdGVjdGVkIG11dGF0aW9uT2JzZXJ2ZXJzOiBNdXRhdGlvbk9ic2VydmVyW10gPSBbXTtcbiAgcHJvdGVjdGVkIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHByb3RlY3RlZCB0YWJsZTogT1RhYmxlQ29tcG9uZW50XG4gICkge1xuICAgIHRoaXMucGVybWlzc2lvbnMgPSB0aGlzLnRhYmxlLmdldEFjdGlvbnNQZXJtaXNzaW9ucygpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGluc2VydFBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignaW5zZXJ0Jyk7XG4gICAgY29uc3QgcmVmcmVzaFBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cigncmVmcmVzaCcpO1xuICAgIGNvbnN0IGRlbGV0ZVBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cignZGVsZXRlJyk7XG5cbiAgICBpZiAodGhpcy5pbnNlcnRCdXR0b24gJiYgKGluc2VydFBlcm0gJiYgaW5zZXJ0UGVybS5lbmFibGVkID09PSBmYWxzZSkpIHtcbiAgICAgIHRoaXMuZW5hYmxlZEluc2VydEJ1dHRvbi5uZXh0KGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVmcmVzaEJ1dHRvbiAmJiAocmVmcmVzaFBlcm0gJiYgcmVmcmVzaFBlcm0uZW5hYmxlZCA9PT0gZmFsc2UpKSB7XG4gICAgICB0aGlzLmVuYWJsZWRSZWZyZXNoQnV0dG9uLm5leHQoZmFsc2UpO1xuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHRoaXMudGFibGUuc2VsZWN0aW9uLmNoYW5nZWQuc3Vic2NyaWJlKCgpID0+XG4gICAgICBkZWxldGVQZXJtID8gdGhpcy5lbmFibGVkRGVsZXRlQnV0dG9uLm5leHQoZGVsZXRlUGVybS5lbmFibGVkICYmICF0aGlzLnRhYmxlLnNlbGVjdGlvbi5pc0VtcHR5KCkpIDogdGhpcy5lbmFibGVkRGVsZXRlQnV0dG9uLm5leHQoIXRoaXMudGFibGUuc2VsZWN0aW9uLmlzRW1wdHkoKSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzKSB7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLmZvckVhY2goKG06IE11dGF0aW9uT2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgbS5kaXNjb25uZWN0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGQoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5hZGQoKTtcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWREYXRhKCk6IHZvaWQge1xuICAgIHRoaXMudGFibGUucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnJlbW92ZSgpO1xuICB9XG5cbiAgcHVibGljIGdldFBlcm1pc3Npb25CeUF0dHIoYXR0cjogc3RyaW5nKTogT1Blcm1pc3Npb25zIHtcbiAgICByZXR1cm4gdGhpcy5wZXJtaXNzaW9ucy5maW5kKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IHBlcm0uYXR0ciA9PT0gYXR0cik7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJCdXR0b25zKG9UYWJsZUJ1dHRvbnM6IE9UYWJsZUJ1dHRvbkNvbXBvbmVudFtdKTogdm9pZCB7XG4gICAgY29uc3QgZml4ZWRCdXR0b25zID0gWydpbnNlcnQnLCAncmVmcmVzaCcsICdkZWxldGUnXTtcbiAgICBjb25zdCB1c2VySXRlbXM6IE9QZXJtaXNzaW9uc1tdID0gdGhpcy5wZXJtaXNzaW9ucy5maWx0ZXIoKHBlcm06IE9QZXJtaXNzaW9ucykgPT4gZml4ZWRCdXR0b25zLmluZGV4T2YocGVybS5hdHRyKSA9PT0gLTEpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHVzZXJJdGVtcy5mb3JFYWNoKChwZXJtOiBPUGVybWlzc2lvbnMpID0+IHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IG9UYWJsZUJ1dHRvbnMuZmluZCgob1RhYmxlQnV0dG9uOiBPVGFibGVCdXR0b25Db21wb25lbnQpID0+IG9UYWJsZUJ1dHRvbi5vYXR0ciA9PT0gcGVybS5hdHRyKTtcbiAgICAgIHNlbGYuc2V0UGVybWlzc2lvbnNUb09UYWJsZUJ1dHRvbihwZXJtLCBidXR0b24pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHNob3dJbnNlcnRPQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pbnNlcnRCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdpbnNlcnQnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dSZWZyZXNoT0J1dHRvbigpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMucmVmcmVzaEJ1dHRvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ3JlZnJlc2gnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgZ2V0IHNob3dEZWxldGVPQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5kZWxldGVCdXR0b24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgcGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdkZWxldGUnKTtcbiAgICByZXR1cm4gIShwZXJtICYmIHBlcm0udmlzaWJsZSA9PT0gZmFsc2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFBlcm1pc3Npb25zVG9PVGFibGVCdXR0b24ocGVybTogT1Blcm1pc3Npb25zLCBidXR0b246IE9UYWJsZUJ1dHRvbkNvbXBvbmVudCk6IHZvaWQge1xuICAgIGlmIChwZXJtLnZpc2libGUgPT09IGZhbHNlICYmIGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmVsUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgfSBlbHNlIGlmIChwZXJtLmVuYWJsZWQgPT09IGZhbHNlICYmIGJ1dHRvbikge1xuICAgICAgYnV0dG9uLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGNvbnN0IGJ1dHRvbkVMID0gYnV0dG9uLmVsUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJyk7XG4gICAgICBjb25zdCBvYnMgPSBQZXJtaXNzaW9uc1V0aWxzLnJlZ2lzdGVyRGlzYWJsZWRDaGFuZ2VzSW5Eb20oYnV0dG9uRUwpO1xuICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG9icyk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==