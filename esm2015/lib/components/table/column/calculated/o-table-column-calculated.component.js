import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, forwardRef, Inject, Injector } from '@angular/core';
import { OTableComponent } from '../../o-table.component';
import { DEFAULT_INPUTS_O_TABLE_COLUMN, OTableColumnComponent } from '../o-table-column.component';
export const DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED = [
    ...DEFAULT_INPUTS_O_TABLE_COLUMN,
    'operation',
    'functionOperation: operation-function'
];
export class OTableColumnCalculatedComponent extends OTableColumnComponent {
    constructor(table, resolver, injector) {
        super(table, resolver, injector);
        this.table = table;
        this.resolver = resolver;
        this.injector = injector;
    }
}
OTableColumnCalculatedComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-column-calculated',
                template: "<span #container>\n</span>",
                inputs: DEFAULT_INPUTS_O_TABLE_COLUMN_CALCULATED,
                providers: [
                    {
                        provide: OTableColumnComponent,
                        useExisting: forwardRef(() => OTableColumnCalculatedComponent)
                    }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush
            }] }
];
OTableColumnCalculatedComponent.ctorParameters = () => [
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] },
    { type: ComponentFactoryResolver },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NhbGN1bGF0ZWQvby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDMUQsT0FBTyxFQUFFLDZCQUE2QixFQUFFLHFCQUFxQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFbkcsTUFBTSxDQUFDLE1BQU0sd0NBQXdDLEdBQUc7SUFDdEQsR0FBRyw2QkFBNkI7SUFFaEMsV0FBVztJQUVYLHVDQUF1QztDQUN4QyxDQUFDO0FBZUYsTUFBTSxPQUFPLCtCQUFnQyxTQUFRLHFCQUFxQjtJQUt4RSxZQUNvRCxLQUFzQixFQUM5RCxRQUFrQyxFQUNsQyxRQUFrQjtRQUM1QixLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUhpQixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUM5RCxhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO0lBRzlCLENBQUM7OztZQXhCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtnQkFDckMsc0NBQXlEO2dCQUN6RCxNQUFNLEVBQUUsd0NBQXdDO2dCQUNoRCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjt3QkFDOUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztxQkFDL0Q7aUJBQ0Y7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQXRCUSxlQUFlLHVCQThCbkIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFsQ0Esd0JBQXdCO1lBQXNCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZCB9IGZyb20gJy4uLy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL29wZXJhdGlvbi1mdW5jdGlvbi50eXBlJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OLCBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuLi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU5fQ0FMQ1VMQVRFRCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DT0xVTU4sXG4gIC8vIG9wZXJhdGlvbiBbc3RyaW5nXTogb3BlcmF0aW9uIC5cbiAgJ29wZXJhdGlvbicsXG4gIC8vIG9wZXJhdGlvbi1mdW5jdGlvbiBbZnVudGlvbl06IGNhbGxiYWNrIHRpdGxlLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2Z1bmN0aW9uT3BlcmF0aW9uOiBvcGVyYXRpb24tZnVuY3Rpb24nXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNvbHVtbi1jYWxjdWxhdGVkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY29sdW1uLWNhbGN1bGF0ZWQuY29tcG9uZW50Lmh0bWwnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ09MVU1OX0NBTENVTEFURUQsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE9UYWJsZUNvbHVtbkNvbXBvbmVudCxcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQpXG4gICAgfVxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVDb2x1bW5DYWxjdWxhdGVkQ29tcG9uZW50IGV4dGVuZHMgT1RhYmxlQ29sdW1uQ29tcG9uZW50IGltcGxlbWVudHMgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZCB7XG5cbiAgcHVibGljIG9wZXJhdGlvbjogc3RyaW5nO1xuICBwdWJsaWMgZnVuY3Rpb25PcGVyYXRpb246IE9wZXJhdG9yRnVuY3Rpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHB1YmxpYyB0YWJsZTogT1RhYmxlQ29tcG9uZW50LFxuICAgIHByb3RlY3RlZCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcih0YWJsZSwgcmVzb2x2ZXIsIGluamVjdG9yKTtcblxuICB9XG5cbn1cbiJdfQ==