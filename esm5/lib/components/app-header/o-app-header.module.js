import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OLanguageSelectorModule } from '../language-selector/o-language-selector.module';
import { OUserInfoModule } from '../user-info/o-user-info.module';
import { OAppHeaderComponent } from './o-app-header.component';
var OAppHeaderModule = (function () {
    function OAppHeaderModule() {
    }
    OAppHeaderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, OLanguageSelectorModule, OUserInfoModule, OSharedModule],
                    declarations: [OAppHeaderComponent],
                    exports: [OAppHeaderComponent]
                },] }
    ];
    return OAppHeaderModule;
}());
export { OAppHeaderModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1hcHAtaGVhZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9hcHAtaGVhZGVyL28tYXBwLWhlYWRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvRDtJQUFBO0lBS2dDLENBQUM7O2dCQUxoQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLHVCQUF1QixFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUM7b0JBQ2hGLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDO29CQUNuQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDL0I7O0lBQytCLHVCQUFDO0NBQUEsQUFMakMsSUFLaUM7U0FBcEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPTGFuZ3VhZ2VTZWxlY3Rvck1vZHVsZSB9IGZyb20gJy4uL2xhbmd1YWdlLXNlbGVjdG9yL28tbGFuZ3VhZ2Utc2VsZWN0b3IubW9kdWxlJztcbmltcG9ydCB7IE9Vc2VySW5mb01vZHVsZSB9IGZyb20gJy4uL3VzZXItaW5mby9vLXVzZXItaW5mby5tb2R1bGUnO1xuaW1wb3J0IHsgT0FwcEhlYWRlckNvbXBvbmVudCB9IGZyb20gJy4vby1hcHAtaGVhZGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9MYW5ndWFnZVNlbGVjdG9yTW9kdWxlLCBPVXNlckluZm9Nb2R1bGUsIE9TaGFyZWRNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtPQXBwSGVhZGVyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW09BcHBIZWFkZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9BcHBIZWFkZXJNb2R1bGUgeyB9XG4iXX0=