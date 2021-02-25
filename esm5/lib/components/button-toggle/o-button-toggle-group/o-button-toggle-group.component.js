import * as tslib_1 from "tslib";
import { Component, ComponentFactoryResolver, ContentChildren, EventEmitter, forwardRef, QueryList, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material';
import { Util } from '../../../util/util';
import { InputConverter } from '../../../decorators/input-converter';
import { OButtonToggleComponent } from '../o-button-toggle.component';
export var DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP = [
    'oattr: attr',
    'name',
    'enabled',
    'layout',
    'multiple',
    'value'
];
export var DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP = [
    'onChange'
];
var OButtonToggleGroupComponent = (function () {
    function OButtonToggleGroupComponent(resolver) {
        this.resolver = resolver;
        this.DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP = DEFAULT_INPUTS_O_BUTTON_TOGGLE_GROUP;
        this.DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP = DEFAULT_OUTPUTS_O_BUTTON_TOGGLE_GROUP;
        this._enabled = true;
        this.layout = 'row';
        this.multiple = false;
        this.onChange = new EventEmitter();
    }
    Object.defineProperty(OButtonToggleGroupComponent.prototype, "enabled", {
        get: function () {
            if (this._innerButtonToggleGroup instanceof MatButtonToggleGroup) {
                return !this._innerButtonToggleGroup.disabled;
            }
            return true;
        },
        set: function (val) {
            if (this._innerButtonToggleGroup instanceof MatButtonToggleGroup) {
                val = Util.parseBoolean(String(val));
                this._innerButtonToggleGroup.disabled = !val;
            }
        },
        enumerable: true,
        configurable: true
    });
    OButtonToggleGroupComponent.prototype.ngOnInit = function () {
        if (!Util.isDefined(this.name)) {
            this.name = this.oattr;
        }
    };
    OButtonToggleGroupComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.buildChildren();
        this._children.changes.subscribe(function () { return _this.buildChildren(); });
    };
    OButtonToggleGroupComponent.prototype.buildChildren = function () {
        var _this = this;
        var factory = this.resolver.resolveComponentFactory(OButtonToggleComponent);
        this._viewContainerRef.clear();
        var childList = this._children.map(function (child) {
            var componentRef = _this._viewContainerRef.createComponent(factory);
            componentRef.instance.oattr = child.oattr;
            componentRef.instance.label = child.label;
            componentRef.instance.icon = child.icon;
            componentRef.instance.iconPosition = child.iconPosition;
            componentRef.instance.checked = child.checked;
            componentRef.instance.enabled = child.enabled;
            componentRef.instance.value = child.value;
            componentRef.instance.name = _this.name;
            componentRef.instance.onChange = child.onChange;
            componentRef.changeDetectorRef.detectChanges();
            return componentRef.instance;
        });
        this._innerButtonToggleGroup._buttonToggles.reset(childList.map(function (c) { return c._innerButtonToggle; }));
        this._children.reset(childList);
    };
    OButtonToggleGroupComponent.prototype.getValue = function () {
        return this._innerButtonToggleGroup ? this._innerButtonToggleGroup.value : void 0;
    };
    OButtonToggleGroupComponent.prototype.setValue = function (val) {
        this._innerButtonToggleGroup.value = val;
    };
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
    OButtonToggleGroupComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver }
    ]; };
    OButtonToggleGroupComponent.propDecorators = {
        _innerButtonToggleGroup: [{ type: ViewChild, args: [MatButtonToggleGroup, { static: false },] }],
        _viewContainerRef: [{ type: ViewChild, args: ['childContainer', { read: ViewContainerRef, static: false },] }],
        _children: [{ type: ContentChildren, args: [forwardRef(function () { return OButtonToggleComponent; }),] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OButtonToggleGroupComponent.prototype, "multiple", void 0);
    return OButtonToggleGroupComponent;
}());
export { OButtonToggleGroupComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24tdG9nZ2xlLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9idXR0b24tdG9nZ2xlL28tYnV0dG9uLXRvZ2dsZS1ncm91cC9vLWJ1dHRvbi10b2dnbGUtZ3JvdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBb0Isd0JBQXdCLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQVUsU0FBUyxFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuTixPQUFPLEVBQXlCLG9CQUFvQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFaEYsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUV0RSxNQUFNLENBQUMsSUFBTSxvQ0FBb0MsR0FBRztJQUNsRCxhQUFhO0lBQ2IsTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsVUFBVTtJQUNWLE9BQU87Q0FDUixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0scUNBQXFDLEdBQUc7SUFDbkQsVUFBVTtDQUNYLENBQUM7QUFFRjtJQWtERSxxQ0FBc0IsUUFBa0M7UUFBbEMsYUFBUSxHQUFSLFFBQVEsQ0FBMEI7UUFwQ2pELHlDQUFvQyxHQUFHLG9DQUFvQyxDQUFDO1FBQzVFLDBDQUFxQyxHQUFHLHFDQUFxQyxDQUFDO1FBaUIzRSxhQUFRLEdBQVksSUFBSSxDQUFDO1FBQzVCLFdBQU0sR0FBcUIsS0FBSyxDQUFDO1FBRWpDLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFLMUIsYUFBUSxHQUF3QyxJQUFJLFlBQVks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QUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCw4Q0FBUSxHQUFSLFVBQVMsR0FBUTtRQUNmLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQzNDLENBQUM7O2dCQTFGRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsNlFBQXFEO29CQUVyRCxNQUFNLEVBQUUsb0NBQW9DO29CQUM1QyxPQUFPLEVBQUUscUNBQXFDO29CQUM5QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLCtCQUErQixFQUFFLE1BQU07cUJBQ3hDO29CQUNELGVBQWUsRUFBRSxDQUFDLHNCQUFzQixDQUFDOztpQkFDMUM7OztnQkEvQm9ELHdCQUF3Qjs7OzBDQStEMUUsU0FBUyxTQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtvQ0FFakQsU0FBUyxTQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7NEJBRXJFLGVBQWUsU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLHNCQUFzQixFQUF0QixDQUFzQixDQUFDOztJQVp6RDtRQURDLGNBQWMsRUFBRTs7aUVBQ2dCO0lBeURuQyxrQ0FBQztDQUFBLEFBNUZELElBNEZDO1NBaEZZLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29tcG9uZW50RmFjdG9yeSwgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBDb250ZW50Q2hpbGRyZW4sIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgT25Jbml0LCBRdWVyeUxpc3QsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvblRvZ2dsZUNoYW5nZSwgTWF0QnV0dG9uVG9nZ2xlR3JvdXAgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPQnV0dG9uVG9nZ2xlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1idXR0b24tdG9nZ2xlLmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAgPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICduYW1lJyxcbiAgJ2VuYWJsZWQnLFxuICAnbGF5b3V0JyxcbiAgJ211bHRpcGxlJyxcbiAgJ3ZhbHVlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAgPSBbXG4gICdvbkNoYW5nZSdcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tYnV0dG9uLXRvZ2dsZS1ncm91cCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWJ1dHRvbi10b2dnbGUtZ3JvdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWJ1dHRvbi10b2dnbGUtZ3JvdXAuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tYnV0dG9uLXRvZ2dsZS1ncm91cF0nOiAndHJ1ZSdcbiAgfSxcbiAgZW50cnlDb21wb25lbnRzOiBbT0J1dHRvblRvZ2dsZUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0J1dHRvblRvZ2dsZUdyb3VwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcblxuICBwdWJsaWMgREVGQVVMVF9JTlBVVFNfT19CVVRUT05fVE9HR0xFX0dST1VQID0gREVGQVVMVF9JTlBVVFNfT19CVVRUT05fVE9HR0xFX0dST1VQO1xuICBwdWJsaWMgREVGQVVMVF9PVVRQVVRTX09fQlVUVE9OX1RPR0dMRV9HUk9VUCA9IERFRkFVTFRfT1VUUFVUU19PX0JVVFRPTl9UT0dHTEVfR1JPVVA7XG5cbiAgLyogSW5wdXRzICovXG4gIHByb3RlY3RlZCBvYXR0cjogc3RyaW5nO1xuICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5faW5uZXJCdXR0b25Ub2dnbGVHcm91cCBpbnN0YW5jZW9mIE1hdEJ1dHRvblRvZ2dsZUdyb3VwKSB7XG4gICAgICByZXR1cm4gIXRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAuZGlzYWJsZWQ7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHNldCBlbmFibGVkKHZhbDogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwIGluc3RhbmNlb2YgTWF0QnV0dG9uVG9nZ2xlR3JvdXApIHtcbiAgICAgIHZhbCA9IFV0aWwucGFyc2VCb29sZWFuKFN0cmluZyh2YWwpKTtcbiAgICAgIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAuZGlzYWJsZWQgPSAhdmFsO1xuICAgIH1cbiAgfVxuICBwcm90ZWN0ZWQgX2VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgbGF5b3V0OiAncm93JyB8ICdjb2x1bW4nID0gJ3Jvdyc7XG4gIEBJbnB1dENvbnZlcnRlcigpXG4gIHB1YmxpYyBtdWx0aXBsZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgdmFsdWU6IGFueTtcbiAgLyogRW5kIGlucHV0cyAqL1xuXG4gIC8qIE91dHB1dHMgKi9cbiAgcHVibGljIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyogRW5kIG91dHB1dHMgKi9cblxuICBAVmlld0NoaWxkKE1hdEJ1dHRvblRvZ2dsZUdyb3VwLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIF9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwOiBNYXRCdXR0b25Ub2dnbGVHcm91cDtcbiAgQFZpZXdDaGlsZCgnY2hpbGRDb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgcHJvdGVjdGVkIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gT0J1dHRvblRvZ2dsZUNvbXBvbmVudCkpXG4gIHByb3RlY3RlZCBfY2hpbGRyZW46IFF1ZXJ5TGlzdDxPQnV0dG9uVG9nZ2xlQ29tcG9uZW50PjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgeyB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKCFVdGlsLmlzRGVmaW5lZCh0aGlzLm5hbWUpKSB7XG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLm9hdHRyO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmJ1aWxkQ2hpbGRyZW4oKTtcbiAgICB0aGlzLl9jaGlsZHJlbi5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLmJ1aWxkQ2hpbGRyZW4oKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRDaGlsZHJlbigpOiB2b2lkIHtcbiAgICBjb25zdCBmYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PE9CdXR0b25Ub2dnbGVDb21wb25lbnQ+ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShPQnV0dG9uVG9nZ2xlQ29tcG9uZW50KTtcbiAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgY29uc3QgY2hpbGRMaXN0ID0gdGhpcy5fY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSk7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub2F0dHIgPSBjaGlsZC5vYXR0cjtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5sYWJlbCA9IGNoaWxkLmxhYmVsO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmljb24gPSBjaGlsZC5pY29uO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmljb25Qb3NpdGlvbiA9IGNoaWxkLmljb25Qb3NpdGlvbjtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5jaGVja2VkID0gY2hpbGQuY2hlY2tlZDtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5lbmFibGVkID0gY2hpbGQuZW5hYmxlZDtcbiAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS52YWx1ZSA9IGNoaWxkLnZhbHVlO1xuICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub25DaGFuZ2UgPSBjaGlsZC5vbkNoYW5nZTtcbiAgICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIH0pO1xuICAgIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAuX2J1dHRvblRvZ2dsZXMucmVzZXQoY2hpbGRMaXN0Lm1hcChjID0+IGMuX2lubmVyQnV0dG9uVG9nZ2xlKSk7XG4gICAgdGhpcy5fY2hpbGRyZW4ucmVzZXQoY2hpbGRMaXN0KTtcbiAgfVxuXG4gIGdldFZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlR3JvdXAgPyB0aGlzLl9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwLnZhbHVlIDogdm9pZCAwO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9pbm5lckJ1dHRvblRvZ2dsZUdyb3VwLnZhbHVlID0gdmFsO1xuICB9XG5cbn1cbiJdfQ==