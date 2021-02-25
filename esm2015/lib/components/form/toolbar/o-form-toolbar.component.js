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
export const DEFAULT_INPUTS_O_FORM_TOOLBAR = [
    'labelHeader: label-header',
    'labelHeaderAlign: label-header-align',
    'headeractions: header-actions',
    'showHeaderActionsText: show-header-actions-text',
    'showHeaderNavigation:show-header-navigation'
];
export class OFormToolbarComponent {
    constructor(_form, element, injector) {
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
    get changesToSave() {
        return this._changesToSave;
    }
    set changesToSave(val) {
        this._changesToSave = val;
        const attr = this._form.isEditableDetail() ? PermissionsUtils.ACTION_UPDATE : PermissionsUtils.ACTION_INSERT;
        const permissions = (this.actionsPermissions || []).find(p => p.attr === attr);
        if (Util.isDefined(permissions) && permissions.enabled === false) {
            return;
        }
        this._existsChangesToSaveSubject.next(val);
    }
    get editBtnEnabled() {
        return this._editBtnEnabled;
    }
    set editBtnEnabled(value) {
        this._editBtnEnabled = value;
        this._isEditBtnEnabledSubject.next(this._editBtnEnabled);
    }
    get saveBtnEnabled() {
        return this._saveBtnEnabled;
    }
    set saveBtnEnabled(value) {
        this._saveBtnEnabled = value;
        this._isSaveBtnEnabledSubject.next(this._saveBtnEnabled);
    }
    ngOnInit() {
        this.formActions = Util.parseArray(this.headeractions);
        if (this.formActions && this.formActions.length > 0) {
            this.refreshBtnEnabled = this.formActions.indexOf('R') !== -1;
            this.insertBtnEnabled = this.formActions.indexOf('I') !== -1;
            this.editBtnEnabled = this.formActions.indexOf('U') !== -1;
            this.deleteBtnEnabled = !this.insertMode && this.formActions.indexOf('D') !== -1;
        }
        if (this._navigationService) {
            const self = this;
            this._navigationService.onTitleChange(title => {
                self.labelHeader = title;
            });
        }
        this.includeBreadcrumb = this._form.includeBreadcrumb && this._form.formContainer.breadcrumb;
        if (this.includeBreadcrumb) {
            this._form.formContainer.breadcrumb = false;
        }
    }
    ngOnDestroy() {
        if (this.formCacheSubscription) {
            this.formCacheSubscription.unsubscribe();
        }
        if (this.mutationObservers) {
            this.mutationObservers.forEach((m) => {
                m.disconnect();
            });
        }
    }
    ngAfterViewInit() {
        this.parsePermissions();
        if (this.includeBreadcrumb) {
            this._form.formContainer.createBreadcrumb(this.breadContainer);
        }
    }
    setInitialMode() {
        this.manageEditableDetail();
        this.initialMode = true;
        this.insertMode = false;
        this.editMode = false;
    }
    setInsertMode() {
        this.initialMode = false;
        this.insertMode = true;
        this.editMode = false;
    }
    setEditMode() {
        this.initialMode = false;
        this.insertMode = false;
        this.editMode = true;
    }
    onCloseDetail() {
        this._form.executeToolbarAction(Codes.CLOSE_DETAIL_ACTION, {
            changeToolbarMode: true
        });
    }
    onBack() {
        this._form.executeToolbarAction(Codes.BACK_ACTION);
    }
    onReload() {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_REFRESH)) {
            return;
        }
        const self = this;
        this._form.showConfirmDiscardChanges().then(val => {
            if (val) {
                self._form.executeToolbarAction(Codes.RELOAD_ACTION);
            }
        });
    }
    onInsert() {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_INSERT)) {
            return;
        }
        this._form.executeToolbarAction(Codes.GO_INSERT_ACTION, {
            changeToolbarMode: true
        });
    }
    onEdit() {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
            return;
        }
        this._form.executeToolbarAction(Codes.GO_EDIT_ACTION, {
            changeToolbarMode: true
        });
    }
    onDelete() {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_DELETE)) {
            return;
        }
        this.showConfirmDelete();
    }
    onSave() {
        if (!this.checkEnabledPermission(PermissionsUtils.ACTION_UPDATE)) {
            return;
        }
        this.handleAcceptEditOperation();
    }
    cancelOperation() {
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
    }
    acceptOperation() {
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
    }
    handleAcceptInsertOperation() {
        this._form.executeToolbarAction(Codes.INSERT_ACTION);
    }
    handleAcceptEditOperation() {
        this._form.executeToolbarAction(Codes.EDIT_ACTION);
    }
    showConfirmDelete() {
        this._dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
            if (res === true) {
                this._form.executeToolbarAction(Codes.DELETE_ACTION).subscribe(resp => {
                    this._form.onDelete.emit(resp);
                    this.onCloseDetail();
                }, err => {
                    console.error('OFormToolbar.delete error', err);
                });
            }
        });
    }
    get showNavigation() {
        return this.showHeaderNavigation && !(this._form.getFormManager() && this._form.getFormManager().isTabMode());
    }
    getLabelHeaderAlign() {
        return this.labelHeaderAlign;
    }
    get showUndoButton() {
        return this._form.undoButton && (!this.initialMode || this._form.isEditableDetail());
    }
    get isChangesStackEmpty() {
        return this._form.isCacheStackEmpty;
    }
    onUndoLastChange() {
        this._form.executeToolbarAction(Codes.UNDO_LAST_CHANGE_ACTION);
    }
    get isRefreshBtnEnabled() {
        return this.refreshBtnEnabled;
    }
    get isInsertBtnEnabled() {
        return this.insertBtnEnabled;
    }
    get isDeleteBtnEnabled() {
        return this.deleteBtnEnabled;
    }
    hasEnabledPermission(permission) {
        return permission ? permission.enabled : true;
    }
    get includeBreadcrumb() {
        return this._includeBreadcrumb;
    }
    set includeBreadcrumb(arg) {
        this._includeBreadcrumb = arg;
    }
    manageEditableDetail() {
        const isEditableDetail = this._form.isEditableDetail();
        const updatePermissions = (this.actionsPermissions || []).find(p => p.attr === PermissionsUtils.ACTION_UPDATE);
        if (this.hasEnabledPermission(updatePermissions)) {
            this.saveBtnEnabled = isEditableDetail;
        }
        this.refreshBtnEnabled = this.refreshBtnEnabled && isEditableDetail;
        this.insertBtnEnabled = this.insertBtnEnabled && isEditableDetail;
        this.editBtnEnabled = this.editBtnEnabled && !isEditableDetail;
        const self = this;
        this._form.getFormCache().onCacheStateChanges.asObservable().subscribe((value) => {
            if (self._form.isEditableDetail()) {
                self.changesToSave = self._form.isInitialStateChanged();
            }
        });
    }
    parsePermissions() {
        if (this._form.oattr) {
            this.actionsPermissions = this._form.getActionsPermissions();
            if (!Util.isDefined(this.actionsPermissions)) {
                return;
            }
            const self = this;
            this.actionsPermissions.forEach((permission) => {
                self.permissionManagement(permission);
                if (PermissionsUtils.STANDARD_ACTIONS.indexOf(permission.attr) > -1) {
                    if (permission.attr === PermissionsUtils.ACTION_UPDATE) {
                        self.permissionManagement(permission, 'edit');
                    }
                }
            });
        }
    }
    permissionManagement(permission, attr) {
        const attrAction = Util.isDefined(attr) ? attr : permission.attr;
        const elementByAction = this.element.nativeElement.querySelector('[attr="' + attrAction + '"]');
        if (Util.isDefined(elementByAction)) {
            if (!permission.visible) {
                elementByAction.remove();
            }
            else {
                if (!permission.enabled) {
                    elementByAction.disabled = true;
                    const mutationObserver = PermissionsUtils.registerDisabledChangesInDom(elementByAction);
                    this.mutationObservers.push(mutationObserver);
                }
            }
        }
    }
    checkEnabledPermission(attr) {
        const permissions = (this.actionsPermissions || []).find(p => p.attr === attr);
        const enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
        if (!enabledPermision) {
            this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
        }
        return enabledPermision;
    }
}
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
OFormToolbarComponent.ctorParameters = () => [
    { type: OFormComponent },
    { type: ElementRef },
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLXRvb2xiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Zvcm0vdG9vbGJhci9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFHUixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUE0QixNQUFNLE1BQU0sQ0FBQztBQUVqRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQUVyRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDN0QsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRztJQUMzQywyQkFBMkI7SUFDM0Isc0NBQXNDO0lBQ3RDLCtCQUErQjtJQUMvQixpREFBaUQ7SUFFakQsNkNBQTZDO0NBQzlDLENBQUM7QUFhRixNQUFNLE9BQU8scUJBQXFCO0lBa0ZoQyxZQUNVLEtBQXFCLEVBQ3RCLE9BQW1CLEVBQ2hCLFFBQWtCO1FBRnBCLFVBQUssR0FBTCxLQUFLLENBQWdCO1FBQ3RCLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWxGdkIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFDekIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFDM0IscUJBQWdCLEdBQVcsUUFBUSxDQUFDO1FBR3BDLDBCQUFxQixHQUFZLElBQUksQ0FBQztRQUV0Qyx5QkFBb0IsR0FBWSxJQUFJLENBQUM7UUFHckMsYUFBUSxHQUFZLElBQUksQ0FBQztRQUV6QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLGVBQVUsR0FBWSxLQUFLLENBQUM7UUFDNUIsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFDNUIsc0JBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQyxxQkFBZ0IsR0FBWSxLQUFLLENBQUM7UUEwQi9CLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBVWhDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBU2pDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBS2pDLHNCQUFpQixHQUF1QixFQUFFLENBQUM7UUFRM0MsNkJBQXdCLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDL0QsNkJBQXdCLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFDL0QsZ0NBQTJCLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFPMUUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JFLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFM0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFsRUQsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBRTdCLENBQUM7SUFFRCxJQUFJLGFBQWEsQ0FBQyxHQUFZO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1FBQzFCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7UUFDN0csTUFBTSxXQUFXLEdBQWlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDN0YsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO1lBQ2hFLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFN0MsQ0FBQztJQUtELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUNELElBQUksY0FBYyxDQUFDLEtBQWM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUdELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUNELElBQUksY0FBYyxDQUFDLEtBQWM7UUFDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQWlDTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN2RCxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25ELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMzRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2xGO1FBQ0QsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7UUFDN0YsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUM3QztJQUNILENBQUM7SUFFTSxXQUFXO1FBQ2hCLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMxQztRQUNELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFtQixFQUFFLEVBQUU7Z0JBQ3JELENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVNLGVBQWU7UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQztJQUVNLGNBQWM7UUFDbkIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUVNLGFBQWE7UUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQUVNLFdBQVc7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVNLGFBQWE7UUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUU7WUFDekQsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNqRSxPQUFPO1NBQ1I7UUFDRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN0RDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2hFLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQ3RELGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLE1BQU07UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ2hFLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRTtZQUNwRCxpQkFBaUIsRUFBRSxJQUFJO1NBQ3hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUNoRSxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDaEUsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVNLGVBQWU7UUFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRU0sZUFBZTtRQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDaEUsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7U0FDbEM7YUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDaEUsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRU0sMkJBQTJCO1FBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFTSx5QkFBeUI7UUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLGlCQUFpQjtRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDM0UsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3BFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN2QixDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDbEQsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FDQSxDQUFDO0lBQ0osQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDaEgsQ0FBQztJQUVNLG1CQUFtQjtRQUN4QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELElBQUksbUJBQW1CO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztJQUN0QyxDQUFDO0lBRU0sZ0JBQWdCO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELElBQUksbUJBQW1CO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLGtCQUFrQjtRQUNwQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQixDQUFDO0lBRUQsSUFBSSxrQkFBa0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0IsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFVBQXdCO1FBQ2xELE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDaEQsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLGlCQUFpQixDQUFDLEdBQVk7UUFDaEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUNoQyxDQUFDO0lBRVMsb0JBQW9CO1FBQzVCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXZELE1BQU0saUJBQWlCLEdBQWlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0gsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNoRCxJQUFJLENBQUMsY0FBYyxHQUFHLGdCQUFnQixDQUFDO1NBQ3hDO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxnQkFBZ0IsQ0FBQztRQUNwRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDO1FBQ2xFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1FBRS9ELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFO1lBQ3BGLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUN6RDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVTLGdCQUFnQjtRQUN4QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFFN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7Z0JBQzVDLE9BQU87YUFDUjtZQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBd0IsRUFBRSxFQUFFO2dCQUUzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRXRDLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFFbkUsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLGdCQUFnQixDQUFDLGFBQWEsRUFBRTt3QkFDdEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztxQkFDL0M7aUJBQ0Y7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVPLG9CQUFvQixDQUFDLFVBQXdCLEVBQUUsSUFBYTtRQUNsRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDakUsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFaEcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFO2dCQUN2QixlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDMUI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUU7b0JBQ3ZCLGVBQWUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO29CQUNoQyxNQUFNLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLDRCQUE0QixDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUN4RixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQy9DO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFTyxzQkFBc0IsQ0FBQyxJQUFJO1FBQ2pDLE1BQU0sV0FBVyxHQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQzdGLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3JCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7U0FDeEU7UUFDRCxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7OztZQTVYRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIscTBMQUE4QztnQkFFOUMsTUFBTSxFQUFFLDZCQUE2QjtnQkFDckMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSix3QkFBd0IsRUFBRSxNQUFNO2lCQUNqQzs7YUFFRjs7O1lBckJRLGNBQWM7WUFsQnJCLFVBQVU7WUFDVixRQUFROzs7NkJBNkRQLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7QUFkbEU7SUFEQyxjQUFjLEVBQUU7O29FQUM0QjtBQUU3QztJQURDLGNBQWMsRUFBRTs7bUVBQzJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9vLWZvcm0uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRk9STV9UT09MQkFSID0gW1xuICAnbGFiZWxIZWFkZXI6IGxhYmVsLWhlYWRlcicsXG4gICdsYWJlbEhlYWRlckFsaWduOiBsYWJlbC1oZWFkZXItYWxpZ24nLFxuICAnaGVhZGVyYWN0aW9uczogaGVhZGVyLWFjdGlvbnMnLFxuICAnc2hvd0hlYWRlckFjdGlvbnNUZXh0OiBzaG93LWhlYWRlci1hY3Rpb25zLXRleHQnLFxuICAvLyBzaG93LWhlYWRlci1uYXZpZ2F0aW9uIFtzdHJpbmddW3llc3xub3x0cnVlfGZhbHNlXTogSW5jbHVkZSBuYXZpZ2F0aW9ucyBidXR0b25zIGluIGZvcm0tdG9vbGJhci4gRGVmYXVsdDogdHJ1ZTtcbiAgJ3Nob3dIZWFkZXJOYXZpZ2F0aW9uOnNob3ctaGVhZGVyLW5hdmlnYXRpb24nXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tdG9vbGJhcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWZvcm0tdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZm9ybS10b29sYmFyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GT1JNX1RPT0xCQVIsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS10b29sYmFyXSc6ICd0cnVlJ1xuICB9XG4gIC8vIHByb3ZpZGVyczogW3sgcHJvdmlkZTogT0Zvcm1Db21wb25lbnQsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSB9XVxufSlcbmV4cG9ydCBjbGFzcyBPRm9ybVRvb2xiYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgLyogQmluZGluZ3MgKi9cbiAgcHVibGljIGxhYmVsSGVhZGVyOiBzdHJpbmcgPSAnJztcbiAgcHVibGljIGhlYWRlcmFjdGlvbnM6IHN0cmluZyA9ICcnO1xuICBwdWJsaWMgbGFiZWxIZWFkZXJBbGlnbjogc3RyaW5nID0gJ2NlbnRlcic7XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dIZWFkZXJBY3Rpb25zVGV4dDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93SGVhZGVyTmF2aWdhdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHVibGljIGZvcm1BY3Rpb25zOiBzdHJpbmdbXTtcbiAgcHVibGljIGlzRGV0YWlsOiBib29sZWFuID0gdHJ1ZTtcblxuICBwdWJsaWMgZWRpdE1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGluc2VydE1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGluaXRpYWxNb2RlOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHJlZnJlc2hCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpbnNlcnRCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBkZWxldGVCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgQFZpZXdDaGlsZCgnYnJlYWRjcnVtYicsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiwgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgYnJlYWRDb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgcHVibGljIGlzU2F2ZUJ0bkVuYWJsZWQ6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gIHB1YmxpYyBpc0VkaXRCdG5FbmFibGVkOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICBwdWJsaWMgZXhpc3RzQ2hhbmdlc1RvU2F2ZTogT2JzZXJ2YWJsZTxib29sZWFuPjtcblxuICBnZXQgY2hhbmdlc1RvU2F2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhbmdlc1RvU2F2ZTtcblxuICB9XG5cbiAgc2V0IGNoYW5nZXNUb1NhdmUodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2hhbmdlc1RvU2F2ZSA9IHZhbDtcbiAgICBjb25zdCBhdHRyID0gdGhpcy5fZm9ybS5pc0VkaXRhYmxlRGV0YWlsKCkgPyBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUgOiBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9JTlNFUlQ7XG4gICAgY29uc3QgcGVybWlzc2lvbnM6IE9QZXJtaXNzaW9ucyA9ICh0aGlzLmFjdGlvbnNQZXJtaXNzaW9ucyB8fCBbXSkuZmluZChwID0+IHAuYXR0ciA9PT0gYXR0cik7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHBlcm1pc3Npb25zKSAmJiBwZXJtaXNzaW9ucy5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2V4aXN0c0NoYW5nZXNUb1NhdmVTdWJqZWN0Lm5leHQodmFsKTtcblxuICB9XG5cbiAgcHJvdGVjdGVkIF9jaGFuZ2VzVG9TYXZlOiBib29sZWFuID0gZmFsc2U7XG5cblxuICBnZXQgZWRpdEJ0bkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRCdG5FbmFibGVkO1xuICB9XG4gIHNldCBlZGl0QnRuRW5hYmxlZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2VkaXRCdG5FbmFibGVkID0gdmFsdWU7XG4gICAgdGhpcy5faXNFZGl0QnRuRW5hYmxlZFN1YmplY3QubmV4dCh0aGlzLl9lZGl0QnRuRW5hYmxlZCk7XG4gIH1cbiAgcHJvdGVjdGVkIF9lZGl0QnRuRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGdldCBzYXZlQnRuRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2F2ZUJ0bkVuYWJsZWQ7XG4gIH1cbiAgc2V0IHNhdmVCdG5FbmFibGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2F2ZUJ0bkVuYWJsZWQgPSB2YWx1ZTtcbiAgICB0aGlzLl9pc1NhdmVCdG5FbmFibGVkU3ViamVjdC5uZXh0KHRoaXMuX3NhdmVCdG5FbmFibGVkKTtcbiAgfVxuICBwcm90ZWN0ZWQgX3NhdmVCdG5FbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG5cblxuICBwcm90ZWN0ZWQgX2RpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG4gIHByb3RlY3RlZCBfbmF2aWdhdGlvblNlcnZpY2U6IE5hdmlnYXRpb25TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbXV0YXRpb25PYnNlcnZlcnM6IE11dGF0aW9uT2JzZXJ2ZXJbXSA9IFtdO1xuXG4gIHByb3RlY3RlZCBmb3JtQ2FjaGVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGFjdGlvbnNQZXJtaXNzaW9uczogT1Blcm1pc3Npb25zW107XG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcblxuICBwcm90ZWN0ZWQgX2luY2x1ZGVCcmVhZGNydW1iOiBib29sZWFuO1xuXG4gIHByb3RlY3RlZCBfaXNTYXZlQnRuRW5hYmxlZFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHJvdGVjdGVkIF9pc0VkaXRCdG5FbmFibGVkU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBwcm90ZWN0ZWQgX2V4aXN0c0NoYW5nZXNUb1NhdmVTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgcHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLmlzU2F2ZUJ0bkVuYWJsZWQgPSB0aGlzLl9pc1NhdmVCdG5FbmFibGVkU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB0aGlzLmlzRWRpdEJ0bkVuYWJsZWQgPSB0aGlzLl9pc0VkaXRCdG5FbmFibGVkU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgICB0aGlzLmV4aXN0c0NoYW5nZXNUb1NhdmUgPSB0aGlzLl9leGlzdHNDaGFuZ2VzVG9TYXZlU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIHRoaXMuX2Zvcm0ucmVnaXN0ZXJUb29sYmFyKHRoaXMpO1xuICAgIHRoaXMuX2RpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0aGlzLl9uYXZpZ2F0aW9uU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5hdmlnYXRpb25TZXJ2aWNlKTtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtQWN0aW9ucyA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmhlYWRlcmFjdGlvbnMpO1xuICAgIGlmICh0aGlzLmZvcm1BY3Rpb25zICYmIHRoaXMuZm9ybUFjdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5yZWZyZXNoQnRuRW5hYmxlZCA9IHRoaXMuZm9ybUFjdGlvbnMuaW5kZXhPZignUicpICE9PSAtMTtcbiAgICAgIHRoaXMuaW5zZXJ0QnRuRW5hYmxlZCA9IHRoaXMuZm9ybUFjdGlvbnMuaW5kZXhPZignSScpICE9PSAtMTtcbiAgICAgIHRoaXMuZWRpdEJ0bkVuYWJsZWQgPSB0aGlzLmZvcm1BY3Rpb25zLmluZGV4T2YoJ1UnKSAhPT0gLTE7XG4gICAgICB0aGlzLmRlbGV0ZUJ0bkVuYWJsZWQgPSAhdGhpcy5pbnNlcnRNb2RlICYmIHRoaXMuZm9ybUFjdGlvbnMuaW5kZXhPZignRCcpICE9PSAtMTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX25hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuX25hdmlnYXRpb25TZXJ2aWNlLm9uVGl0bGVDaGFuZ2UodGl0bGUgPT4ge1xuICAgICAgICBzZWxmLmxhYmVsSGVhZGVyID0gdGl0bGU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5pbmNsdWRlQnJlYWRjcnVtYiA9IHRoaXMuX2Zvcm0uaW5jbHVkZUJyZWFkY3J1bWIgJiYgdGhpcy5fZm9ybS5mb3JtQ29udGFpbmVyLmJyZWFkY3J1bWI7XG4gICAgaWYgKHRoaXMuaW5jbHVkZUJyZWFkY3J1bWIpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZm9ybUNvbnRhaW5lci5icmVhZGNydW1iID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1DYWNoZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5mb3JtQ2FjaGVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubXV0YXRpb25PYnNlcnZlcnMpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlcnMuZm9yRWFjaCgobTogTXV0YXRpb25PYnNlcnZlcikgPT4ge1xuICAgICAgICBtLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJzZVBlcm1pc3Npb25zKCk7XG4gICAgaWYgKHRoaXMuaW5jbHVkZUJyZWFkY3J1bWIpIHtcbiAgICAgIHRoaXMuX2Zvcm0uZm9ybUNvbnRhaW5lci5jcmVhdGVCcmVhZGNydW1iKHRoaXMuYnJlYWRDb250YWluZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRJbml0aWFsTW9kZSgpOiB2b2lkIHtcbiAgICB0aGlzLm1hbmFnZUVkaXRhYmxlRGV0YWlsKCk7XG4gICAgdGhpcy5pbml0aWFsTW9kZSA9IHRydWU7XG4gICAgdGhpcy5pbnNlcnRNb2RlID0gZmFsc2U7XG4gICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHNldEluc2VydE1vZGUoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsTW9kZSA9IGZhbHNlO1xuICAgIHRoaXMuaW5zZXJ0TW9kZSA9IHRydWU7XG4gICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHNldEVkaXRNb2RlKCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbE1vZGUgPSBmYWxzZTtcbiAgICB0aGlzLmluc2VydE1vZGUgPSBmYWxzZTtcbiAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsb3NlRGV0YWlsKCk6IHZvaWQge1xuICAgIHRoaXMuX2Zvcm0uZXhlY3V0ZVRvb2xiYXJBY3Rpb24oQ29kZXMuQ0xPU0VfREVUQUlMX0FDVElPTiwge1xuICAgICAgY2hhbmdlVG9vbGJhck1vZGU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5CQUNLX0FDVElPTik7XG4gIH1cblxuICBwdWJsaWMgb25SZWxvYWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fUkVGUkVTSCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fZm9ybS5zaG93Q29uZmlybURpc2NhcmRDaGFuZ2VzKCkudGhlbih2YWwgPT4ge1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBzZWxmLl9mb3JtLmV4ZWN1dGVUb29sYmFyQWN0aW9uKENvZGVzLlJFTE9BRF9BQ1RJT04pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uSW5zZXJ0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0lOU0VSVCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9mb3JtLmV4ZWN1dGVUb29sYmFyQWN0aW9uKENvZGVzLkdPX0lOU0VSVF9BQ1RJT04sIHtcbiAgICAgIGNoYW5nZVRvb2xiYXJNb2RlOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25FZGl0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9mb3JtLmV4ZWN1dGVUb29sYmFyQWN0aW9uKENvZGVzLkdPX0VESVRfQUNUSU9OLCB7XG4gICAgICBjaGFuZ2VUb29sYmFyTW9kZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uRGVsZXRlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX0RFTEVURSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNob3dDb25maXJtRGVsZXRlKCk7XG4gIH1cblxuICBwdWJsaWMgb25TYXZlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUFjY2VwdEVkaXRPcGVyYXRpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5jZWxPcGVyYXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNEZXRhaWwpIHtcbiAgICAgIHRoaXMub25DbG9zZURldGFpbCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnNlcnRNb2RlKSB7XG4gICAgICB0aGlzLm9uQmFjaygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uUmVsb2FkKCk7XG4gICAgICB0aGlzLl9mb3JtLnNldEluaXRpYWxNb2RlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFjY2VwdE9wZXJhdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fVVBEQVRFKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZUFjY2VwdEVkaXRPcGVyYXRpb24oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5zZXJ0TW9kZSkge1xuICAgICAgaWYgKCF0aGlzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24oUGVybWlzc2lvbnNVdGlscy5BQ1RJT05fSU5TRVJUKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZUFjY2VwdEluc2VydE9wZXJhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBY2NlcHRJbnNlcnRPcGVyYXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5JTlNFUlRfQUNUSU9OKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVBY2NlcHRFZGl0T3BlcmF0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuX2Zvcm0uZXhlY3V0ZVRvb2xiYXJBY3Rpb24oQ29kZXMuRURJVF9BQ1RJT04pO1xuICB9XG5cbiAgcHVibGljIHNob3dDb25maXJtRGVsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuX2RpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0RFTEVURScpLnRoZW4ocmVzID0+IHtcbiAgICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5ERUxFVEVfQUNUSU9OKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICAgICAgdGhpcy5fZm9ybS5vbkRlbGV0ZS5lbWl0KHJlc3ApO1xuICAgICAgICAgIHRoaXMub25DbG9zZURldGFpbCgpO1xuICAgICAgICB9LCBlcnIgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ09Gb3JtVG9vbGJhci5kZWxldGUgZXJyb3InLCBlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGdldCBzaG93TmF2aWdhdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93SGVhZGVyTmF2aWdhdGlvbiAmJiAhKHRoaXMuX2Zvcm0uZ2V0Rm9ybU1hbmFnZXIoKSAmJiB0aGlzLl9mb3JtLmdldEZvcm1NYW5hZ2VyKCkuaXNUYWJNb2RlKCkpO1xuICB9XG5cbiAgcHVibGljIGdldExhYmVsSGVhZGVyQWxpZ24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5sYWJlbEhlYWRlckFsaWduO1xuICB9XG5cbiAgZ2V0IHNob3dVbmRvQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb3JtLnVuZG9CdXR0b24gJiYgKCF0aGlzLmluaXRpYWxNb2RlIHx8IHRoaXMuX2Zvcm0uaXNFZGl0YWJsZURldGFpbCgpKTtcbiAgfVxuXG4gIGdldCBpc0NoYW5nZXNTdGFja0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9mb3JtLmlzQ2FjaGVTdGFja0VtcHR5O1xuICB9XG5cbiAgcHVibGljIG9uVW5kb0xhc3RDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9ybS5leGVjdXRlVG9vbGJhckFjdGlvbihDb2Rlcy5VTkRPX0xBU1RfQ0hBTkdFX0FDVElPTik7XG4gIH1cblxuICBnZXQgaXNSZWZyZXNoQnRuRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5yZWZyZXNoQnRuRW5hYmxlZDtcbiAgfVxuXG4gIGdldCBpc0luc2VydEJ0bkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0QnRuRW5hYmxlZDtcbiAgfVxuXG4gIGdldCBpc0RlbGV0ZUJ0bkVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGVsZXRlQnRuRW5hYmxlZDtcbiAgfVxuXG4gIHB1YmxpYyBoYXNFbmFibGVkUGVybWlzc2lvbihwZXJtaXNzaW9uOiBPUGVybWlzc2lvbnMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcGVybWlzc2lvbiA/IHBlcm1pc3Npb24uZW5hYmxlZCA6IHRydWU7XG4gIH1cblxuICBnZXQgaW5jbHVkZUJyZWFkY3J1bWIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2luY2x1ZGVCcmVhZGNydW1iO1xuICB9XG5cbiAgc2V0IGluY2x1ZGVCcmVhZGNydW1iKGFyZzogYm9vbGVhbikge1xuICAgIHRoaXMuX2luY2x1ZGVCcmVhZGNydW1iID0gYXJnO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1hbmFnZUVkaXRhYmxlRGV0YWlsKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzRWRpdGFibGVEZXRhaWwgPSB0aGlzLl9mb3JtLmlzRWRpdGFibGVEZXRhaWwoKTtcblxuICAgIGNvbnN0IHVwZGF0ZVBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSAodGhpcy5hY3Rpb25zUGVybWlzc2lvbnMgfHwgW10pLmZpbmQocCA9PiBwLmF0dHIgPT09IFBlcm1pc3Npb25zVXRpbHMuQUNUSU9OX1VQREFURSk7XG4gICAgaWYgKHRoaXMuaGFzRW5hYmxlZFBlcm1pc3Npb24odXBkYXRlUGVybWlzc2lvbnMpKSB7XG4gICAgICB0aGlzLnNhdmVCdG5FbmFibGVkID0gaXNFZGl0YWJsZURldGFpbDtcbiAgICB9XG5cbiAgICB0aGlzLnJlZnJlc2hCdG5FbmFibGVkID0gdGhpcy5yZWZyZXNoQnRuRW5hYmxlZCAmJiBpc0VkaXRhYmxlRGV0YWlsO1xuICAgIHRoaXMuaW5zZXJ0QnRuRW5hYmxlZCA9IHRoaXMuaW5zZXJ0QnRuRW5hYmxlZCAmJiBpc0VkaXRhYmxlRGV0YWlsO1xuICAgIHRoaXMuZWRpdEJ0bkVuYWJsZWQgPSB0aGlzLmVkaXRCdG5FbmFibGVkICYmICFpc0VkaXRhYmxlRGV0YWlsO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fZm9ybS5nZXRGb3JtQ2FjaGUoKS5vbkNhY2hlU3RhdGVDaGFuZ2VzLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZSgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgaWYgKHNlbGYuX2Zvcm0uaXNFZGl0YWJsZURldGFpbCgpKSB7XG4gICAgICAgIHNlbGYuY2hhbmdlc1RvU2F2ZSA9IHNlbGYuX2Zvcm0uaXNJbml0aWFsU3RhdGVDaGFuZ2VkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VQZXJtaXNzaW9ucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fZm9ybS5vYXR0cikge1xuICAgICAgdGhpcy5hY3Rpb25zUGVybWlzc2lvbnMgPSB0aGlzLl9mb3JtLmdldEFjdGlvbnNQZXJtaXNzaW9ucygpO1xuXG4gICAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuYWN0aW9uc1Blcm1pc3Npb25zKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuYWN0aW9uc1Blcm1pc3Npb25zLmZvckVhY2goKHBlcm1pc3Npb246IE9QZXJtaXNzaW9ucykgPT4ge1xuICAgICAgICAvLyBvdGhlcnMgYWN0aW9uc1xuICAgICAgICBzZWxmLnBlcm1pc3Npb25NYW5hZ2VtZW50KHBlcm1pc3Npb24pO1xuXG4gICAgICAgIGlmIChQZXJtaXNzaW9uc1V0aWxzLlNUQU5EQVJEX0FDVElPTlMuaW5kZXhPZihwZXJtaXNzaW9uLmF0dHIpID4gLTEpIHtcbiAgICAgICAgICAvLyBhY3Rpb25zIFI7STtVO0RcbiAgICAgICAgICBpZiAocGVybWlzc2lvbi5hdHRyID09PSBQZXJtaXNzaW9uc1V0aWxzLkFDVElPTl9VUERBVEUpIHtcbiAgICAgICAgICAgIHNlbGYucGVybWlzc2lvbk1hbmFnZW1lbnQocGVybWlzc2lvbiwgJ2VkaXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGVybWlzc2lvbk1hbmFnZW1lbnQocGVybWlzc2lvbjogT1Blcm1pc3Npb25zLCBhdHRyPzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgYXR0ckFjdGlvbiA9IFV0aWwuaXNEZWZpbmVkKGF0dHIpID8gYXR0ciA6IHBlcm1pc3Npb24uYXR0cjtcbiAgICBjb25zdCBlbGVtZW50QnlBY3Rpb24gPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdbYXR0cj1cIicgKyBhdHRyQWN0aW9uICsgJ1wiXScpO1xuXG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVsZW1lbnRCeUFjdGlvbikpIHtcbiAgICAgIGlmICghcGVybWlzc2lvbi52aXNpYmxlKSB7XG4gICAgICAgIGVsZW1lbnRCeUFjdGlvbi5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghcGVybWlzc2lvbi5lbmFibGVkKSB7XG4gICAgICAgICAgZWxlbWVudEJ5QWN0aW9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICBjb25zdCBtdXRhdGlvbk9ic2VydmVyID0gUGVybWlzc2lvbnNVdGlscy5yZWdpc3RlckRpc2FibGVkQ2hhbmdlc0luRG9tKGVsZW1lbnRCeUFjdGlvbik7XG4gICAgICAgICAgdGhpcy5tdXRhdGlvbk9ic2VydmVycy5wdXNoKG11dGF0aW9uT2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0VuYWJsZWRQZXJtaXNzaW9uKGF0dHIpOiBib29sZWFuIHtcbiAgICBjb25zdCBwZXJtaXNzaW9uczogT1Blcm1pc3Npb25zID0gKHRoaXMuYWN0aW9uc1Blcm1pc3Npb25zIHx8IFtdKS5maW5kKHAgPT4gcC5hdHRyID09PSBhdHRyKTtcbiAgICBjb25zdCBlbmFibGVkUGVybWlzaW9uID0gUGVybWlzc2lvbnNVdGlscy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKHBlcm1pc3Npb25zKTtcbiAgICBpZiAoIWVuYWJsZWRQZXJtaXNpb24pIHtcbiAgICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLk9QRVJBVElPTl9OT1RfQUxMT1dFRF9QRVJNSVNTSU9OJyk7XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVkUGVybWlzaW9uO1xuICB9XG5cbn1cbiJdfQ==