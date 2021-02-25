import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ColumnValueFilterOperator } from '../../../../../types/o-column-value-filter.type';
import { TableFilterByColumnDialogResult } from '../../../../../types/o-table-filter-by-column-data.type';
import { Codes } from '../../../../../util';
import { Util } from '../../../../../util/util';
var OTableFilterByColumnDataDialogComponent = (function () {
    function OTableFilterByColumnDataDialogComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.acceptAction = TableFilterByColumnDialogResult.ACCEPT;
        this.cancelAction = TableFilterByColumnDialogResult.CANCEL;
        this.clearAction = TableFilterByColumnDialogResult.CLEAR;
        this.preloadValues = true;
        this.onSortFilterValuesChange = new EventEmitter();
        this.isCustomFilterSubject = new BehaviorSubject(false);
        this.isCustomFilter = this.isCustomFilterSubject.asObservable();
        this.isDefaultFilterSubject = new BehaviorSubject(false);
        this.isDefaultFilter = this.isDefaultFilterSubject.asObservable();
        this.fcText = new FormControl();
        this.fcFrom = new FormControl();
        this.fcTo = new FormControl();
        this.columnData = [];
        this.tableData = [];
        this.listDataSubject = new BehaviorSubject([]);
        this._listData = this.listDataSubject.asObservable();
        this.activeSortDirection = '';
        if (data.column) {
            this.column = data.column;
        }
        var previousFilter = {
            attr: undefined,
            operator: undefined,
            values: undefined
        };
        if (data.mode) {
            this.isDefaultFilterSubject.next(data.mode === 'default');
            this.isCustomFilterSubject.next(data.mode === 'custom');
            this.mode = data.mode;
        }
        if (data.previousFilter) {
            previousFilter = data.previousFilter;
            this.isCustomFilterSubject.next([ColumnValueFilterOperator.LESS_EQUAL, ColumnValueFilterOperator.MORE_EQUAL, ColumnValueFilterOperator.BETWEEN, ColumnValueFilterOperator.EQUAL].indexOf(previousFilter.operator) !== -1);
        }
        if (data.hasOwnProperty('preloadValues')) {
            this.preloadValues = data.preloadValues;
        }
        if (data.activeSortDirection) {
            this.activeSortDirection = data.activeSortDirection;
        }
        if (data.tableData && Array.isArray(data.tableData)) {
            this.tableData = data.tableData;
            this.getDistinctValues(data.tableData, previousFilter);
            this.initializeCustomFilterValues(previousFilter);
            this.initializeDataList(previousFilter);
        }
        if (data.mode) {
            this.mode = data.mode;
        }
    }
    OTableFilterByColumnDataDialogComponent.prototype.ngAfterViewInit = function () {
        this.initializeFilterEvent();
    };
    Object.defineProperty(OTableFilterByColumnDataDialogComponent.prototype, "listData", {
        get: function () {
            return this._listData;
        },
        set: function (arg) {
            this._listData = arg;
        },
        enumerable: true,
        configurable: true
    });
    OTableFilterByColumnDataDialogComponent.prototype.initializeDataList = function (filter) {
        if (this.preloadValues || (filter && filter.operator === ColumnValueFilterOperator.IN)) {
            if (this.activeSortDirection === Codes.ASC_SORT || this.activeSortDirection === Codes.DESC_SORT) {
                this.sortData();
            }
            else {
                this.listDataSubject.next(this.columnData.slice());
            }
        }
    };
    OTableFilterByColumnDataDialogComponent.prototype.initializeFilterEvent = function () {
        if (this.filter) {
            var self_1 = this;
            fromEvent(this.filter.nativeElement, 'keyup')
                .pipe(debounceTime(150))
                .pipe(distinctUntilChanged())
                .subscribe(function () {
                var filterValue = self_1.filter.nativeElement.value;
                filterValue = Util.normalizeString(filterValue);
                if (filterValue.indexOf('*') !== -1) {
                    self_1.listDataSubject.next(self_1.columnData.filter(function (item) { return new RegExp('^' + Util.normalizeString(filterValue).split('*').join('.*') + '$').test(Util.normalizeString(item.renderedValue)); }));
                }
                else {
                    self_1.listDataSubject.next(self_1.columnData.filter(function (item) { return (Util.normalizeString(item.renderedValue).indexOf(filterValue) !== -1); }));
                }
            });
        }
    };
    OTableFilterByColumnDataDialogComponent.prototype.initializeCustomFilterValues = function (filter) {
        if (filter.operator !== ColumnValueFilterOperator.IN) {
            if (ColumnValueFilterOperator.EQUAL === filter.operator) {
                if (this.isTextType()) {
                    this.fcText.setValue(filter.values);
                }
            }
            if (filter.operator === ColumnValueFilterOperator.BETWEEN) {
                if (this.isDateType()) {
                    this.fcFrom.setValue(new Date(filter.values[0]));
                    this.fcTo.setValue(new Date(filter.values[1]));
                }
                else {
                    this.fcFrom.setValue(filter.values[0]);
                    this.fcTo.setValue(filter.values[1]);
                }
            }
            else {
                if (filter.operator === ColumnValueFilterOperator.MORE_EQUAL) {
                    if (this.isDateType()) {
                        this.fcFrom.setValue(new Date(filter.values));
                    }
                    else {
                        this.fcFrom.setValue(filter.values);
                    }
                }
                if (filter.operator === ColumnValueFilterOperator.LESS_EQUAL) {
                    if (this.isDateType()) {
                        this.fcTo.setValue(new Date(filter.values));
                    }
                    else {
                        this.fcTo.setValue(filter.values);
                    }
                }
            }
        }
    };
    Object.defineProperty(OTableFilterByColumnDataDialogComponent.prototype, "selectedValues", {
        get: function () {
            return this.filterValueList ? this.filterValueList.selectedOptions.selected : [];
        },
        enumerable: true,
        configurable: true
    });
    OTableFilterByColumnDataDialogComponent.prototype.areAllSelected = function () {
        return this.selectedValues.length === this.columnData.length;
    };
    OTableFilterByColumnDataDialogComponent.prototype.isIndeterminate = function () {
        return this.selectedValues.length > 0 && this.selectedValues.length !== this.columnData.length;
    };
    OTableFilterByColumnDataDialogComponent.prototype.onSelectAllChange = function (event) {
        if (event.checked) {
            this.filterValueList.selectAll();
        }
        else {
            this.filterValueList.deselectAll();
        }
    };
    OTableFilterByColumnDataDialogComponent.prototype.getDistinctValues = function (data, filter) {
        var _this = this;
        var colRenderedValues = this.getColumnDataUsingRenderer();
        var colValues = data.map(function (elem) { return elem[_this.column.attr]; });
        colRenderedValues.forEach(function (renderedValue, i) {
            if (!_this.columnData.find(function (item) { return item.renderedValue === renderedValue; })) {
                _this.columnData.push({
                    renderedValue: renderedValue,
                    value: colValues[i],
                    selected: filter.operator === ColumnValueFilterOperator.IN && (filter.values || []).indexOf(colValues[i]) !== -1,
                    tableIndex: i
                });
            }
        });
    };
    OTableFilterByColumnDataDialogComponent.prototype.getColumnValuesFilter = function () {
        var filter = {
            attr: this.column.attr,
            operator: undefined,
            values: undefined
        };
        if (!this.isCustomFilterSubject.getValue()) {
            if (this.selectedValues.length) {
                filter.operator = ColumnValueFilterOperator.IN;
                filter.values = this.selectedValues.map(function (item) { return item.value; });
            }
        }
        else {
            if (this.fcText.value) {
                filter.operator = ColumnValueFilterOperator.EQUAL;
                filter.values = this.getTypedValue(this.fcText);
            }
            if (this.fcFrom.value && this.fcTo.value) {
                filter.operator = ColumnValueFilterOperator.BETWEEN;
                var fromValue = this.getTypedValue(this.fcFrom);
                var toValue = this.getTypedValue(this.fcTo);
                filter.values = fromValue <= toValue ? [fromValue, toValue] : [toValue, fromValue];
            }
            else {
                if (this.fcFrom.value) {
                    filter.operator = ColumnValueFilterOperator.MORE_EQUAL;
                    filter.values = this.getTypedValue(this.fcFrom);
                }
                if (this.fcTo.value) {
                    filter.operator = ColumnValueFilterOperator.LESS_EQUAL;
                    filter.values = this.getTypedValue(this.fcTo);
                }
            }
        }
        return filter;
    };
    OTableFilterByColumnDataDialogComponent.prototype.clearValues = function () {
        if (this.isTextType()) {
            this.fcText.setValue(undefined);
        }
        else {
            if (this.isDateType() || this.isNumericType) {
                this.fcFrom.setValue(undefined);
                this.fcTo.setValue(undefined);
            }
        }
    };
    OTableFilterByColumnDataDialogComponent.prototype.onClickSortValues = function () {
        switch (this.activeSortDirection) {
            case 'asc':
                this.activeSortDirection = 'desc';
                break;
            case 'desc':
                this.activeSortDirection = '';
                break;
            default:
                this.activeSortDirection = 'asc';
                break;
        }
        this.onSortFilterValuesChange.emit(this.getFilterColumn());
        this.sortData();
    };
    OTableFilterByColumnDataDialogComponent.prototype.sortData = function () {
        var sortedData = Object.assign([], this.columnData);
        if (this.activeSortDirection !== '') {
            this.listDataSubject.next(sortedData.sort(this.sortFunction.bind(this)));
        }
        else {
            this.listDataSubject.next(sortedData);
        }
    };
    OTableFilterByColumnDataDialogComponent.prototype.sortFunction = function (a, b) {
        var _a;
        var propertyA = '';
        var propertyB = '';
        _a = tslib_1.__read([a['value'], b['value']], 2), propertyA = _a[0], propertyB = _a[1];
        var valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim().toLowerCase() : +propertyA;
        var valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim().toLowerCase() : +propertyB;
        return (valueA <= valueB ? -1 : 1) * (this.activeSortDirection === 'asc' ? 1 : -1);
    };
    OTableFilterByColumnDataDialogComponent.prototype.onSlideChange = function (e) {
        this.isCustomFilterSubject.next(e.checked);
        if (!e.checked) {
            this.initializeDataList();
            var self_2 = this;
            setTimeout(function () {
                self_2.initializeFilterEvent();
            }, 0);
        }
    };
    OTableFilterByColumnDataDialogComponent.prototype.isTextType = function () {
        return !this.isNumericType() && !this.isDateType();
    };
    OTableFilterByColumnDataDialogComponent.prototype.isNumericType = function () {
        return ['integer', 'real', 'currency'].indexOf(this.column.type) !== -1;
    };
    OTableFilterByColumnDataDialogComponent.prototype.isDateType = function () {
        return 'date' === this.column.type;
    };
    OTableFilterByColumnDataDialogComponent.prototype.getRowValue = function (i) {
        return this.tableData[i];
    };
    OTableFilterByColumnDataDialogComponent.prototype.getFixedDimensionClass = function () {
        return this.mode === 'selection' || this.mode === 'default';
    };
    OTableFilterByColumnDataDialogComponent.prototype.getSortByAlphaIcon = function () {
        var icon = 'ontimize:sort_by_alpha';
        if (this.activeSortDirection !== '') {
            icon += '_' + this.activeSortDirection;
        }
        return icon;
    };
    OTableFilterByColumnDataDialogComponent.prototype.getFilterColumn = function () {
        var obj = { attr: '', sort: '' };
        obj.attr = this.column.attr;
        obj.sort = this.activeSortDirection;
        return obj;
    };
    OTableFilterByColumnDataDialogComponent.prototype.getTypedValue = function (control) {
        var value = control.value;
        if (this.isNumericType()) {
            value = control.value;
        }
        if (this.isDateType()) {
            value = control.value.valueOf();
        }
        return value;
    };
    OTableFilterByColumnDataDialogComponent.prototype.getColumnDataUsingRenderer = function () {
        var _this = this;
        var useRenderer = this.column.renderer && this.column.renderer.getCellData;
        return this.tableData.map(function (row) { return useRenderer ? _this.column.renderer.getCellData(row[_this.column.attr], row) : row[_this.column.attr]; });
    };
    OTableFilterByColumnDataDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-filter-by-column-data-dialog',
                    template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.FILTER_BY_COLUMN' | oTranslate }}: {{ column.title | oTranslate }}</span>\n<div mat-dialog-content fxLayout=\"row\" fxLayoutAlign=\"space-between stretch\" class=\"dialog-list-container\">\n  <div fxLayout=\"column\" class=\"content-wrapper\" [class.content-wrapper-fixed-dimension]=\"getFixedDimensionClass()\">\n    <mat-slide-toggle #customFilterSlide (change)=\"onSlideChange($event)\" [checked]=\"(isCustomFilter | async)\" *ngIf=\"isDefaultFilter | async\">\n      {{ 'TABLE.FILTER_BY_COLUMN.CUSTOM_FILTER' | oTranslate }}\n    </mat-slide-toggle>\n    <div fxFlex *ngIf=\"!(isCustomFilter | async);else customFilterTemplate\" fxLayout=\"column\">\n      <mat-form-field class=\"hinted\">\n        <mat-icon matPrefix svgIcon=\"ontimize:search\"></mat-icon>\n        <input matInput #filter placeholder=\"{{ 'TABLE.FILTER' | oTranslate }}\">\n        <mat-hint>{{ 'TABLE.FILTER_BY_COLUMN.HINT_STAR' | oTranslate }}</mat-hint>\n      </mat-form-field>\n      <div fxLayout=\"row\" fxLayoutAlign=\"space-between start\">\n        <div fxLayout=\"row\" fxLayoutAlign=\"start start\">\n          <mat-checkbox (change)=\"onSelectAllChange($event)\" [checked]=\"areAllSelected()\" [indeterminate]=\"isIndeterminate()\" [disabled]=\"!listData\"\n            class=\"select-all-checkbox\">\n            {{ 'TABLE.FILTER_BY_COLUMN.CHECK_ALL' | oTranslate }}\n          </mat-checkbox>\n          <span *ngIf=\"!listData\" class=\"column-filter-empty-list\">\n            {{ 'TABLE.FILTER_BY_COLUMN.LIST_EMPTY_FILTER' | oTranslate }}\n          </span>\n          <span *ngIf=\"(listData | async).length === 0\" class=\"column-filter-empty-list\">{{ 'TABLE.FILTER_BY_COLUMN.LIST_EMPTY' |\n        oTranslate }}</span>\n        </div>\n        <button type=\"button\" mat-icon-button (click)=\"onClickSortValues()\">\n          <mat-icon [svgIcon]=\"getSortByAlphaIcon()\"></mat-icon>\n        </button>\n      </div>\n      <mat-selection-list *ngIf=\"preloadValues || listData\" #filterValueList fxFlex fxLayout=\"column\" class=\"select-values-list\">\n        <mat-list-option *ngFor=\"let record of (listData | async); let i = index\" checkboxPosition=\"before\" [selected]=\"record.selected\"\n          [value]=\"record.value\">\n          <ng-container *ngIf=\"!column.renderer\">\n            {{ record.value || ('TABLE.FILTER_BY_COLUMN.EMPTY_VALUE' | oTranslate) }}\n          </ng-container>\n          <ng-template *ngIf=\"column.renderer\" [ngTemplateOutlet]=\"column.renderer.templateref\"\n            [ngTemplateOutletContext]=\"{ cellvalue: record.value, rowvalue: getRowValue(record.tableIndex) }\"></ng-template>\n        </mat-list-option>\n      </mat-selection-list>\n    </div>\n  </div>\n</div>\n\n\n<mat-dialog-actions fxLayoutAlign=\"space-between center\">\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"clearAction\">\n    {{ 'TABLE.BUTTONS.FILTER_CLEAR' | oTranslate | uppercase }} </button>\n  <span align=\"end\">\n   <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"false\">\n    {{ 'CANCEL' | oTranslate | uppercase }} </button>\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"true\">\n    {{ 'ACCEPT' | oTranslate | uppercase }} </button>\n  </span>\n</mat-dialog-actions>\n\n<!-- TEMPLATE CUSTOM FILTER-->\n<ng-template #customFilterTemplate>\n  <div *ngIf=\"isTextType()\">\n    <mat-form-field fxFlex class=\"hinted\">\n      <input matInput #filterText [formControl]=\"fcText\" placeholder=\"{{ 'TABLE.FILTER' | oTranslate }}\">\n      <mat-hint>{{ 'TABLE.FILTER_BY_COLUMN.HINT_STAR' | oTranslate }}</mat-hint>\n      <button type=\"button\" matSuffix mat-icon-button (click)=\"clearValues()\">\n        <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n      </button>\n    </mat-form-field>\n  </div>\n  <div *ngIf=\"isNumericType()\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxLayoutGap=\"12px\">\n    <mat-form-field>\n      <input matInput [formControl]=\"fcFrom\" placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.FROM' | oTranslate }}\">\n    </mat-form-field>\n    <mat-form-field>\n      <input matInput [formControl]=\"fcTo\" placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.TO' | oTranslate }}\">\n    </mat-form-field>\n    <button type=\"button\" mat-icon-button (click)=\"clearValues()\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n  </div>\n  <div *ngIf=\"isDateType()\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\" fxLayoutGap=\"12px\">\n    <mat-form-field>\n      <input matInput [matDatepicker]=\"datepickerFrom\" [max]=\"fcTo.value\" [formControl]=\"fcFrom\"\n        placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.FROM' | oTranslate }}\">\n      <mat-datepicker-toggle matSuffix [for]=\"datepickerFrom\">\n        <mat-icon matDatepickerToggleIcon>today</mat-icon>\n      </mat-datepicker-toggle>\n      <mat-datepicker #datepickerFrom></mat-datepicker>\n    </mat-form-field>\n    <mat-form-field>\n      <input matInput [matDatepicker]=\"datepickerTo\" [min]=\"fcFrom.value\" [formControl]=\"fcTo\"\n        placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.TO' | oTranslate }}\">\n      <mat-datepicker-toggle matSuffix [for]=\"datepickerTo\">\n        <mat-icon matDatepickerToggleIcon>today</mat-icon>\n      </mat-datepicker-toggle>\n      <mat-datepicker #datepickerTo></mat-datepicker>\n    </mat-form-field>\n    <button type=\"button\" matSuffix mat-icon-button (click)=\"clearValues()\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n  </div>\n\n</ng-template>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.o-filter-by-column-dialog]': 'true'
                    },
                    styles: [".o-filter-by-column-dialog .mat-slide-toggle{padding-bottom:24px}.o-filter-by-column-dialog .content-wrapper{padding:24px 0 12px;margin:0}.o-filter-by-column-dialog .content-wrapper.content-wrapper-fixed-dimension{max-height:430px;min-height:430px;min-width:250px;width:100%}.o-filter-by-column-dialog .content-wrapper .mat-form-field.hinted{margin-bottom:24px}.o-filter-by-column-dialog .content-wrapper .select-all-checkbox{padding-bottom:6px}.o-filter-by-column-dialog .content-wrapper .select-values-list{padding-top:0;overflow-y:auto;overflow-x:hidden;outline:0}.o-filter-by-column-dialog .content-wrapper .select-values-list .mat-list-item{height:30px}.o-filter-by-column-dialog .content-wrapper .select-values-list .mat-list-item .mat-list-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.o-filter-by-column-dialog .content-wrapper .select-values-list .mat-list-item .mat-list-text .mat-icon{font-size:24px}.o-filter-by-column-dialog .content-wrapper .column-filter-empty-list{text-align:center}"]
                }] }
    ];
    OTableFilterByColumnDataDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
    ]; };
    OTableFilterByColumnDataDialogComponent.propDecorators = {
        filter: [{ type: ViewChild, args: ['filter', { static: false },] }],
        filterValueList: [{ type: ViewChild, args: ['filterValueList', { static: false },] }]
    };
    return OTableFilterByColumnDataDialogComponent;
}());
export { OTableFilterByColumnDataDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9maWx0ZXItYnktY29sdW1uL28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsSixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGVBQWUsRUFBcUIsWUFBWSxFQUFFLGdCQUFnQixFQUF3QixNQUFNLG1CQUFtQixDQUFDO0FBQzdILE9BQU8sRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRSxPQUFPLEVBQUUseUJBQXlCLEVBQXNCLE1BQU0saURBQWlELENBQUM7QUFDaEgsT0FBTyxFQUEyQiwrQkFBK0IsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ25JLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJaEQ7SUF5Q0UsaURBQ1MsU0FBZ0UsRUFDOUMsSUFBUztRQUQzQixjQUFTLEdBQVQsU0FBUyxDQUF1RDtRQTlCbEUsaUJBQVksR0FBRywrQkFBK0IsQ0FBQyxNQUFNLENBQUM7UUFDdEQsaUJBQVksR0FBRywrQkFBK0IsQ0FBQyxNQUFNLENBQUM7UUFDdEQs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QUFFLHNDQUFzQztvQkFDaEQsZzlLQUFrRTtvQkFFbEUsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0osbUNBQW1DLEVBQUUsTUFBTTtxQkFDNUM7O2lCQUNGOzs7Z0JBcEI0QyxZQUFZO2dEQXNEcEQsTUFBTSxTQUFDLGVBQWU7Ozt5QkFOeEIsU0FBUyxTQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7a0NBQ3JDLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBOFNqRCw4Q0FBQztDQUFBLEFBcFZELElBb1ZDO1NBMVVZLHVDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSwgTWF0Q2hlY2tib3hDaGFuZ2UsIE1hdERpYWxvZ1JlZiwgTWF0U2VsZWN0aW9uTGlzdCwgTWF0U2xpZGVUb2dnbGVDaGFuZ2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGZyb21FdmVudCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvciwgT0NvbHVtblZhbHVlRmlsdGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby1jb2x1bW4tdmFsdWUtZmlsdGVyLnR5cGUnO1xuaW1wb3J0IHsgVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGEsIFRhYmxlRmlsdGVyQnlDb2x1bW5EaWFsb2dSZXN1bHQgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbCc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT0ZpbHRlckNvbHVtbiB9IGZyb20gJy4uLy4uL2hlYWRlci90YWJsZS1jb2x1bW5zLWZpbHRlci9jb2x1bW5zL28tdGFibGUtY29sdW1ucy1maWx0ZXItY29sdW1uLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLWRpYWxvZy5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1maWx0ZXItYnktY29sdW1uLWRpYWxvZ10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgYWNjZXB0QWN0aW9uID0gVGFibGVGaWx0ZXJCeUNvbHVtbkRpYWxvZ1Jlc3VsdC5BQ0NFUFQ7XG4gIHB1YmxpYyBjYW5jZWxBY3Rpb24gPSBUYWJsZUZpbHRlckJ5Q29sdW1uRGlhbG9nUmVzdWx0LkNBTkNFTDtcbiAgcHVibGljIGNsZWFyQWN0aW9uID0gVGFibGVGaWx0ZXJCeUNvbHVtbkRpYWxvZ1Jlc3VsdC5DTEVBUjtcblxuICBjb2x1bW46IE9Db2x1bW47XG4gIHByZWxvYWRWYWx1ZXM6IGJvb2xlYW4gPSB0cnVlO1xuICBtb2RlOiBzdHJpbmc7XG4gIHB1YmxpYyBvblNvcnRGaWx0ZXJWYWx1ZXNDaGFuZ2U6IEV2ZW50RW1pdHRlcjxPRmlsdGVyQ29sdW1uPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHJpdmF0ZSBpc0N1c3RvbUZpbHRlclN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgaXNDdXN0b21GaWx0ZXI6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICBwcml2YXRlIGlzRGVmYXVsdEZpbHRlclN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgaXNEZWZhdWx0RmlsdGVyOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5pc0RlZmF1bHRGaWx0ZXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIGZjVGV4dCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICBmY0Zyb20gPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAgZmNUbyA9IG5ldyBGb3JtQ29udHJvbCgpO1xuXG4gIHByb3RlY3RlZCBjb2x1bW5EYXRhOiBBcnJheTxUYWJsZUZpbHRlckJ5Q29sdW1uRGF0YT4gPSBbXTtcbiAgcHJvdGVjdGVkIHRhYmxlRGF0YTogQXJyYXk8YW55PiA9IFtdO1xuXG4gIHByaXZhdGUgbGlzdERhdGFTdWJqZWN0ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcnJheTxUYWJsZUZpbHRlckJ5Q29sdW1uRGF0YT4+KFtdKTtcbiAgcHJvdGVjdGVkIF9saXN0RGF0YTogT2JzZXJ2YWJsZTxBcnJheTxUYWJsZUZpbHRlckJ5Q29sdW1uRGF0YT4+ID0gdGhpcy5saXN0RGF0YVN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cblxuICBAVmlld0NoaWxkKCdmaWx0ZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgZmlsdGVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdmaWx0ZXJWYWx1ZUxpc3QnLCB7IHN0YXRpYzogZmFsc2UgfSkgZmlsdGVyVmFsdWVMaXN0OiBNYXRTZWxlY3Rpb25MaXN0O1xuICBwdWJsaWMgYWN0aXZlU29ydERpcmVjdGlvbjogJ2FzYycgfCAnZGVzYycgfCAnJyA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxPVGFibGVGaWx0ZXJCeUNvbHVtbkRhdGFEaWFsb2dDb21wb25lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBhbnlcbiAgKSB7XG4gICAgaWYgKGRhdGEuY29sdW1uKSB7XG4gICAgICB0aGlzLmNvbHVtbiA9IGRhdGEuY29sdW1uO1xuICAgIH1cbiAgICBsZXQgcHJldmlvdXNGaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlciA9IHtcbiAgICAgIGF0dHI6IHVuZGVmaW5lZCxcbiAgICAgIG9wZXJhdG9yOiB1bmRlZmluZWQsXG4gICAgICB2YWx1ZXM6IHVuZGVmaW5lZFxuICAgIH07XG4gICAgaWYgKGRhdGEubW9kZSkge1xuICAgICAgdGhpcy5pc0RlZmF1bHRGaWx0ZXJTdWJqZWN0Lm5leHQoZGF0YS5tb2RlID09PSAnZGVmYXVsdCcpO1xuICAgICAgdGhpcy5pc0N1c3RvbUZpbHRlclN1YmplY3QubmV4dChkYXRhLm1vZGUgPT09ICdjdXN0b20nKTtcbiAgICAgIHRoaXMubW9kZSA9IGRhdGEubW9kZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5wcmV2aW91c0ZpbHRlcikge1xuICAgICAgcHJldmlvdXNGaWx0ZXIgPSBkYXRhLnByZXZpb3VzRmlsdGVyO1xuICAgICAgdGhpcy5pc0N1c3RvbUZpbHRlclN1YmplY3QubmV4dChbQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMLCBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLk1PUkVfRVFVQUwsIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTiwgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5FUVVBTF0uaW5kZXhPZihwcmV2aW91c0ZpbHRlci5vcGVyYXRvcikgIT09IC0xKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgncHJlbG9hZFZhbHVlcycpKSB7XG4gICAgICB0aGlzLnByZWxvYWRWYWx1ZXMgPSBkYXRhLnByZWxvYWRWYWx1ZXM7XG4gICAgfVxuICAgIGlmIChkYXRhLmFjdGl2ZVNvcnREaXJlY3Rpb24pIHtcbiAgICAgIHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbiA9IGRhdGEuYWN0aXZlU29ydERpcmVjdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS50YWJsZURhdGEgJiYgQXJyYXkuaXNBcnJheShkYXRhLnRhYmxlRGF0YSkpIHtcbiAgICAgIHRoaXMudGFibGVEYXRhID0gZGF0YS50YWJsZURhdGE7XG4gICAgICB0aGlzLmdldERpc3RpbmN0VmFsdWVzKGRhdGEudGFibGVEYXRhLCBwcmV2aW91c0ZpbHRlcik7XG4gICAgICB0aGlzLmluaXRpYWxpemVDdXN0b21GaWx0ZXJWYWx1ZXMocHJldmlvdXNGaWx0ZXIpO1xuICAgICAgdGhpcy5pbml0aWFsaXplRGF0YUxpc3QocHJldmlvdXNGaWx0ZXIpO1xuICAgIH1cbiAgICBpZiAoZGF0YS5tb2RlKSB7XG4gICAgICB0aGlzLm1vZGUgPSBkYXRhLm1vZGU7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUZpbHRlckV2ZW50KCk7XG4gIH1cblxuICBnZXQgbGlzdERhdGEoKTogT2JzZXJ2YWJsZTxBcnJheTxUYWJsZUZpbHRlckJ5Q29sdW1uRGF0YT4+IHtcbiAgICByZXR1cm4gdGhpcy5fbGlzdERhdGE7XG4gIH1cblxuICBzZXQgbGlzdERhdGEoYXJnOiBPYnNlcnZhYmxlPEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4pIHtcbiAgICB0aGlzLl9saXN0RGF0YSA9IGFyZztcbiAgfVxuXG4gIGluaXRpYWxpemVEYXRhTGlzdChmaWx0ZXI/OiBPQ29sdW1uVmFsdWVGaWx0ZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wcmVsb2FkVmFsdWVzIHx8IChmaWx0ZXIgJiYgZmlsdGVyLm9wZXJhdG9yID09PSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOKSkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbiA9PT0gQ29kZXMuQVNDX1NPUlQgfHwgdGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uID09PSBDb2Rlcy5ERVNDX1NPUlQpIHtcbiAgICAgICAgdGhpcy5zb3J0RGF0YSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5saXN0RGF0YVN1YmplY3QubmV4dCh0aGlzLmNvbHVtbkRhdGEuc2xpY2UoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUZpbHRlckV2ZW50KCkge1xuICAgIGlmICh0aGlzLmZpbHRlcikge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBmcm9tRXZlbnQodGhpcy5maWx0ZXIubmF0aXZlRWxlbWVudCwgJ2tleXVwJylcbiAgICAgICAgLnBpcGUoZGVib3VuY2VUaW1lKDE1MCkpXG4gICAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGxldCBmaWx0ZXJWYWx1ZTogc3RyaW5nID0gc2VsZi5maWx0ZXIubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgICBmaWx0ZXJWYWx1ZSA9IFV0aWwubm9ybWFsaXplU3RyaW5nKGZpbHRlclZhbHVlKTtcbiAgICAgICAgICBpZiAoZmlsdGVyVmFsdWUuaW5kZXhPZignKicpICE9PSAtMSkge1xuICAgICAgICAgICAgc2VsZi5saXN0RGF0YVN1YmplY3QubmV4dChzZWxmLmNvbHVtbkRhdGEuZmlsdGVyKGl0ZW0gPT4gbmV3IFJlZ0V4cCgnXicgKyBVdGlsLm5vcm1hbGl6ZVN0cmluZyhmaWx0ZXJWYWx1ZSkuc3BsaXQoJyonKS5qb2luKCcuKicpICsgJyQnKS50ZXN0KFV0aWwubm9ybWFsaXplU3RyaW5nKGl0ZW0ucmVuZGVyZWRWYWx1ZSkpKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYubGlzdERhdGFTdWJqZWN0Lm5leHQoc2VsZi5jb2x1bW5EYXRhLmZpbHRlcihpdGVtID0+IChVdGlsLm5vcm1hbGl6ZVN0cmluZyhpdGVtLnJlbmRlcmVkVmFsdWUpLmluZGV4T2YoZmlsdGVyVmFsdWUpICE9PSAtMSkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGluaXRpYWxpemVDdXN0b21GaWx0ZXJWYWx1ZXMoZmlsdGVyOiBPQ29sdW1uVmFsdWVGaWx0ZXIpOiB2b2lkIHtcbiAgICBpZiAoZmlsdGVyLm9wZXJhdG9yICE9PSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOKSB7XG4gICAgICBpZiAoQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5FUVVBTCA9PT0gZmlsdGVyLm9wZXJhdG9yKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGV4dFR5cGUoKSkge1xuICAgICAgICAgIHRoaXMuZmNUZXh0LnNldFZhbHVlKGZpbHRlci52YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZmlsdGVyLm9wZXJhdG9yID09PSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU4pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEYXRlVHlwZSgpKSB7XG4gICAgICAgICAgdGhpcy5mY0Zyb20uc2V0VmFsdWUobmV3IERhdGUoZmlsdGVyLnZhbHVlc1swXSkpO1xuICAgICAgICAgIHRoaXMuZmNUby5zZXRWYWx1ZShuZXcgRGF0ZShmaWx0ZXIudmFsdWVzWzFdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5mY0Zyb20uc2V0VmFsdWUoZmlsdGVyLnZhbHVlc1swXSk7XG4gICAgICAgICAgdGhpcy5mY1RvLnNldFZhbHVlKGZpbHRlci52YWx1ZXNbMV0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZmlsdGVyLm9wZXJhdG9yID09PSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLk1PUkVfRVFVQUwpIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0RhdGVUeXBlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZmNGcm9tLnNldFZhbHVlKG5ldyBEYXRlKGZpbHRlci52YWx1ZXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mY0Zyb20uc2V0VmFsdWUoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTEVTU19FUVVBTCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzRGF0ZVR5cGUoKSkge1xuICAgICAgICAgICAgdGhpcy5mY1RvLnNldFZhbHVlKG5ldyBEYXRlKGZpbHRlci52YWx1ZXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mY1RvLnNldFZhbHVlKGZpbHRlci52YWx1ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBzZWxlY3RlZFZhbHVlcygpOiBBcnJheTxUYWJsZUZpbHRlckJ5Q29sdW1uRGF0YT4ge1xuICAgIHJldHVybiB0aGlzLmZpbHRlclZhbHVlTGlzdCA/IHRoaXMuZmlsdGVyVmFsdWVMaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3RlZCA6IFtdO1xuICB9XG5cbiAgYXJlQWxsU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRWYWx1ZXMubGVuZ3RoID09PSB0aGlzLmNvbHVtbkRhdGEubGVuZ3RoO1xuICB9XG5cbiAgaXNJbmRldGVybWluYXRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkVmFsdWVzLmxlbmd0aCA+IDAgJiYgdGhpcy5zZWxlY3RlZFZhbHVlcy5sZW5ndGggIT09IHRoaXMuY29sdW1uRGF0YS5sZW5ndGg7XG4gIH1cblxuICBvblNlbGVjdEFsbENoYW5nZShldmVudDogTWF0Q2hlY2tib3hDaGFuZ2UpIHtcbiAgICBpZiAoZXZlbnQuY2hlY2tlZCkge1xuICAgICAgdGhpcy5maWx0ZXJWYWx1ZUxpc3Quc2VsZWN0QWxsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsdGVyVmFsdWVMaXN0LmRlc2VsZWN0QWxsKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGlzdGluY3RWYWx1ZXMoZGF0YTogQXJyYXk8YW55PiwgZmlsdGVyOiBPQ29sdW1uVmFsdWVGaWx0ZXIpOiB2b2lkIHtcbiAgICBjb25zdCBjb2xSZW5kZXJlZFZhbHVlcyA9IHRoaXMuZ2V0Q29sdW1uRGF0YVVzaW5nUmVuZGVyZXIoKTtcbiAgICBjb25zdCBjb2xWYWx1ZXM6IGFueVtdID0gZGF0YS5tYXAoZWxlbSA9PiBlbGVtW3RoaXMuY29sdW1uLmF0dHJdKTtcblxuICAgIGNvbFJlbmRlcmVkVmFsdWVzLmZvckVhY2goKHJlbmRlcmVkVmFsdWUsIGkpID0+IHtcbiAgICAgIGlmICghdGhpcy5jb2x1bW5EYXRhLmZpbmQoaXRlbSA9PiBpdGVtLnJlbmRlcmVkVmFsdWUgPT09IHJlbmRlcmVkVmFsdWUpKSB7XG4gICAgICAgIHRoaXMuY29sdW1uRGF0YS5wdXNoKHtcbiAgICAgICAgICByZW5kZXJlZFZhbHVlOiByZW5kZXJlZFZhbHVlLFxuICAgICAgICAgIHZhbHVlOiBjb2xWYWx1ZXNbaV0sXG4gICAgICAgICAgc2VsZWN0ZWQ6IGZpbHRlci5vcGVyYXRvciA9PT0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTiAmJiAoZmlsdGVyLnZhbHVlcyB8fCBbXSkuaW5kZXhPZihjb2xWYWx1ZXNbaV0pICE9PSAtMSxcbiAgICAgICAgICAvLyBzdG9yaW5nIHRoZSBmaXJzdCBpbmRleCB3aGVyZSB0aGlzIHJlbmRlcmVkVmFsdWUgaXMgb2J0YWluZWQuIEluIHRoZSB0ZW1wbGF0ZSBvZiB0aGlzIGNvbXBvbmVudCB0aGUgY29sdW1uIHJlbmRlcmVyIHdpbGwgb2J0YWluIHRoZVxuICAgICAgICAgIC8vIHJvdyB2YWx1ZSBvZiB0aGlzIGluZGV4XG4gICAgICAgICAgdGFibGVJbmRleDogaVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbHVtblZhbHVlc0ZpbHRlcigpOiBPQ29sdW1uVmFsdWVGaWx0ZXIge1xuICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgIGF0dHI6IHRoaXMuY29sdW1uLmF0dHIsXG4gICAgICBvcGVyYXRvcjogdW5kZWZpbmVkLFxuICAgICAgdmFsdWVzOiB1bmRlZmluZWRcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5nZXRWYWx1ZSgpKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgZmlsdGVyLm9wZXJhdG9yID0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTjtcbiAgICAgICAgZmlsdGVyLnZhbHVlcyA9IHRoaXMuc2VsZWN0ZWRWYWx1ZXMubWFwKChpdGVtKSA9PiBpdGVtLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZmNUZXh0LnZhbHVlKSB7XG4gICAgICAgIGZpbHRlci5vcGVyYXRvciA9IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuRVFVQUw7XG4gICAgICAgIGZpbHRlci52YWx1ZXMgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY1RleHQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZmNGcm9tLnZhbHVlICYmIHRoaXMuZmNUby52YWx1ZSkge1xuICAgICAgICBmaWx0ZXIub3BlcmF0b3IgPSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU47XG4gICAgICAgIGNvbnN0IGZyb21WYWx1ZSA9IHRoaXMuZ2V0VHlwZWRWYWx1ZSh0aGlzLmZjRnJvbSk7XG4gICAgICAgIGNvbnN0IHRvVmFsdWUgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY1RvKTtcbiAgICAgICAgZmlsdGVyLnZhbHVlcyA9IGZyb21WYWx1ZSA8PSB0b1ZhbHVlID8gW2Zyb21WYWx1ZSwgdG9WYWx1ZV0gOiBbdG9WYWx1ZSwgZnJvbVZhbHVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmZjRnJvbS52YWx1ZSkge1xuICAgICAgICAgIGZpbHRlci5vcGVyYXRvciA9IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTDtcbiAgICAgICAgICBmaWx0ZXIudmFsdWVzID0gdGhpcy5nZXRUeXBlZFZhbHVlKHRoaXMuZmNGcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5mY1RvLnZhbHVlKSB7XG4gICAgICAgICAgZmlsdGVyLm9wZXJhdG9yID0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMO1xuICAgICAgICAgIGZpbHRlci52YWx1ZXMgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY1RvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgY2xlYXJWYWx1ZXMoKSB7XG4gICAgaWYgKHRoaXMuaXNUZXh0VHlwZSgpKSB7XG4gICAgICB0aGlzLmZjVGV4dC5zZXRWYWx1ZSh1bmRlZmluZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pc0RhdGVUeXBlKCkgfHwgdGhpcy5pc051bWVyaWNUeXBlKSB7XG4gICAgICAgIHRoaXMuZmNGcm9tLnNldFZhbHVlKHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMuZmNUby5zZXRWYWx1ZSh1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2tTb3J0VmFsdWVzKCkge1xuICAgIHN3aXRjaCAodGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uKSB7XG4gICAgICBjYXNlICdhc2MnOlxuICAgICAgICB0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb24gPSAnZGVzYyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVzYyc6XG4gICAgICAgIHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbiA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbiA9ICdhc2MnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5vblNvcnRGaWx0ZXJWYWx1ZXNDaGFuZ2UuZW1pdCh0aGlzLmdldEZpbHRlckNvbHVtbigpKTtcbiAgICB0aGlzLnNvcnREYXRhKCk7XG4gIH1cblxuICBzb3J0RGF0YSgpIHtcbiAgICBjb25zdCBzb3J0ZWREYXRhID0gT2JqZWN0LmFzc2lnbihbXSwgdGhpcy5jb2x1bW5EYXRhKTtcbiAgICBpZiAodGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uICE9PSAnJykge1xuICAgICAgdGhpcy5saXN0RGF0YVN1YmplY3QubmV4dChzb3J0ZWREYXRhLnNvcnQodGhpcy5zb3J0RnVuY3Rpb24uYmluZCh0aGlzKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3REYXRhU3ViamVjdC5uZXh0KHNvcnRlZERhdGEpO1xuICAgIH1cblxuICB9XG5cbiAgc29ydEZ1bmN0aW9uKGE6IGFueSwgYjogYW55KTogbnVtYmVyIHtcbiAgICBsZXQgcHJvcGVydHlBOiBudW1iZXIgfCBzdHJpbmcgPSAnJztcbiAgICBsZXQgcHJvcGVydHlCOiBudW1iZXIgfCBzdHJpbmcgPSAnJztcbiAgICBbcHJvcGVydHlBLCBwcm9wZXJ0eUJdID0gW2FbJ3ZhbHVlJ10sIGJbJ3ZhbHVlJ11dO1xuXG4gICAgY29uc3QgdmFsdWVBID0gdHlwZW9mIHByb3BlcnR5QSA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHByb3BlcnR5QSA9PT0gJycgPyBwcm9wZXJ0eUEgOiBpc05hTigrcHJvcGVydHlBKSA/IHByb3BlcnR5QS50b1N0cmluZygpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIDogK3Byb3BlcnR5QTtcbiAgICBjb25zdCB2YWx1ZUIgPSB0eXBlb2YgcHJvcGVydHlCID09PSAndW5kZWZpbmVkJyA/ICcnIDogcHJvcGVydHlCID09PSAnJyA/IHByb3BlcnR5QiA6IGlzTmFOKCtwcm9wZXJ0eUIpID8gcHJvcGVydHlCLnRvU3RyaW5nKCkudHJpbSgpLnRvTG93ZXJDYXNlKCkgOiArcHJvcGVydHlCO1xuICAgIHJldHVybiAodmFsdWVBIDw9IHZhbHVlQiA/IC0xIDogMSkgKiAodGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uID09PSAnYXNjJyA/IDEgOiAtMSk7XG4gIH1cblxuICBvblNsaWRlQ2hhbmdlKGU6IE1hdFNsaWRlVG9nZ2xlQ2hhbmdlKTogdm9pZCB7XG4gICAgdGhpcy5pc0N1c3RvbUZpbHRlclN1YmplY3QubmV4dChlLmNoZWNrZWQpO1xuXG4gICAgaWYgKCFlLmNoZWNrZWQpIHtcbiAgICAgIC8vIFNlbGVjdGlvbiBtb2RlXG4gICAgICB0aGlzLmluaXRpYWxpemVEYXRhTGlzdCgpO1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2VsZi5pbml0aWFsaXplRmlsdGVyRXZlbnQoKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgfVxuXG4gIGlzVGV4dFR5cGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzTnVtZXJpY1R5cGUoKSAmJiAhdGhpcy5pc0RhdGVUeXBlKCk7XG4gIH1cblxuICBpc051bWVyaWNUeXBlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBbJ2ludGVnZXInLCAncmVhbCcsICdjdXJyZW5jeSddLmluZGV4T2YodGhpcy5jb2x1bW4udHlwZSkgIT09IC0xO1xuICB9XG5cbiAgaXNEYXRlVHlwZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gJ2RhdGUnID09PSB0aGlzLmNvbHVtbi50eXBlO1xuICB9XG5cbiAgZ2V0Um93VmFsdWUoaTogbnVtYmVyKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy50YWJsZURhdGFbaV07XG4gIH1cblxuICBnZXRGaXhlZERpbWVuc2lvbkNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdzZWxlY3Rpb24nIHx8IHRoaXMubW9kZSA9PT0gJ2RlZmF1bHQnO1xuICB9XG5cbiAgZ2V0U29ydEJ5QWxwaGFJY29uKCkge1xuICAgIGxldCBpY29uID0gJ29udGltaXplOnNvcnRfYnlfYWxwaGEnO1xuICAgIGlmICh0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb24gIT09ICcnKSB7XG4gICAgICBpY29uICs9ICdfJyArIHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIGljb247XG4gIH1cblxuICBnZXRGaWx0ZXJDb2x1bW4oKTogT0ZpbHRlckNvbHVtbiB7XG4gICAgbGV0IG9iajogT0ZpbHRlckNvbHVtbiA9IHsgYXR0cjogJycsIHNvcnQ6ICcnIH07XG4gICAgb2JqLmF0dHIgPSB0aGlzLmNvbHVtbi5hdHRyO1xuICAgIG9iai5zb3J0ID0gdGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0VHlwZWRWYWx1ZShjb250cm9sOiBGb3JtQ29udHJvbCk6IGFueSB7XG4gICAgbGV0IHZhbHVlID0gY29udHJvbC52YWx1ZTtcbiAgICBpZiAodGhpcy5pc051bWVyaWNUeXBlKCkpIHtcbiAgICAgIHZhbHVlID0gY29udHJvbC52YWx1ZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNEYXRlVHlwZSgpKSB7XG4gICAgICB2YWx1ZSA9IGNvbnRyb2wudmFsdWUudmFsdWVPZigpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0Q29sdW1uRGF0YVVzaW5nUmVuZGVyZXIoKSB7XG4gICAgY29uc3QgdXNlUmVuZGVyZXIgPSB0aGlzLmNvbHVtbi5yZW5kZXJlciAmJiB0aGlzLmNvbHVtbi5yZW5kZXJlci5nZXRDZWxsRGF0YTtcbiAgICByZXR1cm4gdGhpcy50YWJsZURhdGEubWFwKChyb3cpID0+IHVzZVJlbmRlcmVyID8gdGhpcy5jb2x1bW4ucmVuZGVyZXIuZ2V0Q2VsbERhdGEocm93W3RoaXMuY29sdW1uLmF0dHJdLCByb3cpIDogcm93W3RoaXMuY29sdW1uLmF0dHJdKTtcbiAgfVxufVxuIl19