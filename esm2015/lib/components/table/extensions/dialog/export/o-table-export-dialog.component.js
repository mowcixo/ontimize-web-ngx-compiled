import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { OntimizeExportServiceProvider } from '../../../../../services/factories';
import { OntimizeExportService } from '../../../../../services/ontimize/ontimize-export.service';
import { SnackBarService } from '../../../../../services/snackbar.service';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { Codes } from '../../../../../util/codes';
import { SQLTypes } from '../../../../../util/sqltypes';
import { Util } from '../../../../../util/util';
import { OTableExportButtonService } from '../../export-button/o-table-export-button.service';
import { OTableExportConfiguration } from '../../header/table-menu/o-table-export-configuration.class';
export class OTableExportDialogComponent {
    constructor(dialogRef, injector, config) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.config = config;
        this.subscription = new Subscription();
        this.snackBarService = injector.get(SnackBarService);
        this.translateService = this.injector.get(OTranslateService);
        this.oTableExportButtonService = this.injector.get(OTableExportButtonService);
        if (config && Util.isDefined(config.visibleButtons)) {
            this.visibleButtons = Util.parseArray(config.visibleButtons.toLowerCase(), true);
        }
    }
    ngOnInit() {
        this.initialize();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    initialize() {
        this.configureService();
        this.subscription.add(this.oTableExportButtonService.export$.pipe(filter(type => ['xlsx', 'html', 'pdf'].indexOf(type) === -1)).subscribe(e => this.export(e)));
    }
    configureService() {
        let loadingService = OntimizeExportService;
        if (this.config.serviceType) {
            loadingService = this.config.serviceType;
        }
        this.exportService = this.injector.get(loadingService);
        const serviceCfg = this.exportService.getDefaultServiceConfiguration(this.config.service);
        this.exportService.configureService(serviceCfg, Codes.EXPORT_MODE_ALL === this.config.mode);
    }
    export(exportType, button) {
        if (button) {
            button.disabled = true;
        }
        const exportData = {
            data: this.config.data,
            columns: this.config.columns,
            columnNames: this.config.columnNames,
            sqlTypes: this.config.sqlTypes,
            filter: this.config.filter
        };
        this.proccessExportData(exportData.data, exportData.sqlTypes);
        this.dialogRef.close(true);
        this.exportService.exportData(exportData, exportType, this.config.entity).subscribe(res => {
            this.snackBarService.open('MESSAGES.SUCCESS_EXPORT_TABLE_DATA', { icon: 'check_circle' });
        }, err => {
            this.handleError(err);
        });
    }
    proccessExportData(data, sqlTypes) {
        Object.keys(sqlTypes).forEach(key => {
            if (SQLTypes.BOOLEAN === sqlTypes[key]) {
                const yes = this.translateService.get('YES');
                const no = this.translateService.get('NO');
                data.forEach(row => {
                    if (row[key]) {
                        row[key] = Util.parseBoolean(row[key]) ? yes : no;
                    }
                });
            }
        });
    }
    isButtonVisible(btn) {
        return !this.visibleButtons || (this.visibleButtons.indexOf(btn) !== -1);
    }
    handleError(err) {
        if (err instanceof HttpErrorResponse) {
            this.snackBarService.open(err.message, { icon: 'error' });
        }
        else {
            this.snackBarService.open('MESSAGES.ERROR_EXPORT_TABLE_DATA', { icon: 'error' });
        }
    }
}
OTableExportDialogComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-table-export-dialog',
                template: "<span mat-dialog-title>{{ 'TABLE.BUTTONS.EXPORT' | oTranslate }}</span>\n<mat-dialog-content>\n  <div mat-subheader>{{ 'TABLE.DIALOG.EXPORT.DESCRIPTION' | oTranslate }}</div>\n  <div fxLayout=\"row wrap\" fxLayoutAlign=\"space-around center\" fxLayoutGap=\"8px\">\n    <o-table-export-button #excelButton *ngIf=\"isButtonVisible('excel')\" svg-icon=\"ontimize:EXCEL\" label=\"TABLE.BUTTONS.EXCEL\" export-type=\"xlsx\"\n      (onClick)=\"export('xlsx', excelButton)\" class=\"excel-button\"></o-table-export-button>\n    <o-table-export-button #htmlButton *ngIf=\"isButtonVisible('html')\" svg-icon=\"ontimize:HTML\" label=\"TABLE.BUTTONS.HTML\" export-type=\"html\"\n      (onClick)=\"export('html', htmlButton)\" class=\"html-button\"></o-table-export-button>\n    <o-table-export-button #pdfButton *ngIf=\"isButtonVisible('pdf')\" svg-icon=\"ontimize:PDF\" label=\"TABLE.BUTTONS.PDF\" export-type=\"pdf\"\n      (onClick)=\"export('pdf', pdfButton)\" class=\"pdf-button\"></o-table-export-button>\n    <ng-container *ngTemplateOutlet=\"config.options\"></ng-container>\n  </div>\n</mat-dialog-content>\n\n<mat-dialog-actions fxLayoutAlign=\"end center\">\n  <button type=\"button\" mat-stroked-button [mat-dialog-close]=\"false\">{{ 'CANCEL' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                providers: [
                    OntimizeExportServiceProvider
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    class: 'o-table-export-dialog'
                },
                encapsulation: ViewEncapsulation.None,
                styles: [".o-table-export-dialog .mat-icon{padding:6px 6px 0;width:48px;height:48px;font-size:48px}"]
            }] }
];
OTableExportDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: Injector },
    { type: OTableExportConfiguration, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1leHBvcnQtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2RpYWxvZy9leHBvcnQvby10YWJsZS1leHBvcnQtZGlhbG9nLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQXFCLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNILE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHeEMsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDbEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMERBQTBELENBQUM7QUFDakcsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQzlGLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDREQUE0RCxDQUFDO0FBZXZHLE1BQU0sT0FBTywyQkFBMkI7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QUM7SUFFRCxlQUFlLENBQUMsR0FBVztRQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVTLFdBQVcsQ0FBQyxHQUFHO1FBQ3ZCLElBQUksR0FBRyxZQUFZLGlCQUFpQixFQUFFO1lBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNsRjtJQUNILENBQUM7OztZQTlHRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsc3lDQUFtRDtnQkFFbkQsU0FBUyxFQUFFO29CQUNULDZCQUE2QjtpQkFDOUI7Z0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsdUJBQXVCO2lCQUMvQjtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTs7YUFDdEM7OztZQTNCeUIsWUFBWTtZQURlLFFBQVE7WUFjcEQseUJBQXlCLHVCQTJCN0IsTUFBTSxTQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwRXJyb3JSZXNwb25zZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEluamVjdCwgSW5qZWN0b3IsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgSUV4cG9ydFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL2V4cG9ydC1zZXJ2aWNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZUV4cG9ydFNlcnZpY2VQcm92aWRlciB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL2ZhY3Rvcmllcyc7XG5pbXBvcnQgeyBPbnRpbWl6ZUV4cG9ydFNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS1leHBvcnQuc2VydmljZSc7XG5pbXBvcnQgeyBTbmFja0JhclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9zbmFja2Jhci5zZXJ2aWNlJztcbmltcG9ydCB7IE9UcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvdHJhbnNsYXRlL28tdHJhbnNsYXRlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFNRTFR5cGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9zcWx0eXBlcyc7XG5pbXBvcnQgeyBVdGlsIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC91dGlsJztcbmltcG9ydCB7IE9UYWJsZUV4cG9ydEJ1dHRvblNlcnZpY2UgfSBmcm9tICcuLi8uLi9leHBvcnQtYnV0dG9uL28tdGFibGUtZXhwb3J0LWJ1dHRvbi5zZXJ2aWNlJztcbmltcG9ydCB7IE9UYWJsZUV4cG9ydENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9oZWFkZXIvdGFibGUtbWVudS9vLXRhYmxlLWV4cG9ydC1jb25maWd1cmF0aW9uLmNsYXNzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1leHBvcnQtZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICdvLXRhYmxlLWV4cG9ydC1kaWFsb2cuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnby10YWJsZS1leHBvcnQtZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIE9udGltaXplRXhwb3J0U2VydmljZVByb3ZpZGVyXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdvLXRhYmxlLWV4cG9ydC1kaWFsb2cnXG4gIH0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlRXhwb3J0RGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIHByb3RlY3RlZCBzbmFja0JhclNlcnZpY2U6IFNuYWNrQmFyU2VydmljZTtcbiAgcHJvdGVjdGVkIGV4cG9ydFNlcnZpY2U6IElFeHBvcnRTZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCBvVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlOiBPVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlO1xuICBwcm90ZWN0ZWQgdmlzaWJsZUJ1dHRvbnM6IHN0cmluZ1tdO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBkaWFsb2dSZWY6IE1hdERpYWxvZ1JlZjxPVGFibGVFeHBvcnREaWFsb2dDb21wb25lbnQ+LFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIHB1YmxpYyBjb25maWc6IE9UYWJsZUV4cG9ydENvbmZpZ3VyYXRpb25cbiAgKSB7XG4gICAgdGhpcy5zbmFja0JhclNlcnZpY2UgPSBpbmplY3Rvci5nZXQoU25hY2tCYXJTZXJ2aWNlKTtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy5vVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RhYmxlRXhwb3J0QnV0dG9uU2VydmljZSk7XG5cbiAgICBpZiAoY29uZmlnICYmIFV0aWwuaXNEZWZpbmVkKGNvbmZpZy52aXNpYmxlQnV0dG9ucykpIHtcbiAgICAgIHRoaXMudmlzaWJsZUJ1dHRvbnMgPSBVdGlsLnBhcnNlQXJyYXkoY29uZmlnLnZpc2libGVCdXR0b25zLnRvTG93ZXJDYXNlKCksIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogdm9pZCB7XG4gICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24uYWRkKFxuICAgICAgdGhpcy5vVGFibGVFeHBvcnRCdXR0b25TZXJ2aWNlLmV4cG9ydCQucGlwZShmaWx0ZXIodHlwZSA9PiBbJ3hsc3gnLCAnaHRtbCcsICdwZGYnXS5pbmRleE9mKHR5cGUpID09PSAtMSkpLnN1YnNjcmliZShlID0+IHRoaXMuZXhwb3J0KGUpKVxuICAgICk7XG4gIH1cblxuICBjb25maWd1cmVTZXJ2aWNlKCk6IHZvaWQge1xuICAgIGxldCBsb2FkaW5nU2VydmljZTogYW55ID0gT250aW1pemVFeHBvcnRTZXJ2aWNlO1xuICAgIGlmICh0aGlzLmNvbmZpZy5zZXJ2aWNlVHlwZSkge1xuICAgICAgbG9hZGluZ1NlcnZpY2UgPSB0aGlzLmNvbmZpZy5zZXJ2aWNlVHlwZTtcbiAgICB9XG4gICAgdGhpcy5leHBvcnRTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQobG9hZGluZ1NlcnZpY2UpO1xuICAgIGNvbnN0IHNlcnZpY2VDZmcgPSB0aGlzLmV4cG9ydFNlcnZpY2UuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKHRoaXMuY29uZmlnLnNlcnZpY2UpO1xuICAgIHRoaXMuZXhwb3J0U2VydmljZS5jb25maWd1cmVTZXJ2aWNlKHNlcnZpY2VDZmcsIENvZGVzLkVYUE9SVF9NT0RFX0FMTCA9PT0gdGhpcy5jb25maWcubW9kZSk7XG4gIH1cblxuICBleHBvcnQoZXhwb3J0VHlwZTogc3RyaW5nLCBidXR0b24/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoYnV0dG9uKSB7XG4gICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBleHBvcnREYXRhID0ge1xuICAgICAgZGF0YTogdGhpcy5jb25maWcuZGF0YSxcbiAgICAgIGNvbHVtbnM6IHRoaXMuY29uZmlnLmNvbHVtbnMsXG4gICAgICBjb2x1bW5OYW1lczogdGhpcy5jb25maWcuY29sdW1uTmFtZXMsXG4gICAgICBzcWxUeXBlczogdGhpcy5jb25maWcuc3FsVHlwZXMsXG4gICAgICBmaWx0ZXI6IHRoaXMuY29uZmlnLmZpbHRlclxuICAgIH07XG5cbiAgICB0aGlzLnByb2NjZXNzRXhwb3J0RGF0YShleHBvcnREYXRhLmRhdGEsIGV4cG9ydERhdGEuc3FsVHlwZXMpO1xuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHRydWUpO1xuICAgIHRoaXMuZXhwb3J0U2VydmljZS5leHBvcnREYXRhKGV4cG9ydERhdGEsIGV4cG9ydFR5cGUsIHRoaXMuY29uZmlnLmVudGl0eSkuc3Vic2NyaWJlKFxuICAgICAgcmVzID0+IHtcbiAgICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbignTUVTU0FHRVMuU1VDQ0VTU19FWFBPUlRfVEFCTEVfREFUQScsIHsgaWNvbjogJ2NoZWNrX2NpcmNsZScgfSk7XG4gICAgICB9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnIpO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBwcm9jY2Vzc0V4cG9ydERhdGEoZGF0YTogb2JqZWN0W10sIHNxbFR5cGVzOiBvYmplY3QpOiB2b2lkIHtcbiAgICAvLyBQYXJzZSBib29sZWFuXG4gICAgT2JqZWN0LmtleXMoc3FsVHlwZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChTUUxUeXBlcy5CT09MRUFOID09PSBzcWxUeXBlc1trZXldKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1lFUycpO1xuICAgICAgICBjb25zdCBubyA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ05PJyk7XG4gICAgICAgIGRhdGEuZm9yRWFjaChyb3cgPT4ge1xuICAgICAgICAgIGlmIChyb3dba2V5XSkge1xuICAgICAgICAgICAgcm93W2tleV0gPSBVdGlsLnBhcnNlQm9vbGVhbihyb3dba2V5XSkgPyB5ZXMgOiBubztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaXNCdXR0b25WaXNpYmxlKGJ0bjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnZpc2libGVCdXR0b25zIHx8ICh0aGlzLnZpc2libGVCdXR0b25zLmluZGV4T2YoYnRuKSAhPT0gLTEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycik6IHZvaWQge1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBIdHRwRXJyb3JSZXNwb25zZSkge1xuICAgICAgdGhpcy5zbmFja0JhclNlcnZpY2Uub3BlbihlcnIubWVzc2FnZSwgeyBpY29uOiAnZXJyb3InIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNuYWNrQmFyU2VydmljZS5vcGVuKCdNRVNTQUdFUy5FUlJPUl9FWFBPUlRfVEFCTEVfREFUQScsIHsgaWNvbjogJ2Vycm9yJyB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==