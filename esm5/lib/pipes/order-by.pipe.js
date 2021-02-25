import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var OrderByPipe = (function () {
    function OrderByPipe() {
    }
    OrderByPipe._orderByComparator = function (a, b) {
        if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
            if (a.toLowerCase() < b.toLowerCase()) {
                return -1;
            }
            if (a.toLowerCase() > b.toLowerCase()) {
                return 1;
            }
        }
        else {
            if (parseFloat(a) < parseFloat(b)) {
                return -1;
            }
            if (parseFloat(a) > parseFloat(b)) {
                return 1;
            }
        }
        return 0;
    };
    OrderByPipe.prototype.transform = function (input, _a) {
        var _b = tslib_1.__read(_a, 1), _c = _b[0], config = _c === void 0 ? '+' : _c;
        if (!Array.isArray(input)) {
            return input;
        }
        if (!Array.isArray(config) || (Array.isArray(config) && config.length === 1)) {
            var propertyToCheck = !Array.isArray(config) ? config : config[0];
            var desc_1 = propertyToCheck.substr(0, 1) === '-';
            if (!propertyToCheck || propertyToCheck === '-' || propertyToCheck === '+') {
                return !desc_1 ? input.sort() : input.sort().reverse();
            }
            else {
                var property_1 = propertyToCheck.substr(0, 1) === '+' || propertyToCheck.substr(0, 1) === '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;
                return input.sort(function (a, b) {
                    return !desc_1
                        ? OrderByPipe._orderByComparator(a[property_1], b[property_1])
                        : -OrderByPipe._orderByComparator(a[property_1], b[property_1]);
                });
            }
        }
        else {
            return input.sort(function (a, b) {
                for (var i = 0; i < config.length; i++) {
                    var desc = config[i].substr(0, 1) === '-';
                    var property = config[i].substr(0, 1) === '+' || config[i].substr(0, 1) === '-'
                        ? config[i].substr(1)
                        : config[i];
                    var comparison = !desc
                        ? OrderByPipe._orderByComparator(a[property], b[property])
                        : -OrderByPipe._orderByComparator(a[property], b[property]);
                    if (comparison = 0) {
                        return comparison;
                    }
                }
                return 0;
            });
        }
    };
    OrderByPipe.decorators = [
        { type: Pipe, args: [{ name: 'orderBy', pure: false },] }
    ];
    return OrderByPipe;
}());
export { OrderByPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItYnkucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvb3JkZXItYnkucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFcEQ7SUFBQTtJQThEQSxDQUFDO0lBMURRLDhCQUFrQixHQUF6QixVQUEwQixDQUFNLEVBQUUsQ0FBTTtRQUV0QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUVwRixJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUFFO1lBQ3JELElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFBRSxPQUFPLENBQUMsQ0FBQzthQUFFO1NBQ3JEO2FBQU07WUFFTCxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUFFO1lBQ2pELElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFBRSxPQUFPLENBQUMsQ0FBQzthQUFFO1NBQ2pEO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsK0JBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxFQUFjO1lBQWQsMEJBQWMsRUFBYixVQUFZLEVBQVosaUNBQVk7UUFFakMsSUFBSSxD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LEVBQUU7d0JBQUUsT0FBTyxVQUFVLENBQUM7cUJBQUU7aUJBQzNDO2dCQUVELE9BQU8sQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7O2dCQTdERixJQUFJLFNBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7O0lBOER0QyxrQkFBQztDQUFBLEFBOURELElBOERDO1NBNURZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHsgbmFtZTogJ29yZGVyQnknLCBwdXJlOiBmYWxzZSB9KVxuXG5leHBvcnQgY2xhc3MgT3JkZXJCeVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICBzdGF0aWMgX29yZGVyQnlDb21wYXJhdG9yKGE6IGFueSwgYjogYW55KTogbnVtYmVyIHtcblxuICAgIGlmICgoaXNOYU4ocGFyc2VGbG9hdChhKSkgfHwgIWlzRmluaXRlKGEpKSB8fCAoaXNOYU4ocGFyc2VGbG9hdChiKSkgfHwgIWlzRmluaXRlKGIpKSkge1xuICAgICAgLy8gSXNuJ3QgYSBudW1iZXIgc28gbG93ZXJjYXNlIHRoZSBzdHJpbmcgdG8gcHJvcGVybHkgY29tcGFyZVxuICAgICAgaWYgKGEudG9Mb3dlckNhc2UoKSA8IGIudG9Mb3dlckNhc2UoKSkgeyByZXR1cm4gLTE7IH1cbiAgICAgIGlmIChhLnRvTG93ZXJDYXNlKCkgPiBiLnRvTG93ZXJDYXNlKCkpIHsgcmV0dXJuIDE7IH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUGFyc2Ugc3RyaW5ncyBhcyBudW1iZXJzIHRvIGNvbXBhcmUgcHJvcGVybHlcbiAgICAgIGlmIChwYXJzZUZsb2F0KGEpIDwgcGFyc2VGbG9hdChiKSkgeyByZXR1cm4gLTE7IH1cbiAgICAgIGlmIChwYXJzZUZsb2F0KGEpID4gcGFyc2VGbG9hdChiKSkgeyByZXR1cm4gMTsgfVxuICAgIH1cblxuICAgIHJldHVybiAwOyAvLyBlcXVhbCBlYWNoIG90aGVyXG4gIH1cblxuICB0cmFuc2Zvcm0oaW5wdXQ6IGFueSwgW2NvbmZpZyA9ICcrJ10pOiBhbnkge1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGlucHV0KSkgeyByZXR1cm4gaW5wdXQ7IH1cblxuICAgIGlmICghQXJyYXkuaXNBcnJheShjb25maWcpIHx8IChBcnJheS5pc0FycmF5KGNvbmZpZykgJiYgY29uZmlnLmxlbmd0aCA9PT0gMSkpIHtcbiAgICAgIGNvbnN0IHByb3BlcnR5VG9DaGVjazogc3RyaW5nID0gIUFycmF5LmlzQXJyYXkoY29uZmlnKSA/IGNvbmZpZyA6IGNvbmZpZ1swXTtcbiAgICAgIGNvbnN0IGRlc2MgPSBwcm9wZXJ0eVRvQ2hlY2suc3Vic3RyKDAsIDEpID09PSAnLSc7XG5cbiAgICAgIC8vIEJhc2ljIGFycmF5XG4gICAgICBpZiAoIXByb3BlcnR5VG9DaGVjayB8fCBwcm9wZXJ0eVRvQ2hlY2sgPT09ICctJyB8fCBwcm9wZXJ0eVRvQ2hlY2sgPT09ICcrJykge1xuICAgICAgICByZXR1cm4gIWRlc2MgPyBpbnB1dC5zb3J0KCkgOiBpbnB1dC5zb3J0KCkucmV2ZXJzZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvcGVydHk6IHN0cmluZyA9IHByb3BlcnR5VG9DaGVjay5zdWJzdHIoMCwgMSkgPT09ICcrJyB8fCBwcm9wZXJ0eVRvQ2hlY2suc3Vic3RyKDAsIDEpID09PSAnLSdcbiAgICAgICAgICA/IHByb3BlcnR5VG9DaGVjay5zdWJzdHIoMSlcbiAgICAgICAgICA6IHByb3BlcnR5VG9DaGVjaztcblxuICAgICAgICByZXR1cm4gaW5wdXQuc29ydCgoYTogYW55LCBiOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gIWRlc2NcbiAgICAgICAgICAgID8gT3JkZXJCeVBpcGUuX29yZGVyQnlDb21wYXJhdG9yKGFbcHJvcGVydHldLCBiW3Byb3BlcnR5XSlcbiAgICAgICAgICAgIDogLU9yZGVyQnlQaXBlLl9vcmRlckJ5Q29tcGFyYXRvcihhW3Byb3BlcnR5XSwgYltwcm9wZXJ0eV0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTG9vcCBvdmVyIHByb3BlcnR5IG9mIHRoZSBhcnJheSBpbiBvcmRlciBhbmQgc29ydFxuICAgICAgcmV0dXJuIGlucHV0LnNvcnQoKGE6IGFueSwgYjogYW55KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBjb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBkZXNjID0gY29uZmlnW2ldLnN1YnN0cigwLCAxKSA9PT0gJy0nO1xuICAgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gY29uZmlnW2ldLnN1YnN0cigwLCAxKSA9PT0gJysnIHx8IGNvbmZpZ1tpXS5zdWJzdHIoMCwgMSkgPT09ICctJ1xuICAgICAgICAgICAgPyBjb25maWdbaV0uc3Vic3RyKDEpXG4gICAgICAgICAgICA6IGNvbmZpZ1tpXTtcblxuICAgICAgICAgIGxldCBjb21wYXJpc29uID0gIWRlc2NcbiAgICAgICAgICAgID8gT3JkZXJCeVBpcGUuX29yZGVyQnlDb21wYXJhdG9yKGFbcHJvcGVydHldLCBiW3Byb3BlcnR5XSlcbiAgICAgICAgICAgIDogLU9yZGVyQnlQaXBlLl9vcmRlckJ5Q29tcGFyYXRvcihhW3Byb3BlcnR5XSwgYltwcm9wZXJ0eV0pO1xuXG4gICAgICAgICAgLy8gRG9uJ3QgcmV0dXJuIDAgeWV0IGluIGNhc2Ugb2YgbmVlZGluZyB0byBzb3J0IGJ5IG5leHQgcHJvcGVydHlcbiAgICAgICAgICBpZiAoY29tcGFyaXNvbiA9IDApIHsgcmV0dXJuIGNvbXBhcmlzb247IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwOyAvLyBlcXVhbCBlYWNoIG90aGVyXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuIl19