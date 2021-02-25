import * as tslib_1 from "tslib";
import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Injector, Optional, SkipSelf, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { InputConverter } from '../../decorators/input-converter';
import { LocalStorageService } from '../../services/local-storage.service';
import { NavigationService } from '../../services/navigation.service';
import { OFormLayoutManagerService } from '../../services/o-form-layout-manager.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { Util } from '../../util/util';
import { OFormLayoutDialogComponent } from './dialog/o-form-layout-dialog.component';
import { OFormLayoutDialogOptionsComponent } from './dialog/options/o-form-layout-dialog-options.component';
import { CanActivateFormLayoutChildGuard } from './guards/o-form-layout-can-activate-child.guard';
import { OFormLayoutTabGroupOptionsComponent } from './tabgroup/options/o-form-layout-tabgroup-options.component';
export const DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
    'oattr: attr',
    'mode',
    'labelColumns: label-columns',
    'separator',
    'title',
    'storeState: store-state',
    'titleDataOrigin: title-data-origin',
    'dialogWidth: dialog-width',
    'dialogMinWidth: dialog-min-width',
    'dialogMaxWidth: dialog-max-width',
    'dialogHeight: dialog-height',
    'dialogMinHeight: dialog-min-height',
    'dialogMaxHeight dialog-max-height',
    'dialogClass: dialog-class'
];
export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = [
    'onMainTabSelected',
    'onSelectedTabChange',
    'onCloseTab'
];
export class OFormLayoutManagerComponent {
    constructor(injector, router, actRoute, dialog, elRef, parentFormLayoutManager) {
        this.injector = injector;
        this.router = router;
        this.actRoute = actRoute;
        this.dialog = dialog;
        this.elRef = elRef;
        this.parentFormLayoutManager = parentFormLayoutManager;
        this.separator = ' ';
        this.storeState = true;
        this.dialogClass = '';
        this.onMainTabSelected = new EventEmitter();
        this.onSelectedTabChange = new EventEmitter();
        this.onCloseTab = new EventEmitter();
        this.labelColsArray = [];
        this.addingGuard = false;
        this.markForUpdate = false;
        this.onTriggerUpdate = new EventEmitter();
        this.oFormLayoutManagerService = this.injector.get(OFormLayoutManagerService);
        this.localStorageService = this.injector.get(LocalStorageService);
        this.translateService = this.injector.get(OTranslateService);
        this.navigationService = this.injector.get(NavigationService);
        if (this.storeState) {
            this.onRouteChangeStorageSubscription = this.localStorageService.onRouteChange.subscribe(res => {
                this.updateStateStorage();
            });
        }
    }
    ngOnInit() {
        const availableModeValues = [OFormLayoutManagerComponent.DIALOG_MODE, OFormLayoutManagerComponent.TAB_MODE];
        this.mode = (this.mode || '').toLowerCase();
        if (availableModeValues.indexOf(this.mode) === -1) {
            this.mode = OFormLayoutManagerComponent.DIALOG_MODE;
        }
        this.labelColsArray = Util.parseArray(this.labelColumns);
        this.addActivateChildGuard();
        if (!Util.isDefined(this.oattr)) {
            this.oattr = this.title + this.mode;
            console.warn('o-form-layout-manager must have an unique attr');
        }
        this.oFormLayoutManagerService.registerFormLayoutManager(this);
    }
    ngAfterViewInit() {
        setTimeout(() => {
            if (this.elRef) {
                this.elRef.nativeElement.removeAttribute('title');
            }
            if (this.storeState && this.isTabMode() && Util.isDefined(this.oTabGroup)) {
                const state = this.localStorageService.getComponentStorage(this);
                this.oTabGroup.initializeComponentState(state);
            }
        });
    }
    ngOnDestroy() {
        if (this.onRouteChangeStorageSubscription) {
            this.onRouteChangeStorageSubscription.unsubscribe();
        }
        this.updateStateStorage();
        this.oFormLayoutManagerService.removeFormLayoutManager(this);
        this.destroyAactivateChildGuard();
    }
    getAttribute() {
        return this.oattr;
    }
    getComponentKey() {
        return 'OFormLayoutManagerComponent_' + this.oattr;
    }
    getDataToStore() {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            return this.oTabGroup.getDataToStore();
        }
        return {};
    }
    beforeunloadHandler() {
        this.updateStateStorage();
    }
    getLabelFromUrlParams(urlParams) {
        let label = '';
        const keys = Object.keys(urlParams);
        keys.forEach((param, i) => {
            label += urlParams[param] + ((i < keys.length - 1) ? this.separator : '');
        });
        return label;
    }
    getFormDataFromLabelColumns(data) {
        const formData = {};
        Object.keys(data).forEach(x => {
            if (this.labelColsArray.indexOf(x) > -1) {
                formData[x] = data[x];
            }
        });
        return formData;
    }
    addActivateChildGuard() {
        const routeConfig = this.getParentActRouteRoute();
        if (Util.isDefined(routeConfig)) {
            const canActivateChildArray = (routeConfig.canActivateChild || []);
            let previouslyAdded = false;
            for (let i = 0, len = canActivateChildArray.length; i < len; i++) {
                previouslyAdded = (canActivateChildArray[i].name === OFormLayoutManagerComponent.guardClassName);
                if (previouslyAdded) {
                    break;
                }
            }
            if (!previouslyAdded) {
                this.addingGuard = true;
                canActivateChildArray.push(CanActivateFormLayoutChildGuard);
                routeConfig.canActivateChild = canActivateChildArray;
            }
        }
    }
    destroyAactivateChildGuard() {
        if (!this.addingGuard) {
            return;
        }
        const routeConfig = this.getParentActRouteRoute();
        if (Util.isDefined(routeConfig)) {
            for (let i = (routeConfig.canActivateChild || []).length - 1; i >= 0; i--) {
                if (routeConfig.canActivateChild[i].name === OFormLayoutManagerComponent.guardClassName) {
                    routeConfig.canActivateChild.splice(i, 1);
                    break;
                }
            }
        }
    }
    isDialogMode() {
        return this.mode === OFormLayoutManagerComponent.DIALOG_MODE;
    }
    isTabMode() {
        return this.mode === OFormLayoutManagerComponent.TAB_MODE;
    }
    addDetailComponent(childRoute, url) {
        const newDetailComp = {
            params: childRoute.params,
            queryParams: childRoute.queryParams,
            urlSegments: childRoute.url,
            component: childRoute.routeConfig.component,
            url: url,
            id: Math.random().toString(36),
            label: '',
            modified: false
        };
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.addTab(newDetailComp);
        }
        else if (this.isDialogMode()) {
            this.openFormLayoutDialog(newDetailComp);
        }
    }
    closeDetail(id) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.closeTab(id);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            this.dialogRef.close();
            this.reloadMainComponents();
        }
    }
    openFormLayoutDialog(detailComp) {
        const cssclass = ['o-form-layout-dialog-overlay'];
        if (this.dialogClass) {
            cssclass.push(this.dialogClass);
        }
        const dialogConfig = {
            data: {
                data: detailComp,
                layoutManagerComponent: this,
                title: this.title,
            },
            width: this.dialogOptions ? this.dialogOptions.width : this.dialogWidth,
            minWidth: this.dialogOptions ? this.dialogOptions.minWidth : this.dialogMinWidth,
            maxWidth: this.dialogOptions ? this.dialogOptions.maxWidth : this.dialogMaxWidth,
            height: this.dialogOptions ? this.dialogOptions.height : this.dialogHeight,
            minHeight: this.dialogOptions ? this.dialogOptions.minHeight : this.dialogMinHeight,
            maxHeight: this.dialogOptions ? this.dialogOptions.maxHeight : this.dialogMaxHeight,
            disableClose: this.dialogOptions ? this.dialogOptions.disableClose : true,
            panelClass: this.dialogOptions ? this.dialogOptions.class : cssclass
        };
        if (this.dialogOptions) {
            dialogConfig.closeOnNavigation = this.dialogOptions.closeOnNavigation;
            dialogConfig.backdropClass = this.dialogOptions.backdropClass;
            dialogConfig.position = this.dialogOptions.position;
            dialogConfig.disableClose = this.dialogOptions.disableClose;
        }
        this.dialogRef = this.dialog.open(OFormLayoutDialogComponent, dialogConfig);
        this.dialogRef.afterClosed().subscribe(() => {
            this.updateIfNeeded();
        });
    }
    getFormCacheData(formId) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            return this.oTabGroup.getFormCacheData(formId);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            return this.dialogRef.componentInstance.data;
        }
        return undefined;
    }
    getLastTabId() {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            return this.oTabGroup.getLastTabId();
        }
        return undefined;
    }
    setModifiedState(modified, id) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.setModifiedState(modified, id);
        }
    }
    getLabelFromData(data) {
        let label = '';
        const isDataDefined = Util.isDefined(data);
        if (isDataDefined && data.hasOwnProperty('new_tab_title')) {
            label = this.translateService.get(data.new_tab_title);
        }
        else if (isDataDefined && this.labelColsArray.length !== 0) {
            this.labelColsArray.forEach((col, idx) => {
                if (data[col] !== undefined) {
                    label += data[col] + ((idx < this.labelColsArray.length - 1) ? this.separator : '');
                }
            });
        }
        return label;
    }
    updateNavigation(data, id, insertionMode) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.updateNavigation(data, id, insertionMode);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            this.dialogRef.componentInstance.updateNavigation(data, id);
        }
    }
    updateActiveData(data) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.updateActiveData(data);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            this.dialogRef.componentInstance.updateActiveData(data);
        }
    }
    getRouteOfActiveItem() {
        let route = [];
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            route = this.oTabGroup.getRouteOfActiveItem();
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            route = this.dialogRef.componentInstance.getRouteOfActiveItem();
        }
        return route;
    }
    isMainComponent(comp) {
        let result = false;
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            const firstTab = this.oTabGroup.elementRef.nativeElement.getElementsByTagName('mat-tab-body')[0];
            if (firstTab) {
                result = firstTab.contains(comp.elementRef.nativeElement);
            }
        }
        else if (this.isDialogMode()) {
            result = !comp.oFormLayoutDialog;
        }
        return result;
    }
    getRouteForComponent(comp) {
        const result = [];
        if (this.parentFormLayoutManager) {
            const parentRoute = this.parentFormLayoutManager.getRouteForComponent(comp);
            if (parentRoute && parentRoute.length > 0) {
                result.push(...parentRoute);
            }
        }
        if (!this.isMainComponent(comp)) {
            const activeRoute = this.getRouteOfActiveItem();
            if (activeRoute && activeRoute.length > 0) {
                result.push(...activeRoute);
            }
        }
        return result;
    }
    setAsActiveFormLayoutManager() {
        this.oFormLayoutManagerService.activeFormLayoutManager = this;
    }
    reloadMainComponents() {
        this.onTriggerUpdate.emit();
    }
    allowToUpdateNavigation(formAttr) {
        return (this.isTabMode() && Util.isDefined(this.oTabGroup) && Util.isDefined(this.titleDataOrigin)) ?
            this.titleDataOrigin === formAttr :
            true;
    }
    updateStateStorage() {
        if (this.localStorageService && this.isTabMode() && Util.isDefined(this.oTabGroup) && this.storeState) {
            this.localStorageService.updateComponentStorage(this);
        }
    }
    getParentActRouteRoute() {
        let actRoute = this.actRoute;
        while (actRoute.parent !== undefined && actRoute.parent !== null) {
            if (actRoute.routeConfig.children || actRoute.routeConfig.loadChildren) {
                break;
            }
            actRoute = actRoute.parent;
        }
        return actRoute.routeConfig;
    }
    updateIfNeeded() {
        if (this.markForUpdate) {
            this.markForUpdate = false;
            this.onTriggerUpdate.emit();
        }
    }
    getParams() {
        let data;
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            data = this.oTabGroup.getParams();
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            data = this.dialogRef.componentInstance.getParams();
        }
        return data;
    }
}
OFormLayoutManagerComponent.guardClassName = 'CanActivateFormLayoutChildGuard';
OFormLayoutManagerComponent.DIALOG_MODE = 'dialog';
OFormLayoutManagerComponent.TAB_MODE = 'tab';
OFormLayoutManagerComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-form-layout-manager',
                inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER,
                outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER,
                template: "<o-form-layout-tabgroup #tabGroup *ngIf=\"isTabMode(); else elseBlock\" [title]=\"title\"\n  (onMainTabSelected)=\"onMainTabSelected.emit($event)\" (onSelectedTabChange)=\"onSelectedTabChange.emit($event)\"\n  (onCloseTab)=\"onCloseTab.emit($event)\" [options]=\"tabGroupOptions\">\n  <ng-content *ngTemplateOutlet=\"elseBlock\"></ng-content>\n</o-form-layout-tabgroup>\n\n<ng-template #elseBlock>\n  <ng-content></ng-content>\n</ng-template>",
                host: {
                    '[class.o-form-layout-manager]': 'true'
                }
            }] }
];
OFormLayoutManagerComponent.ctorParameters = () => [
    { type: Injector },
    { type: Router },
    { type: ActivatedRoute },
    { type: MatDialog },
    { type: ElementRef },
    { type: OFormLayoutManagerComponent, decorators: [{ type: SkipSelf }, { type: Optional }] }
];
OFormLayoutManagerComponent.propDecorators = {
    oTabGroup: [{ type: ViewChild, args: ['tabGroup', { static: false },] }],
    tabGroupOptions: [{ type: ContentChild, args: [OFormLayoutTabGroupOptionsComponent, { static: false },] }],
    dialogOptions: [{ type: ContentChild, args: [OFormLayoutDialogOptionsComponent, { static: false },] }],
    beforeunloadHandler: [{ type: HostListener, args: ['window:beforeunload', [],] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormLayoutManagerComponent.prototype, "storeState", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixRQUFRLEVBR1IsUUFBUSxFQUNSLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBaUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQUUsY0FBYyxFQUFpQyxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd4RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHbEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFakYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQzVHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBRWxILE1BQU0sQ0FBQyxNQUFNLG9DQUFvQyxHQUFHO0lBQ2xELGFBQWE7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QUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNuQzthQUFNLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hFLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDOztBQXRZYSwwQ0FBYyxHQUFHLGlDQUFpQyxDQUFDO0FBRW5ELHVDQUFXLEdBQUcsUUFBUSxDQUFDO0FBQ3ZCLG9DQUFRLEdBQUcsS0FBSyxDQUFDOztZQWRoQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsTUFBTSxFQUFFLG9DQUFvQztnQkFDNUMsT0FBTyxFQUFFLHFDQUFxQztnQkFDOUMsc2NBQXFEO2dCQUNyRCxJQUFJLEVBQUU7b0JBQ0osK0JBQStCLEVBQUUsTUFBTTtpQkFDeEM7YUFDRjs7O1lBekRDLFFBQVE7WUFROEMsTUFBTTtZQUFyRCxjQUFjO1lBRGQsU0FBUztZQVZoQixVQUFVO1lBdUh3QiwyQkFBMkIsdUJBRDFELFFBQVEsWUFBSSxRQUFROzs7d0JBbEN0QixTQUFTLFNBQUMsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs4QkFldkMsWUFBWSxTQUFDLG1DQUFtQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs0QkFHbkUsWUFBWSxTQUFDLGlDQUFpQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtrQ0FrRmpFLFlBQVksU0FBQyxxQkFBcUIsRUFBRSxFQUFFOztBQTlHdkM7SUFEQyxjQUFjLEVBQUU7OytEQUNpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2tpcFNlbGYsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdERpYWxvZ0NvbmZpZywgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBPU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElMb2NhbFN0b3JhZ2VDb21wb25lbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2xvY2FsLXN0b3JhZ2UtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBPRm9ybUxheW91dFRhYkdyb3VwIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLWZvcm0tbGF5b3V0LXRhYi1ncm91cC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgTG9jYWxTdG9yYWdlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvby1mb3JtLWxheW91dC1tYW5hZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSB9IGZyb20gJy4uLy4uL3R5cGVzL2Zvcm0tbGF5b3V0LWRldGFpbC1jb21wb25lbnQtZGF0YS50eXBlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQgfSBmcm9tICcuL2RpYWxvZy9vLWZvcm0tbGF5b3V0LWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXREaWFsb2dPcHRpb25zQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2cvb3B0aW9ucy9vLWZvcm0tbGF5b3V0LWRpYWxvZy1vcHRpb25zLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkIH0gZnJvbSAnLi9ndWFyZHMvby1mb3JtLWxheW91dC1jYW4tYWN0aXZhdGUtY2hpbGQuZ3VhcmQnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRUYWJHcm91cE9wdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL3RhYmdyb3VwL29wdGlvbnMvby1mb3JtLWxheW91dC10YWJncm91cC1vcHRpb25zLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX01BTkFHRVIgPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICdtb2RlJyxcbiAgJ2xhYmVsQ29sdW1uczogbGFiZWwtY29sdW1ucycsXG4gICdzZXBhcmF0b3InLFxuICAndGl0bGUnLFxuICAnc3RvcmVTdGF0ZTogc3RvcmUtc3RhdGUnLFxuICAvLyBhdHRyIG9mIHRoZSBjaGlsZCBmb3JtIGZyb20gd2hpY2ggdGhlIGRhdGEgZm9yIGJ1aWxkaW5nIHRoZSB0YWIgdGl0bGUgd2lsbCBiZSBvYnRhaW5lZFxuICAndGl0bGVEYXRhT3JpZ2luOiB0aXRsZS1kYXRhLW9yaWdpbicsXG4gICdkaWFsb2dXaWR0aDogZGlhbG9nLXdpZHRoJyxcbiAgJ2RpYWxvZ01pbldpZHRoOiBkaWFsb2ctbWluLXdpZHRoJyxcbiAgJ2RpYWxvZ01heFdpZHRoOiBkaWFsb2ctbWF4LXdpZHRoJyxcbiAgJ2RpYWxvZ0hlaWdodDogZGlhbG9nLWhlaWdodCcsXG4gICdkaWFsb2dNaW5IZWlnaHQ6IGRpYWxvZy1taW4taGVpZ2h0JyxcbiAgJ2RpYWxvZ01heEhlaWdodCBkaWFsb2ctbWF4LWhlaWdodCcsXG4gICdkaWFsb2dDbGFzczogZGlhbG9nLWNsYXNzJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fTEFZT1VUX01BTkFHRVIgPSBbXG4gICdvbk1haW5UYWJTZWxlY3RlZCcsXG4gICdvblNlbGVjdGVkVGFiQ2hhbmdlJyxcbiAgJ29uQ2xvc2VUYWInXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tbGF5b3V0LW1hbmFnZXInLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fRk9STV9MQVlPVVRfTUFOQUdFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fRk9STV9MQVlPVVRfTUFOQUdFUixcbiAgdGVtcGxhdGVVcmw6ICcuL28tZm9ybS1sYXlvdXQtbWFuYWdlci5jb21wb25lbnQuaHRtbCcsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS1sYXlvdXQtbWFuYWdlcl0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQsIE9uRGVzdHJveSwgSUxvY2FsU3RvcmFnZUNvbXBvbmVudCB7XG5cbiAgcHVibGljIHN0YXRpYyBndWFyZENsYXNzTmFtZSA9ICdDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkJztcblxuICBwdWJsaWMgc3RhdGljIERJQUxPR19NT0RFID0gJ2RpYWxvZyc7XG4gIHB1YmxpYyBzdGF0aWMgVEFCX01PREUgPSAndGFiJztcblxuICBwdWJsaWMgb2F0dHI6IHN0cmluZztcbiAgcHVibGljIG1vZGU6IHN0cmluZztcbiAgcHVibGljIGxhYmVsQ29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgc2VwYXJhdG9yOiBzdHJpbmcgPSAnICc7XG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc3RvcmVTdGF0ZTogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyB0aXRsZURhdGFPcmlnaW46IHN0cmluZztcbiAgcHVibGljIGRpYWxvZ1dpZHRoOiBzdHJpbmc7XG4gIHB1YmxpYyBkaWFsb2dNaW5XaWR0aDogc3RyaW5nO1xuICBwdWJsaWMgZGlhbG9nTWF4V2lkdGg6IHN0cmluZztcbiAgcHVibGljIGRpYWxvZ0hlaWdodDogc3RyaW5nO1xuICBwdWJsaWMgZGlhbG9nTWluSGVpZ2h0OiBzdHJpbmc7XG4gIHB1YmxpYyBkaWFsb2dNYXhIZWlnaHQ6IHN0cmluZztcbiAgcHVibGljIGRpYWxvZ0NsYXNzOiBzdHJpbmcgPSAnJztcblxuICBAVmlld0NoaWxkKCd0YWJHcm91cCcsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgb1RhYkdyb3VwOiBPRm9ybUxheW91dFRhYkdyb3VwO1xuICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQ+O1xuXG4gIHB1YmxpYyBvbk1haW5UYWJTZWxlY3RlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uU2VsZWN0ZWRUYWJDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkNsb3NlVGFiOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHByb3RlY3RlZCBsYWJlbENvbHNBcnJheTogc3RyaW5nW10gPSBbXTtcblxuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBvRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlOiBPRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlU2VydmljZTogTG9jYWxTdG9yYWdlU2VydmljZTtcbiAgcHJvdGVjdGVkIG9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgQENvbnRlbnRDaGlsZChPRm9ybUxheW91dFRhYkdyb3VwT3B0aW9uc0NvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyB0YWJHcm91cE9wdGlvbnM6IE9Gb3JtTGF5b3V0VGFiR3JvdXBPcHRpb25zQ29tcG9uZW50O1xuXG4gIEBDb250ZW50Q2hpbGQoT0Zvcm1MYXlvdXREaWFsb2dPcHRpb25zQ29tcG9uZW50LCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIGRpYWxvZ09wdGlvbnM6IE9Gb3JtTGF5b3V0RGlhbG9nT3B0aW9uc0NvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgYWRkaW5nR3VhcmQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgbmF2aWdhdGlvblNlcnZpY2U6IE5hdmlnYXRpb25TZXJ2aWNlO1xuXG4gIHB1YmxpYyBtYXJrRm9yVXBkYXRlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBvblRyaWdnZXJVcGRhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJvdGVjdGVkIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcm90ZWN0ZWQgZGlhbG9nOiBNYXREaWFsb2csXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIEBTa2lwU2VsZigpIEBPcHRpb25hbCgpXG4gICAgcHVibGljIHBhcmVudEZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnRcbiAgKSB7XG4gICAgdGhpcy5vRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZSk7XG4gICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9jYWxTdG9yYWdlU2VydmljZSk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChOYXZpZ2F0aW9uU2VydmljZSk7XG4gICAgaWYgKHRoaXMuc3RvcmVTdGF0ZSkge1xuICAgICAgdGhpcy5vblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbiA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5vblJvdXRlQ2hhbmdlLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlU3RvcmFnZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGF2YWlsYWJsZU1vZGVWYWx1ZXMgPSBbT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50LkRJQUxPR19NT0RFLCBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQuVEFCX01PREVdO1xuICAgIHRoaXMubW9kZSA9ICh0aGlzLm1vZGUgfHwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGF2YWlsYWJsZU1vZGVWYWx1ZXMuaW5kZXhPZih0aGlzLm1vZGUpID09PSAtMSkge1xuICAgICAgdGhpcy5tb2RlID0gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50LkRJQUxPR19NT0RFO1xuICAgIH1cbiAgICB0aGlzLmxhYmVsQ29sc0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMubGFiZWxDb2x1bW5zKTtcbiAgICB0aGlzLmFkZEFjdGl2YXRlQ2hpbGRHdWFyZCgpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5vYXR0cikpIHtcbiAgICAgIHRoaXMub2F0dHIgPSB0aGlzLnRpdGxlICsgdGhpcy5tb2RlO1xuICAgICAgY29uc29sZS53YXJuKCdvLWZvcm0tbGF5b3V0LW1hbmFnZXIgbXVzdCBoYXZlIGFuIHVuaXF1ZSBhdHRyJyk7XG4gICAgfVxuICAgIHRoaXMub0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZS5yZWdpc3RlckZvcm1MYXlvdXRNYW5hZ2VyKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmVsUmVmKSB7XG4gICAgICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ3RpdGxlJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdG9yZVN0YXRlICYmIHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldENvbXBvbmVudFN0b3JhZ2UodGhpcyk7XG4gICAgICAgIHRoaXMub1RhYkdyb3VwLmluaXRpYWxpemVDb21wb25lbnRTdGF0ZShzdGF0ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMub25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVTdGF0ZVN0b3JhZ2UoKTtcbiAgICB0aGlzLm9Gb3JtTGF5b3V0TWFuYWdlclNlcnZpY2UucmVtb3ZlRm9ybUxheW91dE1hbmFnZXIodGhpcyk7XG4gICAgdGhpcy5kZXN0cm95QWFjdGl2YXRlQ2hpbGRHdWFyZCgpO1xuICB9XG5cbiAgcHVibGljIGdldEF0dHJpYnV0ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9hdHRyO1xuICB9XG5cbiAgcHVibGljIGdldENvbXBvbmVudEtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50XycgKyB0aGlzLm9hdHRyO1xuICB9XG5cbiAgcHVibGljIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgLy8gb25seSBzdG9yaW5nIGluIHRhYiBtb2RlXG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICByZXR1cm4gdGhpcy5vVGFiR3JvdXAuZ2V0RGF0YVRvU3RvcmUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmJlZm9yZXVubG9hZCcsIFtdKVxuICBwdWJsaWMgYmVmb3JldW5sb2FkSGFuZGxlcigpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVN0YXRlU3RvcmFnZSgpO1xuICB9XG5cbiAgcHVibGljIGdldExhYmVsRnJvbVVybFBhcmFtcyh1cmxQYXJhbXM6IG9iamVjdCk6IHN0cmluZyB7XG4gICAgbGV0IGxhYmVsID0gJyc7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHVybFBhcmFtcyk7XG4gICAga2V5cy5mb3JFYWNoKChwYXJhbSwgaSkgPT4ge1xuICAgICAgbGFiZWwgKz0gdXJsUGFyYW1zW3BhcmFtXSArICgoaSA8IGtleXMubGVuZ3RoIC0gMSkgPyB0aGlzLnNlcGFyYXRvciA6ICcnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGFiZWw7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rm9ybURhdGFGcm9tTGFiZWxDb2x1bW5zKGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGZvcm1EYXRhID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaCh4ID0+IHtcbiAgICAgIGlmICh0aGlzLmxhYmVsQ29sc0FycmF5LmluZGV4T2YoeCkgPiAtMSkge1xuICAgICAgICBmb3JtRGF0YVt4XSA9IGRhdGFbeF07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZvcm1EYXRhO1xuXG4gIH1cbiAgcHVibGljIGFkZEFjdGl2YXRlQ2hpbGRHdWFyZCgpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZUNvbmZpZyA9IHRoaXMuZ2V0UGFyZW50QWN0Um91dGVSb3V0ZSgpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChyb3V0ZUNvbmZpZykpIHtcbiAgICAgIGNvbnN0IGNhbkFjdGl2YXRlQ2hpbGRBcnJheSA9IChyb3V0ZUNvbmZpZy5jYW5BY3RpdmF0ZUNoaWxkIHx8IFtdKTtcbiAgICAgIGxldCBwcmV2aW91c2x5QWRkZWQgPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjYW5BY3RpdmF0ZUNoaWxkQXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcHJldmlvdXNseUFkZGVkID0gKGNhbkFjdGl2YXRlQ2hpbGRBcnJheVtpXS5uYW1lID09PSBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQuZ3VhcmRDbGFzc05hbWUpO1xuICAgICAgICBpZiAocHJldmlvdXNseUFkZGVkKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghcHJldmlvdXNseUFkZGVkKSB7XG4gICAgICAgIHRoaXMuYWRkaW5nR3VhcmQgPSB0cnVlO1xuICAgICAgICBjYW5BY3RpdmF0ZUNoaWxkQXJyYXkucHVzaChDYW5BY3RpdmF0ZUZvcm1MYXlvdXRDaGlsZEd1YXJkKTtcbiAgICAgICAgcm91dGVDb25maWcuY2FuQWN0aXZhdGVDaGlsZCA9IGNhbkFjdGl2YXRlQ2hpbGRBcnJheTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveUFhY3RpdmF0ZUNoaWxkR3VhcmQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmFkZGluZ0d1YXJkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJvdXRlQ29uZmlnID0gdGhpcy5nZXRQYXJlbnRBY3RSb3V0ZVJvdXRlKCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHJvdXRlQ29uZmlnKSkge1xuICAgICAgZm9yIChsZXQgaSA9IChyb3V0ZUNvbmZpZy5jYW5BY3RpdmF0ZUNoaWxkIHx8IFtdKS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAocm91dGVDb25maWcuY2FuQWN0aXZhdGVDaGlsZFtpXS5uYW1lID09PSBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQuZ3VhcmRDbGFzc05hbWUpIHtcbiAgICAgICAgICByb3V0ZUNvbmZpZy5jYW5BY3RpdmF0ZUNoaWxkLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0RpYWxvZ01vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50LkRJQUxPR19NT0RFO1xuICB9XG5cbiAgcHVibGljIGlzVGFiTW9kZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQuVEFCX01PREU7XG4gIH1cblxuICBwdWJsaWMgYWRkRGV0YWlsQ29tcG9uZW50KGNoaWxkUm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgbmV3RGV0YWlsQ29tcDogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgPSB7XG4gICAgICBwYXJhbXM6IGNoaWxkUm91dGUucGFyYW1zLFxuICAgICAgcXVlcnlQYXJhbXM6IGNoaWxkUm91dGUucXVlcnlQYXJhbXMsXG4gICAgICB1cmxTZWdtZW50czogY2hpbGRSb3V0ZS51cmwsXG4gICAgICBjb21wb25lbnQ6IGNoaWxkUm91dGUucm91dGVDb25maWcuY29tcG9uZW50LFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBpZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNiksXG4gICAgICBsYWJlbDogJycsXG4gICAgICBtb2RpZmllZDogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICB0aGlzLm9UYWJHcm91cC5hZGRUYWIobmV3RGV0YWlsQ29tcCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGlhbG9nTW9kZSgpKSB7XG4gICAgICB0aGlzLm9wZW5Gb3JtTGF5b3V0RGlhbG9nKG5ld0RldGFpbENvbXApO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjbG9zZURldGFpbChpZD86IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgdGhpcy5vVGFiR3JvdXAuY2xvc2VUYWIoaWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpYWxvZ01vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRpYWxvZ1JlZikpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKCk7XG4gICAgICB0aGlzLnJlbG9hZE1haW5Db21wb25lbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9wZW5Gb3JtTGF5b3V0RGlhbG9nKGRldGFpbENvbXA6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhKTogdm9pZCB7XG4gICAgY29uc3QgY3NzY2xhc3MgPSBbJ28tZm9ybS1sYXlvdXQtZGlhbG9nLW92ZXJsYXknXTtcbiAgICBpZiAodGhpcy5kaWFsb2dDbGFzcykge1xuICAgICAgY3NzY2xhc3MucHVzaCh0aGlzLmRpYWxvZ0NsYXNzKTtcbiAgICB9XG4gICAgY29uc3QgZGlhbG9nQ29uZmlnOiBNYXREaWFsb2dDb25maWcgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGRhdGE6IGRldGFpbENvbXAsXG4gICAgICAgIGxheW91dE1hbmFnZXJDb21wb25lbnQ6IHRoaXMsXG4gICAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgfSxcbiAgICAgIHdpZHRoOiB0aGlzLmRpYWxvZ09wdGlvbnMgPyB0aGlzLmRpYWxvZ09wdGlvbnMud2lkdGggOiB0aGlzLmRpYWxvZ1dpZHRoLFxuICAgICAgbWluV2lkdGg6IHRoaXMuZGlhbG9nT3B0aW9ucyA/IHRoaXMuZGlhbG9nT3B0aW9ucy5taW5XaWR0aCA6IHRoaXMuZGlhbG9nTWluV2lkdGgsXG4gICAgICBtYXhXaWR0aDogdGhpcy5kaWFsb2dPcHRpb25zID8gdGhpcy5kaWFsb2dPcHRpb25zLm1heFdpZHRoIDogdGhpcy5kaWFsb2dNYXhXaWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5kaWFsb2dPcHRpb25zID8gdGhpcy5kaWFsb2dPcHRpb25zLmhlaWdodCA6IHRoaXMuZGlhbG9nSGVpZ2h0LFxuICAgICAgbWluSGVpZ2h0OiB0aGlzLmRpYWxvZ09wdGlvbnMgPyB0aGlzLmRpYWxvZ09wdGlvbnMubWluSGVpZ2h0IDogdGhpcy5kaWFsb2dNaW5IZWlnaHQsXG4gICAgICBtYXhIZWlnaHQ6IHRoaXMuZGlhbG9nT3B0aW9ucyA/IHRoaXMuZGlhbG9nT3B0aW9ucy5tYXhIZWlnaHQgOiB0aGlzLmRpYWxvZ01heEhlaWdodCxcbiAgICAgIGRpc2FibGVDbG9zZTogdGhpcy5kaWFsb2dPcHRpb25zID8gdGhpcy5kaWFsb2dPcHRpb25zLmRpc2FibGVDbG9zZSA6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiB0aGlzLmRpYWxvZ09wdGlvbnMgPyB0aGlzLmRpYWxvZ09wdGlvbnMuY2xhc3MgOiBjc3NjbGFzc1xuXG4gICAgfTtcblxuICAgIGlmICh0aGlzLmRpYWxvZ09wdGlvbnMpIHtcbiAgICAgIGRpYWxvZ0NvbmZpZy5jbG9zZU9uTmF2aWdhdGlvbiA9IHRoaXMuZGlhbG9nT3B0aW9ucy5jbG9zZU9uTmF2aWdhdGlvbjtcbiAgICAgIGRpYWxvZ0NvbmZpZy5iYWNrZHJvcENsYXNzID0gdGhpcy5kaWFsb2dPcHRpb25zLmJhY2tkcm9wQ2xhc3M7XG4gICAgICBkaWFsb2dDb25maWcucG9zaXRpb24gPSB0aGlzLmRpYWxvZ09wdGlvbnMucG9zaXRpb247XG4gICAgICBkaWFsb2dDb25maWcuZGlzYWJsZUNsb3NlID0gdGhpcy5kaWFsb2dPcHRpb25zLmRpc2FibGVDbG9zZTtcbiAgICB9XG5cblxuICAgIHRoaXMuZGlhbG9nUmVmID0gdGhpcy5kaWFsb2cub3BlbihPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCwgZGlhbG9nQ29uZmlnKTtcbiAgICB0aGlzLmRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUlmTmVlZGVkKCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rm9ybUNhY2hlRGF0YShmb3JtSWQ6IHN0cmluZyk6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhIHtcbiAgICBpZiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkpIHtcbiAgICAgIHJldHVybiB0aGlzLm9UYWJHcm91cC5nZXRGb3JtQ2FjaGVEYXRhKGZvcm1JZCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGlhbG9nTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGlhbG9nUmVmKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0TGFzdFRhYklkKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICByZXR1cm4gdGhpcy5vVGFiR3JvdXAuZ2V0TGFzdFRhYklkKCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgc2V0TW9kaWZpZWRTdGF0ZShtb2RpZmllZDogYm9vbGVhbiwgaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgdGhpcy5vVGFiR3JvdXAuc2V0TW9kaWZpZWRTdGF0ZShtb2RpZmllZCwgaWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRMYWJlbEZyb21EYXRhKGRhdGE6IGFueSk6IHN0cmluZyB7XG4gICAgbGV0IGxhYmVsID0gJyc7XG4gICAgY29uc3QgaXNEYXRhRGVmaW5lZCA9IFV0aWwuaXNEZWZpbmVkKGRhdGEpO1xuICAgIGlmIChpc0RhdGFEZWZpbmVkICYmIGRhdGEuaGFzT3duUHJvcGVydHkoJ25ld190YWJfdGl0bGUnKSkge1xuICAgICAgbGFiZWwgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KGRhdGEubmV3X3RhYl90aXRsZSk7XG4gICAgfSBlbHNlIGlmIChpc0RhdGFEZWZpbmVkICYmIHRoaXMubGFiZWxDb2xzQXJyYXkubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aGlzLmxhYmVsQ29sc0FycmF5LmZvckVhY2goKGNvbCwgaWR4KSA9PiB7XG4gICAgICAgIGlmIChkYXRhW2NvbF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxhYmVsICs9IGRhdGFbY29sXSArICgoaWR4IDwgdGhpcy5sYWJlbENvbHNBcnJheS5sZW5ndGggLSAxKSA/IHRoaXMuc2VwYXJhdG9yIDogJycpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxhYmVsO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZU5hdmlnYXRpb24oZGF0YTogYW55LCBpZDogc3RyaW5nLCBpbnNlcnRpb25Nb2RlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgdGhpcy5vVGFiR3JvdXAudXBkYXRlTmF2aWdhdGlvbihkYXRhLCBpZCwgaW5zZXJ0aW9uTW9kZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGlhbG9nTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGlhbG9nUmVmKSkge1xuICAgICAgdGhpcy5kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UudXBkYXRlTmF2aWdhdGlvbihkYXRhLCBpZCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZUFjdGl2ZURhdGEoZGF0YTogYW55KSB7XG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICB0aGlzLm9UYWJHcm91cC51cGRhdGVBY3RpdmVEYXRhKGRhdGEpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpYWxvZ01vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRpYWxvZ1JlZikpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLnVwZGF0ZUFjdGl2ZURhdGEoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFJvdXRlT2ZBY3RpdmVJdGVtKCk6IGFueVtdIHtcbiAgICBsZXQgcm91dGUgPSBbXTtcbiAgICBpZiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkpIHtcbiAgICAgIHJvdXRlID0gdGhpcy5vVGFiR3JvdXAuZ2V0Um91dGVPZkFjdGl2ZUl0ZW0oKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEaWFsb2dNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5kaWFsb2dSZWYpKSB7XG4gICAgICByb3V0ZSA9IHRoaXMuZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFJvdXRlT2ZBY3RpdmVJdGVtKCk7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZTtcbiAgfVxuXG4gIHB1YmxpYyBpc01haW5Db21wb25lbnQoY29tcDogT1NlcnZpY2VDb21wb25lbnQpOiBib29sZWFuIHtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICBjb25zdCBmaXJzdFRhYiA9IHRoaXMub1RhYkdyb3VwLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWF0LXRhYi1ib2R5JylbMF07XG4gICAgICBpZiAoZmlyc3RUYWIpIHtcbiAgICAgICAgcmVzdWx0ID0gZmlyc3RUYWIuY29udGFpbnMoY29tcC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpYWxvZ01vZGUoKSkge1xuICAgICAgcmVzdWx0ID0gIWNvbXAub0Zvcm1MYXlvdXREaWFsb2c7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Um91dGVGb3JDb21wb25lbnQoY29tcDogT1NlcnZpY2VDb21wb25lbnQpOiBhbnlbXSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgaWYgKHRoaXMucGFyZW50Rm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIGNvbnN0IHBhcmVudFJvdXRlID0gdGhpcy5wYXJlbnRGb3JtTGF5b3V0TWFuYWdlci5nZXRSb3V0ZUZvckNvbXBvbmVudChjb21wKTtcbiAgICAgIGlmIChwYXJlbnRSb3V0ZSAmJiBwYXJlbnRSb3V0ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLnBhcmVudFJvdXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzTWFpbkNvbXBvbmVudChjb21wKSkge1xuICAgICAgY29uc3QgYWN0aXZlUm91dGUgPSB0aGlzLmdldFJvdXRlT2ZBY3RpdmVJdGVtKCk7XG4gICAgICBpZiAoYWN0aXZlUm91dGUgJiYgYWN0aXZlUm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgICByZXN1bHQucHVzaCguLi5hY3RpdmVSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgc2V0QXNBY3RpdmVGb3JtTGF5b3V0TWFuYWdlcigpOiB2b2lkIHtcbiAgICB0aGlzLm9Gb3JtTGF5b3V0TWFuYWdlclNlcnZpY2UuYWN0aXZlRm9ybUxheW91dE1hbmFnZXIgPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZE1haW5Db21wb25lbnRzKCk6IHZvaWQge1xuICAgIHRoaXMub25UcmlnZ2VyVXBkYXRlLmVtaXQoKTtcbiAgfVxuXG4gIHB1YmxpYyBhbGxvd1RvVXBkYXRlTmF2aWdhdGlvbihmb3JtQXR0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnRpdGxlRGF0YU9yaWdpbikpID9cbiAgICAgIHRoaXMudGl0bGVEYXRhT3JpZ2luID09PSBmb3JtQXR0ciA6XG4gICAgICB0cnVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZVN0YXRlU3RvcmFnZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlICYmIHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApICYmIHRoaXMuc3RvcmVTdGF0ZSkge1xuICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLnVwZGF0ZUNvbXBvbmVudFN0b3JhZ2UodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRQYXJlbnRBY3RSb3V0ZVJvdXRlKCk6IFJvdXRlIHtcbiAgICBsZXQgYWN0Um91dGUgPSB0aGlzLmFjdFJvdXRlO1xuICAgIHdoaWxlIChhY3RSb3V0ZS5wYXJlbnQgIT09IHVuZGVmaW5lZCAmJiBhY3RSb3V0ZS5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIGlmIChhY3RSb3V0ZS5yb3V0ZUNvbmZpZy5jaGlsZHJlbiB8fCBhY3RSb3V0ZS5yb3V0ZUNvbmZpZy5sb2FkQ2hpbGRyZW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBhY3RSb3V0ZSA9IGFjdFJvdXRlLnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIGFjdFJvdXRlLnJvdXRlQ29uZmlnO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUlmTmVlZGVkKCkge1xuICAgIGlmICh0aGlzLm1hcmtGb3JVcGRhdGUpIHtcbiAgICAgIHRoaXMubWFya0ZvclVwZGF0ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5vblRyaWdnZXJVcGRhdGUuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRQYXJhbXMoKTogYW55IHtcbiAgICBsZXQgZGF0YTtcbiAgICBpZiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkpIHtcbiAgICAgIGRhdGEgPSB0aGlzLm9UYWJHcm91cC5nZXRQYXJhbXMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEaWFsb2dNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5kaWFsb2dSZWYpKSB7XG4gICAgICBkYXRhID0gdGhpcy5kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuZ2V0UGFyYW1zKCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iXX0=