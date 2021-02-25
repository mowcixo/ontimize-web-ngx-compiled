import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT, OFormServiceComponent } from '../o-form-service-component.class';
export const DEFAULT_INPUTS_O_RADIO = [
    ...DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
    'translate',
    'layout',
    'labelPosition: label-position'
];
export const DEFAULT_OUTPUTS_O_RADIO = [
    ...DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT
];
export class ORadioComponent extends OFormServiceComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.translate = false;
        this.layout = 'column';
        this.labelPosition = 'after';
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.queryOnInit) {
            this.queryData();
        }
    }
    onMatRadioGroupChange(e) {
        const newValue = e.value;
        this.setValue(newValue, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    }
    getOptionDescriptionValue(item = {}) {
        let descTxt = '';
        if (this.descriptionColArray && this.descriptionColArray.length > 0) {
            const self = this;
            this.descriptionColArray.forEach((col, index) => {
                let txt = item[col];
                if (txt) {
                    if (self.translate && self.translateService) {
                        txt = self.translateService.get(txt);
                    }
                    descTxt += txt;
                }
                if (index < self.descriptionColArray.length - 1) {
                    descTxt += self.separator;
                }
            });
        }
        return descTxt;
    }
    getValueColumn(item) {
        if (item && item.hasOwnProperty(this.valueColumn)) {
            let option = item[this.valueColumn];
            if (option === 'undefined') {
                option = null;
            }
            return option;
        }
        return void 0;
    }
    getDescriptionValue() {
        if (Util.isDefined(this.descriptionColArray) && this.descriptionColArray.length) {
            const currItem = this.dataArray.find(e => e[this.valueColumn] === this.getValue());
            if (Util.isDefined(currItem)) {
                return this.descriptionColArray.map(col => (this.translate && this.translateService) ? this.translateService.get(currItem[col]) : currItem[col]).join(this.separator);
            }
        }
        return '';
    }
}
ORadioComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-radio',
                template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\" class=\"relative\">\n  <!-- mat-form-field and hidden input are used only for displaying component label and errors as mat-radio is not supported inside form-field -->\n  <!-- https://github.com/angular/material2/issues/7891 -->\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.read-only]=\"isReadOnly\" [class.custom-width]=\"hasCustomWidth\" [class.o-radio-from-field-row]=\"layout==='row'\"\n    floatLabel=\"always\" class=\"mat-form-field--no-underline\" fxFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      [required]=\"isRequired\" style=\"display: none\" />\n    <mat-radio-group [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [name]=\"getAttribute()\"\n      [value]=\"getValue()\" [required]=\"isRequired\" [labelPosition]=\"labelPosition\"\n      (change)=\"onMatRadioGroupChange($event)\" [fxLayout]=\"layout\" fxLayoutGap=\"8px\">\n      <mat-radio-button *ngFor=\"let item of getDataArray()\" [value]=\"getValueColumn(item)\" [disabled]=\"!enabled\">\n        {{ getOptionDescriptionValue(item) }}\n      </mat-radio-button>\n    </mat-radio-group>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n  <div *ngIf=\"isReadOnly\" (click)=\"$event.stopPropagation()\" class=\"read-only-blocker\" fxFill></div>\n</div>",
                inputs: DEFAULT_INPUTS_O_RADIO,
                outputs: DEFAULT_OUTPUTS_O_RADIO,
                providers: [
                    OntimizeServiceProvider
                ],
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-radio]': 'true'
                },
                styles: [".o-radio .mat-form-field--no-underline .mat-form-field-underline,.o-radio .mat-form-field--no-underline .mat-form-field-underline .mat-form-field-ripple{background-image:none;background-color:transparent}.o-radio .mat-form-field:not(.custom-width).o-radio-from-field-row .mat-form-field-infix{width:auto}.o-radio .read-only-blocker{z-index:2;position:absolute;top:0;left:0;right:0}"]
            }] }
];
ORadioComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], ORadioComponent.prototype, "translate", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yYWRpby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvcmFkaW8vby1yYWRpby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHaEksT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFN0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLHdDQUF3QyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFN0osTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQUc7SUFDcEMsR0FBRyx1Q0FBdUM7SUFDMUMsV0FBVztJQUNYLFFBQVE7SUFDUiwrQkFBK0I7Q0FDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ3JDLEdBQUcsd0NBQXdDO0NBQzVDLENBQUM7QUFnQkYsTUFBTSxPQUFPLGVBQWdCLFNBQVEscUJBQXFCO0lBV3hELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBRWxCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBWnhCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsV0FBTSxHQUFxQixRQUFRLENBQUM7UUFDcEMs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QUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7O1lBeEZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsU0FBUztnQkFDbkIsMjNEQUF1QztnQkFFdkMsTUFBTSxFQUFFLHNCQUFzQjtnQkFDOUIsT0FBTyxFQUFFLHVCQUF1QjtnQkFDaEMsU0FBUyxFQUFFO29CQUNULHVCQUF1QjtpQkFDeEI7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixpQkFBaUIsRUFBRSxNQUFNO2lCQUMxQjs7YUFDRjs7O1lBN0JRLGNBQWMsdUJBMENsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFoRHJCLFVBQVU7WUFBc0IsUUFBUTs7QUF3Q3pFO0lBREMsY0FBYyxFQUFFOztrREFDaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0UmFkaW9DaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybVZhbHVlIH0gZnJvbSAnLi4vLi4vZm9ybS9PRm9ybVZhbHVlJztcbmltcG9ydCB7IE9WYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSAnLi4vLi4vby12YWx1ZS1jaGFuZ2UtZXZlbnQuY2xhc3MnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5ULCBERUZBVUxUX09VVFBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5ULCBPRm9ybVNlcnZpY2VDb21wb25lbnQgfSBmcm9tICcuLi9vLWZvcm0tc2VydmljZS1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19SQURJTyA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5ULFxuICAndHJhbnNsYXRlJyxcbiAgJ2xheW91dCcsXG4gICdsYWJlbFBvc2l0aW9uOiBsYWJlbC1wb3NpdGlvbidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19SQURJTyA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1yYWRpbycsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXJhZGlvLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1yYWRpby5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fUkFESU8sXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1JBRElPLFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlclxuICBdLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXJhZGlvXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9SYWRpb0NvbXBvbmVudCBleHRlbmRzIE9Gb3JtU2VydmljZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIC8qIElucHV0cyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdHJhbnNsYXRlOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBsYXlvdXQ6ICdyb3cnIHwgJ2NvbHVtbicgPSAnY29sdW1uJztcbiAgcHVibGljIGxhYmVsUG9zaXRpb246ICdiZWZvcmUnIHwgJ2FmdGVyJyA9ICdhZnRlcic7XG4gIC8qIEVuZCBpbnB1dHMqL1xuXG4gIHZhbHVlOiBPRm9ybVZhbHVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIGlmICh0aGlzLnF1ZXJ5T25Jbml0KSB7XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTWF0UmFkaW9Hcm91cENoYW5nZShlOiBNYXRSYWRpb0NoYW5nZSk6IHZvaWQge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gZS52YWx1ZTtcbiAgICB0aGlzLnNldFZhbHVlKG5ld1ZhbHVlLCB7XG4gICAgICBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2UsXG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBnZXRPcHRpb25EZXNjcmlwdGlvblZhbHVlKGl0ZW06IGFueSA9IHt9KSB7XG4gICAgbGV0IGRlc2NUeHQgPSAnJztcbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5ICYmIHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheS5mb3JFYWNoKChjb2wsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCB0eHQgPSBpdGVtW2NvbF07XG4gICAgICAgIGlmICh0eHQpIHtcbiAgICAgICAgICBpZiAoc2VsZi50cmFuc2xhdGUgJiYgc2VsZi50cmFuc2xhdGVTZXJ2aWNlKSB7XG4gICAgICAgICAgICB0eHQgPSBzZWxmLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KHR4dCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlc2NUeHQgKz0gdHh0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleCA8IHNlbGYuZGVzY3JpcHRpb25Db2xBcnJheS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgZGVzY1R4dCArPSBzZWxmLnNlcGFyYXRvcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkZXNjVHh0O1xuICB9XG5cbiAgZ2V0VmFsdWVDb2x1bW4oaXRlbTogYW55KSB7XG4gICAgaWYgKGl0ZW0gJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eSh0aGlzLnZhbHVlQ29sdW1uKSkge1xuICAgICAgbGV0IG9wdGlvbiA9IGl0ZW1bdGhpcy52YWx1ZUNvbHVtbl07XG4gICAgICBpZiAob3B0aW9uID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvcHRpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIHZvaWQgMDtcbiAgfVxuXG4gIGdldERlc2NyaXB0aW9uVmFsdWUoKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheSkgJiYgdGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5Lmxlbmd0aCkge1xuICAgICAgY29uc3QgY3Vyckl0ZW0gPSB0aGlzLmRhdGFBcnJheS5maW5kKGUgPT4gZVt0aGlzLnZhbHVlQ29sdW1uXSA9PT0gdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChjdXJySXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheS5tYXAoY29sID0+ICh0aGlzLnRyYW5zbGF0ZSAmJiB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UpID8gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldChjdXJySXRlbVtjb2xdKSA6IGN1cnJJdGVtW2NvbF0pLmpvaW4odGhpcy5zZXBhcmF0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cblxufVxuIl19