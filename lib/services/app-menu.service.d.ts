import { Injector } from '@angular/core';
import { AppConfig } from '../config/app-config';
import { MenuItem } from '../interfaces/app-menu.interface';
import { MenuRootItem } from '../types/menu-root-item.type';
export declare class AppMenuService {
    protected injector: Injector;
    protected _config: AppConfig;
    protected MENU_ROOTS: MenuRootItem[];
    protected ALL_MENU_ITEMS: MenuItem[];
    constructor(injector: Injector);
    getMenuRoots(): MenuRootItem[];
    getMenuRootById(id: string): MenuRootItem;
    getAllMenuItems(): MenuItem[];
    getMenuItemById(id: string): MenuItem;
    getMenuItemType(item: MenuRootItem): string;
    isMenuGroup(item: MenuRootItem): boolean;
    private getMenuItems;
}
