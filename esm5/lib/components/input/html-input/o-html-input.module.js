import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { CKEditorModule } from '../../material/ckeditor/ck-editor.module';
import { OHTMLInputComponent } from './o-html-input.component';
var OHTMLInputModule = (function () {
    function OHTMLInputModule() {
    }
    OHTMLInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OHTMLInputComponent],
                    imports: [CKEditorModule, CommonModule, OSharedModule],
                    exports: [OHTMLInputComponent]
                },] }
    ];
    return OHTMLInputModule;
}());
export { OHTMLInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1odG1sLWlucHV0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9odG1sLWlucHV0L28taHRtbC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvRDtJQUFBO0lBS2dDLENBQUM7O2dCQUxoQyxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7b0JBQ25DLE9BQU8sRUFBRSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUN0RCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztpQkFDL0I7O0lBQytCLHVCQUFDO0NBQUEsQUFMakMsSUFLaUM7U0FBcEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBDS0VkaXRvck1vZHVsZSB9IGZyb20gJy4uLy4uL21hdGVyaWFsL2NrZWRpdG9yL2NrLWVkaXRvci5tb2R1bGUnO1xuaW1wb3J0IHsgT0hUTUxJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vby1odG1sLWlucHV0LmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09IVE1MSW5wdXRDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ0tFZGl0b3JNb2R1bGUsIENvbW1vbk1vZHVsZSwgT1NoYXJlZE1vZHVsZV0sXG4gIGV4cG9ydHM6IFtPSFRNTElucHV0Q29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPSFRNTElucHV0TW9kdWxlIHsgfVxuIl19