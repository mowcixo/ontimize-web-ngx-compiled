import { ElementRef, EventEmitter, TemplateRef } from '@angular/core';
import { IGridItem } from '../../../interfaces/o-grid-item.interface';
export declare const DEFAULT_INPUTS_O_GRID_ITEM: string[];
export declare class OGridItemComponent implements IGridItem {
    _el: ElementRef;
    modelData: object;
    mdClick: EventEmitter<any>;
    mdDoubleClick: EventEmitter<any>;
    template: TemplateRef<any>;
    colspan: number;
    rowspan: number;
    constructor(_el: ElementRef);
    onItemClicked(e?: Event): void;
    onItemDoubleClicked(e?: Event): void;
    onClick(onNext: (item: OGridItemComponent) => void): object;
    onDoubleClick(onNext: (item: OGridItemComponent) => void): object;
    setItemData(data: object): void;
    getItemData(): object;
}
