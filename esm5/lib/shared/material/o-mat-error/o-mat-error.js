import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, InjectionToken, Injector, Input, Optional, } from '@angular/core';
import { Codes } from '../../../util/codes';
export var O_MAT_ERROR_OPTIONS = new InjectionToken('o-mat-error-options');
var nextUniqueId = 0;
var OMatErrorComponent = (function () {
    function OMatErrorComponent(injector, elementRef, cd, errorOptions) {
        this.injector = injector;
        this.elementRef = elementRef;
        this.cd = cd;
        this.id = "mat-error-" + nextUniqueId++;
        this.text = '';
        this.errorOptions = errorOptions ? errorOptions : {};
        this.errorType = this.errorOptions.type || 'standard';
    }
    Object.defineProperty(OMatErrorComponent.prototype, "isStandardError", {
        get: function () {
            return this.errorType === Codes.O_MAT_ERROR_STANDARD;
        },
        enumerable: true,
        configurable: true
    });
    OMatErrorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mat-error',
                    template: "<ng-container *ngIf=\"isStandardError\">\n  {{ text }}\n</ng-container>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'mat-error',
                        role: 'alert',
                        '[attr.id]': 'id'
                    }
                }] }
    ];
    OMatErrorComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [O_MAT_ERROR_OPTIONS,] }] }
    ]; };
    OMatErrorComponent.propDecorators = {
        id: [{ type: Input }],
        text: [{ type: Input }]
    };
    return OMatErrorComponent;
}());
export { OMatErrorComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtZXJyb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9tYXRlcmlhbC9vLW1hdC1lcnJvci9vLW1hdC1lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsUUFBUSxFQUNSLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVDLE1BQU0sQ0FBQyxJQUFNLG1CQUFtQixHQUFHLElBQUksY0FBYyxDQUFtQixxQkFBcUIsQ0FBQyxDQUFDO0FBRS9GLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQUVyQjtJQWtCRSw0QkFDWSxRQUFrQixFQUNsQixVQUFzQixFQUN0QixFQUFxQixFQUNVLFlBQThCO1FBSDdELGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVR4QixPQUFFLEdBQVcsZUFBYSxZQUFZLEVBQUksQ0FBQztRQUMzQyxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBV3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQztJQUN4RCxDQUFDO0lBRUQsc0JBQUksK0NBQWU7YUFBbkI7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxDQUFDLG9CQUFvQixDQUFDO1FBQ3ZELENBQUM7OztPQUFBOztnQkE5QkYsU0FBUyxTQUFDO29CQUVULFFBQVEsRUFBRSxXQUFXO29CQUNyQixtRkFBaUM7b0JBQ2pDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLFdBQVc7d0JBQ2xCLElBQUksRUFBRSxPQUFPO3dCQUNiLFdBQVcsRUFBRSxJQUFJO3FCQUNsQjtpQkFDRjs7O2dCQXRCQyxRQUFRO2dCQUhSLFVBQVU7Z0JBRlYsaUJBQWlCO2dEQXVDZCxRQUFRLFlBQUksTUFBTSxTQUFDLG1CQUFtQjs7O3FCQVZ4QyxLQUFLO3VCQUNMLEtBQUs7O0lBa0JSLHlCQUFDO0NBQUEsQUEvQkQsSUErQkM7U0FwQlksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPTWF0RXJyb3JPcHRpb25zLCBPTWF0RXJyb3JUeXBlIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvby1tYXQtZXJyb3IudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuXG5leHBvcnQgY29uc3QgT19NQVRfRVJST1JfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxPTWF0RXJyb3JPcHRpb25zPignby1tYXQtZXJyb3Itb3B0aW9ucycpO1xuXG5sZXQgbmV4dFVuaXF1ZUlkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnbWF0LWVycm9yJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbWF0LWVycm9yLmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbWF0LWVycm9yJyxcbiAgICByb2xlOiAnYWxlcnQnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT01hdEVycm9yQ29tcG9uZW50IHtcbiAgQElucHV0KCkgaWQ6IHN0cmluZyA9IGBtYXQtZXJyb3ItJHtuZXh0VW5pcXVlSWQrK31gO1xuICBASW5wdXQoKSB0ZXh0OiBzdHJpbmcgPSAnJztcblxuICBwcm90ZWN0ZWQgZXJyb3JPcHRpb25zOiBPTWF0RXJyb3JPcHRpb25zO1xuICBwcm90ZWN0ZWQgZXJyb3JUeXBlOiBPTWF0RXJyb3JUeXBlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE9fTUFUX0VSUk9SX09QVElPTlMpIGVycm9yT3B0aW9uczogT01hdEVycm9yT3B0aW9uc1xuICApIHtcbiAgICB0aGlzLmVycm9yT3B0aW9ucyA9IGVycm9yT3B0aW9ucyA/IGVycm9yT3B0aW9ucyA6IHt9O1xuICAgIHRoaXMuZXJyb3JUeXBlID0gdGhpcy5lcnJvck9wdGlvbnMudHlwZSB8fCAnc3RhbmRhcmQnO1xuICB9XG5cbiAgZ2V0IGlzU3RhbmRhcmRFcnJvcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lcnJvclR5cGUgPT09IENvZGVzLk9fTUFUX0VSUk9SX1NUQU5EQVJEO1xuICB9XG59XG4iXX0=