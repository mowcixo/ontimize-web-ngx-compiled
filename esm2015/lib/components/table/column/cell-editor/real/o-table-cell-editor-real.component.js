import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER, } from '../integer/o-table-cell-editor-integer.component';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER
];
export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = [
    ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
];
export class OTableCellEditorRealComponent extends OBaseTableCellEditor {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.step = 0.01;
    }
    getCellData() {
        const cellData = super.getCellData();
        const floatValue = parseFloat(cellData);
        return isNaN(floatValue) ? undefined : floatValue;
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
OTableCellEditorRealComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-editor-real',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\">\n    <mat-form-field floatLabel=\"never\">\n\n      <input #input matInput type=\"number\" [placeholder]=\"getPlaceholder()\" [formControl]=\"formControl\"\n        [required]=\"orequired\" [min]=\"min\" [max]=\"max\" [step]=\"step\">\n\n      <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n      <mat-error *ngIf=\"hasError('min')\">{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}:\n        {{ getErrorValue('min', 'requiredMin') }}</mat-error>\n      <mat-error *ngIf=\"hasError('max')\">{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}:\n        {{ getErrorValue('max', 'requiredMax') }}</mat-error>\n\n    </mat-form-field>\n  </div>\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL,
                outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL
            }] }
];
OTableCellEditorRealComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellEditorRealComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellEditorRealComponent.prototype, "min", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellEditorRealComponent.prototype, "max", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OTableCellEditorRealComponent.prototype, "step", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci1yZWFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvcmVhbC9vLXRhYmxlLWNlbGwtZWRpdG9yLXJlYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3JHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsMENBQTBDLEVBQzFDLDJDQUEyQyxHQUM1QyxNQUFNLGtEQUFrRCxDQUFDO0FBQzFELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXpFLE1BQU0sQ0FBQyxNQUFNLHVDQUF1QyxHQUFHO0lBQ3JELEdBQUcsMENBQTBDO0NBQzlDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSx3Q0FBd0MsR0FBRztJQUN0RCxHQUFHLDJDQUEyQztDQUMvQyxDQUFDO0FBVUYsTUFBTSxPQUFPLDZCQUE4QixTQUFRLG9CQUFvQjtJQVdyRSxZQUFzQixRQUFrQjtRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFESSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRnhDLFNBQUksR0FBVyxJQUFJLENBQUM7SUFJcEIsQ0FBQztJQUVELFdBQVc7UUFDVCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNwRCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsTUFBTSxVQUFVLEdBQWtCLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzVELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFDckMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQy9DO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNyQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDL0M7UUFDRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRVMsWUFBWSxDQUFDLE9BQW9CO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkUsT0FBTztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHO2lCQUN0QjthQUNGLENBQUM7U0FDSDtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVTLFlBQVksQ0FBQyxPQUFvQjtRQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3ZFLE9BQU87Z0JBQ0wsR0FBRyxFQUFFO29CQUNILFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRztpQkFDdEI7YUFDRixDQUFDO1NBQ0g7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7OztZQTVERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsZzBCQUF3RDtnQkFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSx1Q0FBdUM7Z0JBQy9DLE9BQU8sRUFBRSx3Q0FBd0M7YUFDbEQ7OztZQXhCNEMsUUFBUTs7OzBCQTRCbEQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7QUFHN0Q7SUFEQyxjQUFjLEVBQUU7OzBEQUNMO0FBRVo7SUFEQyxjQUFjLEVBQUU7OzBEQUNMO0FBRVo7SUFEQyxjQUFjLEVBQUU7OzJEQUNHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0b3IsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0lOVEVHRVIsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0lOVEVHRVIsXG59IGZyb20gJy4uL2ludGVnZXIvby10YWJsZS1jZWxsLWVkaXRvci1pbnRlZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQmFzZVRhYmxlQ2VsbEVkaXRvciB9IGZyb20gJy4uL28tYmFzZS10YWJsZS1jZWxsLWVkaXRvci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1JFQUwgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUlxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1JFQUwgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0lOVEVHRVJcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1lZGl0b3ItcmVhbCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtZWRpdG9yLXJlYWwuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1JFQUwsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1JFQUxcbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsRWRpdG9yUmVhbENvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsRWRpdG9yIHtcblxuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgQElucHV0Q29udmVydGVyKClcbiAgbWluOiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heDogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzdGVwOiBudW1iZXIgPSAwLjAxO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gIH1cblxuICBnZXRDZWxsRGF0YSgpIHtcbiAgICBjb25zdCBjZWxsRGF0YSA9IHN1cGVyLmdldENlbGxEYXRhKCk7XG4gICAgY29uc3QgZmxvYXRWYWx1ZSA9IHBhcnNlRmxvYXQoY2VsbERhdGEpO1xuICAgIHJldHVybiBpc05hTihmbG9hdFZhbHVlKSA/IHVuZGVmaW5lZCA6IGZsb2F0VmFsdWU7XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICBpZiAodHlwZW9mICh0aGlzLm1pbikgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5taW5WYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgKHRoaXMubWF4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1heFZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWluVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKSB7XG4gICAgaWYgKCh0eXBlb2YgKGNvbnRyb2wudmFsdWUpID09PSAnbnVtYmVyJykgJiYgKGNvbnRyb2wudmFsdWUgPCB0aGlzLm1pbikpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbjoge1xuICAgICAgICAgIHJlcXVpcmVkTWluOiB0aGlzLm1pblxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF4VmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKSB7XG4gICAgaWYgKCh0eXBlb2YgKGNvbnRyb2wudmFsdWUpID09PSAnbnVtYmVyJykgJiYgKHRoaXMubWF4IDwgY29udHJvbC52YWx1ZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heDoge1xuICAgICAgICAgIHJlcXVpcmVkTWF4OiB0aGlzLm1heFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxufVxuIl19