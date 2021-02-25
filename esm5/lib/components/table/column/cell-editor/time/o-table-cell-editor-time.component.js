import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Injector, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepickerInput } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { InputConverter } from '../../../../../decorators/input-converter';
import { MomentService } from '../../../../../services/moment.service';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, [
    'oDateFormat: date-format',
    'oDateLocale: date-locale',
    'oDateStartView: date-start-view',
    'oMinDate: date-min',
    'oMaxDate: date-max',
    'oDateTouchUi: date-touch-ui',
    'oDateStartAt: date-start-at',
    'oHourFormat: hour-format',
    'oHourMin: hour-min',
    'oHourMax: hour-max',
    'oHourPlaceholder: hour-placeholder',
    'oDatePlaceholder: date-placeholder'
]);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TIME = tslib_1.__spread(DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR);
var OTableCellEditorTimeComponent = (function (_super) {
    tslib_1.__extends(OTableCellEditorTimeComponent, _super);
    function OTableCellEditorTimeComponent(injector, adapter) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.adapter = adapter;
        _this.oStartView = 'month';
        _this.oDateFormat = 'L';
        _this.oHourFormat = Codes.TWENTY_FOUR_HOUR_FORMAT;
        _this.onKeyboardInputDone = false;
        _this.enabledCommitOnTabPress = false;
        _this.activeKeys = {};
        _this.momentSrv = _this.injector.get(MomentService);
        return _this;
    }
    OTableCellEditorTimeComponent.prototype.onDocumentKeydown = function (event) {
        this.handleKeydown(event);
    };
    OTableCellEditorTimeComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.createInternalFormControl();
        if (!this._oDateLocale) {
            this.oDateLocale = this.momentSrv.getLocale();
        }
        if (this.oMinDate) {
            var date = new Date(this.oMinDate);
            var momentD = moment(date);
            if (momentD.isValid()) {
                this.minDateString = momentD.format(this.oDateFormat);
            }
        }
        if (this.oMaxDate) {
            var date = new Date(this.oMaxDate);
            var momentD = moment(date);
            if (momentD.isValid()) {
                this.maxDateString = momentD.format(this.oDateFormat);
            }
        }
    };
    OTableCellEditorTimeComponent.prototype.createInternalFormControl = function () {
        if (!this.formControlDate) {
            var validators = this.resolveValidators();
            var cfg = {
                value: undefined,
                disabled: !this.enabled
            };
            this.formControlDate = new FormControl(cfg, validators);
            this.formGroup.addControl('dateInput', this.formControlDate);
        }
        if (!this.formControlHour) {
            var validators = this.resolveValidators();
            var cfg = {
                value: undefined,
                disabled: !this.enabled
            };
            this.formControlHour = new FormControl(cfg, validators);
            this.formGroup.addControl('hourInput', this.formControlHour);
        }
    };
    OTableCellEditorTimeComponent.prototype.ngAfterViewChecked = function () {
        this.modifyPickerMethods();
    };
    OTableCellEditorTimeComponent.prototype.setTime = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.picker.updateTime(this.formControlHour.value);
    };
    OTableCellEditorTimeComponent.prototype.onDateChange = function (event) {
        var isValid = event.value && event.value.isValid && event.value.isValid();
        var val = isValid ? event.value.valueOf() : moment().startOf('day');
        this.formControlDate.setValue(val, {
            emitModelToViewChange: false,
            emitEvent: false
        });
        this.updateComponentValue();
    };
    OTableCellEditorTimeComponent.prototype.updateValeOnInputChange = function (blurEvent) {
        if (this.onKeyboardInputDone) {
            var value = blurEvent.currentTarget.value;
            value = this.parseHour(value);
            this.formControlHour.setValue(value);
        }
        this.onKeyboardInputDone = false;
    };
    OTableCellEditorTimeComponent.prototype.parseHour = function (value) {
        var strArray = value.split(':');
        var hour = strArray[0];
        if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.oHourFormat) {
            if (hour) {
                hour = parseInt(hour, 10);
                var period = hour <= 12 ? ' AM' : ' PM';
                if (hour > 12) {
                    hour = hour - 12;
                }
                strArray[0] = hour;
                value = strArray.join(':') + period;
            }
        }
        return value;
    };
    OTableCellEditorTimeComponent.prototype.onHourChange = function (event) {
        var value;
        if (event instanceof Event) {
            this.updateValeOnInputChange(event);
        }
        else {
            value = this.convertToFormatString(event);
            this.formControlHour.setValue(value, {
                emitEvent: false,
                emitModelToViewChange: false
            });
        }
        this.updateComponentValue();
    };
    OTableCellEditorTimeComponent.prototype.setTimestampValue = function (value, options) {
        var parsedValue;
        var momentV = Util.isDefined(value) ? moment(value) : value;
        if (momentV && momentV.isValid()) {
            parsedValue = momentV.utcOffset(0).format(this.formatString);
        }
        this.formControlHour.setValue(parsedValue, options);
    };
    OTableCellEditorTimeComponent.prototype.convertToFormatString = function (value) {
        if (value === '00:00' || !Util.isDefined(value)) {
            return value;
        }
        var formatStr = this.oHourFormat === Codes.TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
        var result;
        if (typeof value === 'number') {
            result = moment(value).format(formatStr);
        }
        else {
            result = value ? moment(value, 'h:mm A').format(formatStr) : value;
        }
        return result;
    };
    OTableCellEditorTimeComponent.prototype.openDatepicker = function (d) {
        this.datepicker = d;
        d.open();
    };
    OTableCellEditorTimeComponent.prototype.getPlaceholderHour = function () {
        var placeholder = '';
        if (this.oHourPlaceholder) {
            placeholder = this.translateService.get(this.oHourPlaceholder);
        }
        else {
            placeholder = _super.prototype.getPlaceholder.call(this);
        }
        return placeholder;
    };
    OTableCellEditorTimeComponent.prototype.getPlaceholderDate = function () {
        var placeholder = '';
        if (this.oDatePlaceholder) {
            placeholder = this.translateService.get(this.oDatePlaceholder);
        }
        else {
            placeholder = _super.prototype.getPlaceholder.call(this);
        }
        return placeholder;
    };
    OTableCellEditorTimeComponent.prototype.open = function (e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        if (this.picker) {
            this.picker.open();
        }
    };
    OTableCellEditorTimeComponent.prototype.handleKeydown = function (e) {
        this.activeKeys[e.keyCode] = true;
    };
    OTableCellEditorTimeComponent.prototype.handleKeyup = function (e) {
        this.activeKeys[e.keyCode] = false;
        var oColumn = this.table.getOColumn(this.tableColumn.attr);
        if (!oColumn) {
            return;
        }
        if (e.keyCode === 9 && (this.activeKeys[16] || !this.enabledCommitOnTabPress)) {
            return;
        }
        if (!oColumn.editing && this.datepicker && this.datepicker.opened) {
            this.datepicker.close();
        }
        else {
            _super.prototype.handleKeyup.call(this, e);
        }
    };
    OTableCellEditorTimeComponent.prototype.updateComponentValue = function () {
        var timeValue;
        var values = this.formGroup.getRawValue();
        var mDate = (values['dateInput'] ? moment(values['dateInput']) : moment()).startOf('day');
        var mHour = moment(values['hourInput'], this.formatString);
        timeValue = mDate.clone()
            .set('hour', mHour.get('hour'))
            .set('minute', mHour.get('minutes'))
            .valueOf();
        if (this.formControl) {
            this.formControl.setValue(timeValue);
            this.formControl.markAsDirty();
        }
    };
    OTableCellEditorTimeComponent.prototype.modifyPickerMethods = function () {
        var _this = this;
        if (this.picker && this.picker.inputElement) {
            this.picker.inputElement.addEventListener('change', function () {
                _this.onKeyboardInputDone = true;
            });
        }
    };
    OTableCellEditorTimeComponent.prototype.hasErrorDate = function (error) {
        return this.formControlDate && this.formControlDate.touched && this.hasErrorExclusive(error);
    };
    OTableCellEditorTimeComponent.prototype.hasErrorExclusive = function (error) {
        var hasError = false;
        var errorsOrder = ['matDatepickerMax', 'matDatepickerMin', 'matDatepickerFilter', 'matDatepickerParse', 'required'];
        var errors = this.formControlDate.errors;
        if (Util.isDefined(errors)) {
            if (Object.keys(errors).length === 1) {
                return errors.hasOwnProperty(error);
            }
            else {
                for (var i = 0, len = errorsOrder.length; i < len; i++) {
                    hasError = errors.hasOwnProperty(errorsOrder[i]);
                    if (hasError) {
                        hasError = (errorsOrder[i] === error);
                        break;
                    }
                }
            }
        }
        return hasError;
    };
    OTableCellEditorTimeComponent.prototype.hasErrorHour = function (error) {
        return this.formControlHour && this.formControlHour.touched;
    };
    OTableCellEditorTimeComponent.prototype.getCellDataDate = function () {
        var value = _super.prototype.getCellData.call(this);
        if (Util.isDefined(value)) {
            var m = moment(value);
            var result = value;
            if (Util.isDefined(m)) {
                result = m.toDate();
            }
            return result;
        }
        return value;
    };
    OTableCellEditorTimeComponent.prototype.getCellDataHour = function () {
        var value = _super.prototype.getCellData.call(this);
        if (Util.isDefined(value)) {
            var m = moment(value);
            var result = value;
            if (Util.isDefined(m)) {
                result = m.format(Codes.formatString(this.oHourFormat));
            }
            return result;
        }
        return value;
    };
    OTableCellEditorTimeComponent.prototype.startEdition = function (data) {
        _super.prototype.startEdition.call(this, data);
        var cellDataDate = this.getCellDataDate();
        this.formControlDate.setValue(cellDataDate);
        var cellDataHour = this.getCellDataHour();
        this.formControlHour.setValue(cellDataHour);
        this.formGroup.markAsTouched();
    };
    Object.defineProperty(OTableCellEditorTimeComponent.prototype, "formatString", {
        get: function () {
            return Codes.formatString(this.oHourFormat);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellEditorTimeComponent.prototype, "minDateString", {
        get: function () {
            return this._minDateString;
        },
        set: function (val) {
            this._minDateString = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellEditorTimeComponent.prototype, "maxDateString", {
        get: function () {
            return this._maxDateString;
        },
        set: function (val) {
            this._maxDateString = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellEditorTimeComponent.prototype, "oDateLocale", {
        set: function (value) {
            this._oDateLocale = value;
            if (Util.isDefined(this._oDateLocale)) {
                this.adapter.setLocale(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellEditorTimeComponent.prototype, "minDate", {
        get: function () {
            return new Date(this.oMinDate);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableCellEditorTimeComponent.prototype, "maxDate", {
        get: function () {
            return new Date(this.oMaxDate);
        },
        enumerable: true,
        configurable: true
    });
    OTableCellEditorTimeComponent.prototype.onDatepickerClosed = function () {
        this.dateInput.nativeElement.focus();
    };
    OTableCellEditorTimeComponent.prototype.onTimepickerClosed = function () {
        this.hourInput.nativeElement.focus();
    };
    OTableCellEditorTimeComponent.prototype.commitEdition = function () {
        if (!this.formGroup.invalid) {
            _super.prototype.commitEdition.call(this);
        }
    };
    OTableCellEditorTimeComponent.prototype.onKeyDown = function (e) {
        if (!Codes.isHourInputAllowed(e)) {
            e.preventDefault();
        }
    };
    OTableCellEditorTimeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-editor-time',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\" class=\"o-table-cell-editor-time\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\"\n    fxLayoutGap=\"8px\">\n    <mat-form-field floatLabel=\"never\">\n\n      <input #dateInput matInput [placeholder]=\"getPlaceholderDate()\" [formControl]=\"formControlDate\"\n        [required]=\"orequired\" [matDatepicker]=\"d\" (dateChange)=\"onDateChange($event)\" [min]=\"minDate\" [max]=\"maxDate\"\n        (focus)=\"enabledCommitOnTabPress = false\">\n\n      <mat-datepicker #d [startView]=\"oStartView\" [startAt]=\"oDateStartAt\" [touchUi]=\"oDateTouchUi\"\n        (closed)=\"onDatepickerClosed()\">\n      </mat-datepicker>\n\n      <span class=\"icon-btn\" (click)=\"openDatepicker(d)\" matSuffix>\n        <mat-icon svgIcon=\"ontimize:today\"></mat-icon>\n      </span>\n\n      <mat-error *ngIf=\"hasErrorDate('required') || hasErrorHour('required')\"\n        text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n      <mat-error *ngIf=\"hasErrorDate('matDatepickerParse')\"\n        text=\"{{ 'FORM_VALIDATION.DATE_PARSE' | oTranslate }} {{ oHourFormat }}\"></mat-error>\n\n      <mat-error *ngIf=\"hasErrorDate('matDatepickerFilter')\" text=\"{{ 'FORM_VALIDATION.DATE_FILTER' | oTranslate }}\">\n      </mat-error>\n      <mat-error *ngIf=\"hasErrorDate('matDatepickerMin')\"\n        text=\"{{ 'FORM_VALIDATION.DATE_MIN' | oTranslate }} {{ minDateString }}\"></mat-error>\n\n      <mat-error *ngIf=\"hasErrorDate('matDatepickerMax')\"\n        text=\"{{ 'FORM_VALIDATION.DATE_MAX' | oTranslate }} {{ maxDateString }}\"></mat-error>\n\n    </mat-form-field>\n\n    <span class=\"separator\">&ndash;</span>\n\n    <mat-form-field floatLabel=\"never\">\n\n      <input #hourInput matInput [ngxTimepicker]=\"picker\" [placeholder]=\"getPlaceholderHour()\"\n        [formControl]=\"formControlHour\" [required]=\"orequired\" (change)=\"onHourChange($event)\" [min]=\"oHourMin\"\n        [max]=\"oHourMax\" (keydown)=\"onKeyDown($event)\" [disableClick]=\"true\" [format]=\"oHourFormat\"\n        (blur)=\"enabledCommitOnTabPress = true\">\n\n      <button type=\"button\" matSuffix mat-icon-button (click)=\"open($event)\">\n        <mat-icon ngxMaterialTimepickerToggleIcon svgIcon=\"ontimize:clock\"></mat-icon>\n      </button>\n\n      <mat-error *ngIf=\"hasErrorHour('invalidFormatHour')\"\n        text=\"{{ 'FORM_VALIDATION.HOUR_FORMAT' | oTranslate }} {{ formatString }}\"></mat-error>\n\n    </mat-form-field>\n\n    <ngx-material-timepicker #picker (timeSet)=\"onHourChange($event)\" [confirmBtnTmpl]=\"confirmBtn\"\n      [cancelBtnTmpl]=\"cancelBtn\" (closed)=\"onTimepickerClosed()\"></ngx-material-timepicker>\n    <ng-template #confirmBtn>\n      <button mat-stroked-button type=\"button\" (click)=\"setTime($event)\"><span>{{'OK' | oTranslate}}</span></button>\n    </ng-template>\n    <ng-template #cancelBtn>\n      <button mat-stroked-button type=\"button\" (click)=\"picker.close()\"><span>{{'CANCEL' | oTranslate}}</span></button>\n    </ng-template>\n  </div>\n\n</ng-template>",
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_TIME,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_TIME,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
                    ],
                    styles: [".separator{cursor:default}.mat-form-field:not(.custom-width) .mat-form-field-infix{width:84px}button.mat-stroked-button{margin:0 6px}"]
                }] }
    ];
    OTableCellEditorTimeComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: DateAdapter }
    ]; };
    OTableCellEditorTimeComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }],
        dateInput: [{ type: ViewChild, args: ['dateInput', { static: false },] }],
        hourInput: [{ type: ViewChild, args: ['hourInput', { static: false },] }],
        picker: [{ type: ViewChild, args: ['picker', { static: false },] }],
        datepickerInput: [{ type: ViewChild, args: [MatDatepickerInput, { static: false },] }],
        onDocumentKeydown: [{ type: HostListener, args: ['document:keydown', ['$event'],] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableCellEditorTimeComponent.prototype, "oDateTouchUi", void 0);
    return OTableCellEditorTimeComponent;
}(OBaseTableCellEditor));
export { OTableCellEditorTimeComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci10aW1lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvdGltZS9vLXRhYmxlLWNlbGwtZWRpdG9yLXRpbWUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFFBQVEsRUFFUixXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFlLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQWlCLGtCQUFrQixFQUEyQixNQUFNLG1CQUFtQixDQUFDO0FBQzdILE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3JFLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUM1QixPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV6RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXZFLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEQsT0FBTyxFQUNMLGtDQUFrQyxFQUNsQyxtQ0FBbUMsRUFDbkMsb0JBQW9CLEdBQ3JCLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsTUFBTSxDQUFDLElBQU0sdUNBQXVDLG9CQUMvQyxrQ0FBa0M7SUFDckMsMEJBQTBCO0lBQzFCLDBCQUEwQjtJQUMxQixpQ0FBaUM7SUFDakMsb0JB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dCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdDaGVja2VkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBIb3N0TGlzdGVuZXIsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0b3JGbiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERhdGVBZGFwdGVyLCBNQVRfREFURV9MT0NBTEUsIE1hdERhdGVwaWNrZXIsIE1hdERhdGVwaWNrZXJJbnB1dCwgTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBNb21lbnREYXRlQWRhcHRlciB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsLW1vbWVudC1hZGFwdGVyJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCB7IE5neE1hdGVyaWFsVGltZXBpY2tlckNvbXBvbmVudCB9IGZyb20gJ25neC1tYXRlcmlhbC10aW1lcGlja2VyJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBNb21lbnRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvbW9tZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybVZhbHVlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL2Zvcm0tdmFsdWUtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1IsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SLFxuICBPQmFzZVRhYmxlQ2VsbEVkaXRvcixcbn0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtZWRpdG9yLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9FRElUT1JfVElNRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgJ29EYXRlRm9ybWF0OiBkYXRlLWZvcm1hdCcsXG4gICdvRGF0ZUxvY2FsZTogZGF0ZS1sb2NhbGUnLFxuICAnb0RhdGVTdGFydFZpZXc6IGRhdGUtc3RhcnQtdmlldycsXG4gICdvTWluRGF0ZTogZGF0ZS1taW4nLFxuICAnb01heERhdGU6IGRhdGUtbWF4JyxcbiAgJ29EYXRlVG91Y2hVaTogZGF0ZS10b3VjaC11aScsXG4gICdvRGF0ZVN0YXJ0QXQ6IGRhdGUtc3RhcnQtYXQnLFxuICAnb0hvdXJGb3JtYXQ6IGhvdXItZm9ybWF0JyxcbiAgJ29Ib3VyTWluOiBob3VyLW1pbicsXG4gICdvSG91ck1heDogaG91ci1tYXgnLFxuICAnb0hvdXJQbGFjZWhvbGRlcjogaG91ci1wbGFjZWhvbGRlcicsXG4gICdvRGF0ZVBsYWNlaG9sZGVyOiBkYXRlLXBsYWNlaG9sZGVyJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX1RJTUUgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtZWRpdG9yLXRpbWUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLWVkaXRvci10aW1lLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1jZWxsLWVkaXRvci10aW1lLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9USU1FLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9USU1FLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgeyBwcm92aWRlOiBEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE1vbWVudERhdGVBZGFwdGVyLCBkZXBzOiBbTUFUX0RBVEVfTE9DQUxFXSB9XG4gIF0sXG59KVxuXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbEVkaXRvclRpbWVDb21wb25lbnQgZXh0ZW5kcyBPQmFzZVRhYmxlQ2VsbEVkaXRvciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCB7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIEBWaWV3Q2hpbGQoJ2RhdGVJbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgZGF0ZUlucHV0OiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ2hvdXJJbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwcm90ZWN0ZWQgaG91cklucHV0OiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoJ3BpY2tlcicsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgcGlja2VyOiBOZ3hNYXRlcmlhbFRpbWVwaWNrZXJDb21wb25lbnQ7XG5cbiAgb1N0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyA9ICdtb250aCc7XG5cbiAgQFZpZXdDaGlsZChNYXREYXRlcGlja2VySW5wdXQsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgZGF0ZXBpY2tlcklucHV0OiBNYXREYXRlcGlja2VySW5wdXQ8RGF0ZT47XG5cbiAgZm9ybUNvbnRyb2xIb3VyOiBGb3JtQ29udHJvbDtcbiAgZm9ybUNvbnRyb2xEYXRlOiBGb3JtQ29udHJvbDtcblxuICBwdWJsaWMgb0RhdGVGb3JtYXQ6IHN0cmluZyA9ICdMJztcbiAgcHVibGljIG9Ib3VyTWF4OiBzdHJpbmc7XG4gIHB1YmxpYyBvSG91ck1pbjogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgb0RhdGVUb3VjaFVpOiBib29sZWFuO1xuICBwdWJsaWMgb0RhdGVTdGFydEF0OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBfb0RhdGVMb2NhbGU7XG4gIHByb3RlY3RlZCBvSG91clBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBvRGF0ZVBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIHB1YmxpYyBvSG91ckZvcm1hdDogbnVtYmVyID0gQ29kZXMuVFdFTlRZX0ZPVVJfSE9VUl9GT1JNQVQ7XG4gIHByb3RlY3RlZCBvbktleWJvYXJkSW5wdXREb25lID0gZmFsc2U7XG4gIHByb3RlY3RlZCBvTWluRGF0ZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgb01heERhdGU6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9taW5EYXRlU3RyaW5nOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfbWF4RGF0ZVN0cmluZzogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGF0ZXBpY2tlcjogTWF0RGF0ZXBpY2tlcjxEYXRlPjtcbiAgcHJpdmF0ZSBtb21lbnRTcnY6IE1vbWVudFNlcnZpY2U7XG5cbiAgLy8gb25seSB0cnVlIHdoZW4gaG91ciBpbnB1dCBpcyBmb2N1c2VkXG4gIHB1YmxpYyBlbmFibGVkQ29tbWl0T25UYWJQcmVzczogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgYWN0aXZlS2V5czogb2JqZWN0ID0ge307XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5ZG93bicsIFsnJGV2ZW50J10pXG4gIG9uRG9jdW1lbnRLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgdGhpcy5oYW5kbGVLZXlkb3duKGV2ZW50KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJpdmF0ZSBhZGFwdGVyOiBEYXRlQWRhcHRlcjxhbnk+XG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLm1vbWVudFNydiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1vbWVudFNlcnZpY2UpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jcmVhdGVJbnRlcm5hbEZvcm1Db250cm9sKCk7XG4gICAgaWYgKCF0aGlzLl9vRGF0ZUxvY2FsZSkge1xuICAgICAgdGhpcy5vRGF0ZUxvY2FsZSA9IHRoaXMubW9tZW50U3J2LmdldExvY2FsZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9NaW5EYXRlKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5vTWluRGF0ZSk7XG4gICAgICBjb25zdCBtb21lbnREID0gbW9tZW50KGRhdGUpO1xuICAgICAgaWYgKG1vbWVudEQuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRoaXMubWluRGF0ZVN0cmluZyA9IG1vbWVudEQuZm9ybWF0KHRoaXMub0RhdGVGb3JtYXQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9NYXhEYXRlKSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5vTWF4RGF0ZSk7XG4gICAgICBjb25zdCBtb21lbnREID0gbW9tZW50KGRhdGUpO1xuICAgICAgaWYgKG1vbWVudEQuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRoaXMubWF4RGF0ZVN0cmluZyA9IG1vbWVudEQuZm9ybWF0KHRoaXMub0RhdGVGb3JtYXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUludGVybmFsRm9ybUNvbnRyb2woKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1Db250cm9sRGF0ZSkge1xuICAgICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHRoaXMucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICAgIGNvbnN0IGNmZyA9IHtcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgZGlzYWJsZWQ6ICF0aGlzLmVuYWJsZWRcbiAgICAgIH07XG4gICAgICB0aGlzLmZvcm1Db250cm9sRGF0ZSA9IG5ldyBGb3JtQ29udHJvbChjZmcsIHZhbGlkYXRvcnMpO1xuICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbCgnZGF0ZUlucHV0JywgdGhpcy5mb3JtQ29udHJvbERhdGUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5mb3JtQ29udHJvbEhvdXIpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSB0aGlzLnJlc29sdmVWYWxpZGF0b3JzKCk7XG4gICAgICBjb25zdCBjZmcgPSB7XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIGRpc2FibGVkOiAhdGhpcy5lbmFibGVkXG4gICAgICB9O1xuICAgICAgdGhpcy5mb3JtQ29udHJvbEhvdXIgPSBuZXcgRm9ybUNvbnRyb2woY2ZnLCB2YWxpZGF0b3JzKTtcbiAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ2hvdXJJbnB1dCcsIHRoaXMuZm9ybUNvbnRyb2xIb3VyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdDaGVja2VkKCk6IHZvaWQge1xuICAgIHRoaXMubW9kaWZ5UGlja2VyTWV0aG9kcygpO1xuICB9XG5cbiAgc2V0VGltZShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5waWNrZXIudXBkYXRlVGltZSh0aGlzLmZvcm1Db250cm9sSG91ci52YWx1ZSk7XG4gIH1cblxuICBvbkRhdGVDaGFuZ2UoZXZlbnQ6IE1hdERhdGVwaWNrZXJJbnB1dEV2ZW50PGFueT4pIHtcbiAgICBjb25zdCBpc1ZhbGlkID0gZXZlbnQudmFsdWUgJiYgZXZlbnQudmFsdWUuaXNWYWxpZCAmJiBldmVudC52YWx1ZS5pc1ZhbGlkKCk7XG4gICAgY29uc3QgdmFsID0gaXNWYWxpZCA/IGV2ZW50LnZhbHVlLnZhbHVlT2YoKSA6IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xuXG4gICAgdGhpcy5mb3JtQ29udHJvbERhdGUuc2V0VmFsdWUodmFsLCB7XG4gICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlLFxuICAgICAgZW1pdEV2ZW50OiBmYWxzZVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlQ29tcG9uZW50VmFsdWUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVWYWxlT25JbnB1dENoYW5nZShibHVyRXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uS2V5Ym9hcmRJbnB1dERvbmUpIHtcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nID0gYmx1ckV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWU7XG4gICAgICAvLyBuZ3gtbWF0ZXJpYWwtdGltZXBpY2tlciBkb2VzIG5vdCBhbGxvdyB3cml0aW5nIGNoYXJhY3RlcnMgb24gaW5wdXQsIHNvIHdlIGFkZCAnQU0vUE0nIGluIG9yZGVyIHRvIG1ha2UgdmFsaWRhdGlvbiB3b3JrIHByb3Blcmx5XG4gICAgICB2YWx1ZSA9IHRoaXMucGFyc2VIb3VyKHZhbHVlKTtcbiAgICAgIHRoaXMuZm9ybUNvbnRyb2xIb3VyLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy5vbktleWJvYXJkSW5wdXREb25lID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVjZWl2ZXMgYW4gaG91ciBpbnB1dCBpbnRyb2R1Y2VkIGJ5IHRoZSB1c2VyIGFuZCByZXR1cm5zIHRoZSBob3VyIGZvcm1hdGVkIGFjb3JkaW5nIGN1cnJlbnQgZm9ybWF0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgcHJvdGVjdGVkIHBhcnNlSG91cih2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdHJBcnJheSA9IHZhbHVlLnNwbGl0KCc6Jyk7XG4gICAgbGV0IGhvdXI6IGFueSA9IHN0ckFycmF5WzBdO1xuXG4gICAgaWYgKENvZGVzLlRXRUxWRV9GT1VSX0hPVVJfRk9STUFUID09PSB0aGlzLm9Ib3VyRm9ybWF0KSB7XG4gICAgICBpZiAoaG91cikge1xuICAgICAgICBob3VyID0gcGFyc2VJbnQoaG91ciwgMTApO1xuICAgICAgICBjb25zdCBwZXJpb2QgPSBob3VyIDw9IDEyID8gJyBBTScgOiAnIFBNJztcbiAgICAgICAgaWYgKGhvdXIgPiAxMikge1xuICAgICAgICAgIGhvdXIgPSBob3VyIC0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgc3RyQXJyYXlbMF0gPSBob3VyO1xuICAgICAgICB2YWx1ZSA9IHN0ckFycmF5LmpvaW4oJzonKSArIHBlcmlvZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIG9uSG91ckNoYW5nZShldmVudCkge1xuICAgIGxldCB2YWx1ZTtcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgdGhpcy51cGRhdGVWYWxlT25JbnB1dENoYW5nZShldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gdGhpcy5jb252ZXJ0VG9Gb3JtYXRTdHJpbmcoZXZlbnQpO1xuICAgICAgLyoqIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2UgIGJlY2F1c2Ugb25DaGFuZ2UgZXZlbnQgaXMgdHJpZ2dlciBpbiBuZ01vZGVsQ2hhbmdlICovXG4gICAgICB0aGlzLmZvcm1Db250cm9sSG91ci5zZXRWYWx1ZSh2YWx1ZSwge1xuICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlLFxuICAgICAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVDb21wb25lbnRWYWx1ZSgpO1xuICB9XG5cbiAgcHVibGljIHNldFRpbWVzdGFtcFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM/OiBGb3JtVmFsdWVPcHRpb25zKTogdm9pZCB7XG4gICAgbGV0IHBhcnNlZFZhbHVlO1xuICAgIGNvbnN0IG1vbWVudFYgPSBVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgPyBtb21lbnQodmFsdWUpIDogdmFsdWU7XG4gICAgaWYgKG1vbWVudFYgJiYgbW9tZW50Vi5pc1ZhbGlkKCkpIHtcbiAgICAgIHBhcnNlZFZhbHVlID0gbW9tZW50Vi51dGNPZmZzZXQoMCkuZm9ybWF0KHRoaXMuZm9ybWF0U3RyaW5nKTtcbiAgICB9XG4gICAgdGhpcy5mb3JtQ29udHJvbEhvdXIuc2V0VmFsdWUocGFyc2VkVmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnZlcnRUb0Zvcm1hdFN0cmluZyh2YWx1ZSk6IHN0cmluZyB7XG4gICAgaWYgKHZhbHVlID09PSAnMDA6MDAnIHx8ICFVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgZm9ybWF0U3RyID0gdGhpcy5vSG91ckZvcm1hdCA9PT0gQ29kZXMuVFdFTlRZX0ZPVVJfSE9VUl9GT1JNQVQgPyAnSEg6bW0nIDogJ2hoOm1tIGEnO1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJlc3VsdCA9IG1vbWVudCh2YWx1ZSkuZm9ybWF0KGZvcm1hdFN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IHZhbHVlID8gbW9tZW50KHZhbHVlLCAnaDptbSBBJykuZm9ybWF0KGZvcm1hdFN0cikgOiB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG9wZW5EYXRlcGlja2VyKGQ6IE1hdERhdGVwaWNrZXI8RGF0ZT4pIHtcbiAgICB0aGlzLmRhdGVwaWNrZXIgPSBkO1xuICAgIGQub3BlbigpO1xuICB9XG5cbiAgZ2V0UGxhY2Vob2xkZXJIb3VyKCkge1xuICAgIGxldCBwbGFjZWhvbGRlciA9ICcnO1xuICAgIGlmICh0aGlzLm9Ib3VyUGxhY2Vob2xkZXIpIHtcbiAgICAgIHBsYWNlaG9sZGVyID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCh0aGlzLm9Ib3VyUGxhY2Vob2xkZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGFjZWhvbGRlciA9IHN1cGVyLmdldFBsYWNlaG9sZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBwbGFjZWhvbGRlcjtcbiAgfVxuXG4gIGdldFBsYWNlaG9sZGVyRGF0ZSgpIHtcbiAgICBsZXQgcGxhY2Vob2xkZXIgPSAnJztcbiAgICBpZiAodGhpcy5vRGF0ZVBsYWNlaG9sZGVyKSB7XG4gICAgICBwbGFjZWhvbGRlciA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQodGhpcy5vRGF0ZVBsYWNlaG9sZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxhY2Vob2xkZXIgPSBzdXBlci5nZXRQbGFjZWhvbGRlcigpO1xuICAgIH1cbiAgICByZXR1cm4gcGxhY2Vob2xkZXI7XG4gIH1cblxuICBwdWJsaWMgb3BlbihlPzogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZSkpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBpY2tlcikge1xuICAgICAgdGhpcy5waWNrZXIub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBoYW5kbGVLZXlkb3duKGU6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLmFjdGl2ZUtleXNbZS5rZXlDb2RlXSA9IHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgaGFuZGxlS2V5dXAoZTogS2V5Ym9hcmRFdmVudCkge1xuICAgIHRoaXMuYWN0aXZlS2V5c1tlLmtleUNvZGVdID0gZmFsc2U7XG4gICAgY29uc3Qgb0NvbHVtbiA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLnRhYmxlQ29sdW1uLmF0dHIpO1xuICAgIGlmICghb0NvbHVtbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZS5rZXlDb2RlID09PSA5ICYmICh0aGlzLmFjdGl2ZUtleXNbMTZdIHx8ICF0aGlzLmVuYWJsZWRDb21taXRPblRhYlByZXNzKSkge1xuICAgICAgLy8gdGFiICsgc2hpZnQgb3IgdGFiIHByZXNzZWQgd2l0aCBmb2N1cyBpbiB0aGUgZGF0ZSBjb21wb25lbnRcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFvQ29sdW1uLmVkaXRpbmcgJiYgdGhpcy5kYXRlcGlja2VyICYmIHRoaXMuZGF0ZXBpY2tlci5vcGVuZWQpIHtcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5oYW5kbGVLZXl1cChlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlQ29tcG9uZW50VmFsdWUoKTogdm9pZCB7XG5cbiAgICBsZXQgdGltZVZhbHVlOiBudW1iZXI7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5mb3JtR3JvdXAuZ2V0UmF3VmFsdWUoKTtcbiAgICBjb25zdCBtRGF0ZSA9ICh2YWx1ZXNbJ2RhdGVJbnB1dCddID8gbW9tZW50KHZhbHVlc1snZGF0ZUlucHV0J10pIDogbW9tZW50KCkpLnN0YXJ0T2YoJ2RheScpO1xuXG4gICAgY29uc3QgbUhvdXIgPSBtb21lbnQodmFsdWVzWydob3VySW5wdXQnXSwgdGhpcy5mb3JtYXRTdHJpbmcpO1xuICAgIHRpbWVWYWx1ZSA9IG1EYXRlLmNsb25lKClcbiAgICAgIC5zZXQoJ2hvdXInLCBtSG91ci5nZXQoJ2hvdXInKSlcbiAgICAgIC5zZXQoJ21pbnV0ZScsIG1Ib3VyLmdldCgnbWludXRlcycpKVxuICAgICAgLnZhbHVlT2YoKTtcblxuICAgIGlmICh0aGlzLmZvcm1Db250cm9sKSB7XG4gICAgICB0aGlzLmZvcm1Db250cm9sLnNldFZhbHVlKHRpbWVWYWx1ZSk7XG4gICAgICB0aGlzLmZvcm1Db250cm9sLm1hcmtBc0RpcnR5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG1vZGlmeVBpY2tlck1ldGhvZHMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGlja2VyICYmIHRoaXMucGlja2VyLmlucHV0RWxlbWVudCkge1xuICAgICAgdGhpcy5waWNrZXIuaW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5vbktleWJvYXJkSW5wdXREb25lID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBpZiAodGhpcy5waWNrZXIpIHtcbiAgICAvLyAgIGNvbnN0IG5neFRpbWVwaWNrZXIgPSB0aGlzLnBpY2tlci50aW1lcGlja2VySW5wdXQ7XG4gICAgLy8gICBpZiAobmd4VGltZXBpY2tlciAmJiBuZ3hUaW1lcGlja2VyLm9uSW5wdXQpIHtcbiAgICAvLyAgICAgbmd4VGltZXBpY2tlci5vbklucHV0ID0gKHZhbHVlOiBzdHJpbmcpID0+IHRoaXMub25LZXlib2FyZElucHV0RG9uZSA9IHRydWU7XG4gICAgLy8gICB9XG4gICAgLy8gfVxuICB9XG5cbiAgaGFzRXJyb3JEYXRlKGVycm9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtQ29udHJvbERhdGUgJiYgdGhpcy5mb3JtQ29udHJvbERhdGUudG91Y2hlZCAmJiB0aGlzLmhhc0Vycm9yRXhjbHVzaXZlKGVycm9yKTtcbiAgfVxuXG4gIGhhc0Vycm9yRXhjbHVzaXZlKGVycm9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcbiAgICBjb25zdCBlcnJvcnNPcmRlciA9IFsnbWF0RGF0ZXBpY2tlck1heCcsICdtYXREYXRlcGlja2VyTWluJywgJ21hdERhdGVwaWNrZXJGaWx0ZXInLCAnbWF0RGF0ZXBpY2tlclBhcnNlJywgJ3JlcXVpcmVkJ107XG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5mb3JtQ29udHJvbERhdGUuZXJyb3JzO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChlcnJvcnMpKSB7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoZXJyb3JzKS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZXJyb3JzT3JkZXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBoYXNFcnJvciA9IGVycm9ycy5oYXNPd25Qcm9wZXJ0eShlcnJvcnNPcmRlcltpXSk7XG4gICAgICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgICAgICBoYXNFcnJvciA9IChlcnJvcnNPcmRlcltpXSA9PT0gZXJyb3IpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNFcnJvcjtcbiAgfVxuICBoYXNFcnJvckhvdXIoZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1Db250cm9sSG91ciAmJiB0aGlzLmZvcm1Db250cm9sSG91ci50b3VjaGVkO1xuICB9XG5cbiAgZ2V0Q2VsbERhdGFEYXRlKCk6IGFueSB7XG4gICAgY29uc3QgdmFsdWUgPSBzdXBlci5nZXRDZWxsRGF0YSgpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG0gPSBtb21lbnQodmFsdWUpO1xuICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG0pKSB7XG4gICAgICAgIHJlc3VsdCA9IG0udG9EYXRlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBnZXRDZWxsRGF0YUhvdXIoKTogYW55IHtcbiAgICBjb25zdCB2YWx1ZSA9IHN1cGVyLmdldENlbGxEYXRhKCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHZhbHVlKSkge1xuICAgICAgY29uc3QgbSA9IG1vbWVudCh2YWx1ZSk7XG4gICAgICBsZXQgcmVzdWx0ID0gdmFsdWU7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQobSkpIHtcbiAgICAgICAgcmVzdWx0ID0gbS5mb3JtYXQoQ29kZXMuZm9ybWF0U3RyaW5nKHRoaXMub0hvdXJGb3JtYXQpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHN0YXJ0RWRpdGlvbihkYXRhOiBhbnkpIHtcbiAgICBzdXBlci5zdGFydEVkaXRpb24oZGF0YSk7XG4gICAgY29uc3QgY2VsbERhdGFEYXRlID0gdGhpcy5nZXRDZWxsRGF0YURhdGUoKTtcbiAgICB0aGlzLmZvcm1Db250cm9sRGF0ZS5zZXRWYWx1ZShjZWxsRGF0YURhdGUpO1xuXG4gICAgY29uc3QgY2VsbERhdGFIb3VyID0gdGhpcy5nZXRDZWxsRGF0YUhvdXIoKTtcbiAgICB0aGlzLmZvcm1Db250cm9sSG91ci5zZXRWYWx1ZShjZWxsRGF0YUhvdXIpO1xuICAgIHRoaXMuZm9ybUdyb3VwLm1hcmtBc1RvdWNoZWQoKTtcbiAgfVxuXG4gIGdldCBmb3JtYXRTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gQ29kZXMuZm9ybWF0U3RyaW5nKHRoaXMub0hvdXJGb3JtYXQpO1xuICB9XG5cbiAgZ2V0IG1pbkRhdGVTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbWluRGF0ZVN0cmluZztcbiAgfVxuXG4gIHNldCBtaW5EYXRlU3RyaW5nKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5fbWluRGF0ZVN0cmluZyA9IHZhbDtcbiAgfVxuXG4gIGdldCBtYXhEYXRlU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX21heERhdGVTdHJpbmc7XG4gIH1cblxuICBzZXQgbWF4RGF0ZVN0cmluZyh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX21heERhdGVTdHJpbmcgPSB2YWw7XG4gIH1cblxuICBwdWJsaWMgc2V0IG9EYXRlTG9jYWxlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9vRGF0ZUxvY2FsZSA9IHZhbHVlO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLl9vRGF0ZUxvY2FsZSkpIHtcbiAgICAgIHRoaXMuYWRhcHRlci5zZXRMb2NhbGUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBtaW5EYXRlKCk6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLm9NaW5EYXRlKTtcbiAgfVxuXG4gIGdldCBtYXhEYXRlKCk6IERhdGUge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLm9NYXhEYXRlKTtcbiAgfVxuXG4gIG9uRGF0ZXBpY2tlckNsb3NlZCgpIHtcbiAgICB0aGlzLmRhdGVJbnB1dC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBvblRpbWVwaWNrZXJDbG9zZWQoKSB7XG4gICAgdGhpcy5ob3VySW5wdXQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG5cbiAgY29tbWl0RWRpdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuZm9ybUdyb3VwLmludmFsaWQpIHtcbiAgICAgIHN1cGVyLmNvbW1pdEVkaXRpb24oKTtcbiAgICB9XG4gIH1cblxuICBvbktleURvd24oZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICghQ29kZXMuaXNIb3VySW5wdXRBbGxvd2VkKGUpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==