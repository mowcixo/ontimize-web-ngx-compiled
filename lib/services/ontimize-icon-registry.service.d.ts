import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
export declare class OntimizeMatIconRegistry {
    protected domSanitizer: DomSanitizer;
    protected matIconRegistry: MatIconRegistry;
    static ONTIMIZE_ICON_SET_PATH: string;
    static ONTIMIZE_NAMESPACE: string;
    constructor(domSanitizer: DomSanitizer, matIconRegistry: MatIconRegistry);
    initialize(): void;
    addOntimizeSvgIcon(iconName: string, url: string): MatIconRegistry;
    getSVGElement(iconName: string): Observable<SVGElement>;
    existsIcon(iconName: string): Observable<boolean>;
}
