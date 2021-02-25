import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewEncapsulation, } from '@angular/core';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
export var DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = [
    'openedSrc: opened-src',
    'closedSrc: closed-src'
];
export var DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = [];
var OAppSidenavImageComponent = (function () {
    function OAppSidenavImageComponent(injector, cd) {
        this.injector = injector;
        this.cd = cd;
        this.sidenav = this.injector.get(OAppSidenavComponent);
    }
    OAppSidenavImageComponent.prototype.ngOnInit = function () {
        if (this.sidenav) {
            var self_1 = this;
            this.sidenavOpenSubs = this.sidenav.onSidenavClosedStart.subscribe(function () {
                self_1.updateImage();
            });
            this.sidenavCloseSubs = this.sidenav.onSidenavOpenedStart.subscribe(function () {
                self_1.updateImage();
            });
        }
        this.updateImage();
    };
    OAppSidenavImageComponent.prototype.ngOnDestroy = function () {
        if (this.sidenavOpenSubs) {
            this.sidenavOpenSubs.unsubscribe();
        }
        if (this.sidenavCloseSubs) {
            this.sidenavCloseSubs.unsubscribe();
        }
    };
    OAppSidenavImageComponent.prototype.updateImage = function () {
        if (this.sidenav && this.sidenav.sidenav && this.sidenav.sidenav.opened) {
            this.setOpenedImg();
        }
        else {
            this.setClosedImg();
        }
        this.cd.detectChanges();
    };
    Object.defineProperty(OAppSidenavImageComponent.prototype, "src", {
        get: function () {
            return this._src;
        },
        set: function (val) {
            this._src = val;
        },
        enumerable: true,
        configurable: true
    });
    OAppSidenavImageComponent.prototype.setOpenedImg = function () {
        this.src = this.openedSrc;
    };
    OAppSidenavImageComponent.prototype.setClosedImg = function () {
        this.src = this.closedSrc;
    };
    Object.defineProperty(OAppSidenavImageComponent.prototype, "showImage", {
        get: function () {
            return (this._src !== undefined && this._src.length > 0);
        },
        enumerable: true,
        configurable: true
    });
    OAppSidenavImageComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-app-sidenav-image',
                    inputs: DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE,
                    outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE,
                    template: "<div class=\"o-app-sidenav-image-container\" *ngIf=\"showImage\">\n  <img class=\"o-app-sidenav-image\" [src]=\"src\" />\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-app-sidenav-image]': 'true'
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".sidenav-toggle-container+.o-app-sidenav-image .o-app-sidenav-image-container{padding-top:0;text-align:center}.mat-drawer-opened .o-app-sidenav-image .o-app-sidenav-image-container{text-align:center}.o-app-sidenav-image .o-app-sidenav-image-container{max-height:75px;padding:8px 16px 16px}.o-app-sidenav-image .o-app-sidenav-image-container .o-app-sidenav-image{max-width:100%;max-height:100%}"]
                }] }
    ];
    OAppSidenavImageComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ChangeDetectorRef }
    ]; };
    return OAppSidenavImageComponent;
}());
export { OAppSidenavImageComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvaW1hZ2Uvby1hcHAtc2lkZW5hdi1pbWFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFFBQVEsRUFHUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbEUsTUFBTSxDQUFDLElBQU0sa0NBQWtDLEdBQUc7SUFDaEQsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtDQUN4QixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sbUNBQW1DLEdBQUcsRUFDbEQsQ0FBQztBQUVGO0lBc0JFLG1DQUNZLFFBQWtCLEVBQ2xCLEVBQXFCO1FBRHJCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFFL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCw0Q0FBUSxHQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQU0sTUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDO2dCQUNqRSxNQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUM7Z0JBQ2xFLE1BQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCwrQ0FBVyxHQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEM7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsK0NBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxzQkFBSSwwQ0FBRzthQUlQO1lBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ25CLENBQUM7YUFORCxVQUFRLEdBQVc7WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDbEIsQ0FBQzs7O09BQUE7SUFNRCxnREFBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzVCLENBQUM7SUFFRCxnREFBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzVCLENBQUM7SUFFRCxzQkFBSSxnREFBUzthQUFiO1lBQ0UsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUM7OztPQUFBOztnQkE5RUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxxQkFBcUI7b0JBQy9CLE1BQU0sRUFBRSxrQ0FBa0M7b0JBQzFDLE9BQU8sRUFBRSxtQ0FBbUM7b0JBQzVDLDhJQUFtRDtvQkFFbkQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSiw2QkFBNkIsRUFBRSxNQUFNO3FCQUN0QztvQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7Z0JBNUJDLFFBQVE7Z0JBRlIsaUJBQWlCOztJQWtHbkIsZ0NBQUM7Q0FBQSxBQS9FRCxJQStFQztTQW5FWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT0FwcFNpZGVuYXZDb21wb25lbnQgfSBmcm9tICcuLi9vLWFwcC1zaWRlbmF2LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0FQUF9TSURFTkFWX0lNQUdFID0gW1xuICAnb3BlbmVkU3JjOiBvcGVuZWQtc3JjJyxcbiAgJ2Nsb3NlZFNyYzogY2xvc2VkLXNyYydcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19BUFBfU0lERU5BVl9JTUFHRSA9IFtcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYXBwLXNpZGVuYXYtaW1hZ2UnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQVBQX1NJREVOQVZfSU1BR0UsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0FQUF9TSURFTkFWX0lNQUdFLFxuICB0ZW1wbGF0ZVVybDogJy4vby1hcHAtc2lkZW5hdi1pbWFnZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYXBwLXNpZGVuYXYtaW1hZ2UuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1hcHAtc2lkZW5hdi1pbWFnZV0nOiAndHJ1ZSdcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT0FwcFNpZGVuYXZJbWFnZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBwcm90ZWN0ZWQgc2lkZW5hdjogT0FwcFNpZGVuYXZDb21wb25lbnQ7XG4gIHByb3RlY3RlZCBvcGVuZWRTcmM6IHN0cmluZztcbiAgcHJvdGVjdGVkIGNsb3NlZFNyYzogc3RyaW5nO1xuICBwcml2YXRlIF9zcmM6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgc2lkZW5hdk9wZW5TdWJzOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBzaWRlbmF2Q2xvc2VTdWJzOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIHRoaXMuc2lkZW5hdiA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9BcHBTaWRlbmF2Q29tcG9uZW50KTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnNpZGVuYXYpIHtcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgdGhpcy5zaWRlbmF2T3BlblN1YnMgPSB0aGlzLnNpZGVuYXYub25TaWRlbmF2Q2xvc2VkU3RhcnQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc2VsZi51cGRhdGVJbWFnZSgpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnNpZGVuYXZDbG9zZVN1YnMgPSB0aGlzLnNpZGVuYXYub25TaWRlbmF2T3BlbmVkU3RhcnQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgc2VsZi51cGRhdGVJbWFnZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlSW1hZ2UoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnNpZGVuYXZPcGVuU3Vicykge1xuICAgICAgdGhpcy5zaWRlbmF2T3BlblN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2lkZW5hdkNsb3NlU3Vicykge1xuICAgICAgdGhpcy5zaWRlbmF2Q2xvc2VTdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlSW1hZ2UoKSB7XG4gICAgaWYgKHRoaXMuc2lkZW5hdiAmJiB0aGlzLnNpZGVuYXYuc2lkZW5hdiAmJiB0aGlzLnNpZGVuYXYuc2lkZW5hdi5vcGVuZWQpIHtcbiAgICAgIHRoaXMuc2V0T3BlbmVkSW1nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0Q2xvc2VkSW1nKCk7XG4gICAgfVxuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgc2V0IHNyYyh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX3NyYyA9IHZhbDtcbiAgfVxuXG4gIGdldCBzcmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NyYztcbiAgfVxuXG4gIHNldE9wZW5lZEltZygpIHtcbiAgICB0aGlzLnNyYyA9IHRoaXMub3BlbmVkU3JjO1xuICB9XG5cbiAgc2V0Q2xvc2VkSW1nKCkge1xuICAgIHRoaXMuc3JjID0gdGhpcy5jbG9zZWRTcmM7XG4gIH1cblxuICBnZXQgc2hvd0ltYWdlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5fc3JjICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fc3JjLmxlbmd0aCA+IDApO1xuICB9XG59XG4iXX0=