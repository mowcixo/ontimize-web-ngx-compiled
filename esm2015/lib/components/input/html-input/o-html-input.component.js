import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, Injector, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material';
import { NumberConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import { CKEditorComponent } from '../../material/ckeditor/ck-editor.component';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
export const DEFAULT_INPUTS_O_HTML_INPUT = [
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
export const DEFAULT_OUTPUTS_O_HTML_INPUT = [
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
    'onFocus',
    'onBlur'
];
export class OHTMLInputComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this._minLength = -1;
        this._maxLength = -1;
        this._subscriptAnimationState = '';
        this.form = form;
        this.elRef = elRef;
        this._changeDetectorRef = this.injector.get(ChangeDetectorRef);
        try {
            this.tabGroupContainer = this.injector.get(MatTabGroup);
            this.tabContainer = this.injector.get(MatTab);
        }
        catch (error) {
        }
    }
    ngOnInit() {
        super.ngOnInit();
        const self = this;
        if (this.form) {
            this.form.beforeCloseDetail.subscribe(() => this.destroyCKEditor());
            this.form.beforeUpdateMode.subscribe(() => this.destroyCKEditor());
        }
        if (this.tabGroupContainer) {
            this.tabGroupContainer.selectedTabChange.subscribe((evt) => {
                self.destroyCKEditor();
                if (self.isInActiveTab()) {
                    self.ckEditor.initCKEditor(self.oattr);
                }
            });
        }
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        this._subscriptAnimationState = 'enter';
        this._changeDetectorRef.detectChanges();
    }
    hasError(error) {
        const result = super.hasError(error);
        this._subscriptAnimationState = result ? 'enter' : 'void';
        return result;
    }
    isInActiveTab() {
        let result = !(this.tabGroupContainer && this.tabContainer);
        if (!result) {
            const self = this;
            this.tabGroupContainer._tabs.forEach((tab, index) => {
                if (tab === self.tabContainer) {
                    result = (self.tabGroupContainer.selectedIndex === index);
                }
            });
        }
        return result;
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (this.minLength >= 0) {
            validators.push(Validators.minLength(this.minLength));
        }
        if (this.maxLength >= 0) {
            validators.push(Validators.maxLength(this.maxLength));
        }
        return validators;
    }
    clearValue() {
        super.clearValue();
        this.ckEditor.instance.updateElement();
        this.ckEditor.instance.setData('');
    }
    destroyCKEditor() {
        if (this.ckEditor) {
            this.ckEditor.destroyCKEditor();
        }
    }
    getCKEditor() {
        return this.ckEditor.instance;
    }
    set minLength(val) {
        const old = this._minLength;
        this._minLength = NumberConverter(val);
        if (val !== old) {
            this.updateValidators();
        }
    }
    get minLength() {
        return this._minLength;
    }
    set maxLength(val) {
        const old = this._maxLength;
        this._maxLength = NumberConverter(val);
        if (val !== old) {
            this.updateValidators();
        }
    }
    get maxLength() {
        return this._maxLength;
    }
}
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
OHTMLInputComponent.ctorParameters = () => [
    { type: OFormComponent },
    { type: ElementRef },
    { type: Injector }
];
OHTMLInputComponent.propDecorators = {
    ckEditor: [{ type: ViewChild, args: ['ckEditor', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1odG1sLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9odG1sLWlucHV0L28taHRtbC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQWlCLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNySCxPQUFPLEVBQWUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekQsT0FBTyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDdEUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxvQ0FBb0MsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBRTdHLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFHO0lBQ3pDLGFBQWE7SUFDYixNQUFNO0lBQ04sZ0NBQWdDO0lBQ2hDLHdDQUF3QztJQUN4QyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtJQUN2QixxQkFBcUI7SUFDckIsbUJBQW1CO0NBQ3BCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw0QkFBNEIsR0FBRztJQUMxQyxHQUFHLG9DQUFvQztJQUN2QyxTQUFTO0lBQ1QsUUFBUTtDQUNULENBQUM7QUFrQkYsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGtCQUFr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LENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLEdBQVc7UUFDdkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7WUFDZixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQzs7O1lBOUlGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsMHlDQUE0QztnQkFFNUMsTUFBTSxFQUFFLDJCQUEyQjtnQkFDbkMsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsVUFBVSxFQUFFO29CQUNWLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRTt3QkFDNUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7d0JBQ2xFLFVBQVUsQ0FBQyxlQUFlLEVBQUU7NEJBQzFCLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixFQUFFLENBQUM7NEJBQ3JELE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQzt5QkFDbEQsQ0FBQztxQkFDSCxDQUFDO2lCQUNIOzthQUNGOzs7WUFyQ1EsY0FBYztZQUwrQixVQUFVO1lBQUUsUUFBUTs7O3VCQWdEdkUsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdG9yLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXRUYWIsIE1hdFRhYkdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDS0VkaXRvckNvbXBvbmVudCB9IGZyb20gJy4uLy4uL21hdGVyaWFsL2NrZWRpdG9yL2NrLWVkaXRvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULCBPRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLWZvcm0tZGF0YS1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19IVE1MX0lOUFVUID0gW1xuICAnb2F0dHI6IGF0dHInLFxuICAnZGF0YScsXG4gICdhdXRvQmluZGluZzogYXV0b21hdGljLWJpbmRpbmcnLFxuICAnYXV0b1JlZ2lzdGVyaW5nOiBhdXRvbWF0aWMtcmVnaXN0ZXJpbmcnLFxuICAnb3JlcXVpcmVkOiByZXF1aXJlZCcsXG4gICdtaW5MZW5ndGg6IG1pbi1sZW5ndGgnLFxuICAnbWF4TGVuZ3RoOiBtYXgtbGVuZ3RoJyxcbiAgJ3JlYWRPbmx5OiByZWFkLW9ubHknLFxuICAnc3FsVHlwZTogc3FsLXR5cGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fSFRNTF9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnb25Gb2N1cycsXG4gICdvbkJsdXInXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWh0bWwtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1odG1sLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1odG1sLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19IVE1MX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19IVE1MX0lOUFVULFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcigndHJhbnNpdGlvbk1lc3NhZ2VzJywgW1xuICAgICAgc3RhdGUoJ2VudGVyJywgc3R5bGUoeyBvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDAlKScgfSkpLFxuICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiBlbnRlcicsIFtcbiAgICAgICAgc3R5bGUoeyBvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0xMDAlKScgfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGN1YmljLWJlemllcigwLjU1LCAwLCAwLjU1LCAwLjIpJyksXG4gICAgICBdKSxcbiAgICBdKVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE9IVE1MSW5wdXRDb21wb25lbnQgZXh0ZW5kcyBPRm9ybURhdGFDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xuXG4gIHByb3RlY3RlZCBfbWluTGVuZ3RoOiBudW1iZXIgPSAtMTtcbiAgcHJvdGVjdGVkIF9tYXhMZW5ndGg6IG51bWJlciA9IC0xO1xuXG4gIEBWaWV3Q2hpbGQoJ2NrRWRpdG9yJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNrRWRpdG9yOiBDS0VkaXRvckNvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgdGFiR3JvdXBDb250YWluZXI6IE1hdFRhYkdyb3VwO1xuICBwcm90ZWN0ZWQgdGFiQ29udGFpbmVyOiBNYXRUYWI7XG5cbiAgLyoqIFN0YXRlIG9mIHRoZSBtYXQtaGludCBhbmQgbWF0LWVycm9yIGFuaW1hdGlvbnMuICovXG4gIF9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZTogc3RyaW5nID0gJyc7XG5cbiAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICB0aGlzLmVsUmVmID0gZWxSZWY7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMudGFiR3JvdXBDb250YWluZXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRUYWJHcm91cCk7XG4gICAgICB0aGlzLnRhYkNvbnRhaW5lciA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdFRhYik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIERvIG5vdGhpbmcgZHVlIHRvIG5vdCBhbHdheXMgaXMgY29udGFpbmVkIG9uIHRhYi5cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgIHRoaXMuZm9ybS5iZWZvcmVDbG9zZURldGFpbC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5kZXN0cm95Q0tFZGl0b3IoKSk7XG4gICAgICB0aGlzLmZvcm0uYmVmb3JlVXBkYXRlTW9kZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5kZXN0cm95Q0tFZGl0b3IoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGFiR3JvdXBDb250YWluZXIpIHtcbiAgICAgIHRoaXMudGFiR3JvdXBDb250YWluZXIuc2VsZWN0ZWRUYWJDaGFuZ2Uuc3Vic2NyaWJlKChldnQ6IGFueSkgPT4ge1xuICAgICAgICBzZWxmLmRlc3Ryb3lDS0VkaXRvcigpO1xuICAgICAgICBpZiAoc2VsZi5pc0luQWN0aXZlVGFiKCkpIHtcbiAgICAgICAgICBzZWxmLmNrRWRpdG9yLmluaXRDS0VkaXRvcihzZWxmLm9hdHRyKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIC8vIEF2b2lkIGFuaW1hdGlvbnMgb24gbG9hZC5cbiAgICB0aGlzLl9zdWJzY3JpcHRBbmltYXRpb25TdGF0ZSA9ICdlbnRlcic7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cblxuICBoYXNFcnJvcihlcnJvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaGFzRXJyb3IoZXJyb3IpO1xuICAgIHRoaXMuX3N1YnNjcmlwdEFuaW1hdGlvblN0YXRlID0gcmVzdWx0ID8gJ2VudGVyJyA6ICd2b2lkJztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaXNJbkFjdGl2ZVRhYigpOiBib29sZWFuIHtcbiAgICBsZXQgcmVzdWx0OiBib29sZWFuID0gISh0aGlzLnRhYkdyb3VwQ29udGFpbmVyICYmIHRoaXMudGFiQ29udGFpbmVyKTtcbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnRhYkdyb3VwQ29udGFpbmVyLl90YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHRhYiA9PT0gc2VsZi50YWJDb250YWluZXIpIHtcbiAgICAgICAgICByZXN1bHQgPSAoc2VsZi50YWJHcm91cENvbnRhaW5lci5zZWxlY3RlZEluZGV4ID09PSBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcmVzb2x2ZVZhbGlkYXRvcnMoKTogVmFsaWRhdG9yRm5bXSB7XG4gICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHN1cGVyLnJlc29sdmVWYWxpZGF0b3JzKCk7XG4gICAgaWYgKHRoaXMubWluTGVuZ3RoID49IDApIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLm1pbkxlbmd0aCh0aGlzLm1pbkxlbmd0aCkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tYXhMZW5ndGggPj0gMCkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKFZhbGlkYXRvcnMubWF4TGVuZ3RoKHRoaXMubWF4TGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgY2xlYXJWYWx1ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5jbGVhclZhbHVlKCk7XG4gICAgdGhpcy5ja0VkaXRvci5pbnN0YW5jZS51cGRhdGVFbGVtZW50KCk7XG4gICAgdGhpcy5ja0VkaXRvci5pbnN0YW5jZS5zZXREYXRhKCcnKTtcbiAgfVxuXG4gIGRlc3Ryb3lDS0VkaXRvcigpIHtcbiAgICBpZiAodGhpcy5ja0VkaXRvcikge1xuICAgICAgdGhpcy5ja0VkaXRvci5kZXN0cm95Q0tFZGl0b3IoKTtcbiAgICB9XG4gIH1cblxuICBnZXRDS0VkaXRvcigpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmNrRWRpdG9yLmluc3RhbmNlO1xuICB9XG5cbiAgc2V0IG1pbkxlbmd0aCh2YWw6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZCA9IHRoaXMuX21pbkxlbmd0aDtcbiAgICB0aGlzLl9taW5MZW5ndGggPSBOdW1iZXJDb252ZXJ0ZXIodmFsKTtcbiAgICBpZiAodmFsICE9PSBvbGQpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsaWRhdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBtaW5MZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWluTGVuZ3RoO1xuICB9XG5cbiAgc2V0IG1heExlbmd0aCh2YWw6IG51bWJlcikge1xuICAgIGNvbnN0IG9sZCA9IHRoaXMuX21heExlbmd0aDtcbiAgICB0aGlzLl9tYXhMZW5ndGggPSBOdW1iZXJDb252ZXJ0ZXIodmFsKTtcbiAgICBpZiAodmFsICE9PSBvbGQpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsaWRhdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBtYXhMZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4TGVuZ3RoO1xuICB9XG59XG4iXX0=