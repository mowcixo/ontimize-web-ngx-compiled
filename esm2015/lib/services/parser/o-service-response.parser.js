import { Injectable, Injector } from '@angular/core';
import * as i0 from "@angular/core";
export class OntimizeServiceResponseParser {
    constructor(injector) {
        this.injector = injector;
    }
    parseSuccessfulResponse(resp, subscriber, service) {
        if (resp && resp.isUnauthorized()) {
            service.clientErrorFallback(401);
        }
        else if (resp && resp.isFailed()) {
            subscriber.error(resp.message);
        }
        else if (resp && resp.isSuccessful()) {
            subscriber.next(resp);
        }
        else {
            subscriber.error('Service unavailable');
        }
    }
    parseUnsuccessfulResponse(error, subscriber, service) {
        if (error) {
            switch (error.status) {
                case 401:
                case 403:
                case 404:
                case 405:
                    service.clientErrorFallback(error.status);
                    break;
                case 500:
                case 501:
                case 502:
                case 503:
                case 504:
                default:
                    subscriber.error(error);
                    service.serverErrorFallback(error.status);
                    break;
            }
        }
        else {
            subscriber.error(error);
        }
    }
}
OntimizeServiceResponseParser.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
OntimizeServiceResponseParser.ctorParameters = () => [
    { type: Injector }
];
OntimizeServiceResponseParser.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OntimizeServiceResponseParser_Factory() { return new OntimizeServiceResponseParser(i0.ɵɵinject(i0.INJECTOR)); }, token: OntimizeServiceResponseParser, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1zZXJ2aWNlLXJlc3BvbnNlLnBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvcGFyc2VyL28tc2VydmljZS1yZXNwb25zZS5wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBU3JELE1BQU0sT0FBTyw2QkFBNkI7SUFFeEMsWUFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO0lBQzFCLENBQUM7SUFFTCx1QkFBdUIsQ0FBQyxJQUFxQixFQUFFLFVBQXVDLEVBQUUsT0FBb0I7UUFDMUcsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ2pDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQzthQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNsQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQzthQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUN0QyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFFTCxVQUFVLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0lBRUQseUJBQXlCLENBQUMsS0FBSyxFQUFFLFVBQXVDLEVBQUUsT0FBb0I7UUFDNUYsSUFBSSxLQUFLLEVBQUU7WUFDVCxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BCLEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRztvQkFDTixPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMxQyxNQUFNO2dCQUNSLEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2dCQUNULEtBQUssR0FBRyxDQUFDO2dCQUNUO29CQUNFLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3hCLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFDLE1BQU07YUFDVDtTQUNGO2FBQU07WUFDTCxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQzs7O1lBNUNGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBUm9CLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzZS1zZXJ2aWNlLmNsYXNzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgT250aW1pemVTZXJ2aWNlUmVzcG9uc2VQYXJzZXIge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7IH1cblxuICBwYXJzZVN1Y2Nlc3NmdWxSZXNwb25zZShyZXNwOiBTZXJ2aWNlUmVzcG9uc2UsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8U2VydmljZVJlc3BvbnNlPiwgc2VydmljZTogQmFzZVNlcnZpY2UpIHtcbiAgICBpZiAocmVzcCAmJiByZXNwLmlzVW5hdXRob3JpemVkKCkpIHtcbiAgICAgIHNlcnZpY2UuY2xpZW50RXJyb3JGYWxsYmFjayg0MDEpO1xuICAgIH0gZWxzZSBpZiAocmVzcCAmJiByZXNwLmlzRmFpbGVkKCkpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IocmVzcC5tZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHJlc3AgJiYgcmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHJlc3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbmtub3cgc3RhdGUgLT4gZXJyb3JcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoJ1NlcnZpY2UgdW5hdmFpbGFibGUnKTtcbiAgICB9XG4gIH1cblxuICBwYXJzZVVuc3VjY2Vzc2Z1bFJlc3BvbnNlKGVycm9yLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFNlcnZpY2VSZXNwb25zZT4sIHNlcnZpY2U6IEJhc2VTZXJ2aWNlKSB7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBzd2l0Y2ggKGVycm9yLnN0YXR1cykge1xuICAgICAgICBjYXNlIDQwMTpcbiAgICAgICAgY2FzZSA0MDM6XG4gICAgICAgIGNhc2UgNDA0OlxuICAgICAgICBjYXNlIDQwNTpcbiAgICAgICAgICBzZXJ2aWNlLmNsaWVudEVycm9yRmFsbGJhY2soZXJyb3Iuc3RhdHVzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA1MDA6XG4gICAgICAgIGNhc2UgNTAxOlxuICAgICAgICBjYXNlIDUwMjpcbiAgICAgICAgY2FzZSA1MDM6XG4gICAgICAgIGNhc2UgNTA0OlxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIHNlcnZpY2Uuc2VydmVyRXJyb3JGYWxsYmFjayhlcnJvci5zdGF0dXMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxufVxuIl19