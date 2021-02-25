import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MAT_DATE_FORMATS, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { OntimizeMatIconRegistry } from '../../services/ontimize-icon-registry.service';
import { dateFormatFactory } from './date/mat-date-formats.factory';
var MATERIAL_MODULES = [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatMomentDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    OverlayModule
];
var ɵ0 = dateFormatFactory;
var OCustomMaterialModule = (function () {
    function OCustomMaterialModule() {
    }
    OCustomMaterialModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    exports: MATERIAL_MODULES,
                    providers: [
                        {
                            provide: MAT_DATE_FORMATS,
                            useFactory: ɵ0
                        }, {
                            provide: OntimizeMatIconRegistry,
                            useClass: OntimizeMatIconRegistry
                        }
                    ]
                },] }
    ];
    return OCustomMaterialModule;
}());
export { OCustomMaterialModule };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLm1hdGVyaWFsLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2hhcmVkL21hdGVyaWFsL2N1c3RvbS5tYXRlcmlhbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIscUJBQXFCLEVBQ3JCLGVBQWUsRUFDZixxQkFBcUIsRUFDckIsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsbUJBQW1CLEVBQ25CLGVBQWUsRUFDZixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUNqQixhQUFhLEVBQ2IsY0FBYyxFQUNkLGFBQWEsRUFDYixhQUFhLEVBQ2Isa0JBQWtCLEVBQ2xCLG9CQUFvQixFQUNwQix3QkFBd0IsRUFDeEIsY0FBYyxFQUNkLGVBQWUsRUFDZixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGVBQWUsRUFDZixvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLGFBQWEsRUFDYixjQUFjLEVBQ2QsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FDakIsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUV2RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwrQ0FBK0MsQ0FBQztBQUN4RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUVwRSxJQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLHFCQUFxQjtJQUNyQixlQUFlO0lBQ2YscUJBQXFCO0lBQ3JCLGFBQWE7SUFDYixjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLG1CQUFtQjtJQUNuQixlQUFlO0lBQ2Ysa0JBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2IsYUFBYTtJQUNiLG9CQUFvQjtJQUNwQix3QkFBd0I7SUFDeEIsY0FBYztJQUNkLGVBQWU7SUFDZixlQUFlO0lBQ2YsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixvQkFBb0I7SUFDcEIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLGFBQWE7SUFDYixhQUFhO0NBU2QsQ0FBQztTQWVjLGlCQUFpQjtBQWJqQztJQUFBO0lBbUJxQyxDQUFDOztnQkFuQnJDLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxPQUFPLEVBQUUsZ0JBQWdCO29CQUN6QixTQUFTLEVBQUU7d0JBTVY7NEJBQ0MsT0FBTyxFQUFFLGdCQUFnQjs0QkFDekIsVUFBVSxJQUFtQjt5QkFDOUIsRUFBRTs0QkFDRCxPQUFPLEVBQUUsdUJBQXVCOzRCQUNoQyxRQUFRLEVBQUUsdUJBQXVCO3lCQUNsQztxQkFBQztpQkFDSDs7SUFDb0MsNEJBQUM7Q0FBQSxBQW5CdEMsSUFtQnNDO1NBQXpCLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE92ZXJsYXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1BVF9EQVRFX0ZPUk1BVFMsXG4gIE1hdEF1dG9jb21wbGV0ZU1vZHVsZSxcbiAgTWF0QnV0dG9uTW9kdWxlLFxuICBNYXRCdXR0b25Ub2dnbGVNb2R1bGUsXG4gIE1hdENhcmRNb2R1bGUsXG4gIE1hdENoZWNrYm94TW9kdWxlLFxuICBNYXRDaGlwc01vZHVsZSxcbiAgTWF0RGF0ZXBpY2tlck1vZHVsZSxcbiAgTWF0RGlhbG9nTW9kdWxlLFxuICBNYXRFeHBhbnNpb25Nb2R1bGUsXG4gIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgTWF0R3JpZExpc3RNb2R1bGUsXG4gIE1hdEljb25Nb2R1bGUsXG4gIE1hdElucHV0TW9kdWxlLFxuICBNYXRMaXN0TW9kdWxlLFxuICBNYXRNZW51TW9kdWxlLFxuICBNYXRQYWdpbmF0b3JNb2R1bGUsXG4gIE1hdFByb2dyZXNzQmFyTW9kdWxlLFxuICBNYXRQcm9ncmVzc1NwaW5uZXJNb2R1bGUsXG4gIE1hdFJhZGlvTW9kdWxlLFxuICBNYXRSaXBwbGVNb2R1bGUsXG4gIE1hdFNlbGVjdE1vZHVsZSxcbiAgTWF0U2lkZW5hdk1vZHVsZSxcbiAgTWF0U2xpZGVyTW9kdWxlLFxuICBNYXRTbGlkZVRvZ2dsZU1vZHVsZSxcbiAgTWF0U25hY2tCYXJNb2R1bGUsXG4gIE1hdFNvcnRNb2R1bGUsXG4gIE1hdFRhYmxlTW9kdWxlLFxuICBNYXRUYWJzTW9kdWxlLFxuICBNYXRUb29sYmFyTW9kdWxlLFxuICBNYXRUb29sdGlwTW9kdWxlLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBNYXRNb21lbnREYXRlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwtbW9tZW50LWFkYXB0ZXInO1xuXG5pbXBvcnQgeyBPbnRpbWl6ZU1hdEljb25SZWdpc3RyeSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL29udGltaXplLWljb24tcmVnaXN0cnkuc2VydmljZSc7XG5pbXBvcnQgeyBkYXRlRm9ybWF0RmFjdG9yeSB9IGZyb20gJy4vZGF0ZS9tYXQtZGF0ZS1mb3JtYXRzLmZhY3RvcnknO1xuXG5jb25zdCBNQVRFUklBTF9NT0RVTEVTID0gW1xuICBNYXRBdXRvY29tcGxldGVNb2R1bGUsXG4gIE1hdEJ1dHRvbk1vZHVsZSxcbiAgTWF0QnV0dG9uVG9nZ2xlTW9kdWxlLFxuICBNYXRDYXJkTW9kdWxlLFxuICBNYXRDaGlwc01vZHVsZSxcbiAgTWF0Q2hlY2tib3hNb2R1bGUsXG4gIE1hdERhdGVwaWNrZXJNb2R1bGUsXG4gIE1hdERpYWxvZ01vZHVsZSxcbiAgTWF0RXhwYW5zaW9uTW9kdWxlLFxuICBNYXRHcmlkTGlzdE1vZHVsZSxcbiAgTWF0SWNvbk1vZHVsZSxcbiAgTWF0SW5wdXRNb2R1bGUsXG4gIE1hdEZvcm1GaWVsZE1vZHVsZSxcbiAgTWF0TGlzdE1vZHVsZSxcbiAgTWF0TWVudU1vZHVsZSxcbiAgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsXG4gIE1hdFByb2dyZXNzU3Bpbm5lck1vZHVsZSxcbiAgTWF0UmFkaW9Nb2R1bGUsXG4gIE1hdFJpcHBsZU1vZHVsZSxcbiAgTWF0U2VsZWN0TW9kdWxlLFxuICBNYXRTaWRlbmF2TW9kdWxlLFxuICBNYXRTbGlkZXJNb2R1bGUsXG4gIE1hdFNsaWRlVG9nZ2xlTW9kdWxlLFxuICBNYXRTbmFja0Jhck1vZHVsZSxcbiAgTWF0VGFic01vZHVsZSxcbiAgTWF0VG9vbGJhck1vZHVsZSxcbiAgTWF0VG9vbHRpcE1vZHVsZSxcbiAgTWF0TW9tZW50RGF0ZU1vZHVsZSxcbiAgTWF0VGFibGVNb2R1bGUsXG4gIE1hdFBhZ2luYXRvck1vZHVsZSxcbiAgTWF0U29ydE1vZHVsZSxcbiAgT3ZlcmxheU1vZHVsZVxuICAvLyBPdmVybGF5TW9kdWxlLFxuICAvLyBQb3J0YWxNb2R1bGUsXG4gIC8vIFJ0bE1vZHVsZSxcbiAgLy8gU3R5bGVNb2R1bGUsXG4gIC8vIEExMXlNb2R1bGUsXG4gIC8vIFBsYXRmb3JtTW9kdWxlLFxuICAvLyBNYXRDb21tb25Nb2R1bGUsXG4gIC8vIE9ic2VydmVDb250ZW50TW9kdWxlXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IE1BVEVSSUFMX01PRFVMRVMsXG4gIHByb3ZpZGVyczogW1xuICAvLyAgIHtcbiAgLy8gICBwcm92aWRlOiBEYXRlQWRhcHRlcixcbiAgLy8gICB1c2VDbGFzczogT250aW1pemVNb21lbnREYXRlQWRhcHRlcixcbiAgLy8gICBkZXBzOiBbTUFUX0RBVEVfTE9DQUxFXVxuICAvLyB9LFxuICAge1xuICAgIHByb3ZpZGU6IE1BVF9EQVRFX0ZPUk1BVFMsXG4gICAgdXNlRmFjdG9yeTogZGF0ZUZvcm1hdEZhY3RvcnlcbiAgfSwge1xuICAgIHByb3ZpZGU6IE9udGltaXplTWF0SWNvblJlZ2lzdHJ5LFxuICAgIHVzZUNsYXNzOiBPbnRpbWl6ZU1hdEljb25SZWdpc3RyeVxuICB9XVxufSlcbmV4cG9ydCBjbGFzcyBPQ3VzdG9tTWF0ZXJpYWxNb2R1bGUgeyB9XG4iXX0=