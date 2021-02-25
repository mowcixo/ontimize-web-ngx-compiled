import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatInput } from '@angular/material';
import { InputConverter } from '../../../decorators/input-converter';
import { OntimizeServiceProvider } from '../../../services/factories';
import { OFormComponent } from '../../form/o-form.component';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT, OFormServiceComponent } from '../o-form-service-component.class';
import { OListPickerDialogComponent } from './o-list-picker-dialog.component';
export const DEFAULT_INPUTS_O_LIST_PICKER = [
    ...DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
    'filter',
    'dialogWidth : dialog-width',
    'dialogHeight : dialog-height',
    'queryRows: query-rows',
    'textInputEnabled: text-input-enabled',
    'dialogDisableClose: dialog-disable-close',
    'dialogClass: dialog-class'
];
export const DEFAULT_OUTPUTS_O_LIST_PICKER = [
    ...DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT,
    'onDialogAccept',
    'onDialogCancel'
];
export class OListPickerComponent extends OFormServiceComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.onDialogAccept = new EventEmitter();
        this.onDialogCancel = new EventEmitter();
        this.textInputEnabled = true;
        this.dialogDisableClose = false;
        this.filter = true;
        this.dialogHeight = '55%';
        this.blurDelay = 200;
        this.blurPrevent = false;
        this.matDialog = this.injector.get(MatDialog);
        this.stateCtrl = new FormControl();
        this.clearButton = true;
    }
    ngOnInit() {
        this.initialize();
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
        if (typeof (changes.staticData) !== 'undefined') {
            this.cacheQueried = true;
            this.setDataArray(changes.staticData.currentValue);
        }
    }
    createFormControl() {
        this._fControl = super.createFormControl();
        this._fControl.fControlChildren = [this.stateCtrl];
        return this._fControl;
    }
    ensureOFormValue(value) {
        super.ensureOFormValue(value);
        this.syncDataIndex(false);
    }
    setEnabled(value) {
        super.setEnabled(value);
        value ? this.stateCtrl.enable() : this.stateCtrl.disable();
    }
    ngAfterViewInit() {
        super.ngAfterViewInit();
        if (this.queryOnInit) {
            this.queryData();
        }
        else if (this.queryOnBind) {
            this.syncDataIndex();
        }
    }
    getDescriptionValue() {
        let descTxt = '';
        if (this.descriptionColArray && this._currentIndex !== undefined) {
            const self = this;
            this.descriptionColArray.forEach((descCol, index) => {
                const txt = self.dataArray[self._currentIndex][descCol];
                if (txt) {
                    descTxt += txt;
                }
                if (index < self.descriptionColArray.length - 1) {
                    descTxt += self.separator;
                }
            });
        }
        return descTxt;
    }
    onClickClear(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isReadOnly && this.enabled) {
            clearTimeout(this.blurTimer);
            this.blurPrevent = true;
            this.setValue(undefined);
        }
    }
    onClickInput(e) {
        if (!this.textInputEnabled) {
            this.onClickListpicker(e);
        }
    }
    onClickListpicker(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isReadOnly && this.enabled) {
            clearTimeout(this.blurTimer);
            this.openDialog();
        }
    }
    onDialogClose(evt) {
        this.dialogRef = null;
        this.visibleInputValue = undefined;
        if (evt instanceof Object && typeof evt[this.valueColumn] !== 'undefined') {
            const self = this;
            window.setTimeout(() => {
                self.setValue(evt[self.valueColumn], { changeType: OValueChangeEvent.USER_CHANGE });
                if (self._fControl) {
                    self._fControl.markAsTouched();
                    self._fControl.markAsDirty();
                }
                self.onDialogAccept.emit();
            }, 0);
        }
        else {
            this.onDialogCancel.emit();
        }
    }
    innerOnBlur(evt) {
        if (!this.isReadOnly && this.enabled) {
            const self = this;
            this.blurTimer = setTimeout(() => {
                if (!self.blurPrevent) {
                    self._fControl.markAsTouched();
                    self.onBlur.emit(evt);
                    if (self.visibleInputValue !== undefined && self.visibleInputValue.length > 0) {
                        self.openDialog();
                    }
                    else if (self.visibleInputValue !== undefined) {
                        self.setValue(undefined);
                        self.visibleInputValue = undefined;
                    }
                    else {
                        self._fControl.markAsTouched();
                    }
                }
                self.blurPrevent = false;
            }, this.blurDelay);
        }
    }
    onVisibleInputChange(event) {
        this.visibleInputValue = event.target.value;
    }
    onKeydownEnter(val) {
        clearTimeout(this.blurTimer);
        this.blurPrevent = true;
        this.visibleInputValue = val;
        this.openDialog();
    }
    setFormValue(val, options, setDirty = false) {
        super.setFormValue(val, options, setDirty);
        this.stateCtrl.setValue(this.getDescriptionValue());
    }
    openDialog() {
        const cfg = {
            role: 'dialog',
            disableClose: this.dialogDisableClose,
            panelClass: ['cdk-overlay-list-picker', 'o-dialog-class', this.dialogClass],
            data: {
                data: this.getDialogDataArray(this.dataArray),
                filter: this.filter,
                searchVal: this.visibleInputValue,
                menuColumns: this.visibleColumns,
                visibleColumns: this.visibleColArray,
                queryRows: this.queryRows
            }
        };
        if (this.dialogWidth !== undefined) {
            cfg.width = this.dialogWidth;
        }
        if (this.dialogHeight !== undefined) {
            cfg.height = this.dialogHeight;
        }
        this.dialogRef = this.matDialog.open(OListPickerDialogComponent, cfg);
        this.dialogRef.afterClosed().subscribe(result => {
            this.onDialogClose(result);
        });
    }
    getDialogDataArray(dataArray) {
        const result = [];
        const self = this;
        dataArray.forEach((item, itemIndex) => {
            let element = '';
            self.visibleColArray.forEach((visibleCol, index) => {
                element += item[visibleCol];
                if ((index + 1) < self.visibleColArray.length) {
                    element += self.separator;
                }
            });
            const newItem = Object.assign({}, item);
            newItem._parsedVisibleColumnText = element;
            newItem._parsedIndex = itemIndex;
            result.push(newItem);
        });
        return result;
    }
}
OListPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-list-picker',
                template: "<div (click)=\"onClickInput($event)\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\"\n  [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\"\n  [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\"\n  class=\"custom-error o-list-picker-content\">\n  <input #inputModel class=\"input-model\" type=\"text\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\">\n\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [class.custom-width]=\"hasCustomWidth\"\n    [hideRequiredMarker]=\"hideRequiredMarker\" class=\"icon-field\" #innerInputContainer fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input #visibleInput matInput type=\"text\" [attr.id]=\"'desc_' + getAttribute()\" [id]=\"'desc_' + getAttribute()\"\n      [formControl]=\"stateCtrl\" [placeholder]=\"placeHolder\" [value]=\"getDescriptionValue()\"\n      (input)=\"onVisibleInputChange($event)\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\"\n      [readonly]=\"isReadOnly || !textInputEnabled\" [required]=\"isRequired\"\n      (keydown.enter)=\"onKeydownEnter(visibleInput.value)\" (change)=\"onChangeEvent($event)\">\n\n    <button type=\"button\" [disabled]=\"isReadOnly || !enabled\" [class.read-only]=\"isReadOnly\" matSuffix mat-icon-button\n      (click)=\"onClickListpicker($event)\">\n      <mat-icon svgIcon=\"ontimize:search\"></mat-icon>\n    </button>\n\n    <button type=\"button\" [disabled]=\"isReadOnly || !enabled\" [class.read-only]=\"isReadOnly\" matSuffix mat-icon-button\n      (click)=\"onClickClearValue($event)\" *ngIf=\"showClearButton\">\n      <mat-icon svgIcon=\"ontimize:clear\"></mat-icon>\n    </button>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                providers: [
                    OntimizeServiceProvider,
                    { provide: OFormServiceComponent, useExisting: forwardRef(() => OListPickerComponent) }
                ],
                inputs: DEFAULT_INPUTS_O_LIST_PICKER,
                outputs: DEFAULT_OUTPUTS_O_LIST_PICKER,
                styles: [".o-list-picker-content .input-model{display:none!important}.o-list-picker-content .mat-button.mat-disabled{cursor:default}"]
            }] }
];
OListPickerComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
OListPickerComponent.propDecorators = {
    inputModel: [{ type: ViewChild, args: ['inputModel', { static: false },] }],
    visibleInput: [{ type: ViewChild, args: ['visibleInput', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OListPickerComponent.prototype, "textInputEnabled", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OListPickerComponent.prototype, "dialogDisableClose", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OListPickerComponent.prototype, "filter", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OListPickerComponent.prototype, "queryRows", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvbGlzdHBpY2tlci9vLWxpc3QtcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUdSLFFBQVEsRUFFUixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQWlDLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXZGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV0RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFckUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLHdDQUF3QyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDN0osT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFOUUsTUFBTSxDQUFDLE1BQU0sNEJBQTRCLEdBQUc7SUFDMUMsR0FBRyx1Q0FBdUM7SUFDMUMsUUFBUTtJQUNSLDRCQUE0QjtJQUM1Qiw4QkFBOEI7SUFDOUIsdUJBQXVCO0lBQ3ZCLHNDQUFzQztJQUN0QywwQ0FBMEM7SUFDMUMsMkJBQTJCO0NBQzVCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRztJQUMzQyxHQUFHLHdDQUF3QztJQUMzQyxnQkFBZ0I7SUFDaEIs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LGNBQWMsRUFBRTs7Z0VBQzBCO0FBRTNDO0lBREMsY0FBYyxFQUFFOztvREFDZ0I7QUFLakM7SUFEQyxjQUFjLEVBQUU7O3VEQUNXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgU2ltcGxlQ2hhbmdlLFxuICBWaWV3Q2hpbGRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdERpYWxvZywgTWF0RGlhbG9nQ29uZmlnLCBNYXREaWFsb2dSZWYsIE1hdElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZVByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZmFjdG9yaWVzJztcbmltcG9ydCB7IEZvcm1WYWx1ZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLXZhbHVlLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBPRm9ybUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gJy4uLy4uL28tdmFsdWUtY2hhbmdlLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7IE9Gb3JtQ29udHJvbCB9IGZyb20gJy4uL28tZm9ybS1jb250cm9sLmNsYXNzJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCwgREVGQVVMVF9PVVRQVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCwgT0Zvcm1TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1mb3JtLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9vLWxpc3QtcGlja2VyLWRpYWxvZy5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MSVNUX1BJQ0tFUiA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5ULFxuICAnZmlsdGVyJyxcbiAgJ2RpYWxvZ1dpZHRoIDogZGlhbG9nLXdpZHRoJyxcbiAgJ2RpYWxvZ0hlaWdodCA6IGRpYWxvZy1oZWlnaHQnLFxuICAncXVlcnlSb3dzOiBxdWVyeS1yb3dzJyxcbiAgJ3RleHRJbnB1dEVuYWJsZWQ6IHRleHQtaW5wdXQtZW5hYmxlZCcsXG4gICdkaWFsb2dEaXNhYmxlQ2xvc2U6IGRpYWxvZy1kaXNhYmxlLWNsb3NlJyxcbiAgJ2RpYWxvZ0NsYXNzOiBkaWFsb2ctY2xhc3MnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fTElTVF9QSUNLRVIgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsXG4gICdvbkRpYWxvZ0FjY2VwdCcsXG4gICdvbkRpYWxvZ0NhbmNlbCdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbGlzdC1waWNrZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vby1saXN0LXBpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbGlzdC1waWNrZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIsXG4gICAgeyBwcm92aWRlOiBPRm9ybVNlcnZpY2VDb21wb25lbnQsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE9MaXN0UGlja2VyQ29tcG9uZW50KSB9XG4gIF0sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19MSVNUX1BJQ0tFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fTElTVF9QSUNLRVJcbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RQaWNrZXJDb21wb25lbnQgZXh0ZW5kcyBPRm9ybVNlcnZpY2VDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uSW5pdCB7XG5cbiAgLyogT3V0cHV0cyAqL1xuICBwdWJsaWMgb25EaWFsb2dBY2NlcHQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgb25EaWFsb2dDYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAvKiBFbmQgb3V0cHV0cyAqL1xuXG4gIHB1YmxpYyBzdGF0ZUN0cmw6IEZvcm1Db250cm9sO1xuXG4gIC8qIElucHV0cyAqL1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgdGV4dElucHV0RW5hYmxlZDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBkaWFsb2dEaXNhYmxlQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIGZpbHRlcjogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBkaWFsb2dXaWR0aDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGlhbG9nSGVpZ2h0OiBzdHJpbmcgPSAnNTUlJztcbiAgcHJvdGVjdGVkIGRpYWxvZ0NsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBxdWVyeVJvd3M6IG51bWJlcjtcblxuICAvKk92ZXJyaWRlIGNsZWFyQnV0dG9uID0gdHJ1ZSAqL1xuICAvLyBASW5wdXRDb252ZXJ0ZXIoKVxuICAvLyBwdWJsaWMgY2xlYXJCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICAvKiBFbmQgaW5wdXRzICovXG5cbiAgcHJvdGVjdGVkIG1hdERpYWxvZzogTWF0RGlhbG9nO1xuICBwcm90ZWN0ZWQgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T0xpc3RQaWNrZXJEaWFsb2dDb21wb25lbnQ+O1xuXG4gIEBWaWV3Q2hpbGQoJ2lucHV0TW9kZWwnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJvdGVjdGVkIGlucHV0TW9kZWw6IE1hdElucHV0O1xuICBAVmlld0NoaWxkKCd2aXNpYmxlSW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJvdGVjdGVkIHZpc2libGVJbnB1dDogRWxlbWVudFJlZjtcbiAgcHJvdGVjdGVkIHZpc2libGVJbnB1dFZhbHVlOiBhbnk7XG5cbiAgcHJvdGVjdGVkIGJsdXJUaW1lcjtcbiAgcHJvdGVjdGVkIGJsdXJEZWxheSA9IDIwMDtcbiAgcHJvdGVjdGVkIGJsdXJQcmV2ZW50ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9Gb3JtQ29tcG9uZW50KSkgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgICB0aGlzLm1hdERpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0PE1hdERpYWxvZz4oTWF0RGlhbG9nKTtcbiAgICB0aGlzLnN0YXRlQ3RybCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICAgIC8qIG92ZXJ3cml0dGUgY2xlYXJCdXR0b24gdG8gdHJ1ZSAqL1xuICAgIHRoaXMuY2xlYXJCdXR0b24gPSB0cnVlO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHsgW3Byb3BOYW1lOiBzdHJpbmddOiBTaW1wbGVDaGFuZ2UgfSk6IHZvaWQge1xuICAgIHN1cGVyLm5nT25DaGFuZ2VzKGNoYW5nZXMpO1xuICAgIGlmICh0eXBlb2YgKGNoYW5nZXMuc3RhdGljRGF0YSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmNhY2hlUXVlcmllZCA9IHRydWU7XG4gICAgICB0aGlzLnNldERhdGFBcnJheShjaGFuZ2VzLnN0YXRpY0RhdGEuY3VycmVudFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlRm9ybUNvbnRyb2woKTogT0Zvcm1Db250cm9sIHtcbiAgICB0aGlzLl9mQ29udHJvbCA9IHN1cGVyLmNyZWF0ZUZvcm1Db250cm9sKCk7XG4gICAgdGhpcy5fZkNvbnRyb2wuZkNvbnRyb2xDaGlsZHJlbiA9IFt0aGlzLnN0YXRlQ3RybF07XG4gICAgcmV0dXJuIHRoaXMuX2ZDb250cm9sO1xuICB9XG5cbiAgcHVibGljIGVuc3VyZU9Gb3JtVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHN1cGVyLmVuc3VyZU9Gb3JtVmFsdWUodmFsdWUpO1xuICAgIC8vIFRoaXMgY2FsbCBtYWtlIHRoZSBjb21wb25lbnQgcXVlcnlpbmcgaXRzIGRhdGEgbXVsdGlwbGUgdGltZXMsIGJ1dCBnZXR0aW5nIGRlc2NyaXB0aW9uIHZhbHVlIGlzIG5lZWRlZFxuICAgIHRoaXMuc3luY0RhdGFJbmRleChmYWxzZSk7XG4gIH1cblxuICBwdWJsaWMgc2V0RW5hYmxlZCh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHN1cGVyLnNldEVuYWJsZWQodmFsdWUpO1xuICAgIHZhbHVlID8gdGhpcy5zdGF0ZUN0cmwuZW5hYmxlKCkgOiB0aGlzLnN0YXRlQ3RybC5kaXNhYmxlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHN1cGVyLm5nQWZ0ZXJWaWV3SW5pdCgpO1xuICAgIGlmICh0aGlzLnF1ZXJ5T25Jbml0KSB7XG4gICAgICB0aGlzLnF1ZXJ5RGF0YSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5xdWVyeU9uQmluZCkge1xuICAgICAgLy8gVE9ETyBkbyBpdCBiZXR0ZXIuIFdoZW4gY2hhbmdpbmcgdGFicyBpdCBpcyBuZWNlc3NhcnkgdG8gaW52b2tlIG5ldyBxdWVyeVxuICAgICAgdGhpcy5zeW5jRGF0YUluZGV4KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldERlc2NyaXB0aW9uVmFsdWUoKTogc3RyaW5nIHtcbiAgICBsZXQgZGVzY1R4dCA9ICcnO1xuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uQ29sQXJyYXkgJiYgdGhpcy5fY3VycmVudEluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5LmZvckVhY2goKGRlc2NDb2wsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IHR4dCA9IHNlbGYuZGF0YUFycmF5W3NlbGYuX2N1cnJlbnRJbmRleF1bZGVzY0NvbF07XG4gICAgICAgIGlmICh0eHQpIHtcbiAgICAgICAgICBkZXNjVHh0ICs9IHR4dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXggPCBzZWxmLmRlc2NyaXB0aW9uQ29sQXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRlc2NUeHQgKz0gc2VsZi5zZXBhcmF0b3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY1R4dDtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrQ2xlYXIoZTogRXZlbnQpOiB2b2lkIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAoIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmJsdXJUaW1lcik7XG4gICAgICB0aGlzLmJsdXJQcmV2ZW50ID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2V0VmFsdWUodW5kZWZpbmVkKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0lucHV0KGU6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnRleHRJbnB1dEVuYWJsZWQpIHtcbiAgICAgIHRoaXMub25DbGlja0xpc3RwaWNrZXIoZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQ2xpY2tMaXN0cGlja2VyKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5ibHVyVGltZXIpO1xuICAgICAgdGhpcy5vcGVuRGlhbG9nKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uRGlhbG9nQ2xvc2UoZXZ0OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZ1JlZiA9IG51bGw7XG4gICAgdGhpcy52aXNpYmxlSW5wdXRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZXZ0IGluc3RhbmNlb2YgT2JqZWN0ICYmIHR5cGVvZiBldnRbdGhpcy52YWx1ZUNvbHVtbl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2VsZi5zZXRWYWx1ZShldnRbc2VsZi52YWx1ZUNvbHVtbl0sIHsgY2hhbmdlVHlwZTogT1ZhbHVlQ2hhbmdlRXZlbnQuVVNFUl9DSEFOR0UgfSk7XG4gICAgICAgIGlmIChzZWxmLl9mQ29udHJvbCkge1xuICAgICAgICAgIHNlbGYuX2ZDb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgICBzZWxmLl9mQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYub25EaWFsb2dBY2NlcHQuZW1pdCgpO1xuICAgICAgfSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25EaWFsb2dDYW5jZWwuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbm5lck9uQmx1cihldnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLmJsdXJUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoIXNlbGYuYmx1clByZXZlbnQpIHtcbiAgICAgICAgICBzZWxmLl9mQ29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgICAgc2VsZi5vbkJsdXIuZW1pdChldnQpO1xuICAgICAgICAgIGlmIChzZWxmLnZpc2libGVJbnB1dFZhbHVlICE9PSB1bmRlZmluZWQgJiYgc2VsZi52aXNpYmxlSW5wdXRWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZWxmLm9wZW5EaWFsb2coKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYudmlzaWJsZUlucHV0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgc2VsZi5zZXRWYWx1ZSh1bmRlZmluZWQpO1xuICAgICAgICAgICAgc2VsZi52aXNpYmxlSW5wdXRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5fZkNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLmJsdXJQcmV2ZW50ID0gZmFsc2U7XG4gICAgICB9LCB0aGlzLmJsdXJEZWxheSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uVmlzaWJsZUlucHV0Q2hhbmdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2libGVJbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICB9XG5cbiAgcHVibGljIG9uS2V5ZG93bkVudGVyKHZhbDogYW55KTogdm9pZCB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuYmx1clRpbWVyKTtcbiAgICB0aGlzLmJsdXJQcmV2ZW50ID0gdHJ1ZTtcbiAgICB0aGlzLnZpc2libGVJbnB1dFZhbHVlID0gdmFsO1xuICAgIHRoaXMub3BlbkRpYWxvZygpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldEZvcm1WYWx1ZSh2YWw6IGFueSwgb3B0aW9ucz86IEZvcm1WYWx1ZU9wdGlvbnMsIHNldERpcnR5OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBzdXBlci5zZXRGb3JtVmFsdWUodmFsLCBvcHRpb25zLCBzZXREaXJ0eSk7XG4gICAgdGhpcy5zdGF0ZUN0cmwuc2V0VmFsdWUodGhpcy5nZXREZXNjcmlwdGlvblZhbHVlKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9wZW5EaWFsb2coKTogdm9pZCB7XG4gICAgY29uc3QgY2ZnOiBNYXREaWFsb2dDb25maWcgPSB7XG4gICAgICByb2xlOiAnZGlhbG9nJyxcbiAgICAgIGRpc2FibGVDbG9zZTogdGhpcy5kaWFsb2dEaXNhYmxlQ2xvc2UsXG4gICAgICBwYW5lbENsYXNzOiBbJ2Nkay1vdmVybGF5LWxpc3QtcGlja2VyJywgJ28tZGlhbG9nLWNsYXNzJywgdGhpcy5kaWFsb2dDbGFzc10sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGRhdGE6IHRoaXMuZ2V0RGlhbG9nRGF0YUFycmF5KHRoaXMuZGF0YUFycmF5KSxcbiAgICAgICAgZmlsdGVyOiB0aGlzLmZpbHRlcixcbiAgICAgICAgc2VhcmNoVmFsOiB0aGlzLnZpc2libGVJbnB1dFZhbHVlLFxuICAgICAgICBtZW51Q29sdW1uczogdGhpcy52aXNpYmxlQ29sdW1ucywgLy8gVE9ETzogaW1wcm92ZSB0aGlzLCB0aGlzIGlzIHBhc3NlZCB0byBgby1zZWFyY2gtaW5wdXRgIG9mIHRoZSBkaWFsb2dcbiAgICAgICAgdmlzaWJsZUNvbHVtbnM6IHRoaXMudmlzaWJsZUNvbEFycmF5LFxuICAgICAgICBxdWVyeVJvd3M6IHRoaXMucXVlcnlSb3dzXG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAodGhpcy5kaWFsb2dXaWR0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjZmcud2lkdGggPSB0aGlzLmRpYWxvZ1dpZHRoO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaWFsb2dIZWlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2ZnLmhlaWdodCA9IHRoaXMuZGlhbG9nSGVpZ2h0O1xuICAgIH1cbiAgICB0aGlzLmRpYWxvZ1JlZiA9IHRoaXMubWF0RGlhbG9nLm9wZW4oT0xpc3RQaWNrZXJEaWFsb2dDb21wb25lbnQsIGNmZyk7XG5cbiAgICB0aGlzLmRpYWxvZ1JlZi5hZnRlckNsb3NlZCgpLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgdGhpcy5vbkRpYWxvZ0Nsb3NlKHJlc3VsdCk7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0RGlhbG9nRGF0YUFycmF5KGRhdGFBcnJheTogYW55W10pOiBhbnlbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGRhdGFBcnJheS5mb3JFYWNoKChpdGVtLCBpdGVtSW5kZXgpID0+IHtcbiAgICAgIGxldCBlbGVtZW50ID0gJyc7XG4gICAgICBzZWxmLnZpc2libGVDb2xBcnJheS5mb3JFYWNoKCh2aXNpYmxlQ29sLCBpbmRleCkgPT4ge1xuICAgICAgICBlbGVtZW50ICs9IGl0ZW1bdmlzaWJsZUNvbF07XG4gICAgICAgIGlmICgoaW5kZXggKyAxKSA8IHNlbGYudmlzaWJsZUNvbEFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgIGVsZW1lbnQgKz0gc2VsZi5zZXBhcmF0b3I7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbmV3SXRlbSA9IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0pO1xuICAgICAgbmV3SXRlbS5fcGFyc2VkVmlzaWJsZUNvbHVtblRleHQgPSBlbGVtZW50O1xuICAgICAgbmV3SXRlbS5fcGFyc2VkSW5kZXggPSBpdGVtSW5kZXg7XG4gICAgICByZXN1bHQucHVzaChuZXdJdGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbn1cbiJdfQ==