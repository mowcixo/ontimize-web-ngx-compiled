import { AfterViewInit, ElementRef, Injector, Renderer2 } from '@angular/core';
import { OTableComponent } from './../../../o-table.component';
export declare class OTableExpandedFooterDirective implements AfterViewInit {
    table: OTableComponent;
    element: ElementRef;
    private renderer;
    protected injector: Injector;
    private spanMessageNotResults;
    private translateService;
    private tableBody;
    private tableHeader;
    private tdTableWithMessage;
    private onContentChangeSubscription;
    private onVisibleColumnsChangeSubscription;
    constructor(table: OTableComponent, element: ElementRef, renderer: Renderer2, injector: Injector);
    ngAfterViewInit(): void;
    registerContentChange(): void;
    registerVisibleColumnsChange(): void;
    updateMessageNotResults(data: any): void;
    updateColspanTd(): void;
    destroy(): void;
}
