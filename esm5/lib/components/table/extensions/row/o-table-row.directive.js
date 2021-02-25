import { Directive, ElementRef, forwardRef, Inject, Renderer2 } from '@angular/core';
import { OTableComponent } from '../../o-table.component';
var OTableRowDirective = (function () {
    function OTableRowDirective(table, elementRef, renderer) {
        this.table = table;
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    OTableRowDirective.prototype.ngAfterViewInit = function () {
        this.registerResize();
    };
    OTableRowDirective.prototype.ngOnDestroy = function () {
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    };
    OTableRowDirective.prototype.registerResize = function () {
        if (this.table.horizontalScroll) {
            var self_1 = this;
            this.table.onUpdateScrolledState.subscribe(function (scrolled) {
                setTimeout(function () {
                    if (scrolled) {
                        self_1.calculateRowWidth();
                    }
                    else {
                        self_1.setRowWidth(undefined);
                    }
                }, 0);
            });
        }
    };
    OTableRowDirective.prototype.calculateRowWidth = function () {
        if (!this.table.horizontalScroll) {
            return;
        }
        if (this.alreadyScrolled) {
            this.setRowWidth(this.table.rowWidth);
        }
        var totalWidth = 0;
        try {
            this.elementRef.nativeElement.childNodes.forEach(function (element) {
                if (element && element.tagName && element.tagName.toLowerCase() === 'mat-cell') {
                    totalWidth += element.clientWidth;
                }
            });
        }
        catch (error) {
        }
        if (!isNaN(totalWidth) && totalWidth > 0) {
            totalWidth += 48;
            this.setRowWidth(totalWidth);
        }
    };
    OTableRowDirective.prototype.setRowWidth = function (value) {
        var widthValue = value !== undefined ? value + 'px' : 'auto';
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', widthValue);
        this.table.rowWidth = value;
    };
    Object.defineProperty(OTableRowDirective.prototype, "alreadyScrolled", {
        get: function () {
            return this.table.rowWidth !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    OTableRowDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oTableRow]'
                },] }
    ];
    OTableRowDirective.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    return OTableRowDirective;
}());
export { OTableRowDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1yb3cuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvcm93L28tdGFibGUtcm93LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHL0csT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTFEO0lBTUUsNEJBQ29ELEtBQXNCLEVBQzlELFVBQXNCLEVBQ3RCLFFBQW1CO1FBRnFCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQzlELGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztJQUUvQixDQUFDO0lBRUQsNENBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsd0NBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCwyQ0FBYyxHQUFkO1FBQ0UsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQy9CLElBQU0sTUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxVQUFBLFFBQVE7Z0JBQ2pELFVBQVUsQ0FBQztvQkFDVCxJQUFJLFFBQVEsRUFBRTt3QkFDWixNQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztxQkFDMUI7eUJBQU07d0JBQ0wsTUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDN0I7Z0JBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCw4Q0FBaUIsR0FBakI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxVQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQzNCLElBQUk7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztnQkFDdEQsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsRUFBRTtvQkFDOUUsVUFBVSxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUM7aUJBQ25DO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU8sS0FBSyxFQUFFO1NBRWY7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDeEMsVUFBVSxJQUFJLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVELHdDQUFXLEdBQVgsVUFBWSxLQUFhO1FBQ3ZCLElBQU0sVUFBVSxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDM0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFRCxzQkFBSSwrQ0FBZTthQUFuQjtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO1FBQzNDLENBQUM7OztPQUFBOztnQkFyRUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO2lCQUN4Qjs7O2dCQUpRLGVBQWUsdUJBU25CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7Z0JBWlYsVUFBVTtnQkFBaUMsU0FBUzs7SUE0RXZGLHlCQUFDO0NBQUEsQUF2RUQsSUF1RUM7U0FwRVksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIE9uRGVzdHJveSwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbb1RhYmxlUm93XSdcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlUm93RGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgcHJvdGVjdGVkIHJlc2l6ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwdWJsaWMgdGFibGU6IE9UYWJsZUNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyUmVzaXplKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZXNpemVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJSZXNpemUoKSB7XG4gICAgaWYgKHRoaXMudGFibGUuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnRhYmxlLm9uVXBkYXRlU2Nyb2xsZWRTdGF0ZS5zdWJzY3JpYmUoc2Nyb2xsZWQgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgIHNlbGYuY2FsY3VsYXRlUm93V2lkdGgoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5zZXRSb3dXaWR0aCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVSb3dXaWR0aCgpIHtcbiAgICBpZiAoIXRoaXMudGFibGUuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hbHJlYWR5U2Nyb2xsZWQpIHtcbiAgICAgIHRoaXMuc2V0Um93V2lkdGgodGhpcy50YWJsZS5yb3dXaWR0aCk7XG4gICAgfVxuICAgIGxldCB0b3RhbFdpZHRoOiBudW1iZXIgPSAwO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZSAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ21hdC1jZWxsJykge1xuICAgICAgICAgIHRvdGFsV2lkdGggKz0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vXG4gICAgfVxuICAgIGlmICghaXNOYU4odG90YWxXaWR0aCkgJiYgdG90YWxXaWR0aCA+IDApIHtcbiAgICAgIHRvdGFsV2lkdGggKz0gNDg7XG4gICAgICB0aGlzLnNldFJvd1dpZHRoKHRvdGFsV2lkdGgpO1xuICAgIH1cbiAgfVxuXG4gIHNldFJvd1dpZHRoKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCB3aWR0aFZhbHVlID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlICsgJ3B4JyA6ICdhdXRvJztcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCB3aWR0aFZhbHVlKTtcbiAgICB0aGlzLnRhYmxlLnJvd1dpZHRoID0gdmFsdWU7XG4gIH1cblxuICBnZXQgYWxyZWFkeVNjcm9sbGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLnJvd1dpZHRoICE9PSB1bmRlZmluZWQ7XG4gIH1cblxufVxuIl19