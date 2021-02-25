import { OTableCellEditorBooleanComponent, DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN } from './boolean/o-table-cell-editor-boolean.component';
import { OTableCellEditorDateComponent, DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE } from './date/o-table-cell-editor-date.component';
import { OTableCellEditorIntegerComponent } from './integer/o-table-cell-editor-integer.component';
import { OTableCellEditorRealComponent, DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL } from './real/o-table-cell-editor-real.component';
import { OTableCellEditorTextComponent, DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT } from './text/o-table-cell-editor-text.component';
import { OTableCellEditorTimeComponent, DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME } from './time/o-table-cell-editor-time.component';
export const O_TABLE_CELL_EDITORS = [
    OTableCellEditorBooleanComponent,
    OTableCellEditorDateComponent,
    OTableCellEditorIntegerComponent,
    OTableCellEditorRealComponent,
    OTableCellEditorTextComponent,
    OTableCellEditorTimeComponent
];
export const O_TABLE_CELL_EDITORS_INPUTS = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL,
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT,
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME,
];
export const O_TABLE_CELL_EDITORS_OUTPUTS = [
    ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
];
export const editorsMapping = {
    boolean: OTableCellEditorBooleanComponent,
    date: OTableCellEditorDateComponent,
    integer: OTableCellEditorIntegerComponent,
    real: OTableCellEditorRealComponent,
    percentage: OTableCellEditorRealComponent,
    currency: OTableCellEditorRealComponent,
    text: OTableCellEditorTextComponent,
    time: OTableCellEditorTimeComponent
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VsbC1lZGl0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NlbGwtZWRpdG9yL2NlbGwtZWRpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSwwQ0FBMEMsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQy9JLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ25JLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQ25HLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ25JLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1Q0FBdUMsRUFBRSx3Q0FBd0MsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzdLLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSx1Q0FBdUMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRW5JLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFHO0lBQ2xDLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0IsZ0NBQWdDO0lBQ2hDLDZCQUE2QjtJQUM3Qiw2QkFBNkI7SUFDN0IsNkJBQTZCO0NBQzlCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRztJQUN6QyxHQUFHLDBDQUEwQztJQUM3QyxHQUFHLHVDQUF1QztJQUMxQyxHQUFHLHVDQUF1QztJQUMxQyxHQUFHLHVDQUF1QztJQUMxQyxHQUFHLHVDQUF1QztDQUMzQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sNEJBQTRCLEdBQUc7SUFDMUMsR0FBRyx3Q0FBd0M7Q0FDNUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRztJQUM1QixPQUFPLEVBQUUsZ0NBQWdDO0lBQ3pDLElBQUksRUFBRSw2QkFBNkI7SUFDbkMsT0FBTyxFQUFFLGdDQUFnQztJQUN6QyxJQUFJLEVBQUUsNkJBQTZCO0lBQ25DLFVBQVUsRUFBRSw2QkFBNkI7SUFDekMsUUFBUSxFQUFFLDZCQUE2QjtJQUN2QyxJQUFJLEVBQUUsNkJBQTZCO0lBQ25DLElBQUksRUFBRSw2QkFBNkI7Q0FDcEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9UYWJsZUNlbGxFZGl0b3JCb29sZWFuQ29tcG9uZW50LCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0JPT0xFQU4gfSBmcm9tICcuL2Jvb2xlYW4vby10YWJsZS1jZWxsLWVkaXRvci1ib29sZWFuLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVDZWxsRWRpdG9yRGF0ZUNvbXBvbmVudCwgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9EQVRFIH0gZnJvbSAnLi9kYXRlL28tdGFibGUtY2VsbC1lZGl0b3ItZGF0ZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQ2VsbEVkaXRvckludGVnZXJDb21wb25lbnQgfSBmcm9tICcuL2ludGVnZXIvby10YWJsZS1jZWxsLWVkaXRvci1pbnRlZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVDZWxsRWRpdG9yUmVhbENvbXBvbmVudCwgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9SRUFMIH0gZnJvbSAnLi9yZWFsL28tdGFibGUtY2VsbC1lZGl0b3ItcmVhbC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQ2VsbEVkaXRvclRleHRDb21wb25lbnQsIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVEVYVCwgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVEVYVCB9IGZyb20gJy4vdGV4dC9vLXRhYmxlLWNlbGwtZWRpdG9yLXRleHQuY29tcG9uZW50JztcbmltcG9ydCB7IE9UYWJsZUNlbGxFZGl0b3JUaW1lQ29tcG9uZW50LCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1RJTUUgfSBmcm9tICcuL3RpbWUvby10YWJsZS1jZWxsLWVkaXRvci10aW1lLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBPX1RBQkxFX0NFTExfRURJVE9SUyA9IFtcbiAgT1RhYmxlQ2VsbEVkaXRvckJvb2xlYW5Db21wb25lbnQsXG4gIE9UYWJsZUNlbGxFZGl0b3JEYXRlQ29tcG9uZW50LFxuICBPVGFibGVDZWxsRWRpdG9ySW50ZWdlckNvbXBvbmVudCxcbiAgT1RhYmxlQ2VsbEVkaXRvclJlYWxDb21wb25lbnQsXG4gIE9UYWJsZUNlbGxFZGl0b3JUZXh0Q29tcG9uZW50LFxuICBPVGFibGVDZWxsRWRpdG9yVGltZUNvbXBvbmVudFxuXTtcblxuZXhwb3J0IGNvbnN0IE9fVEFCTEVfQ0VMTF9FRElUT1JTX0lOUFVUUyA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9CT09MRUFOLFxuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0RBVEUsXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfUkVBTCwgLy8gaW5jbHVkZXMgSW50ZWdlclxuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1RFWFQsXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVElNRSxcbl07XG5cbmV4cG9ydCBjb25zdCBPX1RBQkxFX0NFTExfRURJVE9SU19PVVRQVVRTID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9URVhUXG5dO1xuXG5leHBvcnQgY29uc3QgZWRpdG9yc01hcHBpbmcgPSB7XG4gIGJvb2xlYW46IE9UYWJsZUNlbGxFZGl0b3JCb29sZWFuQ29tcG9uZW50LFxuICBkYXRlOiBPVGFibGVDZWxsRWRpdG9yRGF0ZUNvbXBvbmVudCxcbiAgaW50ZWdlcjogT1RhYmxlQ2VsbEVkaXRvckludGVnZXJDb21wb25lbnQsXG4gIHJlYWw6IE9UYWJsZUNlbGxFZGl0b3JSZWFsQ29tcG9uZW50LFxuICBwZXJjZW50YWdlOiBPVGFibGVDZWxsRWRpdG9yUmVhbENvbXBvbmVudCxcbiAgY3VycmVuY3k6IE9UYWJsZUNlbGxFZGl0b3JSZWFsQ29tcG9uZW50LFxuICB0ZXh0OiBPVGFibGVDZWxsRWRpdG9yVGV4dENvbXBvbmVudCxcbiAgdGltZTogT1RhYmxlQ2VsbEVkaXRvclRpbWVDb21wb25lbnRcbn07XG4iXX0=