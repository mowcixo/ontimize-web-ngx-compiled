import { ElementRef, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { LoginService } from '../../services/login.service';
import { OUserInfoService, UserInfo } from '../../services/o-user-info.service';
export declare const DEFAULT_INPUTS_O_USER_INFO: any[];
export declare const DEFAULT_OUTPUTS_O_USER_INFO: any[];
export declare class OUserInfoComponent implements OnDestroy {
    protected elRef: ElementRef;
    protected injector: Injector;
    protected router: Router;
    protected dialogService: DialogService;
    protected loginService: LoginService;
    protected oUserInfoService: OUserInfoService;
    userInfoSubscription: Subscription;
    protected userInfo: UserInfo;
    constructor(elRef: ElementRef, injector: Injector, router: Router);
    ngOnDestroy(): void;
    onLogoutClick(): void;
    onSettingsClick(): void;
    readonly existsUserInfo: boolean;
    readonly avatar: string;
    readonly username: string;
}
