import { Injectable, Injector } from '@angular/core';
import { Util } from '../util/util';
import { NumberService } from './number.service';
import * as i0 from "@angular/core";
var CurrencyService = (function () {
    function CurrencyService(injector) {
        this.injector = injector;
        this._numberService = this.injector.get(NumberService);
        this._symbol = CurrencyService.DEFAULT_CURRENCY_SYMBOL;
        this._symbolPosition = CurrencyService.DEFAULT_CURRENCY_SYMBOL_POSITION;
    }
    Object.defineProperty(CurrencyService.prototype, "symbol", {
        get: function () {
            return this._symbol;
        },
        set: function (value) {
            this._symbol = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CurrencyService.prototype, "symbolPosition", {
        get: function () {
            return this._symbolPosition;
        },
        set: function (value) {
            this._symbolPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    CurrencyService.prototype.getCurrencyValue = function (value, args) {
        var symbol = args ? args.currencySimbol : undefined;
        var symbolPosition = args ? args.currencySymbolPosition : undefined;
        if (!Util.isDefined(symbol)) {
            symbol = this._symbol;
        }
        if (!Util.isDefined(symbolPosition)) {
            symbolPosition = this._symbolPosition;
        }
        var currencyValue = this._numberService.getRealValue(value, args);
        switch (symbolPosition) {
            case 'left':
                currencyValue = symbol + ' ' + currencyValue;
                break;
            case 'right':
                currencyValue = currencyValue + ' ' + symbol;
                break;
        }
        return currencyValue;
    };
    CurrencyService.DEFAULT_CURRENCY_SYMBOL = '$';
    CurrencyService.DEFAULT_CURRENCY_SYMBOL_POSITION = 'left';
    CurrencyService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    CurrencyService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    CurrencyService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CurrencyService_Factory() { return new CurrencyService(i0.ɵɵinject(i0.INJECTOR)); }, token: CurrencyService, providedIn: "root" });
    return CurrencyService;
}());
export { CurrencyService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3kuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvY3VycmVuY3kuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVyRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7QUFFakQ7SUFhRSx5QkFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFDLHVCQUF1QixDQUFDO1FBQ3ZELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDLGdDQUFnQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxzQkFBSSxtQ0FBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7YUFFRCxVQUFXLEtBQWE7WUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwyQ0FBYzthQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM5QixDQUFDO2FBRUQsVUFBbUIsS0FBYTtZQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUMvQixDQUFDOzs7T0FKQTtJQU1ELDBDQUFnQixHQUFoQixVQUFpQixLQUFVLEVBQUUsSUFBUztRQUNwQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNwRCxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRXBFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzNCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3ZCO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDbkMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7U0FDdkM7UUFDRCxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEUsUUFBUSxjQUFjLEVBQUU7WUFDdEIsS0FBSyxNQUFNO2dCQUNULGFBQWEsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLGFBQWEsQ0FBQztnQkFDN0MsTUFBTTtZQUNSLEtBQUssT0FBTztnQkFDVixhQUFhLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7Z0JBQzdDLE1BQU07U0FDVDtRQUNELE9BQU8sYUFBYSxDQUFDO0lBQ3ZCLENBQUM7SUFuRGEsdUNBQXVCLEdBQUcsR0FBRyxDQUFDO0lBQzlCLGdEQUFnQyxHQUFHLE1BQU0sQ0FBQzs7Z0JBTnpELFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OztnQkFQb0IsUUFBUTs7OzBCQUE3QjtDQStEQyxBQTFERCxJQTBEQztTQXZEWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBOdW1iZXJTZXJ2aWNlIH0gZnJvbSAnLi9udW1iZXIuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIEN1cnJlbmN5U2VydmljZSB7XG5cbiAgcHVibGljIHN0YXRpYyBERUZBVUxUX0NVUlJFTkNZX1NZTUJPTCA9ICckJztcbiAgcHVibGljIHN0YXRpYyBERUZBVUxUX0NVUlJFTkNZX1NZTUJPTF9QT1NJVElPTiA9ICdsZWZ0JztcblxuICBwcm90ZWN0ZWQgX251bWJlclNlcnZpY2U6IE51bWJlclNlcnZpY2U7XG5cbiAgcHJvdGVjdGVkIF9zeW1ib2w6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9zeW1ib2xQb3NpdGlvbjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLl9udW1iZXJTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTnVtYmVyU2VydmljZSk7XG4gICAgLy8gVE9ETzogaW5pdGlhbGl6ZSBmcm9tIGNvbmZpZ1xuICAgIHRoaXMuX3N5bWJvbCA9IEN1cnJlbmN5U2VydmljZS5ERUZBVUxUX0NVUlJFTkNZX1NZTUJPTDtcbiAgICB0aGlzLl9zeW1ib2xQb3NpdGlvbiA9IEN1cnJlbmN5U2VydmljZS5ERUZBVUxUX0NVUlJFTkNZX1NZTUJPTF9QT1NJVElPTjtcbiAgfVxuXG4gIGdldCBzeW1ib2woKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3ltYm9sO1xuICB9XG5cbiAgc2V0IHN5bWJvbCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fc3ltYm9sID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc3ltYm9sUG9zaXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fc3ltYm9sUG9zaXRpb247XG4gIH1cblxuICBzZXQgc3ltYm9sUG9zaXRpb24odmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX3N5bWJvbFBvc2l0aW9uID0gdmFsdWU7XG4gIH1cblxuICBnZXRDdXJyZW5jeVZhbHVlKHZhbHVlOiBhbnksIGFyZ3M6IGFueSkge1xuICAgIGxldCBzeW1ib2wgPSBhcmdzID8gYXJncy5jdXJyZW5jeVNpbWJvbCA6IHVuZGVmaW5lZDtcbiAgICBsZXQgc3ltYm9sUG9zaXRpb24gPSBhcmdzID8gYXJncy5jdXJyZW5jeVN5bWJvbFBvc2l0aW9uIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChzeW1ib2wpKSB7XG4gICAgICBzeW1ib2wgPSB0aGlzLl9zeW1ib2w7XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQoc3ltYm9sUG9zaXRpb24pKSB7XG4gICAgICBzeW1ib2xQb3NpdGlvbiA9IHRoaXMuX3N5bWJvbFBvc2l0aW9uO1xuICAgIH1cbiAgICBsZXQgY3VycmVuY3lWYWx1ZSA9IHRoaXMuX251bWJlclNlcnZpY2UuZ2V0UmVhbFZhbHVlKHZhbHVlLCBhcmdzKTtcbiAgICBzd2l0Y2ggKHN5bWJvbFBvc2l0aW9uKSB7XG4gICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgY3VycmVuY3lWYWx1ZSA9IHN5bWJvbCArICcgJyArIGN1cnJlbmN5VmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICBjdXJyZW5jeVZhbHVlID0gY3VycmVuY3lWYWx1ZSArICcgJyArIHN5bWJvbDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW5jeVZhbHVlO1xuICB9XG5cbn1cbiJdfQ==