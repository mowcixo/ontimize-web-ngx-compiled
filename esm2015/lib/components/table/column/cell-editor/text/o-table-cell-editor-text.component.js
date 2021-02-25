import { ChangeDetectionStrategy, Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR
];
export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = [
    ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];
export class OTableCellEditorTextComponent extends OBaseTableCellEditor {
    constructor(injector) {
        super(injector);
        this.injector = injector;
    }
}
OTableCellEditorTextComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-editor-text',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\">\n    <mat-form-field floatLabel=\"never\">\n      <input #input matInput type=\"text\" [placeholder]=\"getPlaceholder()\" [formControl]=\"formControl\"\n        [required]=\"orequired\">\n      <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n    </mat-form-field>\n  </div>\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT,
                outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT
            }] }
];
OTableCellEditorTextComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellEditorTextComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }],
    inputRef: [{ type: ViewChild, args: ['input', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci10ZXh0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvdGV4dC9vLXRhYmxlLWNlbGwtZWRpdG9yLXRleHQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWpILE9BQU8sRUFDTCxrQ0FBa0MsRUFDbEMsbUNBQW1DLEVBQ25DLG9CQUFvQixHQUNyQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLHVDQUF1QyxHQUFHO0lBQ3JELEdBQUcsa0NBQWtDO0NBQ3RDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSx3Q0FBd0MsR0FBRztJQUN0RCxHQUFHLG1DQUFtQztDQUN2QyxDQUFDO0FBVUYsTUFBTSxPQUFPLDZCQUE4QixTQUFRLG9CQUFvQjtJQUtyRSxZQUFzQixRQUFrQjtRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFESSxhQUFRLEdBQVIsUUFBUSxDQUFVO0lBRXhDLENBQUM7OztZQWZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMEJBQTBCO2dCQUNwQyxzZEFBd0Q7Z0JBQ3hELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxNQUFNLEVBQUUsdUNBQXVDO2dCQUMvQyxPQUFPLEVBQUUsd0NBQXdDO2FBQ2xEOzs7WUF0QndELFFBQVE7OzswQkEwQjlELFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7dUJBQzVELFNBQVMsU0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5qZWN0b3IsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1IsXG4gIE9CYXNlVGFibGVDZWxsRWRpdG9yLFxufSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1lZGl0b3IuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9URVhUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVEVYVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1Jcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1lZGl0b3ItdGV4dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtZWRpdG9yLXRleHQuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1RFWFQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1RFWFRcbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsRWRpdG9yVGV4dENvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsRWRpdG9yIHtcblxuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG4gIEBWaWV3Q2hpbGQoJ2lucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIGlucHV0UmVmOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gIH1cblxuXG59XG4iXX0=