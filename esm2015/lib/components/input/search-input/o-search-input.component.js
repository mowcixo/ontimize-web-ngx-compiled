import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, Injector, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { O_INPUTS_OPTIONS } from '../../../config/app-config';
import { InputConverter } from '../../../decorators/input-converter';
import { SnackBarService } from '../../../services/snackbar.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { FilterExpressionUtils } from '../../../util/filter-expression.utils';
import { Util } from '../../../util/util';
export const DEFAULT_INPUTS_O_SEARCH_INPUT = [
    'placeholder',
    'width',
    'floatLabel: float-label',
    'appearance',
    'columns',
    'filterCaseSensitive: filter-case-sensitive',
    'showCaseSensitiveCheckbox: show-case-sensitive-checkbox',
    'showMenu: show-menu'
];
export const DEFAULT_OUTPUTS_O_SEARCH_INPUT = [
    'onSearch'
];
export class OSearchInputComponent {
    constructor(injector, elRef) {
        this.injector = injector;
        this.elRef = elRef;
        this.onSearch = new EventEmitter();
        this.colArray = [];
        this.placeholder = 'SEARCH';
        this.showCaseSensitiveCheckbox = false;
        this.showMenu = true;
        this._filterCaseSensitive = false;
        this.translateService = this.injector.get(OTranslateService);
        this.snackBarService = this.injector.get(SnackBarService);
        this.formGroup = new FormGroup({});
    }
    ngOnInit() {
        this.term = new FormControl();
        this.formGroup.addControl('term', this.term);
        this.term.valueChanges.pipe(debounceTime(400))
            .pipe(distinctUntilChanged()).subscribe(term => {
            if (this.checkActiveColumns()) {
                this.onSearch.emit(term);
            }
        });
        const colArray = Util.parseArray(this.columns, true);
        colArray.forEach((col) => {
            this.colArray.push({
                column: col,
                checked: true
            });
        });
    }
    ngAfterViewInit() {
        try {
            this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
        }
        catch (e) {
            this.oInputsOptions = {};
        }
        Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
    }
    get floatLabel() {
        return this._floatLabel;
    }
    set floatLabel(value) {
        const values = ['always', 'never', 'auto'];
        if (values.indexOf(value) === -1) {
            value = 'auto';
        }
        this._floatLabel = value;
    }
    get appearance() {
        return this._appearance;
    }
    set appearance(value) {
        const values = ['legacy', 'standard', 'fill', 'outline'];
        if (values.indexOf(value) === -1) {
            value = undefined;
        }
        this._appearance = value;
    }
    get filterCaseSensitive() {
        return this._filterCaseSensitive;
    }
    set filterCaseSensitive(value) {
        this._filterCaseSensitive = value;
    }
    getFormGroup() {
        return this.formGroup;
    }
    getValue() {
        return this.term.value;
    }
    setValue(val) {
        this.term.setValue(val);
    }
    getFormControl() {
        return this.term;
    }
    get hasCustomWidth() {
        return this.width !== undefined;
    }
    get showFilterMenu() {
        return this.showMenu && this.colArray.length > 0;
    }
    isChecked(column) {
        return column.checked;
    }
    onCheckboxChange(column, event) {
        column.checked = event.checked;
    }
    onSelectAllChange(event) {
        this.colArray.forEach((col) => {
            col.checked = event.checked;
        });
    }
    areAllColumnsChecked() {
        let result = true;
        this.colArray.forEach((col) => {
            result = result && col.checked;
        });
        return result;
    }
    onFilterCaseSensitiveChange(event) {
        this.filterCaseSensitive = event.checked;
    }
    getActiveColumns() {
        return this.colArray.filter(col => col.checked).map(col => col.column);
    }
    setActiveColumns(arg) {
        this.colArray.forEach((c) => {
            c.checked = arg.indexOf(c.column) !== -1;
        });
    }
    checkActiveColumns() {
        if (this.getActiveColumns().length === 0) {
            this.snackBarService.open('MESSAGES.AVOID_QUERY_WITHOUT_QUICKFILTER_COLUMNS');
            return false;
        }
        return true;
    }
    triggerOnSearch() {
        const term = this.term.value;
        if (this.checkActiveColumns() && Util.isDefined(term) && term.length > 0) {
            this.onSearch.emit(term);
        }
    }
    onMenuClosed() {
        this.triggerOnSearch();
    }
    get filterExpression() {
        const termValue = this.getValue();
        if (Util.isDefined(termValue) && termValue.length > 0) {
            const filterCols = this.getActiveColumns();
            if (filterCols.length > 0) {
                return FilterExpressionUtils.buildArrayExpressionLike(filterCols, termValue);
            }
        }
        return undefined;
    }
}
OSearchInputComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-search-input',
                template: "<form [formGroup]=\"getFormGroup()\">\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [class.custom-width]=\"hasCustomWidth\"\n    class=\"icon-field\" fxFill>\n    <mat-icon *ngIf=\"!showFilterMenu\" svgIcon=\"ontimize:search\" matPrefix></mat-icon>\n    <mat-icon *ngIf=\"showFilterMenu\" svgIcon=\"ontimize:search\" matPrefix [matMenuTriggerFor]=\"menu\"\n      class=\"menu-trigger\" (menuClosed)=\"onMenuClosed()\"></mat-icon>\n    <input #term matInput id=\"term\" type=\"search\" placeholder=\"{{ placeholder | oTranslate }}\" formControlName=\"term\">\n  </mat-form-field>\n</form>\n\n<mat-menu #menu=\"matMenu\" class=\"o-search-input-menu\">\n  <div fxLayout=\"column\" class=\"checkbox-container\">\n\n    <ng-container *ngIf=\"colArray.length > 1\">\n      <mat-checkbox (click)=\"$event.stopPropagation()\" [checked]=\"areAllColumnsChecked()\"\n        (change)=\"onSelectAllChange($event)\">\n        {{ 'SELECT_ALL' | oTranslate }}</mat-checkbox>\n      <mat-divider></mat-divider>\n    </ng-container>\n\n    <ng-container *ngFor=\"let item of colArray\">\n      <mat-checkbox (click)=\"$event.stopPropagation()\" [checked]=\"isChecked(item)\"\n        (change)=\"onCheckboxChange(item, $event)\">\n        {{ item.column | oTranslate }}\n      </mat-checkbox>\n    </ng-container>\n\n    <ng-container *ngIf=\"showCaseSensitiveCheckbox\">\n      <mat-divider></mat-divider>\n      <mat-checkbox (click)=\"$event.stopPropagation()\" [checked]=\"filterCaseSensitive\"\n        (change)=\"onFilterCaseSensitiveChange($event)\">\n        {{ 'TABLE.FILTER.CASE_SENSITIVE' | oTranslate }}\n      </mat-checkbox>\n    </ng-container>\n  </div>\n</mat-menu>",
                inputs: DEFAULT_INPUTS_O_SEARCH_INPUT,
                outputs: DEFAULT_OUTPUTS_O_SEARCH_INPUT,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-search-input]': 'true'
                },
                styles: [".o-search-input .mat-icon{vertical-align:bottom;cursor:default}.o-search-input .mat-icon.menu-trigger{cursor:pointer}.o-search-input .mat-input-element{line-height:20px}.o-search-input-menu .mat-divider{margin:8px 0}.o-search-input-menu .checkbox-container{padding:6px 12px}"]
            }] }
];
OSearchInputComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OSearchInputComponent.prototype, "showCaseSensitiveCheckbox", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OSearchInputComponent.prototype, "showMenu", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OSearchInputComponent.prototype, "_filterCaseSensitive", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZWFyY2gtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NlYXJjaC1pbnB1dC9vLXNlYXJjaC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFVLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDckUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saURBQWlELENBQUM7QUFHcEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTFDLE1BQU0sQ0FBQyxNQUFNLDZCQUE2QixHQUFHO0lBQzNDLGFBQWE7SUFDYixPQUFPO0lBQ1AseUJBQXlCO0lBQ3pCLFlBQVk7SUFDWixTQUFTO0lBQ1QsNENBQTRDO0lBQzVDLHlEQUF5RDtJQUN6RCxxQkFBcUI7Q0FDdEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHO0lBQzVDLFVBQVU7Q0FDWCxDQUFDO0FBa0JGLE1BQU0sT0FBTyxxQkFBcUI7SUF1QmhDLFlBQ1ksUUFBa0IsRUFDbEIsS0FBaUI7UUFEakIsYUFBUSxHQUFS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IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3RvciwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEZsb2F0TGFiZWxUeXBlLCBNYXRDaGVja2JveENoYW5nZSwgTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE9fSU5QVVRTX09QVElPTlMgfSBmcm9tICcuLi8uLi8uLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IFNuYWNrQmFyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL3NuYWNrYmFyLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IE9JbnB1dHNPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1pbnB1dHMtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IEZpbHRlckV4cHJlc3Npb25VdGlscyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvZmlsdGVyLWV4cHJlc3Npb24udXRpbHMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1NFQVJDSF9JTlBVVCA9IFtcbiAgJ3BsYWNlaG9sZGVyJyxcbiAgJ3dpZHRoJyxcbiAgJ2Zsb2F0TGFiZWw6IGZsb2F0LWxhYmVsJyxcbiAgJ2FwcGVhcmFuY2UnLFxuICAnY29sdW1ucycsXG4gICdmaWx0ZXJDYXNlU2Vuc2l0aXZlOiBmaWx0ZXItY2FzZS1zZW5zaXRpdmUnLFxuICAnc2hvd0Nhc2VTZW5zaXRpdmVDaGVja2JveDogc2hvdy1jYXNlLXNlbnNpdGl2ZS1jaGVja2JveCcsXG4gICdzaG93TWVudTogc2hvdy1tZW51J1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1NFQVJDSF9JTlBVVCA9IFtcbiAgJ29uU2VhcmNoJ1xuXTtcblxuZGVjbGFyZSB0eXBlIENvbHVtbk9iamVjdCA9IHtcbiAgY29sdW1uOiBzdHJpbmc7XG4gIGNoZWNrZWQ6IGJvb2xlYW47XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXNlYXJjaC1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXNlYXJjaC1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tc2VhcmNoLWlucHV0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19TRUFSQ0hfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX1NFQVJDSF9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1zZWFyY2gtaW5wdXRdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1NlYXJjaElucHV0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgb25TZWFyY2g6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHVibGljIGNvbEFycmF5OiBDb2x1bW5PYmplY3RbXSA9IFtdO1xuICBwdWJsaWMgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICdTRUFSQ0gnO1xuICBwdWJsaWMgd2lkdGg6IHN0cmluZztcbiAgcHVibGljIGNvbHVtbnM6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dDYXNlU2Vuc2l0aXZlQ2hlY2tib3g6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHNob3dNZW51OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIF9maWx0ZXJDYXNlU2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCBfZmxvYXRMYWJlbDogRmxvYXRMYWJlbFR5cGU7XG4gIHByb3RlY3RlZCBfYXBwZWFyYW5jZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICBwcm90ZWN0ZWQgZm9ybUdyb3VwOiBGb3JtR3JvdXA7XG4gIHByb3RlY3RlZCB0ZXJtOiBGb3JtQ29udHJvbDtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgb0lucHV0c09wdGlvbnM6IE9JbnB1dHNPcHRpb25zO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJTZXJ2aWNlOiBTbmFja0JhclNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMuc25hY2tCYXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoU25hY2tCYXJTZXJ2aWNlKTtcbiAgICB0aGlzLmZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe30pO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudGVybSA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2woJ3Rlcm0nLCB0aGlzLnRlcm0pO1xuXG4gICAgdGhpcy50ZXJtLnZhbHVlQ2hhbmdlcy5waXBlKGRlYm91bmNlVGltZSg0MDApKVxuICAgICAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSkuc3Vic2NyaWJlKHRlcm0gPT4ge1xuICAgICAgICBpZiAodGhpcy5jaGVja0FjdGl2ZUNvbHVtbnMoKSkge1xuICAgICAgICAgIHRoaXMub25TZWFyY2guZW1pdCh0ZXJtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBjb25zdCBjb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGNvbEFycmF5LmZvckVhY2goKGNvbDogc3RyaW5nKSA9PiB7XG4gICAgICB0aGlzLmNvbEFycmF5LnB1c2goe1xuICAgICAgICBjb2x1bW46IGNvbCxcbiAgICAgICAgY2hlY2tlZDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm9JbnB1dHNPcHRpb25zID0gdGhpcy5pbmplY3Rvci5nZXQoT19JTlBVVFNfT1BUSU9OUyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5vSW5wdXRzT3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBVdGlsLnBhcnNlT0lucHV0c09wdGlvbnModGhpcy5lbFJlZiwgdGhpcy5vSW5wdXRzT3B0aW9ucyk7XG4gIH1cblxuICBnZXQgZmxvYXRMYWJlbCgpOiBGbG9hdExhYmVsVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX2Zsb2F0TGFiZWw7XG4gIH1cblxuICBzZXQgZmxvYXRMYWJlbCh2YWx1ZTogRmxvYXRMYWJlbFR5cGUpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbJ2Fsd2F5cycsICduZXZlcicsICdhdXRvJ107XG4gICAgaWYgKHZhbHVlcy5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgIHZhbHVlID0gJ2F1dG8nO1xuICAgIH1cbiAgICB0aGlzLl9mbG9hdExhYmVsID0gdmFsdWU7XG4gIH1cblxuICBnZXQgYXBwZWFyYW5jZSgpOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwZWFyYW5jZTtcbiAgfVxuXG4gIHNldCBhcHBlYXJhbmNlKHZhbHVlOiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlKSB7XG4gICAgY29uc3QgdmFsdWVzID0gWydsZWdhY3knLCAnc3RhbmRhcmQnLCAnZmlsbCcsICdvdXRsaW5lJ107XG4gICAgaWYgKHZhbHVlcy5pbmRleE9mKHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLl9hcHBlYXJhbmNlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZmlsdGVyQ2FzZVNlbnNpdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsdGVyQ2FzZVNlbnNpdGl2ZTtcbiAgfVxuXG4gIHNldCBmaWx0ZXJDYXNlU2Vuc2l0aXZlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9IHZhbHVlO1xuICB9XG5cbiAgcHVibGljIGdldEZvcm1Hcm91cCgpOiBGb3JtR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmZvcm1Hcm91cDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRWYWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRlcm0udmFsdWU7XG4gIH1cblxuICBwdWJsaWMgc2V0VmFsdWUodmFsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnRlcm0uc2V0VmFsdWUodmFsKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGb3JtQ29udHJvbCgpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIHRoaXMudGVybTtcbiAgfVxuXG4gIGdldCBoYXNDdXN0b21XaWR0aCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aCAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0IHNob3dGaWx0ZXJNZW51KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnNob3dNZW51ICYmIHRoaXMuY29sQXJyYXkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHB1YmxpYyBpc0NoZWNrZWQoY29sdW1uOiBDb2x1bW5PYmplY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gY29sdW1uLmNoZWNrZWQ7XG4gIH1cblxuICBwdWJsaWMgb25DaGVja2JveENoYW5nZShjb2x1bW46IENvbHVtbk9iamVjdCwgZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlKTogdm9pZCB7XG4gICAgY29sdW1uLmNoZWNrZWQgPSBldmVudC5jaGVja2VkO1xuICAgIC8vIHRyaWdnZXJPblNlYXJjaCBpZiB3ZSB3YW50IHRvIHRyaWdnZXIgc2VhcmNoIG9uIGVhY2ggY2hhbmdlXG4gIH1cblxuICBwdWJsaWMgb25TZWxlY3RBbGxDaGFuZ2UoZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlKTogdm9pZCB7XG4gICAgdGhpcy5jb2xBcnJheS5mb3JFYWNoKChjb2w6IENvbHVtbk9iamVjdCkgPT4ge1xuICAgICAgY29sLmNoZWNrZWQgPSBldmVudC5jaGVja2VkO1xuICAgIH0pO1xuICAgIC8vIHRyaWdnZXJPblNlYXJjaCBpZiB3ZSB3YW50IHRvIHRyaWdnZXIgc2VhcmNoIG9uIGVhY2ggY2hhbmdlXG4gIH1cblxuICBwdWJsaWMgYXJlQWxsQ29sdW1uc0NoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9IHRydWU7XG4gICAgdGhpcy5jb2xBcnJheS5mb3JFYWNoKChjb2w6IENvbHVtbk9iamVjdCkgPT4ge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmIGNvbC5jaGVja2VkO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgb25GaWx0ZXJDYXNlU2Vuc2l0aXZlQ2hhbmdlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSk6IHZvaWQge1xuICAgIHRoaXMuZmlsdGVyQ2FzZVNlbnNpdGl2ZSA9IGV2ZW50LmNoZWNrZWQ7XG4gICAgLy8gdHJpZ2dlck9uU2VhcmNoIGlmIHdlIHdhbnQgdG8gdHJpZ2dlciBzZWFyY2ggb24gZWFjaCBjaGFuZ2VcbiAgfVxuXG4gIHB1YmxpYyBnZXRBY3RpdmVDb2x1bW5zKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5jb2xBcnJheS5maWx0ZXIoY29sID0+IGNvbC5jaGVja2VkKS5tYXAoY29sID0+IGNvbC5jb2x1bW4pO1xuICB9XG5cbiAgcHVibGljIHNldEFjdGl2ZUNvbHVtbnMoYXJnOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuY29sQXJyYXkuZm9yRWFjaCgoYzogQ29sdW1uT2JqZWN0KSA9PiB7XG4gICAgICBjLmNoZWNrZWQgPSBhcmcuaW5kZXhPZihjLmNvbHVtbikgIT09IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNoZWNrQWN0aXZlQ29sdW1ucygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5nZXRBY3RpdmVDb2x1bW5zKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNuYWNrQmFyU2VydmljZS5vcGVuKCdNRVNTQUdFUy5BVk9JRF9RVUVSWV9XSVRIT1VUX1FVSUNLRklMVEVSX0NPTFVNTlMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgdHJpZ2dlck9uU2VhcmNoKCk6IHZvaWQge1xuICAgIGNvbnN0IHRlcm0gPSB0aGlzLnRlcm0udmFsdWU7XG4gICAgaWYgKHRoaXMuY2hlY2tBY3RpdmVDb2x1bW5zKCkgJiYgVXRpbC5pc0RlZmluZWQodGVybSkgJiYgdGVybS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLm9uU2VhcmNoLmVtaXQodGVybSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uTWVudUNsb3NlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXJPblNlYXJjaCgpO1xuICB9XG5cbiAgZ2V0IGZpbHRlckV4cHJlc3Npb24oKTogRXhwcmVzc2lvbiB7XG4gICAgY29uc3QgdGVybVZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0ZXJtVmFsdWUpICYmIHRlcm1WYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmaWx0ZXJDb2xzID0gdGhpcy5nZXRBY3RpdmVDb2x1bW5zKCk7XG4gICAgICBpZiAoZmlsdGVyQ29scy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRBcnJheUV4cHJlc3Npb25MaWtlKGZpbHRlckNvbHMsIHRlcm1WYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==