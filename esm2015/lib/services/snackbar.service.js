import { Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { OSnackBarComponent } from '../shared/components/snackbar/o-snackbar.component';
import * as i0 from "@angular/core";
export class SnackBarService {
    constructor(injector) {
        this.injector = injector;
        this.matSnackBar = this.injector.get(MatSnackBar);
    }
    open(message, config) {
        const self = this;
        const observable = new Observable(observer => {
            const containerClasses = [SnackBarService.DEFAULT_CONTAINER_CLASS];
            if (config && config.cssClass) {
                containerClasses.push(config.cssClass);
            }
            const matConfig = {
                duration: config && config.milliseconds ? config.milliseconds : SnackBarService.DEFAULT_DURATION,
                panelClass: containerClasses
            };
            self.snackBarRef = self.matSnackBar.openFromComponent(OSnackBarComponent, matConfig);
            self.snackBarRef.onAction().subscribe(arg => {
                observer.next(arg);
            });
            self.snackBarRef.afterDismissed().subscribe(() => {
                observer.complete();
                self.snackBarRef = null;
            });
            self.snackBarRef.instance.open(message, config);
        });
        return observable.toPromise();
    }
}
SnackBarService.DEFAULT_DURATION = 2000;
SnackBarService.DEFAULT_CONTAINER_CLASS = 'o-snackbar-container';
SnackBarService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
SnackBarService.ctorParameters = () => [
    { type: Injector }
];
SnackBarService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function SnackBarService_Factory() { return new SnackBarService(i0.ɵɵinject(i0.INJECTOR)); }, token: SnackBarService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hY2tiYXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvc25hY2tiYXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFxQyxNQUFNLG1CQUFtQixDQUFDO0FBQ25GLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFtQixNQUFNLG9EQUFvRCxDQUFDOztBQUt6RyxNQUFNLE9BQU8sZUFBZTtJQVExQixZQUNZLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFFNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sSUFBSSxDQUFDLE9BQWUsRUFBRSxNQUF3QjtRQUNuRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsTUFBTSxVQUFVLEdBQW9CLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzVELE1BQU0sZ0JBQWdCLEdBQWEsQ0FBQyxlQUFlLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUM3RSxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUM3QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ3hDO1lBRUQsTUFBTSxTQUFTLEdBQXNCO2dCQUNuQyxRQUFRLEVBQUUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0I7Z0JBQ2hHLFVBQVUsRUFBRSxnQkFBZ0I7YUFDN0IsQ0FBQztZQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUVyRixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDMUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDL0MsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQyxDQUFDOztBQXRDZ0IsZ0NBQWdCLEdBQVcsSUFBSSxDQUFDO0FBQ2hDLHVDQUF1QixHQUFXLHNCQUFzQixDQUFDOztZQU4zRSxVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQVJvQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFNuYWNrQmFyLCBNYXRTbmFja0JhckNvbmZpZywgTWF0U25hY2tCYXJSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9TbmFja0JhckNvbXBvbmVudCwgT1NuYWNrQmFyQ29uZmlnIH0gZnJvbSAnLi4vc2hhcmVkL2NvbXBvbmVudHMvc25hY2tiYXIvby1zbmFja2Jhci5jb21wb25lbnQnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBTbmFja0JhclNlcnZpY2Uge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgREVGQVVMVF9EVVJBVElPTjogbnVtYmVyID0gMjAwMDtcbiAgcHJvdGVjdGVkIHN0YXRpYyBERUZBVUxUX0NPTlRBSU5FUl9DTEFTUzogc3RyaW5nID0gJ28tc25hY2tiYXItY29udGFpbmVyJztcblxuICBwcm90ZWN0ZWQgbWF0U25hY2tCYXI6IE1hdFNuYWNrQmFyO1xuICBwcm90ZWN0ZWQgc25hY2tCYXJSZWY6IE1hdFNuYWNrQmFyUmVmPE9TbmFja0JhckNvbXBvbmVudD47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLm1hdFNuYWNrQmFyID0gdGhpcy5pbmplY3Rvci5nZXQoTWF0U25hY2tCYXIpO1xuICB9XG5cbiAgcHVibGljIG9wZW4obWVzc2FnZTogc3RyaW5nLCBjb25maWc/OiBPU25hY2tCYXJDb25maWcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGU6IE9ic2VydmFibGU8YW55PiA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lckNsYXNzZXM6IHN0cmluZ1tdID0gW1NuYWNrQmFyU2VydmljZS5ERUZBVUxUX0NPTlRBSU5FUl9DTEFTU107XG4gICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5jc3NDbGFzcykge1xuICAgICAgICBjb250YWluZXJDbGFzc2VzLnB1c2goY29uZmlnLmNzc0NsYXNzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0Q29uZmlnOiBNYXRTbmFja0JhckNvbmZpZyA9IHtcbiAgICAgICAgZHVyYXRpb246IGNvbmZpZyAmJiBjb25maWcubWlsbGlzZWNvbmRzID8gY29uZmlnLm1pbGxpc2Vjb25kcyA6IFNuYWNrQmFyU2VydmljZS5ERUZBVUxUX0RVUkFUSU9OLFxuICAgICAgICBwYW5lbENsYXNzOiBjb250YWluZXJDbGFzc2VzXG4gICAgICB9O1xuICAgICAgc2VsZi5zbmFja0JhclJlZiA9IHNlbGYubWF0U25hY2tCYXIub3BlbkZyb21Db21wb25lbnQoT1NuYWNrQmFyQ29tcG9uZW50LCBtYXRDb25maWcpO1xuXG4gICAgICBzZWxmLnNuYWNrQmFyUmVmLm9uQWN0aW9uKCkuc3Vic2NyaWJlKGFyZyA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoYXJnKTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLnNuYWNrQmFyUmVmLmFmdGVyRGlzbWlzc2VkKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgc2VsZi5zbmFja0JhclJlZiA9IG51bGw7XG4gICAgICB9KTtcblxuICAgICAgc2VsZi5zbmFja0JhclJlZi5pbnN0YW5jZS5vcGVuKG1lc3NhZ2UsIGNvbmZpZyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGUudG9Qcm9taXNlKCk7XG4gIH1cblxufVxuIl19