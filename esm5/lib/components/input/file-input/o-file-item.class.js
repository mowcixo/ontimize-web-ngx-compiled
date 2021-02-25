var OFileItem = (function () {
    function OFileItem(file, uploader) {
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
    OFileItem.prototype.upload = function () {
        this.uploader.uploadItem(this);
    };
    OFileItem.prototype.cancel = function () {
        this.uploader.cancelItem(this);
    };
    OFileItem.prototype.remove = function () {
        this.uploader.removeFile(this);
    };
    OFileItem.prototype.prepareToUpload = function () {
        this.index = this.index || ++this.uploader.nextIndex;
        this.isReady = true;
    };
    Object.defineProperty(OFileItem.prototype, "file", {
        get: function () {
            return this._file;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFileItem.prototype, "name", {
        get: function () {
            return this._file.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFileItem.prototype, "size", {
        get: function () {
            return this._file.size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFileItem.prototype, "type", {
        get: function () {
            return this._file.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFileItem.prototype, "lastModifiedDate", {
        get: function () {
            return this._file.lastModified;
        },
        enumerable: true,
        configurable: true
    });
    OFileItem.prototype._onBeforeUpload = function (notify) {
        if (notify === void 0) { notify = true; }
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
    };
    OFileItem.prototype._onProgress = function (progress) {
        this.progress = progress;
        this.onProgress(progress);
    };
    OFileItem.prototype._onSuccess = function (data, notify) {
        if (notify === void 0) { notify = true; }
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
    };
    OFileItem.prototype._onError = function (error, notify) {
        if (notify === void 0) { notify = true; }
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
    };
    OFileItem.prototype._onCancel = function (notify) {
        if (notify === void 0) { notify = true; }
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
    };
    OFileItem.prototype._onComplete = function (notify) {
        if (notify === void 0) { notify = true; }
        if (notify) {
            this.onComplete();
        }
    };
    OFileItem.prototype.onBeforeUpload = function () {
        return {};
    };
    OFileItem.prototype.onProgress = function (progress) {
        return { progress: progress };
    };
    OFileItem.prototype.onSuccess = function (data) {
        return { data: data };
    };
    OFileItem.prototype.onError = function (error) {
        return { error: error };
    };
    OFileItem.prototype.onCancel = function () {
        return {};
    };
    OFileItem.prototype.onComplete = function () {
        return {};
    };
    Object.defineProperty(OFileItem.prototype, "pendingUpload", {
        get: function () {
            return !this.isUploaded && !this.isUploading && !this.isCancel;
        },
        enumerable: true,
        configurable: true
    });
    return OFileItem;
}());
export { OFileItem };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1maWxlLWl0ZW0uY2xhc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW5wdXQvZmlsZS1pbnB1dC9vLWZpbGUtaXRlbS5jbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtJQWVFLG1CQUFZLElBQVUsRUFBRSxRQUF1QjtRQWJ4QyxVQUFLLEdBQVcsS0FBSyxDQUFDLENBQUM7UUFDdkIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFPMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLDBCQUFNLEdBQWI7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU0sMEJBQU0sR0FBYjtRQUNFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTSwwQkFBTSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVNLG1DQUFlLEdBQXRCO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7UUFDckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELHNCQUFJLDJCQUFJO2FBQVI7WUFD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LElBQUksQ0FBQyxRQUFRLENBQUM7UUFDaEUsQ0FBQzs7O09BQUE7SUFFSixnQkFBQztBQUFELENBQUMsQUF2SkQsSUF1SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT0ZpbGVVcGxvYWRlciB9IGZyb20gJy4vby1maWxlLXVwbG9hZGVyLmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIE9GaWxlSXRlbSB7XG5cbiAgcHVibGljIGluZGV4OiBudW1iZXIgPSB2b2lkIDA7XG4gIHB1YmxpYyBpc1JlYWR5OiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpc1VwbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNVcGxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNTdWNjZXNzOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBpc0NhbmNlbDogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNFcnJvcjogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBfdXBsb2FkU3VzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBwcm90ZWN0ZWQgdXBsb2FkZXI6IE9GaWxlVXBsb2FkZXI7XG4gIHByb3RlY3RlZCBfZmlsZTogRmlsZTtcblxuICBjb25zdHJ1Y3RvcihmaWxlOiBGaWxlLCB1cGxvYWRlcjogT0ZpbGVVcGxvYWRlcikge1xuICAgIHRoaXMuX2ZpbGUgPSBmaWxlO1xuICAgIHRoaXMudXBsb2FkZXIgPSB1cGxvYWRlcjtcbiAgfVxuXG4gIHB1YmxpYyB1cGxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy51cGxvYWRlci51cGxvYWRJdGVtKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIGNhbmNlbCgpOiB2b2lkIHtcbiAgICB0aGlzLnVwbG9hZGVyLmNhbmNlbEl0ZW0odGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMudXBsb2FkZXIucmVtb3ZlRmlsZSh0aGlzKTtcbiAgfVxuXG4gIHB1YmxpYyBwcmVwYXJlVG9VcGxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggfHwgKyt0aGlzLnVwbG9hZGVyLm5leHRJbmRleDtcbiAgICB0aGlzLmlzUmVhZHkgPSB0cnVlO1xuICB9XG5cbiAgZ2V0IGZpbGUoKTogRmlsZSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpbGU7XG4gIH1cblxuICBnZXQgbmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9maWxlLm5hbWU7XG4gIH1cblxuICBnZXQgc2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9maWxlLnNpemU7XG4gIH1cblxuICBnZXQgdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9maWxlLnR5cGU7XG4gIH1cblxuICBnZXQgbGFzdE1vZGlmaWVkRGF0ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9maWxlLmxhc3RNb2RpZmllZDtcbiAgfVxuXG4gIHB1YmxpYyBfb25CZWZvcmVVcGxvYWQobm90aWZ5OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuaXNSZWFkeSA9IHRydWU7XG4gICAgdGhpcy5pc1VwbG9hZGluZyA9IHRydWU7XG4gICAgdGhpcy5pc1VwbG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc1N1Y2Nlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmlzQ2FuY2VsID0gZmFsc2U7XG4gICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gICAgaWYgKG5vdGlmeSkge1xuICAgICAgdGhpcy5vbkJlZm9yZVVwbG9hZCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfb25Qcm9ncmVzcyhwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgIHRoaXMub25Qcm9ncmVzcyhwcm9ncmVzcyk7XG4gIH1cblxuICBwdWJsaWMgX29uU3VjY2VzcyhkYXRhOiBhbnksIG5vdGlmeTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmluZGV4ID0gdm9pZCAwO1xuICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkZWQgPSB0cnVlO1xuICAgIHRoaXMuaXNTdWNjZXNzID0gdHJ1ZTtcbiAgICB0aGlzLmlzQ2FuY2VsID0gZmFsc2U7XG4gICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICBpZiAobm90aWZ5KSB7XG4gICAgICB0aGlzLm9uU3VjY2VzcyhkYXRhKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX29uRXJyb3IoZXJyb3I6IGFueSwgbm90aWZ5OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuaW5kZXggPSB2b2lkIDA7XG4gICAgdGhpcy5pc1JlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5pc1VwbG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuaXNVcGxvYWRlZCA9IHRydWU7XG4gICAgdGhpcy5pc1N1Y2Nlc3MgPSBmYWxzZTtcbiAgICB0aGlzLmlzQ2FuY2VsID0gZmFsc2U7XG4gICAgdGhpcy5pc0Vycm9yID0gdHJ1ZTtcbiAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgICBpZiAobm90aWZ5KSB7XG4gICAgICB0aGlzLm9uRXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfb25DYW5jZWwobm90aWZ5OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMuaXNSZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuaXNVcGxvYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmlzVXBsb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLmlzU3VjY2VzcyA9IGZhbHNlO1xuICAgIHRoaXMuaXNDYW5jZWwgPSB0cnVlO1xuICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICAgIHRoaXMuaW5kZXggPSB2b2lkIDA7XG4gICAgaWYgKG5vdGlmeSkge1xuICAgICAgdGhpcy5vbkNhbmNlbCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBfb25Db21wbGV0ZShub3RpZnk6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKG5vdGlmeSkge1xuICAgICAgdGhpcy5vbkNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQmVmb3JlVXBsb2FkKCk6IGFueSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHVibGljIG9uUHJvZ3Jlc3MocHJvZ3Jlc3M6IG51bWJlcik6IGFueSB7XG4gICAgcmV0dXJuIHsgcHJvZ3Jlc3MgfTtcbiAgfVxuXG4gIHB1YmxpYyBvblN1Y2Nlc3MoZGF0YTogYW55KTogYW55IHtcbiAgICByZXR1cm4geyBkYXRhIH07XG4gIH1cblxuICBwdWJsaWMgb25FcnJvcihlcnJvcjogYW55KTogYW55IHtcbiAgICByZXR1cm4geyBlcnJvciB9O1xuICB9XG5cbiAgcHVibGljIG9uQ2FuY2VsKCk6IGFueSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcHVibGljIG9uQ29tcGxldGUoKTogYW55IHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBnZXQgcGVuZGluZ1VwbG9hZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuaXNVcGxvYWRlZCAmJiAhdGhpcy5pc1VwbG9hZGluZyAmJiAhdGhpcy5pc0NhbmNlbDtcbiAgIH1cblxufVxuIl19