import { Component, Inject, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Util } from '../../../util/util';
import { OSearchInputComponent } from '../../input/search-input/o-search-input.component';
export const DEFAULT_INPUTS_O_LIST_PICKER_DIALOG = [
    'data',
    'visibleColumns: visible-columns',
    'filter'
];
export class OListPickerDialogComponent {
    constructor(dialogRef, injector, data) {
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
    ngAfterViewInit() {
        if (Util.isDefined(this.searchVal) && this.searchInput !== undefined && this.searchVal.length > 0) {
            this.searchInput.getFormControl().setValue(this.searchVal, {
                emitEvent: false
            });
            setTimeout(() => this.searchInput.onSearch.emit(this.searchVal));
        }
    }
    get startIndex() {
        return this._startIndex;
    }
    set startIndex(val) {
        this._startIndex = val;
        this.visibleData = this.data.slice(this.startIndex, this.recordsNumber);
    }
    onClickListItem(e, value) {
        this.dialogRef.close(value);
    }
    trackByFn(index, item) {
        return index;
    }
    onScroll(event) {
        if (event && event.target && this.visibleData.length < this.data.length) {
            const pendingScroll = event.target.scrollHeight - (event.target.scrollTop + event.target.clientHeight);
            if (!isNaN(pendingScroll) && pendingScroll <= this.scrollThreshold) {
                let index = this.visibleData.length;
                const searchVal = this.searchInput.getValue();
                if (Util.isDefined(searchVal) && searchVal.length > 0) {
                    index = this.visibleData[this.visibleData.length - 1]['_parsedIndex'];
                }
                let appendData = this.data.slice(index, this.visibleData.length + this.recordsNumber);
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
    }
    onFilterList(searchVal) {
        let transformData = this.transform(this.data, {
            filtervalue: searchVal,
            filtercolumns: this.visibleColsArray
        });
        this._startIndex = 0;
        this.visibleData = transformData.slice(this.startIndex, this.recordsNumber);
    }
    isEmptyData() {
        return Util.isDefined(this.visibleData) ? this.visibleData.length === 0 : true;
    }
    transform(value, args) {
        if (!args || args.length <= 1) {
            return value;
        }
        const filterValue = args['filtervalue'] ? args['filtervalue'] : '';
        const filterColumns = args['filtercolumns'];
        if (!filterColumns || !filterValue || filterValue.length === 0) {
            return value;
        }
        if (value === undefined || value === null) {
            return value;
        }
        return value.filter(item => {
            for (let i = 0; i < filterColumns.length; i++) {
                const colName = filterColumns[i];
                if (this._isBlank(colName)) {
                    continue;
                }
                let origValue = item[colName];
                if (origValue) {
                    origValue = origValue.toString();
                    if (this._isBlank(origValue)) {
                        continue;
                    }
                    if (origValue.toUpperCase().indexOf(filterValue.toUpperCase()) > -1) {
                        return item;
                    }
                }
            }
        });
    }
    _isBlank(value) {
        return !Util.isDefined(value) || value.length === 0;
    }
}
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
OListPickerDialogComponent.ctorParameters = () => [
    { type: MatDialogRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_DIALOG_DATA,] }] }
];
OListPickerDialogComponent.propDecorators = {
    searchInput: [{ type: ViewChild, args: ['searchInput', { static: false },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL2lucHV0L2xpc3RwaWNrZXIvby1saXN0LXBpY2tlci1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxlQUFlLEVBQUUsWUFBWSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbEUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBRTFGLE1BQU0sQ0FBQyxNQUFNLG1DQUFtQyxHQUFHO0lBQ2pELE1BQU07SUFDTixpQ0FBaUM7SUFDakMsUUFBUTtDQUNULENBQUM7QUFZRixNQUFNLE9BQU8sMEJBQTBCO0lBZ0JyQyxZQUNTLFNBQW1ELEVBQ2hELFFBQWtCLEVBQ0gsSUFBUztRQUYzQixjQUFTLEdBQVQsU0FBUyxDQUEwQztRQUNoRCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBaEJ2QixXQUFNLEdBQVksSUFBSSxDQUFDO1FBQ3ZCLGdCQUFXLEdBQVEsRUFBRSxDQUFDO1FBTW5CLFNBQUksR0FBVSxFQUFFLENBQUM7UUFHakIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFDeEIsa0JBQWEsR0FBVyxHQUFHLENBQUM7UUFDNUIsb0JBQWUsR0FBVyxHQUFHLENBQUM7UUFPdEMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztTQUN2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QVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7d0JBQ25FLE9BQU8sSUFBSSxDQUFDO3FCQUNiO2lCQUNGO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxRQUFRLENBQUMsS0FBYTtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztJQUN0RCxDQUFDOzs7WUF4SkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLCtvQ0FBb0Q7Z0JBRXBELE1BQU0sRUFBRSxtQ0FBbUM7Z0JBQzNDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxJQUFJLEVBQUU7b0JBQ0osOEJBQThCLEVBQUUsTUFBTTtpQkFDdkM7O2FBQ0Y7OztZQXBCeUIsWUFBWTtZQURLLFFBQVE7NENBeUM5QyxNQUFNLFNBQUMsZUFBZTs7OzBCQWJ4QixTQUFTLFNBQUMsYUFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgSW5qZWN0LCBJbmplY3RvciwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTUFUX0RJQUxPR19EQVRBLCBNYXREaWFsb2dSZWYgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbCc7XG5cbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT1NlYXJjaElucHV0Q29tcG9uZW50IH0gZnJvbSAnLi4vLi4vaW5wdXQvc2VhcmNoLWlucHV0L28tc2VhcmNoLWlucHV0LmNvbXBvbmVudCc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX0xJU1RfUElDS0VSX0RJQUxPRyA9IFtcbiAgJ2RhdGEnLFxuICAndmlzaWJsZUNvbHVtbnM6IHZpc2libGUtY29sdW1ucycsXG4gICdmaWx0ZXInXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWxpc3QtcGlja2VyLWRpYWxvZycsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWxpc3QtcGlja2VyLWRpYWxvZy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL28tbGlzdC1waWNrZXItZGlhbG9nLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19MSVNUX1BJQ0tFUl9ESUFMT0csXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tbGlzdC1waWNrZXItZGlhbG9nXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgcHVibGljIGZpbHRlcjogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyB2aXNpYmxlRGF0YTogYW55ID0gW107XG4gIHB1YmxpYyBzZWFyY2hWYWw6IHN0cmluZztcblxuICBAVmlld0NoaWxkKCdzZWFyY2hJbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KVxuICBwdWJsaWMgc2VhcmNoSW5wdXQ6IE9TZWFyY2hJbnB1dENvbXBvbmVudDtcblxuICBwcm90ZWN0ZWQgZGF0YTogYW55W10gPSBbXTtcbiAgcHVibGljIG1lbnVDb2x1bW5zOiBzdHJpbmc7XG4gIHByb3RlY3RlZCB2aXNpYmxlQ29sc0FycmF5OiBzdHJpbmdbXTtcbiAgcHJvdGVjdGVkIF9zdGFydEluZGV4OiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgcmVjb3Jkc051bWJlcjogbnVtYmVyID0gMTAwO1xuICBwcm90ZWN0ZWQgc2Nyb2xsVGhyZXNob2xkOiBudW1iZXIgPSAyMDA7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGRpYWxvZ1JlZjogTWF0RGlhbG9nUmVmPE9MaXN0UGlja2VyRGlhbG9nQ29tcG9uZW50PixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBkYXRhOiBhbnlcbiAgKSB7XG4gICAgaWYgKGRhdGEuZGF0YSAmJiBVdGlsLmlzQXJyYXkoZGF0YS5kYXRhKSkge1xuICAgICAgdGhpcy5kYXRhID0gZGF0YS5kYXRhO1xuICAgIH1cbiAgICBpZiAoZGF0YS52aXNpYmxlQ29sdW1ucyAmJiBVdGlsLmlzQXJyYXkoZGF0YS52aXNpYmxlQ29sdW1ucykpIHtcbiAgICAgIHRoaXMudmlzaWJsZUNvbHNBcnJheSA9IGRhdGEudmlzaWJsZUNvbHVtbnM7XG4gICAgfVxuICAgIGlmIChkYXRhLnF1ZXJ5Um93cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlY29yZHNOdW1iZXIgPSBkYXRhLnF1ZXJ5Um93cztcbiAgICB9XG4gICAgaWYgKGRhdGEuZmlsdGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuZmlsdGVyID0gZGF0YS5maWx0ZXI7XG4gICAgfVxuICAgIGlmIChkYXRhLm1lbnVDb2x1bW5zKSB7XG4gICAgICB0aGlzLm1lbnVDb2x1bW5zID0gZGF0YS5tZW51Q29sdW1ucztcbiAgICB9XG4gICAgdGhpcy5zZWFyY2hWYWwgPSBkYXRhLnNlYXJjaFZhbDtcbiAgICB0aGlzLnN0YXJ0SW5kZXggPSAwO1xuICB9XG5cbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5zZWFyY2hWYWwpICYmIHRoaXMuc2VhcmNoSW5wdXQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnNlYXJjaFZhbC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNlYXJjaElucHV0LmdldEZvcm1Db250cm9sKCkuc2V0VmFsdWUodGhpcy5zZWFyY2hWYWwsIHtcbiAgICAgICAgZW1pdEV2ZW50OiBmYWxzZVxuICAgICAgfSk7XG4gICAgICAvL1RPRE8gaW1wcm92ZTogQWRkZWQgc2V0VGltZW91dCBmb3IgcmVzb2x2aW5nIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXJyb3IgZXJyb3IgYmVjYXVzZSB0aGUgb2JzZXJ2YWJsZXMgZG9udCB3b3JrXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VhcmNoSW5wdXQub25TZWFyY2guZW1pdCh0aGlzLnNlYXJjaFZhbCkpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdGFydEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXJ0SW5kZXg7XG4gIH1cblxuICBzZXQgc3RhcnRJbmRleCh2YWw6IG51bWJlcikge1xuICAgIHRoaXMuX3N0YXJ0SW5kZXggPSB2YWw7XG4gICAgdGhpcy52aXNpYmxlRGF0YSA9IHRoaXMuZGF0YS5zbGljZSh0aGlzLnN0YXJ0SW5kZXgsIHRoaXMucmVjb3Jkc051bWJlcik7XG4gIH1cblxuICBwdWJsaWMgb25DbGlja0xpc3RJdGVtKGU6IGFueSwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZGlhbG9nUmVmLmNsb3NlKHZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyB0cmFja0J5Rm4oaW5kZXg6IG51bWJlciwgaXRlbTogYW55KTogbnVtYmVyIHtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBwdWJsaWMgb25TY3JvbGwoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmIChldmVudCAmJiBldmVudC50YXJnZXQgJiYgdGhpcy52aXNpYmxlRGF0YS5sZW5ndGggPCB0aGlzLmRhdGEubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwZW5kaW5nU2Nyb2xsID0gZXZlbnQudGFyZ2V0LnNjcm9sbEhlaWdodCAtIChldmVudC50YXJnZXQuc2Nyb2xsVG9wICsgZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodCk7XG4gICAgICBpZiAoIWlzTmFOKHBlbmRpbmdTY3JvbGwpICYmIHBlbmRpbmdTY3JvbGwgPD0gdGhpcy5zY3JvbGxUaHJlc2hvbGQpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy52aXNpYmxlRGF0YS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHNlYXJjaFZhbCA9IHRoaXMuc2VhcmNoSW5wdXQuZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYgKFV0aWwuaXNEZWZpbmVkKHNlYXJjaFZhbCkgJiYgc2VhcmNoVmFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpbmRleCA9IHRoaXMudmlzaWJsZURhdGFbdGhpcy52aXNpYmxlRGF0YS5sZW5ndGggLSAxXVsnX3BhcnNlZEluZGV4J107XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFwcGVuZERhdGEgPSB0aGlzLmRhdGEuc2xpY2UoaW5kZXgsIHRoaXMudmlzaWJsZURhdGEubGVuZ3RoICsgdGhpcy5yZWNvcmRzTnVtYmVyKTtcbiAgICAgICAgaWYgKGFwcGVuZERhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgYXBwZW5kRGF0YSA9IHRoaXMudHJhbnNmb3JtKGFwcGVuZERhdGEsIHtcbiAgICAgICAgICAgIGZpbHRlcnZhbHVlOiB0aGlzLnNlYXJjaElucHV0LmdldFZhbHVlKCksXG4gICAgICAgICAgICBmaWx0ZXJjb2x1bW5zOiB0aGlzLnZpc2libGVDb2xzQXJyYXlcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoYXBwZW5kRGF0YS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZURhdGEgPSB0aGlzLnZpc2libGVEYXRhLmNvbmNhdChhcHBlbmREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25GaWx0ZXJMaXN0KHNlYXJjaFZhbDogYW55KTogdm9pZCB7XG4gICAgbGV0IHRyYW5zZm9ybURhdGEgPSB0aGlzLnRyYW5zZm9ybSh0aGlzLmRhdGEsIHtcbiAgICAgIGZpbHRlcnZhbHVlOiBzZWFyY2hWYWwsXG4gICAgICBmaWx0ZXJjb2x1bW5zOiB0aGlzLnZpc2libGVDb2xzQXJyYXlcbiAgICB9KTtcbiAgICB0aGlzLl9zdGFydEluZGV4ID0gMDtcbiAgICB0aGlzLnZpc2libGVEYXRhID0gdHJhbnNmb3JtRGF0YS5zbGljZSh0aGlzLnN0YXJ0SW5kZXgsIHRoaXMucmVjb3Jkc051bWJlcik7XG4gIH1cblxuICBwdWJsaWMgaXNFbXB0eURhdGEoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFV0aWwuaXNEZWZpbmVkKHRoaXMudmlzaWJsZURhdGEpID8gdGhpcy52aXNpYmxlRGF0YS5sZW5ndGggPT09IDAgOiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0odmFsdWU6IGFueVtdLCBhcmdzOiBhbnkpOiBhbnkge1xuICAgIGlmICghYXJncyB8fCBhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyVmFsdWUgPSBhcmdzWydmaWx0ZXJ2YWx1ZSddID8gYXJnc1snZmlsdGVydmFsdWUnXSA6ICcnO1xuICAgIGNvbnN0IGZpbHRlckNvbHVtbnMgPSBhcmdzWydmaWx0ZXJjb2x1bW5zJ107XG5cbiAgICBpZiAoIWZpbHRlckNvbHVtbnMgfHwgIWZpbHRlclZhbHVlIHx8IGZpbHRlclZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlLmZpbHRlcihpdGVtID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsdGVyQ29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjb2xOYW1lID0gZmlsdGVyQ29sdW1uc1tpXTtcbiAgICAgICAgaWYgKHRoaXMuX2lzQmxhbmsoY29sTmFtZSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3JpZ1ZhbHVlID0gaXRlbVtjb2xOYW1lXTtcbiAgICAgICAgaWYgKG9yaWdWYWx1ZSkge1xuICAgICAgICAgIG9yaWdWYWx1ZSA9IG9yaWdWYWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgIGlmICh0aGlzLl9pc0JsYW5rKG9yaWdWYWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChvcmlnVmFsdWUudG9VcHBlckNhc2UoKS5pbmRleE9mKGZpbHRlclZhbHVlLnRvVXBwZXJDYXNlKCkpID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNCbGFuayh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFVdGlsLmlzRGVmaW5lZCh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoID09PSAwO1xuICB9XG5cbn1cbiJdfQ==