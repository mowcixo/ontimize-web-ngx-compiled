import { Directive, Optional } from '@angular/core';
import { Util } from '../../util/util';
import { OFilterBuilderComponent } from './o-filter-builder.component';
export class OFilterBuilderClearDirective {
    constructor(filterBuilder) {
        if (Util.isDefined(filterBuilder)) {
            this._filterBuilder = filterBuilder;
        }
    }
    onClick(e) {
        if (this._filterBuilder) {
            this._filterBuilder.clearFilter();
        }
    }
}
OFilterBuilderClearDirective.decorators = [
    { type: Directive, args: [{
                selector: '[oFilterBuilderClear]',
                inputs: [
                    '_filterBuilder: oFilterBuilderClear'
                ],
                host: {
                    '(click)': 'onClick($event)'
                },
                exportAs: 'oFilterBuilderClear'
            },] }
];
OFilterBuilderClearDirective.ctorParameters = () => [
    { type: OFilterBuilderComponent, decorators: [{ type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWx0ZXItYnVpbGRlci1jbGVhci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvZmlsdGVyLWJ1aWxkZXIvby1maWx0ZXItYnVpbGRlci1jbGVhci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFcEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBWXZFLE1BQU0sT0FBTyw0QkFBNEI7SUFJdkMsWUFDYyxhQUFzQztRQUVsRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDakMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsT0FBTyxDQUFDLENBQVM7UUFDZixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQztJQUNILENBQUM7OztZQTFCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsTUFBTSxFQUFFO29CQUNOLHFDQUFxQztpQkFDdEM7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLFNBQVMsRUFBRSxpQkFBaUI7aUJBQzdCO2dCQUNELFFBQVEsRUFBRSxxQkFBcUI7YUFDaEM7OztZQVhRLHVCQUF1Qix1QkFpQjNCLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQgfSBmcm9tICcuL28tZmlsdGVyLWJ1aWxkZXIuY29tcG9uZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29GaWx0ZXJCdWlsZGVyQ2xlYXJdJyxcbiAgaW5wdXRzOiBbXG4gICAgJ19maWx0ZXJCdWlsZGVyOiBvRmlsdGVyQnVpbGRlckNsZWFyJ1xuICBdLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnb25DbGljaygkZXZlbnQpJ1xuICB9LFxuICBleHBvcnRBczogJ29GaWx0ZXJCdWlsZGVyQ2xlYXInXG59KVxuZXhwb3J0IGNsYXNzIE9GaWx0ZXJCdWlsZGVyQ2xlYXJEaXJlY3RpdmUge1xuXG4gIHByb3RlY3RlZCBfZmlsdGVyQnVpbGRlcjogT0ZpbHRlckJ1aWxkZXJDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgZmlsdGVyQnVpbGRlcjogT0ZpbHRlckJ1aWxkZXJDb21wb25lbnRcbiAgKSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGZpbHRlckJ1aWxkZXIpKSB7XG4gICAgICB0aGlzLl9maWx0ZXJCdWlsZGVyID0gZmlsdGVyQnVpbGRlcjtcbiAgICB9XG4gIH1cblxuICBvbkNsaWNrKGU/OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9maWx0ZXJCdWlsZGVyKSB7XG4gICAgICB0aGlzLl9maWx0ZXJCdWlsZGVyLmNsZWFyRmlsdGVyKCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==