import { ElementRef, Injector } from '@angular/core';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { OBaseMenuItemClass } from '../o-base-menu-item.class';
export declare const DEFAULT_INPUTS_O_BAR_MENU_GROUP: string[];
export declare class OBarMenuGroupComponent extends OBaseMenuItemClass {
    protected menu: OBarMenuComponent;
    protected elRef: ElementRef;
    protected injector: Injector;
    id: string;
    constructor(menu: OBarMenuComponent, elRef: ElementRef, injector: Injector);
}
