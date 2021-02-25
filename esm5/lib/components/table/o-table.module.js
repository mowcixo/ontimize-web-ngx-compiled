import * as tslib_1 from "tslib";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ObserversModule } from '@angular/cdk/observers';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OSharedModule } from '../../shared/shared.module';
import { OContextMenuModule } from '../contextmenu/o-context-menu.module';
import { OTableColumnCalculatedComponent } from './column/calculated/o-table-column-calculated.component';
import { O_TABLE_CELL_EDITORS } from './column/cell-editor/cell-editor';
import { O_TABLE_CELL_RENDERERS } from './column/cell-renderer/cell-renderer';
import { OTableColumnComponent } from './column/o-table-column.component';
import { OTableContextMenuComponent } from './extensions/contextmenu/o-table-context-menu.component';
import { O_TABLE_DIALOGS } from './extensions/dialog/o-table-dialog-components';
import { OTableExportButtonComponent } from './extensions/export-button/o-table-export-button.component';
import { OTableExportButtonService } from './extensions/export-button/o-table-export-button.service';
import { OTableColumnAggregateComponent } from './extensions/footer/aggregate/o-table-column-aggregate.component';
import { OTableExpandedFooterDirective } from './extensions/footer/expanded/o-table-expanded-footer.directive';
import { O_TABLE_FOOTER_COMPONENTS } from './extensions/footer/o-table-footer-components';
import { OTableMatPaginatorIntl } from './extensions/footer/paginator/o-table-mat-paginator-intl';
import { O_TABLE_HEADER_COMPONENTS } from './extensions/header/o-table-header-components';
import { OTableRowClassPipe } from './extensions/pipes/o-table-row-class.pipe';
import { OTableRowDirective } from './extensions/row/o-table-row.directive';
import { OMatSortModule } from './extensions/sort/o-mat-sort-module';
import { OTableComponent } from './o-table.component';
var OTableModule = (function () {
    function OTableModule() {
    }
    OTableModule.decorators = [
        { type: NgModule, args: [{
                    declarations: tslib_1.__spread([
                        OTableComponent,
                        OTableColumnComponent,
                        OTableColumnCalculatedComponent,
                        OTableContextMenuComponent,
                        OTableRowDirective,
                        OTableExpandedFooterDirective,
                        OTableExportButtonComponent,
                        OTableRowClassPipe
                    ], O_TABLE_CELL_RENDERERS, O_TABLE_CELL_EDITORS, O_TABLE_DIALOGS, O_TABLE_HEADER_COMPONENTS, O_TABLE_FOOTER_COMPONENTS),
                    imports: [
                        CommonModule,
                        OSharedModule,
                        CdkTableModule,
                        DragDropModule,
                        OContextMenuModule,
                        ObserversModule,
                        OMatSortModule,
                        NgxMaterialTimepickerModule
                    ],
                    exports: tslib_1.__spread([
                        OTableComponent,
                        OTableColumnComponent,
                        CdkTableModule,
                        OTableColumnCalculatedComponent,
                        OTableContextMenuComponent,
                        OTableRowDirective,
                        OTableExpandedFooterDirective,
                        OMatSortModule,
                        OTableExportButtonComponent
                    ], O_TABLE_HEADER_COMPONENTS, O_TABLE_CELL_RENDERERS, O_TABLE_CELL_EDITORS, O_TABLE_FOOTER_COMPONENTS),
                    entryComponents: tslib_1.__spread([
                        OTableColumnAggregateComponent,
                        OTableContextMenuComponent
                    ], O_TABLE_CELL_RENDERERS, O_TABLE_CELL_EDITORS, O_TABLE_DIALOGS),
                    providers: [
                        OTableExportButtonService,
                        { provide: MatPaginatorIntl, useClass: OTableMatPaginatorIntl }
                    ]
                },] }
    ];
    return OTableModule;
}());
export { OTableModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3JELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXRFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsK0JBQStCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQUMxRyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQUNyRyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDaEYsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNERBQTRELENBQUM7QUFDekcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDckcsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sa0VBQWtFLENBQUM7QUFDbEgsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sZ0VBQWdFLENBQUM7QUFDL0csT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDMUYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDbEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDMUYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDL0UsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDNUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RDtJQUFBO0lBcUQ0QixDQUFDOztnQkFyRDVCLFFBQVEsU0FBQztvQkFDUixZQUFZO3dCQUNWLGVBQWU7d0JBQ2YscUJBQXFCO3dCQUNyQiwrQkFBK0I7d0JBQy9CLDBCQUEwQjt3QkFDMUIsa0JBQWtCO3dCQUNsQiw2QkFBNkI7d0JBQzdCLDJCQUEyQjt3QkFDM0Isa0JBQWtCO3VCQUNmLHNCQUFzQixFQUN0QixvQkFBb0IsRUFDcEIsZUFBZSxFQUNmLHlCQUF5QixFQUN6Qix5QkFBeUIsQ0FDN0I7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osYUFBYTt3QkFDYixjQUFjO3dCQUNkLGNBQWM7d0JBQ2Qsa0JBQWtCO3dCQUNsQixlQUFlO3dCQUNmLGNBQWM7d0JBQ2QsMkJBQTJCO3FCQUM1QjtvQkFDRCxPQUFPO3dCQUNMLGVBQWU7d0JBQ2YscUJBQXFCO3dCQUNyQixjQUFjO3dCQUNkLCtCQUErQjt3QkFDL0IsMEJBQTBCO3dCQUMxQixrQkFBa0I7d0JBQ2xCLDZCQUE2Qjt3QkFDN0IsY0FBYzt3QkFDZCwyQkFBMkI7dUJBQ3hCLHlCQUF5QixFQUN6QixzQkFBc0IsRUFDdEIsb0JBQW9CLEVBQ3BCLHlCQUF5QixDQUM3QjtvQkFDRCxlQUFlO3dCQUNiLDhCQUE4Qjt3QkFDOUIsMEJBQTBCO3VCQUN2QixzQkFBc0IsRUFDdEIsb0JBQW9CLEVBQ3BCLGVBQWUsQ0FDbkI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULHlCQUF5Qjt3QkFDekIsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFO3FCQUNoRTtpQkFDRjs7SUFDMkIsbUJBQUM7Q0FBQSxBQXJEN0IsSUFxRDZCO1NBQWhCLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9kcmFnLWRyb3AnO1xuaW1wb3J0IHsgT2JzZXJ2ZXJzTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL29ic2VydmVycyc7XG5pbXBvcnQgeyBDZGtUYWJsZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFBhZ2luYXRvckludGwgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBOZ3hNYXRlcmlhbFRpbWVwaWNrZXJNb2R1bGUgfSBmcm9tICduZ3gtbWF0ZXJpYWwtdGltZXBpY2tlcic7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPQ29udGV4dE1lbnVNb2R1bGUgfSBmcm9tICcuLi9jb250ZXh0bWVudS9vLWNvbnRleHQtbWVudS5tb2R1bGUnO1xuaW1wb3J0IHsgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uL2NhbGN1bGF0ZWQvby10YWJsZS1jb2x1bW4tY2FsY3VsYXRlZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT19UQUJMRV9DRUxMX0VESVRPUlMgfSBmcm9tICcuL2NvbHVtbi9jZWxsLWVkaXRvci9jZWxsLWVkaXRvcic7XG5pbXBvcnQgeyBPX1RBQkxFX0NFTExfUkVOREVSRVJTIH0gZnJvbSAnLi9jb2x1bW4vY2VsbC1yZW5kZXJlci9jZWxsLXJlbmRlcmVyJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNvbXBvbmVudCB9IGZyb20gJy4vY29sdW1uL28tdGFibGUtY29sdW1uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVDb250ZXh0TWVudUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9jb250ZXh0bWVudS9vLXRhYmxlLWNvbnRleHQtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT19UQUJMRV9ESUFMT0dTIH0gZnJvbSAnLi9leHRlbnNpb25zL2RpYWxvZy9vLXRhYmxlLWRpYWxvZy1jb21wb25lbnRzJztcbmltcG9ydCB7IE9UYWJsZUV4cG9ydEJ1dHRvbkNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9leHBvcnQtYnV0dG9uL28tdGFibGUtZXhwb3J0LWJ1dHRvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9leHBvcnQtYnV0dG9uL28tdGFibGUtZXhwb3J0LWJ1dHRvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkFnZ3JlZ2F0ZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9mb290ZXIvYWdncmVnYXRlL28tdGFibGUtY29sdW1uLWFnZ3JlZ2F0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlRXhwYW5kZWRGb290ZXJEaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL2V4cGFuZGVkL28tdGFibGUtZXhwYW5kZWQtZm9vdGVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBPX1RBQkxFX0ZPT1RFUl9DT01QT05FTlRTIH0gZnJvbSAnLi9leHRlbnNpb25zL2Zvb3Rlci9vLXRhYmxlLWZvb3Rlci1jb21wb25lbnRzJztcbmltcG9ydCB7IE9UYWJsZU1hdFBhZ2luYXRvckludGwgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL3BhZ2luYXRvci9vLXRhYmxlLW1hdC1wYWdpbmF0b3ItaW50bCc7XG5pbXBvcnQgeyBPX1RBQkxFX0hFQURFUl9DT01QT05FTlRTIH0gZnJvbSAnLi9leHRlbnNpb25zL2hlYWRlci9vLXRhYmxlLWhlYWRlci1jb21wb25lbnRzJztcbmltcG9ydCB7IE9UYWJsZVJvd0NsYXNzUGlwZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9waXBlcy9vLXRhYmxlLXJvdy1jbGFzcy5waXBlJztcbmltcG9ydCB7IE9UYWJsZVJvd0RpcmVjdGl2ZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9yb3cvby10YWJsZS1yb3cuZGlyZWN0aXZlJztcbmltcG9ydCB7IE9NYXRTb3J0TW9kdWxlIH0gZnJvbSAnLi9leHRlbnNpb25zL3NvcnQvby1tYXQtc29ydC1tb2R1bGUnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE9UYWJsZUNvbXBvbmVudCxcbiAgICBPVGFibGVDb2x1bW5Db21wb25lbnQsXG4gICAgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCxcbiAgICBPVGFibGVDb250ZXh0TWVudUNvbXBvbmVudCxcbiAgICBPVGFibGVSb3dEaXJlY3RpdmUsXG4gICAgT1RhYmxlRXhwYW5kZWRGb290ZXJEaXJlY3RpdmUsXG4gICAgT1RhYmxlRXhwb3J0QnV0dG9uQ29tcG9uZW50LFxuICAgIE9UYWJsZVJvd0NsYXNzUGlwZSxcbiAgICAuLi5PX1RBQkxFX0NFTExfUkVOREVSRVJTLFxuICAgIC4uLk9fVEFCTEVfQ0VMTF9FRElUT1JTLFxuICAgIC4uLk9fVEFCTEVfRElBTE9HUyxcbiAgICAuLi5PX1RBQkxFX0hFQURFUl9DT01QT05FTlRTLFxuICAgIC4uLk9fVEFCTEVfRk9PVEVSX0NPTVBPTkVOVFNcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBPU2hhcmVkTW9kdWxlLFxuICAgIENka1RhYmxlTW9kdWxlLFxuICAgIERyYWdEcm9wTW9kdWxlLFxuICAgIE9Db250ZXh0TWVudU1vZHVsZSxcbiAgICBPYnNlcnZlcnNNb2R1bGUsXG4gICAgT01hdFNvcnRNb2R1bGUsXG4gICAgTmd4TWF0ZXJpYWxUaW1lcGlja2VyTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBPVGFibGVDb21wb25lbnQsXG4gICAgT1RhYmxlQ29sdW1uQ29tcG9uZW50LFxuICAgIENka1RhYmxlTW9kdWxlLFxuICAgIE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQsXG4gICAgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQsXG4gICAgT1RhYmxlUm93RGlyZWN0aXZlLFxuICAgIE9UYWJsZUV4cGFuZGVkRm9vdGVyRGlyZWN0aXZlLFxuICAgIE9NYXRTb3J0TW9kdWxlLFxuICAgIE9UYWJsZUV4cG9ydEJ1dHRvbkNvbXBvbmVudCxcbiAgICAuLi5PX1RBQkxFX0hFQURFUl9DT01QT05FTlRTLFxuICAgIC4uLk9fVEFCTEVfQ0VMTF9SRU5ERVJFUlMsXG4gICAgLi4uT19UQUJMRV9DRUxMX0VESVRPUlMsXG4gICAgLi4uT19UQUJMRV9GT09URVJfQ09NUE9ORU5UU1xuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBPVGFibGVDb2x1bW5BZ2dyZWdhdGVDb21wb25lbnQsXG4gICAgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQsXG4gICAgLi4uT19UQUJMRV9DRUxMX1JFTkRFUkVSUyxcbiAgICAuLi5PX1RBQkxFX0NFTExfRURJVE9SUyxcbiAgICAuLi5PX1RBQkxFX0RJQUxPR1NcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZSxcbiAgICB7IHByb3ZpZGU6IE1hdFBhZ2luYXRvckludGwsIHVzZUNsYXNzOiBPVGFibGVNYXRQYWdpbmF0b3JJbnRsIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVNb2R1bGUgeyB9XG4iXX0=