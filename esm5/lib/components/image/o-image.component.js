import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, HostBinding, Inject, Injector, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { InputConverter } from '../../decorators/input-converter';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { OFormValue } from '../form/OFormValue';
import { DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent, } from '../o-form-data-component.class';
import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';
export var DEFAULT_INPUTS_O_IMAGE = tslib_1.__spread(DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, [
    'emptyimage: empty-image',
    'notfoundimage: not-found-image',
    'emptyicon: empty-icon',
    'showControls: show-controls',
    'height',
    'autoFit: auto-fit',
    'fullScreenButton: full-screen-button',
    'acceptFileType: accept-file-type'
]);
export var DEFAULT_OUTPUTS_O_IMAGE = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT);
var OImageComponent = (function (_super) {
    tslib_1.__extends(OImageComponent, _super);
    function OImageComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.acceptFileType = 'image/*';
        _this.autoFit = true;
        _this.currentFileName = '';
        _this.showControls = true;
        _this._fullScreenButton = false;
        _this._useEmptyIcon = true;
        _this._useEmptyImage = false;
        _this._domSanitizer = _this.injector.get(DomSanitizer);
        _this._defaultSQLTypeKey = 'BASE64';
        _this.dialog = _this.injector.get(MatDialog);
        _this.stateCtrl = new FormControl();
        return _this;
    }
    Object.defineProperty(OImageComponent.prototype, "fullScreenButton", {
        get: function () {
            return this._fullScreenButton;
        },
        set: function (val) {
            val = Util.parseBoolean(String(val));
            this._fullScreenButton = val;
        },
        enumerable: true,
        configurable: true
    });
    OImageComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.emptyimage && this.emptyimage.length > 0) {
            this._useEmptyIcon = false;
            this._useEmptyImage = true;
        }
        if (this.emptyicon === undefined && !this._useEmptyImage) {
            this.emptyicon = 'photo';
            this._useEmptyIcon = true;
            this._useEmptyImage = false;
        }
    };
    OImageComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    OImageComponent.prototype.ensureOFormValue = function (val) {
        if (val instanceof OFormValue) {
            if (val.value && val.value.bytes !== undefined) {
                this.value = new OFormValue(val.value.bytes);
                return;
            }
            this.value = new OFormValue(val.value);
        }
        else if (val && !(val instanceof OFormValue)) {
            if (val.bytes !== undefined) {
                val = val.bytes;
            }
            else if (val.length > 300 && val.substring(0, 4) === 'data') {
                val = val.substring(val.indexOf('base64') + 7);
            }
            this.value = new OFormValue(val);
        }
        else {
            this.value = new OFormValue(undefined);
        }
    };
    OImageComponent.prototype.isEmpty = function () {
        return !this.getValue() || this.getValue().length === 0;
    };
    OImageComponent.prototype.createFormControl = function () {
        this._fControl = _super.prototype.createFormControl.call(this);
        this._fControl.fControlChildren = [this.stateCtrl];
        return this._fControl;
    };
    OImageComponent.prototype.fileChange = function (input) {
        if (input.files[0]) {
            var reader = new FileReader();
            var self_1 = this;
            reader.addEventListener('load', function (event) {
                var result = event.target['result'];
                if (result && result.length > 300 && result.substring(0, 4) === 'data') {
                    result = result.substring(result.indexOf('base64') + 7);
                }
                self_1.setValue(result);
                if (self_1._fControl) {
                    self_1._fControl.markAsTouched();
                }
                event.stopPropagation();
            }, false);
            if (input.files[0]) {
                reader.readAsDataURL(input.files[0]);
            }
            this.currentFileName = input.files[0].name;
            this.stateCtrl.setValue(this.currentFileName);
        }
    };
    OImageComponent.prototype.notFoundImageUrl = function (event) {
        event.target.src = Util.isDefined(this.notfoundimage) ? this.notfoundimage : '';
    };
    OImageComponent.prototype.getSrcValue = function () {
        if (this.value && this.value.value) {
            if (this.value.value instanceof Object && this.value.value.bytes) {
                var src = '';
                if (this.value.value.bytes.substring(0, 4) === 'data') {
                    src = 'data:image/*;base64,' + this.value.value.bytes.substring(this.value.value.bytes.indexOf('base64') + 7);
                }
                else {
                    src = 'data:image/*;base64,' + this.value.value.bytes;
                }
                return this._domSanitizer.bypassSecurityTrustUrl(src);
            }
            else if (typeof this.value.value === 'string' &&
                this.value.value.length > 300) {
                var src = '';
                if (this.value.value.substring(0, 4) === 'data') {
                    src = 'data:image/*;base64,' + this.value.value.substring(this.value.value.indexOf('base64') + 7);
                }
                else {
                    src = 'data:image/*;base64,' + this.value.value;
                }
                return this._domSanitizer.bypassSecurityTrustUrl(src);
            }
            if (this.value.value) {
                return this.value.value;
            }
            else {
                return this.emptyimage;
            }
        }
        else if (this.emptyimage) {
            return this.emptyimage;
        }
    };
    OImageComponent.prototype.onClickBlocker = function (evt) {
        evt.stopPropagation();
    };
    OImageComponent.prototype.onClickClearValue = function (e) {
        if (!this.isReadOnly && this.enabled) {
            _super.prototype.onClickClearValue.call(this, e);
            this.fileInput.nativeElement.value = '';
            this.stateCtrl.reset();
            this.currentFileName = '';
        }
        if (this._fControl) {
            this._fControl.markAsTouched();
        }
    };
    OImageComponent.prototype.hasControls = function () {
        return this.showControls;
    };
    OImageComponent.prototype.useEmptyIcon = function () {
        return this._useEmptyIcon && this.isEmpty();
    };
    OImageComponent.prototype.useEmptyImage = function () {
        return this._useEmptyImage && this.isEmpty();
    };
    OImageComponent.prototype.getFormGroup = function () {
        var formGroup = _super.prototype.getFormGroup.call(this);
        if (!formGroup) {
            formGroup = new FormGroup({});
            formGroup.addControl(this.getAttribute(), this.getControl());
        }
        return formGroup;
    };
    Object.defineProperty(OImageComponent.prototype, "hostHeight", {
        get: function () {
            return this.height;
        },
        enumerable: true,
        configurable: true
    });
    OImageComponent.prototype.openFullScreen = function (e) {
        this.dialog.open(OFullScreenDialogComponent, {
            width: '90%',
            height: '90%',
            role: 'dialog',
            disableClose: false,
            panelClass: 'o-image-fullscreen-dialog-cdk-overlay',
            data: this.getSrcValue()
        });
    };
    OImageComponent.prototype.openFileSelector = function (e) {
        if (Util.isDefined(this.fileInput)) {
            this.fileInput.nativeElement.click();
        }
    };
    OImageComponent.prototype.internalFormControl = function () {
        return this.getAttribute() + '_value';
    };
    OImageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-image',
                    template: "<div fxLayout=\"column\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipPosition]=\"tooltipPosition\"\n  [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\" [class.o-image-auto-fit]=\"autoFit\"\n  class=\"o-image-content\" fxFill>\n\n  <input #input type=\"file\" [disabled]=\"!enabled\"\n    [accept]=\"acceptFileType ? acceptFileType.replace(';',',') : 'image/*'\" (change)=\"fileChange(input)\"\n    class=\"o-image-form-field-hidden\"/>\n\n  <mat-form-field *ngIf=\"hasControls()\" class=\"o-image-form-field\">\n    <input matInput readonly (click)=\"input.click()\" [placeholder]=\"olabel | oTranslate\" [required]=\"isRequired\"\n      [formControl]=\"stateCtrl\" />\n    <input matInput [formControlName]=\"getAttribute()\" type=\"text\" [id]=\"getAttribute()\"\n      class=\"o-image-form-field-input\" [required]=\"isRequired\" />\n\n\n    <button type=\"button\" *ngIf=\"fullScreenButton\" [disabled]=\"!enabled\" matSuffix mat-icon-button\n      (click)=\"openFullScreen($event)\">\n      <mat-icon svgIcon=\"ontimize:fullscreen\"></mat-icon>\n    </button>\n    <button type=\"button\" [disabled]=\"!enabled\" matSuffix mat-icon-button (click)=\"input.click()\">\n      <mat-icon svgIcon=\"ontimize:folder_open\"></mat-icon>\n    </button>\n    <button type=\"button\" [disabled]=\"!enabled\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n  </mat-form-field>\n\n  <div fxLayout=\"column\" fxLayoutAlign=\"center center\" fxFlex=\"grow\" class=\"o-image-display-container\">\n    <img *ngIf=\"!(isEmpty())\" [src]=\"getSrcValue()\" alt=\"\" (click)=\"openFileSelector()\" (error)=\"notFoundImageUrl($event)\"/>\n    <mat-icon class=\"empty-icon\" [class.mat-disabled]=\"!enabled\" aria-label=\"empty image\" *ngIf=\"useEmptyIcon()\"\n      (click)=\"openFileSelector()\">\n      {{ emptyicon }}</mat-icon>\n    <img [src]=\"getSrcValue()\" alt=\"empty image\" *ngIf=\"useEmptyImage()\" (click)=\"openFileSelector()\" />\n  </div>\n  <div *ngIf=\"isReadOnly\" fxFill class=\"read-only-blocker\" (click)=\"onClickBlocker($event)\"></div>\n</div>",
                    inputs: DEFAULT_INPUTS_O_IMAGE,
                    outputs: DEFAULT_OUTPUTS_O_IMAGE,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-image]': 'true'
                    },
                    styles: [".o-image{display:flex;height:inherit}.o-image .o-image-content{position:relative;width:100%}.o-image .o-image-content .o-image-form-field-hidden{display:none}.o-image .o-image-content .o-image-form-field{width:100%}.o-image .o-image-content .o-image-form-field .o-image-form-field-input{opacity:0;outline:0;width:0}.o-image .o-image-content .o-image-display-container{width:100%}.o-image .o-image-content .o-image-display-container>img{height:100%;width:100%}.o-image .o-image-content.o-image-auto-fit .o-image-display-container>img{height:auto;max-height:100%;max-width:100%;object-fit:contain;width:auto}.o-image .o-image-content .read-only-blocker{left:0;right:0;position:absolute;top:0;z-index:2}"]
                }] }
    ];
    OImageComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
    OImageComponent.propDecorators = {
        fileInput: [{ type: ViewChild, args: ['input', { static: false },] }],
        hostHeight: [{ type: HostBinding, args: ['style.height',] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OImageComponent.prototype, "autoFit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OImageComponent.prototype, "showControls", void 0);
    return OImageComponent;
}(OFormDataComponent));
export { OImageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2Uvby1pbWFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixXQUFXLEVBQ1gsTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRWhELE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMscUNBQXFDLEVBQ3JDLGtCQUFrQixHQUNuQixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBR3RGLE1BQU0sQ0FBQyxJQUFNLHNCQUFzQixvQkFDOUIsb0NBQW9DO0lBQ3ZDLHlCQUF5QjtJQUV6QixnQ0FBZ0M7SUFFaEMsdUJBQXVCO0lBRXZCLDZCQUE2QjtJQUU3QixRQUFRO0lBRVIsbUJBQW1CO0lBQ25CLHNDQUFzQztJQUd0QyxrQ0FBa0M7RUFDbkMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLHVCQUF1QixvQkFDL0Is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SSxNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxjQUFjLEVBQWQsQ0FBYyxDQUFDO2dCQTVGdEQsVUFBVTtnQkFJVixRQUFROzs7NEJBK0VQLFNBQVMsU0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOzZCQTBLcEMsV0FBVyxTQUFDLGNBQWM7O0lBdkwzQjtRQURDLGNBQWMsRUFBRTs7b0RBQ2M7SUFHL0I7UUFEQyxjQUFjLEVBQUU7O3lEQUNzQjtJQThNekMsc0JBQUM7Q0FBQSxBQXBPRCxDQVdxQyxrQkFBa0IsR0F5TnREO1NBek5ZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQgeyBPRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9pbnB1dC9vLWZvcm0tY29udHJvbC5jbGFzcyc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9mdWxsc2NyZWVuL2Z1bGxzY3JlZW4tZGlhbG9nLmNvbXBvbmVudCc7XG5cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fSU1BR0UgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgJ2VtcHR5aW1hZ2U6IGVtcHR5LWltYWdlJyxcbiAgLy8gbm90LWZvdW5kLWltYWdlIFtzdHJpbmddOiBEZWZhdWx0IGltYWdlIGZvciA0MDQgZXJyb3IuXG4gICdub3Rmb3VuZGltYWdlOiBub3QtZm91bmQtaW1hZ2UnLFxuICAvLyBlbXB0eS1pY29uIFtzdHJpbmddOiBtYXRlcmlhbCBpY29uLiBEZWZhdWx0OiBwaG90by5cbiAgJ2VtcHR5aWNvbjogZW1wdHktaWNvbicsXG4gIC8vIHNob3ctY29udHJvbHMgW3llc3xubyB0cnVlfGZhbHNlXTogU2hvd3Mgb3IgaGlkZXMgc2VsZWN0aW9uIGNvbnRyb2xzLiBEZWZhdWx0OiB0cnVlLlxuICAnc2hvd0NvbnRyb2xzOiBzaG93LWNvbnRyb2xzJyxcbiAgLy8gaGVpZ2h0IFslIHwgcHhdOiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaW1hZ2UuXG4gICdoZWlnaHQnLFxuICAvLyBhdXRvLWZpdCBbeWVzfG5vIHRydWV8ZmFsc2VdOiBBZGp1c3RzIHRoZSBpbWFnZSB0byB0aGUgY29udGVudCBvciBub3QuIERlZmF1bHQ6IHRydWUuXG4gICdhdXRvRml0OiBhdXRvLWZpdCcsXG4gICdmdWxsU2NyZWVuQnV0dG9uOiBmdWxsLXNjcmVlbi1idXR0b24nLFxuICAvLyBhY2NlcHQtZmlsZS10eXBlIFtzdHJpbmddOiBmaWxlIHR5cGVzIGFsbG93ZWQgb24gdGhlIGZpbGUgaW5wdXQsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IGltYWdlLyouXG4gIC8vIGZpbGVfZXh0ZW5zaW9uLCBpbWFnZS8qLCBtZWRpYV90eXBlLiBTZWUgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL2F0dF9pbnB1dF9hY2NlcHQuYXNwXG4gICdhY2NlcHRGaWxlVHlwZTogYWNjZXB0LWZpbGUtdHlwZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19JTUFHRSA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1pbWFnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWltYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1pbWFnZS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fSU1BR0UsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0lNQUdFLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWltYWdlXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9JbWFnZUNvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgYWNjZXB0RmlsZVR5cGU6IHN0cmluZyA9ICdpbWFnZS8qJztcbiAgcHVibGljIGVtcHR5aW1hZ2U6IHN0cmluZztcbiAgcHVibGljIG5vdGZvdW5kaW1hZ2U6IHN0cmluZztcbiAgcHVibGljIGVtcHR5aWNvbjogc3RyaW5nO1xuICBwdWJsaWMgaGVpZ2h0OiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBhdXRvRml0OiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGN1cnJlbnRGaWxlTmFtZTogc3RyaW5nID0gJyc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBzaG93Q29udHJvbHM6IGJvb2xlYW4gPSB0cnVlO1xuICBzZXQgZnVsbFNjcmVlbkJ1dHRvbih2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5fZnVsbFNjcmVlbkJ1dHRvbiA9IHZhbDtcbiAgfVxuICBnZXQgZnVsbFNjcmVlbkJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZnVsbFNjcmVlbkJ1dHRvbjtcbiAgfVxuICBwcm90ZWN0ZWQgX2Z1bGxTY3JlZW5CdXR0b24gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdpbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgZmlsZUlucHV0OiBFbGVtZW50UmVmO1xuICBwcm90ZWN0ZWQgX3VzZUVtcHR5SWNvbjogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBfdXNlRW1wdHlJbWFnZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX2RvbVNhbml0aXplcjogRG9tU2FuaXRpemVyO1xuICBwcm90ZWN0ZWQgZGlhbG9nOiBNYXREaWFsb2c7XG4gIHB1YmxpYyBzdGF0ZUN0cmw6IEZvcm1Db250cm9sO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2RvbVNhbml0aXplciA9IHRoaXMuaW5qZWN0b3IuZ2V0KERvbVNhbml0aXplcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnQkFTRTY0JztcbiAgICB0aGlzLmRpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdERpYWxvZyk7XG4gICAgdGhpcy5zdGF0ZUN0cmwgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgaWYgKHRoaXMuZW1wdHlpbWFnZSAmJiB0aGlzLmVtcHR5aW1hZ2UubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fdXNlRW1wdHlJY29uID0gZmFsc2U7XG4gICAgICB0aGlzLl91c2VFbXB0eUltYWdlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbXB0eWljb24gPT09IHVuZGVmaW5lZCAmJiAhdGhpcy5fdXNlRW1wdHlJbWFnZSkge1xuICAgICAgdGhpcy5lbXB0eWljb24gPSAncGhvdG8nO1xuICAgICAgdGhpcy5fdXNlRW1wdHlJY29uID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3VzZUVtcHR5SW1hZ2UgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxuXG4gIHB1YmxpYyBlbnN1cmVPRm9ybVZhbHVlKHZhbDogYW55KTogdm9pZCB7XG4gICAgaWYgKHZhbCBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIGlmICh2YWwudmFsdWUgJiYgdmFsLnZhbHVlLmJ5dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbC52YWx1ZS5ieXRlcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh2YWwudmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodmFsICYmICEodmFsIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkpIHtcbiAgICAgIGlmICh2YWwuYnl0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSB2YWwuYnl0ZXM7XG4gICAgICB9IGVsc2UgaWYgKHZhbC5sZW5ndGggPiAzMDAgJiYgdmFsLnN1YnN0cmluZygwLCA0KSA9PT0gJ2RhdGEnKSB7XG4gICAgICAgIC8vIFJlbW92aW5nIFwiZGF0YTppbWFnZS8qO2Jhc2U2NCxcIlxuICAgICAgICB2YWwgPSB2YWwuc3Vic3RyaW5nKHZhbC5pbmRleE9mKCdiYXNlNjQnKSArIDcpO1xuICAgICAgfVxuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5nZXRWYWx1ZSgpIHx8IHRoaXMuZ2V0VmFsdWUoKS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlRm9ybUNvbnRyb2woKTogT0Zvcm1Db250cm9sIHtcbiAgICB0aGlzLl9mQ29udHJvbCA9IHN1cGVyLmNyZWF0ZUZvcm1Db250cm9sKCk7XG4gICAgdGhpcy5fZkNvbnRyb2wuZkNvbnRyb2xDaGlsZHJlbiA9IFt0aGlzLnN0YXRlQ3RybF07XG4gICAgcmV0dXJuIHRoaXMuX2ZDb250cm9sO1xuICB9XG5cbiAgcHVibGljIGZpbGVDaGFuZ2UoaW5wdXQpOiB2b2lkIHtcbiAgICBpZiAoaW5wdXQuZmlsZXNbMF0pIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZXZlbnQgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZXZlbnQudGFyZ2V0WydyZXN1bHQnXTtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMzAwICYmIHJlc3VsdC5zdWJzdHJpbmcoMCwgNCkgPT09ICdkYXRhJykge1xuICAgICAgICAgIC8vIFJlbW92aW5nIFwiZGF0YTppbWFnZS8qO2Jhc2U2NCxcIlxuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcocmVzdWx0LmluZGV4T2YoJ2Jhc2U2NCcpICsgNyk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5zZXRWYWx1ZShyZXN1bHQpO1xuICAgICAgICBpZiAoc2VsZi5fZkNvbnRyb2wpIHtcbiAgICAgICAgICBzZWxmLl9mQ29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBpZiAoaW5wdXQuZmlsZXNbMF0pIHtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xuICAgICAgfVxuICAgICAgLy8gaWYgKHRoaXMudGl0bGVMYWJlbCkge1xuICAgICAgLy8gICB0aGlzLnRpdGxlTGFiZWwubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudCA9IGlucHV0LmZpbGVzWzBdLm5hbWU7XG4gICAgICAvLyB9XG4gICAgICB0aGlzLmN1cnJlbnRGaWxlTmFtZSA9IGlucHV0LmZpbGVzWzBdLm5hbWU7XG4gICAgICB0aGlzLnN0YXRlQ3RybC5zZXRWYWx1ZSh0aGlzLmN1cnJlbnRGaWxlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdEZvdW5kSW1hZ2VVcmwoZXZlbnQpOiBhbnkge1xuICAgIGV2ZW50LnRhcmdldC5zcmMgPSBVdGlsLmlzRGVmaW5lZCh0aGlzLm5vdGZvdW5kaW1hZ2UpID8gdGhpcy5ub3Rmb3VuZGltYWdlIDogJyc7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3JjVmFsdWUoKTogYW55IHtcbiAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLnZhbHVlKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCAmJiB0aGlzLnZhbHVlLnZhbHVlLmJ5dGVzKSB7XG4gICAgICAgIGxldCBzcmM6IHN0cmluZyA9ICcnO1xuICAgICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZS5ieXRlcy5zdWJzdHJpbmcoMCwgNCkgPT09ICdkYXRhJykge1xuICAgICAgICAgIHNyYyA9ICdkYXRhOmltYWdlLyo7YmFzZTY0LCcgKyB0aGlzLnZhbHVlLnZhbHVlLmJ5dGVzLnN1YnN0cmluZyh0aGlzLnZhbHVlLnZhbHVlLmJ5dGVzLmluZGV4T2YoJ2Jhc2U2NCcpICsgNyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3JjID0gJ2RhdGE6aW1hZ2UvKjtiYXNlNjQsJyArIHRoaXMudmFsdWUudmFsdWUuYnl0ZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0VXJsKHNyYyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnZhbHVlLnZhbHVlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICB0aGlzLnZhbHVlLnZhbHVlLmxlbmd0aCA+IDMwMCkge1xuICAgICAgICBsZXQgc3JjOiBzdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKHRoaXMudmFsdWUudmFsdWUuc3Vic3RyaW5nKDAsIDQpID09PSAnZGF0YScpIHtcbiAgICAgICAgICBzcmMgPSAnZGF0YTppbWFnZS8qO2Jhc2U2NCwnICsgdGhpcy52YWx1ZS52YWx1ZS5zdWJzdHJpbmcodGhpcy52YWx1ZS52YWx1ZS5pbmRleE9mKCdiYXNlNjQnKSArIDcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNyYyA9ICdkYXRhOmltYWdlLyo7YmFzZTY0LCcgKyB0aGlzLnZhbHVlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFVybChzcmMpO1xuICAgICAgfVxuICAgICAgaWYodGhpcy52YWx1ZS52YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVtcHR5aW1hZ2U7XG4gICAgICB9IFxuICAgIH0gZWxzZSBpZiAodGhpcy5lbXB0eWltYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbXB0eWltYWdlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrQmxvY2tlcihldnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcHVibGljIG9uQ2xpY2tDbGVhclZhbHVlKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICBzdXBlci5vbkNsaWNrQ2xlYXJWYWx1ZShlKTtcbiAgICAgIHRoaXMuZmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSAnJztcbiAgICAgIC8vIGlmICh0aGlzLnRpdGxlTGFiZWwpIHtcbiAgICAgIC8vICAgdGhpcy50aXRsZUxhYmVsLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIC8vIH1cbiAgICAgIHRoaXMuc3RhdGVDdHJsLnJlc2V0KCk7XG4gICAgICB0aGlzLmN1cnJlbnRGaWxlTmFtZSA9ICcnO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgIHRoaXMuX2ZDb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFzQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0NvbnRyb2xzO1xuICB9XG5cbiAgcHVibGljIHVzZUVtcHR5SWNvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlRW1wdHlJY29uICYmIHRoaXMuaXNFbXB0eSgpO1xuICB9XG5cbiAgcHVibGljIHVzZUVtcHR5SW1hZ2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZUVtcHR5SW1hZ2UgJiYgdGhpcy5pc0VtcHR5KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rm9ybUdyb3VwKCk6IEZvcm1Hcm91cCB7XG4gICAgbGV0IGZvcm1Hcm91cDogRm9ybUdyb3VwID0gc3VwZXIuZ2V0Rm9ybUdyb3VwKCk7XG4gICAgaWYgKCFmb3JtR3JvdXApIHtcbiAgICAgIGZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuICAgICAgZm9ybUdyb3VwLmFkZENvbnRyb2wodGhpcy5nZXRBdHRyaWJ1dGUoKSwgdGhpcy5nZXRDb250cm9sKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybUdyb3VwO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxuICBnZXQgaG9zdEhlaWdodCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuRnVsbFNjcmVlbihlPzogRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZy5vcGVuKE9GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICB3aWR0aDogJzkwJScsXG4gICAgICBoZWlnaHQ6ICc5MCUnLFxuICAgICAgcm9sZTogJ2RpYWxvZycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IGZhbHNlLFxuICAgICAgcGFuZWxDbGFzczogJ28taW1hZ2UtZnVsbHNjcmVlbi1kaWFsb2ctY2RrLW92ZXJsYXknLFxuICAgICAgZGF0YTogdGhpcy5nZXRTcmNWYWx1ZSgpXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb3BlbkZpbGVTZWxlY3RvcihlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5maWxlSW5wdXQpKSB7XG4gICAgICB0aGlzLmZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGludGVybmFsRm9ybUNvbnRyb2woKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoKSArICdfdmFsdWUnO1xuICB9XG5cbn1cbiJdfQ==