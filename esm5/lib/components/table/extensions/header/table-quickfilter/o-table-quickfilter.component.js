import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatMenu } from '@angular/material';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { O_INPUTS_OPTIONS } from '../../../../../config/app-config';
import { FilterExpressionUtils } from '../../../../../util/filter-expression.utils';
import { Util } from '../../../../../util/util';
import { OTableCellRendererServiceComponent, } from '../../../column/cell-renderer/service/o-table-cell-renderer-service.component';
import { OTableComponent } from '../../../o-table.component';
export var DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [];
export var DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = [
    'onChange'
];
var OTableQuickfilterComponent = (function () {
    function OTableQuickfilterComponent(injector, elRef, table) {
        this.injector = injector;
        this.elRef = elRef;
        this.table = table;
        this.onChange = new EventEmitter();
        this.formControl = new FormControl();
    }
    OTableQuickfilterComponent.prototype.ngOnInit = function () {
        this.table.registerQuickFilter(this);
        this.matMenu.xPosition = 'before';
    };
    OTableQuickfilterComponent.prototype.ngAfterViewInit = function () {
        this.initializeEventFilter();
        try {
            this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
        }
        catch (e) {
            this.oInputsOptions = {};
        }
        Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
    };
    OTableQuickfilterComponent.prototype.ngOnDestroy = function () {
        if (this.quickFilterObservable) {
            this.quickFilterObservable.unsubscribe();
        }
    };
    Object.defineProperty(OTableQuickfilterComponent.prototype, "oTableOptions", {
        get: function () {
            return this.table.oTableOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableQuickfilterComponent.prototype, "quickFilterColumns", {
        get: function () {
            return this.table.oTableOptions.columns.filter(function (oCol) {
                return oCol.searchable && oCol.visible;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableQuickfilterComponent.prototype, "filterExpression", {
        get: function () {
            var _this = this;
            var result = this.getUserFilter();
            if (!Util.isDefined(result) && Util.isDefined(this.value) && this.value.length > 0) {
                var expressions_1 = [];
                this.oTableOptions.columns
                    .filter(function (oCol) { return oCol.searching && oCol.visible && _this.isFilterableColumn(oCol); })
                    .forEach(function (oCol) {
                    if (oCol.filterExpressionFunction) {
                        expressions_1.push(oCol.filterExpressionFunction(oCol.attr, _this.value));
                    }
                    else if (oCol.renderer instanceof OTableCellRendererServiceComponent) {
                        var expr = oCol.renderer.getFilterExpression(_this.value);
                        if (expr) {
                            expressions_1.push(expr);
                        }
                    }
                    else {
                        expressions_1.push(FilterExpressionUtils.buildExpressionLike(oCol.attr, _this.value));
                    }
                });
                if (expressions_1.length > 0) {
                    result = expressions_1.reduce(function (a, b) { return FilterExpressionUtils.buildComplexExpression(a, b, FilterExpressionUtils.OP_OR); });
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    OTableQuickfilterComponent.prototype.getUserFilter = function () {
        var result;
        if (this.table.quickFilterCallback instanceof Function) {
            var userFilter = this.table.quickFilterCallback(this.value);
            if (Util.isDefined(userFilter) && FilterExpressionUtils.instanceofExpression(userFilter)) {
                result = userFilter;
            }
            else if (Util.isDefined(userFilter)) {
                result = FilterExpressionUtils.buildExpressionFromObject(userFilter);
            }
        }
        return result;
    };
    OTableQuickfilterComponent.prototype.initializeEventFilter = function () {
        var _this = this;
        if (this.filter && !this.quickFilterObservable) {
            this.quickFilterObservable = fromEvent(this.filter.nativeElement, 'keyup')
                .pipe(debounceTime(150))
                .pipe(distinctUntilChanged())
                .subscribe(function () {
                var filterVal = _this.filter.nativeElement.value;
                if (!_this.table.dataSource || _this.value === filterVal) {
                    return;
                }
                _this.setValue(filterVal);
                _this.onChange.emit(_this.value);
            });
            var filterValue = this.value || this.filter.nativeElement.value;
            this.formControl.setValue(filterValue);
            if (this.table.dataSource && filterValue && filterValue.length) {
                this.table.dataSource.quickFilter = filterValue;
            }
        }
    };
    OTableQuickfilterComponent.prototype.setValue = function (value, trigger) {
        if (trigger === void 0) { trigger = true; }
        this.value = value;
        if (trigger && this.table && this.table.dataSource) {
            this.table.dataSource.quickFilter = this.value;
        }
    };
    OTableQuickfilterComponent.prototype.onMenuClosed = function () {
        this.setValue(this.value);
        this.onChange.emit(this.value);
    };
    OTableQuickfilterComponent.prototype.isChecked = function (column) {
        return column.searching;
    };
    OTableQuickfilterComponent.prototype.onCheckboxChange = function (column, event) {
        column.searching = event.checked;
    };
    OTableQuickfilterComponent.prototype.showCaseSensitiveCheckbox = function () {
        return this.table.showCaseSensitiveCheckbox();
    };
    OTableQuickfilterComponent.prototype.areAllColumnsChecked = function () {
        var result = true;
        this.quickFilterColumns.forEach(function (col) {
            result = result && col.searching;
        });
        return result;
    };
    OTableQuickfilterComponent.prototype.onSelectAllChange = function (event) {
        this.quickFilterColumns.forEach(function (col) {
            col.searching = event.checked;
        });
    };
    OTableQuickfilterComponent.prototype.isFilterableColumn = function (column) {
        return !column.renderer || (column.type === 'string' ||
            column.type === 'translate' ||
            column.type === 'integer' ||
            column.type === 'real' ||
            column.type === 'percentage' ||
            column.type === 'currency' ||
            column.type === 'service');
    };
    OTableQuickfilterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-quickfilter',
                    template: "<div class=\"quickFilter\" fxLayout=\"row\">\n  <mat-form-field floatLabel=\"never\" appearance=\"legacy\">\n    <input matInput #filter placeholder=\"{{ 'TABLE.FILTER' | oTranslate}}\" [formControl]=\"formControl\" (click)=\"$event.stopPropagation()\">\n    <span class=\"icon-btn search-icon\" matPrefix fxFlexLayout=\"flex-end\" (menuClosed)=\"onMenuClosed()\"\n      [matMenuTriggerFor]=\"menu\" (click)=\"$event.stopPropagation()\">\n      <mat-icon svgIcon=\"ontimize:search\"></mat-icon>\n    </span>\n    <mat-menu #menu=\"matMenu\" class=\"o-table-quickfilter-menu\">\n      <div fxLayout=\"column\" class=\"checkbox-container\">\n\n        <mat-checkbox (click)=\"$event.stopPropagation()\" [checked]=\"areAllColumnsChecked()\"\n          (change)=\"onSelectAllChange($event)\">\n          {{ 'SELECT_ALL' | oTranslate}}\n        </mat-checkbox>\n        <mat-divider></mat-divider>\n\n        <ng-container *ngFor=\"let column of quickFilterColumns\">\n          <mat-checkbox (click)=\"$event.stopPropagation()\"  [checked]=\"isChecked(column)\" (change)=\"onCheckboxChange(column, $event)\">\n            {{ column.title | oTranslate }}\n          </mat-checkbox>\n        </ng-container>\n\n        <ng-container *ngIf=\"showCaseSensitiveCheckbox()\">\n          <mat-divider></mat-divider>\n          <mat-checkbox (click)=\"$event.stopPropagation()\"  [checked]=\"oTableOptions.filterCaseSensitive\"\n            (change)=\"oTableOptions.filterCaseSensitive = $event.checked\">\n            {{ 'TABLE.FILTER.CASE_SENSITIVE' | oTranslate}}\n          </mat-checkbox>\n        </ng-container>\n      </div>\n    </mat-menu>\n  </mat-form-field>\n</div>",
                    inputs: DEFAULT_INPUTS_O_TABLE_QUICKFILTER,
                    outputs: DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER,
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        '[class.o-table-quickfilter]': 'true',
                    },
                    styles: [".o-table-quickfilter .quickFilter{padding-right:24px}.o-table-quickfilter .quickFilter .mat-form-field-flex{align-items:flex-end}.o-table-quickfilter .search-icon{cursor:pointer}.o-table-quickfilter-menu .mat-divider{margin:8px 0}.o-table-quickfilter-menu .checkbox-container{padding:6px 12px}.o-table-quickfilter-menu .checkbox-container .mat-checkbox-layout{white-space:normal}.o-table-quickfilter-menu .checkbox-container .mat-checkbox-layout .mat-checkbox-ripple{display:none}"]
                }] }
    ];
    OTableQuickfilterComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] }
    ]; };
    OTableQuickfilterComponent.propDecorators = {
        filter: [{ type: ViewChild, args: ['filter', { static: false },] }],
        matMenu: [{ type: ViewChild, args: ['menu', { static: true },] }]
    };
    return OTableQuickfilterComponent;
}());
export { OTableQuickfilterComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1xdWlja2ZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtcXVpY2tmaWx0ZXIvby10YWJsZS1xdWlja2ZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFHUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQXFCLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxTQUFTLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUtwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEQsT0FBTyxFQUNMLGtDQUFrQyxHQUNuQyxNQUFNLCtFQUErRSxDQUFDO0FBRXZGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU3RCxNQUFNLENBQUMsSUFBTSxrQ0FBa0MsR0FBRyxFQUFFLENBQUM7QUFFckQsTUFBTSxDQUFDLElBQU0sbUNBQW1DLEdBQUc7SUFDakQsVUFBVTtDQUNYLENBQUM7QUFFRjtJQTJCRSxvQ0FDWSxRQUFrQixFQUNsQixLQUFpQixFQUMwQixLQUFzQjtRQUZq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QUFNLENBQUMsSUFBSSxLQUFLLE1BQU07WUFDdEIsTUFBTSxDQUFDLElBQUksS0FBSyxZQUFZO1lBQzVCLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVTtZQUMxQixNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FDMUIsQ0FBQztJQUNKLENBQUM7O2dCQS9MRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsOG9EQUFtRDtvQkFFbkQsTUFBTSxFQUFFLGtDQUFrQztvQkFDMUMsT0FBTyxFQUFFLG1DQUFtQztvQkFDNUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0osNkJBQTZCLEVBQUUsTUFBTTtxQkFDdEM7O2lCQUNGOzs7Z0JBekNDLFFBQVE7Z0JBSlIsVUFBVTtnQkEwQkgsZUFBZSx1QkFzQ25CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7Ozt5QkFoQjFDLFNBQVMsU0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOzBCQUdyQyxTQUFTLFNBQUMsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFnTHJDLGlDQUFDO0NBQUEsQUFqTUQsSUFpTUM7U0FyTFksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdENoZWNrYm94Q2hhbmdlLCBNYXRNZW51IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE9fSU5QVVRTX09QVElPTlMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9jb25maWcvYXBwLWNvbmZpZyc7XG5pbXBvcnQgeyBPVGFibGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9UYWJsZVF1aWNrZmlsdGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLXF1aWNrZmlsdGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IE9JbnB1dHNPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby1pbnB1dHMtb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IEZpbHRlckV4cHJlc3Npb25VdGlscyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvZmlsdGVyLWV4cHJlc3Npb24udXRpbHMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge1xuICBPVGFibGVDZWxsUmVuZGVyZXJTZXJ2aWNlQ29tcG9uZW50LFxufSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vY2VsbC1yZW5kZXJlci9zZXJ2aWNlL28tdGFibGUtY2VsbC1yZW5kZXJlci1zZXJ2aWNlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfUVVJQ0tGSUxURVIgPSBbXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX1RBQkxFX1FVSUNLRklMVEVSID0gW1xuICAnb25DaGFuZ2UnXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLXF1aWNrZmlsdGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtcXVpY2tmaWx0ZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLXF1aWNrZmlsdGVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19UQUJMRV9RVUlDS0ZJTFRFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfUVVJQ0tGSUxURVIsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLXF1aWNrZmlsdGVyXSc6ICd0cnVlJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVRdWlja2ZpbHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9UYWJsZVF1aWNrZmlsdGVyLCBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgQFZpZXdDaGlsZCgnZmlsdGVyJywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBmaWx0ZXI6IEVsZW1lbnRSZWY7XG5cbiAgQFZpZXdDaGlsZCgnbWVudScsIHsgc3RhdGljOiB0cnVlIH0pXG4gIHB1YmxpYyBtYXRNZW51OiBNYXRNZW51O1xuXG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuICBwdWJsaWMgb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgcHVibGljIGZvcm1Db250cm9sO1xuXG4gIHByb3RlY3RlZCBvSW5wdXRzT3B0aW9uczogT0lucHV0c09wdGlvbnM7XG4gIHByb3RlY3RlZCBxdWlja0ZpbHRlck9ic2VydmFibGU6IFN1YnNjcmlwdGlvbjtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHByb3RlY3RlZCB0YWJsZTogT1RhYmxlQ29tcG9uZW50XG4gICkge1xuICAgIHRoaXMuZm9ybUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnRhYmxlLnJlZ2lzdGVyUXVpY2tGaWx0ZXIodGhpcyk7XG4gICAgLy8gd29ya2Fyb3VuZCBiZWNhdXNlICd4LXBvc2l0aW9uPVwiYmVmb3JlXCInIHdhcyBub3Qgd29ya2luZyBpbiB0aGUgdGVtcGxhdGVcbiAgICB0aGlzLm1hdE1lbnUueFBvc2l0aW9uID0gJ2JlZm9yZSc7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUV2ZW50RmlsdGVyKCk7XG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5vSW5wdXRzT3B0aW9ucyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9fSU5QVVRTX09QVElPTlMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub0lucHV0c09wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgVXRpbC5wYXJzZU9JbnB1dHNPcHRpb25zKHRoaXMuZWxSZWYsIHRoaXMub0lucHV0c09wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnF1aWNrRmlsdGVyT2JzZXJ2YWJsZSkge1xuICAgICAgdGhpcy5xdWlja0ZpbHRlck9ic2VydmFibGUudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgb1RhYmxlT3B0aW9ucygpOiBPVGFibGVPcHRpb25zIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZS5vVGFibGVPcHRpb25zO1xuICB9XG5cbiAgZ2V0IHF1aWNrRmlsdGVyQ29sdW1ucygpOiBPQ29sdW1uW10ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnMuY29sdW1ucy5maWx0ZXIob0NvbCA9PiB7XG4gICAgICAvLyBDSEVDSzogV2h5IGNvbHVtbnMgd2l0aCByZW5kZXJlcnMgYXJlIG5vdCBmaWx0ZXJlZD9cbiAgICAgIC8vIHJldHVybiBvQ29sLnNlYXJjaGFibGUgJiYgb0NvbC52aXNpYmxlICYmICFVdGlsLmlzRGVmaW5lZChvQ29sLnJlbmRlcmVyKTtcbiAgICAgIHJldHVybiBvQ29sLnNlYXJjaGFibGUgJiYgb0NvbC52aXNpYmxlO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGZpbHRlckV4cHJlc3Npb24oKTogRXhwcmVzc2lvbiB7XG4gICAgbGV0IHJlc3VsdDogRXhwcmVzc2lvbiA9IHRoaXMuZ2V0VXNlckZpbHRlcigpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQocmVzdWx0KSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnZhbHVlKSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGV4cHJlc3Npb25zOiBFeHByZXNzaW9uW10gPSBbXTtcbiAgICAgIHRoaXMub1RhYmxlT3B0aW9ucy5jb2x1bW5zXG4gICAgICAgIC5maWx0ZXIoKG9Db2w6IE9Db2x1bW4pID0+IG9Db2wuc2VhcmNoaW5nICYmIG9Db2wudmlzaWJsZSAmJiB0aGlzLmlzRmlsdGVyYWJsZUNvbHVtbihvQ29sKSlcbiAgICAgICAgLmZvckVhY2goKG9Db2w6IE9Db2x1bW4pID0+IHtcbiAgICAgICAgICAvLyBDSEVDSzogV2h5IGNvbHVtbnMgd2l0aCByZW5kZXJlcnMgYXJlIG5vdCBmaWx0ZXJlZD9cbiAgICAgICAgICAvLyBpZiAoIW9Db2wucmVuZGVyZXIpIHtcbiAgICAgICAgICBpZiAob0NvbC5maWx0ZXJFeHByZXNzaW9uRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2gob0NvbC5maWx0ZXJFeHByZXNzaW9uRnVuY3Rpb24ob0NvbC5hdHRyLCB0aGlzLnZhbHVlKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChvQ29sLnJlbmRlcmVyIGluc3RhbmNlb2YgT1RhYmxlQ2VsbFJlbmRlcmVyU2VydmljZUNvbXBvbmVudCkge1xuICAgICAgICAgICAgLy8gRmlsdGVyIGNvbHVtbiB3aXRoIHNlcnZpY2UgcmVuZGVyZXIuIExvb2sgZm9yIHRoZSB2YWx1ZSBpbiB0aGUgcmVuZGVyZXIgY2FjaGVcbiAgICAgICAgICAgIGNvbnN0IGV4cHIgPSBvQ29sLnJlbmRlcmVyLmdldEZpbHRlckV4cHJlc3Npb24odGhpcy52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoZXhwcikge1xuICAgICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKGV4cHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gIGVsc2UgaWYgKFNRTFR5cGVzLmlzTnVtZXJpY1NRTFR5cGUob0NvbC5zcWxUeXBlKSkge1xuICAgICAgICAgICAgLy8gICAvLyBGaWx0ZXIgbnVtZXJpYyBjb2x1bW5cbiAgICAgICAgICAgIC8vICAgY29uc3QgbnVtVmFsdWU6IGFueSA9IFNRTFR5cGVzLnBhcnNlVXNpbmdTUUxUeXBlKHRoaXMudmFsdWUsIFNRTFR5cGVzLmdldFNRTFR5cGVLZXkob0NvbC5zcWxUeXBlKSk7XG4gICAgICAgICAgICAvLyAgIGlmIChudW1WYWx1ZSkge1xuICAgICAgICAgICAgLy8gICAgIGV4cHJlc3Npb25zLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkVxdWFscyhvQ29sLmF0dHIsIG51bVZhbHVlKSk7XG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRGVmYXVsdFxuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uTGlrZShvQ29sLmF0dHIsIHRoaXMudmFsdWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgaWYgKGV4cHJlc3Npb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ID0gZXhwcmVzc2lvbnMucmVkdWNlKChhLCBiKSA9PiBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihhLCBiLCBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuT1BfT1IpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRVc2VyRmlsdGVyKCk6IEV4cHJlc3Npb24ge1xuICAgIGxldCByZXN1bHQ6IEV4cHJlc3Npb247XG4gICAgaWYgKHRoaXMudGFibGUucXVpY2tGaWx0ZXJDYWxsYmFjayBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICBjb25zdCB1c2VyRmlsdGVyID0gdGhpcy50YWJsZS5xdWlja0ZpbHRlckNhbGxiYWNrKHRoaXMudmFsdWUpO1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHVzZXJGaWx0ZXIpICYmIEZpbHRlckV4cHJlc3Npb25VdGlscy5pbnN0YW5jZW9mRXhwcmVzc2lvbih1c2VyRmlsdGVyKSkge1xuICAgICAgICByZXN1bHQgPSAodXNlckZpbHRlciBhcyBFeHByZXNzaW9uKTtcbiAgICAgIH0gZWxzZSBpZiAoVXRpbC5pc0RlZmluZWQodXNlckZpbHRlcikpIHtcbiAgICAgICAgcmVzdWx0ID0gRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkZyb21PYmplY3QodXNlckZpbHRlcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZUV2ZW50RmlsdGVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZpbHRlciAmJiAhdGhpcy5xdWlja0ZpbHRlck9ic2VydmFibGUpIHtcbiAgICAgIHRoaXMucXVpY2tGaWx0ZXJPYnNlcnZhYmxlID0gZnJvbUV2ZW50KHRoaXMuZmlsdGVyLm5hdGl2ZUVsZW1lbnQsICdrZXl1cCcpXG4gICAgICAgIC5waXBlKGRlYm91bmNlVGltZSgxNTApKVxuICAgICAgICAucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBjb25zdCBmaWx0ZXJWYWwgPSB0aGlzLmZpbHRlci5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICAgIGlmICghdGhpcy50YWJsZS5kYXRhU291cmNlIHx8IHRoaXMudmFsdWUgPT09IGZpbHRlclZhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFZhbHVlKGZpbHRlclZhbCk7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgLy8gaWYgZXhpc3RzIGZpbHRlciB2YWx1ZSBpbiBzdG9yYWdlIHRoZW4gZmlsdGVyIHJlc3VsdCB0YWJsZVxuICAgICAgY29uc3QgZmlsdGVyVmFsdWUgPSB0aGlzLnZhbHVlIHx8IHRoaXMuZmlsdGVyLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAvLyB0aGlzLmZpbHRlci5uYXRpdmVFbGVtZW50LnZhbHVlID0gZmlsdGVyVmFsdWU7XG4gICAgICB0aGlzLmZvcm1Db250cm9sLnNldFZhbHVlKGZpbHRlclZhbHVlKTtcbiAgICAgIGlmICh0aGlzLnRhYmxlLmRhdGFTb3VyY2UgJiYgZmlsdGVyVmFsdWUgJiYgZmlsdGVyVmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMudGFibGUuZGF0YVNvdXJjZS5xdWlja0ZpbHRlciA9IGZpbHRlclZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRWYWx1ZSh2YWx1ZTogYW55LCB0cmlnZ2VyOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAodHJpZ2dlciAmJiB0aGlzLnRhYmxlICYmIHRoaXMudGFibGUuZGF0YVNvdXJjZSkge1xuICAgICAgdGhpcy50YWJsZS5kYXRhU291cmNlLnF1aWNrRmlsdGVyID0gdGhpcy52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25NZW51Q2xvc2VkKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSk7XG4gICAgdGhpcy5vbkNoYW5nZS5lbWl0KHRoaXMudmFsdWUpO1xuICB9XG5cbiAgcHVibGljIGlzQ2hlY2tlZChjb2x1bW46IE9Db2x1bW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY29sdW1uLnNlYXJjaGluZztcbiAgfVxuXG4gIHB1YmxpYyBvbkNoZWNrYm94Q2hhbmdlKGNvbHVtbjogT0NvbHVtbiwgZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlKTogdm9pZCB7XG4gICAgY29sdW1uLnNlYXJjaGluZyA9IGV2ZW50LmNoZWNrZWQ7XG4gIH1cblxuICBwdWJsaWMgc2hvd0Nhc2VTZW5zaXRpdmVDaGVja2JveCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZS5zaG93Q2FzZVNlbnNpdGl2ZUNoZWNrYm94KCk7XG4gIH1cblxuICBwdWJsaWMgYXJlQWxsQ29sdW1uc0NoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9IHRydWU7XG4gICAgdGhpcy5xdWlja0ZpbHRlckNvbHVtbnMuZm9yRWFjaCgoY29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICByZXN1bHQgPSByZXN1bHQgJiYgY29sLnNlYXJjaGluZztcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIG9uU2VsZWN0QWxsQ2hhbmdlKGV2ZW50OiBNYXRDaGVja2JveENoYW5nZSk6IHZvaWQge1xuICAgIHRoaXMucXVpY2tGaWx0ZXJDb2x1bW5zLmZvckVhY2goKGNvbDogT0NvbHVtbikgPT4ge1xuICAgICAgY29sLnNlYXJjaGluZyA9IGV2ZW50LmNoZWNrZWQ7XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaXNGaWx0ZXJhYmxlQ29sdW1uKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhY29sdW1uLnJlbmRlcmVyIHx8IChcbiAgICAgIGNvbHVtbi50eXBlID09PSAnc3RyaW5nJyB8fFxuICAgICAgY29sdW1uLnR5cGUgPT09ICd0cmFuc2xhdGUnIHx8XG4gICAgICBjb2x1bW4udHlwZSA9PT0gJ2ludGVnZXInIHx8XG4gICAgICBjb2x1bW4udHlwZSA9PT0gJ3JlYWwnIHx8XG4gICAgICBjb2x1bW4udHlwZSA9PT0gJ3BlcmNlbnRhZ2UnIHx8XG4gICAgICBjb2x1bW4udHlwZSA9PT0gJ2N1cnJlbmN5JyB8fFxuICAgICAgY29sdW1uLnR5cGUgPT09ICdzZXJ2aWNlJ1xuICAgICk7XG4gIH1cblxufVxuIl19