import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Injector } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { OTableComponent } from '../../../o-table.component';
import { OBaseTablePaginator } from './o-base-table-paginator.class';
export const DEFAULT_PAGINATOR_TABLE = [
    'pageSize: page-size',
    'showFirstLastButtons: show-first-last-buttons'
];
export class OTablePaginatorComponent extends OBaseTablePaginator {
    constructor(injector, table) {
        super();
        this.injector = injector;
        this.table = table;
        this._pageIndex = 0;
        this._pageSize = 10;
        this.showFirstLastButtons = true;
        this.pageSize = this.table.queryRows;
        this.pageIndex = this.table.currentPage;
        this.showFirstLastButtons = this.table.showPaginatorFirstLastButtons;
    }
    ngOnInit() {
        this.table.registerPagination(this);
    }
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = value;
        if (this.table.matpaginator) {
            this.table.matpaginator.pageIndex = this._pageIndex;
        }
    }
    isShowingAllRows(selectedLength) {
        return false;
    }
}
OTablePaginatorComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-paginator',
                template: ' ',
                inputs: DEFAULT_PAGINATOR_TABLE,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
OTablePaginatorComponent.ctorParameters = () => [
    { type: Injector },
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTablePaginatorComponent.prototype, "showFirstLastButtons", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1wYWdpbmF0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvZm9vdGVyL3BhZ2luYXRvci9vLXRhYmxlLXBhZ2luYXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQVUsTUFBTSxlQUFlLENBQUM7QUFFekcsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRTNFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVyRSxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRztJQUVyQyxxQkFBcUI7SUFDckIsK0NBQStDO0NBQ2hELENBQUM7QUFRRixNQUFNLE9BQU8sd0JBQXlCLFNBQVEsbUJBQW1CO0lBUy9ELFlBQ1ksUUFBa0IsRUFDeUIsS0FBc0I7UUFFM0UsS0FBSyxFQUFFLENBQUM7UUFIRSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3lCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBVG5FLGVBQVUsR0FBVyxDQUFDLENBQUM7UUFDdkIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUlqQyx5QkFBb0IsR0FBWSxJQUFJLENBQUM7UUFPbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDO0lBQ3ZFLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFNBQVMsQ0FBQyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDM0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDckQ7SUFDSCxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsY0FBc0I7UUFHNUMsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7WUE1Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFFBQVEsRUFBRSxHQUFHO2dCQUNiLE1BQU0sRUFBRSx1QkFBdUI7Z0JBQy9CLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7WUFsQmdFLFFBQVE7WUFJaEUsZUFBZSx1QkEwQm5CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDOztBQUozQztJQURDLGNBQWMsRUFBRTs7c0VBQ29CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RhYmxlUGFnaW5hdG9yIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLXBhZ2luYXRvci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Jhc2VUYWJsZVBhZ2luYXRvciB9IGZyb20gJy4vby1iYXNlLXRhYmxlLXBhZ2luYXRvci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1BBR0lOQVRPUl9UQUJMRSA9IFtcbiAgLy8gcGFnZS1zaXplIFtudW1iZXJdOiBOdW1iZXIgb2YgaXRlbXMgdG8gZGlzcGxheSBvbiBhIHBhZ2UuIEJ5IGRlZmF1bHQgc2V0IHRvIDUwLlxuICAncGFnZVNpemU6IHBhZ2Utc2l6ZScsXG4gICdzaG93Rmlyc3RMYXN0QnV0dG9uczogc2hvdy1maXJzdC1sYXN0LWJ1dHRvbnMnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLXBhZ2luYXRvcicsXG4gIHRlbXBsYXRlOiAnICcsXG4gIGlucHV0czogREVGQVVMVF9QQUdJTkFUT1JfVEFCTEUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZVBhZ2luYXRvckNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVQYWdpbmF0b3IgaW1wbGVtZW50cyBPVGFibGVQYWdpbmF0b3IsIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIF9wYWdlSW5kZXg6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBfcGFnZVNpemU6IG51bWJlciA9IDEwO1xuICBwcm90ZWN0ZWQgX3BhZ2VTaXplT3B0aW9uczogQXJyYXk8YW55PjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93Rmlyc3RMYXN0QnV0dG9uczogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnRcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy50YWJsZS5xdWVyeVJvd3M7XG4gICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnRhYmxlLmN1cnJlbnRQYWdlO1xuICAgIHRoaXMuc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSB0aGlzLnRhYmxlLnNob3dQYWdpbmF0b3JGaXJzdExhc3RCdXR0b25zO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy50YWJsZS5yZWdpc3RlclBhZ2luYXRpb24odGhpcyk7XG4gIH1cblxuICBnZXQgcGFnZUluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VJbmRleDtcbiAgfVxuXG4gIHNldCBwYWdlSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VJbmRleCA9IHZhbHVlO1xuICAgIGlmICh0aGlzLnRhYmxlLm1hdHBhZ2luYXRvcikge1xuICAgICAgdGhpcy50YWJsZS5tYXRwYWdpbmF0b3IucGFnZUluZGV4ID0gdGhpcy5fcGFnZUluZGV4O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc1Nob3dpbmdBbGxSb3dzKHNlbGVjdGVkTGVuZ3RoOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAvLyByZXR1cm4gdGhpcy5fcGFnZVNpemVPcHRpb25zLmluZGV4T2Yoc2VsZWN0ZWRMZW5ndGgpID09PSAodGhpcy5fcGFnZVNpemVPcHRpb25zLmxlbmd0aCAtIDEpO1xuICAgIC8vIHRlbXBvcmFsIHdoaWxlIG5vdCBoYXZpbmcgYW4gb3B0aW9uIGZvciBzaG93aW5nIGFsbCByZWNvcmRzIGluIHBhZ2luYXRlZCB0YWJsZXNcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==