import { Component, forwardRef, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { OntimizeServiceProvider } from '../../../services/factories';
import { NavigationService } from '../../../services/navigation.service';
import { OntimizeService } from '../../../services/ontimize/ontimize.service';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../o-form.component';
export class OFormNavigationComponent {
    constructor(injector, _form, router) {
        this.injector = injector;
        this._form = _form;
        this.router = router;
        this.navigationData = [];
        this._currentIndex = 0;
        this.formNavigation = this._form.getFormNavigation();
        this.navigationService = this.injector.get(NavigationService);
        this.formLayoutManager = this._form.getFormManager();
        let navData;
        if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
            navData = this.navigationService.getLastItem();
        }
        else {
            navData = this.navigationService.getPreviousRouteData();
        }
        if (Util.isDefined(navData)) {
            this.navigationData = navData.keysValues || [];
            this.queryConf = navData.queryConfiguration;
        }
        this.currentIndex = this.getCurrentIndex();
        this.configureService();
    }
    configureService() {
        if (!this.queryConf) {
            return;
        }
        let loadingService = OntimizeService;
        if (this.queryConf.serviceType) {
            loadingService = this.queryConf.serviceType;
        }
        try {
            this.dataService = this.injector.get(loadingService);
            if (Util.isDataService(this.dataService)) {
                const serviceCfg = this.dataService.getDefaultServiceConfiguration(this.queryConf.service);
                if (this.queryConf.entity) {
                    serviceCfg.entity = this.queryConf.entity;
                }
                this.dataService.configureService(serviceCfg);
            }
        }
        catch (e) {
            console.error(e);
        }
    }
    queryNavigationData(offset, length) {
        const self = this;
        return new Promise((resolve, reject) => {
            const conf = self.queryConf;
            const queryArgs = conf.queryArguments;
            queryArgs[1] = self.getKeysArray();
            queryArgs[4] = offset;
            queryArgs[5] = length ? length : conf.queryRows;
            self.querySubscription = self.dataService[conf.queryMethod].apply(self.dataService, queryArgs).subscribe(res => {
                if (res.isSuccessful()) {
                    self.navigationData = res.data;
                    self.queryConf.queryRecordOffset = offset;
                }
                resolve();
            }, () => {
                reject();
            });
        });
    }
    ngOnDestroy() {
        if (this.querySubscription) {
            this.querySubscription.unsubscribe();
        }
    }
    getKeysArray() {
        const navData = this.navigationData ? (this.navigationData[0] || {}) : {};
        const keysArray = [];
        this._form.keysArray.forEach(key => {
            if (navData.hasOwnProperty(key)) {
                keysArray.push(key);
            }
        });
        return keysArray;
    }
    getCurrentIndex() {
        const keysArray = this.getKeysArray();
        const currentKeys = {};
        const currentItem = this.formNavigation.getUrlParams();
        keysArray.forEach(key => {
            currentKeys[key] = currentItem[key];
        });
        const index = (this.navigationData || []).findIndex((item) => {
            const itemKeys = {};
            keysArray.forEach(key => {
                itemKeys[key] = item[key];
            });
            return Util.isEquivalent(itemKeys, currentKeys);
        });
        return index >= 0 ? index : 0;
    }
    next() {
        const total = this.navigationData.length;
        const index = this.currentIndex + 1;
        if (total > index) {
            this.move(index);
        }
        else if (this.queryConf) {
            const offset = (this.queryConf.queryRecordOffset || 0) + this.queryConf.queryRows;
            this.queryNavigationData(offset).then(() => {
                this.move(0);
            });
        }
        else {
            console.error('form-toolbar->next(): total > index');
        }
    }
    previous() {
        const index = this.currentIndex - 1;
        if (index >= 0) {
            this.move(index);
        }
        else if (this.queryConf) {
            const offset = this.queryConf.queryRecordOffset - this.queryConf.queryRows;
            this.queryNavigationData(offset).then(() => {
                this.move(this.navigationData.length - 1);
            });
        }
        else {
            console.error('form-toolbar->next(): index < 0');
        }
    }
    first() {
        if (!this.queryConf || this.queryConf.queryRecordOffset === 0) {
            this.move(0);
        }
        else {
            this.queryNavigationData(0).then(() => {
                this.move(0);
            });
        }
    }
    last() {
        if (!this.queryConf || this.isLast()) {
            const index = this.navigationData.length - 1;
            this.move(index);
        }
        else {
            const offset = this.queryConf.totalRecordsNumber - this.queryConf.queryRows;
            this.queryNavigationData(offset, this.queryConf.queryRows).then(() => {
                this.move(this.navigationData.length - 1);
            });
        }
    }
    isFirst() {
        let result = this.currentIndex === 0;
        if (result && this.queryConf) {
            result = this.queryConf.queryRecordOffset === 0;
        }
        return result;
    }
    isLast() {
        let result = this.currentIndex === (this.navigationData.length - 1);
        if (result && this.queryConf) {
            result = (this.queryConf.queryRecordOffset + this.queryConf.queryRows)
                >= this.queryConf.totalRecordsNumber;
        }
        return result;
    }
    move(index) {
        this._form.showConfirmDiscardChanges().then(res => {
            if (res === true) {
                this.currentIndex = index;
                if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
                    this.moveInDialogManager(this.formLayoutManager, index);
                }
                else {
                    this.moveWithoutManager(index);
                }
            }
        });
    }
    moveWithoutManager(index) {
        const route = this.getRouteOfSelectedRow(this.navigationData[index]);
        if (route.length > 0) {
            const navData = this.navigationService.getLastItem();
            if (navData) {
                this.navigationService.removeLastItem();
                this._form.canDiscardChanges = true;
                const extras = {};
                extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
                const urlArray = navData.url.split(Codes.ROUTE_SEPARATOR);
                const url = urlArray.splice(0, urlArray.length - route.length).join(Codes.ROUTE_SEPARATOR);
                route.unshift(url);
                this.router.navigate(route, extras).then((navigationDone) => {
                    if (navigationDone) {
                        this.currentIndex = index;
                    }
                });
            }
        }
    }
    moveInDialogManager(formLayoutManager, index) {
        formLayoutManager.dialogRef.componentInstance.urlParams = this.navigationData[index];
        this._form.setUrlParamsAndReload(this.navigationData[index]);
    }
    getRouteOfSelectedRow(item) {
        const route = [];
        if (Util.isObject(item)) {
            this._form.keysArray.forEach(key => {
                if (Util.isDefined(item[key])) {
                    route.push(item[key]);
                }
            });
        }
        return route;
    }
    showNavigation() {
        return (this.navigationData || []).length > 1;
    }
    set currentIndex(arg) {
        this._currentIndex = arg;
    }
    get currentIndex() {
        return this._currentIndex;
    }
    getRecordIndex() {
        let index = this.currentIndex + 1;
        if (this.queryConf) {
            index += this.queryConf.queryRecordOffset;
        }
        return index;
    }
    getTotalRecordsNumber() {
        if (this.queryConf && this.queryConf.totalRecordsNumber) {
            return this.queryConf.totalRecordsNumber;
        }
        return this.navigationData.length;
    }
}
OFormNavigationComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-form-navigation',
                template: "<ng-container *ngIf=\"showNavigation()\">\n  <button mat-icon-button class=\"o-form-toolbar-button\" [disabled]=\"isFirst()\" (click)=\"first()\">\n    <mat-icon aria-label=\"First\" layout-padding svgIcon=\"ontimize:first_page\"></mat-icon>\n  </button>\n  <button mat-icon-button class=\"o-form-toolbar-button\" [disabled]=\"isFirst()\" (click)=\"previous()\">\n    <mat-icon aria-label=\"Previous\" layout-padding svgIcon=\"ontimize:keyboard_arrow_left\"></mat-icon>\n  </button>\n  <span layout-padding>{{ getRecordIndex() }} / {{ getTotalRecordsNumber() }}</span>\n  <button mat-icon-button class=\"o-form-toolbar-button\" [disabled]=\"isLast()\" (click)=\"next()\">\n    <mat-icon aria-label=\"Next\" layout-padding svgIcon=\"ontimize:keyboard_arrow_right\"></mat-icon>\n  </button>\n  <button mat-icon-button class=\"o-form-toolbar-button\" [disabled]=\"isLast()\" (click)=\"last()\">\n    <mat-icon aria-label=\"Last\" layout-padding svgIcon=\"ontimize:last_page\"></mat-icon>\n  </button>\n</ng-container>",
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-form-navigation]': 'true'
                },
                providers: [
                    OntimizeServiceProvider
                ],
                styles: [".o-form-navigation .mat-icon{cursor:pointer}.o-form-navigation span{cursor:default}"]
            }] }
];
OFormNavigationComponent.ctorParameters = () => [
    { type: Injector },
    { type: OFormComponent, decorators: [{ type: Inject, args: [forwardRef(() => OFormComponent),] }] },
    { type: Router }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLW5hdmlnYXRpb24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2Zvcm0vbmF2aWdhdGlvbi9vLWZvcm0tbmF2aWdhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBYSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RyxPQUFPLEVBQW9CLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBSTNELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxpQkFBaUIsRUFBbUIsTUFBTSxzQ0FBc0MsQ0FBQztBQUMxRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMxQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUEwQnJELE1BQU0sT0FBTyx3QkFBd0I7SUFhbkMsWUFDWSxRQUFrQixFQUNzQixLQUFxQixFQUMvRCxNQUFjO1FBRlosYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNzQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUMvRCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBZGpCLG1CQUFjLEdBQWUsRUFBRSxDQUFDO1FBQy9CLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO1FBZXhCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3JELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFB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RUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsSUFBSSxZQUFZLENBQUMsR0FBVztRQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzVCLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDO1NBQzNDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQscUJBQXFCO1FBQ25CLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztTQUMxQztRQUNELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7SUFDcEMsQ0FBQzs7O1lBcFJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixrZ0NBQWlEO2dCQUVqRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsSUFBSSxFQUFFO29CQUNKLDJCQUEyQixFQUFFLE1BQU07aUJBQ3BDO2dCQUNELFNBQVMsRUFBRTtvQkFDVCx1QkFBdUI7aUJBQ3hCOzthQUNGOzs7WUFuQ3VDLFFBQVE7WUFVdkMsY0FBYyx1QkF5Q2xCLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO1lBbERqQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBPbkRlc3Ryb3ksIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRXh0cmFzLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2xheW91dHMvZm9ybS1sYXlvdXQvby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uU2VydmljZSwgT05hdmlnYXRpb25JdGVtIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9udGltaXplU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL29udGltaXplL29udGltaXplLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1Db21wb25lbnQgfSBmcm9tICcuLi9vLWZvcm0uY29tcG9uZW50JztcbmltcG9ydCB7IE9Gb3JtTmF2aWdhdGlvbkNsYXNzIH0gZnJvbSAnLi9vLWZvcm0ubmF2aWdhdGlvbi5jbGFzcyc7XG5cbmV4cG9ydCB0eXBlIFF1ZXJ5Q29uZmlndXJhdGlvbiA9IHtcbiAgc2VydmljZVR5cGU6IHN0cmluZztcbiAgcXVlcnlBcmd1bWVudHM6IGFueVtdO1xuICBlbnRpdHk6IHN0cmluZztcbiAgc2VydmljZTogc3RyaW5nO1xuICBxdWVyeU1ldGhvZDogc3RyaW5nO1xuICB0b3RhbFJlY29yZHNOdW1iZXI6IG51bWJlcjtcbiAgcXVlcnlSb3dzOiBudW1iZXI7XG4gIHF1ZXJ5UmVjb3JkT2Zmc2V0OiBudW1iZXI7XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tbmF2aWdhdGlvbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWZvcm0tbmF2aWdhdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tZm9ybS1uYXZpZ2F0aW9uLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS1uYXZpZ2F0aW9uXSc6ICd0cnVlJ1xuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICBPbnRpbWl6ZVNlcnZpY2VQcm92aWRlclxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtTmF2aWdhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIG5hdmlnYXRpb25EYXRhOiBBcnJheTxhbnk+ID0gW107XG4gIHByaXZhdGUgX2N1cnJlbnRJbmRleCA9IDA7XG5cbiAgcHJvdGVjdGVkIGZvcm1OYXZpZ2F0aW9uOiBPRm9ybU5hdmlnYXRpb25DbGFzcztcbiAgcHJvdGVjdGVkIG5hdmlnYXRpb25TZXJ2aWNlOiBOYXZpZ2F0aW9uU2VydmljZTtcbiAgcHJvdGVjdGVkIGZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCBkYXRhU2VydmljZTogYW55O1xuICBwcm90ZWN0ZWQgcXVlcnlDb25mOiBRdWVyeUNvbmZpZ3VyYXRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1Db21wb25lbnQpKSBwcml2YXRlIF9mb3JtOiBPRm9ybUNvbXBvbmVudCxcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyXG4gICkge1xuICAgIHRoaXMuZm9ybU5hdmlnYXRpb24gPSB0aGlzLl9mb3JtLmdldEZvcm1OYXZpZ2F0aW9uKCk7XG4gICAgdGhpcy5uYXZpZ2F0aW9uU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE5hdmlnYXRpb25TZXJ2aWNlKTtcblxuICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIgPSB0aGlzLl9mb3JtLmdldEZvcm1NYW5hZ2VyKCk7XG5cbiAgICBsZXQgbmF2RGF0YTtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmlzRGlhbG9nTW9kZSgpKSB7XG4gICAgICBuYXZEYXRhID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0SXRlbSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYXZEYXRhID0gdGhpcy5uYXZpZ2F0aW9uU2VydmljZS5nZXRQcmV2aW91c1JvdXRlRGF0YSgpO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQobmF2RGF0YSkpIHtcbiAgICAgIHRoaXMubmF2aWdhdGlvbkRhdGEgPSBuYXZEYXRhLmtleXNWYWx1ZXMgfHwgW107XG4gICAgICB0aGlzLnF1ZXJ5Q29uZiA9IG5hdkRhdGEucXVlcnlDb25maWd1cmF0aW9uO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHRoaXMuZ2V0Q3VycmVudEluZGV4KCk7XG4gICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gIH1cblxuICBjb25maWd1cmVTZXJ2aWNlKCkge1xuICAgIGlmICghdGhpcy5xdWVyeUNvbmYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGxvYWRpbmdTZXJ2aWNlOiBhbnkgPSBPbnRpbWl6ZVNlcnZpY2U7XG4gICAgaWYgKHRoaXMucXVlcnlDb25mLnNlcnZpY2VUeXBlKSB7XG4gICAgICBsb2FkaW5nU2VydmljZSA9IHRoaXMucXVlcnlDb25mLnNlcnZpY2VUeXBlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgdGhpcy5kYXRhU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KGxvYWRpbmdTZXJ2aWNlKTtcbiAgICAgIGlmIChVdGlsLmlzRGF0YVNlcnZpY2UodGhpcy5kYXRhU2VydmljZSkpIHtcbiAgICAgICAgY29uc3Qgc2VydmljZUNmZyA9IHRoaXMuZGF0YVNlcnZpY2UuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKHRoaXMucXVlcnlDb25mLnNlcnZpY2UpO1xuICAgICAgICBpZiAodGhpcy5xdWVyeUNvbmYuZW50aXR5KSB7XG4gICAgICAgICAgc2VydmljZUNmZy5lbnRpdHkgPSB0aGlzLnF1ZXJ5Q29uZi5lbnRpdHk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRhU2VydmljZS5jb25maWd1cmVTZXJ2aWNlKHNlcnZpY2VDZmcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHF1ZXJ5TmF2aWdhdGlvbkRhdGEob2Zmc2V0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmU6IGFueSwgcmVqZWN0OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGNvbmYgPSBzZWxmLnF1ZXJ5Q29uZjtcbiAgICAgIGNvbnN0IHF1ZXJ5QXJncyA9IGNvbmYucXVlcnlBcmd1bWVudHM7XG5cbiAgICAgIHF1ZXJ5QXJnc1sxXSA9IHNlbGYuZ2V0S2V5c0FycmF5KCk7XG4gICAgICBxdWVyeUFyZ3NbNF0gPSBvZmZzZXQ7XG4gICAgICBxdWVyeUFyZ3NbNV0gPSBsZW5ndGggPyBsZW5ndGggOiBjb25mLnF1ZXJ5Um93cztcblxuICAgICAgc2VsZi5xdWVyeVN1YnNjcmlwdGlvbiA9IHNlbGYuZGF0YVNlcnZpY2VbY29uZi5xdWVyeU1ldGhvZF0uYXBwbHkoc2VsZi5kYXRhU2VydmljZSwgcXVlcnlBcmdzKS5zdWJzY3JpYmUocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcy5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgIHNlbGYubmF2aWdhdGlvbkRhdGEgPSByZXMuZGF0YTtcbiAgICAgICAgICBzZWxmLnF1ZXJ5Q29uZi5xdWVyeVJlY29yZE9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5xdWVyeVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRLZXlzQXJyYXkoKTogc3RyaW5nW10ge1xuICAgIC8vIGdldHRpbmcgYXZhaWxhYmxlIG5hdmlnYXRpb25EYXRhIGtleXNcbiAgICBjb25zdCBuYXZEYXRhID0gdGhpcy5uYXZpZ2F0aW9uRGF0YSA/ICh0aGlzLm5hdmlnYXRpb25EYXRhWzBdIHx8IHt9KSA6IHt9O1xuICAgIGNvbnN0IGtleXNBcnJheSA9IFtdO1xuICAgIHRoaXMuX2Zvcm0ua2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChuYXZEYXRhLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAga2V5c0FycmF5LnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4ga2V5c0FycmF5O1xuICB9XG5cbiAgZ2V0Q3VycmVudEluZGV4KCk6IG51bWJlciB7XG4gICAgY29uc3Qga2V5c0FycmF5ID0gdGhpcy5nZXRLZXlzQXJyYXkoKTtcbiAgICAvLyBjdXJyZW50IHVybCBrZXlzIG9iamVjdFxuICAgIGNvbnN0IGN1cnJlbnRLZXlzID0ge307XG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLmZvcm1OYXZpZ2F0aW9uLmdldFVybFBhcmFtcygpO1xuICAgIGtleXNBcnJheS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjdXJyZW50S2V5c1trZXldID0gY3VycmVudEl0ZW1ba2V5XTtcbiAgICB9KTtcbiAgICBjb25zdCBpbmRleDogbnVtYmVyID0gKHRoaXMubmF2aWdhdGlvbkRhdGEgfHwgW10pLmZpbmRJbmRleCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBjb25zdCBpdGVtS2V5cyA9IHt9O1xuICAgICAga2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaXRlbUtleXNba2V5XSA9IGl0ZW1ba2V5XTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIFV0aWwuaXNFcXVpdmFsZW50KGl0ZW1LZXlzLCBjdXJyZW50S2V5cyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGluZGV4ID49IDAgPyBpbmRleCA6IDA7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIGNvbnN0IHRvdGFsID0gdGhpcy5uYXZpZ2F0aW9uRGF0YS5sZW5ndGg7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmN1cnJlbnRJbmRleCArIDE7XG4gICAgaWYgKHRvdGFsID4gaW5kZXgpIHtcbiAgICAgIHRoaXMubW92ZShpbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnF1ZXJ5Q29uZikge1xuICAgICAgY29uc3Qgb2Zmc2V0OiBudW1iZXIgPSAodGhpcy5xdWVyeUNvbmYucXVlcnlSZWNvcmRPZmZzZXQgfHwgMCkgKyB0aGlzLnF1ZXJ5Q29uZi5xdWVyeVJvd3M7XG4gICAgICB0aGlzLnF1ZXJ5TmF2aWdhdGlvbkRhdGEob2Zmc2V0KS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5tb3ZlKDApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Zvcm0tdG9vbGJhci0+bmV4dCgpOiB0b3RhbCA+IGluZGV4Jyk7XG4gICAgfVxuICB9XG5cbiAgcHJldmlvdXMoKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmN1cnJlbnRJbmRleCAtIDE7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHRoaXMubW92ZShpbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnF1ZXJ5Q29uZikge1xuICAgICAgY29uc3Qgb2Zmc2V0OiBudW1iZXIgPSB0aGlzLnF1ZXJ5Q29uZi5xdWVyeVJlY29yZE9mZnNldCAtIHRoaXMucXVlcnlDb25mLnF1ZXJ5Um93cztcbiAgICAgIHRoaXMucXVlcnlOYXZpZ2F0aW9uRGF0YShvZmZzZXQpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLm1vdmUodGhpcy5uYXZpZ2F0aW9uRGF0YS5sZW5ndGggLSAxKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdmb3JtLXRvb2xiYXItPm5leHQoKTogaW5kZXggPCAwJyk7XG4gICAgfVxuICB9XG5cbiAgZmlyc3QoKSB7XG4gICAgaWYgKCF0aGlzLnF1ZXJ5Q29uZiB8fCB0aGlzLnF1ZXJ5Q29uZi5xdWVyeVJlY29yZE9mZnNldCA9PT0gMCkge1xuICAgICAgdGhpcy5tb3ZlKDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1ZXJ5TmF2aWdhdGlvbkRhdGEoMCkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMubW92ZSgwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGxhc3QoKSB7XG4gICAgaWYgKCF0aGlzLnF1ZXJ5Q29uZiB8fCB0aGlzLmlzTGFzdCgpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMubmF2aWdhdGlvbkRhdGEubGVuZ3RoIC0gMTtcbiAgICAgIHRoaXMubW92ZShpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IHRoaXMucXVlcnlDb25mLnRvdGFsUmVjb3Jkc051bWJlciAtIHRoaXMucXVlcnlDb25mLnF1ZXJ5Um93cztcbiAgICAgIHRoaXMucXVlcnlOYXZpZ2F0aW9uRGF0YShvZmZzZXQsIHRoaXMucXVlcnlDb25mLnF1ZXJ5Um93cykudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMubW92ZSh0aGlzLm5hdmlnYXRpb25EYXRhLmxlbmd0aCAtIDEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaXNGaXJzdCgpIHtcbiAgICBsZXQgcmVzdWx0OiBib29sZWFuID0gdGhpcy5jdXJyZW50SW5kZXggPT09IDA7XG4gICAgaWYgKHJlc3VsdCAmJiB0aGlzLnF1ZXJ5Q29uZikge1xuICAgICAgcmVzdWx0ID0gdGhpcy5xdWVyeUNvbmYucXVlcnlSZWNvcmRPZmZzZXQgPT09IDA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBpc0xhc3QoKSB7XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbiA9IHRoaXMuY3VycmVudEluZGV4ID09PSAodGhpcy5uYXZpZ2F0aW9uRGF0YS5sZW5ndGggLSAxKTtcbiAgICBpZiAocmVzdWx0ICYmIHRoaXMucXVlcnlDb25mKSB7XG4gICAgICByZXN1bHQgPSAodGhpcy5xdWVyeUNvbmYucXVlcnlSZWNvcmRPZmZzZXQgKyB0aGlzLnF1ZXJ5Q29uZi5xdWVyeVJvd3MpXG4gICAgICAgID49IHRoaXMucXVlcnlDb25mLnRvdGFsUmVjb3Jkc051bWJlcjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIG1vdmUoaW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMuX2Zvcm0uc2hvd0NvbmZpcm1EaXNjYXJkQ2hhbmdlcygpLnRoZW4ocmVzID0+IHtcbiAgICAgIGlmIChyZXMgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIgJiYgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5pc0RpYWxvZ01vZGUoKSkge1xuICAgICAgICAgIHRoaXMubW92ZUluRGlhbG9nTWFuYWdlcih0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLCBpbmRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5tb3ZlV2l0aG91dE1hbmFnZXIoaW5kZXgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG1vdmVXaXRob3V0TWFuYWdlcihpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLmdldFJvdXRlT2ZTZWxlY3RlZFJvdyh0aGlzLm5hdmlnYXRpb25EYXRhW2luZGV4XSk7XG4gICAgaWYgKHJvdXRlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG5hdkRhdGE6IE9OYXZpZ2F0aW9uSXRlbSA9IHRoaXMubmF2aWdhdGlvblNlcnZpY2UuZ2V0TGFzdEl0ZW0oKTtcbiAgICAgIGlmIChuYXZEYXRhKSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGlvblNlcnZpY2UucmVtb3ZlTGFzdEl0ZW0oKTtcbiAgICAgICAgdGhpcy5fZm9ybS5jYW5EaXNjYXJkQ2hhbmdlcyA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgZXh0cmFzOiBOYXZpZ2F0aW9uRXh0cmFzID0ge307XG4gICAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gQ29kZXMuZ2V0SXNEZXRhaWxPYmplY3QoKTtcblxuICAgICAgICBjb25zdCB1cmxBcnJheSA9IG5hdkRhdGEudXJsLnNwbGl0KENvZGVzLlJPVVRFX1NFUEFSQVRPUik7XG4gICAgICAgIGNvbnN0IHVybCA9IHVybEFycmF5LnNwbGljZSgwLCB1cmxBcnJheS5sZW5ndGggLSByb3V0ZS5sZW5ndGgpLmpvaW4oQ29kZXMuUk9VVEVfU0VQQVJBVE9SKTtcbiAgICAgICAgcm91dGUudW5zaGlmdCh1cmwpO1xuXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKHJvdXRlLCBleHRyYXMpLnRoZW4oKG5hdmlnYXRpb25Eb25lOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgaWYgKG5hdmlnYXRpb25Eb25lKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IGluZGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlSW5EaWFsb2dNYW5hZ2VyKGZvcm1MYXlvdXRNYW5hZ2VyOiBhbnksIGluZGV4OiBudW1iZXIpIHtcbiAgICBmb3JtTGF5b3V0TWFuYWdlci5kaWFsb2dSZWYuY29tcG9uZW50SW5zdGFuY2UudXJsUGFyYW1zID0gdGhpcy5uYXZpZ2F0aW9uRGF0YVtpbmRleF07XG4gICAgdGhpcy5fZm9ybS5zZXRVcmxQYXJhbXNBbmRSZWxvYWQodGhpcy5uYXZpZ2F0aW9uRGF0YVtpbmRleF0pO1xuICB9XG5cbiAgZ2V0Um91dGVPZlNlbGVjdGVkUm93KGl0ZW06IGFueSkge1xuICAgIGNvbnN0IHJvdXRlID0gW107XG4gICAgaWYgKFV0aWwuaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgIHRoaXMuX2Zvcm0ua2V5c0FycmF5LmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKGl0ZW1ba2V5XSkpIHtcbiAgICAgICAgICByb3V0ZS5wdXNoKGl0ZW1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcm91dGU7XG4gIH1cblxuICBzaG93TmF2aWdhdGlvbigpIHtcbiAgICByZXR1cm4gKHRoaXMubmF2aWdhdGlvbkRhdGEgfHwgW10pLmxlbmd0aCA+IDE7XG4gIH1cblxuICBzZXQgY3VycmVudEluZGV4KGFyZzogbnVtYmVyKSB7XG4gICAgdGhpcy5fY3VycmVudEluZGV4ID0gYXJnO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50SW5kZXg7XG4gIH1cblxuICBnZXRSZWNvcmRJbmRleCgpOiBudW1iZXIge1xuICAgIGxldCBpbmRleCA9IHRoaXMuY3VycmVudEluZGV4ICsgMTtcbiAgICBpZiAodGhpcy5xdWVyeUNvbmYpIHtcbiAgICAgIGluZGV4ICs9IHRoaXMucXVlcnlDb25mLnF1ZXJ5UmVjb3JkT2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBnZXRUb3RhbFJlY29yZHNOdW1iZXIoKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5xdWVyeUNvbmYgJiYgdGhpcy5xdWVyeUNvbmYudG90YWxSZWNvcmRzTnVtYmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5xdWVyeUNvbmYudG90YWxSZWNvcmRzTnVtYmVyO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uYXZpZ2F0aW9uRGF0YS5sZW5ndGg7XG4gIH1cbn1cbiJdfQ==