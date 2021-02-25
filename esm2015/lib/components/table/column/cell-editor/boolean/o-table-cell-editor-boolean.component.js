import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export const DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_EDITOR,
    'indeterminateOnNull: indeterminate-on-null',
    'trueValue: true-value',
    'falseValue: false-value',
    'booleanType: boolean-type',
    'autoCommit: auto-commit'
];
export const DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN = [
    ...DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR
];
export class OTableCellEditorBooleanComponent extends OBaseTableCellEditor {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.indeterminate = false;
        this.indeterminateOnNull = false;
        this.booleanType = 'boolean';
        this.autoCommit = true;
    }
    initialize() {
        super.initialize();
        this.parseInputs();
    }
    parseInputs() {
        switch (this.booleanType) {
            case 'string':
                this.parseStringInputs();
                break;
            case 'number':
                this.parseNumberInputs();
                break;
            default:
                this.trueValue = true;
                this.falseValue = false;
                break;
        }
    }
    parseStringInputs() {
        if ((this.trueValue || '').length === 0) {
            this.trueValue = undefined;
        }
        if ((this.falseValue || '').length === 0) {
            this.falseValue = undefined;
        }
    }
    parseNumberInputs() {
        this.trueValue = parseInt(this.trueValue, 10);
        if (isNaN(this.trueValue)) {
            this.trueValue = 1;
        }
        this.falseValue = parseInt(this.falseValue, 10);
        if (isNaN(this.falseValue)) {
            this.falseValue = 0;
        }
    }
    startEdition(data) {
        super.startEdition(data);
        const self = this;
        setTimeout(() => {
            if (self.autoCommit) {
                const isTrue = (self.formControl.value === self.trueValue);
                self.formControl.setValue(isTrue ? self.falseValue : self.trueValue, { emitEvent: false });
                self.commitEdition();
            }
            else {
                const isTrue = (self.formControl.value === self.trueValue);
                self.formControl.setValue(isTrue ? self.trueValue : self.falseValue, { emitEvent: false });
            }
        }, 0);
    }
    getCellData() {
        let cellData = super.getCellData();
        this.indeterminate = this.indeterminateOnNull && !Util.isDefined(cellData);
        if (!this.indeterminate) {
            cellData = this.parseValueByType(cellData);
        }
        return cellData;
    }
    hasCellDataTrueValue(cellData) {
        let result;
        if (Util.isDefined(cellData)) {
            result = (cellData === this.trueValue);
            if (this.booleanType === 'string' && !Util.isDefined(this.trueValue)) {
                result = Util.parseBoolean(cellData, false);
            }
        }
        return result;
    }
    parseValueByType(val) {
        let result = val;
        const cellIsTrue = this.hasCellDataTrueValue(val);
        const value = cellIsTrue ? this.trueValue : this.falseValue;
        switch (this.booleanType) {
            case 'string':
                result = this.translateService.get(value);
                break;
            case 'number':
                result = parseInt(value, 10);
                break;
            default:
                break;
        }
        return result;
    }
    onChange(arg) {
        this.formControl.setValue(arg.checked ? this.trueValue : this.falseValue, { emitEvent: false });
        this.commitEdition();
    }
}
OTableCellEditorBooleanComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-editor-boolean',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div class=\"o-table-cell-editor-boolean\" [formGroup]=\"formGroup\">\n    <mat-checkbox (click)=\"$event.stopPropagation()\" (change)=\"onChange($event)\" [indeterminate]=\"indeterminate\"\n      [formControl]=\"formControl\">\n    </mat-checkbox>\n  </div>\n</ng-template>",
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
                outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_BOOLEAN,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-table-cell-editor-boolean]': 'true'
                },
                styles: [".o-table-cell-editor-boolean .mat-checkbox-ripple{display:none}"]
            }] }
];
OTableCellEditorBooleanComponent.ctorParameters = () => [
    { type: Injector }
];
OTableCellEditorBooleanComponent.propDecorators = {
    templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableCellEditorBooleanComponent.prototype, "indeterminateOnNull", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableCellEditorBooleanComponent.prototype, "autoCommit", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci1ib29sZWFuLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvYm9vbGVhbi9vLXRhYmxlLWNlbGwtZWRpdG9yLWJvb2xlYW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxRQUFRLEVBRVIsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRCxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLG1DQUFtQyxFQUNuQyxvQkFBb0IsR0FDckIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsTUFBTSwwQ0FBMEMsR0FBRztJQUN4RCxHQUFHLGtDQUFrQztJQUNyQyw0Q0FBNEM7SUFFNUMsdUJBQXVCO0lBRXZCLHlCQUF5QjtJQUV6QiwyQkFBMkI7SUFDM0IseUJBQXlCO0NBQzFCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwyQ0FBMkMsR0FBRztJQUN6RCxHQUFHLG1DQUFtQztDQUN2QyxDQUFDO0FBZUYsTUFBTSxPQUFPLGdDQUFpQyxTQUFRLG9CQUFvQjtJQWdCeEUsWUFBc0IsUUFBa0I7UUFDdEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBREksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVp4QyxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUcvQix3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFJckMsZ0JBQVcsR0FBVyxTQUFTLENBQUM7UUFHaEMsZUFBVSxHQUFZLElBQUksQ0FBQztJQUkzQixDQUFDO0lB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QjtRQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7OztZQWpJRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtnQkFDdkMsa1hBQTJEO2dCQUUzRCxNQUFNLEVBQUUsMENBQTBDO2dCQUNsRCxPQUFPLEVBQUUsMkNBQTJDO2dCQUNwRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixxQ0FBcUMsRUFBRSxNQUFNO2lCQUM5Qzs7YUFDRjs7O1lBM0NDLFFBQVE7OzswQkErQ1AsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7QUFLN0Q7SUFEQyxjQUFjLEVBQUU7OzZFQUNvQjtBQU9yQztJQURDLGNBQWMsRUFBRTs7b0VBQ1UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRDaGVja2JveENoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1IsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SLFxuICBPQmFzZVRhYmxlQ2VsbEVkaXRvcixcbn0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtZWRpdG9yLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfQk9PTEVBTiA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgJ2luZGV0ZXJtaW5hdGVPbk51bGw6IGluZGV0ZXJtaW5hdGUtb24tbnVsbCcsXG4gIC8vIHRydWUtdmFsdWU6IHRydWUgdmFsdWUuIERlZmF1bHQ6IHRydWUuXG4gICd0cnVlVmFsdWU6IHRydWUtdmFsdWUnLFxuICAvLyBmYWxzZS12YWx1ZTogZmFsc2UgdmFsdWUuIERlZmF1bHQ6IGZhbHNlLlxuICAnZmFsc2VWYWx1ZTogZmFsc2UtdmFsdWUnLFxuICAvLyBib29sZWFuLXR5cGUgW251bWJlcnxib29sZWFufHN0cmluZ106IGNlbGxEYXRhIHZhbHVlIHR5cGUuIERlZmF1bHQ6IGJvb2xlYW5cbiAgJ2Jvb2xlYW5UeXBlOiBib29sZWFuLXR5cGUnLFxuICAnYXV0b0NvbW1pdDogYXV0by1jb21taXQnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfQk9PTEVBTiA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1Jcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1lZGl0b3ItYm9vbGVhbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtZWRpdG9yLWJvb2xlYW4uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLWNlbGwtZWRpdG9yLWJvb2xlYW4uY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0JPT0xFQU4sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0JPT0xFQU4sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLWNlbGwtZWRpdG9yLWJvb2xlYW5dJzogJ3RydWUnXG4gIH1cbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsRWRpdG9yQm9vbGVhbkNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsRWRpdG9yIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgaW5kZXRlcm1pbmF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGluZGV0ZXJtaW5hdGVPbk51bGw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgdHJ1ZVZhbHVlOiBhbnk7XG4gIGZhbHNlVmFsdWU6IGFueTtcblxuICBib29sZWFuVHlwZTogc3RyaW5nID0gJ2Jvb2xlYW4nO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIGF1dG9Db21taXQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnBhcnNlSW5wdXRzKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VJbnB1dHMoKSB7XG4gICAgc3dpdGNoICh0aGlzLmJvb2xlYW5UeXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICB0aGlzLnBhcnNlU3RyaW5nSW5wdXRzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdGhpcy5wYXJzZU51bWJlcklucHV0cygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMudHJ1ZVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5mYWxzZVZhbHVlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZVN0cmluZ0lucHV0cygpIHtcbiAgICBpZiAoKHRoaXMudHJ1ZVZhbHVlIHx8ICcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudHJ1ZVZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoKHRoaXMuZmFsc2VWYWx1ZSB8fCAnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmZhbHNlVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlTnVtYmVySW5wdXRzKCkge1xuICAgIHRoaXMudHJ1ZVZhbHVlID0gcGFyc2VJbnQodGhpcy50cnVlVmFsdWUsIDEwKTtcbiAgICBpZiAoaXNOYU4odGhpcy50cnVlVmFsdWUpKSB7XG4gICAgICB0aGlzLnRydWVWYWx1ZSA9IDE7XG4gICAgfVxuICAgIHRoaXMuZmFsc2VWYWx1ZSA9IHBhcnNlSW50KHRoaXMuZmFsc2VWYWx1ZSwgMTApO1xuICAgIGlmIChpc05hTih0aGlzLmZhbHNlVmFsdWUpKSB7XG4gICAgICB0aGlzLmZhbHNlVmFsdWUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0RWRpdGlvbihkYXRhOiBhbnkpIHtcbiAgICBzdXBlci5zdGFydEVkaXRpb24oZGF0YSk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyB1c2luZyBzZXRUaW1lb3V0IHRvIGZvcmNpbmcgdGhpcyBjb2RlIGV4ZWN1dGlvbiBhZnRlciBzdXBlci5hY3RpdmF0ZUNvbHVtbkVkaXRpb24gY29sdW1uLmVkaXRpbmcgPSB0cnVlIGxpbmVcbiAgICAgIGlmIChzZWxmLmF1dG9Db21taXQpIHtcbiAgICAgICAgY29uc3QgaXNUcnVlID0gKHNlbGYuZm9ybUNvbnRyb2wudmFsdWUgPT09IHNlbGYudHJ1ZVZhbHVlKTtcbiAgICAgICAgc2VsZi5mb3JtQ29udHJvbC5zZXRWYWx1ZShpc1RydWUgPyBzZWxmLmZhbHNlVmFsdWUgOiBzZWxmLnRydWVWYWx1ZSwgeyBlbWl0RXZlbnQ6IGZhbHNlIH0pO1xuICAgICAgICBzZWxmLmNvbW1pdEVkaXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGlzVHJ1ZSA9IChzZWxmLmZvcm1Db250cm9sLnZhbHVlID09PSBzZWxmLnRydWVWYWx1ZSk7XG4gICAgICAgIHNlbGYuZm9ybUNvbnRyb2wuc2V0VmFsdWUoaXNUcnVlID8gc2VsZi50cnVlVmFsdWUgOiBzZWxmLmZhbHNlVmFsdWUsIHsgZW1pdEV2ZW50OiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9LCAwKTtcbiAgfVxuXG4gIGdldENlbGxEYXRhKCkge1xuICAgIGxldCBjZWxsRGF0YSA9IHN1cGVyLmdldENlbGxEYXRhKCk7XG4gICAgdGhpcy5pbmRldGVybWluYXRlID0gdGhpcy5pbmRldGVybWluYXRlT25OdWxsICYmICFVdGlsLmlzRGVmaW5lZChjZWxsRGF0YSk7XG4gICAgaWYgKCF0aGlzLmluZGV0ZXJtaW5hdGUpIHtcbiAgICAgIGNlbGxEYXRhID0gdGhpcy5wYXJzZVZhbHVlQnlUeXBlKGNlbGxEYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGNlbGxEYXRhO1xuICB9XG5cbiAgaGFzQ2VsbERhdGFUcnVlVmFsdWUoY2VsbERhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQ6IGJvb2xlYW47XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNlbGxEYXRhKSkge1xuICAgICAgcmVzdWx0ID0gKGNlbGxEYXRhID09PSB0aGlzLnRydWVWYWx1ZSk7XG4gICAgICBpZiAodGhpcy5ib29sZWFuVHlwZSA9PT0gJ3N0cmluZycgJiYgIVV0aWwuaXNEZWZpbmVkKHRoaXMudHJ1ZVZhbHVlKSkge1xuICAgICAgICByZXN1bHQgPSBVdGlsLnBhcnNlQm9vbGVhbihjZWxsRGF0YSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlVmFsdWVCeVR5cGUodmFsOiBhbnkpOiBhbnkge1xuICAgIGxldCByZXN1bHQgPSB2YWw7XG4gICAgY29uc3QgY2VsbElzVHJ1ZSA9IHRoaXMuaGFzQ2VsbERhdGFUcnVlVmFsdWUodmFsKTtcbiAgICBjb25zdCB2YWx1ZSA9IGNlbGxJc1RydWUgPyB0aGlzLnRydWVWYWx1ZSA6IHRoaXMuZmFsc2VWYWx1ZTtcbiAgICBzd2l0Y2ggKHRoaXMuYm9vbGVhblR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJlc3VsdCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBvbkNoYW5nZShhcmc6IE1hdENoZWNrYm94Q2hhbmdlKSB7XG4gICAgdGhpcy5mb3JtQ29udHJvbC5zZXRWYWx1ZShhcmcuY2hlY2tlZCA/IHRoaXMudHJ1ZVZhbHVlIDogdGhpcy5mYWxzZVZhbHVlLCB7IGVtaXRFdmVudDogZmFsc2UgfSk7XG4gICAgdGhpcy5jb21taXRFZGl0aW9uKCk7XG4gIH1cbn1cbiJdfQ==