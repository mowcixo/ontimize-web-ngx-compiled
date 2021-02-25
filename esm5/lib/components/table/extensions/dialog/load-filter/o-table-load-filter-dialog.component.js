import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Injector, ViewChild, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectionList } from '@angular/material';
import { DialogService } from '../../../../../services/dialog.service';
var OTableLoadFilterDialogComponent = (function () {
    function OTableLoadFilterDialogComponent(dialogRef, data, injector) {
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
    OTableLoadFilterDialogComponent.prototype.ngOnInit = function () {
        this.filterList.selectedOptions = new SelectionModel(false);
    };
    OTableLoadFilterDialogComponent.prototype.loadFilters = function (filters) {
        this.filters = filters;
    };
    OTableLoadFilterDialogComponent.prototype.getSelectedFilterName = function () {
        var selected = this.filterList.selectedOptions.selected;
        return selected.length ? selected[0].value : void 0;
    };
    OTableLoadFilterDialogComponent.prototype.removeFilter = function (filterName) {
        var _this = this;
        this.dialogService.confirm('CONFIRM', 'TABLE.DIALOG.CONFIRM_REMOVE_FILTER').then(function (result) {
            if (result) {
                _this.onDelete.emit(filterName);
                _this.cd.detectChanges();
            }
        });
    };
    OTableLoadFilterDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-load-filter-dialog',
                    template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.FILTER_LOAD' | oTranslate }}</span>\n<mat-dialog-content fxLayout=\"column\">\n  <div mat-subheader>{{ 'TABLE.DIALOG.LOAD_FILTER' | oTranslate }}</div>\n  <mat-selection-list #filterList dense class=\"o-table-load-filter-dialog-list\">\n    <mat-list-option *ngFor=\"let filter of filters \" [value]=\"filter.name\" checkboxPosition=\"before\">\n      <span matLine class=\"o-table-load-filter-dialog-list-title\">{{ filter.name }}</span>\n      <span matLine>{{ filter.description }}</span>\n    </mat-list-option>\n    <mat-list-item *ngIf=\"filters.length === 0\">\n      <span class=\"empty-filter-list\">{{ 'TABLE.DIALOG.EMPTY_FILTER_LIST' | oTranslate }}</span>\n    </mat-list-item>\n  </mat-selection-list>\n</mat-dialog-content>\n\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button [disabled]=\"filterList.selectedOptions.selected.length!==1\"\n    (click)=\"removeFilter(filterList.selectedOptions.selected[0].value)\">{{ 'DELETE' | oTranslate | uppercase }}</button>\n  <span fxFlex></span>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button class=\"mat-primary\" [mat-dialog-close]=\"true\"\n    [disabled]=\"filterList.selectedOptions.selected.length!==1\">{{ 'TABLE.BUTTONS.APPLY' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [""]
                }] }
    ];
    OTableLoadFilterDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: Array, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] },
        { type: Injector }
    ]; };
    OTableLoadFilterDialogComponent.propDecorators = {
        filterList: [{ type: ViewChild, args: [MatSelectionList, { static: true },] }]
    };
    return OTableLoadFilterDialogComponent;
}());
export { OTableLoadFilterDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1sb2FkLWZpbHRlci1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvZGlhbG9nL2xvYWQtZmlsdGVyL28tdGFibGUtbG9hZC1maWx0ZXItZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDMUQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixNQUFNLEVBQ04sUUFBUSxFQUVSLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBaUIsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUVuRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFHdkU7SUFpQkUseUNBQ1MsU0FBd0QsRUFDdEMsSUFBZ0MsRUFDL0MsUUFBa0I7UUFGckIsY0FBUyxHQUFULFNBQVMsQ0FBK0M7UUFFckQsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVY5QixZQUFPLEdBQStCLEVBQUUsQ0FBQztRQUV6QyxhQUFRLEdBQXlCLElBQUksWUFBWSxFQUFFLENBQUM7UUFVbEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3RELElBQUk7WUFDRixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDaEQ7UUFBQyxPQUFPLENBQUMsRUFBRTtTQUVYO0lBQ0gsQ0FBQztJQUVELGtEQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxJQUFJLGNBQWMsQ0FBZ0IsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELHFEQUFXLEdBQVgsVUFBWSxPQUFtQztRQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsK0RBQXFCLEdBQXJCO1FBQ0UsSUFBTSxRQUFRLEdBQW9CLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQztRQUMzRSxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxzREFBWSxHQUFaLFVBQWEsVUFBa0I7UUFBL0IsaUJBT0M7UUFOQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsb0NBQW9DLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO1lBQ3JGLElBQUksTUFBTSxFQUFFO2dCQUNWLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ3pCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztnQkFuREYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSw0QkFBNEI7b0JBQ3RDLHk4Q0FBMEQ7b0JBRTFELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztpQkFDaEQ7OztnQkFWeUIsWUFBWTtnQkF3QkgsS0FBSyx1QkFBbkMsTUFBTSxTQUFDLGVBQWU7Z0JBNUJ6QixRQUFROzs7NkJBaUJQLFNBQVMsU0FBQyxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O0lBNkMvQyxzQ0FBQztDQUFBLEFBckRELElBcURDO1NBL0NZLCtCQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlbGVjdGlvbk1vZGVsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uSW5pdCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSwgTWF0RGlhbG9nUmVmLCBNYXRMaXN0T3B0aW9uLCBNYXRTZWxlY3Rpb25MaXN0IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgT1RhYmxlRmlsdGVyc1N0YXR1cyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3R5cGVzL28tdGFibGUtZmlsdGVyLXN0YXR1cy50eXBlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1sb2FkLWZpbHRlci1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1sb2FkLWZpbHRlci1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLXRhYmxlLWxvYWQtZmlsdGVyLWRpYWxvZy5jb21wb25lbnQuc2NzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVMb2FkRmlsdGVyRGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcblxuICBAVmlld0NoaWxkKE1hdFNlbGVjdGlvbkxpc3QsIHsgc3RhdGljOiB0cnVlIH0pIGZpbHRlckxpc3Q6IE1hdFNlbGVjdGlvbkxpc3Q7XG5cbiAgZmlsdGVyczogQXJyYXk8T1RhYmxlRmlsdGVyc1N0YXR1cz4gPSBbXTtcblxuICBvbkRlbGV0ZTogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG4gIHByb3RlY3RlZCBjZDogQ2hhbmdlRGV0ZWN0b3JSZWY7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9UYWJsZUxvYWRGaWx0ZXJEaWFsb2dDb21wb25lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBBcnJheTxPVGFibGVGaWx0ZXJzU3RhdHVzPixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMubG9hZEZpbHRlcnMoZGF0YSk7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2QgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm8gcGFyZW50IGZvcm1cbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmZpbHRlckxpc3Quc2VsZWN0ZWRPcHRpb25zID0gbmV3IFNlbGVjdGlvbk1vZGVsPE1hdExpc3RPcHRpb24+KGZhbHNlKTtcbiAgfVxuXG4gIGxvYWRGaWx0ZXJzKGZpbHRlcnM6IEFycmF5PE9UYWJsZUZpbHRlcnNTdGF0dXM+KTogdm9pZCB7XG4gICAgdGhpcy5maWx0ZXJzID0gZmlsdGVycztcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmlsdGVyTmFtZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNlbGVjdGVkOiBNYXRMaXN0T3B0aW9uW10gPSB0aGlzLmZpbHRlckxpc3Quc2VsZWN0ZWRPcHRpb25zLnNlbGVjdGVkO1xuICAgIHJldHVybiBzZWxlY3RlZC5sZW5ndGggPyBzZWxlY3RlZFswXS52YWx1ZSA6IHZvaWQgMDtcbiAgfVxuXG4gIHJlbW92ZUZpbHRlcihmaWx0ZXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UuY29uZmlybSgnQ09ORklSTScsICdUQUJMRS5ESUFMT0cuQ09ORklSTV9SRU1PVkVfRklMVEVSJykudGhlbihyZXN1bHQgPT4ge1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLm9uRGVsZXRlLmVtaXQoZmlsdGVyTmFtZSk7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==