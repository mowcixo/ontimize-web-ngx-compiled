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
export const DEFAULT_INPUTS_O_TABLE_QUICKFILTER = [];
export const DEFAULT_OUTPUTS_O_TABLE_QUICKFILTER = [
    'onChange'
];
export class OTableQuickfilterComponent {
    constructor(injector, elRef, table) {
        this.injector = injector;
        this.elRef = elRef;
        this.table = table;
        this.onChange = new EventEmitter();
        this.formControl = new FormControl();
    }
    ngOnInit() {
        this.table.registerQuickFilter(this);
        this.matMenu.xPosition = 'before';
    }
    ngAfterViewInit() {
        this.initializeEventFilter();
        try {
            this.oInputsOptions = this.injector.get(O_INPUTS_OPTIONS);
        }
        catch (e) {
            this.oInputsOptions = {};
        }
        Util.parseOInputsOptions(this.elRef, this.oInputsOptions);
    }
    ngOnDestroy() {
        if (this.quickFilterObservable) {
            this.quickFilterObservable.unsubscribe();
        }
    }
    get oTableOptions() {
        return this.table.oTableOptions;
    }
    get quickFilterColumns() {
        return this.table.oTableOptions.columns.filter(oCol => {
            return oCol.searchable && oCol.visible;
        });
    }
    get filterExpression() {
        let result = this.getUserFilter();
        if (!Util.isDefined(result) && Util.isDefined(this.value) && this.value.length > 0) {
            const expressions = [];
            this.oTableOptions.columns
                .filter((oCol) => oCol.searching && oCol.visible && this.isFilterableColumn(oCol))
                .forEach((oCol) => {
                if (oCol.filterExpressionFunction) {
                    expressions.push(oCol.filterExpressionFunction(oCol.attr, this.value));
                }
                else if (oCol.renderer instanceof OTableCellRendererServiceComponent) {
                    const expr = oCol.renderer.getFilterExpression(this.value);
                    if (expr) {
                        expressions.push(expr);
                    }
                }
                else {
                    expressions.push(FilterExpressionUtils.buildExpressionLike(oCol.attr, this.value));
                }
            });
            if (expressions.length > 0) {
                result = expressions.reduce((a, b) => FilterExpressionUtils.buildComplexExpression(a, b, FilterExpressionUtils.OP_OR));
            }
        }
        return result;
    }
    getUserFilter() {
        let result;
        if (this.table.quickFilterCallback instanceof Function) {
            const userFilter = this.table.quickFilterCallback(this.value);
            if (Util.isDefined(userFilter) && FilterExpressionUtils.instanceofExpression(userFilter)) {
                result = userFilter;
            }
            else if (Util.isDefined(userFilter)) {
                result = FilterExpressionUtils.buildExpressionFromObject(userFilter);
            }
        }
        return result;
    }
    initializeEventFilter() {
        if (this.filter && !this.quickFilterObservable) {
            this.quickFilterObservable = fromEvent(this.filter.nativeElement, 'keyup')
                .pipe(debounceTime(150))
                .pipe(distinctUntilChanged())
                .subscribe(() => {
                const filterVal = this.filter.nativeElement.value;
                if (!this.table.dataSource || this.value === filterVal) {
                    return;
                }
                this.setValue(filterVal);
                this.onChange.emit(this.value);
            });
            const filterValue = this.value || this.filter.nativeElement.value;
            this.formControl.setValue(filterValue);
            if (this.table.dataSource && filterValue && filterValue.length) {
                this.table.dataSource.quickFilter = filterValue;
            }
        }
    }
    setValue(value, trigger = true) {
        this.value = value;
        if (trigger && this.table && this.table.dataSource) {
            this.table.dataSource.quickFilter = this.value;
        }
    }
    onMenuClosed() {
        this.setValue(this.value);
        this.onChange.emit(this.value);
    }
    isChecked(column) {
        return column.searching;
    }
    onCheckboxChange(column, event) {
        column.searching = event.checked;
    }
    showCaseSensitiveCheckbox() {
        return this.table.showCaseSensitiveCheckbox();
    }
    areAllColumnsChecked() {
        let result = true;
        this.quickFilterColumns.forEach((col) => {
            result = result && col.searching;
        });
        return result;
    }
    onSelectAllChange(event) {
        this.quickFilterColumns.forEach((col) => {
            col.searching = event.checked;
        });
    }
    isFilterableColumn(column) {
        return !column.renderer || (column.type === 'string' ||
            column.type === 'translate' ||
            column.type === 'integer' ||
            column.type === 'real' ||
            column.type === 'percentage' ||
            column.type === 'currency' ||
            column.type === 'service');
    }
}
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
OTableQuickfilterComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
OTableQuickfilterComponent.propDecorators = {
    filter: [{ type: ViewChild, args: ['filter', { static: false },] }],
    matMenu: [{ type: ViewChild, args: ['menu', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1xdWlja2ZpbHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9oZWFkZXIvdGFibGUtcXVpY2tmaWx0ZXIvby10YWJsZS1xdWlja2ZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFHUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQXFCLE9BQU8sRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxTQUFTLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUtwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEQsT0FBTyxFQUNMLGtDQUFrQyxHQUNuQyxNQUFNLCtFQUErRSxDQUFDO0FBRXZGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSxrQ0FBa0MsR0FBRyxFQUFFLENBQUM7QUFFckQsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQUc7SUFDakQsVUFBVTtDQUNYLENBQUM7QUFjRixNQUFNLE9BQU8sMEJBQTBCO0lBZXJDLFlBQ1ksUUFBa0IsRUFDbEIsS0FBaUIs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QUM7SUFDSixDQUFDOzs7WUEvTEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLDhvREFBbUQ7Z0JBRW5ELE1BQU0sRUFBRSxrQ0FBa0M7Z0JBQzFDLE9BQU8sRUFBRSxtQ0FBbUM7Z0JBQzVDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLDZCQUE2QixFQUFFLE1BQU07aUJBQ3RDOzthQUNGOzs7WUF6Q0MsUUFBUTtZQUpSLFVBQVU7WUEwQkgsZUFBZSx1QkFzQ25CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDOzs7cUJBaEIxQyxTQUFTLFNBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtzQkFHckMsU0FBUyxTQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0Q2hlY2tib3hDaGFuZ2UsIE1hdE1lbnUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgT19JTlBVVFNfT1BUSU9OUyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IE9UYWJsZU9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT1RhYmxlUXVpY2tmaWx0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtcXVpY2tmaWx0ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IEV4cHJlc3Npb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9leHByZXNzaW9uLnR5cGUnO1xuaW1wb3J0IHsgT0lucHV0c09wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLWlucHV0cy1vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgRmlsdGVyRXhwcmVzc2lvblV0aWxzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9maWx0ZXItZXhwcmVzc2lvbi51dGlscyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7XG4gIE9UYWJsZUNlbGxSZW5kZXJlclNlcnZpY2VDb21wb25lbnQsXG59IGZyb20gJy4uLy4uLy4uL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3NlcnZpY2Uvby10YWJsZS1jZWxsLXJlbmRlcmVyLXNlcnZpY2UuY29tcG9uZW50JztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9RVUlDS0ZJTFRFUiA9IFtdO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfUVVJQ0tGSUxURVIgPSBbXG4gICdvbkNoYW5nZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtcXVpY2tmaWx0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1xdWlja2ZpbHRlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtcXVpY2tmaWx0ZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX1FVSUNLRklMVEVSLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19UQUJMRV9RVUlDS0ZJTFRFUixcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tdGFibGUtcXVpY2tmaWx0ZXJdJzogJ3RydWUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZVF1aWNrZmlsdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT1RhYmxlUXVpY2tmaWx0ZXIsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBAVmlld0NoaWxkKCdmaWx0ZXInLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIGZpbHRlcjogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkKCdtZW51JywgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHVibGljIG1hdE1lbnU6IE1hdE1lbnU7XG5cbiAgcHVibGljIHZhbHVlOiBzdHJpbmc7XG4gIHB1YmxpYyBvbkNoYW5nZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICBwdWJsaWMgZm9ybUNvbnRyb2w7XG5cbiAgcHJvdGVjdGVkIG9JbnB1dHNPcHRpb25zOiBPSW5wdXRzT3B0aW9ucztcbiAgcHJvdGVjdGVkIHF1aWNrRmlsdGVyT2JzZXJ2YWJsZTogU3Vic2NyaXB0aW9uO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHJvdGVjdGVkIHRhYmxlOiBPVGFibGVDb21wb25lbnRcbiAgKSB7XG4gICAgdGhpcy5mb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMudGFibGUucmVnaXN0ZXJRdWlja0ZpbHRlcih0aGlzKTtcbiAgICAvLyB3b3JrYXJvdW5kIGJlY2F1c2UgJ3gtcG9zaXRpb249XCJiZWZvcmVcIicgd2FzIG5vdCB3b3JraW5nIGluIHRoZSB0ZW1wbGF0ZVxuICAgIHRoaXMubWF0TWVudS54UG9zaXRpb24gPSAnYmVmb3JlJztcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplRXZlbnRGaWx0ZXIoKTtcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLm9JbnB1dHNPcHRpb25zID0gdGhpcy5pbmplY3Rvci5nZXQoT19JTlBVVFNfT1BUSU9OUyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5vSW5wdXRzT3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBVdGlsLnBhcnNlT0lucHV0c09wdGlvbnModGhpcy5lbFJlZiwgdGhpcy5vSW5wdXRzT3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucXVpY2tGaWx0ZXJPYnNlcnZhYmxlKSB7XG4gICAgICB0aGlzLnF1aWNrRmlsdGVyT2JzZXJ2YWJsZS51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBvVGFibGVPcHRpb25zKCk6IE9UYWJsZU9wdGlvbnMge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLm9UYWJsZU9wdGlvbnM7XG4gIH1cblxuICBnZXQgcXVpY2tGaWx0ZXJDb2x1bW5zKCk6IE9Db2x1bW5bXSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGUub1RhYmxlT3B0aW9ucy5jb2x1bW5zLmZpbHRlcihvQ29sID0+IHtcbiAgICAgIC8vIENIRUNLOiBXaHkgY29sdW1ucyB3aXRoIHJlbmRlcmVycyBhcmUgbm90IGZpbHRlcmVkP1xuICAgICAgLy8gcmV0dXJuIG9Db2wuc2VhcmNoYWJsZSAmJiBvQ29sLnZpc2libGUgJiYgIVV0aWwuaXNEZWZpbmVkKG9Db2wucmVuZGVyZXIpO1xuICAgICAgcmV0dXJuIG9Db2wuc2VhcmNoYWJsZSAmJiBvQ29sLnZpc2libGU7XG4gICAgfSk7XG4gIH1cblxuICBnZXQgZmlsdGVyRXhwcmVzc2lvbigpOiBFeHByZXNzaW9uIHtcbiAgICBsZXQgcmVzdWx0OiBFeHByZXNzaW9uID0gdGhpcy5nZXRVc2VyRmlsdGVyKCk7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChyZXN1bHQpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMudmFsdWUpICYmIHRoaXMudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZXhwcmVzc2lvbnM6IEV4cHJlc3Npb25bXSA9IFtdO1xuICAgICAgdGhpcy5vVGFibGVPcHRpb25zLmNvbHVtbnNcbiAgICAgICAgLmZpbHRlcigob0NvbDogT0NvbHVtbikgPT4gb0NvbC5zZWFyY2hpbmcgJiYgb0NvbC52aXNpYmxlICYmIHRoaXMuaXNGaWx0ZXJhYmxlQ29sdW1uKG9Db2wpKVxuICAgICAgICAuZm9yRWFjaCgob0NvbDogT0NvbHVtbikgPT4ge1xuICAgICAgICAgIC8vIENIRUNLOiBXaHkgY29sdW1ucyB3aXRoIHJlbmRlcmVycyBhcmUgbm90IGZpbHRlcmVkP1xuICAgICAgICAgIC8vIGlmICghb0NvbC5yZW5kZXJlcikge1xuICAgICAgICAgIGlmIChvQ29sLmZpbHRlckV4cHJlc3Npb25GdW5jdGlvbikge1xuICAgICAgICAgICAgZXhwcmVzc2lvbnMucHVzaChvQ29sLmZpbHRlckV4cHJlc3Npb25GdW5jdGlvbihvQ29sLmF0dHIsIHRoaXMudmFsdWUpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9Db2wucmVuZGVyZXIgaW5zdGFuY2VvZiBPVGFibGVDZWxsUmVuZGVyZXJTZXJ2aWNlQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAvLyBGaWx0ZXIgY29sdW1uIHdpdGggc2VydmljZSByZW5kZXJlci4gTG9vayBmb3IgdGhlIHZhbHVlIGluIHRoZSByZW5kZXJlciBjYWNoZVxuICAgICAgICAgICAgY29uc3QgZXhwciA9IG9Db2wucmVuZGVyZXIuZ2V0RmlsdGVyRXhwcmVzc2lvbih0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIGlmIChleHByKSB7XG4gICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXhwcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyAgZWxzZSBpZiAoU1FMVHlwZXMuaXNOdW1lcmljU1FMVHlwZShvQ29sLnNxbFR5cGUpKSB7XG4gICAgICAgICAgICAvLyAgIC8vIEZpbHRlciBudW1lcmljIGNvbHVtblxuICAgICAgICAgICAgLy8gICBjb25zdCBudW1WYWx1ZTogYW55ID0gU1FMVHlwZXMucGFyc2VVc2luZ1NRTFR5cGUodGhpcy52YWx1ZSwgU1FMVHlwZXMuZ2V0U1FMVHlwZUtleShvQ29sLnNxbFR5cGUpKTtcbiAgICAgICAgICAgIC8vICAgaWYgKG51bVZhbHVlKSB7XG4gICAgICAgICAgICAvLyAgICAgZXhwcmVzc2lvbnMucHVzaChGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uRXF1YWxzKG9Db2wuYXR0ciwgbnVtVmFsdWUpKTtcbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBEZWZhdWx0XG4gICAgICAgICAgICBleHByZXNzaW9ucy5wdXNoKEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25MaWtlKG9Db2wuYXR0ciwgdGhpcy52YWx1ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICByZXN1bHQgPSBleHByZXNzaW9ucy5yZWR1Y2UoKGEsIGIpID0+IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZENvbXBsZXhFeHByZXNzaW9uKGEsIGIsIEZpbHRlckV4cHJlc3Npb25VdGlscy5PUF9PUikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIGdldFVzZXJGaWx0ZXIoKTogRXhwcmVzc2lvbiB7XG4gICAgbGV0IHJlc3VsdDogRXhwcmVzc2lvbjtcbiAgICBpZiAodGhpcy50YWJsZS5xdWlja0ZpbHRlckNhbGxiYWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIGNvbnN0IHVzZXJGaWx0ZXIgPSB0aGlzLnRhYmxlLnF1aWNrRmlsdGVyQ2FsbGJhY2sodGhpcy52YWx1ZSk7XG4gICAgICBpZiAoVXRpbC5pc0RlZmluZWQodXNlckZpbHRlcikgJiYgRmlsdGVyRXhwcmVzc2lvblV0aWxzLmluc3RhbmNlb2ZFeHByZXNzaW9uKHVzZXJGaWx0ZXIpKSB7XG4gICAgICAgIHJlc3VsdCA9ICh1c2VyRmlsdGVyIGFzIEV4cHJlc3Npb24pO1xuICAgICAgfSBlbHNlIGlmIChVdGlsLmlzRGVmaW5lZCh1c2VyRmlsdGVyKSkge1xuICAgICAgICByZXN1bHQgPSBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRFeHByZXNzaW9uRnJvbU9iamVjdCh1c2VyRmlsdGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplRXZlbnRGaWx0ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZmlsdGVyICYmICF0aGlzLnF1aWNrRmlsdGVyT2JzZXJ2YWJsZSkge1xuICAgICAgdGhpcy5xdWlja0ZpbHRlck9ic2VydmFibGUgPSBmcm9tRXZlbnQodGhpcy5maWx0ZXIubmF0aXZlRWxlbWVudCwgJ2tleXVwJylcbiAgICAgICAgLnBpcGUoZGVib3VuY2VUaW1lKDE1MCkpXG4gICAgICAgIC5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbHRlclZhbCA9IHRoaXMuZmlsdGVyLm5hdGl2ZUVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgaWYgKCF0aGlzLnRhYmxlLmRhdGFTb3VyY2UgfHwgdGhpcy52YWx1ZSA9PT0gZmlsdGVyVmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0VmFsdWUoZmlsdGVyVmFsKTtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAvLyBpZiBleGlzdHMgZmlsdGVyIHZhbHVlIGluIHN0b3JhZ2UgdGhlbiBmaWx0ZXIgcmVzdWx0IHRhYmxlXG4gICAgICBjb25zdCBmaWx0ZXJWYWx1ZSA9IHRoaXMudmFsdWUgfHwgdGhpcy5maWx0ZXIubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgIC8vIHRoaXMuZmlsdGVyLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBmaWx0ZXJWYWx1ZTtcbiAgICAgIHRoaXMuZm9ybUNvbnRyb2wuc2V0VmFsdWUoZmlsdGVyVmFsdWUpO1xuICAgICAgaWYgKHRoaXMudGFibGUuZGF0YVNvdXJjZSAmJiBmaWx0ZXJWYWx1ZSAmJiBmaWx0ZXJWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy50YWJsZS5kYXRhU291cmNlLnF1aWNrRmlsdGVyID0gZmlsdGVyVmFsdWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldFZhbHVlKHZhbHVlOiBhbnksIHRyaWdnZXI6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0cmlnZ2VyICYmIHRoaXMudGFibGUgJiYgdGhpcy50YWJsZS5kYXRhU291cmNlKSB7XG4gICAgICB0aGlzLnRhYmxlLmRhdGFTb3VyY2UucXVpY2tGaWx0ZXIgPSB0aGlzLnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbk1lbnVDbG9zZWQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQodGhpcy52YWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgaXNDaGVja2VkKGNvbHVtbjogT0NvbHVtbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjb2x1bW4uc2VhcmNoaW5nO1xuICB9XG5cbiAgcHVibGljIG9uQ2hlY2tib3hDaGFuZ2UoY29sdW1uOiBPQ29sdW1uLCBldmVudDogTWF0Q2hlY2tib3hDaGFuZ2UpOiB2b2lkIHtcbiAgICBjb2x1bW4uc2VhcmNoaW5nID0gZXZlbnQuY2hlY2tlZDtcbiAgfVxuXG4gIHB1YmxpYyBzaG93Q2FzZVNlbnNpdGl2ZUNoZWNrYm94KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLnNob3dDYXNlU2Vuc2l0aXZlQ2hlY2tib3goKTtcbiAgfVxuXG4gIHB1YmxpYyBhcmVBbGxDb2x1bW5zQ2hlY2tlZCgpOiBib29sZWFuIHtcbiAgICBsZXQgcmVzdWx0OiBib29sZWFuID0gdHJ1ZTtcbiAgICB0aGlzLnF1aWNrRmlsdGVyQ29sdW1ucy5mb3JFYWNoKChjb2w6IE9Db2x1bW4pID0+IHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCAmJiBjb2wuc2VhcmNoaW5nO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgb25TZWxlY3RBbGxDaGFuZ2UoZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlKTogdm9pZCB7XG4gICAgdGhpcy5xdWlja0ZpbHRlckNvbHVtbnMuZm9yRWFjaCgoY29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICBjb2wuc2VhcmNoaW5nID0gZXZlbnQuY2hlY2tlZDtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBpc0ZpbHRlcmFibGVDb2x1bW4oY29sdW1uOiBPQ29sdW1uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFjb2x1bW4ucmVuZGVyZXIgfHwgKFxuICAgICAgY29sdW1uLnR5cGUgPT09ICdzdHJpbmcnIHx8XG4gICAgICBjb2x1bW4udHlwZSA9PT0gJ3RyYW5zbGF0ZScgfHxcbiAgICAgIGNvbHVtbi50eXBlID09PSAnaW50ZWdlcicgfHxcbiAgICAgIGNvbHVtbi50eXBlID09PSAncmVhbCcgfHxcbiAgICAgIGNvbHVtbi50eXBlID09PSAncGVyY2VudGFnZScgfHxcbiAgICAgIGNvbHVtbi50eXBlID09PSAnY3VycmVuY3knIHx8XG4gICAgICBjb2x1bW4udHlwZSA9PT0gJ3NlcnZpY2UnXG4gICAgKTtcbiAgfVxuXG59XG4iXX0=