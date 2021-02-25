import * as tslib_1 from "tslib";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material';
import { NumberConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { CKEditorComponent } from '../../material/ckeditor/ck-editor.component';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
export var DEFAULT_INPUTS_O_HTML_INPUT = [
    'oattr: attr',
    'data',
    'autoBinding: automatic-binding',
    'autoRegistering: automatic-registering',
    'orequired: required',
    'minLength: min-length',
    'maxLength: max-length',
    'readOnly: read-only',
    'sqlType: sql-type'
];
export var DEFAULT_OUTPUTS_O_HTML_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, [
    'onFocus',
    'onBlur'
]);
var OHTMLInputComponent = (function (_super) {
    tslib_1.__extends(OHTMLInputComponent, _super);
    function OHTMLInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this._minLength = -1;
        _this._maxLength = -1;
        _this._subscriptAnimationState = '';
        _this.form = form;
        _this.elRef = elRef;
        _this._changeDetectorRef = _this.injector.get(ChangeDetectorRef);
        try {
            _this.tabGroupContainer = _this.injector.get(MatTabGroup);
            _this.tabContainer = _this.injector.get(MatTab);
        }
        catch (error) {
        }
        return _this;
    }
    OHTMLInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var self = this;
        if (this.form) {
            this.form.beforeCloseDetail.subscribe(function () { return _this.destroyCKEditor(); });
            this.form.beforeUpdateMode.subscribe(function () { return _this.destroyCKEditor(); });
        }
        if (this.tabGroupContainer) {
            this.tabGroupContainer.selectedTabChange.subscribe(function (evt) {
                self.destroyCKEditor();
                if (self.isInActiveTab()) {
                    self.ckEditor.initCKEditor(self.oattr);
                }
            });
        }
    };
    OHTMLInputComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    };
    OHTMLInputComponent.prototype.hasError = function (error) {
        var result = _super.prototype.hasError.call(this, error);
        this._subscriptAnimationState = result ? 'enter' : 'void';
        return result;
    };
    OHTMLInputComponent.prototype.isInActiveTab = function () {
        var result = !(this.tabGroupContainer && this.tabContainer);
        if (!result) {
            var self_1 = this;
            this.tabGroupContainer._tabs.forEach(function (tab, index) {
                if (tab === self_1.tabContainer) {
                    result = (self_1.tabGroupContainer.selectedIndex === index);
                }
            });
        }
        return result;
    };
    OHTMLInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
        if (this.minLength >= 0) {
            validators.push(Validators.minLength(this.minLength));
        }
        if (this.maxLength >= 0) {
            validators.push(Validators.maxLength(this.maxLength));
        }
        return validators;
    };
    OHTMLInputComponent.prototype.clearValue = function () {
        _super.prototype.clearValue.call(this);
        this.ckEditor.instance.updateElement();
        this.ckEditor.instance.setData('');
    };
    OHTMLInputComponent.prototype.destroyCKEditor = function () {
        if (this.ckEditor) {
            this.ckEditor.destroyCKEditor();
        }
    };
    OHTMLInputComponent.prototype.getCKEditor = function () {
        return this.ckEditor.instance;
    };
    Object.defineProperty(OHTMLInputComponent.prototype, "minLength", {
        get: function () {
            return this._minLength;
        },
        set: function (val) {
            var old = this._minLength;
            this._minLength = NumberConverter(val);
            if (val !== old) {
                this.updateValidators();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OHTMLInputComponent.prototype, "maxLength", {
        get: function () {
            return this._maxLength;
        },
        set: function (val) {
            var old = this._maxLength;
            this._maxLength = NumberConverter(val);
            if (val !== old) {
                this.updateValidators();
            }
        },
        enumerable: true,
        configurable: true
    });
    OHTMLInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-html-input',
                    template: "<div [formGroup]=\"getFormGroup()\" class=\"mat-form-field mat-form-field\" fxFill>\n  <div class=\"mat-form-field-wrapper mat-form-field-wrapper\">\n    <ck-editor #ckEditor [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" \n    (change)=\"onChangeEvent($event)\"  [required]=\"isRequired\" [readonly]=\"isReadOnly\" class=\"mat-form-field-flex mat-form-field-flex\" fxFill></ck-editor>\n    <div class=\"mat-form-field-subscript-wrapper mat-form-field-subscript-wrapper\">\n      <div class=\"ng-trigger ng-trigger-transitionMessages\" [@transitionMessages]=\"_subscriptAnimationState\">\n        <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n        <mat-error *ngIf=\"hasError('minlength')\" text=\"{{ 'FORM_VALIDATION.MIN_LENGTH' | oTranslate }}: {{\n          getErrorValue('minlength', 'requiredLength') }}\"></mat-error>\n        <mat-error *ngIf=\"hasError('maxlength')\" text=\"{{ 'FORM_VALIDATION.MAX_LENGTH' | oTranslate }}: {{\n          getErrorValue('maxlength', 'requiredLength') }}\"></mat-error>\n        <mat-error *ngFor=\"let oError of getActiveOErrors()\"> {{ oError.text | oTranslate }} \"></mat-error>\n      </div>\n    </div>\n  </div>\n</div>",
                    inputs: DEFAULT_INPUTS_O_HTML_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_HTML_INPUT,
                    animations: [
                        trigger('transitionMessages', [
                            state('enter', style({ opacity: 1, transform: 'translateY(0%)' })),
                            transition('void => enter', [
                                style({ opacity: 0, transform: 'translateY(-100%)' }),
                                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
                            ]),
                        ])
                    ],
                    styles: [".mat-form-field-wrapper{position:relative}.mat-form-field-subscript-wrapper{position:absolute;width:100%;overflow:hidden}"]
                }] }
    ];
    OHTMLInputComponent.ctorParameters = function () { return [
        { type: OFormComponent },
        { type: ElementRef },
        { type: Injector }
    ]; };
    OHTMLInputComponent.propDecorators = {
        ckEditor: [{ type: ViewChild, args: ['ckEditor', { static: false },] }]
    };
    return OHTMLInputComponent;
}(OFormDataComponent));
export { OHTMLInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1odG1sLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9odG1sLWlucHV0L28taHRtbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFpQixpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFlLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsb0NBQW9DLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUU3RyxNQUFNLENBQUMsSUFBTSwyQkFBMkIsR0FBRztJQUN6QyxhQUFhO0lBQ2IsTUFBTTtJQUNOLGdDQUFnQztJQUNoQyx3Q0FBd0M7SUFDeEMscUJBQXFCO0lBQ3JCLHVCQUF1QjtJQUN2Qix1QkFBdUI7SUFDdkIscUJBQXFCO0lBQ3JCLG1CQUFtQjtDQUNwQixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sNEJBQTRCLG9CQUNwQyxvQ0FBb0M7SUFDdkMsU0FBUztJQUNULFFBQVE7RUFDVCxDQUFDO0FBRUY7SUFnQnlDLCtDQUFrQjtJQWV6RCw2QkFDRSxJQUFvQixFQUNw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cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3RvciwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFZhbGlkYXRvckZuLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0VGFiLCBNYXRUYWJHcm91cCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgTnVtYmVyQ29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ0tFZGl0b3JDb21wb25lbnQgfSBmcm9tICcuLi8uLi9tYXRlcmlhbC9ja2VkaXRvci9jay1lZGl0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCwgT0Zvcm1EYXRhQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fSFRNTF9JTlBVVCA9IFtcbiAgJ29hdHRyOiBhdHRyJyxcbiAgJ2RhdGEnLFxuICAnYXV0b0JpbmRpbmc6IGF1dG9tYXRpYy1iaW5kaW5nJyxcbiAgJ2F1dG9SZWdpc3RlcmluZzogYXV0b21hdGljLXJlZ2lzdGVyaW5nJyxcbiAgJ29yZXF1aXJlZDogcmVxdWlyZWQnLFxuICAnbWluTGVuZ3RoOiBtaW4tbGVuZ3RoJyxcbiAgJ21heExlbmd0aDogbWF4LWxlbmd0aCcsXG4gICdyZWFkT25seTogcmVhZC1vbmx5JyxcbiAgJ3NxbFR5cGU6IHNxbC10eXBlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0hUTUxfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgJ29uRm9jdXMnLFxuICAnb25CbHVyJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1odG1sLWlucHV0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28taHRtbC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28taHRtbC1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fSFRNTF9JTlBVVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fSFRNTF9JTlBVVCxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyaWdnZXIoJ3RyYW5zaXRpb25NZXNzYWdlcycsIFtcbiAgICAgIHN0YXRlKCdlbnRlcicsIHN0eWxlKHsgb3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwJSknIH0pKSxcbiAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gZW50ZXInLCBbXG4gICAgICAgIHN0eWxlKHsgb3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtMTAwJSknIH0pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBjdWJpYy1iZXppZXIoMC41NSwgMCwgMC41NSwgMC4yKScpLFxuICAgICAgXSksXG4gICAgXSlcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPSFRNTElucHV0Q29tcG9uZW50IGV4dGVuZHMgT0Zvcm1EYXRhQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBwcm90ZWN0ZWQgX21pbkxlbmd0aDogbnVtYmVyID0gLTE7XG4gIHByb3RlY3RlZCBfbWF4TGVuZ3RoOiBudW1iZXIgPSAtMTtcblxuICBAVmlld0NoaWxkKCdja0VkaXRvcicsIHsgc3RhdGljOiBmYWxzZSB9KSBja0VkaXRvcjogQ0tFZGl0b3JDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHRhYkdyb3VwQ29udGFpbmVyOiBNYXRUYWJHcm91cDtcbiAgcHJvdGVjdGVkIHRhYkNvbnRhaW5lcjogTWF0VGFiO1xuXG4gIC8qKiBTdGF0ZSBvZiB0aGUgbWF0LWhpbnQgYW5kIG1hdC1lcnJvciBhbmltYXRpb25zLiAqL1xuICBfc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGU6IHN0cmluZyA9ICcnO1xuXG4gIHByb3RlY3RlZCBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgdGhpcy5lbFJlZiA9IGVsUmVmO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmID0gdGhpcy5pbmplY3Rvci5nZXQoQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnRhYkdyb3VwQ29udGFpbmVyID0gdGhpcy5pbmplY3Rvci5nZXQoTWF0VGFiR3JvdXApO1xuICAgICAgdGhpcy50YWJDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRUYWIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBEbyBub3RoaW5nIGR1ZSB0byBub3QgYWx3YXlzIGlzIGNvbnRhaW5lZCBvbiB0YWIuXG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICB0aGlzLmZvcm0uYmVmb3JlQ2xvc2VEZXRhaWwuc3Vic2NyaWJlKCgpID0+IHRoaXMuZGVzdHJveUNLRWRpdG9yKCkpO1xuICAgICAgdGhpcy5mb3JtLmJlZm9yZVVwZGF0ZU1vZGUuc3Vic2NyaWJlKCgpID0+IHRoaXMuZGVzdHJveUNLRWRpdG9yKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRhYkdyb3VwQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnRhYkdyb3VwQ29udGFpbmVyLnNlbGVjdGVkVGFiQ2hhbmdlLnN1YnNjcmliZSgoZXZ0OiBhbnkpID0+IHtcbiAgICAgICAgc2VsZi5kZXN0cm95Q0tFZGl0b3IoKTtcbiAgICAgICAgaWYgKHNlbGYuaXNJbkFjdGl2ZVRhYigpKSB7XG4gICAgICAgICAgc2VsZi5ja0VkaXRvci5pbml0Q0tFZGl0b3Ioc2VsZi5vYXR0cik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAvLyBBdm9pZCBhbmltYXRpb25zIG9uIGxvYWQuXG4gICAgdGhpcy5fc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG5cbiAgaGFzRXJyb3IoZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmhhc0Vycm9yKGVycm9yKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZSA9IHJlc3VsdCA/ICdlbnRlcicgOiAndm9pZCc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlzSW5BY3RpdmVUYWIoKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9ICEodGhpcy50YWJHcm91cENvbnRhaW5lciAmJiB0aGlzLnRhYkNvbnRhaW5lcik7XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy50YWJHcm91cENvbnRhaW5lci5fdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0YWIgPT09IHNlbGYudGFiQ29udGFpbmVyKSB7XG4gICAgICAgICAgcmVzdWx0ID0gKHNlbGYudGFiR3JvdXBDb250YWluZXIuc2VsZWN0ZWRJbmRleCA9PT0gaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmICh0aGlzLm1pbkxlbmd0aCA+PSAwKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2goVmFsaWRhdG9ycy5taW5MZW5ndGgodGhpcy5taW5MZW5ndGgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF4TGVuZ3RoID49IDApIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLm1heExlbmd0aCh0aGlzLm1heExlbmd0aCkpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbiAgfVxuXG4gIGNsZWFyVmFsdWUoKTogdm9pZCB7XG4gICAgc3VwZXIuY2xlYXJWYWx1ZSgpO1xuICAgIHRoaXMuY2tFZGl0b3IuaW5zdGFuY2UudXBkYXRlRWxlbWVudCgpO1xuICAgIHRoaXMuY2tFZGl0b3IuaW5zdGFuY2Uuc2V0RGF0YSgnJyk7XG4gIH1cblxuICBkZXN0cm95Q0tFZGl0b3IoKSB7XG4gICAgaWYgKHRoaXMuY2tFZGl0b3IpIHtcbiAgICAgIHRoaXMuY2tFZGl0b3IuZGVzdHJveUNLRWRpdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q0tFZGl0b3IoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ja0VkaXRvci5pbnN0YW5jZTtcbiAgfVxuXG4gIHNldCBtaW5MZW5ndGgodmFsOiBudW1iZXIpIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLl9taW5MZW5ndGg7XG4gICAgdGhpcy5fbWluTGVuZ3RoID0gTnVtYmVyQ29udmVydGVyKHZhbCk7XG4gICAgaWYgKHZhbCAhPT0gb2xkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbWluTGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkxlbmd0aDtcbiAgfVxuXG4gIHNldCBtYXhMZW5ndGgodmFsOiBudW1iZXIpIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLl9tYXhMZW5ndGg7XG4gICAgdGhpcy5fbWF4TGVuZ3RoID0gTnVtYmVyQ29udmVydGVyKHZhbCk7XG4gICAgaWYgKHZhbCAhPT0gb2xkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbWF4TGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heExlbmd0aDtcbiAgfVxufVxuIl19