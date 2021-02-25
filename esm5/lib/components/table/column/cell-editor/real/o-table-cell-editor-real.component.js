import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER, } from '../integer/o-table-cell-editor-integer.component';
import { OBaseTableCellEditor } from '../o-base-table-cell-editor.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_INTEGER);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL = tslib_1.__spread(DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_INTEGER);
var OTableCellEditorRealComponent = (function (_super) {
    tslib_1.__extends(OTableCellEditorRealComponent, _super);
    function OTableCellEditorRealComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.step = 0.01;
        return _this;
    }
    OTableCellEditorRealComponent.prototype.getCellData = function () {
        var cellData = _super.prototype.getCellData.call(this);
        var floatValue = parseFloat(cellData);
        return isNaN(floatValue) ? undefined : floatValue;
    };
    OTableCellEditorRealComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (typeof (this.min) !== 'undefined') {
            validators.push(this.minValidator.bind(this));
        }
        if (typeof (this.max) !== 'undefined') {
            validators.push(this.maxValidator.bind(this));
        }
        return validators;
    };
    OTableCellEditorRealComponent.prototype.minValidator = function (control) {
        if ((typeof (control.value) === 'number') && (control.value < this.min)) {
            return {
                min: {
                    requiredMin: this.min
                }
            };
        }
        return {};
    };
    OTableCellEditorRealComponent.prototype.maxValidator = function (control) {
        if ((typeof (control.value) === 'number') && (this.max < control.value)) {
            return {
                max: {
                    requiredMax: this.max
                }
            };
        }
        return {};
    };
    OTableCellEditorRealComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-editor-real',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\">\n    <mat-form-field floatLabel=\"never\">\n\n      <input #input matInput type=\"number\" [placeholder]=\"getPlaceholder()\" [formControl]=\"formControl\"\n        [required]=\"orequired\" [min]=\"min\" [max]=\"max\" [step]=\"step\">\n\n      <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n      <mat-error *ngIf=\"hasError('min')\">{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}:\n        {{ getErrorValue('min', 'requiredMin') }}</mat-error>\n      <mat-error *ngIf=\"hasError('max')\">{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}:\n        {{ getErrorValue('max', 'requiredMax') }}</mat-error>\n\n    </mat-form-field>\n  </div>\n</ng-template>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_REAL,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_REAL
                }] }
    ];
    OTableCellEditorRealComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
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
    return OTableCellEditorRealComponent;
}(OBaseTableCellEditor));
export { OTableCellEditorRealComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci1yZWFsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvcmVhbC9vLXRhYmxlLWNlbGwtZWRpdG9yLXJlYWwuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR3JHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsMENBQTBDLEVBQzFDLDJDQUEyQyxHQUM1QyxNQUFNLGtEQUFrRCxDQUFDO0FBQzFELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRXpFLE1BQU0sQ0FBQyxJQUFNLHVDQUF1QyxvQkFDL0MsMENBQTBDLENBQzlDLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSx3Q0FBd0Msb0JBQ2hELDJDQUEyQyxDQUMvQyxDQUFDO0FBRUY7SUFRbUQseURBQW9CO0lBV3JFLHVDQUFzQixRQUFrQjtRQUF4QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxTQUNoQjtRQUZxQixjQUFRLEdBQVIsUUFBUSxDQUFVO1FBRnhDLFVBQUksR0FBVyxJQUFJLENBQUM7O0lBSXBCLENBQUM7SUFFRCxtREFBVyxHQUFYO1FBQ0UsSUFBTSxRQUFRLEdBQUcsaUJBQU0sV0FBVyxXQUFFLENBQUM7UUFDckMsSUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNwRCxDQUFDO0lBRUQseURBQWlCLEdBQWpCO1FBQ0UsSUFBTSxVQUFVLEdBQWtCLGlCQUFNLGlCQUFpQixXQUFFLENBQUM7UUFDNUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUNyQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDL0M7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO1lBQ3JDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUMvQztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFUyxvREFBWSxHQUF0QixVQUF1QixPQUFvQjtRQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZFLE9BQU87Z0JBQ0wsR0FBRyxFQUFFO29CQUNILFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRztpQkFDdEI7YUFDRixDQUFDO1NBQ0g7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFUyxvREFBWSxHQUF0QixVQUF1QixPQUFvQjtRQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3ZFLE9BQU87Z0JBQ0wsR0FBRyxFQUFFO29CQUNILFdBQVcsRUFBRSxJQUFJLENBQUMsR0FBRztpQkFDdEI7YUFDRixDQUFDO1NBQ0g7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7O2dCQTVERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsZzBCQUF3RDtvQkFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSx1Q0FBdUM7b0JBQy9DLE9BQU8sRUFBRSx3Q0FBd0M7aUJBQ2xEOzs7Z0JBeEI0QyxRQUFROzs7OEJBNEJsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQUc3RDtRQURDLGNBQWMsRUFBRTs7OERBQ0w7SUFFWjtRQURDLGNBQWMsRUFBRTs7OERBQ0w7SUFFWjtRQURDLGNBQWMsRUFBRTs7K0RBQ0c7SUE2Q3RCLG9DQUFDO0NBQUEsQUE5REQsQ0FRbUQsb0JBQW9CLEdBc0R0RTtTQXREWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIFZhbGlkYXRvckZuIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUixcbiAgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUixcbn0gZnJvbSAnLi4vaW50ZWdlci9vLXRhYmxlLWNlbGwtZWRpdG9yLWludGVnZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9CYXNlVGFibGVDZWxsRWRpdG9yIH0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtZWRpdG9yLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfUkVBTCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9JTlRFR0VSXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfUkVBTCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfSU5URUdFUlxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLWVkaXRvci1yZWFsJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1lZGl0b3ItcmVhbC5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfUkVBTCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfUkVBTFxufSlcblxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxFZGl0b3JSZWFsQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxFZGl0b3Ige1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtaW46IG51bWJlcjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgbWF4OiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHN0ZXA6IG51bWJlciA9IDAuMDE7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgfVxuXG4gIGdldENlbGxEYXRhKCkge1xuICAgIGNvbnN0IGNlbGxEYXRhID0gc3VwZXIuZ2V0Q2VsbERhdGEoKTtcbiAgICBjb25zdCBmbG9hdFZhbHVlID0gcGFyc2VGbG9hdChjZWxsRGF0YSk7XG4gICAgcmV0dXJuIGlzTmFOKGZsb2F0VmFsdWUpID8gdW5kZWZpbmVkIDogZmxvYXRWYWx1ZTtcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmICh0eXBlb2YgKHRoaXMubWluKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1pblZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiAodGhpcy5tYXgpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4VmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbiAgfVxuXG4gIHByb3RlY3RlZCBtaW5WYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpIHtcbiAgICBpZiAoKHR5cGVvZiAoY29udHJvbC52YWx1ZSkgPT09ICdudW1iZXInKSAmJiAoY29udHJvbC52YWx1ZSA8IHRoaXMubWluKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWluOiB7XG4gICAgICAgICAgcmVxdWlyZWRNaW46IHRoaXMubWluXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXhWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpIHtcbiAgICBpZiAoKHR5cGVvZiAoY29udHJvbC52YWx1ZSkgPT09ICdudW1iZXInKSAmJiAodGhpcy5tYXggPCBjb250cm9sLnZhbHVlKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWF4OiB7XG4gICAgICAgICAgcmVxdWlyZWRNYXg6IHRoaXMubWF4XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG59XG4iXX0=