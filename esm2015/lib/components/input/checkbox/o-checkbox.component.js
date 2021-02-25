import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
export const DEFAULT_INPUTS_O_CHECKBOX = [
    'trueValue: true-value',
    'falseValue: false-value',
    'booleanType: boolean-type',
    'color',
    'labelPosition: label-position',
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];
export const DEFAULT_OUTPUTS_O_CHECKBOX = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OCheckboxComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.trueValue = true;
        this.falseValue = false;
        this.booleanType = 'boolean';
        this.labelPosition = 'after';
        this._defaultSQLTypeKey = 'BOOLEAN';
    }
    initialize() {
        if (!Util.isDefined(this.sqlType)) {
            switch (this.booleanType) {
                case 'number':
                    this.sqlType = 'INTEGER';
                    break;
                case 'string':
                    this.sqlType = 'VARCHAR';
                    break;
                case 'boolean':
                default:
                    this.sqlType = 'BOOLEAN';
            }
        }
        super.initialize();
        const checkboxCtx = this;
        this.getFormControl().getValue = function () {
            return this.value ? checkboxCtx.trueValue : checkboxCtx.falseValue;
        };
    }
    ensureOFormValue(value) {
        this.parseInputs();
        if (value instanceof OFormValue) {
            if (value.value === undefined) {
                value.value = false;
            }
            this.value = new OFormValue(this.parseValueByType(value.value) === this.trueValue);
        }
        else if (typeof value === 'boolean') {
            this.value = new OFormValue(value);
        }
        else {
            this.value = new OFormValue(this.parseValueByType(value) === this.trueValue);
        }
    }
    getValue() {
        if (Util.isDefined(this.value) && this.value.value !== undefined) {
            return this.value.value ? this.trueValue : this.falseValue;
        }
        else {
            return this.defaultValue;
        }
    }
    onClickBlocker(evt) {
        evt.stopPropagation();
    }
    parseValueByType(value) {
        let result;
        switch (this.booleanType) {
            case 'string':
                result = value + '';
                break;
            case 'number':
                result = parseInt(value, 10);
                break;
            default:
                result = value;
                break;
        }
        return result;
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
}
OCheckboxComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-checkbox',
                inputs: DEFAULT_INPUTS_O_CHECKBOX,
                outputs: DEFAULT_OUTPUTS_O_CHECKBOX,
                template: "<div [class.custom-width]=\"hasCustomWidth\" [formGroup]=\"getFormGroup()\" class=\"relative\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\" fxLayout=\"row\" fxLayoutAlign=\"start center\" fxFill>\n  <mat-checkbox [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" (change)=\"onChangeEvent($event)\"\n    [labelPosition]=\"labelPosition\" [color]=\"color\">\n    {{ olabel | oTranslate }}\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-checkbox>\n  <div *ngIf=\"isReadOnly\" (click)=\"onClickBlocker($event)\" class=\"read-only-blocker\" fxFill></div>\n</div>",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-checkbox]': 'true'
                },
                styles: [".o-checkbox mat-checkbox{z-index:1}.o-checkbox .mat-checkbox-disabled .mat-checkbox-layout .mat-checkbox-label{color:rgba(0,0,0,.36)}.o-checkbox .custom-width{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.o-checkbox .read-only-blocker{z-index:2;position:absolute;top:0;left:0;right:0}"]
            }] }
];
OCheckboxComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jaGVja2JveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY2hlY2tib3gvby1jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR2pILE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxxQ0FBcUMsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBR3BKLE1BQU0sQ0FBQyxNQUFNLHlCQUF5QixHQUFHO0lBRXZDLHVCQUF1QjtJQUV2Qix5QkFBeUI7SUFFekIsMkJBQTJCO0lBRTNCLE9BQU87SUFFUCwrQkFBK0I7SUFDL0IsR0FBRyxvQ0FBb0M7Q0FDeEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHO0lBQ3hDLEdBQUcscUNBQXFDO0NBQ3pDLENBQUM7QUFhRixNQUFNLE9BQU8sa0JBQW1CLFNBQVEsa0JBQWtCO0lBUXhELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBRWxCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBWHhCLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFDdEIsZUFBVSxHQUFRLEtBQUssQ0FBQztRQUN4QixnQkFBVyxHQUFvQyxTQUFTLENBQUM7UUFFekQsa0JBQWEsR0FBdUIsT0FBTyxDQUFDO1FBUWpE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QkFDSixvQkFBb0IsRUFBRSxNQUFNO2lCQUM3Qjs7YUFDRjs7O1lBakNRLGNBQWMsdUJBMkNsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUEvQ3BDLFVBQVU7WUFBc0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsIE9Gb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9vLWZvcm0tY29udHJvbC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0NIRUNLQk9YID0gW1xuICAvLyB0cnVlLXZhbHVlOiB0cnVlIHZhbHVlLiBEZWZhdWx0OiB0cnVlLlxuICAndHJ1ZVZhbHVlOiB0cnVlLXZhbHVlJyxcbiAgLy8gZmFsc2UtdmFsdWU6IGZhbHNlIHZhbHVlLiBEZWZhdWx0OiBmYWxzZS5cbiAgJ2ZhbHNlVmFsdWU6IGZhbHNlLXZhbHVlJyxcbiAgLy8gYm9vbGVhbi10eXBlIFtudW1iZXJ8Ym9vbGVhbnxzdHJpbmddOiBjZWxsRGF0YSB2YWx1ZSB0eXBlLiBEZWZhdWx0OiBib29sZWFuXG4gICdib29sZWFuVHlwZTogYm9vbGVhbi10eXBlJyxcbiAgLy8gY29sb3I6IFRoZW1lIGNvbG9yIHBhbGV0dGUgZm9yIHRoZSBjb21wb25lbnQuXG4gICdjb2xvcicsXG4gIC8vIGxhYmVsLXBvc2l0aW9uOiBXaGV0aGVyIHRoZSBsYWJlbCBzaG91bGQgYXBwZWFyIGFmdGVyIG9yIGJlZm9yZSB0aGUgc2xpZGUtdG9nZ2xlLiBEZWZhdWx0cyB0byAnYWZ0ZXInXG4gICdsYWJlbFBvc2l0aW9uOiBsYWJlbC1wb3NpdGlvbicsXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0NIRUNLQk9YID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWNoZWNrYm94JyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0NIRUNLQk9YLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19DSEVDS0JPWCxcbiAgdGVtcGxhdGVVcmw6ICcuL28tY2hlY2tib3guY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWNoZWNrYm94LmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY2hlY2tib3hdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0NoZWNrYm94Q29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IHtcblxuICBwdWJsaWMgdHJ1ZVZhbHVlOiBhbnkgPSB0cnVlO1xuICBwdWJsaWMgZmFsc2VWYWx1ZTogYW55ID0gZmFsc2U7XG4gIHB1YmxpYyBib29sZWFuVHlwZTogJ251bWJlcicgfCAnYm9vbGVhbicgfCAnc3RyaW5nJyA9ICdib29sZWFuJztcbiAgcHVibGljIGNvbG9yOiBUaGVtZVBhbGV0dGU7XG4gIHB1YmxpYyBsYWJlbFBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYWZ0ZXInO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2RlZmF1bHRTUUxUeXBlS2V5ID0gJ0JPT0xFQU4nO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICAvL0ZpcnN0LCB0aGUgc3FsVHlwZSBtdXN0IGJlIGluaXRpYWxpemVkICBiZWZvcmUgY2FsbGluZyBzdXBlci5pbml0aWFsaXplIGJlY2F1c2UgaXQgb3ZlcndyaXR0ZSB0aGUgdmFsdWVcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuc3FsVHlwZSkpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5ib29sZWFuVHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdJTlRFR0VSJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICB0aGlzLnNxbFR5cGUgPSAnVkFSQ0hBUic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdCT09MRUFOJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG5cbiAgICAvLyBPdmVycmlkZSBGb3JtQ29udHJvbCBnZXRWYWx1ZSBpbiBvcmRlciB0byByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIHZhbHVlIGluc3RlYWQgb2YgdGhlIGNoZWNrYm94IGludGVybmFsIGJvb2xlYW4gdmFsdWVcbiAgICBjb25zdCBjaGVja2JveEN0eCA9IHRoaXM7XG4gICAgKHRoaXMuZ2V0Rm9ybUNvbnRyb2woKSBhcyBPRm9ybUNvbnRyb2wpLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZSA/IGNoZWNrYm94Q3R4LnRydWVWYWx1ZSA6IGNoZWNrYm94Q3R4LmZhbHNlVmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGVuc3VyZU9Gb3JtVmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMucGFyc2VJbnB1dHMoKTtcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUudmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWx1ZS52YWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHRoaXMucGFyc2VWYWx1ZUJ5VHlwZSh2YWx1ZS52YWx1ZSkgPT09IHRoaXMudHJ1ZVZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodGhpcy5wYXJzZVZhbHVlQnlUeXBlKHZhbHVlKSA9PT0gdGhpcy50cnVlVmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldFZhbHVlKCk6IGFueSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMudmFsdWUpICYmIHRoaXMudmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudmFsdWUgPyB0aGlzLnRydWVWYWx1ZSA6IHRoaXMuZmFsc2VWYWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2tCbG9ja2VyKGV2dDogRXZlbnQpIHtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBwYXJzZVZhbHVlQnlUeXBlKHZhbHVlOiBhbnkpIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgc3dpdGNoICh0aGlzLmJvb2xlYW5UeXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICByZXN1bHQgPSB2YWx1ZSArICcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJlc3VsdCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlU3RyaW5nSW5wdXRzKCkge1xuICAgIGlmICgodGhpcy50cnVlVmFsdWUgfHwgJycpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy50cnVlVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICgodGhpcy5mYWxzZVZhbHVlIHx8ICcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZmFsc2VWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VOdW1iZXJJbnB1dHMoKSB7XG4gICAgdGhpcy50cnVlVmFsdWUgPSBwYXJzZUludCh0aGlzLnRydWVWYWx1ZSwgMTApO1xuICAgIGlmIChpc05hTih0aGlzLnRydWVWYWx1ZSkpIHtcbiAgICAgIHRoaXMudHJ1ZVZhbHVlID0gMTtcbiAgICB9XG4gICAgdGhpcy5mYWxzZVZhbHVlID0gcGFyc2VJbnQodGhpcy5mYWxzZVZhbHVlLCAxMCk7XG4gICAgaWYgKGlzTmFOKHRoaXMuZmFsc2VWYWx1ZSkpIHtcbiAgICAgIHRoaXMuZmFsc2VWYWx1ZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlSW5wdXRzKCkge1xuICAgIHN3aXRjaCAodGhpcy5ib29sZWFuVHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgdGhpcy5wYXJzZVN0cmluZ0lucHV0cygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHRoaXMucGFyc2VOdW1iZXJJbnB1dHMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnRydWVWYWx1ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZmFsc2VWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxufVxuIl19