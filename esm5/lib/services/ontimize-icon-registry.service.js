import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
var OntimizeMatIconRegistry = (function () {
    function OntimizeMatIconRegistry(domSanitizer, matIconRegistry) {
        this.domSanitizer = domSanitizer;
        this.matIconRegistry = matIconRegistry;
    }
    OntimizeMatIconRegistry.prototype.initialize = function () {
        this.matIconRegistry.addSvgIconSetInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE, this.domSanitizer.bypassSecurityTrustResourceUrl(OntimizeMatIconRegistry.ONTIMIZE_ICON_SET_PATH));
    };
    OntimizeMatIconRegistry.prototype.addOntimizeSvgIcon = function (iconName, url) {
        this.matIconRegistry.addSvgIconInNamespace(OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE, iconName, this.domSanitizer.bypassSecurityTrustResourceUrl(url));
        return this.matIconRegistry;
    };
    OntimizeMatIconRegistry.prototype.getSVGElement = function (iconName) {
        return this.matIconRegistry.getNamedSvgIcon(iconName, OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE);
    };
    OntimizeMatIconRegistry.prototype.existsIcon = function (iconName) {
        var self = this;
        return new Observable(function (observer) {
            self.getSVGElement(iconName).subscribe(function (value) {
                observer.next(true);
            }, function (error) {
                observer.next(false);
            }, function () { return observer.complete(); });
        });
    };
    OntimizeMatIconRegistry.ONTIMIZE_ICON_SET_PATH = 'assets/svg/ontimize-icon-set.svg';
    OntimizeMatIconRegistry.ONTIMIZE_NAMESPACE = 'ontimize';
    OntimizeMatIconRegistry.decorators = [
        { type: Injectable }
    ];
    OntimizeMatIconRegistry.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: MatIconRegistry }
    ]; };
    return OntimizeMatIconRegistry;
}());
export { OntimizeMatIconRegistry };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib250aW1pemUtaWNvbi1yZWdpc3RyeS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9zZXJ2aWNlcy9vbnRpbWl6ZS1pY29uLXJlZ2lzdHJ5LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxVQUFVLEVBQVksTUFBTSxNQUFNLENBQUM7QUFFNUM7SUFNRSxpQ0FDWSxZQUEwQixFQUMxQixlQUFnQztRQURoQyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7SUFHNUMsQ0FBQztJQUVELDRDQUFVLEdBQVY7UUFDRSxJQUFJLENBQUMsZUFBZSxDQUFDLHdCQUF3QixDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixFQUN0RixJQUFJLENBQUMsWUFBWSxDQUFDLDhCQUE4QixDQUFDLHVCQUF1QixDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQztJQUN0RyxDQUFDO0lBRUQsb0RBQWtCLEdBQWxCLFVBQW1CLFFBQWdCLEVBQUUsR0FBVztRQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixDQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFDN0YsSUFBSSxDQUFDLFlBQVksQ0FBQyw4QkFBOEIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUM5QixDQUFDO0lBRUQsK0NBQWEsR0FBYixVQUFjLFFBQWdCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLHVCQUF1QixDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUVELDRDQUFVLEdBQVYsVUFBVyxRQUFnQjtRQUN6QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxJQUFJLFVBQVUsQ0FBVSxVQUFDLFFBQTJCO1lBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUMsS0FBaUI7Z0JBQ3ZELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsQ0FBQyxFQUFFLFVBQUEsS0FBSztnQkFDTixRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUMsRUFBRSxjQUFNLE9BQUEsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFuQixDQUFtQixDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBbENhLDhDQUFzQixHQUFHLGtDQUFrQyxDQUFDO0lBQzVELDBDQUFrQixHQUFHLFVBQVUsQ0FBQzs7Z0JBSi9DLFVBQVU7OztnQkFIRixZQUFZO2dCQURaLGVBQWU7O0lBMEN4Qiw4QkFBQztDQUFBLEFBdENELElBc0NDO1NBckNZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdEljb25SZWdpc3RyeSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE9udGltaXplTWF0SWNvblJlZ2lzdHJ5IHtcblxuICBwdWJsaWMgc3RhdGljIE9OVElNSVpFX0lDT05fU0VUX1BBVEggPSAnYXNzZXRzL3N2Zy9vbnRpbWl6ZS1pY29uLXNldC5zdmcnO1xuICBwdWJsaWMgc3RhdGljIE9OVElNSVpFX05BTUVTUEFDRSA9ICdvbnRpbWl6ZSc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGRvbVNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIHByb3RlY3RlZCBtYXRJY29uUmVnaXN0cnk6IE1hdEljb25SZWdpc3RyeVxuICApIHtcblxuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLm1hdEljb25SZWdpc3RyeS5hZGRTdmdJY29uU2V0SW5OYW1lc3BhY2UoT250aW1pemVNYXRJY29uUmVnaXN0cnkuT05USU1JWkVfTkFNRVNQQUNFLFxuICAgICAgdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdFJlc291cmNlVXJsKE9udGltaXplTWF0SWNvblJlZ2lzdHJ5Lk9OVElNSVpFX0lDT05fU0VUX1BBVEgpKTtcbiAgfVxuXG4gIGFkZE9udGltaXplU3ZnSWNvbihpY29uTmFtZTogc3RyaW5nLCB1cmw6IHN0cmluZyk6IE1hdEljb25SZWdpc3RyeSB7XG4gICAgdGhpcy5tYXRJY29uUmVnaXN0cnkuYWRkU3ZnSWNvbkluTmFtZXNwYWNlKE9udGltaXplTWF0SWNvblJlZ2lzdHJ5Lk9OVElNSVpFX05BTUVTUEFDRSwgaWNvbk5hbWUsXG4gICAgICB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0UmVzb3VyY2VVcmwodXJsKSk7XG4gICAgcmV0dXJuIHRoaXMubWF0SWNvblJlZ2lzdHJ5O1xuICB9XG5cbiAgZ2V0U1ZHRWxlbWVudChpY29uTmFtZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxTVkdFbGVtZW50PiB7XG4gICAgcmV0dXJuIHRoaXMubWF0SWNvblJlZ2lzdHJ5LmdldE5hbWVkU3ZnSWNvbihpY29uTmFtZSwgT250aW1pemVNYXRJY29uUmVnaXN0cnkuT05USU1JWkVfTkFNRVNQQUNFKTtcbiAgfVxuXG4gIGV4aXN0c0ljb24oaWNvbk5hbWU6IHN0cmluZyk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxib29sZWFuPigob2JzZXJ2ZXI6IE9ic2VydmVyPGJvb2xlYW4+KSA9PiB7XG4gICAgICBzZWxmLmdldFNWR0VsZW1lbnQoaWNvbk5hbWUpLnN1YnNjcmliZSgodmFsdWU6IFNWR0VsZW1lbnQpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCh0cnVlKTtcbiAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChmYWxzZSk7XG4gICAgICB9LCAoKSA9PiBvYnNlcnZlci5jb21wbGV0ZSgpKTtcbiAgICB9KTtcbiAgfVxufVxuIl19