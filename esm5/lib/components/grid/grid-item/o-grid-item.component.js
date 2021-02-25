import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, TemplateRef, ViewChild, } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { ObservableWrapper } from '../../../util/async';
export var DEFAULT_INPUTS_O_GRID_ITEM = [
    'colspan',
    'rowspan'
];
var OGridItemComponent = (function () {
    function OGridItemComponent(_el) {
        this._el = _el;
        this.mdClick = new EventEmitter();
        this.mdDoubleClick = new EventEmitter();
        this.colspan = 1;
        this.rowspan = 1;
    }
    OGridItemComponent.prototype.onItemClicked = function (e) {
        ObservableWrapper.callEmit(this.mdClick, this);
    };
    OGridItemComponent.prototype.onItemDoubleClicked = function (e) {
        ObservableWrapper.callEmit(this.mdDoubleClick, this);
    };
    OGridItemComponent.prototype.onClick = function (onNext) {
        return ObservableWrapper.subscribe(this.mdClick, onNext);
    };
    OGridItemComponent.prototype.onDoubleClick = function (onNext) {
        return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
    };
    OGridItemComponent.prototype.setItemData = function (data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    };
    OGridItemComponent.prototype.getItemData = function () {
        return this.modelData;
    };
    OGridItemComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-grid-item',
                    template: "<ng-template #templateref>\n  <ng-content></ng-content>\n</ng-template>",
                    inputs: DEFAULT_INPUTS_O_GRID_ITEM,
                    host: {
                        '[class.o-grid-item]': 'true',
                        '(click)': 'onItemClicked($event)',
                        '(dblclick)': 'onItemDoubleClicked($event)'
                    }
                }] }
    ];
    OGridItemComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    OGridItemComponent.propDecorators = {
        template: [{ type: ViewChild, args: [TemplateRef, { static: false },] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OGridItemComponent.prototype, "colspan", void 0);
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Number)
    ], OGridItemComponent.prototype, "rowspan", void 0);
    return OGridItemComponent;
}());
export { OGridItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2dyaWQvZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBR3hELE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixHQUFHO0lBQ3hDLFNBQVM7SUFDVCxTQUFTO0NBQ1YsQ0FBQztBQUVGO0lBdUJFLDRCQUFtQixHQUFlO1FBQWYsUUFBRyxHQUFILEdBQUcsQ0FBWTtRQVRsQyxZQUFPLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEQsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUl0RCxZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBRXBCLFlBQU8sR0FBVyxDQUFDLENBQUM7SUFFa0IsQ0FBQztJQUV2QywwQ0FBYSxHQUFiLFVBQWMsQ0FBUztRQUNyQixpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsZ0RBQW1CLEdBQW5CLFVBQW9CLENBQVM7UUFDM0IsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLG9DQUFPLEdBQWQsVUFBZSxNQUEwQztRQUN2RCxPQUFPLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSwwQ0FBYSxHQUFwQixVQUFxQixNQUEwQztRQUM3RCxPQUFPLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCx3Q0FBVyxHQUFYLFVBQVksSUFBWTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCx3Q0FBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7O2dCQWpERixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLG1GQUEyQztvQkFDM0MsTUFBTSxFQUFFLDBCQUEwQjtvQkFDbEMsSUFBSSxFQUFFO3dCQUNKLHFCQUFxQixFQUFFLE1BQU07d0JBQzdCLFNBQVMsRUFBRSx1QkFBdUI7d0JBQ2xDLFlBQVksRUFBRSw2QkFBNkI7cUJBQzVDO2lCQUVGOzs7Z0JBekJDLFVBQVU7OzsyQkFnQ1QsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7O0lBRXpDO1FBREMsY0FBYyxFQUFFOzt1REFDRztJQUVwQjtRQURDLGNBQWMsRUFBRTs7dURBQ0c7SUE4QnRCLHlCQUFDO0NBQUEsQUFuREQsSUFtREM7U0F4Q1ksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcbmltcG9ydCB7IE9ic2VydmFibGVXcmFwcGVyIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9hc3luYyc7XG5pbXBvcnQgeyBJR3JpZEl0ZW0gfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL28tZ3JpZC1pdGVtLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0dSSURfSVRFTSA9IFtcbiAgJ2NvbHNwYW4nLFxuICAncm93c3Bhbidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tZ3JpZC1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZ3JpZC1pdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0dSSURfSVRFTSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1ncmlkLWl0ZW1dJzogJ3RydWUnLFxuICAgICcoY2xpY2spJzogJ29uSXRlbUNsaWNrZWQoJGV2ZW50KScsXG4gICAgJyhkYmxjbGljayknOiAnb25JdGVtRG91YmxlQ2xpY2tlZCgkZXZlbnQpJ1xuICB9LFxuXG59KVxuZXhwb3J0IGNsYXNzIE9HcmlkSXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIElHcmlkSXRlbSB7XG5cbiAgbW9kZWxEYXRhOiBvYmplY3Q7XG4gIG1kQ2xpY2s6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBtZERvdWJsZUNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmLCB7IHN0YXRpYzogZmFsc2UgfSkgcHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBjb2xzcGFuOiBudW1iZXIgPSAxO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICByb3dzcGFuOiBudW1iZXIgPSAxO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWw6IEVsZW1lbnRSZWYpIHsgfVxuXG4gIG9uSXRlbUNsaWNrZWQoZT86IEV2ZW50KSB7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5tZENsaWNrLCB0aGlzKTtcbiAgfVxuXG4gIG9uSXRlbURvdWJsZUNsaWNrZWQoZT86IEV2ZW50KSB7XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5tZERvdWJsZUNsaWNrLCB0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrKG9uTmV4dDogKGl0ZW06IE9HcmlkSXRlbUNvbXBvbmVudCkgPT4gdm9pZCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIE9ic2VydmFibGVXcmFwcGVyLnN1YnNjcmliZSh0aGlzLm1kQ2xpY2ssIG9uTmV4dCk7XG4gIH1cblxuICBwdWJsaWMgb25Eb3VibGVDbGljayhvbk5leHQ6IChpdGVtOiBPR3JpZEl0ZW1Db21wb25lbnQpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5tZERvdWJsZUNsaWNrLCBvbk5leHQpO1xuICB9XG5cbiAgc2V0SXRlbURhdGEoZGF0YTogb2JqZWN0KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm1vZGVsRGF0YSkge1xuICAgICAgdGhpcy5tb2RlbERhdGEgPSBkYXRhO1xuICAgIH1cbiAgfVxuXG4gIGdldEl0ZW1EYXRhKCk6IG9iamVjdCB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxEYXRhO1xuICB9XG5cbn1cbiJdfQ==