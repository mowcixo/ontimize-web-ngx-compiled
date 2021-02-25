import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, forwardRef, Inject, Injector } from '@angular/core';
import { OTableComponent } from '../../o-table.component';
import { DEFAULT_INPUTS_O_TABLE_COLUMN, OTableColumnComponent } from '../o-table-column.component';
export var DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_COLUMN, [
    'operation',
    'functionOperation: operation-function'
]);
var OTableColumnCalculatedComponent = (function (_super) {
    tslib_1.__extends(OTableColumnCalculatedComponent, _super);
    function OTableColumnCalculatedComponent(table, resolver, injector) {
        var _this = _super.call(this, table, resolver, injector) || this;
        _this.table = table;
        _this.resolver = resolver;
        _this.injector = injector;
        return _this;
    }
    OTableColumnCalculatedComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-column-calculated',
                    template: "<span #container>\n</span>",
                    inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED,
                    providers: [
                        {
                            provide: OTableColumnComponent,
                            useExisting: forwardRef(function () { return OTableColumnCalculatedComponent; })
                        }
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }] }
    ];
    OTableColumnCalculatedComponent.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: ComponentFactoryResolver },
        { type: Injector }
    ]; };
    return OTableColumnCalculatedComponent;
}(OTableColumnComponent));
export { OTableColumnCalculatedComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NhbGN1bGF0ZWQvby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzFELE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRW5HLE1BQU0sQ0FBQyxJQUFNLHdDQUF3QyxvQkFDaEQsNkJBQTZCO0lBRWhDLFdBQVc7SUFFWCx1Q0FBdUM7RUFDeEMsQ0FBQztBQUVGO0lBYXFELDJEQUFxQjtJQUt4RSx5Q0FDb0QsS0FBc0IsRUFDOUQsUUFBa0MsRUFDbEMsUUFBa0I7UUFIOUIsWUFJRSxrQkFBTSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxTQUVqQztRQUxtRCxXQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUM5RCxjQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNsQyxjQUFRLEdBQVIsUUFBUSxDQUFVOztJQUc5QixDQUFDOztnQkF4QkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLHNDQUF5RDtvQkFDekQsTUFBTSxFQUFFLHdDQUF3QztvQkFDaEQsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxxQkFBcUI7NEJBQzlCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLCtCQUErQixFQUEvQixDQUErQixDQUFDO3lCQUMvRDtxQkFDRjtvQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7OztnQkF0QlEsZUFBZSx1QkE4Qm5CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7Z0JBbENBLHdCQUF3QjtnQkFBc0IsUUFBUTs7SUF5Q25HLHNDQUFDO0NBQUEsQUExQkQsQ0FhcUQscUJBQXFCLEdBYXpFO1NBYlksK0JBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWQgfSBmcm9tICcuLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtY29sdW1uLWNhbGN1bGF0ZWQuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi8uLi8uLi8uLi90eXBlcy9vcGVyYXRpb24tZnVuY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NPTFVNTiwgT1RhYmxlQ29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi4vby10YWJsZS1jb2x1bW4uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX0NBTENVTEFURUQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OLFxuICAvLyBvcGVyYXRpb24gW3N0cmluZ106IG9wZXJhdGlvbiAuXG4gICdvcGVyYXRpb24nLFxuICAvLyBvcGVyYXRpb24tZnVuY3Rpb24gW2Z1bnRpb25dOiBjYWxsYmFjayB0aXRsZS4gRGVmYXVsdDogbm8gdmFsdWUuXG4gICdmdW5jdGlvbk9wZXJhdGlvbjogb3BlcmF0aW9uLWZ1bmN0aW9uJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNvbHVtbi1jYWxjdWxhdGVkLmNvbXBvbmVudC5odG1sJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NPTFVNTl9DQUxDVUxBVEVELFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBPVGFibGVDb2x1bW5Db21wb25lbnQsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb2x1bW5DYWxjdWxhdGVkQ29tcG9uZW50KVxuICAgIH1cbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuXG5leHBvcnQgY2xhc3MgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCBleHRlbmRzIE9UYWJsZUNvbHVtbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWQge1xuXG4gIHB1YmxpYyBvcGVyYXRpb246IHN0cmluZztcbiAgcHVibGljIGZ1bmN0aW9uT3BlcmF0aW9uOiBPcGVyYXRvckZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwdWJsaWMgdGFibGU6IE9UYWJsZUNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIodGFibGUsIHJlc29sdmVyLCBpbmplY3Rvcik7XG5cbiAgfVxuXG59XG4iXX0=