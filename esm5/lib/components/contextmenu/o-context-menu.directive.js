import { Directive, HostListener, Injector } from '@angular/core';
import { OContextMenuService } from './o-context-menu.service';
export var DEFAULT_CONTEXT_MENU_DIRECTIVE_INPUTS = [
    'oContextMenu',
    'oContextMenuData'
];
var OContextMenuDirective = (function () {
    function OContextMenuDirective(injector) {
        this.injector = injector;
        this.oContextMenuService = this.injector.get(OContextMenuService);
    }
    OContextMenuDirective.prototype.onRightClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.oContextMenuService.showContextMenu.next({
            contextMenu: this.oContextMenu,
            event: event,
            data: this.oContextMenuData
        });
    };
    OContextMenuDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oContextMenu]',
                    inputs: DEFAULT_CONTEXT_MENU_DIRECTIVE_INPUTS
                },] }
    ];
    OContextMenuDirective.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OContextMenuDirective.propDecorators = {
        onRightClick: [{ type: HostListener, args: ['contextmenu', ['$event'],] }]
    };
    return OContextMenuDirective;
}());
export { OContextMenuDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRleHRtZW51L28tY29udGV4dC1tZW51LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHbEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFL0QsTUFBTSxDQUFDLElBQU0scUNBQXFDLEdBQUc7SUFDbkQsY0FBYztJQUNkLGtCQUFrQjtDQUNuQixDQUFDO0FBRUY7SUFXRSwrQkFDWSxRQUFrQjtRQUFsQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRTVCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFHTSw0Q0FBWSxHQURuQixVQUNvQixLQUFpQjtRQUNuQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO1lBQzVDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUM5QixLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCO1NBQzVCLENBQUMsQ0FBQztJQUNMLENBQUM7O2dCQTFCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtvQkFDMUIsTUFBTSxFQUFFLHFDQUFxQztpQkFDOUM7OztnQkFiaUMsUUFBUTs7OytCQTJCdkMsWUFBWSxTQUFDLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7SUFXekMsNEJBQUM7Q0FBQSxBQTVCRCxJQTRCQztTQXhCWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEhvc3RMaXN0ZW5lciwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT0NvbnRleHRNZW51Q29tcG9uZW50IH0gZnJvbSAnLi9vLWNvbnRleHQtbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0NvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4vby1jb250ZXh0LW1lbnUuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0NPTlRFWFRfTUVOVV9ESVJFQ1RJVkVfSU5QVVRTID0gW1xuICAnb0NvbnRleHRNZW51JyxcbiAgJ29Db250ZXh0TWVudURhdGEnXG5dO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbb0NvbnRleHRNZW51XScsXG4gIGlucHV0czogREVGQVVMVF9DT05URVhUX01FTlVfRElSRUNUSVZFX0lOUFVUU1xufSlcbmV4cG9ydCBjbGFzcyBPQ29udGV4dE1lbnVEaXJlY3RpdmUge1xuXG4gIHB1YmxpYyBvQ29udGV4dE1lbnU6IE9Db250ZXh0TWVudUNvbXBvbmVudDtcbiAgcHVibGljIG9Db250ZXh0TWVudURhdGE6IGFueTtcblxuICBwcm90ZWN0ZWQgb0NvbnRleHRNZW51U2VydmljZTogT0NvbnRleHRNZW51U2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMub0NvbnRleHRNZW51U2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9Db250ZXh0TWVudVNlcnZpY2UpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY29udGV4dG1lbnUnLCBbJyRldmVudCddKVxuICBwdWJsaWMgb25SaWdodENsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLm9Db250ZXh0TWVudVNlcnZpY2Uuc2hvd0NvbnRleHRNZW51Lm5leHQoe1xuICAgICAgY29udGV4dE1lbnU6IHRoaXMub0NvbnRleHRNZW51LFxuICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgZGF0YTogdGhpcy5vQ29udGV4dE1lbnVEYXRhXG4gICAgfSk7XG4gIH1cblxufVxuIl19