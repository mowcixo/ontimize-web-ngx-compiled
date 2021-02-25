import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OFormValue } from '../../form/oFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../../o-form-data-component.class';
export const DEFAULT_INPUTS_O_SLIDETOGGLE = [
    'trueValue: true-value',
    'falseValue: false-value',
    'booleanType: boolean-type',
    'color',
    'labelPosition: label-position',
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];
export const DEFAULT_OUTPUTS_O_SLIDETOGGLE = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OSlideToggleComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.trueValue = true;
        this.falseValue = false;
        this.booleanType = 'boolean';
        this.labelPosition = 'after';
        this._defaultSQLTypeKey = 'BOOLEAN';
        this.defaultValue = false;
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
        this.defaultValue = this.falseValue;
        super.initialize();
    }
    ensureOFormValue(value) {
        if (value instanceof OFormValue) {
            if (!Util.isDefined(value.value)) {
                value.value = this.falseValue;
            }
            this.value = new OFormValue(value.value);
        }
        else {
            this.value = new OFormValue(value === this.trueValue ? this.trueValue : this.falseValue);
        }
    }
    isChecked() {
        if (this.value instanceof OFormValue) {
            return this.value.value === this.trueValue;
        }
        return false;
    }
    onClickBlocker(e) {
        e.stopPropagation();
    }
}
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
OSlideToggleComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zbGlkZS10b2dnbGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NsaWRlLXRvZ2dsZS9vLXNsaWRlLXRvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBR2pILE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMscUNBQXFDLEVBQ3JDLGtCQUFrQixHQUNuQixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE1BQU0sQ0FBQyxNQUFNLDRCQUE0QixHQUFHO0lBRTFDLHVCQUF1QjtJQUV2Qix5QkFBeUI7SUFFekIsMkJBQTJCO0lBRTNCLE9BQU87SUFFUCwrQkFBK0I7SUFDL0IsR0FBRyxvQ0FBb0M7Q0FDeEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHO0lBQzNDLEdBQUcscUNBQXFDO0NBQ3pDLENBQUM7QUFhRixNQUFNLE9BQU8scUJBQXNCLFNBQVEsa0JBQWtCO0lBUTNELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBRWxCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBWHhCLGNBQVMsR0FBOEIsSUFBSSxDQUFDO1FBQzVDLGVBQVUsR0FBOEIsS0FBSyxDQUFDO1FBQzlDLGdCQUFXLEdBQW9DLFNBQVMsQ0FBQztRQUV6RCxrQkFBYSxHQUF1QixPQUFPLENBQUM7UUFRakQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQsVUFBVTtRQUVSLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3hCLEtBQUssUUFBUTtvQkFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztvQkFDekIsTUFBTTtnQkFDUixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7b0JBQ3pCLE1BQU07Z0JBQ1IsS0FBSyxTQUFTLENBQUM7Z0JBQ2Y7b0JBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7YUFDNUI7U0FDRjtRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQVU7UUFDekIsSUFBSSxLQUFLLFlBQVksVUFBVSxFQUFFO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDaEMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxRjtJQUNILENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLFVBQVUsRUFBRTtZQUNwQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDNUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxjQUFjLENBQUMsQ0FBYTtRQUMxQixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7O1lBcEVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixNQUFNLEVBQUUsNEJBQTRCO2dCQUNwQyxPQUFPLEVBQUUsNkJBQTZCO2dCQUN0QyxzZ0NBQThDO2dCQUU5QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLHdCQUF3QixFQUFFLE1BQU07aUJBQ2pDOzthQUNGOzs7WUFwQ1EsY0FBYyx1QkE4Q2xCLFFBQVEsWUFBSSxNQUFNLFNBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQztZQWxEcEMsVUFBVTtZQUFzQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRoZW1lUGFsZXR0ZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybVZhbHVlIH0gZnJvbSAnLi4vLi4vZm9ybS9vRm9ybVZhbHVlJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgT0Zvcm1EYXRhQ29tcG9uZW50LFxufSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19TTElERVRPR0dMRSA9IFtcbiAgLy8gdHJ1ZS12YWx1ZTogdHJ1ZSB2YWx1ZS4gRGVmYXVsdDogdHJ1ZS5cbiAgJ3RydWVWYWx1ZTogdHJ1ZS12YWx1ZScsXG4gIC8vIGZhbHNlLXZhbHVlOiBmYWxzZSB2YWx1ZS4gRGVmYXVsdDogZmFsc2UuXG4gICdmYWxzZVZhbHVlOiBmYWxzZS12YWx1ZScsXG4gIC8vIGJvb2xlYW4tdHlwZSBbbnVtYmVyfGJvb2xlYW58c3RyaW5nXTogY2VsbERhdGEgdmFsdWUgdHlwZS4gRGVmYXVsdDogYm9vbGVhblxuICAnYm9vbGVhblR5cGU6IGJvb2xlYW4tdHlwZScsXG4gIC8vIGNvbG9yOiBUaGVtZSBjb2xvciBwYWxldHRlIGZvciB0aGUgY29tcG9uZW50LlxuICAnY29sb3InLFxuICAvLyBsYWJlbC1wb3NpdGlvbjogV2hldGhlciB0aGUgbGFiZWwgc2hvdWxkIGFwcGVhciBhZnRlciBvciBiZWZvcmUgdGhlIHNsaWRlLXRvZ2dsZS4gRGVmYXVsdHMgdG8gJ2FmdGVyJ1xuICAnbGFiZWxQb3NpdGlvbjogbGFiZWwtcG9zaXRpb24nLFxuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlRcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19TTElERVRPR0dMRSA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1zbGlkZS10b2dnbGUnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fU0xJREVUT0dHTEUsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1NMSURFVE9HR0xFLFxuICB0ZW1wbGF0ZVVybDogJy4vby1zbGlkZS10b2dnbGUuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXNsaWRlLXRvZ2dsZS5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXNsaWRlLXRvZ2dsZV0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPU2xpZGVUb2dnbGVDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQge1xuXG4gIHB1YmxpYyB0cnVlVmFsdWU6IG51bWJlciB8IGJvb2xlYW4gfCBzdHJpbmcgPSB0cnVlO1xuICBwdWJsaWMgZmFsc2VWYWx1ZTogbnVtYmVyIHwgYm9vbGVhbiB8IHN0cmluZyA9IGZhbHNlO1xuICBwdWJsaWMgYm9vbGVhblR5cGU6ICdudW1iZXInIHwgJ2Jvb2xlYW4nIHwgJ3N0cmluZycgPSAnYm9vbGVhbic7XG4gIHB1YmxpYyBjb2xvcjogVGhlbWVQYWxldHRlO1xuICBwdWJsaWMgbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBmb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgICB0aGlzLl9kZWZhdWx0U1FMVHlwZUtleSA9ICdCT09MRUFOJztcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICAvL0ZpcnN0LCB0aGUgc3FsVHlwZSBtdXN0IGJlIGluaXRpYWxpemVkICBiZWZvcmUgY2FsbGluZyBzdXBlci5pbml0aWFsaXplIGJlY2F1c2UgaXQgb3ZlcndyaXR0ZSB0aGUgdmFsdWVcbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMuc3FsVHlwZSkpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5ib29sZWFuVHlwZSkge1xuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdJTlRFR0VSJztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICB0aGlzLnNxbFR5cGUgPSAnVkFSQ0hBUic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuc3FsVHlwZSA9ICdCT09MRUFOJztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB0aGlzLmZhbHNlVmFsdWU7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgZW5zdXJlT0Zvcm1WYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh2YWx1ZS52YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUudmFsdWUgPSB0aGlzLmZhbHNlVmFsdWU7XG4gICAgICB9XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodmFsdWUudmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodmFsdWUgPT09IHRoaXMudHJ1ZVZhbHVlID8gdGhpcy50cnVlVmFsdWUgOiB0aGlzLmZhbHNlVmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLnZhbHVlID09PSB0aGlzLnRydWVWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb25DbGlja0Jsb2NrZXIoZTogTW91c2VFdmVudCkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxufVxuIl19