import { Directive, ElementRef, forwardRef, Inject, Injector, Renderer2 } from '@angular/core';
import { OTranslateService } from '../../../../../services/translate/o-translate.service';
import { OTableComponent } from './../../../o-table.component';
var OTableExpandedFooterDirective = (function () {
    function OTableExpandedFooterDirective(table, element, renderer, injector) {
        this.table = table;
        this.element = element;
        this.renderer = renderer;
        this.injector = injector;
        this.translateService = this.injector.get(OTranslateService);
    }
    OTableExpandedFooterDirective.prototype.ngAfterViewInit = function () {
        if (this.element.nativeElement.childNodes[2]) {
            this.tableBody = this.element.nativeElement.childNodes[1];
            this.tableHeader = this.element.nativeElement.childNodes[0];
        }
        this.registerContentChange();
        this.registerVisibleColumnsChange();
    };
    OTableExpandedFooterDirective.prototype.registerContentChange = function () {
        var tr = this.renderer.createElement('tr');
        this.tdTableWithMessage = this.renderer.createElement('td');
        this.renderer.addClass(tr, 'o-table-no-results');
        tr.appendChild(this.tdTableWithMessage);
        this.renderer.appendChild(this.tableBody, tr);
        var self = this;
        this.onContentChangeSubscription = this.table.onContentChange.subscribe(function (data) {
            self.updateMessageNotResults(data);
            self.table.cd.detectChanges();
        });
    };
    OTableExpandedFooterDirective.prototype.registerVisibleColumnsChange = function () {
        var self = this;
        this.onVisibleColumnsChangeSubscription = this.table.onVisibleColumnsChange.subscribe(function () {
            self.updateColspanTd();
        });
    };
    OTableExpandedFooterDirective.prototype.updateMessageNotResults = function (data) {
        if (this.spanMessageNotResults) {
            this.renderer.removeChild(this.element.nativeElement, this.spanMessageNotResults);
        }
        if (data.length === 0) {
            var result = '';
            result = this.translateService.get('TABLE.EMPTY');
            if (this.table.quickFilter && this.table.oTableQuickFilterComponent &&
                this.table.oTableQuickFilterComponent.value && this.table.oTableQuickFilterComponent.value.length > 0) {
                result += this.translateService.get('TABLE.EMPTY_USING_FILTER', [(this.table.oTableQuickFilterComponent.value)]);
            }
            this.spanMessageNotResults = this.renderer.createElement('span');
            var messageNotResults = this.renderer.createText(result);
            this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
            this.renderer.appendChild(this.spanMessageNotResults, messageNotResults);
            this.renderer.appendChild(this.tdTableWithMessage, this.spanMessageNotResults);
        }
    };
    OTableExpandedFooterDirective.prototype.updateColspanTd = function () {
        if (this.tdTableWithMessage) {
            this.tdTableWithMessage.setAttribute('colspan', this.tableHeader.querySelectorAll('th').length);
        }
    };
    OTableExpandedFooterDirective.prototype.destroy = function () {
        if (this.onContentChangeSubscription) {
            this.onContentChangeSubscription.unsubscribe();
        }
        if (this.onVisibleColumnsChangeSubscription) {
            this.onVisibleColumnsChangeSubscription.unsubscribe();
        }
    };
    OTableExpandedFooterDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[oTableExpandedFooter]'
                },] }
    ];
    OTableExpandedFooterDirective.ctorParameters = function () { return [
        { type: OTableComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return OTableComponent; }),] }] },
        { type: ElementRef },
        { type: Renderer2 },
        { type: Injector }
    ]; };
    return OTableExpandedFooterDirective;
}());
export { OTableExpandedFooterDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby10YWJsZS1leHBhbmRlZC1mb290ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3RhYmxlL2V4dGVuc2lvbnMvZm9vdGVyL2V4cGFuZGVkL28tdGFibGUtZXhwYW5kZWQtZm9vdGVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWlCLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzlHLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVEQUF1RCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUUvRDtJQWFFLHVDQUNvRCxLQUFzQixFQUNqRSxPQUFtQixFQUNsQixRQUFtQixFQUNqQixRQUFrQjtRQUhzQixVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUNqRSxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ2xCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDakIsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUU1QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBR0QsdURBQWUsR0FBZjtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdEO1FB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SUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ2hGO0lBQ0gsQ0FBQztJQUdELHVEQUFlLEdBQWY7UUFDRSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pHO0lBQ0gsQ0FBQztJQUVELCtDQUFPLEdBQVA7UUFDRSxJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNwQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEQ7UUFFRCxJQUFJLElBQUksQ0FBQyxrQ0FBa0MsRUFBRTtZQUMzQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDdkQ7SUFDSCxDQUFDOztnQkE5RkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7aUJBQ25DOzs7Z0JBSlEsZUFBZSx1QkFnQm5CLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBZixDQUFlLENBQUM7Z0JBcEJWLFVBQVU7Z0JBQWdDLFNBQVM7Z0JBQW5CLFFBQVE7O0lBcUczRSxvQ0FBQztDQUFBLEFBL0ZELElBK0ZDO1NBNUZZLDZCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3RvciwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgT1RyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi8uLi8uLi9zZXJ2aWNlcy90cmFuc2xhdGUvby10cmFuc2xhdGUuc2VydmljZSc7XG5pbXBvcnQgeyBPVGFibGVDb21wb25lbnQgfSBmcm9tICcuLy4uLy4uLy4uL28tdGFibGUuY29tcG9uZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW29UYWJsZUV4cGFuZGVkRm9vdGVyXSdcbn0pXG5leHBvcnQgY2xhc3MgT1RhYmxlRXhwYW5kZWRGb290ZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcblxuICBwcml2YXRlIHNwYW5NZXNzYWdlTm90UmVzdWx0czogYW55O1xuICBwcml2YXRlIHRyYW5zbGF0ZVNlcnZpY2U6IE9UcmFuc2xhdGVTZXJ2aWNlO1xuICBwcml2YXRlIHRhYmxlQm9keTogYW55O1xuICBwcml2YXRlIHRhYmxlSGVhZGVyOiBhbnk7XG4gIHByaXZhdGUgdGRUYWJsZVdpdGhNZXNzYWdlOiBhbnk7XG4gIHByaXZhdGUgb25Db250ZW50Q2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgb25WaXNpYmxlQ29sdW1uc0NoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBPVGFibGVDb21wb25lbnQpKSBwdWJsaWMgdGFibGU6IE9UYWJsZUNvbXBvbmVudCxcbiAgICBwdWJsaWMgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJvdGVjdGVkIGluamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UgPSB0aGlzLmluamVjdG9yLmdldChPVHJhbnNsYXRlU2VydmljZSk7XG4gIH1cblxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1syXSkge1xuICAgICAgdGhpcy50YWJsZUJvZHkgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdO1xuICAgICAgdGhpcy50YWJsZUhlYWRlciA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMF07XG4gICAgfVxuICAgIHRoaXMucmVnaXN0ZXJDb250ZW50Q2hhbmdlKCk7XG4gICAgdGhpcy5yZWdpc3RlclZpc2libGVDb2x1bW5zQ2hhbmdlKCk7XG4gIH1cblxuICByZWdpc3RlckNvbnRlbnRDaGFuZ2UoKSB7XG4gICAgLyoqIENyZWF0ZSBhIHRyIHdpdGggYSB0ZCBhbmQgaW5zaWRlIHB1dCB0aGUgbWVzc2FnZSBhbmQgYWRkIHRvIHRib2R5XG4gICAgKiA8dHI+PHRkPjxzcGFuPiB7bWVzc2FnZX08L3NwYW4+PHRkPjx0cj5cbiAgICAqL1xuICAgIGxldCB0ciA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgndHInKTtcbiAgICB0aGlzLnRkVGFibGVXaXRoTWVzc2FnZSA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRyLCAnby10YWJsZS1uby1yZXN1bHRzJyk7XG4gICAgdHIuYXBwZW5kQ2hpbGQodGhpcy50ZFRhYmxlV2l0aE1lc3NhZ2UpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy50YWJsZUJvZHksIHRyKTtcblxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMub25Db250ZW50Q2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy50YWJsZS5vbkNvbnRlbnRDaGFuZ2Uuc3Vic2NyaWJlKChkYXRhKSA9PiB7XG4gICAgICBzZWxmLnVwZGF0ZU1lc3NhZ2VOb3RSZXN1bHRzKGRhdGEpO1xuICAgICAgc2VsZi50YWJsZS5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3RlclZpc2libGVDb2x1bW5zQ2hhbmdlKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIHRoaXMub25WaXNpYmxlQ29sdW1uc0NoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMudGFibGUub25WaXNpYmxlQ29sdW1uc0NoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgc2VsZi51cGRhdGVDb2xzcGFuVGQoKTtcbiAgICB9KTtcblxuICB9XG5cbiAgdXBkYXRlTWVzc2FnZU5vdFJlc3VsdHMoZGF0YSkge1xuICAgIC8vIHJlc2V0IHNwYW4gbWVzc2FnZVxuICAgIGlmICh0aGlzLnNwYW5NZXNzYWdlTm90UmVzdWx0cykge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgdGhpcy5zcGFuTWVzc2FnZU5vdFJlc3VsdHMpO1xuICAgIH1cbiAgICAvL2dlbmVyYXRlIG5ldyBtZXNzYWdlXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIGxldCByZXN1bHQgPSAnJztcbiAgICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlU2VydmljZS5nZXQoJ1RBQkxFLkVNUFRZJyk7XG4gICAgICBpZiAodGhpcy50YWJsZS5xdWlja0ZpbHRlciAmJiB0aGlzLnRhYmxlLm9UYWJsZVF1aWNrRmlsdGVyQ29tcG9uZW50ICYmXG4gICAgICAgIHRoaXMudGFibGUub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQudmFsdWUgJiYgdGhpcy50YWJsZS5vVGFibGVRdWlja0ZpbHRlckNvbXBvbmVudC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3VsdCArPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuZ2V0KCdUQUJMRS5FTVBUWV9VU0lOR19GSUxURVInLCBbKHRoaXMudGFibGUub1RhYmxlUXVpY2tGaWx0ZXJDb21wb25lbnQudmFsdWUpXSk7XG4gICAgICB9XG4gICAgICB0aGlzLnNwYW5NZXNzYWdlTm90UmVzdWx0cyA9IHRoaXMucmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGV0IG1lc3NhZ2VOb3RSZXN1bHRzID0gdGhpcy5yZW5kZXJlci5jcmVhdGVUZXh0KHJlc3VsdCk7XG4gICAgICB0aGlzLnRkVGFibGVXaXRoTWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCB0aGlzLnRhYmxlSGVhZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJykubGVuZ3RoKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5zcGFuTWVzc2FnZU5vdFJlc3VsdHMsIG1lc3NhZ2VOb3RSZXN1bHRzKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy50ZFRhYmxlV2l0aE1lc3NhZ2UsIHRoaXMuc3Bhbk1lc3NhZ2VOb3RSZXN1bHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiBVcGRhdGUgY29sc3BhbiBpbiB0ZCB0aGF0IHNob3cgbWVzc2FnZSBub3QgcmVzdWx0cyAqL1xuICB1cGRhdGVDb2xzcGFuVGQoKSB7XG4gICAgaWYgKHRoaXMudGRUYWJsZVdpdGhNZXNzYWdlKSB7XG4gICAgICB0aGlzLnRkVGFibGVXaXRoTWVzc2FnZS5zZXRBdHRyaWJ1dGUoJ2NvbHNwYW4nLCB0aGlzLnRhYmxlSGVhZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RoJykubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLm9uQ29udGVudENoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vblZpc2libGVDb2x1bW5zQ2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLm9uVmlzaWJsZUNvbHVtbnNDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==