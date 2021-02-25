import * as tslib_1 from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT, ORealInputComponent, } from '../real-input/o-real-input.component';
export var DEFAULT_INPUTS_O_CURRENCY_INPUT = tslib_1.__spread(DEFAULT_INPUTS_O_REAL_INPUT, [
    'currencySymbol: currency-symbol',
    'currencySymbolPosition: currency-symbol-position'
]);
export var DEFAULT_OUTPUTS_O_CURRENCY_INPUT = tslib_1.__spread(DEFAULT_OUTPUTS_O_REAL_INPUT);
var OCurrencyInputComponent = (function (_super) {
    tslib_1.__extends(OCurrencyInputComponent, _super);
    function OCurrencyInputComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currency_symbols = {
            CRC: '₡',
            NGN: '₦',
            PHP: '₱',
            PLN: 'zł',
            PYG: '₲',
            THB: '฿',
            UAH: '₴',
            VND: '₫',
        };
        _this.currencySymbol = 'EUR';
        _this.currencySymbolPosition = 'right';
        return _this;
    }
    OCurrencyInputComponent.prototype.existsOntimizeIcon = function () {
        return OCurrencyInputComponent.currency_icons.indexOf(this.currencySymbol) !== -1;
    };
    OCurrencyInputComponent.prototype.useIcon = function (position) {
        return this.existsOntimizeIcon() && this.currencySymbolPosition === position;
    };
    OCurrencyInputComponent.prototype.useSymbol = function (position) {
        return this.currency_symbols.hasOwnProperty(this.currencySymbol) && this.currencySymbolPosition === position;
    };
    OCurrencyInputComponent.currency_icons = ['USD', 'EUR', 'GBP', 'ILS', 'INR', 'JPY', 'KRW', 'BTC'];
    OCurrencyInputComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-currency-input',
                    template: "<div [formGroup]=\"getFormGroup()\" [matTooltip]=\"tooltip\" [matTooltipClass]=\"tooltipClass\"\n  [matTooltipPosition]=\"tooltipPosition\" [matTooltipShowDelay]=\"tooltipShowDelay\"\n  [matTooltipHideDelay]=\"tooltipHideDelay\" fxLayout=\"row\" fxLayoutAlign=\"space-between center\">\n\n  <div *ngIf=\"useSymbol('left')\" matSuffix class=\"icon-btn\" [class.mat-disabled]=\"!enabled\">\n    {{ currency_symbols[currencySymbol] }}\n  </div>\n  <mat-icon *ngIf=\"useIcon('left')\" svgIcon=\"ontimize:{{currencySymbol}}\" matSuffix class=\"svg-icon\"\n    [class.mat-disabled]=\"!enabled\"></mat-icon>\n  <mat-form-field [appearance]=\"appearance\" [floatLabel]=\"floatLabel\" [hideRequiredMarker]=\"hideRequiredMarker\"\n    [class.custom-width]=\"hasCustomWidth\" class=\"icon-field\" fxFill>\n    <mat-label *ngIf=\"labelVisible\">{{ olabel | oTranslate }}</mat-label>\n    <input matInput [type]=\"inputType\" [id]=\"getAttribute()\" [formControlName]=\"getAttribute()\"\n      [placeholder]=\"placeHolder\" (focus)=\"innerOnFocus($event)\" (blur)=\"innerOnBlur($event)\" [readonly]=\"isReadOnly\"\n      [min]=\"min\" [max]=\"max\" [step]=\"step\" [required]=\"isRequired\" (change)=\"onChangeEvent($event)\">\n\n    <button type=\"button\" *ngIf=\"showClearButton\" matSuffix mat-icon-button (click)=\"onClickClearValue($event)\">\n      <mat-icon svgIcon=\"ontimize:close\"></mat-icon>\n    </button>\n    <div *ngIf=\"useSymbol('right')\" matSuffix class=\"icon-btn\" [class.mat-disabled]=\"!enabled\">\n      {{ currency_symbols[currencySymbol] }}\n    </div>\n    <mat-icon *ngIf=\"useIcon('right')\" svgIcon=\"ontimize:{{currencySymbol}}\" matSuffix class=\"svg-icon\"\n      [class.mat-disabled]=\"!enabled\">\n    </mat-icon>\n\n    <mat-error *ngIf=\"hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('min')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_VALUE' | oTranslate }}: {{ getErrorValue('min', 'requiredMin') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('max')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_VALUE' | oTranslate }}: {{ getErrorValue('max', 'requiredMax') }}\"></mat-error>\n    <mat-error *ngIf=\"hasError('minDecimaldigits')\"\n      text=\"{{ 'FORM_VALIDATION.MIN_DECIMAL_DIGITS' | oTranslate }}: {{ getErrorValue('minDecimaldigits', 'requiredMinDecimaldigits') }}\">\n    </mat-error>\n    <mat-error *ngIf=\"hasError('maxDecimaldigits')\"\n      text=\"{{ 'FORM_VALIDATION.MAX_DECIMAL_DIGITS' | oTranslate }}: {{ getErrorValue('maxDecimaldigits', 'requiredMaxDecimaldigits') }}\">\n    </mat-error>\n    <mat-error *ngFor=\"let oError of getActiveOErrors()\" text=\"{{ oError.text | oTranslate }}\"></mat-error>\n  </mat-form-field>\n</div>",
                    inputs: DEFAULT_INPUTS_O_CURRENCY_INPUT,
                    outputs: DEFAULT_OUTPUTS_O_CURRENCY_INPUT,
                    encapsulation: ViewEncapsulation.None,
                    styles: ["o-currency-input input{padding-right:8px}o-currency-input input .mat-form-field-wrapper .mat-input-table .mat-form-field-infix .mat-input-element{text-align:end}"]
                }] }
    ];
    return OCurrencyInputComponent;
}(ORealInputComponent));
export { OCurrencyInputComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY3VycmVuY3ktaW5wdXQvby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQVUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFckUsT0FBTyxFQUNMLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsbUJBQW1CLEdBQ3BCLE1BQU0sc0NBQXNDLENBQUM7QUFFOUMsTUFBTSxDQUFDLElBQU0sK0JBQStCLG9CQUN2QywyQkFBMkI7SUFDOUIsaUNBQWlDO0lBQ2pDLGtEQUFrRDtFQUNuRCxDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sZ0NBQWdDLG9CQUN4Qyw0QkFBNEIsQ0FDaEMsQ0FBQztBQUVGO0lBUTZDLG1EQUFtQjtJQVJoRTtRQUFBLHFFQXFDQztRQXpCQyxzQkFBZ0IsR0FBRztZQUNqQixHQUFHLEVBQUUsR0FBRztZQUNSLEdBQUcsRUFBRSxHQUFHO1lBQ1IsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLEVBQUUsSUFBSTtZQUNULEdBQUcsRUFBRSxHQUFHO1lBQ1IsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLEVBQUUsR0FBRztZQUNSLEdBQUcsRUFBRSxHQUFHO1NBQ1QsQ0FBQztRQUVGLG9CQUFjLEdBQVcsS0FBSyxDQUFDO1FBQy9CLDRCQUFzQixHQUFXLE9BQU8sQ0FBQzs7SUFhM0MsQ0FBQztJQVhXLG9EQUFrQixHQUE1QjtRQUNFLE9BQU8sdUJBQXVCLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELHlDQUFPLEdBQVAsVUFBUSxRQUFnQjtRQUN0QixPQUFPLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsS0FBSyxRQUFRLENBQUM7SUFDL0UsQ0FBQztJQUVELDJDQUFTLEdBQVQsVUFBVSxRQUFnQjtRQUN4QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQyxzQkFBc0IsS0FBSyxRQUFRLENBQUM7SUFDL0csQ0FBQztJQTFCTSxzQ0FBYyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOztnQkFWbEYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLHdzRkFBZ0Q7b0JBRWhELE1BQU0sRUFBRSwrQkFBK0I7b0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7b0JBQ3pDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztpQkFDdEM7O0lBOEJELDhCQUFDO0NBQUEsQUFyQ0QsQ0FRNkMsbUJBQW1CLEdBNkIvRDtTQTdCWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19SRUFMX0lOUFVULFxuICBERUZBVUxUX09VVFBVVFNfT19SRUFMX0lOUFVULFxuICBPUmVhbElucHV0Q29tcG9uZW50LFxufSBmcm9tICcuLi9yZWFsLWlucHV0L28tcmVhbC1pbnB1dC5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19DVVJSRU5DWV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19SRUFMX0lOUFVULFxuICAnY3VycmVuY3lTeW1ib2w6IGN1cnJlbmN5LXN5bWJvbCcsXG4gICdjdXJyZW5jeVN5bWJvbFBvc2l0aW9uOiBjdXJyZW5jeS1zeW1ib2wtcG9zaXRpb24nXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQ1VSUkVOQ1lfSU5QVVQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX1JFQUxfSU5QVVRcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tY3VycmVuY3ktaW5wdXQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tY3VycmVuY3ktaW5wdXQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0NVUlJFTkNZX0lOUFVULFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19DVVJSRU5DWV9JTlBVVCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBPQ3VycmVuY3lJbnB1dENvbXBvbmVudCBleHRlbmRzIE9SZWFsSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHN0YXRpYyBjdXJyZW5jeV9pY29ucyA9IFsnVVNEJywgJ0VVUicsICdHQlAnLCAnSUxTJywgJ0lOUicsICdKUFknLCAnS1JXJywgJ0JUQyddO1xuXG4gIGN1cnJlbmN5X3N5bWJvbHMgPSB7XG4gICAgQ1JDOiAn4oKhJywgLy8gQ29zdGEgUmljYW4gQ29sw7NuXG4gICAgTkdOOiAn4oKmJywgLy8gTmlnZXJpYW4gTmFpcmFcbiAgICBQSFA6ICfigrEnLCAvLyBQaGlsaXBwaW5lIFBlc29cbiAgICBQTE46ICd6xYInLCAvLyBQb2xpc2ggWmxvdHlcbiAgICBQWUc6ICfigrInLCAvLyBQYXJhZ3VheWFuIEd1YXJhbmlcbiAgICBUSEI6ICfguL8nLCAvLyBUaGFpIEJhaHRcbiAgICBVQUg6ICfigrQnLCAvLyBVa3JhaW5pYW4gSHJ5dm5pYVxuICAgIFZORDogJ+KCqycsIC8vIFZpZXRuYW1lc2UgRG9uZ1xuICB9O1xuXG4gIGN1cnJlbmN5U3ltYm9sOiBzdHJpbmcgPSAnRVVSJztcbiAgY3VycmVuY3lTeW1ib2xQb3NpdGlvbjogc3RyaW5nID0gJ3JpZ2h0JztcblxuICBwcm90ZWN0ZWQgZXhpc3RzT250aW1pemVJY29uKCkge1xuICAgIHJldHVybiBPQ3VycmVuY3lJbnB1dENvbXBvbmVudC5jdXJyZW5jeV9pY29ucy5pbmRleE9mKHRoaXMuY3VycmVuY3lTeW1ib2wpICE9PSAtMTtcbiAgfVxuXG4gIHVzZUljb24ocG9zaXRpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmV4aXN0c09udGltaXplSWNvbigpICYmIHRoaXMuY3VycmVuY3lTeW1ib2xQb3NpdGlvbiA9PT0gcG9zaXRpb247XG4gIH1cblxuICB1c2VTeW1ib2wocG9zaXRpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbmN5X3N5bWJvbHMuaGFzT3duUHJvcGVydHkodGhpcy5jdXJyZW5jeVN5bWJvbCkgJiYgdGhpcy5jdXJyZW5jeVN5bWJvbFBvc2l0aW9uID09PSBwb3NpdGlvbjtcbiAgfVxufVxuIl19