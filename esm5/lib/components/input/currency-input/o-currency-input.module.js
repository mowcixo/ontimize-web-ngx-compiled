import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { ORealInputModule } from '../real-input/o-real-input.module';
import { OCurrencyInputComponent } from './o-currency-input.component';
var OCurrencyInputModule = (function () {
    function OCurrencyInputModule() {
    }
    OCurrencyInputModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OCurrencyInputComponent],
                    imports: [CommonModule, OSharedModule, ORealInputModule],
                    exports: [OCurrencyInputComponent]
                },] }
    ];
    return OCurrencyInputModule;
}());
export { OCurrencyInputModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jdXJyZW5jeS1pbnB1dC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY3VycmVuY3ktaW5wdXQvby1jdXJyZW5jeS1pbnB1dC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXZFO0lBQUE7SUFLb0MsQ0FBQzs7Z0JBTHBDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQztvQkFDeEQsT0FBTyxFQUFFLENBQUMsdUJBQXVCLENBQUM7aUJBQ25DOztJQUNtQywyQkFBQztDQUFBLEFBTHJDLElBS3FDO1NBQXhCLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPU2hhcmVkTW9kdWxlIH0gZnJvbSAnLi4vLi4vLi4vc2hhcmVkL3NoYXJlZC5tb2R1bGUnO1xuaW1wb3J0IHsgT1JlYWxJbnB1dE1vZHVsZSB9IGZyb20gJy4uL3JlYWwtaW5wdXQvby1yZWFsLWlucHV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBPQ3VycmVuY3lJbnB1dENvbXBvbmVudCB9IGZyb20gJy4vby1jdXJyZW5jeS1pbnB1dC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPQ3VycmVuY3lJbnB1dENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIE9TaGFyZWRNb2R1bGUsIE9SZWFsSW5wdXRNb2R1bGVdLFxuICBleHBvcnRzOiBbT0N1cnJlbmN5SW5wdXRDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE9DdXJyZW5jeUlucHV0TW9kdWxlIHsgfVxuIl19