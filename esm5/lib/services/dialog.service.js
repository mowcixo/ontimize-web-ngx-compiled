import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { ODialogComponent } from '../shared/components/dialog/o-dialog.component';
import * as i0 from "@angular/core";
var DialogService = (function () {
    function DialogService(injector) {
        this.injector = injector;
        this.ng2Dialog = this.injector.get(MatDialog);
    }
    Object.defineProperty(DialogService.prototype, "dialog", {
        get: function () {
            if (this.dialogRef) {
                return this.dialogRef.componentInstance;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    DialogService.prototype.alert = function (title, message, config) {
        var self = this;
        var observable = new Observable(function (observer) {
            self.openDialog(observer);
            self.dialogRef.componentInstance.alert(title, message, config);
        });
        return observable.toPromise();
    };
    DialogService.prototype.info = function (title, message, config) {
        var self = this;
        var observable = new Observable(function (observer) {
            self.openDialog(observer);
            self.dialogRef.componentInstance.info(title, message, config);
        });
        return observable.toPromise();
    };
    DialogService.prototype.warn = function (title, message, config) {
        var self = this;
        var observable = new Observable(function (observer) {
            self.openDialog(observer);
            self.dialogRef.componentInstance.warn(title, message, config);
        });
        return observable.toPromise();
    };
    DialogService.prototype.error = function (title, message, config) {
        var self = this;
        var observable = new Observable(function (observer) {
            self.openDialog(observer);
            self.dialogRef.componentInstance.error(title, message, config);
        });
        return observable.toPromise();
    };
    DialogService.prototype.confirm = function (title, message, config) {
        var self = this;
        var observable = new Observable(function (observer) {
            self.openDialog(observer);
            self.dialogRef.componentInstance.confirm(title, message, config);
        });
        return observable.toPromise();
    };
    DialogService.prototype.openDialog = function (observer) {
        var _this = this;
        var cfg = {
            role: 'alertdialog',
            disableClose: true,
            panelClass: ['o-dialog-class', 'o-dialog-service']
        };
        this.dialogRef = this.ng2Dialog.open(ODialogComponent, cfg);
        this.dialogRef.afterClosed().subscribe(function (result) {
            result = result === undefined ? false : result;
            observer.next(result);
            observer.complete();
            _this.dialogRef = null;
        });
    };
    DialogService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    DialogService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    DialogService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function DialogService_Factory() { return new DialogService(i0.ɵɵinject(i0.INJECTOR)); }, token: DialogService, providedIn: "root" });
    return DialogService;
}());
export { DialogService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL2RpYWxvZy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxTQUFTLEVBQWlDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUVsQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQzs7QUFHbEY7SUFRRSx1QkFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxzQkFBVyxpQ0FBTTthQUFqQjtZQUNFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO2FBQ3pDO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQzs7O09BQUE7SUFFTSw2QkFBSyxHQUFaLFVBQWEsS0FBYSxFQUFFLE9BQWUsRUFBRSxNQUFzQjtRQUNqRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBQSxRQUFRO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sVUFBVSxDQUFDLFNBQVMsRUFBRSxD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VUFBVSxTQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7O2dCQVRvQixRQUFROzs7d0JBQTdCO0NBc0ZDLEFBL0VELElBK0VDO1NBNUVZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGlhbG9nLCBNYXREaWFsb2dDb25maWcsIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT0RpYWxvZ0NvbXBvbmVudCB9IGZyb20gJy4uL3NoYXJlZC9jb21wb25lbnRzL2RpYWxvZy9vLWRpYWxvZy5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0RpYWxvZ0NvbmZpZyB9IGZyb20gJy4uL3NoYXJlZC9jb21wb25lbnRzL2RpYWxvZy9vLWRpYWxvZy5jb25maWcnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBEaWFsb2dTZXJ2aWNlIHtcblxuICBwcm90ZWN0ZWQgbmcyRGlhbG9nOiBNYXREaWFsb2c7XG4gIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9EaWFsb2dDb21wb25lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLm5nMkRpYWxvZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KE1hdERpYWxvZyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGRpYWxvZygpOiBPRGlhbG9nQ29tcG9uZW50IHtcbiAgICBpZiAodGhpcy5kaWFsb2dSZWYpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhbGVydCh0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvbmZpZz86IE9EaWFsb2dDb25maWcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBzZWxmLm9wZW5EaWFsb2cob2JzZXJ2ZXIpO1xuICAgICAgc2VsZi5kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuYWxlcnQodGl0bGUsIG1lc3NhZ2UsIGNvbmZpZyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9ic2VydmFibGUudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwdWJsaWMgaW5mbyh0aXRsZTogc3RyaW5nLCBtZXNzYWdlOiBzdHJpbmcsIGNvbmZpZz86IE9EaWFsb2dDb25maWcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG4gICAgICBzZWxmLm9wZW5EaWFsb2cob2JzZXJ2ZXIpO1xuICAgICAgc2VsZi5kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UuaW5mbyh0aXRsZSwgbWVzc2FnZSwgY29uZmlnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZS50b1Byb21pc2UoKTtcbiAgfVxuXG4gIHB1YmxpYyB3YXJuKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHNlbGYub3BlbkRpYWxvZyhvYnNlcnZlcik7XG4gICAgICBzZWxmLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS53YXJuKHRpdGxlLCBtZXNzYWdlLCBjb25maWcpO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHNlbGYub3BlbkRpYWxvZyhvYnNlcnZlcik7XG4gICAgICBzZWxmLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5lcnJvcih0aXRsZSwgbWVzc2FnZSwgY29uZmlnKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JzZXJ2YWJsZS50b1Byb21pc2UoKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25maXJtKHRpdGxlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgY29uZmlnPzogT0RpYWxvZ0NvbmZpZyk6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIHNlbGYub3BlbkRpYWxvZyhvYnNlcnZlcik7XG4gICAgICBzZWxmLmRpYWxvZ1JlZi5jb21wb25lbnRJbnN0YW5jZS5jb25maXJtKHRpdGxlLCBtZXNzYWdlLCBjb25maWcpO1xuICAgIH0pO1xuICAgIHJldHVybiBvYnNlcnZhYmxlLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9wZW5EaWFsb2cob2JzZXJ2ZXIpIHtcbiAgICBjb25zdCBjZmc6IE1hdERpYWxvZ0NvbmZpZyA9IHtcbiAgICAgIHJvbGU6ICdhbGVydGRpYWxvZycsXG4gICAgICBkaXNhYmxlQ2xvc2U6IHRydWUsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tZGlhbG9nLWNsYXNzJywgJ28tZGlhbG9nLXNlcnZpY2UnXVxuICAgIH07XG4gICAgdGhpcy5kaWFsb2dSZWYgPSB0aGlzLm5nMkRpYWxvZy5vcGVuKE9EaWFsb2dDb21wb25lbnQsIGNmZyk7XG4gICAgdGhpcy5kaWFsb2dSZWYuYWZ0ZXJDbG9zZWQoKS5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiByZXN1bHQ7XG4gICAgICBvYnNlcnZlci5uZXh0KHJlc3VsdCk7XG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgdGhpcy5kaWFsb2dSZWYgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==