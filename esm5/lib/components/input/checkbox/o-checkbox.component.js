import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/OFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export var DEFAULT_INPUTS_O_CHECKBOX = tslib_1.__spread([
    'trueValue: true-value',
    'falseValue: false-value',
    'booleanType: boolean-type',
    'color',
    'labelPosition: label-position'
], DEFAULT_INPUTS_O_FORM_DATA_COMPONENT);
export var DEFAULT_OUTPUTS_O_CHECKBOX = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OCheckboxComponent = (function (_super) {
    tslib_1.__extends(OCheckboxComponent, _super);
    function OCheckboxComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.trueValue = true;
        _this.falseValue = false;
        _this.booleanType = 'boolean';
        _this.labelPosition = 'after';
        _this._defaultSQLTypeKey = 'BOOLEAN';
        return _this;
    }
    OCheckboxComponent.prototype.initialize = function () {
        var _this = this;
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
        _super.prototype.initialize.call(this);
        var context = this;
        this.getFormControl().getValue.bind(context);
        this.getFormControl().getValue = function () {
            return _this.value ? context.trueValue : context.falseValue;
        };
    };
    OCheckboxComponent.prototype.ensureOFormValue = function (value) {
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
    };
    OCheckboxComponent.prototype.onClickBlocker = function (evt) {
        evt.stopPropagation();
    };
    OCheckboxComponent.prototype.parseValueByType = function (value) {
        var result;
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
    };
    OCheckboxComponent.prototype.parseStringInputs = function () {
        if ((this.trueValue || '').length === 0) {
            this.trueValue = undefined;
        }
        if ((this.falseValue || '').length === 0) {
            this.falseValue = undefined;
        }
    };
    OCheckboxComponent.prototype.parseNumberInputs = function () {
        this.trueValue = parseInt(this.trueValue, 10);
        if (isNaN(this.trueValue)) {
            this.trueValue = 1;
        }
        this.falseValue = parseInt(this.falseValue, 10);
        if (isNaN(this.falseValue)) {
            this.falseValue = 0;
        }
    };
    OCheckboxComponent.prototype.parseInputs = function () {
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
    };
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
    OCheckboxComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OCheckboxComponent;
}(OFormDataComponent));
export { OCheckboxComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jaGVja2JveC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY2hlY2tib3gvby1jaGVja2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdqSCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQ0wsb0NBQW9DLEVBQ3BDLHFDQUFxQyxFQUNyQyxrQkFBa0IsR0FDbkIsTUFBTSxtQ0FBbUMsQ0FBQztBQUczQyxNQUFNLENBQUMsSUFBTSx5QkFBeUI7SUFFcEMsdUJBQXVCO0lBRXZCLHlCQUF5QjtJQUV6QiwyQkFBMkI7SUFFM0IsT0FBTztJQUVQLCtCQUErQjtHQUM1QixvQ0FBb0MsQ0FDeEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixvQkFDbEMscUNBQXFDLENBQ3pDLENBQUM7QUFFRjtJQVd3Qyw4Q0FBa0I7SUFReEQsNEJBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSHBCLFlBS0Usa0JBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FFN0I7UUFiTSxlQUFTLEdBQVEsSUFBSSxDQUFDO1FBQ3RCLGdCQUFVLEdBQVEsS0FBSyxDQUFDO1FBQ3hCLGlCQUFXLEdBQW9DLFNBQVMsQ0FBQztRQUV6RCxtQkFBYSxHQUF1QixPQUFPLENBQUM7UUFRakQsS0FBSSxDQUFDLGtCQUFrQixHQUFHLFNBQVMs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QyxrQkFBa0IsR0E4R3pEO1NBOUdZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9Gb3JtQ29udHJvbCB9IGZyb20gJy4uL28tZm9ybS1jb250cm9sLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQ0hFQ0tCT1ggPSBbXG4gIC8vIHRydWUtdmFsdWU6IHRydWUgdmFsdWUuIERlZmF1bHQ6IHRydWUuXG4gICd0cnVlVmFsdWU6IHRydWUtdmFsdWUnLFxuICAvLyBmYWxzZS12YWx1ZTogZmFsc2UgdmFsdWUuIERlZmF1bHQ6IGZhbHNlLlxuICAnZmFsc2VWYWx1ZTogZmFsc2UtdmFsdWUnLFxuICAvLyBib29sZWFuLXR5cGUgW251bWJlcnxib29sZWFufHN0cmluZ106IGNlbGxEYXRhIHZhbHVlIHR5cGUuIERlZmF1bHQ6IGJvb2xlYW5cbiAgJ2Jvb2xlYW5UeXBlOiBib29sZWFuLXR5cGUnLFxuICAvLyBjb2xvcjogVGhlbWUgY29sb3IgcGFsZXR0ZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgJ2NvbG9yJyxcbiAgLy8gbGFiZWwtcG9zaXRpb246IFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSBzbGlkZS10b2dnbGUuIERlZmF1bHRzIHRvICdhZnRlcidcbiAgJ2xhYmVsUG9zaXRpb246IGxhYmVsLXBvc2l0aW9uJyxcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQ0hFQ0tCT1ggPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY2hlY2tib3gnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQ0hFQ0tCT1gsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0NIRUNLQk9YLFxuICB0ZW1wbGF0ZVVybDogJy4vby1jaGVja2JveC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tY2hlY2tib3guY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jaGVja2JveF0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPQ2hlY2tib3hDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQge1xuXG4gIHB1YmxpYyB0cnVlVmFsdWU6IGFueSA9IHRydWU7XG4gIHB1YmxpYyBmYWxzZVZhbHVlOiBhbnkgPSBmYWxzZTtcbiAgcHVibGljIGJvb2xlYW5UeXBlOiAnbnVtYmVyJyB8ICdib29sZWFuJyB8ICdzdHJpbmcnID0gJ2Jvb2xlYW4nO1xuICBwdWJsaWMgY29sb3I6IFRoZW1lUGFsZXR0ZTtcbiAgcHVibGljIGxhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnQk9PTEVBTic7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIC8vRmlyc3QsIHRoZSBzcWxUeXBlIG11c3QgYmUgaW5pdGlhbGl6ZWQgIGJlZm9yZSBjYWxsaW5nIHN1cGVyLmluaXRpYWxpemUgYmVjYXVzZSBpdCBvdmVyd3JpdHRlIHRoZSB2YWx1ZVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5zcWxUeXBlKSkge1xuICAgICAgc3dpdGNoICh0aGlzLmJvb2xlYW5UeXBlKSB7XG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgdGhpcy5zcWxUeXBlID0gJ0lOVEVHRVInO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdWQVJDSEFSJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5zcWxUeXBlID0gJ0JPT0xFQU4nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAodGhpcy5nZXRGb3JtQ29udHJvbCgpIGFzIE9Gb3JtQ29udHJvbCkuZ2V0VmFsdWUuYmluZChjb250ZXh0KTtcbiAgICAodGhpcy5nZXRGb3JtQ29udHJvbCgpIGFzIE9Gb3JtQ29udHJvbCkuZ2V0VmFsdWUgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZSA/IGNvbnRleHQudHJ1ZVZhbHVlIDogY29udGV4dC5mYWxzZVZhbHVlO1xuICAgIH07XG4gIH1cblxuICBlbnN1cmVPRm9ybVZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLnBhcnNlSW5wdXRzKCk7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgaWYgKHZhbHVlLnZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWUudmFsdWUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh0aGlzLnBhcnNlVmFsdWVCeVR5cGUodmFsdWUudmFsdWUpID09PSB0aGlzLnRydWVWYWx1ZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJykge1xuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHRoaXMucGFyc2VWYWx1ZUJ5VHlwZSh2YWx1ZSkgPT09IHRoaXMudHJ1ZVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrQmxvY2tlcihldnQ6IEV2ZW50KSB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcGFyc2VWYWx1ZUJ5VHlwZSh2YWx1ZTogYW55KSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHN3aXRjaCAodGhpcy5ib29sZWFuVHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgcmVzdWx0ID0gdmFsdWUgKyAnJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXN1bHQgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZVN0cmluZ0lucHV0cygpIHtcbiAgICBpZiAoKHRoaXMudHJ1ZVZhbHVlIHx8ICcnKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudHJ1ZVZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoKHRoaXMuZmFsc2VWYWx1ZSB8fCAnJykubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmZhbHNlVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlTnVtYmVySW5wdXRzKCkge1xuICAgIHRoaXMudHJ1ZVZhbHVlID0gcGFyc2VJbnQodGhpcy50cnVlVmFsdWUsIDEwKTtcbiAgICBpZiAoaXNOYU4odGhpcy50cnVlVmFsdWUpKSB7XG4gICAgICB0aGlzLnRydWVWYWx1ZSA9IDE7XG4gICAgfVxuICAgIHRoaXMuZmFsc2VWYWx1ZSA9IHBhcnNlSW50KHRoaXMuZmFsc2VWYWx1ZSwgMTApO1xuICAgIGlmIChpc05hTih0aGlzLmZhbHNlVmFsdWUpKSB7XG4gICAgICB0aGlzLmZhbHNlVmFsdWUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZUlucHV0cygpIHtcbiAgICBzd2l0Y2ggKHRoaXMuYm9vbGVhblR5cGUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHRoaXMucGFyc2VTdHJpbmdJbnB1dHMoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICB0aGlzLnBhcnNlTnVtYmVySW5wdXRzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy50cnVlVmFsdWUgPSB0cnVlO1xuICAgICAgICB0aGlzLmZhbHNlVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==