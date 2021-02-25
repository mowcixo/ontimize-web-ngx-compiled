import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OTableBaseDialogClass } from '../o-table-base-dialog.class';
var OTableStoreFilterDialogComponent = (function (_super) {
    tslib_1.__extends(OTableStoreFilterDialogComponent, _super);
    function OTableStoreFilterDialogComponent(dialogRef, injector, data) {
        var _this = _super.call(this, injector) || this;
        _this.dialogRef = dialogRef;
        _this.injector = injector;
        _this.filterNames = [];
        _this.formGroup = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                _this.filterNameValidator.bind(_this)
            ]),
            description: new FormControl('')
        });
        _this.setFormControl(_this.formGroup.get('name'));
        _this.loadFilterNames(data);
        return _this;
    }
    OTableStoreFilterDialogComponent.prototype.loadFilterNames = function (filterNames) {
        this.filterNames = filterNames;
    };
    OTableStoreFilterDialogComponent.prototype.getFilterAttributes = function () {
        return this.formGroup.value;
    };
    OTableStoreFilterDialogComponent.prototype.filterNameValidator = function (control) {
        var ctrlValue = control.value;
        if (this.filterNames.indexOf(ctrlValue) !== -1) {
            return { filterNameAlreadyExists: true };
        }
        return {};
    };
    OTableStoreFilterDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-store-filter-dialog',
                    template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.SAVE_FILTER' | oTranslate }}</span>\n\n<mat-dialog-content>\n  <div mat-subheader>{{ 'TABLE.DIALOG.SAVE_FILTER' | oTranslate }}</div>\n  <form #form [formGroup]=\"formGroup\" fxLayout=\"column\">\n    <mat-form-field>\n      <input matInput [matTooltip]=\"tooltipText\" [matTooltipClass]=\"tooltipClass\" placeholder=\"{{ 'TABLE.DIALOG.FILTER_NAME' | oTranslate }}\"\n        formControlName=\"name\" required>\n      <mat-error *ngIf=\"formGroup.controls['name'].hasError('filterNameAlreadyExists')\" text=\"{{ 'TABLE.DIALOG.FILTER_NAME_ALREADY_EXISTS' | oTranslate }}\"></mat-error>\n      <mat-error *ngIf=\"formGroup.controls['name'].hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    </mat-form-field>\n    <mat-form-field class=\"example-full-width\">\n      <textarea matInput placeholder=\"{{ 'TABLE.DIALOG.FILTER_DESCRIPTION' | oTranslate }}\" formControlName=\"description\" rows=\"4\" cols=\"50\"></textarea>\n    </mat-form-field>\n  </form>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\" [disabled]=\"!formGroup.valid\">{{'SAVE' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [""]
                }] }
    ];
    OTableStoreFilterDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: Injector },
        { type: Array, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
    ]; };
    return OTableStoreFilterDialogComponent;
}(OTableBaseDialogClass));
export { OTableStoreFilterDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1zdG9yZS1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9zdG9yZS1maWx0ZXIvby10YWJsZS1zdG9yZS1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHbEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFckU7SUFNc0QsNERBQXFCO0lBV3pFLDBDQUNTLFNBQXlELEVBQ3RELFFBQWtCLEVBQ0gsSUFBbUI7UUFIOUMsWUFLRSxrQkFBTSxRQUFRLENBQUMsU0FHaEI7UUFQUSxlQUFTLEdBQVQsU0FBUyxDQUFnRDtRQUN0RCxjQUFRLEdBQVIsUUFBUSxDQUFVO1FBWDlCLGlCQUFXLEdBQWtCLEVBQUUsQ0FBQztRQUNoQyxlQUFTLEdBQWMsSUFBSSxTQUFTLENBQUM7WUFDbkMsSUFBSSxFQUFFLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsVUFBVSxDQUFDLFFBQVE7Z0JBQ25CLEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDO2FBQ3BDLENBQUM7WUFDRixXQUFXLEVBQUUsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQVFELEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRCxLQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDOztJQUM3QixDQUFDO0lBRUQsMERBQWUsR0FBZixVQUFnQixXQUFXO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7SUFFRCw4REFBbUIsR0FBbkI7UUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFFUyw4REFBbUIsR0FBN0IsVUFBOEIsT0FBb0I7UUFDaEQsSUFBTSxTQUFTLEdBQVcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN4QyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzlDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUMxQztRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQzs7Z0JBekNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QywrNkNBQTJEO29CQUUzRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7aUJBQ2hEOzs7Z0JBVnlCLFlBQVk7Z0JBRmUsUUFBUTtnQkEyQjFCLEtBQUssdUJBQW5DLE1BQU0sU0FBQyxlQUFlOztJQXVCM0IsdUNBQUM7Q0FBQSxBQTNDRCxDQU1zRCxxQkFBcUIsR0FxQzFFO1NBckNZLGdDQUFnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdCwgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBNQVRfRElBTE9HX0RBVEEsIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgT1RhYmxlRmlsdGVyc1N0YXR1cyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tdGFibGUtZmlsdGVyLXN0YXR1cy50eXBlJztcbmltcG9ydCB7IE9UYWJsZUJhc2VEaWFsb2dDbGFzcyB9IGZyb20gJy4uL28tdGFibGUtYmFzZS1kaWFsb2cuY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLXN0b3JlLWZpbHRlci1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1zdG9yZS1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby10YWJsZS1zdG9yZS1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZVN0b3JlRmlsdGVyRGlhbG9nQ29tcG9uZW50IGV4dGVuZHMgT1RhYmxlQmFzZURpYWxvZ0NsYXNzIHtcblxuICBmaWx0ZXJOYW1lczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICBmb3JtR3JvdXA6IEZvcm1Hcm91cCA9IG5ldyBGb3JtR3JvdXAoe1xuICAgIG5hbWU6IG5ldyBGb3JtQ29udHJvbCgnJywgW1xuICAgICAgVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAgICAgIHRoaXMuZmlsdGVyTmFtZVZhbGlkYXRvci5iaW5kKHRoaXMpXG4gICAgXSksXG4gICAgZGVzY3JpcHRpb246IG5ldyBGb3JtQ29udHJvbCgnJylcbiAgfSk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9UYWJsZVN0b3JlRmlsdGVyRGlhbG9nQ29tcG9uZW50PixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBBcnJheTxzdHJpbmc+XG4gICkge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgICB0aGlzLnNldEZvcm1Db250cm9sKHRoaXMuZm9ybUdyb3VwLmdldCgnbmFtZScpKTtcbiAgICB0aGlzLmxvYWRGaWx0ZXJOYW1lcyhkYXRhKTtcbiAgfVxuXG4gIGxvYWRGaWx0ZXJOYW1lcyhmaWx0ZXJOYW1lcyk6IHZvaWQge1xuICAgIHRoaXMuZmlsdGVyTmFtZXMgPSBmaWx0ZXJOYW1lcztcbiAgfVxuXG4gIGdldEZpbHRlckF0dHJpYnV0ZXMoKTogT1RhYmxlRmlsdGVyc1N0YXR1cyB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybUdyb3VwLnZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGZpbHRlck5hbWVWYWxpZGF0b3IoY29udHJvbDogRm9ybUNvbnRyb2wpIHtcbiAgICBjb25zdCBjdHJsVmFsdWU6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgaWYgKHRoaXMuZmlsdGVyTmFtZXMuaW5kZXhPZihjdHJsVmFsdWUpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHsgZmlsdGVyTmFtZUFscmVhZHlFeGlzdHM6IHRydWUgfTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbn1cbiJdfQ==