import { Injector } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
export declare const DEFAULT_CONTEXT_MENU_CONTENT_ITEM_INPUTS: string[];
export declare class OWrapperContentMenuComponent {
    protected injector: Injector;
    class: string;
    items: any[];
    childMenu: MatMenu;
    menu: OWrapperContentMenuComponent;
    constructor(injector: Injector);
    onClick(item: any, event?: any): void;
    isGroup(item: any): boolean;
    isSepararor(item: any): boolean;
    isItem(item: any): boolean;
}
