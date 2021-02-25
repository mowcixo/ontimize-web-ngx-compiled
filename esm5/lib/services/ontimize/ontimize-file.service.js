import * as tslib_1 from "tslib";
import { HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { OntimizeBaseService } from './ontimize-base-service.class';
var OntimizeFileService = (function (_super) {
    tslib_1.__extends(OntimizeFileService, _super);
    function OntimizeFileService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.path = '';
        return _this;
    }
    OntimizeFileService.prototype.configureService = function (config) {
        _super.prototype.configureService.call(this, config);
        this.path = config.path;
    };
    OntimizeFileService.prototype.upload = function (files, entity, data) {
        var _this = this;
        var dataObservable = new Observable(function (observer) {
            var url = "" + _this.urlBase + _this.path + "/" + entity;
            var toUpload = new FormData();
            files.forEach(function (item) {
                item.prepareToUpload();
                item.isUploading = true;
                toUpload.append('name', item.name);
                toUpload.append('file', item.file);
            });
            if (data) {
                toUpload.append('data', JSON.stringify(data));
            }
            var request = new HttpRequest('POST', url, toUpload, {
                headers: _this.buildHeaders(),
                reportProgress: true
            });
            _this.httpClient.request(request).subscribe(function (resp) {
                if (HttpEventType.UploadProgress === resp.type) {
                    var progressData = {
                        loaded: resp.loaded,
                        total: resp.total
                    };
                    observer.next(progressData);
                }
                else if (HttpEventType.Response === resp.type) {
                    if (resp.body) {
                        if (resp.body['code'] === 3) {
                            _this.redirectLogin(true);
                        }
                        else if (resp.body['code'] === 1) {
                            observer.error(resp.body['message']);
                        }
                        else if (resp.body['code'] === 0) {
                            observer.next(resp.body);
                        }
                        else {
                            observer.error('Service unavailable');
                        }
                    }
                    else {
                        observer.next(resp.body);
                    }
                }
            }, function (error) {
                console.error(error);
                if (error.status === 401) {
                    _this.redirectLogin(true);
                }
                else {
                    observer.error(error);
                }
            }, function () { return observer.complete(); });
        });
        return dataObservable.pipe(share());
    };
    OntimizeFileService.prototype.buildHeaders = function () {
        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + this._sessionid
        });
    };
    OntimizeFileService.decorators = [
        { type: Injectable }
    ];
    return OntimizeFileService;
}(OntimizeBaseService));
export { OntimizeFileService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtZmlsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS1maWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHdkMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFFcEU7SUFDeUMsK0NBQW1CO0lBRDVEO1FBQUEscUVBc0ZDO1FBbkZRLFVBQUksR0FBVyxFQUFFLENBQUM7O0lBbUYzQixDQUFDO0lBakZRLDhDQUFnQixHQUF2QixVQUF3QixNQUFXO1FBQ2pDLGlCQUFNLGdCQUFnQixZQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUMxQixDQUFDO0lBUU0sb0NBQU0sR0FBYixVQUFjLEtBQVksRUFBRSxNQUFjLEVBQUUsSUFBYTtRQUF6RCxpQkE0REM7UUExREMsSUFBTSxjQUFjLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBQSxRQUFRO1lBRTVDLElBQU0sR0FBRyxHQUFHLEtBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsSUFBSSxTQUFJLE1BQVEsQ0FBQztZQUVwRCxJQUFNLFFBQVEsR0FBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2dCQUNoQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3ZC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U0FyRlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEV2ZW50VHlwZSwgSHR0cEhlYWRlcnMsIEh0dHBSZXF1ZXN0IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IElGaWxlU2VydmljZSB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvZmlsZS1zZXJ2aWNlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBPbnRpbWl6ZUJhc2VTZXJ2aWNlIH0gZnJvbSAnLi9vbnRpbWl6ZS1iYXNlLXNlcnZpY2UuY2xhc3MnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgT250aW1pemVGaWxlU2VydmljZSBleHRlbmRzIE9udGltaXplQmFzZVNlcnZpY2UgaW1wbGVtZW50cyBJRmlsZVNlcnZpY2Uge1xuXG4gIHB1YmxpYyBwYXRoOiBzdHJpbmcgPSAnJztcblxuICBwdWJsaWMgY29uZmlndXJlU2VydmljZShjb25maWc6IGFueSk6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZVNlcnZpY2UoY29uZmlnKTtcbiAgICB0aGlzLnBhdGggPSBjb25maWcucGF0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBmaWxlL3MgdXBsb2FkIHJlcXVlc3Qvc1xuICAgKlxuICAgKiBAcGFyYW0gZmlsZXMgdGhlIGFycmF5IG9mIGZpbGVzIHRvIHVwbG9hZFxuICAgKiBAcGFyYW0gZW50aXR5IHRoZSBlbnRpdHlcbiAgICovXG4gIHB1YmxpYyB1cGxvYWQoZmlsZXM6IGFueVtdLCBlbnRpdHk6IHN0cmluZywgZGF0YT86IG9iamVjdCk6IE9ic2VydmFibGU8YW55PiB7XG5cbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcblxuICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy51cmxCYXNlfSR7dGhpcy5wYXRofS8ke2VudGl0eX1gO1xuXG4gICAgICBjb25zdCB0b1VwbG9hZDogYW55ID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBmaWxlcy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBpdGVtLnByZXBhcmVUb1VwbG9hZCgpO1xuICAgICAgICBpdGVtLmlzVXBsb2FkaW5nID0gdHJ1ZTtcbiAgICAgICAgdG9VcGxvYWQuYXBwZW5kKCduYW1lJywgaXRlbS5uYW1lKTtcbiAgICAgICAgdG9VcGxvYWQuYXBwZW5kKCdmaWxlJywgaXRlbS5maWxlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICB0b1VwbG9hZC5hcHBlbmQoJ2RhdGEnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgSHR0cFJlcXVlc3QoJ1BPU1QnLCB1cmwsIHRvVXBsb2FkLCB7XG4gICAgICAgIGhlYWRlcnM6IHRoaXMuYnVpbGRIZWFkZXJzKCksXG4gICAgICAgIHJlcG9ydFByb2dyZXNzOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5odHRwQ2xpZW50LnJlcXVlc3QocmVxdWVzdCkuc3Vic2NyaWJlKHJlc3AgPT4ge1xuICAgICAgICBpZiAoSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzcyA9PT0gcmVzcC50eXBlKSB7XG4gICAgICAgICAgLy8gVXBsb2FkIHByb2dyZXNzIGV2ZW50IHJlY2VpdmVkXG4gICAgICAgICAgY29uc3QgcHJvZ3Jlc3NEYXRhID0ge1xuICAgICAgICAgICAgbG9hZGVkOiByZXNwLmxvYWRlZCxcbiAgICAgICAgICAgIHRvdGFsOiByZXNwLnRvdGFsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHByb2dyZXNzRGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAoSHR0cEV2ZW50VHlwZS5SZXNwb25zZSA9PT0gcmVzcC50eXBlKSB7XG4gICAgICAgICAgLy8gRnVsbCByZXNwb25zZSByZWNlaXZlZFxuICAgICAgICAgIGlmIChyZXNwLmJvZHkpIHtcbiAgICAgICAgICAgIGlmIChyZXNwLmJvZHlbJ2NvZGUnXSA9PT0gMykge1xuICAgICAgICAgICAgICB0aGlzLnJlZGlyZWN0TG9naW4odHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3AuYm9keVsnY29kZSddID09PSAxKSB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKHJlc3AuYm9keVsnbWVzc2FnZSddKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcC5ib2R5Wydjb2RlJ10gPT09IDApIHtcbiAgICAgICAgICAgICAgLy8gUkVTUE9OU0VcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwLmJvZHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gVW5rbm93IHN0YXRlIC0+IGVycm9yXG4gICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKCdTZXJ2aWNlIHVuYXZhaWxhYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcC5ib2R5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgIHRoaXMucmVkaXJlY3RMb2dpbih0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAgICgpID0+IG9ic2VydmVyLmNvbXBsZXRlKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkSGVhZGVycygpOiBIdHRwSGVhZGVycyB7XG4gICAgcmV0dXJuIG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdGhpcy5fc2Vzc2lvbmlkXG4gICAgfSk7XG4gIH1cblxuXG59XG4iXX0=