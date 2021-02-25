import * as tslib_1 from "tslib";
import { Component, EventEmitter, forwardRef, Inject, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { OFormComponent } from '../../components/form/o-form.component';
import { InputConverter } from '../../decorators/input-converter';
import { Codes } from '../../util/codes';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { Util } from '../../util/util';
export var DEFAULT_INPUTS_O_FILTER_BUILDER = [
    'filters',
    'targetCmp: target',
    'expressionBuilder: expression-builder',
    'queryOnChange: query-on-change',
    'queryOnChangeDelay: query-on-change-delay'
];
export var DEFAULT_OUTPUTS_O_FILTER_BUILDER = [
    'onFilter',
    'onClear'
];
var OFilterBuilderComponent = (function () {
    function OFilterBuilderComponent(form, injector) {
        this.form = form;
        this.onFilter = new EventEmitter();
        this.onClear = new EventEmitter();
        this.queryOnChange = false;
        this.queryOnChangeDelay = 0;
        this.filterComponents = [];
        this.subscriptions = new Subscription();
    }
    OFilterBuilderComponent.prototype.ngOnInit = function () {
        this.initialize();
    };
    OFilterBuilderComponent.prototype.ngAfterViewInit = function () {
        this.initializeListeners();
    };
    OFilterBuilderComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    };
    OFilterBuilderComponent.prototype.initialize = function () {
        var _this = this;
        if (this.filters) {
            var filterArray = Util.parseArray(this.filters);
            filterArray.forEach(function (filter) {
                var filterElms = filter.split(Codes.COLUMNS_ALIAS_SEPARATOR);
                _this.filterComponents.push({
                    targetAttr: filterElms[0],
                    formComponentAttr: filterElms[1] ? filterElms[1] : filterElms[0]
                });
            });
        }
        if (Util.isDefined(this.targetCmp)) {
            this.targetCmp.setFilterBuilder(this);
        }
    };
    OFilterBuilderComponent.prototype.initializeListeners = function () {
        var _this = this;
        if (this.queryOnChange) {
            this.filterComponents.forEach(function (filterComponent) {
                var formComponent = _this.form.getComponents()[filterComponent.formComponentAttr];
                if (formComponent) {
                    _this.subscriptions.add(formComponent.getFormControl().valueChanges
                        .pipe(debounceTime(_this.queryOnChangeDelay))
                        .subscribe(function (a) { return _this.triggerReload(); }));
                }
            });
        }
    };
    OFilterBuilderComponent.prototype.getExpression = function () {
        var formComponents = this.form.getComponents();
        var params = [];
        this.filterComponents.forEach(function (filterComponent) {
            var formComponent = formComponents[filterComponent.formComponentAttr];
            var value = formComponent.getValue();
            params.push({
                attr: filterComponent.targetAttr,
                value: value
            });
        });
        if (this.expressionBuilder) {
            return this.expressionBuilder(params);
        }
        var expressions = [];
        params.forEach(function (elem) {
            if (Util.isDefined(elem.value)) {
                expressions.push(FilterExpressionUtils.buildExpressionEquals(elem.attr, elem.value));
            }
        });
        return expressions.length ? expressions.reduce(function (fe1, fe2) { return FilterExpressionUtils.buildComplexExpression(fe1, fe2, FilterExpressionUtils.OP_OR); }) : undefined;
    };
    OFilterBuilderComponent.prototype.getBasicExpression = function () {
        return FilterExpressionUtils.buildBasicExpression(this.getExpression());
    };
    OFilterBuilderComponent.prototype.getTargetComponent = function () {
        return this.targetCmp;
    };
    OFilterBuilderComponent.prototype.triggerReload = function () {
        if (!this.targetCmp) {
            return;
        }
        if (this.targetCmp.pageable) {
            this.targetCmp.reloadPaginatedDataFromStart();
        }
        else {
            this.targetCmp.reloadData();
        }
        this.onFilter.emit();
    };
    OFilterBuilderComponent.prototype.clearFilter = function () {
        var formComponents = this.form.getComponents();
        this.getFilterAttrs().forEach(function (attr) {
            formComponents[attr].setValue(void 0);
        });
        this.onClear.emit();
    };
    OFilterBuilderComponent.prototype.getFilterAttrs = function () {
        return this.filterComponents.map(function (elem) { return elem.formComponentAttr; });
    };
    OFilterBuilderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-filter-builder',
                    template: "",
                    inputs: DEFAULT_INPUTS_O_FILTER_BUILDER,
                    outputs: DEFAULT_OUTPUTS_O_FILTER_BUILDER
                }] }
    ];
    OFilterBuilderComponent.ctorParameters = function () { return [
        { type: OFormComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OFormComponent; }),] }] },
        { type: Injector }
    ]; };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OFilterBuilderComponent.prototype, "queryOnChange", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OFilterBuilderComponent.prototype, "queryOnChangeDelay", void 0);
    return OFilterBuilderComponent;
}());
export { OFilterBuilderComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWx0ZXItYnVpbGRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZmlsdGVyLWJ1aWxkZXIvby1maWx0ZXItYnVpbGRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBcUIsTUFBTSxlQUFlLENBQUM7QUFDeEgsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBRXhFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUtsRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sb0NBQW9DLENBQUM7QUFDM0UsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxJQUFNLCtCQUErQixHQUFHO0lBRTdDLFNBQVM7SUFHVCxtQkFBbUI7SUFHbkIsdUNBQXVDO0lBR3ZDLGdDQUFnQztJQUdoQywyQ0FBMkM7Q0FDNUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLGdDQUFnQyxHQUFHO0lBRTlDLFVBQVU7SUFHVixTQUFTO0NBQ1YsQ0FBQztBQUVGO0lBMEJFLGlDQUNtRCxJQUFvQixFQUNyRSxRQUFrQjtRQUQrQixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQWhCaEUsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3RELFlBQU8sR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQU1yRCxrQkFBYSxHQUFZLEtBQUssQ0FBQztRQUUvQix1QkFBa0IsR0FBVyxDQUFDLENBQUM7UUFFNUIscUJBQWdCLEdBQW1DLEVBQUUsQ0FBQztRQUV0RCxrQkFBYSxHQUFpQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBS3ZELENBQUM7SUFFTCwwQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxpREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELDZDQUFXLEdBQVg7UUFDRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRCw0Q0FBVSxHQUFWO1FBQUEsaUJBZ0JDO1FBZEMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQU0sV0FBVyxHQUFrQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTTtnQkFDeEIsSUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDL0QsS0FBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztvQkFDekIsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2lCQUNqRSxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELHFEQUFtQixHQUFuQjtRQUFBLGlCQVlDO1FBWEMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxlQUF3QztnQkFDckUsSUFBTSxhQUFhLEdBQXVCLEtBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ3ZHLElBQUksYUFBYSxFQUFFO29CQUNqQixLQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDLFlBQVk7eUJBQ3hDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7eUJBQzNDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxhQUFhLEVBQUUsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDLENBQUM7aUJBQzVDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFNRCwrQ0FBYSxHQUFiO1FBRUUsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNqRCxJQUFNLE1BQU0sR0FBMkIsRUFBRSxDQUFDO1FBQzFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsVUFBQyxlQUF3QztZQUNyRSxJQUFNLGFBQWEsR0FBdUIsY0FBYyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQzVGLElBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLElBQUksRUFBRSxlQUFlLENBQUMsVUFBVTtnQkFDaEMsS0FBSyxFQUFFLEtBQUs7YUFDYixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUdILElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZDO1FBR0QsSUFBTSxXQUFXLEdBQXNCLEVBQUUsQ0FBQztRQUMxQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUNqQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixXQUFXLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDdEY7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHLElBQUssT0FBQSxxQkFBcUIsQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxFQUFuRixDQUFtRixDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNoSyxDQUFDO0lBTUQsb0RBQWtCLEdBQWxCO1FBQ0UsT0FBTyxxQkFBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBTUQsb0RBQWtCLEdBQWxCO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFLRCwrQ0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUFFLENBQUM7U0FDL0M7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDN0I7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFLRCw2Q0FBVyxHQUFYO1FBQ0UsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNqRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBWTtZQUN6QyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFLUyxnREFBYyxHQUF4QjtRQUNFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQTZCLElBQUssT0FBQSxJQUFJLENBQUMsaUJBQWlCLEVBQXRCLENBQXNCLENBQUMsQ0FBQztJQUM5RixDQUFDOztnQkE3SkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFlBQWdEO29CQUNoRCxNQUFNLEVBQUUsK0JBQStCO29CQUN2QyxPQUFPLEVBQUUsZ0NBQWdDO2lCQUMxQzs7O2dCQXpDUSxjQUFjLHVCQStEbEIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsY0FBYyxFQUFkLENBQWMsQ0FBQztnQkFuRXlCLFFBQVE7O0lBMEQzRTtRQURDLGNBQWMsRUFBRTs7a0VBQ3FCO0lBRXRDO1FBREMsY0FBYyxFQUFFOzt1RUFDcUI7SUEySXhDLDhCQUFDO0NBQUEsQUEvSkQsSUErSkM7U0F0SlksdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL2Zvcm0vby1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElGaWx0ZXJCdWlsZGVyQ21wVGFyZ2V0IH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9maWx0ZXItYnVpbGRlci1jb21wb25lbnQtdGFyZ2V0LmludGVyZmFjZSc7XG5pbXBvcnQgeyBJRm9ybURhdGFDb21wb25lbnQgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2Zvcm0tZGF0YS1jb21wb25lbnQuaW50ZXJmYWNlJztcbmltcG9ydCB7IEJhc2ljRXhwcmVzc2lvbiB9IGZyb20gJy4uLy4uL3R5cGVzL2Jhc2ljLWV4cHJlc3Npb24udHlwZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi8uLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19GSUxURVJfQlVJTERFUiA9IFtcbiAgLy8gZmlsdGVyczogW3N0cmluZ10gTGlzdCBvZiBwYWlycyBvZiBmb3JtIGNvbXBvbmVudCBhdHRyaWJ1dGVzIGFuZCB0YXJnZXQgY29tcG9uZW50IGNvbHVtcyAodGFyZ2V0Q29sdW1uMTpjb21wb25lbnRBdHRyMTt0YXJnZXRDb2x1bW4yOmNvbXBvbmVudEF0dHIyOy4uLikuIFNlcGFyYXRlZCBieSAnOycuXG4gICdmaWx0ZXJzJyxcblxuICAvLyB0YXJnZXQgW2BPU2VydmljZUNvbXBvbmVudGAgaW5zdGFuY2VdOiBDb21wb25lbnQgd2hvc2UgZGF0YSB3aWxsIGJlIGZpbHRlcmVkLlxuICAndGFyZ2V0Q21wOiB0YXJnZXQnLFxuXG4gIC8vIGV4cHJlc3Npb24tYnVpbGRlciBbZnVudGlvbl06IEZ1bnRpb24gY2FsbGVkIGZvciBjcmVhdGluZyB0aGUgZXhwcmVzc2lvbi5cbiAgJ2V4cHJlc3Npb25CdWlsZGVyOiBleHByZXNzaW9uLWJ1aWxkZXInLFxuXG4gIC8vIHF1ZXJ5LW9uLWNoYW5nZSBbeWVzfG5vfHRydWV8ZmFsc2VdOiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgdG8gdHJpZ2dlciB0aGUgdGFyZ2V0IGNvbXBvbmVudCByZWZyZXNoIHdoZW4gYSBmaWx0ZXIgY29tcG9uZW50IGBvbkNoYW5nZWAgZXZlbnQgaXMgZmlyZWQuIERlZmF1bHQ6IG5vLlxuICAncXVlcnlPbkNoYW5nZTogcXVlcnktb24tY2hhbmdlJyxcblxuICAvLyBxdWVyeS1vbi1jaGFuZ2UtZGVsYXkgW251bWJlcl06IERlbGF5IHRpbWUgaW4gbWlsbGlzZWNvbmRzIGBxdWVyeS1vbi1jaGFuZ2VgIG1ldGhvZCBpcyB0cmlnZ2VyZWQuIERlZmF1bHQ6IDAuXG4gICdxdWVyeU9uQ2hhbmdlRGVsYXk6IHF1ZXJ5LW9uLWNoYW5nZS1kZWxheSdcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19GSUxURVJfQlVJTERFUiA9IFtcbiAgLy8gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gdGhlIGZpbHRlciBhY3Rpb24gaXMgZXhlY3V0ZWQuXG4gICdvbkZpbHRlcicsXG5cbiAgLy8gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gdGhlIGNsZWFyIGFjdGlvbiBpcyBleGN1dGVkLlxuICAnb25DbGVhcidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZmlsdGVyLWJ1aWxkZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vby1maWx0ZXItYnVpbGRlci5jb21wb25lbnQuaHRtbCcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GSUxURVJfQlVJTERFUixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fRklMVEVSX0JVSUxERVJcbn0pXG4vKipcbiAqIFRoZSBPRmlsdGVyQnVpbGRlckNvbXBvbmVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIE9GaWx0ZXJCdWlsZGVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBPbkluaXQge1xuXG4gIHB1YmxpYyBvbkZpbHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uQ2xlYXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgcHVibGljIGZpbHRlcnM6IHN0cmluZztcbiAgcHVibGljIHRhcmdldENtcDogT1NlcnZpY2VDb21wb25lbnQ7XG4gIHB1YmxpYyBleHByZXNzaW9uQnVpbGRlcjogKHZhbHVlczogQXJyYXk8eyBhdHRyLCB2YWx1ZSB9PikgPT4gRXhwcmVzc2lvbjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHF1ZXJ5T25DaGFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIHF1ZXJ5T25DaGFuZ2VEZWxheTogbnVtYmVyID0gMDtcblxuICBwcm90ZWN0ZWQgZmlsdGVyQ29tcG9uZW50czogQXJyYXk8SUZpbHRlckJ1aWxkZXJDbXBUYXJnZXQ+ID0gW107XG5cbiAgcHJvdGVjdGVkIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBwdWJsaWMgZm9ybTogT0Zvcm1Db21wb25lbnQsXG4gICAgaW5qZWN0b3I6IEluamVjdG9yXG4gICkgeyB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplTGlzdGVuZXJzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBpbml0aWFsaXplKCk6IHZvaWQge1xuICAgIC8vIFBhcnNlIGZpbHRlcnNcbiAgICBpZiAodGhpcy5maWx0ZXJzKSB7XG4gICAgICBjb25zdCBmaWx0ZXJBcnJheTogQXJyYXk8c3RyaW5nPiA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmZpbHRlcnMpO1xuICAgICAgZmlsdGVyQXJyYXkuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgICBjb25zdCBmaWx0ZXJFbG1zID0gZmlsdGVyLnNwbGl0KENvZGVzLkNPTFVNTlNfQUxJQVNfU0VQQVJBVE9SKTtcbiAgICAgICAgdGhpcy5maWx0ZXJDb21wb25lbnRzLnB1c2goe1xuICAgICAgICAgIHRhcmdldEF0dHI6IGZpbHRlckVsbXNbMF0sXG4gICAgICAgICAgZm9ybUNvbXBvbmVudEF0dHI6IGZpbHRlckVsbXNbMV0gPyBmaWx0ZXJFbG1zWzFdIDogZmlsdGVyRWxtc1swXVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnRhcmdldENtcCkpIHtcbiAgICAgIHRoaXMudGFyZ2V0Q21wLnNldEZpbHRlckJ1aWxkZXIodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdGlhbGl6ZUxpc3RlbmVycygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5xdWVyeU9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLmZpbHRlckNvbXBvbmVudHMuZm9yRWFjaCgoZmlsdGVyQ29tcG9uZW50OiBJRmlsdGVyQnVpbGRlckNtcFRhcmdldCkgPT4ge1xuICAgICAgICBjb25zdCBmb3JtQ29tcG9uZW50OiBJRm9ybURhdGFDb21wb25lbnQgPSB0aGlzLmZvcm0uZ2V0Q29tcG9uZW50cygpW2ZpbHRlckNvbXBvbmVudC5mb3JtQ29tcG9uZW50QXR0cl07XG4gICAgICAgIGlmIChmb3JtQ29tcG9uZW50KSB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgICAgIGZvcm1Db21wb25lbnQuZ2V0Rm9ybUNvbnRyb2woKS52YWx1ZUNoYW5nZXNcbiAgICAgICAgICAgICAgLnBpcGUoZGVib3VuY2VUaW1lKHRoaXMucXVlcnlPbkNoYW5nZURlbGF5KSlcbiAgICAgICAgICAgICAgLnN1YnNjcmliZShhID0+IHRoaXMudHJpZ2dlclJlbG9hZCgpKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGBFeHByZXNzaW9uYCBvYmplY3Qgd2l0aCB0aGUgZmlsdGVyLlxuICAgKiBAcmV0dXJucyB0aGUgYEV4cHJlc3Npb25gIG9iamVjdCB3aXRoIHRoZSBmaWx0ZXIuXG4gICAqL1xuICBnZXRFeHByZXNzaW9uKCk6IEV4cHJlc3Npb24ge1xuICAgIC8vIFByZXBhcmUgZm9ybSBmaWx0ZXIgdmFsdWVzIFsuLi4geyBhdHRyLCB2YWx1ZSB9XVxuICAgIGNvbnN0IGZvcm1Db21wb25lbnRzID0gdGhpcy5mb3JtLmdldENvbXBvbmVudHMoKTtcbiAgICBjb25zdCBwYXJhbXM6IEFycmF5PHsgYXR0ciwgdmFsdWUgfT4gPSBbXTtcbiAgICB0aGlzLmZpbHRlckNvbXBvbmVudHMuZm9yRWFjaCgoZmlsdGVyQ29tcG9uZW50OiBJRmlsdGVyQnVpbGRlckNtcFRhcmdldCkgPT4ge1xuICAgICAgY29uc3QgZm9ybUNvbXBvbmVudDogSUZvcm1EYXRhQ29tcG9uZW50ID0gZm9ybUNvbXBvbmVudHNbZmlsdGVyQ29tcG9uZW50LmZvcm1Db21wb25lbnRBdHRyXTtcbiAgICAgIGNvbnN0IHZhbHVlID0gZm9ybUNvbXBvbmVudC5nZXRWYWx1ZSgpO1xuICAgICAgcGFyYW1zLnB1c2goe1xuICAgICAgICBhdHRyOiBmaWx0ZXJDb21wb25lbnQudGFyZ2V0QXR0cixcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFRyaWdnZXIgdGhlIGZ1bmN0aW9uIHByb3ZpZGVkIGJ5IHRoZSB1c2VyXG4gICAgaWYgKHRoaXMuZXhwcmVzc2lvbkJ1aWxkZXIpIHtcbiAgICAgIHJldHVybiB0aGlzLmV4cHJlc3Npb25CdWlsZGVyKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgZGVzZmF1bHQgZXhwcmVzc2lvblxuICAgIGNvbnN0IGV4cHJlc3Npb25zOiBBcnJheTxFeHByZXNzaW9uPiA9IFtdO1xuICAgIHBhcmFtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGVsZW0udmFsdWUpKSB7XG4gICAgICAgIGV4cHJlc3Npb25zLnB1c2goRmlsdGVyRXhwcmVzc2lvblV0aWxzLmJ1aWxkRXhwcmVzc2lvbkVxdWFscyhlbGVtLmF0dHIsIGVsZW0udmFsdWUpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBleHByZXNzaW9ucy5sZW5ndGggPyBleHByZXNzaW9ucy5yZWR1Y2UoKGZlMSwgZmUyKSA9PiBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRDb21wbGV4RXhwcmVzc2lvbihmZTEsIGZlMiwgRmlsdGVyRXhwcmVzc2lvblV0aWxzLk9QX09SKSkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBgQmFzaWNFeHByZXNzaW9uYCBvYmplY3Qgd2l0aCB0aGUgZmlsdGVyLlxuICAgKiBAcmV0dXJucyB0aGUgYEJhc2ljRXhwcmVzc2lvbmAgb2JqZWN0IHdpdGggdGhlIGZpbHRlci5cbiAgICovXG4gIGdldEJhc2ljRXhwcmVzc2lvbigpOiBCYXNpY0V4cHJlc3Npb24ge1xuICAgIHJldHVybiBGaWx0ZXJFeHByZXNzaW9uVXRpbHMuYnVpbGRCYXNpY0V4cHJlc3Npb24odGhpcy5nZXRFeHByZXNzaW9uKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpbHRlciBidWlsZGVyIHRhcmdldCBjb21wb25lbnQuXG4gICAqIEByZXR1cm5zIHRoZSB0YXJnZXQgY29tcG9uZW50LlxuICAgKi9cbiAgZ2V0VGFyZ2V0Q29tcG9uZW50KCk6IE9TZXJ2aWNlQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy50YXJnZXRDbXA7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciB0aGUgYHJlbG9hZERhdGFgIG1ldGhvZCBmcm9tIHRoZSB0YXJnZXQgY29tcG9uZW50LlxuICAgKi9cbiAgdHJpZ2dlclJlbG9hZCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMudGFyZ2V0Q21wKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnRhcmdldENtcC5wYWdlYWJsZSkge1xuICAgICAgdGhpcy50YXJnZXRDbXAucmVsb2FkUGFnaW5hdGVkRGF0YUZyb21TdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRhcmdldENtcC5yZWxvYWREYXRhKCk7XG4gICAgfVxuICAgIHRoaXMub25GaWx0ZXIuZW1pdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSBmb3JtIGNvbXBvbmVudHMgdXNlZCBmb3IgdGhlIGZpbHRlci5cbiAgICovXG4gIGNsZWFyRmlsdGVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGZvcm1Db21wb25lbnRzID0gdGhpcy5mb3JtLmdldENvbXBvbmVudHMoKTtcbiAgICB0aGlzLmdldEZpbHRlckF0dHJzKCkuZm9yRWFjaCgoYXR0cjogc3RyaW5nKSA9PiB7XG4gICAgICBmb3JtQ29tcG9uZW50c1thdHRyXS5zZXRWYWx1ZSh2b2lkIDApO1xuICAgIH0pO1xuICAgIHRoaXMub25DbGVhci5lbWl0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSB3aXRoIHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBmaWx0ZXJhYmxlIGNvbXBvbmVudHNcbiAgICovXG4gIHByb3RlY3RlZCBnZXRGaWx0ZXJBdHRycygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJDb21wb25lbnRzLm1hcCgoZWxlbTogSUZpbHRlckJ1aWxkZXJDbXBUYXJnZXQpID0+IGVsZW0uZm9ybUNvbXBvbmVudEF0dHIpO1xuICB9XG5cbn1cbiJdfQ==