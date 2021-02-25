import { Injector, Pipe } from '@angular/core';
import { MomentService } from '../services/moment.service';
var OMomentPipe = (function () {
    function OMomentPipe(injector) {
        this.injector = injector;
        this.momentService = this.injector.get(MomentService);
    }
    OMomentPipe.prototype.transform = function (value, args) {
        var format = args.format;
        return this.momentService.parseDate(value, format);
    };
    OMomentPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'oMoment'
                },] }
    ];
    OMomentPipe.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OMomentPipe;
}());
export { OMomentPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tb21lbnQucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvby1tb21lbnQucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFOUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBTTNEO0lBUUUscUJBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsK0JBQVMsR0FBVCxVQUFVLEtBQVUsRUFBRSxJQUF5QjtRQUM3QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7O2dCQWZGLElBQUksU0FBQztvQkFDSixJQUFJLEVBQUUsU0FBUztpQkFDaEI7OztnQkFWUSxRQUFROztJQXdCakIsa0JBQUM7Q0FBQSxBQWhCRCxJQWdCQztTQVpZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RvciwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBNb21lbnRTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbW9tZW50LnNlcnZpY2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElNb21lbnRQaXBlQXJndW1lbnQge1xuICBmb3JtYXQ/OiBzdHJpbmc7XG59XG5cbkBQaXBlKHtcbiAgbmFtZTogJ29Nb21lbnQnXG59KVxuXG5leHBvcnQgY2xhc3MgT01vbWVudFBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICBwcm90ZWN0ZWQgbW9tZW50U2VydmljZTogTW9tZW50U2VydmljZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5tb21lbnRTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTW9tZW50U2VydmljZSk7XG4gIH1cblxuICB0cmFuc2Zvcm0odmFsdWU6IGFueSwgYXJnczogSU1vbWVudFBpcGVBcmd1bWVudCkge1xuICAgIGNvbnN0IGZvcm1hdCA9IGFyZ3MuZm9ybWF0O1xuICAgIHJldHVybiB0aGlzLm1vbWVudFNlcnZpY2UucGFyc2VEYXRlKHZhbHVlLCBmb3JtYXQpO1xuICB9XG59XG4iXX0=