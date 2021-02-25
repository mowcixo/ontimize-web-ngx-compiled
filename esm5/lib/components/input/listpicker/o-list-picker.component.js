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
export var DEFAULT_INPUTS_O_LIST_PICKER = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT, [
    'filter',
    'dialogWidth : dialog-width',
    'dialogHeight : dialog-height',
    'queryRows: query-rows',
    'textInputEnabled: text-input-enabled',
    'dialogDisableClose: dialog-disable-close',
    'dialogClass: dialog-class'
]);
export var DEFAULT_OUTPUTS_O_LIST_PICKER = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT, [
    'onDialogAccept',
    'onDialogCancel'
]);
var OListPickerComponent = (function (_super) {
    tslib_1.__extends(OListPickerComponent, _super);
    function OListPickerComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.onDialogAccept = new EventEmitter();
        _this.onDialogCancel = new EventEmitter();
        _this.textInputEnabled = true;
        _this.dialogDisableClose = false;
        _this.filter = true;
        _this.dialogHeight = '55%';
        _this.blurDelay = 200;
        _this.blurPrevent = false;
        _this.matDialog = _this.injector.get(MatDialog);
        _this.stateCtrl = new FormControl();
        _this.clearButton = true;
        return _this;
    }
    OListPickerComponent.prototype.ngOnInit = function () {
        this.initialize();
    };
    OListPickerComponent.prototype.ngOnChanges = function (changes) {
        _super.prototype.ngOnChanges.call(this, changes);
        if (typeof (changes.staticData) !== 'undefined') {
            this.cacheQueried = true;
            this.setDataArray(changes.staticData.currentValue);
        }
    };
    OListPickerComponent.prototype.createFormControl = function () {
        this._fControl = _super.prototype.createFormControl.call(this);
        this._fControl.fControlChildren = [this.stateCtrl];
        return this._fControl;
    };
    OListPickerComponent.prototype.ensureOFormValue = function (value) {
        _super.prototype.ensureOFormValue.call(this, value);
        this.syncDataIndex(false);
    };
    OListPickerComponent.prototype.setEnabled = function (value) {
        _super.prototype.setEnabled.call(this, value);
        value ? this.stateCtrl.enable() : this.stateCtrl.disable();
    };
    OListPickerComponent.prototype.ngAfterViewInit = function () {
        _super.prototype.ngAfterViewInit.call(this);
        if (this.queryOnInit) {
            this.queryData();
        }
        else if (this.queryOnBind) {
            this.syncDataIndex();
        }
    };
    OListPickerComponent.prototype.getDescriptionValue = function () {
        var descTxt = '';
        if (this.descriptionColArray && this._currentIndex !== undefined) {
            var self_1 = this;
            this.descriptionColArray.forEach(function (descCol, index) {
                var txt = self_1.dataArray[self_1._currentIndex][descCol];
                if (txt) {
                    descTxt += txt;
                }
                if (index < self_1.descriptionColArray.length - 1) {
                    descTxt += self_1.separator;
                }
            });
        }
        return descTxt;
    };
    OListPickerComponent.prototype.onClickClear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isReadOnly && this.enabled) {
            clearTimeout(this.blurTimer);
            this.blurPrevent = true;
            this.setValue(undefined);
        }
    };
    OListPickerComponent.prototype.onClickInput = function (e) {
        if (!this.textInputEnabled) {
            this.onClickListpicker(e);
        }
    };
    OListPickerComponent.prototype.onClickListpicker = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isReadOnly && this.enabled) {
            clearTimeout(this.blurTimer);
            this.openDialog();
        }
    };
    OListPickerComponent.prototype.onDialogClose = function (evt) {
        this.dialogRef = null;
        this.visibleInputValue = undefined;
        if (evt instanceof Object && typeof evt[this.valueColumn] !== 'undefined') {
            var self_2 = this;
            window.setTimeout(function () {
                self_2.setValue(evt[self_2.valueColumn], { changeType: OValueChangeEvent.USER_CHANGE });
                if (self_2._fControl) {
                    self_2._fControl.markAsTouched();
                    self_2._fControl.markAsDirty();
                }
                self_2.onDialogAccept.emit();
            }, 0);
        }
        else {
            this.onDialogCancel.emit();
        }
    };
    OListPickerComponent.prototype.innerOnBlur = function (evt) {
        if (!this.isReadOnly && this.enabled) {
            var self_3 = this;
            this.blurTimer = setTimeout(function () {
                if (!self_3.blurPrevent) {
                    self_3._fControl.markAsTouched();
                    self_3.onBlur.emit(evt);
                    if (self_3.visibleInputValue !== undefined && self_3.visibleInputValue.length > 0) {
                        self_3.openDialog();
                    }
                    else if (self_3.visibleInputValue !== undefined) {
                        self_3.setValue(undefined);
                        self_3.visibleInputValue = undefined;
                    }
                    else {
                        self_3._fControl.markAsTouched();
                    }
                }
                self_3.blurPrevent = false;
            }, this.blurDelay);
        }
    };
    OListPickerComponent.prototype.onVisibleInputChange = function (event) {
        this.visibleInputValue = event.target.value;
    };
    OListPickerComponent.prototype.onKeydownEnter = function (val) {
        clearTimeout(this.blurTimer);
        this.blurPrevent = true;
        this.visibleInputValue = val;
        this.openDialog();
    };
    OListPickerComponent.prototype.setFormValue = function (val, options, setDirty) {
        if (setDirty === void 0) { setDirty = false; }
        _super.prototype.setFormValue.call(this, val, options, setDirty);
        this.stateCtrl.setValue(this.getDescriptionValue());
    };
    OListPickerComponent.prototype.openDialog = function () {
        var _this = this;
        var cfg = {
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
        this.dialogRef.afterClosed().subscribe(function (result) {
            _this.onDialogClose(result);
        });
    };
    OListPickerComponent.prototype.getDialogDataArray = function (dataArray) {
        var result = [];
        var self = this;
        dataArray.forEach(function (item, itemIndex) {
            var element = '';
            self.visibleColArray.forEach(function (visibleCol, index) {
                element += item[visibleCol];
                if ((index + 1) < self.visibleColArray.length) {
                    element += self.separator;
                }
            });
            var newItem = Object.assign({}, item);
            newItem._parsedVisibleColumnText = element;
            newItem._parsedIndex = itemIndex;
            result.push(newItem);
        });
        return result;
    };
    OListPickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-list-picker',
                    template: "<div (click)=\"onClickInput($event)\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\"\n  [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\" [matTooltipPosition]=\"tooltipPosition\"\n  [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\"\n  class=\"custom-error o-list-picker-content\">\n  <input #inputModel class=\"input-model\" type=\"text\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\">\n\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [class.custom-width]=\"hasCustomWidth\"\n    [hideRequiredMarker]=\"hideRequiredMarker\" class=\"icon-field\" #innerInputContainer fxFlexFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input #visibleInput matInput type=\"text\" [attr.id]=\"'desc_' + getAttribute()\" [id]=\"'desc_' + getAttribute()\"\n      [formControl]=\"stateCtrl\" [placeholder]=\"placeHolder\" [value]=\"getDescriptionValue()\"\n      (input)=\"onVisibleInputChange($event)\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\"\n      [readonly]=\"isReadOnly || !textInputEnabled\" [required]=\"isRequired\"\n      (keydown.enter)=\"onKeydownEnter(visibleInput.value)\" (change)=\"onChangeEvent($event)\">\n\n    <button type=\"button\" [disabled]=\"isReadOnly || !enabled\" [class.read-only]=\"isReadOnly\" matSuffix mat-icon-button\n      (click)=\"onClickListpicker($event)\">\n      <mat-icon svgIcon=\"ontimize:search\"></mat-icon>\n    </button>\n\n    <button type=\"button\" [disabled]=\"isReadOnly || !enabled\" [class.read-only]=\"isReadOnly\" matSuffix mat-icon-button\n      (click)=\"onClickClearValue($event)\" *ngIf=\"showClearButton\">\n      <mat-icon svgIcon=\"ontimize:clear\"></mat-icon>\n    </button>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                    providers: [
                        OntimizeServiceProvider,
                        { provide: OFormServiceComponent, useExisting: forwardRef(function () { return OListPickerComponent; }) }
                    ],
                    inputs: DEFAULT_INPUTS_O_LIST_PICKER,
                    outputs: DEFAULT_OUTPUTS_O_LIST_PICKER,
                    styles: [".o-list-picker-content .input-model{display:none!important}.o-list-picker-content .mat-button.mat-disabled{cursor:default}"]
                }] }
    ];
    OListPickerComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
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
    return OListPickerComponent;
}(OFormServiceComponent));
export { OListPickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LXBpY2tlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvbGlzdHBpY2tlci9vLWxpc3QtcGlja2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUdSLFFBQVEsRUFFUixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQWlDLFFBQVEsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXZGLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV0RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFckUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLHdDQUF3QyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDN0osT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFFOUUsTUFBTSxDQUFDLElBQU0sNEJBQTRCLG9CQUNwQyx1Q0FBdUM7SUFDMUMsUUFBUTtJQUNSLDRCQUE0QjtJQUM1Qiw4QkFBOEI7SUFDOUIsdUJBQXVCO0lBQ3ZCLHNDQUFzQztJQUN0QywwQ0FBMEM7SUFDMUMsMkJBQTJCO0VBQzVCLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSw2QkFBNkIsb0JBQ3JDLHdDQUF3QztJQUMzQyxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0VBQ2pCLENBQUM7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TSxFQUFFLEtBQUssRUFBRTs7SUFwQjVDO1FBREMsY0FBYyxFQUFFOztrRUFDdUI7SUFFeEM7UUFEQyxjQUFjLEVBQUU7O29FQUMwQjtJQUUzQztRQURDLGNBQWMsRUFBRTs7d0RBQ2dCO0lBS2pDO1FBREMsY0FBYyxFQUFFOzsyREFDVztJQW1OOUIsMkJBQUM7Q0FBQSxBQWxQRCxDQVcwQyxxQkFBcUIsR0F1TzlEO1NBdk9ZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFNpbXBsZUNoYW5nZSxcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNYXREaWFsb2csIE1hdERpYWxvZ0NvbmZpZywgTWF0RGlhbG9nUmVmLCBNYXRJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBGb3JtVmFsdWVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZm9ybS12YWx1ZS1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1ZhbHVlQ2hhbmdlRXZlbnQgfSBmcm9tICcuLi8uLi9vLXZhbHVlLWNoYW5nZS1ldmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9vLWZvcm0tY29udHJvbC5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fU0VSVklDRV9DT01QT05FTlQsIE9Gb3JtU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL28tZm9ybS1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPTGlzdFBpY2tlckRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTElTVF9QSUNLRVIgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9TRVJWSUNFX0NPTVBPTkVOVCxcbiAgJ2ZpbHRlcicsXG4gICdkaWFsb2dXaWR0aCA6IGRpYWxvZy13aWR0aCcsXG4gICdkaWFsb2dIZWlnaHQgOiBkaWFsb2ctaGVpZ2h0JyxcbiAgJ3F1ZXJ5Um93czogcXVlcnktcm93cycsXG4gICd0ZXh0SW5wdXRFbmFibGVkOiB0ZXh0LWlucHV0LWVuYWJsZWQnLFxuICAnZGlhbG9nRGlzYWJsZUNsb3NlOiBkaWFsb2ctZGlzYWJsZS1jbG9zZScsXG4gICdkaWFsb2dDbGFzczogZGlhbG9nLWNsYXNzJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfUElDS0VSID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX1NFUlZJQ0VfQ09NUE9ORU5ULFxuICAnb25EaWFsb2dBY2NlcHQnLFxuICAnb25EaWFsb2dDYW5jZWwnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtcGlja2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC1waWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWxpc3QtcGlja2VyLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplU2VydmljZVByb3ZpZGVyLFxuICAgIHsgcHJvdmlkZTogT0Zvcm1TZXJ2aWNlQ29tcG9uZW50LCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBPTGlzdFBpY2tlckNvbXBvbmVudCkgfVxuICBdLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTElTVF9QSUNLRVIsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfUElDS0VSXG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0UGlja2VyQ29tcG9uZW50IGV4dGVuZHMgT0Zvcm1TZXJ2aWNlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkluaXQge1xuXG4gIC8qIE91dHB1dHMgKi9cbiAgcHVibGljIG9uRGlhbG9nQWNjZXB0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIG9uRGlhbG9nQ2FuY2VsOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyogRW5kIG91dHB1dHMgKi9cblxuICBwdWJsaWMgc3RhdGVDdHJsOiBGb3JtQ29udHJvbDtcblxuICAvKiBJbnB1dHMgKi9cbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHRleHRJbnB1dEVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZGlhbG9nRGlzYWJsZUNsb3NlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBmaWx0ZXI6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgZGlhbG9nV2lkdGg6IHN0cmluZztcbiAgcHJvdGVjdGVkIGRpYWxvZ0hlaWdodDogc3RyaW5nID0gJzU1JSc7XG4gIHByb3RlY3RlZCBkaWFsb2dDbGFzczogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgcXVlcnlSb3dzOiBudW1iZXI7XG5cbiAgLypPdmVycmlkZSBjbGVhckJ1dHRvbiA9IHRydWUgKi9cbiAgLy8gQElucHV0Q29udmVydGVyKClcbiAgLy8gcHVibGljIGNsZWFyQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcbiAgLyogRW5kIGlucHV0cyAqL1xuXG4gIHByb3RlY3RlZCBtYXREaWFsb2c6IE1hdERpYWxvZztcbiAgcHJvdGVjdGVkIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50PjtcblxuICBAVmlld0NoaWxkKCdpbnB1dE1vZGVsJywgeyBzdGF0aWM6IGZhbHNlIH0pIHByb3RlY3RlZCBpbnB1dE1vZGVsOiBNYXRJbnB1dDtcbiAgQFZpZXdDaGlsZCgndmlzaWJsZUlucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHByb3RlY3RlZCB2aXNpYmxlSW5wdXQ6IEVsZW1lbnRSZWY7XG4gIHByb3RlY3RlZCB2aXNpYmxlSW5wdXRWYWx1ZTogYW55O1xuXG4gIHByb3RlY3RlZCBibHVyVGltZXI7XG4gIHByb3RlY3RlZCBibHVyRGVsYXkgPSAyMDA7XG4gIHByb3RlY3RlZCBibHVyUHJldmVudCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGZvcm0sIGVsUmVmLCBpbmplY3Rvcik7XG4gICAgdGhpcy5tYXREaWFsb2cgPSB0aGlzLmluamVjdG9yLmdldDxNYXREaWFsb2c+KE1hdERpYWxvZyk7XG4gICAgdGhpcy5zdGF0ZUN0cmwgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAgICAvKiBvdmVyd3JpdHRlIGNsZWFyQnV0dG9uIHRvIHRydWUgKi9cbiAgICB0aGlzLmNsZWFyQnV0dG9uID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7IFtwcm9wTmFtZTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlIH0pOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgICBpZiAodHlwZW9mIChjaGFuZ2VzLnN0YXRpY0RhdGEpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5jYWNoZVF1ZXJpZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zZXREYXRhQXJyYXkoY2hhbmdlcy5zdGF0aWNEYXRhLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNyZWF0ZUZvcm1Db250cm9sKCk6IE9Gb3JtQ29udHJvbCB7XG4gICAgdGhpcy5fZkNvbnRyb2wgPSBzdXBlci5jcmVhdGVGb3JtQ29udHJvbCgpO1xuICAgIHRoaXMuX2ZDb250cm9sLmZDb250cm9sQ2hpbGRyZW4gPSBbdGhpcy5zdGF0ZUN0cmxdO1xuICAgIHJldHVybiB0aGlzLl9mQ29udHJvbDtcbiAgfVxuXG4gIHB1YmxpYyBlbnN1cmVPRm9ybVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBzdXBlci5lbnN1cmVPRm9ybVZhbHVlKHZhbHVlKTtcbiAgICAvLyBUaGlzIGNhbGwgbWFrZSB0aGUgY29tcG9uZW50IHF1ZXJ5aW5nIGl0cyBkYXRhIG11bHRpcGxlIHRpbWVzLCBidXQgZ2V0dGluZyBkZXNjcmlwdGlvbiB2YWx1ZSBpcyBuZWVkZWRcbiAgICB0aGlzLnN5bmNEYXRhSW5kZXgoZmFsc2UpO1xuICB9XG5cbiAgcHVibGljIHNldEVuYWJsZWQodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBzdXBlci5zZXRFbmFibGVkKHZhbHVlKTtcbiAgICB2YWx1ZSA/IHRoaXMuc3RhdGVDdHJsLmVuYWJsZSgpIDogdGhpcy5zdGF0ZUN0cmwuZGlzYWJsZSgpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICBpZiAodGhpcy5xdWVyeU9uSW5pdCkge1xuICAgICAgdGhpcy5xdWVyeURhdGEoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucXVlcnlPbkJpbmQpIHtcbiAgICAgIC8vIFRPRE8gZG8gaXQgYmV0dGVyLiBXaGVuIGNoYW5naW5nIHRhYnMgaXQgaXMgbmVjZXNzYXJ5IHRvIGludm9rZSBuZXcgcXVlcnlcbiAgICAgIHRoaXMuc3luY0RhdGFJbmRleCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXREZXNjcmlwdGlvblZhbHVlKCk6IHN0cmluZyB7XG4gICAgbGV0IGRlc2NUeHQgPSAnJztcbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbkNvbEFycmF5ICYmIHRoaXMuX2N1cnJlbnRJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25Db2xBcnJheS5mb3JFYWNoKChkZXNjQ29sLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCB0eHQgPSBzZWxmLmRhdGFBcnJheVtzZWxmLl9jdXJyZW50SW5kZXhdW2Rlc2NDb2xdO1xuICAgICAgICBpZiAodHh0KSB7XG4gICAgICAgICAgZGVzY1R4dCArPSB0eHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4IDwgc2VsZi5kZXNjcmlwdGlvbkNvbEFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkZXNjVHh0ICs9IHNlbGYuc2VwYXJhdG9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NUeHQ7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0NsZWFyKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKCF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5ibHVyVGltZXIpO1xuICAgICAgdGhpcy5ibHVyUHJldmVudCA9IHRydWU7XG4gICAgICB0aGlzLnNldFZhbHVlKHVuZGVmaW5lZCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQ2xpY2tJbnB1dChlOiBFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy50ZXh0SW5wdXRFbmFibGVkKSB7XG4gICAgICB0aGlzLm9uQ2xpY2tMaXN0cGlja2VyKGUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrTGlzdHBpY2tlcihlOiBFdmVudCk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICghdGhpcy5pc1JlYWRPbmx5ICYmIHRoaXMuZW5hYmxlZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuYmx1clRpbWVyKTtcbiAgICAgIHRoaXMub3BlbkRpYWxvZygpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkRpYWxvZ0Nsb3NlKGV2dDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5kaWFsb2dSZWYgPSBudWxsO1xuICAgIHRoaXMudmlzaWJsZUlucHV0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGV2dCBpbnN0YW5jZW9mIE9iamVjdCAmJiB0eXBlb2YgZXZ0W3RoaXMudmFsdWVDb2x1bW5dICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNlbGYuc2V0VmFsdWUoZXZ0W3NlbGYudmFsdWVDb2x1bW5dLCB7IGNoYW5nZVR5cGU6IE9WYWx1ZUNoYW5nZUV2ZW50LlVTRVJfQ0hBTkdFIH0pO1xuICAgICAgICBpZiAoc2VsZi5fZkNvbnRyb2wpIHtcbiAgICAgICAgICBzZWxmLl9mQ29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgICAgc2VsZi5fZkNvbnRyb2wubWFya0FzRGlydHkoKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLm9uRGlhbG9nQWNjZXB0LmVtaXQoKTtcbiAgICAgIH0sIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uRGlhbG9nQ2FuY2VsLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5uZXJPbkJsdXIoZXZ0OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSZWFkT25seSAmJiB0aGlzLmVuYWJsZWQpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5ibHVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKCFzZWxmLmJsdXJQcmV2ZW50KSB7XG4gICAgICAgICAgc2VsZi5fZkNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgICAgIHNlbGYub25CbHVyLmVtaXQoZXZ0KTtcbiAgICAgICAgICBpZiAoc2VsZi52aXNpYmxlSW5wdXRWYWx1ZSAhPT0gdW5kZWZpbmVkICYmIHNlbGYudmlzaWJsZUlucHV0VmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VsZi5vcGVuRGlhbG9nKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzZWxmLnZpc2libGVJbnB1dFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0VmFsdWUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHNlbGYudmlzaWJsZUlucHV0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX2ZDb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5ibHVyUHJldmVudCA9IGZhbHNlO1xuICAgICAgfSwgdGhpcy5ibHVyRGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblZpc2libGVJbnB1dENoYW5nZShldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy52aXNpYmxlSW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBvbktleWRvd25FbnRlcih2YWw6IGFueSk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmJsdXJUaW1lcik7XG4gICAgdGhpcy5ibHVyUHJldmVudCA9IHRydWU7XG4gICAgdGhpcy52aXNpYmxlSW5wdXRWYWx1ZSA9IHZhbDtcbiAgICB0aGlzLm9wZW5EaWFsb2coKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBzZXRGb3JtVmFsdWUodmFsOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zLCBzZXREaXJ0eTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgc3VwZXIuc2V0Rm9ybVZhbHVlKHZhbCwgb3B0aW9ucywgc2V0RGlydHkpO1xuICAgIHRoaXMuc3RhdGVDdHJsLnNldFZhbHVlKHRoaXMuZ2V0RGVzY3JpcHRpb25WYWx1ZSgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvcGVuRGlhbG9nKCk6IHZvaWQge1xuICAgIGNvbnN0IGNmZzogTWF0RGlhbG9nQ29uZmlnID0ge1xuICAgICAgcm9sZTogJ2RpYWxvZycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRoaXMuZGlhbG9nRGlzYWJsZUNsb3NlLFxuICAgICAgcGFuZWxDbGFzczogWydjZGstb3ZlcmxheS1saXN0LXBpY2tlcicsICdvLWRpYWxvZy1jbGFzcycsIHRoaXMuZGlhbG9nQ2xhc3NdLFxuICAgICAgZGF0YToge1xuICAgICAgICBkYXRhOiB0aGlzLmdldERpYWxvZ0RhdGFBcnJheSh0aGlzLmRhdGFBcnJheSksXG4gICAgICAgIGZpbHRlcjogdGhpcy5maWx0ZXIsXG4gICAgICAgIHNlYXJjaFZhbDogdGhpcy52aXNpYmxlSW5wdXRWYWx1ZSxcbiAgICAgICAgbWVudUNvbHVtbnM6IHRoaXMudmlzaWJsZUNvbHVtbnMsIC8vIFRPRE86IGltcHJvdmUgdGhpcywgdGhpcyBpcyBwYXNzZWQgdG8gYG8tc2VhcmNoLWlucHV0YCBvZiB0aGUgZGlhbG9nXG4gICAgICAgIHZpc2libGVDb2x1bW5zOiB0aGlzLnZpc2libGVDb2xBcnJheSxcbiAgICAgICAgcXVlcnlSb3dzOiB0aGlzLnF1ZXJ5Um93c1xuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHRoaXMuZGlhbG9nV2lkdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2ZnLndpZHRoID0gdGhpcy5kaWFsb2dXaWR0aDtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlhbG9nSGVpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNmZy5oZWlnaHQgPSB0aGlzLmRpYWxvZ0hlaWdodDtcbiAgICB9XG4gICAgdGhpcy5kaWFsb2dSZWYgPSB0aGlzLm1hdERpYWxvZy5vcGVuKE9MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50LCBjZmcpO1xuXG4gICAgdGhpcy5kaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIHRoaXMub25EaWFsb2dDbG9zZShyZXN1bHQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldERpYWxvZ0RhdGFBcnJheShkYXRhQXJyYXk6IGFueVtdKTogYW55W10ge1xuICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBkYXRhQXJyYXkuZm9yRWFjaCgoaXRlbSwgaXRlbUluZGV4KSA9PiB7XG4gICAgICBsZXQgZWxlbWVudCA9ICcnO1xuICAgICAgc2VsZi52aXNpYmxlQ29sQXJyYXkuZm9yRWFjaCgodmlzaWJsZUNvbCwgaW5kZXgpID0+IHtcbiAgICAgICAgZWxlbWVudCArPSBpdGVtW3Zpc2libGVDb2xdO1xuICAgICAgICBpZiAoKGluZGV4ICsgMSkgPCBzZWxmLnZpc2libGVDb2xBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICBlbGVtZW50ICs9IHNlbGYuc2VwYXJhdG9yO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSBPYmplY3QuYXNzaWduKHt9LCBpdGVtKTtcbiAgICAgIG5ld0l0ZW0uX3BhcnNlZFZpc2libGVDb2x1bW5UZXh0ID0gZWxlbWVudDtcbiAgICAgIG5ld0l0ZW0uX3BhcnNlZEluZGV4ID0gaXRlbUluZGV4O1xuICAgICAgcmVzdWx0LnB1c2gobmV3SXRlbSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG59XG4iXX0=