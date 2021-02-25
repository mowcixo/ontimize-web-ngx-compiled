import { Overlay, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { IOContextMenuClickEvent, IOContextMenuContext } from '../../interfaces/o-context-menu.interface';
import { OContextMenuContentComponent } from './context-menu/o-context-menu-content.component';
export declare class OContextMenuService implements OnDestroy {
    private overlay;
    private scrollStrategy;
    showContextMenu: Subject<IOContextMenuClickEvent>;
    closeContextMenu: Subject<Event>;
    activeMenu: OContextMenuContentComponent;
    protected overlays: OverlayRef[];
    protected fakeElement: ElementRef;
    protected subscription: Subscription;
    constructor(overlay: Overlay, scrollStrategy: ScrollStrategyOptions);
    ngOnDestroy(): void;
    openContextMenu(context: IOContextMenuContext): void;
    destroyOverlays(): void;
    protected createOverlay(context: IOContextMenuContext): void;
    protected attachContextMenu(overlay: OverlayRef, context: IOContextMenuContext): void;
}
