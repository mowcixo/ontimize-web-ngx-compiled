import { AfterViewInit } from '@angular/core';
import { OServiceComponent } from '../o-service-component.class';
export declare const DEFAULT_INPUT_O_EXPANDABLE_CONTAINER: string[];
export declare class OExpandableContainerComponent implements AfterViewInit {
    targets: Array<OServiceComponent>;
    data: any;
    constructor();
    ngAfterViewInit(): void;
}
