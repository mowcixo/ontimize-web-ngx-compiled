import * as tslib_1 from "tslib";
import { Component, ElementRef, EventEmitter, TemplateRef, ViewChild, } from '@angular/core';
import { InputConverter } from '../../../decorators/input-converter';
import { ObservableWrapper } from '../../../util/async';
export const DEFAULT_INPUTS_O_GRID_ITEM = [
    'colspan',
    'rowspan'
];
export class OGridItemComponent {
    constructor(_el) {
        this._el = _el;
        this.mdClick = new EventEmitter();
        this.mdDoubleClick = new EventEmitter();
        this.colspan = 1;
        this.rowspan = 1;
    }
    onItemClicked(e) {
        ObservableWrapper.callEmit(this.mdClick, this);
    }
    onItemDoubleClicked(e) {
        ObservableWrapper.callEmit(this.mdDoubleClick, this);
    }
    onClick(onNext) {
        return ObservableWrapper.subscribe(this.mdClick, onNext);
    }
    onDoubleClick(onNext) {
        return ObservableWrapper.subscribe(this.mdDoubleClick, onNext);
    }
    setItemData(data) {
        if (!this.modelData) {
            this.modelData = data;
        }
    }
    getItemData() {
        return this.modelData;
    }
}
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
OGridItemComponent.ctorParameters = () => [
    { type: ElementRef }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1ncmlkLWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2dyaWQvZ3JpZC1pdGVtL28tZ3JpZC1pdGVtLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFdBQVcsRUFDWCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBR3hELE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHO0lBQ3hDLFNBQVM7SUFDVCxTQUFTO0NBQ1YsQ0FBQztBQWFGLE1BQU0sT0FBTyxrQkFBa0I7SUFZN0IsWUFBbUIsR0FBZTtRQUFmLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFUbEMsWUFBTyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2hELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFJdEQsWUFBTyxHQUFXLENBQUMsQ0FBQztRQUVwQixZQUFPLEdBQVcsQ0FBQyxDQUFDO0lBRWtCLENBQUM7SUFFdkMsYUFBYSxDQUFDLENBQVM7UUFDckIsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELG1CQUFtQixDQUFDLENBQVM7UUFDM0IsaUJBQWlCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLE9BQU8sQ0FBQyxNQUEwQztRQUN2RCxPQUFPLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSxhQUFhLENBQUMsTUFBMEM7UUFDN0QsT0FBTyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVk7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4QixDQUFDOzs7WUFqREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxhQUFhO2dCQUN2QixtRkFBMkM7Z0JBQzNDLE1BQU0sRUFBRSwwQkFBMEI7Z0JBQ2xDLElBQUksRUFBRTtvQkFDSixxQkFBcUIsRUFBRSxNQUFNO29CQUM3QixTQUFTLEVBQUUsdUJBQXVCO29CQUNsQyxZQUFZLEVBQUUsNkJBQTZCO2lCQUM1QzthQUVGOzs7WUF6QkMsVUFBVTs7O3VCQWdDVCxTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7QUFFekM7SUFEQyxjQUFjLEVBQUU7O21EQUNHO0FBRXBCO0lBREMsY0FBYyxFQUFFOzttREFDRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlV3JhcHBlciB9IGZyb20gJy4uLy4uLy4uL3V0aWwvYXN5bmMnO1xuaW1wb3J0IHsgSUdyaWRJdGVtIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLWdyaWQtaXRlbS5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19HUklEX0lURU0gPSBbXG4gICdjb2xzcGFuJyxcbiAgJ3Jvd3NwYW4nXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWdyaWQtaXRlbScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWdyaWQtaXRlbS5jb21wb25lbnQuaHRtbCcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19HUklEX0lURU0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZ3JpZC1pdGVtXSc6ICd0cnVlJyxcbiAgICAnKGNsaWNrKSc6ICdvbkl0ZW1DbGlja2VkKCRldmVudCknLFxuICAgICcoZGJsY2xpY2spJzogJ29uSXRlbURvdWJsZUNsaWNrZWQoJGV2ZW50KSdcbiAgfSxcblxufSlcbmV4cG9ydCBjbGFzcyBPR3JpZEl0ZW1Db21wb25lbnQgaW1wbGVtZW50cyBJR3JpZEl0ZW0ge1xuXG4gIG1vZGVsRGF0YTogb2JqZWN0O1xuICBtZENsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgbWREb3VibGVDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IGZhbHNlIH0pIHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0Q29udmVydGVyKClcbiAgY29sc3BhbjogbnVtYmVyID0gMTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgcm93c3BhbjogbnVtYmVyID0gMTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsOiBFbGVtZW50UmVmKSB7IH1cblxuICBvbkl0ZW1DbGlja2VkKGU/OiBFdmVudCkge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMubWRDbGljaywgdGhpcyk7XG4gIH1cblxuICBvbkl0ZW1Eb3VibGVDbGlja2VkKGU/OiBFdmVudCkge1xuICAgIE9ic2VydmFibGVXcmFwcGVyLmNhbGxFbWl0KHRoaXMubWREb3VibGVDbGljaywgdGhpcyk7XG4gIH1cblxuICBwdWJsaWMgb25DbGljayhvbk5leHQ6IChpdGVtOiBPR3JpZEl0ZW1Db21wb25lbnQpID0+IHZvaWQpOiBvYmplY3Qge1xuICAgIHJldHVybiBPYnNlcnZhYmxlV3JhcHBlci5zdWJzY3JpYmUodGhpcy5tZENsaWNrLCBvbk5leHQpO1xuICB9XG5cbiAgcHVibGljIG9uRG91YmxlQ2xpY2sob25OZXh0OiAoaXRlbTogT0dyaWRJdGVtQ29tcG9uZW50KSA9PiB2b2lkKTogb2JqZWN0IHtcbiAgICByZXR1cm4gT2JzZXJ2YWJsZVdyYXBwZXIuc3Vic2NyaWJlKHRoaXMubWREb3VibGVDbGljaywgb25OZXh0KTtcbiAgfVxuXG4gIHNldEl0ZW1EYXRhKGRhdGE6IG9iamVjdCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tb2RlbERhdGEpIHtcbiAgICAgIHRoaXMubW9kZWxEYXRhID0gZGF0YTtcbiAgICB9XG4gIH1cblxuICBnZXRJdGVtRGF0YSgpOiBvYmplY3Qge1xuICAgIHJldHVybiB0aGlzLm1vZGVsRGF0YTtcbiAgfVxuXG59XG4iXX0=