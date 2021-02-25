import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services/dialog.service';
var OTableApplyConfigurationDialogComponent = (function () {
    function OTableApplyConfigurationDialogComponent(dialogRef, data, injector) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.default_configuration = 'OTableApplyConfigurationDialogComponent-default';
        this.configurations = [];
        this.onDelete = new EventEmitter();
        this.loadConfigurations(data);
        this.dialogService = this.injector.get(DialogService);
    }
    OTableApplyConfigurationDialogComponent.prototype.ngOnInit = function () {
        this.configurationList.selectedOptions = new SelectionModel(false);
    };
    OTableApplyConfigurationDialogComponent.prototype.loadConfigurations = function (configurations) {
        this.configurations = configurations;
    };
    OTableApplyConfigurationDialogComponent.prototype.removeConfiguration = function (configurationName) {
        var _this = this;
        this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_CONFIGURATION').then(function (result) {
            if (result) {
                _this.onDelete.emit(configurationName);
            }
        });
    };
    OTableApplyConfigurationDialogComponent.prototype.isDefaultConfigurationSelected = function () {
        var selected = this.configurationList.selectedOptions.selected;
        var selectedValue = selected.length ? selected[0].value : void 0;
        return selectedValue === this.default_configuration;
    };
    OTableApplyConfigurationDialogComponent.prototype.getSelectedConfigurationName = function () {
        var selected = this.configurationList.selectedOptions.selected;
        return selected.length ? selected[0].value : void 0;
    };
    OTableApplyConfigurationDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-apply-configuration-dialog',
                    template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.APPLY_CONFIGURATION' | oTranslate }}</span>\n\n<mat-dialog-content fxLayout=\"column\">\n  <div mat-subheader>{{ 'TABLE.DIALOG.APPLY_CONFIGURATION' | oTranslate }}</div>\n  <mat-selection-list #configurationList dense class=\"o-table-apply-configuration-dialog-list\">\n    <mat-list-option checkboxPosition=\"before\" [value]=\"default_configuration\">\n      <span matLine class=\"o-table-apply-configuration-dialog-list-title\">{{ 'TABLE.DIALOG.APPLY_CONFIGURATION_DEFAULT' | oTranslate }}</span>\n      <span matLine>{{ 'TABLE.DIALOG.APPLY_CONFIGURATION_DEFAULT_DESCRIPTION' | oTranslate }}</span>\n    </mat-list-option>\n    <mat-list-option checkboxPosition=\"before\" *ngFor=\"let configuration of configurations; let i = index\" [value]=\"configuration.name\">\n      <span matLine>{{ configuration.name }}</span>\n      <span matLine>{{ configuration.description }}</span>\n    </mat-list-option>\n  </mat-selection-list>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button [disabled]=\"configurationList.selectedOptions.selected.length!==1 || isDefaultConfigurationSelected()\"\n    (click)=\"removeConfiguration(configurationList.selectedOptions.selected[0].value)\">\n    {{ 'DELETE' | oTranslate | uppercase }}\n  </button>\n  <span fxFlex></span>\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"true\"\n    [disabled]=\"configurationList.selectedOptions.selected.length!==1\">{{ 'OK' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                    styles: [""]
                }] }
    ];
    OTableApplyConfigurationDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: Array, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
        { type: Injector }
    ]; };
    OTableApplyConfigurationDialogComponent.propDecorators = {
        configurationList: [{ type: ViewChild, args: [MatSelectionList, { static: true },] }]
    };
    return OTableApplyConfigurationDialogComponent;
}());
export { OTableApplyConfigurationDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1hcHBseS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kaWFsb2cvYXBwbHktY29uZmlndXJhdGlvbi9vLXRhYmxlLWFwcGx5LWNvbmZpZ3VyYXRpb24tZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQWlCLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBR3ZFO0lBaUJFLGlEQUNTLFNBQWdFLEVBQzlDLElBQTJCLEVBQzFDLFFBQWtCO1FBRnJCLGNBQVMsR0FBVCxTQUFTLENBQXVEO1FBRTdELGFBQVEsR0FBUixRQUFRLENBQVU7UUFidkIsMEJBQXFCLEdBQUcsaURBQWlELENBQUM7UUFDMUUsbUJBQWMsR0FBMEIsRUFBRSxDQUFDO1FBRTNDLGFBQVEsR0FBeUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVl6RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRU0sMERBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWdCLEtBQUssQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFTSxvRUFBa0IsR0FBekIsVUFBMEIsY0FBcUM7UUFDN0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDdkMsQ0FBQztJQUVNLHFFQUFtQixHQUExQixVQUEyQixpQkFBeUI7UUFBcEQsaUJBTUM7UUFMQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsMkNBQTJDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO1lBQzVGLElBQUksTUFBTSxFQUFFO2dCQUNWLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDdkM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSxnRkFBOEIsR0FBckM7UUFDRSxJQUFNLFFBQVEsR0FBb0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFDbEYsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkUsT0FBTyxhQUFhLEtBQUssSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3RELENBQUM7SUFFTSw4RUFBNEIsR0FBbkM7UUFDRSxJQUFNLFFBQVEsR0FBb0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFDbEYsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDOztnQkFuREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQ0FBb0M7b0JBQzlDLCtxREFBa0U7O2lCQUVuRTs7O2dCQVR5QixZQUFZOzRDQXdCakMsTUFBTSxTQUFDLGVBQWU7Z0JBekJlLFFBQVE7OztvQ0FrQi9DLFNBQVMsU0FBQyxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0lBeUMvQyw4Q0FBQztDQUFBLEFBckRELElBcURDO1NBaERZLHVDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIEluamVjdG9yLCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYsIE1hdExpc3RPcHRpb24sIE1hdFNlbGVjdGlvbkxpc3QgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby10YWJsZS1jb25maWd1cmF0aW9uLnR5cGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWFwcGx5LWNvbmZpZ3VyYXRpb24tZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tdGFibGUtYXBwbHktY29uZmlndXJhdGlvbi1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLWFwcGx5LWNvbmZpZ3VyYXRpb24tZGlhbG9nLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlQXBwbHlDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBwdWJsaWMgZGVmYXVsdF9jb25maWd1cmF0aW9uID0gJ09UYWJsZUFwcGx5Q29uZmlndXJhdGlvbkRpYWxvZ0NvbXBvbmVudC1kZWZhdWx0JztcbiAgcHVibGljIGNvbmZpZ3VyYXRpb25zOiBPVGFibGVDb25maWd1cmF0aW9uW10gPSBbXTtcblxuICBwdWJsaWMgb25EZWxldGU6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoTWF0U2VsZWN0aW9uTGlzdCwgeyBzdGF0aWM6IHRydWUgfSlcbiAgcHJvdGVjdGVkIGNvbmZpZ3VyYXRpb25MaXN0OiBNYXRTZWxlY3Rpb25MaXN0O1xuXG4gIHByb3RlY3RlZCBkaWFsb2dTZXJ2aWNlOiBEaWFsb2dTZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxPVGFibGVBcHBseUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBPVGFibGVDb25maWd1cmF0aW9uW10sXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLmxvYWRDb25maWd1cmF0aW9ucyhkYXRhKTtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb25MaXN0LnNlbGVjdGVkT3B0aW9ucyA9IG5ldyBTZWxlY3Rpb25Nb2RlbDxNYXRMaXN0T3B0aW9uPihmYWxzZSk7XG4gIH1cblxuICBwdWJsaWMgbG9hZENvbmZpZ3VyYXRpb25zKGNvbmZpZ3VyYXRpb25zOiBPVGFibGVDb25maWd1cmF0aW9uW10pOiB2b2lkIHtcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb25zID0gY29uZmlndXJhdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlQ29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnVEFCTEUuRElBTE9HLkNPTkZJUk1fUkVNT1ZFX0NPTkZJR1VSQVRJT04nKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMub25EZWxldGUuZW1pdChjb25maWd1cmF0aW9uTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgaXNEZWZhdWx0Q29uZmlndXJhdGlvblNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHNlbGVjdGVkOiBNYXRMaXN0T3B0aW9uW10gPSB0aGlzLmNvbmZpZ3VyYXRpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3RlZDtcbiAgICBjb25zdCBzZWxlY3RlZFZhbHVlID0gc2VsZWN0ZWQubGVuZ3RoID8gc2VsZWN0ZWRbMF0udmFsdWUgOiB2b2lkIDA7XG4gICAgcmV0dXJuIHNlbGVjdGVkVmFsdWUgPT09IHRoaXMuZGVmYXVsdF9jb25maWd1cmF0aW9uO1xuICB9XG5cbiAgcHVibGljIGdldFNlbGVjdGVkQ29uZmlndXJhdGlvbk5hbWUoKTogc3RyaW5nIHtcbiAgICBjb25zdCBzZWxlY3RlZDogTWF0TGlzdE9wdGlvbltdID0gdGhpcy5jb25maWd1cmF0aW9uTGlzdC5zZWxlY3RlZE9wdGlvbnMuc2VsZWN0ZWQ7XG4gICAgcmV0dXJuIHNlbGVjdGVkLmxlbmd0aCA/IHNlbGVjdGVkWzBdLnZhbHVlIDogdm9pZCAwO1xuICB9XG5cbn1cbiJdfQ==