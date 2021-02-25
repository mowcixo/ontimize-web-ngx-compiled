import { Directive, ElementRef, forwardRef, Inject, Renderer2 } from '@angular/core';
import { OTableComponent } from '../../o-table.component';
export class OTableRowDirective {
    constructor(table, elementRef, renderer) {
        this.table = table;
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        this.registerResize();
    }
    ngOnDestroy() {
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }
    registerResize() {
        if (this.table.horizontalScroll) {
            const self = this;
            this.table.onUpdateScrolledState.subscribe(scrolled => {
                setTimeout(() => {
                    if (scrolled) {
                        self.calculateRowWidth();
                    }
                    else {
                        self.setRowWidth(undefined);
                    }
                }, 0);
            });
        }
    }
    calculateRowWidth() {
        if (!this.table.horizontalScroll) {
            return;
        }
        if (this.alreadyScrolled) {
            this.setRowWidth(this.table.rowWidth);
        }
        let totalWidth = 0;
        try {
            this.elementRef.nativeElement.childNodes.forEach(element => {
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
    }
    setRowWidth(value) {
        const widthValue = value !== undefined ? value + 'px' : 'auto';
        this.renderer.setStyle(this.elementRef.nativeElement, 'width', widthValue);
        this.table.rowWidth = value;
    }
    get alreadyScrolled() {
        return this.table.rowWidth !== undefined;
    }
}
OTableRowDirective.decorators = [
    { type: Directive, args: [{
                selector: '[oTableRow]'
            },] }
];
OTableRowDirective.ctorParameters = () => [
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] },
    { type: ElementRef },
    { type: Renderer2 }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1yb3cuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvcm93L28tdGFibGUtcm93LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBYSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHL0csT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBSzFELE1BQU0sT0FBTyxrQkFBa0I7SUFHN0IsWUFDb0QsS0FBc0IsRUFDOUQsVUFBc0IsRUFDdEIsUUFBbUI7UUFGcUIsVUFBSyxHQUFMLEtBQUssQ0FBaUI7UUFDOUQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFXO0lBRS9CLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUU7WUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNwRCxVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLElBQUksUUFBUSxFQUFFO3dCQUNaLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO3FCQUMxQjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUM3QjtnQkFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDUixDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELGlCQUFpQjtRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQ2hDLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLFVBQVUsR0FBVyxDQUFDLENBQUM7UUFDM0IsSUFBSTtZQUNGLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3pELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsS0FBSyxVQUFVLEVBQUU7b0JBQzlFLFVBQVUsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDO2lCQUNuQztZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxPQUFPLEtBQUssRUFBRTtTQUVmO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQ3hDLFVBQVUsSUFBSSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5QjtJQUNILENBQUM7SUFFRCxXQUFXLENBQUMsS0FBYTtRQUN2QixNQUFNLFVBQVUsR0FBRyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDL0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO0lBQzNDLENBQUM7OztZQXJFRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7YUFDeEI7OztZQUpRLGVBQWUsdUJBU25CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO1lBWlYsVUFBVTtZQUFpQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIE9uRGVzdHJveSwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbb1RhYmxlUm93XSdcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlUm93RGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgcHJvdGVjdGVkIHJlc2l6ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwdWJsaWMgdGFibGU6IE9UYWJsZUNvbXBvbmVudCxcbiAgICBwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyUmVzaXplKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5yZXNpemVTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJSZXNpemUoKSB7XG4gICAgaWYgKHRoaXMudGFibGUuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLnRhYmxlLm9uVXBkYXRlU2Nyb2xsZWRTdGF0ZS5zdWJzY3JpYmUoc2Nyb2xsZWQgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoc2Nyb2xsZWQpIHtcbiAgICAgICAgICAgIHNlbGYuY2FsY3VsYXRlUm93V2lkdGgoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5zZXRSb3dXaWR0aCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjYWxjdWxhdGVSb3dXaWR0aCgpIHtcbiAgICBpZiAoIXRoaXMudGFibGUuaG9yaXpvbnRhbFNjcm9sbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hbHJlYWR5U2Nyb2xsZWQpIHtcbiAgICAgIHRoaXMuc2V0Um93V2lkdGgodGhpcy50YWJsZS5yb3dXaWR0aCk7XG4gICAgfVxuICAgIGxldCB0b3RhbFdpZHRoOiBudW1iZXIgPSAwO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZSAmJiBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ21hdC1jZWxsJykge1xuICAgICAgICAgIHRvdGFsV2lkdGggKz0gZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vXG4gICAgfVxuICAgIGlmICghaXNOYU4odG90YWxXaWR0aCkgJiYgdG90YWxXaWR0aCA+IDApIHtcbiAgICAgIHRvdGFsV2lkdGggKz0gNDg7XG4gICAgICB0aGlzLnNldFJvd1dpZHRoKHRvdGFsV2lkdGgpO1xuICAgIH1cbiAgfVxuXG4gIHNldFJvd1dpZHRoKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCB3aWR0aFZhbHVlID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlICsgJ3B4JyA6ICdhdXRvJztcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCB3aWR0aFZhbHVlKTtcbiAgICB0aGlzLnRhYmxlLnJvd1dpZHRoID0gdmFsdWU7XG4gIH1cblxuICBnZXQgYWxyZWFkeVNjcm9sbGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnRhYmxlLnJvd1dpZHRoICE9PSB1bmRlZmluZWQ7XG4gIH1cblxufVxuIl19