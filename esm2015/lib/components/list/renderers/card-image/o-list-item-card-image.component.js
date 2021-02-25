import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, Optional, Renderer2, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../../decorators/input-converter';
import { Util } from '../../../../util/util';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { DEFAULT_INPUTS_O_CARD_RENDERER, DEFAULT_OUTPUTS_O_CARD_RENDERER, OListItemCardRenderer, } from '../o-list-item-card-renderer.class';
export const DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE = [
    ...DEFAULT_INPUTS_O_CARD_RENDERER,
    'avatar'
];
export const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE = [
    ...DEFAULT_OUTPUTS_O_CARD_RENDERER
];
export class OListItemCardImageComponent extends OListItemCardRenderer {
    constructor(elRef, _renderer, _injector, _listItem) {
        super(elRef, _renderer, _injector, _listItem);
        this._collapsible = false;
        this._collapsed = true;
        this.onIconClick = new EventEmitter();
    }
    ngAfterViewInit() {
        this.modifyMatListItemElement();
    }
    onActionIconClick(e) {
        if (Util.isDefined(e)) {
            e.stopPropagation();
        }
        this.onIconClick.emit(e);
    }
    get content() {
        return this._content;
    }
    set content(val) {
        this._content = val;
    }
    get avatar() {
        return this._avatar;
    }
    set avatar(val) {
        this._avatar = val;
    }
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
    }
    get collapsible() {
        return this._collapsible;
    }
    set collapsible(val) {
        this._collapsible = val;
    }
    get collapsed() {
        return this._collapsed;
    }
    set collapsed(val) {
        this._collapsed = val;
    }
}
OListItemCardImageComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-list-item-card-image',
                template: "<mat-card fxLayout=\"column\" fxLayoutAlign=\"center center\" class=\"o-item-card\" [class.small]=\"compareListHeight('small')\"\n  [class.medium]=\"compareListHeight('medium')\" [class.large]=\"compareListHeight('large')\">\n\n  <mat-card-header *ngIf=\"avatar !== undefined\">\n    <img matCardAvatar src=\"{{ avatar }}\">\n    <mat-card-title *ngIf=\"title !== undefined\"> {{ title }}</mat-card-title>\n    <mat-card-subtitle *ngIf=\"subtitle !== undefined\"> {{ subtitle }}</mat-card-subtitle>\n  </mat-card-header>\n\n  <img *ngIf=\"image !== undefined\" matCardImage src=\"{{ image }}\" [class.exists-action-button]=\"icon !== undefined\">\n\n  <button type=\"button\" *ngIf=\"icon !== undefined && compareListHeight('small')\" mat-mini-fab (click)=\"onActionIconClick($event)\" class=\"action-button\">\n    <mat-icon>{{ icon }}</mat-icon>\n  </button>\n\n  <button type=\"button\" *ngIf=\"icon !== undefined && (compareListHeight('medium') || compareListHeight('large'))\" mat-fab (click)=\"onActionIconClick($event)\"\n    class=\"action-button\">\n    <mat-icon>{{ icon }}</mat-icon>\n  </button>\n\n  <mat-card-title *ngIf=\"avatar === undefined && title !== undefined\"> {{ title }}</mat-card-title>\n  <mat-card-subtitle *ngIf=\"avatar === undefined && subtitle !== undefined\"> {{ subtitle }}</mat-card-subtitle>\n\n  <mat-card-content *ngIf=\"!collapsible\">\n    <p>\n      {{ content }}\n    </p>\n  </mat-card-content>\n\n  <mat-card-actions>\n    <button type=\"button\" mat-button *ngIf=\"action1Text !== undefined\" (click)=\"onAction1ButtonClick($event)\">{{ action1Text }}</button>\n    <button type=\"button\" mat-button *ngIf=\"action2Text !== undefined\" (click)=\"onAction2ButtonClick($event)\">{{ action2Text }}</button>\n\n    <div class=\"collapse-button-container\">\n      <button type=\"button\" mat-icon-button *ngIf=\"collapsible\" (click)=\"collapsed = !collapsed\" class=\"collapse-button\">\n        <mat-icon *ngIf=\"collapsed\" svgIcon=\"ontimize:keyboard_arrow_down\"></mat-icon>\n        <mat-icon *ngIf=\"!collapsed\" svgIcon=\"ontimize:keyboard_arrow_up\"></mat-icon>\n      </button>\n    </div>\n  </mat-card-actions>\n\n  <mat-card-content *ngIf=\"collapsible && !collapsed\">\n    <p>\n      {{ content }}\n    </p>\n  </mat-card-content>\n\n</mat-card>",
                inputs: [
                    ...DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE,
                    'content',
                    'avatar',
                    'icon',
                    'collapsible',
                    'collapsed'
                ],
                outputs: [
                    ...DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE,
                    'onIconClick : icon-action'
                ],
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-custom-list-item]': 'true',
                    '[class.o-list-item-card-image]': 'true'
                },
                styles: [".mat-list .mat-list-item.o-card-item,.mat-list .mat-list-item.o-card-item .mat-list-item-content{height:auto}.o-list-item-card-image{padding:8px 0}.o-list-item-card-image .mat-card mat-card-actions,.o-list-item-card-image .mat-card mat-card-header,.o-list-item-card-image .mat-card mat-card-subtitle,.o-list-item-card-image .mat-card mat-card-title,.o-list-item-card-image .mat-card.large{width:100%}.o-list-item-card-image .mat-card.medium{width:80%;margin-left:auto;margin-right:auto}.o-list-item-card-image .mat-card.small{width:60%;margin-left:auto;margin-right:auto}.o-list-item-card-image .mat-card.small img.exists-action-button{margin-bottom:-20px}.o-list-item-card-image .mat-card:not(.small):not(.medium):not(.large){width:100%}.o-list-item-card-image .mat-card .action-button{margin-left:auto}.o-list-item-card-image .mat-card img.exists-action-button{margin-bottom:-28px}.o-list-item-card-image .mat-card .collapse-button-container{flex:1 1 auto;position:relative}.o-list-item-card-image .mat-card .collapse-button-container .collapse-button{margin-left:calc(100% - 40px)}"]
            }] }
];
OListItemCardImageComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: OListItemComponent, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => OListItemComponent),] }] }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OListItemCardImageComponent.prototype, "_collapsible", void 0);
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OListItemCardImageComponent.prototype, "_collapsed", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LWl0ZW0tY2FyZC1pbWFnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvbGlzdC9yZW5kZXJlcnMvY2FyZC1pbWFnZS9vLWxpc3QtaXRlbS1jYXJkLWltYWdlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLFFBQVEsRUFDUixTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQUN4RSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDM0UsT0FBTyxFQUNMLDhCQUE4QixFQUM5QiwrQkFBK0IsRUFDL0IscUJBQXFCLEdBQ3RCLE1BQU0sb0NBQW9DLENBQUM7QUFFNUMsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQUc7SUFDbkQsR0FBRyw4QkFBOEI7SUFDakMsUUFBUTtDQUNULENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxzQ0FBc0MsR0FBRztJQUNwRCxHQUFHLCtCQUErQjtDQUNuQyxDQUFDO0FBd0JGLE1BQU0sT0FBTywyQkFBNEIsU0FBUSxxQkFBcUI7SUFZcEUsWUFDRSxLQUFpQixFQUNqQixTQUFvQixFQUNwQixTQUFtQixFQUN1QyxTQUE2QjtRQUV2RixLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFadEMsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFFOUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUVyQyxnQkFBVyxHQUF5QixJQUFJLFlBQVksRUFBVSxDQUFDO0lBUy9ELENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELGlCQUFpQixDQUFDLENBQVM7UUFDekIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUNyQjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTyxDQUFDLEdBQVc7UUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsR0FBVztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLElBQUksQ0FBQyxHQUFXO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksV0FBVyxDQUFDLEdBQVk7UUFDMUIsSUFBSSxDQUFDLFlBQVksR0FBRyxHQUFHLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxTQUFTLENBQUMsR0FBWTtRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUN4QixDQUFDOzs7WUE1RkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLDB3RUFBc0Q7Z0JBRXRELE1BQU0sRUFBRTtvQkFDTixHQUFHLHFDQUFxQztvQkFDeEMsU0FBUztvQkFDVCxRQUFRO29CQUNSLE1BQU07b0JBQ04sYUFBYTtvQkFDYixXQUFXO2lCQUNaO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxHQUFHLHNDQUFzQztvQkFDekMsMkJBQTJCO2lCQUM1QjtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLDRCQUE0QixFQUFFLE1BQU07b0JBQ3BDLGdDQUFnQyxFQUFFLE1BQU07aUJBQ3pDOzthQUNGOzs7WUFqREMsVUFBVTtZQU1WLFNBQVM7WUFGVCxRQUFRO1lBUUQsa0JBQWtCLHVCQXNEdEIsUUFBUSxZQUFJLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7O0FBVjFEO0lBREMsY0FBYyxFQUFFOztpRUFDdUI7QUFFeEM7SUFEQyxjQUFjLEVBQUU7OytEQUNvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPTGlzdEl0ZW1Db21wb25lbnQgfSBmcm9tICcuLi8uLi9saXN0LWl0ZW0vby1saXN0LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7XG4gIERFRkFVTFRfSU5QVVRTX09fQ0FSRF9SRU5ERVJFUixcbiAgREVGQVVMVF9PVVRQVVRTX09fQ0FSRF9SRU5ERVJFUixcbiAgT0xpc3RJdGVtQ2FyZFJlbmRlcmVyLFxufSBmcm9tICcuLi9vLWxpc3QtaXRlbS1jYXJkLXJlbmRlcmVyLmNsYXNzJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTElTVF9JVEVNX0NBUkRfSU1BR0UgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ0FSRF9SRU5ERVJFUixcbiAgJ2F2YXRhcidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19MSVNUX0lURU1fQ0FSRF9JTUFHRSA9IFtcbiAgLi4uREVGQVVMVF9PVVRQVVRTX09fQ0FSRF9SRU5ERVJFUlxuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1saXN0LWl0ZW0tY2FyZC1pbWFnZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxpc3QtaXRlbS1jYXJkLWltYWdlLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1saXN0LWl0ZW0tY2FyZC1pbWFnZS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IFtcbiAgICAuLi5ERUZBVUxUX0lOUFVUU19PX0xJU1RfSVRFTV9DQVJEX0lNQUdFLFxuICAgICdjb250ZW50JyxcbiAgICAnYXZhdGFyJyxcbiAgICAnaWNvbicsXG4gICAgJ2NvbGxhcHNpYmxlJyxcbiAgICAnY29sbGFwc2VkJ1xuICBdLFxuICBvdXRwdXRzOiBbXG4gICAgLi4uREVGQVVMVF9PVVRQVVRTX09fTElTVF9JVEVNX0NBUkRfSU1BR0UsXG4gICAgJ29uSWNvbkNsaWNrIDogaWNvbi1hY3Rpb24nXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY3VzdG9tLWxpc3QtaXRlbV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5vLWxpc3QtaXRlbS1jYXJkLWltYWdlXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0SXRlbUNhcmRJbWFnZUNvbXBvbmVudCBleHRlbmRzIE9MaXN0SXRlbUNhcmRSZW5kZXJlciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIHByb3RlY3RlZCBfY29udGVudDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2F2YXRhcjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2ljb246IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHJvdGVjdGVkIF9jb2xsYXBzaWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwcm90ZWN0ZWQgX2NvbGxhcHNlZDogYm9vbGVhbiA9IHRydWU7XG5cbiAgb25JY29uQ2xpY2s6IEV2ZW50RW1pdHRlcjxvYmplY3Q+ID0gbmV3IEV2ZW50RW1pdHRlcjxvYmplY3Q+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0xpc3RJdGVtQ29tcG9uZW50KSkgX2xpc3RJdGVtOiBPTGlzdEl0ZW1Db21wb25lbnRcbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIF9yZW5kZXJlciwgX2luamVjdG9yLCBfbGlzdEl0ZW0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMubW9kaWZ5TWF0TGlzdEl0ZW1FbGVtZW50KCk7XG4gIH1cblxuICBvbkFjdGlvbkljb25DbGljayhlPzogRXZlbnQpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZSkpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICAgIHRoaXMub25JY29uQ2xpY2suZW1pdChlKTtcbiAgfVxuXG4gIGdldCBjb250ZW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cblxuICBzZXQgY29udGVudCh2YWw6IHN0cmluZykge1xuICAgIHRoaXMuX2NvbnRlbnQgPSB2YWw7XG4gIH1cblxuICBnZXQgYXZhdGFyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2F2YXRhcjtcbiAgfVxuXG4gIHNldCBhdmF0YXIodmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9hdmF0YXIgPSB2YWw7XG4gIH1cblxuICBnZXQgaWNvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pY29uO1xuICB9XG5cbiAgc2V0IGljb24odmFsOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9pY29uID0gdmFsO1xuICB9XG5cbiAgZ2V0IGNvbGxhcHNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9jb2xsYXBzaWJsZTtcbiAgfVxuXG4gIHNldCBjb2xsYXBzaWJsZSh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jb2xsYXBzaWJsZSA9IHZhbDtcbiAgfVxuXG4gIGdldCBjb2xsYXBzZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbGxhcHNlZDtcbiAgfVxuXG4gIHNldCBjb2xsYXBzZWQodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY29sbGFwc2VkID0gdmFsO1xuICB9XG5cbn1cblxuIl19