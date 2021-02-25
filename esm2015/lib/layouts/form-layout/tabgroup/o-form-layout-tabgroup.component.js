import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, forwardRef, Inject, Injector, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormLayoutManagerContentDirective } from '../directives/o-form-layout-manager-content.directive';
import { OFormLayoutManagerComponent } from '../o-form-layout-manager.component';
export const DEFAULT_INPUTS_O_FORM_LAYOUT_TABGROUP = [
    'title',
    'options'
];
export const DEFAULT_OUTPUTS_O_FORM_LAYOUT_TABGROUP = [
    'onMainTabSelected',
    'onSelectedTabChange',
    'onCloseTab'
];
export class OFormLayoutTabGroupComponent {
    constructor(injector, componentFactoryResolver, location, elRef, formLayoutManager) {
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
    ngAfterViewInit() {
        this.tabsDirectivesSubscription = this.tabsDirectives.changes.subscribe(changes => {
            if (this.tabsDirectives.length) {
                const tabItem = this.tabsDirectives.last;
                const tabData = this.data[tabItem.index];
                if (tabData && !tabData.rendered) {
                    this.createTabComponent(tabData, tabItem);
                }
            }
        });
    }
    ngOnDestroy() {
        if (this.tabsDirectivesSubscription) {
            this.tabsDirectivesSubscription.unsubscribe();
        }
        if (this.closeTabSubscription) {
            this.closeTabSubscription.unsubscribe();
        }
    }
    get disableAnimation() {
        return this.options && this.options.disableAnimation;
    }
    get headerPosition() {
        let headerPosition;
        if (this.options && this.options.headerPosition) {
            headerPosition = this.options.headerPosition;
        }
        return headerPosition;
    }
    get color() {
        let color;
        if (this.options && this.options.color) {
            color = this.options.color;
        }
        return color;
    }
    get backgroundColor() {
        let backgroundColor;
        if (this.options && this.options.backgroundColor) {
            backgroundColor = this.options.backgroundColor;
        }
        return backgroundColor;
    }
    get templateMatTabLabel() {
        let templateMatTabLabel;
        if (this.options && this.options.templateMatTabLabel) {
            templateMatTabLabel = this.options.templateMatTabLabel;
        }
        return templateMatTabLabel;
    }
    get icon() {
        let icon;
        if (this.options && this.options.icon) {
            icon = this.options.icon;
        }
        return icon;
    }
    get isIconPositionLeft() {
        return this.options && this.options.iconPosition === 'left';
    }
    addTab(compData) {
        let addNewComp = true;
        const navData = this.formLayoutManager.navigationService.getLastItem();
        if (navData && navData.isInsertFormRoute()) {
            const existingData = this.data.find(item => item.insertionMode);
            addNewComp = !existingData;
        }
        const newCompParams = compData.params;
        if (addNewComp) {
            this.data.forEach(comp => {
                const currParams = comp.params || {};
                Object.keys(currParams).forEach(key => {
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
    }
    reloadTab(compData) {
        let compIndex = -1;
        const compParams = compData.params;
        this.data.forEach((comp, i) => {
            const currParams = comp.params || {};
            const sameParams = Util.isEquivalent(currParams, compParams);
            if (sameParams) {
                compIndex = i;
            }
        });
        if (compIndex >= 0) {
            this.tabGroup.selectedIndex = (compIndex + 1);
        }
    }
    onTabSelectChange(arg) {
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
    }
    closeTab(id) {
        if (!this.formLayoutManager) {
            return;
        }
        const onCloseTabAccepted = new EventEmitter();
        const self = this;
        this.closeTabSubscription = onCloseTabAccepted.asObservable().subscribe(res => {
            if (res) {
                let closedTabData;
                for (let i = self.data.length - 1; i >= 0; i--) {
                    if (self.data[i].id === id) {
                        closedTabData = self.data.splice(i, 1)[0];
                        break;
                    }
                }
                self.onCloseTab.emit(closedTabData);
            }
        });
        const tabData = this.data.find((item) => item.id === id);
        if (Util.isDefined(tabData) && tabData.modified) {
            this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST').then(res => {
                onCloseTabAccepted.emit(res);
            });
        }
        else {
            onCloseTabAccepted.emit(true);
        }
    }
    createTabComponent(tabData, content) {
        const component = tabData.component;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = content.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createComponent(componentFactory);
        tabData.rendered = true;
    }
    getFormCacheData(idArg) {
        return this.data.filter(cacheItem => cacheItem.id === idArg)[0];
    }
    getLastTabId() {
        return this.data.length > 0 ? this.data[this.data.length - 1].id : undefined;
    }
    getRouteOfActiveItem() {
        const route = [];
        if (this.data.length && this.tabGroup.selectedIndex > 0) {
            const urlSegments = this.data[this.tabGroup.selectedIndex - 1].urlSegments || [];
            urlSegments.forEach((segment) => {
                route.push(segment.path);
            });
            return route;
        }
        return route;
    }
    setModifiedState(modified, id) {
        for (let i = 0, len = this.data.length; i < len; i++) {
            if (this.data[i].id === id) {
                this.data[i].modified = modified;
                break;
            }
        }
    }
    updateNavigation(data, id, insertionMode) {
        const index = this.data.findIndex((item) => item.id === id);
        if (index >= 0) {
            let label = this.formLayoutManager.getLabelFromData(data);
            this.tabGroup.selectedIndex = (index + 1);
            label = label.length ? label : this.formLayoutManager.getLabelFromUrlParams(this.data[index].params);
            this.data[index].label = label;
            this.data[index].insertionMode = insertionMode;
            if (Object.keys(data).length > 0) {
                this.data[index].formDataByLabelColumns = this.formLayoutManager.getFormDataFromLabelColumns(data);
            }
        }
    }
    updateActiveData(data) {
        const index = this.tabGroup.selectedIndex - 1;
        if (Util.isDefined(this.data[index])) {
            this.data[index] = Object.assign(this.data[index], data);
        }
    }
    getDataToStore() {
        const tabsData = [];
        this.data.forEach((data) => {
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
    }
    initializeComponentState(state) {
        if (Util.isDefined(state) && Util.isDefined(state.tabsData) && Util.isDefined(state.tabsData[0])) {
            this.state = state;
            const extras = {};
            extras[Codes.QUERY_PARAMS] = state.tabsData[0].queryParams;
            const self = this;
            if (this.formLayoutManager) {
                this.formLayoutManager.setAsActiveFormLayoutManager();
            }
            this.router.navigate([state.tabsData[0].url], extras).then(val => {
                if (self.data[0]) {
                    setTimeout(() => {
                        self.createTabsFromState();
                    }, 0);
                }
            });
        }
    }
    createTabsFromState() {
        const self = this;
        const tabComponent = self.data[0].component;
        this.state.tabsData.forEach((tabData, index) => {
            if (tabComponent && index > 0) {
                setTimeout(() => {
                    const newDetailData = self.createDetailComponent(tabComponent, tabData);
                    self.data.push(newDetailData);
                }, 0);
            }
        });
    }
    createDetailComponent(component, paramsObj) {
        const newDetailComp = {
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
    }
    set state(arg) {
        this._state = arg;
        if (Util.isDefined(arg)) {
            this.showLoading.next(true);
        }
        else {
            this.showLoading.next(false);
        }
    }
    get state() {
        return this._state;
    }
    getParams() {
        return Util.isDefined(this.data[0]) ? this.data[0].params : undefined;
    }
    get elementRef() {
        return this.elRef;
    }
}
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
OFormLayoutTabGroupComponent.ctorParameters = () => [
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: ElementRef },
    { type: OFormLayoutManagerComponent, decorators: [{ type: Inject, args: [forwardRef(() => OFormLayoutManagerComponent),] }] }
];
OFormLayoutTabGroupComponent.propDecorators = {
    tabGroup: [{ type: ViewChild, args: ['tabGroup', { static: false },] }],
    tabsDirectives: [{ type: ViewChildren, args: [OFormLayoutManagerContentDirective,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1mb3JtLWxheW91dC10YWJncm91cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL2xheW91dHMvZm9ybS1sYXlvdXQvdGFiZ3JvdXAvby1mb3JtLWxheW91dC10YWJncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsVUFBVSxFQUNWLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFFUixTQUFTLEVBQ1QsU0FBUyxFQUNULFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBcUIsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxlQUFlLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBRXJELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUdqRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzNHLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG9DQUFvQyxDQUFDO0FBR2pGLE1BQU0sQ0FBQyxNQUFNLHFDQUFxQyxHQUFHO0lBQ25ELE9BQU87SUFDUCxTQUFTO0NBQ1YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHNDQUFzQyxHQUFHO0lBQ3BELG1CQUFtQjtJQUNuQixxQkFBcUI7SUFDckIsWUFBWTtDQUNiLENBQUM7QUFhRixNQUFNLE9BQU8sNEJBQTRCO0lBc0J2QyxZQUNZLFFBQWtCLEVBQ2xCLHdC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O1FBQ1AsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7OztZQW5WRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsTUFBTSxFQUFFLHFDQUFxQztnQkFDN0MsT0FBTyxFQUFFLHNDQUFzQztnQkFDL0Msc3JEQUFzRDtnQkFFdEQsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixnQ0FBZ0MsRUFBRSxNQUFNO2lCQUN6Qzs7YUFDRjs7O1lBMUNDLFFBQVE7WUFMUix3QkFBd0I7WUFVeEIsZ0JBQWdCO1lBVGhCLFVBQVU7WUFzQkgsMkJBQTJCLHVCQW9EL0IsTUFBTSxTQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQywyQkFBMkIsQ0FBQzs7O3VCQWxCdEQsU0FBUyxTQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7NkJBQ3ZDLFlBQVksU0FBQyxrQ0FBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb21wb25lbnQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBPbkRlc3Ryb3ksXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1hdFRhYkNoYW5nZUV2ZW50LCBNYXRUYWJHcm91cCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBEaWFsb2dTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZGlhbG9nLnNlcnZpY2UnO1xuaW1wb3J0IHsgT05hdmlnYXRpb25JdGVtIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbmF2aWdhdGlvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMvZm9ybS1sYXlvdXQtZGV0YWlsLWNvbXBvbmVudC1kYXRhLnR5cGUnO1xuaW1wb3J0IHsgQ29kZXMgfSBmcm9tICcuLi8uLi8uLi91dGlsL2NvZGVzJztcbmltcG9ydCB7IFV0aWwgfSBmcm9tICcuLi8uLi8uLi91dGlsL3V0aWwnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRNYW5hZ2VyQ29udGVudERpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZXMvby1mb3JtLWxheW91dC1tYW5hZ2VyLWNvbnRlbnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IE9Gb3JtTGF5b3V0TWFuYWdlckNvbXBvbmVudCB9IGZyb20gJy4uL28tZm9ybS1sYXlvdXQtbWFuYWdlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgT0Zvcm1MYXlvdXRUYWJHcm91cCB9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvby1mb3JtLWxheW91dC10YWItZ3JvdXAuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSU5QVVRTX09fRk9STV9MQVlPVVRfVEFCR1JPVVAgPSBbXG4gICd0aXRsZScsXG4gICdvcHRpb25zJ1xuXTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1VUUFVUU19PX0ZPUk1fTEFZT1VUX1RBQkdST1VQID0gW1xuICAnb25NYWluVGFiU2VsZWN0ZWQnLFxuICAnb25TZWxlY3RlZFRhYkNoYW5nZScsXG4gICdvbkNsb3NlVGFiJ1xuXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1mb3JtLWxheW91dC10YWJncm91cCcsXG4gIGlucHV0czogREVGQVVMVF9JTlBVVFNfT19GT1JNX0xBWU9VVF9UQUJHUk9VUCxcbiAgb3V0cHV0czogREVGQVVMVF9PVVRQVVRTX09fRk9STV9MQVlPVVRfVEFCR1JPVVAsXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWZvcm0tbGF5b3V0LXRhYmdyb3VwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1mb3JtLWxheW91dC10YWJncm91cC5jb21wb25lbnQuc2NzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5vLWZvcm0tbGF5b3V0LXRhYmdyb3VwXSc6ICd0cnVlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE9Gb3JtTGF5b3V0VGFiR3JvdXBDb21wb25lbnQgaW1wbGVtZW50cyBPRm9ybUxheW91dFRhYkdyb3VwLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuXG4gIHB1YmxpYyBkYXRhOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YVtdID0gW107XG4gIHB1YmxpYyBzZWxlY3RlZFRhYkluZGV4OiBudW1iZXIgfCBudWxsO1xuICBwdWJsaWMgdGl0bGU6IHN0cmluZztcbiAgcHVibGljIG9wdGlvbnM6IGFueTtcbiAgcHVibGljIHNob3dMb2FkaW5nID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHByb3RlY3RlZCBfc3RhdGU6IGFueTtcblxuICBAVmlld0NoaWxkKCd0YWJHcm91cCcsIHsgc3RhdGljOiBmYWxzZSB9KSB0YWJHcm91cDogTWF0VGFiR3JvdXA7XG4gIEBWaWV3Q2hpbGRyZW4oT0Zvcm1MYXlvdXRNYW5hZ2VyQ29udGVudERpcmVjdGl2ZSkgdGFic0RpcmVjdGl2ZXM6IFF1ZXJ5TGlzdDxPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlPjtcblxuICBwcm90ZWN0ZWQgY2xvc2VUYWJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJvdGVjdGVkIHRhYnNEaXJlY3RpdmVzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByb3RlY3RlZCByb3V0ZXI6IFJvdXRlcjtcbiAgcHJvdGVjdGVkIGxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJvdGVjdGVkIGRpYWxvZ1NlcnZpY2U6IERpYWxvZ1NlcnZpY2U7XG5cbiAgcHVibGljIG9uTWFpblRhYlNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBwdWJsaWMgb25TZWxlY3RlZFRhYkNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgcHVibGljIG9uQ2xvc2VUYWI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcm90ZWN0ZWQgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJvdGVjdGVkIGxvY2F0aW9uOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByb3RlY3RlZCBlbFJlZjogRWxlbWVudFJlZixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gT0Zvcm1MYXlvdXRNYW5hZ2VyQ29tcG9uZW50KSkgcHJvdGVjdGVkIGZvcm1MYXlvdXRNYW5hZ2VyOiBPRm9ybUxheW91dE1hbmFnZXJDb21wb25lbnRcbiAgKSB7XG4gICAgdGhpcy5kaWFsb2dTZXJ2aWNlID0gaW5qZWN0b3IuZ2V0KERpYWxvZ1NlcnZpY2UpO1xuICAgIHRoaXMucm91dGVyID0gdGhpcy5pbmplY3Rvci5nZXQoUm91dGVyKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcblxuICAgIHRoaXMudGFic0RpcmVjdGl2ZXNTdWJzY3JpcHRpb24gPSB0aGlzLnRhYnNEaXJlY3RpdmVzLmNoYW5nZXMuc3Vic2NyaWJlKGNoYW5nZXMgPT4ge1xuICAgICAgaWYgKHRoaXMudGFic0RpcmVjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHRhYkl0ZW0gPSB0aGlzLnRhYnNEaXJlY3RpdmVzLmxhc3Q7XG4gICAgICAgIGNvbnN0IHRhYkRhdGEgPSB0aGlzLmRhdGFbdGFiSXRlbS5pbmRleF07XG4gICAgICAgIGlmICh0YWJEYXRhICYmICF0YWJEYXRhLnJlbmRlcmVkKSB7XG4gICAgICAgICAgdGhpcy5jcmVhdGVUYWJDb21wb25lbnQodGFiRGF0YSwgdGFiSXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnRhYnNEaXJlY3RpdmVzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnRhYnNEaXJlY3RpdmVzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNsb3NlVGFiU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNsb3NlVGFiU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cblxuICBwdWJsaWMgZ2V0IGRpc2FibGVBbmltYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZGlzYWJsZUFuaW1hdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaGVhZGVyUG9zaXRpb24oKSB7XG4gICAgbGV0IGhlYWRlclBvc2l0aW9uO1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmhlYWRlclBvc2l0aW9uKSB7XG4gICAgICBoZWFkZXJQb3NpdGlvbiA9IHRoaXMub3B0aW9ucy5oZWFkZXJQb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIGhlYWRlclBvc2l0aW9uO1xuICB9XG5cbiAgcHVibGljIGdldCBjb2xvcigpIHtcbiAgICBsZXQgY29sb3I7XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuY29sb3IpIHtcbiAgICAgIGNvbG9yID0gdGhpcy5vcHRpb25zLmNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gY29sb3I7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGJhY2tncm91bmRDb2xvcigpIHtcbiAgICBsZXQgYmFja2dyb3VuZENvbG9yO1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgYmFja2dyb3VuZENvbG9yID0gdGhpcy5vcHRpb25zLmJhY2tncm91bmRDb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIGJhY2tncm91bmRDb2xvcjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgdGVtcGxhdGVNYXRUYWJMYWJlbCgpIHtcbiAgICBsZXQgdGVtcGxhdGVNYXRUYWJMYWJlbDtcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy50ZW1wbGF0ZU1hdFRhYkxhYmVsKSB7XG4gICAgICB0ZW1wbGF0ZU1hdFRhYkxhYmVsID0gdGhpcy5vcHRpb25zLnRlbXBsYXRlTWF0VGFiTGFiZWw7XG4gICAgfVxuICAgIHJldHVybiB0ZW1wbGF0ZU1hdFRhYkxhYmVsO1xuICB9XG5cbiAgcHVibGljIGdldCBpY29uKCkge1xuICAgIGxldCBpY29uO1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmljb24pIHtcbiAgICAgIGljb24gPSB0aGlzLm9wdGlvbnMuaWNvbjtcbiAgICB9XG4gICAgcmV0dXJuIGljb247XG4gIH1cblxuICBwdWJsaWMgZ2V0IGlzSWNvblBvc2l0aW9uTGVmdCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5pY29uUG9zaXRpb24gPT09ICdsZWZ0JztcbiAgfVxuXG4gIGFkZFRhYihjb21wRGF0YTogRm9ybUxheW91dERldGFpbENvbXBvbmVudERhdGEpIHtcbiAgICBsZXQgYWRkTmV3Q29tcCA9IHRydWU7XG4gICAgY29uc3QgbmF2RGF0YTogT05hdmlnYXRpb25JdGVtID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5uYXZpZ2F0aW9uU2VydmljZS5nZXRMYXN0SXRlbSgpO1xuICAgIGlmIChuYXZEYXRhICYmIG5hdkRhdGEuaXNJbnNlcnRGb3JtUm91dGUoKSkge1xuICAgICAgY29uc3QgZXhpc3RpbmdEYXRhID0gdGhpcy5kYXRhLmZpbmQoaXRlbSA9PiBpdGVtLmluc2VydGlvbk1vZGUpO1xuICAgICAgYWRkTmV3Q29tcCA9ICFleGlzdGluZ0RhdGE7XG4gICAgfVxuICAgIGNvbnN0IG5ld0NvbXBQYXJhbXMgPSBjb21wRGF0YS5wYXJhbXM7XG4gICAgaWYgKGFkZE5ld0NvbXApIHtcbiAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKGNvbXAgPT4ge1xuICAgICAgICBjb25zdCBjdXJyUGFyYW1zID0gY29tcC5wYXJhbXMgfHwge307XG4gICAgICAgIE9iamVjdC5rZXlzKGN1cnJQYXJhbXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBhZGROZXdDb21wID0gYWRkTmV3Q29tcCAmJiAoY3VyclBhcmFtc1trZXldICE9PSBuZXdDb21wUGFyYW1zW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYWRkTmV3Q29tcCkge1xuICAgICAgdGhpcy5kYXRhLnB1c2goY29tcERhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbG9hZFRhYihjb21wRGF0YSk7XG4gICAgfVxuICB9XG5cbiAgcmVsb2FkVGFiKGNvbXBEYXRhOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSkge1xuICAgIGxldCBjb21wSW5kZXggPSAtMTtcbiAgICBjb25zdCBjb21wUGFyYW1zID0gY29tcERhdGEucGFyYW1zO1xuICAgIHRoaXMuZGF0YS5mb3JFYWNoKChjb21wLCBpKSA9PiB7XG4gICAgICBjb25zdCBjdXJyUGFyYW1zID0gY29tcC5wYXJhbXMgfHwge307XG4gICAgICBjb25zdCBzYW1lUGFyYW1zID0gVXRpbC5pc0VxdWl2YWxlbnQoY3VyclBhcmFtcywgY29tcFBhcmFtcyk7XG4gICAgICBpZiAoc2FtZVBhcmFtcykge1xuICAgICAgICBjb21wSW5kZXggPSBpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChjb21wSW5kZXggPj0gMCkge1xuICAgICAgdGhpcy50YWJHcm91cC5zZWxlY3RlZEluZGV4ID0gKGNvbXBJbmRleCArIDEpO1xuICAgIH1cbiAgfVxuXG4gIG9uVGFiU2VsZWN0Q2hhbmdlKGFyZzogTWF0VGFiQ2hhbmdlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5mb3JtTGF5b3V0TWFuYWdlciAmJiB0aGlzLnRhYkdyb3VwLnNlbGVjdGVkSW5kZXggPT09IDApIHtcbiAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIudXBkYXRlSWZOZWVkZWQoKTtcbiAgICAgIHRoaXMub25NYWluVGFiU2VsZWN0ZWQuZW1pdCgpO1xuICAgIH1cbiAgICBpZiAoVXRpbC5pc0RlZmluZWQodGhpcy5zdGF0ZSkgJiYgVXRpbC5pc0RlZmluZWQodGhpcy5zdGF0ZS50YWJzRGF0YSkpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLnRhYnNEYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgaWYgKChhcmcuaW5kZXggPT09IHRoaXMuc3RhdGUudGFic0RhdGEubGVuZ3RoKSAmJiBVdGlsLmlzRGVmaW5lZCh0aGlzLnN0YXRlLnNlbGVjdGVkSW5kZXgpKSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RlZFRhYkluZGV4ID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEluZGV4O1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMub25TZWxlY3RlZFRhYkNoYW5nZS5lbWl0KHRoaXMuZGF0YVt0aGlzLnNlbGVjdGVkVGFiSW5kZXggLSAxXSk7XG4gIH1cblxuICBjbG9zZVRhYihpZDogc3RyaW5nKSB7XG4gICAgaWYgKCF0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG9uQ2xvc2VUYWJBY2NlcHRlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNsb3NlVGFiU3Vic2NyaXB0aW9uID0gb25DbG9zZVRhYkFjY2VwdGVkLmFzT2JzZXJ2YWJsZSgpLnN1YnNjcmliZShyZXMgPT4ge1xuICAgICAgaWYgKHJlcykge1xuICAgICAgICBsZXQgY2xvc2VkVGFiRGF0YTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHNlbGYuZGF0YS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChzZWxmLmRhdGFbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICBjbG9zZWRUYWJEYXRhID0gc2VsZi5kYXRhLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZWxmLm9uQ2xvc2VUYWIuZW1pdChjbG9zZWRUYWJEYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB0YWJEYXRhID0gdGhpcy5kYXRhLmZpbmQoKGl0ZW06IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhKSA9PiBpdGVtLmlkID09PSBpZCk7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRhYkRhdGEpICYmIHRhYkRhdGEubW9kaWZpZWQpIHtcbiAgICAgIHRoaXMuZGlhbG9nU2VydmljZS5jb25maXJtKCdDT05GSVJNJywgJ01FU1NBR0VTLkZPUk1fQ0hBTkdFU19XSUxMX0JFX0xPU1QnKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIG9uQ2xvc2VUYWJBY2NlcHRlZC5lbWl0KHJlcyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25DbG9zZVRhYkFjY2VwdGVkLmVtaXQodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlVGFiQ29tcG9uZW50KHRhYkRhdGE6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhLCBjb250ZW50OiBPRm9ybUxheW91dE1hbmFnZXJDb250ZW50RGlyZWN0aXZlKSB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGFiRGF0YS5jb21wb25lbnQ7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbXBvbmVudCk7XG4gICAgY29uc3Qgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiA9IGNvbnRlbnQudmlld0NvbnRhaW5lclJlZjtcbiAgICB2aWV3Q29udGFpbmVyUmVmLmNsZWFyKCk7XG4gICAgdmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgdGFiRGF0YS5yZW5kZXJlZCA9IHRydWU7XG4gIH1cblxuICBnZXRGb3JtQ2FjaGVEYXRhKGlkQXJnOiBzdHJpbmcpOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5maWx0ZXIoY2FjaGVJdGVtID0+IGNhY2hlSXRlbS5pZCA9PT0gaWRBcmcpWzBdO1xuICB9XG5cbiAgZ2V0TGFzdFRhYklkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YS5sZW5ndGggPiAwID8gdGhpcy5kYXRhW3RoaXMuZGF0YS5sZW5ndGggLSAxXS5pZCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldFJvdXRlT2ZBY3RpdmVJdGVtKCk6IGFueVtdIHtcbiAgICBjb25zdCByb3V0ZSA9IFtdO1xuICAgIGlmICh0aGlzLmRhdGEubGVuZ3RoICYmIHRoaXMudGFiR3JvdXAuc2VsZWN0ZWRJbmRleCA+IDApIHtcbiAgICAgIGNvbnN0IHVybFNlZ21lbnRzID0gdGhpcy5kYXRhW3RoaXMudGFiR3JvdXAuc2VsZWN0ZWRJbmRleCAtIDFdLnVybFNlZ21lbnRzIHx8IFtdO1xuICAgICAgdXJsU2VnbWVudHMuZm9yRWFjaCgoc2VnbWVudCkgPT4ge1xuICAgICAgICByb3V0ZS5wdXNoKHNlZ21lbnQucGF0aCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByb3V0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdXRlO1xuICB9XG5cbiAgc2V0TW9kaWZpZWRTdGF0ZShtb2RpZmllZDogYm9vbGVhbiwgaWQ6IHN0cmluZykge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLmRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmRhdGFbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgIHRoaXMuZGF0YVtpXS5tb2RpZmllZCA9IG1vZGlmaWVkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB1cGRhdGVOYXZpZ2F0aW9uKGRhdGE6IGFueSwgaWQ6IHN0cmluZywgaW5zZXJ0aW9uTW9kZT86IGJvb2xlYW4pIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0YS5maW5kSW5kZXgoKGl0ZW06IGFueSkgPT4gaXRlbS5pZCA9PT0gaWQpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBsZXQgbGFiZWwgPSB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldExhYmVsRnJvbURhdGEoZGF0YSk7XG4gICAgICB0aGlzLnRhYkdyb3VwLnNlbGVjdGVkSW5kZXggPSAoaW5kZXggKyAxKTtcbiAgICAgIGxhYmVsID0gbGFiZWwubGVuZ3RoID8gbGFiZWwgOiB0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyLmdldExhYmVsRnJvbVVybFBhcmFtcyh0aGlzLmRhdGFbaW5kZXhdLnBhcmFtcyk7XG4gICAgICB0aGlzLmRhdGFbaW5kZXhdLmxhYmVsID0gbGFiZWw7XG4gICAgICB0aGlzLmRhdGFbaW5kZXhdLmluc2VydGlvbk1vZGUgPSBpbnNlcnRpb25Nb2RlO1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5kYXRhW2luZGV4XS5mb3JtRGF0YUJ5TGFiZWxDb2x1bW5zID0gdGhpcy5mb3JtTGF5b3V0TWFuYWdlci5nZXRGb3JtRGF0YUZyb21MYWJlbENvbHVtbnMoZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQWN0aXZlRGF0YShkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMudGFiR3JvdXAuc2VsZWN0ZWRJbmRleCAtIDE7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHRoaXMuZGF0YVtpbmRleF0pKSB7XG4gICAgICB0aGlzLmRhdGFbaW5kZXhdID0gT2JqZWN0LmFzc2lnbih0aGlzLmRhdGFbaW5kZXhdLCBkYXRhKTtcbiAgICB9XG4gIH1cblxuICBnZXREYXRhVG9TdG9yZSgpOiBvYmplY3Qge1xuICAgIGNvbnN0IHRhYnNEYXRhID0gW107XG4gICAgdGhpcy5kYXRhLmZvckVhY2goKGRhdGE6IEZvcm1MYXlvdXREZXRhaWxDb21wb25lbnREYXRhKSA9PiB7XG4gICAgICB0YWJzRGF0YS5wdXNoKHtcbiAgICAgICAgcGFyYW1zOiBkYXRhLnBhcmFtcyxcbiAgICAgICAgcXVlcnlQYXJhbXM6IGRhdGEucXVlcnlQYXJhbXMsXG4gICAgICAgIHVybFNlZ21lbnRzOiBkYXRhLnVybFNlZ21lbnRzLFxuICAgICAgICB1cmw6IGRhdGEudXJsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgdGFic0RhdGE6IHRhYnNEYXRhLFxuICAgICAgc2VsZWN0ZWRJbmRleDogdGhpcy50YWJHcm91cC5zZWxlY3RlZEluZGV4XG4gICAgfTtcbiAgfVxuXG4gIGluaXRpYWxpemVDb21wb25lbnRTdGF0ZShzdGF0ZTogYW55KSB7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKHN0YXRlKSAmJiBVdGlsLmlzRGVmaW5lZChzdGF0ZS50YWJzRGF0YSkgJiYgVXRpbC5pc0RlZmluZWQoc3RhdGUudGFic0RhdGFbMF0pKSB7XG4gICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICBjb25zdCBleHRyYXMgPSB7fTtcbiAgICAgIGV4dHJhc1tDb2Rlcy5RVUVSWV9QQVJBTVNdID0gc3RhdGUudGFic0RhdGFbMF0ucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgIGlmICh0aGlzLmZvcm1MYXlvdXRNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZm9ybUxheW91dE1hbmFnZXIuc2V0QXNBY3RpdmVGb3JtTGF5b3V0TWFuYWdlcigpO1xuICAgICAgfVxuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3N0YXRlLnRhYnNEYXRhWzBdLnVybF0sIGV4dHJhcykudGhlbih2YWwgPT4ge1xuICAgICAgICBpZiAoc2VsZi5kYXRhWzBdKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLmNyZWF0ZVRhYnNGcm9tU3RhdGUoKTtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGNyZWF0ZVRhYnNGcm9tU3RhdGUoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgdGFiQ29tcG9uZW50ID0gc2VsZi5kYXRhWzBdLmNvbXBvbmVudDtcbiAgICB0aGlzLnN0YXRlLnRhYnNEYXRhLmZvckVhY2goKHRhYkRhdGE6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHRhYkNvbXBvbmVudCAmJiBpbmRleCA+IDApIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmV3RGV0YWlsRGF0YSA9IHNlbGYuY3JlYXRlRGV0YWlsQ29tcG9uZW50KHRhYkNvbXBvbmVudCwgdGFiRGF0YSk7XG4gICAgICAgICAgc2VsZi5kYXRhLnB1c2gobmV3RGV0YWlsRGF0YSk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNyZWF0ZURldGFpbENvbXBvbmVudChjb21wb25lbnQ6IGFueSwgcGFyYW1zT2JqOiBhbnkpIHtcbiAgICBjb25zdCBuZXdEZXRhaWxDb21wOiBGb3JtTGF5b3V0RGV0YWlsQ29tcG9uZW50RGF0YSA9IHtcbiAgICAgIHBhcmFtczogcGFyYW1zT2JqLnBhcmFtcyxcbiAgICAgIHF1ZXJ5UGFyYW1zOiBwYXJhbXNPYmoucXVlcnlQYXJhbXMsXG4gICAgICB1cmxTZWdtZW50czogcGFyYW1zT2JqLnVybFNlZ21lbnRzLFxuICAgICAgY29tcG9uZW50OiBjb21wb25lbnQsXG4gICAgICB1cmw6IHBhcmFtc09iai51cmwsXG4gICAgICBpZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNiksXG4gICAgICBsYWJlbDogJycsXG4gICAgICBtb2RpZmllZDogZmFsc2VcbiAgICB9O1xuICAgIHJldHVybiBuZXdEZXRhaWxDb21wO1xuICB9XG5cbiAgc2V0IHN0YXRlKGFyZzogYW55KSB7XG4gICAgdGhpcy5fc3RhdGUgPSBhcmc7XG4gICAgaWYgKFV0aWwuaXNEZWZpbmVkKGFyZykpIHtcbiAgICAgIHRoaXMuc2hvd0xvYWRpbmcubmV4dCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93TG9hZGluZy5uZXh0KGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc3RhdGUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cblxuICBnZXRQYXJhbXMoKTogYW55IHtcbiAgICByZXR1cm4gVXRpbC5pc0RlZmluZWQodGhpcy5kYXRhWzBdKSA/IHRoaXMuZGF0YVswXS5wYXJhbXMgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHtcbiAgICByZXR1cm4gdGhpcy5lbFJlZjtcbiAgfVxufVxuIl19