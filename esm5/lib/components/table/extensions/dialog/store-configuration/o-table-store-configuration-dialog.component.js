import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSelectionList } from '@angular/material';
import { OTableBaseDialogClass } from '../o-table-base-dialog.class';
var OTableStoreConfigurationDialogComponent = (function (_super) {
    tslib_1.__extends(OTableStoreConfigurationDialogComponent, _super);
    function OTableStoreConfigurationDialogComponent(dialogRef, injector) {
        var _this = _super.call(this, injector) || this;
        _this.dialogRef = dialogRef;
        _this.injector = injector;
        _this.properties = [{
                property: 'sort',
                name: 'TABLE.DIALOG.PROPERTIES.SORT',
                info: 'TABLE.DIALOG.PROPERTIES.SORT.INFO'
            }, {
                property: 'columns-display',
                name: 'TABLE.DIALOG.PROPERTIES.COLUMNS_DISPLAY',
                info: 'TABLE.DIALOG.PROPERTIES.COLUMNS_DISPLAY.INFO'
            }, {
                property: 'quick-filter',
                name: 'TABLE.DIALOG.PROPERTIES.QUICK_FILTER',
                info: 'TABLE.DIALOG.PROPERTIES.QUICK_FILTER.INFO'
            }, {
                property: 'columns-filter',
                name: 'TABLE.DIALOG.PROPERTIES.COLUMNS_FILTER',
                info: 'TABLE.DIALOG.PROPERTIES.COLUMNS_FILTER.INFO'
            }, {
                property: 'page',
                name: 'TABLE.DIALOG.PROPERTIES.PAGE',
                info: 'TABLE.DIALOG.PROPERTIES.PAGE.INFO'
            }];
        _this.formGroup = new FormGroup({
            name: new FormControl('', [
                Validators.required
            ]),
            description: new FormControl('')
        });
        _this.setFormControl(_this.formGroup.get('name'));
        return _this;
    }
    OTableStoreConfigurationDialogComponent.prototype.ngAfterViewInit = function () {
        this.propertiesList.selectAll();
    };
    OTableStoreConfigurationDialogComponent.prototype.areAllSelected = function () {
        return this.propertiesList && this.propertiesList.options && this.propertiesList.options.length === this.propertiesList.selectedOptions.selected.length;
    };
    OTableStoreConfigurationDialogComponent.prototype.onSelectAllChange = function (event) {
        event.checked ? this.propertiesList.selectAll() : this.propertiesList.deselectAll();
    };
    OTableStoreConfigurationDialogComponent.prototype.getConfigurationAttributes = function () {
        return this.formGroup.value;
    };
    OTableStoreConfigurationDialogComponent.prototype.getSelectedTableProperties = function () {
        var selected = this.propertiesList.selectedOptions.selected;
        return selected.length ? selected.map(function (item) { return item.value; }) : [];
    };
    OTableStoreConfigurationDialogComponent.prototype.isIndeterminate = function () {
        return !this.areAllSelected();
    };
    OTableStoreConfigurationDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-store-configuration-dialog',
                    template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.SAVE_CONFIGURATION' | oTranslate }}</span>\n\n<mat-dialog-content>\n  <div mat-subheader>{{ 'TABLE.DIALOG.SAVE_CONFIGURATION' | oTranslate }}</div>\n  <form #form [formGroup]=\"formGroup\" fxLayout=\"column\">\n    <mat-form-field>\n      <input matInput [matTooltip]=\"tooltipText\" [matTooltipClass]=\"tooltipClass\" placeholder=\"{{ 'TABLE.DIALOG.CONFIGURATION_NAME' | oTranslate }}\"\n        formControlName=\"name\" required>\n      <mat-error *ngIf=\"formGroup.controls['name'].hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    </mat-form-field>\n    <mat-form-field class=\"example-full-width\">\n      <textarea matInput placeholder=\"{{ 'TABLE.DIALOG.CONFIGURATION_DESCRIPTION' | oTranslate }}\" formControlName=\"description\" rows=\"4\"\n        cols=\"50\"></textarea>\n    </mat-form-field>\n    <div class=\"inner-subheader\" mat-subheader>{{ 'TABLE.DIALOG.CONFIGURATION_PROPERTIES' | oTranslate }}</div>\n    <div fxLayout=\"column\">\n      <mat-checkbox (change)=\"onSelectAllChange($event)\" [checked]=\"areAllSelected()\" [indeterminate]=\"isIndeterminate()\" class=\"select-all-checkbox\">\n        {{ 'SELECT_ALL' | oTranslate }}\n      </mat-checkbox>\n\n      <mat-selection-list #propertiesList dense class=\"o-table-save-configuration-dialog-list o-scroll\">\n        <mat-list-option checkboxPosition=\"before\" *ngFor=\"let property of properties\" [value]=\"property.property\">\n          <div fxLayout=\"row\" fxLayoutAlign=\"center center\">\n            <span matLine fxFlex>{{ property.name | oTranslate }}</span>\n            <mat-icon *ngIf=\"property.info\" matTooltip=\"{{ property.info | oTranslate }}\" class=\"o-tscd-list-tooltip\">info</mat-icon>\n          </div>\n        </mat-list-option>\n      </mat-selection-list>\n    </div>\n  </form>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\"\n    [disabled]=\"!formGroup.valid || propertiesList.selectedOptions.selected.length===0\">{{ 'SAVE' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [".select-all-checkbox{padding:6px 0}.o-table-save-configuration-dialog-list{max-height:120px;overflow-y:scroll}.o-table-save-configuration-dialog-list .mat-list-item{height:30px}.o-table-save-configuration-dialog-list .mat-list-item .o-tscd-list-tooltip.mat-icon{opacity:.25}"]
                }] }
    ];
    OTableStoreConfigurationDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: Injector }
    ]; };
    OTableStoreConfigurationDialogComponent.propDecorators = {
        propertiesList: [{ type: ViewChild, args: ['propertiesList', { static: false },] }]
    };
    return OTableStoreConfigurationDialogComponent;
}(OTableBaseDialogClass));
export { OTableStoreConfigurationDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1zdG9yZS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kaWFsb2cvc3RvcmUtY29uZmlndXJhdGlvbi9vLXRhYmxlLXN0b3JlLWNvbmZpZ3VyYXRpb24tZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFpQix1QkFBdUIsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRSxPQUFPLEVBQXFCLFlBQVksRUFBaUIsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVyRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUVyRTtJQU02RCxtRUFBcUI7SUFrQ2hGLGlEQUNTLFNBQWdFLEVBQzdELFFBQWtCO1FBRjlCLFlBSUUsa0JBQU0sUUFBUSxDQUFDLFNBRWhCO1FBTFEsZUFBUyxHQUFULFNBQVMsQ0FBdUQ7UUFDN0QsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQS9CdkIsZ0JBQVUsR0FBVSxDQUFDO2dCQUMxQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsSUFBSSxFQUFFLG1DQUFtQzthQUMxQyxFQUFFO2dCQUNELFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLElBQUksRUFBRSx5Q0FBeUM7Z0JBQy9DLElBQUksRUFBRSw4Q0FBOEM7YUFDckQsRUFBRTtnQkFDRCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsSUFBSSxFQUFFLHNDQUFzQztnQkFDNUMsSUFBSSxFQUFFLDJDQUEyQzthQUNsRCxFQUFFO2dCQUNELFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLElBQUksRUFBRSx3Q0FBd0M7Z0JBQzlDLElBQUksRUFBRSw2Q0FBNkM7YUFDcEQsRUFBRTtnQkFDRCxRQUFRLEVBQUUsTUFBTTtnQkFDaEIsSUFBSSxFQUFFLDhCQUE4QjtnQkFDcEMsSUFBSSxFQUFFLG1DQUFtQzthQUMxQyxDQUFDLENBQUM7UUFFSSxlQUFTLEdBQWMsSUFBSSxTQUFTLENBQUM7WUFDMUMsSUFBSSxFQUFFLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsVUFBVSxDQUFDLFFBQVE7YUFDcEIsQ0FBQztZQUNGLFdBQVcsRUFBRSxJQUFJLFdBQVcsQ0FBQyxFQUFFLENBQUM7U0FDakMsQ0FBQyxDQUFDO1FBT0QsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztJQUNsRCxDQUFDO0lBRU0saUVBQWUsR0FBdEI7UUFDRSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxnRUFBYyxHQUFyQjtRQUNFLE9BQU8sSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUMxSixDQUFDO0lBRU0sbUVBQWlCLEdBQXhCLFVBQXlCLEtBQXdCO1FBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEYsQ0FBQztJQUVNLDRFQUEwQixHQUFqQztRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVNLDRFQUEwQixHQUFqQztRQUNFLElBQU0sUUFBUSxHQUFvQixJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFDL0UsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssRUFBVixDQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFTSxpRUFBZSxHQUF0QjtRQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDaEMsQ0FBQzs7Z0JBdkVGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsb0NBQW9DO29CQUM5QywreUVBQWtFO29CQUVsRSxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7Z0JBVDJCLFlBQVk7Z0JBRm9CLFFBQVE7OztpQ0FjakUsU0FBUyxTQUFDLGdCQUFnQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7SUFpRWhELDhDQUFDO0NBQUEsQUF6RUQsQ0FNNkQscUJBQXFCLEdBbUVqRjtTQW5FWSx1Q0FBdUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTWF0Q2hlY2tib3hDaGFuZ2UsIE1hdERpYWxvZ1JlZiwgTWF0TGlzdE9wdGlvbiwgTWF0U2VsZWN0aW9uTGlzdCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT1RhYmxlQmFzZURpYWxvZ0NsYXNzIH0gZnJvbSAnLi4vby10YWJsZS1iYXNlLWRpYWxvZy5jbGFzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtc3RvcmUtY29uZmlndXJhdGlvbi1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1zdG9yZS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtc3RvcmUtY29uZmlndXJhdGlvbi1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlU3RvcmVDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50IGV4dGVuZHMgT1RhYmxlQmFzZURpYWxvZ0NsYXNzIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQFZpZXdDaGlsZCgncHJvcGVydGllc0xpc3QnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgcHVibGljIHByb3BlcnRpZXNMaXN0OiBNYXRTZWxlY3Rpb25MaXN0O1xuXG4gIHB1YmxpYyBwcm9wZXJ0aWVzOiBhbnlbXSA9IFt7XG4gICAgcHJvcGVydHk6ICdzb3J0JyxcbiAgICBuYW1lOiAnVEFCTEUuRElBTE9HLlBST1BFUlRJRVMuU09SVCcsXG4gICAgaW5mbzogJ1RBQkxFLkRJQUxPRy5QUk9QRVJUSUVTLlNPUlQuSU5GTydcbiAgfSwge1xuICAgIHByb3BlcnR5OiAnY29sdW1ucy1kaXNwbGF5JyxcbiAgICBuYW1lOiAnVEFCTEUuRElBTE9HLlBST1BFUlRJRVMuQ09MVU1OU19ESVNQTEFZJyxcbiAgICBpbmZvOiAnVEFCTEUuRElBTE9HLlBST1BFUlRJRVMuQ09MVU1OU19ESVNQTEFZLklORk8nXG4gIH0sIHtcbiAgICBwcm9wZXJ0eTogJ3F1aWNrLWZpbHRlcicsXG4gICAgbmFtZTogJ1RBQkxFLkRJQUxPRy5QUk9QRVJUSUVTLlFVSUNLX0ZJTFRFUicsXG4gICAgaW5mbzogJ1RBQkxFLkRJQUxPRy5QUk9QRVJUSUVTLlFVSUNLX0ZJTFRFUi5JTkZPJ1xuICB9LCB7XG4gICAgcHJvcGVydHk6ICdjb2x1bW5zLWZpbHRlcicsXG4gICAgbmFtZTogJ1RBQkxFLkRJQUxPRy5QUk9QRVJUSUVTLkNPTFVNTlNfRklMVEVSJyxcbiAgICBpbmZvOiAnVEFCTEUuRElBTE9HLlBST1BFUlRJRVMuQ09MVU1OU19GSUxURVIuSU5GTydcbiAgfSwge1xuICAgIHByb3BlcnR5OiAncGFnZScsXG4gICAgbmFtZTogJ1RBQkxFLkRJQUxPRy5QUk9QRVJUSUVTLlBBR0UnLFxuICAgIGluZm86ICdUQUJMRS5ESUFMT0cuUFJPUEVSVElFUy5QQUdFLklORk8nXG4gIH1dO1xuXG4gIHB1YmxpYyBmb3JtR3JvdXA6IEZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgIG5hbWU6IG5ldyBGb3JtQ29udHJvbCgnJywgW1xuICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZFxuICAgIF0pLFxuICAgIGRlc2NyaXB0aW9uOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gIH0pO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxPVGFibGVTdG9yZUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQ+LFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMuc2V0Rm9ybUNvbnRyb2wodGhpcy5mb3JtR3JvdXAuZ2V0KCduYW1lJykpO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnByb3BlcnRpZXNMaXN0LnNlbGVjdEFsbCgpO1xuICB9XG5cbiAgcHVibGljIGFyZUFsbFNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXNMaXN0ICYmIHRoaXMucHJvcGVydGllc0xpc3Qub3B0aW9ucyAmJiB0aGlzLnByb3BlcnRpZXNMaXN0Lm9wdGlvbnMubGVuZ3RoID09PSB0aGlzLnByb3BlcnRpZXNMaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3RlZC5sZW5ndGg7XG4gIH1cblxuICBwdWJsaWMgb25TZWxlY3RBbGxDaGFuZ2UoZXZlbnQ6IE1hdENoZWNrYm94Q2hhbmdlKTogdm9pZCB7XG4gICAgZXZlbnQuY2hlY2tlZCA/IHRoaXMucHJvcGVydGllc0xpc3Quc2VsZWN0QWxsKCkgOiB0aGlzLnByb3BlcnRpZXNMaXN0LmRlc2VsZWN0QWxsKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29uZmlndXJhdGlvbkF0dHJpYnV0ZXMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtR3JvdXAudmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VsZWN0ZWRUYWJsZVByb3BlcnRpZXMoKTogYW55W10ge1xuICAgIGNvbnN0IHNlbGVjdGVkOiBNYXRMaXN0T3B0aW9uW10gPSB0aGlzLnByb3BlcnRpZXNMaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3RlZDtcbiAgICByZXR1cm4gc2VsZWN0ZWQubGVuZ3RoID8gc2VsZWN0ZWQubWFwKGl0ZW0gPT4gaXRlbS52YWx1ZSkgOiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBpc0luZGV0ZXJtaW5hdGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmFyZUFsbFNlbGVjdGVkKCk7XG4gIH1cblxufVxuIl19