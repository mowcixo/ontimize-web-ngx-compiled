import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.module';
import { OUserInfoModule } from '../user-info/o-user-info.module';
import { OAppHeaderComponent } from './o-app-header.component';
export class OAppHeaderModule {
}
OAppHeaderModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, OLanguageSelectorModule, OUserInfoModule, OSharedModule],
                declarations: [OAppHeaderComponent],
                exports: [OAppHeaderComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtaGVhZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9hcHAtaGVhZGVyL28tYXBwLWhlYWRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQU8vRCxNQUFNLE9BQU8sZ0JBQWdCOzs7WUFMNUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSx1QkFBdUIsRUFBRSxlQUFlLEVBQUUsYUFBYSxDQUFDO2dCQUNoRixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9MYW5ndWFnZVNlbGVjdG9yTW9kdWxlIH0gZnJvbSAnLi4vbGFuZ3VhZ2Utc2VsZWN0b3Ivby1sYW5ndWFnZS1zZWxlY3Rvci5tb2R1bGUnO1xuaW1wb3J0IHsgT1VzZXJJbmZvTW9kdWxlIH0gZnJvbSAnLi4vdXNlci1pbmZvL28tdXNlci1pbmZvLm1vZHVsZSc7XG5pbXBvcnQgeyBPQXBwSGVhZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9vLWFwcC1oZWFkZXIuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgT0xhbmd1YWdlU2VsZWN0b3JNb2R1bGUsIE9Vc2VySW5mb01vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGRlY2xhcmF0aW9uczogW09BcHBIZWFkZXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbT0FwcEhlYWRlckNvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0FwcEhlYWRlck1vZHVsZSB7IH1cbiJdfQ==