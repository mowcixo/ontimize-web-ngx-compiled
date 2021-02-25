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
export var DEFAULT_INPUTS_O_SEARCH_INPUT = [
    'placeholder',
    'width',
    'floatLabel: float-label',
    'appearance',
    'columns',
    'filterCaseSensitive: filter-case-sensitive',
    'showCaseSensitiveCheckbox: show-case-sensitive-checkbox',
    'showMenu: show-menu'
];
export var DEFAULT_OUTPUTS_O_SEARCH_INPUT = [
    'onSearch'
];
var OSearchInputComponent = (function () {
    function OSearchInputComponent(injector, elRef) {
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
    OSearchInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.term = new FormControl();
        this.formGroup.addControl('term', this.term);
        this.term.valueChanges.pipe(debounceTime(400))
            .pipe(distinctUntilChanged()).subscribe(function (term) {
            if (_this.checkActiveColumns()) {
                _this.onSearch.emit(term);
            }
        });
        var colArray = Util.parseArray(this.columns, true);
        colArray.forEach(function (col) {
            _this.colArray.push({
                column: col,
                checked: true
            });
        });
    };
    OSearchInputComponent.prototype.ngAfterViewInit = function () {
        try {
            this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
        }
        catch (e) {
            this.oInputsOptions = {};
        }
        Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
    };
    Object.defineProperty(OSearchInputComponent.prototype, "floatLabel", {
        get: function () {
            return this._floatLabel;
        },
        set: function (value) {
            var values = ['always', 'never', 'auto'];
            if (values.indexOf(value) === -1) {
                value = 'auto';
            }
            this._floatLabel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OSearchInputComponent.prototype, "appearance", {
        get: function () {
            return this._appearance;
        },
        set: function (value) {
            var values = ['legacy', 'standard', 'fill', 'outline'];
            if (values.indexOf(value) === -1) {
                value = undefined;
            }
            this._appearance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OSearchInputComponent.prototype, "filterCaseSensitive", {
        get: function () {
            return this._filterCaseSensitive;
        },
        set: function (value) {
            this._filterCaseSensitive = value;
        },
        enumerable: true,
        configurable: true
    });
    OSearchInputComponent.prototype.getFormGroup = function () {
        return this.formGroup;
    };
    OSearchInputComponent.prototype.getValue = function () {
        return this.term.value;
    };
    OSearchInputComponent.prototype.setValue = function (val) {
        this.term.setValue(val);
    };
    OSearchInputComponent.prototype.getFormControl = function () {
        return this.term;
    };
    Object.defineProperty(OSearchInputComponent.prototype, "hasCustomWidth", {
        get: function () {
            return this.width !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OSearchInputComponent.prototype, "showFilterMenu", {
        get: function () {
            return this.showMenu && this.colArray.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    OSearchInputComponent.prototype.isChecked = function (column) {
        return column.checked;
    };
    OSearchInputComponent.prototype.onCheckboxChange = function (column, event) {
        column.checked = event.checked;
    };
    OSearchInputComponent.prototype.onSelectAllChange = function (event) {
        this.colArray.forEach(function (col) {
            col.checked = event.checked;
        });
    };
    OSearchInputComponent.prototype.areAllColumnsChecked = function () {
        var result = true;
        this.colArray.forEach(function (col) {
            result = result && col.checked;
        });
        return result;
    };
    OSearchInputComponent.prototype.onFilterCaseSensitiveChange = function (event) {
        this.filterCaseSensitive = event.checked;
    };
    OSearchInputComponent.prototype.getActiveColumns = function () {
        return this.colArray.filter(function (col) { return col.checked; }).map(function (col) { return col.column; });
    };
    OSearchInputComponent.prototype.setActiveColumns = function (arg) {
        this.colArray.forEach(function (c) {
            c.checked = arg.indexOf(c.column) !== -1;
        });
    };
    OSearchInputComponent.prototype.checkActiveColumns = function () {
        if (this.getActiveColumns().length === 0) {
            this.snackBarService.open('MESSAGES.AVOID_QUERY_WITHOUT_QUICKFILTER_COLUMNS');
            return false;
        }
        return true;
    };
    OSearchInputComponent.prototype.triggerOnSearch = function () {
        var term = this.term.value;
        if (this.checkActiveColumns() && Util.isDefined(term) && term.length > 0) {
            this.onSearch.emit(term);
        }
    };
    OSearchInputComponent.prototype.onMenuClosed = function () {
        this.triggerOnSearch();
    };
    Object.defineProperty(OSearchInputComponent.prototype, "filterExpression", {
        get: function () {
            var termValue = this.getValue();
            if (Util.isDefined(termValue) && termValue.length > 0) {
                var filterCols = this.getActiveColumns();
                if (filterCols.length > 0) {
                    return FilterExpressionUtils.buildArrayExpressionLike(filterCols, termValue);
                }
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
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
    OSearchInputComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef }
    ]; };
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
    return OSearchInputComponent;
}());
export { OSearchInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZWFyY2gtaW5wdXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L3NlYXJjaC1pbnB1dC9vLXNlYXJjaC1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFVLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXBFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDckUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0saURBQWlELENBQUM7QUFHcEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTFDLE1BQU0sQ0FBQyxJQUFNLDZCQUE2QixHQUFHO0lBQzNDLGFBQWE7SUFDYixPQUFPO0lBQ1AseUJBQXlCO0lBQ3pCLFlBQVk7SUFDWixTQUFTO0lBQ1QsNENBQTRDO0lBQzVDLHlEQUF5RDtJQUN6RCxxQkFBcUI7Q0FDdEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLDhCQUE4QixHQUFHO0lBQzVDLFVBQVU7Q0FDWCxDQUFDO0FBT0Y7SUFrQ0UsK0JBQ1ksUUFBa0IsRUFDbEIsS0FBaUI7UUFEakIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixV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QXNEM0M7UUFEQyxjQUFjLEVBQUU7OzRFQUNpQztJQUVsRDtRQURDLGNBQWMsRUFBRTs7MkRBQ2U7SUFFaEM7UUFEQyxjQUFjLEVBQUU7O3VFQUMrQjtJQTRLbEQsNEJBQUM7Q0FBQSxBQXBNRCxJQW9NQztTQXpMWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5qZWN0b3IsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBGb3JtR3JvdXAgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBGbG9hdExhYmVsVHlwZSwgTWF0Q2hlY2tib3hDaGFuZ2UsIE1hdEZvcm1GaWVsZEFwcGVhcmFuY2UgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBPX0lOUFVUU19PUFRJT05TIH0gZnJvbSAnLi4vLi4vLi4vY29uZmlnL2FwcC1jb25maWcnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBTbmFja0JhclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9zbmFja2Jhci5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL2V4cHJlc3Npb24udHlwZSc7XG5pbXBvcnQgeyBPSW5wdXRzT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL28taW5wdXRzLW9wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19TRUFSQ0hfSU5QVVQgPSBbXG4gICdwbGFjZWhvbGRlcicsXG4gICd3aWR0aCcsXG4gICdmbG9hdExhYmVsOiBmbG9hdC1sYWJlbCcsXG4gICdhcHBlYXJhbmNlJyxcbiAgJ2NvbHVtbnMnLFxuICAnZmlsdGVyQ2FzZVNlbnNpdGl2ZTogZmlsdGVyLWNhc2Utc2Vuc2l0aXZlJyxcbiAgJ3Nob3dDYXNlU2Vuc2l0aXZlQ2hlY2tib3g6IHNob3ctY2FzZS1zZW5zaXRpdmUtY2hlY2tib3gnLFxuICAnc2hvd01lbnU6IHNob3ctbWVudSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19TRUFSQ0hfSU5QVVQgPSBbXG4gICdvblNlYXJjaCdcbl07XG5cbmRlY2xhcmUgdHlwZSBDb2x1bW5PYmplY3QgPSB7XG4gIGNvbHVtbjogc3RyaW5nO1xuICBjaGVja2VkOiBib29sZWFuO1xufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1zZWFyY2gtaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1zZWFyY2gtaW5wdXQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXNlYXJjaC1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fU0VBUkNIX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19TRUFSQ0hfSU5QVVQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tc2VhcmNoLWlucHV0XSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9TZWFyY2hJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgcHVibGljIG9uU2VhcmNoOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHB1YmxpYyBjb2xBcnJheTogQ29sdW1uT2JqZWN0W10gPSBbXTtcbiAgcHVibGljIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSAnU0VBUkNIJztcbiAgcHVibGljIHdpZHRoOiBzdHJpbmc7XG4gIHB1YmxpYyBjb2x1bW5zOiBzdHJpbmc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93Q2FzZVNlbnNpdGl2ZUNoZWNrYm94OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBzaG93TWVudTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHByb3RlY3RlZCBfZmlsdGVyQ2FzZVNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgX2Zsb2F0TGFiZWw6IEZsb2F0TGFiZWxUeXBlO1xuICBwcm90ZWN0ZWQgX2FwcGVhcmFuY2U6IE1hdEZvcm1GaWVsZEFwcGVhcmFuY2U7XG5cbiAgcHJvdGVjdGVkIGZvcm1Hcm91cDogRm9ybUdyb3VwO1xuICBwcm90ZWN0ZWQgdGVybTogRm9ybUNvbnRyb2w7XG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIG9JbnB1dHNPcHRpb25zOiBPSW5wdXRzT3B0aW9ucztcbiAgcHJvdGVjdGVkIHNuYWNrQmFyU2VydmljZTogU25hY2tCYXJTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmXG4gICkge1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgICB0aGlzLnNuYWNrQmFyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KFNuYWNrQmFyU2VydmljZSk7XG4gICAgdGhpcy5mb3JtR3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnRlcm0gPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKCd0ZXJtJywgdGhpcy50ZXJtKTtcblxuICAgIHRoaXMudGVybS52YWx1ZUNoYW5nZXMucGlwZShkZWJvdW5jZVRpbWUoNDAwKSlcbiAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpLnN1YnNjcmliZSh0ZXJtID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tBY3RpdmVDb2x1bW5zKCkpIHtcbiAgICAgICAgICB0aGlzLm9uU2VhcmNoLmVtaXQodGVybSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgY29uc3QgY29sQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5jb2x1bW5zLCB0cnVlKTtcbiAgICBjb2xBcnJheS5mb3JFYWNoKChjb2w6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5jb2xBcnJheS5wdXNoKHtcbiAgICAgICAgY29sdW1uOiBjb2wsXG4gICAgICAgIGNoZWNrZWQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5vSW5wdXRzT3B0aW9ucyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9fSU5QVVRTX09QVElPTlMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub0lucHV0c09wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgVXRpbC5wYXJzZU9JbnB1dHNPcHRpb25zKHRoaXMuZWxSZWYsIHRoaXMub0lucHV0c09wdGlvbnMpO1xuICB9XG5cbiAgZ2V0IGZsb2F0TGFiZWwoKTogRmxvYXRMYWJlbFR5cGUge1xuICAgIHJldHVybiB0aGlzLl9mbG9hdExhYmVsO1xuICB9XG5cbiAgc2V0IGZsb2F0TGFiZWwodmFsdWU6IEZsb2F0TGFiZWxUeXBlKSB7XG4gICAgY29uc3QgdmFsdWVzID0gWydhbHdheXMnLCAnbmV2ZXInLCAnYXV0byddO1xuICAgIGlmICh2YWx1ZXMuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgICB2YWx1ZSA9ICdhdXRvJztcbiAgICB9XG4gICAgdGhpcy5fZmxvYXRMYWJlbCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGFwcGVhcmFuY2UoKTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwcGVhcmFuY2U7XG4gIH1cblxuICBzZXQgYXBwZWFyYW5jZSh2YWx1ZTogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IFsnbGVnYWN5JywgJ3N0YW5kYXJkJywgJ2ZpbGwnLCAnb3V0bGluZSddO1xuICAgIGlmICh2YWx1ZXMuaW5kZXhPZih2YWx1ZSkgPT09IC0xKSB7XG4gICAgICB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5fYXBwZWFyYW5jZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGZpbHRlckNhc2VTZW5zaXRpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbHRlckNhc2VTZW5zaXRpdmU7XG4gIH1cblxuICBzZXQgZmlsdGVyQ2FzZVNlbnNpdGl2ZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2ZpbHRlckNhc2VTZW5zaXRpdmUgPSB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGb3JtR3JvdXAoKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtR3JvdXA7XG4gIH1cblxuICBwdWJsaWMgZ2V0VmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50ZXJtLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIHNldFZhbHVlKHZhbDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy50ZXJtLnNldFZhbHVlKHZhbCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Rm9ybUNvbnRyb2woKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiB0aGlzLnRlcm07XG4gIH1cblxuICBnZXQgaGFzQ3VzdG9tV2lkdGgoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGggIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldCBzaG93RmlsdGVyTWVudSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93TWVudSAmJiB0aGlzLmNvbEFycmF5Lmxlbmd0aCA+IDA7XG4gIH1cblxuICBwdWJsaWMgaXNDaGVja2VkKGNvbHVtbjogQ29sdW1uT2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNvbHVtbi5jaGVja2VkO1xuICB9XG5cbiAgcHVibGljIG9uQ2hlY2tib3hDaGFuZ2UoY29sdW1uOiBDb2x1bW5PYmplY3QsIGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSk6IHZvaWQge1xuICAgIGNvbHVtbi5jaGVja2VkID0gZXZlbnQuY2hlY2tlZDtcbiAgICAvLyB0cmlnZ2VyT25TZWFyY2ggaWYgd2Ugd2FudCB0byB0cmlnZ2VyIHNlYXJjaCBvbiBlYWNoIGNoYW5nZVxuICB9XG5cbiAgcHVibGljIG9uU2VsZWN0QWxsQ2hhbmdlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSk6IHZvaWQge1xuICAgIHRoaXMuY29sQXJyYXkuZm9yRWFjaCgoY29sOiBDb2x1bW5PYmplY3QpID0+IHtcbiAgICAgIGNvbC5jaGVja2VkID0gZXZlbnQuY2hlY2tlZDtcbiAgICB9KTtcbiAgICAvLyB0cmlnZ2VyT25TZWFyY2ggaWYgd2Ugd2FudCB0byB0cmlnZ2VyIHNlYXJjaCBvbiBlYWNoIGNoYW5nZVxuICB9XG5cbiAgcHVibGljIGFyZUFsbENvbHVtbnNDaGVja2VkKCk6IGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgIHRoaXMuY29sQXJyYXkuZm9yRWFjaCgoY29sOiBDb2x1bW5PYmplY3QpID0+IHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiBjb2wuY2hlY2tlZDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIG9uRmlsdGVyQ2FzZVNlbnNpdGl2ZUNoYW5nZShldmVudDogTWF0Q2hlY2tib3hDaGFuZ2UpOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlckNhc2VTZW5zaXRpdmUgPSBldmVudC5jaGVja2VkO1xuICAgIC8vIHRyaWdnZXJPblNlYXJjaCBpZiB3ZSB3YW50IHRvIHRyaWdnZXIgc2VhcmNoIG9uIGVhY2ggY2hhbmdlXG4gIH1cblxuICBwdWJsaWMgZ2V0QWN0aXZlQ29sdW1ucygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29sQXJyYXkuZmlsdGVyKGNvbCA9PiBjb2wuY2hlY2tlZCkubWFwKGNvbCA9PiBjb2wuY29sdW1uKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBY3RpdmVDb2x1bW5zKGFyZzogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLmNvbEFycmF5LmZvckVhY2goKGM6IENvbHVtbk9iamVjdCkgPT4ge1xuICAgICAgYy5jaGVja2VkID0gYXJnLmluZGV4T2YoYy5jb2x1bW4pICE9PSAtMTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjaGVja0FjdGl2ZUNvbHVtbnMoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZ2V0QWN0aXZlQ29sdW1ucygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuQVZPSURfUVVFUllfV0lUSE9VVF9RVUlDS0ZJTFRFUl9DT0xVTU5TJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRyaWdnZXJPblNlYXJjaCgpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXJtID0gdGhpcy50ZXJtLnZhbHVlO1xuICAgIGlmICh0aGlzLmNoZWNrQWN0aXZlQ29sdW1ucygpICYmIFV0aWwuaXNEZWZpbmVkKHRlcm0pICYmIHRlcm0ubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5vblNlYXJjaC5lbWl0KHRlcm0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbk1lbnVDbG9zZWQoKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyT25TZWFyY2goKTtcbiAgfVxuXG4gIGdldCBmaWx0ZXJFeHByZXNzaW9uKCk6IEV4cHJlc3Npb24ge1xuICAgIGNvbnN0IHRlcm1WYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGVybVZhbHVlKSAmJiB0ZXJtVmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZmlsdGVyQ29scyA9IHRoaXMuZ2V0QWN0aXZlQ29sdW1ucygpO1xuICAgICAgaWYgKGZpbHRlckNvbHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkQXJyYXlFeHByZXNzaW9uTGlrZShmaWx0ZXJDb2xzLCB0ZXJtVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iXX0=