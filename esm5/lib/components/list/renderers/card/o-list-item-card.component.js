import * as tslib_1 from "tslib";
import { Component, ElementRef, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_CARD_RENDERER, DEFAULT_OUTPUTS_O_CARD_RENDERER, OListItemCardRenderer, } from '../o-list-item-card-renderer.class';
export var DEFAULT_INPUTS_O_LIST_ITEM_CARD = tslib_1.__spread(DEFAULT_INPUTS_O_CARD_RENDERER);
export var DEFAULT_OUTPUTS_O_LIST_ITEM_CARD = tslib_1.__spread(DEFAULT_OUTPUTS_O_CARD_RENDERER);
var OListItemCardComponent = (function (_super) {
    tslib_1.__extends(OListItemCardComponent, _super);
    function OListItemCardComponent(elRef, _renderer, _injector, _listItem) {
        return _super.call(this, elRef, _renderer, _injector, _listItem) || this;
    }
    OListItemCardComponent.prototype.ngAfterViewInit = function () {
        this.modifyMatListItemElement();
    };
    OListItemCardComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-list-item-card',
                    template: "<mat-card fxLayout=\"column\" fxLayoutAlign=\"center center\">\n  <mat-card-title-group>\n    <img *ngIf=\"showImage\" src=\"{{ image }}\" [class.mat-card-sm-image]=\"compareListHeight('small')\" [class.mat-card-md-image]=\"compareListHeight('medium')\"\n      [class.mat-card-lg-image]=\"compareListHeight('large')\">\n    <mat-card-title *ngIf=\"title !== undefined\"> {{ title }}</mat-card-title>\n    <mat-card-subtitle *ngIf=\"subtitle !== undefined\"> {{ subtitle }}</mat-card-subtitle>\n  </mat-card-title-group>\n  <mat-card-actions>\n    <button type=\"button\" mat-button *ngIf=\"action1Text !== undefined\" (click)=\"onAction1ButtonClick($event)\">{{ action1Text }}</button>\n    <button type=\"button\" mat-button *ngIf=\"action2Text !== undefined\" (click)=\"onAction2ButtonClick($event)\">{{ action2Text }}</button>\n  </mat-card-actions>\n</mat-card>\n",
                    inputs: DEFAULT_INPUTS_O_LIST_ITEM_CARD,
                    outputs: DEFAULT_OUTPUTS_O_LIST_ITEM_CARD,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-custom-list-item]': 'true',
                        '[class.o-list-item-card]': 'true'
                    },
                    styles: [".mat-list .mat-list-item.o-card-item,.mat-list .mat-list-item.o-card-item .mat-list-item-content{height:auto}.o-list-item-card{padding:8px 0}.o-list-item-card mat-card,.o-list-item-card mat-card-actions,.o-list-item-card mat-card-title-group{width:100%}"]
                }] }
    ];
    OListItemCardComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector },
        { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return OListItemComponent; }),] }] }
    ]; };
    return OListItemCardComponent;
}(OListItemCardRenderer));
export { OListItemCardComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tY2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGlzdC9yZW5kZXJlcnMvY2FyZC9vLWxpc3QtaXRlbS1jYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBQ1IsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUNMLDhCQUE4QixFQUM5QiwrQkFBK0IsRUFDL0IscUJBQXFCLEdBQ3RCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUMsTUFBTSxDQUFDLElBQU0sK0JBQStCLG9CQUN2Qyw4QkFBOEIsQ0FDbEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLGdDQUFnQyxvQkFDeEMsK0JBQStCLENBQ25DLENBQUM7QUFFRjtJQVk0QyxrREFBcUI7SUFFL0QsZ0NBQ0UsS0FBaUIsRUFDakIsU0FBb0IsRUFDcEIsU0FBbUIsRUFDdUMsU0FBNkI7ZUFFdkYsa0JBQU0sS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDO0lBQy9DLENBQUM7SUFFRCxnREFBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDbEMsQ0FBQzs7Z0JBekJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QiwrMkJBQWdEO29CQUVoRCxNQUFNLEVBQUUsK0JBQStCO29CQUN2QyxPQUFPLEVBQUUsZ0NBQWdDO29CQUN6QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLDRCQUE0QixFQUFFLE1BQU07d0JBQ3BDLDBCQUEwQixFQUFFLE1BQU07cUJBQ25DOztpQkFDRjs7O2dCQW5DQyxVQUFVO2dCQUtWLFNBQVM7Z0JBRlQsUUFBUTtnQkFNRCxrQkFBa0IsdUJBaUN0QixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxjQUFNLE9BQUEsa0JBQWtCLEVBQWxCLENBQWtCLENBQUM7O0lBUzVELDZCQUFDO0NBQUEsQUEzQkQsQ0FZNEMscUJBQXFCLEdBZWhFO1NBZlksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9MaXN0SXRlbUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2xpc3QtaXRlbS9vLWxpc3QtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19DQVJEX1JFTkRFUkVSLFxuICBERUZBVUxUX09VVFBVVFNfT19DQVJEX1JFTkRFUkVSLFxuICBPTGlzdEl0ZW1DYXJkUmVuZGVyZXIsXG59IGZyb20gJy4uL28tbGlzdC1pdGVtLWNhcmQtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MSVNUX0lURU1fQ0FSRCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19DQVJEX1JFTkRFUkVSXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fTElTVF9JVEVNX0NBUkQgPSBbXG4gIC4uLkRFRkFVTFRfT1VUUFVUU19PX0NBUkRfUkVOREVSRVJcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbGlzdC1pdGVtLWNhcmQnLFxuICB0ZW1wbGF0ZVVybDogJy4vby1saXN0LWl0ZW0tY2FyZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbGlzdC1pdGVtLWNhcmQuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xJU1RfSVRFTV9DQVJELFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19MSVNUX0lURU1fQ0FSRCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jdXN0b20tbGlzdC1pdGVtXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLm8tbGlzdC1pdGVtLWNhcmRdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RJdGVtQ2FyZENvbXBvbmVudCBleHRlbmRzIE9MaXN0SXRlbUNhcmRSZW5kZXJlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9MaXN0SXRlbUNvbXBvbmVudCkpIF9saXN0SXRlbTogT0xpc3RJdGVtQ29tcG9uZW50XG4gICkge1xuICAgIHN1cGVyKGVsUmVmLCBfcmVuZGVyZXIsIF9pbmplY3RvciwgX2xpc3RJdGVtKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLm1vZGlmeU1hdExpc3RJdGVtRWxlbWVudCgpO1xuICB9XG5cbn1cblxuIl19