import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, ViewEncapsulation } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { Util } from '../../../util/util';
import { OFormComponent } from '../../form/o-form.component';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT, OFormServiceComponent } from '../o-form-service-component.class';
export var DEFAULT_INPUTS_O_RADIO = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, [
    'translate',
    'layout',
    'labelPosition: label-position'
]);
export var DEFAULT_OUTPUTS_O_RADIO = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT);
var ORadioComponent = (function (_super) {
    tslib_1.__extends(ORadioComponent, _super);
    function ORadioComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.translate = false;
        _this.layout = 'column';
        _this.labelPosition = 'after';
        return _this;
    }
    ORadioComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
        if (this.queryOnInit) {
            this.queryData();
        }
    };
    ORadioComponent.prototype.onMatRadioGroupChange = function (e) {
        var newValue = e.value;
        this.setValue(newValue, {
            changeType: OValueChangeEvent.USER_CHANGE,
            emitEvent: false,
            emitModelToViewChange: false
        });
    };
    ORadioComponent.prototype.getOptionDescriptionValue = function (item) {
        if (item === void 0) { item = {}; }
        var descTxt = '';
        if (this.descriptionColArray && this.descriptionColArray.length > 0) {
            var self_1 = this;
            this.descriptionColArray.forEach(function (col, index) {
                var txt = item[col];
                if (txt) {
                    if (self_1.translate && self_1.translateService) {
                        txt = self_1.translateService.get(txt);
                    }
                    descTxt += txt;
                }
                if (index < self_1.descriptionColArray.length - 1) {
                    descTxt += self_1.separator;
                }
            });
        }
        return descTxt;
    };
    ORadioComponent.prototype.getValueColumn = function (item) {
        if (item && item.hasOwnProperty(this.valueColumn)) {
            var option = item[this.valueColumn];
            if (option === 'undefined') {
                option = null;
            }
            return option;
        }
        return void 0;
    };
    ORadioComponent.prototype.getDescriptionValue = function () {
        var _this = this;
        if (Util.isDefined(this.descriptionColArray) && this.descriptionColArray.length) {
            var currItem_1 = this.dataArray.find(function (e) { return e[_this.valueColumn] === _this.getValue(); });
            if (Util.isDefined(currItem_1)) {
                return this.descriptionColArray.map(function (col) { return (_this.translate && _this.translateService) ? _this.translateService.get(currItem_1[col]) : currItem_1[col]; }).join(this.separator);
            }
        }
        return '';
    };
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
    ORadioComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], ORadioComponent.prototype, "translate", void 0);
    return ORadioComponent;
}(OFormServiceComponent));
export { ORadioComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yYWRpby5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvcmFkaW8vby1yYWRpby5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHaEksT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFN0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLHdDQUF3QyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFFN0osTUFBTSxDQUFDLElBQU0sc0JBQXNCLG9CQUM5Qix1Q0FBdUM7SUFDMUMsV0FBVztJQUNYLFFBQVE7SUFDUiwrQkFBK0I7RUFDaEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLHVCQUF1QixvQkFDL0Isd0NBQXdDLENBQzVDLENBQUM7QUFFRjtJQWNxQywyQ0FBcUI7SUFXeEQseUJBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBSHBCLFlBS0Usa0JBQU0sSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsU0FDN0I7UUFiTSxlQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLFlBQU0sR0FBcUIsUUFBUSxDQUFDO1FBQ3BDLG1CQUFhLEdBQXVCLE9BQU8sQ0FBQzs7SUFXbkQsQ0FB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SUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3ZLO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7O2dCQXhGRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLDIzREFBdUM7b0JBRXZDLE1BQU0sRUFBRSxzQkFBc0I7b0JBQzlCLE9BQU8sRUFBRSx1QkFBdUI7b0JBQ2hDLFNBQVMsRUFBRTt3QkFDVCx1QkFBdUI7cUJBQ3hCO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osaUJBQWlCLEVBQUUsTUFBTTtxQkFDMUI7O2lCQUNGOzs7Z0JBN0JRLGNBQWMsdUJBMENsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkFoRHJCLFVBQVU7Z0JBQXNCLFFBQVE7O0lBd0N6RTtRQURDLGNBQWMsRUFBRTs7c0RBQ2lCO0lBd0VwQyxzQkFBQztDQUFBLEFBMUZELENBY3FDLHFCQUFxQixHQTRFekQ7U0E1RVksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT3B0aW9uYWwsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRSYWRpb0NoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtVmFsdWUgfSBmcm9tICcuLi8uLi9mb3JtL09Gb3JtVmFsdWUnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsIE9Gb3JtU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL28tZm9ybS1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1JBRElPID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsXG4gICd0cmFuc2xhdGUnLFxuICAnbGF5b3V0JyxcbiAgJ2xhYmVsUG9zaXRpb246IGxhYmVsLXBvc2l0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1JBRElPID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5UXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXJhZGlvJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tcmFkaW8uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXJhZGlvLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19SQURJTyxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fUkFESU8sXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplU2VydmljZVByb3ZpZGVyXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tcmFkaW9dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1JhZGlvQ29tcG9uZW50IGV4dGVuZHMgT0Zvcm1TZXJ2aWNlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgLyogSW5wdXRzICovXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyB0cmFuc2xhdGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGxheW91dDogJ3JvdycgfCAnY29sdW1uJyA9ICdjb2x1bW4nO1xuICBwdWJsaWMgbGFiZWxQb3NpdGlvbjogJ2JlZm9yZScgfCAnYWZ0ZXInID0gJ2FmdGVyJztcbiAgLyogRW5kIGlucHV0cyovXG5cbiAgdmFsdWU6IE9Gb3JtVmFsdWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgc3VwZXIubmdBZnRlclZpZXdJbml0KCk7XG4gICAgaWYgKHRoaXMucXVlcnlPbkluaXQpIHtcbiAgICAgIHRoaXMucXVlcnlEYXRhKCk7XG4gICAgfVxuICB9XG5cbiAgb25NYXRSYWRpb0dyb3VwQ2hhbmdlKGU6IE1hdFJhZGlvQ2hhbmdlKTogdm9pZCB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBlLnZhbHVlO1xuICAgIHRoaXMuc2V0VmFsdWUobmV3VmFsdWUsIHtcbiAgICAgIGNoYW5nZVR5cGU6IE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFLFxuICAgICAgZW1pdEV2ZW50OiBmYWxzZSxcbiAgICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIGdldE9wdGlvbkRlc2NyaXB0aW9uVmFsdWUoaXRlbTogYW55ID0ge30pIHtcbiAgICBsZXQgZGVzY1R4dCA9ICcnO1xuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkgJiYgdGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5LmZvckVhY2goKGNvbCwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IHR4dCA9IGl0ZW1bY29sXTtcbiAgICAgICAgaWYgKHR4dCkge1xuICAgICAgICAgIGlmIChzZWxmLnRyYW5zbGF0ZSAmJiBzZWxmLnRyYW5zbGF0ZVNlcnZpY2UpIHtcbiAgICAgICAgICAgIHR4dCA9IHNlbGYudHJhbnNsYXRlU2VydmljZS5nZXQodHh0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVzY1R4dCArPSB0eHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4IDwgc2VsZi5kZXNjcmlwdGlvbkNvbEFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkZXNjVHh0ICs9IHNlbGYuc2VwYXJhdG9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NUeHQ7XG4gIH1cblxuICBnZXRWYWx1ZUNvbHVtbihpdGVtOiBhbnkpIHtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmhhc093blByb3BlcnR5KHRoaXMudmFsdWVDb2x1bW4pKSB7XG4gICAgICBsZXQgb3B0aW9uID0gaXRlbVt0aGlzLnZhbHVlQ29sdW1uXTtcbiAgICAgIGlmIChvcHRpb24gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9wdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3B0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG5cbiAgZ2V0RGVzY3JpcHRpb25WYWx1ZSgpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5KSAmJiB0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkubGVuZ3RoKSB7XG4gICAgICBjb25zdCBjdXJySXRlbSA9IHRoaXMuZGF0YUFycmF5LmZpbmQoZSA9PiBlW3RoaXMudmFsdWVDb2x1bW5dID09PSB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGN1cnJJdGVtKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5Lm1hcChjb2wgPT4gKHRoaXMudHJhbnNsYXRlICYmIHRoaXMudHJhbnNsYXRlU2VydmljZSkgPyB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KGN1cnJJdGVtW2NvbF0pIDogY3Vyckl0ZW1bY29sXSkuam9pbih0aGlzLnNlcGFyYXRvcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG59XG4iXX0=