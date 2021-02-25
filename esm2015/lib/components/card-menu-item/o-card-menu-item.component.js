import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChildren, ElementRef, Injector, QueryList, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputConverter } from '../../decorators/input-converter';
import { OTranslateService } from '../../services/translate/o-translate.service';
export const DEFAULT_INPUTS_O_MENU_CARD = [
    'title',
    'image',
    'icon',
    'tooltip',
    'buttonText : button-text',
    'disabledButton : disabled-button',
    'mainContainerLayout : main-container-layout',
    'secondaryContainerLayout : secondary-container-layout',
    'route',
    'detailComponent : detail-component',
    'detailComponentInputs : detail-component-inputs',
    'action'
];
export const DEFAULT_OUTPUTS_O_MENU_CARD = [];
export class OCardMenuItemComponent {
    constructor(injector, router, actRoute, resolver, cd, elRef) {
        this.injector = injector;
        this.router = router;
        this.actRoute = actRoute;
        this.resolver = resolver;
        this.cd = cd;
        this.elRef = elRef;
        this.disabledButton = false;
        this.mainContainerLayout = 'column';
        this.secondaryContainerLayout = 'column';
        this._showSecondaryContainer = true;
        this.translateService = this.injector.get(OTranslateService);
        this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
            this.cd.detectChanges();
        });
    }
    set detailComponentContainer(content) {
        this._detailComponentContainer = content;
    }
    get detailComponentContainer() {
        return this._detailComponentContainer;
    }
    ngAfterViewInit() {
        if (this.detailComponentContainer && this.detailComponent) {
            const factory = this.resolver.resolveComponentFactory(this.detailComponent);
            const ref = this.detailComponentContainer.createComponent(factory);
            if (this.detailComponentInputs && ref.instance) {
                const keys = Object.keys(this.detailComponentInputs);
                for (let i = 0, len = keys.length; i < len; i++) {
                    ref.instance[keys[i]] = this.detailComponentInputs[keys[i]];
                }
            }
        }
        this.showSecondaryContainer = (this.detailComponentContainer && this.detailComponent) || this.secondaryContent.length > 0;
        this.cd.detectChanges();
    }
    ngOnDestroy() {
        if (this.translateServiceSubscription) {
            this.translateServiceSubscription.unsubscribe();
        }
    }
    useImage() {
        return this.image !== undefined;
    }
    useIcon() {
        return this.icon !== undefined && this.image === undefined;
    }
    onButtonClick() {
        if (this.route) {
            this.router.navigate([this.route], {
                relativeTo: this.actRoute
            });
        }
        else if (this.action) {
            this.action();
        }
    }
    onClick() {
        if (this.buttonText === undefined) {
            this.onButtonClick();
        }
    }
    get showSecondaryContainer() {
        return this._showSecondaryContainer;
    }
    set showSecondaryContainer(val) {
        this._showSecondaryContainer = val;
        if (val) {
            this.elRef.nativeElement.classList.remove('compact');
        }
        else {
            this.elRef.nativeElement.classList.add('compact');
        }
    }
}
OCardMenuItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'o-card-menu-item',
                template: "<div class=\"o-card-menu-item-content\" (click)=\"onClick()\" fxLayout=\"column\" fxFill fxLayoutAlign=\"space-between center\"\n  layout-padding>\n\n  <div class=\"o-card-menu-item-main\" fxFlex=\"{{ showSecondaryContainer ? '40' : '80' }}\" [fxLayout]=\"mainContainerLayout\"\n    fxLayoutAlign=\"space-between center\">\n    <div *ngIf=\"useImage() || useIcon()\" fxFlex=\"80\" fxLayout=\"column\" fxLayoutAlign=\"center center\" class=\"o-card-menu-item-image-container\">\n      <img *ngIf=\"useImage()\" [src]=\"image\" />\n      <mat-icon *ngIf=\"useIcon()\" class=\"o-card-menu-item-icon\" fxLayoutAlign=\"center center\">{{ icon }}</mat-icon>\n    </div>\n\n    <div class=\"o-card-menu-item-title\" fxFlex=\"20\" fxLayout=\"column\" fxLayoutAlign=\"center center\" *ngIf=\"title !== undefined\">{{\n      title | oTranslate }}</div>\n\n    <mat-icon class=\"o-card-menu-item-info\" matTooltip=\"{{ tooltip | oTranslate }}\" *ngIf=\"tooltip\" svgIcon=\"ontimize:info_outline\"></mat-icon>\n\n    <ng-content select=\".main-container\"></ng-content>\n  </div>\n\n  <button type=\"button\" *ngIf=\"buttonText !== undefined\" [disabled]=\"disabledButton\" (click)=\"onButtonClick()\"\n    mat-button>{{ buttonText | oTranslate }}</button>\n\n  <div *ngIf=\"showSecondaryContainer\" class=\"o-card-menu-item-secondary\" fxFlex=\"50\" [fxLayout]=\"secondaryContainerLayout\"\n    fxLayoutAlign=\"space-around center\">\n    <ng-content select=\".secondary-container\"></ng-content>\n    <ng-container #menuCardContent *ngIf=\"detailComponent\">\n    </ng-container>\n  </div>\n</div>\n",
                inputs: DEFAULT_INPUTS_O_MENU_CARD,
                outputs: DEFAULT_OUTPUTS_O_MENU_CARD,
                encapsulation: ViewEncapsulation.None,
                host: {
                    '[class.o-card-menu-item]': 'true',
                    '[class.mat-elevation-z1]': 'true',
                    '[class.compact]': '!showSecondaryContainer'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [".o-card-menu-item{border-radius:3px}.o-card-menu-item .o-card-menu-item-main,.o-card-menu-item .o-card-menu-item-secondary{width:100%;padding:12px 0}.o-card-menu-item .o-card-menu-item-image-container{width:100%}.o-card-menu-item .o-card-menu-item-image-container .o-card-menu-item-icon{width:100%;height:100%;font-size:5em}.o-card-menu-item .o-card-menu-item-image-container img{max-width:100%;max-height:100%}.o-card-menu-item .mat-button,.o-card-menu-item .o-card-menu-item-title{font-weight:600}.o-card-menu-item .mat-button{width:100%;border-radius:5px;text-decoration:none}.o-card-menu-item .o-card-menu-item-main{position:relative}.o-card-menu-item .o-card-menu-item-icon,.o-card-menu-item .o-card-menu-item-title{cursor:default}.o-card-menu-item .o-card-menu-item-info{cursor:default;position:absolute;top:0;right:0}"]
            }] }
];
OCardMenuItemComponent.ctorParameters = () => [
    { type: Injector },
    { type: Router },
    { type: ActivatedRoute },
    { type: ComponentFactoryResolver },
    { type: ChangeDetectorRef },
    { type: ElementRef }
];
OCardMenuItemComponent.propDecorators = {
    detailComponentContainer: [{ type: ViewChild, args: ['menuCardContent', { read: ViewContainerRef, static: false },] }],
    secondaryContent: [{ type: ContentChildren, args: ['.secondary-container',] }]
};
tslib_1.__decorate([
    InputConverter(),
    tslib_1.__metadata("design:type", Boolean)
], OCardMenuItemComponent.prototype, "disabledButton", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jYXJkLW1lbnUtaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY2FyZC1tZW51LWl0ZW0vby1jYXJkLW1lbnUtaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCx3QkFBd0IsRUFDeEIsZUFBZSxFQUNmLFVBQVUsRUFDVixRQUFRLEVBRVIsU0FBUyxFQUNULFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRWpGLE1BQU0sQ0FBQyxNQUFNLDBCQUEwQixHQUFHO0lBQ3hDLE9BQU87SUFDUCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFNBQVM7SUFDVCwwQkFBMEI7SUFDMUIsa0NBQWtDO0lBQ2xDLDZDQUE2QztJQUM3Qyx1REFBdUQ7SUFDdkQsT0FBTztJQUNQLG9DQUFvQztJQUNwQyxpREFBaUQ7SUFDakQsUUFBUTtDQUNULENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7QUFnQjlDLE1BQU0sT0FBTyxzQkFBc0I7SUFtQ2pDLFlBQ1ksUUFBa0IsRUFDbEIsTUFBYyxFQUNkLFFBQXdCLEVBQ3hCLFFBQWtDLEVBQ2xDLEVBQXFCLEVBQ3JCLEtBQWlCO1FBTGpCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQWdCO1FBQ3hCLGFBQVEsR0FB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dCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudEZhY3RvcnksXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgT25EZXN0cm95LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSW5wdXRDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9kZWNvcmF0b3JzL2lucHV0LWNvbnZlcnRlcic7XG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fTUVOVV9DQVJEID0gW1xuICAndGl0bGUnLFxuICAnaW1hZ2UnLFxuICAnaWNvbicsXG4gICd0b29sdGlwJyxcbiAgJ2J1dHRvblRleHQgOiBidXR0b24tdGV4dCcsXG4gICdkaXNhYmxlZEJ1dHRvbiA6IGRpc2FibGVkLWJ1dHRvbicsXG4gICdtYWluQ29udGFpbmVyTGF5b3V0IDogbWFpbi1jb250YWluZXItbGF5b3V0JyxcbiAgJ3NlY29uZGFyeUNvbnRhaW5lckxheW91dCA6IHNlY29uZGFyeS1jb250YWluZXItbGF5b3V0JyxcbiAgJ3JvdXRlJyxcbiAgJ2RldGFpbENvbXBvbmVudCA6IGRldGFpbC1jb21wb25lbnQnLFxuICAnZGV0YWlsQ29tcG9uZW50SW5wdXRzIDogZGV0YWlsLWNvbXBvbmVudC1pbnB1dHMnLFxuICAnYWN0aW9uJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX01FTlVfQ0FSRCA9IFtdO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWNhcmQtbWVudS1pdGVtJyxcbiAgdGVtcGxhdGVVcmw6ICcuL28tY2FyZC1tZW51LWl0ZW0uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWNhcmQtbWVudS1pdGVtLmNvbXBvbmVudC5zY3NzJ10sXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19NRU5VX0NBUkQsXG4gIG91dHB1dHM6IERFRkFVTFRfT1VUUFVUU19PX01FTlVfQ0FSRCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3Muby1jYXJkLW1lbnUtaXRlbV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5tYXQtZWxldmF0aW9uLXoxXSc6ICd0cnVlJyxcbiAgICAnW2NsYXNzLmNvbXBhY3RdJzogJyFzaG93U2Vjb25kYXJ5Q29udGFpbmVyJ1xuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBPQ2FyZE1lbnVJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICB0aXRsZTogc3RyaW5nO1xuICBpbWFnZTogc3RyaW5nO1xuICBpY29uOiBzdHJpbmc7XG4gIHRvb2x0aXA6IHN0cmluZztcbiAgYnV0dG9uVGV4dDogc3RyaW5nO1xuICBASW5wdXRDb252ZXJ0ZXIoKVxuICBkaXNhYmxlZEJ1dHRvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBtYWluQ29udGFpbmVyTGF5b3V0ID0gJ2NvbHVtbic7XG4gIHNlY29uZGFyeUNvbnRhaW5lckxheW91dCA9ICdjb2x1bW4nO1xuICByb3V0ZTogc3RyaW5nO1xuICBhY3Rpb246ICgpID0+IHZvaWQ7XG4gIGRldGFpbENvbXBvbmVudDogYW55O1xuICBkZXRhaWxDb21wb25lbnRJbnB1dHM6IG9iamVjdDtcblxuICBwcm90ZWN0ZWQgX2RldGFpbENvbXBvbmVudENvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZjtcblxuICBAVmlld0NoaWxkKCdtZW51Q2FyZENvbnRlbnQnLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogZmFsc2UgfSlcbiAgc2V0IGRldGFpbENvbXBvbmVudENvbnRhaW5lcihjb250ZW50OiBWaWV3Q29udGFpbmVyUmVmKSB7XG4gICAgdGhpcy5fZGV0YWlsQ29tcG9uZW50Q29udGFpbmVyID0gY29udGVudDtcbiAgfVxuXG4gIGdldCBkZXRhaWxDb21wb25lbnRDb250YWluZXIoKTogVmlld0NvbnRhaW5lclJlZiB7XG4gICAgcmV0dXJuIHRoaXMuX2RldGFpbENvbXBvbmVudENvbnRhaW5lcjtcbiAgfVxuXG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlOiBPVHJhbnNsYXRlU2VydmljZTtcbiAgcHJvdGVjdGVkIHRyYW5zbGF0ZVNlcnZpY2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBAQ29udGVudENoaWxkcmVuKCcuc2Vjb25kYXJ5LWNvbnRhaW5lcicpXG4gIHNlY29uZGFyeUNvbnRlbnQ6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gIHByb3RlY3RlZCBfc2hvd1NlY29uZGFyeUNvbnRhaW5lcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJvdGVjdGVkIGFjdFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcm90ZWN0ZWQgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcm90ZWN0ZWQgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZlxuICApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLm9uTGFuZ3VhZ2VDaGFuZ2VkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5kZXRhaWxDb21wb25lbnRDb250YWluZXIgJiYgdGhpcy5kZXRhaWxDb21wb25lbnQpIHtcbiAgICAgIGNvbnN0IGZhY3Rvcnk6IENvbXBvbmVudEZhY3Rvcnk8YW55PiA9IHRoaXMucmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkodGhpcy5kZXRhaWxDb21wb25lbnQpO1xuICAgICAgY29uc3QgcmVmID0gdGhpcy5kZXRhaWxDb21wb25lbnRDb250YWluZXIuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpO1xuICAgICAgaWYgKHRoaXMuZGV0YWlsQ29tcG9uZW50SW5wdXRzICYmIHJlZi5pbnN0YW5jZSkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5kZXRhaWxDb21wb25lbnRJbnB1dHMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIHJlZi5pbnN0YW5jZVtrZXlzW2ldXSA9IHRoaXMuZGV0YWlsQ29tcG9uZW50SW5wdXRzW2tleXNbaV1dO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2hvd1NlY29uZGFyeUNvbnRhaW5lciA9ICh0aGlzLmRldGFpbENvbXBvbmVudENvbnRhaW5lciAmJiB0aGlzLmRldGFpbENvbXBvbmVudCkgfHwgdGhpcy5zZWNvbmRhcnlDb250ZW50Lmxlbmd0aCA+IDA7XG4gICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy50cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICB1c2VJbWFnZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbWFnZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgdXNlSWNvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pY29uICE9PSB1bmRlZmluZWQgJiYgdGhpcy5pbWFnZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgb25CdXR0b25DbGljaygpIHtcbiAgICBpZiAodGhpcy5yb3V0ZSkge1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMucm91dGVdLCB7XG4gICAgICAgIHJlbGF0aXZlVG86IHRoaXMuYWN0Um91dGVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3Rpb24pIHtcbiAgICAgIHRoaXMuYWN0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgb25DbGljaygpIHtcbiAgICBpZiAodGhpcy5idXR0b25UZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25CdXR0b25DbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzaG93U2Vjb25kYXJ5Q29udGFpbmVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9zaG93U2Vjb25kYXJ5Q29udGFpbmVyO1xuICB9XG5cbiAgc2V0IHNob3dTZWNvbmRhcnlDb250YWluZXIodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1NlY29uZGFyeUNvbnRhaW5lciA9IHZhbDtcbiAgICBpZiAodmFsKSB7XG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY29tcGFjdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY29tcGFjdCcpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=