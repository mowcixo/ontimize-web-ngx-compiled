import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChildren, ElementRef, Injector, QueryList, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputConverter } from '../../decorators/input-converter';
import { OTranslateService } from '../../services/translate/o-translate.service';
export var DEFAULT_INPUTS_O_MENU_CARD = [
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
export var DEFAULT_OUTPUTS_O_MENU_CARD = [];
var OCardMenuItemComponent = (function () {
    function OCardMenuItemComponent(injector, router, actRoute, resolver, cd, elRef) {
        var _this = this;
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
        this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(function () {
            _this.cd.detectChanges();
        });
    }
    Object.defineProperty(OCardMenuItemComponent.prototype, "detailComponentContainer", {
        get: function () {
            return this._detailComponentContainer;
        },
        set: function (content) {
            this._detailComponentContainer = content;
        },
        enumerable: true,
        configurable: true
    });
    OCardMenuItemComponent.prototype.ngAfterViewInit = function () {
        if (this.detailComponentContainer && this.detailComponent) {
            var factory = this.resolver.resolveComponentFactory(this.detailComponent);
            var ref = this.detailComponentContainer.createComponent(factory);
            if (this.detailComponentInputs && ref.instance) {
                var keys = Object.keys(this.detailComponentInputs);
                for (var i = 0, len = keys.length; i < len; i++) {
                    ref.instance[keys[i]] = this.detailComponentInputs[keys[i]];
                }
            }
        }
        this.showSecondaryContainer = (this.detailComponentContainer && this.detailComponent) || this.secondaryContent.length > 0;
        this.cd.detectChanges();
    };
    OCardMenuItemComponent.prototype.ngOnDestroy = function () {
        if (this.translateServiceSubscription) {
            this.translateServiceSubscription.unsubscribe();
        }
    };
    OCardMenuItemComponent.prototype.useImage = function () {
        return this.image !== undefined;
    };
    OCardMenuItemComponent.prototype.useIcon = function () {
        return this.icon !== undefined && this.image === undefined;
    };
    OCardMenuItemComponent.prototype.onButtonClick = function () {
        if (this.route) {
            this.router.navigate([this.route], {
                relativeTo: this.actRoute
            });
        }
        else if (this.action) {
            this.action();
        }
    };
    OCardMenuItemComponent.prototype.onClick = function () {
        if (this.buttonText === undefined) {
            this.onButtonClick();
        }
    };
    Object.defineProperty(OCardMenuItemComponent.prototype, "showSecondaryContainer", {
        get: function () {
            return this._showSecondaryContainer;
        },
        set: function (val) {
            this._showSecondaryContainer = val;
            if (val) {
                this.elRef.nativeElement.classList.remove('compact');
            }
            else {
                this.elRef.nativeElement.classList.add('compact');
            }
        },
        enumerable: true,
        configurable: true
    });
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
    OCardMenuItemComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: Router },
        { type: ActivatedRoute },
        { type: ComponentFactoryResolver },
        { type: ChangeDetectorRef },
        { type: ElementRef }
    ]; };
    OCardMenuItemComponent.propDecorators = {
        detailComponentContainer: [{ type: ViewChild, args: ['menuCardContent', { read: ViewContainerRef, static: false },] }],
        secondaryContent: [{ type: ContentChildren, args: ['.secondary-container',] }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], OCardMenuItemComponent.prototype, "disabledButton", void 0);
    return OCardMenuItemComponent;
}());
export { OCardMenuItemComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1jYXJkLW1lbnUtaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvY2FyZC1tZW51LWl0ZW0vby1jYXJkLW1lbnUtaXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCx3QkFBd0IsRUFDeEIsZUFBZSxFQUNmLFVBQVUsRUFDVixRQUFRLEVBRVIsU0FBUyxFQUNULFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHekQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBRWpGLE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixHQUFHO0lBQ3hDLE9BQU87SUFDUCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFNBQVM7SUFDVCwwQkFBMEI7SUFDMUIsa0NBQWtDO0lBQ2xDLDZDQUE2QztJQUM3Qyx1REFBdUQ7SUFDdkQsT0FBTztJQUNQLG9DQUFvQztJQUNwQyxpREFBaUQ7SUFDakQsUUFBUTtDQUNULENBQUM7QUFFRixNQUFNLENBQUMsSUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7QUFFOUM7SUFpREUsZ0NBQ1ksUUFBa0IsRUFDbEIsTUFBYyxFQUNkLFFBQXdCLEVBQ3hCLFFBQWtDLEVBQ2xDLEVBQXFCLEVBQ3JCLEtBQWlCO1FBTjdCLGlCQVlDO1FBWFcsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFDeEIsYUFBUSxHQUFSLFFBQVEs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QztDQUFBLEFBekhELElBeUhDO1NBM0dZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IElucHV0Q29udmVydGVyIH0gZnJvbSAnLi4vLi4vZGVjb3JhdG9ycy9pbnB1dC1jb252ZXJ0ZXInO1xuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0lOUFVUU19PX01FTlVfQ0FSRCA9IFtcbiAgJ3RpdGxlJyxcbiAgJ2ltYWdlJyxcbiAgJ2ljb24nLFxuICAndG9vbHRpcCcsXG4gICdidXR0b25UZXh0IDogYnV0dG9uLXRleHQnLFxuICAnZGlzYWJsZWRCdXR0b24gOiBkaXNhYmxlZC1idXR0b24nLFxuICAnbWFpbkNvbnRhaW5lckxheW91dCA6IG1haW4tY29udGFpbmVyLWxheW91dCcsXG4gICdzZWNvbmRhcnlDb250YWluZXJMYXlvdXQgOiBzZWNvbmRhcnktY29udGFpbmVyLWxheW91dCcsXG4gICdyb3V0ZScsXG4gICdkZXRhaWxDb21wb25lbnQgOiBkZXRhaWwtY29tcG9uZW50JyxcbiAgJ2RldGFpbENvbXBvbmVudElucHV0cyA6IGRldGFpbC1jb21wb25lbnQtaW5wdXRzJyxcbiAgJ2FjdGlvbidcbl07XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX09VVFBVVFNfT19NRU5VX0NBUkQgPSBbXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1jYXJkLW1lbnUtaXRlbScsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWNhcmQtbWVudS1pdGVtLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1jYXJkLW1lbnUtaXRlbS5jb21wb25lbnQuc2NzcyddLFxuICBpbnB1dHM6IERFRkFVTFRfSU5QVVRTX09fTUVOVV9DQVJELFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19NRU5VX0NBUkQsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tY2FyZC1tZW51LWl0ZW1dJzogJ3RydWUnLFxuICAgICdbY2xhc3MubWF0LWVsZXZhdGlvbi16MV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5jb21wYWN0XSc6ICchc2hvd1NlY29uZGFyeUNvbnRhaW5lcidcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgT0NhcmRNZW51SXRlbUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgdGl0bGU6IHN0cmluZztcbiAgaW1hZ2U6IHN0cmluZztcbiAgaWNvbjogc3RyaW5nO1xuICB0b29sdGlwOiBzdHJpbmc7XG4gIGJ1dHRvblRleHQ6IHN0cmluZztcbiAgQElucHV0Q29udmVydGVyKClcbiAgZGlzYWJsZWRCdXR0b246IGJvb2xlYW4gPSBmYWxzZTtcbiAgbWFpbkNvbnRhaW5lckxheW91dCA9ICdjb2x1bW4nO1xuICBzZWNvbmRhcnlDb250YWluZXJMYXlvdXQgPSAnY29sdW1uJztcbiAgcm91dGU6IHN0cmluZztcbiAgYWN0aW9uOiAoKSA9PiB2b2lkO1xuICBkZXRhaWxDb21wb25lbnQ6IGFueTtcbiAgZGV0YWlsQ29tcG9uZW50SW5wdXRzOiBvYmplY3Q7XG5cbiAgcHJvdGVjdGVkIF9kZXRhaWxDb21wb25lbnRDb250YWluZXI6IFZpZXdDb250YWluZXJSZWY7XG5cbiAgQFZpZXdDaGlsZCgnbWVudUNhcmRDb250ZW50JywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmLCBzdGF0aWM6IGZhbHNlIH0pXG4gIHNldCBkZXRhaWxDb21wb25lbnRDb250YWluZXIoY29udGVudDogVmlld0NvbnRhaW5lclJlZikge1xuICAgIHRoaXMuX2RldGFpbENvbXBvbmVudENvbnRhaW5lciA9IGNvbnRlbnQ7XG4gIH1cblxuICBnZXQgZGV0YWlsQ29tcG9uZW50Q29udGFpbmVyKCk6IFZpZXdDb250YWluZXJSZWYge1xuICAgIHJldHVybiB0aGlzLl9kZXRhaWxDb21wb25lbnRDb250YWluZXI7XG4gIH1cblxuICBwcm90ZWN0ZWQgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByb3RlY3RlZCB0cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQENvbnRlbnRDaGlsZHJlbignLnNlY29uZGFyeS1jb250YWluZXInKVxuICBzZWNvbmRhcnlDb250ZW50OiBRdWVyeUxpc3Q8YW55PjtcblxuICBwcm90ZWN0ZWQgX3Nob3dTZWNvbmRhcnlDb250YWluZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyLFxuICAgIHByb3RlY3RlZCBhY3RSb3V0ZTogQWN0aXZhdGVkUm91dGUsXG4gICAgcHJvdGVjdGVkIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJvdGVjdGVkIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcm90ZWN0ZWQgZWxSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlID0gdGhpcy5pbmplY3Rvci5nZXQoT1RyYW5zbGF0ZVNlcnZpY2UpO1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZVN1YnNjcmlwdGlvbiA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5vbkxhbmd1YWdlQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuZGV0YWlsQ29tcG9uZW50Q29udGFpbmVyICYmIHRoaXMuZGV0YWlsQ29tcG9uZW50KSB7XG4gICAgICBjb25zdCBmYWN0b3J5OiBDb21wb25lbnRGYWN0b3J5PGFueT4gPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHRoaXMuZGV0YWlsQ29tcG9uZW50KTtcbiAgICAgIGNvbnN0IHJlZiA9IHRoaXMuZGV0YWlsQ29tcG9uZW50Q29udGFpbmVyLmNyZWF0ZUNvbXBvbmVudChmYWN0b3J5KTtcbiAgICAgIGlmICh0aGlzLmRldGFpbENvbXBvbmVudElucHV0cyAmJiByZWYuaW5zdGFuY2UpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuZGV0YWlsQ29tcG9uZW50SW5wdXRzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICByZWYuaW5zdGFuY2Vba2V5c1tpXV0gPSB0aGlzLmRldGFpbENvbXBvbmVudElucHV0c1trZXlzW2ldXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNob3dTZWNvbmRhcnlDb250YWluZXIgPSAodGhpcy5kZXRhaWxDb21wb25lbnRDb250YWluZXIgJiYgdGhpcy5kZXRhaWxDb21wb25lbnQpIHx8IHRoaXMuc2Vjb25kYXJ5Q29udGVudC5sZW5ndGggPiAwO1xuICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudHJhbnNsYXRlU2VydmljZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy50cmFuc2xhdGVTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgdXNlSW1hZ2UoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW1hZ2UgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHVzZUljb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaWNvbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuaW1hZ2UgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIG9uQnV0dG9uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMucm91dGUpIHtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLnJvdXRlXSwge1xuICAgICAgICByZWxhdGl2ZVRvOiB0aGlzLmFjdFJvdXRlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aW9uKSB7XG4gICAgICB0aGlzLmFjdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuYnV0dG9uVGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm9uQnV0dG9uQ2xpY2soKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2hvd1NlY29uZGFyeUNvbnRhaW5lcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd1NlY29uZGFyeUNvbnRhaW5lcjtcbiAgfVxuXG4gIHNldCBzaG93U2Vjb25kYXJ5Q29udGFpbmVyKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3dTZWNvbmRhcnlDb250YWluZXIgPSB2YWw7XG4gICAgaWYgKHZhbCkge1xuICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2NvbXBhY3QnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvbXBhY3QnKTtcbiAgICB9XG4gIH1cblxufVxuIl19