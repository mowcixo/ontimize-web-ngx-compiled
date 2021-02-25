import { AfterContentInit, OnInit, QueryList } from '@angular/core';
import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { OComponentMenuItems } from '../o-content-menu.class';
export declare const DEFAULT_CONTEXT_MENU_GROUP_INPUTS: string[];
export declare class OContextMenuGroupComponent extends OContextMenuItemComponent implements OnInit, AfterContentInit {
    type: string;
    children: any[];
    oContextMenuItems: QueryList<OComponentMenuItems>;
    ngAfterContentInit(): void;
}
