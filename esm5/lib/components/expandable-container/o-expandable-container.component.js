import { Component } from '@angular/core';
export var DEFAULT_INPUT_O_EXPANDABLE_CONTAINER = [
    'targets',
    'data'
];
var OExpandableContainerComponent = (function () {
    function OExpandableContainerComponent() {
    }
    OExpandableContainerComponent.prototype.ngAfterViewInit = function () {
        this.targets.forEach(function (x) {
            x.queryData();
        });
    };
    OExpandableContainerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-expandable-container',
                    template: "<ng-content></ng-content>",
                    inputs: DEFAULT_INPUT_O_EXPANDABLE_CONTAINER
                }] }
    ];
    OExpandableContainerComponent.ctorParameters = function () { return []; };
    return OExpandableContainerComponent;
}());
export { OExpandableContainerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1leHBhbmRhYmxlLWNvbnRhaW5lci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZXhwYW5kYWJsZS1jb250YWluZXIvby1leHBhbmRhYmxlLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFHekQsTUFBTSxDQUFDLElBQU0sb0NBQW9DLEdBQUc7SUFFbEQsU0FBUztJQUNULE1BQU07Q0FDUCxDQUFDO0FBQ0Y7SUFTRTtJQUFnQixDQUFDO0lBRWpCLHVEQUFlLEdBQWY7UUFDRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7WUFDcEIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Z0JBZkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLHFDQUFzRDtvQkFDdEQsTUFBTSxFQUFFLG9DQUFvQztpQkFDN0M7OztJQWFELG9DQUFDO0NBQUEsQUFqQkQsSUFpQkM7U0FaWSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9TZXJ2aWNlQ29tcG9uZW50IH0gZnJvbSAnLi4vby1zZXJ2aWNlLWNvbXBvbmVudC5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUX09fRVhQQU5EQUJMRV9DT05UQUlORVIgPSBbXG4gIC8vIHRhcmdldHMgW2BPU2VydmljZUNvbXBvbmVudGAgaW5zdGFuY2VdOiBDb21wb25lbnRzIHdob3NlIHF1ZXJ5IHdpbGwgYmUgbGF1bmNoZWQgd2hlbiBleHBhbmRpbmcgdGhlIHJvdy5cbiAgJ3RhcmdldHMnLFxuICAnZGF0YSdcbl07XG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWV4cGFuZGFibGUtY29udGFpbmVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZXhwYW5kYWJsZS1jb250YWluZXIuY29tcG9uZW50Lmh0bWwnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRfT19FWFBBTkRBQkxFX0NPTlRBSU5FUlxufSlcbmV4cG9ydCBjbGFzcyBPRXhwYW5kYWJsZUNvbnRhaW5lckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIHB1YmxpYyB0YXJnZXRzOiBBcnJheTxPU2VydmljZUNvbXBvbmVudD47XG4gIHB1YmxpYyBkYXRhOiBhbnk7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMudGFyZ2V0cy5mb3JFYWNoKHggPT4ge1xuICAgICAgeC5xdWVyeURhdGEoKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=