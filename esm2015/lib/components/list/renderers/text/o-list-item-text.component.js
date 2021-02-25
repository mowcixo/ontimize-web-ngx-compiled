import { Component, ElementRef, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_TEXT_RENDERER, DEFAULT_OUTPUTS_O_TEXT_RENDERER, OListItemTextRenderer, } from '../o-list-item-text-renderer.class';
export const DEFAULT_INPUTS_O_LIST_ITEM_TEXT = [
    ...DEFAULT_INPUTS_O_TEXT_RENDERER,
    'iconPosition : icon-position'
];
export const DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT = [
    ...DEFAULT_OUTPUTS_O_TEXT_RENDERER
];
export class OListItemTextComponent extends OListItemTextRenderer {
    constructor(elRef, _renderer, _injector, _listItem) {
        super(elRef, _renderer, _injector, _listItem);
        this._listItem = _listItem;
        this.ICON_POSITION_LEFT = 'left';
        this.ICON_POSITION_RIGHT = 'right';
        this.elRef.nativeElement.classList.add('o-list-item-text');
    }
    ngOnInit() {
        if (!this.iconPosition || [this.ICON_POSITION_LEFT, this.ICON_POSITION_RIGHT].indexOf(this.iconPosition.toLowerCase()) === -1) {
            this.iconPosition = this.ICON_POSITION_RIGHT;
        }
    }
    ngAfterViewInit() {
        this.modifyMatListItemElement();
    }
    get iconPosition() {
        return this._iconPosition;
    }
    set iconPosition(val) {
        this._iconPosition = val;
    }
}
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
OListItemTextComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OListItemComponent),] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tdGV4dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGlzdC9yZW5kZXJlcnMvdGV4dC9vLWxpc3QtaXRlbS10ZXh0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFFUixRQUFRLEVBQ1IsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMzRSxPQUFPLEVBQ0wsOEJBQThCLEVBQzlCLCtCQUErQixFQUMvQixxQkFBcUIsR0FDdEIsTUFBTSxvQ0FBb0MsQ0FBQztBQUU1QyxNQUFNLENBQUMsTUFBTSwrQkFBK0IsR0FBRztJQUM3QyxHQUFHLDhCQUE4QjtJQUNqQyw4QkFBOEI7Q0FDL0IsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHO0lBQzlDLEdBQUcsK0JBQStCO0NBQ25DLENBQUM7QUFhRixNQUFNLE9BQU8sc0JBQXVCLFNBQVEscUJBQXFCO0lBTy9ELFlBQ0UsS0FBaUIsRUFDakIsU0FBb0IsRUFDcEIsU0FBbUIsRUFDaUQsU0FBNkI7UUFFakcsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRnNCLGNBQVMsR0FBVCxTQUFTLENBQW9CO1FBVDVGLHVCQUFrQixHQUFHLE1BQU0sQ0FBQztRQUM1Qix3QkFBbUIsR0FBRyxPQUFPLENBQUM7UUFXbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM3SCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM1QixDQUFDO0lBRUQsSUFBSSxZQUFZLENBQUMsR0FBVztRQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUMzQixDQUFDOzs7WUE1Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLHl2QkFBZ0Q7Z0JBRWhELE1BQU0sRUFBRSwrQkFBK0I7Z0JBQ3ZDLE9BQU8sRUFBRSxnQ0FBZ0M7Z0JBQ3pDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osNEJBQTRCLEVBQUUsTUFBTTtpQkFDckM7O2FBQ0Y7OztZQXBDQyxVQUFVO1lBTVYsU0FBUztZQUhULFFBQVE7WUFPRCxrQkFBa0IsdUJBc0N0QixRQUFRLFlBQUksTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9MaXN0SXRlbUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL2xpc3QtaXRlbS9vLWxpc3QtaXRlbS5jb21wb25lbnQnO1xuaW1wb3J0IHtcbiAgREVGQVVMVF9JTlBVVFNfT19URVhUX1JFTkRFUkVSLFxuICBERUZBVUxUX09VVFBVVFNfT19URVhUX1JFTkRFUkVSLFxuICBPTGlzdEl0ZW1UZXh0UmVuZGVyZXIsXG59IGZyb20gJy4uL28tbGlzdC1pdGVtLXRleHQtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19MSVNUX0lURU1fVEVYVCA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19URVhUX1JFTkRFUkVSLFxuICAnaWNvblBvc2l0aW9uIDogaWNvbi1wb3NpdGlvbidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19MSVNUX0lURU1fVEVYVCA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fVEVYVF9SRU5ERVJFUlxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1saXN0LWl0ZW0tdGV4dCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxpc3QtaXRlbS10ZXh0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1saXN0LWl0ZW0tdGV4dC5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTElTVF9JVEVNX1RFWFQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0xJU1RfSVRFTV9URVhULFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWN1c3RvbS1saXN0LWl0ZW1dJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RJdGVtVGV4dENvbXBvbmVudCBleHRlbmRzIE9MaXN0SXRlbVRleHRSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgcHVibGljIElDT05fUE9TSVRJT05fTEVGVCA9ICdsZWZ0JztcbiAgcHVibGljIElDT05fUE9TSVRJT05fUklHSFQgPSAncmlnaHQnO1xuXG4gIHB1YmxpYyBfaWNvblBvc2l0aW9uOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0xpc3RJdGVtQ29tcG9uZW50KSkgcHJvdGVjdGVkIF9saXN0SXRlbTogT0xpc3RJdGVtQ29tcG9uZW50XG4gICkge1xuICAgIHN1cGVyKGVsUmVmLCBfcmVuZGVyZXIsIF9pbmplY3RvciwgX2xpc3RJdGVtKTtcbiAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnby1saXN0LWl0ZW0tdGV4dCcpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmljb25Qb3NpdGlvbiB8fCBbdGhpcy5JQ09OX1BPU0lUSU9OX0xFRlQsIHRoaXMuSUNPTl9QT1NJVElPTl9SSUdIVF0uaW5kZXhPZih0aGlzLmljb25Qb3NpdGlvbi50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMuaWNvblBvc2l0aW9uID0gdGhpcy5JQ09OX1BPU0lUSU9OX1JJR0hUO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLm1vZGlmeU1hdExpc3RJdGVtRWxlbWVudCgpO1xuICB9XG5cbiAgZ2V0IGljb25Qb3NpdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pY29uUG9zaXRpb247XG4gIH1cblxuICBzZXQgaWNvblBvc2l0aW9uKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5faWNvblBvc2l0aW9uID0gdmFsO1xuICB9XG59XG4iXX0=