import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, InjectionToken, Injector, Input, Optional, } from '@angular/core';
import { Codes } from '../../../util/codes';
export const O_MAT_ERROR_OPTIONS = new InjectionToken('o-mat-error-options');
let nextUniqueId = 0;
export class OMatErrorComponent {
    constructor(injector, elementRef, cd, errorOptions) {
        this.injector = injector;
        this.elementRef = elementRef;
        this.cd = cd;
        this.id = `mat-error-${nextUniqueId++}`;
        this.text = '';
        this.errorOptions = errorOptions ? errorOptions : {};
        this.errorType = this.errorOptions.type || 'standard';
    }
    get isStandardError() {
        return this.errorType === Codes.O_MAT_ERROR_STANDARD;
    }
}
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
OMatErrorComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [O_MAT_ERROR_OPTIONS,] }] }
];
OMatErrorComponent.propDecorators = {
    id: [{ type: Input }],
    text: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1tYXQtZXJyb3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NoYXJlZC9tYXRlcmlhbC9vLW1hdC1lcnJvci9vLW1hdC1lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixjQUFjLEVBQ2QsUUFBUSxFQUNSLEtBQUssRUFDTCxRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRTVDLE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHLElBQUksY0FBYyxDQUFtQixxQkFBcUIsQ0FBQyxDQUFDO0FBRS9GLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztBQWFyQixNQUFNLE9BQU8sa0JBQWtCO0lBTzdCLFlBQ1ksUUFBa0IsRUFDbEIsVUFBc0IsRUFDdEIsRUFBcUIsRUFDVSxZQUE4QjtRQUg3RCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFUeEIsT0FBRSxHQUFXLGFBQWEsWUFBWSxFQUFFLEVBQUUsQ0FBQztRQUMzQyxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBV3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLFVBQVUsQ0FBQztJQUN4RCxDQUFDO0lBRUQsSUFBSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsb0JBQW9CLENBQUM7SUFDdkQsQ0FBQzs7O1lBOUJGLFNBQVMsU0FBQztnQkFFVCxRQUFRLEVBQUUsV0FBVztnQkFDckIsbUZBQWlDO2dCQUNqQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxXQUFXO29CQUNsQixJQUFJLEVBQUUsT0FBTztvQkFDYixXQUFXLEVBQUUsSUFBSTtpQkFDbEI7YUFDRjs7O1lBdEJDLFFBQVE7WUFIUixVQUFVO1lBRlYsaUJBQWlCOzRDQXVDZCxRQUFRLFlBQUksTUFBTSxTQUFDLG1CQUFtQjs7O2lCQVZ4QyxLQUFLO21CQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE9NYXRFcnJvck9wdGlvbnMsIE9NYXRFcnJvclR5cGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLW1hdC1lcnJvci50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5cbmV4cG9ydCBjb25zdCBPX01BVF9FUlJPUl9PUFRJT05TID0gbmV3IEluamVjdGlvblRva2VuPE9NYXRFcnJvck9wdGlvbnM+KCdvLW1hdC1lcnJvci1vcHRpb25zJyk7XG5cbmxldCBuZXh0VW5pcXVlSWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdtYXQtZXJyb3InLFxuICB0ZW1wbGF0ZVVybDogJy4vby1tYXQtZXJyb3IuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtZXJyb3InLFxuICAgIHJvbGU6ICdhbGVydCcsXG4gICAgJ1thdHRyLmlkXSc6ICdpZCdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPTWF0RXJyb3JDb21wb25lbnQge1xuICBASW5wdXQoKSBpZDogc3RyaW5nID0gYG1hdC1lcnJvci0ke25leHRVbmlxdWVJZCsrfWA7XG4gIEBJbnB1dCgpIHRleHQ6IHN0cmluZyA9ICcnO1xuXG4gIHByb3RlY3RlZCBlcnJvck9wdGlvbnM6IE9NYXRFcnJvck9wdGlvbnM7XG4gIHByb3RlY3RlZCBlcnJvclR5cGU6IE9NYXRFcnJvclR5cGU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoT19NQVRfRVJST1JfT1BUSU9OUykgZXJyb3JPcHRpb25zOiBPTWF0RXJyb3JPcHRpb25zXG4gICkge1xuICAgIHRoaXMuZXJyb3JPcHRpb25zID0gZXJyb3JPcHRpb25zID8gZXJyb3JPcHRpb25zIDoge307XG4gICAgdGhpcy5lcnJvclR5cGUgPSB0aGlzLmVycm9yT3B0aW9ucy50eXBlIHx8ICdzdGFuZGFyZCc7XG4gIH1cblxuICBnZXQgaXNTdGFuZGFyZEVycm9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVycm9yVHlwZSA9PT0gQ29kZXMuT19NQVRfRVJST1JfU1RBTkRBUkQ7XG4gIH1cbn1cbiJdfQ==