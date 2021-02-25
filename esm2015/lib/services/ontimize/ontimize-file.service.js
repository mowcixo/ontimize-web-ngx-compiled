import { HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { OntimizeBaseService } from './ontimize-base-service.class';
export class OntimizeFileService extends OntimizeBaseService {
    constructor() {
        super(...arguments);
        this.path = '';
    }
    configureService(config) {
        super.configureService(config);
        this.path = config.path;
    }
    upload(files, entity, data) {
        const dataObservable = new Observable(observer => {
            const url = `${this.urlBase}${this.path}/${entity}`;
            const toUpload = new FormData();
            files.forEach(item => {
                item.prepareToUpload();
                item.isUploading = true;
                toUpload.append('name', item.name);
                toUpload.append('file', item.file);
            });
            if (data) {
                toUpload.append('data', JSON.stringify(data));
            }
            const request = new HttpRequest('POST', url, toUpload, {
                headers: this.buildHeaders(),
                reportProgress: true
            });
            this.httpClient.request(request).subscribe(resp => {
                if (HttpEventType.UploadProgress === resp.type) {
                    const progressData = {
                        loaded: resp.loaded,
                        total: resp.total
                    };
                    observer.next(progressData);
                }
                else if (HttpEventType.Response === resp.type) {
                    if (resp.body) {
                        if (resp.body['code'] === 3) {
                            this.redirectLogin(true);
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
            }, error => {
                console.error(error);
                if (error.status === 401) {
                    this.redirectLogin(true);
                }
                else {
                    observer.error(error);
                }
            }, () => observer.complete());
        });
        return dataObservable.pipe(share());
    }
    buildHeaders() {
        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            Authorization: 'Bearer ' + this._sessionid
        });
    }
}
OntimizeFileService.decorators = [
    { type: Injectable }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtZmlsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS1maWxlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0UsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUd2QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUdwRSxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsbUJBQW1CO0lBRDVEOztRQUdTLFNBQUksR0FBVyxFQUFFLENBQUM7SUFtRjNCLENBQUM7SUFqRlEsZ0JBQWdCLENBQUMsTUFBVztRQUNqQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQzFCLENBQUM7SUFRTSxNQUFNLENBQUMsS0FBWSxFQUFFLE1BQWMsRUFBRSxJQUFhO1FBRXZELE1BQU0sY0FBYyxHQUFHLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBRS9DLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBRXBELE1BQU0sUUFBUSxHQUFRLElBQUksUUFBUSxFQUFFLENBQUM7WUFDckMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN2QixJQUFJ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ZXJzLCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHNoYXJlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBJRmlsZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2ZpbGUtc2VydmljZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT250aW1pemVCYXNlU2VydmljZSB9IGZyb20gJy4vb250aW1pemUtYmFzZS1zZXJ2aWNlLmNsYXNzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9udGltaXplRmlsZVNlcnZpY2UgZXh0ZW5kcyBPbnRpbWl6ZUJhc2VTZXJ2aWNlIGltcGxlbWVudHMgSUZpbGVTZXJ2aWNlIHtcblxuICBwdWJsaWMgcGF0aDogc3RyaW5nID0gJyc7XG5cbiAgcHVibGljIGNvbmZpZ3VyZVNlcnZpY2UoY29uZmlnOiBhbnkpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmVTZXJ2aWNlKGNvbmZpZyk7XG4gICAgdGhpcy5wYXRoID0gY29uZmlnLnBhdGg7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgZmlsZS9zIHVwbG9hZCByZXF1ZXN0L3NcbiAgICpcbiAgICogQHBhcmFtIGZpbGVzIHRoZSBhcnJheSBvZiBmaWxlcyB0byB1cGxvYWRcbiAgICogQHBhcmFtIGVudGl0eSB0aGUgZW50aXR5XG4gICAqL1xuICBwdWJsaWMgdXBsb2FkKGZpbGVzOiBhbnlbXSwgZW50aXR5OiBzdHJpbmcsIGRhdGE/OiBvYmplY3QpOiBPYnNlcnZhYmxlPGFueT4ge1xuXG4gICAgY29uc3QgZGF0YU9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XG5cbiAgICAgIGNvbnN0IHVybCA9IGAke3RoaXMudXJsQmFzZX0ke3RoaXMucGF0aH0vJHtlbnRpdHl9YDtcblxuICAgICAgY29uc3QgdG9VcGxvYWQ6IGFueSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgZmlsZXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5wcmVwYXJlVG9VcGxvYWQoKTtcbiAgICAgICAgaXRlbS5pc1VwbG9hZGluZyA9IHRydWU7XG4gICAgICAgIHRvVXBsb2FkLmFwcGVuZCgnbmFtZScsIGl0ZW0ubmFtZSk7XG4gICAgICAgIHRvVXBsb2FkLmFwcGVuZCgnZmlsZScsIGl0ZW0uZmlsZSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgdG9VcGxvYWQuYXBwZW5kKCdkYXRhJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IEh0dHBSZXF1ZXN0KCdQT1NUJywgdXJsLCB0b1VwbG9hZCwge1xuICAgICAgICBoZWFkZXJzOiB0aGlzLmJ1aWxkSGVhZGVycygpLFxuICAgICAgICByZXBvcnRQcm9ncmVzczogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuaHR0cENsaWVudC5yZXF1ZXN0KHJlcXVlc3QpLnN1YnNjcmliZShyZXNwID0+IHtcbiAgICAgICAgaWYgKEh0dHBFdmVudFR5cGUuVXBsb2FkUHJvZ3Jlc3MgPT09IHJlc3AudHlwZSkge1xuICAgICAgICAgIC8vIFVwbG9hZCBwcm9ncmVzcyBldmVudCByZWNlaXZlZFxuICAgICAgICAgIGNvbnN0IHByb2dyZXNzRGF0YSA9IHtcbiAgICAgICAgICAgIGxvYWRlZDogcmVzcC5sb2FkZWQsXG4gICAgICAgICAgICB0b3RhbDogcmVzcC50b3RhbFxuICAgICAgICAgIH07XG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChwcm9ncmVzc0RhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKEh0dHBFdmVudFR5cGUuUmVzcG9uc2UgPT09IHJlc3AudHlwZSkge1xuICAgICAgICAgIC8vIEZ1bGwgcmVzcG9uc2UgcmVjZWl2ZWRcbiAgICAgICAgICBpZiAocmVzcC5ib2R5KSB7XG4gICAgICAgICAgICBpZiAocmVzcC5ib2R5Wydjb2RlJ10gPT09IDMpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZWRpcmVjdExvZ2luKHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXNwLmJvZHlbJ2NvZGUnXSA9PT0gMSkge1xuICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihyZXNwLmJvZHlbJ21lc3NhZ2UnXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3AuYm9keVsnY29kZSddID09PSAwKSB7XG4gICAgICAgICAgICAgIC8vIFJFU1BPTlNFXG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQocmVzcC5ib2R5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFVua25vdyBzdGF0ZSAtPiBlcnJvclxuICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcignU2VydmljZSB1bmF2YWlsYWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3AuYm9keSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09PSA0MDEpIHtcbiAgICAgICAgICB0aGlzLnJlZGlyZWN0TG9naW4odHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgICAoKSA9PiBvYnNlcnZlci5jb21wbGV0ZSgpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YU9ic2VydmFibGUucGlwZShzaGFyZSgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBidWlsZEhlYWRlcnMoKTogSHR0cEhlYWRlcnMge1xuICAgIHJldHVybiBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRoaXMuX3Nlc3Npb25pZFxuICAgIH0pO1xuICB9XG5cblxufVxuIl19