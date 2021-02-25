import { OnInit } from '@angular/core';
import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
export declare const DEFAULT_CONTEXT_MENU_ITEM_INPUTS: string[];
export declare class OContextMenuSeparatorComponent extends OContextMenuItemComponent implements OnInit {
    type: string;
    ngOnInit(): void;
}
