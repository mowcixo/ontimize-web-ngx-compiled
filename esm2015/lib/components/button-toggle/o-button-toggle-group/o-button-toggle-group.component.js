import * as tslib_1 from "tslib";
import { Component, ComponentFactoryResolver, ContentChildren, EventEmitter, forwardRef, QueryList, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material';
import { Util } from '../../../util/util';
import { InputConverter } from '../../../decorators/input-converter';
import { OButtonToggleComponent } from '../o-button-toggle.component';
export const DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP = [
    'oattr: attr',
    'name',
    'enabled',
    'layout',
    'multiple',
    'value'
];
export const DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP = [
    'onChange'
];
export class OButtonToggleGroupComponent {
    constructor(resolver) {
        this.resolver = resolver;
        this.DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP = DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP;
        this.DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP = DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP;
        this._enabled = true;
        this.layout = 'row';
        this.multiple = false;
        this.onChange = new EventEmitter();
    }
    get enabled() {
        if (this._innerButtonToggleGroup instanceof MatButtonToggleGroup) {
            return !this._innerButtonToggleGroup.disabled;
        }
        return true;
    }
    set enabled(val) {
        if (this._innerButtonToggleGroup instanceof MatButtonToggleGroup) {
            val = Util.parseBoolean(String(val));
            this._innerButtonToggleGroup.disabled = !val;
        }
    }
    ngOnInit() {
        if (!Util.isDefined(this.name)) {
            this.name = this.oattr;
        }
    }
    ngAfterViewInit() {
        this.buildChildren();
        this._children.changes.subscribe(() => this.buildChildren());
    }
    buildChildren() {
        const factory = this.resolver.resolveComponentFactory(OButtonToggleComponent);
        this._viewContainerRef.clear();
        const childList = this._children.map((child) => {
            const componentRef = this._viewContainerRef.createComponent(factory);
            componentRef.instance.oattr = child.oattr;
            componentRef.instance.label = child.label;
            componentRef.instance.icon = child.icon;
            componentRef.instance.iconPosition = child.iconPosition;
            componentRef.instance.checked = child.checked;
            componentRef.instance.enabled = child.enabled;
            componentRef.instance.value = child.value;
            componentRef.instance.name = this.name;
            componentRef.instance.onChange = child.onChange;
            componentRef.changeDetectorRef.detectChanges();
            return componentRef.instance;
        });
        this._innerButtonToggleGroup._buttonToggles.reset(childList.map(c => c._innerButtonToggle));
        this._children.reset(childList);
    }
    getValue() {
        return this._innerButtonToggleGroup ? this._innerButtonToggleGroup.value : void 0;
    }
    setValue(val) {
        this._innerButtonToggleGroup.value = val;
    }
}
OButtonToggleGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-button-toggle-group',
                template: "<mat-button-toggle-group [disabled]=\"!enabled\" [name]=\"name\" [value]=\"value\" [vertical]=\"layout==='column'\" [multiple]=\"multiple\"\n  (change)=\"onChange.emit($event)\">\n  <ng-container #childContainer></ng-container>\n</mat-button-toggle-group>\n",
                inputs: DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP,
                outputs: DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-button-toggle-group]': 'true'
                },
                entryComponents: [OButtonToggleComponent],
                styles: [""]
            }] }
];
OButtonToggleGroupComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver }
];
OButtonToggleGroupComponent.propDecorators = {
    _innerButtonToggleGroup: [{ type: ViewChild, args: [MatButtonToggleGroup, { static: false },] }],
    _viewContainerRef: [{ type: ViewChild, args: ['childContainer', { read: ViewContainerRef, static: false },] }],
    _children: [{ type: ContentChildren, args: [forwardRef(() => OButtonToggleComponent),] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OButtonToggleGroupComponent.prototype, "multiple", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24tdG9nZ2xlLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9idXR0b24tdG9nZ2xlL28tYnV0dG9uLXRvZ2dsZS1ncm91cC9vLWJ1dHRvbi10b2dnbGUtZ3JvdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBb0Isd0JBQXdCLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQVUsU0FBUyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuTixPQUFPLEVBQXlCLG9CQUFvQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFaEYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUV0RSxNQUFNLENBQUMsTUFBTSxvQ0FBb0MsR0FBRztJQUNsRCxhQUFhO0lBQ2IsTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsVUFBVTtJQUNWLE9BQU87Q0FDUixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0scUNBQXFDLEdBQUc7SUFDbkQsVUFBVTtDQUNYLENBQUM7QUFjRixNQUFNLE9BQU8sMkJBQTJCO0lBc0N0QyxZQUFzQixRQUFrQztRQUFsQyxhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQXBDakQseUNBQW9DLEdBQUcsb0NBQW9DLENBQUM7UUFDNUUsMENBQXFDLEdBQUcscUNBQXFDLENBQUM7UUFpQjNFLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFDNUIsV0FBTSxHQUFxQixLQUFLLENBQUM7UUFFakMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUsxQixhQUFR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QUFLLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQVE7UUFDZixJQUFJLENBQUMsdUJBQXVCLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztJQUMzQyxDQUFDOzs7WUExRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLDZRQUFxRDtnQkFFckQsTUFBTSxFQUFFLG9DQUFvQztnQkFDNUMsT0FBTyxFQUFFLHFDQUFxQztnQkFDOUMsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSiwrQkFBK0IsRUFBRSxNQUFNO2lCQUN4QztnQkFDRCxlQUFlLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzs7YUFDMUM7OztZQS9Cb0Qsd0JBQXdCOzs7c0NBK0QxRSxTQUFTLFNBQUMsb0JBQW9CLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQUVqRCxTQUFTLFNBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTt3QkFFckUsZUFBZSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzs7QUFaekQ7SUFEQyxjQUFjLEVBQUU7OzZEQUNnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29tcG9uZW50RmFjdG9yeSwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBDb250ZW50Q2hpbGRyZW4sIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgT25Jbml0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSwgTWF0QnV0dG9uVG9nZ2xlR3JvdXAgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPQnV0dG9uVG9nZ2xlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1idXR0b24tdG9nZ2xlLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAgPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICduYW1lJyxcbiAgJ2VuYWJsZWQnLFxuICAnbGF5b3V0JyxcbiAgJ211bHRpcGxlJyxcbiAgJ3ZhbHVlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAgPSBbXG4gICdvbkNoYW5nZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYnV0dG9uLXRvZ2dsZS1ncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWJ1dHRvbi10b2dnbGUtZ3JvdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWJ1dHRvbi10b2dnbGUtZ3JvdXAuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYnV0dG9uLXRvZ2dsZS1ncm91cF0nOiAndHJ1ZSdcbiAgfSxcbiAgZW50cnlDb21wb25lbnRzOiBbT0J1dHRvblRvZ2dsZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0J1dHRvblRvZ2dsZUdyb3VwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcblxuICBwdWJsaWMgREVGQVVMVF9JTlBVVFNfT19CVVRUT05fVE9HR0xFX0dST1VQID0gREVGQVVMVF9JTlBVVFNfT19CVVRUT05fVE9HR0xFX0dST1VQO1xuICBwdWJsaWMgREVGQVVMVF9PVVRQVVRTX09fQlVUVE9OX1RPR0dMRV9HUk9VUCA9IERFRkFVTFRfT1VUUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVA7XG5cbiAgLyogSW5wdXRzICovXG4gIHByb3RlY3RlZCBvYXR0cjogc3RyaW5nO1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5faW5uZXJCdXR0b25Ub2dnbGVHcm91cCBpbnN0YW5jZW9mIE1hdEJ1dHRvblRvZ2dsZUdyb3VwKSB7XG4gICAgICByZXR1cm4gIXRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAuZGlzYWJsZWQ7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHNldCBlbmFibGVkKHZhbDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwIGluc3RhbmNlb2YgTWF0QnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgIHZhbCA9IFV0aWwucGFyc2VCb29sZWFuKFN0cmluZyh2YWwpKTtcbiAgICAgIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAuZGlzYWJsZWQgPSAhdmFsO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgbGF5b3V0OiAncm93JyB8ICdjb2x1bW4nID0gJ3Jvdyc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgdmFsdWU6IGFueTtcbiAgLyogRW5kIGlucHV0cyAqL1xuXG4gIC8qIE91dHB1dHMgKi9cbiAgcHVibGljIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyogRW5kIG91dHB1dHMgKi9cblxuICBAVmlld0NoaWxkKE1hdEJ1dHRvblRvZ2dsZUdyb3VwLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIF9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwOiBNYXRCdXR0b25Ub2dnbGVHcm91cDtcbiAgQFZpZXdDaGlsZCgnY2hpbGRDb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gT0J1dHRvblRvZ2dsZUNvbXBvbmVudCkpXG4gIHByb3RlY3RlZCBfY2hpbGRyZW46IFF1ZXJ5TGlzdDxPQnV0dG9uVG9nZ2xlQ29tcG9uZW50PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgeyB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLm5hbWUpKSB7XG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLm9hdHRyO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmJ1aWxkQ2hpbGRyZW4oKTtcbiAgICB0aGlzLl9jaGlsZHJlbi5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLmJ1aWxkQ2hpbGRyZW4oKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRDaGlsZHJlbigpOiB2b2lkIHtcbiAgICBjb25zdCBmYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PE9CdXR0b25Ub2dnbGVDb21wb25lbnQ+ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShPQnV0dG9uVG9nZ2xlQ29tcG9uZW50KTtcbiAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgY29uc3QgY2hpbGRMaXN0ID0gdGhpcy5fY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSk7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub2F0dHIgPSBjaGlsZC5vYXR0cjtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5sYWJlbCA9IGNoaWxkLmxhYmVsO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmljb24gPSBjaGlsZC5pY29uO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmljb25Qb3NpdGlvbiA9IGNoaWxkLmljb25Qb3NpdGlvbjtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5jaGVja2VkID0gY2hpbGQuY2hlY2tlZDtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5lbmFibGVkID0gY2hpbGQuZW5hYmxlZDtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS52YWx1ZSA9IGNoaWxkLnZhbHVlO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub25DaGFuZ2UgPSBjaGlsZC5vbkNoYW5nZTtcbiAgICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIH0pO1xuICAgIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAuX2J1dHRvblRvZ2dsZXMucmVzZXQoY2hpbGRMaXN0Lm1hcChjID0+IGMuX2lubmVyQnV0dG9uVG9nZ2xlKSk7XG4gICAgdGhpcy5fY2hpbGRyZW4ucmVzZXQoY2hpbGRMaXN0KTtcbiAgfVxuXG4gIGdldFZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAgPyB0aGlzLl9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwLnZhbHVlIDogdm9pZCAwO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwLnZhbHVlID0gdmFsO1xuICB9XG5cbn1cbiJdfQ==