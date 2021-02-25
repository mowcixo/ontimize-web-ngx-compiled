import { ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IList } from '../../../interfaces/o-list.interface';
export declare class OListItemDirective implements OnInit, OnDestroy {
    _el: ElementRef;
    private renderer;
    actRoute: ActivatedRoute;
    mdClick: EventEmitter<any>;
    mdDoubleClick: EventEmitter<any>;
    modelData: object;
    selectable: boolean;
    protected _list: IList;
    protected subcription: any;
    constructor(_el: ElementRef, renderer: Renderer2, actRoute: ActivatedRoute);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onMouseEnter(): void;
    updateActiveState(params: any): void;
    onItemClicked(e?: Event): void;
    onClick(onNext: (item: OListItemDirective) => void): object;
    onItemDoubleClicked(e?: Event): void;
    onDoubleClick(onNext: (item: OListItemDirective) => void): object;
    isSelected(): boolean;
    onSelect(): void;
    setListComponent(list: IList): void;
    setItemData(data: any): void;
    getItemData(): any;
}
