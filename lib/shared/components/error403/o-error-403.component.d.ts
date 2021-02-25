import { Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService, ONavigationItem } from '../../../services/navigation.service';
export declare class Error403Component {
    protected injector: Injector;
    protected router: Router;
    protected navigationService: NavigationService;
    protected lastPageData: ONavigationItem;
    constructor(injector: Injector);
    onNavigateBackClick(): void;
}
