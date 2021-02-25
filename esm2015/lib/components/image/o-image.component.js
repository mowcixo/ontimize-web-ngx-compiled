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
export const DEFAULT_INPUTS_O_IMAGE = [
    ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
    'emptyimage: empty-image',
    'notfoundimage: not-found-image',
    'emptyicon: empty-icon',
    'showControls: show-controls',
    'height',
    'autoFit: auto-fit',
    'fullScreenButton: full-screen-button',
    'acceptFileType: accept-file-type'
];
export const DEFAULT_OUTPUTS_O_IMAGE = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];
export class OImageComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.acceptFileType = 'image/*';
        this.autoFit = true;
        this.currentFileName = '';
        this.showControls = true;
        this._fullScreenButton = false;
        this._useEmptyIcon = true;
        this._useEmptyImage = false;
        this._domSanitizer = this.injector.get(DomSanitizer);
        this._defaultSQLTypeKey = 'BASE64';
        this.dialog = this.injector.get(MatDialog);
        this.stateCtrl = new FormControl();
    }
    set fullScreenButton(val) {
        val = Util.parseBoolean(String(val));
        this._fullScreenButton = val;
    }
    get fullScreenButton() {
        return this._fullScreenButton;
    }
    ngOnInit() {
        super.ngOnInit();
        if (this.emptyimage && this.emptyimage.length > 0) {
            this._useEmptyIcon = false;
            this._useEmptyImage = true;
        }
        if (this.emptyicon === undefined && !this._useEmptyImage) {
            this.emptyicon = 'photo';
            this._useEmptyIcon = true;
            this._useEmptyImage = false;
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    ensureOFormValue(val) {
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
    }
    isEmpty() {
        return !this.getValue() || this.getValue().length === 0;
    }
    createFormControl() {
        this._fControl = super.createFormControl();
        this._fControl.fControlChildren = [this.stateCtrl];
        return this._fControl;
    }
    fileChange(input) {
        if (input.files[0]) {
            const reader = new FileReader();
            const self = this;
            reader.addEventListener('load', event => {
                let result = event.target['result'];
                if (result && result.length > 300 && result.substring(0, 4) === 'data') {
                    result = result.substring(result.indexOf('base64') + 7);
                }
                self.setValue(result);
                if (self._fControl) {
                    self._fControl.markAsTouched();
                }
                event.stopPropagation();
            }, false);
            if (input.files[0]) {
                reader.readAsDataURL(input.files[0]);
            }
            this.currentFileName = input.files[0].name;
            this.stateCtrl.setValue(this.currentFileName);
        }
    }
    notFoundImageUrl(event) {
        event.target.src = Util.isDefined(this.notfoundimage) ? this.notfoundimage : '';
    }
    getSrcValue() {
        if (this.value && this.value.value) {
            if (this.value.value instanceof Object && this.value.value.bytes) {
                let src = '';
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
                let src = '';
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
    }
    onClickBlocker(evt) {
        evt.stopPropagation();
    }
    onClickClearValue(e) {
        if (!this.isReadOnly && this.enabled) {
            super.onClickClearValue(e);
            this.fileInput.nativeElement.value = '';
            this.stateCtrl.reset();
            this.currentFileName = '';
        }
        if (this._fControl) {
            this._fControl.markAsTouched();
        }
    }
    hasControls() {
        return this.showControls;
    }
    useEmptyIcon() {
        return this._useEmptyIcon && this.isEmpty();
    }
    useEmptyImage() {
        return this._useEmptyImage && this.isEmpty();
    }
    getFormGroup() {
        let formGroup = super.getFormGroup();
        if (!formGroup) {
            formGroup = new FormGroup({});
            formGroup.addControl(this.getAttribute(), this.getControl());
        }
        return formGroup;
    }
    get hostHeight() {
        return this.height;
    }
    openFullScreen(e) {
        this.dialog.open(OFullScreenDialogComponent, {
            width: '90%',
            height: '90%',
            role: 'dialog',
            disableClose: false,
            panelClass: 'o-image-fullscreen-dialog-cdk-overlay',
            data: this.getSrcValue()
        });
    }
    openFileSelector(e) {
        if (Util.isDefined(this.fileInput)) {
            this.fileInput.nativeElement.click();
        }
    }
    internalFormControl() {
        return this.getAttribute() + '_value';
    }
}
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
OImageComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2Uvby1pbWFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixXQUFXLEVBQ1gsTUFBTSxFQUNOLFFBQVEsRUFHUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRWhELE9BQU8sRUFDTCxvQ0FBb0MsRUFDcEMscUNBQXFDLEVBQ3JDLGtCQUFrQixHQUNuQixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBR3RGLE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLEdBQUcsb0NBQW9DO0lBQ3ZDLHlCQUF5QjtJQUV6QixnQ0FBZ0M7SUFFaEMsdUJBQXVCO0lBRXZCLDZCQUE2QjtJQUU3QixRQUFRO0lBRVIsbUJBQW1CO0lBQ25CLHNDQUFzQztJQUd0QyxrQ0FBa0M7Q0FDbkMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ3JDLEdBQUcscUNBQXFDO0NBQ3pDLENBQUM7QUFhRixNQUFNLE9BQU8sZUFBZ0IsU0FBUSxrQkFBa0I7SUE2QnJELFlBQ3dELElBQW9CLEVBQzFFLEtBQWlCLEVBQ2pCLFFBQWtCO1FBRWxCLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBaEN4QixtQkFBYyxHQUFXLFNBQVMsQ0FBQztRQU1uQyxZQUFPLEdBQVksSUFBSSxDQUFDO1FBQ3hCLG9CQUFlLEdBQVcsRUFBRSxDQUFDO1FBRTFCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBUTdCLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUkxQixrQkFBYSxHQUFZLElBQUksQ0FBQztRQUM5QixtQkFBYyxHQUFZLEtBQUssQ0FBQztRQVd4QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQTNCRCxJQUFJLGdCQUFnQixDQUFDLEdBQVk7UUFDL0IsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztJQUMvQixDQUFDO0lBQ0QsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQXVCTSxRQUFRO1FBQ2IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpCLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFTSxXQUFXO1FBQ2hCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sZ0JBQWdCLENBQUMsR0FBUTtRQUM5QixJQUFJLEdBQUcsWUFBWSxVQUFVLEVBQUU7WUFDN0IsSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM3QyxPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QzthQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFlBQVksVUFBVSxDQUFDLEVBQUU7WUFDOUMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDM0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDakI7aUJBQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7Z0JBRTdELEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEQ7WUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVNLE9BQU87UUFDWixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxpQkFBaUI7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRU0sVUFBVSxDQUFDLEtBQUs7UUFDckIsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDaEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3RDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3BDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtvQkFFdEUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDekQ7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUNoQztnQkFDRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ1YsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNsQixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QztZQUlELElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDM0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQUVNLGdCQUFnQixDQUFDLEtBQUs7UUFDM0IsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRixDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDbEMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssWUFBWSxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO2dCQUNoRSxJQUFJLEdBQUcsR0FBVyxFQUFFLENBQUM7Z0JBQ3JCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssTUFBTSxFQUFFO29CQUNyRCxHQUFHLEdBQUcsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUMvRztxQkFBTTtvQkFDTCxHQUFHLEdBQUcsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO2lCQUN2RDtnQkFDRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkQ7aUJBQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFFBQVE7Z0JBQzdDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7Z0JBQy9CLElBQUksR0FBRyxHQUFXLEVBQUUsQ0FBQztnQkFDckIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtvQkFDL0MsR0FBRyxHQUFHLHNCQUFzQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ25HO3FCQUFNO29CQUNMLEdBQUcsR0FBRyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDakQ7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUN6QjtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDeEI7U0FDRjthQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMxQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRU0sY0FBYyxDQUFDLEdBQVU7UUFDOUIsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxDQUFRO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFJeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztTQUMzQjtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFFTSxZQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRU0sWUFBWTtRQUNqQixJQUFJLFNBQVMsR0FBYyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5QixTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUM5RDtRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxDQUFTO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQzNDLEtBQUssRUFBRSxLQUFLO1lBQ1osTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsUUFBUTtZQUNkLFlBQVksRUFBRSxLQUFLO1lBQ25CLFVBQVUsRUFBRSx1Q0FBdUM7WUFDbkQsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUU7U0FDekIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLGdCQUFnQixDQUFDLENBQVM7UUFDL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFTSxtQkFBbUI7UUFDeEIsT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsUUFBUSxDQUFDO0lBQ3hDLENBQUM7OztZQWxPRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLDZ3RUFBdUM7Z0JBRXZDLE1BQU0sRUFBRSxzQkFBc0I7Z0JBQzlCLE9BQU8sRUFBRSx1QkFBdUI7Z0JBQ2hDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osaUJBQWlCLEVBQUUsTUFBTTtpQkFDMUI7O2FBQ0Y7OztZQTVDUSxjQUFjLHVCQTJFbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBNUZ0RCxVQUFVO1lBSVYsUUFBUTs7O3dCQStFUCxTQUFTLFNBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTt5QkEwS3BDLFdBQVcsU0FBQyxjQUFjOztBQXZMM0I7SUFEQyxjQUFjLEVBQUU7O2dEQUNjO0FBRy9CO0lBREMsY0FBYyxFQUFFOztxREFDc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdERpYWxvZyB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9mb3JtL28tZm9ybS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1WYWx1ZSB9IGZyb20gJy4uL2Zvcm0vT0Zvcm1WYWx1ZSc7XG5pbXBvcnQgeyBPRm9ybUNvbnRyb2wgfSBmcm9tICcuLi9pbnB1dC9vLWZvcm0tY29udHJvbC5jbGFzcyc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsXG4gIE9Gb3JtRGF0YUNvbXBvbmVudCxcbn0gZnJvbSAnLi4vby1mb3JtLWRhdGEtY29tcG9uZW50LmNsYXNzJztcbmltcG9ydCB7IE9GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9mdWxsc2NyZWVuL2Z1bGxzY3JlZW4tZGlhbG9nLmNvbXBvbmVudCc7XG5cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fSU1BR0UgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVCxcbiAgJ2VtcHR5aW1hZ2U6IGVtcHR5LWltYWdlJyxcbiAgLy8gbm90LWZvdW5kLWltYWdlIFtzdHJpbmddOiBEZWZhdWx0IGltYWdlIGZvciA0MDQgZXJyb3IuXG4gICdub3Rmb3VuZGltYWdlOiBub3QtZm91bmQtaW1hZ2UnLFxuICAvLyBlbXB0eS1pY29uIFtzdHJpbmddOiBtYXRlcmlhbCBpY29uLiBEZWZhdWx0OiBwaG90by5cbiAgJ2VtcHR5aWNvbjogZW1wdHktaWNvbicsXG4gIC8vIHNob3ctY29udHJvbHMgW3llc3xubyB0cnVlfGZhbHNlXTogU2hvd3Mgb3IgaGlkZXMgc2VsZWN0aW9uIGNvbnRyb2xzLiBEZWZhdWx0OiB0cnVlLlxuICAnc2hvd0NvbnRyb2xzOiBzaG93LWNvbnRyb2xzJyxcbiAgLy8gaGVpZ2h0IFslIHwgcHhdOiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaW1hZ2UuXG4gICdoZWlnaHQnLFxuICAvLyBhdXRvLWZpdCBbeWVzfG5vIHRydWV8ZmFsc2VdOiBBZGp1c3RzIHRoZSBpbWFnZSB0byB0aGUgY29udGVudCBvciBub3QuIERlZmF1bHQ6IHRydWUuXG4gICdhdXRvRml0OiBhdXRvLWZpdCcsXG4gICdmdWxsU2NyZWVuQnV0dG9uOiBmdWxsLXNjcmVlbi1idXR0b24nLFxuICAvLyBhY2NlcHQtZmlsZS10eXBlIFtzdHJpbmddOiBmaWxlIHR5cGVzIGFsbG93ZWQgb24gdGhlIGZpbGUgaW5wdXQsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IGltYWdlLyouXG4gIC8vIGZpbGVfZXh0ZW5zaW9uLCBpbWFnZS8qLCBtZWRpYV90eXBlLiBTZWUgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL2F0dF9pbnB1dF9hY2NlcHQuYXNwXG4gICdhY2NlcHRGaWxlVHlwZTogYWNjZXB0LWZpbGUtdHlwZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19JTUFHRSA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fRk9STV9EQVRBX0NPTVBPTkVOVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1pbWFnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWltYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1pbWFnZS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fSU1BR0UsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0lNQUdFLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWltYWdlXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9JbWFnZUNvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgYWNjZXB0RmlsZVR5cGU6IHN0cmluZyA9ICdpbWFnZS8qJztcbiAgcHVibGljIGVtcHR5aW1hZ2U6IHN0cmluZztcbiAgcHVibGljIG5vdGZvdW5kaW1hZ2U6IHN0cmluZztcbiAgcHVibGljIGVtcHR5aWNvbjogc3RyaW5nO1xuICBwdWJsaWMgaGVpZ2h0OiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBhdXRvRml0OiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGN1cnJlbnRGaWxlTmFtZTogc3RyaW5nID0gJyc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBzaG93Q29udHJvbHM6IGJvb2xlYW4gPSB0cnVlO1xuICBzZXQgZnVsbFNjcmVlbkJ1dHRvbih2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5fZnVsbFNjcmVlbkJ1dHRvbiA9IHZhbDtcbiAgfVxuICBnZXQgZnVsbFNjcmVlbkJ1dHRvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZnVsbFNjcmVlbkJ1dHRvbjtcbiAgfVxuICBwcm90ZWN0ZWQgX2Z1bGxTY3JlZW5CdXR0b24gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdpbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgZmlsZUlucHV0OiBFbGVtZW50UmVmO1xuICBwcm90ZWN0ZWQgX3VzZUVtcHR5SWNvbjogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCBfdXNlRW1wdHlJbWFnZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX2RvbVNhbml0aXplcjogRG9tU2FuaXRpemVyO1xuICBwcm90ZWN0ZWQgZGlhbG9nOiBNYXREaWFsb2c7XG4gIHB1YmxpYyBzdGF0ZUN0cmw6IEZvcm1Db250cm9sO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBzdXBlcihmb3JtLCBlbFJlZiwgaW5qZWN0b3IpO1xuICAgIHRoaXMuX2RvbVNhbml0aXplciA9IHRoaXMuaW5qZWN0b3IuZ2V0KERvbVNhbml0aXplcik7XG4gICAgdGhpcy5fZGVmYXVsdFNRTFR5cGVLZXkgPSAnQkFTRTY0JztcbiAgICB0aGlzLmRpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdERpYWxvZyk7XG4gICAgdGhpcy5zdGF0ZUN0cmwgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xuXG4gICAgaWYgKHRoaXMuZW1wdHlpbWFnZSAmJiB0aGlzLmVtcHR5aW1hZ2UubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fdXNlRW1wdHlJY29uID0gZmFsc2U7XG4gICAgICB0aGlzLl91c2VFbXB0eUltYWdlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbXB0eWljb24gPT09IHVuZGVmaW5lZCAmJiAhdGhpcy5fdXNlRW1wdHlJbWFnZSkge1xuICAgICAgdGhpcy5lbXB0eWljb24gPSAncGhvdG8nO1xuICAgICAgdGhpcy5fdXNlRW1wdHlJY29uID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3VzZUVtcHR5SW1hZ2UgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgfVxuXG4gIHB1YmxpYyBlbnN1cmVPRm9ybVZhbHVlKHZhbDogYW55KTogdm9pZCB7XG4gICAgaWYgKHZhbCBpbnN0YW5jZW9mIE9Gb3JtVmFsdWUpIHtcbiAgICAgIGlmICh2YWwudmFsdWUgJiYgdmFsLnZhbHVlLmJ5dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbC52YWx1ZS5ieXRlcyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh2YWwudmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodmFsICYmICEodmFsIGluc3RhbmNlb2YgT0Zvcm1WYWx1ZSkpIHtcbiAgICAgIGlmICh2YWwuYnl0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSB2YWwuYnl0ZXM7XG4gICAgICB9IGVsc2UgaWYgKHZhbC5sZW5ndGggPiAzMDAgJiYgdmFsLnN1YnN0cmluZygwLCA0KSA9PT0gJ2RhdGEnKSB7XG4gICAgICAgIC8vIFJlbW92aW5nIFwiZGF0YTppbWFnZS8qO2Jhc2U2NCxcIlxuICAgICAgICB2YWwgPSB2YWwuc3Vic3RyaW5nKHZhbC5pbmRleE9mKCdiYXNlNjQnKSArIDcpO1xuICAgICAgfVxuICAgICAgdGhpcy52YWx1ZSA9IG5ldyBPRm9ybVZhbHVlKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSBuZXcgT0Zvcm1WYWx1ZSh1bmRlZmluZWQpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5nZXRWYWx1ZSgpIHx8IHRoaXMuZ2V0VmFsdWUoKS5sZW5ndGggPT09IDA7XG4gIH1cblxuICBwdWJsaWMgY3JlYXRlRm9ybUNvbnRyb2woKTogT0Zvcm1Db250cm9sIHtcbiAgICB0aGlzLl9mQ29udHJvbCA9IHN1cGVyLmNyZWF0ZUZvcm1Db250cm9sKCk7XG4gICAgdGhpcy5fZkNvbnRyb2wuZkNvbnRyb2xDaGlsZHJlbiA9IFt0aGlzLnN0YXRlQ3RybF07XG4gICAgcmV0dXJuIHRoaXMuX2ZDb250cm9sO1xuICB9XG5cbiAgcHVibGljIGZpbGVDaGFuZ2UoaW5wdXQpOiB2b2lkIHtcbiAgICBpZiAoaW5wdXQuZmlsZXNbMF0pIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHJlYWRlci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZXZlbnQgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gZXZlbnQudGFyZ2V0WydyZXN1bHQnXTtcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubGVuZ3RoID4gMzAwICYmIHJlc3VsdC5zdWJzdHJpbmcoMCwgNCkgPT09ICdkYXRhJykge1xuICAgICAgICAgIC8vIFJlbW92aW5nIFwiZGF0YTppbWFnZS8qO2Jhc2U2NCxcIlxuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zdWJzdHJpbmcocmVzdWx0LmluZGV4T2YoJ2Jhc2U2NCcpICsgNyk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5zZXRWYWx1ZShyZXN1bHQpO1xuICAgICAgICBpZiAoc2VsZi5fZkNvbnRyb2wpIHtcbiAgICAgICAgICBzZWxmLl9mQ29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9LCBmYWxzZSk7XG4gICAgICBpZiAoaW5wdXQuZmlsZXNbMF0pIHtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoaW5wdXQuZmlsZXNbMF0pO1xuICAgICAgfVxuICAgICAgLy8gaWYgKHRoaXMudGl0bGVMYWJlbCkge1xuICAgICAgLy8gICB0aGlzLnRpdGxlTGFiZWwubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudCA9IGlucHV0LmZpbGVzWzBdLm5hbWU7XG4gICAgICAvLyB9XG4gICAgICB0aGlzLmN1cnJlbnRGaWxlTmFtZSA9IGlucHV0LmZpbGVzWzBdLm5hbWU7XG4gICAgICB0aGlzLnN0YXRlQ3RybC5zZXRWYWx1ZSh0aGlzLmN1cnJlbnRGaWxlTmFtZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5vdEZvdW5kSW1hZ2VVcmwoZXZlbnQpOiBhbnkge1xuICAgIGV2ZW50LnRhcmdldC5zcmMgPSBVdGlsLmlzRGVmaW5lZCh0aGlzLm5vdGZvdW5kaW1hZ2UpID8gdGhpcy5ub3Rmb3VuZGltYWdlIDogJyc7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3JjVmFsdWUoKTogYW55IHtcbiAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLnZhbHVlKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCAmJiB0aGlzLnZhbHVlLnZhbHVlLmJ5dGVzKSB7XG4gICAgICAgIGxldCBzcmM6IHN0cmluZyA9ICcnO1xuICAgICAgICBpZiAodGhpcy52YWx1ZS52YWx1ZS5ieXRlcy5zdWJzdHJpbmcoMCwgNCkgPT09ICdkYXRhJykge1xuICAgICAgICAgIHNyYyA9ICdkYXRhOmltYWdlLyo7YmFzZTY0LCcgKyB0aGlzLnZhbHVlLnZhbHVlLmJ5dGVzLnN1YnN0cmluZyh0aGlzLnZhbHVlLnZhbHVlLmJ5dGVzLmluZGV4T2YoJ2Jhc2U2NCcpICsgNyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3JjID0gJ2RhdGE6aW1hZ2UvKjtiYXNlNjQsJyArIHRoaXMudmFsdWUudmFsdWUuYnl0ZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0VXJsKHNyYyk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLnZhbHVlLnZhbHVlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICB0aGlzLnZhbHVlLnZhbHVlLmxlbmd0aCA+IDMwMCkge1xuICAgICAgICBsZXQgc3JjOiBzdHJpbmcgPSAnJztcbiAgICAgICAgaWYgKHRoaXMudmFsdWUudmFsdWUuc3Vic3RyaW5nKDAsIDQpID09PSAnZGF0YScpIHtcbiAgICAgICAgICBzcmMgPSAnZGF0YTppbWFnZS8qO2Jhc2U2NCwnICsgdGhpcy52YWx1ZS52YWx1ZS5zdWJzdHJpbmcodGhpcy52YWx1ZS52YWx1ZS5pbmRleE9mKCdiYXNlNjQnKSArIDcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNyYyA9ICdkYXRhOmltYWdlLyo7YmFzZTY0LCcgKyB0aGlzLnZhbHVlLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFVybChzcmMpO1xuICAgICAgfVxuICAgICAgaWYodGhpcy52YWx1ZS52YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVtcHR5aW1hZ2U7XG4gICAgICB9IFxuICAgIH0gZWxzZSBpZiAodGhpcy5lbXB0eWltYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5lbXB0eWltYWdlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrQmxvY2tlcihldnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcHVibGljIG9uQ2xpY2tDbGVhclZhbHVlKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUmVhZE9ubHkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICBzdXBlci5vbkNsaWNrQ2xlYXJWYWx1ZShlKTtcbiAgICAgIHRoaXMuZmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUgPSAnJztcbiAgICAgIC8vIGlmICh0aGlzLnRpdGxlTGFiZWwpIHtcbiAgICAgIC8vICAgdGhpcy50aXRsZUxhYmVsLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIC8vIH1cbiAgICAgIHRoaXMuc3RhdGVDdHJsLnJlc2V0KCk7XG4gICAgICB0aGlzLmN1cnJlbnRGaWxlTmFtZSA9ICcnO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgIHRoaXMuX2ZDb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFzQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd0NvbnRyb2xzO1xuICB9XG5cbiAgcHVibGljIHVzZUVtcHR5SWNvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fdXNlRW1wdHlJY29uICYmIHRoaXMuaXNFbXB0eSgpO1xuICB9XG5cbiAgcHVibGljIHVzZUVtcHR5SW1hZ2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZUVtcHR5SW1hZ2UgJiYgdGhpcy5pc0VtcHR5KCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rm9ybUdyb3VwKCk6IEZvcm1Hcm91cCB7XG4gICAgbGV0IGZvcm1Hcm91cDogRm9ybUdyb3VwID0gc3VwZXIuZ2V0Rm9ybUdyb3VwKCk7XG4gICAgaWYgKCFmb3JtR3JvdXApIHtcbiAgICAgIGZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuICAgICAgZm9ybUdyb3VwLmFkZENvbnRyb2wodGhpcy5nZXRBdHRyaWJ1dGUoKSwgdGhpcy5nZXRDb250cm9sKCkpO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybUdyb3VwO1xuICB9XG5cbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxuICBnZXQgaG9zdEhlaWdodCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIHB1YmxpYyBvcGVuRnVsbFNjcmVlbihlPzogRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZy5vcGVuKE9GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50LCB7XG4gICAgICB3aWR0aDogJzkwJScsXG4gICAgICBoZWlnaHQ6ICc5MCUnLFxuICAgICAgcm9sZTogJ2RpYWxvZycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IGZhbHNlLFxuICAgICAgcGFuZWxDbGFzczogJ28taW1hZ2UtZnVsbHNjcmVlbi1kaWFsb2ctY2RrLW92ZXJsYXknLFxuICAgICAgZGF0YTogdGhpcy5nZXRTcmNWYWx1ZSgpXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb3BlbkZpbGVTZWxlY3RvcihlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5maWxlSW5wdXQpKSB7XG4gICAgICB0aGlzLmZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LmNsaWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGludGVybmFsRm9ybUNvbnRyb2woKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5nZXRBdHRyaWJ1dGUoKSArICdfdmFsdWUnO1xuICB9XG5cbn1cbiJdfQ==