export class OFileItem {
    constructor(file, uploader) {
        this.index = void 0;
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
        this._file = file;
        this.uploader = uploader;
    }
    upload() {
        this.uploader.uploadItem(this);
    }
    cancel() {
        this.uploader.cancelItem(this);
    }
    remove() {
        this.uploader.removeFile(this);
    }
    prepareToUpload() {
        this.index = this.index || ++this.uploader.nextIndex;
        this.isReady = true;
    }
    get file() {
        return this._file;
    }
    get name() {
        return this._file.name;
    }
    get size() {
        return this._file.size;
    }
    get type() {
        return this._file.type;
    }
    get lastModifiedDate() {
        return this._file.lastModified;
    }
    _onBeforeUpload(notify = true) {
        this.isReady = true;
        this.isUploading = true;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = false;
        this.progress = 0;
        if (notify) {
            this.onBeforeUpload();
        }
    }
    _onProgress(progress) {
        this.progress = progress;
        this.onProgress(progress);
    }
    _onSuccess(data, notify = true) {
        this.index = void 0;
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = true;
        this.isSuccess = true;
        this.isCancel = false;
        this.isError = false;
        this.progress = 100;
        if (notify) {
            this.onSuccess(data);
        }
    }
    _onError(error, notify = true) {
        this.index = void 0;
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = true;
        this.isSuccess = false;
        this.isCancel = false;
        this.isError = true;
        this.progress = 0;
        if (notify) {
            this.onError(error);
        }
    }
    _onCancel(notify = true) {
        this.isReady = false;
        this.isUploading = false;
        this.isUploaded = false;
        this.isSuccess = false;
        this.isCancel = true;
        this.isError = false;
        this.progress = 0;
        this.index = void 0;
        if (notify) {
            this.onCancel();
        }
    }
    _onComplete(notify = true) {
        if (notify) {
            this.onComplete();
        }
    }
    onBeforeUpload() {
        return {};
    }
    onProgress(progress) {
        return { progress };
    }
    onSuccess(data) {
        return { data };
    }
    onError(error) {
        return { error };
    }
    onCancel() {
        return {};
    }
    onComplete() {
        return {};
    }
    get pendingUpload() {
        return !this.isUploaded && !this.isUploading && !this.isCancel;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWxlLWl0ZW0uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvZmlsZS1pbnB1dC9vLWZpbGUtaXRlbS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxNQUFNLE9BQU8sU0FBUztJQWVwQixZQUFZLElBQVUsRUFBRSxRQUF1QjtRQWJ4QyxVQUFLLEdBQVcsS0FBSyxDQUFDLENBQUM7UUFDdkIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFPMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLE1BQU07UUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVNLGVBQWU7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFD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ckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNwQixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjtJQUNILENBQUM7SUFFTSxXQUFXLENBQUMsU0FBa0IsSUFBSTtRQUN2QyxJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVNLFVBQVUsQ0FBQyxRQUFnQjtRQUNoQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVNLFNBQVMsQ0FBQyxJQUFTO1FBQ3hCLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRU0sT0FBTyxDQUFDLEtBQVU7UUFDdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRU0sVUFBVTtRQUNmLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDaEUsQ0FBQztDQUVIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE9GaWxlVXBsb2FkZXIgfSBmcm9tICcuL28tZmlsZS11cGxvYWRlci5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBPRmlsZUl0ZW0ge1xuXG4gIHB1YmxpYyBpbmRleDogbnVtYmVyID0gdm9pZCAwO1xuICBwdWJsaWMgaXNSZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNVcGxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGlzVXBsb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGlzU3VjY2VzczogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNDYW5jZWw6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGlzRXJyb3I6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHByb2dyZXNzOiBudW1iZXIgPSAwO1xuICBwdWJsaWMgX3VwbG9hZFN1c2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgcHJvdGVjdGVkIHVwbG9hZGVyOiBPRmlsZVVwbG9hZGVyO1xuICBwcm90ZWN0ZWQgX2ZpbGU6IEZpbGU7XG5cbiAgY29uc3RydWN0b3IoZmlsZTogRmlsZSwgdXBsb2FkZXI6IE9GaWxlVXBsb2FkZXIpIHtcbiAgICB0aGlzLl9maWxlID0gZmlsZTtcbiAgICB0aGlzLnVwbG9hZGVyID0gdXBsb2FkZXI7XG4gIH1cblxuICBwdWJsaWMgdXBsb2FkKCk6IHZvaWQge1xuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkSXRlbSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBjYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy51cGxvYWRlci5jYW5jZWxJdGVtKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHJlbW92ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnVwbG9hZGVyLnJlbW92ZUZpbGUodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcHJlcGFyZVRvVXBsb2FkKCk6IHZvaWQge1xuICAgIHRoaXMuaW5kZXggPSB0aGlzLmluZGV4IHx8ICsrdGhpcy51cGxvYWRlci5uZXh0SW5kZXg7XG4gICAgdGhpcy5pc1JlYWR5ID0gdHJ1ZTtcbiAgfVxuXG4gIGdldCBmaWxlKCk6IEZpbGUge1xuICAgIHJldHVybiB0aGlzLl9maWxlO1xuICB9XG5cbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsZS5uYW1lO1xuICB9XG5cbiAgZ2V0IHNpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsZS5zaXplO1xuICB9XG5cbiAgZ2V0IHR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZmlsZS50eXBlO1xuICB9XG5cbiAgZ2V0IGxhc3RNb2RpZmllZERhdGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fZmlsZS5sYXN0TW9kaWZpZWQ7XG4gIH1cblxuICBwdWJsaWMgX29uQmVmb3JlVXBsb2FkKG5vdGlmeTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmlzUmVhZHkgPSB0cnVlO1xuICAgIHRoaXMuaXNVcGxvYWRpbmcgPSB0cnVlO1xuICAgIHRoaXMuaXNVcGxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgIGlmIChub3RpZnkpIHtcbiAgICAgIHRoaXMub25CZWZvcmVVcGxvYWQoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX29uUHJvZ3Jlc3MocHJvZ3Jlc3M6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICB0aGlzLm9uUHJvZ3Jlc3MocHJvZ3Jlc3MpO1xuICB9XG5cbiAgcHVibGljIF9vblN1Y2Nlc3MoZGF0YTogYW55LCBub3RpZnk6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgdGhpcy5pbmRleCA9IHZvaWQgMDtcbiAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc1VwbG9hZGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlzU3VjY2VzcyA9IHRydWU7XG4gICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gICAgaWYgKG5vdGlmeSkge1xuICAgICAgdGhpcy5vblN1Y2Nlc3MoZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9vbkVycm9yKGVycm9yOiBhbnksIG5vdGlmeTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmluZGV4ID0gdm9pZCAwO1xuICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgdGhpcy5pc0NhbmNlbCA9IGZhbHNlO1xuICAgIHRoaXMuaXNFcnJvciA9IHRydWU7XG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgaWYgKG5vdGlmeSkge1xuICAgICAgdGhpcy5vbkVycm9yKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX29uQ2FuY2VsKG5vdGlmeTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmlzUmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5pc1VwbG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc1N1Y2Nlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmlzQ2FuY2VsID0gdHJ1ZTtcbiAgICB0aGlzLmlzRXJyb3IgPSBmYWxzZTtcbiAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICB0aGlzLmluZGV4ID0gdm9pZCAwO1xuICAgIGlmIChub3RpZnkpIHtcbiAgICAgIHRoaXMub25DYW5jZWwoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX29uQ29tcGxldGUobm90aWZ5OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIGlmIChub3RpZnkpIHtcbiAgICAgIHRoaXMub25Db21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvbkJlZm9yZVVwbG9hZCgpOiBhbnkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBvblByb2dyZXNzKHByb2dyZXNzOiBudW1iZXIpOiBhbnkge1xuICAgIHJldHVybiB7IHByb2dyZXNzIH07XG4gIH1cblxuICBwdWJsaWMgb25TdWNjZXNzKGRhdGE6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHsgZGF0YSB9O1xuICB9XG5cbiAgcHVibGljIG9uRXJyb3IoZXJyb3I6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHsgZXJyb3IgfTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNhbmNlbCgpOiBhbnkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHB1YmxpYyBvbkNvbXBsZXRlKCk6IGFueSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0IHBlbmRpbmdVcGxvYWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmlzVXBsb2FkZWQgJiYgIXRoaXMuaXNVcGxvYWRpbmcgJiYgIXRoaXMuaXNDYW5jZWw7XG4gICB9XG5cbn1cbiJdfQ==