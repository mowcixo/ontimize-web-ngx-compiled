import { Directive, ElementRef, forwardRef, Inject, Injector, Renderer2 } from '@angular/core';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OTableComponent } from './../../../o-table.component';
export class OTableExpandedFooterDirective {
    constructor(table, element, renderer, injector) {
        this.table = table;
        this.element = element;
        this.renderer = renderer;
        this.injector = injector;
        this.translateService = this.injector.get(OTranslateService);
    }
    ngAfterViewInit() {
        if (this.element.nativeElement.childNodes[2]) {
            this.tableBody = this.element.nativeElement.childNodes[1];
            this.tableHeader = this.element.nativeElement.childNodes[0];
        }
        this.registerContentChange();
        this.registerVisibleColumnsChange();
    }
    registerContentChange() {
        let tr = this.renderer.createElement('tr');
        this.tdTableWithMessage = this.renderer.createElement('td');
        this.renderer.addClass(tr, 'o-table-no-results');
        tr.appendChild(this.tdTableWithMessage);
        this.renderer.appendChild(this.tableBody, tr);
        const self = this;
        this.onContentChangeSubscription = this.table.onContentChange.subscribe((data) => {
            self.updateMessageNotResults(data);
            self.table.cd.detectChanges();
        });
    }
    registerVisibleColumnsChange() {
        const self = this;
        this.onVisibleColumnsChangeSubscription = this.table.onVisibleColumnsChange.subscribe(() => {
            self.updateColspanTd();
        });
    }
    updateMessageNotResults(data) {
        if (this.spanMessageNotResults) {
            this.renderer.removeChild(this.element.nativeElement, this.spanMessageNotResults);
        }
        if (data.length === 0) {
            let result = '';
            result = this.translateService.get('TABLE.EMPTY');
            if (this.table.quickFilter && this.table.oTableQuickFilterComponent &&
                this.table.oTableQuickFilterComponent.value && this.table.oTableQuickFilterComponent.value.length > 0) {
                result += this.translateService.get('TABLE.EMPTY_USING_FILTER', [(this.table.oTableQuickFilterComponent.value)]);
            }
            this.spanMessageNotResults = this.renderer.createElement('span');
            let messageNotResults = this.renderer.createText(result);
            this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
            this.renderer.appendChild(this.spanMessageNotResults, messageNotResults);
            this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
        }
    }
    updateColspanTd() {
        if (this.tdTableWithMessage) {
            this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
        }
    }
    destroy() {
        if (this.onContentChangeSubscription) {
            this.onContentChangeSubscription.unsubscribe();
        }
        if (this.onVisibleColumnsChangeSubscription) {
            this.onVisibleColumnsChangeSubscription.unsubscribe();
        }
    }
}
OTableExpandedFooterDirective.decorators = [
    { type: Directive, args: [{
                selector: '[oTableExpandedFooter]'
            },] }
];
OTableExpandedFooterDirective.ctorParameters = () => [
    { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(() => OTableComponent),] }] },
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1leHBhbmRlZC1mb290ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvZm9vdGVyL2V4cGFuZGVkL28tdGFibGUtZXhwYW5kZWQtZm9vdGVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzlHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUsvRCxNQUFNLE9BQU8sNkJBQTZCO0lBVXhDLFlBQ29ELEtBQXNCLEVBQ2pFLE9BQW1CLEVBQ2xCLFFBQW1CLEVBQ2pCLFFBQWtCO1FBSHNCLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBQ2pFLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRTVCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFHRCxlQUFlO1FBQ2IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENB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QUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDaEY7SUFDSCxDQUFDO0lBR0QsZUFBZTtRQUNiLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDakc7SUFDSCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQ3BDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoRDtRQUVELElBQUksSUFBSSxDQUFDLGtDQUFrQyxFQUFFO1lBQzNDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN2RDtJQUNILENBQUM7OztZQTlGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjthQUNuQzs7O1lBSlEsZUFBZSx1QkFnQm5CLE1BQU0sU0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO1lBcEJWLFVBQVU7WUFBZ0MsU0FBUztZQUFuQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdG9yLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBPVHJhbnNsYXRlU2VydmljZSB9IGZyb20gJy4uLy4uLy4uLy4uLy4uL3NlcnZpY2VzL3RyYW5zbGF0ZS9vLXRyYW5zbGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IE9UYWJsZUNvbXBvbmVudCB9IGZyb20gJy4vLi4vLi4vLi4vby10YWJsZS5jb21wb25lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbb1RhYmxlRXhwYW5kZWRGb290ZXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBPVGFibGVFeHBhbmRlZEZvb3RlckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIHByaXZhdGUgc3Bhbk1lc3NhZ2VOb3RSZXN1bHRzOiBhbnk7XG4gIHByaXZhdGUgdHJhbnNsYXRlU2VydmljZTogT1RyYW5zbGF0ZVNlcnZpY2U7XG4gIHByaXZhdGUgdGFibGVCb2R5OiBhbnk7XG4gIHByaXZhdGUgdGFibGVIZWFkZXI6IGFueTtcbiAgcHJpdmF0ZSB0ZFRhYmxlV2l0aE1lc3NhZ2U6IGFueTtcbiAgcHJpdmF0ZSBvbkNvbnRlbnRDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBvblZpc2libGVDb2x1bW5zQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9UYWJsZUNvbXBvbmVudCkpIHB1YmxpYyB0YWJsZTogT1RhYmxlQ29tcG9uZW50LFxuICAgIHB1YmxpYyBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcm90ZWN0ZWQgaW5qZWN0b3I6IEluamVjdG9yXG4gICkge1xuICAgIHRoaXMudHJhbnNsYXRlU2VydmljZSA9IHRoaXMuaW5qZWN0b3IuZ2V0KE9UcmFuc2xhdGVTZXJ2aWNlKTtcbiAgfVxuXG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzJdKSB7XG4gICAgICB0aGlzLnRhYmxlQm9keSA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV07XG4gICAgICB0aGlzLnRhYmxlSGVhZGVyID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1swXTtcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RlckNvbnRlbnRDaGFuZ2UoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzaWJsZUNvbHVtbnNDaGFuZ2UoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29udGVudENoYW5nZSgpIHtcbiAgICAvKiogQ3JlYXRlIGEgdHIgd2l0aCBhIHRkIGFuZCBpbnNpZGUgcHV0IHRoZSBtZXNzYWdlIGFuZCBhZGQgdG8gdGJvZHlcbiAgICAqIDx0cj48dGQ+PHNwYW4+IHttZXNzYWdlfTwvc3Bhbj48dGQ+PHRyPlxuICAgICovXG4gICAgbGV0IHRyID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCd0cicpO1xuICAgIHRoaXMudGRUYWJsZVdpdGhNZXNzYWdlID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModHIsICdvLXRhYmxlLW5vLXJlc3VsdHMnKTtcbiAgICB0ci5hcHBlbmRDaGlsZCh0aGlzLnRkVGFibGVXaXRoTWVzc2FnZSk7XG4gICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnRhYmxlQm9keSwgdHIpO1xuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnRhYmxlLm9uQ29udGVudENoYW5nZS5zdWJzY3JpYmUoKGRhdGEpID0+IHtcbiAgICAgIHNlbGYudXBkYXRlTWVzc2FnZU5vdFJlc3VsdHMoZGF0YSk7XG4gICAgICBzZWxmLnRhYmxlLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlZ2lzdGVyVmlzaWJsZUNvbHVtbnNDaGFuZ2UoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5vblZpc2libGVDb2x1bW5zQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy50YWJsZS5vblZpc2libGVDb2x1bW5zQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZUNvbHNwYW5UZCgpO1xuICAgIH0pO1xuXG4gIH1cblxuICB1cGRhdGVNZXNzYWdlTm90UmVzdWx0cyhkYXRhKSB7XG4gICAgLy8gcmVzZXQgc3BhbiBtZXNzYWdlXG4gICAgaWYgKHRoaXMuc3Bhbk1lc3NhZ2VOb3RSZXN1bHRzKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLnNwYW5NZXNzYWdlTm90UmVzdWx0cyk7XG4gICAgfVxuICAgIC8vZ2VuZXJhdGUgbmV3IG1lc3NhZ2VcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcblxuICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmdldCgnVEFCTEUuRU1QVFknKTtcbiAgICAgIGlmICh0aGlzLnRhYmxlLnF1aWNrRmlsdGVyICYmIHRoaXMudGFibGUub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQgJiZcbiAgICAgICAgdGhpcy50YWJsZS5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC52YWx1ZSAmJiB0aGlzLnRhYmxlLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50LnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ICs9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFLkVNUFRZX1VTSU5HX0ZJTFRFUicsIFsodGhpcy50YWJsZS5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC52YWx1ZSldKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc3Bhbk1lc3NhZ2VOb3RSZXN1bHRzID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsZXQgbWVzc2FnZU5vdFJlc3VsdHMgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZVRleHQocmVzdWx0KTtcbiAgICAgIHRoaXMudGRUYWJsZVdpdGhNZXNzYWdlLnNldEF0dHJpYnV0ZSgnY29sc3BhbicsIHRoaXMudGFibGVIZWFkZXIucXVlcnlTZWxlY3RvckFsbCgndGgnKS5sZW5ndGgpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnNwYW5NZXNzYWdlTm90UmVzdWx0cywgbWVzc2FnZU5vdFJlc3VsdHMpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZCh0aGlzLnRkVGFibGVXaXRoTWVzc2FnZSwgdGhpcy5zcGFuTWVzc2FnZU5vdFJlc3VsdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qIFVwZGF0ZSBjb2xzcGFuIGluIHRkIHRoYXQgc2hvdyBtZXNzYWdlIG5vdCByZXN1bHRzICovXG4gIHVwZGF0ZUNvbHNwYW5UZCgpIHtcbiAgICBpZiAodGhpcy50ZFRhYmxlV2l0aE1lc3NhZ2UpIHtcbiAgICAgIHRoaXMudGRUYWJsZVdpdGhNZXNzYWdlLnNldEF0dHJpYnV0ZSgnY29sc3BhbicsIHRoaXMudGFibGVIZWFkZXIucXVlcnlTZWxlY3RvckFsbCgndGgnKS5sZW5ndGgpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMub25Db250ZW50Q2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9uVmlzaWJsZUNvbHVtbnNDaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMub25WaXNpYmxlQ29sdW1uc0NoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19