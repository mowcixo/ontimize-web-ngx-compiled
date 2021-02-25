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
import { OTableRowExpandableComponent } from './extensions/row/table-row-expandable/o-table-row-expandable.component';
import { PortalModule } from '@angular/cdk/portal';
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
                    ...O_TABLE_FOOTER_COMPONENTS,
                    OTableRowExpandableComponent
                ],
                imports: [
                    CommonModule,
                    OSharedModule,
                    CdkTableModule,
                    DragDropModule,
                    PortalModule,
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
                    OTableRowClassPipe,
                    ...O_TABLE_HEADER_COMPONENTS,
                    ...O_TABLE_CELL_RENDERERS,
                    ...O_TABLE_CELL_EDITORS,
                    ...O_TABLE_FOOTER_COMPONENTS,
                    OTableRowExpandableComponent
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvby10YWJsZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQzFHLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3JHLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNoRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN6RyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNyRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUNsSCxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUMvRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNsRyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMvRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUM1RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDckUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLHdFQUF3RSxDQUFDO0FBQ3RILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQTJEbkQsTUFBTSxPQUFPLFlBQVk7OztZQXpEeEIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixlQUFlO29CQUNmLHFCQUFxQjtvQkFDckIsK0JBQStCO29CQUMvQiwwQkFBMEI7b0JBQzFCLGtCQUFrQjtvQkFDbEIsNkJBQTZCO29CQUM3QiwyQkFBMkI7b0JBQzNCLGtCQUFrQjtvQkFDbEIsR0FBRyxzQkFBc0I7b0JBQ3pCLEdBQUcsb0JBQW9CO29CQUN2QixHQUFHLGVBQWU7b0JBQ2xCLEdBQUcseUJBQXlCO29CQUM1QixHQUFHLHlCQUF5QjtvQkFDNUIsNEJBQTRCO2lCQUM3QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixhQUFhO29CQUNiLGNBQWM7b0JBQ2QsY0FBYztvQkFDZCxZQUFZO29CQUNaLGtCQUFrQjtvQkFDbEIsZUFBZTtvQkFDZixjQUFjO29CQUNkLDJCQUEyQjtpQkFDNUI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGVBQWU7b0JBQ2YscUJBQXFCO29CQUNyQixjQUFjO29CQUNkLCtCQUErQjtvQkFDL0IsMEJBQTBCO29CQUMxQixrQkFBa0I7b0JBQ2xCLDZCQUE2QjtvQkFDN0IsY0FBYztvQkFDZCwyQkFBMkI7b0JBQzNCLGtCQUFrQjtvQkFDbEIsR0FBRyx5QkFBeUI7b0JBQzVCLEdBQUcsc0JBQXNCO29CQUN6QixHQUFHLG9CQUFvQjtvQkFDdkIsR0FBRyx5QkFBeUI7b0JBQzVCLDRCQUE0QjtpQkFDN0I7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLDhCQUE4QjtvQkFDOUIsMEJBQTBCO29CQUMxQixHQUFHLHNCQUFzQjtvQkFDekIsR0FBRyxvQkFBb0I7b0JBQ3ZCLEdBQUcsZUFBZTtpQkFDbkI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULHlCQUF5QjtvQkFDekIsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFO2lCQUNoRTthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcbmltcG9ydCB7IE9ic2VydmVyc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vYnNlcnZlcnMnO1xuaW1wb3J0IHsgQ2RrVGFibGVNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRQYWdpbmF0b3JJbnRsIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgTmd4TWF0ZXJpYWxUaW1lcGlja2VyTW9kdWxlIH0gZnJvbSAnbmd4LW1hdGVyaWFsLXRpbWVwaWNrZXInO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51TW9kdWxlIH0gZnJvbSAnLi4vY29udGV4dG1lbnUvby1jb250ZXh0LW1lbnUubW9kdWxlJztcbmltcG9ydCB7IE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9jYWxjdWxhdGVkL28tdGFibGUtY29sdW1uLWNhbGN1bGF0ZWQuY29tcG9uZW50JztcbmltcG9ydCB7IE9fVEFCTEVfQ0VMTF9FRElUT1JTIH0gZnJvbSAnLi9jb2x1bW4vY2VsbC1lZGl0b3IvY2VsbC1lZGl0b3InO1xuaW1wb3J0IHsgT19UQUJMRV9DRUxMX1JFTkRFUkVSUyB9IGZyb20gJy4vY29sdW1uL2NlbGwtcmVuZGVyZXIvY2VsbC1yZW5kZXJlcic7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuL2NvbHVtbi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvY29udGV4dG1lbnUvby10YWJsZS1jb250ZXh0LW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IE9fVEFCTEVfRElBTE9HUyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9kaWFsb2cvby10YWJsZS1kaWFsb2ctY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPVGFibGVFeHBvcnRCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvZXhwb3J0LWJ1dHRvbi9vLXRhYmxlLWV4cG9ydC1idXR0b24uY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UgfSBmcm9tICcuL2V4dGVuc2lvbnMvZXhwb3J0LWJ1dHRvbi9vLXRhYmxlLWV4cG9ydC1idXR0b24uc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5BZ2dyZWdhdGVDb21wb25lbnQgfSBmcm9tICcuL2V4dGVuc2lvbnMvZm9vdGVyL2FnZ3JlZ2F0ZS9vLXRhYmxlLWNvbHVtbi1hZ2dyZWdhdGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUV4cGFuZGVkRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9leHRlbnNpb25zL2Zvb3Rlci9leHBhbmRlZC9vLXRhYmxlLWV4cGFuZGVkLWZvb3Rlci5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgT19UQUJMRV9GT09URVJfQ09NUE9ORU5UUyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9mb290ZXIvby10YWJsZS1mb290ZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPVGFibGVNYXRQYWdpbmF0b3JJbnRsIH0gZnJvbSAnLi9leHRlbnNpb25zL2Zvb3Rlci9wYWdpbmF0b3Ivby10YWJsZS1tYXQtcGFnaW5hdG9yLWludGwnO1xuaW1wb3J0IHsgT19UQUJMRV9IRUFERVJfQ09NUE9ORU5UUyB9IGZyb20gJy4vZXh0ZW5zaW9ucy9oZWFkZXIvby10YWJsZS1oZWFkZXItY29tcG9uZW50cyc7XG5pbXBvcnQgeyBPVGFibGVSb3dDbGFzc1BpcGUgfSBmcm9tICcuL2V4dGVuc2lvbnMvcGlwZXMvby10YWJsZS1yb3ctY2xhc3MucGlwZSc7XG5pbXBvcnQgeyBPVGFibGVSb3dEaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbnMvcm93L28tdGFibGUtcm93LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBPTWF0U29ydE1vZHVsZSB9IGZyb20gJy4vZXh0ZW5zaW9ucy9zb3J0L28tbWF0LXNvcnQtbW9kdWxlJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlUm93RXhwYW5kYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vZXh0ZW5zaW9ucy9yb3cvdGFibGUtcm93LWV4cGFuZGFibGUvby10YWJsZS1yb3ctZXhwYW5kYWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE9UYWJsZUNvbXBvbmVudCxcbiAgICBPVGFibGVDb2x1bW5Db21wb25lbnQsXG4gICAgT1RhYmxlQ29sdW1uQ2FsY3VsYXRlZENvbXBvbmVudCxcbiAgICBPVGFibGVDb250ZXh0TWVudUNvbXBvbmVudCxcbiAgICBPVGFibGVSb3dEaXJlY3RpdmUsXG4gICAgT1RhYmxlRXhwYW5kZWRGb290ZXJEaXJlY3RpdmUsXG4gICAgT1RhYmxlRXhwb3J0QnV0dG9uQ29tcG9uZW50LFxuICAgIE9UYWJsZVJvd0NsYXNzUGlwZSxcbiAgICAuLi5PX1RBQkxFX0NFTExfUkVOREVSRVJTLFxuICAgIC4uLk9fVEFCTEVfQ0VMTF9FRElUT1JTLFxuICAgIC4uLk9fVEFCTEVfRElBTE9HUyxcbiAgICAuLi5PX1RBQkxFX0hFQURFUl9DT01QT05FTlRTLFxuICAgIC4uLk9fVEFCTEVfRk9PVEVSX0NPTVBPTkVOVFMsXG4gICAgT1RhYmxlUm93RXhwYW5kYWJsZUNvbXBvbmVudFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIE9TaGFyZWRNb2R1bGUsXG4gICAgQ2RrVGFibGVNb2R1bGUsXG4gICAgRHJhZ0Ryb3BNb2R1bGUsXG4gICAgUG9ydGFsTW9kdWxlLFxuICAgIE9Db250ZXh0TWVudU1vZHVsZSxcbiAgICBPYnNlcnZlcnNNb2R1bGUsXG4gICAgT01hdFNvcnRNb2R1bGUsXG4gICAgTmd4TWF0ZXJpYWxUaW1lcGlja2VyTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBPVGFibGVDb21wb25lbnQsXG4gICAgT1RhYmxlQ29sdW1uQ29tcG9uZW50LFxuICAgIENka1RhYmxlTW9kdWxlLFxuICAgIE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWRDb21wb25lbnQsXG4gICAgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQsXG4gICAgT1RhYmxlUm93RGlyZWN0aXZlLFxuICAgIE9UYWJsZUV4cGFuZGVkRm9vdGVyRGlyZWN0aXZlLFxuICAgIE9NYXRTb3J0TW9kdWxlLFxuICAgIE9UYWJsZUV4cG9ydEJ1dHRvbkNvbXBvbmVudCxcbiAgICBPVGFibGVSb3dDbGFzc1BpcGUsXG4gICAgLi4uT19UQUJMRV9IRUFERVJfQ09NUE9ORU5UUyxcbiAgICAuLi5PX1RBQkxFX0NFTExfUkVOREVSRVJTLFxuICAgIC4uLk9fVEFCTEVfQ0VMTF9FRElUT1JTLFxuICAgIC4uLk9fVEFCTEVfRk9PVEVSX0NPTVBPTkVOVFMsXG4gICAgT1RhYmxlUm93RXhwYW5kYWJsZUNvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICBPVGFibGVDb2x1bW5BZ2dyZWdhdGVDb21wb25lbnQsXG4gICAgT1RhYmxlQ29udGV4dE1lbnVDb21wb25lbnQsXG4gICAgLi4uT19UQUJMRV9DRUxMX1JFTkRFUkVSUyxcbiAgICAuLi5PX1RBQkxFX0NFTExfRURJVE9SUyxcbiAgICAuLi5PX1RBQkxFX0RJQUxPR1NcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZSxcbiAgICB7IHByb3ZpZGU6IE1hdFBhZ2luYXRvckludGwsIHVzZUNsYXNzOiBPVGFibGVNYXRQYWdpbmF0b3JJbnRsIH1cbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVNb2R1bGUgeyB9XG4iXX0=