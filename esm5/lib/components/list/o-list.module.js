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
var OListModule = (function () {
    function OListModule() {
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
    return OListModule;
}());
export { OListModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9saXN0L28tbGlzdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDakYsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3BELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzNGLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRXJGO0lBQUE7SUFvQjJCLENBQUM7O2dCQXBCM0IsUUFBUSxTQUFDO29CQUNSLFlBQVksRUFBRTt3QkFDWixjQUFjO3dCQUNkLGtCQUFrQjt3QkFDbEIsd0JBQXdCO3dCQUN4QiwyQkFBMkI7d0JBQzNCLHNCQUFzQjt3QkFDdEIsc0JBQXNCO3FCQUN2QjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDeEUsT0FBTyxFQUFFO3dCQUNQLGNBQWM7d0JBQ2Qsa0JBQWtCO3dCQUNsQix3QkFBd0I7d0JBQ3hCLDJCQUEyQjt3QkFDM0Isc0JBQXNCO3dCQUN0QixzQkFBc0I7cUJBQ3ZCO29CQUNELGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDL0I7O0lBQzBCLGtCQUFDO0NBQUEsQUFwQjVCLElBb0I0QjtTQUFmLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdENoZWNrYm94IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9TZWFyY2hJbnB1dE1vZHVsZSB9IGZyb20gJy4uL2lucHV0L3NlYXJjaC1pbnB1dC9vLXNlYXJjaC1pbnB1dC5tb2R1bGUnO1xuaW1wb3J0IHsgT0xpc3RJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9saXN0LWl0ZW0vby1saXN0LWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE9MaXN0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWxpc3QuY29tcG9uZW50JztcbmltcG9ydCB7IE9MaXN0SXRlbUF2YXRhckNvbXBvbmVudCB9IGZyb20gJy4vcmVuZGVyZXJzL2F2YXRhci9vLWxpc3QtaXRlbS1hdmF0YXIuY29tcG9uZW50JztcbmltcG9ydCB7IE9MaXN0SXRlbUNhcmRJbWFnZUNvbXBvbmVudCB9IGZyb20gJy4vcmVuZGVyZXJzL2NhcmQtaW1hZ2Uvby1saXN0LWl0ZW0tY2FyZC1pbWFnZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0xpc3RJdGVtQ2FyZENvbXBvbmVudCB9IGZyb20gJy4vcmVuZGVyZXJzL2NhcmQvby1saXN0LWl0ZW0tY2FyZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0xpc3RJdGVtVGV4dENvbXBvbmVudCB9IGZyb20gJy4vcmVuZGVyZXJzL3RleHQvby1saXN0LWl0ZW0tdGV4dC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBPTGlzdENvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1Db21wb25lbnQsXG4gICAgT0xpc3RJdGVtQXZhdGFyQ29tcG9uZW50LFxuICAgIE9MaXN0SXRlbUNhcmRJbWFnZUNvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1DYXJkQ29tcG9uZW50LFxuICAgIE9MaXN0SXRlbVRleHRDb21wb25lbnRcbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT1NlYXJjaElucHV0TW9kdWxlLCBPU2hhcmVkTW9kdWxlLCBSb3V0ZXJNb2R1bGVdLFxuICBleHBvcnRzOiBbXG4gICAgT0xpc3RDb21wb25lbnQsXG4gICAgT0xpc3RJdGVtQ29tcG9uZW50LFxuICAgIE9MaXN0SXRlbUF2YXRhckNvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1DYXJkSW1hZ2VDb21wb25lbnQsXG4gICAgT0xpc3RJdGVtQ2FyZENvbXBvbmVudCxcbiAgICBPTGlzdEl0ZW1UZXh0Q29tcG9uZW50XG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW01hdENoZWNrYm94XVxufSlcbmV4cG9ydCBjbGFzcyBPTGlzdE1vZHVsZSB7IH1cbiJdfQ==