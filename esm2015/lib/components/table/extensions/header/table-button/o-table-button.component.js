import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Inject, Injector, ViewEncapsulation, } from '@angular/core';
import { InputConverter } from '../../../../../decorators/input-converter';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
import { OTableComponent } from '../../../o-table.component';
export const DEFAULT_INPUTS_O_TABLE_BUTTON = [
    'oattr: attr',
    'enabled',
    'icon',
    'svgIcon: svg-icon',
    'iconPosition: icon-position',
    'olabel: label'
];
export const DEFAULT_OUTPUTS_O_TABLE_BUTTON = [
    'onClick'
];
export class OTableButtonComponent {
    constructor(injector, elRef, _table) {
        this.injector = injector;
        this.elRef = elRef;
        this._table = _table;
        this.onClick = new EventEmitter();
        this.enabled = true;
    }
    ngOnInit() {
        if (!Util.isDefined(this.icon) && !Util.isDefined(this.svgIcon)) {
            this.icon = 'priority_high';
        }
        this.iconPosition = Util.parseIconPosition(this.iconPosition);
    }
    innerOnClick(event) {
        event.stopPropagation();
        this.onClick.emit();
    }
    isIconPositionLeft() {
        return this.iconPosition === Codes.ICON_POSITION_LEFT;
    }
    get table() {
        return this._table;
    }
}
OTableButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-button',
                template: "<ng-container *ngIf=\"table.showButtonsText\">\n  <button type=\"button\" [disabled]=\"!enabled\" [class.disabled]=\"!enabled\" mat-stroked-button (click)=\"innerOnClick($event)\">\n    <mat-icon *ngIf=\"isIconPositionLeft() && svgIcon !== undefined\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <mat-icon *ngIf=\"isIconPositionLeft() && svgIcon === undefined\">{{ icon }}</mat-icon>\n    <span>{{ olabel | oTranslate }}</span>\n    <mat-icon *ngIf=\"!isIconPositionLeft() && svgIcon !== undefined\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <mat-icon *ngIf=\"!isIconPositionLeft() && svgIcon === undefined\">{{ icon }}</mat-icon>\n  </button>\n</ng-container>\n\n<ng-container *ngIf=\"!table.showButtonsText\">\n  <button type=\"button\" [disabled]=\"!enabled\" [class.disabled]=\"!enabled\" mat-icon-button (click)=\"innerOnClick($event)\">\n    <mat-icon *ngIf=\"isIconPositionLeft() && svgIcon !== undefined\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <mat-icon *ngIf=\"isIconPositionLeft() && svgIcon === undefined\">{{ icon }}</mat-icon>\n    <mat-icon *ngIf=\"!isIconPositionLeft() && svgIcon !== undefined\" [svgIcon]=\"svgIcon\"></mat-icon>\n    <mat-icon *ngIf=\"!isIconPositionLeft() && svgIcon === undefined\">{{ icon }}</mat-icon>\n  </button>\n</ng-container>\n",
                inputs: DEFAULT_INPUTS_O_TABLE_BUTTON,
                outputs: DEFAULT_OUTPUTS_O_TABLE_BUTTON,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class.o-table-button]': 'true',
                },
                styles: [".o-table-button{margin:0 8px}.o-table-button .mat-stroked-button{padding:0 6px;line-height:30px}.o-table-button .mat-stroked-button .mat-button-wrapper{display:flex;align-items:center}.o-table-button .mat-stroked-button .mat-button-wrapper .mat-icon{margin-right:4px}.o-table-button .mat-stroked-button .mat-button-wrapper span{flex:1}"]
            }] }
];
OTableButtonComponent.ctorParameters = () => [
    { type: Injector },
    { type: ElementRef },
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] }
];
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OTableButtonComponent.prototype, "enabled", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvaGVhZGVyL3RhYmxlLWJ1dHRvbi9vLXRhYmxlLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixRQUFRLEVBRVIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQztBQUMzRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUc3RCxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRztJQUMzQyxhQUFhO0lBQ2IsU0FBUztJQUNULE1BQU07SUFDTixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLGVBQWU7Q0FDaEIsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHO0lBQzVDLFNBQVM7Q0FDVixDQUFDO0FBY0YsTUFBTSxPQUFPLHFCQUFxQjtJQVloQyxZQUNZLFFBQWtCLEVBQ3JCLEtBQWlCLEVBQzZCLE1BQXVCO1FBRmxFLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDckIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUM2QixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQWJ2RSxZQUFPLEdBQXlCLElBQUksWUFBWSxFQUFVLENBQUM7UUFJM0QsWUFBTyxHQUFZLElBQUksQ0FBQztJQVUzQixDQUFDO0lBRUUsUUFBUTtRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQy9ELElBQUksQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTSxZQUFZLENBQUMsS0FBSztRQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sa0JBQWtCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFlBQVksS0FBSyxLQUFLLENBQUMsa0JBQWtCLENBQUM7SUFDeEQsQ0FBQztJQUVELElBQUksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOzs7WUFoREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLDR2Q0FBOEM7Z0JBRTlDLE1BQU0sRUFBRSw2QkFBNkI7Z0JBQ3JDLE9BQU8sRUFBRSw4QkFBOEI7Z0JBQ3ZDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLHdCQUF3QixFQUFFLE1BQU07aUJBQ2pDOzthQUNGOzs7WUFuQ0MsUUFBUTtZQUpSLFVBQVU7WUFZSCxlQUFlLHVCQTJDbkIsTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUM7O0FBVDNDO0lBREMsY0FBYyxFQUFFOztzREFDYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT1RhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgT1RhYmxlQnV0dG9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWJ1dHRvbi5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19UQUJMRV9CVVRUT04gPSBbXG4gICdvYXR0cjogYXR0cicsXG4gICdlbmFibGVkJyxcbiAgJ2ljb24nLFxuICAnc3ZnSWNvbjogc3ZnLWljb24nLFxuICAnaWNvblBvc2l0aW9uOiBpY29uLXBvc2l0aW9uJyxcbiAgJ29sYWJlbDogbGFiZWwnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQlVUVE9OID0gW1xuICAnb25DbGljaydcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtYnV0dG9uJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtYnV0dG9uLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1idXR0b24uY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0JVVFRPTixcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fVEFCTEVfQlVUVE9OLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby10YWJsZS1idXR0b25dJzogJ3RydWUnLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUJ1dHRvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9UYWJsZUJ1dHRvbiwgT25Jbml0IHtcblxuICBwdWJsaWMgb25DbGljazogRXZlbnRFbWl0dGVyPG9iamVjdD4gPSBuZXcgRXZlbnRFbWl0dGVyPG9iamVjdD4oKTtcblxuICBwdWJsaWMgb2F0dHI6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgcHVibGljIGVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgaWNvbjogc3RyaW5nO1xuICBwdWJsaWMgc3ZnSWNvbjogc3RyaW5nO1xuICBwdWJsaWMgb2xhYmVsOiBzdHJpbmc7XG4gIHB1YmxpYyBpY29uUG9zaXRpb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHB1YmxpYyBlbFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT1RhYmxlQ29tcG9uZW50KSkgcHJvdGVjdGVkIF90YWJsZTogT1RhYmxlQ29tcG9uZW50XG4gICkgeyB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy5pY29uKSAmJiAhVXRpbC5pc0RlZmluZWQodGhpcy5zdmdJY29uKSkge1xuICAgICAgdGhpcy5pY29uID0gJ3ByaW9yaXR5X2hpZ2gnO1xuICAgIH1cbiAgICB0aGlzLmljb25Qb3NpdGlvbiA9IFV0aWwucGFyc2VJY29uUG9zaXRpb24odGhpcy5pY29uUG9zaXRpb24pO1xuICB9XG5cbiAgcHVibGljIGlubmVyT25DbGljayhldmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMub25DbGljay5lbWl0KCk7XG4gIH1cblxuICBwdWJsaWMgaXNJY29uUG9zaXRpb25MZWZ0KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmljb25Qb3NpdGlvbiA9PT0gQ29kZXMuSUNPTl9QT1NJVElPTl9MRUZUO1xuICB9XG5cbiAgZ2V0IHRhYmxlKCk6IE9UYWJsZUNvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3RhYmxlO1xuICB9XG5cbn1cbiJdfQ==