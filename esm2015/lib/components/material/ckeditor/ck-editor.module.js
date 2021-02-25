import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CKEditorComponent } from './ck-editor.component';
export class CKEditorModule {
}
CKEditorModule.decorators = [
    { type: NgModule, args: [{
                exports: [
                    FormsModule,
                    CKEditorComponent
                ],
                declarations: [CKEditorComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2stZWRpdG9yLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9tYXRlcmlhbC9ja2VkaXRvci9jay1lZGl0b3IubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTdDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBUzFELE1BQU0sT0FBTyxjQUFjOzs7WUFQMUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxXQUFXO29CQUNYLGlCQUFpQjtpQkFDbEI7Z0JBQ0QsWUFBWSxFQUFFLENBQUMsaUJBQWlCLENBQUM7YUFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IENLRWRpdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jay1lZGl0b3IuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW1xuICAgIEZvcm1zTW9kdWxlLFxuICAgIENLRWRpdG9yQ29tcG9uZW50XG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0NLRWRpdG9yQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBDS0VkaXRvck1vZHVsZSB7IH1cbiJdfQ==