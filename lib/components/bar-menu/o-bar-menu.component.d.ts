import { ElementRef, Injector, OnInit } from '@angular/core';
import { PermissionsService } from '../../services/permissions/permissions.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { MenuRootItem } from '../../types/menu-root-item.type';
export declare const DEFAULT_INPUTS_O_BAR_MENU: string[];
export declare class OBarMenuComponent implements OnInit {
    protected elRef: ElementRef;
    protected injector: Injector;
    protected permissionsService: PermissionsService;
    protected translateService: OTranslateService;
    private appMenuService;
    private menuRoots;
    protected _menuTitle: string;
    protected _tooltip: string;
    protected _id: string;
    constructor(elRef: ElementRef, injector: Injector);
    ngOnInit(): void;
    setDOMTitle(): void;
    collapseAll(): void;
    getPermissionsService(): PermissionsService;
    menuTitle: string;
    tooltip: string;
    id: string;
    readonly menuItems: MenuRootItem[];
}
