import { Injectable, Injector } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
export class OTableMatPaginatorIntl extends MatPaginatorIntl {
    constructor(injector) {
        super();
        this.injector = injector;
        this.translateService = this.injector.get(OTranslateService);
        this.itemsPerPageLabel = this.translateService.get('TABLE.PAGINATE.ITEMSPERPAGELABEL');
        this.nextPageLabel = this.translateService.get('TABLE.PAGINATE.NEXT');
        this.previousPageLabel = this.translateService.get('TABLE.PAGINATE.PREVIOUS');
        this.firstPageLabel = this.translateService.get('TABLE.PAGINATE.FIRST');
        this.lastPageLabel = this.translateService.get('TABLE.PAGINATE.LAST');
        this.getRangeLabel = this.getORangeLabel;
        this.onLanguageChangeSubscribe = this.translateService.onLanguageChanged.subscribe(res => {
            this.itemsPerPageLabel = this.translateService.get('TABLE.PAGINATE.ITEMSPERPAGELABEL');
            this.nextPageLabel = this.translateService.get('TABLE.PAGINATE.NEXT');
            this.previousPageLabel = this.translateService.get('TABLE.PAGINATE.PREVIOUS');
            this.firstPageLabel = this.translateService.get('TABLE.PAGINATE.FIRST');
            this.lastPageLabel = this.translateService.get('TABLE.PAGINATE.LAST');
            this.getRangeLabel = this.getORangeLabel;
            this.changes.next();
        });
    }
    getORangeLabel(page, pageSize, length) {
        if (!isNaN(pageSize) && (length === 0 || pageSize === 0)) {
            return `0  ${this.translateService.get('TABLE.PAGINATE.RANGE_LABEL')} ${length}`;
        }
        length = Math.max(length, 0);
        let startIndex = page * pageSize;
        let endIndex = startIndex < length ?
            Math.min(startIndex + pageSize, length) :
            startIndex + pageSize;
        if (isNaN(pageSize)) {
            startIndex = 0;
            endIndex = length;
        }
        return `${startIndex + 1} - ${endIndex}  ${this.translateService.get('TABLE.PAGINATE.RANGE_LABEL')} ${length}`;
    }
}
OTableMatPaginatorIntl.decorators = [
    { type: Injectable }
];
OTableMatPaginatorIntl.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1tYXQtcGFnaW5hdG9yLWludGwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9mb290ZXIvcGFnaW5hdG9yL28tdGFibGUtbWF0LXBhZ2luYXRvci1pbnRsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBRzFGLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFRMUQsWUFBc0IsUUFBa0I7UUFDdEMsS0FBSyxFQUFFLENBQUM7UUFEWSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRXRDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFekMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUN0RSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3RFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUN6QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGNBQWMsQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxNQUFjO1FBQzNELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN4RCxPQUFPLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDO1NBQ2xGO1FBQ0QsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUM7UUFFakMsSUFBSSxRQUFRLEdBQUcsVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFHeEIsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDbkIsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNmLFFBQVEsR0FBRyxNQUFNLENBQUM7U0FDbkI7UUFFRCxPQUFPLEdBQUcsVUFBVSxHQUFHLENBQUMsTUFBTSxRQUFRLEtBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQ2pILENBQUM7OztZQWhERixVQUFVOzs7WUFMVSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFBhZ2luYXRvckludGwgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT1RhYmxlTWF0UGFnaW5hdG9ySW50bCBleHRlbmRzIE1hdFBhZ2luYXRvckludGwge1xuXG4gIGl0ZW1zUGVyUGFnZUxhYmVsO1xuICBuZXh0UGFnZUxhYmVsO1xuICBwcmV2aW91c1BhZ2VMYWJlbDtcbiAgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBvbkxhbmd1YWdlQ2hhbmdlU3Vic2NyaWJlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMuaXRlbXNQZXJQYWdlTGFiZWwgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdUQUJMRS5QQUdJTkFURS5JVEVNU1BFUlBBR0VMQUJFTCcpO1xuICAgIHRoaXMubmV4dFBhZ2VMYWJlbCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFLlBBR0lOQVRFLk5FWFQnKTtcbiAgICB0aGlzLnByZXZpb3VzUGFnZUxhYmVsID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCgnVEFCTEUuUEFHSU5BVEUuUFJFVklPVVMnKTtcbiAgICB0aGlzLmZpcnN0UGFnZUxhYmVsID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCgnVEFCTEUuUEFHSU5BVEUuRklSU1QnKTtcbiAgICB0aGlzLmxhc3RQYWdlTGFiZWwgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdUQUJMRS5QQUdJTkFURS5MQVNUJyk7XG4gICAgdGhpcy5nZXRSYW5nZUxhYmVsID0gdGhpcy5nZXRPUmFuZ2VMYWJlbDtcblxuICAgIHRoaXMub25MYW5ndWFnZUNoYW5nZVN1YnNjcmliZSA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5vbkxhbmd1YWdlQ2hhbmdlZC5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgIHRoaXMuaXRlbXNQZXJQYWdlTGFiZWwgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdUQUJMRS5QQUdJTkFURS5JVEVNU1BFUlBBR0VMQUJFTCcpO1xuICAgICAgdGhpcy5uZXh0UGFnZUxhYmVsID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCgnVEFCTEUuUEFHSU5BVEUuTkVYVCcpO1xuICAgICAgdGhpcy5wcmV2aW91c1BhZ2VMYWJlbCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFLlBBR0lOQVRFLlBSRVZJT1VTJyk7XG4gICAgICB0aGlzLmZpcnN0UGFnZUxhYmVsID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCgnVEFCTEUuUEFHSU5BVEUuRklSU1QnKTtcbiAgICAgIHRoaXMubGFzdFBhZ2VMYWJlbCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFLlBBR0lOQVRFLkxBU1QnKTtcbiAgICAgIHRoaXMuZ2V0UmFuZ2VMYWJlbCA9IHRoaXMuZ2V0T1JhbmdlTGFiZWw7XG4gICAgICB0aGlzLmNoYW5nZXMubmV4dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0T1JhbmdlTGFiZWwocGFnZTogbnVtYmVyLCBwYWdlU2l6ZTogbnVtYmVyLCBsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgaWYgKCFpc05hTihwYWdlU2l6ZSkgJiYgKGxlbmd0aCA9PT0gMCB8fCBwYWdlU2l6ZSA9PT0gMCkpIHtcbiAgICAgIHJldHVybiBgMCAgJHt0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdUQUJMRS5QQUdJTkFURS5SQU5HRV9MQUJFTCcpfSAke2xlbmd0aH1gO1xuICAgIH1cbiAgICBsZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIDApO1xuICAgIGxldCBzdGFydEluZGV4ID0gcGFnZSAqIHBhZ2VTaXplO1xuICAgIC8vIElmIHRoZSBzdGFydCBpbmRleCBleGNlZWRzIHRoZSBsaXN0IGxlbmd0aCwgZG8gbm90IHRyeSBhbmQgZml4IHRoZSBlbmQgaW5kZXggdG8gdGhlIGVuZC5cbiAgICBsZXQgZW5kSW5kZXggPSBzdGFydEluZGV4IDwgbGVuZ3RoID9cbiAgICAgIE1hdGgubWluKHN0YXJ0SW5kZXggKyBwYWdlU2l6ZSwgbGVuZ3RoKSA6XG4gICAgICBzdGFydEluZGV4ICsgcGFnZVNpemU7XG5cbiAgICAvLyBvcHRpb24gc2hvdyBhbGxcbiAgICBpZiAoaXNOYU4ocGFnZVNpemUpKSB7XG4gICAgICBzdGFydEluZGV4ID0gMDtcbiAgICAgIGVuZEluZGV4ID0gbGVuZ3RoO1xuICAgIH1cblxuICAgIHJldHVybiBgJHtzdGFydEluZGV4ICsgMX0gLSAke2VuZEluZGV4fSAgJHt0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdUQUJMRS5QQUdJTkFURS5SQU5HRV9MQUJFTCcpfSAke2xlbmd0aH1gO1xuICB9XG5cbn1cbiJdfQ==