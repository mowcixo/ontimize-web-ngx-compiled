import { EventEmitter, OnInit } from '@angular/core';
import { OComponentMenuItems } from '../o-content-menu.class';
export declare const DEFAULT_CONTEXT_MENU_ITEM_OUTPUTS: string[];
export declare const DEFAULT_INPUTS_O_CONTEXT_MENU_ITEM: string[];
export declare class OContextMenuItemComponent extends OComponentMenuItems implements OnInit {
    execute: EventEmitter<{
        event: Event;
        data: any;
    }>;
    type: string;
    icon: string;
    data: any;
    label: string;
    enabled: boolean | ((item: any) => boolean);
    svgIcon: string;
    protected oenabled: any;
    ngOnInit(): void;
    onClick(event: MouseEvent): void;
    triggerExecute(data: any, $event?: Event): void;
    readonly disabled: boolean;
    readonly isVisible: boolean;
}
