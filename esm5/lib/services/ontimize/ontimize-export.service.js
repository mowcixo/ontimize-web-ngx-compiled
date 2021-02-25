import * as tslib_1 from "tslib";
import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { OntimizeBaseService } from './ontimize-base-service.class';
var OntimizeExportService = (function (_super) {
    tslib_1.__extends(OntimizeExportService, _super);
    function OntimizeExportService(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.exportAll = false;
        return _this;
    }
    OntimizeExportService.prototype.configureService = function (config, modeAll) {
        if (modeAll === void 0) { modeAll = false; }
        _super.prototype.configureService.call(this, config);
        this.exportAll = modeAll;
        if (config.exportPath) {
            this.exportPath = config.exportPath;
        }
        if (config.downloadPath) {
            this.downloadPath = config.downloadPath;
        }
        if (config.path) {
            this.servicePath = config.path;
        }
    };
    OntimizeExportService.prototype.buildHeaders = function () {
        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + this._sessionid
        });
    };
    OntimizeExportService.prototype.exportData = function (data, format, entity) {
        var _this = this;
        var url = "" + this.urlBase + (this.exportPath ? this.exportPath : '') + this.servicePath + "/" + entity + "/" + format;
        var options = {
            headers: this.buildHeaders().append('Content-Type', 'application/json;charset=UTF-8'),
            observe: 'response'
        };
        var body = JSON.stringify(data);
        var dataObservable = new Observable(function (observer) {
            _this.httpClient.post(url, body, options).pipe(map(function (resData) { return _this.adapter.adapt(resData); })).subscribe(function (resp) {
                _this.parseSuccessfulExportDataResponse(format, resp, observer);
            }, function (error) {
                _this.parseUnsuccessfulResponse(error, observer);
            });
        });
        return dataObservable.pipe(share());
    };
    OntimizeExportService.prototype.parseSuccessfulExportDataResponse = function (format, resp, subscriber) {
        if (resp && resp.isUnauthorized()) {
            this.clientErrorFallback(401);
        }
        else if (resp && resp.isFailed()) {
            subscriber.error(resp.message);
        }
        else if (resp && resp.isSuccessful()) {
            this.downloadFile(resp.data[0][format + 'Id'], format)
                .subscribe(function (r) { return subscriber.next(r); }, function (e) { return subscriber.error(e); }, function () { return subscriber.complete(); });
        }
        else {
            subscriber.error('Service unavailable');
        }
    };
    OntimizeExportService.prototype.downloadFile = function (fileId, fileExtension) {
        var _this = this;
        var url = "" + this.urlBase + (this.downloadPath ? this.downloadPath : '') + this.servicePath + "/" + fileExtension + "/" + fileId;
        var options = {
            headers: this.buildHeaders(),
            observe: 'response',
            responseType: 'blob'
        };
        var dataObservable = new Observable(function (observer) {
            _this.httpClient.get(url, options).subscribe(function (resp) {
                var fileData = resp.body;
                var fileURL = URL.createObjectURL(fileData);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = fileId + '.' + fileExtension;
                a.click();
                document.body.removeChild(a);
                observer.next(fileData);
                URL.revokeObjectURL(fileURL);
            }, function (error) { return observer.error(error); }, function () { return observer.complete(); });
        });
        return dataObservable.pipe(share());
    };
    OntimizeExportService.decorators = [
        { type: Injectable }
    ];
    OntimizeExportService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OntimizeExportService;
}(OntimizeBaseService));
export { OntimizeExportService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtZXhwb3J0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL29udGltaXplL29udGltaXplLWV4cG9ydC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSzVDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRXBFO0lBQzJDLGlEQUFtQjtJQVM1RCwrQkFBc0IsUUFBa0I7UUFBeEMsWUFDRSxrQkFBTSxRQUFRLENBQUMsU0FDaEI7UUFGcUIsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQUY5QixlQUFTLEdBQVksS0FBSyxDQUFDOztJQUlyQyxDQUFDO0lBRU0sZ0RBQWdCLEdBQXZCLFVBQXdCLE1BQVcsRUFBRSxPQUFlO1FBQWYsd0JBQUEsRUFBQSxlQUFlO1FBQ2xELGlCQUFNLGdCQUFnQixZQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO1FBQ3pCLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7U0FDckM7UUFDRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO1NBQ3pDO1FBQ0QsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFN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QXJCLENBQXFCLEVBQ2pDLGNBQU0sT0FBQSxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQW5CLENBQW1CLENBQzFCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7O2dCQXhHRixVQUFVOzs7Z0JBVFUsUUFBUTs7SUFrSDdCLDRCQUFDO0NBQUEsQUF6R0QsQ0FDMkMsbUJBQW1CLEdBd0c3RDtTQXhHWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUsIEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJRXhwb3J0U2VydmljZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZXhwb3J0LXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNwb25zZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvc2VydmljZS1yZXNwb25zZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSHR0cFJlcXVlc3RPcHRpb25zIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgT250aW1pemVCYXNlU2VydmljZSB9IGZyb20gJy4vb250aW1pemUtYmFzZS1zZXJ2aWNlLmNsYXNzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9udGltaXplRXhwb3J0U2VydmljZSBleHRlbmRzIE9udGltaXplQmFzZVNlcnZpY2UgaW1wbGVtZW50cyBJRXhwb3J0U2VydmljZSB7XG5cbiAgcHVibGljIGV4cG9ydFBhdGg6IHN0cmluZztcbiAgcHVibGljIGRvd25sb2FkUGF0aDogc3RyaW5nO1xuICBwdWJsaWMgc2VydmljZVBhdGg6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgX3Nlc3Npb25pZDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgZXhwb3J0QWxsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3Rvcikge1xuICAgIHN1cGVyKGluamVjdG9yKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25maWd1cmVTZXJ2aWNlKGNvbmZpZzogYW55LCBtb2RlQWxsID0gZmFsc2UpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmVTZXJ2aWNlKGNvbmZpZyk7XG4gICAgdGhpcy5leHBvcnRBbGwgPSBtb2RlQWxsO1xuICAgIGlmIChjb25maWcuZXhwb3J0UGF0aCkge1xuICAgICAgdGhpcy5leHBvcnRQYXRoID0gY29uZmlnLmV4cG9ydFBhdGg7XG4gICAgfVxuICAgIGlmIChjb25maWcuZG93bmxvYWRQYXRoKSB7XG4gICAgICB0aGlzLmRvd25sb2FkUGF0aCA9IGNvbmZpZy5kb3dubG9hZFBhdGg7XG4gICAgfVxuICAgIGlmIChjb25maWcucGF0aCkge1xuICAgICAgdGhpcy5zZXJ2aWNlUGF0aCA9IGNvbmZpZy5wYXRoO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBidWlsZEhlYWRlcnMoKTogSHR0cEhlYWRlcnMge1xuICAgIHJldHVybiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRoaXMuX3Nlc3Npb25pZFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGV4cG9ydERhdGEoZGF0YTogYW55LCBmb3JtYXQ6IHN0cmluZywgZW50aXR5Pzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCB1cmwgPSBgJHt0aGlzLnVybEJhc2V9JHt0aGlzLmV4cG9ydFBhdGggPyB0aGlzLmV4cG9ydFBhdGggOiAnJ30ke3RoaXMuc2VydmljZVBhdGh9LyR7ZW50aXR5fS8ke2Zvcm1hdH1gO1xuXG4gICAgY29uc3Qgb3B0aW9uczogSHR0cFJlcXVlc3RPcHRpb25zID0ge1xuICAgICAgaGVhZGVyczogdGhpcy5idWlsZEhlYWRlcnMoKS5hcHBlbmQoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnKSxcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZSdcbiAgICB9O1xuXG4gICAgY29uc3QgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIC8vIFRPRE86IHRyeSBtdWx0aXBhcnRcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxTZXJ2aWNlUmVzcG9uc2U+ID0gbmV3IE9ic2VydmFibGUoKG9ic2VydmVyOiBTdWJzY3JpYmVyPFNlcnZpY2VSZXNwb25zZT4pID0+IHtcbiAgICAgIHRoaXMuaHR0cENsaWVudC5wb3N0PFNlcnZpY2VSZXNwb25zZT4odXJsLCBib2R5LCBvcHRpb25zKS5waXBlKFxuICAgICAgICBtYXAoKHJlc0RhdGE6IGFueSkgPT4gdGhpcy5hZGFwdGVyLmFkYXB0KHJlc0RhdGEpKVxuICAgICAgKS5zdWJzY3JpYmUocmVzcCA9PiB7XG4gICAgICAgIHRoaXMucGFyc2VTdWNjZXNzZnVsRXhwb3J0RGF0YVJlc3BvbnNlKGZvcm1hdCwgcmVzcCwgb2JzZXJ2ZXIpO1xuICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICB0aGlzLnBhcnNlVW5zdWNjZXNzZnVsUmVzcG9uc2UoZXJyb3IsIG9ic2VydmVyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlU3VjY2Vzc2Z1bEV4cG9ydERhdGFSZXNwb25zZShmb3JtYXQ6IHN0cmluZywgcmVzcDogU2VydmljZVJlc3BvbnNlLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFNlcnZpY2VSZXNwb25zZT4pIHtcbiAgICBpZiAocmVzcCAmJiByZXNwLmlzVW5hdXRob3JpemVkKCkpIHtcbiAgICAgIHRoaXMuY2xpZW50RXJyb3JGYWxsYmFjayg0MDEpO1xuICAgIH0gZWxzZSBpZiAocmVzcCAmJiByZXNwLmlzRmFpbGVkKCkpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IocmVzcC5tZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHJlc3AgJiYgcmVzcC5pc1N1Y2Nlc3NmdWwoKSkge1xuICAgICAgdGhpcy5kb3dubG9hZEZpbGUocmVzcC5kYXRhWzBdW2Zvcm1hdCArICdJZCddLCBmb3JtYXQpXG4gICAgICAgIC5zdWJzY3JpYmUoXG4gICAgICAgICAgciA9PiBzdWJzY3JpYmVyLm5leHQociksXG4gICAgICAgICAgZSA9PiBzdWJzY3JpYmVyLmVycm9yKGUpLFxuICAgICAgICAgICgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbmtub3cgc3RhdGUgLT4gZXJyb3JcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoJ1NlcnZpY2UgdW5hdmFpbGFibGUnKTtcbiAgICB9XG5cbiAgfVxuXG4gIHB1YmxpYyBkb3dubG9hZEZpbGUoZmlsZUlkOiBzdHJpbmcsIGZpbGVFeHRlbnNpb246IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy51cmxCYXNlfSR7dGhpcy5kb3dubG9hZFBhdGggPyB0aGlzLmRvd25sb2FkUGF0aCA6ICcnfSR7dGhpcy5zZXJ2aWNlUGF0aH0vJHtmaWxlRXh0ZW5zaW9ufS8ke2ZpbGVJZH1gO1xuXG4gICAgY29uc3Qgb3B0aW9uczogYW55ID0ge1xuICAgICAgaGVhZGVyczogdGhpcy5idWlsZEhlYWRlcnMoKSxcbiAgICAgIG9ic2VydmU6ICdyZXNwb25zZScsXG4gICAgICByZXNwb25zZVR5cGU6ICdibG9iJ1xuICAgIH07XG5cbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcbiAgICAgIC8vIC5tYXAoKHJlczogYW55KSA9PiBuZXcgQmxvYihbcmVzLmJsb2IoKV0sIHsgdHlwZTogcmVzcG9uc2VUeXBlIH0pKVxuICAgICAgdGhpcy5odHRwQ2xpZW50LmdldCh1cmwsIG9wdGlvbnMpLnN1YnNjcmliZShcbiAgICAgICAgKHJlc3A6IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGVEYXRhID0gcmVzcC5ib2R5O1xuICAgICAgICAgIGNvbnN0IGZpbGVVUkwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVEYXRhKTtcbiAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgICAgICAgYS5ocmVmID0gZmlsZVVSTDtcbiAgICAgICAgICBhLmRvd25sb2FkID0gZmlsZUlkICsgJy4nICsgZmlsZUV4dGVuc2lvbjtcbiAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KGZpbGVEYXRhKTtcbiAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGZpbGVVUkwpO1xuICAgICAgICB9LCBlcnJvciA9PiBvYnNlcnZlci5lcnJvcihlcnJvciksXG4gICAgICAgICgpID0+IG9ic2VydmVyLmNvbXBsZXRlKClcbiAgICAgICk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGRhdGFPYnNlcnZhYmxlLnBpcGUoc2hhcmUoKSk7XG4gIH1cbn1cbiJdfQ==