import * as tslib_1 from "tslib";
import { SelectionModel } from '@angular/cdk/collections';
import { forwardRef, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OSearchInputComponent } from '../components/input/search-input/o-search-input.component';
import { InputConverter } from '../decorators/input-converter';
import { OFormLayoutDialogComponent } from '../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';
import { NavigationService } from '../services/navigation.service';
import { PermissionsService } from '../services/permissions/permissions.service';
import { OTranslateService } from '../services/translate/o-translate.service';
import { Codes } from '../util/codes';
import { FilterExpressionUtils } from '../util/filter-expression.utils';
import { Util } from '../util/util';
import { DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT, OServiceBaseComponent } from './o-service-base-component.class';
export var DEFAULT_INPUTS_O_SERVICE_COMPONENT = tslib_1.__spread(DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT, [
    '_title: title',
    'ovisible: visible',
    'enabled',
    'controls',
    'detailMode: detail-mode',
    'detailFormRoute: detail-form-route',
    'recursiveDetail: recursive-detail',
    'detailButtonInRow: detail-button-in-row',
    'detailButtonInRowIcon: detail-button-in-row-icon',
    'editFormRoute: edit-form-route',
    'recursiveEdit: recursive-edit',
    'editButtonInRow: edit-button-in-row',
    'editButtonInRowIcon: edit-button-in-row-icon',
    'insertButton: insert-button',
    'rowHeight : row-height',
    'insertFormRoute: insert-form-route',
    'recursiveInsert: recursive-insert',
    'filterCaseSensitive: filter-case-sensitive',
    'quickFilter: quick-filter',
]);
var OServiceComponent = (function (_super) {
    tslib_1.__extends(OServiceComponent, _super);
    function OServiceComponent(injector, elRef, form) {
        var _this = _super.call(this, injector) || this;
        _this.elRef = elRef;
        _this.form = form;
        _this.ovisible = true;
        _this.oenabled = true;
        _this.controls = true;
        _this.detailMode = Codes.DETAIL_MODE_CLICK;
        _this.recursiveDetail = false;
        _this.detailButtonInRow = false;
        _this.detailButtonInRowIcon = Codes.DETAIL_ICON;
        _this.recursiveEdit = false;
        _this.editButtonInRow = false;
        _this.editButtonInRowIcon = Codes.EDIT_ICON;
        _this._rowHeight = Codes.DEFAULT_ROW_HEIGHT;
        _this.rowHeightSubject = new BehaviorSubject(_this._rowHeight);
        _this.rowHeightObservable = _this.rowHeightSubject.asObservable();
        _this.recursiveInsert = false;
        _this.filterCaseSensitive = false;
        _this._quickFilter = true;
        _this.selection = new SelectionModel(true, []);
        _this.permissionsService = _this.injector.get(PermissionsService);
        _this.translateService = _this.injector.get(OTranslateService);
        _this.navigationService = _this.injector.get(NavigationService);
        try {
            _this.formLayoutManager = _this.injector.get(OFormLayoutManagerComponent);
        }
        catch (e) {
        }
        try {
            _this.oFormLayoutDialog = _this.injector.get(OFormLayoutDialogComponent);
            _this.formLayoutManager = _this.oFormLayoutDialog.formLayoutManager;
        }
        catch (e) {
        }
        return _this;
    }
    Object.defineProperty(OServiceComponent.prototype, "title", {
        get: function () {
            if (Util.isDefined(this._title)) {
                return this.translateService.get(this._title);
            }
            return this._title;
        },
        set: function (val) {
            this._title = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OServiceComponent.prototype, "rowHeight", {
        get: function () {
            return this._rowHeight;
        },
        set: function (value) {
            this._rowHeight = value ? value.toLowerCase() : value;
            if (!Codes.isValidRowHeight(this._rowHeight)) {
                this._rowHeight = Codes.DEFAULT_ROW_HEIGHT;
            }
            this.rowHeightSubject.next(this._rowHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OServiceComponent.prototype, "quickFilter", {
        get: function () {
            return this._quickFilter;
        },
        set: function (val) {
            var _this = this;
            val = Util.parseBoolean(String(val));
            this._quickFilter = val;
            if (val) {
                setTimeout(function () { return _this.registerQuickFilter(_this.searchInputComponent); }, 0);
            }
        },
        enumerable: true,
        configurable: true
    });
    OServiceComponent.prototype.initialize = function () {
        var _this = this;
        if (this.formLayoutManager && this.formLayoutManager.isTabMode() && this.formLayoutManager.oTabGroup) {
            this.formLayoutManagerTabIndex = this.formLayoutManager.oTabGroup.data.length;
            this.tabsSubscriptions = this.formLayoutManager.oTabGroup.onSelectedTabChange.subscribe(function () {
                if (_this.formLayoutManagerTabIndex !== _this.formLayoutManager.oTabGroup.selectedTabIndex) {
                    _this.updateStateStorage();
                    _this.alreadyStored = false;
                }
            });
            this.tabsSubscriptions.add(this.formLayoutManager.oTabGroup.onCloseTab.subscribe(function () {
                if (_this.formLayoutManagerTabIndex === _this.formLayoutManager.oTabGroup.selectedTabIndex) {
                    _this.updateStateStorage();
                }
            }));
        }
        _super.prototype.initialize.call(this);
        if (this.detailButtonInRow || this.editButtonInRow) {
            this.detailMode = Codes.DETAIL_MODE_NONE;
        }
    };
    OServiceComponent.prototype.afterViewInit = function () {
        var _this = this;
        _super.prototype.afterViewInit.call(this);
        if (this.elRef) {
            this.elRef.nativeElement.removeAttribute('title');
        }
        if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
            this.onTriggerUpdateSubscription = this.formLayoutManager.onTriggerUpdate.subscribe(function () {
                _this.reloadData();
            });
        }
    };
    OServiceComponent.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        if (this.onTriggerUpdateSubscription) {
            this.onTriggerUpdateSubscription.unsubscribe();
        }
        if (this.tabsSubscriptions) {
            this.tabsSubscriptions.unsubscribe();
        }
    };
    OServiceComponent.prototype.isVisible = function () {
        return this.ovisible;
    };
    OServiceComponent.prototype.hasControls = function () {
        return this.controls;
    };
    OServiceComponent.prototype.hasTitle = function () {
        return this.title !== undefined;
    };
    OServiceComponent.prototype.getSelectedItems = function () {
        return this.selection.selected;
    };
    OServiceComponent.prototype.clearSelection = function () {
        this.selection.clear();
    };
    OServiceComponent.prototype.setSelected = function (item) {
        this.selection.toggle(item);
    };
    OServiceComponent.prototype.navigateToDetail = function (route, qParams, relativeTo) {
        var extras = {
            relativeTo: relativeTo
        };
        if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
            qParams[Codes.IGNORE_CAN_DEACTIVATE] = true;
            this.formLayoutManager.setAsActiveFormLayoutManager();
        }
        extras[Codes.QUERY_PARAMS] = qParams;
        this.router.navigate(route, extras);
    };
    OServiceComponent.prototype.insertDetail = function () {
        if (this.oFormLayoutDialog) {
            console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
            return;
        }
        var route = this.getInsertRoute();
        this.addFormLayoutManagerRoute(route);
        if (route.length > 0) {
            var relativeTo = this.recursiveInsert ? this.actRoute.parent : this.actRoute;
            var qParams = {};
            this.navigateToDetail(route, qParams, relativeTo);
        }
    };
    OServiceComponent.prototype.viewDetail = function (item) {
        if (this.oFormLayoutDialog) {
            console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
            return;
        }
        var route = this.getItemModeRoute(item, 'detailFormRoute');
        this.addFormLayoutManagerRoute(route);
        if (route.length > 0) {
            var qParams = Codes.getIsDetailObject();
            var relativeTo = this.recursiveDetail ? this.actRoute.parent : this.actRoute;
            this.navigateToDetail(route, qParams, relativeTo);
        }
    };
    OServiceComponent.prototype.editDetail = function (item) {
        if (this.oFormLayoutDialog) {
            console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
            return;
        }
        var route = this.getItemModeRoute(item, 'editFormRoute');
        this.addFormLayoutManagerRoute(route);
        if (route.length > 0) {
            var qParams = Codes.getIsDetailObject();
            var relativeTo = this.recursiveEdit ? this.actRoute.parent : this.actRoute;
            this.navigateToDetail(route, qParams, relativeTo);
        }
    };
    OServiceComponent.prototype.addFormLayoutManagerRoute = function (routeArr) {
        if (this.formLayoutManager && routeArr.length > 0) {
            var compRoute = this.formLayoutManager.getRouteForComponent(this);
            if (compRoute && compRoute.length > 0) {
                routeArr.unshift.apply(routeArr, tslib_1.__spread(compRoute));
            }
        }
    };
    OServiceComponent.prototype.getEncodedParentKeys = function () {
        var encoded;
        if (Object.keys(this._pKeysEquiv).length > 0) {
            var pKeys = this.getParentKeysValues();
            if (Object.keys(pKeys).length > 0) {
                encoded = Util.encodeParentKeys(pKeys);
            }
        }
        return encoded;
    };
    OServiceComponent.prototype.getInsertRoute = function () {
        var route = [];
        if (Util.isDefined(this.detailFormRoute)) {
            route.push(this.detailFormRoute);
        }
        var insertRoute = Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE;
        route.push(insertRoute);
        var encodedParentKeys = this.getEncodedParentKeys();
        if (Util.isDefined(encodedParentKeys)) {
            var routeObj = {};
            routeObj[Codes.PARENT_KEYS_KEY] = encodedParentKeys;
            route.push(routeObj);
        }
        if (route.length > 0) {
            this.storeNavigationFormRoutes('insertFormRoute');
        }
        return route;
    };
    OServiceComponent.prototype.getItemModeRoute = function (item, modeRoute) {
        var result = this.getRouteOfSelectedRow(item);
        if (result.length > 0) {
            if (Util.isDefined(this.detailFormRoute)) {
                result.unshift(this.detailFormRoute);
            }
            if (modeRoute === 'editFormRoute') {
                result.push(this.editFormRoute || Codes.DEFAULT_EDIT_ROUTE);
            }
        }
        if (result.length > 0 && !this.oFormLayoutDialog) {
            this.storeNavigationFormRoutes(modeRoute, this.getQueryConfiguration());
        }
        return result;
    };
    OServiceComponent.prototype.getQueryConfiguration = function () {
        var result = {
            keysValues: this.getKeysValues()
        };
        if (this.pageable) {
            result = Object.assign({
                serviceType: this.serviceType,
                queryArguments: this.queryArguments,
                entity: this.entity,
                service: this.service,
                queryMethod: this.pageable ? this.paginatedQueryMethod : this.queryMethod,
                totalRecordsNumber: this.getTotalRecordsNumber(),
                queryRows: this.queryRows,
                queryRecordOffset: Math.max(this.state.queryRecordOffset - this.queryRows, 0)
            }, result);
        }
        return result;
    };
    OServiceComponent.prototype.getRouteOfSelectedRow = function (item) {
        var route = [];
        if (Util.isObject(item)) {
            this.keysArray.forEach(function (key) {
                if (Util.isDefined(item[key])) {
                    route.push(item[key]);
                }
            });
        }
        return route;
    };
    OServiceComponent.prototype.deleteLocalItems = function () {
        var selectedItems = this.getSelectedItems();
        for (var i = 0; i < selectedItems.length; ++i) {
            var selectedItem = selectedItems[i];
            var selectedItemKv = {};
            for (var k = 0; k < this.keysArray.length; ++k) {
                var key = this.keysArray[k];
                selectedItemKv[key] = selectedItem[key];
            }
            for (var j = this.dataArray.length - 1; j >= 0; --j) {
                var item = this.dataArray[j];
                var itemKv = {};
                for (var k = 0; k < this.keysArray.length; ++k) {
                    var key = this.keysArray[k];
                    itemKv[key] = item[key];
                }
                var found = false;
                for (var k in selectedItemKv) {
                    if (selectedItemKv.hasOwnProperty(k)) {
                        found = itemKv.hasOwnProperty(k) && (selectedItemKv[k] === itemKv[k]);
                    }
                }
                if (found) {
                    this.dataArray.splice(j, 1);
                    break;
                }
            }
        }
        this.clearSelection();
    };
    OServiceComponent.prototype.reinitialize = function (options) {
        if (options && Object.keys(options).length) {
            var clonedOpts = Object.assign({}, options);
            if (clonedOpts.hasOwnProperty('entity')) {
                this.entity = clonedOpts.entity;
                if (this.oattrFromEntity) {
                    this.oattr = undefined;
                }
                delete clonedOpts.entity;
            }
            for (var prop in clonedOpts) {
                if (clonedOpts.hasOwnProperty(prop)) {
                    this[prop] = clonedOpts[prop];
                }
            }
            this.destroy();
            this.initialize();
        }
    };
    OServiceComponent.prototype.setFilterBuilder = function (filterBuilder) {
        this.filterBuilder = filterBuilder;
    };
    OServiceComponent.prototype.getComponentFilter = function (existingFilter) {
        if (existingFilter === void 0) { existingFilter = {}; }
        var filter = _super.prototype.getComponentFilter.call(this, existingFilter);
        var quickFilterExpr = this.getQuickFilterExpression();
        var filterBuilderExpr = this.getFilterBuilderExpression();
        var complexExpr = quickFilterExpr || filterBuilderExpr;
        if (quickFilterExpr && filterBuilderExpr) {
            complexExpr = FilterExpressionUtils.buildComplexExpression(quickFilterExpr, filterBuilderExpr, FilterExpressionUtils.OP_AND);
        }
        if (complexExpr && !Util.isDefined(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY])) {
            filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = complexExpr;
        }
        else if (complexExpr) {
            filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] =
                FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY], complexExpr, FilterExpressionUtils.OP_AND);
        }
        return filter;
    };
    OServiceComponent.prototype.getQuickFilterExpression = function () {
        if (this.pageable && Util.isDefined(this.quickFilterComponent)) {
            return this.quickFilterComponent.filterExpression;
        }
        return undefined;
    };
    OServiceComponent.prototype.getFilterBuilderExpression = function () {
        if (Util.isDefined(this.filterBuilder)) {
            return this.filterBuilder.getExpression();
        }
        return undefined;
    };
    OServiceComponent.prototype.storeNavigationFormRoutes = function (activeMode, queryConf) {
        var mainFormLayoutComp = this.formLayoutManager ? Util.isDefined(this.formLayoutManager.isMainComponent(this)) : undefined;
        this.navigationService.storeFormRoutes({
            mainFormLayoutManagerComponent: mainFormLayoutComp,
            isMainNavigationComponent: true,
            detailFormRoute: this.detailFormRoute,
            editFormRoute: this.editFormRoute,
            insertFormRoute: Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE
        }, activeMode, queryConf);
    };
    OServiceComponent.prototype.saveDataNavigationInLocalStorage = function () {
    };
    OServiceComponent.prototype.getKeysValues = function () {
        var data = this.dataArray;
        var self = this;
        return data.map(function (row) {
            var obj = {};
            self.keysArray.forEach(function (key) {
                if (row[key] !== undefined) {
                    obj[key] = row[key];
                }
            });
            return obj;
        });
    };
    OServiceComponent.prototype.getRouteKey = function () {
        var route = '';
        if (this.formLayoutManager && !this.formLayoutManager.isMainComponent(this)) {
            route = this.router.url;
            var params = this.formLayoutManager.getParams();
            if (params) {
                route += '/' + (Object.keys(params).join('/'));
            }
        }
        else {
            route = _super.prototype.getRouteKey.call(this);
        }
        return route;
    };
    Object.defineProperty(OServiceComponent.prototype, "elementRef", {
        get: function () {
            return this.elRef;
        },
        enumerable: true,
        configurable: true
    });
    OServiceComponent.prototype.initializeState = function () {
        var routeKey = _super.prototype.getRouteKey.call(this);
        if (this.formLayoutManager && this.formLayoutManager.isTabMode() && !this.formLayoutManager.isMainComponent(this)) {
            try {
                var params = this.formLayoutManager.oTabGroup.state.tabsData[0].params;
                if (params) {
                    routeKey = this.router.url;
                    routeKey += '/' + (Object.keys(params).join('/'));
                }
            }
            catch (e) {
            }
        }
        this.state = this.localStorageService.getComponentStorage(this, routeKey);
    };
    OServiceComponent.prototype.showCaseSensitiveCheckbox = function () {
        return !this.pageable;
    };
    OServiceComponent.prototype.registerQuickFilter = function (arg) {
        var _this = this;
        var quickFilter = arg;
        if (Util.isDefined(this.quickFilterComponent)) {
            return;
        }
        this.quickFilterComponent = quickFilter;
        if (Util.isDefined(this.quickFilterComponent)) {
            if (this.state.hasOwnProperty('filterValue')) {
                this.quickFilterComponent.setValue(this.state.filterValue);
            }
            if (this.state.hasOwnProperty('quickFilterActiveColumns')) {
                var parsedArr = Util.parseArray(this.state.quickFilterActiveColumns, true);
                this.quickFilterComponent.setActiveColumns(parsedArr);
            }
            this.quickFilterComponent.onSearch.subscribe(function (val) { return _this.filterData(val); });
        }
    };
    OServiceComponent.prototype.filterData = function (value, loadMore) {
    };
    OServiceComponent.prototype.isFilterCaseSensitive = function () {
        var useQuickFilterValue = Util.isDefined(this.quickFilterComponent) && this.showCaseSensitiveCheckbox();
        if (useQuickFilterValue) {
            return this.quickFilterComponent.filterCaseSensitive;
        }
        return this.filterCaseSensitive;
    };
    OServiceComponent.prototype.configureFilterValue = function (value) {
        var returnVal = value;
        if (value && value.length > 0) {
            if (!value.startsWith('*')) {
                returnVal = '*' + returnVal;
            }
            if (!value.endsWith('*')) {
                returnVal = returnVal + '*';
            }
        }
        return returnVal;
    };
    OServiceComponent.prototype.getQuickFilterValue = function () {
        var result = '';
        if (Util.isDefined(this.quickFilterComponent)) {
            return this.quickFilterComponent.getValue() || '';
        }
        return result;
    };
    OServiceComponent.prototype.getQuickFilterColumns = function () {
        var result = this.quickFilterColArray;
        if (Util.isDefined(this.quickFilterComponent)) {
            result = this.quickFilterComponent.getActiveColumns();
        }
        return result;
    };
    OServiceComponent.propDecorators = {
        searchInputComponent: [{ type: ViewChild, args: [(forwardRef(function () { return OSearchInputComponent; })), { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "ovisible", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "oenabled", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "controls", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "recursiveDetail", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "detailButtonInRow", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "recursiveEdit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "editButtonInRow", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "insertButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "recursiveInsert", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OServiceComponent.prototype, "filterCaseSensitive", void 0);
    return OServiceComponent;
}(OServiceBaseComponent));
export { OServiceComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFjLFVBQVUsRUFBWSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUUsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUduRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUNsRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDMUcsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDckcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDakYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFJOUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXBDLE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRWxILE1BQU0sQ0FBQyxJQUFNLGtDQUFrQyxvQkFDMUMsdUNBQXVDO0lBRTFDLGVBQWU7SUFHZixtQkFBbUI7SUFHbkIsU0FBUztJQUdULFVBQVU7SUFHVix5QkFBeUI7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U2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0b3IsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9GaWx0ZXJCdWlsZGVyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9maWx0ZXItYnVpbGRlci9vLWZpbHRlci1idWlsZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPU2VhcmNoSW5wdXRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2lucHV0L3NlYXJjaC1pbnB1dC9vLXNlYXJjaC1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL2xheW91dHMvZm9ybS1sYXlvdXQvZGlhbG9nL28tZm9ybS1sYXlvdXQtZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQgfSBmcm9tICcuLi9sYXlvdXRzL2Zvcm0tbGF5b3V0L28tZm9ybS1sYXlvdXQtbWFuYWdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tICcuLi90eXBlcy9leHByZXNzaW9uLnR5cGUnO1xuaW1wb3J0IHsgT0xpc3RJbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9vLWxpc3QtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZUluaXRpYWxpemF0aW9uT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL28tdGFibGUtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQkFTRV9DT01QT05FTlQsIE9TZXJ2aWNlQmFzZUNvbXBvbmVudCB9IGZyb20gJy4vby1zZXJ2aWNlLWJhc2UtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9CQVNFX0NPTVBPTkVOVCxcblxuICAnX3RpdGxlOiB0aXRsZScsXG5cbiAgLy8gdmlzaWJsZSBbbm98eWVzXTogdmlzaWJpbGl0eS4gRGVmYXVsdDogeWVzLlxuICAnb3Zpc2libGU6IHZpc2libGUnLFxuXG4gIC8vIGVuYWJsZWQgW25vfHllc106IGVkaXRhYmlsaXR5LiBEZWZhdWx0OiB5ZXMuXG4gICdlbmFibGVkJyxcblxuICAvLyBjb250cm9scyBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06XG4gICdjb250cm9scycsXG5cbiAgLy8gZGV0YWlsLW1vZGUgW25vbmV8Y2xpY2t8ZG91YmxlY2xpY2tdOiB3YXkgdG8gb3BlbiB0aGUgZGV0YWlsIGZvcm0gb2YgYSByb3cuIERlZmF1bHQ6ICdjbGljaycuXG4gICdkZXRhaWxNb2RlOiBkZXRhaWwtbW9kZScsXG5cbiAgLy8gZGV0YWlsLWZvcm0tcm91dGUgW3N0cmluZ106IHJvdXRlIG9mIGRldGFpbCBmb3JtLiBEZWZhdWx0OiAnZGV0YWlsJy5cbiAgJ2RldGFpbEZvcm1Sb3V0ZTogZGV0YWlsLWZvcm0tcm91dGUnLFxuXG4gIC8vIHJlY3Vyc2l2ZS1kZXRhaWwgW25vfHllc106IGRvIG5vdCBhcHBlbmQgZGV0YWlsIGtleXMgd2hlbiBuYXZpZ2F0ZSAob3ZlcndyaXRlIGN1cnJlbnQpLiBEZWZhdWx0OiBuby5cbiAgJ3JlY3Vyc2l2ZURldGFpbDogcmVjdXJzaXZlLWRldGFpbCcsXG5cbiAgLy8gZGV0YWlsLWJ1dHRvbi1pbi1yb3cgW25vfHllc106IGFkZGluZyBhIGJ1dHRvbiBpbiByb3cgZm9yIG9wZW5pbmcgZGV0YWlsIGZvcm0uIERlZmF1bHQ6IHllcy5cbiAgJ2RldGFpbEJ1dHRvbkluUm93OiBkZXRhaWwtYnV0dG9uLWluLXJvdycsXG5cbiAgLy8gZGV0YWlsLWJ1dHRvbi1pbi1yb3ctaWNvbiBbc3RyaW5nXTogbWF0ZXJpYWwgaWNvbi4gRGVmYXVsdDogbW9kZV9lZGl0LlxuICAnZGV0YWlsQnV0dG9uSW5Sb3dJY29uOiBkZXRhaWwtYnV0dG9uLWluLXJvdy1pY29uJyxcblxuICAvLyBlZGl0LWZvcm0tcm91dGUgW3N0cmluZ106IHJvdXRlIG9mIGVkaXQgZm9ybS4gRGVmYXVsdDogJ2VkaXQnLlxuICAnZWRpdEZvcm1Sb3V0ZTogZWRpdC1mb3JtLXJvdXRlJyxcblxuICAvLyByZWN1cnNpdmUtZWRpdCBbbm98eWVzXTogZG8gbm90IGFwcGVuZCBkZXRhaWwga2V5cyB3aGVuIG5hdmlnYXRlIChvdmVyd3JpdGUgY3VycmVudCkuIERlZmF1bHQ6IG5vLlxuICAncmVjdXJzaXZlRWRpdDogcmVjdXJzaXZlLWVkaXQnLFxuXG4gIC8vIGVkaXQtYnV0dG9uLWluLXJvdyBbbm98eWVzXTogYWRkaW5nIGEgYnV0dG9uIGluIHJvdyBmb3Igb3BlbmluZyBlZGl0aW9uIGZvcm0uIERlZmF1bHQ6IG5vLlxuICAnZWRpdEJ1dHRvbkluUm93OiBlZGl0LWJ1dHRvbi1pbi1yb3cnLFxuXG4gIC8vIGVkaXQtYnV0dG9uLWluLXJvdy1pY29uIFtzdHJpbmddOiBtYXRlcmlhbCBpY29uLiBEZWZhdWx0OiBzZWFyY2guXG4gICdlZGl0QnV0dG9uSW5Sb3dJY29uOiBlZGl0LWJ1dHRvbi1pbi1yb3ctaWNvbicsXG5cbiAgLy8gaW5zZXJ0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBpbnNlcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdpbnNlcnRCdXR0b246IGluc2VydC1idXR0b24nLFxuXG4gIC8vIHJvdy1oZWlnaHQgW3NtYWxsIHwgbWVkaXVtIHwgbGFyZ2VdXG4gICdyb3dIZWlnaHQgOiByb3ctaGVpZ2h0JyxcblxuICAvLyBpbnNlcnQtZm9ybS1yb3V0ZSBbc3RyaW5nXTogcm91dGUgb2YgaW5zZXJ0IGZvcm0uIERlZmF1bHQ6XG4gICdpbnNlcnRGb3JtUm91dGU6IGluc2VydC1mb3JtLXJvdXRlJyxcblxuICAvLyByZWN1cnNpdmUtaW5zZXJ0IFtub3x5ZXNdOiBkbyBub3QgYXBwZW5kIGluc2VydCBrZXlzIHdoZW4gbmF2aWdhdGUgKG92ZXJ3cml0ZSBjdXJyZW50KS4gRGVmYXVsdDogbm8uXG4gICdyZWN1cnNpdmVJbnNlcnQ6IHJlY3Vyc2l2ZS1pbnNlcnQnLFxuXG4gIC8vIGZpbHRlciBbeWVzfG5vfHRydWV8ZmFsc2VdOiB3aGV0aGVyIGZpbHRlciBpcyBjYXNlIHNlbnNpdGl2ZS4gRGVmYXVsdDogbm8uXG4gICdmaWx0ZXJDYXNlU2Vuc2l0aXZlOiBmaWx0ZXItY2FzZS1zZW5zaXRpdmUnLFxuXG4gIC8vIHF1aWNrLWZpbHRlciBbbm98eWVzXTogc2hvdyBxdWljayBmaWx0ZXIuIERlZmF1bHQ6IHllcy5cbiAgJ3F1aWNrRmlsdGVyOiBxdWljay1maWx0ZXInLFxuXTtcblxuZXhwb3J0IGNsYXNzIE9TZXJ2aWNlQ29tcG9uZW50IGV4dGVuZHMgT1NlcnZpY2VCYXNlQ29tcG9uZW50IHtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcblxuICAvKiBpbnB1dHMgdmFyaWFibGVzICovXG4gIHNldCB0aXRsZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdmFsO1xuICB9XG4gIGdldCB0aXRsZSgpOiBzdHJpbmcge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLl90aXRsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KHRoaXMuX3RpdGxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RpdGxlO1xuICB9XG4gIHByb3RlY3RlZCBfdGl0bGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG92aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIGNvbnRyb2xzOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGRldGFpbE1vZGU6IHN0cmluZyA9IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLO1xuICBwcm90ZWN0ZWQgZGV0YWlsRm9ybVJvdXRlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCByZWN1cnNpdmVEZXRhaWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgZGV0YWlsQnV0dG9uSW5Sb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZGV0YWlsQnV0dG9uSW5Sb3dJY29uOiBzdHJpbmcgPSBDb2Rlcy5ERVRBSUxfSUNPTjtcbiAgcHJvdGVjdGVkIGVkaXRGb3JtUm91dGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHJlY3Vyc2l2ZUVkaXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgZWRpdEJ1dHRvbkluUm93OiBib29sZWFuID0gZmFsc2U7XG4gIGVkaXRCdXR0b25JblJvd0ljb246IHN0cmluZyA9IENvZGVzLkVESVRfSUNPTjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5zZXJ0QnV0dG9uOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgX3Jvd0hlaWdodCA9IENvZGVzLkRFRkFVTFRfUk9XX0hFSUdIVDtcbiAgcHJvdGVjdGVkIHJvd0hlaWdodFN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0aGlzLl9yb3dIZWlnaHQpO1xuICBwdWJsaWMgcm93SGVpZ2h0T2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxzdHJpbmc+ID0gdGhpcy5yb3dIZWlnaHRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHNldCByb3dIZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9yb3dIZWlnaHQgPSB2YWx1ZSA/IHZhbHVlLnRvTG93ZXJDYXNlKCkgOiB2YWx1ZTtcbiAgICBpZiAoIUNvZGVzLmlzVmFsaWRSb3dIZWlnaHQodGhpcy5fcm93SGVpZ2h0KSkge1xuICAgICAgdGhpcy5fcm93SGVpZ2h0ID0gQ29kZXMuREVGQVVMVF9ST1dfSEVJR0hUO1xuICAgIH1cbiAgICB0aGlzLnJvd0hlaWdodFN1YmplY3QubmV4dCh0aGlzLl9yb3dIZWlnaHQpO1xuICB9XG4gIGdldCByb3dIZWlnaHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcm93SGVpZ2h0O1xuICB9XG4gIHByb3RlY3RlZCBpbnNlcnRGb3JtUm91dGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHJlY3Vyc2l2ZUluc2VydDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZmlsdGVyQ2FzZVNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3F1aWNrRmlsdGVyOiBib29sZWFuID0gdHJ1ZTtcbiAgZ2V0IHF1aWNrRmlsdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9xdWlja0ZpbHRlcjtcbiAgfVxuICBzZXQgcXVpY2tGaWx0ZXIodmFsOiBib29sZWFuKSB7XG4gICAgdmFsID0gVXRpbC5wYXJzZUJvb2xlYW4oU3RyaW5nKHZhbCkpO1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyID0gdmFsO1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWdpc3RlclF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoSW5wdXRDb21wb25lbnQpLCAwKTtcbiAgICB9XG4gIH1cbiAgLyogZW5kIG9mIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICBwdWJsaWMgZmlsdGVyQnVpbGRlcjogT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQ7XG4gIHB1YmxpYyBzZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uTW9kZWw8RWxlbWVudD4odHJ1ZSwgW10pO1xuXG4gIHByb3RlY3RlZCBvblRyaWdnZXJVcGRhdGVTdWJzY3JpcHRpb246IGFueTtcbiAgcHJvdGVjdGVkIGZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBmb3JtTGF5b3V0TWFuYWdlclRhYkluZGV4OiBudW1iZXI7XG4gIHB1YmxpYyBvRm9ybUxheW91dERpYWxvZzogT0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHRhYnNTdWJzY3JpcHRpb25zOiBhbnk7XG4gIHB1YmxpYyBxdWlja0ZpbHRlckNvbXBvbmVudDogT1NlYXJjaElucHV0Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKChmb3J3YXJkUmVmKCgpID0+IE9TZWFyY2hJbnB1dENvbXBvbmVudCkpLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIHNlYXJjaElucHV0Q29tcG9uZW50OiBPU2VhcmNoSW5wdXRDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBxdWlja0ZpbHRlckNvbEFycmF5OiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBmb3JtOiBPRm9ybUNvbXBvbmVudFxuICApIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyID0gdGhpcy5pbmplY3Rvci5nZXQoT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBubyBwYXJlbnQgZm9ybSBsYXlvdXQgbWFuYWdlclxuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5vRm9ybUxheW91dERpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50KTtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPSB0aGlzLm9Gb3JtTGF5b3V0RGlhbG9nLmZvcm1MYXlvdXRNYW5hZ2VyO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIG5vIHBhcmVudCBmb3JtIGxheW91dCBtYW5hZ2VyXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5pc1RhYk1vZGUoKSAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm9UYWJHcm91cCkge1xuXG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyVGFiSW5kZXggPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm9UYWJHcm91cC5kYXRhLmxlbmd0aDtcblxuICAgICAgdGhpcy50YWJzU3Vic2NyaXB0aW9ucyA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIub1RhYkdyb3VwLm9uU2VsZWN0ZWRUYWJDaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXJUYWJJbmRleCAhPT0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5vVGFiR3JvdXAuc2VsZWN0ZWRUYWJJbmRleCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gICAgICAgICAgLy8gd2hlbiB0aGUgc3RvcmFnZSBpcyB1cGRhdGVkIGJlY2F1c2UgYSBmb3JtIGxheW91dCBtYW5hZ2VyIHRhYiBjaGFuZ2VcbiAgICAgICAgICAvLyB0aGUgYWxyZWFkeVN0b3JlZCBjb250cm9sIHZhcmlhYmxlIGlzIGNoYW5nZWQgdG8gaXRzIGluaXRpYWwgdmFsdWVcbiAgICAgICAgICB0aGlzLmFscmVhZHlTdG9yZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudGFic1N1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZm9ybUxheW91dE1hbmFnZXIub1RhYkdyb3VwLm9uQ2xvc2VUYWIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXJUYWJJbmRleCA9PT0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5vVGFiR3JvdXAuc2VsZWN0ZWRUYWJJbmRleCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIGlmICh0aGlzLmRldGFpbEJ1dHRvbkluUm93IHx8IHRoaXMuZWRpdEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLmRldGFpbE1vZGUgPSBDb2Rlcy5ERVRBSUxfTU9ERV9OT05FO1xuICAgIH1cblxuICB9XG5cbiAgcHVibGljIGFmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIuYWZ0ZXJWaWV3SW5pdCgpO1xuICAgIGlmICh0aGlzLmVsUmVmKSB7XG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0aXRsZScpO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzTWFpbkNvbXBvbmVudCh0aGlzKSkge1xuICAgICAgdGhpcy5vblRyaWdnZXJVcGRhdGVTdWJzY3JpcHRpb24gPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm9uVHJpZ2dlclVwZGF0ZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5vblRyaWdnZXJVcGRhdGVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMub25UcmlnZ2VyVXBkYXRlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRhYnNTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnRhYnNTdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdmlzaWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNDb250cm9scygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scztcbiAgfVxuXG4gIHB1YmxpYyBoYXNUaXRsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50aXRsZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldFNlbGVjdGVkSXRlbXMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZDtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcigpO1xuICB9XG5cbiAgcHVibGljIHNldFNlbGVjdGVkKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uLnRvZ2dsZShpdGVtKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBuYXZpZ2F0ZVRvRGV0YWlsKHJvdXRlOiBhbnlbXSwgcVBhcmFtczogYW55LCByZWxhdGl2ZVRvOiBBY3RpdmF0ZWRSb3V0ZSk6IHZvaWQge1xuICAgIGNvbnN0IGV4dHJhcyA9IHtcbiAgICAgIHJlbGF0aXZlVG86IHJlbGF0aXZlVG9cbiAgICB9O1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyICYmIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuaXNNYWluQ29tcG9uZW50KHRoaXMpKSB7XG4gICAgICBxUGFyYW1zW0NvZGVzLklHTk9SRV9DQU5fREVBQ1RJVkFURV0gPSB0cnVlO1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5zZXRBc0FjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyKCk7XG4gICAgfVxuICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gcVBhcmFtcztcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSwgZXh0cmFzKTtcbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnREZXRhaWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub0Zvcm1MYXlvdXREaWFsb2cpIHtcbiAgICAgIGNvbnNvbGUud2FybignTmF2aWdhdGlvbiBpcyBub3QgYXZhaWxhYmxlIHlldCBpbiBhIGZvcm0gbGF5b3V0IG1hbmFnZXIgd2l0aCBtb2RlPVwiZGlhbG9nXCInKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLmdldEluc2VydFJvdXRlKCk7XG4gICAgdGhpcy5hZGRGb3JtTGF5b3V0TWFuYWdlclJvdXRlKHJvdXRlKTtcbiAgICBpZiAocm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVUbyA9IHRoaXMucmVjdXJzaXZlSW5zZXJ0ID8gdGhpcy5hY3RSb3V0ZS5wYXJlbnQgOiB0aGlzLmFjdFJvdXRlO1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHt9O1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvRGV0YWlsKHJvdXRlLCBxUGFyYW1zLCByZWxhdGl2ZVRvKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlld0RldGFpbChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vRm9ybUxheW91dERpYWxvZykge1xuICAgICAgY29uc29sZS53YXJuKCdOYXZpZ2F0aW9uIGlzIG5vdCBhdmFpbGFibGUgeWV0IGluIGEgZm9ybSBsYXlvdXQgbWFuYWdlciB3aXRoIG1vZGU9XCJkaWFsb2dcIicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0SXRlbU1vZGVSb3V0ZShpdGVtLCAnZGV0YWlsRm9ybVJvdXRlJyk7XG4gICAgdGhpcy5hZGRGb3JtTGF5b3V0TWFuYWdlclJvdXRlKHJvdXRlKTtcbiAgICBpZiAocm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IENvZGVzLmdldElzRGV0YWlsT2JqZWN0KCk7XG4gICAgICBjb25zdCByZWxhdGl2ZVRvID0gdGhpcy5yZWN1cnNpdmVEZXRhaWwgPyB0aGlzLmFjdFJvdXRlLnBhcmVudCA6IHRoaXMuYWN0Um91dGU7XG4gICAgICB0aGlzLm5hdmlnYXRlVG9EZXRhaWwocm91dGUsIHFQYXJhbXMsIHJlbGF0aXZlVG8pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlZGl0RGV0YWlsKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9Gb3JtTGF5b3V0RGlhbG9nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ05hdmlnYXRpb24gaXMgbm90IGF2YWlsYWJsZSB5ZXQgaW4gYSBmb3JtIGxheW91dCBtYW5hZ2VyIHdpdGggbW9kZT1cImRpYWxvZ1wiJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJvdXRlID0gdGhpcy5nZXRJdGVtTW9kZVJvdXRlKGl0ZW0sICdlZGl0Rm9ybVJvdXRlJyk7XG4gICAgdGhpcy5hZGRGb3JtTGF5b3V0TWFuYWdlclJvdXRlKHJvdXRlKTtcbiAgICBpZiAocm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IENvZGVzLmdldElzRGV0YWlsT2JqZWN0KCk7XG4gICAgICBjb25zdCByZWxhdGl2ZVRvID0gdGhpcy5yZWN1cnNpdmVFZGl0ID8gdGhpcy5hY3RSb3V0ZS5wYXJlbnQgOiB0aGlzLmFjdFJvdXRlO1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvRGV0YWlsKHJvdXRlLCBxUGFyYW1zLCByZWxhdGl2ZVRvKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkRm9ybUxheW91dE1hbmFnZXJSb3V0ZShyb3V0ZUFycjogYW55W10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiByb3V0ZUFyci5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjb21wUm91dGUgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldFJvdXRlRm9yQ29tcG9uZW50KHRoaXMpO1xuICAgICAgaWYgKGNvbXBSb3V0ZSAmJiBjb21wUm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgICByb3V0ZUFyci51bnNoaWZ0KC4uLmNvbXBSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEVuY29kZWRQYXJlbnRLZXlzKCk6IHN0cmluZyB7XG4gICAgbGV0IGVuY29kZWQ6IHN0cmluZztcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fcEtleXNFcXVpdikubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcEtleXMgPSB0aGlzLmdldFBhcmVudEtleXNWYWx1ZXMoKTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhwS2V5cykubGVuZ3RoID4gMCkge1xuICAgICAgICBlbmNvZGVkID0gVXRpbC5lbmNvZGVQYXJlbnRLZXlzKHBLZXlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuY29kZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0SW5zZXJ0Um91dGUoKTogYW55W10ge1xuICAgIGNvbnN0IHJvdXRlID0gW107XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZGV0YWlsRm9ybVJvdXRlKSkge1xuICAgICAgcm91dGUucHVzaCh0aGlzLmRldGFpbEZvcm1Sb3V0ZSk7XG4gICAgfVxuICAgIGNvbnN0IGluc2VydFJvdXRlID0gVXRpbC5pc0RlZmluZWQodGhpcy5pbnNlcnRGb3JtUm91dGUpID8gdGhpcy5pbnNlcnRGb3JtUm91dGUgOiBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURTtcbiAgICByb3V0ZS5wdXNoKGluc2VydFJvdXRlKTtcbiAgICAvLyBhZGRpbmcgcGFyZW50LWtleXMgaW5mby4uLlxuICAgIGNvbnN0IGVuY29kZWRQYXJlbnRLZXlzID0gdGhpcy5nZXRFbmNvZGVkUGFyZW50S2V5cygpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlbmNvZGVkUGFyZW50S2V5cykpIHtcbiAgICAgIGNvbnN0IHJvdXRlT2JqID0ge307XG4gICAgICByb3V0ZU9ialtDb2Rlcy5QQVJFTlRfS0VZU19LRVldID0gZW5jb2RlZFBhcmVudEtleXM7XG4gICAgICByb3V0ZS5wdXNoKHJvdXRlT2JqKTtcbiAgICB9XG4gICAgaWYgKHJvdXRlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uRm9ybVJvdXRlcygnaW5zZXJ0Rm9ybVJvdXRlJyk7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJdGVtTW9kZVJvdXRlKGl0ZW06IGFueSwgbW9kZVJvdXRlOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRSb3V0ZU9mU2VsZWN0ZWRSb3coaXRlbSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5kZXRhaWxGb3JtUm91dGUpKSB7XG4gICAgICAgIHJlc3VsdC51bnNoaWZ0KHRoaXMuZGV0YWlsRm9ybVJvdXRlKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlUm91dGUgPT09ICdlZGl0Rm9ybVJvdXRlJykge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmVkaXRGb3JtUm91dGUgfHwgQ29kZXMuREVGQVVMVF9FRElUX1JPVVRFKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmICF0aGlzLm9Gb3JtTGF5b3V0RGlhbG9nKSB7XG4gICAgICB0aGlzLnN0b3JlTmF2aWdhdGlvbkZvcm1Sb3V0ZXMobW9kZVJvdXRlLCB0aGlzLmdldFF1ZXJ5Q29uZmlndXJhdGlvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRRdWVyeUNvbmZpZ3VyYXRpb24oKTogYW55IHtcbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAga2V5c1ZhbHVlczogdGhpcy5nZXRLZXlzVmFsdWVzKClcbiAgICB9O1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICByZXN1bHQgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgc2VydmljZVR5cGU6IHRoaXMuc2VydmljZVR5cGUsXG4gICAgICAgIHF1ZXJ5QXJndW1lbnRzOiB0aGlzLnF1ZXJ5QXJndW1lbnRzLFxuICAgICAgICBlbnRpdHk6IHRoaXMuZW50aXR5LFxuICAgICAgICBzZXJ2aWNlOiB0aGlzLnNlcnZpY2UsXG4gICAgICAgIHF1ZXJ5TWV0aG9kOiB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2QsXG4gICAgICAgIHRvdGFsUmVjb3Jkc051bWJlcjogdGhpcy5nZXRUb3RhbFJlY29yZHNOdW1iZXIoKSxcbiAgICAgICAgcXVlcnlSb3dzOiB0aGlzLnF1ZXJ5Um93cyxcbiAgICAgICAgcXVlcnlSZWNvcmRPZmZzZXQ6IE1hdGgubWF4KHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgLSB0aGlzLnF1ZXJ5Um93cywgMClcbiAgICAgIH0sIHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Um91dGVPZlNlbGVjdGVkUm93KGl0ZW06IGFueSk6IGFueVtdIHtcbiAgICBjb25zdCByb3V0ZSA9IFtdO1xuICAgIGlmIChVdGlsLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChpdGVtW2tleV0pKSB7XG4gICAgICAgICAgcm91dGUucHVzaChpdGVtW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRlbGV0ZUxvY2FsSXRlbXMoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtc1tpXTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUt2ID0ge307XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMua2V5c0FycmF5Lmxlbmd0aDsgKytrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c0FycmF5W2tdO1xuICAgICAgICBzZWxlY3RlZEl0ZW1LdltrZXldID0gc2VsZWN0ZWRJdGVtW2tleV07XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBqID0gdGhpcy5kYXRhQXJyYXkubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YUFycmF5W2pdO1xuICAgICAgICBjb25zdCBpdGVtS3YgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLmtleXNBcnJheS5sZW5ndGg7ICsraykge1xuICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c0FycmF5W2tdO1xuICAgICAgICAgIGl0ZW1LdltrZXldID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gc2VsZWN0ZWRJdGVtS3YpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtS3YuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGZvdW5kID0gaXRlbUt2Lmhhc093blByb3BlcnR5KGspICYmIChzZWxlY3RlZEl0ZW1LdltrXSA9PT0gaXRlbUt2W2tdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgdGhpcy5kYXRhQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyByZWluaXRpYWxpemUob3B0aW9uczogT0xpc3RJbml0aWFsaXphdGlvbk9wdGlvbnMgfCBPVGFibGVJbml0aWFsaXphdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAob3B0aW9ucyAmJiBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsb25lZE9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdlbnRpdHknKSkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IGNsb25lZE9wdHMuZW50aXR5O1xuICAgICAgICBpZiAodGhpcy5vYXR0ckZyb21FbnRpdHkpIHtcbiAgICAgICAgICB0aGlzLm9hdHRyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjbG9uZWRPcHRzLmVudGl0eTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBjbG9uZWRPcHRzKSB7XG4gICAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgdGhpc1twcm9wXSA9IGNsb25lZE9wdHNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGBvLWZpbHRlci1idWlsZGVyYCBjb21wb25lbnQgdGhhdCB0aGlzIGNvbXBvbmVudCB3aWxsIHVzZSB0byBmaWx0ZXIgaXRzIGRhdGEuXG4gICAqIEBwYXJhbSBmaWx0ZXJCdWlsZGVyIHRoZSBgby1maWx0ZXItYnVpbGRlcmAgY29tcG9uZW50LlxuICAgKi9cbiAgcHVibGljIHNldEZpbHRlckJ1aWxkZXIoZmlsdGVyQnVpbGRlcjogT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlckJ1aWxkZXIgPSBmaWx0ZXJCdWlsZGVyO1xuICB9XG5cbiAgcHVibGljIGdldENvbXBvbmVudEZpbHRlcihleGlzdGluZ0ZpbHRlcjogYW55ID0ge30pOiBhbnkge1xuICAgIGNvbnN0IGZpbHRlciA9IHN1cGVyLmdldENvbXBvbmVudEZpbHRlcihleGlzdGluZ0ZpbHRlcik7XG5cbiAgICBjb25zdCBxdWlja0ZpbHRlckV4cHIgPSB0aGlzLmdldFF1aWNrRmlsdGVyRXhwcmVzc2lvbigpO1xuICAgIGNvbnN0IGZpbHRlckJ1aWxkZXJFeHByID0gdGhpcy5nZXRGaWx0ZXJCdWlsZGVyRXhwcmVzc2lvbigpO1xuICAgIGxldCBjb21wbGV4RXhwciA9IHF1aWNrRmlsdGVyRXhwciB8fCBmaWx0ZXJCdWlsZGVyRXhwcjtcbiAgICBpZiAocXVpY2tGaWx0ZXJFeHByICYmIGZpbHRlckJ1aWxkZXJFeHByKSB7XG4gICAgICBjb21wbGV4RXhwciA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKHF1aWNrRmlsdGVyRXhwciwgZmlsdGVyQnVpbGRlckV4cHIsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9BTkQpO1xuICAgIH1cblxuICAgIGlmIChjb21wbGV4RXhwciAmJiAhVXRpbC5pc0RlZmluZWQoZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5CQVNJQ19FWFBSRVNTSU9OX0tFWV0pKSB7XG4gICAgICBmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkJBU0lDX0VYUFJFU1NJT05fS0VZXSA9IGNvbXBsZXhFeHByO1xuICAgIH0gZWxzZSBpZiAoY29tcGxleEV4cHIpIHtcbiAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuQkFTSUNfRVhQUkVTU0lPTl9LRVldID1cbiAgICAgICAgRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5CQVNJQ19FWFBSRVNTSU9OX0tFWV0sIGNvbXBsZXhFeHByLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFF1aWNrRmlsdGVyRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSkge1xuICAgICAgcmV0dXJuIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQuZmlsdGVyRXhwcmVzc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRGaWx0ZXJCdWlsZGVyRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICAvLyBBZGQgZmlsdGVyIGZyb20gby1maWx0ZXItYnVpbGRlciBjb21wb25lbnRcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5maWx0ZXJCdWlsZGVyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyQnVpbGRlci5nZXRFeHByZXNzaW9uKCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RvcmVOYXZpZ2F0aW9uRm9ybVJvdXRlcyhhY3RpdmVNb2RlOiBzdHJpbmcsIHF1ZXJ5Q29uZj86IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1haW5Gb3JtTGF5b3V0Q29tcCA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPyBVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzTWFpbkNvbXBvbmVudCh0aGlzKSkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5zdG9yZUZvcm1Sb3V0ZXMoe1xuICAgICAgbWFpbkZvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50OiBtYWluRm9ybUxheW91dENvbXAsXG4gICAgICBpc01haW5OYXZpZ2F0aW9uQ29tcG9uZW50OiB0cnVlLFxuICAgICAgZGV0YWlsRm9ybVJvdXRlOiB0aGlzLmRldGFpbEZvcm1Sb3V0ZSxcbiAgICAgIGVkaXRGb3JtUm91dGU6IHRoaXMuZWRpdEZvcm1Sb3V0ZSxcbiAgICAgIGluc2VydEZvcm1Sb3V0ZTogVXRpbC5pc0RlZmluZWQodGhpcy5pbnNlcnRGb3JtUm91dGUpID8gdGhpcy5pbnNlcnRGb3JtUm91dGUgOiBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURVxuICAgIH0sIGFjdGl2ZU1vZGUsIHF1ZXJ5Q29uZik7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTogdm9pZCB7XG4gICAgLy8gU2F2ZSBkYXRhIG9mIHRoZSBsaXN0IGluIG5hdmlnYXRpb24tZGF0YSBpbiB0aGUgbG9jYWxzdG9yYWdlXG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0S2V5c1ZhbHVlcygpOiBhbnlbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUFycmF5O1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBkYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIHNlbGYua2V5c0FycmF5LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAocm93W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG9ialtrZXldID0gcm93W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJvdXRlS2V5KCk6IHN0cmluZyB7XG4gICAgbGV0IHJvdXRlID0gJyc7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgIXRoaXMuZm9ybUxheW91dE1hbmFnZXIuaXNNYWluQ29tcG9uZW50KHRoaXMpKSB7XG4gICAgICByb3V0ZSA9IHRoaXMucm91dGVyLnVybDtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0UGFyYW1zKCk7XG4gICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgIHJvdXRlICs9ICcvJyArIChPYmplY3Qua2V5cyhwYXJhbXMpLmpvaW4oJy8nKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlID0gc3VwZXIuZ2V0Um91dGVLZXkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgZ2V0IGVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZWxSZWY7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgbGV0IHJvdXRlS2V5ID0gc3VwZXIuZ2V0Um91dGVLZXkoKTtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzVGFiTW9kZSgpICYmICF0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzTWFpbkNvbXBvbmVudCh0aGlzKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5vVGFiR3JvdXAuc3RhdGUudGFic0RhdGFbMF0ucGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgcm91dGVLZXkgPSB0aGlzLnJvdXRlci51cmw7XG4gICAgICAgICAgcm91dGVLZXkgKz0gJy8nICsgKE9iamVjdC5rZXlzKHBhcmFtcykuam9pbignLycpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvL1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBHZXQgcHJldmlvdXMgc3RhdHVzXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXRDb21wb25lbnRTdG9yYWdlKHRoaXMsIHJvdXRlS2V5KTtcblxuICB9XG5cbiAgcHVibGljIHNob3dDYXNlU2Vuc2l0aXZlQ2hlY2tib3goKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnBhZ2VhYmxlO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUXVpY2tGaWx0ZXIoYXJnOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBxdWlja0ZpbHRlciA9IChhcmcgYXMgT1NlYXJjaElucHV0Q29tcG9uZW50KTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkpIHtcbiAgICAgIC8vIGF2b2lkaW5nIHRvIHJlZ2lzdGVyIGEgcXVpY2tmaWx0ZXJjb21wb25lbnQgaWYgaXQgYWxyZWFkeSBleGlzdHMgb25lXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQgPSBxdWlja0ZpbHRlcjtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdmaWx0ZXJWYWx1ZScpKSB7XG4gICAgICAgIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQuc2V0VmFsdWUodGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgncXVpY2tGaWx0ZXJBY3RpdmVDb2x1bW5zJykpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkQXJyID0gVXRpbC5wYXJzZUFycmF5KHRoaXMuc3RhdGUucXVpY2tGaWx0ZXJBY3RpdmVDb2x1bW5zLCB0cnVlKTtcbiAgICAgICAgdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5zZXRBY3RpdmVDb2x1bW5zKHBhcnNlZEFycik7XG4gICAgICB9XG4gICAgICB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50Lm9uU2VhcmNoLnN1YnNjcmliZSh2YWwgPT4gdGhpcy5maWx0ZXJEYXRhKHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmaWx0ZXJEYXRhKHZhbHVlPzogc3RyaW5nLCBsb2FkTW9yZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAvL1xuICB9XG5cbiAgcHVibGljIGlzRmlsdGVyQ2FzZVNlbnNpdGl2ZSgpOiBib29sZWFuIHtcbiAgICBjb25zdCB1c2VRdWlja0ZpbHRlclZhbHVlID0gVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkgJiYgdGhpcy5zaG93Q2FzZVNlbnNpdGl2ZUNoZWNrYm94KCk7XG4gICAgaWYgKHVzZVF1aWNrRmlsdGVyVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50LmZpbHRlckNhc2VTZW5zaXRpdmU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmU7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlRmlsdGVyVmFsdWUodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJldHVyblZhbCA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIXZhbHVlLnN0YXJ0c1dpdGgoJyonKSkge1xuICAgICAgICByZXR1cm5WYWwgPSAnKicgKyByZXR1cm5WYWw7XG4gICAgICB9XG4gICAgICBpZiAoIXZhbHVlLmVuZHNXaXRoKCcqJykpIHtcbiAgICAgICAgcmV0dXJuVmFsID0gcmV0dXJuVmFsICsgJyonO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuVmFsO1xuICB9XG5cbiAgcHVibGljIGdldFF1aWNrRmlsdGVyVmFsdWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCByZXN1bHQgPSAnJztcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50LmdldFZhbHVlKCkgfHwgJyc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0UXVpY2tGaWx0ZXJDb2x1bW5zKCk6IHN0cmluZ1tdIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5xdWlja0ZpbHRlckNvbEFycmF5O1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5nZXRBY3RpdmVDb2x1bW5zKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==