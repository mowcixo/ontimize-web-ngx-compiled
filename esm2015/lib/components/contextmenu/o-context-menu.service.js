import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { OContextMenuContentComponent } from './context-menu/o-context-menu-content.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/overlay";
export class OContextMenuService {
    constructor(overlay, scrollStrategy) {
        this.overlay = overlay;
        this.scrollStrategy = scrollStrategy;
        this.showContextMenu = new Subject();
        this.closeContextMenu = new Subject();
        this.overlays = [];
        this.fakeElement = new ElementRef({ nativeElement: '' });
        this.subscription = new Subscription();
        this.subscription.add(this.closeContextMenu.subscribe(() => this.destroyOverlays()));
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    openContextMenu(context) {
        this.destroyOverlays();
        this.createOverlay(context);
    }
    destroyOverlays() {
        if (this.overlays) {
            this.overlays.forEach((overlay) => {
                overlay.detach();
                overlay.dispose();
            });
        }
        this.overlays = [];
    }
    createOverlay(context) {
        context.event.preventDefault();
        context.event.stopPropagation();
        this.fakeElement.nativeElement.getBoundingClientRect = () => ({
            bottom: context.event.clientY,
            height: 0,
            left: context.event.clientX,
            right: context.event.clientX,
            top: context.event.clientY,
            width: 0,
        });
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(context.anchorElement || this.fakeElement)
            .withPositions([{
                overlayX: 'start',
                overlayY: 'top',
                originX: 'start',
                originY: 'bottom'
            }]);
        const overlayRef = this.overlay.create({
            positionStrategy: positionStrategy,
            hasBackdrop: false,
            panelClass: ['o-context-menu'],
            scrollStrategy: this.scrollStrategy.close()
        });
        this.overlays = [overlayRef];
        this.attachContextMenu(this.overlays[0], context);
    }
    attachContextMenu(overlay, context) {
        const contextMenuContent = overlay.attach(new ComponentPortal(OContextMenuContentComponent));
        contextMenuContent.instance.overlay = overlay;
        contextMenuContent.instance.menuItems = context.menuItems;
        contextMenuContent.instance.data = context.data;
        contextMenuContent.instance.menuClass = context.class;
        this.subscription.add(contextMenuContent.instance.close.subscribe(() => {
            this.closeContextMenu.next();
        }));
    }
}
OContextMenuService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
OContextMenuService.ctorParameters = () => [
    { type: Overlay },
    { type: ScrollStrategyOptions }
];
OContextMenuService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function OContextMenuService_Factory() { return new OContextMenuService(i0.ɵɵinject(i1.Overlay), i0.ɵɵinject(i1.ScrollStrategyOptions)); }, token: OContextMenuService, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jb250ZXh0LW1lbnUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9jb250ZXh0bWVudS9vLWNvbnRleHQtbWVudS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQWMscUJBQXFCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFnQixVQUFVLEVBQUUsVUFBVSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ2hGLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRzdDLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDOzs7QUFLL0YsTUFBTSxPQUFPLG1CQUFtQjtJQVU5QixZQUNVLE9BQWdCLEVBQ2hCLGNBQXFDO1FBRHJDLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBVnhDLG9CQUFlLEdBQXFDLElBQUksT0FBTyxFQUEyQixDQUFDO1FBQzNGLHFCQUFnQixHQUFtQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRzlDLGFBQVEsR0FBaUIsRUFBRSxDQUFDO1FBQzVCLGdCQUFXLEdBQWUsSUFBSSxVQUFVLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxpQkFBWSxHQUFpQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBTXhELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUFFTSxlQUFlLENBQUMsT0FBNkI7UUFDbEQsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVNLGVBQWU7UUFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2hDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDakIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBSVMsYUFBYSxDQUFDLE9BQTZCO1FBQ25ELE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUVoQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsR0FBRyxHQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDN0IsTUFBTSxFQUFFLENBQUM7WUFDVCxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQzNCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU87WUFDNUIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTztZQUMxQixLQUFLLEVBQUUsQ0FBQztTQUNULENBQUMsQ0FBQztRQUVILE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7YUFDN0MsbUJBQW1CLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQzlELGFBQWEsQ0FBQyxDQUFDO2dCQUNkLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixRQUFRLEVBQUUsS0FBSztnQkFDZixPQUFPLEVBQUUsT0FBTztnQkFDaEIsT0FBTyxFQUFFLFFBQVE7YUFDbEIsQ0FBQyxDQUFDLENBQUM7UUFFTixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUNyQyxnQkFBZ0IsRUFBRSxnQkFBZ0I7WUFDbEMsV0FBVyxFQUFFLEtBQUs7WUFDbEIsVUFBVSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDOUIsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFO1NBQzVDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU3QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRVMsaUJBQWlCLENBQUMsT0FBbUIsRUFBRSxPQUE2QjtRQUM1RSxNQUFNLGtCQUFrQixHQUFzQixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksZUFBZSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztRQUNoSCxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUM5QyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDMUQsa0JBQWtCLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ2hELGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN0RCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDckUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDOzs7WUFwRkYsVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7WUFWUSxPQUFPO1lBQWMscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheVJlZiwgU2Nyb2xsU3RyYXRlZ3lPcHRpb25zIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ29tcG9uZW50UG9ydGFsIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDb21wb25lbnRSZWYsIEVsZW1lbnRSZWYsIEluamVjdGFibGUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElPQ29udGV4dE1lbnVDbGlja0V2ZW50LCBJT0NvbnRleHRNZW51Q29udGV4dCB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvby1jb250ZXh0LW1lbnUuaW50ZXJmYWNlJztcbmltcG9ydCB7IE9Db250ZXh0TWVudUNvbnRlbnRDb21wb25lbnQgfSBmcm9tICcuL2NvbnRleHQtbWVudS9vLWNvbnRleHQtbWVudS1jb250ZW50LmNvbXBvbmVudCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE9Db250ZXh0TWVudVNlcnZpY2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyBzaG93Q29udGV4dE1lbnU6IFN1YmplY3Q8SU9Db250ZXh0TWVudUNsaWNrRXZlbnQ+ID0gbmV3IFN1YmplY3Q8SU9Db250ZXh0TWVudUNsaWNrRXZlbnQ+KCk7XG4gIHB1YmxpYyBjbG9zZUNvbnRleHRNZW51OiBTdWJqZWN0PEV2ZW50PiA9IG5ldyBTdWJqZWN0KCk7XG4gIHB1YmxpYyBhY3RpdmVNZW51OiBPQ29udGV4dE1lbnVDb250ZW50Q29tcG9uZW50O1xuXG4gIHByb3RlY3RlZCBvdmVybGF5czogT3ZlcmxheVJlZltdID0gW107XG4gIHByb3RlY3RlZCBmYWtlRWxlbWVudDogRWxlbWVudFJlZiA9IG5ldyBFbGVtZW50UmVmKHsgbmF0aXZlRWxlbWVudDogJycgfSk7XG4gIHByb3RlY3RlZCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG92ZXJsYXk6IE92ZXJsYXksXG4gICAgcHJpdmF0ZSBzY3JvbGxTdHJhdGVneTogU2Nyb2xsU3RyYXRlZ3lPcHRpb25zXG4gICkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZCh0aGlzLmNsb3NlQ29udGV4dE1lbnUuc3Vic2NyaWJlKCgpID0+IHRoaXMuZGVzdHJveU92ZXJsYXlzKCkpKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHVibGljIG9wZW5Db250ZXh0TWVudShjb250ZXh0OiBJT0NvbnRleHRNZW51Q29udGV4dCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveU92ZXJsYXlzKCk7XG4gICAgdGhpcy5jcmVhdGVPdmVybGF5KGNvbnRleHQpO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3lPdmVybGF5cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vdmVybGF5cykge1xuICAgICAgdGhpcy5vdmVybGF5cy5mb3JFYWNoKChvdmVybGF5KSA9PiB7XG4gICAgICAgIG92ZXJsYXkuZGV0YWNoKCk7XG4gICAgICAgIG92ZXJsYXkuZGlzcG9zZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMub3ZlcmxheXMgPSBbXTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBvdmVybGF5IGFuZCBhdHRhY2ggYG8tY29udGV4dC1tZW51LWNvbnRlbnRgIHRvIGl0IGluIG9yZGVyIHRvIHRyaWdnZXIgdGhlIG1lbnUgY2xpY2ssIHRoZSBtZW51IG9wZW5zIGluIGEgbmV3IG92ZXJsYXlcbiAgLy8gVE9ETzogdHJ5IHRvIHVzZSBvbmx5IG9uZSBvdmVybGF5XG4gIHByb3RlY3RlZCBjcmVhdGVPdmVybGF5KGNvbnRleHQ6IElPQ29udGV4dE1lbnVDb250ZXh0KTogdm9pZCB7XG4gICAgY29udGV4dC5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnRleHQuZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB0aGlzLmZha2VFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID0gKCk6IENsaWVudFJlY3QgPT4gKHtcbiAgICAgIGJvdHRvbTogY29udGV4dC5ldmVudC5jbGllbnRZLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgbGVmdDogY29udGV4dC5ldmVudC5jbGllbnRYLFxuICAgICAgcmlnaHQ6IGNvbnRleHQuZXZlbnQuY2xpZW50WCxcbiAgICAgIHRvcDogY29udGV4dC5ldmVudC5jbGllbnRZLFxuICAgICAgd2lkdGg6IDAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBwb3NpdGlvblN0cmF0ZWd5ID0gdGhpcy5vdmVybGF5LnBvc2l0aW9uKClcbiAgICAgIC5mbGV4aWJsZUNvbm5lY3RlZFRvKGNvbnRleHQuYW5jaG9yRWxlbWVudCB8fCB0aGlzLmZha2VFbGVtZW50KVxuICAgICAgLndpdGhQb3NpdGlvbnMoW3tcbiAgICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgICAgb3JpZ2luWTogJ2JvdHRvbSdcbiAgICAgIH1dKTtcblxuICAgIGNvbnN0IG92ZXJsYXlSZWYgPSB0aGlzLm92ZXJsYXkuY3JlYXRlKHtcbiAgICAgIHBvc2l0aW9uU3RyYXRlZ3k6IHBvc2l0aW9uU3RyYXRlZ3ksXG4gICAgICBoYXNCYWNrZHJvcDogZmFsc2UsXG4gICAgICBwYW5lbENsYXNzOiBbJ28tY29udGV4dC1tZW51J10sXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5zY3JvbGxTdHJhdGVneS5jbG9zZSgpXG4gICAgfSk7XG5cbiAgICB0aGlzLm92ZXJsYXlzID0gW292ZXJsYXlSZWZdO1xuXG4gICAgdGhpcy5hdHRhY2hDb250ZXh0TWVudSh0aGlzLm92ZXJsYXlzWzBdLCBjb250ZXh0KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhdHRhY2hDb250ZXh0TWVudShvdmVybGF5OiBPdmVybGF5UmVmLCBjb250ZXh0OiBJT0NvbnRleHRNZW51Q29udGV4dCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHRNZW51Q29udGVudDogQ29tcG9uZW50UmVmPGFueT4gPSBvdmVybGF5LmF0dGFjaChuZXcgQ29tcG9uZW50UG9ydGFsKE9Db250ZXh0TWVudUNvbnRlbnRDb21wb25lbnQpKTtcbiAgICBjb250ZXh0TWVudUNvbnRlbnQuaW5zdGFuY2Uub3ZlcmxheSA9IG92ZXJsYXk7XG4gICAgY29udGV4dE1lbnVDb250ZW50Lmluc3RhbmNlLm1lbnVJdGVtcyA9IGNvbnRleHQubWVudUl0ZW1zO1xuICAgIGNvbnRleHRNZW51Q29udGVudC5pbnN0YW5jZS5kYXRhID0gY29udGV4dC5kYXRhO1xuICAgIGNvbnRleHRNZW51Q29udGVudC5pbnN0YW5jZS5tZW51Q2xhc3MgPSBjb250ZXh0LmNsYXNzO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uLmFkZChjb250ZXh0TWVudUNvbnRlbnQuaW5zdGFuY2UuY2xvc2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY2xvc2VDb250ZXh0TWVudS5uZXh0KCk7XG4gICAgfSkpO1xuICB9XG5cbn1cbiJdfQ==