import { Directive, ElementRef, Host, Input, Optional, Renderer2 } from '@angular/core';
import { OFormServiceComponent } from '../components/input/o-form-service-component.class';
export const DEFAULT_INPUTS_O_LOCKER = [
    'oLockerMode',
    'oLockerDelay'
];
export class OLockerDirective {
    constructor(element, renderer, parent) {
        this.element = element;
        this.renderer = renderer;
        this.parent = parent;
        this._oLockerMode = 'disable';
        if (parent) {
            this.subscription = parent.loadingSubject.subscribe(x => this.manageLockerMode(x));
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    manageLockerMode(loading) {
        if (this._oLockerMode === 'load') {
            this.manageLoadMode(loading);
        }
        else {
            this.manageDisableMode(loading);
        }
    }
    manageDisableMode(loading) {
        if (loading) {
            this.parent.enabled = false;
        }
        else {
            this.parent.enabled = true;
        }
    }
    manageLoadMode(loading) {
        if (loading) {
            this.addLoading();
        }
        else {
            this.removeLoading();
        }
    }
    addLoading() {
        this.componentDiv = this.element.nativeElement.children[0];
        this.loadingParentDiv = this.renderer.createElement('div');
        const loaderChild1 = this.renderer.createElement('div');
        const loaderChild2 = this.renderer.createElement('div');
        const loaderChild3 = this.renderer.createElement('div');
        const loaderChild4 = this.renderer.createElement('div');
        this.renderer.appendChild(this.loadingParentDiv, loaderChild4);
        this.renderer.appendChild(this.loadingParentDiv, loaderChild3);
        this.renderer.appendChild(this.loadingParentDiv, loaderChild2);
        this.renderer.appendChild(this.loadingParentDiv, loaderChild1);
        this.renderer.insertBefore(this.element.nativeElement, this.loadingParentDiv, this.componentDiv);
        this.renderer.addClass(this.loadingParentDiv, 'o-loading');
        this.renderer.addClass(this.element.nativeElement, 'relative');
        this.renderer.setStyle(this.componentDiv, 'opacity', '0.6');
    }
    removeLoading() {
        if (this.loadingParentDiv) {
            this.renderer.removeChild(this.element.nativeElement, this.loadingParentDiv);
            this.renderer.removeClass(this.element.nativeElement, 'relative');
            this.renderer.removeStyle(this.componentDiv, 'opacity');
        }
    }
    set oLockerMode(value) {
        this._oLockerMode = value;
    }
    set oLockerDelay(value) {
        this.parent.delayLoad = value;
    }
}
OLockerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[oLocker]',
                inputs: DEFAULT_INPUTS_O_LOCKER
            },] }
];
OLockerDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: OFormServiceComponent, decorators: [{ type: Optional }, { type: Host }] }
];
OLockerDirective.propDecorators = {
    oLockerMode: [{ type: Input }],
    oLockerDelay: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9sb2NrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQWEsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUduRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUUzRixNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRztJQUNyQyxhQUFhO0lBRWIsY0FBYztDQUNmLENBQUM7QUFPRixNQUFNLE9BQU8sZ0JBQWdCO0lBUTNCLFlBQ1UsT0FBbUIsRUFDbkIsUUFBbUIsRUFDQyxNQUE2QjtRQUZqRCxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDQyxXQUFNLEdBQU4sTUFBTSxDQUF1QjtRQU5uRCxpQkFBWSxHQUFHLFNBQVMsQ0FBQztRQVEvQixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRjtJQUNILENBQUM7SUFFTSxXQUFXO1FBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVPLGdCQUFnQixDQUFDLE9BQWdCO1FBQ3ZDLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxNQUFNLEVBQUU7WUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0wsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2pDO0lB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Q0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLENBQUM7OztZQXBGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLE1BQU0sRUFBRSx1QkFBdUI7YUFDaEM7OztZQWRtQixVQUFVO1lBQW9DLFNBQVM7WUFHbEUscUJBQXFCLHVCQXdCekIsUUFBUSxZQUFJLElBQUk7OzswQkE0RGxCLEtBQUs7MkJBS0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdCwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWwsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9Gb3JtU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvaW5wdXQvby1mb3JtLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTE9DS0VSID0gW1xuICAnb0xvY2tlck1vZGUnLFxuICAvKkRlZmF1bHQ6MjUwbXMqL1xuICAnb0xvY2tlckRlbGF5J1xuXTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29Mb2NrZXJdJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xPQ0tFUlxufSlcblxuZXhwb3J0IGNsYXNzIE9Mb2NrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIHByaXZhdGUgbG9hZGluZ1BhcmVudERpdjtcbiAgcHJpdmF0ZSBjb21wb25lbnREaXY7XG5cbiAgcHJpdmF0ZSBfb0xvY2tlck1vZGUgPSAnZGlzYWJsZSc7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHByaXZhdGUgcGFyZW50OiBPRm9ybVNlcnZpY2VDb21wb25lbnRcbiAgKSB7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBwYXJlbnQubG9hZGluZ1N1YmplY3Quc3Vic2NyaWJlKHggPT4gdGhpcy5tYW5hZ2VMb2NrZXJNb2RlKHgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgbWFuYWdlTG9ja2VyTW9kZShsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29Mb2NrZXJNb2RlID09PSAnbG9hZCcpIHtcbiAgICAgIHRoaXMubWFuYWdlTG9hZE1vZGUobG9hZGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFuYWdlRGlzYWJsZU1vZGUobG9hZGluZyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYW5hZ2VEaXNhYmxlTW9kZShsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHRoaXMucGFyZW50LmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJlbnQuZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYW5hZ2VMb2FkTW9kZShsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHRoaXMuYWRkTG9hZGluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUxvYWRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZExvYWRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnREaXYgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTsgLy8gc2V0IG9wYWNpdHkgaW4gY29tcG9uZW50RGl2XG4gICAgdGhpcy5sb2FkaW5nUGFyZW50RGl2ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBsb2FkZXJDaGlsZDEgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGxvYWRlckNoaWxkMiA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgbG9hZGVyQ2hpbGQzID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBsb2FkZXJDaGlsZDQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDQpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDMpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDIpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDEpO1xuICAgIHRoaXMucmVuZGVyZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLmxvYWRpbmdQYXJlbnREaXYsIHRoaXMuY29tcG9uZW50RGl2KTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMubG9hZGluZ1BhcmVudERpdiwgJ28tbG9hZGluZycpO1xuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdyZWxhdGl2ZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jb21wb25lbnREaXYsICdvcGFjaXR5JywgJzAuNicpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVMb2FkaW5nKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxvYWRpbmdQYXJlbnREaXYpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHRoaXMubG9hZGluZ1BhcmVudERpdik7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAncmVsYXRpdmUnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5jb21wb25lbnREaXYsICdvcGFjaXR5Jyk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG9Mb2NrZXJNb2RlKHZhbHVlOiAnbG9hZCcgfCAnZGlzYWJsZWQnKSB7XG4gICAgdGhpcy5fb0xvY2tlck1vZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBvTG9ja2VyRGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMucGFyZW50LmRlbGF5TG9hZCA9IHZhbHVlO1xuICB9XG5cbn1cbiJdfQ==