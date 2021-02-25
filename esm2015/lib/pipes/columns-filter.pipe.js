import { Pipe } from '@angular/core';
export class ColumnsFilterPipe {
    transform(value, args) {
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
        const that = this;
        return value.filter((item) => {
            for (let i = 0; i < that.filterColumns.length; i++) {
                const colName = that.filterColumns[i];
                if (this._isBlank(colName)) {
                    continue;
                }
                let origValue = item[colName];
                if (origValue) {
                    origValue = origValue.toString();
                    if (this._isBlank(origValue)) {
                        continue;
                    }
                    if (origValue.toUpperCase().indexOf(that.filterValue.toUpperCase()) > -1) {
                        return item;
                    }
                }
            }
        });
    }
    _isBlank(value) {
        if (value === undefined || value === null
            || value.length === 0) {
            return true;
        }
        return false;
    }
}
ColumnsFilterPipe.decorators = [
    { type: Pipe, args: [{
                name: 'columnsfilter'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1ucy1maWx0ZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvcGlwZXMvY29sdW1ucy1maWx0ZXIucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQztBQU1wRCxNQUFNLE9BQU8saUJBQWlCO0lBSzVCLFNBQVMsQ0FBQyxLQUFpQixFQUFFLElBQVM7UUFDcEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2xFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0UsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzFCLFNBQVM7aUJBQ1Y7Z0JBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QixJQUFJLFNBQVMsRUFBRTtvQkFDYixTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNqQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQzVCLFNBQVM7cUJBQ1Y7b0JBRUQsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDeEUsT0FBTyxJQUFJLENBQUM7cUJBQ2I7aUJBQ0Y7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFhO1FBQ3BCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSTtlQUNwQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7WUFyREYsSUFBSSxTQUFDO2dCQUNKLElBQUksRUFBRSxlQUFlO2FBQ3RCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdjb2x1bW5zZmlsdGVyJ1xufSlcblxuZXhwb3J0IGNsYXNzIENvbHVtbnNGaWx0ZXJQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgZmlsdGVyVmFsdWU6IHN0cmluZztcbiAgZmlsdGVyQ29sdW1uczogQXJyYXk8c3RyaW5nPjtcblxuICB0cmFuc2Zvcm0odmFsdWU6IEFycmF5PGFueT4sIGFyZ3M6IGFueSk6IGFueSB7XG4gICAgaWYgKCFhcmdzIHx8IGFyZ3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlclZhbHVlID0gYXJnc1snZmlsdGVydmFsdWUnXSA/IGFyZ3NbJ2ZpbHRlcnZhbHVlJ10gOiAnJztcbiAgICB0aGlzLmZpbHRlckNvbHVtbnMgPSBhcmdzWydmaWx0ZXJjb2x1bW5zJ107XG5cbiAgICBpZiAoIXRoaXMuZmlsdGVyQ29sdW1ucyB8fCAhdGhpcy5maWx0ZXJWYWx1ZSB8fCB0aGlzLmZpbHRlclZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIHZhbHVlLmZpbHRlcigoaXRlbSkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGF0LmZpbHRlckNvbHVtbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29sTmFtZSA9IHRoYXQuZmlsdGVyQ29sdW1uc1tpXTtcbiAgICAgICAgaWYgKHRoaXMuX2lzQmxhbmsoY29sTmFtZSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb3JpZ1ZhbHVlID0gaXRlbVtjb2xOYW1lXTtcbiAgICAgICAgaWYgKG9yaWdWYWx1ZSkge1xuICAgICAgICAgIG9yaWdWYWx1ZSA9IG9yaWdWYWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgIGlmICh0aGlzLl9pc0JsYW5rKG9yaWdWYWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChvcmlnVmFsdWUudG9VcHBlckNhc2UoKS5pbmRleE9mKHRoYXQuZmlsdGVyVmFsdWUudG9VcHBlckNhc2UoKSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfaXNCbGFuayh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGxcbiAgICAgIHx8IHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG59XG4iXX0=