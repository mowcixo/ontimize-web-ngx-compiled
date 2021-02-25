import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { OTableComponent } from '../../../o-table.component';
export var DEFAULT_TABLE_COLUMN_AGGREGATE = [
    'attr',
    'title',
    'aggregate',
    'functionAggregate: function-aggregate'
];
var OTableColumnAggregateComponent = (function () {
    function OTableColumnAggregateComponent(table, injector) {
        this.injector = injector;
        this.title = '';
        this.subscription = new Subscription();
        this.table = table;
    }
    Object.defineProperty(OTableColumnAggregateComponent.prototype, "functionAggregate", {
        get: function () {
            return this._aggregateFunction;
        },
        set: function (val) {
            this._aggregateFunction = val;
        },
        enumerable: true,
        configurable: true
    });
    OTableColumnAggregateComponent.prototype.getColumnData = function (attr) {
        var columnData = [];
        if (this.table.dataSource) {
            columnData = this.table.dataSource.getColumnData(attr);
        }
        return columnData;
    };
    OTableColumnAggregateComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.attr) {
            return;
        }
        var ocolumnaggregate = {};
        ocolumnaggregate.attr = this.attr;
        if (this.title) {
            ocolumnaggregate.title = this.title;
        }
        ocolumnaggregate.operator = this.aggregate ? this.aggregate : (this.functionAggregate ? this.functionAggregate : OTableColumnAggregateComponent.DEFAULT_AGGREGATE);
        this.table.registerColumnAggregate(ocolumnaggregate);
        this.subscription.add(this.table.onReinitialize.subscribe(function () { return _this.table.registerColumnAggregate(ocolumnaggregate); }));
    };
    OTableColumnAggregateComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    OTableColumnAggregateComponent.DEFAULT_AGGREGATE = 'SUM';
    OTableColumnAggregateComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-column-aggregate',
                    template: " <!--{{ functionAggregate(getColumnData(attr)) }}-->",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_TABLE_COLUMN_AGGREGATE
                }] }
    ];
    OTableColumnAggregateComponent.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: Injector }
    ]; };
    return OTableColumnAggregateComponent;
}());
export { OTableColumnAggregateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4tYWdncmVnYXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2Zvb3Rlci9hZ2dyZWdhdGUvby10YWJsZS1jb2x1bW4tYWdncmVnYXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUNwSCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBSXBDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU3RCxNQUFNLENBQUMsSUFBTSw4QkFBOEIsR0FBRztJQUU1QyxNQUFNO0lBR04sT0FBTztJQUdQLFdBQVc7SUFHWCx1Q0FBdUM7Q0FDeEMsQ0FBQztBQUVGO0lBaUJFLHdDQUM2QyxLQUFzQixFQUN2RCxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBUHZCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFHaEIsaUJBQVksR0FBaUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUt4RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsc0JBQUksNkRBQWlCO2FBQXJCO1lBQ0UsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDakMsQ0FBQzthQUVELFVBQXNCLEdBQXNCO1lBQzFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUM7UUFDaEMsQ0FBQzs7O09BSkE7SUFNRCxzREFBYSxHQUFiLFVBQWMsSUFBSTtRQUNoQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUN6QixVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELGlEQUFRLEdBQVI7UUFBQSxpQkFlQztRQWRDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBRUQsSUFBTSxnQkFBZ0IsR0FBcUIsRUFBRSxDQUFDO1FBQzlDLGdCQUFnQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNkLGdCQUFnQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JDO1FBRUQsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkssSUFBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRXJELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFwRCxDQUFvRCxDQUFDLENBQUMsQ0FBQztJQUN6SCxDQUFDO0lBRUQsb0RBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQW5EYSxnREFBaUIsR0FBRyxLQUFLLENBQUM7O2dCQVB6QyxTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsZ0VBQXdEO29CQUN4RCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsTUFBTSxFQUFFLDhCQUE4QjtpQkFDdkM7OztnQkFyQlEsZUFBZSx1QkFrQ25CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7Z0JBdkNvQixRQUFROztJQWlGekUscUNBQUM7Q0FBQSxBQTVERCxJQTREQztTQXREWSw4QkFBOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkRlc3Ryb3ksIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFnZ3JlZ2F0ZUZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvYWdncmVnYXRlLWZ1bmN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgT0NvbHVtbkFnZ3JlZ2F0ZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLWFnZ3JlZ2F0ZS50eXBlJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVEFCTEVfQ09MVU1OX0FHR1JFR0FURSA9IFtcbiAgLy8gYXR0ciBbc3RyaW5nXTogY29sdW1uIG5hbWUuXG4gICdhdHRyJyxcblxuICAvLyB0aXRsZSBbc3RyaW5nXTogVGl0bGUgZm9yIHRoZSBoZWFkZXIgdG90YWwgY29sdW1uXG4gICd0aXRsZScsXG5cbiAgLy8gYWdncmVnYXRlIFtzdW0gfCBjb3VudCB8IGF2ZyB8IG1pbiB8bWF4XVxuICAnYWdncmVnYXRlJyxcblxuICAvLyBmdW5jdGlvbi1hZ2dyZWdhdGUgWyAodmFsdWU6IGFueVtdKSA9PiBudW1iZXJdIEZ1bmN0aW9uIHRoYXQgY2FsY3VsYXRlcyBhIHZhbHVlIG9uIHRoZSB2YWx1ZXMgb2YgdGhlIGNvbHVtbiAnYXR0cidcbiAgJ2Z1bmN0aW9uQWdncmVnYXRlOiBmdW5jdGlvbi1hZ2dyZWdhdGUnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNvbHVtbi1hZ2dyZWdhdGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jb2x1bW4tYWdncmVnYXRlLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9UQUJMRV9DT0xVTU5fQUdHUkVHQVRFXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUNvbHVtbkFnZ3JlZ2F0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgcHVibGljIHN0YXRpYyBERUZBVUxUX0FHR1JFR0FURSA9ICdTVU0nO1xuXG4gIHB1YmxpYyBhdHRyOiBzdHJpbmc7XG4gIHB1YmxpYyBhZ2dyZWdhdGU6IHN0cmluZztcbiAgcHVibGljIHRhYmxlOiBPVGFibGVDb21wb25lbnQ7XG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gJyc7XG4gIHByb3RlY3RlZCBfYWdncmVnYXRlRnVuY3Rpb246IEFnZ3JlZ2F0ZUZ1bmN0aW9uO1xuXG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgdGFibGU6IE9UYWJsZUNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy50YWJsZSA9IHRhYmxlO1xuICB9XG5cbiAgZ2V0IGZ1bmN0aW9uQWdncmVnYXRlKCk6IEFnZ3JlZ2F0ZUZ1bmN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fYWdncmVnYXRlRnVuY3Rpb247XG4gIH1cblxuICBzZXQgZnVuY3Rpb25BZ2dyZWdhdGUodmFsOiBBZ2dyZWdhdGVGdW5jdGlvbikge1xuICAgIHRoaXMuX2FnZ3JlZ2F0ZUZ1bmN0aW9uID0gdmFsO1xuICB9XG5cbiAgZ2V0Q29sdW1uRGF0YShhdHRyKSB7XG4gICAgbGV0IGNvbHVtbkRhdGEgPSBbXTtcbiAgICBpZiAodGhpcy50YWJsZS5kYXRhU291cmNlKSB7XG4gICAgICBjb2x1bW5EYXRhID0gdGhpcy50YWJsZS5kYXRhU291cmNlLmdldENvbHVtbkRhdGEoYXR0cik7XG4gICAgfVxuICAgIHJldHVybiBjb2x1bW5EYXRhO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKCF0aGlzLmF0dHIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBvY29sdW1uYWdncmVnYXRlOiBPQ29sdW1uQWdncmVnYXRlID0ge307XG4gICAgb2NvbHVtbmFnZ3JlZ2F0ZS5hdHRyID0gdGhpcy5hdHRyO1xuICAgIGlmICh0aGlzLnRpdGxlKSB7XG4gICAgICBvY29sdW1uYWdncmVnYXRlLnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB9XG5cbiAgICBvY29sdW1uYWdncmVnYXRlLm9wZXJhdG9yID0gdGhpcy5hZ2dyZWdhdGUgPyB0aGlzLmFnZ3JlZ2F0ZSA6ICh0aGlzLmZ1bmN0aW9uQWdncmVnYXRlID8gdGhpcy5mdW5jdGlvbkFnZ3JlZ2F0ZSA6IE9UYWJsZUNvbHVtbkFnZ3JlZ2F0ZUNvbXBvbmVudC5ERUZBVUxUX0FHR1JFR0FURSk7XG4gICAgdGhpcy50YWJsZS5yZWdpc3RlckNvbHVtbkFnZ3JlZ2F0ZShvY29sdW1uYWdncmVnYXRlKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZCh0aGlzLnRhYmxlLm9uUmVpbml0aWFsaXplLnN1YnNjcmliZSgoKSA9PiB0aGlzLnRhYmxlLnJlZ2lzdGVyQ29sdW1uQWdncmVnYXRlKG9jb2x1bW5hZ2dyZWdhdGUpKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbn1cbiJdfQ==