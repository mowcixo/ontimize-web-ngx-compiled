import { Injector } from '@angular/core';
import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuService } from './o-context-menu.service';
export declare const DEFAULT_CONTEXT_MENU_DIRECTIVE_INPUTS: string[];
export declare class OContextMenuDirective {
    protected injector: Injector;
    oContextMenu: OContextMenuComponent;
    oContextMenuData: any;
    protected oContextMenuService: OContextMenuService;
    constructor(injector: Injector);
    onRightClick(event: MouseEvent): void;
}
