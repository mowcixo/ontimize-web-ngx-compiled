import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OTableComponent } from '../../../o-table.component';
export const DEFAULT_INPUTS_O_TABLE_COLUMN_FILTER_ICON = [
    'column'
];
export class OTableHeaderColumnFilterIconComponent {
    constructor(table) {
        this.table = table;
        this.columnValueFilters = [];
        this.isColumnFilterActive = new BehaviorSubject(false);
        this.indicatorNumber = new BehaviorSubject('');
        this.subscription = new Subscription();
        const self = this;
        const sFilterByColumnChange = this.table.onFilterByColumnChange.subscribe(x => {
            self.updateStateColumnFilter(x);
        });
        this.subscription.add(sFilterByColumnChange);
    }
    ngOnInit() {
        this.updateStateColumnFilter(this.table.dataSource.getColumnValueFilters());
    }
    updateStateColumnFilter(columnValueFilters) {
        this.columnValueFilters = columnValueFilters;
        this.indicatorNumber.next(this.getFilterIndicatorNumbered());
        this.isColumnFilterActive.next(this.getColumnValueFilterByAttr() !== undefined);
    }
    getColumnValueFilterByAttr() {
        return this.columnValueFilters.filter(item => item.attr === this.column.attr)[0];
    }
    openColumnFilterDialog(event) {
        this.table.openColumnFilterDialog(this.column, event);
    }
    getFilterIndicatorNumbered() {
        let result = '';
        const columnsValueFilters = this.columnValueFilters;
        if (columnsValueFilters.length < 2) {
            return result;
        }
        const index = columnsValueFilters.findIndex(x => x.attr === this.column.attr);
        if (index > -1) {
            result += index + 1;
        }
        return result;
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
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
OTableHeaderColumnFilterIconComponent.ctorParameters = () => [
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2hlYWRlci90YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uL28tdGFibGUtaGVhZGVyLWNvbHVtbi1maWx0ZXItaWNvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFxQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3SCxPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUdyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsTUFBTSxDQUFDLE1BQU0seUNBQXlDLEdBQUc7SUFDdkQsUUFBUTtDQUNULENBQUE7QUFhRCxNQUFNLE9BQU8scUNBQXFDO0lBU2hELFlBQ29ELEtBQXNCO1FBQXRCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBUG5FLHVCQUFrQixHQUE4QixFQUFFLENBQUM7UUFFbkQseUJBQW9CLEdBQTZCLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVFLG9CQUFlLEdBQTRCLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUt4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRU0sdUJBQXVCLENBQUMsa0JBQTZDO1FBQzFFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUVNLDBCQUEwQjtRQUMvQixPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVNLHNCQUFzQixDQUFDLEtBQUs7UUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSwwQkFBMEI7UUFDL0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBRWhCLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1FBQ3BELElBQUksbUJBQW1CLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUFFLE9BQU8sTUFBTSxDQUFDO1NBQUU7UUFFdEQsTUFBTSxLQUFLLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDckI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQzs7O1lBaEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUNBQW1DO2dCQUM3QyxNQUFNLEVBQUUseUNBQXlDO2dCQUNqRCw0U0FBaUU7Z0JBRWpFLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLG9DQUFvQyxFQUFFLE1BQU07aUJBQzdDOzthQUNGOzs7WUFmUSxlQUFlLHVCQTBCbkIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbmplY3QsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE9Db2x1bW5WYWx1ZUZpbHRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLXZhbHVlLWZpbHRlci50eXBlJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4nO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX0ZJTFRFUl9JQ09OID0gW1xuICAnY29sdW1uJ1xuXVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWhlYWRlci1jb2x1bW4tZmlsdGVyLWljb24nLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX0ZJTFRFUl9JQ09OLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1oZWFkZXItY29sdW1uLWZpbHRlci1pY29uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLWNvbHVtbi1maWx0ZXItaWNvbl0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVIZWFkZXJDb2x1bW5GaWx0ZXJJY29uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyBjb2x1bW46IE9Db2x1bW47XG4gIHB1YmxpYyBjb2x1bW5WYWx1ZUZpbHRlcnM6IEFycmF5PE9Db2x1bW5WYWx1ZUZpbHRlcj4gPSBbXTtcblxuICBwdWJsaWMgaXNDb2x1bW5GaWx0ZXJBY3RpdmU6IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuICBwdWJsaWMgaW5kaWNhdG9yTnVtYmVyOiBCZWhhdmlvclN1YmplY3Q8c3RyaW5nPiA9IG5ldyBCZWhhdmlvclN1YmplY3QoJycpO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHVibGljIHRhYmxlOiBPVGFibGVDb21wb25lbnRcbiAgKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc0ZpbHRlckJ5Q29sdW1uQ2hhbmdlID0gdGhpcy50YWJsZS5vbkZpbHRlckJ5Q29sdW1uQ2hhbmdlLnN1YnNjcmliZSh4ID0+IHtcbiAgICAgIHNlbGYudXBkYXRlU3RhdGVDb2x1bW5GaWx0ZXIoeCk7XG4gICAgfSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHNGaWx0ZXJCeUNvbHVtbkNoYW5nZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVN0YXRlQ29sdW1uRmlsdGVyKHRoaXMudGFibGUuZGF0YVNvdXJjZS5nZXRDb2x1bW5WYWx1ZUZpbHRlcnMoKSk7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlU3RhdGVDb2x1bW5GaWx0ZXIoY29sdW1uVmFsdWVGaWx0ZXJzOiBBcnJheTxPQ29sdW1uVmFsdWVGaWx0ZXI+KSB7XG4gICAgdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMgPSBjb2x1bW5WYWx1ZUZpbHRlcnM7XG4gICAgdGhpcy5pbmRpY2F0b3JOdW1iZXIubmV4dCh0aGlzLmdldEZpbHRlckluZGljYXRvck51bWJlcmVkKCkpO1xuICAgIHRoaXMuaXNDb2x1bW5GaWx0ZXJBY3RpdmUubmV4dCh0aGlzLmdldENvbHVtblZhbHVlRmlsdGVyQnlBdHRyKCkgIT09IHVuZGVmaW5lZCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29sdW1uVmFsdWVGaWx0ZXJCeUF0dHIoKTogT0NvbHVtblZhbHVlRmlsdGVyIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnMuZmlsdGVyKGl0ZW0gPT4gaXRlbS5hdHRyID09PSB0aGlzLmNvbHVtbi5hdHRyKVswXTtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuQ29sdW1uRmlsdGVyRGlhbG9nKGV2ZW50KSB7XG4gICAgdGhpcy50YWJsZS5vcGVuQ29sdW1uRmlsdGVyRGlhbG9nKHRoaXMuY29sdW1uLCBldmVudCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmlsdGVySW5kaWNhdG9yTnVtYmVyZWQoKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzdWx0ID0gJyc7XG5cbiAgICBjb25zdCBjb2x1bW5zVmFsdWVGaWx0ZXJzID0gdGhpcy5jb2x1bW5WYWx1ZUZpbHRlcnM7XG4gICAgaWYgKGNvbHVtbnNWYWx1ZUZpbHRlcnMubGVuZ3RoIDwgMikgeyByZXR1cm4gcmVzdWx0OyB9XG5cbiAgICBjb25zdCBpbmRleCA9IGNvbHVtbnNWYWx1ZUZpbHRlcnMuZmluZEluZGV4KHggPT4geC5hdHRyID09PSB0aGlzLmNvbHVtbi5hdHRyKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgcmVzdWx0ICs9IGluZGV4ICsgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19