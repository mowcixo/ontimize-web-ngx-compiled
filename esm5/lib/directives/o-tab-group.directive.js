import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
var OTabGroupDirective = (function () {
    function OTabGroupDirective(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this._mode = 'ontimize';
        this._defaultMode = 'ontimize';
    }
    Object.defineProperty(OTabGroupDirective.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (mode) {
            this._mode = mode;
            this.applyMode();
        },
        enumerable: true,
        configurable: true
    });
    OTabGroupDirective.prototype.applyMode = function (mode) {
        this.renderer.removeClass(this.el.nativeElement, OTabGroupDirective.OTabModes.material);
        this.renderer.removeClass(this.el.nativeElement, OTabGroupDirective.OTabModes.ontimize);
        this.renderer.addClass(this.el.nativeElement, OTabGroupDirective.OTabModes[this.mode || this._defaultMode]);
    };
    OTabGroupDirective.OTabModes = {
        ontimize: 'o-tab-ontimize',
        material: 'o-tab-material'
    };
    OTabGroupDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oTabGroup]'
                },] }
    ];
    OTabGroupDirective.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef }
    ]; };
    OTabGroupDirective.propDecorators = {
        mode: [{ type: Input, args: ['oTabGroup',] }]
    };
    return OTabGroupDirective;
}());
export { OTabGroupDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWItZ3JvdXAuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL28tdGFiLWdyb3VwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXhFO0lBdUJFLDRCQUFzQixRQUFtQixFQUFZLEVBQWM7UUFBN0MsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFZLE9BQUUsR0FBRixFQUFFLENBQVk7UUFiekQsVUFBSyxHQUFhLFVBQVUsQ0FBQztRQUM3QixpQkFBWSxHQUFhLFVBQVUsQ0FBQztJQVl5QixDQUFDO0lBVnhFLHNCQUNJLG9DQUFJO2FBS1I7WUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQzthQVJELFVBQ1MsSUFBYztZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkIsQ0FBQzs7O09BQUE7SUFRUyxzQ0FBUyxHQUFuQixVQUFvQixJQUFlO1FBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDOUcsQ0FBQztJQXhCZ0IsNEJBQVMsR0FBRztRQUMzQixRQUFRLEVBQUUsZ0JBQWdCO1FBQzFCLFFBQVEsRUFBRSxnQkFBZ0I7S0FDM0IsQ0FBQzs7Z0JBUkgsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO2lCQUN4Qjs7O2dCQU5zQyxTQUFTO2dCQUE1QixVQUFVOzs7dUJBaUIzQixLQUFLLFNBQUMsV0FBVzs7SUFrQnBCLHlCQUFDO0NBQUEsQUEvQkQsSUErQkM7U0E1Qlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbnB1dCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCB0eXBlIE9UYWJNb2RlID0gJ29udGltaXplJyB8ICdtYXRlcmlhbCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tvVGFiR3JvdXBdJ1xufSlcbmV4cG9ydCBjbGFzcyBPVGFiR3JvdXBEaXJlY3RpdmUge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgT1RhYk1vZGVzID0ge1xuICAgIG9udGltaXplOiAnby10YWItb250aW1pemUnLFxuICAgIG1hdGVyaWFsOiAnby10YWItbWF0ZXJpYWwnXG4gIH07XG5cbiAgcHJvdGVjdGVkIF9tb2RlOiBPVGFiTW9kZSA9ICdvbnRpbWl6ZSc7XG4gIHByb3RlY3RlZCBfZGVmYXVsdE1vZGU6IE9UYWJNb2RlID0gJ29udGltaXplJztcblxuICBASW5wdXQoJ29UYWJHcm91cCcpXG4gIHNldCBtb2RlKG1vZGU6IE9UYWJNb2RlKSB7XG4gICAgdGhpcy5fbW9kZSA9IG1vZGU7XG4gICAgdGhpcy5hcHBseU1vZGUoKTtcbiAgfVxuXG4gIGdldCBtb2RlKCk6IE9UYWJNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLCBwcm90ZWN0ZWQgZWw6IEVsZW1lbnRSZWYpIHsgfVxuXG4gIHByb3RlY3RlZCBhcHBseU1vZGUobW9kZT86IE9UYWJNb2RlKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIE9UYWJHcm91cERpcmVjdGl2ZS5PVGFiTW9kZXMubWF0ZXJpYWwpO1xuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBPVGFiR3JvdXBEaXJlY3RpdmUuT1RhYk1vZGVzLm9udGltaXplKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgT1RhYkdyb3VwRGlyZWN0aXZlLk9UYWJNb2Rlc1t0aGlzLm1vZGUgfHwgdGhpcy5fZGVmYXVsdE1vZGVdKTtcbiAgfVxuXG59XG4iXX0=