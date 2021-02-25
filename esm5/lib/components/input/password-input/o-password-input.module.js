import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OPasswordInputComponent } from './o-password-input.component';
var OPasswordInputModule = (function () {
    function OPasswordInputModule() {
    }
    OPasswordInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OPasswordInputComponent],
                    imports: [OSharedModule, CommonModule, OTextInputModule],
                    exports: [OPasswordInputComponent]
                },] }
    ];
    return OPasswordInputModule;
}());
export { OPasswordInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1wYXNzd29yZC1pbnB1dC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvcGFzc3dvcmQtaW5wdXQvby1wYXNzd29yZC1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFO0lBQUE7SUFNQSxDQUFDOztnQkFOQSxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsdUJBQXVCLENBQUM7b0JBQ3ZDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLENBQUM7b0JBQ3hELE9BQU8sRUFBRSxDQUFDLHVCQUF1QixDQUFDO2lCQUNuQzs7SUFFRCwyQkFBQztDQUFBLEFBTkQsSUFNQztTQURZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1RleHRJbnB1dE1vZHVsZSB9IGZyb20gJy4uL3RleHQtaW5wdXQvby10ZXh0LWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPUGFzc3dvcmRJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vby1wYXNzd29yZC1pbnB1dC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPUGFzc3dvcmRJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtPU2hhcmVkTW9kdWxlLCBDb21tb25Nb2R1bGUsIE9UZXh0SW5wdXRNb2R1bGVdLFxuICBleHBvcnRzOiBbT1Bhc3N3b3JkSW5wdXRDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9QYXNzd29yZElucHV0TW9kdWxlIHtcbn1cbiJdfQ==