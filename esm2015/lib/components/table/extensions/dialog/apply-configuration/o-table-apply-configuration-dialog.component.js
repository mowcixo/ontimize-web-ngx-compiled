import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, Injector, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services/dialog.service';
export class OTableApplyConfigurationDialogComponent {
    constructor(dialogRef, data, injector) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.default_configuration = 'OTableApplyConfigurationDialogComponent-default';
        this.configurations = [];
        this.onDelete = new EventEmitter();
        this.loadConfigurations(data);
        this.dialogService = this.injector.get(DialogService);
    }
    ngOnInit() {
        this.configurationList.selectedOptions = new SelectionModel(false);
    }
    loadConfigurations(configurations) {
        this.configurations = configurations;
    }
    removeConfiguration(configurationName) {
        this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_CONFIGURATION').then(result => {
            if (result) {
                this.onDelete.emit(configurationName);
            }
        });
    }
    isDefaultConfigurationSelected() {
        const selected = this.configurationList.selectedOptions.selected;
        const selectedValue = selected.length ? selected[0].value : void 0;
        return selectedValue === this.default_configuration;
    }
    getSelectedConfigurationName() {
        const selected = this.configurationList.selectedOptions.selected;
        return selected.length ? selected[0].value : void 0;
    }
}
OTableApplyConfigurationDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-apply-configuration-dialog',
                template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.APPLY_CONFIGURATION' | oTranslate }}</span>\n\n<mat-dialog-content fxLayout=\"column\">\n  <div mat-subheader>{{ 'TABLE.DIALOG.APPLY_CONFIGURATION' | oTranslate }}</div>\n  <mat-selection-list #configurationList dense class=\"o-table-apply-configuration-dialog-list\">\n    <mat-list-option checkboxPosition=\"before\" [value]=\"default_configuration\">\n      <span matLine class=\"o-table-apply-configuration-dialog-list-title\">{{ 'TABLE.DIALOG.APPLY_CONFIGURATION_DEFAULT' | oTranslate }}</span>\n      <span matLine>{{ 'TABLE.DIALOG.APPLY_CONFIGURATION_DEFAULT_DESCRIPTION' | oTranslate }}</span>\n    </mat-list-option>\n    <mat-list-option checkboxPosition=\"before\" *ngFor=\"let configuration of configurations; let i = index\" [value]=\"configuration.name\">\n      <span matLine>{{ configuration.name }}</span>\n      <span matLine>{{ configuration.description }}</span>\n    </mat-list-option>\n  </mat-selection-list>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button [disabled]=\"configurationList.selectedOptions.selected.length!==1 || isDefaultConfigurationSelected()\"\n    (click)=\"removeConfiguration(configurationList.selectedOptions.selected[0].value)\">\n    {{ 'DELETE' | oTranslate | uppercase }}\n  </button>\n  <span fxFlex></span>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\"\n    [disabled]=\"configurationList.selectedOptions.selected.length!==1\">{{ 'OK' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                styles: [""]
            }] }
];
OTableApplyConfigurationDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: Array, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
    { type: Injector }
];
OTableApplyConfigurationDialogComponent.propDecorators = {
    configurationList: [{ type: ViewChild, args: [MatSelectionList, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1hcHBseS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kaWFsb2cvYXBwbHktY29uZmlndXJhdGlvbi9vLXRhYmxlLWFwcGx5LWNvbmZpZ3VyYXRpb24tZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBVSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDN0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxZQUFZLEVBQWlCLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkcsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBUXZFLE1BQU0sT0FBTyx1Q0FBdUM7SUFZbEQsWUFDUyxTQUFnRSxFQUM5QyxJQUEyQixFQUMxQyxRQUFrQjtRQUZyQixjQUFTLEdBQVQsU0FBUyxDQUF1RDtRQUU3RCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBYnZCLDBCQUFxQixHQUFHLGlEQUFpRCxDQUFDO1FBQzFFLG1CQUFjLEdBQTBCLEVBQUUsQ0FBQztRQUUzQyxhQUFRLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFZekQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxHQUFHLElBQUksY0FBYyxDQUFnQixLQUFLLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRU0sa0JBQWtCLENBQUMsY0FBcUM7UUFDN0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDdkMsQ0FBQztJQUVNLG1CQUFtQixDQUFDLGlCQUF5QjtRQUNsRCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsMkNBQTJDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0YsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUN2QztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLDhCQUE4QjtRQUNuQyxNQUFNLFFBQVEsR0FBb0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUM7UUFDbEYsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkUsT0FBTyxhQUFhLEtBQUssSUFBSSxDQUFDLHFCQUFxQixDQUFDO0lBQ3RELENBQUM7SUFFTSw0QkFBNEI7UUFDakMsTUFBTSxRQUFRLEdBQW9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO1FBQ2xGLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7O1lBbkRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0NBQW9DO2dCQUM5QywydERBQWtFOzthQUVuRTs7O1lBVHlCLFlBQVk7d0NBd0JqQyxNQUFNLFNBQUMsZUFBZTtZQXpCZSxRQUFROzs7Z0NBa0IvQyxTQUFTLFNBQUMsZ0JBQWdCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5qZWN0b3IsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRElBTE9HX0RBVEEsIE1hdERpYWxvZ1JlZiwgTWF0TGlzdE9wdGlvbiwgTWF0U2VsZWN0aW9uTGlzdCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgRGlhbG9nU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlJztcbmltcG9ydCB7IE9UYWJsZUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi8uLi8uLi8uLi90eXBlcy9vLXRhYmxlLWNvbmZpZ3VyYXRpb24udHlwZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tdGFibGUtYXBwbHktY29uZmlndXJhdGlvbi1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1hcHBseS1jb25maWd1cmF0aW9uLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtYXBwbHktY29uZmlndXJhdGlvbi1kaWFsb2cuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVBcHBseUNvbmZpZ3VyYXRpb25EaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIHB1YmxpYyBkZWZhdWx0X2NvbmZpZ3VyYXRpb24gPSAnT1RhYmxlQXBwbHlDb25maWd1cmF0aW9uRGlhbG9nQ29tcG9uZW50LWRlZmF1bHQnO1xuICBwdWJsaWMgY29uZmlndXJhdGlvbnM6IE9UYWJsZUNvbmZpZ3VyYXRpb25bXSA9IFtdO1xuXG4gIHB1YmxpYyBvbkRlbGV0ZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQFZpZXdDaGlsZChNYXRTZWxlY3Rpb25MaXN0LCB7IHN0YXRpYzogdHJ1ZSB9KVxuICBwcm90ZWN0ZWQgY29uZmlndXJhdGlvbkxpc3Q6IE1hdFNlbGVjdGlvbkxpc3Q7XG5cbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9UYWJsZUFwcGx5Q29uZmlndXJhdGlvbkRpYWxvZ0NvbXBvbmVudD4sXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IE9UYWJsZUNvbmZpZ3VyYXRpb25bXSxcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMubG9hZENvbmZpZ3VyYXRpb25zKGRhdGEpO1xuICAgIHRoaXMuZGlhbG9nU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICB9XG5cbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdExpc3RPcHRpb24+KGZhbHNlKTtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkQ29uZmlndXJhdGlvbnMoY29uZmlndXJhdGlvbnM6IE9UYWJsZUNvbmZpZ3VyYXRpb25bXSk6IHZvaWQge1xuICAgIHRoaXMuY29uZmlndXJhdGlvbnMgPSBjb25maWd1cmF0aW9ucztcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25OYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdUQUJMRS5ESUFMT0cuQ09ORklSTV9SRU1PVkVfQ09ORklHVVJBVElPTicpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy5vbkRlbGV0ZS5lbWl0KGNvbmZpZ3VyYXRpb25OYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBpc0RlZmF1bHRDb25maWd1cmF0aW9uU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgc2VsZWN0ZWQ6IE1hdExpc3RPcHRpb25bXSA9IHRoaXMuY29uZmlndXJhdGlvbkxpc3Quc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkO1xuICAgIGNvbnN0IHNlbGVjdGVkVmFsdWUgPSBzZWxlY3RlZC5sZW5ndGggPyBzZWxlY3RlZFswXS52YWx1ZSA6IHZvaWQgMDtcbiAgICByZXR1cm4gc2VsZWN0ZWRWYWx1ZSA9PT0gdGhpcy5kZWZhdWx0X2NvbmZpZ3VyYXRpb247XG4gIH1cblxuICBwdWJsaWMgZ2V0U2VsZWN0ZWRDb25maWd1cmF0aW9uTmFtZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNlbGVjdGVkOiBNYXRMaXN0T3B0aW9uW10gPSB0aGlzLmNvbmZpZ3VyYXRpb25MaXN0LnNlbGVjdGVkT3B0aW9ucy5zZWxlY3RlZDtcbiAgICByZXR1cm4gc2VsZWN0ZWQubGVuZ3RoID8gc2VsZWN0ZWRbMF0udmFsdWUgOiB2b2lkIDA7XG4gIH1cblxufVxuIl19