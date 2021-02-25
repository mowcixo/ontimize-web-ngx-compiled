import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { OTableComponent } from '../../../o-table.component';
export const DEFAULT_TABLE_COLUMN_AGGREGATE = [
    'attr',
    'title',
    'aggregate',
    'functionAggregate: function-aggregate'
];
export class OTableColumnAggregateComponent {
    constructor(table, injector) {
        this.injector = injector;
        this.title = '';
        this.subscription = new Subscription();
        this.table = table;
    }
    get functionAggregate() {
        return this._aggregateFunction;
    }
    set functionAggregate(val) {
        this._aggregateFunction = val;
    }
    getColumnData(attr) {
        let columnData = [];
        if (this.table.dataSource) {
            columnData = this.table.dataSource.getColumnData(attr);
        }
        return columnData;
    }
    ngOnInit() {
        if (!this.attr) {
            return;
        }
        const ocolumnaggregate = {};
        ocolumnaggregate.attr = this.attr;
        if (this.title) {
            ocolumnaggregate.title = this.title;
        }
        ocolumnaggregate.operator = this.aggregate ? this.aggregate : (this.functionAggregate ? this.functionAggregate : OTableColumnAggregateComponent.DEFAULT_AGGREGATE);
        this.table.registerColumnAggregate(ocolumnaggregate);
        this.subscription.add(this.table.onReinitialize.subscribe(() => this.table.registerColumnAggregate(ocolumnaggregate)));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
OTableColumnAggregateComponent.DEFAULT_AGGREGATE = 'SUM';
OTableColumnAggregateComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-column-aggregate',
                template: " <!--{{ functionAggregate(getColumnData(attr)) }}-->",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_TABLE_COLUMN_AGGREGATE
            }] }
];
OTableColumnAggregateComponent.ctorParameters = () => [
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4tYWdncmVnYXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2Zvb3Rlci9hZ2dyZWdhdGUvby10YWJsZS1jb2x1bW4tYWdncmVnYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUNwSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBSXBDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSw4QkFBOEIsR0FBRztJQUU1QyxNQUFNO0lBR04sT0FBTztJQUdQLFdBQVc7SUFHWCx1Q0FBdUM7Q0FDeEMsQ0FBQztBQVFGLE1BQU0sT0FBTyw4QkFBOEI7SUFXekMsWUFDNkMsS0FBc0IsRUFDdkQsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVB2QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBR2hCLGlCQUFZLEdBQWlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFLeEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLGlCQUFpQixDQUFDLEdBQXNCO1FBQzFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUM7SUFDaEMsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFJO1FBQ2hCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3pCLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEQ7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBRUQsTUFBTSxnQkFBZ0IsR0FBcUIsRUFBRSxDQUFDO1FBQzlDLGdCQUFnQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLGdCQUFnQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JDO1FBRUQsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkssSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXJELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDOztBQW5EYSxnREFBaUIsR0FBRyxLQUFLLENBQUM7O1lBUHpDLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMEJBQTBCO2dCQUNwQyxnRUFBd0Q7Z0JBQ3hELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxNQUFNLEVBQUUsOEJBQThCO2FBQ3ZDOzs7WUFyQlEsZUFBZSx1QkFrQ25CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO1lBdkNvQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBBZ2dyZWdhdGVGdW5jdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL2FnZ3JlZ2F0ZS1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IE9Db2x1bW5BZ2dyZWdhdGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLWNvbHVtbi1hZ2dyZWdhdGUudHlwZSc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RBQkxFX0NPTFVNTl9BR0dSRUdBVEUgPSBbXG4gIC8vIGF0dHIgW3N0cmluZ106IGNvbHVtbiBuYW1lLlxuICAnYXR0cicsXG5cbiAgLy8gdGl0bGUgW3N0cmluZ106IFRpdGxlIGZvciB0aGUgaGVhZGVyIHRvdGFsIGNvbHVtblxuICAndGl0bGUnLFxuXG4gIC8vIGFnZ3JlZ2F0ZSBbc3VtIHwgY291bnQgfCBhdmcgfCBtaW4gfG1heF1cbiAgJ2FnZ3JlZ2F0ZScsXG5cbiAgLy8gZnVuY3Rpb24tYWdncmVnYXRlIFsgKHZhbHVlOiBhbnlbXSkgPT4gbnVtYmVyXSBGdW5jdGlvbiB0aGF0IGNhbGN1bGF0ZXMgYSB2YWx1ZSBvbiB0aGUgdmFsdWVzIG9mIHRoZSBjb2x1bW4gJ2F0dHInXG4gICdmdW5jdGlvbkFnZ3JlZ2F0ZTogZnVuY3Rpb24tYWdncmVnYXRlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jb2x1bW4tYWdncmVnYXRlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY29sdW1uLWFnZ3JlZ2F0ZS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfVEFCTEVfQ09MVU1OX0FHR1JFR0FURVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDb2x1bW5BZ2dyZWdhdGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9BR0dSRUdBVEUgPSAnU1VNJztcblxuICBwdWJsaWMgYXR0cjogc3RyaW5nO1xuICBwdWJsaWMgYWdncmVnYXRlOiBzdHJpbmc7XG4gIHB1YmxpYyB0YWJsZTogT1RhYmxlQ29tcG9uZW50O1xuICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgX2FnZ3JlZ2F0ZUZ1bmN0aW9uOiBBZ2dyZWdhdGVGdW5jdGlvbjtcblxuICBwcm90ZWN0ZWQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHRhYmxlOiBPVGFibGVDb21wb25lbnQsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMudGFibGUgPSB0YWJsZTtcbiAgfVxuXG4gIGdldCBmdW5jdGlvbkFnZ3JlZ2F0ZSgpOiBBZ2dyZWdhdGVGdW5jdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FnZ3JlZ2F0ZUZ1bmN0aW9uO1xuICB9XG5cbiAgc2V0IGZ1bmN0aW9uQWdncmVnYXRlKHZhbDogQWdncmVnYXRlRnVuY3Rpb24pIHtcbiAgICB0aGlzLl9hZ2dyZWdhdGVGdW5jdGlvbiA9IHZhbDtcbiAgfVxuXG4gIGdldENvbHVtbkRhdGEoYXR0cikge1xuICAgIGxldCBjb2x1bW5EYXRhID0gW107XG4gICAgaWYgKHRoaXMudGFibGUuZGF0YVNvdXJjZSkge1xuICAgICAgY29sdW1uRGF0YSA9IHRoaXMudGFibGUuZGF0YVNvdXJjZS5nZXRDb2x1bW5EYXRhKGF0dHIpO1xuICAgIH1cbiAgICByZXR1cm4gY29sdW1uRGF0YTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghdGhpcy5hdHRyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2NvbHVtbmFnZ3JlZ2F0ZTogT0NvbHVtbkFnZ3JlZ2F0ZSA9IHt9O1xuICAgIG9jb2x1bW5hZ2dyZWdhdGUuYXR0ciA9IHRoaXMuYXR0cjtcbiAgICBpZiAodGhpcy50aXRsZSkge1xuICAgICAgb2NvbHVtbmFnZ3JlZ2F0ZS50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgfVxuXG4gICAgb2NvbHVtbmFnZ3JlZ2F0ZS5vcGVyYXRvciA9IHRoaXMuYWdncmVnYXRlID8gdGhpcy5hZ2dyZWdhdGUgOiAodGhpcy5mdW5jdGlvbkFnZ3JlZ2F0ZSA/IHRoaXMuZnVuY3Rpb25BZ2dyZWdhdGUgOiBPVGFibGVDb2x1bW5BZ2dyZWdhdGVDb21wb25lbnQuREVGQVVMVF9BR0dSRUdBVEUpO1xuICAgIHRoaXMudGFibGUucmVnaXN0ZXJDb2x1bW5BZ2dyZWdhdGUob2NvbHVtbmFnZ3JlZ2F0ZSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGQodGhpcy50YWJsZS5vblJlaW5pdGlhbGl6ZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy50YWJsZS5yZWdpc3RlckNvbHVtbkFnZ3JlZ2F0ZShvY29sdW1uYWdncmVnYXRlKSkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG59XG4iXX0=