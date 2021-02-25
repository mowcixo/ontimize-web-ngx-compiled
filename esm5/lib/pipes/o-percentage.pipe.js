import * as tslib_1 from "tslib";
import { Injector, Pipe } from '@angular/core';
import { ORealPipe } from './o-real.pipe';
var OPercentPipe = (function (_super) {
    tslib_1.__extends(OPercentPipe, _super);
    function OPercentPipe(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        return _this;
    }
    OPercentPipe.prototype.transform = function (text, args) {
        args.valueBase = this.parseValueBase(args.valueBase);
        return this.numberService.getPercentValue(text, args);
    };
    OPercentPipe.prototype.parseValueBase = function (value) {
        var parsed = parseInt(value, 10);
        if (parsed === 1 || parsed === 100) {
            return parsed;
        }
        return 1;
    };
    OPercentPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'oPercent'
                },] }
    ];
    OPercentPipe.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OPercentPipe;
}(ORealPipe));
export { OPercentPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wZXJjZW50YWdlLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3BpcGVzL28tcGVyY2VudGFnZS5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQWMxQztJQUdrQyx3Q0FBUztJQUV6QyxzQkFBc0IsUUFBa0I7UUFBeEMsWUFDRSxrQkFBTSxRQUFRLENBQUMsU0FDaEI7UUFGcUIsY0FBUSxHQUFSLFFBQVEsQ0FBVTs7SUFFeEMsQ0FBQztJQUVELGdDQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsSUFBMEI7UUFDaEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRVMscUNBQWMsR0FBeEIsVUFBeUIsS0FBK0I7UUFDdEQsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMxQyxJQUFJLE1BQU0sS0FBSyxDQUFDLElBQUksTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUNsQyxPQUFPLE1BQU0sQ0FBQztTQUNmO1FBQ0QsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOztnQkFwQkYsSUFBSSxTQUFDO29CQUNKLElBQUksRUFBRSxVQUFVO2lCQUNqQjs7O2dCQWxCUSxRQUFROztJQXNDakIsbUJBQUM7Q0FBQSxBQXRCRCxDQUdrQyxTQUFTLEdBbUIxQztTQW5CWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0b3IsIFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1JlYWxQaXBlIH0gZnJvbSAnLi9vLXJlYWwucGlwZSc7XG5cbmV4cG9ydCB0eXBlIE9QZXJjZW50YWdlVmFsdWVCYXNlVHlwZSA9IDEgfCAxMDA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBlcmNlbnRQaXBlQXJndW1lbnQge1xuICBncm91cGluZz86IGJvb2xlYW47XG4gIHRob3VzYW5kU2VwYXJhdG9yPzogc3RyaW5nO1xuICBsb2NhbGU/OiBzdHJpbmc7XG4gIGRlY2ltYWxTZXBhcmF0b3I/OiBzdHJpbmc7XG4gIG1pbkRlY2ltYWxEaWdpdHM/OiBudW1iZXI7XG4gIG1heERlY2ltYWxEaWdpdHM/OiBudW1iZXI7XG4gIHZhbHVlQmFzZT86IE9QZXJjZW50YWdlVmFsdWVCYXNlVHlwZTtcbn1cblxuQFBpcGUoe1xuICBuYW1lOiAnb1BlcmNlbnQnXG59KVxuZXhwb3J0IGNsYXNzIE9QZXJjZW50UGlwZSBleHRlbmRzIE9SZWFsUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gIH1cblxuICB0cmFuc2Zvcm0odGV4dDogc3RyaW5nLCBhcmdzOiBJUGVyY2VudFBpcGVBcmd1bWVudCk6IHN0cmluZyB7XG4gICAgYXJncy52YWx1ZUJhc2UgPSB0aGlzLnBhcnNlVmFsdWVCYXNlKGFyZ3MudmFsdWVCYXNlKTtcbiAgICByZXR1cm4gdGhpcy5udW1iZXJTZXJ2aWNlLmdldFBlcmNlbnRWYWx1ZSh0ZXh0LCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJzZVZhbHVlQmFzZSh2YWx1ZTogT1BlcmNlbnRhZ2VWYWx1ZUJhc2VUeXBlKTogT1BlcmNlbnRhZ2VWYWx1ZUJhc2VUeXBlIHtcbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludCh2YWx1ZSBhcyBhbnksIDEwKTtcbiAgICBpZiAocGFyc2VkID09PSAxIHx8IHBhcnNlZCA9PT0gMTAwKSB7XG4gICAgICByZXR1cm4gcGFyc2VkO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbiAgfVxuXG59XG4iXX0=