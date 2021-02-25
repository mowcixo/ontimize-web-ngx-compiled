import { BehaviorSubject, merge, of } from 'rxjs';
export class OTableDao {
    constructor(dataService, entity, methods) {
        this.dataService = dataService;
        this.entity = entity;
        this.methods = methods;
        this.usingStaticData = false;
        this._isLoadingResults = false;
        this.dataChange = new BehaviorSubject([]);
        this.sqlTypesChange = new BehaviorSubject({});
    }
    get data() { return this.dataChange.value; }
    get sqlTypes() { return this.sqlTypesChange.value; }
    getQuery(queryArgs) {
        this.isLoadingResults = true;
        return this.dataService[this.methods.query].apply(this.dataService, queryArgs);
    }
    removeQuery(filters) {
        return merge(...filters.map((kv => this.dataService[this.methods.delete](kv, this.entity))));
    }
    insertQuery(av, sqlTypes) {
        if (this.usingStaticData) {
            this.data.push(av);
            return of(this.data);
        }
        else {
            return this.dataService[this.methods.insert](av, this.entity, sqlTypes);
        }
    }
    updateQuery(kv, av, sqlTypes) {
        if (this.usingStaticData) {
            return of(this.data);
        }
        else {
            return this.dataService[this.methods.update](kv, av, this.entity, sqlTypes);
        }
    }
    setDataArray(data) {
        this.dataChange.next(data);
        this.isLoadingResults = false;
        return of(data);
    }
    setAsynchronousColumn(value, rowData) {
        let index = null;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i] === rowData) {
                index = i;
                break;
            }
        }
        if (index !== null) {
            Object.assign(this.data[index], value);
        }
    }
    get isLoadingResults() {
        return this._isLoadingResults;
    }
    set isLoadingResults(val) {
        if (val) {
            this.cleanTimer();
            this.loadingTimer = setTimeout(() => {
                this._isLoadingResults = val;
            }, 500);
        }
        else {
            this.cleanTimer();
            this._isLoadingResults = val;
        }
    }
    cleanTimer() {
        if (this.loadingTimer) {
            clearTimeout(this.loadingTimer);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS5kYW8uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGFibGUvZXh0ZW5zaW9ucy9vLXRhYmxlLmRhby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFLOUQsTUFBTSxPQUFPLFNBQVM7SUFhcEIsWUFDVSxXQUFnQixFQUNoQixNQUFjLEVBQ2QsT0FBWTtRQUZaLGdCQUFXLEdBQVgsV0FBVyxDQUFLO1FBQ2hCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxZQUFPLEdBQVAsT0FBTyxDQUFLO1FBZHRCLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBR3ZCLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUc3QyxlQUFVLEdBQUcsSUFBSSxlQUFlLENBQVEsRUFBRSxDQUFDLENBQUM7UUFDNUMsbUJBQWMsR0FBRyxJQUFJLGVBQWUsQ0FBUyxFQUFFLENBQUMsQ0FBQztJQVE3QyxDQUFDO0lBUEwsSUFBSSxJQUFJLEtBQVksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbkQsSUFBSSxRQUFRLEtBQWEsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFXNUQsUUFBUSxDQUFDLFNBQXlCO1FBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFZO1FBQ3RCLE9BQU8sS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFVLEVBQUUsUUFBaUI7UUFDdkMsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDekU7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsUUFBaUI7UUFDbkQsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzdFO0lBQ0gsQ0FBQztJQU1ELFlBQVksQ0FBQyxJQUFnQjtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxLQUFpQixFQUFFLE9BQVk7UUFFbkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxFQUFFO2dCQUM1QixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLE1BQU07YUFDUDtTQUNGO1FBQ0QsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFRCxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFZO1FBQy9CLElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztZQUMvQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDVDthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRVMsVUFBVTtRQUNsQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUM7Q0FFRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgbWVyZ2UsIE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9RdWVyeURhdGFBcmdzIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvcXVlcnktZGF0YS1hcmdzLnR5cGUnO1xuXG5cbmV4cG9ydCBjbGFzcyBPVGFibGVEYW8ge1xuXG4gIHVzaW5nU3RhdGljRGF0YTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByb3RlY3RlZCBsb2FkaW5nVGltZXI7XG4gIHByb3RlY3RlZCBfaXNMb2FkaW5nUmVzdWx0czogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgZGF0YSBoYXMgYmVlbiBtb2RpZmllZC4gKi9cbiAgZGF0YUNoYW5nZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55W10+KFtdKTtcbiAgc3FsVHlwZXNDaGFuZ2UgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG9iamVjdD4oe30pO1xuICBnZXQgZGF0YSgpOiBhbnlbXSB7IHJldHVybiB0aGlzLmRhdGFDaGFuZ2UudmFsdWU7IH1cbiAgZ2V0IHNxbFR5cGVzKCk6IG9iamVjdCB7IHJldHVybiB0aGlzLnNxbFR5cGVzQ2hhbmdlLnZhbHVlOyB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBkYXRhU2VydmljZTogYW55LFxuICAgIHByaXZhdGUgZW50aXR5OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBtZXRob2RzOiBhbnlcbiAgKSB7IH1cblxuICAvKipcbiAgICogQ2FsbCB0aGUgc2VydmljZSBxdWVyeSBhbmQgZW1pdCBkYXRhIGhhcyBiZW4gbW9kaWZpZWRcbiAgICovXG4gIGdldFF1ZXJ5KHF1ZXJ5QXJnczogT1F1ZXJ5RGF0YUFyZ3MpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHRoaXMuaXNMb2FkaW5nUmVzdWx0cyA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5tZXRob2RzLnF1ZXJ5XS5hcHBseSh0aGlzLmRhdGFTZXJ2aWNlLCBxdWVyeUFyZ3MpO1xuICB9XG5cbiAgcmVtb3ZlUXVlcnkoZmlsdGVyczogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbWVyZ2UoLi4uZmlsdGVycy5tYXAoKGt2ID0+IHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5tZXRob2RzLmRlbGV0ZV0oa3YsIHRoaXMuZW50aXR5KSkpKTtcbiAgfVxuXG4gIGluc2VydFF1ZXJ5KGF2OiBvYmplY3QsIHNxbFR5cGVzPzogb2JqZWN0KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy51c2luZ1N0YXRpY0RhdGEpIHtcbiAgICAgIHRoaXMuZGF0YS5wdXNoKGF2KTtcbiAgICAgIHJldHVybiBvZih0aGlzLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhU2VydmljZVt0aGlzLm1ldGhvZHMuaW5zZXJ0XShhdiwgdGhpcy5lbnRpdHksIHNxbFR5cGVzKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVRdWVyeShrdjogb2JqZWN0LCBhdjogb2JqZWN0LCBzcWxUeXBlcz86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgaWYgKHRoaXMudXNpbmdTdGF0aWNEYXRhKSB7XG4gICAgICByZXR1cm4gb2YodGhpcy5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YVNlcnZpY2VbdGhpcy5tZXRob2RzLnVwZGF0ZV0oa3YsIGF2LCB0aGlzLmVudGl0eSwgc3FsVHlwZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgZGF0YSBhcnJheSBhbmQgZW1pdCBkYXRhIGhhcyBiZW4gbW9kaWZpZWRcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIHNldERhdGFBcnJheShkYXRhOiBBcnJheTxhbnk+KSB7XG4gICAgdGhpcy5kYXRhQ2hhbmdlLm5leHQoZGF0YSk7XG4gICAgdGhpcy5pc0xvYWRpbmdSZXN1bHRzID0gZmFsc2U7XG4gICAgcmV0dXJuIG9mKGRhdGEpO1xuICB9XG5cbiAgc2V0QXN5bmNocm9ub3VzQ29sdW1uKHZhbHVlOiBBcnJheTxhbnk+LCByb3dEYXRhOiBhbnkpIHtcbiAgICAvLyBPYmplY3QuYXNzaWduKHRoaXMuZGF0YVtyb3dJbmRleF0sIHZhbHVlKTtcbiAgICBsZXQgaW5kZXggPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5kYXRhW2ldID09PSByb3dEYXRhKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpbmRleCAhPT0gbnVsbCkge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRhdGFbaW5kZXhdLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGlzTG9hZGluZ1Jlc3VsdHMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzTG9hZGluZ1Jlc3VsdHM7XG4gIH1cblxuICBzZXQgaXNMb2FkaW5nUmVzdWx0cyh2YWw6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLmNsZWFuVGltZXIoKTtcbiAgICAgIHRoaXMubG9hZGluZ1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2lzTG9hZGluZ1Jlc3VsdHMgPSB2YWw7XG4gICAgICB9LCA1MDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsZWFuVGltZXIoKTtcbiAgICAgIHRoaXMuX2lzTG9hZGluZ1Jlc3VsdHMgPSB2YWw7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNsZWFuVGltZXIoKSB7XG4gICAgaWYgKHRoaXMubG9hZGluZ1RpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkaW5nVGltZXIpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=