import { ElementRef, Inject, Injector, Optional, ViewChild, } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material';
import { Util } from '../../util/util';
export var DEFAULT_INPUTS_O_CONTAINER = [
    'oattr: attr',
    'title',
    'layoutAlign: layout-align',
    'elevation',
    'icon',
    'appearance',
    'layoutGap: layout-gap'
];
var OContainerComponent = (function () {
    function OContainerComponent(elRef, injector, matFormDefaultOption) {
        var _this = this;
        this.elRef = elRef;
        this.injector = injector;
        this.matFormDefaultOption = matFormDefaultOption;
        this._elevation = 0;
        this.defaultLayoutAlign = 'start start';
        this._outlineGapCalculationNeededImmediately = false;
        this.titleObserver = new MutationObserver(function () { return _this.updateOutlineGap(); });
    }
    Object.defineProperty(OContainerComponent.prototype, "containerTitle", {
        set: function (elem) {
            this._titleEl = elem;
            if (this._titleEl) {
                this.registerObserver();
                this.updateOutlineGap();
            }
            else {
                this.unRegisterObserver();
            }
        },
        enumerable: true,
        configurable: true
    });
    OContainerComponent.prototype.ngAfterViewInit = function () {
        if (this.elRef) {
            this.elRef.nativeElement.removeAttribute('title');
        }
        this.registerObserver();
    };
    OContainerComponent.prototype.ngAfterContentChecked = function () {
        if (this._outlineGapCalculationNeededImmediately) {
            this.updateOutlineGap();
        }
    };
    OContainerComponent.prototype.ngOnDestroy = function () {
        this.unRegisterObserver();
    };
    OContainerComponent.prototype.getAttribute = function () {
        if (this.oattr) {
            return this.oattr;
        }
        else if (this.elRef && this.elRef.nativeElement.attributes.attr) {
            return this.elRef.nativeElement.attributes.attr.value;
        }
    };
    Object.defineProperty(OContainerComponent.prototype, "appearance", {
        get: function () {
            return this._appearance;
        },
        set: function (value) {
            var _this = this;
            this._appearance = value;
            setTimeout(function () { _this.updateOutlineGap(); }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OContainerComponent.prototype, "elevation", {
        get: function () {
            return this._elevation;
        },
        set: function (elevation) {
            this._elevation = elevation;
            this.propagateElevationToDOM();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OContainerComponent.prototype, "layoutAlign", {
        get: function () {
            return this._layoutAlign;
        },
        set: function (align) {
            if (!align || align.length === 0) {
                align = this.defaultLayoutAlign;
            }
            this._layoutAlign = align;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OContainerComponent.prototype, "layoutGap", {
        get: function () {
            return this._layoutGap;
        },
        set: function (layoutGap) {
            this._layoutGap = layoutGap;
        },
        enumerable: true,
        configurable: true
    });
    OContainerComponent.prototype.hasHeader = function () {
        return !!this.title || !!this.icon;
    };
    OContainerComponent.prototype.isAppearanceOutline = function () {
        var isAppearanceOutline = (this.matFormDefaultOption && this.matFormDefaultOption.appearance === OContainerComponent.APPEARANCE_OUTLINE);
        if (Util.isDefined(this.appearance)) {
            isAppearanceOutline = this.appearance === OContainerComponent.APPEARANCE_OUTLINE;
        }
        return isAppearanceOutline;
    };
    OContainerComponent.prototype.hasTitleInAppearanceOutline = function () {
        return this.isAppearanceOutline() && this.hasHeader();
    };
    OContainerComponent.prototype.propagateElevationToDOM = function () {
        this.cleanElevationCSSclasses();
        if (this.elevation > 0 && this.elevation <= 12) {
            this.elRef.nativeElement.classList.add('mat-elevation-z' + this.elevation);
        }
    };
    OContainerComponent.prototype.cleanElevationCSSclasses = function () {
        var _this = this;
        var classList = [].slice.call(this.elRef.nativeElement.classList);
        if (classList && classList.length) {
            classList.forEach(function (item) {
                if (item.startsWith('mat-elevation')) {
                    _this.elRef.nativeElement.classList.remove(item);
                }
            });
        }
    };
    OContainerComponent.prototype.updateOutlineGap = function () {
        if (this.isAppearanceOutline()) {
            var titleEl = this._titleEl ? this._titleEl.nativeElement : null;
            if (!this._containerRef) {
                return;
            }
            if (document.documentElement && !document.documentElement.contains(this.elRef.nativeElement)) {
                this._outlineGapCalculationNeededImmediately = true;
                return;
            }
            var container = this._containerRef.nativeElement;
            var containerRect = container.getBoundingClientRect();
            if (containerRect.width === 0 && containerRect.height === 0) {
                return;
            }
            var containerStart = containerRect.left;
            var labelStart = titleEl.getBoundingClientRect().left;
            var labelWidth = this.hasHeader() ? titleEl.offsetWidth : 0;
            var startWidth = labelStart - containerStart;
            var startEls = container.querySelectorAll('.o-container-outline-start');
            var gapEls = container.querySelectorAll('.o-container-outline-gap');
            gapEls[0].style.width = labelWidth + "px";
            startEls[0].style.width = startWidth + "px";
            this._outlineGapCalculationNeededImmediately = false;
        }
    };
    OContainerComponent.prototype.registerObserver = function () {
        if (this._titleEl) {
            this.titleObserver.observe(this._titleEl.nativeElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    };
    OContainerComponent.prototype.unRegisterObserver = function () {
        if (this.titleObserver) {
            this.titleObserver.disconnect();
        }
    };
    OContainerComponent.APPEARANCE_OUTLINE = 'outline';
    OContainerComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
    ]; };
    OContainerComponent.propDecorators = {
        containerTitle: [{ type: ViewChild, args: ['containerTitle', { static: false },] }],
        _containerRef: [{ type: ViewChild, args: ['container', { static: false },] }]
    };
    return OContainerComponent;
}());
export { OContainerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250YWluZXItY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9vLWNvbnRhaW5lci1jb21wb25lbnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLDhCQUE4QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixHQUFHO0lBQ3hDLGFBQWE7SUFDYixPQUFPO0lBQ1AsMkJBQTJCO0lBQzNCLFdBQVc7SUFDWCxNQUFNO0lBQ04sWUFBWTtJQUNaLHVCQUF1QjtDQUN4QixDQUFDO0FBRUY7SUE2QkUsNkJBQ1ksS0FBaUIsRUFDakIsUUFBa0IsRUFDa0Msb0JBQW9CO1FBSHBGLGlCQUlLO1FBSE8sVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2tDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBQTtRQXpCMUUsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2Qix1QkFBa0IsR0FBVyxhQUFhLENBQUM7UUFLN0MsNENBQXVDLEdBQUcsS0FBSyxDQUFDO1FBRTlDLGtCQUFhLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixFQUFFLEVBQXZCLENBQXVCLENBQUMsQ0FBQztJQWtCMUUsQ0FBQztJQWZMLHNCQUFvRCwrQ0FBYzthQUFsRSxVQUFtRSxJQUFnQjtZQUNqRixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7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SUFDSCxDQUFDO0lBRVMsOENBQWdCLEdBQTFCO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFO2dCQUN0RCxTQUFTLEVBQUUsSUFBSTtnQkFDZixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLElBQUk7YUFDZCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFUyxnREFBa0IsR0FBNUI7UUFDRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNqQztJQUNILENBQUM7SUE5S2Esc0NBQWtCLEdBQUcsU0FBUyxDQUFDOztnQkF2QjdDLFVBQVU7Z0JBRVYsUUFBUTtnREFtREwsUUFBUSxZQUFJLE1BQU0sU0FBQyw4QkFBOEI7OztpQ0FkbkQsU0FBUyxTQUFDLGdCQUFnQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQ0FTN0MsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBdUozQywwQkFBQztDQUFBLEFBbExELElBa0xDO1NBbExZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyVmlld0luaXQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVIgPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICd0aXRsZScsXG4gICdsYXlvdXRBbGlnbjogbGF5b3V0LWFsaWduJyxcbiAgJ2VsZXZhdGlvbicsXG4gICdpY29uJyxcbiAgJ2FwcGVhcmFuY2UnLFxuICAnbGF5b3V0R2FwOiBsYXlvdXQtZ2FwJ1xuXTtcblxuZXhwb3J0IGNsYXNzIE9Db250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudENoZWNrZWQge1xuXG4gIHB1YmxpYyBzdGF0aWMgQVBQRUFSQU5DRV9PVVRMSU5FID0gJ291dGxpbmUnO1xuXG4gIHB1YmxpYyBvYXR0cjogc3RyaW5nO1xuXG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2VsZXZhdGlvbjogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIGRlZmF1bHRMYXlvdXRBbGlnbjogc3RyaW5nID0gJ3N0YXJ0IHN0YXJ0JztcbiAgcHJvdGVjdGVkIF9sYXlvdXRBbGlnbjogc3RyaW5nO1xuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2FwcGVhcmFuY2U6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9sYXlvdXRHYXA6IHN0cmluZztcbiAgcHJpdmF0ZSBfb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgdGl0bGVPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHRoaXMudXBkYXRlT3V0bGluZUdhcCgpKTtcblxuICBwcm90ZWN0ZWQgX3RpdGxlRWw6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lclRpdGxlJywgeyBzdGF0aWM6IGZhbHNlIH0pIHNldCBjb250YWluZXJUaXRsZShlbGVtOiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5fdGl0bGVFbCA9IGVsZW07XG4gICAgaWYgKHRoaXMuX3RpdGxlRWwpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJPYnNlcnZlcigpO1xuICAgICAgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7IC8vIFRoaXMgbXVzdCBiZSB0cmlnZ2VyZWQgd2hlbiB0aXRsZSBjb250YWluZXIgaXMgcmUtcmVnaXN0ZXJlZFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuUmVnaXN0ZXJPYnNlcnZlcigpO1xuICAgIH1cbiAgfVxuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJvdGVjdGVkIF9jb250YWluZXJSZWY6IEVsZW1lbnRSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByb3RlY3RlZCBtYXRGb3JtRGVmYXVsdE9wdGlvblxuICApIHsgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lbFJlZikge1xuICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgICB9XG4gICAgdGhpcy5yZWdpc3Rlck9ic2VydmVyKCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnVwZGF0ZU91dGxpbmVHYXAoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnVuUmVnaXN0ZXJPYnNlcnZlcigpO1xuICB9XG5cbiAgcHVibGljIGdldEF0dHJpYnV0ZSgpIHtcbiAgICBpZiAodGhpcy5vYXR0cikge1xuICAgICAgcmV0dXJuIHRoaXMub2F0dHI7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsUmVmICYmIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5hdHRyaWJ1dGVzLmF0dHIpIHtcbiAgICAgIHJldHVybiB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuYXR0cmlidXRlcy5hdHRyLnZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldCBhcHBlYXJhbmNlKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBlYXJhbmNlO1xuICB9XG5cbiAgc2V0IGFwcGVhcmFuY2UodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2FwcGVhcmFuY2UgPSB2YWx1ZTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy51cGRhdGVPdXRsaW5lR2FwKCk7IH0sIDApO1xuICB9XG5cbiAgZ2V0IGVsZXZhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fZWxldmF0aW9uO1xuICB9XG5cbiAgc2V0IGVsZXZhdGlvbihlbGV2YXRpb246IG51bWJlcikge1xuICAgIHRoaXMuX2VsZXZhdGlvbiA9IGVsZXZhdGlvbjtcbiAgICB0aGlzLnByb3BhZ2F0ZUVsZXZhdGlvblRvRE9NKCk7XG4gIH1cblxuICBnZXQgbGF5b3V0QWxpZ24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dEFsaWduO1xuICB9XG5cbiAgc2V0IGxheW91dEFsaWduKGFsaWduOiBzdHJpbmcpIHtcbiAgICBpZiAoIWFsaWduIHx8IGFsaWduLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYWxpZ24gPSB0aGlzLmRlZmF1bHRMYXlvdXRBbGlnbjtcbiAgICB9XG4gICAgdGhpcy5fbGF5b3V0QWxpZ24gPSBhbGlnbjtcbiAgfVxuXG4gIGdldCBsYXlvdXRHYXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheW91dEdhcDtcbiAgfVxuXG4gIHNldCBsYXlvdXRHYXAobGF5b3V0R2FwOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9sYXlvdXRHYXAgPSBsYXlvdXRHYXA7XG4gIH1cblxuICBwdWJsaWMgaGFzSGVhZGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMudGl0bGUgfHwgISF0aGlzLmljb247XG4gIH1cblxuICBwdWJsaWMgaXNBcHBlYXJhbmNlT3V0bGluZSgpOiBib29sZWFuIHtcbiAgICBsZXQgaXNBcHBlYXJhbmNlT3V0bGluZSA9ICh0aGlzLm1hdEZvcm1EZWZhdWx0T3B0aW9uICYmIHRoaXMubWF0Rm9ybURlZmF1bHRPcHRpb24uYXBwZWFyYW5jZSA9PT0gT0NvbnRhaW5lckNvbXBvbmVudC5BUFBFQVJBTkNFX09VVExJTkUpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLmFwcGVhcmFuY2UpKSB7XG4gICAgICBpc0FwcGVhcmFuY2VPdXRsaW5lID0gdGhpcy5hcHBlYXJhbmNlID09PSBPQ29udGFpbmVyQ29tcG9uZW50LkFQUEVBUkFOQ0VfT1VUTElORTtcbiAgICB9XG4gICAgcmV0dXJuIGlzQXBwZWFyYW5jZU91dGxpbmU7XG4gIH1cblxuICBwdWJsaWMgaGFzVGl0bGVJbkFwcGVhcmFuY2VPdXRsaW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzQXBwZWFyYW5jZU91dGxpbmUoKSAmJiB0aGlzLmhhc0hlYWRlcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHByb3BhZ2F0ZUVsZXZhdGlvblRvRE9NKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYW5FbGV2YXRpb25DU1NjbGFzc2VzKCk7XG4gICAgaWYgKHRoaXMuZWxldmF0aW9uID4gMCAmJiB0aGlzLmVsZXZhdGlvbiA8PSAxMikge1xuICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1lbGV2YXRpb24teicgKyB0aGlzLmVsZXZhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNsZWFuRWxldmF0aW9uQ1NTY2xhc3NlcygpOiB2b2lkIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSBbXS5zbGljZS5jYWxsKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QpO1xuICAgIGlmIChjbGFzc0xpc3QgJiYgY2xhc3NMaXN0Lmxlbmd0aCkge1xuICAgICAgY2xhc3NMaXN0LmZvckVhY2goKGl0ZW06IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAoaXRlbS5zdGFydHNXaXRoKCdtYXQtZWxldmF0aW9uJykpIHtcbiAgICAgICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVwZGF0ZU91dGxpbmVHYXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNBcHBlYXJhbmNlT3V0bGluZSgpKSB7XG4gICAgICBjb25zdCB0aXRsZUVsID0gdGhpcy5fdGl0bGVFbCA/IHRoaXMuX3RpdGxlRWwubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICAgIGlmICghdGhpcy5fY29udGFpbmVyUmVmKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgIHRoaXMuX291dGxpbmVHYXBDYWxjdWxhdGlvbk5lZWRlZEltbWVkaWF0ZWx5ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBpZiAoY29udGFpbmVyUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJSZWN0LmhlaWdodCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRhaW5lclN0YXJ0ID0gY29udGFpbmVyUmVjdC5sZWZ0O1xuICAgICAgY29uc3QgbGFiZWxTdGFydCA9IHRpdGxlRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgIGNvbnN0IGxhYmVsV2lkdGggPSB0aGlzLmhhc0hlYWRlcigpID8gdGl0bGVFbC5vZmZzZXRXaWR0aCA6IDA7XG4gICAgICBjb25zdCBzdGFydFdpZHRoID0gbGFiZWxTdGFydCAtIGNvbnRhaW5lclN0YXJ0O1xuXG4gICAgICBjb25zdCBzdGFydEVscyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuby1jb250YWluZXItb3V0bGluZS1zdGFydCcpO1xuICAgICAgY29uc3QgZ2FwRWxzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vLWNvbnRhaW5lci1vdXRsaW5lLWdhcCcpO1xuICAgICAgZ2FwRWxzWzBdLnN0eWxlLndpZHRoID0gYCR7bGFiZWxXaWR0aH1weGA7XG4gICAgICBzdGFydEVsc1swXS5zdHlsZS53aWR0aCA9IGAke3N0YXJ0V2lkdGh9cHhgO1xuICAgICAgdGhpcy5fb3V0bGluZUdhcENhbGN1bGF0aW9uTmVlZGVkSW1tZWRpYXRlbHkgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJPYnNlcnZlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdGl0bGVFbCkge1xuICAgICAgdGhpcy50aXRsZU9ic2VydmVyLm9ic2VydmUodGhpcy5fdGl0bGVFbC5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVuUmVnaXN0ZXJPYnNlcnZlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50aXRsZU9ic2VydmVyKSB7XG4gICAgICB0aGlzLnRpdGxlT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=