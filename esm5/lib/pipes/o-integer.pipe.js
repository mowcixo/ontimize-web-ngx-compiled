import { Injector, Pipe } from '@angular/core';
import { NumberService } from '../services/number.service';
var OIntegerPipe = (function () {
    function OIntegerPipe(injector) {
        this.injector = injector;
        this.numberService = this.injector.get(NumberService);
    }
    OIntegerPipe.prototype.transform = function (text, args) {
        return this.numberService.getIntegerValue(text, args);
    };
    OIntegerPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'oInteger'
                },] }
    ];
    OIntegerPipe.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OIntegerPipe;
}());
export { OIntegerPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbnRlZ2VyLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3BpcGVzL28taW50ZWdlci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFRM0Q7SUFRRSxzQkFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxnQ0FBUyxHQUFULFVBQVUsSUFBWSxFQUFFLElBQTBCO1FBQ2hELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7O2dCQWRGLElBQUksU0FBQztvQkFDSixJQUFJLEVBQUUsVUFBVTtpQkFDakI7OztnQkFaUSxRQUFROztJQXlCakIsbUJBQUM7Q0FBQSxBQWZELElBZUM7U0FYWSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0b3IsIFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTnVtYmVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL251bWJlci5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJSW50ZWdlclBpcGVBcmd1bWVudCB7XG4gIGdyb3VwaW5nPzogYm9vbGVhbjtcbiAgdGhvdXNhbmRTZXBhcmF0b3I/OiBzdHJpbmc7XG4gIGxvY2FsZT86IHN0cmluZztcbn1cblxuQFBpcGUoe1xuICBuYW1lOiAnb0ludGVnZXInXG59KVxuXG5leHBvcnQgY2xhc3MgT0ludGVnZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgcHJvdGVjdGVkIG51bWJlclNlcnZpY2U6IE51bWJlclNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMubnVtYmVyU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE51bWJlclNlcnZpY2UpO1xuICB9XG5cbiAgdHJhbnNmb3JtKHRleHQ6IHN0cmluZywgYXJnczogSUludGVnZXJQaXBlQXJndW1lbnQpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm51bWJlclNlcnZpY2UuZ2V0SW50ZWdlclZhbHVlKHRleHQsIGFyZ3MpO1xuICB9XG59XG4iXX0=