import { ServiceUtils } from '../../util/service.utils';
import { BaseService } from '../base-service.class';
export class OntimizeBaseService extends BaseService {
    constructor(injector) {
        super(injector);
        this.injector = injector;
        this.kv = {};
        this.av = [];
        this.sqltypes = {};
        this.pagesize = 10;
        this.offset = 0;
        this.orderby = [];
        this.totalsize = -1;
    }
    configureService(config) {
        super.configureService(config);
        this._sessionid = config.session ? config.session.id : -1;
    }
    startsession(user, password) {
        return null;
    }
    endsession(user, sessionId) {
        return null;
    }
    hassession(user, sessionId) {
        return null;
    }
    redirectLogin(sessionExpired = false) {
        if (sessionExpired) {
            this.loginStorageService.sessionExpired();
        }
        ServiceUtils.redirectLogin(this.router, sessionExpired);
    }
    clientErrorFallback(errorCode) {
        if (errorCode === 401) {
            this.redirectLogin(true);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtYmFzZS1zZXJ2aWNlLmNsYXNzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vbnRpbWl6ZS9vbnRpbWl6ZS1iYXNlLXNlcnZpY2UuY2xhc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVwRCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsV0FBVztJQWFsRCxZQUFzQixRQUFrQjtRQUN0QyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFESSxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBUmpDLE9BQUUsR0FBRyxFQUFFLENBQUM7UUFDUixPQUFFLEdBQWEsRUFBRSxDQUFDO1FBQ2xCLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDZCxhQUFRLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsWUFBTyxHQUFrQixFQUFFLENBQUM7UUFDNUIsY0FBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO0lBSTlCLENBQUM7SUFFTSxnQkFBZ0IsQ0FBQyxNQUFXO1FBQ2pDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sWUFBWSxDQUFDLElBQVksRUFBRSxRQUFnQjtRQUNoRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxVQUFVLENBQUMsSUFBWSxFQUFFLFNBQWlCO1FBQy9DLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLFVBQVUsQ0FBQyxJQUFZLEVBQUUsU0FBMEI7UUFDeEQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sYUFBYSxDQUFDLGlCQUEwQixLQUFLO1FBQ2xELElBQUksY0FBYyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMzQztRQUNELFlBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sbUJBQW1CLENBQUMsU0FBaUI7UUFDMUMsSUFBSSxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBJQXV0aFNlcnZpY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL2F1dGgtc2VydmljZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgU2VydmljZVV0aWxzIH0gZnJvbSAnLi4vLi4vdXRpbC9zZXJ2aWNlLnV0aWxzJztcbmltcG9ydCB7IEJhc2VTZXJ2aWNlIH0gZnJvbSAnLi4vYmFzZS1zZXJ2aWNlLmNsYXNzJztcblxuZXhwb3J0IGNsYXNzIE9udGltaXplQmFzZVNlcnZpY2UgZXh0ZW5kcyBCYXNlU2VydmljZSBpbXBsZW1lbnRzIElBdXRoU2VydmljZSB7XG5cbiAgcHJvdGVjdGVkIF9zZXNzaW9uaWQ6IHN0cmluZztcbiAgcHJvdGVjdGVkIF9zdGFydFNlc3Npb25QYXRoOiBzdHJpbmc7XG5cbiAgcHVibGljIGt2ID0ge307XG4gIHB1YmxpYyBhdjogc3RyaW5nW10gPSBbXTtcbiAgcHVibGljIHNxbHR5cGVzID0ge307XG4gIHB1YmxpYyBwYWdlc2l6ZTogbnVtYmVyID0gMTA7XG4gIHB1YmxpYyBvZmZzZXQ6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBvcmRlcmJ5OiBBcnJheTxvYmplY3Q+ID0gW107XG4gIHB1YmxpYyB0b3RhbHNpemU6IG51bWJlciA9IC0xO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihpbmplY3Rvcik7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlU2VydmljZShjb25maWc6IGFueSk6IHZvaWQge1xuICAgIHN1cGVyLmNvbmZpZ3VyZVNlcnZpY2UoY29uZmlnKTtcbiAgICB0aGlzLl9zZXNzaW9uaWQgPSBjb25maWcuc2Vzc2lvbiA/IGNvbmZpZy5zZXNzaW9uLmlkIDogLTE7XG4gIH1cblxuICBwdWJsaWMgc3RhcnRzZXNzaW9uKHVzZXI6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBwdWJsaWMgZW5kc2Vzc2lvbih1c2VyOiBzdHJpbmcsIHNlc3Npb25JZDogbnVtYmVyKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyBoYXNzZXNzaW9uKHVzZXI6IHN0cmluZywgc2Vzc2lvbklkOiBzdHJpbmcgfCBudW1iZXIpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHB1YmxpYyByZWRpcmVjdExvZ2luKHNlc3Npb25FeHBpcmVkOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoc2Vzc2lvbkV4cGlyZWQpIHtcbiAgICAgIHRoaXMubG9naW5TdG9yYWdlU2VydmljZS5zZXNzaW9uRXhwaXJlZCgpO1xuICAgIH1cbiAgICBTZXJ2aWNlVXRpbHMucmVkaXJlY3RMb2dpbih0aGlzLnJvdXRlciwgc2Vzc2lvbkV4cGlyZWQpO1xuICB9XG5cbiAgcHVibGljIGNsaWVudEVycm9yRmFsbGJhY2soZXJyb3JDb2RlOiBudW1iZXIpIHtcbiAgICBpZiAoZXJyb3JDb2RlID09PSA0MDEpIHtcbiAgICAgIHRoaXMucmVkaXJlY3RMb2dpbih0cnVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==