import { EventEmitter } from '@angular/core';
import { OAppSidenavComponent } from '../../components/app-sidenav/o-app-sidenav.component';
import { OAppLayoutMode, OSidenavMode } from '../../util/codes';
export declare const DEFAULT_INPUTS_O_APP_LAYOUT: string[];
export declare const DEFAULT_OUTPUTS_O_APP_LAYOUT: any[];
export declare class OAppLayoutComponent {
    sidenavOpened: boolean;
    showUserInfo: boolean;
    showLanguageSelector: boolean;
    useFlagIcons: boolean;
    protected _showHeader: boolean;
    appSidenav: OAppSidenavComponent;
    protected _mode: OAppLayoutMode;
    protected _sidenavMode: OSidenavMode;
    openedSidenavImg: string;
    closedSidenavImg: string;
    beforeOpenSidenav: EventEmitter<boolean>;
    afterOpenSidenav: EventEmitter<boolean>;
    beforeCloseSidenav: EventEmitter<boolean>;
    afterCloseSidenav: EventEmitter<boolean>;
    showHeader: boolean;
    mode: OAppLayoutMode;
    sidenavMode: OSidenavMode;
    sidenavToggle(opened: boolean): void;
    afterToggle(opened: boolean): void;
}
