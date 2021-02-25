import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OButtonToggleGroupComponent } from './o-button-toggle-group/o-button-toggle-group.component';
import { OButtonToggleComponent } from './o-button-toggle.component';
export class OButtonToggleModule {
}
OButtonToggleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    OButtonToggleComponent,
                    OButtonToggleGroupComponent
                ],
                imports: [
                    CommonModule,
                    OSharedModule
                ],
                exports: [
                    OButtonToggleComponent,
                    OButtonToggleGroupComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1idXR0b24tdG9nZ2xlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9idXR0b24tdG9nZ2xlL28tYnV0dG9uLXRvZ2dsZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLHlEQUF5RCxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBZ0JyRSxNQUFNLE9BQU8sbUJBQW1COzs7WUFkL0IsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixzQkFBc0I7b0JBQ3RCLDJCQUEyQjtpQkFDNUI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osYUFBYTtpQkFDZDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1Asc0JBQXNCO29CQUN0QiwyQkFBMkI7aUJBQzVCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9CdXR0b25Ub2dnbGVHcm91cENvbXBvbmVudCB9IGZyb20gJy4vby1idXR0b24tdG9nZ2xlLWdyb3VwL28tYnV0dG9uLXRvZ2dsZS1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0J1dHRvblRvZ2dsZUNvbXBvbmVudCB9IGZyb20gJy4vby1idXR0b24tdG9nZ2xlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIE9CdXR0b25Ub2dnbGVDb21wb25lbnQsXG4gICAgT0J1dHRvblRvZ2dsZUdyb3VwQ29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgT1NoYXJlZE1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgT0J1dHRvblRvZ2dsZUNvbXBvbmVudCxcbiAgICBPQnV0dG9uVG9nZ2xlR3JvdXBDb21wb25lbnRcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPQnV0dG9uVG9nZ2xlTW9kdWxlIHsgfVxuIl19