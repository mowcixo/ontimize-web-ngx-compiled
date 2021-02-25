import * as tslib_1 from "tslib";
import { EventEmitter, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputConverter } from '../../../../decorators/input-converter';
import { SnackBarService } from '../../../../services/snackbar.service';
import { OTranslateService } from '../../../../services/translate/o-translate.service';
import { ObservableWrapper } from '../../../../util/async';
import { Util } from '../../../../util/util';
import { OTableColumnComponent } from '../o-table-column.component';
export var DEFAULT_INPUTS_O_TABLE_CELL_EDITOR = [
    'orequired: required',
    'showPlaceHolder: show-placeholder',
    'olabel: label',
    'updateRecordOnEdit: update-record-on-edit',
    'showNotificationOnEdit: show-notification-on-edit',
    'enabled'
];
export var DEFAULT_OUTPUTS_O_TABLE_CELL_EDITOR = [
    'editionStarted',
    'editionCancelled',
    'editionCommitted',
    'onPostUpdateRecord'
];
var OBaseTableCellEditor = (function () {
    function OBaseTableCellEditor(injector) {
        this.injector = injector;
        this.orequired = false;
        this.showPlaceHolder = false;
        this.updateRecordOnEdit = true;
        this.showNotificationOnEdit = true;
        this._enabled = true;
        this.formGroup = new FormGroup({});
        this.editionStarted = new EventEmitter();
        this.editionCancelled = new EventEmitter();
        this.editionCommitted = new EventEmitter();
        this.onPostUpdateRecord = new EventEmitter();
        this.editorCreated = new EventEmitter();
        this.registerInColumn = true;
        this.snackBarService = this.injector.get(SnackBarService);
        this.tableColumn = this.injector.get(OTableColumnComponent);
        this.translateService = this.injector.get(OTranslateService);
    }
    OBaseTableCellEditor.prototype.onDocumentKeyup = function (event) {
        this.handleKeyup(event);
    };
    OBaseTableCellEditor.prototype.ngOnInit = function () {
        this.initialize();
    };
    OBaseTableCellEditor.prototype.initialize = function () {
        this.createFormControl();
        this.registerEditor();
        this.editorCreated.emit(this);
    };
    OBaseTableCellEditor.prototype.handleKeyup = function (event) {
        var oColumn = this.table.getOColumn(this.tableColumnAttr);
        if (!oColumn || !oColumn.editing) {
            return;
        }
        if (event.keyCode === 27) {
            this.onEscClicked();
        }
        else if (event.keyCode === 13 || event.keyCode === 9) {
            this.commitEdition();
        }
    };
    OBaseTableCellEditor.prototype.createFormControl = function () {
        if (!this.formControl) {
            var validators = this.resolveValidators();
            var cfg = {
                value: undefined,
                disabled: !this.enabled
            };
            this.formControl = new FormControl(cfg, validators);
            this.formGroup.addControl(Math.random().toString(36), this.formControl);
        }
    };
    OBaseTableCellEditor.prototype.registerEditor = function () {
        if (this.registerInColumn && !Util.isDefined(this.tableColumn.editor)) {
            this.tableColumn.registerEditor(this);
            if (!Util.isDefined(this.type) && Util.isDefined(this.tableColumn.type)) {
                this.type = this.tableColumn.type;
            }
        }
    };
    OBaseTableCellEditor.prototype.getCellData = function () {
        return this._rowData[this.tableColumnAttr];
    };
    OBaseTableCellEditor.prototype.startEdition = function (data) {
        this.formGroup.reset();
        this.rowData = data;
        if (!this.isSilentControl()) {
            this.editionStarted.emit(this._rowData);
        }
    };
    OBaseTableCellEditor.prototype.endEdition = function (saveChanges) {
        var oColumn = this.table.getOColumn(this.tableColumnAttr);
        if (oColumn) {
            var self_1 = this;
            var updateObserver = this.table.updateCellData(oColumn, this._rowData, saveChanges);
            if (updateObserver) {
                updateObserver.subscribe(function (res) {
                    self_1.onUpdateSuccess(res);
                    self_1.table.cd.detectChanges();
                }, function (error) {
                    self_1._rowData[self_1.tableColumnAttr] = self_1.oldValue;
                    self_1.table.dataSource.updateRenderedRowData(self_1._rowData);
                    self_1.table.showDialogError(error, 'MESSAGES.ERROR_UPDATE');
                    self_1.table.cd.detectChanges();
                });
            }
            else {
                self_1.table.cd.detectChanges();
            }
        }
    };
    OBaseTableCellEditor.prototype.commitEdition = function () {
        if (!this.formControl.invalid) {
            this.oldValue = this._rowData[this.tableColumnAttr];
            this._rowData[this.tableColumnAttr] = this.formControl.value;
            if (!this.isSilentControl()) {
                this.endEdition(true);
                this.editionCommitted.emit(this._rowData);
            }
        }
    };
    Object.defineProperty(OBaseTableCellEditor.prototype, "tableColumn", {
        get: function () {
            return this._tableColumn;
        },
        set: function (arg) {
            this._tableColumn = arg;
            if (arg) {
                this._table = arg.table;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTableCellEditor.prototype, "tableColumnAttr", {
        get: function () {
            if (this._tableColumn) {
                return this._tableColumn.attr;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTableCellEditor.prototype, "table", {
        get: function () {
            return this._table;
        },
        set: function (arg) {
            this._table = arg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTableCellEditor.prototype, "rowData", {
        get: function () {
            return this._rowData;
        },
        set: function (arg) {
            this._rowData = arg;
            var cellData = this.getCellData();
            this.formControl.setValue(cellData);
            this.formControl.markAsTouched();
            if (this.inputRef && this.inputRef.nativeElement.type === 'text') {
                this.inputRef.nativeElement.setSelectionRange(0, String(cellData).length);
            }
        },
        enumerable: true,
        configurable: true
    });
    OBaseTableCellEditor.prototype.resolveValidators = function () {
        var validators = [];
        if (this.orequired) {
            validators.push(Validators.required);
        }
        return validators;
    };
    OBaseTableCellEditor.prototype.hasError = function (error) {
        return this.formControl && this.formControl.touched && this.hasErrorExclusive(error);
    };
    OBaseTableCellEditor.prototype.hasErrorExclusive = function (error) {
        var hasError = false;
        var errorsOrder = ['matDatepickerMax', 'matDatepickerMin', 'matDatepickerFilter', 'matDatepickerParse', 'required'];
        var errors = this.formControl.errors;
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
    OBaseTableCellEditor.prototype.getErrorValue = function (error, prop) {
        return this.formControl.hasError(error) ? this.formControl.getError(error)[prop] || '' : '';
    };
    OBaseTableCellEditor.prototype.onEscClicked = function () {
        if (!this.isSilentControl()) {
            this.endEdition(false);
            this.editionCancelled.emit(this._rowData);
        }
    };
    OBaseTableCellEditor.prototype.isSilentControl = function () {
        return this.controlArgs !== undefined && this.controlArgs.silent;
    };
    OBaseTableCellEditor.prototype.getPlaceholder = function () {
        return this.showPlaceHolder ?
            this.translateService.get(this.olabel || this.tableColumn ? (this.tableColumn.title || this.tableColumnAttr) : this.tableColumnAttr) :
            undefined;
    };
    OBaseTableCellEditor.prototype.onUpdateSuccess = function (res) {
        ObservableWrapper.callEmit(this.onPostUpdateRecord, this._rowData);
        if (this.showNotificationOnEdit) {
            this.snackBarService.open('MESSAGES.UPDATED', { icon: 'check_circle' });
        }
    };
    Object.defineProperty(OBaseTableCellEditor.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (arg) {
            this._enabled = arg;
            if (this.formControl) {
                this._enabled ? this.formControl.enable() : this.formControl.disable();
            }
        },
        enumerable: true,
        configurable: true
    });
    OBaseTableCellEditor.prototype.getFormControl = function () {
        return this.formControl;
    };
    OBaseTableCellEditor.propDecorators = {
        onDocumentKeyup: [{ type: HostListener, args: ['document:keyup', ['$event'],] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OBaseTableCellEditor.prototype, "orequired", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OBaseTableCellEditor.prototype, "showPlaceHolder", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OBaseTableCellEditor.prototype, "updateRecordOnEdit", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OBaseTableCellEditor.prototype, "showNotificationOnEdit", void 0);
    return OBaseTableCellEditor;
}());
export { OBaseTableCellEditor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXNlLXRhYmxlLWNlbGwtZWRpdG9yLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLWVkaXRvci9vLWJhc2UtdGFibGUtY2VsbC1lZGl0b3IuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUM3RSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBZSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqRixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFFeEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ3ZGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUc3QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUlwRSxNQUFNLENBQUMsSUFBTSxrQ0FBa0MsR0FBRztJQUNoRCxxQkFBcUI7SUFDckIsbUNBQW1DO0lBQ25DLGVBQWU7SUFDZiwyQ0FBMkM7SUFDM0MsbURBQW1EO0lBQ25ELFNBQVM7Q0FDVixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sbUNBQW1DLEdBQUc7SUFDakQsZ0JBQWdCO0lBQ2hCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsb0JBQW9CO0NBQ3JCLENBQUM7QUFFRjtJQThDRSw4QkFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQXpDeEMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUUzQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUdqQyx1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFFbkMsMkJBQXNCLEdBQVksSUFBSSxDQUFDO1FBQzdCLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFVbkMsY0FBUyxHQUFjLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpDLG1CQUFjLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDbEUscUJBQWdCLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFDcEUscUJBQWdCLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFFcEUsdUJBQWtCLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFFL0Qsa0JBQWEsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUt4RSxxQkFBZ0IsR0FBWSxJQUFJLENBQUM7UUFXL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDL0QsQ0FBQztJQVJELDhDQUFlLEdBRGYsVUFDZ0IsS0FBb0I7UUFDbEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBUUQsdUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0seUNBQVUsR0FBakI7UUFDRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVTLDBDQUFXLEdBQXJCLFVBQXNCLEtBQW9CO1FBQ3hDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUFFO1lBRXhCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNyQjthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7WUFFdEQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVELGdEQUFpQixHQUFqQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLElBQU0sVUFBVSxHQUFrQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMzRCxJQUFNLEdBQUcsR0FBRztnQkFDVixLQUFLLEVBQUUsU0FBUztnQkFDaEIsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU87YUFDeEIsQ0FBQztZQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3BELElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyRSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2FBQ25DO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsMENBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELDJDQUFZLEdBQVosVUFBYSxJQUFTO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLFdBQVc7UUFDcEIsSUFBTSxPQUFPLEdBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3JFLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBTSxNQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3RGLElBQUksY0FBYyxFQUFFO2dCQUNsQixjQUFjLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztvQkFDMUIsTUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDMUIsTUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2hDLENBQUMsRUFBRSxVQUFBLEtBQUs7b0JBQ04sTUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDcEQsTUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsTUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMzRCxNQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztvQkFDM0QsTUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ2hDLENBQUMsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsTUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDL0I7U0FDRjtJQUNILENBQUM7SUFFRCw0Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1lBQzdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDN0QsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0M7U0FDRjtJQUNILENBQUM7SUFFRCxzQkFBSSw2Q0FBVzthQUFmO1lBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzNCLENBQUM7YUFFRCxVQUFnQixHQUFpQjtZQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztZQUN4QixJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDekI7UUFDSCxDQUFDOzs7T0FQQTtJQVNELHNCQUFJLGlEQUFlO2FBQW5CO1lBQ0UsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNyQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSx1Q0FBSzthQUlUO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7YUFORCxVQUFVLEdBQW9CO1lBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBTUQsc0JBQUkseUNBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO2FBRUQsVUFBWSxHQUFRO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBRWpDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO2dCQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzNFO1FBQ0gsQ0FBQzs7O09BWEE7SUFhRCxnREFBaUIsR0FBakI7UUFDRSxJQUFNLFVBQVUsR0FBa0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx1Q0FBUSxHQUFSLFVBQVMsS0FBYTtRQUNwQixPQUFPLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxnREFBaUIsR0FBakIsVUFBa0IsS0FBYTtRQUM3QixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBTSxXQUFXLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0SCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3BDLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNyQztpQkFBTTtnQkFDTCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN0RCxRQUFRLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsSUFBSSxRQUFRLEVBQUU7d0JBQ1osUUFBUSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDO3dCQUN0QyxNQUFNO3FCQUNQO2lCQUNGO2FBQ0Y7U0FDRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCw0Q0FBYSxHQUFiLFVBQWMsS0FBYSxFQUFFLElBQVk7UUFDdkMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUYsQ0FBQztJQUVELDJDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO1lBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBRVMsOENBQWUsR0FBekI7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ25FLENBQUM7SUFFRCw2Q0FBYyxHQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN0SSxTQUFTLENBQUM7SUFDZCxDQUFDO0lBRVMsOENBQWUsR0FBekIsVUFBMEIsR0FBUTtRQUNoQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1NBQ3pFO0lBQ0gsQ0FBQztJQUVELHNCQUFJLHlDQUFPO2FBT1g7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQVRELFVBQVksR0FBWTtZQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQztZQUNwQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDeEU7UUFDSCxDQUFDOzs7T0FBQTtJQU1ELDZDQUFjLEdBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQzs7a0NBdE5BLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFwQzFDO1FBREMsY0FBYyxFQUFFOzsyREFDVTtJQUUzQjtRQURDLGNBQWMsRUFBRTs7aUVBQ2dCO0lBR2pDO1FBREMsY0FBYyxFQUFFOztvRUFDa0I7SUFFbkM7UUFEQyxjQUFjLEVBQUU7O3dFQUNzQjtJQW9QekMsMkJBQUM7Q0FBQSxBQWhRRCxJQWdRQztTQWhRWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9yRm4sIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RhYmxlQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWNvbHVtbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgU25hY2tCYXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmljZXMvc25hY2tiYXIuc2VydmljZSc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi9vLWNvbHVtbi5jbGFzcyc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuLi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuXG4vLyBpbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuLi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX0VESVRPUiA9IFtcbiAgJ29yZXF1aXJlZDogcmVxdWlyZWQnLFxuICAnc2hvd1BsYWNlSG9sZGVyOiBzaG93LXBsYWNlaG9sZGVyJyxcbiAgJ29sYWJlbDogbGFiZWwnLFxuICAndXBkYXRlUmVjb3JkT25FZGl0OiB1cGRhdGUtcmVjb3JkLW9uLWVkaXQnLFxuICAnc2hvd05vdGlmaWNhdGlvbk9uRWRpdDogc2hvdy1ub3RpZmljYXRpb24tb24tZWRpdCcsXG4gICdlbmFibGVkJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX0NFTExfRURJVE9SID0gW1xuICAnZWRpdGlvblN0YXJ0ZWQnLFxuICAnZWRpdGlvbkNhbmNlbGxlZCcsXG4gICdlZGl0aW9uQ29tbWl0dGVkJyxcbiAgJ29uUG9zdFVwZGF0ZVJlY29yZCdcbl07XG5cbmV4cG9ydCBjbGFzcyBPQmFzZVRhYmxlQ2VsbEVkaXRvciBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG9yZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBzaG93UGxhY2VIb2xkZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgb2xhYmVsOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHVwZGF0ZVJlY29yZE9uRWRpdDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dOb3RpZmljYXRpb25PbkVkaXQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwcm90ZWN0ZWQgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHByb3RlY3RlZCBfdGFibGVDb2x1bW46IE9UYWJsZUNvbHVtbjtcbiAgcHJvdGVjdGVkIF90YWJsZTogT1RhYmxlQ29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBfcm93RGF0YTogYW55O1xuXG4gIGZvcm1Db250cm9sOiBGb3JtQ29udHJvbDtcbiAgY29udHJvbEFyZ3M6IGFueTtcblxuICBmb3JtR3JvdXA6IEZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuXG4gIGVkaXRpb25TdGFydGVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICBlZGl0aW9uQ2FuY2VsbGVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuICBlZGl0aW9uQ29tbWl0dGVkOiBFdmVudEVtaXR0ZXI8b2JqZWN0PiA9IG5ldyBFdmVudEVtaXR0ZXI8b2JqZWN0PigpO1xuXG4gIG9uUG9zdFVwZGF0ZVJlY29yZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwdWJsaWMgZWRpdG9yQ3JlYXRlZDogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBpbnB1dFJlZjogYW55O1xuXG4gIHByb3RlY3RlZCB0eXBlOiBzdHJpbmc7XG4gIHJlZ2lzdGVySW5Db2x1bW46IGJvb2xlYW4gPSB0cnVlO1xuXG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcbiAgcHJvdGVjdGVkIG9sZFZhbHVlOiBhbnk7XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6a2V5dXAnLCBbJyRldmVudCddKVxuICBvbkRvY3VtZW50S2V5dXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLmhhbmRsZUtleXVwKGV2ZW50KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gICAgdGhpcy50YWJsZUNvbHVtbiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UYWJsZUNvbHVtbkNvbXBvbmVudCk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUZvcm1Db250cm9sKCk7XG4gICAgdGhpcy5yZWdpc3RlckVkaXRvcigpO1xuICAgIHRoaXMuZWRpdG9yQ3JlYXRlZC5lbWl0KHRoaXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhbmRsZUtleXVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qgb0NvbHVtbiA9IHRoaXMudGFibGUuZ2V0T0NvbHVtbih0aGlzLnRhYmxlQ29sdW1uQXR0cik7XG4gICAgaWYgKCFvQ29sdW1uIHx8ICFvQ29sdW1uLmVkaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7XG4gICAgICAvLyBlc2NhcGVcbiAgICAgIHRoaXMub25Fc2NDbGlja2VkKCk7XG4gICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAxMyB8fCBldmVudC5rZXlDb2RlID09PSA5KSB7XG4gICAgICAvLyBpbnRybyBvciB0YWJcbiAgICAgIHRoaXMuY29tbWl0RWRpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUZvcm1Db250cm9sKCkge1xuICAgIGlmICghdGhpcy5mb3JtQ29udHJvbCkge1xuICAgICAgY29uc3QgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHRoaXMucmVzb2x2ZVZhbGlkYXRvcnMoKTtcbiAgICAgIGNvbnN0IGNmZyA9IHtcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgZGlzYWJsZWQ6ICF0aGlzLmVuYWJsZWRcbiAgICAgIH07XG4gICAgICB0aGlzLmZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKGNmZywgdmFsaWRhdG9ycyk7XG4gICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLCB0aGlzLmZvcm1Db250cm9sKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckVkaXRvcigpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RlckluQ29sdW1uICYmICFVdGlsLmlzRGVmaW5lZCh0aGlzLnRhYmxlQ29sdW1uLmVkaXRvcikpIHtcbiAgICAgIHRoaXMudGFibGVDb2x1bW4ucmVnaXN0ZXJFZGl0b3IodGhpcyk7XG4gICAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHRoaXMudHlwZSkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy50YWJsZUNvbHVtbi50eXBlKSkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0aGlzLnRhYmxlQ29sdW1uLnR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0Q2VsbERhdGEoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcm93RGF0YVt0aGlzLnRhYmxlQ29sdW1uQXR0cl07XG4gIH1cblxuICBzdGFydEVkaXRpb24oZGF0YTogYW55KSB7XG4gICAgdGhpcy5mb3JtR3JvdXAucmVzZXQoKTtcbiAgICB0aGlzLnJvd0RhdGEgPSBkYXRhO1xuICAgIGlmICghdGhpcy5pc1NpbGVudENvbnRyb2woKSkge1xuICAgICAgdGhpcy5lZGl0aW9uU3RhcnRlZC5lbWl0KHRoaXMuX3Jvd0RhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGVuZEVkaXRpb24oc2F2ZUNoYW5nZXMpIHtcbiAgICBjb25zdCBvQ29sdW1uOiBPQ29sdW1uID0gdGhpcy50YWJsZS5nZXRPQ29sdW1uKHRoaXMudGFibGVDb2x1bW5BdHRyKTtcbiAgICBpZiAob0NvbHVtbikge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zdCB1cGRhdGVPYnNlcnZlciA9IHRoaXMudGFibGUudXBkYXRlQ2VsbERhdGEob0NvbHVtbiwgdGhpcy5fcm93RGF0YSwgc2F2ZUNoYW5nZXMpO1xuICAgICAgaWYgKHVwZGF0ZU9ic2VydmVyKSB7XG4gICAgICAgIHVwZGF0ZU9ic2VydmVyLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgICAgIHNlbGYub25VcGRhdGVTdWNjZXNzKHJlcyk7XG4gICAgICAgICAgc2VsZi50YWJsZS5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICBzZWxmLl9yb3dEYXRhW3NlbGYudGFibGVDb2x1bW5BdHRyXSA9IHNlbGYub2xkVmFsdWU7XG4gICAgICAgICAgc2VsZi50YWJsZS5kYXRhU291cmNlLnVwZGF0ZVJlbmRlcmVkUm93RGF0YShzZWxmLl9yb3dEYXRhKTtcbiAgICAgICAgICBzZWxmLnRhYmxlLnNob3dEaWFsb2dFcnJvcihlcnJvciwgJ01FU1NBR0VTLkVSUk9SX1VQREFURScpO1xuICAgICAgICAgIHNlbGYudGFibGUuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYudGFibGUuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbW1pdEVkaXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1Db250cm9sLmludmFsaWQpIHtcbiAgICAgIHRoaXMub2xkVmFsdWUgPSB0aGlzLl9yb3dEYXRhW3RoaXMudGFibGVDb2x1bW5BdHRyXTtcbiAgICAgIHRoaXMuX3Jvd0RhdGFbdGhpcy50YWJsZUNvbHVtbkF0dHJdID0gdGhpcy5mb3JtQ29udHJvbC52YWx1ZTtcbiAgICAgIGlmICghdGhpcy5pc1NpbGVudENvbnRyb2woKSkge1xuICAgICAgICB0aGlzLmVuZEVkaXRpb24odHJ1ZSk7XG4gICAgICAgIHRoaXMuZWRpdGlvbkNvbW1pdHRlZC5lbWl0KHRoaXMuX3Jvd0RhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCB0YWJsZUNvbHVtbigpOiBPVGFibGVDb2x1bW4ge1xuICAgIHJldHVybiB0aGlzLl90YWJsZUNvbHVtbjtcbiAgfVxuXG4gIHNldCB0YWJsZUNvbHVtbihhcmc6IE9UYWJsZUNvbHVtbikge1xuICAgIHRoaXMuX3RhYmxlQ29sdW1uID0gYXJnO1xuICAgIGlmIChhcmcpIHtcbiAgICAgIHRoaXMuX3RhYmxlID0gYXJnLnRhYmxlO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0YWJsZUNvbHVtbkF0dHIoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5fdGFibGVDb2x1bW4pIHtcbiAgICAgIHJldHVybiB0aGlzLl90YWJsZUNvbHVtbi5hdHRyO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0IHRhYmxlKGFyZzogT1RhYmxlQ29tcG9uZW50KSB7XG4gICAgdGhpcy5fdGFibGUgPSBhcmc7XG4gIH1cblxuICBnZXQgdGFibGUoKTogT1RhYmxlQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fdGFibGU7XG4gIH1cblxuICBnZXQgcm93RGF0YSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9yb3dEYXRhO1xuICB9XG5cbiAgc2V0IHJvd0RhdGEoYXJnOiBhbnkpIHtcbiAgICB0aGlzLl9yb3dEYXRhID0gYXJnO1xuICAgIGNvbnN0IGNlbGxEYXRhID0gdGhpcy5nZXRDZWxsRGF0YSgpO1xuICAgIHRoaXMuZm9ybUNvbnRyb2wuc2V0VmFsdWUoY2VsbERhdGEpO1xuICAgIHRoaXMuZm9ybUNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuXG4gICAgaWYgKHRoaXMuaW5wdXRSZWYgJiYgdGhpcy5pbnB1dFJlZi5uYXRpdmVFbGVtZW50LnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgdGhpcy5pbnB1dFJlZi5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKDAsIFN0cmluZyhjZWxsRGF0YSkubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICByZXNvbHZlVmFsaWRhdG9ycygpOiBWYWxpZGF0b3JGbltdIHtcbiAgICBjb25zdCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gW107XG4gICAgaWYgKHRoaXMub3JlcXVpcmVkKSB7XG4gICAgICB2YWxpZGF0b3JzLnB1c2goVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAgfVxuICAgIHJldHVybiB2YWxpZGF0b3JzO1xuICB9XG5cbiAgaGFzRXJyb3IoZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmZvcm1Db250cm9sICYmIHRoaXMuZm9ybUNvbnRyb2wudG91Y2hlZCAmJiB0aGlzLmhhc0Vycm9yRXhjbHVzaXZlKGVycm9yKTtcbiAgfVxuXG4gIGhhc0Vycm9yRXhjbHVzaXZlKGVycm9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcbiAgICBjb25zdCBlcnJvcnNPcmRlciA9IFsnbWF0RGF0ZXBpY2tlck1heCcsICdtYXREYXRlcGlja2VyTWluJywgJ21hdERhdGVwaWNrZXJGaWx0ZXInLCAnbWF0RGF0ZXBpY2tlclBhcnNlJywgJ3JlcXVpcmVkJ107XG4gICAgY29uc3QgZXJyb3JzID0gdGhpcy5mb3JtQ29udHJvbC5lcnJvcnM7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVycm9ycykpIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhlcnJvcnMpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZXJyb3JzLmhhc093blByb3BlcnR5KGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBlcnJvcnNPcmRlci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGhhc0Vycm9yID0gZXJyb3JzLmhhc093blByb3BlcnR5KGVycm9yc09yZGVyW2ldKTtcbiAgICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgIGhhc0Vycm9yID0gKGVycm9yc09yZGVyW2ldID09PSBlcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Vycm9yO1xuICB9XG5cbiAgZ2V0RXJyb3JWYWx1ZShlcnJvcjogc3RyaW5nLCBwcm9wOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZvcm1Db250cm9sLmhhc0Vycm9yKGVycm9yKSA/IHRoaXMuZm9ybUNvbnRyb2wuZ2V0RXJyb3IoZXJyb3IpW3Byb3BdIHx8ICcnIDogJyc7XG4gIH1cblxuICBvbkVzY0NsaWNrZWQoKSB7XG4gICAgaWYgKCF0aGlzLmlzU2lsZW50Q29udHJvbCgpKSB7XG4gICAgICB0aGlzLmVuZEVkaXRpb24oZmFsc2UpO1xuICAgICAgdGhpcy5lZGl0aW9uQ2FuY2VsbGVkLmVtaXQodGhpcy5fcm93RGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGlzU2lsZW50Q29udHJvbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sQXJncyAhPT0gdW5kZWZpbmVkICYmIHRoaXMuY29udHJvbEFyZ3Muc2lsZW50O1xuICB9XG5cbiAgZ2V0UGxhY2Vob2xkZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zaG93UGxhY2VIb2xkZXIgP1xuICAgICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCh0aGlzLm9sYWJlbCB8fCB0aGlzLnRhYmxlQ29sdW1uID8gKHRoaXMudGFibGVDb2x1bW4udGl0bGUgfHwgdGhpcy50YWJsZUNvbHVtbkF0dHIpIDogdGhpcy50YWJsZUNvbHVtbkF0dHIpIDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblVwZGF0ZVN1Y2Nlc3MocmVzOiBhbnkpIHtcbiAgICBPYnNlcnZhYmxlV3JhcHBlci5jYWxsRW1pdCh0aGlzLm9uUG9zdFVwZGF0ZVJlY29yZCwgdGhpcy5fcm93RGF0YSk7XG4gICAgaWYgKHRoaXMuc2hvd05vdGlmaWNhdGlvbk9uRWRpdCkge1xuICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuVVBEQVRFRCcsIHsgaWNvbjogJ2NoZWNrX2NpcmNsZScgfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0IGVuYWJsZWQoYXJnOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZW5hYmxlZCA9IGFyZztcbiAgICBpZiAodGhpcy5mb3JtQ29udHJvbCkge1xuICAgICAgdGhpcy5fZW5hYmxlZCA/IHRoaXMuZm9ybUNvbnRyb2wuZW5hYmxlKCkgOiB0aGlzLmZvcm1Db250cm9sLmRpc2FibGUoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgfVxuXG4gIGdldEZvcm1Db250cm9sKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm1Db250cm9sO1xuICB9XG59XG4iXX0=