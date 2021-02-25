import { Directive, ElementRef, Renderer2 } from '@angular/core';
var OHiddenDirective = (function () {
    function OHiddenDirective(el, renderer) {
        renderer.setStyle(el.nativeElement, 'display', 'none');
    }
    OHiddenDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oHidden]'
                },] }
    ];
    OHiddenDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    return OHiddenDirective;
}());
export { OHiddenDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1oaWRkZW4uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9kaXJlY3RpdmVzL28taGlkZGVuLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJakU7SUFJRSwwQkFBWSxFQUFjLEVBQUUsUUFBbUI7UUFDN0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RCxDQUFDOztnQkFORixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLFdBQVc7aUJBQ3RCOzs7Z0JBTm1CLFVBQVU7Z0JBQUUsU0FBUzs7SUFXekMsdUJBQUM7Q0FBQSxBQVBELElBT0M7U0FKWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgdHlwZSBPVGFiTW9kZSA9ICdvbnRpbWl6ZScgfCAnbWF0ZXJpYWwnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbb0hpZGRlbl0nXG59KVxuZXhwb3J0IGNsYXNzIE9IaWRkZW5EaXJlY3RpdmUge1xuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHJlbmRlcmVyLnNldFN0eWxlKGVsLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfVxufVxuIl19