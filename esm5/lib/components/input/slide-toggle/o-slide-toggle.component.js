import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/oFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export var DEFAULT_INPUTS_O_SLIDETOGGLE = tslib_1.__spread([
    'trueValue: true-value',
    'falseValue: false-value',
    'booleanType: boolean-type',
    'color',
    'labelPosition: label-position'
], DEFAULT_INPUTS_O_FORM_DATA_COMPONENT);
export var DEFAULT_OUTPUTS_O_SLIDETOGGLE = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OSlideToggleComponent = (function (_super) {
    tslib_1.__extends(OSlideToggleComponent, _super);
    function OSlideToggleComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.trueValue = true;
        _this.falseValue = false;
        _this.booleanType = 'boolean';
        _this.labelPosition = 'after';
        _this._defaultSQLTypeKey = 'BOOLEAN';
        _this.defaultValue = false;
        return _this;
    }
    OSlideToggleComponent.prototype.initialize = function () {
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
        this.defaultValue = this.falseValue;
        _super.prototype.initialize.call(this);
    };
    OSlideToggleComponent.prototype.ensureOFormValue = function (value) {
        if (value instanceof OFormValue) {
            if (!Util.isDefined(value.value)) {
                value.value = this.falseValue;
            }
            this.value = new OFormValue(value.value);
        }
        else {
            this.value = new OFormValue(value === this.trueValue ? this.trueValue : this.falseValue);
        }
    };
    OSlideToggleComponent.prototype.isChecked = function () {
        if (this.value instanceof OFormValue) {
            return this.value.value === this.trueValue;
        }
        return false;
    };
    OSlideToggleComponent.prototype.onClickBlocker = function (e) {
        e.stopPropagation();
    };
    OSlideToggleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-slide-toggle',
                    inputs: DEFAULT_INPUTS_O_SLIDETOGGLE,
                    outputs: DEFAULT_OUTPUTS_O_SLIDETOGGLE,
                    template: "<div [class.custom-width]=\"hasCustomWidth\" [formGroup]=\"getFormGroup()\" class=\"relative\" [matTooltip]=\"tooltip\"\n  [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\" fxLayout=\"row\" fxLayoutAlign=\"start center\" fxFill>\n  <mat-slide-toggle [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [checked]=\"isChecked()\"\n    [required]=\"isRequired\" [labelPosition]=\"labelPosition\" [color]=\"color\" (change)=\"onChangeEvent($event)\">\n    <ng-container *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</ng-container>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-slide-toggle>\n  <div *ngIf=\"isReadOnly\" (click)=\"onClickBlocker($event)\" class=\"read-only-blocker\" fxFill></div>\n</div>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-slide-toggle]': 'true'
                    },
                    styles: [".o-slide-toggle .read-only-blocker{z-index:2;position:absolute;top:0;left:0;right:0}"]
                }] }
    ];
    OSlideToggleComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    return OSlideToggleComponent;
}(OFormDataComponent));
export { OSlideToggleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbGlkZS10b2dnbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NsaWRlLXRvZ2dsZS9vLXNsaWRlLXRvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUdqSCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDMUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQ0wsb0NBQW9DLEVBQ3BDLHFDQUFxQyxFQUNyQyxrQkFBa0IsR0FDbkIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsSUFBTSw0QkFBNEI7SUFFdkMsdUJBQXVCO0lBRXZCLHlCQUF5QjtJQUV6QiwyQkFBMkI7SUFFM0IsT0FBTztJQUVQLCtCQUErQjtHQUM1QixvQ0FBb0MsQ0FDeEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLDZCQUE2QixvQkFDckMscUNBQXFDLENBQ3pDLENBQUM7QUFFRjtJQVcyQyxpREFBa0I7SUFRM0QsK0JBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSHBCLFlBS0Usa0JBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FHN0I7UUFkTSxlQUFTLEdBQThCLElBQUksQ0FBQztRQUM1QyxnQkFBVSxHQUE4QixLQUFLLENBQUM7UUFDOUMsaUJBQVcsR0FBb0MsU0FBUyxDQUFDO1FBRXpELG1CQUFhLEdBQXVCLE9BQU8sQ0FBQztRQVFqRCxLQUFJLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO1FBQ3BDLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDOztJQUM1QixDQUFDO0lBRUQsMENBQVUsR0FBVjtRQUVFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3hCLEtBQUssUUFBUTtvQkFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztvQkFDekIsTUFBTTtnQkFDUixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7b0JBQ3pCLE1BQU07Z0JBQ1IsS0FBSyxTQUFTLENBQUM7Z0JBQ2Y7b0JBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7YUFDNUI7U0FDRjtRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxpQkFBTSxVQUFVLFdBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsZ0RBQWdCLEdBQWhCLFVBQWlCLEtBQVU7UUFDekIsSUFBSSxLQUFLLFlBQVksVUFBVSxFQUFFO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDaEMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxRjtJQUNILENBQUM7SUFFRCx5Q0FBUyxHQUFUO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLFVBQVUsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDNUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCw4Q0FBYyxHQUFkLFVBQWUsQ0FBYTtRQUMxQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7Z0JBcEVGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixNQUFNLEVBQUUsNEJBQTRCO29CQUNwQyxPQUFPLEVBQUUsNkJBQTZCO29CQUN0QyxzZ0NBQThDO29CQUU5QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLHdCQUF3QixFQUFFLE1BQU07cUJBQ2pDOztpQkFDRjs7O2dCQXBDUSxjQUFjLHVCQThDbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGNBQWMsRUFBZCxDQUFjLENBQUM7Z0JBbERwQyxVQUFVO2dCQUFzQixRQUFROztJQW9HNUQsNEJBQUM7Q0FBQSxBQXRFRCxDQVcyQyxrQkFBa0IsR0EyRDVEO1NBM0RZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUaGVtZVBhbGV0dGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uLy4uL2Zvcm0vb0Zvcm1WYWx1ZSc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fU0xJREVUT0dHTEUgPSBbXG4gIC8vIHRydWUtdmFsdWU6IHRydWUgdmFsdWUuIERlZmF1bHQ6IHRydWUuXG4gICd0cnVlVmFsdWU6IHRydWUtdmFsdWUnLFxuICAvLyBmYWxzZS12YWx1ZTogZmFsc2UgdmFsdWUuIERlZmF1bHQ6IGZhbHNlLlxuICAnZmFsc2VWYWx1ZTogZmFsc2UtdmFsdWUnLFxuICAvLyBib29sZWFuLXR5cGUgW251bWJlcnxib29sZWFufHN0cmluZ106IGNlbGxEYXRhIHZhbHVlIHR5cGUuIERlZmF1bHQ6IGJvb2xlYW5cbiAgJ2Jvb2xlYW5UeXBlOiBib29sZWFuLXR5cGUnLFxuICAvLyBjb2xvcjogVGhlbWUgY29sb3IgcGFsZXR0ZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgJ2NvbG9yJyxcbiAgLy8gbGFiZWwtcG9zaXRpb246IFdoZXRoZXIgdGhlIGxhYmVsIHNob3VsZCBhcHBlYXIgYWZ0ZXIgb3IgYmVmb3JlIHRoZSBzbGlkZS10b2dnbGUuIERlZmF1bHRzIHRvICdhZnRlcidcbiAgJ2xhYmVsUG9zaXRpb246IGxhYmVsLXBvc2l0aW9uJyxcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5UXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fU0xJREVUT0dHTEUgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tc2xpZGUtdG9nZ2xlJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1NMSURFVE9HR0xFLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19TTElERVRPR0dMRSxcbiAgdGVtcGxhdGVVcmw6ICcuL28tc2xpZGUtdG9nZ2xlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1zbGlkZS10b2dnbGUuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1zbGlkZS10b2dnbGVdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1NsaWRlVG9nZ2xlQ29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IHtcblxuICBwdWJsaWMgdHJ1ZVZhbHVlOiBudW1iZXIgfCBib29sZWFuIHwgc3RyaW5nID0gdHJ1ZTtcbiAgcHVibGljIGZhbHNlVmFsdWU6IG51bWJlciB8IGJvb2xlYW4gfCBzdHJpbmcgPSBmYWxzZTtcbiAgcHVibGljIGJvb2xlYW5UeXBlOiAnbnVtYmVyJyB8ICdib29sZWFuJyB8ICdzdHJpbmcnID0gJ2Jvb2xlYW4nO1xuICBwdWJsaWMgY29sb3I6IFRoZW1lUGFsZXR0ZTtcbiAgcHVibGljIGxhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnQk9PTEVBTic7XG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBmYWxzZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgLy9GaXJzdCwgdGhlIHNxbFR5cGUgbXVzdCBiZSBpbml0aWFsaXplZCAgYmVmb3JlIGNhbGxpbmcgc3VwZXIuaW5pdGlhbGl6ZSBiZWNhdXNlIGl0IG92ZXJ3cml0dGUgdGhlIHZhbHVlXG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLnNxbFR5cGUpKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuYm9vbGVhblR5cGUpIHtcbiAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICB0aGlzLnNxbFR5cGUgPSAnSU5URUdFUic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgdGhpcy5zcWxUeXBlID0gJ1ZBUkNIQVInO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLnNxbFR5cGUgPSAnQk9PTEVBTic7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gdGhpcy5mYWxzZVZhbHVlO1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGVuc3VyZU9Gb3JtVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIGlmICghVXRpbC5pc0RlZmluZWQodmFsdWUudmFsdWUpKSB7XG4gICAgICAgIHZhbHVlLnZhbHVlID0gdGhpcy5mYWxzZVZhbHVlO1xuICAgICAgfVxuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbHVlLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbHVlID09PSB0aGlzLnRydWVWYWx1ZSA/IHRoaXMudHJ1ZVZhbHVlIDogdGhpcy5mYWxzZVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBpc0NoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS52YWx1ZSA9PT0gdGhpcy50cnVlVmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG9uQ2xpY2tCbG9ja2VyKGU6IE1vdXNlRXZlbnQpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbn1cbiJdfQ==