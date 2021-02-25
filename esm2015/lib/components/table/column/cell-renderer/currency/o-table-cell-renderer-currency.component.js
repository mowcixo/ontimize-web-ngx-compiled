import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { OCurrencyPipe } from '../../../../../pipes/o-currency.pipe';
import { CurrencyService } from '../../../../../services/currency.service';
import { OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
import { DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL } from '../real/o-table-cell-renderer-real.component';
export const DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY = [
    ...DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_REAL,
    'currencySymbol: currency-symbol',
    'currencySymbolPosition: currency-symbol-position'
];
export class OTableCellRendererCurrencyComponent extends OBaseTableCellRenderer {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.minDecimalDigits = 2;
        this.maxDecimalDigits = 2;
        this.decimalSeparator = '.';
        this.grouping = true;
        this.thousandSeparator = ',';
        this.tableColumn.type = 'currency';
        this.currencyService = this.injector.get(CurrencyService);
        this.setComponentPipe();
    }
    setComponentPipe() {
        this.componentPipe = new OCurrencyPipe(this.injector);
    }
    initialize() {
        super.initialize();
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
    }
}
OTableCellRendererCurrencyComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-cell-renderer-currency',
                template: "<ng-template #templateref let-cellvalue=\"cellvalue\">\n  {{getCellData(cellvalue)}}\n</ng-template>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_CURRENCY
            }] }
];
OTableCellRendererCurrencyComponent.ctorParameters = () => [
    { type: Injector }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLWN1cnJlbmN5LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9jb2x1bW4vY2VsbC1yZW5kZXJlci9jdXJyZW5jeS9vLXRhYmxlLWNlbGwtcmVuZGVyZXItY3VycmVuY3kuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQXlCLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzVGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUV6RyxNQUFNLENBQUMsTUFBTSw2Q0FBNkMsR0FBRztJQUMzRCxHQUFHLHlDQUF5QztJQUc1QyxpQ0FBaUM7SUFHakMsa0RBQWtEO0NBQ25ELENBQUM7QUFRRixNQUFNLE9BQU8sbUNBQW9DLFNBQVEsc0JBQXNCO0lBb0I3RSxZQUFzQixRQUFrQjtRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFESSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBakJ4QyxxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFFN0IscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBSW5CLHFCQUFnQixHQUFXLEdBQUcsQ0FBQztRQUUvQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLHNCQUFpQixHQUFXLEdBQUcsQ0FBQztRQVV4QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELFVBQVU7UUFDUixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbkIsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO1lBQzlDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7U0FDbkQ7UUFDRCxJQUFJLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixLQUFLLFdBQVcsRUFBRTtZQUN0RCxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUM7U0FDbkU7UUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztZQUNuQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCO1lBQ25ELGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDdkMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtZQUN2QyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1lBQ3ZDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtZQUN2QixpQkFBaUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQzFDLENBQUM7SUFFSixDQUFDOzs7WUF4REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLGtIQUE4RDtnQkFDOUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSw2Q0FBNkM7YUFDdEQ7OztZQXZCNEMsUUFBUTs7OzBCQTBDbEQsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7QUFmN0Q7SUFEQyxjQUFjLEVBQUU7OzZFQUNZO0FBRTdCO0lBREMsY0FBYyxFQUFFOzs2RUFDWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdG9yLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBJQ3VycmVuY3lQaXBlQXJndW1lbnQsIE9DdXJyZW5jeVBpcGUgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9waXBlcy9vLWN1cnJlbmN5LnBpcGUnO1xuaW1wb3J0IHsgQ3VycmVuY3lTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvY3VycmVuY3kuc2VydmljZSc7XG5pbXBvcnQgeyBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIH0gZnJvbSAnLi4vby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1JFQUwgfSBmcm9tICcuLi9yZWFsL28tdGFibGUtY2VsbC1yZW5kZXJlci1yZWFsLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfQ1VSUkVOQ1kgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9SRUFMLFxuXG4gIC8vIGN1cnJlbmN5LXN5bWJvbCBbc3RyaW5nXTogY3VycmVuY3kgc3ltYm9sLiBEZWZhdWx0OiBkb2xsYXIgKCQpLlxuICAnY3VycmVuY3lTeW1ib2w6IGN1cnJlbmN5LXN5bWJvbCcsXG5cbiAgLy8gY3VycmVuY3ktc3ltYm9sLXBvc2l0aW9uIFtsZWZ0fHJpZ2h0XTogcG9zaXRpb24gb2YgdGhlIGN1cnJlbmN5IHN5bWJvbC4gRGVmYXVsdDogbGVmdC5cbiAgJ2N1cnJlbmN5U3ltYm9sUG9zaXRpb246IGN1cnJlbmN5LXN5bWJvbC1wb3NpdGlvbidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtY2VsbC1yZW5kZXJlci1jdXJyZW5jeScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWNlbGwtcmVuZGVyZXItY3VycmVuY3kuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfQ1VSUkVOQ1lcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQ2VsbFJlbmRlcmVyQ3VycmVuY3lDb21wb25lbnQgZXh0ZW5kcyBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIGltcGxlbWVudHMgT25Jbml0IHtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtaW5EZWNpbWFsRGlnaXRzOiBudW1iZXIgPSAyO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBtYXhEZWNpbWFsRGlnaXRzOiBudW1iZXIgPSAyO1xuXG4gIHByb3RlY3RlZCBjdXJyZW5jeVN5bWJvbDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgY3VycmVuY3lTeW1ib2xQb3NpdGlvbjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZGVjaW1hbFNlcGFyYXRvcjogc3RyaW5nID0gJy4nO1xuXG4gIHByb3RlY3RlZCBncm91cGluZzogYm9vbGVhbiA9IHRydWU7XG4gIHByb3RlY3RlZCB0aG91c2FuZFNlcGFyYXRvcjogc3RyaW5nID0gJywnO1xuXG4gIHByb3RlY3RlZCBjdXJyZW5jeVNlcnZpY2U6IEN1cnJlbmN5U2VydmljZTtcblxuICBwcm90ZWN0ZWQgY29tcG9uZW50UGlwZTogT0N1cnJlbmN5UGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElDdXJyZW5jeVBpcGVBcmd1bWVudDtcbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gICAgdGhpcy50YWJsZUNvbHVtbi50eXBlID0gJ2N1cnJlbmN5JztcbiAgICB0aGlzLmN1cnJlbmN5U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KEN1cnJlbmN5U2VydmljZSk7XG4gICAgdGhpcy5zZXRDb21wb25lbnRQaXBlKCk7XG4gIH1cblxuICBzZXRDb21wb25lbnRQaXBlKCkge1xuICAgIHRoaXMuY29tcG9uZW50UGlwZSA9IG5ldyBPQ3VycmVuY3lQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbmN5U3ltYm9sID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5jdXJyZW5jeVN5bWJvbCA9IHRoaXMuY3VycmVuY3lTZXJ2aWNlLnN5bWJvbDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLmN1cnJlbmN5U3ltYm9sUG9zaXRpb24gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLmN1cnJlbmN5U3ltYm9sUG9zaXRpb24gPSB0aGlzLmN1cnJlbmN5U2VydmljZS5zeW1ib2xQb3NpdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLnBpcGVBcmd1bWVudHMgPSB7XG4gICAgICBjdXJyZW5jeVNpbWJvbDogdGhpcy5jdXJyZW5jeVN5bWJvbCxcbiAgICAgIGN1cnJlbmN5U3ltYm9sUG9zaXRpb246IHRoaXMuY3VycmVuY3lTeW1ib2xQb3NpdGlvbixcbiAgICAgIG1pbkRlY2ltYWxEaWdpdHM6IHRoaXMubWluRGVjaW1hbERpZ2l0cyxcbiAgICAgIG1heERlY2ltYWxEaWdpdHM6IHRoaXMubWF4RGVjaW1hbERpZ2l0cyxcbiAgICAgIGRlY2ltYWxTZXBhcmF0b3I6IHRoaXMuZGVjaW1hbFNlcGFyYXRvcixcbiAgICAgIGdyb3VwaW5nOiB0aGlzLmdyb3VwaW5nLFxuICAgICAgdGhvdXNhbmRTZXBhcmF0b3I6IHRoaXMudGhvdXNhbmRTZXBhcmF0b3JcbiAgICB9O1xuXG4gIH1cblxufVxuIl19