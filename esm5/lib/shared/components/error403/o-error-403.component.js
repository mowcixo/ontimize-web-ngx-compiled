import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { Codes } from '../../../util/codes';
var Error403Component = (function () {
    function Error403Component(injector) {
        this.injector = injector;
        this.router = this.injector.get(Router);
        this.navigationService = this.injector.get(NavigationService);
        this.lastPageData = this.navigationService.getLastItem();
    }
    Error403Component.prototype.onNavigateBackClick = function () {
        var extras = {};
        var route = '';
        if (this.lastPageData) {
            extras[Codes.QUERY_PARAMS] = this.lastPageData.queryParams;
            route = this.lastPageData.url;
        }
        this.router.navigate([route], extras);
    };
    Error403Component.decorators = [
        { type: Component, args: [{
                    selector: 'o-error-403',
                    template: "<div fxFlex fxFlexFill fxLayout=\"column\" fxLayoutAlign=\"center center\">\n  {{ 'MESSAGES.ERROR_403_TEXT' | oTranslate }}\n  <button color=\"accent\" type=\"button\" mat-raised-button (click)=\"onNavigateBackClick()\">\n    {{ 'MESSAGES.ERROR_403_TEXT_BUTTON' | oTranslate }}\n  </button>\n</div>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-error-403]': 'true'
                    },
                    styles: [".o-error-403{height:100%}.o-error-403 button{margin:16px}"]
                }] }
    ];
    Error403Component.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return Error403Component;
}());
export { Error403Component };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1lcnJvci00MDMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29tcG9uZW50cy9lcnJvcjQwMy9vLWVycm9yLTQwMy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFvQixNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUzRCxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sc0NBQXNDLENBQUM7QUFDMUYsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVDO0lBZUUsMkJBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0lBRUQsK0NBQW1CLEdBQW5CO1FBQ0UsSUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNwQyxJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7WUFDM0QsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDOztnQkE3QkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixzVEFBMkM7b0JBRTNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0oscUJBQXFCLEVBQUUsTUFBTTtxQkFDOUI7O2lCQUNGOzs7Z0JBZG1CLFFBQVE7O0lBb0M1Qix3QkFBQztDQUFBLEFBOUJELElBOEJDO1NBckJZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5qZWN0b3IsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRXh0cmFzLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSwgT05hdmlnYXRpb25JdGVtIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZXJyb3ItNDAzJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZXJyb3ItNDAzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1lcnJvci00MDMuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1lcnJvci00MDNdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgRXJyb3I0MDNDb21wb25lbnQge1xuXG4gIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcjtcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcbiAgcHJvdGVjdGVkIGxhc3RQYWdlRGF0YTogT05hdmlnYXRpb25JdGVtO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLnJvdXRlciA9IHRoaXMuaW5qZWN0b3IuZ2V0KFJvdXRlcik7XG4gICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5hdmlnYXRpb25TZXJ2aWNlKTtcbiAgICB0aGlzLmxhc3RQYWdlRGF0YSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdEl0ZW0oKTtcbiAgfVxuXG4gIG9uTmF2aWdhdGVCYWNrQ2xpY2soKSB7XG4gICAgY29uc3QgZXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge307XG4gICAgbGV0IHJvdXRlOiBzdHJpbmcgPSAnJztcbiAgICBpZiAodGhpcy5sYXN0UGFnZURhdGEpIHtcbiAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gdGhpcy5sYXN0UGFnZURhdGEucXVlcnlQYXJhbXM7XG4gICAgICByb3V0ZSA9IHRoaXMubGFzdFBhZ2VEYXRhLnVybDtcbiAgICB9XG4gICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3JvdXRlXSwgZXh0cmFzKTtcbiAgfVxufVxuXG4iXX0=