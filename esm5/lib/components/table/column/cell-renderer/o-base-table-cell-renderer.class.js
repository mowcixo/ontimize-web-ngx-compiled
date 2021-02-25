import { Util } from '../../../../util/util';
import { OTableColumnComponent } from '../o-table-column.component';
export var DEFAULT_INPUTS_O_BASE_TABLE_CELL_RENDERER = [
    'filterSource: filter-source',
    'filterFunction: filter-function'
];
var OBaseTableCellRenderer = (function () {
    function OBaseTableCellRenderer(injector) {
        this.injector = injector;
        this._filterSource = 'render';
        this.tableColumn = this.injector.get(OTableColumnComponent);
    }
    OBaseTableCellRenderer.prototype.ngOnInit = function () {
        this.initialize();
    };
    OBaseTableCellRenderer.prototype.initialize = function () {
    };
    OBaseTableCellRenderer.prototype.ngAfterContentInit = function () {
        if (typeof this.filterFunction !== 'function') {
            this.filterFunction = undefined;
        }
        this.registerRenderer();
    };
    Object.defineProperty(OBaseTableCellRenderer.prototype, "table", {
        get: function () {
            return this.tableColumn.table;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTableCellRenderer.prototype, "column", {
        get: function () {
            return this.tableColumn.attr;
        },
        enumerable: true,
        configurable: true
    });
    OBaseTableCellRenderer.prototype.registerRenderer = function () {
        this.tableColumn.registerRenderer(this);
        if (!Util.isDefined(this.type) && Util.isDefined(this.tableColumn.type)) {
            this.type = this.tableColumn.type;
        }
    };
    OBaseTableCellRenderer.prototype.getCellData = function (cellvalue, rowvalue) {
        var parsedValue;
        if (this.componentPipe && this.pipeArguments !== undefined && cellvalue !== undefined) {
            parsedValue = this.componentPipe.transform(cellvalue, this.pipeArguments);
        }
        else {
            parsedValue = cellvalue;
        }
        return parsedValue;
    };
    OBaseTableCellRenderer.prototype.getTooltip = function (cellValue, rowValue) {
        return this.getCellData(cellValue, rowValue);
    };
    Object.defineProperty(OBaseTableCellRenderer.prototype, "filterSource", {
        get: function () {
            return this._filterSource;
        },
        set: function (val) {
            var lowerVal = (val || '').toLowerCase();
            this._filterSource = (lowerVal === 'render' || lowerVal === 'data' || lowerVal === 'both') ? lowerVal : 'render';
        },
        enumerable: true,
        configurable: true
    });
    OBaseTableCellRenderer.prototype.getFilter = function (cellValue, rowValue) {
        var result;
        switch (this.filterSource) {
            case 'render':
                result = [this.getCellData(cellValue, rowValue)];
                break;
            case 'data':
                result = [cellValue];
                break;
            case 'both':
                result = [cellValue, this.getCellData(cellValue, rowValue)];
                break;
        }
        return result;
    };
    return OBaseTableCellRenderer;
}());
export { OBaseTableCellRenderer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL2NlbGwtcmVuZGVyZXIvby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTdDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXBFLE1BQU0sQ0FBQyxJQUFNLHlDQUF5QyxHQUFHO0lBQ3ZELDZCQUE2QjtJQUM3QixpQ0FBaUM7Q0FDbEMsQ0FBQztBQUVGO0lBV0UsZ0NBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFQakMsa0JBQWEsR0FBK0IsUUFBUSxDQUFDO1FBUTFELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRU0seUNBQVEsR0FBZjtRQUNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRU0sMkNBQVUsR0FBakI7SUFFQSxDQUFDO0lBRU0sbURBQWtCLEdBQXpCO1FBQ0UsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssVUFBVSxFQUFFO1lBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELHNCQUFJLHlDQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQ2hDLENBQUM7OztPQUFBO0lBRUQsc0JBQUksMENBQU07YUFBVjtZQUNFLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDL0IsQ0FBQzs7O09BQUE7SUFFTSxpREFBZ0IsR0FBdkI7UUFDRSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztTQUNuQztJQUNILENBQUM7SUFPTSw0Q0FBVyxHQUFsQixVQUFtQixTQUFjLEVBQUUsUUFBYztRQUMvQyxJQUFJLFdBQW1CLENBQUM7UUFDeEIsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDckYsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDM0U7YUFBTTtZQUNMLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDekI7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU0sMkNBQVUsR0FBakIsVUFBa0IsU0FBYyxFQUFFLFFBQWE7UUFDN0MsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsc0JBQUksZ0RBQVk7YUFLaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQzthQVBELFVBQWlCLEdBQVc7WUFDMUIsSUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxLQUFLLE1BQU0sSUFBSSxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQ25ILENBQUM7OztPQUFBO0lBTUQsMENBQVMsR0FBVCxVQUFVLFNBQWMsRUFBRSxRQUFjO1FBQ3RDLElBQUksTUFBTSxDQUFDO1FBQ1gsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNO1lBQ1IsS0FBSyxNQUFNO2dCQUNULE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQixNQUFNO1lBQ1IsS0FBSyxNQUFNO2dCQUNULE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNO1NBQ1Q7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUgsNkJBQUM7QUFBRCxDQUFDLEFBekZELElBeUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgSW5qZWN0b3IsIFBpcGVUcmFuc2Zvcm0sIFRlbXBsYXRlUmVmLCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgT1RhYmxlQ29sdW1uIH0gZnJvbSAnLi4vLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWNvbHVtbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9vLXRhYmxlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW5Db21wb25lbnQgfSBmcm9tICcuLi9vLXRhYmxlLWNvbHVtbi5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19CQVNFX1RBQkxFX0NFTExfUkVOREVSRVIgPSBbXG4gICdmaWx0ZXJTb3VyY2U6IGZpbHRlci1zb3VyY2UnLFxuICAnZmlsdGVyRnVuY3Rpb246IGZpbHRlci1mdW5jdGlvbidcbl07XG5cbmV4cG9ydCBjbGFzcyBPQmFzZVRhYmxlQ2VsbFJlbmRlcmVyIGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0IHtcblxuICBwdWJsaWMgdGVtcGxhdGVyZWY6IFRlbXBsYXRlUmVmPGFueT47XG4gIHB1YmxpYyB0YWJsZUNvbHVtbjogT1RhYmxlQ29sdW1uO1xuICBwdWJsaWMgX2ZpbHRlclNvdXJjZTogJ3JlbmRlcicgfCAnZGF0YScgfCAnYm90aCcgPSAncmVuZGVyJztcbiAgcHVibGljIGZpbHRlckZ1bmN0aW9uOiAoY2VsbFZhbHVlOiBhbnksIHJvd1ZhbHVlOiBhbnksIHF1aWNrRmlsdGVyPzogc3RyaW5nKSA9PiBib29sZWFuO1xuXG4gIHByb3RlY3RlZCB0eXBlOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBwaXBlQXJndW1lbnRzOiBhbnk7XG4gIHByb3RlY3RlZCBjb21wb25lbnRQaXBlOiBQaXBlVHJhbnNmb3JtO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLnRhYmxlQ29sdW1uID0gdGhpcy5pbmplY3Rvci5nZXQoT1RhYmxlQ29sdW1uQ29tcG9uZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKCk6IHZvaWQge1xuXG4gIH1cblxuICBwdWJsaWMgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdGhpcy5maWx0ZXJGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5maWx0ZXJGdW5jdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RlclJlbmRlcmVyKCk7XG4gIH1cblxuICBnZXQgdGFibGUoKTogT1RhYmxlQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy50YWJsZUNvbHVtbi50YWJsZTtcbiAgfVxuXG4gIGdldCBjb2x1bW4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZUNvbHVtbi5hdHRyO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyUmVuZGVyZXIoKTogdm9pZCB7XG4gICAgdGhpcy50YWJsZUNvbHVtbi5yZWdpc3RlclJlbmRlcmVyKHRoaXMpO1xuICAgIGlmICghVXRpbC5pc0RlZmluZWQodGhpcy50eXBlKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnRhYmxlQ29sdW1uLnR5cGUpKSB7XG4gICAgICB0aGlzLnR5cGUgPSB0aGlzLnRhYmxlQ29sdW1uLnR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGRpc3BsYXllZCB0YWJsZSBjZWxsIHZhbHVlXG4gICAqIEBwYXJhbSBjZWxsdmFsdWUgdGhlIGludGVybmFsIHRhYmxlIGNlbGwgdmFsdWVcbiAgICogQHBhcmFtIHJvd3ZhbHVlIHRoZSB0YWJsZSByb3cgdmFsdWVcbiAgICovXG4gIHB1YmxpYyBnZXRDZWxsRGF0YShjZWxsdmFsdWU6IGFueSwgcm93dmFsdWU/OiBhbnkpOiBzdHJpbmcge1xuICAgIGxldCBwYXJzZWRWYWx1ZTogc3RyaW5nO1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFBpcGUgJiYgdGhpcy5waXBlQXJndW1lbnRzICE9PSB1bmRlZmluZWQgJiYgY2VsbHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHBhcnNlZFZhbHVlID0gdGhpcy5jb21wb25lbnRQaXBlLnRyYW5zZm9ybShjZWxsdmFsdWUsIHRoaXMucGlwZUFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlZFZhbHVlID0gY2VsbHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkVmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0VG9vbHRpcChjZWxsVmFsdWU6IGFueSwgcm93VmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q2VsbERhdGEoY2VsbFZhbHVlLCByb3dWYWx1ZSk7XG4gIH1cblxuICBzZXQgZmlsdGVyU291cmNlKHZhbDogc3RyaW5nKSB7XG4gICAgY29uc3QgbG93ZXJWYWwgPSAodmFsIHx8ICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHRoaXMuX2ZpbHRlclNvdXJjZSA9IChsb3dlclZhbCA9PT0gJ3JlbmRlcicgfHwgbG93ZXJWYWwgPT09ICdkYXRhJyB8fCBsb3dlclZhbCA9PT0gJ2JvdGgnKSA/IGxvd2VyVmFsIDogJ3JlbmRlcic7XG4gIH1cblxuICBnZXQgZmlsdGVyU291cmNlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbHRlclNvdXJjZTtcbiAgfVxuXG4gIGdldEZpbHRlcihjZWxsVmFsdWU6IGFueSwgcm93VmFsdWU/OiBhbnkpOiBhbnlbXSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBzd2l0Y2ggKHRoaXMuZmlsdGVyU291cmNlKSB7XG4gICAgICBjYXNlICdyZW5kZXInOlxuICAgICAgICByZXN1bHQgPSBbdGhpcy5nZXRDZWxsRGF0YShjZWxsVmFsdWUsIHJvd1ZhbHVlKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGF0YSc6XG4gICAgICAgIHJlc3VsdCA9IFtjZWxsVmFsdWVdO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdGgnOlxuICAgICAgICByZXN1bHQgPSBbY2VsbFZhbHVlLCB0aGlzLmdldENlbGxEYXRhKGNlbGxWYWx1ZSwgcm93VmFsdWUpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxufVxuIl19