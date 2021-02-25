import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { LoginStorageService } from '../login-storage.service';
var OntimizePermissionsService = (function () {
    function OntimizePermissionsService(injector) {
        this.injector = injector;
        this.entity = '';
        this._sessionid = -1;
        this.httpClient = this.injector.get(HttpClient);
        this._config = this.injector.get(AppConfig);
        this._appConfig = this._config.getConfiguration();
    }
    OntimizePermissionsService.prototype.getDefaultServiceConfiguration = function () {
        var loginStorageService = this.injector.get(LoginStorageService);
        var servConfig = {};
        servConfig[Codes.SESSION_KEY] = loginStorageService.getSessionInfo();
        return servConfig;
    };
    OntimizePermissionsService.prototype.configureService = function (permissionsConfig) {
        var config = this.getDefaultServiceConfiguration();
        this._urlBase = config.urlBase ? config.urlBase : this._appConfig.apiEndpoint;
        this._sessionid = config.session ? config.session.id : -1;
        this._user = config.session ? config.session.user : '';
        if (Util.isDefined(permissionsConfig)) {
            if (permissionsConfig.entity !== undefined) {
                this.entity = permissionsConfig.entity;
            }
            if (permissionsConfig.keyColumn !== undefined) {
                this.keyColumn = permissionsConfig.keyColumn;
            }
            if (permissionsConfig.valueColumn !== undefined) {
                this.valueColumn = permissionsConfig.valueColumn;
            }
        }
    };
    OntimizePermissionsService.prototype.loadPermissions = function () {
        var kv = {};
        kv[this.keyColumn] = this._user;
        var av = [this.valueColumn];
        var url = this._urlBase + '/query';
        var options = {
            headers: this.buildHeaders()
        };
        var body = JSON.stringify({
            user: this._user,
            sessionid: this._sessionid,
            type: 1,
            entity: this.entity,
            kv: kv,
            av: av
        });
        var self = this;
        var dataObservable = new Observable(function (_innerObserver) {
            self.httpClient.post(url, body, options).subscribe(function (res) {
                var permissions = {};
                if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) && Util.isDefined(res.data)) {
                    var response = res.data;
                    if ((response.length === 1) && Util.isObject(response[0])) {
                        var permissionsResp = response[0];
                        try {
                            permissions = permissionsResp.hasOwnProperty(self.valueColumn) ? JSON.parse(permissionsResp[self.valueColumn]) : {};
                        }
                        catch (e) {
                            console.warn('[OntimizePermissionsService: permissions parsing failed]');
                        }
                    }
                }
                _innerObserver.next(permissions);
            }, function (error) {
                _innerObserver.error(error);
            }, function () { return _innerObserver.complete(); });
        });
        return dataObservable.pipe(share());
    };
    OntimizePermissionsService.prototype.buildHeaders = function () {
        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=UTF-8'
        });
    };
    OntimizePermissionsService.decorators = [
        { type: Injectable }
    ];
    OntimizePermissionsService.ctorParameters = function () { return [
        { type: Injector }
    ]; };
    return OntimizePermissionsService;
}());
export { OntimizePermissionsService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtcGVybWlzc2lvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvcGVybWlzc2lvbnMvb250aW1pemUtcGVybWlzc2lvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUlwRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRS9EO0lBY0Usb0NBQXNCLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFYakMsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUtqQixlQUFVLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFPaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFFRCxtRUFBOEIsR0FBOUI7UUFDRSxJQUFNLG1C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dWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IElQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3Blcm1pc3Npb25zLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uLy4uL3R5cGVzL2NvbmZpZy50eXBlJztcbmltcG9ydCB7IE9udGltaXplUGVybWlzc2lvbnNDb25maWcgfSBmcm9tICcuLi8uLi90eXBlcy9vbnRpbWl6ZS1wZXJtaXNzaW9ucy1jb25maWcudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBMb2dpblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vbG9naW4tc3RvcmFnZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlIGltcGxlbWVudHMgSVBlcm1pc3Npb25zU2VydmljZSB7XG5cbiAgcHVibGljIGVudGl0eTogc3RyaW5nID0gJyc7XG4gIHB1YmxpYyBrZXlDb2x1bW46IHN0cmluZztcbiAgcHVibGljIHZhbHVlQ29sdW1uOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQ7XG4gIHByb3RlY3RlZCBfc2Vzc2lvbmlkOiBudW1iZXIgPSAtMTtcbiAgcHJvdGVjdGVkIF91c2VyOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfdXJsQmFzZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2FwcENvbmZpZzogQ29uZmlnO1xuICBwcm90ZWN0ZWQgX2NvbmZpZzogQXBwQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLmh0dHBDbGllbnQgPSB0aGlzLmluamVjdG9yLmdldChIdHRwQ2xpZW50KTtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLmluamVjdG9yLmdldChBcHBDb25maWcpO1xuICAgIHRoaXMuX2FwcENvbmZpZyA9IHRoaXMuX2NvbmZpZy5nZXRDb25maWd1cmF0aW9uKCk7XG4gIH1cblxuICBnZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24oKTogYW55IHtcbiAgICBjb25zdCBsb2dpblN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9naW5TdG9yYWdlU2VydmljZSk7XG4gICAgY29uc3Qgc2VydkNvbmZpZyA9IHt9O1xuICAgIHNlcnZDb25maWdbQ29kZXMuU0VTU0lPTl9LRVldID0gbG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgIHJldHVybiBzZXJ2Q29uZmlnO1xuICB9XG5cbiAgY29uZmlndXJlU2VydmljZShwZXJtaXNzaW9uc0NvbmZpZzogT250aW1pemVQZXJtaXNzaW9uc0NvbmZpZyk6IHZvaWQge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKCk7XG4gICAgdGhpcy5fdXJsQmFzZSA9IGNvbmZpZy51cmxCYXNlID8gY29uZmlnLnVybEJhc2UgOiB0aGlzLl9hcHBDb25maWcuYXBpRW5kcG9pbnQ7XG4gICAgdGhpcy5fc2Vzc2lvbmlkID0gY29uZmlnLnNlc3Npb24gPyBjb25maWcuc2Vzc2lvbi5pZCA6IC0xO1xuICAgIHRoaXMuX3VzZXIgPSBjb25maWcuc2Vzc2lvbiA/IGNvbmZpZy5zZXNzaW9uLnVzZXIgOiAnJztcblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChwZXJtaXNzaW9uc0NvbmZpZykpIHtcbiAgICAgIGlmIChwZXJtaXNzaW9uc0NvbmZpZy5lbnRpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IHBlcm1pc3Npb25zQ29uZmlnLmVudGl0eTtcbiAgICAgIH1cbiAgICAgIGlmIChwZXJtaXNzaW9uc0NvbmZpZy5rZXlDb2x1bW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmtleUNvbHVtbiA9IHBlcm1pc3Npb25zQ29uZmlnLmtleUNvbHVtbjtcbiAgICAgIH1cbiAgICAgIGlmIChwZXJtaXNzaW9uc0NvbmZpZy52YWx1ZUNvbHVtbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudmFsdWVDb2x1bW4gPSBwZXJtaXNzaW9uc0NvbmZpZy52YWx1ZUNvbHVtbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2FkUGVybWlzc2lvbnMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBrdjogb2JqZWN0ID0ge307XG4gICAga3ZbdGhpcy5rZXlDb2x1bW5dID0gdGhpcy5fdXNlcjtcblxuICAgIGNvbnN0IGF2ID0gW3RoaXMudmFsdWVDb2x1bW5dO1xuXG4gICAgY29uc3QgdXJsID0gdGhpcy5fdXJsQmFzZSArICcvcXVlcnknO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiB0aGlzLmJ1aWxkSGVhZGVycygpXG4gICAgfTtcbiAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdXNlcjogdGhpcy5fdXNlcixcbiAgICAgIHNlc3Npb25pZDogdGhpcy5fc2Vzc2lvbmlkLFxuICAgICAgdHlwZTogMSxcbiAgICAgIGVudGl0eTogdGhpcy5lbnRpdHksXG4gICAgICBrdjoga3YsXG4gICAgICBhdjogYXZcbiAgICB9KTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+ID0gbmV3IE9ic2VydmFibGUoX2lubmVyT2JzZXJ2ZXIgPT4ge1xuICAgICAgc2VsZi5odHRwQ2xpZW50LnBvc3QodXJsLCBib2R5LCBvcHRpb25zKS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgIGxldCBwZXJtaXNzaW9ucyA9IHt9O1xuICAgICAgICBpZiAoKHJlcy5jb2RlID09PSBDb2Rlcy5PTlRJTUlaRV9TVUNDRVNTRlVMX0NPREUpICYmIFV0aWwuaXNEZWZpbmVkKHJlcy5kYXRhKSkge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzLmRhdGE7XG4gICAgICAgICAgaWYgKChyZXNwb25zZS5sZW5ndGggPT09IDEpICYmIFV0aWwuaXNPYmplY3QocmVzcG9uc2VbMF0pKSB7XG4gICAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uc1Jlc3AgPSByZXNwb25zZVswXTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbnNSZXNwLmhhc093blByb3BlcnR5KHNlbGYudmFsdWVDb2x1bW4pID8gSlNPTi5wYXJzZShwZXJtaXNzaW9uc1Jlc3Bbc2VsZi52YWx1ZUNvbHVtbl0pIDoge307XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignW09udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlOiBwZXJtaXNzaW9ucyBwYXJzaW5nIGZhaWxlZF0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX2lubmVyT2JzZXJ2ZXIubmV4dChwZXJtaXNzaW9ucyk7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIF9pbm5lck9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0sICgpID0+IF9pbm5lck9ic2VydmVyLmNvbXBsZXRlKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkSGVhZGVycygpOiBIdHRwSGVhZGVycyB7XG4gICAgcmV0dXJuIG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==