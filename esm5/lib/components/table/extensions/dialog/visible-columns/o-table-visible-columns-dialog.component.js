import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Codes } from '../../../../../util/codes';
import { Util } from '../../../../../util/util';
var OTableVisibleColumnsDialogComponent = (function () {
    function OTableVisibleColumnsDialogComponent(injector, dialogRef, data) {
        var _this = this;
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
            data.columnsData.forEach(function (oCol) {
                _this.columns.push({
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
    OTableVisibleColumnsDialogComponent.prototype.getVisibleColumns = function () {
        return this.columns.filter(function (col) { return col.visible; }).map(function (col) { return col.attr; });
    };
    OTableVisibleColumnsDialogComponent.prototype.getColumnsOrder = function () {
        return this.columns.map(function (col) { return col.attr; });
    };
    OTableVisibleColumnsDialogComponent.prototype.onClickColumn = function (col) {
        col.visible = !col.visible;
    };
    OTableVisibleColumnsDialogComponent.prototype.drop = function (event) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    };
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
    OTableVisibleColumnsDialogComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: MatDialogRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
    ]; };
    return OTableVisibleColumnsDialogComponent;
}());
export { OTableVisibleColumnsDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS12aXNpYmxlLWNvbHVtbnMtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy92aXNpYmxlLWNvbHVtbnMvby10YWJsZS12aXNpYmxlLWNvbHVtbnMtZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDdEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUdoRDtJQWdCRSw2Q0FDWSxRQUFrQixFQUNyQixTQUE0RCxFQUMxQyxJQUFTO1FBSHBDLGlCQXVCQztRQXRCVyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ3JCLGNBQVMsR0FBVCxTQUFTLENBQW1EO1FBTnJFLFlBQU8sR0FBZSxFQUFFLENBQUM7UUFFekIsY0FBUyxHQUFXLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQztRQU8zQyxJQUFJO1lBQ0YsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxDQUFDLEVBQUU7U0FFWDtRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDdkUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFhO2dCQUNyQyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNyQixVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUztpQkFDM0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVELCtEQUFpQixHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsT0FBTyxFQUFYLENBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEVBQVIsQ0FBUSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELDZEQUFlLEdBQWY7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksRUFBUixDQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsMkRBQWEsR0FBYixVQUFjLEdBQVk7UUFDeEIsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDN0IsQ0FBQztJQUVELGtEQUFJLEdBQUosVUFBSyxLQUE0QjtRQUMvQixlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN6RSxDQUFDOztnQkF2REYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxnQ0FBZ0M7b0JBQzFDLDRpQ0FBNEQ7b0JBRTVELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsSUFBSSxFQUFFO3dCQUNKLHdDQUF3QyxFQUFFLE1BQU07cUJBQ2pEOztpQkFDRjs7O2dCQWhCdUUsUUFBUTtnQkFDdEQsWUFBWTtnREF5QmpDLE1BQU0sU0FBQyxlQUFlOztJQXFDM0IsMENBQUM7Q0FBQSxBQXhERCxJQXdEQztTQTlDWSxtQ0FBbUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZGtEcmFnRHJvcCwgbW92ZUl0ZW1JbkFycmF5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2RyYWctZHJvcCc7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgSW5qZWN0LCBJbmplY3RvciwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSwgTWF0RGlhbG9nUmVmIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuXG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS12aXNpYmxlLWNvbHVtbnMtZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICdvLXRhYmxlLXZpc2libGUtY29sdW1ucy1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnby10YWJsZS12aXNpYmxlLWNvbHVtbnMtZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLXRhYmxlLXZpc2libGUtY29sdW1ucy1kaWFsb2ddJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlVmlzaWJsZUNvbHVtbnNEaWFsb2dDb21wb25lbnQge1xuXG4gIGNvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZjtcbiAgcm93SGVpZ2h0OiBzdHJpbmcgPSBDb2Rlcy5ERUZBVUxUX1JPV19IRUlHSFQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T1RhYmxlVmlzaWJsZUNvbHVtbnNEaWFsb2dDb21wb25lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBhbnlcbiAgKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY2QgPSB0aGlzLmluamVjdG9yLmdldChDaGFuZ2VEZXRlY3RvclJlZik7ICAgICAgXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gbm8gcGFyZW50IGZvcm1cbiAgICB9XG4gICAgaWYgKFV0aWwuaXNBcnJheShkYXRhLmNvbHVtbnNEYXRhKSAmJiBVdGlsLmlzQXJyYXkoZGF0YS52aXNpYmxlQ29sdW1ucykpIHsgICAgICBcbiAgICAgIGRhdGEuY29sdW1uc0RhdGEuZm9yRWFjaCgob0NvbDogT0NvbHVtbikgPT4ge1xuICAgICAgICB0aGlzLmNvbHVtbnMucHVzaCh7XG4gICAgICAgICAgYXR0cjogb0NvbC5hdHRyLFxuICAgICAgICAgIHRpdGxlOiBvQ29sLnRpdGxlLFxuICAgICAgICAgIHZpc2libGU6IG9Db2wudmlzaWJsZSxcbiAgICAgICAgICBzaG93SW5MaXN0OiBkYXRhLnZpc2libGVDb2x1bW5zLmluZGV4T2Yob0NvbC5hdHRyKSAhPT0gLTEgfHwgb0NvbC5kZWZpbml0aW9uICE9PSB1bmRlZmluZWRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGRhdGEucm93SGVpZ2h0KSkge1xuICAgICAgdGhpcy5yb3dIZWlnaHQgPSBkYXRhLnJvd0hlaWdodDtcbiAgICB9XG4gIH1cblxuICBnZXRWaXNpYmxlQ29sdW1ucygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5zLmZpbHRlcihjb2wgPT4gY29sLnZpc2libGUpLm1hcChjb2wgPT4gY29sLmF0dHIpO1xuICB9XG5cbiAgZ2V0Q29sdW1uc09yZGVyKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbnMubWFwKGNvbCA9PiBjb2wuYXR0cik7XG4gIH1cblxuICBvbkNsaWNrQ29sdW1uKGNvbDogT0NvbHVtbik6IHZvaWQge1xuICAgIGNvbC52aXNpYmxlID0gIWNvbC52aXNpYmxlO1xuICB9XG5cbiAgZHJvcChldmVudDogQ2RrRHJhZ0Ryb3A8c3RyaW5nW10+KSB7XG4gICAgbW92ZUl0ZW1JbkFycmF5KHRoaXMuY29sdW1ucywgZXZlbnQucHJldmlvdXNJbmRleCwgZXZlbnQuY3VycmVudEluZGV4KTtcbiAgfVxufVxuIl19