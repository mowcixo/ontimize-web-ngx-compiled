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
export var DEFAULT_INPUTS_O_FORM_LAYOUT_MANAGER = [
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
export var DEFAULT_OUTPUTS_O_FORM_LAYOUT_MANAGER = [
    'onMainTabSelected',
    'onSelectedTabChange',
    'onCloseTab'
];
var OFormLayoutManagerComponent = (function () {
    function OFormLayoutManagerComponent(injector, router, actRoute, dialog, elRef, parentFormLayoutManager) {
        var _this = this;
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
            this.onRouteChangeStorageSubscription = this.localStorageService.onRouteChange.subscribe(function (res) {
                _this.updateStateStorage();
            });
        }
    }
    OFormLayoutManagerComponent.prototype.ngOnInit = function () {
        var availableModeValues = [OFormLayoutManagerComponent.DIALOG_MODE, OFormLayoutManagerComponent.TAB_MODE];
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
    };
    OFormLayoutManagerComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.elRef) {
                _this.elRef.nativeElement.removeAttribute('title');
            }
            if (_this.storeState && _this.isTabMode() && Util.isDefined(_this.oTabGroup)) {
                var state = _this.localStorageService.getComponentStorage(_this);
                _this.oTabGroup.initializeComponentState(state);
            }
        });
    };
    OFormLayoutManagerComponent.prototype.ngOnDestroy = function () {
        if (this.onRouteChangeStorageSubscription) {
            this.onRouteChangeStorageSubscription.unsubscribe();
        }
        this.updateStateStorage();
        this.oFormLayoutManagerService.removeFormLayoutManager(this);
        this.destroyAactivateChildGuard();
    };
    OFormLayoutManagerComponent.prototype.getAttribute = function () {
        return this.oattr;
    };
    OFormLayoutManagerComponent.prototype.getComponentKey = function () {
        return 'OFormLayoutManagerComponent_' + this.oattr;
    };
    OFormLayoutManagerComponent.prototype.getDataToStore = function () {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            return this.oTabGroup.getDataToStore();
        }
        return {};
    };
    OFormLayoutManagerComponent.prototype.beforeunloadHandler = function () {
        this.updateStateStorage();
    };
    OFormLayoutManagerComponent.prototype.getLabelFromUrlParams = function (urlParams) {
        var _this = this;
        var label = '';
        var keys = Object.keys(urlParams);
        keys.forEach(function (param, i) {
            label += urlParams[param] + ((i < keys.length - 1) ? _this.separator : '');
        });
        return label;
    };
    OFormLayoutManagerComponent.prototype.getFormDataFromLabelColumns = function (data) {
        var _this = this;
        var formData = {};
        Object.keys(data).forEach(function (x) {
            if (_this.labelColsArray.indexOf(x) > -1) {
                formData[x] = data[x];
            }
        });
        return formData;
    };
    OFormLayoutManagerComponent.prototype.addActivateChildGuard = function () {
        var routeConfig = this.getParentActRouteRoute();
        if (Util.isDefined(routeConfig)) {
            var canActivateChildArray = (routeConfig.canActivateChild || []);
            var previouslyAdded = false;
            for (var i = 0, len = canActivateChildArray.length; i < len; i++) {
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
    };
    OFormLayoutManagerComponent.prototype.destroyAactivateChildGuard = function () {
        if (!this.addingGuard) {
            return;
        }
        var routeConfig = this.getParentActRouteRoute();
        if (Util.isDefined(routeConfig)) {
            for (var i = (routeConfig.canActivateChild || []).length - 1; i >= 0; i--) {
                if (routeConfig.canActivateChild[i].name === OFormLayoutManagerComponent.guardClassName) {
                    routeConfig.canActivateChild.splice(i, 1);
                    break;
                }
            }
        }
    };
    OFormLayoutManagerComponent.prototype.isDialogMode = function () {
        return this.mode === OFormLayoutManagerComponent.DIALOG_MODE;
    };
    OFormLayoutManagerComponent.prototype.isTabMode = function () {
        return this.mode === OFormLayoutManagerComponent.TAB_MODE;
    };
    OFormLayoutManagerComponent.prototype.addDetailComponent = function (childRoute, url) {
        var newDetailComp = {
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
    };
    OFormLayoutManagerComponent.prototype.closeDetail = function (id) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.closeTab(id);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            this.dialogRef.close();
            this.reloadMainComponents();
        }
    };
    OFormLayoutManagerComponent.prototype.openFormLayoutDialog = function (detailComp) {
        var _this = this;
        var cssclass = ['o-form-layout-dialog-overlay'];
        if (this.dialogClass) {
            cssclass.push(this.dialogClass);
        }
        var dialogConfig = {
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
        this.dialogRef.afterClosed().subscribe(function () {
            _this.updateIfNeeded();
        });
    };
    OFormLayoutManagerComponent.prototype.getFormCacheData = function (formId) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            return this.oTabGroup.getFormCacheData(formId);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            return this.dialogRef.componentInstance.data;
        }
        return undefined;
    };
    OFormLayoutManagerComponent.prototype.getLastTabId = function () {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            return this.oTabGroup.getLastTabId();
        }
        return undefined;
    };
    OFormLayoutManagerComponent.prototype.setModifiedState = function (modified, id) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.setModifiedState(modified, id);
        }
    };
    OFormLayoutManagerComponent.prototype.getLabelFromData = function (data) {
        var _this = this;
        var label = '';
        var isDataDefined = Util.isDefined(data);
        if (isDataDefined && data.hasOwnProperty('new_tab_title')) {
            label = this.translateService.get(data.new_tab_title);
        }
        else if (isDataDefined && this.labelColsArray.length !== 0) {
            this.labelColsArray.forEach(function (col, idx) {
                if (data[col] !== undefined) {
                    label += data[col] + ((idx < _this.labelColsArray.length - 1) ? _this.separator : '');
                }
            });
        }
        return label;
    };
    OFormLayoutManagerComponent.prototype.updateNavigation = function (data, id, insertionMode) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.updateNavigation(data, id, insertionMode);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            this.dialogRef.componentInstance.updateNavigation(data, id);
        }
    };
    OFormLayoutManagerComponent.prototype.updateActiveData = function (data) {
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            this.oTabGroup.updateActiveData(data);
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            this.dialogRef.componentInstance.updateActiveData(data);
        }
    };
    OFormLayoutManagerComponent.prototype.getRouteOfActiveItem = function () {
        var route = [];
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            route = this.oTabGroup.getRouteOfActiveItem();
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            route = this.dialogRef.componentInstance.getRouteOfActiveItem();
        }
        return route;
    };
    OFormLayoutManagerComponent.prototype.isMainComponent = function (comp) {
        var result = false;
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            var firstTab = this.oTabGroup.elementRef.nativeElement.getElementsByTagName('mat-tab-body')[0];
            if (firstTab) {
                result = firstTab.contains(comp.elementRef.nativeElement);
            }
        }
        else if (this.isDialogMode()) {
            result = !comp.oFormLayoutDialog;
        }
        return result;
    };
    OFormLayoutManagerComponent.prototype.getRouteForComponent = function (comp) {
        var result = [];
        if (this.parentFormLayoutManager) {
            var parentRoute = this.parentFormLayoutManager.getRouteForComponent(comp);
            if (parentRoute && parentRoute.length > 0) {
                result.push.apply(result, tslib_1.__spread(parentRoute));
            }
        }
        if (!this.isMainComponent(comp)) {
            var activeRoute = this.getRouteOfActiveItem();
            if (activeRoute && activeRoute.length > 0) {
                result.push.apply(result, tslib_1.__spread(activeRoute));
            }
        }
        return result;
    };
    OFormLayoutManagerComponent.prototype.setAsActiveFormLayoutManager = function () {
        this.oFormLayoutManagerService.activeFormLayoutManager = this;
    };
    OFormLayoutManagerComponent.prototype.reloadMainComponents = function () {
        this.onTriggerUpdate.emit();
    };
    OFormLayoutManagerComponent.prototype.allowToUpdateNavigation = function (formAttr) {
        return (this.isTabMode() && Util.isDefined(this.oTabGroup) && Util.isDefined(this.titleDataOrigin)) ?
            this.titleDataOrigin === formAttr :
            true;
    };
    OFormLayoutManagerComponent.prototype.updateStateStorage = function () {
        if (this.localStorageService && this.isTabMode() && Util.isDefined(this.oTabGroup) && this.storeState) {
            this.localStorageService.updateComponentStorage(this);
        }
    };
    OFormLayoutManagerComponent.prototype.getParentActRouteRoute = function () {
        var actRoute = this.actRoute;
        while (actRoute.parent !== undefined && actRoute.parent !== null) {
            if (actRoute.routeConfig.children || actRoute.routeConfig.loadChildren) {
                break;
            }
            actRoute = actRoute.parent;
        }
        return actRoute.routeConfig;
    };
    OFormLayoutManagerComponent.prototype.updateIfNeeded = function () {
        if (this.markForUpdate) {
            this.markForUpdate = false;
            this.onTriggerUpdate.emit();
        }
    };
    OFormLayoutManagerComponent.prototype.getParams = function () {
        var data;
        if (this.isTabMode() && Util.isDefined(this.oTabGroup)) {
            data = this.oTabGroup.getParams();
        }
        else if (this.isDialogMode() && Util.isDefined(this.dialogRef)) {
            data = this.dialogRef.componentInstance.getParams();
        }
        return data;
    };
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
    OFormLayoutManagerComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: Router },
        { type: ActivatedRoute },
        { type: MatDialog },
        { type: ElementRef },
        { type: OFormLayoutManagerComponent, decorators: [{ type: SkipSelf }, { type: Optional }] }
    ]; };
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
    return OFormLayoutManagerComponent;
}());
export { OFormLayoutManagerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvbGF5b3V0cy9mb3JtLWxheW91dC9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixRQUFRLEVBR1IsUUFBUSxFQUNSLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBaUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RSxPQUFPLEVBQUUsY0FBYyxFQUFpQyxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd4RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHbEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDekYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFFakYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlDQUF5QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQzVHLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSxtQ0FBbUMsRUFBRSxNQUFNLDZEQUE2RCxDQUFDO0FBRWxILE1BQU0sQ0FBQyxJQUFNLG9DQUFvQyxHQUFHO0lBQ2xELGFBQWE7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QUFpQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtzQ0FrRmpFLFlBQVksU0FBQyxxQkFBcUIsRUFBRSxFQUFFOztJQTlHdkM7UUFEQyxjQUFjLEVBQUU7O21FQUNpQjtJQTRYcEMsa0NBQUM7Q0FBQSxBQWxaRCxJQWtaQztTQXpZWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNraXBTZWxmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGlhbG9nLCBNYXREaWFsb2dDb25maWcsIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBSb3V0ZSwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgT1NlcnZpY2VDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL28tc2VydmljZS1jb21wb25lbnQuY2xhc3MnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJTG9jYWxTdG9yYWdlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9sb2NhbC1zdG9yYWdlLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRUYWJHcm91cCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1mb3JtLWxheW91dC10YWItZ3JvdXAuaW50ZXJmYWNlJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sb2NhbC1zdG9yYWdlLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL28tZm9ybS1sYXlvdXQtbWFuYWdlci5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgfSBmcm9tICcuLi8uLi90eXBlcy9mb3JtLWxheW91dC1kZXRhaWwtY29tcG9uZW50LWRhdGEudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9kaWFsb2cvby1mb3JtLWxheW91dC1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0RGlhbG9nT3B0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vZGlhbG9nL29wdGlvbnMvby1mb3JtLWxheW91dC1kaWFsb2ctb3B0aW9ucy5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2FuQWN0aXZhdGVGb3JtTGF5b3V0Q2hpbGRHdWFyZCB9IGZyb20gJy4vZ3VhcmRzL28tZm9ybS1sYXlvdXQtY2FuLWFjdGl2YXRlLWNoaWxkLmd1YXJkJztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0VGFiR3JvdXBPcHRpb25zQ29tcG9uZW50IH0gZnJvbSAnLi90YWJncm91cC9vcHRpb25zL28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAtb3B0aW9ucy5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19GT1JNX0xBWU9VVF9NQU5BR0VSID0gW1xuICAnb2F0dHI6IGF0dHInLFxuICAnbW9kZScsXG4gICdsYWJlbENvbHVtbnM6IGxhYmVsLWNvbHVtbnMnLFxuICAnc2VwYXJhdG9yJyxcbiAgJ3RpdGxlJyxcbiAgJ3N0b3JlU3RhdGU6IHN0b3JlLXN0YXRlJyxcbiAgLy8gYXR0ciBvZiB0aGUgY2hpbGQgZm9ybSBmcm9tIHdoaWNoIHRoZSBkYXRhIGZvciBidWlsZGluZyB0aGUgdGFiIHRpdGxlIHdpbGwgYmUgb2J0YWluZWRcbiAgJ3RpdGxlRGF0YU9yaWdpbjogdGl0bGUtZGF0YS1vcmlnaW4nLFxuICAnZGlhbG9nV2lkdGg6IGRpYWxvZy13aWR0aCcsXG4gICdkaWFsb2dNaW5XaWR0aDogZGlhbG9nLW1pbi13aWR0aCcsXG4gICdkaWFsb2dNYXhXaWR0aDogZGlhbG9nLW1heC13aWR0aCcsXG4gICdkaWFsb2dIZWlnaHQ6IGRpYWxvZy1oZWlnaHQnLFxuICAnZGlhbG9nTWluSGVpZ2h0OiBkaWFsb2ctbWluLWhlaWdodCcsXG4gICdkaWFsb2dNYXhIZWlnaHQgZGlhbG9nLW1heC1oZWlnaHQnLFxuICAnZGlhbG9nQ2xhc3M6IGRpYWxvZy1jbGFzcydcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19GT1JNX0xBWU9VVF9NQU5BR0VSID0gW1xuICAnb25NYWluVGFiU2VsZWN0ZWQnLFxuICAnb25TZWxlY3RlZFRhYkNoYW5nZScsXG4gICdvbkNsb3NlVGFiJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1mb3JtLWxheW91dC1tYW5hZ2VyJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX01BTkFHRVIsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fTEFZT1VUX01BTkFHRVIsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWZvcm0tbGF5b3V0LW1hbmFnZXIuY29tcG9uZW50Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZvcm0tbGF5b3V0LW1hbmFnZXJdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0LCBPbkRlc3Ryb3ksIElMb2NhbFN0b3JhZ2VDb21wb25lbnQge1xuXG4gIHB1YmxpYyBzdGF0aWMgZ3VhcmRDbGFzc05hbWUgPSAnQ2FuQWN0aXZhdGVGb3JtTGF5b3V0Q2hpbGRHdWFyZCc7XG5cbiAgcHVibGljIHN0YXRpYyBESUFMT0dfTU9ERSA9ICdkaWFsb2cnO1xuICBwdWJsaWMgc3RhdGljIFRBQl9NT0RFID0gJ3RhYic7XG5cbiAgcHVibGljIG9hdHRyOiBzdHJpbmc7XG4gIHB1YmxpYyBtb2RlOiBzdHJpbmc7XG4gIHB1YmxpYyBsYWJlbENvbHVtbnM6IHN0cmluZztcbiAgcHVibGljIHNlcGFyYXRvcjogc3RyaW5nID0gJyAnO1xuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHN0b3JlU3RhdGU6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgdGl0bGVEYXRhT3JpZ2luOiBzdHJpbmc7XG4gIHB1YmxpYyBkaWFsb2dXaWR0aDogc3RyaW5nO1xuICBwdWJsaWMgZGlhbG9nTWluV2lkdGg6IHN0cmluZztcbiAgcHVibGljIGRpYWxvZ01heFdpZHRoOiBzdHJpbmc7XG4gIHB1YmxpYyBkaWFsb2dIZWlnaHQ6IHN0cmluZztcbiAgcHVibGljIGRpYWxvZ01pbkhlaWdodDogc3RyaW5nO1xuICBwdWJsaWMgZGlhbG9nTWF4SGVpZ2h0OiBzdHJpbmc7XG4gIHB1YmxpYyBkaWFsb2dDbGFzczogc3RyaW5nID0gJyc7XG5cbiAgQFZpZXdDaGlsZCgndGFiR3JvdXAnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIG9UYWJHcm91cDogT0Zvcm1MYXlvdXRUYWJHcm91cDtcbiAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50PjtcblxuICBwdWJsaWMgb25NYWluVGFiU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvblNlbGVjdGVkVGFiQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25DbG9zZVRhYjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcm90ZWN0ZWQgbGFiZWxDb2xzQXJyYXk6IHN0cmluZ1tdID0gW107XG5cbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgb0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZTogT0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZTtcbiAgcHJvdGVjdGVkIGxvY2FsU3RvcmFnZVNlcnZpY2U6IExvY2FsU3RvcmFnZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBvblJvdXRlQ2hhbmdlU3RvcmFnZVN1YnNjcmlwdGlvbjogYW55O1xuXG4gIEBDb250ZW50Q2hpbGQoT0Zvcm1MYXlvdXRUYWJHcm91cE9wdGlvbnNDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgdGFiR3JvdXBPcHRpb25zOiBPRm9ybUxheW91dFRhYkdyb3VwT3B0aW9uc0NvbXBvbmVudDtcblxuICBAQ29udGVudENoaWxkKE9Gb3JtTGF5b3V0RGlhbG9nT3B0aW9uc0NvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBkaWFsb2dPcHRpb25zOiBPRm9ybUxheW91dERpYWxvZ09wdGlvbnNDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIGFkZGluZ0d1YXJkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHVibGljIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcblxuICBwdWJsaWMgbWFya0ZvclVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgb25UcmlnZ2VyVXBkYXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJvdGVjdGVkIGRpYWxvZzogTWF0RGlhbG9nLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBAU2tpcFNlbGYoKSBAT3B0aW9uYWwoKVxuICAgIHB1YmxpYyBwYXJlbnRGb3JtTGF5b3V0TWFuYWdlcjogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50XG4gICkge1xuICAgIHRoaXMub0Zvcm1MYXlvdXRNYW5hZ2VyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtTGF5b3V0TWFuYWdlclNlcnZpY2UpO1xuICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvY2FsU3RvcmFnZVNlcnZpY2UpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuICAgIGlmICh0aGlzLnN0b3JlU3RhdGUpIHtcbiAgICAgIHRoaXMub25Sb3V0ZUNoYW5nZVN0b3JhZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2Uub25Sb3V0ZUNoYW5nZS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0ZVN0b3JhZ2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBjb25zdCBhdmFpbGFibGVNb2RlVmFsdWVzID0gW09Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudC5ESUFMT0dfTU9ERSwgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50LlRBQl9NT0RFXTtcbiAgICB0aGlzLm1vZGUgPSAodGhpcy5tb2RlIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChhdmFpbGFibGVNb2RlVmFsdWVzLmluZGV4T2YodGhpcy5tb2RlKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMubW9kZSA9IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudC5ESUFMT0dfTU9ERTtcbiAgICB9XG4gICAgdGhpcy5sYWJlbENvbHNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmxhYmVsQ29sdW1ucyk7XG4gICAgdGhpcy5hZGRBY3RpdmF0ZUNoaWxkR3VhcmQoKTtcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMub2F0dHIpKSB7XG4gICAgICB0aGlzLm9hdHRyID0gdGhpcy50aXRsZSArIHRoaXMubW9kZTtcbiAgICAgIGNvbnNvbGUud2Fybignby1mb3JtLWxheW91dC1tYW5hZ2VyIG11c3QgaGF2ZSBhbiB1bmlxdWUgYXR0cicpO1xuICAgIH1cbiAgICB0aGlzLm9Gb3JtTGF5b3V0TWFuYWdlclNlcnZpY2UucmVnaXN0ZXJGb3JtTGF5b3V0TWFuYWdlcih0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5lbFJlZikge1xuICAgICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0aXRsZScpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RvcmVTdGF0ZSAmJiB0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXRDb21wb25lbnRTdG9yYWdlKHRoaXMpO1xuICAgICAgICB0aGlzLm9UYWJHcm91cC5pbml0aWFsaXplQ29tcG9uZW50U3RhdGUoc3RhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLm9uUm91dGVDaGFuZ2VTdG9yYWdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gICAgdGhpcy5vRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlLnJlbW92ZUZvcm1MYXlvdXRNYW5hZ2VyKHRoaXMpO1xuICAgIHRoaXMuZGVzdHJveUFhY3RpdmF0ZUNoaWxkR3VhcmQoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRBdHRyaWJ1dGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vYXR0cjtcbiAgfVxuXG4gIHB1YmxpYyBnZXRDb21wb25lbnRLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ09Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudF8nICsgdGhpcy5vYXR0cjtcbiAgfVxuXG4gIHB1YmxpYyBnZXREYXRhVG9TdG9yZSgpOiBvYmplY3Qge1xuICAgIC8vIG9ubHkgc3RvcmluZyBpbiB0YWIgbW9kZVxuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgcmV0dXJuIHRoaXMub1RhYkdyb3VwLmdldERhdGFUb1N0b3JlKCk7XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpiZWZvcmV1bmxvYWQnLCBbXSlcbiAgcHVibGljIGJlZm9yZXVubG9hZEhhbmRsZXIoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVTdGF0ZVN0b3JhZ2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRMYWJlbEZyb21VcmxQYXJhbXModXJsUGFyYW1zOiBvYmplY3QpOiBzdHJpbmcge1xuICAgIGxldCBsYWJlbCA9ICcnO1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh1cmxQYXJhbXMpO1xuICAgIGtleXMuZm9yRWFjaCgocGFyYW0sIGkpID0+IHtcbiAgICAgIGxhYmVsICs9IHVybFBhcmFtc1twYXJhbV0gKyAoKGkgPCBrZXlzLmxlbmd0aCAtIDEpID8gdGhpcy5zZXBhcmF0b3IgOiAnJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGxhYmVsO1xuICB9XG5cbiAgcHVibGljIGdldEZvcm1EYXRhRnJvbUxhYmVsQ29sdW1ucyhkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goeCA9PiB7XG4gICAgICBpZiAodGhpcy5sYWJlbENvbHNBcnJheS5pbmRleE9mKHgpID4gLTEpIHtcbiAgICAgICAgZm9ybURhdGFbeF0gPSBkYXRhW3hdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3JtRGF0YTtcblxuICB9XG4gIHB1YmxpYyBhZGRBY3RpdmF0ZUNoaWxkR3VhcmQoKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGVDb25maWcgPSB0aGlzLmdldFBhcmVudEFjdFJvdXRlUm91dGUoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQocm91dGVDb25maWcpKSB7XG4gICAgICBjb25zdCBjYW5BY3RpdmF0ZUNoaWxkQXJyYXkgPSAocm91dGVDb25maWcuY2FuQWN0aXZhdGVDaGlsZCB8fCBbXSk7XG4gICAgICBsZXQgcHJldmlvdXNseUFkZGVkID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuQWN0aXZhdGVDaGlsZEFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHByZXZpb3VzbHlBZGRlZCA9IChjYW5BY3RpdmF0ZUNoaWxkQXJyYXlbaV0ubmFtZSA9PT0gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50Lmd1YXJkQ2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHByZXZpb3VzbHlBZGRlZCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXByZXZpb3VzbHlBZGRlZCkge1xuICAgICAgICB0aGlzLmFkZGluZ0d1YXJkID0gdHJ1ZTtcbiAgICAgICAgY2FuQWN0aXZhdGVDaGlsZEFycmF5LnB1c2goQ2FuQWN0aXZhdGVGb3JtTGF5b3V0Q2hpbGRHdWFyZCk7XG4gICAgICAgIHJvdXRlQ29uZmlnLmNhbkFjdGl2YXRlQ2hpbGQgPSBjYW5BY3RpdmF0ZUNoaWxkQXJyYXk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3lBYWN0aXZhdGVDaGlsZEd1YXJkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hZGRpbmdHdWFyZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByb3V0ZUNvbmZpZyA9IHRoaXMuZ2V0UGFyZW50QWN0Um91dGVSb3V0ZSgpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChyb3V0ZUNvbmZpZykpIHtcbiAgICAgIGZvciAobGV0IGkgPSAocm91dGVDb25maWcuY2FuQWN0aXZhdGVDaGlsZCB8fCBbXSkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHJvdXRlQ29uZmlnLmNhbkFjdGl2YXRlQ2hpbGRbaV0ubmFtZSA9PT0gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50Lmd1YXJkQ2xhc3NOYW1lKSB7XG4gICAgICAgICAgcm91dGVDb25maWcuY2FuQWN0aXZhdGVDaGlsZC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaXNEaWFsb2dNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudC5ESUFMT0dfTU9ERTtcbiAgfVxuXG4gIHB1YmxpYyBpc1RhYk1vZGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50LlRBQl9NT0RFO1xuICB9XG5cbiAgcHVibGljIGFkZERldGFpbENvbXBvbmVudChjaGlsZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCB1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG5ld0RldGFpbENvbXA6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhID0ge1xuICAgICAgcGFyYW1zOiBjaGlsZFJvdXRlLnBhcmFtcyxcbiAgICAgIHF1ZXJ5UGFyYW1zOiBjaGlsZFJvdXRlLnF1ZXJ5UGFyYW1zLFxuICAgICAgdXJsU2VnbWVudHM6IGNoaWxkUm91dGUudXJsLFxuICAgICAgY29tcG9uZW50OiBjaGlsZFJvdXRlLnJvdXRlQ29uZmlnLmNvbXBvbmVudCxcbiAgICAgIHVybDogdXJsLFxuICAgICAgaWQ6IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLFxuICAgICAgbGFiZWw6ICcnLFxuICAgICAgbW9kaWZpZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgdGhpcy5vVGFiR3JvdXAuYWRkVGFiKG5ld0RldGFpbENvbXApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpYWxvZ01vZGUoKSkge1xuICAgICAgdGhpcy5vcGVuRm9ybUxheW91dERpYWxvZyhuZXdEZXRhaWxDb21wKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2xvc2VEZXRhaWwoaWQ/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkpIHtcbiAgICAgIHRoaXMub1RhYkdyb3VwLmNsb3NlVGFiKGlkKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEaWFsb2dNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5kaWFsb2dSZWYpKSB7XG4gICAgICB0aGlzLmRpYWxvZ1JlZi5jbG9zZSgpO1xuICAgICAgdGhpcy5yZWxvYWRNYWluQ29tcG9uZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvcGVuRm9ybUxheW91dERpYWxvZyhkZXRhaWxDb21wOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSk6IHZvaWQge1xuICAgIGNvbnN0IGNzc2NsYXNzID0gWydvLWZvcm0tbGF5b3V0LWRpYWxvZy1vdmVybGF5J107XG4gICAgaWYgKHRoaXMuZGlhbG9nQ2xhc3MpIHtcbiAgICAgIGNzc2NsYXNzLnB1c2godGhpcy5kaWFsb2dDbGFzcyk7XG4gICAgfVxuICAgIGNvbnN0IGRpYWxvZ0NvbmZpZzogTWF0RGlhbG9nQ29uZmlnID0ge1xuICAgICAgZGF0YToge1xuICAgICAgICBkYXRhOiBkZXRhaWxDb21wLFxuICAgICAgICBsYXlvdXRNYW5hZ2VyQ29tcG9uZW50OiB0aGlzLFxuICAgICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgIH0sXG4gICAgICB3aWR0aDogdGhpcy5kaWFsb2dPcHRpb25zID8gdGhpcy5kaWFsb2dPcHRpb25zLndpZHRoIDogdGhpcy5kaWFsb2dXaWR0aCxcbiAgICAgIG1pbldpZHRoOiB0aGlzLmRpYWxvZ09wdGlvbnMgPyB0aGlzLmRpYWxvZ09wdGlvbnMubWluV2lkdGggOiB0aGlzLmRpYWxvZ01pbldpZHRoLFxuICAgICAgbWF4V2lkdGg6IHRoaXMuZGlhbG9nT3B0aW9ucyA/IHRoaXMuZGlhbG9nT3B0aW9ucy5tYXhXaWR0aCA6IHRoaXMuZGlhbG9nTWF4V2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuZGlhbG9nT3B0aW9ucyA/IHRoaXMuZGlhbG9nT3B0aW9ucy5oZWlnaHQgOiB0aGlzLmRpYWxvZ0hlaWdodCxcbiAgICAgIG1pbkhlaWdodDogdGhpcy5kaWFsb2dPcHRpb25zID8gdGhpcy5kaWFsb2dPcHRpb25zLm1pbkhlaWdodCA6IHRoaXMuZGlhbG9nTWluSGVpZ2h0LFxuICAgICAgbWF4SGVpZ2h0OiB0aGlzLmRpYWxvZ09wdGlvbnMgPyB0aGlzLmRpYWxvZ09wdGlvbnMubWF4SGVpZ2h0IDogdGhpcy5kaWFsb2dNYXhIZWlnaHQsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRoaXMuZGlhbG9nT3B0aW9ucyA/IHRoaXMuZGlhbG9nT3B0aW9ucy5kaXNhYmxlQ2xvc2UgOiB0cnVlLFxuICAgICAgcGFuZWxDbGFzczogdGhpcy5kaWFsb2dPcHRpb25zID8gdGhpcy5kaWFsb2dPcHRpb25zLmNsYXNzIDogY3NzY2xhc3NcblxuICAgIH07XG5cbiAgICBpZiAodGhpcy5kaWFsb2dPcHRpb25zKSB7XG4gICAgICBkaWFsb2dDb25maWcuY2xvc2VPbk5hdmlnYXRpb24gPSB0aGlzLmRpYWxvZ09wdGlvbnMuY2xvc2VPbk5hdmlnYXRpb247XG4gICAgICBkaWFsb2dDb25maWcuYmFja2Ryb3BDbGFzcyA9IHRoaXMuZGlhbG9nT3B0aW9ucy5iYWNrZHJvcENsYXNzO1xuICAgICAgZGlhbG9nQ29uZmlnLnBvc2l0aW9uID0gdGhpcy5kaWFsb2dPcHRpb25zLnBvc2l0aW9uO1xuICAgICAgZGlhbG9nQ29uZmlnLmRpc2FibGVDbG9zZSA9IHRoaXMuZGlhbG9nT3B0aW9ucy5kaXNhYmxlQ2xvc2U7XG4gICAgfVxuXG5cbiAgICB0aGlzLmRpYWxvZ1JlZiA9IHRoaXMuZGlhbG9nLm9wZW4oT0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQsIGRpYWxvZ0NvbmZpZyk7XG4gICAgdGhpcy5kaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVJZk5lZWRlZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldEZvcm1DYWNoZURhdGEoZm9ybUlkOiBzdHJpbmcpOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSB7XG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICByZXR1cm4gdGhpcy5vVGFiR3JvdXAuZ2V0Rm9ybUNhY2hlRGF0YShmb3JtSWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpYWxvZ01vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRpYWxvZ1JlZikpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldExhc3RUYWJJZCgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgcmV0dXJuIHRoaXMub1RhYkdyb3VwLmdldExhc3RUYWJJZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIHNldE1vZGlmaWVkU3RhdGUobW9kaWZpZWQ6IGJvb2xlYW4sIGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkpIHtcbiAgICAgIHRoaXMub1RhYkdyb3VwLnNldE1vZGlmaWVkU3RhdGUobW9kaWZpZWQsIGlkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0TGFiZWxGcm9tRGF0YShkYXRhOiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCBsYWJlbCA9ICcnO1xuICAgIGNvbnN0IGlzRGF0YURlZmluZWQgPSBVdGlsLmlzRGVmaW5lZChkYXRhKTtcbiAgICBpZiAoaXNEYXRhRGVmaW5lZCAmJiBkYXRhLmhhc093blByb3BlcnR5KCduZXdfdGFiX3RpdGxlJykpIHtcbiAgICAgIGxhYmVsID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChkYXRhLm5ld190YWJfdGl0bGUpO1xuICAgIH0gZWxzZSBpZiAoaXNEYXRhRGVmaW5lZCAmJiB0aGlzLmxhYmVsQ29sc0FycmF5Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhpcy5sYWJlbENvbHNBcnJheS5mb3JFYWNoKChjb2wsIGlkeCkgPT4ge1xuICAgICAgICBpZiAoZGF0YVtjb2xdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBsYWJlbCArPSBkYXRhW2NvbF0gKyAoKGlkeCA8IHRoaXMubGFiZWxDb2xzQXJyYXkubGVuZ3RoIC0gMSkgPyB0aGlzLnNlcGFyYXRvciA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsYWJlbDtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVOYXZpZ2F0aW9uKGRhdGE6IGFueSwgaWQ6IHN0cmluZywgaW5zZXJ0aW9uTW9kZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkpIHtcbiAgICAgIHRoaXMub1RhYkdyb3VwLnVwZGF0ZU5hdmlnYXRpb24oZGF0YSwgaWQsIGluc2VydGlvbk1vZGUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0RpYWxvZ01vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRpYWxvZ1JlZikpIHtcbiAgICAgIHRoaXMuZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLnVwZGF0ZU5hdmlnYXRpb24oZGF0YSwgaWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVBY3RpdmVEYXRhKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgdGhpcy5vVGFiR3JvdXAudXBkYXRlQWN0aXZlRGF0YShkYXRhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEaWFsb2dNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5kaWFsb2dSZWYpKSB7XG4gICAgICB0aGlzLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS51cGRhdGVBY3RpdmVEYXRhKGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRSb3V0ZU9mQWN0aXZlSXRlbSgpOiBhbnlbXSB7XG4gICAgbGV0IHJvdXRlID0gW107XG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICByb3V0ZSA9IHRoaXMub1RhYkdyb3VwLmdldFJvdXRlT2ZBY3RpdmVJdGVtKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGlhbG9nTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGlhbG9nUmVmKSkge1xuICAgICAgcm91dGUgPSB0aGlzLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5nZXRSb3V0ZU9mQWN0aXZlSXRlbSgpO1xuICAgIH1cbiAgICByZXR1cm4gcm91dGU7XG4gIH1cblxuICBwdWJsaWMgaXNNYWluQ29tcG9uZW50KGNvbXA6IE9TZXJ2aWNlQ29tcG9uZW50KTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSkge1xuICAgICAgY29uc3QgZmlyc3RUYWIgPSB0aGlzLm9UYWJHcm91cC5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21hdC10YWItYm9keScpWzBdO1xuICAgICAgaWYgKGZpcnN0VGFiKSB7XG4gICAgICAgIHJlc3VsdCA9IGZpcnN0VGFiLmNvbnRhaW5zKGNvbXAuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNEaWFsb2dNb2RlKCkpIHtcbiAgICAgIHJlc3VsdCA9ICFjb21wLm9Gb3JtTGF5b3V0RGlhbG9nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGdldFJvdXRlRm9yQ29tcG9uZW50KGNvbXA6IE9TZXJ2aWNlQ29tcG9uZW50KTogYW55W10ge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGlmICh0aGlzLnBhcmVudEZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICBjb25zdCBwYXJlbnRSb3V0ZSA9IHRoaXMucGFyZW50Rm9ybUxheW91dE1hbmFnZXIuZ2V0Um91dGVGb3JDb21wb25lbnQoY29tcCk7XG4gICAgICBpZiAocGFyZW50Um91dGUgJiYgcGFyZW50Um91dGUubGVuZ3RoID4gMCkge1xuICAgICAgICByZXN1bHQucHVzaCguLi5wYXJlbnRSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy5pc01haW5Db21wb25lbnQoY29tcCkpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZVJvdXRlID0gdGhpcy5nZXRSb3V0ZU9mQWN0aXZlSXRlbSgpO1xuICAgICAgaWYgKGFjdGl2ZVJvdXRlICYmIGFjdGl2ZVJvdXRlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0LnB1c2goLi4uYWN0aXZlUm91dGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHNldEFzQWN0aXZlRm9ybUxheW91dE1hbmFnZXIoKTogdm9pZCB7XG4gICAgdGhpcy5vRm9ybUxheW91dE1hbmFnZXJTZXJ2aWNlLmFjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyID0gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWRNYWluQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICB0aGlzLm9uVHJpZ2dlclVwZGF0ZS5lbWl0KCk7XG4gIH1cblxuICBwdWJsaWMgYWxsb3dUb1VwZGF0ZU5hdmlnYXRpb24oZm9ybUF0dHI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5pc1RhYk1vZGUoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLm9UYWJHcm91cCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy50aXRsZURhdGFPcmlnaW4pKSA/XG4gICAgICB0aGlzLnRpdGxlRGF0YU9yaWdpbiA9PT0gZm9ybUF0dHIgOlxuICAgICAgdHJ1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVTdGF0ZVN0b3JhZ2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSAmJiB0aGlzLmlzVGFiTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMub1RhYkdyb3VwKSAmJiB0aGlzLnN0b3JlU3RhdGUpIHtcbiAgICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS51cGRhdGVDb21wb25lbnRTdG9yYWdlKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UGFyZW50QWN0Um91dGVSb3V0ZSgpOiBSb3V0ZSB7XG4gICAgbGV0IGFjdFJvdXRlID0gdGhpcy5hY3RSb3V0ZTtcbiAgICB3aGlsZSAoYWN0Um91dGUucGFyZW50ICE9PSB1bmRlZmluZWQgJiYgYWN0Um91dGUucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICBpZiAoYWN0Um91dGUucm91dGVDb25maWcuY2hpbGRyZW4gfHwgYWN0Um91dGUucm91dGVDb25maWcubG9hZENoaWxkcmVuKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgYWN0Um91dGUgPSBhY3RSb3V0ZS5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBhY3RSb3V0ZS5yb3V0ZUNvbmZpZztcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVJZk5lZWRlZCgpIHtcbiAgICBpZiAodGhpcy5tYXJrRm9yVXBkYXRlKSB7XG4gICAgICB0aGlzLm1hcmtGb3JVcGRhdGUgPSBmYWxzZTtcbiAgICAgIHRoaXMub25UcmlnZ2VyVXBkYXRlLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0UGFyYW1zKCk6IGFueSB7XG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKHRoaXMuaXNUYWJNb2RlKCkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5vVGFiR3JvdXApKSB7XG4gICAgICBkYXRhID0gdGhpcy5vVGFiR3JvdXAuZ2V0UGFyYW1zKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRGlhbG9nTW9kZSgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuZGlhbG9nUmVmKSkge1xuICAgICAgZGF0YSA9IHRoaXMuZGlhbG9nUmVmLmNvbXBvbmVudEluc3RhbmNlLmdldFBhcmFtcygpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufVxuIl19