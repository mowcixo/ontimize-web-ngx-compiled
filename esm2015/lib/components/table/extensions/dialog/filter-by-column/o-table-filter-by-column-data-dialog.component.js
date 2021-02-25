import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ColumnValueFilterOperator } from '../../../../../types/o-column-value-filter.type';
import { TableFilterByColumnDialogResult } from '../../../../../types/o-table-filter-by-column-data.type';
import { Codes } from '../../../../../util';
import { Util } from '../../../../../util/util';
export class OTableFilterByColumnDataDialogComponent {
    constructor(dialogRef, data) {
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
        let previousFilter = {
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
    ngAfterViewInit() {
        this.initializeFilterEvent();
    }
    get listData() {
        return this._listData;
    }
    set listData(arg) {
        this._listData = arg;
    }
    initializeDataList(filter) {
        if (this.preloadValues || (filter && filter.operator === ColumnValueFilterOperator.IN)) {
            if (this.activeSortDirection === Codes.ASC_SORT || this.activeSortDirection === Codes.DESC_SORT) {
                this.sortData();
            }
            else {
                this.listDataSubject.next(this.columnData.slice());
            }
        }
    }
    initializeFilterEvent() {
        if (this.filter) {
            const self = this;
            fromEvent(this.filter.nativeElement, 'keyup')
                .pipe(debounceTime(150))
                .pipe(distinctUntilChanged())
                .subscribe(() => {
                let filterValue = self.filter.nativeElement.value;
                filterValue = Util.normalizeString(filterValue);
                if (filterValue.indexOf('*') !== -1) {
                    self.listDataSubject.next(self.columnData.filter(item => new RegExp('^' + Util.normalizeString(filterValue).split('*').join('.*') + '$').test(Util.normalizeString(item.renderedValue))));
                }
                else {
                    self.listDataSubject.next(self.columnData.filter(item => (Util.normalizeString(item.renderedValue).indexOf(filterValue) !== -1)));
                }
            });
        }
    }
    initializeCustomFilterValues(filter) {
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
    }
    get selectedValues() {
        return this.filterValueList ? this.filterValueList.selectedOptions.selected : [];
    }
    areAllSelected() {
        return this.selectedValues.length === this.columnData.length;
    }
    isIndeterminate() {
        return this.selectedValues.length > 0 && this.selectedValues.length !== this.columnData.length;
    }
    onSelectAllChange(event) {
        if (event.checked) {
            this.filterValueList.selectAll();
        }
        else {
            this.filterValueList.deselectAll();
        }
    }
    getDistinctValues(data, filter) {
        const colRenderedValues = this.getColumnDataUsingRenderer();
        const colValues = data.map(elem => elem[this.column.attr]);
        colRenderedValues.forEach((renderedValue, i) => {
            if (!this.columnData.find(item => item.renderedValue === renderedValue)) {
                this.columnData.push({
                    renderedValue: renderedValue,
                    value: colValues[i],
                    selected: filter.operator === ColumnValueFilterOperator.IN && (filter.values || []).indexOf(colValues[i]) !== -1,
                    tableIndex: i
                });
            }
        });
    }
    getColumnValuesFilter() {
        const filter = {
            attr: this.column.attr,
            operator: undefined,
            values: undefined
        };
        if (!this.isCustomFilterSubject.getValue()) {
            if (this.selectedValues.length) {
                filter.operator = ColumnValueFilterOperator.IN;
                filter.values = this.selectedValues.map((item) => item.value);
            }
        }
        else {
            if (this.fcText.value) {
                filter.operator = ColumnValueFilterOperator.EQUAL;
                filter.values = this.getTypedValue(this.fcText);
            }
            if (this.fcFrom.value && this.fcTo.value) {
                filter.operator = ColumnValueFilterOperator.BETWEEN;
                const fromValue = this.getTypedValue(this.fcFrom);
                const toValue = this.getTypedValue(this.fcTo);
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
    }
    clearValues() {
        if (this.isTextType()) {
            this.fcText.setValue(undefined);
        }
        else {
            if (this.isDateType() || this.isNumericType) {
                this.fcFrom.setValue(undefined);
                this.fcTo.setValue(undefined);
            }
        }
    }
    onClickSortValues() {
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
    }
    sortData() {
        const sortedData = Object.assign([], this.columnData);
        if (this.activeSortDirection !== '') {
            this.listDataSubject.next(sortedData.sort(this.sortFunction.bind(this)));
        }
        else {
            this.listDataSubject.next(sortedData);
        }
    }
    sortFunction(a, b) {
        let propertyA = '';
        let propertyB = '';
        [propertyA, propertyB] = [a['value'], b['value']];
        const valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim().toLowerCase() : +propertyA;
        const valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim().toLowerCase() : +propertyB;
        return (valueA <= valueB ? -1 : 1) * (this.activeSortDirection === 'asc' ? 1 : -1);
    }
    onSlideChange(e) {
        this.isCustomFilterSubject.next(e.checked);
        if (!e.checked) {
            this.initializeDataList();
            const self = this;
            setTimeout(() => {
                self.initializeFilterEvent();
            }, 0);
        }
    }
    isTextType() {
        return !this.isNumericType() && !this.isDateType();
    }
    isNumericType() {
        return ['integer', 'real', 'currency'].indexOf(this.column.type) !== -1;
    }
    isDateType() {
        return 'date' === this.column.type;
    }
    getRowValue(i) {
        return this.tableData[i];
    }
    getFixedDimensionClass() {
        return this.mode === 'selection' || this.mode === 'default';
    }
    getSortByAlphaIcon() {
        let icon = 'ontimize:sort_by_alpha';
        if (this.activeSortDirection !== '') {
            icon += '_' + this.activeSortDirection;
        }
        return icon;
    }
    getFilterColumn() {
        let obj = { attr: '', sort: '' };
        obj.attr = this.column.attr;
        obj.sort = this.activeSortDirection;
        return obj;
    }
    getTypedValue(control) {
        let value = control.value;
        if (this.isNumericType()) {
            value = control.value;
        }
        if (this.isDateType()) {
            value = control.value.valueOf();
        }
        return value;
    }
    getColumnDataUsingRenderer() {
        const useRenderer = this.column.renderer && this.column.renderer.getCellData;
        return this.tableData.map((row) => useRenderer ? this.column.renderer.getCellData(row[this.column.attr], row) : row[this.column.attr]);
    }
}
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
OTableFilterByColumnDataDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
OTableFilterByColumnDataDialogComponent.propDecorators = {
    filter: [{ type: ViewChild, args: ['filter', { static: false },] }],
    filterValueList: [{ type: ViewChild, args: ['filterValueList', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9maWx0ZXItYnktY29sdW1uL28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFpQix1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xKLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZUFBZSxFQUFxQixZQUFZLEVBQUUsZ0JBQWdCLEVBQXdCLE1BQU0sbUJBQW1CLENBQUM7QUFDN0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBRSx5QkFBeUIsRUFBc0IsTUFBTSxpREFBaUQsQ0FBQztBQUNoSCxPQUFPLEVBQTJCLCtCQUErQixFQUFFLE1BQU0seURBQXlELENBQUM7QUFDbkksT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQWNoRCxNQUFNLE9BQU8sdUNBQXVDO0lBK0JsRCxZQUNTLFNBQWdFLEVBQzlDLElBQVM7UUFEM0IsY0FBUyxHQUFULFNBQVMsQ0FBdUQ7UUE5QmxFLGlCQUFZLEdBQUcsK0JBQStCLENBQUMsTUFBTSxDQUFDO1FBQ3RELGlCQUFZLEdBQUcsK0JBQStCLENBQUMs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O2FBQ0Y7OztZQXBCNEMsWUFBWTs0Q0FzRHBELE1BQU0sU0FBQyxlQUFlOzs7cUJBTnhCLFNBQVMsU0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOzhCQUNyQyxTQUFTLFNBQUMsaUJBQWlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXRDaGVja2JveENoYW5nZSwgTWF0RGlhbG9nUmVmLCBNYXRTZWxlY3Rpb25MaXN0LCBNYXRTbGlkZVRvZ2dsZUNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgZnJvbUV2ZW50LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLCBPQ29sdW1uVmFsdWVGaWx0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLWNvbHVtbi12YWx1ZS1maWx0ZXIudHlwZSc7XG5pbXBvcnQgeyBUYWJsZUZpbHRlckJ5Q29sdW1uRGF0YSwgVGFibGVGaWx0ZXJCeUNvbHVtbkRpYWxvZ1Jlc3VsdCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0NvbHVtbiB9IGZyb20gJy4uLy4uLy4uL2NvbHVtbi9vLWNvbHVtbi5jbGFzcyc7XG5pbXBvcnQgeyBPRmlsdGVyQ29sdW1uIH0gZnJvbSAnLi4vLi4vaGVhZGVyL3RhYmxlLWNvbHVtbnMtZmlsdGVyL2NvbHVtbnMvby10YWJsZS1jb2x1bW5zLWZpbHRlci1jb2x1bW4uY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICdvLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZpbHRlci1ieS1jb2x1bW4tZGlhbG9nXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIHB1YmxpYyBhY2NlcHRBY3Rpb24gPSBUYWJsZUZpbHRlckJ5Q29sdW1uRGlhbG9nUmVzdWx0LkFDQ0VQVDtcbiAgcHVibGljIGNhbmNlbEFjdGlvbiA9IFRhYmxlRmlsdGVyQnlDb2x1bW5EaWFsb2dSZXN1bHQuQ0FOQ0VMO1xuICBwdWJsaWMgY2xlYXJBY3Rpb24gPSBUYWJsZUZpbHRlckJ5Q29sdW1uRGlhbG9nUmVzdWx0LkNMRUFSO1xuXG4gIGNvbHVtbjogT0NvbHVtbjtcbiAgcHJlbG9hZFZhbHVlczogYm9vbGVhbiA9IHRydWU7XG4gIG1vZGU6IHN0cmluZztcbiAgcHVibGljIG9uU29ydEZpbHRlclZhbHVlc0NoYW5nZTogRXZlbnRFbWl0dGVyPE9GaWx0ZXJDb2x1bW4+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwcml2YXRlIGlzQ3VzdG9tRmlsdGVyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBpc0N1c3RvbUZpbHRlcjogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMuaXNDdXN0b21GaWx0ZXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgaXNEZWZhdWx0RmlsdGVyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBpc0RlZmF1bHRGaWx0ZXI6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmlzRGVmYXVsdEZpbHRlclN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgZmNUZXh0ID0gbmV3IEZvcm1Db250cm9sKCk7XG4gIGZjRnJvbSA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICBmY1RvID0gbmV3IEZvcm1Db250cm9sKCk7XG5cbiAgcHJvdGVjdGVkIGNvbHVtbkRhdGE6IEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPiA9IFtdO1xuICBwcm90ZWN0ZWQgdGFibGVEYXRhOiBBcnJheTxhbnk+ID0gW107XG5cbiAgcHJpdmF0ZSBsaXN0RGF0YVN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4oW10pO1xuICBwcm90ZWN0ZWQgX2xpc3REYXRhOiBPYnNlcnZhYmxlPEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4gPSB0aGlzLmxpc3REYXRhU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuXG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlcicsIHsgc3RhdGljOiBmYWxzZSB9KSBmaWx0ZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlclZhbHVlTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBmaWx0ZXJWYWx1ZUxpc3Q6IE1hdFNlbGVjdGlvbkxpc3Q7XG4gIHB1YmxpYyBhY3RpdmVTb3J0RGlyZWN0aW9uOiAnYXNjJyB8ICdkZXNjJyB8ICcnID0gJyc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudD4sXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IGFueVxuICApIHtcbiAgICBpZiAoZGF0YS5jb2x1bW4pIHtcbiAgICAgIHRoaXMuY29sdW1uID0gZGF0YS5jb2x1bW47XG4gICAgfVxuICAgIGxldCBwcmV2aW91c0ZpbHRlcjogT0NvbHVtblZhbHVlRmlsdGVyID0ge1xuICAgICAgYXR0cjogdW5kZWZpbmVkLFxuICAgICAgb3BlcmF0b3I6IHVuZGVmaW5lZCxcbiAgICAgIHZhbHVlczogdW5kZWZpbmVkXG4gICAgfTtcbiAgICBpZiAoZGF0YS5tb2RlKSB7XG4gICAgICB0aGlzLmlzRGVmYXVsdEZpbHRlclN1YmplY3QubmV4dChkYXRhLm1vZGUgPT09ICdkZWZhdWx0Jyk7XG4gICAgICB0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5uZXh0KGRhdGEubW9kZSA9PT0gJ2N1c3RvbScpO1xuICAgICAgdGhpcy5tb2RlID0gZGF0YS5tb2RlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnByZXZpb3VzRmlsdGVyKSB7XG4gICAgICBwcmV2aW91c0ZpbHRlciA9IGRhdGEucHJldmlvdXNGaWx0ZXI7XG4gICAgICB0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5uZXh0KFtDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkxFU1NfRVFVQUwsIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTCwgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5CRVRXRUVOLCBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMXS5pbmRleE9mKHByZXZpb3VzRmlsdGVyLm9wZXJhdG9yKSAhPT0gLTEpO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KCdwcmVsb2FkVmFsdWVzJykpIHtcbiAgICAgIHRoaXMucHJlbG9hZFZhbHVlcyA9IGRhdGEucHJlbG9hZFZhbHVlcztcbiAgICB9XG4gICAgaWYgKGRhdGEuYWN0aXZlU29ydERpcmVjdGlvbikge1xuICAgICAgdGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uID0gZGF0YS5hY3RpdmVTb3J0RGlyZWN0aW9uO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnRhYmxlRGF0YSAmJiBBcnJheS5pc0FycmF5KGRhdGEudGFibGVEYXRhKSkge1xuICAgICAgdGhpcy50YWJsZURhdGEgPSBkYXRhLnRhYmxlRGF0YTtcbiAgICAgIHRoaXMuZ2V0RGlzdGluY3RWYWx1ZXMoZGF0YS50YWJsZURhdGEsIHByZXZpb3VzRmlsdGVyKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUN1c3RvbUZpbHRlclZhbHVlcyhwcmV2aW91c0ZpbHRlcik7XG4gICAgICB0aGlzLmluaXRpYWxpemVEYXRhTGlzdChwcmV2aW91c0ZpbHRlcik7XG4gICAgfVxuICAgIGlmIChkYXRhLm1vZGUpIHtcbiAgICAgIHRoaXMubW9kZSA9IGRhdGEubW9kZTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplRmlsdGVyRXZlbnQoKTtcbiAgfVxuXG4gIGdldCBsaXN0RGF0YSgpOiBPYnNlcnZhYmxlPEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4ge1xuICAgIHJldHVybiB0aGlzLl9saXN0RGF0YTtcbiAgfVxuXG4gIHNldCBsaXN0RGF0YShhcmc6IE9ic2VydmFibGU8QXJyYXk8VGFibGVGaWx0ZXJCeUNvbHVtbkRhdGE+Pikge1xuICAgIHRoaXMuX2xpc3REYXRhID0gYXJnO1xuICB9XG5cbiAgaW5pdGlhbGl6ZURhdGFMaXN0KGZpbHRlcj86IE9Db2x1bW5WYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnByZWxvYWRWYWx1ZXMgfHwgKGZpbHRlciAmJiBmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU4pKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uID09PSBDb2Rlcy5BU0NfU09SVCB8fCB0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb24gPT09IENvZGVzLkRFU0NfU09SVCkge1xuICAgICAgICB0aGlzLnNvcnREYXRhKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpc3REYXRhU3ViamVjdC5uZXh0KHRoaXMuY29sdW1uRGF0YS5zbGljZSgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplRmlsdGVyRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIGZyb21FdmVudCh0aGlzLmZpbHRlci5uYXRpdmVFbGVtZW50LCAna2V5dXAnKVxuICAgICAgICAucGlwZShkZWJvdW5jZVRpbWUoMTUwKSlcbiAgICAgICAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBzZWxmLmZpbHRlci5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICAgIGZpbHRlclZhbHVlID0gVXRpbC5ub3JtYWxpemVTdHJpbmcoZmlsdGVyVmFsdWUpO1xuICAgICAgICAgIGlmIChmaWx0ZXJWYWx1ZS5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICBzZWxmLmxpc3REYXRhU3ViamVjdC5uZXh0KHNlbGYuY29sdW1uRGF0YS5maWx0ZXIoaXRlbSA9PiBuZXcgUmVnRXhwKCdeJyArIFV0aWwubm9ybWFsaXplU3RyaW5nKGZpbHRlclZhbHVlKS5zcGxpdCgnKicpLmpvaW4oJy4qJykgKyAnJCcpLnRlc3QoVXRpbC5ub3JtYWxpemVTdHJpbmcoaXRlbS5yZW5kZXJlZFZhbHVlKSkpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5saXN0RGF0YVN1YmplY3QubmV4dChzZWxmLmNvbHVtbkRhdGEuZmlsdGVyKGl0ZW0gPT4gKFV0aWwubm9ybWFsaXplU3RyaW5nKGl0ZW0ucmVuZGVyZWRWYWx1ZSkuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgIT09IC0xKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUN1c3RvbUZpbHRlclZhbHVlcyhmaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgIT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU4pIHtcbiAgICAgIGlmIChDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMID09PSBmaWx0ZXIub3BlcmF0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUZXh0VHlwZSgpKSB7XG4gICAgICAgICAgdGhpcy5mY1RleHQuc2V0VmFsdWUoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTikge1xuICAgICAgICBpZiAodGhpcy5pc0RhdGVUeXBlKCkpIHtcbiAgICAgICAgICB0aGlzLmZjRnJvbS5zZXRWYWx1ZShuZXcgRGF0ZShmaWx0ZXIudmFsdWVzWzBdKSk7XG4gICAgICAgICAgdGhpcy5mY1RvLnNldFZhbHVlKG5ldyBEYXRlKGZpbHRlci52YWx1ZXNbMV0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZjRnJvbS5zZXRWYWx1ZShmaWx0ZXIudmFsdWVzWzBdKTtcbiAgICAgICAgICB0aGlzLmZjVG8uc2V0VmFsdWUoZmlsdGVyLnZhbHVlc1sxXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzRGF0ZVR5cGUoKSkge1xuICAgICAgICAgICAgdGhpcy5mY0Zyb20uc2V0VmFsdWUobmV3IERhdGUoZmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZjRnJvbS5zZXRWYWx1ZShmaWx0ZXIudmFsdWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5vcGVyYXRvciA9PT0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRlVHlwZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmZjVG8uc2V0VmFsdWUobmV3IERhdGUoZmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZjVG8uc2V0VmFsdWUoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNlbGVjdGVkVmFsdWVzKCk6IEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyVmFsdWVMaXN0ID8gdGhpcy5maWx0ZXJWYWx1ZUxpc3Quc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkIDogW107XG4gIH1cblxuICBhcmVBbGxTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFZhbHVlcy5sZW5ndGggPT09IHRoaXMuY29sdW1uRGF0YS5sZW5ndGg7XG4gIH1cblxuICBpc0luZGV0ZXJtaW5hdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRWYWx1ZXMubGVuZ3RoID4gMCAmJiB0aGlzLnNlbGVjdGVkVmFsdWVzLmxlbmd0aCAhPT0gdGhpcy5jb2x1bW5EYXRhLmxlbmd0aDtcbiAgfVxuXG4gIG9uU2VsZWN0QWxsQ2hhbmdlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSkge1xuICAgIGlmIChldmVudC5jaGVja2VkKSB7XG4gICAgICB0aGlzLmZpbHRlclZhbHVlTGlzdC5zZWxlY3RBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXJWYWx1ZUxpc3QuZGVzZWxlY3RBbGwoKTtcbiAgICB9XG4gIH1cblxuICBnZXREaXN0aW5jdFZhbHVlcyhkYXRhOiBBcnJheTxhbnk+LCBmaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgIGNvbnN0IGNvbFJlbmRlcmVkVmFsdWVzID0gdGhpcy5nZXRDb2x1bW5EYXRhVXNpbmdSZW5kZXJlcigpO1xuICAgIGNvbnN0IGNvbFZhbHVlczogYW55W10gPSBkYXRhLm1hcChlbGVtID0+IGVsZW1bdGhpcy5jb2x1bW4uYXR0cl0pO1xuXG4gICAgY29sUmVuZGVyZWRWYWx1ZXMuZm9yRWFjaCgocmVuZGVyZWRWYWx1ZSwgaSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmNvbHVtbkRhdGEuZmluZChpdGVtID0+IGl0ZW0ucmVuZGVyZWRWYWx1ZSA9PT0gcmVuZGVyZWRWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5EYXRhLnB1c2goe1xuICAgICAgICAgIHJlbmRlcmVkVmFsdWU6IHJlbmRlcmVkVmFsdWUsXG4gICAgICAgICAgdmFsdWU6IGNvbFZhbHVlc1tpXSxcbiAgICAgICAgICBzZWxlY3RlZDogZmlsdGVyLm9wZXJhdG9yID09PSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOICYmIChmaWx0ZXIudmFsdWVzIHx8IFtdKS5pbmRleE9mKGNvbFZhbHVlc1tpXSkgIT09IC0xLFxuICAgICAgICAgIC8vIHN0b3JpbmcgdGhlIGZpcnN0IGluZGV4IHdoZXJlIHRoaXMgcmVuZGVyZWRWYWx1ZSBpcyBvYnRhaW5lZC4gSW4gdGhlIHRlbXBsYXRlIG9mIHRoaXMgY29tcG9uZW50IHRoZSBjb2x1bW4gcmVuZGVyZXIgd2lsbCBvYnRhaW4gdGhlXG4gICAgICAgICAgLy8gcm93IHZhbHVlIG9mIHRoaXMgaW5kZXhcbiAgICAgICAgICB0YWJsZUluZGV4OiBpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Q29sdW1uVmFsdWVzRmlsdGVyKCk6IE9Db2x1bW5WYWx1ZUZpbHRlciB7XG4gICAgY29uc3QgZmlsdGVyID0ge1xuICAgICAgYXR0cjogdGhpcy5jb2x1bW4uYXR0cixcbiAgICAgIG9wZXJhdG9yOiB1bmRlZmluZWQsXG4gICAgICB2YWx1ZXM6IHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICBpZiAoIXRoaXMuaXNDdXN0b21GaWx0ZXJTdWJqZWN0LmdldFZhbHVlKCkpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkVmFsdWVzLmxlbmd0aCkge1xuICAgICAgICBmaWx0ZXIub3BlcmF0b3IgPSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOO1xuICAgICAgICBmaWx0ZXIudmFsdWVzID0gdGhpcy5zZWxlY3RlZFZhbHVlcy5tYXAoKGl0ZW0pID0+IGl0ZW0udmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5mY1RleHQudmFsdWUpIHtcbiAgICAgICAgZmlsdGVyLm9wZXJhdG9yID0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5FUVVBTDtcbiAgICAgICAgZmlsdGVyLnZhbHVlcyA9IHRoaXMuZ2V0VHlwZWRWYWx1ZSh0aGlzLmZjVGV4dCk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5mY0Zyb20udmFsdWUgJiYgdGhpcy5mY1RvLnZhbHVlKSB7XG4gICAgICAgIGZpbHRlci5vcGVyYXRvciA9IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTjtcbiAgICAgICAgY29uc3QgZnJvbVZhbHVlID0gdGhpcy5nZXRUeXBlZFZhbHVlKHRoaXMuZmNGcm9tKTtcbiAgICAgICAgY29uc3QgdG9WYWx1ZSA9IHRoaXMuZ2V0VHlwZWRWYWx1ZSh0aGlzLmZjVG8pO1xuICAgICAgICBmaWx0ZXIudmFsdWVzID0gZnJvbVZhbHVlIDw9IHRvVmFsdWUgPyBbZnJvbVZhbHVlLCB0b1ZhbHVlXSA6IFt0b1ZhbHVlLCBmcm9tVmFsdWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZmNGcm9tLnZhbHVlKSB7XG4gICAgICAgICAgZmlsdGVyLm9wZXJhdG9yID0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5NT1JFX0VRVUFMO1xuICAgICAgICAgIGZpbHRlci52YWx1ZXMgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY0Zyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZjVG8udmFsdWUpIHtcbiAgICAgICAgICBmaWx0ZXIub3BlcmF0b3IgPSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkxFU1NfRVFVQUw7XG4gICAgICAgICAgZmlsdGVyLnZhbHVlcyA9IHRoaXMuZ2V0VHlwZWRWYWx1ZSh0aGlzLmZjVG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBjbGVhclZhbHVlcygpIHtcbiAgICBpZiAodGhpcy5pc1RleHRUeXBlKCkpIHtcbiAgICAgIHRoaXMuZmNUZXh0LnNldFZhbHVlKHVuZGVmaW5lZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmlzRGF0ZVR5cGUoKSB8fCB0aGlzLmlzTnVtZXJpY1R5cGUpIHtcbiAgICAgICAgdGhpcy5mY0Zyb20uc2V0VmFsdWUodW5kZWZpbmVkKTtcbiAgICAgICAgdGhpcy5mY1RvLnNldFZhbHVlKHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25DbGlja1NvcnRWYWx1ZXMoKSB7XG4gICAgc3dpdGNoICh0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb24pIHtcbiAgICAgIGNhc2UgJ2FzYyc6XG4gICAgICAgIHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbiA9ICdkZXNjJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZXNjJzpcbiAgICAgICAgdGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uID0gJyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uID0gJ2FzYyc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICB0aGlzLm9uU29ydEZpbHRlclZhbHVlc0NoYW5nZS5lbWl0KHRoaXMuZ2V0RmlsdGVyQ29sdW1uKCkpO1xuICAgIHRoaXMuc29ydERhdGEoKTtcbiAgfVxuXG4gIHNvcnREYXRhKCkge1xuICAgIGNvbnN0IHNvcnRlZERhdGEgPSBPYmplY3QuYXNzaWduKFtdLCB0aGlzLmNvbHVtbkRhdGEpO1xuICAgIGlmICh0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb24gIT09ICcnKSB7XG4gICAgICB0aGlzLmxpc3REYXRhU3ViamVjdC5uZXh0KHNvcnRlZERhdGEuc29ydCh0aGlzLnNvcnRGdW5jdGlvbi5iaW5kKHRoaXMpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdERhdGFTdWJqZWN0Lm5leHQoc29ydGVkRGF0YSk7XG4gICAgfVxuXG4gIH1cblxuICBzb3J0RnVuY3Rpb24oYTogYW55LCBiOiBhbnkpOiBudW1iZXIge1xuICAgIGxldCBwcm9wZXJ0eUE6IG51bWJlciB8IHN0cmluZyA9ICcnO1xuICAgIGxldCBwcm9wZXJ0eUI6IG51bWJlciB8IHN0cmluZyA9ICcnO1xuICAgIFtwcm9wZXJ0eUEsIHByb3BlcnR5Ql0gPSBbYVsndmFsdWUnXSwgYlsndmFsdWUnXV07XG5cbiAgICBjb25zdCB2YWx1ZUEgPSB0eXBlb2YgcHJvcGVydHlBID09PSAndW5kZWZpbmVkJyA/ICcnIDogcHJvcGVydHlBID09PSAnJyA/IHByb3BlcnR5QSA6IGlzTmFOKCtwcm9wZXJ0eUEpID8gcHJvcGVydHlBLnRvU3RyaW5nKCkudHJpbSgpLnRvTG93ZXJDYXNlKCkgOiArcHJvcGVydHlBO1xuICAgIGNvbnN0IHZhbHVlQiA9IHR5cGVvZiBwcm9wZXJ0eUIgPT09ICd1bmRlZmluZWQnID8gJycgOiBwcm9wZXJ0eUIgPT09ICcnID8gcHJvcGVydHlCIDogaXNOYU4oK3Byb3BlcnR5QikgPyBwcm9wZXJ0eUIudG9TdHJpbmcoKS50cmltKCkudG9Mb3dlckNhc2UoKSA6ICtwcm9wZXJ0eUI7XG4gICAgcmV0dXJuICh2YWx1ZUEgPD0gdmFsdWVCID8gLTEgOiAxKSAqICh0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb24gPT09ICdhc2MnID8gMSA6IC0xKTtcbiAgfVxuXG4gIG9uU2xpZGVDaGFuZ2UoZTogTWF0U2xpZGVUb2dnbGVDaGFuZ2UpOiB2b2lkIHtcbiAgICB0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5uZXh0KGUuY2hlY2tlZCk7XG5cbiAgICBpZiAoIWUuY2hlY2tlZCkge1xuICAgICAgLy8gU2VsZWN0aW9uIG1vZGVcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZURhdGFMaXN0KCk7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZWxmLmluaXRpYWxpemVGaWx0ZXJFdmVudCgpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuICB9XG5cbiAgaXNUZXh0VHlwZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNOdW1lcmljVHlwZSgpICYmICF0aGlzLmlzRGF0ZVR5cGUoKTtcbiAgfVxuXG4gIGlzTnVtZXJpY1R5cGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFsnaW50ZWdlcicsICdyZWFsJywgJ2N1cnJlbmN5J10uaW5kZXhPZih0aGlzLmNvbHVtbi50eXBlKSAhPT0gLTE7XG4gIH1cblxuICBpc0RhdGVUeXBlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAnZGF0ZScgPT09IHRoaXMuY29sdW1uLnR5cGU7XG4gIH1cblxuICBnZXRSb3dWYWx1ZShpOiBudW1iZXIpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlRGF0YVtpXTtcbiAgfVxuXG4gIGdldEZpeGVkRGltZW5zaW9uQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZSA9PT0gJ3NlbGVjdGlvbicgfHwgdGhpcy5tb2RlID09PSAnZGVmYXVsdCc7XG4gIH1cblxuICBnZXRTb3J0QnlBbHBoYUljb24oKSB7XG4gICAgbGV0IGljb24gPSAnb250aW1pemU6c29ydF9ieV9hbHBoYSc7XG4gICAgaWYgKHRoaXMuYWN0aXZlU29ydERpcmVjdGlvbiAhPT0gJycpIHtcbiAgICAgIGljb24gKz0gJ18nICsgdGhpcy5hY3RpdmVTb3J0RGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gaWNvbjtcbiAgfVxuXG4gIGdldEZpbHRlckNvbHVtbigpOiBPRmlsdGVyQ29sdW1uIHtcbiAgICBsZXQgb2JqOiBPRmlsdGVyQ29sdW1uID0geyBhdHRyOiAnJywgc29ydDogJycgfTtcbiAgICBvYmouYXR0ciA9IHRoaXMuY29sdW1uLmF0dHI7XG4gICAgb2JqLnNvcnQgPSB0aGlzLmFjdGl2ZVNvcnREaXJlY3Rpb247XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRUeXBlZFZhbHVlKGNvbnRyb2w6IEZvcm1Db250cm9sKTogYW55IHtcbiAgICBsZXQgdmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgIGlmICh0aGlzLmlzTnVtZXJpY1R5cGUoKSkge1xuICAgICAgdmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0RhdGVUeXBlKCkpIHtcbiAgICAgIHZhbHVlID0gY29udHJvbC52YWx1ZS52YWx1ZU9mKCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRDb2x1bW5EYXRhVXNpbmdSZW5kZXJlcigpIHtcbiAgICBjb25zdCB1c2VSZW5kZXJlciA9IHRoaXMuY29sdW1uLnJlbmRlcmVyICYmIHRoaXMuY29sdW1uLnJlbmRlcmVyLmdldENlbGxEYXRhO1xuICAgIHJldHVybiB0aGlzLnRhYmxlRGF0YS5tYXAoKHJvdykgPT4gdXNlUmVuZGVyZXIgPyB0aGlzLmNvbHVtbi5yZW5kZXJlci5nZXRDZWxsRGF0YShyb3dbdGhpcy5jb2x1bW4uYXR0cl0sIHJvdykgOiByb3dbdGhpcy5jb2x1bW4uYXR0cl0pO1xuICB9XG59XG4iXX0=