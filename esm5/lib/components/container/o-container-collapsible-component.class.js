import * as tslib_1 from "tslib";
import { ElementRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatExpansionPanel } from '@angular/material';
import { InputConverter } from '../../decorators/input-converter';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from './o-container-component.class';
export var DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE = tslib_1.__spread(DEFAULT_INPUTS_O_CONTAINER, [
    'expanded',
    'description',
    'collapsedHeight:collapsed-height',
    'expandedHeight:expanded-height'
]);
var OContainerCollapsibleComponent = (function (_super) {
    tslib_1.__extends(OContainerCollapsibleComponent, _super);
    function OContainerCollapsibleComponent(elRef, injector, matFormDefaultOption) {
        var _this = _super.call(this, elRef, injector, matFormDefaultOption) || this;
        _this.elRef = elRef;
        _this.injector = injector;
        _this.matFormDefaultOption = matFormDefaultOption;
        _this.expanded = true;
        _this.collapsedHeight = '37px';
        _this.expandedHeight = '37px';
        _this.contentObserver = new MutationObserver(function () { return _this.updateHeightExpansionPanelContent(); });
        return _this;
    }
    OContainerCollapsibleComponent.prototype.ngAfterViewInit = function () {
        if (this.expPanel) {
            this._containerCollapsibleRef = this.expPanel._body;
            this.registerContentObserver();
        }
        else {
            this.unregisterContentObserver();
        }
    };
    OContainerCollapsibleComponent.prototype.updateOutlineGap = function () {
        if (this.isAppearanceOutline()) {
            var exPanelHeader = this._titleEl ? this._titleEl._element.nativeElement : null;
            if (!this._containerRef) {
                return;
            }
            var containerOutline = this._containerRef.nativeElement;
            var containerOutlineRect = containerOutline.getBoundingClientRect();
            if (containerOutlineRect.width === 0 && containerOutlineRect.height === 0) {
                return;
            }
            var titleEl = exPanelHeader.querySelector('.o-container-title.mat-expansion-panel-header-title');
            var descrEl = exPanelHeader.querySelector('.mat-expansion-panel-header-description');
            var containerStart = containerOutlineRect.left;
            var descrStart = descrEl.getBoundingClientRect().left;
            var titleWidth = 0;
            if (this.hasHeader()) {
                titleWidth += this.icon ? titleEl.querySelector('mat-icon').offsetWidth : 0;
                titleWidth += this.title ? titleEl.querySelector('span').offsetWidth : 0;
                titleWidth = titleWidth === 0 ? 0 : titleWidth + 4;
            }
            var descrWidth = this.description ? descrEl.querySelector('span').offsetWidth + 8 : 0;
            var empty1Width = descrStart - containerStart - 14 - titleWidth - 4;
            var gapTitleEls = containerOutline.querySelectorAll('.o-container-outline-gap-title');
            var gapEmpty1Els = containerOutline.querySelectorAll('.o-container-outline-gap-empty1');
            var gapDescrEls = containerOutline.querySelectorAll('.o-container-outline-gap-description');
            gapTitleEls[0].style.width = titleWidth + "px";
            gapEmpty1Els[0].style.width = empty1Width + "px";
            gapDescrEls[0].style.width = descrWidth + "px";
        }
    };
    OContainerCollapsibleComponent.prototype.registerObserver = function () {
        if (this._titleEl) {
            this.titleObserver.observe(this._titleEl._element.nativeElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    };
    OContainerCollapsibleComponent.prototype.updateHeightExpansionPanelContent = function () {
        var exPanelHeader = this._titleEl ? this._titleEl._element.nativeElement : null;
        var exPanelContent = this._containerCollapsibleRef ? this._containerCollapsibleRef.nativeElement.querySelector('.o-container-scroll') : null;
        var parentHeight = exPanelHeader.parentNode ? exPanelHeader.parentNode.offsetHeight : null;
        var height = (OContainerComponent.APPEARANCE_OUTLINE === this.appearance) ? parentHeight : (parentHeight - exPanelHeader.offsetHeight);
        if (height > 0) {
            exPanelContent.style.height = height + 'px';
        }
    };
    OContainerCollapsibleComponent.prototype.unregisterContentObserver = function () {
        if (this.contentObserver) {
            this.contentObserver.disconnect();
        }
    };
    OContainerCollapsibleComponent.prototype.registerContentObserver = function () {
        if (this._containerCollapsibleRef) {
            this.contentObserver.observe(this._containerCollapsibleRef.nativeElement, {
                childList: true,
                attributes: true,
                attributeFilter: ['style']
            });
        }
    };
    OContainerCollapsibleComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
    ]; };
    OContainerCollapsibleComponent.propDecorators = {
        expPanel: [{ type: ViewChild, args: ['expPanel', { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OContainerCollapsibleComponent.prototype, "expanded", void 0);
    return OContainerCollapsibleComponent;
}(OContainerComponent));
export { OContainerCollapsibleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250YWluZXItY29sbGFwc2libGUtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9vLWNvbnRhaW5lci1jb2xsYXBzaWJsZS1jb21wb25lbnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV0RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFaEcsTUFBTSxDQUFDLElBQU0sc0NBQXNDLG9CQUM5QywwQkFBMEI7SUFDN0IsVUFBVTtJQUNWLGFBQWE7SUFDYixrQ0FBa0M7SUFDbEMsZ0NBQWdDO0VBQ2pDLENBQUM7QUFFRjtJQUFvRCwwREFBbUI7SUFhckUsd0NBQ1ksS0FBaUIsRUFDakIsUUFBa0IsRUFDa0Msb0JBQW9CO1FBSHBGLFlBS0Usa0JBQU0sS0FBSyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxTQUM3QztRQUxXLFdBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQUNrQywwQkFBb0IsR0FBcEIsb0JBQW9CLENBQUE7UUFiN0UsY0FBUSxHQUFZLElBQUksQ0FBQztRQUN6QixxQkFBZSxHQUFHLE1BQU0sQ0FBQztRQUN6QixvQkFBYyxHQUFHLE1BQU0sQ0FBQztRQUdyQixxQkFBZSxHQUFHLElBQUksZ0JBQWdCLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxpQ0FBaUMsRUFBRSxFQUF4QyxDQUF3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ZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRVMsZ0VBQXVCLEdBQWpDO1FBQ0UsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7WUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsRUFBRTtnQkFDeEUsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLGVBQWUsRUFBRSxDQUFDLE9BQU8sQ0FBQzthQUMzQixDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7O2dCQXJIcUIsVUFBVTtnQkFBVSxRQUFRO2dEQThCL0MsUUFBUSxZQUFJLE1BQU0sU0FBQyw4QkFBOEI7OzsyQkFQbkQsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBTnhDO1FBREMsY0FBYyxFQUFFOztvRUFDZTtJQXNHbEMscUNBQUM7Q0FBQSxBQXpHRCxDQUFvRCxtQkFBbUIsR0F5R3RFO1NBekdZLDhCQUE4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIEVsZW1lbnRSZWYsIEluamVjdCwgSW5qZWN0b3IsIE9wdGlvbmFsLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9GT1JNX0ZJRUxEX0RFRkFVTFRfT1BUSU9OUywgTWF0RXhwYW5zaW9uUGFuZWwgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVIsIE9Db250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL28tY29udGFpbmVyLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0NPTlRBSU5FUl9DT0xMQVBTSUJMRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVIsXG4gICdleHBhbmRlZCcsXG4gICdkZXNjcmlwdGlvbicsXG4gICdjb2xsYXBzZWRIZWlnaHQ6Y29sbGFwc2VkLWhlaWdodCcsXG4gICdleHBhbmRlZEhlaWdodDpleHBhbmRlZC1oZWlnaHQnXG5dO1xuXG5leHBvcnQgY2xhc3MgT0NvbnRhaW5lckNvbGxhcHNpYmxlQ29tcG9uZW50IGV4dGVuZHMgT0NvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBleHBhbmRlZDogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBjb2xsYXBzZWRIZWlnaHQgPSAnMzdweCc7XG4gIHB1YmxpYyBleHBhbmRlZEhlaWdodCA9ICczN3B4JztcbiAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGNvbnRlbnRPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHRoaXMudXBkYXRlSGVpZ2h0RXhwYW5zaW9uUGFuZWxDb250ZW50KCkpO1xuICBAVmlld0NoaWxkKCdleHBQYW5lbCcsIHsgc3RhdGljOiBmYWxzZSB9KSBleHBQYW5lbDogTWF0RXhwYW5zaW9uUGFuZWw7XG4gIHByb3RlY3RlZCBfY29udGFpbmVyQ29sbGFwc2libGVSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMpIHByb3RlY3RlZCBtYXRGb3JtRGVmYXVsdE9wdGlvblxuICApIHtcbiAgICBzdXBlcihlbFJlZiwgaW5qZWN0b3IsIG1hdEZvcm1EZWZhdWx0T3B0aW9uKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5leHBQYW5lbCkge1xuICAgICAgdGhpcy5fY29udGFpbmVyQ29sbGFwc2libGVSZWYgPSB0aGlzLmV4cFBhbmVsLl9ib2R5O1xuICAgICAgdGhpcy5yZWdpc3RlckNvbnRlbnRPYnNlcnZlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVucmVnaXN0ZXJDb250ZW50T2JzZXJ2ZXIoKTtcbiAgICB9XG4gIH1cbiAgcHJvdGVjdGVkIHVwZGF0ZU91dGxpbmVHYXAoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNBcHBlYXJhbmNlT3V0bGluZSgpKSB7XG4gICAgICBjb25zdCBleFBhbmVsSGVhZGVyID0gdGhpcy5fdGl0bGVFbCA/ICh0aGlzLl90aXRsZUVsIGFzIGFueSkuX2VsZW1lbnQubmF0aXZlRWxlbWVudCA6IG51bGw7XG5cbiAgICAgIGlmICghdGhpcy5fY29udGFpbmVyUmVmKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbnRhaW5lck91dGxpbmUgPSB0aGlzLl9jb250YWluZXJSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGNvbnRhaW5lck91dGxpbmVSZWN0ID0gY29udGFpbmVyT3V0bGluZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGlmIChjb250YWluZXJPdXRsaW5lUmVjdC53aWR0aCA9PT0gMCAmJiBjb250YWluZXJPdXRsaW5lUmVjdC5oZWlnaHQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0aXRsZUVsID0gZXhQYW5lbEhlYWRlci5xdWVyeVNlbGVjdG9yKCcuby1jb250YWluZXItdGl0bGUubWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItdGl0bGUnKTtcbiAgICAgIGNvbnN0IGRlc2NyRWwgPSBleFBhbmVsSGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy5tYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbicpO1xuXG4gICAgICBjb25zdCBjb250YWluZXJTdGFydCA9IGNvbnRhaW5lck91dGxpbmVSZWN0LmxlZnQ7XG4gICAgICBjb25zdCBkZXNjclN0YXJ0ID0gZGVzY3JFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuXG4gICAgICBsZXQgdGl0bGVXaWR0aCA9IDA7XG4gICAgICBpZiAodGhpcy5oYXNIZWFkZXIoKSkge1xuICAgICAgICB0aXRsZVdpZHRoICs9IHRoaXMuaWNvbiA/IHRpdGxlRWwucXVlcnlTZWxlY3RvcignbWF0LWljb24nKS5vZmZzZXRXaWR0aCA6IDA7IC8vIGljb25cbiAgICAgICAgdGl0bGVXaWR0aCArPSB0aGlzLnRpdGxlID8gdGl0bGVFbC5xdWVyeVNlbGVjdG9yKCdzcGFuJykub2Zmc2V0V2lkdGggOiAwOyAvLyB0aXRsZVxuICAgICAgICB0aXRsZVdpZHRoID0gdGl0bGVXaWR0aCA9PT0gMCA/IDAgOiB0aXRsZVdpZHRoICsgNDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVzY3JXaWR0aCA9IHRoaXMuZGVzY3JpcHRpb24gPyBkZXNjckVsLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5vZmZzZXRXaWR0aCArIDggOiAwO1xuICAgICAgY29uc3QgZW1wdHkxV2lkdGggPSBkZXNjclN0YXJ0IC0gY29udGFpbmVyU3RhcnQgLSAxNCAtIHRpdGxlV2lkdGggLSA0O1xuXG4gICAgICBjb25zdCBnYXBUaXRsZUVscyA9IGNvbnRhaW5lck91dGxpbmUucXVlcnlTZWxlY3RvckFsbCgnLm8tY29udGFpbmVyLW91dGxpbmUtZ2FwLXRpdGxlJyk7XG4gICAgICBjb25zdCBnYXBFbXB0eTFFbHMgPSBjb250YWluZXJPdXRsaW5lLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vLWNvbnRhaW5lci1vdXRsaW5lLWdhcC1lbXB0eTEnKTtcbiAgICAgIGNvbnN0IGdhcERlc2NyRWxzID0gY29udGFpbmVyT3V0bGluZS5xdWVyeVNlbGVjdG9yQWxsKCcuby1jb250YWluZXItb3V0bGluZS1nYXAtZGVzY3JpcHRpb24nKTtcblxuICAgICAgZ2FwVGl0bGVFbHNbMF0uc3R5bGUud2lkdGggPSBgJHt0aXRsZVdpZHRofXB4YDtcbiAgICAgIGdhcEVtcHR5MUVsc1swXS5zdHlsZS53aWR0aCA9IGAke2VtcHR5MVdpZHRofXB4YDtcbiAgICAgIGdhcERlc2NyRWxzWzBdLnN0eWxlLndpZHRoID0gYCR7ZGVzY3JXaWR0aH1weGA7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHJlZ2lzdGVyT2JzZXJ2ZXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3RpdGxlRWwpIHtcbiAgICAgIHRoaXMudGl0bGVPYnNlcnZlci5vYnNlcnZlKCh0aGlzLl90aXRsZUVsIGFzIGFueSkuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVIZWlnaHRFeHBhbnNpb25QYW5lbENvbnRlbnQoKTogdm9pZCB7XG4gICAgY29uc3QgZXhQYW5lbEhlYWRlciA9IHRoaXMuX3RpdGxlRWwgPyAodGhpcy5fdGl0bGVFbCBhcyBhbnkpLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuICAgIGNvbnN0IGV4UGFuZWxDb250ZW50OiBIVE1MRWxlbWVudCA9IHRoaXMuX2NvbnRhaW5lckNvbGxhcHNpYmxlUmVmID8gdGhpcy5fY29udGFpbmVyQ29sbGFwc2libGVSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuby1jb250YWluZXItc2Nyb2xsJykgOiBudWxsO1xuICAgIGNvbnN0IHBhcmVudEhlaWdodCA9IGV4UGFuZWxIZWFkZXIucGFyZW50Tm9kZSA/IGV4UGFuZWxIZWFkZXIucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQgOiBudWxsO1xuXG4gICAgY29uc3QgaGVpZ2h0ID0gKE9Db250YWluZXJDb21wb25lbnQuQVBQRUFSQU5DRV9PVVRMSU5FID09PSB0aGlzLmFwcGVhcmFuY2UpID8gcGFyZW50SGVpZ2h0IDogKHBhcmVudEhlaWdodCAtIGV4UGFuZWxIZWFkZXIub2Zmc2V0SGVpZ2h0KTtcbiAgICBpZiAoaGVpZ2h0ID4gMCkge1xuICAgICAgZXhQYW5lbENvbnRlbnQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5yZWdpc3RlckNvbnRlbnRPYnNlcnZlcigpOiBhbnkge1xuICAgIGlmICh0aGlzLmNvbnRlbnRPYnNlcnZlcikge1xuICAgICAgdGhpcy5jb250ZW50T2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3RlckNvbnRlbnRPYnNlcnZlcigpOiBhbnkge1xuICAgIGlmICh0aGlzLl9jb250YWluZXJDb2xsYXBzaWJsZVJlZikge1xuICAgICAgdGhpcy5jb250ZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9jb250YWluZXJDb2xsYXBzaWJsZVJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJ11cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=