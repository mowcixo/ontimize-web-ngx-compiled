import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_TEXT_RENDERER, DEFAULT_OUTPUTS_O_TEXT_RENDERER, OListItemTextRenderer, } from '../o-list-item-text-renderer.class';
export var DEFAULT_INPUTS_O_LIST_ITEM_TEXT = tslib_1.__spread(DEFAULT_INPUTS_O_TEXT_RENDERER, [
    'iconPosition : icon-position'
]);
export var DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT = tslib_1.__spread(DEFAULT_OUTPUTS_O_TEXT_RENDERER);
var OListItemTextComponent = (function (_super) {
    tslib_1.__extends(OListItemTextComponent, _super);
    function OListItemTextComponent(elRef, _renderer, _injector, _listItem) {
        var _this = _super.call(this, elRef, _renderer, _injector, _listItem) || this;
        _this._listItem = _listItem;
        _this.ICON_POSITION_LEFT = 'left';
        _this.ICON_POSITION_RIGHT = 'right';
        _this.elRef.nativeElement.classList.add('o-list-item-text');
        return _this;
    }
    OListItemTextComponent.prototype.ngOnInit = function () {
        if (!this.iconPosition || [this.ICON_POSITION_LEFT, this.ICON_POSITION_RIGHT].indexOf(this.iconPosition.toLowerCase()) === -1) {
            this.iconPosition = this.ICON_POSITION_RIGHT;
        }
    };
    OListItemTextComponent.prototype.ngAfterViewInit = function () {
        this.modifyMatListItemElement();
    };
    Object.defineProperty(OListItemTextComponent.prototype, "iconPosition", {
        get: function () {
            return this._iconPosition;
        },
        set: function (val) {
            this._iconPosition = val;
        },
        enumerable: true,
        configurable: true
    });
    OListItemTextComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-list-item-text',
                    template: "<div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n  <mat-icon *ngIf=\"icon !== undefined && iconPosition === ICON_POSITION_LEFT\" class=\"material-icons o-list-item-icon\" (click)=\"onActionIconClick($event)\">{{\n    icon }}</mat-icon>\n  <div class=\"mat-list-text\">\n    <h3 matLine class=\"primary-text\"> {{ title }} </h3>\n    <h4 *ngIf=\"primaryText !== undefined\" matLine class=\"primary-text\">{{ primaryText }}</h4>\n    <p *ngIf=\"secondaryText !== undefined\" matLine class=\"secondary-text\">{{ secondaryText }}</p>\n  </div>\n  <mat-icon *ngIf=\"icon !== undefined && iconPosition === ICON_POSITION_RIGHT\" class=\"material-icons o-list-item-icon\" (click)=\"onActionIconClick($event)\">{{\n    icon }}\n  </mat-icon>\n</div>\n",
                    inputs: DEFAULT_INPUTS_O_LIST_ITEM_TEXT,
                    outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-custom-list-item]': 'true'
                    },
                    styles: [".mat-list.selectable[dense] .mat-list-item-content{padding-right:32px}.mat-list.selectable:not([dense]) .mat-list-item-content{padding-right:36px}"]
                }] }
    ];
    OListItemTextComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector },
        { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OListItemComponent; }),] }] }
    ]; };
    return OListItemTextComponent;
}(OListItemTextRenderer));
export { OListItemTextComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tdGV4dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGlzdC9yZW5kZXJlcnMvdGV4dC9vLWxpc3QtaXRlbS10ZXh0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBRVIsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUNMLDhCQUE4QixFQUM5QiwrQkFBK0IsRUFDL0IscUJBQXFCLEdBQ3RCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUMsTUFBTSxDQUFDLElBQU0sK0JBQStCLG9CQUN2Qyw4QkFBOEI7SUFDakMsOEJBQThCO0VBQy9CLENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSxnQ0FBZ0Msb0JBQ3hDLCtCQUErQixDQUNuQyxDQUFDO0FBRUY7SUFXNEMsa0RBQXFCO0lBTy9ELGdDQUNFLEtBQWlCLEVBQ2pCLFNBQW9CLEVBQ3BCLFNBQW1CLEVBQ2lELFNBQTZCO1FBSm5HLFlBTUUsa0JBQU0sS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBRTlDO1FBSnFFLGVBQVMsR0FBVCxTQUFTLENBQW9CO1FBVDVGLHdCQUFrQixHQUFHLE1BQU0sQ0FBQztRQUM1Qix5QkFBbUIsR0FBRyxPQUFPLENBQUM7UUFXbkMsS0FBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztJQUM3RCxDQUFDO0lBRUQseUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDN0gsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQsZ0RBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFRCxzQkFBSSxnREFBWTthQUFoQjtZQUNFLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUM1QixDQUFDO2FBRUQsVUFBaUIsR0FBVztZQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztRQUMzQixDQUFDOzs7T0FKQTs7Z0JBeENGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1Qix5dkJBQWdEO29CQUVoRCxNQUFNLEVBQUUsK0JBQStCO29CQUN2QyxPQUFPLEVBQUUsZ0NBQWdDO29CQUN6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLDRCQUE0QixFQUFFLE1BQU07cUJBQ3JDOztpQkFDRjs7O2dCQXBDQyxVQUFVO2dCQU1WLFNBQVM7Z0JBSFQsUUFBUTtnQkFPRCxrQkFBa0IsdUJBc0N0QixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsa0JBQWtCLEVBQWxCLENBQWtCLENBQUM7O0lBdUI1RCw2QkFBQztDQUFBLEFBN0NELENBVzRDLHFCQUFxQixHQWtDaEU7U0FsQ1ksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0xpc3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vbGlzdC1pdGVtL28tbGlzdC1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQge1xuICBERUZBVUxUX0lOUFVUU19PX1RFWFRfUkVOREVSRVIsXG4gIERFRkFVTFRfT1VUUFVUU19PX1RFWFRfUkVOREVSRVIsXG4gIE9MaXN0SXRlbVRleHRSZW5kZXJlcixcbn0gZnJvbSAnLi4vby1saXN0LWl0ZW0tdGV4dC1yZW5kZXJlci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0xJU1RfSVRFTV9URVhUID0gW1xuICAuLi5ERUZBVUxUX0lOUFVUU19PX1RFWFRfUkVOREVSRVIsXG4gICdpY29uUG9zaXRpb24gOiBpY29uLXBvc2l0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfSVRFTV9URVhUID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19URVhUX1JFTkRFUkVSXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtaXRlbS10ZXh0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC1pdGVtLXRleHQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWxpc3QtaXRlbS10ZXh0LmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19MSVNUX0lURU1fVEVYVCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fTElTVF9JVEVNX1RFWFQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY3VzdG9tLWxpc3QtaXRlbV0nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPTGlzdEl0ZW1UZXh0Q29tcG9uZW50IGV4dGVuZHMgT0xpc3RJdGVtVGV4dFJlbmRlcmVyIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgSUNPTl9QT1NJVElPTl9MRUZUID0gJ2xlZnQnO1xuICBwdWJsaWMgSUNPTl9QT1NJVElPTl9SSUdIVCA9ICdyaWdodCc7XG5cbiAgcHVibGljIF9pY29uUG9zaXRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPTGlzdEl0ZW1Db21wb25lbnQpKSBwcm90ZWN0ZWQgX2xpc3RJdGVtOiBPTGlzdEl0ZW1Db21wb25lbnRcbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIF9yZW5kZXJlciwgX2luamVjdG9yLCBfbGlzdEl0ZW0pO1xuICAgIHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdvLWxpc3QtaXRlbS10ZXh0Jyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaWNvblBvc2l0aW9uIHx8IFt0aGlzLklDT05fUE9TSVRJT05fTEVGVCwgdGhpcy5JQ09OX1BPU0lUSU9OX1JJR0hUXS5pbmRleE9mKHRoaXMuaWNvblBvc2l0aW9uLnRvTG93ZXJDYXNlKCkpID09PSAtMSkge1xuICAgICAgdGhpcy5pY29uUG9zaXRpb24gPSB0aGlzLklDT05fUE9TSVRJT05fUklHSFQ7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMubW9kaWZ5TWF0TGlzdEl0ZW1FbGVtZW50KCk7XG4gIH1cblxuICBnZXQgaWNvblBvc2l0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ljb25Qb3NpdGlvbjtcbiAgfVxuXG4gIHNldCBpY29uUG9zaXRpb24odmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pY29uUG9zaXRpb24gPSB2YWw7XG4gIH1cbn1cbiJdfQ==