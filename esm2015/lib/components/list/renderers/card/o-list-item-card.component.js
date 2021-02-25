import { Component, ElementRef, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_CARD_RENDERER, DEFAULT_OUTPUTS_O_CARD_RENDERER, OListItemCardRenderer, } from '../o-list-item-card-renderer.class';
export const DEFAULT_INPUTS_O_LIST_ITEM_CARD = [
    ...DEFAULT_INPUTS_O_CARD_RENDERER
];
export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD = [
    ...DEFAULT_OUTPUTS_O_CARD_RENDERER
];
export class OListItemCardComponent extends OListItemCardRenderer {
    constructor(elRef, _renderer, _injector, _listItem) {
        super(elRef, _renderer, _injector, _listItem);
    }
    ngAfterViewInit() {
        this.modifyMatListItemElement();
    }
}
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
OListItemCardComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OListItemComponent),] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tY2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGlzdC9yZW5kZXJlcnMvY2FyZC9vLWxpc3QtaXRlbS1jYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsOEJBQThCLEVBQzlCLCtCQUErQixFQUMvQixxQkFBcUIsR0FDdEIsTUFBTSxvQ0FBb0MsQ0FBQztBQUU1QyxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRztJQUM3QyxHQUFHLDhCQUE4QjtDQUNsQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sZ0NBQWdDLEdBQUc7SUFDOUMsR0FBRywrQkFBK0I7Q0FDbkMsQ0FBQztBQWNGLE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxxQkFBcUI7SUFFL0QsWUFDRSxLQUFpQixFQUNqQixTQUFvQixFQUNwQixTQUFtQixFQUN1QyxTQUE2QjtRQUV2RixLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNsQyxDQUFDOzs7WUF6QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLCsyQkFBZ0Q7Z0JBRWhELE1BQU0sRUFBRSwrQkFBK0I7Z0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7Z0JBQ3pDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osNEJBQTRCLEVBQUUsTUFBTTtvQkFDcEMsMEJBQTBCLEVBQUUsTUFBTTtpQkFDbkM7O2FBQ0Y7OztZQW5DQyxVQUFVO1lBS1YsU0FBUztZQUZULFFBQVE7WUFNRCxrQkFBa0IsdUJBaUN0QixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT3B0aW9uYWwsXG4gIFJlbmRlcmVyMixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPTGlzdEl0ZW1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9saXN0LWl0ZW0vby1saXN0LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fQ0FSRF9SRU5ERVJFUixcbiAgREVGQVVMVF9PVVRQVVRTX09fQ0FSRF9SRU5ERVJFUixcbiAgT0xpc3RJdGVtQ2FyZFJlbmRlcmVyLFxufSBmcm9tICcuLi9vLWxpc3QtaXRlbS1jYXJkLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTElTVF9JVEVNX0NBUkQgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ0FSRF9SRU5ERVJFUlxuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfSVRFTV9DQVJEID0gW1xuICAuLi5ERUZBVUxUX09VVFBVVFNfT19DQVJEX1JFTkRFUkVSXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtaXRlbS1jYXJkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC1pdGVtLWNhcmQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWxpc3QtaXRlbS1jYXJkLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19MSVNUX0lURU1fQ0FSRCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fTElTVF9JVEVNX0NBUkQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY3VzdG9tLWxpc3QtaXRlbV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLWxpc3QtaXRlbS1jYXJkXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0SXRlbUNhcmRDb21wb25lbnQgZXh0ZW5kcyBPTGlzdEl0ZW1DYXJkUmVuZGVyZXIgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbFJlZjogRWxlbWVudFJlZixcbiAgICBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBfaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPTGlzdEl0ZW1Db21wb25lbnQpKSBfbGlzdEl0ZW06IE9MaXN0SXRlbUNvbXBvbmVudFxuICApIHtcbiAgICBzdXBlcihlbFJlZiwgX3JlbmRlcmVyLCBfaW5qZWN0b3IsIF9saXN0SXRlbSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5tb2RpZnlNYXRMaXN0SXRlbUVsZW1lbnQoKTtcbiAgfVxuXG59XG5cbiJdfQ==