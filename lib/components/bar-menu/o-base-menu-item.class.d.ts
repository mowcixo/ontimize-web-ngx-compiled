import { ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { OPermissions } from '../../types/o-permissions.type';
import { OBarMenuComponent } from './o-bar-menu.component';
export declare const DEFAULT_INPUTS_O_BASE_MENU_ITEM: string[];
export declare class OBaseMenuItemClass implements OnInit, OnDestroy {
    protected menu: OBarMenuComponent;
    protected elRef: ElementRef;
    protected injector: Injector;
    protected translateService: OTranslateService;
    protected onLanguageChangeSubscription: Subscription;
    protected permissions: OPermissions;
    protected mutationObserver: MutationObserver;
    title: string;
    tooltip: string;
    icon: string;
    restricted: boolean;
    disabled: boolean;
    protected _isHovered: boolean;
    attr: string;
    onMouseover: () => boolean;
    onMouseout: () => boolean;
    constructor(menu: OBarMenuComponent, elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    ngOnDestroy(): void;
    setDOMTitle(): void;
    protected parsePermissions(): void;
    isHovered: boolean;
}
