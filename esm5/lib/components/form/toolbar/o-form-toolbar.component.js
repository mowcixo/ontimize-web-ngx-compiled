import * as tslib_1 from "tslib";
import { Component, ElementRef, Injector, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InputConverter } from '../../../decorators/input-converter';
import { DialogService } from '../../../services/dialog.service';
import { NavigationService } from '../../../services/navigation.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { Codes } from '../../../util/codes';
import { PermissionsUtils } from '../../../util/permissions';
import { Util } from '../../../util/util';
import { OFormComponent } from '../o-form.component';
export var DEFAULT_INPUTS_O_FORM_TOOLBAR = [
    'labelHeader: label-header',
    'labelHeaderAlign: label-header-align',
    'headeractions: header-actions',
    'showHeaderActionsText: show-header-actions-text',
    'showHeaderNavigation:show-header-navigation'
];
var OFormToolbarComponent = (function () {
    function OFormToolbarComponent(_form, element, injector) {
        this._form = _form;
        this.element = element;
        this.injector = injector;
        this.labelHeader = '';
        this.headeractions = '';
        this.labelHeaderAlign = 'center';
        this.showHeaderActionsText = true;
        this.showHeaderNavigation = true;
        this.isDetail = true;
        this.editMode = false;
        this.insertMode = false;
        this.initialMode = true;
        this.refreshBtnEnabled = false;
        this.insertBtnEnabled = false;
        this.deleteBtnEnabled = false;
        this._changesToSave = false;
        this._editBtnEnabled = false;
        this._saveBtnEnabled = false;
        this.mutationObservers = [];
        this._isSaveBtnEnabledSubject = new BehaviorSubject(false);
        this._isEditBtnEnabledSubject = new BehaviorSubject(false);
        this._existsChangesToSaveSubject = new BehaviorSubject(false);
        this.isSaveBtnEnabled = this._isSaveBtnEnabledSubject.asObservable();
        this.isEditBtnEnabled = this._isEditBtnEnabledSubject.asObservable();
        this.existsChangesToSave = this._existsChangesToSaveSubject.asObservable();
        this._form.registerToolbar(this);
        this._dialogService = this.injector.get(DialogService);
        this._navigationService = this.injector.get(NavigationService);
        this.snackBarService = this.injector.get(SnackBarService);
    }
    Object.defineProperty(OFormToolbarComponent.prototype, "changesToSave", {
        get: function () {
            return this._changesToSave;
        },
        set: function (val) {
            this._changesToSave = val;
            var attr = this._form.isEditableDetail() ? PermissionsUtils.ACTION_UPDATE : PermissionsUtils.ACTION_INSERT;
            var permissions = (this.actionsPermissions || []).find(function (p) { return p.attr === attr; });
            if (Util.isDefined(permissions) && permissions.enabled === false) {
                return;
            }
            this._existsChangesToSaveSubject.next(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormToolbarComponent.prototype, "editBtnEnabled", {
        get: function () {
            return this._editBtnEnabled;
        },
        set: function (value) {
            this._editBtnEnabled = value;
            this._isEditBtnEnabledSubject.next(this._editBtnEnabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormToolbarComponent.prototype, "saveBtnEnabled", {
        get: function () {
            return this._saveBtnEnabled;
        },
        set: function (value) {
            this._saveBtnEnabled = value;
            this._isSaveBtnEnabledSubject.next(this._saveBtnEnabled);
        },
        enumerable: true,
        configurable: true
    });
    OFormToolbarComponent.prototype.ngOnInit = function () {
        this.formActions = Util.parseArray(this.headeractions);
        if (this.formActions && this.formActions.length > 0) {
            this.refreshBtnEnabled = this.formActions.indexOf('R') !== -1;
            this.insertBtnEnabled = this.formActions.indexOf('I') !== -1;
            this.editBtnEnabled = this.formActions.indexOf('U') !== -1;
            this.deleteBtnEnabled = !this.insertMode && this.formActions.indexOf('D') !== -1;
        }
        if (this._navigationService) {
            var self_1 = this;
            this._navigationService.onTitleChange(function (title) {
                self_1.labelHeader = title;
            });
        }
        this.includeBreadcrumb = this._form.includeBreadcrumb && this._form.formContainer.breadcrumb;
        if (this.includeBreadcrumb) {
            this._form.formContainer.breadcrumb = false;
        }
    };
    OFormToolbarComponent.prototype.ngOnDestroy = function () {
        if (this.formCacheSubscription) {
            this.formCacheSubscription.unsubscribe();
        }
        if (this.mutationObservers) {
            this.mutationObservers.forEach(function (m) {
                m.disconnect();
            });
        }
    };
    OFormToolbarComponent.prototype.ngAfterViewInit = function () {
        this.parsePermissions();
        if (this.includeBreadcrumb) {
            this._form.formContainer.createBreadcrumb(this.breadContainer);
        }
    };
    OFormToolbarComponent.prototype.setInitialMode = function () {
        this.manageEditableDetail();
        this.initialMode = true;
        this.insertMode = false;
        this.editMode = false;
    };
    OFormToolbarComponent.prototype.setInsertMode = function () {
        this.initialMode = false;
        this.insertMode = true;
        this.editMode = false;
    };
    OFormToolbarComponent.prototype.setEditMode = function () {
        this.initialMode = false;
        this.insertMode = false;
        this.editMode = true;
    };
    OFormToolbarComponent.prototype.onCloseDetail = function () {
        this._form.executeToolbarAction(Codes.CLOSE_DETAIL_ACTION, {
            changeToolbarMode: true
        });
    };
    OFormToolbarComponent.prototype.onBack = function () {
        this._form.executeToolbarAction(Codes.BACK_ACTION);
    };
    OFormToolbarComponent.prototype.onReload = function () {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_REFRESH)) {
            return;
        }
        var self = this;
        this._form.showConfirmDiscardChanges().then(function (val) {
            if (val) {
                self._form.executeToolbarAction(Codes.RELOAD_ACTION);
            }
        });
    };
    OFormToolbarComponent.prototype.onInsert = function () {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_INSERT)) {
            return;
        }
        this._form.executeToolbarAction(Codes.GO_INSERT_ACTION, {
            changeToolbarMode: true
        });
    };
    OFormToolbarComponent.prototype.onEdit = function () {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
            return;
        }
        this._form.executeToolbarAction(Codes.GO_EDIT_ACTION, {
            changeToolbarMode: true
        });
    };
    OFormToolbarComponent.prototype.onDelete = function () {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_DELETE)) {
            return;
        }
        this.showConfirmDelete();
    };
    OFormToolbarComponent.prototype.onSave = function () {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
            return;
        }
        this.handleAcceptEditOperation();
    };
    OFormToolbarComponent.prototype.cancelOperation = function () {
        if (this.isDetail) {
            this.onCloseDetail();
        }
        else if (this.insertMode) {
            this.onBack();
        }
        else {
            this.onReload();
            this._form.setInitialMode();
        }
    };
    OFormToolbarComponent.prototype.acceptOperation = function () {
        if (this.editMode) {
            if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
                return;
            }
            this.handleAcceptEditOperation();
        }
        else if (this.insertMode) {
            if (!this.checkEnabledPermission(PermissionsUtils.ACTION_INSERT)) {
                return;
            }
            this.handleAcceptInsertOperation();
        }
    };
    OFormToolbarComponent.prototype.handleAcceptInsertOperation = function () {
        this._form.executeToolbarAction(Codes.INSERT_ACTION);
    };
    OFormToolbarComponent.prototype.handleAcceptEditOperation = function () {
        this._form.executeToolbarAction(Codes.EDIT_ACTION);
    };
    OFormToolbarComponent.prototype.showConfirmDelete = function () {
        var _this = this;
        this._dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(function (res) {
            if (res === true) {
                _this._form.executeToolbarAction(Codes.DELETE_ACTION).subscribe(function (resp) {
                    _this._form.onDelete.emit(resp);
                    _this.onCloseDetail();
                }, function (err) {
                    console.error('OFormToolbar.delete error', err);
                });
            }
        });
    };
    Object.defineProperty(OFormToolbarComponent.prototype, "showNavigation", {
        get: function () {
            return this.showHeaderNavigation && !(this._form.getFormManager() && this._form.getFormManager().isTabMode());
        },
        enumerable: true,
        configurable: true
    });
    OFormToolbarComponent.prototype.getLabelHeaderAlign = function () {
        return this.labelHeaderAlign;
    };
    Object.defineProperty(OFormToolbarComponent.prototype, "showUndoButton", {
        get: function () {
            return this._form.undoButton && (!this.initialMode || this._form.isEditableDetail());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormToolbarComponent.prototype, "isChangesStackEmpty", {
        get: function () {
            return this._form.isCacheStackEmpty;
        },
        enumerable: true,
        configurable: true
    });
    OFormToolbarComponent.prototype.onUndoLastChange = function () {
        this._form.executeToolbarAction(Codes.UNDO_LAST_CHANGE_ACTION);
    };
    Object.defineProperty(OFormToolbarComponent.prototype, "isRefreshBtnEnabled", {
        get: function () {
            return this.refreshBtnEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormToolbarComponent.prototype, "isInsertBtnEnabled", {
        get: function () {
            return this.insertBtnEnabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormToolbarComponent.prototype, "isDeleteBtnEnabled", {
        get: function () {
            return this.deleteBtnEnabled;
        },
        enumerable: true,
        configurable: true
    });
    OFormToolbarComponent.prototype.hasEnabledPermission = function (permission) {
        return permission ? permission.enabled : true;
    };
    Object.defineProperty(OFormToolbarComponent.prototype, "includeBreadcrumb", {
        get: function () {
            return this._includeBreadcrumb;
        },
        set: function (arg) {
            this._includeBreadcrumb = arg;
        },
        enumerable: true,
        configurable: true
    });
    OFormToolbarComponent.prototype.manageEditableDetail = function () {
        var isEditableDetail = this._form.isEditableDetail();
        var updatePermissions = (this.actionsPermissions || []).find(function (p) { return p.attr === PermissionsUtils.ACTION_UPDATE; });
        if (this.hasEnabledPermission(updatePermissions)) {
            this.saveBtnEnabled = isEditableDetail;
        }
        this.refreshBtnEnabled = this.refreshBtnEnabled && isEditableDetail;
        this.insertBtnEnabled = this.insertBtnEnabled && isEditableDetail;
        this.editBtnEnabled = this.editBtnEnabled && !isEditableDetail;
        var self = this;
        this._form.getFormCache().onCacheStateChanges.asObservable().subscribe(function (value) {
            if (self._form.isEditableDetail()) {
                self.changesToSave = self._form.isInitialStateChanged();
            }
        });
    };
    OFormToolbarComponent.prototype.parsePermissions = function () {
        if (this._form.oattr) {
            this.actionsPermissions = this._form.getActionsPermissions();
            if (!Util.isDefined(this.actionsPermissions)) {
                return;
            }
            var self_2 = this;
            this.actionsPermissions.forEach(function (permission) {
                self_2.permissionManagement(permission);
                if (PermissionsUtils.STANDARD_ACTIONS.indexOf(permission.attr) > -1) {
                    if (permission.attr === PermissionsUtils.ACTION_UPDATE) {
                        self_2.permissionManagement(permission, 'edit');
                    }
                }
            });
        }
    };
    OFormToolbarComponent.prototype.permissionManagement = function (permission, attr) {
        var attrAction = Util.isDefined(attr) ? attr : permission.attr;
        var elementByAction = this.element.nativeElement.querySelector('[attr="' + attrAction + '"]');
        if (Util.isDefined(elementByAction)) {
            if (!permission.visible) {
                elementByAction.remove();
            }
            else {
                if (!permission.enabled) {
                    elementByAction.disabled = true;
                    var mutationObserver = PermissionsUtils.registerDisabledChangesInDom(elementByAction);
                    this.mutationObservers.push(mutationObserver);
                }
            }
        }
    };
    OFormToolbarComponent.prototype.checkEnabledPermission = function (attr) {
        var permissions = (this.actionsPermissions || []).find(function (p) { return p.attr === attr; });
        var enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
        if (!enabledPermision) {
            this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
        }
        return enabledPermision;
    };
    OFormToolbarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-form-toolbar',
                    template: "<mat-toolbar class=\"o-form-toolbar-header\" [class.breadcrumb]=\"includeBreadcrumb\" fxLayout=\"column\" fxLayoutAlign=\"center center\">\n\n  <ng-template *ngIf=\"includeBreadcrumb\" #breadcrumb></ng-template>\n\n  <div class=\"mat-toolbar-tools\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n    <button type=\"button\" mat-icon-button (click)=\"onBack()\" *ngIf=\"isDetail\" class=\"o-form-toolbar-button o-form-toolbar-back\">\n      <mat-icon svgIcon=\"ontimize:arrow_back\"></mat-icon>\n    </button>\n\n    <o-form-navigation #formNavigation *ngIf=\"showNavigation\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n    </o-form-navigation>\n\n    <span *ngIf=\"getLabelHeaderAlign() === 'center' || getLabelHeaderAlign() === 'end'\" class=\"fill-remaining\"></span>\n    <div *ngIf=\"labelHeader!=''\" fxLayout=\"row\" fxLayoutAlign=\"center center\">\n      <span>{{ labelHeader | oTranslate }}</span>\n    </div>\n    <span *ngIf=\"getLabelHeaderAlign() === 'start' || getLabelHeaderAlign() === 'center'\" class=\"fill-remaining\"></span>\n\n    <ng-content select=\"[o-custom-form-toolbar-buttons-wrapper]\"></ng-content>\n\n    <ng-template [ngIf]=\"showHeaderActionsText\" [ngIfElse]=\"undoBtnWithoutText\">\n      <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-undo\" mat-stroked-button (click)=\"onUndoLastChange()\"\n        [disabled]=\"isChangesStackEmpty\" *ngIf=\"showUndoButton\">\n        <mat-icon svgIcon=\"ontimize:undo\"></mat-icon>\n        <span>{{ 'UNDO' | oTranslate }}</span>\n      </button>\n    </ng-template>\n    <ng-template #undoBtnWithoutText>\n      <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-undo\" mat-icon-button (click)=\"onUndoLastChange()\"\n        [disabled]=\"isChangesStackEmpty\" *ngIf=\"showUndoButton\">\n        <mat-icon svgIcon=\"ontimize:undo\"></mat-icon>\n      </button>\n    </ng-template>\n\n    <ng-container *ngIf=\"initialMode\">\n      <ng-template [ngIf]=\"showHeaderActionsText\" [ngIfElse]=\"buttonsWithouText\">\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-refresh\" mat-stroked-button (click)=\"onReload()\"\n          *ngIf=\"isRefreshBtnEnabled\" attr=\"refresh\">\n          <mat-icon svgIcon=\"ontimize:autorenew\"></mat-icon>\n          <span>{{ 'REFRESH' | oTranslate }}</span>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-insert\" mat-stroked-button (click)=\"onInsert()\"\n          *ngIf=\"isInsertBtnEnabled\" attr=\"insert\">\n          <mat-icon svgIcon=\"ontimize:add\"></mat-icon>\n          <span>{{ 'ADD' | oTranslate }}</span>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-edit\" mat-stroked-button (click)=\"onEdit()\"\n          *ngIf=\"isEditBtnEnabled | async\" attr=\"edit\">\n          <mat-icon svgIcon=\"ontimize:edit\"></mat-icon>\n          <span>{{ 'EDIT' | oTranslate }}</span>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-delete\" mat-stroked-button (click)=\"onDelete()\"\n          *ngIf=\"isDeleteBtnEnabled\" attr=\"delete\">\n          <mat-icon svgIcon=\"ontimize:delete\"></mat-icon>\n          <span>{{ 'DELETE' | oTranslate }}</span>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-save\" mat-stroked-button (click)=\"onSave()\"\n          [disabled]=\"!(existsChangesToSave | async)\" *ngIf=\"isSaveBtnEnabled | async\" attr=\"update\">\n          <mat-icon svgIcon=\"ontimize:save\"></mat-icon>\n          <span>{{ 'SAVE' | oTranslate }}</span>\n        </button>\n      </ng-template>\n      <ng-template #buttonsWithouText>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-refresh\" mat-icon-button (click)=\"onReload()\"\n          *ngIf=\"isRefreshBtnEnabled\" attr=\"refresh\">\n          <mat-icon svgIcon=\"ontimize:autorenew\"></mat-icon>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-insert\" mat-icon-button (click)=\"onInsert()\"\n          *ngIf=\"isInsertBtnEnabled\" attr=\"insert\">\n          <mat-icon svgIcon=\"ontimize:add\"></mat-icon>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button-o-form-toolbar-button-edit\" mat-icon-button (click)=\"onEdit()\"\n          *ngIf=\"isEditBtnEnabled | async\" attr=\"edit\">\n          <mat-icon svgIcon=\"ontimize:edit\"></mat-icon>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-delete\" mat-icon-button (click)=\"onDelete()\"\n          *ngIf=\"isDeleteBtnEnabled\" attr=\"delete\">\n          <mat-icon svgIcon=\"ontimize:delete\"></mat-icon>\n        </button>\n        <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-save\" mat-icon-button (click)=\"onSave()\"\n          [disabled]=\"!existsChangesToSave\" *ngIf=\"isSaveBtnEnabled | async\" attr=\"update\">\n          <mat-icon svgIcon=\"ontimize:save\"></mat-icon>\n        </button>\n      </ng-template>\n    </ng-container>\n\n    <ng-container *ngIf=\"editMode || insertMode\">\n      <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-cancel\" mat-stroked-button (click)=\"cancelOperation()\">\n        <mat-icon svgIcon=\"ontimize:clear\"></mat-icon>\n        <span *ngIf=\"showHeaderActionsText\">{{ 'CANCEL' | oTranslate }}</span>\n      </button>\n      <button type=\"button\" class=\"o-form-toolbar-button o-form-toolbar-button-insert\" mat-stroked-button color=\"primary\" (click)=\"acceptOperation()\">\n        <mat-icon svgIcon=\"ontimize:done\"></mat-icon>\n        <span *ngIf=\"showHeaderActionsText\">{{ 'INSERT' | oTranslate }}</span>\n      </button>\n    </ng-container>\n  </div>\n\n</mat-toolbar>\n",
                    inputs: DEFAULT_INPUTS_O_FORM_TOOLBAR,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-form-toolbar]': 'true'
                    },
                    styles: [".o-form-toolbar{flex:none;display:block}.o-form-toolbar .o-form-toolbar-header{min-height:50px;max-height:50px;padding:0 16px 0 4px}.o-form-toolbar .o-form-toolbar-header.breadcrumb{padding:16px;min-height:84px;max-height:84px}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools{width:100%}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools button.o-form-toolbar-button[disabled]{cursor:default}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools button.o-form-toolbar-button:not(.mat-icon-button) .mat-button-wrapper{display:flex;align-items:center}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools button.o-form-toolbar-button:not(.mat-icon-button) .mat-button-wrapper span{flex:1}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools button:not(.mat-icon-button){padding:0 6px}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools button.mat-icon-button{padding:0;margin:0}.o-form-toolbar .o-form-toolbar-header .mat-toolbar-tools button.mat-stroked-button{min-width:100px;margin:0 6px}.o-form-toolbar .o-form-toolbar-header .o-breadcrumb{width:100%;height:32px;min-height:initial}.o-form-toolbar .o-form-toolbar-header .o-breadcrumb .mat-toolbar{padding:0;min-height:initial;max-height:initial;height:100%}"]
                }] }
    ];
    OFormToolbarComponent.ctorParameters = function () { return [
        { type: OFormComponent },
        { type: ElementRef },
        { type: Injector }
    ]; };
    OFormToolbarComponent.propDecorators = {
        breadContainer: [{ type: ViewChild, args: ['breadcrumb', { read: ViewContainerRef, static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormToolbarComponent.prototype, "showHeaderActionsText", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFormToolbarComponent.prototype, "showHeaderNavigation", void 0);
    return OFormToolbarComponent;
}());
export { OFormToolbarComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLXRvb2xiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Zvcm0vdG9vbGJhci9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFHUixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUE0QixNQUFNLE1BQU0sQ0FBQztBQUVqRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUVyRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDN0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxNQUFNLENBQUMsSUFBTSw2QkFBNkIsR0FBRztJQUMzQywyQkFBMkI7SUFDM0Isc0NBQXNDO0lBQ3RDLCtCQUErQjtJQUMvQixpREFBaUQ7SUFFakQsNkNBQTZDO0NBQzlDLENBQUM7QUFFRjtJQTZGRSwrQkFDVSxLQUFxQixFQUN0QixPQUFtQixFQUNoQixRQUFrQjtRQUZwQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUN0QixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENB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bnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9vLWZvcm0uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRk9STV9UT09MQkFSID0gW1xuICAnbGFiZWxIZWFkZXI6IGxhYmVsLWhlYWRlcicsXG4gICdsYWJlbEhlYWRlckFsaWduOiBsYWJlbC1oZWFkZXItYWxpZ24nLFxuICAnaGVhZGVyYWN0aW9uczogaGVhZGVyLWFjdGlvbnMnLFxuICAnc2hvd0hlYWRlckFjdGlvbnNUZXh0OiBzaG93LWhlYWRlci1hY3Rpb25zLXRleHQnLFxuICAvLyBzaG93LWhlYWRlci1uYXZpZ2F0aW9uIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogSW5jbHVkZSBuYXZpZ2F0aW9ucyBidXR0b25zIGluIGZvcm0tdG9vbGJhci4gRGVmYXVsdDogdHJ1ZTtcbiAgJ3Nob3dIZWFkZXJOYXZpZ2F0aW9uOnNob3ctaGVhZGVyLW5hdmlnYXRpb24nXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tdG9vbGJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZm9ybS10b29sYmFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GT1JNX1RPT0xCQVIsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS10b29sYmFyXSc6ICd0cnVlJ1xuICB9XG4gIC8vIHByb3ZpZGVyczogW3sgcHJvdmlkZTogT0Zvcm1Db21wb25lbnQsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSB9XVxufSlcbmV4cG9ydCBjbGFzcyBPRm9ybVRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgLyogQmluZGluZ3MgKi9cbiAgcHVibGljIGxhYmVsSGVhZGVyOiBzdHJpbmcgPSAnJztcbiAgcHVibGljIGhlYWRlcmFjdGlvbnM6IHN0cmluZyA9ICcnO1xuICBwdWJsaWMgbGFiZWxIZWFkZXJBbGlnbjogc3RyaW5nID0gJ2NlbnRlcic7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dIZWFkZXJBY3Rpb25zVGV4dDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93SGVhZGVyTmF2aWdhdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHVibGljIGZvcm1BY3Rpb25zOiBzdHJpbmdbXTtcbiAgcHVibGljIGlzRGV0YWlsOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZWRpdE1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGluc2VydE1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGluaXRpYWxNb2RlOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHJlZnJlc2hCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpbnNlcnRCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBkZWxldGVCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQFZpZXdDaGlsZCgnYnJlYWRjcnVtYicsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgYnJlYWRDb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgcHVibGljIGlzU2F2ZUJ0bkVuYWJsZWQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIHB1YmxpYyBpc0VkaXRCdG5FbmFibGVkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICBwdWJsaWMgZXhpc3RzQ2hhbmdlc1RvU2F2ZTogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICBnZXQgY2hhbmdlc1RvU2F2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlc1RvU2F2ZTtcblxuICB9XG5cbiAgc2V0IGNoYW5nZXNUb1NhdmUodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2hhbmdlc1RvU2F2ZSA9IHZhbDtcbiAgICBjb25zdCBhdHRyID0gdGhpcy5fZm9ybS5pc0VkaXRhYmxlRGV0YWlsKCkgPyBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUgOiBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQ7XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9ICh0aGlzLmFjdGlvbnNQZXJtaXNzaW9ucyB8fCBbXSkuZmluZChwID0+IHAuYXR0ciA9PT0gYXR0cik7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHBlcm1pc3Npb25zKSAmJiBwZXJtaXNzaW9ucy5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2V4aXN0c0NoYW5nZXNUb1NhdmVTdWJqZWN0Lm5leHQodmFsKTtcblxuICB9XG5cbiAgcHJvdGVjdGVkIF9jaGFuZ2VzVG9TYXZlOiBib29sZWFuID0gZmFsc2U7XG5cblxuICBnZXQgZWRpdEJ0bkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRCdG5FbmFibGVkO1xuICB9XG4gIHNldCBlZGl0QnRuRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2VkaXRCdG5FbmFibGVkID0gdmFsdWU7XG4gICAgdGhpcy5faXNFZGl0QnRuRW5hYmxlZFN1YmplY3QubmV4dCh0aGlzLl9lZGl0QnRuRW5hYmxlZCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9lZGl0QnRuRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGdldCBzYXZlQnRuRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2F2ZUJ0bkVuYWJsZWQ7XG4gIH1cbiAgc2V0IHNhdmVCdG5FbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2F2ZUJ0bkVuYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9pc1NhdmVCdG5FbmFibGVkU3ViamVjdC5uZXh0KHRoaXMuX3NhdmVCdG5FbmFibGVkKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3NhdmVCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG5cblxuICBwcm90ZWN0ZWQgX2RpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG4gIHByb3RlY3RlZCBfbmF2aWdhdGlvblNlcnZpY2U6IE5hdmlnYXRpb25TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbXV0YXRpb25PYnNlcnZlcnM6IE11dGF0aW9uT2JzZXJ2ZXJbXSA9IFtdO1xuXG4gIHByb3RlY3RlZCBmb3JtQ2FjaGVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGFjdGlvbnNQZXJtaXNzaW9uczogT1Blcm1pc3Npb25zW107XG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcblxuICBwcm90ZWN0ZWQgX2luY2x1ZGVCcmVhZGNydW1iOiBib29sZWFuO1xuXG4gIHByb3RlY3RlZCBfaXNTYXZlQnRuRW5hYmxlZFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHJvdGVjdGVkIF9pc0VkaXRCdG5FbmFibGVkU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwcm90ZWN0ZWQgX2V4aXN0c0NoYW5nZXNUb1NhdmVTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLmlzU2F2ZUJ0bkVuYWJsZWQgPSB0aGlzLl9pc1NhdmVCdG5FbmFibGVkU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB0aGlzLmlzRWRpdEJ0bkVuYWJsZWQgPSB0aGlzLl9pc0VkaXRCdG5FbmFibGVkU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB0aGlzLmV4aXN0c0NoYW5nZXNUb1NhdmUgPSB0aGlzLl9leGlzdHNDaGFuZ2VzVG9TYXZlU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIHRoaXMuX2Zvcm0ucmVnaXN0ZXJUb29sYmFyKHRoaXMpO1xuICAgIHRoaXMuX2RpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLl9uYXZpZ2F0aW9uU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5hdmlnYXRpb25TZXJ2aWNlKTtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtQWN0aW9ucyA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmhlYWRlcmFjdGlvbnMpO1xuICAgIGlmICh0aGlzLmZvcm1BY3Rpb25zICYmIHRoaXMuZm9ybUFjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5yZWZyZXNoQnRuRW5hYmxlZCA9IHRoaXMuZm9ybUFjdGlvbnMuaW5kZXhPZignUicpICE9PSAtMTtcbiAgICAgIHRoaXMuaW5zZXJ0QnRuRW5hYmxlZCA9IHRoaXMuZm9ybUFjdGlvbnMuaW5kZXhPZignSScpICE9PSAtMTtcbiAgICAgIHRoaXMuZWRpdEJ0bkVuYWJsZWQgPSB0aGlzLmZvcm1BY3Rpb25zLmluZGV4T2YoJ1UnKSAhPT0gLTE7XG4gICAgICB0aGlzLmRlbGV0ZUJ0bkVuYWJsZWQgPSAhdGhpcy5pbnNlcnRNb2RlICYmIHRoaXMuZm9ybUFjdGlvbnMuaW5kZXhPZignRCcpICE9PSAtMTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX25hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuX25hdmlnYXRpb25TZXJ2aWNlLm9uVGl0bGVDaGFuZ2UodGl0bGUgPT4ge1xuICAgICAgICBzZWxmLmxhYmVsSGVhZGVyID0gdGl0bGU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5pbmNsdWRlQnJlYWRjcnVtYiA9IHRoaXMuX2Zvcm0uaW5jbHVkZUJyZWFkY3J1bWIgJiYgdGhpcy5fZm9ybS5mb3JtQ29udGFpbmVyLmJyZWFkY3J1bWI7XG4gICAgaWYgKHRoaXMuaW5jbHVkZUJyZWFkY3J1bWIpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZm9ybUNvbnRhaW5lci5icmVhZGNydW1iID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1DYWNoZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5mb3JtQ2FjaGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubXV0YXRpb25PYnNlcnZlcnMpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMuZm9yRWFjaCgobTogTXV0YXRpb25PYnNlcnZlcikgPT4ge1xuICAgICAgICBtLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJzZVBlcm1pc3Npb25zKCk7XG4gICAgaWYgKHRoaXMuaW5jbHVkZUJyZWFkY3J1bWIpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZm9ybUNvbnRhaW5lci5jcmVhdGVCcmVhZGNydW1iKHRoaXMuYnJlYWRDb250YWluZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRJbml0aWFsTW9kZSgpOiB2b2lkIHtcbiAgICB0aGlzLm1hbmFnZUVkaXRhYmxlRGV0YWlsKCk7XG4gICAgdGhpcy5pbml0aWFsTW9kZSA9IHRydWU7XG4gICAgdGhpcy5pbnNlcnRNb2RlID0gZmFsc2U7XG4gICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHNldEluc2VydE1vZGUoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsTW9kZSA9IGZhbHNlO1xuICAgIHRoaXMuaW5zZXJ0TW9kZSA9IHRydWU7XG4gICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHNldEVkaXRNb2RlKCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbE1vZGUgPSBmYWxzZTtcbiAgICB0aGlzLmluc2VydE1vZGUgPSBmYWxzZTtcbiAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsb3NlRGV0YWlsKCk6IHZvaWQge1xuICAgIHRoaXMuX2Zvcm0uZXhlY3V0ZVRvb2xiYXJBY3Rpb24oQ29kZXMuQ0xPU0VfREVUQUlMX0FDVElPTiwge1xuICAgICAgY2hhbmdlVG9vbGJhck1vZGU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5CQUNLX0FDVElPTik7XG4gIH1cblxuICBwdWJsaWMgb25SZWxvYWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fUkVGUkVTSCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fZm9ybS5zaG93Q29uZmlybURpc2NhcmRDaGFuZ2VzKCkudGhlbih2YWwgPT4ge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBzZWxmLl9mb3JtLmV4ZWN1dGVUb29sYmFyQWN0aW9uKENvZGVzLlJFTE9BRF9BQ1RJT04pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uSW5zZXJ0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0lOU0VSVCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9mb3JtLmV4ZWN1dGVUb29sYmFyQWN0aW9uKENvZGVzLkdPX0lOU0VSVF9BQ1RJT04sIHtcbiAgICAgIGNoYW5nZVRvb2xiYXJNb2RlOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25FZGl0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9mb3JtLmV4ZWN1dGVUb29sYmFyQWN0aW9uKENvZGVzLkdPX0VESVRfQUNUSU9OLCB7XG4gICAgICBjaGFuZ2VUb29sYmFyTW9kZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uRGVsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0RFTEVURSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNob3dDb25maXJtRGVsZXRlKCk7XG4gIH1cblxuICBwdWJsaWMgb25TYXZlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUFjY2VwdEVkaXRPcGVyYXRpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5jZWxPcGVyYXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNEZXRhaWwpIHtcbiAgICAgIHRoaXMub25DbG9zZURldGFpbCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnNlcnRNb2RlKSB7XG4gICAgICB0aGlzLm9uQmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uUmVsb2FkKCk7XG4gICAgICB0aGlzLl9mb3JtLnNldEluaXRpYWxNb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFjY2VwdE9wZXJhdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fVVBEQVRFKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZUFjY2VwdEVkaXRPcGVyYXRpb24oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zZXJ0TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fSU5TRVJUKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZUFjY2VwdEluc2VydE9wZXJhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBY2NlcHRJbnNlcnRPcGVyYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5JTlNFUlRfQUNUSU9OKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBY2NlcHRFZGl0T3BlcmF0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX2Zvcm0uZXhlY3V0ZVRvb2xiYXJBY3Rpb24oQ29kZXMuRURJVF9BQ1RJT04pO1xuICB9XG5cbiAgcHVibGljIHNob3dDb25maXJtRGVsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuX2RpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0RFTEVURScpLnRoZW4ocmVzID0+IHtcbiAgICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5ERUxFVEVfQUNUSU9OKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICAgICAgdGhpcy5fZm9ybS5vbkRlbGV0ZS5lbWl0KHJlc3ApO1xuICAgICAgICAgIHRoaXMub25DbG9zZURldGFpbCgpO1xuICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ09Gb3JtVG9vbGJhci5kZWxldGUgZXJyb3InLCBlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGdldCBzaG93TmF2aWdhdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93SGVhZGVyTmF2aWdhdGlvbiAmJiAhKHRoaXMuX2Zvcm0uZ2V0Rm9ybU1hbmFnZXIoKSAmJiB0aGlzLl9mb3JtLmdldEZvcm1NYW5hZ2VyKCkuaXNUYWJNb2RlKCkpO1xuICB9XG5cbiAgcHVibGljIGdldExhYmVsSGVhZGVyQWxpZ24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbEhlYWRlckFsaWduO1xuICB9XG5cbiAgZ2V0IHNob3dVbmRvQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb3JtLnVuZG9CdXR0b24gJiYgKCF0aGlzLmluaXRpYWxNb2RlIHx8IHRoaXMuX2Zvcm0uaXNFZGl0YWJsZURldGFpbCgpKTtcbiAgfVxuXG4gIGdldCBpc0NoYW5nZXNTdGFja0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb3JtLmlzQ2FjaGVTdGFja0VtcHR5O1xuICB9XG5cbiAgcHVibGljIG9uVW5kb0xhc3RDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5VTkRPX0xBU1RfQ0hBTkdFX0FDVElPTik7XG4gIH1cblxuICBnZXQgaXNSZWZyZXNoQnRuRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yZWZyZXNoQnRuRW5hYmxlZDtcbiAgfVxuXG4gIGdldCBpc0luc2VydEJ0bkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QnRuRW5hYmxlZDtcbiAgfVxuXG4gIGdldCBpc0RlbGV0ZUJ0bkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlQnRuRW5hYmxlZDtcbiAgfVxuXG4gIHB1YmxpYyBoYXNFbmFibGVkUGVybWlzc2lvbihwZXJtaXNzaW9uOiBPUGVybWlzc2lvbnMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcGVybWlzc2lvbiA/IHBlcm1pc3Npb24uZW5hYmxlZCA6IHRydWU7XG4gIH1cblxuICBnZXQgaW5jbHVkZUJyZWFkY3J1bWIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2luY2x1ZGVCcmVhZGNydW1iO1xuICB9XG5cbiAgc2V0IGluY2x1ZGVCcmVhZGNydW1iKGFyZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2luY2x1ZGVCcmVhZGNydW1iID0gYXJnO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1hbmFnZUVkaXRhYmxlRGV0YWlsKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzRWRpdGFibGVEZXRhaWwgPSB0aGlzLl9mb3JtLmlzRWRpdGFibGVEZXRhaWwoKTtcblxuICAgIGNvbnN0IHVwZGF0ZVBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSAodGhpcy5hY3Rpb25zUGVybWlzc2lvbnMgfHwgW10pLmZpbmQocCA9PiBwLmF0dHIgPT09IFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSk7XG4gICAgaWYgKHRoaXMuaGFzRW5hYmxlZFBlcm1pc3Npb24odXBkYXRlUGVybWlzc2lvbnMpKSB7XG4gICAgICB0aGlzLnNhdmVCdG5FbmFibGVkID0gaXNFZGl0YWJsZURldGFpbDtcbiAgICB9XG5cbiAgICB0aGlzLnJlZnJlc2hCdG5FbmFibGVkID0gdGhpcy5yZWZyZXNoQnRuRW5hYmxlZCAmJiBpc0VkaXRhYmxlRGV0YWlsO1xuICAgIHRoaXMuaW5zZXJ0QnRuRW5hYmxlZCA9IHRoaXMuaW5zZXJ0QnRuRW5hYmxlZCAmJiBpc0VkaXRhYmxlRGV0YWlsO1xuICAgIHRoaXMuZWRpdEJ0bkVuYWJsZWQgPSB0aGlzLmVkaXRCdG5FbmFibGVkICYmICFpc0VkaXRhYmxlRGV0YWlsO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fZm9ybS5nZXRGb3JtQ2FjaGUoKS5vbkNhY2hlU3RhdGVDaGFuZ2VzLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgaWYgKHNlbGYuX2Zvcm0uaXNFZGl0YWJsZURldGFpbCgpKSB7XG4gICAgICAgIHNlbGYuY2hhbmdlc1RvU2F2ZSA9IHNlbGYuX2Zvcm0uaXNJbml0aWFsU3RhdGVDaGFuZ2VkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VQZXJtaXNzaW9ucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9ybS5vYXR0cikge1xuICAgICAgdGhpcy5hY3Rpb25zUGVybWlzc2lvbnMgPSB0aGlzLl9mb3JtLmdldEFjdGlvbnNQZXJtaXNzaW9ucygpO1xuXG4gICAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuYWN0aW9uc1Blcm1pc3Npb25zKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuYWN0aW9uc1Blcm1pc3Npb25zLmZvckVhY2goKHBlcm1pc3Npb246IE9QZXJtaXNzaW9ucykgPT4ge1xuICAgICAgICAvLyBvdGhlcnMgYWN0aW9uc1xuICAgICAgICBzZWxmLnBlcm1pc3Npb25NYW5hZ2VtZW50KHBlcm1pc3Npb24pO1xuXG4gICAgICAgIGlmIChQZXJtaXNzaW9uc1V0aWxzLlNUQU5EQVJEX0FDVElPTlMuaW5kZXhPZihwZXJtaXNzaW9uLmF0dHIpID4gLTEpIHtcbiAgICAgICAgICAvLyBhY3Rpb25zIFI7STtVO0RcbiAgICAgICAgICBpZiAocGVybWlzc2lvbi5hdHRyID09PSBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUpIHtcbiAgICAgICAgICAgIHNlbGYucGVybWlzc2lvbk1hbmFnZW1lbnQocGVybWlzc2lvbiwgJ2VkaXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVybWlzc2lvbk1hbmFnZW1lbnQocGVybWlzc2lvbjogT1Blcm1pc3Npb25zLCBhdHRyPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ckFjdGlvbiA9IFV0aWwuaXNEZWZpbmVkKGF0dHIpID8gYXR0ciA6IHBlcm1pc3Npb24uYXR0cjtcbiAgICBjb25zdCBlbGVtZW50QnlBY3Rpb24gPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbYXR0cj1cIicgKyBhdHRyQWN0aW9uICsgJ1wiXScpO1xuXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVsZW1lbnRCeUFjdGlvbikpIHtcbiAgICAgIGlmICghcGVybWlzc2lvbi52aXNpYmxlKSB7XG4gICAgICAgIGVsZW1lbnRCeUFjdGlvbi5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghcGVybWlzc2lvbi5lbmFibGVkKSB7XG4gICAgICAgICAgZWxlbWVudEJ5QWN0aW9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICBjb25zdCBtdXRhdGlvbk9ic2VydmVyID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGVsZW1lbnRCeUFjdGlvbik7XG4gICAgICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG11dGF0aW9uT2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0VuYWJsZWRQZXJtaXNzaW9uKGF0dHIpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zID0gKHRoaXMuYWN0aW9uc1Blcm1pc3Npb25zIHx8IFtdKS5maW5kKHAgPT4gcC5hdHRyID09PSBhdHRyKTtcbiAgICBjb25zdCBlbmFibGVkUGVybWlzaW9uID0gUGVybWlzc2lvbnNVdGlscy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKHBlcm1pc3Npb25zKTtcbiAgICBpZiAoIWVuYWJsZWRQZXJtaXNpb24pIHtcbiAgICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLk9QRVJBVElPTl9OT1RfQUxMT1dFRF9QRVJNSVNTSU9OJyk7XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVkUGVybWlzaW9uO1xuICB9XG5cbn1cbiJdfQ==