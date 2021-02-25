import { ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ColumnValueFilterOperator } from '../../../../../types/o-column-value-filter.type';
import { Util } from '../../../../../util/util';
export class OTableFilterByColumnDataDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.preloadValues = true;
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
            this.listDataSubject.next(this.columnData.slice());
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
                    selected: filter.operator === ColumnValueFilterOperator.IN && (filter.values || []).indexOf(renderedValue) !== -1,
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
                template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.FILTER_BY_COLUMN' | oTranslate }}: {{ column.title | oTranslate }}</span>\n<div mat-dialog-content fxLayout=\"row\" fxLayoutAlign=\"space-between stretch\" class=\"dialog-list-container\">\n  <div fxLayout=\"column\" class=\"content-wrapper\"  [class.content-wrapper-fixed-dimension]=\"getFixedDimensionClass()\">\n    <mat-slide-toggle #customFilterSlide (change)=\"onSlideChange($event)\" [checked]=\"(isCustomFilter | async)\"\n      *ngIf=\"isDefaultFilter | async\">\n      {{ 'TABLE.FILTER_BY_COLUMN.CUSTOM_FILTER' | oTranslate }}\n    </mat-slide-toggle>\n    <div fxFlex *ngIf=\"!(isCustomFilter | async);else customFilterTemplate\" fxLayout=\"column\">\n      <mat-form-field class=\"hinted\">\n        <mat-icon matPrefix svgIcon=\"ontimize:search\"></mat-icon>\n        <input matInput #filter placeholder=\"{{ 'TABLE.FILTER' | oTranslate }}\">\n        <mat-hint>{{ 'TABLE.FILTER_BY_COLUMN.HINT_STAR' | oTranslate }}</mat-hint>\n      </mat-form-field>\n      <mat-checkbox (change)=\"onSelectAllChange($event)\" [checked]=\"areAllSelected()\"\n        [indeterminate]=\"isIndeterminate()\" [disabled]=\"!listData\" class=\"select-all-checkbox\">\n        {{ 'TABLE.FILTER_BY_COLUMN.CHECK_ALL' | oTranslate }}\n      </mat-checkbox>\n      <span *ngIf=\"!listData\" class=\"column-filter-empty-list\">\n        {{ 'TABLE.FILTER_BY_COLUMN.LIST_EMPTY_FILTER' | oTranslate }}\n      </span>\n      <span *ngIf=\"(listData | async).length === 0\" class=\"column-filter-empty-list\">{{ 'TABLE.FILTER_BY_COLUMN.LIST_EMPTY' |\n        oTranslate }}</span>\n      <mat-selection-list *ngIf=\"preloadValues || listData\" #filterValueList fxFlex fxLayout=\"column\"\n        class=\"select-values-list\">\n        <mat-list-option *ngFor=\"let record of (listData | async); let i = index\" checkboxPosition=\"before\"\n          [selected]=\"record.selected\" [value]=\"record.renderedValue\">\n          <ng-container *ngIf=\"!column.renderer\">\n            {{ record.value || ('TABLE.FILTER_BY_COLUMN.EMPTY_VALUE' | oTranslate) }}\n          </ng-container>\n          <ng-template *ngIf=\"column.renderer\" [ngTemplateOutlet]=\"column.renderer.templateref\"\n            [ngTemplateOutletContext]=\"{ cellvalue: record.value, rowvalue: getRowValue(record.tableIndex) }\"></ng-template>\n        </mat-list-option>\n      </mat-selection-list>\n    </div>\n\n  </div>\n</div>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">\n    {{ 'CANCEL' | oTranslate | uppercase }} </button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\">\n    {{ 'ACCEPT' | oTranslate | uppercase }} </button>\n</mat-dialog-actions>\n\n<!-- TEMPLATE CUSTOM FILTER-->\n<ng-template #customFilterTemplate>\n  <div *ngIf=\"isTextType()\">\n    <mat-form-field fxFlex class=\"hinted\">\n      <input matInput #filterText [formControl]=\"fcText\" placeholder=\"{{ 'TABLE.FILTER' | oTranslate }}\">\n      <mat-hint>{{ 'TABLE.FILTER_BY_COLUMN.HINT_STAR' | oTranslate }}</mat-hint>\n    </mat-form-field>\n  </div>\n  <div *ngIf=\"isNumericType()\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n    <mat-form-field fxFlex=\"45\">\n      <input matInput [formControl]=\"fcFrom\" placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.FROM' | oTranslate }}\">\n    </mat-form-field>\n    <mat-form-field fxFlex=\"45\">\n      <input matInput [formControl]=\"fcTo\" placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.TO' | oTranslate }}\">\n    </mat-form-field>\n  </div>\n  <div *ngIf=\"isDateType()\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n    <mat-form-field fxFlex=\"45\">\n      <input matInput [matDatepicker]=\"datepickerFrom\" [max]=\"fcTo.value\" [formControl]=\"fcFrom\"\n        placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.FROM' | oTranslate }}\">\n      <mat-datepicker-toggle matSuffix [for]=\"datepickerFrom\">\n        <mat-icon matDatepickerToggleIcon>today</mat-icon>\n      </mat-datepicker-toggle>\n      <mat-datepicker #datepickerFrom></mat-datepicker>\n    </mat-form-field>\n    <mat-form-field fxFlex=\"45\">\n      <input matInput [matDatepicker]=\"datepickerTo\" [min]=\"fcFrom.value\" [formControl]=\"fcTo\"\n        placeholder=\"{{ 'TABLE.FILTER_BY_COLUMN.TO' | oTranslate }}\">\n      <mat-datepicker-toggle matSuffix [for]=\"datepickerTo\">\n        <mat-icon matDatepickerToggleIcon>today</mat-icon>\n      </mat-datepicker-toggle>\n      <mat-datepicker #datepickerTo></mat-datepicker>\n    </mat-form-field>\n  </div>\n\n</ng-template>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class.o-filter-by-column-dialog]': 'true'
                },
                styles: [".o-filter-by-column-dialog .mat-slide-toggle{padding-bottom:24px}.o-filter-by-column-dialog .content-wrapper{padding:24px 0 12px;margin:0}.o-filter-by-column-dialog .content-wrapper.content-wrapper-fixed-dimension{max-height:430px;min-height:430px;min-width:250px}.o-filter-by-column-dialog .content-wrapper .mat-form-field.hinted{margin-bottom:24px}.o-filter-by-column-dialog .content-wrapper .select-all-checkbox{padding-bottom:6px}.o-filter-by-column-dialog .content-wrapper .select-values-list{padding-top:0;overflow-y:auto;overflow-x:hidden;outline:0}.o-filter-by-column-dialog .content-wrapper .select-values-list .mat-list-item{height:30px}.o-filter-by-column-dialog .content-wrapper .select-values-list .mat-list-item .mat-list-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.o-filter-by-column-dialog .content-wrapper .select-values-list .mat-list-item .mat-list-text .mat-icon{font-size:24px}.o-filter-by-column-dialog .content-wrapper .column-filter-empty-list{text-align:center}"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9maWx0ZXItYnktY29sdW1uL28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLWRpYWxvZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsZUFBZSxFQUFxQixZQUFZLEVBQUUsZ0JBQWdCLEVBQXdCLE1BQU0sbUJBQW1CLENBQUM7QUFDN0gsT0FBTyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBRSx5QkFBeUIsRUFBc0IsTUFBTSxpREFBaUQsQ0FBQztBQUVoSCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFhaEQsTUFBTSxPQUFPLHVDQUF1QztJQXlCbEQsWUFDUyxTQUFnRSxFQUM5QyxJQUFTO1FBRDNCLGNBQVMsR0FBVCxTQUFTLENBQXVEO1FBdkJ6RSxrQkFBYSxHQUFZLElBQUksQ0FBQztRQUV0QiwwQkFBcUIsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUNwRSxtQkFBYyxHQUF3QixJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFeEUsMkJBQXNCLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FB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TSxTQUFDLGVBQWU7OztxQkFMeEIsU0FBUyxTQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7OEJBQ3JDLFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNQVRfRElBTE9HX0RBVEEsIE1hdENoZWNrYm94Q2hhbmdlLCBNYXREaWFsb2dSZWYsIE1hdFNlbGVjdGlvbkxpc3QsIE1hdFNsaWRlVG9nZ2xlQ2hhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBmcm9tRXZlbnQsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IsIE9Db2x1bW5WYWx1ZUZpbHRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLXZhbHVlLWZpbHRlci50eXBlJztcbmltcG9ydCB7IFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby10YWJsZS1maWx0ZXItYnktY29sdW1uLWRhdGEudHlwZSc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJ28tdGFibGUtZmlsdGVyLWJ5LWNvbHVtbi1kYXRhLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydvLXRhYmxlLWZpbHRlci1ieS1jb2x1bW4tZGF0YS1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZmlsdGVyLWJ5LWNvbHVtbi1kaWFsb2ddJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlRmlsdGVyQnlDb2x1bW5EYXRhRGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgY29sdW1uOiBPQ29sdW1uO1xuICBwcmVsb2FkVmFsdWVzOiBib29sZWFuID0gdHJ1ZTtcbiAgbW9kZTogc3RyaW5nO1xuICBwcml2YXRlIGlzQ3VzdG9tRmlsdGVyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBpc0N1c3RvbUZpbHRlcjogT2JzZXJ2YWJsZTxib29sZWFuPiA9IHRoaXMuaXNDdXN0b21GaWx0ZXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgaXNEZWZhdWx0RmlsdGVyU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBpc0RlZmF1bHRGaWx0ZXI6IE9ic2VydmFibGU8Ym9vbGVhbj4gPSB0aGlzLmlzRGVmYXVsdEZpbHRlclN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgZmNUZXh0ID0gbmV3IEZvcm1Db250cm9sKCk7XG4gIGZjRnJvbSA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICBmY1RvID0gbmV3IEZvcm1Db250cm9sKCk7XG5cbiAgcHJvdGVjdGVkIGNvbHVtbkRhdGE6IEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPiA9IFtdO1xuICBwcm90ZWN0ZWQgdGFibGVEYXRhOiBBcnJheTxhbnk+ID0gW107XG5cbiAgcHJpdmF0ZSBsaXN0RGF0YVN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4oW10pO1xuICBwcm90ZWN0ZWQgX2xpc3REYXRhOiBPYnNlcnZhYmxlPEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4gPSB0aGlzLmxpc3REYXRhU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuXG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlcicsIHsgc3RhdGljOiBmYWxzZSB9KSBmaWx0ZXI6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2ZpbHRlclZhbHVlTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBmaWx0ZXJWYWx1ZUxpc3Q6IE1hdFNlbGVjdGlvbkxpc3Q7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9UYWJsZUZpbHRlckJ5Q29sdW1uRGF0YURpYWxvZ0NvbXBvbmVudD4sXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IGFueVxuICApIHtcbiAgICBpZiAoZGF0YS5jb2x1bW4pIHtcbiAgICAgIHRoaXMuY29sdW1uID0gZGF0YS5jb2x1bW47XG4gICAgfVxuICAgIGxldCBwcmV2aW91c0ZpbHRlcjogT0NvbHVtblZhbHVlRmlsdGVyID0ge1xuICAgICAgYXR0cjogdW5kZWZpbmVkLFxuICAgICAgb3BlcmF0b3I6IHVuZGVmaW5lZCxcbiAgICAgIHZhbHVlczogdW5kZWZpbmVkXG4gICAgfTtcbiAgICBpZiAoZGF0YS5tb2RlKSB7XG4gICAgICB0aGlzLmlzRGVmYXVsdEZpbHRlclN1YmplY3QubmV4dChkYXRhLm1vZGUgPT09ICdkZWZhdWx0Jyk7XG4gICAgICB0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5uZXh0KGRhdGEubW9kZSA9PT0gJ2N1c3RvbScpO1xuICAgICAgdGhpcy5tb2RlID0gZGF0YS5tb2RlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnByZXZpb3VzRmlsdGVyKSB7XG4gICAgICBwcmV2aW91c0ZpbHRlciA9IGRhdGEucHJldmlvdXNGaWx0ZXI7XG4gICAgICB0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5uZXh0KFtDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkxFU1NfRVFVQUwsIENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTCwgQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5CRVRXRUVOLCBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMXS5pbmRleE9mKHByZXZpb3VzRmlsdGVyLm9wZXJhdG9yKSAhPT0gLTEpO1xuICAgIH1cbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgncHJlbG9hZFZhbHVlcycpKSB7XG4gICAgICB0aGlzLnByZWxvYWRWYWx1ZXMgPSBkYXRhLnByZWxvYWRWYWx1ZXM7XG4gICAgfVxuICAgIGlmIChkYXRhLnRhYmxlRGF0YSAmJiBBcnJheS5pc0FycmF5KGRhdGEudGFibGVEYXRhKSkge1xuICAgICAgdGhpcy50YWJsZURhdGEgPSBkYXRhLnRhYmxlRGF0YTtcbiAgICAgIHRoaXMuZ2V0RGlzdGluY3RWYWx1ZXMoZGF0YS50YWJsZURhdGEsIHByZXZpb3VzRmlsdGVyKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUN1c3RvbUZpbHRlclZhbHVlcyhwcmV2aW91c0ZpbHRlcik7XG4gICAgICB0aGlzLmluaXRpYWxpemVEYXRhTGlzdChwcmV2aW91c0ZpbHRlcik7XG4gICAgfVxuICAgIGlmIChkYXRhLm1vZGUpIHtcbiAgICAgIHRoaXMubW9kZSA9IGRhdGEubW9kZTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplRmlsdGVyRXZlbnQoKTtcbiAgfVxuXG4gIGdldCBsaXN0RGF0YSgpOiBPYnNlcnZhYmxlPEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPj4ge1xuICAgIHJldHVybiB0aGlzLl9saXN0RGF0YTtcbiAgfVxuXG4gIHNldCBsaXN0RGF0YShhcmc6IE9ic2VydmFibGU8QXJyYXk8VGFibGVGaWx0ZXJCeUNvbHVtbkRhdGE+Pikge1xuICAgIHRoaXMuX2xpc3REYXRhID0gYXJnO1xuICB9XG5cbiAgaW5pdGlhbGl6ZURhdGFMaXN0KGZpbHRlcj86IE9Db2x1bW5WYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnByZWxvYWRWYWx1ZXMgfHwgKGZpbHRlciAmJiBmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU4pKSB7XG4gICAgICB0aGlzLmxpc3REYXRhU3ViamVjdC5uZXh0KHRoaXMuY29sdW1uRGF0YS5zbGljZSgpKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplRmlsdGVyRXZlbnQoKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyKSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIGZyb21FdmVudCh0aGlzLmZpbHRlci5uYXRpdmVFbGVtZW50LCAna2V5dXAnKVxuICAgICAgICAucGlwZShkZWJvdW5jZVRpbWUoMTUwKSlcbiAgICAgICAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbHRlclZhbHVlOiBzdHJpbmcgPSBzZWxmLmZpbHRlci5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICAgIGZpbHRlclZhbHVlID0gVXRpbC5ub3JtYWxpemVTdHJpbmcoZmlsdGVyVmFsdWUpO1xuICAgICAgICAgIGlmIChmaWx0ZXJWYWx1ZS5pbmRleE9mKCcqJykgIT09IC0xKSB7XG4gICAgICAgICAgICBzZWxmLmxpc3REYXRhU3ViamVjdC5uZXh0KHNlbGYuY29sdW1uRGF0YS5maWx0ZXIoaXRlbSA9PiBuZXcgUmVnRXhwKCdeJyArIFV0aWwubm9ybWFsaXplU3RyaW5nKGZpbHRlclZhbHVlKS5zcGxpdCgnKicpLmpvaW4oJy4qJykgKyAnJCcpLnRlc3QoVXRpbC5ub3JtYWxpemVTdHJpbmcoaXRlbS5yZW5kZXJlZFZhbHVlKSkpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5saXN0RGF0YVN1YmplY3QubmV4dChzZWxmLmNvbHVtbkRhdGEuZmlsdGVyKGl0ZW0gPT4gKFV0aWwubm9ybWFsaXplU3RyaW5nKGl0ZW0ucmVuZGVyZWRWYWx1ZSkuaW5kZXhPZihmaWx0ZXJWYWx1ZSkgIT09IC0xKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUN1c3RvbUZpbHRlclZhbHVlcyhmaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgIT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuSU4pIHtcbiAgICAgIGlmIChDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkVRVUFMID09PSBmaWx0ZXIub3BlcmF0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUZXh0VHlwZSgpKSB7XG4gICAgICAgICAgdGhpcy5mY1RleHQuc2V0VmFsdWUoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuQkVUV0VFTikge1xuICAgICAgICBpZiAodGhpcy5pc0RhdGVUeXBlKCkpIHtcbiAgICAgICAgICB0aGlzLmZjRnJvbS5zZXRWYWx1ZShuZXcgRGF0ZShmaWx0ZXIudmFsdWVzWzBdKSk7XG4gICAgICAgICAgdGhpcy5mY1RvLnNldFZhbHVlKG5ldyBEYXRlKGZpbHRlci52YWx1ZXNbMV0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZjRnJvbS5zZXRWYWx1ZShmaWx0ZXIudmFsdWVzWzBdKTtcbiAgICAgICAgICB0aGlzLmZjVG8uc2V0VmFsdWUoZmlsdGVyLnZhbHVlc1sxXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChmaWx0ZXIub3BlcmF0b3IgPT09IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTCkge1xuICAgICAgICAgIGlmICh0aGlzLmlzRGF0ZVR5cGUoKSkge1xuICAgICAgICAgICAgdGhpcy5mY0Zyb20uc2V0VmFsdWUobmV3IERhdGUoZmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZjRnJvbS5zZXRWYWx1ZShmaWx0ZXIudmFsdWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbHRlci5vcGVyYXRvciA9PT0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMKSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNEYXRlVHlwZSgpKSB7XG4gICAgICAgICAgICB0aGlzLmZjVG8uc2V0VmFsdWUobmV3IERhdGUoZmlsdGVyLnZhbHVlcykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZjVG8uc2V0VmFsdWUoZmlsdGVyLnZhbHVlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNlbGVjdGVkVmFsdWVzKCk6IEFycmF5PFRhYmxlRmlsdGVyQnlDb2x1bW5EYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyVmFsdWVMaXN0ID8gdGhpcy5maWx0ZXJWYWx1ZUxpc3Quc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkIDogW107XG4gIH1cblxuICBhcmVBbGxTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFZhbHVlcy5sZW5ndGggPT09IHRoaXMuY29sdW1uRGF0YS5sZW5ndGg7XG4gIH1cblxuICBpc0luZGV0ZXJtaW5hdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRWYWx1ZXMubGVuZ3RoID4gMCAmJiB0aGlzLnNlbGVjdGVkVmFsdWVzLmxlbmd0aCAhPT0gdGhpcy5jb2x1bW5EYXRhLmxlbmd0aDtcbiAgfVxuXG4gIG9uU2VsZWN0QWxsQ2hhbmdlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSkge1xuICAgIGlmIChldmVudC5jaGVja2VkKSB7XG4gICAgICB0aGlzLmZpbHRlclZhbHVlTGlzdC5zZWxlY3RBbGwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXJWYWx1ZUxpc3QuZGVzZWxlY3RBbGwoKTtcbiAgICB9XG4gIH1cblxuICBnZXREaXN0aW5jdFZhbHVlcyhkYXRhOiBBcnJheTxhbnk+LCBmaWx0ZXI6IE9Db2x1bW5WYWx1ZUZpbHRlcik6IHZvaWQge1xuICAgIGNvbnN0IGNvbFJlbmRlcmVkVmFsdWVzID0gdGhpcy5nZXRDb2x1bW5EYXRhVXNpbmdSZW5kZXJlcigpO1xuICAgIGNvbnN0IGNvbFZhbHVlczogYW55W10gPSBkYXRhLm1hcChlbGVtID0+IGVsZW1bdGhpcy5jb2x1bW4uYXR0cl0pO1xuXG4gICAgY29sUmVuZGVyZWRWYWx1ZXMuZm9yRWFjaCgocmVuZGVyZWRWYWx1ZSwgaSkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmNvbHVtbkRhdGEuZmluZChpdGVtID0+IGl0ZW0ucmVuZGVyZWRWYWx1ZSA9PT0gcmVuZGVyZWRWYWx1ZSkpIHtcbiAgICAgICAgdGhpcy5jb2x1bW5EYXRhLnB1c2goe1xuICAgICAgICAgIHJlbmRlcmVkVmFsdWU6IHJlbmRlcmVkVmFsdWUsXG4gICAgICAgICAgdmFsdWU6IGNvbFZhbHVlc1tpXSxcbiAgICAgICAgICBzZWxlY3RlZDogZmlsdGVyLm9wZXJhdG9yID09PSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLklOICYmIChmaWx0ZXIudmFsdWVzIHx8IFtdKS5pbmRleE9mKHJlbmRlcmVkVmFsdWUpICE9PSAtMSxcbiAgICAgICAgICAvLyBzdG9yaW5nIHRoZSBmaXJzdCBpbmRleCB3aGVyZSB0aGlzIHJlbmRlcmVkVmFsdWUgaXMgb2J0YWluZWQuIEluIHRoZSB0ZW1wbGF0ZSBvZiB0aGlzIGNvbXBvbmVudCB0aGUgY29sdW1uIHJlbmRlcmVyIHdpbGwgb2J0YWluIHRoZVxuICAgICAgICAgIC8vIHJvdyB2YWx1ZSBvZiB0aGlzIGluZGV4XG4gICAgICAgICAgdGFibGVJbmRleDogaVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbHVtblZhbHVlc0ZpbHRlcigpOiBPQ29sdW1uVmFsdWVGaWx0ZXIge1xuICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgIGF0dHI6IHRoaXMuY29sdW1uLmF0dHIsXG4gICAgICBvcGVyYXRvcjogdW5kZWZpbmVkLFxuICAgICAgdmFsdWVzOiB1bmRlZmluZWRcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLmlzQ3VzdG9tRmlsdGVyU3ViamVjdC5nZXRWYWx1ZSgpKSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgZmlsdGVyLm9wZXJhdG9yID0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5JTjtcbiAgICAgICAgZmlsdGVyLnZhbHVlcyA9IHRoaXMuc2VsZWN0ZWRWYWx1ZXMubWFwKChpdGVtKSA9PiBpdGVtLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuZmNUZXh0LnZhbHVlKSB7XG4gICAgICAgIGZpbHRlci5vcGVyYXRvciA9IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuRVFVQUw7XG4gICAgICAgIGZpbHRlci52YWx1ZXMgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY1RleHQpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZmNGcm9tLnZhbHVlICYmIHRoaXMuZmNUby52YWx1ZSkge1xuICAgICAgICBmaWx0ZXIub3BlcmF0b3IgPSBDb2x1bW5WYWx1ZUZpbHRlck9wZXJhdG9yLkJFVFdFRU47XG4gICAgICAgIGNvbnN0IGZyb21WYWx1ZSA9IHRoaXMuZ2V0VHlwZWRWYWx1ZSh0aGlzLmZjRnJvbSk7XG4gICAgICAgIGNvbnN0IHRvVmFsdWUgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY1RvKTtcbiAgICAgICAgZmlsdGVyLnZhbHVlcyA9IGZyb21WYWx1ZSA8PSB0b1ZhbHVlID8gW2Zyb21WYWx1ZSwgdG9WYWx1ZV0gOiBbdG9WYWx1ZSwgZnJvbVZhbHVlXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmZjRnJvbS52YWx1ZSkge1xuICAgICAgICAgIGZpbHRlci5vcGVyYXRvciA9IENvbHVtblZhbHVlRmlsdGVyT3BlcmF0b3IuTU9SRV9FUVVBTDtcbiAgICAgICAgICBmaWx0ZXIudmFsdWVzID0gdGhpcy5nZXRUeXBlZFZhbHVlKHRoaXMuZmNGcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5mY1RvLnZhbHVlKSB7XG4gICAgICAgICAgZmlsdGVyLm9wZXJhdG9yID0gQ29sdW1uVmFsdWVGaWx0ZXJPcGVyYXRvci5MRVNTX0VRVUFMO1xuICAgICAgICAgIGZpbHRlci52YWx1ZXMgPSB0aGlzLmdldFR5cGVkVmFsdWUodGhpcy5mY1RvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlsdGVyO1xuICB9XG5cbiAgb25TbGlkZUNoYW5nZShlOiBNYXRTbGlkZVRvZ2dsZUNoYW5nZSk6IHZvaWQge1xuICAgIHRoaXMuaXNDdXN0b21GaWx0ZXJTdWJqZWN0Lm5leHQoZS5jaGVja2VkKTtcblxuICAgIGlmICghZS5jaGVja2VkKSB7XG4gICAgICAvLyBTZWxlY3Rpb24gbW9kZVxuICAgICAgdGhpcy5pbml0aWFsaXplRGF0YUxpc3QoKTtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHNlbGYuaW5pdGlhbGl6ZUZpbHRlckV2ZW50KCk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH1cblxuICBpc1RleHRUeXBlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5pc051bWVyaWNUeXBlKCkgJiYgIXRoaXMuaXNEYXRlVHlwZSgpO1xuICB9XG5cbiAgaXNOdW1lcmljVHlwZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gWydpbnRlZ2VyJywgJ3JlYWwnLCAnY3VycmVuY3knXS5pbmRleE9mKHRoaXMuY29sdW1uLnR5cGUpICE9PSAtMTtcbiAgfVxuXG4gIGlzRGF0ZVR5cGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICdkYXRlJyA9PT0gdGhpcy5jb2x1bW4udHlwZTtcbiAgfVxuXG4gIGdldFJvd1ZhbHVlKGk6IG51bWJlcik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVEYXRhW2ldO1xuICB9XG5cbiAgZ2V0Rml4ZWREaW1lbnNpb25DbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlID09PSAnc2VsZWN0aW9uJyB8fCB0aGlzLm1vZGUgPT09ICdkZWZhdWx0JztcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRUeXBlZFZhbHVlKGNvbnRyb2w6IEZvcm1Db250cm9sKTogYW55IHtcbiAgICBsZXQgdmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgIGlmICh0aGlzLmlzTnVtZXJpY1R5cGUoKSkge1xuICAgICAgdmFsdWUgPSBjb250cm9sLnZhbHVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc0RhdGVUeXBlKCkpIHtcbiAgICAgIHZhbHVlID0gY29udHJvbC52YWx1ZS52YWx1ZU9mKCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRDb2x1bW5EYXRhVXNpbmdSZW5kZXJlcigpIHtcbiAgICBjb25zdCB1c2VSZW5kZXJlciA9IHRoaXMuY29sdW1uLnJlbmRlcmVyICYmIHRoaXMuY29sdW1uLnJlbmRlcmVyLmdldENlbGxEYXRhO1xuICAgIHJldHVybiB0aGlzLnRhYmxlRGF0YS5tYXAoKHJvdykgPT4gdXNlUmVuZGVyZXIgPyB0aGlzLmNvbHVtbi5yZW5kZXJlci5nZXRDZWxsRGF0YShyb3dbdGhpcy5jb2x1bW4uYXR0cl0sIHJvdykgOiByb3dbdGhpcy5jb2x1bW4uYXR0cl0pO1xuICB9XG59XG4iXX0=