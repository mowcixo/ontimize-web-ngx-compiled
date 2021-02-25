import { ElementRef, EventEmitter, Injector, Renderer2 } from '@angular/core';
import { OListItemComponent } from '../list-item/o-list-item.component';
export declare const DEFAULT_INPUTS_O_TEXT_RENDERER: string[];
export declare const DEFAULT_OUTPUTS_O_TEXT_RENDERER: string[];
export declare class OListItemTextRenderer {
    elRef: ElementRef;
    protected _renderer: Renderer2;
    protected _injector: Injector;
    protected _listItem: OListItemComponent;
    protected _title: string;
    protected _primaryText: string;
    protected _secondaryText: string;
    protected _icon: string;
    onIconClick: EventEmitter<object>;
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _listItem: OListItemComponent);
    modifyMatListItemElement(): void;
    onActionIconClick(e?: Event): void;
    title: string;
    primaryText: string;
    secondaryText: string;
    icon: string;
}
