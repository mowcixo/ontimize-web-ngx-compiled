import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
export interface UserInfo {
    username?: string;
    avatar?: string;
}
export declare class OUserInfoService {
    protected injector: Injector;
    protected storedInfo: UserInfo;
    private subject;
    constructor(injector: Injector);
    setUserInfo(info: UserInfo): void;
    getUserInfo(): UserInfo;
    getUserInfoObservable(): Observable<any>;
}
