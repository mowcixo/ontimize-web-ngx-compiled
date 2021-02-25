import { AfterViewInit, ElementRef, Injector, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { NavigationService } from '../../../services/navigation.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { OPermissions } from '../../../types/o-permissions.type';
import { OFormComponent } from '../o-form.component';
export declare const DEFAULT_INPUTS_O_FORM_TOOLBAR: string[];
export declare class OFormToolbarComponent implements OnInit, OnDestroy, AfterViewInit {
    private _form;
    element: ElementRef;
    protected injector: Injector;
    labelHeader: string;
    headeractions: string;
    labelHeaderAlign: string;
    showHeaderActionsText: boolean;
    showHeaderNavigation: boolean;
    formActions: string[];
    isDetail: boolean;
    editMode: boolean;
    insertMode: boolean;
    initialMode: boolean;
    refreshBtnEnabled: boolean;
    insertBtnEnabled: boolean;
    deleteBtnEnabled: boolean;
    breadContainer: ViewContainerRef;
    isSaveBtnEnabled: Observable<boolean>;
    isEditBtnEnabled: Observable<boolean>;
    existsChangesToSave: Observable<boolean>;
    changesToSave: boolean;
    protected _changesToSave: boolean;
    editBtnEnabled: boolean;
    protected _editBtnEnabled: boolean;
    saveBtnEnabled: boolean;
    protected _saveBtnEnabled: boolean;
    protected _dialogService: DialogService;
    protected _navigationService: NavigationService;
    protected mutationObservers: MutationObserver[];
    protected formCacheSubscription: Subscription;
    protected actionsPermissions: OPermissions[];
    protected snackBarService: SnackBarService;
    protected _includeBreadcrumb: boolean;
    protected _isSaveBtnEnabledSubject: BehaviorSubject<boolean>;
    protected _isEditBtnEnabledSubject: BehaviorSubject<boolean>;
    protected _existsChangesToSaveSubject: BehaviorSubject<boolean>;
    constructor(_form: OFormComponent, element: ElementRef, injector: Injector);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    setInitialMode(): void;
    setInsertMode(): void;
    setEditMode(): void;
    onCloseDetail(): void;
    onBack(): void;
    onReload(): void;
    onInsert(): void;
    onEdit(): void;
    onDelete(): void;
    onSave(): void;
    cancelOperation(): void;
    acceptOperation(): void;
    handleAcceptInsertOperation(): void;
    handleAcceptEditOperation(): void;
    showConfirmDelete(): void;
    readonly showNavigation: boolean;
    getLabelHeaderAlign(): string;
    readonly showUndoButton: boolean;
    readonly isChangesStackEmpty: boolean;
    onUndoLastChange(): void;
    readonly isRefreshBtnEnabled: boolean;
    readonly isInsertBtnEnabled: boolean;
    readonly isDeleteBtnEnabled: boolean;
    hasEnabledPermission(permission: OPermissions): boolean;
    includeBreadcrumb: boolean;
    protected manageEditableDetail(): void;
    protected parsePermissions(): void;
    private permissionManagement;
    private checkEnabledPermission;
}