var OBaseTablePaginator = (function () {
    function OBaseTablePaginator() {
        this._pageIndex = 0;
        this._pageSize = 10;
        this.showFirstLastButtons = true;
        this._pageIndex = 0;
        this._pageSizeOptions = [10, 25, 50, 100];
    }
    Object.defineProperty(OBaseTablePaginator.prototype, "pageLenght", {
        get: function () {
            return this._pageSize;
        },
        set: function (value) {
            this._pageSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTablePaginator.prototype, "pageIndex", {
        get: function () {
            return this._pageIndex;
        },
        set: function (value) {
            this._pageIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTablePaginator.prototype, "pageSize", {
        get: function () {
            return this._pageSize;
        },
        set: function (value) {
            var _this = this;
            var parsedValue = parseInt("" + value, 10);
            if (isNaN(parsedValue) || parsedValue < 0) {
                this._pageSize = this._pageSizeOptions[0];
            }
            else {
                this._pageSize = parsedValue;
            }
            var result = this.pageSizeOptions.find(function (option) { return option === _this._pageSize; });
            if (!result) {
                this._pageSizeOptions.push(this._pageSize);
                this._pageSizeOptions.sort(function (i, j) { return i - j; });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OBaseTablePaginator.prototype, "pageSizeOptions", {
        get: function () {
            return this._pageSizeOptions;
        },
        set: function (value) {
            this._pageSizeOptions = value;
        },
        enumerable: true,
        configurable: true
    });
    OBaseTablePaginator.prototype.isShowingAllRows = function (selectedLength) {
        return false;
    };
    return OBaseTablePaginator;
}());
export { OBaseTablePaginator };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1iYXNlLXRhYmxlLXBhZ2luYXRvci5jbGFzcy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90YWJsZS9leHRlbnNpb25zL2Zvb3Rlci9wYWdpbmF0b3Ivby1iYXNlLXRhYmxlLXBhZ2luYXRvci5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtJQU9FO1FBTFUsZUFBVSxHQUFXLENBQUMsQ0FBQztRQUN2QixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBRWpDLHlCQUFvQixHQUFZLElBQUksQ0FBQztRQUduQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsc0JBQUksMkNBQVU7YUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDO2FBRUQsVUFBZSxLQUFhO1lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLENBQUM7OztPQUpBO0lBTUQsc0JBQUksMENBQVM7YUFBYjtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN6QixDQUFDO2FBRUQsVUFBYyxLQUFhO1lBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQzFCLENBQUM7OztPQUpBO0lBTUQsc0JBQUkseUNBQVE7YUFBWjtZQUNFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDO2FBRUQsVUFBYSxLQUFhO1lBQTFCLGlCQVlDO1lBWEMsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLEtBQUcsS0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDO2FBQzlCO1lBQ0QsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLEtBQUssS0FBSSxDQUFDLFNBQVMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1lBQzlFLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFTLEVBQUUsQ0FBUyxJQUFLLE9BQUEsQ0FBQyxHQUFHLENBQUMsRUFBTCxDQUFLLENBQUMsQ0FBQzthQUM3RDtRQUNILENBQUM7OztPQWRBO0lBZ0JELHNCQUFJLGdEQUFlO2FBQW5CO1lBQ0UsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDL0IsQ0FBQzthQUVELFVBQW9CLEtBQWlCO1lBQ25DLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDaEMsQ0FBQzs7O09BSkE7SUFNTSw4Q0FBZ0IsR0FBdkIsVUFBd0IsY0FBYztRQUdwQyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUEzREQsSUEyREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPVGFibGVQYWdpbmF0b3IgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9pbnRlcmZhY2VzL28tdGFibGUtcGFnaW5hdG9yLmludGVyZmFjZSc7XG5cbmV4cG9ydCBjbGFzcyBPQmFzZVRhYmxlUGFnaW5hdG9yIGltcGxlbWVudHMgT1RhYmxlUGFnaW5hdG9yIHtcblxuICBwcm90ZWN0ZWQgX3BhZ2VJbmRleDogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIF9wYWdlU2l6ZTogbnVtYmVyID0gMTA7XG4gIHByb3RlY3RlZCBfcGFnZVNpemVPcHRpb25zOiBBcnJheTxhbnk+O1xuICBzaG93Rmlyc3RMYXN0QnV0dG9uczogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcGFnZUluZGV4ID0gMDtcbiAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMgPSBbMTAsIDI1LCA1MCwgMTAwXTtcbiAgfVxuXG4gIGdldCBwYWdlTGVuZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplO1xuICB9XG5cbiAgc2V0IHBhZ2VMZW5naHQodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VTaXplID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcGFnZUluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VJbmRleDtcbiAgfVxuXG4gIHNldCBwYWdlSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3BhZ2VJbmRleCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplO1xuICB9XG5cbiAgc2V0IHBhZ2VTaXplKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBwYXJzZWRWYWx1ZSA9IHBhcnNlSW50KGAke3ZhbHVlfWAsIDEwKTtcbiAgICBpZiAoaXNOYU4ocGFyc2VkVmFsdWUpIHx8IHBhcnNlZFZhbHVlIDwgMCkge1xuICAgICAgdGhpcy5fcGFnZVNpemUgPSB0aGlzLl9wYWdlU2l6ZU9wdGlvbnNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3BhZ2VTaXplID0gcGFyc2VkVmFsdWU7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucGFnZVNpemVPcHRpb25zLmZpbmQob3B0aW9uID0+IG9wdGlvbiA9PT0gdGhpcy5fcGFnZVNpemUpO1xuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMucHVzaCh0aGlzLl9wYWdlU2l6ZSk7XG4gICAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMuc29ydCgoaTogbnVtYmVyLCBqOiBudW1iZXIpID0+IGkgLSBqKTtcbiAgICB9XG4gIH1cblxuICBnZXQgcGFnZVNpemVPcHRpb25zKCk6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9wYWdlU2l6ZU9wdGlvbnM7XG4gIH1cblxuICBzZXQgcGFnZVNpemVPcHRpb25zKHZhbHVlOiBBcnJheTxhbnk+KSB7XG4gICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgaXNTaG93aW5nQWxsUm93cyhzZWxlY3RlZExlbmd0aCk6IGJvb2xlYW4ge1xuICAgIC8vIHJldHVybiB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMuaW5kZXhPZihzZWxlY3RlZExlbmd0aCkgPT09ICh0aGlzLl9wYWdlU2l6ZU9wdGlvbnMubGVuZ3RoIC0gMSk7XG4gICAgLy8gdGVtcG9yYWwgd2hpbGUgbm90IGhhdmluZyBhbiBvcHRpb24gZm9yIHNob3dpbmcgYWxsIHJlY29yZHMgaW4gcGFnaW5hdGVkIHRhYmxlc1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19