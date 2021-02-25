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
        this.table.registerOTableButtons(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1idXR0b25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1idXR0b25zL28tdGFibGUtYnV0dG9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUdSLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUVyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFHM0UsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRzdELE1BQU0sQ0FBQyxJQUFNLDhCQUE4QixHQUFHO0lBRTVDLDZCQUE2QjtJQUU3QiwrQkFBK0I7SUFFL0IsNkJBQTZCO0NBQzlCLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSwrQkFBK0IsR0FBRyxFQUFFLENBQUM7QUFFbEQ7SUErQkUsZ0NBQ1ksUUFBa0IsRUFDeUIsS0FBc0I7UUFEakUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN5QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQWpCdEUsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFFN0Isa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFFOUIsaUJBQVksR0FBWSxJQUFJLENBQUM7UUFHN0Isd0JBQW1CLEdBQTZCLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ25GLHlCQUFvQixHQUE2QixJQUFJLGVBQWUsQ0FBVSxJQUFJLENBQUMsQ0FBQztRQUNwRix3QkFBbUIsR0FBNkIsSUFBSSxlQUFl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O1FBREMsY0FBYyxFQUFFOztnRUFDbUI7SUEyR3RDLDZCQUFDO0NBQUEsQUEvSEQsSUErSEM7U0FuSFksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RhYmxlQnV0dG9ucyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1idXR0b25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNVdGlscyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvcGVybWlzc2lvbnMnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi4vdGFibGUtYnV0dG9uL28tdGFibGUtYnV0dG9uLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0JVVFRPTlMgPSBbXG4gIC8vIGluc2VydC1idXR0b24gW25vfHllc106IHNob3cgaW5zZXJ0IGJ1dHRvbi4gRGVmYXVsdDogeWVzLlxuICAnaW5zZXJ0QnV0dG9uOiBpbnNlcnQtYnV0dG9uJyxcbiAgLy8gcmVmcmVzaC1idXR0b24gW25vfHllc106IHNob3cgcmVmcmVzaCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ3JlZnJlc2hCdXR0b246IHJlZnJlc2gtYnV0dG9uJyxcbiAgLy8gZGVsZXRlLWJ1dHRvbiBbbm98eWVzXTogc2hvdyBkZWxldGUgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdkZWxldGVCdXR0b246IGRlbGV0ZS1idXR0b24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQlVUVE9OUyA9IFtdO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWJ1dHRvbnMnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1idXR0b25zLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1idXR0b25zLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9CVVRUT05TLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9CVVRUT05TLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1idXR0b25zXSc6ICd0cnVlJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVCdXR0b25zQ29tcG9uZW50IGltcGxlbWVudHMgT1RhYmxlQnV0dG9ucywgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIC8qIElucHV0cyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgaW5zZXJ0QnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHJlZnJlc2hCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZGVsZXRlQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgLyogRW5kIG9mIGlucHV0cyAqL1xuXG4gIHB1YmxpYyBlbmFibGVkSW5zZXJ0QnV0dG9uOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KHRydWUpO1xuICBwdWJsaWMgZW5hYmxlZFJlZnJlc2hCdXR0b246IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4odHJ1ZSk7XG4gIHB1YmxpYyBlbmFibGVkRGVsZXRlQnV0dG9uOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9uc1tdO1xuICBwcm90ZWN0ZWQgbXV0YXRpb25PYnNlcnZlcnM6IE11dGF0aW9uT2JzZXJ2ZXJbXSA9IFtdO1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnRcbiAgKSB7XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHRoaXMudGFibGUuZ2V0QWN0aW9uc1Blcm1pc3Npb25zKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgaW5zZXJ0UGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdpbnNlcnQnKTtcbiAgICBjb25zdCByZWZyZXNoUGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdyZWZyZXNoJyk7XG4gICAgY29uc3QgZGVsZXRlUGVybTogT1Blcm1pc3Npb25zID0gdGhpcy5nZXRQZXJtaXNzaW9uQnlBdHRyKCdkZWxldGUnKTtcblxuICAgIGlmICh0aGlzLmluc2VydEJ1dHRvbiAmJiAoaW5zZXJ0UGVybSAmJiBpbnNlcnRQZXJtLmVuYWJsZWQgPT09IGZhbHNlKSkge1xuICAgICAgdGhpcy5lbmFibGVkSW5zZXJ0QnV0dG9uLm5leHQoZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZWZyZXNoQnV0dG9uICYmIChyZWZyZXNoUGVybSAmJiByZWZyZXNoUGVybS5lbmFibGVkID09PSBmYWxzZSkpIHtcbiAgICAgIHRoaXMuZW5hYmxlZFJlZnJlc2hCdXR0b24ubmV4dChmYWxzZSk7XG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy50YWJsZS5zZWxlY3Rpb24uY2hhbmdlZC5zdWJzY3JpYmUoKCkgPT5cbiAgICAgIGRlbGV0ZVBlcm0gPyB0aGlzLmVuYWJsZWREZWxldGVCdXR0b24ubmV4dChkZWxldGVQZXJtLmVuYWJsZWQgJiYgIXRoaXMudGFibGUuc2VsZWN0aW9uLmlzRW1wdHkoKSkgOiB0aGlzLmVuYWJsZWREZWxldGVCdXR0b24ubmV4dCghdGhpcy50YWJsZS5zZWxlY3Rpb24uaXNFbXB0eSgpKVxuICAgICk7XG4gICAgdGhpcy50YWJsZS5yZWdpc3Rlck9UYWJsZUJ1dHRvbnModGhpcyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubXV0YXRpb25PYnNlcnZlcnMpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMuZm9yRWFjaCgobTogTXV0YXRpb25PYnNlcnZlcikgPT4ge1xuICAgICAgICBtLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZCgpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLmFkZCgpO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZERhdGEoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5yZWxvYWREYXRhKCk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMudGFibGUucmVtb3ZlKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0UGVybWlzc2lvbkJ5QXR0cihhdHRyOiBzdHJpbmcpOiBPUGVybWlzc2lvbnMge1xuICAgIHJldHVybiB0aGlzLnBlcm1pc3Npb25zLmZpbmQoKHBlcm06IE9QZXJtaXNzaW9ucykgPT4gcGVybS5hdHRyID09PSBhdHRyKTtcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlckJ1dHRvbnMob1RhYmxlQnV0dG9uczogT1RhYmxlQnV0dG9uQ29tcG9uZW50W10pOiB2b2lkIHtcbiAgICBjb25zdCBmaXhlZEJ1dHRvbnMgPSBbJ2luc2VydCcsICdyZWZyZXNoJywgJ2RlbGV0ZSddO1xuICAgIGNvbnN0IHVzZXJJdGVtczogT1Blcm1pc3Npb25zW10gPSB0aGlzLnBlcm1pc3Npb25zLmZpbHRlcigocGVybTogT1Blcm1pc3Npb25zKSA9PiBmaXhlZEJ1dHRvbnMuaW5kZXhPZihwZXJtLmF0dHIpID09PSAtMSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdXNlckl0ZW1zLmZvckVhY2goKHBlcm06IE9QZXJtaXNzaW9ucykgPT4ge1xuICAgICAgY29uc3QgYnV0dG9uID0gb1RhYmxlQnV0dG9ucy5maW5kKChvVGFibGVCdXR0b246IE9UYWJsZUJ1dHRvbkNvbXBvbmVudCkgPT4gb1RhYmxlQnV0dG9uLm9hdHRyID09PSBwZXJtLmF0dHIpO1xuICAgICAgc2VsZi5zZXRQZXJtaXNzaW9uc1RvT1RhYmxlQnV0dG9uKHBlcm0sIGJ1dHRvbik7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgc2hvd0luc2VydE9CdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmluc2VydEJ1dHRvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2luc2VydCcpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd1JlZnJlc2hPQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5yZWZyZXNoQnV0dG9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHBlcm06IE9QZXJtaXNzaW9ucyA9IHRoaXMuZ2V0UGVybWlzc2lvbkJ5QXR0cigncmVmcmVzaCcpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBnZXQgc2hvd0RlbGV0ZU9CdXR0b24oKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLmRlbGV0ZUJ1dHRvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBwZXJtOiBPUGVybWlzc2lvbnMgPSB0aGlzLmdldFBlcm1pc3Npb25CeUF0dHIoJ2RlbGV0ZScpO1xuICAgIHJldHVybiAhKHBlcm0gJiYgcGVybS52aXNpYmxlID09PSBmYWxzZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0UGVybWlzc2lvbnNUb09UYWJsZUJ1dHRvbihwZXJtOiBPUGVybWlzc2lvbnMsIGJ1dHRvbjogT1RhYmxlQnV0dG9uQ29tcG9uZW50KTogdm9pZCB7XG4gICAgaWYgKHBlcm0udmlzaWJsZSA9PT0gZmFsc2UgJiYgYnV0dG9uKSB7XG4gICAgICBidXR0b24uZWxSZWYubmF0aXZlRWxlbWVudC5yZW1vdmUoKTtcbiAgICB9IGVsc2UgaWYgKHBlcm0uZW5hYmxlZCA9PT0gZmFsc2UgJiYgYnV0dG9uKSB7XG4gICAgICBidXR0b24uZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgY29uc3QgYnV0dG9uRUwgPSBidXR0b24uZWxSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdidXR0b24nKTtcbiAgICAgIGNvbnN0IG9icyA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbShidXR0b25FTCk7XG4gICAgICB0aGlzLm11dGF0aW9uT2JzZXJ2ZXJzLnB1c2gob2JzKTtcbiAgICB9XG4gIH1cblxufVxuIl19