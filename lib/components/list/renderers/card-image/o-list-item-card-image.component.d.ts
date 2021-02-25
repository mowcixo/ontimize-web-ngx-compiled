import { AfterViewInit, ElementRef, EventEmitter, Injector, Renderer2 } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { OListItemCardRenderer } from '../o-list-item-card-renderer.class';
export declare const DEFAULT_INPUTS_O_LIST_ITEM_CARD_IMAGE: string[];
export declare const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD_IMAGE: string[];
export declare class OListItemCardImageComponent extends OListItemCardRenderer implements AfterViewInit {
    protected _content: string;
    protected _avatar: string;
    protected _icon: string;
    protected _collapsible: boolean;
    protected _collapsed: boolean;
    onIconClick: EventEmitter<object>;
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _listItem: OListItemComponent);
    ngAfterViewInit(): void;
    onActionIconClick(e?: Event): void;
    content: string;
    avatar: string;
    icon: string;
    collapsible: boolean;
    collapsed: boolean;
}
