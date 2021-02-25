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
        _super.prototype.ngOnInit.call(this);
        var self = this;
        if (this.form) {
            this.form.beforeCloseDetail.subscribe(function (evt) {
                self.destroyCKEditor();
            });
            this.form.beforeGoEditMode.subscribe(function (evt) {
                self.destroyCKEditor();
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1odG1sLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9odG1sLWlucHV0L28taHRtbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFpQixpQkFBaUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckgsT0FBTyxFQUFlLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNoRixPQUFPLEVBQUUsb0NBQW9DLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUU3RyxNQUFNLENBQUMsSUFBTSwyQkFBMkIsR0FBRztJQUN6QyxhQUFhO0lBQ2IsTUFBTTtJQUNOLGdDQUFnQztJQUNoQyx3Q0FBd0M7SUFDeEMscUJBQXFCO0lBQ3JCLHVCQUF1QjtJQUN2Qix1QkFBdUI7SUFDdkIscUJBQXFCO0lBQ3JCLG1CQUFtQjtDQUNwQixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sNEJBQTRCLG9CQUNwQyxvQ0FBb0M7SUFDdkMsU0FBUztJQUNULFFBQVE7RUFDVCxDQUFDO0FBRUY7SUFnQnlDLCtDQUFrQjtJQWV6RCw2QkFDRSxJQUFvQixFQUNw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c3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRUYWIsIE1hdFRhYkdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDS0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL21hdGVyaWFsL2NrZWRpdG9yL2NrLWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULCBPRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19IVE1MX0lOUFVUID0gW1xuICAnb2F0dHI6IGF0dHInLFxuICAnZGF0YScsXG4gICdhdXRvQmluZGluZzogYXV0b21hdGljLWJpbmRpbmcnLFxuICAnYXV0b1JlZ2lzdGVyaW5nOiBhdXRvbWF0aWMtcmVnaXN0ZXJpbmcnLFxuICAnb3JlcXVpcmVkOiByZXF1aXJlZCcsXG4gICdtaW5MZW5ndGg6IG1pbi1sZW5ndGgnLFxuICAnbWF4TGVuZ3RoOiBtYXgtbGVuZ3RoJyxcbiAgJ3JlYWRPbmx5OiByZWFkLW9ubHknLFxuICAnc3FsVHlwZTogc3FsLXR5cGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fSFRNTF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnb25Gb2N1cycsXG4gICdvbkJsdXInXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWh0bWwtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1odG1sLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1odG1sLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19IVE1MX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19IVE1MX0lOUFVULFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcigndHJhbnNpdGlvbk1lc3NhZ2VzJywgW1xuICAgICAgc3RhdGUoJ2VudGVyJywgc3R5bGUoeyBvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDAlKScgfSkpLFxuICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiBlbnRlcicsIFtcbiAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0xMDAlKScgfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGN1YmljLWJlemllcigwLjU1LCAwLCAwLjU1LCAwLjIpJyksXG4gICAgICBdKSxcbiAgICBdKVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE9IVE1MSW5wdXRDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuXG4gIHByb3RlY3RlZCBfbWluTGVuZ3RoOiBudW1iZXIgPSAtMTtcbiAgcHJvdGVjdGVkIF9tYXhMZW5ndGg6IG51bWJlciA9IC0xO1xuXG4gIEBWaWV3Q2hpbGQoJ2NrRWRpdG9yJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNrRWRpdG9yOiBDS0VkaXRvckNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgdGFiR3JvdXBDb250YWluZXI6IE1hdFRhYkdyb3VwO1xuICBwcm90ZWN0ZWQgdGFiQ29udGFpbmVyOiBNYXRUYWI7XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBtYXQtaGludCBhbmQgbWF0LWVycm9yIGFuaW1hdGlvbnMuICovXG4gIF9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZTogc3RyaW5nID0gJyc7XG5cbiAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICB0aGlzLmVsUmVmID0gZWxSZWY7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGFiR3JvdXBDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRUYWJHcm91cCk7XG4gICAgICB0aGlzLnRhYkNvbnRhaW5lciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdFRhYik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIERvIG5vdGhpbmcgZHVlIHRvIG5vdCBhbHdheXMgaXMgY29udGFpbmVkIG9uIHRhYi5cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgIHRoaXMuZm9ybS5iZWZvcmVDbG9zZURldGFpbC5zdWJzY3JpYmUoKGV2dDogYW55KSA9PiB7XG4gICAgICAgIHNlbGYuZGVzdHJveUNLRWRpdG9yKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZm9ybS5iZWZvcmVHb0VkaXRNb2RlLnN1YnNjcmliZSgoZXZ0OiBhbnkpID0+IHtcbiAgICAgICAgc2VsZi5kZXN0cm95Q0tFZGl0b3IoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRhYkdyb3VwQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLnRhYkdyb3VwQ29udGFpbmVyLnNlbGVjdGVkVGFiQ2hhbmdlLnN1YnNjcmliZSgoZXZ0OiBhbnkpID0+IHtcbiAgICAgICAgc2VsZi5kZXN0cm95Q0tFZGl0b3IoKTtcbiAgICAgICAgaWYgKHNlbGYuaXNJbkFjdGl2ZVRhYigpKSB7XG4gICAgICAgICAgc2VsZi5ja0VkaXRvci5pbml0Q0tFZGl0b3Ioc2VsZi5vYXR0cik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICAvLyBBdm9pZCBhbmltYXRpb25zIG9uIGxvYWQuXG4gICAgdGhpcy5fc3Vic2NyaXB0QW5pbWF0aW9uU3RhdGUgPSAnZW50ZXInO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG5cbiAgaGFzRXJyb3IoZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmhhc0Vycm9yKGVycm9yKTtcbiAgICB0aGlzLl9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZSA9IHJlc3VsdCA/ICdlbnRlcicgOiAndm9pZCc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGlzSW5BY3RpdmVUYWIoKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9ICEodGhpcy50YWJHcm91cENvbnRhaW5lciAmJiB0aGlzLnRhYkNvbnRhaW5lcik7XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy50YWJHcm91cENvbnRhaW5lci5fdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmICh0YWIgPT09IHNlbGYudGFiQ29udGFpbmVyKSB7XG4gICAgICAgICAgcmVzdWx0ID0gKHNlbGYudGFiR3JvdXBDb250YWluZXIuc2VsZWN0ZWRJbmRleCA9PT0gaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmICh0aGlzLm1pbkxlbmd0aCA+PSAwKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2goVmFsaWRhdG9ycy5taW5MZW5ndGgodGhpcy5taW5MZW5ndGgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF4TGVuZ3RoID49IDApIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLm1heExlbmd0aCh0aGlzLm1heExlbmd0aCkpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsaWRhdG9ycztcbiAgfVxuXG4gIGNsZWFyVmFsdWUoKTogdm9pZCB7XG4gICAgc3VwZXIuY2xlYXJWYWx1ZSgpO1xuICAgIHRoaXMuY2tFZGl0b3IuaW5zdGFuY2UudXBkYXRlRWxlbWVudCgpO1xuICAgIHRoaXMuY2tFZGl0b3IuaW5zdGFuY2Uuc2V0RGF0YSgnJyk7XG4gIH1cblxuICBkZXN0cm95Q0tFZGl0b3IoKSB7XG4gICAgaWYgKHRoaXMuY2tFZGl0b3IpIHtcbiAgICAgIHRoaXMuY2tFZGl0b3IuZGVzdHJveUNLRWRpdG9yKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0Q0tFZGl0b3IoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5ja0VkaXRvci5pbnN0YW5jZTtcbiAgfVxuXG4gIHNldCBtaW5MZW5ndGgodmFsOiBudW1iZXIpIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLl9taW5MZW5ndGg7XG4gICAgdGhpcy5fbWluTGVuZ3RoID0gTnVtYmVyQ29udmVydGVyKHZhbCk7XG4gICAgaWYgKHZhbCAhPT0gb2xkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbWluTGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21pbkxlbmd0aDtcbiAgfVxuXG4gIHNldCBtYXhMZW5ndGgodmFsOiBudW1iZXIpIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLl9tYXhMZW5ndGg7XG4gICAgdGhpcy5fbWF4TGVuZ3RoID0gTnVtYmVyQ29udmVydGVyKHZhbCk7XG4gICAgaWYgKHZhbCAhPT0gb2xkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbWF4TGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heExlbmd0aDtcbiAgfVxufVxuIl19