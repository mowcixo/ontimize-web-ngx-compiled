import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../shared/shared.module';
import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';
import { OImageComponent } from './o-image.component';
export class OImageModule {
}
OImageModule.decorators = [
    { type: NgModule, args: [{
                declarations: [OImageComponent, OFullScreenDialogComponent],
                imports: [CommonModule, OSharedModule],
                exports: [OImageComponent, OFullScreenDialogComponent],
                entryComponents: [OFullScreenDialogComponent]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1pbWFnZS5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2Uvby1pbWFnZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzNELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQVF0RCxNQUFNLE9BQU8sWUFBWTs7O1lBTnhCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsMEJBQTBCLENBQUM7Z0JBQzNELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUM7Z0JBQ3RDLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSwwQkFBMEIsQ0FBQztnQkFDdEQsZUFBZSxFQUFFLENBQUMsMEJBQTBCLENBQUM7YUFDOUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50IH0gZnJvbSAnLi9mdWxsc2NyZWVuL2Z1bGxzY3JlZW4tZGlhbG9nLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPSW1hZ2VDb21wb25lbnQgfSBmcm9tICcuL28taW1hZ2UuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbT0ltYWdlQ29tcG9uZW50LCBPRnVsbFNjcmVlbkRpYWxvZ0NvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGVdLFxuICBleHBvcnRzOiBbT0ltYWdlQ29tcG9uZW50LCBPRnVsbFNjcmVlbkRpYWxvZ0NvbXBvbmVudF0sXG4gIGVudHJ5Q29tcG9uZW50czogW09GdWxsU2NyZWVuRGlhbG9nQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBPSW1hZ2VNb2R1bGUgeyB9XG4iXX0=