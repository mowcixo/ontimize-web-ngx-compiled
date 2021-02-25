import { AfterViewInit, ElementRef, Injector, Renderer2 } from '@angular/core';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { OListItemCardRenderer } from '../o-list-item-card-renderer.class';
export declare const DEFAULT_INPUTS_O_LIST_ITEM_CARD: string[];
export declare const DEFAULT_OUTPUTS_O_LIST_ITEM_CARD: string[];
export declare class OListItemCardComponent extends OListItemCardRenderer implements AfterViewInit {
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _listItem: OListItemComponent);
    ngAfterViewInit(): void;
}
