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
export var DEFAULT_INPUTS_O_FILE_INPUT = [
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
export var DEFAULT_OUTPUTS_O_FILE_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, [
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
]);
var ɵ0 = fileServiceFactory;
var OFileInputComponent = (function (_super) {
    tslib_1.__extends(OFileInputComponent, _super);
    function OFileInputComponent(form, elRef, injector) {
        var _this = _super.call(this, form, elRef, injector) || this;
        _this.autoBinding = false;
        _this.autoRegistering = false;
        _this.showInfo = false;
        _this.multiple = false;
        _this.splitUpload = true;
        _this.maxFiles = -1;
        _this.onBeforeUpload = new EventEmitter();
        _this.onBeforeUploadFile = new EventEmitter();
        _this.onProgress = new EventEmitter();
        _this.onProgressFile = new EventEmitter();
        _this.onCancel = new EventEmitter();
        _this.onCancelFile = new EventEmitter();
        _this.onUpload = new EventEmitter();
        _this.onUploadFile = new EventEmitter();
        _this.onComplete = new EventEmitter();
        _this.onCompleteFile = new EventEmitter();
        _this.onError = new EventEmitter();
        _this.onErrorFile = new EventEmitter();
        return _this;
    }
    OFileInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.initialize();
        this.uploader.onBeforeUploadAll = function () { return _this.onBeforeUpload.emit(); };
        this.uploader.onBeforeUploadItem = function (item) { return _this.onBeforeUploadFile.emit(item); };
        this.uploader.onProgressAll = function (progress) { return _this.onProgress.emit(progress); };
        this.uploader.onProgressItem = function (item, progress) { return _this.onProgressFile.emit({ item: item, progress: progress }); };
        this.uploader.onCancelAll = function () { return _this.onCancel.emit(); };
        this.uploader.onCancelItem = function (item) { return _this.onCancelFile.emit(); };
        this.uploader.onSuccessAll = function (response) { return _this.onUpload.emit({ response: response }); };
        this.uploader.onSuccessItem = function (item, response) { return _this.onUploadFile.emit({ item: item, response: response }); };
        this.uploader.onCompleteAll = function () { return _this.onComplete.emit(); };
        this.uploader.onCompleteItem = function (item) { return _this.onCompleteFile.emit(item); };
        this.uploader.onErrorAll = function (error) { return _this.onError.emit(error); };
        this.uploader.onErrorItem = function (item, error) { return _this.onErrorFile.emit({ item: item, error: error }); };
    };
    OFileInputComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (!this.service) {
            this.service = this.form.service;
        }
        if (!this.entity) {
            this.entity = this.form.entity;
        }
        this.configureService();
        this.uploader = new OFileUploader(this.fileService, this.entity);
        this.uploader.splitUpload = this.splitUpload;
    };
    OFileInputComponent.prototype.configureService = function () {
        var loadingService = OntimizeFileService;
        if (this.serviceType) {
            loadingService = this.serviceType;
        }
        try {
            this.fileService = this.injector.get(loadingService);
            if (this.fileService) {
                var serviceCfg = this.fileService.getDefaultServiceConfiguration(this.service);
                if (this.entity) {
                    serviceCfg.entity = this.entity;
                }
                this.fileService.configureService(serviceCfg);
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    OFileInputComponent.prototype.resolveValidators = function () {
        var validators = _super.prototype.resolveValidators.call(this);
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
    };
    OFileInputComponent.prototype.fileSelected = function (event) {
        var _this = this;
        var value = '';
        if (event) {
            var target = event.target || event.srcElement;
            if (target.files.length > 0) {
                var files = target.files;
                if (!this.multiple) {
                    this.uploader.clear();
                }
                for (var i = 0, f = void 0; i < files.length; i++) {
                    f = files[i];
                    var fileItem = new OFileItem(f, this.uploader);
                    this.uploader.addFile(fileItem);
                }
                value = this.uploader.files.map(function (file) { return file.name; }).join(', ');
                window.setTimeout(function () {
                    _this.setValue(value !== '' ? value : undefined, { changeType: OValueChangeEvent.USER_CHANGE });
                    if (_this._fControl) {
                        _this._fControl.markAsTouched();
                    }
                }, 0);
            }
        }
    };
    OFileInputComponent.prototype.onClickClearValue = function (e) {
        _super.prototype.onClickClearValue.call(this, e);
        this.uploader.clear();
    };
    OFileInputComponent.prototype.clearValue = function () {
        _super.prototype.clearValue.call(this);
        this.uploader.clear();
    };
    OFileInputComponent.prototype.onClickUpload = function (e) {
        e.stopPropagation();
        if (this.isValid) {
            this.upload();
        }
    };
    OFileInputComponent.prototype.upload = function () {
        this.uploader.upload();
    };
    Object.defineProperty(OFileInputComponent.prototype, "files", {
        get: function () {
            return this.uploader.files;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFileInputComponent.prototype, "additionalData", {
        get: function () {
            if (this.uploader) {
                return this.uploader.data;
            }
            return null;
        },
        set: function (data) {
            if (this.uploader) {
                this.uploader.data = data;
            }
        },
        enumerable: true,
        configurable: true
    });
    OFileInputComponent.prototype.innerOnChange = function (event) {
        this.ensureOFormValue(event);
        if (this._fControl && this._fControl.touched) {
            this._fControl.markAsDirty();
        }
        this.onChange.emit(event);
    };
    OFileInputComponent.prototype.filetypeValidator = function (control) {
        if (control.value && control.value.length > 0 && this.acceptFileType) {
            var regex_1 = new RegExp(this.acceptFileType.replace(';', '|'));
            if (!this.files.every(function (file) { return file.type.match(regex_1) !== null || file.name.substr(file.name.lastIndexOf('.')).match(regex_1) !== null; })) {
                return {
                    fileType: {
                        allowedFileTypes: this.acceptFileType.replace(';', ', ')
                    }
                };
            }
        }
        return {};
    };
    OFileInputComponent.prototype.maxFileSizeValidator = function (control) {
        var _this = this;
        if (control.value && control.value.length > 0 && this.maxFileSize) {
            if (!this.files.every(function (file) { return file.size < _this.maxFileSize; })) {
                return {
                    fileSize: {
                        maxFileSize: this.maxFileSize
                    }
                };
            }
        }
        return {};
    };
    OFileInputComponent.prototype.maxFilesValidator = function (control) {
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
    };
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
    OFileInputComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: ElementRef },
        { type: Injector }
    ]; };
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
    return OFileInputComponent;
}(OFormDataComponent));
export { OFileInputComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWxlLWlucHV0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9maWxlLWlucHV0L28tZmlsZS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRy9ILE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUVyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLHFDQUFxQyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDOUcsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDckUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV4RCxNQUFNLENBQUMsSUFBTSwyQkFBMkIsR0FBRztJQUN6QyxhQUFhO0lBQ2IsZUFBZTtJQUNmLHlCQUF5QjtJQUN6QiwyQkFBMkI7SUFDM0IsU0FBUztJQUNULG1DQUFtQztJQUNuQyxzQ0FBc0M7SUFDdEMsc0NBQXNDO0lBQ3RDLFNBQVM7SUFDVCxxQkFBcUI7SUFDckIsU0FBUztJQUNULFFBQVE7SUFDUiw0QkFBNEI7SUFDNUIsT0FBTztJQUNQLHFCQUFxQjtJQUNyQiwyQkFBMkI7SUFJM0Isa0NBQWtDO0lBR2xDLDRCQUE0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QUMsQ0FBQyxFQUFFO1lBQ3RGLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDckMsT0FBTztvQkFDTCxPQUFPLEVBQUU7d0JBQ1AsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO3FCQUN4QjtpQkFDRixDQUFDO2FBQ0g7U0FDRjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7Z0JBalBGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsdXVHQUE0QztvQkFFNUMsTUFBTSxFQUFFLDJCQUEyQjtvQkFDbkMsT0FBTyxFQUFFLDRCQUE0QjtvQkFDckMsU0FBUyxFQUFFO3dCQUNULEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFVBQVUsSUFBb0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRTtxQkFDbkY7O2lCQUNGOzs7Z0JBM0VRLGNBQWMsdUJBa0hsQixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkF6SHBDLFVBQVU7Z0JBQW9DLFFBQVE7Ozs0QkF1RnZFLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQU16QztRQURDLGNBQWMsRUFBRTs7eURBQ2dCO0lBRWpDO1FBREMsY0FBYyxFQUFFOzt5REFDZ0I7SUFFakM7UUFEQyxjQUFjLEVBQUU7OzREQUNrQjtJQUluQztRQURDLGNBQWMsRUFBRTs7eURBQ1k7SUFzTi9CLDBCQUFDO0NBQUEsQUFsUEQsQ0FVeUMsa0JBQWtCLEdBd08xRDtTQXhPWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgT25Jbml0LCBPcHRpb25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm4gfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgSUZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9maWxlLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IGZpbGVTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBPbnRpbWl6ZUZpbGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvb250aW1pemUvb250aW1pemUtZmlsZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fREFUQV9DT01QT05FTlQsIE9Gb3JtRGF0YUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tZm9ybS1kYXRhLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBPVmFsdWVDaGFuZ2VFdmVudCB9IGZyb20gJy4uLy4uL28tdmFsdWUtY2hhbmdlLWV2ZW50LmNsYXNzJztcbmltcG9ydCB7IE9GaWxlSXRlbSB9IGZyb20gJy4vby1maWxlLWl0ZW0uY2xhc3MnO1xuaW1wb3J0IHsgT0ZpbGVVcGxvYWRlciB9IGZyb20gJy4vby1maWxlLXVwbG9hZGVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRklMRV9JTlBVVCA9IFtcbiAgJ29hdHRyOiBhdHRyJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAnZmxvYXRMYWJlbDogZmxvYXQtbGFiZWwnLFxuICAnb3BsYWNlaG9sZGVyOiBwbGFjZWhvbGRlcicsXG4gICd0b29sdGlwJyxcbiAgJ3Rvb2x0aXBQb3NpdGlvbjogdG9vbHRpcC1wb3NpdGlvbicsXG4gICd0b29sdGlwU2hvd0RlbGF5OiB0b29sdGlwLXNob3ctZGVsYXknLFxuICAndG9vbHRpcEhpZGVEZWxheTogdG9vbHRpcC1oaWRlLWRlbGF5JyxcbiAgJ2VuYWJsZWQnLFxuICAnb3JlcXVpcmVkOiByZXF1aXJlZCcsXG4gICdzZXJ2aWNlJyxcbiAgJ2VudGl0eScsXG4gICdzZXJ2aWNlVHlwZSA6IHNlcnZpY2UtdHlwZScsXG4gICd3aWR0aCcsXG4gICdyZWFkT25seTogcmVhZC1vbmx5JyxcbiAgJ2NsZWFyQnV0dG9uOiBjbGVhci1idXR0b24nLFxuXG4gIC8vIGFjY2VwdC1maWxlLXR5cGUgW3N0cmluZ106IGZpbGUgdHlwZXMgYWxsb3dlZCBvbiB0aGUgZmlsZSBpbnB1dCwgc2VwYXJhdGVkIGJ5ICc7Jy4gRGVmYXVsdDogbm8gdmFsdWUuXG4gIC8vIGZpbGVfZXh0ZW5zaW9uLCBhdWRpby8qLCB2aWRlby8qLCBpbWFnZS8qLCBtZWRpYV90eXBlLiBTZWUgaHR0cHM6Ly93d3cudzNzY2hvb2xzLmNvbS90YWdzL2F0dF9pbnB1dF9hY2NlcHQuYXNwXG4gICdhY2NlcHRGaWxlVHlwZTogYWNjZXB0LWZpbGUtdHlwZScsXG5cbiAgLy8gbWF4LWZpbGUtc2l6ZSBbbnVtYmVyXTogbWF4aW11bSBmaWxlIHNpemUgYWxsb3dlZCwgaW4gYnl0ZXMuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnbWF4RmlsZVNpemU6IG1heC1maWxlLXNpemUnLFxuXG4gIC8vIG11bHRpcGxlIFtib29sZWFuXTogbXVsdGlwbGUgZmlsZSBzZWxlY3Rpb24gYWxsb3dlZC4gRGVmYXVsdDogbm8uXG4gICdtdWx0aXBsZScsXG5cbiAgLy8gbWF4LWZpbGVzIFtudW1iZXJdOiBtYXhpbXVtIG51bWJlciBvZiBmaWxlcyBhbGxvd2VkLiBEZWZhdWx0OiAtMS5cbiAgJ21heEZpbGVzOiBtYXgtZmlsZXMnLFxuXG4gIC8vIHNob3ctaW5mbyBbYm9vbGVhbl06IHNob3cgZmlsZXMgaW5mb3JtYXRpb24uIERlZmF1bHQ6IG5vLlxuICAnc2hvd0luZm86IHNob3ctaW5mbycsXG5cbiAgLy8gc3BsaXQtdXBsb2FkIFtib29sZWFuXTogZWFjaCBmaWxlIGlzIHVwbG9hZGVkIGluIGEgcmVxdWVzdCAodHJ1ZSkgb3IgYWxsIGZpbGVzIGFyZSB1cGxvYWRlZCBpbiBhIHNpbmdsZSByZXF1ZXN0IChmYWxzZSkuIERlZmF1bHQ6IHllcy5cbiAgJ3NwbGl0VXBsb2FkOiBzcGxpdC11cGxvYWQnLFxuXG4gIC8vIGFkZGl0aW9uYWwtZGF0YSBbSlNPTl06IHVzZWQgdG8gc2VuZCBhZGl0aW9uYWwgaW5mb3JtYXRpb24gaW4gdGhlIHVwbG9hZCByZXF1ZXN0LlxuICAnYWRkaXRpb25hbERhdGE6IGFkZGl0aW9uYWwtZGF0YScsXG4gICdhcHBlYXJhbmNlJyxcbiAgJ2hpZGVSZXF1aXJlZE1hcmtlcjpoaWRlLXJlcXVpcmVkLW1hcmtlcicsXG4gICdsYWJlbFZpc2libGU6bGFiZWwtdmlzaWJsZSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19GSUxFX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19GT1JNX0RBVEFfQ09NUE9ORU5ULFxuICAnb25CZWZvcmVVcGxvYWQnLFxuICAnb25CZWZvcmVVcGxvYWRGaWxlJyxcbiAgJ29uUHJvZ3Jlc3MnLFxuICAnb25Qcm9ncmVzc0ZpbGUnLFxuICAnb25DYW5jZWwnLFxuICAnb25DYW5jZWxGaWxlJyxcbiAgJ29uVXBsb2FkJyxcbiAgJ29uVXBsb2FkRmlsZScsXG4gICdvbkNvbXBsZXRlJyxcbiAgJ29uQ29tcGxldGVGaWxlJyxcbiAgJ29uRXJyb3InLFxuICAnb25FcnJvckZpbGUnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZpbGUtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1maWxlLWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1maWxlLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GSUxFX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19GSUxFX0lOUFVULFxuICBwcm92aWRlcnM6IFtcbiAgICB7IHByb3ZpZGU6IE9udGltaXplRmlsZVNlcnZpY2UsIHVzZUZhY3Rvcnk6IGZpbGVTZXJ2aWNlRmFjdG9yeSwgZGVwczogW0luamVjdG9yXSB9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgT0ZpbGVJbnB1dENvbXBvbmVudCBleHRlbmRzIE9Gb3JtRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHVibGljIHVwbG9hZGVyOiBPRmlsZVVwbG9hZGVyO1xuICBwdWJsaWMgZmlsZVNlcnZpY2U6IElGaWxlU2VydmljZTtcbiAgQFZpZXdDaGlsZCgnaW5wdXRGaWxlJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBpbnB1dEZpbGU6IEVsZW1lbnRSZWY7XG5cbiAgcHVibGljIGF1dG9CaW5kaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBhdXRvUmVnaXN0ZXJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dJbmZvOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgc3BsaXRVcGxvYWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgYWNjZXB0RmlsZVR5cGU6IHN0cmluZztcbiAgcHVibGljIG1heEZpbGVTaXplOiBudW1iZXI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtYXhGaWxlczogbnVtYmVyID0gLTE7XG5cbiAgcHVibGljIG9uQmVmb3JlVXBsb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25CZWZvcmVVcGxvYWRGaWxlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25Qcm9ncmVzczogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uUHJvZ3Jlc3NGaWxlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25DYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkNhbmNlbEZpbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvblVwbG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uVXBsb2FkRmlsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uQ29tcGxldGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkNvbXBsZXRlRmlsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uRXJyb3I6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvbkVycm9yRmlsZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBwcm90ZWN0ZWQgc2VydmljZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZW50aXR5OiBzdHJpbmc7XG4gIHByb3RlY3RlZCBzZXJ2aWNlVHlwZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUNvbXBvbmVudCkpIGZvcm06IE9Gb3JtQ29tcG9uZW50LFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIGluamVjdG9yOiBJbmplY3RvcixcbiAgKSB7XG4gICAgc3VwZXIoZm9ybSwgZWxSZWYsIGluamVjdG9yKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMudXBsb2FkZXIub25CZWZvcmVVcGxvYWRBbGwgPSAoKSA9PiB0aGlzLm9uQmVmb3JlVXBsb2FkLmVtaXQoKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uQmVmb3JlVXBsb2FkSXRlbSA9IGl0ZW0gPT4gdGhpcy5vbkJlZm9yZVVwbG9hZEZpbGUuZW1pdChpdGVtKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uUHJvZ3Jlc3NBbGwgPSBwcm9ncmVzcyA9PiB0aGlzLm9uUHJvZ3Jlc3MuZW1pdChwcm9ncmVzcyk7XG4gICAgdGhpcy51cGxvYWRlci5vblByb2dyZXNzSXRlbSA9IChpdGVtLCBwcm9ncmVzcykgPT4gdGhpcy5vblByb2dyZXNzRmlsZS5lbWl0KHsgaXRlbTogaXRlbSwgcHJvZ3Jlc3M6IHByb2dyZXNzIH0pO1xuICAgIHRoaXMudXBsb2FkZXIub25DYW5jZWxBbGwgPSAoKSA9PiB0aGlzLm9uQ2FuY2VsLmVtaXQoKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uQ2FuY2VsSXRlbSA9IGl0ZW0gPT4gdGhpcy5vbkNhbmNlbEZpbGUuZW1pdCgpO1xuICAgIHRoaXMudXBsb2FkZXIub25TdWNjZXNzQWxsID0gcmVzcG9uc2UgPT4gdGhpcy5vblVwbG9hZC5lbWl0KHsgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xuICAgIHRoaXMudXBsb2FkZXIub25TdWNjZXNzSXRlbSA9IChpdGVtLCByZXNwb25zZSkgPT4gdGhpcy5vblVwbG9hZEZpbGUuZW1pdCh7IGl0ZW06IGl0ZW0sIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uQ29tcGxldGVBbGwgPSAoKSA9PiB0aGlzLm9uQ29tcGxldGUuZW1pdCgpO1xuICAgIHRoaXMudXBsb2FkZXIub25Db21wbGV0ZUl0ZW0gPSBpdGVtID0+IHRoaXMub25Db21wbGV0ZUZpbGUuZW1pdChpdGVtKTtcbiAgICB0aGlzLnVwbG9hZGVyLm9uRXJyb3JBbGwgPSBlcnJvciA9PiB0aGlzLm9uRXJyb3IuZW1pdChlcnJvcik7XG4gICAgdGhpcy51cGxvYWRlci5vbkVycm9ySXRlbSA9IChpdGVtLCBlcnJvcikgPT4gdGhpcy5vbkVycm9yRmlsZS5lbWl0KHsgaXRlbTogaXRlbSwgZXJyb3I6IGVycm9yIH0pO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuXG4gICAgaWYgKCF0aGlzLnNlcnZpY2UpIHtcbiAgICAgIHRoaXMuc2VydmljZSA9IHRoaXMuZm9ybS5zZXJ2aWNlO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZW50aXR5KSB7XG4gICAgICB0aGlzLmVudGl0eSA9IHRoaXMuZm9ybS5lbnRpdHk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gICAgdGhpcy51cGxvYWRlciA9IG5ldyBPRmlsZVVwbG9hZGVyKHRoaXMuZmlsZVNlcnZpY2UsIHRoaXMuZW50aXR5KTtcbiAgICB0aGlzLnVwbG9hZGVyLnNwbGl0VXBsb2FkID0gdGhpcy5zcGxpdFVwbG9hZDtcbiAgfVxuXG4gIHB1YmxpYyBjb25maWd1cmVTZXJ2aWNlKCk6IHZvaWQge1xuICAgIGxldCBsb2FkaW5nU2VydmljZTogYW55ID0gT250aW1pemVGaWxlU2VydmljZTtcbiAgICBpZiAodGhpcy5zZXJ2aWNlVHlwZSkge1xuICAgICAgbG9hZGluZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VUeXBlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5maWxlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0PE9udGltaXplRmlsZVNlcnZpY2U+KGxvYWRpbmdTZXJ2aWNlKTtcbiAgICAgIGlmICh0aGlzLmZpbGVTZXJ2aWNlKSB7XG4gICAgICAgIGNvbnN0IHNlcnZpY2VDZmc6IGFueSA9IHRoaXMuZmlsZVNlcnZpY2UuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKHRoaXMuc2VydmljZSk7XG4gICAgICAgIGlmICh0aGlzLmVudGl0eSkge1xuICAgICAgICAgIHNlcnZpY2VDZmcuZW50aXR5ID0gdGhpcy5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maWxlU2VydmljZS5jb25maWd1cmVTZXJ2aWNlKHNlcnZpY2VDZmcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlc29sdmVWYWxpZGF0b3JzKCk6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBzdXBlci5yZXNvbHZlVmFsaWRhdG9ycygpO1xuICAgIGlmICh0aGlzLmFjY2VwdEZpbGVUeXBlKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2godGhpcy5maWxldHlwZVZhbGlkYXRvci5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWF4RmlsZVNpemUpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaCh0aGlzLm1heEZpbGVTaXplVmFsaWRhdG9yLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICBpZiAodGhpcy5tdWx0aXBsZSAmJiB0aGlzLm1heEZpbGVzICE9PSAtMSkge1xuICAgICAgdmFsaWRhdG9ycy5wdXNoKHRoaXMubWF4RmlsZXNWYWxpZGF0b3IuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgcHVibGljIGZpbGVTZWxlY3RlZChldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBsZXQgdmFsdWU6IHN0cmluZyA9ICcnO1xuICAgIGlmIChldmVudCkge1xuICAgICAgY29uc3QgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcbiAgICAgIGlmICh0YXJnZXQuZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBmaWxlczogRmlsZUxpc3QgPSB0YXJnZXQuZmlsZXM7XG4gICAgICAgIGlmICghdGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgIHRoaXMudXBsb2FkZXIuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgZjogRmlsZTsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZiA9IGZpbGVzW2ldO1xuICAgICAgICAgIGNvbnN0IGZpbGVJdGVtOiBPRmlsZUl0ZW0gPSBuZXcgT0ZpbGVJdGVtKGYsIHRoaXMudXBsb2FkZXIpO1xuICAgICAgICAgIHRoaXMudXBsb2FkZXIuYWRkRmlsZShmaWxlSXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgPSB0aGlzLnVwbG9hZGVyLmZpbGVzLm1hcChmaWxlID0+IGZpbGUubmFtZSkuam9pbignLCAnKTtcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSAhPT0gJycgPyB2YWx1ZSA6IHVuZGVmaW5lZCwgeyBjaGFuZ2VUeXBlOiBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRSB9KTtcbiAgICAgICAgICBpZiAodGhpcy5fZkNvbnRyb2wpIHtcbiAgICAgICAgICAgIHRoaXMuX2ZDb250cm9sLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBzdXBlci5vbkNsaWNrQ2xlYXJWYWx1ZSgpO1xuICAgKiBzdXBlci5jbGVhclZhbHVlKCkgdnMgc3VwZXIub25DbGlja0NsZWFyVmFsdWUoKVxuICAgKiAgKiBzdXBlci5jbGVhclZhbHVlKCkgZW1pdCBPVmFsdWVDaGFuZ2VFdmVudC5QUk9HUkFNTUFUSUNfQ0hBTkdFXG4gICAqICAqIHN1cGVyLm9uQ2xpY2tDbGVhclZhbHVlKCkgZW1pdCBPVmFsdWVDaGFuZ2VFdmVudC5VU0VSX0NIQU5HRVxuICAgKi9cbiAgcHVibGljIG9uQ2xpY2tDbGVhclZhbHVlKGU6IEV2ZW50KTogdm9pZCB7XG4gICAgc3VwZXIub25DbGlja0NsZWFyVmFsdWUoZSk7XG4gICAgdGhpcy51cGxvYWRlci5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHN1cGVyLmNsZWFyVmFsdWUoKTtcbiAgICovXG4gIHB1YmxpYyBjbGVhclZhbHVlKCk6IHZvaWQge1xuICAgIHN1cGVyLmNsZWFyVmFsdWUoKTtcbiAgICB0aGlzLnVwbG9hZGVyLmNsZWFyKCk7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja1VwbG9hZChlOiBFdmVudCk6IHZvaWQge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoaXMuaXNWYWxpZCkge1xuICAgICAgdGhpcy51cGxvYWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBsb2FkKCk6IHZvaWQge1xuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkKCk7XG4gIH1cblxuICBnZXQgZmlsZXMoKTogT0ZpbGVJdGVtW10ge1xuICAgIHJldHVybiB0aGlzLnVwbG9hZGVyLmZpbGVzO1xuICB9XG5cbiAgZ2V0IGFkZGl0aW9uYWxEYXRhKCk6IGFueSB7XG4gICAgaWYgKHRoaXMudXBsb2FkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLnVwbG9hZGVyLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgc2V0IGFkZGl0aW9uYWxEYXRhKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLnVwbG9hZGVyKSB7XG4gICAgICB0aGlzLnVwbG9hZGVyLmRhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbm5lck9uQ2hhbmdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmVuc3VyZU9Gb3JtVmFsdWUoZXZlbnQpO1xuICAgIGlmICh0aGlzLl9mQ29udHJvbCAmJiB0aGlzLl9mQ29udHJvbC50b3VjaGVkKSB7XG4gICAgICB0aGlzLl9mQ29udHJvbC5tYXJrQXNEaXJ0eSgpO1xuICAgIH1cbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZpbGV0eXBlVmFsaWRhdG9yKGNvbnRyb2w6IEZvcm1Db250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB7XG4gICAgaWYgKGNvbnRyb2wudmFsdWUgJiYgY29udHJvbC52YWx1ZS5sZW5ndGggPiAwICYmIHRoaXMuYWNjZXB0RmlsZVR5cGUpIHtcbiAgICAgIGNvbnN0IHJlZ2V4OiBSZWdFeHAgPSBuZXcgUmVnRXhwKHRoaXMuYWNjZXB0RmlsZVR5cGUucmVwbGFjZSgnOycsICd8JykpO1xuICAgICAgaWYgKCF0aGlzLmZpbGVzLmV2ZXJ5KGZpbGUgPT4gZmlsZS50eXBlLm1hdGNoKHJlZ2V4KSAhPT0gbnVsbCB8fCBmaWxlLm5hbWUuc3Vic3RyKGZpbGUubmFtZS5sYXN0SW5kZXhPZignLicpKS5tYXRjaChyZWdleCkgIT09IG51bGwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZmlsZVR5cGU6IHtcbiAgICAgICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IHRoaXMuYWNjZXB0RmlsZVR5cGUucmVwbGFjZSgnOycsICcsICcpXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxuICBwcm90ZWN0ZWQgbWF4RmlsZVNpemVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHtcbiAgICBpZiAoY29udHJvbC52YWx1ZSAmJiBjb250cm9sLnZhbHVlLmxlbmd0aCA+IDAgJiYgdGhpcy5tYXhGaWxlU2l6ZSkge1xuICAgICAgaWYgKCF0aGlzLmZpbGVzLmV2ZXJ5KGZpbGUgPT4gZmlsZS5zaXplIDwgdGhpcy5tYXhGaWxlU2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWxlU2l6ZToge1xuICAgICAgICAgICAgbWF4RmlsZVNpemU6IHRoaXMubWF4RmlsZVNpemVcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHByb3RlY3RlZCBtYXhGaWxlc1ZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMge1xuICAgIGlmIChjb250cm9sLnZhbHVlICYmIGNvbnRyb2wudmFsdWUubGVuZ3RoID4gMCAmJiB0aGlzLm11bHRpcGxlICYmIHRoaXMubWF4RmlsZXMgIT09IC0xKSB7XG4gICAgICBpZiAodGhpcy5tYXhGaWxlcyA8IHRoaXMuZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbnVtRmlsZToge1xuICAgICAgICAgICAgbWF4RmlsZXM6IHRoaXMubWF4RmlsZXNcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfVxufVxuIl19