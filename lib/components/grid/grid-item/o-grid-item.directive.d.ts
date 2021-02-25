import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { OGridComponent } from '../o-grid.component';
export declare class OGridItemDirective {
    _el: ElementRef;
    private renderer;
    mdClick: EventEmitter<any>;
    mdDoubleClick: EventEmitter<any>;
    modelData: object;
    protected grid: OGridComponent;
    onMouseEnter(): void;
    constructor(_el: ElementRef, renderer: Renderer2);
    onClick(onNext: (item: OGridItemDirective) => void): object;
    onDoubleClick(onNext: (item: OGridItemDirective) => void): object;
    onItemClicked(e?: Event): void;
    onItemDoubleClicked(e?: Event): void;
    setItemData(data: object): void;
    getItemData(): object;
    setGridComponent(grid: OGridComponent): void;
}
