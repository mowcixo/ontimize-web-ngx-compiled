import * as tslib_1 from "tslib";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { combineLatest, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';
import { Codes } from '../../util/codes';
import { OTranslateService } from './o-translate.service';
var OTranslateHttpLoader = (function (_super) {
    tslib_1.__extends(OTranslateHttpLoader, _super);
    function OTranslateHttpLoader(httpClient, prefix, suffix, injector) {
        if (prefix === void 0) { prefix = OTranslateService.ASSETS_PATH; }
        if (suffix === void 0) { suffix = OTranslateService.ASSETS_EXTENSION; }
        var _this = _super.call(this, httpClient, prefix, suffix) || this;
        _this.injector = injector;
        _this.appConfig = _this.injector.get(AppConfig);
        _this.httpClient = httpClient;
        return _this;
    }
    OTranslateHttpLoader.prototype.getAssetsPath = function () {
        return this.prefix;
    };
    OTranslateHttpLoader.prototype.getAssetsExtension = function () {
        return this.suffix;
    };
    OTranslateHttpLoader.prototype.getLocalTranslation = function (lang) {
        var innerObserver;
        var dataObservable = new Observable(function (observer) { return innerObserver = observer; }).pipe(share());
        _super.prototype.getTranslation.call(this, lang)
            .subscribe(function (res) {
            innerObserver.next(res);
            innerObserver.complete();
        }, function (error) {
            innerObserver.next(undefined);
        }, function () { return innerObserver.complete(); });
        return dataObservable;
    };
    OTranslateHttpLoader.prototype.getTranslation = function (lang) {
        var translationOrigins = [];
        translationOrigins.push(this.getLocalTranslation(lang));
        if (this.appConfig.useRemoteBundle()) {
            translationOrigins.push(this.getRemoteBundle(lang));
        }
        var innerObserver;
        var dataObservable = new Observable(function (observer) { return innerObserver = observer; }).pipe(share());
        combineLatest(translationOrigins).subscribe(function (res) {
            var staticBundle = res[0] || {};
            var remoteBundle = res[1] || {};
            var allBundles = Object.assign(staticBundle, remoteBundle);
            innerObserver.next(allBundles);
        });
        return dataObservable;
    };
    OTranslateHttpLoader.prototype.getRemoteBundle = function (lang) {
        var _this = this;
        var bundleEndpoint = this.appConfig.getBundleEndpoint();
        var innerObserver;
        var dataObservable = new Observable(function (observer) { return innerObserver = observer; }).pipe(share());
        if (!bundleEndpoint) {
            innerObserver.next([]);
        }
        var url = bundleEndpoint + '?lang=' + lang;
        this.httpClient.get(url).subscribe(function (resp) {
            var response = {};
            if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
                response = _this.parseBundleResponse(resp.data);
            }
            innerObserver.next(response);
        }, function (error) {
            console.log('Remote Bundle service is not available');
            innerObserver.next(error);
        }, function () { return innerObserver.complete(); });
        return dataObservable;
    };
    OTranslateHttpLoader.prototype.parseBundleResponse = function (data) {
        var result = {};
        data.forEach(function (item) {
            result[item[OTranslateHttpLoader.BUNDLE_KEY]] = item[OTranslateHttpLoader.BUNDLE_VALUE];
        });
        return result;
    };
    OTranslateHttpLoader.BUNDLE_KEY = 'key';
    OTranslateHttpLoader.BUNDLE_VALUE = 'value';
    return OTranslateHttpLoader;
}(TranslateHttpLoader));
export { OTranslateHttpLoader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10cmFuc2xhdGUtaHR0cC1sb2FkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS1odHRwLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDakUsT0FBTyxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQ7SUFBMEMsZ0RBQW1CO0lBUTNELDhCQUNFLFVBQXNCLEVBQ3RCLE1BQThDLEVBQzlDLE1BQW1ELEVBQ3pDLFFBQWtCO1FBRjVCLHVCQUFBLEVBQUEsU0FBaUIsaUJBQWlCLENBQUMsV0FBVztRQUM5Qyx1QkFBQSxFQUFBLFNBQWlCLGlCQUFpQixDQUFDLGdCQUFnQjtRQUhyRCxZQU1FLGtCQUFNLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBR2xDO1FBTFcsY0FBUSxHQUFSLFFBQVEsQ0FBVTtRQUc1QixLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLEtBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztJQUMvQixDQUFDO0lBRUQsNENBQWEsR0FBYjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsaURBQWtCLEdBQWxCO1FBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFD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QUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQ0MsVUFBQSxLQUFLO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3RELGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxFQUNELGNBQU0sT0FBQSxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQXhCLENBQXdCLENBQy9CLENBQUM7UUFFRixPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRVMsa0RBQW1CLEdBQTdCLFVBQThCLElBQVc7UUFDdkMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO1lBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUYsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBNUZNLCtCQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ25CLGlDQUFZLEdBQUcsT0FBTyxDQUFDO0lBNEZoQywyQkFBQztDQUFBLEFBL0ZELENBQTBDLG1CQUFtQixHQStGNUQ7U0EvRlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUcmFuc2xhdGVIdHRwTG9hZGVyIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvaHR0cC1sb2FkZXInO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IENvZGVzIH0gZnJvbSAnLi4vLi4vdXRpbC9jb2Rlcyc7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4vby10cmFuc2xhdGUuc2VydmljZSc7XG5cbmV4cG9ydCBjbGFzcyBPVHJhbnNsYXRlSHR0cExvYWRlciBleHRlbmRzIFRyYW5zbGF0ZUh0dHBMb2FkZXIge1xuXG4gIHN0YXRpYyBCVU5ETEVfS0VZID0gJ2tleSc7XG4gIHN0YXRpYyBCVU5ETEVfVkFMVUUgPSAndmFsdWUnO1xuXG4gIHByb3RlY3RlZCBhcHBDb25maWc6IEFwcENvbmZpZztcbiAgcHJvdGVjdGVkIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgaHR0cENsaWVudDogSHR0cENsaWVudCxcbiAgICBwcmVmaXg6IHN0cmluZyA9IE9UcmFuc2xhdGVTZXJ2aWNlLkFTU0VUU19QQVRILFxuICAgIHN1ZmZpeDogc3RyaW5nID0gT1RyYW5zbGF0ZVNlcnZpY2UuQVNTRVRTX0VYVEVOU0lPTixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHN1cGVyKGh0dHBDbGllbnQsIHByZWZpeCwgc3VmZml4KTtcbiAgICB0aGlzLmFwcENvbmZpZyA9IHRoaXMuaW5qZWN0b3IuZ2V0KEFwcENvbmZpZyk7XG4gICAgdGhpcy5odHRwQ2xpZW50ID0gaHR0cENsaWVudDtcbiAgfVxuXG4gIGdldEFzc2V0c1BhdGgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5wcmVmaXg7XG4gIH1cblxuICBnZXRBc3NldHNFeHRlbnNpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zdWZmaXg7XG4gIH1cblxuICBnZXRMb2NhbFRyYW5zbGF0aW9uKGxhbmc6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgbGV0IGlubmVyT2JzZXJ2ZXI6IGFueTtcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IGlubmVyT2JzZXJ2ZXIgPSBvYnNlcnZlcikucGlwZShzaGFyZSgpKTtcbiAgICBzdXBlci5nZXRUcmFuc2xhdGlvbihsYW5nKVxuICAgICAgLnN1YnNjcmliZSgocmVzKSA9PiB7XG4gICAgICAgIGlubmVyT2JzZXJ2ZXIubmV4dChyZXMpO1xuICAgICAgICBpbm5lck9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIGlubmVyT2JzZXJ2ZXIubmV4dCh1bmRlZmluZWQpO1xuICAgICAgfSxcbiAgICAgICAgKCkgPT4gaW5uZXJPYnNlcnZlci5jb21wbGV0ZSgpKTtcbiAgICByZXR1cm4gZGF0YU9ic2VydmFibGU7XG4gIH1cblxuICBnZXRUcmFuc2xhdGlvbihsYW5nOiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IHRyYW5zbGF0aW9uT3JpZ2luczogYW55W10gPSBbXTtcblxuICAgIHRyYW5zbGF0aW9uT3JpZ2lucy5wdXNoKHRoaXMuZ2V0TG9jYWxUcmFuc2xhdGlvbihsYW5nKSk7XG5cbiAgICBpZiAodGhpcy5hcHBDb25maWcudXNlUmVtb3RlQnVuZGxlKCkpIHtcbiAgICAgIHRyYW5zbGF0aW9uT3JpZ2lucy5wdXNoKHRoaXMuZ2V0UmVtb3RlQnVuZGxlKGxhbmcpKTtcbiAgICB9XG5cbiAgICBsZXQgaW5uZXJPYnNlcnZlcjogYW55O1xuICAgIGNvbnN0IGRhdGFPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4gaW5uZXJPYnNlcnZlciA9IG9ic2VydmVyKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgY29tYmluZUxhdGVzdCh0cmFuc2xhdGlvbk9yaWdpbnMpLnN1YnNjcmliZSgocmVzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3Qgc3RhdGljQnVuZGxlID0gcmVzWzBdIHx8IHt9O1xuICAgICAgY29uc3QgcmVtb3RlQnVuZGxlID0gcmVzWzFdIHx8IHt9O1xuICAgICAgY29uc3QgYWxsQnVuZGxlcyA9IE9iamVjdC5hc3NpZ24oc3RhdGljQnVuZGxlLCByZW1vdGVCdW5kbGUpO1xuICAgICAgaW5uZXJPYnNlcnZlci5uZXh0KGFsbEJ1bmRsZXMpO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZTtcbiAgfVxuXG4gIGdldFJlbW90ZUJ1bmRsZShsYW5nOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IGJ1bmRsZUVuZHBvaW50ID0gdGhpcy5hcHBDb25maWcuZ2V0QnVuZGxlRW5kcG9pbnQoKTtcbiAgICBsZXQgaW5uZXJPYnNlcnZlcjogYW55O1xuICAgIGNvbnN0IGRhdGFPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4gaW5uZXJPYnNlcnZlciA9IG9ic2VydmVyKS5waXBlKHNoYXJlKCkpO1xuICAgIGlmICghYnVuZGxlRW5kcG9pbnQpIHtcbiAgICAgIGlubmVyT2JzZXJ2ZXIubmV4dChbXSk7XG4gICAgfVxuICAgIGNvbnN0IHVybCA9IGJ1bmRsZUVuZHBvaW50ICsgJz9sYW5nPScgKyBsYW5nO1xuXG4gICAgdGhpcy5odHRwQ2xpZW50LmdldCh1cmwpLnN1YnNjcmliZSgocmVzcDogYW55KSA9PiB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSB7fTtcbiAgICAgIGlmIChyZXNwLmNvZGUgPT09IENvZGVzLk9OVElNSVpFX1NVQ0NFU1NGVUxfQ09ERSkge1xuICAgICAgICByZXNwb25zZSA9IHRoaXMucGFyc2VCdW5kbGVSZXNwb25zZShyZXNwLmRhdGEpO1xuICAgICAgfVxuICAgICAgaW5uZXJPYnNlcnZlci5uZXh0KHJlc3BvbnNlKTtcbiAgICB9LFxuICAgICAgZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnUmVtb3RlIEJ1bmRsZSBzZXJ2aWNlIGlzIG5vdCBhdmFpbGFibGUnKTtcbiAgICAgICAgaW5uZXJPYnNlcnZlci5uZXh0KGVycm9yKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiBpbm5lck9ic2VydmVyLmNvbXBsZXRlKClcbiAgICApO1xuXG4gICAgcmV0dXJuIGRhdGFPYnNlcnZhYmxlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcnNlQnVuZGxlUmVzcG9uc2UoZGF0YTogYW55W10pOiBhbnkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGRhdGEuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgcmVzdWx0W2l0ZW1bT1RyYW5zbGF0ZUh0dHBMb2FkZXIuQlVORExFX0tFWV1dID0gaXRlbVtPVHJhbnNsYXRlSHR0cExvYWRlci5CVU5ETEVfVkFMVUVdO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==