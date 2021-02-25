import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckbox } from '@angular/material';
import { RouterModule } from '@angular/router';
import { OSharedModule } from '../../shared/shared.module';
import { OSearchInputModule } from '../input/search-input/o-search-input.module';
import { OListItemComponent } from './list-item/o-list-item.component';
import { OListComponent } from './o-list.component';
import { OListItemAvatarComponent } from './renderers/avatar/o-list-item-avatar.component';
import { OListItemCardImageComponent } from './renderers/card-image/o-list-item-card-image.component';
import { OListItemCardComponent } from './renderers/card/o-list-item-card.component';
import { OListItemTextComponent } from './renderers/text/o-list-item-text.component';
export class OListModule {
}
OListModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    OListComponent,
                    OListItemComponent,
                    OListItemAvatarComponent,
                    OListItemCardImageComponent,
                    OListItemCardComponent,
                    OListItemTextComponent
                ],
                imports: [CommonModule, OSearchInputModule, OSharedModule, RouterModule],
                exports: [
                    OListComponent,
                    OListItemComponent,
                    OListItemAvatarComponent,
                    OListItemCardImageComponent,
                    OListItemCardComponent,
                    OListItemTextComponent
                ],
                entryComponents: [MatCheckbox]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L28tbGlzdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDakYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBc0JyRixNQUFNLE9BQU8sV0FBVzs7O1lBcEJ2QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGNBQWM7b0JBQ2Qsa0JBQWtCO29CQUNsQix3QkFBd0I7b0JBQ3hCLDJCQUEyQjtvQkFDM0Isc0JBQXNCO29CQUN0QixzQkFBc0I7aUJBQ3ZCO2dCQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO2dCQUN4RSxPQUFPLEVBQUU7b0JBQ1AsY0FBYztvQkFDZCxrQkFBa0I7b0JBQ2xCLHdCQUF3QjtvQkFDeEIsMkJBQTJCO29CQUMzQixzQkFBc0I7b0JBQ3RCLHNCQUFzQjtpQkFDdkI7Z0JBQ0QsZUFBZSxFQUFFLENBQUMsV0FBVyxDQUFDO2FBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRDaGVja2JveCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPU2VhcmNoSW5wdXRNb2R1bGUgfSBmcm9tICcuLi9pbnB1dC9zZWFyY2gtaW5wdXQvby1zZWFyY2gtaW5wdXQubW9kdWxlJztcbmltcG9ydCB7IE9MaXN0SXRlbUNvbXBvbmVudCB9IGZyb20gJy4vbGlzdC1pdGVtL28tbGlzdC1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPTGlzdENvbXBvbmVudCB9IGZyb20gJy4vby1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPTGlzdEl0ZW1BdmF0YXJDb21wb25lbnQgfSBmcm9tICcuL3JlbmRlcmVycy9hdmF0YXIvby1saXN0LWl0ZW0tYXZhdGFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPTGlzdEl0ZW1DYXJkSW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL3JlbmRlcmVycy9jYXJkLWltYWdlL28tbGlzdC1pdGVtLWNhcmQtaW1hZ2UuY29tcG9uZW50JztcbmltcG9ydCB7IE9MaXN0SXRlbUNhcmRDb21wb25lbnQgfSBmcm9tICcuL3JlbmRlcmVycy9jYXJkL28tbGlzdC1pdGVtLWNhcmQuY29tcG9uZW50JztcbmltcG9ydCB7IE9MaXN0SXRlbVRleHRDb21wb25lbnQgfSBmcm9tICcuL3JlbmRlcmVycy90ZXh0L28tbGlzdC1pdGVtLXRleHQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgT0xpc3RDb21wb25lbnQsXG4gICAgT0xpc3RJdGVtQ29tcG9uZW50LFxuICAgIE9MaXN0SXRlbUF2YXRhckNvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1DYXJkSW1hZ2VDb21wb25lbnQsXG4gICAgT0xpc3RJdGVtQ2FyZENvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1UZXh0Q29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TZWFyY2hJbnB1dE1vZHVsZSwgT1NoYXJlZE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIE9MaXN0Q29tcG9uZW50LFxuICAgIE9MaXN0SXRlbUNvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1BdmF0YXJDb21wb25lbnQsXG4gICAgT0xpc3RJdGVtQ2FyZEltYWdlQ29tcG9uZW50LFxuICAgIE9MaXN0SXRlbUNhcmRDb21wb25lbnQsXG4gICAgT0xpc3RJdGVtVGV4dENvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtNYXRDaGVja2JveF1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RNb2R1bGUgeyB9XG4iXX0=