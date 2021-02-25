import { Component, EventEmitter, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatButtonToggle } from '@angular/material';
import { Util } from '../../util/util';
export var DEFAULT_INPUTS_O_BUTTON_TOGGLE = [
    'oattr: attr',
    'label',
    'icon',
    'iconPosition: icon-position',
    'checked',
    'enabled',
    'value',
    'name'
];
export var DEFAULT_OUTPUTS_O_BUTTON_TOGGLE = [
    'onChange'
];
var OButtonToggleComponent = (function () {
    function OButtonToggleComponent(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
        this.DEFAULT_INPUTS_O_BUTTON_TOGGLE = DEFAULT_INPUTS_O_BUTTON_TOGGLE;
        this.DEFAULT_OUTPUTS_O_BUTTON_TOGGLE = DEFAULT_OUTPUTS_O_BUTTON_TOGGLE;
        this.iconPosition = 'before';
        this._checked = false;
        this._enabled = true;
        this.onChange = new EventEmitter();
    }
    Object.defineProperty(OButtonToggleComponent.prototype, "checked", {
        get: function () {
            return this._innerButtonToggle.checked;
        },
        set: function (val) {
            val = Util.parseBoolean(String(val));
            this._innerButtonToggle.checked = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OButtonToggleComponent.prototype, "enabled", {
        get: function () {
            return !this._innerButtonToggle.disabled;
        },
        set: function (val) {
            val = Util.parseBoolean(String(val));
            this._innerButtonToggle.disabled = !val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OButtonToggleComponent.prototype, "value", {
        get: function () {
            return this._innerButtonToggle.value;
        },
        set: function (val) {
            this._innerButtonToggle.value = val;
        },
        enumerable: true,
        configurable: true
    });
    OButtonToggleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-button-toggle',
                    template: "<mat-button-toggle #bt [id]=\"oattr\" [name]=\"name\" [checked]=\"checked\" [disabled]=\"!enabled\" [value]=\"value\" (change)=\"onChange.emit($event)\">\n  <mat-icon *ngIf=\"icon && iconPosition==='before'\">{{ icon }}</mat-icon>\n  {{ label }}\n  <mat-icon *ngIf=\"icon && iconPosition==='after'\">{{ icon }}</mat-icon>\n</mat-button-toggle>\n",
                    inputs: DEFAULT_INPUTS_O_BUTTON_TOGGLE,
                    outputs: DEFAULT_OUTPUTS_O_BUTTON_TOGGLE,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-button-toggle]': 'true'
                    },
                    styles: [".o-button-toggle{display:inline-block}.o-button-toggle .mat-button-toggle{display:flex}"]
                }] }
    ];
    OButtonToggleComponent.ctorParameters = function () { return [
        { type: ViewContainerRef }
    ]; };
    OButtonToggleComponent.propDecorators = {
        _innerButtonToggle: [{ type: ViewChild, args: ['bt', { static: true },] }]
    };
    return OButtonToggleComponent;
}());
export { OButtonToggleComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24tdG9nZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9idXR0b24tdG9nZ2xlL28tYnV0dG9uLXRvZ2dsZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hHLE9BQU8sRUFBRSxlQUFlLEVBQXlCLE1BQU0sbUJBQW1CLENBQUM7QUFFM0UsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXZDLE1BQU0sQ0FBQyxJQUFNLDhCQUE4QixHQUFHO0lBQzVDLGFBQWE7SUFDYixPQUFPO0lBRVAsTUFBTTtJQUNOLDZCQUE2QjtJQUM3QixTQUFTO0lBQ1QsU0FBUztJQUNULE9BQU87SUFDUCxNQUFNO0NBQ1AsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLCtCQUErQixHQUFHO0lBQzdDLFVBQVU7Q0FDWCxDQUFDO0FBRUY7SUFpQ0UsZ0NBQW1CLGdCQUFrQztRQUFsQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBcEI5QyxtQ0FBOEIsR0FBRyw4QkFBOEIsQ0FBQztRQUNoRSxvQ0FBK0IsR0FBRywrQkFBK0IsQ0FBQztRQU1sRSxpQkFBWSxHQUF1QixRQUFRLENBQUM7UUFFekMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBSzVCLGFBQVEsR0FBd0MsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUtqQixDQUFDO0lBRTFELHNCQUFJLDJDQUFPO2FBQVg7WUFDRSxPQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUM7UUFDekMsQ0FBQzthQUVELFVBQVksR0FBWTtZQUN0QixHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUN4QyxDQUFDOzs7T0FMQTtJQU9ELHNCQUFJLDJDQUFPO2FBQVg7WUFDRSxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUMzQyxDQUFDO2FBRUQsVUFBWSxHQUFZO1lBQ3RCLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDMUMsQ0FBQzs7O09BTEE7SUFPRCxzQkFBSSx5Q0FBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLENBQUM7YUFFRCxVQUFVLEdBQVE7WUFDaEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDdEMsQ0FBQzs7O09BSkE7O2dCQXZERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IscVdBQStDO29CQUUvQyxNQUFNLEVBQUUsOEJBQThCO29CQUN0QyxPQUFPLEVBQUUsK0JBQStCO29CQUN4QyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLHlCQUF5QixFQUFFLE1BQU07cUJBQ2xDOztpQkFDRjs7O2dCQS9CNEMsZ0JBQWdCOzs7cUNBb0QxRCxTQUFTLFNBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUE2Qm5DLDZCQUFDO0NBQUEsQUE1REQsSUE0REM7U0FqRFksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEJ1dHRvblRvZ2dsZSwgTWF0QnV0dG9uVG9nZ2xlQ2hhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fQlVUVE9OX1RPR0dMRSA9IFtcbiAgJ29hdHRyOiBhdHRyJyxcbiAgJ2xhYmVsJyxcbiAgLy8gaWNvbiBbc3RyaW5nXTogTmFtZSBvZiBnb29nbGUgaWNvbiAoc2VlIGh0dHBzOi8vZGVzaWduLmdvb2dsZS5jb20vaWNvbnMvKVxuICAnaWNvbicsXG4gICdpY29uUG9zaXRpb246IGljb24tcG9zaXRpb24nLFxuICAnY2hlY2tlZCcsXG4gICdlbmFibGVkJyxcbiAgJ3ZhbHVlJyxcbiAgJ25hbWUnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fQlVUVE9OX1RPR0dMRSA9IFtcbiAgJ29uQ2hhbmdlJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1idXR0b24tdG9nZ2xlJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tYnV0dG9uLXRvZ2dsZS5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tYnV0dG9uLXRvZ2dsZS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fQlVUVE9OX1RPR0dMRSxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fQlVUVE9OX1RPR0dMRSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1idXR0b24tdG9nZ2xlXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9CdXR0b25Ub2dnbGVDb21wb25lbnQge1xuXG4gIHB1YmxpYyBERUZBVUxUX0lOUFVUU19PX0JVVFRPTl9UT0dHTEUgPSBERUZBVUxUX0lOUFVUU19PX0JVVFRPTl9UT0dHTEU7XG4gIHB1YmxpYyBERUZBVUxUX09VVFBVVFNfT19CVVRUT05fVE9HR0xFID0gREVGQVVMVF9PVVRQVVRTX09fQlVUVE9OX1RPR0dMRTtcblxuICAvKiBJbnB1dHMgKi9cbiAgcHVibGljIG9hdHRyOiBzdHJpbmc7XG4gIHB1YmxpYyBsYWJlbDogc3RyaW5nO1xuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwdWJsaWMgaWNvblBvc2l0aW9uOiAnYmVmb3JlJyB8ICdhZnRlcicgPSAnYmVmb3JlJztcblxuICBwcm90ZWN0ZWQgX2NoZWNrZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIF9lbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgLyogRW5kIGlucHV0cyAqL1xuXG4gIC8qIE91dHB1dHMgKi9cbiAgcHVibGljIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TWF0QnV0dG9uVG9nZ2xlQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyogRW5kIG91dHB1dHMgKi9cblxuICBAVmlld0NoaWxkKCdidCcsIHsgc3RhdGljOiB0cnVlIH0pIHB1YmxpYyBfaW5uZXJCdXR0b25Ub2dnbGU6IE1hdEJ1dHRvblRvZ2dsZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikgeyB9XG5cbiAgZ2V0IGNoZWNrZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlLmNoZWNrZWQ7XG4gIH1cblxuICBzZXQgY2hlY2tlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5faW5uZXJCdXR0b25Ub2dnbGUuY2hlY2tlZCA9IHZhbDtcbiAgfVxuXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5faW5uZXJCdXR0b25Ub2dnbGUuZGlzYWJsZWQ7XG4gIH1cblxuICBzZXQgZW5hYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5faW5uZXJCdXR0b25Ub2dnbGUuZGlzYWJsZWQgPSAhdmFsO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2lubmVyQnV0dG9uVG9nZ2xlLnZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbDogYW55KSB7XG4gICAgdGhpcy5faW5uZXJCdXR0b25Ub2dnbGUudmFsdWUgPSB2YWw7XG4gIH1cbn1cbiJdfQ==