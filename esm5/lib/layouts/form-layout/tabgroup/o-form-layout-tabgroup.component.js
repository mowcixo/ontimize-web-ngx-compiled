import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, forwardRef, Inject, Injector, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';
export var DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = [
    'title',
    'options'
];
export var DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = [
    'onMainTabSelected',
    'onSelectedTabChange',
    'onCloseTab'
];
var OFormLayoutTabGroupComponent = (function () {
    function OFormLayoutTabGroupComponent(injector, componentFactoryResolver, location, elRef, formLayoutManager) {
        this.injector = injector;
        this.componentFactoryResolver = componentFactoryResolver;
        this.location = location;
        this.elRef = elRef;
        this.formLayoutManager = formLayoutManager;
        this.data = [];
        this.showLoading = new BehaviorSubject(false);
        this.loading = false;
        this.onMainTabSelected = new EventEmitter();
        this.onSelectedTabChange = new EventEmitter();
        this.onCloseTab = new EventEmitter();
        this.dialogService = injector.get(DialogService);
        this.router = this.injector.get(Router);
    }
    OFormLayoutTabGroupComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.tabsDirectivesSubscription = this.tabsDirectives.changes.subscribe(function (changes) {
            if (_this.tabsDirectives.length) {
                var tabItem = _this.tabsDirectives.last;
                var tabData = _this.data[tabItem.index];
                if (tabData && !tabData.rendered) {
                    _this.createTabComponent(tabData, tabItem);
                }
            }
        });
    };
    OFormLayoutTabGroupComponent.prototype.ngOnDestroy = function () {
        if (this.tabsDirectivesSubscription) {
            this.tabsDirectivesSubscription.unsubscribe();
        }
        if (this.closeTabSubscription) {
            this.closeTabSubscription.unsubscribe();
        }
    };
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "disableAnimation", {
        get: function () {
            return this.options && this.options.disableAnimation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "headerPosition", {
        get: function () {
            var headerPosition;
            if (this.options && this.options.headerPosition) {
                headerPosition = this.options.headerPosition;
            }
            return headerPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "color", {
        get: function () {
            var color;
            if (this.options && this.options.color) {
                color = this.options.color;
            }
            return color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "backgroundColor", {
        get: function () {
            var backgroundColor;
            if (this.options && this.options.backgroundColor) {
                backgroundColor = this.options.backgroundColor;
            }
            return backgroundColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "templateMatTabLabel", {
        get: function () {
            var templateMatTabLabel;
            if (this.options && this.options.templateMatTabLabel) {
                templateMatTabLabel = this.options.templateMatTabLabel;
            }
            return templateMatTabLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "icon", {
        get: function () {
            var icon;
            if (this.options && this.options.icon) {
                icon = this.options.icon;
            }
            return icon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "isIconPositionLeft", {
        get: function () {
            return this.options && this.options.iconPosition === 'left';
        },
        enumerable: true,
        configurable: true
    });
    OFormLayoutTabGroupComponent.prototype.addTab = function (compData) {
        var addNewComp = true;
        var navData = this.formLayoutManager.navigationService.getLastItem();
        if (navData && navData.isInsertFormRoute()) {
            var existingData = this.data.find(function (item) { return item.insertionMode; });
            addNewComp = !existingData;
        }
        var newCompParams = compData.params;
        if (addNewComp) {
            this.data.forEach(function (comp) {
                var currParams = comp.params || {};
                Object.keys(currParams).forEach(function (key) {
                    addNewComp = addNewComp && (currParams[key] !== newCompParams[key]);
                });
            });
        }
        if (addNewComp) {
            this.data.push(compData);
        }
        else {
            this.reloadTab(compData);
        }
    };
    OFormLayoutTabGroupComponent.prototype.reloadTab = function (compData) {
        var compIndex = -1;
        var compParams = compData.params;
        this.data.forEach(function (comp, i) {
            var currParams = comp.params || {};
            var sameParams = Util.isEquivalent(currParams, compParams);
            if (sameParams) {
                compIndex = i;
            }
        });
        if (compIndex >= 0) {
            this.tabGroup.selectedIndex = (compIndex + 1);
        }
    };
    OFormLayoutTabGroupComponent.prototype.onTabSelectChange = function (arg) {
        if (this.formLayoutManager && this.tabGroup.selectedIndex === 0) {
            this.formLayoutManager.updateIfNeeded();
            this.onMainTabSelected.emit();
        }
        if (Util.isDefined(this.state) && Util.isDefined(this.state.tabsData)) {
            if (this.state.tabsData.length > 1) {
                if ((arg.index === this.state.tabsData.length) && Util.isDefined(this.state.selectedIndex)) {
                    this.selectedTabIndex = this.state.selectedIndex;
                    this.state = undefined;
                }
            }
            else {
                this.state = undefined;
            }
        }
        this.onSelectedTabChange.emit(this.data[this.selectedTabIndex - 1]);
    };
    OFormLayoutTabGroupComponent.prototype.closeTab = function (id) {
        if (!this.formLayoutManager) {
            return;
        }
        var onCloseTabAccepted = new EventEmitter();
        var self = this;
        this.closeTabSubscription = onCloseTabAccepted.asObservable().subscribe(function (res) {
            if (res) {
                var closedTabData = void 0;
                for (var i = self.data.length - 1; i >= 0; i--) {
                    if (self.data[i].id === id) {
                        closedTabData = self.data.splice(i, 1)[0];
                        break;
                    }
                }
                self.onCloseTab.emit(closedTabData);
            }
        });
        var tabData = this.data.find(function (item) { return item.id === id; });
        if (Util.isDefined(tabData) && tabData.modified) {
            this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(function (res) {
                onCloseTabAccepted.emit(res);
            });
        }
        else {
            onCloseTabAccepted.emit(true);
        }
    };
    OFormLayoutTabGroupComponent.prototype.createTabComponent = function (tabData, content) {
        var component = tabData.component;
        var componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        var viewContainerRef = content.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createComponent(componentFactory);
        tabData.rendered = true;
    };
    OFormLayoutTabGroupComponent.prototype.getFormCacheData = function (idArg) {
        return this.data.filter(function (cacheItem) { return cacheItem.id === idArg; })[0];
    };
    OFormLayoutTabGroupComponent.prototype.getLastTabId = function () {
        return this.data.length > 0 ? this.data[this.data.length - 1].id : undefined;
    };
    OFormLayoutTabGroupComponent.prototype.getRouteOfActiveItem = function () {
        var route = [];
        if (this.data.length && this.tabGroup.selectedIndex > 0) {
            var urlSegments = this.data[this.tabGroup.selectedIndex - 1].urlSegments || [];
            urlSegments.forEach(function (segment) {
                route.push(segment.path);
            });
            return route;
        }
        return route;
    };
    OFormLayoutTabGroupComponent.prototype.setModifiedState = function (modified, id) {
        for (var i = 0, len = this.data.length; i < len; i++) {
            if (this.data[i].id === id) {
                this.data[i].modified = modified;
                break;
            }
        }
    };
    OFormLayoutTabGroupComponent.prototype.updateNavigation = function (data, id, insertionMode) {
        var index = this.data.findIndex(function (item) { return item.id === id; });
        if (index >= 0) {
            var label = this.formLayoutManager.getLabelFromData(data);
            this.tabGroup.selectedIndex = (index + 1);
            label = label.length ? label : this.formLayoutManager.getLabelFromUrlParams(this.data[index].params);
            this.data[index].label = label;
            this.data[index].insertionMode = insertionMode;
            if (Object.keys(data).length > 0) {
                this.data[index].formDataByLabelColumns = this.formLayoutManager.getFormDataFromLabelColumns(data);
            }
        }
    };
    OFormLayoutTabGroupComponent.prototype.updateActiveData = function (data) {
        var index = this.tabGroup.selectedIndex - 1;
        if (Util.isDefined(this.data[index])) {
            this.data[index] = Object.assign(this.data[index], data);
        }
    };
    OFormLayoutTabGroupComponent.prototype.getDataToStore = function () {
        var tabsData = [];
        this.data.forEach(function (data) {
            tabsData.push({
                params: data.params,
                queryParams: data.queryParams,
                urlSegments: data.urlSegments,
                url: data.url
            });
        });
        return {
            tabsData: tabsData,
            selectedIndex: this.tabGroup.selectedIndex
        };
    };
    OFormLayoutTabGroupComponent.prototype.initializeComponentState = function (state) {
        if (Util.isDefined(state) && Util.isDefined(state.tabsData) && Util.isDefined(state.tabsData[0])) {
            this.state = state;
            var extras = {};
            extras[Codes.QUERY_PARAMS] = state.tabsData[0].queryParams;
            var self_1 = this;
            if (this.formLayoutManager) {
                this.formLayoutManager.setAsActiveFormLayoutManager();
            }
            this.router.navigate([state.tabsData[0].url], extras).then(function (val) {
                if (self_1.data[0]) {
                    setTimeout(function () {
                        self_1.createTabsFromState();
                    }, 0);
                }
            });
        }
    };
    OFormLayoutTabGroupComponent.prototype.createTabsFromState = function () {
        var self = this;
        var tabComponent = self.data[0].component;
        this.state.tabsData.forEach(function (tabData, index) {
            if (tabComponent && index > 0) {
                setTimeout(function () {
                    var newDetailData = self.createDetailComponent(tabComponent, tabData);
                    self.data.push(newDetailData);
                }, 0);
            }
        });
    };
    OFormLayoutTabGroupComponent.prototype.createDetailComponent = function (component, paramsObj) {
        var newDetailComp = {
            params: paramsObj.params,
            queryParams: paramsObj.queryParams,
            urlSegments: paramsObj.urlSegments,
            component: component,
            url: paramsObj.url,
            id: Math.random().toString(36),
            label: '',
            modified: false
        };
        return newDetailComp;
    };
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (arg) {
            this._state = arg;
            if (Util.isDefined(arg)) {
                this.showLoading.next(true);
            }
            else {
                this.showLoading.next(false);
            }
        },
        enumerable: true,
        configurable: true
    });
    OFormLayoutTabGroupComponent.prototype.getParams = function () {
        return Util.isDefined(this.data[0]) ? this.data[0].params : undefined;
    };
    Object.defineProperty(OFormLayoutTabGroupComponent.prototype, "elementRef", {
        get: function () {
            return this.elRef;
        },
        enumerable: true,
        configurable: true
    });
    OFormLayoutTabGroupComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-form-layout-tabgroup',
                    inputs: DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP,
                    outputs: DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP,
                    template: "<mat-tab-group #tabGroup oTabGroup=\"ontimize\" fxFill [(selectedIndex)]=\"selectedTabIndex\"\n  (selectedTabChange)=\"onTabSelectChange($event)\" [color]=\"color\" [backgroundColor]=\"backgroundColor\"\n  [headerPosition]=\"headerPosition\" [@.disabled]=\"disableAnimation\">\n  <mat-tab label=\"{{ (title || 'LAYOUT_MANANGER.MAIN_TAB_LABEL') | oTranslate }}\">\n    <ng-content></ng-content>\n  </mat-tab>\n\n\n  <mat-tab *ngFor=\"let tabData of data; let i = index\">\n    <ng-template mat-tab-label>\n\n      <span class=\"tab-label\" [class.modified]=\"tabData.modified\">\n        <ng-container *ngIf=\"icon && isIconPositionLeft\">\n          <mat-icon>{{ icon }}</mat-icon>\n        </ng-container>\n        <ng-container *ngIf=\"templateMatTabLabel && tabData.formDataByLabelColumns && !tabData.insertionMode \">\n          <ng-container *ngTemplateOutlet=\"templateMatTabLabel;context:{$implicit:tabData.formDataByLabelColumns}\">\n          </ng-container>\n        </ng-container>\n        <ng-container *ngIf=\"!templateMatTabLabel || tabData.insertionMode\">\n          {{ tabData.label }}\n        </ng-container>\n        <ng-container *ngIf=\"icon && !isIconPositionLeft\">\n          <mat-icon>{{ icon }}</mat-icon>\n        </ng-container>\n      </span>\n      <mat-icon (click)=\"closeTab(tabData.id)\" svgIcon=\"ontimize:close\"></mat-icon>\n    </ng-template>\n    <ng-template o-form-layout-manager-content [index]=\"i\"></ng-template>\n  </mat-tab>\n</mat-tab-group>\n<div *ngIf=\"showLoading | async\" class=\"spinner-container\" fxLayout=\"column\" fxLayoutAlign=\"center center\">\n  <mat-progress-spinner mode=\"indeterminate\" strokeWidth=\"3\"></mat-progress-spinner>\n</div>",
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class.o-form-layout-tabgroup]': 'true'
                    },
                    styles: [".o-form-layout-tabgroup .mat-tab-group .mat-tab-label span.tab-label{width:100%;max-width:120px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.o-form-layout-tabgroup .mat-tab-group .mat-tab-label span.tab-label.modified{font-weight:700}.o-form-layout-tabgroup .mat-tab-group .mat-tab-label span.tab-label.modified:after{content:'*'}.o-form-layout-tabgroup .mat-tab-group .mat-tab-label .mat-icon{height:16px;width:16px;font-size:16px;padding-left:6px;vertical-align:middle}.o-form-layout-tabgroup .mat-tab-group .mat-tab-body-wrapper{flex:1 1 auto}.o-form-layout-tabgroup .mat-tab-group o-form-toolbar{padding:0;top:0!important}.o-form-layout-tabgroup .mat-tab-group o-form-toolbar .mat-toolbar{box-shadow:none;border-radius:0}.o-form-layout-tabgroup .spinner-container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:500;visibility:visible;opacity:1;transition:opacity .25s linear}"]
                }] }
    ];
    OFormLayoutTabGroupComponent.ctorParameters = function () { return [
        { type: Injector },
        { type: ComponentFactoryResolver },
        { type: ViewContainerRef },
        { type: ElementRef },
        { type: OFormLayoutManagerComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OFormLayoutManagerComponent; }),] }] }
    ]; };
    OFormLayoutTabGroupComponent.propDecorators = {
        tabGroup: [{ type: ViewChild, args: ['tabGroup', { static: false },] }],
        tabsDirectives: [{ type: ViewChildren, args: [OFormLayoutManagerContentDirective,] }]
    };
    return OFormLayoutTabGroupComponent;
}());
export { OFormLayoutTabGroupComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC10YWJncm91cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2xheW91dHMvZm9ybS1sYXlvdXQvdGFiZ3JvdXAvby1mb3JtLWxheW91dC10YWJncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFFUixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBcUIsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUdqRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzNHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR2pGLE1BQU0sQ0FBQyxJQUFNLHFDQUFxQyxHQUFHO0lBQ25ELE9BQU87SUFDUCxTQUFTO0NBQ1YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLHNDQUFzQyxHQUFHO0lBQ3BELG1CQUFtQjtJQUNuQixxQkFBcUI7SUFDckIsWUFBWTtDQUNiLENBQUM7QUFFRjtJQWlDRSxzQ0FDWSxRQUFrQixFQUNsQix3QkFBa0QsRUFDbEQsUUFBMEIsRUFDMUIsS0FBaUIsRUFDc0MsaUJBQThDO1FBSnJHLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUNsRCxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUMxQixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ3NDLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBNkI7UUF6QjFHLFNBQUksR0FBb0MsRUFBRSxDQUFDO1FBSTNDLGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQVUsS0FBSyxDQUFDLENBQUM7UUFTL0MsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUc1QixzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUMvRCx3QkFBbUIsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNqRSxlQUFVLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFTN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELHNEQUFlLEdBQWY7UUFBQSxpQkFXQztRQVRDLElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBQSxPQUFPO1lBQzdFLElBQUksS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7Z0JBQzlCLElBQU0sT0FBTyxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDO2dCQUN6QyxJQUFNLE9BQU8sR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekMsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO29CQUNoQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUMzQzthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsa0RBQVcsR0FBWDtRQUNFLElBQUksSUFBSSxDQUFDLDBCQUEwQixFQUFFO1lBQ25DLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUMvQztRQUNELElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN6QztJQUNILENBQUM7SUFHRCxzQkFBVywwREFBZ0I7YUFBM0I7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUN2RCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLHdEQUFjO2FBQXpCO1lBQ0UsSUFBSSxjQUFjLENBQUM7WUFDbkIsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO2dCQUMvQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7YUFDOUM7WUFDRCxPQUFPLGNBQWMsQ0FBQztRQUN4QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLCtDQUFLO2FBQWhCO1lBQ0UsSUFBSSxLQUFLLENBQUM7WUFDVixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQ3RDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzthQUM1QjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx5REFBZTthQUExQjtZQUNFLElBQUksZUFBZSxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtnQkFDaEQsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO2FBQ2hEO1lBQ0QsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyw2REFBbUI7YUFBOUI7WUFDRSxJQUFJLG1CQUFtQixDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFO2dCQUNwRCxtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQ3hEO1lBQ0QsT0FBTyxtQkFBbUIsQ0FBQztRQUM3QixDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDhDQUFJO2FBQWY7WUFDRSxJQUFJLElBQUksQ0FBQztZQUNULElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtnQkFDckMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2FBQzFCO1lBQ0QsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDOzs7T0FBQTtJQUVELHNCQUFXLDREQUFrQjthQUE3QjtZQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxNQUFNLENBQUM7UUFDOUQsQ0FBQzs7O09BQUE7SUFFRCw2Q0FBTSxHQUFOLFVBQU8sUUFBdUM7UUFDNUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQU0sT0FBTyxHQUFvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEYsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUU7WUFDMUMsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsYUFBYSxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDaEUsVUFBVSxHQUFHLENBQUMsWUFBWSxDQUFDO1NBQzVCO1FBQ0QsSUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUN0QyxJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtnQkFDcEIsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztvQkFDakMsVUFBVSxHQUFHLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdEUsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQjthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFRCxnREFBUyxHQUFULFVBQVUsUUFBdUM7UUFDL0MsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxDQUFDO1lBQ3hCLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBQ3JDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdELElBQUksVUFBVSxFQUFFO2dCQUNkLFNBQVMsR0FBRyxDQUFDLENBQUM7YUFDZjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQUVELHdEQUFpQixHQUFqQixVQUFrQixHQUFzQjtRQUN0QyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsS0FBSyxDQUFDLEVBQUU7WUFDL0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMvQjtRQUNELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUMxRixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7b0JBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO2lCQUN4QjthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO2FBQ3hCO1NBQ0Y7UUFDRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELCtDQUFRLEdBQVIsVUFBUyxFQUFVO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBQ0QsSUFBTSxrQkFBa0IsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN0RSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7WUFDekUsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsSUFBSSxhQUFhLFNBQUEsQ0FBQztnQkFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7d0JBQzFCLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzFDLE1BQU07cUJBQ1A7aUJBQ0Y7Z0JBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBbUMsSUFBSyxPQUFBLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFkLENBQWMsQ0FBQyxDQUFDO1FBQ3hGLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQ2xGLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQseURBQWtCLEdBQWxCLFVBQW1CLE9BQXNDLEVBQUUsT0FBMkM7UUFDcEcsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRixJQUFNLGdCQUFnQixHQUFxQixPQUFPLENBQUMsZ0JBQWdCLENBQUM7UUFDcEUsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDekIsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbkQsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELHVEQUFnQixHQUFoQixVQUFpQixLQUFhO1FBQzVCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxTQUFTLElBQUksT0FBQSxTQUFTLENBQUMsRUFBRSxLQUFLLEtBQUssRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxtREFBWSxHQUFaO1FBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDL0UsQ0FBQztJQUVELDJEQUFvQixHQUFwQjtRQUNFLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtZQUN2RCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7WUFDakYsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU87Z0JBQzFCLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELHVEQUFnQixHQUFoQixVQUFpQixRQUFpQixFQUFFLEVBQVU7UUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFDakMsTUFBTTthQUNQO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsdURBQWdCLEdBQWhCLFVBQWlCLElBQVMsRUFBRSxFQUFVLEVBQUUsYUFBdUI7UUFDN0QsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBQyxJQUFTLElBQUssT0FBQSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQztRQUNqRSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztZQUMvQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEc7U0FDRjtJQUNILENBQUM7SUFFRCx1REFBZ0IsR0FBaEIsVUFBaUIsSUFBUztRQUN4QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDOUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMxRDtJQUNILENBQUM7SUFFRCxxREFBYyxHQUFkO1FBQ0UsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBbUM7WUFDcEQsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDWixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDN0IsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUM3QixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7YUFDZCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU87WUFDTCxRQUFRLEVBQUUsUUFBUTtZQUNsQixhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhO1NBQzNDLENBQUM7SUFDSixDQUFDO0lBRUQsK0RBQXdCLEdBQXhCLFVBQXlCLEtBQVU7UUFDakMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNsQixNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQzNELElBQU0sTUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLDRCQUE0QixFQUFFLENBQUM7YUFDdkQ7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztnQkFDNUQsSUFBSSxNQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNoQixVQUFVLENBQUM7d0JBQ1QsTUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7b0JBQzdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDUDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRVMsMERBQW1CLEdBQTdCO1FBQ0UsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQVksRUFBRSxLQUFhO1lBQ3RELElBQUksWUFBWSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLFVBQVUsQ0FBQztvQkFDVCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN4RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDaEMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ1A7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFUyw0REFBcUIsR0FBL0IsVUFBZ0MsU0FBYyxFQUFFLFNBQWM7UUFDNUQsSUFBTSxhQUFhLEdBQWtDO1lBQ25ELE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTTtZQUN4QixXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVc7WUFDbEMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxXQUFXO1lBQ2xDLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLEdBQUcsRUFBRSxTQUFTLENBQUMsR0FBRztZQUNsQixFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDOUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDO1FBQ0YsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVELHNCQUFJLCtDQUFLO2FBU1Q7WUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDckIsQ0FBQzthQVhELFVBQVUsR0FBUTtZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNsQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzdCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQzs7O09BQUE7SUFNRCxnREFBUyxHQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsc0JBQUksb0RBQVU7YUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDOzs7T0FBQTs7Z0JBblZGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsd0JBQXdCO29CQUNsQyxNQUFNLEVBQUUscUNBQXFDO29CQUM3QyxPQUFPLEVBQUUsc0NBQXNDO29CQUMvQyxzckRBQXNEO29CQUV0RCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtvQkFDckMsSUFBSSxFQUFFO3dCQUNKLGdDQUFnQyxFQUFFLE1BQU07cUJBQ3pDOztpQkFDRjs7O2dCQTFDQyxRQUFRO2dCQUxSLHdCQUF3QjtnQkFVeEIsZ0JBQWdCO2dCQVRoQixVQUFVO2dCQXNCSCwyQkFBMkIsdUJBb0QvQixNQUFNLFNBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSwyQkFBMkIsRUFBM0IsQ0FBMkIsQ0FBQzs7OzJCQWxCdEQsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7aUNBQ3ZDLFlBQVksU0FBQyxrQ0FBa0M7O0lBK1RsRCxtQ0FBQztDQUFBLEFBcFZELElBb1ZDO1NBelVZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE9uRGVzdHJveSxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWF0VGFiQ2hhbmdlRXZlbnQsIE1hdFRhYkdyb3VwIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IERpYWxvZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kaWFsb2cuc2VydmljZSc7XG5pbXBvcnQgeyBPTmF2aWdhdGlvbkl0ZW0gfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uLnNlcnZpY2UnO1xuaW1wb3J0IHsgRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEgfSBmcm9tICcuLi8uLi8uLi90eXBlcy9mb3JtLWxheW91dC1kZXRhaWwtY29tcG9uZW50LWRhdGEudHlwZSc7XG5pbXBvcnQgeyBDb2RlcyB9IGZyb20gJy4uLy4uLy4uL3V0aWwvY29kZXMnO1xuaW1wb3J0IHsgVXRpbCB9IGZyb20gJy4uLy4uLy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcy9vLWZvcm0tbGF5b3V0LW1hbmFnZXItY29udGVudC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50IH0gZnJvbSAnLi4vby1mb3JtLWxheW91dC1tYW5hZ2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBPRm9ybUxheW91dFRhYkdyb3VwIH0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9vLWZvcm0tbGF5b3V0LXRhYi1ncm91cC5pbnRlcmZhY2UnO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9JTlBVVFNfT19GT1JNX0xBWU9VVF9UQUJHUk9VUCA9IFtcbiAgJ3RpdGxlJyxcbiAgJ29wdGlvbnMnXG5dO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9PVVRQVVRTX09fRk9STV9MQVlPVVRfVEFCR1JPVVAgPSBbXG4gICdvbk1haW5UYWJTZWxlY3RlZCcsXG4gICdvblNlbGVjdGVkVGFiQ2hhbmdlJyxcbiAgJ29uQ2xvc2VUYWInXG5dO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdvLWZvcm0tbGF5b3V0LXRhYmdyb3VwJyxcbiAgaW5wdXRzOiBERUZBVUxUX0lOUFVUU19PX0ZPUk1fTEFZT1VUX1RBQkdST1VQLFxuICBvdXRwdXRzOiBERUZBVUxUX09VVFBVVFNfT19GT1JNX0xBWU9VVF9UQUJHUk9VUCxcbiAgdGVtcGxhdGVVcmw6ICcuL28tZm9ybS1sYXlvdXQtdGFiZ3JvdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9vLWZvcm0tbGF5b3V0LXRhYmdyb3VwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm8tZm9ybS1sYXlvdXQtdGFiZ3JvdXBdJzogJ3RydWUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgT0Zvcm1MYXlvdXRUYWJHcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIE9Gb3JtTGF5b3V0VGFiR3JvdXAsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgcHVibGljIGRhdGE6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhW10gPSBbXTtcbiAgcHVibGljIHNlbGVjdGVkVGFiSW5kZXg6IG51bWJlciB8IG51bGw7XG4gIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xuICBwdWJsaWMgb3B0aW9uczogYW55O1xuICBwdWJsaWMgc2hvd0xvYWRpbmcgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgcHJvdGVjdGVkIF9zdGF0ZTogYW55O1xuXG4gIEBWaWV3Q2hpbGQoJ3RhYkdyb3VwJywgeyBzdGF0aWM6IGZhbHNlIH0pIHRhYkdyb3VwOiBNYXRUYWJHcm91cDtcbiAgQFZpZXdDaGlsZHJlbihPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlKSB0YWJzRGlyZWN0aXZlczogUXVlcnlMaXN0PE9Gb3JtTGF5b3V0TWFuYWdlckNvbnRlbnREaXJlY3RpdmU+O1xuXG4gIHByb3RlY3RlZCBjbG9zZVRhYlN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcm90ZWN0ZWQgdGFic0RpcmVjdGl2ZXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHJvdXRlcjogUm91dGVyO1xuICBwcm90ZWN0ZWQgbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwcm90ZWN0ZWQgZGlhbG9nU2VydmljZTogRGlhbG9nU2VydmljZTtcblxuICBwdWJsaWMgb25NYWluVGFiU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIHB1YmxpYyBvblNlbGVjdGVkVGFiQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25DbG9zZVRhYjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByb3RlY3RlZCBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwcm90ZWN0ZWQgbG9jYXRpb246IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJvdGVjdGVkIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnQpKSBwcm90ZWN0ZWQgZm9ybUxheW91dE1hbmFnZXI6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudFxuICApIHtcbiAgICB0aGlzLmRpYWxvZ1NlcnZpY2UgPSBpbmplY3Rvci5nZXQoRGlhbG9nU2VydmljZSk7XG4gICAgdGhpcy5yb3V0ZXIgPSB0aGlzLmluamVjdG9yLmdldChSb3V0ZXIpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuXG4gICAgdGhpcy50YWJzRGlyZWN0aXZlc1N1YnNjcmlwdGlvbiA9IHRoaXMudGFic0RpcmVjdGl2ZXMuY2hhbmdlcy5zdWJzY3JpYmUoY2hhbmdlcyA9PiB7XG4gICAgICBpZiAodGhpcy50YWJzRGlyZWN0aXZlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgdGFiSXRlbSA9IHRoaXMudGFic0RpcmVjdGl2ZXMubGFzdDtcbiAgICAgICAgY29uc3QgdGFiRGF0YSA9IHRoaXMuZGF0YVt0YWJJdGVtLmluZGV4XTtcbiAgICAgICAgaWYgKHRhYkRhdGEgJiYgIXRhYkRhdGEucmVuZGVyZWQpIHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZVRhYkNvbXBvbmVudCh0YWJEYXRhLCB0YWJJdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMudGFic0RpcmVjdGl2ZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMudGFic0RpcmVjdGl2ZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2xvc2VUYWJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuY2xvc2VUYWJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuXG4gIHB1YmxpYyBnZXQgZGlzYWJsZUFuaW1hdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5kaXNhYmxlQW5pbWF0aW9uO1xuICB9XG5cbiAgcHVibGljIGdldCBoZWFkZXJQb3NpdGlvbigpIHtcbiAgICBsZXQgaGVhZGVyUG9zaXRpb247XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuaGVhZGVyUG9zaXRpb24pIHtcbiAgICAgIGhlYWRlclBvc2l0aW9uID0gdGhpcy5vcHRpb25zLmhlYWRlclBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gaGVhZGVyUG9zaXRpb247XG4gIH1cblxuICBwdWJsaWMgZ2V0IGNvbG9yKCkge1xuICAgIGxldCBjb2xvcjtcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5jb2xvcikge1xuICAgICAgY29sb3IgPSB0aGlzLm9wdGlvbnMuY29sb3I7XG4gICAgfVxuICAgIHJldHVybiBjb2xvcjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYmFja2dyb3VuZENvbG9yKCkge1xuICAgIGxldCBiYWNrZ3JvdW5kQ29sb3I7XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLm9wdGlvbnMuYmFja2dyb3VuZENvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gYmFja2dyb3VuZENvbG9yO1xuICB9XG5cbiAgcHVibGljIGdldCB0ZW1wbGF0ZU1hdFRhYkxhYmVsKCkge1xuICAgIGxldCB0ZW1wbGF0ZU1hdFRhYkxhYmVsO1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnRlbXBsYXRlTWF0VGFiTGFiZWwpIHtcbiAgICAgIHRlbXBsYXRlTWF0VGFiTGFiZWwgPSB0aGlzLm9wdGlvbnMudGVtcGxhdGVNYXRUYWJMYWJlbDtcbiAgICB9XG4gICAgcmV0dXJuIHRlbXBsYXRlTWF0VGFiTGFiZWw7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGljb24oKSB7XG4gICAgbGV0IGljb247XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuaWNvbikge1xuICAgICAgaWNvbiA9IHRoaXMub3B0aW9ucy5pY29uO1xuICAgIH1cbiAgICByZXR1cm4gaWNvbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaXNJY29uUG9zaXRpb25MZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmljb25Qb3NpdGlvbiA9PT0gJ2xlZnQnO1xuICB9XG5cbiAgYWRkVGFiKGNvbXBEYXRhOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSkge1xuICAgIGxldCBhZGROZXdDb21wID0gdHJ1ZTtcbiAgICBjb25zdCBuYXZEYXRhOiBPTmF2aWdhdGlvbkl0ZW0gPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLm5hdmlnYXRpb25TZXJ2aWNlLmdldExhc3RJdGVtKCk7XG4gICAgaWYgKG5hdkRhdGEgJiYgbmF2RGF0YS5pc0luc2VydEZvcm1Sb3V0ZSgpKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0RhdGEgPSB0aGlzLmRhdGEuZmluZChpdGVtID0+IGl0ZW0uaW5zZXJ0aW9uTW9kZSk7XG4gICAgICBhZGROZXdDb21wID0gIWV4aXN0aW5nRGF0YTtcbiAgICB9XG4gICAgY29uc3QgbmV3Q29tcFBhcmFtcyA9IGNvbXBEYXRhLnBhcmFtcztcbiAgICBpZiAoYWRkTmV3Q29tcCkge1xuICAgICAgdGhpcy5kYXRhLmZvckVhY2goY29tcCA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJQYXJhbXMgPSBjb21wLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgT2JqZWN0LmtleXMoY3VyclBhcmFtcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGFkZE5ld0NvbXAgPSBhZGROZXdDb21wICYmIChjdXJyUGFyYW1zW2tleV0gIT09IG5ld0NvbXBQYXJhbXNba2V5XSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChhZGROZXdDb21wKSB7XG4gICAgICB0aGlzLmRhdGEucHVzaChjb21wRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVsb2FkVGFiKGNvbXBEYXRhKTtcbiAgICB9XG4gIH1cblxuICByZWxvYWRUYWIoY29tcERhdGE6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhKSB7XG4gICAgbGV0IGNvbXBJbmRleCA9IC0xO1xuICAgIGNvbnN0IGNvbXBQYXJhbXMgPSBjb21wRGF0YS5wYXJhbXM7XG4gICAgdGhpcy5kYXRhLmZvckVhY2goKGNvbXAsIGkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJQYXJhbXMgPSBjb21wLnBhcmFtcyB8fCB7fTtcbiAgICAgIGNvbnN0IHNhbWVQYXJhbXMgPSBVdGlsLmlzRXF1aXZhbGVudChjdXJyUGFyYW1zLCBjb21wUGFyYW1zKTtcbiAgICAgIGlmIChzYW1lUGFyYW1zKSB7XG4gICAgICAgIGNvbXBJbmRleCA9IGk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGNvbXBJbmRleCA+PSAwKSB7XG4gICAgICB0aGlzLnRhYkdyb3VwLnNlbGVjdGVkSW5kZXggPSAoY29tcEluZGV4ICsgMSk7XG4gICAgfVxuICB9XG5cbiAgb25UYWJTZWxlY3RDaGFuZ2UoYXJnOiBNYXRUYWJDaGFuZ2VFdmVudCkge1xuICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyICYmIHRoaXMudGFiR3JvdXAuc2VsZWN0ZWRJbmRleCA9PT0gMCkge1xuICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci51cGRhdGVJZk5lZWRlZCgpO1xuICAgICAgdGhpcy5vbk1haW5UYWJTZWxlY3RlZC5lbWl0KCk7XG4gICAgfVxuICAgIGlmIChVdGlsLmlzRGVmaW5lZCh0aGlzLnN0YXRlKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnN0YXRlLnRhYnNEYXRhKSkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUudGFic0RhdGEubGVuZ3RoID4gMSkge1xuICAgICAgICBpZiAoKGFyZy5pbmRleCA9PT0gdGhpcy5zdGF0ZS50YWJzRGF0YS5sZW5ndGgpICYmIFV0aWwuaXNEZWZpbmVkKHRoaXMuc3RhdGUuc2VsZWN0ZWRJbmRleCkpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFiSW5kZXggPSB0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXg7XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5vblNlbGVjdGVkVGFiQ2hhbmdlLmVtaXQodGhpcy5kYXRhW3RoaXMuc2VsZWN0ZWRUYWJJbmRleCAtIDFdKTtcbiAgfVxuXG4gIGNsb3NlVGFiKGlkOiBzdHJpbmcpIHtcbiAgICBpZiAoIXRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb25DbG9zZVRhYkFjY2VwdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY2xvc2VUYWJTdWJzY3JpcHRpb24gPSBvbkNsb3NlVGFiQWNjZXB0ZWQuYXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKHJlcyA9PiB7XG4gICAgICBpZiAocmVzKSB7XG4gICAgICAgIGxldCBjbG9zZWRUYWJEYXRhO1xuICAgICAgICBmb3IgKGxldCBpID0gc2VsZi5kYXRhLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHNlbGYuZGF0YVtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgIGNsb3NlZFRhYkRhdGEgPSBzZWxmLmRhdGEuc3BsaWNlKGksIDEpWzBdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYub25DbG9zZVRhYi5lbWl0KGNsb3NlZFRhYkRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHRhYkRhdGEgPSB0aGlzLmRhdGEuZmluZCgoaXRlbTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEpID0+IGl0ZW0uaWQgPT09IGlkKTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGFiRGF0YSkgJiYgdGFiRGF0YS5tb2RpZmllZCkge1xuICAgICAgdGhpcy5kaWFsb2dTZXJ2aWNlLmNvbmZpcm0oJ0NPTkZJUk0nLCAnTUVTU0FHRVMuRk9STV9DSEFOR0VTX1dJTExfQkVfTE9TVCcpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgb25DbG9zZVRhYkFjY2VwdGVkLmVtaXQocmVzKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbkNsb3NlVGFiQWNjZXB0ZWQuZW1pdCh0cnVlKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVUYWJDb21wb25lbnQodGFiRGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEsIGNvbnRlbnQ6IE9Gb3JtTGF5b3V0TWFuYWdlckNvbnRlbnREaXJlY3RpdmUpIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0YWJEYXRhLmNvbXBvbmVudDtcbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICBjb25zdCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmID0gY29udGVudC52aWV3Q29udGFpbmVyUmVmO1xuICAgIHZpZXdDb250YWluZXJSZWYuY2xlYXIoKTtcbiAgICB2aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICB0YWJEYXRhLnJlbmRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIGdldEZvcm1DYWNoZURhdGEoaWRBcmc6IHN0cmluZyk6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmZpbHRlcihjYWNoZUl0ZW0gPT4gY2FjaGVJdGVtLmlkID09PSBpZEFyZylbMF07XG4gIH1cblxuICBnZXRMYXN0VGFiSWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmxlbmd0aCA+IDAgPyB0aGlzLmRhdGFbdGhpcy5kYXRhLmxlbmd0aCAtIDFdLmlkIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgZ2V0Um91dGVPZkFjdGl2ZUl0ZW0oKTogYW55W10ge1xuICAgIGNvbnN0IHJvdXRlID0gW107XG4gICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggJiYgdGhpcy50YWJHcm91cC5zZWxlY3RlZEluZGV4ID4gMCkge1xuICAgICAgY29uc3QgdXJsU2VnbWVudHMgPSB0aGlzLmRhdGFbdGhpcy50YWJHcm91cC5zZWxlY3RlZEluZGV4IC0gMV0udXJsU2VnbWVudHMgfHwgW107XG4gICAgICB1cmxTZWdtZW50cy5mb3JFYWNoKChzZWdtZW50KSA9PiB7XG4gICAgICAgIHJvdXRlLnB1c2goc2VnbWVudC5wYXRoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJvdXRlO1xuICAgIH1cbiAgICByZXR1cm4gcm91dGU7XG4gIH1cblxuICBzZXRNb2RpZmllZFN0YXRlKG1vZGlmaWVkOiBib29sZWFuLCBpZDogc3RyaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKHRoaXMuZGF0YVtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgdGhpcy5kYXRhW2ldLm1vZGlmaWVkID0gbW9kaWZpZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZU5hdmlnYXRpb24oZGF0YTogYW55LCBpZDogc3RyaW5nLCBpbnNlcnRpb25Nb2RlPzogYm9vbGVhbikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kYXRhLmZpbmRJbmRleCgoaXRlbTogYW55KSA9PiBpdGVtLmlkID09PSBpZCk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGxldCBsYWJlbCA9IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0TGFiZWxGcm9tRGF0YShkYXRhKTtcbiAgICAgIHRoaXMudGFiR3JvdXAuc2VsZWN0ZWRJbmRleCA9IChpbmRleCArIDEpO1xuICAgICAgbGFiZWwgPSBsYWJlbC5sZW5ndGggPyBsYWJlbCA6IHRoaXMuZm9ybUxheW91dE1hbmFnZXIuZ2V0TGFiZWxGcm9tVXJsUGFyYW1zKHRoaXMuZGF0YVtpbmRleF0ucGFyYW1zKTtcbiAgICAgIHRoaXMuZGF0YVtpbmRleF0ubGFiZWwgPSBsYWJlbDtcbiAgICAgIHRoaXMuZGF0YVtpbmRleF0uaW5zZXJ0aW9uTW9kZSA9IGluc2VydGlvbk1vZGU7XG4gICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmRhdGFbaW5kZXhdLmZvcm1EYXRhQnlMYWJlbENvbHVtbnMgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldEZvcm1EYXRhRnJvbUxhYmVsQ29sdW1ucyhkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVBY3RpdmVEYXRhKGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy50YWJHcm91cC5zZWxlY3RlZEluZGV4IC0gMTtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhW2luZGV4XSkpIHtcbiAgICAgIHRoaXMuZGF0YVtpbmRleF0gPSBPYmplY3QuYXNzaWduKHRoaXMuZGF0YVtpbmRleF0sIGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIGdldERhdGFUb1N0b3JlKCk6IG9iamVjdCB7XG4gICAgY29uc3QgdGFic0RhdGEgPSBbXTtcbiAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEpID0+IHtcbiAgICAgIHRhYnNEYXRhLnB1c2goe1xuICAgICAgICBwYXJhbXM6IGRhdGEucGFyYW1zLFxuICAgICAgICBxdWVyeVBhcmFtczogZGF0YS5xdWVyeVBhcmFtcyxcbiAgICAgICAgdXJsU2VnbWVudHM6IGRhdGEudXJsU2VnbWVudHMsXG4gICAgICAgIHVybDogZGF0YS51cmxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICB0YWJzRGF0YTogdGFic0RhdGEsXG4gICAgICBzZWxlY3RlZEluZGV4OiB0aGlzLnRhYkdyb3VwLnNlbGVjdGVkSW5kZXhcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZUNvbXBvbmVudFN0YXRlKHN0YXRlOiBhbnkpIHtcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoc3RhdGUpICYmIFV0aWwuaXNEZWZpbmVkKHN0YXRlLnRhYnNEYXRhKSAmJiBVdGlsLmlzRGVmaW5lZChzdGF0ZS50YWJzRGF0YVswXSkpIHtcbiAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgIGNvbnN0IGV4dHJhcyA9IHt9O1xuICAgICAgZXh0cmFzW0NvZGVzLlFVRVJZX1BBUkFNU10gPSBzdGF0ZS50YWJzRGF0YVswXS5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgaWYgKHRoaXMuZm9ybUxheW91dE1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5zZXRBc0FjdGl2ZUZvcm1MYXlvdXRNYW5hZ2VyKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbc3RhdGUudGFic0RhdGFbMF0udXJsXSwgZXh0cmFzKS50aGVuKHZhbCA9PiB7XG4gICAgICAgIGlmIChzZWxmLmRhdGFbMF0pIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNlbGYuY3JlYXRlVGFic0Zyb21TdGF0ZSgpO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgY3JlYXRlVGFic0Zyb21TdGF0ZSgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCB0YWJDb21wb25lbnQgPSBzZWxmLmRhdGFbMF0uY29tcG9uZW50O1xuICAgIHRoaXMuc3RhdGUudGFic0RhdGEuZm9yRWFjaCgodGFiRGF0YTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodGFiQ29tcG9uZW50ICYmIGluZGV4ID4gMCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXdEZXRhaWxEYXRhID0gc2VsZi5jcmVhdGVEZXRhaWxDb21wb25lbnQodGFiQ29tcG9uZW50LCB0YWJEYXRhKTtcbiAgICAgICAgICBzZWxmLmRhdGEucHVzaChuZXdEZXRhaWxEYXRhKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY3JlYXRlRGV0YWlsQ29tcG9uZW50KGNvbXBvbmVudDogYW55LCBwYXJhbXNPYmo6IGFueSkge1xuICAgIGNvbnN0IG5ld0RldGFpbENvbXA6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhID0ge1xuICAgICAgcGFyYW1zOiBwYXJhbXNPYmoucGFyYW1zLFxuICAgICAgcXVlcnlQYXJhbXM6IHBhcmFtc09iai5xdWVyeVBhcmFtcyxcbiAgICAgIHVybFNlZ21lbnRzOiBwYXJhbXNPYmoudXJsU2VnbWVudHMsXG4gICAgICBjb21wb25lbnQ6IGNvbXBvbmVudCxcbiAgICAgIHVybDogcGFyYW1zT2JqLnVybCxcbiAgICAgIGlkOiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KSxcbiAgICAgIGxhYmVsOiAnJyxcbiAgICAgIG1vZGlmaWVkOiBmYWxzZVxuICAgIH07XG4gICAgcmV0dXJuIG5ld0RldGFpbENvbXA7XG4gIH1cblxuICBzZXQgc3RhdGUoYXJnOiBhbnkpIHtcbiAgICB0aGlzLl9zdGF0ZSA9IGFyZztcbiAgICBpZiAoVXRpbC5pc0RlZmluZWQoYXJnKSkge1xuICAgICAgdGhpcy5zaG93TG9hZGluZy5uZXh0KHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3dMb2FkaW5nLm5leHQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzdGF0ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxuXG4gIGdldFBhcmFtcygpOiBhbnkge1xuICAgIHJldHVybiBVdGlsLmlzRGVmaW5lZCh0aGlzLmRhdGFbMF0pID8gdGhpcy5kYXRhWzBdLnBhcmFtcyA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldCBlbGVtZW50UmVmKCk6IEVsZW1lbnRSZWYge1xuICAgIHJldHVybiB0aGlzLmVsUmVmO1xuICB9XG59XG4iXX0=