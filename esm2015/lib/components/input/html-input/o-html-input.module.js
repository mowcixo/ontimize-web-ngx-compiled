import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { CKEditorModule } from '../../material/ckeditor/ck-editor.module';
import { OHTMLInputComponent } from './o-html-input.component';
export class OHTMLInputModule {
}
OHTMLInputModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OHTMLInputComponent],
                imports: [CKEditorModule, CommonModule, OSharedModule],
                exports: [OHTMLInputComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1odG1sLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9odG1sLWlucHV0L28taHRtbC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQU8vRCxNQUFNLE9BQU8sZ0JBQWdCOzs7WUFMNUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUNuQyxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQztnQkFDdEQsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7YUFDL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IENLRWRpdG9yTW9kdWxlIH0gZnJvbSAnLi4vLi4vbWF0ZXJpYWwvY2tlZGl0b3IvY2stZWRpdG9yLm1vZHVsZSc7XG5pbXBvcnQgeyBPSFRNTElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi9vLWh0bWwtaW5wdXQuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT0hUTUxJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDS0VkaXRvck1vZHVsZSwgQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09IVE1MSW5wdXRDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9IVE1MSW5wdXRNb2R1bGUgeyB9XG4iXX0=