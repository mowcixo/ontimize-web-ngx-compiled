import { AfterViewInit, ElementRef, Injector, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OListItemComponent } from '../../list-item/o-list-item.component';
import { OListItemTextRenderer } from '../o-list-item-text-renderer.class';
export declare const DEFAULT_INPUTS_O_LIST_ITEM_AVATAR: string[];
export declare const DEFAULT_OUTPUTS_O_LIST_ITEM_AVATAR: string[];
export declare class OListItemAvatarComponent extends OListItemTextRenderer implements AfterViewInit, OnInit {
    protected _listItem: OListItemComponent;
    sanitizer: DomSanitizer;
    protected avatar: string;
    protected avatarType: string;
    protected emptyAvatar: string;
    protected _avatarSrc: SafeResourceUrl;
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _listItem: OListItemComponent, sanitizer: DomSanitizer);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    avatarSrc: SafeResourceUrl;
}
