import { ElementRef, EventEmitter, Injector, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { OModulesInfoService } from '../../services/o-modules-info.service';
export declare const DEFAULT_INPUTS_O_APP_HEADER: string[];
export declare const DEFAULT_OUTPUTS_O_APP_HEADER: string[];
export declare class OAppHeaderComponent implements OnDestroy {
    protected router: Router;
    protected injector: Injector;
    protected elRef: ElementRef;
    protected dialogService: DialogService;
    protected modulesInfoService: OModulesInfoService;
    protected _headerTitle: string;
    protected modulesInfoSubscription: Subscription;
    showUserInfo: boolean;
    showLanguageSelector: boolean;
    useFlagIcons: boolean;
    onSidenavToggle: EventEmitter<void>;
    constructor(router: Router, injector: Injector, elRef: ElementRef);
    ngOnDestroy(): void;
    onLogoutClick(): void;
    headerTitle: string;
    readonly showHeaderTitle: boolean;
}
