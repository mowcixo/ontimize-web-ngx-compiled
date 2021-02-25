import { AfterViewInit, ChangeDetectorRef, Injector, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMenuService } from '../../services/app-menu.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { MenuRootItem } from '../../types/menu-root-item.type';
export declare const DEFAULT_INPUTS_O_MENU_LAYOUT: string[];
export declare const DEFAULT_OUTPUTS_O_MENU_LAYOUT: any[];
export declare class OCardMenuLayoutComponent implements AfterViewInit, OnDestroy {
    private injector;
    private cd;
    protected translateService: OTranslateService;
    protected translateServiceSubscription: Subscription;
    protected appMenuService: AppMenuService;
    protected menuRoots: MenuRootItem[];
    protected cardItemsArray: MenuRootItem[];
    protected parentMenuId: string;
    constructor(injector: Injector, cd: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    setCardMenuItems(): void;
    cardItems: MenuRootItem[];
    protected getItemsFilteredByParentId(array: MenuRootItem[]): MenuRootItem[];
}
