import { Injectable, Injector } from '@angular/core';
import { AppConfig } from '../config/app-config';
import { Util } from '../util/util';
import * as i0 from "@angular/core";
export class NumberService {
    constructor(injector) {
        this.injector = injector;
        this._config = this.injector.get(AppConfig).getConfiguration();
        this._minDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
        this._maxDecimalDigits = NumberService.DEFAULT_DECIMAL_DIGITS;
        this._grouping = true;
        this._locale = this._config.locale;
    }
    get grouping() {
        return this._grouping;
    }
    set grouping(value) {
        this._grouping = value;
    }
    get minDecimalDigits() {
        return this._minDecimalDigits;
    }
    set minDecimalDigits(value) {
        this._minDecimalDigits = value;
    }
    get maxDecimalDigits() {
        return this._maxDecimalDigits;
    }
    set maxDecimalDigits(value) {
        this._maxDecimalDigits = value;
    }
    get locale() {
        return this._locale;
    }
    set locale(value) {
        this._locale = value;
    }
    getIntegerValue(value, args) {
        const grouping = args ? args.grouping : undefined;
        if (!Util.isDefined(value) && !Util.isDefined(grouping) || !grouping) {
            return value;
        }
        const thousandSeparator = args ? args.thousandSeparator : undefined;
        const locale = args ? args.locale : undefined;
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
            return void 0;
        }
        let formattedIntValue;
        if (Util.isDefined(locale)) {
            formattedIntValue = new Intl.NumberFormat(locale).format(intValue);
        }
        else if (!Util.isDefined(thousandSeparator)) {
            formattedIntValue = new Intl.NumberFormat(this._locale).format(intValue);
        }
        else {
            formattedIntValue = String(intValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
        }
        return formattedIntValue;
    }
    getRealValue(value, args) {
        const grouping = args ? args.grouping : undefined;
        if (!Util.isDefined(value) && !Util.isDefined(grouping) || !grouping) {
            return value;
        }
        const locale = args ? args.locale : undefined;
        const thousandSeparator = args ? args.thousandSeparator : undefined;
        const decimalSeparator = args ? args.decimalSeparator : undefined;
        let minDecimalDigits = args ? args.minDecimalDigits : undefined;
        let maxDecimalDigits = args ? args.maxDecimalDigits : undefined;
        if (!Util.isDefined(minDecimalDigits)) {
            minDecimalDigits = this._minDecimalDigits;
        }
        if (!Util.isDefined(maxDecimalDigits)) {
            maxDecimalDigits = this._maxDecimalDigits;
        }
        let formattedRealValue = value;
        const formatterArgs = {
            minimumFractionDigits: minDecimalDigits,
            maximumFractionDigits: maxDecimalDigits
        };
        if (Util.isDefined(locale)) {
            formattedRealValue = new Intl.NumberFormat(locale, formatterArgs).format(value);
        }
        else if (!Util.isDefined(thousandSeparator) || !Util.isDefined(decimalSeparator)) {
            formattedRealValue = new Intl.NumberFormat(this._locale, formatterArgs).format(value);
        }
        else {
            const realValue = parseFloat(value);
            if (!isNaN(realValue)) {
                formattedRealValue = String(realValue);
                let tmpStr = realValue.toFixed(maxDecimalDigits);
                tmpStr = tmpStr.replace('.', decimalSeparator);
                if (grouping) {
                    const parts = tmpStr.split(decimalSeparator);
                    if (parts.length > 0) {
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
                        formattedRealValue = parts.join(decimalSeparator);
                    }
                }
                else {
                    formattedRealValue = tmpStr;
                }
            }
        }
        return formattedRealValue;
    }
    getPercentValue(value, args) {
        const valueBase = args ? args.valueBase : undefined;
        let parsedValue = value;
        switch (valueBase) {
            case 100:
                break;
            case 1:
            default:
                parsedValue = parsedValue * 100;
                break;
        }
        const formattedPercentValue = this.getRealValue(parsedValue, args) + ' %';
        return formattedPercentValue;
    }
}
NumberService.DEFAULT_DECIMAL_DIGITS = 2;
NumberService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
NumberService.ctorParameters = () => [
    { type: Injector }
];
NumberService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NumberService_Factory() { return new NumberService(i0.ɵɵinject(i0.INJECTOR)); }, token: NumberService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL251bWJlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXJELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUVqRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQUtwQyxNQUFNLE9BQU8sYUFBYTtJQVV4QixZQUFzQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3RDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUUvRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxDQUFDLHNCQUFzQixDQUFDO1FBQzlELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsc0JBQXNCLENBQUM7UUFFOUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxLQUFjO1FBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFhO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FB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QUFDOztZQUwxQyxVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQVJvQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQXBwQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2FwcC1jb25maWcnO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vdHlwZXMvY29uZmlnLnR5cGUnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE51bWJlclNlcnZpY2Uge1xuXG4gIHB1YmxpYyBzdGF0aWMgREVGQVVMVF9ERUNJTUFMX0RJR0lUUyA9IDI7XG5cbiAgcHJvdGVjdGVkIF9ncm91cGluZzogYm9vbGVhbjtcbiAgcHJvdGVjdGVkIF9taW5EZWNpbWFsRGlnaXRzOiBudW1iZXI7XG4gIHByb3RlY3RlZCBfbWF4RGVjaW1hbERpZ2l0czogbnVtYmVyO1xuICBwcm90ZWN0ZWQgX2xvY2FsZTogc3RyaW5nO1xuICBwcml2YXRlIF9jb25maWc6IENvbmZpZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5fY29uZmlnID0gdGhpcy5pbmplY3Rvci5nZXQoQXBwQ29uZmlnKS5nZXRDb25maWd1cmF0aW9uKCk7XG4gICAgLy8gVE9ETzogaW5pdGlhbGl6ZSBmcm9tIGNvbmZpZ1xuICAgIHRoaXMuX21pbkRlY2ltYWxEaWdpdHMgPSBOdW1iZXJTZXJ2aWNlLkRFRkFVTFRfREVDSU1BTF9ESUdJVFM7XG4gICAgdGhpcy5fbWF4RGVjaW1hbERpZ2l0cyA9IE51bWJlclNlcnZpY2UuREVGQVVMVF9ERUNJTUFMX0RJR0lUUztcblxuICAgIHRoaXMuX2dyb3VwaW5nID0gdHJ1ZTtcbiAgICB0aGlzLl9sb2NhbGUgPSB0aGlzLl9jb25maWcubG9jYWxlO1xuICB9XG5cbiAgZ2V0IGdyb3VwaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9ncm91cGluZztcbiAgfVxuXG4gIHNldCBncm91cGluZyh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2dyb3VwaW5nID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbWluRGVjaW1hbERpZ2l0cygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9taW5EZWNpbWFsRGlnaXRzO1xuICB9XG5cbiAgc2V0IG1pbkRlY2ltYWxEaWdpdHModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX21pbkRlY2ltYWxEaWdpdHMgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBtYXhEZWNpbWFsRGlnaXRzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX21heERlY2ltYWxEaWdpdHM7XG4gIH1cblxuICBzZXQgbWF4RGVjaW1hbERpZ2l0cyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fbWF4RGVjaW1hbERpZ2l0cyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGxvY2FsZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gIH1cblxuICBzZXQgbG9jYWxlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9sb2NhbGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldEludGVnZXJWYWx1ZSh2YWx1ZTogYW55LCBhcmdzOiBhbnkpIHtcbiAgICBjb25zdCBncm91cGluZyA9IGFyZ3MgPyBhcmdzLmdyb3VwaW5nIDogdW5kZWZpbmVkO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodmFsdWUpICYmICFVdGlsLmlzRGVmaW5lZChncm91cGluZykgfHwgIWdyb3VwaW5nKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gYXJncyA/IGFyZ3MudGhvdXNhbmRTZXBhcmF0b3IgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgbG9jYWxlID0gYXJncyA/IGFyZ3MubG9jYWxlIDogdW5kZWZpbmVkO1xuICAgIC8vIEVuc3VyZSB2YWx1ZSBpcyBhbiBpbnRlZ2VyXG4gICAgY29uc3QgaW50VmFsdWU6IGFueSA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG4gICAgaWYgKGlzTmFOKGludFZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9XG4gICAgLy8gRm9ybWF0IHZhbHVlXG4gICAgbGV0IGZvcm1hdHRlZEludFZhbHVlO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChsb2NhbGUpKSB7XG4gICAgICBmb3JtYXR0ZWRJbnRWYWx1ZSA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChsb2NhbGUpLmZvcm1hdChpbnRWYWx1ZSk7XG4gICAgfSBlbHNlIGlmICghVXRpbC5pc0RlZmluZWQodGhvdXNhbmRTZXBhcmF0b3IpKSB7XG4gICAgICBmb3JtYXR0ZWRJbnRWYWx1ZSA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCh0aGlzLl9sb2NhbGUpLmZvcm1hdChpbnRWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvcm1hdHRlZEludFZhbHVlID0gU3RyaW5nKGludFZhbHVlKS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICB9XG4gICAgcmV0dXJuIGZvcm1hdHRlZEludFZhbHVlO1xuICB9XG5cbiAgZ2V0UmVhbFZhbHVlKHZhbHVlOiBhbnksIGFyZ3M6IGFueSkge1xuICAgIGNvbnN0IGdyb3VwaW5nID0gYXJncyA/IGFyZ3MuZ3JvdXBpbmcgOiB1bmRlZmluZWQ7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgJiYgIVV0aWwuaXNEZWZpbmVkKGdyb3VwaW5nKSB8fCAhZ3JvdXBpbmcpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc3QgbG9jYWxlID0gYXJncyA/IGFyZ3MubG9jYWxlIDogdW5kZWZpbmVkO1xuICAgIGNvbnN0IHRob3VzYW5kU2VwYXJhdG9yID0gYXJncyA/IGFyZ3MudGhvdXNhbmRTZXBhcmF0b3IgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgZGVjaW1hbFNlcGFyYXRvciA9IGFyZ3MgPyBhcmdzLmRlY2ltYWxTZXBhcmF0b3IgOiB1bmRlZmluZWQ7XG5cbiAgICBsZXQgbWluRGVjaW1hbERpZ2l0cyA9IGFyZ3MgPyBhcmdzLm1pbkRlY2ltYWxEaWdpdHMgOiB1bmRlZmluZWQ7XG4gICAgbGV0IG1heERlY2ltYWxEaWdpdHMgPSBhcmdzID8gYXJncy5tYXhEZWNpbWFsRGlnaXRzIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZChtaW5EZWNpbWFsRGlnaXRzKSkge1xuICAgICAgbWluRGVjaW1hbERpZ2l0cyA9IHRoaXMuX21pbkRlY2ltYWxEaWdpdHM7XG4gICAgfVxuICAgIGlmICghVXRpbC5pc0RlZmluZWQobWF4RGVjaW1hbERpZ2l0cykpIHtcbiAgICAgIG1heERlY2ltYWxEaWdpdHMgPSB0aGlzLl9tYXhEZWNpbWFsRGlnaXRzO1xuICAgIH1cblxuICAgIGxldCBmb3JtYXR0ZWRSZWFsVmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBmb3JtYXR0ZXJBcmdzID0ge1xuICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiBtaW5EZWNpbWFsRGlnaXRzLFxuICAgICAgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiBtYXhEZWNpbWFsRGlnaXRzXG4gICAgfTtcblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChsb2NhbGUpKSB7XG4gICAgICBmb3JtYXR0ZWRSZWFsVmFsdWUgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlLCBmb3JtYXR0ZXJBcmdzKS5mb3JtYXQodmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoIVV0aWwuaXNEZWZpbmVkKHRob3VzYW5kU2VwYXJhdG9yKSB8fCAhVXRpbC5pc0RlZmluZWQoZGVjaW1hbFNlcGFyYXRvcikpIHtcbiAgICAgIGZvcm1hdHRlZFJlYWxWYWx1ZSA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCh0aGlzLl9sb2NhbGUsIGZvcm1hdHRlckFyZ3MpLmZvcm1hdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlYWxWYWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgaWYgKCFpc05hTihyZWFsVmFsdWUpKSB7XG4gICAgICAgIGZvcm1hdHRlZFJlYWxWYWx1ZSA9IFN0cmluZyhyZWFsVmFsdWUpO1xuICAgICAgICBsZXQgdG1wU3RyID0gcmVhbFZhbHVlLnRvRml4ZWQobWF4RGVjaW1hbERpZ2l0cyk7XG4gICAgICAgIHRtcFN0ciA9IHRtcFN0ci5yZXBsYWNlKCcuJywgZGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICAgIGlmIChncm91cGluZykge1xuICAgICAgICAgIGNvbnN0IHBhcnRzID0gdG1wU3RyLnNwbGl0KGRlY2ltYWxTZXBhcmF0b3IpO1xuICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJ0c1swXSA9IHBhcnRzWzBdLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csIHRob3VzYW5kU2VwYXJhdG9yKTtcbiAgICAgICAgICAgIGZvcm1hdHRlZFJlYWxWYWx1ZSA9IHBhcnRzLmpvaW4oZGVjaW1hbFNlcGFyYXRvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1hdHRlZFJlYWxWYWx1ZSA9IHRtcFN0cjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0dGVkUmVhbFZhbHVlO1xuICB9XG5cbiAgZ2V0UGVyY2VudFZhbHVlKHZhbHVlOiBhbnksIGFyZ3M6IGFueSkge1xuICAgIGNvbnN0IHZhbHVlQmFzZSA9IGFyZ3MgPyBhcmdzLnZhbHVlQmFzZSA6IHVuZGVmaW5lZDtcbiAgICBsZXQgcGFyc2VkVmFsdWUgPSB2YWx1ZTtcbiAgICBzd2l0Y2ggKHZhbHVlQmFzZSkge1xuICAgICAgY2FzZSAxMDA6XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGFyc2VkVmFsdWUgPSBwYXJzZWRWYWx1ZSAqIDEwMDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGZvcm1hdHRlZFBlcmNlbnRWYWx1ZSA9IHRoaXMuZ2V0UmVhbFZhbHVlKHBhcnNlZFZhbHVlLCBhcmdzKSArICcgJSc7XG4gICAgcmV0dXJuIGZvcm1hdHRlZFBlcmNlbnRWYWx1ZTtcbiAgfVxuXG59XG4iXX0=