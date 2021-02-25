import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';
import { OImageComponent } from './o-image.component';
var OImageModule = (function () {
    function OImageModule() {
    }
    OImageModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OImageComponent, OFullScreenDialogComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OImageComponent, OFullScreenDialogComponent],
                    entryComponents: [OFullScreenDialogComponent]
                },] }
    ];
    return OImageModule;
}());
export { OImageModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbWFnZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2Uvby1pbWFnZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUV0RDtJQUFBO0lBTTRCLENBQUM7O2dCQU41QixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLDBCQUEwQixDQUFDO29CQUMzRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUN0QyxPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUUsMEJBQTBCLENBQUM7b0JBQ3RELGVBQWUsRUFBRSxDQUFDLDBCQUEwQixDQUFDO2lCQUM5Qzs7SUFDMkIsbUJBQUM7Q0FBQSxBQU43QixJQU02QjtTQUFoQixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9TaGFyZWRNb2R1bGUgfSBmcm9tICcuLi8uLi9zaGFyZWQvc2hhcmVkLm1vZHVsZSc7XG5pbXBvcnQgeyBPRnVsbFNjcmVlbkRpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4vZnVsbHNjcmVlbi9mdWxsc2NyZWVuLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0ltYWdlQ29tcG9uZW50IH0gZnJvbSAnLi9vLWltYWdlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW09JbWFnZUNvbXBvbmVudCwgT0Z1bGxTY3JlZW5EaWFsb2dDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09JbWFnZUNvbXBvbmVudCwgT0Z1bGxTY3JlZW5EaWFsb2dDb21wb25lbnRdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtPRnVsbFNjcmVlbkRpYWxvZ0NvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0ltYWdlTW9kdWxlIHsgfVxuIl19