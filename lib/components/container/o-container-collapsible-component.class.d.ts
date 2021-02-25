import { AfterViewInit, ElementRef, Injector } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';
import { OContainerComponent } from './o-container-component.class';
export declare const DEFAULT_INPUTS_O_CONTAINER_COLLAPSIBLE: string[];
export declare class OContainerCollapsibleComponent extends OContainerComponent implements AfterViewInit {
    protected elRef: ElementRef;
    protected injector: Injector;
    protected matFormDefaultOption: any;
    expanded: boolean;
    collapsedHeight: string;
    expandedHeight: string;
    description: string;
    protected contentObserver: MutationObserver;
    expPanel: MatExpansionPanel;
    protected _containerCollapsibleRef: ElementRef<HTMLElement>;
    constructor(elRef: ElementRef, injector: Injector, matFormDefaultOption: any);
    ngAfterViewInit(): void;
    protected updateOutlineGap(): void;
    protected registerObserver(): void;
    protected updateHeightExpansionPanelContent(): void;
    protected unregisterContentObserver(): any;
    protected registerContentObserver(): any;
}
