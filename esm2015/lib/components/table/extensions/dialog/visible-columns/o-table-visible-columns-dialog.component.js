import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
export class OTableVisibleColumnsDialogComponent {
    constructor(injector, dialogRef, data) {
        this.injector = injector;
        this.dialogRef = dialogRef;
        this.columns = [];
        this.rowHeight = Codes.DEFAULT_ROW_HEIGHT;
        try {
            this.cd = this.injector.get(ChangeDetectorRef);
        }
        catch (e) {
        }
        if (Util.isArray(data.columnsData) && Util.isArray(data.visibleColumns)) {
            data.columnsData.forEach((oCol) => {
                this.columns.push({
                    attr: oCol.attr,
                    title: oCol.title,
                    visible: oCol.visible,
                    showInList: data.visibleColumns.indexOf(oCol.attr) !== -1 || oCol.definition !== undefined
                });
            });
        }
        if (Util.isDefined(data.rowHeight)) {
            this.rowHeight = data.rowHeight;
        }
    }
    getVisibleColumns() {
        return this.columns.filter(col => col.visible).map(col => col.attr);
    }
    getColumnsOrder() {
        return this.columns.map(col => col.attr);
    }
    onClickColumn(col) {
        col.visible = !col.visible;
    }
    drop(event) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }
}
OTableVisibleColumnsDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-visible-columns-dialog',
                template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.COLVIS' | oTranslate }}</span>\n\n<mat-dialog-content>\n  <div cdkDropList (cdkDropListDropped)=\"drop($event)\" [ngClass]=\"rowHeight\">\n    <mat-list *ngFor=\"let column of columns\" cdkDrag>\n      <mat-list-item *ngIf=\"column.showInList\" (click)=\"onClickColumn(column)\">\n        <mat-icon mat-list-icon svgIcon=\"ontimize:drag_handle\"></mat-icon>\n        <span mat-line>{{ (column.title || column.attr) | oTranslate }}</span>\n        <mat-icon *ngIf=\"column.visible\" svgIcon=\"ontimize:visibility\"></mat-icon>\n        <mat-icon *ngIf=\"!column.visible\" svgIcon=\"ontimize:visibility_off\"></mat-icon>\n      </mat-list-item>\n    </mat-list>\n  </div>\n</mat-dialog-content>\n\n<mat-dialog-actions fxLayoutAlign=\"end center\">\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"true\">{{ 'ACCEPT' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class.o-table-visible-columns-dialog]': 'true'
                },
                styles: [".o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content{overflow:auto;padding-top:0;margin-top:24px}.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-list .cdk-drag-preview,.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-list .mat-list-item{cursor:pointer;height:auto}.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-list .cdk-drag-preview .mat-list-item-content,.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-list .mat-list-item .mat-list-item-content{padding:0}.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-list .cdk-drag-preview .mat-list-item-content div.mat-list-text,.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-list .mat-list-item .mat-list-item-content div.mat-list-text{padding:0 8px}.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-icon[svgicon=\"ontimize:drag_handle\"]{cursor:move}.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-icon[svgicon=\"ontimize:visibility\"],.o-table-visible-columns-dialog .mat-dialog-content.mat-dialog-content .mat-icon[svgicon=\"ontimize:visibility_off\"]{width:32px}"]
            }] }
];
OTableVisibleColumnsDialogComponent.ctorParameters = () => [
    { type: Injector },
    { type: MatDialogRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS12aXNpYmxlLWNvbHVtbnMtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy92aXNpYmxlLWNvbHVtbnMvby10YWJsZS12aXNpYmxlLWNvbHVtbnMtZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQWFoRCxNQUFNLE9BQU8sbUNBQW1DO0lBTTlDLFlBQ1ksUUFBa0IsRUFDckIsU0FBNEQsRUFDMUMsSUFBUztRQUZ4QixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3JCLGNBQVMsR0FBVCxTQUFTLENBQW1EO1FBTnJFLFlBQU8sR0FBZSxFQUFFLENBQUM7UUFFekIsY0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztRQU8zQyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxDQUFDLEVBQUU7U0FFWDtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDdkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFhLEVBQUUsRUFBRTtnQkFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztvQkFDckIsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVM7aUJBQzNGLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELGFBQWEsQ0FBQyxHQUFZO1FBQ3hCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBNEI7UUFDL0IsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDekUsQ0FBQzs7O1lBdkRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0NBQWdDO2dCQUMxQyw0aUNBQTREO2dCQUU1RCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRTtvQkFDSix3Q0FBd0MsRUFBRSxNQUFNO2lCQUNqRDs7YUFDRjs7O1lBaEJ1RSxRQUFRO1lBQ3RELFlBQVk7NENBeUJqQyxNQUFNLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENka0RyYWdEcm9wLCBtb3ZlSXRlbUluQXJyYXkgfSBmcm9tICdAYW5ndWxhci9jZGsvZHJhZy1kcm9wJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBJbmplY3QsIEluamVjdG9yLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9Db2x1bW4gfSBmcm9tICcuLi8uLi8uLi9jb2x1bW4vby1jb2x1bW4uY2xhc3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLXRhYmxlLXZpc2libGUtY29sdW1ucy1kaWFsb2cnLFxuICB0ZW1wbGF0ZVVybDogJ28tdGFibGUtdmlzaWJsZS1jb2x1bW5zLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWydvLXRhYmxlLXZpc2libGUtY29sdW1ucy1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tdGFibGUtdmlzaWJsZS1jb2x1bW5zLWRpYWxvZ10nOiAndHJ1ZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVWaXNpYmxlQ29sdW1uc0RpYWxvZ0NvbXBvbmVudCB7XG5cbiAgY29sdW1uczogQXJyYXk8YW55PiA9IFtdO1xuICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmO1xuICByb3dIZWlnaHQ6IHN0cmluZyA9IENvZGVzLkRFRkFVTFRfUk9XX0hFSUdIVDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxPVGFibGVWaXNpYmxlQ29sdW1uc0RpYWxvZ0NvbXBvbmVudD4sXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IGFueVxuICApIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5jZCA9IHRoaXMuaW5qZWN0b3IuZ2V0KENoYW5nZURldGVjdG9yUmVmKTsgICAgICBcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBubyBwYXJlbnQgZm9ybVxuICAgIH1cbiAgICBpZiAoVXRpbC5pc0FycmF5KGRhdGEuY29sdW1uc0RhdGEpICYmIFV0aWwuaXNBcnJheShkYXRhLnZpc2libGVDb2x1bW5zKSkgeyAgICAgIFxuICAgICAgZGF0YS5jb2x1bW5zRGF0YS5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICAgIHRoaXMuY29sdW1ucy5wdXNoKHtcbiAgICAgICAgICBhdHRyOiBvQ29sLmF0dHIsXG4gICAgICAgICAgdGl0bGU6IG9Db2wudGl0bGUsXG4gICAgICAgICAgdmlzaWJsZTogb0NvbC52aXNpYmxlLFxuICAgICAgICAgIHNob3dJbkxpc3Q6IGRhdGEudmlzaWJsZUNvbHVtbnMuaW5kZXhPZihvQ29sLmF0dHIpICE9PSAtMSB8fCBvQ29sLmRlZmluaXRpb24gIT09IHVuZGVmaW5lZFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoZGF0YS5yb3dIZWlnaHQpKSB7XG4gICAgICB0aGlzLnJvd0hlaWdodCA9IGRhdGEucm93SGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIGdldFZpc2libGVDb2x1bW5zKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbnMuZmlsdGVyKGNvbCA9PiBjb2wudmlzaWJsZSkubWFwKGNvbCA9PiBjb2wuYXR0cik7XG4gIH1cblxuICBnZXRDb2x1bW5zT3JkZXIoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuY29sdW1ucy5tYXAoY29sID0+IGNvbC5hdHRyKTtcbiAgfVxuXG4gIG9uQ2xpY2tDb2x1bW4oY29sOiBPQ29sdW1uKTogdm9pZCB7XG4gICAgY29sLnZpc2libGUgPSAhY29sLnZpc2libGU7XG4gIH1cblxuICBkcm9wKGV2ZW50OiBDZGtEcmFnRHJvcDxzdHJpbmdbXT4pIHtcbiAgICBtb3ZlSXRlbUluQXJyYXkodGhpcy5jb2x1bW5zLCBldmVudC5wcmV2aW91c0luZGV4LCBldmVudC5jdXJyZW50SW5kZXgpO1xuICB9XG59XG4iXX0=