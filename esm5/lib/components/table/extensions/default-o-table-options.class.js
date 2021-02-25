import { Codes } from '../../../util/codes';
import { OColumn } from '../column/o-column.class';
var DefaultOTableOptions = (function () {
    function DefaultOTableOptions() {
        this.columns = [];
        this.filter = true;
        this.filterCaseSensitive = false;
        this._visibleColumns = [];
        this.selectColumn = new OColumn();
        this.selectColumn.name = Codes.NAME_COLUMN_SELECT;
        this.selectColumn.title = '';
        this.selectColumn.visible = false;
    }
    Object.defineProperty(DefaultOTableOptions.prototype, "visibleColumns", {
        get: function () {
            return this._visibleColumns;
        },
        set: function (arg) {
            var _this = this;
            this._visibleColumns = arg;
            this.columns.forEach(function (oCol) {
                oCol.visible = _this._visibleColumns.indexOf(oCol.attr) !== -1;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultOTableOptions.prototype, "columnsInsertables", {
        get: function () {
            return this._visibleColumns.map(function (col) {
                return col + Codes.SUFFIX_COLUMN_INSERTABLE;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultOTableOptions.prototype, "selectColumn", {
        get: function () {
            return this._selectColumn;
        },
        set: function (val) {
            this._selectColumn = val;
            this.selectColumn.name = Codes.NAME_COLUMN_SELECT;
            this.selectColumn.title = '';
            this.selectColumn.visible = false;
        },
        enumerable: true,
        configurable: true
    });
    return DefaultOTableOptions;
}());
export { DefaultOTableOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1vLXRhYmxlLW9wdGlvbnMuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kZWZhdWx0LW8tdGFibGUtb3B0aW9ucy5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRW5EO0lBU0U7UUFQQSxZQUFPLEdBQW1CLEVBQUUsQ0FBQztRQUM3QixXQUFNLEdBQVksSUFBSSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFZLEtBQUssQ0FBQztRQUUzQixvQkFBZSxHQUFlLEVBQUUsQ0FBQztRQUl6QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVELHNCQUFJLGdEQUFjO2FBQWxCO1lBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzlCLENBQUM7YUFFRCxVQUFtQixHQUFlO1lBQWxDLGlCQUtDO1lBSkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFhO2dCQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7OztPQVBBO0lBU0Qsc0JBQUksb0RBQWtCO2FBQXRCO1lBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQVc7Z0JBQzFDLE9BQU8sR0FBRyxHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7OztPQUFBO0lBRUQsc0JBQUksOENBQVk7YUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQzthQUVELFVBQWlCLEdBQVk7WUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEMsQ0FBQzs7O09BUEE7SUFRSCwyQkFBQztBQUFELENBQUMsQUEzQ0QsSUEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPVGFibGVPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLXRhYmxlLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBPQ29sdW1uIH0gZnJvbSAnLi4vY29sdW1uL28tY29sdW1uLmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIERlZmF1bHRPVGFibGVPcHRpb25zIGltcGxlbWVudHMgT1RhYmxlT3B0aW9ucyB7XG5cbiAgY29sdW1uczogQXJyYXk8T0NvbHVtbj4gPSBbXTtcbiAgZmlsdGVyOiBib29sZWFuID0gdHJ1ZTtcbiAgZmlsdGVyQ2FzZVNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBfdmlzaWJsZUNvbHVtbnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHJvdGVjdGVkIF9zZWxlY3RDb2x1bW46IE9Db2x1bW47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RDb2x1bW4gPSBuZXcgT0NvbHVtbigpO1xuICAgIHRoaXMuc2VsZWN0Q29sdW1uLm5hbWUgPSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1Q7XG4gICAgdGhpcy5zZWxlY3RDb2x1bW4udGl0bGUgPSAnJztcbiAgICB0aGlzLnNlbGVjdENvbHVtbi52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICBnZXQgdmlzaWJsZUNvbHVtbnMoKTogQXJyYXk8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGVDb2x1bW5zO1xuICB9XG5cbiAgc2V0IHZpc2libGVDb2x1bW5zKGFyZzogQXJyYXk8YW55Pikge1xuICAgIHRoaXMuX3Zpc2libGVDb2x1bW5zID0gYXJnO1xuICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICBvQ29sLnZpc2libGUgPSB0aGlzLl92aXNpYmxlQ29sdW1ucy5pbmRleE9mKG9Db2wuYXR0cikgIT09IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGNvbHVtbnNJbnNlcnRhYmxlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUNvbHVtbnMubWFwKChjb2w6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIGNvbCArIENvZGVzLlNVRkZJWF9DT0xVTU5fSU5TRVJUQUJMRTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzZWxlY3RDb2x1bW4oKTogT0NvbHVtbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdENvbHVtbjtcbiAgfVxuXG4gIHNldCBzZWxlY3RDb2x1bW4odmFsOiBPQ29sdW1uKSB7XG4gICAgdGhpcy5fc2VsZWN0Q29sdW1uID0gdmFsO1xuICAgIHRoaXMuc2VsZWN0Q29sdW1uLm5hbWUgPSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1Q7XG4gICAgdGhpcy5zZWxlY3RDb2x1bW4udGl0bGUgPSAnJztcbiAgICB0aGlzLnNlbGVjdENvbHVtbi52aXNpYmxlID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==