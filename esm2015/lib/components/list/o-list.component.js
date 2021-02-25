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
export const DEFAULT_INPUTS_O_LIST = [
    ...DEFAULT_INPUTS_O_SERVICE_COMPONENT,
    'quickFilterColumns: quick-filter-columns',
    'refreshButton: refresh-button',
    'route',
    'selectable',
    'odense : dense',
    'deleteButton: delete-button',
    'sortColumns: sort-columns',
    'insertButtonPosition:insert-button-position',
    'insertButtonFloatable:insert-button-floatable'
];
export const DEFAULT_OUTPUTS_O_LIST = [
    'onClick',
    'onDoubleClick',
    'onInsertButtonClick',
    'onItemDeleted',
    'onDataLoaded',
    'onPaginatedDataLoaded'
];
export class OListComponent extends OServiceComponent {
    constructor(injector, elRef, form) {
        super(injector, elRef, form);
        this.listItemComponents = [];
        this.refreshButton = true;
        this.selectable = false;
        this.odense = false;
        this.deleteButton = true;
        this.insertButtonFloatable = true;
        this.sortColArray = [];
        this.onClick = new EventEmitter();
        this.onDoubleClick = new EventEmitter();
        this.onInsertButtonClick = new EventEmitter();
        this.onItemDeleted = new EventEmitter();
        this.onDataLoaded = new EventEmitter();
        this.onPaginatedDataLoaded = new EventEmitter();
        this.selection = new SelectionModel(true, []);
        this.enabledDeleteButton = false;
        this.insertButtonPosition = 'bottom';
        this.dataResponseArray = [];
        this.storePaginationState = false;
        this.subscription = new Subscription();
    }
    ngOnInit() {
        this.initialize();
        this.subscription.add(this.selection.changed.subscribe(() => this.enabledDeleteButton = !this.selection.isEmpty()));
    }
    ngAfterViewInit() {
        super.afterViewInit();
        this.parseSortColumns();
        this.filterCaseSensitive = this.state.hasOwnProperty('filter-case-sensitive') ?
            this.state['filter-case-sensitive'] : this.filterCaseSensitive;
        if (Util.isDefined(this.searchInputComponent)) {
            this.registerQuickFilter(this.searchInputComponent);
        }
    }
    ngAfterContentInit() {
        this.setListItemDirectivesData();
        this.listItemDirectives.changes.subscribe(() => this.setListItemDirectivesData());
    }
    ngOnDestroy() {
        this.destroy();
        this.subscription.unsubscribe();
    }
    ngOnChanges(changes) {
        if (changes.staticData !== undefined) {
            this.dataResponseArray = changes.staticData.currentValue;
            const filter = (this.state && this.state.filterValue) ? this.state.filterValue : undefined;
            this.filterData(filter);
        }
    }
    getComponentKey() {
        return 'OListComponent_' + this.oattr;
    }
    initialize() {
        super.initialize();
        if (this.staticData && this.staticData.length) {
            this.dataResponseArray = this.staticData;
        }
        if (!Util.isDefined(this.quickFilterColumns)) {
            this.quickFilterColumns = this.columns;
        }
        this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
        let initialQueryLength;
        if (this.state.hasOwnProperty('queryRecordOffset')) {
            initialQueryLength = this.state.queryRecordOffset;
        }
        this.state.queryRecordOffset = 0;
        if (!this.state.hasOwnProperty('totalQueryRecordsNumber')) {
            this.state.totalQueryRecordsNumber = 0;
        }
        if (this.queryOnInit) {
            const queryArgs = {
                offset: 0,
                length: initialQueryLength || this.queryRows
            };
            this.queryData(void 0, queryArgs);
        }
    }
    reinitialize(options) {
        super.reinitialize(options);
    }
    registerListItemDirective(item) {
        if (item) {
            item.onClick(directiveItem => this.onItemDetailClick(directiveItem));
            item.onDoubleClick(directiveItem => this.onItemDetailDoubleClick(directiveItem));
        }
    }
    getDense() {
        return this.odense;
    }
    onListItemClicked(onNext) {
        return ObservableWrapper.subscribe(this.onClick, onNext);
    }
    onItemDetailClick(item) {
        const data = item.getItemData();
        if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(data);
        }
        ObservableWrapper.callEmit(this.onClick, data);
    }
    onItemDetailDoubleClick(item) {
        const data = item.getItemData();
        if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
            this.saveDataNavigationInLocalStorage();
            this.viewDetail(data);
        }
        ObservableWrapper.callEmit(this.onDoubleClick, data);
    }
    getDataToStore() {
        const dataToStore = super.getDataToStore();
        if (!this.storePaginationState) {
            delete dataToStore['queryRecordOffset'];
        }
        if (this.quickFilter && Util.isDefined(this.quickFilterComponent)) {
            dataToStore['quickFilterActiveColumns'] = this.quickFilterComponent.getActiveColumns().join(Codes.ARRAY_INPUT_SEPARATOR);
        }
        dataToStore['filter-case-sensitive'] = this.isFilterCaseSensitive();
        return dataToStore;
    }
    reloadData() {
        let queryArgs = {};
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
    }
    reloadPaginatedDataFromStart() {
        this.dataResponseArray = [];
        this.reloadData();
    }
    filterData(value, loadMore) {
        if (this.state) {
            this.state.filterValue = value;
        }
        if (this.pageable) {
            const queryArgs = {
                offset: 0,
                length: this.queryRows,
                replace: true
            };
            this.queryData(void 0, queryArgs);
        }
        else if (value && value.length > 0 && this.dataResponseArray && this.dataResponseArray.length > 0) {
            const self = this;
            const caseSensitive = this.isFilterCaseSensitive();
            const filteredData = this.dataResponseArray.filter(item => {
                return self.getQuickFilterColumns().some(col => {
                    const regExpStr = Util.escapeSpecialCharacter(Util.normalizeString(value, !caseSensitive));
                    return new RegExp(regExpStr).test(Util.normalizeString(item[col] + '', !caseSensitive));
                });
            });
            this.setDataArray(filteredData);
        }
        else {
            this.setDataArray(this.dataResponseArray);
        }
    }
    isItemSelected(item) {
        return this.selection.isSelected(item);
    }
    updateSelectedState(item, isSelected) {
        const selectedIndexes = this.state.selectedIndexes || [];
        const itemIndex = this.dataResponseArray.indexOf(item);
        if (isSelected && selectedIndexes.indexOf(itemIndex) === -1) {
            selectedIndexes.push(itemIndex);
        }
        else if (!isSelected) {
            selectedIndexes.splice(selectedIndexes.indexOf(itemIndex), 1);
        }
        this.state.selectedIndexes = selectedIndexes;
    }
    onScroll(e) {
        if (this.pageable) {
            const pendingRegistries = this.dataResponseArray.length < this.state.totalQueryRecordsNumber;
            if (!this.loadingSubject.value && pendingRegistries) {
                const element = e.target;
                if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
                    const queryArgs = {
                        offset: this.state.queryRecordOffset,
                        length: this.queryRows
                    };
                    this.queryData(void 0, queryArgs);
                }
            }
        }
    }
    remove(clearSelectedItems = false) {
        const selectedItems = this.getSelectedItems();
        if (selectedItems.length > 0) {
            this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
                if (res === true) {
                    if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
                        const filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
                        merge(filters.map((kv => this.dataService[this.deleteMethod](kv, this.entity)))).subscribe(obs => obs.subscribe(() => {
                            ObservableWrapper.callEmit(this.onItemDeleted, selectedItems);
                        }, error => {
                            this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
                        }, () => {
                            this.reloadData();
                        }));
                    }
                    else {
                        this.deleteLocalItems();
                    }
                }
                else if (clearSelectedItems) {
                    this.clearSelection();
                }
            });
        }
    }
    add(e) {
        this.onInsertButtonClick.emit(e);
        super.insertDetail();
    }
    parseSortColumns() {
        const sortColumnsParam = this.state['sort-columns'] || this.sortColumns;
        this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);
    }
    getQueryArguments(filter, ovrrArgs) {
        const queryArguments = super.getQueryArguments(filter, ovrrArgs);
        if (this.pageable) {
            queryArguments[6] = this.sortColArray;
        }
        return queryArguments;
    }
    registerItem(item) {
        this.listItemComponents.push(item);
        if (this.dataResponseArray.length > 0) {
            item.setItemData(this.dataResponseArray[this.listItemComponents.length - 1]);
        }
    }
    setListItemDirectivesData() {
        this.listItemDirectives.forEach((element, index) => {
            element.setItemData(this.dataResponseArray[index]);
            element.setListComponent(this);
            this.registerListItemDirective(element);
        });
    }
    saveDataNavigationInLocalStorage() {
        super.saveDataNavigationInLocalStorage();
        this.storePaginationState = true;
    }
    setData(data, sqlTypes, replace) {
        if (Util.isArray(data)) {
            let respDataArray = data;
            if (this.pageable && !replace) {
                respDataArray = (this.dataResponseArray || []).concat(data);
            }
            const selectedIndexes = this.state.selectedIndexes || [];
            for (const selIndex of selectedIndexes) {
                if (selIndex < this.dataResponseArray.length) {
                    this.selection.select(this.dataResponseArray[selIndex]);
                }
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
    }
}
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
OListComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L28tbGlzdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMxRCxPQUFPLEVBR0wsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUlSLFFBQVEsRUFDUixTQUFTLEVBRVQsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUdsRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUluRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDckcsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFdkUsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQUc7SUFDbkMsR0FBRyxrQ0FBa0M7SUFHckMsMENBQTBDO0lBRzFDLCtCQUErQjtJQUUvQixPQUFPO0lBRVAsWUFBWTtJQUVaLGdCQUFn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dCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZSxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBtZXJnZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUxpc3RJdGVtIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vLWxpc3QtaXRlbS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUxpc3QgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL28tbGlzdC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgT0xpc3RJbml0aWFsaXphdGlvbk9wdGlvbnMgfSBmcm9tICcuLi8uLi90eXBlcy9vLWxpc3QtaW5pdGlhbGl6YXRpb24tb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuaW1wb3J0IHsgU1FMT3JkZXIgfSBmcm9tICcuLi8uLi90eXBlcy9zcWwtb3JkZXIudHlwZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fU0VSVklDRV9DT01QT05FTlQsIE9TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPTGlzdEl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuL2xpc3QtaXRlbS9vLWxpc3QtaXRlbS5kaXJlY3RpdmUnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MSVNUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1NFUlZJQ0VfQ09NUE9ORU5ULFxuXG4gIC8vIHF1aWNrLWZpbHRlci1jb2x1bW5zIFtzdHJpbmddOiBjb2x1bW5zIG9mIHRoZSBmaWx0ZXIsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAncXVpY2tGaWx0ZXJDb2x1bW5zOiBxdWljay1maWx0ZXItY29sdW1ucycsXG5cbiAgLy8gcmVmcmVzaC1idXR0b24gW25vfHllc106IHNob3cgcmVmcmVzaCBidXR0b24uIERlZmF1bHQ6IHllcy5cbiAgJ3JlZnJlc2hCdXR0b246IHJlZnJlc2gtYnV0dG9uJyxcblxuICAncm91dGUnLFxuXG4gICdzZWxlY3RhYmxlJyxcblxuICAnb2RlbnNlIDogZGVuc2UnLFxuXG4gIC8vIGRlbGV0ZS1idXR0b24gW25vfHllc106IHNob3cgZGVsZXRlIGJ1dHRvbiB3aGVuIHVzZXIgc2VsZWN0IGl0ZW1zLiBEZWZhdWx0OiB5ZXMuXG4gICdkZWxldGVCdXR0b246IGRlbGV0ZS1idXR0b24nLFxuXG4gIC8vIHNvcnQtY29sdW1ucyBbc3RyaW5nXTogaW5pdGlhbCBzb3J0aW5nLCB3aXRoIHRoZSBmb3JtYXQgY29sdW1uOltBU0N8REVTQ10sIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc29ydENvbHVtbnM6IHNvcnQtY29sdW1ucycsXG5cbiAgLy8gaW5zZXJ0LWJ1dHRvbi1wb3NpdGlvbiBbIHRvcCB8IGJvdHRvbSBdOiBwb3NpdGlvbiBvZiB0aGUgaW5zZXJ0IGJ1dHRvbi4gRGVmYXVsdDogJ2JvdHRvbSdcbiAgJ2luc2VydEJ1dHRvblBvc2l0aW9uOmluc2VydC1idXR0b24tcG9zaXRpb24nLFxuXG4gIC8vIGluc2VydC1idXR0b24tZmxvYXRhYmxlIFtub3x5ZXNdOiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gcG9zaXRpb24gb2YgdGhlIGluc2VydCBidXR0b24gaXMgZmxvYXRpbmcgLiBEZWZhdWx0OiAneWVzJ1xuICAnaW5zZXJ0QnV0dG9uRmxvYXRhYmxlOmluc2VydC1idXR0b24tZmxvYXRhYmxlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0xJU1QgPSBbXG4gICdvbkNsaWNrJyxcbiAgJ29uRG91YmxlQ2xpY2snLFxuICAnb25JbnNlcnRCdXR0b25DbGljaycsXG4gICdvbkl0ZW1EZWxldGVkJyxcbiAgJ29uRGF0YUxvYWRlZCcsXG4gICdvblBhZ2luYXRlZERhdGFMb2FkZWQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QnLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlclxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTElTVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fTElTVCxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbGlzdC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWxpc3RdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RDb21wb25lbnQgZXh0ZW5kcyBPU2VydmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIElMaXN0LCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT25DaGFuZ2VzIHtcblxuICBwdWJsaWMgbGlzdEl0ZW1Db21wb25lbnRzOiBJTGlzdEl0ZW1bXSA9IFtdO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oT0xpc3RJdGVtRGlyZWN0aXZlKVxuICBwdWJsaWMgbGlzdEl0ZW1EaXJlY3RpdmVzOiBRdWVyeUxpc3Q8T0xpc3RJdGVtRGlyZWN0aXZlPjtcblxuICAvKiBJbnB1dHMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHJlZnJlc2hCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc2VsZWN0YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb2RlbnNlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBkZWxldGVCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgaW5zZXJ0QnV0dG9uRmxvYXRhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHF1aWNrRmlsdGVyQ29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgcm91dGU6IHN0cmluZztcbiAgcHVibGljIHNvcnRDb2x1bW5zOiBzdHJpbmc7XG4gIC8qIEVuZCBJbnB1dHMgKi9cblxuICBwdWJsaWMgc29ydENvbEFycmF5OiBTUUxPcmRlcltdID0gW107XG5cbiAgcHVibGljIG9uQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25Eb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyBvbkluc2VydEJ1dHRvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uSXRlbURlbGV0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EYXRhTG9hZGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uUGFnaW5hdGVkRGF0YUxvYWRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIHNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxFbGVtZW50Pih0cnVlLCBbXSk7XG4gIHB1YmxpYyBlbmFibGVkRGVsZXRlQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpbnNlcnRCdXR0b25Qb3NpdGlvbjogJ3RvcCcgfCAnYm90dG9tJyA9ICdib3R0b20nO1xuICBwcm90ZWN0ZWQgZGF0YVJlc3BvbnNlQXJyYXk6IGFueVtdID0gW107XG4gIHByb3RlY3RlZCBzdG9yZVBhZ2luYXRpb25TdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50XG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yLCBlbFJlZiwgZm9ybSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMuc2VsZWN0aW9uLmNoYW5nZWQuc3Vic2NyaWJlKCgpID0+IHRoaXMuZW5hYmxlZERlbGV0ZUJ1dHRvbiA9ICF0aGlzLnNlbGVjdGlvbi5pc0VtcHR5KCkpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIuYWZ0ZXJWaWV3SW5pdCgpO1xuICAgIHRoaXMucGFyc2VTb3J0Q29sdW1ucygpO1xuICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9IHRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZScpID9cbiAgICAgIHRoaXMuc3RhdGVbJ2ZpbHRlci1jYXNlLXNlbnNpdGl2ZSddIDogdGhpcy5maWx0ZXJDYXNlU2Vuc2l0aXZlO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnNlYXJjaElucHV0Q29tcG9uZW50KSkge1xuICAgICAgdGhpcy5yZWdpc3RlclF1aWNrRmlsdGVyKHRoaXMuc2VhcmNoSW5wdXRDb21wb25lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRMaXN0SXRlbURpcmVjdGl2ZXNEYXRhKCk7XG4gICAgdGhpcy5saXN0SXRlbURpcmVjdGl2ZXMuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zZXRMaXN0SXRlbURpcmVjdGl2ZXNEYXRhKCkpO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMuc3RhdGljRGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gY2hhbmdlcy5zdGF0aWNEYXRhLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGNvbnN0IGZpbHRlciA9ICh0aGlzLnN0YXRlICYmIHRoaXMuc3RhdGUuZmlsdGVyVmFsdWUpID8gdGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZmlsdGVyRGF0YShmaWx0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXRDb21wb25lbnRLZXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gJ09MaXN0Q29tcG9uZW50XycgKyB0aGlzLm9hdHRyO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGljRGF0YSAmJiB0aGlzLnN0YXRpY0RhdGEubGVuZ3RoKSB7XG4gICAgICB0aGlzLmRhdGFSZXNwb25zZUFycmF5ID0gdGhpcy5zdGF0aWNEYXRhO1xuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMucXVpY2tGaWx0ZXJDb2x1bW5zKSkge1xuICAgICAgdGhpcy5xdWlja0ZpbHRlckNvbHVtbnMgPSB0aGlzLmNvbHVtbnM7XG4gICAgfVxuICAgIHRoaXMucXVpY2tGaWx0ZXJDb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLnF1aWNrRmlsdGVyQ29sdW1ucywgdHJ1ZSk7XG4gICAgbGV0IGluaXRpYWxRdWVyeUxlbmd0aDogbnVtYmVyO1xuICAgIGlmICh0aGlzLnN0YXRlLmhhc093blByb3BlcnR5KCdxdWVyeVJlY29yZE9mZnNldCcpKSB7XG4gICAgICBpbml0aWFsUXVlcnlMZW5ndGggPSB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0ID0gMDtcbiAgICBpZiAoIXRoaXMuc3RhdGUuaGFzT3duUHJvcGVydHkoJ3RvdGFsUXVlcnlSZWNvcmRzTnVtYmVyJykpIHtcbiAgICAgIHRoaXMuc3RhdGUudG90YWxRdWVyeVJlY29yZHNOdW1iZXIgPSAwO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWVyeU9uSW5pdCkge1xuICAgICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBsZW5ndGg6IGluaXRpYWxRdWVyeUxlbmd0aCB8fCB0aGlzLnF1ZXJ5Um93c1xuICAgICAgfTtcbiAgICAgIHRoaXMucXVlcnlEYXRhKHZvaWQgMCwgcXVlcnlBcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVpbml0aWFsaXplKG9wdGlvbnM6IE9MaXN0SW5pdGlhbGl6YXRpb25PcHRpb25zKTogdm9pZCB7XG4gICAgc3VwZXIucmVpbml0aWFsaXplKG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyTGlzdEl0ZW1EaXJlY3RpdmUoaXRlbTogT0xpc3RJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgaWYgKGl0ZW0pIHtcbiAgICAgIGl0ZW0ub25DbGljayhkaXJlY3RpdmVJdGVtID0+IHRoaXMub25JdGVtRGV0YWlsQ2xpY2soZGlyZWN0aXZlSXRlbSkpO1xuICAgICAgaXRlbS5vbkRvdWJsZUNsaWNrKGRpcmVjdGl2ZUl0ZW0gPT4gdGhpcy5vbkl0ZW1EZXRhaWxEb3VibGVDbGljayhkaXJlY3RpdmVJdGVtKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldERlbnNlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm9kZW5zZTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxpc3RJdGVtQ2xpY2tlZChvbk5leHQ6IChpdGVtOiBPTGlzdEl0ZW1EaXJlY3RpdmUpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5vbkNsaWNrLCBvbk5leHQpO1xuICB9XG5cbiAgcHVibGljIG9uSXRlbURldGFpbENsaWNrKGl0ZW06IE9MaXN0SXRlbURpcmVjdGl2ZSB8IElMaXN0SXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGRhdGEgPSBpdGVtLmdldEl0ZW1EYXRhKCk7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgdGhpcy5kZXRhaWxNb2RlID09PSBDb2Rlcy5ERVRBSUxfTU9ERV9DTElDSykge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uQ2xpY2ssIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIG9uSXRlbURldGFpbERvdWJsZUNsaWNrKGl0ZW06IE9MaXN0SXRlbURpcmVjdGl2ZSB8IElMaXN0SXRlbSk6IHZvaWQge1xuICAgIGNvbnN0IGRhdGEgPSBpdGVtLmdldEl0ZW1EYXRhKCk7XG4gICAgaWYgKHRoaXMub2VuYWJsZWQgJiYgQ29kZXMuaXNEb3VibGVDbGlja01vZGUodGhpcy5kZXRhaWxNb2RlKSkge1xuICAgICAgdGhpcy5zYXZlRGF0YU5hdmlnYXRpb25JbkxvY2FsU3RvcmFnZSgpO1xuICAgICAgdGhpcy52aWV3RGV0YWlsKGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRG91YmxlQ2xpY2ssIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgY29uc3QgZGF0YVRvU3RvcmUgPSBzdXBlci5nZXREYXRhVG9TdG9yZSgpO1xuICAgIGlmICghdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSkge1xuICAgICAgZGVsZXRlIGRhdGFUb1N0b3JlWydxdWVyeVJlY29yZE9mZnNldCddO1xuICAgIH1cbiAgICBpZiAodGhpcy5xdWlja0ZpbHRlciAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnF1aWNrRmlsdGVyQ29tcG9uZW50KSkge1xuICAgICAgZGF0YVRvU3RvcmVbJ3F1aWNrRmlsdGVyQWN0aXZlQ29sdW1ucyddID0gdGhpcy5xdWlja0ZpbHRlckNvbXBvbmVudC5nZXRBY3RpdmVDb2x1bW5zKCkuam9pbihDb2Rlcy5BUlJBWV9JTlBVVF9TRVBBUkFUT1IpO1xuICAgIH1cbiAgICBkYXRhVG9TdG9yZVsnZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJ10gPSB0aGlzLmlzRmlsdGVyQ2FzZVNlbnNpdGl2ZSgpO1xuICAgIHJldHVybiBkYXRhVG9TdG9yZTtcbiAgfVxuXG4gIHB1YmxpYyByZWxvYWREYXRhKCk6IHZvaWQge1xuICAgIGxldCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge307XG4gICAgaWYgKHRoaXMucGFnZWFibGUpIHtcbiAgICAgIHRoaXMuc3RhdGUucXVlcnlSZWNvcmRPZmZzZXQgPSAwO1xuICAgICAgcXVlcnlBcmdzID0ge1xuICAgICAgICBsZW5ndGg6IE1hdGgubWF4KHRoaXMucXVlcnlSb3dzLCB0aGlzLmRhdGFSZXNwb25zZUFycmF5Lmxlbmd0aCksXG4gICAgICAgIHJlcGxhY2U6IHRydWVcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0aGlzLnNlbGVjdGFibGUpIHtcbiAgICAgIC8vIHRoaXMuc2VsZWN0ZWRJdGVtcyA9IFtdO1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4ZXMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IFtdO1xuICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbHRlcnMgZGF0YSBsb2NhbGx5XG4gICAqIEBwYXJhbSB2YWx1ZSB0aGUgZmlsdGVyaW5nIHZhbHVlXG4gICAqL1xuICBwdWJsaWMgZmlsdGVyRGF0YSh2YWx1ZTogc3RyaW5nLCBsb2FkTW9yZT86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdGF0ZSkge1xuICAgICAgdGhpcy5zdGF0ZS5maWx0ZXJWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgY29uc3QgcXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyA9IHtcbiAgICAgICAgb2Zmc2V0OiAwLFxuICAgICAgICBsZW5ndGg6IHRoaXMucXVlcnlSb3dzLFxuICAgICAgICByZXBsYWNlOiB0cnVlXG4gICAgICB9O1xuICAgICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICAgIH0gZWxzZSBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCAmJiB0aGlzLmRhdGFSZXNwb25zZUFycmF5ICYmIHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCBjYXNlU2Vuc2l0aXZlID0gdGhpcy5pc0ZpbHRlckNhc2VTZW5zaXRpdmUoKTtcbiAgICAgIGNvbnN0IGZpbHRlcmVkRGF0YSA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgICByZXR1cm4gc2VsZi5nZXRRdWlja0ZpbHRlckNvbHVtbnMoKS5zb21lKGNvbCA9PiB7XG4gICAgICAgICAgY29uc3QgcmVnRXhwU3RyID0gVXRpbC5lc2NhcGVTcGVjaWFsQ2hhcmFjdGVyKFV0aWwubm9ybWFsaXplU3RyaW5nKHZhbHVlLCAhY2FzZVNlbnNpdGl2ZSkpO1xuICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHJlZ0V4cFN0cikudGVzdChVdGlsLm5vcm1hbGl6ZVN0cmluZyhpdGVtW2NvbF0gKyAnJywgIWNhc2VTZW5zaXRpdmUpKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KGZpbHRlcmVkRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0l0ZW1TZWxlY3RlZChpdGVtOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb24uaXNTZWxlY3RlZChpdGVtKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVTZWxlY3RlZFN0YXRlKGl0ZW06IG9iamVjdCwgaXNTZWxlY3RlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleGVzIHx8IFtdO1xuICAgIGNvbnN0IGl0ZW1JbmRleCA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkuaW5kZXhPZihpdGVtKTtcbiAgICBpZiAoaXNTZWxlY3RlZCAmJiBzZWxlY3RlZEluZGV4ZXMuaW5kZXhPZihpdGVtSW5kZXgpID09PSAtMSkge1xuICAgICAgc2VsZWN0ZWRJbmRleGVzLnB1c2goaXRlbUluZGV4KTtcbiAgICB9IGVsc2UgaWYgKCFpc1NlbGVjdGVkKSB7XG4gICAgICBzZWxlY3RlZEluZGV4ZXMuc3BsaWNlKHNlbGVjdGVkSW5kZXhlcy5pbmRleE9mKGl0ZW1JbmRleCksIDEpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXhlcyA9IHNlbGVjdGVkSW5kZXhlcztcbiAgfVxuXG4gIHB1YmxpYyBvblNjcm9sbChlOiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBjb25zdCBwZW5kaW5nUmVnaXN0cmllcyA9IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoIDwgdGhpcy5zdGF0ZS50b3RhbFF1ZXJ5UmVjb3Jkc051bWJlcjtcbiAgICAgIGlmICghdGhpcy5sb2FkaW5nU3ViamVjdC52YWx1ZSAmJiBwZW5kaW5nUmVnaXN0cmllcykge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZS50YXJnZXQgYXMgYW55O1xuICAgICAgICBpZiAoZWxlbWVudC5vZmZzZXRIZWlnaHQgKyBlbGVtZW50LnNjcm9sbFRvcCArIDUgPj0gZWxlbWVudC5zY3JvbGxIZWlnaHQpIHtcbiAgICAgICAgICBjb25zdCBxdWVyeUFyZ3M6IE9RdWVyeURhdGFBcmdzID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLnN0YXRlLnF1ZXJ5UmVjb3JkT2Zmc2V0LFxuICAgICAgICAgICAgbGVuZ3RoOiB0aGlzLnF1ZXJ5Um93c1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5xdWVyeURhdGEodm9pZCAwLCBxdWVyeUFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlbW92ZShjbGVhclNlbGVjdGVkSXRlbXM6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldFNlbGVjdGVkSXRlbXMoKTtcbiAgICBpZiAoc2VsZWN0ZWRJdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdNRVNTQUdFUy5DT05GSVJNX0RFTEVURScpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICh0aGlzLmRhdGFTZXJ2aWNlICYmICh0aGlzLmRlbGV0ZU1ldGhvZCBpbiB0aGlzLmRhdGFTZXJ2aWNlKSAmJiB0aGlzLmVudGl0eSAmJiAodGhpcy5rZXlzQXJyYXkubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbHRlcnMgPSBTZXJ2aWNlVXRpbHMuZ2V0QXJyYXlQcm9wZXJ0aWVzKHNlbGVjdGVkSXRlbXMsIHRoaXMua2V5c0FycmF5KTtcbiAgICAgICAgICAgIG1lcmdlKGZpbHRlcnMubWFwKChrdiA9PiB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMuZGVsZXRlTWV0aG9kXShrdiwgdGhpcy5lbnRpdHkpKSkpLnN1YnNjcmliZShvYnMgPT4gb2JzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25JdGVtRGVsZXRlZCwgc2VsZWN0ZWRJdGVtcyk7XG4gICAgICAgICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5hbGVydCgnRVJST1InLCAnTUVTU0FHRVMuRVJST1JfREVMRVRFJyk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucmVsb2FkRGF0YSgpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUxvY2FsSXRlbXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2xlYXJTZWxlY3RlZEl0ZW1zKSB7XG4gICAgICAgICAgdGhpcy5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIHRoaXMub25JbnNlcnRCdXR0b25DbGljay5lbWl0KGUpO1xuICAgIHN1cGVyLmluc2VydERldGFpbCgpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU29ydENvbHVtbnMoKTogdm9pZCB7XG4gICAgY29uc3Qgc29ydENvbHVtbnNQYXJhbSA9IHRoaXMuc3RhdGVbJ3NvcnQtY29sdW1ucyddIHx8IHRoaXMuc29ydENvbHVtbnM7XG4gICAgdGhpcy5zb3J0Q29sQXJyYXkgPSBTZXJ2aWNlVXRpbHMucGFyc2VTb3J0Q29sdW1ucyhzb3J0Q29sdW1uc1BhcmFtKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRRdWVyeUFyZ3VtZW50cyhmaWx0ZXI6IG9iamVjdCwgb3ZyckFyZ3M/OiBPUXVlcnlEYXRhQXJncyk6IGFueVtdIHtcbiAgICBjb25zdCBxdWVyeUFyZ3VtZW50cyA9IHN1cGVyLmdldFF1ZXJ5QXJndW1lbnRzKGZpbHRlciwgb3ZyckFyZ3MpO1xuICAgIGlmICh0aGlzLnBhZ2VhYmxlKSB7XG4gICAgICBxdWVyeUFyZ3VtZW50c1s2XSA9IHRoaXMuc29ydENvbEFycmF5O1xuICAgIH1cbiAgICByZXR1cm4gcXVlcnlBcmd1bWVudHM7XG4gIH1cblxuICByZWdpc3Rlckl0ZW0oaXRlbTogSUxpc3RJdGVtKTogdm9pZCB7XG4gICAgdGhpcy5saXN0SXRlbUNvbXBvbmVudHMucHVzaChpdGVtKTtcbiAgICBpZiAodGhpcy5kYXRhUmVzcG9uc2VBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBpdGVtLnNldEl0ZW1EYXRhKHRoaXMuZGF0YVJlc3BvbnNlQXJyYXlbdGhpcy5saXN0SXRlbUNvbXBvbmVudHMubGVuZ3RoIC0gMV0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRMaXN0SXRlbURpcmVjdGl2ZXNEYXRhKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdEl0ZW1EaXJlY3RpdmVzLmZvckVhY2goKGVsZW1lbnQ6IE9MaXN0SXRlbURpcmVjdGl2ZSwgaW5kZXgpID0+IHtcbiAgICAgIGVsZW1lbnQuc2V0SXRlbURhdGEodGhpcy5kYXRhUmVzcG9uc2VBcnJheVtpbmRleF0pO1xuICAgICAgZWxlbWVudC5zZXRMaXN0Q29tcG9uZW50KHRoaXMpO1xuICAgICAgdGhpcy5yZWdpc3Rlckxpc3RJdGVtRGlyZWN0aXZlKGVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk6IHZvaWQge1xuICAgIHN1cGVyLnNhdmVEYXRhTmF2aWdhdGlvbkluTG9jYWxTdG9yYWdlKCk7XG4gICAgdGhpcy5zdG9yZVBhZ2luYXRpb25TdGF0ZSA9IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2V0RGF0YShkYXRhOiBhbnksIHNxbFR5cGVzPzogYW55LCByZXBsYWNlPzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgIGxldCByZXNwRGF0YUFycmF5ID0gZGF0YTtcbiAgICAgIGlmICh0aGlzLnBhZ2VhYmxlICYmICFyZXBsYWNlKSB7XG4gICAgICAgIHJlc3BEYXRhQXJyYXkgPSAodGhpcy5kYXRhUmVzcG9uc2VBcnJheSB8fCBbXSkuY29uY2F0KGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXhlcyB8fCBbXTtcbiAgICAgIGZvciAoY29uc3Qgc2VsSW5kZXggb2Ygc2VsZWN0ZWRJbmRleGVzKSB7XG4gICAgICAgIGlmIChzZWxJbmRleCA8IHRoaXMuZGF0YVJlc3BvbnNlQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0KHRoaXMuZGF0YVJlc3BvbnNlQXJyYXlbc2VsSW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSA9IHJlc3BEYXRhQXJyYXk7XG4gICAgICBpZiAoIXRoaXMucGFnZWFibGUpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJEYXRhKHRoaXMuc3RhdGUuZmlsdGVyVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhQXJyYXkodGhpcy5kYXRhUmVzcG9uc2VBcnJheSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RGF0YUFycmF5KFtdKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubG9hZGVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmxvYWRlclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYWdlYWJsZSkge1xuICAgICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5vblBhZ2luYXRlZERhdGFMb2FkZWQsIGRhdGEpO1xuICAgIH1cbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uRGF0YUxvYWRlZCwgdGhpcy5kYXRhUmVzcG9uc2VBcnJheSk7XG4gIH1cblxufVxuIl19