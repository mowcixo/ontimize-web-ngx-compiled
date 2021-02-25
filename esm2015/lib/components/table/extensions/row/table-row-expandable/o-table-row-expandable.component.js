import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation, ChangeDetectionStrategy, TemplateRef, ContentChild, EventEmitter, Output } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
export const DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE = [
    'onExpanded',
    'onCollapsed'
];
export const DEFAULT_INPUTS_O_TABLE_ROW_EXPANDABLE = [
    'iconExpand:icon-expand',
    'iconCollapse:icon-collapse',
    'expandableColumnVisible:expandable-column-visible'
];
export class OTableRowExpandedChange {
}
export class OTableRowExpandableComponent {
    constructor() {
        this.onExpanded = new EventEmitter();
        this.onCollapsed = new EventEmitter();
        this._iconCollapse = 'remove';
        this._iconExpand = 'add';
        this.expandableColumnVisible = true;
    }
    set iconCollapse(value) {
        this._iconCollapse = value;
    }
    get iconCollapse() {
        return this._iconCollapse;
    }
    set iconExpand(value) {
        this._iconExpand = value;
    }
    get iconExpand() {
        return this._iconExpand;
    }
}
OTableRowExpandableComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-row-expandable',
                template: ' ',
                outputs: DEFAULT_OUTPUTS_O_TABLE_ROW_EXPANDABLE,
                inputs: DEFAULT_INPUTS_O_TABLE_ROW_EXPANDABLE,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
OTableRowExpandableComponent.ctorParameters = () => [];
OTableRowExpandableComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef, { static: false },] }],
    onExpanded: [{ type: Output }],
    onCollapsed: [{ type: Output }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableRowExpandableComponent.prototype, "expandableColumnVisible", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1yb3ctZXhwYW5kYWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9yb3cvdGFibGUtcm93LWV4cGFuZGFibGUvby10YWJsZS1yb3ctZXhwYW5kYWJsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZJLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUUzRSxNQUFNLENBQUMsTUFBTSxzQ0FBc0MsR0FBRztJQUNwRCxZQUFZO0lBQ1osYUFBYTtDQUNkLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxxQ0FBcUMsR0FBRztJQUVuRCx3QkFBd0I7SUFFeEIsNEJBQTRCO0lBRTVCLG1EQUFtRDtDQUNwRCxDQUFDO0FBR0YsTUFBTSxPQUFPLHVCQUF1QjtDQUtuQztBQVdELE1BQU0sT0FBTyw0QkFBNEI7SUFFdkM7UUFHVSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQTJCLENBQUM7UUFDekQsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBMkIsQ0FBQztRQUM1RCxrQkFBYSxHQUFXLFFBQVEsQ0FBQztRQUNqQyxnQkFBVyxHQUFXLEtBQUssQ0FBQztRQUc3Qiw0QkFBdUIsR0FBWSxJQUFJLENBQUM7SUFUL0IsQ0FBQztJQVdqQixJQUFJLFlBQVksQ0FBQyxLQUFhO1FBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLFlBQVk7UUFDZCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLEtBQWE7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDOzs7WUFuQ0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLFFBQVEsRUFBRSxHQUFHO2dCQUNiLE9BQU8sRUFBRSxzQ0FBc0M7Z0JBQy9DLE1BQU0sRUFBRSxxQ0FBcUM7Z0JBQzdDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7OzswQkFLRSxZQUFZLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTt5QkFDM0MsTUFBTTswQkFDTixNQUFNOztBQUtQO0lBREMsY0FBYyxFQUFFOzs2RUFDOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgVGVtcGxhdGVSZWYsIENvbnRlbnRDaGlsZCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfUk9XX0VYUEFOREFCTEUgPSBbXG4gICdvbkV4cGFuZGVkJyxcbiAgJ29uQ29sbGFwc2VkJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfUk9XX0VYUEFOREFCTEUgPSBbXG4gIC8vIGljb24tZXhwYW5kIDogSWNvbiBuYW1lIHRvIGV4cGFuZC4gRGVmYXVsdDogYWRkXG4gICdpY29uRXhwYW5kOmljb24tZXhwYW5kJyxcbiAgLy8gaWNvbi1jb2xsYXBzZSA6IEljb24gbmFtZSB0byBleHBhbmQuIERlZmF1bHQ6cmVtb3ZlXG4gICdpY29uQ29sbGFwc2U6aWNvbi1jb2xsYXBzZScsXG4gIC8vIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCB0byBzaG93IGEgZXhwYW5kYWJsZSBjb2x1bW4uIERlZmF1bHQ6dHJ1ZVxuICAnZXhwYW5kYWJsZUNvbHVtblZpc2libGU6ZXhwYW5kYWJsZS1jb2x1bW4tdmlzaWJsZSdcbl07XG5cbi8qKiBDaGFuZ2UgZXZlbnQgb2JqZWN0IGVtaXR0ZWQgYnkgT1RhYmxlUm93RXhwYW5kZWQuICovXG5leHBvcnQgY2xhc3MgT1RhYmxlUm93RXhwYW5kZWRDaGFuZ2Uge1xuICAvKiogVGhlIGRhdGEgZm9yIHJvdyBleHBhbmRhYmxlLiAqL1xuICBkYXRhOiBhbnk7XG4gIC8qKiByb3cgaW5kZXggZm9yIHJvdyBleHBhbmRhYmxlICovXG4gIHJvd0luZGV4OiBudW1iZXI7XG59XG5cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1yb3ctZXhwYW5kYWJsZScsXG4gIHRlbXBsYXRlOiAnICcsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX1JPV19FWFBBTkRBQkxFLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfUk9XX0VYUEFOREFCTEUsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZVJvd0V4cGFuZGFibGVDb21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IGZhbHNlIH0pIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBAT3V0cHV0KCkgb25FeHBhbmRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8T1RhYmxlUm93RXhwYW5kZWRDaGFuZ2U+KCk7XG4gIEBPdXRwdXQoKSBvbkNvbGxhcHNlZCA9IG5ldyBFdmVudEVtaXR0ZXI8T1RhYmxlUm93RXhwYW5kZWRDaGFuZ2U+KCk7XG4gIHByaXZhdGUgX2ljb25Db2xsYXBzZTogc3RyaW5nID0gJ3JlbW92ZSc7XG4gIHByaXZhdGUgX2ljb25FeHBhbmQ6IHN0cmluZyA9ICdhZGQnO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBleHBhbmRhYmxlQ29sdW1uVmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgc2V0IGljb25Db2xsYXBzZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWNvbkNvbGxhcHNlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgaWNvbkNvbGxhcHNlKCkge1xuICAgIHJldHVybiB0aGlzLl9pY29uQ29sbGFwc2U7XG4gIH1cblxuICBzZXQgaWNvbkV4cGFuZCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5faWNvbkV4cGFuZCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGljb25FeHBhbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ljb25FeHBhbmQ7XG4gIH1cblxufVxuIl19