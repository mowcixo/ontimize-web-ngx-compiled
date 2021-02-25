import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormComponent } from './o-form.component';
import { OFormToolbarModule } from './toolbar/o-form-toolbar.module';
var OFormModule = (function () {
    function OFormModule() {
    }
    OFormModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OFormComponent],
                    imports: [CommonModule, OFormToolbarModule, OSharedModule],
                    exports: [OFormComponent, OFormToolbarModule],
                    providers: [{ provide: CanDeactivateFormGuard, useClass: CanDeactivateFormGuard }],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];
    return OFormModule;
}());
export { OFormModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9mb3JtL28tZm9ybS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUVyRTtJQUFBO0lBTzJCLENBQUM7O2dCQVAzQixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsY0FBYyxDQUFDO29CQUM5QixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxDQUFDO29CQUMxRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUM7b0JBQzdDLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxzQkFBc0IsRUFBRSxDQUFDO29CQUNsRixPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDbEM7O0lBQzBCLGtCQUFDO0NBQUEsQUFQNUIsSUFPNEI7U0FBZixXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENVU1RPTV9FTEVNRU5UU19TQ0hFTUEsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBDYW5EZWFjdGl2YXRlRm9ybUd1YXJkIH0gZnJvbSAnLi9ndWFyZHMvby1mb3JtLWNhbi1kZWFjdGl2YXRlLmd1YXJkJztcbmltcG9ydCB7IE9Gb3JtQ29tcG9uZW50IH0gZnJvbSAnLi9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtVG9vbGJhck1vZHVsZSB9IGZyb20gJy4vdG9vbGJhci9vLWZvcm0tdG9vbGJhci5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPRm9ybUNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9Gb3JtVG9vbGJhck1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPRm9ybUNvbXBvbmVudCwgT0Zvcm1Ub29sYmFyTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBDYW5EZWFjdGl2YXRlRm9ybUd1YXJkLCB1c2VDbGFzczogQ2FuRGVhY3RpdmF0ZUZvcm1HdWFyZCB9XSxcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtTW9kdWxlIHsgfVxuIl19