import { AfterContentInit, ElementRef, Injector, OnInit, QueryList, Renderer2 } from '@angular/core';
import { MatLine, MatListAvatarCssMatStyler, MatListItem } from '@angular/material';
import { IListItem } from '../../../interfaces/o-list-item.interface';
import { OListComponent } from '../o-list.component';
export declare class OListItemComponent implements OnInit, IListItem, AfterContentInit {
    elRef: ElementRef;
    protected _renderer: Renderer2;
    protected _injector: Injector;
    _list: OListComponent;
    modelData: any;
    protected _isSelected: boolean;
    protected _lines: QueryList<MatLine>;
    protected _innerListItem: MatListItem;
    _hasAvatar: MatListAvatarCssMatStyler;
    constructor(elRef: ElementRef, _renderer: Renderer2, _injector: Injector, _list: OListComponent);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    onClick(e?: Event): void;
    onDoubleClick(e?: Event): void;
    onDetailIconClicked(e?: Event): void;
    onEditIconClicked(e?: Event): void;
    setItemData(data: any): void;
    getItemData(): any;
    onCheckboxChange(e?: Event): void;
    readonly isSelected: boolean;
}
