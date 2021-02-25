import { EventEmitter } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { OFormLayoutDialogComponent } from '../../../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { DialogService } from '../../../services/dialog.service';
import { NavigationService } from '../../../services/navigation.service';
import { Codes } from '../../../util/codes';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
export class OFormNavigationClass {
    constructor(injector, form, router, actRoute) {
        this.injector = injector;
        this.form = form;
        this.router = router;
        this.actRoute = actRoute;
        this.urlSegments = [];
        this.onUrlParamChangedStream = new EventEmitter();
        this.navigationStream = new EventEmitter();
        this.dialogService = injector.get(DialogService);
        this.navigationService = injector.get(NavigationService);
        try {
            this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
        }
        catch (e) {
        }
        try {
            this.formLayoutDialog = this.injector.get(OFormLayoutDialogComponent);
        }
        catch (e) {
        }
        if (this.formLayoutDialog && !this.formLayoutManager) {
            this.formLayoutManager = this.formLayoutDialog.formLayoutManager;
        }
        const self = this;
        this.combinedNavigationStream = combineLatest([self.onUrlParamChangedStream.asObservable()]);
        this.combinedNavigationStream.subscribe(valArr => {
            if (Util.isArray(valArr) && valArr.length === 1 && valArr[0]) {
                self.navigationStream.emit(true);
            }
        });
    }
    initialize() {
        if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
            this.id = this.formLayoutManager.getLastTabId();
        }
    }
    destroy() {
        if (this.qParamSub) {
            this.qParamSub.unsubscribe();
        }
        if (this.urlParamSub) {
            this.urlParamSub.unsubscribe();
        }
        if (this.urlSub) {
            this.urlSub.unsubscribe();
        }
        if (this.combinedNavigationStreamSubscription) {
            this.combinedNavigationStreamSubscription.unsubscribe();
        }
    }
    subscribeToQueryParams() {
        if (this.formLayoutManager) {
            const cacheData = this.formLayoutManager.getFormCacheData(this.id);
            if (Util.isDefined(cacheData)) {
                this.queryParams = cacheData.queryParams || {};
                this.parseQueryParams();
            }
        }
        else {
            const self = this;
            this.qParamSub = this.actRoute.queryParams.subscribe(params => {
                if (params) {
                    self.queryParams = params;
                    self.parseQueryParams();
                }
            });
        }
    }
    parseQueryParams() {
        const isDetail = this.queryParams[Codes.IS_DETAIL];
        this.form.isDetailForm = this.formLayoutManager ? false : (isDetail === 'true');
    }
    subscribeToUrlParams() {
        if (this.formLayoutManager) {
            const cacheData = this.formLayoutManager.getFormCacheData(this.id);
            if (Util.isDefined(cacheData)) {
                this.urlParams = cacheData.params;
                this.parseUrlParams();
            }
        }
        else {
            const self = this;
            this.urlParamSub = this.actRoute.params.subscribe(params => {
                self.urlParams = params;
                this.parseUrlParams();
            });
        }
    }
    parseUrlParams() {
        if (Util.isDefined(this.urlParams) && Util.isDefined(this.urlParams[Codes.PARENT_KEYS_KEY])) {
            this.form.formParentKeysValues = Util.decodeParentKeys(this.urlParams[Codes.PARENT_KEYS_KEY]);
        }
        if (this.urlParams) {
            this.onUrlParamChangedStream.emit(true);
        }
    }
    subscribeToUrl() {
        if (this.formLayoutManager) {
            const cacheData = this.formLayoutManager.getFormCacheData(this.id);
            if (Util.isDefined(cacheData)) {
                this.urlSegments = cacheData.urlSegments;
            }
        }
        else {
            const self = this;
            this.urlSub = this.actRoute.url.subscribe(urlSegments => {
                self.urlSegments = urlSegments;
            });
        }
    }
    subscribeToCacheChanges(onCacheEmptyStateChanges) {
        this.cacheStateSubscription = onCacheEmptyStateChanges.asObservable().subscribe(res => {
            this.setModifiedState(!res);
        });
    }
    getCurrentKeysValues() {
        let filter = {};
        if (this.urlParams) {
            filter = this.getFilterFromObject(this.urlParams);
        }
        return filter;
    }
    getFilterFromObject(objectParam) {
        const filter = {};
        if (!objectParam || Object.keys(objectParam).length === 0) {
            return filter;
        }
        if (this.form.keysArray) {
            this.form.keysArray.forEach((key, index) => {
                if (objectParam[key]) {
                    filter[key] = SQLTypes.parseUsingSQLType(objectParam[key], this.form.keysSqlTypesArray[index]);
                }
            });
        }
        Object.keys(this.form._pKeysEquiv).forEach((item, index) => {
            const urlVal = objectParam[this.form._pKeysEquiv[item]];
            if (urlVal) {
                filter[item] = SQLTypes.parseUsingSQLType(urlVal, this.form.keysSqlTypesArray[index]);
            }
        });
        return filter;
    }
    getFilterFromUrlParams() {
        const filter = Object.assign({}, this.getUrlParams() || {});
        const urlParamsKeys = Object.keys(filter || {});
        if (urlParamsKeys.length > 0) {
            urlParamsKeys.forEach(key => {
                if (key === Codes.PARENT_KEYS_KEY) {
                    delete filter[key];
                    Object.assign(filter, this.form.formParentKeysValues);
                }
            });
        }
        return filter;
    }
    getUrlSegments() {
        return this.urlSegments;
    }
    getQueryParams() {
        return this.queryParams;
    }
    setUrlParams(val) {
        this.urlParams = val;
    }
    getUrlParams() {
        return this.urlParams;
    }
    setModifiedState(modified) {
        if (this.formLayoutManager) {
            this.formLayoutManager.setModifiedState(modified, this.id);
        }
    }
    updateNavigation() {
        if (this.formLayoutManager) {
            const isInInsertMode = this.form.isInInsertMode();
            let formData;
            if (isInInsertMode) {
                formData = {};
                formData.new_tab_title = 'LAYOUT_MANANGER.INSERTION_MODE_TITLE';
            }
            else if (this.formLayoutManager.allowToUpdateNavigation(this.form.oattr)) {
                formData = {};
                const self = this;
                Object.keys(this.form.formData).forEach(key => {
                    formData[key] = self.form.formData[key].value;
                });
            }
            if (formData) {
                this.formLayoutManager.updateNavigation(formData, this.id, isInInsertMode);
            }
        }
    }
    navigateBack() {
        if (this.formLayoutManager) {
            this.formLayoutManager.closeDetail(this.id);
        }
        else if (this.navigationService) {
            this.navigationService.removeLastItem();
            const navData = this.navigationService.getLastItem();
            if (navData) {
                const extras = {};
                extras[Codes.QUERY_PARAMS] = navData.queryParams;
                this.router.navigate([navData.url], extras);
            }
        }
    }
    closeDetailAction(options) {
        if (this.formLayoutManager) {
            this.formLayoutManager.closeDetail(this.id);
        }
        else if (this.navigationService) {
            this.form.beforeCloseDetail.emit();
            if (!this.navigationService.removeLastItemsUntilMain()) {
                this.navigationService.removeLastItem();
            }
            let navData = this.navigationService.getLastItem();
            if (navData) {
                if (this.navigationService.isCurrentRoute(navData.url)) {
                    this.navigationService.removeLastItem();
                    navData = this.navigationService.getLastItem();
                }
                const extras = {};
                extras[Codes.QUERY_PARAMS] = navData.queryParams;
                this.router.navigate([navData.url], extras).then(val => {
                    if (val && options && options.changeToolbarMode) {
                        this.form.getFormToolbar().setInitialMode();
                    }
                });
            }
        }
    }
    stayInRecordAfterInsert(insertedKeys) {
        if (this.formLayoutManager) {
            this.form.setInitialMode();
            const self = this;
            const subscription = this.form.onDataLoaded.subscribe(() => {
                const keys = self.form.getKeysValues();
                self.formLayoutManager.updateActiveData({ params: keys });
                const cacheData = self.formLayoutManager.getFormCacheData(self.id);
                if (Util.isDefined(cacheData)) {
                    self.urlParams = cacheData.params;
                }
                subscription.unsubscribe();
            });
            this.form.queryData(insertedKeys);
        }
        else if (this.navigationService && this.form.keysArray && insertedKeys) {
            this.navigationService.removeLastItem();
            let params = [];
            this.form.keysArray.forEach((current, index) => {
                if (insertedKeys[current]) {
                    params.push(insertedKeys[current]);
                }
            });
            let extras = {};
            let qParams = Object.assign({}, this.getQueryParams(), Codes.getIsDetailObject());
            extras[Codes.QUERY_PARAMS] = qParams;
            let route = [];
            const navData = this.navigationService.getLastMainNavigationRouteData();
            if (navData) {
                let url = navData.url;
                const detailRoute = navData.getDetailFormRoute();
                if (Util.isDefined(detailRoute)) {
                    route.push(detailRoute);
                    const detailIndex = url.lastIndexOf('/' + detailRoute);
                    if (detailIndex !== -1) {
                        url = url.substring(0, detailIndex);
                    }
                }
                route.unshift(url);
                route.push(...params);
                this.navigationService.deleteActiveFormMode(navData);
            }
            else {
                extras.relativeTo = this.actRoute;
                route = ['../', ...params];
            }
            this.router.navigate(route, extras);
        }
    }
    goInsertMode(options) {
        if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
            this.form.setInsertMode();
        }
        else if (this.navigationService) {
            if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
                this.formLayoutManager.setAsActiveFormLayoutManager();
            }
            let route = [];
            const extras = {};
            const navData = this.navigationService.getLastMainNavigationRouteData();
            if (!this.formLayoutManager && navData) {
                route.push(navData.url);
                const detailRoute = navData.getDetailFormRoute();
                if (Util.isDefined(detailRoute)) {
                    route.push(detailRoute);
                }
                route.push(navData.getInsertFormRoute());
            }
            else {
                extras.relativeTo = this.actRoute;
                route = ['../' + Codes.DEFAULT_INSERT_ROUTE];
            }
            this.storeNavigationFormRoutes('insertFormRoute');
            this.router.navigate(route, extras).then((val) => {
                if (val && options && options.changeToolbarMode) {
                    this.form.getFormToolbar().setInsertMode();
                }
            });
        }
    }
    goEditMode(options) {
        if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
            this.form.setUpdateMode();
        }
        else if (this.navigationService) {
            let route = [];
            const extras = {};
            if (this.form.isDetailForm) {
                extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
            }
            extras[Codes.QUERY_PARAMS] = Object.assign({}, this.getQueryParams(), extras[Codes.QUERY_PARAMS] || {});
            const params = [];
            const urlParams = this.getUrlParams();
            this.form.keysArray.forEach(key => {
                if (urlParams[key]) {
                    params.push(urlParams[key]);
                }
            });
            const navData = this.navigationService.getPreviousRouteData();
            if (Util.isDefined(navData)) {
                route.push(navData.url);
                const detailRoute = navData.getDetailFormRoute();
                if (Util.isDefined(detailRoute)) {
                    route.push(detailRoute);
                }
                route.push(...params);
                route.push(navData.getEditFormRoute());
            }
            else {
                extras.relativeTo = this.actRoute;
                route = ['../', ...params, Codes.DEFAULT_EDIT_ROUTE];
            }
            this.storeNavigationFormRoutes('editFormRoute');
            this.form.beforeUpdateMode.emit();
            this.router.navigate(route, extras).then((val) => {
                if (val && options && options.changeToolbarMode) {
                    this.form.getFormToolbar().setEditMode();
                }
            });
        }
    }
    getNestedLevelsNumber() {
        let actRoute = this.actRoute;
        let i = 0;
        while (actRoute.parent) {
            actRoute = actRoute.parent;
            actRoute.url.subscribe((x) => {
                if (x && x.length) {
                    i++;
                }
            });
        }
        return i;
    }
    getFullUrlSegments() {
        let fullUrlSegments = [];
        const router = this.router;
        if (router && router.url && router.url.length) {
            const root = router.parseUrl(router.url).root;
            if (root && root.hasChildren() && root.children.primary) {
                fullUrlSegments = root.children.primary.segments;
            }
        }
        return fullUrlSegments;
    }
    showConfirmDiscardChanges() {
        let subscription;
        if (this.form.isInitialStateChanged() && !this.form.isInInsertMode()) {
            subscription = this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST');
        }
        if (subscription === undefined) {
            const observable = new Observable(observer => {
                observer.next(true);
                observer.complete();
            });
            subscription = observable.toPromise();
        }
        return subscription;
    }
    storeNavigationFormRoutes(activeMode) {
        const formRoutes = this.navigationService.getPreviousRouteData().formRoutes;
        this.navigationService.storeFormRoutes({
            detailFormRoute: formRoutes ? formRoutes.detailFormRoute : Codes.DEFAULT_DETAIL_ROUTE,
            editFormRoute: formRoutes ? formRoutes.editFormRoute : Codes.DEFAULT_EDIT_ROUTE,
            insertFormRoute: formRoutes ? formRoutes.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE
        }, activeMode);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLm5hdmlnYXRpb24uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybS9uYXZpZ2F0aW9uL28tZm9ybS5uYXZpZ2F0aW9uLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQVksTUFBTSxlQUFlLENBQUM7QUFFdkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRS9ELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG9FQUFvRSxDQUFDO0FBQ2hILE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDhEQUE4RCxDQUFDO0FBQzNHLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUNqRSxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sc0NBQXNDLENBQUM7QUFFMUYsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHMUMsTUFBTSxPQUFPLG9CQUFvQjtJQTJCL0IsWUFDWSxRQUFrQixFQUNsQixJQUFvQixFQUNwQixNQUFjLEVBQ2QsUUFBd0I7UUFIeEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUNwQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFmMUIsZ0JBQVcsR0FBUSxFQUFFLENBQUM7UUFJdEIsNEJBQXVCLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFFaEYscUJBQWdCLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFXM0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENB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LENBQUMsS0FBSyxDQUFDLG9CQUFvQjtZQUNyRixhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCO1lBQy9FLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxvQkFBb0I7U0FDdEYsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqQixDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkV4dHJhcywgUm91dGVyLCBVcmxTZWdtZW50R3JvdXAgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vbGF5b3V0cy9mb3JtLWxheW91dC9kaWFsb2cvby1mb3JtLWxheW91dC1kaWFsb2cuY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UsIE9OYXZpZ2F0aW9uSXRlbSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25hdmlnYXRpb24uc2VydmljZSc7XG5pbXBvcnQgeyBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2Zvcm0tbGF5b3V0LWRldGFpbC1jb21wb25lbnQtZGF0YS50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBTUUxUeXBlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvc3FsdHlwZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uL28tZm9ybS5jb21wb25lbnQnO1xuXG5leHBvcnQgY2xhc3MgT0Zvcm1OYXZpZ2F0aW9uQ2xhc3Mge1xuXG4gIGZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQ7XG4gIGZvcm1MYXlvdXREaWFsb2c6IE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50O1xuICBpZDogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbmF2aWdhdGlvblNlcnZpY2U6IE5hdmlnYXRpb25TZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBxUGFyYW1TdWI6IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHF1ZXJ5UGFyYW1zOiBhbnk7XG5cbiAgcHJvdGVjdGVkIHVybFBhcmFtU3ViOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCB1cmxQYXJhbXM6IG9iamVjdDtcblxuICBwcm90ZWN0ZWQgdXJsU3ViOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCB1cmxTZWdtZW50czogYW55ID0gW107XG5cbiAgcHJvdGVjdGVkIGNvbWJpbmVkTmF2aWdhdGlvblN0cmVhbTogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcm90ZWN0ZWQgY29tYmluZWROYXZpZ2F0aW9uU3RyZWFtU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBvblVybFBhcmFtQ2hhbmdlZFN0cmVhbTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIHB1YmxpYyBuYXZpZ2F0aW9uU3RyZWFtOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgcHJvdGVjdGVkIG9uQ2xvc2VUYWJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGNhY2hlU3RhdGVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJvdGVjdGVkIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZSA9IGluamVjdG9yLmdldChOYXZpZ2F0aW9uU2VydmljZSk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gTm8gcGFyZW50IGZvcm1MYXlvdXRNYW5hZ2VyXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZm9ybUxheW91dERpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBObyBwYXJlbnQgZm9ybSBsYXlvdXQgZGlhbG9nXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9ybUxheW91dERpYWxvZyAmJiAhdGhpcy5mb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlciA9IHRoaXMuZm9ybUxheW91dERpYWxvZy5mb3JtTGF5b3V0TWFuYWdlcjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbWJpbmVkTmF2aWdhdGlvblN0cmVhbSA9IGNvbWJpbmVMYXRlc3QoW3NlbGYub25VcmxQYXJhbUNoYW5nZWRTdHJlYW0uYXNPYnNlcnZhYmxlKCldKTtcblxuICAgIHRoaXMuY29tYmluZWROYXZpZ2F0aW9uU3RyZWFtLnN1YnNjcmliZSh2YWxBcnIgPT4ge1xuICAgICAgaWYgKFV0aWwuaXNBcnJheSh2YWxBcnIpICYmIHZhbEFyci5sZW5ndGggPT09IDEgJiYgdmFsQXJyWzBdKSB7XG4gICAgICAgIHNlbGYubmF2aWdhdGlvblN0cmVhbS5lbWl0KHRydWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzVGFiTW9kZSgpKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5nZXRMYXN0VGFiSWQoKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnFQYXJhbVN1Yikge1xuICAgICAgdGhpcy5xUGFyYW1TdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXJsUGFyYW1TdWIpIHtcbiAgICAgIHRoaXMudXJsUGFyYW1TdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudXJsU3ViKSB7XG4gICAgICB0aGlzLnVybFN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb21iaW5lZE5hdmlnYXRpb25TdHJlYW1TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuY29tYmluZWROYXZpZ2F0aW9uU3RyZWFtU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlVG9RdWVyeVBhcmFtcygpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgY29uc3QgY2FjaGVEYXRhOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0Rm9ybUNhY2hlRGF0YSh0aGlzLmlkKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChjYWNoZURhdGEpKSB7XG4gICAgICAgIHRoaXMucXVlcnlQYXJhbXMgPSBjYWNoZURhdGEucXVlcnlQYXJhbXMgfHwge307XG4gICAgICAgIHRoaXMucGFyc2VRdWVyeVBhcmFtcygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMucVBhcmFtU3ViID0gdGhpcy5hY3RSb3V0ZS5xdWVyeVBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgICAgaWYgKHBhcmFtcykge1xuICAgICAgICAgIHNlbGYucXVlcnlQYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgICAgc2VsZi5wYXJzZVF1ZXJ5UGFyYW1zKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VRdWVyeVBhcmFtcygpIHtcbiAgICBjb25zdCBpc0RldGFpbCA9IHRoaXMucXVlcnlQYXJhbXNbQ29kZXMuSVNfREVUQUlMXTtcbiAgICAvLyBlbnN1cmluZyBpc2RldGFpbCA9IGZhbHNlIHdoZW4gdXNpbmcgZm9ybSBsYXlvdXQgbWFuYWdlclxuICAgIHRoaXMuZm9ybS5pc0RldGFpbEZvcm0gPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyID8gZmFsc2UgOiAoaXNEZXRhaWwgPT09ICd0cnVlJyk7XG4gIH1cblxuICBzdWJzY3JpYmVUb1VybFBhcmFtcygpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgY29uc3QgY2FjaGVEYXRhOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0Rm9ybUNhY2hlRGF0YSh0aGlzLmlkKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChjYWNoZURhdGEpKSB7XG4gICAgICAgIHRoaXMudXJsUGFyYW1zID0gY2FjaGVEYXRhLnBhcmFtcztcbiAgICAgICAgdGhpcy5wYXJzZVVybFBhcmFtcygpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMudXJsUGFyYW1TdWIgPSB0aGlzLmFjdFJvdXRlLnBhcmFtcy5zdWJzY3JpYmUocGFyYW1zID0+IHtcbiAgICAgICAgc2VsZi51cmxQYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIHRoaXMucGFyc2VVcmxQYXJhbXMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VVcmxQYXJhbXMoKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMudXJsUGFyYW1zKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnVybFBhcmFtc1tDb2Rlcy5QQVJFTlRfS0VZU19LRVldKSkge1xuICAgICAgdGhpcy5mb3JtLmZvcm1QYXJlbnRLZXlzVmFsdWVzID0gVXRpbC5kZWNvZGVQYXJlbnRLZXlzKHRoaXMudXJsUGFyYW1zW0NvZGVzLlBBUkVOVF9LRVlTX0tFWV0pO1xuICAgIH1cbiAgICAvLyBUT0RPIE9idGFpbiAnZGF0YXR5cGUnIG9mIGVhY2gga2V5IGNvbnRhaW5lZCBpbnRvIHVybFBhcmFtcyBmb3JcbiAgICAvLyBmb3IgYnVpbGRpbmcgY29ycmVjdGx5IHF1ZXJ5IGZpbHRlciEhISFcbiAgICBpZiAodGhpcy51cmxQYXJhbXMpIHtcbiAgICAgIHRoaXMub25VcmxQYXJhbUNoYW5nZWRTdHJlYW0uZW1pdCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmVUb1VybCgpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgY29uc3QgY2FjaGVEYXRhOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0Rm9ybUNhY2hlRGF0YSh0aGlzLmlkKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChjYWNoZURhdGEpKSB7XG4gICAgICAgIHRoaXMudXJsU2VnbWVudHMgPSBjYWNoZURhdGEudXJsU2VnbWVudHM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy51cmxTdWIgPSB0aGlzLmFjdFJvdXRlLnVybC5zdWJzY3JpYmUodXJsU2VnbWVudHMgPT4ge1xuICAgICAgICBzZWxmLnVybFNlZ21lbnRzID0gdXJsU2VnbWVudHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzdWJzY3JpYmVUb0NhY2hlQ2hhbmdlcyhvbkNhY2hlRW1wdHlTdGF0ZUNoYW5nZXM6IEV2ZW50RW1pdHRlcjxib29sZWFuPikge1xuICAgIHRoaXMuY2FjaGVTdGF0ZVN1YnNjcmlwdGlvbiA9IG9uQ2FjaGVFbXB0eVN0YXRlQ2hhbmdlcy5hc09ic2VydmFibGUoKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMuc2V0TW9kaWZpZWRTdGF0ZSghcmVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEN1cnJlbnRLZXlzVmFsdWVzKCk6IG9iamVjdCB7XG4gICAgbGV0IGZpbHRlciA9IHt9O1xuICAgIGlmICh0aGlzLnVybFBhcmFtcykge1xuICAgICAgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXJGcm9tT2JqZWN0KHRoaXMudXJsUGFyYW1zKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RmlsdGVyRnJvbU9iamVjdChvYmplY3RQYXJhbTogYW55KSB7XG4gICAgY29uc3QgZmlsdGVyID0ge307XG4gICAgaWYgKCFvYmplY3RQYXJhbSB8fCBPYmplY3Qua2V5cyhvYmplY3RQYXJhbSkubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmlsdGVyO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb3JtLmtleXNBcnJheSkge1xuICAgICAgdGhpcy5mb3JtLmtleXNBcnJheS5mb3JFYWNoKChrZXksIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChvYmplY3RQYXJhbVtrZXldKSB7XG4gICAgICAgICAgZmlsdGVyW2tleV0gPSBTUUxUeXBlcy5wYXJzZVVzaW5nU1FMVHlwZShvYmplY3RQYXJhbVtrZXldLCB0aGlzLmZvcm0ua2V5c1NxbFR5cGVzQXJyYXlbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybS5fcEtleXNFcXVpdikuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHVybFZhbCA9IG9iamVjdFBhcmFtW3RoaXMuZm9ybS5fcEtleXNFcXVpdltpdGVtXV07XG4gICAgICBpZiAodXJsVmFsKSB7XG4gICAgICAgIGZpbHRlcltpdGVtXSA9IFNRTFR5cGVzLnBhcnNlVXNpbmdTUUxUeXBlKHVybFZhbCwgdGhpcy5mb3JtLmtleXNTcWxUeXBlc0FycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGdldEZpbHRlckZyb21VcmxQYXJhbXMoKSB7XG4gICAgY29uc3QgZmlsdGVyID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRVcmxQYXJhbXMoKSB8fCB7fSk7XG4gICAgY29uc3QgdXJsUGFyYW1zS2V5cyA9IE9iamVjdC5rZXlzKGZpbHRlciB8fCB7fSk7XG4gICAgaWYgKHVybFBhcmFtc0tleXMubGVuZ3RoID4gMCkge1xuICAgICAgdXJsUGFyYW1zS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IENvZGVzLlBBUkVOVF9LRVlTX0tFWSkge1xuICAgICAgICAgIGRlbGV0ZSBmaWx0ZXJba2V5XTtcbiAgICAgICAgICBPYmplY3QuYXNzaWduKGZpbHRlciwgdGhpcy5mb3JtLmZvcm1QYXJlbnRLZXlzVmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRVcmxTZWdtZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy51cmxTZWdtZW50cztcbiAgfVxuXG4gIGdldFF1ZXJ5UGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5UGFyYW1zO1xuICB9XG5cbiAgc2V0VXJsUGFyYW1zKHZhbDogb2JqZWN0KSB7XG4gICAgdGhpcy51cmxQYXJhbXMgPSB2YWw7XG4gIH1cblxuICBnZXRVcmxQYXJhbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsUGFyYW1zO1xuICB9XG5cbiAgc2V0TW9kaWZpZWRTdGF0ZShtb2RpZmllZDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLnNldE1vZGlmaWVkU3RhdGUobW9kaWZpZWQsIHRoaXMuaWQpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU5hdmlnYXRpb24oKSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIGNvbnN0IGlzSW5JbnNlcnRNb2RlID0gdGhpcy5mb3JtLmlzSW5JbnNlcnRNb2RlKCk7XG4gICAgICBsZXQgZm9ybURhdGE7XG4gICAgICBpZiAoaXNJbkluc2VydE1vZGUpIHtcbiAgICAgICAgZm9ybURhdGEgPSB7fTtcbiAgICAgICAgZm9ybURhdGEubmV3X3RhYl90aXRsZSA9ICdMQVlPVVRfTUFOQU5HRVIuSU5TRVJUSU9OX01PREVfVElUTEUnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmFsbG93VG9VcGRhdGVOYXZpZ2F0aW9uKHRoaXMuZm9ybS5vYXR0cikpIHtcbiAgICAgICAgZm9ybURhdGEgPSB7fTtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuZm9ybS5mb3JtRGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGZvcm1EYXRhW2tleV0gPSBzZWxmLmZvcm0uZm9ybURhdGFba2V5XS52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoZm9ybURhdGEpIHtcbiAgICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci51cGRhdGVOYXZpZ2F0aW9uKGZvcm1EYXRhLCB0aGlzLmlkLCBpc0luSW5zZXJ0TW9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmF2aWdhdGVCYWNrKCkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmNsb3NlRGV0YWlsKHRoaXMuaWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZSkge1xuICAgICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5yZW1vdmVMYXN0SXRlbSgpO1xuICAgICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0SXRlbSgpO1xuICAgICAgaWYgKG5hdkRhdGEpIHtcbiAgICAgICAgY29uc3QgZXh0cmFzID0ge307XG4gICAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gbmF2RGF0YS5xdWVyeVBhcmFtcztcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW25hdkRhdGEudXJsXSwgZXh0cmFzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbG9zZURldGFpbEFjdGlvbihvcHRpb25zPzogYW55KSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuY2xvc2VEZXRhaWwodGhpcy5pZCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICB0aGlzLmZvcm0uYmVmb3JlQ2xvc2VEZXRhaWwuZW1pdCgpO1xuICAgICAgLy8gYHJlbW92ZUxhc3RJdGVtc1VudGlsTWFpbmAgbWF5IG5vdCByZW1vdmUgYWxsIG5lY2Vzc2FyeSBpdGVtcyBzbyBjdXJyZW50IHJvdXRlIHdpbGwgYmUgY2hlY2tlZCBiZWxvd1xuICAgICAgaWYgKCF0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLnJlbW92ZUxhc3RJdGVtc1VudGlsTWFpbigpKSB7XG4gICAgICAgIC8vIGByZW1vdmVMYXN0SXRlbXNVbnRpbE1haW5gIGRpZG4ndCBmaW5kIHRoZSBtYWluIG5hdmlnYXRpb24gaXRlbVxuICAgICAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLnJlbW92ZUxhc3RJdGVtKCk7XG4gICAgICB9XG4gICAgICBsZXQgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0SXRlbSgpO1xuICAgICAgaWYgKG5hdkRhdGEpIHtcbiAgICAgICAgLy8gaWYgbmF2RGF0YSByb3V0ZSBpcyB0aGUgc2FtZSBhcyB0aGUgY3VycmVudCByb3V0ZSwgcmVtb3ZlIGxhc3QgaXRlbVxuICAgICAgICBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZS5pc0N1cnJlbnRSb3V0ZShuYXZEYXRhLnVybCkpIHtcbiAgICAgICAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLnJlbW92ZUxhc3RJdGVtKCk7XG4gICAgICAgICAgbmF2RGF0YSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdEl0ZW0oKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBleHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7fTtcbiAgICAgICAgZXh0cmFzW0NvZGVzLlFVRVJZX1BBUkFNU10gPSBuYXZEYXRhLnF1ZXJ5UGFyYW1zO1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbbmF2RGF0YS51cmxdLCBleHRyYXMpLnRoZW4odmFsID0+IHtcbiAgICAgICAgICBpZiAodmFsICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5jaGFuZ2VUb29sYmFyTW9kZSkge1xuICAgICAgICAgICAgdGhpcy5mb3JtLmdldEZvcm1Ub29sYmFyKCkuc2V0SW5pdGlhbE1vZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXlJblJlY29yZEFmdGVySW5zZXJ0KGluc2VydGVkS2V5czogb2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIHRoaXMuZm9ybS5zZXRJbml0aWFsTW9kZSgpO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSB0aGlzLmZvcm0ub25EYXRhTG9hZGVkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBzZWxmLmZvcm0uZ2V0S2V5c1ZhbHVlcygpO1xuICAgICAgICBzZWxmLmZvcm1MYXlvdXRNYW5hZ2VyLnVwZGF0ZUFjdGl2ZURhdGEoeyBwYXJhbXM6IGtleXMgfSk7XG4gICAgICAgIGNvbnN0IGNhY2hlRGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgPSBzZWxmLmZvcm1MYXlvdXRNYW5hZ2VyLmdldEZvcm1DYWNoZURhdGEoc2VsZi5pZCk7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChjYWNoZURhdGEpKSB7XG4gICAgICAgICAgc2VsZi51cmxQYXJhbXMgPSBjYWNoZURhdGEucGFyYW1zO1xuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmZvcm0ucXVlcnlEYXRhKGluc2VydGVkS2V5cyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5hdmlnYXRpb25TZXJ2aWNlICYmIHRoaXMuZm9ybS5rZXlzQXJyYXkgJiYgaW5zZXJ0ZWRLZXlzKSB7XG4gICAgICAvLyBSZW1vdmUgJ25ldycgbmF2aWdhdGlvbiBpdGVtIGZyb20gaGlzdG9yeVxuICAgICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5yZW1vdmVMYXN0SXRlbSgpO1xuXG4gICAgICBsZXQgcGFyYW1zOiBhbnlbXSA9IFtdO1xuICAgICAgdGhpcy5mb3JtLmtleXNBcnJheS5mb3JFYWNoKChjdXJyZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5zZXJ0ZWRLZXlzW2N1cnJlbnRdKSB7XG4gICAgICAgICAgcGFyYW1zLnB1c2goaW5zZXJ0ZWRLZXlzW2N1cnJlbnRdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsZXQgZXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge307XG4gICAgICBsZXQgcVBhcmFtczogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRRdWVyeVBhcmFtcygpLCBDb2Rlcy5nZXRJc0RldGFpbE9iamVjdCgpKTtcbiAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gcVBhcmFtcztcbiAgICAgIGxldCByb3V0ZSA9IFtdO1xuICAgICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0TWFpbk5hdmlnYXRpb25Sb3V0ZURhdGEoKTtcbiAgICAgIGlmIChuYXZEYXRhKSB7XG4gICAgICAgIGxldCB1cmwgPSBuYXZEYXRhLnVybDtcbiAgICAgICAgY29uc3QgZGV0YWlsUm91dGUgPSBuYXZEYXRhLmdldERldGFpbEZvcm1Sb3V0ZSgpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoZGV0YWlsUm91dGUpKSB7XG4gICAgICAgICAgcm91dGUucHVzaChkZXRhaWxSb3V0ZSk7XG4gICAgICAgICAgY29uc3QgZGV0YWlsSW5kZXggPSB1cmwubGFzdEluZGV4T2YoJy8nICsgZGV0YWlsUm91dGUpO1xuICAgICAgICAgIGlmIChkZXRhaWxJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgZGV0YWlsSW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByb3V0ZS51bnNoaWZ0KHVybCk7XG4gICAgICAgIHJvdXRlLnB1c2goLi4ucGFyYW1zKTtcbiAgICAgICAgLy8gZGVsZXRpbmcgaW5zZXJ0Rm9ybVJvdXRlIGFzIGFjdGl2ZSBtb2RlIChiZWNhdXNlIHN0YXlJblJlY29yZEFmdGVySW5zZXJ0IGNoYW5nZXMgaXQpXG4gICAgICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZGVsZXRlQWN0aXZlRm9ybU1vZGUobmF2RGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHRyYXMucmVsYXRpdmVUbyA9IHRoaXMuYWN0Um91dGU7XG4gICAgICAgIHJvdXRlID0gWycuLi8nLCAuLi5wYXJhbXNdO1xuICAgICAgfVxuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUocm91dGUsIGV4dHJhcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byAnaW5zZXJ0JyBtb2RlXG4gICAqL1xuICBnb0luc2VydE1vZGUob3B0aW9ucz86IGFueSkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyICYmIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuaXNEaWFsb2dNb2RlKCkpIHtcbiAgICAgIHRoaXMuZm9ybS5zZXRJbnNlcnRNb2RlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzVGFiTW9kZSgpKSB7XG4gICAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuc2V0QXNBY3RpdmVGb3JtTGF5b3V0TWFuYWdlcigpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcm91dGUgPSBbXTtcbiAgICAgIGNvbnN0IGV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHt9O1xuICAgICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0TWFpbk5hdmlnYXRpb25Sb3V0ZURhdGEoKTtcbiAgICAgIGlmICghdGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiBuYXZEYXRhKSB7XG4gICAgICAgIHJvdXRlLnB1c2gobmF2RGF0YS51cmwpO1xuICAgICAgICBjb25zdCBkZXRhaWxSb3V0ZSA9IG5hdkRhdGEuZ2V0RGV0YWlsRm9ybVJvdXRlKCk7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChkZXRhaWxSb3V0ZSkpIHtcbiAgICAgICAgICByb3V0ZS5wdXNoKGRldGFpbFJvdXRlKTtcbiAgICAgICAgfVxuICAgICAgICByb3V0ZS5wdXNoKG5hdkRhdGEuZ2V0SW5zZXJ0Rm9ybVJvdXRlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXh0cmFzLnJlbGF0aXZlVG8gPSB0aGlzLmFjdFJvdXRlO1xuICAgICAgICByb3V0ZSA9IFsnLi4vJyArIENvZGVzLkRFRkFVTFRfSU5TRVJUX1JPVVRFXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uRm9ybVJvdXRlcygnaW5zZXJ0Rm9ybVJvdXRlJyk7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSwgZXh0cmFzKS50aGVuKCh2YWwpID0+IHtcbiAgICAgICAgaWYgKHZhbCAmJiBvcHRpb25zICYmIG9wdGlvbnMuY2hhbmdlVG9vbGJhck1vZGUpIHtcbiAgICAgICAgICB0aGlzLmZvcm0uZ2V0Rm9ybVRvb2xiYXIoKS5zZXRJbnNlcnRNb2RlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gJ2VkaXQnIG1vZGVcbiAgICovXG4gIGdvRWRpdE1vZGUob3B0aW9ucz86IGFueSkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyICYmIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuaXNEaWFsb2dNb2RlKCkpIHtcbiAgICAgIHRoaXMuZm9ybS5zZXRVcGRhdGVNb2RlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm5hdmlnYXRpb25TZXJ2aWNlKSB7XG4gICAgICBsZXQgcm91dGUgPSBbXTtcbiAgICAgIGNvbnN0IGV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHt9O1xuICAgICAgaWYgKHRoaXMuZm9ybS5pc0RldGFpbEZvcm0pIHtcbiAgICAgICAgZXh0cmFzW0NvZGVzLlFVRVJZX1BBUkFNU10gPSBDb2Rlcy5nZXRJc0RldGFpbE9iamVjdCgpO1xuICAgICAgfVxuICAgICAgZXh0cmFzW0NvZGVzLlFVRVJZX1BBUkFNU10gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldFF1ZXJ5UGFyYW1zKCksIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdIHx8IHt9KTtcblxuICAgICAgY29uc3QgcGFyYW1zOiBhbnlbXSA9IFtdO1xuICAgICAgY29uc3QgdXJsUGFyYW1zID0gdGhpcy5nZXRVcmxQYXJhbXMoKTtcbiAgICAgIHRoaXMuZm9ybS5rZXlzQXJyYXkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAodXJsUGFyYW1zW2tleV0pIHtcbiAgICAgICAgICBwYXJhbXMucHVzaCh1cmxQYXJhbXNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRQcmV2aW91c1JvdXRlRGF0YSgpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG5hdkRhdGEpKSB7XG4gICAgICAgIHJvdXRlLnB1c2gobmF2RGF0YS51cmwpO1xuICAgICAgICBjb25zdCBkZXRhaWxSb3V0ZSA9IG5hdkRhdGEuZ2V0RGV0YWlsRm9ybVJvdXRlKCk7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChkZXRhaWxSb3V0ZSkpIHtcbiAgICAgICAgICByb3V0ZS5wdXNoKGRldGFpbFJvdXRlKTtcbiAgICAgICAgfVxuICAgICAgICByb3V0ZS5wdXNoKC4uLnBhcmFtcyk7XG4gICAgICAgIHJvdXRlLnB1c2gobmF2RGF0YS5nZXRFZGl0Rm9ybVJvdXRlKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXh0cmFzLnJlbGF0aXZlVG8gPSB0aGlzLmFjdFJvdXRlO1xuICAgICAgICByb3V0ZSA9IFsnLi4vJywgLi4ucGFyYW1zLCBDb2Rlcy5ERUZBVUxUX0VESVRfUk9VVEVdO1xuICAgICAgfVxuICAgICAgdGhpcy5zdG9yZU5hdmlnYXRpb25Gb3JtUm91dGVzKCdlZGl0Rm9ybVJvdXRlJyk7XG4gICAgICB0aGlzLmZvcm0uYmVmb3JlVXBkYXRlTW9kZS5lbWl0KCk7XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSwgZXh0cmFzKS50aGVuKCh2YWwpID0+IHtcbiAgICAgICAgaWYgKHZhbCAmJiBvcHRpb25zICYmIG9wdGlvbnMuY2hhbmdlVG9vbGJhck1vZGUpIHtcbiAgICAgICAgICB0aGlzLmZvcm0uZ2V0Rm9ybVRvb2xiYXIoKS5zZXRFZGl0TW9kZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIGdldE5lc3RlZExldmVsc051bWJlcigpIHtcbiAgICBsZXQgYWN0Um91dGUgPSB0aGlzLmFjdFJvdXRlO1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoYWN0Um91dGUucGFyZW50KSB7XG4gICAgICBhY3RSb3V0ZSA9IGFjdFJvdXRlLnBhcmVudDtcbiAgICAgIGFjdFJvdXRlLnVybC5zdWJzY3JpYmUoKHgpID0+IHtcbiAgICAgICAgaWYgKHggJiYgeC5sZW5ndGgpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZFxuICAgKi9cbiAgZ2V0RnVsbFVybFNlZ21lbnRzKCkge1xuICAgIGxldCBmdWxsVXJsU2VnbWVudHMgPSBbXTtcbiAgICBjb25zdCByb3V0ZXIgPSB0aGlzLnJvdXRlcjtcbiAgICBpZiAocm91dGVyICYmIHJvdXRlci51cmwgJiYgcm91dGVyLnVybC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHJvb3Q6IFVybFNlZ21lbnRHcm91cCA9IHJvdXRlci5wYXJzZVVybChyb3V0ZXIudXJsKS5yb290O1xuICAgICAgaWYgKHJvb3QgJiYgcm9vdC5oYXNDaGlsZHJlbigpICYmIHJvb3QuY2hpbGRyZW4ucHJpbWFyeSkge1xuICAgICAgICBmdWxsVXJsU2VnbWVudHMgPSByb290LmNoaWxkcmVuLnByaW1hcnkuc2VnbWVudHM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmdWxsVXJsU2VnbWVudHM7XG4gIH1cblxuICBzaG93Q29uZmlybURpc2NhcmRDaGFuZ2VzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGxldCBzdWJzY3JpcHRpb246IFByb21pc2U8Ym9vbGVhbj47XG4gICAgaWYgKHRoaXMuZm9ybS5pc0luaXRpYWxTdGF0ZUNoYW5nZWQoKSAmJiAhdGhpcy5mb3JtLmlzSW5JbnNlcnRNb2RlKCkpIHtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ01FU1NBR0VTLkZPUk1fQ0hBTkdFU19XSUxMX0JFX0xPU1QnKTtcbiAgICB9XG4gICAgaWYgKHN1YnNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8Ym9vbGVhbj4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgICBvYnNlcnZlci5uZXh0KHRydWUpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gICAgICBzdWJzY3JpcHRpb24gPSBvYnNlcnZhYmxlLnRvUHJvbWlzZSgpO1xuICAgIH1cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0b3JlTmF2aWdhdGlvbkZvcm1Sb3V0ZXMoYWN0aXZlTW9kZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZm9ybVJvdXRlcyA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0UHJldmlvdXNSb3V0ZURhdGEoKS5mb3JtUm91dGVzO1xuICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2Uuc3RvcmVGb3JtUm91dGVzKHtcbiAgICAgIGRldGFpbEZvcm1Sb3V0ZTogZm9ybVJvdXRlcyA/IGZvcm1Sb3V0ZXMuZGV0YWlsRm9ybVJvdXRlIDogQ29kZXMuREVGQVVMVF9ERVRBSUxfUk9VVEUsXG4gICAgICBlZGl0Rm9ybVJvdXRlOiBmb3JtUm91dGVzID8gZm9ybVJvdXRlcy5lZGl0Rm9ybVJvdXRlIDogQ29kZXMuREVGQVVMVF9FRElUX1JPVVRFLFxuICAgICAgaW5zZXJ0Rm9ybVJvdXRlOiBmb3JtUm91dGVzID8gZm9ybVJvdXRlcy5pbnNlcnRGb3JtUm91dGUgOiBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURVxuICAgIH0sIGFjdGl2ZU1vZGUpO1xuICB9XG5cbn1cbiJdfQ==