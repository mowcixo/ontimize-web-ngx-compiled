import { Component, ViewEncapsulation } from '@angular/core';
import { DEFAULT_INPUTS_O_REAL_INPUT, DEFAULT_OUTPUTS_O_REAL_INPUT, ORealInputComponent, } from '../real-input/o-real-input.component';
export const DEFAULT_INPUTS_O_CURRENCY_INPUT = [
    ...DEFAULT_INPUTS_O_REAL_INPUT,
    'currencySymbol: currency-symbol',
    'currencySymbolPosition: currency-symbol-position'
];
export const DEFAULT_OUTPUTS_O_CURRENCY_INPUT = [
    ...DEFAULT_OUTPUTS_O_REAL_INPUT
];
export class OCurrencyInputComponent extends ORealInputComponent {
    constructor() {
        super(...arguments);
        this.currency_symbols = {
            CRC: '₡',
            NGN: '₦',
            PHP: '₱',
            PLN: 'zł',
            PYG: '₲',
            THB: '฿',
            UAH: '₴',
            VND: '₫',
        };
        this.currencySymbol = 'EUR';
        this.currencySymbolPosition = 'right';
    }
    existsOntimizeIcon() {
        return OCurrencyInputComponent.currency_icons.indexOf(this.currencySymbol) !== -1;
    }
    useIcon(position) {
        return this.existsOntimizeIcon() && this.currencySymbolPosition === position;
    }
    useSymbol(position) {
        return this.currency_symbols.hasOwnProperty(this.currencySymbol) && this.currencySymbolPosition === position;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY3VycmVuY3ktaW5wdXQvby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRSxPQUFPLEVBQ0wsMkJBQTJCLEVBQzNCLDRCQUE0QixFQUM1QixtQkFBbUIsR0FDcEIsTUFBTSxzQ0FBc0MsQ0FBQztBQUU5QyxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRztJQUM3QyxHQUFHLDJCQUEyQjtJQUM5QixpQ0FBaUM7SUFDakMsa0RBQWtEO0NBQ25ELENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxnQ0FBZ0MsR0FBRztJQUM5QyxHQUFHLDRCQUE0QjtDQUNoQyxDQUFDO0FBVUYsTUFBTSxPQUFPLHVCQUF3QixTQUFRLG1CQUFtQjtJQVJoRTs7UUFZRSxxQkFBZ0IsR0FBRztZQUNqQixHQUFHLEVBQUUsR0FBRztZQUNSLEdBQUcsRUFBRSxHQUFHO1lBQ1IsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLEVBQUUsSUFBSTtZQUNULEdBQUcsRUFBRSxHQUFHO1lBQ1IsR0FBRyxFQUFFLEdBQUc7WUFDUixHQUFHLEVBQUUsR0FBRztZQUNSLEdBQUcsRUFBRSxHQUFHO1NBQ1QsQ0FBQztRQUVGLG1CQUFjLEdBQVcsS0FBSyxDQUFDO1FBQy9CLDJCQUFzQixHQUFXLE9BQU8sQ0FBQztJQWEzQyxDQUFDO0lBWFcsa0JBQWtCO1FBQzFCLE9BQU8sdUJBQXVCLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELE9BQU8sQ0FBQyxRQUFnQjtRQUN0QixPQUFPLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsS0FBSyxRQUFRLENBQUM7SUFDL0UsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUFnQjtRQUN4QixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQyxzQkFBc0IsS0FBSyxRQUFRLENBQUM7SUFDL0csQ0FBQzs7QUExQk0sc0NBQWMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzs7WUFWbEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLHdzRkFBZ0Q7Z0JBRWhELE1BQU0sRUFBRSwrQkFBK0I7Z0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7Z0JBQ3pDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1JFQUxfSU5QVVQsXG4gIERFRkFVTFRfT1VUUFVUU19PX1JFQUxfSU5QVVQsXG4gIE9SZWFsSW5wdXRDb21wb25lbnQsXG59IGZyb20gJy4uL3JlYWwtaW5wdXQvby1yZWFsLWlucHV0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0NVUlJFTkNZX0lOUFVUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1JFQUxfSU5QVVQsXG4gICdjdXJyZW5jeVN5bWJvbDogY3VycmVuY3ktc3ltYm9sJyxcbiAgJ2N1cnJlbmN5U3ltYm9sUG9zaXRpb246IGN1cnJlbmN5LXN5bWJvbC1wb3NpdGlvbidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19DVVJSRU5DWV9JTlBVVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fUkVBTF9JTlBVVFxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jdXJyZW5jeS1pbnB1dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWN1cnJlbmN5LWlucHV0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQ1VSUkVOQ1lfSU5QVVQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0NVUlJFTkNZX0lOUFVULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXG59KVxuZXhwb3J0IGNsYXNzIE9DdXJyZW5jeUlucHV0Q29tcG9uZW50IGV4dGVuZHMgT1JlYWxJbnB1dENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgc3RhdGljIGN1cnJlbmN5X2ljb25zID0gWydVU0QnLCAnRVVSJywgJ0dCUCcsICdJTFMnLCAnSU5SJywgJ0pQWScsICdLUlcnLCAnQlRDJ107XG5cbiAgY3VycmVuY3lfc3ltYm9scyA9IHtcbiAgICBDUkM6ICfigqEnLCAvLyBDb3N0YSBSaWNhbiBDb2zDs25cbiAgICBOR046ICfigqYnLCAvLyBOaWdlcmlhbiBOYWlyYVxuICAgIFBIUDogJ+KCsScsIC8vIFBoaWxpcHBpbmUgUGVzb1xuICAgIFBMTjogJ3rFgicsIC8vIFBvbGlzaCBabG90eVxuICAgIFBZRzogJ+KCsicsIC8vIFBhcmFndWF5YW4gR3VhcmFuaVxuICAgIFRIQjogJ+C4vycsIC8vIFRoYWkgQmFodFxuICAgIFVBSDogJ+KCtCcsIC8vIFVrcmFpbmlhbiBIcnl2bmlhXG4gICAgVk5EOiAn4oKrJywgLy8gVmlldG5hbWVzZSBEb25nXG4gIH07XG5cbiAgY3VycmVuY3lTeW1ib2w6IHN0cmluZyA9ICdFVVInO1xuICBjdXJyZW5jeVN5bWJvbFBvc2l0aW9uOiBzdHJpbmcgPSAncmlnaHQnO1xuXG4gIHByb3RlY3RlZCBleGlzdHNPbnRpbWl6ZUljb24oKSB7XG4gICAgcmV0dXJuIE9DdXJyZW5jeUlucHV0Q29tcG9uZW50LmN1cnJlbmN5X2ljb25zLmluZGV4T2YodGhpcy5jdXJyZW5jeVN5bWJvbCkgIT09IC0xO1xuICB9XG5cbiAgdXNlSWNvbihwb3NpdGlvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZXhpc3RzT250aW1pemVJY29uKCkgJiYgdGhpcy5jdXJyZW5jeVN5bWJvbFBvc2l0aW9uID09PSBwb3NpdGlvbjtcbiAgfVxuXG4gIHVzZVN5bWJvbChwb3NpdGlvbjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVuY3lfc3ltYm9scy5oYXNPd25Qcm9wZXJ0eSh0aGlzLmN1cnJlbmN5U3ltYm9sKSAmJiB0aGlzLmN1cnJlbmN5U3ltYm9sUG9zaXRpb24gPT09IHBvc2l0aW9uO1xuICB9XG59XG4iXX0=