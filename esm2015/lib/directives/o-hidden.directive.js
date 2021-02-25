import { Directive, ElementRef, Renderer2 } from '@angular/core';
export class OHiddenDirective {
    constructor(el, renderer) {
        renderer.setStyle(el.nativeElement, 'display', 'none');
    }
}
OHiddenDirective.decorators = [
    { type: Directive, args: [{
                selector: '[oHidden]'
            },] }
];
OHiddenDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1oaWRkZW4uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL28taGlkZGVuLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPakUsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixZQUFZLEVBQWMsRUFBRSxRQUFtQjtRQUM3QyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7OztZQU5GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsV0FBVzthQUN0Qjs7O1lBTm1CLFVBQVU7WUFBRSxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IHR5cGUgT1RhYk1vZGUgPSAnb250aW1pemUnIHwgJ21hdGVyaWFsJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29IaWRkZW5dJ1xufSlcbmV4cG9ydCBjbGFzcyBPSGlkZGVuRGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICByZW5kZXJlci5zZXRTdHlsZShlbC5uYXRpdmVFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XG4gIH1cbn1cbiJdfQ==