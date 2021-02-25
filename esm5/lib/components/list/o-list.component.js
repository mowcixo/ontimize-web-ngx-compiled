import * as tslib_1 from "tslib";
import { SelectionModel } from '@angular/cdk/collections';
import { Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Injector, Optional, QueryList, ViewEncapsulation } from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { InputConverter } from '../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../services/factories';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { DEFAULT_INPUTS_O_SERVICE_COMPONENT, OServiceComponent } from '../o-service-component.class';
import { OListItemDirective } from './list-item/o-list-item.directive';
export var DEFAULT_INPUTS_O_LIST = tslib_1.__spread(DEFAULT_INPUTS_O_SERVICE_COMPONENT, [
    'quickFilterColumns: quick-filter-columns',
    'refreshButton: refresh-button',
    'route',
    'selectable',
    'odense : dense',
    'deleteButton: delete-button',
    'sortColumns: sort-columns',
    'insertButtonPosition:insert-button-position',
    'insertButtonFloatable:insert-button-floatable'
]);
export var DEFAULT_OUTPUTS_O_LIST = [
    'onClick',
    'onDoubleClick',
    'onInsertButtonClick',
    'onItemDeleted',
    'onDataLoaded',
    'onPaginatedDataLoaded'
];
var OListComponent = (function (_super) {
    tslib_1.__extends(OListComponent, _super);
    function OListComponent(injector, elRef, form) {
        var _this = _super.call(this, injector, elRef, form) || this;
        _this.listItemComponents = [];
        _this.refreshButton = true;
        _this.selectable = false;
        _this.odense = false;
        _this.deleteButton = true;
        _this.insertButtonFloatable = true;
        _this.sortColArray = [];
        _this.onClick = new EventEmitter();
        _this.onDoubleClick = new EventEmitter();
        _this.onInsertButtonClick = new EventEmitter();
        _this.onItemDeleted = new EventEmitter();
        _this.onDataLoaded = new EventEmitter();
        _this.onPaginatedDataLoaded = new EventEmitter();
        _this.selection = new SelectionModel(true, []);
        _this.enabledDeleteButton = false;
        _this.insertButtonPosition = 'bottom';
        _this.dataResponseArray = [];
        _this.storePaginationState = false;
        _this.subscription = new Subscription();
        return _this;
    }
    OListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initialize();
        this.subscription.add(this.selection.changed.subscribe(function () { return _this.enabledDeleteButton = !_this.selection.isEmpty(); }));
    };
    OListComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.afterViewInit.call(this);
        this.parseSortColumns();
        this.filterCaseSensitive = this.state.hasOwnProperty('filter-case-sensitive') ?
            this.state['filter-case-sensitive'] : this.filterCaseSensitive;
        if (Util.isDefined(this.searchInputComponent)) {
            this.registerQuickFilter(this.searchInputComponent);
        }
    };
    OListComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.setListItemDirectivesData();
        this.listItemDirectives.changes.subscribe(function () { return _this.setListItemDirectivesData(); });
    };
    OListComponent.prototype.ngOnDestroy = function () {
        this.destroy();
        this.subscription.unsubscribe();
    };
    OListComponent.prototype.ngOnChanges = function (changes) {
        if (changes.staticData !== undefined) {
            this.dataResponseArray = changes.staticData.currentValue;
            var filter = (this.state && this.state.filterValue) ? this.state.filterValue : undefined;
            this.filterData(filter);
        }
    };
    OListComponent.prototype.getComponentKey = function () {
        return 'OListComponent_' + this.oattr;
    };
    OListComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.staticData && this.staticData.length) {
            this.dataResponseArray = this.staticData;
        }
        if (!Util.isDefined(this.quickFilterColumns)) {
            this.quickFilterColumns = this.columns;
        }
        this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
        var initialQueryLength;
        if (this.state.hasOwnProperty('queryRecordOffset')) {
            initialQueryLength = this.state.queryRecordOffset;
        }
        this.state.queryRecordOffset = 0;
        if (!this.state.hasOwnProperty('totalQueryRecordsNumber')) {
            this.state.totalQueryRecordsNumber = 0;
        }
        if (this.queryOnInit) {
            var queryArgs = {
                offset: 0,
                length: initialQueryLength || this.queryRows
            };
            this.queryData(void 0, queryArgs);
        }
    };
    OListComponent.prototype.reinitialize = function (options) {
        _super.prototype.reinitialize.call(this, options);
    };
    OListComponent.prototype.registerListItemDirective = function (item) {
        var _this = this;
        if (item) {
            item.onClick(function (directiveItem) { return _this.onItemDetailClick(directiveItem); });
            item.onDoubleClick(function (directiveItem) { return _this.onItemDetailDoubleClick(directiveItem); });
        }
    };
    OListComponent.prototype.getDense = function () {
        return this.odense;
    };
    OListComponent.prototype.onListItemClicked = function (onNext) {
        return ObservableWrapper.subscribe(this.onClick, onNext);
    };
    OListComponent.prototype.onItemDetailClick = function (item) {
        var data = item.getItemData();
        if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(data);
        }
        ObservableWrapper.callEmit(this.onClick, data);
    };
    OListComponent.prototype.onItemDetailDoubleClick = function (item) {
        var data = item.getItemData();
        if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(data);
        }
        ObservableWrapper.callEmit(this.onDoubleClick, data);
    };
    OListComponent.prototype.getDataToStore = function () {
        var dataToStore = _super.prototype.getDataToStore.call(this);
        if (!this.storePaginationState) {
            delete dataToStore['queryRecordOffset'];
        }
        if (this.quickFilter && Util.isDefined(this.quickFilterComponent)) {
            dataToStore['quickFilterActiveColumns'] = this.quickFilterComponent.getActiveColumns().join(Codes.ARRAY_INPUT_SEPARATOR);
        }
        dataToStore['filter-case-sensitive'] = this.isFilterCaseSensitive();
        return dataToStore;
    };
    OListComponent.prototype.reloadData = function () {
        var queryArgs = {};
        if (this.pageable) {
            this.state.queryRecordOffset = 0;
            queryArgs = {
                length: Math.max(this.queryRows, this.dataResponseArray.length),
                replace: true
            };
        }
        if (this.selectable) {
            this.clearSelection();
            this.state.selectedIndexes = [];
        }
        this.queryData(void 0, queryArgs);
    };
    OListComponent.prototype.reloadPaginatedDataFromStart = function () {
        this.dataResponseArray = [];
        this.reloadData();
    };
    OListComponent.prototype.filterData = function (value, loadMore) {
        if (this.state) {
            this.state.filterValue = value;
        }
        if (this.pageable) {
            var queryArgs = {
                offset: 0,
                length: this.queryRows,
                replace: true
            };
            this.queryData(void 0, queryArgs);
        }
        else if (value && value.length > 0 && this.dataResponseArray && this.dataResponseArray.length > 0) {
            var self_1 = this;
            var caseSensitive_1 = this.isFilterCaseSensitive();
            var filteredData = this.dataResponseArray.filter(function (item) {
                return self_1.getQuickFilterColumns().some(function (col) {
                    var regExpStr = Util.escapeSpecialCharacter(Util.normalizeString(value, !caseSensitive_1));
                    return new RegExp(regExpStr).test(Util.normalizeString(item[col] + '', !caseSensitive_1));
                });
            });
            this.setDataArray(filteredData);
        }
        else {
            this.setDataArray(this.dataResponseArray);
        }
    };
    OListComponent.prototype.isItemSelected = function (item) {
        return this.selection.isSelected(item);
    };
    OListComponent.prototype.updateSelectedState = function (item, isSelected) {
        var selectedIndexes = this.state.selectedIndexes || [];
        var itemIndex = this.dataResponseArray.indexOf(item);
        if (isSelected && selectedIndexes.indexOf(itemIndex) === -1) {
            selectedIndexes.push(itemIndex);
        }
        else if (!isSelected) {
            selectedIndexes.splice(selectedIndexes.indexOf(itemIndex), 1);
        }
        this.state.selectedIndexes = selectedIndexes;
    };
    OListComponent.prototype.onScroll = function (e) {
        if (this.pageable) {
            var pendingRegistries = this.dataResponseArray.length < this.state.totalQueryRecordsNumber;
            if (!this.loadingSubject.value && pendingRegistries) {
                var element = e.target;
                if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
                    var queryArgs = {
                        offset: this.state.queryRecordOffset,
                        length: this.queryRows
                    };
                    this.queryData(void 0, queryArgs);
                }
            }
        }
    };
    OListComponent.prototype.remove = function (clearSelectedItems) {
        var _this = this;
        if (clearSelectedItems === void 0) { clearSelectedItems = false; }
        var selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) {
            this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(function (res) {
                if (res === true) {
                    if (_this.dataService && (_this.deleteMethod in _this.dataService) && _this.entity && (_this.keysArray.length > 0)) {
                        var filters = ServiceUtils.getArrayProperties(selectedItems, _this.keysArray);
                        merge(filters.map((function (kv) { return _this.dataService[_this.deleteMethod](kv, _this.entity); }))).subscribe(function (obs) { return obs.subscribe(function () {
                            ObservableWrapper.callEmit(_this.onItemDeleted, selectedItems);
                        }, function (error) {
                            _this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
                        }, function () {
                            _this.reloadData();
                        }); });
                    }
                    else {
                        _this.deleteLocalItems();
                    }
                }
                else if (clearSelectedItems) {
                    _this.clearSelection();
                }
            });
        }
    };
    OListComponent.prototype.add = function (e) {
        this.onInsertButtonClick.emit(e);
        _super.prototype.insertDetail.call(this);
    };
    OListComponent.prototype.parseSortColumns = function () {
        var sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
        this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
    };
    OListComponent.prototype.getQueryArguments = function (filter, ovrrArgs) {
        var queryArguments = _super.prototype.getQueryArguments.call(this, filter, ovrrArgs);
        if (this.pageable) {
            queryArguments[6] = this.sortColArray;
        }
        return queryArguments;
    };
    OListComponent.prototype.registerItem = function (item) {
        this.listItemComponents.push(item);
        if (this.dataResponseArray.length > 0) {
            item.setItemData(this.dataResponseArray[this.listItemComponents.length - 1]);
        }
    };
    OListComponent.prototype.setListItemDirectivesData = function () {
        var _this = this;
        this.listItemDirectives.forEach(function (element, index) {
            element.setItemData(_this.dataResponseArray[index]);
            element.setListComponent(_this);
            _this.registerListItemDirective(element);
        });
    };
    OListComponent.prototype.saveDataNavigationInLocalStorage = function () {
        _super.prototype.saveDataNavigationInLocalStorage.call(this);
        this.storePaginationState = true;
    };
    OListComponent.prototype.setData = function (data, sqlTypes, replace) {
        var e_1, _a;
        if (Util.isArray(data)) {
            var respDataArray = data;
            if (this.pageable && !replace) {
                respDataArray = (this.dataResponseArray || []).concat(data);
            }
            var selectedIndexes = this.state.selectedIndexes || [];
            try {
                for (var selectedIndexes_1 = tslib_1.__values(selectedIndexes), selectedIndexes_1_1 = selectedIndexes_1.next(); !selectedIndexes_1_1.done; selectedIndexes_1_1 = selectedIndexes_1.next()) {
                    var selIndex = selectedIndexes_1_1.value;
                    if (selIndex < this.dataResponseArray.length) {
                        this.selection.select(this.dataResponseArray[selIndex]);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (selectedIndexes_1_1 && !selectedIndexes_1_1.done && (_a = selectedIndexes_1.return)) _a.call(selectedIndexes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.dataResponseArray = respDataArray;
            if (!this.pageable) {
                this.filterData(this.state.filterValue);
            }
            else {
                this.setDataArray(this.dataResponseArray);
            }
        }
        else {
            this.setDataArray([]);
        }
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
        if (this.pageable) {
            ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
        }
        ObservableWrapper.callEmit(this.onDataLoaded, this.dataResponseArray);
    };
    OListComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-list',
                    providers: [
                        OntimizeServiceProvider
                    ],
                    inputs: DEFAULT_INPUTS_O_LIST,
                    outputs: DEFAULT_OUTPUTS_O_LIST,
                    template: "<div class=\"o-list-container\" [style.display]=\"isVisible()? '' : 'none'\" fxFill>\n  <div *ngIf=\"loading | async\" fxLayoutAlign=\"center center\"\n    [class.pageable-loading]=\"pageable && state.queryRecordOffset > 0\" class=\"spinner-container\">\n    <mat-progress-spinner strokeWidth=\"3\" mode=\"indeterminate\"></mat-progress-spinner>\n  </div>\n\n  <mat-toolbar *ngIf=\"hasControls()\" [class.dense]=\"odense\">\n    <div class=\"mat-toolbar-tools\" fxLayout=\"row\" fxFill fxLayoutAlign=\"start center\">\n      <button *ngIf=\"insertButton && !insertButtonFloatable\" type=\"button\" mat-icon-button aria-label=\"Insert\"\n        (click)=\"add($event)\">\n        <mat-icon svgIcon=\"ontimize:add\"></mat-icon>\n      </button>\n      <button type=\"button\" mat-icon-button aria-label=\"Refresh\" (click)=\"reloadData()\" *ngIf=\"refreshButton\">\n        <mat-icon svgIcon=\"ontimize:autorenew\"></mat-icon>\n      </button>\n\n      <button *ngIf=\"deleteButton\" type=\"button\" mat-icon-button aria-label=\"Delete\" [disabled]=\"!enabledDeleteButton\"\n        [class.disabled]=\"!enabledDeleteButton\" (click)=\"remove()\">\n        <mat-icon svgIcon=\"ontimize:delete\"></mat-icon>\n      </button>\n      <div fxLayoutAlign=\"center center\" fxFlex>\n        <span *ngIf=\"hasTitle()\" fxLayoutAlign=\"center center\">{{ title | oTranslate }}</span>\n      </div>\n      <o-search-input *ngIf=\"quickFilter\" [filter-case-sensitive]=\"filterCaseSensitive\"\n        [show-case-sensitive-checkbox]=\"showCaseSensitiveCheckbox()\" [columns]=\"quickFilterColumns\" placeholder=\"\" appearance=\"legacy\">\n      </o-search-input>\n    </div>\n  </mat-toolbar>\n\n  <div fxLayout=\"column\" class=\"o-list-content\" [class.o-list-content-toolbar]=\"hasControls() && !odense\"\n    [class.o-list-content-toolbar-dense]=\"hasControls() && odense\">\n\n    <!--MAT-LIST-->\n    <mat-list [attr.dense]=\"odense || undefined\" (scroll)=\"onScroll($event)\" [class.selectable]=\"selectable\"\n      [class.o-list-item-has-buttons]=\"insertButton && (editButtonInRow || detailButtonInRow)\">\n\n      <mat-list-item *ngIf=\"!getDataArray().length\" fxLayout=\"row\" fxLayoutAlign=\"center center\"\n        style=\"cursor: default;\">\n        <h3 matLine>\n          {{ 'TABLE.EMPTY' | oTranslate }}\n          <ng-container *ngIf=\"getQuickFilterValue().length > 0\">\n            {{ 'TABLE.EMPTY_USING_FILTER' | oTranslate : {values: [getQuickFilterValue()]} }}\n          </ng-container>\n        </h3>\n      </mat-list-item>\n      <ng-content></ng-content>\n    </mat-list>\n\n    <!--INSERT BUTTONcd -->\n    <button type=\"button\" *ngIf=\"insertButton && insertButtonFloatable && odense\" mat-mini-fab (click)=\"add($event)\"\n      class=\"add-button\" [class.add-button-bottom]=\"insertButtonPosition ==='bottom'\"\n      [class.add-button-top]=\"insertButtonPosition ==='top'\">\n      <mat-icon svgIcon=\"ontimize:add\"></mat-icon>\n    </button>\n    <button type=\"button\" *ngIf=\"insertButton && insertButtonFloatable && !odense\" mat-fab (click)=\"add($event)\"\n      class=\"add-button add-button-bottom\" [class.add-button-bottom]=\"insertButtonPosition ==='bottom'\"\n      [class.add-button-top]=\"insertButtonPosition ==='top'\">\n      <mat-icon svgIcon=\"ontimize:add\"></mat-icon>\n    </button>\n  </div>\n</div>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-list]': 'true'
                    },
                    styles: ["::-webkit-input-placeholder{color:#8e0c39}:-moz-placeholder{color:#8e0c39;opacity:1}::-moz-placeholder{color:#8e0c39;opacity:1}:-ms-input-placeholder{color:#8e0c39}:placeholder-shown{color:#8e0c39}.o-list-container{position:relative;flex-direction:column}.o-list-container .mat-toolbar.dense{height:48px}.o-list-container .o-list-content{height:100%}.o-list-container .o-list-content.o-list-content-toolbar{height:calc(100% - 64px)}.o-list-container .o-list-content.o-list-content-toolbar-dense{height:calc(100% - 48px)}.o-list-container .o-list-content.o-list-content-toolbar-dense .add-button.add-button-top{top:60px}.o-list-container .o-list-title{font-size:1.5em}.o-list-container .spinner-container{position:absolute;top:0;bottom:0;left:0;right:0;z-index:500}.o-list-container .spinner-container:not(.pageable-loading){top:0;background:#fff}.o-list-container .spinner-container.pageable-loading{background:rgba(255,255,255,.5)}.o-list-container .spinner-container path{stroke-width:5px!important}.o-list-container .mat-list{overflow:auto}.o-list-container .mat-list .mat-3-line .o-custom-list-item{position:relative}.o-list-container .mat-list .o-custom-list-item{max-width:100%;width:100%}.o-list-container .mat-list .o-custom-list-item .o-list-item-icon{cursor:pointer;padding-right:6px}.o-list-container .mat-list.o-list-item-has-buttons .o-list-item .mat-list-item-content{padding-right:72px}.o-list-container .mat-list.o-list-item-has-buttons[dense] .o-list-item .mat-list-item-content{padding-right:56px}.o-list-container .mat-list .o-list-item.mat-card,.o-list-container .mat-list .o-list-item.mat-list-item{margin:6px 0}.o-list-container .add-button{right:12px;position:absolute}.o-list-container .add-button.add-button-bottom{bottom:12px}.o-list-container .add-button.add-button-top{top:88px}"]
                }] }
    ];
    OListComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] }
    ]; };
    OListComponent.propDecorators = {
        listItemDirectives: [{ type: ContentChildren, args: [OListItemDirective,] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OListComponent.prototype, "refreshButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OListComponent.prototype, "selectable", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OListComponent.prototype, "odense", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OListComponent.prototype, "deleteButton", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OListComponent.prototype, "insertButtonFloatable", void 0);
    return OListComponent;
}(OServiceComponent));
export { OListComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L28tbGlzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBR0wsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUlSLFFBQVEsRUFDUixTQUFTLEVBRVQsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUdsRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUluRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDckcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFdkUsTUFBTSxDQUFDLElBQU0scUJBQXFCLG9CQUM3QixrQ0FBa0M7SUFHckMsMENBQTBDO0lBRzFDLCtCQUErQjtJQUUvQixPQUFPO0lBRVAsWUFBWTtJQUVaLGdCQUFnQjtJQUdoQiw2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QUFVO2dCQTBCSCxjQUFjLHVCQWlHbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7OztxQ0F0Q3JELGVBQWUsU0FBQyxrQkFBa0I7O0lBS25DO1FBREMsY0FBYyxFQUFFOzt5REFDb0I7SUFFckM7UUFEQyxjQUFjLEVBQUU7O3NEQUNrQjtJQUVuQztRQURDLGNBQWMsRUFBRTs7a0RBQ2M7SUFFL0I7UUFEQyxjQUFjLEVBQUU7O3dEQUNtQjtJQUVwQztRQURDLGNBQWMsRUFBRTs7aUVBQzRCO0lBK1QvQyxxQkFBQztDQUFBLEFBOVZELENBY29DLGlCQUFpQixHQWdWcEQ7U0FoVlksY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZSxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBtZXJnZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUxpc3RJdGVtIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLWxpc3QtaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUxpc3QgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tbGlzdC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgT0xpc3RJbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLWxpc3QtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuaW1wb3J0IHsgU1FMT3JkZXIgfSBmcm9tICcuLi8uLi90eXBlcy9zcWwtb3JkZXIudHlwZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQsIE9TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPTGlzdEl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuL2xpc3QtaXRlbS9vLWxpc3QtaXRlbS5kaXJlY3RpdmUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MSVNUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQ09NUE9ORU5ULFxuXG4gIC8vIHF1aWNrLWZpbHRlci1jb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBmaWx0ZXIsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVpY2tGaWx0ZXJDb2x1bW5zOiBxdWljay1maWx0ZXItY29sdW1ucycsXG5cbiAgLy8gcmVmcmVzaC1idXR0b24gW25vfHllc106IHNob3cgcmVmcmVzaCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ3JlZnJlc2hCdXR0b246IHJlZnJlc2gtYnV0dG9uJyxcblxuICAncm91dGUnLFxuXG4gICdzZWxlY3RhYmxlJyxcblxuICAnb2RlbnNlIDogZGVuc2UnLFxuXG4gIC8vIGRlbGV0ZS1idXR0b24gW25vfHllc106IHNob3cgZGVsZXRlIGJ1dHRvbiB3aGVuIHVzZXIgc2VsZWN0IGl0ZW1zLiBEZWZhdWx0OiB5ZXMuXG4gICdkZWxldGVCdXR0b246IGRlbGV0ZS1idXR0b24nLFxuXG4gIC8vIHNvcnQtY29sdW1ucyBbc3RyaW5nXTogaW5pdGlhbCBzb3J0aW5nLCB3aXRoIHRoZSBmb3JtYXQgY29sdW1uOltBU0N8REVTQ10sIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc29ydENvbHVtbnM6IHNvcnQtY29sdW1ucycsXG5cbiAgLy8gaW5zZXJ0LWJ1dHRvbi1wb3NpdGlvbiBbIHRvcCB8IGJvdHRvbSBdOiBwb3NpdGlvbiBvZiB0aGUgaW5zZXJ0IGJ1dHRvbi4gRGVmYXVsdDogJ2JvdHRvbSdcbiAgJ2luc2VydEJ1dHRvblBvc2l0aW9uOmluc2VydC1idXR0b24tcG9zaXRpb24nLFxuXG4gIC8vIGluc2VydC1idXR0b24tZmxvYXRhYmxlIFtub3x5ZXNdOiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gcG9zaXRpb24gb2YgdGhlIGluc2VydCBidXR0b24gaXMgZmxvYXRpbmcgLiBEZWZhdWx0OiAneWVzJ1xuICAnaW5zZXJ0QnV0dG9uRmxvYXRhYmxlOmluc2VydC1idXR0b24tZmxvYXRhYmxlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0xJU1QgPSBbXG4gICdvbkNsaWNrJyxcbiAgJ29uRG91YmxlQ2xpY2snLFxuICAnb25JbnNlcnRCdXR0b25DbGljaycsXG4gICdvbkl0ZW1EZWxldGVkJyxcbiAgJ29uRGF0YUxvYWRlZCcsXG4gICdvblBhZ2luYXRlZERhdGFMb2FkZWQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QnLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlclxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTElTVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fTElTVCxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbGlzdC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWxpc3RdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RDb21wb25lbnQgZXh0ZW5kcyBPU2VydmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIElMaXN0LCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICBwdWJsaWMgbGlzdEl0ZW1Db21wb25lbnRzOiBJTGlzdEl0ZW1bXSA9IFtdO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oT0xpc3RJdGVtRGlyZWN0aXZlKVxuICBwdWJsaWMgbGlzdEl0ZW1EaXJlY3RpdmVzOiBRdWVyeUxpc3Q8T0xpc3RJdGVtRGlyZWN0aXZlPjtcblxuICAvKiBJbnB1dHMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHJlZnJlc2hCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2VsZWN0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb2RlbnNlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBkZWxldGVCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgaW5zZXJ0QnV0dG9uRmxvYXRhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHF1aWNrRmlsdGVyQ29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgcm91dGU6IHN0cmluZztcbiAgcHVibGljIHNvcnRDb2x1bW5zOiBzdHJpbmc7XG4gIC8qIEVuZCBJbnB1dHMgKi9cblxuICBwdWJsaWMgc29ydENvbEFycmF5OiBTUUxPcmRlcltdID0gW107XG5cbiAgcHVibGljIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Eb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkluc2VydEJ1dHRvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uSXRlbURlbGV0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUGFnaW5hdGVkRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIHNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxFbGVtZW50Pih0cnVlLCBbXSk7XG4gIHB1YmxpYyBlbmFibGVkRGVsZXRlQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpbnNlcnRCdXR0b25Qb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJyA9ICdib3R0b20nO1xuICBwcm90ZWN0ZWQgZGF0YVJlc3BvbnNlQXJyYXk6IGFueVtdID0gW107XG4gIHByb3RlY3RlZCBzdG9yZVBhZ2luYXRpb25TdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50XG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbFJlZiwgZm9ybSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMuc2VsZWN0aW9uLmNoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHRoaXMuZW5hYmxlZERlbGV0ZUJ1dHRvbiA9ICF0aGlzLnNlbGVjdGlvbi5pc0VtcHR5KCkpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIuYWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMucGFyc2VTb3J0Q29sdW1ucygpO1xuICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9IHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZScpID9cbiAgICAgIHRoaXMuc3RhdGVbJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZSddIDogdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnNlYXJjaElucHV0Q29tcG9uZW50KSkge1xuICAgICAgdGhpcy5yZWdpc3RlclF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoSW5wdXRDb21wb25lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRMaXN0SXRlbURpcmVjdGl2ZXNEYXRhKCk7XG4gICAgdGhpcy5saXN0SXRlbURpcmVjdGl2ZXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zZXRMaXN0SXRlbURpcmVjdGl2ZXNEYXRhKCkpO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuc3RhdGljRGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gY2hhbmdlcy5zdGF0aWNEYXRhLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGNvbnN0IGZpbHRlciA9ICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUuZmlsdGVyVmFsdWUpID8gdGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZmlsdGVyRGF0YShmaWx0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRDb21wb25lbnRLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ09MaXN0Q29tcG9uZW50XycgKyB0aGlzLm9hdHRyO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSAmJiB0aGlzLnN0YXRpY0RhdGEubGVuZ3RoKSB7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gdGhpcy5zdGF0aWNEYXRhO1xuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucXVpY2tGaWx0ZXJDb2x1bW5zKSkge1xuICAgICAgdGhpcy5xdWlja0ZpbHRlckNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgfVxuICAgIHRoaXMucXVpY2tGaWx0ZXJDb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnF1aWNrRmlsdGVyQ29sdW1ucywgdHJ1ZSk7XG4gICAgbGV0IGluaXRpYWxRdWVyeUxlbmd0aDogbnVtYmVyO1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdxdWVyeVJlY29yZE9mZnNldCcpKSB7XG4gICAgICBpbml0aWFsUXVlcnlMZW5ndGggPSB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0ID0gMDtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ3RvdGFsUXVlcnlSZWNvcmRzTnVtYmVyJykpIHtcbiAgICAgIHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgPSAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeU9uSW5pdCkge1xuICAgICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBsZW5ndGg6IGluaXRpYWxRdWVyeUxlbmd0aCB8fCB0aGlzLnF1ZXJ5Um93c1xuICAgICAgfTtcbiAgICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVpbml0aWFsaXplKG9wdGlvbnM6IE9MaXN0SW5pdGlhbGl6YXRpb25PcHRpb25zKTogdm9pZCB7XG4gICAgc3VwZXIucmVpbml0aWFsaXplKG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTGlzdEl0ZW1EaXJlY3RpdmUoaXRlbTogT0xpc3RJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW0ub25DbGljayhkaXJlY3RpdmVJdGVtID0+IHRoaXMub25JdGVtRGV0YWlsQ2xpY2soZGlyZWN0aXZlSXRlbSkpO1xuICAgICAgaXRlbS5vbkRvdWJsZUNsaWNrKGRpcmVjdGl2ZUl0ZW0gPT4gdGhpcy5vbkl0ZW1EZXRhaWxEb3VibGVDbGljayhkaXJlY3RpdmVJdGVtKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldERlbnNlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9kZW5zZTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxpc3RJdGVtQ2xpY2tlZChvbk5leHQ6IChpdGVtOiBPTGlzdEl0ZW1EaXJlY3RpdmUpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5vbkNsaWNrLCBvbk5leHQpO1xuICB9XG5cbiAgcHVibGljIG9uSXRlbURldGFpbENsaWNrKGl0ZW06IE9MaXN0SXRlbURpcmVjdGl2ZSB8IElMaXN0SXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGRhdGEgPSBpdGVtLmdldEl0ZW1EYXRhKCk7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgdGhpcy5kZXRhaWxNb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ2xpY2ssIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIG9uSXRlbURldGFpbERvdWJsZUNsaWNrKGl0ZW06IE9MaXN0SXRlbURpcmVjdGl2ZSB8IElMaXN0SXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGRhdGEgPSBpdGVtLmdldEl0ZW1EYXRhKCk7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgQ29kZXMuaXNEb3VibGVDbGlja01vZGUodGhpcy5kZXRhaWxNb2RlKSkge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRG91YmxlQ2xpY2ssIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgY29uc3QgZGF0YVRvU3RvcmUgPSBzdXBlci5nZXREYXRhVG9TdG9yZSgpO1xuICAgIGlmICghdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSkge1xuICAgICAgZGVsZXRlIGRhdGFUb1N0b3JlWydxdWVyeVJlY29yZE9mZnNldCddO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWlja0ZpbHRlciAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSkge1xuICAgICAgZGF0YVRvU3RvcmVbJ3F1aWNrRmlsdGVyQWN0aXZlQ29sdW1ucyddID0gdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5nZXRBY3RpdmVDb2x1bW5zKCkuam9pbihDb2Rlcy5BUlJBWV9JTlBVVF9TRVBBUkFUT1IpO1xuICAgIH1cbiAgICBkYXRhVG9TdG9yZVsnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJ10gPSB0aGlzLmlzRmlsdGVyQ2FzZVNlbnNpdGl2ZSgpO1xuICAgIHJldHVybiBkYXRhVG9TdG9yZTtcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWREYXRhKCk6IHZvaWQge1xuICAgIGxldCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge307XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSAwO1xuICAgICAgcXVlcnlBcmdzID0ge1xuICAgICAgICBsZW5ndGg6IE1hdGgubWF4KHRoaXMucXVlcnlSb3dzLCB0aGlzLmRhdGFSZXNwb25zZUFycmF5Lmxlbmd0aCksXG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgIC8vIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4ZXMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IFtdO1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgZGF0YSBsb2NhbGx5XG4gICAqIEBwYXJhbSB2YWx1ZSB0aGUgZmlsdGVyaW5nIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgZmlsdGVyRGF0YSh2YWx1ZTogc3RyaW5nLCBsb2FkTW9yZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZSkge1xuICAgICAgdGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBsZW5ndGg6IHRoaXMucXVlcnlSb3dzLFxuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9O1xuICAgICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCAmJiB0aGlzLmRhdGFSZXNwb25zZUFycmF5ICYmIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCBjYXNlU2Vuc2l0aXZlID0gdGhpcy5pc0ZpbHRlckNhc2VTZW5zaXRpdmUoKTtcbiAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICByZXR1cm4gc2VsZi5nZXRRdWlja0ZpbHRlckNvbHVtbnMoKS5zb21lKGNvbCA9PiB7XG4gICAgICAgICAgY29uc3QgcmVnRXhwU3RyID0gVXRpbC5lc2NhcGVTcGVjaWFsQ2hhcmFjdGVyKFV0aWwubm9ybWFsaXplU3RyaW5nKHZhbHVlLCAhY2FzZVNlbnNpdGl2ZSkpO1xuICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHJlZ0V4cFN0cikudGVzdChVdGlsLm5vcm1hbGl6ZVN0cmluZyhpdGVtW2NvbF0gKyAnJywgIWNhc2VTZW5zaXRpdmUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KGZpbHRlcmVkRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0l0ZW1TZWxlY3RlZChpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChpdGVtKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVTZWxlY3RlZFN0YXRlKGl0ZW06IG9iamVjdCwgaXNTZWxlY3RlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleGVzIHx8IFtdO1xuICAgIGNvbnN0IGl0ZW1JbmRleCA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgICBpZiAoaXNTZWxlY3RlZCAmJiBzZWxlY3RlZEluZGV4ZXMuaW5kZXhPZihpdGVtSW5kZXgpID09PSAtMSkge1xuICAgICAgc2VsZWN0ZWRJbmRleGVzLnB1c2goaXRlbUluZGV4KTtcbiAgICB9IGVsc2UgaWYgKCFpc1NlbGVjdGVkKSB7XG4gICAgICBzZWxlY3RlZEluZGV4ZXMuc3BsaWNlKHNlbGVjdGVkSW5kZXhlcy5pbmRleE9mKGl0ZW1JbmRleCksIDEpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXhlcyA9IHNlbGVjdGVkSW5kZXhlcztcbiAgfVxuXG4gIHB1YmxpYyBvblNjcm9sbChlOiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBjb25zdCBwZW5kaW5nUmVnaXN0cmllcyA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoIDwgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlcjtcbiAgICAgIGlmICghdGhpcy5sb2FkaW5nU3ViamVjdC52YWx1ZSAmJiBwZW5kaW5nUmVnaXN0cmllcykge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZS50YXJnZXQgYXMgYW55O1xuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRIZWlnaHQgKyBlbGVtZW50LnNjcm9sbFRvcCArIDUgPj0gZWxlbWVudC5zY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0LFxuICAgICAgICAgICAgbGVuZ3RoOiB0aGlzLnF1ZXJ5Um93c1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZShjbGVhclNlbGVjdGVkSXRlbXM6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0RFTEVURScpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLmRhdGFTZXJ2aWNlICYmICh0aGlzLmRlbGV0ZU1ldGhvZCBpbiB0aGlzLmRhdGFTZXJ2aWNlKSAmJiB0aGlzLmVudGl0eSAmJiAodGhpcy5rZXlzQXJyYXkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcnMgPSBTZXJ2aWNlVXRpbHMuZ2V0QXJyYXlQcm9wZXJ0aWVzKHNlbGVjdGVkSXRlbXMsIHRoaXMua2V5c0FycmF5KTtcbiAgICAgICAgICAgIG1lcmdlKGZpbHRlcnMubWFwKChrdiA9PiB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMuZGVsZXRlTWV0aG9kXShrdiwgdGhpcy5lbnRpdHkpKSkpLnN1YnNjcmliZShvYnMgPT4gb2JzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25JdGVtRGVsZXRlZCwgc2VsZWN0ZWRJdGVtcyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfREVMRVRFJyk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUxvY2FsSXRlbXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2xlYXJTZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIHRoaXMub25JbnNlcnRCdXR0b25DbGljay5lbWl0KGUpO1xuICAgIHN1cGVyLmluc2VydERldGFpbCgpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU29ydENvbHVtbnMoKTogdm9pZCB7XG4gICAgY29uc3Qgc29ydENvbHVtbnNQYXJhbSA9IHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddIHx8IHRoaXMuc29ydENvbHVtbnM7XG4gICAgdGhpcy5zb3J0Q29sQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyhzb3J0Q29sdW1uc1BhcmFtKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXI6IG9iamVjdCwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncyk6IGFueVtdIHtcbiAgICBjb25zdCBxdWVyeUFyZ3VtZW50cyA9IHN1cGVyLmdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlciwgb3ZyckFyZ3MpO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBxdWVyeUFyZ3VtZW50c1s2XSA9IHRoaXMuc29ydENvbEFycmF5O1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICByZWdpc3Rlckl0ZW0oaXRlbTogSUxpc3RJdGVtKTogdm9pZCB7XG4gICAgdGhpcy5saXN0SXRlbUNvbXBvbmVudHMucHVzaChpdGVtKTtcbiAgICBpZiAodGhpcy5kYXRhUmVzcG9uc2VBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBpdGVtLnNldEl0ZW1EYXRhKHRoaXMuZGF0YVJlc3BvbnNlQXJyYXlbdGhpcy5saXN0SXRlbUNvbXBvbmVudHMubGVuZ3RoIC0gMV0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMaXN0SXRlbURpcmVjdGl2ZXNEYXRhKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdEl0ZW1EaXJlY3RpdmVzLmZvckVhY2goKGVsZW1lbnQ6IE9MaXN0SXRlbURpcmVjdGl2ZSwgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuc2V0SXRlbURhdGEodGhpcy5kYXRhUmVzcG9uc2VBcnJheVtpbmRleF0pO1xuICAgICAgZWxlbWVudC5zZXRMaXN0Q29tcG9uZW50KHRoaXMpO1xuICAgICAgdGhpcy5yZWdpc3Rlckxpc3RJdGVtRGlyZWN0aXZlKGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk6IHZvaWQge1xuICAgIHN1cGVyLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSA9IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0YShkYXRhOiBhbnksIHNxbFR5cGVzPzogYW55LCByZXBsYWNlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGxldCByZXNwRGF0YUFycmF5ID0gZGF0YTtcbiAgICAgIGlmICh0aGlzLnBhZ2VhYmxlICYmICFyZXBsYWNlKSB7XG4gICAgICAgIHJlc3BEYXRhQXJyYXkgPSAodGhpcy5kYXRhUmVzcG9uc2VBcnJheSB8fCBbXSkuY29uY2F0KGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXhlcyB8fCBbXTtcbiAgICAgIGZvciAoY29uc3Qgc2VsSW5kZXggb2Ygc2VsZWN0ZWRJbmRleGVzKSB7XG4gICAgICAgIGlmIChzZWxJbmRleCA8IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0KHRoaXMuZGF0YVJlc3BvbnNlQXJyYXlbc2VsSW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IHJlc3BEYXRhQXJyYXk7XG4gICAgICBpZiAoIXRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJEYXRhKHRoaXMuc3RhdGUuZmlsdGVyVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhQXJyYXkodGhpcy5kYXRhUmVzcG9uc2VBcnJheSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KFtdKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblBhZ2luYXRlZERhdGFMb2FkZWQsIGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRGF0YUxvYWRlZCwgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSk7XG4gIH1cblxufVxuIl19