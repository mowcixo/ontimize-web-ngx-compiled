import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OTableBaseDialogClass } from '../o-table-base-dialog.class';
export class OTableStoreFilterDialogComponent extends OTableBaseDialogClass {
    constructor(dialogRef, injector, data) {
        super(injector);
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.filterNames = [];
        this.formGroup = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                this.filterNameValidator.bind(this)
            ]),
            description: new FormControl('')
        });
        this.setFormControl(this.formGroup.get('name'));
        this.loadFilterNames(data);
    }
    loadFilterNames(filterNames) {
        this.filterNames = filterNames;
    }
    getFilterAttributes() {
        return this.formGroup.value;
    }
    filterNameValidator(control) {
        const ctrlValue = control.value;
        if (this.filterNames.indexOf(ctrlValue) !== -1) {
            return { filterNameAlreadyExists: true };
        }
        return {};
    }
}
OTableStoreFilterDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-store-filter-dialog',
                template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.SAVE_FILTER' | oTranslate }}</span>\n\n<mat-dialog-content>\n  <div mat-subheader>{{ 'TABLE.DIALOG.SAVE_FILTER' | oTranslate }}</div>\n  <form #form [formGroup]=\"formGroup\" fxLayout=\"column\">\n    <mat-form-field>\n      <input matInput [matTooltip]=\"tooltipText\" [matTooltipClass]=\"tooltipClass\" placeholder=\"{{ 'TABLE.DIALOG.FILTER_NAME' | oTranslate }}\"\n        formControlName=\"name\" required>\n      <mat-error *ngIf=\"formGroup.controls['name'].hasError('filterNameAlreadyExists')\" text=\"{{ 'TABLE.DIALOG.FILTER_NAME_ALREADY_EXISTS' | oTranslate }}\"></mat-error>\n      <mat-error *ngIf=\"formGroup.controls['name'].hasError('required')\" text=\"{{ 'FORM_VALIDATION.REQUIRED' | oTranslate }}\"></mat-error>\n    </mat-form-field>\n    <mat-form-field class=\"example-full-width\">\n      <textarea matInput placeholder=\"{{ 'TABLE.DIALOG.FILTER_DESCRIPTION' | oTranslate }}\" formControlName=\"description\" rows=\"4\" cols=\"50\"></textarea>\n    </mat-form-field>\n  </form>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\" [disabled]=\"!formGroup.valid\">{{'SAVE' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>",
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [""]
            }] }
];
OTableStoreFilterDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: Injector },
    { type: Array, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1zdG9yZS1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9zdG9yZS1maWx0ZXIvby10YWJsZS1zdG9yZS1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckYsT0FBTyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUdsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQVFyRSxNQUFNLE9BQU8sZ0NBQWlDLFNBQVEscUJBQXFCO0lBV3pFLFlBQ1MsU0FBeUQsRUFDdEQsUUFBa0IsRUFDSCxJQUFtQjtRQUU1QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFKVCxjQUFTLEdBQVQsU0FBUyxDQUFnRDtRQUN0RCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBWDlCLGdCQUFXLEdBQWtCLEVBQUUsQ0FBQztRQUNoQyxjQUFTLEdBQWMsSUFBSSxTQUFTLENBQUM7WUFDbkMsSUFBSSxFQUFFLElBQUksV0FBVyxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsVUFBVSxDQUFDLFFBQVE7Z0JBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ3BDLENBQUM7WUFDRixXQUFXLEVBQUUsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQVFELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxlQUFlLENBQUMsV0FBVztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUNqQyxDQUFDO0lBRUQsbUJBQW1CO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVTLG1CQUFtQixDQUFDLE9BQW9CO1FBQ2hELE1BQU0sU0FBUyxHQUFXLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDeEMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM5QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxFQUFFLENBQUM7U0FDMUM7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7OztZQXpDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDZCQUE2QjtnQkFDdkMsKzZDQUEyRDtnQkFFM0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7WUFWeUIsWUFBWTtZQUZlLFFBQVE7WUEyQjFCLEtBQUssdUJBQW5DLE1BQU0sU0FBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5qZWN0LCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgVmFsaWRhdG9ycyB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSwgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBPVGFibGVGaWx0ZXJzU3RhdHVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby10YWJsZS1maWx0ZXItc3RhdHVzLnR5cGUnO1xuaW1wb3J0IHsgT1RhYmxlQmFzZURpYWxvZ0NsYXNzIH0gZnJvbSAnLi4vby10YWJsZS1iYXNlLWRpYWxvZy5jbGFzcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtc3RvcmUtZmlsdGVyLWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLXN0b3JlLWZpbHRlci1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLXN0b3JlLWZpbHRlci1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlU3RvcmVGaWx0ZXJEaWFsb2dDb21wb25lbnQgZXh0ZW5kcyBPVGFibGVCYXNlRGlhbG9nQ2xhc3Mge1xuXG4gIGZpbHRlck5hbWVzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIGZvcm1Hcm91cDogRm9ybUdyb3VwID0gbmV3IEZvcm1Hcm91cCh7XG4gICAgbmFtZTogbmV3IEZvcm1Db250cm9sKCcnLCBbXG4gICAgICBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICAgICAgdGhpcy5maWx0ZXJOYW1lVmFsaWRhdG9yLmJpbmQodGhpcylcbiAgICBdKSxcbiAgICBkZXNjcmlwdGlvbjogbmV3IEZvcm1Db250cm9sKCcnKVxuICB9KTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T1RhYmxlU3RvcmVGaWx0ZXJEaWFsb2dDb21wb25lbnQ+LFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IEFycmF5PHN0cmluZz5cbiAgKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMuc2V0Rm9ybUNvbnRyb2wodGhpcy5mb3JtR3JvdXAuZ2V0KCduYW1lJykpO1xuICAgIHRoaXMubG9hZEZpbHRlck5hbWVzKGRhdGEpO1xuICB9XG5cbiAgbG9hZEZpbHRlck5hbWVzKGZpbHRlck5hbWVzKTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJOYW1lcyA9IGZpbHRlck5hbWVzO1xuICB9XG5cbiAgZ2V0RmlsdGVyQXR0cmlidXRlcygpOiBPVGFibGVGaWx0ZXJzU3RhdHVzIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtR3JvdXAudmFsdWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgZmlsdGVyTmFtZVZhbGlkYXRvcihjb250cm9sOiBGb3JtQ29udHJvbCkge1xuICAgIGNvbnN0IGN0cmxWYWx1ZTogc3RyaW5nID0gY29udHJvbC52YWx1ZTtcbiAgICBpZiAodGhpcy5maWx0ZXJOYW1lcy5pbmRleE9mKGN0cmxWYWx1ZSkgIT09IC0xKSB7XG4gICAgICByZXR1cm4geyBmaWx0ZXJOYW1lQWxyZWFkeUV4aXN0czogdHJ1ZSB9O1xuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH1cblxufVxuIl19