import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OBreadcrumbService } from '../../services/o-breadcrumb.service';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
export const DEFAULT_INPUTS_O_BREADCRUMB = [
    '_formRef: form',
    'labelColumns: label-columns',
    'separator'
];
export class OBreadcrumbComponent {
    constructor(injector) {
        this.injector = injector;
        this.separator = ' ';
        this.breadcrumbs = new BehaviorSubject([]);
        this.labelColsArray = [];
        this.subscription = new Subscription();
        this.router = this.injector.get(Router);
        this.oBreadcrumService = this.injector.get(OBreadcrumbService);
    }
    set form(value) {
        this._formRef = value;
    }
    ngOnInit() {
        this.labelColsArray = Util.parseArray(this.labelColumns);
        this.subscription.add(this.oBreadcrumService.breadcrumbs$.subscribe(bs => this.breadcrumbs.next(bs)));
    }
    ngAfterViewInit() {
        if (this._formRef && this.labelColsArray.length) {
            const self = this;
            this.subscription.add(this._formRef.onDataLoaded.subscribe((value) => {
                if (self.breadcrumbs.value.length) {
                    const displayText = self.labelColsArray.map(element => value[element]).join(self.separator);
                    self.breadcrumbs.value[self.breadcrumbs.value.length - 1].displayText = displayText;
                }
            }));
        }
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    isCurrentRoute(route) {
        return route.route === this.router.routerState.snapshot.url.split('?')[0];
    }
    onRouteClick(route) {
        const extras = {};
        if (route.queryParams) {
            extras[Codes.QUERY_PARAMS] = route.queryParams;
        }
        this.router.navigate([route.route], extras);
    }
}
OBreadcrumbComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-breadcrumb',
                template: "<mat-toolbar class=\"toolbar-breadcrumb\">\n  <ng-container *ngFor=\"let route of breadcrumbs | async; index as i; last as isLast\">\n    <span *ngIf=\"isCurrentRoute(route); else bredcrumItem\" class=\"breadcrumb-item active\" layout-padding>\n      {{ route.displayText ? route.displayText : route.label | uppercase | oTranslate }}\n    </span>\n    <ng-template #bredcrumItem>\n      <a (click)=\"onRouteClick(route)\" class=\"breadcrumb-item\" layout-padding>\n        {{ route.displayText ? route.displayText : route.label | uppercase | oTranslate }}\n      </a>\n    </ng-template>\n    <mat-icon *ngIf=\"!isLast\" svgIcon=\"ontimize:keyboard_arrow_right\"></mat-icon>\n  </ng-container>\n</mat-toolbar>\n",
                inputs: DEFAULT_INPUTS_O_BREADCRUMB,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-breadcrumb]': 'true'
                },
                styles: [".o-breadcrumb{display:flex;height:50px;min-height:50px;padding-bottom:8px}.o-breadcrumb .mat-toolbar{box-shadow:2px 2px 6px rgba(0,0,0,.24);background:#fff;border-radius:6px;min-height:50px;max-height:50px}.o-breadcrumb .mat-toolbar .mat-toolbar-row{height:50px}.o-breadcrumb .mat-toolbar a{text-decoration:none;cursor:pointer}.o-breadcrumb .mat-toolbar span{cursor:default}.o-breadcrumb .mat-toolbar a,.o-breadcrumb .mat-toolbar span{padding-top:0;padding-bottom:0}"]
            }] }
];
OBreadcrumbComponent.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1icmVhZGNydW1iLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9icmVhZGNydW1iL28tYnJlYWRjcnVtYi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsUUFBUSxFQUFxQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6RyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHckQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFekUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUd2QyxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRztJQUV6QyxnQkFBZ0I7SUFHaEIsNkJBQTZCO0lBRzdCLFdBQVc7Q0FDWixDQUFDO0FBWUYsTUFBTSxPQUFPLG9CQUFvQjtJQWdCL0IsWUFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBZHZCLGNBQVMsR0FBVyxHQUFHLENBQUM7UUFDeEIsZ0JBQVcsR0FBbUMsSUFBSSxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7UUFPbkUsbUJBQWMsR0FBa0IsRUFBRSxDQUFDO1FBRW5DLGlCQUFZLEdBQWlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFNeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBZEQsSUFBSSxJQUFJLENBQUMsS0FBcUI7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDeEIsQ0FBQztJQWNELFFBQVE7UUFDTixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUNuQixJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQy9FLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUMvQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQ3hFLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUNqQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzVGLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO2lCQUNyRjtZQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDTDtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRUQsY0FBYyxDQUFDLEtBQWtCO1FBQy9CLE9BQU8sS0FBSyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWtCO1FBQzdCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1NBQ2hEO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7O1lBckVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsbXRCQUEwQztnQkFFMUMsTUFBTSxFQUFFLDJCQUEyQjtnQkFDbkMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixzQkFBc0IsRUFBRSxNQUFNO2lCQUMvQjs7YUFDRjs7O1lBL0JrQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTmF2aWdhdGlvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgT0JyZWFkY3J1bWJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvby1icmVhZGNydW1iLnNlcnZpY2UnO1xuaW1wb3J0IHsgT0JyZWFkY3J1bWIgfSBmcm9tICcuLi8uLi90eXBlcy9vLWJyZWFkY3J1bWItaXRlbS50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi4vZm9ybS9vLWZvcm0uY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQlJFQURDUlVNQiA9IFtcbiAgLy8gZm9ybSBbT0Zvcm1Db21wb25lbnRdOiBPbnRpbWl6ZSBXZWIgRm9ybSByZWZlcmVuY2UuXG4gICdfZm9ybVJlZjogZm9ybScsXG5cbiAgLy8gbGFiZWwtY29sdW1ucyBbc3RyaW5nXTogRm9ybSB2YWx1ZXMgc2hvd24gb24gZWFjaCBlbGVtZW50LiBTZXBhcmF0ZWQgYnkgJzsnLiBEZWZhdWx0OiBubyB2YWx1ZS5cbiAgJ2xhYmVsQ29sdW1uczogbGFiZWwtY29sdW1ucycsXG5cbiAgLy8gc2VwYXJhdG9yIFtzdHJpbmddOiBGb3JtIHZhbHVlcyBzaG93biBvbiBlYWNoIGVsZW1lbnQuIFNlcGFyYXRlZCBieSAnOycuIERlZmF1bHQ6IG5vIHZhbHVlLlxuICAnc2VwYXJhdG9yJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1icmVhZGNydW1iJyxcbiAgdGVtcGxhdGVVcmw6ICdvLWJyZWFkY3J1bWIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnby1icmVhZGNydW1iLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19CUkVBRENSVU1CLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWJyZWFkY3J1bWJdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0JyZWFkY3J1bWJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG5cbiAgcHVibGljIGxhYmVsQ29sdW1uczogc3RyaW5nO1xuICBwdWJsaWMgc2VwYXJhdG9yOiBzdHJpbmcgPSAnICc7XG4gIHB1YmxpYyBicmVhZGNydW1iczogQmVoYXZpb3JTdWJqZWN0PE9CcmVhZGNydW1iW10+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChbXSk7XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBzZXQgZm9ybSh2YWx1ZTogT0Zvcm1Db21wb25lbnQpIHtcbiAgICB0aGlzLl9mb3JtUmVmID0gdmFsdWU7XG4gIH1cbiAgcHJvdGVjdGVkIF9mb3JtUmVmOiBPRm9ybUNvbXBvbmVudDtcbiAgcHJvdGVjdGVkIGxhYmVsQ29sc0FycmF5OiBBcnJheTxzdHJpbmc+ID0gW107XG4gIHByb3RlY3RlZCBuYXZpZ2F0aW9uU2VydmljZTogTmF2aWdhdGlvblNlcnZpY2U7XG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgcHJvdGVjdGVkIG9CcmVhZGNydW1TZXJ2aWNlOiBPQnJlYWRjcnVtYlNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLnJvdXRlciA9IHRoaXMuaW5qZWN0b3IuZ2V0KFJvdXRlcik7XG4gICAgdGhpcy5vQnJlYWRjcnVtU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9CcmVhZGNydW1iU2VydmljZSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmxhYmVsQ29sc0FycmF5ID0gVXRpbC5wYXJzZUFycmF5KHRoaXMubGFiZWxDb2x1bW5zKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgIHRoaXMub0JyZWFkY3J1bVNlcnZpY2UuYnJlYWRjcnVtYnMkLnN1YnNjcmliZShicyA9PiB0aGlzLmJyZWFkY3J1bWJzLm5leHQoYnMpKVxuICAgICk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuX2Zvcm1SZWYgJiYgdGhpcy5sYWJlbENvbHNBcnJheS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKHRoaXMuX2Zvcm1SZWYub25EYXRhTG9hZGVkLnN1YnNjcmliZSgodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICBpZiAoc2VsZi5icmVhZGNydW1icy52YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBkaXNwbGF5VGV4dCA9IHNlbGYubGFiZWxDb2xzQXJyYXkubWFwKGVsZW1lbnQgPT4gdmFsdWVbZWxlbWVudF0pLmpvaW4oc2VsZi5zZXBhcmF0b3IpO1xuICAgICAgICAgIHNlbGYuYnJlYWRjcnVtYnMudmFsdWVbc2VsZi5icmVhZGNydW1icy52YWx1ZS5sZW5ndGggLSAxXS5kaXNwbGF5VGV4dCA9IGRpc3BsYXlUZXh0O1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIGlzQ3VycmVudFJvdXRlKHJvdXRlOiBPQnJlYWRjcnVtYik6IGJvb2xlYW4ge1xuICAgIHJldHVybiByb3V0ZS5yb3V0ZSA9PT0gdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3QudXJsLnNwbGl0KCc/JylbMF07XG4gIH1cblxuICBvblJvdXRlQ2xpY2socm91dGU6IE9CcmVhZGNydW1iKSB7XG4gICAgY29uc3QgZXh0cmFzID0ge307XG4gICAgaWYgKHJvdXRlLnF1ZXJ5UGFyYW1zKSB7XG4gICAgICBleHRyYXNbQ29kZXMuUVVFUllfUEFSQU1TXSA9IHJvdXRlLnF1ZXJ5UGFyYW1zO1xuICAgIH1cbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcm91dGUucm91dGVdLCBleHRyYXMpO1xuICB9XG5cbn1cbiJdfQ==