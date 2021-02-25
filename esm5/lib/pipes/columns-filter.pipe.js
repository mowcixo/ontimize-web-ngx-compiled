import { Pipe } from '@angular/core';
var ColumnsFilterPipe = (function () {
    function ColumnsFilterPipe() {
    }
    ColumnsFilterPipe.prototype.transform = function (value, args) {
        var _this = this;
        if (!args || args.length <= 1) {
            return value;
        }
        this.filterValue = args['filtervalue'] ? args['filtervalue'] : '';
        this.filterColumns = args['filtercolumns'];
        if (!this.filterColumns || !this.filterValue || this.filterValue.length === 0) {
            return value;
        }
        if (value === undefined || value === null) {
            return value;
        }
        var that = this;
        return value.filter(function (item) {
            for (var i = 0; i < that.filterColumns.length; i++) {
                var colName = that.filterColumns[i];
                if (_this._isBlank(colName)) {
                    continue;
                }
                var origValue = item[colName];
                if (origValue) {
                    origValue = origValue.toString();
                    if (_this._isBlank(origValue)) {
                        continue;
                    }
                    if (origValue.toUpperCase().indexOf(that.filterValue.toUpperCase()) > -1) {
                        return item;
                    }
                }
            }
        });
    };
    ColumnsFilterPipe.prototype._isBlank = function (value) {
        if (value === undefined || value === null
            || value.length === 0) {
            return true;
        }
        return false;
    };
    ColumnsFilterPipe.decorators = [
        { type: Pipe, args: [{
                    name: 'columnsfilter'
                },] }
    ];
    return ColumnsFilterPipe;
}());
export { ColumnsFilterPipe };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1ucy1maWx0ZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvY29sdW1ucy1maWx0ZXIucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQUVwRDtJQUFBO0lBdURBLENBQUM7SUE5Q0MscUNBQVMsR0FBVCxVQUFVLEtBQWlCLEVBQUUsSUFBUztRQUF0QyxpQkFvQ0M7UUFuQ0MsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0UsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSTtZQUN2QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDMUIsU0FBUztpQkFDVjtnQkFDRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlCLElBQUksU0FBUyxFQUFFO29CQUNiLFNBQVMsR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2pDLElBQUksS0FBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDNUIsU0FBUztxQkFDVjtvQkFFRCxJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO3dCQUN4RSxPQUFPLElBQUksQ0FBQztxQkFDYjtpQkFDRjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsb0NBQVEsR0FBUixVQUFTLEtBQWE7UUFDcEIsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJO2VBQ3BDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7O2dCQXJERixJQUFJLFNBQUM7b0JBQ0osSUFBSSxFQUFFLGVBQWU7aUJBQ3RCOztJQXFERCx3QkFBQztDQUFBLEFBdkRELElBdURDO1NBbkRZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnY29sdW1uc2ZpbHRlcidcbn0pXG5cbmV4cG9ydCBjbGFzcyBDb2x1bW5zRmlsdGVyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gIGZpbHRlclZhbHVlOiBzdHJpbmc7XG4gIGZpbHRlckNvbHVtbnM6IEFycmF5PHN0cmluZz47XG5cbiAgdHJhbnNmb3JtKHZhbHVlOiBBcnJheTxhbnk+LCBhcmdzOiBhbnkpOiBhbnkge1xuICAgIGlmICghYXJncyB8fCBhcmdzLmxlbmd0aCA8PSAxKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5maWx0ZXJWYWx1ZSA9IGFyZ3NbJ2ZpbHRlcnZhbHVlJ10gPyBhcmdzWydmaWx0ZXJ2YWx1ZSddIDogJyc7XG4gICAgdGhpcy5maWx0ZXJDb2x1bW5zID0gYXJnc1snZmlsdGVyY29sdW1ucyddO1xuXG4gICAgaWYgKCF0aGlzLmZpbHRlckNvbHVtbnMgfHwgIXRoaXMuZmlsdGVyVmFsdWUgfHwgdGhpcy5maWx0ZXJWYWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB2YWx1ZS5maWx0ZXIoKGl0ZW0pID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhhdC5maWx0ZXJDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbE5hbWUgPSB0aGF0LmZpbHRlckNvbHVtbnNbaV07XG4gICAgICAgIGlmICh0aGlzLl9pc0JsYW5rKGNvbE5hbWUpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9yaWdWYWx1ZSA9IGl0ZW1bY29sTmFtZV07XG4gICAgICAgIGlmIChvcmlnVmFsdWUpIHtcbiAgICAgICAgICBvcmlnVmFsdWUgPSBvcmlnVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgICBpZiAodGhpcy5faXNCbGFuayhvcmlnVmFsdWUpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAob3JpZ1ZhbHVlLnRvVXBwZXJDYXNlKCkuaW5kZXhPZih0aGF0LmZpbHRlclZhbHVlLnRvVXBwZXJDYXNlKCkpID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2lzQmxhbmsodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsXG4gICAgICB8fCB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufVxuIl19