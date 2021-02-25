import { Location } from '@angular/common';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ObservableWrapper } from '../util/async';
import { Codes } from '../util/codes';
import { Util } from '../util/util';
import { LocalStorageService } from './local-storage.service';
import { OBreadcrumbService } from './o-breadcrumb.service';
import * as i0 from "@angular/core";
var ONavigationItem = (function () {
    function ONavigationItem(value) {
        this.url = value.url ? value.url : '';
        this.queryParams = value[Codes.QUERY_PARAMS] ? value[Codes.QUERY_PARAMS] : {};
        this.formRoutes = value.formRoutes;
        this.formLayoutRoutes = value.formLayoutRoutes;
        this.activeFormMode = value.activeFormMode;
        this.keysValues = value.keysValues;
        this.queryConfiguration = value.queryConfiguration;
    }
    ONavigationItem.prototype.getActiveModePath = function () {
        var result;
        if (Util.isDefined(this.activeFormMode)) {
            result = (this.formRoutes || {})[this.activeFormMode];
        }
        return result;
    };
    ONavigationItem.prototype.isInsertFormRoute = function () {
        return this.activeFormMode === 'insertFormRoute';
    };
    ONavigationItem.prototype.getInsertFormRoute = function () {
        var routes = this.formRoutes;
        return routes ? (routes.insertFormRoute || Codes.DEFAULT_INSERT_ROUTE) : Codes.DEFAULT_INSERT_ROUTE;
    };
    ONavigationItem.prototype.getEditFormRoute = function () {
        var routes = this.formRoutes;
        return routes ? (routes.editFormRoute || Codes.DEFAULT_EDIT_ROUTE) : Codes.DEFAULT_EDIT_ROUTE;
    };
    ONavigationItem.prototype.getDetailFormRoute = function () {
        var routes = this.formRoutes;
        return routes ? (routes.detailFormRoute || Codes.DEFAULT_DETAIL_ROUTE) : Codes.DEFAULT_DETAIL_ROUTE;
    };
    ONavigationItem.prototype.isMainFormLayoutManagerComponent = function () {
        return Util.isDefined(this.formLayoutRoutes);
    };
    ONavigationItem.prototype.isMainNavigationComponent = function () {
        return Util.isDefined(this.formRoutes) && this.formRoutes.isMainNavigationComponent;
    };
    ONavigationItem.prototype.getFormRoutes = function () {
        return this.formRoutes;
    };
    ONavigationItem.prototype.setFormRoutes = function (arg) {
        if (arg && arg.mainFormLayoutManagerComponent) {
            this.formLayoutRoutes = arg;
        }
        else {
            this.formRoutes = arg;
        }
    };
    ONavigationItem.prototype.deleteActiveFormMode = function () {
        this.activeFormMode = undefined;
    };
    return ONavigationItem;
}());
export { ONavigationItem };
var MAXIMIUM_NAVIGATION_HEAP_SIZE = 15;
var NavigationService = (function () {
    function NavigationService(injector) {
        var _this = this;
        this.injector = injector;
        this.currentTitle = null;
        this.visible = true;
        this.navigationItems = [];
        this.allNavigationItems = [];
        this.navigationEvents$ = new ReplaySubject(1);
        this._titleEmitter = new EventEmitter();
        this._visibleEmitter = new EventEmitter();
        this._sidenavEmitter = new EventEmitter();
        this.router = this.injector.get(Router);
        this.oBreadcrumbService = this.injector.get(OBreadcrumbService);
        this.localStorageService = this.injector.get(LocalStorageService);
        this.location = this.injector.get(Location);
        this.location.subscribe(function (val) {
            var previousRoute = _this.getPreviousRouteData();
            var qParams = Object.keys(previousRoute.queryParams);
            var arr = [];
            qParams.forEach(function (p) {
                arr.push(p + "=" + previousRoute.queryParams[p]);
            });
            var fullUrl = "/" + previousRoute.url;
            if (arr.length > 0) {
                fullUrl = "/" + previousRoute.url + "?" + arr.join('&');
            }
            if (fullUrl === val.url) {
                _this.navigationItems.pop();
            }
        });
    }
    NavigationService.prototype.initialize = function () {
        var _this = this;
        this.router.events.pipe(filter(function (event) { return event instanceof NavigationEnd; }), map(function () { return _this.router.routerState.root; }), map(function (route) {
            while (route.firstChild) {
                route = route.firstChild;
            }
            return route;
        }), filter(function (route) { return route.outlet === 'primary'; })).subscribe(this.parseNavigationItems.bind(this));
    };
    NavigationService.prototype.buildBreadcrumbsForRoute = function (activatedRoute) {
        var breadcrumbs = [];
        var url = '';
        var route = activatedRoute.firstChild;
        while (route.firstChild) {
            if (route.url.length) {
                var pRoute = this.parseRoute(url, route);
                breadcrumbs.push(pRoute);
                url = pRoute.route;
            }
            route = route.firstChild;
        }
        var parsedRoute = this.parseRoute(url, route);
        breadcrumbs.push(parsedRoute);
        this.oBreadcrumbService.breadcrumbs$.next(breadcrumbs);
    };
    NavigationService.prototype.parseRoute = function (route, activatedRoute) {
        var label = '';
        for (var i = 0, len = activatedRoute.url.length; i < len; i++) {
            var segment = activatedRoute.url[i];
            if (label.length === 0) {
                label = label.length > 0 ? ('/' + segment.path) : segment.path;
                route += '/' + segment.path;
            }
        }
        return { route: route, label: label, queryParams: activatedRoute.queryParams };
    };
    NavigationService.prototype.parseNavigationItems = function () {
        var storedNavigation = this.getStoredData();
        var route = this.router.routerState.root.snapshot;
        var url = this.router.routerState.snapshot.url.split('?')[0];
        this.buildBreadcrumbsForRoute(route);
        var lastStored = storedNavigation[storedNavigation.length - 1];
        if (!lastStored || lastStored.url !== url) {
            var navigationItem = new ONavigationItem({ url: url, queryParams: route.queryParams });
            this.navigationItems.push(navigationItem);
            this.setNavigationItems(this.navigationItems);
        }
    };
    NavigationService.prototype.setNavigationItems = function (navigationItems) {
        this.navigationItems = navigationItems;
        this.storeNavigation();
        this.navigationEvents$.next(navigationItems);
    };
    NavigationService.prototype.getDataToStore = function () {
        return this.navigationItems;
    };
    NavigationService.prototype.getComponentKey = function () {
        return NavigationService.NAVIGATION_STORAGE_KEY;
    };
    NavigationService.prototype.storeNavigation = function () {
        if (this.localStorageService) {
            this.localStorageService.updateComponentStorage(this);
        }
    };
    NavigationService.prototype.setTitle = function (title) {
        this.currentTitle = title;
        this._emitTitleChanged(this.currentTitle);
    };
    NavigationService.prototype.setVisible = function (visible) {
        this.visible = visible;
        this._emitVisibleChanged(this.visible);
    };
    NavigationService.prototype.openSidenav = function () {
        this._emitOpenSidenav();
    };
    NavigationService.prototype.closeSidenav = function () {
        this._emitCloseSidenav();
    };
    NavigationService.prototype.onTitleChange = function (onNext) {
        return ObservableWrapper.subscribe(this._titleEmitter, onNext);
    };
    NavigationService.prototype.onVisibleChange = function (onNext) {
        return ObservableWrapper.subscribe(this._visibleEmitter, onNext);
    };
    NavigationService.prototype.onSidenavChange = function (onNext) {
        return ObservableWrapper.subscribe(this._sidenavEmitter, onNext);
    };
    NavigationService.prototype._emitTitleChanged = function (title) {
        ObservableWrapper.callEmit(this._titleEmitter, title);
    };
    NavigationService.prototype._emitVisibleChanged = function (visible) {
        ObservableWrapper.callEmit(this._visibleEmitter, visible);
    };
    NavigationService.prototype._emitOpenSidenav = function () {
        ObservableWrapper.callEmit(this._sidenavEmitter, 'open');
    };
    NavigationService.prototype._emitCloseSidenav = function () {
        ObservableWrapper.callEmit(this._sidenavEmitter, 'close');
    };
    NavigationService.prototype.storeFormRoutes = function (routes, activeMode, queryConf) {
        if (this.navigationItems.length > 0) {
            this.navigationItems[this.navigationItems.length - 1].setFormRoutes(routes);
            this.navigationItems[this.navigationItems.length - 1].activeFormMode = activeMode;
            if (queryConf) {
                this.navigationItems[this.navigationItems.length - 1].keysValues = queryConf.keysValues;
                delete queryConf.keysValues;
                this.navigationItems[this.navigationItems.length - 1].queryConfiguration = Object.keys(queryConf).length > 0 ? queryConf : null;
            }
            this.storeNavigation();
        }
    };
    NavigationService.prototype.getStoredData = function () {
        var storageData = this.localStorageService.getComponentStorage(this);
        var result = [];
        Object.keys(storageData).forEach(function (key) { return result.push(new ONavigationItem(storageData[key])); });
        return result;
    };
    NavigationService.prototype.getPreviousRouteData = function () {
        var result;
        var len = this.navigationItems.length;
        if (len >= 2) {
            result = this.navigationItems[len - 2];
            if (result && result.formRoutes && result.formRoutes.mainFormLayoutManagerComponent && this.navigationItems[len - 3]) {
                var parent_1 = this.navigationItems[len - 3];
                if (parent_1.isMainFormLayoutManagerComponent()) {
                    result = parent_1;
                }
            }
        }
        return result;
    };
    NavigationService.prototype.getLastMainNavigationRouteData = function () {
        var _this = this;
        var routeMatches = [];
        var items = this.navigationItems.slice().reverse()
            .map(function (item, i) {
            var currentLocation = _this.location.path().substr(1);
            if (currentLocation.includes('?')) {
                currentLocation = currentLocation.substring(0, currentLocation.indexOf('?'));
            }
            var arr1 = item.url.substr(1).split('/');
            var arr2 = currentLocation.split('/');
            var result = 0;
            var index = -1;
            while (++index <= arr1.length && index <= arr2.length) {
                routeMatches[i] = (arr1[index] === arr2[index]) ? result++ : result;
            }
            return item;
        });
        var maxMatches = routeMatches.reduce(function (a, b) { return Math.max(a, b); });
        var lastNavItem = this.navigationItems[this.navigationItems.length - 1];
        if (!lastNavItem.isMainNavigationComponent() && !lastNavItem.isMainFormLayoutManagerComponent()) {
            maxMatches--;
        }
        var itemResult = void 0;
        while (!itemResult && maxMatches >= 0) {
            itemResult = items.find(function (item, i) { return (item.isMainNavigationComponent() || item.isMainFormLayoutManagerComponent()) && routeMatches[i] === maxMatches; });
            maxMatches--;
        }
        return itemResult;
    };
    NavigationService.prototype.removeLastItem = function () {
        this.navigationItems.pop();
        this.storeNavigation();
    };
    NavigationService.prototype.removeLastItemsUntilMain = function () {
        var lastMain = this.getLastMainNavigationRouteData();
        if (!Util.isDefined(lastMain)) {
            return false;
        }
        var index = this.navigationItems.indexOf(lastMain);
        this.navigationItems = this.navigationItems.slice(0, index + 1);
        this.storeNavigation();
        return true;
    };
    NavigationService.prototype.isCurrentRoute = function (route) {
        var currentRoute = this.router.routerState.snapshot.url;
        currentRoute = currentRoute.split('?')[0];
        return route === currentRoute;
    };
    NavigationService.prototype.getLastItem = function () {
        var result;
        if (this.navigationItems.length > 0) {
            result = this.navigationItems[this.navigationItems.length - 1];
        }
        return result;
    };
    NavigationService.prototype.deleteActiveFormMode = function (arg) {
        arg.deleteActiveFormMode();
        this.storeNavigation();
    };
    NavigationService.NAVIGATION_STORAGE_KEY = 'nav_service';
    NavigationService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    NavigationService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    NavigationService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NavigationService_Factory() { return new NavigationService(i0.ɵɵinject(i0.INJECTOR)); }, token: NavigationService, providedIn: "root" });
    return NavigationService;
}());
export { NavigationService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRSxPQUFPLEVBQTBCLGFBQWEsRUFBRSxNQUFNLEVBQWMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJN0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQzs7QUFVNUQ7SUFTRSx5QkFBWSxLQUFVO1FBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzlFLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFD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QUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBDQUFjLEdBQWQsVUFBZSxLQUFhO1FBQzFCLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDeEQsWUFBWSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsT0FBTyxLQUFLLEtBQUssWUFBWSxDQUFDO0lBQ2hDLENBQUM7SUFFRCx1Q0FBVyxHQUFYO1FBQ0UsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNoRTtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnREFBb0IsR0FBcEIsVUFBcUIsR0FBb0I7UUFDdkMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFwUmEsd0NBQXNCLEdBQVcsYUFBYSxDQUFDOztnQkFMOUQsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7O2dCQWhHa0MsUUFBUTs7OzRCQUQzQztDQTBYQyxBQTNSRCxJQTJSQztTQXhSWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIsIFVybFNlZ21lbnQgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IElMb2NhbFN0b3JhZ2VDb21wb25lbnQgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2xvY2FsLXN0b3JhZ2UtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBPQnJlYWRjcnVtYiB9IGZyb20gJy4uL3R5cGVzL28tYnJlYWRjcnVtYi1pdGVtLnR5cGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZVdyYXBwZXIgfSBmcm9tICcuLi91dGlsL2FzeW5jJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IExvY2FsU3RvcmFnZVNlcnZpY2UgfSBmcm9tICcuL2xvY2FsLXN0b3JhZ2Uuc2VydmljZSc7XG5pbXBvcnQgeyBPQnJlYWRjcnVtYlNlcnZpY2UgfSBmcm9tICcuL28tYnJlYWRjcnVtYi5zZXJ2aWNlJztcblxuZXhwb3J0IHR5cGUgT05hdmlnYXRpb25Sb3V0ZXMgPSB7XG4gIG1haW5Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudD86IGJvb2xlYW47XG4gIGlzTWFpbk5hdmlnYXRpb25Db21wb25lbnQ/OiBib29sZWFuO1xuICBkZXRhaWxGb3JtUm91dGU6IHN0cmluZztcbiAgZWRpdEZvcm1Sb3V0ZTogc3RyaW5nO1xuICBpbnNlcnRGb3JtUm91dGU6IHN0cmluZztcbn07XG5cbmV4cG9ydCBjbGFzcyBPTmF2aWdhdGlvbkl0ZW0ge1xuICB1cmw6IHN0cmluZztcbiAgcXVlcnlQYXJhbXM6IG9iamVjdDtcbiAgYWN0aXZlRm9ybU1vZGU6IHN0cmluZztcbiAgZm9ybVJvdXRlczogT05hdmlnYXRpb25Sb3V0ZXM7XG4gIGZvcm1MYXlvdXRSb3V0ZXM6IE9OYXZpZ2F0aW9uUm91dGVzO1xuICBrZXlzVmFsdWVzOiBhbnk7XG4gIHF1ZXJ5Q29uZmlndXJhdGlvbjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnVybCA9IHZhbHVlLnVybCA/IHZhbHVlLnVybCA6ICcnO1xuICAgIHRoaXMucXVlcnlQYXJhbXMgPSB2YWx1ZVtDb2Rlcy5RVUVSWV9QQVJBTVNdID8gdmFsdWVbQ29kZXMuUVVFUllfUEFSQU1TXSA6IHt9O1xuICAgIHRoaXMuZm9ybVJvdXRlcyA9IHZhbHVlLmZvcm1Sb3V0ZXM7XG4gICAgdGhpcy5mb3JtTGF5b3V0Um91dGVzID0gdmFsdWUuZm9ybUxheW91dFJvdXRlcztcbiAgICB0aGlzLmFjdGl2ZUZvcm1Nb2RlID0gdmFsdWUuYWN0aXZlRm9ybU1vZGU7XG4gICAgdGhpcy5rZXlzVmFsdWVzID0gdmFsdWUua2V5c1ZhbHVlcztcbiAgICB0aGlzLnF1ZXJ5Q29uZmlndXJhdGlvbiA9IHZhbHVlLnF1ZXJ5Q29uZmlndXJhdGlvbjtcbiAgfVxuXG4gIGdldEFjdGl2ZU1vZGVQYXRoKCk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5hY3RpdmVGb3JtTW9kZSkpIHtcbiAgICAgIHJlc3VsdCA9ICh0aGlzLmZvcm1Sb3V0ZXMgfHwge30pW3RoaXMuYWN0aXZlRm9ybU1vZGVdO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaXNJbnNlcnRGb3JtUm91dGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRm9ybU1vZGUgPT09ICdpbnNlcnRGb3JtUm91dGUnO1xuICB9XG5cbiAgZ2V0SW5zZXJ0Rm9ybVJvdXRlKCk6IHN0cmluZyB7XG4gICAgY29uc3Qgcm91dGVzID0gdGhpcy5mb3JtUm91dGVzO1xuICAgIHJldHVybiByb3V0ZXMgPyAocm91dGVzLmluc2VydEZvcm1Sb3V0ZSB8fCBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURSkgOiBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURTtcbiAgfVxuXG4gIGdldEVkaXRGb3JtUm91dGUoKTogc3RyaW5nIHtcbiAgICBjb25zdCByb3V0ZXMgPSB0aGlzLmZvcm1Sb3V0ZXM7XG4gICAgcmV0dXJuIHJvdXRlcyA/IChyb3V0ZXMuZWRpdEZvcm1Sb3V0ZSB8fCBDb2Rlcy5ERUZBVUxUX0VESVRfUk9VVEUpIDogQ29kZXMuREVGQVVMVF9FRElUX1JPVVRFO1xuICB9XG5cbiAgZ2V0RGV0YWlsRm9ybVJvdXRlKCk6IHN0cmluZyB7XG4gICAgY29uc3Qgcm91dGVzID0gdGhpcy5mb3JtUm91dGVzO1xuICAgIHJldHVybiByb3V0ZXMgPyAocm91dGVzLmRldGFpbEZvcm1Sb3V0ZSB8fCBDb2Rlcy5ERUZBVUxUX0RFVEFJTF9ST1VURSkgOiBDb2Rlcy5ERUZBVUxUX0RFVEFJTF9ST1VURTtcbiAgfVxuXG4gIGlzTWFpbkZvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm1MYXlvdXRSb3V0ZXMpO1xuICB9XG5cbiAgaXNNYWluTmF2aWdhdGlvbkNvbXBvbmVudCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5mb3JtUm91dGVzKSAmJiB0aGlzLmZvcm1Sb3V0ZXMuaXNNYWluTmF2aWdhdGlvbkNvbXBvbmVudDtcbiAgfVxuXG4gIGdldEZvcm1Sb3V0ZXMoKTogT05hdmlnYXRpb25Sb3V0ZXMge1xuICAgIHJldHVybiB0aGlzLmZvcm1Sb3V0ZXM7XG4gIH1cblxuICBzZXRGb3JtUm91dGVzKGFyZzogT05hdmlnYXRpb25Sb3V0ZXMpIHtcbiAgICBpZiAoYXJnICYmIGFyZy5tYWluRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpIHtcbiAgICAgIHRoaXMuZm9ybUxheW91dFJvdXRlcyA9IGFyZztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb3JtUm91dGVzID0gYXJnO1xuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZUFjdGl2ZUZvcm1Nb2RlKCkge1xuICAgIHRoaXMuYWN0aXZlRm9ybU1vZGUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxuY29uc3QgTUFYSU1JVU1fTkFWSUdBVElPTl9IRUFQX1NJWkUgPSAxNTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvblNlcnZpY2UgaW1wbGVtZW50cyBJTG9jYWxTdG9yYWdlQ29tcG9uZW50IHtcblxuICBwdWJsaWMgc3RhdGljIE5BVklHQVRJT05fU1RPUkFHRV9LRVk6IHN0cmluZyA9ICduYXZfc2VydmljZSc7XG5cbiAgcHVibGljIGN1cnJlbnRUaXRsZTogc3RyaW5nID0gbnVsbDtcbiAgcHVibGljIHZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHByb3RlY3RlZCBuYXZpZ2F0aW9uSXRlbXM6IEFycmF5PE9OYXZpZ2F0aW9uSXRlbT4gPSBbXTtcbiAgcHJvdGVjdGVkIGFsbE5hdmlnYXRpb25JdGVtczogT05hdmlnYXRpb25JdGVtW10gPSBbXTtcblxuICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXI7XG5cbiAgcHJvdGVjdGVkIG9CcmVhZGNydW1iU2VydmljZTogT0JyZWFkY3J1bWJTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbG9jYWxTdG9yYWdlU2VydmljZTogTG9jYWxTdG9yYWdlU2VydmljZTtcbiAgcHJvdGVjdGVkIGxvY2F0aW9uOiBMb2NhdGlvbjtcblxuICBwdWJsaWMgbmF2aWdhdGlvbkV2ZW50cyQ6IFJlcGxheVN1YmplY3Q8QXJyYXk8T05hdmlnYXRpb25JdGVtPj4gPSBuZXcgUmVwbGF5U3ViamVjdDxBcnJheTxPTmF2aWdhdGlvbkl0ZW0+PigxKTtcblxuICBwcml2YXRlIF90aXRsZUVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIF92aXNpYmxlRW1pdHRlcjogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBwcml2YXRlIF9zaWRlbmF2RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLnJvdXRlciA9IHRoaXMuaW5qZWN0b3IuZ2V0KFJvdXRlcik7XG4gICAgdGhpcy5vQnJlYWRjcnVtYlNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPQnJlYWRjcnVtYlNlcnZpY2UpO1xuICAgIHRoaXMubG9jYWxTdG9yYWdlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KExvY2FsU3RvcmFnZVNlcnZpY2UpO1xuICAgIHRoaXMubG9jYXRpb24gPSB0aGlzLmluamVjdG9yLmdldChMb2NhdGlvbik7XG4gICAgdGhpcy5sb2NhdGlvbi5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgIGNvbnN0IHByZXZpb3VzUm91dGUgPSB0aGlzLmdldFByZXZpb3VzUm91dGVEYXRhKCk7XG4gICAgICBjb25zdCBxUGFyYW1zID0gT2JqZWN0LmtleXMocHJldmlvdXNSb3V0ZS5xdWVyeVBhcmFtcyk7XG4gICAgICBjb25zdCBhcnIgPSBbXTtcbiAgICAgIHFQYXJhbXMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICBhcnIucHVzaChgJHtwfT0ke3ByZXZpb3VzUm91dGUucXVlcnlQYXJhbXNbcF19YCk7XG4gICAgICB9KTtcbiAgICAgIGxldCBmdWxsVXJsID0gYC8ke3ByZXZpb3VzUm91dGUudXJsfWA7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZnVsbFVybCA9IGAvJHtwcmV2aW91c1JvdXRlLnVybH0/JHthcnIuam9pbignJicpfWA7XG4gICAgICB9XG4gICAgICBpZiAoZnVsbFVybCA9PT0gdmFsLnVybCkge1xuICAgICAgICB0aGlzLm5hdmlnYXRpb25JdGVtcy5wb3AoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzLnBpcGUoXG4gICAgICBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSxcbiAgICAgIG1hcCgoKSA9PiB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5yb290KSxcbiAgICAgIG1hcChyb3V0ZSA9PiB7XG4gICAgICAgIHdoaWxlIChyb3V0ZS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgcm91dGUgPSByb3V0ZS5maXJzdENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3V0ZTtcbiAgICAgIH0pLFxuICAgICAgZmlsdGVyKHJvdXRlID0+IHJvdXRlLm91dGxldCA9PT0gJ3ByaW1hcnknKVxuICAgICkuc3Vic2NyaWJlKHRoaXMucGFyc2VOYXZpZ2F0aW9uSXRlbXMuYmluZCh0aGlzKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRCcmVhZGNydW1ic0ZvclJvdXRlKGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KSB7XG4gICAgY29uc3QgYnJlYWRjcnVtYnM6IE9CcmVhZGNydW1iW10gPSBbXTtcbiAgICBsZXQgdXJsID0gJyc7XG4gICAgbGV0IHJvdXRlID0gYWN0aXZhdGVkUm91dGUuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAocm91dGUuZmlyc3RDaGlsZCkge1xuICAgICAgaWYgKHJvdXRlLnVybC5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgcFJvdXRlID0gdGhpcy5wYXJzZVJvdXRlKHVybCwgcm91dGUpO1xuICAgICAgICBicmVhZGNydW1icy5wdXNoKHBSb3V0ZSk7XG4gICAgICAgIHVybCA9IHBSb3V0ZS5yb3V0ZTtcbiAgICAgIH1cbiAgICAgIHJvdXRlID0gcm91dGUuZmlyc3RDaGlsZDtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VkUm91dGUgPSB0aGlzLnBhcnNlUm91dGUodXJsLCByb3V0ZSk7XG4gICAgYnJlYWRjcnVtYnMucHVzaChwYXJzZWRSb3V0ZSk7XG5cbiAgICB0aGlzLm9CcmVhZGNydW1iU2VydmljZS5icmVhZGNydW1icyQubmV4dChicmVhZGNydW1icyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VSb3V0ZShyb3V0ZTogc3RyaW5nLCBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IE9CcmVhZGNydW1iIHtcbiAgICBsZXQgbGFiZWwgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYWN0aXZhdGVkUm91dGUudXJsLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBzZWdtZW50OiBVcmxTZWdtZW50ID0gYWN0aXZhdGVkUm91dGUudXJsW2ldO1xuICAgICAgaWYgKGxhYmVsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBsYWJlbCA9IGxhYmVsLmxlbmd0aCA+IDAgPyAoJy8nICsgc2VnbWVudC5wYXRoKSA6IHNlZ21lbnQucGF0aDtcbiAgICAgICAgcm91dGUgKz0gJy8nICsgc2VnbWVudC5wYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyByb3V0ZSwgbGFiZWwsIHF1ZXJ5UGFyYW1zOiBhY3RpdmF0ZWRSb3V0ZS5xdWVyeVBhcmFtcyB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlTmF2aWdhdGlvbkl0ZW1zKCkge1xuICAgIGNvbnN0IHN0b3JlZE5hdmlnYXRpb246IE9OYXZpZ2F0aW9uSXRlbVtdID0gdGhpcy5nZXRTdG9yZWREYXRhKCk7XG4gICAgY29uc3Qgcm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QgPSB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5yb290LnNuYXBzaG90O1xuICAgIGNvbnN0IHVybCA9IHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90LnVybC5zcGxpdCgnPycpWzBdO1xuICAgIHRoaXMuYnVpbGRCcmVhZGNydW1ic0ZvclJvdXRlKHJvdXRlKTtcbiAgICBjb25zdCBsYXN0U3RvcmVkOiBhbnkgPSBzdG9yZWROYXZpZ2F0aW9uW3N0b3JlZE5hdmlnYXRpb24ubGVuZ3RoIC0gMV07XG4gICAgaWYgKCFsYXN0U3RvcmVkIHx8IGxhc3RTdG9yZWQudXJsICE9PSB1cmwpIHtcbiAgICAgIGNvbnN0IG5hdmlnYXRpb25JdGVtID0gbmV3IE9OYXZpZ2F0aW9uSXRlbSh7IHVybCwgcXVlcnlQYXJhbXM6IHJvdXRlLnF1ZXJ5UGFyYW1zIH0pO1xuXG4gICAgICB0aGlzLm5hdmlnYXRpb25JdGVtcy5wdXNoKG5hdmlnYXRpb25JdGVtKTtcbiAgICAgIHRoaXMuc2V0TmF2aWdhdGlvbkl0ZW1zKHRoaXMubmF2aWdhdGlvbkl0ZW1zKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0TmF2aWdhdGlvbkl0ZW1zKG5hdmlnYXRpb25JdGVtczogT05hdmlnYXRpb25JdGVtW10pIHtcbiAgICB0aGlzLm5hdmlnYXRpb25JdGVtcyA9IG5hdmlnYXRpb25JdGVtcztcbiAgICB0aGlzLnN0b3JlTmF2aWdhdGlvbigpO1xuICAgIHRoaXMubmF2aWdhdGlvbkV2ZW50cyQubmV4dChuYXZpZ2F0aW9uSXRlbXMpO1xuICB9XG5cbiAgcHVibGljIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHRoaXMubmF2aWdhdGlvbkl0ZW1zO1xuICB9XG5cbiAgcHVibGljIGdldENvbXBvbmVudEtleSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBOYXZpZ2F0aW9uU2VydmljZS5OQVZJR0FUSU9OX1NUT1JBR0VfS0VZO1xuICB9XG5cbiAgcHJvdGVjdGVkIHN0b3JlTmF2aWdhdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgICB0aGlzLmxvY2FsU3RvcmFnZVNlcnZpY2UudXBkYXRlQ29tcG9uZW50U3RvcmFnZSh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2V0VGl0bGUodGl0bGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFRpdGxlID0gdGl0bGU7XG4gICAgdGhpcy5fZW1pdFRpdGxlQ2hhbmdlZCh0aGlzLmN1cnJlbnRUaXRsZSk7XG4gIH1cblxuICBwdWJsaWMgc2V0VmlzaWJsZSh2aXNpYmxlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgICB0aGlzLl9lbWl0VmlzaWJsZUNoYW5nZWQodGhpcy52aXNpYmxlKTtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuU2lkZW5hdigpIHtcbiAgICB0aGlzLl9lbWl0T3BlblNpZGVuYXYoKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9zZVNpZGVuYXYoKSB7XG4gICAgdGhpcy5fZW1pdENsb3NlU2lkZW5hdigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZSB0byB0aXRsZSB1cGRhdGVzXG4gICAqL1xuICBwdWJsaWMgb25UaXRsZUNoYW5nZShvbk5leHQ6ICh2YWx1ZTogYW55KSA9PiB2b2lkKTogb2JqZWN0IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKHRoaXMuX3RpdGxlRW1pdHRlciwgb25OZXh0KTtcbiAgfVxuXG4gIHB1YmxpYyBvblZpc2libGVDaGFuZ2Uob25OZXh0OiAodmFsdWU6IGJvb2xlYW4pID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5fdmlzaWJsZUVtaXR0ZXIsIG9uTmV4dCk7XG4gIH1cblxuICBwdWJsaWMgb25TaWRlbmF2Q2hhbmdlKG9uTmV4dDogKHZhbHVlOiBhbnkpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5fc2lkZW5hdkVtaXR0ZXIsIG9uTmV4dCk7XG4gIH1cblxuICBwcml2YXRlIF9lbWl0VGl0bGVDaGFuZ2VkKHRpdGxlKTogdm9pZCB7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5fdGl0bGVFbWl0dGVyLCB0aXRsZSk7XG4gIH1cblxuICBwcml2YXRlIF9lbWl0VmlzaWJsZUNoYW5nZWQodmlzaWJsZSk6IHZvaWQge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMuX3Zpc2libGVFbWl0dGVyLCB2aXNpYmxlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2VtaXRPcGVuU2lkZW5hdigpIHtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLl9zaWRlbmF2RW1pdHRlciwgJ29wZW4nKTtcbiAgfVxuXG4gIHByaXZhdGUgX2VtaXRDbG9zZVNpZGVuYXYoKSB7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5fc2lkZW5hdkVtaXR0ZXIsICdjbG9zZScpO1xuICB9XG5cbiAgc3RvcmVGb3JtUm91dGVzKHJvdXRlczogT05hdmlnYXRpb25Sb3V0ZXMsIGFjdGl2ZU1vZGU6IHN0cmluZywgcXVlcnlDb25mPzogYW55KSB7XG4gICAgaWYgKHRoaXMubmF2aWdhdGlvbkl0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMubmF2aWdhdGlvbkl0ZW1zW3RoaXMubmF2aWdhdGlvbkl0ZW1zLmxlbmd0aCAtIDFdLnNldEZvcm1Sb3V0ZXMocm91dGVzKTtcbiAgICAgIHRoaXMubmF2aWdhdGlvbkl0ZW1zW3RoaXMubmF2aWdhdGlvbkl0ZW1zLmxlbmd0aCAtIDFdLmFjdGl2ZUZvcm1Nb2RlID0gYWN0aXZlTW9kZTtcbiAgICAgIGlmIChxdWVyeUNvbmYpIHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0aW9uSXRlbXNbdGhpcy5uYXZpZ2F0aW9uSXRlbXMubGVuZ3RoIC0gMV0ua2V5c1ZhbHVlcyA9IHF1ZXJ5Q29uZi5rZXlzVmFsdWVzO1xuICAgICAgICBkZWxldGUgcXVlcnlDb25mLmtleXNWYWx1ZXM7XG4gICAgICAgIHRoaXMubmF2aWdhdGlvbkl0ZW1zW3RoaXMubmF2aWdhdGlvbkl0ZW1zLmxlbmd0aCAtIDFdLnF1ZXJ5Q29uZmlndXJhdGlvbiA9IE9iamVjdC5rZXlzKHF1ZXJ5Q29uZikubGVuZ3RoID4gMCA/IHF1ZXJ5Q29uZiA6IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLnN0b3JlTmF2aWdhdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRTdG9yZWREYXRhKCk6IGFueVtdIHtcbiAgICBjb25zdCBzdG9yYWdlRGF0YTogYW55ID0gdGhpcy5sb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldENvbXBvbmVudFN0b3JhZ2UodGhpcyk7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgT2JqZWN0LmtleXMoc3RvcmFnZURhdGEpLmZvckVhY2goa2V5ID0+IHJlc3VsdC5wdXNoKG5ldyBPTmF2aWdhdGlvbkl0ZW0oc3RvcmFnZURhdGFba2V5XSkpKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZ2V0UHJldmlvdXNSb3V0ZURhdGEoKTogT05hdmlnYXRpb25JdGVtIHtcbiAgICBsZXQgcmVzdWx0OiBPTmF2aWdhdGlvbkl0ZW07XG4gICAgY29uc3QgbGVuID0gdGhpcy5uYXZpZ2F0aW9uSXRlbXMubGVuZ3RoO1xuICAgIGlmIChsZW4gPj0gMikge1xuICAgICAgcmVzdWx0ID0gdGhpcy5uYXZpZ2F0aW9uSXRlbXNbbGVuIC0gMl07XG4gICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC5mb3JtUm91dGVzICYmIHJlc3VsdC5mb3JtUm91dGVzLm1haW5Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCAmJiB0aGlzLm5hdmlnYXRpb25JdGVtc1tsZW4gLSAzXSkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLm5hdmlnYXRpb25JdGVtc1tsZW4gLSAzXTtcbiAgICAgICAgaWYgKHBhcmVudC5pc01haW5Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCgpKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcGFyZW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBtYWluIG5hdmlnYXRpb24gcm91dGUgZGF0YSB0aGF0IG1hdGNoZXMgdGhlIG1vc3Qgd2l0aCB0aGUgY3VycmVudCByb3V0ZVxuICAgKi9cbiAgZ2V0TGFzdE1haW5OYXZpZ2F0aW9uUm91dGVEYXRhKCk6IE9OYXZpZ2F0aW9uSXRlbSB7XG4gICAgY29uc3Qgcm91dGVNYXRjaGVzID0gW107XG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLm5hdmlnYXRpb25JdGVtcy5zbGljZSgpLnJldmVyc2UoKVxuICAgICAgLm1hcCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICBsZXQgY3VycmVudExvY2F0aW9uID0gdGhpcy5sb2NhdGlvbi5wYXRoKCkuc3Vic3RyKDEpO1xuICAgICAgICBpZiAoY3VycmVudExvY2F0aW9uLmluY2x1ZGVzKCc/JykpIHtcbiAgICAgICAgICBjdXJyZW50TG9jYXRpb24gPSBjdXJyZW50TG9jYXRpb24uc3Vic3RyaW5nKDAsIGN1cnJlbnRMb2NhdGlvbi5pbmRleE9mKCc/JykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tcGFyZSBjdXJyZW50IHJvdXRlIHdpdGggaXRlbSByb3V0ZSBhbmQgY291bnQgc2VnbWVudCBtYXRjaGVzXG4gICAgICAgIGNvbnN0IGFycjEgPSBpdGVtLnVybC5zdWJzdHIoMSkuc3BsaXQoJy8nKTtcbiAgICAgICAgY29uc3QgYXJyMiA9IGN1cnJlbnRMb2NhdGlvbi5zcGxpdCgnLycpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcbiAgICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDw9IGFycjEubGVuZ3RoICYmIGluZGV4IDw9IGFycjIubGVuZ3RoKSB7XG4gICAgICAgICAgcm91dGVNYXRjaGVzW2ldID0gKGFycjFbaW5kZXhdID09PSBhcnIyW2luZGV4XSkgPyByZXN1bHQrKyA6IHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSk7XG5cbiAgICBsZXQgbWF4TWF0Y2hlcyA9IHJvdXRlTWF0Y2hlcy5yZWR1Y2UoKGEsIGIpID0+IE1hdGgubWF4KGEsIGIpKTtcbiAgICBjb25zdCBsYXN0TmF2SXRlbSA9IHRoaXMubmF2aWdhdGlvbkl0ZW1zW3RoaXMubmF2aWdhdGlvbkl0ZW1zLmxlbmd0aCAtIDFdO1xuICAgIGlmICghbGFzdE5hdkl0ZW0uaXNNYWluTmF2aWdhdGlvbkNvbXBvbmVudCgpICYmICFsYXN0TmF2SXRlbS5pc01haW5Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCgpKSB7XG4gICAgICBtYXhNYXRjaGVzLS07XG4gICAgfVxuICAgIGxldCBpdGVtUmVzdWx0ID0gdm9pZCAwO1xuICAgIHdoaWxlICghaXRlbVJlc3VsdCAmJiBtYXhNYXRjaGVzID49IDApIHtcbiAgICAgIGl0ZW1SZXN1bHQgPSBpdGVtcy5maW5kKChpdGVtLCBpKSA9PiAoaXRlbS5pc01haW5OYXZpZ2F0aW9uQ29tcG9uZW50KCkgfHwgaXRlbS5pc01haW5Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCgpKSAmJiByb3V0ZU1hdGNoZXNbaV0gPT09IG1heE1hdGNoZXMpO1xuICAgICAgbWF4TWF0Y2hlcy0tO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbVJlc3VsdDtcbiAgfVxuXG4gIHJlbW92ZUxhc3RJdGVtKCkge1xuICAgIHRoaXMubmF2aWdhdGlvbkl0ZW1zLnBvcCgpO1xuICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uKCk7XG4gIH1cblxuICByZW1vdmVMYXN0SXRlbXNVbnRpbE1haW4oKSB7XG4gICAgY29uc3QgbGFzdE1haW4gPSB0aGlzLmdldExhc3RNYWluTmF2aWdhdGlvblJvdXRlRGF0YSgpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQobGFzdE1haW4pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5uYXZpZ2F0aW9uSXRlbXMuaW5kZXhPZihsYXN0TWFpbik7XG4gICAgdGhpcy5uYXZpZ2F0aW9uSXRlbXMgPSB0aGlzLm5hdmlnYXRpb25JdGVtcy5zbGljZSgwLCBpbmRleCArIDEpO1xuICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc0N1cnJlbnRSb3V0ZShyb3V0ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgbGV0IGN1cnJlbnRSb3V0ZSA9IHRoaXMucm91dGVyLnJvdXRlclN0YXRlLnNuYXBzaG90LnVybDtcbiAgICBjdXJyZW50Um91dGUgPSBjdXJyZW50Um91dGUuc3BsaXQoJz8nKVswXTtcbiAgICByZXR1cm4gcm91dGUgPT09IGN1cnJlbnRSb3V0ZTtcbiAgfVxuXG4gIGdldExhc3RJdGVtKCk6IE9OYXZpZ2F0aW9uSXRlbSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodGhpcy5uYXZpZ2F0aW9uSXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5uYXZpZ2F0aW9uSXRlbXNbdGhpcy5uYXZpZ2F0aW9uSXRlbXMubGVuZ3RoIC0gMV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBkZWxldGVBY3RpdmVGb3JtTW9kZShhcmc6IE9OYXZpZ2F0aW9uSXRlbSkge1xuICAgIGFyZy5kZWxldGVBY3RpdmVGb3JtTW9kZSgpO1xuICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uKCk7XG4gIH1cblxufVxuIl19