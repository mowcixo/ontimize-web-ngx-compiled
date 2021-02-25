import { ElementRef, EventEmitter, Injector, Renderer2 } from '@angular/core';
import { OListItemComponent } from '../list-item/o-list-item.component';
export declare const DEFAULT_INPUTS_O_CARD_RENDERER: string[];
export declare const DEFAULT_OUTPUTS_O_CARD_RENDERER: string[];
export declare class OListItemCardRenderer {
    elRef: ElementRef;
    protected _renderer: Renderer2;
    protected _injector: Injector;
    protected _listItem: OListItemComponent;
    protected _title: string;
    protected _subtitle: string;
    protected _image: string;
    protected _showImage: boolean;
    protected _action1Text: string;
    protected _action2Text: string;
    onAction1Click: EventEmitter<object>;
    onAction2Click: EventEmitter<object>;
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _listItem: OListItemComponent);
    modifyMatListItemElement(): void;
    onAction1ButtonClick(e?: Event): void;
    onAction2ButtonClick(e?: Event): void;
    compareListHeight(height: string): true;
    title: string;
    subtitle: string;
    image: string;
    showImage: boolean;
    action1Text: string;
    action2Text: string;
}
