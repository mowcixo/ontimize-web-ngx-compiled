import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { OCurrencyPipe } from '../../../../../pipes/o-currency.pipe';
import { CurrencyService } from '../../../../../services/currency.service';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL } from '../real/o-table-cell-renderer-real.component';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY = tslib_1.__spread(DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL, [
    'currencySymbol: currency-symbol',
    'currencySymbolPosition: currency-symbol-position'
]);
var OTableCellRendererCurrencyComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererCurrencyComponent, _super);
    function OTableCellRendererCurrencyComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.minDecimalDigits = 2;
        _this.maxDecimalDigits = 2;
        _this.decimalSeparator = '.';
        _this.grouping = true;
        _this.thousandSeparator = ',';
        _this.tableColumn.type = 'currency';
        _this.currencyService = _this.injector.get(CurrencyService);
        _this.setComponentPipe();
        return _this;
    }
    OTableCellRendererCurrencyComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OCurrencyPipe(this.injector);
    };
    OTableCellRendererCurrencyComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (typeof this.currencySymbol === 'undefined') {
            this.currencySymbol = this.currencyService.symbol;
        }
        if (typeof this.currencySymbolPosition === 'undefined') {
            this.currencySymbolPosition = this.currencyService.symbolPosition;
        }
        this.pipeArguments = {
            currencySimbol: this.currencySymbol,
            currencySymbolPosition: this.currencySymbolPosition,
            minDecimalDigits: this.minDecimalDigits,
            maxDecimalDigits: this.maxDecimalDigits,
            decimalSeparator: this.decimalSeparator,
            grouping: this.grouping,
            thousandSeparator: this.thousandSeparator
        };
    };
    OTableCellRendererCurrencyComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-currency',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n  {{getCellData(cellvalue)}}\n</ng-template>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY
                }] }
    ];
    OTableCellRendererCurrencyComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererCurrencyComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableCellRendererCurrencyComponent.prototype, "minDecimalDigits", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OTableCellRendererCurrencyComponent.prototype, "maxDecimalDigits", void 0);
    return OTableCellRendererCurrencyComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererCurrencyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWN1cnJlbmN5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1yZW5kZXJlci9jdXJyZW5jeS9vLXRhYmxlLWNlbGwtcmVuZGVyZXItY3VycmVuY3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQXlCLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzVGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUV6RyxNQUFNLENBQUMsSUFBTSw2Q0FBNkMsb0JBQ3JELHlDQUF5QztJQUc1QyxpQ0FBaUM7SUFHakMsa0RBQWtEO0VBQ25ELENBQUM7QUFFRjtJQU15RCwrREFBc0I7SUFvQjdFLDZDQUFzQixRQUFrQjtRQUF4QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxTQUloQjtRQUxxQixjQUFRLEdBQVIsUUFBUSxDQUFVO1FBakJ4QyxzQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFFN0Isc0JBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBSW5CLHNCQUFnQixHQUFXLEdBQUcsQ0FBQztRQUUvQixjQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLHVCQUFpQixHQUFXLEdBQUcsQ0FBQztRQVV4QyxLQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDbkMsS0FBSSxDQUFDLGVBQWUsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMxRCxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzs7SUFDMUIsQ0FBQztJQUVELDhEQUFnQixHQUFoQjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCx3REFBVSxHQUFWO1FBQ0UsaUJBQU0sVUFBVSxXQUFFLENBQUM7UUFDbkIsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO1lBQzlDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7U0FDbkQ7UUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixLQUFLLFdBQVcsRUFBRTtZQUN0RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUM7U0FDbkU7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCO1lBQ25ELGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQzFDLENBQUM7SUFFSixDQUFDOztnQkF4REYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLGtIQUE4RDtvQkFDOUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLE1BQU0sRUFBRSw2Q0FBNkM7aUJBQ3REOzs7Z0JBdkI0QyxRQUFROzs7OEJBMENsRCxTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOztJQWY3RDtRQURDLGNBQWMsRUFBRTs7aUZBQ1k7SUFFN0I7UUFEQyxjQUFjLEVBQUU7O2lGQUNZO0lBK0MvQiwwQ0FBQztDQUFBLEFBMURELENBTXlELHNCQUFzQixHQW9EOUU7U0FwRFksbUNBQW1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0b3IsIE9uSW5pdCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IElDdXJyZW5jeVBpcGVBcmd1bWVudCwgT0N1cnJlbmN5UGlwZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3BpcGVzL28tY3VycmVuY3kucGlwZSc7XG5pbXBvcnQgeyBDdXJyZW5jeVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9jdXJyZW5jeS5zZXJ2aWNlJztcbmltcG9ydCB7IE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgfSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1yZW5kZXJlci5jbGFzcyc7XG5pbXBvcnQgeyBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfUkVBTCB9IGZyb20gJy4uL3JlYWwvby10YWJsZS1jZWxsLXJlbmRlcmVyLXJlYWwuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9DVVJSRU5DWSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1JFQUwsXG5cbiAgLy8gY3VycmVuY3ktc3ltYm9sIFtzdHJpbmddOiBjdXJyZW5jeSBzeW1ib2wuIERlZmF1bHQ6IGRvbGxhciAoJCkuXG4gICdjdXJyZW5jeVN5bWJvbDogY3VycmVuY3ktc3ltYm9sJyxcblxuICAvLyBjdXJyZW5jeS1zeW1ib2wtcG9zaXRpb24gW2xlZnR8cmlnaHRdOiBwb3NpdGlvbiBvZiB0aGUgY3VycmVuY3kgc3ltYm9sLiBEZWZhdWx0OiBsZWZ0LlxuICAnY3VycmVuY3lTeW1ib2xQb3NpdGlvbjogY3VycmVuY3ktc3ltYm9sLXBvc2l0aW9uJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLXJlbmRlcmVyLWN1cnJlbmN5JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtY2VsbC1yZW5kZXJlci1jdXJyZW5jeS5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9DVVJSRU5DWVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsUmVuZGVyZXJDdXJyZW5jeUNvbXBvbmVudCBleHRlbmRzIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1pbkRlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIG1heERlY2ltYWxEaWdpdHM6IG51bWJlciA9IDI7XG5cbiAgcHJvdGVjdGVkIGN1cnJlbmN5U3ltYm9sOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBjdXJyZW5jeVN5bWJvbFBvc2l0aW9uOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBkZWNpbWFsU2VwYXJhdG9yOiBzdHJpbmcgPSAnLic7XG5cbiAgcHJvdGVjdGVkIGdyb3VwaW5nOiBib29sZWFuID0gdHJ1ZTtcbiAgcHJvdGVjdGVkIHRob3VzYW5kU2VwYXJhdG9yOiBzdHJpbmcgPSAnLCc7XG5cbiAgcHJvdGVjdGVkIGN1cnJlbmN5U2VydmljZTogQ3VycmVuY3lTZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBjb21wb25lbnRQaXBlOiBPQ3VycmVuY3lQaXBlO1xuICBwcm90ZWN0ZWQgcGlwZUFyZ3VtZW50czogSUN1cnJlbmN5UGlwZUFyZ3VtZW50O1xuICBAVmlld0NoaWxkKCd0ZW1wbGF0ZXJlZicsIHsgcmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZSB9KSBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLnRhYmxlQ29sdW1uLnR5cGUgPSAnY3VycmVuY3knO1xuICAgIHRoaXMuY3VycmVuY3lTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoQ3VycmVuY3lTZXJ2aWNlKTtcbiAgICB0aGlzLnNldENvbXBvbmVudFBpcGUoKTtcbiAgfVxuXG4gIHNldENvbXBvbmVudFBpcGUoKSB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9DdXJyZW5jeVBpcGUodGhpcy5pbmplY3Rvcik7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICBpZiAodHlwZW9mIHRoaXMuY3VycmVuY3lTeW1ib2wgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmN1cnJlbmN5U3ltYm9sID0gdGhpcy5jdXJyZW5jeVNlcnZpY2Uuc3ltYm9sO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMuY3VycmVuY3lTeW1ib2xQb3NpdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuY3VycmVuY3lTeW1ib2xQb3NpdGlvbiA9IHRoaXMuY3VycmVuY3lTZXJ2aWNlLnN5bWJvbFBvc2l0aW9uO1xuICAgIH1cblxuICAgIHRoaXMucGlwZUFyZ3VtZW50cyA9IHtcbiAgICAgIGN1cnJlbmN5U2ltYm9sOiB0aGlzLmN1cnJlbmN5U3ltYm9sLFxuICAgICAgY3VycmVuY3lTeW1ib2xQb3NpdGlvbjogdGhpcy5jdXJyZW5jeVN5bWJvbFBvc2l0aW9uLFxuICAgICAgbWluRGVjaW1hbERpZ2l0czogdGhpcy5taW5EZWNpbWFsRGlnaXRzLFxuICAgICAgbWF4RGVjaW1hbERpZ2l0czogdGhpcy5tYXhEZWNpbWFsRGlnaXRzLFxuICAgICAgZGVjaW1hbFNlcGFyYXRvcjogdGhpcy5kZWNpbWFsU2VwYXJhdG9yLFxuICAgICAgZ3JvdXBpbmc6IHRoaXMuZ3JvdXBpbmcsXG4gICAgICB0aG91c2FuZFNlcGFyYXRvcjogdGhpcy50aG91c2FuZFNlcGFyYXRvclxuICAgIH07XG5cbiAgfVxuXG59XG4iXX0=