import * as tslib_1 from "tslib";
import { ElementRef, Inject, Injector, Optional, ViewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatExpansionPanel } from '@angular/material';
import { InputConverter } from '../../decorators/input-converter';
import { DEFAULT_INPUTS_O_CONTAINER, OContainerComponent } from './o-container-component.class';
export const DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE = [
    ...DEFAULT_INPUTS_O_CONTAINER,
    'expanded',
    'description',
    'collapsedHeight:collapsed-height',
    'expandedHeight:expanded-height'
];
export class OContainerCollapsibleComponent extends OContainerComponent {
    constructor(elRef, injector, matFormDefaultOption) {
        super(elRef, injector, matFormDefaultOption);
        this.elRef = elRef;
        this.injector = injector;
        this.matFormDefaultOption = matFormDefaultOption;
        this.expanded = true;
        this.collapsedHeight = '37px';
        this.expandedHeight = '37px';
        this.contentObserver = new MutationObserver(() => this.updateHeightExpansionPanelContent());
    }
    ngAfterViewInit() {
        if (this.expPanel) {
            this._containerCollapsibleRef = this.expPanel._body;
            this.registerContentObserver();
        }
        else {
            this.unregisterContentObserver();
        }
    }
    updateOutlineGap() {
        if (this.isAppearanceOutline()) {
            const exPanelHeader = this._titleEl ? this._titleEl._element.nativeElement : null;
            if (!this._containerRef) {
                return;
            }
            const containerOutline = this._containerRef.nativeElement;
            const containerOutlineRect = containerOutline.getBoundingClientRect();
            if (containerOutlineRect.width === 0 && containerOutlineRect.height === 0) {
                return;
            }
            const titleEl = exPanelHeader.querySelector('.o-container-title.mat-expansion-panel-header-title');
            const descrEl = exPanelHeader.querySelector('.mat-expansion-panel-header-description');
            const containerStart = containerOutlineRect.left;
            const descrStart = descrEl.getBoundingClientRect().left;
            let titleWidth = 0;
            if (this.hasHeader()) {
                titleWidth += this.icon ? titleEl.querySelector('mat-icon').offsetWidth : 0;
                titleWidth += this.title ? titleEl.querySelector('span').offsetWidth : 0;
                titleWidth = titleWidth === 0 ? 0 : titleWidth + 4;
            }
            const descrWidth = this.description ? descrEl.querySelector('span').offsetWidth + 8 : 0;
            const empty1Width = descrStart - containerStart - 14 - titleWidth - 4;
            const gapTitleEls = containerOutline.querySelectorAll('.o-container-outline-gap-title');
            const gapEmpty1Els = containerOutline.querySelectorAll('.o-container-outline-gap-empty1');
            const gapDescrEls = containerOutline.querySelectorAll('.o-container-outline-gap-description');
            gapTitleEls[0].style.width = `${titleWidth}px`;
            gapEmpty1Els[0].style.width = `${empty1Width}px`;
            gapDescrEls[0].style.width = `${descrWidth}px`;
        }
    }
    registerObserver() {
        if (this._titleEl) {
            this.titleObserver.observe(this._titleEl._element.nativeElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }
    updateHeightExpansionPanelContent() {
        const exPanelHeader = this._titleEl ? this._titleEl._element.nativeElement : null;
        const exPanelContent = this._containerCollapsibleRef ? this._containerCollapsibleRef.nativeElement.querySelector('.o-container-scroll') : null;
        const parentHeight = exPanelHeader.parentNode ? exPanelHeader.parentNode.offsetHeight : null;
        const height = (OContainerComponent.APPEARANCE_OUTLINE === this.appearance) ? parentHeight : (parentHeight - exPanelHeader.offsetHeight);
        if (height > 0) {
            exPanelContent.style.height = height + 'px';
        }
    }
    unregisterContentObserver() {
        if (this.contentObserver) {
            this.contentObserver.disconnect();
        }
    }
    registerContentObserver() {
        if (this._containerCollapsibleRef) {
            this.contentObserver.observe(this._containerCollapsibleRef.nativeElement, {
                childList: true,
                attributes: true,
                attributeFilter: ['style']
            });
        }
    }
}
OContainerCollapsibleComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_FORM_FIELD_DEFAULT_OPTIONS,] }] }
];
OContainerCollapsibleComponent.propDecorators = {
    expPanel: [{ type: ViewChild, args: ['expPanel', { static: false },] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OContainerCollapsibleComponent.prototype, "expanded", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250YWluZXItY29sbGFwc2libGUtY29tcG9uZW50LmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9vLWNvbnRhaW5lci1jb2xsYXBzaWJsZS1jb21wb25lbnQuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBaUIsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV0RixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFaEcsTUFBTSxDQUFDLE1BQU0sc0NBQXNDLEdBQUc7SUFDcEQsR0FBRywwQkFBMEI7SUFDN0IsVUFBVTtJQUNWLGFBQWE7SUFDYixrQ0FBa0M7SUFDbEMsZ0NBQWdDO0NBQ2pDLENBQUM7QUFFRixNQUFNLE9BQU8sOEJBQStCLFNBQVEsbUJBQW1CO0lBYXJFLFlBQ1ksS0FBaUIsRUFDakIsUUFBa0IsRUFDa0Msb0JBQW9CO1FBRWxGLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFKbkMsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2tDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBQTtRQWI3RSxhQUFRLEdBQVksSUFBSSxDQUFDO1FBQ3pCLG9CQUFlLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLG1CQUFjLEdBQUcsTUFBTSxDQUFDO1FBR3JCLG9CQUFlLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJ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QUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVTLHVCQUF1QjtRQUMvQixJQUFJLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtZQUNqQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxFQUFFO2dCQUN4RSxTQUFTLEVBQUUsSUFBSTtnQkFDZixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDO2FBQzNCLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQzs7O1lBckhxQixVQUFVO1lBQVUsUUFBUTs0Q0E4Qi9DLFFBQVEsWUFBSSxNQUFNLFNBQUMsOEJBQThCOzs7dUJBUG5ELFNBQVMsU0FBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQU54QztJQURDLGNBQWMsRUFBRTs7Z0VBQ2UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdG9yLCBPcHRpb25hbCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRk9STV9GSUVMRF9ERUZBVUxUX09QVElPTlMsIE1hdEV4cGFuc2lvblBhbmVsIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IERFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSLCBPQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWNvbnRhaW5lci1jb21wb25lbnQuY2xhc3MnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19DT05UQUlORVJfQ09MTEFQU0lCTEUgPSBbXG4gIC4uLkRFRkFVTFRfSU5QVVRTX09fQ09OVEFJTkVSLFxuICAnZXhwYW5kZWQnLFxuICAnZGVzY3JpcHRpb24nLFxuICAnY29sbGFwc2VkSGVpZ2h0OmNvbGxhcHNlZC1oZWlnaHQnLFxuICAnZXhwYW5kZWRIZWlnaHQ6ZXhwYW5kZWQtaGVpZ2h0J1xuXTtcblxuZXhwb3J0IGNsYXNzIE9Db250YWluZXJDb2xsYXBzaWJsZUNvbXBvbmVudCBleHRlbmRzIE9Db250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBwdWJsaWMgZXhwYW5kZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgY29sbGFwc2VkSGVpZ2h0ID0gJzM3cHgnO1xuICBwdWJsaWMgZXhwYW5kZWRIZWlnaHQgPSAnMzdweCc7XG4gIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCBjb250ZW50T2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigoKSA9PiB0aGlzLnVwZGF0ZUhlaWdodEV4cGFuc2lvblBhbmVsQ29udGVudCgpKTtcbiAgQFZpZXdDaGlsZCgnZXhwUGFuZWwnLCB7IHN0YXRpYzogZmFsc2UgfSkgZXhwUGFuZWw6IE1hdEV4cGFuc2lvblBhbmVsO1xuICBwcm90ZWN0ZWQgX2NvbnRhaW5lckNvbGxhcHNpYmxlUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0ZPUk1fRklFTERfREVGQVVMVF9PUFRJT05TKSBwcm90ZWN0ZWQgbWF0Rm9ybURlZmF1bHRPcHRpb25cbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIGluamVjdG9yLCBtYXRGb3JtRGVmYXVsdE9wdGlvbik7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXhwUGFuZWwpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lckNvbGxhcHNpYmxlUmVmID0gdGhpcy5leHBQYW5lbC5fYm9keTtcbiAgICAgIHRoaXMucmVnaXN0ZXJDb250ZW50T2JzZXJ2ZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bnJlZ2lzdGVyQ29udGVudE9ic2VydmVyKCk7XG4gICAgfVxuICB9XG4gIHByb3RlY3RlZCB1cGRhdGVPdXRsaW5lR2FwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzQXBwZWFyYW5jZU91dGxpbmUoKSkge1xuICAgICAgY29uc3QgZXhQYW5lbEhlYWRlciA9IHRoaXMuX3RpdGxlRWwgPyAodGhpcy5fdGl0bGVFbCBhcyBhbnkpLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgICBpZiAoIXRoaXMuX2NvbnRhaW5lclJlZikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBjb250YWluZXJPdXRsaW5lID0gdGhpcy5fY29udGFpbmVyUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBjb250YWluZXJPdXRsaW5lUmVjdCA9IGNvbnRhaW5lck91dGxpbmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBpZiAoY29udGFpbmVyT3V0bGluZVJlY3Qud2lkdGggPT09IDAgJiYgY29udGFpbmVyT3V0bGluZVJlY3QuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGl0bGVFbCA9IGV4UGFuZWxIZWFkZXIucXVlcnlTZWxlY3RvcignLm8tY29udGFpbmVyLXRpdGxlLm1hdC1leHBhbnNpb24tcGFuZWwtaGVhZGVyLXRpdGxlJyk7XG4gICAgICBjb25zdCBkZXNjckVsID0gZXhQYW5lbEhlYWRlci5xdWVyeVNlbGVjdG9yKCcubWF0LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXItZGVzY3JpcHRpb24nKTtcblxuICAgICAgY29uc3QgY29udGFpbmVyU3RhcnQgPSBjb250YWluZXJPdXRsaW5lUmVjdC5sZWZ0O1xuICAgICAgY29uc3QgZGVzY3JTdGFydCA9IGRlc2NyRWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcblxuICAgICAgbGV0IHRpdGxlV2lkdGggPSAwO1xuICAgICAgaWYgKHRoaXMuaGFzSGVhZGVyKCkpIHtcbiAgICAgICAgdGl0bGVXaWR0aCArPSB0aGlzLmljb24gPyB0aXRsZUVsLnF1ZXJ5U2VsZWN0b3IoJ21hdC1pY29uJykub2Zmc2V0V2lkdGggOiAwOyAvLyBpY29uXG4gICAgICAgIHRpdGxlV2lkdGggKz0gdGhpcy50aXRsZSA/IHRpdGxlRWwucXVlcnlTZWxlY3Rvcignc3BhbicpLm9mZnNldFdpZHRoIDogMDsgLy8gdGl0bGVcbiAgICAgICAgdGl0bGVXaWR0aCA9IHRpdGxlV2lkdGggPT09IDAgPyAwIDogdGl0bGVXaWR0aCArIDQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlc2NyV2lkdGggPSB0aGlzLmRlc2NyaXB0aW9uID8gZGVzY3JFbC5xdWVyeVNlbGVjdG9yKCdzcGFuJykub2Zmc2V0V2lkdGggKyA4IDogMDtcbiAgICAgIGNvbnN0IGVtcHR5MVdpZHRoID0gZGVzY3JTdGFydCAtIGNvbnRhaW5lclN0YXJ0IC0gMTQgLSB0aXRsZVdpZHRoIC0gNDtcblxuICAgICAgY29uc3QgZ2FwVGl0bGVFbHMgPSBjb250YWluZXJPdXRsaW5lLnF1ZXJ5U2VsZWN0b3JBbGwoJy5vLWNvbnRhaW5lci1vdXRsaW5lLWdhcC10aXRsZScpO1xuICAgICAgY29uc3QgZ2FwRW1wdHkxRWxzID0gY29udGFpbmVyT3V0bGluZS5xdWVyeVNlbGVjdG9yQWxsKCcuby1jb250YWluZXItb3V0bGluZS1nYXAtZW1wdHkxJyk7XG4gICAgICBjb25zdCBnYXBEZXNjckVscyA9IGNvbnRhaW5lck91dGxpbmUucXVlcnlTZWxlY3RvckFsbCgnLm8tY29udGFpbmVyLW91dGxpbmUtZ2FwLWRlc2NyaXB0aW9uJyk7XG5cbiAgICAgIGdhcFRpdGxlRWxzWzBdLnN0eWxlLndpZHRoID0gYCR7dGl0bGVXaWR0aH1weGA7XG4gICAgICBnYXBFbXB0eTFFbHNbMF0uc3R5bGUud2lkdGggPSBgJHtlbXB0eTFXaWR0aH1weGA7XG4gICAgICBnYXBEZXNjckVsc1swXS5zdHlsZS53aWR0aCA9IGAke2Rlc2NyV2lkdGh9cHhgO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3Rlck9ic2VydmVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90aXRsZUVsKSB7XG4gICAgICB0aGlzLnRpdGxlT2JzZXJ2ZXIub2JzZXJ2ZSgodGhpcy5fdGl0bGVFbCBhcyBhbnkpLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLFxuICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdXBkYXRlSGVpZ2h0RXhwYW5zaW9uUGFuZWxDb250ZW50KCk6IHZvaWQge1xuICAgIGNvbnN0IGV4UGFuZWxIZWFkZXIgPSB0aGlzLl90aXRsZUVsID8gKHRoaXMuX3RpdGxlRWwgYXMgYW55KS5fZWxlbWVudC5uYXRpdmVFbGVtZW50IDogbnVsbDtcbiAgICBjb25zdCBleFBhbmVsQ29udGVudDogSFRNTEVsZW1lbnQgPSB0aGlzLl9jb250YWluZXJDb2xsYXBzaWJsZVJlZiA/IHRoaXMuX2NvbnRhaW5lckNvbGxhcHNpYmxlUmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm8tY29udGFpbmVyLXNjcm9sbCcpIDogbnVsbDtcbiAgICBjb25zdCBwYXJlbnRIZWlnaHQgPSBleFBhbmVsSGVhZGVyLnBhcmVudE5vZGUgPyBleFBhbmVsSGVhZGVyLnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0IDogbnVsbDtcblxuICAgIGNvbnN0IGhlaWdodCA9IChPQ29udGFpbmVyQ29tcG9uZW50LkFQUEVBUkFOQ0VfT1VUTElORSA9PT0gdGhpcy5hcHBlYXJhbmNlKSA/IHBhcmVudEhlaWdodCA6IChwYXJlbnRIZWlnaHQgLSBleFBhbmVsSGVhZGVyLm9mZnNldEhlaWdodCk7XG4gICAgaWYgKGhlaWdodCA+IDApIHtcbiAgICAgIGV4UGFuZWxDb250ZW50LnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVucmVnaXN0ZXJDb250ZW50T2JzZXJ2ZXIoKTogYW55IHtcbiAgICBpZiAodGhpcy5jb250ZW50T2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMuY29udGVudE9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVnaXN0ZXJDb250ZW50T2JzZXJ2ZXIoKTogYW55IHtcbiAgICBpZiAodGhpcy5fY29udGFpbmVyQ29sbGFwc2libGVSZWYpIHtcbiAgICAgIHRoaXMuY29udGVudE9ic2VydmVyLm9ic2VydmUodGhpcy5fY29udGFpbmVyQ29sbGFwc2libGVSZWYubmF0aXZlRWxlbWVudCwge1xuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZSddXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufVxuIl19