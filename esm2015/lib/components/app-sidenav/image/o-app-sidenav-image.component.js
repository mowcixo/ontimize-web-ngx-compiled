import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, ViewEncapsulation, } from '@angular/core';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
export const DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE = [
    'openedSrc: opened-src',
    'closedSrc: closed-src'
];
export const DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE = [];
export class OAppSidenavImageComponent {
    constructor(injector, cd) {
        this.injector = injector;
        this.cd = cd;
        this.sidenav = this.injector.get(OAppSidenavComponent);
    }
    ngOnInit() {
        if (this.sidenav) {
            const self = this;
            this.sidenavOpenSubs = this.sidenav.onSidenavClosedStart.subscribe(() => {
                self.updateImage();
            });
            this.sidenavCloseSubs = this.sidenav.onSidenavOpenedStart.subscribe(() => {
                self.updateImage();
            });
        }
        this.updateImage();
    }
    ngOnDestroy() {
        if (this.sidenavOpenSubs) {
            this.sidenavOpenSubs.unsubscribe();
        }
        if (this.sidenavCloseSubs) {
            this.sidenavCloseSubs.unsubscribe();
        }
    }
    updateImage() {
        if (this.sidenav && this.sidenav.sidenav && this.sidenav.sidenav.opened) {
            this.setOpenedImg();
        }
        else {
            this.setClosedImg();
        }
        this.cd.detectChanges();
    }
    set src(val) {
        this._src = val;
    }
    get src() {
        return this._src;
    }
    setOpenedImg() {
        this.src = this.openedSrc;
    }
    setClosedImg() {
        this.src = this.closedSrc;
    }
    get showImage() {
        return (this._src !== undefined && this._src.length > 0);
    }
}
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
OAppSidenavImageComponent.ctorParameters = () => [
    { type: Injector },
    { type: ChangeDetectorRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtc2lkZW5hdi1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvYXBwLXNpZGVuYXYvaW1hZ2Uvby1hcHAtc2lkZW5hdi1pbWFnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFFBQVEsRUFHUixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbEUsTUFBTSxDQUFDLE1BQU0sa0NBQWtDLEdBQUc7SUFDaEQsdUJBQXVCO0lBQ3ZCLHVCQUF1QjtDQUN4QixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQUcsRUFDbEQsQ0FBQztBQWNGLE1BQU0sT0FBTyx5QkFBeUI7SUFVcEMsWUFDWSxRQUFrQixFQUNsQixFQUFxQjtRQURyQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBRS9CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3RFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3ZFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDcEM7UUFDRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDdkUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7UUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLEdBQUcsQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELFlBQVk7UUFDVixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDNUIsQ0FBQztJQUVELFlBQVk7UUFDVixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDOzs7WUE5RUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLE1BQU0sRUFBRSxrQ0FBa0M7Z0JBQzFDLE9BQU8sRUFBRSxtQ0FBbUM7Z0JBQzVDLDhJQUFtRDtnQkFFbkQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSiw2QkFBNkIsRUFBRSxNQUFNO2lCQUN0QztnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7YUFDaEQ7OztZQTVCQyxRQUFRO1lBRlIsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9BcHBTaWRlbmF2Q29tcG9uZW50IH0gZnJvbSAnLi4vby1hcHAtc2lkZW5hdi5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19BUFBfU0lERU5BVl9JTUFHRSA9IFtcbiAgJ29wZW5lZFNyYzogb3BlbmVkLXNyYycsXG4gICdjbG9zZWRTcmM6IGNsb3NlZC1zcmMnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQVBQX1NJREVOQVZfSU1BR0UgPSBbXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWFwcC1zaWRlbmF2LWltYWdlJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0FQUF9TSURFTkFWX0lNQUdFLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19BUFBfU0lERU5BVl9JTUFHRSxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYXBwLXNpZGVuYXYtaW1hZ2UuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWFwcC1zaWRlbmF2LWltYWdlLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYXBwLXNpZGVuYXYtaW1hZ2VdJzogJ3RydWUnXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9BcHBTaWRlbmF2SW1hZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG5cbiAgcHJvdGVjdGVkIHNpZGVuYXY6IE9BcHBTaWRlbmF2Q29tcG9uZW50O1xuICBwcm90ZWN0ZWQgb3BlbmVkU3JjOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBjbG9zZWRTcmM6IHN0cmluZztcbiAgcHJpdmF0ZSBfc3JjOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHNpZGVuYXZPcGVuU3ViczogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgc2lkZW5hdkNsb3NlU3ViczogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICB0aGlzLnNpZGVuYXYgPSB0aGlzLmluamVjdG9yLmdldChPQXBwU2lkZW5hdkNvbXBvbmVudCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5zaWRlbmF2KSB7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuc2lkZW5hdk9wZW5TdWJzID0gdGhpcy5zaWRlbmF2Lm9uU2lkZW5hdkNsb3NlZFN0YXJ0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNlbGYudXBkYXRlSW1hZ2UoKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zaWRlbmF2Q2xvc2VTdWJzID0gdGhpcy5zaWRlbmF2Lm9uU2lkZW5hdk9wZW5lZFN0YXJ0LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHNlbGYudXBkYXRlSW1hZ2UoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZUltYWdlKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5zaWRlbmF2T3BlblN1YnMpIHtcbiAgICAgIHRoaXMuc2lkZW5hdk9wZW5TdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpZGVuYXZDbG9zZVN1YnMpIHtcbiAgICAgIHRoaXMuc2lkZW5hdkNsb3NlU3Vicy51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUltYWdlKCkge1xuICAgIGlmICh0aGlzLnNpZGVuYXYgJiYgdGhpcy5zaWRlbmF2LnNpZGVuYXYgJiYgdGhpcy5zaWRlbmF2LnNpZGVuYXYub3BlbmVkKSB7XG4gICAgICB0aGlzLnNldE9wZW5lZEltZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldENsb3NlZEltZygpO1xuICAgIH1cbiAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHNldCBzcmModmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9zcmMgPSB2YWw7XG4gIH1cblxuICBnZXQgc3JjKCkge1xuICAgIHJldHVybiB0aGlzLl9zcmM7XG4gIH1cblxuICBzZXRPcGVuZWRJbWcoKSB7XG4gICAgdGhpcy5zcmMgPSB0aGlzLm9wZW5lZFNyYztcbiAgfVxuXG4gIHNldENsb3NlZEltZygpIHtcbiAgICB0aGlzLnNyYyA9IHRoaXMuY2xvc2VkU3JjO1xuICB9XG5cbiAgZ2V0IHNob3dJbWFnZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuX3NyYyAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX3NyYy5sZW5ndGggPiAwKTtcbiAgfVxufVxuIl19