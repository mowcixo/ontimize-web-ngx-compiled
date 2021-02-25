import { ChangeDetectorRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
export declare const DEFAULT_INPUTS_O_APP_SIDENAV_IMAGE: string[];
export declare const DEFAULT_OUTPUTS_O_APP_SIDENAV_IMAGE: any[];
export declare class OAppSidenavImageComponent implements OnInit, OnDestroy {
    protected injector: Injector;
    protected cd: ChangeDetectorRef;
    protected sidenav: OAppSidenavComponent;
    protected openedSrc: string;
    protected closedSrc: string;
    private _src;
    protected sidenavOpenSubs: Subscription;
    protected sidenavCloseSubs: Subscription;
    constructor(injector: Injector, cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    updateImage(): void;
    src: string;
    setOpenedImg(): void;
    setClosedImg(): void;
    readonly showImage: boolean;
}
