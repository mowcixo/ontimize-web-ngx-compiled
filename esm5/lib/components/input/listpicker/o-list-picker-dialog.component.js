import { Component, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Util } from '../../../util/util';
import { OSearchInputComponent } from '../../input/search-input/o-search-input.component';
export var DEFAULT_INPUTS_O_LIST_PICKER_DIALOG = [
    'data',
    'visibleColumns: visible-columns',
    'filter'
];
var OListPickerDialogComponent = (function () {
    function OListPickerDialogComponent(dialogRef, injector, data) {
        this.dialogRef = dialogRef;
        this.injector = injector;
        this.filter = true;
        this.visibleData = [];
        this.data = [];
        this._startIndex = 0;
        this.recordsNumber = 100;
        this.scrollThreshold = 200;
        if (data.data && Util.isArray(data.data)) {
            this.data = data.data;
        }
        if (data.visibleColumns && Util.isArray(data.visibleColumns)) {
            this.visibleColsArray = data.visibleColumns;
        }
        if (data.queryRows !== undefined) {
            this.recordsNumber = data.queryRows;
        }
        if (data.filter !== undefined) {
            this.filter = data.filter;
        }
        if (data.menuColumns) {
            this.menuColumns = data.menuColumns;
        }
        this.searchVal = data.searchVal;
        this.startIndex = 0;
    }
    OListPickerDialogComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (Util.isDefined(this.searchVal) && this.searchInput !== undefined && this.searchVal.length > 0) {
            this.searchInput.getFormControl().setValue(this.searchVal, {
                emitEvent: false
            });
            setTimeout(function () { return _this.searchInput.onSearch.emit(_this.searchVal); });
        }
    };
    Object.defineProperty(OListPickerDialogComponent.prototype, "startIndex", {
        get: function () {
            return this._startIndex;
        },
        set: function (val) {
            this._startIndex = val;
            this.visibleData = this.data.slice(this.startIndex, this.recordsNumber);
        },
        enumerable: true,
        configurable: true
    });
    OListPickerDialogComponent.prototype.onClickListItem = function (e, value) {
        this.dialogRef.close(value);
    };
    OListPickerDialogComponent.prototype.trackByFn = function (index, item) {
        return index;
    };
    OListPickerDialogComponent.prototype.onScroll = function (event) {
        if (event && event.target && this.visibleData.length < this.data.length) {
            var pendingScroll = event.target.scrollHeight - (event.target.scrollTop + event.target.clientHeight);
            if (!isNaN(pendingScroll) && pendingScroll <= this.scrollThreshold) {
                var index = this.visibleData.length;
                var searchVal = this.searchInput.getValue();
                if (Util.isDefined(searchVal) && searchVal.length > 0) {
                    index = this.visibleData[this.visibleData.length - 1]['_parsedIndex'];
                }
                var appendData = this.data.slice(index, this.visibleData.length + this.recordsNumber);
                if (appendData.length) {
                    appendData = this.transform(appendData, {
                        filtervalue: this.searchInput.getValue(),
                        filtercolumns: this.visibleColsArray
                    });
                    if (appendData.length) {
                        this.visibleData = this.visibleData.concat(appendData);
                    }
                }
            }
        }
    };
    OListPickerDialogComponent.prototype.onFilterList = function (searchVal) {
        var transformData = this.transform(this.data, {
            filtervalue: searchVal,
            filtercolumns: this.visibleColsArray
        });
        this._startIndex = 0;
        this.visibleData = transformData.slice(this.startIndex, this.recordsNumber);
    };
    OListPickerDialogComponent.prototype.isEmptyData = function () {
        return Util.isDefined(this.visibleData) ? this.visibleData.length === 0 : true;
    };
    OListPickerDialogComponent.prototype.transform = function (value, args) {
        var _this = this;
        if (!args || args.length <= 1) {
            return value;
        }
        var filterValue = args['filtervalue'] ? args['filtervalue'] : '';
        var filterColumns = args['filtercolumns'];
        if (!filterColumns || !filterValue || filterValue.length === 0) {
            return value;
        }
        if (value === undefined || value === null) {
            return value;
        }
        return value.filter(function (item) {
            for (var i = 0; i < filterColumns.length; i++) {
                var colName = filterColumns[i];
                if (_this._isBlank(colName)) {
                    continue;
                }
                var origValue = item[colName];
                if (origValue) {
                    origValue = origValue.toString();
                    if (_this._isBlank(origValue)) {
                        continue;
                    }
                    if (origValue.toUpperCase().indexOf(filterValue.toUpperCase()) > -1) {
                        return item;
                    }
                }
            }
        });
    };
    OListPickerDialogComponent.prototype._isBlank = function (value) {
        return !Util.isDefined(value) || value.length === 0;
    };
    OListPickerDialogComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-list-picker-dialog',
                    template: "<div class=\"title-container\" *ngIf=\"filter\">\n  <o-search-input #searchInput [columns]=\"menuColumns\" show-menu=\"no\" float-label=\"never\" (onSearch)=\"onFilterList($event)\"\n    class=\"o-list-picker-search\" appearance=\"legacy\"></o-search-input>\n</div>\n<div mat-dialog-content (scroll)=\"onScroll($event)\" [class.o-list-picker-has-filter]=\"filter\" fxFlex>\n  <mat-list>\n    <mat-list-item *ngIf=\"isEmptyData()\">\n      {{ 'LIST.EMPTY' | oTranslate }}\n      <ng-container *ngIf=\"filter && searchInput && searchInput.getValue() && searchInput.getValue().length > 0\">\n        {{ 'LIST.EMPTY_USING_FILTER' | oTranslate : { values: [searchInput.getValue()] } }}\n      </ng-container>\n    </mat-list-item>\n    <mat-list-item (click)=\"onClickListItem($event, item)\" *ngFor=\"let item of visibleData; trackBy: trackByFn\">\n      <span>{{ item['_parsedVisibleColumnText'] }}</span>\n      <mat-divider></mat-divider>\n    </mat-list-item>\n  </mat-list>\n</div>\n<mat-dialog-actions align=\"end\">\n  <button type=\"button\" mat-stroked-button mat-dialog-close>{{ 'CANCEL' | oTranslate | uppercase }}</button>\n</mat-dialog-actions>\n",
                    inputs: DEFAULT_INPUTS_O_LIST_PICKER_DIALOG,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-list-picker-dialog]': 'true'
                    },
                    styles: [".cdk-overlay-list-picker .mat-dialog-container{padding:0}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog{display:flex;flex-direction:column;height:100%}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog .title-container{padding:5px 20px}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog .title-container .o-search-input mat-form-field .mat-form-field-wrapper{padding-bottom:0}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog .title-container .o-search-input mat-form-field .mat-form-field-wrapper .mat-form-field-underline{display:none}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog .mat-dialog-content{margin:0}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog .mat-dialog-content mat-list mat-list-item{cursor:pointer}.cdk-overlay-list-picker .mat-dialog-container .o-list-picker-dialog .mat-dialog-actions{padding-top:12px;margin:0 12px}"]
                }] }
    ];
    OListPickerDialogComponent.ctorParameters = function () { return [
        { type: MatDialogRef },
        { type: Injector },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
    ]; };
    OListPickerDialogComponent.propDecorators = {
        searchInput: [{ type: ViewChild, args: ['searchInput', { static: false },] }]
    };
    return OListPickerDialogComponent;
}());
export { OListPickerDialogComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2xpc3RwaWNrZXIvby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBRTFGLE1BQU0sQ0FBQyxJQUFNLG1DQUFtQyxHQUFHO0lBQ2pELE1BQU07SUFDTixpQ0FBaUM7SUFDakMsUUFBUTtDQUNULENBQUM7QUFFRjtJQTBCRSxvQ0FDUyxTQUFtRCxFQUNoRCxRQUFrQixFQUNILElBQVM7UUFGM0IsY0FBUyxHQUFULFNBQVMsQ0FBMEM7UUFDaEQsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQWhCdkIsV0FBTSxHQUFZLElBQUksQ0FBQztRQUN2QixnQkFBVyxHQUFRLEVBQUUsQ0FBQztRQU1uQixTQUFJLEdBQVUsRUFBRSxDQUFDO1FBR2pCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBQ3hCLGtCQUFhLEdBQVcsR0FBRyxDQUFDO1FBQzVCLG9CQUFlLEdBQVcsR0FBRyxDQUFDO1FBT3RDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDdkI7UUFDRCxJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDNUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDN0M7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNyQztRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUNyQztRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRU0sb0RBQWUsR0FBdEI7UUFBQSxpQkFRQztRQVBDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ2pHLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ3pELFNBQVMsRUFBRSxLQUFLO2FBQ2pCLENBQUMsQ0FBQztZQUVILFVBQVUsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxTQUFTLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO1NBQ2xFO0lBQ0gsQ0FBQztJQUVELHNCQUFJLGtEQUFVO2FBQWQ7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDMUIsQ0FBQzthQUVELFVBQWUsR0FBVztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFFLENBQUM7OztPQUxBO0lBT00sb0RBQWUsR0FBdEIsVUFBdUIsQ0FBTSxFQUFFLEtBQVU7UUFDdkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLDhDQUFTLEdBQWhCLFVBQWlCLEtBQWEsRUFBRSxJQUFTO1FBQ3ZDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVNLDZDQUFRLEdBQWYsVUFBZ0IsS0FBVTtRQUN4QixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3ZFLElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2RyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUNsRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDcEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDOUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNyRCxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztpQkFDdkU7Z0JBQ0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUNyQixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7d0JBQ3RDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTt3QkFDeEMsYUFBYSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7cUJBQ3JDLENBQUMsQ0FBQztvQkFDSCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7d0JBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7cUJBQ3hEO2lCQUNGO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFTSxpREFBWSxHQUFuQixVQUFvQixTQUFjO1FBQ2hDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUM1QyxXQUFXLEVBQUUsU0FBUztZQUN0QixhQUFhLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjtTQUNyQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVNLGdEQUFXLEdBQWxCO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDakYsQ0FBQztJQUVPLDhDQUFTLEdBQWpCLFVBQWtCLEtBQVksRUFBRSxJQUFTO1FBQXpDLGlCQW1DQztRQWxDQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ25FLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUU1QyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlELE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUN6QyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtZQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDN0MsSUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzFCLFNBQVM7aUJBQ1Y7Z0JBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QixJQUFJLFNBQVMsRUFBRTtvQkFDYixTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNqQyxJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQzVCLFNBQVM7cUJBQ1Y7b0JBRUQsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO3dCQUNuRSxPQUFPLElBQUksQ0FBQztxQkFDYjtpQkFDRjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sNkNBQVEsR0FBaEIsVUFBaUIsS0FBYTtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDOztnQkF4SkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLCtvQ0FBb0Q7b0JBRXBELE1BQU0sRUFBRSxtQ0FBbUM7b0JBQzNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0osOEJBQThCLEVBQUUsTUFBTTtxQkFDdkM7O2lCQUNGOzs7Z0JBcEJ5QixZQUFZO2dCQURLLFFBQVE7Z0RBeUM5QyxNQUFNLFNBQUMsZUFBZTs7OzhCQWJ4QixTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7SUEwSTdDLGlDQUFDO0NBQUEsQUExSkQsSUEwSkM7U0FoSlksMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBJbmplY3QsIEluamVjdG9yLCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNQVRfRElBTE9HX0RBVEEsIE1hdERpYWxvZ1JlZiB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcblxuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPU2VhcmNoSW5wdXRDb21wb25lbnQgfSBmcm9tICcuLi8uLi9pbnB1dC9zZWFyY2gtaW5wdXQvby1zZWFyY2gtaW5wdXQuY29tcG9uZW50JztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTElTVF9QSUNLRVJfRElBTE9HID0gW1xuICAnZGF0YScsXG4gICd2aXNpYmxlQ29sdW1uczogdmlzaWJsZS1jb2x1bW5zJyxcbiAgJ2ZpbHRlcidcbl07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ28tbGlzdC1waWNrZXItZGlhbG9nJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tbGlzdC1waWNrZXItZGlhbG9nLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50LnNjc3MnXSxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0xJU1RfUElDS0VSX0RJQUxPRyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1saXN0LXBpY2tlci1kaWFsb2ddJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0xpc3RQaWNrZXJEaWFsb2dDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBwdWJsaWMgZmlsdGVyOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHZpc2libGVEYXRhOiBhbnkgPSBbXTtcbiAgcHVibGljIHNlYXJjaFZhbDogc3RyaW5nO1xuXG4gIEBWaWV3Q2hpbGQoJ3NlYXJjaElucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pXG4gIHB1YmxpYyBzZWFyY2hJbnB1dDogT1NlYXJjaElucHV0Q29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBkYXRhOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgbWVudUNvbHVtbnM6IHN0cmluZztcbiAgcHJvdGVjdGVkIHZpc2libGVDb2xzQXJyYXk6IHN0cmluZ1tdO1xuICBwcm90ZWN0ZWQgX3N0YXJ0SW5kZXg6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCByZWNvcmRzTnVtYmVyOiBudW1iZXIgPSAxMDA7XG4gIHByb3RlY3RlZCBzY3JvbGxUaHJlc2hvbGQ6IG51bWJlciA9IDIwMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZGlhbG9nUmVmOiBNYXREaWFsb2dSZWY8T0xpc3RQaWNrZXJEaWFsb2dDb21wb25lbnQ+LFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgQEluamVjdChNQVRfRElBTE9HX0RBVEEpIGRhdGE6IGFueVxuICApIHtcbiAgICBpZiAoZGF0YS5kYXRhICYmIFV0aWwuaXNBcnJheShkYXRhLmRhdGEpKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhLmRhdGE7XG4gICAgfVxuICAgIGlmIChkYXRhLnZpc2libGVDb2x1bW5zICYmIFV0aWwuaXNBcnJheShkYXRhLnZpc2libGVDb2x1bW5zKSkge1xuICAgICAgdGhpcy52aXNpYmxlQ29sc0FycmF5ID0gZGF0YS52aXNpYmxlQ29sdW1ucztcbiAgICB9XG4gICAgaWYgKGRhdGEucXVlcnlSb3dzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVjb3Jkc051bWJlciA9IGRhdGEucXVlcnlSb3dzO1xuICAgIH1cbiAgICBpZiAoZGF0YS5maWx0ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5maWx0ZXIgPSBkYXRhLmZpbHRlcjtcbiAgICB9XG4gICAgaWYgKGRhdGEubWVudUNvbHVtbnMpIHtcbiAgICAgIHRoaXMubWVudUNvbHVtbnMgPSBkYXRhLm1lbnVDb2x1bW5zO1xuICAgIH1cbiAgICB0aGlzLnNlYXJjaFZhbCA9IGRhdGEuc2VhcmNoVmFsO1xuICAgIHRoaXMuc3RhcnRJbmRleCA9IDA7XG4gIH1cblxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnNlYXJjaFZhbCkgJiYgdGhpcy5zZWFyY2hJbnB1dCAhPT0gdW5kZWZpbmVkICYmIHRoaXMuc2VhcmNoVmFsLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc2VhcmNoSW5wdXQuZ2V0Rm9ybUNvbnRyb2woKS5zZXRWYWx1ZSh0aGlzLnNlYXJjaFZhbCwge1xuICAgICAgICBlbWl0RXZlbnQ6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIC8vVE9ETyBpbXByb3ZlOiBBZGRlZCBzZXRUaW1lb3V0IGZvciByZXNvbHZpbmcgRXhwcmVzc2lvbkNoYW5nZWRBZnRlckl0SGFzQmVlbkNoZWNrZWRFcnJvciBlcnJvciBiZWNhdXNlIHRoZSBvYnNlcnZhYmxlcyBkb250IHdvcmtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZWFyY2hJbnB1dC5vblNlYXJjaC5lbWl0KHRoaXMuc2VhcmNoVmFsKSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHN0YXJ0SW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhcnRJbmRleDtcbiAgfVxuXG4gIHNldCBzdGFydEluZGV4KHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fc3RhcnRJbmRleCA9IHZhbDtcbiAgICB0aGlzLnZpc2libGVEYXRhID0gdGhpcy5kYXRhLnNsaWNlKHRoaXMuc3RhcnRJbmRleCwgdGhpcy5yZWNvcmRzTnVtYmVyKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNsaWNrTGlzdEl0ZW0oZTogYW55LCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5kaWFsb2dSZWYuY2xvc2UodmFsdWUpO1xuICB9XG5cbiAgcHVibGljIHRyYWNrQnlGbihpbmRleDogbnVtYmVyLCBpdGVtOiBhbnkpOiBudW1iZXIge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBvblNjcm9sbChldmVudDogYW55KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50ICYmIGV2ZW50LnRhcmdldCAmJiB0aGlzLnZpc2libGVEYXRhLmxlbmd0aCA8IHRoaXMuZGF0YS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBlbmRpbmdTY3JvbGwgPSBldmVudC50YXJnZXQuc2Nyb2xsSGVpZ2h0IC0gKGV2ZW50LnRhcmdldC5zY3JvbGxUb3AgKyBldmVudC50YXJnZXQuY2xpZW50SGVpZ2h0KTtcbiAgICAgIGlmICghaXNOYU4ocGVuZGluZ1Njcm9sbCkgJiYgcGVuZGluZ1Njcm9sbCA8PSB0aGlzLnNjcm9sbFRocmVzaG9sZCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnZpc2libGVEYXRhLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2VhcmNoVmFsID0gdGhpcy5zZWFyY2hJbnB1dC5nZXRWYWx1ZSgpO1xuICAgICAgICBpZiAoVXRpbC5pc0RlZmluZWQoc2VhcmNoVmFsKSAmJiBzZWFyY2hWYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGluZGV4ID0gdGhpcy52aXNpYmxlRGF0YVt0aGlzLnZpc2libGVEYXRhLmxlbmd0aCAtIDFdWydfcGFyc2VkSW5kZXgnXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXBwZW5kRGF0YSA9IHRoaXMuZGF0YS5zbGljZShpbmRleCwgdGhpcy52aXNpYmxlRGF0YS5sZW5ndGggKyB0aGlzLnJlY29yZHNOdW1iZXIpO1xuICAgICAgICBpZiAoYXBwZW5kRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICBhcHBlbmREYXRhID0gdGhpcy50cmFuc2Zvcm0oYXBwZW5kRGF0YSwge1xuICAgICAgICAgICAgZmlsdGVydmFsdWU6IHRoaXMuc2VhcmNoSW5wdXQuZ2V0VmFsdWUoKSxcbiAgICAgICAgICAgIGZpbHRlcmNvbHVtbnM6IHRoaXMudmlzaWJsZUNvbHNBcnJheVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChhcHBlbmREYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy52aXNpYmxlRGF0YSA9IHRoaXMudmlzaWJsZURhdGEuY29uY2F0KGFwcGVuZERhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkZpbHRlckxpc3Qoc2VhcmNoVmFsOiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgdHJhbnNmb3JtRGF0YSA9IHRoaXMudHJhbnNmb3JtKHRoaXMuZGF0YSwge1xuICAgICAgZmlsdGVydmFsdWU6IHNlYXJjaFZhbCxcbiAgICAgIGZpbHRlcmNvbHVtbnM6IHRoaXMudmlzaWJsZUNvbHNBcnJheVxuICAgIH0pO1xuICAgIHRoaXMuX3N0YXJ0SW5kZXggPSAwO1xuICAgIHRoaXMudmlzaWJsZURhdGEgPSB0cmFuc2Zvcm1EYXRhLnNsaWNlKHRoaXMuc3RhcnRJbmRleCwgdGhpcy5yZWNvcmRzTnVtYmVyKTtcbiAgfVxuXG4gIHB1YmxpYyBpc0VtcHR5RGF0YSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy52aXNpYmxlRGF0YSkgPyB0aGlzLnZpc2libGVEYXRhLmxlbmd0aCA9PT0gMCA6IHRydWU7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zZm9ybSh2YWx1ZTogYW55W10sIGFyZ3M6IGFueSk6IGFueSB7XG4gICAgaWYgKCFhcmdzIHx8IGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWx0ZXJWYWx1ZSA9IGFyZ3NbJ2ZpbHRlcnZhbHVlJ10gPyBhcmdzWydmaWx0ZXJ2YWx1ZSddIDogJyc7XG4gICAgY29uc3QgZmlsdGVyQ29sdW1ucyA9IGFyZ3NbJ2ZpbHRlcmNvbHVtbnMnXTtcblxuICAgIGlmICghZmlsdGVyQ29sdW1ucyB8fCAhZmlsdGVyVmFsdWUgfHwgZmlsdGVyVmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWUuZmlsdGVyKGl0ZW0gPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbE5hbWUgPSBmaWx0ZXJDb2x1bW5zW2ldO1xuICAgICAgICBpZiAodGhpcy5faXNCbGFuayhjb2xOYW1lKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvcmlnVmFsdWUgPSBpdGVtW2NvbE5hbWVdO1xuICAgICAgICBpZiAob3JpZ1ZhbHVlKSB7XG4gICAgICAgICAgb3JpZ1ZhbHVlID0gb3JpZ1ZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgaWYgKHRoaXMuX2lzQmxhbmsob3JpZ1ZhbHVlKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG9yaWdWYWx1ZS50b1VwcGVyQ2FzZSgpLmluZGV4T2YoZmlsdGVyVmFsdWUudG9VcHBlckNhc2UoKSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9pc0JsYW5rKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIVV0aWwuaXNEZWZpbmVkKHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPT09IDA7XG4gIH1cblxufVxuIl19