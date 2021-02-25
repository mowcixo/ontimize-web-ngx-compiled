import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ViewChild, } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InputConverter } from '../../../../decorators/input-converter';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { ColumnValueFilterOperator } from '../../../../types/o-column-value-filter.type';
import { Util } from '../../../../util/util';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OTableComponent } from '../../o-table.component';
export const DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
    'contextMenu: context-menu',
    'showInsert: insert',
    'showEdit: edit',
    'showViewDetail: view-detail',
    'showCopy: copy',
    'showSelectAll: select-all',
    'showRefresh: refresh',
    'showDelete: delete',
    'showFilter: filter'
];
export class OTableContextMenuComponent {
    constructor(injector, table) {
        this.injector = injector;
        this.table = table;
        this.isVisibleInsert = new BehaviorSubject(true);
        this.isVisibleEdit = new BehaviorSubject(true);
        this.isVisibleDetail = new BehaviorSubject(true);
        this.isVisibleCopy = new BehaviorSubject(true);
        this.isVisibleSelectAll = new BehaviorSubject(true);
        this.isVisibleRefresh = new BehaviorSubject(true);
        this.isVisibleDelete = new BehaviorSubject(true);
        this.isVisibleFilter = new BehaviorSubject(true);
        this.contextMenuSubscription = new Subscription();
        this.translateService = this.injector.get(OTranslateService);
    }
    set showInsert(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleInsert.next(value);
    }
    get showInsert() {
        return this.isVisibleInsert.getValue();
    }
    set showEdit(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleEdit.next(value);
    }
    get showEdit() {
        return this.isVisibleEdit.getValue();
    }
    set showViewDetail(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleDetail.next(value);
    }
    get showViewDetail() {
        return this.isVisibleDetail.getValue();
    }
    set showCopy(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleCopy.next(value);
    }
    get showCopy() {
        return this.isVisibleCopy.getValue();
    }
    set showSelectAll(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.table.isSelectionModeNone() ? this.isVisibleSelectAll.next(false) : this.isVisibleSelectAll.next(value);
    }
    get showSelectAll() {
        return this.isVisibleSelectAll.getValue();
    }
    set showRefresh(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleRefresh.next(value);
    }
    get showRefresh() {
        return this.isVisibleRefresh.getValue();
    }
    set showDelete(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleDelete.next(value);
    }
    get showDelete() {
        return this.isVisibleDelete.getValue();
    }
    set showFilter(value) {
        if (typeof value !== 'boolean') {
            value = Util.parseBoolean(value);
        }
        this.isVisibleFilter.next(value);
    }
    get showFilter() {
        return this.isVisibleFilter.getValue();
    }
    ngAfterViewInit() {
        const itemsParsed = this.defaultContextMenu.oContextMenuItems.toArray();
        if (this.contextMenu) {
            const items = itemsParsed.concat(this.contextMenu.oContextMenuItems.toArray());
            this.defaultContextMenu.oContextMenuItems.reset(items);
        }
        else {
            this.defaultContextMenu.oContextMenuItems.reset(itemsParsed);
        }
        if (!Util.isDefined(this.showSelectAll)) {
            this.isVisibleSelectAll.next(this.table.selectAllCheckbox);
        }
        this.table.registerContextMenu(this.defaultContextMenu);
        this.registerContextMenuListeners();
    }
    registerContextMenuListeners() {
        this.contextMenuSubscription.add(this.defaultContextMenu.onClose.subscribe((param) => {
            if (!this.table.isSelectionModeMultiple()) {
                this.table.clearSelection();
            }
        }));
        this.contextMenuSubscription.add(this.defaultContextMenu.onShow.subscribe((param) => {
            this.initProperties(param);
        }));
    }
    gotoDetails(event) {
        const data = event.data.rowValue;
        this.table.viewDetail(data);
    }
    edit(event) {
        const data = event.data.rowValue;
        this.table.doHandleClick(data);
    }
    add() {
        this.table.add();
    }
    selectAll() {
        this.table.showAndSelectAllCheckbox();
    }
    unSelectAll() {
        this.table.selection.clear();
    }
    copyAll() {
        this.table.copyAll();
    }
    copyCell(event) {
        const cell_data = this.defaultContextMenu.origin.innerText;
        Util.copyToClipboard(cell_data);
    }
    copySelection() {
        this.table.copySelection();
    }
    copyRow(event) {
        const data = JSON.stringify(this.table.dataSource.getRenderedData([event.data.rowValue]));
        Util.copyToClipboard(data);
    }
    delete(event) {
        this.table.remove();
    }
    refresh() {
        this.table.refresh();
    }
    filterByValue(event) {
        this.table.showFilterByColumnIcon = true;
        const columValueFilter = {
            attr: this.column.attr,
            operator: ColumnValueFilterOperator.IN,
            values: [this.row[this.column.attr]]
        };
        this.table.dataSource.addColumnFilter(columValueFilter);
        this.table.reloadPaginatedDataFromStart();
    }
    get labelFilterByColumn() {
        return (this.column && this.column.attr) ? this.translateService.get('TABLE_CONTEXT_MENU.FILTER_BY') + ' ' + this.translateService.get(this.column.attr) : '';
    }
    filterByColumn(event) {
        if (this.table.oTableMenu) {
            this.table.showFilterByColumnIcon = true;
            this.table.oTableMenu.columnFilterOption.active = true;
            this.table.openColumnFilterDialog(this.column, event.event);
        }
    }
    checkVisibleFilter() {
        let isVisible = false;
        if (this.column) {
            isVisible = this.showFilter && this.table.isColumnFilterable(this.column);
        }
        this.isVisibleFilter.next(isVisible);
    }
    initProperties(param) {
        const data = param.data;
        if (data) {
            const columnName = data.cellName;
            this.column = this.table.getOColumn(columnName);
            this.row = data.rowValue;
            this.checkVisibleFilter();
        }
    }
}
OTableContextMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-context-menu',
                template: "<o-context-menu #defaultContextMenu>\n  <o-context-menu-item attr=\"refresh\" label=\"TABLE_CONTEXT_MENU.REFRESH\" svg-icon=\"ontimize:autorenew\" (execute)=\"refresh()\"\n    [visible]=\"isVisibleRefresh | async\"></o-context-menu-item>\n  <o-context-menu-item attr=\"detail\" icon=\"chevron_right\" label=\"TABLE_CONTEXT_MENU.VIEW_DETAIL\" (execute)=\"gotoDetails($event)\"\n    [visible]=\"isVisibleDetail | async\"></o-context-menu-item>\n  <o-context-menu-item attr=\"edit\" icon=\"edit\" label=\"TABLE_CONTEXT_MENU.EDIT\" (execute)=\"edit($event)\" [visible]=\"isVisibleEdit | async\">\n  </o-context-menu-item>\n  <o-context-menu-item attr=\"insert\" label=\"TABLE_CONTEXT_MENU.INSERT\" icon=\"add\" (execute)=\"add()\" [visible]=\"isVisibleInsert | async\">\n  </o-context-menu-item>\n  <o-context-menu-item attr=\"delete\" label=\"TABLE_CONTEXT_MENU.DELETE\" icon=\"delete\" (execute)=\"delete($event)\" [visible]=\"isVisibleDelete | async\">\n  </o-context-menu-item>\n  <!-- FILTER GROUP -->\n  <o-context-menu-group label=\"TABLE_CONTEXT_MENU.FILTER\" icon=\"filter_list\" type=\"group\" [visible]=\"isVisibleFilter | async\">\n    <o-context-menu-item icon=\"filter_list\" [label]=\"labelFilterByColumn\" (execute)=\"filterByColumn($event)\"></o-context-menu-item>\n    <o-context-menu-item icon=\"filter_list\" label=\"TABLE_CONTEXT_MENU.FILTER_BY_VALUE\" (execute)=\"filterByValue($event)\"></o-context-menu-item>\n  </o-context-menu-group>\n  <!-- COPY GROUP -->\n  <o-context-menu-separator [visible]=\"isVisibleCopy | async\"></o-context-menu-separator>\n  <o-context-menu-group label=\"TABLE_CONTEXT_MENU.COPY\" icon=\"file_copy\" type=\"group\" [visible]=\"isVisibleCopy | async\">\n    <o-context-menu-item icon=\"file_copy\" label=\"TABLE_CONTEXT_MENU.COPY_CELL\" (execute)=\"copyCell($event)\"></o-context-menu-item>\n    <o-context-menu-item icon=\"file_copy\" label=\"TABLE_CONTEXT_MENU.COPY_ROW\" (execute)=\"copyRow($event)\"></o-context-menu-item>\n    <o-context-menu-item label=\"TABLE_CONTEXT_MENU.COPY_ALL\" icon=\"file_copy\" (execute)=\"copyAll()\"></o-context-menu-item>\n    <o-context-menu-item label=\"TABLE_CONTEXT_MENU.COPY_SELECTION\" icon=\"file_copy\" (execute)=\"copySelection()\"></o-context-menu-item>\n  </o-context-menu-group>\n  <o-context-menu-separator [visible]=\"isVisibleSelectAll | async\"></o-context-menu-separator>\n  <o-context-menu-item attr=\"select-all\" [label]=\"table.isAllSelected() ? 'TABLE_CONTEXT_MENU.DESELECT_ALL': 'TABLE_CONTEXT_MENU.SELECT_ALL'\"\n    icon=\"select_all\" (execute)=\"table.isAllSelected() ? unSelectAll() : selectAll()\" [visible]=\"isVisibleSelectAll | async\"></o-context-menu-item>\n</o-context-menu>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
            }] }
];
OTableContextMenuComponent.ctorParameters = () => [
    { type: Injector },
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
OTableContextMenuComponent.propDecorators = {
    defaultContextMenu: [{ type: ViewChild, args: ['defaultContextMenu', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean),
    tslib_1.__metadata("design:paramtypes", [Boolean])
], OTableContextMenuComponent.prototype, "showSelectAll", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb250ZXh0LW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvY29udGV4dG1lbnUvby10YWJsZS1jb250ZXh0LW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFFUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFckQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx5QkFBeUIsRUFBc0IsTUFBTSw4Q0FBOEMsQ0FBQztBQUM3RyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFFdEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTFELE1BQU0sQ0FBQyxNQUFNLGlDQUFpQyxHQUFHO0lBQy9DLDJCQUEyQjtJQUMzQixvQkFBb0I7SUFDcEIsZ0JBQWdCO0lBQ2hCLDZCQUE2QjtJQUM3QixnQkFBZ0I7SUFDaEIsMkJBQTJCO0lBQzNCLHNCQUFzQjtJQUN0QixvQkFBb0I7SUFDcEIsb0JBQW9CO0NBQ3JCLENBQUM7QUFRRixNQUFNLE9BQU8sMEJBQTBCO0lBMkdyQyxZQUNZLFFBQWtCLEVBQ3NCLEtBQXNCO1FBRDlELGFBQVEsR0FBUixRQUFRLENBQVU7UUFDc0IsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUEzR25FLG9CQUFlLEdB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aUNBVDFDLFNBQVMsU0FBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0FBNUNsRDtJQURDLGNBQWMsRUFBRTs7OytEQU1oQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLCBPQ29sdW1uVmFsdWVGaWx0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi90eXBlcy9vLWNvbHVtbi12YWx1ZS1maWx0ZXIudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db250ZXh0TWVudUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEFCTEVfQ09OVEVYVF9NRU5VX0lOUFVUUyA9IFtcbiAgJ2NvbnRleHRNZW51OiBjb250ZXh0LW1lbnUnLFxuICAnc2hvd0luc2VydDogaW5zZXJ0JyxcbiAgJ3Nob3dFZGl0OiBlZGl0JyxcbiAgJ3Nob3dWaWV3RGV0YWlsOiB2aWV3LWRldGFpbCcsXG4gICdzaG93Q29weTogY29weScsXG4gICdzaG93U2VsZWN0QWxsOiBzZWxlY3QtYWxsJyxcbiAgJ3Nob3dSZWZyZXNoOiByZWZyZXNoJyxcbiAgJ3Nob3dEZWxldGU6IGRlbGV0ZScsXG4gICdzaG93RmlsdGVyOiBmaWx0ZXInXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNvbnRleHQtbWVudScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNvbnRleHQtbWVudS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfVEFCTEVfQ09OVEVYVF9NRU5VX0lOUFVUU1xufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDb250ZXh0TWVudUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBwdWJsaWMgY29udGV4dE1lbnU6IE9Db250ZXh0TWVudUNvbXBvbmVudDtcbiAgcHVibGljIGlzVmlzaWJsZUluc2VydDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0cnVlKTtcbiAgcHVibGljIGlzVmlzaWJsZUVkaXQ6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QodHJ1ZSk7XG4gIHB1YmxpYyBpc1Zpc2libGVEZXRhaWw6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QodHJ1ZSk7XG4gIHB1YmxpYyBpc1Zpc2libGVDb3B5OiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRydWUpO1xuICBwdWJsaWMgaXNWaXNpYmxlU2VsZWN0QWxsOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRydWUpO1xuICBwdWJsaWMgaXNWaXNpYmxlUmVmcmVzaDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0cnVlKTtcbiAgcHVibGljIGlzVmlzaWJsZURlbGV0ZTogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0cnVlKTtcbiAgcHVibGljIGlzVmlzaWJsZUZpbHRlcjogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0cnVlKTtcblxuICBzZXQgc2hvd0luc2VydCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgdmFsdWUgPSBVdGlsLnBhcnNlQm9vbGVhbih2YWx1ZSBhcyBhbnkpO1xuICAgIH1cbiAgICB0aGlzLmlzVmlzaWJsZUluc2VydC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93SW5zZXJ0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZUluc2VydC5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgc2V0IHNob3dFZGl0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKHZhbHVlIGFzIGFueSk7XG4gICAgfVxuICAgIHRoaXMuaXNWaXNpYmxlRWRpdC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93RWRpdCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Zpc2libGVFZGl0LmdldFZhbHVlKCk7XG4gIH1cblxuICBzZXQgc2hvd1ZpZXdEZXRhaWwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gVXRpbC5wYXJzZUJvb2xlYW4odmFsdWUgYXMgYW55KTtcbiAgICB9XG4gICAgdGhpcy5pc1Zpc2libGVEZXRhaWwubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBnZXQgc2hvd1ZpZXdEZXRhaWwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlRGV0YWlsLmdldFZhbHVlKCk7XG4gIH1cblxuICBzZXQgc2hvd0NvcHkodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gVXRpbC5wYXJzZUJvb2xlYW4odmFsdWUgYXMgYW55KTtcbiAgICB9XG4gICAgdGhpcy5pc1Zpc2libGVDb3B5Lm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHNob3dDb3B5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZUNvcHkuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNldCBzaG93U2VsZWN0QWxsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKHZhbHVlIGFzIGFueSk7XG4gICAgfVxuICAgIHRoaXMudGFibGUuaXNTZWxlY3Rpb25Nb2RlTm9uZSgpID8gdGhpcy5pc1Zpc2libGVTZWxlY3RBbGwubmV4dChmYWxzZSkgOiB0aGlzLmlzVmlzaWJsZVNlbGVjdEFsbC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93U2VsZWN0QWxsKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZVNlbGVjdEFsbC5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgc2V0IHNob3dSZWZyZXNoKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKHZhbHVlIGFzIGFueSk7XG4gICAgfVxuICAgIHRoaXMuaXNWaXNpYmxlUmVmcmVzaC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93UmVmcmVzaCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Zpc2libGVSZWZyZXNoLmdldFZhbHVlKCk7XG4gIH1cblxuICBzZXQgc2hvd0RlbGV0ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgdmFsdWUgPSBVdGlsLnBhcnNlQm9vbGVhbih2YWx1ZSBhcyBhbnkpO1xuICAgIH1cbiAgICB0aGlzLmlzVmlzaWJsZURlbGV0ZS5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93RGVsZXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZURlbGV0ZS5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgc2V0IHNob3dGaWx0ZXIodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gVXRpbC5wYXJzZUJvb2xlYW4odmFsdWUgYXMgYW55KTtcbiAgICB9XG4gICAgdGhpcy5pc1Zpc2libGVGaWx0ZXIubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBnZXQgc2hvd0ZpbHRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Zpc2libGVGaWx0ZXIuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIEBWaWV3Q2hpbGQoJ2RlZmF1bHRDb250ZXh0TWVudScsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgZGVmYXVsdENvbnRleHRNZW51OiBPQ29udGV4dE1lbnVDb21wb25lbnQ7XG4gIHByb3RlY3RlZCByb3c6IGFueTtcbiAgcHJvdGVjdGVkIGNvbHVtbjogT0NvbHVtbjtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgY29udGV4dE1lbnVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwdWJsaWMgdGFibGU6IE9UYWJsZUNvbXBvbmVudFxuICApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGl0ZW1zUGFyc2VkID0gdGhpcy5kZWZhdWx0Q29udGV4dE1lbnUub0NvbnRleHRNZW51SXRlbXMudG9BcnJheSgpO1xuICAgIGlmICh0aGlzLmNvbnRleHRNZW51KSB7XG4gICAgICBjb25zdCBpdGVtcyA9IGl0ZW1zUGFyc2VkLmNvbmNhdCh0aGlzLmNvbnRleHRNZW51Lm9Db250ZXh0TWVudUl0ZW1zLnRvQXJyYXkoKSk7XG4gICAgICB0aGlzLmRlZmF1bHRDb250ZXh0TWVudS5vQ29udGV4dE1lbnVJdGVtcy5yZXNldChpdGVtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVmYXVsdENvbnRleHRNZW51Lm9Db250ZXh0TWVudUl0ZW1zLnJlc2V0KGl0ZW1zUGFyc2VkKTtcbiAgICB9XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnNob3dTZWxlY3RBbGwpKSB7XG4gICAgICB0aGlzLmlzVmlzaWJsZVNlbGVjdEFsbC5uZXh0KHRoaXMudGFibGUuc2VsZWN0QWxsQ2hlY2tib3gpO1xuICAgIH1cbiAgICB0aGlzLnRhYmxlLnJlZ2lzdGVyQ29udGV4dE1lbnUodGhpcy5kZWZhdWx0Q29udGV4dE1lbnUpO1xuICAgIHRoaXMucmVnaXN0ZXJDb250ZXh0TWVudUxpc3RlbmVycygpO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyQ29udGV4dE1lbnVMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5jb250ZXh0TWVudVN1YnNjcmlwdGlvbi5hZGQodGhpcy5kZWZhdWx0Q29udGV4dE1lbnUub25DbG9zZS5zdWJzY3JpYmUoKHBhcmFtOiBhbnkpID0+IHtcbiAgICAgIGlmICghdGhpcy50YWJsZS5pc1NlbGVjdGlvbk1vZGVNdWx0aXBsZSgpKSB7XG4gICAgICAgIHRoaXMudGFibGUuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uLmFkZCh0aGlzLmRlZmF1bHRDb250ZXh0TWVudS5vblNob3cuc3Vic2NyaWJlKChwYXJhbTogYW55KSA9PiB7XG4gICAgICB0aGlzLmluaXRQcm9wZXJ0aWVzKHBhcmFtKTtcbiAgICB9KSk7XG4gIH1cblxuICBwdWJsaWMgZ290b0RldGFpbHMoZXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YS5yb3dWYWx1ZTtcbiAgICB0aGlzLnRhYmxlLnZpZXdEZXRhaWwoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgZWRpdChldmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhLnJvd1ZhbHVlO1xuICAgIHRoaXMudGFibGUuZG9IYW5kbGVDbGljayhkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGQoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5hZGQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5zaG93QW5kU2VsZWN0QWxsQ2hlY2tib3goKTtcbiAgfVxuXG4gIHB1YmxpYyB1blNlbGVjdEFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnNlbGVjdGlvbi5jbGVhcigpO1xuICB9XG5cbiAgcHVibGljIGNvcHlBbGwoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5jb3B5QWxsKCk7XG4gIH1cblxuICBwdWJsaWMgY29weUNlbGwoZXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBjZWxsX2RhdGEgPSB0aGlzLmRlZmF1bHRDb250ZXh0TWVudS5vcmlnaW4uaW5uZXJUZXh0O1xuICAgIFV0aWwuY29weVRvQ2xpcGJvYXJkKGNlbGxfZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgY29weVNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLmNvcHlTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyBjb3B5Um93KGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudGFibGUuZGF0YVNvdXJjZS5nZXRSZW5kZXJlZERhdGEoW2V2ZW50LmRhdGEucm93VmFsdWVdKSk7XG4gICAgVXRpbC5jb3B5VG9DbGlwYm9hcmQoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgZGVsZXRlKGV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5yZW1vdmUoKTtcbiAgfVxuXG4gIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xuICAgIHRoaXMudGFibGUucmVmcmVzaCgpO1xuICB9XG5cbiAgcHVibGljIGZpbHRlckJ5VmFsdWUoZXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gPSB0cnVlO1xuICAgIGNvbnN0IGNvbHVtVmFsdWVGaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlciA9IHtcbiAgICAgIGF0dHI6IHRoaXMuY29sdW1uLmF0dHIsXG4gICAgICBvcGVyYXRvcjogQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTixcbiAgICAgIHZhbHVlczogW3RoaXMucm93W3RoaXMuY29sdW1uLmF0dHJdXVxuICAgIH07XG4gICAgdGhpcy50YWJsZS5kYXRhU291cmNlLmFkZENvbHVtbkZpbHRlcihjb2x1bVZhbHVlRmlsdGVyKTtcbiAgICB0aGlzLnRhYmxlLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgfVxuXG4gIGdldCBsYWJlbEZpbHRlckJ5Q29sdW1uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh0aGlzLmNvbHVtbiAmJiB0aGlzLmNvbHVtbi5hdHRyKSA/IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFX0NPTlRFWFRfTUVOVS5GSUxURVJfQlknKSArICcgJyArIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy5jb2x1bW4uYXR0cikgOiAnJztcbiAgfVxuXG4gIHB1YmxpYyBmaWx0ZXJCeUNvbHVtbihldmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRhYmxlLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9IHRydWU7XG4gICAgICB0aGlzLnRhYmxlLm9UYWJsZU1lbnUuY29sdW1uRmlsdGVyT3B0aW9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLnRhYmxlLm9wZW5Db2x1bW5GaWx0ZXJEaWFsb2codGhpcy5jb2x1bW4sIGV2ZW50LmV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2hlY2tWaXNpYmxlRmlsdGVyKCk6IHZvaWQge1xuICAgIGxldCBpc1Zpc2libGUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5jb2x1bW4pIHtcbiAgICAgIGlzVmlzaWJsZSA9IHRoaXMuc2hvd0ZpbHRlciAmJiB0aGlzLnRhYmxlLmlzQ29sdW1uRmlsdGVyYWJsZSh0aGlzLmNvbHVtbik7XG4gICAgfVxuICAgIHRoaXMuaXNWaXNpYmxlRmlsdGVyLm5leHQoaXNWaXNpYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0UHJvcGVydGllcyhwYXJhbTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtLmRhdGE7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSBkYXRhLmNlbGxOYW1lO1xuICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4oY29sdW1uTmFtZSk7XG4gICAgICB0aGlzLnJvdyA9IGRhdGEucm93VmFsdWU7XG4gICAgICB0aGlzLmNoZWNrVmlzaWJsZUZpbHRlcigpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=