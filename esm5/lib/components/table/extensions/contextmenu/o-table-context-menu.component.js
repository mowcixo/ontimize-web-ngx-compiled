import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector, ViewChild, } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InputConverter } from '../../../../decorators/input-converter';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { ColumnValueFilterOperator } from '../../../../types/o-column-value-filter.type';
import { Util } from '../../../../util/util';
import { OContextMenuComponent } from '../../../contextmenu/o-context-menu.component';
import { OTableComponent } from '../../o-table.component';
export var DEFAULT_TABLE_CONTEXT_MENU_INPUTS = [
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
var OTableContextMenuComponent = (function () {
    function OTableContextMenuComponent(injector, table) {
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
    Object.defineProperty(OTableContextMenuComponent.prototype, "showInsert", {
        get: function () {
            return this.isVisibleInsert.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleInsert.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showEdit", {
        get: function () {
            return this.isVisibleEdit.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleEdit.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showViewDetail", {
        get: function () {
            return this.isVisibleDetail.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleDetail.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showCopy", {
        get: function () {
            return this.isVisibleCopy.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleCopy.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showSelectAll", {
        get: function () {
            return this.isVisibleSelectAll.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.table.isSelectionModeNone() ? this.isVisibleSelectAll.next(false) : this.isVisibleSelectAll.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showRefresh", {
        get: function () {
            return this.isVisibleRefresh.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleRefresh.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showDelete", {
        get: function () {
            return this.isVisibleDelete.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleDelete.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableContextMenuComponent.prototype, "showFilter", {
        get: function () {
            return this.isVisibleFilter.getValue();
        },
        set: function (value) {
            if (typeof value !== 'boolean') {
                value = Util.parseBoolean(value);
            }
            this.isVisibleFilter.next(value);
        },
        enumerable: true,
        configurable: true
    });
    OTableContextMenuComponent.prototype.ngAfterViewInit = function () {
        var itemsParsed = this.defaultContextMenu.oContextMenuItems.toArray();
        if (this.contextMenu) {
            var items = itemsParsed.concat(this.contextMenu.oContextMenuItems.toArray());
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
    };
    OTableContextMenuComponent.prototype.registerContextMenuListeners = function () {
        var _this = this;
        this.contextMenuSubscription.add(this.defaultContextMenu.onClose.subscribe(function (param) {
            if (!_this.table.isSelectionModeMultiple()) {
                _this.table.clearSelection();
            }
        }));
        this.contextMenuSubscription.add(this.defaultContextMenu.onShow.subscribe(function (param) {
            _this.initProperties(param);
        }));
    };
    OTableContextMenuComponent.prototype.gotoDetails = function (event) {
        var data = event.data.rowValue;
        this.table.viewDetail(data);
    };
    OTableContextMenuComponent.prototype.edit = function (event) {
        this.table.doHandleClick(event.data.rowValue, event.data.rowIndex, event);
    };
    OTableContextMenuComponent.prototype.add = function () {
        this.table.add();
    };
    OTableContextMenuComponent.prototype.selectAll = function () {
        this.table.showAndSelectAllCheckbox();
    };
    OTableContextMenuComponent.prototype.unSelectAll = function () {
        this.table.selection.clear();
    };
    OTableContextMenuComponent.prototype.copyAll = function () {
        this.table.copyAll();
    };
    OTableContextMenuComponent.prototype.copyCell = function (event) {
        var cell_data = this.defaultContextMenu.origin.innerText;
        Util.copyToClipboard(cell_data);
    };
    OTableContextMenuComponent.prototype.copySelection = function () {
        this.table.copySelection();
    };
    OTableContextMenuComponent.prototype.copyRow = function (event) {
        var data = JSON.stringify(this.table.dataSource.getRenderedData([event.data.rowValue]));
        Util.copyToClipboard(data);
    };
    OTableContextMenuComponent.prototype.delete = function (event) {
        this.table.remove();
    };
    OTableContextMenuComponent.prototype.refresh = function () {
        this.table.refresh();
    };
    OTableContextMenuComponent.prototype.filterByValue = function (event) {
        this.table.showFilterByColumnIcon = true;
        var columValueFilter = {
            attr: this.column.attr,
            operator: ColumnValueFilterOperator.IN,
            values: [this.row[this.column.attr]]
        };
        this.table.dataSource.addColumnFilter(columValueFilter);
        this.table.reloadPaginatedDataFromStart();
    };
    Object.defineProperty(OTableContextMenuComponent.prototype, "labelFilterByColumn", {
        get: function () {
            return (this.column && this.column.attr) ? this.translateService.get('TABLE_CONTEXT_MENU.FILTER_BY') + ' ' + this.translateService.get(this.column.attr) : '';
        },
        enumerable: true,
        configurable: true
    });
    OTableContextMenuComponent.prototype.filterByColumn = function (event) {
        if (this.table.oTableMenu) {
            this.table.showFilterByColumnIcon = true;
            this.table.oTableMenu.columnFilterOption.active = true;
            this.table.openColumnFilterDialog(this.column, event.event);
        }
    };
    OTableContextMenuComponent.prototype.checkVisibleFilter = function () {
        var isVisible = false;
        if (this.column) {
            isVisible = this.showFilter && this.table.isColumnFilterable(this.column);
        }
        this.isVisibleFilter.next(isVisible);
    };
    OTableContextMenuComponent.prototype.initProperties = function (param) {
        var data = param.data;
        if (data) {
            var columnName = data.cellName;
            this.column = this.table.getOColumn(columnName);
            this.row = data.rowValue;
            this.checkVisibleFilter();
        }
    };
    OTableContextMenuComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-context-menu',
                    template: "<o-context-menu #defaultContextMenu>\n  <o-context-menu-item attr=\"refresh\" label=\"TABLE_CONTEXT_MENU.REFRESH\" svg-icon=\"ontimize:autorenew\" (execute)=\"refresh()\"\n    [visible]=\"isVisibleRefresh | async\"></o-context-menu-item>\n  <o-context-menu-item attr=\"detail\" icon=\"chevron_right\" label=\"TABLE_CONTEXT_MENU.VIEW_DETAIL\" (execute)=\"gotoDetails($event)\"\n    [visible]=\"isVisibleDetail | async\"></o-context-menu-item>\n  <o-context-menu-item attr=\"edit\" icon=\"edit\" label=\"TABLE_CONTEXT_MENU.EDIT\" (execute)=\"edit($event)\" [visible]=\"isVisibleEdit | async\">\n  </o-context-menu-item>\n  <o-context-menu-item attr=\"insert\" label=\"TABLE_CONTEXT_MENU.INSERT\" icon=\"add\" (execute)=\"add()\" [visible]=\"isVisibleInsert | async\">\n  </o-context-menu-item>\n  <o-context-menu-item attr=\"delete\" label=\"TABLE_CONTEXT_MENU.DELETE\" icon=\"delete\" (execute)=\"delete($event)\" [visible]=\"isVisibleDelete | async\">\n  </o-context-menu-item>\n  <!-- FILTER GROUP -->\n  <o-context-menu-group label=\"TABLE_CONTEXT_MENU.FILTER\" icon=\"filter_alt\" type=\"group\" [visible]=\"isVisibleFilter | async\">\n    <o-context-menu-item icon=\"filter_alt\" [label]=\"labelFilterByColumn\" (execute)=\"filterByColumn($event)\"></o-context-menu-item>\n    <o-context-menu-item icon=\"filter_alt\" label=\"TABLE_CONTEXT_MENU.FILTER_BY_VALUE\" (execute)=\"filterByValue($event)\"></o-context-menu-item>\n  </o-context-menu-group>\n  <!-- COPY GROUP -->\n  <o-context-menu-separator [visible]=\"isVisibleCopy | async\"></o-context-menu-separator>\n  <o-context-menu-group label=\"TABLE_CONTEXT_MENU.COPY\" icon=\"file_copy\" type=\"group\" [visible]=\"isVisibleCopy | async\">\n    <o-context-menu-item icon=\"file_copy\" label=\"TABLE_CONTEXT_MENU.COPY_CELL\" (execute)=\"copyCell($event)\"></o-context-menu-item>\n    <o-context-menu-item icon=\"file_copy\" label=\"TABLE_CONTEXT_MENU.COPY_ROW\" (execute)=\"copyRow($event)\"></o-context-menu-item>\n    <o-context-menu-item label=\"TABLE_CONTEXT_MENU.COPY_ALL\" icon=\"file_copy\" (execute)=\"copyAll()\"></o-context-menu-item>\n    <o-context-menu-item label=\"TABLE_CONTEXT_MENU.COPY_SELECTION\" icon=\"file_copy\" (execute)=\"copySelection()\"></o-context-menu-item>\n  </o-context-menu-group>\n  <o-context-menu-separator [visible]=\"isVisibleSelectAll | async\"></o-context-menu-separator>\n  <o-context-menu-item attr=\"select-all\" [label]=\"table.isAllSelected() ? 'TABLE_CONTEXT_MENU.DESELECT_ALL': 'TABLE_CONTEXT_MENU.SELECT_ALL'\"\n    icon=\"select_all\" (execute)=\"table.isAllSelected() ? unSelectAll() : selectAll()\" [visible]=\"isVisibleSelectAll | async\"></o-context-menu-item>\n</o-context-menu>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_TABLE_CONTEXT_MENU_INPUTS
                }] }
    ];
    OTableContextMenuComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
    OTableContextMenuComponent.propDecorators = {
        defaultContextMenu: [{ type: ViewChild, args: ['defaultContextMenu', { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean),
        tslib_1.__metadata("design:paramtypes", [Boolean])
    ], OTableContextMenuComponent.prototype, "showSelectAll", null);
    return OTableContextMenuComponent;
}());
export { OTableContextMenuComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb250ZXh0LW1lbnUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvY29udGV4dG1lbnUvby10YWJsZS1jb250ZXh0LW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFFUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFckQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSx5QkFBeUIsRUFBc0IsTUFBTSw4Q0FBOEMsQ0FBQztBQUM3RyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFFdEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTFELE1BQU0sQ0FBQyxJQUFNLGlDQUFpQyxHQUFHO0lBQy9DLDJCQUEyQjtJQUMzQixvQkFBb0I7SUFDcEIsZ0JBQWdCO0lBQ2hCLDZCQUE2QjtJQUM3QixnQkFBZ0I7SUFDaEIsMkJBQTJCO0lBQzNCLHNCQUFzQjtJQUN0QixvQkFBb0I7SUFDcEIsb0JBQW9CO0NBQ3JCLENBQUM7QUFFRjtJQWlIRSxvQ0FDWSxRQUFrQixFQUNzQixLQUFzQjtRQUQ5RCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3NCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBM0duRSxvQkFBZSxHQUE2QixJQUFJLGVBQWUsQ0FB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Z3BGQUFvRDtvQkFDcEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSxpQ0FBaUM7aUJBQzFDOzs7Z0JBL0JDLFFBQVE7Z0JBWUQsZUFBZSx1QkFpSW5CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7OztxQ0FUMUMsU0FBUyxTQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7SUE1Q2xEO1FBREMsY0FBYyxFQUFFOzs7bUVBTWhCO0lBd0tILGlDQUFDO0NBQUEsQUEzT0QsSUEyT0M7U0FyT1ksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IsIE9Db2x1bW5WYWx1ZUZpbHRlciB9IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLXZhbHVlLWZpbHRlci50eXBlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vY29udGV4dG1lbnUvby1jb250ZXh0LW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9UQUJMRV9DT05URVhUX01FTlVfSU5QVVRTID0gW1xuICAnY29udGV4dE1lbnU6IGNvbnRleHQtbWVudScsXG4gICdzaG93SW5zZXJ0OiBpbnNlcnQnLFxuICAnc2hvd0VkaXQ6IGVkaXQnLFxuICAnc2hvd1ZpZXdEZXRhaWw6IHZpZXctZGV0YWlsJyxcbiAgJ3Nob3dDb3B5OiBjb3B5JyxcbiAgJ3Nob3dTZWxlY3RBbGw6IHNlbGVjdC1hbGwnLFxuICAnc2hvd1JlZnJlc2g6IHJlZnJlc2gnLFxuICAnc2hvd0RlbGV0ZTogZGVsZXRlJyxcbiAgJ3Nob3dGaWx0ZXI6IGZpbHRlcidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY29udGV4dC1tZW51JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY29udGV4dC1tZW51LmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9UQUJMRV9DT05URVhUX01FTlVfSU5QVVRTXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNvbnRleHRNZW51Q29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIHB1YmxpYyBjb250ZXh0TWVudTogT0NvbnRleHRNZW51Q29tcG9uZW50O1xuICBwdWJsaWMgaXNWaXNpYmxlSW5zZXJ0OiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRydWUpO1xuICBwdWJsaWMgaXNWaXNpYmxlRWRpdDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0cnVlKTtcbiAgcHVibGljIGlzVmlzaWJsZURldGFpbDogQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEJlaGF2aW9yU3ViamVjdCh0cnVlKTtcbiAgcHVibGljIGlzVmlzaWJsZUNvcHk6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QodHJ1ZSk7XG4gIHB1YmxpYyBpc1Zpc2libGVTZWxlY3RBbGw6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QodHJ1ZSk7XG4gIHB1YmxpYyBpc1Zpc2libGVSZWZyZXNoOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRydWUpO1xuICBwdWJsaWMgaXNWaXNpYmxlRGVsZXRlOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRydWUpO1xuICBwdWJsaWMgaXNWaXNpYmxlRmlsdGVyOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRydWUpO1xuXG4gIHNldCBzaG93SW5zZXJ0KHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKHZhbHVlIGFzIGFueSk7XG4gICAgfVxuICAgIHRoaXMuaXNWaXNpYmxlSW5zZXJ0Lm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHNob3dJbnNlcnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlSW5zZXJ0LmdldFZhbHVlKCk7XG4gIH1cblxuICBzZXQgc2hvd0VkaXQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gVXRpbC5wYXJzZUJvb2xlYW4odmFsdWUgYXMgYW55KTtcbiAgICB9XG4gICAgdGhpcy5pc1Zpc2libGVFZGl0Lm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHNob3dFZGl0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZUVkaXQuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHNldCBzaG93Vmlld0RldGFpbCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgdmFsdWUgPSBVdGlsLnBhcnNlQm9vbGVhbih2YWx1ZSBhcyBhbnkpO1xuICAgIH1cbiAgICB0aGlzLmlzVmlzaWJsZURldGFpbC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93Vmlld0RldGFpbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1Zpc2libGVEZXRhaWwuZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHNldCBzaG93Q29weSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgdmFsdWUgPSBVdGlsLnBhcnNlQm9vbGVhbih2YWx1ZSBhcyBhbnkpO1xuICAgIH1cbiAgICB0aGlzLmlzVmlzaWJsZUNvcHkubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBnZXQgc2hvd0NvcHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlQ29weS5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgc2V0IHNob3dTZWxlY3RBbGwodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gVXRpbC5wYXJzZUJvb2xlYW4odmFsdWUgYXMgYW55KTtcbiAgICB9XG4gICAgdGhpcy50YWJsZS5pc1NlbGVjdGlvbk1vZGVOb25lKCkgPyB0aGlzLmlzVmlzaWJsZVNlbGVjdEFsbC5uZXh0KGZhbHNlKSA6IHRoaXMuaXNWaXNpYmxlU2VsZWN0QWxsLm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHNob3dTZWxlY3RBbGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlU2VsZWN0QWxsLmdldFZhbHVlKCk7XG4gIH1cblxuICBzZXQgc2hvd1JlZnJlc2godmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHZhbHVlID0gVXRpbC5wYXJzZUJvb2xlYW4odmFsdWUgYXMgYW55KTtcbiAgICB9XG4gICAgdGhpcy5pc1Zpc2libGVSZWZyZXNoLm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHNob3dSZWZyZXNoKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZVJlZnJlc2guZ2V0VmFsdWUoKTtcbiAgfVxuXG4gIHNldCBzaG93RGVsZXRlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB2YWx1ZSA9IFV0aWwucGFyc2VCb29sZWFuKHZhbHVlIGFzIGFueSk7XG4gICAgfVxuICAgIHRoaXMuaXNWaXNpYmxlRGVsZXRlLm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHNob3dEZWxldGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlRGVsZXRlLmdldFZhbHVlKCk7XG4gIH1cblxuICBzZXQgc2hvd0ZpbHRlcih2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgICAgdmFsdWUgPSBVdGlsLnBhcnNlQm9vbGVhbih2YWx1ZSBhcyBhbnkpO1xuICAgIH1cbiAgICB0aGlzLmlzVmlzaWJsZUZpbHRlci5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93RmlsdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZUZpbHRlci5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgQFZpZXdDaGlsZCgnZGVmYXVsdENvbnRleHRNZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHByb3RlY3RlZCBkZWZhdWx0Q29udGV4dE1lbnU6IE9Db250ZXh0TWVudUNvbXBvbmVudDtcbiAgcHJvdGVjdGVkIHJvdzogYW55O1xuICBwcm90ZWN0ZWQgY29sdW1uOiBPQ29sdW1uO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBjb250ZXh0TWVudVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHB1YmxpYyB0YWJsZTogT1RhYmxlQ29tcG9uZW50XG4gICkge1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbXNQYXJzZWQgPSB0aGlzLmRlZmF1bHRDb250ZXh0TWVudS5vQ29udGV4dE1lbnVJdGVtcy50b0FycmF5KCk7XG4gICAgaWYgKHRoaXMuY29udGV4dE1lbnUpIHtcbiAgICAgIGNvbnN0IGl0ZW1zID0gaXRlbXNQYXJzZWQuY29uY2F0KHRoaXMuY29udGV4dE1lbnUub0NvbnRleHRNZW51SXRlbXMudG9BcnJheSgpKTtcbiAgICAgIHRoaXMuZGVmYXVsdENvbnRleHRNZW51Lm9Db250ZXh0TWVudUl0ZW1zLnJlc2V0KGl0ZW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWZhdWx0Q29udGV4dE1lbnUub0NvbnRleHRNZW51SXRlbXMucmVzZXQoaXRlbXNQYXJzZWQpO1xuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuc2hvd1NlbGVjdEFsbCkpIHtcbiAgICAgIHRoaXMuaXNWaXNpYmxlU2VsZWN0QWxsLm5leHQodGhpcy50YWJsZS5zZWxlY3RBbGxDaGVja2JveCk7XG4gICAgfVxuICAgIHRoaXMudGFibGUucmVnaXN0ZXJDb250ZXh0TWVudSh0aGlzLmRlZmF1bHRDb250ZXh0TWVudSk7XG4gICAgdGhpcy5yZWdpc3RlckNvbnRleHRNZW51TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJDb250ZXh0TWVudUxpc3RlbmVycygpIHtcbiAgICB0aGlzLmNvbnRleHRNZW51U3Vic2NyaXB0aW9uLmFkZCh0aGlzLmRlZmF1bHRDb250ZXh0TWVudS5vbkNsb3NlLnN1YnNjcmliZSgocGFyYW06IGFueSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLnRhYmxlLmlzU2VsZWN0aW9uTW9kZU11bHRpcGxlKCkpIHtcbiAgICAgICAgdGhpcy50YWJsZS5jbGVhclNlbGVjdGlvbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuY29udGV4dE1lbnVTdWJzY3JpcHRpb24uYWRkKHRoaXMuZGVmYXVsdENvbnRleHRNZW51Lm9uU2hvdy5zdWJzY3JpYmUoKHBhcmFtOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuaW5pdFByb3BlcnRpZXMocGFyYW0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIHB1YmxpYyBnb3RvRGV0YWlscyhldmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhLnJvd1ZhbHVlO1xuICAgIHRoaXMudGFibGUudmlld0RldGFpbChkYXRhKTtcbiAgfVxuXG4gIHB1YmxpYyBlZGl0KGV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5kb0hhbmRsZUNsaWNrKGV2ZW50LmRhdGEucm93VmFsdWUsIGV2ZW50LmRhdGEucm93SW5kZXgsIGV2ZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGQoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5hZGQoKTtcbiAgfVxuXG4gIHB1YmxpYyBzZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5zaG93QW5kU2VsZWN0QWxsQ2hlY2tib3goKTtcbiAgfVxuXG4gIHB1YmxpYyB1blNlbGVjdEFsbCgpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnNlbGVjdGlvbi5jbGVhcigpO1xuICB9XG5cbiAgcHVibGljIGNvcHlBbGwoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5jb3B5QWxsKCk7XG4gIH1cblxuICBwdWJsaWMgY29weUNlbGwoZXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBjZWxsX2RhdGEgPSB0aGlzLmRlZmF1bHRDb250ZXh0TWVudS5vcmlnaW4uaW5uZXJUZXh0O1xuICAgIFV0aWwuY29weVRvQ2xpcGJvYXJkKGNlbGxfZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgY29weVNlbGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLmNvcHlTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIHB1YmxpYyBjb3B5Um93KGV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoaXMudGFibGUuZGF0YVNvdXJjZS5nZXRSZW5kZXJlZERhdGEoW2V2ZW50LmRhdGEucm93VmFsdWVdKSk7XG4gICAgVXRpbC5jb3B5VG9DbGlwYm9hcmQoZGF0YSk7XG4gIH1cblxuICBwdWJsaWMgZGVsZXRlKGV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy50YWJsZS5yZW1vdmUoKTtcbiAgfVxuXG4gIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xuICAgIHRoaXMudGFibGUucmVmcmVzaCgpO1xuICB9XG5cbiAgcHVibGljIGZpbHRlckJ5VmFsdWUoZXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnNob3dGaWx0ZXJCeUNvbHVtbkljb24gPSB0cnVlO1xuICAgIGNvbnN0IGNvbHVtVmFsdWVGaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlciA9IHtcbiAgICAgIGF0dHI6IHRoaXMuY29sdW1uLmF0dHIsXG4gICAgICBvcGVyYXRvcjogQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTixcbiAgICAgIHZhbHVlczogW3RoaXMucm93W3RoaXMuY29sdW1uLmF0dHJdXVxuICAgIH07XG4gICAgdGhpcy50YWJsZS5kYXRhU291cmNlLmFkZENvbHVtbkZpbHRlcihjb2x1bVZhbHVlRmlsdGVyKTtcbiAgICB0aGlzLnRhYmxlLnJlbG9hZFBhZ2luYXRlZERhdGFGcm9tU3RhcnQoKTtcbiAgfVxuXG4gIGdldCBsYWJlbEZpbHRlckJ5Q29sdW1uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh0aGlzLmNvbHVtbiAmJiB0aGlzLmNvbHVtbi5hdHRyKSA/IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFX0NPTlRFWFRfTUVOVS5GSUxURVJfQlknKSArICcgJyArIHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy5jb2x1bW4uYXR0cikgOiAnJztcbiAgfVxuXG4gIHB1YmxpYyBmaWx0ZXJCeUNvbHVtbihldmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRhYmxlLm9UYWJsZU1lbnUpIHtcbiAgICAgIHRoaXMudGFibGUuc2hvd0ZpbHRlckJ5Q29sdW1uSWNvbiA9IHRydWU7XG4gICAgICB0aGlzLnRhYmxlLm9UYWJsZU1lbnUuY29sdW1uRmlsdGVyT3B0aW9uLmFjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLnRhYmxlLm9wZW5Db2x1bW5GaWx0ZXJEaWFsb2codGhpcy5jb2x1bW4sIGV2ZW50LmV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY2hlY2tWaXNpYmxlRmlsdGVyKCk6IHZvaWQge1xuICAgIGxldCBpc1Zpc2libGUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5jb2x1bW4pIHtcbiAgICAgIGlzVmlzaWJsZSA9IHRoaXMuc2hvd0ZpbHRlciAmJiB0aGlzLnRhYmxlLmlzQ29sdW1uRmlsdGVyYWJsZSh0aGlzLmNvbHVtbik7XG4gICAgfVxuICAgIHRoaXMuaXNWaXNpYmxlRmlsdGVyLm5leHQoaXNWaXNpYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpbml0UHJvcGVydGllcyhwYXJhbTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtLmRhdGE7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGNvbnN0IGNvbHVtbk5hbWUgPSBkYXRhLmNlbGxOYW1lO1xuICAgICAgdGhpcy5jb2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4oY29sdW1uTmFtZSk7XG4gICAgICB0aGlzLnJvdyA9IGRhdGEucm93VmFsdWU7XG4gICAgICB0aGlzLmNoZWNrVmlzaWJsZUZpbHRlcigpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=