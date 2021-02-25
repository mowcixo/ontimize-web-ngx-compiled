import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, EventEmitter, forwardRef, Inject, Injector, } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { InputConverter } from '../../../../../decorators/input-converter';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { ObservableWrapper } from '../../../../../util/async';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
export var DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW = [
    'columns',
    'requiredColumns : required-columns',
    'position',
    'showPlaceHolder: show-placeholder',
    'includeParentKeys: include-parent-keys'
];
export var DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW = [
    'onPostInsertRecord'
];
var OTableInsertableRowComponent = (function () {
    function OTableInsertableRowComponent(injector, table, resolver) {
        this.injector = injector;
        this.table = table;
        this.resolver = resolver;
        this.columnsArray = [];
        this.requiredColumnsArray = [];
        this.onPostInsertRecord = new EventEmitter();
        this.columnEditors = {};
        this.position = OTableInsertableRowComponent.DEFAULT_ROW_POSITION;
        this.showPlaceHolder = false;
        this.includeParentKeys = true;
        this.enabled = true;
        this.rowData = {};
        this.controls = {};
        this.translateService = this.injector.get(OTranslateService);
        this.snackBarService = this.injector.get(SnackBarService);
    }
    OTableInsertableRowComponent.prototype.ngOnInit = function () {
        this.columnsArray = Util.parseArray(this.columns, true);
        if (this.columnsArray.length === 0) {
            this.columnsArray = this.table.oTableOptions.visibleColumns;
        }
        this.requiredColumnsArray = Util.parseArray(this.requiredColumns, true);
        if (OTableInsertableRowComponent.AVAILABLE_ROW_POSITIONS.indexOf((this.position || '').toLowerCase()) === -1) {
            this.position = OTableInsertableRowComponent.DEFAULT_ROW_POSITION;
        }
        this.table.setOTableInsertableRow(this);
    };
    OTableInsertableRowComponent.prototype.isFirstRow = function () {
        return this.position === 'first';
    };
    OTableInsertableRowComponent.prototype.isColumnInsertable = function (column) {
        return (this.columnsArray.indexOf(column.attr) !== -1);
    };
    OTableInsertableRowComponent.prototype.isColumnRequired = function (column) {
        return (this.requiredColumnsArray.indexOf(column.attr) !== -1);
    };
    OTableInsertableRowComponent.prototype.initializeEditors = function () {
        var _this = this;
        var self = this;
        this.table.oTableOptions.columns.forEach(function (col, i, array) {
            if (self.isColumnInsertable(col)) {
                var columnEditorType = col.editor ? col.editor.type : col.type;
                if (col.definition) {
                    var editor = col.definition.buildCellEditor(columnEditorType, _this.resolver, col.definition.container, col.definition);
                    _this.columnEditors[col.attr] = editor;
                    var disabledCol = !_this.enabled;
                    if (!disabledCol) {
                        var columnPermissions = _this.table.getOColumnPermissions(col.attr);
                        disabledCol = columnPermissions.enabled === false;
                    }
                    editor.enabled = !disabledCol;
                    editor.showPlaceHolder = _this.showPlaceHolder || editor.showPlaceHolder;
                    editor.table = self.table;
                    editor.tableColumn = col.editor ? col.editor.tableColumn : col.definition;
                    editor.orequired = _this.isColumnRequired(col);
                    editor.formControl = _this.getControl(col, disabledCol);
                    editor.controlArgs = { silent: true };
                    editor.rowData = self.rowData;
                    editor.startEdition(self.rowData);
                    editor.formControl.markAsUntouched();
                    col.editor = editor;
                }
            }
            array[i] = col;
        });
    };
    OTableInsertableRowComponent.prototype.useCellEditor = function (column) {
        return this.isColumnInsertable(column) && Util.isDefined(this.columnEditors[column.attr]);
    };
    OTableInsertableRowComponent.prototype.getControl = function (column, disabled) {
        if (disabled === void 0) { disabled = false; }
        if (!this.controls[column.attr]) {
            var validators = this.resolveValidators(column);
            var cfg = {
                value: undefined,
                disabled: disabled
            };
            this.controls[column.attr] = new FormControl(cfg, validators);
        }
        return this.controls[column.attr];
    };
    OTableInsertableRowComponent.prototype.resolveValidators = function (column) {
        var validators = [];
        if (this.isColumnRequired(column)) {
            validators.push(Validators.required);
        }
        return validators;
    };
    OTableInsertableRowComponent.prototype.getPlaceholder = function (column) {
        var showPlaceHolder = this.showPlaceHolder;
        var cellEditor = this.columnEditors[column.attr];
        if (cellEditor) {
            showPlaceHolder = cellEditor.showPlaceHolder;
        }
        else if (column.definition) {
            showPlaceHolder = showPlaceHolder || column.definition.showPlaceHolder;
        }
        return showPlaceHolder ? this.translateService.get(column.title) : undefined;
    };
    OTableInsertableRowComponent.prototype.handleKeyboardEvent = function (event) {
        if (event.keyCode !== 13) {
            return;
        }
        this.trWrapper = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        this.insertRecord();
    };
    OTableInsertableRowComponent.prototype.insertRecord = function () {
        var self = this;
        if (!this.validateFields()) {
            return;
        }
        var values = this.getAttributesValuesToInsert();
        var insertObservable = this.table.insertRecord(values);
        if (insertObservable) {
            insertObservable.subscribe(function (res) {
                self.onInsertSuccess(res);
            }, function (error) {
                self.table.showDialogError(error, 'MESSAGES.ERROR_INSERT');
            });
        }
    };
    OTableInsertableRowComponent.prototype.validateFields = function () {
        var _this = this;
        var valid = true;
        Object.keys(this.controls).forEach(function (controlKey) {
            var control = _this.controls[controlKey];
            control.markAsTouched();
            valid = valid && control.valid;
        });
        return valid;
    };
    OTableInsertableRowComponent.prototype.getAttributesValuesToInsert = function () {
        var _this = this;
        var attrValues = {};
        if (this.includeParentKeys) {
            attrValues = this.table.getParentKeysValues();
        }
        Object.keys(this.controls).forEach(function (controlKey) {
            attrValues[controlKey] = _this.controls[controlKey].value;
        });
        return attrValues;
    };
    OTableInsertableRowComponent.prototype.onInsertSuccess = function (res) {
        ObservableWrapper.callEmit(this.onPostInsertRecord, res);
        this.snackBarService.open('MESSAGES.INSERTED', { icon: 'check_circle' });
        this.cleanFields();
        if (this.table.daoTable.usingStaticData) {
            this.table.setDataArray(res);
        }
        else {
            this.table.reloadData();
        }
    };
    OTableInsertableRowComponent.prototype.cleanFields = function () {
        var _this = this;
        var controlKeys = Object.keys(this.controls);
        controlKeys.forEach(function (controlKey) {
            _this.controls[controlKey].setValue(void 0);
        });
        var firstInputEl = this.trWrapper.querySelector('input');
        if (firstInputEl) {
            setTimeout(function () {
                firstInputEl.focus();
            });
        }
    };
    OTableInsertableRowComponent.prototype.columnHasError = function (column, error) {
        var control = this.controls[column.attr];
        return control && control.touched && control.hasError(error);
    };
    OTableInsertableRowComponent.AVAILABLE_ROW_POSITIONS = ['first', 'last'];
    OTableInsertableRowComponent.DEFAULT_ROW_POSITION = 'last';
    OTableInsertableRowComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-insertable-row',
                    template: ' ',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_INSERTABLE_ROW,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_INSERTABLE_ROW
                }] }
    ];
    OTableInsertableRowComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: ComponentFactoryResolver }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableInsertableRowComponent.prototype, "showPlaceHolder", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OTableInsertableRowComponent.prototype, "includeParentKeys", void 0);
    return OTableInsertableRowComponent;
}());
export { OTableInsertableRowComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1pbnNlcnRhYmxlLXJvdy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtaW5zZXJ0YWJsZS1yb3cvby10YWJsZS1pbnNlcnRhYmxlLXJvdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULHdCQUF3QixFQUN4QixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEdBRVQsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBZSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBRTFGLE9BQU8sRUFBYyxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUdoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFN0QsTUFBTSxDQUFDLElBQU0scUNBQXFDLEdBQUc7SUFFbkQsU0FBUztJQUNULG9DQUFvQztJQUVwQyxVQUFVO0lBQ1YsbUNBQW1DO0lBQ25DLHdDQUF3QztDQUN6QyxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sc0NBQXNDLEdBQUc7SUFDcEQsb0JBQW9CO0NBQ3JCLENBQUM7QUFFRjtJQW9DRSxzQ0FDWSxRQUFrQixFQUN5QixLQUFzQixFQUNqRSxRQUFrQztRQUZsQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3lCLFVBQUssR0FBTCxL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Q0FBQztJQUMvRCxDQUFDO0lBNU1hLG9EQUF1QixHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLGlEQUFvQixHQUFHLE1BQU0sQ0FBQzs7Z0JBWDdDLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxRQUFRLEVBQUUsR0FBRztvQkFDYixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsTUFBTSxFQUFFLHFDQUFxQztvQkFDN0MsT0FBTyxFQUFFLHNDQUFzQztpQkFDaEQ7OztnQkFuQ0MsUUFBUTtnQkFhRCxlQUFlLHVCQXNEbkIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsZUFBZSxFQUFmLENBQWUsQ0FBQztnQkF2RTNDLHdCQUF3Qjs7SUEyRHhCO1FBREMsY0FBYyxFQUFFOzt5RUFDZ0I7SUFFakM7UUFEQyxjQUFjLEVBQUU7OzJFQUNpQjtJQTRMcEMsbUNBQUM7Q0FBQSxBQXhORCxJQXdOQztTQWhOWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBWYWxpZGF0b3JGbiwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBTbmFja0JhclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9zbmFja2Jhci5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1Blcm1pc3Npb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby1wZXJtaXNzaW9ucy50eXBlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9CYXNlVGFibGVDZWxsRWRpdG9yIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL2NlbGwtZWRpdG9yL28tYmFzZS10YWJsZS1jZWxsLWVkaXRvci5jbGFzcyc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfSU5TRVJUQUJMRV9ST1cgPSBbXG4gIC8vIGNvbHVtbnMgW3N0cmluZ106IGNvbHVtbnMgdGhhdCBjYW4gYmUgaW5zZXJ0ZWQsIHNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IGFsbCB2aXNpYmxlIGNvbHVtbnMuXG4gICdjb2x1bW5zJyxcbiAgJ3JlcXVpcmVkQ29sdW1ucyA6IHJlcXVpcmVkLWNvbHVtbnMnLFxuICAvLyBwb3NpdGlvbiBbZmlyc3QgfGxhc3QgXSBkZWZhdWx0OiBsYXN0XG4gICdwb3NpdGlvbicsXG4gICdzaG93UGxhY2VIb2xkZXI6IHNob3ctcGxhY2Vob2xkZXInLFxuICAnaW5jbHVkZVBhcmVudEtleXM6IGluY2x1ZGUtcGFyZW50LWtleXMnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfSU5TRVJUQUJMRV9ST1cgPSBbXG4gICdvblBvc3RJbnNlcnRSZWNvcmQnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWluc2VydGFibGUtcm93JyxcbiAgdGVtcGxhdGU6ICcgJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9JTlNFUlRBQkxFX1JPVyxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfSU5TRVJUQUJMRV9ST1dcbn0pXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwdWJsaWMgc3RhdGljIEFWQUlMQUJMRV9ST1dfUE9TSVRJT05TID0gWydmaXJzdCcsICdsYXN0J107XG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9ST1dfUE9TSVRJT04gPSAnbGFzdCc7XG5cbiAgcHJvdGVjdGVkIGNvbHVtbnM6IHN0cmluZztcbiAgcHJvdGVjdGVkIGNvbHVtbnNBcnJheTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuXG4gIHByb3RlY3RlZCByZXF1aXJlZENvbHVtbnM6IHN0cmluZztcbiAgcHJvdGVjdGVkIHJlcXVpcmVkQ29sdW1uc0FycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG5cbiAgb25Qb3N0SW5zZXJ0UmVjb3JkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgY29sdW1uRWRpdG9yczogYW55ID0ge307XG4gIHRyV3JhcHBlcjogRXZlbnRUYXJnZXQ7XG5cbiAgcHJvdGVjdGVkIHBvc2l0aW9uOiBzdHJpbmcgPSBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50LkRFRkFVTFRfUk9XX1BPU0lUSU9OO1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHNob3dQbGFjZUhvbGRlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBpbmNsdWRlUGFyZW50S2V5czogYm9vbGVhbiA9IHRydWU7XG5cbiAgZW5hYmxlZCA9IHRydWU7XG4gIHJvd0RhdGEgPSB7fTtcbiAgcHJvdGVjdGVkIGNvbnRyb2xzOiBhbnkgPSB7fTtcbiAgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHNuYWNrQmFyU2VydmljZTogU25hY2tCYXJTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHByb3RlY3RlZCB0YWJsZTogT1RhYmxlQ29tcG9uZW50LFxuICAgIHByb3RlY3RlZCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyXG4gICkge1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNvbHVtbnNBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGlmICh0aGlzLmNvbHVtbnNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuY29sdW1uc0FycmF5ID0gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zLnZpc2libGVDb2x1bW5zO1xuICAgIH1cbiAgICB0aGlzLnJlcXVpcmVkQ29sdW1uc0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMucmVxdWlyZWRDb2x1bW5zLCB0cnVlKTtcbiAgICBpZiAoT1RhYmxlSW5zZXJ0YWJsZVJvd0NvbXBvbmVudC5BVkFJTEFCTEVfUk9XX1BPU0lUSU9OUy5pbmRleE9mKCh0aGlzLnBvc2l0aW9uIHx8ICcnKS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMucG9zaXRpb24gPSBPVGFibGVJbnNlcnRhYmxlUm93Q29tcG9uZW50LkRFRkFVTFRfUk9XX1BPU0lUSU9OO1xuICAgIH1cbiAgICB0aGlzLnRhYmxlLnNldE9UYWJsZUluc2VydGFibGVSb3codGhpcyk7XG4gIH1cblxuICBpc0ZpcnN0Um93KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uID09PSAnZmlyc3QnO1xuICB9XG5cbiAgaXNDb2x1bW5JbnNlcnRhYmxlKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5jb2x1bW5zQXJyYXkuaW5kZXhPZihjb2x1bW4uYXR0cikgIT09IC0xKTtcbiAgfVxuXG4gIGlzQ29sdW1uUmVxdWlyZWQoY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICh0aGlzLnJlcXVpcmVkQ29sdW1uc0FycmF5LmluZGV4T2YoY29sdW1uLmF0dHIpICE9PSAtMSk7XG4gIH1cblxuICBpbml0aWFsaXplRWRpdG9ycygpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucy5mb3JFYWNoKChjb2wsIGksIGFycmF5KSA9PiB7XG4gICAgICBpZiAoc2VsZi5pc0NvbHVtbkluc2VydGFibGUoY29sKSkge1xuICAgICAgICBjb25zdCBjb2x1bW5FZGl0b3JUeXBlID0gY29sLmVkaXRvciA/IGNvbC5lZGl0b3IudHlwZSA6IGNvbC50eXBlO1xuICAgICAgICBpZiAoY29sLmRlZmluaXRpb24pIHtcbiAgICAgICAgICBjb25zdCBlZGl0b3I6IE9CYXNlVGFibGVDZWxsRWRpdG9yID0gY29sLmRlZmluaXRpb24uYnVpbGRDZWxsRWRpdG9yKGNvbHVtbkVkaXRvclR5cGUsIHRoaXMucmVzb2x2ZXIsIGNvbC5kZWZpbml0aW9uLmNvbnRhaW5lciwgY29sLmRlZmluaXRpb24pO1xuICAgICAgICAgIHRoaXMuY29sdW1uRWRpdG9yc1tjb2wuYXR0cl0gPSBlZGl0b3I7XG4gICAgICAgICAgbGV0IGRpc2FibGVkQ29sID0gIXRoaXMuZW5hYmxlZDtcbiAgICAgICAgICBpZiAoIWRpc2FibGVkQ29sKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5QZXJtaXNzaW9uczogT1Blcm1pc3Npb25zID0gdGhpcy50YWJsZS5nZXRPQ29sdW1uUGVybWlzc2lvbnMoY29sLmF0dHIpO1xuICAgICAgICAgICAgZGlzYWJsZWRDb2wgPSBjb2x1bW5QZXJtaXNzaW9ucy5lbmFibGVkID09PSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWRpdG9yLmVuYWJsZWQgPSAhZGlzYWJsZWRDb2w7XG4gICAgICAgICAgZWRpdG9yLnNob3dQbGFjZUhvbGRlciA9IHRoaXMuc2hvd1BsYWNlSG9sZGVyIHx8IGVkaXRvci5zaG93UGxhY2VIb2xkZXI7XG4gICAgICAgICAgZWRpdG9yLnRhYmxlID0gc2VsZi50YWJsZTtcbiAgICAgICAgICBlZGl0b3IudGFibGVDb2x1bW4gPSBjb2wuZWRpdG9yID8gY29sLmVkaXRvci50YWJsZUNvbHVtbiA6IGNvbC5kZWZpbml0aW9uO1xuICAgICAgICAgIGVkaXRvci5vcmVxdWlyZWQgPSB0aGlzLmlzQ29sdW1uUmVxdWlyZWQoY29sKTtcbiAgICAgICAgICBlZGl0b3IuZm9ybUNvbnRyb2wgPSB0aGlzLmdldENvbnRyb2woY29sLCBkaXNhYmxlZENvbCk7XG4gICAgICAgICAgZWRpdG9yLmNvbnRyb2xBcmdzID0geyBzaWxlbnQ6IHRydWUgfTtcbiAgICAgICAgICBlZGl0b3Iucm93RGF0YSA9IHNlbGYucm93RGF0YTtcbiAgICAgICAgICBlZGl0b3Iuc3RhcnRFZGl0aW9uKHNlbGYucm93RGF0YSk7XG4gICAgICAgICAgZWRpdG9yLmZvcm1Db250cm9sLm1hcmtBc1VudG91Y2hlZCgpO1xuICAgICAgICAgIGNvbC5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFycmF5W2ldID0gY29sO1xuICAgIH0pO1xuICB9XG5cbiAgdXNlQ2VsbEVkaXRvcihjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc0NvbHVtbkluc2VydGFibGUoY29sdW1uKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLmNvbHVtbkVkaXRvcnNbY29sdW1uLmF0dHJdKTtcbiAgfVxuXG4gIGdldENvbnRyb2woY29sdW1uOiBPQ29sdW1uLCBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlKTogRm9ybUNvbnRyb2wge1xuICAgIGlmICghdGhpcy5jb250cm9sc1tjb2x1bW4uYXR0cl0pIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSB0aGlzLnJlc29sdmVWYWxpZGF0b3JzKGNvbHVtbik7XG4gICAgICBjb25zdCBjZmcgPSB7XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgfTtcbiAgICAgIHRoaXMuY29udHJvbHNbY29sdW1uLmF0dHJdID0gbmV3IEZvcm1Db250cm9sKGNmZywgdmFsaWRhdG9ycyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW2NvbHVtbi5hdHRyXTtcbiAgfVxuXG4gIHJlc29sdmVWYWxpZGF0b3JzKGNvbHVtbjogT0NvbHVtbik6IFZhbGlkYXRvckZuW10ge1xuICAgIGNvbnN0IHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuW10gPSBbXTtcbiAgICBpZiAodGhpcy5pc0NvbHVtblJlcXVpcmVkKGNvbHVtbikpIHtcbiAgICAgIHZhbGlkYXRvcnMucHVzaChWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbGlkYXRvcnM7XG4gIH1cblxuICBnZXRQbGFjZWhvbGRlcihjb2x1bW46IE9Db2x1bW4pOiBzdHJpbmcge1xuICAgIGxldCBzaG93UGxhY2VIb2xkZXIgPSB0aGlzLnNob3dQbGFjZUhvbGRlcjtcbiAgICBjb25zdCBjZWxsRWRpdG9yID0gdGhpcy5jb2x1bW5FZGl0b3JzW2NvbHVtbi5hdHRyXTtcbiAgICBpZiAoY2VsbEVkaXRvcikge1xuICAgICAgc2hvd1BsYWNlSG9sZGVyID0gY2VsbEVkaXRvci5zaG93UGxhY2VIb2xkZXI7XG4gICAgfSBlbHNlIGlmIChjb2x1bW4uZGVmaW5pdGlvbikge1xuICAgICAgc2hvd1BsYWNlSG9sZGVyID0gc2hvd1BsYWNlSG9sZGVyIHx8IGNvbHVtbi5kZWZpbml0aW9uLnNob3dQbGFjZUhvbGRlcjtcbiAgICB9XG4gICAgcmV0dXJuIHNob3dQbGFjZUhvbGRlciA/IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoY29sdW1uLnRpdGxlKSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSAhPT0gMTMpIHtcbiAgICAgIC8vIG5vdCBpbnRyb1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnRyV3JhcHBlciA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMuaW5zZXJ0UmVjb3JkKCk7XG4gIH1cblxuICBpbnNlcnRSZWNvcmQoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGRzKCkpIHtcbiAgICAgIC8vIHRoaXMudGFibGUuc2hvd0RpYWxvZ0Vycm9yKCdUQUJMRS5ST1dfVkFMSURBVElPTl9FUlJPUicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEF0dHJpYnV0ZXNWYWx1ZXNUb0luc2VydCgpO1xuICAgIGNvbnN0IGluc2VydE9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PiA9IHRoaXMudGFibGUuaW5zZXJ0UmVjb3JkKHZhbHVlcyk7XG4gICAgaWYgKGluc2VydE9ic2VydmFibGUpIHtcbiAgICAgIGluc2VydE9ic2VydmFibGUuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICAgIHNlbGYub25JbnNlcnRTdWNjZXNzKHJlcyk7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIHNlbGYudGFibGUuc2hvd0RpYWxvZ0Vycm9yKGVycm9yLCAnTUVTU0FHRVMuRVJST1JfSU5TRVJUJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdmFsaWRhdGVGaWVsZHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHZhbGlkID0gdHJ1ZTtcbiAgICAvLyBjb2x1bW5zIHdpdGggbm8gZWRpdG9yIGRlZmluZWRcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5mb3JFYWNoKChjb250cm9sS2V5KSA9PiB7XG4gICAgICBjb25zdCBjb250cm9sID0gdGhpcy5jb250cm9sc1tjb250cm9sS2V5XTtcbiAgICAgIGNvbnRyb2wubWFya0FzVG91Y2hlZCgpO1xuICAgICAgdmFsaWQgPSB2YWxpZCAmJiBjb250cm9sLnZhbGlkO1xuICAgIH0pO1xuICAgIHJldHVybiB2YWxpZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRBdHRyaWJ1dGVzVmFsdWVzVG9JbnNlcnQoKTogb2JqZWN0IHtcbiAgICBsZXQgYXR0clZhbHVlcyA9IHt9O1xuICAgIGlmICh0aGlzLmluY2x1ZGVQYXJlbnRLZXlzKSB7XG4gICAgICBhdHRyVmFsdWVzID0gdGhpcy50YWJsZS5nZXRQYXJlbnRLZXlzVmFsdWVzKCk7XG4gICAgfVxuICAgIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpLmZvckVhY2goKGNvbnRyb2xLZXkpID0+IHtcbiAgICAgIGF0dHJWYWx1ZXNbY29udHJvbEtleV0gPSB0aGlzLmNvbnRyb2xzW2NvbnRyb2xLZXldLnZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBhdHRyVmFsdWVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uSW5zZXJ0U3VjY2VzcyhyZXM6IGFueSkge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMub25Qb3N0SW5zZXJ0UmVjb3JkLCByZXMpO1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlLm9wZW4oJ01FU1NBR0VTLklOU0VSVEVEJywgeyBpY29uOiAnY2hlY2tfY2lyY2xlJyB9KTtcbiAgICB0aGlzLmNsZWFuRmllbGRzKCk7XG5cbiAgICBpZiAodGhpcy50YWJsZS5kYW9UYWJsZS51c2luZ1N0YXRpY0RhdGEpIHtcbiAgICAgIHRoaXMudGFibGUuc2V0RGF0YUFycmF5KHJlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGFibGUucmVsb2FkRGF0YSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjbGVhbkZpZWxkcygpIHtcbiAgICAvLyBjb2x1bW5zIHdpdGggbm8gZWRpdG9yIGRlZmluZWRcbiAgICBjb25zdCBjb250cm9sS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpO1xuICAgIGNvbnRyb2xLZXlzLmZvckVhY2goKGNvbnRyb2xLZXkpID0+IHtcbiAgICAgIHRoaXMuY29udHJvbHNbY29udHJvbEtleV0uc2V0VmFsdWUodm9pZCAwKTtcbiAgICB9KTtcbiAgICBjb25zdCBmaXJzdElucHV0RWwgPSAodGhpcy50cldyYXBwZXIgYXMgYW55KS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpO1xuICAgIGlmIChmaXJzdElucHV0RWwpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmaXJzdElucHV0RWwuZm9jdXMoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbHVtbkhhc0Vycm9yKGNvbHVtbjogT0NvbHVtbiwgZXJyb3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2NvbHVtbi5hdHRyXTtcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLnRvdWNoZWQgJiYgY29udHJvbC5oYXNFcnJvcihlcnJvcik7XG4gIH1cblxufVxuIl19