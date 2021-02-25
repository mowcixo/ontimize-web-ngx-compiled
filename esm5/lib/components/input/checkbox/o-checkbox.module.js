import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OSharedModule } from '../../../shared/shared.module';
import { OCheckboxComponent } from './o-checkbox.component';
var OCheckboxModule = (function () {
    function OCheckboxModule() {
    }
    OCheckboxModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [OCheckboxComponent],
                    imports: [CommonModule, OSharedModule],
                    exports: [OCheckboxComponent]
                },] }
    ];
    return OCheckboxModule;
}());
export { OCheckboxModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jaGVja2JveC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvY2hlY2tib3gvby1jaGVja2JveC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQzlELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTVEO0lBQUE7SUFLK0IsQ0FBQzs7Z0JBTC9CLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztvQkFDbEMsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLENBQUMsa0JBQWtCLENBQUM7aUJBQzlCOztJQUM4QixzQkFBQztDQUFBLEFBTGhDLElBS2dDO1NBQW5CLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1NoYXJlZE1vZHVsZSB9IGZyb20gJy4uLy4uLy4uL3NoYXJlZC9zaGFyZWQubW9kdWxlJztcbmltcG9ydCB7IE9DaGVja2JveENvbXBvbmVudCB9IGZyb20gJy4vby1jaGVja2JveC5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtPQ2hlY2tib3hDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBPU2hhcmVkTW9kdWxlXSxcbiAgZXhwb3J0czogW09DaGVja2JveENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgT0NoZWNrYm94TW9kdWxlIHsgfVxuIl19