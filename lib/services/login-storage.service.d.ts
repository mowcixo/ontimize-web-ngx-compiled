import { Injector } from '@angular/core';
import { SessionInfo } from '../types/session-info.type';
export declare class LoginStorageService {
    protected injector: Injector;
    private _config;
    _localStorageKey: string;
    constructor(injector: Injector);
    getSessionInfo(): SessionInfo;
    storeSessionInfo(sessionInfo: SessionInfo): void;
    sessionExpired(): void;
    isLoggedIn(): boolean;
}
