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
    Object.defineProperty(DefaultOTableOptions.prototype, "expandableColumn", {
        get: function () {
            return this._expandableColumn;
        },
        set: function (val) {
            this._expandableColumn = val;
            this._expandableColumn.name = Codes.NAME_COLUMN_EXPANDABLE;
            this._expandableColumn.title = '';
            this._expandableColumn.visible = true;
            this._expandableColumn.resizable = false;
            this._expandableColumn.searchable = false;
        },
        enumerable: true,
        configurable: true
    });
    return DefaultOTableOptions;
}());
export { DefaultOTableOptions };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1vLXRhYmxlLW9wdGlvbnMuY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9kZWZhdWx0LW8tdGFibGUtb3B0aW9ucy5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRW5EO0lBVUU7UUFSQSxZQUFPLEdBQW1CLEVBQUUsQ0FBQztRQUM3QixXQUFNLEdBQVksSUFBSSxDQUFDO1FBQ3ZCLHdCQUFtQixHQUFZLEtBQUssQ0FBQztRQUUzQixvQkFBZSxHQUFlLEVBQUUsQ0FBQztRQUt6QyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1FBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVELHNCQUFJLGdEQUFjO2FBQWxCO1lBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzlCLENBQUM7YUFFRCxVQUFtQixHQUFlO1lBQWxDLGlCQUtDO1lBSkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFhO2dCQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoRSxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7OztPQVBBO0lBU0Qsc0JBQUksb0RBQWtCO2FBQXRCO1lBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQVc7Z0JBQzFDLE9BQU8sR0FBRyxHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUM7OztPQUFBO0lBRUQsc0JBQUksOENBQVk7YUFBaEI7WUFDRSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDNUIsQ0FBQzthQUVELFVBQWlCLEdBQVk7WUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7WUFDekIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ2xELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEMsQ0FBQzs7O09BUEE7SUFTRCxzQkFBSSxrREFBZ0I7YUFBcEI7WUFDRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUNoQyxDQUFDO2FBRUQsVUFBcUIsR0FBWTtZQUMvQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFDO1lBQzdCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDO1lBQzNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQzVDLENBQUM7OztPQVRBO0lBV0gsMkJBQUM7QUFBRCxDQUFDLEFBMURELElBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT1RhYmxlT3B0aW9ucyB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvby10YWJsZS1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgT0NvbHVtbiB9IGZyb20gJy4uL2NvbHVtbi9vLWNvbHVtbi5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBEZWZhdWx0T1RhYmxlT3B0aW9ucyBpbXBsZW1lbnRzIE9UYWJsZU9wdGlvbnMge1xuXG4gIGNvbHVtbnM6IEFycmF5PE9Db2x1bW4+ID0gW107XG4gIGZpbHRlcjogYm9vbGVhbiA9IHRydWU7XG4gIGZpbHRlckNhc2VTZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX3Zpc2libGVDb2x1bW5zOiBBcnJheTxhbnk+ID0gW107XG4gIHByb3RlY3RlZCBfc2VsZWN0Q29sdW1uOiBPQ29sdW1uO1xuICBwcm90ZWN0ZWQgX2V4cGFuZGFibGVDb2x1bW46IE9Db2x1bW47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RDb2x1bW4gPSBuZXcgT0NvbHVtbigpO1xuICAgIHRoaXMuc2VsZWN0Q29sdW1uLm5hbWUgPSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1Q7XG4gICAgdGhpcy5zZWxlY3RDb2x1bW4udGl0bGUgPSAnJztcbiAgICB0aGlzLnNlbGVjdENvbHVtbi52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICBnZXQgdmlzaWJsZUNvbHVtbnMoKTogQXJyYXk8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGVDb2x1bW5zO1xuICB9XG5cbiAgc2V0IHZpc2libGVDb2x1bW5zKGFyZzogQXJyYXk8YW55Pikge1xuICAgIHRoaXMuX3Zpc2libGVDb2x1bW5zID0gYXJnO1xuICAgIHRoaXMuY29sdW1ucy5mb3JFYWNoKChvQ29sOiBPQ29sdW1uKSA9PiB7XG4gICAgICBvQ29sLnZpc2libGUgPSB0aGlzLl92aXNpYmxlQ29sdW1ucy5pbmRleE9mKG9Db2wuYXR0cikgIT09IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0IGNvbHVtbnNJbnNlcnRhYmxlcygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJsZUNvbHVtbnMubWFwKChjb2w6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIGNvbCArIENvZGVzLlNVRkZJWF9DT0xVTU5fSU5TRVJUQUJMRTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzZWxlY3RDb2x1bW4oKTogT0NvbHVtbiB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdENvbHVtbjtcbiAgfVxuXG4gIHNldCBzZWxlY3RDb2x1bW4odmFsOiBPQ29sdW1uKSB7XG4gICAgdGhpcy5fc2VsZWN0Q29sdW1uID0gdmFsO1xuICAgIHRoaXMuc2VsZWN0Q29sdW1uLm5hbWUgPSBDb2Rlcy5OQU1FX0NPTFVNTl9TRUxFQ1Q7XG4gICAgdGhpcy5zZWxlY3RDb2x1bW4udGl0bGUgPSAnJztcbiAgICB0aGlzLnNlbGVjdENvbHVtbi52aXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICBnZXQgZXhwYW5kYWJsZUNvbHVtbigpOiBPQ29sdW1uIHtcbiAgICByZXR1cm4gdGhpcy5fZXhwYW5kYWJsZUNvbHVtbjtcbiAgfVxuXG4gIHNldCBleHBhbmRhYmxlQ29sdW1uKHZhbDogT0NvbHVtbikge1xuICAgIHRoaXMuX2V4cGFuZGFibGVDb2x1bW4gPSB2YWw7XG4gICAgdGhpcy5fZXhwYW5kYWJsZUNvbHVtbi5uYW1lID0gQ29kZXMuTkFNRV9DT0xVTU5fRVhQQU5EQUJMRTtcbiAgICB0aGlzLl9leHBhbmRhYmxlQ29sdW1uLnRpdGxlID0gJyc7XG4gICAgdGhpcy5fZXhwYW5kYWJsZUNvbHVtbi52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLl9leHBhbmRhYmxlQ29sdW1uLnJlc2l6YWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuX2V4cGFuZGFibGVDb2x1bW4uc2VhcmNoYWJsZSA9IGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==