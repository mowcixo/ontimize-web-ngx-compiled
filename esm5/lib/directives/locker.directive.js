import { Directive, ElementRef, Host, Input, Optional, Renderer2 } from '@angular/core';
import { OFormServiceComponent } from '../components/input/o-form-service-component.class';
export var DEFAULT_INPUTS_O_LOCKER = [
    'oLockerMode',
    'oLockerDelay'
];
var OLockerDirective = (function () {
    function OLockerDirective(element, renderer, parent) {
        var _this = this;
        this.element = element;
        this.renderer = renderer;
        this.parent = parent;
        this._oLockerMode = 'disable';
        if (parent) {
            this.subscription = parent.loadingSubject.subscribe(function (x) { return _this.manageLockerMode(x); });
        }
    }
    OLockerDirective.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    OLockerDirective.prototype.manageLockerMode = function (loading) {
        if (this._oLockerMode === 'load') {
            this.manageLoadMode(loading);
        }
        else {
            this.manageDisableMode(loading);
        }
    };
    OLockerDirective.prototype.manageDisableMode = function (loading) {
        if (loading) {
            this.parent.enabled = false;
        }
        else {
            this.parent.enabled = true;
        }
    };
    OLockerDirective.prototype.manageLoadMode = function (loading) {
        if (loading) {
            this.addLoading();
        }
        else {
            this.removeLoading();
        }
    };
    OLockerDirective.prototype.addLoading = function () {
        this.componentDiv = this.element.nativeElement.children[0];
        this.loadingParentDiv = this.renderer.createElement('div');
        var loaderChild1 = this.renderer.createElement('div');
        var loaderChild2 = this.renderer.createElement('div');
        var loaderChild3 = this.renderer.createElement('div');
        var loaderChild4 = this.renderer.createElement('div');
        this.renderer.appendChild(this.loadingParentDiv, loaderChild4);
        this.renderer.appendChild(this.loadingParentDiv, loaderChild3);
        this.renderer.appendChild(this.loadingParentDiv, loaderChild2);
        this.renderer.appendChild(this.loadingParentDiv, loaderChild1);
        this.renderer.insertBefore(this.element.nativeElement, this.loadingParentDiv, this.componentDiv);
        this.renderer.addClass(this.loadingParentDiv, 'o-loading');
        this.renderer.addClass(this.element.nativeElement, 'relative');
        this.renderer.setStyle(this.componentDiv, 'opacity', '0.6');
    };
    OLockerDirective.prototype.removeLoading = function () {
        if (this.loadingParentDiv) {
            this.renderer.removeChild(this.element.nativeElement, this.loadingParentDiv);
            this.renderer.removeClass(this.element.nativeElement, 'relative');
            this.renderer.removeStyle(this.componentDiv, 'opacity');
        }
    };
    Object.defineProperty(OLockerDirective.prototype, "oLockerMode", {
        set: function (value) {
            this._oLockerMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OLockerDirective.prototype, "oLockerDelay", {
        set: function (value) {
            this.parent.delayLoad = value;
        },
        enumerable: true,
        configurable: true
    });
    OLockerDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oLocker]',
                    inputs: DEFAULT_INPUTS_O_LOCKER
                },] }
    ];
    OLockerDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: OFormServiceComponent, decorators: [{ type: Optional }, { type: Host }] }
    ]; };
    OLockerDirective.propDecorators = {
        oLockerMode: [{ type: Input }],
        oLockerDelay: [{ type: Input }]
    };
    return OLockerDirective;
}());
export { OLockerDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9ja2VyLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlcy9sb2NrZXIuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQWEsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUduRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUUzRixNQUFNLENBQUMsSUFBTSx1QkFBdUIsR0FBRztJQUNyQyxhQUFhO0lBRWIsY0FBYztDQUNmLENBQUM7QUFFRjtJQWFFLDBCQUNVLE9BQW1CLEVBQ25CLFFBQW1CLEVBQ0MsTUFBNkI7UUFIM0QsaUJBUUM7UUFQUyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDQyxXQUFNLEdBQU4sTUFBTSxDQUF1QjtRQU5uRCxpQkFBWSxHQUFHLFNBQVMsQ0FBQztRQVEvQixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztTQUNwRjtJQUNILENBQUM7SUFFTSxzQ0FBVyxHQUFsQjtRQUNFLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVPLDJDQUFnQixHQUF4QixVQUF5QixPQUFnQjtRQUN2QyxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssTUFBTSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNMLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFP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NUIsQ0FBQzs7O09BQUE7SUFFRCxzQkFDSSwwQ0FBWTthQURoQixVQUNpQixLQUFhO1lBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNoQyxDQUFDOzs7T0FBQTs7Z0JBcEZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsTUFBTSxFQUFFLHVCQUF1QjtpQkFDaEM7OztnQkFkbUIsVUFBVTtnQkFBb0MsU0FBUztnQkFHbEUscUJBQXFCLHVCQXdCekIsUUFBUSxZQUFJLElBQUk7Ozs4QkE0RGxCLEtBQUs7K0JBS0wsS0FBSzs7SUFLUix1QkFBQztDQUFBLEFBdEZELElBc0ZDO1NBakZZLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdCwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWwsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9Gb3JtU2VydmljZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvaW5wdXQvby1mb3JtLXNlcnZpY2UtY29tcG9uZW50LmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTE9DS0VSID0gW1xuICAnb0xvY2tlck1vZGUnLFxuICAvKkRlZmF1bHQ6MjUwbXMqL1xuICAnb0xvY2tlckRlbGF5J1xuXTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29Mb2NrZXJdJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xPQ0tFUlxufSlcblxuZXhwb3J0IGNsYXNzIE9Mb2NrZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIHByaXZhdGUgbG9hZGluZ1BhcmVudERpdjtcbiAgcHJpdmF0ZSBjb21wb25lbnREaXY7XG5cbiAgcHJpdmF0ZSBfb0xvY2tlck1vZGUgPSAnZGlzYWJsZSc7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHByaXZhdGUgcGFyZW50OiBPRm9ybVNlcnZpY2VDb21wb25lbnRcbiAgKSB7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBwYXJlbnQubG9hZGluZ1N1YmplY3Quc3Vic2NyaWJlKHggPT4gdGhpcy5tYW5hZ2VMb2NrZXJNb2RlKHgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgbWFuYWdlTG9ja2VyTW9kZShsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29Mb2NrZXJNb2RlID09PSAnbG9hZCcpIHtcbiAgICAgIHRoaXMubWFuYWdlTG9hZE1vZGUobG9hZGluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFuYWdlRGlzYWJsZU1vZGUobG9hZGluZyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYW5hZ2VEaXNhYmxlTW9kZShsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHRoaXMucGFyZW50LmVuYWJsZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYXJlbnQuZW5hYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYW5hZ2VMb2FkTW9kZShsb2FkaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHRoaXMuYWRkTG9hZGluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZUxvYWRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZExvYWRpbmcoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnREaXYgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTsgLy8gc2V0IG9wYWNpdHkgaW4gY29tcG9uZW50RGl2XG4gICAgdGhpcy5sb2FkaW5nUGFyZW50RGl2ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBsb2FkZXJDaGlsZDEgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGxvYWRlckNoaWxkMiA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgbG9hZGVyQ2hpbGQzID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCBsb2FkZXJDaGlsZDQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDQpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDMpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDIpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5sb2FkaW5nUGFyZW50RGl2LCBsb2FkZXJDaGlsZDEpO1xuICAgIHRoaXMucmVuZGVyZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLmxvYWRpbmdQYXJlbnREaXYsIHRoaXMuY29tcG9uZW50RGl2KTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMubG9hZGluZ1BhcmVudERpdiwgJ28tbG9hZGluZycpO1xuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdyZWxhdGl2ZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jb21wb25lbnREaXYsICdvcGFjaXR5JywgJzAuNicpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVMb2FkaW5nKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxvYWRpbmdQYXJlbnREaXYpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHRoaXMubG9hZGluZ1BhcmVudERpdik7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAncmVsYXRpdmUnKTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlU3R5bGUodGhpcy5jb21wb25lbnREaXYsICdvcGFjaXR5Jyk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG9Mb2NrZXJNb2RlKHZhbHVlOiAnbG9hZCcgfCAnZGlzYWJsZWQnKSB7XG4gICAgdGhpcy5fb0xvY2tlck1vZGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBvTG9ja2VyRGVsYXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMucGFyZW50LmRlbGF5TG9hZCA9IHZhbHVlO1xuICB9XG5cbn1cbiJdfQ==