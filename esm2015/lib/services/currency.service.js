import { Injectable, Injector } from '@angular/core';
import { Util } from '../util/util';
import { NumberService } from './number.service';
import * as i0 from "@angular/core";
export class CurrencyService {
    constructor(injector) {
        this.injector = injector;
        this._numberService = this.injector.get(NumberService);
        this._symbol = CurrencyService.DEFAULT_CURRENCY_SYMBOL;
        this._symbolPosition = CurrencyService.DEFAULT_CURRENCY_SYMBOL_POSITION;
    }
    get symbol() {
        return this._symbol;
    }
    set symbol(value) {
        this._symbol = value;
    }
    get symbolPosition() {
        return this._symbolPosition;
    }
    set symbolPosition(value) {
        this._symbolPosition = value;
    }
    getCurrencyValue(value, args) {
        let symbol = args ? args.currencySimbol : undefined;
        let symbolPosition = args ? args.currencySymbolPosition : undefined;
        if (!Util.isDefined(symbol)) {
            symbol = this._symbol;
        }
        if (!Util.isDefined(symbolPosition)) {
            symbolPosition = this._symbolPosition;
        }
        let currencyValue = this._numberService.getRealValue(value, args);
        switch (symbolPosition) {
            case 'left':
                currencyValue = symbol + ' ' + currencyValue;
                break;
            case 'right':
                currencyValue = currencyValue + ' ' + symbol;
                break;
        }
        return currencyValue;
    }
}
CurrencyService.DEFAULT_CURRENCY_SYMBOL = '$';
CurrencyService.DEFAULT_CURRENCY_SYMBOL_POSITION = 'left';
CurrencyService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
CurrencyService.ctorParameters = () => [
    { type: Injector }
];
CurrencyService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CurrencyService_Factory() { return new CurrencyService(i0.ɵɵinject(i0.INJECTOR)); }, token: CurrencyService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3kuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvY3VycmVuY3kuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7QUFLakQsTUFBTSxPQUFPLGVBQWU7SUFVMUIsWUFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDLHVCQUF1QixDQUFDO1FBQ3ZELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLGdDQUFnQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksY0FBYyxDQUFDLEtBQWE7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQVUsRUFBRSxJQUFTO1FBQ3BDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3BELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDM0IsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNuQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUN2QztRQUNELElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsRSxRQUFRLGNBQWMsRUFBRTtZQUN0QixLQUFLLE1BQU07Z0JBQ1QsYUFBYSxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFDO2dCQUM3QyxNQUFNO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLGFBQWEsR0FBRyxhQUFhLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztnQkFDN0MsTUFBTTtTQUNUO1FBQ0QsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQzs7QUFuRGEsdUNBQXVCLEdBQUcsR0FBRyxDQUFDO0FBQzlCLGdEQUFnQyxHQUFHLE1BQU0sQ0FBQzs7WUFOekQsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7WUFQb0IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgTnVtYmVyU2VydmljZSB9IGZyb20gJy4vbnVtYmVyLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDdXJyZW5jeVNlcnZpY2Uge1xuXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9DVVJSRU5DWV9TWU1CT0wgPSAnJCc7XG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9DVVJSRU5DWV9TWU1CT0xfUE9TSVRJT04gPSAnbGVmdCc7XG5cbiAgcHJvdGVjdGVkIF9udW1iZXJTZXJ2aWNlOiBOdW1iZXJTZXJ2aWNlO1xuXG4gIHByb3RlY3RlZCBfc3ltYm9sOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfc3ltYm9sUG9zaXRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5fbnVtYmVyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE51bWJlclNlcnZpY2UpO1xuICAgIC8vIFRPRE86IGluaXRpYWxpemUgZnJvbSBjb25maWdcbiAgICB0aGlzLl9zeW1ib2wgPSBDdXJyZW5jeVNlcnZpY2UuREVGQVVMVF9DVVJSRU5DWV9TWU1CT0w7XG4gICAgdGhpcy5fc3ltYm9sUG9zaXRpb24gPSBDdXJyZW5jeVNlcnZpY2UuREVGQVVMVF9DVVJSRU5DWV9TWU1CT0xfUE9TSVRJT047XG4gIH1cblxuICBnZXQgc3ltYm9sKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bWJvbDtcbiAgfVxuXG4gIHNldCBzeW1ib2wodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3N5bWJvbCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHN5bWJvbFBvc2l0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bWJvbFBvc2l0aW9uO1xuICB9XG5cbiAgc2V0IHN5bWJvbFBvc2l0aW9uKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zeW1ib2xQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0Q3VycmVuY3lWYWx1ZSh2YWx1ZTogYW55LCBhcmdzOiBhbnkpIHtcbiAgICBsZXQgc3ltYm9sID0gYXJncyA/IGFyZ3MuY3VycmVuY3lTaW1ib2wgOiB1bmRlZmluZWQ7XG4gICAgbGV0IHN5bWJvbFBvc2l0aW9uID0gYXJncyA/IGFyZ3MuY3VycmVuY3lTeW1ib2xQb3NpdGlvbiA6IHVuZGVmaW5lZDtcblxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc3ltYm9sKSkge1xuICAgICAgc3ltYm9sID0gdGhpcy5fc3ltYm9sO1xuICAgIH1cbiAgICBpZiAoIVV0aWwuaXNEZWZpbmVkKHN5bWJvbFBvc2l0aW9uKSkge1xuICAgICAgc3ltYm9sUG9zaXRpb24gPSB0aGlzLl9zeW1ib2xQb3NpdGlvbjtcbiAgICB9XG4gICAgbGV0IGN1cnJlbmN5VmFsdWUgPSB0aGlzLl9udW1iZXJTZXJ2aWNlLmdldFJlYWxWYWx1ZSh2YWx1ZSwgYXJncyk7XG4gICAgc3dpdGNoIChzeW1ib2xQb3NpdGlvbikge1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIGN1cnJlbmN5VmFsdWUgPSBzeW1ib2wgKyAnICcgKyBjdXJyZW5jeVZhbHVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgY3VycmVuY3lWYWx1ZSA9IGN1cnJlbmN5VmFsdWUgKyAnICcgKyBzeW1ib2w7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVuY3lWYWx1ZTtcbiAgfVxuXG59XG4iXX0=