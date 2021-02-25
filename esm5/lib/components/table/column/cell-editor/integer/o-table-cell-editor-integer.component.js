import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, [
    'min',
    'max',
    'step'
]);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER = tslib_1.__spread(DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR);
var OTableCellEditorIntegerComponent = (function (_super) {
    tslib_1.__extends(OTableCellEditorIntegerComponent, _super);
    function OTableCellEditorIntegerComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.step = 1;
        return _this;
    }
    OTableCellEditorIntegerComponent.prototype.getCellData = function () {
        var cellData = _super.prototype.getCellData.call(this);
        var intValue = parseInt(cellData, 10);
        return isNaN(intValue) ? undefined : intValue;
    };
    OTableCellEditorIntegerComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (typeof (this.min) !== 'undefined') {
            validators.push(this.minValidator.bind(this));
        }
        if (typeof (this.max) !== 'undefined') {
            validators.push(this.maxValidator.bind(this));
        }
        return validators;
    };
    OTableCellEditorIntegerComponent.prototype.minValidator = function (control) {
        if ((typeof (control.value) === 'number') && (control.value < this.min)) {
            return {
                min: {
                    requiredMin: this.min
                }
            };
        }
        return {};
    };
    OTableCellEditorIntegerComponent.prototype.maxValidator = function (control) {
        if ((typeof (control.value) === 'number') && (this.max < control.value)) {
            return {
                max: {
                    requiredMax: this.max
                }
            };
        }
        return {};
    };
    OTableCellEditorIntegerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-editor-integer',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\">\n    <mat-form-field floatLabel=\"never\">\n      <input #input matInput type=\"number\" [placeholder]=\"getPlaceholder()\" [formControl]=\"formControl\"\n        [required]=\"orequired\" [min]=\"min\" [max]=\"max\" [step]=\"step\">\n      <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n      <mat-error *ngIf=\"hasError('min')\">{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}:\n        {{ getErrorValue('min', 'requiredMin') }}</mat-error>\n      <mat-error *ngIf=\"hasError('max')\">{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}:\n        {{ getErrorValue('max', 'requiredMax') }}</mat-error>\n    </mat-form-field>\n  </div>\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER
                }] }
    ];
    OTableCellEditorIntegerComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
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
    return OTableCellEditorIntegerComponent;
}(OBaseTableCellEditor));
export { OTableCellEditorIntegerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci1pbnRlZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvaW50ZWdlci9vLXRhYmxlLWNlbGwtZWRpdG9yLWludGVnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3JHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLG1DQUFtQyxFQUNuQyxvQkFBb0IsR0FDckIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsSUFBTSwwQ0FBMEMsb0JBQ2xELGtDQUFrQztJQUNyQyxLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07RUFDUCxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sMkNBQTJDLG9CQUNuRCxtQ0FBbUMsQ0FDdkMsQ0FBQztBQUVGO0lBUXNELDREQUFvQjtJQVd4RSwwQ0FBc0IsUUFBa0I7UUFBeEMsWUFDRSxrQkFBTSxRQUFRLENBQUMsU0FDaEI7UUFGcUIsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQUZ4QyxVQUFJLEdBQVcsQ0FBQyxDQUFDOztJQUlqQixDQUFDO0lBRUQsc0RBQVcsR0FBWDtRQUNFLElBQU0sUUFBUSxHQUFHLGlCQUFNLFdBQVcsV0FBRSxDQUFDO1FBQ3JDLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDeEMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ2hELENBQUM7SUFFRCw0REFBaUIsR0FBakI7UUFDRSxJQUFNLFVBQVUsR0FBa0IsaUJBQU0saUJBQWlCLFdBQUUsQ0FBQztRQUM1RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3JDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUNELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFDckMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQy9DO1FBQ0QsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVTLHVEQUFZLEdBQXRCLFVBQXVCLE9BQW9CO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkUsT0FBTztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHO2lCQUN0QjthQUNGLENBQUM7U0FDSDtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVTLHVEQUFZLEdBQXRCLFVBQXVCLE9BQW9CO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDdkUsT0FBTztnQkFDTCxHQUFHLEVBQUU7b0JBQ0gsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHO2lCQUN0QjthQUNGLENBQUM7U0FDSDtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7Z0JBNURGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QywwekJBQTJEO29CQUMzRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsTUFBTSxFQUFFLDBDQUEwQztvQkFDbEQsT0FBTyxFQUFFLDJDQUEyQztpQkFDckQ7OztnQkEzQjRDLFFBQVE7Ozs4QkErQmxELFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0lBRzdEO1FBREMsY0FBYyxFQUFFOztpRUFDTDtJQUVaO1FBREMsY0FBYyxFQUFFOztpRUFDTDtJQUVaO1FBREMsY0FBYyxFQUFFOztrRUFDQTtJQTRDbkIsdUNBQUM7Q0FBQSxBQTdERCxDQVFzRCxvQkFBb0IsR0FxRHpFO1NBckRZLGdDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdG9yLCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1IsXG4gIE9CYXNlVGFibGVDZWxsRWRpdG9yLFxufSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1lZGl0b3IuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9JTlRFR0VSID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SLFxuICAnbWluJyxcbiAgJ21heCcsXG4gICdzdGVwJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0lOVEVHRVIgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtZWRpdG9yLWludGVnZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLWVkaXRvci1pbnRlZ2VyLmNvbXBvbmVudC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9JTlRFR0VSLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9JTlRFR0VSXG59KVxuXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbEVkaXRvckludGVnZXJDb21wb25lbnQgZXh0ZW5kcyBPQmFzZVRhYmxlQ2VsbEVkaXRvciB7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbjogbnVtYmVyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXg6IG51bWJlcjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc3RlcDogbnVtYmVyID0gMTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICB9XG5cbiAgZ2V0Q2VsbERhdGEoKSB7XG4gICAgY29uc3QgY2VsbERhdGEgPSBzdXBlci5nZXRDZWxsRGF0YSgpO1xuICAgIGNvbnN0IGludFZhbHVlID0gcGFyc2VJbnQoY2VsbERhdGEsIDEwKTtcbiAgICByZXR1cm4gaXNOYU4oaW50VmFsdWUpID8gdW5kZWZpbmVkIDogaW50VmFsdWU7XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gc3VwZXIucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICBpZiAodHlwZW9mICh0aGlzLm1pbikgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5taW5WYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgKHRoaXMubWF4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1heFZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgbWluVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKSB7XG4gICAgaWYgKCh0eXBlb2YgKGNvbnRyb2wudmFsdWUpID09PSAnbnVtYmVyJykgJiYgKGNvbnRyb2wudmFsdWUgPCB0aGlzLm1pbikpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1pbjoge1xuICAgICAgICAgIHJlcXVpcmVkTWluOiB0aGlzLm1pblxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF4VmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKSB7XG4gICAgaWYgKCh0eXBlb2YgKGNvbnRyb2wudmFsdWUpID09PSAnbnVtYmVyJykgJiYgKHRoaXMubWF4IDwgY29udHJvbC52YWx1ZSkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1heDoge1xuICAgICAgICAgIHJlcXVpcmVkTWF4OiB0aGlzLm1heFxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiJdfQ==