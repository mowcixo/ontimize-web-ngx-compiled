import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OTableComponent } from '../../../o-table.component';
export var DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON = [
    'column'
];
var OTableHeaderColumnFilterIconComponent = (function () {
    function OTableHeaderColumnFilterIconComponent(table) {
        this.table = table;
        this.columnValueFilters = [];
        this.isColumnFilterActive = new BehaviorSubject(false);
        this.indicatorNumber = new BehaviorSubject('');
        this.subscription = new Subscription();
        var self = this;
        var sFilterByColumnChange = this.table.onFilterByColumnChange.subscribe(function (x) {
            self.updateStateColumnFilter(x);
        });
        this.subscription.add(sFilterByColumnChange);
    }
    OTableHeaderColumnFilterIconComponent.prototype.ngOnInit = function () {
        this.updateStateColumnFilter(this.table.dataSource.getColumnValueFilters());
    };
    OTableHeaderColumnFilterIconComponent.prototype.updateStateColumnFilter = function (columnValueFilters) {
        this.columnValueFilters = columnValueFilters;
        this.indicatorNumber.next(this.getFilterIndicatorNumbered());
        this.isColumnFilterActive.next(this.getColumnValueFilterByAttr() !== undefined);
    };
    OTableHeaderColumnFilterIconComponent.prototype.getColumnValueFilterByAttr = function () {
        var _this = this;
        return this.columnValueFilters.filter(function (item) { return item.attr === _this.column.attr; })[0];
    };
    OTableHeaderColumnFilterIconComponent.prototype.openColumnFilterDialog = function (event) {
        this.table.openColumnFilterDialog(this.column, event);
    };
    OTableHeaderColumnFilterIconComponent.prototype.getFilterIndicatorNumbered = function () {
        var _this = this;
        var result = '';
        var columnsValueFilters = this.columnValueFilters;
        if (columnsValueFilters.length < 2) {
            return result;
        }
        var index = columnsValueFilters.findIndex(function (x) { return x.attr === _this.column.attr; });
        if (index > -1) {
            result += index + 1;
        }
        return result;
    };
    OTableHeaderColumnFilterIconComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    OTableHeaderColumnFilterIconComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-header-column-filter-icon',
                    inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON,
                    template: "<mat-icon class=\"column-filter-icon\" [ngClass]=\"{'active column-filter-icon-active':isColumnFilterActive | async}\"\n  (click)=\"openColumnFilterDialog($event)\">\n  filter_alt\n</mat-icon>\n<span class=\"o-table-header-indicator-numbered\">\n  {{ indicatorNumber | async }}\n</span>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.o-table-column-filter-icon]': 'true'
                    },
                    styles: [".o-table .o-table-container .mat-table .mat-header-cell .o-table-column-filter-icon{display:flex;position:absolute;left:0}.o-table .o-table-container .mat-table .mat-header-cell .o-table-column-filter-icon .o-table-header-indicator-numbered{right:-5px;bottom:-8px}"]
                }] }
    ];
    OTableHeaderColumnFilterIconComponent.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
    return OTableHeaderColumnFilterIconComponent;
}());
export { OTableHeaderColumnFilterIconComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uL28tdGFibGUtaGVhZGVyLWNvbHVtbi1maWx0ZXItaWNvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFxQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUdyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsTUFBTSxDQUFDLElBQU0seUNBQXlDLEdBQUc7SUFDdkQsUUFBUTtDQUNULENBQUE7QUFFRDtJQW9CRSwrQ0FDb0QsS0FBc0I7UUFBdEIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFQbkUsdUJBQWtCLEdBQThCLEVBQUUsQ0FBQztRQUVuRCx5QkFBb0IsR0FBNkIsSUFBSSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUUsb0JBQWUsR0FBNEIsSUFBSSxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEUsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBS3hDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLFVBQUEsQ0FBQztZQUN6RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCx3REFBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU0sdUVBQXVCLEdBQTlCLFVBQStCLGtCQUE2QztRQUMxRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFDN0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFTSwwRUFBMEIsR0FBakM7UUFBQSxpQkFFQztRQURDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQTlCLENBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRU0sc0VBQXNCLEdBQTdCLFVBQThCLEtBQUs7UUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSwwRUFBMEIsR0FBakM7UUFBQSxpQkFZQztRQVhDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVoQixJQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUNwRCxJQUFJLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQztTQUFFO1FBRXRELElBQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQTNCLENBQTJCLENBQUMsQ0FBQztRQUM5RSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELDJEQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7O2dCQWhFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG1DQUFtQztvQkFDN0MsTUFBTSxFQUFFLHlDQUF5QztvQkFDakQsNFNBQWlFO29CQUVqRSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLElBQUksRUFBRTt3QkFDSixvQ0FBb0MsRUFBRSxNQUFNO3FCQUM3Qzs7aUJBQ0Y7OztnQkFmUSxlQUFlLHVCQTBCbkIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsZUFBZSxFQUFmLENBQWUsQ0FBQzs7SUE0QzdDLDRDQUFDO0NBQUEsQUFqRUQsSUFpRUM7U0F0RFkscUNBQXFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgZm9yd2FyZFJlZiwgSW5qZWN0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBPQ29sdW1uVmFsdWVGaWx0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLWNvbHVtbi12YWx1ZS1maWx0ZXIudHlwZSc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NPTFVNTl9GSUxURVJfSUNPTiA9IFtcbiAgJ2NvbHVtbidcbl1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NPTFVNTl9GSUxURVJfSUNPTixcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtaGVhZGVyLWNvbHVtbi1maWx0ZXItaWNvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtaGVhZGVyLWNvbHVtbi1maWx0ZXItaWNvbi5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1jb2x1bW4tZmlsdGVyLWljb25dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlSGVhZGVyQ29sdW1uRmlsdGVySWNvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgY29sdW1uOiBPQ29sdW1uO1xuICBwdWJsaWMgY29sdW1uVmFsdWVGaWx0ZXJzOiBBcnJheTxPQ29sdW1uVmFsdWVGaWx0ZXI+ID0gW107XG5cbiAgcHVibGljIGlzQ29sdW1uRmlsdGVyQWN0aXZlOiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcbiAgcHVibGljIGluZGljYXRvck51bWJlcjogQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KCcnKTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHB1YmxpYyB0YWJsZTogT1RhYmxlQ29tcG9uZW50XG4gICkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IHNGaWx0ZXJCeUNvbHVtbkNoYW5nZSA9IHRoaXMudGFibGUub25GaWx0ZXJCeUNvbHVtbkNoYW5nZS5zdWJzY3JpYmUoeCA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZVN0YXRlQ29sdW1uRmlsdGVyKHgpO1xuICAgIH0pO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChzRmlsdGVyQnlDb2x1bW5DaGFuZ2UpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVTdGF0ZUNvbHVtbkZpbHRlcih0aGlzLnRhYmxlLmRhdGFTb3VyY2UuZ2V0Q29sdW1uVmFsdWVGaWx0ZXJzKCkpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZVN0YXRlQ29sdW1uRmlsdGVyKGNvbHVtblZhbHVlRmlsdGVyczogQXJyYXk8T0NvbHVtblZhbHVlRmlsdGVyPikge1xuICAgIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzID0gY29sdW1uVmFsdWVGaWx0ZXJzO1xuICAgIHRoaXMuaW5kaWNhdG9yTnVtYmVyLm5leHQodGhpcy5nZXRGaWx0ZXJJbmRpY2F0b3JOdW1iZXJlZCgpKTtcbiAgICB0aGlzLmlzQ29sdW1uRmlsdGVyQWN0aXZlLm5leHQodGhpcy5nZXRDb2x1bW5WYWx1ZUZpbHRlckJ5QXR0cigpICE9PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgcHVibGljIGdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKCk6IE9Db2x1bW5WYWx1ZUZpbHRlciB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzLmZpbHRlcihpdGVtID0+IGl0ZW0uYXR0ciA9PT0gdGhpcy5jb2x1bW4uYXR0cilbMF07XG4gIH1cblxuICBwdWJsaWMgb3BlbkNvbHVtbkZpbHRlckRpYWxvZyhldmVudCkge1xuICAgIHRoaXMudGFibGUub3BlbkNvbHVtbkZpbHRlckRpYWxvZyh0aGlzLmNvbHVtbiwgZXZlbnQpO1xuICB9XG5cbiAgcHVibGljIGdldEZpbHRlckluZGljYXRvck51bWJlcmVkKCk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gICAgY29uc3QgY29sdW1uc1ZhbHVlRmlsdGVycyA9IHRoaXMuY29sdW1uVmFsdWVGaWx0ZXJzO1xuICAgIGlmIChjb2x1bW5zVmFsdWVGaWx0ZXJzLmxlbmd0aCA8IDIpIHsgcmV0dXJuIHJlc3VsdDsgfVxuXG4gICAgY29uc3QgaW5kZXggPSBjb2x1bW5zVmFsdWVGaWx0ZXJzLmZpbmRJbmRleCh4ID0+IHguYXR0ciA9PT0gdGhpcy5jb2x1bW4uYXR0cik7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHJlc3VsdCArPSBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==