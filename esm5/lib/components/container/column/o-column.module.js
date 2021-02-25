import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OColumnComponent } from './o-column.component';
var OColumnModule = (function () {
    function OColumnModule() {
    }
    OColumnModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OColumnComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OColumnComponent]
                },] }
    ];
    return OColumnModule;
}());
export { OColumnModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb2x1bW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2NvbnRhaW5lci9jb2x1bW4vby1jb2x1bW4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUV4RDtJQUFBO0lBSzZCLENBQUM7O2dCQUw3QixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7b0JBQ2hDLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7b0JBQ3RDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO2lCQUM1Qjs7SUFDNEIsb0JBQUM7Q0FBQSxBQUw5QixJQUs4QjtTQUFqQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPQ29sdW1uQ29tcG9uZW50IH0gZnJvbSAnLi9vLWNvbHVtbi5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPQ29sdW1uQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPQ29sdW1uQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPQ29sdW1uTW9kdWxlIHsgfVxuIl19