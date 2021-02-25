import * as tslib_1 from "tslib";
import { ContentChildren, EventEmitter, HostBinding, QueryList, ViewChildren, } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatSuffix } from '@angular/material';
import { O_INPUTS_OPTIONS } from '../config/app-config';
import { BooleanConverter, InputConverter } from '../decorators/input-converter';
import { PermissionsService } from '../services/permissions/permissions.service';
import { OValidatorComponent } from '../shared/components/validation/o-validator.component';
import { O_MAT_ERROR_OPTIONS, OMatErrorComponent } from '../shared/material/o-mat-error/o-mat-error';
import { Codes } from '../util/codes';
import { PermissionsUtils } from '../util/permissions';
import { SQLTypes } from '../util/sqltypes';
import { Util } from '../util/util';
import { OFormValue } from './form/OFormValue';
import { OFormControl } from './input/o-form-control.class';
import { OBaseComponent } from './o-component.class';
import { OValueChangeEvent } from './o-value-change-event.class';
export const DEFAULT_INPUTS_O_FORM_DATA_COMPONENT = [
    'oattr: attr',
    'olabel: label',
    'floatLabel: float-label',
    'oplaceholder: placeholder',
    'tooltip',
    'tooltipPosition: tooltip-position',
    'tooltipShowDelay: tooltip-show-delay',
    'tooltipHideDelay: tooltip-hide-delay',
    'data',
    'autoBinding: automatic-binding',
    'autoRegistering: automatic-registering',
    'enabled',
    'orequired: required',
    'sqlType: sql-type',
    'width',
    'readOnly: read-only',
    'clearButton: clear-button',
    'angularValidatorsFn: validators',
    'appearance',
    'hideRequiredMarker:hide-required-marker',
    'labelVisible:label-visible'
];
export const DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT = [
    'onChange',
    'onValueChange',
    'onFocus',
    'onBlur'
];
export class OFormDataComponent extends OBaseComponent {
    constructor(form, elRef, injector) {
        super(injector);
        this.autoBinding = true;
        this.autoRegistering = true;
        this.clearButton = false;
        this.angularValidatorsFn = [];
        this.hideRequiredMarker = false;
        this.labelVisible = true;
        this.onChange = new EventEmitter();
        this.onValueChange = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.defaultValue = void 0;
        this._SQLType = SQLTypes.OTHER;
        this._defaultSQLTypeKey = 'OTHER';
        this.errorsData = [];
        this.form = form;
        this.elRef = elRef;
        this.permissionsService = this.injector.get(PermissionsService);
        try {
            this.errorOptions = this.injector.get(O_MAT_ERROR_OPTIONS) || {};
        }
        catch (e) {
            this.errorOptions = {};
        }
    }
    get hostWidth() {
        return this.width;
    }
    ngOnInit() {
        this.initialize();
    }
    ngAfterViewInit() {
        const self = this;
        if (this._matSuffixList) {
            this.setSuffixClass(this._matSuffixList.length);
            this.matSuffixSubscription = this._matSuffixList.changes.subscribe(() => {
                self.setSuffixClass(self._matSuffixList.length);
            });
        }
        if (this.validatorChildren) {
            this.validatorsSubscription = this.validatorChildren.changes.subscribe(() => {
                self.updateValidators();
            });
            if (this.validatorChildren.length > 0) {
                this.updateValidators();
            }
        }
        if (!this.enabled) {
            this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.getMutationObserverTarget(), {
                callback: this.disableFormControl.bind(this)
            });
        }
        this.addOntimizeCustomAppearanceClass();
        try {
            this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
        }
        catch (e) {
            this.oInputsOptions = {};
        }
        Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
    }
    ngOnDestroy() {
        this.destroy();
    }
    ngOnChanges(changes) {
        if (Util.isDefined(changes.angularValidatorsFn)) {
            this.updateValidators();
        }
    }
    hasEnabledPermission() {
        return this.permissions ? this.permissions.enabled : true;
    }
    hasVisiblePermission() {
        return this.permissions ? this.permissions.visible : true;
    }
    getFormGroup() {
        if (this._fGroup) {
            return this._fGroup;
        }
        let formGroup = this.form ? this.form.formGroup : undefined;
        if ((!this.hasEnabledPermission() || !this.hasVisiblePermission()) && !this._fGroup) {
            const group = {};
            group[this.oattr] = this._fControl;
            this._fGroup = new FormGroup(group);
            formGroup = this._fGroup;
        }
        return formGroup;
    }
    getFormControl() {
        return this._fControl;
    }
    hasError(error) {
        return !this.isReadOnly && this._fControl && this._fControl.touched && this._fControl.hasError(error);
    }
    getErrorValue(error, prop) {
        return this._fControl && this._fControl.hasError(error) ? this._fControl.getError(error)[prop] || '' : '';
    }
    getActiveOErrors() {
        return this.errorsData.filter((item) => this.hasError(item.name));
    }
    initialize() {
        super.initialize();
        this.getControl();
        this.parsePermissions();
        if (!Util.isDefined(this.permissions)) {
            if (this.form) {
                this.registerFormListeners();
                this.isReadOnly = !(this.form.isInUpdateMode() || this.form.isInInsertMode() || this.form.isEditableDetail());
            }
            else {
                this.isReadOnly = !this.enabled;
            }
        }
    }
    destroy() {
        this.unregisterFormListeners();
        if (this.matSuffixSubscription) {
            this.matSuffixSubscription.unsubscribe();
        }
        if (this.validatorsSubscription) {
            this.validatorsSubscription.unsubscribe();
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        if (this._fControlSubscription) {
            this._fControlSubscription.unsubscribe();
        }
    }
    registerFormListeners() {
        if (this.form) {
            this.form.registerFormComponent(this);
            this.form.registerFormControlComponent(this);
            this.form.registerSQLTypeFormComponent(this);
        }
    }
    unregisterFormListeners() {
        if (this.form) {
            this.form.unregisterFormComponent(this);
            this.form.unregisterFormControlComponent(this);
            this.form.unregisterSQLTypeFormComponent(this);
        }
    }
    set data(value) {
        this.setData(value);
    }
    setData(newValue) {
        const previousValue = this.oldValue;
        this.setFormValue(newValue);
        this.emitOnValueChange(OValueChangeEvent.PROGRAMMATIC_CHANGE, newValue, previousValue);
    }
    isAutomaticBinding() {
        return this.autoBinding;
    }
    isAutomaticRegistering() {
        return this.autoRegistering;
    }
    getValue() {
        if (this.value instanceof OFormValue) {
            if (this.value.value !== undefined) {
                return this.value.value;
            }
        }
        return this.defaultValue;
    }
    setValue(val, options = {}, setDirty = false) {
        if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
            return;
        }
        if (this.oldValue !== val) {
            const newValue = val;
            const previousValue = this.oldValue;
            this.setFormValue(val, options, setDirty);
            if (options && options.emitModelToViewValueChange !== false) {
                const changeType = (options.hasOwnProperty('changeType')) ? options.changeType : OValueChangeEvent.PROGRAMMATIC_CHANGE;
                this.emitOnValueChange(changeType, newValue, previousValue);
            }
        }
    }
    clearValue(options, setDirty = false) {
        if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
            return;
        }
        this.setValue(void 0, options, setDirty);
    }
    onClickClearValue(event) {
        event.stopPropagation();
        event.preventDefault();
        this.clearValue({ changeType: OValueChangeEvent.USER_CHANGE }, true);
    }
    onChangeEvent(arg) {
        const value = this.getValue();
        if (this.oldValue !== value) {
            const previousValue = this.oldValue;
            this.oldValue = value;
            this.emitOnValueChange(OValueChangeEvent.USER_CHANGE, value, previousValue);
        }
    }
    get showClearButton() {
        return this.clearButton && !this.isReadOnly && this.enabled && this.getValue();
    }
    onFormControlChange(value) {
        if (!this.value) {
            this.value = new OFormValue();
        }
        this.ensureOFormValue(value);
        this.onChange.emit(value);
    }
    ensureOFormValue(arg) {
        if (arg instanceof OFormValue) {
            this.value = arg;
        }
        else if (Util.isDefined(arg) && !(arg instanceof OFormValue)) {
            const val = this.value || new OFormValue();
            val.value = arg;
            this.value = val;
        }
        else {
            this.value = new OFormValue(this.defaultValue);
        }
    }
    createFormControl(cfg, validators) {
        return new OFormControl(cfg, {
            validators: validators
        }, null);
    }
    getControl() {
        if (!this._fControl) {
            const validators = this.resolveValidators();
            const cfg = {
                value: this.value ? this.value.value : undefined,
                disabled: !this.enabled
            };
            this._fControl = this.createFormControl(cfg, validators);
            this.registerOnFormControlChange();
        }
        return this._fControl;
    }
    resolveValidators() {
        const validators = [];
        this.angularValidatorsFn.forEach((fn) => {
            validators.push(fn);
        });
        if (this.orequired) {
            validators.push(Validators.required);
        }
        return validators;
    }
    getSQLType() {
        const sqlt = this.sqlType && this.sqlType.length > 0 ? this.sqlType : this._defaultSQLTypeKey;
        this._SQLType = SQLTypes.getSQLTypeValue(sqlt);
        return this._SQLType;
    }
    get isValid() {
        if (this._fControl) {
            return this._fControl.valid;
        }
        return false;
    }
    isEmpty() {
        if (this.value instanceof OFormValue) {
            if (this.value.value !== undefined) {
                return false;
            }
        }
        return true;
    }
    setEnabled(value) {
        super.setEnabled(value);
        if (this.hasVisiblePermission()) {
            if (this._fControl && value) {
                this._fControl.enable();
            }
            else if (this._fControl) {
                this._fControl.disable();
            }
        }
    }
    get elementRef() {
        return this.elRef;
    }
    get hasCustomWidth() {
        return this.width !== undefined;
    }
    get orequired() {
        return this._orequired;
    }
    set orequired(val) {
        const old = this._orequired;
        this._orequired = BooleanConverter(val);
        if (val !== old) {
            this.updateValidators();
        }
    }
    innerOnFocus(event) {
        if (!this.isReadOnly && this.enabled) {
            this.onFocus.emit(event);
        }
    }
    innerOnBlur(event) {
        if (!this.isReadOnly && this.enabled) {
            this.onBlur.emit(event);
        }
    }
    get appearance() {
        return this._appearance;
    }
    set appearance(value) {
        const values = ['legacy', 'standard', 'fill', 'outline'];
        if (values.indexOf(value) === -1) {
            value = undefined;
        }
        this._appearance = value;
    }
    get floatLabel() {
        if (!this.labelVisible) {
            this.floatLabel = 'never';
        }
        return this._floatLabel;
    }
    set floatLabel(value) {
        const values = ['always', 'never', 'auto'];
        if (values.indexOf(value) === -1) {
            value = 'auto';
        }
        this._floatLabel = value;
    }
    registerOnFormControlChange() {
        const self = this;
        if (this._fControl) {
            this._fControlSubscription = this._fControl.valueChanges.subscribe(value => {
                self.onFormControlChange(value);
            });
        }
    }
    emitOnValueChange(type, newValue, oldValue) {
        const event = new OValueChangeEvent(type, newValue, oldValue, this);
        this.onValueChange.emit(event);
    }
    setFormValue(val, options, setDirty = false) {
        this.ensureOFormValue(val);
        if (this._fControl) {
            this._fControl.setValue(this.value.value, options);
            if (setDirty) {
                this._fControl.markAsDirty();
            }
            if (this._fControl.invalid && !this.form.isInInsertMode()) {
                this._fControl.markAsTouched();
            }
        }
        this.oldValue = this.value.value;
    }
    updateValidators() {
        if (!this._fControl) {
            return;
        }
        const self = this;
        this._fControl.clearValidators();
        this.errorsData = [];
        const validators = this.resolveValidators();
        if (this.validatorChildren) {
            this.validatorChildren.forEach((oValidator) => {
                const validatorFunction = oValidator.getValidatorFn();
                if (validatorFunction) {
                    validators.push(validatorFunction);
                }
                const errorsData = oValidator.getErrorsData();
                self.errorsData.push(...errorsData);
            });
        }
        this._fControl.setValidators(validators);
    }
    addOntimizeCustomAppearanceClass() {
        try {
            if (this.elRef) {
                const matFormFieldEl = this.elRef.nativeElement.getElementsByTagName('mat-form-field');
                if (matFormFieldEl && matFormFieldEl.length === 1) {
                    matFormFieldEl.item(0).classList.add('mat-form-field-appearance-ontimize');
                }
            }
        }
        catch (e) {
        }
    }
    getTooltipClass() {
        const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
        if (!liteError) {
            return super.getTooltipClass();
        }
        const errorClass = Util.isDefined(this._fControl.errors) ? 'o-mat-error' : '';
        return `${super.getTooltipClass()} ${errorClass}`;
    }
    getTooltipText() {
        const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
        if (liteError && Util.isDefined(this._fControl.errors) && this.oMatErrorChildren && this.oMatErrorChildren.length > 0) {
            let result = '';
            this.oMatErrorChildren.forEach((oMatError) => {
                result += `${oMatError.text}\n`;
            });
            return result;
        }
        return super.getTooltipText();
    }
    parsePermissions() {
        if (!this.form || !Util.isDefined(this.form.oattr)) {
            return;
        }
        const permissions = this.form.getFormComponentPermissions(this.oattr);
        if (!Util.isDefined(permissions)) {
            return;
        }
        if (permissions.visible === false) {
            this.elRef.nativeElement.remove();
            this.destroy();
        }
        else if (permissions.enabled === false) {
            this.enabled = false;
            if (this.form) {
                this.form.registerFormComponent(this);
            }
        }
        this.permissions = permissions;
    }
    getMutationObserverTarget() {
        let result;
        try {
            result = this.elementRef.nativeElement.getElementsByTagName('input').item(0);
        }
        catch (error) {
        }
        return result;
    }
    setSuffixClass(count) {
        const iconFieldEl = this.elRef.nativeElement.getElementsByClassName('icon-field');
        if (iconFieldEl.length === 1) {
            const classList = [].slice.call(iconFieldEl[0].classList);
            classList.forEach(className => {
                if (className.startsWith('icon-field-')) {
                    iconFieldEl[0].classList.remove(className);
                }
            });
            if (count > 0) {
                const matSuffixClass = `icon-field-${count}-suffix`;
                iconFieldEl[0].classList.add(matSuffixClass);
            }
        }
    }
    disableFormControl() {
        const control = this.getFormControl();
        control.disable({
            onlySelf: true,
            emitEvent: false
        });
    }
}
OFormDataComponent.propDecorators = {
    hostWidth: [{ type: HostBinding, args: ['style.width',] }],
    _matSuffixList: [{ type: ViewChildren, args: [MatSuffix,] }],
    validatorChildren: [{ type: ContentChildren, args: [OValidatorComponent,] }],
    oMatErrorChildren: [{ type: ViewChildren, args: [OMatErrorComponent,] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormDataComponent.prototype, "autoBinding", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormDataComponent.prototype, "autoRegistering", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormDataComponent.prototype, "clearButton", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormDataComponent.prototype, "hideRequiredMarker", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFormDataComponent.prototype, "labelVisible", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLGVBQWUsRUFFZixZQUFZLEVBQ1osV0FBVyxFQUtYLFNBQVMsRUFFVCxZQUFZLEdBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFlLFNBQVMsRUFBZSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRixPQUFPLEVBQTBDLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR3RGLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUdqRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNqRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUM1RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQU1yRyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXBDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDNUQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRWpFLE1BQU0sQ0FBQyxNQUFNLG9DQUFvQyxHQUFHO0lBQ2xELGFBQWE7SUFDYixlQUFlO0lBQ2YseUJBQXlCO0lBQ3pCLDJCQUEyQjtJQUMzQixTQUFTO0lBQ1QsbUNBQW1DO0lBQ25DLHNDQUFzQztJQUN0QyxzQ0FBc0M7SUFDdEMsTUFBTTtJQUNOLGdDQUFnQztJQUNoQyx3Q0FBd0M7SUFDeEMsU0FBUztJQUNULHFCQUFxQjtJQUVyQixtQkFBbUI7SUFDbkIsT0FBTztJQUNQLHFCQUFxQjtJQUNyQiwyQkFBMkI7SUFDM0IsaUNBQWlDO0lBQ2pDLFlBQVk7SUFDWix5Q0FBeUM7SUFDekMsNEJBQTRCO0NBQzdCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxxQ0FBcUMsR0FBRztJQUNuRCxVQUFVO0lBQ1YsZUFBZTtJQUNmLFNBQVM7SUFDVCxRQUFRO0NBQ1QsQ0FBQztBQUVGLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxjQUFjO0lBOERwRCxZQUNFLElBQW9CLEVBQ3BCLEtBQWlCLEVBQ2pCLFFBQWtCO1FBRWxCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQTdEWCxnQkFBVyxHQUFZLElBQUksQ0FBQztRQUU1QixvQkFBZSxHQUFZLElBQUksQ0FBQztRQUdoQyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3Qix3QkFBbUIsR0FBa0IsRUFBRSxDQUFDO1FBRXhDLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUVwQyxpQkFBWSxHQUFZLElBQUksQ0FBQztRQUc3QixhQUFRLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDNUQsa0JBQWEsR0FBb0MsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFDdkYsWUFBTyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO1FBQzNELFdBQU0sR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQVN2RCxpQkFBWSxHQUFRLEtBQUssQ0FBQyxDQUFDO1FBQzNCLGFBQVEsR0FBVyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ2xDLHVCQUFrQixHQUFXLE9BQU8sQ0FBQztRQWVyQyxlQUFVLEdBQWdCLEVBQUUsQ0FBQztRQW9CckMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFxQixrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BGLElBQUk7WUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2xFO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFwREQsSUFDSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFtRE0sUUFBUTtRQUNiLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sZUFBZTtRQUNwQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDdEUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO2dCQUMxRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2FBQ3pCO1NBQ0Y7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEVBQUU7Z0JBQ3RHLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM3QyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDO1FBQ3hDLElBQUk7WUFDRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDM0Q7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxXQUFXO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQTZDO1FBQzlELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUMvQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFTSxvQkFBb0I7UUFDekIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzVELENBQUM7SUFFTSxvQkFBb0I7UUFDekIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzVELENBQUM7SUFFTSxZQUFZO1FBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDckI7UUFDRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDbkYsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLGNBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBYTtRQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFTSxhQUFhLENBQUMsS0FBYSxFQUFFLElBQVk7UUFDOUMsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM1RyxDQUFDO0lBRU0sZ0JBQWdCO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFlLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVNLFVBQVU7UUFDZixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFHbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQzthQUMvRztpQkFBTTtnQkFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUNqQztTQUNGO0lBQ0gsQ0FBQztJQUVNLE9BQU87UUFDWixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUM7UUFDRCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDM0M7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDcEM7UUFDRCxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUM7SUFDSCxDQUFDO0lBRU0scUJBQXFCO1FBQzFCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlDO0lBQ0gsQ0FBQztJQUVNLHVCQUF1QjtRQUM1QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoRDtJQUNILENBQUM7SUFFRCxJQUFJLElBQUksQ0FBQyxLQUFVO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVNLE9BQU8sQ0FBQyxRQUFhO1FBSTFCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTSxrQkFBa0I7UUFDdkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFTSxzQkFBc0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxJQUFJLENBQUMsS0FBSyxZQUFZLFVBQVUsRUFBRTtZQUNwQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDbEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUN6QjtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFFTSxRQUFRLENBQUMsR0FBUSxFQUFFLFVBQTRCLEVBQUUsRUFBRSxXQUFvQixLQUFLO1FBQ2pGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDOUQsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEdBQUcsRUFBRTtZQUN6QixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUM7WUFDckIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDMUMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLDBCQUEwQixLQUFLLEtBQUssRUFBRTtnQkFDM0QsTUFBTSxVQUFVLEdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDO2dCQUMvSCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQzthQUM3RDtTQUNGO0lBQ0gsQ0FBQztJQUtNLFVBQVUsQ0FBQyxPQUEwQixFQUFFLFdBQW9CLEtBQUs7UUFDckUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUM5RCxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRU0saUJBQWlCLENBQUMsS0FBWTtRQUNuQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkUsQ0FBQztJQUdNLGFBQWEsQ0FBQyxHQUFRO1FBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUFFO1lBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDN0U7SUFDSCxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakYsQ0FBQztJQUVNLG1CQUFtQixDQUFDLEtBQVU7UUFFbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEdBQVE7UUFDOUIsSUFBSSxHQUFHLFlBQVksVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLFlBQVksVUFBVSxDQUFDLEVBQUU7WUFDOUQsTUFBTSxHQUFHLEdBQWUsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ3ZELEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNoRDtJQUNILENBQUM7SUFLTSxpQkFBaUIsQ0FBQyxHQUFJLEVBQUUsVUFBVztRQUN4QyxPQUFPLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRTtZQUMzQixVQUFVLEVBQUUsVUFBVTtTQUN2QixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVNLFVBQVU7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixNQUFNLFVBQVUsR0FBa0IsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDM0QsTUFBTSxHQUFHLEdBQUc7Z0JBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUNoRCxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTzthQUN4QixDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1NBQ3BDO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFTSxpQkFBaUI7UUFDdEIsTUFBTSxVQUFVLEdBQWtCLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBZSxFQUFFLEVBQUU7WUFDbkQsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFTSxVQUFVO1FBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUM5RixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUM3QjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVNLE9BQU87UUFDWixJQUFJLElBQUksQ0FBQyxLQUFLLFlBQVksVUFBVSxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNsQyxPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxVQUFVLENBQUMsS0FBYztRQUM5QixLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUU7WUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLEtBQUssRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN6QjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDMUI7U0FDRjtJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksU0FBUyxDQUFDLEdBQVk7UUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtZQUNmLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUFVO1FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBRU0sV0FBVyxDQUFDLEtBQVU7UUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLEtBQTZCO1FBQzFDLE1BQU0sTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDekQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLEtBQUssR0FBRyxTQUFTLENBQUM7U0FDbkI7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7U0FDM0I7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksVUFBVSxDQUFDLEtBQXFCO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEMsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFUywyQkFBMkI7UUFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVE7UUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRVMsWUFBWSxDQUFDLEdBQVEsRUFBRSxPQUEwQixFQUFFLFdBQW9CLEtBQUs7UUFDcEYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNuRCxJQUFJLFFBQVEsRUFBRTtnQkFDWixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQzlCO1lBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDaEM7U0FDRjtRQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDbkMsQ0FBQztJQUVTLGdCQUFnQjtRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixPQUFPO1NBQ1I7UUFDRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBK0IsRUFBRSxFQUFFO2dCQUNqRSxNQUFNLGlCQUFpQixHQUFnQixVQUFVLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ25FLElBQUksaUJBQWlCLEVBQUU7b0JBQ3JCLFVBQVUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztpQkFDcEM7Z0JBQ0QsTUFBTSxVQUFVLEdBQWdCLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVTLGdDQUFnQztRQUN4QyxJQUFJO1lBQ0YsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNkLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3ZGLElBQUksY0FBYyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUNqRCxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztpQkFDNUU7YUFDRjtTQUNGO1FBQUMsT0FBTyxDQUFDLEVBQUU7U0FFWDtJQUNILENBQUM7SUFFUyxlQUFlO1FBQ3ZCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztRQUNwRSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDaEM7UUFDRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzlFLE9BQU8sR0FBRyxLQUFLLENBQUMsZUFBZSxFQUFFLElBQUksVUFBVSxFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVTLGNBQWM7UUFDdEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLGdCQUFnQixDQUFDO1FBQ3BFLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckgsSUFBSSxNQUFNLEdBQVcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUE2QixFQUFFLEVBQUU7Z0JBQy9ELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sTUFBTSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRVMsZ0JBQWdCO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2xELE9BQU87U0FDUjtRQUNELE1BQU0sV0FBVyxHQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLFdBQVcsQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO1lBRWpDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjthQUFNLElBQUksV0FBVyxDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUU7WUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDckIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdkM7U0FDRjtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFUyx5QkFBeUI7UUFDakMsSUFBSSxNQUFNLENBQUM7UUFDWCxJQUFJO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5RTtRQUFDLE9BQU8sS0FBSyxFQUFFO1NBRWY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRVMsY0FBYyxDQUFDLEtBQWE7UUFDcEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEYsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM1QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUN2QyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDNUM7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDYixNQUFNLGNBQWMsR0FBRyxjQUFjLEtBQUssU0FBUyxDQUFDO2dCQUNwRCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUM5QztTQUNGO0lBQ0gsQ0FBQztJQUtPLGtCQUFrQjtRQUN4QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUNkLFFBQVEsRUFBRSxJQUFJO1lBQ2QsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O3dCQXRpQkEsV0FBVyxTQUFDLGFBQWE7NkJBcUJ6QixZQUFZLFNBQUMsU0FBUztnQ0FLdEIsZUFBZSxTQUFDLG1CQUFtQjtnQ0FPbkMsWUFBWSxTQUFDLGtCQUFrQjs7QUFuRGhDO0lBREMsY0FBYyxFQUFFOzt1REFDa0I7QUFFbkM7SUFEQyxjQUFjLEVBQUU7OzJEQUNzQjtBQUd2QztJQURDLGNBQWMsRUFBRTs7dURBQ21CO0FBR3BDO0lBREMsY0FBYyxFQUFFOzs4REFDMEI7QUFFM0M7SUFEQyxjQUFjLEVBQUU7O3dEQUNtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0QmluZGluZyxcbiAgSW5qZWN0b3IsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlLFxuICBWaWV3Q2hpbGRyZW4sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBGbG9hdExhYmVsVHlwZSwgTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSwgTWF0U3VmZml4IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9fSU5QVVRTX09QVElPTlMgfSBmcm9tICcuLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBCb29sZWFuQ29udmVydGVyLCBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElGb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLWNvbXBvbmVudC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSUZvcm1EYXRhVHlwZUNvbXBvbmVudCB9IGZyb20gJy4uL2ludGVyZmFjZXMvZm9ybS1kYXRhLXR5cGUtY29tcG9uZW50LmludGVyZmFjZSc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9wZXJtaXNzaW9ucy9wZXJtaXNzaW9ucy5zZXJ2aWNlJztcbmltcG9ydCB7IE9WYWxpZGF0b3JDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvY29tcG9uZW50cy92YWxpZGF0aW9uL28tdmFsaWRhdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPX01BVF9FUlJPUl9PUFRJT05TLCBPTWF0RXJyb3JDb21wb25lbnQgfSBmcm9tICcuLi9zaGFyZWQvbWF0ZXJpYWwvby1tYXQtZXJyb3Ivby1tYXQtZXJyb3InO1xuaW1wb3J0IHsgRXJyb3JEYXRhIH0gZnJvbSAnLi4vdHlwZXMvZXJyb3ItZGF0YS50eXBlJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPSW5wdXRzT3B0aW9ucyB9IGZyb20gJy4uL3R5cGVzL28taW5wdXRzLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPTWF0RXJyb3JPcHRpb25zIH0gZnJvbSAnLi4vdHlwZXMvby1tYXQtZXJyb3IudHlwZSc7XG5pbXBvcnQgeyBPUGVybWlzc2lvbnMgfSBmcm9tICcuLi90eXBlcy9vLXBlcm1pc3Npb25zLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFBlcm1pc3Npb25zVXRpbHMgfSBmcm9tICcuLi91dGlsL3Blcm1pc3Npb25zJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4vZm9ybS9PRm9ybVZhbHVlJztcbmltcG9ydCB7IE9Gb3JtQ29udHJvbCB9IGZyb20gJy4vaW5wdXQvby1mb3JtLWNvbnRyb2wuY2xhc3MnO1xuaW1wb3J0IHsgT0Jhc2VDb21wb25lbnQgfSBmcm9tICcuL28tY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9WYWx1ZUNoYW5nZUV2ZW50IH0gZnJvbSAnLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQgPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICdvbGFiZWw6IGxhYmVsJyxcbiAgJ2Zsb2F0TGFiZWw6IGZsb2F0LWxhYmVsJyxcbiAgJ29wbGFjZWhvbGRlcjogcGxhY2Vob2xkZXInLFxuICAndG9vbHRpcCcsXG4gICd0b29sdGlwUG9zaXRpb246IHRvb2x0aXAtcG9zaXRpb24nLFxuICAndG9vbHRpcFNob3dEZWxheTogdG9vbHRpcC1zaG93LWRlbGF5JyxcbiAgJ3Rvb2x0aXBIaWRlRGVsYXk6IHRvb2x0aXAtaGlkZS1kZWxheScsXG4gICdkYXRhJyxcbiAgJ2F1dG9CaW5kaW5nOiBhdXRvbWF0aWMtYmluZGluZycsXG4gICdhdXRvUmVnaXN0ZXJpbmc6IGF1dG9tYXRpYy1yZWdpc3RlcmluZycsXG4gICdlbmFibGVkJyxcbiAgJ29yZXF1aXJlZDogcmVxdWlyZWQnLFxuICAvLyBzcWx0eXBlW3N0cmluZ106IERhdGEgdHlwZSBhY2NvcmRpbmcgdG8gSmF2YSBzdGFuZGFyZC4gU2VlIFNRTFR5cGUgbmdDbGFzcy4gRGVmYXVsdDogJ09USEVSJ1xuICAnc3FsVHlwZTogc3FsLXR5cGUnLFxuICAnd2lkdGgnLFxuICAncmVhZE9ubHk6IHJlYWQtb25seScsXG4gICdjbGVhckJ1dHRvbjogY2xlYXItYnV0dG9uJyxcbiAgJ2FuZ3VsYXJWYWxpZGF0b3JzRm46IHZhbGlkYXRvcnMnLFxuICAnYXBwZWFyYW5jZScsXG4gICdoaWRlUmVxdWlyZWRNYXJrZXI6aGlkZS1yZXF1aXJlZC1tYXJrZXInLFxuICAnbGFiZWxWaXNpYmxlOmxhYmVsLXZpc2libGUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCA9IFtcbiAgJ29uQ2hhbmdlJyxcbiAgJ29uVmFsdWVDaGFuZ2UnLFxuICAnb25Gb2N1cycsXG4gICdvbkJsdXInXG5dO1xuXG5leHBvcnQgY2xhc3MgT0Zvcm1EYXRhQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VDb21wb25lbnQgaW1wbGVtZW50cyBJRm9ybURhdGFDb21wb25lbnQsIElGb3JtRGF0YVR5cGVDb21wb25lbnQsXG4gIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuXG4gIC8qIElucHV0cyAqL1xuICBwdWJsaWMgc3FsVHlwZTogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgYXV0b0JpbmRpbmc6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgYXV0b1JlZ2lzdGVyaW5nOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHdpZHRoOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBjbGVhckJ1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgYW5ndWxhclZhbGlkYXRvcnNGbjogVmFsaWRhdG9yRm5bXSA9IFtdO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgaGlkZVJlcXVpcmVkTWFya2VyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBsYWJlbFZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qIE91dHB1dHMgKi9cbiAgcHVibGljIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICBwdWJsaWMgb25WYWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPE9WYWx1ZUNoYW5nZUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8T1ZhbHVlQ2hhbmdlRXZlbnQ+KCk7XG4gIHB1YmxpYyBvbkZvY3VzOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICBwdWJsaWMgb25CbHVyOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxuICBnZXQgaG9zdFdpZHRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gIH1cblxuICAvKiBJbnRlcm5hbCB2YXJpYWJsZXMgKi9cbiAgcHJvdGVjdGVkIHZhbHVlOiBPRm9ybVZhbHVlO1xuICBwcm90ZWN0ZWQgZGVmYXVsdFZhbHVlOiBhbnkgPSB2b2lkIDA7XG4gIHByb3RlY3RlZCBfU1FMVHlwZTogbnVtYmVyID0gU1FMVHlwZXMuT1RIRVI7XG4gIHByb3RlY3RlZCBfZGVmYXVsdFNRTFR5cGVLZXk6IHN0cmluZyA9ICdPVEhFUic7XG4gIHByb3RlY3RlZCBfZkNvbnRyb2w6IE9Gb3JtQ29udHJvbDtcbiAgcHJvdGVjdGVkIF9mQ29udHJvbFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgX2ZHcm91cDogRm9ybUdyb3VwO1xuICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWY7XG4gIHByb3RlY3RlZCBmb3JtOiBPRm9ybUNvbXBvbmVudDtcbiAgcHJvdGVjdGVkIG9sZFZhbHVlOiBhbnk7XG5cbiAgcHJvdGVjdGVkIF9mbG9hdExhYmVsOiBGbG9hdExhYmVsVHlwZTtcbiAgcHJvdGVjdGVkIF9hcHBlYXJhbmNlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xuXG4gIHByb3RlY3RlZCBtYXRTdWZmaXhTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgQFZpZXdDaGlsZHJlbihNYXRTdWZmaXgpXG4gIHByb3RlY3RlZCBfbWF0U3VmZml4TGlzdDogUXVlcnlMaXN0PE1hdFN1ZmZpeD47XG5cbiAgcHJvdGVjdGVkIGVycm9yc0RhdGE6IEVycm9yRGF0YVtdID0gW107XG4gIHByb3RlY3RlZCB2YWxpZGF0b3JzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIEBDb250ZW50Q2hpbGRyZW4oT1ZhbGlkYXRvckNvbXBvbmVudClcbiAgcHJvdGVjdGVkIHZhbGlkYXRvckNoaWxkcmVuOiBRdWVyeUxpc3Q8T1ZhbGlkYXRvckNvbXBvbmVudD47XG5cbiAgcHJvdGVjdGVkIHBlcm1pc3Npb25zU2VydmljZTogUGVybWlzc2lvbnNTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbXV0YXRpb25PYnNlcnZlcjogTXV0YXRpb25PYnNlcnZlcjtcblxuICBwcm90ZWN0ZWQgZXJyb3JPcHRpb25zOiBPTWF0RXJyb3JPcHRpb25zO1xuICBAVmlld0NoaWxkcmVuKE9NYXRFcnJvckNvbXBvbmVudClcbiAgcHJvdGVjdGVkIG9NYXRFcnJvckNoaWxkcmVuOiBRdWVyeUxpc3Q8T01hdEVycm9yQ29tcG9uZW50PjtcblxuICBwcm90ZWN0ZWQgb0lucHV0c09wdGlvbnM6IE9JbnB1dHNPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgICB0aGlzLmVsUmVmID0gZWxSZWY7XG4gICAgdGhpcy5wZXJtaXNzaW9uc1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldDxQZXJtaXNzaW9uc1NlcnZpY2U+KFBlcm1pc3Npb25zU2VydmljZSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuZXJyb3JPcHRpb25zID0gdGhpcy5pbmplY3Rvci5nZXQoT19NQVRfRVJST1JfT1BUSU9OUykgfHwge307XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5lcnJvck9wdGlvbnMgPSB7fTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLl9tYXRTdWZmaXhMaXN0KSB7XG4gICAgICB0aGlzLnNldFN1ZmZpeENsYXNzKHRoaXMuX21hdFN1ZmZpeExpc3QubGVuZ3RoKTtcbiAgICAgIHRoaXMubWF0U3VmZml4U3Vic2NyaXB0aW9uID0gdGhpcy5fbWF0U3VmZml4TGlzdC5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNlbGYuc2V0U3VmZml4Q2xhc3Moc2VsZi5fbWF0U3VmZml4TGlzdC5sZW5ndGgpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmFsaWRhdG9yQ2hpbGRyZW4pIHtcbiAgICAgIHRoaXMudmFsaWRhdG9yc1N1YnNjcmlwdGlvbiA9IHRoaXMudmFsaWRhdG9yQ2hpbGRyZW4uY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBzZWxmLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHRoaXMudmFsaWRhdG9yQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlciA9IFBlcm1pc3Npb25zVXRpbHMucmVnaXN0ZXJEaXNhYmxlZENoYW5nZXNJbkRvbSh0aGlzLmdldE11dGF0aW9uT2JzZXJ2ZXJUYXJnZXQoKSwge1xuICAgICAgICBjYWxsYmFjazogdGhpcy5kaXNhYmxlRm9ybUNvbnRyb2wuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuYWRkT250aW1pemVDdXN0b21BcHBlYXJhbmNlQ2xhc3MoKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5vSW5wdXRzT3B0aW9ucyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9fSU5QVVRTX09QVElPTlMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub0lucHV0c09wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBVdGlsLnBhcnNlT0lucHV0c09wdGlvbnModGhpcy5lbFJlZiwgdGhpcy5vSW5wdXRzT3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcE5hbWU6IHN0cmluZ106IFNpbXBsZUNoYW5nZSB9KTogdm9pZCB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNoYW5nZXMuYW5ndWxhclZhbGlkYXRvcnNGbikpIHtcbiAgICAgIHRoaXMudXBkYXRlVmFsaWRhdG9ycygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYXNFbmFibGVkUGVybWlzc2lvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wZXJtaXNzaW9ucyA/IHRoaXMucGVybWlzc2lvbnMuZW5hYmxlZCA6IHRydWU7XG4gIH1cblxuICBwdWJsaWMgaGFzVmlzaWJsZVBlcm1pc3Npb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucGVybWlzc2lvbnMgPyB0aGlzLnBlcm1pc3Npb25zLnZpc2libGUgOiB0cnVlO1xuICB9XG5cbiAgcHVibGljIGdldEZvcm1Hcm91cCgpOiBGb3JtR3JvdXAge1xuICAgIGlmICh0aGlzLl9mR3JvdXApIHtcbiAgICAgIHJldHVybiB0aGlzLl9mR3JvdXA7XG4gICAgfVxuICAgIGxldCBmb3JtR3JvdXAgPSB0aGlzLmZvcm0gPyB0aGlzLmZvcm0uZm9ybUdyb3VwIDogdW5kZWZpbmVkO1xuICAgIGlmICgoIXRoaXMuaGFzRW5hYmxlZFBlcm1pc3Npb24oKSB8fCAhdGhpcy5oYXNWaXNpYmxlUGVybWlzc2lvbigpKSAmJiAhdGhpcy5fZkdyb3VwKSB7XG4gICAgICBjb25zdCBncm91cCA9IHt9O1xuICAgICAgZ3JvdXBbdGhpcy5vYXR0cl0gPSB0aGlzLl9mQ29udHJvbDtcbiAgICAgIHRoaXMuX2ZHcm91cCA9IG5ldyBGb3JtR3JvdXAoZ3JvdXApO1xuICAgICAgZm9ybUdyb3VwID0gdGhpcy5fZkdyb3VwO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybUdyb3VwO1xuICB9XG5cbiAgcHVibGljIGdldEZvcm1Db250cm9sKCk6IEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gdGhpcy5fZkNvbnRyb2w7XG4gIH1cblxuICBwdWJsaWMgaGFzRXJyb3IoZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuX2ZDb250cm9sICYmIHRoaXMuX2ZDb250cm9sLnRvdWNoZWQgJiYgdGhpcy5fZkNvbnRyb2wuaGFzRXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgcHVibGljIGdldEVycm9yVmFsdWUoZXJyb3I6IHN0cmluZywgcHJvcDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZkNvbnRyb2wgJiYgdGhpcy5fZkNvbnRyb2wuaGFzRXJyb3IoZXJyb3IpID8gdGhpcy5fZkNvbnRyb2wuZ2V0RXJyb3IoZXJyb3IpW3Byb3BdIHx8ICcnIDogJyc7XG4gIH1cblxuICBwdWJsaWMgZ2V0QWN0aXZlT0Vycm9ycygpOiBFcnJvckRhdGFbXSB7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3JzRGF0YS5maWx0ZXIoKGl0ZW06IEVycm9yRGF0YSkgPT4gdGhpcy5oYXNFcnJvcihpdGVtLm5hbWUpKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcblxuICAgIC8vIGVuc3VyaW5nIGZvcm1Db250cm9sIGNyZWF0aW9uXG4gICAgdGhpcy5nZXRDb250cm9sKCk7XG5cbiAgICB0aGlzLnBhcnNlUGVybWlzc2lvbnMoKTtcblxuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckZvcm1MaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5pc1JlYWRPbmx5ID0gISh0aGlzLmZvcm0uaXNJblVwZGF0ZU1vZGUoKSB8fCB0aGlzLmZvcm0uaXNJbkluc2VydE1vZGUoKSB8fCB0aGlzLmZvcm0uaXNFZGl0YWJsZURldGFpbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXNSZWFkT25seSA9ICF0aGlzLmVuYWJsZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bnJlZ2lzdGVyRm9ybUxpc3RlbmVycygpO1xuICAgIGlmICh0aGlzLm1hdFN1ZmZpeFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5tYXRTdWZmaXhTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudmFsaWRhdG9yc1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy52YWxpZGF0b3JzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMubXV0YXRpb25PYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9mQ29udHJvbFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fZkNvbnRyb2xTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXJGb3JtTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgIHRoaXMuZm9ybS5yZWdpc3RlckZvcm1Db21wb25lbnQodGhpcyk7XG4gICAgICB0aGlzLmZvcm0ucmVnaXN0ZXJGb3JtQ29udHJvbENvbXBvbmVudCh0aGlzKTtcbiAgICAgIHRoaXMuZm9ybS5yZWdpc3RlclNRTFR5cGVGb3JtQ29tcG9uZW50KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1bnJlZ2lzdGVyRm9ybUxpc3RlbmVycygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICB0aGlzLmZvcm0udW5yZWdpc3RlckZvcm1Db21wb25lbnQodGhpcyk7XG4gICAgICB0aGlzLmZvcm0udW5yZWdpc3RlckZvcm1Db250cm9sQ29tcG9uZW50KHRoaXMpO1xuICAgICAgdGhpcy5mb3JtLnVucmVnaXN0ZXJTUUxUeXBlRm9ybUNvbXBvbmVudCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICBzZXQgZGF0YSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5zZXREYXRhKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXREYXRhKG5ld1ZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAvLyBlbWl0IE9WYWx1ZUNoYW5nZUV2ZW50LlBST0dSQU1NQVRJQ19DSEFOR0Ugd2hlbiBhc3NpZ24gdmFsdWUgdG8gZGF0YVxuICAgIC8vIHRoaXMgbWV0aG9kIHNraXBzIHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbnMgY2hlY2tpbmcgYmVjYXVzZSB0aGUgZm9ybSBpc1xuICAgIC8vIHNldHRpbmcgaXRzIHF1ZXJ5IHJlc3VsdCB1c2luZyBpdFxuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSB0aGlzLm9sZFZhbHVlO1xuICAgIHRoaXMuc2V0Rm9ybVZhbHVlKG5ld1ZhbHVlKTtcbiAgICB0aGlzLmVtaXRPblZhbHVlQ2hhbmdlKE9WYWx1ZUNoYW5nZUV2ZW50LlBST0dSQU1NQVRJQ19DSEFOR0UsIG5ld1ZhbHVlLCBwcmV2aW91c1ZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0F1dG9tYXRpY0JpbmRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYXV0b0JpbmRpbmc7XG4gIH1cblxuICBwdWJsaWMgaXNBdXRvbWF0aWNSZWdpc3RlcmluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5hdXRvUmVnaXN0ZXJpbmc7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWUoKTogYW55IHtcbiAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUudmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZSh2YWw6IGFueSwgb3B0aW9uczogRm9ybVZhbHVlT3B0aW9ucyA9IHt9LCBzZXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKCFQZXJtaXNzaW9uc1V0aWxzLmNoZWNrRW5hYmxlZFBlcm1pc3Npb24odGhpcy5wZXJtaXNzaW9ucykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMub2xkVmFsdWUgIT09IHZhbCkge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSB2YWw7XG4gICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gdGhpcy5vbGRWYWx1ZTtcbiAgICAgIHRoaXMuc2V0Rm9ybVZhbHVlKHZhbCwgb3B0aW9ucywgc2V0RGlydHkpO1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbWl0TW9kZWxUb1ZpZXdWYWx1ZUNoYW5nZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgY2hhbmdlVHlwZTogbnVtYmVyID0gKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2NoYW5nZVR5cGUnKSkgPyBvcHRpb25zLmNoYW5nZVR5cGUgOiBPVmFsdWVDaGFuZ2VFdmVudC5QUk9HUkFNTUFUSUNfQ0hBTkdFO1xuICAgICAgICB0aGlzLmVtaXRPblZhbHVlQ2hhbmdlKGNoYW5nZVR5cGUsIG5ld1ZhbHVlLCBwcmV2aW91c1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBjb21wb25lbnQgdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgY2xlYXJWYWx1ZShvcHRpb25zPzogRm9ybVZhbHVlT3B0aW9ucywgc2V0RGlydHk6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICghUGVybWlzc2lvbnNVdGlscy5jaGVja0VuYWJsZWRQZXJtaXNzaW9uKHRoaXMucGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc2V0VmFsdWUodm9pZCAwLCBvcHRpb25zLCBzZXREaXJ0eSk7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0NsZWFyVmFsdWUoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmNsZWFyVmFsdWUoeyBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSB9LCB0cnVlKTtcbiAgfVxuXG4gIC8qIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBpbiBvdXRwdXQgY2hhbmdlIGV2ZW50LCBub3QgZW1pdCBldmVudCBvblZhbHVlQ2hhbmdlIHdoZW4gb2xkdmFsdWUgaXMgc2FtZSB0aGFuIG5ld3ZhbHVlKi9cbiAgcHVibGljIG9uQ2hhbmdlRXZlbnQoYXJnOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICBpZiAodGhpcy5vbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSB0aGlzLm9sZFZhbHVlO1xuICAgICAgdGhpcy5vbGRWYWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5lbWl0T25WYWx1ZUNoYW5nZShPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSwgdmFsdWUsIHByZXZpb3VzVmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaG93Q2xlYXJCdXR0b24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2xlYXJCdXR0b24gJiYgIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQgJiYgdGhpcy5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgcHVibGljIG9uRm9ybUNvbnRyb2xDaGFuZ2UodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIC8vIGVxdWl2YWxlbnRlIGFsIGlubmVyT25DaGFuZ2VcbiAgICBpZiAoIXRoaXMudmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSgpO1xuICAgIH1cbiAgICB0aGlzLmVuc3VyZU9Gb3JtVmFsdWUodmFsdWUpO1xuICAgIHRoaXMub25DaGFuZ2UuZW1pdCh2YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgZW5zdXJlT0Zvcm1WYWx1ZShhcmc6IGFueSk6IHZvaWQge1xuICAgIGlmIChhcmcgaW5zdGFuY2VvZiBPRm9ybVZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gYXJnO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc0RlZmluZWQoYXJnKSAmJiAhKGFyZyBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpKSB7XG4gICAgICBjb25zdCB2YWw6IE9Gb3JtVmFsdWUgPSB0aGlzLnZhbHVlIHx8IG5ldyBPRm9ybVZhbHVlKCk7XG4gICAgICB2YWwudmFsdWUgPSBhcmc7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZhbHVlID0gbmV3IE9Gb3JtVmFsdWUodGhpcy5kZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgb3ZlcndyaXR0ZW4gaW4gdGhlIGNoaWxkIGNvbXBvbmVudCB3aGVuIGl0IGhhdmUgYWRkaWNpb25hbCBmb3JtIGNvbnRyb2wgb3Igb3RoZXIgb0Zvcm1EYXRhQ29tcG9uZW50XG4gICAqL1xuICBwdWJsaWMgY3JlYXRlRm9ybUNvbnRyb2woY2ZnPywgdmFsaWRhdG9ycz8pOiBPRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBuZXcgT0Zvcm1Db250cm9sKGNmZywge1xuICAgICAgdmFsaWRhdG9yczogdmFsaWRhdG9yc1xuICAgIH0sIG51bGwpO1xuICB9XG5cbiAgcHVibGljIGdldENvbnRyb2woKTogRm9ybUNvbnRyb2wge1xuICAgIGlmICghdGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSB0aGlzLnJlc29sdmVWYWxpZGF0b3JzKCk7XG4gICAgICBjb25zdCBjZmcgPSB7XG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlID8gdGhpcy52YWx1ZS52YWx1ZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgZGlzYWJsZWQ6ICF0aGlzLmVuYWJsZWRcbiAgICAgIH07XG4gICAgICB0aGlzLl9mQ29udHJvbCA9IHRoaXMuY3JlYXRlRm9ybUNvbnRyb2woY2ZnLCB2YWxpZGF0b3JzKTtcbiAgICAgIHRoaXMucmVnaXN0ZXJPbkZvcm1Db250cm9sQ2hhbmdlKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9mQ29udHJvbDtcbiAgfVxuXG4gIHB1YmxpYyByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gW107XG4gICAgdGhpcy5hbmd1bGFyVmFsaWRhdG9yc0ZuLmZvckVhY2goKGZuOiBWYWxpZGF0b3JGbikgPT4ge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKGZuKTtcbiAgICB9KTtcbiAgICBpZiAodGhpcy5vcmVxdWlyZWQpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBwdWJsaWMgZ2V0U1FMVHlwZSgpOiBudW1iZXIge1xuICAgIGNvbnN0IHNxbHQgPSB0aGlzLnNxbFR5cGUgJiYgdGhpcy5zcWxUeXBlLmxlbmd0aCA+IDAgPyB0aGlzLnNxbFR5cGUgOiB0aGlzLl9kZWZhdWx0U1FMVHlwZUtleTtcbiAgICB0aGlzLl9TUUxUeXBlID0gU1FMVHlwZXMuZ2V0U1FMVHlwZVZhbHVlKHNxbHQpO1xuICAgIHJldHVybiB0aGlzLl9TUUxUeXBlO1xuICB9XG5cbiAgZ2V0IGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2ZDb250cm9sKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZkNvbnRyb2wudmFsaWQ7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkge1xuICAgICAgaWYgKHRoaXMudmFsdWUudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHVibGljIHNldEVuYWJsZWQodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBzdXBlci5zZXRFbmFibGVkKHZhbHVlKTtcbiAgICBpZiAodGhpcy5oYXNWaXNpYmxlUGVybWlzc2lvbigpKSB7XG4gICAgICBpZiAodGhpcy5fZkNvbnRyb2wgJiYgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fZkNvbnRyb2wuZW5hYmxlKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2ZDb250cm9sKSB7XG4gICAgICAgIHRoaXMuX2ZDb250cm9sLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5lbFJlZjtcbiAgfVxuXG4gIGdldCBoYXNDdXN0b21XaWR0aCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IG9yZXF1aXJlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fb3JlcXVpcmVkO1xuICB9XG5cbiAgc2V0IG9yZXF1aXJlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBvbGQgPSB0aGlzLl9vcmVxdWlyZWQ7XG4gICAgdGhpcy5fb3JlcXVpcmVkID0gQm9vbGVhbkNvbnZlcnRlcih2YWwpO1xuICAgIGlmICh2YWwgIT09IG9sZCkge1xuICAgICAgdGhpcy51cGRhdGVWYWxpZGF0b3JzKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlubmVyT25Gb2N1cyhldmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLm9uRm9jdXMuZW1pdChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlubmVyT25CbHVyKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhcHBlYXJhbmNlKCk6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2Uge1xuICAgIHJldHVybiB0aGlzLl9hcHBlYXJhbmNlO1xuICB9XG5cbiAgc2V0IGFwcGVhcmFuY2UodmFsdWU6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbJ2xlZ2FjeScsICdzdGFuZGFyZCcsICdmaWxsJywgJ291dGxpbmUnXTtcbiAgICBpZiAodmFsdWVzLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBmbG9hdExhYmVsKCk6IEZsb2F0TGFiZWxUeXBlIHtcbiAgICBpZiAoIXRoaXMubGFiZWxWaXNpYmxlKSB7XG4gICAgICB0aGlzLmZsb2F0TGFiZWwgPSAnbmV2ZXInO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZmxvYXRMYWJlbDtcbiAgfVxuXG4gIHNldCBmbG9hdExhYmVsKHZhbHVlOiBGbG9hdExhYmVsVHlwZSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IFsnYWx3YXlzJywgJ25ldmVyJywgJ2F1dG8nXTtcbiAgICBpZiAodmFsdWVzLmluZGV4T2YodmFsdWUpID09PSAtMSkge1xuICAgICAgdmFsdWUgPSAnYXV0byc7XG4gICAgfVxuICAgIHRoaXMuX2Zsb2F0TGFiZWwgPSB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3Rlck9uRm9ybUNvbnRyb2xDaGFuZ2UoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKHRoaXMuX2ZDb250cm9sKSB7XG4gICAgICB0aGlzLl9mQ29udHJvbFN1YnNjcmlwdGlvbiA9IHRoaXMuX2ZDb250cm9sLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICBzZWxmLm9uRm9ybUNvbnRyb2xDaGFuZ2UodmFsdWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGVtaXRPblZhbHVlQ2hhbmdlKHR5cGUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE9WYWx1ZUNoYW5nZUV2ZW50KHR5cGUsIG5ld1ZhbHVlLCBvbGRWYWx1ZSwgdGhpcyk7XG4gICAgdGhpcy5vblZhbHVlQ2hhbmdlLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldEZvcm1WYWx1ZSh2YWw6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMsIHNldERpcnR5OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0aGlzLmVuc3VyZU9Gb3JtVmFsdWUodmFsKTtcbiAgICBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgIHRoaXMuX2ZDb250cm9sLnNldFZhbHVlKHRoaXMudmFsdWUudmFsdWUsIG9wdGlvbnMpO1xuICAgICAgaWYgKHNldERpcnR5KSB7XG4gICAgICAgIHRoaXMuX2ZDb250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fZkNvbnRyb2wuaW52YWxpZCAmJiAhdGhpcy5mb3JtLmlzSW5JbnNlcnRNb2RlKCkpIHtcbiAgICAgICAgdGhpcy5fZkNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm9sZFZhbHVlID0gdGhpcy52YWx1ZS52YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5fZkNvbnRyb2wuY2xlYXJWYWxpZGF0b3JzKCk7XG4gICAgdGhpcy5lcnJvcnNEYXRhID0gW107XG4gICAgY29uc3QgdmFsaWRhdG9ycyA9IHRoaXMucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICBpZiAodGhpcy52YWxpZGF0b3JDaGlsZHJlbikge1xuICAgICAgdGhpcy52YWxpZGF0b3JDaGlsZHJlbi5mb3JFYWNoKChvVmFsaWRhdG9yOiBPVmFsaWRhdG9yQ29tcG9uZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRvckZ1bmN0aW9uOiBWYWxpZGF0b3JGbiA9IG9WYWxpZGF0b3IuZ2V0VmFsaWRhdG9yRm4oKTtcbiAgICAgICAgaWYgKHZhbGlkYXRvckZ1bmN0aW9uKSB7XG4gICAgICAgICAgdmFsaWRhdG9ycy5wdXNoKHZhbGlkYXRvckZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlcnJvcnNEYXRhOiBFcnJvckRhdGFbXSA9IG9WYWxpZGF0b3IuZ2V0RXJyb3JzRGF0YSgpO1xuICAgICAgICBzZWxmLmVycm9yc0RhdGEucHVzaCguLi5lcnJvcnNEYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLl9mQ29udHJvbC5zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFkZE9udGltaXplQ3VzdG9tQXBwZWFyYW5jZUNsYXNzKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy5lbFJlZikge1xuICAgICAgICBjb25zdCBtYXRGb3JtRmllbGRFbCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbWF0LWZvcm0tZmllbGQnKTtcbiAgICAgICAgaWYgKG1hdEZvcm1GaWVsZEVsICYmIG1hdEZvcm1GaWVsZEVsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1hdEZvcm1GaWVsZEVsLml0ZW0oMCkuY2xhc3NMaXN0LmFkZCgnbWF0LWZvcm0tZmllbGQtYXBwZWFyYW5jZS1vbnRpbWl6ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy9cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0VG9vbHRpcENsYXNzKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbGl0ZUVycm9yID0gdGhpcy5lcnJvck9wdGlvbnMudHlwZSA9PT0gQ29kZXMuT19NQVRfRVJST1JfTElURTtcbiAgICBpZiAoIWxpdGVFcnJvcikge1xuICAgICAgcmV0dXJuIHN1cGVyLmdldFRvb2x0aXBDbGFzcygpO1xuICAgIH1cbiAgICBjb25zdCBlcnJvckNsYXNzID0gVXRpbC5pc0RlZmluZWQodGhpcy5fZkNvbnRyb2wuZXJyb3JzKSA/ICdvLW1hdC1lcnJvcicgOiAnJztcbiAgICByZXR1cm4gYCR7c3VwZXIuZ2V0VG9vbHRpcENsYXNzKCl9ICR7ZXJyb3JDbGFzc31gO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFRvb2x0aXBUZXh0KCk6IHN0cmluZyB7XG4gICAgY29uc3QgbGl0ZUVycm9yID0gdGhpcy5lcnJvck9wdGlvbnMudHlwZSA9PT0gQ29kZXMuT19NQVRfRVJST1JfTElURTtcbiAgICBpZiAobGl0ZUVycm9yICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuX2ZDb250cm9sLmVycm9ycykgJiYgdGhpcy5vTWF0RXJyb3JDaGlsZHJlbiAmJiB0aGlzLm9NYXRFcnJvckNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCByZXN1bHQ6IHN0cmluZyA9ICcnO1xuICAgICAgdGhpcy5vTWF0RXJyb3JDaGlsZHJlbi5mb3JFYWNoKChvTWF0RXJyb3I6IE9NYXRFcnJvckNvbXBvbmVudCkgPT4ge1xuICAgICAgICByZXN1bHQgKz0gYCR7b01hdEVycm9yLnRleHR9XFxuYDtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmdldFRvb2x0aXBUZXh0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcGFyc2VQZXJtaXNzaW9ucygpOiB2b2lkIHtcbiAgICAvLyBpZiBvYXR0ciBpbiBmb3JtLCBpdCBjYW4gaGF2ZSBwZXJtaXNzaW9uc1xuICAgIGlmICghdGhpcy5mb3JtIHx8ICFVdGlsLmlzRGVmaW5lZCh0aGlzLmZvcm0ub2F0dHIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBlcm1pc3Npb25zOiBPUGVybWlzc2lvbnMgPSB0aGlzLmZvcm0uZ2V0Rm9ybUNvbXBvbmVudFBlcm1pc3Npb25zKHRoaXMub2F0dHIpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQocGVybWlzc2lvbnMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChwZXJtaXNzaW9ucy52aXNpYmxlID09PSBmYWxzZSkge1xuICAgICAgLyogaGlkZSBpbnB1dCBwZXIgcGVybWlzc2lvbnMgKi9cbiAgICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH0gZWxzZSBpZiAocGVybWlzc2lvbnMuZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIC8qIGRpc2FibGUgaW5wdXQgcGVyIHBlcm1pc3Npb25zICovXG4gICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgICAgdGhpcy5mb3JtLnJlZ2lzdGVyRm9ybUNvbXBvbmVudCh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE11dGF0aW9uT2JzZXJ2ZXJUYXJnZXQoKTogYW55IHtcbiAgICBsZXQgcmVzdWx0O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKS5pdGVtKDApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvL1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFN1ZmZpeENsYXNzKGNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpY29uRmllbGRFbCA9IHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdpY29uLWZpZWxkJyk7XG4gICAgaWYgKGljb25GaWVsZEVsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgY2xhc3NMaXN0ID0gW10uc2xpY2UuY2FsbChpY29uRmllbGRFbFswXS5jbGFzc0xpc3QpO1xuICAgICAgY2xhc3NMaXN0LmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgICAgaWYgKGNsYXNzTmFtZS5zdGFydHNXaXRoKCdpY29uLWZpZWxkLScpKSB7XG4gICAgICAgICAgaWNvbkZpZWxkRWxbMF0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChjb3VudCA+IDApIHtcbiAgICAgICAgY29uc3QgbWF0U3VmZml4Q2xhc3MgPSBgaWNvbi1maWVsZC0ke2NvdW50fS1zdWZmaXhgO1xuICAgICAgICBpY29uRmllbGRFbFswXS5jbGFzc0xpc3QuYWRkKG1hdFN1ZmZpeENsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRG8gbm90IGFsbG93IHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGUgdG8gY2hhbmdlIGJ5IGNvZGUgb3IgYnkgaW5zcGVjdG9yXG4gICAqL1xuICBwcml2YXRlIGRpc2FibGVGb3JtQ29udHJvbCgpOiB2b2lkIHtcbiAgICBjb25zdCBjb250cm9sID0gdGhpcy5nZXRGb3JtQ29udHJvbCgpO1xuICAgIGNvbnRyb2wuZGlzYWJsZSh7XG4gICAgICBvbmx5U2VsZjogdHJ1ZSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=