import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Injector, ViewChild, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services/dialog.service';
export class OTableLoadFilterDialogComponent {
    constructor(dialogRef, data, injector) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.filters = [];
        this.onDelete = new EventEmitter();
        this.loadFilters(data);
        this.dialogService = this.injector.get(DialogService);
        try {
            this.cd = this.injector.get(ChangeDetectorRef);
        }
        catch (e) {
        }
    }
    ngOnInit() {
        this.filterList.selectedOptions = new SelectionModel(false);
    }
    loadFilters(filters) {
        this.filters = filters;
    }
    getSelectedFilterName() {
        const selected = this.filterList.selectedOptions.selected;
        return selected.length ? selected[0].value : void 0;
    }
    removeFilter(filterName) {
        this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_FILTER').then(result => {
            if (result) {
                this.onDelete.emit(filterName);
                this.cd.detectChanges();
            }
        });
    }
}
OTableLoadFilterDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-load-filter-dialog',
                template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.FILTER_LOAD' | oTranslate }}</span>\n<mat-dialog-content fxLayout=\"column\">\n  <div mat-subheader>{{ 'TABLE.DIALOG.LOAD_FILTER' | oTranslate }}</div>\n  <mat-selection-list #filterList dense class=\"o-table-load-filter-dialog-list\">\n    <mat-list-option *ngFor=\"let filter of filters \" [value]=\"filter.name\" checkboxPosition=\"before\">\n      <span matLine class=\"o-table-load-filter-dialog-list-title\">{{ filter.name }}</span>\n      <span matLine>{{ filter.description }}</span>\n    </mat-list-option>\n    <mat-list-item *ngIf=\"filters.length === 0\">\n      <span class=\"empty-filter-list\">{{ 'TABLE.DIALOG.EMPTY_FILTER_LIST' | oTranslate }}</span>\n    </mat-list-item>\n  </mat-selection-list>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button [disabled]=\"filterList.selectedOptions.selected.length!==1\"\n    (click)=\"removeFilter(filterList.selectedOptions.selected[0].value)\">{{ 'DELETE' | oTranslate | uppercase }}</button>\n  <span fxFlex></span>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\"\n    [disabled]=\"filterList.selectedOptions.selected.length!==1\">{{ 'TABLE.BUTTONS.APPLY' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [""]
            }] }
];
OTableLoadFilterDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: Array, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
    { type: Injector }
];
OTableLoadFilterDialogComponent.propDecorators = {
    filterList: [{ type: ViewChild, args: [MatSelectionList, { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1sb2FkLWZpbHRlci1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvZGlhbG9nL2xvYWQtZmlsdGVyL28tdGFibGUtbG9hZC1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sUUFBUSxFQUVSLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBaUIsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFTdkUsTUFBTSxPQUFPLCtCQUErQjtJQVcxQyxZQUNTLFNBQXdELEVBQ3RDLElBQWdDLEVBQy9DLFFBQWtCO1FBRnJCLGNBQVMsR0FBVCxTQUFTLENBQStDO1FBRXJELGFBQVEsR0FBUixRQUFRLENBQVU7UUFWOUIsWUFBTyxHQUErQixFQUFFLENBQUM7UUFFekMsYUFBUSxHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBVWxELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0RCxJQUFJO1lBQ0YsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxDQUFDLEVBQUU7U0FFWDtJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQWdCLEtBQUssQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBbUM7UUFDN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELHFCQUFxQjtRQUNuQixNQUFNLFFBQVEsR0FBb0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO1FBQzNFLE9BQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELFlBQVksQ0FBQyxVQUFrQjtRQUM3QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsb0NBQW9DLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEYsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDekI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OztZQW5ERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtnQkFDdEMseThDQUEwRDtnQkFFMUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O2FBQ2hEOzs7WUFWeUIsWUFBWTtZQXdCSCxLQUFLLHVCQUFuQyxNQUFNLFNBQUMsZUFBZTtZQTVCekIsUUFBUTs7O3lCQWlCUCxTQUFTLFNBQUMsZ0JBQWdCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VsZWN0aW9uTW9kZWwgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgT25Jbml0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYsIE1hdExpc3RPcHRpb24sIE1hdFNlbGVjdGlvbkxpc3QgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVGaWx0ZXJzU3RhdHVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvby10YWJsZS1maWx0ZXItc3RhdHVzLnR5cGUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLWxvYWQtZmlsdGVyLWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLXRhYmxlLWxvYWQtZmlsdGVyLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tdGFibGUtbG9hZC1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIE9UYWJsZUxvYWRGaWx0ZXJEaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gIEBWaWV3Q2hpbGQoTWF0U2VsZWN0aW9uTGlzdCwgeyBzdGF0aWM6IHRydWUgfSkgZmlsdGVyTGlzdDogTWF0U2VsZWN0aW9uTGlzdDtcblxuICBmaWx0ZXJzOiBBcnJheTxPVGFibGVGaWx0ZXJzU3RhdHVzPiA9IFtdO1xuXG4gIG9uRGVsZXRlOiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcbiAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T1RhYmxlTG9hZEZpbHRlckRpYWxvZ0NvbXBvbmVudD4sXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IEFycmF5PE9UYWJsZUZpbHRlcnNTdGF0dXM+LFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgdGhpcy5sb2FkRmlsdGVycyhkYXRhKTtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChEaWFsb2dTZXJ2aWNlKTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5jZCA9IHRoaXMuaW5qZWN0b3IuZ2V0KENoYW5nZURldGVjdG9yUmVmKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBubyBwYXJlbnQgZm9ybVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZmlsdGVyTGlzdC5zZWxlY3RlZE9wdGlvbnMgPSBuZXcgU2VsZWN0aW9uTW9kZWw8TWF0TGlzdE9wdGlvbj4oZmFsc2UpO1xuICB9XG5cbiAgbG9hZEZpbHRlcnMoZmlsdGVyczogQXJyYXk8T1RhYmxlRmlsdGVyc1N0YXR1cz4pOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlcnMgPSBmaWx0ZXJzO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGaWx0ZXJOYW1lKCk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2VsZWN0ZWQ6IE1hdExpc3RPcHRpb25bXSA9IHRoaXMuZmlsdGVyTGlzdC5zZWxlY3RlZE9wdGlvbnMuc2VsZWN0ZWQ7XG4gICAgcmV0dXJuIHNlbGVjdGVkLmxlbmd0aCA/IHNlbGVjdGVkWzBdLnZhbHVlIDogdm9pZCAwO1xuICB9XG5cbiAgcmVtb3ZlRmlsdGVyKGZpbHRlck5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ1RBQkxFLkRJQUxPRy5DT05GSVJNX1JFTU9WRV9GSUxURVInKS50aGVuKHJlc3VsdCA9PiB7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMub25EZWxldGUuZW1pdChmaWx0ZXJOYW1lKTtcbiAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufVxuIl19