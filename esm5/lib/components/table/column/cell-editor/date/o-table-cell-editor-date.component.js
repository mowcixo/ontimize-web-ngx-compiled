import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, Injector, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import moment from 'moment';
import { InputConverter } from '../../../../../decorators/input-converter';
import { MomentService } from '../../../../../services/moment.service';
import { OntimizeMomentDateAdapter } from '../../../../../shared/material/date/ontimize-moment-date-adapter';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR, OBaseTableCellEditor, } from '../o-base-table-cell-editor.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_EDITOR, [
    'format',
    'locale',
    'oStartView: start-view',
    'min',
    'max',
    'oTouchUi: touch-ui',
    'startAt: start-at',
    'filterDate: filter-date',
    'dateValueType: date-value-type'
]);
export var DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_DATE = tslib_1.__spread(DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR);
var OTableCellEditorDateComponent = (function (_super) {
    tslib_1.__extends(OTableCellEditorDateComponent, _super);
    function OTableCellEditorDateComponent(injector, momentDateAdapter) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.momentDateAdapter = momentDateAdapter;
        _this.format = 'L';
        _this.oStartView = 'month';
        _this.oTouchUi = false;
        _this._dateValueType = 'timestamp';
        _this.momentSrv = _this.injector.get(MomentService);
        return _this;
    }
    OTableCellEditorDateComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (!this.locale) {
            this.locale = this.momentSrv.getLocale();
        }
        if (this.format) {
            this.momentDateAdapter.oFormat = this.format;
        }
        this.momentDateAdapter.setLocale(this.locale);
        if (this.startAt) {
            this.oStartAt = new Date(this.startAt);
        }
        if (this.min) {
            var date = new Date(this.min);
            var momentD = moment(date);
            if (momentD.isValid()) {
                this.oMinDate = date;
                this.minDateString = momentD.format(this.format);
            }
        }
        if (this.max) {
            var date = new Date(this.max);
            var momentD = moment(date);
            if (momentD.isValid()) {
                this.oMaxDate = date;
                this.maxDateString = momentD.format(this.format);
            }
        }
    };
    OTableCellEditorDateComponent.prototype.handleKeyup = function (event) {
        var oColumn = this.table.getOColumn(this.tableColumn.attr);
        if (!oColumn) {
            return;
        }
        if (!oColumn.editing && this.datepicker && this.datepicker.opened) {
            this.datepicker.close();
        }
        else {
            _super.prototype.handleKeyup.call(this, event);
        }
    };
    OTableCellEditorDateComponent.prototype.startEdition = function (data) {
        _super.prototype.startEdition.call(this, data);
        if (!this.startAt) {
            this.oStartAt = this.getCellData();
        }
    };
    OTableCellEditorDateComponent.prototype.getCellData = function () {
        var value = _super.prototype.getCellData.call(this);
        if (Util.isDefined(value)) {
            var result = value;
            var m = void 0;
            switch (this.dateValueType) {
                case 'string':
                    m = moment(value, this.format);
                    break;
                case 'date':
                    break;
                case 'iso-8601':
                case 'timestamp':
                default:
                    m = moment(value);
                    break;
            }
            if (Util.isDefined(m)) {
                result = m.toDate();
            }
            return result;
        }
        return value;
    };
    OTableCellEditorDateComponent.prototype.commitEdition = function () {
        if (!this.formControl.invalid) {
            this.oldValue = this._rowData[this.tableColumnAttr];
            this._rowData[this.tableColumnAttr] = this.getValueByValyType();
            if (!this.isSilentControl()) {
                this.endEdition(true);
                this.editionCommitted.emit(this._rowData);
            }
        }
    };
    OTableCellEditorDateComponent.prototype.getValueByValyType = function () {
        var result = this.formControl.value;
        var m = moment(this.formControl.value);
        switch (this.dateValueType) {
            case 'string':
                result = m.format(this.format);
                break;
            case 'date':
                result = new Date(result);
                break;
            case 'iso-8601':
                result = m.toISOString();
                break;
            case 'timestamp':
            default:
                result = m.valueOf();
                break;
        }
        return result;
    };
    OTableCellEditorDateComponent.prototype.onDateChange = function (event) {
        var isValid = event.value && event.value.isValid && event.value.isValid();
        var val = isValid ? event.value.valueOf() : event.value;
        var m = moment(val);
        switch (this.dateValueType) {
            case 'string':
                if (val) {
                    val = m.format(this.format);
                }
                break;
            case 'date':
                val = new Date(val);
                break;
            case 'iso-8601':
                val = m.toISOString();
                break;
            case 'timestamp':
            default:
                break;
        }
        this.formControl.setValue(val, {
            emitModelToViewChange: false,
            emitEvent: false
        });
    };
    OTableCellEditorDateComponent.prototype.openDatepicker = function (d) {
        this.datepicker = d;
        d.open();
    };
    Object.defineProperty(OTableCellEditorDateComponent.prototype, "dateValueType", {
        get: function () {
            return this._dateValueType;
        },
        set: function (val) {
            this._dateValueType = Util.convertToODateValueType(val);
        },
        enumerable: true,
        configurable: true
    });
    OTableCellEditorDateComponent.prototype.onClosed = function () {
        this.inputRef.nativeElement.focus();
    };
    OTableCellEditorDateComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-editor-date',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  <div [formGroup]=\"formGroup\" class=\"o-table-cell-editor-date\">\n    <mat-form-field floatLabel=\"never\">\n      <input #input matInput [placeholder]=\"getPlaceholder()\" [formControl]=\"formControl\"\n        [required]=\"orequired\" [matDatepicker]=\"d\" [matDatepickerFilter]=\"filterDate\"\n        (dateChange)=\"onDateChange($event)\" [min]=\"oMinDate\" [max]=\"oMaxDate\">\n\n      <mat-datepicker #d [startView]=\"oStartView\" [startAt]=\"oStartAt\" [touchUi]=\"oTouchUi\" (closed)=\"onClosed()\">\n      </mat-datepicker>\n\n      <span class=\"icon-btn\" (click)=\"openDatepicker(d)\" matSuffix>\n        <mat-icon svgIcon=\"ontimize:today\"></mat-icon>\n      </span>\n\n      <mat-error *ngIf=\"hasError('required')\">{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}</mat-error>\n      <mat-error *ngIf=\"hasError('matDatepickerParse')\">{{ 'FORM_VALIDATION.DATE_PARSE' | oTranslate }} {{ format }}\n      </mat-error>\n      <mat-error *ngIf=\"hasError('matDatepickerFilter')\">{{ 'FORM_VALIDATION.DATE_FILTER' | oTranslate }}</mat-error>\n      <mat-error *ngIf=\"hasError('matDatepickerMin')\">{{ 'FORM_VALIDATION.DATE_MIN' | oTranslate }} {{ minDateString }}\n      </mat-error>\n      <mat-error *ngIf=\"hasError('matDatepickerMax')\">{{ 'FORM_VALIDATION.DATE_MAX' | oTranslate }} {{ maxDateString }}\n      </mat-error>\n    </mat-form-field>\n  </div>\n</ng-template>",
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_EDITOR_DATE,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR_DATE,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] }
                    ],
                    styles: [""]
                }] }
    ];
    OTableCellEditorDateComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: DateAdapter }
    ]; };
    OTableCellEditorDateComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }],
        inputRef: [{ type: ViewChild, args: ['input', { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableCellEditorDateComponent.prototype, "oTouchUi", void 0);
    return OTableCellEditorDateComponent;
}(OBaseTableCellEditor));
export { OTableCellEditorDateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLWVkaXRvci1kYXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1lZGl0b3IvZGF0ZS9vLXRhYmxlLWNlbGwtZWRpdG9yLWRhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUVSLFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUEwQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3pHLE9BQU8sTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUU1QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3ZFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBRzdHLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNoRCxPQUFPLEVBQ0wsa0NBQWtDLEVBQ2xDLG1DQUFtQyxFQUNuQyxvQkFBb0IsR0FDckIsTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxNQUFNLENBQUMsSUFBTSx1Q0FBdUMsb0JBQy9DLGtDQUFrQztJQUNyQyxRQUFRO0lBQ1IsUUFBUTtJQUNSLHdCQUF3QjtJQUN4QixLQUFLO0lBQ0wsS0FBSztJQUNMLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDbkIseUJBQXlCO0lBSXpCLGdDQUFnQztFQUNqQyxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sd0NBQXdDLG9CQUNoRCxtQ0FBbUMsQ0FDdkMsQ0FBQztBQUVGO0lBYW1ELHlEQUFvQjtJQXlCckUsdUNBQ1ksUUFB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TTtvQkFDL0MsU0FBUyxFQUFFO3dCQUNULEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUseUJBQXlCLEVBQUUsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUU7cUJBQ3ZGOztpQkFDRjs7O2dCQXBEQyxRQUFRO2dCQU1ELFdBQVc7Ozs4QkFrRGpCLFNBQVMsU0FBQyxhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7MkJBQzVELFNBQVMsU0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztJQVFyQztRQURDLGNBQWMsRUFBRTs7bUVBQ1M7SUErSzVCLG9DQUFDO0NBQUEsQUF2TUQsQ0FhbUQsb0JBQW9CLEdBMEx0RTtTQTFMWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEYXRlQWRhcHRlciwgTUFUX0RBVEVfTE9DQUxFLCBNYXREYXRlcGlja2VyLCBNYXREYXRlcGlja2VySW5wdXRFdmVudCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBNb21lbnRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvbW9tZW50LnNlcnZpY2UnO1xuaW1wb3J0IHsgT250aW1pemVNb21lbnREYXRlQWRhcHRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NoYXJlZC9tYXRlcmlhbC9kYXRlL29udGltaXplLW1vbWVudC1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHsgRGF0ZUZpbHRlckZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvZGF0ZS1maWx0ZXItZnVuY3Rpb24udHlwZSc7XG5pbXBvcnQgeyBPRGF0ZVZhbHVlVHlwZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tZGF0ZS12YWx1ZS50eXBlJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUixcbiAgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQ0VMTF9FRElUT1IsXG4gIE9CYXNlVGFibGVDZWxsRWRpdG9yLFxufSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1lZGl0b3IuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9EQVRFID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfRURJVE9SLFxuICAnZm9ybWF0JyxcbiAgJ2xvY2FsZScsXG4gICdvU3RhcnRWaWV3OiBzdGFydC12aWV3JyxcbiAgJ21pbicsXG4gICdtYXgnLFxuICAnb1RvdWNoVWk6IHRvdWNoLXVpJyxcbiAgJ3N0YXJ0QXQ6IHN0YXJ0LWF0JyxcbiAgJ2ZpbHRlckRhdGU6IGZpbHRlci1kYXRlJyxcbiAgLy8gdmFsdWUtdHlwZSBbdGltZXN0YW1wfHN0cmluZ106IHR5cGUgbXVzdCBiZSBkZWZpbmVkIHRvIGJlIGFibGUgdG8gc2F2ZSBpdHMgdmFsdWUsXG4gIC8vIGUuZy4gY2xhc3NpYyBvbnRpbWl6ZSBzZXJ2ZXIgZGF0ZXMgY29tZSBhcyB0aW1lc3RhbXBzIChudW1iZXIpLCBidXQgdG8gYmUgYWJsZSB0byBzYXZlIHRoZW0gdGhleSBoYXZlIHRvIGJlIHNlbmQgYXMgc3RyaW5ncyB3aXRoXG4gIC8vIHRoZSBmb3JtYXQgJ1lZWVktTU0tREQgSEg6bW06c3MnRGVmYXVsdDogdGltZXN0YW1wLlxuICAnZGF0ZVZhbHVlVHlwZTogZGF0ZS12YWx1ZS10eXBlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SX0RBVEUgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWNlbGwtZWRpdG9yLWRhdGUnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLWVkaXRvci1kYXRlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1jZWxsLWVkaXRvci1kYXRlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9EQVRFLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9DRUxMX0VESVRPUl9EQVRFLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgeyBwcm92aWRlOiBEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE9udGltaXplTW9tZW50RGF0ZUFkYXB0ZXIsIGRlcHM6IFtNQVRfREFURV9MT0NBTEVdIH1cbiAgXVxufSlcblxuZXhwb3J0IGNsYXNzIE9UYWJsZUNlbGxFZGl0b3JEYXRlQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxFZGl0b3IgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoJ3RlbXBsYXRlcmVmJywgeyByZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyB0ZW1wbGF0ZXJlZjogVGVtcGxhdGVSZWY8YW55PjtcbiAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgaW5wdXRSZWY6IEVsZW1lbnRSZWY7XG5cbiAgZm9ybWF0OiBzdHJpbmcgPSAnTCc7XG4gIHByb3RlY3RlZCBsb2NhbGU6IHN0cmluZztcbiAgb1N0YXJ0VmlldzogJ21vbnRoJyB8ICd5ZWFyJyA9ICdtb250aCc7XG4gIHByb3RlY3RlZCBtaW46IHN0cmluZztcbiAgcHJvdGVjdGVkIG1heDogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBvVG91Y2hVaTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgc3RhcnRBdDogc3RyaW5nO1xuICBmaWx0ZXJEYXRlOiBEYXRlRmlsdGVyRnVuY3Rpb247XG4gIF9kYXRlVmFsdWVUeXBlOiBPRGF0ZVZhbHVlVHlwZSA9ICd0aW1lc3RhbXAnO1xuXG4gIG9TdGFydEF0OiBEYXRlO1xuICBvTWluRGF0ZTogRGF0ZTtcbiAgb01heERhdGU6IERhdGU7XG5cbiAgcHJpdmF0ZSBtb21lbnRTcnY6IE1vbWVudFNlcnZpY2U7XG4gIG1pbkRhdGVTdHJpbmc6IHN0cmluZztcbiAgbWF4RGF0ZVN0cmluZzogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBkYXRlcGlja2VyOiBNYXREYXRlcGlja2VyPERhdGU+O1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBtb21lbnREYXRlQWRhcHRlcjogRGF0ZUFkYXB0ZXI8T250aW1pemVNb21lbnREYXRlQWRhcHRlcj5cbiAgKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMubW9tZW50U3J2ID0gdGhpcy5pbmplY3Rvci5nZXQoTW9tZW50U2VydmljZSk7XG4gIH1cblxuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICBpZiAoIXRoaXMubG9jYWxlKSB7XG4gICAgICB0aGlzLmxvY2FsZSA9IHRoaXMubW9tZW50U3J2LmdldExvY2FsZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb3JtYXQpIHtcbiAgICAgICh0aGlzLm1vbWVudERhdGVBZGFwdGVyIGFzIGFueSkub0Zvcm1hdCA9IHRoaXMuZm9ybWF0O1xuICAgIH1cblxuICAgIHRoaXMubW9tZW50RGF0ZUFkYXB0ZXIuc2V0TG9jYWxlKHRoaXMubG9jYWxlKTtcbiAgICBpZiAodGhpcy5zdGFydEF0KSB7XG4gICAgICB0aGlzLm9TdGFydEF0ID0gbmV3IERhdGUodGhpcy5zdGFydEF0KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5taW4pIHtcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSh0aGlzLm1pbik7XG4gICAgICBjb25zdCBtb21lbnREID0gbW9tZW50KGRhdGUpO1xuICAgICAgaWYgKG1vbWVudEQuaXNWYWxpZCgpKSB7XG4gICAgICAgIHRoaXMub01pbkRhdGUgPSBkYXRlO1xuICAgICAgICB0aGlzLm1pbkRhdGVTdHJpbmcgPSBtb21lbnRELmZvcm1hdCh0aGlzLmZvcm1hdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4KSB7XG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUodGhpcy5tYXgpO1xuICAgICAgY29uc3QgbW9tZW50RCA9IG1vbWVudChkYXRlKTtcbiAgICAgIGlmIChtb21lbnRELmlzVmFsaWQoKSkge1xuICAgICAgICB0aGlzLm9NYXhEYXRlID0gZGF0ZTtcbiAgICAgICAgdGhpcy5tYXhEYXRlU3RyaW5nID0gbW9tZW50RC5mb3JtYXQodGhpcy5mb3JtYXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBoYW5kbGVLZXl1cChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IG9Db2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy50YWJsZUNvbHVtbi5hdHRyKTtcbiAgICBpZiAoIW9Db2x1bW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFvQ29sdW1uLmVkaXRpbmcgJiYgdGhpcy5kYXRlcGlja2VyICYmIHRoaXMuZGF0ZXBpY2tlci5vcGVuZWQpIHtcbiAgICAgIHRoaXMuZGF0ZXBpY2tlci5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlci5oYW5kbGVLZXl1cChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnRFZGl0aW9uKGRhdGE6IGFueSkge1xuICAgIHN1cGVyLnN0YXJ0RWRpdGlvbihkYXRhKTtcbiAgICBpZiAoIXRoaXMuc3RhcnRBdCkge1xuICAgICAgdGhpcy5vU3RhcnRBdCA9IHRoaXMuZ2V0Q2VsbERhdGEoKTtcbiAgICB9XG4gIH1cblxuICBnZXRDZWxsRGF0YSgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlID0gc3VwZXIuZ2V0Q2VsbERhdGEoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodmFsdWUpKSB7XG4gICAgICBsZXQgcmVzdWx0ID0gdmFsdWU7XG4gICAgICBsZXQgbTtcbiAgICAgIHN3aXRjaCAodGhpcy5kYXRlVmFsdWVUeXBlKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgbSA9IG1vbWVudCh2YWx1ZSwgdGhpcy5mb3JtYXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnaXNvLTg2MDEnOlxuICAgICAgICBjYXNlICd0aW1lc3RhbXAnOlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG0gPSBtb21lbnQodmFsdWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKG0pKSB7XG4gICAgICAgIHJlc3VsdCA9IG0udG9EYXRlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBjb21taXRFZGl0aW9uKCkge1xuICAgIC8vICF0aGlzLmRhdGVwaWNrZXIub3BlbmVkICYmXG4gICAgaWYgKCF0aGlzLmZvcm1Db250cm9sLmludmFsaWQpIHtcbiAgICAgIHRoaXMub2xkVmFsdWUgPSB0aGlzLl9yb3dEYXRhW3RoaXMudGFibGVDb2x1bW5BdHRyXTtcbiAgICAgIHRoaXMuX3Jvd0RhdGFbdGhpcy50YWJsZUNvbHVtbkF0dHJdID0gdGhpcy5nZXRWYWx1ZUJ5VmFseVR5cGUoKTtcbiAgICAgIGlmICghdGhpcy5pc1NpbGVudENvbnRyb2woKSkge1xuICAgICAgICB0aGlzLmVuZEVkaXRpb24odHJ1ZSk7XG4gICAgICAgIHRoaXMuZWRpdGlvbkNvbW1pdHRlZC5lbWl0KHRoaXMuX3Jvd0RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRWYWx1ZUJ5VmFseVR5cGUoKTogYW55IHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5mb3JtQ29udHJvbC52YWx1ZTtcbiAgICBjb25zdCBtID0gbW9tZW50KHRoaXMuZm9ybUNvbnRyb2wudmFsdWUpO1xuICAgIHN3aXRjaCAodGhpcy5kYXRlVmFsdWVUeXBlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICByZXN1bHQgPSBtLmZvcm1hdCh0aGlzLmZvcm1hdCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0ZSc6XG4gICAgICAgIHJlc3VsdCA9IG5ldyBEYXRlKHJlc3VsdCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaXNvLTg2MDEnOlxuICAgICAgICByZXN1bHQgPSBtLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndGltZXN0YW1wJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJlc3VsdCA9IG0udmFsdWVPZigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG9uRGF0ZUNoYW5nZShldmVudDogTWF0RGF0ZXBpY2tlcklucHV0RXZlbnQ8YW55Pikge1xuICAgIGNvbnN0IGlzVmFsaWQgPSBldmVudC52YWx1ZSAmJiBldmVudC52YWx1ZS5pc1ZhbGlkICYmIGV2ZW50LnZhbHVlLmlzVmFsaWQoKTtcbiAgICBsZXQgdmFsID0gaXNWYWxpZCA/IGV2ZW50LnZhbHVlLnZhbHVlT2YoKSA6IGV2ZW50LnZhbHVlO1xuICAgIGNvbnN0IG0gPSBtb21lbnQodmFsKTtcbiAgICBzd2l0Y2ggKHRoaXMuZGF0ZVZhbHVlVHlwZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIHZhbCA9IG0uZm9ybWF0KHRoaXMuZm9ybWF0KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICB2YWwgPSBuZXcgRGF0ZSh2YWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2lzby04NjAxJzpcbiAgICAgICAgdmFsID0gbS50b0lTT1N0cmluZygpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3RpbWVzdGFtcCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLmZvcm1Db250cm9sLnNldFZhbHVlKHZhbCwge1xuICAgICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZSxcbiAgICAgIGVtaXRFdmVudDogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIG9wZW5EYXRlcGlja2VyKGQ6IE1hdERhdGVwaWNrZXI8RGF0ZT4pIHtcbiAgICB0aGlzLmRhdGVwaWNrZXIgPSBkO1xuICAgIGQub3BlbigpO1xuICB9XG5cbiAgc2V0IGRhdGVWYWx1ZVR5cGUodmFsOiBhbnkpIHtcbiAgICB0aGlzLl9kYXRlVmFsdWVUeXBlID0gVXRpbC5jb252ZXJ0VG9PRGF0ZVZhbHVlVHlwZSh2YWwpO1xuICB9XG5cbiAgZ2V0IGRhdGVWYWx1ZVR5cGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZGF0ZVZhbHVlVHlwZTtcbiAgfVxuXG4gIG9uQ2xvc2VkKCkge1xuICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICB9XG59XG4iXX0=