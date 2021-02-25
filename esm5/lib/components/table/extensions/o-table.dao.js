import * as tslib_1 from "tslib";
import { BehaviorSubject, merge, of } from 'rxjs';
var OTableDao = (function () {
    function OTableDao(dataService, entity, methods) {
        this.dataService = dataService;
        this.entity = entity;
        this.methods = methods;
        this.usingStaticData = false;
        this._isLoadingResults = false;
        this.dataChange = new BehaviorSubject([]);
        this.sqlTypesChange = new BehaviorSubject({});
    }
    Object.defineProperty(OTableDao.prototype, "data", {
        get: function () { return this.dataChange.value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OTableDao.prototype, "sqlTypes", {
        get: function () { return this.sqlTypesChange.value; },
        enumerable: true,
        configurable: true
    });
    OTableDao.prototype.getQuery = function (queryArgs) {
        this.isLoadingResults = true;
        return this.dataService[this.methods.query].apply(this.dataService, queryArgs);
    };
    OTableDao.prototype.removeQuery = function (filters) {
        var _this = this;
        return merge.apply(void 0, tslib_1.__spread(filters.map((function (kv) { return _this.dataService[_this.methods.delete](kv, _this.entity); }))));
    };
    OTableDao.prototype.insertQuery = function (av, sqlTypes) {
        if (this.usingStaticData) {
            this.data.push(av);
            return of(this.data);
        }
        else {
            return this.dataService[this.methods.insert](av, this.entity, sqlTypes);
        }
    };
    OTableDao.prototype.updateQuery = function (kv, av, sqlTypes) {
        if (this.usingStaticData) {
            return of(this.data);
        }
        else {
            return this.dataService[this.methods.update](kv, av, this.entity, sqlTypes);
        }
    };
    OTableDao.prototype.setDataArray = function (data) {
        this.dataChange.next(data);
        this.isLoadingResults = false;
        return of(data);
    };
    OTableDao.prototype.setAsynchronousColumn = function (value, rowData) {
        var index = null;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i] === rowData) {
                index = i;
                break;
            }
        }
        if (index !== null) {
            Object.assign(this.data[index], value);
        }
    };
    Object.defineProperty(OTableDao.prototype, "isLoadingResults", {
        get: function () {
            return this._isLoadingResults;
        },
        set: function (val) {
            var _this = this;
            if (val) {
                this.cleanTimer();
                this.loadingTimer = setTimeout(function () {
                    _this._isLoadingResults = val;
                }, 500);
            }
            else {
                this.cleanTimer();
                this._isLoadingResults = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    OTableDao.prototype.cleanTimer = function () {
        if (this.loadingTimer) {
            clearTimeout(this.loadingTimer);
        }
    };
    return OTableDao;
}());
export { OTableDao };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5kYW8uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9vLXRhYmxlLmRhby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQWMsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBSzlEO0lBYUUsbUJBQ1UsV0FBZ0IsRUFDaEIsTUFBYyxFQUNkLE9BQVk7UUFGWixnQkFBVyxHQUFYLFdBQVcsQ0FBSztRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQWR0QixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUd2QixzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFHN0MsZUFBVSxHQUFHLElBQUksZUFBZSxDQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLG1CQUFjLEdBQUcsSUFBSSxlQUFlLENBQVMsRUFBRSxDQUFDLENBQUM7SUFRN0MsQ0FBQztJQVBMLHNCQUFJLDJCQUFJO2FBQVIsY0FBb0IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ25ELHNCQUFJLCtCQUFRO2FBQVosY0FBeUIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBVzVELDRCQUFRLEdBQVIsVUFBUyxTQUF5QjtRQUNoQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFFRCwrQkFBVyxHQUFYLFVBQVksT0FBWTtRQUF4QixpQkFFQztRQURDLE9BQU8sS0FBSyxnQ0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBdEQsQ0FBc0QsQ0FBQyxDQUFDLEdBQUU7SUFDL0YsQ0FBQztJQUVELCtCQUFXLEdBQVgsVUFBWSxFQUFVLEVBQUUsUUFBaUI7UUFDdkMsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQsK0JBQVcsR0FBWCxVQUFZLEVBQVUsRUFBRSxFQUFVLEVBQUUsUUFBaUI7UUFDbkQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzdFO0lBQ0gsQ0FBQztJQU1ELGdDQUFZLEdBQVosVUFBYSxJQUFnQjtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCx5Q0FBcUIsR0FBckIsVUFBc0IsS0FBaUIsRUFBRSxPQUFZO1FBRW5ELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sRUFBRTtnQkFDNUIsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDVixNQUFNO2FBQ1A7U0FDRjtRQUNELElBQUksS0FBSyxLQUFLLElBQUksRUFBRTtZQUNsQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBRUQsc0JBQUksdUNBQWdCO2FBQXBCO1lBQ0UsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDaEMsQ0FBQzthQUVELFVBQXFCLEdBQVk7WUFBakMsaUJBVUM7WUFUQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDO29CQUM3QixLQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxDQUFDO2dCQUMvQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDVDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7YUFDOUI7UUFDSCxDQUFDOzs7T0FaQTtJQWNTLDhCQUFVLEdBQXBCO1FBQ0UsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRUgsZ0JBQUM7QUFBRCxDQUFDLEFBOUZELElBOEZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBtZXJnZSwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1F1ZXJ5RGF0YUFyZ3MgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9xdWVyeS1kYXRhLWFyZ3MudHlwZSc7XG5cblxuZXhwb3J0IGNsYXNzIE9UYWJsZURhbyB7XG5cbiAgdXNpbmdTdGF0aWNEYXRhOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIGxvYWRpbmdUaW1lcjtcbiAgcHJvdGVjdGVkIF9pc0xvYWRpbmdSZXN1bHRzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFN0cmVhbSB0aGF0IGVtaXRzIHdoZW5ldmVyIHRoZSBkYXRhIGhhcyBiZWVuIG1vZGlmaWVkLiAqL1xuICBkYXRhQ2hhbmdlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxhbnlbXT4oW10pO1xuICBzcWxUeXBlc0NoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8b2JqZWN0Pih7fSk7XG4gIGdldCBkYXRhKCk6IGFueVtdIHsgcmV0dXJuIHRoaXMuZGF0YUNoYW5nZS52YWx1ZTsgfVxuICBnZXQgc3FsVHlwZXMoKTogb2JqZWN0IHsgcmV0dXJuIHRoaXMuc3FsVHlwZXNDaGFuZ2UudmFsdWU7IH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGRhdGFTZXJ2aWNlOiBhbnksXG4gICAgcHJpdmF0ZSBlbnRpdHk6IHN0cmluZyxcbiAgICBwcml2YXRlIG1ldGhvZHM6IGFueVxuICApIHsgfVxuXG4gIC8qKlxuICAgKiBDYWxsIHRoZSBzZXJ2aWNlIHF1ZXJ5IGFuZCBlbWl0IGRhdGEgaGFzIGJlbiBtb2RpZmllZFxuICAgKi9cbiAgZ2V0UXVlcnkocXVlcnlBcmdzOiBPUXVlcnlEYXRhQXJncyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgdGhpcy5pc0xvYWRpbmdSZXN1bHRzID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZVt0aGlzLm1ldGhvZHMucXVlcnldLmFwcGx5KHRoaXMuZGF0YVNlcnZpY2UsIHF1ZXJ5QXJncyk7XG4gIH1cblxuICByZW1vdmVRdWVyeShmaWx0ZXJzOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBtZXJnZSguLi5maWx0ZXJzLm1hcCgoa3YgPT4gdGhpcy5kYXRhU2VydmljZVt0aGlzLm1ldGhvZHMuZGVsZXRlXShrdiwgdGhpcy5lbnRpdHkpKSkpO1xuICB9XG5cbiAgaW5zZXJ0UXVlcnkoYXY6IG9iamVjdCwgc3FsVHlwZXM/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICh0aGlzLnVzaW5nU3RhdGljRGF0YSkge1xuICAgICAgdGhpcy5kYXRhLnB1c2goYXYpO1xuICAgICAgcmV0dXJuIG9mKHRoaXMuZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFTZXJ2aWNlW3RoaXMubWV0aG9kcy5pbnNlcnRdKGF2LCB0aGlzLmVudGl0eSwgc3FsVHlwZXMpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVF1ZXJ5KGt2OiBvYmplY3QsIGF2OiBvYmplY3QsIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy51c2luZ1N0YXRpY0RhdGEpIHtcbiAgICAgIHJldHVybiBvZih0aGlzLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZVt0aGlzLm1ldGhvZHMudXBkYXRlXShrdiwgYXYsIHRoaXMuZW50aXR5LCBzcWxUeXBlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBkYXRhIGFycmF5IGFuZCBlbWl0IGRhdGEgaGFzIGJlbiBtb2RpZmllZFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgc2V0RGF0YUFycmF5KGRhdGE6IEFycmF5PGFueT4pIHtcbiAgICB0aGlzLmRhdGFDaGFuZ2UubmV4dChkYXRhKTtcbiAgICB0aGlzLmlzTG9hZGluZ1Jlc3VsdHMgPSBmYWxzZTtcbiAgICByZXR1cm4gb2YoZGF0YSk7XG4gIH1cblxuICBzZXRBc3luY2hyb25vdXNDb2x1bW4odmFsdWU6IEFycmF5PGFueT4sIHJvd0RhdGE6IGFueSkge1xuICAgIC8vIE9iamVjdC5hc3NpZ24odGhpcy5kYXRhW3Jvd0luZGV4XSwgdmFsdWUpO1xuICAgIGxldCBpbmRleCA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmRhdGFbaV0gPT09IHJvd0RhdGEpIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGluZGV4ICE9PSBudWxsKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGF0YVtpbmRleF0sIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgaXNMb2FkaW5nUmVzdWx0cygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNMb2FkaW5nUmVzdWx0cztcbiAgfVxuXG4gIHNldCBpc0xvYWRpbmdSZXN1bHRzKHZhbDogYm9vbGVhbikge1xuICAgIGlmICh2YWwpIHtcbiAgICAgIHRoaXMuY2xlYW5UaW1lcigpO1xuICAgICAgdGhpcy5sb2FkaW5nVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5faXNMb2FkaW5nUmVzdWx0cyA9IHZhbDtcbiAgICAgIH0sIDUwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xlYW5UaW1lcigpO1xuICAgICAgdGhpcy5faXNMb2FkaW5nUmVzdWx0cyA9IHZhbDtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY2xlYW5UaW1lcigpIHtcbiAgICBpZiAodGhpcy5sb2FkaW5nVGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRpbmdUaW1lcik7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==