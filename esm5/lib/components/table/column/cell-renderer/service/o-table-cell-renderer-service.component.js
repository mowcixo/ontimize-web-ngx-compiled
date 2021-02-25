import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Injector, TemplateRef, ViewChild } from '@angular/core';
import { OTranslatePipe } from '../../../../../pipes/o-translate.pipe';
import { DialogService } from '../../../../../services/dialog.service';
import { OntimizeServiceProvider } from '../../../../../services/factories';
import { OntimizeService } from '../../../../../services/ontimize/ontimize.service';
import { Codes } from '../../../../../util/codes';
import { FilterExpressionUtils } from '../../../../../util/filter-expression.utils';
import { ServiceUtils } from '../../../../../util/service.utils';
import { SQLTypes } from '../../../../../util/sqltypes';
import { Util } from '../../../../../util/util';
import { DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, OBaseTableCellRenderer } from '../o-base-table-cell-renderer.class';
export var DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = tslib_1.__spread(DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER, [
    'entity',
    'service',
    'columns',
    'translate',
    'valueColumn: value-column',
    'parentKeys: parent-keys',
    'queryMethod: query-method',
    'serviceType : service-type',
    'translateArgsFn: translate-params'
]);
var OTableCellRendererServiceComponent = (function (_super) {
    tslib_1.__extends(OTableCellRendererServiceComponent, _super);
    function OTableCellRendererServiceComponent(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.cellValues = [];
        _this.responseMap = {};
        _this.translate = false;
        _this.queryMethod = Codes.QUERY_METHOD;
        _this.colArray = [];
        _this._pKeysEquiv = {};
        _this.pipeArguments = {};
        _this.tableColumn.type = 'service';
        _this.dialogService = injector.get(DialogService);
        return _this;
    }
    OTableCellRendererServiceComponent.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this.table) {
            var oCol = this.table.getOColumn(this.column);
            oCol.definition.contentAlign = oCol.definition.contentAlign ? oCol.definition.contentAlign : 'center';
        }
        this.colArray = Util.parseArray(this.columns, true);
        var pkArray = Util.parseArray(this.parentKeys);
        this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);
        this.configureService();
    };
    OTableCellRendererServiceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var oCol = this.table.getOColumn(this.column);
        if (Util.isDefined(oCol.editor)) {
            this.editorSuscription = oCol.editor.onPostUpdateRecord.subscribe(function (data) {
                _this.queryData(data[_this.tableColumn.attr], data);
            });
        }
    };
    OTableCellRendererServiceComponent.prototype.ngOnDestroy = function () {
        if (this.editorSuscription) {
            this.editorSuscription.unsubscribe();
        }
    };
    OTableCellRendererServiceComponent.prototype.getDescriptionValue = function (cellvalue, rowValue) {
        if (cellvalue !== undefined && this.cellValues.indexOf(cellvalue) === -1) {
            this.queryData(cellvalue, rowValue);
            this.cellValues.push(cellvalue);
        }
        return '';
    };
    OTableCellRendererServiceComponent.prototype.queryData = function (cellvalue, parentItem) {
        var _this = this;
        var self = this;
        if (!this.dataService || !(this.queryMethod in this.dataService) || !this.entity) {
            console.warn('Service not properly configured! aborting query');
            return;
        }
        var filter = ServiceUtils.getFilterUsingParentKeys(parentItem, this._pKeysEquiv);
        var tableColAlias = Object.keys(this._pKeysEquiv).find(function (key) { return _this._pKeysEquiv[key] === _this.column; });
        if (Util.isDefined(tableColAlias)) {
            if (!filter[tableColAlias]) {
                filter[tableColAlias] = cellvalue;
            }
        }
        else {
            filter[this.column] = cellvalue;
        }
        this.querySubscription = this.dataService[this.queryMethod](filter, this.colArray, this.entity)
            .subscribe(function (resp) {
            if (resp.isSuccessful()) {
                self.responseMap[cellvalue] = resp.data[0][self.valueColumn];
            }
        }, function (err) {
            console.error(err);
            if (err && typeof err !== 'object') {
                _this.dialogService.alert('ERROR', err);
            }
            else {
                _this.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
            }
        });
    };
    OTableCellRendererServiceComponent.prototype.configureService = function () {
        var loadingService = OntimizeService;
        if (this.serviceType) {
            loadingService = this.serviceType;
        }
        try {
            this.dataService = this.injector.get(loadingService);
            if (Util.isDataService(this.dataService)) {
                var serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
                if (this.entity) {
                    serviceCfg.entity = this.entity;
                }
                this.dataService.configureService(serviceCfg);
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    OTableCellRendererServiceComponent.prototype.getCellData = function (cellvalue, rowvalue) {
        return this.responseMap[cellvalue];
    };
    OTableCellRendererServiceComponent.prototype.getFilterExpression = function (quickFilter) {
        var _this = this;
        var oCol = this.table.getOColumn(this.column);
        var result;
        var cacheValue = Object.keys(this.responseMap).find(function (key) { return Util.normalizeString(_this.responseMap[key]).indexOf(Util.normalizeString(quickFilter)) !== -1; });
        if (cacheValue) {
            result = FilterExpressionUtils.buildExpressionEquals(this.column, SQLTypes.parseUsingSQLType(cacheValue, SQLTypes.getSQLTypeKey(oCol.sqlType)));
        }
        return result;
    };
    OTableCellRendererServiceComponent.prototype.setComponentPipe = function () {
        this.componentPipe = new OTranslatePipe(this.injector);
    };
    OTableCellRendererServiceComponent.prototype.responseValue = function (cellvalue, rowvalue) {
        if (this.translate) {
            this.pipeArguments = this.translateArgsFn ? { values: this.translateArgsFn(rowvalue) } : {};
            return _super.prototype.getCellData.call(this, cellvalue, rowvalue);
        }
        else {
            return cellvalue;
        }
    };
    OTableCellRendererServiceComponent.DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE = DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE;
    OTableCellRendererServiceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-table-cell-renderer-service',
                    template: "<ng-template #templateref let-cellvalue=\"cellvalue\" let-rowvalue=\"rowvalue\">\n  {{ getDescriptionValue(cellvalue, rowvalue) }}{{ responseValue(responseMap[cellvalue]) }}\n</ng-template>\n",
                    inputs: DEFAULT_INPUTS_O_TABLE_CELL_RENDERER_SERVICE,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [
                        OntimizeServiceProvider
                    ]
                }] }
    ];
    OTableCellRendererServiceComponent.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    OTableCellRendererServiceComponent.propDecorators = {
        templateref: [{ type: ViewChild, args: ['templateref', { read: TemplateRef, static: true },] }]
    };
    return OTableCellRendererServiceComponent;
}(OBaseTableCellRenderer));
export { OTableCellRendererServiceComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1jZWxsLXJlbmRlcmVyLXNlcnZpY2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2NvbHVtbi9jZWxsLXJlbmRlcmVyL3NlcnZpY2Uvby10YWJsZS1jZWxsLXJlbmRlcmVyLXNlcnZpY2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQWlCLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQXFCLFdBQVcsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJdkksT0FBTyxFQUEwQixjQUFjLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUMvRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDdkUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDNUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBRXBGLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUNwRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDakUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUVoRCxPQUFPLEVBQUUseUNBQXlDLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUV4SCxNQUFNLENBQUMsSUFBTSw0Q0FBNEMsb0JBQ3BELHlDQUF5QztJQUM1QyxRQUFRO0lBQ1IsU0FBUztJQUNULFNBQVM7SUFDVCxXQUFXO0lBQ1gsMkJBQTJCO0lBQzNCLHlCQUF5QjtJQUN6QiwyQkFBMkI7SUFDM0IsNEJBQTRC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QUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RixPQUFPLGlCQUFNLFdBQVcsWUFBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDL0M7YUFBTTtZQUNMLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQXBKYSwrRUFBNEMsR0FBRyw0Q0FBNEMsQ0FBQzs7Z0JBWjNHLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsK0JBQStCO29CQUN6QywyTUFBNkQ7b0JBQzdELE1BQU0sRUFBRSw0Q0FBNEM7b0JBQ3BELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxTQUFTLEVBQUU7d0JBRVQsdUJBQXVCO3FCQUN4QjtpQkFDRjs7O2dCQXZDMkQsUUFBUTs7OzhCQTRDakUsU0FBUyxTQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7SUFtSi9ELHlDQUFDO0NBQUEsQUFqS0QsQ0FVd0Qsc0JBQXNCLEdBdUo3RTtTQXZKWSxrQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbmplY3RvciwgT25EZXN0cm95LCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTZXJ2aWNlUmVzcG9uc2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL3NlcnZpY2UtcmVzcG9uc2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IElUcmFuc2xhdGVQaXBlQXJndW1lbnQsIE9UcmFuc2xhdGVQaXBlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vcGlwZXMvby10cmFuc2xhdGUucGlwZSc7XG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlUHJvdmlkZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy9mYWN0b3JpZXMnO1xuaW1wb3J0IHsgT250aW1pemVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vc2VydmljZXMvb250aW1pemUvb250aW1pemUuc2VydmljZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBGaWx0ZXJFeHByZXNzaW9uVXRpbHMgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi91dGlsL2ZpbHRlci1leHByZXNzaW9uLnV0aWxzJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBTUUxUeXBlcyB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvc3FsdHlwZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vLi4vby1jb2x1bW4uY2xhc3MnO1xuaW1wb3J0IHsgREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsIE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgfSBmcm9tICcuLi9vLWJhc2UtdGFibGUtY2VsbC1yZW5kZXJlci5jbGFzcyc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX1RBQkxFX0NFTExfUkVOREVSRVJfU0VSVklDRSA9IFtcbiAgLi4uREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIsXG4gICdlbnRpdHknLFxuICAnc2VydmljZScsXG4gICdjb2x1bW5zJyxcbiAgJ3RyYW5zbGF0ZScsXG4gICd2YWx1ZUNvbHVtbjogdmFsdWUtY29sdW1uJyxcbiAgJ3BhcmVudEtleXM6IHBhcmVudC1rZXlzJyxcbiAgJ3F1ZXJ5TWV0aG9kOiBxdWVyeS1tZXRob2QnLFxuICAnc2VydmljZVR5cGUgOiBzZXJ2aWNlLXR5cGUnLFxuICAndHJhbnNsYXRlQXJnc0ZuOiB0cmFuc2xhdGUtcGFyYW1zJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby10YWJsZS1jZWxsLXJlbmRlcmVyLXNlcnZpY2UnLFxuICB0ZW1wbGF0ZVVybDogJy4vby10YWJsZS1jZWxsLXJlbmRlcmVyLXNlcnZpY2UuY29tcG9uZW50Lmh0bWwnLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9TRVJWSUNFLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgLy8gU2VydmljZSByZW5kZXJlciBtdXN0IGhhdmUgaXRzIG93biBzZXJ2aWNlIGluc3RhbmNlIGluIG9yZGVyIHRvIGF2b2lkIG92ZXJyaWRpbmcgdGFibGUgc2VydmljZSBjb25maWd1cmF0aW9uXG4gICAgT250aW1pemVTZXJ2aWNlUHJvdmlkZXJcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVDZWxsUmVuZGVyZXJTZXJ2aWNlQ29tcG9uZW50IGV4dGVuZHMgT0Jhc2VUYWJsZUNlbGxSZW5kZXJlciBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBwdWJsaWMgc3RhdGljIERFRkFVTFRfSU5QVVRTX09fVEFCTEVfQ0VMTF9SRU5ERVJFUl9TRVJWSUNFID0gREVGQVVMVF9JTlBVVFNfT19UQUJMRV9DRUxMX1JFTkRFUkVSX1NFUlZJQ0U7XG5cbiAgQFZpZXdDaGlsZCgndGVtcGxhdGVyZWYnLCB7IHJlYWQ6IFRlbXBsYXRlUmVmLCBzdGF0aWM6IHRydWUgfSkgcHVibGljIHRlbXBsYXRlcmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIHB1YmxpYyByb3dEYXRhOiBhbnk7XG4gIHB1YmxpYyBjZWxsVmFsdWVzID0gW107XG4gIHB1YmxpYyByZW5kZXJWYWx1ZTogYW55O1xuICBwdWJsaWMgcmVzcG9uc2VNYXAgPSB7fTtcblxuICAvKiBJbnB1dHMgKi9cbiAgcHJvdGVjdGVkIGVudGl0eTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgc2VydmljZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgY29sdW1uczogc3RyaW5nO1xuICBwcm90ZWN0ZWQgdHJhbnNsYXRlOiBib29sZWFuID0gZmFsc2U7XG4gIHByb3RlY3RlZCB2YWx1ZUNvbHVtbjogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcGFyZW50S2V5czogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcXVlcnlNZXRob2Q6IHN0cmluZyA9IENvZGVzLlFVRVJZX01FVEhPRDtcbiAgcHJvdGVjdGVkIHNlcnZpY2VUeXBlOiBzdHJpbmc7XG5cbiAgLyogSW50ZXJuYWwgdmFyaWFibGVzICovXG4gIHByb3RlY3RlZCBjb2xBcnJheTogc3RyaW5nW10gPSBbXTtcbiAgcHJvdGVjdGVkIGRhdGFTZXJ2aWNlOiBhbnk7XG4gIHByb3RlY3RlZCBfcEtleXNFcXVpdiA9IHt9O1xuICBwcm90ZWN0ZWQgcXVlcnlTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG5cbiAgcHVibGljIHRyYW5zbGF0ZUFyZ3NGbjogKHJvd0RhdGE6IGFueSkgPT4gYW55W107XG4gIHByb3RlY3RlZCBjb21wb25lbnRQaXBlOiBPVHJhbnNsYXRlUGlwZTtcbiAgcHJvdGVjdGVkIHBpcGVBcmd1bWVudHM6IElUcmFuc2xhdGVQaXBlQXJndW1lbnQgPSB7fTtcblxuICBwcm90ZWN0ZWQgZWRpdG9yU3VzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICAgIHRoaXMudGFibGVDb2x1bW4udHlwZSA9ICdzZXJ2aWNlJztcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgaWYgKHRoaXMudGFibGUpIHtcbiAgICAgIGNvbnN0IG9Db2w6IE9Db2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5jb2x1bW4pO1xuICAgICAgb0NvbC5kZWZpbml0aW9uLmNvbnRlbnRBbGlnbiA9IG9Db2wuZGVmaW5pdGlvbi5jb250ZW50QWxpZ24gPyBvQ29sLmRlZmluaXRpb24uY29udGVudEFsaWduIDogJ2NlbnRlcic7XG4gICAgfVxuXG4gICAgdGhpcy5jb2xBcnJheSA9IFV0aWwucGFyc2VBcnJheSh0aGlzLmNvbHVtbnMsIHRydWUpO1xuICAgIGNvbnN0IHBrQXJyYXkgPSBVdGlsLnBhcnNlQXJyYXkodGhpcy5wYXJlbnRLZXlzKTtcbiAgICB0aGlzLl9wS2V5c0VxdWl2ID0gVXRpbC5wYXJzZVBhcmVudEtleXNFcXVpdmFsZW5jZXMocGtBcnJheSk7XG4gICAgdGhpcy5jb25maWd1cmVTZXJ2aWNlKCk7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IG9Db2w6IE9Db2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5jb2x1bW4pO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChvQ29sLmVkaXRvcikpIHtcbiAgICAgIHRoaXMuZWRpdG9yU3VzY3JpcHRpb24gPSBvQ29sLmVkaXRvci5vblBvc3RVcGRhdGVSZWNvcmQuc3Vic2NyaWJlKChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyeURhdGEoZGF0YVt0aGlzLnRhYmxlQ29sdW1uLmF0dHJdLCBkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lZGl0b3JTdXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5lZGl0b3JTdXNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBnZXREZXNjcmlwdGlvblZhbHVlKGNlbGx2YWx1ZTogYW55LCByb3dWYWx1ZTogYW55KTogc3RyaW5nIHtcbiAgICBpZiAoY2VsbHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5jZWxsVmFsdWVzLmluZGV4T2YoY2VsbHZhbHVlKSA9PT0gLTEpIHtcbiAgICAgIHRoaXMucXVlcnlEYXRhKGNlbGx2YWx1ZSwgcm93VmFsdWUpO1xuICAgICAgdGhpcy5jZWxsVmFsdWVzLnB1c2goY2VsbHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcHVibGljIHF1ZXJ5RGF0YShjZWxsdmFsdWUsIHBhcmVudEl0ZW0/OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMuZGF0YVNlcnZpY2UgfHwgISh0aGlzLnF1ZXJ5TWV0aG9kIGluIHRoaXMuZGF0YVNlcnZpY2UpIHx8ICF0aGlzLmVudGl0eSkge1xuICAgICAgY29uc29sZS53YXJuKCdTZXJ2aWNlIG5vdCBwcm9wZXJseSBjb25maWd1cmVkISBhYm9ydGluZyBxdWVyeScpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBmaWx0ZXIgPSBTZXJ2aWNlVXRpbHMuZ2V0RmlsdGVyVXNpbmdQYXJlbnRLZXlzKHBhcmVudEl0ZW0sIHRoaXMuX3BLZXlzRXF1aXYpO1xuICAgIGNvbnN0IHRhYmxlQ29sQWxpYXMgPSBPYmplY3Qua2V5cyh0aGlzLl9wS2V5c0VxdWl2KS5maW5kKGtleSA9PiB0aGlzLl9wS2V5c0VxdWl2W2tleV0gPT09IHRoaXMuY29sdW1uKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGFibGVDb2xBbGlhcykpIHtcbiAgICAgIGlmICghZmlsdGVyW3RhYmxlQ29sQWxpYXNdKSB7XG4gICAgICAgIGZpbHRlclt0YWJsZUNvbEFsaWFzXSA9IGNlbGx2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyW3RoaXMuY29sdW1uXSA9IGNlbGx2YWx1ZTtcbiAgICB9XG4gICAgdGhpcy5xdWVyeVN1YnNjcmlwdGlvbiA9IHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5xdWVyeU1ldGhvZF0oZmlsdGVyLCB0aGlzLmNvbEFycmF5LCB0aGlzLmVudGl0eSlcbiAgICAgIC5zdWJzY3JpYmUoKHJlc3A6IFNlcnZpY2VSZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgICAgIHNlbGYucmVzcG9uc2VNYXBbY2VsbHZhbHVlXSA9IHJlc3AuZGF0YVswXVtzZWxmLnZhbHVlQ29sdW1uXTtcbiAgICAgICAgfVxuICAgICAgfSwgZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICBpZiAoZXJyICYmIHR5cGVvZiBlcnIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsIGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmFsZXJ0KCdFUlJPUicsICdNRVNTQUdFUy5FUlJPUl9RVUVSWScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjb25maWd1cmVTZXJ2aWNlKCk6IHZvaWQge1xuICAgIGxldCBsb2FkaW5nU2VydmljZTogYW55ID0gT250aW1pemVTZXJ2aWNlO1xuICAgIGlmICh0aGlzLnNlcnZpY2VUeXBlKSB7XG4gICAgICBsb2FkaW5nU2VydmljZSA9IHRoaXMuc2VydmljZVR5cGU7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICB0aGlzLmRhdGFTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQobG9hZGluZ1NlcnZpY2UpO1xuICAgICAgaWYgKFV0aWwuaXNEYXRhU2VydmljZSh0aGlzLmRhdGFTZXJ2aWNlKSkge1xuICAgICAgICBjb25zdCBzZXJ2aWNlQ2ZnID0gdGhpcy5kYXRhU2VydmljZS5nZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24odGhpcy5zZXJ2aWNlKTtcbiAgICAgICAgaWYgKHRoaXMuZW50aXR5KSB7XG4gICAgICAgICAgc2VydmljZUNmZy5lbnRpdHkgPSB0aGlzLmVudGl0eTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRhdGFTZXJ2aWNlLmNvbmZpZ3VyZVNlcnZpY2Uoc2VydmljZUNmZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2VsbERhdGEoY2VsbHZhbHVlOiBhbnksIHJvd3ZhbHVlPzogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZU1hcFtjZWxsdmFsdWVdO1xuICB9XG5cbiAgcHVibGljIGdldEZpbHRlckV4cHJlc3Npb24ocXVpY2tGaWx0ZXI6IHN0cmluZyk6IEV4cHJlc3Npb24ge1xuICAgIGNvbnN0IG9Db2w6IE9Db2x1bW4gPSB0aGlzLnRhYmxlLmdldE9Db2x1bW4odGhpcy5jb2x1bW4pO1xuICAgIGxldCByZXN1bHQ6IEV4cHJlc3Npb247XG4gICAgY29uc3QgY2FjaGVWYWx1ZSA9IE9iamVjdC5rZXlzKHRoaXMucmVzcG9uc2VNYXApLmZpbmQoa2V5ID0+IFV0aWwubm9ybWFsaXplU3RyaW5nKHRoaXMucmVzcG9uc2VNYXBba2V5XSkuaW5kZXhPZihVdGlsLm5vcm1hbGl6ZVN0cmluZyhxdWlja0ZpbHRlcikpICE9PSAtMSk7XG4gICAgaWYgKGNhY2hlVmFsdWUpIHtcbiAgICAgIHJlc3VsdCA9IEZpbHRlckV4cHJlc3Npb25VdGlscy5idWlsZEV4cHJlc3Npb25FcXVhbHModGhpcy5jb2x1bW4sIFNRTFR5cGVzLnBhcnNlVXNpbmdTUUxUeXBlKGNhY2hlVmFsdWUsIFNRTFR5cGVzLmdldFNRTFR5cGVLZXkob0NvbC5zcWxUeXBlKSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHVibGljIHNldENvbXBvbmVudFBpcGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRQaXBlID0gbmV3IE9UcmFuc2xhdGVQaXBlKHRoaXMuaW5qZWN0b3IpO1xuICB9XG5cbiAgcHVibGljIHJlc3BvbnNlVmFsdWUoY2VsbHZhbHVlOiBhbnksIHJvd3ZhbHVlPzogYW55KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy50cmFuc2xhdGUpIHtcbiAgICAgIHRoaXMucGlwZUFyZ3VtZW50cyA9IHRoaXMudHJhbnNsYXRlQXJnc0ZuID8geyB2YWx1ZXM6IHRoaXMudHJhbnNsYXRlQXJnc0ZuKHJvd3ZhbHVlKSB9IDoge307XG4gICAgICByZXR1cm4gc3VwZXIuZ2V0Q2VsbERhdGEoY2VsbHZhbHVlLCByb3d2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjZWxsdmFsdWU7XG4gICAgfVxuICB9XG59XG4iXX0=