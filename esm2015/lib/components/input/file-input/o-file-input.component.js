import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { fileServiceFactory } from '../../../services/factories';
import { OntimizeFileService } from '../../../services/ontimize/ontimize-file.service';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFileItem } from './o-file-item.class';
import { OFileUploader } from './o-file-uploader.class';
export const DEFAULT_INPUTS_O_FILE_INPUT = [
    'oattr: attr',
    'olabel: label',
    'floatLabel: float-label',
    'oplaceholder: placeholder',
    'tooltip',
    'tooltipPosition: tooltip-position',
    'tooltipShowDelay: tooltip-show-delay',
    'tooltipHideDelay: tooltip-hide-delay',
    'enabled',
    'orequired: required',
    'service',
    'entity',
    'serviceType : service-type',
    'width',
    'readOnly: read-only',
    'clearButton: clear-button',
    'acceptFileType: accept-file-type',
    'maxFileSize: max-file-size',
    'multiple',
    'maxFiles: max-files',
    'showInfo: show-info',
    'splitUpload: split-upload',
    'additionalData: additional-data',
    'appearance',
    'hideRequiredMarker:hide-required-marker',
    'labelVisible:label-visible'
];
export const DEFAULT_OUTPUTS_O_FILE_INPUT = [
    ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
    'onBeforeUpload',
    'onBeforeUploadFile',
    'onProgress',
    'onProgressFile',
    'onCancel',
    'onCancelFile',
    'onUpload',
    'onUploadFile',
    'onComplete',
    'onCompleteFile',
    'onError',
    'onErrorFile'
];
const ɵ0 = fileServiceFactory;
export class OFileInputComponent extends OFormDataComponent {
    constructor(form, elRef, injector) {
        super(form, elRef, injector);
        this.autoBinding = false;
        this.autoRegistering = false;
        this.showInfo = false;
        this.multiple = false;
        this.splitUpload = true;
        this.maxFiles = -1;
        this.onBeforeUpload = new EventEmitter();
        this.onBeforeUploadFile = new EventEmitter();
        this.onProgress = new EventEmitter();
        this.onProgressFile = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.onCancelFile = new EventEmitter();
        this.onUpload = new EventEmitter();
        this.onUploadFile = new EventEmitter();
        this.onComplete = new EventEmitter();
        this.onCompleteFile = new EventEmitter();
        this.onError = new EventEmitter();
        this.onErrorFile = new EventEmitter();
    }
    ngOnInit() {
        super.ngOnInit();
        this.initialize();
        this.uploader.onBeforeUploadAll = () => this.onBeforeUpload.emit();
        this.uploader.onBeforeUploadItem = item => this.onBeforeUploadFile.emit(item);
        this.uploader.onProgressAll = progress => this.onProgress.emit(progress);
        this.uploader.onProgressItem = (item, progress) => this.onProgressFile.emit({ item: item, progress: progress });
        this.uploader.onCancelAll = () => this.onCancel.emit();
        this.uploader.onCancelItem = item => this.onCancelFile.emit();
        this.uploader.onSuccessAll = response => this.onUpload.emit({ response: response });
        this.uploader.onSuccessItem = (item, response) => this.onUploadFile.emit({ item: item, response: response });
        this.uploader.onCompleteAll = () => this.onComplete.emit();
        this.uploader.onCompleteItem = item => this.onCompleteFile.emit(item);
        this.uploader.onErrorAll = error => this.onError.emit(error);
        this.uploader.onErrorItem = (item, error) => this.onErrorFile.emit({ item: item, error: error });
    }
    initialize() {
        super.initialize();
        if (!this.service) {
            this.service = this.form.service;
        }
        if (!this.entity) {
            this.entity = this.form.entity;
        }
        this.configureService();
        this.uploader = new OFileUploader(this.fileService, this.entity);
        this.uploader.splitUpload = this.splitUpload;
    }
    configureService() {
        let loadingService = OntimizeFileService;
        if (this.serviceType) {
            loadingService = this.serviceType;
        }
        try {
            this.fileService = this.injector.get(loadingService);
            if (this.fileService) {
                const serviceCfg = this.fileService.getDefaultServiceConfiguration(this.service);
                if (this.entity) {
                    serviceCfg.entity = this.entity;
                }
                this.fileService.configureService(serviceCfg);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    resolveValidators() {
        const validators = super.resolveValidators();
        if (this.acceptFileType) {
            validators.push(this.filetypeValidator.bind(this));
        }
        if (this.maxFileSize) {
            validators.push(this.maxFileSizeValidator.bind(this));
        }
        if (this.multiple && this.maxFiles !== -1) {
            validators.push(this.maxFilesValidator.bind(this));
        }
        return validators;
    }
    fileSelected(event) {
        let value = '';
        if (event) {
            const target = event.target || event.srcElement;
            if (target.files.length > 0) {
                const files = target.files;
                if (!this.multiple) {
                    this.uploader.clear();
                }
                for (let i = 0, f; i < files.length; i++) {
                    f = files[i];
                    const fileItem = new OFileItem(f, this.uploader);
                    this.uploader.addFile(fileItem);
                }
                value = this.uploader.files.map(file => file.name).join(', ');
                window.setTimeout(() => {
                    this.setValue(value !== '' ? value : undefined, { changeType: OValueChangeEvent.USER_CHANGE });
                    if (this._fControl) {
                        this._fControl.markAsTouched();
                    }
                }, 0);
            }
        }
    }
    onClickClearValue(e) {
        super.onClickClearValue(e);
        this.uploader.clear();
    }
    clearValue() {
        super.clearValue();
        this.uploader.clear();
    }
    onClickUpload(e) {
        e.stopPropagation();
        if (this.isValid) {
            this.upload();
        }
    }
    upload() {
        this.uploader.upload();
    }
    get files() {
        return this.uploader.files;
    }
    get additionalData() {
        if (this.uploader) {
            return this.uploader.data;
        }
        return null;
    }
    set additionalData(data) {
        if (this.uploader) {
            this.uploader.data = data;
        }
    }
    innerOnChange(event) {
        this.ensureOFormValue(event);
        if (this._fControl && this._fControl.touched) {
            this._fControl.markAsDirty();
        }
        this.onChange.emit(event);
    }
    filetypeValidator(control) {
        if (control.value && control.value.length > 0 && this.acceptFileType) {
            const regex = new RegExp(this.acceptFileType.replace(';', '|'));
            if (!this.files.every(file => file.type.match(regex) !== null || file.name.substr(file.name.lastIndexOf('.')).match(regex) !== null)) {
                return {
                    fileType: {
                        allowedFileTypes: this.acceptFileType.replace(';', ', ')
                    }
                };
            }
        }
        return {};
    }
    maxFileSizeValidator(control) {
        if (control.value && control.value.length > 0 && this.maxFileSize) {
            if (!this.files.every(file => file.size < this.maxFileSize)) {
                return {
                    fileSize: {
                        maxFileSize: this.maxFileSize
                    }
                };
            }
        }
        return {};
    }
    maxFilesValidator(control) {
        if (control.value && control.value.length > 0 && this.multiple && this.maxFiles !== -1) {
            if (this.maxFiles < this.files.length) {
                return {
                    numFile: {
                        maxFiles: this.maxFiles
                    }
                };
            }
        }
        return {};
    }
}
OFileInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-file-input',
                template: "<div fxLayout=\"row\" fxLayoutAlign=\"space-between center\" [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\" [matTooltipHideDelay]=\"tooltipHideDelay\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\"  [hideRequiredMarker]=\"hideRequiredMarker\" [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\"\n    (click)=\"!enabled || isReadOnly ? null : inputFile.click()\" fxFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input #inputShowValue matInput type=\"text\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\" [placeholder]=\"placeHolder\"\n      [required]=\"isRequired\" readonly (change)=\"onChangeEvent($event)\">\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <button type=\"button\" *ngIf=\"getValue()\" [disabled]=\"!isValid || uploader.isUploading\" matSuffix mat-icon-button (click)=\"onClickUpload($event)\">\n      <mat-icon>file_upload</mat-icon>\n    </button>\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('fileType')\" text=\"{{ 'FORM_VALIDATION.FILE_TYPE' | oTranslate}} ({{ getErrorValue('fileType','allowedFileTypes') }})\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('fileSize')\"\n      text=\"{{ 'FORM_VALIDATION.FILE_MAXSIZE' | oTranslate }}: {{ getErrorValue('fileSize', 'maxFileSize') }} bytes\"></mat-error>\n    <mat-error *ngIf=\"hasError('numFile')\" text=\"{{ 'FORM_VALIDATION.FILE_MAXNUM' | oTranslate }}: {{ getErrorValue('numFile', 'maxFiles') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n  <input #inputFile type=\"file\" id=\"{{getAttribute()+'-file-input'}}\" [attr.accept]=\"acceptFileType ? acceptFileType.replace(';',',') : null\"\n    (change)=\"fileSelected($event)\" hidden=\"true\" [attr.multiple]=\"multiple ? '' : null\">\n  <div *ngIf=\"showInfo && files\">\n    <mat-progress-bar *ngIf=\"!splitUpload && uploader.isUploading\" color=\"accent\" mode=\"determinate\" [value]=\"uploader.progress\"></mat-progress-bar>\n    <mat-list>\n      <mat-list-item *ngFor=\"let file of files\">\n        <mat-icon mat-list-icon>insert_drive_file</mat-icon>\n        <span mat-line>{{ file.name }}</span>\n        <div fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n          <mat-progress-spinner *ngIf=\"splitUpload && file.isUploading\" color=\"accent\" mode=\"determinate\" [value]=\"file.progress\" class=\"uploading\"\n            diameter=\"3\" strokeWidth=\"3\"></mat-progress-spinner>\n          <mat-icon *ngIf=\"splitUpload && file.isUploaded && file.isSuccess\" class=\"uploaded\" svgIcon=\"ontimize:check_circle\"></mat-icon>\n          <mat-icon *ngIf=\"splitUpload && file.isUploaded && file.isError\" class=\"error\" svgIcon=\"ontimize:error_outline\"></mat-icon>\n        </div>\n      </mat-list-item>\n    </mat-list>\n  </div>\n</div>\n",
                inputs: DEFAULT_INPUTS_O_FILE_INPUT,
                outputs: DEFAULT_OUTPUTS_O_FILE_INPUT,
                providers: [
                    { provide: OntimizeFileService, useFactory: ɵ0, deps: [Injector] }
                ],
                styles: [".o-file-input-buttons{position:absolute;top:0;bottom:0;right:0;margin:auto}mat-icon.uploaded{color:#0f9d58}mat-icon.error{color:#d50000}"]
            }] }
];
OFileInputComponent.ctorParameters = () => [
    { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: ElementRef },
    { type: Injector }
];
OFileInputComponent.propDecorators = {
    inputFile: [{ type: ViewChild, args: ['inputFile', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFileInputComponent.prototype, "showInfo", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFileInputComponent.prototype, "multiple", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OFileInputComponent.prototype, "splitUpload", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Number)
], OFileInputComponent.prototype, "maxFiles", void 0);
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWxlLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9maWxlLWlucHV0L28tZmlsZS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRy9ILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUVyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDOUcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV4RCxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRztJQUN6QyxhQUFhO0lBQ2IsZUFBZTtJQUNmLHlCQUF5QjtJQUN6QiwyQkFBMkI7SUFDM0IsU0FBUztJQUNULG1DQUFtQztJQUNuQyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLFNBQVM7SUFDVCxxQkFBcUI7SUFDckIsU0FBUztJQUNULFFBQVE7SUFDUiw0QkFBNEI7SUFDNUIsT0FBTztJQUNQLHFCQUFxQjtJQUNyQiwyQkFBMkI7SUFJM0Isa0NBQWtDO0lBR2xDLDRCQUE0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NUMsTUFBTSxFQUFFLDJCQUEyQjtnQkFDbkMsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsU0FBUyxFQUFFO29CQUNULEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFVBQVUsSUFBb0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRTtpQkFDbkY7O2FBQ0Y7OztZQTNFUSxjQUFjLHVCQWtIbEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBekhwQyxVQUFVO1lBQW9DLFFBQVE7Ozt3QkF1RnZFLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQU16QztJQURDLGNBQWMsRUFBRTs7cURBQ2dCO0FBRWpDO0lBREMsY0FBYyxFQUFFOztxREFDZ0I7QUFFakM7SUFEQyxjQUFjLEVBQUU7O3dEQUNrQjtBQUluQztJQURDLGNBQWMsRUFBRTs7cURBQ1kiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25Jbml0LCBPcHRpb25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9maWxlLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IGZpbGVTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBPbnRpbWl6ZUZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvb250aW1pemUvb250aW1pemUtZmlsZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsIE9Gb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPVmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gJy4uLy4uL28tdmFsdWUtY2hhbmdlLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7IE9GaWxlSXRlbSB9IGZyb20gJy4vby1maWxlLWl0ZW0uY2xhc3MnO1xuaW1wb3J0IHsgT0ZpbGVVcGxvYWRlciB9IGZyb20gJy4vby1maWxlLXVwbG9hZGVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRklMRV9JTlBVVCA9IFtcbiAgJ29hdHRyOiBhdHRyJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAnZmxvYXRMYWJlbDogZmxvYXQtbGFiZWwnLFxuICAnb3BsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcicsXG4gICd0b29sdGlwJyxcbiAgJ3Rvb2x0aXBQb3NpdGlvbjogdG9vbHRpcC1wb3NpdGlvbicsXG4gICd0b29sdGlwU2hvd0RlbGF5OiB0b29sdGlwLXNob3ctZGVsYXknLFxuICAndG9vbHRpcEhpZGVEZWxheTogdG9vbHRpcC1oaWRlLWRlbGF5JyxcbiAgJ2VuYWJsZWQnLFxuICAnb3JlcXVpcmVkOiByZXF1aXJlZCcsXG4gICdzZXJ2aWNlJyxcbiAgJ2VudGl0eScsXG4gICdzZXJ2aWNlVHlwZSA6IHNlcnZpY2UtdHlwZScsXG4gICd3aWR0aCcsXG4gICdyZWFkT25seTogcmVhZC1vbmx5JyxcbiAgJ2NsZWFyQnV0dG9uOiBjbGVhci1idXR0b24nLFxuXG4gIC8vIGFjY2VwdC1maWxlLXR5cGUgW3N0cmluZ106IGZpbGUgdHlwZXMgYWxsb3dlZCBvbiB0aGUgZmlsZSBpbnB1dCwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gIC8vIGZpbGVfZXh0ZW5zaW9uLCBhdWRpby8qLCB2aWRlby8qLCBpbWFnZS8qLCBtZWRpYV90eXBlLiBTZWUgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL2F0dF9pbnB1dF9hY2NlcHQuYXNwXG4gICdhY2NlcHRGaWxlVHlwZTogYWNjZXB0LWZpbGUtdHlwZScsXG5cbiAgLy8gbWF4LWZpbGUtc2l6ZSBbbnVtYmVyXTogbWF4aW11bSBmaWxlIHNpemUgYWxsb3dlZCwgaW4gYnl0ZXMuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnbWF4RmlsZVNpemU6IG1heC1maWxlLXNpemUnLFxuXG4gIC8vIG11bHRpcGxlIFtib29sZWFuXTogbXVsdGlwbGUgZmlsZSBzZWxlY3Rpb24gYWxsb3dlZC4gRGVmYXVsdDogbm8uXG4gICdtdWx0aXBsZScsXG5cbiAgLy8gbWF4LWZpbGVzIFtudW1iZXJdOiBtYXhpbXVtIG51bWJlciBvZiBmaWxlcyBhbGxvd2VkLiBEZWZhdWx0OiAtMS5cbiAgJ21heEZpbGVzOiBtYXgtZmlsZXMnLFxuXG4gIC8vIHNob3ctaW5mbyBbYm9vbGVhbl06IHNob3cgZmlsZXMgaW5mb3JtYXRpb24uIERlZmF1bHQ6IG5vLlxuICAnc2hvd0luZm86IHNob3ctaW5mbycsXG5cbiAgLy8gc3BsaXQtdXBsb2FkIFtib29sZWFuXTogZWFjaCBmaWxlIGlzIHVwbG9hZGVkIGluIGEgcmVxdWVzdCAodHJ1ZSkgb3IgYWxsIGZpbGVzIGFyZSB1cGxvYWRlZCBpbiBhIHNpbmdsZSByZXF1ZXN0IChmYWxzZSkuIERlZmF1bHQ6IHllcy5cbiAgJ3NwbGl0VXBsb2FkOiBzcGxpdC11cGxvYWQnLFxuXG4gIC8vIGFkZGl0aW9uYWwtZGF0YSBbSlNPTl06IHVzZWQgdG8gc2VuZCBhZGl0aW9uYWwgaW5mb3JtYXRpb24gaW4gdGhlIHVwbG9hZCByZXF1ZXN0LlxuICAnYWRkaXRpb25hbERhdGE6IGFkZGl0aW9uYWwtZGF0YScsXG4gICdhcHBlYXJhbmNlJyxcbiAgJ2hpZGVSZXF1aXJlZE1hcmtlcjpoaWRlLXJlcXVpcmVkLW1hcmtlcicsXG4gICdsYWJlbFZpc2libGU6bGFiZWwtdmlzaWJsZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19GSUxFX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnb25CZWZvcmVVcGxvYWQnLFxuICAnb25CZWZvcmVVcGxvYWRGaWxlJyxcbiAgJ29uUHJvZ3Jlc3MnLFxuICAnb25Qcm9ncmVzc0ZpbGUnLFxuICAnb25DYW5jZWwnLFxuICAnb25DYW5jZWxGaWxlJyxcbiAgJ29uVXBsb2FkJyxcbiAgJ29uVXBsb2FkRmlsZScsXG4gICdvbkNvbXBsZXRlJyxcbiAgJ29uQ29tcGxldGVGaWxlJyxcbiAgJ29uRXJyb3InLFxuICAnb25FcnJvckZpbGUnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZpbGUtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1maWxlLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1maWxlLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GSUxFX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19GSUxFX0lOUFVULFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE9udGltaXplRmlsZVNlcnZpY2UsIHVzZUZhY3Rvcnk6IGZpbGVTZXJ2aWNlRmFjdG9yeSwgZGVwczogW0luamVjdG9yXSB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT0ZpbGVJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHVibGljIHVwbG9hZGVyOiBPRmlsZVVwbG9hZGVyO1xuICBwdWJsaWMgZmlsZVNlcnZpY2U6IElGaWxlU2VydmljZTtcbiAgQFZpZXdDaGlsZCgnaW5wdXRGaWxlJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBpbnB1dEZpbGU6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIGF1dG9CaW5kaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBhdXRvUmVnaXN0ZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dJbmZvOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc3BsaXRVcGxvYWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgYWNjZXB0RmlsZVR5cGU6IHN0cmluZztcbiAgcHVibGljIG1heEZpbGVTaXplOiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtYXhGaWxlczogbnVtYmVyID0gLTE7XG5cbiAgcHVibGljIG9uQmVmb3JlVXBsb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25CZWZvcmVVcGxvYWRGaWxlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25Qcm9ncmVzczogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uUHJvZ3Jlc3NGaWxlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25DYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkNhbmNlbEZpbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvblVwbG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uVXBsb2FkRmlsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uQ29tcGxldGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkNvbXBsZXRlRmlsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uRXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkVycm9yRmlsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcm90ZWN0ZWQgc2VydmljZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXR5OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBzZXJ2aWNlVHlwZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMudXBsb2FkZXIub25CZWZvcmVVcGxvYWRBbGwgPSAoKSA9PiB0aGlzLm9uQmVmb3JlVXBsb2FkLmVtaXQoKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uQmVmb3JlVXBsb2FkSXRlbSA9IGl0ZW0gPT4gdGhpcy5vbkJlZm9yZVVwbG9hZEZpbGUuZW1pdChpdGVtKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uUHJvZ3Jlc3NBbGwgPSBwcm9ncmVzcyA9PiB0aGlzLm9uUHJvZ3Jlc3MuZW1pdChwcm9ncmVzcyk7XG4gICAgdGhpcy51cGxvYWRlci5vblByb2dyZXNzSXRlbSA9IChpdGVtLCBwcm9ncmVzcykgPT4gdGhpcy5vblByb2dyZXNzRmlsZS5lbWl0KHsgaXRlbTogaXRlbSwgcHJvZ3Jlc3M6IHByb2dyZXNzIH0pO1xuICAgIHRoaXMudXBsb2FkZXIub25DYW5jZWxBbGwgPSAoKSA9PiB0aGlzLm9uQ2FuY2VsLmVtaXQoKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uQ2FuY2VsSXRlbSA9IGl0ZW0gPT4gdGhpcy5vbkNhbmNlbEZpbGUuZW1pdCgpO1xuICAgIHRoaXMudXBsb2FkZXIub25TdWNjZXNzQWxsID0gcmVzcG9uc2UgPT4gdGhpcy5vblVwbG9hZC5lbWl0KHsgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICAgIHRoaXMudXBsb2FkZXIub25TdWNjZXNzSXRlbSA9IChpdGVtLCByZXNwb25zZSkgPT4gdGhpcy5vblVwbG9hZEZpbGUuZW1pdCh7IGl0ZW06IGl0ZW0sIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uQ29tcGxldGVBbGwgPSAoKSA9PiB0aGlzLm9uQ29tcGxldGUuZW1pdCgpO1xuICAgIHRoaXMudXBsb2FkZXIub25Db21wbGV0ZUl0ZW0gPSBpdGVtID0+IHRoaXMub25Db21wbGV0ZUZpbGUuZW1pdChpdGVtKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uRXJyb3JBbGwgPSBlcnJvciA9PiB0aGlzLm9uRXJyb3IuZW1pdChlcnJvcik7XG4gICAgdGhpcy51cGxvYWRlci5vbkVycm9ySXRlbSA9IChpdGVtLCBlcnJvcikgPT4gdGhpcy5vbkVycm9yRmlsZS5lbWl0KHsgaXRlbTogaXRlbSwgZXJyb3I6IGVycm9yIH0pO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKCF0aGlzLnNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc2VydmljZSA9IHRoaXMuZm9ybS5zZXJ2aWNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZW50aXR5KSB7XG4gICAgICB0aGlzLmVudGl0eSA9IHRoaXMuZm9ybS5lbnRpdHk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gICAgdGhpcy51cGxvYWRlciA9IG5ldyBPRmlsZVVwbG9hZGVyKHRoaXMuZmlsZVNlcnZpY2UsIHRoaXMuZW50aXR5KTtcbiAgICB0aGlzLnVwbG9hZGVyLnNwbGl0VXBsb2FkID0gdGhpcy5zcGxpdFVwbG9hZDtcbiAgfVxuXG4gIHB1YmxpYyBjb25maWd1cmVTZXJ2aWNlKCk6IHZvaWQge1xuICAgIGxldCBsb2FkaW5nU2VydmljZTogYW55ID0gT250aW1pemVGaWxlU2VydmljZTtcbiAgICBpZiAodGhpcy5zZXJ2aWNlVHlwZSkge1xuICAgICAgbG9hZGluZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VUeXBlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5maWxlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0PE9udGltaXplRmlsZVNlcnZpY2U+KGxvYWRpbmdTZXJ2aWNlKTtcbiAgICAgIGlmICh0aGlzLmZpbGVTZXJ2aWNlKSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2VDZmc6IGFueSA9IHRoaXMuZmlsZVNlcnZpY2UuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKHRoaXMuc2VydmljZSk7XG4gICAgICAgIGlmICh0aGlzLmVudGl0eSkge1xuICAgICAgICAgIHNlcnZpY2VDZmcuZW50aXR5ID0gdGhpcy5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maWxlU2VydmljZS5jb25maWd1cmVTZXJ2aWNlKHNlcnZpY2VDZmcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmICh0aGlzLmFjY2VwdEZpbGVUeXBlKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5maWxldHlwZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF4RmlsZVNpemUpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1heEZpbGVTaXplVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB0aGlzLm1heEZpbGVzICE9PSAtMSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4RmlsZXNWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgcHVibGljIGZpbGVTZWxlY3RlZChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgdmFsdWU6IHN0cmluZyA9ICcnO1xuICAgIGlmIChldmVudCkge1xuICAgICAgY29uc3QgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcbiAgICAgIGlmICh0YXJnZXQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBmaWxlczogRmlsZUxpc3QgPSB0YXJnZXQuZmlsZXM7XG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMudXBsb2FkZXIuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgZjogRmlsZTsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZiA9IGZpbGVzW2ldO1xuICAgICAgICAgIGNvbnN0IGZpbGVJdGVtOiBPRmlsZUl0ZW0gPSBuZXcgT0ZpbGVJdGVtKGYsIHRoaXMudXBsb2FkZXIpO1xuICAgICAgICAgIHRoaXMudXBsb2FkZXIuYWRkRmlsZShmaWxlSXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSB0aGlzLnVwbG9hZGVyLmZpbGVzLm1hcChmaWxlID0+IGZpbGUubmFtZSkuam9pbignLCAnKTtcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSAhPT0gJycgPyB2YWx1ZSA6IHVuZGVmaW5lZCwgeyBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSB9KTtcbiAgICAgICAgICBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZDb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBzdXBlci5vbkNsaWNrQ2xlYXJWYWx1ZSgpO1xuICAgKiBzdXBlci5jbGVhclZhbHVlKCkgdnMgc3VwZXIub25DbGlja0NsZWFyVmFsdWUoKVxuICAgKiAgKiBzdXBlci5jbGVhclZhbHVlKCkgZW1pdCBPVmFsdWVDaGFuZ2VFdmVudC5QUk9HUkFNTUFUSUNfQ0hBTkdFXG4gICAqICAqIHN1cGVyLm9uQ2xpY2tDbGVhclZhbHVlKCkgZW1pdCBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRVxuICAgKi9cbiAgcHVibGljIG9uQ2xpY2tDbGVhclZhbHVlKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIub25DbGlja0NsZWFyVmFsdWUoZSk7XG4gICAgdGhpcy51cGxvYWRlci5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHN1cGVyLmNsZWFyVmFsdWUoKTtcbiAgICovXG4gIHB1YmxpYyBjbGVhclZhbHVlKCk6IHZvaWQge1xuICAgIHN1cGVyLmNsZWFyVmFsdWUoKTtcbiAgICB0aGlzLnVwbG9hZGVyLmNsZWFyKCk7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja1VwbG9hZChlOiBFdmVudCk6IHZvaWQge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuaXNWYWxpZCkge1xuICAgICAgdGhpcy51cGxvYWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBsb2FkKCk6IHZvaWQge1xuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkKCk7XG4gIH1cblxuICBnZXQgZmlsZXMoKTogT0ZpbGVJdGVtW10ge1xuICAgIHJldHVybiB0aGlzLnVwbG9hZGVyLmZpbGVzO1xuICB9XG5cbiAgZ2V0IGFkZGl0aW9uYWxEYXRhKCk6IGFueSB7XG4gICAgaWYgKHRoaXMudXBsb2FkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZGVyLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2V0IGFkZGl0aW9uYWxEYXRhKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLnVwbG9hZGVyKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyLmRhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbm5lck9uQ2hhbmdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmVuc3VyZU9Gb3JtVmFsdWUoZXZlbnQpO1xuICAgIGlmICh0aGlzLl9mQ29udHJvbCAmJiB0aGlzLl9mQ29udHJvbC50b3VjaGVkKSB7XG4gICAgICB0aGlzLl9mQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgIH1cbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZpbGV0eXBlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKGNvbnRyb2wudmFsdWUgJiYgY29udHJvbC52YWx1ZS5sZW5ndGggPiAwICYmIHRoaXMuYWNjZXB0RmlsZVR5cGUpIHtcbiAgICAgIGNvbnN0IHJlZ2V4OiBSZWdFeHAgPSBuZXcgUmVnRXhwKHRoaXMuYWNjZXB0RmlsZVR5cGUucmVwbGFjZSgnOycsICd8JykpO1xuICAgICAgaWYgKCF0aGlzLmZpbGVzLmV2ZXJ5KGZpbGUgPT4gZmlsZS50eXBlLm1hdGNoKHJlZ2V4KSAhPT0gbnVsbCB8fCBmaWxlLm5hbWUuc3Vic3RyKGZpbGUubmFtZS5sYXN0SW5kZXhPZignLicpKS5tYXRjaChyZWdleCkgIT09IG51bGwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZmlsZVR5cGU6IHtcbiAgICAgICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IHRoaXMuYWNjZXB0RmlsZVR5cGUucmVwbGFjZSgnOycsICcsICcpXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF4RmlsZVNpemVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBpZiAoY29udHJvbC52YWx1ZSAmJiBjb250cm9sLnZhbHVlLmxlbmd0aCA+IDAgJiYgdGhpcy5tYXhGaWxlU2l6ZSkge1xuICAgICAgaWYgKCF0aGlzLmZpbGVzLmV2ZXJ5KGZpbGUgPT4gZmlsZS5zaXplIDwgdGhpcy5tYXhGaWxlU2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWxlU2l6ZToge1xuICAgICAgICAgICAgbWF4RmlsZVNpemU6IHRoaXMubWF4RmlsZVNpemVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXhGaWxlc1ZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmIChjb250cm9sLnZhbHVlICYmIGNvbnRyb2wudmFsdWUubGVuZ3RoID4gMCAmJiB0aGlzLm11bHRpcGxlICYmIHRoaXMubWF4RmlsZXMgIT09IC0xKSB7XG4gICAgICBpZiAodGhpcy5tYXhGaWxlcyA8IHRoaXMuZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbnVtRmlsZToge1xuICAgICAgICAgICAgbWF4RmlsZXM6IHRoaXMubWF4RmlsZXNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxufVxuIl19