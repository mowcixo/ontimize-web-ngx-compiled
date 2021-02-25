import * as tslib_1 from "tslib";
import { Injector, Pipe } from '@angular/core';
import { OIntegerPipe } from './o-integer.pipe';
var ORealPipe = (function (_super) {
    tslib_1.__extends(ORealPipe, _super);
    function ORealPipe(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        return _this;
    }
    ORealPipe.prototype.transform = function (text, args) {
        return this.numberService.getRealValue(text, args);
    };
    ORealPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'oReal'
                },] }
    ];
    ORealPipe.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return ORealPipe;
}(OIntegerPipe));
export { ORealPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yZWFsLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3BpcGVzL28tcmVhbC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBV2hEO0lBRytCLHFDQUFZO0lBRXpDLG1CQUFzQixRQUFrQjtRQUF4QyxZQUNFLGtCQUFNLFFBQVEsQ0FBQyxTQUNoQjtRQUZxQixjQUFRLEdBQVIsUUFBUSxDQUFVOztJQUV4QyxDQUFDO0lBRUQsNkJBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxJQUF1QjtRQUM3QyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDOztnQkFYRixJQUFJLFNBQUM7b0JBQ0osSUFBSSxFQUFFLE9BQU87aUJBQ2Q7OztnQkFmUSxRQUFROztJQTBCakIsZ0JBQUM7Q0FBQSxBQWJELENBRytCLFlBQVksR0FVMUM7U0FWWSxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0b3IsIFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0ludGVnZXJQaXBlIH0gZnJvbSAnLi9vLWludGVnZXIucGlwZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlYWxQaXBlQXJndW1lbnQge1xuICBncm91cGluZz86IGJvb2xlYW47XG4gIHRob3VzYW5kU2VwYXJhdG9yPzogc3RyaW5nO1xuICBsb2NhbGU/OiBzdHJpbmc7XG4gIGRlY2ltYWxTZXBhcmF0b3I/OiBzdHJpbmc7XG4gIG1pbkRlY2ltYWxEaWdpdHM/OiBudW1iZXI7XG4gIG1heERlY2ltYWxEaWdpdHM/OiBudW1iZXI7XG59XG5cbkBQaXBlKHtcbiAgbmFtZTogJ29SZWFsJ1xufSlcbmV4cG9ydCBjbGFzcyBPUmVhbFBpcGUgZXh0ZW5kcyBPSW50ZWdlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICB9XG5cbiAgdHJhbnNmb3JtKHRleHQ6IHN0cmluZywgYXJnczogSVJlYWxQaXBlQXJndW1lbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm51bWJlclNlcnZpY2UuZ2V0UmVhbFZhbHVlKHRleHQsIGFyZ3MpO1xuICB9XG5cbn1cbiJdfQ==