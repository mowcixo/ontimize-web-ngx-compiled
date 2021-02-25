import { ElementRef, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { OBaseMenuItemClass } from '../o-base-menu-item.class';
export declare const DEFAULT_INPUTS_O_BAR_MENU_ITEM: string[];
export declare class OBarMenuItemComponent extends OBaseMenuItemClass implements OnInit {
    protected menu: OBarMenuComponent;
    protected elRef: ElementRef;
    protected injector: Injector;
    protected router: Router;
    route: string;
    action: () => void;
    constructor(menu: OBarMenuComponent, elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    collapseMenu(evt: Event): void;
    onClick(): void;
}
