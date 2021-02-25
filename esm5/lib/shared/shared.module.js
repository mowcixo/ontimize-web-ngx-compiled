import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ONTIMIZE_DIRECTIVES } from '../config/o-directives';
import { ColumnsFilterPipe } from '../pipes/columns-filter.pipe';
import { OCurrencyPipe } from '../pipes/o-currency.pipe';
import { OIntegerPipe } from '../pipes/o-integer.pipe';
import { OMomentPipe } from '../pipes/o-moment.pipe';
import { OPercentPipe } from '../pipes/o-percentage.pipe';
import { ORealPipe } from '../pipes/o-real.pipe';
import { OTranslateModule } from '../pipes/o-translate.pipe';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { ODialogComponent } from './components/dialog/o-dialog.component';
import { Error403Component } from './components/error403/o-error-403.component';
import { OSnackBarComponent } from './components/snackbar/o-snackbar.component';
import { OErrorComponent } from './components/validation/o-error.component';
import { OValidatorComponent } from './components/validation/o-validator.component';
import { OCustomMaterialModule } from './material/custom.material.module';
import { OMatErrorModule } from './material/o-mat-error/o-mat-error.module';
var OSharedModule = (function () {
    function OSharedModule() {
    }
    OSharedModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        OTranslateModule,
                        FlexLayoutModule,
                        OCustomMaterialModule,
                        OMatErrorModule
                    ],
                    declarations: [
                        ColumnsFilterPipe,
                        OrderByPipe,
                        OIntegerPipe,
                        ORealPipe,
                        OMomentPipe,
                        OCurrencyPipe,
                        OPercentPipe,
                        ONTIMIZE_DIRECTIVES,
                        Error403Component,
                        ODialogComponent,
                        OErrorComponent,
                        OValidatorComponent,
                        OSnackBarComponent
                    ],
                    exports: [
                        FlexLayoutModule,
                        OMatErrorModule,
                        FormsModule,
                        ReactiveFormsModule,
                        OTranslateModule,
                        ColumnsFilterPipe,
                        OrderByPipe,
                        OIntegerPipe,
                        ORealPipe,
                        OMomentPipe,
                        OCurrencyPipe,
                        OPercentPipe,
                        ONTIMIZE_DIRECTIVES,
                        OCustomMaterialModule,
                        Error403Component,
                        OErrorComponent,
                        OValidatorComponent,
                        OSnackBarComponent
                    ],
                    entryComponents: [Error403Component]
                },] }
    ];
    return OSharedModule;
}());
export { OSharedModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL3NoYXJlZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzdELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDakQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUNwRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFNUU7SUFBQTtJQThDQSxDQUFDOztnQkE5Q0EsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGdCQUFnQjt3QkFDaEIsZ0JBQWdCO3dCQUNoQixxQkFBcUI7d0JBQ3JCLGVBQWU7cUJBQ2hCO29CQUNELFlBQVksRUFBRTt3QkFDWixpQkFBaUI7d0JBQ2pCLFdBQVc7d0JBQ1gsWUFBWTt3QkFDWixTQUFTO3dCQUNULFdBQVc7d0JBQ1gsYUFBYTt3QkFDYixZQUFZO3dCQUNaLG1CQUFtQjt3QkFDbkIsaUJBQWlCO3dCQUNqQixnQkFBZ0I7d0JBQ2hCLGVBQWU7d0JBQ2YsbUJBQW1CO3dCQUNuQixrQkFBa0I7cUJBQ25CO29CQUNELE9BQU8sRUFBRTt3QkFDUCxnQkFBZ0I7d0JBQ2hCLGVBQWU7d0JBQ2YsV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLGdCQUFnQjt3QkFDaEIsaUJBQWlCO3dCQUNqQixXQUFXO3dCQUNYLFlBQVk7d0JBQ1osU0FBUzt3QkFDVCxXQUFXO3dCQUNYLGFBQWE7d0JBQ2IsWUFBWTt3QkFDWixtQkFBbUI7d0JBQ25CLHFCQUFxQjt3QkFDckIsaUJBQWlCO3dCQUNqQixlQUFlO3dCQUNmLG1CQUFtQjt3QkFDbkIsa0JBQWtCO3FCQUNuQjtvQkFDRCxlQUFlLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDckM7O0lBRUQsb0JBQUM7Q0FBQSxBQTlDRCxJQThDQztTQURZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZsZXhMYXlvdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mbGV4LWxheW91dCc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgT05USU1JWkVfRElSRUNUSVZFUyB9IGZyb20gJy4uL2NvbmZpZy9vLWRpcmVjdGl2ZXMnO1xuaW1wb3J0IHsgQ29sdW1uc0ZpbHRlclBpcGUgfSBmcm9tICcuLi9waXBlcy9jb2x1bW5zLWZpbHRlci5waXBlJztcbmltcG9ydCB7IE9DdXJyZW5jeVBpcGUgfSBmcm9tICcuLi9waXBlcy9vLWN1cnJlbmN5LnBpcGUnO1xuaW1wb3J0IHsgT0ludGVnZXJQaXBlIH0gZnJvbSAnLi4vcGlwZXMvby1pbnRlZ2VyLnBpcGUnO1xuaW1wb3J0IHsgT01vbWVudFBpcGUgfSBmcm9tICcuLi9waXBlcy9vLW1vbWVudC5waXBlJztcbmltcG9ydCB7IE9QZXJjZW50UGlwZSB9IGZyb20gJy4uL3BpcGVzL28tcGVyY2VudGFnZS5waXBlJztcbmltcG9ydCB7IE9SZWFsUGlwZSB9IGZyb20gJy4uL3BpcGVzL28tcmVhbC5waXBlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVNb2R1bGUgfSBmcm9tICcuLi9waXBlcy9vLXRyYW5zbGF0ZS5waXBlJztcbmltcG9ydCB7IE9yZGVyQnlQaXBlIH0gZnJvbSAnLi4vcGlwZXMvb3JkZXItYnkucGlwZSc7XG5pbXBvcnQgeyBPRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2RpYWxvZy9vLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgRXJyb3I0MDNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZXJyb3I0MDMvby1lcnJvci00MDMuY29tcG9uZW50JztcbmltcG9ydCB7IE9TbmFja0JhckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zbmFja2Jhci9vLXNuYWNrYmFyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRXJyb3JDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdmFsaWRhdGlvbi9vLWVycm9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVmFsaWRhdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ZhbGlkYXRpb24vby12YWxpZGF0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IE9DdXN0b21NYXRlcmlhbE1vZHVsZSB9IGZyb20gJy4vbWF0ZXJpYWwvY3VzdG9tLm1hdGVyaWFsLm1vZHVsZSc7XG5pbXBvcnQgeyBPTWF0RXJyb3JNb2R1bGUgfSBmcm9tICcuL21hdGVyaWFsL28tbWF0LWVycm9yL28tbWF0LWVycm9yLm1vZHVsZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgT1RyYW5zbGF0ZU1vZHVsZSxcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxuICAgIE9DdXN0b21NYXRlcmlhbE1vZHVsZSxcbiAgICBPTWF0RXJyb3JNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ29sdW1uc0ZpbHRlclBpcGUsXG4gICAgT3JkZXJCeVBpcGUsXG4gICAgT0ludGVnZXJQaXBlLFxuICAgIE9SZWFsUGlwZSxcbiAgICBPTW9tZW50UGlwZSxcbiAgICBPQ3VycmVuY3lQaXBlLFxuICAgIE9QZXJjZW50UGlwZSxcbiAgICBPTlRJTUlaRV9ESVJFQ1RJVkVTLFxuICAgIEVycm9yNDAzQ29tcG9uZW50LFxuICAgIE9EaWFsb2dDb21wb25lbnQsXG4gICAgT0Vycm9yQ29tcG9uZW50LFxuICAgIE9WYWxpZGF0b3JDb21wb25lbnQsXG4gICAgT1NuYWNrQmFyQ29tcG9uZW50XG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBGbGV4TGF5b3V0TW9kdWxlLFxuICAgIE9NYXRFcnJvck1vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIE9UcmFuc2xhdGVNb2R1bGUsXG4gICAgQ29sdW1uc0ZpbHRlclBpcGUsXG4gICAgT3JkZXJCeVBpcGUsXG4gICAgT0ludGVnZXJQaXBlLFxuICAgIE9SZWFsUGlwZSxcbiAgICBPTW9tZW50UGlwZSxcbiAgICBPQ3VycmVuY3lQaXBlLFxuICAgIE9QZXJjZW50UGlwZSxcbiAgICBPTlRJTUlaRV9ESVJFQ1RJVkVTLFxuICAgIE9DdXN0b21NYXRlcmlhbE1vZHVsZSxcbiAgICBFcnJvcjQwM0NvbXBvbmVudCxcbiAgICBPRXJyb3JDb21wb25lbnQsXG4gICAgT1ZhbGlkYXRvckNvbXBvbmVudCxcbiAgICBPU25hY2tCYXJDb21wb25lbnRcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbRXJyb3I0MDNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9TaGFyZWRNb2R1bGUge1xufVxuIl19