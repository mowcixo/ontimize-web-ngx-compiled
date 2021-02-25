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
export const DEFAULT_INPUTS_O_SERVICE_COMPONENT = [
    ...DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT,
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
];
export class OServiceComponent extends OServiceBaseComponent {
    constructor(injector, elRef, form) {
        super(injector);
        this.elRef = elRef;
        this.form = form;
        this.ovisible = true;
        this.oenabled = true;
        this.controls = true;
        this.detailMode = Codes.DETAIL_MODE_CLICK;
        this.recursiveDetail = false;
        this.detailButtonInRow = false;
        this.detailButtonInRowIcon = Codes.DETAIL_ICON;
        this.recursiveEdit = false;
        this.editButtonInRow = false;
        this.editButtonInRowIcon = Codes.EDIT_ICON;
        this._rowHeight = Codes.DEFAULT_ROW_HEIGHT;
        this.rowHeightSubject = new BehaviorSubject(this._rowHeight);
        this.rowHeightObservable = this.rowHeightSubject.asObservable();
        this.recursiveInsert = false;
        this.filterCaseSensitive = false;
        this._quickFilter = true;
        this.selection = new SelectionModel(true, []);
        this.permissionsService = this.injector.get(PermissionsService);
        this.translateService = this.injector.get(OTranslateService);
        this.navigationService = this.injector.get(NavigationService);
        try {
            this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
        }
        catch (e) {
        }
        try {
            this.oFormLayoutDialog = this.injector.get(OFormLayoutDialogComponent);
            this.formLayoutManager = this.oFormLayoutDialog.formLayoutManager;
        }
        catch (e) {
        }
    }
    set title(val) {
        this._title = val;
    }
    get title() {
        if (Util.isDefined(this._title)) {
            return this.translateService.get(this._title);
        }
        return this._title;
    }
    set rowHeight(value) {
        this._rowHeight = value ? value.toLowerCase() : value;
        if (!Codes.isValidRowHeight(this._rowHeight)) {
            this._rowHeight = Codes.DEFAULT_ROW_HEIGHT;
        }
        this.rowHeightSubject.next(this._rowHeight);
    }
    get rowHeight() {
        return this._rowHeight;
    }
    get quickFilter() {
        return this._quickFilter;
    }
    set quickFilter(val) {
        val = Util.parseBoolean(String(val));
        this._quickFilter = val;
        if (val) {
            setTimeout(() => this.registerQuickFilter(this.searchInputComponent), 0);
        }
    }
    initialize() {
        if (this.formLayoutManager && this.formLayoutManager.isTabMode() && this.formLayoutManager.oTabGroup) {
            this.formLayoutManagerTabIndex = this.formLayoutManager.oTabGroup.data.length;
            this.tabsSubscriptions = this.formLayoutManager.oTabGroup.onSelectedTabChange.subscribe(() => {
                if (this.formLayoutManagerTabIndex !== this.formLayoutManager.oTabGroup.selectedTabIndex) {
                    this.updateStateStorage();
                    this.alreadyStored = false;
                }
            });
            this.tabsSubscriptions.add(this.formLayoutManager.oTabGroup.onCloseTab.subscribe(() => {
                if (this.formLayoutManagerTabIndex === this.formLayoutManager.oTabGroup.selectedTabIndex) {
                    this.updateStateStorage();
                }
            }));
        }
        super.initialize();
        if (this.detailButtonInRow || this.editButtonInRow) {
            this.detailMode = Codes.DETAIL_MODE_NONE;
        }
    }
    afterViewInit() {
        super.afterViewInit();
        if (this.elRef) {
            this.elRef.nativeElement.removeAttribute('title');
        }
        if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
            this.onTriggerUpdateSubscription = this.formLayoutManager.onTriggerUpdate.subscribe(() => {
                this.reloadData();
            });
        }
    }
    destroy() {
        super.destroy();
        if (this.onTriggerUpdateSubscription) {
            this.onTriggerUpdateSubscription.unsubscribe();
        }
        if (this.tabsSubscriptions) {
            this.tabsSubscriptions.unsubscribe();
        }
    }
    isVisible() {
        return this.ovisible;
    }
    hasControls() {
        return this.controls;
    }
    hasTitle() {
        return this.title !== undefined;
    }
    getSelectedItems() {
        return this.selection.selected;
    }
    clearSelection() {
        this.selection.clear();
    }
    setSelected(item) {
        this.selection.toggle(item);
    }
    navigateToDetail(route, qParams, relativeTo) {
        const extras = {
            relativeTo: relativeTo
        };
        if (this.formLayoutManager && this.formLayoutManager.isMainComponent(this)) {
            qParams[Codes.IGNORE_CAN_DEACTIVATE] = true;
            this.formLayoutManager.setAsActiveFormLayoutManager();
        }
        extras[Codes.QUERY_PARAMS] = qParams;
        this.router.navigate(route, extras);
    }
    insertDetail() {
        if (this.oFormLayoutDialog) {
            console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
            return;
        }
        const route = this.getInsertRoute();
        this.addFormLayoutManagerRoute(route);
        if (route.length > 0) {
            const relativeTo = this.recursiveInsert ? this.actRoute.parent : this.actRoute;
            const qParams = {};
            this.navigateToDetail(route, qParams, relativeTo);
        }
    }
    viewDetail(item) {
        if (this.oFormLayoutDialog) {
            console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
            return;
        }
        const route = this.getItemModeRoute(item, 'detailFormRoute');
        this.addFormLayoutManagerRoute(route);
        if (route.length > 0) {
            const qParams = Codes.getIsDetailObject();
            const relativeTo = this.recursiveDetail ? this.actRoute.parent : this.actRoute;
            this.navigateToDetail(route, qParams, relativeTo);
        }
    }
    editDetail(item) {
        if (this.oFormLayoutDialog) {
            console.warn('Navigation is not available yet in a form layout manager with mode="dialog"');
            return;
        }
        const route = this.getItemModeRoute(item, 'editFormRoute');
        this.addFormLayoutManagerRoute(route);
        if (route.length > 0) {
            const qParams = Codes.getIsDetailObject();
            const relativeTo = this.recursiveEdit ? this.actRoute.parent : this.actRoute;
            this.navigateToDetail(route, qParams, relativeTo);
        }
    }
    addFormLayoutManagerRoute(routeArr) {
        if (this.formLayoutManager && routeArr.length > 0) {
            const compRoute = this.formLayoutManager.getRouteForComponent(this);
            if (compRoute && compRoute.length > 0) {
                routeArr.unshift(...compRoute);
            }
        }
    }
    getEncodedParentKeys() {
        let encoded;
        if (Object.keys(this._pKeysEquiv).length > 0) {
            const pKeys = this.getParentKeysValues();
            if (Object.keys(pKeys).length > 0) {
                encoded = Util.encodeParentKeys(pKeys);
            }
        }
        return encoded;
    }
    getInsertRoute() {
        const route = [];
        if (Util.isDefined(this.detailFormRoute)) {
            route.push(this.detailFormRoute);
        }
        const insertRoute = Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE;
        route.push(insertRoute);
        const encodedParentKeys = this.getEncodedParentKeys();
        if (Util.isDefined(encodedParentKeys)) {
            const routeObj = {};
            routeObj[Codes.PARENT_KEYS_KEY] = encodedParentKeys;
            route.push(routeObj);
        }
        if (route.length > 0) {
            this.storeNavigationFormRoutes('insertFormRoute');
        }
        return route;
    }
    getItemModeRoute(item, modeRoute) {
        const result = this.getRouteOfSelectedRow(item);
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
    }
    getQueryConfiguration() {
        let result = {
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
    }
    getRouteOfSelectedRow(item) {
        const route = [];
        if (Util.isObject(item)) {
            this.keysArray.forEach(key => {
                if (Util.isDefined(item[key])) {
                    route.push(item[key]);
                }
            });
        }
        return route;
    }
    deleteLocalItems() {
        const selectedItems = this.getSelectedItems();
        for (let i = 0; i < selectedItems.length; ++i) {
            const selectedItem = selectedItems[i];
            const selectedItemKv = {};
            for (let k = 0; k < this.keysArray.length; ++k) {
                const key = this.keysArray[k];
                selectedItemKv[key] = selectedItem[key];
            }
            for (let j = this.dataArray.length - 1; j >= 0; --j) {
                const item = this.dataArray[j];
                const itemKv = {};
                for (let k = 0; k < this.keysArray.length; ++k) {
                    const key = this.keysArray[k];
                    itemKv[key] = item[key];
                }
                let found = false;
                for (const k in selectedItemKv) {
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
    }
    reinitialize(options) {
        if (options && Object.keys(options).length) {
            const clonedOpts = Object.assign({}, options);
            if (clonedOpts.hasOwnProperty('entity')) {
                this.entity = clonedOpts.entity;
                if (this.oattrFromEntity) {
                    this.oattr = undefined;
                }
                delete clonedOpts.entity;
            }
            for (const prop in clonedOpts) {
                if (clonedOpts.hasOwnProperty(prop)) {
                    this[prop] = clonedOpts[prop];
                }
            }
            this.destroy();
            this.initialize();
        }
    }
    setFilterBuilder(filterBuilder) {
        this.filterBuilder = filterBuilder;
    }
    getComponentFilter(existingFilter = {}) {
        const filter = super.getComponentFilter(existingFilter);
        const quickFilterExpr = this.getQuickFilterExpression();
        const filterBuilderExpr = this.getFilterBuilderExpression();
        let complexExpr = quickFilterExpr || filterBuilderExpr;
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
    }
    getQuickFilterExpression() {
        if (this.pageable && Util.isDefined(this.quickFilterComponent)) {
            return this.quickFilterComponent.filterExpression;
        }
        return undefined;
    }
    getFilterBuilderExpression() {
        if (Util.isDefined(this.filterBuilder)) {
            return this.filterBuilder.getExpression();
        }
        return undefined;
    }
    storeNavigationFormRoutes(activeMode, queryConf) {
        const mainFormLayoutComp = this.formLayoutManager ? Util.isDefined(this.formLayoutManager.isMainComponent(this)) : undefined;
        this.navigationService.storeFormRoutes({
            mainFormLayoutManagerComponent: mainFormLayoutComp,
            isMainNavigationComponent: true,
            detailFormRoute: this.detailFormRoute,
            editFormRoute: this.editFormRoute,
            insertFormRoute: Util.isDefined(this.insertFormRoute) ? this.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE
        }, activeMode, queryConf);
    }
    saveDataNavigationInLocalStorage() {
    }
    getKeysValues() {
        const data = this.dataArray;
        const self = this;
        return data.map((row) => {
            const obj = {};
            self.keysArray.forEach((key) => {
                if (row[key] !== undefined) {
                    obj[key] = row[key];
                }
            });
            return obj;
        });
    }
    getRouteKey() {
        let route = '';
        if (this.formLayoutManager && !this.formLayoutManager.isMainComponent(this)) {
            route = this.router.url;
            const params = this.formLayoutManager.getParams();
            if (params) {
                route += '/' + (Object.keys(params).join('/'));
            }
        }
        else {
            route = super.getRouteKey();
        }
        return route;
    }
    get elementRef() {
        return this.elRef;
    }
    initializeState() {
        let routeKey = super.getRouteKey();
        if (this.formLayoutManager && this.formLayoutManager.isTabMode() && !this.formLayoutManager.isMainComponent(this)) {
            try {
                const params = this.formLayoutManager.oTabGroup.state.tabsData[0].params;
                if (params) {
                    routeKey = this.router.url;
                    routeKey += '/' + (Object.keys(params).join('/'));
                }
            }
            catch (e) {
            }
        }
        this.state = this.localStorageService.getComponentStorage(this, routeKey);
    }
    showCaseSensitiveCheckbox() {
        return !this.pageable;
    }
    registerQuickFilter(arg) {
        const quickFilter = arg;
        if (Util.isDefined(this.quickFilterComponent)) {
            return;
        }
        this.quickFilterComponent = quickFilter;
        if (Util.isDefined(this.quickFilterComponent)) {
            if (this.state.hasOwnProperty('filterValue')) {
                this.quickFilterComponent.setValue(this.state.filterValue);
            }
            if (this.state.hasOwnProperty('quickFilterActiveColumns')) {
                const parsedArr = Util.parseArray(this.state.quickFilterActiveColumns, true);
                this.quickFilterComponent.setActiveColumns(parsedArr);
            }
            this.quickFilterComponent.onSearch.subscribe(val => this.filterData(val));
        }
    }
    filterData(value, loadMore) {
    }
    isFilterCaseSensitive() {
        const useQuickFilterValue = Util.isDefined(this.quickFilterComponent) && this.showCaseSensitiveCheckbox();
        if (useQuickFilterValue) {
            return this.quickFilterComponent.filterCaseSensitive;
        }
        return this.filterCaseSensitive;
    }
    configureFilterValue(value) {
        let returnVal = value;
        if (value && value.length > 0) {
            if (!value.startsWith('*')) {
                returnVal = '*' + returnVal;
            }
            if (!value.endsWith('*')) {
                returnVal = returnVal + '*';
            }
        }
        return returnVal;
    }
    getQuickFilterValue() {
        const result = '';
        if (Util.isDefined(this.quickFilterComponent)) {
            return this.quickFilterComponent.getValue() || '';
        }
        return result;
    }
    getQuickFilterColumns() {
        let result = this.quickFilterColArray;
        if (Util.isDefined(this.quickFilterComponent)) {
            result = this.quickFilterComponent.getActiveColumns();
        }
        return result;
    }
}
OServiceComponent.propDecorators = {
    searchInputComponent: [{ type: ViewChild, args: [(forwardRef(() => OSearchInputComponent)), { static: false },] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9vLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFjLFVBQVUsRUFBWSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUUsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUduRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyREFBMkQsQ0FBQztBQUNsRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDL0QsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sOERBQThELENBQUM7QUFDMUcsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDckcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDbkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDakYsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFJOUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXBDLE9BQU8sRUFBRSx1Q0FBdUMsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRWxILE1BQU0sQ0FBQyxNQUFNLGtDQUFrQyxHQUFHO0lBQ2hELEdBQUcsdUNBQXVDO0lBRTFDLGVBQWU7SUFHZixtQkFBbUI7SUFHbkIsU0FBUztJQUdULFVBQVU7SUFH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QUMsbUJBQW1CLENBQUM7UUFDdEMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFO1lBQzdDLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN2RDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7OzttQ0E3Y0EsU0FBUyxTQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0FBOUR2RTtJQURDLGNBQWMsRUFBRTs7bURBQ2tCO0FBRW5DO0lBREMsY0FBYyxFQUFFOzttREFDa0I7QUFFbkM7SUFEQyxjQUFjLEVBQUU7O21EQUNrQjtBQUluQztJQURDLGNBQWMsRUFBRTs7MERBQzBCO0FBRTNDO0lBREMsY0FBYyxFQUFFOzs0REFDa0I7QUFJbkM7SUFEQyxjQUFjLEVBQUU7O3dEQUN3QjtBQUV6QztJQURDLGNBQWMsRUFBRTs7MERBQ2dCO0FBR2pDO0lBREMsY0FBYyxFQUFFOzt1REFDSztBQWlCdEI7SUFEQyxjQUFjLEVBQUU7OzBEQUMwQjtBQUUzQztJQURDLGNBQWMsRUFBRTs7OERBQzJCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0b3IsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9GaWx0ZXJCdWlsZGVyQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9maWx0ZXItYnVpbGRlci9vLWZpbHRlci1idWlsZGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPU2VhcmNoSW5wdXRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL2lucHV0L3NlYXJjaC1pbnB1dC9vLXNlYXJjaC1pbnB1dC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPRm9ybUxheW91dERpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL2xheW91dHMvZm9ybS1sYXlvdXQvZGlhbG9nL28tZm9ybS1sYXlvdXQtZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQgfSBmcm9tICcuLi9sYXlvdXRzL2Zvcm0tbGF5b3V0L28tZm9ybS1sYXlvdXQtbWFuYWdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvcGVybWlzc2lvbnMvcGVybWlzc2lvbnMuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tICcuLi90eXBlcy9leHByZXNzaW9uLnR5cGUnO1xuaW1wb3J0IHsgT0xpc3RJbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9vLWxpc3QtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9UYWJsZUluaXRpYWxpemF0aW9uT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL28tdGFibGUtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQkFTRV9DT01QT05FTlQsIE9TZXJ2aWNlQmFzZUNvbXBvbmVudCB9IGZyb20gJy4vby1zZXJ2aWNlLWJhc2UtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9CQVNFX0NPTVBPTkVOVCxcblxuICAnX3RpdGxlOiB0aXRsZScsXG5cbiAgLy8gdmlzaWJsZSBbbm98eWVzXTogdmlzaWJpbGl0eS4gRGVmYXVsdDogeWVzLlxuICAnb3Zpc2libGU6IHZpc2libGUnLFxuXG4gIC8vIGVuYWJsZWQgW25vfHllc106IGVkaXRhYmlsaXR5LiBEZWZhdWx0OiB5ZXMuXG4gICdlbmFibGVkJyxcblxuICAvLyBjb250cm9scyBbc3RyaW5nXVt5ZXN8bm98dHJ1ZXxmYWxzZV06XG4gICdjb250cm9scycsXG5cbiAgLy8gZGV0YWlsLW1vZGUgW25vbmV8Y2xpY2t8ZG91YmxlY2xpY2tdOiB3YXkgdG8gb3BlbiB0aGUgZGV0YWlsIGZvcm0gb2YgYSByb3cuIERlZmF1bHQ6ICdjbGljaycuXG4gICdkZXRhaWxNb2RlOiBkZXRhaWwtbW9kZScsXG5cbiAgLy8gZGV0YWlsLWZvcm0tcm91dGUgW3N0cmluZ106IHJvdXRlIG9mIGRldGFpbCBmb3JtLiBEZWZhdWx0OiAnZGV0YWlsJy5cbiAgJ2RldGFpbEZvcm1Sb3V0ZTogZGV0YWlsLWZvcm0tcm91dGUnLFxuXG4gIC8vIHJlY3Vyc2l2ZS1kZXRhaWwgW25vfHllc106IGRvIG5vdCBhcHBlbmQgZGV0YWlsIGtleXMgd2hlbiBuYXZpZ2F0ZSAob3ZlcndyaXRlIGN1cnJlbnQpLiBEZWZhdWx0OiBuby5cbiAgJ3JlY3Vyc2l2ZURldGFpbDogcmVjdXJzaXZlLWRldGFpbCcsXG5cbiAgLy8gZGV0YWlsLWJ1dHRvbi1pbi1yb3cgW25vfHllc106IGFkZGluZyBhIGJ1dHRvbiBpbiByb3cgZm9yIG9wZW5pbmcgZGV0YWlsIGZvcm0uIERlZmF1bHQ6IHllcy5cbiAgJ2RldGFpbEJ1dHRvbkluUm93OiBkZXRhaWwtYnV0dG9uLWluLXJvdycsXG5cbiAgLy8gZGV0YWlsLWJ1dHRvbi1pbi1yb3ctaWNvbiBbc3RyaW5nXTogbWF0ZXJpYWwgaWNvbi4gRGVmYXVsdDogbW9kZV9lZGl0LlxuICAnZGV0YWlsQnV0dG9uSW5Sb3dJY29uOiBkZXRhaWwtYnV0dG9uLWluLXJvdy1pY29uJyxcblxuICAvLyBlZGl0LWZvcm0tcm91dGUgW3N0cmluZ106IHJvdXRlIG9mIGVkaXQgZm9ybS4gRGVmYXVsdDogJ2VkaXQnLlxuICAnZWRpdEZvcm1Sb3V0ZTogZWRpdC1mb3JtLXJvdXRlJyxcblxuICAvLyByZWN1cnNpdmUtZWRpdCBbbm98eWVzXTogZG8gbm90IGFwcGVuZCBkZXRhaWwga2V5cyB3aGVuIG5hdmlnYXRlIChvdmVyd3JpdGUgY3VycmVudCkuIERlZmF1bHQ6IG5vLlxuICAncmVjdXJzaXZlRWRpdDogcmVjdXJzaXZlLWVkaXQnLFxuXG4gIC8vIGVkaXQtYnV0dG9uLWluLXJvdyBbbm98eWVzXTogYWRkaW5nIGEgYnV0dG9uIGluIHJvdyBmb3Igb3BlbmluZyBlZGl0aW9uIGZvcm0uIERlZmF1bHQ6IG5vLlxuICAnZWRpdEJ1dHRvbkluUm93OiBlZGl0LWJ1dHRvbi1pbi1yb3cnLFxuXG4gIC8vIGVkaXQtYnV0dG9uLWluLXJvdy1pY29uIFtzdHJpbmddOiBtYXRlcmlhbCBpY29uLiBEZWZhdWx0OiBzZWFyY2guXG4gICdlZGl0QnV0dG9uSW5Sb3dJY29uOiBlZGl0LWJ1dHRvbi1pbi1yb3ctaWNvbicsXG5cbiAgLy8gaW5zZXJ0LWJ1dHRvbiBbbm98eWVzXTogc2hvdyBpbnNlcnQgYnV0dG9uLiBEZWZhdWx0OiB5ZXMuXG4gICdpbnNlcnRCdXR0b246IGluc2VydC1idXR0b24nLFxuXG4gIC8vIHJvdy1oZWlnaHQgW3NtYWxsIHwgbWVkaXVtIHwgbGFyZ2VdXG4gICdyb3dIZWlnaHQgOiByb3ctaGVpZ2h0JyxcblxuICAvLyBpbnNlcnQtZm9ybS1yb3V0ZSBbc3RyaW5nXTogcm91dGUgb2YgaW5zZXJ0IGZvcm0uIERlZmF1bHQ6XG4gICdpbnNlcnRGb3JtUm91dGU6IGluc2VydC1mb3JtLXJvdXRlJyxcblxuICAvLyByZWN1cnNpdmUtaW5zZXJ0IFtub3x5ZXNdOiBkbyBub3QgYXBwZW5kIGluc2VydCBrZXlzIHdoZW4gbmF2aWdhdGUgKG92ZXJ3cml0ZSBjdXJyZW50KS4gRGVmYXVsdDogbm8uXG4gICdyZWN1cnNpdmVJbnNlcnQ6IHJlY3Vyc2l2ZS1pbnNlcnQnLFxuXG4gIC8vIGZpbHRlciBbeWVzfG5vfHRydWV8ZmFsc2VdOiB3aGV0aGVyIGZpbHRlciBpcyBjYXNlIHNlbnNpdGl2ZS4gRGVmYXVsdDogbm8uXG4gICdmaWx0ZXJDYXNlU2Vuc2l0aXZlOiBmaWx0ZXItY2FzZS1zZW5zaXRpdmUnLFxuXG4gIC8vIHF1aWNrLWZpbHRlciBbbm98eWVzXTogc2hvdyBxdWljayBmaWx0ZXIuIERlZmF1bHQ6IHllcy5cbiAgJ3F1aWNrRmlsdGVyOiBxdWljay1maWx0ZXInLFxuXTtcblxuZXhwb3J0IGNsYXNzIE9TZXJ2aWNlQ29tcG9uZW50IGV4dGVuZHMgT1NlcnZpY2VCYXNlQ29tcG9uZW50IHtcblxuICBwcm90ZWN0ZWQgcGVybWlzc2lvbnNTZXJ2aWNlOiBQZXJtaXNzaW9uc1NlcnZpY2U7XG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcblxuICAvKiBpbnB1dHMgdmFyaWFibGVzICovXG4gIHNldCB0aXRsZSh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlID0gdmFsO1xuICB9XG4gIGdldCB0aXRsZSgpOiBzdHJpbmcge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLl90aXRsZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KHRoaXMuX3RpdGxlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RpdGxlO1xuICB9XG4gIHByb3RlY3RlZCBfdGl0bGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG92aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIG9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIGNvbnRyb2xzOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGRldGFpbE1vZGU6IHN0cmluZyA9IENvZGVzLkRFVEFJTF9NT0RFX0NMSUNLO1xuICBwcm90ZWN0ZWQgZGV0YWlsRm9ybVJvdXRlOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCByZWN1cnNpdmVEZXRhaWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgZGV0YWlsQnV0dG9uSW5Sb3c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgZGV0YWlsQnV0dG9uSW5Sb3dJY29uOiBzdHJpbmcgPSBDb2Rlcy5ERVRBSUxfSUNPTjtcbiAgcHJvdGVjdGVkIGVkaXRGb3JtUm91dGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHJlY3Vyc2l2ZUVkaXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgZWRpdEJ1dHRvbkluUm93OiBib29sZWFuID0gZmFsc2U7XG4gIGVkaXRCdXR0b25JblJvd0ljb246IHN0cmluZyA9IENvZGVzLkVESVRfSUNPTjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgaW5zZXJ0QnV0dG9uOiBib29sZWFuO1xuICBwcm90ZWN0ZWQgX3Jvd0hlaWdodCA9IENvZGVzLkRFRkFVTFRfUk9XX0hFSUdIVDtcbiAgcHJvdGVjdGVkIHJvd0hlaWdodFN1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0aGlzLl9yb3dIZWlnaHQpO1xuICBwdWJsaWMgcm93SGVpZ2h0T2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxzdHJpbmc+ID0gdGhpcy5yb3dIZWlnaHRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHNldCByb3dIZWlnaHQodmFsdWUpIHtcbiAgICB0aGlzLl9yb3dIZWlnaHQgPSB2YWx1ZSA/IHZhbHVlLnRvTG93ZXJDYXNlKCkgOiB2YWx1ZTtcbiAgICBpZiAoIUNvZGVzLmlzVmFsaWRSb3dIZWlnaHQodGhpcy5fcm93SGVpZ2h0KSkge1xuICAgICAgdGhpcy5fcm93SGVpZ2h0ID0gQ29kZXMuREVGQVVMVF9ST1dfSEVJR0hUO1xuICAgIH1cbiAgICB0aGlzLnJvd0hlaWdodFN1YmplY3QubmV4dCh0aGlzLl9yb3dIZWlnaHQpO1xuICB9XG4gIGdldCByb3dIZWlnaHQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcm93SGVpZ2h0O1xuICB9XG4gIHByb3RlY3RlZCBpbnNlcnRGb3JtUm91dGU6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIHJlY3Vyc2l2ZUluc2VydDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZmlsdGVyQ2FzZVNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX3F1aWNrRmlsdGVyOiBib29sZWFuID0gdHJ1ZTtcbiAgZ2V0IHF1aWNrRmlsdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9xdWlja0ZpbHRlcjtcbiAgfVxuICBzZXQgcXVpY2tGaWx0ZXIodmFsOiBib29sZWFuKSB7XG4gICAgdmFsID0gVXRpbC5wYXJzZUJvb2xlYW4oU3RyaW5nKHZhbCkpO1xuICAgIHRoaXMuX3F1aWNrRmlsdGVyID0gdmFsO1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWdpc3RlclF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoSW5wdXRDb21wb25lbnQpLCAwKTtcbiAgICB9XG4gIH1cbiAgLyogZW5kIG9mIGlucHV0cyB2YXJpYWJsZXMgKi9cblxuICBwdWJsaWMgZmlsdGVyQnVpbGRlcjogT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQ7XG4gIHB1YmxpYyBzZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uTW9kZWw8RWxlbWVudD4odHJ1ZSwgW10pO1xuXG4gIHByb3RlY3RlZCBvblRyaWdnZXJVcGRhdGVTdWJzY3JpcHRpb246IGFueTtcbiAgcHJvdGVjdGVkIGZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBmb3JtTGF5b3V0TWFuYWdlclRhYkluZGV4OiBudW1iZXI7XG4gIHB1YmxpYyBvRm9ybUxheW91dERpYWxvZzogT0Zvcm1MYXlvdXREaWFsb2dDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHRhYnNTdWJzY3JpcHRpb25zOiBhbnk7XG4gIHB1YmxpYyBxdWlja0ZpbHRlckNvbXBvbmVudDogT1NlYXJjaElucHV0Q29tcG9uZW50O1xuICBAVmlld0NoaWxkKChmb3J3YXJkUmVmKCgpID0+IE9TZWFyY2hJbnB1dENvbXBvbmVudCkpLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIHNlYXJjaElucHV0Q29tcG9uZW50OiBPU2VhcmNoSW5wdXRDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBxdWlja0ZpbHRlckNvbEFycmF5OiBzdHJpbmdbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBmb3JtOiBPRm9ybUNvbXBvbmVudFxuICApIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChQZXJtaXNzaW9uc1NlcnZpY2UpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyID0gdGhpcy5pbmplY3Rvci5nZXQoT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBubyBwYXJlbnQgZm9ybSBsYXlvdXQgbWFuYWdlclxuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5vRm9ybUxheW91dERpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Gb3JtTGF5b3V0RGlhbG9nQ29tcG9uZW50KTtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPSB0aGlzLm9Gb3JtTGF5b3V0RGlhbG9nLmZvcm1MYXlvdXRNYW5hZ2VyO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIG5vIHBhcmVudCBmb3JtIGxheW91dCBtYW5hZ2VyXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5pc1RhYk1vZGUoKSAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm9UYWJHcm91cCkge1xuXG4gICAgICB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyVGFiSW5kZXggPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm9UYWJHcm91cC5kYXRhLmxlbmd0aDtcblxuICAgICAgdGhpcy50YWJzU3Vic2NyaXB0aW9ucyA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIub1RhYkdyb3VwLm9uU2VsZWN0ZWRUYWJDaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXJUYWJJbmRleCAhPT0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5vVGFiR3JvdXAuc2VsZWN0ZWRUYWJJbmRleCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gICAgICAgICAgLy8gd2hlbiB0aGUgc3RvcmFnZSBpcyB1cGRhdGVkIGJlY2F1c2UgYSBmb3JtIGxheW91dCBtYW5hZ2VyIHRhYiBjaGFuZ2VcbiAgICAgICAgICAvLyB0aGUgYWxyZWFkeVN0b3JlZCBjb250cm9sIHZhcmlhYmxlIGlzIGNoYW5nZWQgdG8gaXRzIGluaXRpYWwgdmFsdWVcbiAgICAgICAgICB0aGlzLmFscmVhZHlTdG9yZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMudGFic1N1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZm9ybUxheW91dE1hbmFnZXIub1RhYkdyb3VwLm9uQ2xvc2VUYWIuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXJUYWJJbmRleCA9PT0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5vVGFiR3JvdXAuc2VsZWN0ZWRUYWJJbmRleCkge1xuICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGVTdG9yYWdlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIGlmICh0aGlzLmRldGFpbEJ1dHRvbkluUm93IHx8IHRoaXMuZWRpdEJ1dHRvbkluUm93KSB7XG4gICAgICB0aGlzLmRldGFpbE1vZGUgPSBDb2Rlcy5ERVRBSUxfTU9ERV9OT05FO1xuICAgIH1cblxuICB9XG5cbiAgcHVibGljIGFmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIuYWZ0ZXJWaWV3SW5pdCgpO1xuICAgIGlmICh0aGlzLmVsUmVmKSB7XG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCd0aXRsZScpO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzTWFpbkNvbXBvbmVudCh0aGlzKSkge1xuICAgICAgdGhpcy5vblRyaWdnZXJVcGRhdGVTdWJzY3JpcHRpb24gPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm9uVHJpZ2dlclVwZGF0ZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlbG9hZERhdGEoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5vblRyaWdnZXJVcGRhdGVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMub25UcmlnZ2VyVXBkYXRlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRhYnNTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnRhYnNTdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vdmlzaWJsZTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNDb250cm9scygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scztcbiAgfVxuXG4gIHB1YmxpYyBoYXNUaXRsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50aXRsZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHVibGljIGdldFNlbGVjdGVkSXRlbXMoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbi5zZWxlY3RlZDtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhclNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbi5jbGVhcigpO1xuICB9XG5cbiAgcHVibGljIHNldFNlbGVjdGVkKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uLnRvZ2dsZShpdGVtKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBuYXZpZ2F0ZVRvRGV0YWlsKHJvdXRlOiBhbnlbXSwgcVBhcmFtczogYW55LCByZWxhdGl2ZVRvOiBBY3RpdmF0ZWRSb3V0ZSk6IHZvaWQge1xuICAgIGNvbnN0IGV4dHJhcyA9IHtcbiAgICAgIHJlbGF0aXZlVG86IHJlbGF0aXZlVG9cbiAgICB9O1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyICYmIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuaXNNYWluQ29tcG9uZW50KHRoaXMpKSB7XG4gICAgICBxUGFyYW1zW0NvZGVzLklHTk9SRV9DQU5fREVBQ1RJVkFURV0gPSB0cnVlO1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5zZXRBc0FjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyKCk7XG4gICAgfVxuICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gcVBhcmFtcztcbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShyb3V0ZSwgZXh0cmFzKTtcbiAgfVxuXG4gIHB1YmxpYyBpbnNlcnREZXRhaWwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub0Zvcm1MYXlvdXREaWFsb2cpIHtcbiAgICAgIGNvbnNvbGUud2FybignTmF2aWdhdGlvbiBpcyBub3QgYXZhaWxhYmxlIHlldCBpbiBhIGZvcm0gbGF5b3V0IG1hbmFnZXIgd2l0aCBtb2RlPVwiZGlhbG9nXCInKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLmdldEluc2VydFJvdXRlKCk7XG4gICAgdGhpcy5hZGRGb3JtTGF5b3V0TWFuYWdlclJvdXRlKHJvdXRlKTtcbiAgICBpZiAocm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcmVsYXRpdmVUbyA9IHRoaXMucmVjdXJzaXZlSW5zZXJ0ID8gdGhpcy5hY3RSb3V0ZS5wYXJlbnQgOiB0aGlzLmFjdFJvdXRlO1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHt9O1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvRGV0YWlsKHJvdXRlLCBxUGFyYW1zLCByZWxhdGl2ZVRvKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdmlld0RldGFpbChpdGVtOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vRm9ybUxheW91dERpYWxvZykge1xuICAgICAgY29uc29sZS53YXJuKCdOYXZpZ2F0aW9uIGlzIG5vdCBhdmFpbGFibGUgeWV0IGluIGEgZm9ybSBsYXlvdXQgbWFuYWdlciB3aXRoIG1vZGU9XCJkaWFsb2dcIicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0SXRlbU1vZGVSb3V0ZShpdGVtLCAnZGV0YWlsRm9ybVJvdXRlJyk7XG4gICAgdGhpcy5hZGRGb3JtTGF5b3V0TWFuYWdlclJvdXRlKHJvdXRlKTtcbiAgICBpZiAocm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IENvZGVzLmdldElzRGV0YWlsT2JqZWN0KCk7XG4gICAgICBjb25zdCByZWxhdGl2ZVRvID0gdGhpcy5yZWN1cnNpdmVEZXRhaWwgPyB0aGlzLmFjdFJvdXRlLnBhcmVudCA6IHRoaXMuYWN0Um91dGU7XG4gICAgICB0aGlzLm5hdmlnYXRlVG9EZXRhaWwocm91dGUsIHFQYXJhbXMsIHJlbGF0aXZlVG8pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlZGl0RGV0YWlsKGl0ZW06IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9Gb3JtTGF5b3V0RGlhbG9nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ05hdmlnYXRpb24gaXMgbm90IGF2YWlsYWJsZSB5ZXQgaW4gYSBmb3JtIGxheW91dCBtYW5hZ2VyIHdpdGggbW9kZT1cImRpYWxvZ1wiJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJvdXRlID0gdGhpcy5nZXRJdGVtTW9kZVJvdXRlKGl0ZW0sICdlZGl0Rm9ybVJvdXRlJyk7XG4gICAgdGhpcy5hZGRGb3JtTGF5b3V0TWFuYWdlclJvdXRlKHJvdXRlKTtcbiAgICBpZiAocm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IENvZGVzLmdldElzRGV0YWlsT2JqZWN0KCk7XG4gICAgICBjb25zdCByZWxhdGl2ZVRvID0gdGhpcy5yZWN1cnNpdmVFZGl0ID8gdGhpcy5hY3RSb3V0ZS5wYXJlbnQgOiB0aGlzLmFjdFJvdXRlO1xuICAgICAgdGhpcy5uYXZpZ2F0ZVRvRGV0YWlsKHJvdXRlLCBxUGFyYW1zLCByZWxhdGl2ZVRvKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYWRkRm9ybUxheW91dE1hbmFnZXJSb3V0ZShyb3V0ZUFycjogYW55W10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiByb3V0ZUFyci5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjb21wUm91dGUgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldFJvdXRlRm9yQ29tcG9uZW50KHRoaXMpO1xuICAgICAgaWYgKGNvbXBSb3V0ZSAmJiBjb21wUm91dGUubGVuZ3RoID4gMCkge1xuICAgICAgICByb3V0ZUFyci51bnNoaWZ0KC4uLmNvbXBSb3V0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdldEVuY29kZWRQYXJlbnRLZXlzKCk6IHN0cmluZyB7XG4gICAgbGV0IGVuY29kZWQ6IHN0cmluZztcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fcEtleXNFcXVpdikubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcEtleXMgPSB0aGlzLmdldFBhcmVudEtleXNWYWx1ZXMoKTtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhwS2V5cykubGVuZ3RoID4gMCkge1xuICAgICAgICBlbmNvZGVkID0gVXRpbC5lbmNvZGVQYXJlbnRLZXlzKHBLZXlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuY29kZWQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0SW5zZXJ0Um91dGUoKTogYW55W10ge1xuICAgIGNvbnN0IHJvdXRlID0gW107XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZGV0YWlsRm9ybVJvdXRlKSkge1xuICAgICAgcm91dGUucHVzaCh0aGlzLmRldGFpbEZvcm1Sb3V0ZSk7XG4gICAgfVxuICAgIGNvbnN0IGluc2VydFJvdXRlID0gVXRpbC5pc0RlZmluZWQodGhpcy5pbnNlcnRGb3JtUm91dGUpID8gdGhpcy5pbnNlcnRGb3JtUm91dGUgOiBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURTtcbiAgICByb3V0ZS5wdXNoKGluc2VydFJvdXRlKTtcbiAgICAvLyBhZGRpbmcgcGFyZW50LWtleXMgaW5mby4uLlxuICAgIGNvbnN0IGVuY29kZWRQYXJlbnRLZXlzID0gdGhpcy5nZXRFbmNvZGVkUGFyZW50S2V5cygpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlbmNvZGVkUGFyZW50S2V5cykpIHtcbiAgICAgIGNvbnN0IHJvdXRlT2JqID0ge307XG4gICAgICByb3V0ZU9ialtDb2Rlcy5QQVJFTlRfS0VZU19LRVldID0gZW5jb2RlZFBhcmVudEtleXM7XG4gICAgICByb3V0ZS5wdXNoKHJvdXRlT2JqKTtcbiAgICB9XG4gICAgaWYgKHJvdXRlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc3RvcmVOYXZpZ2F0aW9uRm9ybVJvdXRlcygnaW5zZXJ0Rm9ybVJvdXRlJyk7XG4gICAgfVxuICAgIHJldHVybiByb3V0ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJdGVtTW9kZVJvdXRlKGl0ZW06IGFueSwgbW9kZVJvdXRlOiBzdHJpbmcpOiBhbnlbXSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5nZXRSb3V0ZU9mU2VsZWN0ZWRSb3coaXRlbSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5kZXRhaWxGb3JtUm91dGUpKSB7XG4gICAgICAgIHJlc3VsdC51bnNoaWZ0KHRoaXMuZGV0YWlsRm9ybVJvdXRlKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlUm91dGUgPT09ICdlZGl0Rm9ybVJvdXRlJykge1xuICAgICAgICByZXN1bHQucHVzaCh0aGlzLmVkaXRGb3JtUm91dGUgfHwgQ29kZXMuREVGQVVMVF9FRElUX1JPVVRFKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwICYmICF0aGlzLm9Gb3JtTGF5b3V0RGlhbG9nKSB7XG4gICAgICB0aGlzLnN0b3JlTmF2aWdhdGlvbkZvcm1Sb3V0ZXMobW9kZVJvdXRlLCB0aGlzLmdldFF1ZXJ5Q29uZmlndXJhdGlvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRRdWVyeUNvbmZpZ3VyYXRpb24oKTogYW55IHtcbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAga2V5c1ZhbHVlczogdGhpcy5nZXRLZXlzVmFsdWVzKClcbiAgICB9O1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICByZXN1bHQgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgc2VydmljZVR5cGU6IHRoaXMuc2VydmljZVR5cGUsXG4gICAgICAgIHF1ZXJ5QXJndW1lbnRzOiB0aGlzLnF1ZXJ5QXJndW1lbnRzLFxuICAgICAgICBlbnRpdHk6IHRoaXMuZW50aXR5LFxuICAgICAgICBzZXJ2aWNlOiB0aGlzLnNlcnZpY2UsXG4gICAgICAgIHF1ZXJ5TWV0aG9kOiB0aGlzLnBhZ2VhYmxlID8gdGhpcy5wYWdpbmF0ZWRRdWVyeU1ldGhvZCA6IHRoaXMucXVlcnlNZXRob2QsXG4gICAgICAgIHRvdGFsUmVjb3Jkc051bWJlcjogdGhpcy5nZXRUb3RhbFJlY29yZHNOdW1iZXIoKSxcbiAgICAgICAgcXVlcnlSb3dzOiB0aGlzLnF1ZXJ5Um93cyxcbiAgICAgICAgcXVlcnlSZWNvcmRPZmZzZXQ6IE1hdGgubWF4KHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgLSB0aGlzLnF1ZXJ5Um93cywgMClcbiAgICAgIH0sIHJlc3VsdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0Um91dGVPZlNlbGVjdGVkUm93KGl0ZW06IGFueSk6IGFueVtdIHtcbiAgICBjb25zdCByb3V0ZSA9IFtdO1xuICAgIGlmIChVdGlsLmlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICB0aGlzLmtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChpdGVtW2tleV0pKSB7XG4gICAgICAgICAgcm91dGUucHVzaChpdGVtW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGRlbGV0ZUxvY2FsSXRlbXMoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZ2V0U2VsZWN0ZWRJdGVtcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtc1tpXTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbUt2ID0ge307XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMua2V5c0FycmF5Lmxlbmd0aDsgKytrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c0FycmF5W2tdO1xuICAgICAgICBzZWxlY3RlZEl0ZW1LdltrZXldID0gc2VsZWN0ZWRJdGVtW2tleV07XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBqID0gdGhpcy5kYXRhQXJyYXkubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuZGF0YUFycmF5W2pdO1xuICAgICAgICBjb25zdCBpdGVtS3YgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLmtleXNBcnJheS5sZW5ndGg7ICsraykge1xuICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMua2V5c0FycmF5W2tdO1xuICAgICAgICAgIGl0ZW1LdltrZXldID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gc2VsZWN0ZWRJdGVtS3YpIHtcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRJdGVtS3YuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIGZvdW5kID0gaXRlbUt2Lmhhc093blByb3BlcnR5KGspICYmIChzZWxlY3RlZEl0ZW1LdltrXSA9PT0gaXRlbUt2W2tdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgdGhpcy5kYXRhQXJyYXkuc3BsaWNlKGosIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuY2xlYXJTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyByZWluaXRpYWxpemUob3B0aW9uczogT0xpc3RJbml0aWFsaXphdGlvbk9wdGlvbnMgfCBPVGFibGVJbml0aWFsaXphdGlvbk9wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAob3B0aW9ucyAmJiBPYmplY3Qua2V5cyhvcHRpb25zKS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNsb25lZE9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcbiAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KCdlbnRpdHknKSkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IGNsb25lZE9wdHMuZW50aXR5O1xuICAgICAgICBpZiAodGhpcy5vYXR0ckZyb21FbnRpdHkpIHtcbiAgICAgICAgICB0aGlzLm9hdHRyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjbG9uZWRPcHRzLmVudGl0eTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBjbG9uZWRPcHRzKSB7XG4gICAgICAgIGlmIChjbG9uZWRPcHRzLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgdGhpc1twcm9wXSA9IGNsb25lZE9wdHNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGBvLWZpbHRlci1idWlsZGVyYCBjb21wb25lbnQgdGhhdCB0aGlzIGNvbXBvbmVudCB3aWxsIHVzZSB0byBmaWx0ZXIgaXRzIGRhdGEuXG4gICAqIEBwYXJhbSBmaWx0ZXJCdWlsZGVyIHRoZSBgby1maWx0ZXItYnVpbGRlcmAgY29tcG9uZW50LlxuICAgKi9cbiAgcHVibGljIHNldEZpbHRlckJ1aWxkZXIoZmlsdGVyQnVpbGRlcjogT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQpOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlckJ1aWxkZXIgPSBmaWx0ZXJCdWlsZGVyO1xuICB9XG5cbiAgcHVibGljIGdldENvbXBvbmVudEZpbHRlcihleGlzdGluZ0ZpbHRlcjogYW55ID0ge30pOiBhbnkge1xuICAgIGNvbnN0IGZpbHRlciA9IHN1cGVyLmdldENvbXBvbmVudEZpbHRlcihleGlzdGluZ0ZpbHRlcik7XG5cbiAgICBjb25zdCBxdWlja0ZpbHRlckV4cHIgPSB0aGlzLmdldFF1aWNrRmlsdGVyRXhwcmVzc2lvbigpO1xuICAgIGNvbnN0IGZpbHRlckJ1aWxkZXJFeHByID0gdGhpcy5nZXRGaWx0ZXJCdWlsZGVyRXhwcmVzc2lvbigpO1xuICAgIGxldCBjb21wbGV4RXhwciA9IHF1aWNrRmlsdGVyRXhwciB8fCBmaWx0ZXJCdWlsZGVyRXhwcjtcbiAgICBpZiAocXVpY2tGaWx0ZXJFeHByICYmIGZpbHRlckJ1aWxkZXJFeHByKSB7XG4gICAgICBjb21wbGV4RXhwciA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKHF1aWNrRmlsdGVyRXhwciwgZmlsdGVyQnVpbGRlckV4cHIsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9BTkQpO1xuICAgIH1cblxuICAgIGlmIChjb21wbGV4RXhwciAmJiAhVXRpbC5pc0RlZmluZWQoZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5CQVNJQ19FWFBSRVNTSU9OX0tFWV0pKSB7XG4gICAgICBmaWx0ZXJbRmlsdGVyRXhwcmVzc2lvblV0aWxzLkJBU0lDX0VYUFJFU1NJT05fS0VZXSA9IGNvbXBsZXhFeHByO1xuICAgIH0gZWxzZSBpZiAoY29tcGxleEV4cHIpIHtcbiAgICAgIGZpbHRlcltGaWx0ZXJFeHByZXNzaW9uVXRpbHMuQkFTSUNfRVhQUkVTU0lPTl9LRVldID1cbiAgICAgICAgRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQ29tcGxleEV4cHJlc3Npb24oZmlsdGVyW0ZpbHRlckV4cHJlc3Npb25VdGlscy5CQVNJQ19FWFBSRVNTSU9OX0tFWV0sIGNvbXBsZXhFeHByLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfQU5EKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFF1aWNrRmlsdGVyRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICBpZiAodGhpcy5wYWdlYWJsZSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSkge1xuICAgICAgcmV0dXJuIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQuZmlsdGVyRXhwcmVzc2lvbjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRGaWx0ZXJCdWlsZGVyRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICAvLyBBZGQgZmlsdGVyIGZyb20gby1maWx0ZXItYnVpbGRlciBjb21wb25lbnRcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5maWx0ZXJCdWlsZGVyKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyQnVpbGRlci5nZXRFeHByZXNzaW9uKCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgc3RvcmVOYXZpZ2F0aW9uRm9ybVJvdXRlcyhhY3RpdmVNb2RlOiBzdHJpbmcsIHF1ZXJ5Q29uZj86IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1haW5Gb3JtTGF5b3V0Q29tcCA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPyBVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzTWFpbkNvbXBvbmVudCh0aGlzKSkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5zdG9yZUZvcm1Sb3V0ZXMoe1xuICAgICAgbWFpbkZvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50OiBtYWluRm9ybUxheW91dENvbXAsXG4gICAgICBpc01haW5OYXZpZ2F0aW9uQ29tcG9uZW50OiB0cnVlLFxuICAgICAgZGV0YWlsRm9ybVJvdXRlOiB0aGlzLmRldGFpbEZvcm1Sb3V0ZSxcbiAgICAgIGVkaXRGb3JtUm91dGU6IHRoaXMuZWRpdEZvcm1Sb3V0ZSxcbiAgICAgIGluc2VydEZvcm1Sb3V0ZTogVXRpbC5pc0RlZmluZWQodGhpcy5pbnNlcnRGb3JtUm91dGUpID8gdGhpcy5pbnNlcnRGb3JtUm91dGUgOiBDb2Rlcy5ERUZBVUxUX0lOU0VSVF9ST1VURVxuICAgIH0sIGFjdGl2ZU1vZGUsIHF1ZXJ5Q29uZik7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZURhdGFOYXZpZ2F0aW9uSW5Mb2NhbFN0b3JhZ2UoKTogdm9pZCB7XG4gICAgLy8gU2F2ZSBkYXRhIG9mIHRoZSBsaXN0IGluIG5hdmlnYXRpb24tZGF0YSBpbiB0aGUgbG9jYWxzdG9yYWdlXG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0S2V5c1ZhbHVlcygpOiBhbnlbXSB7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YUFycmF5O1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBkYXRhLm1hcCgocm93KSA9PiB7XG4gICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgIHNlbGYua2V5c0FycmF5LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAocm93W2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG9ialtrZXldID0gcm93W2tleV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJvdXRlS2V5KCk6IHN0cmluZyB7XG4gICAgbGV0IHJvdXRlID0gJyc7XG4gICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgIXRoaXMuZm9ybUxheW91dE1hbmFnZXIuaXNNYWluQ29tcG9uZW50KHRoaXMpKSB7XG4gICAgICByb3V0ZSA9IHRoaXMucm91dGVyLnVybDtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0UGFyYW1zKCk7XG4gICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgIHJvdXRlICs9ICcvJyArIChPYmplY3Qua2V5cyhwYXJhbXMpLmpvaW4oJy8nKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlID0gc3VwZXIuZ2V0Um91dGVLZXkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgZ2V0IGVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7XG4gICAgcmV0dXJuIHRoaXMuZWxSZWY7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgbGV0IHJvdXRlS2V5ID0gc3VwZXIuZ2V0Um91dGVLZXkoKTtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzVGFiTW9kZSgpICYmICF0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzTWFpbkNvbXBvbmVudCh0aGlzKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5vVGFiR3JvdXAuc3RhdGUudGFic0RhdGFbMF0ucGFyYW1zO1xuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgcm91dGVLZXkgPSB0aGlzLnJvdXRlci51cmw7XG4gICAgICAgICAgcm91dGVLZXkgKz0gJy8nICsgKE9iamVjdC5rZXlzKHBhcmFtcykuam9pbignLycpKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvL1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBHZXQgcHJldmlvdXMgc3RhdHVzXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMubG9jYWxTdG9yYWdlU2VydmljZS5nZXRDb21wb25lbnRTdG9yYWdlKHRoaXMsIHJvdXRlS2V5KTtcblxuICB9XG5cbiAgcHVibGljIHNob3dDYXNlU2Vuc2l0aXZlQ2hlY2tib3goKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnBhZ2VhYmxlO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUXVpY2tGaWx0ZXIoYXJnOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBxdWlja0ZpbHRlciA9IChhcmcgYXMgT1NlYXJjaElucHV0Q29tcG9uZW50KTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkpIHtcbiAgICAgIC8vIGF2b2lkaW5nIHRvIHJlZ2lzdGVyIGEgcXVpY2tmaWx0ZXJjb21wb25lbnQgaWYgaXQgYWxyZWFkeSBleGlzdHMgb25lXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQgPSBxdWlja0ZpbHRlcjtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdmaWx0ZXJWYWx1ZScpKSB7XG4gICAgICAgIHRoaXMucXVpY2tGaWx0ZXJDb21wb25lbnQuc2V0VmFsdWUodGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS5oYXNPd25Qcm9wZXJ0eSgncXVpY2tGaWx0ZXJBY3RpdmVDb2x1bW5zJykpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkQXJyID0gVXRpbC5wYXJzZUFycmF5KHRoaXMuc3RhdGUucXVpY2tGaWx0ZXJBY3RpdmVDb2x1bW5zLCB0cnVlKTtcbiAgICAgICAgdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5zZXRBY3RpdmVDb2x1bW5zKHBhcnNlZEFycik7XG4gICAgICB9XG4gICAgICB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50Lm9uU2VhcmNoLnN1YnNjcmliZSh2YWwgPT4gdGhpcy5maWx0ZXJEYXRhKHZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBmaWx0ZXJEYXRhKHZhbHVlPzogc3RyaW5nLCBsb2FkTW9yZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAvL1xuICB9XG5cbiAgcHVibGljIGlzRmlsdGVyQ2FzZVNlbnNpdGl2ZSgpOiBib29sZWFuIHtcbiAgICBjb25zdCB1c2VRdWlja0ZpbHRlclZhbHVlID0gVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkgJiYgdGhpcy5zaG93Q2FzZVNlbnNpdGl2ZUNoZWNrYm94KCk7XG4gICAgaWYgKHVzZVF1aWNrRmlsdGVyVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50LmZpbHRlckNhc2VTZW5zaXRpdmU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmU7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlRmlsdGVyVmFsdWUodmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHJldHVyblZhbCA9IHZhbHVlO1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIXZhbHVlLnN0YXJ0c1dpdGgoJyonKSkge1xuICAgICAgICByZXR1cm5WYWwgPSAnKicgKyByZXR1cm5WYWw7XG4gICAgICB9XG4gICAgICBpZiAoIXZhbHVlLmVuZHNXaXRoKCcqJykpIHtcbiAgICAgICAgcmV0dXJuVmFsID0gcmV0dXJuVmFsICsgJyonO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuVmFsO1xuICB9XG5cbiAgcHVibGljIGdldFF1aWNrRmlsdGVyVmFsdWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCByZXN1bHQgPSAnJztcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50LmdldFZhbHVlKCkgfHwgJyc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ2V0UXVpY2tGaWx0ZXJDb2x1bW5zKCk6IHN0cmluZ1tdIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5xdWlja0ZpbHRlckNvbEFycmF5O1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5nZXRBY3RpdmVDb2x1bW5zKCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==