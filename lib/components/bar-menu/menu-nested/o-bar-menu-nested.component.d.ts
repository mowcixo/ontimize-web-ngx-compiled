import { Injector } from '@angular/core';
import { MenuRootItem } from '../../../types/menu-root-item.type';
export declare const DEFAULT_INPUTS_O_BAR_MENU_NESTED: string[];
export declare class OBarMenuNestedComponent {
    protected injector: Injector;
    private appMenuService;
    items: MenuRootItem[];
    constructor(injector: Injector);
    getValueOfAttr(menu: object, attr: string): string;
    isMenuGroup(item: any): boolean;
}
