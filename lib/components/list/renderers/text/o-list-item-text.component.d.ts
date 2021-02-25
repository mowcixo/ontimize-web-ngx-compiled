import { AfterViewInit, ElementRef, Injector, OnInit, Renderer2 } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { OListItemTextRenderer } from '../o-list-item-text-renderer.class';
export declare const DEFAULT_INPUTS_O_LIST_ITEM_TEXT: string[];
export declare const DEFAULT_OUTPUTS_O_LIST_ITEM_TEXT: string[];
export declare class OListItemTextComponent extends OListItemTextRenderer implements OnInit, AfterViewInit {
    protected _listItem: OListItemComponent;
    ICON_POSITION_LEFT: string;
    ICON_POSITION_RIGHT: string;
    _iconPosition: string;
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _listItem: OListItemComponent);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    iconPosition: string;
}
