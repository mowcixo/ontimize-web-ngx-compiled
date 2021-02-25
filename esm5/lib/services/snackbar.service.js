import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { OSnackBarComponent } from '../shared/components/snackbar/o-snackbar.component';
import * as i0 from "@angular/core";
var SnackBarService = (function () {
    function SnackBarService(injector) {
        this.injector = injector;
        this.matSnackBar = this.injector.get(MatSnackBar);
    }
    SnackBarService.prototype.open = function (message, config) {
        var self = this;
        var observable = new Observable(function (observer) {
            var containerClasses = [SnackBarService.DEFAULT_CONTAINER_CLASS];
            if (config && config.cssClass) {
                containerClasses.push(config.cssClass);
            }
            var matConfig = {
                duration: config && config.milliseconds ? config.milliseconds : SnackBarService.DEFAULT_DURATION,
                panelClass: containerClasses
            };
            self.snackBarRef = self.matSnackBar.openFromComponent(OSnackBarComponent, matConfig);
            self.snackBarRef.onAction().subscribe(function (arg) {
                observer.next(arg);
            });
            self.snackBarRef.afterDismissed().subscribe(function () {
                observer.complete();
                self.snackBarRef = null;
            });
            self.snackBarRef.instance.open(message, config);
        });
        return observable.toPromise();
    };
    SnackBarService.DEFAULT_DURATION = 2000;
    SnackBarService.DEFAULT_CONTAINER_CLASS = 'o-snackbar-container';
    SnackBarService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    SnackBarService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    SnackBarService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SnackBarService_Factory() { return new SnackBarService(i0.ɵɵinject(i0.INJECTOR)); }, token: SnackBarService, providedIn: "root" });
    return SnackBarService;
}());
export { SnackBarService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2tiYXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvc25hY2tiYXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFxQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25GLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFtQixNQUFNLG9EQUFvRCxDQUFDOztBQUV6RztJQVdFLHlCQUNZLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFFNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sOEJBQUksR0FBWCxVQUFZLE9BQWUsRUFBRSxNQUF3QjtRQUNuRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBTSxVQUFVLEdBQW9CLElBQUksVUFBVSxDQUFDLFVBQUEsUUFBUTtZQUN6RCxJQUFNLGdCQUFnQixHQUFhLENBQUMsZUFBZSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDN0UsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtnQkFDN0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN4QztZQUVELElBQU0sU0FBUyxHQUFzQjtnQkFDbkMsUUFBUSxFQUFFLE1BQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCO2dCQUNoRyxVQUFVLEVBQUUsZ0JBQWdCO2FBQzdCLENBQUM7WUFDRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFckYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO2dCQUN2QyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQzFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQXRDZ0IsZ0NBQWdCLEdBQVcsSUFBSSxDQUFDO0lBQ2hDLHVDQUF1QixHQUFXLHNCQUFzQixDQUFDOztnQkFOM0UsVUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7O2dCQVJvQixRQUFROzs7MEJBQTdCO0NBbURDLEFBN0NELElBNkNDO1NBMUNZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0U25hY2tCYXIsIE1hdFNuYWNrQmFyQ29uZmlnLCBNYXRTbmFja0JhclJlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1NuYWNrQmFyQ29tcG9uZW50LCBPU25hY2tCYXJDb25maWcgfSBmcm9tICcuLi9zaGFyZWQvY29tcG9uZW50cy9zbmFja2Jhci9vLXNuYWNrYmFyLmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFNuYWNrQmFyU2VydmljZSB7XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBERUZBVUxUX0RVUkFUSU9OOiBudW1iZXIgPSAyMDAwO1xuICBwcm90ZWN0ZWQgc3RhdGljIERFRkFVTFRfQ09OVEFJTkVSX0NMQVNTOiBzdHJpbmcgPSAnby1zbmFja2Jhci1jb250YWluZXInO1xuXG4gIHByb3RlY3RlZCBtYXRTbmFja0JhcjogTWF0U25hY2tCYXI7XG4gIHByb3RlY3RlZCBzbmFja0JhclJlZjogTWF0U25hY2tCYXJSZWY8T1NuYWNrQmFyQ29tcG9uZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMubWF0U25hY2tCYXIgPSB0aGlzLmluamVjdG9yLmdldChNYXRTbmFja0Jhcik7XG4gIH1cblxuICBwdWJsaWMgb3BlbihtZXNzYWdlOiBzdHJpbmcsIGNvbmZpZz86IE9TbmFja0JhckNvbmZpZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+ID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyQ2xhc3Nlczogc3RyaW5nW10gPSBbU25hY2tCYXJTZXJ2aWNlLkRFRkFVTFRfQ09OVEFJTkVSX0NMQVNTXTtcbiAgICAgIGlmIChjb25maWcgJiYgY29uZmlnLmNzc0NsYXNzKSB7XG4gICAgICAgIGNvbnRhaW5lckNsYXNzZXMucHVzaChjb25maWcuY3NzQ2xhc3MpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtYXRDb25maWc6IE1hdFNuYWNrQmFyQ29uZmlnID0ge1xuICAgICAgICBkdXJhdGlvbjogY29uZmlnICYmIGNvbmZpZy5taWxsaXNlY29uZHMgPyBjb25maWcubWlsbGlzZWNvbmRzIDogU25hY2tCYXJTZXJ2aWNlLkRFRkFVTFRfRFVSQVRJT04sXG4gICAgICAgIHBhbmVsQ2xhc3M6IGNvbnRhaW5lckNsYXNzZXNcbiAgICAgIH07XG4gICAgICBzZWxmLnNuYWNrQmFyUmVmID0gc2VsZi5tYXRTbmFja0Jhci5vcGVuRnJvbUNvbXBvbmVudChPU25hY2tCYXJDb21wb25lbnQsIG1hdENvbmZpZyk7XG5cbiAgICAgIHNlbGYuc25hY2tCYXJSZWYub25BY3Rpb24oKS5zdWJzY3JpYmUoYXJnID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChhcmcpO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuc25hY2tCYXJSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICBzZWxmLnNuYWNrQmFyUmVmID0gbnVsbDtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLnNuYWNrQmFyUmVmLmluc3RhbmNlLm9wZW4obWVzc2FnZSwgY29uZmlnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZS50b1Byb21pc2UoKTtcbiAgfVxuXG59XG4iXX0=