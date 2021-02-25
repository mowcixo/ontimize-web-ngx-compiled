import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TEXT = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_EDITOR);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TEXT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR);
var OTableCellEditorTextComponent = (function (_super) {
    tslib_1.__extends(OTableCellEditorTextComponent, _super);
    function OTableCellEditorTextComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        return _this;
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
    OTableCellEditorTextComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellEditorTextComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }],
        inputRef: [{ type: ViewChild, args: ['input', { static: false },] }]
    };
    return OTableCellEditorTextComponent;
}(OBaseTableCellEditor));
export { OTableCellEditorTextComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci10ZXh0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvdGV4dC9vLXRhYmxlLWNlbGwtZWRpdG9yLXRleHQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVqSCxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLG1DQUFtQyxFQUNuQyxvQkFBb0IsR0FDckIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsSUFBTSx1Q0FBdUMsb0JBQy9DLGtDQUFrQyxDQUN0QyxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sd0NBQXdDLG9CQUNoRCxtQ0FBbUMsQ0FDdkMsQ0FBQztBQUVGO0lBUW1ELHlEQUFvQjtJQUtyRSx1Q0FBc0IsUUFBa0I7UUFBeEMsWUFDRSxrQkFBTSxRQUFRLENBQUMsU0FDaEI7UUFGcUIsY0FBUSxHQUFSLFFBQVEsQ0FBVTs7SUFFeEMsQ0FBQzs7Z0JBZkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSwwQkFBMEI7b0JBQ3BDLHNkQUF3RDtvQkFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSx1Q0FBdUM7b0JBQy9DLE9BQU8sRUFBRSx3Q0FBd0M7aUJBQ2xEOzs7Z0JBdEJ3RCxRQUFROzs7OEJBMEI5RCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzJCQUM1RCxTQUFTLFNBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7SUFPdkMsb0NBQUM7Q0FBQSxBQWxCRCxDQVFtRCxvQkFBb0IsR0FVdEU7U0FWWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3RvciwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SLFxuICBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgT0Jhc2VUYWJsZUNlbGxFZGl0b3IsXG59IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLWVkaXRvci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1RFWFQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1Jcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9URVhUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUlxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLWVkaXRvci10ZXh0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1lZGl0b3ItdGV4dC5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVEVYVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVEVYVFxufSlcblxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxFZGl0b3JUZXh0Q29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxFZGl0b3Ige1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgaW5wdXRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgfVxuXG5cbn1cbiJdfQ==