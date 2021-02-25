import { EventEmitter, Injector, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { IOContextMenuContext } from '../../interfaces/o-context-menu.interface';
import { OComponentMenuItems } from './o-content-menu.class';
import { OContextMenuService } from './o-context-menu.service';
export declare const DEFAULT_OUTPUTS_O_CONTEXT_MENU: string[];
export declare class OContextMenuComponent implements OnDestroy, OnInit {
    protected injector: Injector;
    oContextMenuItems: QueryList<OComponentMenuItems>;
    origin: HTMLElement;
    onShow: EventEmitter<any>;
    onClose: EventEmitter<any>;
    oContextMenuService: OContextMenuService;
    protected subscription: Subscription;
    constructor(injector: Injector);
    ngOnInit(): void;
    ngOnDestroy(): void;
    showContextMenu(params: IOContextMenuContext): void;
}
