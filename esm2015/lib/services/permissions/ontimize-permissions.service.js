import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { LoginStorageService } from '../login-storage.service';
export class OntimizePermissionsService {
    constructor(injector) {
        this.injector = injector;
        this.entity = '';
        this._sessionid = -1;
        this.httpClient = this.injector.get(HttpClient);
        this._config = this.injector.get(AppConfig);
        this._appConfig = this._config.getConfiguration();
    }
    getDefaultServiceConfiguration() {
        const loginStorageService = this.injector.get(LoginStorageService);
        const servConfig = {};
        servConfig[Codes.SESSION_KEY] = loginStorageService.getSessionInfo();
        return servConfig;
    }
    configureService(permissionsConfig) {
        const config = this.getDefaultServiceConfiguration();
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
    }
    loadPermissions() {
        const kv = {};
        kv[this.keyColumn] = this._user;
        const av = [this.valueColumn];
        const url = this._urlBase + '/query';
        const options = {
            headers: this.buildHeaders()
        };
        const body = JSON.stringify({
            user: this._user,
            sessionid: this._sessionid,
            type: 1,
            entity: this.entity,
            kv: kv,
            av: av
        });
        const self = this;
        const dataObservable = new Observable(_innerObserver => {
            self.httpClient.post(url, body, options).subscribe((res) => {
                let permissions = {};
                if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) && Util.isDefined(res.data)) {
                    const response = res.data;
                    if ((response.length === 1) && Util.isObject(response[0])) {
                        const permissionsResp = response[0];
                        try {
                            permissions = permissionsResp.hasOwnProperty(self.valueColumn) ? JSON.parse(permissionsResp[self.valueColumn]) : {};
                        }
                        catch (e) {
                            console.warn('[OntimizePermissionsService: permissions parsing failed]');
                        }
                    }
                }
                _innerObserver.next(permissions);
            }, error => {
                _innerObserver.error(error);
            }, () => _innerObserver.complete());
        });
        return dataObservable.pipe(share());
    }
    buildHeaders() {
        return new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json;charset=UTF-8'
        });
    }
}
OntimizePermissionsService.decorators = [
    { type: Injectable }
];
OntimizePermissionsService.ctorParameters = () => [
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtcGVybWlzc2lvbnMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvc2VydmljZXMvcGVybWlzc2lvbnMvb250aW1pemUtcGVybWlzc2lvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQy9ELE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXZDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUlwRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRy9ELE1BQU0sT0FBTywwQkFBMEI7SUFhckMsWUFBc0IsUUFBa0I7UUFBbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQVhqQyxXQUFNLEdBQVcsRUFBRSxDQUFDO1FBS2pCLGVBQVUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQU9oQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDcEQsQ0FBQztJQUVELDhCQUE4QjtR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Q0FBQztvQkFDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDekQsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQyxJQUFJOzRCQUNGLFdBQVcsR0FBRyxlQUFlLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzt5QkFDckg7d0JBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ1YsT0FBTyxDQUFDLElBQUksQ0FBQywwREFBMEQsQ0FBQyxDQUFDO3lCQUMxRTtxQkFDRjtpQkFDRjtnQkFDRCxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25DLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDVCxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFUyxZQUFZO1FBQ3BCLE9BQU8sSUFBSSxXQUFXLENBQUM7WUFDckIsNkJBQTZCLEVBQUUsR0FBRztZQUNsQyxjQUFjLEVBQUUsZ0NBQWdDO1NBQ2pELENBQUMsQ0FBQztJQUNMLENBQUM7OztZQTVGRixVQUFVOzs7WUFaVSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3RvciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc2hhcmUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFwcENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy9hcHAtY29uZmlnJztcbmltcG9ydCB7IElQZXJtaXNzaW9uc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL3Blcm1pc3Npb25zLXNlcnZpY2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uLy4uL3R5cGVzL2NvbmZpZy50eXBlJztcbmltcG9ydCB7IE9udGltaXplUGVybWlzc2lvbnNDb25maWcgfSBmcm9tICcuLi8uLi90eXBlcy9vbnRpbWl6ZS1wZXJtaXNzaW9ucy1jb25maWcudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBMb2dpblN0b3JhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vbG9naW4tc3RvcmFnZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlIGltcGxlbWVudHMgSVBlcm1pc3Npb25zU2VydmljZSB7XG5cbiAgcHVibGljIGVudGl0eTogc3RyaW5nID0gJyc7XG4gIHB1YmxpYyBrZXlDb2x1bW46IHN0cmluZztcbiAgcHVibGljIHZhbHVlQ29sdW1uOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGh0dHBDbGllbnQ6IEh0dHBDbGllbnQ7XG4gIHByb3RlY3RlZCBfc2Vzc2lvbmlkOiBudW1iZXIgPSAtMTtcbiAgcHJvdGVjdGVkIF91c2VyOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBfdXJsQmFzZTogc3RyaW5nO1xuICBwcm90ZWN0ZWQgX2FwcENvbmZpZzogQ29uZmlnO1xuICBwcm90ZWN0ZWQgX2NvbmZpZzogQXBwQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICB0aGlzLmh0dHBDbGllbnQgPSB0aGlzLmluamVjdG9yLmdldChIdHRwQ2xpZW50KTtcbiAgICB0aGlzLl9jb25maWcgPSB0aGlzLmluamVjdG9yLmdldChBcHBDb25maWcpO1xuICAgIHRoaXMuX2FwcENvbmZpZyA9IHRoaXMuX2NvbmZpZy5nZXRDb25maWd1cmF0aW9uKCk7XG4gIH1cblxuICBnZXREZWZhdWx0U2VydmljZUNvbmZpZ3VyYXRpb24oKTogYW55IHtcbiAgICBjb25zdCBsb2dpblN0b3JhZ2VTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoTG9naW5TdG9yYWdlU2VydmljZSk7XG4gICAgY29uc3Qgc2VydkNvbmZpZyA9IHt9O1xuICAgIHNlcnZDb25maWdbQ29kZXMuU0VTU0lPTl9LRVldID0gbG9naW5TdG9yYWdlU2VydmljZS5nZXRTZXNzaW9uSW5mbygpO1xuICAgIHJldHVybiBzZXJ2Q29uZmlnO1xuICB9XG5cbiAgY29uZmlndXJlU2VydmljZShwZXJtaXNzaW9uc0NvbmZpZzogT250aW1pemVQZXJtaXNzaW9uc0NvbmZpZyk6IHZvaWQge1xuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZ2V0RGVmYXVsdFNlcnZpY2VDb25maWd1cmF0aW9uKCk7XG4gICAgdGhpcy5fdXJsQmFzZSA9IGNvbmZpZy51cmxCYXNlID8gY29uZmlnLnVybEJhc2UgOiB0aGlzLl9hcHBDb25maWcuYXBpRW5kcG9pbnQ7XG4gICAgdGhpcy5fc2Vzc2lvbmlkID0gY29uZmlnLnNlc3Npb24gPyBjb25maWcuc2Vzc2lvbi5pZCA6IC0xO1xuICAgIHRoaXMuX3VzZXIgPSBjb25maWcuc2Vzc2lvbiA/IGNvbmZpZy5zZXNzaW9uLnVzZXIgOiAnJztcblxuICAgIGlmIChVdGlsLmlzRGVmaW5lZChwZXJtaXNzaW9uc0NvbmZpZykpIHtcbiAgICAgIGlmIChwZXJtaXNzaW9uc0NvbmZpZy5lbnRpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmVudGl0eSA9IHBlcm1pc3Npb25zQ29uZmlnLmVudGl0eTtcbiAgICAgIH1cbiAgICAgIGlmIChwZXJtaXNzaW9uc0NvbmZpZy5rZXlDb2x1bW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmtleUNvbHVtbiA9IHBlcm1pc3Npb25zQ29uZmlnLmtleUNvbHVtbjtcbiAgICAgIH1cbiAgICAgIGlmIChwZXJtaXNzaW9uc0NvbmZpZy52YWx1ZUNvbHVtbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudmFsdWVDb2x1bW4gPSBwZXJtaXNzaW9uc0NvbmZpZy52YWx1ZUNvbHVtbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2FkUGVybWlzc2lvbnMoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBrdjogb2JqZWN0ID0ge307XG4gICAga3ZbdGhpcy5rZXlDb2x1bW5dID0gdGhpcy5fdXNlcjtcblxuICAgIGNvbnN0IGF2ID0gW3RoaXMudmFsdWVDb2x1bW5dO1xuXG4gICAgY29uc3QgdXJsID0gdGhpcy5fdXJsQmFzZSArICcvcXVlcnknO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBoZWFkZXJzOiB0aGlzLmJ1aWxkSGVhZGVycygpXG4gICAgfTtcbiAgICBjb25zdCBib2R5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgdXNlcjogdGhpcy5fdXNlcixcbiAgICAgIHNlc3Npb25pZDogdGhpcy5fc2Vzc2lvbmlkLFxuICAgICAgdHlwZTogMSxcbiAgICAgIGVudGl0eTogdGhpcy5lbnRpdHksXG4gICAgICBrdjoga3YsXG4gICAgICBhdjogYXZcbiAgICB9KTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBkYXRhT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxhbnk+ID0gbmV3IE9ic2VydmFibGUoX2lubmVyT2JzZXJ2ZXIgPT4ge1xuICAgICAgc2VsZi5odHRwQ2xpZW50LnBvc3QodXJsLCBib2R5LCBvcHRpb25zKS5zdWJzY3JpYmUoKHJlczogYW55KSA9PiB7XG4gICAgICAgIGxldCBwZXJtaXNzaW9ucyA9IHt9O1xuICAgICAgICBpZiAoKHJlcy5jb2RlID09PSBDb2Rlcy5PTlRJTUlaRV9TVUNDRVNTRlVMX0NPREUpICYmIFV0aWwuaXNEZWZpbmVkKHJlcy5kYXRhKSkge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzLmRhdGE7XG4gICAgICAgICAgaWYgKChyZXNwb25zZS5sZW5ndGggPT09IDEpICYmIFV0aWwuaXNPYmplY3QocmVzcG9uc2VbMF0pKSB7XG4gICAgICAgICAgICBjb25zdCBwZXJtaXNzaW9uc1Jlc3AgPSByZXNwb25zZVswXTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHBlcm1pc3Npb25zID0gcGVybWlzc2lvbnNSZXNwLmhhc093blByb3BlcnR5KHNlbGYudmFsdWVDb2x1bW4pID8gSlNPTi5wYXJzZShwZXJtaXNzaW9uc1Jlc3Bbc2VsZi52YWx1ZUNvbHVtbl0pIDoge307XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybignW09udGltaXplUGVybWlzc2lvbnNTZXJ2aWNlOiBwZXJtaXNzaW9ucyBwYXJzaW5nIGZhaWxlZF0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX2lubmVyT2JzZXJ2ZXIubmV4dChwZXJtaXNzaW9ucyk7XG4gICAgICB9LCBlcnJvciA9PiB7XG4gICAgICAgIF9pbm5lck9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgIH0sICgpID0+IF9pbm5lck9ic2VydmVyLmNvbXBsZXRlKCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBkYXRhT2JzZXJ2YWJsZS5waXBlKHNoYXJlKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGJ1aWxkSGVhZGVycygpOiBIdHRwSGVhZGVycyB7XG4gICAgcmV0dXJuIG5ldyBIdHRwSGVhZGVycyh7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==