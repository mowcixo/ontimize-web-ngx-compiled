import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, EventEmitter, Injector, OnInit, QueryList } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { OComponentMenuItems } from '../o-content-menu.class';
import { OWrapperContentMenuComponent } from './o-wrapper-content-menu/o-wrapper-content-menu.component';
export declare const DEFAULT_CONTEXT_MENU_CONTENT_INPUTS: string[];
export declare const DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS: string[];
export declare class OContextMenuContentComponent implements AfterViewInit, OnInit {
    protected injector: Injector;
    menuItems: any[];
    overlay: OverlayRef;
    data: any;
    menuClass: string;
    execute: EventEmitter<{
        event: Event;
        data: any;
        menuItem: OContextMenuItemComponent;
    }>;
    close: EventEmitter<any>;
    oContextMenuItems: QueryList<OComponentMenuItems>;
    trigger: MatMenuTrigger;
    menu: OWrapperContentMenuComponent;
    constructor(injector: Injector);
    click(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    initialize(): void;
    setData(items: any): void;
    onMenuClosed(e: Event): void;
    closeContent(): void;
}
