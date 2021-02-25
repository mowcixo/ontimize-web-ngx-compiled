import { AfterViewInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { OTableComponent } from '../../o-table.component';
export declare class OTableRowDirective implements AfterViewInit, OnDestroy {
    table: OTableComponent;
    protected elementRef: ElementRef;
    protected renderer: Renderer2;
    protected resizeSubscription: Subscription;
    constructor(table: OTableComponent, elementRef: ElementRef, renderer: Renderer2);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    registerResize(): void;
    calculateRowWidth(): void;
    setRowWidth(value: number): void;
    readonly alreadyScrolled: boolean;
}
