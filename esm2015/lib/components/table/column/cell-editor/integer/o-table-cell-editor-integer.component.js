import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
    'min',
    'max',
    'step'
];
export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER = [
    ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];
export class OTableCellEditorIntegerComponent extends OBaseTableCellEditor {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.step = 1;
    }
    getCellData() {
        const cellData = super.getCellData();
        const intValue = parseInt(cellData, 10);
        return isNaN(intValue) ? undefined : intValue;
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (typeof (this.min) !== 'undefined') {
            validators.push(this.minValidator.bind(this));
        }
        if (typeof (this.max) !== 'undefined') {
            validators.push(this.maxValidator.bind(this));
        }
        return validators;
    }
    minValidator(control) {
        if ((typeof (control.value) === 'number') && (control.value < this.min)) {
            return {
                min: {
                    requiredMin: this.min
                }
            };
        }
        return {};
    }
    maxValidator(control) {
        if ((typeof (control.value) === 'number') && (this.max < control.value)) {
            return {
                max: {
                    requiredMax: this.max
                }
            };
        }
        return {};
    }
}
OTableCellEditorIntegerComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-editor-integer',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\">\n    <mat-form-field floatLabel=\"never\">\n      <input #input matInput type=\"number\" [placeholder]=\"getPlaceholder()\" [formControl]=\"formControl\"\n        [required]=\"orequired\" [min]=\"min\" [max]=\"max\" [step]=\"step\">\n      <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n      <mat-error *ngIf=\"hasError('min')\">{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}:\n        {{ getErrorValue('min', 'requiredMin') }}</mat-error>\n      <mat-error *ngIf=\"hasError('max')\">{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}:\n        {{ getErrorValue('max', 'requiredMax') }}</mat-error>\n    </mat-form-field>\n  </div>\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER,
                outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
            }] }
];
OTableCellEditorIntegerComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellEditorIntegerComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellEditorIntegerComponent.prototype, "min", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellEditorIntegerComponent.prototype, "max", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellEditorIntegerComponent.prototype, "step", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci1pbnRlZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvaW50ZWdlci9vLXRhYmxlLWNlbGwtZWRpdG9yLWludGVnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3JHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLG1DQUFtQyxFQUNuQyxvQkFBb0IsR0FDckIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsTUFBTSwwQ0FBMEMsR0FBRztJQUN4RCxHQUFHLGtDQUFrQztJQUNyQyxLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07Q0FDUCxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sMkNBQTJDLEdBQUc7SUFDekQsR0FBRyxtQ0FBbUM7Q0FDdkMsQ0FBQztBQVVGLE1BQU0sT0FBTyxnQ0FBaUMsU0FBUSxvQkFBb0I7SUFXeEUsWUFBc0IsUUFBa0I7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBREksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUZ4QyxTQUFJLEdBQVcsQ0FBQyxDQUFDO0lBSWpCLENBQUM7SUFFRCxXQUFXO1FBQ1QsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ2hELENBQUM7SUFFRCxpQkFBaUI7UUFDZixNQUFNLFVBQVUsR0FBa0IsS0FBSyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDNUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNyQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDL0M7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3JDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxZQUFZLENBQUMsT0FBb0I7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2RSxPQUFPO2dCQUNMLEdBQUcsRUFBRTtvQkFDSCxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUc7aUJBQ3RCO2FBQ0YsQ0FBQztTQUNIO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRVMsWUFBWSxDQUFDLE9BQW9CO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdkUsT0FBTztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHO2lCQUN0QjthQUNGLENBQUM7U0FDSDtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7O1lBNURGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNkJBQTZCO2dCQUN2QywwekJBQTJEO2dCQUMzRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsTUFBTSxFQUFFLDBDQUEwQztnQkFDbEQsT0FBTyxFQUFFLDJDQUEyQzthQUNyRDs7O1lBM0I0QyxRQUFROzs7MEJBK0JsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztBQUc3RDtJQURDLGNBQWMsRUFBRTs7NkRBQ0w7QUFFWjtJQURDLGNBQWMsRUFBRTs7NkRBQ0w7QUFFWjtJQURDLGNBQWMsRUFBRTs7OERBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1IsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SLFxuICBPQmFzZVRhYmxlQ2VsbEVkaXRvcixcbn0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtZWRpdG9yLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUiA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgJ21pbicsXG4gICdtYXgnLFxuICAnc3RlcCdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9JTlRFR0VSID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUlxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLWVkaXRvci1pbnRlZ2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1lZGl0b3ItaW50ZWdlci5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUlxufSlcblxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxFZGl0b3JJbnRlZ2VyQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxFZGl0b3Ige1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtaW46IG51bWJlcjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgbWF4OiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHN0ZXA6IG51bWJlciA9IDE7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgfVxuXG4gIGdldENlbGxEYXRhKCkge1xuICAgIGNvbnN0IGNlbGxEYXRhID0gc3VwZXIuZ2V0Q2VsbERhdGEoKTtcbiAgICBjb25zdCBpbnRWYWx1ZSA9IHBhcnNlSW50KGNlbGxEYXRhLCAxMCk7XG4gICAgcmV0dXJuIGlzTmFOKGludFZhbHVlKSA/IHVuZGVmaW5lZCA6IGludFZhbHVlO1xuICB9XG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG4gICAgaWYgKHR5cGVvZiAodGhpcy5taW4pICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWluVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mICh0aGlzLm1heCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5tYXhWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgcHJvdGVjdGVkIG1pblZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCkge1xuICAgIGlmICgodHlwZW9mIChjb250cm9sLnZhbHVlKSA9PT0gJ251bWJlcicpICYmIChjb250cm9sLnZhbHVlIDwgdGhpcy5taW4pKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtaW46IHtcbiAgICAgICAgICByZXF1aXJlZE1pbjogdGhpcy5taW5cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHJvdGVjdGVkIG1heFZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCkge1xuICAgIGlmICgodHlwZW9mIChjb250cm9sLnZhbHVlKSA9PT0gJ251bWJlcicpICYmICh0aGlzLm1heCA8IGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBtYXg6IHtcbiAgICAgICAgICByZXF1aXJlZE1heDogdGhpcy5tYXhcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG4iXX0=