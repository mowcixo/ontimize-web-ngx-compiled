import { ElementRef, Injector } from '@angular/core';
import { OBarMenuComponent } from '../o-bar-menu.component';
import { OBaseMenuItemClass } from '../o-base-menu-item.class';
export declare const DEFAULT_INPUTS_O_LOCALE_BAR_MENU_ITEM: string[];
export declare class OLocaleBarMenuItemComponent extends OBaseMenuItemClass {
    protected menu: OBarMenuComponent;
    protected elRef: ElementRef;
    protected injector: Injector;
    locale: string;
    constructor(menu: OBarMenuComponent, elRef: ElementRef, injector: Injector);
    configureI18n(): void;
    isConfiguredLang(): boolean;
}
