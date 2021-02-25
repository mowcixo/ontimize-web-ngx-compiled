import { Injector, Pipe } from '@angular/core';
import { OIntegerPipe } from './o-integer.pipe';
export class ORealPipe extends OIntegerPipe {
    constructor(injector) {
        super(injector);
        this.injector = injector;
    }
    transform(text, args) {
        return this.numberService.getRealValue(text, args);
    }
}
ORealPipe.decorators = [
    { type: Pipe, args: [{
                name: 'oReal'
            },] }
];
ORealPipe.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1yZWFsLnBpcGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3BpcGVzL28tcmVhbC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFjaEQsTUFBTSxPQUFPLFNBQVUsU0FBUSxZQUFZO0lBRXpDLFlBQXNCLFFBQWtCO1FBQ3RDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQURJLGFBQVEsR0FBUixRQUFRLENBQVU7SUFFeEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFZLEVBQUUsSUFBdUI7UUFDN0MsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQzs7O1lBWEYsSUFBSSxTQUFDO2dCQUNKLElBQUksRUFBRSxPQUFPO2FBQ2Q7OztZQWZRLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RvciwgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPSW50ZWdlclBpcGUgfSBmcm9tICcuL28taW50ZWdlci5waXBlJztcblxuZXhwb3J0IGludGVyZmFjZSBJUmVhbFBpcGVBcmd1bWVudCB7XG4gIGdyb3VwaW5nPzogYm9vbGVhbjtcbiAgdGhvdXNhbmRTZXBhcmF0b3I/OiBzdHJpbmc7XG4gIGxvY2FsZT86IHN0cmluZztcbiAgZGVjaW1hbFNlcGFyYXRvcj86IHN0cmluZztcbiAgbWluRGVjaW1hbERpZ2l0cz86IG51bWJlcjtcbiAgbWF4RGVjaW1hbERpZ2l0cz86IG51bWJlcjtcbn1cblxuQFBpcGUoe1xuICBuYW1lOiAnb1JlYWwnXG59KVxuZXhwb3J0IGNsYXNzIE9SZWFsUGlwZSBleHRlbmRzIE9JbnRlZ2VyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gIH1cblxuICB0cmFuc2Zvcm0odGV4dDogc3RyaW5nLCBhcmdzOiBJUmVhbFBpcGVBcmd1bWVudCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubnVtYmVyU2VydmljZS5nZXRSZWFsVmFsdWUodGV4dCwgYXJncyk7XG4gIH1cblxufVxuIl19