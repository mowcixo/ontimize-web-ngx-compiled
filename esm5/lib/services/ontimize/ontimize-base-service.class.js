import * as tslib_1 from "tslib";
import { ServiceUtils } from '../../util/service.utils';
import { BaseService } from '../base-service.class';
var OntimizeBaseService = (function (_super) {
    tslib_1.__extends(OntimizeBaseService, _super);
    function OntimizeBaseService(injector) {
        var _this = _super.call(this, injector) || this;
        _this.injector = injector;
        _this.kv = {};
        _this.av = [];
        _this.sqltypes = {};
        _this.pagesize = 10;
        _this.offset = 0;
        _this.orderby = [];
        _this.totalsize = -1;
        return _this;
    }
    OntimizeBaseService.prototype.configureService = function (config) {
        _super.prototype.configureService.call(this, config);
        this._sessionid = config.session ? config.session.id : -1;
    };
    OntimizeBaseService.prototype.startsession = function (user, password) {
        return null;
    };
    OntimizeBaseService.prototype.endsession = function (user, sessionId) {
        return null;
    };
    OntimizeBaseService.prototype.hassession = function (user, sessionId) {
        return null;
    };
    OntimizeBaseService.prototype.redirectLogin = function (sessionExpired) {
        if (sessionExpired === void 0) { sessionExpired = false; }
        if (sessionExpired) {
            this.loginStorageService.sessionExpired();
        }
        ServiceUtils.redirectLogin(this.router, sessionExpired);
    };
    OntimizeBaseService.prototype.clientErrorFallback = function (errorCode) {
        if (errorCode === 401) {
            this.redirectLogin(true);
        }
    };
    return OntimizeBaseService;
}(BaseService));
export { OntimizeBaseService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtYmFzZS1zZXJ2aWNlLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS1iYXNlLXNlcnZpY2UuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUlBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFcEQ7SUFBeUMsK0NBQVc7SUFhbEQsNkJBQXNCLFFBQWtCO1FBQXhDLFlBQ0Usa0JBQU0sUUFBUSxDQUFDLFNBQ2hCO1FBRnFCLGNBQVEsR0FBUixRQUFRLENBQVU7UUFSakMsUUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNSLFFBQUUsR0FBYSxFQUFFLENBQUM7UUFDbEIsY0FBUSxHQUFHLEVBQUUsQ0FBQztRQUNkLGNBQVEsR0FBVyxFQUFFLENBQUM7UUFDdEIsWUFBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixhQUFPLEdBQWtCLEVBQUUsQ0FBQztRQUM1QixlQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7O0lBSTlCLENBQUM7SUFFTSw4Q0FBZ0IsR0FBdkIsVUFBd0IsTUFBVztRQUNqQyxpQkFBTSxnQkFBZ0IsWUFBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sMENBQVksR0FBbkIsVUFBb0IsSUFBWSxFQUFFLFFBQWdCO1FBQ2hELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHdDQUFVLEdBQWpCLFVBQWtCLElBQVksRUFBRSxTQUFpQjtRQUMvQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSx3Q0FBVSxHQUFqQixVQUFrQixJQUFZLEVBQUUsU0FBMEI7UUFDeEQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sMkNBQWEsR0FBcEIsVUFBcUIsY0FBK0I7UUFBL0IsK0JBQUEsRUFBQSxzQkFBK0I7UUFDbEQsSUFBSSxjQUFjLEVBQUU7WUFDbEIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzNDO1FBQ0QsWUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFTSxpREFBbUIsR0FBMUIsVUFBMkIsU0FBaUI7UUFDMUMsSUFBSSxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBOUNELENBQXlDLFdBQVcsR0E4Q25EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0b3IgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSUF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9hdXRoLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IFNlcnZpY2VVdGlscyB9IGZyb20gJy4uLy4uL3V0aWwvc2VydmljZS51dGlscyc7XG5pbXBvcnQgeyBCYXNlU2VydmljZSB9IGZyb20gJy4uL2Jhc2Utc2VydmljZS5jbGFzcyc7XG5cbmV4cG9ydCBjbGFzcyBPbnRpbWl6ZUJhc2VTZXJ2aWNlIGV4dGVuZHMgQmFzZVNlcnZpY2UgaW1wbGVtZW50cyBJQXV0aFNlcnZpY2Uge1xuXG4gIHByb3RlY3RlZCBfc2Vzc2lvbmlkOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfc3RhcnRTZXNzaW9uUGF0aDogc3RyaW5nO1xuXG4gIHB1YmxpYyBrdiA9IHt9O1xuICBwdWJsaWMgYXY6IHN0cmluZ1tdID0gW107XG4gIHB1YmxpYyBzcWx0eXBlcyA9IHt9O1xuICBwdWJsaWMgcGFnZXNpemU6IG51bWJlciA9IDEwO1xuICBwdWJsaWMgb2Zmc2V0OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgb3JkZXJieTogQXJyYXk8b2JqZWN0PiA9IFtdO1xuICBwdWJsaWMgdG90YWxzaXplOiBudW1iZXIgPSAtMTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIoaW5qZWN0b3IpO1xuICB9XG5cbiAgcHVibGljIGNvbmZpZ3VyZVNlcnZpY2UoY29uZmlnOiBhbnkpOiB2b2lkIHtcbiAgICBzdXBlci5jb25maWd1cmVTZXJ2aWNlKGNvbmZpZyk7XG4gICAgdGhpcy5fc2Vzc2lvbmlkID0gY29uZmlnLnNlc3Npb24gPyBjb25maWcuc2Vzc2lvbi5pZCA6IC0xO1xuICB9XG5cbiAgcHVibGljIHN0YXJ0c2Vzc2lvbih1c2VyOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHVibGljIGVuZHNlc3Npb24odXNlcjogc3RyaW5nLCBzZXNzaW9uSWQ6IG51bWJlcik6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgaGFzc2Vzc2lvbih1c2VyOiBzdHJpbmcsIHNlc3Npb25JZDogc3RyaW5nIHwgbnVtYmVyKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgcmVkaXJlY3RMb2dpbihzZXNzaW9uRXhwaXJlZDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKHNlc3Npb25FeHBpcmVkKSB7XG4gICAgICB0aGlzLmxvZ2luU3RvcmFnZVNlcnZpY2Uuc2Vzc2lvbkV4cGlyZWQoKTtcbiAgICB9XG4gICAgU2VydmljZVV0aWxzLnJlZGlyZWN0TG9naW4odGhpcy5yb3V0ZXIsIHNlc3Npb25FeHBpcmVkKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGllbnRFcnJvckZhbGxiYWNrKGVycm9yQ29kZTogbnVtYmVyKSB7XG4gICAgaWYgKGVycm9yQ29kZSA9PT0gNDAxKSB7XG4gICAgICB0aGlzLnJlZGlyZWN0TG9naW4odHJ1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=