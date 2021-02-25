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
export class OTableModule {
}
OTableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    OTableComponent,
                    OTableColumnComponent,
                    OTableColumnCalculatedComponent,
                    OTableContextMenuComponent,
                    OTableRowDirective,
                    OTableExpandedFooterDirective,
                    OTableExportButtonComponent,
                    OTableRowClassPipe,
                    ...O_TABLE_CELL_RENDERERS,
                    ...O_TABLE_CELL_EDITORS,
                    ...O_TABLE_DIALOGS,
                    ...O_TABLE_HEADER_COMPONENTS,
                    ...O_TABLE_FOOTER_COMPONENTS
                ],
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
                exports: [
                    OTableComponent,
                    OTableColumnComponent,
                    CdkTableModule,
                    OTableColumnCalculatedComponent,
                    OTableContextMenuComponent,
                    OTableRowDirective,
                    OTableExpandedFooterDirective,
                    OMatSortModule,
                    OTableExportButtonComponent,
                    ...O_TABLE_HEADER_COMPONENTS,
                    ...O_TABLE_CELL_RENDERERS,
                    ...O_TABLE_CELL_EDITORS,
                    ...O_TABLE_FOOTER_COMPONENTS
                ],
                entryComponents: [
                    OTableColumnAggregateComponent,
                    OTableContextMenuComponent,
                    ...O_TABLE_CELL_RENDERERS,
                    ...O_TABLE_CELL_EDITORS,
                    ...O_TABLE_DIALOGS
                ],
                providers: [
                    OTableExportButtonService,
                    { provide: MatPaginatorIntl, useClass: OTableMatPaginatorIntl }
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN6RyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNyRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUNsSCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUMvRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNsRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUM1RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBdUR0RCxNQUFNLE9BQU8sWUFBWTs7O1lBckR4QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGVBQWU7b0JBQ2YscUJBQXFCO29CQUNyQiwrQkFBK0I7b0JBQy9CLDBCQUEwQjtvQkFDMUIsa0JBQWtCO29CQUNsQiw2QkFBNkI7b0JBQzdCLDJCQUEyQjtvQkFDM0Isa0JBQWtCO29CQUNsQixHQUFHLHNCQUFzQjtvQkFDekIsR0FBRyxvQkFBb0I7b0JBQ3ZCLEdBQUcsZUFBZTtvQkFDbEIsR0FBRyx5QkFBeUI7b0JBQzVCLEdBQUcseUJBQXlCO2lCQUM3QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixhQUFhO29CQUNiLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxrQkFBa0I7b0JBQ2xCLGVBQWU7b0JBQ2YsY0FBYztvQkFDZCwyQkFBMkI7aUJBQzVCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxlQUFlO29CQUNmLHFCQUFxQjtvQkFDckIsY0FBYztvQkFDZCwrQkFBK0I7b0JBQy9CLDBCQUEwQjtvQkFDMUIsa0JBQWtCO29CQUNsQiw2QkFBNkI7b0JBQzdCLGNBQWM7b0JBQ2QsMkJBQTJCO29CQUMzQixHQUFHLHlCQUF5QjtvQkFDNUIsR0FBRyxzQkFBc0I7b0JBQ3pCLEdBQUcsb0JBQW9CO29CQUN2QixHQUFHLHlCQUF5QjtpQkFDN0I7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLDhCQUE4QjtvQkFDOUIsMEJBQTBCO29CQUMxQixHQUFHLHNCQUFzQjtvQkFDekIsR0FBRyxvQkFBb0I7b0JBQ3ZCLEdBQUcsZUFBZTtpQkFDbkI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULHlCQUF5QjtvQkFDekIsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFO2lCQUNoRTthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcbmltcG9ydCB7IE9ic2VydmVyc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHsgQ2RrVGFibGVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRQYWdpbmF0b3JJbnRsIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTmd4TWF0ZXJpYWxUaW1lcGlja2VyTW9kdWxlIH0gZnJvbSAnbmd4LW1hdGVyaWFsLXRpbWVwaWNrZXInO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51TW9kdWxlIH0gZnJvbSAnLi4vY29udGV4dG1lbnUvby1jb250ZXh0LW1lbnUubW9kdWxlJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9jYWxjdWxhdGVkL28tdGFibGUtY29sdW1uLWNhbGN1bGF0ZWQuY29tcG9uZW50JztcbmltcG9ydCB7IE9fVEFCTEVfQ0VMTF9FRElUT1JTIH0gZnJvbSAnLi9jb2x1bW4vY2VsbC1lZGl0b3IvY2VsbC1lZGl0b3InO1xuaW1wb3J0IHsgT19UQUJMRV9DRUxMX1JFTkRFUkVSUyB9IGZyb20gJy4vY29sdW1uL2NlbGwtcmVuZGVyZXIvY2VsbC1yZW5kZXJlcic7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvY29udGV4dG1lbnUvby10YWJsZS1jb250ZXh0LW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IE9fVEFCTEVfRElBTE9HUyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9kaWFsb2cvby10YWJsZS1kaWFsb2ctY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPVGFibGVFeHBvcnRCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvZXhwb3J0LWJ1dHRvbi9vLXRhYmxlLWV4cG9ydC1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UgfSBmcm9tICcuL2V4dGVuc2lvbnMvZXhwb3J0LWJ1dHRvbi9vLXRhYmxlLWV4cG9ydC1idXR0b24uc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5BZ2dyZWdhdGVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL2FnZ3JlZ2F0ZS9vLXRhYmxlLWNvbHVtbi1hZ2dyZWdhdGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUV4cGFuZGVkRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9leHRlbnNpb25zL2Zvb3Rlci9leHBhbmRlZC9vLXRhYmxlLWV4cGFuZGVkLWZvb3Rlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgT19UQUJMRV9GT09URVJfQ09NUE9ORU5UUyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9mb290ZXIvby10YWJsZS1mb290ZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPVGFibGVNYXRQYWdpbmF0b3JJbnRsIH0gZnJvbSAnLi9leHRlbnNpb25zL2Zvb3Rlci9wYWdpbmF0b3Ivby10YWJsZS1tYXQtcGFnaW5hdG9yLWludGwnO1xuaW1wb3J0IHsgT19UQUJMRV9IRUFERVJfQ09NUE9ORU5UUyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9oZWFkZXIvby10YWJsZS1oZWFkZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPVGFibGVSb3dDbGFzc1BpcGUgfSBmcm9tICcuL2V4dGVuc2lvbnMvcGlwZXMvby10YWJsZS1yb3ctY2xhc3MucGlwZSc7XG5pbXBvcnQgeyBPVGFibGVSb3dEaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbnMvcm93L28tdGFibGUtcm93LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBPTWF0U29ydE1vZHVsZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQtbW9kdWxlJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vby10YWJsZS5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBPVGFibGVDb21wb25lbnQsXG4gICAgT1RhYmxlQ29sdW1uQ29tcG9uZW50LFxuICAgIE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQsXG4gICAgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQsXG4gICAgT1RhYmxlUm93RGlyZWN0aXZlLFxuICAgIE9UYWJsZUV4cGFuZGVkRm9vdGVyRGlyZWN0aXZlLFxuICAgIE9UYWJsZUV4cG9ydEJ1dHRvbkNvbXBvbmVudCxcbiAgICBPVGFibGVSb3dDbGFzc1BpcGUsXG4gICAgLi4uT19UQUJMRV9DRUxMX1JFTkRFUkVSUyxcbiAgICAuLi5PX1RBQkxFX0NFTExfRURJVE9SUyxcbiAgICAuLi5PX1RBQkxFX0RJQUxPR1MsXG4gICAgLi4uT19UQUJMRV9IRUFERVJfQ09NUE9ORU5UUyxcbiAgICAuLi5PX1RBQkxFX0ZPT1RFUl9DT01QT05FTlRTXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgT1NoYXJlZE1vZHVsZSxcbiAgICBDZGtUYWJsZU1vZHVsZSxcbiAgICBEcmFnRHJvcE1vZHVsZSxcbiAgICBPQ29udGV4dE1lbnVNb2R1bGUsXG4gICAgT2JzZXJ2ZXJzTW9kdWxlLFxuICAgIE9NYXRTb3J0TW9kdWxlLFxuICAgIE5neE1hdGVyaWFsVGltZXBpY2tlck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgT1RhYmxlQ29tcG9uZW50LFxuICAgIE9UYWJsZUNvbHVtbkNvbXBvbmVudCxcbiAgICBDZGtUYWJsZU1vZHVsZSxcbiAgICBPVGFibGVDb2x1bW5DYWxjdWxhdGVkQ29tcG9uZW50LFxuICAgIE9UYWJsZUNvbnRleHRNZW51Q29tcG9uZW50LFxuICAgIE9UYWJsZVJvd0RpcmVjdGl2ZSxcbiAgICBPVGFibGVFeHBhbmRlZEZvb3RlckRpcmVjdGl2ZSxcbiAgICBPTWF0U29ydE1vZHVsZSxcbiAgICBPVGFibGVFeHBvcnRCdXR0b25Db21wb25lbnQsXG4gICAgLi4uT19UQUJMRV9IRUFERVJfQ09NUE9ORU5UUyxcbiAgICAuLi5PX1RBQkxFX0NFTExfUkVOREVSRVJTLFxuICAgIC4uLk9fVEFCTEVfQ0VMTF9FRElUT1JTLFxuICAgIC4uLk9fVEFCTEVfRk9PVEVSX0NPTVBPTkVOVFNcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgT1RhYmxlQ29sdW1uQWdncmVnYXRlQ29tcG9uZW50LFxuICAgIE9UYWJsZUNvbnRleHRNZW51Q29tcG9uZW50LFxuICAgIC4uLk9fVEFCTEVfQ0VMTF9SRU5ERVJFUlMsXG4gICAgLi4uT19UQUJMRV9DRUxMX0VESVRPUlMsXG4gICAgLi4uT19UQUJMRV9ESUFMT0dTXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UsXG4gICAgeyBwcm92aWRlOiBNYXRQYWdpbmF0b3JJbnRsLCB1c2VDbGFzczogT1RhYmxlTWF0UGFnaW5hdG9ySW50bCB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlTW9kdWxlIHsgfVxuIl19