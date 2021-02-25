import * as tslib_1 from "tslib";
import { EventEmitter } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { OFormLayoutDialogComponent } from '../../../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { DialogService } from '../../../services/dialog.service';
import { NavigationService } from '../../../services/navigation.service';
import { Codes } from '../../../util/codes';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
var OFormNavigationClass = (function () {
    function OFormNavigationClass(injector, form, router, actRoute) {
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
        var self = this;
        this.combinedNavigationStream = combineLatest([self.onUrlParamChangedStream.asObservable()]);
        this.combinedNavigationStream.subscribe(function (valArr) {
            if (Util.isArray(valArr) && valArr.length === 1 && valArr[0]) {
                self.navigationStream.emit(true);
            }
        });
    }
    OFormNavigationClass.prototype.initialize = function () {
        if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
            this.id = this.formLayoutManager.getLastTabId();
        }
    };
    OFormNavigationClass.prototype.destroy = function () {
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
    };
    OFormNavigationClass.prototype.subscribeToQueryParams = function () {
        if (this.formLayoutManager) {
            var cacheData = this.formLayoutManager.getFormCacheData(this.id);
            if (Util.isDefined(cacheData)) {
                this.queryParams = cacheData.queryParams || {};
                this.parseQueryParams();
            }
        }
        else {
            var self_1 = this;
            this.qParamSub = this.actRoute.queryParams.subscribe(function (params) {
                if (params) {
                    self_1.queryParams = params;
                    self_1.parseQueryParams();
                }
            });
        }
    };
    OFormNavigationClass.prototype.parseQueryParams = function () {
        var isDetail = this.queryParams[Codes.IS_DETAIL];
        this.form.isDetailForm = this.formLayoutManager ? false : (isDetail === 'true');
    };
    OFormNavigationClass.prototype.subscribeToUrlParams = function () {
        var _this = this;
        if (this.formLayoutManager) {
            var cacheData = this.formLayoutManager.getFormCacheData(this.id);
            if (Util.isDefined(cacheData)) {
                this.urlParams = cacheData.params;
                this.parseUrlParams();
            }
        }
        else {
            var self_2 = this;
            this.urlParamSub = this.actRoute.params.subscribe(function (params) {
                self_2.urlParams = params;
                _this.parseUrlParams();
            });
        }
    };
    OFormNavigationClass.prototype.parseUrlParams = function () {
        if (Util.isDefined(this.urlParams) && Util.isDefined(this.urlParams[Codes.PARENT_KEYS_KEY])) {
            this.form.formParentKeysValues = Util.decodeParentKeys(this.urlParams[Codes.PARENT_KEYS_KEY]);
        }
        if (this.urlParams) {
            this.onUrlParamChangedStream.emit(true);
        }
    };
    OFormNavigationClass.prototype.subscribeToUrl = function () {
        if (this.formLayoutManager) {
            var cacheData = this.formLayoutManager.getFormCacheData(this.id);
            if (Util.isDefined(cacheData)) {
                this.urlSegments = cacheData.urlSegments;
            }
        }
        else {
            var self_3 = this;
            this.urlSub = this.actRoute.url.subscribe(function (urlSegments) {
                self_3.urlSegments = urlSegments;
            });
        }
    };
    OFormNavigationClass.prototype.subscribeToCacheChanges = function (onCacheEmptyStateChanges) {
        var _this = this;
        this.cacheStateSubscription = onCacheEmptyStateChanges.asObservable().subscribe(function (res) {
            _this.setModifiedState(!res);
        });
    };
    OFormNavigationClass.prototype.getCurrentKeysValues = function () {
        var filter = {};
        if (this.urlParams) {
            filter = this.getFilterFromObject(this.urlParams);
        }
        return filter;
    };
    OFormNavigationClass.prototype.getFilterFromObject = function (objectParam) {
        var _this = this;
        var filter = {};
        if (!objectParam || Object.keys(objectParam).length === 0) {
            return filter;
        }
        if (this.form.keysArray) {
            this.form.keysArray.forEach(function (key, index) {
                if (objectParam[key]) {
                    filter[key] = SQLTypes.parseUsingSQLType(objectParam[key], _this.form.keysSqlTypesArray[index]);
                }
            });
        }
        Object.keys(this.form._pKeysEquiv).forEach(function (item, index) {
            var urlVal = objectParam[_this.form._pKeysEquiv[item]];
            if (urlVal) {
                filter[item] = SQLTypes.parseUsingSQLType(urlVal, _this.form.keysSqlTypesArray[index]);
            }
        });
        return filter;
    };
    OFormNavigationClass.prototype.getFilterFromUrlParams = function () {
        var _this = this;
        var filter = Object.assign({}, this.getUrlParams() || {});
        var urlParamsKeys = Object.keys(filter || {});
        if (urlParamsKeys.length > 0) {
            urlParamsKeys.forEach(function (key) {
                if (key === Codes.PARENT_KEYS_KEY) {
                    delete filter[key];
                    Object.assign(filter, _this.form.formParentKeysValues);
                }
            });
        }
        return filter;
    };
    OFormNavigationClass.prototype.getUrlSegments = function () {
        return this.urlSegments;
    };
    OFormNavigationClass.prototype.getQueryParams = function () {
        return this.queryParams;
    };
    OFormNavigationClass.prototype.setUrlParams = function (val) {
        this.urlParams = val;
    };
    OFormNavigationClass.prototype.getUrlParams = function () {
        return this.urlParams;
    };
    OFormNavigationClass.prototype.setModifiedState = function (modified) {
        if (this.formLayoutManager) {
            this.formLayoutManager.setModifiedState(modified, this.id);
        }
    };
    OFormNavigationClass.prototype.updateNavigation = function () {
        if (this.formLayoutManager) {
            var isInInsertMode = this.form.isInInsertMode();
            var formData_1;
            if (isInInsertMode) {
                formData_1 = {};
                formData_1.new_tab_title = 'LAYOUT_MANANGER.INSERTION_MODE_TITLE';
            }
            else if (this.formLayoutManager.allowToUpdateNavigation(this.form.oattr)) {
                formData_1 = {};
                var self_4 = this;
                Object.keys(this.form.formData).forEach(function (key) {
                    formData_1[key] = self_4.form.formData[key].value;
                });
            }
            if (formData_1) {
                this.formLayoutManager.updateNavigation(formData_1, this.id, isInInsertMode);
            }
        }
    };
    OFormNavigationClass.prototype.navigateBack = function () {
        if (this.formLayoutManager) {
            this.formLayoutManager.closeDetail(this.id);
        }
        else if (this.navigationService) {
            this.navigationService.removeLastItem();
            var navData = this.navigationService.getLastItem();
            if (navData) {
                var extras = {};
                extras[Codes.QUERY_PARAMS] = navData.queryParams;
                this.router.navigate([navData.url], extras);
            }
        }
    };
    OFormNavigationClass.prototype.closeDetailAction = function (options) {
        var _this = this;
        if (this.formLayoutManager) {
            this.formLayoutManager.closeDetail(this.id);
        }
        else if (this.navigationService) {
            this.form.beforeCloseDetail.emit();
            if (!this.navigationService.removeLastItemsUntilMain()) {
                this.navigationService.removeLastItem();
            }
            var navData = this.navigationService.getLastItem();
            if (navData) {
                if (this.navigationService.isCurrentRoute(navData.url)) {
                    this.navigationService.removeLastItem();
                    navData = this.navigationService.getLastItem();
                }
                var extras = {};
                extras[Codes.QUERY_PARAMS] = navData.queryParams;
                this.router.navigate([navData.url], extras).then(function (val) {
                    if (val && options && options.changeToolbarMode) {
                        _this.form.getFormToolbar().setInitialMode();
                    }
                });
            }
        }
    };
    OFormNavigationClass.prototype.stayInRecordAfterInsert = function (insertedKeys) {
        if (this.formLayoutManager) {
            this.form.setInitialMode();
            var self_5 = this;
            var subscription_1 = this.form.onDataLoaded.subscribe(function () {
                var keys = self_5.form.getKeysValues();
                self_5.formLayoutManager.updateActiveData({ params: keys });
                var cacheData = self_5.formLayoutManager.getFormCacheData(self_5.id);
                if (Util.isDefined(cacheData)) {
                    self_5.urlParams = cacheData.params;
                }
                subscription_1.unsubscribe();
            });
            this.form.queryData(insertedKeys);
        }
        else if (this.navigationService && this.form.keysArray && insertedKeys) {
            this.navigationService.removeLastItem();
            var params_1 = [];
            this.form.keysArray.forEach(function (current, index) {
                if (insertedKeys[current]) {
                    params_1.push(insertedKeys[current]);
                }
            });
            var extras = {};
            var qParams = Object.assign({}, this.getQueryParams(), Codes.getIsDetailObject());
            extras[Codes.QUERY_PARAMS] = qParams;
            var route = [];
            var navData = this.navigationService.getLastMainNavigationRouteData();
            if (navData) {
                var url = navData.url;
                var detailRoute = navData.getDetailFormRoute();
                if (Util.isDefined(detailRoute)) {
                    route.push(detailRoute);
                    var detailIndex = url.lastIndexOf('/' + detailRoute);
                    if (detailIndex !== -1) {
                        url = url.substring(0, detailIndex);
                    }
                }
                route.unshift(url);
                route.push.apply(route, tslib_1.__spread(params_1));
                this.navigationService.deleteActiveFormMode(navData);
            }
            else {
                extras.relativeTo = this.actRoute;
                route = tslib_1.__spread(['../'], params_1);
            }
            this.router.navigate(route, extras);
        }
    };
    OFormNavigationClass.prototype.goInsertMode = function (options) {
        var _this = this;
        if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
            this.form.setInsertMode();
        }
        else if (this.navigationService) {
            if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
                this.formLayoutManager.setAsActiveFormLayoutManager();
            }
            var route = [];
            var extras = {};
            var navData = this.navigationService.getLastMainNavigationRouteData();
            if (!this.formLayoutManager && navData) {
                route.push(navData.url);
                var detailRoute = navData.getDetailFormRoute();
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
            this.router.navigate(route, extras).then(function (val) {
                if (val && options && options.changeToolbarMode) {
                    _this.form.getFormToolbar().setInsertMode();
                }
            });
        }
    };
    OFormNavigationClass.prototype.goEditMode = function (options) {
        var _this = this;
        if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
            this.form.setUpdateMode();
        }
        else if (this.navigationService) {
            var route = [];
            var extras = {};
            if (this.form.isDetailForm) {
                extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
            }
            extras[Codes.QUERY_PARAMS] = Object.assign({}, this.getQueryParams(), extras[Codes.QUERY_PARAMS] || {});
            var params_2 = [];
            var urlParams_1 = this.getUrlParams();
            this.form.keysArray.forEach(function (key) {
                if (urlParams_1[key]) {
                    params_2.push(urlParams_1[key]);
                }
            });
            var navData = this.navigationService.getPreviousRouteData();
            if (Util.isDefined(navData)) {
                route.push(navData.url);
                var detailRoute = navData.getDetailFormRoute();
                if (Util.isDefined(detailRoute)) {
                    route.push(detailRoute);
                }
                route.push.apply(route, tslib_1.__spread(params_2));
                route.push(navData.getEditFormRoute());
            }
            else {
                extras.relativeTo = this.actRoute;
                route = tslib_1.__spread(['../'], params_2, [Codes.DEFAULT_EDIT_ROUTE]);
            }
            this.storeNavigationFormRoutes('editFormRoute');
            this.form.beforeGoEditMode.emit();
            this.router.navigate(route, extras).then(function (val) {
                if (val && options && options.changeToolbarMode) {
                    _this.form.getFormToolbar().setEditMode();
                }
            });
        }
    };
    OFormNavigationClass.prototype.getNestedLevelsNumber = function () {
        var actRoute = this.actRoute;
        var i = 0;
        while (actRoute.parent) {
            actRoute = actRoute.parent;
            actRoute.url.subscribe(function (x) {
                if (x && x.length) {
                    i++;
                }
            });
        }
        return i;
    };
    OFormNavigationClass.prototype.getFullUrlSegments = function () {
        var fullUrlSegments = [];
        var router = this.router;
        if (router && router.url && router.url.length) {
            var root = router.parseUrl(router.url).root;
            if (root && root.hasChildren() && root.children.primary) {
                fullUrlSegments = root.children.primary.segments;
            }
        }
        return fullUrlSegments;
    };
    OFormNavigationClass.prototype.showConfirmDiscardChanges = function () {
        var subscription;
        if (this.form.isInitialStateChanged() && !this.form.isInInsertMode()) {
            subscription = this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST');
        }
        if (subscription === undefined) {
            var observable = new Observable(function (observer) {
                observer.next(true);
                observer.complete();
            });
            subscription = observable.toPromise();
        }
        return subscription;
    };
    OFormNavigationClass.prototype.storeNavigationFormRoutes = function (activeMode) {
        var formRoutes = this.navigationService.getPreviousRouteData().formRoutes;
        this.navigationService.storeFormRoutes({
            detailFormRoute: formRoutes ? formRoutes.detailFormRoute : Codes.DEFAULT_DETAIL_ROUTE,
            editFormRoute: formRoutes ? formRoutes.editFormRoute : Codes.DEFAULT_EDIT_ROUTE,
            insertFormRoute: formRoutes ? formRoutes.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE
        }, activeMode);
    };
    return OFormNavigationClass;
}());
export { OFormNavigationClass };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLm5hdmlnYXRpb24uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZm9ybS9uYXZpZ2F0aW9uL28tZm9ybS5uYXZpZ2F0aW9uLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBRXZELE9BQU8sRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUUvRCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxvRUFBb0UsQ0FBQztBQUNoSCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUMzRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDakUsT0FBTyxFQUFFLGlCQUFpQixFQUFtQixNQUFNLHNDQUFzQyxDQUFDO0FBRTFGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDbEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRzFDO0lBMkJFLDhCQUNZLFFBQWtCLEVBQ2xCLElBQW9CLEVBQ3BCLE1BQWMsRUFDZCxRQUF3QjtRQUh4QixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBQ3BCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFnQjtRQWYxQixnQkFBVyxHQUFRLEVBQUUsQ0FBQztRQUl0Qiw0QkFBdUIsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUVoRixxQkFBZ0IsR0FBMEIsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQVczRSxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUV6RCxJQUFJO1lBQ0YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7U0FDekU7UUFBQyxPQUFPLENBQUMsRUFBRTtTQUVYO1FBRUQsSUFBSTtZQUNGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQ3ZFO1FBQUMsT0FBTyxDQUFDLEVBQUU7U0FFWDtRQUVELElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3BELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUM7U0FDbEU7UUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFN0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxVQUFBLE1BQU07WUFDNUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDNUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlDQUFVLEdBQVY7UUFDRSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDaEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRUQsc0NBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEM7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxJQUFJLENBQUMsb0NBQW9DLEVBQUU7WUFDN0MsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3pEO0lBQ0gsQ0FBQztJQUVELHFEQUFzQixHQUF0QjtRQUNFLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQU0sU0FBUyxHQUFrQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7YUFDekI7U0FDRjthQUFNO1lBQ0wsSUFBTSxNQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtnQkFDekQsSUFBSSxNQUFNLEVBQUU7b0JBQ1YsTUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7b0JBQzFCLE1BQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2lCQUN6QjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRU8sK0NBQWdCLEdBQXhCO1FBQ0UsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRCxtREFBb0IsR0FBcEI7UUFBQSxpQkFjQztRQWJDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQU0sU0FBUyxHQUFrQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2xHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDdkI7U0FDRjthQUFNO1lBQ0wsSUFBTSxNQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTTtnQkFDdEQsTUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVPLDZDQUFjLEdBQXRCO1FBQ0UsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUU7WUFDM0YsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUMvRjtRQUdELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pDO0lBQ0gsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDRSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFNLFNBQVMsR0FBa0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQzthQUMxQztTQUNGO2FBQU07WUFDTCxJQUFNLE1BQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsVUFBQSxXQUFXO2dCQUNuRCxNQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELHNEQUF1QixHQUF2QixVQUF3Qix3QkFBK0M7UUFBdkUsaUJBSUM7UUFIQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsd0JBQXdCLENBQUMsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztZQUNqRixLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxtREFBb0IsR0FBcEI7UUFDRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLGtEQUFtQixHQUEzQixVQUE0QixXQUFnQjtRQUE1QyxpQkFtQkM7UUFsQkMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pELE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxLQUFLO2dCQUNyQyxJQUFJLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNoRztZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFFLEtBQUs7WUFDckQsSUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEQsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3ZGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQscURBQXNCLEdBQXRCO1FBQUEsaUJBWUM7UUFYQyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDNUQsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7UUFDaEQsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixhQUFhLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztnQkFDdkIsSUFBSSxHQUFHLEtBQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtvQkFDakMsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztpQkFDdkQ7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELDJDQUFZLEdBQVosVUFBYSxHQUFXO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCwyQ0FBWSxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCwrQ0FBZ0IsR0FBaEIsVUFBaUIsUUFBaUI7UUFDaEMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0lBRUQsK0NBQWdCLEdBQWhCO1FBQ0UsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNsRCxJQUFJLFVBQVEsQ0FBQztZQUNiLElBQUksY0FBYyxFQUFFO2dCQUNsQixVQUFRLEdBQUcsRUFBRSxDQUFDO2dCQUNkLFVBQVEsQ0FBQyxhQUFhLEdBQUcsc0NBQXNDLENBQUM7YUFDakU7aUJBQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDMUUsVUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFNLE1BQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO29CQUN6QyxVQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNoRCxDQUFDLENBQUMsQ0FBQzthQUNKO1lBQ0QsSUFBSSxVQUFRLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLFVBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQzVFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsMkNBQVksR0FBWjtRQUNFLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO2FBQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hDLElBQU0sT0FBTyxHQUFvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEUsSUFBSSxPQUFPLEVBQUU7Z0JBQ1gsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQzdDO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsZ0RBQWlCLEdBQWpCLFVBQWtCLE9BQWE7UUFBL0IsaUJBMEJDO1FBekJDLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO2FBQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVuQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHdCQUF3QixFQUFFLEVBQUU7Z0JBRXRELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN6QztZQUNELElBQUksT0FBTyxHQUFvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEUsSUFBSSxPQUFPLEVBQUU7Z0JBRVgsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN4QyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUNoRDtnQkFDRCxJQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7b0JBQ2xELElBQUksR0FBRyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7d0JBQy9DLEtBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7cUJBQzdDO2dCQUNILENBQUMsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtJQUNILENBQUM7SUFFRCxzREFBdUIsR0FBdkIsVUFBd0IsWUFBb0I7UUFDMUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUMzQixJQUFNLE1BQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBTSxjQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO2dCQUNwRCxJQUFNLElBQUksR0FBRyxNQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUN2QyxNQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDMUQsSUFBTSxTQUFTLEdBQWtDLE1BQUksQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtvQkFDN0IsTUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO2lCQUNuQztnQkFDRCxjQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0IsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNuQzthQUFNLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLFlBQVksRUFBRTtZQUV4RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFeEMsSUFBSSxRQUFNLEdBQVUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLO2dCQUN6QyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDekIsUUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDcEM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksTUFBTSxHQUFxQixFQUFFLENBQUM7WUFDbEMsSUFBSSxPQUFPLEdBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7WUFDdkYsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDckMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBTSxPQUFPLEdBQW9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO1lBQ3pGLElBQUksT0FBTyxFQUFFO2dCQUNYLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7Z0JBQ3RCLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2dCQUNqRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ3hCLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLFdBQVcsQ0FBQyxDQUFDO29CQUN2RCxJQUFJLFdBQVcsS0FBSyxDQUFDLENBQUMsRUFBRTt3QkFDdEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO3FCQUNyQztpQkFDRjtnQkFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQixLQUFLLENBQUMsSUFBSSxPQUFWLEtBQUssbUJBQVMsUUFBTSxHQUFFO2dCQUV0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDdEQ7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNsQyxLQUFLLHFCQUFJLEtBQUssR0FBSyxRQUFNLENBQUMsQ0FBQzthQUM1QjtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFLRCwyQ0FBWSxHQUFaLFVBQWEsT0FBYTtRQUExQixpQkE2QkM7UUE1QkMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ25FLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDM0I7YUFBTSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUNqQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFLEVBQUU7Z0JBQ2hFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO2FBQ3ZEO1lBRUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztZQUNwQyxJQUFNLE9BQU8sR0FBb0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDhCQUE4QixFQUFFLENBQUM7WUFDekYsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxPQUFPLEVBQUU7Z0JBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN6QjtnQkFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7YUFDMUM7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNsQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7YUFDOUM7WUFDRCxJQUFJLENBQUMseUJBQXlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztnQkFDM0MsSUFBSSxHQUFHLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtvQkFDL0MsS0FBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztpQkFDNUM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUtELHlDQUFVLEdBQVYsVUFBVyxPQUFhO1FBQXhCLGlCQXVDQztRQXRDQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDbkUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUMzQjthQUFNLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ2pDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7WUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUN4RDtZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFeEcsSUFBTSxRQUFNLEdBQVUsRUFBRSxDQUFDO1lBQ3pCLElBQU0sV0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO2dCQUM3QixJQUFJLFdBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDbEIsUUFBTSxDQUFDLElBQUksQ0FBQyxXQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDN0I7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILElBQU0sT0FBTyxHQUFvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUMvRSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN4QixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDakQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN6QjtnQkFDRCxLQUFLLENBQUMsSUFBSSxPQUFWLEtBQUssbUJBQVMsUUFBTSxHQUFFO2dCQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7YUFDeEM7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNsQyxLQUFLLHFCQUFJLEtBQUssR0FBSyxRQUFNLEdBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFDLENBQUM7YUFDdEQ7WUFDRCxJQUFJLENBQUMseUJBQXlCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztnQkFDM0MsSUFBSSxHQUFHLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtvQkFDL0MsS0FBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDMUM7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUtELG9EQUFxQixHQUFyQjtRQUNFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ3RCLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzNCLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtvQkFDakIsQ0FBQyxFQUFFLENBQUM7aUJBQ0w7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBS0QsaURBQWtCLEdBQWxCO1FBQ0UsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUM3QyxJQUFNLElBQUksR0FBb0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQy9ELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtnQkFDdkQsZUFBZSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUNsRDtTQUNGO1FBQ0QsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQztJQUVELHdEQUF5QixHQUF6QjtRQUNFLElBQUksWUFBOEIsQ0FBQztRQUNuQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDcEUsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO1NBQzVGO1FBQ0QsSUFBSSxZQUFZLEtBQUssU0FBUyxFQUFFO1lBQzlCLElBQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFVLFVBQUEsUUFBUTtnQkFDakQsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEIsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUN2QztRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFUyx3REFBeUIsR0FBbkMsVUFBb0MsVUFBa0I7UUFDcEQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLG9CQUFvQixFQUFFLENBQUMsVUFBVSxDQUFDO1FBQzVFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUM7WUFDckMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLG9CQUFvQjtZQUNyRixhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCO1lBQy9FLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxvQkFBb0I7U0FDdEYsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUgsMkJBQUM7QUFBRCxDQUFDLEFBbGRELElBa2RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIE5hdmlnYXRpb25FeHRyYXMsIFJvdXRlciwgVXJsU2VnbWVudEdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvZGlhbG9nL28tZm9ybS1sYXlvdXQtZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9sYXlvdXRzL2Zvcm0tbGF5b3V0L28tZm9ybS1sYXlvdXQtbWFuYWdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlJztcbmltcG9ydCB7IE5hdmlnYXRpb25TZXJ2aWNlLCBPTmF2aWdhdGlvbkl0ZW0gfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLWxheW91dC1kZXRhaWwtY29tcG9uZW50LWRhdGEudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgU1FMVHlwZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL3NxbHR5cGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9vLWZvcm0uY29tcG9uZW50JztcblxuZXhwb3J0IGNsYXNzIE9Gb3JtTmF2aWdhdGlvbkNsYXNzIHtcblxuICBmb3JtTGF5b3V0TWFuYWdlcjogT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50O1xuICBmb3JtTGF5b3V0RGlhbG9nOiBPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudDtcbiAgaWQ6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcblxuICBwcm90ZWN0ZWQgcVBhcmFtU3ViOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBxdWVyeVBhcmFtczogYW55O1xuXG4gIHByb3RlY3RlZCB1cmxQYXJhbVN1YjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgdXJsUGFyYW1zOiBvYmplY3Q7XG5cbiAgcHJvdGVjdGVkIHVybFN1YjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgdXJsU2VnbWVudHM6IGFueSA9IFtdO1xuXG4gIHByb3RlY3RlZCBjb21iaW5lZE5hdmlnYXRpb25TdHJlYW06IE9ic2VydmFibGU8YW55PjtcbiAgcHJvdGVjdGVkIGNvbWJpbmVkTmF2aWdhdGlvblN0cmVhbVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgb25VcmxQYXJhbUNoYW5nZWRTdHJlYW06IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBwdWJsaWMgbmF2aWdhdGlvblN0cmVhbTogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIHByb3RlY3RlZCBvbkNsb3NlVGFiU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBjYWNoZVN0YXRlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGVcbiAgKSB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UgPSBpbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPSB0aGlzLmluamVjdG9yLmdldChPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIE5vIHBhcmVudCBmb3JtTGF5b3V0TWFuYWdlclxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXREaWFsb2cgPSB0aGlzLmluamVjdG9yLmdldChPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gTm8gcGFyZW50IGZvcm0gbGF5b3V0IGRpYWxvZ1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvcm1MYXlvdXREaWFsb2cgJiYgIXRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPSB0aGlzLmZvcm1MYXlvdXREaWFsb2cuZm9ybUxheW91dE1hbmFnZXI7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb21iaW5lZE5hdmlnYXRpb25TdHJlYW0gPSBjb21iaW5lTGF0ZXN0KFtzZWxmLm9uVXJsUGFyYW1DaGFuZ2VkU3RyZWFtLmFzT2JzZXJ2YWJsZSgpXSk7XG5cbiAgICB0aGlzLmNvbWJpbmVkTmF2aWdhdGlvblN0cmVhbS5zdWJzY3JpYmUodmFsQXJyID0+IHtcbiAgICAgIGlmIChVdGlsLmlzQXJyYXkodmFsQXJyKSAmJiB2YWxBcnIubGVuZ3RoID09PSAxICYmIHZhbEFyclswXSkge1xuICAgICAgICBzZWxmLm5hdmlnYXRpb25TdHJlYW0uZW1pdCh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5pc1RhYk1vZGUoKSkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0TGFzdFRhYklkKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5xUGFyYW1TdWIpIHtcbiAgICAgIHRoaXMucVBhcmFtU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVybFBhcmFtU3ViKSB7XG4gICAgICB0aGlzLnVybFBhcmFtU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnVybFN1Yikge1xuICAgICAgdGhpcy51cmxTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY29tYmluZWROYXZpZ2F0aW9uU3RyZWFtU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNvbWJpbmVkTmF2aWdhdGlvblN0cmVhbVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZVRvUXVlcnlQYXJhbXMoKSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIGNvbnN0IGNhY2hlRGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldEZvcm1DYWNoZURhdGEodGhpcy5pZCk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2FjaGVEYXRhKSkge1xuICAgICAgICB0aGlzLnF1ZXJ5UGFyYW1zID0gY2FjaGVEYXRhLnF1ZXJ5UGFyYW1zIHx8IHt9O1xuICAgICAgICB0aGlzLnBhcnNlUXVlcnlQYXJhbXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnFQYXJhbVN1YiA9IHRoaXMuYWN0Um91dGUucXVlcnlQYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICBzZWxmLnF1ZXJ5UGFyYW1zID0gcGFyYW1zO1xuICAgICAgICAgIHNlbGYucGFyc2VRdWVyeVBhcmFtcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlUXVlcnlQYXJhbXMoKSB7XG4gICAgY29uc3QgaXNEZXRhaWwgPSB0aGlzLnF1ZXJ5UGFyYW1zW0NvZGVzLklTX0RFVEFJTF07XG4gICAgLy8gZW5zdXJpbmcgaXNkZXRhaWwgPSBmYWxzZSB3aGVuIHVzaW5nIGZvcm0gbGF5b3V0IG1hbmFnZXJcbiAgICB0aGlzLmZvcm0uaXNEZXRhaWxGb3JtID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlciA/IGZhbHNlIDogKGlzRGV0YWlsID09PSAndHJ1ZScpO1xuICB9XG5cbiAgc3Vic2NyaWJlVG9VcmxQYXJhbXMoKSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIGNvbnN0IGNhY2hlRGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldEZvcm1DYWNoZURhdGEodGhpcy5pZCk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2FjaGVEYXRhKSkge1xuICAgICAgICB0aGlzLnVybFBhcmFtcyA9IGNhY2hlRGF0YS5wYXJhbXM7XG4gICAgICAgIHRoaXMucGFyc2VVcmxQYXJhbXMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnVybFBhcmFtU3ViID0gdGhpcy5hY3RSb3V0ZS5wYXJhbXMuc3Vic2NyaWJlKHBhcmFtcyA9PiB7XG4gICAgICAgIHNlbGYudXJsUGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB0aGlzLnBhcnNlVXJsUGFyYW1zKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVXJsUGFyYW1zKCkge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnVybFBhcmFtcykgJiYgVXRpbC5pc0RlZmluZWQodGhpcy51cmxQYXJhbXNbQ29kZXMuUEFSRU5UX0tFWVNfS0VZXSkpIHtcbiAgICAgIHRoaXMuZm9ybS5mb3JtUGFyZW50S2V5c1ZhbHVlcyA9IFV0aWwuZGVjb2RlUGFyZW50S2V5cyh0aGlzLnVybFBhcmFtc1tDb2Rlcy5QQVJFTlRfS0VZU19LRVldKTtcbiAgICB9XG4gICAgLy8gVE9ETyBPYnRhaW4gJ2RhdGF0eXBlJyBvZiBlYWNoIGtleSBjb250YWluZWQgaW50byB1cmxQYXJhbXMgZm9yXG4gICAgLy8gZm9yIGJ1aWxkaW5nIGNvcnJlY3RseSBxdWVyeSBmaWx0ZXIhISEhXG4gICAgaWYgKHRoaXMudXJsUGFyYW1zKSB7XG4gICAgICB0aGlzLm9uVXJsUGFyYW1DaGFuZ2VkU3RyZWFtLmVtaXQodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlVG9VcmwoKSB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIGNvbnN0IGNhY2hlRGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldEZvcm1DYWNoZURhdGEodGhpcy5pZCk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2FjaGVEYXRhKSkge1xuICAgICAgICB0aGlzLnVybFNlZ21lbnRzID0gY2FjaGVEYXRhLnVybFNlZ21lbnRzO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMudXJsU3ViID0gdGhpcy5hY3RSb3V0ZS51cmwuc3Vic2NyaWJlKHVybFNlZ21lbnRzID0+IHtcbiAgICAgICAgc2VsZi51cmxTZWdtZW50cyA9IHVybFNlZ21lbnRzO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlVG9DYWNoZUNoYW5nZXMob25DYWNoZUVtcHR5U3RhdGVDaGFuZ2VzOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4pIHtcbiAgICB0aGlzLmNhY2hlU3RhdGVTdWJzY3JpcHRpb24gPSBvbkNhY2hlRW1wdHlTdGF0ZUNoYW5nZXMuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICB0aGlzLnNldE1vZGlmaWVkU3RhdGUoIXJlcyk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRDdXJyZW50S2V5c1ZhbHVlcygpOiBvYmplY3Qge1xuICAgIGxldCBmaWx0ZXIgPSB7fTtcbiAgICBpZiAodGhpcy51cmxQYXJhbXMpIHtcbiAgICAgIGZpbHRlciA9IHRoaXMuZ2V0RmlsdGVyRnJvbU9iamVjdCh0aGlzLnVybFBhcmFtcyk7XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBwcml2YXRlIGdldEZpbHRlckZyb21PYmplY3Qob2JqZWN0UGFyYW06IGFueSkge1xuICAgIGNvbnN0IGZpbHRlciA9IHt9O1xuICAgIGlmICghb2JqZWN0UGFyYW0gfHwgT2JqZWN0LmtleXMob2JqZWN0UGFyYW0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZpbHRlcjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9ybS5rZXlzQXJyYXkpIHtcbiAgICAgIHRoaXMuZm9ybS5rZXlzQXJyYXkuZm9yRWFjaCgoa2V5LCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAob2JqZWN0UGFyYW1ba2V5XSkge1xuICAgICAgICAgIGZpbHRlcltrZXldID0gU1FMVHlwZXMucGFyc2VVc2luZ1NRTFR5cGUob2JqZWN0UGFyYW1ba2V5XSwgdGhpcy5mb3JtLmtleXNTcWxUeXBlc0FycmF5W2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBPYmplY3Qua2V5cyh0aGlzLmZvcm0uX3BLZXlzRXF1aXYpLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCB1cmxWYWwgPSBvYmplY3RQYXJhbVt0aGlzLmZvcm0uX3BLZXlzRXF1aXZbaXRlbV1dO1xuICAgICAgaWYgKHVybFZhbCkge1xuICAgICAgICBmaWx0ZXJbaXRlbV0gPSBTUUxUeXBlcy5wYXJzZVVzaW5nU1FMVHlwZSh1cmxWYWwsIHRoaXMuZm9ybS5rZXlzU3FsVHlwZXNBcnJheVtpbmRleF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBnZXRGaWx0ZXJGcm9tVXJsUGFyYW1zKCkge1xuICAgIGNvbnN0IGZpbHRlciA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0VXJsUGFyYW1zKCkgfHwge30pO1xuICAgIGNvbnN0IHVybFBhcmFtc0tleXMgPSBPYmplY3Qua2V5cyhmaWx0ZXIgfHwge30pO1xuICAgIGlmICh1cmxQYXJhbXNLZXlzLmxlbmd0aCA+IDApIHtcbiAgICAgIHVybFBhcmFtc0tleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBDb2Rlcy5QQVJFTlRfS0VZU19LRVkpIHtcbiAgICAgICAgICBkZWxldGUgZmlsdGVyW2tleV07XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihmaWx0ZXIsIHRoaXMuZm9ybS5mb3JtUGFyZW50S2V5c1ZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgZ2V0VXJsU2VnbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsU2VnbWVudHM7XG4gIH1cblxuICBnZXRRdWVyeVBhcmFtcygpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVBhcmFtcztcbiAgfVxuXG4gIHNldFVybFBhcmFtcyh2YWw6IG9iamVjdCkge1xuICAgIHRoaXMudXJsUGFyYW1zID0gdmFsO1xuICB9XG5cbiAgZ2V0VXJsUGFyYW1zKCkge1xuICAgIHJldHVybiB0aGlzLnVybFBhcmFtcztcbiAgfVxuXG4gIHNldE1vZGlmaWVkU3RhdGUobW9kaWZpZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5zZXRNb2RpZmllZFN0YXRlKG1vZGlmaWVkLCB0aGlzLmlkKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVOYXZpZ2F0aW9uKCkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICBjb25zdCBpc0luSW5zZXJ0TW9kZSA9IHRoaXMuZm9ybS5pc0luSW5zZXJ0TW9kZSgpO1xuICAgICAgbGV0IGZvcm1EYXRhO1xuICAgICAgaWYgKGlzSW5JbnNlcnRNb2RlKSB7XG4gICAgICAgIGZvcm1EYXRhID0ge307XG4gICAgICAgIGZvcm1EYXRhLm5ld190YWJfdGl0bGUgPSAnTEFZT1VUX01BTkFOR0VSLklOU0VSVElPTl9NT0RFX1RJVExFJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlci5hbGxvd1RvVXBkYXRlTmF2aWdhdGlvbih0aGlzLmZvcm0ub2F0dHIpKSB7XG4gICAgICAgIGZvcm1EYXRhID0ge307XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmZvcm0uZm9ybURhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBmb3JtRGF0YVtrZXldID0gc2VsZi5mb3JtLmZvcm1EYXRhW2tleV0udmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGZvcm1EYXRhKSB7XG4gICAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIudXBkYXRlTmF2aWdhdGlvbihmb3JtRGF0YSwgdGhpcy5pZCwgaXNJbkluc2VydE1vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5hdmlnYXRlQmFjaygpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlcikge1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5jbG9zZURldGFpbCh0aGlzLmlkKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMubmF2aWdhdGlvblNlcnZpY2UpIHtcbiAgICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UucmVtb3ZlTGFzdEl0ZW0oKTtcbiAgICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdEl0ZW0oKTtcbiAgICAgIGlmIChuYXZEYXRhKSB7XG4gICAgICAgIGNvbnN0IGV4dHJhcyA9IHt9O1xuICAgICAgICBleHRyYXNbQ29kZXMuUVVFUllfUEFSQU1TXSA9IG5hdkRhdGEucXVlcnlQYXJhbXM7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtuYXZEYXRhLnVybF0sIGV4dHJhcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvc2VEZXRhaWxBY3Rpb24ob3B0aW9ucz86IGFueSkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmNsb3NlRGV0YWlsKHRoaXMuaWQpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZSkge1xuICAgICAgdGhpcy5mb3JtLmJlZm9yZUNsb3NlRGV0YWlsLmVtaXQoKTtcbiAgICAgIC8vIGByZW1vdmVMYXN0SXRlbXNVbnRpbE1haW5gIG1heSBub3QgcmVtb3ZlIGFsbCBuZWNlc3NhcnkgaXRlbXMgc28gY3VycmVudCByb3V0ZSB3aWxsIGJlIGNoZWNrZWQgYmVsb3dcbiAgICAgIGlmICghdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5yZW1vdmVMYXN0SXRlbXNVbnRpbE1haW4oKSkge1xuICAgICAgICAvLyBgcmVtb3ZlTGFzdEl0ZW1zVW50aWxNYWluYCBkaWRuJ3QgZmluZCB0aGUgbWFpbiBuYXZpZ2F0aW9uIGl0ZW1cbiAgICAgICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5yZW1vdmVMYXN0SXRlbSgpO1xuICAgICAgfVxuICAgICAgbGV0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdEl0ZW0oKTtcbiAgICAgIGlmIChuYXZEYXRhKSB7XG4gICAgICAgIC8vIGlmIG5hdkRhdGEgcm91dGUgaXMgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnQgcm91dGUsIHJlbW92ZSBsYXN0IGl0ZW1cbiAgICAgICAgaWYgKHRoaXMubmF2aWdhdGlvblNlcnZpY2UuaXNDdXJyZW50Um91dGUobmF2RGF0YS51cmwpKSB7XG4gICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5yZW1vdmVMYXN0SXRlbSgpO1xuICAgICAgICAgIG5hdkRhdGEgPSB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmdldExhc3RJdGVtKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge307XG4gICAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gbmF2RGF0YS5xdWVyeVBhcmFtcztcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW25hdkRhdGEudXJsXSwgZXh0cmFzKS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgaWYgKHZhbCAmJiBvcHRpb25zICYmIG9wdGlvbnMuY2hhbmdlVG9vbGJhck1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybS5nZXRGb3JtVG9vbGJhcigpLnNldEluaXRpYWxNb2RlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdGF5SW5SZWNvcmRBZnRlckluc2VydChpbnNlcnRlZEtleXM6IG9iamVjdCkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICB0aGlzLmZvcm0uc2V0SW5pdGlhbE1vZGUoKTtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5mb3JtLm9uRGF0YUxvYWRlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCBrZXlzID0gc2VsZi5mb3JtLmdldEtleXNWYWx1ZXMoKTtcbiAgICAgICAgc2VsZi5mb3JtTGF5b3V0TWFuYWdlci51cGRhdGVBY3RpdmVEYXRhKHsgcGFyYW1zOiBrZXlzIH0pO1xuICAgICAgICBjb25zdCBjYWNoZURhdGE6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhID0gc2VsZi5mb3JtTGF5b3V0TWFuYWdlci5nZXRGb3JtQ2FjaGVEYXRhKHNlbGYuaWQpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoY2FjaGVEYXRhKSkge1xuICAgICAgICAgIHNlbGYudXJsUGFyYW1zID0gY2FjaGVEYXRhLnBhcmFtcztcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5mb3JtLnF1ZXJ5RGF0YShpbnNlcnRlZEtleXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZSAmJiB0aGlzLmZvcm0ua2V5c0FycmF5ICYmIGluc2VydGVkS2V5cykge1xuICAgICAgLy8gUmVtb3ZlICduZXcnIG5hdmlnYXRpb24gaXRlbSBmcm9tIGhpc3RvcnlcbiAgICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UucmVtb3ZlTGFzdEl0ZW0oKTtcblxuICAgICAgbGV0IHBhcmFtczogYW55W10gPSBbXTtcbiAgICAgIHRoaXMuZm9ybS5rZXlzQXJyYXkuZm9yRWFjaCgoY3VycmVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluc2VydGVkS2V5c1tjdXJyZW50XSkge1xuICAgICAgICAgIHBhcmFtcy5wdXNoKGluc2VydGVkS2V5c1tjdXJyZW50XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbGV0IGV4dHJhczogTmF2aWdhdGlvbkV4dHJhcyA9IHt9O1xuICAgICAgbGV0IHFQYXJhbXM6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0UXVlcnlQYXJhbXMoKSwgQ29kZXMuZ2V0SXNEZXRhaWxPYmplY3QoKSk7XG4gICAgICBleHRyYXNbQ29kZXMuUVVFUllfUEFSQU1TXSA9IHFQYXJhbXM7XG4gICAgICBsZXQgcm91dGUgPSBbXTtcbiAgICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdE1haW5OYXZpZ2F0aW9uUm91dGVEYXRhKCk7XG4gICAgICBpZiAobmF2RGF0YSkge1xuICAgICAgICBsZXQgdXJsID0gbmF2RGF0YS51cmw7XG4gICAgICAgIGNvbnN0IGRldGFpbFJvdXRlID0gbmF2RGF0YS5nZXREZXRhaWxGb3JtUm91dGUoKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGRldGFpbFJvdXRlKSkge1xuICAgICAgICAgIHJvdXRlLnB1c2goZGV0YWlsUm91dGUpO1xuICAgICAgICAgIGNvbnN0IGRldGFpbEluZGV4ID0gdXJsLmxhc3RJbmRleE9mKCcvJyArIGRldGFpbFJvdXRlKTtcbiAgICAgICAgICBpZiAoZGV0YWlsSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIGRldGFpbEluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcm91dGUudW5zaGlmdCh1cmwpO1xuICAgICAgICByb3V0ZS5wdXNoKC4uLnBhcmFtcyk7XG4gICAgICAgIC8vIGRlbGV0aW5nIGluc2VydEZvcm1Sb3V0ZSBhcyBhY3RpdmUgbW9kZSAoYmVjYXVzZSBzdGF5SW5SZWNvcmRBZnRlckluc2VydCBjaGFuZ2VzIGl0KVxuICAgICAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmRlbGV0ZUFjdGl2ZUZvcm1Nb2RlKG5hdkRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXh0cmFzLnJlbGF0aXZlVG8gPSB0aGlzLmFjdFJvdXRlO1xuICAgICAgICByb3V0ZSA9IFsnLi4vJywgLi4ucGFyYW1zXTtcbiAgICAgIH1cbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKHJvdXRlLCBleHRyYXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gJ2luc2VydCcgbW9kZVxuICAgKi9cbiAgZ29JbnNlcnRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzRGlhbG9nTW9kZSgpKSB7XG4gICAgICB0aGlzLmZvcm0uc2V0SW5zZXJ0TW9kZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZSkge1xuICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5pc1RhYk1vZGUoKSkge1xuICAgICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLnNldEFzQWN0aXZlRm9ybUxheW91dE1hbmFnZXIoKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHJvdXRlID0gW107XG4gICAgICBjb25zdCBleHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7fTtcbiAgICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdE1haW5OYXZpZ2F0aW9uUm91dGVEYXRhKCk7XG4gICAgICBpZiAoIXRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgbmF2RGF0YSkge1xuICAgICAgICByb3V0ZS5wdXNoKG5hdkRhdGEudXJsKTtcbiAgICAgICAgY29uc3QgZGV0YWlsUm91dGUgPSBuYXZEYXRhLmdldERldGFpbEZvcm1Sb3V0ZSgpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoZGV0YWlsUm91dGUpKSB7XG4gICAgICAgICAgcm91dGUucHVzaChkZXRhaWxSb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcm91dGUucHVzaChuYXZEYXRhLmdldEluc2VydEZvcm1Sb3V0ZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4dHJhcy5yZWxhdGl2ZVRvID0gdGhpcy5hY3RSb3V0ZTtcbiAgICAgICAgcm91dGUgPSBbJy4uLycgKyBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURV07XG4gICAgICB9XG4gICAgICB0aGlzLnN0b3JlTmF2aWdhdGlvbkZvcm1Sb3V0ZXMoJ2luc2VydEZvcm1Sb3V0ZScpO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUocm91dGUsIGV4dHJhcykudGhlbigodmFsKSA9PiB7XG4gICAgICAgIGlmICh2YWwgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmNoYW5nZVRvb2xiYXJNb2RlKSB7XG4gICAgICAgICAgdGhpcy5mb3JtLmdldEZvcm1Ub29sYmFyKCkuc2V0SW5zZXJ0TW9kZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvICdlZGl0JyBtb2RlXG4gICAqL1xuICBnb0VkaXRNb2RlKG9wdGlvbnM/OiBhbnkpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzRGlhbG9nTW9kZSgpKSB7XG4gICAgICB0aGlzLmZvcm0uc2V0VXBkYXRlTW9kZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uYXZpZ2F0aW9uU2VydmljZSkge1xuICAgICAgbGV0IHJvdXRlID0gW107XG4gICAgICBjb25zdCBleHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7fTtcbiAgICAgIGlmICh0aGlzLmZvcm0uaXNEZXRhaWxGb3JtKSB7XG4gICAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gQ29kZXMuZ2V0SXNEZXRhaWxPYmplY3QoKTtcbiAgICAgIH1cbiAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXRRdWVyeVBhcmFtcygpLCBleHRyYXNbQ29kZXMuUVVFUllfUEFSQU1TXSB8fCB7fSk7XG5cbiAgICAgIGNvbnN0IHBhcmFtczogYW55W10gPSBbXTtcbiAgICAgIGNvbnN0IHVybFBhcmFtcyA9IHRoaXMuZ2V0VXJsUGFyYW1zKCk7XG4gICAgICB0aGlzLmZvcm0ua2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKHVybFBhcmFtc1trZXldKSB7XG4gICAgICAgICAgcGFyYW1zLnB1c2godXJsUGFyYW1zW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0UHJldmlvdXNSb3V0ZURhdGEoKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChuYXZEYXRhKSkge1xuICAgICAgICByb3V0ZS5wdXNoKG5hdkRhdGEudXJsKTtcbiAgICAgICAgY29uc3QgZGV0YWlsUm91dGUgPSBuYXZEYXRhLmdldERldGFpbEZvcm1Sb3V0ZSgpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoZGV0YWlsUm91dGUpKSB7XG4gICAgICAgICAgcm91dGUucHVzaChkZXRhaWxSb3V0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcm91dGUucHVzaCguLi5wYXJhbXMpO1xuICAgICAgICByb3V0ZS5wdXNoKG5hdkRhdGEuZ2V0RWRpdEZvcm1Sb3V0ZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4dHJhcy5yZWxhdGl2ZVRvID0gdGhpcy5hY3RSb3V0ZTtcbiAgICAgICAgcm91dGUgPSBbJy4uLycsIC4uLnBhcmFtcywgQ29kZXMuREVGQVVMVF9FRElUX1JPVVRFXTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uRm9ybVJvdXRlcygnZWRpdEZvcm1Sb3V0ZScpO1xuICAgICAgdGhpcy5mb3JtLmJlZm9yZUdvRWRpdE1vZGUuZW1pdCgpO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUocm91dGUsIGV4dHJhcykudGhlbigodmFsKSA9PiB7XG4gICAgICAgIGlmICh2YWwgJiYgb3B0aW9ucyAmJiBvcHRpb25zLmNoYW5nZVRvb2xiYXJNb2RlKSB7XG4gICAgICAgICAgdGhpcy5mb3JtLmdldEZvcm1Ub29sYmFyKCkuc2V0RWRpdE1vZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBnZXROZXN0ZWRMZXZlbHNOdW1iZXIoKSB7XG4gICAgbGV0IGFjdFJvdXRlID0gdGhpcy5hY3RSb3V0ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgd2hpbGUgKGFjdFJvdXRlLnBhcmVudCkge1xuICAgICAgYWN0Um91dGUgPSBhY3RSb3V0ZS5wYXJlbnQ7XG4gICAgICBhY3RSb3V0ZS51cmwuc3Vic2NyaWJlKCh4KSA9PiB7XG4gICAgICAgIGlmICh4ICYmIHgubGVuZ3RoKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH1cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIGdldEZ1bGxVcmxTZWdtZW50cygpIHtcbiAgICBsZXQgZnVsbFVybFNlZ21lbnRzID0gW107XG4gICAgY29uc3Qgcm91dGVyID0gdGhpcy5yb3V0ZXI7XG4gICAgaWYgKHJvdXRlciAmJiByb3V0ZXIudXJsICYmIHJvdXRlci51cmwubGVuZ3RoKSB7XG4gICAgICBjb25zdCByb290OiBVcmxTZWdtZW50R3JvdXAgPSByb3V0ZXIucGFyc2VVcmwocm91dGVyLnVybCkucm9vdDtcbiAgICAgIGlmIChyb290ICYmIHJvb3QuaGFzQ2hpbGRyZW4oKSAmJiByb290LmNoaWxkcmVuLnByaW1hcnkpIHtcbiAgICAgICAgZnVsbFVybFNlZ21lbnRzID0gcm9vdC5jaGlsZHJlbi5wcmltYXJ5LnNlZ21lbnRzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnVsbFVybFNlZ21lbnRzO1xuICB9XG5cbiAgc2hvd0NvbmZpcm1EaXNjYXJkQ2hhbmdlcygpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBsZXQgc3Vic2NyaXB0aW9uOiBQcm9taXNlPGJvb2xlYW4+O1xuICAgIGlmICh0aGlzLmZvcm0uaXNJbml0aWFsU3RhdGVDaGFuZ2VkKCkgJiYgIXRoaXMuZm9ybS5pc0luSW5zZXJ0TW9kZSgpKSB7XG4gICAgICBzdWJzY3JpcHRpb24gPSB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5GT1JNX0NIQU5HRVNfV0lMTF9CRV9MT1NUJyk7XG4gICAgfVxuICAgIGlmIChzdWJzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPGJvb2xlYW4+KG9ic2VydmVyID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICAgICAgc3Vic2NyaXB0aW9uID0gb2JzZXJ2YWJsZS50b1Byb21pc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIHByb3RlY3RlZCBzdG9yZU5hdmlnYXRpb25Gb3JtUm91dGVzKGFjdGl2ZU1vZGU6IHN0cmluZykge1xuICAgIGNvbnN0IGZvcm1Sb3V0ZXMgPSB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLmdldFByZXZpb3VzUm91dGVEYXRhKCkuZm9ybVJvdXRlcztcbiAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlLnN0b3JlRm9ybVJvdXRlcyh7XG4gICAgICBkZXRhaWxGb3JtUm91dGU6IGZvcm1Sb3V0ZXMgPyBmb3JtUm91dGVzLmRldGFpbEZvcm1Sb3V0ZSA6IENvZGVzLkRFRkFVTFRfREVUQUlMX1JPVVRFLFxuICAgICAgZWRpdEZvcm1Sb3V0ZTogZm9ybVJvdXRlcyA/IGZvcm1Sb3V0ZXMuZWRpdEZvcm1Sb3V0ZSA6IENvZGVzLkRFRkFVTFRfRURJVF9ST1VURSxcbiAgICAgIGluc2VydEZvcm1Sb3V0ZTogZm9ybVJvdXRlcyA/IGZvcm1Sb3V0ZXMuaW5zZXJ0Rm9ybVJvdXRlIDogQ29kZXMuREVGQVVMVF9JTlNFUlRfUk9VVEVcbiAgICB9LCBhY3RpdmVNb2RlKTtcbiAgfVxuXG59XG4iXX0=