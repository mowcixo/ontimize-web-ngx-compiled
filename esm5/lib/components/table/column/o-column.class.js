import { BehaviorSubject } from 'rxjs';
import { Codes, Util } from '../../../util';
var OColumn = (function () {
    function OColumn() {
        this._editing = false;
        this.multilineSubject = new BehaviorSubject(this.multiline);
        this.isMultiline = this.multilineSubject.asObservable();
    }
    Object.defineProperty(OColumn.prototype, "editing", {
        get: function () {
            return this._editing;
        },
        set: function (val) {
            if (this.type === 'boolean' && this.editor && this.editor.autoCommit) {
                this._editing = false;
            }
            this._editing = this.editor != null && val;
        },
        enumerable: true,
        configurable: true
    });
    OColumn.prototype.setDefaultProperties = function (args) {
        this.type = 'string';
        this.className = 'o-column-' + (this.type) + ' ';
        this.orderable = args.orderable;
        this.resizable = args.resizable;
        this.searchable = true;
        this.searching = true;
        this.name = this.attr;
        this.title = this.attr;
        this.multiline = false;
    };
    OColumn.prototype.setColumnProperties = function (column) {
        this.title = Util.isDefined(column.title) ? column.title : column.attr;
        this.definition = column;
        this.multiline = column.multiline;
        if (Util.isDefined(column.minWidth)) {
            this.minWidth = column.minWidth;
        }
        if (Util.isDefined(column.maxWidth)) {
            this.maxWidth = column.maxWidth;
        }
        if (Util.isDefined(column.orderable)) {
            this.orderable = column.orderable;
        }
        if (Util.isDefined(column.resizable)) {
            this.resizable = column.resizable;
        }
        if (Util.isDefined(column.searchable)) {
            this.searchable = column.searchable;
        }
        if (Util.isDefined(column.renderer)) {
            this.renderer = column.renderer;
        }
        if (Util.isDefined(column.editor)) {
            this.editor = column.editor;
        }
        if (Util.isDefined(column.type)) {
            this.type = column.type;
            this.className = 'o-column-' + (this.type) + ' ';
        }
        if (Util.isDefined(column.getSQLType)) {
            this.sqlType = column.getSQLType();
        }
        if (Util.isDefined(column.class)) {
            this.className = Util.isDefined(this.className) ? (this.className + ' ' + column.class) : column.class;
        }
        if (Util.isDefined(column.operation) || Util.isDefined(column.functionOperation)) {
            this.calculate = column.operation ? column.operation : column.functionOperation;
        }
        if (Util.isDefined(column.tooltip) && column.tooltip) {
            this.tooltip = {
                value: column.tooltipValue,
                function: column.tooltipFunction
            };
        }
        if (Util.isDefined(column.filterExpressionFunction)) {
            this.filterExpressionFunction = column.filterExpressionFunction;
        }
    };
    Object.defineProperty(OColumn.prototype, "searchable", {
        get: function () {
            return this._searchable;
        },
        set: function (val) {
            this._searchable = val;
            this.searching = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OColumn.prototype, "multiline", {
        get: function () {
            return this._multiline;
        },
        set: function (val) {
            val = Util.parseBoolean(String(val));
            this._multiline = val;
            this.multilineSubject.next(this._multiline);
        },
        enumerable: true,
        configurable: true
    });
    OColumn.prototype.hasTooltip = function () {
        return Util.isDefined(this.tooltip);
    };
    OColumn.prototype.getTooltip = function (rowData) {
        if (!this.hasTooltip()) {
            return undefined;
        }
        var tooltip;
        if (Util.isDefined(this.tooltip.value)) {
            tooltip = this.tooltip.value;
        }
        else if (Util.isDefined(this.tooltip.function)) {
            try {
                tooltip = this.tooltip.function(rowData);
            }
            catch (e) {
                console.warn('o-table-column tooltip-function didnt worked');
            }
        }
        else {
            tooltip = Util.isDefined(this.renderer) ? this.renderer.getTooltip(rowData[this.name], rowData) : rowData[this.name];
        }
        return tooltip;
    };
    OColumn.prototype.getMinWidth = function () {
        if (Util.isDefined(this.width)) {
            return this.width;
        }
        return this.minWidth;
    };
    OColumn.prototype.getMinWidthValue = function () {
        return Util.extractPixelsValue(this.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH);
    };
    OColumn.prototype.getMaxWidthValue = function () {
        var value = Util.extractPixelsValue(this.maxWidth);
        return value ? value : undefined;
    };
    OColumn.prototype.getRenderWidth = function (horizontalScrolled, clientWidth) {
        if (Util.isDefined(this.width)) {
            return this.width;
        }
        var minValue = Util.extractPixelsValue(this.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH);
        if (Util.isDefined(minValue) && clientWidth > 0 && clientWidth < minValue) {
            this.DOMWidth = minValue;
        }
        if (Util.isDefined(this.maxWidth)) {
            var maxValue = Util.extractPixelsValue(this.maxWidth);
            if (Util.isDefined(maxValue) && clientWidth > maxValue) {
                this.DOMWidth = maxValue;
            }
        }
        var defaultWidth = (horizontalScrolled) ? undefined : 'auto';
        return Util.isDefined(this.DOMWidth) ? (this.DOMWidth + 'px') : defaultWidth;
    };
    Object.defineProperty(OColumn.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (val) {
            var widthVal = val;
            var pxVal = Util.extractPixelsValue(val);
            if (Util.isDefined(pxVal)) {
                this.DOMWidth = pxVal;
                widthVal = undefined;
            }
            this._width = widthVal;
        },
        enumerable: true,
        configurable: true
    });
    OColumn.prototype.getWidthToStore = function () {
        return this._width || this.DOMWidth;
    };
    OColumn.prototype.setWidth = function (val) {
        this.width = val + 'px';
        this.DOMWidth = val;
    };
    OColumn.prototype.getTitleAlignClass = function () {
        if (Util.isDefined(this.definition)) {
            return this.definition.titleAlign || Codes.COLUMN_TITLE_ALIGN_CENTER;
        }
        return Codes.COLUMN_TITLE_ALIGN_CENTER;
    };
    OColumn.prototype.getFilterValue = function (cellValue, rowValue) {
        if (this.renderer) {
            return this.renderer.getFilter(cellValue, rowValue);
        }
        else {
            return [cellValue];
        }
    };
    OColumn.prototype.useCustomFilterFunction = function () {
        return this.searching && this.visible && this.renderer != null && this.renderer.filterFunction != null;
    };
    OColumn.prototype.useQuickfilterFunction = function () {
        return this.searching && this.visible && !(this.renderer != null && this.renderer.filterFunction != null);
    };
    return OColumn;
}());
export { OColumn };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb2x1bW4uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvY29sdW1uL28tY29sdW1uLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7QUFRbkQsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHNUM7SUFBQTtRQWFZLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFZNUIscUJBQWdCLEdBQTZCLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRixnQkFBVyxHQUF3QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLENBQUM7SUE0TWpGLENBQUM7SUF6TUMsc0JBQUksNEJBQU87YUFBWDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN2QixDQUFDO2FBRUQsVUFBWSxHQUFZO1lBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtnQkFDcEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7YUFDdkI7WUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztRQUM3QyxDQUFDOzs7T0FQQTtJQVNELHNDQUFvQixHQUFwQixVQUFxQixJQUFTO1FBQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNqRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFD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Qyx5QkFBeUIsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZ0NBQWMsR0FBZCxVQUFlLFNBQWMsRUFBRSxRQUFjO1FBQzNDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNyRDthQUFNO1lBQ0wsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELHlDQUF1QixHQUF2QjtRQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQztJQUN6RyxDQUFDO0lBRUQsd0NBQXNCLEdBQXRCO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQzVHLENBQUM7SUFFSCxjQUFDO0FBQUQsQ0FBQyxBQXRPRCxJQXNPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPVGFibGVDb2x1bW5DYWxjdWxhdGVkIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLWNvbHVtbi1jYWxjdWxhdGVkLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPVGFibGVDb2x1bW4gfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtY29sdW1uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBFeHByZXNzaW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZXhwcmVzc2lvbi50eXBlJztcbmltcG9ydCB7IE9Db2x1bW5BZ2dyZWdhdGUgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9vLWNvbHVtbi1hZ2dyZWdhdGUudHlwZSc7XG5pbXBvcnQgeyBPQ29sdW1uVG9vbHRpcCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzL28tY29sdW1uLXRvb2x0aXAudHlwZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvb3BlcmF0aW9uLWZ1bmN0aW9uLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMsIFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsJztcbmltcG9ydCB7IE9CYXNlVGFibGVDZWxsUmVuZGVyZXIgfSBmcm9tICcuL2NlbGwtcmVuZGVyZXIvby1iYXNlLXRhYmxlLWNlbGwtcmVuZGVyZXIuY2xhc3MnO1xuXG5leHBvcnQgY2xhc3MgT0NvbHVtbiB7XG4gIGF0dHI6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG4gIHNxbFR5cGU6IG51bWJlcjtcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIG9yZGVyYWJsZTogYm9vbGVhbjtcbiAgX3NlYXJjaGFibGU6IGJvb2xlYW47XG4gIHNlYXJjaGluZzogYm9vbGVhbjsgLy8gdGhpcyBjb2x1bW4gaXMgdXNlZCB0byBmaWx0ZXIgaW4gcXVpY2tmaWx0ZXJcbiAgdmlzaWJsZTogYm9vbGVhbjtcbiAgcmVuZGVyZXI6IE9CYXNlVGFibGVDZWxsUmVuZGVyZXI7XG4gIGVkaXRvcjogYW55O1xuICBwcm90ZWN0ZWQgX2VkaXRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgX3dpZHRoOiBzdHJpbmc7XG4gIG1pbldpZHRoOiBzdHJpbmc7XG4gIG1heFdpZHRoOiBzdHJpbmc7XG4gIGFnZ3JlZ2F0ZTogT0NvbHVtbkFnZ3JlZ2F0ZTtcbiAgY2FsY3VsYXRlOiBzdHJpbmcgfCBPcGVyYXRvckZ1bmN0aW9uO1xuICBkZWZpbml0aW9uOiBPVGFibGVDb2x1bW47XG4gIHRvb2x0aXA6IE9Db2x1bW5Ub29sdGlwO1xuICByZXNpemFibGU6IGJvb2xlYW47XG4gIERPTVdpZHRoOiBudW1iZXI7XG4gIGZpbHRlckV4cHJlc3Npb25GdW5jdGlvbjogKGNvbHVtbkF0dHI6IHN0cmluZywgcXVpY2tGaWx0ZXI/OiBzdHJpbmcpID0+IEV4cHJlc3Npb247XG5cbiAgcHJpdmF0ZSBtdWx0aWxpbmVTdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHRoaXMubXVsdGlsaW5lKTtcbiAgcHVibGljIGlzTXVsdGlsaW5lOiBPYnNlcnZhYmxlPGJvb2xlYW4+ID0gdGhpcy5tdWx0aWxpbmVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBwcml2YXRlIF9tdWx0aWxpbmU6IGJvb2xlYW47XG5cbiAgZ2V0IGVkaXRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRpbmc7XG4gIH1cblxuICBzZXQgZWRpdGluZyh2YWw6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy50eXBlID09PSAnYm9vbGVhbicgJiYgdGhpcy5lZGl0b3IgJiYgdGhpcy5lZGl0b3IuYXV0b0NvbW1pdCkge1xuICAgICAgdGhpcy5fZWRpdGluZyA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLl9lZGl0aW5nID0gdGhpcy5lZGl0b3IgIT0gbnVsbCAmJiB2YWw7XG4gIH1cblxuICBzZXREZWZhdWx0UHJvcGVydGllcyhhcmdzOiBhbnkpIHtcbiAgICB0aGlzLnR5cGUgPSAnc3RyaW5nJztcbiAgICB0aGlzLmNsYXNzTmFtZSA9ICdvLWNvbHVtbi0nICsgKHRoaXMudHlwZSkgKyAnICc7XG4gICAgdGhpcy5vcmRlcmFibGUgPSBhcmdzLm9yZGVyYWJsZTtcbiAgICB0aGlzLnJlc2l6YWJsZSA9IGFyZ3MucmVzaXphYmxlO1xuICAgIHRoaXMuc2VhcmNoYWJsZSA9IHRydWU7XG4gICAgdGhpcy5zZWFyY2hpbmcgPSB0cnVlO1xuICAgIC8vIGNvbHVtbiB3aXRob3V0ICdhdHRyJyBzaG91bGQgY29udGFpbiBvbmx5IHJlbmRlcmVycyB0aGF0IGRvIG5vdCBkZXBlbmQgb24gY2VsbCBkYXRhLCBidXQgcm93IGRhdGEgKGUuZy4gYWN0aW9ucylcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmF0dHI7XG4gICAgdGhpcy50aXRsZSA9IHRoaXMuYXR0cjtcbiAgICB0aGlzLm11bHRpbGluZSA9IGZhbHNlO1xuICB9XG5cbiAgc2V0Q29sdW1uUHJvcGVydGllcyhjb2x1bW46IE9UYWJsZUNvbHVtbiAmIE9UYWJsZUNvbHVtbkNhbGN1bGF0ZWQpIHtcbiAgICB0aGlzLnRpdGxlID0gVXRpbC5pc0RlZmluZWQoY29sdW1uLnRpdGxlKSA/IGNvbHVtbi50aXRsZSA6IGNvbHVtbi5hdHRyO1xuICAgIHRoaXMuZGVmaW5pdGlvbiA9IGNvbHVtbjtcbiAgICB0aGlzLm11bHRpbGluZSA9IGNvbHVtbi5tdWx0aWxpbmU7XG5cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uLm1pbldpZHRoKSkge1xuICAgICAgdGhpcy5taW5XaWR0aCA9IGNvbHVtbi5taW5XaWR0aDtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbi5tYXhXaWR0aCkpIHtcbiAgICAgIHRoaXMubWF4V2lkdGggPSBjb2x1bW4ubWF4V2lkdGg7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW4ub3JkZXJhYmxlKSkge1xuICAgICAgdGhpcy5vcmRlcmFibGUgPSBjb2x1bW4ub3JkZXJhYmxlO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uLnJlc2l6YWJsZSkpIHtcbiAgICAgIHRoaXMucmVzaXphYmxlID0gY29sdW1uLnJlc2l6YWJsZTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbi5zZWFyY2hhYmxlKSkge1xuICAgICAgdGhpcy5zZWFyY2hhYmxlID0gY29sdW1uLnNlYXJjaGFibGU7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW4ucmVuZGVyZXIpKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyID0gY29sdW1uLnJlbmRlcmVyO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uLmVkaXRvcikpIHtcbiAgICAgIHRoaXMuZWRpdG9yID0gY29sdW1uLmVkaXRvcjtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbi50eXBlKSkge1xuICAgICAgdGhpcy50eXBlID0gY29sdW1uLnR5cGU7XG4gICAgICB0aGlzLmNsYXNzTmFtZSA9ICdvLWNvbHVtbi0nICsgKHRoaXMudHlwZSkgKyAnICc7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW4uZ2V0U1FMVHlwZSkpIHtcbiAgICAgIHRoaXMuc3FsVHlwZSA9IGNvbHVtbi5nZXRTUUxUeXBlKCk7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChjb2x1bW4uY2xhc3MpKSB7XG4gICAgICB0aGlzLmNsYXNzTmFtZSA9IFV0aWwuaXNEZWZpbmVkKHRoaXMuY2xhc3NOYW1lKSA/ICh0aGlzLmNsYXNzTmFtZSArICcgJyArIGNvbHVtbi5jbGFzcykgOiBjb2x1bW4uY2xhc3M7XG4gICAgfVxuICAgIC8vIGlmIChjb2x1bW4gaW5zdGFuY2VvZiBPVGFibGVDb2x1bW5DYWxjdWxhdGVkQ29tcG9uZW50KSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbi5vcGVyYXRpb24pIHx8IFV0aWwuaXNEZWZpbmVkKGNvbHVtbi5mdW5jdGlvbk9wZXJhdGlvbikpIHtcbiAgICAgIHRoaXMuY2FsY3VsYXRlID0gY29sdW1uLm9wZXJhdGlvbiA/IGNvbHVtbi5vcGVyYXRpb24gOiBjb2x1bW4uZnVuY3Rpb25PcGVyYXRpb247XG4gICAgfVxuICAgIC8vIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoY29sdW1uLnRvb2x0aXApICYmIGNvbHVtbi50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSB7XG4gICAgICAgIHZhbHVlOiBjb2x1bW4udG9vbHRpcFZhbHVlLFxuICAgICAgICBmdW5jdGlvbjogY29sdW1uLnRvb2x0aXBGdW5jdGlvblxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGNvbHVtbi5maWx0ZXJFeHByZXNzaW9uRnVuY3Rpb24pKSB7XG4gICAgICB0aGlzLmZpbHRlckV4cHJlc3Npb25GdW5jdGlvbiA9IGNvbHVtbi5maWx0ZXJFeHByZXNzaW9uRnVuY3Rpb247XG4gICAgfVxuICB9XG5cbiAgc2V0IHNlYXJjaGFibGUodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2VhcmNoYWJsZSA9IHZhbDtcbiAgICB0aGlzLnNlYXJjaGluZyA9IHZhbDtcbiAgfVxuXG4gIGdldCBzZWFyY2hhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zZWFyY2hhYmxlO1xuICB9XG5cbiAgc2V0IG11bHRpbGluZSh2YWw6IGJvb2xlYW4pIHtcbiAgICB2YWwgPSBVdGlsLnBhcnNlQm9vbGVhbihTdHJpbmcodmFsKSk7XG4gICAgdGhpcy5fbXVsdGlsaW5lID0gdmFsO1xuICAgIHRoaXMubXVsdGlsaW5lU3ViamVjdC5uZXh0KHRoaXMuX211bHRpbGluZSk7XG4gIH1cblxuICBnZXQgbXVsdGlsaW5lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9tdWx0aWxpbmU7XG4gIH1cblxuICBoYXNUb29sdGlwKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLnRvb2x0aXApO1xuICB9XG5cbiAgZ2V0VG9vbHRpcChyb3dEYXRhOiBhbnkpOiBhbnkge1xuICAgIGlmICghdGhpcy5oYXNUb29sdGlwKCkpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGxldCB0b29sdGlwO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnRvb2x0aXAudmFsdWUpKSB7XG4gICAgICB0b29sdGlwID0gdGhpcy50b29sdGlwLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy50b29sdGlwLmZ1bmN0aW9uKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdG9vbHRpcCA9IHRoaXMudG9vbHRpcC5mdW5jdGlvbihyb3dEYXRhKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdvLXRhYmxlLWNvbHVtbiB0b29sdGlwLWZ1bmN0aW9uIGRpZG50IHdvcmtlZCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0b29sdGlwID0gVXRpbC5pc0RlZmluZWQodGhpcy5yZW5kZXJlcikgPyB0aGlzLnJlbmRlcmVyLmdldFRvb2x0aXAocm93RGF0YVt0aGlzLm5hbWVdLCByb3dEYXRhKSA6IHJvd0RhdGFbdGhpcy5uYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIHRvb2x0aXA7XG4gIH1cblxuICBnZXRNaW5XaWR0aCgpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy53aWR0aCkpIHtcbiAgICAgIHJldHVybiB0aGlzLndpZHRoO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5taW5XaWR0aDtcbiAgfVxuXG4gIGdldE1pbldpZHRoVmFsdWUoKSB7XG4gICAgcmV0dXJuIFV0aWwuZXh0cmFjdFBpeGVsc1ZhbHVlKHRoaXMubWluV2lkdGgsIENvZGVzLkRFRkFVTFRfQ09MVU1OX01JTl9XSURUSCk7XG4gIH1cblxuICBnZXRNYXhXaWR0aFZhbHVlKCkge1xuICAgIGNvbnN0IHZhbHVlID0gVXRpbC5leHRyYWN0UGl4ZWxzVmFsdWUodGhpcy5tYXhXaWR0aCk7XG4gICAgcmV0dXJuIHZhbHVlID8gdmFsdWUgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRSZW5kZXJXaWR0aChob3Jpem9udGFsU2Nyb2xsZWQ6IGJvb2xlYW4sIGNsaWVudFdpZHRoOiBudW1iZXIpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy53aWR0aCkpIHtcbiAgICAgIHJldHVybiB0aGlzLndpZHRoO1xuICAgIH1cbiAgICBjb25zdCBtaW5WYWx1ZSA9IFV0aWwuZXh0cmFjdFBpeGVsc1ZhbHVlKHRoaXMubWluV2lkdGgsIENvZGVzLkRFRkFVTFRfQ09MVU1OX01JTl9XSURUSCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKG1pblZhbHVlKSAmJiBjbGllbnRXaWR0aCA+IDAgJiYgY2xpZW50V2lkdGggPCBtaW5WYWx1ZSkge1xuICAgICAgdGhpcy5ET01XaWR0aCA9IG1pblZhbHVlO1xuICAgIH1cblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLm1heFdpZHRoKSkge1xuICAgICAgY29uc3QgbWF4VmFsdWUgPSBVdGlsLmV4dHJhY3RQaXhlbHNWYWx1ZSh0aGlzLm1heFdpZHRoKTtcbiAgICAgIGlmIChVdGlsLmlzRGVmaW5lZChtYXhWYWx1ZSkgJiYgY2xpZW50V2lkdGggPiBtYXhWYWx1ZSkge1xuICAgICAgICB0aGlzLkRPTVdpZHRoID0gbWF4VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGRlZmF1bHRXaWR0aCA9IChob3Jpem9udGFsU2Nyb2xsZWQpID8gdW5kZWZpbmVkIDogJ2F1dG8nO1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLkRPTVdpZHRoKSA/ICh0aGlzLkRPTVdpZHRoICsgJ3B4JykgOiBkZWZhdWx0V2lkdGg7XG4gIH1cblxuICBzZXQgd2lkdGgodmFsOiBzdHJpbmcpIHtcbiAgICBsZXQgd2lkdGhWYWwgPSB2YWw7XG4gICAgY29uc3QgcHhWYWwgPSBVdGlsLmV4dHJhY3RQaXhlbHNWYWx1ZSh2YWwpO1xuICAgIGlmIChVdGlsLmlzRGVmaW5lZChweFZhbCkpIHtcbiAgICAgIHRoaXMuRE9NV2lkdGggPSBweFZhbDtcbiAgICAgIHdpZHRoVmFsID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLl93aWR0aCA9IHdpZHRoVmFsO1xuICB9XG5cbiAgZ2V0IHdpZHRoKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICB9XG5cblxuICBnZXRXaWR0aFRvU3RvcmUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fd2lkdGggfHwgdGhpcy5ET01XaWR0aDtcbiAgfVxuXG4gIHNldFdpZHRoKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy53aWR0aCA9IHZhbCArICdweCc7XG4gICAgdGhpcy5ET01XaWR0aCA9IHZhbDtcbiAgfVxuXG4gIGdldFRpdGxlQWxpZ25DbGFzcygpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5kZWZpbml0aW9uKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbi50aXRsZUFsaWduIHx8IENvZGVzLkNPTFVNTl9USVRMRV9BTElHTl9DRU5URVI7XG4gICAgfVxuICAgIC8vIGRlZmF1bHQgdGl0bGUgYWxpZ25cbiAgICByZXR1cm4gQ29kZXMuQ09MVU1OX1RJVExFX0FMSUdOX0NFTlRFUjtcbiAgfVxuXG4gIGdldEZpbHRlclZhbHVlKGNlbGxWYWx1ZTogYW55LCByb3dWYWx1ZT86IGFueSk6IGFueVtdIHtcbiAgICBpZiAodGhpcy5yZW5kZXJlcikge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyZXIuZ2V0RmlsdGVyKGNlbGxWYWx1ZSwgcm93VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW2NlbGxWYWx1ZV07XG4gICAgfVxuICB9XG5cbiAgdXNlQ3VzdG9tRmlsdGVyRnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoaW5nICYmIHRoaXMudmlzaWJsZSAmJiB0aGlzLnJlbmRlcmVyICE9IG51bGwgJiYgdGhpcy5yZW5kZXJlci5maWx0ZXJGdW5jdGlvbiAhPSBudWxsO1xuICB9XG5cbiAgdXNlUXVpY2tmaWx0ZXJGdW5jdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hpbmcgJiYgdGhpcy52aXNpYmxlICYmICEodGhpcy5yZW5kZXJlciAhPSBudWxsICYmIHRoaXMucmVuZGVyZXIuZmlsdGVyRnVuY3Rpb24gIT0gbnVsbCk7XG4gIH1cblxufVxuIl19