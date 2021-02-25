import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';
import { Codes } from '../../../util/codes';
export class Error403Component {
    constructor(injector) {
        this.injector = injector;
        this.router = this.injector.get(Router);
        this.navigationService = this.injector.get(NavigationService);
        this.lastPageData = this.navigationService.getLastItem();
    }
    onNavigateBackClick() {
        const extras = {};
        let route = '';
        if (this.lastPageData) {
            extras[Codes.QUERY_PARAMS] = this.lastPageData.queryParams;
            route = this.lastPageData.url;
        }
        this.router.navigate([route], extras);
    }
}
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
Error403Component.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1lcnJvci00MDMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zaGFyZWQvY29tcG9uZW50cy9lcnJvcjQwMy9vLWVycm9yLTQwMy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFvQixNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUzRCxPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLE1BQU0sc0NBQXNDLENBQUM7QUFDMUYsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBVzVDLE1BQU0sT0FBTyxpQkFBaUI7SUFNNUIsWUFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCxtQkFBbUI7UUFDakIsTUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNwQyxJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7WUFDM0QsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4QyxDQUFDOzs7WUE3QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixzVEFBMkM7Z0JBRTNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0oscUJBQXFCLEVBQUUsTUFBTTtpQkFDOUI7O2FBQ0Y7OztZQWRtQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3RvciwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5hdmlnYXRpb25FeHRyYXMsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IE5hdmlnYXRpb25TZXJ2aWNlLCBPTmF2aWdhdGlvbkl0ZW0gfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1lcnJvci00MDMnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1lcnJvci00MDMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWVycm9yLTQwMy5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWVycm9yLTQwM10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBFcnJvcjQwM0NvbXBvbmVudCB7XG5cbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBwcm90ZWN0ZWQgbmF2aWdhdGlvblNlcnZpY2U6IE5hdmlnYXRpb25TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgbGFzdFBhZ2VEYXRhOiBPTmF2aWdhdGlvbkl0ZW07XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHRoaXMucm91dGVyID0gdGhpcy5pbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgICB0aGlzLm5hdmlnYXRpb25TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTmF2aWdhdGlvblNlcnZpY2UpO1xuICAgIHRoaXMubGFzdFBhZ2VEYXRhID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0SXRlbSgpO1xuICB9XG5cbiAgb25OYXZpZ2F0ZUJhY2tDbGljaygpIHtcbiAgICBjb25zdCBleHRyYXM6IE5hdmlnYXRpb25FeHRyYXMgPSB7fTtcbiAgICBsZXQgcm91dGU6IHN0cmluZyA9ICcnO1xuICAgIGlmICh0aGlzLmxhc3RQYWdlRGF0YSkge1xuICAgICAgZXh0cmFzW0NvZGVzLlFVRVJZX1BBUkFNU10gPSB0aGlzLmxhc3RQYWdlRGF0YS5xdWVyeVBhcmFtcztcbiAgICAgIHJvdXRlID0gdGhpcy5sYXN0UGFnZURhdGEudXJsO1xuICAgIH1cbiAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbcm91dGVdLCBleHRyYXMpO1xuICB9XG59XG5cbiJdfQ==