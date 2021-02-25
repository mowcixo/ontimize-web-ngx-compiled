import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';
import { OGridComponent } from './o-grid.component';
var OGridModule = (function () {
    function OGridModule() {
    }
    OGridModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OGridComponent, OGridItemDirective, OGridItemComponent],
                    imports: [CommonModule, OSearchInputModule, OSharedModule, RouterModule],
                    exports: [OGridComponent, OGridItemComponent, OGridItemDirective],
                    entryComponents: [OGridItemComponent]
                },] }
    ];
    return OGridModule;
}());
export { OGridModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ncmlkL28tZ3JpZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNqRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQ7SUFBQTtJQU0yQixDQUFDOztnQkFOM0IsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQztvQkFDdEUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxZQUFZLENBQUM7b0JBQ3hFLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsQ0FBQztvQkFDakUsZUFBZSxFQUFFLENBQUMsa0JBQWtCLENBQUM7aUJBQ3RDOztJQUMwQixrQkFBQztDQUFBLEFBTjVCLElBTTRCO1NBQWYsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9TZWFyY2hJbnB1dE1vZHVsZSB9IGZyb20gJy4uL2lucHV0L3NlYXJjaC1pbnB1dC9vLXNlYXJjaC1pbnB1dC5tb2R1bGUnO1xuaW1wb3J0IHsgT0dyaWRJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9ncmlkLWl0ZW0vby1ncmlkLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9HcmlkSXRlbURpcmVjdGl2ZSB9IGZyb20gJy4vZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBPR3JpZENvbXBvbmVudCB9IGZyb20gJy4vby1ncmlkLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09HcmlkQ29tcG9uZW50LCBPR3JpZEl0ZW1EaXJlY3RpdmUsIE9HcmlkSXRlbUNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TZWFyY2hJbnB1dE1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgZXhwb3J0czogW09HcmlkQ29tcG9uZW50LCBPR3JpZEl0ZW1Db21wb25lbnQsIE9HcmlkSXRlbURpcmVjdGl2ZV0sXG4gIGVudHJ5Q29tcG9uZW50czogW09HcmlkSXRlbUNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0dyaWRNb2R1bGUgeyB9XG4iXX0=