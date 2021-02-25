import { Injector, Pipe } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
var OCurrencyPipe = (function () {
    function OCurrencyPipe(injector) {
        this.injector = injector;
        this.currencyService = this.injector.get(CurrencyService);
    }
    OCurrencyPipe.prototype.transform = function (text, args) {
        return this.currencyService.getCurrencyValue(text, args);
    };
    OCurrencyPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'oCurrency'
                },] }
    ];
    OCurrencyPipe.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OCurrencyPipe;
}());
export { OCurrencyPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jdXJyZW5jeS5waXBlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9waXBlcy9vLWN1cnJlbmN5LnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQVkvRDtJQU1FLHVCQUFzQixRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELGlDQUFTLEdBQVQsVUFBVSxJQUFZLEVBQUUsSUFBMkI7UUFDakQsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDOztnQkFaRixJQUFJLFNBQUM7b0JBQ0osSUFBSSxFQUFFLFdBQVc7aUJBQ2xCOzs7Z0JBaEJRLFFBQVE7O0lBMkJqQixvQkFBQztDQUFBLEFBYkQsSUFhQztTQVZZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RvciwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDdXJyZW5jeVNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9jdXJyZW5jeS5zZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJQ3VycmVuY3lQaXBlQXJndW1lbnQge1xuICBjdXJyZW5jeVNpbWJvbD86IHN0cmluZztcbiAgY3VycmVuY3lTeW1ib2xQb3NpdGlvbj86IHN0cmluZztcbiAgZ3JvdXBpbmc/OiBib29sZWFuO1xuICB0aG91c2FuZFNlcGFyYXRvcj86IHN0cmluZztcbiAgZGVjaW1hbFNlcGFyYXRvcj86IHN0cmluZztcbiAgbWluRGVjaW1hbERpZ2l0cz86IG51bWJlcjtcbiAgbWF4RGVjaW1hbERpZ2l0cz86IG51bWJlcjtcbn1cblxuQFBpcGUoe1xuICBuYW1lOiAnb0N1cnJlbmN5J1xufSlcbmV4cG9ydCBjbGFzcyBPQ3VycmVuY3lQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgcHJvdGVjdGVkIGN1cnJlbmN5U2VydmljZTogQ3VycmVuY3lTZXJ2aWNlO1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgdGhpcy5jdXJyZW5jeVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChDdXJyZW5jeVNlcnZpY2UpO1xuICB9XG5cbiAgdHJhbnNmb3JtKHRleHQ6IHN0cmluZywgYXJnczogSUN1cnJlbmN5UGlwZUFyZ3VtZW50KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW5jeVNlcnZpY2UuZ2V0Q3VycmVuY3lWYWx1ZSh0ZXh0LCBhcmdzKTtcbiAgfVxufVxuIl19